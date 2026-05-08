import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { useEffect } from 'react';
import { Code2, Rocket, BookOpen, Wifi, Briefcase, Sparkles, Terminal } from 'lucide-react';

const Welcome = () => {
  const navigate = useNavigate();
  const { isLoggedIn, loading } = useUser();

  useEffect(() => {
    if (!loading && isLoggedIn) navigate('/dashboard', { replace: true });
  }, [loading, isLoggedIn, navigate]);

  if (loading) return null;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden grid-bg">
      <div className="glow-orb glow-primary w-72 h-72 -top-20 -right-20 opacity-30" />
      <div className="glow-orb glow-accent w-96 h-96 -bottom-32 -left-20 opacity-20" />

      <div className="relative z-10 max-w-md mx-auto px-5 py-10 min-h-screen flex flex-col">
        <div className="flex items-center gap-2 mb-10 animate-fade-in">
          <div className="w-9 h-9 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center neon-glow">
            <Terminal className="w-4 h-4 text-primary" />
          </div>
          <span className="font-display font-bold text-lg gradient-text">CodeSage</span>
        </div>

        <div className="flex-1 flex flex-col justify-center animate-fade-in">
          <div className="inline-flex items-center gap-1.5 self-start text-[10px] font-mono text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-full mb-4">
            <Sparkles className="w-3 h-3" /> 100% FREE FOR STUDENTS
          </div>

          <h1 className="font-display text-3xl sm:text-4xl font-bold leading-tight mb-3">
            Become a <span className="text-primary neon-text">developer</span>,<br />
            without the price tag.
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed mb-8">
            Learn coding, networking, and freelancing through bite-sized lessons,
            real practice, and a code playground — all in one place.
          </p>

          <div className="space-y-2 mb-8">
            {[
              { icon: Code2, label: 'HTML / CSS / JavaScript → React' },
              { icon: Wifi, label: 'Computer & Networking fundamentals' },
              { icon: Briefcase, label: 'Freelancing & career skills' },
              { icon: BookOpen, label: 'Concept → Practice → Quiz format' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 glass-card px-3 py-2.5 rounded-xl">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-4 h-4 text-primary" />
                </div>
                <span className="text-xs text-foreground">{item.label}</span>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <button
              onClick={() => navigate('/auth')}
              className="w-full bg-primary text-primary-foreground font-display font-semibold text-sm py-3.5 rounded-2xl neon-glow hover:opacity-90 transition-all flex items-center justify-center gap-2"
            >
              <Rocket className="w-4 h-4" />
              Start Learning
            </button>
            <button
              onClick={() => navigate('/playground')}
              className="w-full glass-card border border-border/50 text-foreground font-display font-semibold text-sm py-3.5 rounded-2xl hover:border-primary/30 transition-all flex items-center justify-center gap-2"
            >
              <Code2 className="w-4 h-4 text-primary" />
              Just Edit Code
            </button>
          </div>

          <p className="text-[10px] text-muted-foreground/60 text-center mt-6 font-mono">
            No credit card · No subscriptions · Open for everyone
          </p>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
