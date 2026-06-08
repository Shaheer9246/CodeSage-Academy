import { useNavigate } from 'react-router-dom';
import { useUser, type UserProfile } from '@/contexts/UserContext';
import { User, Flame, Trophy, Trash2, LogOut, Moon, Sun, Check, Lock, Target, Zap, Palette, Wrench, Download, RefreshCw, PlayCircle, Eraser } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getAllLessons } from '@/data/lessons';
import { motion } from 'framer-motion';
import { applyTheme, getTheme, THEMES, ThemeName } from '@/lib/theme';
import { Switch } from '@/components/ui/switch';
import { resetGuestLessons } from '@/lib/guestGate';
import JSZip from 'jszip';
import { toast } from 'sonner';

type Achievement = {
  id: string;
  label: string;
  icon: string;
  description: string;
  check: (u: UserProfile) => boolean;
};

const BADGE_INFO: Record<string, { icon: string; label: string }> = {
  'lite': { icon: '🌱', label: 'Lite Coder' },
  'silver': { icon: '🥈', label: 'Silver Coder' },
  'gold': { icon: '🥇', label: 'Gold Coder' },
  'premium': { icon: '💎', label: 'Premium Coder' },
  'elite': { icon: '👑', label: 'Elite Coder' },
  'test-passer': { icon: '📜', label: 'Test Ace' },
  'streak-3': { icon: '🔥', label: '3-Day Streak' },
  'streak-7': { icon: '⚡', label: '7-Day Streak' },
  'streak-30': { icon: '🏆', label: '30-Day Streak' },
  'html-hero': { icon: '🛡️', label: 'HTML Hero' },
  'js-jedi': { icon: '⚡', label: 'JS Jedi' },
  'css-wizard': { icon: '🎨', label: 'CSS Wizard' },
};

const ACHIEVEMENTS: Achievement[] = [
  { id: 'first-lesson', label: 'First Lesson', icon: '🎯', description: 'Complete your first lesson', check: u => u.completedLessons.length >= 1 },
  { id: 'five-lessons', label: '5 Lessons', icon: '📚', description: 'Complete 5 lessons', check: u => u.completedLessons.length >= 5 },
  { id: 'ten-lessons', label: '10 Lessons', icon: '🏅', description: 'Complete 10 lessons', check: u => u.completedLessons.length >= 10 },
  { id: 'streak-3', label: '3-Day Streak', icon: '🔥', description: 'Maintain a 3-day streak', check: u => u.streakCount >= 3 },
  { id: 'streak-7', label: '7-Day Streak', icon: '⚡', description: '7 days in a row', check: u => u.streakCount >= 7 },
  { id: 'test-pass', label: 'Test Ace', icon: '📜', description: 'Pass a level test', check: u => u.completedTests?.length >= 1 },
  { id: 'all-html', label: 'HTML Master', icon: '📄', description: 'Complete all HTML lessons', check: u => u.completedLessons.filter(l => l.startsWith('html')).length >= 6 },
  { id: 'all-css', label: 'CSS Wizard', icon: '🎨', description: 'Complete all CSS lessons', check: u => u.completedLessons.filter(l => l.startsWith('css')).length >= 6 },
];

const SettingsPage = () => {
  const navigate = useNavigate();
  const { user, logout, deleteAccount, resetTour } = useUser();
  const [theme, setTheme] = useState<ThemeName>('dark');
  const [autoRun, setAutoRun] = useState<boolean>(() => {
    try { return localStorage.getItem('codesage_autorun') !== '0'; } catch { return true; }
  });

  useEffect(() => { setTheme(getTheme()); }, []);
  useEffect(() => {
    try {
      localStorage.setItem('codesage_autorun', autoRun ? '1' : '0');
    } catch (error) {
      console.warn('Failed to persist autoRun setting', error);
    }
  }, [autoRun]);

  const changeTheme = (t: ThemeName) => { setTheme(t); applyTheme(t); };

  const handleReplayTour = async () => {
    await resetTour();
    navigate('/tour');
  };

  const handleResetRuntime = () => {
    if (!confirm('Reset runtime caches? Clears playground recents, snapshots, and guest progress.')) return;
    try {
      localStorage.removeItem('codesage_playground_recent');
      localStorage.removeItem('codesage_pg_multi');
      resetGuestLessons();
      toast.success('Runtime caches cleared.');
    } catch {
      toast.error('Could not clear caches.');
    }
  };

  const handleClearSandbox = () => {
    if (!confirm('Clear ALL non-account local data (theme, playground, caches)? Your account/progress stay.')) return;
    try {
      const keep = ['supabase.auth.token'];
      Object.keys(localStorage).forEach(k => { if (!keep.includes(k)) localStorage.removeItem(k); });
      toast.success('Sandbox cleared.');
    } catch (error) {
      console.warn('Could not clear sandbox localStorage', error);
    }
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
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `codesage-workspace-${Date.now()}.zip`; a.click();
      URL.revokeObjectURL(url);
      toast.success('Workspace exported.');
    } catch { toast.error('Export failed.'); }
  };

  if (!user) { navigate('/auth'); return null; }


  const joinDate = user.joinDate ? new Date(user.joinDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A';
  const totalLessons = getAllLessons().length;
  const completedCount = user.completedLessons.length;
  const progress = totalLessons ? Math.round((completedCount / totalLessons) * 100) : 0;

  // 7-day streak calendar
  const today = new Date();
  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const todayIdx = today.getDay();
  const streakDays = weekDays.map((day, i) => ({
    day,
    active: i <= todayIdx && i >= todayIdx - Math.min(user.streakCount, todayIdx),
    isToday: i === todayIdx,
  }));

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete your account? This cannot be undone.')) {
      deleteAccount();
      navigate('/auth');
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden grid-bg">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto p-4 space-y-4">
        <h1 className="text-xl font-bold font-display text-foreground">Profile & Settings</h1>

        {/* Profile Card */}
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-2xl border border-primary/20">
              👤
            </div>
            <div>
              <h2 className="text-lg font-bold font-display text-foreground">{user.name}</h2>
              <p className="text-xs text-muted-foreground font-mono">@{user.username}</p>
            </div>
          </div>
          <div className="space-y-2">
            <InfoRow label="Email" value={user.email} />
            <InfoRow label="Studying" value={user.studying} />
            <InfoRow label="Goal" value={user.goal} />
            <InfoRow label="Experience" value={user.experienceLevel} />
            <InfoRow label="Member Since" value={joinDate} />
          </div>
        </div>

        {/* Streak Section */}
        <div className="glass-card rounded-2xl p-5">
          <h3 className="text-sm font-bold font-display flex items-center gap-2 mb-3">
            <Flame className="w-4 h-4 text-primary" /> Coding Streak
          </h3>
          <div className="flex items-end gap-2 mb-3">
            <span className="text-4xl font-bold text-primary font-display neon-text">{user.streakCount}</span>
            <span className="text-sm text-muted-foreground mb-1">days</span>
          </div>
          <div className="flex gap-2 justify-center">
            {streakDays.map((d, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <span className="text-[9px] text-muted-foreground">{d.day}</span>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs ${
                  d.active ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-secondary/30 text-muted-foreground border border-border/20'
                }`}>
                  {d.active ? <Check className="w-3.5 h-3.5" /> : ''}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="glass-card rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-primary font-mono">{completedCount}</p>
            <p className="text-[10px] text-muted-foreground">Lessons</p>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-primary font-mono">{progress}%</p>
            <p className="text-[10px] text-muted-foreground">Progress</p>
          </div>
          <div className="glass-card rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-primary font-mono">{user.xp || 0}</p>
            <p className="text-[10px] text-muted-foreground">XP</p>
          </div>
        </div>

        {/* Badges */}
        <div className="glass-card rounded-2xl p-5">
          <h3 className="text-sm font-bold font-display flex items-center gap-2 mb-3">
            <Trophy className="w-4 h-4 text-primary" /> Badges
          </h3>
          {user.badges.length === 0 ? (
            <p className="text-xs text-muted-foreground">No badges yet. Start learning to earn badges!</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {user.badges.map(b => (
                <div key={b} className="flex items-center gap-1.5 bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20">
                  <span className="text-sm">{BADGE_INFO[b]?.icon || '🏅'}</span>
                  <span className="text-xs font-medium text-foreground">{BADGE_INFO[b]?.label || b}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Achievements */}
        <div className="glass-card rounded-2xl p-5">
          <h3 className="text-sm font-bold font-display flex items-center gap-2 mb-3">
            <Target className="w-4 h-4 text-primary" /> Achievements
          </h3>
          <div className="space-y-2">
            {ACHIEVEMENTS.map(ach => {
              const unlocked = ach.check(user);
              return (
                <div key={ach.id} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                  unlocked ? 'bg-primary/5 border border-primary/20' : 'bg-secondary/10 border border-border/20 opacity-50'
                }`}>
                  <span className="text-lg">{ach.icon}</span>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-foreground">{ach.label}</p>
                    <p className="text-[10px] text-muted-foreground">{ach.description}</p>
                  </div>
                  {unlocked ? <Check className="w-4 h-4 text-primary" /> : <Lock className="w-3.5 h-3.5 text-muted-foreground" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Theme Picker */}
        <div className="glass-card rounded-2xl p-5">
          <h3 className="text-sm font-bold font-display flex items-center gap-2 mb-3">
            <Palette className="w-4 h-4 text-primary" /> Appearance
          </h3>
          <p className="text-[10px] text-muted-foreground mb-3">Choose a theme — applies across the whole app.</p>
          <div className="grid grid-cols-2 gap-2">
            {THEMES.map(t => {
              const active = theme === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => changeTheme(t.id)}
                  className={`flex items-center gap-2 p-3 rounded-xl border transition-all text-left ${
                    active ? 'border-primary bg-primary/10 neon-border' : 'border-border/30 bg-secondary/20 hover:border-primary/30'
                  }`}
                >
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
        <div className="glass-card rounded-2xl p-5">
          <h3 className="text-sm font-bold font-display flex items-center gap-2 mb-3">
            <Wrench className="w-4 h-4 text-primary" /> Power Tools
          </h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between bg-secondary/15 rounded-xl px-3 py-2.5 border border-border/30">
              <div className="min-w-0">
                <p className="text-xs font-semibold text-foreground">Auto-Run Preview</p>
                <p className="text-[10px] text-muted-foreground">Live preview refreshes as you type in Playground.</p>
              </div>
              <Switch checked={autoRun} onCheckedChange={setAutoRun} />
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

        {/* Actions */}
        <div className="space-y-2">
          <button onClick={async () => { await logout(); navigate('/auth'); }}
            className="w-full glass-card rounded-xl p-4 text-left flex items-center gap-3 text-foreground hover:bg-secondary/20 transition-all text-sm">
            <LogOut className="w-4 h-4 text-muted-foreground" /> Log Out
          </button>
          <button onClick={handleDelete}
            className="w-full glass-card rounded-xl p-4 text-left flex items-center gap-3 text-red-400 hover:bg-red-500/5 transition-colors text-sm border border-red-500/20">
            <Trash2 className="w-4 h-4" /> Delete Account
          </button>
        </div>
      </motion.div>
    </div>
  );
};

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-border/20 last:border-0">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-xs text-foreground font-medium font-mono">{value || '—'}</span>
    </div>
  );
}

export default SettingsPage;
