"use client";

import { UserPlus, Search, Star, TrendingUp, ArrowRight } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: UserPlus,
    title: "Sign Up",
    description: "Create your free account in seconds. No credit card required to get started.",
    color: "text-blue-600",
    bgColor: "bg-blue-600/10",
    borderColor: "border-blue-600/30",
  },
  {
    number: "02",
    icon: Search,
    title: "Search",
    description: "Find stocks you're interested in using our powerful search across all major exchanges.",
    color: "text-yellow-400",
    bgColor: "bg-yellow-400/10",
    borderColor: "border-yellow-400/30",
  },
  {
    number: "03",
    icon: Star,
    title: "Track",
    description: "Add stocks to your personal watchlist and organize them the way you want.",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/30",
  },
  {
    number: "04",
    icon: TrendingUp,
    title: "Analyze",
    description: "View detailed charts, financials, and market news to make informed decisions.",
    color: "text-teal-400",
    bgColor: "bg-teal-400/10",
    borderColor: "border-teal-400/30",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-400 mb-4">
            How It <span className="text-yellow-400">Works</span>
          </h2>
          <p className="text-lg text-gray-500">
            Get started in minutes. Our simple four-step process helps you track and analyze stocks effortlessly.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection line - Desktop only */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gray-700 to-transparent" />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.number} className="relative">
                  {/* Step Card */}
                  <div className="relative group">
                    {/* Number badge */}
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                      <span className={`inline-flex items-center justify-center w-10 h-10 rounded-full ${step.bgColor} ${step.color} border-2 ${step.borderColor} font-bold text-sm`}>
                        {step.number}
                      </span>
                    </div>

                    {/* Card content */}
                    <div className="pt-8 pb-6 px-6 rounded-xl bg-card border border-gray-700 hover:border-gray-600 transition-all duration-300 text-center h-full">
                      {/* Icon */}
                      <div className={`w-16 h-16 rounded-xl ${step.bgColor} flex items-center justify-center mx-auto mb-4 mt-4`}>
                        <Icon className={`h-8 w-8 ${step.color}`} />
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-semibold text-gray-400 mb-3">
                        {step.title}
                      </h3>

                      {/* Description */}
                      <p className="text-gray-500 text-sm leading-relaxed">
                        {step.description}
                      </p>
                    </div>

                    {/* Arrow to next step - Desktop only */}
                    {index < steps.length - 1 && (
                      <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                        <ArrowRight className="h-6 w-6 text-gray-700" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-gray-500 mb-4">
            Ready to start your investment journey?
          </p>
          <a 
            href="/sign-up" 
            className="inline-flex items-center gap-2 text-yellow-400 hover:text-yellow-500 font-medium transition-colors"
          >
            Create your free account
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
