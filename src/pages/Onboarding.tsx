import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { ChevronLeft, ChevronRight, Sprout, Rocket, Code2, Pen, Terminal, CheckCircle2, ArrowUp } from 'lucide-react';

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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<'up' | 'down'>('up');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { user, completeOnboarding } = useUser();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  // Auto-focus text/date inputs on step change
  useEffect(() => {
    if (!isTransitioning && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [currentIndex, isTransitioning]);

  if (!user) return null;

  const currentStep = steps[currentIndex];
  const currentValue = answers[currentStep.key] || '';
  const progress = ((currentIndex + (currentValue.trim() ? 1 : 0)) / steps.length) * 100;

  const goToStep = (nextIndex: number) => {
    if (nextIndex < 0 || nextIndex >= steps.length || isTransitioning) return;
    setDirection(nextIndex > currentIndex ? 'up' : 'down');
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(nextIndex);
      setIsTransitioning(false);
    }, 400); // Match CSS transition duration
  };

 const handleAnswer = (key: string, val: string) => {
  setAnswers(prev => ({ ...prev, [key]: val }));
};

  const handleChoiceSelect = (key: string, val: string) => {
    setAnswers(prev => ({ ...prev, [key]: val }));
    // Instant advance for choices/cards
    setTimeout(() => goToStep(currentIndex + 1), 150);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && currentValue.trim() && currentIndex < steps.length - 1) {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      goToStep(currentIndex + 1);
    }
  };

  const handleSubmit = async () => {
    if (currentIndex !== steps.length - 1 || !currentValue.trim() || submitting) return;
    setSubmitting(true);
    try {
      await completeOnboarding(answers);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      console.error('Onboarding submit failed', err);
      setSubmitting(false);
    }
  };

  // Animation classes based on transition state
  const getCardAnimationClass = () => {
    if (!isTransitioning) return 'translate-y-0 opacity-100 scale-100';
    return direction === 'up'
      ? '-translate-y-8 opacity-0 scale-95'
      : 'translate-y-8 opacity-0 scale-95';
  };

  const getNextCardPreviewClass = () => {
    if (!isTransitioning) return 'translate-y-8 opacity-0 scale-95';
    return 'translate-y-0 opacity-100 scale-100';
  };

  const renderInput = () => {
    const commonInputClass =
      'w-full bg-background/50 border border-border/60 rounded-2xl px-5 py-4 text-lg text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/60 focus:bg-secondary/20 focus:shadow-[0_0_20px_hsl(153,100%,50%,0.06)] transition-all font-mono';

    switch (currentStep.type) {
      case 'text':
        return (
          <input
            ref={inputRef}
            type="text"
            placeholder={currentStep.placeholder}
            value={currentValue}
            onChange={e => handleAnswer(currentStep.key, e.target.value, true)}
            onKeyDown={handleKeyDown}
            className={commonInputClass}
            autoFocus
          />
        );

      case 'date':
        return (
          <input
            ref={inputRef as any}
            type="date"
            value={currentValue}
            onChange={e => handleAnswer(currentStep.key, e.target.value, true)}
            onKeyDown={handleKeyDown}
            className={`${commonInputClass} cursor-pointer`}
            autoFocus
          />
        );

      case 'choice':
        return (
          <div className="space-y-2.5 max-h-[250px] overflow-y-auto pr-1">
            {currentStep.options?.map(opt => (
              <button
                key={opt}
                onClick={() => handleChoiceSelect(currentStep.key, opt)}
                className={`w-full text-left px-5 py-4 rounded-2xl border transition-all duration-200 text-base font-mono group ${
                  currentValue === opt
                    ? 'border-primary bg-primary/10 text-primary shadow-[0_0_15px_hsl(153,100%,50%,0.1)]'
                    : 'border-border/40 bg-secondary/10 text-foreground hover:border-primary/30 hover:bg-secondary/20 hover:translate-x-1'
                }`}
              >
                <span className="flex items-center justify-between">
                  {opt}
                  {currentValue === opt && <CheckCircle2 className="w-4 h-4" />}
                </span>
              </button>
            ))}
          </div>
        );

      case 'goalCards':
        return (
          <div className="grid grid-cols-2 gap-3">
            {[
              { val: 'Learn Code', icon: <Code2 className="w-8 h-8" /> },
              { val: 'Edit Code Live', icon: <Pen className="w-8 h-8" /> },
            ].map(g => (
              <button
                key={g.val}
                onClick={() => handleChoiceSelect(currentStep.key, g.val)}
                className={`flex flex-col items-center justify-center p-6 rounded-2xl border transition-all duration-200 group ${
                  currentValue === g.val
                    ? 'bg-primary/10 border-primary/40 shadow-[0_0_20px_hsl(153,100%,50%,0.1)]'
                    : 'bg-secondary/10 border-border/30 hover:border-primary/20 hover:bg-secondary/20 hover:-translate-y-0.5'
                }`}
              >
                <div className={`mb-3 transition-colors ${currentValue === g.val ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'}`}>
                  {g.icon}
                </div>
                <span className="font-semibold text-xs uppercase tracking-wider font-mono text-foreground">
                  {g.val}
                </span>
              </button>
            ))}
          </div>
        );

      case 'expCards':
        return (
          <div className="space-y-2.5">
            {[
              { val: 'Complete Beginner', icon: <Sprout className="w-5 h-5" /> },
              { val: 'Experienced', icon: <Rocket className="w-5 h-5" /> },
            ].map(e => (
              <button
                key={e.val}
                onClick={() => handleChoiceSelect(currentStep.key, e.val)}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl border transition-all duration-200 text-sm font-mono group ${
                  currentValue === e.val
                    ? 'border-primary/50 bg-primary/10 shadow-[0_0_15px_hsl(153,100%,50%,0.1)]'
                    : 'border-border/40 bg-secondary/10 hover:border-primary/20 hover:bg-secondary/20 hover:translate-x-1'
                }`}
              >
                <span className={`transition-colors ${currentValue === e.val ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'}`}>
                  {e.icon}
                </span>
                <span className="font-semibold uppercase tracking-wide text-foreground">{e.val}</span>
                {currentValue === e.val && <CheckCircle2 className="w-4 h-4 ml-auto text-primary" />}
              </button>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  const isLastStep = currentIndex === steps.length - 1;
  const canSubmit = isLastStep && currentValue.trim();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden ambient-grid">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[150px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo Header */}
        <div className="flex items-center justify-center gap-2 mb-10 animate-fade-in">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 neon-glow">
            <Terminal className="w-5 h-5 text-primary" />
          </div>
          <span className="text-xl font-bold text-primary font-mono neon-text">CodeSage</span>
        </div>

        {/* Card Viewport - Fixed height container for smooth transitions */}
        <div className="relative min-h-[460px] perspective-1000 flex flex-col">
          {/* Current / Exiting Card */}
          <div
            className={`absolute inset-0 glass-card rounded-3xl p-8 flex flex-col transition-all duration-400 ease-[cubic-bezier(0.32,0.72,0,1)] ${getCardAnimationClass()}`}
          >
            {/* Integrated Progress Bar */}
            <div className="w-full h-1 bg-secondary/30 rounded-full mb-6 overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500 ease-out neon-glow"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Question Counter & Back Button */}
            <div className="flex items-center justify-between mb-3">
              <button
                type="button"
                onClick={() => goToStep(currentIndex - 1)}
                disabled={currentIndex === 0 || isTransitioning}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary disabled:opacity-0 transition-opacity font-mono cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-mono">
                Step {currentIndex + 1} / {steps.length}
              </p>
            </div>

            {/* Question Title */}
            <h2 className="text-2xl font-bold text-foreground mb-6 font-mono leading-tight">
              {currentStep.question}
              {!isTransitioning && <span className="text-primary animate-pulse ml-0.5">_</span>}
            </h2>

            {/* Input Area */}
            <div className="flex-1 flex flex-col justify-center">
              {renderInput()}
            </div>

            {/* Manual Next Hint for text/date */}
            {(currentStep.type === 'text' || currentStep.type === 'date') && currentValue.trim() && !isTransitioning && (
              <div className="mt-4 flex items-center justify-end gap-1.5 text-xs text-muted-foreground font-mono animate-fade-in">
                Press Enter or wait
                <ArrowUp className="w-3 h-3 rotate-90" />
              </div>
            )}
          </div>

          {/* Incoming Card Preview (only visible during transition) */}
          {isTransitioning && currentIndex + 1 < steps.length && (
            <div
              className={`absolute inset-0 glass-card rounded-3xl p-8 flex flex-col transition-all duration-400 ease-[cubic-bezier(0.32,0.72,0,1)] ${getNextCardPreviewClass()}`}
            >
              <div className="w-full h-1 bg-secondary/30 rounded-full mb-6 overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${((currentIndex + 1) / steps.length) * 100}%` }}
                />
              </div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-mono mb-3">
                Step {currentIndex + 2} / {steps.length}
              </p>
              <h2 className="text-2xl font-bold text-foreground mb-6 font-mono leading-tight">
                {steps[currentIndex + 1].question}
              </h2>
            </div>
          )}
        </div>

        {/* Submit Button - Only shows on last step when answered */}
        <div className={`mt-6 transition-all duration-300 ${canSubmit ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full bg-primary text-primary-foreground py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:neon-glow disabled:opacity-50 transition-all text-sm font-mono uppercase tracking-widest shadow-[0_4px_30px_hsl(153,100%,50%,0.2)]"
          >
            {submitting ? 'Initializing...' : 'start()'}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
