import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, Check, AlertTriangle, BookOpen, Award, ChevronRight, 
  ChevronLeft, Database, Code, Shield, CheckCircle2, 
  Terminal, HelpCircle, Sparkles, RefreshCw, Eye
} from 'lucide-react';
import { SQL_LESSONS, SQLLesson, isSqlLessonUnlocked } from '../data/sqlLessons';

// Dynamic script loader for running SQLite in the sandbox
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

export default function SqlWorkspace() {
  const [currentLessonIndex, setCurrentLessonIndex] = useState<number>(0);
  const [completedLessons, setCompletedLessons] = useState<string[]>(() => {
    const saved = localStorage.getItem('sql_completed_lessons');
    return saved ? JSON.parse(saved) : [];
  });

  const lesson: SQLLesson = SQL_LESSONS[currentLessonIndex];

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

  // Sync starter query when active lesson updates
  useEffect(() => {
    setUserQuery(lesson.practical.starterQuery);
    setQueryResult(null);
    setError(null);
    setExecutionMessage(null);
    setLessonCompleted(completedLessons.includes(lesson.id));
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setQuizPassed(false);
    setActiveTab('theory');
  }, [currentLessonIndex, lesson, completedLessons]);

  // Load the SQL engine once
  useEffect(() => {
    loadSqlJs()
      .then(async (initSqlJs) => {
        const SQL = await initSqlJs({
          locateFile: (file: string) => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`
        });
        SQLRef.current = SQL;
        setDbLoading(false);
      })
      .catch((err) => {
        setError("Database sandbox environment could not be initialized. Please check connection.");
        setDbLoading(false);
      });
  }, []);

  // Helper: Setup isolated SQLite instance and seed it
  const createSeededDatabase = () => {
    if (!SQLRef.current) return null;
    const db = new SQLRef.current.Database();
    if (lesson.practical.seedSql && lesson.practical.seedSql.trim() !== '') {
      db.run(lesson.practical.seedSql);
    }
    return db;
  };

  // Run the user query to inspect dataset results
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
      // Execute input
      const res = db.exec(userQuery);
      
      if (res.length > 0) {
        setQueryResult({
          columns: res[0].columns,
          values: res[0].values
        });
        setExecutionMessage(`Execution successful: Query returned ${res[0].values.length} records.`);
      } else {
        // Query ran successfully but returned no tabular output (e.g., updates/creations/deletes)
        setQueryResult(null);
        setExecutionMessage("Command processed successfully. No rows returned.");
      }
    } catch (err: any) {
      setError(err.message || "Syntactical database failure.");
    } finally {
      db.close();
    }
  };

  // Intelligent verification algorithm
  const handleVerifySolution = () => {
    setError(null);
    setExecutionMessage(null);

    const dbUser = createSeededDatabase();
    const dbSol = createSeededDatabase();

    if (!dbUser || !dbSol) {
      setError("Database driver missing.");
      return;
    }

    try {
      let userPassed = false;

      // Lesson 5 - Schema Creation Validation
      if (lesson.id === 'sql-05') {
        try {
          dbUser.run(userQuery);
          dbSol.run(lesson.practical.solutionQuery);

          const userSchema = dbUser.exec("SELECT sql FROM sqlite_master WHERE name='profiles';");
          const solSchema = dbSol.exec("SELECT sql FROM sqlite_master WHERE name='profiles';");

          const cleanStr = (s: string) => s.replace(/\s+/g, ' ').trim().toLowerCase();
          if (userSchema.length > 0 && solSchema.length > 0) {
            userPassed = cleanStr(JSON.stringify(userSchema)) === cleanStr(JSON.stringify(solSchema));
          }
        } catch {
          userPassed = false;
        }
      }
      // Lesson 7 - Mutation/Update Validation
      else if (lesson.id === 'sql-07') {
        try {
          dbUser.run(userQuery);
          dbSol.run(lesson.practical.solutionQuery);

          const userState = dbUser.exec("SELECT * FROM members ORDER BY id;");
          const solState = dbSol.exec("SELECT * FROM members ORDER BY id;");

          userPassed = JSON.stringify(userState) === JSON.stringify(solState);
        } catch {
          userPassed = false;
        }
      }
      // Standard Retrieval Validations
      else {
        const userRes = dbUser.exec(userQuery);
        const solRes = dbSol.exec(lesson.practical.solutionQuery);

        userPassed = JSON.stringify(userRes) === JSON.stringify(solRes);
        
        if (userRes.length > 0) {
          setQueryResult({
            columns: userRes[0].columns,
            values: userRes[0].values
          });
        }
      }

      if (userPassed) {
        setExecutionMessage("Excellent! Your query matches the reference solution specifications.");
        markLessonComplete(lesson.id);
      } else {
        setError("Result mismatch. Your output did not match the expected dataset schema or records.");
      }
    } catch (err: any) {
      setError(`Execution error: ${err.message}`);
    } finally {
      dbUser.close();
      dbSol.close();
    }
  };

  const markLessonComplete = (lessonId: string) => {
    if (!completedLessons.includes(lessonId)) {
      const updated = [...completedLessons, lessonId];
      setCompletedLessons(updated);
      localStorage.setItem('sql_completed_lessons', JSON.stringify(updated));
      setLessonCompleted(true);
    }
  };

  // Evaluate the local multiple-choice quiz
  const handleQuizSubmit = () => {
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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Header bar */}
      <header className="border-b border-slate-800 bg-slate-900/50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-500/10 text-emerald-400 p-2 rounded-lg border border-emerald-500/20">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-wide">SQL Master Class</h1>
            <p className="text-xs text-slate-400">Lesson {lesson.order} of 10 • {lesson.module}</p>
          </div>
        </div>

        {/* Global Progress Indicators */}
        <div className="flex items-center gap-2">
          {SQL_LESSONS.map((l) => {
            const isCompleted = completedLessons.includes(l.id);
            const isActive = l.id === lesson.id;
            const isUnlocked = isSqlLessonUnlocked(l.id, completedLessons);

            return (
              <button
                key={l.id}
                onClick={() => isUnlocked && setCurrentLessonIndex(l.order - 1)}
                disabled={!isUnlocked}
                title={l.title}
                className={`w-8 h-8 rounded-md flex items-center justify-center text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-emerald-500 text-slate-950 ring-2 ring-emerald-400/50 shadow-lg shadow-emerald-500/20'
                    : isCompleted
                    ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                    : isUnlocked
                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                    : 'bg-slate-900/40 text-slate-600 border border-slate-800 cursor-not-allowed'
                }`}
              >
                {isCompleted ? <Check className="w-3.5 h-3.5" /> : l.order}
              </button>
            );
          })}
        </div>
      </header>

      {/* Workspace */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-2 overflow-hidden h-[calc(100vh-73px)]">
        
        {/* Left Interactive Documentation panel */}
        <div className="flex flex-col border-r border-slate-800 overflow-y-auto bg-slate-900/20">
          <div className="p-6 border-b border-slate-800/60 bg-slate-900/40">
            <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold mb-1">
              <span>{lesson.icon}</span>
              <span>{lesson.module}</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight mb-3">{lesson.title}</h2>
            <p className="text-sm text-slate-300/90 leading-relaxed font-light">{lesson.philosophy}</p>
          </div>

          {/* Navigation tabs */}
          <div className="flex border-b border-slate-800 bg-slate-900/30">
            <button
              onClick={() => setActiveTab('theory')}
              className={`flex-1 py-3 px-4 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-all ${
                activeTab === 'theory' 
                  ? 'border-emerald-500 text-emerald-400 bg-emerald-500/[0.02]' 
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              1. Theory
            </button>
            <button
              onClick={() => setActiveTab('practical')}
              className={`flex-1 py-3 px-4 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-all ${
                activeTab === 'practical' 
                  ? 'border-emerald-500 text-emerald-400 bg-emerald-500/[0.02]' 
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code className="w-4 h-4" />
              2. Lab Workout
            </button>
            <button
              onClick={() => setActiveTab('quiz')}
              className={`flex-1 py-3 px-4 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-all ${
                activeTab === 'quiz' 
                  ? 'border-emerald-500 text-emerald-400 bg-emerald-500/[0.02]' 
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              3. Checkpoint Quiz
            </button>
          </div>

          {/* Dynamic Tab Body */}
          <div className="p-6 flex-1">
            {activeTab === 'theory' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between bg-slate-900/60 p-1.5 rounded-lg border border-slate-800">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 pl-3">Conceptual Lens</span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setExplanationLevel('beginner')}
                      className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                        explanationLevel === 'beginner'
                          ? 'bg-emerald-500 text-slate-950 font-bold'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Beginner / Practical
                    </button>
                    <button
                      onClick={() => setExplanationLevel('advanced')}
                      className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                        explanationLevel === 'advanced'
                          ? 'bg-violet-600 text-white font-semibold shadow-md shadow-violet-600/30'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      Engineering / Deep Dive
                    </button>
                  </div>
                </div>

                <div className="space-y-6">
                  {lesson.concepts.map((concept, index) => (
                    <div 
                      key={index} 
                      className={`p-5 rounded-xl border transition-all duration-300 ${
                        explanationLevel === 'advanced' 
                          ? 'bg-violet-950/5 border-violet-500/20 hover:border-violet-500/40' 
                          : 'bg-slate-900/40 border-slate-800/80 hover:border-slate-700/80'
                      }`}
                    >
                      <h4 className={`text-md font-bold mb-2.5 flex items-center gap-2 ${
                        explanationLevel === 'advanced' ? 'text-violet-400' : 'text-emerald-400'
                      }`}>
                        {explanationLevel === 'advanced' && <Shield className="w-4 h-4" />}
                        {concept.title}
                      </h4>
                      <p className="text-sm text-slate-300 leading-relaxed font-light">
                        {explanationLevel === 'advanced' ? concept.advanced : concept.beginner}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="pt-4">
                  <button
                    onClick={() => setActiveTab('practical')}
                    className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/25 transition-all"
                  >
                    Proceed to Practice Lab
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'practical' && (
              <div className="space-y-6">
                <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-xl">
                  <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
                    Objective: {lesson.practical.title}
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed font-light">{lesson.practical.intro}</p>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">Structured Workout Tasks</h4>
                  <ul className="space-y-2.5">
                    {lesson.practical.steps.map((step, idx) => (
                      <li key={idx} className="flex gap-3 text-sm text-slate-300 font-light leading-relaxed">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-400">
                          {idx + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 bg-emerald-950/20 border border-emerald-500/20 rounded-lg">
                  <h4 className="text-xs font-bold uppercase text-emerald-400 tracking-widest mb-1.5">Database Target Output Goal</h4>
                  <p className="text-sm text-emerald-200 font-light">{lesson.practical.goal}</p>
                </div>
              </div>
            )}

            {activeTab === 'quiz' && (
              <div className="space-y-6">
                <div className="border-b border-slate-800 pb-4">
                  <h3 className="text-md font-bold text-slate-100">Knowledge Validation Gate</h3>
                  <p className="text-xs text-slate-400">Answer all analytical questions correctly to unlock the lesson verification badge.</p>
                </div>

                <div className="space-y-6">
                  {lesson.quiz.map((item, qIdx) => (
                    <div key={qIdx} className="space-y-3 p-4 bg-slate-900/30 border border-slate-800/80 rounded-xl">
                      <h4 className="text-sm font-semibold text-slate-200">{qIdx + 1}. {item.question}</h4>
                      <div className="grid grid-cols-1 gap-2">
                        {item.options.map((opt, oIdx) => {
                          const isSelected = selectedAnswers[qIdx] === oIdx;
                          const isCorrect = oIdx === item.correctIndex;
                          
                          let cardStyle = "bg-slate-900 hover:bg-slate-800 border-slate-800/60 text-slate-300";
                          if (isSelected) cardStyle = "bg-emerald-500/10 border-emerald-500 text-emerald-400";
                          
                          if (quizSubmitted) {
                            if (isCorrect) {
                              cardStyle = "bg-emerald-950/30 border-emerald-500 text-emerald-400 font-medium";
                            } else if (isSelected) {
                              cardStyle = "bg-rose-950/30 border-rose-500 text-rose-400";
                            } else {
                              cardStyle = "bg-slate-900/20 border-slate-900 opacity-50 text-slate-500";
                            }
                          }

                          return (
                            <button
                              key={oIdx}
                              disabled={quizSubmitted}
                              onClick={() => {
                                setSelectedAnswers(prev => ({ ...prev, [qIdx]: oIdx }));
                              }}
                              className={`p-3.5 text-left text-sm rounded-lg border transition-all duration-150 flex items-center justify-between ${cardStyle}`}
                            >
                              <span>{opt}</span>
                              {quizSubmitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 ml-2" />}
                            </button>
                          );
                        })}
                      </div>

                      {quizSubmitted && (
                        <div className={`mt-3 p-3.5 rounded-lg text-xs leading-relaxed border ${
                          selectedAnswers[qIdx] === item.correctIndex 
                            ? 'bg-emerald-950/10 border-emerald-500/10 text-emerald-300/90' 
                            : 'bg-rose-950/10 border-rose-500/10 text-rose-300/90'
                        }`}>
                          <strong className="block mb-1">{selectedAnswers[qIdx] === item.correctIndex ? "✓ Correct Match" : "✗ Incorrect"}</strong>
                          {item.explanation}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {!quizSubmitted ? (
                  <button
                    onClick={handleQuizSubmit}
                    disabled={Object.keys(selectedAnswers).length !== lesson.quiz.length}
                    className="w-full py-3 bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-bold rounded-lg flex items-center justify-center gap-2"
                  >
                    Validate Quiz Submissions
                  </button>
                ) : (
                  <div className="space-y-3">
                    {quizPassed ? (
                      <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl text-center">
                        <Award className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                        <h4 className="font-bold text-emerald-400">Conceptual Validation Success!</h4>
                        <p className="text-xs text-emerald-300 mt-1">You have proven a strong conceptual grasp of this lesson.</p>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setQuizSubmitted(false);
                          setSelectedAnswers({});
                        }}
                        className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold rounded-lg flex items-center justify-center gap-2"
                      >
                        <RefreshCw className="w-4 h-4" />
                        Try Again
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Sandbox & Code Editor Panel */}
        <div className="flex flex-col bg-slate-950 overflow-hidden">
          {/* Header Actions */}
          <div className="px-6 py-3 bg-slate-900/40 border-b border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-400 text-xs">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span>INTERACTIVE SQL PLAYGROUND</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setUserQuery(lesson.practical.starterQuery)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded text-slate-300 flex items-center gap-1.5 transition-all"
                title="Reset code template"
              >
                <RefreshCw className="w-3 h-3" />
                Reset
              </button>
              <button
                onClick={handleRunQuery}
                disabled={dbLoading}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded text-emerald-400 flex items-center gap-1.5 transition-all border border-emerald-500/20"
              >
                <Play className="w-3 h-3" />
                Run Code
              </button>
              <button
                onClick={handleVerifySolution}
                disabled={dbLoading}
                className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-xs font-bold rounded text-slate-950 flex items-center gap-1.5 shadow-md shadow-emerald-500/10 transition-all"
              >
                <Check className="w-3.5 h-3.5" />
                Validate Lab
              </button>
            </div>
          </div>

          {/* Interactive Shell Input */}
          <div className="flex-1 min-h-[220px] flex flex-col relative border-b border-slate-800/80">
            {dbLoading && (
              <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-30 flex flex-col items-center justify-center gap-3">
                <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin" />
                <p className="text-xs text-slate-400 font-mono">Spawning WASM engine page frames...</p>
              </div>
            )}
            <textarea
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              className="w-full flex-1 p-5 bg-slate-950 text-slate-200 font-mono text-sm leading-relaxed focus:outline-none resize-none focus:ring-1 focus:ring-emerald-500/50"
              placeholder="-- Write SQL query adjustments here..."
              spellCheck={false}
            />
          </div>

          {/* Tabular Output Display Grid */}
          <div className="h-[40%] min-h-[180px] flex flex-col bg-slate-900/10">
            <div className="px-5 py-2.5 bg-slate-900/30 border-b border-slate-800 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Database Engine Outputs</span>
              {lessonCompleted && (
                <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  Lesson Completed
                </div>
              )}
            </div>

            <div className="flex-1 overflow-auto p-5 font-mono text-xs">
              {error && (
                <div className="p-4 bg-rose-950/30 border border-rose-500/20 text-rose-400 rounded-lg flex gap-2.5 items-start">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-rose-200 mb-0.5">Execution Exception</strong>
                    <p className="font-mono text-xs leading-relaxed">{error}</p>
                  </div>
                </div>
              )}

              {executionMessage && !error && (
                <div className="p-4 bg-emerald-950/30 border border-emerald-500/20 text-emerald-300 rounded-lg mb-4 flex gap-2.5 items-start">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-emerald-200 mb-0.5">Success Log</strong>
                    <p className="font-mono text-xs leading-relaxed">{executionMessage}</p>
                  </div>
                </div>
              )}

              {queryResult ? (
                <div className="border border-slate-800 rounded-lg overflow-hidden max-w-full">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-900 border-b border-slate-800 text-slate-300">
                          {queryResult.columns.map((col, idx) => (
                            <th key={idx} className="p-2.5 text-xs font-bold border-r border-slate-800/80 last:border-r-0">
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {queryResult.values.map((row, rIdx) => (
                          <tr key={rIdx} className="hover:bg-slate-900/40 border-b border-slate-800/50 last:border-0 text-slate-300">
                            {row.map((val, cIdx) => (
                              <td key={cIdx} className="p-2.5 border-r border-slate-800/40 last:border-r-0">
                                {val === null ? <span className="text-amber-500/80 italic text-xs">NULL</span> : String(val)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                !error && !executionMessage && (
                  <div className="h-full flex flex-col items-center justify-center text-slate-500 font-mono gap-1.5 py-6">
                    <Database className="w-8 h-8 opacity-40" />
                    <p className="text-xs">No execution context output logs recorded yet.</p>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Floating Footer Controls */}
      <footer className="px-6 py-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
        <button
          disabled={currentLessonIndex === 0}
          onClick={() => setCurrentLessonIndex(prev => prev - 1)}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1 text-sm transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous Lesson
        </button>

        <div className="text-xs text-slate-400">
          Progression Bar: {completedLessons.length} / 10 Badges Secured
        </div>

        {currentLessonIndex < SQL_LESSONS.length - 1 ? (
          <button
            disabled={!isSqlLessonUnlocked(SQL_LESSONS[currentLessonIndex + 1].id, completedLessons)}
            onClick={() => setCurrentLessonIndex(prev => prev + 1)}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1 text-sm transition-all border border-slate-700/60"
          >
            Next Lesson
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          completedLessons.length === 10 && (
            <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500 text-emerald-400 rounded-lg text-sm font-bold flex items-center gap-2 animate-bounce">
              <Award className="w-4 h-4" />
              SQL Expert Certification Earned!
            </div>
          )
        )}
      </footer>
    </div>
  );
}
