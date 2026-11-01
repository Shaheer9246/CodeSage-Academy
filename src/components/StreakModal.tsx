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
 * SageOwlMascot: CodeSage's Cheering & Dancing Owl Mascot
 * 100% Pure Lightweight Vector SVG + GPU-accelerated Framer Motion transforms
 * ==============================================================================
 */
function SageOwlMascot({ streakCount }: { streakCount: number }) {
  const isSuper = streakCount >= 7;
  const isHot = streakCount >= 3;
  const [isDancingFast, setIsDancingFast] = useState(false);

  // Dance speed multiplier (faster for higher streaks or when tapped)
  const danceDuration = isDancingFast ? 0.6 : isSuper ? 0.85 : isHot ? 1.0 : 1.2;

  return (
    <div 
      className="relative w-32 h-32 sm:w-36 sm:h-36 mx-auto flex items-center justify-center select-none cursor-pointer group"
      onClick={() => {
        setIsDancingFast(true);
        setTimeout(() => setIsDancingFast(false), 2000);
      }}
      title="Click me to cheer faster!"
    >
      {/* Ambient background glow pulsing with the music beat */}
      <motion.div
        animate={{ 
          scale: isDancingFast ? [1.1, 1.35, 1.1] : [1, 1.25, 1], 
          opacity: isDancingFast ? [0.6, 0.9, 0.6] : [0.35, 0.65, 0.35] 
        }}
        transition={{ repeat: Infinity, duration: danceDuration, ease: "easeInOut" }}
        className={`absolute inset-0 rounded-full blur-2xl -z-10 ${
          isSuper ? 'bg-purple-500/35' : isHot ? 'bg-orange-500/40' : 'bg-amber-500/30'
        }`}
      />

      {/* Floating Code & Sparkle Confetti (Pure Vector, zero weight) */}
      <motion.div
        animate={{ y: [-3, 3, -3], opacity: [0.7, 1, 0.7] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        className="absolute inset-0 pointer-events-none"
      >
        <motion.span 
          animate={{ y: [0, -6, 0], x: [-2, 2, -2], rotate: [-10, 10, -10] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
          className="absolute -top-1 left-3 text-[11px] font-mono font-bold text-amber-400 select-none drop-shadow"
        >
          &lt;/&gt;
        </motion.span>
        <motion.span 
          animate={{ y: [0, -8, 0], rotate: [8, -8, 8] }}
          transition={{ repeat: Infinity, duration: 1.9, delay: 0.3, ease: "easeInOut" }}
          className="absolute -top-1 right-3 text-[11px] font-mono font-bold text-emerald-400 select-none drop-shadow"
        >
          &#123;&#125;
        </motion.span>
        <motion.span 
          animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.4, 0.9, 0.4] }}
          transition={{ repeat: Infinity, duration: 1.3, delay: 0.5, ease: "easeInOut" }}
          className="absolute bottom-2 left-2 text-[10px] text-yellow-300 select-none"
        >
          ✨
        </motion.span>
        <motion.span 
          animate={{ scale: [0.8, 1.25, 0.8], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.4, delay: 0.2, ease: "easeInOut" }}
          className="absolute bottom-3 right-3 text-xs select-none"
        >
          🔥
        </motion.span>
      </motion.div>

      {/* Main Dancing Owl Avatar */}
      <motion.div
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.92, rotate: 6 }}
        className="relative w-full h-full flex items-center justify-center"
      >
        <svg 
          viewBox="0 0 160 160" 
          className="w-full h-full drop-shadow-2xl overflow-visible" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* DEFINITIONS & GRADIENTS */}
          <defs>
            <linearGradient id="owlBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
            <linearGradient id="owlBellyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#334155" />
              <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>
            <linearGradient id="owlFlameGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="50%" stopColor="#ea580c" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
          </defs>

          {/* DANCING BODY & HEAD ROOT GROUP */}
          <motion.g
            animate={{ 
              y: [0, -8, 0, -4, 0],
              rotate: [-3.5, 3.5, -3.5, 3.5, 0]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: danceDuration, 
              ease: "easeInOut" 
            }}
            style={{ transformOrigin: "80px 130px" }}
          >
            {/* Owl Body */}
            <ellipse cx="80" cy="95" rx="42" ry="46" fill="url(#owlBodyGrad)" stroke="#38bdf8" strokeWidth="2.5" strokeOpacity="0.4" />
            
            {/* Owl Belly */}
            <ellipse cx="80" cy="102" rx="28" ry="30" fill="url(#owlBellyGrad)" />
            <path d="M72 92 C76 96, 84 96, 88 92" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M70 104 C75 108, 85 108, 90 104" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M73 116 C77 119, 83 119, 87 116" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" />

            {/* Owl Ears / Tufts with bouncy wiggle */}
            <motion.path 
              animate={{ rotate: [-2, 4, -2] }}
              transition={{ repeat: Infinity, duration: danceDuration * 0.9, ease: "easeInOut" }}
              style={{ transformOrigin: "62px 42px" }}
              d="M50 54 L62 30 L72 52 Z" 
              fill="#0f172a" 
              stroke="#38bdf8" 
              strokeWidth="2"
              strokeOpacity="0.3"
            />
            <motion.path 
              animate={{ rotate: [2, -4, 2] }}
              transition={{ repeat: Infinity, duration: danceDuration * 0.9, ease: "easeInOut" }}
              style={{ transformOrigin: "98px 42px" }}
              d="M110 54 L98 30 L88 52 Z" 
              fill="#0f172a" 
              stroke="#38bdf8" 
              strokeWidth="2"
              strokeOpacity="0.3"
            />

            {/* Owl Head with rhythmic bobbing */}
            <motion.g
              animate={{ rotate: [-3, 3, -3], y: [-1, 1, -1] }}
              transition={{ repeat: Infinity, duration: danceDuration * 1.1, ease: "easeInOut" }}
              style={{ transformOrigin: "80px 62px" }}
            >
              <circle cx="80" cy="62" r="34" fill="#0f172a" stroke="#38bdf8" strokeWidth="2.5" strokeOpacity="0.5" />

              {/* Big Sparkling Owl Eyes */}
              <circle cx="66" cy="60" r="14" fill="#ffffff" />
              <circle cx="94" cy="60" r="14" fill="#ffffff" />

              {/* Animated Pupils with enthusiastic blinking / happy dance squints */}
              <motion.g
                animate={{ 
                  scaleY: [1, 1, 0.15, 1, 1],
                  scaleX: [1, 1, 1.05, 1, 1]
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 2.8, 
                  times: [0, 0.45, 0.5, 0.55, 1], 
                  ease: "easeInOut" 
                }}
                style={{ transformOrigin: "80px 60px" }}
              >
                {/* Outer Iris */}
                <circle cx="66" cy="60" r="9" fill="#0284c7" />
                <circle cx="94" cy="60" r="9" fill="#0284c7" />
                {/* Deep Pupil */}
                <circle cx="67" cy="60" r="6.5" fill="#0f172a" />
                <circle cx="95" cy="60" r="6.5" fill="#0f172a" />
                {/* Excited Starlight Shines */}
                <circle cx="69" cy="57.5" r="3" fill="#ffffff" />
                <circle cx="97" cy="57.5" r="3" fill="#ffffff" />
                <circle cx="64.5" cy="62.5" r="1.3" fill="#ffffff" />
                <circle cx="92.5" cy="62.5" r="1.3" fill="#ffffff" />
              </motion.g>

              {/* Cheerful Beak with singing/cheering open motion */}
              <motion.polygon 
                animate={{ scaleY: [1, 1.25, 1], y: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: danceDuration * 0.5, ease: "easeInOut" }}
                style={{ transformOrigin: "80px 68px" }}
                points="76,68 84,68 80,78" 
                fill="#f59e0b" 
              />

              {/* Cute Blushing Cheeks */}
              <motion.ellipse 
                animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0.85, 0.6] }}
                transition={{ repeat: Infinity, duration: danceDuration, ease: "easeInOut" }}
                cx="55" cy="70" rx="5" ry="3.5" fill="#f43f5e" 
              />
              <motion.ellipse 
                animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0.85, 0.6] }}
                transition={{ repeat: Infinity, duration: danceDuration, ease: "easeInOut" }}
                cx="105" cy="70" rx="5" ry="3.5" fill="#f43f5e" 
              />

              {/* Tier Accessory: Golden Crown with Sparkling Jewels (Days 7+) */}
              {isSuper && (
                <motion.g 
                  animate={{ y: [-1, 1, -1], rotate: [-2, 2, -2] }}
                  transition={{ repeat: Infinity, duration: danceDuration, ease: "easeInOut" }}
                  transform="translate(60, 13)"
                >
                  <path d="M4 18 L10 6 L20 14 L30 6 L36 18 Z" fill="#fbbf24" stroke="#f59e0b" strokeWidth="2" />
                  <circle cx="10" cy="5" r="2.2" fill="#ef4444" />
                  <circle cx="20" cy="13" r="2.2" fill="#3b82f6" />
                  <circle cx="30" cy="5" r="2.2" fill="#10b981" />
                </motion.g>
              )}

              {/* Tier Accessory: Developer Headband with Flame Emblem (Days 3-6) */}
              {isHot && !isSuper && (
                <g>
                  <rect x="47" y="44" width="66" height="7" rx="3.5" fill="#ea580c" />
                  <circle cx="80" cy="47.5" r="4.5" fill="#fef08a" />
                  <path d="M78 48 C79 46, 81 46, 82 48" stroke="#ea580c" strokeWidth="1.2" strokeLinecap="round" />
                </g>
              )}

              {/* Tier Accessory: Neon Cyan Coding Glasses (Days 1-2) */}
              {!isHot && (
                <g stroke="#38bdf8" strokeWidth="2.5" fill="none">
                  <circle cx="66" cy="60" r="14" />
                  <circle cx="94" cy="60" r="14" />
                  <line x1="80" y1="60" x2="80" y2="60" strokeWidth="3" />
                </g>
              )}
            </motion.g>

            {/* LEFT WING: Cheering, Flapping & Waving in Celebration */}
            <motion.g
              animate={{ 
                rotate: [0, -38, 8, -32, 0],
                y: [0, -4, 0, -3, 0]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: danceDuration, 
                ease: "easeInOut" 
              }}
              style={{ transformOrigin: "48px 88px" }}
            >
              <path 
                d="M44 85 C28 92, 26 116, 42 122 C40 108, 42 96, 48 88 Z" 
                fill="#0f172a" 
                stroke="#38bdf8" 
                strokeWidth="2.5" 
                strokeOpacity="0.5" 
              />
            </motion.g>

            {/* RIGHT WING: Pumping the Flame Torch / Cheering Fist */}
            <motion.g
              animate={{ 
                rotate: [0, 35, -6, 28, 0],
                y: [0, -5, 0, -4, 0]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: danceDuration, 
                ease: "easeInOut" 
              }}
              style={{ transformOrigin: "112px 88px" }}
            >
              <path 
                d="M116 85 C132 92, 134 116, 118 122 C120 108, 118 96, 112 88 Z" 
                fill="#0f172a" 
                stroke="#38bdf8" 
                strokeWidth="2.5" 
                strokeOpacity="0.5" 
              />
            </motion.g>
          </motion.g>

          {/* DANCING HAPPY FEET: Alternating Step-Tap Dance */}
          {/* Left Foot */}
          <motion.ellipse 
            animate={{ 
              y: [0, -5, 0, 0, 0],
              scaleX: [1, 0.9, 1.1, 1, 1]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: danceDuration, 
              ease: "easeInOut" 
            }}
            cx="68" cy="140" rx="7" ry="4.5" fill="#f59e0b" 
          />
          {/* Right Foot (Staggered for rhythmic tap) */}
          <motion.ellipse 
            animate={{ 
              y: [0, 0, 0, -5, 0],
              scaleX: [1, 1, 1, 0.9, 1]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: danceDuration, 
              ease: "easeInOut" 
            }}
            cx="92" cy="140" rx="7" ry="4.5" fill="#f59e0b" 
          />
        </svg>

        {/* Floating Blazing Streak Torch / Trophy Badge */}
        <motion.div
          animate={{ 
            scale: isDancingFast ? [1.1, 1.35, 1.1] : [1, 1.18, 1], 
            rotate: [-6, 6, -6],
            y: [-3, 3, -3]
          }}
          transition={{ repeat: Infinity, duration: danceDuration * 0.9, ease: "easeInOut" }}
          className="absolute -right-2 bottom-0 w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 via-orange-500 to-red-500 border-2 border-background shadow-xl flex items-center justify-center text-white"
        >
          {isSuper ? (
            <Rocket className="w-5 h-5 fill-current animate-pulse" />
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
            className="relative w-full max-w-[340px] sm:max-w-[360px] bg-background/95 border border-border shadow-2xl rounded-3xl overflow-hidden"
          >
            {/* Top Accent Gradient Bar */}
            <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${gradientLine}`} />

            {/* Close Button */}
            <button
              onClick={close}
              className="absolute top-3.5 right-3.5 text-muted-foreground hover:text-foreground p-1 rounded-full hover:bg-secondary transition-colors z-20"
              aria-label="Close streak modal"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="px-4.5 sm:px-5 pt-5 pb-4 text-center relative z-10">
              
              {/* Mascot Stage - Owl stays prominent & fun */}
              <div className="mb-1">
                <SageOwlMascot streakCount={streakCount} />
              </div>

              {/* Heading & Status Text */}
              <div className="space-y-0.5 mb-2.5">
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary/80 border border-border/60 text-[10px] font-mono font-bold text-muted-foreground">
                  <Award className="w-3 h-3 text-primary" />
                  <span>CODESAGE LEARNING STREAK</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-display font-black tracking-tight text-foreground">
                  Day <span className={iconColor}>{streakCount}</span>
                </h2>
                <p className={`text-[11px] sm:text-xs font-bold uppercase tracking-wider ${iconColor}`}>
                  {statusText}
                </p>
              </div>

              {/* Inspiring Developer Quote */}
              <div className="bg-secondary/30 border border-border/50 rounded-lg px-2.5 py-2 mb-2.5 text-center shadow-inner">
                <p className="text-[11px] sm:text-xs text-foreground/85 font-medium leading-relaxed italic">
                  "{displayQuote}"
                </p>
              </div>

              {/* 7-Day Tracker with Warm Colors */}
              <div className="mb-3 bg-card/60 border border-border/40 rounded-xl p-2 sm:p-2.5">
                <div className="flex justify-between gap-1 sm:gap-1.5">
                  {daysOfWeek.map((day, i) => {
                    const isActive = i <= todayIdx && i >= todayIdx - Math.min(streakCount - 1, todayIdx);
                    const isToday = i === todayIdx;

                    return (
                      <div key={i} className="flex flex-col items-center gap-1 flex-1">
                        <span className={`text-[9px] font-bold ${isToday ? 'text-foreground font-black' : 'text-muted-foreground'}`}>
                          {day}
                        </span>
                        <div
                          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
                            isToday
                              ? `bg-gradient-to-br from-orange-500 to-amber-500 text-white ${shadowColor} scale-105 font-bold`
                              : isActive
                              ? 'bg-orange-500/15 text-orange-400 border border-orange-500/30'
                              : 'bg-secondary/40 text-muted-foreground/30'
                          }`}
                        >
                          {isActive ? (
                            <StatusIcon className={`w-3 h-3 ${isToday ? 'fill-current' : 'opacity-70'}`} />
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
              <div className="space-y-1.5">
                {/* Primary CTA */}
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={close}
                  className="w-full bg-foreground text-background font-bold rounded-xl py-2.5 transition-all text-xs sm:text-sm shadow-md flex items-center justify-center gap-1.5 hover:bg-foreground/90"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Keep Building
                </motion.button>

                {/* Viral Share Streak Button */}
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setShowShareModal(true)}
                  className="w-full bg-gradient-to-r from-orange-500/15 via-amber-500/15 to-orange-500/15 border border-orange-500/30 text-orange-400 hover:text-orange-300 font-semibold rounded-xl py-2 transition-all text-[11px] sm:text-xs flex items-center justify-center gap-1.5 hover:bg-orange-500/20 shadow-xs"
                >
                  <Share2 className="w-3.5 h-3.5 text-orange-400" />
                  <span>Share {streakCount}-Day Streak 🔥</span>
                </motion.button>

                {/* Subtle Streak Freeze Protection Option */}
                {!user ? null : (
                  <button
                    onClick={handleBuyFreeze}
                    disabled={(user.sageCoins || 0) < 10}
                    className="w-full text-center text-[10px] text-muted-foreground hover:text-amber-400 transition-colors flex items-center justify-center gap-1 pt-0.5 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ShieldCheck className="w-3 h-3 text-amber-400" />
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
