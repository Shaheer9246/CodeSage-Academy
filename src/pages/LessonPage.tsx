import { useState, useCallback, useEffect } from 'react';
import { useGuestLessonGate } from '@/lib/guestGate';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { getLessonById, getAllLessons, isLessonUnlocked } from '@/data/lessons';
import CodeEditor from '@/components/CodeEditor';
import LivePreview from '@/components/LivePreview';
import ConsolePanel from '@/components/ConsolePanel';
import { ArrowLeft, CheckCircle2, XCircle, ChevronRight, Lightbulb, BookOpen, Code, Eye } from 'lucide-react';
import { toast } from 'sonner';

type FileTab = 'html' | 'css' | 'js';
type MobileView = 'lesson' | 'code' | 'preview';

function escapeHtml(str: string): string {
  return str.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function normalizeCode(code: string): string {
  return code.toLowerCase().replace(/'/g, '"').replace(/\s+/g, ' ').replace(/\s*=\s*/g, '=');
}

const LessonPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, completeLesson, canLearn } = useUser();

  const lesson = id ? getLessonById(id) : undefined;

  const [fileTab, setFileTab] = useState<FileTab>('html');
  const [mobileView, setMobileView] = useState<MobileView>('lesson');
  const [htmlCode, setHtmlCode] = useState('');
  const [cssCode, setCssCode] = useState('');
  const [jsCode, setJsCode] = useState('');
  const [consoleLogs, setConsoleLogs] = useState<{ type: string; message: string }[]>([]);
  const [showChallenge, setShowChallenge] = useState(false);
  const [challengeResult, setChallengeResult] = useState<'pass' | 'fail' | null>(null);
  const [showHint, setShowHint] = useState(false);

  const handleConsoleLog = useCallback((log: { type: string; message: string }) => {
    setConsoleLogs(prev => [...prev, log]);
  }, []);

  useEffect(() => {
    if (lesson) {
      setHtmlCode(lesson.initialCode);
      setCssCode(lesson.initialCss || 'body { font-family: Arial; padding: 20px; background: #0f0a2e; color: #e0e0e; }');
      setJsCode(lesson.initialJs || '');
      setConsoleLogs([]);
      setShowChallenge(false);
      setChallengeResult(null);
      setShowHint(false);
      setFileTab('html');
      setMobileView('lesson');
    }
  }, [lesson]);

  const { isGuest: __pgGuest } = useGuestLessonGate('frontend', id); if (!user && !__pgGuest) return <Navigate to="/auth" replace />;
  if (!lesson) return <Navigate to="/learn" replace />;
  if (!isLessonUnlocked(lesson.id, (user?.completedLessons || []))) return <Navigate to="/learn" replace />;

  const currentCode = fileTab === 'html' ? htmlCode : fileTab === 'css' ? cssCode : jsCode;
  const setCurrentCode = (val: string) => {
    if (fileTab === 'html') setHtmlCode(val);
    else if (fileTab === 'css') setCssCode(val);
    else setJsCode(val);
  };

  const lang = fileTab === 'html' ? 'html' : fileTab === 'css' ? 'css' : 'javascript';

   const handleStartChallenge = () => {
    if (!canLearn) {
      toast.error('You are out of XP! Come back tomorrow or buy more with coins.');
      return;
    }
    if (lesson.challenge) {
      setHtmlCode(lesson.challenge.initialCode);
      setCssCode(lesson.challenge.initialCss || cssCode);
      setJsCode(lesson.challenge.initialJs || jsCode);
      setShowChallenge(true);
      setChallengeResult(null);
      setShowHint(false);
      setFileTab('html');
      setMobileView('code');
    }
  };

  const handleCheckCode = () => {
    if (!lesson.challenge) return;
    const allCode = normalizeCode(htmlCode + '\n' + cssCode + '\n' + jsCode);
    const passed = lesson.challenge.validationKeywords.every(kw => allCode.includes(normalizeCode(kw)));
    setChallengeResult(passed ? 'pass' : 'fail');
    if (passed) {
      if (user) completeLesson(lesson.id);
      setTimeout(() => navigate('/complete/' + lesson.id), 600);
    }
  };

  const goToNext = () => {
    navigate('/complete/' + lesson.id);
  };

  const skipToNext = () => {
    const all = getAllLessons();
    const idx = all.findIndex(l => l.id === lesson.id);
    const next = idx >= 0 && idx < all.length - 1 ? all[idx + 1] : null;
    if (next) navigate(`/lesson/${next.id}`);
    else navigate('/learn');
  };

  const renderContent = (md: string) => {
    const lines = md.split('\n');
    const html: string[] = [];
    let inCode = false;
    let codeBlock = '';

    for (const line of lines) {
      if (line.startsWith('```')) {
        if (inCode) {
          html.push(`<pre class="bg-secondary/60 rounded-lg p-3 my-3 text-xs font-mono overflow-x-auto border border-border/50"><code class="text-accent">${codeBlock}</code></pre>`);
          codeBlock = '';
        }
        inCode = !inCode;
        continue;
      }
      if (inCode) { codeBlock += escapeHtml(line) + '\n'; continue; }

      const escaped = escapeHtml(line);
      if (escaped.startsWith('# ')) {
        html.push(`<h1 class="text-xl font-bold text-foreground mb-3">${escaped.slice(2)}</h1>`);
      } else if (escaped.startsWith('## ')) {
        html.push(`<h2 class="text-sm font-semibold text-foreground mt-4 mb-2">${escaped.slice(3)}</h2>`);
      } else if (escaped.startsWith('- ')) {
        const content = escaped.slice(2)
          .replace(/`([^`]+)`/g, '<code class="bg-secondary px-1.5 py-0.5 rounded text-accent text-xs font-mono">$1</code>')
          .replace(/\*\*([^*]+)\*\*/g, '<strong class="text-primary">$1</strong>');
        html.push(`<li class="ml-4 text-xs text-muted-foreground mb-1 list-disc">${content}</li>`);
      } else if (escaped.trim()) {
        const content = escaped
          .replace(/`([^`]+)`/g, '<code class="bg-secondary px-1.5 py-0.5 rounded text-accent text-xs font-mono">$1</code>')
          .replace(/\*\*([^*]+)\*\*/g, '<strong class="text-primary">$1</strong>');
        html.push(`<p class="text-xs text-muted-foreground mb-2 leading-relaxed">${content}</p>`);
      }
    }
    return html.join('');
  };

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-3 py-2 glass-card border-b border-border terminal-dots">
        <div className="flex items-center gap-2 min-w-0">
          <button onClick={() => navigate('/learn')} className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <span className="text-primary font-semibold text-xs truncate">⚡ {lesson.topic}</span>
          <span className="text-muted-foreground text-[10px] hidden sm:inline truncate">— {lesson.title}</span>
        </div>
      </header>

      {/* Mobile Tab Bar */}
      <div className="sm:hidden flex border-b border-border bg-card/50">
        {([
          { key: 'lesson' as MobileView, icon: BookOpen, label: 'Lesson' },
          { key: 'code' as MobileView, icon: Code, label: 'Code' },
          { key: 'preview' as MobileView, icon: Eye, label: 'Preview' },
        ]).map(tab => (
          <button key={tab.key} onClick={() => setMobileView(tab.key)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-all border-b-2 ${
              mobileView === tab.key ? 'text-primary border-primary bg-primary/5' : 'text-muted-foreground border-transparent'
            }`}>
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Desktop layout */}
      <div className="flex-1 hidden sm:flex overflow-hidden">
        {/* Lesson content panel */}
        <div className="w-[340px] flex-shrink-0 border-r border-border overflow-auto glass-card">
          <div className="p-4">
            <div dangerouslySetInnerHTML={{ __html: renderContent(lesson.content) }} />
            {renderChallengeSection()}
          </div>
        </div>

        {/* Code editor + console */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex items-center border-b border-border glass-card">
            {(['html', 'css', 'js'] as FileTab[]).map(tab => (
              <button key={tab} onClick={() => setFileTab(tab)}
                className={`px-3 py-2 text-[10px] font-mono transition-colors border-b-2 ${
                  fileTab === tab ? 'text-foreground border-primary bg-background' : 'text-muted-foreground border-transparent hover:text-foreground hover:bg-secondary/20'
                }`}>
                {tab === 'html' ? 'index.html' : tab === 'css' ? 'style.css' : 'script.js'}
              </button>
            ))}
          </div>
          <div className="flex-1 min-h-0">
            <CodeEditor code={currentCode} onChange={setCurrentCode} language={lang} />
          </div>
          <ConsolePanel logs={consoleLogs} onClear={() => setConsoleLogs([])} />
        </div>

        {/* Live preview */}
        <div className="flex-1 flex flex-col min-w-0 border-l border-border">
          <div className="px-3 py-2 border-b border-border text-[10px] text-muted-foreground font-mono flex items-center gap-2 glass-card">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Preview
          </div>
          <div className="flex-1 min-h-0">
            <LivePreview html={htmlCode} css={cssCode} js={jsCode} onConsoleLog={handleConsoleLog} />
          </div>
        </div>
      </div>

      {/* Mobile layout - show one view at a time */}
      <div className="flex-1 sm:hidden flex flex-col overflow-hidden">
        {mobileView === 'lesson' && (
          <div className="flex-1 overflow-auto p-4">
            <div dangerouslySetInnerHTML={{ __html: renderContent(lesson.content) }} />
            {renderChallengeSection()}
          </div>
        )}

        {mobileView === 'code' && (
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex items-center border-b border-border bg-card/50">
              {(['html', 'css', 'js'] as FileTab[]).map(tab => (
                <button key={tab} onClick={() => setFileTab(tab)}
                  className={`px-3 py-2 text-[10px] font-mono transition-colors border-b-2 ${
                    fileTab === tab ? 'text-foreground border-primary bg-background' : 'text-muted-foreground border-transparent'
                  }`}>
                  {tab === 'html' ? 'index.html' : tab === 'css' ? 'style.css' : 'script.js'}
                </button>
              ))}
            </div>
            <div className="flex-1 min-h-0">
              <CodeEditor code={currentCode} onChange={setCurrentCode} language={lang} />
            </div>
            <ConsolePanel logs={consoleLogs} onClear={() => setConsoleLogs([])} />
          </div>
        )}

        {mobileView === 'preview' && (
          <div className="flex-1 min-h-0">
            <LivePreview html={htmlCode} css={cssCode} js={jsCode} onConsoleLog={handleConsoleLog} />
          </div>
        )}
      </div>
    </div>
  );

  function renderChallengeSection() {
    if (!lesson.challenge) return null;

    if (!showChallenge) {
      return (
        <div className="mt-5 border border-primary/20 rounded-xl p-4 bg-primary/5">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-2">🏆 Challenge</h3>
          <p className="text-xs text-muted-foreground mb-3">{lesson.challenge.instruction}</p>
                    <button 
            onClick={handleStartChallenge}
            disabled={!canLearn}
            className={`w-full py-2 rounded-lg font-semibold text-xs transition-opacity shadow-lg ${
              !canLearn 
                ? 'bg-secondary/50 text-muted-foreground cursor-not-allowed opacity-50' 
                : 'bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90 shadow-primary/20'
            }`}>
            {!canLearn ? 'Out of XP - Buy More' : 'Start Challenge'}
          </button>
        </div>
      );
    }

    return (
      <div className="mt-5 border border-primary/20 rounded-xl p-4 bg-primary/5">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-2">🏆 Challenge Active</h3>
        <p className="text-xs text-muted-foreground mb-3">{lesson.challenge.instruction}</p>

        {challengeResult === 'pass' && (
          <div className="flex items-center gap-2 p-2.5 bg-emerald-500/10 rounded-lg text-emerald-400 text-xs mb-3">
            <CheckCircle2 className="w-4 h-4" />
            <span className="font-semibold">Great job! Challenge completed! 🎉</span>
          </div>
        )}
        {challengeResult === 'fail' && (
          <div className="space-y-2 mb-3">
            <div className="flex items-center gap-2 p-2.5 bg-red-500/10 rounded-lg text-red-400 text-xs">
              <XCircle className="w-4 h-4" />
              <span>Not quite right. Check hints and try again.</span>
            </div>
            <button onClick={skipToNext}
              className="w-full flex items-center justify-center gap-1.5 bg-secondary/60 hover:bg-secondary text-foreground px-3 py-2 rounded-lg font-semibold text-xs transition-colors border border-border/40">
              Skip to Next Lesson <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        )}

        <button onClick={() => setShowHint(!showHint)}
          className="flex items-center gap-1.5 text-xs text-yellow-400 hover:text-yellow-300 mb-3 transition-colors">
          <Lightbulb className="w-3.5 h-3.5" />
          {showHint ? 'Hide Hint' : 'Show Hint'}
        </button>
        {showHint && (
          <div className="p-2.5 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-xs text-yellow-400 mb-3">
            💡 Your code should include: {lesson.challenge.validationKeywords.join(', ')}
          </div>
        )}

        <div className="flex gap-2">
          <button onClick={handleCheckCode}
            className="flex-1 bg-gradient-to-r from-primary to-accent text-primary-foreground py-2 rounded-lg font-semibold text-xs hover:opacity-90">
            Check My Code
          </button>
          {challengeResult === 'pass' && (
            <button onClick={goToNext}
              className="flex items-center gap-1 bg-emerald-500 text-primary-foreground px-3 py-2 rounded-lg font-semibold text-xs hover:opacity-90">
              Next <ChevronRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    );
  }
};

export default LessonPage;
