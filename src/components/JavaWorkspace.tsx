import { useEffect, useRef, useState } from 'react';
import { Play, RotateCcw, Trash2, Coffee, Terminal, Lightbulb, Loader2 } from 'lucide-react';
import CodeEditor from './CodeEditor'; // Assuming this uses your existing CodeEditor

interface JavaWorkspaceProps {
  starterCode?: string;
  practical: {
    title: string;
    intro: string;
    steps: string[];
    goal: string;
  };
}

type Line = { kind: 'out' | 'err' | 'in' | 'sys'; text: string };

const DEFAULT_STARTER = `public class Main {
    public static void main(String[] args) {
        // Write your Java code here
        System.out.println("Hello, Java developer!");
    }
}
`;

const JavaWorkspace = ({ starterCode, practical }: JavaWorkspaceProps) => {
  const initial = starterCode ?? DEFAULT_STARTER;
  const [code, setCode] = useState(initial);
  const [lines, setLines] = useState<Line[]>([
    { kind: 'sys', text: '$ Java 17 (Client-side simulation) — press ▶ Run Code to start.' }
  ]);
  const [running, setRunning] = useState(false);
  const [tab, setTab] = useState<'assign' | 'term'>('assign');
  const [pendingInput, setPendingInput] = useState<{ resolve: (v: string) => void } | null>(null);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const termRef = useRef<HTMLDivElement>(null);

  // Auto-scroll terminal
  useEffect(() => {
    if (termRef.current) termRef.current.scrollTop = termRef.current.scrollHeight;
  }, [lines, pendingInput]);

  // Focus input when waiting for user
  useEffect(() => {
    if (pendingInput && inputRef.current) inputRef.current.focus();
  }, [pendingInput]);

  // Cleanup pending input on unmount
  useEffect(() => {
    return () => {
      if (pendingInput) pendingInput.resolve('');
    };
  }, [pendingInput]);

  const write = (kind: Line['kind'], text: string) => {
    setLines(prev => {
      // Append to the last line if it's also 'out' and doesn't end with a newline
      if (kind === 'out' && prev.length && prev[prev.length - 1].kind === 'out' && !prev[prev.length - 1].text.endsWith('\n')) {
        const copy = prev.slice();
        copy[copy.length - 1] = { kind: 'out', text: copy[copy.length - 1].text + text };
        return copy;
      }
      return [...prev, { kind, text }];
    });
  };

  const runCode = async () => {
    if (running) return;
    setTab('term');
    setRunning(true);
    write('sys', '$ javac Main.java');
    
    try {
      // Simulate compilation delay
      await new Promise(res => setTimeout(res, 600));
      write('sys', '$ java Main');

      // Simulate execution delay
      await new Promise(res => setTimeout(res, 400));

      // ----------------------------------------------------------------------
      // EXECUTION LOGIC FOR LOVABLE:
      // Since true in-browser Java compilation requires complex WASM (CheerpJ),
      // for beginner lessons we can simulate basic outputs by parsing the code,
      // or you can replace this block with a fetch() call to a secure API.
      // ----------------------------------------------------------------------
      
      // Basic extraction of System.out.println for visual feedback in lessons
      const printMatches = code.matchAll(/System\.out\.print(?:ln)?\("(.*?)"\);/g);
      let foundOutput = false;
      
      for (const match of printMatches) {
        write('out', match[1] + '\n');
        foundOutput = true;
      }

      if (!foundOutput) {
         write('out', 'Program executed successfully.\n');
      }

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
          <Coffee className="w-3 h-3" /> Java Lab
        </div>
        
        <div className="flex items-center gap-1">
          <button
            onClick={runCode}
            disabled={running}
            className="flex items-center gap-1 bg-primary text-primary-foreground text-[11px] font-semibold px-2.5 py-1 rounded-lg neon-glow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {running ? <Loader2 className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
            {running ? 'Compiling…' : 'Run Code'}
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
        <CodeEditor code={code} onChange={setCode} language="java" showShortcuts={false} />
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border/30 bg-secondary/20">
        <button
          onClick={() => setTab('assign')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-[11px] font-semibold transition-all border-b-2 ${
            tab === 'assign' ? 'text-primary border-primary bg-primary/5' : 'text-muted-foreground border-transparent'
          }`}
        >
          <Lightbulb className="w-3 h-3" /> Assignment
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
  );
};

export default JavaWorkspace;
