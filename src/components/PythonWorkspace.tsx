import { useEffect, useRef, useState } from 'react';
import { Play, RotateCcw, Trash2, FlaskConical, Terminal, Loader2, AlertTriangle } from 'lucide-react';
import CodeEditor from './CodeEditor';

declare global {
  interface Window {
    Sk: any;
  }
}

interface PythonWorkspaceProps {
  starterCode?: string;
  initialCode?: string;
  onCodeChange?: (code: string) => void;
  embedded?: boolean;
  requiresLocalTerminal?: boolean; // <-- NEW: Locks the browser terminal for advanced lessons
  practical?: {
    title: string;
    intro: string;
    steps: string[];
    goal: string;
  };
}

const SKULPT_MAIN = 'https://cdn.jsdelivr.net/npm/skulpt@1.2.0/dist/skulpt.min.js';
const SKULPT_STDLIB = 'https://cdn.jsdelivr.net/npm/skulpt@1.2.0/dist/skulpt-stdlib.js';

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[data-src="${src}"]`) as HTMLScriptElement | null;
    if (existing) {
      if (existing.dataset.loaded === 'true') return resolve();
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error('load fail')));
      return;
    }
    const s = document.createElement('script');
    s.src = src;
    s.async = true;
    s.dataset.src = src;
    s.onload = () => { s.dataset.loaded = 'true'; resolve(); };
    s.onerror = () => reject(new Error('load fail'));
    document.head.appendChild(s);
  });
}

function useSkulpt(enabled: boolean) {
  const [ready, setReady] = useState<boolean>(typeof window !== 'undefined' && !!window.Sk);
  useEffect(() => {
    if (ready || !enabled) return;
    let cancelled = false;
    (async () => {
      try {
        await loadScript(SKULPT_MAIN);
        await loadScript(SKULPT_STDLIB);
        if (!cancelled) setReady(true);
      } catch {
        /* handled by UI */
      }
    })();
    return () => { cancelled = true; };
  }, [ready, enabled]);
  return ready;
}

type Line = { kind: 'out' | 'err' | 'in' | 'sys'; text: string };

const DEFAULT_STARTER = `# Write your Python code here\nname = input("What's your name? ")\nprint("Hello,", name, "— welcome to Python!")\n`;

const PythonWorkspace = ({ starterCode, initialCode, onCodeChange, embedded = false, requiresLocalTerminal = false, practical }: PythonWorkspaceProps) => {
  const initial = initialCode ?? starterCode ?? DEFAULT_STARTER;
  const [code, setCode] = useState(initial);
  const [lines, setLines] = useState<Line[]>([
    requiresLocalTerminal 
      ? { kind: 'sys', text: '$ This practical requires external libraries (FastAPI, Pydantic, SQLAlchemy, etc.). Please run this code in your local CMD/Terminal using the steps provided in the Lab.' }
      : { kind: 'sys', text: '$ Python 3 (Skulpt in-browser runtime) — press ▶ Run Code to start.' }
  ]);
  const [running, setRunning] = useState(false);
  const [showTerminal, setShowTerminal] = useState(true);
  const [pendingInput, setPendingInput] = useState<{ resolve: (v: string) => void } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const termRef = useRef<HTMLDivElement>(null);
  const [wantLoad] = useState<boolean>(!requiresLocalTerminal); // Don't even load Skulpt if we don't need it
  const ready = useSkulpt(wantLoad);

  useEffect(() => {
    if (onCodeChange) onCodeChange(code);
  }, [code, onCodeChange]);

  useEffect(() => {
    if (embedded && initialCode !== undefined) {
      setCode(initialCode);
      setLines([
        requiresLocalTerminal
          ? { kind: 'sys', text: '$ This practical requires external libraries. Please run this code in your local CMD/Terminal.' }
          : { kind: 'sys', text: '$ Python 3 — Ready.' }
      ]);
      setRunning(false);
      setPendingInput(null);
    }
  }, [initialCode, embedded, requiresLocalTerminal]);

  useEffect(() => {
    if (termRef.current) termRef.current.scrollTop = termRef.current.scrollHeight;
  }, [lines, pendingInput]);

  useEffect(() => {
    if (pendingInput && inputRef.current) inputRef.current.focus();
  }, [pendingInput]);

  useEffect(() => {
    return () => {
      if (pendingInput) pendingInput.resolve('');
    };
  }, [pendingInput]);

  const write = (kind: Line['kind'], text: string) => {
    setLines(prev => {
      if (kind === 'out' && prev.length && prev[prev.length - 1].kind === 'out' && !prev[prev.length - 1].text.endsWith('\n')) {
        const copy = prev.slice();
        copy[copy.length - 1] = { kind: 'out', text: copy[copy.length - 1].text + text };
        return copy;
      }
      return [...prev, { kind, text }];
    });
  };

  const promptInput = (): Promise<string> => {
    if (!embedded) setShowTerminal(true);
    return new Promise<string>((resolve) => {
      setPendingInput({
        resolve: (v: string) => {
          setLines((prev) => {
            if (prev.length > 0 && prev[prev.length - 1].kind === 'out') {
              const copy = [...prev];
              const last = copy[copy.length - 1];
              copy[copy.length - 1] = { ...last, text: last.text + v + '\n' };
              return copy;
            }
            return [...prev, { kind: 'in', text: v + '\n' }];
          });
          setPendingInput(null);
          resolve(v);
        },
      });
    });
  };

  const runCode = async () => {
    if (!ready || running || requiresLocalTerminal) return;
    if (!embedded) setShowTerminal(true);
    setRunning(true);
    write('sys', '$ python main.py');
    try {
      const Sk = window.Sk;
      Sk.configure({
        output: (t: string) => write('out', t),
        read: (x: string) => {
          if (Sk.builtinFiles === undefined || Sk.builtinFiles.files[x] === undefined) {
            throw new Error("File not found: '" + x + "'");
          }
          return Sk.builtinFiles.files[x];
        },
        inputfun: promptInput,
        inputfunTakesPrompt: false,
        __future__: Sk.python3,
      });
      await Sk.misceval.asyncToPromise(() => Sk.importMainWithBody('<stdin>', false, code, true));
      write('sys', '$ exit 0');
    } catch (err: any) {
      const msg = err?.toString?.() ?? String(err);
      write('err', msg);
    } finally {
      setRunning(false);
      setPendingInput(null);
    }
  };

  const handleCodeChange = (newCode: string) => setCode(newCode);
  const resetCode = () => setCode(initial);
  const clearConsole = () => setLines([{ kind: 'sys', text: '$ console cleared' }]);

  return (
    <div className={`flex flex-col h-full w-full overflow-hidden ${embedded ? 'bg-background' : 'glass-card border border-primary/20 rounded-2xl'}`}>
      
      {/* Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 bg-secondary/40 border-b border-border/30 shrink-0">
        <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-primary">
          <FlaskConical className="w-3 h-3" /> {embedded ? 'Python Terminal' : 'Python Lab'}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowTerminal(!showTerminal)}
            className={`flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-lg transition-colors ${
              showTerminal ? 'bg-primary/20 text-primary' : 'bg-secondary/60 text-muted-foreground hover:bg-secondary'
            }`}
          >
            <Terminal className="w-3 h-3" /> Terminal
          </button>
          
          {requiresLocalTerminal ? (
            <div className="flex items-center gap-1 bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[11px] font-semibold px-2.5 py-1 rounded-lg" title="This practical requires external libraries. Run in your local CMD.">
              <AlertTriangle className="w-3 h-3" /> Local CMD Required
            </div>
          ) : (
            <button
              onClick={runCode}
              disabled={!ready || running}
              className="flex items-center gap-1 bg-primary text-primary-foreground text-[11px] font-semibold px-2.5 py-1 rounded-lg neon-glow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {running ? <Loader2 className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
              {ready ? (running ? 'Running…' : 'Run Code') : 'Loading…'}
            </button>
          )}

          <button onClick={resetCode} title="Reset editor" className="p-1.5 rounded-lg bg-secondary/60 hover:bg-secondary text-muted-foreground hover:text-foreground">
            <RotateCcw className="w-3 h-3" />
          </button>
          <button onClick={clearConsole} title="Clear console" className="p-1.5 rounded-lg bg-secondary/60 hover:bg-secondary text-muted-foreground hover:text-foreground">
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Split Workspace: Editor (Top 50%) & Terminal (Bottom 50%) */}
      <div className="flex-1 flex flex-col min-h-0">
        
        {/* Code Editor - Takes exactly 50% of available space, scrolls internally */}
        <div className="flex-1 min-h-0 border-b border-border/30 flex flex-col">
          <CodeEditor code={code} onChange={handleCodeChange} language="python" showShortcuts={false} />
        </div>

        {/* Terminal Panel - Takes exactly 50% of available space, scrolls internally */}
        {showTerminal && (
          <div
            ref={termRef}
            className="flex-1 min-h-0 bg-zinc-950 text-emerald-300 font-mono text-[11px] leading-relaxed p-3 overflow-y-auto"
            onClick={() => inputRef.current?.focus()}
          >
            {lines.map((l, i) => {
              const isLastLine = i === lines.length - 1;
              const isWaitingInputOnThisLine = pendingInput && isLastLine && l.kind === 'out';

              if (isWaitingInputOnThisLine) {
                return (
                  <div key={i} className="flex items-center flex-wrap gap-1 my-0.5">
                    <span className="text-emerald-300 whitespace-pre-wrap">{l.text}</span>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        const val = inputRef.current?.value ?? '';
                        if (inputRef.current) inputRef.current.value = '';
                        pendingInput.resolve(val);
                      }}
                      className="inline-flex flex-1 min-w-[120px]"
                    >
                      <input
                        ref={inputRef}
                        autoFocus
                        className="flex-1 bg-transparent outline-none border-none text-sky-300 font-mono text-[11px] caret-emerald-300 p-0 m-0"
                      />
                    </form>
                  </div>
                );
              }

              return (
                <div
                  key={i}
                  className={`whitespace-pre-wrap break-words ${
                    l.kind === 'err' ? 'text-red-400' :
                    l.kind === 'sys' ? 'text-zinc-500' :
                    l.kind === 'in'  ? 'text-sky-300' : 'text-emerald-300'
                  }`}
                >
                  {l.text}
                </div>
              );
            })}

            {pendingInput && (lines.length === 0 || lines[lines.length - 1].kind !== 'out') && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const val = inputRef.current?.value ?? '';
                  if (inputRef.current) inputRef.current.value = '';
                  pendingInput.resolve(val);
                }}
                className="flex items-center gap-1 my-0.5"
              >
                <input
                  ref={inputRef}
                  autoFocus
                  className="flex-1 bg-transparent outline-none border-none text-sky-300 font-mono text-[11px] caret-emerald-300 p-0 m-0"
                />
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PythonWorkspace;
