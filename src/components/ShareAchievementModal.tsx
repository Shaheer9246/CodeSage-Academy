/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Share2, 
  Flame, 
  Coins, 
  Copy, 
  Check, 
  Sparkles, 
  Trophy,
  MessageCircle,
  Linkedin,
  Twitter,
  Code2
} from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { toast } from 'sonner';

export type ShareAchievementType = 'lesson' | 'dsa' | 'streak' | 'general';

export interface ShareAchievementModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  topic?: string;
  achievementType?: ShareAchievementType;
  customMessage?: string;
  streakCount?: number;
}

const PLATFORM_URL = 'https://learncodesage.lovable.app';

export const ShareAchievementModal: React.FC<ShareAchievementModalProps> = ({
  isOpen,
  onClose,
  title = 'DSA Problem',
  topic = 'Algorithms & Data Structures',
  achievementType = 'general',
  customMessage,
  streakCount,
}) => {
  const { user } = useUser();
  const [copied, setCopied] = useState(false);

  const studentName = user?.name || user?.email?.split('@')[0] || 'Learner';
  const currentStreak = streakCount ?? (user?.streakCount || 1);
  const coins = user?.sageCoins || 0;

  // Generate dynamic viral headline & share text
  const shareDetails = React.useMemo(() => {
    if (customMessage) {
      return {
        cardHeadline: customMessage,
        shareText: `${customMessage}\n\nCheck out CodeSage free compiler & roadmaps: ${PLATFORM_URL}`,
      };
    }

    switch (achievementType) {
      case 'dsa':
        return {
          cardHeadline: `${studentName} solved ${title} on CodeSage! ⚡`,
          shareText: `Hey! I just solved ${title} (${topic}) on CodeSage! 🔥 Check out this free compiler & coding platform: ${PLATFORM_URL}`,
        };
      case 'lesson':
        return {
          cardHeadline: `${studentName} completed ${title}! 🎓`,
          shareText: `Hey! I just mastered ${title} on CodeSage. Check out this free interactive coding platform: ${PLATFORM_URL}`,
        };
      case 'streak':
        return {
          cardHeadline: `${studentName} is on a ${currentStreak}-day coding streak! 🔥`,
          shareText: `Consistency is key! I just hit a ${currentStreak}-day coding streak on CodeSage. Build your skills with free interactive lessons: ${PLATFORM_URL}`,
        };
      default:
        return {
          cardHeadline: `${studentName} is leveling up on CodeSage! 🚀`,
          shareText: `I'm learning and practicing software engineering on CodeSage! Check out this free compiler & interactive roadmap platform: ${PLATFORM_URL}`,
        };
    }
  }, [achievementType, customMessage, studentName, title, topic, currentStreak]);

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareDetails.shareText);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = shareDetails.shareText;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      toast.success('Link copied to share with classmates!');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error('Could not copy link');
    }
  };

  const handleWhatsAppShare = () => {
    const encoded = encodeURIComponent(shareDetails.shareText);
    const url = `https://api.whatsapp.com/send?text=${encoded}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleTwitterShare = () => {
    const encodedText = encodeURIComponent(shareDetails.shareText);
    const url = `https://twitter.com/intent/tweet?text=${encodedText}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleLinkedInShare = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(PLATFORM_URL)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative w-full max-w-md bg-[#16213e] border border-primary/30 shadow-2xl rounded-3xl overflow-hidden text-foreground"
          >
            {/* Top glowing bar */}
            <div className="h-1.5 w-full bg-gradient-to-r from-primary via-accent-orange to-accent-blue" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground p-1.5 rounded-full hover:bg-secondary/60 transition-colors z-20"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="p-6 sm:p-7 space-y-6">
              {/* Header Title */}
              <div className="text-center space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/15 border border-primary/30 text-primary text-xs font-mono font-bold tracking-wide">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Share Your Achievement</span>
                </div>
                <h2 className="text-xl font-bold font-display tracking-tight pt-1">
                  Celebrate Your Milestone
                </h2>
                <p className="text-xs text-muted-foreground">
                  Inspire friends & classmates with 1-click sharing
                </p>
              </div>

              {/* Achievement Preview Card (Visual Ticket / Badge) */}
              <div className="relative rounded-2xl p-5 border border-primary/35 bg-gradient-to-br from-[#1a1a2e] to-[#0f3460] shadow-inner space-y-4 overflow-hidden">
                <div className="absolute -top-12 -right-12 w-28 h-28 bg-primary/20 rounded-full blur-2xl pointer-events-none" />

                {/* Brand & Badge Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-black text-sm shadow-md shadow-primary/30">
                      CS
                    </div>
                    <div>
                      <span className="font-bold text-sm tracking-tight text-foreground block">
                        CodeSage
                      </span>
                      <span className="text-[10px] font-mono text-muted-foreground block -mt-0.5">
                        Interactive Learning
                      </span>
                    </div>
                  </div>

                  {/* Student Stats Badges */}
                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-orange-500/15 text-orange-400 border border-orange-500/30 font-bold">
                      <Flame className="w-3.5 h-3.5 fill-current" />
                      {currentStreak}d
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-yellow-500/15 text-yellow-400 border border-yellow-500/30 font-bold">
                      <Coins className="w-3.5 h-3.5" />
                      {coins}
                    </span>
                  </div>
                </div>

                {/* Main achievement statement */}
                <div className="pt-1">
                  <h3 className="text-base sm:text-lg font-bold font-display text-white leading-snug">
                    {shareDetails.cardHeadline}
                  </h3>
                  <div className="flex items-center gap-2 pt-1 text-xs text-muted-foreground font-mono">
                    <span className="text-primary font-semibold">{topic}</span>
                    <span className="opacity-40">·</span>
                    <span>Free Practice Platform</span>
                  </div>
                </div>

                {/* Subtle verified badge */}
                <div className="pt-2 border-t border-border/30 flex items-center justify-between text-[11px] text-muted-foreground font-mono">
                  <span>learncodesage.lovable.app</span>
                  <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                    <Trophy className="w-3 h-3" /> Verified Student
                  </span>
                </div>
              </div>

              {/* Social Share Buttons */}
              <div className="space-y-2.5">
                {/* WhatsApp Button (High viral conversion) */}
                <button
                  onClick={handleWhatsAppShare}
                  className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-all shadow-lg shadow-emerald-900/30 hover:scale-[1.01] active:scale-[0.99]"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Share via WhatsApp</span>
                </button>

                {/* Secondary Social Channels */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleTwitterShare}
                    className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#1d9bf0]/15 hover:bg-[#1d9bf0]/25 text-[#1d9bf0] border border-[#1d9bf0]/30 font-medium text-xs transition-colors"
                  >
                    <Twitter className="w-3.5 h-3.5 fill-current" />
                    <span>X (Twitter)</span>
                  </button>

                  <button
                    onClick={handleLinkedInShare}
                    className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#0077b5]/15 hover:bg-[#0077b5]/25 text-[#0077b5] border border-[#0077b5]/30 font-medium text-xs transition-colors"
                  >
                    <Linkedin className="w-3.5 h-3.5 fill-current" />
                    <span>LinkedIn</span>
                  </button>
                </div>

                {/* Copy Referral Link Button */}
                <button
                  onClick={handleCopyLink}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-secondary/80 hover:bg-secondary text-foreground border border-border font-mono text-xs transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-bold">Link Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-primary" />
                      <span>Copy Referral Link</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ShareAchievementModal;
