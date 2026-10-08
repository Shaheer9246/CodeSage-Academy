import React, { useEffect, useState } from 'react';
import { Download, X, Smartphone, Share } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const DISMISSED_KEY = 'codesage_pwa_install_dismissed';

export function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSTip, setShowIOSTip] = useState(false);

  useEffect(() => {
    // 1. If already installed in standalone mode, do not show
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches 
      || (navigator as unknown as { standalone?: boolean }).standalone === true;
    if (isStandalone) return;

    // 2. If user dismissed in the last 7 days, don't nag them
    const dismissedTime = localStorage.getItem(DISMISSED_KEY);
    if (dismissedTime && Date.now() - parseInt(dismissedTime, 10) < 7 * 24 * 60 * 60 * 1000) {
      return;
    }

    // 3. Detect iOS Safari (Apple doesn't support beforeinstallprompt)
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    // 4. Capture native Chromium install prompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // On iOS, show after 3 seconds if never dismissed
    let timer: NodeJS.Timeout;
    if (isIosDevice) {
      timer = setTimeout(() => setIsVisible(true), 3000);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      if (timer) clearTimeout(timer);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSTip(true);
      return;
    }

    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === 'accepted') {
      setIsVisible(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem(DISMISSED_KEY, String(Date.now()));
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:max-w-sm z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="glass-card p-4 rounded-2xl border border-primary/30 shadow-2xl bg-background/95 backdrop-blur-md relative overflow-hidden">
        <button 
          onClick={handleDismiss}
          className="absolute top-2.5 right-2.5 text-muted-foreground hover:text-foreground p-1 rounded-full transition-colors"
          aria-label="Dismiss install prompt"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/20 text-primary flex items-center justify-center shrink-0 mt-0.5">
            <Smartphone className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0 pr-4">
            <h4 className="text-sm font-bold text-foreground">Install CodeSage App</h4>
            <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
              Fast, full-screen learning without browser tabs. Works offline!
            </p>
          </div>
        </div>

        {showIOSTip ? (
          <div className="mt-3 p-2.5 rounded-xl bg-secondary/50 border border-border text-[11px] text-muted-foreground flex items-center gap-2">
            <Share className="w-4 h-4 text-primary shrink-0" />
            <span>Tap <strong>Share</strong> in Safari, then choose <strong>&quot;Add to Home Screen&quot;</strong>.</span>
          </div>
        ) : (
          <div className="mt-3 flex items-center gap-2">
            <Button 
              size="sm" 
              onClick={handleInstallClick} 
              className="flex-1 gap-1.5 text-xs font-bold shadow-md"
            >
              <Download className="w-3.5 h-3.5" /> Install App
            </Button>
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={handleDismiss} 
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Later
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
