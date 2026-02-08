"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function StockDetailError({
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
          Failed to load stock data
        </h2>
        <p className="text-gray-400 max-w-md">
          {error.message ||
            "We couldn't fetch the stock details. The API might be temporarily unavailable."}
        </p>
      </div>
      <div className="flex gap-3">
        <Button onClick={reset} className="yellow-btn">
          Try again
        </Button>
        <Link href="/">
          <Button variant="outline">Go home</Button>
        </Link>
      </div>
    </div>
  );
}
