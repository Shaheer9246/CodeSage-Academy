import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ExternalLink, ArrowLeft, Coins, Mail, Globe, ShieldCheck, Check, Copy, Sparkles, CheckCircle2, Server, Cloud, Code } from 'lucide-react';
import { toast } from 'sonner';
import { ADS_CONFIG } from '@/config/adsConfig';
import { Button } from '@/components/ui/button';

interface VoluntaryCard {
  id: string;
  icon: typeof Server;
  badge: string;
  title: string;
  description: string;
  cta: string;
}

const VOLUNTARY_CARDS: VoluntaryCard[] = [
  {
    id: 'server-boost',
    icon: Server,
    badge: 'Voluntary Server Boost',
    title: 'Quick 15s Sponsor Visit',
    description: 'Spend 15 seconds viewing a verified sponsor offer to directly fund free in-browser code execution and Docker sandboxes for students.',
    cta: 'Visit Sponsor (15s)',
  },
  {
    id: 'cloud-tools',
    icon: Cloud,
    badge: 'Developer Cloud Perks',
    title: 'Explore Dev Tools & Cloud Credits',
    description: 'Discover developer infrastructure, cloud hostings, and exclusive partner promotions that keep CodeSage 100% accessible.',
    cta: 'Explore Dev Deals (15s)',
  },
  {
    id: 'global-access',
    icon: Code,
    badge: 'Global Education Fund',
    title: 'Support Free Student Learning',
    description: 'Help ensure aspiring software engineers worldwide can learn full-stack, AI, and systems programming without paywalls.',
    cta: 'Support Academy (15s)',
  },
];

export default function SupportUsPage() {
  const navigate = useNavigate();
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [activeTimers, setActiveTimers] = useState<Record<string, number>>({});
  const timerIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    const hasActive = Object.values(activeTimers).some(sec => sec > 0);
    if (!hasActive) {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      return;
    }

    timerIntervalRef.current = window.setInterval(() => {
      setActiveTimers(prev => {
        const next: Record<string, number> = { ...prev };
        for (const key of Object.keys(next)) {
          if (next[key] > 0) {
            next[key] -= 1;
          }
        }
        return next;
      });
    }, 1000);

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [activeTimers]);

  const handleStartTimer = (cardId: string) => {
    setActiveTimers(prev => ({ ...prev, [cardId]: 15 }));
  };

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(ADS_CONFIG.supportContacts.adminEmail);
      setCopiedEmail(true);
      toast.success('Admin email copied!');
    } catch {
      toast.error('Could not copy. Please select the email address instead.');
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-8 px-4 sm:px-6 max-w-4xl mx-auto space-y-7">
      <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2">
        <ArrowLeft className="h-4 w-4" /> Back to Academy
      </Button>

      <header className="space-y-3 border-b border-border pb-6">
        <p className="flex items-center gap-2 text-xs font-mono text-primary">
          <Heart className="h-4 w-4 text-primary" /> COMMUNITY SUPPORTED
        </p>
        <h1 className="text-2xl font-bold font-display">Support CodeSage</h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Learning stays 100% free. Sponsor visits and direct contributions are completely voluntary.
        </p>
      </header>

      {/* 3 VOLUNTARY SPONSOR ACTION CARDS WITH 15-SECOND COUNTDOWN */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold font-display uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" /> Voluntary Sponsor Actions
          </h2>
          <span className="text-[11px] font-mono text-muted-foreground">15s per visit · No payment needed</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {VOLUNTARY_CARDS.map(card => {
            const Icon = card.icon;
            const secondsLeft = activeTimers[card.id];
            const isRunning = typeof secondsLeft === 'number' && secondsLeft > 0;
            const isDone = typeof secondsLeft === 'number' && secondsLeft === 0;

            return (
              <div
                key={card.id}
                className="rounded-2xl border border-border/60 bg-card/60 p-5 flex flex-col justify-between space-y-4 relative overflow-hidden transition-all hover:border-primary/40 shadow-sm"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-secondary text-muted-foreground border border-border/40">
                      {card.badge}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold font-display text-foreground pt-1">{card.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{card.description}</p>
                </div>

                <div className="pt-2">
                  {isDone ? (
                    <div className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                      <CheckCircle2 className="w-4 h-4" /> Thanks for supporting!
                    </div>
                  ) : isRunning ? (
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-amber-400 font-bold">Verifying visit...</span>
                        <span className="text-amber-400 font-bold tabular-nums">{secondsLeft}s</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-amber-400 h-1.5 rounded-full transition-all duration-1000"
                          style={{ width: `${((15 - secondsLeft) / 15) * 100}%` }}
                        />
                      </div>
                      <p className="text-[10px] text-center text-muted-foreground">Keep the partner tab open</p>
                    </div>
                  ) : (
                    <Button
                      asChild
                      size="sm"
                      className="w-full gap-2 shadow-sm font-semibold text-xs"
                      onClick={() => handleStartTimer(card.id)}
                    >
                      <a href={ADS_CONFIG.defaultSponsorLink} target="_blank" rel="noopener noreferrer">
                        <span>{card.cta}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION: RUN ADS ON YOUR OWN WEBSITE (VERIFIED DEVELOPER SPONSOR NETWORK) */}
      <div className="rounded-2xl border border-primary/40 bg-gradient-to-r from-primary/15 via-card/90 to-amber-500/10 p-5 sm:p-7 space-y-4 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                ⭐ Developer Tool &amp; Partner
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-primary/20 text-primary border border-primary/30 font-semibold">
                100% Free Setup
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold font-display text-foreground flex items-center gap-2">
              🚀 Run Ads &amp; Monetize Your Own Website or Web App
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Have you built a student project, blog, or web application? Join our Verified Developer Sponsor network to monetize your visitors from day one with in-page banners, smart links, and high CPM instant payouts.
            </p>
          </div>
          <a
            href={ADS_CONFIG.defaultSponsorLink}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 px-5 py-3 rounded-xl text-xs font-bold font-display bg-gradient-to-r from-primary to-accent text-primary-foreground hover:neon-glow transition-all flex items-center justify-center gap-2 shadow-md"
          >
            <span>Monetize My Site (Free)</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* SECTION 2: DIRECT DONATION */}
      <div className="rounded-2xl border border-border/60 bg-card/80 p-5 sm:p-7 space-y-5">
        <div className="space-y-1">
          <h2 className="text-lg font-bold font-display text-foreground flex items-center gap-2">
            <Coins className="w-5 h-5 text-amber-400" />
            <span>Direct Financial Support (JazzCash &amp; Binance USDT)</span>
          </h2>
          <p className="text-xs text-muted-foreground">
            To prevent fraud and protect students, payment details are provided securely by the platform administrator.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* JazzCash (Pakistan) */}
          <div className="p-4 rounded-xl bg-secondary/30 border border-border/40 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400 font-bold text-xs font-mono">
                JC
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">Pakistan Direct (JazzCash)</h3>
                <p className="text-[11px] text-muted-foreground">Instant 0% local fee</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              For Pakistani students supporting server hosting, contact admin directly to receive the verified JazzCash account number.
            </p>
            <a
              href={`mailto:${ADS_CONFIG.supportContacts.adminEmail}?subject=CodeSage%20JazzCash%20Donation&body=Hi%20Admin,%20I%20want%20to%20support%20CodeSage%20via%20JazzCash.`}
              className="inline-flex w-full items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-300 transition-all"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Contact Admin for JazzCash Details</span>
            </a>
          </div>

          {/* Binance & International */}
          <div className="p-4 rounded-xl bg-secondary/30 border border-border/40 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-yellow-500/15 border border-yellow-500/30 flex items-center justify-center text-yellow-400 font-bold text-xs font-mono">
                BN
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">India, Bangladesh, Nepal &amp; Global (Binance)</h3>
                <p className="text-[11px] text-muted-foreground">Binance Pay ID / USDT (TRC-20)</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              International students and developers can donate zero-fee crypto via Binance Pay or USDT. Reach out for verified wallet details.
            </p>
            <a
              href={`mailto:${ADS_CONFIG.supportContacts.adminEmail}?subject=CodeSage%20Binance%20Donation&body=Hi%20Admin,%20I%20want%20to%20support%20CodeSage%20via%20Binance%20Pay/USDT.`}
              className="inline-flex w-full items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold bg-yellow-500/15 hover:bg-yellow-500/25 border border-yellow-500/30 text-yellow-300 transition-all"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Contact Admin for Binance Pay Details</span>
            </a>
          </div>
        </div>

        {/* Administrator Contact Info Box */}
        <div className="p-3.5 rounded-xl bg-background/60 border border-border/50 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-muted-foreground">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span>Administrator Email: <strong className="text-foreground font-mono">{ADS_CONFIG.supportContacts.adminEmail}</strong></span>
          </div>
          <button
            type="button"
            onClick={handleCopyEmail}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-secondary hover:bg-secondary/80 text-foreground transition-all"
          >
            {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedEmail ? 'Copied' : 'Copy Email'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
