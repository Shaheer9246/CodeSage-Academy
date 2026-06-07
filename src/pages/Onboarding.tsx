import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { ChevronRight, Sprout, Rocket, Code2, Pen, Terminal } from 'lucide-react';

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
  const { user, completeOnboarding } = useUser();
  const navigate = useNavigate();

  // If the user isn't loaded yet, show nothing (ProtectedRoute handles the redirect)
  if (!user) return null;

  const current = steps[step];
  const value = answers[current.key] || '';
  const canContinue = value.trim().length > 0;

  const handleNext = async () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else { 
      // 1. Safely wait for the database write to finish completely
      await completeOnboarding(answers); 
      // 2. Perform a single, clean programmatic redirect
      navigate('/dashboard'); 
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden ambient-grid">
      <div className="absolute top-[-15%] left-[20%] w-[400px] h-[400px] rounded-full bg-primary/4 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-lg relative z-10 animate-fade-in">
        <div className="text-center mb-5">
          <div className="flex items-center justify-center gap-2 mb-1">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center neon-glow border border-primary/20">
              <Terminal className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xl font-bold text-primary font-mono neon-text">CodeSage</span>
          </div>
        </div>

        <div className="flex gap-1.5 mb-5 max-w-xs mx-auto">
          {steps.map((_, i) => (
            <div key={i} className={`flex-1 h-1 rounded-full transition-all duration-500 ${
              i <= step ? 'bg-primary neon-glow' : 'bg-secondary/40'
            }`} />
          ))}
        </div>

        <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
          
          <p className="text-[10px] text-muted-foreground mb-1 uppercase tracking-wider font-mono">step {step + 1}/{steps.length}</p>
          <h2 className="text-lg font-semibold text-foreground mb-5 font-mono">
            {current.question}<span className="text-primary animate-pulse">_</span>
          </h2>

          {current.type === 'text' && (
            <input type="text" placeholder={current.placeholder} value={value}
              onChange={e => setAnswers({ ...answers, [current.key]: e.target.value })}
              className="w-full bg-secondary/40 border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:shadow-[0_0_12px_hsl(153,100%,50%,0.1)] transition-all text-sm font-mono"
              autoFocus />
          )}

          {current.type === 'date' && (
            <input type="date" value={value}
              onChange={e => setAnswers({ ...answers, [current.key]: e.target.value })}
              className="w-full bg-secondary/40 border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary/50 transition-all text-sm font-mono" />
          )}

          {current.type === 'choice' && (
            <div className="space-y-2">
              {current.options?.map(opt => (
                <button key={opt} onClick={() => setAnswers({ ...answers, [current.key]: opt })}
                  className={`w-full text-left px-4 py-3 rounded-xl border transition-all text-sm font-mono ${
                    value === opt
                      ? 'border-primary/50 bg-primary/10 text-primary neon-border'
                      : 'border-border/40 bg-secondary/20 text-foreground hover:border-primary/20 hover:bg-secondary/30'
                  }`}>
                  {opt}
                </button>
              ))}
            </div>
          )}

          {current.type === 'goalCards' && (
            <div className="grid grid-cols-2 gap-3">
              {[
                { val: 'Learn Code', icon: <Code2 className="w-8 h-8 text-primary" /> },
                { val: 'Edit Code Live', icon: <Pen className="w-8 h-8 text-primary" /> },
              ].map(g => (
                <button key={g.val} onClick={() => setAnswers({ ...answers, goal: g.val })}
                  className={`flex flex-col items-center justify-center p-6 rounded-xl border transition-all ${
                    value === g.val
                      ? 'bg-primary/10 border-primary/30 neon-border'
                      : 'bg-secondary/20 border-border/40 hover:border-primary/20'
                  }`}>
                  <div className="mb-2">{g.icon}</div>
                  <span className="font-semibold text-xs text-foreground uppercase tracking-wide font-mono">{g.val}</span>
                </button>
              ))}
            </div>
          )}

          {current.type === 'expCards' && (
            <div className="space-y-2">
              {[
                { val: 'Complete Beginner', icon: <Sprout className="w-5 h-5 text-primary" /> },
                { val: 'Experienced', icon: <Rocket className="w-5 h-5 text-primary" /> },
              ].map(e => (
                <button key={e.val} onClick={() => setAnswers({ ...answers, experienceLevel: e.val })}
                  className={`w-full flex items-center gap-3 px-5 py-4 rounded-xl border transition-all text-sm font-mono ${
                    value === e.val
                      ? 'border-primary/50 bg-primary/10 neon-border'
                      : 'border-border/40 bg-secondary/20 hover:bg-secondary/30'
                  }`}>
                  {e.icon}
                  <span className="font-semibold text-foreground uppercase tracking-wide">{e.val}</span>
                </button>
              ))}
            </div>
          )}

          <button onClick={handleNext} disabled={!canContinue}
            className="mt-6 w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:neon-glow disabled:opacity-30 transition-all text-sm font-mono uppercase tracking-wider">
            {step === steps.length - 1 ? 'start()' : 'continue()'}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
