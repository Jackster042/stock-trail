"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, TrendingUp, BarChart3, DollarSign } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const trustBadges = [
  "Free forever",
  "No credit card required",
  "Real-time data",
];

export default function HeroSection() {
  return (
    <section className="overflow-hidden bg-background min-h-screen flex items-center">
      {/* Background gradient - matching CTA section style */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-gray-900 to-blue-600/10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-yellow-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-3xl" />
      </div>

      {/* Grid pattern overlay - matching CTA section */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(to right, #e8ba40 1px, transparent 1px), linear-gradient(to bottom, #e8ba40 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      />

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left column - Content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-400/10 border border-yellow-400/20 mb-6">
              <TrendingUp className="h-4 w-4 text-yellow-400" />
              <span className="text-sm text-yellow-400 font-medium tracking-wide">
                #1 Stock Tracking Platform
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-400 leading-[1.1] mb-6 tracking-tight">
              Track Stocks.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-500">
                Make Smarter
              </span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-500">
                Decisions.
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-gray-500 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light">
              Real-time market data, personalized watchlists, and powerful insights all in one place. Start tracking your investments today.
            </p>

            {/* CTA Buttons - Single primary CTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10">
              <Link href="/sign-up">
                <Button className="yellow-btn px-10 text-lg h-16 text-lg shadow-2xl shadow-yellow-500/20 hover:shadow-yellow-500/30 transition-shadow">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-6 justify-center lg:justify-start">
              {trustBadges.map((badge) => (
                <div key={badge} className="flex items-center gap-2 text-sm text-gray-500">
                  <CheckCircle className="h-5 w-5 text-teal-400" />
                  <span className="font-medium">{badge}</span>
                </div>
              ))}
            </div>

            {/* Stats row */}
            <div className="flex flex-wrap gap-8 mt-10 pt-10 border-t border-gray-800 justify-center lg:justify-start">
              <div>
                <p className="text-3xl font-bold text-yellow-400 tracking-tight">10K+</p>
                <p className="text-sm text-gray-500 font-medium">Active Traders</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-yellow-400 tracking-tight">50K+</p>
                <p className="text-sm text-gray-500 font-medium">Stocks Tracked</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-yellow-400 tracking-tight">99.9%</p>
                <p className="text-sm text-gray-500 font-medium">Uptime</p>
              </div>
            </div>
          </div>

          {/* Right column - Visual */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden border border-gray-700 shadow-2xl shadow-black/50">
              {/* Glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500/30 to-blue-600/30 rounded-2xl blur-lg" />
              
              {/* Dashboard preview */}
              <div className="relative bg-gray-800 rounded-2xl overflow-hidden">
                <Image
                  src="/assets/images/dashboard-preview.png"
                  alt="Stock Market Dashboard Preview"
                  width={800}
                  height={500}
                  className="w-full h-auto"
                  priority
                />
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent" />
              </div>
            </div>

            {/* Floating stats cards - static, no animation */}
            <div className="absolute -bottom-4 -left-4 lg:-bottom-6 lg:-left-6 bg-gray-800/95 backdrop-blur-sm border border-gray-700 rounded-xl p-4 shadow-2xl">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-teal-400/20 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-teal-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Portfolio Growth</p>
                  <p className="text-2xl font-bold text-teal-400 tracking-tight">+24.5%</p>
                </div>
              </div>
            </div>

            <div className="absolute -top-4 -right-4 lg:-top-6 lg:-right-6 bg-gray-800/95 backdrop-blur-sm border border-gray-700 rounded-xl p-4 shadow-2xl">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-yellow-400/20 flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-yellow-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Watchlist</p>
                  <p className="text-2xl font-bold text-gray-400 tracking-tight">12 Stocks</p>
                </div>
              </div>
            </div>

            {/* Additional floating element */}
            <div className="absolute bottom-1/4 -right-8 lg:-right-12 bg-gray-800/95 backdrop-blur-sm border border-gray-700 rounded-xl p-3 shadow-2xl hidden lg:block">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600/20 flex items-center justify-center">
                  <DollarSign className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">AAPL</p>
                  <p className="text-sm font-bold text-teal-400 tracking-tight">+2.4%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
