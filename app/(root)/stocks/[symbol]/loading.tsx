import { Loader2 } from "lucide-react";

export default function StockDetailLoading() {
  return (
    <div className="flex min-h-screen p-4 md:p-6 lg:p-8">
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
        {/* Left column skeleton */}
        <div className="flex flex-col gap-6">
          <div className="h-[170px] rounded-lg bg-gray-800 animate-pulse" />
          <div className="h-[600px] rounded-lg bg-gray-800 animate-pulse" />
          <div className="h-[600px] rounded-lg bg-gray-800 animate-pulse" />
        </div>
        {/* Right column skeleton */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="h-10 w-48 rounded-lg bg-gray-800 animate-pulse" />
          </div>
          <div className="h-[400px] rounded-lg bg-gray-800 animate-pulse" />
          <div className="h-[440px] rounded-lg bg-gray-800 animate-pulse" />
          <div className="h-[464px] rounded-lg bg-gray-800 animate-pulse" />
        </div>
      </section>
    </div>
  );
}
