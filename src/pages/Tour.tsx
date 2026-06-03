import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { supabase } from '@/integrations/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Code2, Wifi, Trophy, Users, MessageSquare, Settings, ChevronRight, ChevronLeft, Sparkles, X } from 'lucide-react';

const SLIDES = [
  { icon: Sparkles, title: 'Welcome to CodeSage', body: 'A free, no-ads, no-paywalls platform to learn coding from scratch. Take 60 seconds to see what\'s inside.' },
  { icon: BookOpen, title: 'Lessons & Tracks', body: 'Pick a track: Frontend, Full-Stack, Networking, Python, Freelance, or Local-Only. Each lesson has theory + practice + a short test.' },
  { icon: Code2, title: 'Code Playground', body: 'A real in-browser editor with live preview. Import files, upload ZIPs, save snapshots. No setup needed.' },
  { icon: Wifi, title: 'Computer & Networking', body: 'Understand the machines and protocols every developer uses — DNS, HTTP, OS, hardware, security.' },
  { icon: Trophy, title: 'Challenges & XP', body: 'Earn XP, Sage Coins, badges. Daily streaks unlock rewards. Levels test what you\'ve learned.' },
  { icon: Users, title: 'Community & Suggestions', body: 'Ask questions, share progress, and tell us what to build next. We read every suggestion.' },
  { icon: Settings, title: 'You\'re All Set', body: 'Pick a theme, set your profile, and start learning. Tap Finish when ready.' },
];

const Tour = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [i, setI] = useState(0);

  const finish = async () => {
    if (user) {
      try { await supabase.from('profiles').update({ has_seen_tour: true } as any).eq('id', user.id); } catch {}
    }
    navigate('/onboarding');
  };

  const slide = SLIDES[i];
  const Icon = slide.icon;

  return (
    <div className="min-h-screen bg-background grid-bg flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-[-15%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary/8 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[400px] h-[400px] rounded-full bg-accent-orange/5 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
            Step {i + 1} of {SLIDES.length}
          </span>
          <button onClick={finish} className="text-[11px] text-muted-foreground hover:text-foreground flex items-center gap-1">
            Skip <X className="w-3 h-3" />
          </button>
        </div>

        <div className="flex gap-1 mb-5">
          {SLIDES.map((_, idx) => (
            <div key={idx} className={`flex-1 h-1 rounded-full transition-all ${
              idx <= i ? 'bg-primary' : 'bg-secondary'
            }`} />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={i}
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="glass-card rounded-3xl p-7 text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center mb-4 neon-glow-strong">
              <Icon className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-xl font-display font-bold text-foreground mb-2">{slide.title}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{slide.body}</p>
          </motion.div>
        </AnimatePresence>

        <div className="flex gap-2 mt-5">
          <button onClick={() => setI(p => Math.max(0, p - 1))} disabled={i === 0}
            className="glass-card border border-border/50 text-foreground font-display font-semibold text-sm py-3 px-4 rounded-2xl disabled:opacity-30 flex items-center gap-1">
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
          {i < SLIDES.length - 1 ? (
            <button onClick={() => setI(p => Math.min(SLIDES.length - 1, p + 1))}
              className="flex-1 bg-primary text-primary-foreground font-display font-semibold text-sm py-3 rounded-2xl neon-glow flex items-center justify-center gap-1">
              Next <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button onClick={finish}
              className="flex-1 bg-primary text-primary-foreground font-display font-semibold text-sm py-3 rounded-2xl neon-glow-strong">
              Finish — Let\'s Go
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tour;
