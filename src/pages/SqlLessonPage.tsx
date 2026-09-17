import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useNavigate, Navigate, useSearchParams } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { toast } from 'sonner';
import { 
  ArrowLeft, BookOpen, FlaskConical, ClipboardCheck, 
  Check, X, ChevronRight, ChevronLeft, GraduationCap, Play, 
  RefreshCw, AlertTriangle, Database, CheckCircle2, Sparkles, type LucideIcon 
} from 'lucide-react';
import { SQL_LESSONS, isSqlLessonUnlocked } from '@/data/sqlLessons';
import { saveLessonQuizAttempt } from '@/lib/quizStorage';

type Stage = 'concept' | 'practical' | 'quiz';

// Helper to dynamic-load SQLite WASM drivers in-browser
let cachedSQL: any = null;
let sqlLoadPromise: Promise<any> | null = null;

const loadSqlJs = (): Promise<any> => {
  if (cachedSQL) return Promise.resolve(cachedSQL);
  if (sqlLoadPromise) return sqlLoadPromise;

  sqlLoadPromise = new Promise((resolve, reject) => {
    const init = async (initSqlJs: any) => {
      try {
        // Try local bundled wasm first, fallback to CDN if unavailable
        cachedSQL = await initSqlJs({
          locateFile: (file: string) => `/sql/${file}`
        });
        resolve(cachedSQL);
      } catch (localErr) {
        try {
          cachedSQL = await initSqlJs({
            locateFile: (file: string) => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`
          });
          resolve(cachedSQL);
        } catch (err) {
          reject(err);
        }
      }
    };

    if ((window as any).initSqlJs) {
      init((window as any).initSqlJs);
      return;
    }
    const script = document.createElement('script');
    script.src = '/sql/sql-wasm.js';
    script.async = true;
    script.onload = () => init((window as any).initSqlJs);
    script.onerror = () => {
      // Fallback to CDN script if local path fails
      const cdnScript = document.createElement('script');
      cdnScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/sql-wasm.js';
      cdnScript.async = true;
      cdnScript.onload = () => init((window as any).initSqlJs);
      cdnScript.onerror = () => reject(new Error('Failed to load local database driver.'));
      document.body.appendChild(cdnScript);
    };
    document.body.appendChild(script);
  });

  return sqlLoadPromise;
};

interface ConsoleProps {
  lessonId: string;
  practical: any;
  isValidated: boolean;
  setIsValidated: (v: boolean) => void;
}

function SqlWorkspaceConsole({ lessonId, practical, isValidated, setIsValidated }: ConsoleProps) {
  const [userQuery, setUserQuery] = useState<string>('');
  const [dbLoading, setDbLoading] = useState<boolean>(true);
  const [queryResult, setQueryResult] = useState<{ columns: string[]; values: any[][] } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [executionMessage, setExecutionMessage] = useState<string | null>(null);
  const SQLRef = useRef<any>(null);

  useEffect(() => {
    setUserQuery(practical?.starterQuery || '');
    setQueryResult(null);
    setError(null);
    setExecutionMessage(null);
    setIsValidated(false);
  }, [practical, setIsValidated]);

  useEffect(() => {
    loadSqlJs()
      .then((SQL) => {
        SQLRef.current = SQL;
        setDbLoading(false);
      })
      .catch(() => {
        setError("Database sandbox environment could not be initialized.");
        setDbLoading(false);
      });
  }, []);

  const createSeededDatabase = () => {
    if (!SQLRef.current || !practical) return null;
    const db = new SQLRef.current.Database();
    if (practical.seedSql && practical.seedSql.trim() !== '') {
      db.run(practical.seedSql);
    }
    return db;
  };

  const handleRunQuery = () => {
    setError(null);
    setQueryResult(null);
    setExecutionMessage(null);

    const db = createSeededDatabase();
    if (!db) {
      setError("SQL driver is not initialized.");
      return;
    }

    try {
      const res = db.exec(userQuery);
      if (res.length > 0) {
        setQueryResult({ columns: res[0].columns, values: res[0].values });
        setExecutionMessage(`Returned ${res[0].values.length} rows successfully.`);
      } else {
        setExecutionMessage("Query executed successfully. No rows returned.");
      }
    } catch (err: any) {
      setError(err.message || "Syntactical database failure.");
    } finally {
      db.close();
    }
  };

  const handleVerifySolution = () => {
    if (!practical) return;
    setError(null);
    setExecutionMessage(null);

    const dbUser = createSeededDatabase();
    const dbSol = createSeededDatabase();
    if (!dbUser || !dbSol) return;

    try {
      let userPassed = false;
      if (practical.starterQuery?.toLowerCase().includes('create table') || lessonId === 'sql-05') {
        try {
          dbUser.run(userQuery);
          dbSol.run(practical.solutionQuery);
          const tUser = dbUser.exec("SELECT sql FROM sqlite_master WHERE type='table';");
          const tSol = dbSol.exec("SELECT sql FROM sqlite_master WHERE type='table';");
          const cleanStr = (s: string) => s.replace(/\s+/g, ' ').trim().toLowerCase();
          userPassed = cleanStr(JSON.stringify(tUser)) === cleanStr(JSON.stringify(tSol));
        } catch { userPassed = false; }
      } else {
        const userRes = dbUser.exec(userQuery);
        const solRes = dbSol.exec(practical.solutionQuery);
        userPassed = JSON.stringify(userRes) === JSON.stringify(solRes);
        if (userRes.length > 0) {
          setQueryResult({ columns: userRes[0].columns, values: userRes[0].values });
        }
      }

      if (userPassed) {
        setExecutionMessage("Code verified! Output matches target criteria specs perfectly.");
        setIsValidated(true);
        toast.success("Practical task target cleared! Proceed to Mastery Test.");
      } else {
        setError("Result mismatch. Returned dataset values do not match requirements.");
        setIsValidated(false);
      }
    } catch (err: any) {
      setError(`Execution error: ${err.message}`);
    } finally {
      dbUser.close();
      dbSol.close();
    }
  };

  return (
    <div className="space-y-4">
      <div className="glass-card rounded-2xl border border-border/30 overflow-hidden flex flex-col h-[280px] md:h-[320px] relative">
        {dbLoading && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-30 flex flex-col items-center justify-center gap-3">
            <RefreshCw className="w-5 h-5 text-primary animate-spin" />
            <p className="text-[10px] text-muted-foreground font-mono">Mounting SQLite Sandbox Core...</p>
          </div>
        )}

        <div className="px-4 py-2 bg-muted/30 border-b border-border/30 flex items-center justify-between shrink-0">
          <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">SQL Interactive Term</span>
          <div className="flex gap-1.5">
            <button onClick={() => setUserQuery(practical?.starterQuery || '')} className="p-1 hover:bg-secondary rounded text-muted-foreground" title="Reset query">
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
            <button onClick={handleRunQuery} disabled={dbLoading} className="px-2.5 py-1 bg-secondary text-[10px] font-semibold rounded text-primary flex items-center gap-1 disabled:opacity-50">
              <Play className="w-3 h-3" /> Run
            </button>
            <button onClick={handleVerifySolution} disabled={dbLoading} className="px-2.5 py-1 bg-primary text-primary-foreground text-[10px] font-semibold rounded flex items-center gap-1 disabled:opacity-50">
              <Check className="w-3 h-3" /> Verify
            </button>
          </div>
        </div>

        <textarea
          value={userQuery}
          onChange={(e) => setUserQuery(e.target.value)}
          className="w-full flex-1 p-4 bg-transparent text-foreground font-mono text-xs leading-relaxed focus:outline-none resize-none min-h-0"
          placeholder="-- Write standard ANSI SQL commands here..."
          spellCheck={false}
        />
      </div>

      <div className="glass-card rounded-2xl border border-border/30 overflow-hidden p-4 font-mono text-[11px] min-h-[140px] max-h-[40vh] overflow-y-auto">
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-300 rounded-xl flex gap-2">
            <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <div><strong className="block text-xs mb-0.5">DB Exceptions</strong><p>{error}</p></div>
          </div>
        )}

        {executionMessage && !error && (
          <div className={`p-3 border rounded-xl flex gap-2 ${isValidated ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' : 'bg-muted/30 border-border/30 text-muted-foreground'}`}>
            <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <div><strong className="block text-xs mb-0.5">{isValidated ? 'Task Clear' : 'Engine Log'}</strong><p>{executionMessage}</p></div>
          </div>
        )}

        {queryResult && (
          <div className="border border-border/30 rounded-xl overflow-hidden mt-3 max-w-full overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/40 border-b border-border/30 text-muted-foreground text-[10px]">
                  {queryResult.columns.map((col, idx) => <th key={idx} className="p-2 border-r border-border/20">{col}</th>)}
                </tr>
              </thead>
              <tbody>
                {queryResult.values.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-muted/20 border-b border-border/10 text-foreground">
                    {row.map((val, cIdx) => <td key={cIdx} className="p-2 border-r border-border/10">{val === null ? <span className="text-amber-500 italic">NULL</span> : String(val)}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!error && !executionMessage && !queryResult && (
          <div className="flex flex-col items-center justify-center text-muted-foreground gap-1.5 py-4">
            <Database className="w-5 h-5 opacity-30" />
            <p className="text-[10px]">Console stream clean. Run code to fetch results.</p>
          </div>
        )}
      </div>
    </div>
  );
}

const STAGES: { key: Stage; icon: LucideIcon; label: string; hint: string }[] = [
  { key: 'concept', icon: BookOpen, label: 'Brief', hint: 'Understand it' },
  { key: 'practical', icon: FlaskConical, label: 'Lab', hint: 'Build it' },
  { key: 'quiz', icon: ClipboardCheck, label: 'Proof', hint: 'Prove it' },
];

const SqlLessonPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, completeLesson } = useUser();
  const [sp] = useSearchParams();
  
  const from = sp.get('from');
  const isGuest = sp.get('guest') === '1';
  const backTo = from === 'roadmap' ? '/roadmap' : from === 'dashboard' ? '/sql-learn?from=dashboard' : '/sql-learn';

  const lesson = SQL_LESSONS?.find((l: any) => l.id === id);

  const [stage, setStage] = useState<Stage>('concept');
  const [conceptView, setConceptView] = useState<'beginner' | 'advanced'>('beginner');
  const [openConcept, setOpenConcept] = useState<number>(0);
  const [doneSteps, setDoneSteps] = useState<Record<number, boolean>>({});
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [qIndex, setQIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [isValidated, setIsValidated] = useState<boolean>(false);

  const quiz = lesson?.quiz ?? [];
  const correctCount = useMemo(
    () => quiz.filter((q: any, i: number) => answers[i] === q.correctIndex).length,
    [quiz, answers]
  );

  if (!user && !isGuest) return <Navigate to="/auth" replace />;
  if (!lesson) return <Navigate to="/sql-learn" replace />;
  if (!isGuest && !isSqlLessonUnlocked(lesson.id, (user?.completedLessons || []))) return <Navigate to="/sql-learn" replace />;

  const totalQuizLength = quiz.length;

const passThreshold =
  totalQuizLength === 0
    ? 0
    : Math.max(1, Math.ceil(totalQuizLength * 0.75));

const passPercentage =
  totalQuizLength === 0
    ? 0
    : Math.round((correctCount / totalQuizLength) * 100);

const passed = correctCount >= passThreshold;
  const allAnswered = quiz.every((_: any, i: number) => answers[i] !== undefined);
  
  const stageIndex = STAGES.findIndex(s => s.key === stage);
  const stepsDone = Object.values(doneSteps).filter(Boolean).length;
  const journey = Math.round(
    ((stageIndex + (stage === 'quiz' && submitted && passed ? 1 : 0)) / STAGES.length) * 100
  );

  const handleSubmit = async () => {
    setSubmitted(true);
    saveLessonQuizAttempt(lesson.id, answers, quiz, lesson?.title);
    if (passed) {
      if (user) await completeLesson(lesson.id);
      toast.success('SQL Target Mastered! +1 XP · +2 Coins 🎉');
      const fromQs = from ? `?from=${from}` : '';
      navigate(`/complete/${lesson.id}${fromQs}`, { state: { answers } });
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
              {lesson.module || 'SQL ENGINE'}
            </p>
            <h1 className="font-display font-bold text-sm text-foreground truncate flex items-center gap-1.5">
              <span>{lesson.icon || '📊'}</span> {lesson.title}
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
                <p className="text-sm md:text-base text-foreground leading-relaxed">{lesson.philosophy || lesson.practical?.intro}</p>
                <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-primary/20 blur-3xl" />
              </section>

              <div className="flex items-center justify-between gap-3">
                <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.18em]">
                  Breakdown · {lesson.concepts?.length ?? 0} ideas
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
                  {(lesson.concepts ?? []).map((c: any, i: number) => {
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
                <h2 className="font-display font-bold text-base md:text-lg text-foreground mb-1">{lesson.practical?.title || 'Data Structuring Objectives'}</h2>
                <p className="text-xs text-muted-foreground leading-relaxed">{lesson.practical?.intro || 'Run and validate query commands inside your workspace.'}</p>
              </section>

              {/* Assignment Box: Goal + Steps (Scrollable) */}
              <div className="glass-card rounded-2xl p-4 border border-border/30 max-h-[40vh] overflow-y-auto">
                <div className="mb-4">
                  <p className="text-[10px] font-mono text-primary uppercase tracking-wider mb-2 flex items-center gap-1">
                    <Check className="w-3 h-3" /> Goal
                  </p>
                  <p className="text-sm text-foreground leading-relaxed">{lesson.practical?.goal || 'Run and validate query commands inside your workspace.'}</p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3 sticky top-0 bg-background/0 backdrop-blur-none z-10 pb-2 border-b border-border/10">
                    <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Steps</p>
                    <span className="text-[10px] font-mono text-primary">
                      {stepsDone}/{lesson.practical?.steps?.length ?? 0}
                    </span>
                  </div>
                  <ol className="space-y-2">
                    {(lesson.practical?.steps ?? []).map((step: string, i: number) => {
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
                            <span className={`text-xs leading-relaxed flex-1 ${done ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                              {step}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ol>
                </div>
              </div>

              {/* SQL Workspace Console */}
              <SqlWorkspaceConsole 
                lessonId={lesson.id} 
                practical={lesson.practical}
                isValidated={isValidated}
                setIsValidated={setIsValidated}
              />
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
                        Score {passThreshold}/{totalQuizLength} to pass. You need at least 75%.
                      </p>
                    </div>
                    <div className="flex gap-1.5">
                      {quiz.map((_: any, i: number) => (
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
                        Question {qIndex + 1} of {totalQuizLength}
                      </p>
                      <p className="text-sm md:text-base font-display font-semibold text-foreground mb-4">
                        {quiz[qIndex].question}
                      </p>
                      <div className="space-y-2">
                        {quiz[qIndex].options.map((opt: string, oi: number) => {
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
                      <span className="text-muted-foreground text-lg"> / {totalQuizLength}</span>
                    </p>
                    <p className={`text-sm font-display font-semibold mt-1 ${passed ? 'text-emerald-400' : 'text-amber-400'}`}>
                         {passed
                      ? `🎉 Lesson passed! You scored ${passPercentage}%.`
                      : `Almost there — you scored ${passPercentage}%. You need ${passThreshold}/${totalQuizLength} to pass.`}
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

                  {quiz.map((q: any, qi: number) => {
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
                          {q.options.map((opt: string, oi: number) => {
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
            {stage === 'concept' ? 'Enter the lab' : 'Take the test'} <ChevronRight className="w-4 h-4" />
          </button>
        ) : !submitted ? (
          <button
            disabled={!allAnswered}
            onClick={handleSubmit}
            className="w-full bg-primary text-primary-foreground font-display font-semibold text-sm py-3.5 rounded-2xl neon-glow hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {allAnswered ? 'Submit test' : `Answer all (${Object.keys(answers).length}/${totalQuizLength})`}
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
              {stage === 'concept' ? 'Enter the lab' : 'Take the test'} <ChevronRight className="w-4 h-4" />
            </button>
          ) : !submitted ? (
            <button
              disabled={!allAnswered}
              onClick={handleSubmit}
              className="bg-primary text-primary-foreground font-display font-semibold text-sm py-2 px-6 rounded-full neon-glow hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {allAnswered ? 'Submit test' : `Answer all (${Object.keys(answers).length}/${totalQuizLength})`}
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

export default SqlLessonPage;
