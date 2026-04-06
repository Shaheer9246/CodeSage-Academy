import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { ChevronRight, Sprout, Rocket, Code2, GraduationCap, Settings, Pen } from 'lucide-react';
import heroImage from '@/assets/hero-coder.png';

const steps = [
  { key: 'name', question: 'What is your name?', placeholder: 'Enter your full name', type: 'text' },
  { key: 'studying', question: 'What are you currently studying?', placeholder: 'e.g., Computer Science, High School', type: 'text' },
  { key: 'hasJob', question: 'Do you have any job or work?', type: 'choice', options: ['Student only', 'Part-time job', 'Full-time job', 'Freelancer', 'Unemployed'] },
  { key: 'dob', question: 'What is your date of birth?', type: 'date' },
  { key: 'goal', question: 'What is your primary goal?', type: 'goalCards' },
  { key: 'experienceLevel', question: 'What is your experience level?', type: 'expCards' },
];

const Onboarding = () => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const { user, isOnboarded, completeOnboarding } = useUser();
  const navigate = useNavigate();

  if (!user) { navigate('/auth'); return null; }
  if (isOnboarded) { navigate('/dashboard'); return null; }

  const current = steps[step];
  const value = answers[current.key] || '';
  const canContinue = value.trim().length > 0;

  const handleNext = () => {
    if (step < steps.length - 1) setStep(step + 1);
    else { completeOnboarding(answers); navigate('/dashboard'); }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,hsl(270,65%,15%)_0%,transparent_50%)]" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,hsl(25,95%,15%)_0%,transparent_40%)]" />
      </div>
      <span className="absolute text-4xl top-[15%] left-[5%] text-primary/10 animate-float font-mono">{`<>`}</span>
      <span className="absolute text-3xl bottom-[10%] right-[8%] text-accent/10 animate-float font-mono" style={{ animationDelay: '2s' }}>{`{}`}</span>

      <div className="w-full max-w-2xl relative z-10">
        {/* Logo */}
        <div className="text-center mb-4">
          <div className="flex items-center justify-center gap-2 mb-1">
            <div className="w-10 h-10 bg-gradient-to-br from-primary via-accent to-primary rounded-xl flex items-center justify-center border border-primary/20">
              <span className="text-lg font-bold text-primary-foreground font-mono">&lt;/&gt;</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent font-mono">CodeSage</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="flex gap-1.5 mb-6 max-w-sm mx-auto">
          {steps.map((_, i) => (
            <div key={i} className={`flex-1 h-1.5 rounded-full transition-all duration-500 ${i <= step ? 'bg-gradient-to-r from-primary to-accent' : 'bg-secondary/40'}`} />
          ))}
        </div>

        {/* Main content */}
        <div className="backdrop-blur-xl bg-card/60 rounded-3xl p-6 sm:p-8 border border-border/50 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-accent/3" />
          <div className="relative z-10">
            <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-mono">Step {step + 1} of {steps.length}</p>
            <h2 className="text-xl font-semibold text-foreground mb-5">{current.question}</h2>

            {current.type === 'text' && (
              <input type="text" placeholder={current.placeholder} value={value}
                onChange={e => setAnswers({ ...answers, [current.key]: e.target.value })}
                className="w-full bg-secondary/40 border border-border/50 rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all text-sm backdrop-blur-sm"
                autoFocus />
            )}

            {current.type === 'date' && (
              <input type="date" value={value}
                onChange={e => setAnswers({ ...answers, [current.key]: e.target.value })}
                className="w-full bg-secondary/40 border border-border/50 rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all text-sm backdrop-blur-sm" />
            )}

            {current.type === 'choice' && (
              <div className="space-y-2">
                {current.options?.map(opt => (
                  <button key={opt} onClick={() => setAnswers({ ...answers, [current.key]: opt })}
                    className={`w-full text-left px-4 py-3 rounded-xl border transition-all text-sm backdrop-blur-sm ${
                      value === opt
                        ? 'border-primary/50 bg-primary/10 text-primary shadow-lg shadow-primary/10'
                        : 'border-border/30 bg-secondary/30 text-foreground hover:border-primary/20 hover:bg-secondary/50'
                    }`}>
                    {opt}
                  </button>
                ))}
              </div>
            )}

            {current.type === 'goalCards' && (
              <div className="grid grid-cols-2 gap-3">
                {[
                  { val: 'Learn Code', icon: <Settings className="w-8 h-8" />, gradient: 'from-blue-500/20 to-cyan-500/20', border: 'border-blue-500/30' },
                  { val: 'Edit Code Live', icon: <Pen className="w-8 h-8" />, gradient: 'from-purple-500/20 to-pink-500/20', border: 'border-purple-500/30' },
                ].map(g => (
                  <button key={g.val} onClick={() => setAnswers({ ...answers, goal: g.val })}
                    className={`flex flex-col items-center justify-center p-6 rounded-2xl border transition-all backdrop-blur-sm ${
                      value === g.val ? `bg-gradient-to-br ${g.gradient} ${g.border} shadow-lg` : 'bg-secondary/30 border-border/30 hover:bg-secondary/50'
                    }`}>
                    <div className="mb-2 text-foreground">{g.icon}</div>
                    <span className="font-semibold text-sm text-foreground uppercase tracking-wide">{g.val}</span>
                  </button>
                ))}
              </div>
            )}

            {current.type === 'expCards' && (
              <div className="space-y-2">
                {[
                  { val: 'Complete Beginner', icon: <Sprout className="w-5 h-5 text-green-400" />, emoji: '🌱' },
                  { val: 'Experienced', icon: <Rocket className="w-5 h-5 text-pink-400" />, emoji: '🚀' },
                ].map(e => (
                  <button key={e.val} onClick={() => setAnswers({ ...answers, experienceLevel: e.val })}
                    className={`w-full flex items-center gap-3 px-5 py-4 rounded-xl border transition-all text-sm backdrop-blur-sm ${
                      value === e.val
                        ? 'border-primary/50 bg-primary/10 shadow-lg shadow-primary/10'
                        : 'border-border/30 bg-secondary/30 hover:bg-secondary/50'
                    }`}>
                    {e.icon}
                    <span className="font-semibold text-foreground uppercase tracking-wide">{e.val}</span>
                  </button>
                ))}
              </div>
            )}

            <button onClick={handleNext} disabled={!canContinue}
              className="mt-6 w-full bg-gradient-to-r from-primary via-[hsl(35,95%,55%)] to-primary text-primary-foreground py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-30 transition-all shadow-lg shadow-primary/30 text-sm uppercase tracking-wider">
              {step === steps.length - 1 ? 'Start Learning' : 'CONTINUE'}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Illustration peek */}
        <div className="hidden sm:block absolute -left-20 top-1/2 -translate-y-1/2 opacity-30 pointer-events-none">
          <img src={heroImage} alt="" width={200} height={200} loading="lazy" className="drop-shadow-xl" />
        </div>
      </div>

      {/* Decorative bottom bar */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="w-3 h-5 bg-secondary/30 rounded-sm border border-border/20" />
        ))}
      </div>
      <div className="absolute bottom-6 right-8 text-2xl text-primary/20 animate-pulse">✦</div>
    </div>
  );
};

export default Onboarding;
