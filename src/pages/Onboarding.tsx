import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { Code2, ChevronRight, Sprout, Rocket } from 'lucide-react';

const steps = [
  { key: 'name', question: 'What is your name?', placeholder: 'Enter your full name', type: 'text' },
  { key: 'studying', question: 'What are you currently studying?', placeholder: 'e.g., Computer Science, High School, Self-learning', type: 'text' },
  { key: 'hasJob', question: 'Do you have any job or work?', placeholder: '', type: 'choice', options: ['Student only', 'Part-time job', 'Full-time job', 'Freelancer', 'Unemployed'] },
  { key: 'dob', question: 'What is your date of birth?', placeholder: '', type: 'date' },
  { key: 'goal', question: 'What is your primary goal?', placeholder: '', type: 'choice', options: ['Build websites', 'Get a tech job', 'Learn for fun', 'School/College project', 'Start freelancing'] },
  { key: 'experienceLevel', question: 'What is your experience level?', placeholder: '', type: 'choice', options: ['Complete Beginner', 'Know some basics', 'Intermediate', 'Experienced'] },
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
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      completeOnboarding(answers);
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
              <Code2 className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground font-mono">CodeSage</span>
          </div>
        </div>

        {/* Progress */}
        <div className="flex gap-1.5 mb-8">
          {steps.map((_, i) => (
            <div key={i} className={`flex-1 h-1.5 rounded-full transition-all ${i <= step ? 'bg-primary' : 'bg-secondary'}`} />
          ))}
        </div>

        {/* Question card */}
        <div className="bg-card border border-border rounded-2xl p-8">
          <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">Step {step + 1} of {steps.length}</p>
          <h2 className="text-xl font-semibold text-foreground mb-6">{current.question}</h2>

          {current.type === 'text' && (
            <input
              type="text"
              placeholder={current.placeholder}
              value={value}
              onChange={e => setAnswers({ ...answers, [current.key]: e.target.value })}
              className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              autoFocus
            />
          )}

          {current.type === 'date' && (
            <input
              type="date"
              value={value}
              onChange={e => setAnswers({ ...answers, [current.key]: e.target.value })}
              className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          )}

          {current.type === 'choice' && (
            <div className="space-y-2">
              {current.options?.map(opt => (
                <button
                  key={opt}
                  onClick={() => setAnswers({ ...answers, [current.key]: opt })}
                  className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${
                    value === opt
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border bg-secondary text-foreground hover:border-primary/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {current.key === 'experienceLevel' && opt === 'Complete Beginner' && <Sprout className="w-5 h-5" />}
                    {current.key === 'experienceLevel' && opt === 'Experienced' && <Rocket className="w-5 h-5" />}
                    {opt}
                  </div>
                </button>
              ))}
            </div>
          )}

          <button
            onClick={handleNext}
            disabled={!canContinue}
            className="mt-6 w-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-40 transition-opacity"
          >
            {step === steps.length - 1 ? 'Start Learning' : 'Continue'}
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
