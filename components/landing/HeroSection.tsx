"use client";

import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  CheckCircle,
  TrendingUp,
  BarChart3,
  DollarSign,
} from "lucide-react";
import Link from "next/link";

const trustBadges = [
  "Free forever",
  "No credit card required",
  "Real-time data",
];

const rotatingWords = ["Trades.", "Moves.", "Calls.", "Decisions."];

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-background min-h-screen flex items-center justify-center">
      {/* === Animated gradient mesh background === */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Orb 1 - Gold, center-left */}
        <div className="animate-gradient-mesh-1 absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-yellow-500/[0.12] rounded-full blur-[120px]" />
        {/* Orb 2 - Blue, upper-right */}
        <div className="animate-gradient-mesh-2 absolute top-1/6 right-1/4 w-[500px] h-[500px] bg-blue-600/[0.08] rounded-full blur-[100px]" />
        {/* Orb 3 - Purple, lower-center */}
        <div className="animate-gradient-mesh-3 absolute bottom-1/4 left-1/2 -translate-x-1/2 w-[450px] h-[450px] bg-purple-500/[0.06] rounded-full blur-[100px]" />
      </div>

      {/* Dot grid pattern overlay */}
      <div className="absolute inset-0 dot-grid-pattern" />

      {/* Content container */}
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Shimmer badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-yellow-400/20 mb-8 relative overflow-hidden">
            {/* Shimmer overlay */}
            <div
              className="absolute inset-0 animate-shimmer"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(253,212,88,0.08), transparent)",
              }}
            />
            <TrendingUp className="relative h-4 w-4 text-yellow-400" />
            <span className="relative text-sm text-yellow-400 font-medium tracking-wide">
              #1 Stock Tracking Platform
            </span>
          </div>

          {/* Headline with rotating word */}
          <h1 className="text-5xl sm:text-6xl lg:text-8xl font-bold text-gray-400 leading-[1.05] mb-8 tracking-tight">
            Track Stocks.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500">
              Make Smarter
            </span>
            <br />
            {/* Rotating words container */}
            <span className="animate-rotate-words text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-500">
              {rotatingWords.map((word) => (
                <span
                  key={word}
                  className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-500"
                >
                  {word}
                </span>
              ))}
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl lg:text-2xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed font-light">
            Real-time market data, personalized watchlists, and powerful
            insights &mdash; all in one place. Start tracking your investments
            today.
          </p>

          {/* CTA Button with glow pulse */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <Link href="/sign-up">
              <Button className="yellow-btn px-12 text-lg h-16 animate-glow-pulse transition-shadow">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap gap-6 justify-center mb-6">
            {trustBadges.map((badge) => (
              <div
                key={badge}
                className="flex items-center gap-2 text-sm text-gray-500"
              >
                <CheckCircle className="h-4 w-4 text-teal-400" />
                <span className="font-medium">{badge}</span>
              </div>
            ))}
          </div>
        </div>

        {/* === Floating glassmorphic stat cards (orbiting the content) === */}

        {/* Card 1 - Top left area */}
        <div className="animate-float-1 absolute top-[18%] left-[5%] lg:left-[8%] hidden md:block">
          <div className="bg-gray-800/60 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-4 shadow-2xl shadow-black/30">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-teal-400/15 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-teal-400" />
              </div>
              <div>
                <p className="text-[11px] text-gray-500 uppercase tracking-wider font-medium">
                  Portfolio
                </p>
                <p className="text-xl font-bold text-teal-400 tracking-tight">
                  +24.5%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2 - Top right area */}
        <div className="animate-float-2 absolute top-[14%] right-[5%] lg:right-[10%] hidden md:block">
          <div className="bg-gray-800/60 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-4 shadow-2xl shadow-black/30">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-yellow-400/15 flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-[11px] text-gray-500 uppercase tracking-wider font-medium">
                  Watchlist
                </p>
                <p className="text-xl font-bold text-gray-400 tracking-tight">
                  12 Stocks
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3 - Bottom right area */}
        <div className="animate-float-3 absolute bottom-[20%] right-[8%] lg:right-[14%] hidden lg:block">
          <div className="bg-gray-800/60 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-3.5 shadow-2xl shadow-black/30">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-blue-600/15 flex items-center justify-center">
                <DollarSign className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-[11px] text-gray-500 font-medium">AAPL</p>
                <p className="text-base font-bold text-teal-400 tracking-tight">
                  $182.52
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Card 4 - Bottom left area */}
        <div className="animate-float-2 absolute bottom-[22%] left-[6%] lg:left-[12%] hidden lg:block">
          <div className="bg-gray-800/60 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-3.5 shadow-2xl shadow-black/30">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-purple-500/15 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-purple-500" />
              </div>
              <div>
                <p className="text-[11px] text-gray-500 font-medium">TSLA</p>
                <p className="text-base font-bold text-teal-400 tracking-tight">
                  +5.2%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats row at the very bottom of hero */}
        <div className="max-w-3xl mx-auto mt-12 pt-10 border-t border-gray-700/50">
          <div className="flex flex-wrap gap-12 justify-center">
            <div className="text-center">
              <p className="text-3xl sm:text-4xl font-bold text-yellow-400 tracking-tight">
                10K+
              </p>
              <p className="text-sm text-gray-500 font-medium mt-1">
                Active Traders
              </p>
            </div>
            <div className="text-center">
              <p className="text-3xl sm:text-4xl font-bold text-yellow-400 tracking-tight">
                50K+
              </p>
              <p className="text-sm text-gray-500 font-medium mt-1">
                Stocks Tracked
              </p>
            </div>
            <div className="text-center">
              <p className="text-3xl sm:text-4xl font-bold text-yellow-400 tracking-tight">
                99.9%
              </p>
              <p className="text-sm text-gray-500 font-medium mt-1">Uptime</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
