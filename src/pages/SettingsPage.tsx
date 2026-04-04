import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { ArrowLeft, User, Calendar, Flame, Trophy, Trash2, LogOut } from 'lucide-react';

const BADGE_INFO: Record<string, { icon: string; label: string }> = {
  'first-lesson': { icon: '🎯', label: 'First Lesson' },
  'five-lessons': { icon: '⭐', label: '5 Lessons' },
  'ten-lessons': { icon: '🏆', label: '10 Lessons' },
  'quarter-century': { icon: '💎', label: '25 Lessons' },
  'test-passer': { icon: '📜', label: 'Test Passer' },
  'week-streak': { icon: '🔥', label: '7-Day Streak' },
  'month-streak': { icon: '💪', label: '30-Day Streak' },
};

const SettingsPage = () => {
  const navigate = useNavigate();
  const { user, logout, deleteAccount } = useUser();

  if (!user) { navigate('/auth'); return null; }

  const joinDate = user.joinDate ? new Date(user.joinDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A';

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete your account? This cannot be undone.')) {
      deleteAccount();
      navigate('/auth');
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="glow-orb glow-accent w-48 h-48 top-20 -right-10 opacity-20" />

      <header className="border-b border-border glass-card px-4 sm:px-6 py-3 flex items-center gap-3 relative z-10">
        <button onClick={() => navigate('/dashboard')} className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="text-base font-bold text-foreground font-mono">Settings</span>
      </header>

      <div className="max-w-2xl mx-auto p-4 sm:p-6 space-y-4 relative z-10">
        {/* Profile */}
        <div className="glass-card rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-4">
            <User className="w-4 h-4 text-primary" /> Profile
          </h3>
          <div className="space-y-2">
            <InfoRow label="Username" value={user.username} />
            <InfoRow label="Name" value={user.name} />
            <InfoRow label="Email" value={user.email} />
            <InfoRow label="Studying" value={user.studying} />
            <InfoRow label="Goal" value={user.goal} />
            <InfoRow label="Experience" value={user.experienceLevel} />
          </div>
        </div>

        {/* Stats */}
        <div className="glass-card rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-4">
            <Flame className="w-4 h-4 text-primary" /> Stats
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-secondary/40 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-primary font-mono">{user.streakCount}</p>
              <p className="text-[10px] text-muted-foreground">Day Streak</p>
            </div>
            <div className="bg-secondary/40 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-primary font-mono">{user.completedLessons.length}</p>
              <p className="text-[10px] text-muted-foreground">Lessons Done</p>
            </div>
          </div>
        </div>

        {/* Badges */}
        <div className="glass-card rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-4">
            <Trophy className="w-4 h-4 text-primary" /> Badges
          </h3>
          {user.badges.length === 0 ? (
            <p className="text-xs text-muted-foreground">No badges yet. Start learning to earn badges!</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {user.badges.map(b => (
                <div key={b} className="flex items-center gap-1.5 bg-secondary/50 px-3 py-1.5 rounded-full">
                  <span className="text-sm">{BADGE_INFO[b]?.icon || '🏅'}</span>
                  <span className="text-xs font-medium text-foreground">{BADGE_INFO[b]?.label || b}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Account */}
        <div className="glass-card rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
            <Calendar className="w-4 h-4 text-primary" /> Account
          </h3>
          <p className="text-xs text-muted-foreground">Member since: <span className="text-foreground font-medium">{joinDate}</span></p>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <button onClick={() => { logout(); navigate('/auth'); }} className="w-full glass-card rounded-xl p-4 text-left flex items-center gap-3 text-foreground hover:border-primary/20 transition-colors text-sm">
            <LogOut className="w-4 h-4 text-muted-foreground" /> Log Out
          </button>
          <button onClick={handleDelete} className="w-full glass-card rounded-xl p-4 text-left flex items-center gap-3 text-destructive hover:bg-destructive/5 transition-colors text-sm border border-destructive/20">
            <Trash2 className="w-4 h-4" /> Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-border/50 last:border-0">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-xs text-foreground font-medium">{value || '—'}</span>
    </div>
  );
}

export default SettingsPage;
