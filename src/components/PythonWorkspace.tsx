import { useEffect, useRef, useState } from 'react';
import { Play, RotateCcw, Trash2, FlaskConical, Terminal, Lightbulb, Loader2 } from 'lucide-react';
import CodeEditor from './CodeEditor';

declare global {
  interface Window {
    Sk: any;
  }
}

interface PythonWorkspaceProps {
  starterCode?: string;
  practical: {
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

const PythonWorkspace = ({ starterCode, practical }: PythonWorkspaceProps) => {
  const initial = starterCode ?? DEFAULT_STARTER;
  const [code, setCode] = useState(initial);
  const [lines, setLines] = useState<Line[]>([{ kind: 'sys', text: '$ Python 3 (Skulpt in-browser runtime) — press ▶ Run Code to start.' }]);
  const [running, setRunning] = useState(false);
  const [tab, setTab] = useState<'assign' | 'term'>('assign');
  const [pendingInput, setPendingInput] = useState<{ prompt: string; resolve: (v: string) => void } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const termRef = useRef<HTMLDivElement>(null);
  const [wantLoad, setWantLoad] = useState<boolean>(typeof window !== 'undefined' && !!window.Sk);
  const ready = useSkulpt(wantLoad);

  useEffect(() => {
    if (termRef.current) termRef.current.scrollTop = termRef.current.scrollHeight;
  }, [lines, pendingInput]);

  useEffect(() => {
    if (pendingInput && inputRef.current) inputRef.current.focus();
  }, [pendingInput]);

  const write = (kind: Line['kind'], text: string) => {
    setLines(prev => {
      // merge stdout chunks without newlines onto the previous line
      if (kind === 'out' && prev.length && prev[prev.length - 1].kind === 'out' && !prev[prev.length - 1].text.endsWith('\n')) {
        const copy = prev.slice();
        copy[copy.length - 1] = { kind: 'out', text: copy[copy.length - 1].text + text };
        return copy;
      }
      return [...prev, { kind, text }];
    });
  };

  const promptInput = (promptText: string): Promise<string> => {
    setTab('term');
    return new Promise<string>((resolve) => {
      setPendingInput({
        prompt: promptText || '',
        resolve: (v: string) => {
          write('in', `${promptText || ''}${v}`);
          setPendingInput(null);
          resolve(v);
        },
      });
    });
  };

  const runCode = async () => {
    if (!ready || running) return;
    setTab('term');
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
        inputfunTakesPrompt: true,
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

  const resetCode = () => setCode(initial);
  const clearConsole = () => setLines([{ kind: 'sys', text: '$ console cleared' }]);

  return (
    <div className="glass-card rounded-2xl overflow-hidden border border-primary/20">
      <div className="flex items-center justify-between px-3 py-2 bg-secondary/40 border-b border-border/30">
        <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-primary">
          <FlaskConical className="w-3 h-3" /> Python Lab
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={runCode}
            disabled={!ready || running}
            className="flex items-center gap-1 bg-primary text-primary-foreground text-[11px] font-semibold px-2.5 py-1 rounded-lg neon-glow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {running ? <Loader2 className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
            {ready ? (running ? 'Running…' : 'Run Code') : 'Loading…'}
          </button>
          <button onClick={resetCode} title="Reset editor" className="p-1.5 rounded-lg bg-secondary/60 hover:bg-secondary text-muted-foreground hover:text-foreground">
            <RotateCcw className="w-3 h-3" />
          </button>
          <button onClick={clearConsole} title="Clear console" className="p-1.5 rounded-lg bg-secondary/60 hover:bg-secondary text-muted-foreground hover:text-foreground">
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="h-[260px] md:h-[320px] border-b border-border/30">
        <CodeEditor code={code} onChange={setCode} language="python" showShortcuts={false} />
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border/30 bg-secondary/20">
        <button
          onClick={() => setTab('assign')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-[11px] font-semibold transition-all border-b-2 ${
            tab === 'assign' ? 'text-primary border-primary bg-primary/5' : 'text-muted-foreground border-transparent'
          }`}
        >
          <FlaskConical className="w-3 h-3" /> Assignment
        </button>
        <button
          onClick={() => setTab('term')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-[11px] font-semibold transition-all border-b-2 ${
            tab === 'term' ? 'text-primary border-primary bg-primary/5' : 'text-muted-foreground border-transparent'
          }`}
        >
          <Terminal className="w-3 h-3" /> Terminal
          {pendingInput && <span className="ml-1 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
        </button>
      </div>

      {/* Panels */}
      {tab === 'assign' ? (
        <div className="p-4 space-y-3 max-h-[300px] overflow-y-auto">
          <div>
            <p className="text-[10px] font-mono text-amber-400 uppercase tracking-wider mb-1">Goal</p>
            <p className="text-xs text-foreground font-semibold">{practical.title}</p>
            <p className="text-[11px] text-muted-foreground mt-1">{practical.intro}</p>
          </div>
          <ol className="space-y-2">
            {practical.steps.map((step, i) => (
              <li key={i} className="flex gap-2">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center text-[9px] font-bold text-primary font-mono">{i + 1}</span>
                <p
                  className="text-[11px] text-foreground leading-relaxed pt-0.5"
                  dangerouslySetInnerHTML={{
                    __html: step.replace(/`([^`]+)`/g, '<code class="bg-secondary/60 text-primary px-1 py-0.5 rounded text-[10px] font-mono">$1</code>'),
                  }}
                />
              </li>
            ))}
          </ol>
          <div className="rounded-lg p-2.5 border border-primary/20 bg-primary/5 flex gap-2">
            <Lightbulb className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-foreground">{practical.goal}</p>
          </div>
        </div>
      ) : (
        <div
          ref={termRef}
          className="bg-zinc-950 text-emerald-300 font-mono text-[11px] leading-relaxed p-3 max-h-[300px] min-h-[180px] overflow-y-auto"
          onClick={() => inputRef.current?.focus()}
        >
          {lines.map((l, i) => (
            <pre
              key={i}
              className={`whitespace-pre-wrap break-words ${
                l.kind === 'err' ? 'text-red-400' :
                l.kind === 'sys' ? 'text-zinc-500' :
                l.kind === 'in'  ? 'text-sky-300' : 'text-emerald-300'
              }`}
            >{l.text}</pre>
          ))}
          {pendingInput && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const val = inputRef.current?.value ?? '';
                if (inputRef.current) inputRef.current.value = '';
                pendingInput.resolve(val);
              }}
              className="flex items-center gap-1 mt-1"
            >
              <span className="text-amber-300">{pendingInput.prompt}</span>
              <input
                ref={inputRef}
                autoFocus
                className="flex-1 bg-transparent outline-none border-none text-emerald-200 font-mono text-[11px] caret-emerald-300"
              />
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default PythonWorkspace;
