import Image from "next/image";
import Link from "next/link";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="auth-layout">
      {/* Left Section */}
      <section className="auth-left-section scrollbar-hide-default">
        <Link href="/" className="auth-logo">
          <Image
            src="/assets/icons/logo.svg"
            alt="logo"
            width={140}
            height={32}
            className="h-8 w-auto"
          />
        </Link>
        <div className="flex-1 pb-6 lg:pb-8">{children}</div>

        <footer className="border-t py-4 text-center text-sm text-gray-500">
          © 2025 My App — All rights reserved.
        </footer>
      </section>

      {/* Right Section */}
      <section className="auth-right-section">
        <div className="z-10 relative lg:mt-4 lg:mb-16">
          <blockquote className="auth-blockquote">
            Signalist turned my watchlist into a winning list. The alerts are
            spot-on, and I feel more confident making moves in the market
          </blockquote>
          <div className="flex items-center justify-between">
            <div>
              <cite className="auth-testimonial-author">- John Doe</cite>
              <p className="max-md:text-xs text-gray-500">Retail investor</p>
            </div>
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Image
                  src="/assets/icons/star.svg"
                  alt="star"
                  key={star}
                  width={20}
                  height={20}
                  className="w-5 h-5"
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 relative">
          <Image
            src="/assets/images/dashboard.png"
            alt="Dashboard"
            width={1440}
            height={1050}
            className="auth-dashboard-preview absolute top-0"
          />
        </div>
      </section>
    </main>
  );
};

export default layout;
