"use server";

import { cache } from "react";
import { POPULAR_STOCK_SYMBOLS } from "../constants";
import {
  formatArticle,
  formatChangePercent,
  formatMarketCapValue,
  formatPrice,
  getDateRange,
  validateArticle,
} from "../utils";
import { auth } from "../better-auth/auth";
import { headers } from "next/headers";
import { getWatchlistSymbolsByEmail } from "./watchlist.actions";
import { finnhubClient } from "../api/clients/finnhub.client";
import { logger } from "../utils/logger";

interface FinnhubProfile {
  country?: string;
  currency?: string;
  exchange?: string;
  finnhubIndustry?: string;
  ipo?: string;
  logo?: string;
  marketCapitalization?: number;
  name?: string;
  phone?: string;
  shareOutstanding?: number;
  ticker?: string;
  weburl?: string;
}

interface FinnhubSearchResponse {
  count: number;
  result: FinnhubSearchResult[];
}

interface FinnhubSearchResult {
  description: string;
  displaySymbol: string;
  symbol: string;
  type: string;
}

interface FinnhubSearchResultExtended extends FinnhubSearchResult {
  __exchange?: string;
}

export async function getNews(
  symbols?: string[]
): Promise<MarketNewsArticle[]> {
  try {
    const range = getDateRange(5);
    const cleanSymbols = (symbols || [])
      .map((s) => s?.trim().toUpperCase())
      .filter((s): s is string => Boolean(s));

    const maxArticles = 6;

    if (cleanSymbols.length > 0) {
      const perSymbolArticles: Record<string, RawNewsArticle[]> = {};

      await Promise.all(
        cleanSymbols.map(async (sym) => {
          try {
            const articles = await finnhubClient.getCompanyNews(
              sym,
              range.from,
              range.to
            );
            perSymbolArticles[sym] = (articles || []).filter(validateArticle);
          } catch (error) {
            logger.error(`Failed to fetch news for ${sym}`, {
              error: error instanceof Error ? error.message : "Unknown error",
            });
            perSymbolArticles[sym] = [];
          }
        })
      );

      const collected: MarketNewsArticle[] = [];
      for (let round = 0; round < maxArticles; round++) {
        for (let i = 0; i < cleanSymbols.length; i++) {
          const sym = cleanSymbols[i];
          const list = perSymbolArticles[sym] || [];
          if (list.length === 0) continue;
          const article = list.shift();
          if (!article || !validateArticle(article)) continue;
          collected.push(formatArticle(article, true, sym, round));
          if (collected.length >= maxArticles) break;
        }
        if (collected.length >= maxArticles) break;
      }

      if (collected.length > 0) {
        collected.sort((a, b) => (b.datetime || 0) - (a.datetime || 0));
        return collected.slice(0, maxArticles);
      }
    }

    const general = await finnhubClient.getGeneralNews();

    const seen = new Set<string>();
    const unique: RawNewsArticle[] = [];
    for (const art of general || []) {
      if (!validateArticle(art)) continue;
      const key = `${art.id}-${art.url}-${art.headline}`;
      if (seen.has(key)) continue;
      seen.add(key);
      unique.push(art);
      if (unique.length >= 20) break;
    }

    const formatted = unique
      .slice(0, maxArticles)
      .map((a, idx) => formatArticle(a, false, undefined, idx));
    return formatted;
  } catch (error) {
    logger.error("Failed to fetch news", {
      error: error instanceof Error ? error.message : "Unknown error",
    });
    throw new Error("Failed to fetch news");
  }
}

export const searchStocks = cache(
  async (query?: string): Promise<StockWithWatchlistStatus[]> => {
    try {
      const session = await auth.api.getSession({ headers: await headers() });
      // Allow anonymous access - no redirect if not authenticated
      const userWatchlistSymbols = session?.user
        ? await getWatchlistSymbolsByEmail(session.user.email)
        : [];

      const trimmed = typeof query === "string" ? query.trim() : "";

      let results: FinnhubSearchResult[] = [];

      if (!trimmed) {
        // Reduce to 5 stocks to stay under rate limit (60 calls/minute on free tier)
        // This leaves room for other API calls (quotes, financials, etc.)
        const top = POPULAR_STOCK_SYMBOLS.slice(0, 5);
        const profiles = await Promise.all(
          top.map(async (sym) => {
            try {
              const profile = await finnhubClient.getProfile(sym);
              return { sym, profile };
            } catch (error) {
              logger.error(`Failed to fetch profile for ${sym}`, {
                error: error instanceof Error ? error.message : "Unknown error",
              });
              return { sym, profile: null as FinnhubProfile | null };
            }
          })
        );

        results = profiles
          .map(({ sym, profile }) => {
            const symbol = sym.toUpperCase();
            const name: string | undefined =
              profile?.name || profile?.ticker || undefined;
            const exchange: string | undefined = profile?.exchange || undefined;
            if (!name) return undefined;
            const r: FinnhubSearchResult = {
              symbol,
              description: name,
              displaySymbol: symbol,
              type: "Common Stock",
            };

            (r as FinnhubSearchResultExtended).__exchange = exchange;
            return r;
          })
          .filter((x): x is FinnhubSearchResult => Boolean(x));
      } else {
        const data = await finnhubClient.search(trimmed);
        results = Array.isArray(data?.result) ? data.result : [];
      }

      const mapped: StockWithWatchlistStatus[] = results
        .map((r) => {
          const upper = (r.symbol || "").toUpperCase();
          const name = r.description || upper;
          const exchangeFromProfile = (r as FinnhubSearchResultExtended)
            .__exchange as string | undefined;
          const exchange = exchangeFromProfile || "US";
          const type = r.type || "Stock";
          const item: StockWithWatchlistStatus = {
            symbol: upper,
            name,
            exchange,
            type,
            isInWatchlist: userWatchlistSymbols.includes(
              r.symbol.toUpperCase()
            ),
          };
          return item;
        })
        .slice(0, 15);

      return mapped;
   } catch (error) {
      logger.error("Failed to search stocks", {
        error: error instanceof Error ? error.message : "Unknown error",
      });
      return [];
    }
  }
);

export const getStockDetails = cache(async (symbol: string) => {
  const cleanSymbol = symbol.trim().toUpperCase();

  try {
    const [quote, profile, financials] = await Promise.all([
      finnhubClient.getQuote(cleanSymbol),
      finnhubClient.getProfile(cleanSymbol),
      finnhubClient.getFinancials(cleanSymbol),
    ]);

    const quoteData = quote as QuoteData;
    const profileData = profile as ProfileData;
    const financialsData = financials as FinancialsData;

    if (!quoteData?.c || !profileData?.name)
      throw new Error("Invalid stock data received from API");

    const changePercent = quoteData.dp || 0;
    const peRatio = financialsData?.metric?.peNormalizedAnnual || null;

    return {
      symbol: cleanSymbol,
      company: profileData?.name,
      currentPrice: quoteData.c,
      changePercent,
      priceFormatted: formatPrice(quoteData.c),
      changeFormatted: formatChangePercent(changePercent),
      peRatio: peRatio?.toFixed(1) || "—",
      marketCapFormatted: formatMarketCapValue(
        profileData?.marketCapitalization || 0
      ),
    };
  } catch (error) {
    logger.error("Failed to fetch stock details", {
      symbol: cleanSymbol,
      error: error instanceof Error ? error.message : "Unknown error",
    });
    throw new Error("Failed to fetch stock details");
  }
});
