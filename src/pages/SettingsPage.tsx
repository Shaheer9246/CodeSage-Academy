import { useNavigate, useSearchParams } from 'react-router-dom';
import { useUser, cleanStudentId, type UserProfile } from '@/contexts/UserContext';
import { StreakModal } from "@/components/StreakModal";
import {
  User, Flame, Trophy, Trash2, LogOut, Check, Lock, Target, Zap,
  Palette, Wrench, Download, RefreshCw, PlayCircle, Eraser, BookOpen,
  BarChart3, X, Pencil, GraduationCap, PauseCircle, PlayCircle as ResumeIcon,
  StopCircle, ShieldCheck, Sparkles, ChevronDown, Volume2, VolumeX
} from 'lucide-react';
import { isSoundEnabled, setSoundEnabled, playTestPassed } from '@/lib/soundFx';
import { useState, useEffect } from 'react';
import {
  ALL_LESSON_IDS,
  LESSON_TRACK_KEYS,
  TRACK_LESSON_IDS,
  TRACK_LESSON_LABELS,
  completedCountFor,
  lessonCountFor,
  isTrackCompleted,
  type LessonTrackKey,
} from '@/data/lessonIndex';
import { motion, AnimatePresence } from 'framer-motion';
import { applyTheme, getTheme, THEMES, ThemeName } from '@/lib/theme';
import { BADGES } from '@/data/badges';
import { Switch } from '@/components/ui/switch';
import { resetGuestLessons } from '@/lib/guestGate';
import JSZip from 'jszip';
import { toast } from 'sonner';
import { downloadBlobFile } from '@/lib/downloadHelper';
import AvatarPicker, { getStoredAvatar } from '@/components/AvatarPicker';
import { SkillHealthCard } from '@/components/SkillHealthCard';
import {
  TRACK_META,
  TrackId,
  getEnrollments,
  pause as pauseTrack,
  resume as resumeTrack,
  end as endTrack,
  onEnrollmentChange,
} from '@/lib/enrollment';

type Achievement = {
  id: string;
  label: string;
  icon: string;
  description: string;
  check: (u: UserProfile) => boolean;
};

type Enrollment = { track: TrackId; status: string };

const ACHIEVEMENTS: Achievement[] = [
  { id: 'first-lesson', label: 'First Steps', icon: '🎯', description: 'Complete your first lesson', check: u => u.completedLessons.length >= 1 },
  { id: 'five-lessons', label: 'Getting Into The Groove', icon: '📚', description: 'Complete 5 total lessons', check: u => u.completedLessons.length >= 5 },
  { id: 'twenty-lessons', label: 'Dedicated Learner', icon: '🏅', description: 'Complete 20 total lessons', check: u => u.completedLessons.length >= 20 },
  { id: 'half-century', label: 'Half Century', icon: '💯', description: 'Complete 50 total lessons', check: u => u.completedLessons.length >= 50 },
  { id: 'all-html', label: 'HTML Master', icon: '📄', description: 'Complete all HTML lessons', check: u => u.completedLessons.filter(l => l.startsWith('html')).length >= 6 },
  { id: 'all-css', label: 'CSS Wizard', icon: '🎨', description: 'Complete all CSS lessons', check: u => u.completedLessons.filter(l => l.startsWith('css')).length >= 6 },
  { id: 'all-js', label: 'JS Jedi', icon: '⚡', description: 'Complete all JS lessons', check: u => u.completedLessons.filter(l => l.startsWith('js')).length >= 6 },
  { id: 'fullstack-dev', label: 'Full-Stack Developer', icon: '🌐', description: 'Complete 28 Frontend & Full-Stack lessons', check: u => u.completedLessons.filter(l => l.startsWith('frontend') || l.startsWith('html') || l.startsWith('css') || l.startsWith('js')).length >= 28 },
  { id: 'python-track', label: 'Python Whisperer', icon: '🐍', description: 'Complete Python Beginner to Expert tracks', check: u => u.completedLessons.filter(l => l.startsWith('py') || l.startsWith('python')).length >= 10 },
  { id: 'java-track', label: 'Java Architect', icon: '☕', description: 'Complete Java Beginner to Expert tracks', check: u => u.completedLessons.filter(l => l.startsWith('java')).length >= 10 },
  { id: 'cpp-track', label: 'C++ Hardcore', icon: '⚙️', description: 'Complete C++ Beginner to Advanced tracks', check: u => u.completedLessons.filter(l => l.startsWith('cpp')).length >= 10 },
  { id: 'freelance-ready', label: 'Freelance Hustler', icon: '💼', description: 'Complete all Freelancing modules', check: u => u.completedLessons.filter(l => l.startsWith('freelance')).length >= 5 },
  { id: 'test-pass', label: 'Test Ace', icon: '📜', description: 'Pass your first level test or exam', check: u => (u.completedTests?.length || 0) >= 1 },
  { id: 'exam-veteran', label: 'Exam Veteran', icon: '🎓', description: 'Pass 5 distinct tests or exams', check: u => (u.completedTests?.length || 0) >= 5 },
  { id: 'challenge-solver', label: 'Challenge Slayer', icon: '🧩', description: 'Solve 5 Code Challenges', check: u => u.completedLessons.filter(l => l.startsWith('challenge-')).length >= 5 },
  { id: 'crawler-master', label: 'Crawler Master', icon: '🕷️', description: 'Complete 5 Code Crawler exercises', check: u => u.completedLessons.filter(l => l.startsWith('crawler-')).length >= 5 },
  { id: 'streak-3', label: '3-Day Streak', icon: '🔥', description: 'Maintain a 3-day coding streak', check: u => u.streakCount >= 3 },
  { id: 'streak-7', label: '7-Day Streak', icon: '🔥', description: 'Maintain a 7-day coding streak', check: u => u.streakCount >= 7 },
  { id: 'streak-30', label: '30-Day Power Coder', icon: '🏆', description: 'Maintain a 30-day coding streak', check: u => u.streakCount >= 30 },
  { id: 'xp-500', label: 'XP Collector', icon: '✨', description: 'Earn 500 total XP', check: u => (u.xp || 0) >= 500 },
  { id: 'xp-2000', label: 'XP Titan', icon: '👑', description: 'Earn 2,000 total XP', check: u => (u.xp || 0) >= 2000 },
];

const TABS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'progress', label: 'Progress', icon: Trophy },
  { id: 'settings', label: 'Settings', icon: Wrench },
   { id: 'ai-teacher', label: 'AI Teacher', icon: Sparkles, badge: 'Active' },
  { id: 'account', label: 'Account', icon: ShieldCheck },
] as const;

const formatBadgeName = (id: string) =>
  id.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

import {
  normalizeGoalValue,
  normalizeExperienceValue,
  syncGoalWithDashboard,
} from '@/lib/goalHelper';

export { normalizeGoalValue, normalizeExperienceValue };

const formatGoal = (goalId?: string) => {
  const normalized = normalizeGoalValue(goalId);
  switch (normalized) {
    case 'cyber':
      return 'Cyber Security Specialist';
    case 'frontend':
      return 'Modern Full-Stack & Web';
    case 'ai':
      return 'AI & Machine Learning Engineer';
    case 'python':
      return 'Python Software Engineer';
    case 'systems':
      return 'Systems & Core Programming';
    case 'all':
    default:
      return 'All-Round Explorer';
  }
};

const GOAL_OPTIONS = [
  { id: 'cyber', label: 'Cyber Security Specialist', badge: 'New', desc: 'Linux, Networking, Burp Suite & Defensive Ops' },
  { id: 'frontend', label: 'Modern Full-Stack & Web', desc: 'HTML, CSS, JavaScript, React & Production APIs' },
  { id: 'ai', label: 'AI & Machine Learning Engineer', badge: 'Trending', desc: 'Neural Nets, LLMs & Autonomous Agents' },
  { id: 'python', label: 'Python Software Engineer', desc: 'Python Core, OOP & Backend APIs' },
  { id: 'systems', label: 'Systems & Core Programming', desc: 'C, C++, Memory, Relational SQL & Networks' },
  { id: 'all', label: 'All-Round Explorer', desc: 'All 20 tracks across every language & tool' },
] as const;

const EXPERIENCE_OPTIONS = [
  { id: 'Beginner', label: 'Beginner', desc: 'Starting from scratch / basics' },
  { id: 'Intermediate', label: 'Intermediate', desc: 'CS student / self-taught coder' },
  { id: 'Advanced', label: 'Advanced', desc: 'Mastering new stacks & architectures' },
] as const;

const SettingsPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, logout, deleteAccount, resetTour, updateUser, spendCoins } = useUser();

  const [activeTab, setActiveTab] = useState<'profile' | 'progress' | 'settings' | 'ai-teacher' | 'account'>('profile');
  const [theme, setTheme] = useState<ThemeName>('dark');
  const [autoRun, setAutoRun] = useState<boolean>(() => {
    try { return localStorage.getItem('codesage_autorun') !== '0'; } catch { return true; }
  });
  const [soundEnabled, setSoundEnabledState] = useState<boolean>(() => isSoundEnabled());
  const handleToggleSound = (enabled: boolean) => {
    setSoundEnabled(enabled);
    setSoundEnabledState(enabled);
    if (enabled) playTestPassed();
  };
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [detailModal, setDetailModal] = useState<'lessons' | 'progress' | 'xp' | null>(null);
  const [showAllAchievements, setShowAllAchievements] = useState(false);
  const [, setEnrollTick] = useState(0);
  const [showEditModal, setShowEditModal] = useState(false);
  const [goalDropdownOpen, setGoalDropdownOpen] = useState(false);
  const [expDropdownOpen, setExpDropdownOpen] = useState(false);
  const [showStreakModal, setShowStreakModal] = useState(false);
  const [editData, setEditData] = useState({ name: '', studying: '', goal: '', experienceLevel: '' });

  // Auto-open Edit Profile modal when linked with ?edit=goal or ?edit=profile.
  useEffect(() => {
    const editParam = searchParams.get('edit');
    if ((editParam === 'goal' || editParam === 'profile' || editParam === 'true') && user) {
      setActiveTab('profile');
      setEditData({
        name: user.name || '',
        studying: user.studying || '',
        goal: normalizeGoalValue(user.goal),
        experienceLevel: normalizeExperienceValue(user.experienceLevel),
      });
      setShowEditModal(true);
    }
  }, [searchParams, user]);

  useEffect(() => { setTheme(getTheme()); }, []);
  useEffect(() => { if (user?.id) setAvatarUrl(getStoredAvatar(user.id)); }, [user?.id]);
  useEffect(() => {
    try { localStorage.setItem('codesage_autorun', autoRun ? '1' : '0'); }
    catch (error) { console.warn('Failed to persist autoRun setting', error); }
  }, [autoRun]);
  useEffect(() => onEnrollmentChange(() => setEnrollTick(t => t + 1)), []);

  const changeTheme = (t: ThemeName) => { setTheme(t); applyTheme(t); };

  const handleReplayTour = async () => {
    try {
      localStorage.setItem(`codesage_tour_seen_${user?.id}`, 'false');
    } catch {}
    await resetTour();
    toast.success('Tour reset! Launching dashboard...');
    navigate('/dashboard');
  };

  const handleResetRuntime = () => {
    if (!confirm('Reset runtime caches? Clears playground recents, snapshots, and guest progress.')) return;
    try {
      localStorage.removeItem('codesage_playground_recent');
      localStorage.removeItem('codesage_pg_multi');
      resetGuestLessons();
      toast.success('Runtime caches cleared.');
    } catch { toast.error('Could not clear caches.'); }
  };

  const handleClearSandbox = () => {
    if (!confirm('Clear ALL non-account local data (theme, playground, caches)? Your account/progress stay.')) return;
    try {
      const keep = ['supabase.auth.token'];
      Object.keys(localStorage).forEach(k => { if (!keep.includes(k)) localStorage.removeItem(k); });
      toast.success('Sandbox cleared.');
    } catch (error) { console.warn('Could not clear sandbox localStorage', error); }
  };

  const handleExportWorkspace = async () => {
    try {
      const zip = new JSZip();
      const playground = localStorage.getItem('codesage_playground_recent') || '[]';
      zip.file('playground-recents.json', playground);
      zip.file('profile.json', JSON.stringify({
        name: user?.name, xp: user?.xp, streak: user?.streakCount,
        completedLessons: user?.completedLessons, badges: user?.badges,
      }, null, 2));
      zip.file('README.txt', 'CodeSage workspace export — generated from Settings.');
      const blob = await zip.generateAsync({ type: 'blob' });
      const filename = `codesage-workspace-${Date.now()}.zip`;
      const success = downloadBlobFile(blob, filename);
      if (success) {
        toast.success('Workspace exported.');
      } else {
        toast.error('Unable to download file. Please check browser permissions.');
      }
    } catch (err) {
      console.error('Workspace export error:', err);
      toast.error('Export failed.');
    }
  };

  const handleBuyFreeze = async () => {
    if ((user?.sageCoins || 0) < 10) {
      toast.error('Need 10 Sage Coins to buy a Streak Freeze ❄️');
      return;
    }
    const spent = await spendCoins(10, 'streak_freeze_settings');
    if (spent) toast.success('❄️ Streak Freeze purchased! Your streak is protected.');
    else toast.error('Could not purchase freeze');
  };

  if (!user) { navigate('/auth'); return null; }

  const joinDate = user.joinDate ? new Date(user.joinDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A';
  const totalLessons = ALL_LESSON_IDS.length;
  const completedCount = user.completedLessons.length;
  const progress = totalLessons ? Math.round((completedCount / totalLessons) * 100) : 0;

  const lessonGroups = [
    ...LESSON_TRACK_KEYS.map(key => ({
      key,
      label: TRACK_LESSON_LABELS[key],
      total: TRACK_LESSON_IDS[key].length,
      count: completedCountFor(key, user.completedLessons),
    })),
    { key: 'challenges', label: 'Challenges', total: 0, count: user.completedLessons.filter(id => id.startsWith('challenge-')).length },
    { key: 'crawler', label: 'Code Crawler', total: 0, count: user.completedLessons.filter(id => id.startsWith('crawler-')).length },
  ];

  const today = new Date();
  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const todayIdx = today.getDay();
  const streakDays = weekDays.map((day, i) => ({
    day,
    active: i <= todayIdx && i >= todayIdx - Math.min(user.streakCount, todayIdx),
    isToday: i === todayIdx,
  }));

  /* Level / rank math (computed once, used once) */
  const currentLevelData = (BADGES || []).find(b => (b.level || 0) === user.level);
  const nextLevelData = (BADGES || []).find(b => (b.level || 0) === user.level + 1);
  const prevLevelReq = currentLevelData?.xpRequired || 0;
  const nextLevelReq = nextLevelData?.xpRequired || (prevLevelReq + 10);
  let levelProgressPct = 0;
  if (nextLevelReq > prevLevelReq) {
    const lessonsInThisLevel = nextLevelReq - prevLevelReq;
    const lessonsCompletedInThisLevel = Math.max(0, completedCount - prevLevelReq);
    levelProgressPct = Math.min(100, Math.round((lessonsCompletedInThisLevel / lessonsInThisLevel) * 100));
  } else {
    levelProgressPct = 100;
  }
  const safeLevelProgressPct = isNaN(levelProgressPct) ? 0 : Math.max(levelProgressPct, levelProgressPct > 0 ? 4 : 0);
  const currentBadgeIcon = (currentLevelData as { icon?: string } | undefined)?.icon || '🏆';
  const nextBadgeLabel = nextLevelData
    ? `Next: ${formatBadgeName(nextLevelData.id || `Level ${user.level + 1}`)}`
    : 'Max Level Reached! 🏆';

  const unlockedAchievements = ACHIEVEMENTS.filter(a => a.check(user));

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete your account? This cannot be undone.')) {
      const deleted = await deleteAccount();
      if (deleted) navigate('/auth', { replace: true });
    }
  };

  const initials = (user.name || user.username || 'U').slice(0, 2).toUpperCase();
  const enrollments = getEnrollments();
  const activeEnroll: Enrollment[] = enrollments.filter(e => e.status === 'active');
  const pausedEnroll: Enrollment[] = enrollments.filter(e => e.status === 'paused');

  const doPause = (t: TrackId) => { pauseTrack(t); toast.success(`Paused ${TRACK_META[t]?.short || t}`); };
  const doResume = (t: TrackId) => {
    if (activeEnroll.length >= 2) { toast.error('You already have 2 active tracks. Pause one first.'); return; }
    resumeTrack(t); toast.success(`Resumed ${TRACK_META[t]?.short || t}`);
  };
  const doEnd = (t: TrackId) => {
    if (!confirm(`End enrollment in ${TRACK_META[t]?.label || t}? Your progress stays, but the track goes back to un-enrolled.`)) return;
    endTrack(t); toast.success(`Ended ${TRACK_META[t]?.short || t}`);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden w-full max-w-full grid-bg">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full max-w-7xl mx-auto p-4 lg:p-6 box-border min-w-0"
      >
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">

          {/* Tab Navigation: Horizontal on mobile, Vertical sticky sidebar on desktop */}
          <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-3 lg:pb-0 [-ms-overflow-style:'none'] [scrollbar-width:'none'] [&::-webkit-scrollbar]:hidden sticky top-0 bg-background/80 backdrop-blur-md z-10 pt-2 -mx-4 px-4 lg:mx-0 lg:px-0 lg:w-56 lg:flex-shrink-0 lg:sticky lg:top-6 lg:h-fit">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold whitespace-nowrap transition-all border flex-shrink-0 ${
                    isActive
                      ? 'bg-primary/15 text-primary border-primary/30 shadow-[0_0_12px_rgba(var(--primary),0.15)]'
                      : 'bg-secondary/10 text-muted-foreground border-border/30 hover:bg-secondary/20 hover:text-foreground'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  {'badge' in tab && (
                    <span className="ml-auto px-1.5 py-0.5 text-[9px] font-bold rounded-md bg-gradient-to-r from-primary to-purple-500 text-white shadow-sm">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Content Area */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="space-y-4 lg:space-y-6 pb-4 flex-1 min-w-0"
            >
              {/* ================= PROFILE TAB ================= */}
              {activeTab === 'profile' && (
                <div className="glass-card rounded-2xl p-5 lg:p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-2xl border border-primary/20 overflow-hidden">
                        {avatarUrl ? <img src={avatarUrl} alt="Avatar" className="w-full h-full" /> : <span className="font-display font-bold text-primary">{initials}</span>}
                      </div>
                      <button onClick={() => setShowAvatarPicker(true)} className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center border-2 border-background hover:scale-110 transition-transform" title="Edit avatar">
                        <Pencil className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h2 className="text-lg font-bold font-display text-foreground truncate">{user.name}</h2>
                      <p className="text-xs text-muted-foreground font-mono truncate">@{user.username}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <InfoRow label="Student ID" value={cleanStudentId(user.studentId, user.id)} />
                    <InfoRow label="Email" value={user.email} />
                    <InfoRow label="Studying" value={user.studying} />
                    <InfoRow label="Goal" value={formatGoal(user.goal)} />
                    <InfoRow label="Experience" value={user.experienceLevel} />
                    <InfoRow label="Member Since" value={joinDate} />
                  </div>
                  <button onClick={() => {
                    setEditData({
                      name: user.name || '',
                      studying: user.studying || '',
                      goal: normalizeGoalValue(user.goal),
                      experienceLevel: normalizeExperienceValue(user.experienceLevel),
                    });
                    setShowEditModal(true);
                  }} className="w-full mt-4 flex items-center justify-center gap-2 bg-secondary/15 rounded-xl px-3 py-2.5 border border-border/30 hover:bg-secondary/30 transition-colors text-xs font-semibold text-foreground">
                    <Pencil className="w-3.5 h-3.5 text-primary" /> Edit Profile Data
                  </button>
                </div>
              )}

              {/* ================= PROGRESS TAB ================= */}
              {activeTab === 'progress' && (
                <>
                  {/* 1) Streak */}
                  <div className="glass-card rounded-2xl p-5 lg:p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-bold font-display flex items-center gap-2"><Flame className="w-4 h-4 text-orange-500 fill-orange-500" /> Coding Streak</h3>
                      <button onClick={() => setShowStreakModal(true)} className="text-xs text-primary font-semibold hover:underline flex items-center gap-1">Show Streak Card</button>
                    </div>
                    <div className="flex items-end gap-2 mb-3">
                      <span className="text-4xl font-bold text-primary font-display neon-text">{user.streakCount}</span>
                      <span className="text-sm text-muted-foreground mb-1">days</span>
                    </div>
                    <div className="flex gap-2 justify-center">
                      {streakDays.map((d, i) => (
                        <div key={i} className="flex flex-col items-center gap-1">
                          <span className="text-[9px] text-muted-foreground">{d.day}</span>
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs transition-all ${d.active ? 'bg-orange-500/20 text-orange-500 border border-orange-500/30' : 'bg-secondary/30 text-muted-foreground/30 border border-border/20'}`}>
                            <Flame className={`w-3.5 h-3.5 ${d.active ? 'fill-orange-500 text-orange-500' : 'text-muted-foreground/30'}`} />
                          </div>
                        </div>
                      ))}
                    </div>
                    <button onClick={handleBuyFreeze} disabled={(user?.sageCoins || 0) < 10} className="w-full mt-4 flex items-center justify-center gap-2 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 rounded-xl px-3 py-2.5 hover:bg-yellow-500/20 transition-colors text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed">
                      <ShieldCheck className="w-3.5 h-3.5" /> Buy Streak Freeze (10 Coins)
                    </button>
                  </div>

                  {/* 2) Your Progress — stats + rank combined (no duplicates) */}
                  <div className="glass-card rounded-2xl p-5 lg:p-6 border border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-bold font-display flex items-center gap-2"><Trophy className="w-4 h-4 text-primary" /> Your Progress</h3>
                      <span className="text-[10px] font-mono text-muted-foreground bg-secondary/50 px-2 py-1 rounded-full">{completedCount} lessons done</span>
                    </div>

                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center text-3xl shadow-[0_0_20px_rgba(var(--primary),0.2)] flex-shrink-0">
                        {currentBadgeIcon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">You are</p>
                        <h2 className="text-lg sm:text-xl font-black font-display text-primary truncate">Level {user.level}</h2>
                        <p className="text-xs text-foreground/70 truncate">{nextBadgeLabel}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-4">
                      <button onClick={() => setDetailModal('lessons')} className="bg-secondary/20 rounded-xl p-3 text-center hover:bg-secondary/30 hover:neon-border transition-all">
                        <p className="text-xl font-bold text-primary font-mono">{completedCount}</p>
                        <p className="text-[9px] text-muted-foreground">Lessons</p>
                      </button>
                      <button onClick={() => setDetailModal('progress')} className="bg-secondary/20 rounded-xl p-3 text-center hover:bg-secondary/30 hover:neon-border transition-all">
                        <p className="text-xl font-bold text-primary font-mono">{progress}%</p>
                        <p className="text-[9px] text-muted-foreground">Progress</p>
                      </button>
                      <button onClick={() => setDetailModal('xp')} className="bg-secondary/20 rounded-xl p-3 text-center hover:bg-secondary/30 hover:neon-border transition-all">
                        <p className="text-xl font-bold text-primary font-mono">{user.xp || 0}</p>
                        <p className="text-[9px] text-muted-foreground">Lifetime XP</p>
                      </button>
                      <button onClick={() => setDetailModal('xp')} className="bg-yellow-500/10 rounded-xl p-3 text-center hover:bg-yellow-500/20 hover:neon-border transition-all border border-yellow-500/20">
                        <p className="text-xl font-bold text-yellow-400 font-mono">{user.sageCoins || 0}</p>
                        <p className="text-[9px] text-muted-foreground">Sage Coins</p>
                      </button>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[10px] font-mono text-muted-foreground">
                        <span>Progress to Level {user.level + 1}</span>
                        <span>{safeLevelProgressPct}% ({completedCount} / {nextLevelData ? nextLevelReq : 'MAX'})</span>
                      </div>
                      <div className="h-2 bg-secondary/40 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-primary to-purple-500 rounded-full transition-all duration-500" style={{ width: `${safeLevelProgressPct}%` }} />
                      </div>
                    </div>
                  </div>

                  {/* 3) Track Progress & Skill Diagnostics (expandable by track) */}
                  <SkillHealthCard
                    isGuest={false}
                    completedLessonIds={user.completedLessons}
                    activeTrackIds={activeEnroll.map(e => e.track)}
                  />

                  {/* 4) Enrollments — collapsed by default */}
                  <EnrollmentSection
                    activeEnroll={activeEnroll}
                    pausedEnroll={pausedEnroll}
                    doPause={doPause}
                    doResume={doResume}
                    doEnd={doEnd}
                  />

                  {/* 4) Achievements — unlocked first, expandable */}
                  <div className="glass-card rounded-2xl p-5 lg:p-6">
                    <button onClick={() => setShowAllAchievements(!showAllAchievements)} className="w-full flex items-center justify-between gap-2 text-left mb-3">
                      <h3 className="text-sm font-bold font-display flex items-center gap-2">
                        <Target className="w-4 h-4 text-primary" /> Achievements
                        <span className="text-[10px] font-mono text-muted-foreground bg-secondary/50 px-1.5 py-0.5 rounded-full flex-shrink-0">
                          {unlockedAchievements.length}/{ACHIEVEMENTS.length}
                        </span>
                      </h3>
                      <span className="flex items-center gap-1 text-xs text-primary font-semibold flex-shrink-0">
                        {showAllAchievements ? 'Show Less' : `Show All (${ACHIEVEMENTS.length})`}
                        <motion.span animate={{ rotate: showAllAchievements ? 180 : 0 }} className="inline-flex">
                          <ChevronDown className="w-4 h-4" />
                        </motion.span>
                      </span>
                    </button>

                    <div className="space-y-2">
                      {(showAllAchievements ? ACHIEVEMENTS : unlockedAchievements.slice(0, 3)).map(ach => {
                        const unlocked = ach.check(user);
                        return (
                          <div key={ach.id} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${unlocked ? 'bg-primary/5 border border-primary/20' : 'bg-secondary/10 border border-border/20 opacity-50'}`}>
                            <span className="text-lg flex-shrink-0">{ach.icon}</span>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-foreground break-words">{ach.label}</p>
                              <p className="text-[10px] text-muted-foreground break-words">{ach.description}</p>
                            </div>
                            {unlocked ? <Check className="w-4 h-4 text-primary flex-shrink-0" /> : <Lock className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />}
                          </div>
                        );
                      })}
                      {!showAllAchievements && unlockedAchievements.length === 0 && (
                        <p className="text-[11px] text-muted-foreground text-center py-4">Complete lessons to unlock achievements! 🎯</p>
                      )}
                      {!showAllAchievements && unlockedAchievements.length > 3 && (
                        <p className="text-[10px] text-muted-foreground text-center pt-1">+ {unlockedAchievements.length - 3} more unlocked — tap "Show All"</p>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* ================= SETTINGS TAB ================= */}
              {activeTab === 'settings' && (
                <>
                  {/* Theme Picker */}
                  <div className="glass-card rounded-2xl p-5 lg:p-6">
                    <h3 className="text-sm font-bold font-display flex items-center gap-2 mb-3"><Palette className="w-4 h-4 text-primary" /> Appearance</h3>
                    <p className="text-[10px] text-muted-foreground mb-3">Choose a theme — applies across the whole app.</p>
                    <div className="grid grid-cols-2 gap-2">
                      {THEMES.map(t => {
                        const active = theme === t.id;
                        return (
                          <button key={t.id} onClick={() => changeTheme(t.id)} className={`flex items-center gap-2 p-3 rounded-xl border transition-all text-left ${active ? 'border-primary bg-primary/10 neon-border' : 'border-border/30 bg-secondary/20 hover:border-primary/30'}`}>
                            <span className="w-7 h-7 rounded-lg flex-shrink-0 border border-border/30" style={{ background: t.swatch }} />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-foreground truncate">{t.label}</p>
                              <p className="text-[9px] text-muted-foreground">{active ? 'Active' : 'Tap to apply'}</p>
                            </div>
                            {active && <Check className="w-4 h-4 text-primary flex-shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Power Tools */}
                  <div className="glass-card rounded-2xl p-5 lg:p-6">
                    <h3 className="text-sm font-bold font-display flex items-center gap-2 mb-3"><Wrench className="w-4 h-4 text-primary" /> Power Tools</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between bg-secondary/15 rounded-xl px-3 py-2.5 border border-border/30">
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-foreground">Auto-Run Preview</p>
                          <p className="text-[10px] text-muted-foreground">Live preview refreshes as you type in Playground.</p>
                        </div>
                        <Switch checked={autoRun} onCheckedChange={setAutoRun} />
                      </div>

                      <div className="flex items-center justify-between bg-secondary/15 rounded-xl px-3 py-2.5 border border-border/30">
                        <div className="min-w-0 flex-1 mr-3">
                          <div className="flex items-center gap-1.5">
                            {soundEnabled ? (
                              <Volume2 className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                            ) : (
                              <VolumeX className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                            )}
                            <p className="text-xs font-semibold text-foreground">Sound FX &amp; Haptics</p>
                          </div>
                          <p className="text-[10px] text-muted-foreground">Synthesizer chimes for streak celebrations and test completions.</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {soundEnabled && (
                            <button
                              type="button"
                              onClick={() => playTestPassed()}
                              className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-primary/10 hover:bg-primary/20 text-primary transition-colors border border-primary/25"
                              title="Test audio chime"
                            >
                              Test
                            </button>
                          )}
                          <Switch checked={soundEnabled} onCheckedChange={handleToggleSound} />
                        </div>
                      </div>
                      <button onClick={handleReplayTour} className="w-full flex items-center gap-3 bg-secondary/15 rounded-xl px-3 py-2.5 border border-border/30 hover:bg-secondary/30 transition-colors text-left">
                        <PlayCircle className="w-4 h-4 text-primary flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-foreground">Replay Tour</p>
                          <p className="text-[10px] text-muted-foreground">Rewatch the onboarding carousel.</p>
                        </div>
                      </button>
                      <button onClick={handleExportWorkspace} className="w-full flex items-center gap-3 bg-secondary/15 rounded-xl px-3 py-2.5 border border-border/30 hover:bg-secondary/30 transition-colors text-left">
                        <Download className="w-4 h-4 text-primary flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-foreground">Export Workspace (.zip)</p>
                          <p className="text-[10px] text-muted-foreground">Download your profile snapshot & playground recents.</p>
                        </div>
                      </button>
                      <button onClick={handleResetRuntime} className="w-full flex items-center gap-3 bg-secondary/15 rounded-xl px-3 py-2.5 border border-border/30 hover:bg-secondary/30 transition-colors text-left">
                        <RefreshCw className="w-4 h-4 text-warning flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-foreground">Reset Runtime</p>
                          <p className="text-[10px] text-muted-foreground">Clear playground snapshots & guest progress.</p>
                        </div>
                      </button>
                      <button onClick={handleClearSandbox} className="w-full flex items-center gap-3 bg-red-500/5 rounded-xl px-3 py-2.5 border border-red-500/20 hover:bg-red-500/10 transition-colors text-left">
                        <Eraser className="w-4 h-4 text-red-400 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-red-400">Clear Sandbox</p>
                          <p className="text-[10px] text-muted-foreground">Wipe all local cache (theme, settings, etc).</p>
                        </div>
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* ================= AI TEACHER TAB ================= */}
              {activeTab === 'ai-teacher' && (
                <div className="space-y-4">
                  {/* Credits & Status Banner */}
                  <div className="glass-card rounded-2xl p-5 lg:p-6 border border-primary/20 bg-gradient-to-br from-primary/10 via-background to-secondary/20">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-emerald-500 flex items-center justify-center shadow-lg shadow-primary/20 flex-shrink-0">
                          <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-base font-bold font-display text-foreground flex items-center gap-2">
                            AI Teacher & Mentorship
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
                              Flashy
                            </span>
                          </h3>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Personalized coding explanations, mock interviews & resume review.
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => navigate('/ai-teacher')}
                        className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-md shadow-primary/25"
                      >
                        Open AI Teacher
                        <Zap className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Credit Status Bar */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5 pt-5 border-t border-border/30">
                      <div className="p-3 rounded-xl bg-secondary/30 border border-border/30">
                        <span className="text-[10px] text-muted-foreground block">Monthly Queries</span>
                        <span className="text-lg font-bold text-foreground">
                          {user?.aiCredits ?? 5} <span className="text-xs font-normal text-muted-foreground">/ 5 left</span>
                        </span>
                      </div>
                      <div className="p-3 rounded-xl bg-secondary/30 border border-border/30">
                        <span className="text-[10px] text-muted-foreground block">Next Refill</span>
                        <span className="text-lg font-bold text-foreground">1st of next month</span>
                      </div>
                      <div className="p-3 rounded-xl bg-secondary/30 border border-border/30">
                        <span className="text-[10px] text-muted-foreground block">Model Latency</span>
                        <span className="text-lg font-bold text-emerald-400">~0.4s (Ultra-Fast)</span>
                      </div>
                    </div>
                  </div>

                  {/* Teaching Modes Overview */}
                  <div className="glass-card rounded-2xl p-5 lg:p-6">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                      Available Mentorship Modes
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div
                        onClick={() => navigate('/ai-teacher')}
                        className="p-4 rounded-xl border border-border/40 bg-secondary/20 hover:border-primary/40 cursor-pointer transition-all hover:scale-[1.01]"
                      >
                        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center mb-2.5">
                          <GraduationCap className="w-4 h-4 text-primary" />
                        </div>
                        <h5 className="text-xs font-bold text-foreground mb-1">🎓 Professor Mode</h5>
                        <p className="text-[11px] text-muted-foreground leading-relaxed">
                          Grounded in CodeSage curriculum. Ask anything from lesson debugging to syntax deep-dives.
                        </p>
                      </div>

                      <div
                        onClick={() => navigate('/ai-teacher')}
                        className="p-4 rounded-xl border border-border/40 bg-secondary/20 hover:border-primary/40 cursor-pointer transition-all hover:scale-[1.01]"
                      >
                        <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center mb-2.5">
                          <Target className="w-4 h-4 text-purple-400" />
                        </div>
                        <h5 className="text-xs font-bold text-foreground mb-1">💼 Mock Interviewer</h5>
                        <p className="text-[11px] text-muted-foreground leading-relaxed">
                          Timed scenario-based questions to prepare you for frontend, backend, or DSA job rounds.
                        </p>
                      </div>

                      <div
                        onClick={() => navigate('/ai-teacher')}
                        className="p-4 rounded-xl border border-border/40 bg-secondary/20 hover:border-primary/40 cursor-pointer transition-all hover:scale-[1.01]"
                      >
                        <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center mb-2.5">
                          <BookOpen className="w-4 h-4 text-blue-400" />
                        </div>
                        <h5 className="text-xs font-bold text-foreground mb-1">📄 Resume Counselor</h5>
                        <p className="text-[11px] text-muted-foreground leading-relaxed">
                          Upload your resume to get keyword analysis, portfolio ideas, and targeted hiring advice.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ================= ACCOUNT TAB ================= */}
              {activeTab === 'account' && (
                <div className="glass-card rounded-2xl p-5 lg:p-6 border border-red-500/20 bg-red-500/5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                      <ShieldCheck className="w-5 h-5 text-red-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold font-display text-foreground">Account Security</h3>
                      <p className="text-[10px] text-muted-foreground">Manage your session and account data.</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <button onClick={async () => { await logout(); navigate('/auth'); }} className="w-full glass-card rounded-xl p-4 text-left flex items-center gap-3 text-foreground hover:bg-secondary/20 transition-all text-sm border border-border/30">
                      <LogOut className="w-4 h-4 text-muted-foreground" /> Log Out
                    </button>
                    <button onClick={handleDelete} className="w-full glass-card rounded-xl p-4 text-left flex items-center gap-3 text-red-400 hover:bg-red-500/10 transition-colors text-sm border border-red-500/20">
                      <Trash2 className="w-4 h-4" /> Delete Account
                    </button>
                  </div>
                </div>
              )}

              {/* ================= GLOBAL FOOTER ================= */}
              <div className="text-center pt-6 pb-4 space-y-3 border-t border-border/20 mt-6">
                <div className="flex items-center justify-center gap-3 text-[10px] font-mono text-muted-foreground flex-wrap">
                  <button onClick={() => navigate('/terms')} className="hover:text-primary transition-colors">Terms & Policy</button>
                  <span className="text-muted-foreground/50">·</span>
                  <button onClick={() => navigate('/privacy')} className="hover:text-primary transition-colors">Privacy</button>
                  <span className="text-muted-foreground/50">·</span>
                  <button onClick={() => navigate('/cookie-policy')} className="hover:text-primary transition-colors">Cookie Policy</button>
                  <span className="text-muted-foreground/50">·</span>
                  <button onClick={() => navigate('/contact')} className="hover:text-primary transition-colors">Contact Admin</button>
                </div>
                <p className="text-[10px] text-muted-foreground font-mono tracking-wider opacity-60">CodeSage · v2.0.0</p>
              </div>

            </motion.div>
          </AnimatePresence>
        </div>

        {/* ================= MODALS ================= */}
        {showAvatarPicker && user && (
          <AvatarPicker userId={user.id} initialSeed={user.username || user.id.slice(0, 8)} onClose={() => setShowAvatarPicker(false)} onSave={(url) => setAvatarUrl(url)} />
        )}

        {detailModal && user && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setDetailModal(null)}>
            <div className="glass-card w-full max-w-md rounded-2xl p-5 space-y-3 max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-display font-bold text-foreground flex items-center gap-2">
                  {detailModal === 'lessons' && <><BookOpen className="w-4 h-4 text-primary" /> Lessons by Track</>}
                  {detailModal === 'progress' && <><BarChart3 className="w-4 h-4 text-primary" /> Progress by Track</>}
                  {detailModal === 'xp' && <><Zap className="w-4 h-4 text-primary" /> XP Breakdown</>}
                </h3>
                <button onClick={() => setDetailModal(null)} className="text-muted-foreground hover:text-foreground p-1"><X className="w-4 h-4" /></button>
              </div>
              {detailModal === 'lessons' && (
                <div className="space-y-1.5">
                  {lessonGroups.map(g => (
                    <div key={g.key} className="flex items-center justify-between bg-secondary/20 rounded-lg px-3 py-2 border border-border/20">
                      <span className="text-xs text-foreground min-w-0 flex-1 mr-2 break-words">{g.label}</span>
                      <span className="text-xs text-primary font-mono font-bold flex-shrink-0">{g.count}</span>
                    </div>
                  ))}
                  <p className="text-[10px] text-muted-foreground text-center pt-2">Total: {completedCount} lessons completed</p>
                </div>
              )}
              {detailModal === 'progress' && (
                <div className="space-y-2">
                  {lessonGroups.filter(g => g.total > 0).map(g => {
                    const pct = Math.min(100, Math.round((g.count / g.total) * 100));
                    return (
                      <div key={g.key}>
                        <div className="flex items-center justify-between text-[11px] mb-1">
                          <span className="text-foreground min-w-0 flex-1 mr-2 break-words">{g.label}</span>
                          <span className="text-primary font-mono flex-shrink-0">{g.count}/{g.total} · {pct}%</span>
                        </div>
                        <div className="h-1.5 bg-secondary/40 rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                  <div className="pt-3 border-t border-border/20 grid grid-cols-3 gap-2 text-center">
                    <div className="bg-secondary/20 rounded-lg p-2"><p className="text-sm font-bold text-primary font-mono">{lessonGroups.find(g => g.key === 'challenges')?.count || 0}</p><p className="text-[9px] text-muted-foreground">Challenges</p></div>
                    <div className="bg-secondary/20 rounded-lg p-2"><p className="text-sm font-bold text-primary font-mono">{user.completedTests?.length || 0}</p><p className="text-[9px] text-muted-foreground">Exams</p></div>
                    <div className="bg-secondary/20 rounded-lg p-2"><p className="text-sm font-bold text-primary font-mono">{lessonGroups.find(g => g.key === 'crawler')?.count || 0}</p><p className="text-[9px] text-muted-foreground">Crawler</p></div>
                  </div>
                </div>
              )}
              {detailModal === 'xp' && (
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <div className="flex items-baseline gap-2 bg-secondary/20 rounded-lg p-3"><span className="text-2xl font-bold text-primary font-mono">{user.xp || 0}</span><span className="text-[10px] text-muted-foreground">Lifetime XP</span></div>
                    <div className="flex items-baseline gap-2 bg-yellow-500/10 rounded-lg p-3 border border-yellow-500/20"><span className="text-2xl font-bold text-yellow-400 font-mono">{user.sageCoins || 0}</span><span className="text-[10px] text-muted-foreground">Sage Coins</span></div>
                  </div>
                  <p className="text-[11px] text-muted-foreground font-semibold">How you earn rewards:</p>
                  <ul className="space-y-1 text-[11px]">
                    <li className="flex justify-between bg-secondary/15 rounded-lg px-3 py-1.5"><span className="min-w-0 flex-1 mr-2 break-words">Lessons completed</span><span className="font-mono text-primary flex-shrink-0">+1 XP & +2 Coins</span></li>
                    <li className="flex justify-between bg-secondary/15 rounded-lg px-3 py-1.5"><span className="min-w-0 flex-1 mr-2 break-words">Exams passed (≥70%)</span><span className="font-mono text-primary flex-shrink-0">+3 Coins</span></li>
                    <li className="flex justify-between bg-secondary/15 rounded-lg px-3 py-1.5"><span className="min-w-0 flex-1 mr-2 break-words">Challenges solved</span><span className="font-mono text-primary flex-shrink-0">+2 to +10 Coins (by tier)</span></li>
                    <li className="flex justify-between bg-secondary/15 rounded-lg px-3 py-1.5"><span className="min-w-0 flex-1 mr-2 break-words">Code Crawler</span><span className="font-mono text-primary flex-shrink-0">Variable based on score</span></li>
                  </ul>
                  <div className="bg-primary/10 border border-primary/20 rounded-lg p-2 mt-2"><p className="text-[10px] text-primary text-center font-semibold">💡 Spend 5 Coins for extra lessons or 2 Coins to revive in Crawler!</p></div>
                </div>
              )}
            </div>
          </div>
        )}

        {showEditModal && user && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4"
            onClick={() => {
              setShowEditModal(false);
              setGoalDropdownOpen(false);
              setExpDropdownOpen(false);
            }}
          >
            <div
              className="glass-card w-full max-w-md rounded-2xl p-5 sm:p-6 space-y-4 border border-primary/30 shadow-[0_20px_60px_rgba(0,0,0,0.8)] relative"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-2 border-b border-border/40">
                <h3 className="text-sm sm:text-base font-display font-bold text-foreground flex items-center gap-2">
                  <Pencil className="w-4 h-4 text-primary" /> Edit Profile
                </h3>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setGoalDropdownOpen(false);
                    setExpDropdownOpen(false);
                  }}
                  className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-secondary/40 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3.5">
                <div>
                  <label className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1.5 block font-mono">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={editData.name}
                    onChange={e => setEditData({ ...editData, name: e.target.value })}
                    className="w-full bg-secondary/30 border border-border/50 rounded-xl px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/40 transition-all font-sans"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1.5 block font-mono">
                    Current Stage / Studying
                  </label>
                  <input
                    type="text"
                    value={editData.studying}
                    onChange={e => setEditData({ ...editData, studying: e.target.value })}
                    className="w-full bg-secondary/30 border border-border/50 rounded-xl px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/40 transition-all font-sans"
                    placeholder="e.g. CS Student, Self-Taught Developer"
                  />
                </div>

                {/* Custom Goal Dropdown */}
                <div className="relative">
                  <label className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1.5 block font-mono">
                    Engineering Goal
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setGoalDropdownOpen(!goalDropdownOpen);
                      setExpDropdownOpen(false);
                    }}
                    className={`w-full bg-secondary/30 hover:bg-secondary/50 border rounded-xl px-3.5 py-2.5 text-sm text-foreground flex items-center justify-between transition-all focus:outline-none focus:ring-1 focus:ring-primary/40 ${
                      goalDropdownOpen ? 'border-primary shadow-[0_0_15px_hsl(145,90%,55%,0.15)] ring-1 ring-primary/40' : 'border-border/50 hover:border-primary/40'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-semibold text-foreground truncate">
                        {GOAL_OPTIONS.find(g => g.id === editData.goal)?.label || 'All-Round Explorer'}
                      </span>
                      {GOAL_OPTIONS.find(g => g.id === editData.goal)?.badge && (
                        <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold rounded bg-primary/20 text-primary border border-primary/30 shrink-0">
                          {GOAL_OPTIONS.find(g => g.id === editData.goal)?.badge}
                        </span>
                      )}
                    </div>
                    <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 shrink-0 ${goalDropdownOpen ? 'rotate-180 text-primary' : ''}`} />
                  </button>

                  {goalDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1.5 z-40 p-1.5 rounded-xl bg-card border border-primary/40 shadow-[0_12px_40px_rgba(0,0,0,0.7)] backdrop-blur-2xl max-h-56 overflow-y-auto space-y-1">
                      {GOAL_OPTIONS.map(opt => {
                        const isSelected = editData.goal === opt.id;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => {
                              setEditData(prev => ({ ...prev, goal: opt.id }));
                              setGoalDropdownOpen(false);
                            }}
                            className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-all ${
                              isSelected
                                ? 'bg-primary/15 text-primary border border-primary/30 shadow-sm'
                                : 'hover:bg-secondary/70 text-foreground border border-transparent'
                            }`}
                          >
                            <div className="min-w-0 pr-2">
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-semibold">{opt.label}</span>
                                {opt.badge && (
                                  <span className="px-1 py-0.2 text-[8px] font-mono font-bold rounded bg-primary/20 text-primary">
                                    {opt.badge}
                                  </span>
                                )}
                              </div>
                              <p className="text-[10px] text-muted-foreground truncate mt-0.5">{opt.desc}</p>
                            </div>
                            {isSelected && <Check className="w-4 h-4 text-primary shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Custom Experience Dropdown */}
                <div className="relative">
                  <label className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1.5 block font-mono">
                    Experience Level
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setExpDropdownOpen(!expDropdownOpen);
                      setGoalDropdownOpen(false);
                    }}
                    className={`w-full bg-secondary/30 hover:bg-secondary/50 border rounded-xl px-3.5 py-2.5 text-sm text-foreground flex items-center justify-between transition-all focus:outline-none focus:ring-1 focus:ring-primary/40 ${
                      expDropdownOpen ? 'border-primary shadow-[0_0_15px_hsl(145,90%,55%,0.15)] ring-1 ring-primary/40' : 'border-border/50 hover:border-primary/40'
                    }`}
                  >
                    <span className="font-semibold text-foreground truncate">
                      {EXPERIENCE_OPTIONS.find(e => e.id === editData.experienceLevel)?.label || 'Beginner'}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 shrink-0 ${expDropdownOpen ? 'rotate-180 text-primary' : ''}`} />
                  </button>

                  {expDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1.5 z-40 p-1.5 rounded-xl bg-card border border-primary/40 shadow-[0_12px_40px_rgba(0,0,0,0.7)] backdrop-blur-2xl space-y-1">
                      {EXPERIENCE_OPTIONS.map(opt => {
                        const isSelected = editData.experienceLevel === opt.id;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => {
                              setEditData(prev => ({ ...prev, experienceLevel: opt.id }));
                              setExpDropdownOpen(false);
                            }}
                            className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-all ${
                              isSelected
                                ? 'bg-primary/15 text-primary border border-primary/30 shadow-sm'
                                : 'hover:bg-secondary/70 text-foreground border border-transparent'
                            }`}
                          >
                            <div className="min-w-0 pr-2">
                              <span className="text-xs font-semibold">{opt.label}</span>
                              <p className="text-[10px] text-muted-foreground truncate mt-0.5">{opt.desc}</p>
                            </div>
                            {isSelected && <Check className="w-4 h-4 text-primary shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={() => {
                  if (user) {
                    updateUser({
                      name: editData.name,
                      studying: editData.studying,
                      goal: editData.goal,
                      experienceLevel: editData.experienceLevel,
                    });
                    syncGoalWithDashboard(editData.goal, user.id);
                  }
                  toast.success('Profile updated successfully!');
                  setShowEditModal(false);
                  setGoalDropdownOpen(false);
                  setExpDropdownOpen(false);
                }}
                className="w-full bg-primary text-primary-foreground font-bold rounded-xl py-2.5 mt-2 hover:opacity-90 transition-opacity text-sm shadow-[0_0_20px_hsl(145,90%,55%,0.2)]"
              >
                Save Changes
              </button>
            </div>
          </div>
        )}

        {user && showStreakModal && (
          <StreakModal key={Date.now()} streakCount={user.streakCount} forceOpen={true} onClose={() => setShowStreakModal(false)} />
        )}

      </motion.div>
    </div>
  );
};

/* ============================================================ */
/* Sub components                                               */
/* ============================================================ */

function EnrollmentSection({
  activeEnroll,
  pausedEnroll,
  doPause,
  doResume,
  doEnd,
}: {
  activeEnroll: Enrollment[];
  pausedEnroll: Enrollment[];
  doPause: (t: TrackId) => void;
  doResume: (t: TrackId) => void;
  doEnd: (t: TrackId) => void;
}) {
  const { user } = useUser();
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="glass-card rounded-2xl p-5 lg:p-6">
      <button onClick={() => setExpanded(!expanded)} className="w-full flex items-center justify-between gap-2 text-left">
        <span className="flex items-center gap-2 min-w-0">
          <GraduationCap className="w-4 h-4 text-primary flex-shrink-0" />
          <span className="text-sm font-bold font-display truncate">My Enrollments</span>
          <span className="text-[10px] font-mono text-muted-foreground bg-secondary/50 px-1.5 py-0.5 rounded-full flex-shrink-0">
            {activeEnroll.length}/2 active
          </span>
        </span>
        <span className="flex items-center gap-1 text-xs text-primary font-semibold flex-shrink-0">
          {expanded ? 'Hide' : 'Manage'}
          <motion.span animate={{ rotate: expanded ? 180 : 0 }} className="inline-flex">
            <ChevronDown className="w-4 h-4" />
          </motion.span>
        </span>
      </button>
      <p className="text-[10px] text-muted-foreground mt-1 mb-3">
        Up to <strong>2 active tracks</strong> at a time. Pause to free a slot, or end to un-enroll (progress stays).
      </p>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="enroll-body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="overflow-hidden space-y-3"
          >
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-display mb-2">Active · {activeEnroll.length}/2</p>
              {activeEnroll.length === 0 ? (
                <p className="text-[11px] text-muted-foreground bg-secondary/15 rounded-lg px-3 py-2 border border-border/20">No active tracks. Pick one from the Roadmap to start.</p>
              ) : (
                <div className="space-y-2">
                  {activeEnroll.map(e => {
                    const trackKey = e.track as unknown as LessonTrackKey;
                    const isCompleted = isTrackCompleted(trackKey, user?.completedLessons || []);
                    return (
                      <div key={e.track} className="flex items-center justify-between gap-2 bg-primary/5 rounded-xl px-3 py-2 border border-primary/20">
                        <div className="min-w-0">
                          <p className="text-xs font-display font-semibold text-foreground truncate">{TRACK_META[e.track]?.label || e.track}</p>
                          {isCompleted ? (
                            <span className="text-[10px] text-amber-400 font-mono font-semibold flex items-center gap-1">
                              🏆 Completed
                            </span>
                          ) : (
                            <p className="text-[10px] text-primary font-mono">Active</p>
                          )}
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button onClick={() => doPause(e.track)} className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-lg bg-amber-500/15 text-amber-400 border border-amber-500/30 hover:bg-amber-500/25">
                            <PauseCircle className="w-3 h-3" /> Pause
                          </button>
                          <button onClick={() => doEnd(e.track)} className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-lg bg-destructive/15 text-destructive border border-destructive/30 hover:bg-destructive/25">
                            <StopCircle className="w-3 h-3" /> End
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {pausedEnroll.length > 0 && (
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-display mb-2">Paused · {pausedEnroll.length}</p>
                <div className="space-y-2">
                  {pausedEnroll.map(e => (
                    <div key={e.track} className="flex items-center justify-between gap-2 bg-secondary/20 rounded-xl px-3 py-2 border border-border/30">
                      <div className="min-w-0">
                        <p className="text-xs font-display font-semibold text-foreground truncate">{TRACK_META[e.track]?.label || e.track}</p>
                        <p className="text-[10px] text-amber-400 font-mono">Paused</p>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button onClick={() => doResume(e.track)} disabled={activeEnroll.length >= 2} className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-lg bg-primary/15 text-primary border border-primary/30 hover:bg-primary/25 disabled:opacity-40 disabled:cursor-not-allowed">
                          <ResumeIcon className="w-3 h-3" /> Resume
                        </button>
                        <button onClick={() => doEnd(e.track)} className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-lg bg-destructive/15 text-destructive border border-destructive/30 hover:bg-destructive/25">
                          <StopCircle className="w-3 h-3" /> End
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-start py-2 border-b border-border/20 last:border-0 gap-2 w-full min-w-0 box-border overflow-hidden">
      <span className="text-xs text-muted-foreground flex-shrink-0 mt-0.5">{label}</span>
      <span className="text-[10px] sm:text-xs text-foreground font-medium font-mono text-right flex-1 min-w-0 max-w-[170px] sm:max-w-[250px] [overflow-wrap:anywhere] break-all leading-tight">
        {value || '—'}
      </span>
    </div>
  );
}

export default SettingsPage;
