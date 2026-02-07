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
  CheckCircle2,
  Clock
} from "lucide-react";

const currentFeatures = [
  {
    icon: Activity,
    title: "Real-Time Market Data",
    description: "Live stock prices, market indices, and trading volumes updated in real-time.",
    color: "text-teal-400",
    bgColor: "bg-teal-400/10",
  },
  {
    icon: Star,
    title: "Personalized Watchlist",
    description: "Track your favorite stocks in one place. Add, remove, and organize with ease.",
    color: "text-yellow-400",
    bgColor: "bg-yellow-400/10",
  },
  {
    icon: Search,
    title: "Powerful Stock Search",
    description: "Find any stock quickly with our intelligent search across all major exchanges.",
    color: "text-blue-600",
    bgColor: "bg-blue-600/10",
  },
  {
    icon: BarChart3,
    title: "Detailed Analysis",
    description: "In-depth stock profiles including financials, metrics, and company information.",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    icon: Newspaper,
    title: "Market News",
    description: "Stay updated with top financial stories and company-specific news.",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  {
    icon: LineChart,
    title: "Interactive Charts",
    description: "Visualize market trends with professional TradingView widgets and charts.",
    color: "text-red-500",
    bgColor: "bg-red-500/10",
  },
];

const upcomingFeatures = [
  {
    icon: Bell,
    title: "Price Alerts",
    description: "Get notified instantly when stocks hit your target price points.",
    color: "text-gray-400",
    bgColor: "bg-gray-700",
  },
  {
    icon: Wallet,
    title: "Portfolio Tracking",
    description: "Monitor your entire investment portfolio performance in one dashboard.",
    color: "text-gray-400",
    bgColor: "bg-gray-700",
  },
  {
    icon: Brain,
    title: "AI Insights",
    description: "Smart recommendations and analysis based on your preferences and market trends.",
    color: "text-gray-400",
    bgColor: "bg-gray-700",
  },
  {
    icon: Smartphone,
    title: "Mobile App",
    description: "Trade on the go with our upcoming iOS and Android applications.",
    color: "text-gray-400",
    bgColor: "bg-gray-700",
  },
];

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
  bgColor: string;
  comingSoon?: boolean;
}

function FeatureCard({ icon: Icon, title, description, color, bgColor, comingSoon }: FeatureCardProps) {
  return (
    <div className=" group">
      <div className="h-full p-6 rounded-xl bg-gray-800 border border-gray-700 hover:border-gray-600 transition-all duration-300 hover:shadow-xl hover:shadow-black/20">
        {/* Icon */}
        <div className={`w-12 h-12 rounded-lg ${bgColor} flex items-center justify-center mb-4`}>
          <Icon className={`h-6 w-6 ${color}`} />
        </div>

        {/* Content */}
        <h3 className="text-lg font-semibold text-gray-400 mb-2 flex items-center gap-2">
          {title}
          {comingSoon && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-700 text-gray-500 border border-gray-600">
              Soon
            </span>
          )}
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed">
          {description}
        </p>

        {/* Checkmark for current features */}
        {!comingSoon && (
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <CheckCircle2 className="h-5 w-5 text-teal-400" />
          </div>
        )}

        {/* Clock icon for upcoming */}
        {comingSoon && (
          <div className="absolute top-4 right-4">
            <Clock className="h-5 w-5 text-gray-600" />
          </div>
        )}
      </div>
    </div>
  );
}

export default function FeaturesSection() {
  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-400 mb-4">
            Everything You Need to
            <span className="text-yellow-400"> Track Markets</span>
          </h2>
          <p className="text-lg text-gray-500">
            Powerful features designed for both beginner and experienced investors. 
            Track, analyze, and stay informed with our comprehensive toolkit.
          </p>
        </div>

        {/* Current Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {currentFeatures.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>

        {/* Upcoming Features Section */}
        <div className="border-t border-gray-800 pt-16">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-400 mb-4">
              Coming Soon
            </h3>
            <p className="text-gray-500">
              We're constantly improving. Here's what's on our roadmap:
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {upcomingFeatures.map((feature) => (
              <FeatureCard key={feature.title} {...feature} comingSoon />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
