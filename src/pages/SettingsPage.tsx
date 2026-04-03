import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { ArrowLeft, Code2, User, Calendar, Flame, Trophy, Trash2, LogOut } from 'lucide-react';

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
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card px-6 py-3 flex items-center gap-3">
        <button onClick={() => navigate('/dashboard')} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <Code2 className="w-5 h-5 text-primary" />
        <span className="text-lg font-bold text-foreground">Settings</span>
      </header>

      <div className="max-w-2xl mx-auto p-6 space-y-6">
        {/* Profile */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-primary" /> Profile
          </h3>
          <div className="space-y-3 text-sm">
            <InfoRow label="Username" value={user.username} />
            <InfoRow label="Name" value={user.name} />
            <InfoRow label="Email" value={user.email} />
            <InfoRow label="Studying" value={user.studying} />
            <InfoRow label="Goal" value={user.goal} />
            <InfoRow label="Experience" value={user.experienceLevel} />
          </div>
        </div>

        {/* Stats */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
            <Flame className="w-5 h-5 text-primary" /> Stats
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-secondary rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-primary">{user.streakCount}</p>
              <p className="text-xs text-muted-foreground">Day Streak</p>
            </div>
            <div className="bg-secondary rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-primary">{user.completedLessons.length}</p>
              <p className="text-xs text-muted-foreground">Lessons Done</p>
            </div>
          </div>
        </div>

        {/* Badges */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
            <Trophy className="w-5 h-5 text-primary" /> Badges
          </h3>
          {user.badges.length === 0 ? (
            <p className="text-sm text-muted-foreground">No badges yet. Start learning to earn badges!</p>
          ) : (
            <div className="flex flex-wrap gap-3">
              {user.badges.map(b => (
                <div key={b} className="flex items-center gap-2 bg-secondary px-3 py-2 rounded-xl">
                  <span className="text-lg">{BADGE_INFO[b]?.icon || '🏅'}</span>
                  <span className="text-sm font-medium text-foreground">{BADGE_INFO[b]?.label || b}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Joining */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-primary" /> Account
          </h3>
          <p className="text-sm text-muted-foreground">Member since: <span className="text-foreground">{joinDate}</span></p>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button onClick={() => { logout(); navigate('/auth'); }} className="w-full bg-card border border-border rounded-xl p-4 text-left flex items-center gap-3 text-foreground hover:border-primary/30 transition-colors">
            <LogOut className="w-5 h-5 text-muted-foreground" /> Log Out
          </button>
          <button onClick={handleDelete} className="w-full bg-card border border-destructive/30 rounded-xl p-4 text-left flex items-center gap-3 text-destructive hover:bg-destructive/5 transition-colors">
            <Trash2 className="w-5 h-5" /> Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-border last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-foreground">{value || '—'}</span>
    </div>
  );
}

export default SettingsPage;
