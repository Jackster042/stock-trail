"use client";

import React from 'react';
import { AlertTriangle, Info, X } from 'lucide-react';

interface ProminentDemoBannerProps {
  title?: string;
  message?: string;
  className?: string;
  dismissible?: boolean;
}

const ProminentDemoBanner: React.FC<ProminentDemoBannerProps> = ({
  title = "Portfolio Demo Mode",
  message = "This is a demonstration environment. All trading activities, portfolio data, and transactions shown are simulated and not real.",
  className = "",
  dismissible = true,
}) => {
  const [isVisible, setIsVisible] = React.useState(true);
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
    // Check if user previously dismissed the prominent banner
    const dismissed = localStorage.getItem('prominent-demo-banner-dismissed');
    if (dismissed === 'true') {
      setIsVisible(false);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('prominent-demo-banner-dismissed', 'true');
  };

  // Don't render on server or if dismissed
  if (!isClient || !isVisible) return null;

  return (
    <div className={`bg-gradient-to-br from-yellow-500 via-orange-500 to-red-500 text-white shadow-2xl ${className}`}>
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 mt-1">
              <div className="bg-white/20 p-2 rounded-full">
                <AlertTriangle className="h-6 w-6 animate-bounce" />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
                🎭 {title}
              </h3>
              <p className="text-sm sm:text-base font-medium leading-relaxed max-w-4xl">
                {message}
              </p>
              <div className="flex items-center gap-2 text-xs sm:text-sm bg-white/10 px-3 py-1 rounded-full w-fit">
                <Info className="h-4 w-4" />
                <span>No real money or actual trading is involved</span>
              </div>
            </div>
          </div>
          {dismissible && (
            <button
              onClick={handleDismiss}
              className="ml-4 p-2 hover:bg-white/20 rounded-full transition-all duration-200 flex-shrink-0 group"
              aria-label="Dismiss demo banner"
              title="Dismiss this notice"
            >
              <X className="h-5 w-5 group-hover:scale-110 transition-transform" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProminentDemoBanner;