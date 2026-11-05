import { useMemo, useState } from 'react';
import { useGuestLessonGate } from '@/lib/guestGate';
import { useParams, useNavigate, Navigate, useSearchParams } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { getCyberLessonById, isCyberLessonUnlocked } from '@/data/cyberLessons';
import {
  ArrowLeft, BookOpen, FlaskConical, ClipboardCheck,
  Check, X, ChevronRight, ChevronLeft, GraduationCap, Sparkles, Lightbulb, Terminal, Shield, type LucideIcon
} from 'lucide-react';
import { CyberTerminal } from '@/components/cyber/CyberTerminal';

type Stage = 'concept' | 'practical' | 'quiz';

const STAGES: { key: Stage; icon: LucideIcon; label: string; hint: string }[] = [
  { key: 'concept', icon: BookOpen, label: 'Brief', hint: 'Understand it' },
  { key: 'practical', icon: FlaskConical, label: 'Lab', hint: 'Build it' },
  { key: 'quiz', icon: ClipboardCheck, label: 'Proof', hint: 'Prove it' },
];

const FormattedText = ({ text }: { text: string }) => {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
  return (
    <span>
      {parts.map((part, i) => {
        if (part.startsWith('`') && part.endsWith('`')) {
          return (
            <code key={i} className="bg-secondary/60 text-primary px-1.5 py-0.5 rounded text-[11px] font-mono border border-border/40">
              {part.slice(1, -1)}
            </code>
          );
        }
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={i} className="font-semibold text-foreground">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </span>
  );
};

export default function CyberLessonPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [sp] = useSearchParams();
  const from = sp.get('from');
  const backTo = from === 'roadmap' ? '/roadmap' : from === 'dashboard' ? '/cyber?from=dashboard' : '/cyber';

  const { user, completeLesson } = useUser();
  const { isGuest: __pgGuest } = useGuestLessonGate('cyber', id || '');

  const lesson = id ? getCyberLessonById(id) : undefined;

  const [stage, setStage] = useState<Stage>('concept');
  const [conceptView, setConceptView] = useState<'beginner' | 'advanced'>('beginner');
  const [openConcept, setOpenConcept] = useState<number>(0);

  // Practical state
  const [labMode, setLabMode] = useState<'terminal' | 'checklist'>('terminal');
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  // Quiz state
  const [qIndex, setQIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizPassed, setQuizPassed] = useState(false);

  const quiz = lesson?.quiz ?? [];
  const correctCount = useMemo(
    () => quiz.filter((q, i) => selectedOptions[i] === q.correctIndex).length,
    [quiz, selectedOptions]
  );
  const passingScore = Math.ceil(quiz.length * 0.75);
  const passed = correctCount >= passingScore;
  const stageIndex = STAGES.findIndex(s => s.key === stage);
  const stepsDone = completedSteps.size;
  const journey = Math.round(
    ((stageIndex + (stage === 'quiz' && quizSubmitted && passed ? 1 : 0)) / STAGES.length) * 100
  );

  if (!user && !__pgGuest) return <Navigate to="/auth" replace />;
  if (!lesson) return <Navigate to="/roadmap" replace />;
  if (user && !isCyberLessonUnlocked(lesson.id, (user?.completedLessons || []))) {
    return <Navigate to="/roadmap" replace />;
  }

  const toggleStep = (index: number) => {
    const next = new Set(completedSteps);
    if (next.has(index)) next.delete(index);
    else next.add(index);
    setCompletedSteps(next);
  };

  const handleOptionSelect = (qi: number, optIdx: number) => {
    if (quizSubmitted) return;
    setSelectedOptions(prev => ({ ...prev, [qi]: optIdx }));
  };

  const handleSubmitQuiz = () => {
    setQuizPassed(passed);
    setQuizSubmitted(true);
    if (passed) {
      if (user) completeLesson(lesson.id);
      setTimeout(() => navigate('/complete/' + lesson.id), 1200);
    }
  };

  const retryQuiz = () => {
    setQuizSubmitted(false);
    setSelectedOptions({});
    setQIndex(0);
    setQuizPassed(false);
  };

  return (
    <div className="min-h-screen bg-background grid-bg text-foreground">
      {/* ── Command bar ─────────────────────────────── */}
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-background/85 border-b border-border/30">
        <div className="max-w-6xl mx-auto px-3 py-2.5 flex items-center gap-3">
          <button
            onClick={() => navigate(backTo)}
            className="text-muted-foreground hover:text-foreground p-1.5 rounded-lg hover:bg-secondary/50 transition-colors"
            aria-label="Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-[0.18em] truncate">
              {lesson.module}
            </p>
            <h1 className="font-display font-bold text-sm text-foreground truncate flex items-center gap-1.5">
              <span>{lesson.icon}</span> {lesson.title}
            </h1>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-mono px-2.5 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary shrink-0">
            <Sparkles className="w-3 h-3" /> +1 XP · +2 ◈
          </div>
        </div>
        <div className="h-0.5 bg-secondary/40">
          <div
            className="h-full bg-gradient-to-r from-primary to-emerald-400 transition-all duration-500"
            style={{ width: `${Math.max(journey, 6)}%` }}
          />
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-3 md:px-5 py-4 md:py-6 pb-28 md:flex md:gap-6">
        {/* ── Stage rail ────────────────────────────── */}
        <nav className="md:w-52 md:shrink-0 mb-4 md:mb-0">
          <div className="md:sticky md:top-24 flex md:flex-col gap-2">
            {STAGES.map((s, i) => {
              const active = stage === s.key;
              const done = i < stageIndex || (s.key === 'quiz' && quizSubmitted && passed);
              return (
                <button
                  key={s.key}
                  onClick={() => setStage(s.key)}
                  className={`flex-1 md:flex-none flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-left transition-all ${
                    active
                      ? 'border-primary/50 bg-primary/10 text-primary shadow-[0_0_20px_-8px_hsl(var(--primary))]'
                      : 'border-border/30 bg-card/40 text-muted-foreground hover:border-primary/25 hover:text-foreground'
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-lg grid place-items-center shrink-0 border text-[10px] font-mono ${
                      done ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-400' : 'border-current/30 bg-background/40'
                    }`}
                  >
                    {done ? <Check className="w-3 h-3" /> : <s.icon className="w-3 h-3" />}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs font-display font-semibold leading-tight">{s.label}</span>
                    <span className="hidden md:block text-[10px] opacity-70 leading-tight">{s.hint}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* ── Stage content ─────────────────────────── */}
        <main className="flex-1 min-w-0">
          {/* STAGE 1: BRIEF */}
          {stage === 'concept' && (
            <div className="space-y-5 animate-fade-in">
              <section className="relative overflow-hidden rounded-3xl border border-primary/25 bg-gradient-to-br from-primary/12 via-card/60 to-transparent p-5">
                <p className="text-[10px] font-mono text-primary uppercase tracking-[0.2em] mb-2 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" /> Mission brief
                </p>
                <p className="text-sm md:text-base text-foreground leading-relaxed italic">
                  "{lesson.philosophy}"
                </p>
                <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
              </section>

              {lesson.terminalNotice && (
                <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/10 p-4 flex gap-3 items-start font-mono text-xs text-emerald-400">
                  <Terminal className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block mb-1 text-emerald-300 tracking-wider">SYSTEM NOTICE</span>
                    <FormattedText text={lesson.terminalNotice} />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between gap-3">
                <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.18em]">
                  Breakdown · {lesson.concepts.length} ideas
                </p>
                <div className="flex p-0.5 rounded-full border border-border/40 bg-card/60">
                  {(['beginner', 'advanced'] as const).map(v => (
                    <button
                      key={v}
                      onClick={() => setConceptView(v)}
                      className={`px-3 py-1 rounded-full text-[10px] font-display font-semibold capitalize transition-all ${
                        conceptView === v ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              {/* Accordion spine */}
              <div className="relative pl-5">
                <span className="absolute left-[9px] top-2 bottom-2 w-px bg-gradient-to-b from-primary/50 via-border/40 to-transparent" />
                <div className="space-y-2.5">
                  {lesson.concepts.map((c, i) => {
                    const open = openConcept === i;
                    return (
                      <div key={i} className="relative">
                        <span
                          className={`absolute -left-5 top-4 w-[11px] h-[11px] rounded-full border-2 transition-colors ${
                            open ? 'bg-primary border-primary' : 'bg-background border-border'
                          }`}
                        />
                        <button
                          onClick={() => setOpenConcept(open ? -1 : i)}
                          className={`w-full text-left glass-card rounded-2xl px-4 py-3 border transition-all ${
                            open ? 'border-primary/35' : 'border-border/25 hover:border-primary/20'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span className="text-[10px] font-mono text-primary">{String(i + 1).padStart(2, '0')}</span>
                            <span className="flex-1 font-display font-bold text-sm text-foreground">{c.title}</span>
                            <ChevronRight
                              className={`w-4 h-4 text-muted-foreground transition-transform ${open ? 'rotate-90' : ''}`}
                            />
                          </span>
                          {open && (
                            <div className="text-xs text-muted-foreground leading-relaxed mt-2.5 animate-fade-in">
                              <FormattedText text={conceptView === 'beginner' ? c.beginner : c.advanced} />
                            </div>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Key Takeaways */}
              {lesson.keyTakeaways && lesson.keyTakeaways.length > 0 && (
                <div className="glass-card rounded-2xl p-5 border border-border/30">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-primary font-bold mb-3 flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-400" /> Key Takeaways
                  </h3>
                  <ul className="space-y-2">
                    {lesson.keyTakeaways.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-muted-foreground leading-relaxed">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                        <FormattedText text={item} />
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* STAGE 2: LAB */}
          {stage === 'practical' && (
            <div className="space-y-6 animate-fade-in">
              <section className="rounded-3xl border border-amber-500/25 bg-gradient-to-br from-amber-500/10 to-transparent p-5">
                <p className="text-[10px] font-mono text-amber-400 uppercase tracking-[0.2em] mb-2 flex items-center gap-1">
                  <FlaskConical className="w-3 h-3" /> Practical lab
                </p>
                <h2 className="font-display font-bold text-base md:text-lg text-foreground mb-1">
                  {lesson.practical.title}
                </h2>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {lesson.practical.intro}
                </p>
              </section>

              {/* Lab Mode Switcher */}
              <div className="flex items-center gap-1 bg-card/60 p-1 rounded-xl border border-border/40 w-fit">
                <button
                  onClick={() => setLabMode('terminal')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    labMode === 'terminal'
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Interactive Terminal</span>
                </button>
                <button
                  onClick={() => setLabMode('checklist')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    labMode === 'checklist'
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <ClipboardCheck className="w-3.5 h-3.5" />
                  <span>Simple Checklist</span>
                </button>
              </div>

              {labMode === 'terminal' ? (
                <CyberTerminal
                  lessonId={lesson.id}
                  steps={lesson.practical.steps}
                  goal={lesson.practical.goal}
                  completedSteps={completedSteps}
                  onToggleStep={toggleStep}
                />
              ) : (
                <div className="glass-card rounded-2xl p-4 border border-border/30">
                  <div className="mb-4">
                    <p className="text-[10px] font-mono text-primary uppercase tracking-wider mb-2 flex items-center gap-1">
                      <Lightbulb className="w-3 h-3" /> Goal
                    </p>
                    <p className="text-sm text-foreground leading-relaxed">{lesson.practical.goal}</p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-border/10">
                      <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Steps</p>
                      <span className="text-[10px] font-mono text-primary">
                        {stepsDone}/{lesson.practical.steps.length}
                      </span>
                    </div>
                    <ol className="space-y-2">
                      {lesson.practical.steps.map((step, idx) => {
                        const done = completedSteps.has(idx);
                        return (
                          <li key={idx}>
                            <button
                              onClick={() => toggleStep(idx)}
                              className={`w-full flex gap-3 text-left rounded-xl px-3 py-2.5 border transition-all ${
                                done ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-border/20 hover:border-primary/20'
                              }`}
                            >
                              <span
                                className={`w-5 h-5 rounded-full grid place-items-center shrink-0 text-[10px] font-mono border ${
                                  done
                                    ? 'border-emerald-500/50 bg-emerald-500/20 text-emerald-400'
                                    : 'border-border/50 text-muted-foreground'
                                }`}
                              >
                                {done ? <Check className="w-3 h-3" /> : idx + 1}
                              </span>
                              <span className={`text-xs leading-relaxed flex-1 ${done ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                                <FormattedText text={step} />
                              </span>
                            </button>
                          </li>
                        );
                      })}
                    </ol>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STAGE 3: PROOF / QUIZ */}
          {stage === 'quiz' && (
            <div className="space-y-4 animate-fade-in">
              {!quizSubmitted ? (
                <>
                  <section className="rounded-3xl border border-primary/25 bg-gradient-to-br from-primary/10 to-transparent p-5 flex items-center gap-3">
                    <GraduationCap className="w-5 h-5 text-primary shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-display font-bold text-foreground">Mastery check</p>
                      <p className="text-[11px] text-muted-foreground">
                        Score {passingScore}/{quiz.length} to finish this mission.
                      </p>
                    </div>
                    <div className="flex gap-1.5">
                      {quiz.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setQIndex(i)}
                          className={`w-2.5 h-2.5 rounded-full transition-all ${
                            i === qIndex
                              ? 'bg-primary scale-125'
                              : selectedOptions[i] !== undefined
                              ? 'bg-primary/50'
                              : 'bg-secondary'
                          }`}
                          aria-label={`Question ${i + 1}`}
                        />
                      ))}
                    </div>
                  </section>

                  {quiz[qIndex] && (
                    <div className="glass-card rounded-2xl p-5" key={qIndex}>
                      <p className="text-[10px] font-mono text-muted-foreground mb-2 uppercase tracking-[0.18em]">
                        Question {qIndex + 1} of {quiz.length}
                      </p>
                      <p className="text-sm md:text-base font-display font-semibold text-foreground mb-4">
                        {quiz[qIndex].question}
                      </p>
                      <div className="space-y-2">
                        {quiz[qIndex].options.map((opt, oi) => {
                          const isSelected = selectedOptions[qIndex] === oi;
                          return (
                            <button
                              key={oi}
                              onClick={() => handleOptionSelect(qIndex, oi)}
                              className={`w-full text-left px-3.5 py-3 rounded-xl border text-xs leading-relaxed transition-all flex items-center gap-3 ${
                                isSelected
                                  ? 'border-primary bg-primary/15 text-primary font-semibold shadow-[0_0_15px_-5px_hsl(var(--primary))]'
                                  : 'border-border/30 bg-card/30 text-foreground hover:border-primary/25 hover:bg-card/50'
                              }`}
                            >
                              <span
                                className={`w-5 h-5 rounded-full border grid place-items-center text-[10px] font-mono shrink-0 ${
                                  isSelected
                                    ? 'border-primary bg-primary text-primary-foreground font-bold'
                                    : 'border-border/60 text-muted-foreground'
                                }`}
                              >
                                {String.fromCharCode(65 + oi)}
                              </span>
                              <span className="flex-1">{opt}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Navigation buttons inside quiz card */}
                      <div className="flex items-center justify-between mt-5 pt-3 border-t border-border/20">
                        <button
                          onClick={() => setQIndex(p => Math.max(0, p - 1))}
                          disabled={qIndex === 0}
                          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:hover:text-muted-foreground transition-colors px-2 py-1"
                        >
                          <ChevronLeft className="w-4 h-4" /> Prev
                        </button>
                        {qIndex < quiz.length - 1 ? (
                          <button
                            onClick={() => setQIndex(p => Math.min(quiz.length - 1, p + 1))}
                            className="flex items-center gap-1.5 text-xs text-primary font-semibold hover:underline px-2 py-1"
                          >
                            Next <ChevronRight className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={handleSubmitQuiz}
                            disabled={selectedOptions[qIndex] === undefined}
                            className="flex items-center gap-1.5 text-xs bg-primary text-primary-foreground font-semibold px-3 py-1.5 rounded-lg disabled:opacity-40 transition-all"
                          >
                            Submit <Check className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                /* Results card */
                <div className="space-y-4">
                  <div
                    className={`rounded-2xl p-6 border text-center ${
                      quizPassed
                        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                        : 'border-destructive/30 bg-destructive/10 text-destructive'
                    }`}
                  >
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-background/50 border border-current/20 mb-3">
                      {quizPassed ? <GraduationCap className="w-6 h-6" /> : <X className="w-6 h-6" />}
                    </div>
                    <p className="font-display font-bold text-base mb-1">
                      {quizPassed ? 'Mission Completed!' : 'Mastery Check Failed'}
                    </p>
                    <p className="text-xs text-muted-foreground mb-4">
                      You scored {correctCount} of {quiz.length} ({Math.round((correctCount / quiz.length) * 100)}%). Needed {passingScore} to pass.
                    </p>
                    {!quizPassed ? (
                      <button
                        onClick={retryQuiz}
                        className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity"
                      >
                        Try Again
                      </button>
                    ) : (
                      <p className="text-xs font-mono text-emerald-400 animate-pulse">
                        Redirecting to mission debrief...
                      </p>
                    )}
                  </div>

                  {/* Answers review */}
                  <div className="space-y-3">
                    <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Answer Review</p>
                    {quiz.map((q, idx) => {
                      const userAns = selectedOptions[idx];
                      const isCorrect = userAns === q.correctIndex;
                      return (
                        <div key={idx} className="glass-card rounded-2xl p-4 border border-border/30 space-y-2 text-xs">
                          <div className="flex items-start gap-2">
                            <span className={`w-4 h-4 rounded-full grid place-items-center shrink-0 mt-0.5 ${
                              isCorrect ? 'bg-emerald-500/20 text-emerald-400' : 'bg-destructive/20 text-destructive'
                            }`}>
                              {isCorrect ? <Check className="w-2.5 h-2.5" /> : <X className="w-2.5 h-2.5" />}
                            </span>
                            <p className="font-semibold text-foreground flex-1">{q.question}</p>
                          </div>
                          <div className="pl-6 space-y-1 text-muted-foreground">
                            <p>
                              Your answer: <span className={isCorrect ? 'text-emerald-400 font-semibold' : 'text-destructive font-semibold'}>{q.options[userAns] ?? 'Unanswered'}</span>
                            </p>
                            {!isCorrect && (
                              <p>
                                Correct answer: <span className="text-emerald-400 font-semibold">{q.options[q.correctIndex]}</span>
                              </p>
                            )}
                            <p className="text-[11px] text-muted-foreground/80 italic pt-1 border-t border-border/10">
                              {q.explanation}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* ── Desktop Floating Action Dock ───────────── */}
      <div className="hidden md:flex fixed bottom-6 inset-x-0 z-30 justify-center pointer-events-none">
        <div className="glass-card backdrop-blur-xl border border-border/40 shadow-2xl rounded-2xl p-2 flex items-center gap-2 pointer-events-auto">
          {stage === 'concept' && (
            <button
              onClick={() => setStage('practical')}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 shadow-lg shadow-primary/20"
            >
              Start Lab <FlaskConical className="w-4 h-4" />
            </button>
          )}

          {stage === 'practical' && (
            <>
              <button
                onClick={() => setStage('concept')}
                className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary/40 rounded-xl transition-colors"
                aria-label="Back to Brief"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setStage('quiz')}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 shadow-lg shadow-primary/20"
              >
                Take Proof Quiz <ClipboardCheck className="w-4 h-4" />
              </button>
            </>
          )}

          {stage === 'quiz' && !quizSubmitted && (
            <>
              <button
                onClick={() => setQIndex(p => Math.max(0, p - 1))}
                disabled={qIndex === 0}
                className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary/40 rounded-xl transition-colors disabled:opacity-30"
                aria-label="Previous question"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {qIndex < quiz.length - 1 ? (
                <button
                  onClick={() => setQIndex(p => Math.min(quiz.length - 1, p + 1))}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2"
                >
                  Next Question <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmitQuiz}
                  disabled={selectedOptions[qIndex] === undefined}
                  className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white px-6 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 shadow-lg shadow-emerald-900/20"
                >
                  Submit Answers <Check className="w-4 h-4" />
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
