import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { BookOpen, Trophy, Flame, Settings, Lock, Brain, Server, Code, ArrowRight, Star, Zap, Sparkles, Play, Pen } from 'lucide-react';
import { getAllLessons } from '@/data/lessons';
import { useState, useEffect } from 'react';

const BADGE_INFO: Record<string, { icon: string; label: string; color: string }> = {
  'lite': { icon: '🌱', label: 'Lite', color: 'from-green-500/20 to-green-600/20' },
  'silver': { icon: '🥈', label: 'Silver', color: 'from-gray-400/20 to-gray-500/20' },
  'gold': { icon: '🥇', label: 'Gold', color: 'from-yellow-500/20 to-yellow-600/20' },
  'premium': { icon: '💎', label: 'Premium', color: 'from-blue-500/20 to-blue-600/20' },
  'elite': { icon: '👑', label: 'Elite', color: 'from-purple-500/20 to-purple-600/20' },
  'test-passer': { icon: '📜', label: 'Test Ace', color: 'from-primary/20 to-accent/20' },
  'streak-3': { icon: '🔥', label: '3-Day', color: 'from-orange-500/20 to-red-500/20' },
  'streak-7': { icon: '⚡', label: '7-Day', color: 'from-yellow-500/20 to-orange-500/20' },
  'streak-30': { icon: '🏆', label: '30-Day', color: 'from-primary/20 to-accent/20' },
};

const ALL_BADGES = ['lite', 'silver', 'gold', 'premium', 'elite'];

const DAILY_CHALLENGES = [
  { title: 'Add a Heading', desc: 'Create an h1 heading with your name', link: '/playground' },
  { title: 'Style a Button', desc: 'Create and style a colorful button', link: '/playground' },
  { title: 'Build a List', desc: 'Create an unordered list with 5 items', link: '/playground' },
  { title: 'Center a Div', desc: 'Center a div using CSS flexbox', link: '/playground' },
  { title: 'Color Palette', desc: 'Create 4 colored boxes in a row', link: '/playground' },
  { title: 'Simple Form', desc: 'Build a form with name and email', link: '/playground' },
  { title: 'Image Card', desc: 'Create a card with image and text', link: '/playground' },
];

const SECTIONS = [
  { id: 'frontend', label: 'Frontend (HTML/CSS)', icon: '📱', gradient: 'from-blue-500/80 to-cyan-500/80', section: 'frontend' },
  { id: 'backend', label: 'Backend (Node.js/SQL)', icon: '🖥️', gradient: 'from-green-500/80 to-emerald-500/80', section: 'backend' },
  { id: 'ai', label: 'AI Integration (Python/TensorFlow)', icon: '🧠', gradient: 'from-green-600/80 to-teal-500/80', section: 'ai' },
  { id: 'ds', label: 'Data Structures (Algorithms)', icon: '🔗', gradient: 'from-purple-500/80 to-violet-500/80', section: 'ds', comingSoon: true },
  { id: 'fullstack', label: 'Full-Stack Projects', icon: '🚀', gradient: 'from-yellow-500/80 to-orange-500/80', section: 'fullstack', comingSoon: true },
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

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,hsl(270,65%,12%)_0%,transparent_50%)]" />
        <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_left,hsl(25,95%,10%)_0%,transparent_40%)]" />
      </div>
      <span className="absolute text-4xl top-20 right-10 text-primary/8 animate-float font-mono">{`{}`}</span>
      <span className="absolute text-3xl bottom-20 left-8 text-accent/8 animate-float font-mono" style={{ animationDelay: '3s' }}>{`</>`}</span>
      {[...Array(10)].map((_, i) => (
        <div key={i} className="absolute w-1 h-1 bg-primary/15 rounded-full animate-pulse"
          style={{ top: `${15 + Math.random() * 70}%`, left: `${5 + Math.random() * 90}%`, animationDelay: `${Math.random() * 4}s` }} />
      ))}

      {/* Header */}
      <header className="relative z-10 border-b border-border/30 backdrop-blur-xl bg-card/30 px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center border border-primary/20">
            <span className="text-xs font-bold text-primary-foreground font-mono">&lt;/&gt;</span>
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent font-mono hidden sm:inline">CodeSage</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20">
            <Flame className="w-4 h-4 text-primary" />
            <span className="font-bold text-xs text-primary">{user.streakCount}</span>
          </div>
          <button onClick={() => navigate('/settings')} className="text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-lg hover:bg-secondary/50">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div className="relative z-10 max-w-6xl mx-auto p-4 sm:p-6 space-y-4">
        {/* Welcome + Progress */}
        <div className="backdrop-blur-xl bg-card/40 rounded-2xl p-5 sm:p-6 border border-border/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-accent/3" />
          <div className="relative z-10 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-3xl border border-primary/15">
                👋
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-foreground">Welcome back, {user.name}!</h1>
                <p className="text-muted-foreground text-xs mt-0.5 font-mono">Your coding journey continues</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Progress</p>
              <p className="text-2xl font-bold text-primary font-mono">{progress}%</p>
            </div>
          </div>
          <div className="relative z-10 mt-4 w-full h-2.5 bg-secondary/40 rounded-full overflow-hidden backdrop-blur-sm">
            <div className="h-full bg-gradient-to-r from-primary via-accent to-primary rounded-full transition-all duration-700" style={{ width: `${Math.max(progress, 2)}%` }} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left column: Learning Sections + Roadmap */}
          <div className="lg:col-span-2 space-y-4">
            {/* Section bars */}
            <div className="space-y-2">
              {SECTIONS.map(s => {
                const unlocked = user.unlockedSections.includes(s.section);
                const isComingSoon = s.comingSoon;
                return (
                  <button key={s.id} onClick={unlocked && !isComingSoon ? () => navigate('/learn') : undefined}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border transition-all backdrop-blur-sm ${
                      isComingSoon ? 'opacity-40 cursor-not-allowed border-border/20 bg-secondary/20' :
                      unlocked ? 'border-border/30 bg-card/40 hover:bg-card/60 cursor-pointer' :
                      'opacity-50 cursor-not-allowed border-border/20 bg-secondary/20'
                    }`}>
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.gradient} flex items-center justify-center text-lg flex-shrink-0`}>
                      {s.icon}
                    </div>
                    <span className="font-medium text-sm text-foreground flex-1 text-left">{s.label}</span>
                    {s.id === 'frontend' && (
                      <div className="w-24 h-2 bg-secondary/40 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full" style={{ width: `${progress}%` }} />
                      </div>
                    )}
                    {isComingSoon && <span className="text-[10px] text-muted-foreground bg-secondary/40 px-2 py-0.5 rounded-full">Soon</span>}
                    {!unlocked && !isComingSoon && <Lock className="w-4 h-4 text-muted-foreground" />}
                    {unlocked && !isComingSoon && s.id !== 'frontend' && <span className="text-[10px] text-muted-foreground font-mono">{`{}`}</span>}
                  </button>
                );
              })}
            </div>

            {/* Learning Roadmap Visual */}
            <div className="backdrop-blur-xl bg-card/40 rounded-2xl p-5 border border-border/30 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/2 via-transparent to-accent/2" />
              <h3 className="text-sm font-semibold text-foreground mb-4 relative z-10 uppercase tracking-wider font-mono">Learning Roadmap</h3>
              <div className="relative z-10 flex items-center justify-between overflow-x-auto gap-2 pb-2">
                {[
                  { label: 'Frontend\nFundamentals', color: 'bg-blue-500/80', active: true },
                  { label: 'JavaScript\nDeep Dive', color: 'bg-yellow-600/80', active: progress > 30 },
                  { label: 'Python\nFor AI', color: 'bg-green-500/60', active: false },
                  { label: 'Backend\nSystems', color: 'bg-emerald-500/60', active: false },
                  { label: 'AI\nIntegration', color: 'bg-purple-500/60', active: false },
                ].map((node, i, arr) => (
                  <div key={i} className="flex items-center flex-shrink-0">
                    <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl ${node.color} flex items-center justify-center text-center p-2 border transition-all ${
                      node.active ? 'border-foreground/20 shadow-lg' : 'border-border/10 opacity-50'
                    }`}>
                      <span className="text-[10px] sm:text-xs font-semibold text-foreground whitespace-pre-line leading-tight">{node.label}</span>
                    </div>
                    {i < arr.length - 1 && (
                      <div className={`w-6 sm:w-10 h-0.5 ${node.active ? 'bg-gradient-to-r from-primary/50 to-accent/30' : 'bg-border/20'} mx-1`} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-4">
            {/* Code Editor Preview Card */}
            <div className="backdrop-blur-xl bg-card/40 rounded-2xl p-4 border border-border/30 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/3 via-transparent to-primary/3" />
              <div className="relative z-10">
                <h3 className="text-sm font-semibold text-foreground mb-1">Code Editor Live Preview</h3>
                <p className="text-[10px] text-muted-foreground mb-3">Pick up where you left off</p>
                <div className="bg-background/60 rounded-lg p-3 font-mono text-[10px] text-muted-foreground border border-border/20 mb-3 h-20 overflow-hidden">
                  <p><span className="text-blue-400">&lt;div</span> <span className="text-green-400">class=</span><span className="text-primary">"un"</span><span className="text-blue-400">&gt;</span></p>
                  <p className="ml-2"><span className="text-blue-400">&lt;div</span> <span className="text-green-400">class=</span><span className="text-primary">"loan"</span><span className="text-blue-400">&gt;</span></p>
                  <p className="ml-4"><span className="text-accent">uinet</span>: ();</p>
                  <p className="ml-4">preview = <span className="text-primary">this</span>;</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => navigate('/learn')} className="flex-1 flex items-center justify-center gap-1.5 bg-card/60 border border-border/30 text-foreground py-2 rounded-lg text-xs font-semibold hover:bg-card/80 transition-colors">
                    <BookOpen className="w-3.5 h-3.5" /> LEARN CODE
                  </button>
                  <button onClick={() => navigate('/playground')} className="flex-1 flex items-center justify-center gap-1.5 bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/20 text-primary py-2 rounded-lg text-xs font-semibold hover:from-primary/30 hover:to-accent/30 transition-colors">
                    <Code className="w-3.5 h-3.5" /> EDIT LIVE
                  </button>
                </div>
              </div>
            </div>

            {/* Badges */}
            <div className="backdrop-blur-xl bg-card/40 rounded-2xl p-4 border border-border/30">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
                <Star className="w-4 h-4 text-primary" /> Badges
              </h3>
              <div className="grid grid-cols-5 gap-2">
                {ALL_BADGES.map(b => {
                  const earned = user.badges.includes(b);
                  const info = BADGE_INFO[b];
                  return (
                    <div key={b} className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
                      earned ? `bg-gradient-to-br ${info.color} border border-primary/10` : 'opacity-30'
                    }`}>
                      <span className="text-2xl">{earned ? info.icon : '🔒'}</span>
                      <span className="text-[8px] text-muted-foreground font-medium">{info.label}</span>
                    </div>
                  );
                })}
              </div>
              {user.badges.filter(b => !ALL_BADGES.includes(b)).length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2 pt-2 border-t border-border/20">
                  {user.badges.filter(b => !ALL_BADGES.includes(b)).map(b => (
                    <span key={b} className="text-xs bg-secondary/40 px-2 py-0.5 rounded-full border border-border/20">
                      {BADGE_INFO[b]?.icon || '🏅'} {BADGE_INFO[b]?.label || b}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Streaks */}
            <div className="backdrop-blur-xl bg-card/40 rounded-2xl p-4 border border-border/30">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
                <Flame className="w-4 h-4 text-primary" /> Streaks
              </h3>
              <div className="flex items-center gap-3">
                <div className="text-4xl">🔥</div>
                <div>
                  <p className="text-2xl font-bold text-primary font-mono">{user.streakCount}</p>
                  <p className="text-xs text-muted-foreground">{user.streakCount}-day Streak!</p>
                </div>
              </div>
            </div>

            {/* Daily Challenge */}
            <div className="backdrop-blur-xl bg-card/40 rounded-2xl p-4 border border-primary/15 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
              <div className="relative z-10">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-primary" /> Daily Code Challenge
                </h3>
                <div className="bg-background/40 rounded-xl p-3 border border-border/20 mb-3">
                  <div className="font-mono text-[10px] text-muted-foreground h-16 overflow-hidden">
                    <p><span className="text-blue-400">&lt;div&gt;</span></p>
                    <p className="ml-2"><span className="text-blue-400">&lt;h1</span> <span className="text-green-400">class=</span><span className="text-primary">"un"</span><span className="text-blue-400">&gt;</span></p>
                    <p className="ml-4">div class="loan"</p>
                  </div>
                </div>
                <p className="text-sm font-semibold text-foreground">{dailyChallenge.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{dailyChallenge.desc}</p>
                <button onClick={() => navigate(dailyChallenge.link)}
                  className="mt-3 w-full text-xs bg-gradient-to-r from-primary/20 to-accent/20 text-primary px-3 py-2 rounded-lg hover:from-primary/30 hover:to-accent/30 transition-colors font-semibold border border-primary/20">
                  Start Challenge →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <QuickCard icon={<Code className="w-5 h-5" />} title="Playground" onClick={() => navigate('/playground')} gradient="from-primary/15 to-primary/5" />
          <QuickCard icon={<Trophy className="w-5 h-5" />} title="Challenges" onClick={() => navigate('/challenges')} gradient="from-accent/15 to-accent/5" />
          <QuickCard icon={<BookOpen className="w-5 h-5" />} title={completedCount > 0 ? 'Continue' : 'Start Learning'} onClick={() => navigate('/learn')} gradient="from-blue-500/15 to-cyan-500/5" />
        </div>

        {/* Promo Code */}
        <div className="backdrop-blur-xl bg-card/30 rounded-2xl p-4 border border-border/20">
          <h3 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider font-mono">Promo Code</h3>
          <div className="flex gap-2">
            <input value={promoInput} onChange={e => setPromoInput(e.target.value)} placeholder="Enter code"
              className="flex-1 bg-secondary/40 border border-border/30 rounded-lg px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 font-mono backdrop-blur-sm" />
            <button onClick={handlePromo} className="bg-gradient-to-r from-primary to-accent text-primary-foreground px-4 py-2 rounded-lg text-xs font-semibold hover:opacity-90">Apply</button>
          </div>
          {promoMsg && <p className="text-xs mt-2">{promoMsg}</p>}
        </div>
      </div>

      {/* Bottom decoration */}
      <div className="relative z-10 flex justify-center py-4">
        <div className="flex gap-1">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="w-3 h-5 bg-secondary/20 rounded-sm border border-border/10" />
          ))}
        </div>
      </div>
      <div className="absolute bottom-6 right-8 text-2xl text-primary/15 animate-pulse">✦</div>
    </div>
  );
};

function QuickCard({ icon, title, onClick, gradient }: { icon: React.ReactNode; title: string; onClick: () => void; gradient: string }) {
  return (
    <button onClick={onClick} className={`backdrop-blur-sm bg-gradient-to-br ${gradient} border border-border/20 rounded-xl p-4 text-left hover:border-primary/20 transition-all group`}>
      <div className="text-foreground mb-2">{icon}</div>
      <p className="text-xs font-semibold text-foreground">{title}</p>
      <ArrowRight className="w-3 h-3 text-muted-foreground mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  );
}

export default Dashboard;
