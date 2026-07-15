import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { 
  Play, Check, AlertTriangle, Database, RefreshCw, 
  CheckCircle2, ChevronLeft, ArrowRight, BookOpen, 
  Sparkles, Code, HelpCircle, Shield, Award 
} from 'lucide-react';
import { SQL_LESSONS, isSqlLessonUnlocked } from '../data/sqlLessons';

const LESSON_DATA_SET = SQL_LESSONS || [];

// Dynamic script loader for running SQLite inside the browser WASM sandbox
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

interface WorkspaceConsoleProps {
  lessonId: string;
  practical: any;
  onSuccessCompletion: () => void;
  isValidated: boolean;
  setIsValidated: (v: boolean) => void;
}

function SqlWorkspaceConsole({ lessonId, practical, onSuccessCompletion, isValidated, setIsValidated }: WorkspaceConsoleProps) {
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
        setExecutionMessage(`Execution successful: Returned ${res[0].values.length} records.`);
      } else {
        setQueryResult(null);
        setExecutionMessage("Command processed successfully. No rows returned.");
      }
    } catch (err: any) {
      setError(err.message || "Syntactical database failure.");
    } delete (window as any).db;
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
        setExecutionMessage("Excellent! Your query matches the reference solution specifications.");
        setIsValidated(true);
        onSuccessCompletion();
      } else {
        setError("Result mismatch. Output values do not match expected dataset rules.");
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
      <div className="glass-card rounded-2xl border border-border/30 overflow-hidden flex flex-col min-h-[340px] relative">
        {dbLoading && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-30 flex flex-col items-center justify-center gap-3">
            <RefreshCw className="w-5 h-5 text-primary animate-spin" />
            <p className="text-xs text-muted-foreground font-mono">Spawning WASM engine...</p>
          </div>
        )}

        <div className="px-4 py-2 bg-muted/30 border-b border-border/30 flex items-center justify-between">
          <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">SQL PLAYGROUND CONSOLE</span>
          <div className="flex gap-1.5">
            <button onClick={() => setUserQuery(practical?.starterQuery || '')} className="p-1 hover:bg-secondary rounded text-muted-foreground">
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
            <button onClick={handleRunQuery} disabled={dbLoading} className="px-2.5 py-1 bg-secondary text-[10px] font-bold rounded text-primary flex items-center gap-1">
              <Play className="w-3 h-3" /> Run
            </button>
            <button onClick={handleVerifySolution} disabled={dbLoading} className="px-2.5 py-1 bg-primary text-primary-foreground text-[10px] font-bold rounded flex items-center gap-1">
              <Check className="w-3 h-3" /> Validate
            </button>
          </div>
        </div>

        <textarea
          value={userQuery}
          onChange={(e) => setUserQuery(e.target.value)}
          className="w-full flex-1 p-4 bg-transparent text-foreground font-mono text-xs leading-relaxed focus:outline-none resize-none"
          placeholder="-- Modify queries to evaluate live outputs here..."
          spellCheck={false}
        />
      </div>

      <div className="glass-card rounded-2xl border border-border/30 overflow-hidden">
        <div className="px-4 py-2 bg-muted/30 border-b border-border/30">
          <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Sandbox Stream Outputs</p>
        </div>
        <div className="p-4 font-mono text-[11px] min-h-[120px]">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-300 rounded-xl flex gap-2">
              <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <div><strong className="block text-xs mb-0.5">Syntax Exception</strong><p>{error}</p></div>
            </div>
          )}

          {executionMessage && !error && (
            <div className={`p-3 border rounded-xl flex gap-2 ${isValidated ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' : 'bg-muted/30 border-border/30 text-muted-foreground'}`}>
              <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <div><strong className="block text-xs mb-0.5">{isValidated ? 'Verification Passed!' : 'Logs'}</strong><p>{executionMessage}</p></div>
            </div>
          )}

          {queryResult && (
            <div className="border border-border/30 rounded-xl overflow-hidden mt-3 max-w-full">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-muted/40 border-b border-border/30 text-muted-foreground">
                      {queryResult.columns.map((col, idx) => <th key={idx} className="p-2 border-r border-border/20 font-bold">{col}</th>)}
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
            </div>
          )}

          {!error && !executionMessage && !queryResult && (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground gap-1.5 py-6">
              <Database className="w-6 h-6 opacity-30" />
              <p className="text-[10px]">No logs generated yet. Fire up a code validation!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SqlLessonPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { user, updateUser } = useUser();

  const from = params.get('from');
  const fromQs = from ? `?from=${from}` : '';

  const currentIdx = LESSON_DATA_SET.findIndex((l: any) => l.id === id);
  const lesson = LESSON_DATA_SET[currentIdx];

  // Navigation Panel Controls
  const [activeTab, setActiveTab] = useState<'theory' | 'practical' | 'quiz'>('theory');
  const [explanationLevel, setExplanationLevel] = useState<'beginner' | 'advanced'>('beginner');
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizPassed, setQuizPassed] = useState<boolean>(false);
  const [isValidated, setIsValidated] = useState<boolean>(false);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  useEffect(() => {
    setActiveTab('theory');
    setExplanationLevel('beginner');
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setQuizPassed(false);
    setIsValidated(false);
  }, [id]);

  if (!lesson) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center space-y-4">
        <AlertTriangle className="w-12 h-12 text-destructive mx-auto" />
        <h2 className="text-lg font-bold">Lesson Block Missing</h2>
        <button onClick={() => navigate('/sql-learn')} className="text-xs text-primary underline">Return to Directory</button>
      </div>
    );
  }

  const handlePersistProgress = () => {
    const localCompleted = JSON.parse(localStorage.getItem('sql_completed_lessons') || '[]');
    if (!localCompleted.includes(lesson.id)) {
      localStorage.setItem('sql_completed_lessons', JSON.stringify([...localCompleted, lesson.id]));
    }
    if (user && updateUser && !user.completedLessons.includes(lesson.id)) {
      updateUser({ completedLessons: [...user.completedLessons, lesson.id] });
    }
  };

  const handleQuizSubmit = () => {
    if (!lesson.quiz) return;
    let correct = true;
    lesson.quiz.forEach((q: any, idx: number) => {
      if (selectedAnswers[idx] !== q.correctIndex) correct = false;
    });
    setQuizSubmitted(true);
    setQuizPassed(correct);
    if (correct) handlePersistProgress();
  };

  const handleNext = () => {
    if (currentIdx >= 0 && currentIdx < LESSON_DATA_SET.length - 1) {
      navigate(`/sql-lesson/${LESSON_DATA_SET[currentIdx + 1].id}${fromQs}`);
    }
  };

  const userCompletedList = user?.completedLessons || [];
  const hasCompletedCurrent = userCompletedList.includes(lesson.id);
  const nextLessonObj = LESSON_DATA_SET[currentIdx + 1];
  const isNextUnlocked = nextLessonObj ? isSqlLessonUnlocked(nextLessonObj.id, userCompletedList) : false;

  return (
    <div className="min-h-screen bg-background text-foreground pb-12">
      <div className="border-b border-border/40 bg-background/50 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <button onClick={() => navigate(from === 'dashboard' ? '/dashboard' : '/sql-learn')} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
            <ChevronLeft className="w-4 h-4" /> Exit to Menu
          </button>
          
          <div className="flex items-center gap-2 text-xs font-medium">
            <BookOpen className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground font-mono">Module {currentIdx + 1}/{LESSON_DATA_SET.length}:</span>
            <span>{lesson.title}</span>
          </div>

          <button 
            onClick={handleNext}
            disabled={currentIdx === LESSON_DATA_SET.length - 1 || (!hasCompletedCurrent && !isNextUnlocked)}
            className="flex items-center gap-1 px-3 py-1.5 bg-secondary hover:bg-secondary/80 disabled:opacity-40 rounded-xl text-xs font-semibold"
          >
            Next <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-6 grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left Side: Dynamic Workspace Documentation Tab Matrix */}
        <div className="lg:col-span-2 flex flex-col space-y-4">
          <div className="glass-card rounded-2xl p-5 space-y-3">
            <span className="text-[10px] font-mono text-primary uppercase tracking-wider font-bold flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-primary" /> SQL DB Core
            </span>
            <h1 className="text-xl font-extrabold tracking-tight">{lesson.title}</h1>
            <p className="text-xs text-muted-foreground leading-relaxed">{lesson.philosophy || lesson.practical?.intro}</p>
          </div>

          {/* Tab Selection Header */}
          <div className="flex border-b border-border/30 bg-muted/20 rounded-xl overflow-hidden p-1 gap-1">
            <button onClick={() => setActiveTab('theory')} className={`flex-1 py-2 text-xs font-medium rounded-lg flex items-center justify-center gap-1.5 transition-all ${activeTab === 'theory' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
              <BookOpen className="w-3.5 h-3.5" /> Theory
            </button>
            <button onClick={() => setActiveTab('practical')} className={`flex-1 py-2 text-xs font-medium rounded-lg flex items-center justify-center gap-1.5 transition-all ${activeTab === 'practical' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
              <Code className="w-3.5 h-3.5" /> Lab Goal
            </button>
            <button onClick={() => setActiveTab('quiz')} className={`flex-1 py-2 text-xs font-medium rounded-lg flex items-center justify-center gap-1.5 transition-all ${activeTab === 'quiz' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
              <HelpCircle className="w-3.5 h-3.5" /> Quiz
            </button>
          </div>

          {/* Dynamic Tab Panel Content */}
          <div className="flex-1">
            {activeTab === 'theory' && (
              <div className="space-y-4">
                <div className="flex bg-muted/40 p-1 rounded-xl border border-border/20 justify-between items-center">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground pl-2">Conceptual Depth</span>
                  <div className="flex gap-1">
                    <button onClick={() => setExplanationLevel('beginner')} className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${explanationLevel === 'beginner' ? 'bg-background text-foreground shadow-sm font-semibold' : 'text-muted-foreground'}`}>Beginner</button>
                    <button onClick={() => setExplanationLevel('advanced')} className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${explanationLevel === 'advanced' ? 'bg-primary text-primary-foreground font-semibold shadow-sm' : 'text-muted-foreground'}`}>Deep Dive</button>
                  </div>
                </div>

                <div className="space-y-3">
                  {lesson.concepts?.map((concept: any, index: number) => (
                    <div key={index} className={`p-4 rounded-xl border transition-all ${explanationLevel === 'advanced' ? 'bg-primary/5 border-primary/20' : 'glass-card border-border/40'}`}>
                      <h4 className="text-xs font-bold mb-1.5 flex items-center gap-1.5 text-foreground">
                        {explanationLevel === 'advanced' && <Shield className="w-3.5 h-3.5 text-primary" />}
                        {concept.title}
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed font-light">
                        {explanationLevel === 'advanced' ? concept.advanced : concept.beginner}
                      </p>
                    </div>
                  )) || <p className="text-xs text-muted-foreground italic">No modular concepts indexed for this chapter.</p>}
                </div>
              </div>
            )}

            {activeTab === 'practical' && (
              <div className="glass-card rounded-2xl p-4 space-y-4">
                <div className="space-y-2">
                  <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Exercise Objectives</p>
                  <ul className="space-y-2">
                    {lesson.practical?.steps?.map((step: string, idx: number) => (
                      <li key={idx} className="flex gap-2.5 text-xs text-muted-foreground leading-relaxed">
                        <span className="flex-shrink-0 w-4 h-4 rounded-full bg-secondary flex items-center justify-center text-[10px] font-bold text-foreground">{idx + 1}</span>
                        <span>{step}</span>
                      </li>
                    )) || <li className="text-xs text-muted-foreground italic">No specific exercise steps logged.</li>}
                  </ul>
                </div>
                <div className="pt-3 border-t border-border/30">
                  <p className="text-[10px] font-mono text-amber-400 uppercase tracking-wider mb-1">Target Criteria</p>
                  <p className="text-xs text-foreground font-medium">{lesson.practical?.goal}</p>
                </div>
              </div>
            )}

            {activeTab === 'quiz' && (
              <div className="space-y-4">
                {lesson.quiz?.map((item: any, qIdx: number) => (
                  <div key={qIdx} className="p-4 glass-card rounded-xl border border-border/30 space-y-3">
                    <h4 className="text-xs font-semibold text-foreground">{qIdx + 1}. {item.question}</h4>
                    <div className="grid grid-cols-1 gap-1.5">
                      {item.options?.map((opt: string, oIdx: number) => {
                        const isSelected = selectedAnswers[qIdx] === oIdx;
                        const isCorrect = oIdx === item.correctIndex;
                        let btnStyle = "bg-muted/20 border-border/40 text-muted-foreground";

                        if (isSelected) btnStyle = "bg-primary/10 border-primary text-primary";
                        if (quizSubmitted) {
                          if (isCorrect) btnStyle = "bg-emerald-500/10 border-emerald-500 text-emerald-400 font-medium";
                          else if (isSelected) btnStyle = "bg-red-500/10 border-red-500 text-red-400";
                          else btnStyle = "bg-transparent opacity-40 text-muted-foreground";
                        }

                        return (
                          <button
                            key={oIdx}
                            disabled={quizSubmitted}
                            onClick={() => setSelectedAnswers(prev => ({ ...prev, [qIdx]: oIdx }))}
                            className={`p-2.5 text-left text-xs rounded-lg border transition-all flex items-center justify-between ${btnStyle}`}
                          >
                            <span>{opt}</span>
                            {quizSubmitted && isCorrect && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />}
                          </button>
                        );
                      })}
                    </div>

                    {quizSubmitted && (
                      <p className="text-[11px] leading-relaxed text-muted-foreground bg-muted/30 p-2.5 rounded-lg border border-border/10">
                        <span className="font-bold block mb-0.5">{selectedAnswers[qIdx] === item.correctIndex ? "✓ Correct" : "✗ Explanation"}</span>
                        {item.explanation}
                      </p>
                    )}
                  </div>
                )) || <p className="text-xs text-muted-foreground italic">No checkpoint quizzes included in this lesson block.</p>}

                {!quizSubmitted ? (
                  <button
                    onClick={handleQuizSubmit}
                    disabled={Object.keys(selectedAnswers).length !== (lesson.quiz?.length || 0)}
                    className="w-full py-2.5 bg-primary text-primary-foreground disabled:opacity-40 rounded-xl text-xs font-bold transition-all"
                  >
                    Submit Checkpoint Answers
                  </button>
                ) : (
                  !quizPassed && (
                    <button onClick={() => { setQuizSubmitted(false); setSelectedAnswers({}); }} className="w-full py-2.5 bg-secondary text-foreground rounded-xl text-xs font-bold flex items-center justify-center gap-1">
                      <RefreshCw className="w-3.5 h-3.5" /> Try Checkpoint Again
                    </button>
                  )
                )}

                {quizSubmitted && quizPassed && (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl text-center space-y-1">
                    <Award className="w-6 h-6 text-emerald-400 mx-auto" />
                    <h4 className="font-bold text-xs text-emerald-400">Conceptual Review Verified!</h4>
                    <p className="text-[10px] text-emerald-300">Your profile progression parameters have updated successfully.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Shared Execution WASM Sandbox Playground Environment */}
        <div className="lg:col-span-3">
          <SqlWorkspaceConsole 
            lessonId={lesson.id} 
            practical={lesson.practical} 
            onSuccessCompletion={handlePersistProgress}
            isValidated={isValidated}
            setIsValidated={setIsValidated}
          />
        </div>
      </div>
    </div>
  );
}
