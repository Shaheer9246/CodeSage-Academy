import { useNavigate, useSearchParams, Navigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import {
  Code, Zap, ChevronRight, Flame, MessageSquare, Snowflake, X, UserPlus,
  HelpCircle, Gamepad2, Palette, Users, Lock, CheckCircle2, ChevronDown,
  Cpu, Layout, Terminal, Database, Briefcase, Sparkles,
} from 'lucide-react';
import { THEMES, getTheme, applyTheme, type ThemeName } from '@/lib/theme';
import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import DashboardTour, { TourStep } from '@/components/DashboardTour';
import EnrollDialog from '@/components/EnrollDialog';
import { TrackId, isEnrolled, getStudentCount, onEnrollmentChange } from '@/lib/enrollment';
import InboxBadge from '@/components/InboxBadge';
import SuggestionsBadge from '@/components/SuggestionsBadge';

/* ---------- Tour ---------- */
const TOUR_STEPS: TourStep[] = [
  { target: 'frontend',   title: 'Frontend Development', body: 'HTML, CSS, JS from zero.' },
  { target: 'networking', title: 'Computer & Networking', body: 'How machines & the internet work.' },
  { target: 'ai-fundamentals', title: 'AI Fundamentals', body: 'Concepts, LLMs & Agents.' },
  { target: 'fullstack',  title: 'Full Stack Frontend', body: 'React, hooks, deployment.' },
  { target: 'freelance',  title: 'Freelance & Clients', body: 'Turn skills into income.' },
  { target: 'python',     title: 'Python', body: 'Syntax → OOP → capstone.' },
  { target: 'local',      title: 'Local-Only Coding', body: 'DOM, localStorage, PWAs.' },
  { target: 'sql',        title: 'SQL Databases', body: 'Queries, joins, schema design.' },
  { target: 'challenges', title: 'Challenges', body: 'Bite-sized puzzles.' },
  { target: 'playground', title: 'Code Editor', body: 'Real in-browser editor.' },
];

/* ---------- Track catalog ---------- */
type TrackDef = {
  id: string;                   // route id (without slash)
  path: string;                 // dashboard route
  title: string;
  emoji: string;
  tour: string;
  lessons: number;
  accent: string;               // tailwind color token
  tags: string[];
  desc: string;
  trackId?: TrackId;
};

type SectionDef = {
  id: string;
  title: string;
  subtitle: string;
  Icon: React.ComponentType<{ className?: string }>;
  gradient: string;             // for section header accent bar
  tracks: TrackDef[];
};

const SECTIONS: SectionDef[] = [
  {
    id: 'fundamentals',
    title: 'Fundamentals',
    subtitle: 'Start here — how the machine thinks',
    Icon: Cpu,
    gradient: 'from-sky-400/70 via-cyan-400/60 to-blue-500/70',
    tracks: [
      { id: 'networking', path: '/networking?from=dashboard', title: 'Computer & Networking', emoji: '🌐',
        tour: 'networking', lessons: 13, accent: 'accent-blue',
        tags: ['Hardware', 'OS', 'DNS', 'HTTP'], desc: 'Hardware → OS → Networking → Security',
        trackId: 'networking' },
      // Placeholder for future AI Fundamentals
      { 
  id: 'ai-fundamentals', 
  path: '/ai-fundamentals?from=dashboard', 
  title: 'AI Fundamentals', 
  emoji: '🧠',
  tour: 'ai-fundamentals', 
  lessons: 12, // Ensure this matches the number of lessons in your AI_LESSONS array
  accent: 'accent-blue',
  tags: ['Foundations', 'LLMs'], 
  desc: 'Foundations of AI, neural networks, and modern agents' 
},
    ],
  },
  {
    id: 'frontend',
    title: 'Frontend',
    subtitle: 'Everything the user sees & touches',
    Icon: Layout,
    gradient: 'from-fuchsia-400/70 via-pink-500/60 to-rose-500/70',
    tracks: [
      { id: 'frontend', path: '/learn', title: 'Frontend Development', emoji: '📱',
        tour: 'frontend', lessons: 15, accent: 'primary',
        tags: ['HTML', 'CSS', 'JS'], desc: 'HTML → CSS → JS → React → Deploy',
        trackId: 'frontend' },
      { id: 'fullstack', path: '/fullstack?from=dashboard', title: 'Full Stack Frontend Dev', emoji: '🚀',
        tour: 'fullstack', lessons: 30, accent: 'accent-orange',
        tags: ['React', 'Hooks', 'APIs', 'TS'], desc: 'React → APIs → Testing → Deploy',
        trackId: 'fullstack' },
      { id: 'local', path: '/local?from=dashboard', title: 'Local-Only Coding', emoji: '🏠',
        tour: 'local', lessons: 15, accent: 'emerald-400',
        tags: ['DOM', 'localStorage', 'PWA'], desc: 'No backend, no server, no cost',
        trackId: 'local' },
    ],
  },
  {
    id: 'python',
    title: 'Python',
    subtitle: 'Beginner script to production expert',
    Icon: Terminal,
    gradient: 'from-yellow-400/70 via-amber-400/60 to-orange-500/70',
    tracks: [
      { id: 'python', path: '/python?from=dashboard', title: 'Python Programming', emoji: '🐍',
        tour: 'python', lessons: 30, accent: 'yellow-400',
        tags: ['Syntax', 'Functions', 'OOP', 'async'], desc: 'Beginner → Advanced → Capstone',
        trackId: 'python' },
      { id: 'pythonexpert', path: '/pythonexpert?from=dashboard', title: 'Full Stack Python Expert', emoji: '🧙‍♂️',
        tour: 'pythonexpert', lessons: 30, accent: 'purple-500',
        tags: ['Metaclasses', 'Decorators', 'FastAPI'], desc: 'Advanced Python → Architecture',
        trackId: 'pythonexpert' },
    ],
  },
  {
    id: 'backend',
    title: 'Backend & Data',
    subtitle: 'Where the truth lives',
    Icon: Database,
    gradient: 'from-emerald-400/70 via-teal-400/60 to-cyan-500/70',
    tracks: [
      { id: 'sql', path: '/sql?from=dashboard', title: 'SQL Databases', emoji: '🛢️',
        tour: 'sql', lessons: 10, accent: 'emerald-500',
        tags: ['Queries', 'Joins', 'Schemas'], desc: 'Queries → Joins → DB Design',
        trackId: 'sql' as TrackId },
    ],
  },
  {
    id: 'career',
    title: 'Career Launchpad',
    subtitle: 'Turn your code into a paycheck',
    Icon: Briefcase,
    gradient: 'from-yellow-300/70 via-yellow-500/60 to-orange-400/70',
    tracks: [
      { id: 'freelance', path: '/freelance?from=dashboard', title: 'Freelance & Clients', emoji: '💼',
        tour: 'freelance', lessons: 12, accent: 'yellow-500',
        tags: ['Niche', 'Pitch', 'Price', 'Deliver'], desc: 'Find → Pitch → Deliver',
        trackId: 'freelance' },
    ],
  },
];

/* ---------- Section collapse persistence ---------- */
const COLLAPSE_KEY = 'dash.sections.collapsed.v1';
function loadCollapsed(): Record<string, boolean> {
  try { return JSON.parse(localStorage.getItem(COLLAPSE_KEY) || '{}'); }
  catch { return {}; }
}

const Dashboard = () => {
  const { user, loading, updateStreak, applyPromoCode, buyFreezeStreak, markTourSeen } = useUser();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isGuest = searchParams.get('guest') === '1';

  const [promoInput, setPromoInput] = useState('');
  const [promoMsg, setPromoMsg] = useState('');
  const [showShop, setShowShop] = useState(false);
  const [theme, setTheme] = useState<ThemeName>(() => getTheme());
  const [tourReady, setTourReady] = useState(false);
  const [enrollTarget, setEnrollTarget] = useState<TrackId | null>(null);
  const [, setEnrollTick] = useState(0);

  const [collapsed, setCollapsed] = useState<Record<string, boolean>>(loadCollapsed);
  const toggleSection = (id: string) => {
    setCollapsed(prev => {
      const next = { ...prev, [id]: !prev[id] };
      try { localStorage.setItem(COLLAPSE_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const cycleTheme = () => {
    const idx = THEMES.findIndex(t => t.id === theme);
    const next = THEMES[(idx + 1) % THEMES.length].id;
    applyTheme(next); setTheme(next);
    toast.success(`Theme: ${THEMES.find(t => t.id === next)?.label}`);
  };

  useEffect(() => onEnrollmentChange(() => setEnrollTick(t => t + 1)), []);
  useEffect(() => { if (user && !isGuest) updateStreak(); }, [isGuest, user, updateStreak]);

  const showTour = !!user && !isGuest && user.isOnboarded === true && user.hasSeenTour === false;
  useEffect(() => {
    if (!showTour) { setTourReady(false); return; }
    const t = setTimeout(() => setTourReady(true), 600);
    return () => clearTimeout(t);
  }, [showTour]);

  if (loading) return null;
  if (!user && !isGuest) return <Navigate to="/auth" replace />;
  if (user && !user.isOnboarded && !isGuest) return <Navigate to="/onboarding" replace />;

  const handlePromo = async () => {
    const ok = await applyPromoCode(promoInput);
    setPromoMsg(ok ? '✅ Code applied!' : '❌ Invalid code');
    if (ok) setPromoInput('');
    setTimeout(() => setPromoMsg(''), 3000);
  };
  const handleBuyFreeze = async () => {
    if ((user?.xp || 0) < 10) { toast.error('Need 10 XP to buy a Streak Freeze'); return; }
    const ok = await buyFreezeStreak();
    if (ok) { toast.success('❄️ Streak Freeze active'); setShowShop(false); }
    else toast.error('Could not purchase freeze');
  };

  const GUEST_ALLOWED = new Set<string>(['/learn', '/networking', '/fullstack', '/freelance', '/python', '/local', '/sql', '/ai-fundamentals']);
  const GUEST_FIRST_LESSON: Record<string, string> = {
    '/learn': '/lesson/html-1?guest=1',
    '/networking': '/n-lesson/net-1?guest=1',
    '/ai-fundamentals': '/ai-lesson/ai-1?guest=1',
    '/fullstack': '/fs-lesson/fs-1?guest=1',
    '/freelance': '/f-lesson/free-1?guest=1',
    '/python': '/py-lesson/py-01?guest=1',
    '/local': '/local-lesson/local-1?guest=1',
    '/sql': '/sql-lesson/sql-1?guest=1',
  };
  const ROUTE_TO_TRACK: Record<string, TrackId> = {
    '/learn': 'frontend', '/networking': 'networking', '/fullstack': 'fullstack',
    '/freelance': 'freelance', '/python': 'python', '/local': 'local',
    '/sql': 'sql' as TrackId, '/pythonexpert': 'pythonexpert',
    '/ai-fundamentals': 'ai-fundamentals',
  };
  const isTrackLockedForGuest = (path: string) => isGuest && !GUEST_ALLOWED.has(path.split('?')[0]);
  const go = (path: string) => () => {
    const bare = path.split('?')[0];
    if (isGuest) {
      const gp = GUEST_FIRST_LESSON[bare];
      if (gp) return navigate(gp);
      toast.info('Sign up to unlock — 10 seconds ✨');
      return navigate('/auth');
    }
    const track = ROUTE_TO_TRACK[bare];
    if (track && !isEnrolled(track)) { setEnrollTarget(track); return; }
    navigate(path);
  };

  const displayName = user?.name || 'Explorer';
  const xp = user?.xp || 0;
  const streak = user?.streakCount || 0;

  /* Total tracks / enrolled for HUD */
  const allTracks = useMemo(() => SECTIONS.flatMap(s => s.tracks), []);
  const enrolledCount = allTracks.filter(t => t.trackId && isEnrolled(t.trackId)).length;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden grid-bg">
      {/* Ambient orbs */}
      <div className="absolute top-[-15%] right-[-10%] w-[500px] h-[500px] rounded-full bg-primary/5 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-15%] w-[600px] h-[600px] rounded-full bg-accent-blue/5 blur-[180px] pointer-events-none" />

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="relative z-10 max-w-3xl mx-auto p-4 space-y-5"
      >
        {isGuest && (
          <div className="glass-card rounded-2xl border border-primary/40 p-3 flex items-center gap-3 neon-glow">
            <div className="w-9 h-9 rounded-xl bg-primary/20 grid place-items-center shrink-0">
              <UserPlus className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-display font-bold">You're touring as a guest 👋</p>
              <p className="text-[10px] text-muted-foreground">Sign up to save progress and unlock everything.</p>
            </div>
            <button onClick={() => navigate('/auth')}
              className="bg-primary text-primary-foreground text-[11px] font-display font-bold px-3 py-1.5 rounded-xl">
              Sign Up
            </button>
          </div>
        )}

        {/* ============ HERO / HUD ============ */}
        <motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          className="relative glass-card rounded-3xl p-4 sm:p-5 border border-primary/20 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent-blue/10 pointer-events-none" />
          <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

          <div className="relative grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>system_online</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black font-display truncate mt-1">
                {isGuest ? 'Welcome to ' : 'Welcome back, '}
                <span className="text-primary neon-text">{isGuest ? 'CodeSage' : displayName}</span>
              </h1>
              <p className="text-[11px] sm:text-xs text-muted-foreground mt-1">
                {isGuest ? 'Tap any tile for a preview.' : `${enrolledCount} track${enrolledCount === 1 ? '' : 's'} active · keep the streak alive.`}
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5 justify-end shrink-0">
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
                <>
                  <div onClick={() => navigate('/inbox')} className="cursor-pointer active:scale-95 transition-transform">
                    <InboxBadge />
                  </div>
                  <div onClick={() => navigate('/suggestions')} className="cursor-pointer active:scale-95 transition-transform">
                    <SuggestionsBadge />
                  </div>
                  <button onClick={cycleTheme}
                    className="grid place-items-center bg-secondary/40 border border-border/40 px-2.5 py-1.5 rounded-full hover:neon-glow transition-all">
                    <Palette className="w-3.5 h-3.5 text-primary" />
                  </button>
                </>
              )}
            </div>
          </div>
        </motion.div>

        {/* Shop */}
        {showShop && user && (
          <div className="glass-card rounded-2xl p-4 border border-primary/30 neon-glow space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-display font-bold flex items-center gap-2">
                <Snowflake className="w-4 h-4 text-primary" /> XP Shop
              </h3>
              <button onClick={() => setShowShop(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center justify-between gap-3 bg-secondary/30 rounded-xl p-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold">Streak Freeze ❄️</p>
                <p className="text-[10px] text-muted-foreground">Forgive one missed day.</p>
              </div>
              <button onClick={handleBuyFreeze} disabled={(user.xp || 0) < 10}
                className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-2 rounded-xl disabled:opacity-30 hover:neon-glow whitespace-nowrap">
                10 XP
              </button>
            </div>
          </div>
        )}

        {/* ============ QUICK LAUNCH — 3 chips ============ */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          <QuickChip icon={<Zap className="w-4 h-4 text-accent-orange" />} label="Challenges" sub="Test skills"
            color="accent-orange" data-tour="challenges" onClick={go('/challenges')} disabled={isGuest} />
          <QuickChip icon={<Code className="w-4 h-4 text-primary" />} label="Editor" sub="Playground"
            color="primary" data-tour="playground" onClick={go('/playground')} disabled={isGuest} />
          <QuickChip icon={<HelpCircle className="w-4 h-4 text-accent-blue" />} label="Exams" sub="Quiz tests"
            color="accent-blue" onClick={go('/exams')} disabled={isGuest} />
        </div>

        {/* Code Crawler featured */}
        <motion.button
          initial={{ y: 15, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
          onClick={go('/games/crawler')}
          className={`w-full glass-card p-4 rounded-2xl text-left transition-all relative overflow-hidden ${isGuest ? 'opacity-40 pointer-events-none grayscale' : 'hover:neon-border'}`}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-accent-orange/10 via-transparent to-primary/10" />
          <div className="relative grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-12 h-12 rounded-xl bg-accent-orange/15 grid place-items-center border border-accent-orange/30 neon-glow shrink-0">
                <Gamepad2 className="w-5 h-5 text-accent-orange" />
              </div>
              <div className="min-w-0">
                <p className="text-base font-bold font-display flex items-center gap-2 truncate">
                  Code Crawler
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-accent-orange/15 text-accent-orange border border-accent-orange/30 font-mono">NEW</span>
                </p>
                <p className="text-[10px] text-muted-foreground truncate">Maze runner · fix code at every gate</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-primary shrink-0" />
          </div>
        </motion.button>

        {/* ============ SECTIONS ============ */}
        <div className="space-y-3">
          {SECTIONS.map((section, i) => {
            const isCollapsed = !!collapsed[section.id];
            const enrolled = section.tracks.filter(t => t.trackId && isEnrolled(t.trackId)).length;
            return (
              <motion.section
                key={section.id}
                initial={{ y: 15, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.05 * i }}
                className="glass-card rounded-2xl border border-border/50 overflow-hidden"
              >
                {/* Header */}
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 p-3 sm:p-4 text-left hover:bg-secondary/20 transition-colors"
                >
                  <div className="relative w-10 h-10 shrink-0">
                    <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${section.gradient} opacity-30 blur-md`} />
                    <div className={`relative w-10 h-10 rounded-xl bg-gradient-to-br ${section.gradient} grid place-items-center`}>
                      <section.Icon className="w-5 h-5 text-background" />
                    </div>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm sm:text-base font-bold font-display truncate">{section.title}</p>
                      <span className="text-[9px] font-mono text-muted-foreground bg-secondary/50 px-1.5 py-0.5 rounded-full shrink-0">
                        {section.tracks.length}
                      </span>
                      {enrolled > 0 && (
                        <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-1.5 py-0.5 rounded-full shrink-0">
                          {enrolled} active
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] sm:text-[11px] text-muted-foreground truncate">{section.subtitle}</p>
                  </div>
                  <motion.div animate={{ rotate: isCollapsed ? -90 : 0 }} className="shrink-0">
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </motion.div>
                </button>

                {/* Body */}
                <AnimatePresence initial={false}>
                  {!isCollapsed && (
                    <motion.div
                      key="body"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-3 sm:px-4 pb-3 sm:pb-4 space-y-2">
                        {section.tracks.map(track => (
                          <TrackRow
                            key={track.id}
                            track={track}
                            isGuest={isGuest}
                            locked={isTrackLockedForGuest(track.path)}
                            enrolled={!!(track.trackId && !isGuest && isEnrolled(track.trackId))}
                            onClick={go(track.path)}
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.section>
            );
          })}
        </div>

        {/* Suggestions */}
        <motion.button
          initial={{ y: 15, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
          onClick={go('/suggestions')}
          className={`w-full glass-card p-4 rounded-2xl text-left flex items-center gap-3 transition-all ${isGuest ? 'opacity-40 pointer-events-none grayscale' : 'hover:neon-border'}`}
        >
          <div className="w-10 h-10 rounded-xl bg-accent-yellow/15 grid place-items-center shrink-0">
            <MessageSquare className="w-5 h-5 text-accent-yellow" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold font-display">Suggestions & Feedback</p>
            <p className="text-[10px] text-muted-foreground">Tell us what's missing — we read every one.</p>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
        </motion.button>

        {/* Promo */}
        <div className="glass-card p-4 rounded-2xl">
          <h3 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider font-mono">promo_code</h3>
          <div className="flex gap-2">
            <input value={promoInput} onChange={e => setPromoInput(e.target.value)} placeholder="ENTER_CODE"
              className="flex-1 min-w-0 bg-secondary/40 border border-border rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-primary/50 font-mono" />
            <button onClick={handlePromo} className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-xs font-bold font-display hover:neon-glow">
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

/* ============================================================ */
/* Sub components                                               */
/* ============================================================ */

function QuickChip({
  icon, label, sub, color, onClick, disabled, ...rest
}: {
  icon: React.ReactNode; label: string; sub: string; color: string;
  onClick: () => void; disabled?: boolean;
} & Record<string, unknown>) {
  return (
    <button
      {...rest}
      onClick={onClick}
      className={`glass-card p-3 rounded-2xl text-left transition-all ${disabled ? 'opacity-40 pointer-events-none grayscale' : 'hover:neon-border'}`}
    >
      <div className={`w-9 h-9 rounded-xl bg-${color}/15 grid place-items-center mb-2`}>{icon}</div>
      <p className="text-[11px] font-bold font-display leading-tight">{label}</p>
      <p className="text-[9px] text-muted-foreground mt-0.5">{sub}</p>
    </button>
  );
}

function TrackRow({
  track, isGuest, locked, enrolled, onClick,
}: {
  track: TrackDef; isGuest: boolean; locked: boolean; enrolled: boolean; onClick: () => void;
}) {
  const count = track.trackId ? getStudentCount(track.trackId) : 0;
  const disabled = locked;

  return (
    <motion.button
      whileHover={{ x: 2 }}
      onClick={onClick}
      data-tour={track.tour}
      className={[
        'group relative w-full text-left rounded-xl p-3 border border-border/50 bg-secondary/20 transition-all overflow-hidden',
        disabled ? 'opacity-40 pointer-events-none grayscale' : 'hover:border-primary/40 hover:bg-secondary/40',
        enrolled ? 'ring-1 ring-primary/40 neon-border' : '',
      ].join(' ')}
    >
      {/* left accent bar */}
      <div className={`absolute left-0 top-0 bottom-0 w-0.5 bg-${track.accent} opacity-60 group-hover:opacity-100 transition-opacity`} />

      <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
        <div className={`w-11 h-11 rounded-xl bg-${track.accent}/15 grid place-items-center text-xl border border-${track.accent}/30 shrink-0`}>
          {track.emoji}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-bold font-display truncate">{track.title}</p>
            {enrolled && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
          </div>
          <div className="flex flex-wrap items-center gap-1 mt-1">
            {track.tags.slice(0, 3).map(t => (
              <span key={t} className="text-[8px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-mono">{t}</span>
            ))}
            {track.lessons > 0 && (
              <span className="text-[9px] font-mono text-muted-foreground ml-1">· {track.lessons} lessons</span>
            )}
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
      </div>

      <div className="flex items-center justify-between mt-2 gap-2 pl-14">
        <p className="text-[10px] text-muted-foreground truncate">{track.desc}</p>
        <div className="flex items-center gap-1 shrink-0">
          {track.trackId && (
            <span className="flex items-center gap-1 text-[9px] text-muted-foreground font-mono">
              <Users className="w-3 h-3" /> {count.toLocaleString()}
            </span>
          )}
          {locked && (
            <span className="flex items-center gap-1 text-[9px] text-primary bg-primary/10 border border-primary/30 rounded-full px-1.5 py-0.5 font-mono">
              <Lock className="w-2.5 h-2.5" /> Sign up
            </span>
          )}
          {enrolled && (
            <span className="text-[9px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 rounded-full px-1.5 py-0.5 font-mono">
              Enrolled
            </span>
          )}
        </div>
      </div>

      {/* subtle scanline sparkle on hover */}
      {!disabled && (
        <Sparkles className="absolute top-2 right-8 w-3 h-3 text-primary/0 group-hover:text-primary/60 transition-colors" />
      )}
    </motion.button>
  );
}
