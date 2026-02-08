"use client";

import { useQuery } from "@tanstack/react-query";
import { getStockDetails, getNews } from "@/lib/actions/finnhub.actions";
import { stockKeys } from "@/lib/query-keys";

// Re-export so existing client imports keep working
export { stockKeys } from "@/lib/query-keys";

/**
 * Hook to fetch stock details with React Query caching
 * @param symbol - Stock symbol
 */
export function useStockData(symbol: string) {
  return useQuery({
    queryKey: stockKeys.detail(symbol),
    queryFn: () => getStockDetails(symbol),
    staleTime: 60 * 1000, // 1 minute - stock prices change frequently
    gcTime: 5 * 60 * 1000, // 5 minutes garbage collection
    enabled: symbol.length > 0,
  });
}

/**
 * Hook to fetch news for specific symbols or general market news
 * @param symbols - Array of stock symbols (optional)
 */
export function useStockNews(symbols?: string[]) {
  return useQuery({
    queryKey: ["stock", "news", ...(symbols?.map((s) => s.toUpperCase()) || ["general"])],
    queryFn: () => getNews(symbols),
    staleTime: 5 * 60 * 1000, // 5 minutes - news doesn't change as frequently
    gcTime: 10 * 60 * 1000, // 10 minutes garbage collection
  });
}
