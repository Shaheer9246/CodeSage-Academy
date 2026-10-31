import { ExternalLink, Heart } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { ADS_CONFIG } from '@/config/adsConfig';
import { Button } from '@/components/ui/button';
import { isQuietWorkspace } from '@/lib/lessonAds';

export type AdSlotKey = keyof typeof ADS_CONFIG.slots;

interface AdBannerCardProps {
  slotName: AdSlotKey;
  format?: 'compact' | 'standard' | 'big-box' | 'horizontal-banner';
  className?: string;
}

export function AdBannerCard({ slotName, format = 'standard', className = '' }: AdBannerCardProps) {
  const { pathname } = useLocation();
  const slot = (ADS_CONFIG.slots as Record<string, { enabled?: boolean; adsterraSmartLink?: string; monetagSmartLink?: string }>)[slotName];
  if (!ADS_CONFIG.enabled || !slot?.enabled || isQuietWorkspace(pathname)) return null;
  const targetUrl = slot.adsterraSmartLink || slot.monetagSmartLink || ADS_CONFIG.defaultSponsorLink;
  const horizontal = format === 'horizontal-banner';

  return (
    <aside aria-label="Sponsored offer" className={`rounded-lg border border-border bg-card p-4 ${horizontal ? 'flex flex-col sm:flex-row sm:items-center gap-4' : 'space-y-3'} ${className}`}>
      <div className="min-w-0 flex-1 space-y-2">
        <p className="flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground">
          <Heart className="h-3.5 w-3.5 text-primary" /> SPONSORED · VERIFIED PARTNER
        </p>
        <p className="text-sm font-display font-semibold text-foreground">Explore developer sponsor offer</p>
        <p className="text-xs leading-relaxed text-muted-foreground">Partner advertisement. Offers open securely in a separate tab.</p>
      </div>
      <Button asChild variant="outline" size="sm" className={`gap-2 shrink-0 ${horizontal ? '' : 'w-full'}`}>
        <a href={targetUrl} target="_blank" rel="noopener noreferrer">
          Visit partner <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </Button>
    </aside>
  );
}
