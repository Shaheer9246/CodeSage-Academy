import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Play,
  RotateCcw,
  Trash2,
  Terminal,
  Loader2,
  Cpu,
} from 'lucide-react';
import CodeEditor from './CodeEditor';

interface CWorkspaceProps {
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

type Line = { kind: 'out' | 'err' | 'in' | 'sys'; text: string };

const DEFAULT_STARTER = `#include <stdio.h>

int main() {
    printf("Hello, C!\\n");
    return 0;
}
`;

const HEAVY_SYSTEM_REGEX =
  /\b(fork|exec[lv]?p?|system|mmap|pthread_|socket|bind|listen|accept|epoll|select|poll|signal|sigaction|setjmp|longjmp|dlopen|LoadLibrary|CreateThread|WaitForSingleObject)\b/;

function removeComments(code: string): string {
  return code
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/.*$/gm, '');
}

function cleanParams(params: string): string {
  if (!params.trim()) return '';

  return params
    .split(',')
    .map((param) => {
      let cleaned = param.trim();

      if (cleaned === 'void') return '';

      cleaned = cleaned.replace(
        /^(?:unsigned\s+|signed\s+|const\s+)?(?:int|float|double|char|long|short|bool|size_t)\s*\**\s*/,
        ''
      );

      cleaned = cleaned.replace(/\[\s*\]/g, '');

      return cleaned.trim();
    })
    .filter(Boolean)
    .join(', ');
}

function transformFunctionSignatures(code: string): string {
  return code.replace(
    /^\s*(?:unsigned\s+|signed\s+|const\s+|static\s+|inline\s+)*(?:int|void|float|double|char|long|short|bool|size_t)\s*\**\s*([A-Za-z_]\w*)\s*\(([^)]*)\)\s*\{/gm,
    (_match, name: string, params: string) => {
      const prefix = name === 'main' ? 'async function' : 'function';
      return `${prefix} ${name}(${cleanParams(params)}) {`;
    }
  );
}

function transformDeclarations(code: string): string {
  let output = code;

  // Arrays: int arr[10]; char name[20]; int nums[] = {1,2};
  output = output.replace(
    /^(\s*)(?:unsigned\s+|signed\s+|const\s+|static\s+)*(int|float|double|char|long|short|bool|size_t)\s*\**\s*([A-Za-z_]\w*)\s*\[[^\]]*\]\s*(?:=\s*([^;]+))?;/gm,
    (_m, indent: string, type: string, name: string, init?: string) => {
      const fallback = type === 'char' ? "''" : '[]';
      const value = init
        ? init.trim().replace(/^\{/, '[').replace(/\}$/, ']')
        : fallback;

      return `${indent}let ${name} = ${value};`;
    }
  );

  // Pointers: int *p = &x;
  output = output.replace(
    /^(\s*)(?:unsigned\s+|signed\s+|const\s+|static\s+)*(int|float|double|char|long|short|bool|size_t)\s+\*+\s*([A-Za-z_]\w*)\s*(?:=\s*([^;]+))?;/gm,
    (_m, indent: string, _type: string, name: string, init?: string) => {
      const value = init ? init.trim().replace(/&\s*/g, '') : 'undefined';
      return `${indent}let ${name} = ${value};`;
    }
  );

  // Normal declarations: int x = 5;
  output = output.replace(
    /^(\s*)(?:unsigned\s+|signed\s+|const\s+|static\s+)*(?:int|float|double|char|long|short|bool|size_t)\s*\**\s*/gm,
    '$1let '
  );

  // for (int i = 0; ...)
  output = output.replace(
    /for\s*\(\s*(?:unsigned\s+|signed\s+|const\s+)?(?:int|float|double|char|long|short|bool|size_t)\s+\**\s*/g,
    'for (let '
  );

  return output;
}

function transformScanf(code: string): string {
  return code.replace(
    /scanf\s*\(\s*"((?:[^"\\]|\\.)*)"\s*([\s\S]*?)\)\s*;/g,
    (_m, fmt: string, argsPart: string) => {
      const identifiers = argsPart.match(/[A-Za-z_]\w*/g) || [];
      const specifiers = fmt.match(/%[diufFeEgGxXoscpn]/g) || [];

      if (!identifiers.length) return '';

      return identifiers
        .map((name, index) => {
          const spec = specifiers[index] || '%s';
          return `${name} = await __read('${spec}');`;
        })
        .join('\n');
    }
  );
}

function cToJs(code: string): string {
  let js = code;

  js = removeComments(js);

  // Transform object-like #define NAME VALUE to const NAME = VALUE;
  js = js.replace(/^\s*#define\s+([A-Za-z_]\w*)\s+([^\r\n]+)$/gm, (_m, name, val) => {
    return `const ${name} = ${val.trim().replace(/;+$/, '')};`;
  });

  // Remove remaining preprocessor directives like #include, #ifdef, etc.
  js = js.replace(/^\s*#.*$/gm, '');

  // Transform functions
  js = transformFunctionSignatures(js);

  // Transform declarations
  js = transformDeclarations(js);

  // Transform scanf
  js = transformScanf(js);

  // Common C library mappings
  js = js.replace(/\bprintf\s*\(/g, '__printf(');
  js = js.replace(/\bputs\s*\(\s*([^)]+)\s*\)\s*;/g, '__printf("%s\\n", $1);');
  js = js.replace(/\bputchar\s*\(\s*([^)]+)\s*\)\s*;/g, '__printf("%c", $1);');
  js = js.replace(/\bgetchar\s*\(\s*\)/g, "(await __read('%c'))");
  js = js.replace(/\bNULL\b/g, 'null');
  js = js.replace(/\bsizeof\s*\(\s*[^)]*\)/g, '8');
  js = js.replace(/\bstrlen\s*\(\s*([^)]+)\s*\)/g, '($1).length');
  js = js.replace(/\babs\s*\(/g, 'Math.abs(');
  js = js.replace(/\bsqrt\s*\(/g, 'Math.sqrt(');
  js = js.replace(/\bpow\s*\(/g, 'Math.pow(');
  js = js.replace(/\b\([a-zA-Z_*\s]+\)\s*malloc\s*\([^)]*\)/g, '[]');
  js = js.replace(/\bmalloc\s*\([^)]*\)/g, '[]');
  js = js.replace(/\bfree\s*\([^)]*\)\s*;/g, ';');

  return js;
}

function getInitialCode(starterCode?: string, initialCode?: string, practical?: CWorkspaceProps['practical']): string {
  if (initialCode) return initialCode;
  if (starterCode) return starterCode;

  if (practical?.steps) {
    for (const step of practical.steps) {
      const match = step.match(/(#include\s*<[^>]+>[\s\S]+?(?:return\s+0;?\s*}|}))/);
      if (match) {
        return match[1]
          .replace(/\\n/g, '\n')
          .replace(/\bthen\s+/g, '\n')
          .trim();
      }
    }
  }

  return DEFAULT_STARTER;
}

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

        if (type === 'f') return num.toFixed(precision);
        return String(num);
      }

      if (type === 'c') {
        if (typeof arg === 'number') return String.fromCharCode(arg);
        return String(arg ?? '').charAt(0);
      }

      if (type === 's') {
        return String(arg ?? '');
      }

      return String(arg ?? '');
    }
  );
}

const CWorkspace = ({
  starterCode,
  initialCode,
  onCodeChange,
  embedded = false,
  practical,
}: CWorkspaceProps) => {
  const initial = useMemo(
    () => getInitialCode(starterCode, initialCode, practical),
    [starterCode, initialCode, practical]
  );

  const [code, setCode] = useState(initial);
  const [lines, setLines] = useState<Line[]>([
    {
      kind: 'sys',
      text: '$ C Browser Lab — Ready. Press ▶ Run to execute.',
    },
  ]);
  const [running, setRunning] = useState(false);
  const [showTerminal, setShowTerminal] = useState(true);
  const [pendingInput, setPendingInput] = useState<{
    resolve: (value: string) => void;
  } | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const termRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (onCodeChange) onCodeChange(code);
  }, [code, onCodeChange]);

  useEffect(() => {
    if (embedded && initialCode !== undefined) {
      setCode(initialCode);
      setLines([
        {
          kind: 'sys',
          text: '$ C Browser Lab — Ready.',
        },
      ]);
      setRunning(false);
      setPendingInput(null);
    }
  }, [initialCode, embedded]);

  useEffect(() => {
    if (termRef.current) {
      termRef.current.scrollTop = termRef.current.scrollHeight;
    }
  }, [lines, pendingInput]);

  useEffect(() => {
    if (pendingInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [pendingInput]);

  useEffect(() => {
    return () => {
      if (pendingInput) pendingInput.resolve('');
    };
  }, [pendingInput]);

  const write = (kind: Line['kind'], text: string) => {
    setLines((prev) => {
      if (
        kind === 'out' &&
        prev.length &&
        prev[prev.length - 1].kind === 'out' &&
        !prev[prev.length - 1].text.endsWith('\n')
      ) {
        const copy = prev.slice();
        copy[copy.length - 1] = {
          kind: 'out',
          text: copy[copy.length - 1].text + text,
        };
        return copy;
      }

      return [...prev, { kind, text }];
    });
  };

  const promptInput = (): Promise<string> => {
    if (!embedded) setShowTerminal(true);

    return new Promise<string>((resolve) => {
      setPendingInput({
        resolve: (value: string) => {
          setLines((prev) => {
            if (
              prev.length > 0 &&
              prev[prev.length - 1].kind === 'out' &&
              !prev[prev.length - 1].text.endsWith('\n')
            ) {
              const copy = [...prev];
              const last = copy[copy.length - 1];
              copy[copy.length - 1] = {
                ...last,
                text: last.text + value + '\n',
              };
              return copy;
            }

            return [...prev, { kind: 'in', text: value + '\n' }];
          });

          setPendingInput(null);
          resolve(value);
        },
      });
    });
  };

  const __printf = (fmt: any, ...args: any[]) => {
    const text = formatC(String(fmt), args);
    write('out', text);
    return text.length;
  };

  const __read = async (spec: string): Promise<any> => {
    const raw = await promptInput();

    if (/%[diufFeEgGxXo]/.test(spec)) {
      const num = Number(raw.trim());
      return Number.isNaN(num) ? 0 : num;
    }

    if (spec.includes('c')) {
      const char = raw.trim().charAt(0);
      return char ? char.charCodeAt(0) : 0;
    }

    // %s reads token-like input in basic scanf behavior
    return raw.trim().split(/\s+/)[0] ?? '';
  };

  const runCode = async () => {
    if (running) return;

    if (!embedded) setShowTerminal(true);

    setRunning(true);
    write('sys', '$ gcc main.c -o main');

    try {
      if (HEAVY_SYSTEM_REGEX.test(code)) {
        throw new Error(
          'This program uses OS/system-level APIs (fork, socket, pthread, etc.) that cannot run in browser. This is a safety feature.'
        );
      }

      const js = cToJs(code);

      write('sys', '$ ./main');

      const runner = new Function(
        '__printf',
        '__read',
        `return (async () => {
${js}

if (typeof main !== 'function') {
  throw new Error('C simulator requires int main()');
}

const __exitCode = await main();
return typeof __exitCode === 'number' ? __exitCode : 0;
})()`
      ) as (...args: any[]) => Promise<number>;

      const exitCode = await runner(__printf, __read);

      write('sys', `$ exit ${exitCode}`);
    } catch (error: any) {
      const message = error?.message ?? String(error);
      write('err', message);
      write('sys', '$ exit 1');
    } finally {
      setRunning(false);
      setPendingInput(null);
    }
  };

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
  };

  const resetCode = () => {
    setCode(initial);
  };

  const clearConsole = () => {
    setLines([{ kind: 'sys', text: '$ console cleared' }]);
  };

  return (
    <div
      className={`flex flex-col h-full w-full overflow-hidden ${
        embedded
          ? 'bg-background'
          : 'glass-card border border-primary/20 rounded-2xl'
      }`}
    >
      {/* Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 bg-secondary/40 border-b border-border/30 shrink-0">
        <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-primary">
          <Cpu className="w-3 h-3" />
          {embedded ? 'C Terminal' : 'C Lab'}
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowTerminal(!showTerminal)}
            className={`flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-lg transition-colors ${
              showTerminal
                ? 'bg-primary/20 text-primary'
                : 'bg-secondary/60 text-muted-foreground hover:bg-secondary'
            }`}
          >
            <Terminal className="w-3 h-3" />
            Terminal
          </button>

          <button
            onClick={runCode}
            disabled={running}
            className="flex items-center gap-1 bg-primary text-primary-foreground text-[11px] font-semibold px-2.5 py-1 rounded-lg neon-glow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {running ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <Play className="w-3 h-3" />
            )}
            {running ? 'Running…' : 'Run'}
          </button>

          <button
            onClick={resetCode}
            title="Reset editor"
            className="p-1.5 rounded-lg bg-secondary/60 hover:bg-secondary text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="w-3 h-3" />
          </button>

          <button
            onClick={clearConsole}
            title="Clear console"
            className="p-1.5 rounded-lg bg-secondary/60 hover:bg-secondary text-muted-foreground hover:text-foreground"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Split Workspace */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Editor */}
        <div className="flex-1 min-h-0 border-b border-border/30 flex flex-col">
          <CodeEditor
            code={code}
            onChange={handleCodeChange}
            language="c"
            showShortcuts={false}
          />
        </div>

        {/* Terminal */}
        {showTerminal && (
          <div
            ref={termRef}
            className="flex-1 min-h-0 bg-zinc-950 text-emerald-300 font-mono text-[11px] leading-relaxed p-3 overflow-y-auto"
            onClick={() => inputRef.current?.focus()}
          >
            {lines.map((line, index) => {
              const isLastLine = index === lines.length - 1;
              const isWaitingInputOnThisLine =
                pendingInput && isLastLine && line.kind === 'out';

              if (isWaitingInputOnThisLine) {
                return (
                  <div key={index} className="flex items-center flex-wrap gap-1 my-0.5">
                    <span className="text-emerald-300 whitespace-pre-wrap">
                      {line.text}
                    </span>

                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        const value = inputRef.current?.value ?? '';
                        if (inputRef.current) inputRef.current.value = '';
                        pendingInput.resolve(value);
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
                  key={index}
                  className={`whitespace-pre-wrap break-words ${
                    line.kind === 'err'
                      ? 'text-red-400'
                      : line.kind === 'sys'
                      ? 'text-zinc-500'
                      : line.kind === 'in'
                      ? 'text-sky-300'
                      : 'text-emerald-300'
                  }`}
                >
                  {line.text}
                </div>
              );
            })}

            {pendingInput &&
              (lines.length === 0 ||
                lines[lines.length - 1].kind !== 'out') && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const value = inputRef.current?.value ?? '';
                    if (inputRef.current) inputRef.current.value = '';
                    pendingInput.resolve(value);
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

export default CWorkspace;
