"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { CommandDialog, CommandInput } from "./ui/command";
import { CommandEmpty, CommandList } from "cmdk";
import { Loader2, TrendingUp } from "lucide-react";
import { Button } from "./ui/button";
import { useDebounce } from "@/hooks/useDebounce";
import Link from "next/link";
import { usePopularStocks, useSearchStocks } from "@/lib/hooks/use-search-stocks";
import WatchlistButton from "./WatchlistButton";

export default function SearchCommand({
  renderAs = "button",
  label = "Add stock",
  initialStocks,
  isAuthenticated = true,
}: SearchCommandProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Local override state for watchlist status changes within the dialog
  const [watchlistOverrides, setWatchlistOverrides] = useState<
    Record<string, boolean>
  >({});

  // Use React Query hooks instead of direct server action calls
  const isSearchMode = !!debouncedQuery.trim();
  const {
    data: popularStocks,
    isLoading: isLoadingPopular,
  } = usePopularStocks(open && !isSearchMode);

  const {
    data: searchResults,
    isLoading: isLoadingSearch,
  } = useSearchStocks(debouncedQuery, open && isSearchMode);

  // Debounce search input
  const { debouncedFn: debouncedSetQuery, cancel: cancelDebounce } = useDebounce(
    (query: string) => setDebouncedQuery(query),
    500
  );

  // Handle search input changes
  useEffect(() => {
    if (!open) {
      return;
    }

    if (!search.trim()) {
      setDebouncedQuery("");
      cancelDebounce();
    } else {
      debouncedSetQuery(search.trim());
    }

    return () => {
      cancelDebounce();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, open]);

  // Reset state when dialog closes
  useEffect(() => {
    if (!open) {
      setSearch("");
      setDebouncedQuery("");
      setWatchlistOverrides({});
    }
  }, [open]);

  // Keyboard shortcut to open search
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || (e.ctrlKey && e.key.toLowerCase() === "k")) {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const loading = isSearchMode ? isLoadingSearch : isLoadingPopular;

  // Determine which stocks to display, applying any watchlist overrides
  const rawStocks = isSearchMode
    ? searchResults
    : popularStocks ?? initialStocks;
  const displayStocks = rawStocks
    ?.map((stock) => ({
      ...stock,
      isInWatchlist:
        watchlistOverrides[stock.symbol] ?? stock.isInWatchlist,
    }))
    .slice(0, isSearchMode ? undefined : 10);

  const handleSelectStock = () => {
    setOpen(false);
  };

  const handleWatchlistChange = (symbol: string, isAdded: boolean) => {
    setWatchlistOverrides((prev) => ({ ...prev, [symbol]: isAdded }));
  };

  return (
    <>
      {renderAs === "text" ? (
        <span onClick={() => setOpen(true)} className="search-text">
          {label}
        </span>
      ) : (
        <Button onClick={() => setOpen(true)} className="search-btn">
          {label}
        </Button>
      )}
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        className="search-dialog"
      >
        <div className="search-field">
          <CommandInput
            value={search}
            onValueChange={setSearch}
            disabled={loading}
            placeholder="Search stocks..."
            className="search-input"
          />
          {loading && <Loader2 className="search-loader" />}
        </div>
        <CommandList className="search-list overflow-y-auto max-h-[400px] scrollbar-hide-default rounded-lg border border-gray-600 bg-gray-800">
          {loading ? (
            <CommandEmpty className="search-list-empty">
              Loading stocks ...
            </CommandEmpty>
          ) : displayStocks?.length === 0 ? (
            <div className="search-list-indicator">
              {isSearchMode ? "No results found" : "No stocks found"}
            </div>
          ) : (
            <ul>
              <div className="search-count">
                {isSearchMode ? "Search results" : "Popular stocks"}
                {` `}({displayStocks?.length || 0})
              </div>
              {displayStocks?.map((stock, i) => (
                <li
                  key={`${stock.symbol}-${i}`}
                  className="search-item"
                >
                  <Link
                    href={`/stocks/${stock.symbol}`}
                    onClick={handleSelectStock}
                    className="search-item-link"
                  >
                    <TrendingUp className="h-4 w-4 text-gray-500" />
                    <div className="flex-1">
                      <div className="search-item-name">{stock.name}</div>
                      <div className="text-sm text-gray-500">
                        {stock.symbol} | {stock.exchange} | {stock.type}
                      </div>
                    </div>
                    <WatchlistButton
                      symbol={stock.symbol}
                      company={stock.name}
                      isInWatchlist={stock.isInWatchlist}
                      isAuthenticated={isAuthenticated}
                      onWatchlistChange={handleWatchlistChange}
                      type="icon"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
