# StockTrail -- Initial Load Data Fetching Issues & Fix Plan

> **Date:** 2026-02-08
> **Scope:** All data fetching that occurs during initial page load across the app (SSR prefetch, client hydration, server actions, API calls, caching)

---

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Issues by Severity](#issues-by-severity)
  - [CRITICAL](#critical)
  - [HIGH](#high)
  - [MEDIUM](#medium)
  - [LOW](#low)
- [Recommended Fix Plan](#recommended-fix-plan)

---

## Architecture Overview

```
Client Component
    |
    +-- React Query Hook (lib/hooks/use-*.ts)
    |       |
    |       +-- Server Action ("use server" in lib/actions/)
    |               |
    |               +-- FinnhubClient (lib/api/clients/finnhub.client.ts)
    |               |       +-- Rate-limited via finnhubRateLimiter (60 req/min)
    |               |       +-- BaseAPIClient.request() -> fetch() to Finnhub REST API
    |               |
    |               +-- WatchlistRepository (lib/repositories/)
    |                       +-- Mongoose -> MongoDB
    |
Server Components (stock detail page, watchlist page)
    |
    +-- Direct Server Action calls for SSR/prefetch
    +-- QueryClient.prefetchQuery() -> HydrationBoundary
            (pre-fills React Query cache before hydration)
```

**Caching layers (fastest to slowest):**
1. React Query (client memory) -- 1-60 min stale times
2. Next.js fetch cache (`next: { revalidate: N }`) -- 60s to 3600s
3. Upstash Redis -- infrastructure exists but is **not wired into the primary flow**
4. Finnhub API (origin)

---

## Issues by Severity

---

### CRITICAL

#### C1. Duplicate API calls -- Watchlist page fetches everything twice

**File:** `app/(root)/watchlist/page.tsx:20-33`

Both `getWatchlistWithData()` and `searchStocks()` are called twice -- once via `prefetchQuery` to populate the QueryClient, then again directly to get values for the initial render. Since `getWatchlistWithData` is **not** wrapped in React's `cache()`, both invocations hit the database and Finnhub API independently.

```tsx
// Lines 20-23: First call (populates QueryClient)
await queryClient.prefetchQuery({
  queryKey: watchlistKeys.withData(),
  queryFn: getWatchlistWithData,
});

// Lines 26-29: Second call (populates QueryClient again)
await queryClient.prefetchQuery({
  queryKey: searchKeys.query("popular"),
  queryFn: () => searchStocks(),
});

// Lines 32-33: DUPLICATE -- calls the same functions again
const watchlist = await getWatchlistWithData();
const initialStocks = await searchStocks();
```

**Impact:** With 10 watchlist items, this doubles Finnhub API calls from ~30 to ~60, which can exhaust the 60/min free tier rate limit on a **single page load**.

**Fix:** Use `queryClient.fetchQuery()` instead of `prefetchQuery()`. `fetchQuery` both populates the cache AND returns the data, eliminating the need for the duplicate direct call.

---

#### C2. Duplicate API calls -- Stock detail page fetches watchlist twice

**File:** `app/(root)/stocks/[symbol]/page.tsx:42-47`

```tsx
// Lines 42-45: Prefetch into QueryClient
await queryClient.prefetchQuery({
  queryKey: watchlistKeys.list(),
  queryFn: getUserWatchlist,
});

// Line 47: Call again to get the value
watchlist = await getUserWatchlist();
```

`getUserWatchlist` is **not** wrapped in `cache()`, so this is two separate DB queries + two auth session checks per load.

**Fix:** Same as C1 -- use `fetchQuery` to get both cache population and return value in one call.

---

#### C3. N+1 API call pattern -- Watchlist fetches each stock individually

**File:** `lib/actions/watchlist.actions.ts:123-149`

```tsx
const stocksWithData = await Promise.all(
  watchlist.map(async (item) => {
    const stockData = await getStockDetails(item.symbol); // 3 API calls per stock
  })
);
```

`getStockDetails` (at `lib/actions/finnhub.actions.ts:216`) makes 3 parallel Finnhub calls (quote, profile, financials) **per stock**. For a 10-stock watchlist = **30 Finnhub API calls**. Combined with issue C1, that's 60 calls -- exactly the 60/min free tier limit.

**Impact:** The rate limiter forces sequential waiting once tokens are exhausted, causing the watchlist page to take 30-60+ seconds to load for users with 10+ stocks.

**Fix:** Wire up the Redis cache (`lib/cache/redis.ts`) for profile and financials data (which change infrequently). Only fetch quotes (which change frequently) from the API. Cache profiles for 24h and financials for 1h per the already-defined `cacheTTL` constants in `lib/cache/cache-keys.ts`.

---

#### C4. Rate limiter blocks all users under concurrent prefetch

**File:** `lib/utils/rate-limiter.ts:17-29`

```tsx
async acquire(): Promise<void> {
  this.refill();
  if (this.tokens >= 1) {
    this.tokens--;
    return;
  }
  const waitTime = this.calculateWaitTime();
  await this.sleep(waitTime);
  return this.acquire(); // recursive -- no depth guard
}
```

The rate limiter is an in-memory singleton shared across ALL users on the same server instance. When one user's watchlist page drains all 60 tokens, **every other user's request blocks** until tokens refill. The recursive `acquire()` has no depth guard (theoretical stack overflow risk under extreme contention).

**Fix:** Add a max retry/depth guard. Consider per-user or per-request rate awareness. Most importantly, reducing total API calls (fixes C1, C3) is the primary mitigation.

---

#### C5. Waterfall requests -- Stock detail page runs independent fetches sequentially

**File:** `app/(root)/stocks/[symbol]/page.tsx:32-60`

```tsx
// Step 1: Await session (line 32)
const session = await auth.api.getSession({ headers: await headers() });

// Step 2: Await watchlist prefetch (lines 42-45) -- waits for step 1 to finish
await queryClient.prefetchQuery({ queryKey: watchlistKeys.list(), queryFn: getUserWatchlist });

// Step 3: Await watchlist again (line 47) -- waits for step 2 to finish
watchlist = await getUserWatchlist();

// Step 4: Await stock details prefetch (lines 57-60) -- waits for step 3 to finish
await queryClient.prefetchQuery({ queryKey: stockKeys.detail(symbol), queryFn: ... });
```

Steps 2-3 (watchlist) and step 4 (stock details) have **no data dependency** on each other, yet they run sequentially. Stock details prefetch waits for the entire watchlist flow to finish.

**Fix:** Parallelize the independent prefetches with `Promise.all`:
```tsx
const [watchlist] = await Promise.all([
  queryClient.fetchQuery({ queryKey: watchlistKeys.list(), queryFn: getUserWatchlist }),
  queryClient.prefetchQuery({ queryKey: stockKeys.detail(symbol), queryFn: () => getStockDetails(symbol) }),
]);
```

---

#### C6. Waterfall requests -- Watchlist page runs independent prefetches sequentially

**File:** `app/(root)/watchlist/page.tsx:20-29`

```tsx
await queryClient.prefetchQuery({ queryKey: watchlistKeys.withData(), queryFn: getWatchlistWithData });
// This waits for the above to finish before starting:
await queryClient.prefetchQuery({ queryKey: searchKeys.query("popular"), queryFn: () => searchStocks() });
```

These two have no dependency on each other but run sequentially. The search prefetch waits for the entire watchlist N+1 fetch to complete.

**Fix:** Wrap in `Promise.all`.

---

### HIGH

#### H1. No `error.tsx` boundaries -- entire page crashes on API failure

**Affected routes:** `app/(root)/`, `app/(root)/stocks/[symbol]/`, `app/(root)/watchlist/`

No `error.tsx` files exist anywhere in the app. If `getStockDetails` throws (line 249) or `getWatchlistWithData` throws (line 158), the entire page crashes with Next.js's default error page. No recovery UI is available.

**Impact:** A single Finnhub API outage or rate limit hit renders the entire page unusable.

**Fix:** Add `error.tsx` files to each route segment with appropriate error UI and retry functionality.

---

#### H2. No `loading.tsx` or `<Suspense>` boundaries -- blank screen during data fetch

**Affected routes:** All routes

No `loading.tsx` files or `<Suspense>` boundaries exist. Since all data fetching happens in server components before render, users see **nothing** until all API calls complete. With the waterfall + N+1 issues, this could be 10+ seconds of blank screen.

**Fix:** Add `loading.tsx` files with skeleton UI to critical routes (`/watchlist`, `/stocks/[symbol]`).

---

#### H3. `redirect()` swallowed by try/catch -- auth redirects broken

**File:** `lib/actions/watchlist.actions.ts` -- lines 42, 67-73, 79, 88-94, 101, 105-111, 117, 152-158

Next.js `redirect()` works by throwing a special `NEXT_REDIRECT` error. The `catch` blocks in `getUserWatchlist`, `getWatchlistWithData`, `addToWatchlist`, and `removeFromWatchlist` catch this error and rethrow a generic one, **preventing the redirect from working**.

```tsx
// Example at getUserWatchlist (lines 97-112):
export async function getUserWatchlist() {
  let session = null;
  try {
    session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) redirect("/sign-in"); // throws NEXT_REDIRECT

    // ...
  } catch (error) {
    // This catches the redirect error too!
    logger.error("Failed to fetch user watchlist", { ... });
    throw new Error("Failed to fetch user watchlist"); // generic error, redirect lost
  }
}
```

**Impact:** Unauthenticated users see an error instead of being redirected to sign-in.

**Fix:** Use `isRedirectError` from `next/navigation` in catch blocks:
```tsx
import { isRedirectError } from "next/dist/client/components/redirect-error";

catch (error) {
  if (isRedirectError(error)) throw error; // re-throw redirect
  // ... handle actual errors
}
```

---

#### H4. Auth check bypassed in watchlist page prefetch

**File:** `app/(root)/watchlist/page.tsx:20-23`

`getWatchlistWithData` is called inside `prefetchQuery`'s `queryFn`. `prefetchQuery` **silently swallows errors** (stores them as query errors, doesn't re-throw). So the `redirect("/sign-in")` inside `getWatchlistWithData` never actually executes as a redirect -- it's caught and discarded.

**Fix:** Check authentication before calling `prefetchQuery`, or use `fetchQuery` (which does throw).

---

#### H5. `SearchCommand` bypasses React Query -- direct server action calls

**File:** `components/SearchCommand.tsx:10, 34`

```tsx
import { searchStocks } from "@/lib/actions/finnhub.actions";

const performSearch = useCallback(async (query: string) => {
  const result = await searchStocks(query.trim()); // Direct server action call
  setStocks(result);
}, []);
```

The component calls `searchStocks` directly instead of using the `useSearchStocks` or `usePopularStocks` React Query hooks. This means:
- No client-side caching of search results
- No deduplication if the same query is searched again
- Prefetched `searchKeys.query("popular")` data from the watchlist page is **never used** by this component
- Every dialog open triggers a fresh `searchStocks("")` call (line 64)

**Fix:** Refactor to use the existing `useSearchStocks` and `usePopularStocks` hooks.

---

#### H6. `stock-data.service.ts` is broken stub code

**File:** `lib/services/stock-data.service.ts:92-107`

```tsx
private async getFromCache(symbol: string): Promise<StockData | null> {
  return null; // Always misses cache
}

private async setCache(symbol: string, data: StockData): Promise<void> {
  // No-op
}

async function fetchStockFromAPI(symbol: string): Promise<StockData> {
  return {}; // Returns empty object -- no real data
}
```

The `StockDataService` has stub implementations that always return empty data. The prefetch module (`lib/prefetch/stock-prefetch.ts:3`) imports from this file, meaning **all prefetch operations return empty data**.

**Fix:** Either wire up the real `finnhubClient` in this service, or remove the dead code and update `stock-prefetch.ts` to use `getStockDetails` from `finnhub.actions.ts`.

---

#### H7. Silent DB connection failure returns null

**File:** `database/mongoose.ts:27-34`

```tsx
try {
  cached.conn = await cached.promise;
} catch (error) {
  // Error is silently swallowed -- no logging, no re-throw
  cached.promise = null;
}

return cached.conn; // Returns null if connection failed
```

If MongoDB connection fails, the error is silently swallowed. `cached.conn` remains `null`. Downstream callers (e.g., `watchlistRepository`) call `await dbConnect()` for the side-effect of establishing connection, then use Mongoose models directly -- which fail with confusing "buffering timed out" errors.

**Fix:** Log the error and re-throw it so callers get a clear connection failure:
```tsx
} catch (error) {
  cached.promise = null;
  logger.error("MongoDB connection failed", { error });
  throw error;
}
```

---

#### H8. Unhandled promise rejection in prefetch module

**File:** `lib/prefetch/stock-prefetch.ts:28-34`

```tsx
// Fetch in background (don't await)
Promise.all(
  symbols.map(symbol =>
    getStockDetails(symbol).catch(() => {
      // Silently fail prefetch
    })
  )
);
```

`Promise.all` is neither awaited nor caught. Module-level mutable state (`prefetchQueue`, `prefetchTimeout`) won't persist in serverless environments. This entire module is also using the broken `stock-data.service.ts` (see H6).

**Fix:** Proper error handling + fix the import to use working `getStockDetails`.

---

### MEDIUM

#### M1. Server QueryClient `staleTime: 0` causes immediate refetch after hydration

**Files:** `app/(root)/stocks/[symbol]/page.tsx:29`, `app/(root)/watchlist/page.tsx:17`

```tsx
const queryClient = new QueryClient(); // Default staleTime: 0
```

The server creates a `QueryClient` with default `staleTime: 0`, but the client `ReactQueryProvider` (`lib/providers/react-query-provider.tsx:18`) sets `staleTime: 60_000`. During dehydration, data is marked as immediately stale. On hydration, React Query **refetches everything** because it sees stale data -- defeating the purpose of SSR prefetching.

**Fix:** Configure the server-side `QueryClient` with matching `staleTime`:
```tsx
const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 60 * 1000 } },
});
```

---

#### M2. Redundant session fetches -- 3-4 lookups per page load

**Files:**
- `app/(root)/layout.tsx:8` -- session for Header
- `app/(root)/stocks/[symbol]/page.tsx:32` -- session for auth check
- `lib/actions/watchlist.actions.ts:100` -- `getUserWatchlist` fetches session
- `lib/actions/finnhub.actions.ts:130` -- `searchStocks` fetches session

Each `auth.api.getSession({ headers: await headers() })` may hit the database. If it does, this is 3-4 redundant auth lookups per page load.

**Fix:** Pass the session down from layout/page to server actions where possible, or wrap `getSession` with React's `cache()`.

---

#### M3. Error handler makes redundant session call that can also fail

**File:** `lib/actions/watchlist.actions.ts:153`

```tsx
} catch (error) {
  const errorSession = await auth.api.getSession({ headers: await headers() });
  logger.error("Failed to fetch watchlist with data", {
    userId: errorSession?.user?.id,
```

In the error handler, the code makes another auth session call just to log the `userId`. If the original error was caused by auth issues, this second call could also fail, creating a nested unhandled error.

**Fix:** Capture `session.user.id` before the try/catch and use it in the error handler.

---

#### M4. Redis client crashes if env vars are missing

**File:** `lib/cache/redis.ts:3-6`

```tsx
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});
```

Non-null assertions (`!`) pass `undefined` to the Redis constructor if env vars aren't set. This crashes at module load time. The `Cache` class methods have try/catch (suggesting graceful degradation was intended), but the constructor itself will throw.

**Fix:** Guard the Redis client creation:
```tsx
const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  ? new Redis({ url: process.env.UPSTASH_REDIS_REST_URL, token: process.env.UPSTASH_REDIS_REST_TOKEN })
  : null;
```

---

#### M5. Popular stocks fetch fires 5 parallel profile API calls

**File:** `lib/actions/finnhub.actions.ts:143-156`

5 parallel `getProfile` calls fire simultaneously, each acquiring a rate limiter token. Combined with other API calls on the same page (especially the N+1 watchlist pattern), this contributes to rate limit exhaustion.

**Fix:** Cache popular stock profiles in Redis (they change very infrequently -- once per 24h is sufficient).

---

#### M6. `WatchlistButton` optimistic update desyncs with debounced API call

**File:** `components/WatchlistButton.tsx:90-91`

```tsx
setAdded(!added); // Optimistic update immediately
debounceToggle(); // Actual API call is debounced by 500ms
```

If the user clicks rapidly, `setAdded` fires immediately on each click (toggling back and forth), but `debounceToggle` only fires once after 500ms of inactivity. Fast double-clicks result in one API call but two visual toggles -- leaving the UI in the wrong state.

**Fix:** Remove the debounce from the toggle. Use the mutation's `isPending` state to disable the button during the API call instead.

---

#### M7. `handleWatchlistChange` in SearchCommand uses stale `initialStocks`

**File:** `components/SearchCommand.tsx:95-103`

```tsx
const handleWatchlistChange = async (symbol: string, isAdded: boolean) => {
  setStocks(
    initialStocks?.map((stock) =>  // Bug: uses initialStocks, not current stocks
      stock.symbol === symbol
        ? { ...stock, isInWatchlist: isAdded }
        : stock || []  // `stock || []` is also a logic error -- stock is always truthy
    )
  );
};
```

This maps over `initialStocks` (the prop) instead of the current `stocks` state. If the user has searched and has different results displayed, updating the watchlist replaces the search results with the initial stocks list.

**Fix:** Change `initialStocks?.map(...)` to `stocks?.map(...)`. Remove `|| []` on line 100.

---

#### M8. Cache infrastructure defined but never used (dead code)

**Files:** `lib/cache/redis.ts`, `lib/cache/cache-keys.ts`

The `Cache` class and `cacheKeys`/`cacheTTL` constants are fully defined but **never imported or used** in the data-fetching code. The Finnhub client relies only on Next.js `fetch` `revalidate` headers.

**Impact:** No server-side cache between the application and Finnhub. Every SSR hits the API directly.

**Fix:** Wire Redis caching into `FinnhubClient` or the server actions for profile/financials data.

---

#### M9. Module-level mutable state in `"use server"` file

**File:** `lib/prefetch/stock-prefetch.ts:5-6`

```tsx
const prefetchQueue: Set<string> = new Set();
let prefetchTimeout: NodeJS.Timeout | null = null;
```

In serverless environments, module-level state won't persist across invocations. In long-running servers, it persists across requests/users, which could cause batching across different users.

**Fix:** This module needs a complete rethink (see H6, H8). Either remove it or redesign without module-level state.

---

### LOW

#### L1. News query key only includes first symbol

**File:** `lib/hooks/use-stock-data.ts:33`

```tsx
queryKey: stockKeys.news(symbols?.[0]),
queryFn: () => getNews(symbols),
```

The key only includes `symbols?.[0]`, but the function uses the full array. Two calls with `["AAPL", "GOOG"]` and `["AAPL", "MSFT"]` share the same cache key, returning stale data.

**Fix:** Include all symbols in the key: `queryKey: ["stock", "news", ...(symbols || ["general"])]`

---

#### L2. `gcTime` shorter than `staleTime` in search hooks

**File:** `lib/hooks/use-search-stocks.ts:22-23`

```tsx
staleTime: 60 * 60 * 1000, // 1 hour
gcTime: 30 * 60 * 1000, // 30 minutes
```

Data gets garbage collected (30 min) before it would become stale (1 hour). Technically valid but likely unintentional -- the `staleTime` is effectively capped at 30 minutes.

**Fix:** Set `gcTime` >= `staleTime` (e.g., `gcTime: 60 * 60 * 1000`).

---

#### L3. No request timeout on Finnhub API calls

**File:** `lib/api/clients/base.client.ts:34`

The `BaseAPIClient` accepts a `timeout` in its config interface but **never uses it**. No `AbortController` or timeout mechanism exists. If Finnhub is slow, all prefetch calls hang indefinitely, blocking page rendering.

**Fix:** Implement `AbortController` with configurable timeout:
```tsx
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), config.timeout || 10000);
const response = await fetch(url.toString(), { ...options, signal: controller.signal });
clearTimeout(timeoutId);
```

---

#### L4. `refetchOnWindowFocus: true` causes unnecessary refetches after hydration

**File:** `lib/providers/react-query-provider.tsx:22`

Combined with the staleTime mismatch (M1), when prefetched data is immediately stale, any tab focus triggers refetches for all active queries. Aggressive for a stock app where users frequently switch tabs.

**Fix:** After fixing M1, this becomes less impactful. Optionally set to `false` or use a longer `staleTime` for non-price data.

---

## Recommended Fix Plan

### Phase 1: Eliminate Duplicate API Calls & Fix Sequential Fetching
**Impact: HIGH | Effort: LOW**
**Issues addressed: C1, C2, C5, C6, M1**

1. **Watchlist page (`app/(root)/watchlist/page.tsx`):**
   - Replace `prefetchQuery` + direct calls with `fetchQuery` (returns data AND populates cache)
   - Wrap the two `fetchQuery` calls in `Promise.all`
   - Configure server `QueryClient` with `staleTime: 60 * 1000`

2. **Stock detail page (`app/(root)/stocks/[symbol]/page.tsx`):**
   - Replace `prefetchQuery` + direct call for watchlist with `fetchQuery`
   - Parallelize watchlist fetch and stock details prefetch with `Promise.all`
   - Configure server `QueryClient` with `staleTime: 60 * 1000`

### Phase 2: Fix Broken Auth Redirects
**Impact: HIGH | Effort: LOW**
**Issues addressed: H3, H4**

1. Add `isRedirectError` check in all catch blocks in `lib/actions/watchlist.actions.ts`
2. Add auth check before `prefetchQuery` / `fetchQuery` on the watchlist page
3. Move `redirect()` calls outside try/catch where possible

### Phase 3: Add Error & Loading Boundaries
**Impact: HIGH | Effort: LOW**
**Issues addressed: H1, H2**

1. Add `error.tsx` to:
   - `app/(root)/stocks/[symbol]/error.tsx`
   - `app/(root)/watchlist/error.tsx`
   - `app/(root)/error.tsx`
2. Add `loading.tsx` with skeleton UI to:
   - `app/(root)/stocks/[symbol]/loading.tsx`
   - `app/(root)/watchlist/loading.tsx`

### Phase 4: Wire Up Redis Cache to Reduce API Calls
**Impact: HIGH | Effort: MEDIUM**
**Issues addressed: C3, C4, M5, M8**

1. Fix Redis client creation with env var guards (`lib/cache/redis.ts`)
2. Add Redis caching to `FinnhubClient` methods:
   - `getProfile()` -- cache for 24h (rarely changes)
   - `getFinancials()` -- cache for 1h
   - `getQuote()` -- cache for 60s
3. Use already-defined `cacheKeys` and `cacheTTL` from `lib/cache/cache-keys.ts`
4. This reduces the N+1 impact from 30 API calls to ~10 (only quotes hit the API)

### Phase 5: Fix SearchCommand Component
**Impact: MEDIUM | Effort: MEDIUM**
**Issues addressed: H5, M7**

1. Refactor `SearchCommand` to use `usePopularStocks` and `useSearchStocks` hooks
2. Fix `handleWatchlistChange` to use current `stocks` state instead of `initialStocks`
3. Remove the `|| []` logic error on line 100

### Phase 6: Fix WatchlistButton Desync
**Impact: MEDIUM | Effort: LOW**
**Issues addressed: M6**

1. Remove debounce from the toggle function
2. Use mutation's `isPending` state to disable the button during the API call
3. Let the mutation's `onSuccess`/`onError` handle state updates

### Phase 7: Fix DB Connection & Error Handling
**Impact: MEDIUM | Effort: LOW**
**Issues addressed: H7, M3, M4**

1. Fix `database/mongoose.ts` to log and re-throw connection errors
2. Fix error handler in `getWatchlistWithData` to not make redundant session calls
3. Guard Redis client creation against missing env vars

### Phase 8: Clean Up Dead/Broken Code
**Impact: LOW | Effort: LOW**
**Issues addressed: H6, H8, M9**

1. Remove or fix `lib/services/stock-data.service.ts` (stub implementations)
2. Fix `lib/prefetch/stock-prefetch.ts` to import from working `finnhub.actions.ts`
3. Remove module-level mutable state, or redesign the prefetch mechanism

### Phase 9: Fix Remaining Low-Priority Issues
**Impact: LOW | Effort: LOW**
**Issues addressed: L1, L2, L3, L4, M2**

1. Fix news query key to include all symbols
2. Fix `gcTime` >= `staleTime` in search hooks
3. Implement request timeout with `AbortController` in `BaseAPIClient`
4. Reduce redundant session fetches (wrap `getSession` with React `cache()`)

---

## Summary Table

| # | Severity | Category | File | Issue |
|---|----------|----------|------|-------|
| C1 | CRITICAL | Duplicate calls | `watchlist/page.tsx:20-33` | `getWatchlistWithData` + `searchStocks` called twice |
| C2 | CRITICAL | Duplicate calls | `stocks/[symbol]/page.tsx:42-47` | `getUserWatchlist` called twice |
| C3 | CRITICAL | N+1 pattern | `watchlist.actions.ts:123-149` | 3 API calls per watchlist item |
| C4 | CRITICAL | Rate limiter | `rate-limiter.ts:17-29` | Global limiter blocks concurrent users |
| C5 | CRITICAL | Waterfall | `stocks/[symbol]/page.tsx:32-60` | Sequential fetches that could be parallel |
| C6 | CRITICAL | Waterfall | `watchlist/page.tsx:20-29` | Sequential prefetches with no dependency |
| H1 | HIGH | Error handling | All routes | No `error.tsx` boundaries |
| H2 | HIGH | Loading states | All routes | No `loading.tsx` or `<Suspense>` |
| H3 | HIGH | Auth redirect | `watchlist.actions.ts:42,79,101,117` | `redirect()` caught by try/catch |
| H4 | HIGH | Auth bypass | `watchlist/page.tsx:20-23` | `prefetchQuery` swallows redirect errors |
| H5 | HIGH | Cache bypass | `SearchCommand.tsx:10,34` | Direct server action calls bypass React Query |
| H6 | HIGH | Dead code | `stock-data.service.ts:92-107` | Stub implementations return empty data |
| H7 | HIGH | Error handling | `mongoose.ts:27-34` | Silent DB connection failure returns null |
| H8 | HIGH | Unhandled promise | `stock-prefetch.ts:28-34` | Fire-and-forget `Promise.all` |
| M1 | MEDIUM | Stale data | Pages + provider | Server `staleTime:0` causes immediate refetch |
| M2 | MEDIUM | Redundant calls | Layout + pages + actions | 3-4 session lookups per page load |
| M3 | MEDIUM | Error handling | `watchlist.actions.ts:153` | Error handler makes redundant session call |
| M4 | MEDIUM | Cold start | `redis.ts:3-6` | Crashes if env vars missing |
| M5 | MEDIUM | Rate limiting | `finnhub.actions.ts:143-156` | 5 parallel profile calls for popular stocks |
| M6 | MEDIUM | Race condition | `WatchlistButton.tsx:90-91` | Debounced toggle + optimistic update desync |
| M7 | MEDIUM | State bug | `SearchCommand.tsx:95-103` | `handleWatchlistChange` uses stale `initialStocks` |
| M8 | MEDIUM | Dead code | `redis.ts`, `cache-keys.ts` | Cache infra defined but never used |
| M9 | MEDIUM | Serverless | `stock-prefetch.ts:5-6` | Module-level state in `"use server"` file |
| L1 | LOW | Cache key | `use-stock-data.ts:33` | News query key only includes first symbol |
| L2 | LOW | Config | `use-search-stocks.ts:22-23` | `gcTime` < `staleTime` |
| L3 | LOW | Timeout | `base.client.ts:34` | No request timeout implemented |
| L4 | LOW | Config | `react-query-provider.tsx:22` | `refetchOnWindowFocus` + stale hydration |
