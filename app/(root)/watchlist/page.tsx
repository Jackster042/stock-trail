import SearchCommand from "@/components/SearchCommand";
import { WatchlistTable } from "@/components/WatchlistTable";
import { getWatchlistWithData } from "@/lib/actions/watchlist.actions";
import { searchStocks } from "@/lib/actions/finnhub.actions";
import { watchlistKeys, searchKeys } from "@/lib/query-keys";
import { Star } from "lucide-react";
import React from "react";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

const WatchlistComponent = async () => {
  // Create a new QueryClient for server-side prefetching
  // Match staleTime with client provider to prevent immediate refetch after hydration
  const queryClient = new QueryClient({
    defaultOptions: { queries: { staleTime: 60 * 1000 } },
  });

  // Use fetchQuery (returns data AND populates cache) instead of prefetchQuery + direct call.
  // Wrap in Promise.all to parallelize independent fetches.
  const [watchlist, initialStocks] = await Promise.all([
    queryClient.fetchQuery({
      queryKey: watchlistKeys.withData(),
      queryFn: getWatchlistWithData,
    }),
    queryClient.fetchQuery({
      queryKey: searchKeys.query("popular"),
      queryFn: () => searchStocks(),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {watchlist.length === 0 ? (
        <section className="flex watchlist-empty-container">
          <div className="watchlist-empty">
            <Star className="watchlist-star" />
            <h2 className="empty-title">Your watchlist is empty</h2>
            <p className="empty-description">
              Start building your watchlist by searching for stocks and clicking
              the star icon to add them.
            </p>
          </div>
          <SearchCommand initialStocks={initialStocks} />
        </section>
      ) : (
        <section className="watchlist">
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h2 className="watchlist-title">Watchlist</h2>
              <SearchCommand initialStocks={initialStocks} />
            </div>
            <WatchlistTable watchlist={watchlist} />
          </div>
        </section>
      )}
    </HydrationBoundary>
  );
};

export default WatchlistComponent;
