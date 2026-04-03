import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { Code2, BookOpen, Trophy, Flame, Settings, Lock, Zap, Brain, Server, Code, ArrowRight, Star } from 'lucide-react';
import { getAllLessons } from '@/data/lessons';
import { useState } from 'react';

const BADGE_INFO: Record<string, { icon: string; label: string }> = {
  'first-lesson': { icon: '🎯', label: 'First Lesson' },
  'five-lessons': { icon: '⭐', label: '5 Lessons' },
  'ten-lessons': { icon: '🏆', label: '10 Lessons' },
  'quarter-century': { icon: '💎', label: '25 Lessons' },
  'test-passer': { icon: '📜', label: 'Test Passer' },
  'week-streak': { icon: '🔥', label: '7-Day Streak' },
  'month-streak': { icon: '💪', label: '30-Day Streak' },
};

const Dashboard = () => {
  const { user, updateStreak, applyPromoCode } = useUser();
  const navigate = useNavigate();
  const [promoInput, setPromoInput] = useState('');
  const [promoMsg, setPromoMsg] = useState('');

  if (!user) { navigate('/auth'); return null; }
  if (!user.name) { navigate('/onboarding'); return null; }

  // Update streak on visit
  updateStreak();

  const totalLessons = getAllLessons().length;
  const completedCount = user.completedLessons.length;
  const progress = totalLessons ? Math.round((completedCount / totalLessons) * 100) : 0;

  const handlePromo = () => {
    if (applyPromoCode(promoInput)) {
      setPromoMsg('✅ Code applied successfully!');
      setPromoInput('');
    } else {
      setPromoMsg('❌ Invalid promo code');
    }
    setTimeout(() => setPromoMsg(''), 3000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
            <Code2 className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground font-mono">CodeSage</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-primary">
            <Flame className="w-5 h-5" />
            <span className="font-bold text-sm">{user.streakCount}</span>
          </div>
          <button onClick={() => navigate('/settings')} className="text-muted-foreground hover:text-foreground transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6">
        {/* Welcome */}
        <div className="bg-card border border-border rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Welcome back, {user.name}! 👋</h1>
              <p className="text-muted-foreground text-sm mt-1">Your coding journey continues</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Overall Progress</p>
              <p className="text-2xl font-bold text-primary">{progress}%</p>
            </div>
          </div>
          <div className="mt-4 w-full h-2 bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Code Editor */}
          <DashCard
            icon={<Code className="w-6 h-6" />}
            title="Code Playground"
            desc="Write & preview code instantly"
            color="from-primary to-primary/70"
            onClick={() => navigate('/playground')}
          />

          {/* Learn */}
          <DashCard
            icon={<BookOpen className="w-6 h-6" />}
            title={completedCount > 0 ? 'Continue Learning' : 'Start Learning'}
            desc={`${completedCount}/${totalLessons} lessons completed`}
            color="from-accent to-accent/70"
            onClick={() => navigate('/learn')}
          />

          {/* Challenges */}
          <DashCard
            icon={<Trophy className="w-6 h-6" />}
            title="Challenges"
            desc="Test your skills with coding challenges"
            color="from-warning to-warning/70"
            onClick={() => navigate('/challenges')}
          />

          {/* Backend - locked */}
          <DashCard
            icon={<Server className="w-6 h-6" />}
            title="Backend"
            desc={user.unlockedSections.includes('backend') ? 'Node.js & SQL' : 'Complete frontend or enter promo code'}
            color="from-info to-info/70"
            locked={!user.unlockedSections.includes('backend')}
            onClick={() => {}}
          />

          {/* AI - locked */}
          <DashCard
            icon={<Brain className="w-6 h-6" />}
            title="AI Integration"
            desc={user.unlockedSections.includes('ai') ? 'Python & TensorFlow' : 'Complete frontend or enter promo code'}
            color="from-destructive to-destructive/70"
            locked={!user.unlockedSections.includes('ai')}
            onClick={() => {}}
          />

          {/* Python - coming soon */}
          <DashCard
            icon={<Zap className="w-6 h-6" />}
            title="Python"
            desc="Coming Soon"
            color="from-success to-success/70"
            locked
            onClick={() => {}}
          />
        </div>

        {/* Streaks & Badges */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {/* Streak */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
              <Flame className="w-5 h-5 text-primary" /> Streak
            </h3>
            <div className="flex items-center gap-4">
              <div className="text-5xl">🔥</div>
              <div>
                <p className="text-3xl font-bold text-primary">{user.streakCount}-day</p>
                <p className="text-sm text-muted-foreground">Keep learning daily!</p>
              </div>
            </div>
          </div>

          {/* Badges */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
              <Star className="w-5 h-5 text-primary" /> Badges
            </h3>
            {user.badges.length === 0 ? (
              <p className="text-sm text-muted-foreground">Complete lessons to earn badges!</p>
            ) : (
              <div className="flex flex-wrap gap-3">
                {user.badges.map(b => (
                  <div key={b} className="flex items-center gap-1.5 bg-secondary px-3 py-1.5 rounded-full">
                    <span>{BADGE_INFO[b]?.icon || '🏅'}</span>
                    <span className="text-xs font-medium text-foreground">{BADGE_INFO[b]?.label || b}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Promo Code */}
        <div className="bg-card border border-border rounded-2xl p-6 mt-4">
          <h3 className="text-sm font-semibold text-foreground mb-3">Have a promo code?</h3>
          <div className="flex gap-2">
            <input
              value={promoInput}
              onChange={e => setPromoInput(e.target.value)}
              placeholder="Enter promo code"
              className="flex-1 bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <button onClick={handlePromo} className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90">
              Apply
            </button>
          </div>
          {promoMsg && <p className="text-sm mt-2">{promoMsg}</p>}
        </div>
      </div>
    </div>
  );
};

function DashCard({ icon, title, desc, color, onClick, locked }: {
  icon: React.ReactNode; title: string; desc: string; color: string; onClick: () => void; locked?: boolean;
}) {
  return (
    <button
      onClick={locked ? undefined : onClick}
      className={`relative bg-card border border-border rounded-2xl p-6 text-left hover:border-primary/30 transition-all group ${locked ? 'opacity-60 cursor-not-allowed' : ''}`}
    >
      {locked && (
        <div className="absolute top-3 right-3">
          <Lock className="w-4 h-4 text-muted-foreground" />
        </div>
      )}
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-primary-foreground mb-3`}>
        {icon}
      </div>
      <h3 className="font-semibold text-foreground">{title}</h3>
      <p className="text-xs text-muted-foreground mt-1">{desc}</p>
      {!locked && (
        <ArrowRight className="w-4 h-4 text-muted-foreground absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity" />
      )}
    </button>
  );
}

export default Dashboard;
