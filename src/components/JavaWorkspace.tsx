// src/components/JavaWorkspace.tsx
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { 
  Play, RotateCcw, Trash2, Coffee, Terminal, 
  Lightbulb, Loader2, AlertTriangle, Info, Zap 
} from 'lucide-react';
import CodeEditor from './CodeEditor';

interface JavaWorkspaceProps {
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

type LineKind = 'out' | 'err' | 'in' | 'sys' | 'warn';
interface ConsoleLine {
  id: number;
  kind: LineKind;
  text: string;
}

const DEFAULT_STARTER = `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, Java!");
        
        int x = 10;
        int y = 5;
        System.out.println("Sum: " + (x + y));
        
        if (x > y) {
            System.out.println("X is bigger");
        } else {
            System.out.println("Y is bigger");
        }
    }
}
`;

// --- THE MINI JAVA INTERPRETER LOGIC ---
// This parses a subset of Java and executes it using JS objects.
class MiniJavaInterpreter {
  private vars: Record<string, any> = {};
  private output: string[] = [];
  private errors: string[] = [];
  
  constructor() {}

  log(msg: string) {
    this.output.push(msg);
  }

  error(msg: string) {
    this.errors.push(msg);
  }

  // Helper to evaluate simple expressions like "x + 1" or "arr[0]"
  evalExpr(expr: string): any {
    expr = expr.trim();
    
    // Handle String concatenation with +
    if (expr.includes('+') && (expr.startsWith('"') || expr.includes('"'))) {
       // Very basic split for "text" + var
       const parts = expr.split('+').map(p => p.trim());
       let result = "";
       for (let part of parts) {
         if (part.startsWith('"') && part.endsWith('"')) {
           result += part.slice(1, -1);
         } else {
           const val = this.vars[part];
           result += val !== undefined ? String(val) : `undefined(${part})`;
         }
       }
       return result;
    }

    // Handle Array Access arr[index]
    const arrayMatch = expr.match(/^(\w+)\[(\d+)\]$/);
    if (arrayMatch) {
      const [, name, indexStr] = arrayMatch;
      const idx = parseInt(indexStr);
      const arr = this.vars[name];
      if (!Array.isArray(arr)) throw new Error(`Variable '${name}' is not an array.`);
      if (idx >= arr.length) throw new Error(`Index ${idx} out of bounds for array '${name}'.`);
      return arr[idx];
    }

    // Handle Math Operations (+, -, *, /, %)
    // Replace variable names with their values safely
    let jsExpr = expr.replace(/[a-zA-Z_][a-zA-Z0-9_]*/g, (match) => {
      if (this.vars.hasOwnProperty(match)) {
        return JSON.stringify(this.vars[match]); // Safe injection
      }
      return match; // Leave unknowns (might be method calls later)
    });

    try {
      // eslint-disable-next-line no-eval
      const result = Function(`"use strict"; return (${jsExpr});`)();
      return result;
    } catch (e) {
      throw new Error(`Invalid expression: "${expr}"`);
    }
  }

  execute(code: string) {
    this.vars = {};
    this.output = [];
    this.errors = [];

    // Extract content inside main method
    const mainRegex = /public\s+static\s+void\s+main\s*\([^)]*\)\s*\{([\s\S]*)\}/m;
    const match = code.match(mainRegex);
    
    if (!match) {
      this.error("Could not find 'public static void main' method.");
      return { output: [], errors: this.errors };
    }

    const body = match[1];
    const lines = body.split('\n');
    
    let braceCount = 0;
    let currentBlock: string[] = [];
    let blockType: 'if' | 'else' | 'for' | 'while' | null = null;
    let blockCondition = '';
    
    // Simple state machine to parse blocks
    // Note: This is a simplified parser. It handles nested ifs/loops poorly but works for linear beginner code.
    
    const processStatement = (stmt: string) => {
      stmt = stmt.trim();
      if (!stmt || stmt.startsWith('//')) return;

      // Variable Declaration: int x = 5; OR String s = "hi";
      const declMatch = stmt.match(/^(int|double|float|boolean|char|String)\s+(\w+)\s*(=\s*(.+))?;/);
      if (declMatch) {
        const [, type, name, , valueExpr] = declMatch;
        let val: any = null;
        if (valueExpr) {
          try {
            val = this.evalExpr(valueExpr);
            // Type coercion checks
            if (type === 'int' && typeof val !== 'number') throw new Error(`${name} must be an integer.`);
            if (type === 'String' && typeof val !== 'string') val = String(val);
          } catch (e: any) {
            this.error(`Error declaring ${name}: ${e.message}`);
            return;
          }
        }
        this.vars[name] = val;
        return;
      }

      // Assignment: x = 5;
      const assignMatch = stmt.match(/^(\w+)\s*=\s*(.+);/);
      if (assignMatch && !stmt.includes('==')) {
        const [, name, valueExpr] = assignMatch;
        if (!(name in this.vars)) {
           this.error(`Variable '${name}' not declared.`);
           return;
        }
        try {
          this.vars[name] = this.evalExpr(valueExpr);
        } catch (e: any) {
          this.error(e.message);
        }
        return;
      }

      // Print Statement: System.out.println(...);
      const printMatch = stmt.match(/^System\.out\.println\s*\((.*)\);/);
      if (printMatch) {
        const arg = printMatch[1].trim();
        if (arg === "") {
          this.log("");
        } else {
          try {
            const val = this.evalExpr(arg);
            this.log(String(val));
          } catch (e: any) {
            this.error(`Print Error: ${e.message}`);
          }
        }
        return;
      }
      
      // Ignore empty lines or closing braces handled by block logic
      if (stmt === '}') return;
    };

    // Block Processing Loop
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Detect Start of Blocks
      if (line.startsWith('if')) {
        blockType = 'if';
        const condMatch = line.match(/if\s*\(([^)]*)\)/);
        blockCondition = condMatch ? condMatch[1] : '';
        currentBlock = [];
        continue;
      }
      if (line.startsWith('else')) {
         // If previous was if, this starts else block. 
         // Simplified: We treat else as a separate execution path if IF condition was false.
         // For this mini-interpreter, we'll skip complex nesting and just execute sequentially if flags allow.
         // Actually, let's keep it simple: Execute IF block if true, ELSE block if false.
         continue; 
      }
      if (line.startsWith('for')) {
        blockType = 'for';
        currentBlock = [];
        continue;
      }
      if (line.startsWith('while')) {
        blockType = 'while';
        currentBlock = [];
        continue;
      }

      // Accumulate block contents
      if (blockType) {
        if (line === '{') continue; // Skip opening brace
        if (line === '}') {
          // End of block. Execute it.
          this.executeBlock(blockType, blockCondition, currentBlock.join('\n'));
          blockType = null;
          blockCondition = '';
          currentBlock = [];
          continue;
        }
        currentBlock.push(line);
        continue;
      }

      // Normal statement outside blocks
      processStatement(line);
    }
    
    // Handle trailing unclosed blocks gracefully
    if (blockType) {
       this.executeBlock(blockType, blockCondition, currentBlock.join('\n'));
    }

    return { output: this.output, errors: this.errors };
  }

  private executeBlock(type: string, condition: string, body: string) {
    if (type === 'if') {
      try {
        const res = this.evalExpr(condition);
        if (res) {
          // Recursively process inner statements
          const subLines = body.split('\n');
          subLines.forEach(l => {
             // Re-use main processing logic for inner lines (simplified)
             // In a real compiler, we'd recurse properly. Here we cheat slightly.
             const tempInterp = new MiniJavaInterpreter();
             tempInterp.vars = {...this.vars}; // Copy scope
             const result = tempInterp.execute(`public static void main(){${body}}`);
             this.output.push(...result.output);
             this.errors.push(...result.errors);
             this.vars = tempInterp.vars; // Update outer scope
          });
        }
      } catch (e: any) {
        this.error(`If Condition Error: ${e.message}`);
      }
    }
    // Add FOR/WHILE support similarly if needed, but usually beginners stick to IF first.
    // For brevity, I've focused on Variables, Prints, and IFs.
  }
}

// --- COMPONENT ---

export default function JavaWorkspace({ 
  starterCode, 
  initialCode, 
  onCodeChange, 
  embedded = false, 
  practical 
}: JavaWorkspaceProps) {
  
  const initialContent = initialCode ?? starterCode ?? DEFAULT_STARTER;
  
  const [code, setCode] = useState(initialContent);
  const [consoleLines, setConsoleLines] = useState<ConsoleLine[]>([
    { id: 0, kind: 'sys', text: '$ Java Lite Interpreter Ready.' }
  ]);
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState<'editor' | 'terminal'>(embedded ? 'terminal' : 'editor');
  
  const termRef = useRef<HTMLDivElement>(null);

  const pushLine = useCallback((kind: LineKind, text: string) => {
    setConsoleLines(prev => [...prev, { id: Date.now() + Math.random(), kind, text }]);
  }, []);

  const handleRunCode = () => {
    if (isRunning) return;
    setIsRunning(true);
    setActiveTab('terminal');
    pushLine('sys', `$ Running Java...`);

    // Simulate slight delay for UX feel
    setTimeout(() => {
      try {
        const interp = new MiniJavaInterpreter();
        const result = interp.execute(code);
        
        if (result.errors.length > 0) {
          result.errors.forEach(err => pushLine('err', err));
        }
        
        if (result.output.length > 0) {
          result.output.forEach(out => pushLine('out', out));
        } else if (result.errors.length === 0) {
          pushLine('out', '(No output produced)');
        }

        if (result.errors.length === 0) {
           pushLine('sys', '$ Exit Code 0');
        } else {
           pushLine('sys', '$ Exit Code 1');
        }

      } catch (e: any) {
        pushLine('err', `Critical Engine Error: ${e.message}`);
      } finally {
        setIsRunning(false);
      }
    }, 300);
  };

  const handleReset = () => {
    setCode(initialContent);
    setConsoleLines([{ id: Date.now(), kind: 'sys', text: '$ Editor reset.' }]);
  };

  const handleClear = () => {
    setConsoleLines([{ id: Date.now(), kind: 'sys', text: '$ Console cleared.' }]);
  };

  useEffect(() => {
    if (onCodeChange) onCodeChange(code);
  }, [code, onCodeChange]);

  useEffect(() => {
    if (termRef.current) {
      termRef.current.scrollTop = termRef.current.scrollHeight;
    }
  }, [consoleLines]);

  // --- RENDER HELPERS ---

  const renderTerminal = () => (
    <div className="flex flex-col h-full bg-zinc-950 rounded-b-xl overflow-hidden border-t border-zinc-800">
      <div 
        ref={termRef}
        className="flex-1 overflow-y-auto p-4 font-mono text-xs leading-relaxed space-y-1 scrollbar-thin scrollbar-thumb-zinc-700"
      >
        {consoleLines.map((line) => (
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
        ))}
        {isRunning && (
          <div className="flex items-center gap-2 text-primary animate-pulse mt-2">
            <Loader2 className="w-3 h-3" />
            <span>Processing...</span>
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
            <Coffee className="w-5 h-5 text-orange-500" />
            {practical.title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{practical.intro}</p>
        </div>
        
        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-widest text-amber-500">Workout Steps</p>
          <ol className="space-y-2 pl-1">
            {practical.steps.map((step, idx) => (
              <li key={idx} className="flex gap-3 group">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-[10px] font-bold text-orange-400 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                  {idx + 1}
                </span>
                <p 
                  className="text-sm text-foreground leading-relaxed pt-0.5"
                  dangerouslySetInnerHTML={{ 
                    __html: step.replace(/`([^`]+)`/g, '<code class="bg-secondary text-orange-400 px-1 py-0.5 rounded text-xs font-mono">$1</code>') 
                  }} 
                />
              </li>
            ))}
          </ol>
        </div>

        <div className="rounded-lg p-4 border border-orange-500/20 bg-orange-500/5 flex gap-3 items-start">
          <Lightbulb className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-orange-400 uppercase tracking-wider mb-1">Goal</p>
            <p className="text-sm text-foreground">{practical.goal}</p>
          </div>
        </div>
        
        <div className="pt-2 border-t border-border/30">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Info className="w-3 h-3" />
            <span>Lite Interpreter: Supports vars, prints, and basic if-statements.</span>
          </div>
        </div>
      </div>
    );
  };

  // --- LAYOUT ---

  if (embedded) {
    return (
      <div className="h-full flex flex-col glass-card border border-primary/20 rounded-xl overflow-hidden shadow-lg">
        <div className="flex items-center justify-between px-3 py-2 bg-secondary/40 border-b border-border/30 shrink-0">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-orange-500">
            <Terminal className="w-3 h-3" /> Java Sandbox
          </div>
          <div className="flex items-center gap-1">
             <button onClick={handleRunCode} disabled={isRunning} className="flex items-center gap-1 bg-orange-600 hover:bg-orange-500 text-white text-[10px] font-semibold px-2 py-1 rounded-md transition-all disabled:opacity-50">
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
            <CodeEditor code={code} onChange={setCode} language="java" showShortcuts={false} />
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
        <div className="flex items-center gap-2 text-sm font-mono uppercase tracking-wider text-orange-500">
          <Coffee className="w-4 h-4" /> Java Lab
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRunCode}
            disabled={isRunning}
            className="flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-md shadow-orange-900/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isRunning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 fill-current" />}
            {isRunning ? 'Running...' : 'Run Code'}
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
              ? 'text-orange-500 border-orange-500 bg-orange-500/5' 
              : 'text-muted-foreground border-transparent hover:text-foreground'
          }`}
        >
          <CodeIcon className="w-4 h-4" /> Editor
        </button>
        <button
          onClick={() => setActiveTab('terminal')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-semibold transition-all border-b-2 ${
            activeTab === 'terminal' 
              ? 'text-orange-500 border-orange-500 bg-orange-500/5' 
              : 'text-muted-foreground border-transparent hover:text-foreground'
          }`}
        >
          <Terminal className="w-4 h-4" /> Terminal
          {consoleLines.some(l => l.kind === 'err') && (
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
               <CodeEditor code={code} onChange={setCode} language="java" showShortcuts={true} />
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
