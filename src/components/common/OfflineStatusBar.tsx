import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi, RefreshCw } from 'lucide-react';

export const OfflineStatusBar: React.FC = () => {
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [showRestoredBanner, setShowRestoredBanner] = useState<boolean>(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowRestoredBanner(true);
      const timer = setTimeout(() => {
        setShowRestoredBanner(false);
      }, 3500);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowRestoredBanner(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline && !showRestoredBanner) {
    return null;
  }

  if (showRestoredBanner) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="w-full bg-emerald-600 text-white text-xs font-bold py-1.5 px-4 text-center flex items-center justify-center gap-2 shadow-md transition-all animate-fadeIn"
      >
        <Wifi size={14} className="animate-pulse" />
        <span>Connection Restored! Local learning progress synced.</span>
      </div>
    );
  }

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="w-full bg-amber-600 dark:bg-amber-700 text-white text-xs font-semibold py-2 px-4 flex items-center justify-between shadow-md transition-all select-none"
    >
      <div className="flex items-center gap-2 mx-auto sm:mx-0">
        <WifiOff size={15} className="shrink-0" />
        <span>
          <strong>Working Offline.</strong> Lessons, grammar guides & flashcards remain fully accessible. Spoken audio will sync once reconnected.
        </span>
      </div>

      <button
        type="button"
        onClick={() => setIsOnline(navigator.onLine)}
        className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-black/20 hover:bg-black/30 text-[11px] font-bold transition-colors"
      >
        <RefreshCw size={12} />
        <span>Retry</span>
      </button>
    </div>
  );
};
