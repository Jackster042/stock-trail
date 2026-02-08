"use client";

interface TickerItem {
  label: string;
  highlight?: boolean;
}

const exchangeItems: TickerItem[] = [
  { label: "NYSE" },
  { label: "10K+ Users", highlight: true },
  { label: "NASDAQ" },
  { label: "S&P 500" },
  { label: "50K+ Stocks", highlight: true },
  { label: "FTSE 100" },
  { label: "DAX" },
  { label: "99.9% Uptime", highlight: true },
  { label: "Nikkei 225" },
  { label: "Real-Time Data", highlight: true },
  { label: "Hang Seng" },
  { label: "4.9 Rating", highlight: true },
];

const featureItems: TickerItem[] = [
  { label: "Real-Time Prices" },
  { label: "Watchlists" },
  { label: "Interactive Charts" },
  { label: "Market News" },
  { label: "Stock Search" },
  { label: "AI Insights" },
  { label: "Price Alerts" },
  { label: "Portfolio Tracking" },
  { label: "Company Financials" },
  { label: "Trading Volumes" },
];

function TickerRow({
  items,
  direction,
}: {
  items: TickerItem[];
  direction: "left" | "right";
}) {
  const renderItem = (item: TickerItem, key: string) => (
    <span key={key} className="flex items-center gap-6 px-2">
      <span
        className={`text-sm font-medium whitespace-nowrap ${
          item.highlight
            ? "text-yellow-400 font-semibold"
            : "text-gray-500"
        }`}
      >
        {item.label}
      </span>
      <span className="text-gray-700 text-xs select-none">/</span>
    </span>
  );

  return (
    <div className="marquee-track flex overflow-hidden py-3.5">
      <div
        className={`flex shrink-0 ${
          direction === "left"
            ? "animate-marquee-left"
            : "animate-marquee-right"
        }`}
      >
        {items.map((item, i) => renderItem(item, `a-${i}`))}
        {items.map((item, i) => (
          <span key={`b-${i}`} aria-hidden="true" className="flex items-center gap-6 px-2">
            <span
              className={`text-sm font-medium whitespace-nowrap ${
                item.highlight
                  ? "text-yellow-400 font-semibold"
                  : "text-gray-500"
              }`}
            >
              {item.label}
            </span>
            <span className="text-gray-700 text-xs select-none">/</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function TickerMarquee() {
  return (
    <section className="relative bg-gray-800/40 border-y border-gray-700/50 overflow-hidden">
      {/* Fade edges for seamless look */}
      <div className="absolute left-0 top-0 bottom-0 w-20 sm:w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-20 sm:w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

      {/* Row 1 - Exchanges & stats scrolling left */}
      <TickerRow items={exchangeItems} direction="left" />

      {/* Thin divider */}
      <div className="border-t border-gray-700/30" />

      {/* Row 2 - Features scrolling right */}
      <TickerRow items={featureItems} direction="right" />
    </section>
  );
}
