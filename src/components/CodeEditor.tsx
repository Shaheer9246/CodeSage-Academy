import Editor from '@monaco-editor/react';
import { useRef } from 'react';
import EditorShortcuts from './EditorShortcuts';

interface CodeEditorProps {
  code: string;
  onChange: (value: string) => void;
  language?: string;
  theme?: 'vs-dark' | 'light';
  fontSize?: number;
  showShortcuts?: boolean;
}

const CodeEditor = ({ code, onChange, language = 'html', theme = 'vs-dark', fontSize = 14, showShortcuts = true }: CodeEditorProps) => {
  const editorRef = useRef<unknown>(null);

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 min-h-0">
        <Editor
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
      </div>
      {showShortcuts && <EditorShortcuts editorRef={editorRef} />}
    </div>
  );
};

export default CodeEditor;
