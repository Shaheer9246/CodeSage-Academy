import { useState, useCallback, useRef } from 'react';
import { Download, Upload, Play } from 'lucide-react';
import CodeEditor from '@/components/CodeEditor';
import LivePreview from '@/components/LivePreview';
import ConsolePanel from '@/components/ConsolePanel';
import LearnSidebar from '@/components/LearnSidebar';
import LessonContent from '@/components/LessonContent';
import ChallengePanel from '@/components/ChallengePanel';
import { Lesson, getAllLessons, allLevels } from '@/data/lessons';

const DEFAULT_HTML = `<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div style="text-align: center;">
    <h1>🔥 Welcome to Forge</h1>
    <p>Start coding in the editor!</p>
    <p>Your changes appear here instantly.</p>
  </div>
  <script src="script.js"></script>
</body>
</html>`;

const DEFAULT_CSS = `body {
  font-family: Arial, sans-serif;
  background: #1a1a2e;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  margin: 0;
}
h1 { color: #e94560; }
p { color: #ccc; }`;

const DEFAULT_JS = `// Write your JavaScript here
console.log("Hello from Forge!");`;

const DEFAULT_JSX = `// React JSX reference
// function App() {
//   return <h1>Hello React!</h1>;
// }`;

type Tab = 'playground' | 'learn';
type FileTab = 'html' | 'css' | 'js' | 'jsx';

const FILE_TAB_CONFIG: { id: FileTab; label: string; lang: string }[] = [
  { id: 'html', label: 'index.html', lang: 'html' },
  { id: 'css', label: 'style.css', lang: 'css' },
  { id: 'js', label: 'script.js', lang: 'javascript' },
  { id: 'jsx', label: 'App.jsx', lang: 'javascript' },
];

const Index = () => {
  const [tab, setTab] = useState<Tab>('playground');
  const [fileTab, setFileTab] = useState<FileTab>('html');
  const [htmlCode, setHtmlCode] = useState(DEFAULT_HTML);
  const [cssCode, setCssCode] = useState(DEFAULT_CSS);
  const [jsCode, setJsCode] = useState(DEFAULT_JS);
  const [jsxCode, setJsxCode] = useState(DEFAULT_JSX);
  const [consoleLogs, setConsoleLogs] = useState<{ type: string; message: string }[]>([]);
  const [completedLessons, setCompletedLessons] = useState<string[]>(() => {
    const saved = localStorage.getItem('forge-completed');
    return saved ? JSON.parse(saved) : [];
  });
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [showChallenge, setShowChallenge] = useState(false);
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

  const handleSelectLesson = (lesson: Lesson) => {
    setCurrentLesson(lesson);
    setHtmlCode(lesson.initialCode);
    setCssCode(lesson.initialCss || 'body { font-family: Arial; padding: 20px; background: #1a1a2e; color: #e0e0e0; }');
    setJsCode(lesson.initialJs || '// JavaScript code here');
    setJsxCode(lesson.initialJsx || '// JSX reference here');
    setConsoleLogs([]);
    setShowChallenge(false);
    setFileTab('html');
  };

  const getCurrentTopicLessons = () => {
    if (!currentLesson) return [];
    return allLevels
      .flatMap(l => l.topics)
      .find(t => t.lessons.some(l => l.id === currentLesson.id))
      ?.lessons || [];
  };

  const currentIndex = getCurrentTopicLessons().findIndex(l => l.id === currentLesson?.id);

  const handlePrev = () => {
    const lessons = getCurrentTopicLessons();
    if (currentIndex > 0) handleSelectLesson(lessons[currentIndex - 1]);
  };

  const handleNext = () => {
    const lessons = getCurrentTopicLessons();
    if (currentIndex < lessons.length - 1) handleSelectLesson(lessons[currentIndex + 1]);
  };

  const handleCompleteChallenge = () => {
    if (!currentLesson) return;
    const updated = [...new Set([...completedLessons, currentLesson.id])];
    setCompletedLessons(updated);
    localStorage.setItem('forge-completed', JSON.stringify(updated));
    setShowChallenge(false);
  };

  const handleStartChallenge = () => {
    if (currentLesson?.challenge) {
      setHtmlCode(currentLesson.challenge.initialCode);
      setCssCode(currentLesson.challenge.initialCss || cssCode);
      setJsCode(currentLesson.challenge.initialJs || jsCode);
      setShowChallenge(true);
    }
  };

  const handleExport = () => {
    const blob = new Blob([htmlCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'code.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => fileInputRef.current?.click();

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

  const totalLessons = getAllLessons().length;
  const progressPercent = totalLessons ? (completedLessons.length / totalLessons) * 100 : 0;

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Top bar */}
      <header className="flex items-center justify-between px-4 py-2 bg-card border-b border-border">
        <div className="flex items-center gap-3">
          <span className="text-primary font-bold text-lg font-mono">🔥 Forge</span>
          <span className="text-xs text-muted-foreground font-mono hidden sm:inline">Frontend Dev Environment</span>
        </div>
        <div className="flex items-center gap-1">
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".html,.css,.js,.jsx" className="hidden" />
          <button onClick={handleImport} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground px-2 py-1.5 rounded hover:bg-secondary transition-colors">
            <Upload className="w-3.5 h-3.5" /> Import
          </button>
          <button onClick={handleExport} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground px-2 py-1.5 rounded hover:bg-secondary transition-colors">
            <Download className="w-3.5 h-3.5" /> Export
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left sidebar */}
        <div className="w-56 flex-shrink-0 bg-sidebar border-r border-border flex flex-col">
          <div className="flex border-b border-border">
            <button
              onClick={() => { setTab('playground'); setCurrentLesson(null); setShowChallenge(false); setHtmlCode(DEFAULT_HTML); setCssCode(DEFAULT_CSS); setJsCode(DEFAULT_JS); setJsxCode(DEFAULT_JSX); }}
              className={`flex-1 py-2.5 text-xs font-semibold text-center transition-colors ${tab === 'playground' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Playground
            </button>
            <button
              onClick={() => setTab('learn')}
              className={`flex-1 py-2.5 text-xs font-semibold text-center transition-colors ${tab === 'learn' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Learn
            </button>
          </div>

          {tab === 'playground' ? (
            <div className="p-4 space-y-4">
              <h2 className="text-sm font-semibold text-foreground">Forge</h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Write HTML, CSS, JavaScript, or React code. The preview updates as you type.
              </p>
              <div className="space-y-3">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Quick Start</h3>
                <button onClick={() => { setHtmlCode(`<!DOCTYPE html>\n<html>\n<head><link rel="stylesheet" href="style.css"></head>\n<body>\n  <h1>Hello World</h1>\n  <p>Start building!</p>\n</body>\n</html>`); setCssCode(`body { font-family: Arial; padding: 20px; background: #1a1a2e; color: white; }\nh1 { color: #e94560; }`); setJsCode(''); setFileTab('html'); }} className="w-full text-left text-xs px-3 py-2 bg-secondary/50 rounded-lg text-foreground hover:bg-secondary transition-colors">HTML + CSS</button>
                <button onClick={() => { setHtmlCode(`<!DOCTYPE html>\n<html>\n<head><link rel="stylesheet" href="style.css"></head>\n<body>\n  <h1>Check the Console! 👇</h1>\n  <script src="script.js"></script>\n</body>\n</html>`); setCssCode(`body { font-family: Arial; padding: 40px; background: #1a1a2e; color: white; text-align: center; }\nh1 { color: #f39c12; }`); setJsCode(`console.log("Hello World");\nconsole.log("Welcome to JavaScript!");`); setFileTab('js'); }} className="w-full text-left text-xs px-3 py-2 bg-secondary/50 rounded-lg text-foreground hover:bg-secondary transition-colors">JavaScript</button>
                <button onClick={() => { setHtmlCode(`<!DOCTYPE html>\n<html>\n<head><link rel="stylesheet" href="style.css"></head>\n<body>\n  <div id="app"></div>\n  <script src="script.js"></script>\n</body>\n</html>`); setCssCode(`body { font-family: Arial; background: #282c34; color: white; padding: 40px; text-align: center; }\n.react-blue { color: #61dafb; }`); setJsCode(`function App() {\n  return '<h1 class=\"react-blue\">⚛️ React App</h1>';\n}\ndocument.getElementById("app").innerHTML = App();`); setFileTab('js'); }} className="w-full text-left text-xs px-3 py-2 bg-secondary/50 rounded-lg text-foreground hover:bg-secondary transition-colors">React App</button>
              </div>
            </div>
          ) : (
            <LearnSidebar
              completedLessons={completedLessons}
              currentLessonId={currentLesson?.id}
              onSelectLesson={handleSelectLesson}
              progressPercent={progressPercent}
              completedCount={completedLessons.length}
              totalCount={totalLessons}
            />
          )}
        </div>

        {/* Main content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Lesson content panel */}
          {tab === 'learn' && currentLesson && (
            <div className="w-72 flex-shrink-0 border-r border-border">
              {showChallenge ? (
                <ChallengePanel
                  lesson={currentLesson}
                  html={htmlCode}
                  css={cssCode}
                  js={jsCode}
                  onBack={() => {
                    setShowChallenge(false);
                    setHtmlCode(currentLesson.initialCode);
                    setCssCode(currentLesson.initialCss || '');
                    setJsCode(currentLesson.initialJs || '');
                  }}
                  onComplete={handleCompleteChallenge}
                />
              ) : (
                <LessonContent
                  lesson={currentLesson}
                  lessonIndex={currentIndex}
                  totalLessons={getCurrentTopicLessons().length}
                  onPrev={handlePrev}
                  onNext={handleNext}
                  onStartChallenge={handleStartChallenge}
                  isLastInTopic={currentIndex === getCurrentTopicLessons().length - 1}
                />
              )}
            </div>
          )}

          {/* Code editor + console */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* File tabs */}
            <div className="flex items-center border-b border-border bg-card">
              {FILE_TAB_CONFIG.map(ft => (
                <button
                  key={ft.id}
                  onClick={() => setFileTab(ft.id)}
                  className={`px-4 py-2 text-xs font-mono transition-colors border-b-2 ${
                    fileTab === ft.id
                      ? 'text-foreground border-primary bg-background'
                      : 'text-muted-foreground border-transparent hover:text-foreground hover:bg-secondary/30'
                  }`}
                >
                  {ft.label}
                </button>
              ))}
            </div>
            <div className="flex-1 min-h-0">
              <CodeEditor
                code={currentCode}
                onChange={setCurrentCode}
                language={FILE_TAB_CONFIG.find(f => f.id === fileTab)?.lang || 'html'}
              />
            </div>
            <ConsolePanel logs={consoleLogs} onClear={() => setConsoleLogs([])} />
          </div>

          {/* Live preview */}
          <div className="flex-1 flex flex-col min-w-0 border-l border-border">
            <div className="px-3 py-2 border-b border-border text-xs text-muted-foreground font-mono flex items-center gap-2 bg-card">
              <Play className="w-3 h-3 text-success" /> Preview
            </div>
            <div className="flex-1 min-h-0">
              <LivePreview html={htmlCode} css={cssCode} js={jsCode} onConsoleLog={handleConsoleLog} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
