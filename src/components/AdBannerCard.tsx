import React, { useState } from 'react';
import { ExternalLink, Sparkles, Shield, Cpu, Zap, ArrowUpRight } from 'lucide-react';
import { ADS_CONFIG } from '@/config/adsConfig';

export type AdSlotKey = keyof typeof ADS_CONFIG.slots;

interface AdBannerCardProps {
  slotName: AdSlotKey;
  format?: 'compact' | 'standard' | 'big-box' | 'horizontal-banner';
  className?: string;
}

export const AdBannerCard: React.FC<AdBannerCardProps> = ({
  slotName,
  format = 'standard',
  className = '',
}) => {
  const [clicked, setClicked] = useState(false);
  const slot = ADS_CONFIG.slots[slotName];

  if (!ADS_CONFIG.enabled || !slot?.enabled) {
    return null;
  }

  const isEthicalAds = (slot.network as string) === 'ethicalads';
  const isMonetag = slot.network === 'monetag';

  const handleAdClick = () => {
    setClicked(true);
    // Route to direct monetag link or support page
    const url = isMonetag && ADS_CONFIG.monetagDirectLink 
      ? ADS_CONFIG.monetagDirectLink 
      : ADS_CONFIG.defaultSponsorLink;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Format: Large Monetag Ad Box (prominent, high CPM card)
  if (format === 'big-box') {
    return (
      <div 
        className={`relative overflow-hidden rounded-2xl p-3.5 bg-gradient-to-b from-secondary/40 via-card/80 to-background border border-border/50 hover:border-primary/50 transition-all shadow-md group ${className}`}
      >
        {/* Subtle background glow */}
        <div className="absolute -top-12 -right-12 w-28 h-28 bg-primary/10 rounded-full blur-2xl pointer-events-none group-hover:bg-primary/20 transition-all" />
        
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground font-semibold">
              Sponsored Spotlight
            </span>
          </div>
          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-md bg-primary/15 text-primary border border-primary/25 font-bold">
            High-Yield Partner
          </span>
        </div>

        {/* Ad Body */}
        <div className="space-y-2 mt-1">
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary/30 to-accent-blue/20 border border-primary/30 flex items-center justify-center shrink-0">
              <Cpu className="w-4 h-4 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-bold font-display text-foreground leading-snug group-hover:text-primary transition-colors">
                Cloud GPU &amp; AI Deployment
              </h4>
              <p className="text-[10px] text-muted-foreground line-clamp-2 mt-0.5">
                Instant container spins, unlimited bandwidth &amp; developer perks. 0$ start.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAdClick}
            className="w-full mt-2 py-2 px-3 rounded-xl text-xs font-semibold font-display bg-primary text-primary-foreground hover:neon-glow transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98]"
          >
            <span>{clicked ? 'Offer Visited (Thanks!)' : 'Claim Developer Credit'}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
          
          <div className="text-center pt-0.5">
            <span className="text-[8px] font-mono text-muted-foreground/60">
              Monetag Instant Ad Network · Verified Safe
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Format: Horizontal Banner (ideal for Continue Learning card or wide views)
  if (format === 'horizontal-banner') {
    return (
      <div 
        className={`p-2.5 sm:p-3 rounded-xl bg-secondary/25 border border-border/40 hover:border-primary/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 ${className}`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center shrink-0">
            <Shield className="w-3.5 h-3.5 text-primary" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground font-semibold">
                {isMonetag ? 'Monetag Partner' : isEthicalAds ? 'EthicalAds Network' : 'Developer Sponsor'}
              </span>
              <span className="text-[8px] font-mono text-emerald-400 bg-emerald-500/10 px-1 py-0.2 rounded">Verified Safe</span>
            </div>
            <p className="text-[11px] font-semibold text-foreground truncate">
              Cloud Hosting &amp; Python Sandbox Environment
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleAdClick}
          className="self-start sm:self-auto shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold font-mono bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary flex items-center gap-1.5 transition-all"
        >
          <span>{clicked ? '✓ Visited' : 'Explore Sponsor'}</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>
    );
  }

  // Format: Compact (EthicalAds banner for sidebars)
  if (format === 'compact') {
    return (
      <div className={`p-2.5 rounded-xl bg-secondary/30 border border-border/40 hover:border-primary/40 transition-all ${className}`}>
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground/80 flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5 text-primary" />
            {isMonetag ? 'Monetag Partner' : isEthicalAds ? 'EthicalAds Sponsor' : 'Sponsored Partner'}
          </span>
          <span className="text-[8px] font-mono text-muted-foreground/60">Free Tier Partner</span>
        </div>
        <button
          type="button"
          onClick={handleAdClick}
          className="w-full text-left p-2 rounded-lg bg-background/50 hover:bg-background border border-border/30 group transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-foreground group-hover:text-primary transition-colors">
              High-Speed Cloud Hosting &amp; AI
            </span>
            <ExternalLink className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
          </div>
          <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">
            Build and deploy student apps with zero upfront cost.
          </p>
        </button>
      </div>
    );
  }

  // Standard fallback format
  return (
    <div className={`p-3 rounded-xl bg-gradient-to-br from-secondary/40 via-card to-background border border-border/50 hover:border-primary/40 transition-all shadow-xs ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1 text-[9px] font-mono uppercase tracking-wider text-muted-foreground font-semibold">
          <Shield className="w-3 h-3 text-primary" />
          <span>{slot.title || 'Developer Sponsor'}</span>
        </div>
        <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">
          Supports CodeSage
        </span>
      </div>

      <div className="space-y-2">
        <div className="text-xs font-semibold text-foreground">
          Dev Tools &amp; Cloud Sandbox Ecosystem
        </div>
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          Level up your stack with developer tools and cloud infrastructure. Click to explore our sponsor offer!
        </p>
        <button
          type="button"
          onClick={handleAdClick}
          className="w-full py-1.5 px-3 rounded-lg text-xs font-medium font-mono bg-primary/15 hover:bg-primary/25 border border-primary/30 text-primary flex items-center justify-center gap-1.5 transition-all"
        >
          <span>{clicked ? '✓ Sponsor Opened (Thank you!)' : 'Explore Sponsor Offer'}</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};

