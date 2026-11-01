import { useRef, lazy, Suspense } from 'react';
import EditorShortcuts from './EditorShortcuts';
import { Loader2 } from 'lucide-react';

// Lazy-load Monaco Editor on demand so lesson concept text & mobile load instantly
const MonacoEditor = lazy(() => import('@monaco-editor/react'));

interface CodeEditorProps {
  code: string;
  onChange: (value: string) => void;
  language?: string;
  theme?: 'vs-dark' | 'light';
  fontSize?: number;
  showShortcuts?: boolean;
}

function EditorSkeleton({ code }: { code: string }) {
  return (
    <div className="h-full w-full bg-[#1e1e1e] p-4 font-mono text-xs text-muted-foreground/70 overflow-hidden relative select-none">
      <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-1 rounded bg-secondary/30 text-[10px] text-muted-foreground border border-border/20 z-10">
        <Loader2 className="w-3 h-3 animate-spin text-primary" />
        <span>Loading Editor...</span>
      </div>
      <pre className="opacity-60 leading-relaxed font-mono">
        <code>{code.slice(0, 300) || '// Initializing editor environment...'}</code>
      </pre>
    </div>
  );
}

const CodeEditor = ({ 
  code, 
  onChange, 
  language = 'html', 
  theme = 'vs-dark', 
  fontSize = 14, 
  showShortcuts = true 
}: CodeEditorProps) => {
  const editorRef = useRef<unknown>(null);

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 min-h-0">
        <Suspense fallback={<EditorSkeleton code={code} />}>
          <MonacoEditor
            height="100%"
            language={language}
            value={code}
            onChange={(val) => onChange(val || '')}
            theme={theme}
            onMount={(editor) => { editorRef.current = editor; }}
            options={{
              fontSize,
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              wordWrap: 'on',
              automaticLayout: true,
              tabSize: 2,
              suggestOnTriggerCharacters: true,
              quickSuggestions: true,
              autoClosingBrackets: 'always',
              autoClosingQuotes: 'always',
              formatOnPaste: true,
              bracketPairColorization: { enabled: true },
              padding: { top: 12 },
              readOnly: false,
              domReadOnly: false,
              contextmenu: true,
              lineNumbers: 'on',
              renderLineHighlight: 'all',
              cursorBlinking: 'smooth',
              cursorSmoothCaretAnimation: 'on',
              smoothScrolling: true,
            }}
          />
        </Suspense>
      </div>
      {showShortcuts && <EditorShortcuts editorRef={editorRef} />}
    </div>
  );
};

export default CodeEditor;
