"use client";

import { useState, useEffect } from "react";
import {
  CommandDialog,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "./ui/command";
import { CommandEmpty, CommandList } from "cmdk";
import { Loader2, TrendingUp } from "lucide-react";
import { Button } from "./ui/button";
import { useDebounce } from "@/hooks/useDebounce";
import Link from "next/link";
import { searchStocks } from "@/lib/actions/finnhub.actions";

export default function SearchCommand({
  renderAs = "button",
  label = "Add stock",
  initialStocks,
}: SearchCommandProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [stocks, setStocks] = useState<StockWithWatchlistStatus[]>(
    initialStocks || []
  );

  const isSearchMode = !!search.trim();
  const displayStocks = isSearchMode ? stocks : stocks?.slice(0, 10);

  const handleSearch = async () => {
    if (!search) return setStocks(initialStocks || []);

    setLoading(true);
    try {
      const result = await searchStocks(search.trim());
      setStocks(result);
    } catch {
      setStocks([]);
    } finally {
      setLoading(false);
    }
  };
  const debounceSearch = useDebounce(handleSearch, 500);

  useEffect(() => {
    debounceSearch();
  }, [search]);

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

  const handleSelectStock = () => {
    setOpen(false);
    setSearch("");
    setStocks(initialStocks || []);
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
        <CommandList className="search-list">
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
                <li key={stock.symbol} className="search-item">
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
                    {/*<Star />*/}
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
