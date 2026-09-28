import React, { useState, useEffect, useMemo } from 'react';
import { ExternalLink, Sparkles, Shield, Cpu, Zap, ArrowUpRight, Radio } from 'lucide-react';
import {
  ADS_CONFIG,
  MONETAG_DIRECT_LINK_1,
  MONETAG_DIRECT_LINK_2,
  MONETAG_INPAGE_SRC,
  MONETAG_INPAGE_ZONE,
  MONETAG_VIGNETTE_SRC,
  MONETAG_VIGNETTE_ZONE,
} from '@/config/adsConfig';

export type AdSlotKey = keyof typeof ADS_CONFIG.slots;

interface AdBannerCardProps {
  slotName: AdSlotKey;
  format?: 'compact' | 'standard' | 'big-box' | 'horizontal-banner';
  className?: string;
}

const ICONS = [Cpu, Zap, Shield, Sparkles];

function hashSlotOffset(slotName: string, total: number): number {
  let sum = 0;
  for (let i = 0; i < slotName.length; i++) {
    sum += slotName.charCodeAt(i);
  }
  return sum % Math.max(1, total);
}

/**
 * Ensures Monetag Vignette Banner (11911764) and In-Page Push (11911770)
 * are active on the page so you earn CPM impressions automatically on every visit.
 */
function ensureMonetagGlobalScripts() {
  if (typeof document === 'undefined') return;

  if (!document.querySelector(`script[data-zone="${MONETAG_VIGNETTE_ZONE}"]`)) {
    const s1 = document.createElement('script');
    s1.dataset.zone = MONETAG_VIGNETTE_ZONE;
    s1.src = MONETAG_VIGNETTE_SRC;
    s1.async = true;
    (document.body || document.documentElement).appendChild(s1);
  }

  if (!document.querySelector(`script[data-zone="${MONETAG_INPAGE_ZONE}"]`)) {
    const s2 = document.createElement('script');
    s2.dataset.zone = MONETAG_INPAGE_ZONE;
    s2.src = MONETAG_INPAGE_SRC;
    s2.async = true;
    (document.body || document.documentElement).appendChild(s2);
  }
}

export const AdBannerCard: React.FC<AdBannerCardProps> = ({
  slotName,
  format = 'standard',
  className = '',
}) => {
  const slot = ADS_CONFIG.slots[slotName];
  const creatives = ADS_CONFIG.liveCreatives;
  const totalCreatives = creatives.length;

  const initialIdx = useMemo(
    () => hashSlotOffset(slotName, totalCreatives),
    [slotName, totalCreatives]
  );

  const [activeIdx, setActiveIdx] = useState<number>(initialIdx);
  const [progress, setProgress] = useState<number>(0);

  const intervalSec = ADS_CONFIG.bannerRotationIntervalSec || 12;

  useEffect(() => {
    ensureMonetagGlobalScripts();
  }, []);

  // Continuous live ad rotation loop (runs automatically without user interaction)
  useEffect(() => {
    if (!ADS_CONFIG.enabled || !slot?.enabled || totalCreatives === 0) return;

    const tickMs = 250;
    const step = (tickMs / (intervalSec * 1000)) * 100;

    const timer = window.setInterval(() => {
      setProgress((prev) => {
        if (prev + step >= 100) {
          setActiveIdx((idx) => (idx + 1) % totalCreatives);
          return 0;
        }
        return prev + step;
      });
    }, tickMs);

    return () => window.clearInterval(timer);
  }, [slot?.enabled, totalCreatives, intervalSec]);

  if (!ADS_CONFIG.enabled || !slot?.enabled || totalCreatives === 0) {
    return null;
  }

  const currentAd = creatives[activeIdx % totalCreatives];
  const ActiveIcon = ICONS[activeIdx % ICONS.length];
  const zoneId = currentAd.zoneId || slot.monetagZoneId || MONETAG_INPAGE_ZONE;
  const scriptSrc = currentAd.scriptSrc || MONETAG_INPAGE_SRC;
  const targetUrl =
    currentAd.url ||
    slot.monetagSmartLink ||
    (activeIdx % 2 === 0 ? MONETAG_DIRECT_LINK_1 : MONETAG_DIRECT_LINK_2);

  // Embedded visual Monetag zone document inside the banner box
  const liveZoneSrcDoc = useMemo(() => {
    return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>
  html, body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: transparent;
  }
</style>
</head>
<body>
  <script>
    (function(s){
      s.dataset.zone='${zoneId}';
      s.src='${scriptSrc}';
    })([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')));
  </script>
</body>
</html>`;
  }, [zoneId, scriptSrc]);

  // Format: Large Monetag Ad Box
  if (format === 'big-box') {
    return (
      <div
        className={`relative overflow-hidden rounded-2xl p-3.5 bg-gradient-to-b ${currentAd.accentColor} via-card/90 to-background border border-primary/30 transition-all duration-500 shadow-md ${className}`}
      >
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-secondary/50 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary via-emerald-400 to-accent transition-all duration-200"
            style={{ width: `${Math.min(100, progress)}%` }}
          />
        </div>

        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[9px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
              MONETAG LIVE · {activeIdx + 1}/{totalCreatives}
            </span>
          </div>
          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-md bg-primary/15 text-primary border border-primary/25 font-bold">
            {currentAd.badge}
          </span>
        </div>

        {/* Visible Live Ad Frame (loads real Monetag Direct Link + Zone automatically) */}
        <div className="relative w-full h-32 rounded-xl overflow-hidden border border-border/50 bg-background/80 mb-2">
          <iframe
            key={`${slotName}-big-${activeIdx}`}
            title={`monetag-visual-${slotName}`}
            src={targetUrl}
            sandbox="allow-scripts allow-same-origin allow-forms"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-full border-0 relative z-10 bg-white"
          />
          <iframe
            title={`monetag-tag-${slotName}`}
            srcDoc={liveZoneSrcDoc}
            sandbox="allow-scripts allow-same-origin"
            className="w-0 h-0 opacity-0 pointer-events-none absolute"
            aria-hidden="true"
            tabIndex={-1}
          />
          <a
            href={targetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-0 z-20 flex items-end justify-between p-2 bg-gradient-to-t from-background/90 via-transparent to-transparent group"
          >
            <div className="min-w-0 pr-2">
              <p className="text-[11px] font-bold text-foreground truncate group-hover:text-primary transition-colors">
                {currentAd.headline}
              </p>
            </div>
            <span className="shrink-0 px-2.5 py-1 rounded-lg bg-primary text-primary-foreground text-[10px] font-bold inline-flex items-center gap-1 shadow-sm">
              {currentAd.cta}
              <ArrowUpRight className="w-3 h-3" />
            </span>
          </a>
        </div>

        <div className="flex items-center justify-between text-[8px] font-mono text-muted-foreground/70 pt-0.5">
          <span className="truncate">{currentAd.displayDomain}</span>
          <span>Zone #{zoneId}</span>
        </div>
      </div>
    );
  }

  // Format: Horizontal Banner (Track, Support & Course pages)
  if (format === 'horizontal-banner') {
    return (
      <div
        className={`relative overflow-hidden p-2.5 sm:p-3 rounded-xl bg-gradient-to-r ${currentAd.accentColor} via-secondary/30 to-card border border-border/50 hover:border-primary/40 transition-all duration-500 flex flex-col gap-2.5 ${className}`}
      >
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-secondary/40 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-emerald-400 transition-all duration-200"
            style={{ width: `${Math.min(100, progress)}%` }}
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center shrink-0">
              <ActiveIcon className="w-4 h-4 text-primary" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="inline-flex items-center gap-1 text-[9px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
                  <Radio className="w-2.5 h-2.5 animate-pulse" />
                  MONETAG LIVE AD {activeIdx + 1}/{totalCreatives}
                </span>
                <span className="text-[8px] font-mono text-primary bg-primary/10 border border-primary/20 px-1.5 py-0.2 rounded font-semibold">
                  {currentAd.badge}
                </span>
                <span className="text-[9px] font-mono text-muted-foreground/70 hidden sm:inline">
                  · Zone #{zoneId}
                </span>
              </div>
              <p className="text-xs font-semibold text-foreground truncate mt-0.5">
                {currentAd.headline}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0">
            <a
              href={targetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold font-mono bg-primary text-primary-foreground hover:neon-glow flex items-center gap-1.5 transition-all shadow-sm"
            >
              <span>{currentAd.cta}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Live Visual Monetag Feed Strip */}
        <div className="relative w-full h-28 rounded-lg overflow-hidden border border-border/40 bg-white">
          <iframe
            key={`${slotName}-horiz-${activeIdx}`}
            title={`monetag-horiz-${slotName}`}
            src={targetUrl}
            sandbox="allow-scripts allow-same-origin allow-forms"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-full border-0"
          />
          <iframe
            title={`monetag-horiz-zone-${slotName}`}
            srcDoc={liveZoneSrcDoc}
            sandbox="allow-scripts allow-same-origin"
            className="w-0 h-0 opacity-0 pointer-events-none absolute"
            aria-hidden="true"
            tabIndex={-1}
          />
          <a
            href={targetUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open live sponsor ad"
            className="absolute inset-0 z-10 bg-transparent hover:bg-primary/5 transition-colors"
          />
        </div>
      </div>
    );
  }

  // Format: Compact (for Lesson & Dashboard sidebars)
  if (format === 'compact') {
    return (
      <div
        className={`relative overflow-hidden p-2.5 rounded-xl bg-gradient-to-br ${currentAd.accentColor} via-secondary/30 to-background border border-border/50 transition-all duration-500 ${className}`}
      >
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-secondary/40 overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-200"
            style={{ width: `${Math.min(100, progress)}%` }}
          />
        </div>

        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span className="text-[9px] font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            LIVE AD · #{zoneId}
          </span>
          <span className="text-[8px] font-mono px-1.5 py-0.2 rounded bg-primary/15 text-primary font-semibold">
            {currentAd.badge}
          </span>
        </div>

        <div className="relative w-full h-24 rounded-lg overflow-hidden border border-border/40 bg-white mb-1.5">
          <iframe
            key={`${slotName}-compact-${activeIdx}`}
            title={`monetag-compact-${slotName}`}
            src={targetUrl}
            sandbox="allow-scripts allow-same-origin allow-forms"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-full border-0"
          />
          <iframe
            title={`monetag-compact-zone-${slotName}`}
            srcDoc={liveZoneSrcDoc}
            sandbox="allow-scripts allow-same-origin"
            className="w-0 h-0 opacity-0 pointer-events-none absolute"
            aria-hidden="true"
            tabIndex={-1}
          />
          <a
            href={targetUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open sponsor ad"
            className="absolute inset-0 z-10"
          />
        </div>

        <a
          href={targetUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block p-2 rounded-lg bg-background/60 hover:bg-background/90 border border-border/40 group transition-all"
        >
          <div className="flex items-center justify-between gap-1.5">
            <span className="text-[11px] font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
              {currentAd.headline}
            </span>
            <ExternalLink className="w-3 h-3 text-primary shrink-0" />
          </div>
        </a>
      </div>
    );
  }

  // Standard fallback format
  return (
    <div
      className={`relative overflow-hidden p-3 rounded-xl bg-gradient-to-br ${currentAd.accentColor} via-card to-background border border-border/50 transition-all duration-500 shadow-xs ${className}`}
    >
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-secondary/40 overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-200"
          style={{ width: `${Math.min(100, progress)}%` }}
        />
      </div>

      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
          <Radio className="w-3 h-3 animate-pulse" />
          <span>LIVE AD · Zone #{zoneId}</span>
        </div>
        <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-primary/15 text-primary font-bold">
          {currentAd.badge}
        </span>
      </div>

      <div className="relative w-full h-24 rounded-lg overflow-hidden border border-border/40 bg-white mb-2">
        <iframe
          key={`${slotName}-std-${activeIdx}`}
          title={`monetag-std-${slotName}`}
          src={targetUrl}
          sandbox="allow-scripts allow-same-origin allow-forms"
          referrerPolicy="no-referrer-when-downgrade"
          className="w-full h-full border-0"
        />
        <a
          href={targetUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open sponsor ad"
          className="absolute inset-0 z-10"
        />
      </div>

      <div className="space-y-2">
        <a
          href={targetUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-1.5 px-3 rounded-lg text-xs font-medium font-mono bg-primary text-primary-foreground hover:neon-glow flex items-center justify-center gap-1.5 transition-all"
        >
          <span>{currentAd.cta}</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
};
