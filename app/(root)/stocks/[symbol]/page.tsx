import TradingViewWidget from "@/components/TradingViewWidget";
import WatchlistButton from "@/components/WatchlistButton";
import { WatchListItem } from "@/database/models/watchlist.model";
import { getUserWatchlist } from "@/lib/actions/watchlist.actions";
import { getStockDetails } from "@/lib/actions/finnhub.actions";
import { getCachedSession } from "@/lib/better-auth/get-session";
import {
  BASELINE_WIDGET_CONFIG,
  CANDLE_CHART_WIDGET_CONFIG,
  COMPANY_FINANCIALS_WIDGET_CONFIG,
  COMPANY_PROFILE_WIDGET_CONFIG,
  SYMBOL_INFO_WIDGET_CONFIG,
  TECHNICAL_ANALYSIS_WIDGET_CONFIG,
} from "@/lib/constants";
import { stockKeys, watchlistKeys } from "@/lib/query-keys";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

export default async function StockDetails({ params }: StockDetailsPageProps) {
  const { symbol } = await params;
  const scriptUrl = `https://s3.tradingview.com/external-embedding/embed-widget-`;

  // Create a new QueryClient for server-side prefetching
  // Match staleTime with client provider to prevent immediate refetch after hydration
  const queryClient = new QueryClient({
    defaultOptions: { queries: { staleTime: 60 * 1000 } },
  });

  // Check if user is authenticated
  const session = await getCachedSession();
  const isAuthenticated = !!session?.user;

  // Only fetch watchlist for authenticated users
  let watchlist: WatchListItem[] = [];
  let isInWatchlist = false;

  // Parallelize independent fetches: watchlist + stock details run concurrently
  const stockDetailPromise = queryClient.prefetchQuery({
    queryKey: stockKeys.detail(symbol),
    queryFn: () => getStockDetails(symbol),
  });

  if (isAuthenticated) {
    try {
      // Use fetchQuery to both populate cache and get data in one call
      const [fetchedWatchlist] = await Promise.all([
        queryClient.fetchQuery({
          queryKey: watchlistKeys.list(),
          queryFn: getUserWatchlist,
        }),
        stockDetailPromise,
      ]);

      watchlist = fetchedWatchlist;
      isInWatchlist = watchlist.some(
        (item: WatchListItem) => item.symbol === symbol.toUpperCase()
      );
    } catch (error) {
      console.error("Failed to fetch watchlist:", error);
      // Still wait for stock details even if watchlist fails
      await stockDetailPromise;
    }
  } else {
    // Not authenticated -- just wait for stock details
    await stockDetailPromise;
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex min-h-screen p-4 md:p-6 lg:p-8">
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          {/* left column */}
          <div className="flex flex-col gap-6">
            <TradingViewWidget
              scriptUrl={`${scriptUrl}symbol-info.js`}
              config={SYMBOL_INFO_WIDGET_CONFIG(symbol)}
              height={170}
            />
            <TradingViewWidget
              scriptUrl={`${scriptUrl}advanced-chart.js`}
              config={CANDLE_CHART_WIDGET_CONFIG(symbol)}
              height={600}
            />
            <TradingViewWidget
              scriptUrl={`${scriptUrl}advanced-chart.js`}
              config={BASELINE_WIDGET_CONFIG(symbol)}
              height={600}
            />
          </div>
          {/* right column */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <WatchlistButton
                symbol={symbol.toUpperCase()}
                company={symbol.toUpperCase()}
                isInWatchlist={isInWatchlist}
                isAuthenticated={isAuthenticated}
                type="button"
              />
            </div>
            <TradingViewWidget
              scriptUrl={`${scriptUrl}technical-analysis.js`}
              config={TECHNICAL_ANALYSIS_WIDGET_CONFIG(symbol)}
              height={400}
            />
            <TradingViewWidget
              scriptUrl={`${scriptUrl}symbol-profile.js`}
              config={COMPANY_PROFILE_WIDGET_CONFIG(symbol)}
              height={440}
            />
            <TradingViewWidget
              scriptUrl={`${scriptUrl}financials.js`}
              config={COMPANY_FINANCIALS_WIDGET_CONFIG(symbol)}
              height={464}
            />
          </div>
        </section>
      </div>
    </HydrationBoundary>
  );
}
