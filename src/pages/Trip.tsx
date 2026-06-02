import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Code2, Wifi, Trophy, Users, Settings, MessageSquare, Rocket, Terminal, Sparkles } from 'lucide-react';

const stops = [
  { icon: BookOpen, title: 'Learn', desc: 'Bite-sized lessons → Concept, Practice & Quiz format for HTML, CSS, JS and more.' },
  { icon: Wifi, title: 'Computer & Networking', desc: '10 deep lessons covering hardware, OS, IP, DNS, CLI and the internet.' },
  { icon: Code2, title: 'Code Playground', desc: 'A free in-browser editor with files, live preview & recent snapshots — no login needed.' },
  { icon: Trophy, title: 'Challenges & Daily Quiz', desc: 'Earn XP, Sage Coins and badges. 10 fresh questions every day.' },
  { icon: Users, title: 'Community', desc: 'Connect with other learners (coming soon).' },
  { icon: MessageSquare, title: 'Suggestions', desc: 'Tell us what to build next — we actually read every one.' },
  { icon: Settings, title: 'Profile & Themes', desc: '4 beautiful themes, streaks, achievements & full account control.' },
];

const Trip = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background relative overflow-hidden grid-bg">
      <div className="glow-orb glow-primary w-72 h-72 -top-20 -right-20 opacity-30" />
      <div className="glow-orb glow-accent w-96 h-96 -bottom-32 -left-20 opacity-20" />

      <div className="relative z-10 max-w-md mx-auto px-5 py-8 min-h-screen flex flex-col">
        <button
          onClick={() => navigate('/')}
          className="self-start flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </button>

        <div className="flex items-center gap-2 mb-6 animate-fade-in">
          <div className="w-9 h-9 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center neon-glow">
            <Terminal className="w-4 h-4 text-primary" />
          </div>
          <span className="font-display font-bold text-lg gradient-text">Quick Trip</span>
        </div>

        <div className="inline-flex items-center gap-1.5 self-start text-[10px] font-mono text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-full mb-3">
          <Sparkles className="w-3 h-3" /> NO LOGIN · JUST EXPLORE
        </div>

        <h1 className="font-display text-2xl font-bold leading-tight mb-2">
          A 60-second tour of <span className="text-primary neon-text">CodeSage</span>
        </h1>
        <p className="text-xs text-muted-foreground mb-6">
          Scroll through the app's main areas. When you're ready, sign up to unlock progress, XP and badges.
        </p>

        <div className="space-y-2.5 flex-1">
          {stops.map((s, i) => (
            <div key={i} className="flex items-start gap-3 glass-card px-3 py-3 rounded-xl animate-fade-in" style={{ animationDelay: `${i * 60}ms` }}>
              <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 neon-glow">
                <s.icon className="w-4 h-4 text-primary" />
              </div>
              <div className="min-w-0">
                <div className="font-display font-semibold text-sm text-foreground">{s.title}</div>
                <p className="text-[11px] text-muted-foreground leading-relaxed mt-0.5">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-2 mt-6 sticky bottom-3">
          <button
            onClick={() => navigate('/auth')}
            className="w-full bg-primary text-primary-foreground font-display font-semibold text-sm py-3.5 rounded-2xl neon-glow-strong hover:opacity-90 transition-all flex items-center justify-center gap-2"
          >
            <Rocket className="w-4 h-4" />
            I'm in — Start Learning
          </button>
          <button
            onClick={() => navigate('/playground')}
            className="w-full glass-card border border-border/50 text-foreground font-display font-semibold text-sm py-3 rounded-2xl hover:border-primary/30 transition-all"
          >
            Try the Playground
          </button>
        </div>
      </div>
    </div>
  );
};

export default Trip;
