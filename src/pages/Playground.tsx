import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Upload, ArrowLeft, Play, Eye, EyeOff, Sun, Moon, Plus, Trash2, Edit3, Check, X, FolderOpen, Save, AlertTriangle, Files, Code as CodeIcon, History, Layers, FileText } from 'lucide-react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import CodeEditor from '@/components/CodeEditor';
import LivePreview from '@/components/LivePreview';
import ConsolePanel from '@/components/ConsolePanel';
import { useIsMobile } from '@/hooks/use-mobile';
import JSZip from 'jszip';
import { downloadTextFile } from '@/lib/downloadHelper';
import { toast } from 'sonner';

interface FileItem { id: string; name: string; lang: string; content: string; }
interface RecentSnapshot { id: string; name: string; date: string; html: string; css: string; js: string; }

const DEFAULT_FILES: FileItem[] = [
  { id: 'html', name: 'index.html', lang: 'html', content: `<!DOCTYPE html>\n<html>\n<head>\n  <link rel="stylesheet" href="style.css">\n</head>\n<body>\n  <div style="text-align:center;">\n    <h1>🧠 CodeSage Playground</h1>\n    <p>Start coding!</p>\n  </div>\n  <script src="script.js"></script>\n</body>\n</html>` },
  { id: 'css', name: 'style.css', lang: 'css', content: `body {\n  font-family: Arial, sans-serif;\n  background: #0f0a2e;\n  color: white;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  min-height: 100vh;\n  margin: 0;\n}\nh1 { color: #22c55e; }\np { color: #ccc; }` },
  { id: 'js', name: 'script.js', lang: 'javascript', content: `console.log("Hello from CodeSage!");` },
];

const RECENT_KEY = 'codesage_playground_recent';

type MobileTab = 'files' | 'code' | 'preview' | 'recent';

const Playground = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [files, setFiles] = useState<FileItem[]>(DEFAULT_FILES);
  const [activeFileId, setActiveFileId] = useState('html');
  const [consoleLogs, setConsoleLogs] = useState<{ type: string; message: string }[]>([]);
  const [showPreview, setShowPreview] = useState(true);
  const [editorTheme, setEditorTheme] = useState<'vs-dark' | 'light'>('vs-dark');
  const [fontSize, setFontSize] = useState(14);
  const [showSidebar, setShowSidebar] = useState(true);
  const [savedIndicator, setSavedIndicator] = useState(false);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [mobileTab, setMobileTab] = useState<MobileTab>('code');
  const [recents, setRecents] = useState<RecentSnapshot[]>([]);
  // NEW: single vs multi file mode + custom preview source
  const [multiMode, setMultiMode] = useState<boolean>(() => {
    try { return localStorage.getItem('codesage_pg_multi') !== '0'; } catch { return true; }
  });
  const [layoutMode, setLayoutMode] = useState<'single' | 'split'>('single');
  const [previewSrcId, setPreviewSrcId] = useState<string>('html'); // which HTML file to preview
  const fileInputRef = useRef<HTMLInputElement>(null);
  const zipInputRef = useRef<HTMLInputElement>(null);

  const activeFile = files.find(f => f.id === activeFileId) || files[0];
  const currentHtml = files.find(f => f.id === previewSrcId)?.content
                   || files.find(f => f.id === 'html')?.content || '';
  const currentCss = files.find(f => f.id === 'css')?.content || '';
  const currentJs = files.find(f => f.id === 'js')?.content || '';

  const [debouncedHtml, setDebouncedHtml] = useState(currentHtml);
  const [debouncedCss, setDebouncedCss] = useState(currentCss);
  const [debouncedJs, setDebouncedJs] = useState(currentJs);

 useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedHtml(currentHtml);
      setDebouncedCss(currentCss);
      setDebouncedJs(currentJs);
    }, 150); // Reduced to 150ms for snappy live updates

    return () => clearTimeout(handler);
  }, [currentHtml, currentCss, currentJs]);

  // Toggle multi-file mode persistence
  useEffect(() => {
    try {
      localStorage.setItem('codesage_pg_multi', multiMode ? '1' : '0');
    } catch (error) {
      console.warn('Unable to persist playground mode', error);
    }
    if (!multiMode) setShowSidebar(false);
  }, [multiMode]);

  // List of HTML-ish files for "Preview source" selector
  const htmlFiles = useMemo(() => files.filter(f => f.lang === 'html' || f.name.endsWith('.html')), [files]);

  // Load recents
  useEffect(() => {
    try {
      const raw = localStorage.getItem(RECENT_KEY);
      if (raw) setRecents(JSON.parse(raw));
    } catch (error) {
      console.warn('Unable to load recent playground snapshots', error);
    }
  }, []);

  // Auto-save snapshot every 30s of edits
  const lastSaveRef = useRef(0);
  useEffect(() => {
    const t = setTimeout(() => {
      const now = Date.now();
      if (now - lastSaveRef.current < 25000) return;
      lastSaveRef.current = now;
      const snap: RecentSnapshot = {
        id: crypto.randomUUID(),
        name: `Auto-save ${new Date().toLocaleTimeString()}`,
        date: new Date().toISOString(),
        html: currentHtml, css: currentCss, js: currentJs,
      };
      const next = [snap, ...recents].slice(0, 10);
      setRecents(next);
      try {
        localStorage.setItem(RECENT_KEY, JSON.stringify(next));
      } catch (error) {
        console.warn('Unable to save recent playground snapshot', error);
      }
    }, 30000);
    return () => clearTimeout(t);
  }, [currentHtml, currentCss, currentJs, recents]);

  const handleConsoleLog = useCallback((log: { type: string; message: string }) => {
    setConsoleLogs(prev => [...prev, log]);
  }, []);

  const updateFileContent = (val: string) => {
    setFiles(prev => prev.map(f => f.id === activeFileId ? { ...f, content: val } : f));
  };

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
    try {
      const fullHtml = `<!DOCTYPE html><html><head><style>${currentCss}</style></head><body>${currentHtml.replace(/<!DOCTYPE[^>]*>|<\/?html[^>]*>|<head>[\s\S]*?<\/head>|<\/?body[^>]*>/gi, '')}<script>${currentJs}</script></body></html>`;
      const filename = `codesage-${Date.now()}.html`;
      const success = downloadTextFile(fullHtml, filename, 'text/html');
      if (success) {
        toast.success(`Exported ${filename}`);
      } else {
        toast.error('Unable to download file. Please check browser permissions.');
      }
    } catch (err) {
      console.error('Export error:', err);
      toast.error('Unable to download file.');
    }
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

// ZIP upload — extract text-like files, 3D models, and resolve relative paths
const handleZipChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;
  try {
    const buf = await file.arrayBuffer();
    const zip = await JSZip.loadAsync(buf);
    const added: FileItem[] = [];
    const entries = Object.values(zip.files).filter((z) => !z.dir);

    // Pre-extract binary/texture Data URIs for GLTF cross-referencing
    const assetMap: Record<string, string> = {};
    for (const z of entries) {
      const name = z.name.split('/').pop() || z.name;
      const ext = name.split('.').pop()?.toLowerCase() || '';
      if (['glb', 'png', 'jpg', 'jpeg', 'webp', 'bin'].includes(ext)) {
        const base64 = await z.async('base64');
        const mime = ext === 'glb' ? 'model/gltf-binary' : ext === 'bin' ? 'application/octet-stream' : `image/${ext}`;
        assetMap[name] = `data:${mime};base64,${base64}`;
      }
    }

    for (const z of entries) {
      const name = z.name.split('/').pop() || z.name;
      const ext = name.split('.').pop()?.toLowerCase() || '';
      const textExts = ['html', 'htm', 'css', 'js', 'jsx', 'ts', 'tsx', 'json', 'md', 'txt', 'svg', 'gltf'];
      const binaryExts = ['glb', 'png', 'jpg', 'jpeg', 'webp'];

      if (!textExts.includes(ext) && !binaryExts.includes(ext)) continue;

      let content = '';
      let lang = 'html';

      if (ext === 'gltf') {
        // Resolve relative URIs inside .gltf JSON files to Base64 Data URIs
        let gltfJson = await z.async('string');
        Object.entries(assetMap).forEach(([assetName, dataUri]) => {
          gltfJson = gltfJson.split(`"${assetName}"`).join(`"${dataUri}"`);
        });
        content = gltfJson;
        lang = 'json';
      } else if (textExts.includes(ext)) {
        content = await z.async('string');
        lang = ext === 'css' ? 'css' : ['js', 'jsx', 'ts', 'tsx'].includes(ext) ? 'javascript' : ext === 'json' ? 'json' : 'html';
      } else if (binaryExts.includes(ext)) {
        content = assetMap[name] || `data:image/${ext};base64,${await z.async('base64')}`;
        lang = 'binary';
      }

      added.push({ id: `zip-${Date.now()}-${name}`, name, lang, content });
    }

    if (added.length === 0) {
      alert('No valid files found in zip.');
      return;
    }
    setFiles(prev => [...prev, ...added]);
    setMultiMode(true);
    setShowSidebar(true);
  } catch (err) {
    console.error(err);
    alert('Could not read this zip file.');
  }
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
    if (['html', 'css', 'js'].includes(id)) return;
    setFiles(prev => prev.filter(f => f.id !== id));
    if (activeFileId === id) setActiveFileId('html');
    if (previewSrcId === id) setPreviewSrcId('html');
  };

  const startRename = (f: FileItem) => { setRenamingId(f.id); setRenameValue(f.name); };
  const confirmRename = () => {
    if (renamingId && renameValue.trim()) {
      const ext = renameValue.split('.').pop() || '';
      const lang = ext === 'css' ? 'css' : ext === 'js' || ext === 'jsx' ? 'javascript' : 'html';
      setFiles(prev => prev.map(f => f.id === renamingId ? { ...f, name: renameValue.trim(), lang } : f));
    }
    setRenamingId(null);
  };

  const loadRecent = (snap: RecentSnapshot) => {
    setFiles(prev => prev.map(f => {
      if (f.id === 'html') return { ...f, content: snap.html };
      if (f.id === 'css') return { ...f, content: snap.css };
      if (f.id === 'js') return { ...f, content: snap.js };
      return f;
    }));
    setMobileTab('code');
  };

  const exportRecent = (snap: RecentSnapshot) => {
    try {
      const fullHtml = `<!DOCTYPE html><html><head><style>${snap.css}</style></head><body>${snap.html}<script>${snap.js}</script></body></html>`;
      const filename = `${snap.name.replace(/\s/g, '-')}.html`;
      const success = downloadTextFile(fullHtml, filename, 'text/html');
      if (success) {
        toast.success(`Exported ${filename}`);
      } else {
        toast.error('Unable to download file.');
      }
    } catch (err) {
      console.error('Export recent error:', err);
      toast.error('Unable to download file.');
    }
  };

  const deleteRecent = (id: string) => {
    const next = recents.filter(r => r.id !== id);
    setRecents(next);
    try {
      localStorage.setItem(RECENT_KEY, JSON.stringify(next));
    } catch (error) {
      console.warn('Unable to update recent playground snapshots', error);
    }
  };

  const clearRecents = () => {
    if (!confirm('Clear all auto-saved snapshots?')) return;
    setRecents([]);
    try {
      localStorage.removeItem(RECENT_KEY);
    } catch (error) {
      console.warn('Unable to clear recent playground snapshots', error);
    }
  };

  // ===== MOBILE LAYOUT =====
  if (isMobile) {
    return (
      <div className="h-screen flex flex-col bg-background overflow-hidden">
        <header className="flex items-center justify-between px-3 py-2 backdrop-blur-xl bg-card/60 border-b border-border/30 flex-shrink-0">
          <div className="flex items-center gap-2">
            <button onClick={() => navigate('/dashboard')} className="text-muted-foreground p-1">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <span className="text-primary font-bold text-xs font-mono">Playground</span>
            {savedIndicator && (
              <span className="flex items-center gap-1 text-[10px] text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full">
                <Save className="w-3 h-3" /> Saved
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <button onClick={handleExport} className="flex items-center gap-1 text-[10px] bg-primary/15 text-primary px-2 py-1 rounded">
              <Download className="w-3 h-3" /> Export
            </button>
          </div>
        </header>



        <div className="flex-1 overflow-hidden flex flex-col">
          {/* FILES */}
          {mobileTab === 'files' && (
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Files</span>
                <div className="flex gap-1">
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".html,.css,.js" className="hidden" />
                  <input type="file" ref={zipInputRef} onChange={handleZipChange} accept=".zip,application/zip,application/x-zip-compressed,application/octet-stream" className="hidden" />
                  <button onClick={() => fileInputRef.current?.click()} className="text-[10px] flex items-center gap-1 text-muted-foreground bg-secondary/40 px-2 py-1 rounded">
                    <Upload className="w-3 h-3" /> Import
                  </button>
                  <button onClick={() => zipInputRef.current?.click()} className="text-[10px] flex items-center gap-1 text-muted-foreground bg-secondary/40 px-2 py-1 rounded">
                    <FileText className="w-3 h-3" /> ZIP
                  </button>
                  <button onClick={addNewFile} className="text-[10px] flex items-center gap-1 text-primary bg-primary/10 px-2 py-1 rounded">
                    <Plus className="w-3 h-3" /> New
                  </button>
                </div>
              </div>
              {files.map(f => (
                <div key={f.id} className={`flex items-center gap-2 p-3 rounded-xl border transition-colors ${
                  activeFileId === f.id ? 'bg-primary/10 border-primary/40' : 'bg-secondary/20 border-border/30'
                }`}>
                  <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                    f.lang === 'html' ? 'bg-orange-400' : f.lang === 'css' ? 'bg-blue-400' : 'bg-yellow-400'
                  }`} />
                  {renamingId === f.id ? (
                    <div className="flex items-center gap-1 flex-1">
                      <input value={renameValue} onChange={e => setRenameValue(e.target.value)} autoFocus
                        className="flex-1 bg-secondary/60 border border-border/30 rounded px-2 py-1 text-xs text-foreground"
                        onKeyDown={e => e.key === 'Enter' && confirmRename()} />
                      <button onClick={confirmRename}><Check className="w-4 h-4 text-green-400" /></button>
                      <button onClick={() => setRenamingId(null)}><X className="w-4 h-4 text-destructive" /></button>
                    </div>
                  ) : (
                    <>
                      <button onClick={() => { setActiveFileId(f.id); setMobileTab('code'); }} className="flex-1 text-left">
                        <p className="text-sm font-mono text-foreground truncate">{f.name}</p>
                        <p className="text-[9px] text-muted-foreground">{f.lang}</p>
                      </button>
                      <button onClick={() => startRename(f)} className="p-1 text-muted-foreground"><Edit3 className="w-3.5 h-3.5" /></button>
                      {!['html', 'css', 'js'].includes(f.id) && (
                        <button onClick={() => deleteFile(f.id)} className="p-1 text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          )}

         {/* CODE */}
          {mobileTab === 'code' && (
            <div className="flex-1 flex flex-col min-h-0">
              {/* File Tabs + Preview Selector + Theme Controls */}
              <div className="flex items-center justify-between border-b border-border/30 bg-card/30 flex-shrink-0 px-2 py-1 gap-1">
                {/* File Tabs */}
                <div className="flex items-center overflow-x-auto gap-1 scrollbar-none flex-1 min-w-0">
                  {files.map(f => (
                    <button key={f.id} onClick={() => setActiveFileId(f.id)}
                      className={`px-2.5 py-1 text-[10px] font-mono whitespace-nowrap rounded-t border-b-2 flex-shrink-0 ${
                        activeFileId === f.id ? 'text-foreground border-primary bg-background/60 font-semibold' : 'text-muted-foreground border-transparent hover:text-foreground'
                      }`}>{f.name}</button>
                  ))}
                </div>

                {/* Right Actions: Preview Source Selector, Font Size, Theme */}
                <div className="flex items-center gap-1.5 flex-shrink-0 pl-1 border-l border-border/20">
                  {/* HTML Preview Selector (Appears if you have multiple HTML files) */}
                  {htmlFiles.length > 1 && (
                    <select value={previewSrcId} onChange={e => setPreviewSrcId(e.target.value)} title="Preview source file"
                      className="bg-primary/10 border border-primary/30 text-primary rounded text-[9px] font-semibold px-1 py-0.5 focus:outline-none">
                      {htmlFiles.map(f => <option key={f.id} value={f.id}>👁️ {f.name}</option>)}
                    </select>
                  )}

                  {/* Font Size Selector */}
                  <select value={fontSize} onChange={e => setFontSize(Number(e.target.value))}
                    className="bg-secondary/40 border border-border/30 rounded text-[9px] text-muted-foreground px-1 py-0.5 focus:outline-none">
                    {[12, 13, 14, 15, 16, 18, 20].map(s => <option key={s} value={s}>{s}px</option>)}
                  </select>

                  {/* Theme Toggle */}
                  <button onClick={() => setEditorTheme(editorTheme === 'vs-dark' ? 'light' : 'vs-dark')}
                    className="text-muted-foreground hover:text-foreground p-1 rounded bg-secondary/30" title="Toggle Theme">
                    {editorTheme === 'vs-dark' ? <Sun className="w-3 h-3 text-yellow-400" /> : <Moon className="w-3 h-3" />}
                  </button>
                </div>
              </div>

              <div className="flex-1 min-h-0">
                <CodeEditor code={activeFile.content} onChange={updateFileContent} language={activeFile.lang} theme={editorTheme} fontSize={fontSize} />
              </div>
              <ConsolePanel logs={consoleLogs} onClear={() => setConsoleLogs([])} />
            </div>
          )}

          {/* PREVIEW TAB */}
          <div className={`flex-1 flex-col min-h-0 ${mobileTab === 'preview' ? 'flex' : 'hidden'}`}>
            <div className="px-3 py-1.5 border-b border-border/30 text-[10px] text-muted-foreground font-mono flex items-center justify-between bg-card/20 flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span>Live Preview</span>
              </div>

              {/* Preview Source Selector (Appears when you add/import multiple HTML files) */}
              {htmlFiles.length > 1 && (
                <select value={previewSrcId} onChange={e => setPreviewSrcId(e.target.value)} title="Preview source file"
                  className="bg-secondary/60 border border-primary/40 rounded text-[10px] text-primary font-semibold px-2 py-0.5 focus:outline-none">
                  {htmlFiles.map(f => <option key={f.id} value={f.id}>▶ {f.name}</option>)}
                </select>
              )}
            </div>
            <div className="flex-1 min-h-0">
              <LivePreview html={debouncedHtml} css={debouncedCss} js={debouncedJs} onConsoleLog={handleConsoleLog} />
            </div>
          </div>

          {/* RECENT */}
          {mobileTab === 'recent' && (
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-3 flex items-start gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div className="text-[11px] text-yellow-200/90 leading-relaxed">
                  <strong>Heads up:</strong> Recent snapshots are saved in your browser cache only.
                  Clearing site data will erase them. <strong>Export</strong> anything you want to keep.
                </div>
              </div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Auto-saved ({recents.length})
                </span>
                {recents.length > 0 && (
                  <button onClick={clearRecents} className="text-[10px] text-destructive">Clear all</button>
                )}
              </div>
              {recents.length === 0 && (
                <div className="text-center py-8 text-xs text-muted-foreground">
                  No snapshots yet. Keep coding — auto-saves every 30s.
                </div>
              )}
              {recents.map(r => (
                <div key={r.id} className="bg-secondary/20 border border-border/30 rounded-xl p-3 space-y-2">
                  <div>
                    <p className="text-xs font-semibold text-foreground truncate">{r.name}</p>
                    <p className="text-[9px] text-muted-foreground">{new Date(r.date).toLocaleString()}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => loadRecent(r)} className="flex-1 bg-primary/15 text-primary text-[11px] font-semibold py-1.5 rounded">
                      Load
                    </button>
                    <button onClick={() => exportRecent(r)} className="flex-1 bg-secondary/40 text-foreground text-[11px] font-semibold py-1.5 rounded flex items-center justify-center gap-1">
                      <Download className="w-3 h-3" /> Export
                    </button>
                    <button onClick={() => deleteRecent(r.id)} className="bg-destructive/15 text-destructive p-1.5 rounded">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* MOBILE BOTTOM TABS */}
        <nav className="flex border-t border-border/30 bg-card/80 backdrop-blur-xl flex-shrink-0">
          {[
            { key: 'files' as MobileTab,   icon: Files,    label: 'Files' },
            { key: 'code' as MobileTab,    icon: CodeIcon, label: 'Code' },
            { key: 'preview' as MobileTab, icon: Eye,      label: 'Preview' },
            { key: 'recent' as MobileTab,  icon: History,  label: 'Recent' },
          ].map(t => {
            const active = mobileTab === t.key;
            return (
              <button key={t.key} onClick={() => setMobileTab(t.key)}
                className={`flex-1 flex flex-col items-center gap-0.5 py-2 ${active ? 'text-primary' : 'text-muted-foreground'}`}>
                <t.icon className={`w-4 h-4 ${active ? 'drop-shadow-[0_0_6px_hsl(var(--primary))]' : ''}`} />
                <span className="text-[9px] font-medium">{t.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    );
  }

  // ===== DESKTOP LAYOUT (unchanged behavior) =====
  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <header className="flex items-center justify-between px-2 py-1.5 backdrop-blur-xl bg-card/60 border-b border-border/30 gap-2 flex-shrink-0">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate('/dashboard')} className="text-muted-foreground hover:text-foreground p-1">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button onClick={() => setShowSidebar(!showSidebar)} className="text-muted-foreground hover:text-foreground p-1">
            <FolderOpen className="w-4 h-4" />
          </button>
          <div className="w-5 h-5 bg-gradient-to-br from-primary to-accent rounded flex items-center justify-center">
            <span className="text-[7px] font-bold text-primary-foreground font-mono">&lt;/&gt;</span>
          </div>
          <span className="text-primary font-bold text-xs font-mono">Playground</span>
          {savedIndicator && (
            <span className="flex items-center gap-1 text-[10px] text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full">
              <Save className="w-3 h-3" /> Saved ✓
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <select value={fontSize} onChange={e => setFontSize(Number(e.target.value))}
            className="bg-secondary/40 border border-border/30 rounded text-[10px] text-muted-foreground px-1.5 py-1 focus:outline-none">
            {[12, 13, 14, 15, 16, 18, 20].map(s => <option key={s} value={s}>{s}px</option>)}
          </select>
          <button onClick={() => setEditorTheme(editorTheme === 'vs-dark' ? 'light' : 'vs-dark')}
            className="text-muted-foreground hover:text-foreground p-1 rounded hover:bg-secondary/30">
            {editorTheme === 'vs-dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>
          <button onClick={() => setShowPreview(!showPreview)}
            className="text-muted-foreground hover:text-foreground p-1 rounded hover:bg-secondary/30">
            {showPreview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          </button>
          <div className="w-px h-4 bg-border/30 mx-1" />
          <button onClick={() => setMultiMode(m => !m)} title={multiMode ? 'Switch to single-file mode' : 'Switch to multi-file mode'}
            className={`flex items-center gap-1 text-[10px] px-1.5 py-1 rounded ${multiMode ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:bg-secondary/30'}`}>
            <Layers className="w-3 h-3" /> {multiMode ? 'Multi' : 'Single'}
          </button>
          <button onClick={() => setLayoutMode(layoutMode === 'split' ? 'single' : 'split')} title="Toggle 3-file split view"
            className={`flex items-center gap-1 text-[10px] px-1.5 py-1 rounded ${layoutMode === 'split' ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:bg-secondary/30'}`}>
            <Layers className="w-3 h-3" /> {layoutMode === 'split' ? 'Split View' : 'Tab View'}
          </button>
          {htmlFiles.length > 1 && (
            <select value={previewSrcId} onChange={e => setPreviewSrcId(e.target.value)} title="Preview source"
              className="bg-secondary/40 border border-border/30 rounded text-[10px] text-muted-foreground px-1.5 py-1 focus:outline-none">
              {htmlFiles.map(f => <option key={f.id} value={f.id}>▶ {f.name}</option>)}
            </select>
          )}
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".html,.css,.js,.jsx" className="hidden" />
          <input type="file" ref={zipInputRef} onChange={handleZipChange} accept=".zip,application/zip,application/x-zip-compressed,application/octet-stream" className="hidden" />
          <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground px-1.5 py-1 rounded hover:bg-secondary/30">
            <Upload className="w-3 h-3" /> Import
          </button>
          <button onClick={() => zipInputRef.current?.click()} title="Upload project ZIP"
            className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground px-1.5 py-1 rounded hover:bg-secondary/30">
            <FileText className="w-3 h-3" /> ZIP
          </button>
          <button onClick={handleExport} className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground px-1.5 py-1 rounded hover:bg-secondary/30">
            <Download className="w-3 h-3" /> Export
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {showSidebar && (
          <div className="w-44 flex-shrink-0 border-r border-border/30 bg-card/30 backdrop-blur-sm flex flex-col">
            <div className="flex items-center justify-between px-2 py-1.5 border-b border-border/20">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Explorer</span>
              <button onClick={addNewFile} className="text-muted-foreground hover:text-foreground"><Plus className="w-3.5 h-3.5" /></button>
            </div>
            <div className="flex-1 overflow-y-auto py-1">
              {files.map(f => (
                <div key={f.id}
                  className={`group flex items-center gap-1.5 px-2 py-1 text-[11px] cursor-pointer ${
                    activeFileId === f.id ? 'bg-primary/10 text-foreground' : 'text-muted-foreground hover:bg-secondary/30'
                  }`}
                  onClick={() => setActiveFileId(f.id)}>
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    f.lang === 'html' ? 'bg-orange-400' : f.lang === 'css' ? 'bg-blue-400' : 'bg-yellow-400'
                  }`} />
                  {renamingId === f.id ? (
                    <div className="flex items-center gap-1 flex-1">
                      <input value={renameValue} onChange={e => setRenameValue(e.target.value)} autoFocus
                        className="flex-1 bg-secondary/60 border border-border/30 rounded px-1 py-0.5 text-[10px] text-foreground"
                        onKeyDown={e => e.key === 'Enter' && confirmRename()} />
                      <button onClick={confirmRename}><Check className="w-3 h-3 text-green-400" /></button>
                      <button onClick={() => setRenamingId(null)}><X className="w-3 h-3 text-destructive" /></button>
                    </div>
                  ) : (
                    <>
                      <span className="flex-1 truncate font-mono">{f.name}</span>
                      <div className="hidden group-hover:flex items-center gap-0.5">
                        <button onClick={(e) => { e.stopPropagation(); startRename(f); }}><Edit3 className="w-2.5 h-2.5" /></button>
                        {!['html', 'css', 'js'].includes(f.id) && (
                          <button onClick={(e) => { e.stopPropagation(); deleteFile(f.id); }}><Trash2 className="w-2.5 h-2.5 text-destructive" /></button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

       <div className="flex-1 flex flex-col min-w-0">
          {/* Only show tabs if we are in 'single' mode */}
          {layoutMode === 'single' && (
            <div className="flex items-center border-b border-border/30 bg-card/20 backdrop-blur-sm overflow-x-auto flex-shrink-0">
              {files.map(f => (
                <button key={f.id} onClick={() => setActiveFileId(f.id)}
                  className={`px-3 py-1.5 text-[10px] font-mono border-b-2 flex-shrink-0 ${
                    activeFileId === f.id ? 'text-foreground border-primary bg-background/50' : 'text-muted-foreground border-transparent hover:bg-secondary/20'
                  }`}>{f.name}</button>
              ))}
            </div>
          )}

          {showPreview ? (
            <ResizablePanelGroup direction="horizontal" className="flex-1">
              <ResizablePanel defaultSize={50} minSize={25}>
                <div className="h-full flex flex-col bg-background">
                  <div className="flex-1 min-h-0">
                    {layoutMode === 'split' ? (
                      <div className="h-full flex flex-col xl:flex-row gap-1 p-1 overflow-hidden">
                        <div className="flex-1 border border-border/30 flex flex-col min-h-0 rounded overflow-hidden">
                          <div className="text-[10px] px-2 py-1 bg-card/40 border-b border-border/30 text-muted-foreground">index.html</div>
                          <CodeEditor code={currentHtml} onChange={(v) => setFiles(p => p.map(f => f.id === 'html' ? { ...f, content: v } : f))} language="html" theme={editorTheme} fontSize={fontSize} />
                        </div>
                        <div className="flex-1 border border-border/30 flex flex-col min-h-0 rounded overflow-hidden">
                          <div className="text-[10px] px-2 py-1 bg-card/40 border-b border-border/30 text-muted-foreground">style.css</div>
                          <CodeEditor code={currentCss} onChange={(v) => setFiles(p => p.map(f => f.id === 'css' ? { ...f, content: v } : f))} language="css" theme={editorTheme} fontSize={fontSize} />
                        </div>
                        <div className="flex-1 border border-border/30 flex flex-col min-h-0 rounded overflow-hidden">
                          <div className="text-[10px] px-2 py-1 bg-card/40 border-b border-border/30 text-muted-foreground">script.js</div>
                          <CodeEditor code={currentJs} onChange={(v) => setFiles(p => p.map(f => f.id === 'js' ? { ...f, content: v } : f))} language="javascript" theme={editorTheme} fontSize={fontSize} />
                        </div>
                      </div>
                    ) : (
                      <CodeEditor code={activeFile.content} onChange={updateFileContent} language={activeFile.lang} theme={editorTheme} fontSize={fontSize} />
                    )}
                  </div>
                  <ConsolePanel logs={consoleLogs} onClear={() => setConsoleLogs([])} />
                </div>
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={50} minSize={20}>
                <div className="h-full flex flex-col">
                  <div className="px-3 py-1.5 border-b border-border/30 text-[10px] text-muted-foreground font-mono flex items-center gap-2 bg-card/20">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> Preview
                  </div>
                  <div className="flex-1 min-h-0">
                    <LivePreview html={debouncedHtml} css={debouncedCss} js={debouncedJs} onConsoleLog={handleConsoleLog} />
                  </div>
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          ) : (
            <div className="flex-1 flex flex-col">
              <div className="flex-1 min-h-0">
                {layoutMode === 'split' ? (
                  <div className="h-full flex flex-col xl:flex-row gap-1 p-1 overflow-hidden">
                    <div className="flex-1 border border-border/30 flex flex-col min-h-0 rounded overflow-hidden">
                      <div className="text-[10px] px-2 py-1 bg-card/40 border-b border-border/30 text-muted-foreground">index.html</div>
                      <CodeEditor code={currentHtml} onChange={(v) => setFiles(p => p.map(f => f.id === 'html' ? { ...f, content: v } : f))} language="html" theme={editorTheme} fontSize={fontSize} />
                    </div>
                    <div className="flex-1 border border-border/30 flex flex-col min-h-0 rounded overflow-hidden">
                      <div className="text-[10px] px-2 py-1 bg-card/40 border-b border-border/30 text-muted-foreground">style.css</div>
                      <CodeEditor code={currentCss} onChange={(v) => setFiles(p => p.map(f => f.id === 'css' ? { ...f, content: v } : f))} language="css" theme={editorTheme} fontSize={fontSize} />
                    </div>
                    <div className="flex-1 border border-border/30 flex flex-col min-h-0 rounded overflow-hidden">
                      <div className="text-[10px] px-2 py-1 bg-card/40 border-b border-border/30 text-muted-foreground">script.js</div>
                      <CodeEditor code={currentJs} onChange={(v) => setFiles(p => p.map(f => f.id === 'js' ? { ...f, content: v } : f))} language="javascript" theme={editorTheme} fontSize={fontSize} />
                    </div>
                  </div>
                ) : (
                  <CodeEditor code={activeFile.content} onChange={updateFileContent} language={activeFile.lang} theme={editorTheme} fontSize={fontSize} />
                )}
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
