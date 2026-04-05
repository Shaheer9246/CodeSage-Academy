import { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Upload, ArrowLeft } from 'lucide-react';
import CodeEditor from '@/components/CodeEditor';
import LivePreview from '@/components/LivePreview';
import ConsolePanel from '@/components/ConsolePanel';

const DEFAULT_HTML = `<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div style="text-align: center;">
    <h1>🧠 CodeSage Playground</h1>
    <p>Start coding in the editor!</p>
    <p>Your changes appear here instantly.</p>
  </div>
  <script src="script.js"></script>
</body>
</html>`;

const DEFAULT_CSS = `body {
  font-family: Arial, sans-serif;
  background: #0f0a2e;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  margin: 0;
}
h1 { color: #e98a2e; }
p { color: #ccc; }`;

const DEFAULT_JS = `// Write your JavaScript here
console.log("Hello from CodeSage!");`;

type FileTab = 'html' | 'css' | 'js' | 'jsx';

const FILE_TABS: { id: FileTab; label: string; lang: string }[] = [
  { id: 'html', label: 'index.html', lang: 'html' },
  { id: 'css', label: 'style.css', lang: 'css' },
  { id: 'js', label: 'script.js', lang: 'javascript' },
  { id: 'jsx', label: 'App.jsx', lang: 'javascript' },
];

const Playground = () => {
  const navigate = useNavigate();
  const [fileTab, setFileTab] = useState<FileTab>('html');
  const [htmlCode, setHtmlCode] = useState(DEFAULT_HTML);
  const [cssCode, setCssCode] = useState(DEFAULT_CSS);
  const [jsCode, setJsCode] = useState(DEFAULT_JS);
  const [jsxCode, setJsxCode] = useState('// React JSX reference\n// function App() {\n//   return <h1>Hello React!</h1>;\n// }');
  const [consoleLogs, setConsoleLogs] = useState<{ type: string; message: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentCode = fileTab === 'html' ? htmlCode : fileTab === 'css' ? cssCode : fileTab === 'js' ? jsCode : jsxCode;
  const setCurrentCode = (val: string) => {
    if (fileTab === 'html') setHtmlCode(val);
    else if (fileTab === 'css') setCssCode(val);
    else if (fileTab === 'js') setJsCode(val);
    else setJsxCode(val);
  };

  const handleConsoleLog = useCallback((log: { type: string; message: string }) => {
    setConsoleLogs(prev => [...prev, log]);
  }, []);

  const handleExport = () => {
    const blob = new Blob([htmlCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'code.html'; a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const content = ev.target?.result as string;
      if (file.name.endsWith('.css')) { setCssCode(content); setFileTab('css'); }
      else if (file.name.endsWith('.js') || file.name.endsWith('.jsx')) { setJsCode(content); setFileTab('js'); }
      else { setHtmlCode(content); setFileTab('html'); }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <header className="flex items-center justify-between px-3 py-2 glass-card border-b border-border">
        <div className="flex items-center gap-2.5">
          <button onClick={() => navigate('/dashboard')} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="w-6 h-6 bg-gradient-to-br from-primary to-accent rounded-md flex items-center justify-center">
            <span className="text-[8px] font-bold text-primary-foreground font-mono">&lt;/&gt;</span>
          </div>
          <span className="text-primary font-bold text-sm font-mono">Playground</span>
        </div>
        <div className="flex items-center gap-1">
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".html,.css,.js,.jsx" className="hidden" />
          <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground px-2 py-1.5 rounded hover:bg-secondary/50 transition-colors">
            <Upload className="w-3 h-3" /> Import
          </button>
          <button onClick={handleExport} className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground px-2 py-1.5 rounded hover:bg-secondary/50 transition-colors">
            <Download className="w-3 h-3" /> Export
          </button>
        </div>
      </header>

      <div className="flex-1 flex flex-col sm:flex-row overflow-hidden">
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex items-center border-b border-border glass-card">
            {FILE_TABS.map(ft => (
              <button key={ft.id} onClick={() => setFileTab(ft.id)}
                className={`px-3 py-2 text-[10px] font-mono transition-colors border-b-2 ${
                  fileTab === ft.id ? 'text-foreground border-primary bg-background' : 'text-muted-foreground border-transparent hover:text-foreground hover:bg-secondary/20'
                }`}>
                {ft.label}
              </button>
            ))}
          </div>
          <div className="flex-1 min-h-0">
            <CodeEditor code={currentCode} onChange={setCurrentCode} language={FILE_TABS.find(f => f.id === fileTab)?.lang || 'html'} />
          </div>
          <ConsolePanel logs={consoleLogs} onClear={() => setConsoleLogs([])} />
        </div>

        <div className="flex-1 flex flex-col min-w-0 border-t sm:border-t-0 sm:border-l border-border">
          <div className="px-3 py-2 border-b border-border text-[10px] text-muted-foreground font-mono flex items-center gap-2 glass-card">
            <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" /> Preview
          </div>
          <div className="flex-1 min-h-0">
            <LivePreview html={htmlCode} css={cssCode} js={jsCode} onConsoleLog={handleConsoleLog} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Playground;
