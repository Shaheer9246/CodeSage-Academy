import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, ShieldCheck, Sparkles, Zap, Heart, CheckCircle2 } from 'lucide-react';
import { ADS_CONFIG } from '@/config/adsConfig';

interface SponsorAdModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  sponsorUrl?: string;
  partnerName?: string;
}

export const SponsorAdModal: React.FC<SponsorAdModalProps> = ({
  isOpen,
  onClose,
  title = 'Next-Gen Cloud GPU & AI Hosting',
  description = 'High-speed cloud container spins, developer compute perks, and free sandbox environments for modern web developers.',
  sponsorUrl,
  partnerName = 'Monetag Verified Partner',
}) => {
  const targetUrl = sponsorUrl || ADS_CONFIG.monetagDirectLink || ADS_CONFIG.monetagReferralLink || ADS_CONFIG.defaultSponsorLink;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="w-full max-w-md bg-card border border-primary/30 rounded-2xl p-5 sm:p-6 shadow-2xl relative overflow-hidden space-y-4"
          >
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-xl bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground transition-all"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header Badge */}
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-primary/15 text-primary border border-primary/25 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                {partnerName}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Verified Safe
              </span>
            </div>

            {/* Title & Body */}
            <div className="space-y-2">
              <h3 className="text-lg font-bold font-display text-foreground leading-snug">
                {title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {description}
              </p>
            </div>

            {/* Support Note */}
            <div className="p-3 rounded-xl bg-secondary/40 border border-border/40 text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-foreground">
                <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-400/20" />
                <span>Supports CodeSage Free Education</span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Clicking the sponsor opens their official offer in a new tab. Simply explore for a few seconds to help fund student servers.
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-2">
              <a
                href={targetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl text-xs font-bold font-display bg-primary text-primary-foreground hover:neon-glow transition-all flex items-center justify-center gap-2 shadow-md"
              >
                <span>Visit Sponsor Offer (Takes 10s)</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2 px-3 rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/40 transition-all text-center"
              >
                Maybe later
              </button>
            </div>

            {/* Referral Banner */}
            <div className="pt-3 border-t border-border/30 text-center">
              <a
                href={ADS_CONFIG.monetagReferralLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-primary/90 hover:text-primary underline flex items-center justify-center gap-1 transition-colors"
              >
                <Zap className="w-3 h-3 text-amber-400" />
                <span>Want to run ads & monetize your own website? Join Monetag for Free</span>
              </a>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
