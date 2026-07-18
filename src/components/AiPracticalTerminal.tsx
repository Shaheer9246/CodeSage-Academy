import { useEffect, useRef, useState } from 'react';
import CodeEditor from './CodeEditor';
import { Play, RotateCcw, Eye, EyeOff, Terminal, Trash2 } from 'lucide-react';

interface LogLine {
  type: 'log' | 'error' | 'info' | 'result';
  text: string;
}

interface Props {
  starterCode: string;
  solutionCode: string;
  /** unique per-lesson id — used to persist draft */
  lessonId: string;
}

const format = (v: unknown): string => {
  if (v instanceof Error) return `${v.name}: ${v.message}`;
  if (typeof v === 'string') return v;
  if (typeof v === 'function') return v.toString();
  try {
    return JSON.stringify(v, (_k, val) => (typeof val === 'bigint' ? val.toString() + 'n' : val), 2);
  } catch {
    return String(v);
  }
};

const AiPracticalTerminal = ({ starterCode, solutionCode, lessonId }: Props) => {
  const storageKey = `ai-practical-draft:${lessonId}`;
  const [code, setCode] = useState<string>(() => {
    if (typeof window === 'undefined') return starterCode;
    return window.localStorage.getItem(storageKey) ?? starterCode;
  });
  const [logs, setLogs] = useState<LogLine[]>([]);
  const [running, setRunning] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const consoleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try { window.localStorage.setItem(storageKey, code); } catch { /* ignore */ }
  }, [code, storageKey]);

  useEffect(() => {
    consoleRef.current?.scrollTo({ top: consoleRef.current.scrollHeight, behavior: 'smooth' });
  }, [logs]);

  const run = () => {
    setRunning(true);
    const collected: LogLine[] = [];
    const push = (type: LogLine['type'], args: unknown[]) =>
      collected.push({ type, text: args.map(format).join(' ') });

    const fakeConsole = {
      log:   (...a: unknown[]) => push('log', a),
      info:  (...a: unknown[]) => push('info', a),
      warn:  (...a: unknown[]) => push('log', a),
      error: (...a: unknown[]) => push('error', a),
    };

    try {
      // eslint-disable-next-line @typescript-eslint/no-implied-eval
      const fn = new Function('console', `"use strict";\n${code}\n;return (typeof __result !== 'undefined' ? __result : undefined);`);
      const start = performance.now();
      const result = fn(fakeConsole);
      const ms = (performance.now() - start).toFixed(1);
      if (result !== undefined) push('result', [`⇢ ${format(result)}`]);
      collected.push({ type: 'info', text: `✓ executed in ${ms}ms` });
    } catch (err) {
      push('error', [err]);
    }

    setLogs(prev => [...prev, ...collected]);
    setRunning(false);
  };

  const reset = () => {
    setCode(starterCode);
    setLogs([]);
  };

  const clear = () => setLogs([]);

  return (
    <div className="space-y-3">
      {/* Editor */}
      <div className="glass-card rounded-2xl overflow-hidden border border-primary/20">
        <div className="flex items-center justify-between px-3 py-2 bg-secondary/40 border-b border-border/30">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
            </div>
            <span className="text-[10px] font-mono text-muted-foreground ml-1">practical.js</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setShowSolution(s => !s)}
              className="text-[10px] font-mono text-muted-foreground hover:text-foreground flex items-center gap-1 px-2 py-1 rounded-md hover:bg-secondary/60"
              title={showSolution ? 'Hide solution' : 'Reveal solution'}
            >
              {showSolution ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
              {showSolution ? 'Hide' : 'Solution'}
            </button>
            <button
              onClick={reset}
              className="text-[10px] font-mono text-muted-foreground hover:text-foreground flex items-center gap-1 px-2 py-1 rounded-md hover:bg-secondary/60"
              title="Reset code"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>
        </div>
        <div className="h-64">
          <CodeEditor
            code={code}
            onChange={setCode}
            language="javascript"
            theme="vs-dark"
            fontSize={13}
            showShortcuts={false}
          />
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-secondary/30 border-t border-border/30">
          <button
            onClick={run}
            disabled={running}
            className="flex-1 bg-primary text-primary-foreground text-xs font-display font-semibold py-2 rounded-lg neon-glow hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5" />
            {running ? 'Running…' : 'Run Code'}
          </button>
        </div>
      </div>

      {/* Solution */}
      {showSolution && (
        <div className="glass-card rounded-2xl p-3 border border-emerald-500/20 bg-emerald-500/5">
          <p className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider mb-2">Reference Solution</p>
          <pre className="text-[11px] font-mono text-foreground/90 overflow-x-auto whitespace-pre bg-background/40 p-3 rounded-lg border border-border/30">
{solutionCode}
          </pre>
        </div>
      )}

      {/* Terminal */}
      <div className="glass-card rounded-2xl overflow-hidden border border-border/30">
        <div className="flex items-center justify-between px-3 py-2 bg-background/60 border-b border-border/30">
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
            <Terminal className="w-3 h-3 text-primary" /> Console Output
          </div>
          <button
            onClick={clear}
            disabled={logs.length === 0}
            className="text-[10px] font-mono text-muted-foreground hover:text-foreground flex items-center gap-1 px-2 py-1 rounded-md hover:bg-secondary/60 disabled:opacity-40"
          >
            <Trash2 className="w-3 h-3" /> Clear
          </button>
        </div>
        <div ref={consoleRef} className="h-40 overflow-y-auto p-3 font-mono text-[11px] bg-[#0a0a0f]">
          {logs.length === 0 ? (
            <p className="text-muted-foreground/60 italic">
              <span className="text-primary">$</span> Run the code to see output…
            </p>
          ) : (
            logs.map((l, i) => {
              const color =
                l.type === 'error'  ? 'text-red-400' :
                l.type === 'info'   ? 'text-muted-foreground' :
                l.type === 'result' ? 'text-emerald-400' :
                                      'text-foreground/90';
              return (
                <div key={i} className={`${color} whitespace-pre-wrap break-words leading-relaxed`}>
                  <span className="text-primary/60 select-none mr-2">›</span>{l.text}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default AiPracticalTerminal;
