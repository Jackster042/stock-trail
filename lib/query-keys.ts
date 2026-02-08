/**
 * Shared React Query key factories.
 *
 * These are intentionally kept in a plain (non-"use client") module so they
 * can be imported by both server components (for prefetching) and client
 * hooks without crossing the RSC / client boundary.
 */

// ── Watchlist ────────────────────────────────────────────────────────────────
export const watchlistKeys = {
  all: ["watchlist"] as const,
  list: () => [...watchlistKeys.all, "list"] as const,
  withData: () => [...watchlistKeys.all, "withData"] as const,
  detail: (symbol: string) =>
    [...watchlistKeys.all, "detail", symbol] as const,
};

// ── Stock Data ───────────────────────────────────────────────────────────────
export const stockKeys = {
  all: ["stock"] as const,
  detail: (symbol: string) =>
    [...stockKeys.all, "detail", symbol.toUpperCase()] as const,
  news: (symbol?: string) =>
    [...stockKeys.all, "news", symbol?.toUpperCase() || "general"] as const,
};

// ── Search ───────────────────────────────────────────────────────────────────
export const searchKeys = {
  all: ["search"] as const,
  query: (query: string) => [...searchKeys.all, query] as const,
};
