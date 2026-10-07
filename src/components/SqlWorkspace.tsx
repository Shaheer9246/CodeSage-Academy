import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Play, Check, AlertTriangle, BookOpen, Award, ChevronRight, 
  ChevronLeft, Database, Code, Shield, CheckCircle2, 
  Terminal, HelpCircle, Sparkles, RefreshCw, XCircle, Info
} from 'lucide-react';
import { SQL_LESSONS, SQLLesson, isSqlLessonUnlocked } from '../data/sqlLessons';

// --- Types & Interfaces ---

type VerificationStrategy = 'exact-match' | 'schema-check' | 'subset-match' | 'count-only';

interface LessonPractical {
  title: string;
  intro: string;
  steps: string[];
  goal: string;
  starterQuery: string;
  seedSql: string; // SQL to create tables and insert dummy data
  solutionQuery: string; // Reference correct answer
  verificationStrategy?: VerificationStrategy; // NEW: How to check correctness
  customValidator?: (userRes: any[], solRes: any[]) => boolean; // Optional JS validator
}

interface SqlWorkspaceProps {
  onComplete?: (lessonId: string) => void;
}

// --- Helper: Load SQL.js Engine ---
const loadSqlJs = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    if ((window as any).initSqlJs) {
      resolve((window as any).initSqlJs);
      return;
    }
    
    const tryLoad = (src: string, nextSrc?: string) => {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.onload = () => resolve((window as any).initSqlJs);
      script.onerror = () => {
        if (nextSrc) {
          tryLoad(nextSrc);
        } else {
          reject(new Error('Failed to load SQL engine from all sources.'));
        }
      };
      document.body.appendChild(script);
    };

    // Try local first, then CDN
    tryLoad('/sql/sql-wasm.js', 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/sql-wasm.js');
  });
};

// --- Main Component ---

export default function SqlWorkspace({ onComplete }: SqlWorkspaceProps) {
  const [currentLessonIndex, setCurrentLessonIndex] = useState<number>(0);
  const [completedLessons, setCompletedLessons] = useState<string[]>(() => {
    const saved = localStorage.getItem('sql_completed_lessons_v2'); // Bumped version key
    return saved ? JSON.parse(saved) : [];
  });

  const lesson: SQLLesson | undefined = SQL_LESSONS[currentLessonIndex];

  // SQL Runner State
  const [userQuery, setUserQuery] = useState<string>('');
  const [dbLoading, setDbLoading] = useState<boolean>(true);
  const [queryResult, setQueryResult] = useState<{ columns: string[]; values: any[][] } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [executionMessage, setExecutionMessage] = useState<string | null>(null);
  
  // Tabs & Settings
  const [activeTab, setActiveTab] = useState<'theory' | 'practical' | 'quiz'>('theory');
  const [explanationLevel, setExplanationLevel] = useState<'beginner' | 'advanced'>('beginner');

  // Quiz State
  const [selectedAnswers, setSelectedAnswers] = useState<{ [index: number]: number }>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizPassed, setQuizPassed] = useState<boolean>(false);

  // Success State
  const [lessonCompleted, setLessonCompleted] = useState<boolean>(false);

  const SQLRef = useRef<any>(null);
  const dbCacheRef = useRef<any>(null); // Cache the initialized DB schema to speed up reseeding

  // --- Effects ---

  // Sync state when lesson changes
  useEffect(() => {
    if (!lesson) return;
    
    // Reset UI States
    setUserQuery(lesson.practical?.starterQuery || '');
    setQueryResult(null);
    setError(null);
    setExecutionMessage(null);
    setLessonCompleted(completedLessons.includes(lesson.id));
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setQuizPassed(false);
    setActiveTab('theory');
    dbCacheRef.current = null; // Invalidate DB cache on lesson switch
    
  }, [currentLessonIndex, lesson, completedLessons]);

  // Initialize SQL Engine once
  useEffect(() => {
    let isMounted = true;
    loadSqlJs()
      .then(async (initSqlJs) => {
        if (!isMounted) return;
        try {
          const SQL = await initSqlJs({
            locateFile: (file: string) => `/sql/${file}`
          });
          SQLRef.current = SQL;
          setDbLoading(false);
        } catch (err) {
          console.error("WASM Init Failed", err);
          if (isMounted) setError("Critical: Could not initialize SQL WebAssembly module.");
          setDbLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setError("Network Error: Failed to download SQL engine.");
          setDbLoading(false);
        }
      });

    return () => { isMounted = false; };
  }, []);

  // --- Core Logic ---

  /**
   * Creates a fresh instance of the lesson's database.
   * Optimized: If we already have the schema created, we just wipe data and re-seed.
   */
  const getFreshDatabase = useCallback(() => {
    if (!SQLRef.current || !lesson?.practical) return null;

    // For simplicity and isolation safety, we create a new DB every time.
    // In a high-performance scenario, we'd reuse connections, but SQLite in-memory 
    // creation is extremely fast (<1ms usually), so this is safe.
    const db = new SQLRef.current.Database();
    
    try {
      if (lesson.practical.seedSql && lesson.practical.seedSql.trim() !== '') {
        db.run(lesson.practical.seedSql);
      }
      return db;
    } catch (e: any) {
      console.error("Seed Error:", e);
      throw new Error(`Database seeding failed: ${e.message}. Please contact support.`);
    }
  }, [lesson]);

  const handleRunQuery = () => {
    if (dbLoading) return;
    setError(null);
    setQueryResult(null);
    setExecutionMessage(null);

    let db;
    try {
      db = getFreshDatabase();
      if (!db) throw new Error("DB not ready");

      const startTime = performance.now();
      const res = db.exec(userQuery);
      const endTime = performance.now();

      if (res.length > 0) {
        setQueryResult({
          columns: res[0].columns,
          values: res[0].values
        });
        setExecutionMessage(`Success: Returned ${res[0].values.length} rows in ${(endTime - startTime).toFixed(2)}ms.`);
      } else {
        setQueryResult(null);
        setExecutionMessage("Command executed successfully. No result set returned.");
      }
    } catch (err: any) {
      // Map common SQL errors to friendly messages
      let msg = err.message || "Unknown SQL Error";
      if (msg.includes("no such table")) msg += "\n(Hint: Did you typo the table name?)";
      if (msg.includes("syntax error")) msg += "\n(Hint: Check commas, quotes, and keywords.)";
      
      setError(msg);
    } finally {
      if (db) db.close();
    }
  };

  const handleVerifySolution = () => {
    if (!lesson?.practical) return;
    
    setError(null);
    setExecutionMessage(null);
    setQueryResult(null);

    let dbUser, dbSol;
    try {
      dbUser = getFreshDatabase();
      dbSol = getFreshDatabase();
      
      if (!dbUser || !dbSol) throw new Error("DB instances missing");

      // Execute User Query
      const userRes = dbUser.exec(userQuery);
      
      // Execute Solution Query
      const solRes = dbSol.exec(lesson.practical.solutionQuery);

      let passed = false;
      let reason = "";

      // Determine Verification Strategy
      const strategy = lesson.practical.verificationStrategy || 'exact-match';

      if (strategy === 'custom' && lesson.practical.customValidator) {
        passed = lesson.practical.customValidator(userRes, solRes);
        reason = passed ? "Custom validation passed." : "Output does not meet custom criteria.";
      } 
      else if (strategy === 'count-only') {
        const uCount = userRes.length > 0 ? userRes[0].values.length : 0;
        const sCount = solRes.length > 0 ? solRes[0].values.length : 0;
        passed = uCount === sCount;
        reason = passed ? `Row count matches (${uCount}).` : `Row count mismatch: Expected ${sCount}, got ${uCount}.`;
      }
      else if (strategy === 'schema-check') {
        // Useful for CREATE TABLE lessons
        const getUserSchema = () => {
           const r = dbUser.exec("SELECT sql FROM sqlite_master WHERE type='table';");
           return r.length > 0 ? r[0].values.map(v => v[0]).sort().join('|') : '';
        };
        const getSolSchema = () => {
           const r = dbSol.exec("SELECT sql FROM sqlite_master WHERE type='table';");
           return r.length > 0 ? r[0].values.map(v => v[0]).sort().join('|') : '';
        };
        
        // Normalize whitespace for comparison
        const normalize = (s: string) => s.replace(/\s+/g, ' ').trim().toLowerCase();
        passed = normalize(getUserSchema()) === normalize(getSolSchema());
        reason = passed ? "Table schemas match exactly." : "Table structures differ.";
      }
      else {
        // Default: Exact Match (JSON stringify comparison)
        // Note: Order matters in exact match. If order shouldn't matter, sort rows first.
        const normalizeRes = (res: any[]) => {
          if (!res || res.length === 0) return [];
          return res[0].values.sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));
        };
        
        passed = JSON.stringify(normalizeRes(userRes)) === JSON.stringify(normalizeRes(solRes));
        reason = passed ? "Results match reference solution exactly." : "Data mismatch.";
      }

      if (passed) {
        setExecutionMessage("✅ Verified! Your solution is correct.");
        markLessonComplete(lesson.id);
        
        // Show user their result too
        if (userRes.length > 0) {
             setQueryResult({
                columns: userRes[0].columns,
                values: userRes[0].values
              });
        }
      } else {
        setError(`❌ Verification Failed.\n${reason}\n\nExpected Result:\n${JSON.stringify(solRes, null, 2)}`);
      }

    } catch (err: any) {
      setError(`Verification Error: ${err.message}`);
    } finally {
      if (dbUser) dbUser.close();
      if (dbSol) dbSol.close();
    }
  };

  const markLessonComplete = (lessonId: string) => {
    if (!completedLessons.includes(lessonId)) {
      const updated = [...completedLessons, lessonId];
      setCompletedLessons(updated);
      localStorage.setItem('sql_completed_lessons_v2', JSON.stringify(updated));
      setLessonCompleted(true);
      if (onComplete) onComplete(lessonId);
    }
  };

  const handleQuizSubmit = () => {
    if (!lesson?.quiz) return;
    let allCorrect = true;
    lesson.quiz.forEach((q, idx) => {
      if (selectedAnswers[idx] !== q.correctIndex) {
        allCorrect = false;
      }
    });

    setQuizSubmitted(true);
    setQuizPassed(allCorrect);
    if (allCorrect) {
      markLessonComplete(lesson.id);
    }
  };

  // --- Render Guards ---
  if (!lesson) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center font-sans p-6">
        <AlertTriangle className="w-12 h-12 text-rose-400 mb-4 animate-bounce" />
        <h2 className="text-xl font-bold mb-2">Configuration Error</h2>
        <p className="text-sm text-slate-400 text-center max-w-md">
          Lesson index out of bounds or data missing.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-500/10 text-emerald-400 p-2 rounded-lg border border-emerald-500/20 shadow-lg shadow-emerald-500/5">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-wide bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">SQL Master Class</h1>
            <p className="text-xs text-slate-400 font-medium">
              Lesson {lesson.order}/{SQL_LESSONS.length} • {lesson.module}
            </p>
          </div>
        </div>

        {/* Progress Dots */}
        <div className="hidden md:flex items-center gap-1.5">
          {SQL_LESSONS.map((l) => {
            const isCompleted = completedLessons.includes(l.id);
            const isActive = l.id === lesson.id;
            const isUnlocked = isSqlLessonUnlocked(l.id, completedLessons);

            return (
              <button
                key={l.id}
                onClick={() => isUnlocked && setCurrentLessonIndex(l.order - 1)}
                disabled={!isUnlocked}
                title={`${l.title} ${isCompleted ? '(Completed)' : ''}`}
                className={`relative w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-300 group
                  ${isActive 
                    ? 'bg-emerald-500 text-slate-950 scale-110 ring-2 ring-emerald-400/50 shadow-lg' 
                    : isCompleted 
                    ? 'bg-emerald-900/50 text-emerald-400 border border-emerald-500/30 hover:border-emerald-400' 
                    : isUnlocked 
                    ? 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white' 
                    : 'bg-slate-900/50 text-slate-600 cursor-not-allowed opacity-50'
                  }`}
              >
                {isCompleted ? <Check className="w-3.5 h-3.5" /> : l.order}
                
                {/* Tooltip */}
                {!isActive && (
                   <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-xs text-white rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 border border-slate-700">
                     {l.title}
                   </span>
                )}
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Workspace Grid */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-2 overflow-hidden h-[calc(100vh-73px)]">
        
        {/* LEFT: Documentation & Theory */}
        <div className="flex flex-col border-r border-slate-800 overflow-y-auto bg-slate-900/10 relative">
          {/* Scroll Shadow Fade */}
          <div className="sticky top-0 z-10 bg-gradient-to-b from-slate-950 via-slate-950/95 to-transparent pb-2 pt-6 px-6">
             <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-2">
               <span>{lesson.icon}</span>
               <span>{lesson.module}</span>
             </div>
             <h2 className="text-2xl font-bold tracking-tight mb-3 text-white">{lesson.title}</h2>
             <p className="text-sm text-slate-400 leading-relaxed font-light line-clamp-3">{lesson.philosophy}</p>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-slate-800 bg-slate-900/40 backdrop-blur-sm sticky top-[140px] z-10">
            {[
              { id: 'theory', label: 'Theory', icon: BookOpen },
              { id: 'practical', label: 'Lab', icon: Code },
              { id: 'quiz', label: 'Quiz', icon: HelpCircle }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-3 px-2 text-xs font-semibold flex items-center justify-center gap-2 border-b-2 transition-all ${
                  activeTab === tab.id 
                    ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5' 
                    : 'border-transparent text-slate-500 hover:text-slate-300 hover:bg-slate-800/30'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6 flex-1 space-y-6">
            {activeTab === 'theory' && (
              <>
                <div className="flex items-center justify-between bg-slate-900/60 p-1.5 rounded-lg border border-slate-800">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 pl-2">Depth</span>
                  <div className="flex gap-1 bg-slate-950 p-0.5 rounded-md">
                    <button
                      onClick={() => setExplanationLevel('beginner')}
                      className={`px-3 py-1 rounded text-[10px] font-bold transition-all ${
                        explanationLevel === 'beginner' ? 'bg-emerald-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Simple
                    </button>
                    <button
                      onClick={() => setExplanationLevel('advanced')}
                      className={`px-3 py-1 rounded text-[10px] font-bold transition-all ${
                        explanationLevel === 'advanced' ? 'bg-violet-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Technical
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {lesson.concepts?.map((concept, index) => (
                    <div 
                      key={index} 
                      className={`group p-5 rounded-xl border transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl ${
                        explanationLevel === 'advanced' 
                          ? 'bg-violet-950/10 border-violet-500/20 hover:border-violet-500/40' 
                          : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <h4 className={`text-base font-bold mb-2 flex items-center gap-2 ${
                        explanationLevel === 'advanced' ? 'text-violet-400' : 'text-emerald-400'
                      }`}>
                        {explanationLevel === 'advanced' ? <Shield className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                        {concept.title}
                      </h4>
                      <p className="text-sm text-slate-300 leading-relaxed font-light">
                        {explanationLevel === 'advanced' ? concept.advanced : concept.beginner}
                      </p>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setActiveTab('practical')}
                  className="w-full py-3 mt-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20 transition-all transform active:scale-95"
                >
                  Start Coding
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}

            {activeTab === 'practical' && (
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 p-5 rounded-xl shadow-inner">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-3">
                    <TargetIcon className="w-5 h-5 text-emerald-400" />
                    Mission: {lesson.practical?.title}
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed mb-4">{lesson.practical?.intro}</p>
                  
                  <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800/50">
                    <p className="text-[10px] font-bold uppercase text-slate-500 mb-1">Goal</p>
                    <p className="text-xs text-emerald-300 font-mono">{lesson.practical?.goal}</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3 flex items-center gap-2">
                    <ListIcon className="w-3 h-3" /> Steps
                  </h4>
                  <ul className="space-y-3">
                    {lesson.practical?.steps?.map((step, idx) => (
                      <li key={idx} className="flex gap-3 text-sm text-slate-300 leading-relaxed group">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-400 group-hover:bg-emerald-500 group-hover:text-slate-950 group-hover:border-emerald-500 transition-colors">
                          {idx + 1}
                        </span>
                        <span className="pt-0.5">{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'quiz' && (
              <div className="space-y-6">
                 <div className="text-center py-4">
                   <HelpCircle className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                   <h3 className="text-lg font-bold text-white">Knowledge Check</h3>
                   <p className="text-xs text-slate-400">Pass this to unlock the next lesson.</p>
                 </div>

                {lesson.quiz?.map((item, qIdx) => (
                  <div key={qIdx} className="space-y-3 p-4 bg-slate-900/30 border border-slate-800/80 rounded-xl">
                    <h4 className="text-sm font-semibold text-slate-200 leading-snug">{qIdx + 1}. {item.question}</h4>
                    <div className="grid gap-2">
                      {item.options?.map((opt, oIdx) => {
                        const isSelected = selectedAnswers[qIdx] === oIdx;
                        const isCorrect = oIdx === item.correctIndex;
                        
                        let styleClass = "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-600 hover:text-slate-200";
                        if (isSelected && !quizSubmitted) styleClass = "bg-emerald-500/10 border-emerald-500 text-emerald-400";
                        
                        if (quizSubmitted) {
                          if (isCorrect) styleClass = "bg-emerald-900/20 border-emerald-500/50 text-emerald-400";
                          else if (isSelected) styleClass = "bg-rose-900/20 border-rose-500/50 text-rose-400";
                          else styleClass = "bg-slate-900/50 border-slate-800 text-slate-600 opacity-60";
                        }

                        return (
                          <button
                            key={oIdx}
                            disabled={quizSubmitted}
                            onClick={() => setSelectedAnswers(prev => ({ ...prev, [qIdx]: oIdx }))}
                            className={`w-full p-3 text-left text-sm rounded-lg border transition-all duration-200 flex items-center justify-between ${styleClass}`}
                          >
                            <span className="pr-2">{opt}</span>
                            {quizSubmitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
                            {quizSubmitted && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                    
                    {quizSubmitted && (
                       <div className={`mt-2 p-3 rounded text-xs leading-relaxed border-l-2 ${
                         selectedAnswers[qIdx] === item.correctIndex 
                           ? 'bg-emerald-950/20 border-emerald-500 text-emerald-200' 
                           : 'bg-rose-950/20 border-rose-500 text-rose-200'
                       }`}>
                         <strong className="block mb-1 uppercase tracking-wide text-[10px] opacity-70">Explanation</strong>
                         {item.explanation}
                       </div>
                    )}
                  </div>
                ))}

                {!quizSubmitted ? (
                  <button
                    onClick={handleQuizSubmit}
                    disabled={Object.keys(selectedAnswers).length !== (lesson.quiz?.length || 0)}
                    className="w-full py-3 bg-emerald-600 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold rounded-lg shadow-lg hover:bg-emerald-500 transition-all"
                  >
                    Submit Answers
                  </button>
                ) : (
                  <div className="text-center space-y-3">
                    {quizPassed ? (
                       <div className="py-4 bg-emerald-900/20 border border-emerald-500/30 rounded-xl">
                         <Award className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                         <p className="font-bold text-emerald-400">Perfect Score!</p>
                         <button onClick={() => setActiveTab('practical')} className="text-xs text-emerald-300 underline mt-1">Go to Lab</button>
                       </div>
                    ) : (
                      <button
                        onClick={() => { setQuizSubmitted(false); setSelectedAnswers({}); }}
                        className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg flex items-center justify-center gap-2"
                      >
                        <RefreshCw className="w-4 h-4" /> Retry Quiz
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: SQL Editor & Results */}
        <div className="flex flex-col bg-slate-950 overflow-hidden border-l border-slate-800">
          {/* Toolbar */}
          <div className="px-4 py-3 bg-slate-900/60 border-b border-slate-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-mono">
              <Terminal className="w-4 h-4 text-emerald-500" />
              <span className="uppercase tracking-wider">SQLite Playground</span>
            </div>
            
            <div className="flex gap-2">
               <button
                onClick={() => {
                   setUserQuery(lesson.practical?.starterQuery || '');
                   setQueryResult(null);
                   setError(null);
                   setExecutionMessage(null);
                }}
                className="p-2 hover:bg-slate-800 text-slate-400 hover:text-white rounded transition-colors" title="Reset Code"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={handleRunQuery}
                disabled={dbLoading}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 hover:text-emerald-300 text-xs font-bold rounded border border-slate-700 flex items-center gap-1.5 transition-all disabled:opacity-50"
              >
                <Play className="w-3 h-3 fill-current" /> Run
              </button>
              <button
                onClick={handleVerifySolution}
                disabled={dbLoading}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded shadow-lg shadow-emerald-900/20 flex items-center gap-1.5 transition-all disabled:opacity-50"
              >
                <Check className="w-3 h-3" /> Validate
              </button>
            </div>
          </div>

          {/* Editor Area */}
          <div className="flex-1 min-h-[200px] relative group">
            {dbLoading && (
              <div className="absolute inset-0 z-20 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
                <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-xs text-slate-400 font-mono animate-pulse">Initializing WASM Engine...</p>
              </div>
            )}
            
            <textarea
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              className="w-full h-full p-4 bg-slate-950 text-slate-200 font-mono text-sm leading-relaxed focus:outline-none resize-none selection:bg-emerald-500/30 placeholder:text-slate-600"
              placeholder="-- SELECT * FROM users;"
              spellCheck={false}
            />
            
            {/* Line Numbers Gutter Simulation (Optional Visual Polish) */}
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-slate-900/30 border-r border-slate-800/50 hidden sm:block pointer-events-none select-none text-right pr-2 pt-4 text-[10px] text-slate-600 font-mono">
               {Array.from({ length: Math.max(1, userQuery.split('\n').length) }).map((_, i) => (
                 <div key={i}>{i + 1}</div>
               ))}
            </div>
          </div>

          {/* Results Area */}
          <div className="h-[45%] min-h-[200px] flex flex-col bg-slate-900/20 border-t border-slate-800">
            <div className="px-4 py-2 bg-slate-900/40 border-b border-slate-800 flex items-center justify-between shrink-0">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Output Console</span>
              {lessonCompleted && (
                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-900/20 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  <CheckCircle2 className="w-3 h-3" /> Completed
                </span>
              )}
            </div>

            <div className="flex-1 overflow-auto p-4 font-mono text-xs relative">
              
              {/* Error Display */}
              {error && (
                <div className="mb-4 p-4 bg-rose-950/30 border border-rose-500/30 text-rose-300 rounded-lg flex gap-3 items-start animate-fade-in-down">
                  <AlertTriangle className="w-5 h-5 flex-shrink-0 text-rose-500 mt-0.5" />
                  <div className="flex-1">
                    <strong className="block text-rose-200 mb-1 text-sm">SQL Error</strong>
                    <pre className="whitespace-pre-wrap break-words text-xs leading-relaxed opacity-90">{error}</pre>
                  </div>
                </div>
              )}

              {/* Success Message */}
              {executionMessage && !error && (
                <div className="mb-4 p-3 bg-emerald-950/20 border border-emerald-500/20 text-emerald-300 rounded-lg flex gap-3 items-center animate-fade-in-down">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-500" />
                  <span className="text-xs font-medium">{executionMessage}</span>
                </div>
              )}

              {/* Table Results */}
              {queryResult ? (
                <div className="border border-slate-800 rounded-lg overflow-hidden bg-slate-950/50 shadow-2xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-900 border-b border-slate-800">
                          {queryResult.columns.map((col, idx) => (
                            <th key={idx} className="p-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-r border-slate-800/50 last:border-r-0 bg-slate-900/80">
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/50">
                        {queryResult.values.map((row, rIdx) => (
                          <tr key={rIdx} className="hover:bg-slate-800/30 transition-colors">
                            {row.map((val, cIdx) => (
                              <td key={cIdx} className="p-3 text-slate-300 border-r border-slate-800/30 last:border-r-0 truncate max-w-[200px]" title={String(val)}>
                                {val === null ? <span className="text-slate-600 italic">NULL</span> : String(val)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="px-3 py-1.5 bg-slate-900/50 border-t border-slate-800 text-[10px] text-slate-500 text-right">
                    {queryResult.values.length} row(s) affected
                  </div>
                </div>
              ) : (
                !error && !executionMessage && (
                  <div className="h-full flex flex-col items-center justify-center text-slate-600 gap-2 opacity-50">
                    <Database className="w-8 h-8" />
                    <p className="text-xs font-mono">Awaiting execution...</p>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer Navigation */}
      <footer className="px-6 py-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between shrink-0">
        <button
          disabled={currentLessonIndex === 0}
          onClick={() => setCurrentLessonIndex(prev => prev - 1)}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2 text-sm font-medium transition-all"
        >
          <ChevronLeft className="w-4 h-4" /> Prev
        </button>

        <div className="flex items-center gap-3">
           <div className="w-32 h-1.5 bg-slate-800 rounded-full overflow-hidden">
             <div 
               className="h-full bg-emerald-500 transition-all duration-500 ease-out"
               style={{ width: `${(completedLessons.length / SQL_LESSONS.length) * 100}%` }}
             ></div>
           </div>
           <span className="text-xs text-slate-400 font-mono">
             {completedLessons.length}/{SQL_LESSONS.length} Done
           </span>
        </div>

        {currentLessonIndex < SQL_LESSONS.length - 1 ? (
          <button
            disabled={!isSqlLessonUnlocked(SQL_LESSONS[currentLessonIndex + 1].id, completedLessons)}
            onClick={() => setCurrentLessonIndex(prev => prev + 1)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2 text-sm font-bold transition-all shadow-lg shadow-emerald-900/20"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          completedLessons.length === SQL_LESSONS.length ? (
             <div className="px-4 py-2 bg-yellow-500/10 border border-yellow-500 text-yellow-400 rounded-lg text-sm font-bold flex items-center gap-2 animate-pulse">
               <Award className="w-4 h-4" /> Course Complete!
             </div>
          ) : (
             <button disabled className="px-4 py-2 bg-slate-800 text-slate-500 rounded-lg cursor-not-allowed text-sm">
               Finish Lessons First
             </button>
          )
        )}
      </footer>
    </div>
  );
}

// Small helper icons if lucide doesn't have them exactly named
const TargetIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
);
const ListIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
);
