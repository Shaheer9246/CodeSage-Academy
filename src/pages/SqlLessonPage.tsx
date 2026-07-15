import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Navigate, useSearchParams } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { toast } from 'sonner';
import { 
  ArrowLeft, BookOpen, FlaskConical, ClipboardCheck, 
  Check, X, ChevronRight, GraduationCap, Play, 
  RefreshCw, AlertTriangle, Database, CheckCircle2, type LucideIcon 
} from 'lucide-react';
import { SQL_LESSONS, isSqlLessonUnlocked } from '@/data/sqlLessons';

type Section = 'concept' | 'practical' | 'quiz';

// Helper to dynamic-load SQLite WASM drivers in-browser
const loadSqlJs = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    if ((window as any).initSqlJs) {
      resolve((window as any).initSqlJs);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/sql-wasm.js';
    script.async = true;
    script.onload = () => resolve((window as any).initSqlJs);
    script.onerror = () => reject(new Error('Failed to load local database driver.'));
    document.body.appendChild(script);
  });
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
      .then(async (initSqlJs) => {
        const SQL = await initSqlJs({
          locateFile: (file: string) => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`
        });
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
      <div className="glass-card rounded-2xl border border-border/30 overflow-hidden flex flex-col min-h-[280px] relative">
        {dbLoading && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-30 flex flex-col items-center justify-center gap-3">
            <RefreshCw className="w-5 h-5 text-primary animate-spin" />
            <p className="text-[10px] text-muted-foreground font-mono">Mounting SQLite Sandbox Core...</p>
          </div>
        )}

        <div className="px-4 py-2 bg-muted/30 border-b border-border/30 flex items-center justify-between">
          <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">SQL Interactive Term</span>
          <div className="flex gap-1.5">
            <button onClick={() => setUserQuery(practical?.starterQuery || '')} className="p-1 hover:bg-secondary rounded text-muted-foreground">
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
            <button onClick={handleRunQuery} disabled={dbLoading} className="px-2.5 py-1 bg-secondary text-[10px] font-semibold rounded text-primary flex items-center gap-1">
              <Play className="w-3 h-3" /> Run
            </button>
            <button onClick={handleVerifySolution} disabled={dbLoading} className="px-2.5 py-1 bg-primary text-primary-foreground text-[10px] font-semibold rounded flex items-center gap-1">
              <Check className="w-3 h-3" /> Verify
            </button>
          </div>
        </div>

        <textarea
          value={userQuery}
          onChange={(e) => setUserQuery(e.target.value)}
          className="w-full flex-1 p-4 bg-transparent text-foreground font-mono text-xs leading-relaxed focus:outline-none resize-none"
          placeholder="-- Write standard ANSI SQL commands here..."
          spellCheck={false}
        />
      </div>

      <div className="glass-card rounded-2xl border border-border/30 overflow-hidden p-4 font-mono text-[11px] min-h-[100px]">
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

const SqlLessonPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, completeLesson } = useUser();
  const [sp] = useSearchParams();
  
  const from = sp.get('from');
  const backTo = from === 'roadmap' ? '/roadmap' : from === 'dashboard' ? '/sql-learn?from=dashboard' : '/sql-learn';

  const lesson = SQL_LESSONS?.find((l: any) => l.id === id);
  const [section, setSection] = useState<Section>('concept');
  const [conceptView, setConceptView] = useState<'beginner' | 'advanced'>('beginner');
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isValidated, setIsValidated] = useState<boolean>(false);

  if (!user) return <Navigate to="/auth" replace />;
  if (!lesson) return <Navigate to="/sql-learn" replace />;
  if (!isSqlLessonUnlocked(lesson.id, (user?.completedLessons || []))) return <Navigate to="/sql-learn" replace />;

  const correctCount = lesson.quiz ? lesson.quiz.filter((q: any, i: number) => answers[i] === q.correctIndex).length : 0;
  const totalQuizLength = lesson.quiz ? lesson.quiz.length : 0;
  const passed = correctCount >= Math.min(3, totalQuizLength);
  const allAnswered = lesson.quiz ? lesson.quiz.every((_: any, i: number) => answers[i] !== undefined) : true;

  const handleSubmit = async () => {
    setSubmitted(true);
    if (passed) {
      if (user) await completeLesson(lesson.id);
      toast.success('SQL Target Mastered! +5 XP · +2 Coins 🎉');
      const fromQs = from ? `?from=${from}` : '';
      navigate(`/complete/${lesson.id}${fromQs}`);
    }
  };

  const SECTIONS: { key: Section; icon: LucideIcon; label: string }[] = [
    { key: 'concept', icon: BookOpen, label: 'Lesson' },
    { key: 'practical', icon: FlaskConical, label: 'Practical' },
    { key: 'quiz', icon: ClipboardCheck, label: 'Test' },
  ];

  return (
    <div className="min-h-screen bg-background grid-bg">
      <header className="sticky top-0 z-20 backdrop-blur-xl bg-background/80 border-b border-border/30 px-3 py-2.5 flex items-center gap-3">
        <button onClick={() => navigate(backTo)} className="text-muted-foreground hover:text-foreground p-1">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider truncate">{lesson.module || 'SQL Engine Engine'}</p>
          <h1 className="font-display font-bold text-sm text-foreground truncate flex items-center gap-1.5">
            <span>{lesson.icon || '📊'}</span> {lesson.title}
          </h1>
        </div>
      </header>

      <div className="sticky top-[57px] z-10 bg-background/80 backdrop-blur-xl border-b border-border/30 flex">
        {SECTIONS.map(s => (
          <button key={s.key} onClick={() => setSection(s.key)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-all border-b-2 ${
              section === s.key ? 'text-primary border-primary bg-primary/5' : 'text-muted-foreground border-transparent'
            }`}>
            <s.icon className="w-3.5 h-3.5" />{s.label}
            {s.key === 'quiz' && submitted && passed && <Check className="w-3 h-3 text-emerald-400" />}
          </button>
        ))}
      </div>

      <div className="max-w-2xl mx-auto px-4 py-5 pb-24">
        {section === 'concept' && (
          <div className="space-y-5 animate-fade-in">
            <div className="glass-card rounded-2xl p-4 border border-primary/20">
              <p className="text-[10px] font-mono text-primary uppercase tracking-wider mb-2">I. Core Philosophy</p>
              <p className="text-sm text-foreground leading-relaxed">{lesson.philosophy || lesson.practical?.intro}</p>
            </div>
            
            <div>
              <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-2 px-1">II. Detailed Breakdown</p>
              <div className="flex gap-1 mb-3 p-1 glass-card rounded-xl w-full">
                {(['beginner', 'advanced'] as const).map(v => (
                  <button key={v} onClick={() => setConceptView(v)}
                    className={`flex-1 py-1.5 rounded-lg text-[11px] font-display font-semibold capitalize transition-all ${
                      conceptView === v ? 'bg-primary/20 text-primary' : 'text-muted-foreground'
                    }`}>{v} View</button>
                ))}
              </div>
              <div className="space-y-3">
                {lesson.concepts?.map((c: any, i: number) => (
                  <div key={i} className="glass-card rounded-xl p-4">
                    <h3 className="font-display font-bold text-sm text-foreground mb-2">{c.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {conceptView === 'beginner' ? c.beginner : c.advanced}
                    </p>
                  </div>
                )) || <p className="text-xs text-muted-foreground italic">No documentation items indexed.</p>}
              </div>
            </div>
            <button onClick={() => setSection('practical')}
              className="w-full bg-primary text-primary-foreground font-display font-semibold text-sm py-3 rounded-2xl neon-glow hover:opacity-90 flex items-center justify-center gap-2">
              Try the Practical Lab <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {section === 'practical' && (
          <div className="space-y-4 animate-fade-in">
            <div className="glass-card rounded-2xl p-4 border border-amber-500/20">
              <p className="text-[10px] font-mono text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                <FlaskConical className="w-3 h-3" /> III. Practical Lab
              </p>
              <h2 className="font-display font-bold text-base text-foreground mb-1">{lesson.practical?.title || 'Data Structuring Objectives'}</h2>
              <p className="text-xs text-muted-foreground mb-3">{lesson.practical?.goal || 'Run and validate query commands inside your workspace.'}</p>
              
              {lesson.practical?.steps && (
                <ul className="space-y-1.5 mt-2 pt-2 border-t border-border/10">
                  {lesson.practical.steps.map((step: string, sIdx: number) => (
                    <li key={sIdx} className="text-xs text-muted-foreground flex gap-2">
                      <span className="text-primary font-bold">{sIdx + 1}.</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <SqlWorkspaceConsole 
              lessonId={lesson.id} 
              practical={lesson.practical}
              isValidated={isValidated}
              setIsValidated={setIsValidated}
            />

            <button onClick={() => setSection('quiz')}
              className="w-full bg-primary text-primary-foreground font-display font-semibold text-sm py-3 rounded-2xl neon-glow hover:opacity-90 flex items-center justify-center gap-2">
              Take the Mastery Test <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {section === 'quiz' && (
          <div className="space-y-4 animate-fade-in">
            <div className="glass-card rounded-2xl p-4 border border-primary/20">
              <p className="text-[10px] font-mono text-primary uppercase tracking-wider mb-1 flex items-center gap-1">
                <GraduationCap className="w-3 h-3" /> IV. Mastery Test
              </p>
              <p className="text-xs text-muted-foreground">Score 3/4 (or 100% on shorter segments) to submit this sandbox verification block.</p>
            </div>
            {lesson.quiz?.map((q: any, qi: number) => (
              <div key={qi} className="glass-card rounded-2xl p-4">
                <p className="text-[10px] font-mono text-muted-foreground mb-2">Question {qi + 1} of {totalQuizLength}</p>
                <p className="text-sm font-display font-semibold text-foreground mb-3">{q.question}</p>
                <div className="space-y-2">
                  {q.options.map((opt: string, oi: number) => {
                    const selected = answers[qi] === oi;
                    const isCorrect = oi === q.correctIndex;
                    let cls = 'border-border/30 hover:border-primary/30 text-foreground';
                    if (submitted && selected && isCorrect) cls = 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300';
                    else if (submitted && selected && !isCorrect) cls = 'border-red-500/50 bg-red-500/10 text-red-300';
                    else if (submitted && isCorrect) cls = 'border-emerald-500/30 bg-emerald-500/5 text-emerald-300';
                    else if (selected) cls = 'border-primary/40 bg-primary/10 text-primary';
                    return (
                      <button key={oi} disabled={submitted} onClick={() => setAnswers(p => ({ ...p, [qi]: oi }))}
                        className={`w-full text-left text-xs px-3 py-2.5 rounded-xl border-2 transition-all flex items-center justify-between gap-2 ${cls}`}>
                        <span>{opt}</span>
                        {submitted && selected && (isCorrect ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />)}
                        {submitted && !selected && isCorrect && <Check className="w-3.5 h-3.5 opacity-60" />}
                      </button>
                    );
                  })}
                </div>
                {submitted && q.explanation && (
                  <p className="text-[11px] text-muted-foreground mt-3 italic border-l-2 border-primary/30 pl-3">💡 {q.explanation}</p>
                )}
              </div>
            )) || <p className="text-xs text-muted-foreground italic">No quizzes configuration setup for this lesson module.</p>}
            
            {!submitted ? (
              <button disabled={!allAnswered} onClick={handleSubmit}
                className="w-full bg-primary text-primary-foreground font-display font-semibold text-sm py-3 rounded-2xl neon-glow hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                {allAnswered ? 'Submit Test' : `Answer all questions (${Object.keys(answers).length}/${totalQuizLength})`}
              </button>
            ) : (
              <div className="glass-card rounded-2xl p-5 text-center">
                <p className="text-2xl font-display font-bold text-foreground mb-1">{correctCount} / {totalQuizLength}</p>
                <p className={`text-sm font-display font-semibold mb-3 ${passed ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {passed ? '🎉 Lesson Passed!' : 'Almost there — try again'}
                </p>
                {!passed && (
                  <button onClick={() => { setAnswers({}); setSubmitted(false); }}
                    className="bg-primary text-primary-foreground text-xs font-semibold px-4 py-2 rounded-xl">Retry Test</button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SqlLessonPage;
