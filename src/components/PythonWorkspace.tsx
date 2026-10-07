// src/components/PythonWorkspace.tsx
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { 
  Play, RotateCcw, Trash2, FlaskConical, Terminal, 
  Loader2, AlertTriangle, Info, Zap 
} from 'lucide-react';
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
  requiresLocalTerminal?: boolean;
  practical?: {
    title: string;
    intro: string;
    steps: string[];
    goal: string;
  };
}

type LineKind = 'out' | 'err' | 'in' | 'sys' | 'warn';
interface ConsoleLine {
  id: number;
  kind: LineKind;
  text: string;
}

const SKULPT_MAIN = 'https://cdn.jsdelivr.net/npm/skulpt@1.2.0/dist/skulpt.min.js';
const SKULPT_STDLIB = 'https://cdn.jsdelivr.net/npm/skulpt@1.2.0/dist/skulpt-stdlib.js';

// --- Script Loader Utility ---
function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[data-src="${src}"]`) as HTMLScriptElement | null;
    if (existing) {
      if (existing.dataset.loaded === 'true') return resolve();
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error('Load failed')));
      return;
    }
    const s = document.createElement('script');
    s.src = src;
    s.async = true;
    s.dataset.src = src;
    s.onload = () => { s.dataset.loaded = 'true'; resolve(); };
    s.onerror = () => reject(new Error('Load failed'));
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
      } catch (err) {
        console.error("Failed to load Skulpt", err);
      }
    })();
    
    return () => { cancelled = true; };
  }, [ready, enabled]);
  
  return ready;
}

const DEFAULT_STARTER = `# Welcome to Python Lab!
name = input("What is your name? ")
print(f"Hello, {name}!")

# Basic Math
x = 10
y = 5
print("Sum:", x + y)

# Loops
for i in range(3):
    print(f"Iteration {i}")
`;

export default function PythonWorkspace({ 
  starterCode, 
  initialCode, 
  onCodeChange, 
  embedded = false, 
  requiresLocalTerminal = false,
  practical 
}: PythonWorkspaceProps) {
  
  const initialContent = initialCode ?? starterCode ?? DEFAULT_STARTER;
  
  const [code, setCode] = useState(initialContent);
  const [lines, setLines] = useState<ConsoleLine[]>([
    { id: 0, kind: 'sys', text: '$ Initializing Python Runtime...' }
  ]);
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState<'editor' | 'terminal'>(embedded ? 'terminal' : 'editor');
  
  // Refs
  const termRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const pendingInputResolveRef = useRef<((value: string) => void) | null>(null);
  
  const wantLoad = !requiresLocalTerminal;
  const ready = useSkulpt(wantLoad);

  // --- Effects ---

  useEffect(() => {
    if (onCodeChange) onCodeChange(code);
  }, [code, onCodeChange]);

  useEffect(() => {
    if (embedded && initialCode !== undefined) {
      setCode(initialCode);
      setLines([{ id: Date.now(), kind: 'sys', text: '$ Ready.' }]);
      setIsRunning(false);
      pendingInputResolveRef.current = null;
    }
  }, [initialCode, embedded]);

  useEffect(() => {
    if (termRef.current) {
      termRef.current.scrollTop = termRef.current.scrollHeight;
    }
  }, [lines]);

  useEffect(() => {
    if (pendingInputResolveRef.current && inputRef.current) {
      inputRef.current.focus();
    }
  }, [lines]); // Focus whenever new lines appear if waiting for input

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (pendingInputResolveRef.current) {
        pendingInputResolveRef.current(''); // Resolve with empty to prevent hanging promises
      }
    };
  }, []);

  // --- Core Logic ---

  const pushLine = useCallback((kind: LineKind, text: string) => {
    setLines(prev => [...prev, { id: Date.now() + Math.random(), kind, text }]);
  }, []);

  /**
   * Custom Input Handler for Skulpt
   * Returns a Promise that resolves when user submits input
   */
  const handleSkulptInput = (): Promise<string> => {
    return new Promise<string>((resolve) => {
      // Store resolver so we can trigger it from UI event handlers
      pendingInputResolveRef.current = resolve;
      
      // Force re-render to show input box logic in terminal view
      // We add a dummy line to trigger scroll/focus effects if needed
      pushLine('sys', ''); 
    });
  };

  const submitInput = (value: string) => {
    if (pendingInputResolveRef.current) {
      const resolveFn = pendingInputResolveRef.current;
      pendingInputResolveRef.current = null; // Clear reference
      
      // Append input to console visually
      setLines(prev => {
        // Find last 'out' line without newline and append input
        if (prev.length > 0 && prev[prev.length - 1].kind === 'out' && !prev[prev.length - 1].text.endsWith('\n')) {
          const copy = [...prev];
          const last = copy[copy.length - 1];
          copy[copy.length - 1] = { ...last, text: last.text + value + '\n' };
          return copy;
        }
        return [...prev, { id: Date.now(), kind: 'in', text: value + '\n' }];
      });
      
      resolveFn(value);
    }
  };

  const runCode = async () => {
    if (isRunning || !ready || requiresLocalTerminal) return;
    
    setIsRunning(true);
    setActiveTab('terminal');
    pushLine('sys', `$ python main.py`);
    
    // Reset Skulpt Config for this run to ensure clean state
    // Note: In production, you might want to cache modules, but for safety/cleanliness, we reset output/input hooks
    window.Sk.configure({
      output: (t: string) => {
        // Skulpt outputs chunks. We buffer them slightly or write directly.
        // Direct writing is fine for small scripts.
        pushLine('out', t);
      },
      read: (filename: string) => {
        // Handle standard library imports
        if (window.Sk.builtinFiles === undefined || window.Sk.builtinFiles.files[filename] === undefined) {
           throw new Error(`Module not found: ${filename}. Try importing only built-in modules.`);
        }
        return window.Sk.builtinFiles.files[filename];
      },
      inputfun: handleSkulptInput,
      inputfunTakesPrompt: false, // We handle prompts ourselves
      __future__: window.Sk.python3,
      execLimit: 10000, // Prevent infinite loops (ms)
    });

    try {
      // Execute the code
      await window.Sk.misceval.asyncToPromise(() => 
        window.Sk.importMainWithBody('<stdin>', false, code, true)
      );
      
      pushLine('sys', '$ exit 0');
      
    } catch (err: any) {
      // Extract meaningful Python error messages from Skulpt exceptions
      let errorMsg = "Unknown Error";
      
      if (err instanceof window.Sk.builtins.ExceptionObject) {
        // This is a Python Exception
        const type = err.tp$name || "Exception";
        const args = err.args ? err.args.v.map((a: any) => String(a)).join(", ") : "";
        errorMsg = `${type}: ${args}`;
        
        // Add traceback hint if available
        if (err.traceback) {
           errorMsg += "\n(Check your syntax or variable names)";
        }
      } else if (err.message) {
        errorMsg = err.message;
      } else {
        errorMsg = String(err);
      }
      
      pushLine('err', errorMsg);
      pushLine('sys', '$ exit 1');
    } finally {
      setIsRunning(false);
      pendingInputResolveRef.current = null; // Ensure cleanup
    }
  };

  const handleReset = () => {
    setCode(initialContent);
    setLines([{ id: Date.now(), kind: 'sys', text: '$ Editor reset.' }]);
    pendingInputResolveRef.current = null;
  };

  const handleClear = () => {
    setLines([{ id: Date.now(), kind: 'sys', text: '$ Console cleared.' }]);
  };

  // --- Render Helpers ---

  const renderTerminal = () => (
    <div className="flex flex-col h-full bg-zinc-950 rounded-b-xl overflow-hidden border-t border-zinc-800">
      <div 
        ref={termRef}
        className="flex-1 overflow-y-auto p-4 font-mono text-xs leading-relaxed space-y-1 scrollbar-thin scrollbar-thumb-zinc-700"
      >
        {lines.map((line) => {
          const isLastLine = line.id === lines[lines.length - 1]?.id;
          const isWaitingForInput = pendingInputResolveRef.current !== null && isLastLine && line.kind === 'sys' && line.text === '';

          // Special rendering for the "waiting for input" state
          // We attach the input field to the last visible output line if possible, 
          // or just show a dedicated input row.
          
          if (isWaitingForInput) {
             return (
               <div key={line.id} className="flex items-center gap-2 mt-1">
                 <span className="text-emerald-500 font-bold">{'>>> '}</span>
                 <form onSubmit={(e) => { e.preventDefault(); submitInput(inputRef.current?.value || ''); }} className="flex-1">
                   <input 
                     ref={inputRef}
                     autoFocus
                     className="w-full bg-transparent outline-none text-sky-300 font-mono text-xs caret-emerald-300 border-b border-zinc-700 focus:border-emerald-500 transition-colors pb-1"
                     placeholder="Type input..."
                   />
                 </form>
               </div>
             );
          }

          return (
            <div 
              key={line.id} 
              className={`whitespace-pre-wrap break-words ${
                line.kind === 'err' ? 'text-red-400' :
                line.kind === 'sys' ? 'text-zinc-500 italic' :
                line.kind === 'warn' ? 'text-yellow-400' :
                line.kind === 'in'  ? 'text-sky-300' : 
                'text-emerald-300'
              }`}
            >
              {line.text}
            </div>
          );
        })}
        
        {isRunning && (
          <div className="flex items-center gap-2 text-primary animate-pulse mt-2">
            <Loader2 className="w-3 h-3" />
            <span>Executing...</span>
          </div>
        )}
      </div>
    </div>
  );

  const renderAssignment = () => {
    if (!practical) return null;
    return (
      <div className="p-6 space-y-6 bg-secondary/20 overflow-y-auto max-h-[calc(100vh-200px)]">
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-green-500" />
            {practical.title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{practical.intro}</p>
        </div>
        
        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-widest text-green-500">Steps</p>
          <ol className="space-y-2 pl-1">
            {practical.steps.map((step, idx) => (
              <li key={idx} className="flex gap-3 group">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center text-[10px] font-bold text-green-400 group-hover:bg-green-500 group-hover:text-white transition-colors">
                  {idx + 1}
                </span>
                <p 
                  className="text-sm text-foreground leading-relaxed pt-0.5"
                  dangerouslySetInnerHTML={{ 
                    __html: step.replace(/`([^`]+)`/g, '<code class="bg-secondary text-green-400 px-1 py-0.5 rounded text-xs font-mono">$1</code>') 
                  }} 
                />
              </li>
            ))}
          </ol>
        </div>

        <div className="rounded-lg p-4 border border-green-500/20 bg-green-500/5 flex gap-3 items-start">
          <Info className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-green-400 uppercase tracking-wider mb-1">Goal</p>
            <p className="text-sm text-foreground">{practical.goal}</p>
          </div>
        </div>
      </div>
    );
  };

  // --- Layout ---

  if (embedded) {
    return (
      <div className="h-full flex flex-col glass-card border border-primary/20 rounded-xl overflow-hidden shadow-lg">
        <div className="flex items-center justify-between px-3 py-2 bg-secondary/40 border-b border-border/30 shrink-0">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-green-500">
            <Terminal className="w-3 h-3" /> Python Sandbox
          </div>
          <div className="flex items-center gap-1">
             <button onClick={runCode} disabled={!ready || isRunning} className="flex items-center gap-1 bg-green-600 hover:bg-green-500 text-white text-[10px] font-semibold px-2 py-1 rounded-md transition-all disabled:opacity-50">
               {isRunning ? <Loader2 className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3 fill-current" />}
               Run
             </button>
             <button onClick={handleReset} title="Reset Code" className="p-1 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
               <RotateCcw className="w-3 h-3" />
             </button>
             <button onClick={handleClear} title="Clear Console" className="p-1 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
               <Trash2 className="w-3 h-3" />
             </button>
          </div>
        </div>
        <div className="flex-1 flex min-h-0">
          <div className="flex-1 border-r border-border/30 relative">
            <CodeEditor code={code} onChange={setCode} language="python" showShortcuts={false} />
          </div>
          <div className="w-[40%] min-w-[250px] flex flex-col">
            {renderTerminal()}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card overflow-hidden border border-primary/20 rounded-2xl shadow-xl flex flex-col h-[600px]">
      <div className="flex items-center justify-between px-4 py-3 bg-secondary/40 border-b border-border/30">
        <div className="flex items-center gap-2 text-sm font-mono uppercase tracking-wider text-green-500">
          <FlaskConical className="w-4 h-4" /> Python Lab
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={runCode}
            disabled={!ready || isRunning}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-md shadow-green-900/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isRunning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 fill-current" />}
            {ready ? (isRunning ? 'Running...' : 'Run Code') : 'Loading...'}
          </button>
          <button onClick={handleReset} className="p-2 rounded-lg bg-secondary/60 hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors" title="Reset">
            <RotateCcw className="w-4 h-4" />
          </button>
          <button onClick={handleClear} className="p-2 rounded-lg bg-secondary/60 hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors" title="Clear">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex border-b border-border/30 bg-secondary/20">
        <button
          onClick={() => setActiveTab('editor')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-semibold transition-all border-b-2 ${
            activeTab === 'editor' 
              ? 'text-green-500 border-green-500 bg-green-500/5' 
              : 'text-muted-foreground border-transparent hover:text-foreground'
          }`}
        >
          <CodeIcon className="w-4 h-4" /> Editor
        </button>
        <button
          onClick={() => setActiveTab('terminal')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-semibold transition-all border-b-2 ${
            activeTab === 'terminal' 
              ? 'text-green-500 border-green-500 bg-green-500/5' 
              : 'text-muted-foreground border-transparent hover:text-foreground'
          }`}
        >
          <Terminal className="w-4 h-4" /> Terminal
          {lines.some(l => l.kind === 'err') && (
            <AlertTriangle className="w-3 h-3 text-red-400 ml-1" />
          )}
        </button>
      </div>

      <div className="flex-1 min-h-0 relative">
        {activeTab === 'editor' ? (
          <div className="absolute inset-0 flex">
             {practical && (
               <div className="hidden lg:block w-1/3 border-r border-border/30 bg-background/50 backdrop-blur-sm overflow-y-auto">
                 {renderAssignment()}
               </div>
             )}
             <div className={`${practical ? 'w-2/3' : 'w-full'} h-full`}>
               <CodeEditor code={code} onChange={setCode} language="python" showShortcuts={true} />
             </div>
          </div>
        ) : (
          <div className="absolute inset-0">
            {renderTerminal()}
          </div>
        )}
      </div>
    </div>
  );
};

const CodeIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="16 18 22 12 16 6"></polyline>
    <polyline points="8 6 2 12 8 18"></polyline>
  </svg>
);
