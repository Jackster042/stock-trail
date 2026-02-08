"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Clock } from "lucide-react";
import Link from "next/link";

export default function CTASection() {
  return (
    <section className="py-24 lg:py-32 bg-background relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-yellow-500/[0.06] rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-3xl mx-auto">
          {/* Animated gradient border container */}
          <div className="relative rounded-3xl p-[2px] animate-border-glow">
            {/* Inner content with solid background */}
            <div className="relative rounded-3xl bg-gray-900 px-8 py-16 sm:px-12 sm:py-20 lg:px-16 lg:py-24 text-center overflow-hidden">
              {/* Inner subtle background decorations */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-yellow-400/[0.03] rounded-full blur-[80px]" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-600/[0.03] rounded-full blur-[80px]" />

              {/* Dot grid inside */}
              <div className="absolute inset-0 dot-grid-pattern opacity-50" />

              <div className="relative">
                {/* Heading */}
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-400 mb-6 leading-tight">
                  Start Tracking.
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-500">
                    It&apos;s Free.
                  </span>
                </h2>

                {/* Subheading */}
                <p className="text-lg text-gray-500 mb-10 max-w-xl mx-auto">
                  Join thousands of investors who trust StockTrail for real-time
                  data, personalized watchlists, and powerful market insights.
                </p>

                {/* CTA Button */}
                <div className="flex justify-center mb-5">
                  <Link href="/sign-up">
                    <Button className="yellow-btn px-12 text-lg h-16 animate-glow-pulse transition-shadow">
                      Create Free Account
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </div>

                {/* Helper text */}
                <div className="flex items-center justify-center gap-2 text-gray-600">
                  <Clock className="h-3.5 w-3.5" />
                  <span className="text-sm">Takes less than a minute</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
