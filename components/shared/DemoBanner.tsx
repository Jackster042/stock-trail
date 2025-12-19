"use client";

import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const DemoBanner = () => {
  const [isVisible, setIsVisible] = React.useState(true);
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
    // Check if user previously dismissed the banner
    const dismissed = localStorage.getItem('demo-banner-dismissed');
    if (dismissed === 'true') {
      setIsVisible(false);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('demo-banner-dismissed', 'true');
  };

  // Don't render on server or if dismissed
  if (!isClient || !isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 text-white shadow-lg border-b border-amber-500/30">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 animate-pulse" />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
              <span className="font-bold text-sm sm:text-base flex items-center gap-2">
                🎭 <span>DEMO MODE</span>
              </span>
              <div className="hidden sm:block w-px h-4 bg-white/30"></div>
              <span className="text-xs sm:text-sm font-medium">
                This is a <strong>demonstration website</strong>. All stock purchases, transactions, and portfolio data are <strong>simulated</strong> for demo purposes only.
              </span>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="ml-4 p-1.5 hover:bg-white/20 rounded-full transition-all duration-200 flex-shrink-0 group"
            aria-label="Dismiss demo banner"
            title="Dismiss this notice"
          >
            <X className="h-4 w-4 group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DemoBanner;