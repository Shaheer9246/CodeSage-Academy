import Editor from '@monaco-editor/react';

interface CodeEditorProps {
  code: string;
  onChange: (value: string) => void;
  language?: string;
  theme?: 'vs-dark' | 'light';
  fontSize?: number;
}

const CodeEditor = ({ code, onChange, language = 'html', theme = 'vs-dark', fontSize = 14 }: CodeEditorProps) => {
  return (
    <Editor
      height="100%"
      language={language}
      value={code}
      onChange={(val) => onChange(val || '')}
      theme={theme}
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
  );
};

export default CodeEditor;
