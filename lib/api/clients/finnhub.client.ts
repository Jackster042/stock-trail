import { BaseAPIClient, APIError } from "./base.client";
import { finnhubRateLimiter } from "@/lib/utils/rate-limiter";
import { logger } from "@/lib/utils/logger";
import { cache } from "@/lib/cache/redis";
import { cacheKeys, cacheTTL } from "@/lib/cache/cache-keys";

const FINNHUB_BASE_URL = "https://finnhub.io/api/v1";

interface QuoteData {
  c?: number; // Current price
  d?: number; // Change
  dp?: number; // Change percent
  h?: number; // High
  l?: number; // Low
  o?: number; // Open
  pc?: number; // Previous close
  t?: number; // Timestamp
}

interface ProfileData {
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

interface FinancialsData {
  metric?: Record<string, number>;
  metricType?: string;
  series?: Record<string, unknown[]>;
}

interface RawNewsArticle {
  category?: string;
  datetime: number;
  headline: string;
  id: number;
  image?: string;
  related?: string;
  source: string;
  summary: string;
  url: string;
}

interface FinnhubSearchResponse {
  count: number;
  result: SearchResult[];
}

interface SearchResult {
  description: string;
  displaySymbol: string;
  symbol: string;
  type: string;
}

class FinnhubClient extends BaseAPIClient {
  private apiKey: string;
  private isConfigured: boolean;

  constructor(apiKey: string) {
    super({
      baseURL: FINNHUB_BASE_URL,
    });
    this.apiKey = apiKey;
    this.isConfigured = Boolean(apiKey && apiKey.trim().length > 0);

    if (!this.isConfigured) {
      logger.warn(
        "FINNHUB_API_KEY is not set or empty — all Finnhub API calls will fail. " +
        "Get a free API key at https://finnhub.io/dashboard"
      );
    }
  }

  /**
   * Guard that throws early if the API key is not configured,
   * preventing unnecessary network requests.
   */
  private ensureConfigured(): void {
    if (!this.isConfigured) {
      throw new APIError(
        "Finnhub API key is not configured. Set FINNHUB_API_KEY in your .env file.",
        401,
        "Missing API key"
      );
    }
  }

  async getQuote(symbol: string): Promise<QuoteData> {
    this.ensureConfigured();
    const upperSymbol = symbol.toUpperCase();
    const key = cacheKeys.stock.quote(upperSymbol);

    // Quotes change frequently -- short cache (60s)
    const cached = await cache.get<QuoteData>(key);
    if (cached) return cached;

    await finnhubRateLimiter.acquire();
    const data = await this.get<QuoteData>("/quote", {
      params: { symbol: upperSymbol, token: this.apiKey },
      next: { revalidate: 60 },
    });

    await cache.set(key, data, { ttl: cacheTTL.stock.quote });
    return data;
  }

  async getProfile(symbol: string): Promise<ProfileData> {
    this.ensureConfigured();
    const upperSymbol = symbol.toUpperCase();
    const key = cacheKeys.stock.profile(upperSymbol);

    // Profiles rarely change -- cache for 24h
    const cached = await cache.get<ProfileData>(key);
    if (cached) return cached;

    await finnhubRateLimiter.acquire();
    const data = await this.get<ProfileData>("/stock/profile2", {
      params: { symbol: upperSymbol, token: this.apiKey },
      next: { revalidate: 3600 },
    });

    await cache.set(key, data, { ttl: cacheTTL.stock.profile });
    return data;
  }

  async getFinancials(symbol: string): Promise<FinancialsData> {
    this.ensureConfigured();
    const upperSymbol = symbol.toUpperCase();
    const key = cacheKeys.stock.financials(upperSymbol);

    // Financials change infrequently -- cache for 1h
    const cached = await cache.get<FinancialsData>(key);
    if (cached) return cached;

    await finnhubRateLimiter.acquire();
    const data = await this.get<FinancialsData>("/stock/metric", {
      params: {
        symbol: upperSymbol,
        metric: "all",
        token: this.apiKey,
      },
      next: { revalidate: 1800 },
    });

    await cache.set(key, data, { ttl: cacheTTL.stock.financials });
    return data;
  }

  async search(query: string): Promise<FinnhubSearchResponse> {
    this.ensureConfigured();
    await finnhubRateLimiter.acquire();
    return this.get("/search", {
      params: { q: query, token: this.apiKey },
      next: { revalidate: 1800 },
    });
  }

  async getCompanyNews(
    symbol: string,
    from: string,
    to: string
  ): Promise<RawNewsArticle[]> {
    this.ensureConfigured();
    await finnhubRateLimiter.acquire();
    return this.get("/company-news", {
      params: {
        symbol: symbol.toUpperCase(),
        from,
        to,
        token: this.apiKey,
      },
      next: { revalidate: 300 },
    });
  }

  async getGeneralNews(): Promise<RawNewsArticle[]> {
    this.ensureConfigured();
    await finnhubRateLimiter.acquire();
    return this.get("/news", {
      params: { category: "general", token: this.apiKey },
      next: { revalidate: 300 },
    });
  }
}

export const finnhubClient = new FinnhubClient(process.env.FINNHUB_API_KEY!);

export type {
  QuoteData,
  ProfileData,
  FinancialsData,
  RawNewsArticle,
  FinnhubSearchResponse,
  SearchResult,
};
