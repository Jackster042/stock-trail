export default function WatchlistLoading() {
  return (
    <section className="watchlist">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="h-8 w-32 rounded-lg bg-gray-800 animate-pulse" />
          <div className="h-10 w-28 rounded-lg bg-gray-800 animate-pulse" />
        </div>
        {/* Table skeleton */}
        <div className="rounded-lg border border-gray-700 overflow-hidden">
          {/* Header row */}
          <div className="h-12 bg-gray-800 border-b border-gray-700" />
          {/* Data rows */}
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-16 bg-gray-800/50 border-b border-gray-700 animate-pulse"
              style={{ animationDelay: `${i * 100}ms` }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
