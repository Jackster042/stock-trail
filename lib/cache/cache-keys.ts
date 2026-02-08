export const cacheKeys = {
  stock: {
    quote: (symbol: string) => `stock:quote:${symbol.toUpperCase()}`,
    profile: (symbol: string) => `stock:profile:${symbol.toUpperCase()}`,
    financials: (symbol: string) => `stock:financials:${symbol.toUpperCase()}`,
  },
  news: {
    general: () => "news:general",
    bySymbol: (symbol: string) => `news:symbol:${symbol.toUpperCase()}`,
  },
  search: {
    results: (query: string) => `search:${query.toLowerCase()}`,
  },
  watchlist: {
    data: (userId: string) => `watchlist:data:${userId}`,
  },
};

export const cacheTTL = {
  stock: {
    quote: 60,        // 1 minute
    profile: 86400,   // 24 hours
    financials: 3600, // 1 hour
  },
  news: {
    general: 1800,    // 30 minutes
    bySymbol: 300,    // 5 minutes
  },
  search: {
    results: 3600,    // 1 hour
  },
  watchlist: {
    data: 60,         // 1 minute
  },
};
