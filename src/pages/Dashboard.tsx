import { useNavigate, useSearchParams } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { Code, Zap, ChevronRight, Flame, MessageSquare, Snowflake, X, UserPlus, Map } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const FULLSTACK_LESSONS = [
  { step: 1, label: 'Web Architecture', icon: '🏗️' },
  { step: 2, label: 'HTML', icon: '📄' },
  { step: 3, label: 'CSS', icon: '🎨' },
  { step: 4, label: 'Flexbox', icon: '📐' },
  { step: 5, label: 'Grid', icon: '🔲' },
  { step: 6, label: 'Terminal & CLI', icon: '💻' },
  { step: 7, label: 'Git', icon: '🔀' },
  { step: 8, label: 'JS Logic', icon: '⚡' },
  { step: 9, label: 'DOM', icon: '🌳' },
  { step: 10, label: 'GitHub', icon: '🐙' },
  { step: 11, label: 'ES6+', icon: '✨' },
  { step: 12, label: 'APIs', icon: '📡' },
  { step: 13, label: 'NPM', icon: '📦' },
  { step: 14, label: 'Tailwind', icon: '🌬️' },
  { step: 15, label: 'React', icon: '⚛️' },
  { step: 16, label: 'Hooks', icon: '🪝' },
  { step: 17, label: 'Context', icon: '🔄' },
  { step: 18, label: 'Testing', icon: '🧪' },
  { step: 19, label: 'Security', icon: '🛡️' },
  { step: 20, label: 'Deployment', icon: '🚀' },
];

const FREELANCE_LESSONS = [
  { step: 1, label: 'Find Your Niche', icon: '🎯' },
  { step: 2, label: 'Portfolio', icon: '🎨' },
  { step: 3, label: 'Branding', icon: '💡' },
  { step: 4, label: 'Platforms', icon: '🌐' },
  { step: 5, label: 'Outreach', icon: '📧' },
  { step: 6, label: 'Pricing', icon: '💰' },
  { step: 7, label: 'Contracts', icon: '📃' },
  { step: 8, label: 'Management', icon: '🤝' },
];

const NETWORKING_LESSONS = [
  { step: 1, label: 'Hardware', icon: '🖥️' },
  { step: 2, label: 'Operating Systems', icon: '💻' },
  { step: 3, label: 'IP Addressing', icon: '🌐' },
  { step: 4, label: 'DNS', icon: '🏠' },
  { step: 5, label: 'OSI Model', icon: '📶' },
  { step: 6, label: 'Protocols', icon: '📡' },
  { step: 7, label: 'Security', icon: '🔒' },
  { step: 8, label: 'Browsers', icon: '🌍' },
];

const Dashboard = () => {
  const { user, loading, updateStreak, applyPromoCode, buyFreezeStreak } = useUser();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isGuest = searchParams.get('guest') === '1';
  const [promoInput, setPromoInput] = useState('');
  const [promoMsg, setPromoMsg] = useState('');
  const [showShop, setShowShop] = useState(false);

  useEffect(() => { if (user && !isGuest) updateStreak(); }, [isGuest]);

  // Brand-new users → tour redirect (item 4)
  useEffect(() => {
    if (user && !isGuest && user.name && user.hasSeenTour === false) {
      navigate('/tour', { replace: true });
    }
  }, [user, isGuest, navigate]);

  if (loading) return null;
  if (!user && !isGuest) { navigate('/auth'); return null; }
  if (user && !user.name && !isGuest) { navigate('/onboarding'); return null; }


  const handlePromo = async () => {
    const ok = await applyPromoCode(promoInput);
    if (ok) { setPromoMsg('✅ Code applied!'); setPromoInput(''); }
    else setPromoMsg('❌ Invalid code');
    setTimeout(() => setPromoMsg(''), 3000);
  };

  const handleBuyFreeze = async () => {
    if ((user?.xp || 0) < 10) { toast.error('Need 10 XP to buy a Streak Freeze'); return; }
    const ok = await buyFreezeStreak();
    if (ok) { toast.success('❄️ Streak Freeze active — one missed day is forgiven'); setShowShop(false); }
    else toast.error('Could not purchase freeze');
  };

  const go = (path: string) => () => {
    if (isGuest) {
      toast.info('Sign up to unlock this — it takes 10 seconds ✨');
      navigate('/auth');
      return;
    }
    navigate(path);
  };

  // Display name/values: real for users, fake for guests
  const displayName = user?.name || 'Explorer';
  const xp = user?.xp || 0;
  const streak = user?.streakCount || 0;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden grid-bg">
      <div className="absolute top-[-15%] right-[-10%] w-[500px] h-[500px] rounded-full bg-primary/3 blur-[150px] pointer-events-none" />

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="relative z-10 max-w-2xl mx-auto p-4 space-y-4"
      >
        {isGuest && (
          <div className="glass-card rounded-2xl border border-primary/40 p-3 flex items-center gap-3 neon-glow">
            <div className="w-9 h-9 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
              <UserPlus className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-display font-bold text-foreground">You're touring as a guest 👋</p>
              <p className="text-[10px] text-muted-foreground">Sign up to save progress, earn XP, unlock lessons.</p>
            </div>
            <button onClick={() => navigate('/auth')}
              className="bg-primary text-primary-foreground text-[11px] font-display font-bold px-3 py-1.5 rounded-xl whitespace-nowrap">
              Sign Up
            </button>
          </div>
        )}

        {/* Welcome + XP/Streak pills */}
        <motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-xl font-bold font-display truncate">
              {isGuest ? 'Welcome to ' : 'Welcome Back, '}<span className="text-primary neon-text">{isGuest ? 'CodeSage' : displayName}</span>
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">{isGuest ? 'Tap any tile for a preview' : 'Continue your coding journey'}</p>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button onClick={() => isGuest ? navigate('/auth') : setShowShop(true)}
              className="flex items-center gap-1 bg-primary/10 border border-primary/30 px-2.5 py-1.5 rounded-full hover:neon-glow transition-all">
              <Zap className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-bold text-primary">{xp}</span>
            </button>
            <div className="flex items-center gap-1 bg-orange-500/10 border border-orange-500/30 px-2.5 py-1.5 rounded-full">
              <Flame className="w-3.5 h-3.5 text-orange-400" />
              <span className="text-xs font-bold text-orange-400">{streak}d</span>
            </div>
            {!isGuest && (
              <button onClick={() => navigate('/roadmap')} title="Roadmap"
                className="flex items-center gap-1 bg-secondary/40 border border-border/40 px-2.5 py-1.5 rounded-full hover:neon-glow transition-all">
                <Map className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            )}
          </div>
        </motion.div>


        {showShop && (
          <div className="glass-card rounded-2xl p-4 border border-primary/30 neon-glow space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-display font-bold text-foreground flex items-center gap-2">
                <Snowflake className="w-4 h-4 text-primary" /> XP Shop
              </h3>
              <button onClick={() => setShowShop(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center justify-between gap-3 bg-secondary/30 rounded-xl p-3">
              <div className="min-w-0">
                <p className="text-sm font-display font-semibold text-foreground">Streak Freeze ❄️</p>
                <p className="text-[10px] text-muted-foreground">Forgive one missed day. Active until tomorrow.</p>
              </div>
              <button onClick={handleBuyFreeze} disabled={(user.xp || 0) < 10}
                className="bg-primary text-primary-foreground text-xs font-display font-semibold px-3 py-2 rounded-xl disabled:opacity-30 hover:neon-glow whitespace-nowrap">
                10 XP
              </button>
            </div>
            {user.streakFreezeUntil && (
              <p className="text-[10px] text-emerald-400">❄️ Freeze active until {user.streakFreezeUntil}</p>
            )}
          </div>
        )}

        {/* 2 Action Boxes: Challenges + Code Editor */}
        <div className="grid grid-cols-2 gap-3">
          <motion.button
            initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 }}
            onClick={() => navigate('/challenges')}
            className="glass-card p-4 rounded-2xl text-left hover:neon-border transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-accent-orange/15 flex items-center justify-center mb-2">
              <Zap className="w-5 h-5 text-accent-orange" />
            </div>
            <p className="text-sm font-bold font-display text-foreground">Challenges</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">Test your skills</p>
          </motion.button>

          <motion.button
            initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.15 }}
            onClick={() => navigate('/playground')}
            className="glass-card p-4 rounded-2xl text-left hover:neon-border transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center mb-2">
              <Code className="w-5 h-5 text-primary" />
            </div>
            <p className="text-sm font-bold font-display text-foreground">Code Editor</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">Playground</p>
          </motion.button>
        </div>

        {/* Frontend Development Box */}
        <motion.button
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
          onClick={() => navigate('/learn')}
          className="w-full glass-card p-5 rounded-2xl text-left hover:neon-border transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-2xl border border-primary/20">
                📱
              </div>
              <div>
                <p className="text-base font-bold font-display text-foreground">Frontend Development</p>
                <div className="flex gap-2 mt-1">
                  {['HTML', 'CSS', 'JS'].map(t => (
                    <span key={t} className="text-[9px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-mono">{t}</span>
                  ))}
                </div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-primary" />
          </div>
          <p className="text-[10px] text-muted-foreground mt-2">Beginner → Intermediate → Expert</p>
        </motion.button>

        {/* Computer & Networking — UNLOCKED */}
        <motion.button
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.25 }}
          onClick={() => navigate('/networking?from=dashboard')}
          className="w-full glass-card p-5 rounded-2xl text-left hover:neon-border transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-accent-blue/15 flex items-center justify-center text-2xl border border-accent-blue/30">
                🌐
              </div>
              <div>
                <p className="text-base font-bold font-display text-foreground">Computer & Networking Fundamentals</p>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {NETWORKING_LESSONS.slice(0, 4).map(l => (
                    <span key={l.step} className="text-[8px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-mono">{l.label}</span>
                  ))}
                </div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-primary" />
          </div>
          <p className="text-[10px] text-muted-foreground mt-2">Hardware → OS → Networking → Security · 10 lessons</p>
        </motion.button>

        {/* Full Stack Frontend Development — UNLOCKED */}
        <motion.button
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
          onClick={() => navigate('/fullstack?from=dashboard')}
          className="w-full glass-card p-5 rounded-2xl text-left hover:neon-border transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-accent-orange/15 flex items-center justify-center text-2xl border border-accent-orange/30">
                🚀
              </div>
              <div>
                <p className="text-base font-bold font-display text-foreground">Full Stack Frontend Dev</p>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {FULLSTACK_LESSONS.slice(0, 4).map(l => (
                    <span key={l.step} className="text-[8px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-mono">{l.label}</span>
                  ))}
                </div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-primary" />
          </div>
          <p className="text-[10px] text-muted-foreground mt-2">HTML → CSS → JS → React → Deploy · {FULLSTACK_LESSONS.length} lessons</p>
        </motion.button>

        {/* Freelance & Clients — UNLOCKED */}
        <motion.button
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.35 }}
          onClick={() => navigate('/freelance?from=dashboard')}
          className="w-full glass-card p-5 rounded-2xl text-left hover:neon-border transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-yellow-500/15 flex items-center justify-center text-2xl border border-yellow-500/30">
                💼
              </div>
              <div>
                <p className="text-base font-bold font-display text-foreground">Freelance & Clients</p>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {FREELANCE_LESSONS.slice(0, 4).map(l => (
                    <span key={l.step} className="text-[8px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-mono">{l.label}</span>
                  ))}
                </div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-primary" />
          </div>
          <p className="text-[10px] text-muted-foreground mt-2">Niche → Pitch → Price → Deliver · 12 lessons</p>
        </motion.button>

        {/* Python Programming — NEW */}
        <motion.button
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}
          onClick={() => navigate('/python?from=dashboard')}
          className="w-full glass-card p-5 rounded-2xl text-left hover:neon-border transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-yellow-400/15 flex items-center justify-center text-2xl border border-yellow-400/30">
                🐍
              </div>
              <div>
                <p className="text-base font-bold font-display text-foreground">Python Programming</p>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {['Syntax','Functions','OOP','async'].map(t => (
                    <span key={t} className="text-[8px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-mono">{t}</span>
                  ))}
                </div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-primary" />
          </div>
          <p className="text-[10px] text-muted-foreground mt-2">Beginner → Advanced → Capstone · 20 lessons</p>
        </motion.button>

        {/* Local-Only Coding — NEW */}
        <motion.button
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.45 }}
          onClick={() => navigate('/local?from=dashboard')}
          className="w-full glass-card p-5 rounded-2xl text-left hover:neon-border transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-400/15 flex items-center justify-center text-2xl border border-emerald-400/30">
                🏠
              </div>
              <div>
                <p className="text-base font-bold font-display text-foreground">Local-Only Coding</p>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {['DOM','localStorage','PWA','Notes app'].map(t => (
                    <span key={t} className="text-[8px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-mono">{t}</span>
                  ))}
                </div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-primary" />
          </div>
          <p className="text-[10px] text-muted-foreground mt-2">No backend, no server, no cost · 15 lessons</p>
        </motion.button>

        {/* Suggestions tile */}
        <motion.button
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}
          onClick={() => navigate('/suggestions')}
          className="w-full glass-card p-4 rounded-2xl text-left hover:neon-border transition-all flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-xl bg-accent-yellow/15 flex items-center justify-center flex-shrink-0">
            <MessageSquare className="w-5 h-5 text-accent-yellow" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold font-display text-foreground">Suggestions & Feedback</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">What's missing? What feels off? Tell us — we read every one.</p>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        </motion.button>

        {/* Promo Code */}
        <div className="glass-card p-4 rounded-2xl">
          <h3 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider font-mono">promo_code</h3>
          <div className="flex gap-2">
            <input value={promoInput} onChange={e => setPromoInput(e.target.value)} placeholder="ENTER_CODE"
              className="flex-1 bg-secondary/40 border border-border rounded-lg px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 font-mono" />
            <button onClick={handlePromo} className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-xs font-bold font-display hover:neon-glow transition-all">
              Apply
            </button>
          </div>
          {promoMsg && <p className="text-xs mt-2 font-mono">{promoMsg}</p>}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
