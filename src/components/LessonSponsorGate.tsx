import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { ExternalLink, Sparkles, Coffee, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ADS_CONFIG } from '@/config/adsConfig';
import { evaluateLessonGate, resetFreeLessonCounter, unlockProLesson, isLessonPath } from '@/lib/lessonAds';

const SPONSOR_WAIT_SECONDS = 15;

function SponsorWaitStep({
  secondsLeft,
  onContinue,
  continueLabel,
  pro,
}: {
  secondsLeft: number;
  onContinue: () => void;
  continueLabel: string;
  pro: boolean;
}) {
  const ready = secondsLeft <= 0;

  if (ready) {
    return (
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-center gap-2 text-xs font-mono font-bold text-emerald-400">
          <CheckCircle2 className="h-4 w-4" /> SPONSOR VISIT COMPLETE
        </div>
        <Button
          className={`w-full font-bold shadow-lg ${pro ? 'gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 hover:brightness-110' : ''}`}
          onClick={onContinue}
        >
          {continueLabel}
        </Button>
        <p className="text-[11px] text-center text-muted-foreground">
          Thanks for supporting CodeSage — your lesson is unlocked.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 pt-2">
      <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-center space-y-1">
        <div className="font-display text-3xl font-bold text-amber-400 tabular-nums">{secondsLeft}s</div>
        <p className="text-xs leading-relaxed text-muted-foreground">
          Stay on the sponsor page — click <span className="font-semibold text-foreground">Verify you are human</span> if it appears. Your timer keeps running here; come back when it hits 0.
        </p>
      </div>
      <p className="text-[11px] text-center text-muted-foreground">
        Sponsor visits keep CodeSage 100% free for every student.
      </p>
    </div>
  );
}

function LessonEntry({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const [gateState, setGateState] = useState<{ shouldShow: boolean; isProGate: boolean } | null>(null);
  const [waitTarget, setWaitTarget] = useState<number | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(SPONSOR_WAIT_SECONDS);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    setGateState(evaluateLessonGate(pathname));
  }, [pathname]);

  useEffect(() => {
    if (waitTarget === null) return;
    const update = () => {
      const left = Math.max(0, Math.ceil((waitTarget - Date.now()) / 1000));
      setSecondsLeft(left);
      if (left <= 0 && timerRef.current !== null) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
    update();
    timerRef.current = window.setInterval(update, 1000);
    return () => {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [waitTarget]);

  if (gateState === null) return null;
  if (!gateState.shouldShow) return <>{children}</>;

  const handleSponsorClick = () => {
    setWaitTarget(Date.now() + SPONSOR_WAIT_SECONDS * 1000);
  };

  const handleProUnlock = () => {
    unlockProLesson(pathname);
    setGateState({ shouldShow: false, isProGate: true });
  };

  const handleFreeContinue = () => {
    resetFreeLessonCounter();
    setGateState({ shouldShow: false, isProGate: false });
  };

  if (gateState.isProGate) {
    return (
      <section className="min-h-[70vh] flex items-center justify-center px-4 py-8 bg-background">
        <div className="w-full max-w-md space-y-6 glass-card p-6 md:p-8 rounded-2xl border border-amber-500/40 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-500/20 to-transparent w-32 h-32 blur-2xl pointer-events-none" />

          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full">
            <Sparkles className="h-3.5 w-3.5" /> CODESAGE VERIFIED SPONSOR · PRO UNLOCK
          </div>

          <div className="space-y-2">
            <h1 className="font-display text-2xl font-bold text-foreground">
              Unlock Expert Lesson for Free
            </h1>
            <p className="text-sm leading-relaxed text-muted-foreground">
              This is an advanced industry track. Visit one verified sponsor deal for about 15 seconds to unlock full access — no payment, ever.
            </p>
          </div>

          {waitTarget === null ? (
            <div className="space-y-3 pt-2">
              <Button
                asChild
                className="w-full gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold hover:brightness-110 shadow-lg"
              >
                <a
                  href={ADS_CONFIG.defaultSponsorLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleSponsorClick}
                >
                  Unlock Lesson via Sponsor <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
              <div className="rounded-lg border border-border/50 bg-muted/40 p-3">
                <p className="text-[11px] leading-relaxed text-muted-foreground">
                  Heads up: the sponsor page may first show a quick <span className="font-semibold text-foreground">"Verify you are human"</span> check — that's normal, not an error. Click it, stay on the page for 15 seconds, then come back here.
                </p>
              </div>
            </div>
          ) : (
            <SponsorWaitStep
              secondsLeft={secondsLeft}
              onContinue={handleProUnlock}
              continueLabel="Continue to Lesson"
              pro
            />
          )}
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
            You completed 2 lessons! Visit our sponsor in a new tab for about 15 seconds to unlock your next lesson and keep CodeSage 100% free.
          </p>
        </div>

        {waitTarget === null ? (
          <div className="space-y-3 pt-2">
            <Button asChild className="w-full gap-2 shadow-lg">
              <a
                href={ADS_CONFIG.defaultSponsorLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleSponsorClick}
              >
                Visit Sponsor &amp; Continue to Lesson <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
            <div className="rounded-lg border border-border/50 bg-muted/40 p-3">
              <p className="text-[11px] leading-relaxed text-muted-foreground">
                If a <span className="font-semibold text-foreground">"Verify you are human"</span> page appears first, that's normal — click it and stay on the sponsor page for 15 seconds.
              </p>
            </div>
          </div>
        ) : (
          <SponsorWaitStep
            secondsLeft={secondsLeft}
            onContinue={handleFreeContinue}
            continueLabel="Continue to Lesson"
            pro={false}
          />
        )}
      </div>
    </section>
  );
}

export function LessonSponsorGate({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  if (isLessonPath(pathname)) return <LessonEntry key={pathname}>{children}</LessonEntry>;
  return <>{children}</>;
}
