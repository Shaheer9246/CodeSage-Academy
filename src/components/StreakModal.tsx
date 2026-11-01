import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, X, Sparkles, Zap, Rocket, ShieldCheck, Coins, Heart, Share2 } from 'lucide-react';
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
 * StreakModal: Exciting, Dynamic UI
 * ==============================================================================
 */
interface StreakModalProps {
  streakCount: number;
  /** Force the modal open (e.g. from a "view streak" button). */
  forceOpen?: boolean;
  onClose?: () => void;
}

export function StreakModal({ streakCount, forceOpen, onClose }: StreakModalProps) {
  const navigate = useNavigate();
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
  let bgGlow = "bg-cyan-500/20";
  let iconColor = "text-cyan-400";
  let gradientLine = "from-blue-500 via-cyan-400 to-teal-400";
  let shadowColor = "shadow-[0_0_15px_rgba(34,211,238,0.4)]";

  if (streakCount >= 3) {
    statusText = "Heating Up!";
    StatusIcon = Flame;
    bgGlow = "bg-orange-500/20";
    iconColor = "text-orange-500";
    gradientLine = "from-red-500 via-orange-500 to-yellow-500";
    shadowColor = "shadow-[0_0_15px_rgba(249,115,22,0.4)]";
  }
  if (streakCount >= 7) {
    statusText = "Unstoppable!";
    StatusIcon = Rocket;
    bgGlow = "bg-purple-500/20";
    iconColor = "text-purple-400";
    gradientLine = "from-pink-500 via-purple-500 to-indigo-500";
    shadowColor = "shadow-[0_0_15px_rgba(168,85,247,0.4)]";
  }

  // Soft spring animation for a premium feel
  const modalVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { type: 'spring' as const, stiffness: 350, damping: 25 }
    },
    exit: { opacity: 0, y: 15, scale: 0.95, transition: { duration: 0.2 } }
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full max-w-[340px] bg-background/95 border border-border shadow-2xl rounded-3xl overflow-hidden"
          >
            {/* Dynamic Top Gradient Accent */}
            <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${gradientLine}`} />

            {/* Close Button */}
            <button
              onClick={close}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground p-1.5 rounded-full hover:bg-secondary transition-colors z-20"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="px-6 pt-10 pb-6 text-center relative z-10">
              
              {/* Background ambient glow */}
              <div className={`absolute top-10 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full ${bgGlow} blur-3xl -z-10`} />

              {/* Animated Icon Container */}
              <motion.div 
                initial={{ scale: 0.5, rotate: -15, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                transition={{ type: 'spring' as const, stiffness: 200, damping: 15 }}
                className={`w-20 h-20 mx-auto mb-5 rounded-2xl bg-secondary/50 border border-border/50 flex items-center justify-center relative ${shadowColor}`}
              >
                <StatusIcon className={`w-10 h-10 ${iconColor}`} fill="currentColor" />
                
                {/* Breathing pulse effect behind icon */}
                <motion.div
                  animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  className={`absolute inset-0 rounded-2xl ${bgGlow} blur-md -z-10`}
                />
              </motion.div>

              {/* Heading & Status Text */}
              <h2 className="text-3xl font-display font-black tracking-tight text-foreground mb-1">
                Day <span className={iconColor}>{streakCount}</span>
              </h2>
              <p className={`text-sm font-bold uppercase tracking-widest mb-5 ${iconColor}`}>
                {statusText}
              </p>

              {/* Quote Box */}
              <div className="bg-secondary/30 border border-border/50 rounded-xl p-3.5 mb-6 text-center shadow-inner">
                <p className="text-[13px] text-foreground/90 font-medium leading-relaxed italic">
                  "{displayQuote}"
                </p>
              </div>

              {/* 7-Day Tracker */}
              <div className="mb-8">
                <div className="flex justify-between gap-2">
                  {daysOfWeek.map((day, i) => {
                    const isActive = i <= todayIdx && i >= todayIdx - Math.min(streakCount - 1, todayIdx);
                    const isToday = i === todayIdx;

                    return (
                      <div key={i} className="flex flex-col items-center gap-1.5 flex-1">
                        <span className={`text-[10px] font-bold ${isToday ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {day}
                        </span>
                                                <div
                          className={`w-full aspect-square rounded-xl flex items-center justify-center transition-all duration-300 ${
                            isToday
                              ? `bg-gradient-to-br from-orange-500 to-amber-500 text-white ${shadowColor} scale-110 font-bold`
                              : isActive
                              ? 'bg-orange-500/15 text-orange-400 border border-orange-500/30'
                              : 'bg-secondary/30 text-muted-foreground/30'
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

              {/* Viral Share Streak Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowShareModal(true)}
                className="w-full mb-2.5 bg-gradient-to-r from-orange-500/15 via-amber-500/15 to-orange-500/15 border border-orange-500/30 text-orange-400 hover:text-orange-300 font-semibold rounded-xl py-2.5 transition-all text-xs flex items-center justify-center gap-2 hover:bg-orange-500/20 shadow-xs"
              >
                <Share2 className="w-4 h-4 text-orange-400" />
                <span>Share {streakCount}-Day Streak 🔥</span>
              </motion.button>

              {/* Primary CTA Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={close}
                className="w-full mb-3 bg-foreground text-background font-bold rounded-xl py-3 transition-all text-sm shadow-md flex items-center justify-center gap-2 hover:bg-foreground/90"
              >
                <Sparkles className="w-4 h-4" />
                Keep Building
              </motion.button>

              {/* Subtle Streak Freeze Protection Option */}
              {!user ? null : (
                <button
                  onClick={handleBuyFreeze}
                  disabled={(user.sageCoins || 0) < 10}
                  className="w-full text-center text-[11px] text-muted-foreground hover:text-amber-400 transition-colors flex items-center justify-center gap-1.5 py-1 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>Protect Streak with 10 Coins</span>
                </button>
              )}
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
