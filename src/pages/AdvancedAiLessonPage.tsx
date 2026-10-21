import { useMemo, useState } from 'react';
import { useGuestLessonGate } from '@/lib/guestGate';
import { useParams, useNavigate, Navigate, useSearchParams } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import {
  getAdvancedAiLessonById,
  isAdvancedAiLessonUnlocked
} from '@/data/advancedAiLesson';
import { saveLessonQuizAttempt } from '@/lib/quizStorage';
import {
  ArrowLeft,
  BookOpen,
  FlaskConical,
  ClipboardCheck,
  Check,
  X,
  ChevronRight,
  ChevronLeft,
  GraduationCap,
  Sparkles,
  Lightbulb,
  type LucideIcon
} from 'lucide-react';
import AiPracticalTerminal from '@/components/AiPracticalTerminal';
import CourseOverviewButton from '@/components/CourseOverviewButton';
import { AdBannerCard } from '@/components/AdBannerCard';

type Stage = 'concept' | 'practical' | 'quiz';

const renderStepText = (text: string) => {
  return text.split(/(`[^`]+`)/g).map((part, i) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code
          key={i}
          className="bg-secondary/60 text-primary px-1.5 py-0.5 rounded text-[11px] font-mono"
        >
          {part.slice(1, -1)}
        </code>
      );
    }

    return part;
  });
};

const STAGES: { key: Stage; icon: LucideIcon; label: string; hint: string }[] = [
  { key: 'concept', icon: BookOpen, label: 'Brief', hint: 'Understand it' },
  { key: 'practical', icon: FlaskConical, label: 'Lab', hint: 'Build it' },
  { key: 'quiz', icon: ClipboardCheck, label: 'Proof', hint: 'Prove it' },
];

const AdvancedAiLessonPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [sp] = useSearchParams();
  const from = sp.get('from');

  const backTo =
    from === 'roadmap'
      ? '/roadmap'
      : from === 'dashboard'
        ? '/advanced-ai?from=dashboard'
        : '/advanced-ai';

  const { user, completeLesson } = useUser();
  const lesson = id ? getAdvancedAiLessonById(id) : undefined;

  const [stage, setStage] = useState<Stage>('concept');
  const [conceptView, setConceptView] = useState<'beginner' | 'advanced'>('beginner');
  const [openConcept, setOpenConcept] = useState<number>(0);
  const [doneSteps, setDoneSteps] = useState<Record<number, boolean>>({});
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [qIndex, setQIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const { isGuest: __pgGuest } = useGuestLessonGate('ai', id);

  const quiz = lesson?.quiz ?? [];

  const correctCount = useMemo(() => {
    return quiz.reduce((acc, q, idx) => {
      return answers[idx] === q.correctIndex ? acc + 1 : acc;
    }, 0);
  }, [answers, quiz]);

  const passed = submitted && correctCount >= Math.min(3, quiz.length);

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <p className="text-muted-foreground mb-4 font-mono">Advanced AI Lesson not found.</p>
        <button
          onClick={() => navigate(backTo)}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-bold"
        >
          Return to Course
        </button>
      </div>
    );
  }

  const isUnlocked = isAdvancedAiLessonUnlocked(lesson.id, user.completedLessons);
  if (!isUnlocked && !user.completedLessons.includes(lesson.id)) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <p className="text-muted-foreground mb-4 font-mono">This lesson is locked. Complete previous lessons first.</p>
        <button
          onClick={() => navigate(backTo)}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-bold"
        >
          Back to Overview
        </button>
      </div>
    );
  }

  const handleFinish = async () => {
    saveLessonQuizAttempt(lesson.id, answers, quiz, lesson.title);

    if (passed) {
      await completeLesson(lesson.id);
      navigate(`/lesson-complete/${lesson.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Top bar */}
      <header className="border-b border-border/40 bg-card/60 backdrop-blur sticky top-0 z-30 px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(backTo)}
            className="p-1.5 hover:bg-secondary rounded-lg text-muted-foreground hover:text-foreground transition-colors"
            title="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xl">{lesson.icon}</span>
            <div>
              <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                Lesson {lesson.order} • {lesson.module}
              </p>
              <h1 className="text-sm font-bold font-display line-clamp-1">{lesson.title}</h1>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <CourseOverviewButton trackId="advanced-ai" />
          {/* Stage pills */}
          <div className="flex bg-secondary/80 p-1 rounded-xl gap-1 border border-border/50">
            {STAGES.map((s) => {
              const Icon = s.icon;
              const active = stage === s.key;
              return (
                <button
                  key={s.key}
                  onClick={() => setStage(s.key)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    active
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{s.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main stage area */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 pb-20">
        {/* Stage 1: Concepts */}
        {stage === 'concept' && (
          <div className="space-y-6">
            {/* Philosophy Box */}
            <div className="glass-card rounded-2xl p-5 border-l-4 border-l-primary space-y-2">
              <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
                <Lightbulb className="w-4 h-4" />
                The Core Insight
              </div>
              <p className="text-sm sm:text-base leading-relaxed text-foreground/90 font-sans">
                {lesson.philosophy}
              </p>
            </div>

            {/* Concept cards */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold font-display uppercase tracking-wider text-muted-foreground">
                  Core Architectural Concepts
                </h2>
                <div className="flex bg-secondary/80 p-0.5 rounded-lg border border-border/50 text-xs">
                  <button
                    onClick={() => setConceptView('beginner')}
                    className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                      conceptView === 'beginner'
                        ? 'bg-primary/20 text-primary'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Intuition
                  </button>
                  <button
                    onClick={() => setConceptView('advanced')}
                    className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                      conceptView === 'advanced'
                        ? 'bg-primary/20 text-primary'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Production Deep Dive
                  </button>
                </div>
              </div>

              {lesson.concepts.map((concept, idx) => {
                const isOpen = openConcept === idx;
                return (
                  <div
                    key={idx}
                    className="glass-card rounded-xl overflow-hidden border border-border/40 transition-all"
                  >
                    <button
                      onClick={() => setOpenConcept(isOpen ? -1 : idx)}
                      className="w-full p-4 text-left flex items-center justify-between font-bold text-sm hover:bg-secondary/40 transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-mono">
                          {idx + 1}
                        </span>
                        {concept.title}
                      </span>
                      <ChevronRight
                        className={`w-4 h-4 text-muted-foreground transition-transform ${
                          isOpen ? 'rotate-90 text-primary' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 pt-1 text-sm text-foreground/80 leading-relaxed border-t border-border/20">
                        {conceptView === 'beginner' ? concept.beginner : concept.advanced}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Milestones */}
            {lesson.milestones && lesson.milestones.length > 0 && (
              <div className="glass-card rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
                  <GraduationCap className="w-4 h-4" />
                  What You Will Master
                </div>
                <ul className="space-y-2">
                  {lesson.milestones.map((m, mi) => (
                    <li key={mi} className="text-xs sm:text-sm text-muted-foreground flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Bottom action */}
            <div className="flex justify-end pt-4">
              <button
                onClick={() => setStage('practical')}
                className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-bold rounded-xl shadow-lg hover:neon-border transition-all"
              >
                <span>Proceed to Hands-on Lab</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Stage 2: Practical Lab */}
        {stage === 'practical' && (
          <div className="space-y-6">
            <div className="glass-card rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
                <FlaskConical className="w-4 h-4" />
                {lesson.practical.title}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {lesson.practical.intro}
              </p>
            </div>

            {/* Practical steps */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold font-display uppercase tracking-wider text-muted-foreground">
                Execution Steps
              </h3>
              <div className="space-y-2">
                {lesson.practical.steps.map((step, idx) => {
                  const isDone = doneSteps[idx];
                  return (
                    <div
                      key={idx}
                      onClick={() => setDoneSteps((prev) => ({ ...prev, [idx]: !prev[idx] }))}
                      className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                        isDone
                          ? 'bg-success/10 border-success/30 text-foreground'
                          : 'glass-card border-border/40 hover:border-primary/40'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                          isDone
                            ? 'bg-success text-success-foreground'
                            : 'bg-secondary text-muted-foreground'
                        }`}
                      >
                        {isDone ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                      </div>
                      <span className="text-xs sm:text-sm font-medium">{renderStepText(step)}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Interactive Terminal / Workspace */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold font-display uppercase tracking-wider text-muted-foreground">
                Interactive Environment
              </h3>
              <AiPracticalTerminal
                lessonId={lesson.id}
                starterCode={lesson.practical.starterCode}
                solutionCode={lesson.practical.solutionCode}
              />
            </div>

            <div className="flex items-center justify-between pt-4">
              <button
                onClick={() => setStage('concept')}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground"
              >
                <ChevronLeft className="w-4 h-4" />
                Back to Brief
              </button>
              <button
                onClick={() => setStage('quiz')}
                className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-bold rounded-xl shadow-lg hover:neon-border transition-all"
              >
                <span>Proceed to Knowledge Proof</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Stage 3: Quiz Proof */}
        {stage === 'quiz' && (
          <div className="space-y-6">
            <div className="glass-card rounded-2xl p-5 space-y-2">
              <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
                <ClipboardCheck className="w-4 h-4" />
                Knowledge Proof
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Pass at least 3 questions to verify mastery and earn full XP.
              </p>
            </div>

            {/* Quiz question card */}
            {quiz.length > 0 && (
              <div className="glass-card rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
                  <span>Question {qIndex + 1} of {quiz.length}</span>
                  <span>Pass mark: 3/{quiz.length}</span>
                </div>

                <h3 className="text-sm sm:text-base font-bold font-display">
                  {quiz[qIndex]?.question}
                </h3>

                <div className="space-y-2.5 pt-2">
                  {quiz[qIndex]?.options.map((opt, optIdx) => {
                    const isSelected = answers[qIndex] === optIdx;
                    const showFeedback = submitted;
                    const isCorrect = optIdx === quiz[qIndex].correctIndex;

                    let btnStyle = 'border-border/40 hover:border-primary/50';
                    if (isSelected) {
                      btnStyle = 'border-primary bg-primary/10 text-primary font-semibold';
                    }
                    if (showFeedback) {
                      if (isCorrect) {
                        btnStyle = 'border-success bg-success/20 text-success font-semibold';
                      } else if (isSelected && !isCorrect) {
                        btnStyle = 'border-destructive bg-destructive/20 text-destructive';
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        disabled={submitted}
                        onClick={() => setAnswers((prev) => ({ ...prev, [qIndex]: optIdx }))}
                        className={`w-full p-3.5 rounded-xl border text-left text-xs sm:text-sm flex items-center justify-between transition-all ${btnStyle}`}
                      >
                        <span>{opt}</span>
                        {showFeedback && isCorrect && <Check className="w-4 h-4 text-success shrink-0" />}
                        {showFeedback && isSelected && !isCorrect && <X className="w-4 h-4 text-destructive shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                {submitted && (
                  <div className="p-3.5 bg-secondary/50 rounded-xl text-xs text-muted-foreground leading-relaxed border border-border/30 mt-3">
                    <strong className="text-foreground font-bold">Explanation: </strong>
                    {quiz[qIndex]?.explanation}
                  </div>
                )}

                {/* Pagination */}
                <div className="flex items-center justify-between pt-4 border-t border-border/20">
                  <button
                    disabled={qIndex === 0}
                    onClick={() => setQIndex((i) => Math.max(0, i - 1))}
                    className="px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground disabled:opacity-40"
                  >
                    Previous
                  </button>
                  <div className="flex gap-1.5">
                    {quiz.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setQIndex(i)}
                        className={`w-6 h-6 rounded-md text-[10px] font-bold font-mono transition-all ${
                          qIndex === i
                            ? 'bg-primary text-primary-foreground'
                            : answers[i] !== undefined
                              ? 'bg-secondary text-primary'
                              : 'bg-secondary/40 text-muted-foreground'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                  <button
                    disabled={qIndex === quiz.length - 1}
                    onClick={() => setQIndex((i) => Math.min(quiz.length - 1, i + 1))}
                    className="px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {/* Submission / Results card */}
            <div className="glass-card rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                {!submitted ? (
                  <p className="text-xs text-muted-foreground">
                    Answered {Object.keys(answers).length} of {quiz.length} questions.
                  </p>
                ) : (
                  <p className="text-sm font-bold">
                    Score: {correctCount} / {quiz.length} —{' '}
                    <span className={passed ? 'text-success' : 'text-destructive'}>
                      {passed ? 'Passed! 🎉' : 'Needs Review'}
                    </span>
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3">
                {!submitted ? (
                  <button
                    disabled={Object.keys(answers).length === 0}
                    onClick={() => setSubmitted(true)}
                    className="px-5 py-2.5 bg-primary text-primary-foreground font-bold rounded-xl shadow-lg hover:neon-border transition-all disabled:opacity-40"
                  >
                    Submit Proof
                  </button>
                ) : (
                  <>
                    {!passed && (
                      <button
                        onClick={() => {
                          setSubmitted(false);
                          setAnswers({});
                        }}
                        className="px-4 py-2 bg-secondary text-foreground rounded-xl text-xs font-semibold hover:bg-secondary/80"
                      >
                        Retry Quiz
                      </button>
                    )}
                    <button
                      disabled={!passed}
                      onClick={handleFinish}
                      className="px-5 py-2.5 bg-primary text-primary-foreground font-bold rounded-xl shadow-lg hover:neon-border transition-all disabled:opacity-40"
                    >
                      Complete Lesson & Claim XP
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer Ad Banner */}
      <div className="border-t border-border/20 p-2">
        <AdBannerCard slotName="lessonSidebar" format="horizontal-banner" />
      </div>
    </div>
  );
};

export default AdvancedAiLessonPage;
