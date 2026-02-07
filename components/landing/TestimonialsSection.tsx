"use client";

import { Quote, Star } from "lucide-react";

const testimonials = [
  {
    quote: "This app has completely changed how I track my investments. The real-time data is incredibly accurate and the watchlist feature keeps everything organized.",
    author: "Sarah Mitchell",
    role: "Day Trader",
    avatar: "SM",
    rating: 5,
  },
  {
    quote: "Finally a stock app that's both powerful and easy to use. The watchlist feature is exactly what I needed to monitor my long-term investments.",
    author: "James Kennedy",
    role: "Long-term Investor",
    avatar: "JK",
    rating: 5,
  },
  {
    quote: "The market news integration keeps me informed without having to check multiple sources. It's become an essential part of my morning routine.",
    author: "Michael Rodriguez",
    role: "Financial Analyst",
    avatar: "MR",
    rating: 5,
  },
];

function TestimonialCard({ testimonial }: { testimonial: typeof testimonials[0] }) {
  return (
    <div className="relative group">
      <div className="h-full p-8 rounded-xl bg-gray-800 border border-gray-700 hover:border-gray-600 transition-all duration-300">
        {/* Quote icon */}
        <div className="absolute -top-4 left-8">
          <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center">
            <Quote className="h-4 w-4 text-gray-900" />
          </div>
        </div>

        {/* Rating */}
        <div className="flex gap-1 mb-4">
          {Array.from({ length: testimonial.rating }).map((_, i) => (
            <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          ))}
        </div>

        {/* Quote text */}
        <blockquote className="text-gray-400 text-base leading-relaxed mb-6">
          &ldquo;{testimonial.quote}&rdquo;
        </blockquote>

        {/* Author */}
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center text-gray-900 font-bold">
            {testimonial.avatar}
          </div>
          
          {/* Info */}
          <div>
            <p className="font-semibold text-gray-400">{testimonial.author}</p>
            <p className="text-sm text-gray-500">{testimonial.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TestimonialsSection() {
  return (
    <section className="py-20 lg:py-28 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-blue-600/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-400 mb-4">
            Loved by <span className="text-yellow-400">Investors</span>
          </h2>
          <p className="text-lg text-gray-500">
            Join thousands of satisfied users who trust our platform for their daily market research and investment tracking.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mb-16">
          <div className="text-center">
            <p className="text-3xl sm:text-4xl font-bold text-yellow-400">10K+</p>
            <p className="text-sm text-gray-500 mt-1">Active Users</p>
          </div>
          <div className="text-center">
            <p className="text-3xl sm:text-4xl font-bold text-yellow-400">50K+</p>
            <p className="text-sm text-gray-500 mt-1">Stocks Tracked</p>
          </div>
          <div className="text-center">
            <p className="text-3xl sm:text-4xl font-bold text-yellow-400">4.9</p>
            <p className="text-sm text-gray-500 mt-1">User Rating</p>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.author} testimonial={testimonial} />
          ))}
        </div>

        {/* Trust indicators */}
        <div className="mt-16 text-center">
          <p className="text-gray-500 text-sm mb-4">Trusted by investors from</p>
          <div className="flex flex-wrap justify-center gap-8 opacity-50">
            {['NYSE', 'NASDAQ', 'FTSE', 'DAX', 'Nikkei'].map((exchange) => (
              <span key={exchange} className="text-gray-500 font-semibold text-lg">
                {exchange}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
