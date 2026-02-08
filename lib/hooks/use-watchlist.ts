"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getUserWatchlist,
  getWatchlistWithData,
  addToWatchlist,
  removeFromWatchlist,
} from "@/lib/actions/watchlist.actions";
import { watchlistKeys } from "@/lib/query-keys";

// Re-export so existing client imports keep working
export { watchlistKeys } from "@/lib/query-keys";

/**
 * Hook to fetch user's watchlist (basic list)
 */
export function useWatchlist() {
  return useQuery({
    queryKey: watchlistKeys.list(),
    queryFn: getUserWatchlist,
    staleTime: 60 * 1000, // 1 minute
  });
}

/**
 * Hook to fetch watchlist with stock data
 */
export function useWatchlistWithData() {
  return useQuery({
    queryKey: watchlistKeys.withData(),
    queryFn: getWatchlistWithData,
    staleTime: 60 * 1000, // 1 minute
  });
}

/**
 * Hook for adding a stock to watchlist
 */
export function useAddToWatchlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ symbol, company }: { symbol: string; company: string }) =>
      addToWatchlist(symbol, company),
    onSuccess: () => {
      // Invalidate both watchlist queries
      queryClient.invalidateQueries({ queryKey: watchlistKeys.list() });
      queryClient.invalidateQueries({ queryKey: watchlistKeys.withData() });
    },
  });
}

/**
 * Hook for removing a stock from watchlist
 */
export function useRemoveFromWatchlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (symbol: string) => removeFromWatchlist(symbol),
    onSuccess: () => {
      // Invalidate both watchlist queries
      queryClient.invalidateQueries({ queryKey: watchlistKeys.list() });
      queryClient.invalidateQueries({ queryKey: watchlistKeys.withData() });
    },
  });
}
