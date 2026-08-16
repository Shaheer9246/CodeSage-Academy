import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { ChevronLeft, ChevronRight, Sprout, Rocket, Code2, Pen, Terminal, CheckCircle2, ArrowRight } from 'lucide-react';

const steps = [
  { key: 'name', question: 'What is your name?', placeholder: 'Enter your full name', type: 'text' },
  { key: 'studying', question: 'What are you currently studying?', placeholder: 'e.g., Computer Science, High School', type: 'text' },
  { key: 'hasJob', question: 'Do you have any job or work?', type: 'choice', options: ['Student only', 'Part-time job', 'Full-time job', 'Freelancer', 'Unemployed'] },
  { key: 'dob', question: 'What is your date of birth?', placeholder: 'Select your birth date', type: 'date' },
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
    // Instant advance for choices/cards (slightly delayed for visual feedback)
    setTimeout(() => goToStep(currentIndex + 1), 250);
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

  const commonInputClass =
    'w-full bg-background/40 border border-border/60 rounded-2xl px-5 py-4 text-lg text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/60 focus:bg-secondary/20 focus:shadow-[0_0_20px_hsl(153,100%,50%,0.08)] transition-all font-mono';

  const renderInput = () => {
    switch (currentStep.type) {
      case 'text':
      case 'date':
        const isNextDisabled = !currentValue.trim();
        return (
          <div className="space-y-6">
            <input
              ref={inputRef as any}
              type={currentStep.type}
              placeholder={currentStep.placeholder}
              value={currentValue}
              onChange={e => handleAnswer(currentStep.key, e.target.value)}
              onKeyDown={handleKeyDown}
              className={`${commonInputClass} ${currentStep.type === 'date' ? 'cursor-pointer' : ''}`}
              autoFocus
            />
            
            {/* Explicit Next Button for Text/Date */}
            <button
              type="button"
              onClick={() => goToStep(currentIndex + 1)}
              disabled={isNextDisabled || isTransitioning}
              className={`w-full py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all duration-300 text-sm font-mono uppercase tracking-widest ${
                isNextDisabled
                  ? 'bg-secondary/50 text-muted-foreground cursor-not-allowed'
                  : 'bg-primary text-primary-foreground hover:shadow-[0_0_25px_hsl(153,100%,50%,0.3)] hover:scale-[1.01]'
              }`}
            >
              Continue
              <ChevronRight className="w-4 h-4" />
            </button>

            {!isNextDisabled && (
              <p className="text-center text-xs text-muted-foreground font-mono animate-fade-in">
                Or press Enter ↵
              </p>
            )}
          </div>
        );

      case 'choice':
        return (
          <div className="space-y-2.5 max-h-[280px] overflow-y-auto pr-1 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-primary/20 [&::-webkit-scrollbar-thumb]:rounded-full">
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
                  {currentValue === opt && <CheckCircle2 className="w-4 h-4 text-primary" />}
                </span>
              </button>
            ))}
          </div>
        );

      case 'goalCards':
        return (
          <div className="grid grid-cols-2 gap-4">
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
          <div className="space-y-3">
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
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[150px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Header & Progress */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 neon-glow">
                <Terminal className="w-5 h-5 text-primary" />
              </div>
              <span className="text-lg font-bold text-primary font-mono neon-text">CodeSage</span>
            </div>
            <span className="text-xs text-muted-foreground font-mono tracking-wider">
              {currentIndex + 1} / {steps.length}
            </span>
          </div>
          
          {/* Segmented Progress Bar */}
          <div className="flex gap-1.5">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition-all duration-500 ease-out ${
                  i <= currentIndex ? 'bg-primary neon-glow' : 'bg-secondary/30'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Card Viewport */}
        <div className="relative min-h-[480px] perspective-1000 flex flex-col">
          {/* Current / Exiting Card */}
          <div
            className={`absolute inset-0 bg-card/60 backdrop-blur-xl border border-border/50 rounded-3xl p-8 flex flex-col transition-all duration-400 ease-[cubic-bezier(0.32,0.72,0,1)] shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] ${getCardAnimationClass()}`}
          >
            {/* Question Counter & Back Button */}
            <div className="flex items-center justify-between mb-6">
              <button
                type="button"
                onClick={() => goToStep(currentIndex - 1)}
                disabled={currentIndex === 0 || isTransitioning}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary disabled:opacity-0 disabled:pointer-events-none transition-all font-mono cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <div className={`px-2 py-0.5 rounded-md bg-secondary/30 text-[10px] text-muted-foreground uppercase tracking-widest font-mono`}>
                {currentStep.type === 'text' || currentStep.type === 'date' ? 'Input' : 'Select'}
              </div>
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
          </div>

          {/* Incoming Card Preview */}
          {isTransitioning && currentIndex + 1 < steps.length && (
            <div
              className={`absolute inset-0 bg-card/60 backdrop-blur-xl border border-border/50 rounded-3xl p-8 flex flex-col transition-all duration-400 ease-[cubic-bezier(0.32,0.72,0,1)] shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] ${getNextCardPreviewClass()}`}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-4 bg-secondary/20 rounded animate-pulse" />
                <div className={`px-2 py-0.5 rounded-md bg-secondary/30 text-[10px] text-muted-foreground uppercase tracking-widest font-mono`}>
                  {steps[currentIndex + 1].type === 'text' || steps[currentIndex + 1].type === 'date' ? 'Input' : 'Select'}
                </div>
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-6 font-mono leading-tight animate-pulse">
                {steps[currentIndex + 1].question}
              </h2>
            </div>
          )}
        </div>

        {/* Submit Button - Only shows on last step when answered */}
        <div className={`mt-8 transition-all duration-300 ${canSubmit ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none h-0 overflow-hidden mt-0'}`}>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full bg-primary text-primary-foreground py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:shadow-[0_0_30px_hsl(153,100%,50%,0.3)] hover:scale-[1.01] disabled:opacity-50 transition-all text-sm font-mono uppercase tracking-widest"
          >
            {submitting ? 'Initializing...' : 'start()'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
