// src/components/CppWorkspace.tsx
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { 
  Play, RotateCcw, Trash2, FlaskConical, Terminal, 
  Lightbulb, Loader2, Keyboard, AlertTriangle, Info 
} from 'lucide-react';
import CodeEditor from './CodeEditor'; // Assuming you have this component

// --- Types ---
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

type LineKind = 'out' | 'err' | 'in' | 'sys' | 'warn';
interface ConsoleLine {
  id: number;
  kind: LineKind;
  text: string;
}

// --- Constants & Config ---
// Using a stable version of JSCPP that includes dist files on CDN
const JSCPP_CDN_URL = 'https://cdn.jsdelivr.net/npm/JSCPP@2.0.6/dist/JSCPP.es5.min.js';

// Supported headers by JSCPP's built-in library
const SUPPORTED_HEADERS = new Set([
  'iostream', 'cmath', 'cstdio', 'cstdlib', 'cstring', 'ctime',
  'iomanip', 'cctype', 'math.h', 'stdio.h', 'stdlib.h', 'string.h',
  'time.h', 'ctype.h'
]);

// Features explicitly NOT supported by basic JSCPP or our lightweight wrapper
const UNSUPPORTED_FEATURES = [
  { regex: /\b(std::)?(vector|list|deque|array)\b/, msg: "STL Containers (vector, list, etc.) are not supported." },
  { regex: /\b(std::)?(map|set|unordered_map|unordered_set)\b/, msg: "Associative Arrays (map, set) are not supported." },
  { regex: /\b(std::)?(sort|find_if|for_each|accumulate)\b/, msg: "Standard Algorithms (<algorithm>) are not supported." },
  { regex: /\b(fstream|ifstream|ofstream)\b/, msg: "File I/O is not supported in browser sandbox." },
  { regex: /\b(class\s+\w+\s*:)/, msg: "Complex Class Inheritance may fail. Stick to structs/simple classes." },
];

// --- Helper Functions ---

/**
 * Validates code against known limitations before attempting execution.
 * Returns an error message if invalid, null otherwise.
 */
function validateCppCode(code: string): string | null {
  // Check for unsupported keywords/features
  for (const feature of UNSUPPORTED_FEATURES) {
    if (feature.regex.test(code)) {
      return `❌ Unsupported Feature Detected:\n${feature.msg}\n\n💡 Tip: Use basic arrays (int arr[10]) and manual loops instead.`;
    }
  }
  return null;
}

/**
 * Preprocesses code to make it compatible with JSCPP.
 * 1. Removes std:: prefix (JSCPP doesn't handle namespaces well).
 * 2. Comments out unsupported #includes.
 * 3. Injects typedef for string if needed.
 */
function preprocessCppCode(source: string): string {
  let code = source;

  // 1. Remove std:: globally
  code = code.replace(/\bstd::/g, '');

  // 2. Handle Includes
  code = code.replace(/#include\s*<([^>]+)>/g, (match, header) => {
    const cleanHeader = header.trim();
    if (SUPPORTED_HEADERS.has(cleanHeader)) {
      return match; // Keep supported headers
    }
    // Comment out unsupported ones but keep line structure
    return `// [OMITTED] ${match}`;
  });

  // 3. Inject String Typedef if 'string' is used but not defined
  // Note: This is a hacky shim. Real std::string methods won't work.
  const usesString = /\bstring\b/.test(code);
  const definesString = /typedef\s+.*\bstring\b/.test(code) || /class\s+string\b/.test(code);
  
  if (usesString && !definesString) {
    // Insert at top after includes
    const lines = code.split('\n');
    let insertIndex = 0;
    
    // Find end of include block
    while (insertIndex < lines.length && lines[insertIndex].trim().startsWith('#')) {
      insertIndex++;
    }
    
    lines.splice(insertIndex, 0, '// Shim: Basic char array for string support');
    lines.splice(insertIndex + 1, 0, 'typedef char string[1024];'); 
    
    code = lines.join('\n');
  }

  return code;
}

/**
 * Generates the Web Worker script as a string.
 * We embed logic here to isolate heavy computation from the main thread.
 */
const generateWorkerScript = () => {
  return `
    self.onmessage = function(e) {
      const { requestId, code, input } = e.data;
      
      try {
        // Load JSCPP dynamically inside worker if not already present
        if (typeof self.JSCPP === 'undefined') {
          importScripts('${JSCPP_CDN_URL}');
        }

        const config = {
          stdio: {
            write: (s) => {
              // Send output chunks back immediately
              self.postMessage({ type: 'output', requestId, data: s });
            }
          },
          unsigned_overflow: "ignore", // Prevent crashes on minor overflows
          maxTimeout: 5000 // 5 seconds hard limit
        };

        // Execute
        const exitCode = self.JSCPP.run(code, input, config);
        
        self.postMessage({ type: 'done', requestId, exitCode });

      } catch (err) {
        // Map common JSCPP errors to friendly messages
        let errorMsg = err.message || String(err);
        
        if (errorMsg.includes('ReferenceError')) {
          errorMsg += "\\n(Hint: Variable might be undeclared or misspelled)";
        } else if (errorMsg.includes('TypeError')) {
           errorMsg += "\\n(Hint: Type mismatch or incompatible operation)";
        } else if (errorMsg.includes('timeout')) {
           errorMsg = "⏱ Execution Timed Out (>5s). Possible infinite loop.";
        }

        self.postMessage({ type: 'error', requestId, error: errorMsg });
      }
    };
  `;
};

// --- Main Component ---

const CppWorkspace: React.FC<CppWorkspaceProps> = ({ 
  starterCode, 
  initialCode, 
  onCodeChange, 
  embedded = false, 
  practical 
}) => {
  // State
  const initialContent = initialCode ?? starterCode ?? `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}
`;
  
  const [code, setCode] = useState(initialContent);
  const [inputText, setInputText] = useState("");
  const [consoleLines, setConsoleLines] = useState<ConsoleLine[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState<'editor' | 'terminal'>(embedded ? 'terminal' : 'editor');
  
  // Refs
  const termRef = useRef<HTMLDivElement>(null);
  const workerRef = useRef<Worker | null>(null);
  const requestIdRef = useRef<number>(0);
  const cleanupTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize Console
  useEffect(() => {
    pushLine('sys', '$ Ready. Press ▶ Run to execute.');
  }, []);

  // Auto-scroll terminal
  useEffect(() => {
    if (termRef.current) {
      termRef.current.scrollTop = termRef.current.scrollHeight;
    }
  }, [consoleLines]);

  // Cleanup Worker on unmount
  useEffect(() => {
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
      if (cleanupTimerRef.current) {
        clearTimeout(cleanupTimerRef.current);
      }
    };
  }, []);

  // Notify parent of changes
  useEffect(() => {
    if (onCodeChange) onCodeChange(code);
  }, [code, onCodeChange]);

  // Reset when external initialCode changes (if embedded)
  useEffect(() => {
    if (embedded && initialCode !== undefined) {
      setCode(initialCode);
      setConsoleLines([]);
      pushLine('sys', '$ Code reset from props.');
    }
  }, [initialCode, embedded]);

  // --- Core Logic ---

  const pushLine = useCallback((kind: LineKind, text: string) => {
    setConsoleLines(prev => [...prev, { id: Date.now() + Math.random(), kind, text }]);
  }, []);

  const initWorker = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (workerRef.current) {
        resolve();
        return;
      }

      try {
        const blob = new Blob([generateWorkerScript()], { type: 'application/javascript' });
        const url = URL.createObjectURL(blob);
        const worker = new Worker(url);
        
        // Clean up URL after creation
        setTimeout(() => URL.revokeObjectURL(url), 1000);

        worker.onerror = (e) => {
          console.error("Worker Init Error:", e);
          reject(new Error("Failed to initialize background processor."));
        };

        // Wait for first ping or assume ready since we inject scripts inline
        // For simplicity, we consider it ready once created. 
        // A more robust way would be a handshake message, but importScripts blocks until loaded.
        workerRef.current = worker;
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  };

  const runCode = async () => {
    if (isRunning) return;

    // 1. Validate
    const validationError = validateCppCode(code);
    if (validationError) {
      pushLine('err', validationError);
      return;
    }

    // 2. Prepare
    setIsRunning(true);
    setActiveTab('terminal');
    const currentRequestId = ++requestIdRef.current;
    
    pushLine('sys', `$ Compiling & Running... (ID: ${currentRequestId})`);
    
    const processedCode = preprocessCppCode(code);
    
    // Normalize input: Replace newlines with spaces for cin >> compatibility mostly
    // But preserve explicit newlines if using getline (hard to detect automatically, so we pass raw)
    const normalizedInput = inputText; 

    try {
      // 3. Initialize Worker
      await initWorker();
      
      if (!workerRef.current) throw new Error("Worker instance lost");

      // Setup temporary listener for THIS request
      const handleMessage = (e: MessageEvent) => {
        const { type, requestId, data, exitCode, error } = e.data;
        
        // Ignore old requests
        if (requestId !== currentRequestId) return;

        if (type === 'output') {
          pushLine('out', data);
        } else if (type === 'done') {
          pushLine('sys', `$ Process exited with code ${exitCode}`);
          finishRun();
        } else if (type === 'error') {
          pushLine('err', `Runtime Error: ${error}`);
          finishRun();
        }
      };

      workerRef.current.addEventListener('message', handleMessage);
      
      // Post message to worker
      workerRef.current.postMessage({
        requestId: currentRequestId,
        code: processedCode,
        input: normalizedInput
      });

      // Safety Timeout for the whole operation (UI level)
      cleanupTimerRef.current = setTimeout(() => {
        if (isRunning) {
          pushLine('err', "⚠️ Operation timed out on client side.");
          finishRun();
        }
      }, 10000); // 10s total buffer

    } catch (err: any) {
      pushLine('err', `System Error: ${err.message}`);
      finishRun();
    }
  };

  const finishRun = () => {
    setIsRunning(false);
    if (cleanupTimerRef.current) {
      clearTimeout(cleanupTimerRef.current);
      cleanupTimerRef.current = null;
    }
    // Optionally terminate worker to save memory, or keep alive for next run
    // Keeping alive is faster for subsequent runs
  };

  const handleReset = () => {
    setCode(initialContent);
    setConsoleLines([]);
    pushLine('sys', '$ Editor reset to default.');
  };

  const handleClear = () => {
    setConsoleLines([]);
    pushLine('sys', '$ Console cleared.');
  };

  // --- Render Helpers ---

  const renderTerminalContent = () => (
    <div className="flex flex-col h-full bg-zinc-950 rounded-b-xl overflow-hidden border-t border-zinc-800">
      {/* Input Area */}
      <div className="flex items-start gap-2 px-3 py-2 bg-zinc-900 border-b border-zinc-800 shrink-0">
        <Keyboard className="w-4 h-4 text-zinc-500 mt-1 shrink-0" />
        <div className="flex-1">
          <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block mb-1">
            Standard Input (stdin)
          </label>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter values separated by spaces or newlines..."
            className="w-full bg-transparent text-emerald-300 text-xs font-mono outline-none resize-none h-[60px] leading-relaxed caret-emerald-300 placeholder:text-zinc-600"
          />
        </div>
      </div>

      {/* Output Area */}
      <div 
        ref={termRef}
        className="flex-1 overflow-y-auto p-3 font-mono text-xs leading-relaxed space-y-1 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent"
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
          <div className="flex items-center gap-2 text-primary animate-pulse">
            <Loader2 className="w-3 h-3" />
            <span>Executing...</span>
          </div>
        )}
      </div>
    </div>
  );

  const renderAssignmentPanel = () => {
    if (!practical) return null;
    return (
      <div className="p-4 space-y-4 bg-secondary/20 border-r border-border/30 overflow-y-auto max-h-[calc(100vh-200px)]">
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <FlaskConical className="w-4 h-4 text-primary" />
            {practical.title}
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">{practical.intro}</p>
        </div>
        
        <div className="space-y-3">
          <p className="text-[10px] font-mono text-amber-500 uppercase tracking-widest">Steps</p>
          <ol className="space-y-2 pl-1">
            {practical.steps.map((step, idx) => (
              <li key={idx} className="flex gap-3 group">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-[10px] font-bold text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  {idx + 1}
                </span>
                <p 
                  className="text-xs text-foreground leading-relaxed pt-0.5"
                  dangerouslySetInnerHTML={{ 
                    __html: step.replace(/`([^`]+)`/g, '<code class="bg-secondary text-primary px-1 py-0.5 rounded text-[10px] font-mono">$1</code>') 
                  }} 
                />
              </li>
            ))}
          </ol>
        </div>

        <div className="rounded-lg p-3 border border-primary/20 bg-primary/5 flex gap-3 items-start">
          <Lightbulb className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-[10px] font-bold text-primary uppercase tracking-wider mb-1">Goal</p>
            <p className="text-xs text-foreground">{practical.goal}</p>
          </div>
        </div>
        
        <div className="pt-2 border-t border-border/30">
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
            <Info className="w-3 h-3" />
            <span>Limited to basic C++ (No STL Vectors/Maps).</span>
          </div>
        </div>
      </div>
    );
  };

  // --- Layout ---

  if (embedded) {
    return (
      <div className="h-full flex flex-col glass-card border border-primary/20 rounded-xl overflow-hidden shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-2 bg-secondary/40 border-b border-border/30 shrink-0">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-primary">
            <Terminal className="w-3 h-3" /> C++ Sandbox
          </div>
          <div className="flex items-center gap-1">
             <button onClick={runCode} disabled={isRunning} className="flex items-center gap-1 bg-primary text-primary-foreground text-[10px] font-semibold px-2 py-1 rounded-md hover:brightness-110 disabled:opacity-50 transition-all">
               {isRunning ? <Loader2 className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
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

      {/* Body Split */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Editor Side */}
          <div className="flex-1 min-h-[200px] border-b border-border/30 relative">
            <CodeEditor 
              code={code} 
              onChange={setCode} 
              language="cpp" 
              showShortcuts={false} 
            />
          </div>
          
          {/* Terminal Side */}
          <div className="h-[45%] min-h-[160px] flex flex-col">
            {renderTerminalContent()}
          </div>
        </div>
      </div>
    );
  }

  // Non-Embedded View (Tabs)
  return (
    <div className="glass-card overflow-hidden border border-primary/20 rounded-2xl shadow-xl flex flex-col h-[600px]">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-secondary/40 border-b border-border/30">
        <div className="flex items-center gap-2 text-sm font-mono uppercase tracking-wider text-primary">
          <FlaskConical className="w-4 h-4" /> C++ Lab
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={runCode}
            disabled={isRunning}
            className="flex items-center gap-2 bg-primary text-primary-foreground text-xs font-semibold px-4 py-2 rounded-lg neon-glow hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            {isRunning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
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

      {/* Tab Navigation */}
      <div className="flex border-b border-border/30 bg-secondary/20">
        <button
          onClick={() => setActiveTab('editor')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-semibold transition-all border-b-2 ${
            activeTab === 'editor' 
              ? 'text-primary border-primary bg-primary/5' 
              : 'text-muted-foreground border-transparent hover:text-foreground'
          }`}
        >
          <CodeIcon className="w-4 h-4" /> Editor
        </button>
        <button
          onClick={() => setActiveTab('terminal')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-semibold transition-all border-b-2 ${
            activeTab === 'terminal' 
              ? 'text-primary border-primary bg-primary/5' 
              : 'text-muted-foreground border-transparent hover:text-foreground'
          }`}
        >
          <Terminal className="w-4 h-4" /> Terminal
          {consoleLines.some(l => l.kind === 'err') && (
            <AlertTriangle className="w-3 h-3 text-red-400 ml-1" />
          )}
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 min-h-0 relative">
        {activeTab === 'editor' ? (
          <div className="absolute inset-0">
            <CodeEditor 
              code={code} 
              onChange={setCode} 
              language="cpp" 
              showShortcuts={true} 
            />
          </div>
        ) : (
          <div className="absolute inset-0">
            {renderTerminalContent()}
          </div>
        )}
      </div>
      
      {/* Assignment Panel (Only visible in non-embedded mode if provided) */}
      {practical && activeTab === 'editor' && (
         <div className="hidden lg:block absolute right-0 top-[100px] bottom-0 w-80 z-10 transform translate-x-full transition-transform duration-300 ease-in-out pointer-events-none opacity-0">
            {/* This layout assumes a sidebar toggle exists in parent. Simplified here: */}
         </div>
      )}
      
      {/* Mobile/Tablet Assignment Overlay if needed, or integrate into editor view differently */}
      {practical && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-50 hidden" id="assignment-overlay">
           {/* Implementation detail omitted for brevity, usually a modal */}
        </div>
      )}
    </div>
  );
};

// Simple Icon Wrapper for consistency if lucide doesn't have one named exactly
const CodeIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="16 18 22 12 16 6"></polyline>
    <polyline points="8 6 2 12 8 18"></polyline>
  </svg>
);

export default CppWorkspace;
