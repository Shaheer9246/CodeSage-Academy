import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Heart,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  ArrowLeft,
  Mail,
  Zap,
  Globe,
  Coins,
  Play,
  Clock,
  Radio,
  ArrowRight,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  ADS_CONFIG,
  MONETAG_DIRECT_LINK_1,
  MONETAG_DIRECT_LINK_2,
  MONETAG_INPAGE_SRC,
  MONETAG_INPAGE_ZONE,
  MONETAG_VIGNETTE_SRC,
  MONETAG_VIGNETTE_ZONE,
} from '@/config/adsConfig';
import { AdBannerCard } from '@/components/AdBannerCard';

interface SupportAdSlot {
  id: number;
  name: string;
  tag: string;
  headline: string;
  description: string;
  cta: string;
  url: string;
  zoneId: string;
  scriptSrc: string;
  displayDomain: string;
}

const SUPPORT_AD_DURATION = ADS_CONFIG.supportAdDurationSec || 30;
const STORAGE_KEY = 'codesage_support_ads_completed';

export default function SupportUsPage() {
  const navigate = useNavigate();
  const [copiedEmail, setCopiedEmail] = useState(false);

  const [completedAds, setCompletedAds] = useState<Record<number, boolean>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Active 30-second ad session state
  const [activeAdId, setActiveAdId] = useState<number | null>(null);
  const [secondsLeft, setSecondsLeft] = useState<number>(SUPPORT_AD_DURATION);
  const [adFinished, setAdFinished] = useState<boolean>(false);
  const [adClickedAfterFinish, setAdClickedAfterFinish] = useState<boolean>(false);

  // Real Monetag Support Ad Slots using your 2 Direct Links & 2 Visual Zones
  const adSlots: SupportAdSlot[] = useMemo(
    () => [
      {
        id: 1,
        name: 'Support Ad #1 · Monetag Direct #11911757',
        tag: 'Support Ad #1 · Live Feed',
        headline: 'Sponsor Ad #1 (Positive Link · #11911757)',
        description:
          'Watch this 30-second live sponsor ad powered by Monetag Direct Link #11911757 to help fund CodeSage student servers.',
        cta: 'Start 30s Support Ad #1',
        url: MONETAG_DIRECT_LINK_1,
        zoneId: MONETAG_VIGNETTE_ZONE,
        scriptSrc: MONETAG_VIGNETTE_SRC,
        displayDomain: 'omg10.com/4/11911757',
      },
      {
        id: 2,
        name: 'Support Ad #2 · Monetag Direct #11858088',
        tag: 'Support Ad #2 · Live Feed',
        headline: 'Sponsor Ad #2 (Joyful Link · #11858088)',
        description:
          'Watch this 30-second live sponsor ad powered by Monetag Direct Link #11858088 to keep all 18 coding tracks free.',
        cta: 'Start 30s Support Ad #2',
        url: MONETAG_DIRECT_LINK_2,
        zoneId: MONETAG_INPAGE_ZONE,
        scriptSrc: MONETAG_INPAGE_SRC,
        displayDomain: 'omg10.com/4/11858088',
      },
      {
        id: 3,
        name: 'Support Ad #3 · Monetag Vignette & SmartLink',
        tag: 'Support Ad #3 · Live Feed',
        headline: 'Sponsor Ad #3 (Vignette #11911764 + Direct Link)',
        description:
          'Complete the 3rd daily 30-second sponsor ad stream to support CodeSage domain and database hosting.',
        cta: 'Start 30s Support Ad #3',
        url: MONETAG_DIRECT_LINK_1,
        zoneId: MONETAG_VIGNETTE_ZONE,
        scriptSrc: MONETAG_VIGNETTE_SRC,
        displayDomain: 'omg10.com/4/11911757 · #11911764',
      },
    ],
    []
  );

  // 30-second countdown timer when a support ad is running
  useEffect(() => {
    if (activeAdId === null || adFinished) return;

    const timer = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer);
          setAdFinished(true);
          setCompletedAds((old) => {
            const updated = { ...old, [activeAdId]: true };
            try {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            } catch {}
            return updated;
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [activeAdId, adFinished]);

  const handleStartSupportAd = (adId: number) => {
    setActiveAdId(adId);
    setSecondsLeft(SUPPORT_AD_DURATION);
    setAdFinished(false);
    setAdClickedAfterFinish(false);
  };

  const handleCloseSupportPlayer = () => {
    setActiveAdId(null);
    setAdFinished(false);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(ADS_CONFIG.supportContacts.adminEmail);
    setCopiedEmail(true);
    toast.success('Admin email copied to clipboard!');
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const completedCount = adSlots.filter((a) => completedAds[a.id]).length;
  const remainingAds = adSlots.filter((a) => !completedAds[a.id]);
  const remainingCount = remainingAds.length;
  const activeAd = adSlots.find((a) => a.id === activeAdId) || null;
  const progressPct = Math.round(
    ((SUPPORT_AD_DURATION - secondsLeft) / SUPPORT_AD_DURATION) * 100
  );

  // Sandboxed visual zone HTML that runs strictly inside the Support Player box
  const activeZoneSrcDoc = useMemo(() => {
    if (!activeAd) return '';
    return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>html,body{margin:0;padding:0;width:100%;height:100%;overflow:hidden;background:transparent;}</style>
</head>
<body>
  <script>
    (function(s){
      s.dataset.zone='${activeAd.zoneId}';
      s.src='${activeAd.scriptSrc}';
    })([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')));
  </script>
</body>
</html>`;
  }, [activeAd]);

  return (
    <div className="min-h-screen bg-background text-foreground py-8 px-4 sm:px-6 max-w-4xl mx-auto space-y-7 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-border/40 pb-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold bg-secondary/60 hover:bg-secondary text-foreground transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Academy</span>
        </button>

        <div className="flex items-center gap-1.5 text-xs font-mono text-pink-400">
          <Heart className="w-4 h-4 fill-pink-500/20" />
          <span>Community Supported</span>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="text-center space-y-3 py-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/25 text-pink-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>100% Free Education For All Students</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-bold font-display tracking-tight text-foreground">
          Support &amp; Keep CodeSage Free
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          CodeSage is completely free for everyone. You can help fund our student servers and domain renewals by running the 3 live 30-second sponsor ads below or via direct support.
        </p>
      </div>

      {/* CONTINUOUS LIVE RUNNING AD BANNER ON SUPPORT PAGE */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between px-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 font-semibold">
            <Radio className="w-3 h-3 animate-pulse" />
            Live Running Monetag Banner (Zones #11911764 &amp; #11911770)
          </span>
          <span className="text-[10px] font-mono text-muted-foreground">
            Real-time advertiser stream
          </span>
        </div>
        <AdBannerCard slotName="supportPageTop" format="horizontal-banner" />
      </div>

      {/* SECTION 1: 3 SUPPORT AD BUTTONS + 30-SECOND LIVE VISUAL AD PLAYER */}
      <div className="rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 via-card to-secondary/30 p-5 sm:p-7 space-y-5 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <h2 className="text-lg font-bold font-display text-foreground flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              <span>Free Support: Watch 3 Real Sponsor Ads (30s Each)</span>
            </h2>
            <p className="text-xs text-muted-foreground">
              Click any of the 3 support buttons below to run a real 30-second Monetag sponsor ad. When the 30-second timer finishes, kindly click on the ad and come back to see the remaining ads!
            </p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
            <div className="px-3 py-1.5 rounded-xl bg-primary/20 border border-primary/40 text-primary text-xs font-mono font-bold">
              {completedCount} / 3 Completed
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-secondary/60 border border-border/50 text-muted-foreground text-xs font-mono">
              {remainingCount} Remaining
            </div>
          </div>
        </div>

        {/* ACTIVE 30-SECOND LIVE VISUAL AD RUNNER BOX */}
        {activeAd && (
          <div className="rounded-2xl border-2 border-primary/60 bg-background/95 p-4 sm:p-6 space-y-4 shadow-xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Sandboxed Monetag visual zone runner inside the player */}
            <iframe
              title={`support-zone-${activeAd.id}`}
              srcDoc={activeZoneSrcDoc}
              sandbox="allow-scripts allow-same-origin"
              className="w-0 h-0 opacity-0 pointer-events-none absolute"
              aria-hidden="true"
              tabIndex={-1}
            />

            {/* Top Progress Bar */}
            <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary via-emerald-400 to-accent transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>

            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  <Radio className="w-3 h-3 animate-pulse" />
                  {adFinished ? 'AD COMPLETED' : 'REAL AD RUNNING LIVE'}
                </span>
                <span className="text-xs font-mono text-muted-foreground">
                  {activeAd.name}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {!adFinished ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/15 border border-primary/30 text-primary text-xs font-mono font-bold">
                    <Clock className="w-3.5 h-3.5 animate-spin" />
                    {secondsLeft}s remaining
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    30s Finished!
                  </span>
                )}
                <button
                  type="button"
                  onClick={handleCloseSupportPlayer}
                  className="p-1.5 rounded-lg bg-secondary/60 hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                  title="Close Ad Player"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* REAL LIVE VISUAL AD VIEWPORT (Strictly sandboxed so it never hijacks or redirects your app) */}
            <div className="relative w-full h-72 sm:h-80 rounded-xl overflow-hidden border-2 border-primary/40 bg-black/40 shadow-inner">
              <iframe
                key={`live-support-ad-${activeAd.id}`}
                title={`Monetag Live Support Ad ${activeAd.id}`}
                src={activeAd.url}
                sandbox="allow-scripts allow-same-origin allow-forms"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full border-0 bg-white"
              />
              <div className="absolute bottom-2 right-2 z-10 flex items-center gap-2">
                <a
                  href={activeAd.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    setAdClickedAfterFinish(true);
                    toast.success('Thank you for clicking the sponsor ad and supporting CodeSage! 💚');
                  }}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold font-display bg-primary text-primary-foreground hover:neon-glow transition-all inline-flex items-center gap-1.5 shadow-lg"
                >
                  <span>Open Full Advertiser Page</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* 30-SECOND COMPLETION MESSAGE */}
            {!adFinished ? (
              <div className="p-3 rounded-xl bg-secondary/40 border border-border/50 text-center">
                <p className="text-xs text-muted-foreground font-mono">
                  ⏳ Watching live sponsor ad... <strong className="text-primary">{secondsLeft} seconds</strong> remaining.
                </p>
              </div>
            ) : (
              <div className="p-4 sm:p-5 rounded-xl bg-emerald-500/10 border border-emerald-500/40 space-y-3 animate-in fade-in duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <h4 className="text-sm sm:text-base font-bold font-display text-emerald-300 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      <span>Thank you for your support! 💚</span>
                    </h4>
                    <p className="text-xs sm:text-sm text-foreground font-medium leading-relaxed">
                      Kindly click on this ad and come back. See the remaining ads for the platform!
                    </p>
                    <p className="text-[11px] font-mono text-emerald-400/90">
                      {remainingCount > 0
                        ? `You have ${remainingCount} remaining support ad${remainingCount > 1 ? 's' : ''} for the platform.`
                        : '🎉 Amazing! You have completed all 3 support ads for the platform today!'}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <a
                      href={activeAd.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => {
                        setAdClickedAfterFinish(true);
                        toast.success('Thank you for clicking the sponsor ad and supporting CodeSage! 💚');
                      }}
                      className="px-4 py-2.5 rounded-xl text-xs font-bold font-display bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-all inline-flex items-center gap-1.5 shadow-md"
                    >
                      <span>{adClickedAfterFinish ? '✓ Ad Clicked (Thank You!)' : 'Click on This Ad & Come Back'}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    {remainingAds.length > 0 && (
                      <button
                        type="button"
                        onClick={() => handleStartSupportAd(remainingAds[0].id)}
                        className="px-3.5 py-2.5 rounded-xl text-xs font-bold font-display bg-primary/20 hover:bg-primary/30 text-primary border border-primary/40 transition-all inline-flex items-center gap-1.5"
                      >
                        <span>Watch Next Ad (#{remainingAds[0].id})</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 3 Support Ad Buttons / Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {adSlots.map((ad) => {
            const isDone = Boolean(completedAds[ad.id]);
            const isRunning = activeAdId === ad.id && !adFinished;

            return (
              <div
                key={ad.id}
                className={`p-4 rounded-xl border transition-all flex flex-col justify-between space-y-3 ${
                  isRunning
                    ? 'bg-primary/15 border-primary shadow-md'
                    : isDone
                    ? 'bg-emerald-500/10 border-emerald-500/30'
                    : 'bg-card/70 border-border/50 hover:border-primary/50'
                }`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      {ad.tag}
                    </span>
                    {isRunning ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono text-primary font-bold">
                        <Clock className="w-3 h-3 animate-spin" /> {secondsLeft}s
                      </span>
                    ) : isDone ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 font-bold">
                        <CheckCircle2 className="w-3 h-3" /> Completed
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-muted-foreground">
                        30s Live Ad
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-semibold text-foreground leading-snug">
                    {ad.headline}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {ad.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-border/30 space-y-2">
                  <button
                    type="button"
                    onClick={() => handleStartSupportAd(ad.id)}
                    className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm ${
                      isRunning
                        ? 'bg-primary text-primary-foreground animate-pulse'
                        : isDone
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                        : 'bg-primary text-primary-foreground hover:bg-primary/90'
                    }`}
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>
                      {isRunning
                        ? `Running Ad (${secondsLeft}s)...`
                        : isDone
                        ? 'Run 30s Ad Again'
                        : ad.cta}
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION: RUN ADS ON YOUR OWN WEBSITE FOR FREE (USER'S MONETAG REFERRAL) */}
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
              Have you built a student project, blog, or web application? Join Monetag's publisher network to monetize your visitors from day one with in-page push banners, multi-format tags, and high CPM instant payouts.
            </p>
          </div>
          <a
            href={ADS_CONFIG.monetagReferralLink}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 px-5 py-3 rounded-xl text-xs font-bold font-display bg-gradient-to-r from-primary to-accent text-primary-foreground hover:neon-glow transition-all flex items-center justify-center gap-2 shadow-md"
          >
            <span>Monetize My Site (Free)</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* SECTION 2: DIRECT DONATION (CONTACT ADMIN FOR SECURE DETAILS) */}
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
