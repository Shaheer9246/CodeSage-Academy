import { useNavigate, useSearchParams, Navigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { Code, Zap, ChevronRight, Flame, MessageSquare, Snowflake, X, UserPlus, Map, HelpCircle, Gamepad2, Palette, Users, Lock, Info, CheckCircle2 } from 'lucide-react';
import { THEMES, getTheme, applyTheme, type ThemeName } from '@/lib/theme';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import DashboardTour, { TourStep } from '@/components/DashboardTour';
import EnrollDialog from '@/components/EnrollDialog';
import { TrackId, TRACK_META, isEnrolled, getStudentCount, onEnrollmentChange } from '@/lib/enrollment';
import InboxBadge from '@/components/InboxBadge';
import SuggestionsBadge from '@/components/SuggestionsBadge';


const TOUR_STEPS: TourStep[] = [
  { target: 'frontend',   title: 'Frontend Development', body: 'Learn HTML, CSS, and JavaScript from absolute zero — your first real website by lesson 5.' },
  { target: 'networking', title: 'Computer & Networking', body: 'How the machine and the internet actually work — hardware, OS, DNS, HTTP, security.' },
  { target: 'fullstack',  title: 'Full Stack Frontend', body: 'Go deeper: React, hooks, APIs, testing, performance, and deployment in 28 lessons.' },
  { target: 'freelance',  title: 'Freelance & Clients', body: 'Turn your skills into income — pick a niche, pitch, price, contract, and deliver.' },
  { target: 'python',     title: 'Python Programming', body: 'From syntax to OOP, async, and a capstone project. Great as a second language.' },
  { target: 'local',      title: 'Local-Only Coding', body: 'Build real apps with zero backend — DOM, localStorage, PWAs, offline-first.' },
  { target: 'challenges', title: 'Challenges', body: 'Bite-sized coding puzzles across 4 difficulty tiers. Earn XP and badges.' },
  { target: 'playground', title: 'Code Editor', body: 'A real in-browser editor with live preview, ZIP import, console, and snapshots.' },
];

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
  { step: 21, label: 'TypeScript', icon: '🟦' },
  { step: 22, label: 'Navigation', icon: '🧭' },
  { step: 23, label: 'State Mgmt', icon: '🧠' },
  { step: 24, label: 'Forms', icon: '📋' },
  { step: 25, label: 'Accessibility', icon: '♿' },
  { step: 26, label: 'Performance', icon: '⚡' },
  { step: 27, label: 'Animations', icon: '🎬' },
  { step: 28, label: 'Capstone', icon: '🏆' },
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
  const { user, loading, updateStreak, applyPromoCode, buyFreezeStreak, markTourSeen } = useUser();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isGuest = searchParams.get('guest') === '1';
  const [promoInput, setPromoInput] = useState('');
  const [promoMsg, setPromoMsg] = useState('');
  const [showShop, setShowShop] = useState(false);
  const [theme, setTheme] = useState<ThemeName>(() => getTheme());
  const cycleTheme = () => {
    const idx = THEMES.findIndex(t => t.id === theme);
    const next = THEMES[(idx + 1) % THEMES.length].id;
    applyTheme(next); setTheme(next);
    toast.success(`Theme: ${THEMES.find(t => t.id === next)?.label}`);
  };
  
  // 👍 ADD THIS: Local state to give animations time to complete
  const [tourReady, setTourReady] = useState(false);

  // Enrollment dialog + refresh tick when enrollments change (for student counts).
  const [enrollTarget, setEnrollTarget] = useState<TrackId | null>(null);
  const [, setEnrollTick] = useState(0);
  useEffect(() => onEnrollmentChange(() => setEnrollTick(t => t + 1)), []);

  useEffect(() => {
    if (!user || isGuest) return;
    updateStreak();
  }, [isGuest, user, updateStreak]);


  // Brand-new users → in-page dashboard tour overlay (replaces /tour redirect)
  const showTour = !!user && !isGuest && user.isOnboarded === true && user.hasSeenTour === false;

  // Trigger a small delay timer if the tour needs to be shown
  useEffect(() => {
    if (!showTour) { setTourReady(false); return; }
    const timer = setTimeout(() => setTourReady(true), 600);
    return () => clearTimeout(timer);
  }, [showTour]);

 if (loading) return null;
if (!user && !isGuest) return <Navigate to="/auth" replace />;
if (user && !user.isOnboarded && !isGuest) return <Navigate to="/onboarding" replace />;


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

  // Guest mode: only the Frontend Development track is clickable (goes to first lesson).
  // Every other tile is locked behind a sign-up prompt.
  const GUEST_ALLOWED = new Set<string>(['/learn', '/networking', '/fullstack', '/freelance', '/python', '/local']);
  const GUEST_FIRST_LESSON: Record<string, string> = {
    '/learn': '/lesson/html-1?guest=1',
    '/networking': '/n-lesson/net-1?guest=1',
    '/fullstack': '/fs-lesson/fs-1?guest=1',
    '/freelance': '/f-lesson/free-1?guest=1',
    '/python': '/py-lesson/py-01?guest=1',
    '/local': '/local-lesson/local-1?guest=1',
  };

  // Map dashboard routes → track IDs (for enrollment gating on logged-in users).
  const ROUTE_TO_TRACK: Record<string, TrackId> = {
    '/learn': 'frontend',
    '/networking': 'networking',
    '/fullstack': 'fullstack',
    '/freelance': 'freelance',
    '/python': 'python',
    '/local': 'local',
    '/pythonexpert': 'pythonexpert',
  };

  const isTrackLockedForGuest = (path: string) => isGuest && !GUEST_ALLOWED.has(path.split('?')[0]);

  const go = (path: string) => () => {
    const bare = path.split('?')[0];
    if (isGuest) {
      const guestPath = GUEST_FIRST_LESSON[bare];
      if (guestPath) { navigate(guestPath); return; }
      toast.info('Sign up to unlock — it takes 10 seconds ✨');
      navigate('/auth');
      return;
    }
    // Enrollment gate for track routes.
    const track = ROUTE_TO_TRACK[bare];
    if (track && !isEnrolled(track)) {
      setEnrollTarget(track);
      return;
    }
    navigate(path);
  };

  // Per-tile helpers for guest lock / active-course glow / student count footer.
  const tileCls = (path: string) => {
    const bare = path.split('?')[0];
    const track = ROUTE_TO_TRACK[bare];
    const locked = isTrackLockedForGuest(path);
    const glow = !isGuest && track && isEnrolled(track);
    const guestHighlight = isGuest && GUEST_ALLOWED.has(bare);
    return [
      'w-full glass-card p-5 rounded-2xl text-left transition-all',
      locked ? 'opacity-40 pointer-events-none grayscale' : 'hover:neon-border',
      glow ? 'neon-border ring-1 ring-primary/40' : '',
      guestHighlight ? 'neon-glow ring-2 ring-primary/60 animate-pulse' : '',
    ].join(' ');
  };
  const TileFooter = ({ path, desc }: { path: string; desc: string }) => {
    const bare = path.split('?')[0];
    const track = ROUTE_TO_TRACK[bare];
    const locked = isTrackLockedForGuest(path);
    return (
      <div className="flex items-center justify-between mt-2 gap-2">
        <p className="text-[10px] text-muted-foreground truncate">{
          path === '/learn' ? desc.replace('12', '15\u00a0') :
          path === '/python' ? desc.replace('10', '30') :
          path === '/freelance' ? desc.replace('8', '12\u00a0') :
          path === '/networking' ? desc.replace('10', '13\u00a0') :
          desc
        }</p>
        <div className="flex items-center gap-1 flex-shrink-0">
          {track && (
            <span className="flex items-center gap-1 text-[9px] text-muted-foreground font-mono">
              <Users className="w-3 h-3" /> {getStudentCount(track).toLocaleString()}
            </span>
          )}
          {locked && (
            <span className="flex items-center gap-1 text-[9px] text-primary bg-primary/10 border border-primary/30 rounded-full px-1.5 py-0.5 font-mono">
              <Lock className="w-2.5 h-2.5" /> Sign up
            </span>
          )}
          {!isGuest && track && isEnrolled(track) && (
            <span className="text-[9px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 rounded-full px-1.5 py-0.5 font-mono">
              Enrolled
            </span>
          )}
        </div>
      </div>
    );
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
        <motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex flex-wrap items-center justify-between gap-2">
          <div className="min-w-0 flex-1 basis-full sm:basis-auto">
            <h1 className="text-lg sm:text-xl font-bold font-display truncate">
              {isGuest ? 'Welcome to ' : 'Welcome Back, '}<span className="text-primary neon-text">{isGuest ? 'CodeSage' : displayName}</span>
            </h1>
            <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5">{isGuest ? 'Tap any tile for a preview' : 'Continue your coding journey'}</p>
          </div>
          <div className="flex flex-wrap gap-1.5 sm:gap-2 flex-shrink-0 items-center">
            <button onClick={() => isGuest ? navigate('/auth') : setShowShop(true)}
              className="flex items-center gap-1 bg-primary/10 border border-primary/30 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-full hover:neon-glow transition-all">
              <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primary" />
              <span className="text-[11px] sm:text-xs font-bold text-primary">{xp}</span>
            </button>
            <div className="flex items-center gap-1 bg-orange-500/10 border border-orange-500/30 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-full">
              <Flame className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-orange-400" />
              <span className="text-[11px] sm:text-xs font-bold text-orange-400">{streak}d</span>
            </div>
            {!isGuest && (
              <>
                <div onClick={() => navigate('/inbox')} className="cursor-pointer flex items-center justify-center transition-transform active:scale-95">
                  <InboxBadge />
                </div>
                <div onClick={() => navigate('/suggestions')} className="cursor-pointer flex items-center justify-center transition-transform active:scale-95">
                  <SuggestionsBadge />
                </div>
                <button onClick={cycleTheme} title={`Theme: ${THEMES.find(t => t.id === theme)?.label}`}
                  className="flex items-center gap-1 bg-secondary/40 border border-border/40 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-full hover:neon-glow transition-all">
                  <Palette className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primary" />
                </button>
              </>
            )}
          </div>
        </motion.div>


        {showShop && user && (
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

        {/* 3 Action Boxes: Challenges + Code Editor + Exams */}
        <div className="grid grid-cols-3 gap-3">
          <motion.button
            initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 }}
            onClick={go('/challenges')}
          data-tour="challenges"
            className={`glass-card p-3 rounded-2xl text-left transition-all group ${isGuest ? 'opacity-40 pointer-events-none grayscale' : 'hover:neon-border'}`}
          >
            <div className="w-9 h-9 rounded-xl bg-accent-orange/15 flex items-center justify-center mb-2">
              <Zap className="w-4 h-4 text-accent-orange" />
            </div>
            <p className="text-[11px] font-bold font-display text-foreground leading-tight">Challenges</p>
            <p className="text-[9px] text-muted-foreground mt-0.5">Test skills</p>
          </motion.button>

          <motion.button
            initial={{ x: 0, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.12 }}
            onClick={go('/playground')}
          data-tour="playground"
            className={`glass-card p-3 rounded-2xl text-left transition-all group ${isGuest ? 'opacity-40 pointer-events-none grayscale' : 'hover:neon-border'}`}
          >
            <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center mb-2">
              <Code className="w-4 h-4 text-primary" />
            </div>
            <p className="text-[11px] font-bold font-display text-foreground leading-tight">Editor</p>
            <p className="text-[9px] text-muted-foreground mt-0.5">Playground</p>
          </motion.button>

          <motion.button
            initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.15 }}
            onClick={go('/exams')}
            className={`glass-card p-3 rounded-2xl text-left transition-all group ${isGuest ? 'opacity-40 pointer-events-none grayscale' : 'hover:neon-border'}`}
          >
            <div className="w-9 h-9 rounded-xl bg-accent-blue/15 flex items-center justify-center mb-2">
              <HelpCircle className="w-4 h-4 text-accent-blue" />
            </div>
            <p className="text-[11px] font-bold font-display text-foreground leading-tight">Exams</p>
            <p className="text-[9px] text-muted-foreground mt-0.5">Quiz tests</p>
          </motion.button>
        </div>

        {/* Code Crawler — Game */}
        <motion.button
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.17 }}
          onClick={go('/games/crawler')}
          className={`w-full glass-card p-4 rounded-2xl text-left transition-all relative overflow-hidden group ${isGuest ? 'opacity-40 pointer-events-none grayscale' : 'hover:neon-border'}`}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-accent-orange/10 via-transparent to-primary/10 pointer-events-none" />
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-accent-orange/15 flex items-center justify-center border border-accent-orange/30 neon-glow">
                <Gamepad2 className="w-5 h-5 text-accent-orange" />
              </div>
              <div>
                <p className="text-base font-bold font-display text-foreground flex items-center gap-2">
                  Code Crawler <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-accent-orange/15 text-accent-orange border border-accent-orange/30 font-mono">NEW</span>
                </p>
                <p className="text-[10px] text-muted-foreground">Maze runner · fix code at every gate</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-primary" />
          </div>
        </motion.button>

        {/* Frontend Development Box */}
        <motion.button
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
          onClick={go('/learn')}
          data-tour="frontend"
          className={tileCls('/learn')}
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
          <TileFooter path="/learn" desc="HTML → CSS → JS → React → Deploy · 50 lessons" />
        </motion.button>

        {/* Computer & Networking — UNLOCKED */}
        <motion.button
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.25 }}
          onClick={go('/networking?from=dashboard')}
          data-tour="networking"
          className={tileCls('/networking')}
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
          <TileFooter path="/networking" desc="Hardware → OS → Networking → Security · 10 lessons" />
        </motion.button>

        {/* Full Stack Frontend Development — UNLOCKED */}
        <motion.button
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
          onClick={go('/fullstack?from=dashboard')}
          data-tour="fullstack"
          className={tileCls('/fullstack')}
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
          <TileFooter path="/fullstack" desc={`HTML → CSS → JS → React → Deploy · 30 lessons`} />
        </motion.button>

        {/* Freelance & Clients — UNLOCKED */}
        <motion.button
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.35 }}
          onClick={go('/freelance?from=dashboard')}
          data-tour="freelance"
          className={tileCls('/freelance')}
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
          <TileFooter path="/freelance" desc="Niche → Pitch → Price → Deliver · 8 lessons" />
        </motion.button>

        {/* Python Programming — NEW */}
        <motion.button
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}
          onClick={go('/python?from=dashboard')}
          data-tour="python"
          className={tileCls('/python')}
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
          <TileFooter path="/python" desc="Beginner → Advanced → Capstone · 10 lessons" />
        </motion.button>

        {/* Local-Only Coding — NEW */}
        <motion.button
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.45 }}
          onClick={go('/local?from=dashboard')}
          data-tour="local"
          className={tileCls('/local')}
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
          <TileFooter path="/local" desc="No backend, no server, no cost · 15 lessons" />
        </motion.button>

        {/* Full Stack Python Expert — NEW */}
        <motion.button
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}
          onClick={go('/pythonexpert?from=dashboard')}
          data-tour="pythonexpert"
          className={tileCls('/pythonexpert')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-purple-500/15 flex items-center justify-center text-2xl border border-purple-500/30">
                🧙‍♂️
              </div>
              <div>
                <p className="text-base font-bold font-display text-foreground">Full Stack Python Expert</p>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {['Metaclasses','Decorators','FastAPI','Architecture'].map(t => (
                    <span key={t} className="text-[8px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-mono">{t}</span>
                  ))}
                </div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-primary" />
          </div>
          <TileFooter path="/pythonexpert" desc="Advanced Python → Architecture → Expert · 30 lessons" />
        </motion.button>

        {/* Suggestions tile */}
        <motion.button
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}
          onClick={go('/suggestions')}
          className={`w-full glass-card p-4 rounded-2xl text-left transition-all flex items-center gap-3 ${isGuest ? 'opacity-40 pointer-events-none grayscale' : 'hover:neon-border'}`}
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

      {showTour && tourReady && (
        <DashboardTour steps={TOUR_STEPS} onFinish={() => { markTourSeen(); }} />
      )}

      <EnrollDialog
        open={enrollTarget !== null}
        track={enrollTarget}
        onClose={() => setEnrollTarget(null)}
      />
    </div>

  );
};

export default Dashboard;
