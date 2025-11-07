"use client";
import { useDebounce } from "@/hooks/useDebounce";
import {
  addToWatchlist,
  removeFromWatchlist,
} from "@/lib/actions/watchlist.actions";
import { Star, Trash2 } from "lucide-react";
import React, { useMemo, useState } from "react";
import { toast } from "sonner";

interface WatchlistButtonProps {
  symbol: string;
  company: string;
  isInWatchlist: boolean;
  showTrashIcon?: boolean;
  type?: "button" | "icon";
  onWatchlistChange?: (symbol: string, added: boolean) => void;
}

const WatchlistButton = ({
  symbol,
  company,
  isInWatchlist,
  showTrashIcon = false,
  type = "button",
  onWatchlistChange,
}: WatchlistButtonProps) => {
  const [added, setAdded] = useState<boolean>(!!isInWatchlist);

  const label = useMemo(() => {
    if (type === "icon") return added ? "" : "";
    return added ? "Remove from Watchlist" : "Add to Watchlist";
  }, [added, type]);

  const toggleWatchlist = async () => {
    const prev = added;
    const next = !prev;

    try {
      const result = prev
        ? await removeFromWatchlist(symbol)
        : await addToWatchlist(symbol, company);

      if (!result.success) {
        setAdded(prev);
        toast.error(result.message ?? "Unable to update watchlist");
        return;
      }

      if (prev) {
        toast.error("Stock removed from watchlist", {
          description: `${company} ${"removed"} from watchlist`,
        });
      } else {
        toast.success("Stock added to watchlist", {
          description: `${company} ${"added"} to watchlist`,
        });
      }

      onWatchlistChange?.(symbol, next);
    } catch (error) {
      setAdded(prev);
      toast.error("Unable to update watchlist", { description: String(error) });
      console.error(`Error toggling watchlist for ${symbol}`, error);
    }
  };

  const debounceToggle = useDebounce(toggleWatchlist, 500);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    setAdded(!added);
    debounceToggle();
  };

  if (type === "icon") {
    return (
      <button
        title={
          added
            ? `Remove ${symbol} from watchlist`
            : `Add ${symbol} to watchlist`
        }
        aria-label={
          added
            ? `Remove ${symbol} from watchlist`
            : `Add ${symbol} to watchlist`
        }
        className={`watchlist-icon-btn ${added ? "watchlist-icon-added" : ""}`}
        onClick={handleClick}
      >
        <Star fill={added ? "currentColor" : "none"} />
      </button>
    );
  }

  return (
    <button
      className={`watchlist-btn ${added ? "watchlist-remove" : ""}`}
      onClick={handleClick}
    >
      {showTrashIcon && added ? <Trash2 /> : null}
      <span>{label}</span>
    </button>
  );
};

export default WatchlistButton;
