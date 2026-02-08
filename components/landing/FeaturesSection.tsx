"use client";

import {
  Activity,
  Search,
  Star,
  BarChart3,
  Newspaper,
  LineChart,
  Bell,
  Wallet,
  Brain,
  Smartphone,
} from "lucide-react";

interface Feature {
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
  bgColor: string;
  comingSoon?: boolean;
}

const currentFeatures: Feature[] = [
  {
    icon: Activity,
    title: "Real-Time Market Data",
    description:
      "Live stock prices, market indices, and trading volumes updated in real-time. Never miss a market move.",
    color: "text-teal-400",
    bgColor: "bg-teal-400/10",
  },
  {
    icon: Star,
    title: "Personalized Watchlist",
    description:
      "Track your favorite stocks in one place. Add, remove, and organize with ease.",
    color: "text-yellow-400",
    bgColor: "bg-yellow-400/10",
  },
  {
    icon: Search,
    title: "Powerful Stock Search",
    description:
      "Find any stock quickly with our intelligent search across all major exchanges.",
    color: "text-blue-600",
    bgColor: "bg-blue-600/10",
  },
  {
    icon: BarChart3,
    title: "Detailed Analysis",
    description:
      "In-depth stock profiles including financials, key metrics, and company information at your fingertips.",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    icon: Newspaper,
    title: "Market News",
    description:
      "Stay updated with top financial stories and company-specific news from trusted sources.",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  {
    icon: LineChart,
    title: "Interactive Charts",
    description:
      "Visualize market trends with professional TradingView widgets. Technical analysis made accessible.",
    color: "text-red-500",
    bgColor: "bg-red-500/10",
  },
];

const upcomingFeatures: Feature[] = [
  {
    icon: Bell,
    title: "Price Alerts",
    description: "Get notified when stocks hit your target price.",
    color: "text-gray-500",
    bgColor: "bg-gray-700/50",
    comingSoon: true,
  },
  {
    icon: Wallet,
    title: "Portfolio Tracking",
    description: "Monitor your entire portfolio performance.",
    color: "text-gray-500",
    bgColor: "bg-gray-700/50",
    comingSoon: true,
  },
  {
    icon: Brain,
    title: "AI Insights",
    description: "Smart recommendations powered by AI.",
    color: "text-gray-500",
    bgColor: "bg-gray-700/50",
    comingSoon: true,
  },
  {
    icon: Smartphone,
    title: "Mobile App",
    description: "Trade on the go with iOS and Android.",
    color: "text-gray-500",
    bgColor: "bg-gray-700/50",
    comingSoon: true,
  },
];

function BentoCard({
  feature,
  size = "normal",
  delayClass,
}: {
  feature: Feature;
  size?: "large" | "normal";
  delayClass: string;
}) {
  const Icon = feature.icon;
  const isLarge = size === "large";

  return (
    <div className={`animate-fade-up ${delayClass}`}>
      <div className="bento-card h-full">
        <div
          className={`relative ${isLarge ? "p-8 lg:p-10" : "p-6 lg:p-8"} h-full`}
        >
          {/* Subtle corner accent for large cards */}
          {isLarge && (
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-yellow-400/[0.04] to-transparent rounded-bl-full" />
          )}

          {/* Icon */}
          <div
            className={`${isLarge ? "w-14 h-14" : "w-12 h-12"} rounded-xl ${feature.bgColor} flex items-center justify-center mb-5`}
          >
            <Icon
              className={`${isLarge ? "h-7 w-7" : "h-6 w-6"} ${feature.color}`}
            />
          </div>

          {/* Content */}
          <h3
            className={`${isLarge ? "text-xl lg:text-2xl" : "text-lg"} font-semibold text-gray-400 mb-3`}
          >
            {feature.title}
          </h3>
          <p
            className={`${isLarge ? "text-base" : "text-sm"} text-gray-500 leading-relaxed`}
          >
            {feature.description}
          </p>

          {/* Large card extra: decorative mini chart lines */}
          {isLarge && (
            <div className="mt-6 flex items-end gap-1 h-8 opacity-30">
              {[40, 65, 45, 80, 55, 90, 70, 95, 60, 85, 75, 100].map(
                (h, i) => (
                  <div
                    key={i}
                    className={`w-1.5 rounded-full ${feature.bgColor}`}
                    style={{ height: `${h}%` }}
                  />
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function UpcomingCard({
  feature,
  delayClass,
}: {
  feature: Feature;
  delayClass: string;
}) {
  const Icon = feature.icon;

  return (
    <div className={`animate-fade-up ${delayClass}`}>
      <div className="relative h-full rounded-2xl border border-dashed border-gray-700 bg-gray-800/30 p-5 transition-all duration-300 hover:border-gray-600">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-gray-700/50 flex items-center justify-center shrink-0">
            <Icon className="h-5 w-5 text-gray-500" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-sm font-semibold text-gray-500">
                {feature.title}
              </h3>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-700/80 text-gray-500 border border-gray-600/50 uppercase tracking-wider font-medium">
                Soon
              </span>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              {feature.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FeaturesSection() {
  return (
    <section className="py-24 lg:py-32 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-sm font-semibold text-yellow-400 uppercase tracking-widest mb-4">
            Features
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-400 mb-5">
            Everything You Need to
            <span className="text-yellow-400"> Track Markets</span>
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Powerful features designed for both beginner and experienced
            investors. Track, analyze, and stay informed.
          </p>
        </div>

        {/* === Bento Grid === */}
        {/* Desktop: 3 columns, row 1 = [large, small, small], row 2 = [small, small, large] */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
          {/* Row 1 */}
          <div className="lg:col-span-2 lg:row-span-1">
            <BentoCard
              feature={currentFeatures[0]}
              size="large"
              delayClass="animate-fade-up-delay-1"
            />
          </div>
          <div>
            <BentoCard
              feature={currentFeatures[1]}
              delayClass="animate-fade-up-delay-2"
            />
          </div>

          {/* Row 2 */}
          <div>
            <BentoCard
              feature={currentFeatures[2]}
              delayClass="animate-fade-up-delay-3"
            />
          </div>
          <div>
            <BentoCard
              feature={currentFeatures[3]}
              delayClass="animate-fade-up-delay-4"
            />
          </div>
          <div>
            <BentoCard
              feature={currentFeatures[4]}
              delayClass="animate-fade-up-delay-5"
            />
          </div>

          {/* Row 3 - last current feature spans 2 cols on the right */}
          <div className="hidden lg:block lg:col-span-1" aria-hidden="true">
            {/* Spacer on large screens to push the large card right */}
          </div>
          <div className="md:col-span-2">
            <BentoCard
              feature={currentFeatures[5]}
              size="large"
              delayClass="animate-fade-up-delay-6"
            />
          </div>
        </div>

        {/* Coming Soon Row */}
        <div className="border-t border-gray-800 pt-14">
          <div className="text-center mb-8">
            <h3 className="text-xl font-bold text-gray-500 mb-2">
              On the Roadmap
            </h3>
            <p className="text-sm text-gray-600">
              What we&apos;re building next.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {upcomingFeatures.map((feature, i) => (
              <UpcomingCard
                key={feature.title}
                feature={feature}
                delayClass={`animate-fade-up-delay-${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
