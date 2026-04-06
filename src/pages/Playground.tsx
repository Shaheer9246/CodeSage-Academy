import { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Upload, ArrowLeft, Play, Eye, EyeOff, Sun, Moon, ChevronLeft, ChevronRight, Plus, Trash2, Edit3, Check, X, FolderOpen, Save } from 'lucide-react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import CodeEditor from '@/components/CodeEditor';
import LivePreview from '@/components/LivePreview';
import ConsolePanel from '@/components/ConsolePanel';

interface FileItem {
  id: string;
  name: string;
  lang: string;
  content: string;
}

const DEFAULT_FILES: FileItem[] = [
  { id: 'html', name: 'index.html', lang: 'html', content: `<!DOCTYPE html>\n<html>\n<head>\n  <link rel="stylesheet" href="style.css">\n</head>\n<body>\n  <div style="text-align: center;">\n    <h1>🧠 CodeSage Playground</h1>\n    <p>Start coding in the editor!</p>\n    <p>Your changes appear here instantly.</p>\n  </div>\n  <script src="script.js"></script>\n</body>\n</html>` },
  { id: 'css', name: 'style.css', lang: 'css', content: `body {\n  font-family: Arial, sans-serif;\n  background: #0f0a2e;\n  color: white;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  min-height: 100vh;\n  margin: 0;\n}\nh1 { color: #e98a2e; }\np { color: #ccc; }` },
  { id: 'js', name: 'script.js', lang: 'javascript', content: `// Write your JavaScript here\nconsole.log("Hello from CodeSage!");` },
  { id: 'jsx', name: 'App.jsx', lang: 'javascript', content: `// React JSX reference\n// function App() {\n//   return <h1>Hello React!</h1>;\n// }` },
];

const Playground = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState<FileItem[]>(DEFAULT_FILES);
  const [activeFileId, setActiveFileId] = useState('html');
  const [consoleLogs, setConsoleLogs] = useState<{ type: string; message: string }[]>([]);
  const [showPreview, setShowPreview] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [editorTheme, setEditorTheme] = useState<'vs-dark' | 'light'>('vs-dark');
  const [fontSize, setFontSize] = useState(14);
  const [showSidebar, setShowSidebar] = useState(true);
  const [savedIndicator, setSavedIndicator] = useState(false);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [manualHtml, setManualHtml] = useState('');
  const [manualCss, setManualCss] = useState('');
  const [manualJs, setManualJs] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeFile = files.find(f => f.id === activeFileId) || files[0];
  const htmlFile = files.find(f => f.id === 'html');
  const cssFile = files.find(f => f.id === 'css');
  const jsFile = files.find(f => f.id === 'js');

  const currentHtml = htmlFile?.content || '';
  const currentCss = cssFile?.content || '';
  const currentJs = jsFile?.content || '';

  // Auto-refresh or manual
  useEffect(() => {
    if (autoRefresh) {
      setManualHtml(currentHtml);
      setManualCss(currentCss);
      setManualJs(currentJs);
    }
  }, [currentHtml, currentCss, currentJs, autoRefresh]);

  const handleRun = () => {
    setManualHtml(currentHtml);
    setManualCss(currentCss);
    setManualJs(currentJs);
  };

  const handleConsoleLog = useCallback((log: { type: string; message: string }) => {
    setConsoleLogs(prev => [...prev, log]);
  }, []);

  const updateFileContent = (val: string) => {
    setFiles(prev => prev.map(f => f.id === activeFileId ? { ...f, content: val } : f));
  };

  // Ctrl+S handler
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        setSavedIndicator(true);
        setTimeout(() => setSavedIndicator(false), 2000);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handleExport = () => {
    const blob = new Blob([currentHtml], { type: 'text/html' });
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
      const ext = file.name.split('.').pop() || '';
      const lang = ext === 'css' ? 'css' : ext === 'js' || ext === 'jsx' ? 'javascript' : 'html';
      const existingFile = files.find(f => f.name === file.name);
      if (existingFile) {
        setFiles(prev => prev.map(f => f.name === file.name ? { ...f, content } : f));
        setActiveFileId(existingFile.id);
      } else {
        const newFile: FileItem = { id: `custom-${Date.now()}`, name: file.name, lang, content };
        setFiles(prev => [...prev, newFile]);
        setActiveFileId(newFile.id);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const addNewFile = () => {
    const name = `file-${files.length + 1}.html`;
    const newFile: FileItem = { id: `custom-${Date.now()}`, name, lang: 'html', content: '' };
    setFiles(prev => [...prev, newFile]);
    setActiveFileId(newFile.id);
    setRenamingId(newFile.id);
    setRenameValue(name);
  };

  const deleteFile = (id: string) => {
    if (['html', 'css', 'js', 'jsx'].includes(id)) return; // don't delete defaults
    setFiles(prev => prev.filter(f => f.id !== id));
    if (activeFileId === id) setActiveFileId('html');
  };

  const startRename = (f: FileItem) => {
    setRenamingId(f.id);
    setRenameValue(f.name);
  };

  const confirmRename = () => {
    if (renamingId && renameValue.trim()) {
      const ext = renameValue.split('.').pop() || '';
      const lang = ext === 'css' ? 'css' : ext === 'js' || ext === 'jsx' ? 'javascript' : 'html';
      setFiles(prev => prev.map(f => f.id === renamingId ? { ...f, name: renameValue.trim(), lang } : f));
    }
    setRenamingId(null);
  };

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Top toolbar */}
      <header className="flex items-center justify-between px-2 py-1.5 backdrop-blur-xl bg-card/60 border-b border-border/30 gap-2 flex-shrink-0">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate('/dashboard')} className="text-muted-foreground hover:text-foreground transition-colors p-1">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button onClick={() => setShowSidebar(!showSidebar)} className="text-muted-foreground hover:text-foreground transition-colors p-1" title="Toggle sidebar">
            <FolderOpen className="w-4 h-4" />
          </button>
          <div className="w-5 h-5 bg-gradient-to-br from-primary to-accent rounded flex items-center justify-center">
            <span className="text-[7px] font-bold text-primary-foreground font-mono">&lt;/&gt;</span>
          </div>
          <span className="text-primary font-bold text-xs font-mono hidden sm:inline">Playground</span>
          {savedIndicator && (
            <span className="flex items-center gap-1 text-[10px] text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full animate-in fade-in">
              <Save className="w-3 h-3" /> Saved ✓
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {/* Font size */}
          <select value={fontSize} onChange={e => setFontSize(Number(e.target.value))}
            className="bg-secondary/40 border border-border/30 rounded text-[10px] text-muted-foreground px-1.5 py-1 focus:outline-none">
            {[12, 13, 14, 15, 16, 18, 20].map(s => <option key={s} value={s}>{s}px</option>)}
          </select>
          {/* Theme */}
          <button onClick={() => setEditorTheme(editorTheme === 'vs-dark' ? 'light' : 'vs-dark')}
            className="text-muted-foreground hover:text-foreground p-1 rounded hover:bg-secondary/30 transition-colors" title="Toggle theme">
            {editorTheme === 'vs-dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>
          {/* Auto-refresh toggle */}
          <button onClick={() => setAutoRefresh(!autoRefresh)}
            className={`text-[10px] px-2 py-1 rounded transition-colors ${autoRefresh ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            title={autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}>
            {autoRefresh ? 'Auto' : 'Manual'}
          </button>
          {!autoRefresh && (
            <button onClick={handleRun} className="flex items-center gap-1 text-[10px] bg-green-500/20 text-green-400 px-2 py-1 rounded hover:bg-green-500/30 transition-colors" title="Run code">
              <Play className="w-3 h-3" /> Run
            </button>
          )}
          {/* Preview toggle */}
          <button onClick={() => setShowPreview(!showPreview)}
            className="text-muted-foreground hover:text-foreground p-1 rounded hover:bg-secondary/30 transition-colors" title="Toggle preview">
            {showPreview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          </button>
          <div className="w-px h-4 bg-border/30 mx-1" />
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".html,.css,.js,.jsx,.ts,.tsx" className="hidden" />
          <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground px-1.5 py-1 rounded hover:bg-secondary/30 transition-colors">
            <Upload className="w-3 h-3" /> Import
          </button>
          <button onClick={handleExport} className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground px-1.5 py-1 rounded hover:bg-secondary/30 transition-colors">
            <Download className="w-3 h-3" /> Export
          </button>
        </div>
      </header>

      {/* Main content area */}
      <div className="flex-1 flex overflow-hidden">
        {/* File sidebar */}
        {showSidebar && (
          <div className="w-44 flex-shrink-0 border-r border-border/30 bg-card/30 backdrop-blur-sm flex flex-col">
            <div className="flex items-center justify-between px-2 py-1.5 border-b border-border/20">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Explorer</span>
              <button onClick={addNewFile} className="text-muted-foreground hover:text-foreground transition-colors" title="New file">
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto py-1">
              {files.map(f => (
                <div key={f.id}
                  className={`group flex items-center gap-1.5 px-2 py-1 text-[11px] cursor-pointer transition-colors ${
                    activeFileId === f.id ? 'bg-primary/10 text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/30'
                  }`}
                  onClick={() => setActiveFileId(f.id)}>
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    f.lang === 'html' ? 'bg-orange-400' : f.lang === 'css' ? 'bg-blue-400' : 'bg-yellow-400'
                  }`} />
                  {renamingId === f.id ? (
                    <div className="flex items-center gap-1 flex-1">
                      <input value={renameValue} onChange={e => setRenameValue(e.target.value)} autoFocus
                        className="flex-1 bg-secondary/60 border border-border/30 rounded px-1 py-0.5 text-[10px] text-foreground focus:outline-none"
                        onKeyDown={e => e.key === 'Enter' && confirmRename()} />
                      <button onClick={confirmRename}><Check className="w-3 h-3 text-green-400" /></button>
                      <button onClick={() => setRenamingId(null)}><X className="w-3 h-3 text-destructive" /></button>
                    </div>
                  ) : (
                    <>
                      <span className="flex-1 truncate font-mono">{f.name}</span>
                      <div className="hidden group-hover:flex items-center gap-0.5">
                        <button onClick={(e) => { e.stopPropagation(); startRename(f); }} className="text-muted-foreground hover:text-foreground">
                          <Edit3 className="w-2.5 h-2.5" />
                        </button>
                        {!['html', 'css', 'js', 'jsx'].includes(f.id) && (
                          <button onClick={(e) => { e.stopPropagation(); deleteFile(f.id); }} className="text-muted-foreground hover:text-destructive">
                            <Trash2 className="w-2.5 h-2.5" />
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Editor + Preview */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* File tabs */}
          <div className="flex items-center border-b border-border/30 bg-card/20 backdrop-blur-sm overflow-x-auto flex-shrink-0">
            {files.map(f => (
              <button key={f.id} onClick={() => setActiveFileId(f.id)}
                className={`px-3 py-1.5 text-[10px] font-mono transition-colors border-b-2 flex-shrink-0 ${
                  activeFileId === f.id ? 'text-foreground border-primary bg-background/50' : 'text-muted-foreground border-transparent hover:text-foreground hover:bg-secondary/20'
                }`}>
                {f.name}
              </button>
            ))}
          </div>

          {/* Editor + Preview resizable */}
          {showPreview ? (
            <ResizablePanelGroup direction="horizontal" className="flex-1">
              <ResizablePanel defaultSize={50} minSize={25}>
                <div className="h-full flex flex-col">
                  <div className="flex-1 min-h-0">
                    <CodeEditor code={activeFile.content} onChange={updateFileContent} language={activeFile.lang} theme={editorTheme} fontSize={fontSize} />
                  </div>
                  <ConsolePanel logs={consoleLogs} onClear={() => setConsoleLogs([])} />
                </div>
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={50} minSize={20}>
                <div className="h-full flex flex-col">
                  <div className="px-3 py-1.5 border-b border-border/30 text-[10px] text-muted-foreground font-mono flex items-center gap-2 bg-card/20 backdrop-blur-sm flex-shrink-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> Preview
                    {!autoRefresh && <span className="text-[8px] text-yellow-400">(manual)</span>}
                  </div>
                  <div className="flex-1 min-h-0">
                    <LivePreview html={autoRefresh ? currentHtml : manualHtml} css={autoRefresh ? currentCss : manualCss} js={autoRefresh ? currentJs : manualJs} onConsoleLog={handleConsoleLog} />
                  </div>
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          ) : (
            <div className="flex-1 flex flex-col">
              <div className="flex-1 min-h-0">
                <CodeEditor code={activeFile.content} onChange={updateFileContent} language={activeFile.lang} theme={editorTheme} fontSize={fontSize} />
              </div>
              <ConsolePanel logs={consoleLogs} onClear={() => setConsoleLogs([])} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Playground;
