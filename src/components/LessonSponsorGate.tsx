import { useEffect, useState, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { ArrowRight, ExternalLink, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ADS_CONFIG } from '@/config/adsConfig';
import { claimLessonSponsor, isLessonPath } from '@/lib/lessonAds';
import { AdBannerCard } from '@/components/AdBannerCard';

function LessonEntry({ children }: { children: ReactNode }) {
  const [showSponsor, setShowSponsor] = useState<boolean | null>(null);

  useEffect(() => {
    // Set up once per entry, including React StrictMode's effect replay.
    let claimed: boolean | undefined;
    setShowSponsor(previous => {
      if (previous !== null) return previous;
      claimed ??= claimLessonSponsor();
      return claimed;
    });
  }, []);

  if (showSponsor === null) return null;
  if (!showSponsor) return <>{children}</>;

  return (
    <section className="min-h-[65vh] flex items-center justify-center px-4 py-8 bg-background" aria-labelledby="lesson-sponsor-title">
      <div className="w-full max-w-md space-y-6">
        <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
          <Heart className="h-4 w-4 text-primary" /> SPONSORED
        </div>
        <div className="space-y-3">
          <h1 id="lesson-sponsor-title" className="font-display text-2xl font-bold text-foreground">A moment for CodeSage</h1>
          <p className="text-sm leading-relaxed text-muted-foreground">An optional sponsor offer before your lesson. Your lesson is free either way.</p>
        </div>
        <div className="space-y-3">
          <Button asChild variant="outline" className="w-full gap-2">
            <a href={ADS_CONFIG.monetagDirectLink} target="_blank" rel="noopener noreferrer">Explore sponsor offer <ExternalLink className="h-4 w-4" /></a>
          </Button>
          <Button className="w-full gap-2" onClick={() => setShowSponsor(false)}>Continue to lesson <ArrowRight className="h-4 w-4" /></Button>
        </div>
        <p className="text-xs leading-relaxed text-muted-foreground">Advertisement via Monetag. Offers vary and open in a separate tab.</p>
      </div>
    </section>
  );
}

export function LessonSponsorGate({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  if (isLessonPath(pathname)) return <LessonEntry key={pathname}>{children}</LessonEntry>;
  const isCompletion = /^\/complete\/[^/]+\/?$/.test(pathname) || /^\/lesson\/[^/]+\/complete\/?$/.test(pathname);
  return <>{children}{isCompletion && <div className="max-w-2xl mx-auto px-4 pb-8"><AdBannerCard slotName="dashboardContinueLearning" format="horizontal-banner" /></div>}</>;
}