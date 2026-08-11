import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, X, Sparkles, Check } from 'lucide-react';


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
 * StreakModal: Modern, compact, developer-friendly UI
 * ==============================================================================
 */
interface StreakModalProps {
  streakCount: number;
}

export function StreakModal({ streakCount }: StreakModalProps) {
  const { isOpen, quote, todayIdx, daysOfWeek, closeModal } = useStreakMonitor();

  if (!isOpen) return null;

  // Soft spring animation for a premium feel
  const modalVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { type: 'spring', stiffness: 300, damping: 25 }
    },
    exit: { opacity: 0, y: 10, scale: 0.95, transition: { duration: 0.15 } }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          // Compact mobile sizing
          className="relative w-full max-w-[340px] bg-background border border-border/60 shadow-2xl rounded-2xl overflow-hidden"
        >
          {/* Subtle Top Gradient Accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-500" />

          {/* Close Button */}
          <button
            onClick={closeModal}
            className="absolute top-3 right-3 text-muted-foreground/60 hover:text-foreground p-1.5 rounded-full hover:bg-secondary/80 transition-colors z-10"
          >
            <X className="w-3.5 h-3.5" />
          </button>

          <div className="px-6 pt-8 pb-6 text-center">
            {/* Animated Icon Container */}
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
              className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-500/10 border border-orange-500/20 flex items-center justify-center relative"
            >
              <Flame className="w-8 h-8 text-orange-500" fill="currentColor" />
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className="absolute inset-0 bg-orange-500/20 rounded-2xl blur-md -z-10"
              />
            </motion.div>

            {/* Heading & Git Commit Metaphor */}
            <h2 className="text-2xl font-bold tracking-tight text-foreground mb-1">
              Day <span className="text-orange-500">{streakCount}</span>
            </h2>
            <p className="text-xs text-muted-foreground font-mono mb-5">
              git commit -m "Kept the streak alive 🔥"
            </p>

            {/* Quote Box (Syntax Highlighting Style) */}
            <div className="bg-secondary/40 border-l-2 border-primary/50 rounded-r-lg p-3 mb-6 text-left">
              <p className="text-[13px] text-foreground/90 leading-relaxed italic">
                "{quote}"
              </p>
            </div>

            {/* 7-Day Tracker */}
            <div className="mb-6">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-3 font-semibold text-left px-1">
                Weekly Uptime
              </p>
              <div className="flex justify-between gap-1.5">
                {daysOfWeek.map((day, i) => {
                  const isActive = i <= todayIdx && i >= todayIdx - Math.min(streakCount - 1, todayIdx);
                  const isToday = i === todayIdx;

                  return (
                    <div key={i} className="flex flex-col items-center gap-1.5 flex-1">
                      <span className={`text-[9px] font-medium ${isToday ? 'text-foreground' : 'text-muted-foreground/60'}`}>
                        {day}
                      </span>
                      <div
                        className={`w-full aspect-square rounded-lg flex items-center justify-center transition-all ${
                          isToday
                            ? 'bg-orange-500 text-white shadow-[0_0_12px_rgba(249,115,22,0.4)]'
                            : isActive
                            ? 'bg-primary/15 text-primary border border-primary/30'
                            : 'bg-secondary/50 text-muted-foreground/40 border border-border/40'
                        }`}
                      >
                        {isActive ? (
                          <Flame className={`w-3.5 h-3.5 ${isToday ? 'fill-current' : ''}`} />
                        ) : (
                          <div className="w-1 h-1 rounded-full bg-current opacity-30" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={closeModal}
              className="w-full bg-primary text-primary-foreground font-semibold rounded-xl py-3 hover:opacity-90 active:scale-[0.98] transition-all text-sm shadow-lg shadow-primary/10 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Keep Coding
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
