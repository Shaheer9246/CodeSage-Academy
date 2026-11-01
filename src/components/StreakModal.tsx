import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, X, Sparkles, Zap, Rocket, ShieldCheck, Share2, Award } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import ShareAchievementModal from '@/components/ShareAchievementModal';
import { toast } from 'sonner';

const DEV_QUOTES = [
  "Consistency compiles success.",
  "Small daily commits lead to major releases.",
  "Focus on progress, not perfection. Keep building!",
  "The best way to learn is to ship a little every day.",
  "Your future self will thank you for today's logic.",
  "Code a little every day, and watch your skills scale."
];

/**
 * ==============================================================================
 * SageOwlMascot: CodeSage's Wise Owl Mascot that celebrates your streak
 * ==============================================================================
 */
function SageOwlMascot({ streakCount }: { streakCount: number }) {
  const isSuper = streakCount >= 7;
  const isHot = streakCount >= 3;

  return (
    <div className="relative w-28 h-28 sm:w-32 sm:h-32 mx-auto flex items-center justify-center">
      {/* Ambient background glow behind mascot */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.35, 0.65, 0.35] }}
        transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
        className={`absolute inset-2 rounded-full blur-2xl -z-10 ${
          isSuper ? 'bg-purple-500/30' : isHot ? 'bg-orange-500/35' : 'bg-amber-500/25'
        }`}
      />

      {/* Floating particles */}
      <motion.div
        animate={{ y: [-4, 4, -4], rotate: [-2, 2, -2] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        className="relative w-full h-full flex items-center justify-center"
      >
        <svg viewBox="0 0 160 160" className="w-full h-full drop-shadow-xl" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Owl Body */}
          <ellipse cx="80" cy="95" rx="42" ry="46" fill="#1e293b" stroke="#334155" strokeWidth="3" />
          {/* Owl Belly */}
          <ellipse cx="80" cy="102" rx="28" ry="30" fill="#334155" />
          <path d="M72 92 C76 96, 84 96, 88 92" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
          <path d="M70 104 C75 108, 85 108, 90 104" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
          <path d="M73 116 C77 119, 83 119, 87 116" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />

          {/* Owl Ears / Tufts */}
          <path d="M50 54 L62 32 L72 52 Z" fill="#0f172a" stroke="#334155" strokeWidth="2.5" />
          <path d="M110 54 L98 32 L88 52 Z" fill="#0f172a" stroke="#334155" strokeWidth="2.5" />

          {/* Owl Head */}
          <circle cx="80" cy="62" r="34" fill="#0f172a" stroke="#334155" strokeWidth="3" />

          {/* Big Owl Eyes */}
          <circle cx="66" cy="60" r="14" fill="#ffffff" />
          <circle cx="94" cy="60" r="14" fill="#ffffff" />
          {/* Eye Pupils with excited shine */}
          <circle cx="67" cy="60" r="8" fill="#0f172a" />
          <circle cx="95" cy="60" r="8" fill="#0f172a" />
          <circle cx="69" cy="58" r="2.8" fill="#ffffff" />
          <circle cx="97" cy="58" r="2.8" fill="#ffffff" />

          {/* Golden Beak */}
          <polygon points="76,68 84,68 80,78" fill="#f59e0b" />

          {/* Cute Cheeks */}
          <ellipse cx="56" cy="70" rx="5" ry="3" fill="#f43f5e" opacity="0.6" />
          <ellipse cx="104" cy="70" rx="5" ry="3" fill="#f43f5e" opacity="0.6" />

          {/* Left Wing */}
          <path d="M40 85 C32 95, 34 115, 46 120 C42 108, 44 95, 48 88 Z" fill="#0f172a" stroke="#334155" strokeWidth="2.5" />

          {/* Right Wing (Waving / Holding Flame) */}
          <path d="M120 85 C128 95, 126 115, 114 120 C118 108, 116 95, 112 88 Z" fill="#0f172a" stroke="#334155" strokeWidth="2.5" />

          {/* Owl Feet */}
          <ellipse cx="68" cy="140" rx="6" ry="4" fill="#f59e0b" />
          <ellipse cx="92" cy="140" rx="6" ry="4" fill="#f59e0b" />

          {/* Tier Accessory: Golden Crown (Days 7+) */}
          {isSuper && (
            <g transform="translate(60, 14)">
              <path d="M4 18 L10 6 L20 14 L30 6 L36 18 Z" fill="#fbbf24" stroke="#f59e0b" strokeWidth="2" />
              <circle cx="10" cy="5" r="2" fill="#ef4444" />
              <circle cx="20" cy="13" r="2" fill="#3b82f6" />
              <circle cx="30" cy="5" r="2" fill="#10b981" />
            </g>
          )}

          {/* Tier Accessory: Developer Headband with Flame (Days 3-6) */}
          {isHot && !isSuper && (
            <g>
              <rect x="47" y="44" width="66" height="7" rx="3.5" fill="#ea580c" />
              <circle cx="80" cy="47.5" r="4.5" fill="#fef08a" />
            </g>
          )}

          {/* Tier Accessory: Coding Glasses (Days 1-2) */}
          {!isHot && (
            <g stroke="#38bdf8" strokeWidth="2.5" fill="none">
              <circle cx="66" cy="60" r="14" />
              <circle cx="94" cy="60" r="14" />
              <line x1="80" y1="60" x2="80" y2="60" strokeWidth="3" />
            </g>
          )}
        </svg>

        {/* Floating Torch / Flame Badge */}
        <motion.div
          animate={{ scale: [1, 1.15, 1], rotate: [-4, 4, -4] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="absolute -right-1 bottom-1 w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 border-2 border-background shadow-lg flex items-center justify-center text-white"
        >
          {isSuper ? (
            <Rocket className="w-5 h-5 fill-current" />
          ) : (
            <Flame className="w-5 h-5 fill-current" />
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}

/**
 * ==============================================================================
 * useStreakMonitor: Headless hook for streak state
 * ==============================================================================
 */
interface UseStreakMonitorReturn {
  isOpen: boolean;
  quote: string;
  todayIdx: number;
  daysOfWeek: string[];
  closeModal: () => void;
}

function useStreakMonitor(): UseStreakMonitorReturn {
  const [isOpen, setIsOpen] = useState(false);
  const [quote, setQuote] = useState('');
  
  const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const todayIdx = new Date().getDay();

  const initializeStreak = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    const lastShown = localStorage.getItem('codesage_streak_shown_date');

    if (lastShown !== today) {
      const randomQuote = DEV_QUOTES[Math.floor(Math.random() * DEV_QUOTES.length)];
      setQuote(randomQuote);
      setIsOpen(true);
      localStorage.setItem('codesage_streak_shown_date', today);
    }
  }, []);

  useEffect(() => {
    initializeStreak();
  }, [initializeStreak]);

  const closeModal = useCallback(() => setIsOpen(false), []);

  return { isOpen, quote, todayIdx, daysOfWeek, closeModal };
}

/**
 * ==============================================================================
 * StreakModal: Exciting, Dynamic UI with Wide Card & Sage Mascot
 * ==============================================================================
 */
interface StreakModalProps {
  streakCount: number;
  forceOpen?: boolean;
  onClose?: () => void;
}

export function StreakModal({ streakCount, forceOpen, onClose }: StreakModalProps) {
  const { isOpen, quote, todayIdx, daysOfWeek, closeModal } = useStreakMonitor();
  const { user, spendCoins } = useUser();
  const [showShareModal, setShowShareModal] = useState(false);

  const open = isOpen || !!forceOpen;
  const displayQuote = quote || DEV_QUOTES[0];

  const close = () => { 
    closeModal(); 
    onClose?.(); 
  };

  const handleBuyFreeze = async () => {
    if ((user?.sageCoins || 0) < 10) { 
      toast.error('Need 10 Sage Coins to buy a Streak Freeze ❄️'); 
      return; 
    }
    const spent = await spendCoins(10, 'streak_freeze_modal');
    if (spent) { 
      toast.success('❄️ Streak Freeze purchased! Your streak is protected.'); 
    } else {
      toast.error('Could not purchase freeze');
    }
  };

  // Determine visual theme based on streak tier
  let statusText = "Warming Up!";
  let StatusIcon = Zap;
  let iconColor = "text-amber-400";
  let gradientLine = "from-amber-500 via-orange-500 to-yellow-400";
  let shadowColor = "shadow-[0_0_18px_rgba(245,158,11,0.4)]";

  if (streakCount >= 3) {
    statusText = "Heating Up!";
    StatusIcon = Flame;
    iconColor = "text-orange-500";
    gradientLine = "from-red-500 via-orange-500 to-amber-400";
    shadowColor = "shadow-[0_0_20px_rgba(249,115,22,0.45)]";
  }
  if (streakCount >= 7) {
    statusText = "Unstoppable!";
    StatusIcon = Rocket;
    iconColor = "text-purple-400";
    gradientLine = "from-pink-500 via-purple-500 to-indigo-500";
    shadowColor = "shadow-[0_0_22px_rgba(168,85,247,0.45)]";
  }

  const modalVariants = {
    hidden: { opacity: 0, y: 25, scale: 0.94 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { type: 'spring' as const, stiffness: 350, damping: 26 }
    },
    exit: { opacity: 0, y: 15, scale: 0.95, transition: { duration: 0.18 } }
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full max-w-[440px] sm:max-w-[470px] bg-background/95 border border-border shadow-2xl rounded-3xl overflow-hidden"
          >
            {/* Top Accent Gradient Bar */}
            <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${gradientLine}`} />

            {/* Close Button */}
            <button
              onClick={close}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground p-1.5 rounded-full hover:bg-secondary transition-colors z-20"
              aria-label="Close streak modal"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="px-6 pt-8 pb-6 text-center relative z-10">
              
              {/* Mascot Stage */}
              <div className="mb-3">
                <SageOwlMascot streakCount={streakCount} />
              </div>

              {/* Heading & Status Text */}
              <div className="space-y-1 mb-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/80 border border-border/60 text-xs font-mono font-bold text-muted-foreground">
                  <Award className="w-3.5 h-3.5 text-primary" />
                  <span>CODESAGE LEARNING STREAK</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-display font-black tracking-tight text-foreground">
                  Day <span className={iconColor}>{streakCount}</span>
                </h2>
                <p className={`text-xs sm:text-sm font-bold uppercase tracking-widest ${iconColor}`}>
                  {statusText}
                </p>
              </div>

              {/* Inspiring Developer Quote */}
              <div className="bg-secondary/30 border border-border/50 rounded-xl p-3 mb-5 text-center shadow-inner">
                <p className="text-xs sm:text-[13px] text-foreground/90 font-medium leading-relaxed italic">
                  "{displayQuote}"
                </p>
              </div>

              {/* 7-Day Tracker with Warm Colors */}
              <div className="mb-6 bg-card/60 border border-border/40 rounded-2xl p-3">
                <div className="flex justify-between gap-1.5 sm:gap-2">
                  {daysOfWeek.map((day, i) => {
                    const isActive = i <= todayIdx && i >= todayIdx - Math.min(streakCount - 1, todayIdx);
                    const isToday = i === todayIdx;

                    return (
                      <div key={i} className="flex flex-col items-center gap-1.5 flex-1">
                        <span className={`text-[10px] font-bold ${isToday ? 'text-foreground font-black' : 'text-muted-foreground'}`}>
                          {day}
                        </span>
                        <div
                          className={`w-full aspect-square rounded-xl flex items-center justify-center transition-all duration-300 ${
                            isToday
                              ? `bg-gradient-to-br from-orange-500 to-amber-500 text-white ${shadowColor} scale-110 font-bold`
                              : isActive
                              ? 'bg-orange-500/15 text-orange-400 border border-orange-500/30'
                              : 'bg-secondary/40 text-muted-foreground/30'
                          }`}
                        >
                          {isActive ? (
                            <StatusIcon className={`w-3.5 h-3.5 ${isToday ? 'fill-current' : 'opacity-70'}`} />
                          ) : (
                            <div className="w-1.5 h-1.5 rounded-full bg-current opacity-30" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                {/* Primary CTA */}
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={close}
                  className="w-full bg-foreground text-background font-bold rounded-xl py-3 transition-all text-sm shadow-md flex items-center justify-center gap-2 hover:bg-foreground/90"
                >
                  <Sparkles className="w-4 h-4" />
                  Keep Building
                </motion.button>

                {/* Viral Share Streak Button */}
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setShowShareModal(true)}
                  className="w-full bg-gradient-to-r from-orange-500/15 via-amber-500/15 to-orange-500/15 border border-orange-500/30 text-orange-400 hover:text-orange-300 font-semibold rounded-xl py-2.5 transition-all text-xs flex items-center justify-center gap-2 hover:bg-orange-500/20 shadow-xs"
                >
                  <Share2 className="w-4 h-4 text-orange-400" />
                  <span>Share {streakCount}-Day Streak 🔥</span>
                </motion.button>

                {/* Subtle Streak Freeze Protection Option */}
                {!user ? null : (
                  <button
                    onClick={handleBuyFreeze}
                    disabled={(user.sageCoins || 0) < 10}
                    className="w-full text-center text-[11px] text-muted-foreground hover:text-amber-400 transition-colors flex items-center justify-center gap-1.5 pt-1 pb-0.5 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                    <span>Protect Streak with 10 Coins</span>
                  </button>
                )}
              </div>
            </div>
          </motion.div>

          {/* Share Achievement Modal */}
          <ShareAchievementModal
            isOpen={showShareModal}
            onClose={() => setShowShareModal(false)}
            streakCount={streakCount}
            achievementType="streak"
          />
        </div>
      )}
    </AnimatePresence>
  );
}
