import { useState, useCallback, useRef } from 'react';
import { Code2, BookOpen, Download, Upload, Play } from 'lucide-react';
import CodeEditor from '@/components/CodeEditor';
import LivePreview from '@/components/LivePreview';
import ConsolePanel from '@/components/ConsolePanel';
import LearnSidebar from '@/components/LearnSidebar';
import LessonContent from '@/components/LessonContent';
import ChallengePanel from '@/components/ChallengePanel';
import { Lesson, getAllLessons, allLevels } from '@/data/lessons';

const DEFAULT_CODE = `<!DOCTYPE html>
<html>
<head>
  <style>
    body {
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
    p { color: #ccc; }
  </style>
</head>
<body>
  <div style="text-align: center;">
    <h1>🔥 Welcome to Forge</h1>
    <p>Start coding in the editor on the left!</p>
    <p>Your changes appear here instantly.</p>
  </div>
</body>
</html>`;

type Tab = 'playground' | 'learn';

const Index = () => {
  const [tab, setTab] = useState<Tab>('playground');
  const [code, setCode] = useState(DEFAULT_CODE);
  const [consoleLogs, setConsoleLogs] = useState<{ type: string; message: string }[]>([]);
  const [completedLessons, setCompletedLessons] = useState<string[]>(() => {
    const saved = localStorage.getItem('forge-completed');
    return saved ? JSON.parse(saved) : [];
  });
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [showChallenge, setShowChallenge] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleConsoleLog = useCallback((log: { type: string; message: string }) => {
    setConsoleLogs(prev => [...prev, log]);
  }, []);

  const handleSelectLesson = (lesson: Lesson) => {
    setCurrentLesson(lesson);
    setCode(lesson.initialCode);
    setConsoleLogs([]);
    setShowChallenge(false);
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
    if (currentIndex < lessons.length - 1) {
      handleSelectLesson(lessons[currentIndex + 1]);
    }
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
      setCode(currentLesson.challenge.initialCode);
      setShowChallenge(true);
    }
  };

  const handleExport = () => {
    const blob = new Blob([code], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'code.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setCode(ev.target?.result as string);
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
        </div>
        <div className="flex items-center gap-1">
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".html,.css,.js" className="hidden" />
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
        <div className="w-60 flex-shrink-0 bg-sidebar border-r border-border flex flex-col">
          <div className="flex border-b border-border">
            <button
              onClick={() => { setTab('playground'); setCurrentLesson(null); setShowChallenge(false); }}
              className={`flex-1 py-2.5 text-xs font-semibold text-center transition-colors ${
                tab === 'playground' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Playground
            </button>
            <button
              onClick={() => setTab('learn')}
              className={`flex-1 py-2.5 text-xs font-semibold text-center transition-colors ${
                tab === 'learn' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Learn
            </button>
          </div>

          {tab === 'playground' ? (
            <div className="p-4 space-y-4">
              <h2 className="text-sm font-semibold text-foreground">Forge</h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Write HTML, CSS & JavaScript in the editor. See your changes live in the preview panel.
              </p>
              <div className="space-y-2">
                <div className="text-xs text-muted-foreground">Progress</div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-foreground font-mono">
                    {completedLessons.length}/{totalLessons} ({Math.round(progressPercent)}%)
                  </span>
                </div>
                <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${progressPercent}%` }} />
                </div>
              </div>
            </div>
          ) : (
            <LearnSidebar
              completedLessons={completedLessons}
              currentLessonId={currentLesson?.id}
              onSelectLesson={handleSelectLesson}
            />
          )}
        </div>

        {/* Main content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Lesson content panel (only in learn mode with active lesson) */}
          {tab === 'learn' && currentLesson && (
            <div className="w-72 flex-shrink-0 border-r border-border">
              {showChallenge ? (
                <ChallengePanel
                  lesson={currentLesson}
                  code={code}
                  onBack={() => {
                    setShowChallenge(false);
                    setCode(currentLesson.initialCode);
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
            <div className="flex-1 min-h-0">
              <CodeEditor code={code} onChange={setCode} language="html" />
            </div>
            <div className="h-36 flex-shrink-0">
              <ConsolePanel logs={consoleLogs} onClear={() => setConsoleLogs([])} />
            </div>
          </div>

          {/* Live preview */}
          <div className="flex-1 flex flex-col min-w-0 border-l border-border">
            <div className="px-3 py-1.5 border-b border-border text-xs text-muted-foreground font-mono flex items-center gap-2">
              <Play className="w-3 h-3 text-success" /> Preview
            </div>
            <div className="flex-1 min-h-0">
              <LivePreview code={code} onConsoleLog={handleConsoleLog} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
