import React, { useState } from 'react';
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
  Coins
} from 'lucide-react';
import { toast } from 'sonner';
import { ADS_CONFIG } from '@/config/adsConfig';

export default function SupportUsPage() {
  const navigate = useNavigate();
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [visitedAds, setVisitedAds] = useState<Record<number, boolean>>({});

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(ADS_CONFIG.supportContacts.adminEmail);
    setCopiedEmail(true);
    toast.success('Admin email copied to clipboard!');
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleOpenAd = (adIndex: number, url: string) => {
    setVisitedAds(prev => ({ ...prev, [adIndex]: true }));
    window.open(url, '_blank', 'noopener,noreferrer');
    toast.success(`Thank you! Sponsor #${adIndex} opened in a new tab.`, {
      description: 'You can come right back if you are not interested!'
    });
  };

  const adSlots = [
    {
      id: 1,
      name: 'Monetag High-Yield Network Sponsor',
      tag: 'Global Ad Partner #1',
      headline: 'Next-Gen Developer Cloud & API Hosting',
      description: 'Deploy full-stack projects, databases, and microservices in seconds with global edge nodes.',
      cta: 'Click & View Sponsor (Takes 10s)',
      url: 'https://monetag.com/?ref_id=codesage',
    },
    {
      id: 2,
      name: 'EthicalAds Developer Network',
      tag: 'Privacy-First Dev Tool #2',
      headline: 'Modern AI Code Completion & Git Workflows',
      description: 'Lightweight AI coding assistant, syntax visualizer, and debugging copilot for modern engineers.',
      cta: 'Click & View Sponsor (Takes 10s)',
      url: 'https://www.ethicalads.io/?ref=codesage',
    },
    {
      id: 3,
      name: 'Tech & Hosting Affiliate Showcase',
      tag: 'Infrastructure Partner #3',
      headline: 'Enterprise Cloud Databases & SSL Domains',
      description: 'Get exclusive student credits on custom domains, high-speed VPS, and PostgreSQL instances.',
      cta: 'Click & View Sponsor (Takes 10s)',
      url: 'https://codesageacademy.netlify.app',
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground py-8 px-4 sm:px-6 max-w-4xl mx-auto space-y-8 animate-in fade-in duration-200">
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
      <div className="text-center space-y-3 py-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/25 text-pink-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>100% Free Education For All Students</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-bold font-display tracking-tight text-foreground">
          Donate &amp; Keep CodeSage Free
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          CodeSage is completely free for everyone. You can support our server costs, domain renewals, and AI credits either by spending 1 minute viewing our sponsor ads, or contacting our admin directly.
        </p>
      </div>

      {/* SECTION 1: DONATE BY VIEWING / CLICKING ADS */}
      <div className="rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 via-card to-secondary/30 p-5 sm:p-7 space-y-5 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <h2 className="text-lg font-bold font-display text-foreground flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              <span>Free Support: View &amp; Click 3 Sponsor Ads</span>
            </h2>
            <p className="text-xs text-muted-foreground">
              Takes just 1 minute! Simply click the sponsor offers below, explore them, and come back. Every view pays for student servers.
            </p>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-primary/20 border border-primary/40 text-primary text-xs font-mono font-bold self-start sm:self-center shrink-0">
            {Object.keys(visitedAds).length} / 3 Completed
          </div>
        </div>

        {/* 3 Prominent Ad Containers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {adSlots.map((ad, idx) => {
            const isDone = visitedAds[ad.id];
            return (
              <div
                key={ad.id}
                className={`p-4 rounded-xl border transition-all flex flex-col justify-between space-y-3 ${
                  isDone
                    ? 'bg-emerald-500/10 border-emerald-500/30'
                    : 'bg-card/70 border-border/50 hover:border-primary/50'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
                      {ad.tag}
                    </span>
                    {isDone && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 font-bold">
                        <CheckCircle2 className="w-3 h-3" /> Done
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
                  <p className="text-[10px] text-muted-foreground/80 italic">
                    💡 Click, see the sponsor page, and come right back if not interested.
                  </p>
                  <button
                    type="button"
                    onClick={() => handleOpenAd(ad.id, ad.url)}
                    className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm ${
                      isDone
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                        : 'bg-primary text-primary-foreground hover:bg-primary/90'
                    }`}
                  >
                    <span>{isDone ? 'View Again' : ad.cta}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
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
