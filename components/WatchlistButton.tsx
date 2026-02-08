"use client";
import {
  useAddToWatchlist,
  useRemoveFromWatchlist,
} from "@/lib/hooks/use-watchlist";
import { Star, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";
import { toast } from "sonner";

interface WatchlistButtonProps {
  symbol: string;
  company: string;
  isInWatchlist: boolean;
  isAuthenticated?: boolean;
  showTrashIcon?: boolean;
  type?: "button" | "icon";
  onWatchlistChange?: (symbol: string, added: boolean) => void;
}

const WatchlistButton = ({
  symbol,
  company,
  isInWatchlist,
  isAuthenticated = true,
  showTrashIcon = false,
  type = "button",
  onWatchlistChange,
}: WatchlistButtonProps) => {
  const router = useRouter();
  const [added, setAdded] = useState<boolean>(!!isInWatchlist);

  // Use React Query mutations
  const addMutation = useAddToWatchlist();
  const removeMutation = useRemoveFromWatchlist();
  const isPending = addMutation.isPending || removeMutation.isPending;

  const label = useMemo(() => {
    if (type === "icon") return added ? "" : "";
    return added ? "Remove from Watchlist" : "Add to Watchlist";
  }, [added, type]);

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    // Redirect to sign-in if user is not authenticated
    if (!isAuthenticated) {
      toast.info("Sign in required", {
        description: "Please sign in to add stocks to your watchlist",
      });
      router.push("/sign-in");
      return;
    }

    // Prevent double-clicks while mutation is in flight
    if (isPending) return;

    const prev = added;
    const next = !prev;

    // Optimistic update
    setAdded(next);

    try {
      const result = prev
        ? await removeMutation.mutateAsync(symbol)
        : await addMutation.mutateAsync({ symbol, company });

      if (!result.success) {
        setAdded(prev);
        toast.error(result.message ?? "Unable to update watchlist");
        return;
      }

      if (prev) {
        toast.error("Stock removed from watchlist", {
          description: `${company} removed from watchlist`,
        });
      } else {
        toast.success("Stock added to watchlist", {
          description: `${company} added to watchlist`,
        });
      }

      onWatchlistChange?.(symbol, next);
    } catch (error) {
      setAdded(prev);
      toast.error("Unable to update watchlist", { description: String(error) });
    }
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
        disabled={isPending}
      >
        <Star fill={added ? "currentColor" : "none"} />
      </button>
    );
  }

  return (
    <button
      className={`watchlist-btn ${added ? "watchlist-remove" : ""}`}
      onClick={handleClick}
      disabled={isPending}
    >
      {showTrashIcon && added ? <Trash2 /> : null}
      <span>{label}</span>
    </button>
  );
};

export default WatchlistButton;
