"use client";

import { ArrowRight } from "lucide-react";

const steps = [
  {
    command: 'sign-up --free --no-credit-card',
    output: "Create your account in seconds. No barriers to entry.",
    flag: "--free",
  },
  {
    command: 'search --exchange="all" --query="AAPL"',
    output: "Find any stock across every major exchange instantly.",
    flag: "--exchange",
  },
  {
    command: "track --add-to-watchlist --organize",
    output: "Build and manage your personalized portfolio watchlist.",
    flag: "--watchlist",
  },
  {
    command: "analyze --charts --financials --news",
    output: "Deep-dive with real-time data, charts, and insights.",
    flag: "--insights",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="py-24 lg:py-32 bg-background relative overflow-hidden">
      {/* Subtle background accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-yellow-500/[0.03] rounded-full blur-[120px]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-sm font-semibold text-yellow-400 uppercase tracking-widest mb-4">
            How It Works
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-400 mb-5">
            Four Steps to{" "}
            <span className="text-yellow-400">Smarter Tracking</span>
          </h2>
          <p className="text-lg text-gray-500">
            Get started in minutes. Our simple process helps you track and
            analyze stocks effortlessly.
          </p>
        </div>

        {/* Terminal Window */}
        <div className="max-w-3xl mx-auto">
          <div className="rounded-2xl border border-gray-700 overflow-hidden shadow-2xl shadow-black/40">
            {/* Terminal title bar */}
            <div className="bg-gray-800 border-b border-gray-700 px-4 py-3 flex items-center gap-3">
              {/* Traffic light dots */}
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
                <div className="w-3 h-3 rounded-full bg-teal-400/80" />
              </div>
              {/* Title */}
              <div className="flex-1 text-center">
                <span className="text-xs text-gray-500 font-mono">
                  stocktrail ~ getting-started
                </span>
              </div>
              {/* Spacer to balance the dots */}
              <div className="w-14" />
            </div>

            {/* Terminal body */}
            <div className="bg-gray-900 p-6 sm:p-8 font-mono text-sm sm:text-base space-y-1">
              {steps.map((step, index) => (
                <div key={index} className="mb-6 last:mb-2">
                  {/* Command line */}
                  <div className="terminal-line flex items-start gap-2 flex-wrap">
                    <span className="text-teal-400 select-none shrink-0">
                      $
                    </span>
                    <span className="text-gray-500 shrink-0 select-none">
                      step-{String(index + 1).padStart(2, "0")}:
                    </span>
                    <span className="text-yellow-400 break-all">
                      {step.command}
                    </span>
                    {/* Blinking cursor on last line */}
                    {index === steps.length - 1 && (
                      <span className="animate-blink-caret text-yellow-400 -ml-1">
                        _
                      </span>
                    )}
                  </div>

                  {/* Output line */}
                  <div className="terminal-line flex items-start gap-2 mt-1.5 ml-5">
                    <span className="text-gray-600 select-none shrink-0">
                      &gt;
                    </span>
                    <span className="text-gray-500">{step.output}</span>
                  </div>

                  {/* Separator between steps (not after the last one) */}
                  {index < steps.length - 1 && (
                    <div className="border-b border-gray-800/60 mt-5" />
                  )}
                </div>
              ))}

              {/* Success message at bottom */}
              <div className="terminal-line pt-4 border-t border-gray-800">
                <div className="flex items-center gap-2">
                  <span className="text-teal-400 select-none">
                    &#10003;
                  </span>
                  <span className="text-teal-400 font-medium">
                    Setup complete. Ready to track markets.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-14">
          <a
            href="/sign-up"
            className="inline-flex items-center gap-2 text-yellow-400 hover:text-yellow-500 font-medium transition-colors group"
          >
            Create your free account
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </section>
  );
}
