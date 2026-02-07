"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Clock } from "lucide-react";
import Link from "next/link";

export default function CTASection() {
  return (
    <section className="py-20 lg:py-28 bg-background relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-yellow-500/5 via-transparent to-blue-600/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-yellow-500/10 rounded-full blur-3xl" />
      </div>

      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(to right, #e8ba40 1px, transparent 1px), linear-gradient(to bottom, #e8ba40 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-400/10 border border-yellow-400/20 mb-8">
            <Sparkles className="h-4 w-4 text-yellow-400" />
            <span className="text-sm text-yellow-400 font-medium">
              Start for free today
            </span>
          </div>

          {/* Heading */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-400 mb-6">
            Ready to Start
            <span className="text-yellow-400"> Tracking?</span>
          </h2>

          {/* Subheading */}
          <p className="text-lg sm:text-xl text-gray-500 mb-8 max-w-2xl mx-auto">
            Join thousands of investors who trust our platform for their market research. 
            Get real-time data, personalized watchlists, and powerful insights.
          </p>

          {/* CTA Button */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
            <Link href="/sign-up">
              <Button className="yellow-btn px-10 text-lg h-16 text-lg">
                Create Free Account
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>

          {/* Supporting text */}
          <div className="flex items-center justify-center gap-2 text-gray-500">
            <Clock className="h-4 w-4" />
            <span className="text-sm">Takes less than a minute</span>
          </div>

          {/* Additional info */}
          <div className="mt-12 pt-8 border-t border-gray-700">
            <div className="grid sm:grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-2xl font-bold text-gray-400 mb-1">Free</p>
                <p className="text-sm text-gray-500">No hidden fees</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-400 mb-1">Real-time</p>
                <p className="text-sm text-gray-500">Live market data</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-400 mb-1">Secure</p>
                <p className="text-sm text-gray-500">Bank-level security</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
