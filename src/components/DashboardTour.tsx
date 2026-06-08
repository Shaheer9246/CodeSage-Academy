import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronRight, X } from 'lucide-react';

export interface TourStep {
  target: string; // data-tour value
  title: string;
  body: string;
}

interface Props {
  steps: TourStep[];
  onFinish: () => void;
}

const PAD = 8;

export default function DashboardTour({ steps, onFinish }: Props) {
  const [i, setI] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const step = steps[i];

  const measure = useCallback(() => {
    if (!step) return;
    const el = document.querySelector<HTMLElement>(`[data-tour="${step.target}"]`);
    if (!el) { setRect(null); return; }
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    // wait for scroll to settle
    setTimeout(() => {
      const r = el.getBoundingClientRect();
      setRect(r);
    }, 350);
  }, [step]);

  useLayoutEffect(() => {
    measure();
  }, [measure]);

  useEffect(() => {
    const onResize = () => measure();
    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onResize, true);
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onResize, true);
    };
    // eslint-disable-next-line
  }, [i]);

  // Lock body scroll while tour is active
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  const next = () => {
    if (i < steps.length - 1) setI(i + 1);
    else onFinish();
  };

  if (!step) return null;

  // Position the tooltip below or above the highlighted element
  const vh = window.innerHeight;
  const vw = window.innerWidth;
  const tooltipBelow = rect ? rect.bottom + 16 + 180 < vh : true;
  const tooltipTop = rect
    ? tooltipBelow ? rect.bottom + 16 : Math.max(16, rect.top - 16 - 180)
    : vh / 2 - 90;
  const tooltipLeft = rect
    ? Math.min(Math.max(16, rect.left + rect.width / 2 - 160), vw - 336)
    : vw / 2 - 160;

  return createPortal(
    <div className="fixed inset-0 z-[100] pointer-events-none">
      {/* Dim mask with spotlight cutout via box-shadow */}
      {rect && (
        <div
          className="fixed rounded-2xl pointer-events-none transition-all duration-300"
          style={{
            top: rect.top - PAD,
            left: rect.left - PAD,
            width: rect.width + PAD * 2,
            height: rect.height + PAD * 2,
            boxShadow: '0 0 0 9999px rgba(0,0,0,0.78)',
            outline: '2px solid hsl(var(--primary))',
            outlineOffset: 0,
          }}
        />
      )}
      {!rect && (
        <div className="fixed inset-0 bg-black/78" />
      )}

      {/* Top-right skip */}
      <button
        onClick={onFinish}
        className="fixed top-4 right-4 pointer-events-auto bg-card/90 backdrop-blur border border-border/50 text-foreground text-xs font-display font-semibold px-3 py-1.5 rounded-full flex items-center gap-1 hover:bg-secondary transition-all"
      >
        Skip tour <X className="w-3 h-3" />
      </button>

      {/* Tooltip */}
      <div
        className="fixed pointer-events-auto w-[320px] glass-card rounded-2xl p-4 border border-primary/40 neon-glow"
        style={{ top: tooltipTop, left: tooltipLeft }}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
            Step {i + 1} of {steps.length}
          </span>
          <div className="flex gap-1">
            {steps.map((_, idx) => (
              <div key={idx} className={`w-1.5 h-1.5 rounded-full ${idx <= i ? 'bg-primary' : 'bg-secondary'}`} />
            ))}
          </div>
        </div>
        <h3 className="text-base font-display font-bold text-foreground mb-1">{step.title}</h3>
        <p className="text-xs text-muted-foreground leading-relaxed mb-3">{step.body}</p>
        <div className="flex gap-2">
          <button
            onClick={onFinish}
            className="flex-1 text-xs font-display font-semibold py-2 rounded-xl border border-border/60 text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all"
          >
            Skip
          </button>
          <button
            onClick={next}
            className="flex-1 bg-primary text-primary-foreground text-xs font-display font-bold py-2 rounded-xl flex items-center justify-center gap-1 hover:neon-glow transition-all"
          >
            {i === steps.length - 1 ? 'Finish' : 'Next'}
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
