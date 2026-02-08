"use client";

import { useQuery } from "@tanstack/react-query";
import { searchStocks } from "@/lib/actions/finnhub.actions";
import { searchKeys } from "@/lib/query-keys";

// Re-export so existing client imports keep working
export { searchKeys } from "@/lib/query-keys";

/**
 * Hook to search stocks with React Query caching
 * @param query - Search query string
 * @param enabled - Whether to enable the query (e.g., when search is not empty)
 */
export function useSearchStocks(query: string, enabled: boolean = true) {
  return useQuery({
    queryKey: searchKeys.query(query),
    queryFn: () => searchStocks(query),
    enabled: enabled && query.trim().length > 0,
    staleTime: 60 * 60 * 1000, // 1 hour - search results don't change often
    gcTime: 60 * 60 * 1000, // 1 hour - must be >= staleTime
  });
}

/**
 * Hook to get popular stocks (empty search)
 */
export function usePopularStocks(enabled: boolean = true) {
  return useQuery({
    queryKey: searchKeys.query("popular"),
    queryFn: () => searchStocks(),
    enabled,
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 60 * 60 * 1000, // 1 hour - must be >= staleTime
  });
}
