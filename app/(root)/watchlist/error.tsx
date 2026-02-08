"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function WatchlistError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-20">
      <AlertTriangle className="h-12 w-12 text-yellow-500" />
      <div className="text-center">
        <h2 className="text-xl font-heading text-gray-100 mb-2">
          Failed to load watchlist
        </h2>
        <p className="text-gray-400 max-w-md">
          {error.message ||
            "We couldn't fetch your watchlist. Please try again."}
        </p>
      </div>
      <Button onClick={reset} className="yellow-btn">
        Try again
      </Button>
    </div>
  );
}
