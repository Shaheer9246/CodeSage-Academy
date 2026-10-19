import { useNavigate, useSearchParams, Navigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { supabase } from '@/integrations/supabase/client';
import { StreakModal } from '@/components/StreakModal';
import { Code, Zap, ChevronRight, Flame, MessageSquare, UserPlus, HelpCircle,
        Gamepad2, Trophy, Users, Lock, CheckCircle2, ChevronDown, Cpu, Coins, X,
        Layout, Terminal, Database, Briefcase, Sparkles, Code2, Bot } from 'lucide-react';
import { energyToday } from '@/lib/gamification';

import { THEMES, getTheme, applyTheme, type ThemeName } from '@/lib/theme';
import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import DashboardTour, { TourStep } from '@/components/DashboardTour';
import EnrollDialog from '@/components/EnrollDialog';
import { TrackId, isEnrolled, isActive, getStudentCount, onEnrollmentChange } from '@/lib/enrollment';
import SuggestionsBadge from '@/components/SuggestionsBadge';
import InboxBadge from '@/components/InboxBadge';
import { AdBannerCard } from '@/components/AdBannerCard';
import { completedCountFor, lessonCountFor, getNextLessonForTrack, getLessonDetails, isTrackCompleted, type LessonTrackKey } from '@/data/lessonIndex';
import DailyProblemCard from '@/components/DailyProblemCard';
import ShareAchievementModal, { ShareAchievementType } from '@/components/ShareAchievementModal';
import StreakReminderToggle from '@/components/StreakReminderToggle';
import { checkAndTriggerStreakReminder } from '@/lib/streakNotifications';

/* ---------- Tour ---------- */
const TOUR_STEPS: TourStep[] = [
  { target: 'frontend',   title: 'Modern Frontend Engineering', body: 'HTML, CSS, JS from zero to React architecture and production UI.' },
  { target: 'networking', title: 'Computer Systems & Network Architecture', body: 'How machines, operating systems, and network protocols work.' },
  { target: 'ai-fundamentals', title: 'Foundations of AI & Neural Models', body: 'Machine Learning concepts, Transformer LLMs, and autonomous agents.' },
  { target: 'fullstack',  title: 'Full-Stack Application Architecture', body: 'React, custom hooks, API integration, and live production deployment.' },
  { target: 'freelance',  title: 'Software Consultancy & Client Acquisition', body: 'Turn technical engineering skills into high-ticket contracts.' },
  { target: 'real-freelance', title: 'Commercial Engineering Practice', body: 'Proposals, Upwork strategy, retainers, and agency scaling.' },
  { target: 'python',     title: 'Python Software Engineering', body: 'Syntax, data structures, OOP architecture, and capstone systems.' },
  { target: 'java',       title: 'Enterprise Java & Object Architecture', body: 'Core Java, OOP patterns, Collections framework, and backend APIs.' },
  { target: 'c',          title: 'Systems Programming in C', body: 'Procedural programming, pointer arithmetic, and low-level memory layout.' },
  { target: 'cpp',        title: 'Modern C++ Engineering & RAII', body: 'Compilers, RAII memory management, STL algorithms, and high performance.' },
  { target: 'sql',        title: 'Relational Database Engineering & SQL', body: 'Relational design, indexing, complex joins, and query optimization.' },
  { target: 'challenges', title: 'Algorithmic Challenges', body: 'Bite-sized puzzles to test engineering speed and logic.' },
  { target: 'playground', title: 'Interactive Code Editor', body: 'Multi-file web and script sandbox with instant execution.' },
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
      { id: 'networking', path: '/networking?from=dashboard', title: 'Computer Systems & Network Architecture', emoji: '🌐',
        tour: 'networking', lessons: 13, accent: 'accent-blue',
        tags: ['Hardware', 'OS', 'DNS', 'HTTP'], desc: 'Hardware → OS → Networking → Security Architecture',
        trackId: 'networking' },
    ],
  },
  {
    id: 'frontend',
    title: 'Frontend',
    subtitle: 'Everything the user sees & touches',
    Icon: Layout,
    gradient: 'from-fuchsia-400/70 via-pink-500/60 to-rose-500/70',
    tracks: [
      { id: 'frontend', path: '/learn?from=dashboard', title: 'Modern Frontend Engineering', emoji: '📱',
        tour: 'frontend', lessons: 52, accent: 'primary',
        tags: ['HTML', 'CSS', 'JS'], desc: 'HTML → CSS → JS → React → Production UI',
        trackId: 'frontend' },
      
      { id: 'fullstack', path: '/fullstack?from=dashboard', title: 'Full-Stack Application Architecture', emoji: '🚀',
        tour: 'fullstack', lessons: 28, accent: 'accent-orange',
        tags: ['React', 'Hooks', 'APIs', 'TS'], desc: 'React → APIs → Testing → Live Production Deploy',
        trackId: 'fullstack' },
      
      { id: 'local', path: '/local?from=dashboard', title: 'Offline-First Software Engineering', emoji: '🏠',
        tour: 'local', lessons: 15, accent: 'emerald-400',
        tags: ['DOM', 'localStorage', 'PWA'], desc: 'Client Runtimes → IndexedDB → Resilient PWAs',
        trackId: 'local' },

      { id: 'three3d', path: '/three3d?from=dashboard', title: 'Interactive 3D Graphics & WebGL', emoji: '🧊',
        tour: 'three3d', lessons: 16, accent: 'accent-blue',
        tags: ['Three.js', 'WebGL', 'R3F'], desc: 'Three.js → Shaders → Spatial Web Experiences',
        trackId: 'three3d' as TrackId },
      
    ],
  },

  {
    id: 'ai',
    title: 'Artificial Intelligence',
    subtitle: 'From core fundamentals to advanced fine-tuning & agents',
    Icon: Sparkles,
    gradient: 'from-purple-500/70 via-indigo-500/60 to-blue-500/70',
    tracks: [
      { 
        id: 'ai-fundamentals', 
        path: '/ai-fundamentals?from=dashboard', 
        title: 'Foundations of AI & Neural Models', 
        emoji: '🧠',
        tour: 'ai-fundamentals', 
        lessons: 12,
        accent: 'accent-blue',
        tags: ['Foundations', 'LLMs', 'Agents'], 
        desc: 'Machine Learning → Transformers → Autonomous Agents', 
        trackId: 'ai-fundamentals'
      },
      { 
        id: 'intermediate-ai', 
        path: '/intermediate-ai?from=dashboard', 
        title: 'Applied Generative AI & Fine-Tuning', 
        emoji: '🤖',
        tour: 'intermediate-ai', 
        lessons: 8,
        accent: 'primary',
        tags: ['PEFT', 'LoRA', 'RAG', 'Fine-Tuning'], 
        desc: 'PEFT → LoRA → Vector Databases → Production RAG', 
        trackId: 'intermediate-ai' as TrackId
      },
    ],
  },

  {
    id: 'java',
    title: 'Java',
    subtitle: 'Enterprise & backend power',
    Icon: Terminal,
    gradient: 'from-orange-500/70 via-red-500/60 to-amber-500/70',
    tracks: [
      { id: 'java', path: '/java?from=dashboard', title: 'Enterprise Java & Object Architecture', emoji: '☕',
        tour: 'java', lessons: 30, accent: 'orange-500',
        tags: ['Core Java', 'OOP', 'Spring Boot'], desc: 'Core Java → OOP Design → Enterprise APIs',
        trackId: 'java' as TrackId },
      { id: 'javaexpert', path: '/java-expert?from=dashboard', title: 'Advanced Java Systems & JVM Internals', emoji: '🧙‍♂️',
        tour: 'javaexpert', lessons: 30, accent: 'orange-500',
        tags: ['JVM', 'Multithreading', 'Performance'], desc: 'JVM Internals → Concurrency → Memory Architecture',
        trackId: 'javaexpert' as TrackId },  
    ],
  },
       
  {
    id: 'c',
    title: 'C Programming',
    subtitle: 'Procedural logic, pointers & memory management',
    Icon: Cpu,
    gradient: 'from-blue-600/70 via-indigo-500/60 to-cyan-500/70',
    tracks: [
      { id: 'c', path: '/c?from=dashboard', title: 'Systems Programming in C', emoji: '⚡',
        tour: 'c', lessons: 30, accent: 'accent-blue',
        tags: ['Pointers', 'Memory', 'Structs', 'CLI'], desc: 'Memory Layout → Pointers → Low-Level Systems',
        trackId: 'c' as TrackId },
    { id: 'cexpert', path: '/c-expert?from=dashboard', title: 'Advanced Low-Level Systems & Memory', emoji: '🧙‍♂️',
        tour: 'cexpert', lessons: 30, accent: 'accent-blue',
        tags: ['Advanced Memory', 'Data Structures', 'Performance'], desc: 'Custom Allocators → Cache Optimization → OS Primitives',
        trackId: 'cx' as TrackId },
    ],
  },
  
  {
    id: 'cpp',
    title: 'C++',
    subtitle: 'Memory, pointers & raw performance',
    Icon: Cpu,
    gradient: 'from-blue-500/70 via-sky-500/60 to-indigo-500/70',
    tracks: [
      { id: 'cpp', path: '/cpp?from=dashboard', title: 'Modern C++ Engineering & RAII', emoji: '⚙️',
        tour: 'cpp', lessons: 30, accent: 'accent-blue',
        tags: ['Compilers', 'Pointers', 'STL', 'RAII'], desc: 'RAII → Memory Models → STL → High Performance',
        trackId: 'cpp' as TrackId },
      { id: 'cppexpert', path: '/cpp/expert?from=dashboard', title: 'High-Performance C++ & Metaprogramming', emoji: '🚀',
        tour: 'cppexpert', lessons: 30, accent: 'accent-blue',
        tags: ['Templates', 'Concurrency', 'Atomics', 'Performance'], desc: 'Template Metaprogramming → Lock-Free Atomics → Concurrency',
        trackId: 'cppexpert' as TrackId },
    ],
  },
  {
    id: 'python',
    title: 'Python',
    subtitle: 'Beginner script to production expert',
    Icon: Terminal,
    gradient: 'from-yellow-400/70 via-amber-400/60 to-orange-500/70',
    tracks: [
      { id: 'python', path: '/python?from=dashboard', title: 'Python Software Engineering', emoji: '🐍',
        tour: 'python', lessons: 32, accent: 'yellow-400',
        tags: ['Syntax', 'Functions', 'OOP', 'async'], desc: 'Algorithmic Logic → Data Structures → Modular Architecture',
        trackId: 'python' },
      { id: 'pythonexpert', path: '/pythonexpert?from=dashboard', title: 'Advanced Python: Metaprogramming & AsyncIO', emoji: '🧙‍♂️',
        tour: 'pythonexpert', lessons: 30, accent: 'purple-500',
        tags: ['Metaclasses', 'Decorators', 'FastAPI'], desc: 'Metaclasses → AsyncIO Event Loops → High-Performance APIs',
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
      { id: 'sql', path: '/sql?from=dashboard', title: 'Relational Database Engineering & SQL', emoji: '🛢️',
        tour: 'sql', lessons: 18, accent: 'emerald-500',
        tags: ['Queries', 'Joins', 'Schemas'], desc: 'Relational Algebra → Indexing → Query Optimization',
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
      { id: 'freelance', path: '/freelance?from=dashboard', title: 'Software Consultancy & Client Acquisition', emoji: '💼',
        tour: 'freelance', lessons: 12, accent: 'yellow-500',
        tags: ['Niche', 'Pitch', 'Price', 'Deliver'], desc: 'Value Scoping → Contract Structure → Delivery Workflows',
        trackId: 'freelance' },

      { id: 'real-freelance', path: '/real-freelance?from=dashboard', title: 'Commercial Engineering Practice', emoji: '🎓',
        tour: 'real-freelance', lessons: 12, accent: 'primary',
        tags: ['Upwork', 'Proposals', 'Scaling'], desc: 'High-Ticket Retainers → Agency Infrastructure → Enterprise Delivery',
        trackId: 'real-freelance' as TrackId },
    ],
  },
];

/* ---------- Section collapse persistence ---------- */
const COLLAPSE_KEY = 'dash.sections.collapsed.v2';
function loadCollapsed(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(COLLAPSE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return Object.fromEntries(SECTIONS.map(s => [s.id, false]));
}

const Dashboard = () => {
  const { user, loading, updateStreak, applyPromoCode, markTourSeen, updateUser } = useUser();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isGuest = searchParams.get('guest') === '1';

  const [promoInput, setPromoInput] = useState('');
  const [promoMsg, setPromoMsg] = useState('');
  const [showXpModal, setShowXpModal] = useState(false);
  const [showGuideDetails, setShowGuideDetails] = useState(false);
  const [showCoinMenu, setShowCoinMenu] = useState(false);

  const [tourReady, setTourReady] = useState(false);
  const [enrollTarget, setEnrollTarget] = useState<TrackId | null>(null);
  const [enrollTick, setEnrollTick] = useState(0);

  type DashboardCategory = 'All' | 'frontend' | 'python' | 'java' | 'c' | 'cpp' | 'ai' | 'sql' | 'fundamentals' | 'career';
  
  const [selectedCategory, setSelectedCategory] = useState<DashboardCategory>(() => {
    return (localStorage.getItem('codesage_dashboard_category') as DashboardCategory) || 'All';
  });

  const [lastSelectedIndex, setLastSelectedIndex] = useState<number>(0);
  const [glowDirection, setGlowDirection] = useState<'ltr' | 'rtl'>('ltr');

  useEffect(() => {
    localStorage.setItem('codesage_dashboard_category', selectedCategory);
  }, [selectedCategory]);

  const [collapsed, setCollapsed] = useState<Record<string, boolean>>(loadCollapsed);
  
  const toggleSection = (id: string) => {
    setCollapsed(prev => {
      const next = { ...prev, [id]: !prev[id] };
      try { localStorage.setItem(COLLAPSE_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  };

  useEffect(() => onEnrollmentChange(() => setEnrollTick(t => t + 1)), []);
  useEffect(() => { if (user?.id && !isGuest) updateStreak(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [isGuest, user?.id]);

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
  
  const GUEST_ALLOWED = new Set<string>([
    '/learn',
    '/networking',
    '/python',
    '/freelance',
    '/sql',
    '/java',
  ]);
  
  const GUEST_FIRST_LESSON: Record<string, string> = {
    '/learn': '/lesson/html-1?guest=1',
    '/networking': '/n-lesson/net-1?guest=1',
    '/freelance': '/f-lesson/free-1?guest=1',
    '/python': '/py-lesson/py-01?guest=1',
    '/sql': '/sql-lesson/sql-01?guest=1',
    '/java': '/java-lesson/java-01?guest=1',
  };
  
  const ROUTE_TO_TRACK: Record<string, TrackId> = {
    '/learn': 'frontend', '/networking': 'networking', '/fullstack': 'fullstack',
    '/freelance': 'freelance', '/real-freelance': 'real-freelance' as TrackId, '/python': 'python', '/local': 'local',
    '/sql': 'sql' as TrackId, '/pythonexpert': 'pythonexpert',
    '/ai-fundamentals': 'ai-fundamentals',
    '/intermediate-ai': 'intermediate-ai' as TrackId,
    '/three3d': 'three3d' as TrackId,
    '/java': 'java' as TrackId,
    '/java-expert': 'javaexpert' as TrackId,
    '/c': 'c' as TrackId,
    '/c-expert': 'cx' as TrackId,
    '/cpp': 'cpp' as TrackId,
    '/cpp/expert': 'cppexpert' as TrackId,
  };
  
  const isTrackLockedForGuest = (path: string) => isGuest && !GUEST_ALLOWED.has(path.split('?')[0]);
  
  const go = (path: string) => () => {
    const bare = path.split('?')[0];
    if (isGuest) {
      if (GUEST_ALLOWED.has(bare)) {
        const gp = GUEST_FIRST_LESSON[bare];
        if (gp) return navigate(gp);
      }
      toast.info('Sign up to unlock — 10 seconds ✨');
      return navigate('/auth');
    }
    const track = ROUTE_TO_TRACK[bare];
    if (track && !isEnrolled(track)) { setEnrollTarget(track); return; }
    navigate(path);
  };

  const handleCategorySelect = (category: DashboardCategory, index: number) => {
    if (index < lastSelectedIndex) {
      setGlowDirection('rtl');
    } else {
      setGlowDirection('ltr');
    }
    setLastSelectedIndex(index);
    setSelectedCategory(category);
  };

  const displayName = user?.name || 'Explorer';
  const xp = user?.xp || 0;
  const sageCoins = user?.sageCoins ?? 0;
  const streak = user?.streakCount ?? 0;

  const handleBuyXp = async () => {
    const { data, error } = await supabase.rpc('buy_daily_xp');
    const row = (Array.isArray(data) ? data[0] : data) as
      | { sage_coins?: number; daily_xp?: number; daily_xp_date?: string | null } | null;
    if (error || !row) {
      toast.error(error?.message?.includes('5 Sage Coins') ? 'Need 5 Sage Coins to buy XP' : (error?.message || 'Purchase failed'));
      return;
    }
    updateUser({ sageCoins: row.sage_coins || 0, dailyXp: Number(row.daily_xp ?? 10), dailyXpDate: row.daily_xp_date || null });
    toast.success('⚡ +3.3 XP added — one more lesson unlocked!');
    setShowCoinMenu(false);
  };

  const handleBuyFreeze = async () => {
    const { data, error } = await supabase.rpc('buy_streak_freeze');
    const row = (Array.isArray(data) ? data[0] : data) as
      | { sage_coins?: number; streak_freeze_until?: string | null } | null;
    if (error || !row) {
      toast.error(error?.message?.includes('5 Sage Coins') ? 'Need 5 Sage Coins for a Streak Freeze' : (error?.message || 'Purchase failed'));
      return;
    }
    updateUser({ sageCoins: row.sage_coins || 0, streakFreezeUntil: row.streak_freeze_until || null });
    toast.success('❄️ Streak Freeze purchased — tomorrow is protected!');
    setShowCoinMenu(false);
  };

  const allTracks = useMemo(() => SECTIONS.flatMap(s => s.tracks), []);
  const enrolledCount = allTracks.filter(t => t.trackId && !isGuest && (isActive(t.trackId) || isEnrolled(t.trackId))).length;

  const myTracks = useMemo(
    () => allTracks
      .filter(t => t.trackId && !isGuest && (isActive(t.trackId) || isEnrolled(t.trackId)))
      .map(t => {
        const key = t.trackId as unknown as LessonTrackKey;
        const total = lessonCountFor(key) || t.lessons || 0;
        const done = completedCountFor(key, user?.completedLessons || []);
        return { track: t, done, total, pct: total ? Math.round((done / total) * 100) : 0 };
      }),
    [allTracks, isGuest, user?.completedLessons, enrollTick],
  );

  const activeContinueTrack = useMemo(() => {
    if (myTracks.length === 0) return null;

    // Check if user's last active track matches one of their active enrolled courses
    const lastStored = localStorage.getItem('codesage_last_active_track');
    if (lastStored) {
      const match = myTracks.find(m => m.track.trackId === lastStored);
      if (match) return match.track;
    }

    // Default to the first enrolled course
    return myTracks[0].track;
  }, [myTracks]);

  const continueLessonInfo = useMemo(() => {
    if (!activeContinueTrack || !activeContinueTrack.trackId || isGuest) return null;
    const trackKey = activeContinueTrack.trackId as unknown as LessonTrackKey;
    const nextLesson = getNextLessonForTrack(trackKey, user?.completedLessons || []);
    const total = lessonCountFor(trackKey) || activeContinueTrack.lessons || 0;
    const done = completedCountFor(trackKey, user?.completedLessons || []);
    const pct = total > 0 ? Math.round((done / total) * 100) : 0;

    return {
      track: activeContinueTrack,
      nextLesson,
      done,
      total,
      pct,
    };
  }, [activeContinueTrack, isGuest, user?.completedLessons]);

  const energy = user ? energyToday(user.dailyXp, user.dailyXpDate) : 0;

  const todayLessons = useMemo(() => {
    if (!user) return 0;
    const spent = Math.max(0, 10 - energy);
    return Math.floor(spent / 3.3); 
  }, [user, energy]);

  const [shareModalConfig, setShareModalConfig] = useState<{
    isOpen: boolean;
    title?: string;
    topic?: string;
    achievementType?: ShareAchievementType;
    customMessage?: string;
  }>({ isOpen: false });

  // Evaluate browser PWA streak reminder notification (alerts at 6 PM if no lesson completed today)
  useEffect(() => {
    if (isGuest || !user) return;
    const hasActivity = todayLessons > 0 || energy < 10;
    checkAndTriggerStreakReminder(hasActivity);
  }, [todayLessons, energy, isGuest, user]);

  const filterOptions = [
    { id: 'All', label: 'All Courses', icon: Layout },
    { id: 'frontend', label: 'Frontend', icon: Layout },
    { id: 'python', label: 'Python', icon: Terminal },
    { id: 'java', label: 'Java', icon: Terminal },
    { id: 'c', label: 'C Language', icon: Cpu },
    { id: 'cpp', label: 'C++', icon: Cpu },
    { id: 'sql', label: 'SQL & Backend', icon: Database },
    { id: 'ai', label: 'AI', icon: Sparkles },
    { id: 'fundamentals', label: 'Fundamentals', icon: Cpu },
    { id: 'career', label: 'Career', icon: Briefcase },
  ];

  const visibleSections = useMemo(() => {
    return SECTIONS.filter(section => {
      if (selectedCategory === 'All') return true;
      if (selectedCategory === 'sql') return section.id === 'backend';
      return section.id === selectedCategory;
    });
  }, [selectedCategory]);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden grid-bg">
      {user && !showTour && <StreakModal streakCount={streak} />}

      <div className="absolute top-[-15%] right-[-10%] w-[500px] h-[500px] rounded-full bg-primary/5 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-15%] w-[600px] h-[600px] rounded-full bg-accent-blue/5 blur-[180px] pointer-events-none" />

      <div className="relative z-10 flex">
        {/* Secondary Left Sidebar - Desktop Only */}
        <div className="hidden lg:block w-64 shrink-0 p-4 space-y-4 border-r border-border/30">
          
          {/* Your Active Tracks - Compressed to 3 items with scroll if more */}
          {!isGuest && myTracks.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2 pl-1">
                <p className="text-[10px] font-display font-bold uppercase tracking-wider text-muted-foreground">Your Tracks</p>
                {myTracks.length > 3 && (
                  <span className="text-[9px] font-mono text-muted-foreground/70">
                    Scroll for more ({myTracks.length})
                  </span>
                )}
              </div>
              <div className="space-y-1.5 max-h-[196px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-border/40 hover:scrollbar-thumb-border">
                {myTracks.map(({ track, done, total, pct }) => {
                  const isDone = total > 0 && done >= total;
                  return (
                    <button 
                      key={track.id} 
                      onClick={go(track.path)}
                      className="w-full text-left rounded-lg p-2 bg-secondary/20 border border-border/40 hover:border-primary/40 transition-all group"
                    >
                      <div className="flex items-center justify-between gap-1.5">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="text-base shrink-0">{track.emoji}</span>
                          <p className="text-[10px] font-display font-semibold truncate">{track.title}</p>
                        </div>
                        {isDone && (
                          <span className="text-[8px] font-mono font-semibold text-amber-400 bg-amber-500/15 border border-amber-500/30 px-1 py-0.5 rounded-full shrink-0">
                            Done
                          </span>
                        )}
                      </div>
                      <div className="mt-1.5 h-1 rounded-full bg-secondary overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-primary to-accent-blue transition-all" style={{ width: `${pct}%` }} />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Category Filters - Desktop - Compressed to 3 visible items with scroll */}
          <div>
            <div className="flex items-center justify-between mb-2 pl-1">
              <p className="text-[10px] font-display font-bold uppercase tracking-wider text-muted-foreground">Categories</p>
              <span className="text-[9px] font-mono text-muted-foreground/70">Scroll for more ({filterOptions.length})</span>
            </div>
            <div className="space-y-1 max-h-[148px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-border/40 hover:scrollbar-thumb-border">
              {filterOptions.map((option, index) => {
                const Icon = option.icon;
                const isSelected = selectedCategory === option.id;
                
                return (
                  <button
                    key={option.id}
                    onClick={() => handleCategorySelect(option.id as DashboardCategory, index)}
                    className={`relative w-full text-left rounded-lg p-2.5 transition-all duration-300 group overflow-hidden ${
                      isSelected 
                        ? 'bg-primary/10' 
                        : 'hover:bg-secondary/30'
                    }`}
                  >
                    {/* Sweeping Glow Effect */}
                    <AnimatePresence mode="wait">
                      {isSelected && (
                        <motion.div
                          key={`glow-${glowDirection}`}
                          initial={{ 
                            x: glowDirection === 'ltr' ? '-100%' : '100%',
                            opacity: 0 
                          }}
                          animate={{ 
                            x: '0%',
                            opacity: 0.6 
                          }}
                          exit={{ 
                            opacity: 0,
                            x: glowDirection === 'ltr' ? '100%' : '-100%'
                          }}
                          transition={{ 
                            duration: 0.5,
                            ease: [0.4, 0, 0.2, 1]
                          }}
                          className="absolute inset-0 bg-gradient-to-r from-primary/40 via-primary/20 to-transparent"
                        />
                      )}
                    </AnimatePresence>

                    {/* Active glow border */}
                    {isSelected && (
                      <motion.div
                        initial={false}
                        animate={{ 
                          boxShadow: '0 0 20px rgba(var(--primary), 0.4), inset 0 0 20px rgba(var(--primary), 0.1)'
                        }}
                        className="absolute inset-0 rounded-lg border border-primary/50"
                      />
                    )}

                    {/* Content */}
                    <div className="relative flex items-center gap-2.5">
                      {/* Glowing circle indicator */}
                      <div className={`relative w-2 h-2 rounded-full transition-all duration-300 ${
                        isSelected 
                          ? 'bg-primary shadow-[0_0_12px_rgba(var(--primary),1)]' 
                          : 'bg-muted-foreground/30 group-hover:bg-muted-foreground/60'
                      }`} />
                      
                      <Icon className={`w-3.5 h-3.5 transition-all duration-300 ${
                        isSelected ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
                      }`} />
                      
                      <span className={`text-xs font-semibold transition-all duration-300 ${
                        isSelected ? 'text-primary font-bold' : 'text-muted-foreground group-hover:text-foreground'
                      }`}>
                        {option.label}
                      </span>

                      {isSelected && (
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 }}
                          className="ml-auto"
                        >
                          <ChevronRight className="w-4 h-4 text-primary" />
                        </motion.div>
                      )}
                    </div>

                    {/* Subtle scanline for selected */}
                    {isSelected && (
                      <motion.div
                        initial={{ top: '0%' }}
                        animate={{ top: '100%' }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                        className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>


          {/* Suggestions & Game - Desktop */}
          <div className="space-y-2 pt-2">
            <button
              onClick={go('/suggestions')}
              className={`w-full text-left rounded-lg p-3 transition-all border ${
                isGuest 
                  ? 'opacity-40 pointer-events-none grayscale border-border/20' 
                  : 'bg-secondary/20 border-border/40 hover:border-accent-yellow/40 hover:bg-secondary/40'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-accent-yellow/60" />
                <MessageSquare className="w-4 h-4 text-accent-yellow" />
                <span className="text-xs font-semibold text-foreground">Suggestions</span>
              </div>
            </button>

            <button
              onClick={go('/dsa-sheet')}
              className={`w-full text-left rounded-lg p-3 transition-all border ${
                isGuest 
                  ? 'opacity-40 pointer-events-none grayscale border-border/20' 
                  : 'bg-primary/10 border-primary/30 hover:border-primary/50 hover:bg-primary/20'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <Code2 className="w-4 h-4 text-primary" />
                <div className="flex items-center justify-between flex-1">
                  <span className="text-xs font-semibold text-foreground">DSA Sheet</span>
                  <span className="text-[9px] bg-primary/20 text-primary px-1.5 py-0.5 rounded font-mono font-bold">TOP 75</span>
                </div>
              </div>
            </button>

            <button
              onClick={go('/games/crawler')}
              className={`w-full text-left rounded-lg p-3 transition-all border ${
                isGuest 
                  ? 'opacity-40 pointer-events-none grayscale border-border/20' 
                  : 'bg-secondary/20 border-border/40 hover:border-accent-orange/40 hover:bg-secondary/40'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-accent-orange/60" />
                <Gamepad2 className="w-4 h-4 text-accent-orange" />
                <span className="text-xs font-semibold text-foreground">Code Crawler</span>
              </div>
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }}
          className="flex-1 px-4 sm:px-6 py-4 space-y-4 sm:space-y-5 overflow-x-hidden"
        >
          {isGuest && (
            <div className="glass-card rounded-2xl border border-primary/40 p-3 flex items-center gap-3 neon-glow">
              <div className="w-9 h-9 rounded-xl bg-primary/20 grid place-items-center shrink-0">
                <UserPlus className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-display font-bold">You're touring as a guest </p>
                <p className="text-[10px] text-muted-foreground">Sign up to save progress and unlock everything.</p>
              </div>
              <button onClick={() => navigate('/auth')}
                className="bg-primary text-primary-foreground text-[11px] font-display font-bold px-3 py-1.5 rounded-xl">
                Sign Up
              </button>
            </div>
          )}

          {/* HERO / HUD */}
          <motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            className="relative z-20 glass-card rounded-3xl p-4 sm:p-5 border border-primary/20"
          >
            <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent-blue/10" />
              <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-primary/10 blur-3xl" />
            </div>

            <div className="relative flex flex-col sm:grid sm:grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
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
              
              <div className="flex flex-wrap gap-1.5 justify-start sm:justify-end shrink-0 w-full sm:w-auto mt-1 sm:mt-0">
                <button onClick={() => isGuest ? navigate('/auth') : setShowXpModal(true)}
                  className="flex items-center gap-1 bg-primary/10 border border-primary/30 px-2.5 py-1.5 rounded-full hover:neon-glow transition-all cursor-pointer">
                  <Zap className="w-3.5 h-3.5 text-primary" />
                  <span className="text-xs font-bold text-primary">{energy} / 10 XP</span>
                </button>
                <div className="relative">
                  <button
                    onClick={() => {
                      if (isGuest) {
                        navigate('/auth');
                      } else {
                        setShowCoinMenu(v => !v);
                      }
                    }}
                    className="flex items-center gap-1 bg-yellow-500/10 border border-yellow-500/30 px-2.5 py-1.5 rounded-full hover:border-yellow-500/60 transition-all cursor-pointer"
                    title="Sage Coins — Buy XP or Streak Freeze"
                  >
                    <Coins className="w-3.5 h-3.5 text-yellow-400" />
                    <span className="text-xs font-bold text-yellow-400">{sageCoins}</span>
                  </button>
                  {showCoinMenu && !isGuest && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowCoinMenu(false)} />
                      <div className="absolute right-0 top-full mt-2 w-60 z-50 rounded-xl border border-border bg-popover p-2 shadow-xl space-y-1">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-2 pt-1 pb-1.5">Coin Shop</p>
                        <button
                          onClick={handleBuyXp}
                          className="w-full flex items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-semibold text-foreground hover:bg-secondary/60 transition-colors"
                        >
                          <Zap className="w-4 h-4 text-primary shrink-0" />
                          <span>Buy XP Refill <span className="text-muted-foreground">(+3.3 XP)</span></span>
                          <span className="ml-auto text-[10px] font-bold text-yellow-400 shrink-0">5 🪙</span>
                        </button>
                        <button
                          onClick={handleBuyFreeze}
                          className="w-full flex items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-semibold text-foreground hover:bg-secondary/60 transition-colors"
                        >
                          <Flame className="w-4 h-4 text-orange-400 shrink-0" />
                          <span>Buy Streak Freeze</span>
                          <span className="ml-auto text-[10px] font-bold text-yellow-400 shrink-0">5 🪙</span>
                        </button>
                        <p className="text-[10px] text-muted-foreground px-2 pt-1 pb-0.5">Coins are earned 100% free by completing lessons & challenges.</p>
                      </div>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-1 bg-orange-500/10 border border-orange-500/30 px-2.5 py-1.5 rounded-full">
                  <Flame className="w-3.5 h-3.5 text-orange-400" />
                  <span className="text-xs font-bold text-orange-400">{streak}d</span>
                </div>
                {!isGuest && (
                  <>
                    <StreakReminderToggle compact />
                    <div className="flex items-center gap-1 bg-primary/20 border border-primary/40 px-2.5 py-1.5 rounded-full shadow-[0_0_10px_rgba(var(--primary),0.3)]">
                      <Trophy className="w-3.5 h-3.5 text-primary" />
                      <span className="text-xs font-bold text-primary">Lvl {user?.level || 1}</span>
                    </div>
                    <InboxBadge asPillButton />
                    <SuggestionsBadge />
                  </>
                )}
              </div>
            </div>
          </motion.div>

                    {/* QUICK LAUNCH */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <QuickChip icon={<Zap className="w-4 h-4 text-accent-orange" />} label="Challenges" sub="Test skills"
              color="accent-orange" data-tour="challenges" onClick={go('/challenges')} disabled={isGuest} />
            <QuickChip icon={<Code className="w-4 h-4 text-primary" />} label="Editor" sub="Playground"
              color="primary" data-tour="playground" onClick={go('/playground')} disabled={isGuest} />
            <QuickChip icon={<HelpCircle className="w-4 h-4 text-accent-blue" />} label="Exams" sub="Quiz tests"
              color="accent-blue" onClick={go('/exams')} disabled={isGuest} />
          </div>

          {/* PROBLEM OF THE DAY */}
          <DailyProblemCard
            onOpenShare={(title, topic) => {
              setShareModalConfig({
                isOpen: true,
                title,
                topic,
                achievementType: 'dsa',
              });
            }}
          />


          {/* CONTINUE LEARNING */}
          {!isGuest && activeContinueTrack && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="w-full glass-card rounded-2xl p-4 sm:p-5 border border-primary/25 bg-gradient-to-r from-primary/10 via-background to-accent-blue/5 relative overflow-hidden"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
                {(() => {
                  const isTrackFinished = (continueLessonInfo?.total || 0) > 0 && (continueLessonInfo?.done || 0) >= (continueLessonInfo?.total || 0);
                  return (
                    <>
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center gap-2 text-[10px] font-mono text-primary uppercase tracking-wider">
                          <span className={`w-2 h-2 rounded-full ${isTrackFinished ? 'bg-amber-400' : 'bg-primary animate-pulse'}`} />
                          <span>{isTrackFinished ? 'Track Completed 🎓' : 'Continue Learning'}</span>
                          <span className="text-muted-foreground/60">·</span>
                          <span className="text-muted-foreground">{activeContinueTrack.title}</span>
                        </div>

                        <h2 className="text-base sm:text-lg font-bold font-display text-foreground truncate">
                          {isTrackFinished 
                            ? `All ${continueLessonInfo?.total} lessons finished! Outstanding work.`
                            : continueLessonInfo?.nextLesson 
                              ? `${continueLessonInfo.nextLesson.title}`
                              : activeContinueTrack.title}
                        </h2>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0">
                        <button
                          onClick={() => {
                            if (continueLessonInfo?.nextLesson?.url && !isTrackFinished) {
                              navigate(continueLessonInfo.nextLesson.url + (continueLessonInfo.nextLesson.url.includes('?') ? '&from=dashboard' : '?from=dashboard'));
                            } else {
                              navigate(activeContinueTrack.path);
                            }
                          }}
                          className="bg-primary text-primary-foreground px-4 py-2 rounded-xl text-xs font-bold font-display hover:neon-glow transition-all shrink-0 shadow-sm"
                        >
                          {isTrackFinished ? 'Review Track →' : 'Resume Lesson →'}
                        </button>
                        <button
                          onClick={go(activeContinueTrack.path)}
                          className="text-[10px] font-mono text-muted-foreground hover:text-foreground transition-colors"
                        >
                          View Roadmap
                        </button>
                      </div>
                    </>
                  );
                })()}
              </div>
            </motion.div>
          )}


          {/* CATEGORY FILTER BAR - Mobile Only */}
          <div className="lg:hidden w-full overflow-x-auto scrollbar-none py-1">
            <div className="flex items-center gap-1.5 min-w-max pb-2">
              {filterOptions.map((tab, index) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleCategorySelect(tab.id as DashboardCategory, index)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-semibold whitespace-nowrap transition-all ${
                      selectedCategory === tab.id
                        ? 'bg-primary text-primary-foreground shadow-sm neon-border'
                        : 'bg-secondary/40 text-muted-foreground hover:bg-secondary hover:text-foreground border border-border/40'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* YOUR TRACKS - Mobile Only */}
          {!isGuest && myTracks.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="lg:hidden glass-card rounded-2xl border border-border/50 p-3 sm:p-4 space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-display font-bold uppercase tracking-wider text-muted-foreground">Your tracks</p>
                <span className="text-[9px] font-mono text-muted-foreground">{myTracks.length} active</span>
              </div>
              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin">
                {myTracks.map(({ track, done, total, pct }) => (
                  <button key={track.id} onClick={go(track.path)}
                    className="w-full text-left rounded-xl p-2.5 bg-secondary/20 border border-border/40 hover:border-primary/40 transition-all group"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg shrink-0">{track.emoji}</span>
                      <p className="text-xs font-display font-semibold truncate flex-1">{track.title}</p>
                      <span className="text-[10px] font-mono text-primary shrink-0">{done}/{total}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                    </div>
                    <div className="mt-2 h-1.5 rounded-full bg-secondary overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-primary to-accent-blue transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}


          {/* SECTIONS */}
          <div className="space-y-3">
            {visibleSections.map((section, i) => {
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
                          {section.tracks.map(track => {
                            const isTrackDone = track.trackId ? isTrackCompleted(track.trackId as unknown as LessonTrackKey, user?.completedLessons || []) : false;
                            return (
                              <TrackRow
                                key={track.id}
                                track={track}
                                isGuest={isGuest}
                                locked={isTrackLockedForGuest(track.path)}
                                enrolled={!!(track.trackId && !isGuest && isEnrolled(track.trackId))}
                                completed={isTrackDone}
                                onClick={go(track.path)}
                              />
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.section>
              );
            })}
          </div>

          {/* DSA Sheet Featured Preview Card */}
          <motion.button
            initial={{ y: 15, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.08 }}
            onClick={go('/dsa-sheet')}
            className={`w-full glass-card p-4 rounded-2xl text-left transition-all relative overflow-hidden border border-primary/25 ${isGuest ? 'opacity-40 pointer-events-none grayscale' : 'hover:neon-border'}`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent-blue/10" />
            <div className="relative grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-12 h-12 rounded-xl bg-primary/15 grid place-items-center border border-primary/30 neon-glow shrink-0">
                  <Code2 className="w-5 h-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-base font-bold font-display flex items-center gap-2 truncate">
                    CodeSage DSA Sheet
                    <span className="text-[10px] font-mono text-primary">· Top 75 Interview Prep</span>
                  </p>
                  <p className="text-[11px] text-muted-foreground truncate">
                    Arrays · Trees · Graphs · DP · Live Python, C++, Java &amp; JS compiler
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-primary shrink-0" />
            </div>
          </motion.button>

          {/* Code Crawler featured */}
          <motion.button
            initial={{ y: 15, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
            onClick={go('/games/crawler')}
            className={`w-full glass-card p-4 rounded-2xl text-left transition-all relative overflow-hidden lg:hidden ${isGuest ? 'opacity-40 pointer-events-none grayscale' : 'hover:neon-border'}`}
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
          
          {/* Suggestions */}
          <motion.button
            initial={{ y: 15, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
            onClick={go('/suggestions')}
            className={`w-full glass-card p-4 rounded-2xl text-left flex items-center gap-3 transition-all lg:hidden ${isGuest ? 'opacity-40 pointer-events-none grayscale' : 'hover:neon-border'}`}
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
              <input value={promoInput} onChange={e => setPromoInput(e.target.value)} placeholder="Future_Update_If_You_Lose_Your_Progress_By_Any_Chance"
                className="flex-1 min-w-0 bg-secondary/40 border border-border rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-primary/50 font-mono" />
              <button onClick={handlePromo} className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-xs font-bold font-display hover:neon-glow">
                Apply
              </button>
            </div>
            {promoMsg && <p className="text-xs mt-2 font-mono">{promoMsg}</p>}
          </div>
        </motion.div>
      </div>

      {/* XP Breakdown Modal */}
      {showXpModal && user && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setShowXpModal(false)}>
          <div className="glass-card w-full max-w-sm rounded-2xl p-5 space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-display font-bold text-foreground flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" /> XP Breakdown
              </h3>
              <button onClick={() => setShowXpModal(false)} className="text-muted-foreground hover:text-foreground p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="bg-secondary/20 rounded-xl p-3 border border-border/30">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Daily Allowance</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-primary font-mono">{energy}</span>
                  <span className="text-xs text-muted-foreground">/ 10 XP remaining today</span>
                </div>
                <p className="text-[9px] text-muted-foreground mt-1">Resets at midnight · 3.3 XP per lesson</p>
              </div>

              <div className="bg-emerald-500/10 rounded-xl p-3 border border-emerald-500/20">
                <p className="text-[10px] text-emerald-400 uppercase tracking-wider mb-1">Today's Winnings</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-emerald-400 font-mono">+{todayLessons}</span>
                  <span className="text-xs text-emerald-400/70">victory XP earned today</span>
                </div>
                <p className="text-[9px] text-emerald-400/60 mt-1">+1 XP per completed lesson</p>
              </div>

              <div className="bg-yellow-500/10 rounded-xl p-3 border border-yellow-500/20">
                <p className="text-[10px] text-yellow-400 uppercase tracking-wider mb-1">Lifetime XP</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-yellow-400 font-mono">{user.xp || 0}</span>
                  <span className="text-xs text-yellow-400/70">total accumulated</span>
                </div>
                <p className="text-[9px] text-yellow-400/60 mt-1">Never resets · shows total progress</p>
              </div>
            </div>

            <div className="bg-primary/10 border border-primary/20 rounded-lg p-2">
              <p className="text-[10px] text-primary text-center font-semibold">💡 Daily XP is an allowance. Lifetime XP is your permanent score!</p>
            </div>

            {/* Expandable XP & Coins Guide Accordion */}
            <div className="border-t border-border/30 pt-2">
              <button
                type="button"
                onClick={() => setShowGuideDetails(!showGuideDetails)}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-secondary/30 hover:bg-secondary/50 border border-border/40 text-xs font-semibold text-foreground transition-all group"
              >
                <span className="flex items-center gap-2">
                  <Coins className="w-4 h-4 text-yellow-400" />
                  <span>How to Earn & Use XP & Coins</span>
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-muted-foreground transition-transform duration-200 group-hover:text-primary ${
                    showGuideDetails ? 'rotate-180 text-primary' : ''
                  }`}
                />
              </button>

              <AnimatePresence>
                {showGuideDetails && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden space-y-2.5 pt-2.5"
                  >
                    {/* Earning Section */}
                    <div className="bg-secondary/20 rounded-xl p-3 border border-border/30 space-y-1.5 text-left">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-primary font-display">
                        <Zap className="w-3.5 h-3.5" /> How You Earn XP & Coins
                      </div>
                      <ul className="text-[11px] text-muted-foreground space-y-1.5 list-disc list-inside">
                        <li>
                          <strong className="text-foreground">+1 Victory XP</strong> & <strong className="text-yellow-400">+2 Coins</strong> for every lesson completed.
                        </li>
                        <li>
                          <strong className="text-foreground">+3 XP</strong> & <strong className="text-yellow-400">+5 Coins</strong> for passing Track Exams & Challenges.
                        </li>
                        <li>
                          <strong className="text-foreground">10 Daily Allowance XP:</strong> Refilled at midnight for active lesson sessions (3.3 XP per lesson).
                        </li>
                        <li>
                          <strong className="text-orange-400">Streak Milestones:</strong> Bonus coin chests unlocked on 3-day, 7-day, and 14-day streaks!
                        </li>
                      </ul>
                    </div>

                    {/* Using Section */}
                    <div className="bg-yellow-500/5 rounded-xl p-3 border border-yellow-500/20 space-y-1.5 text-left">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-yellow-400 font-display">
                        <Coins className="w-3.5 h-3.5" /> Where to Use XP & Coins
                      </div>
                      <ul className="text-[11px] text-muted-foreground space-y-1.5 list-disc list-inside">
                        <li>
                          <strong className="text-foreground">Streak Freeze (5 Coins):</strong> Protects your streak if you miss a study day — buy it from the coin button.
                        </li>
                        <li>
                          <strong className="text-foreground">Buy XP (5 Coins):</strong> Tap the coin button to instantly refill +3.3 XP for one more lesson.
                        </li>
                        <li>
                          <strong className="text-foreground">Arcade & Crawler Lives:</strong> Replenish hearts in Code Crawler and challenges.
                        </li>
                        <li>
                          <strong className="text-foreground">Leaderboard & Rank (XP):</strong> Lifetime XP levels up your profile rank and trophy status.
                        </li>
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      )}

      {showTour && tourReady && (
        <DashboardTour steps={TOUR_STEPS} onFinish={() => { markTourSeen(); }} />
      )}

      <EnrollDialog
        open={enrollTarget !== null}
        track={enrollTarget}
        onClose={() => setEnrollTarget(null)}
      />

      <ShareAchievementModal
        isOpen={shareModalConfig.isOpen}
        onClose={() => setShareModalConfig(prev => ({ ...prev, isOpen: false }))}
        title={shareModalConfig.title}
        topic={shareModalConfig.topic}
        achievementType={shareModalConfig.achievementType}
        customMessage={shareModalConfig.customMessage}
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
  track, isGuest, locked, enrolled, completed, onClick,
}: {
  track: TrackDef; isGuest: boolean; locked: boolean; enrolled: boolean; completed?: boolean; onClick: () => void;
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
        completed ? 'ring-1 ring-amber-400/40 border-amber-500/30' : enrolled ? 'ring-1 ring-primary/40 neon-border' : '',
      ].join(' ')}
    >
      <div className={`absolute left-0 top-0 bottom-0 w-0.5 bg-${track.accent} opacity-60 group-hover:opacity-100 transition-opacity`} />

      <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
        <div className={`w-11 h-11 rounded-xl bg-${track.accent}/15 grid place-items-center text-xl border border-${track.accent}/30 shrink-0`}>
          {track.emoji}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-bold font-display truncate flex items-center gap-1.5">
              {track.title}
              {['pythonexpert', 'cexpert', 'cppexpert', 'javaexpert', 'intermediate-ai'].includes(track.id) && (
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 border border-amber-500/40 shadow-sm shrink-0">
                  PRO
                </span>
              )}
            </p>
            {completed ? (
              <span className="text-xs shrink-0" title="Track Completed">🎓</span>
            ) : enrolled ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            ) : null}
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

      <div className="flex flex-wrap items-center justify-between mt-2 gap-1.5 pl-0 sm:pl-14">
        <p className="text-[10px] text-muted-foreground truncate max-w-[200px] sm:max-w-none">{track.desc}</p>
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
          {completed ? (
            <span className="text-[9px] text-amber-400 bg-amber-500/15 border border-amber-500/30 rounded-full px-1.5 py-0.5 font-mono font-semibold flex items-center gap-1">
              🏆 Completed
            </span>
          ) : enrolled ? (
            <span className="text-[9px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 rounded-full px-1.5 py-0.5 font-mono">
              Enrolled
            </span>
          ) : null}
        </div>
      </div>

      {!disabled && (
        <Sparkles className="absolute top-2 right-8 w-3 h-3 text-primary/0 group-hover:text-primary/60 transition-colors" />
      )}
    </motion.button>
  );
}
