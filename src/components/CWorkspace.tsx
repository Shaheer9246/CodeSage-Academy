// src/components/CWorkspace.tsx
import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import {
  Play,
  RotateCcw,
  Trash2,
  Terminal,
  Loader2,
  Cpu,
  AlertTriangle,
  Info,
} from 'lucide-react';
import CodeEditor from './CodeEditor';

interface CWorkspaceProps {
  requiresLocalTerminal?: boolean;
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

const DEFAULT_STARTER = `#include <stdio.h>

int main() {
    printf("Hello, C!\\n");
    
    int x = 10;
    int y = 20;
    printf("Sum: %d\\n", x + y);
    
    return 0;
}
`;

// --- PRE-VALIDATION: Catch unsupported features early ---
function validateCCode(code: string): string | null {
  const warnings = [];
  
  // Structs are hard to simulate perfectly without a full parser
  if (/struct\s+\w+\s*\{/.test(code)) {
    warnings.push("⚠️ Complex 'struct' definitions may not work correctly. Stick to basic types.");
  }
  
  // Pointer arithmetic (p++, p+1) is dangerous in JS translation
  if (/\b\w+\s*\+\s*\d+\s*[;\)]/.test(code) && /\*/.test(code)) {
     // Heuristic check for pointer math
     warnings.push("⚠️ Pointer arithmetic (e.g., ptr + 1) might behave unexpectedly.");
  }

  // Dynamic Memory
  if (/\bcalloc\b|\brealloc\b/.test(code)) {
      warnings.push("ℹ️ calloc/realloc are simulated as standard array allocations.");
  }

  if (warnings.length > 0) {
    return warnings.join('\n');
  }
  return null;
}

// --- TRANSPILER ENGINE ---

function removeComments(code: string): string {
  return code
    .replace(/\/\*[\s\S]*?\*\//g, '') // Block comments
    .replace(/\/\/.*$/gm, '');        // Line comments
}

/**
 * Converts C code to executable JavaScript.
 * Strategy: Map C primitives to JS equivalents.
 */
function cToJs(source: string): string {
  let js = source;

  // 1. Clean up preprocessor directives (#include, #define, etc.)
  // We keep #define values by converting them to consts later, but strip includes
  js = js.replace(/^\s*#include\s*<[^>]+>\s*$/gm, '');
  js = js.replace(/^\s*#pragma.*$/gm, '');
  
  // Convert simple #defines to JS consts (handles MACRO_NAME value;)
  js = js.replace(
    /^\s*#define\s+([A-Za-z_]\w*)\s+(.+?)\s*$/gm, 
    (_, name, val) => `const ${name} = ${val.trim().replace(/;$/, '')};`
  );

  // Remove remaining stray # lines
  js = js.replace(/^\s*#.*$/gm, '');

  // 2. Transform Main Entry Point
  // Find int main(...) { ... } and wrap it
  const mainMatch = js.match(/int\s+main\s*\([^)]*\)\s*\{/);
  if (!mainMatch) {
    throw new Error("Missing 'int main()' function.");
  }
  
  // Replace main signature with async function for await support (scanf/getchar)
  js = js.replace(/int\s+main\s*\([^)]*\)\s*\{/, 'async function __c_main() {');
  
  // Ensure return type handling: C returns int, JS returns undefined/null usually.
  // We'll handle exit codes manually in the runner.

  // 3. Type Declarations -> let/var
  // Handles: int x = 5; char s[10]; float f; double d; long l; unsigned int u;
  const primitiveTypes = ['int', 'float', 'double', 'char', 'long', 'short', 'unsigned', 'signed', 'size_t'];
  
  // Regex to find declarations: [modifiers] type [*] name [= value];
  // Note: This is simplified. It won't catch every edge case of C syntax.
  const declRegex = new RegExp(
    `(?:^|(?<=\\s))(?:${primitiveTypes.join('|')})\\s*(?:\\*\\s*)?([A-Za-z_]\\w*)(?:\\s*=\\s*([^;]+))?;`,
    'gm'
  );

  js = js.replace(declRegex, (match, varName, initVal) => {
    // If it's an array declaration like char s[10], the regex above might miss brackets.
    // Let's handle arrays separately first.
    return ''; // Placeholder, we'll do a second pass for arrays
  });

  // Better Approach: Sequential Replacement
  
  // A. Arrays: type name[size] = {vals}; OR type name[size];
  js = js.replace(
    /(?:^|\s)(?:unsigned\s+|signed\s+)?(?:int|float|double|char|long|short|bool|size_t)\s+\**\s*([A-Za-z_]\w*)\s*\[\s*([^\]]*)\s*\]\s*(?:=\s*({[^}]*}|[^;]+))?;/gm,
    (_, name, sizeOrEmpty, initializer) => {
      let arrInit = '[]';
      if (initializer) {
        // Convert C-style {1,2,3} to JS [1,2,3]
        arrInit = initializer.trim().replace(/^\{/, '[').replace(/\}$/, ']');
      } else if (sizeOrEmpty && !isNaN(parseInt(sizeOrEmpty))) {
        // Fixed size array without init: create empty slots
        // In C, uninitialized stack vars are garbage. In JS, we use undefined.
        // For safety in sim, we fill with 0 or "" depending on type detection (hard here).
        // Just creating empty array is safer for logic flow.
        arrInit = `new Array(${parseInt(sizeOrEmpty)}).fill(0)`; 
      }
      return `let ${name} = ${arrInit};`;
    }
  );

  // B. Pointers: type *ptr = &var; OR type *ptr;
  // We treat pointers as references to objects or just aliases in this sim.
  // Since JS passes by reference for objects, we map `*p` access to property access if possible,
  // BUT simpler: Treat `*p = val` as `p.val = val` ONLY IF p is an object. 
  // For primitive pointers (&x), JS can't do address-of. 
  // STRATEGY: We will disallow complex pointer manipulation in v1 and only support 
  // passing pointers to functions that modify them via wrapper objects? 
  // NO. Too complex.
  // SIMPLEST SAFE STRATEGY: Strip '*' from declarations and assume pass-by-value for primitives.
  // Warn user if they dereference (*p).
  
  js = js.replace(
    /(?:^|\s)(?:unsigned\s+|signed\s+|const\s+)?(?:int|float|double|char|long|short|bool|size_t)\s+\*\s*([A-Za-z_]\w*)\s*(?:=\s*(&?[A-Za-z_]\w*))?\s*;/gm,
    (_, name, init) => {
       // If initializing with &var, we lose the reference capability in pure JS scalar sim.
       // We'll just initialize it. If user tries *name, it will error.
       const val = init ? init.replace('&', '') : 'null';
       return `let ${name} = ${val};`;
    }
  );

  // C. Standard Primitives: int x = 5;
  js = js.replace(
    /(?:^|\s)(?:unsigned\s+|signed\s+|const\s+)?(?:int|float|double|char|long|short|bool|size_t)\s+\**\s*([A-Za-z_]\w*)\s*(?:=\s*([^;]+))?;/gm,
    (_, name, init) => {
      const val = init ? init.trim() : (name.startsWith('i') || name.startsWith('j') || name.startsWith('k') ? '0' : 'undefined');
      return `let ${name} = ${val};`;
    }
  );
  
  // D. For Loop Declarations: for(int i=0...)
  js = js.replace(
    /for\s*\(\s*(?:unsigned\s+|signed\s+)?(?:int|float|double|char|long|short|bool|size_t)\s+\**\s*([A-Za-z_]\w*)\s*=/g,
    'for (let $1 ='
  );

  // 4. Function Calls Mapping
  
  // printf -> __printf
  js = js.replace(/\bprintf\s*\(/g, '__printf(');
  
  // puts(str) -> __printf("%s\n", str)
  js = js.replace(/\bputs\s*\(\s*([^)]+)\s*\)\s*;/g, '__printf("%s\\n", $1);');
  
  // putchar(c) -> __printf("%c", c)
  js = js.replace(/\bputchar\s*\(\s*([^)]+)\s*\)\s*;/g, '__printf("%c", $1);');
  
  // scanf -> await __read
  // Note: scanf returns number of items read. We ignore return value for simplicity.
  js = js.replace(
    /scanf\s*\(\s*"((?:[^"\\]|\\.)*)"\s*,\s*([^)]+)\s*\)\s*;/g,
    (_, fmt, argsStr) => {
      const args = argsStr.split(',').map(a => a.trim()).filter(Boolean);
      // Handle &var removal
      const cleanArgs = args.map(a => a.replace(/^&/, ''));
      
      // Generate sequential awaits
      const reads = cleanArgs.map(arg => `${arg} = await __read("${fmt}");`).join('\n');
      return reads;
    }
  );
  
  // getchar() -> await __getchar()
  js = js.replace(/\bgetchar\s*\(\s*\)/g, "(await __getchar())");

  // Math Library
  js = js.replace(/\bsqrt\s*\(/g, 'Math.sqrt(');
  js = js.replace(/\bpow\s*\(/g, 'Math.pow(');
  js = js.replace(/\babs\s*\(/g, 'Math.abs(');
  js = js.replace(/\bfloor\s*\(/g, 'Math.floor(');
  js = js.replace(/\bceil\s*\(/g, 'Math.ceil(');
  js = js.replace(/\bsin\s*\(/g, 'Math.sin(');
  js = js.replace(/\bcos\s*\(/g, 'Math.cos(');
  js = js.replace(/\btan\s*\(/g, 'Math.tan(');

  // String Lib (Basic)
  js = js.replace(/\bstrlen\s*\(\s*([^)]+)\s*\)/g, '($1).length');
  js = js.replace(/\bstrcpy\s*\(\s*([^,]+)\s*,\s*([^)]+)\s*\)/g, '$1 = $2;'); // Shallow copy warning
  js = js.replace(/\bstrcmp\s*\(\s*([^,]+)\s*,\s*([^)]+)\s*\)/g, '(($1 === $2) ? 0 : (($1 > $2) ? 1 : -1))');

  // Memory (Malloc/Free)
  js = js.replace(/\bmalloc\s*\([^)]*\)/g, '[]');
  js = js.replace(/\bfree\s*\([^)]*\)\s*;/g, ';');

  // NULL
  js = js.replace(/\bNULL\b/g, 'null');
  
  // sizeof (Approximation)
  js = js.replace(/\bsizeof\s*\(\s*[^)]*\)/g, '8'); 

  // Return statement cleanup for main
  // If it's inside __c_main, ensure it returns a number
  // We don't replace all returns, just rely on JS returning undefined->0 in runner.

  return js;
}

// --- RUNTIME HELPERS ---

function formatC(fmt: string, args: any[]): string {
  let argIndex = 0;
  return fmt.replace(
    /%(%|[-+ #0]*\d*(?:\.\d+)?(?:hh|h|l|ll|L)?[diufFeEgGxXoscpn])/g,
    (_match, spec: string) => {
      if (spec === '%') return '%';
      const arg = args[argIndex++];
      const type = spec.slice(-1);

      if (type === 'f' || type === 'e' || type === 'g') {
        const precisionMatch = spec.match(/\.(\d+)/);
        const precision = precisionMatch ? Number(precisionMatch[1]) : 6;
        const num = Number(arg);
        if (Number.isNaN(num)) return "nan";
        if (type === 'f') return num.toFixed(precision);
        return num.toExponential(precision);
      }

      if (type === 'c') {
        if (typeof arg === 'number') return String.fromCharCode(arg);
        return String(arg ?? '').charAt(0);
      }

      if (type === 's') {
        return String(arg ?? '');
      }
      
      // Integer types
      if (['d', 'i'].includes(type)) {
        return String(Math.trunc(Number(arg)));
      }
      
      // Hex
      if (['x', 'X'].includes(type)) {
        return Number(arg).toString(16).toUpperCase();
      }

      return String(arg ?? '');
    }
  );
}

// --- COMPONENT ---

const CWorkspace = ({
  starterCode,
  initialCode,
  onCodeChange,
  embedded = false,
  practical,
}: CWorkspaceProps) => {
  const initial = useMemo(() => {
    if (initialCode) return initialCode;
    if (starterCode) return starterCode;
    return DEFAULT_STARTER;
  }, [starterCode, initialCode]);

  const [code, setCode] = useState(initial);
  const [lines, setLines] = useState<ConsoleLine[]>([
    { id: 0, kind: 'sys', text: '$ C Browser Lab — Ready.' },
  ]);
  const [isRunning, setIsRunning] = useState(false);
  const [pendingInput, setPendingInput] = useState<{ resolve: (v: string) => void } | null>(null);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const termRef = useRef<HTMLDivElement>(null);

  // Sync Parent
  useEffect(() => {
    if (onCodeChange) onCodeChange(code);
  }, [code, onCodeChange]);

  // Reset on Prop Change
  useEffect(() => {
    if (embedded && initialCode !== undefined) {
      setCode(initialCode);
      setLines([{ id: Date.now(), kind: 'sys', text: '$ C Browser Lab — Ready.' }]);
      setIsRunning(false);
      setPendingInput(null);
    }
  }, [initialCode, embedded]);

  // Auto-scroll
  useEffect(() => {
    if (termRef.current) {
      termRef.current.scrollTop = termRef.current.scrollHeight;
    }
  }, [lines, pendingInput]);

  // Focus Input
  useEffect(() => {
    if (pendingInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [pendingInput]);

  // Cleanup Pending Input
  useEffect(() => {
    return () => {
      if (pendingInput) pendingInput.resolve('');
    };
  }, [pendingInput]);

  const pushLine = useCallback((kind: LineKind, text: string) => {
    setLines(prev => [...prev, { id: Date.now() + Math.random(), kind, text }]);
  }, []);

  const promptInput = (): Promise<string> => {
    return new Promise<string>((resolve) => {
      setPendingInput({
        resolve: (value: string) => {
          setLines(prev => {
            // Append input to last line if it was output waiting for input
            if (prev.length > 0 && prev[prev.length - 1].kind === 'out' && !prev[prev.length - 1].text.endsWith('\n')) {
               const copy = [...prev];
               const last = copy[copy.length - 1];
               copy[copy.length - 1] = { ...last, text: last.text + value + '\n' };
               return copy;
            }
            return [...prev, { id: Date.now(), kind: 'in', text: value + '\n' }];
          });
          setPendingInput(null);
          resolve(value);
        },
      });
    });
  };

  const __printf = (fmt: any, ...args: any[]) => {
    const text = formatC(String(fmt), args);
    pushLine('out', text);
    return text.length;
  };

  const __read = async (fmt: string): Promise<any> => {
    const raw = await promptInput();
    // Simple parsing based on format specifier presence
    if (/%[dif]/.test(fmt)) {
      const num = Number(raw.trim());
      return Number.isNaN(num) ? 0 : num;
    }
    if (/%c/.test(fmt)) {
      return raw.trim().charCodeAt(0) || 0;
    }
    // Default string/token
    return raw.trim().split(/\s+/)[0] ?? '';
  };
  
  const __getchar = async (): Promise<number> => {
     const raw = await promptInput();
     return raw.charCodeAt(0) || 0;
  };

  const runCode = async () => {
    if (isRunning) return;
    
    // 1. Validate
    const warning = validateCCode(code);
    if (warning) {
        pushLine('warn', warning);
    }

    setIsRunning(true);
    pushLine('sys', `$ gcc main.c -o main`);

    try {
      // 2. Transpile
      const jsCode = cToJs(code);
      
      // 3. Execute
      pushLine('sys', `$ ./main`);
      
      // Create sandboxed function
      // eslint-disable-next-line no-new-func
      const runner = new Function(
        '__printf', 
        '__read', 
        '__getchar',
        `"use strict"; 
         ${jsCode}
         
         if (typeof __c_main !== 'function') {
             throw new Error("Entry point 'main' not found.");
         }
         
         return __c_main();
        `
      ) as (...args: any[]) => Promise<number>;

      const result = await runner(__printf, __read, __getchar);
      
      const exitCode = typeof result === 'number' ? result : 0;
      pushLine('sys', `$ exit ${exitCode}`);

    } catch (error: any) {
      // Map JS errors to C-like messages where possible
      let msg = error.message || String(error);
      
      if (msg.includes("Unexpected token")) {
          msg = "Syntax Error: Invalid C syntax detected during conversion.\nHint: Check semicolons (;) and braces {}.";
      } else if (msg.includes("is not defined")) {
          msg = `Runtime Error: Undefined variable or function.\nDetails: ${msg}`;
      }
      
      pushLine('err', msg);
      pushLine('sys', `$ exit 1`);
    } finally {
      setIsRunning(false);
      setPendingInput(null);
    }
  };

  const resetCode = () => setCode(initial);
  const clearConsole = () => setLines([{ id: Date.now(), kind: 'sys', text: '$ console cleared' }]);

  // --- RENDER ---

  const renderTerminalContent = () => (
    <div className="flex flex-col h-full bg-zinc-950 rounded-b-xl overflow-hidden border-t border-zinc-800">
      <div 
        ref={termRef}
        className="flex-1 overflow-y-auto p-4 font-mono text-xs leading-relaxed space-y-1 scrollbar-thin scrollbar-thumb-zinc-700"
      >
        {lines.map((line) => {
          const isLastLine = line.id === lines[lines.length - 1]?.id;
          const isWaitingInputOnThisLine = pendingInput && isLastLine && line.kind === 'out';

          if (isWaitingInputOnThisLine) {
            return (
              <div key={line.id} className="flex items-center flex-wrap gap-1 my-0.5">
                <span className="text-emerald-300 whitespace-pre-wrap">{line.text}</span>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const val = inputRef.current?.value ?? '';
                    if (inputRef.current) inputRef.current.value = '';
                    pendingInput!.resolve(val);
                  }}
                  className="inline-flex flex-1 min-w-[120px]"
                >
                  <input
                    ref={inputRef}
                    autoFocus
                    className="flex-1 bg-transparent outline-none border-none text-sky-300 font-mono text-xs caret-emerald-300 p-0 m-0"
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

  if (embedded) {
    return (
      <div className="h-full flex flex-col glass-card border border-primary/20 rounded-xl overflow-hidden shadow-lg">
        <div className="flex items-center justify-between px-3 py-2 bg-secondary/40 border-b border-border/30 shrink-0">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-blue-500">
            <Cpu className="w-3 h-3" /> C Sandbox
          </div>
          <div className="flex items-center gap-1">
             <button onClick={runCode} disabled={isRunning} className="flex items-center gap-1 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-semibold px-2 py-1 rounded-md transition-all disabled:opacity-50">
               {isRunning ? <Loader2 className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3 fill-current" />}
               Run
             </button>
             <button onClick={resetCode} title="Reset Code" className="p-1 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
               <RotateCcw className="w-3 h-3" />
             </button>
             <button onClick={clearConsole} title="Clear Console" className="p-1 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
               <Trash2 className="w-3 h-3" />
             </button>
          </div>
        </div>
          <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 min-h-[200px] border-b border-border/30 relative">
            <CodeEditor code={code} onChange={setCode} language="c" showShortcuts={false} />
          </div>
          <div className="h-[45%] min-h-[160px] flex flex-col">
            {renderTerminalContent()}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card overflow-hidden border border-primary/20 rounded-2xl shadow-xl flex flex-col h-[600px]">
      <div className="flex items-center justify-between px-4 py-3 bg-secondary/40 border-b border-border/30">
        <div className="flex items-center gap-2 text-sm font-mono uppercase tracking-wider text-blue-500">
          <Cpu className="w-4 h-4" /> C Lab
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={runCode}
            disabled={isRunning}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-md shadow-blue-900/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isRunning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
            {isRunning ? 'Compiling...' : 'Run Code'}
          </button>
          <button onClick={resetCode} className="p-2 rounded-lg bg-secondary/60 hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors" title="Reset">
            <RotateCcw className="w-4 h-4" />
          </button>
          <button onClick={clearConsole} className="p-2 rounded-lg bg-secondary/60 hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors" title="Clear">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0 relative flex flex-col">
         {/* Editor Takes Top Half */}
         <div className="h-1/2 border-b border-border/30">
           <CodeEditor code={code} onChange={setCode} language="c" showShortcuts={true} />
         </div>
         
         {/* Terminal Takes Bottom Half */}
         <div className="h-1/2">
           {renderTerminalContent()}
         </div>
      </div>
    </div>
  );
};

export default CWorkspace;
