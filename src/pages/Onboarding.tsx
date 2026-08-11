import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { ChevronRight, Sprout, Rocket, Code2, Pen, Terminal, Lock, CheckCircle2 } from 'lucide-react';

const steps = [
  { key: 'name', question: 'What is your name?', placeholder: 'Enter your full name', type: 'text' },
  { key: 'studying', question: 'What are you currently studying?', placeholder: 'e.g., Computer Science, High School', type: 'text' },
  { key: 'hasJob', question: 'Do you have any job or work?', type: 'choice', options: ['Student only', 'Part-time job', 'Full-time job', 'Freelancer', 'Unemployed'] },
  { key: 'dob', question: 'What is your date of birth?', type: 'date' },
  { key: 'goal', question: 'What is your primary goal?', type: 'goalCards' },
  { key: 'experienceLevel', question: 'What is your experience level?', type: 'expCards' },
];

const Onboarding = () => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const { user, completeOnboarding } = useUser();
  const navigate = useNavigate();

  // Ref array to trigger smooth scroll to specific question cards
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  if (!user) return null;

  // Check if step at `index` is unlocked (all previous questions answered)
  const isUnlocked = (index: number) => {
    if (index === 0) return true;
    for (let i = 0; i < index; i++) {
      const val = answers[steps[i].key];
      if (!val || val.trim().length === 0) return false;
    }
    return true;
  };

  const scrollToStep = (nextIndex: number) => {
    if (nextIndex < steps.length && cardRefs.current[nextIndex]) {
      setTimeout(() => {
        cardRefs.current[nextIndex]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 200);
    }
  };

  const handleAnswerChange = (key: string, val: string, index: number) => {
    setAnswers(prev => ({ ...prev, [key]: val }));
    // Auto-scroll to next step on choice click
    if (val.trim() && index < steps.length - 1) {
      scrollToStep(index + 1);
    }
  };

  const completedCount = steps.filter(s => answers[s.key] && answers[s.key].trim().length > 0).length;
  const isAllComplete = completedCount === steps.length;

  const handleSubmit = async () => {
    if (!isAllComplete || submitting) return;
    setSubmitting(true);
    try {
      await completeOnboarding(answers);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      console.error('Onboarding submit failed', err);
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex justify-center p-4 py-12 relative overflow-y-auto ambient-grid scroll-smooth">
      <div className="absolute top-[-15%] left-[20%] w-[400px] h-[400px] rounded-full bg-primary/4 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-lg relative z-10 animate-fade-in space-y-6 pb-20">
        {/* Header */}
        <div className="text-center mb-6 sticky top-0 bg-background/80 backdrop-blur-md py-4 z-20 border-b border-border/20">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center neon-glow border border-primary/20">
              <Terminal className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xl font-bold text-primary font-mono neon-text">CodeSage</span>
          </div>

          {/* Progress bar */}
          <div className="flex gap-1.5 max-w-xs mx-auto mt-3">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`flex-1 h-1.5 rounded-full transition-all duration-500 ${
                  answers[steps[i].key]?.trim()
                    ? 'bg-primary neon-glow'
                    : isUnlocked(i)
                    ? 'bg-primary/30'
                    : 'bg-secondary/40'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Questions Form Stack */}
        {steps.map((s, index) => {
          const unlocked = isUnlocked(index);
          const currentVal = answers[s.key] || '';
          const isFilled = currentVal.trim().length > 0;

          return (
            <div
              key={s.key}
              ref={el => (cardRefs.current[index] = el)}
              className={`glass-card rounded-2xl p-6 relative overflow-hidden transition-all duration-500 transform ${
                !unlocked
                  ? 'opacity-40 grayscale pointer-events-none scale-95 border-border/20'
                  : isFilled
                  ? 'border-primary/40 bg-secondary/10'
                  : 'border-primary/60 shadow-[0_0_20px_hsl(153,100%,50%,0.08)] scale-100'
              }`}
            >
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

              {/* Status Header */}
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-mono">
                  Question {index + 1} of {steps.length}
                </p>

                {isFilled ? (
                  <span className="flex items-center gap-1 text-xs text-primary font-mono">
                    <CheckCircle2 className="w-4 h-4" /> Answered
                  </span>
                ) : !unlocked ? (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground font-mono">
                    <Lock className="w-3.5 h-3.5" /> Locked
                  </span>
                ) : null}
              </div>

              <h2 className="text-lg font-semibold text-foreground mb-4 font-mono">
                {s.question}
                {unlocked && !isFilled && <span className="text-primary animate-pulse">_</span>}
              </h2>

              {/* Text Input */}
              {s.type === 'text' && (
                <div className="flex gap-2">
                  <input
                    type="text"
                    disabled={!unlocked}
                    placeholder={s.placeholder}
                    value={currentVal}
                    onChange={e => setAnswers({ ...answers, [s.key]: e.target.value })}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && currentVal.trim() && index < steps.length - 1) {
                        scrollToStep(index + 1);
                      }
                    }}
                    className="w-full bg-secondary/40 border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:shadow-[0_0_12px_hsl(153,100%,50%,0.1)] transition-all text-sm font-mono"
                  />
                  {currentVal.trim() && index < steps.length - 1 && (
                    <button
                      onClick={() => scrollToStep(index + 1)}
                      className="px-4 py-3 bg-primary/20 text-primary border border-primary/30 rounded-xl hover:bg-primary/30 transition-all font-mono text-xs font-bold"
                    >
                      Next
                    </button>
                  )}
                </div>
              )}

              {/* Date Input */}
              {s.type === 'date' && (
                <div className="flex gap-2">
                  <input
                    type="date"
                    disabled={!unlocked}
                    value={currentVal}
                    onChange={e => handleAnswerChange(s.key, e.target.value, index)}
                    className="w-full bg-secondary/40 border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary/50 transition-all text-sm font-mono"
                  />
                </div>
              )}

              {/* Choice Buttons */}
              {s.type === 'choice' && (
                <div className="space-y-2">
                  {s.options?.map(opt => (
                    <button
                      key={opt}
                      disabled={!unlocked}
                      onClick={() => handleAnswerChange(s.key, opt, index)}
                      className={`w-full text-left px-4 py-3 rounded-xl border transition-all text-sm font-mono ${
                        currentVal === opt
                          ? 'border-primary/50 bg-primary/10 text-primary neon-border'
                          : 'border-border/40 bg-secondary/20 text-foreground hover:border-primary/20 hover:bg-secondary/30'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}

              {/* Goal Cards */}
              {s.type === 'goalCards' && (
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { val: 'Learn Code', icon: <Code2 className="w-8 h-8 text-primary" /> },
                    { val: 'Edit Code Live', icon: <Pen className="w-8 h-8 text-primary" /> },
                  ].map(g => (
                    <button
                      key={g.val}
                      disabled={!unlocked}
                      onClick={() => handleAnswerChange(s.key, g.val, index)}
                      className={`flex flex-col items-center justify-center p-6 rounded-xl border transition-all ${
                        currentVal === g.val
                          ? 'bg-primary/10 border-primary/30 neon-border'
                          : 'bg-secondary/20 border-border/40 hover:border-primary/20'
                      }`}
                    >
                      <div className="mb-2">{g.icon}</div>
                      <span className="font-semibold text-xs text-foreground uppercase tracking-wide font-mono">
                        {g.val}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* Experience Level Cards */}
              {s.type === 'expCards' && (
                <div className="space-y-2">
                  {[
                    { val: 'Complete Beginner', icon: <Sprout className="w-5 h-5 text-primary" /> },
                    { val: 'Experienced', icon: <Rocket className="w-5 h-5 text-primary" /> },
                  ].map(e => (
                    <button
                      key={e.val}
                      disabled={!unlocked}
                      onClick={() => handleAnswerChange(s.key, e.val, index)}
                      className={`w-full flex items-center gap-3 px-5 py-4 rounded-xl border transition-all text-sm font-mono ${
                        currentVal === e.val
                          ? 'border-primary/50 bg-primary/10 neon-border'
                          : 'border-border/40 bg-secondary/20 hover:bg-secondary/30'
                      }`}
                    >
                      {e.icon}
                      <span className="font-semibold text-foreground uppercase tracking-wide">{e.val}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={!isAllComplete || submitting}
          className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:neon-glow disabled:opacity-30 transition-all text-sm font-mono uppercase tracking-wider shadow-lg sticky bottom-4 z-20"
        >
          {submitting ? 'Submitting...' : 'start()'}
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Onboarding;
