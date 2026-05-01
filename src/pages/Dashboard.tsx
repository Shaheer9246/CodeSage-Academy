import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { BookOpen, Trophy, Flame, Lock, Code, ArrowRight, Star, Sparkles, Zap, Target, TrendingUp } from 'lucide-react';
import { getAllLessons } from '@/data/lessons';
import { useState, useEffect } from 'react';

const BADGE_INFO: Record<string, { icon: string; label: string }> = {
  'lite': { icon: '🌱', label: 'Lite' },
  'silver': { icon: '🥈', label: 'Silver' },
  'gold': { icon: '🥇', label: 'Gold' },
  'premium': { icon: '💎', label: 'Premium' },
  'elite': { icon: '👑', label: 'Elite' },
  'test-passer': { icon: '📜', label: 'Test Ace' },
  'streak-3': { icon: '🔥', label: '3-Day' },
  'streak-7': { icon: '⚡', label: '7-Day' },
  'streak-30': { icon: '🏆', label: '30-Day' },
};

const ALL_BADGES = ['lite', 'silver', 'gold', 'premium', 'elite'];

const DAILY_CHALLENGES = [
  { title: 'Add a Heading', desc: 'Create an h1 heading with your name' },
  { title: 'Style a Button', desc: 'Create and style a colorful button' },
  { title: 'Build a List', desc: 'Create an unordered list with 5 items' },
  { title: 'Center a Div', desc: 'Center a div using CSS flexbox' },
  { title: 'Color Palette', desc: 'Create 4 colored boxes in a row' },
  { title: 'Simple Form', desc: 'Build a form with name and email' },
  { title: 'Image Card', desc: 'Create a card with image and text' },
];

const SECTIONS = [
  { id: 'frontend', label: 'Frontend', sub: 'HTML / CSS / JS', icon: '📱', section: 'frontend' },
  { id: 'backend', label: 'Backend', sub: 'Node.js / SQL', icon: '🖥️', section: 'backend' },
  { id: 'ai', label: 'AI / ML', sub: 'Python / TensorFlow', icon: '🧠', section: 'ai' },
  { id: 'ds', label: 'Data Structures', sub: 'Algorithms', icon: '🔗', section: 'ds', comingSoon: true },
  { id: 'fullstack', label: 'Full-Stack', sub: 'Projects', icon: '🚀', section: 'fullstack', comingSoon: true },
];

const Dashboard = () => {
  const { user, updateStreak, applyPromoCode } = useUser();
  const navigate = useNavigate();
  const [promoInput, setPromoInput] = useState('');
  const [promoMsg, setPromoMsg] = useState('');

  useEffect(() => { if (user) updateStreak(); }, []);

  if (!user) { navigate('/auth'); return null; }
  if (!user.name) { navigate('/onboarding'); return null; }

  const totalLessons = getAllLessons().length;
  const completedCount = user.completedLessons.length;
  const progress = totalLessons ? Math.round((completedCount / totalLessons) * 100) : 0;
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  const dailyChallenge = DAILY_CHALLENGES[dayOfYear % DAILY_CHALLENGES.length];

  const handlePromo = () => {
    if (applyPromoCode(promoInput)) { setPromoMsg('✅ Code applied!'); setPromoInput(''); }
    else setPromoMsg('❌ Invalid code');
    setTimeout(() => setPromoMsg(''), 3000);
  };

  // 7-day streak calendar
  const today = new Date();
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (6 - i));
    return { day: d.toLocaleDateString('en', { weekday: 'short' })[0], date: d.getDate(), isToday: i === 6, active: i >= 7 - user.streakCount };
  });

  return (
    <div className="min-h-screen bg-background relative overflow-hidden ambient-grid">
      {/* Subtle glow */}
      <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-primary/4 blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto p-4 sm:p-6 space-y-5 animate-fade-in">
        {/* Welcome Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">
              Welcome back, <span className="text-primary neon-text">{user.name}</span>
            </h1>
            <p className="text-xs text-muted-foreground font-mono mt-0.5">// keep building, keep learning</p>
          </div>
          <div className="flex items-center gap-2 bg-card/60 px-3 py-2 rounded-xl border border-border/40 neon-border">
            <Flame className="w-4 h-4 text-primary" />
            <span className="font-bold text-sm text-primary font-mono">{user.streakCount}</span>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3">
          <StatCard icon={<Target className="w-4 h-4 text-primary" />} label="Progress" value={`${progress}%`} />
          <StatCard icon={<BookOpen className="w-4 h-4 text-primary" />} label="Completed" value={`${completedCount}`} />
          <StatCard icon={<Star className="w-4 h-4 text-primary" />} label="Badges" value={`${user.badges.length}`} />
        </div>

        {/* Progress Bar */}
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground font-mono">overall_progress</span>
            <span className="text-xs text-primary font-mono font-bold">{progress}%</span>
          </div>
          <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all duration-700 neon-glow" style={{ width: `${Math.max(progress, 2)}%` }} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left: Tracks + Roadmap */}
          <div className="lg:col-span-2 space-y-4">
            {/* Learning Tracks */}
            <div className="glass-card rounded-xl p-4">
              <h3 className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider font-mono flex items-center gap-2">
                <TrendingUp className="w-3.5 h-3.5 text-primary" /> learning_tracks
              </h3>
              <div className="space-y-2">
                {SECTIONS.map(s => {
                  const unlocked = user.unlockedSections.includes(s.section);
                  const isComingSoon = s.comingSoon;
                  return (
                    <button key={s.id}
                      onClick={unlocked && !isComingSoon ? () => navigate('/learn') : undefined}
                      className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl border transition-all ${
                        isComingSoon ? 'opacity-30 cursor-not-allowed border-border/20 bg-secondary/10' :
                        unlocked ? 'border-border/40 bg-secondary/20 hover:border-primary/20 hover:bg-secondary/30 cursor-pointer glass-card-hover' :
                        'opacity-40 cursor-not-allowed border-border/20 bg-secondary/10'
                      }`}>
                      <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center text-lg border border-primary/10 flex-shrink-0">
                        {s.icon}
                      </div>
                      <div className="flex-1 text-left">
                        <span className="font-semibold text-sm text-foreground block">{s.label}</span>
                        <span className="text-[10px] text-muted-foreground font-mono">{s.sub}</span>
                      </div>
                      {s.id === 'frontend' && (
                        <div className="w-20 h-1.5 bg-secondary rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full neon-glow" style={{ width: `${progress}%` }} />
                        </div>
                      )}
                      {isComingSoon && <span className="text-[9px] text-muted-foreground bg-secondary/40 px-2 py-0.5 rounded-full font-mono">soon</span>}
                      {!unlocked && !isComingSoon && <Lock className="w-4 h-4 text-muted-foreground" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Roadmap */}
            <div className="glass-card rounded-xl p-4">
              <h3 className="text-xs font-semibold text-muted-foreground mb-4 uppercase tracking-wider font-mono">roadmap</h3>
              <div className="flex items-center gap-1 overflow-x-auto pb-2">
                {[
                  { label: 'HTML/CSS', active: true },
                  { label: 'JavaScript', active: progress > 20 },
                  { label: 'React', active: progress > 40 },
                  { label: 'Node.js', active: false },
                  { label: 'AI/ML', active: false },
                ].map((node, i, arr) => (
                  <div key={i} className="flex items-center flex-shrink-0">
                    <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl flex items-center justify-center text-center p-1.5 border transition-all ${
                      node.active
                        ? 'bg-primary/10 border-primary/30 neon-border'
                        : 'bg-secondary/20 border-border/20 opacity-40'
                    }`}>
                      <span className={`text-[10px] sm:text-xs font-semibold leading-tight font-mono ${node.active ? 'text-primary' : 'text-muted-foreground'}`}>{node.label}</span>
                    </div>
                    {i < arr.length - 1 && (
                      <div className={`w-4 sm:w-8 h-[2px] mx-0.5 ${node.active ? 'bg-primary/40' : 'bg-border/20'}`} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {/* 7-Day Streak Calendar */}
            <div className="glass-card rounded-xl p-4">
              <h3 className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider font-mono flex items-center gap-2">
                <Flame className="w-3.5 h-3.5 text-primary" /> streak_calendar
              </h3>
              <div className="flex items-center justify-between gap-1">
                {weekDays.map((d, i) => (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <span className="text-[9px] text-muted-foreground font-mono">{d.day}</span>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold font-mono transition-all ${
                      d.active
                        ? 'bg-primary/15 text-primary border border-primary/30 neon-border'
                        : d.isToday
                          ? 'bg-secondary/40 text-foreground border border-border/40'
                          : 'bg-secondary/20 text-muted-foreground border border-border/20'
                    }`}>
                      {d.date}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Badges */}
            <div className="glass-card rounded-xl p-4">
              <h3 className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider font-mono flex items-center gap-2">
                <Star className="w-3.5 h-3.5 text-primary" /> badges
              </h3>
              <div className="grid grid-cols-5 gap-1.5">
                {ALL_BADGES.map(b => {
                  const earned = user.badges.includes(b);
                  const info = BADGE_INFO[b];
                  return (
                    <div key={b} className={`flex flex-col items-center gap-0.5 p-2 rounded-lg transition-all ${
                      earned ? 'bg-primary/10 border border-primary/20 badge-glow' : 'opacity-25'
                    }`}>
                      <span className="text-xl">{earned ? info.icon : '🔒'}</span>
                      <span className="text-[7px] text-muted-foreground font-mono">{info.label}</span>
                    </div>
                  );
                })}
              </div>
              {user.badges.filter(b => !ALL_BADGES.includes(b)).length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2 pt-2 border-t border-border/20">
                  {user.badges.filter(b => !ALL_BADGES.includes(b)).map(b => (
                    <span key={b} className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-mono border border-primary/20">
                      {BADGE_INFO[b]?.icon || '🏅'} {BADGE_INFO[b]?.label || b}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Daily Challenge */}
            <div className="glass-card rounded-xl p-4 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
              <h3 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider font-mono flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-primary" /> daily_challenge
              </h3>
              <p className="text-sm font-semibold text-foreground">{dailyChallenge.title}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5 mb-3">{dailyChallenge.desc}</p>
              <button onClick={() => navigate('/playground')}
                className="w-full text-xs bg-primary/10 text-primary px-3 py-2 rounded-lg hover:bg-primary/20 transition-colors font-mono font-semibold border border-primary/20 neon-border">
                start() →
              </button>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => navigate('/playground')} className="glass-card-hover rounded-xl p-3 text-left group">
                <Code className="w-5 h-5 text-primary mb-1.5" />
                <p className="text-xs font-semibold text-foreground font-mono">Playground</p>
                <ArrowRight className="w-3 h-3 text-muted-foreground mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
              <button onClick={() => navigate('/challenges')} className="glass-card-hover rounded-xl p-3 text-left group">
                <Trophy className="w-5 h-5 text-primary mb-1.5" />
                <p className="text-xs font-semibold text-foreground font-mono">Challenges</p>
                <ArrowRight className="w-3 h-3 text-muted-foreground mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </div>
          </div>
        </div>

        {/* Promo Code */}
        <div className="glass-card rounded-xl p-4">
          <h3 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider font-mono">promo_code</h3>
          <div className="flex gap-2">
            <input value={promoInput} onChange={e => setPromoInput(e.target.value)} placeholder="ENTER_CODE"
              className="flex-1 bg-secondary/40 border border-border rounded-lg px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 font-mono" />
            <button onClick={handlePromo} className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-xs font-bold font-mono hover:neon-glow transition-all">
              apply()
            </button>
          </div>
          {promoMsg && <p className="text-xs mt-2 font-mono">{promoMsg}</p>}
        </div>
      </div>
    </div>
  );
};

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="glass-card rounded-xl p-3 flex flex-col items-center gap-1">
      {icon}
      <span className="text-lg font-bold text-foreground font-mono">{value}</span>
      <span className="text-[9px] text-muted-foreground font-mono uppercase">{label}</span>
    </div>
  );
}

export default Dashboard;
