import { cache } from "react";
import { auth } from "./auth";
import { headers } from "next/headers";

/**
 * Cached session getter -- deduplicated within a single React Server Component render.
 * React's `cache()` memoizes the result per request, so multiple calls
 * to `getCachedSession()` in the same render tree only hit the auth
 * provider once.
 */
export const getCachedSession = cache(async () => {
  return auth.api.getSession({ headers: await headers() });
});
