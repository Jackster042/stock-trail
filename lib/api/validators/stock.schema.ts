import { z } from "zod";

export const QuoteSchema = z.object({
  c: z.number().optional(), // Current price
  d: z.number().optional(), // Change
  dp: z.number().optional(), // Change percent
  h: z.number().optional(), // High
  l: z.number().optional(), // Low
  o: z.number().optional(), // Open
  pc: z.number().optional(), // Previous close
  t: z.number().optional(), // Timestamp
});

export const ProfileSchema = z.object({
  country: z.string().optional(),
  currency: z.string().optional(),
  exchange: z.string().optional(),
  finnhubIndustry: z.string().optional(),
  ipo: z.string().optional(),
  logo: z.string().url().optional(),
  marketCapitalization: z.number().optional(),
  name: z.string().optional(),
  phone: z.string().optional(),
  shareOutstanding: z.number().optional(),
  ticker: z.string().optional(),
  weburl: z.string().url().optional(),
});

export const FinancialsSchema = z.object({
  metric: z.record(z.string(), z.number()).optional(),
  metricType: z.string().optional(),
  series: z.record(z.string(), z.array(z.any())).optional(),
});

export const NewsArticleSchema = z.object({
  category: z.string().optional(),
  datetime: z.number(),
  headline: z.string(),
  id: z.number(),
  image: z.string().url().optional(),
  related: z.string().optional(),
  source: z.string(),
  summary: z.string(),
  url: z.string().url(),
});

export const SearchResultSchema = z.object({
  description: z.string(),
  displaySymbol: z.string(),
  symbol: z.string(),
  type: z.string(),
});

export const SearchResponseSchema = z.object({
  count: z.number(),
  result: z.array(SearchResultSchema),
});

// Types inferred from schemas
export type QuoteData = z.infer<typeof QuoteSchema>;
export type ProfileData = z.infer<typeof ProfileSchema>;
export type FinancialsData = z.infer<typeof FinancialsSchema>;
export type NewsArticle = z.infer<typeof NewsArticleSchema>;
export type SearchResult = z.infer<typeof SearchResultSchema>;
export type SearchResponse = z.infer<typeof SearchResponseSchema>;
