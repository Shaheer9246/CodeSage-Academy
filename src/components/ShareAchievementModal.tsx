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

export type ShareAchievementType = 'lesson' | 'dsa' | 'streak' | 'general' | 'invite';

export interface ShareAchievementModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  topic?: string;
  achievementType?: ShareAchievementType;
  customMessage?: string;
  streakCount?: number;
}

const getPlatformUrl = () => {
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin;
  }
  return 'https://codesageacademy.netlify.app';
};

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
  const platformUrl = getPlatformUrl();

  // Generate dynamic viral headline & share text tailored for university and study groups
  const shareDetails = React.useMemo(() => {
    if (customMessage) {
      return {
        cardHeadline: customMessage,
        shareText: `${customMessage}\n\nCheck out CodeSage free compiler & roadmaps: ${platformUrl}`,
        linkedInText: `${customMessage}\n\nPracticing computer science with hands-on labs on CodeSage Academy! #Coding #ComputerScience #Tech #StudentDeveloper`,
      };
    }

    switch (achievementType) {
      case 'dsa':
        return {
          cardHeadline: `${studentName} solved ${title} on CodeSage! ⚡`,
          shareText: `Solved '${title}' (${topic}) on CodeSage! ⚡ Free in-browser DSA playgrounds with 150+ problems: ${platformUrl}`,
          linkedInText: `Excited to share that I just solved '${title}' (${topic}) on CodeSage Academy! Continuing to sharpen my problem-solving and algorithmic thinking with in-browser practice labs. #DSA #Algorithms #LeetCode #Coding #ComputerScience #StudentDeveloper`,
        };
      case 'lesson':
        return {
          cardHeadline: `${studentName} mastered ${title}! 🚀`,
          shareText: `Hey folks! 🚀 I just mastered '${title}' on CodeSage Academy. If you want free hands-on practice in C, Python, or Cyber Security with in-browser compilers (no setup needed): ${platformUrl}`,
          linkedInText: `Excited to share that I've completed '${title}' on CodeSage Academy! Practicing computer science concepts with hands-on in-browser labs... #Coding #ComputerScience #Tech #StudentDeveloper`,
        };
      case 'streak':
        return {
          cardHeadline: `${studentName} hit a ${currentStreak}-day streak! 🔥`,
          shareText: `Consistency is key! 🔥 I just hit a ${currentStreak}-day coding streak on CodeSage Academy. Join me and practice coding free: ${platformUrl}`,
          linkedInText: `Consistency is key! 🔥 Proud to hit a ${currentStreak}-day coding streak on CodeSage Academy. Practicing computer science and software development hands-on every day. #Consistency #CodingStreak #ComputerScience #StudentDeveloper #Tech`,
        };
      case 'general':
      case 'invite':
      default:
        return {
          cardHeadline: `${studentName} invites you to level up! 🎓`,
          shareText: `Hey CS folks! 👋 Found this 100% free interactive platform for coding practice with in-browser compilers, Linux labs, and DSA sheets. Check it out: ${platformUrl}`,
          linkedInText: `Excited to be practicing computer science and software engineering on CodeSage Academy! Check out this free interactive platform with in-browser compilers, Linux labs, and structured roadmaps: ${platformUrl} #Coding #ComputerScience #Tech #StudentDeveloper`,
        };
    }
  }, [achievementType, customMessage, studentName, title, topic, currentStreak, platformUrl]);

  const copyToClipboard = async (text: string) => {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
  };

  const handleCopyLink = async () => {
    try {
      await copyToClipboard(shareDetails.shareText);
      setCopied(true);
      toast.success('Invite message copied to clipboard!');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error('Could not copy invite message');
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

  const handleLinkedInShare = async () => {
    try {
      await copyToClipboard(shareDetails.linkedInText);
      toast.success('Copied LinkedIn post text to clipboard! Paste it into your post.');
    } catch (_err) {
      // Non-blocking fallback if clipboard write fails
    }
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(platformUrl)}`;
    window.open(linkedInUrl, '_blank', 'noopener,noreferrer');
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
                  <span>{platformUrl.replace(/^https?:\/\//, '')}</span>
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

                {/* Copy Invite Message Button */}
                <button
                  onClick={handleCopyLink}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-secondary/80 hover:bg-secondary text-foreground border border-border font-mono text-xs transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-bold">Invite Message Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-primary" />
                      <span>Copy Invite Message</span>
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
