import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { BookOpen, Trophy, Flame, Settings, Lock, Brain, Server, Code, ArrowRight, Star, Zap, Sparkles } from 'lucide-react';
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

const DAILY_CHALLENGES = [
  { title: 'Build a Card Component', desc: 'Create a profile card with CSS', link: '/challenges' },
  { title: 'Style a Navigation Bar', desc: 'Make a responsive navbar', link: '/challenges' },
  { title: 'Create a Counter', desc: 'JavaScript counter with buttons', link: '/challenges' },
  { title: 'Build a Grid Gallery', desc: 'CSS Grid image gallery', link: '/challenges' },
  { title: 'Todo List App', desc: 'Add, remove, and toggle todos', link: '/challenges' },
];

const Dashboard = () => {
  const { user, updateStreak, applyPromoCode } = useUser();
  const navigate = useNavigate();
  const [promoInput, setPromoInput] = useState('');
  const [promoMsg, setPromoMsg] = useState('');

  if (!user) { navigate('/auth'); return null; }
  if (!user.name) { navigate('/onboarding'); return null; }

  updateStreak();

  const totalLessons = getAllLessons().length;
  const completedCount = user.completedLessons.length;
  const progress = totalLessons ? Math.round((completedCount / totalLessons) * 100) : 0;

  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  const dailyChallenge = DAILY_CHALLENGES[dayOfYear % DAILY_CHALLENGES.length];

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
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background orbs */}
      <div className="glow-orb glow-primary w-64 h-64 top-0 right-0 opacity-30" />
      <div className="glow-orb glow-accent w-48 h-48 bottom-1/4 left-0 opacity-20" />

      {/* Header */}
      <header className="relative z-10 border-b border-border glass-card px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
            <span className="text-xs font-bold text-primary-foreground font-mono">&lt;/&gt;</span>
          </div>
          <span className="text-lg font-bold text-foreground font-mono hidden sm:inline">CodeSage</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-primary/10 px-3 py-1.5 rounded-full">
            <Flame className="w-4 h-4 text-primary" />
            <span className="font-bold text-xs text-primary">{user.streakCount}</span>
          </div>
          <button onClick={() => navigate('/settings')} className="text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-lg hover:bg-secondary/50">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div className="relative z-10 max-w-6xl mx-auto p-4 sm:p-6 space-y-4">
        {/* Welcome Banner */}
        <div className="glass-card-strong rounded-2xl p-5 sm:p-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center text-2xl">
                👋
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-foreground">Welcome back, {user.name}!</h1>
                <p className="text-muted-foreground text-xs mt-0.5">Your coding journey continues</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Progress</p>
              <p className="text-xl font-bold text-primary font-mono">{progress}%</p>
            </div>
          </div>
          <div className="mt-4 w-full h-2 bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary via-accent to-primary rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* Code Editor */}
          <DashCard
            icon={<Code className="w-5 h-5" />}
            title="Code Playground"
            desc="Write & preview code instantly"
            gradient="from-primary/20 to-primary/5"
            iconBg="bg-primary/20"
            onClick={() => navigate('/playground')}
          />

          {/* Learn */}
          <DashCard
            icon={<BookOpen className="w-5 h-5" />}
            title={completedCount > 0 ? 'Continue Learning' : 'Start Learning'}
            desc={`${completedCount}/${totalLessons} lessons completed`}
            gradient="from-accent/20 to-accent/5"
            iconBg="bg-accent/20"
            onClick={() => navigate('/learn')}
          />

          {/* Challenges */}
          <DashCard
            icon={<Trophy className="w-5 h-5" />}
            title="Challenges"
            desc="Test your skills"
            gradient="from-warning/20 to-warning/5"
            iconBg="bg-warning/20"
            onClick={() => navigate('/challenges')}
          />

          {/* Backend - locked */}
          <DashCard
            icon={<Server className="w-5 h-5" />}
            title="Backend"
            desc={user.unlockedSections.includes('backend') ? 'Node.js & SQL' : 'Complete frontend or promo code'}
            gradient="from-info/20 to-info/5"
            iconBg="bg-info/20"
            locked={!user.unlockedSections.includes('backend')}
          />

          {/* AI - locked */}
          <DashCard
            icon={<Brain className="w-5 h-5" />}
            title="AI Integration"
            desc={user.unlockedSections.includes('ai') ? 'Python & AI' : 'Complete frontend or promo code'}
            gradient="from-destructive/20 to-destructive/5"
            iconBg="bg-destructive/20"
            locked={!user.unlockedSections.includes('ai')}
          />

          {/* Python - coming soon */}
          <DashCard
            icon={<Zap className="w-5 h-5" />}
            title="Python"
            desc="Coming Soon"
            gradient="from-success/20 to-success/5"
            iconBg="bg-success/20"
            locked
          />
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {/* Daily Challenge */}
          <div className="glass-card rounded-2xl p-5 border border-primary/20">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-primary" /> Daily Challenge
            </h3>
            <div className="bg-primary/5 rounded-xl p-4 border border-primary/10">
              <p className="text-sm font-semibold text-foreground">{dailyChallenge.title}</p>
              <p className="text-xs text-muted-foreground mt-1">{dailyChallenge.desc}</p>
              <button
                onClick={() => navigate(dailyChallenge.link)}
                className="mt-3 text-xs bg-primary/20 text-primary px-3 py-1.5 rounded-lg hover:bg-primary/30 transition-colors font-medium"
              >
                Start Challenge →
              </button>
            </div>
          </div>

          {/* Streak */}
          <div className="glass-card rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
              <Flame className="w-4 h-4 text-primary" /> Streak
            </h3>
            <div className="flex items-center gap-3">
              <div className="text-4xl">🔥</div>
              <div>
                <p className="text-2xl font-bold text-primary font-mono">{user.streakCount}</p>
                <p className="text-xs text-muted-foreground">day streak</p>
              </div>
            </div>
          </div>

          {/* Badges */}
          <div className="glass-card rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
              <Star className="w-4 h-4 text-primary" /> Badges
            </h3>
            {user.badges.length === 0 ? (
              <p className="text-xs text-muted-foreground">Complete lessons to earn badges!</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {user.badges.map(b => (
                  <div key={b} className="flex items-center gap-1 bg-secondary/60 px-2.5 py-1 rounded-full text-xs">
                    <span>{BADGE_INFO[b]?.icon || '🏅'}</span>
                    <span className="font-medium text-foreground">{BADGE_INFO[b]?.label || b}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Promo Code */}
        <div className="glass-card rounded-2xl p-5">
          <h3 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Promo Code</h3>
          <div className="flex gap-2">
            <input
              value={promoInput}
              onChange={e => setPromoInput(e.target.value)}
              placeholder="Enter promo code"
              className="flex-1 bg-secondary/60 border border-border rounded-lg px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
            <button onClick={handlePromo} className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity">
              Apply
            </button>
          </div>
          {promoMsg && <p className="text-xs mt-2">{promoMsg}</p>}
        </div>
      </div>
    </div>
  );
};

function DashCard({ icon, title, desc, gradient, iconBg, onClick, locked }: {
  icon: React.ReactNode; title: string; desc: string; gradient: string; iconBg: string; onClick?: () => void; locked?: boolean;
}) {
  return (
    <button
      onClick={locked ? undefined : onClick}
      className={`relative glass-card rounded-2xl p-5 text-left hover:border-primary/20 transition-all group ${locked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity`} />
      {locked && (
        <div className="absolute top-3 right-3 z-10">
          <Lock className="w-3.5 h-3.5 text-muted-foreground" />
        </div>
      )}
      <div className="relative z-10">
        <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center text-foreground mb-3`}>
          {icon}
        </div>
        <h3 className="font-semibold text-foreground text-sm">{title}</h3>
        <p className="text-xs text-muted-foreground mt-1">{desc}</p>
      </div>
      {!locked && (
        <ArrowRight className="w-3.5 h-3.5 text-muted-foreground absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-10" />
      )}
    </button>
  );
}

export default Dashboard;
