import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { 
  ChevronLeft, ChevronRight, CheckCircle2, ArrowRight,
  Terminal, Globe, Sparkles, Code2, Cpu, Compass,
  GraduationCap, Laptop, Briefcase, Rocket, Clock, Zap, Flame, ShieldAlert
} from 'lucide-react';
import { syncGoalWithDashboard } from '@/lib/goalHelper';

interface StepDef {
  key: string;
  question: string;
  subtitle?: string;
  placeholder?: string;
  type: 'text' | 'choice' | 'goalCards' | 'tourCards';
  options?: Array<{ label: string; sub?: string; icon?: React.ReactNode; value: string }>;
}

const steps: StepDef[] = [
  { 
    key: 'name', 
    question: 'What should we call you?', 
    subtitle: 'Enter your preferred name or engineering handle',
    placeholder: 'e.g. Shaheer, Alex, Sarah', 
    type: 'text' 
  },
  { 
    key: 'studying', 
    question: 'What best describes your current stage?', 
    subtitle: 'This helps calibrate your course pacing',
    type: 'choice', 
    options: [
      { label: 'Computer Science / IT Student', sub: 'University or College degree program', value: 'CS Student' },
      { label: 'Self-Taught Developer', sub: 'Building real projects independently', value: 'Self-Taught' },
      { label: 'Career Switcher', sub: 'Transitioning from non-tech into software engineering', value: 'Career Switcher' },
      { label: 'Absolute Beginner', sub: 'Zero prior programming knowledge', value: 'Absolute Beginner' },
    ] 
  },
  { 
    key: 'goal', 
    question: 'What is your primary engineering goal?', 
    subtitle: 'We will personalize your initial dashboard tracks. You can switch to All Tracks anytime.',
    type: 'goalCards' 
  },
  {
    key: 'dailyPace',
    question: 'What is your daily learning target?',
    subtitle: 'Consistent daily coding protects your streak',
    type: 'choice',
    options: [
      { label: 'Casual (10 mins / day)', sub: 'Light daily momentum', value: '10m' },
      { label: 'Focused (20 mins / day)', sub: 'Recommended for steady progress', value: '20m' },
      { label: 'Intense (45+ mins / day)', sub: 'Fast-track career readiness', value: '45m' },
    ]
  },
  { 
    key: 'wantTour', 
    question: 'Would you like an interactive tour?', 
    subtitle: 'Choose how you want to begin your journey on CodeSage',
    type: 'tourCards' 
  },
];

const CAREER_GOALS = [
  {
    id: 'cyber',
    title: 'Cyber Security Specialist',
    desc: 'Linux, Networking, OWASP, Cryptography, Burp Suite, and Defensive Ops',
    icon: <ShieldAlert className="w-6 h-6 text-red-400" />,
    badge: 'New Track',
    accent: 'border-red-500/30 hover:border-red-500/60 bg-red-500/5',
  },
  {
    id: 'frontend',
    title: 'Modern Full-Stack & Web',
    desc: 'HTML, CSS, JavaScript, React, APIs, and Production Apps',
    icon: <Globe className="w-6 h-6 text-fuchsia-400" />,
    badge: 'Popular',
    accent: 'border-fuchsia-500/30 hover:border-fuchsia-500/60 bg-fuchsia-500/5',
  },
  {
    id: 'ai',
    title: 'AI & Machine Learning Engineer',
    desc: 'Neural Foundations, Applied GenAI, LLMs, and Autonomous Agents',
    icon: <Sparkles className="w-6 h-6 text-purple-400" />,
    badge: 'Trending',
    accent: 'border-purple-500/30 hover:border-purple-500/60 bg-purple-500/5',
  },
  {
    id: 'python',
    title: 'Python Software Engineer',
    desc: 'Python Core, Data Structures, OOP Architecture, and Capstone APIs',
    icon: <Code2 className="w-6 h-6 text-emerald-400" />,
    badge: 'Beginner Friendly',
    accent: 'border-emerald-500/30 hover:border-emerald-500/60 bg-emerald-500/5',
  },
  {
    id: 'systems',
    title: 'Systems & Core Programming',
    desc: 'Procedural C, Modern C++, Memory Layout, Networks, and Relational SQL',
    icon: <Cpu className="w-6 h-6 text-cyan-400" />,
    badge: 'Low-Level',
    accent: 'border-cyan-500/30 hover:border-cyan-500/60 bg-cyan-500/5',
  },
  {
    id: 'all',
    title: 'All-Round Explorer',
    desc: 'Show me all 19 tracks across every language, framework, and tool',
    icon: <Compass className="w-6 h-6 text-primary" />,
    badge: 'Full Catalog',
    accent: 'border-primary/30 hover:border-primary/60 bg-primary/5',
  },
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
    }, 350);
  };

  const handleAnswer = (key: string, val: string) => {
    setAnswers(prev => ({ ...prev, [key]: val }));
  };

  const handleChoiceSelect = (key: string, val: string) => {
    setAnswers(prev => ({ ...prev, [key]: val }));
    setTimeout(() => goToStep(currentIndex + 1), 220);
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
      const wantTour = answers.wantTour === 'yes';
      const chosenGoal = answers.goal || 'all';

      // Save tour preference and chosen goal locally
      try {
        localStorage.setItem(`codesage_tour_seen_${user.id}`, wantTour ? 'false' : 'true');
        syncGoalWithDashboard(chosenGoal, user.id);
      } catch {}

      await completeOnboarding({
        name: answers.name || user.name,
        goal: chosenGoal,
        hasSeenTour: !wantTour,
      });

      navigate('/dashboard', { replace: true });
    } catch (err) {
      console.error('Onboarding submit failed', err);
      setSubmitting(false);
    }
  };

  const getCardAnimationClass = () => {
    if (!isTransitioning) return 'translate-y-0 opacity-100 scale-100';
    return direction === 'up'
      ? '-translate-y-6 opacity-0 scale-95'
      : 'translate-y-6 opacity-0 scale-95';
  };

  const commonInputClass =
    'w-full bg-background/50 border border-border/60 rounded-2xl px-5 py-4 text-base text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/60 focus:bg-secondary/20 focus:shadow-[0_0_20px_hsl(153,100%,50%,0.08)] transition-all font-mono';

  const renderInput = () => {
    switch (currentStep.type) {
      case 'text': {
        const isNextDisabled = !currentValue.trim();
        return (
          <div className="space-y-4">
            <input
              ref={inputRef}
              type="text"
              placeholder={currentStep.placeholder}
              value={currentValue}
              onChange={e => handleAnswer(currentStep.key, e.target.value)}
              onKeyDown={handleKeyDown}
              className={commonInputClass}
              autoFocus
            />
            <button
              type="button"
              onClick={() => goToStep(currentIndex + 1)}
              disabled={isNextDisabled || isTransitioning}
              className={`w-full py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all duration-300 text-xs font-mono uppercase tracking-widest ${
                isNextDisabled
                  ? 'bg-secondary/40 text-muted-foreground cursor-not-allowed'
                  : 'bg-primary text-primary-foreground hover:shadow-[0_0_25px_hsl(153,100%,50%,0.3)] hover:scale-[1.01]'
              }`}
            >
              Continue
              <ChevronRight className="w-4 h-4" />
            </button>
            {!isNextDisabled && (
              <p className="text-center text-[11px] text-muted-foreground font-mono">
                Press Enter ↵
              </p>
            )}
          </div>
        );
      }

      case 'choice':
        return (
          <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
            {currentStep.options?.map(opt => {
              const isSelected = currentValue === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleChoiceSelect(currentStep.key, opt.value)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 group flex items-center justify-between ${
                    isSelected
                      ? 'border-primary bg-primary/10 text-primary shadow-[0_0_15px_hsl(153,100%,50%,0.1)]'
                      : 'border-border/40 bg-secondary/10 text-foreground hover:border-primary/40 hover:bg-secondary/20 hover:translate-x-1'
                  }`}
                >
                  <div className="space-y-0.5">
                    <p className="font-semibold text-sm font-mono">{opt.label}</p>
                    {opt.sub && <p className="text-xs text-muted-foreground">{opt.sub}</p>}
                  </div>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-primary shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>
        );

      case 'goalCards':
        return (
          <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
            {CAREER_GOALS.map(goal => {
              const isSelected = currentValue === goal.id;
              return (
                <button
                  key={goal.id}
                  type="button"
                  onClick={() => handleChoiceSelect(currentStep.key, goal.id)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 group flex items-start gap-3.5 ${
                    isSelected
                      ? 'border-primary bg-primary/15 text-foreground shadow-[0_0_20px_hsl(153,100%,50%,0.15)] ring-1 ring-primary/40'
                      : `${goal.accent} text-foreground hover:scale-[1.01]`
                  }`}
                >
                  <div className="p-2 rounded-xl bg-background/50 border border-border/40 shrink-0 mt-0.5">
                    {goal.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-bold text-sm text-foreground">{goal.title}</span>
                      <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-secondary/50 text-muted-foreground border border-border/30">
                        {goal.badge}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                      {goal.desc}
                    </p>
                  </div>
                  {isSelected && <CheckCircle2 className="w-5 h-5 text-primary shrink-0 self-center" />}
                </button>
              );
            })}
          </div>
        );

      case 'tourCards':
        return (
          <div className="space-y-3">
            {[
              {
                value: 'yes',
                title: '🚀 Yes, show me around',
                desc: 'Take a 60-second interactive tour of the editor, daily challenges, and tracks.',
                badge: 'Recommended for first visit',
              },
              {
                value: 'no',
                title: '⚡ No, jump straight to my goal',
                desc: 'Skip the tour and open my personalized curriculum immediately.',
                badge: 'Fast track',
              },
            ].map(opt => {
              const isSelected = currentValue === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleAnswer(currentStep.key, opt.value)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 group flex items-start gap-3.5 ${
                    isSelected
                      ? 'border-primary bg-primary/15 text-foreground shadow-[0_0_20px_hsl(153,100%,50%,0.15)] ring-1 ring-primary/40'
                      : 'border-border/40 bg-secondary/10 hover:border-primary/40 hover:bg-secondary/20 hover:scale-[1.01]'
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-bold text-sm text-foreground">{opt.title}</p>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-secondary/60 text-muted-foreground border border-border/30">
                        {opt.badge}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{opt.desc}</p>
                  </div>
                  {isSelected && <CheckCircle2 className="w-5 h-5 text-primary shrink-0 self-center" />}
                </button>
              );
            })}
          </div>
        );

      default:
        return null;
    }
  };

  const isLastStep = currentIndex === steps.length - 1;
  const canSubmit = isLastStep && !!currentValue.trim();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden ambient-grid">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[150px] pointer-events-none" />

      <div className="w-full max-w-lg relative z-10">
        {/* Header & Progress */}
        <div className="mb-6 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 neon-glow">
                <Terminal className="w-4 h-4 text-primary" />
              </div>
              <span className="text-base font-bold text-primary font-mono neon-text">CodeSage</span>
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
        <div className="relative min-h-[480px] flex flex-col">
          <div
            className={`w-full bg-card/70 backdrop-blur-xl border border-border/50 rounded-3xl p-6 sm:p-8 flex flex-col transition-all duration-300 ease-out shadow-[0_8px_32px_0_rgba(0,0,0,0.2)] ${getCardAnimationClass()}`}
          >
            {/* Top Navigation */}
            <div className="flex items-center justify-between mb-5">
              <button
                type="button"
                onClick={() => goToStep(currentIndex - 1)}
                disabled={currentIndex === 0 || isTransitioning}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary disabled:opacity-0 disabled:pointer-events-none transition-all font-mono cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <div className="px-2.5 py-0.5 rounded-md bg-secondary/30 text-[10px] text-muted-foreground uppercase tracking-widest font-mono">
                Step {currentIndex + 1}
              </div>
            </div>

            {/* Question Title & Subtitle */}
            <div className="mb-5">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground font-mono leading-tight">
                {currentStep.question}
                {!isTransitioning && <span className="text-primary animate-pulse ml-0.5">_</span>}
              </h2>
              {currentStep.subtitle && (
                <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed font-sans">
                  {currentStep.subtitle}
                </p>
              )}
            </div>

            {/* Input Area */}
            <div className="flex-1 flex flex-col justify-center">
              {renderInput()}
            </div>
          </div>
        </div>

        {/* Submit Button (Only on final step) */}
        {isLastStep && (
          <div className="mt-4 transition-all duration-300">
            <button
              onClick={handleSubmit}
              disabled={!canSubmit || submitting}
              className="w-full bg-primary text-primary-foreground py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:shadow-[0_0_30px_hsl(153,100%,50%,0.3)] hover:scale-[1.01] disabled:opacity-40 disabled:cursor-not-allowed transition-all text-xs font-mono uppercase tracking-widest"
            >
              {submitting ? 'Initializing Workspace...' : 'Launch CodeSage'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
