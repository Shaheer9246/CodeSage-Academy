// src/components/CppWorkspace.tsx
import { useEffect, useRef, useState } from 'react';
import { Play, RotateCcw, Trash2, FlaskConical, Terminal, Lightbulb, Loader2, Keyboard } from 'lucide-react';
import CodeEditor from './CodeEditor';

declare global {
  interface Window {
    JSCPP: any;
  }
}

interface CppWorkspaceProps {
  starterCode?: string;
  initialCode?: string;
  onCodeChange?: (code: string) => void;
  embedded?: boolean;
  practical?: {
    title: string;
    intro: string;
    steps: string[];
    goal: string;
  };
}

// FIX 1: The 2.0.9 npm package is missing the 'dist' folder on jsDelivr, causing a 404.
// Using 2.0.6 which is confirmed to have the dist folder [[25]].
const JSCPP_MAIN = 'https://cdn.jsdelivr.net/npm/JSCPP@2.0.6/dist/JSCPP.es5.min.js';

// FIX 2: Web Workers don't have a 'window' object. UMD scripts often crash with "window is not defined".
// We alias 'self' to 'window' before importing the script to prevent this crash.
const WORKER_CODE = `
  try {
    if (typeof window === 'undefined') {
      self.window = self;
    }
    importScripts("${JSCPP_MAIN}");
  } catch (e) {
    self.postMessage({ type: 'error', error: 'Failed to load C++ interpreter: ' + (e.message || e) });
  }

  self.onmessage = function(e) {
    const { code, input } = e.data;
    try {
      const config = {
        stdio: {
          write: (s) => self.postMessage({ type: 'out', text: s })
        },
        unsigned_overflow: "warn",
        maxTimeout: 5000
      };
      const exitCode = JSCPP.run(code, input, config);
      self.postMessage({ type: 'done', exitCode });
    } catch (err) {
      self.postMessage({ type: 'error', error: err.message || String(err) });
    }
  };
`;

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

// FIX 3: Return a 'failed' state so the UI doesn't get stuck on "Loading..." forever if the CDN fails.
function useJSCPP(enabled: boolean) {
  const [ready, setReady] = useState<boolean>(typeof window !== 'undefined' && !!window.JSCPP);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (ready || !enabled) return;
    let cancelled = false;
    (async () => {
      try {
        await loadScript(JSCPP_MAIN);
        if (!cancelled) setReady(true);
      } catch (err) {
        console.error("Failed to load JSCPP script:", err);
        if (!cancelled) {
          setReady(true); // Allow the user to click the button and see the terminal error
          setFailed(true);
        }
      }
    })();
    return () => { cancelled = true; };
  }, [ready, enabled]);
  
  return { ready, failed };
}

type Line = { kind: 'out' | 'err' | 'in' | 'sys'; text: string };

const DEFAULT_STARTER = `#include <iostream>
using namespace std;

int main() {
    string name;
    cout << "What's your name? ";
    cin >> name;
    cout << "Hello, " << name << " — welcome to C++!" << endl;
    
    return 0;
}
`;

const CppWorkspace = ({ starterCode, initialCode, onCodeChange, embedded = false, practical }: CppWorkspaceProps) => {
  const initial = initialCode ?? starterCode ?? DEFAULT_STARTER;
  const [code, setCode] = useState(initial);
  
  const [inputText, setInputText] = useState('World'); 
  
  const [lines, setLines] = useState<Line[]>([{ kind: 'sys', text: '$ C++ (JSCPP in-browser interpreter) — press ▶ Run Code to start.' }]);
  const [running, setRunning] = useState(false);
  const [tab, setTab] = useState<'assign' | 'term'>(embedded ? 'term' : 'assign');
  
  const termRef = useRef<HTMLDivElement>(null);
  const [wantLoad] = useState<boolean>(true);
  const { ready, failed } = useJSCPP(wantLoad);

  useEffect(() => {
    if (onCodeChange) onCodeChange(code);
  }, [code, onCodeChange]);

  useEffect(() => {
    if (embedded && initialCode !== undefined) {
      setCode(initialCode);
      setLines([{ kind: 'sys', text: '$ C++ — Ready.' }]);
      setRunning(false);
    }
  }, [initialCode, embedded]);

  useEffect(() => {
    if (termRef.current) termRef.current.scrollTop = termRef.current.scrollHeight;
  }, [lines]);

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

  const runCode = async () => {
    if (!ready || running) return;
    
    if (failed || !window.JSCPP) {
        write('err', 'Failed to load C++ interpreter. Please check your internet connection or try refreshing the page.');
        return;
    }

    if (!embedded) setTab('term');
    setRunning(true);
    write('sys', '$ g++ main.cpp && ./a.out');

    if (inputText.trim()) {
      write('in', `STDIN:\n${inputText}\n`);
    }

    let worker: Worker | null = null;
    let workerUrl: string = '';

    try {
      let runOnMainThread = false;
      
      try {
        const blob = new Blob([WORKER_CODE], { type: 'application/javascript' });
        workerUrl = URL.createObjectURL(blob);
        worker = new Worker(workerUrl);

        await new Promise<void>((resolveRun) => {
          let timeoutId: any = setTimeout(() => {
            runOnMainThread = true;
            resolveRun();
          }, 6000); 

          worker!.onmessage = (e) => {
            clearTimeout(timeoutId);
            const { type, text, exitCode, error } = e.data;
            if (type === 'out') write('out', text);
            else if (type === 'done') {
              write('sys', `$ exit ${exitCode}`);
              resolveRun();
            } else if (type === 'error') {
              write('err', error);
              resolveRun();
            }
          };
          
          worker!.onerror = () => {
            runOnMainThread = true;
            resolveRun();
          };
          
          worker!.postMessage({ type: 'run', code, input: inputText });
        });

        if (runOnMainThread) throw new Error("Fallback to main thread");
      } catch (err) {
        console.warn("Worker blocked or failed, running on main thread.", err);
        await new Promise(resolve => setTimeout(resolve, 50)); 
        
        // FIX 4: Robust main thread fallback
        if (!window.JSCPP) {
            try {
                await loadScript(JSCPP_MAIN);
            } catch (e) {
                throw new Error("Failed to load C++ interpreter on main thread.");
            }
        }
        
        const JSCPP = window.JSCPP;
        if (!JSCPP) throw new Error("JSCPP global not found after loading script.");

        const config = {
          stdio: { write: (s: string) => write('out', s) },
          unsigned_overflow: "warn",
          maxTimeout: 5000
        };
        const exitCode = JSCPP.run(code, inputText, config);
        write('sys', `$ exit ${exitCode}`);
      }
    } catch (err: any) {
      write('err', err?.message || err?.toString?.() || String(err));
    } finally {
      if (worker) worker.terminate();
      if (workerUrl) URL.revokeObjectURL(workerUrl);
      setRunning(false);
    }
  };

  const handleCodeChange = (newCode: string) => setCode(newCode);
  const resetCode = () => setCode(initial);
  const clearConsole = () => setLines([{ kind: 'sys', text: '$ console cleared' }]);

  return (
    <div className={`glass-card overflow-hidden border border-primary/20 ${embedded ? 'h-full flex flex-col rounded-none border-0 bg-background' : 'rounded-2xl'}`}>
      <div className="flex items-center justify-between px-3 py-2 bg-secondary/40 border-b border-border/30">
        <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-primary">
          <FlaskConical className="w-3 h-3" /> {embedded ? 'C++ Terminal' : 'C++ Lab'}
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

      <div className={`${embedded ? 'flex-1 min-h-0' : 'h-[260px] md:h-[320px]'} border-b border-border/30`}>
        <CodeEditor code={code} onChange={handleCodeChange} language="cpp" showShortcuts={false} />
      </div>

      {!embedded && (
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
          </button>
        </div>
      )}

      {(!embedded && tab === 'assign' && practical) ? (
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
        <div className={`flex flex-col bg-zinc-950 ${embedded ? 'flex-1 min-h-[120px]' : 'max-h-[300px] min-h-[180px]'}`}>
          
          <div className="flex items-center gap-2 px-3 py-2 border-b border-zinc-800 bg-zinc-900/50">
            <Keyboard className="w-3 h-3 text-zinc-500" />
            <span className="text-[10px] text-zinc-400 font-mono uppercase">Stdin:</span>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type all inputs here before running (separated by spaces or newlines)..."
              className="flex-1 bg-transparent text-emerald-300 text-[11px] font-mono outline-none resize-none h-[20px] caret-emerald-300"
            />
          </div>

          <div
            ref={termRef}
            className="text-emerald-300 font-mono text-[11px] leading-relaxed p-3 overflow-y-auto flex-1"
          >
            {lines.map((l, i) => (
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
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CppWorkspace;
