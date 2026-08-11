import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Check, Sparkles, X } from 'lucide-react';

const MOTIVATIONAL_QUOTES = [
  "Consistency is what transforms average into excellence.",
  "Small daily improvements over time lead to stunning results.",
  "Focus on progress, not perfection. Keep showing up!",
  "The secret of getting ahead is getting started.",
  "Your future self will thank you for today's effort.",
  "Code a little every day, and watch your skills skyrocket!"
];

interface StreakModalProps {
  streakCount: number;
}

export function StreakModal({ streakCount }: StreakModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [quote, setQuote] = useState('');

  useEffect(() => {
    // 1. Check if the modal was already shown today
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const lastShownDate = localStorage.getItem('codesage_streak_shown_date');

    if (lastShownDate !== today) {
      // Pick a random quote
      const randomQuote = MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
      setQuote(randomQuote);
      setIsOpen(true);
      
      // Save today's date so it won't show again today
      localStorage.setItem('codesage_streak_shown_date', today);
    }
  }, []);

  if (!isOpen) return null;

  // 7-day streak flames preview
  const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const todayIdx = new Date().getDay();

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="glass-card relative w-full max-w-sm rounded-3xl p-6 text-center border border-primary/30 shadow-2xl overflow-hidden"
        >
          {/* Close Button */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground p-1.5 rounded-full bg-secondary/30 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Animated Flame Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="w-20 h-20 mx-auto mb-3 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center relative"
          >
            <Flame className="w-10 h-10 text-primary animate-pulse" />
            <Sparkles className="w-5 h-5 text-amber-400 absolute -top-1 -right-1" />
          </motion.div>

          {/* Heading */}
          <h2 className="text-2xl font-bold font-display text-foreground mb-1">
            Yahoo! Day <span className="text-primary neon-text">{streakCount}</span>
          </h2>
          <p className="text-xs text-muted-foreground font-medium mb-4">
            You showed up today! Your streak is alive.
          </p>

          {/* Motivational Quote */}
          <div className="bg-secondary/20 rounded-2xl p-3.5 border border-border/30 mb-5">
            <p className="text-xs italic text-foreground/90 font-serif">
              "{quote}"
            </p>
          </div>

          {/* 7-Day Flame Track */}
          <div className="mb-6">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2 font-display">
              Weekly Progress
            </p>
            <div className="flex justify-center gap-2">
              {daysOfWeek.map((day, i) => {
                const isActive = i <= todayIdx && i >= todayIdx - Math.min(streakCount - 1, todayIdx);
                const isToday = i === todayIdx;

                return (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <span className="text-[9px] text-muted-foreground font-mono">{day}</span>
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                        isToday
                          ? 'bg-primary text-primary-foreground border-2 border-primary ring-2 ring-primary/30'
                          : isActive
                          ? 'bg-primary/20 text-primary border border-primary/30'
                          : 'bg-secondary/30 text-muted-foreground border border-border/20'
                      }`}
                    >
                      {isActive ? (
                        <Flame className={`w-4 h-4 ${isToday ? 'fill-current' : ''}`} />
                      ) : (
                        <Check className="w-3.5 h-3.5 opacity-30" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Keep Going Button */}
          <button
            onClick={() => setIsOpen(false)}
            className="w-full bg-primary text-primary-foreground font-semibold rounded-xl py-3 hover:opacity-90 transition-all text-sm font-display shadow-lg shadow-primary/20"
          >
            Let's Code! 🚀
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
