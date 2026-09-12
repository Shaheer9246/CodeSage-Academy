import { useMemo, useState } from 'react';
import { useGuestLessonGate } from '@/lib/guestGate';
import { useParams, useNavigate, Navigate, useSearchParams } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { getCLessonById, isCLessonUnlocked } from '@/data/cLessons';
import CWorkspace from '@/components/CWorkspace';
import {
  ArrowLeft, BookOpen, FlaskConical, ClipboardCheck,
  Check, X, ChevronRight, ChevronLeft, GraduationCap, Sparkles, Lightbulb, type LucideIcon
} from 'lucide-react';

type Stage = 'concept' | 'practical' | 'quiz';

const STAGES: { key: Stage; icon: LucideIcon; label: string; hint: string }[] = [
  { key: 'concept', icon: BookOpen, label: 'Brief', hint: 'Understand it' },
  { key: 'practical', icon: FlaskConical, label: 'Lab', hint: 'Build it' },
  { key: 'quiz', icon: ClipboardCheck, label: 'Proof', hint: 'Prove it' },
];

const CLessonPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [sp] = useSearchParams();
  const from = sp.get('from');
  const backTo = from === 'roadmap' ? '/roadmap' : from === 'dashboard' ? '/c?from=dashboard' : '/c';

  const { user, completeLesson } = useUser();

  const lesson = id ? getCLessonById(id) : undefined;

  const [stage, setStage] = useState<Stage>('concept');
  const [conceptView, setConceptView] = useState<'beginner' | 'advanced'>('beginner');
  const [openConcept, setOpenConcept] = useState<number>(0);
  const [doneSteps, setDoneSteps] = useState<Record<number, boolean>>({});
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [qIndex, setQIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const { isGuest: __pgGuest } = useGuestLessonGate('c', id);

  const quiz = lesson?.quiz ?? [];
  const correctCount = useMemo(
    () => quiz.filter((q, i) => answers[i] === q.correctIndex).length,
    [quiz, answers]
  );
  const passingScore = Math.ceil(quiz.length * 0.75);
  const passed = correctCount >= passingScore;
  const allAnswered = quiz.every((_, i) => answers[i] !== undefined);
  const stageIndex = STAGES.findIndex(s => s.key === stage);
  const stepsDone = Object.values(doneSteps).filter(Boolean).length;
  const journey = Math.round(
    ((stageIndex + (stage === 'quiz' && submitted && passed ? 1 : 0)) / STAGES.length) * 100
  );

  if (!user && !__pgGuest) return <Navigate to="/auth" replace />;
  if (!lesson) return <Navigate to="/roadmap" replace />;
  if (!isCLessonUnlocked(lesson.id, (user?.completedLessons || []))) return <Navigate to="/roadmap" replace />;

  const handleSubmit = () => {
    setSubmitted(true);
    if (passed) {
      if (user) completeLesson(lesson.id);
      setTimeout(() => navigate('/complete/' + lesson.id), 800);
    }
  };

  return (
    <div className="min-h-screen bg-background grid-bg">
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

      <div className="max-w-6xl mx-auto px-3 md:px-5 py-4 md:py-6 pb-6 md:pb-24 md:flex md:gap-6">
        {/* ── Stage rail ────────────────────────────── */}
        <nav className="md:w-52 md:shrink-0 mb-4 md:mb-0">
          <div className="md:sticky md:top-24 flex md:flex-col gap-2">
            {STAGES.map((s, i) => {
              const active = stage === s.key;
              const done = i < stageIndex || (s.key === 'quiz' && submitted && passed);
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
          {stage === 'concept' && (
            <div className="space-y-5 animate-fade-in">
              <section className="relative overflow-hidden rounded-3xl border border-primary/25 bg-gradient-to-br from-primary/12 via-card/60 to-transparent p-5">
                <p className="text-[10px] font-mono text-primary uppercase tracking-[0.2em] mb-2">Mission brief</p>
                <p className="text-sm md:text-base text-foreground leading-relaxed">{lesson.philosophy}</p>
                <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-primary/20 blur-3xl" />
              </section>

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
                            <p className="text-xs text-muted-foreground leading-relaxed mt-2.5 animate-fade-in">
                              {conceptView === 'beginner' ? c.beginner : c.advanced}
                            </p>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ── PRACTICAL STAGE ─────────────────────── */}
          {stage === 'practical' && (
            <div className="space-y-6 animate-fade-in">
              {/* Header Card */}
              <section className="rounded-3xl border border-amber-500/25 bg-gradient-to-br from-amber-500/10 to-transparent p-5">
                <p className="text-[10px] font-mono text-amber-400 uppercase tracking-[0.2em] mb-2 flex items-center gap-1">
                  <FlaskConical className="w-3 h-3" /> Practical lab
                </p>
                <h2 className="font-display font-bold text-base md:text-lg text-foreground mb-1">{lesson.practical.title}</h2>
                <p className="text-xs text-muted-foreground leading-relaxed">{lesson.practical.intro}</p>
              </section>

              {/* Assignment Box: Goal + Steps (Scrollable) */}
              <div className="glass-card rounded-2xl p-4 border border-border/30 max-h-[38vh] overflow-y-auto">
                <div className="mb-4">
                  <p className="text-[10px] font-mono text-primary uppercase tracking-wider mb-2 flex items-center gap-1">
                    <Lightbulb className="w-3 h-3" /> Goal
                  </p>
                  <p className="text-sm text-foreground leading-relaxed">{lesson.practical.goal}</p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3 sticky top-0 bg-background/0 backdrop-blur-none z-10 pb-2 border-b border-border/10">
                    <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Steps</p>
                    <span className="text-[10px] font-mono text-primary">
                      {stepsDone}/{lesson.practical?.steps?.length ?? 0}
                    </span>
                  </div>
                  <ol className="space-y-2">
                    {(lesson.practical?.steps ?? []).map((step, i) => {
                      const done = !!doneSteps[i];
                      return (
                        <li key={i}>
                          <button
                            onClick={() => setDoneSteps(p => ({ ...p, [i]: !p[i] }))}
                            className={`w-full flex gap-3 text-left rounded-xl px-3 py-2.5 border transition-all ${
                              done ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-border/20 hover:border-primary/20'
                            }`}
                          >
                            <span className={`w-5 h-5 rounded-full grid place-items-center shrink-0 text-[10px] font-mono border ${
                              done ? 'border-emerald-500/50 bg-emerald-500/20 text-emerald-400' : 'border-border/50 text-muted-foreground'
                            }`}>
                              {done ? <Check className="w-3 h-3" /> : i + 1}
                            </span>
                            <span
                              className={`text-xs leading-relaxed flex-1 ${done ? 'text-muted-foreground line-through' : 'text-foreground'}`}
                              dangerouslySetInnerHTML={{
                                __html: step.replace(/`([^`]+)`/g, '<code class="bg-secondary/60 text-primary px-1.5 py-0.5 rounded text-[11px] font-mono">$1</code>')
                              }}
                            />
                          </button>
                        </li>
                      );
                    })}
                  </ol>
                </div>
              </div>

              {/* C Workspace (Monaco C Editor + Live In-Browser Terminal) */}
              <div className="h-[520px] min-h-[420px] glass-card rounded-2xl overflow-hidden border border-border/40 shadow-2xl">
                <CWorkspace
                  key={lesson.id}
                  practical={lesson.practical}
                  requiresLocalTerminal={!!lesson.terminalNotice}
                  embedded={false}
                />
              </div>
            </div>
          )}

          {stage === 'quiz' && (
            <div className="space-y-4 animate-fade-in">
              {!submitted ? (
                <>
                  <section className="rounded-3xl border border-primary/25 bg-gradient-to-br from-primary/10 to-transparent p-5 flex items-center gap-3">
                    <GraduationCap className="w-5 h-5 text-primary shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-display font-bold text-foreground">Mastery check</p>
                      <p className="text-[11px] text-muted-foreground">
                        Score {passingScore}/{quiz.length} to finish this lesson.
                      </p>
                    </div>
                    <div className="flex gap-1.5">
                      {quiz.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setQIndex(i)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            i === qIndex
                              ? 'bg-primary scale-125'
                              : answers[i] !== undefined
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
                          const selected = answers[qIndex] === oi;
                          return (
                            <button
                              key={oi}
                              onClick={() => {
                                setAnswers(p => ({ ...p, [qIndex]: oi }));
                                if (qIndex < quiz.length - 1) setTimeout(() => setQIndex(qIndex + 1), 220);
                              }}
                              className={`w-full text-left text-xs md:text-sm px-3.5 py-3 rounded-xl border-2 transition-all flex items-center gap-3 ${
                                selected
                                  ? 'border-primary/50 bg-primary/10 text-primary'
                                  : 'border-border/30 text-foreground hover:border-primary/30'
                              }`}
                            >
                              <span
                                className={`w-5 h-5 rounded-md grid place-items-center text-[10px] font-mono shrink-0 border ${
                                  selected ? 'border-primary bg-primary text-primary-foreground' : 'border-border/50'
                                }`}
                              >
                                {String.fromCharCode(65 + oi)}
                              </span>
                              <span className="flex-1">{opt}</span>
                            </button>
                          );
                        })}
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <button
                          disabled={qIndex === 0}
                          onClick={() => setQIndex(q => q - 1)}
                          className="text-[11px] text-muted-foreground hover:text-foreground disabled:opacity-30 flex items-center gap-1"
                        >
                          <ChevronLeft className="w-3.5 h-3.5" /> Back
                        </button>
                        <button
                          disabled={qIndex >= quiz.length - 1}
                          onClick={() => setQIndex(q => q + 1)}
                          className="text-[11px] text-muted-foreground hover:text-foreground disabled:opacity-30 flex items-center gap-1"
                        >
                          Skip <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="glass-card rounded-3xl p-6 text-center">
                    <p className="text-3xl font-display font-bold text-foreground">
                      {correctCount}
                      <span className="text-muted-foreground text-lg"> / {quiz.length}</span>
                    </p>
                    <p className={`text-sm font-display font-semibold mt-1 ${passed ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {passed ? '🎉 Lesson passed!' : `Almost there — you need ${passingScore}/${quiz.length} to pass. Review and retry.`}
                    </p>
                    {!passed && (
                      <button
                        onClick={() => { setAnswers({}); setSubmitted(false); setQIndex(0); }}
                        className="mt-4 bg-primary text-primary-foreground text-xs font-semibold px-5 py-2 rounded-xl"
                      >
                        Retry quiz
                      </button>
                    )}
                  </div>

                  {quiz.map((q, qi) => {
                    const sel = answers[qi];
                    const ok = sel === q.correctIndex;
                    return (
                      <div key={qi} className={`glass-card rounded-2xl p-4 border ${ok ? 'border-emerald-500/25' : 'border-red-500/25'}`}>
                        <p className="text-sm font-display font-semibold text-foreground mb-2 flex items-start gap-2">
                          {ok ? (
                            <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          ) : (
                            <X className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                          )}
                          {q.question}
                        </p>
                        <div className="space-y-1.5">
                          {q.options.map((opt, oi) => {
                            const isCorrect = oi === q.correctIndex;
                            const chosen = sel === oi;
                            let cls = 'border-border/20 text-muted-foreground';
                            if (isCorrect) cls = 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300';
                            else if (chosen) cls = 'border-red-500/40 bg-red-500/10 text-red-300';
                            return (
                              <div key={oi} className={`text-xs px-3 py-2 rounded-lg border ${cls}`}>
                                {opt}
                              </div>
                            );
                          })}
                        </div>
                        {q.explanation && (
                          <p className="text-[11px] text-muted-foreground mt-3 italic border-l-2 border-primary/30 pl-3">
                            💡 {q.explanation}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          )}
        </main>
      </div>

      {/* ── Sticky action dock ──────────────────────── */}
      {/* Mobile: inline button at end of content */}
      <div className="md:hidden mt-6 mb-4 space-y-3">
        {stageIndex > 0 && (
          <button
            onClick={() => setStage(STAGES[stageIndex - 1].key)}
            className="w-full text-xs text-muted-foreground hover:text-foreground flex items-center justify-center gap-1 py-2"
          >
            <ChevronLeft className="w-4 h-4" /> Previous stage
          </button>
        )}

        {stage !== 'quiz' ? (
          <button
            onClick={() => setStage(STAGES[stageIndex + 1].key)}
            className="w-full bg-primary text-primary-foreground font-display font-semibold text-sm py-3.5 rounded-2xl neon-glow hover:opacity-90 flex items-center justify-center gap-2"
          >
            {stage === 'concept' ? 'Enter the lab' : 'Take the quiz'} <ChevronRight className="w-4 h-4" />
          </button>
        ) : !submitted ? (
          <button
            disabled={!allAnswered}
            onClick={handleSubmit}
            className="w-full bg-primary text-primary-foreground font-display font-semibold text-sm py-3.5 rounded-2xl neon-glow hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {allAnswered ? 'Submit quiz' : `Answer all (${Object.keys(answers).length}/${quiz.length})`}
          </button>
        ) : (
          <button
            onClick={() => navigate(backTo)}
            className="w-full bg-secondary text-foreground font-display font-semibold text-sm py-3.5 rounded-2xl hover:opacity-90"
          >
            Back to track
          </button>
        )}
      </div>

      {/* Desktop: floating pill button */}
      <div className="hidden md:flex fixed bottom-8 inset-x-0 z-30 justify-center pointer-events-none">
        <div className="flex items-center gap-3 pointer-events-auto bg-background/80 backdrop-blur-xl border border-border/30 rounded-full px-4 py-2 shadow-lg">
          {stageIndex > 0 && (
            <button
              onClick={() => setStage(STAGES[stageIndex - 1].key)}
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 px-2 py-1.5"
            >
              <ChevronLeft className="w-4 h-4" /> Prev
            </button>
          )}

          {stage !== 'quiz' ? (
            <button
              onClick={() => setStage(STAGES[stageIndex + 1].key)}
              className="bg-primary text-primary-foreground font-display font-semibold text-sm py-2 px-6 rounded-full neon-glow hover:opacity-90 flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
            >
              {stage === 'concept' ? 'Enter the lab' : 'Take the quiz'} <ChevronRight className="w-4 h-4" />
            </button>
          ) : !submitted ? (
            <button
              disabled={!allAnswered}
              onClick={handleSubmit}
              className="bg-primary text-primary-foreground font-display font-semibold text-sm py-2 px-6 rounded-full neon-glow hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {allAnswered ? 'Submit quiz' : `Answer all (${Object.keys(answers).length}/${quiz.length})`}
            </button>
          ) : (
            <button
              onClick={() => navigate(backTo)}
              className="bg-secondary text-foreground font-display font-semibold text-sm py-2 px-6 rounded-full hover:opacity-90"
            >
              Back to track
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CLessonPage;
