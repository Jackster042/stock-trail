"use server";

import { getStockDetails } from "@/lib/actions/finnhub.actions";
import { logger } from "@/lib/utils/logger";

/**
 * Prefetch stock data for a list of symbols.
 * Fetches all symbols in parallel with individual error handling
 * so one failure doesn't block the rest.
 */
export async function prefetchStockData(symbols: string[]): Promise<void> {
  if (symbols.length === 0) return;

  const uniqueSymbols = [...new Set(symbols.map((s) => s.trim().toUpperCase()))];

  await Promise.allSettled(
    uniqueSymbols.map(async (symbol) => {
      try {
        await getStockDetails(symbol);
      } catch (error) {
        logger.error(`Prefetch failed for ${symbol}`, {
          symbol,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    })
  );
}
