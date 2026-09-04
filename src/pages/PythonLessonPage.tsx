import { useMemo, useState } from 'react';
import { useGuestLessonGate } from '@/lib/guestGate';
import { useParams, useNavigate, Navigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useUser } from '@/contexts/UserContext';
import { getPythonLessonById, isPythonLessonUnlocked } from '@/data/pythonLessons';
import {
  ArrowLeft, BookOpen, FlaskConical, ClipboardCheck, Check, X, ChevronRight, ChevronLeft,
  GraduationCap, Lightbulb, Code2, Eye, Circle, CheckCircle2, Sparkles, type LucideIcon,
} from 'lucide-react';
import CodeEditor from '@/components/CodeEditor';
import LivePreview from '@/components/LivePreview';
import { useIsMobile } from '@/hooks/use-mobile';

type Stage = 'concept' | 'practical' | 'quiz';
type MobileLab = 'code' | 'preview';

const STAGES: { key: Stage; icon: LucideIcon; label: string; hint: string }[] = [
  { key: 'concept', icon: BookOpen, label: 'Brief', hint: 'Understand it' },
  { key: 'practical', icon: FlaskConical, label: 'Lab', hint: 'Build it' },
  { key: 'quiz', icon: ClipboardCheck, label: 'Proof', hint: 'Prove it' },
];

const PythonLessonPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, completeLesson } = useUser();
  const isMobile = useIsMobile();
  const [sp] = useSearchParams();
  const from = sp.get('from');
  const backTo = from === 'roadmap' ? '/roadmap' : from === 'dashboard' ? '/python?from=dashboard' : '/python';

  const lesson = id ? getPythonLessonById(id) : undefined;

  const [stage, setStage] = useState<Stage>('concept');
  const [conceptView, setConceptView] = useState<'beginner' | 'advanced'>('beginner');
  const [openConcept, setOpenConcept] = useState<number>(0);
  const [doneSteps, setDoneSteps] = useState<Record<number, boolean>>({});
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [qIndex, setQIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  
  // ── Terminal / Workbench state ──────────────────────
  const [html, setHtml] = useState(lesson?.practical.code?.html || '');
  const [css, setCss] = useState(lesson?.practical.code?.css || '');
  const [js, setJs] = useState(lesson?.practical.code?.js || '');
  const [activeFile, setActiveFile] = useState<'html' | 'css' | 'js'>('html');
  const [mobileLab, setMobileLab] = useState<MobileLab>('code');

  const { isGuest: __pgGuest } = useGuestLessonGate('python', id);

  const quiz = lesson?.quiz ?? [];
  const correctCount = useMemo(
    () => quiz.filter((q, i) => answers[i] === q.correctIndex).length,
    [quiz, answers]
  );

  if (!user && !__pgGuest) return <Navigate to="/auth" replace />;
  if (!lesson) return <Navigate to="/python" replace />;
  if (!isPythonLessonUnlocked(lesson.id, user?.completedLessons || [])) return <Navigate to="/python" replace />;

  const code = lesson.practical.code;
  const passed = correctCount >= 3;
  const allAnswered = quiz.every((_, i) => answers[i] !== undefined);
  const stageIndex = STAGES.findIndex(s => s.key === stage);
  const stepsDone = Object.values(doneSteps).filter(Boolean).length;
  const journey = Math.round(
    ((stageIndex + (stage === 'quiz' && submitted && passed ? 1 : 0)) / STAGES.length) * 100
  );

  const handleSubmit = async () => {
    setSubmitted(true);
    if (correctCount >= 3) {
      if (user) await completeLesson(lesson.id);
      toast.success('Lesson complete! +5 XP · +2 Coins 🎉');
      navigate(`/complete/${lesson.id}${from ? `?from=${from}` : ''}`);
    }
  };

  const langMap = { html: 'html', css: 'css', js: 'javascript' } as const;
  const codeVal = { html, css, js }[activeFile];
  const codeSet = { html: setHtml, css: setCss, js: setJs }[activeFile];

  const EditorPane = (
    <div className="flex flex-col h-full min-h-0">
      <div className="flex items-center border-b border-border/40 bg-card/60 shrink-0">
        {(['html', 'css', 'js'] as const).map(f => (
          <button
            key={f}
            onClick={() => setActiveFile(f)}
            className={`px-3 py-1.5 text-[11px] font-mono uppercase tracking-wide border-r border-border/30 transition-colors ${
              activeFile === f ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {f}
          </button>
        ))}
        <span className="ml-auto pr-3 text-[10px] font-mono text-muted-foreground hidden md:flex items-center gap-1">
          <Code2 className="w-3 h-3" /> live
        </span>
      </div>
      <div className="flex-1 min-h-0">
        <CodeEditor code={codeVal} onChange={codeSet} language={langMap[activeFile]} />
      </div>
    </div>
  );

  const PreviewPane = (
    <div className="flex flex-col h-full min-h-0">
      <div className="px-3 py-1.5 border-b border-border/40 bg-card/60 text-[10px] font-mono uppercase tracking-wide text-muted-foreground flex items-center gap-1.5 shrink-0">
        <Eye className="w-3 h-3" /> Preview
      </div>
      <div className="flex-1 min-h-0 overflow-hidden bg-white/5">
        <LivePreview html={html} css={css} js={js} />
      </div>
    </div>
  );

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
            <Sparkles className="w-3 h-3" /> +5 XP · +2 ◈
          </div>
        </div>
        <div className="h-0.5 bg-secondary/40">
          <div
            className="h-full bg-gradient-to-r from-primary to-emerald-400 transition-all duration-500"
            style={{ width: `${Math.max(journey, 6)}%` }}
          />
        </div>
      </header>

      {/* Increased pb-36 to ensure content never hides under the sticky dock */}
      <div className="max-w-6xl mx-auto px-3 md:px-5 py-4 md:py-6 pb-36 md:flex md:gap-6">
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

              {/* ── Restored inline button with proper spacing ── */}
              <button
                onClick={() => setStage('practical')}
                className="w-full mt-8 bg-primary text-primary-foreground font-display font-semibold text-sm py-3 rounded-2xl neon-glow hover:opacity-90 flex items-center justify-center gap-2"
              >
                Try the Practical Lab <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {stage === 'practical' && (
            <div className="space-y-4 animate-fade-in">
              <section className="rounded-3xl border border-amber-500/25 bg-gradient-to-br from-amber-500/10 to-transparent p-5">
                <p className="text-[10px] font-mono text-amber-400 uppercase tracking-[0.2em] mb-2 flex items-center gap-1">
                  <FlaskConical className="w-3 h-3" /> Practical lab
                </p>
                <h2 className="font-display font-bold text-base md:text-lg text-foreground mb-1">{lesson.practical.title}</h2>
                <p className="text-xs text-muted-foreground leading-relaxed">{lesson.practical.intro}</p>
              </section>

              <div className={code ? 'md:grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] md:gap-4 space-y-4 md:space-y-0' : ''}>
                {/* Checklist & Goal */}
                <div className="glass-card rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.18em]">Steps</p>
                    <span className="text-[10px] font-mono text-primary">
                      {stepsDone}/{lesson.practical.steps.length}
                    </span>
                  </div>
                  <ol className="space-y-1.5">
                    {lesson.practical.steps.map((step, i) => {
                      const done = !!doneSteps[i];
                      return (
                        <li key={i}>
                          <button
                            onClick={() => setDoneSteps(p => ({ ...p, [i]: !p[i] }))}
                            className={`w-full flex gap-2.5 text-left rounded-xl px-2.5 py-2 border transition-all ${
                              done ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-transparent hover:bg-secondary/40'
                            }`}
                          >
                            {done ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                            ) : (
                              <Circle className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                            )}
                            <span
                              className={`text-xs leading-relaxed ${done ? 'text-muted-foreground line-through' : 'text-foreground'}`}
                              dangerouslySetInnerHTML={{
                                __html: step.replace(
                                  /`([^`]+)`/g,
                                  '<code class="bg-secondary/60 text-primary px-1.5 py-0.5 rounded text-[11px] font-mono">$1</code>'
                                ),
                              }}
                            />
                          </button>
                        </li>
                      );
                    })}
                  </ol>

                  <div className="mt-4 rounded-xl border border-primary/25 bg-primary/5 p-3">
                    <p className="text-[10px] font-mono text-primary uppercase tracking-[0.18em] mb-1 flex items-center gap-1">
                      <Lightbulb className="w-3 h-3" /> Goal
                    </p>
                    <p className="text-xs text-foreground leading-relaxed">{lesson.practical.goal}</p>
                  </div>
                </div>

                {/* ── Restored Terminal / Workbench ──────── */}
                {code && (
                  <div className="glass-card rounded-2xl overflow-hidden md:sticky md:top-24 self-start w-full">
                    {isMobile ? (
                      <>
                        <div className="flex p-1 gap-1 bg-card/60 border-b border-border/40">
                          {(['code', 'preview'] as const).map(t => (
                            <button
                              key={t}
                              onClick={() => setMobileLab(t)}
                              className={`flex-1 py-1.5 rounded-lg text-[11px] font-display font-semibold capitalize transition-all flex items-center justify-center gap-1.5 ${
                                mobileLab === t ? 'bg-primary/15 text-primary' : 'text-muted-foreground'
                              }`}
                            >
                              {t === 'code' ? <Code2 className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                              {t}
                            </button>
                          ))}
                        </div>
                        <div style={{ height: '68vh' }} className="min-h-0">
                          {mobileLab === 'code' ? EditorPane : PreviewPane}
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col" style={{ height: '85vh' }}>
                        <div className="h-1/2 min-h-0 border-b border-border/40">{EditorPane}</div>
                        <div className="h-1/2 min-h-0">{PreviewPane}</div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* ── Restored inline button with proper spacing ── */}
              <button
                onClick={() => setStage('quiz')}
                className="w-full mt-8 bg-primary text-primary-foreground font-display font-semibold text-sm py-3 rounded-2xl neon-glow hover:opacity-90 flex items-center justify-center gap-2"
              >
                Take the Mastery Test <ChevronRight className="w-4 h-4" />
              </button>
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
                      <p className="text-[11px] text-muted-foreground">Score 3/4 to finish this lesson.</p>
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
                      {passed ? '🎉 Lesson passed!' : 'Almost there — review and retry'}
                    </p>
                    {!passed && (
                      <button
                        onClick={() => { setAnswers({}); setSubmitted(false); setQIndex(0); }}
                        className="mt-4 bg-primary text-primary-foreground text-xs font-semibold px-5 py-2 rounded-xl"
                      >
                        Retry test
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
      <div className="fixed bottom-0 inset-x-0 z-30 border-t border-border/30 bg-background/90 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-3 py-2.5 flex items-center gap-3">
          <button
            disabled={stageIndex === 0}
            onClick={() => setStage(STAGES[stageIndex - 1].key)}
            className="text-xs text-muted-foreground hover:text-foreground disabled:opacity-30 flex items-center gap-1 px-2 py-2"
          >
            <ChevronLeft className="w-4 h-4" /> Prev
          </button>

          {stage !== 'quiz' ? (
            <button
              onClick={() => setStage(STAGES[stageIndex + 1].key)}
              className="flex-1 bg-primary text-primary-foreground font-display font-semibold text-sm py-2.5 rounded-2xl neon-glow hover:opacity-90 flex items-center justify-center gap-2"
            >
              {stage === 'concept' ? 'Enter the lab' : 'Take the test'} <ChevronRight className="w-4 h-4" />
            </button>
          ) : !submitted ? (
            <button
              disabled={!allAnswered}
              onClick={handleSubmit}
              className="flex-1 bg-primary text-primary-foreground font-display font-semibold text-sm py-2.5 rounded-2xl neon-glow hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {allAnswered ? 'Submit test' : `Answer all (${Object.keys(answers).length}/${quiz.length})`}
            </button>
          ) : (
            <button
              onClick={() => navigate(backTo)}
              className="flex-1 bg-secondary text-foreground font-display font-semibold text-sm py-2.5 rounded-2xl hover:opacity-90"
            >
              Back to track
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PythonLessonPage;
