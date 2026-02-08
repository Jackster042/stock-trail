"use client";

import { Star } from "lucide-react";

const testimonials = [
  {
    quote:
      "This app has completely changed how I track my investments. The real-time data is incredibly accurate and the watchlist feature keeps everything organized.",
    author: "Sarah Mitchell",
    role: "Day Trader",
    avatar: "SM",
    rating: 5,
  },
  {
    quote:
      "Finally a stock app that's both powerful and easy to use. The watchlist feature is exactly what I needed to monitor my long-term investments.",
    author: "James Kennedy",
    role: "Long-term Investor",
    avatar: "JK",
    rating: 5,
  },
  {
    quote:
      "The market news integration keeps me informed without having to check multiple sources. It's become an essential part of my morning routine.",
    author: "Michael Rodriguez",
    role: "Financial Analyst",
    avatar: "MR",
    rating: 5,
  },
];

const crossfadeClasses = [
  "animate-crossfade-1",
  "animate-crossfade-2",
  "animate-crossfade-3",
];

const stats = [
  { value: "10K+", label: "Active Users" },
  { value: "50K+", label: "Stocks Tracked" },
  { value: "4.9", label: "User Rating" },
];

const exchanges = ["NYSE", "NASDAQ", "FTSE", "DAX", "Nikkei"];

export default function TestimonialsSection() {
  return (
    <section className="py-24 lg:py-32 bg-background relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-500/[0.03] rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-blue-600/[0.03] rounded-full blur-[120px]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <p className="text-sm font-semibold text-yellow-400 uppercase tracking-widest mb-4">
            Testimonials
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-400 mb-5">
            Loved by <span className="text-yellow-400">Investors</span>
          </h2>
          <p className="text-lg text-gray-500">
            Join thousands of satisfied users who trust our platform for their
            daily market research.
          </p>
        </div>

        {/* Stats bar */}
        <div className="flex flex-wrap justify-center gap-8 sm:gap-16 mb-16 pb-14 border-b border-gray-800">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl sm:text-4xl font-bold text-yellow-400 tracking-tight">
                {stat.value}
              </p>
              <p className="text-sm text-gray-500 mt-1 font-medium">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* === Crossfade Testimonial Spotlight === */}
        <div className="relative max-w-3xl mx-auto min-h-[280px] sm:min-h-[240px]">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.author}
              className={`${index === 0 ? "" : "absolute inset-0"} flex flex-col items-center text-center ${crossfadeClasses[index]}`}
            >
              {/* Large decorative quote mark */}
              <div className="text-6xl sm:text-7xl font-serif text-yellow-400/20 leading-none mb-4 select-none">
                &ldquo;
              </div>

              {/* Quote */}
              <blockquote className="text-xl sm:text-2xl text-gray-400 leading-relaxed mb-8 max-w-2xl font-light">
                {testimonial.quote}
              </blockquote>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>

              {/* Author */}
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center text-gray-900 font-bold text-sm">
                  {testimonial.avatar}
                </div>
                {/* Info */}
                <div className="text-left">
                  <p className="font-semibold text-gray-400">
                    {testimonial.author}
                  </p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Progress dots indicator */}
        <div className="flex justify-center gap-2 mt-10">
          {testimonials.map((_, i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-gray-600"
            />
          ))}
        </div>

        {/* Exchange trust badges */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 text-xs uppercase tracking-widest mb-5 font-medium">
            Trusted by investors from
          </p>
          <div className="flex flex-wrap justify-center gap-6 sm:gap-10">
            {exchanges.map((exchange) => (
              <span
                key={exchange}
                className="text-gray-600 font-mono text-sm font-medium px-3 py-1.5 rounded-md border border-gray-800 bg-gray-800/30"
              >
                {exchange}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
