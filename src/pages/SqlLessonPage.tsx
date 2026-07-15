import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, Check, AlertTriangle, Database, RefreshCw, CheckCircle2, ChevronLeft, ArrowRight, BookOpen } from 'lucide-react';
import { sqlLessons } from '../data/sqlLessons'; // Double check this path matches your file structure

interface PracticalProps {
  practical: {
    title: string;
    intro: string;
    steps: string[];
    goal: string;
    starterQuery: string;
    solutionQuery: string;
    seedSql: string;
  };
}

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

function SqlWorkspace({ practical }: PracticalProps) {
  const [userQuery, setUserQuery] = useState<string>('');
  const [dbLoading, setDbLoading] = useState<boolean>(true);
  const [queryResult, setQueryResult] = useState<{ columns: string[]; values: any[][] } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [executionMessage, setExecutionMessage] = useState<string | null>(null);
  const [isValidated, setIsValidated] = useState<boolean>(false);

  const SQLRef = useRef<any>(null);

  // Sync state whenever the lesson/practical changes
  useEffect(() => {
    setUserQuery(practical.starterQuery);
    setQueryResult(null);
    setError(null);
    setExecutionMessage(null);
    setIsValidated(false);
  }, [practical]);

  // Load the WASM SQL engine once
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
        setError("Database sandbox environment could not be initialized. Check network connection.");
        setDbLoading(false);
      });
  }, []);

  const createSeededDatabase = () => {
    if (!SQLRef.current) return null;
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
        setQueryResult({
          columns: res[0].columns,
          values: res[0].values
        });
        setExecutionMessage(`Execution successful: Query returned ${res[0].values.length} records.`);
      } else {
        setQueryResult(null);
        setExecutionMessage("Command processed successfully. No rows returned.");
      }
    } catch (err: any) {
      setError(err.message || "Syntactical database failure.");
    } finally {
      db.close();
    }
  };

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

      if (practical.starterQuery.toLowerCase().includes('create table')) {
        try {
          dbUser.run(userQuery);
          dbSol.run(practical.solutionQuery);

          const tablesUser = dbUser.exec("SELECT sql FROM sqlite_master WHERE type='table';");
          const tablesSol = dbSol.exec("SELECT sql FROM sqlite_master WHERE type='table';");

          const cleanStr = (s: string) => s.replace(/\s+/g, ' ').trim().toLowerCase();
          userPassed = cleanStr(JSON.stringify(tablesUser)) === cleanStr(JSON.stringify(tablesSol));
        } catch {
          userPassed = false;
        }
      } else {
        const userRes = dbUser.exec(userQuery);
        const solRes = dbSol.exec(practical.solutionQuery);

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
        setIsValidated(true);
      } else {
        setError("Result mismatch. Your output did not match the expected dataset schema or records.");
        setIsValidated(false);
      }
    } catch (err: any) {
      setError(`Execution error: ${err.message}`);
      setIsValidated(false);
    } finally {
      dbUser.close();
      dbSol.close();
    }
  };

  return (
    <div className="space-y-4">
      <div className="glass-card rounded-2xl p-4 space-y-3">
        <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Exercise Tasks</p>
        <ul className="space-y-2">
          {practical.steps.map((step, idx) => (
            <li key={idx} className="flex gap-2.5 text-xs text-muted-foreground leading-relaxed">
              <span className="flex-shrink-0 w-4 h-4 rounded-full bg-secondary flex items-center justify-center text-[10px] font-bold text-foreground">
                {idx + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ul>
        <div className="pt-2 border-t border-border/30">
          <p className="text-[10px] font-mono text-amber-400 uppercase tracking-wider mb-1">Target Goal</p>
          <p className="text-xs text-foreground font-medium">{practical.goal}</p>
        </div>
      </div>

      <div className="glass-card rounded-2xl border border-border/30 overflow-hidden flex flex-col min-h-[320px] relative">
        {dbLoading && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-30 flex flex-col items-center justify-center gap-3">
            <RefreshCw className="w-6 h-6 text-primary animate-spin" />
            <p className="text-xs text-muted-foreground font-mono">Spawning WASM engine page frames...</p>
          </div>
        )}

        <div className="px-4 py-2 bg-muted/30 border-b border-border/30 flex items-center justify-between">
          <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">SQL QUERY CONSOLE</span>
          <div className="flex gap-1.5">
            <button
              onClick={() => setUserQuery(practical.starterQuery)}
              className="p-1 hover:bg-secondary rounded text-muted-foreground hover:text-foreground transition-all"
              title="Reset query"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleRunQuery}
              disabled={dbLoading}
              className="px-2.5 py-1 bg-secondary hover:bg-primary/20 text-[10px] font-bold rounded text-primary flex items-center gap-1 transition-all"
            >
              <Play className="w-3 h-3" /> Run
            </button>
            <button
              onClick={handleVerifySolution}
              disabled={dbLoading}
              className="px-2.5 py-1 bg-primary text-primary-foreground text-[10px] font-bold rounded flex items-center gap-1 hover:opacity-90 transition-all"
            >
              <Check className="w-3 h-3" /> Validate
            </button>
          </div>
        </div>

        <textarea
          value={userQuery}
          onChange={(e) => setUserQuery(e.target.value)}
          className="w-full flex-1 p-4 bg-transparent text-foreground font-mono text-xs leading-relaxed focus:outline-none resize-none"
          placeholder="-- Write your database queries here..."
          spellCheck={false}
        />
      </div>

      <div className="glass-card rounded-2xl border border-border/30 overflow-hidden">
        <div className="px-4 py-2 bg-muted/30 border-b border-border/30">
          <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Engine Outputs</p>
        </div>
        <div className="p-4 font-mono text-[11px] min-h-[120px]">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-300 rounded-xl flex gap-2 items-start">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="block text-red-200 text-xs mb-0.5">Execution Error</strong>
                <p>{error}</p>
              </div>
            </div>
          )}

          {executionMessage && !error && (
            <div className={`p-3 border rounded-xl flex gap-2 items-start ${
              isValidated 
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' 
                : 'bg-muted/30 border-border/30 text-muted-foreground'
            }`}>
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div>
                <strong className={`block text-xs mb-0.5 ${isValidated ? 'text-emerald-200' : 'text-foreground'}`}>
                  {isValidated ? 'Task Verified!' : 'Execution Log'}
                </strong>
                <p>{executionMessage}</p>
              </div>
            </div>
          )}

          {queryResult ? (
            <div className="border border-border/30 rounded-xl overflow-hidden mt-3 max-w-full">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-muted/40 border-b border-border/30 text-muted-foreground">
                      {queryResult.columns.map((col, idx) => (
                        <th key={idx} className="p-2 border-r border-border/20 last:border-r-0 font-bold">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {queryResult.values.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-muted/20 border-b border-border/10 last:border-0 text-foreground">
                        {row.map((val, cIdx) => (
                          <td key={cIdx} className="p-2 border-r border-border/10 last:border-r-0">
                            {val === null ? <span className="text-amber-500 italic">NULL</span> : String(val)}
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
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground gap-1.5 py-6">
                <Database className="w-6 h-6 opacity-30" />
                <p className="text-[10px]">No logs recorded yet. Write some SQL and hit run!</p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default function SqlLessonPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Find current lesson index from data configuration
  const currentIdx = sqlLessons.findIndex((l) => l.id === id);
  const lesson = sqlLessons[currentIdx];

  if (!lesson) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center space-y-4">
        <AlertTriangle className="w-12 h-12 text-destructive mx-auto" />
        <h2 className="text-lg font-bold">Lesson Not Found</h2>
        <p className="text-sm text-muted-foreground">The requested SQL lesson module could not be traced.</p>
        <button onClick={() => navigate('/sql')} className="text-xs text-primary underline">
          Return to SQL Directory
        </button>
      </div>
    );
  }

  const handleNext = () => {
    if (currentIdx < sqlLessons.length - 1) {
      navigate(`/sql/${sqlLessons[currentIdx + 1].id}`);
    }
  };

  const handleBack = () => {
    navigate('/sql');
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-12">
      {/* Navigation Header bar */}
      <div className="border-b border-border/40 bg-background/50 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <button onClick={handleBack} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-all">
            <ChevronLeft className="w-4 h-4" /> Back to Dashboard
          </button>
          <div className="flex items-center gap-2 text-xs font-medium">
            <BookOpen className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground">SQL Track:</span>
            <span>{lesson.title}</span>
          </div>
          <button 
            onClick={handleNext}
            disabled={currentIdx === sqlLessons.length - 1}
            className="flex items-center gap-1 px-3 py-1.5 bg-secondary hover:bg-secondary/80 disabled:opacity-40 rounded-xl text-xs font-semibold transition-all"
          >
            Next <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Primary Layout Grid split view */}
      <div className="max-w-7xl mx-auto px-4 mt-6 grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left Side: Lesson Documentation details */}
        <div className="lg:col-span-2 space-y-4">
          <div className="glass-card rounded-2xl p-6 space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-primary uppercase tracking-wider font-bold">
                Module {currentIdx + 1} of {sqlLessons.length}
              </span>
              <h1 className="text-xl font-extrabold tracking-tight">{lesson.title}</h1>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {lesson.practical.intro || "Learn how to structure database queries via this step-by-step technical workbook."}
            </p>
          </div>
        </div>

        {/* Right Side: Execution sandbox playground environment */}
        <div className="lg:col-span-3">
          <SqlWorkspace practical={lesson.practical} />
        </div>
      </div>
    </div>
  );
}
