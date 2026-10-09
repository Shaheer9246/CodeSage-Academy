import { useEffect, useState, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { ExternalLink, Sparkles, Coffee } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ADS_CONFIG } from '@/config/adsConfig';
import { evaluateLessonGate, resetFreeLessonCounter, unlockProLesson, isLessonPath } from '@/lib/lessonAds';
import { AdBannerCard } from '@/components/AdBannerCard';

function LessonEntry({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const [gateState, setGateState] = useState<{ shouldShow: boolean; isProGate: boolean } | null>(null);

  useEffect(() => {
    setGateState(evaluateLessonGate(pathname));
  }, [pathname]);

  if (gateState === null) return null;
  if (!gateState.shouldShow) return <>{children}</>;

  const handleProUnlock = () => {
    unlockProLesson(pathname);
    // Defer state update slightly so the browser completes opening the <a target="_blank"> tab first
    setTimeout(() => {
      setGateState({ shouldShow: false, isProGate: true });
    }, 150);
  };

  const handleFreeContinue = () => {
    resetFreeLessonCounter();
    // Defer state update slightly so the browser completes opening the <a target="_blank"> tab first
    setTimeout(() => {
      setGateState({ shouldShow: false, isProGate: false });
    }, 150);
  };

  if (gateState.isProGate) {
    return (
      <section className="min-h-[70vh] flex items-center justify-center px-4 py-8 bg-background">
        <div className="w-full max-w-md space-y-6 glass-card p-6 md:p-8 rounded-2xl border border-amber-500/40 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-500/20 to-transparent w-32 h-32 blur-2xl pointer-events-none" />
          
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full">
            <Sparkles className="h-3.5 w-3.5" /> PRO TRACK · SPONSOR UNLOCK
          </div>

          <div className="space-y-2">
            <h1 className="font-display text-2xl font-bold text-foreground">
              Unlock Expert Lesson for Free
            </h1>
            <p className="text-sm leading-relaxed text-muted-foreground">
              This is an advanced industry track. Support CodeSage free servers by visiting one sponsor deal to unlock full access immediately.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <Button 
              asChild
              className="w-full gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold hover:brightness-110 shadow-lg"
            >
              <a
                href={ADS_CONFIG.monetagDirectLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleProUnlock}
              >
                Unlock Lesson via Sponsor <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
            <p className="text-[11px] text-center text-muted-foreground">
              100% Free · Opens verified Monetag sponsor offer in a new tab
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-[65vh] flex items-center justify-center px-4 py-8 bg-background">
      <div className="w-full max-w-md space-y-6 glass-card p-6 rounded-2xl border border-border/50">
        <div className="flex items-center gap-2 text-xs font-mono text-primary">
          <Coffee className="h-4 w-4" /> 2-LESSON STUDY BREAK
        </div>
        <div className="space-y-2">
          <h1 className="font-display text-2xl font-bold text-foreground">A quick moment for CodeSage</h1>
          <p className="text-sm leading-relaxed text-muted-foreground">
            You completed 2 lessons! Visit our sponsor in a new tab to unlock your next lesson and keep CodeSage 100% free.
          </p>
        </div>
        <div className="space-y-3 pt-2">
          <Button asChild className="w-full gap-2 shadow-lg">
            <a
              href={ADS_CONFIG.monetagDirectLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleFreeContinue}
            >
              Visit Sponsor &amp; Continue to Lesson <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
          <p className="text-[11px] text-center text-muted-foreground">
            Opens official Monetag sponsor offer in a new tab &amp; unlocks your lesson
          </p>
        </div>
      </div>
    </section>
  );
}

export function LessonSponsorGate({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  if (isLessonPath(pathname)) return <LessonEntry key={pathname}>{children}</LessonEntry>;
  const isCompletion = /^\/complete\/[^/]+\/?$/.test(pathname) || /^\/lesson\/[^/]+\/complete\/?$/.test(pathname);
  return (
    <>
      {children}
      {isCompletion && (
        <div className="max-w-2xl mx-auto px-4 pb-8">
          <AdBannerCard slotName="dashboardContinueLearning" format="horizontal-banner" />
        </div>
      )}
    </>
  );
}
