import { useState, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { getLessonById, getAllLessons, isLessonUnlocked } from '@/data/lessons';
import CodeEditor from '@/components/CodeEditor';
import LivePreview from '@/components/LivePreview';
import ConsolePanel from '@/components/ConsolePanel';
import { ArrowLeft, CheckCircle2, XCircle, ChevronRight } from 'lucide-react';

type FileTab = 'html' | 'css' | 'js';

const LessonPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, completeLesson } = useUser();

  const lesson = id ? getLessonById(id) : undefined;

  const [fileTab, setFileTab] = useState<FileTab>('html');
  const [htmlCode, setHtmlCode] = useState('');
  const [cssCode, setCssCode] = useState('');
  const [jsCode, setJsCode] = useState('');
  const [consoleLogs, setConsoleLogs] = useState<{ type: string; message: string }[]>([]);
  const [showChallenge, setShowChallenge] = useState(false);
  const [challengeResult, setChallengeResult] = useState<'pass' | 'fail' | null>(null);

  useEffect(() => {
    if (lesson) {
      setHtmlCode(lesson.initialCode);
      setCssCode(lesson.initialCss || 'body { font-family: Arial; padding: 20px; background: #1a1a2e; color: #e0e0e0; }');
      setJsCode(lesson.initialJs || '');
      setConsoleLogs([]);
      setShowChallenge(false);
      setChallengeResult(null);
      setFileTab('html');
    }
  }, [lesson?.id]);

  if (!user) { navigate('/auth'); return null; }
  if (!lesson) { navigate('/learn'); return null; }
  if (!isLessonUnlocked(lesson.id, user.completedLessons)) { navigate('/learn'); return null; }

  const handleConsoleLog = useCallback((log: { type: string; message: string }) => {
    setConsoleLogs(prev => [...prev, log]);
  }, []);

  const currentCode = fileTab === 'html' ? htmlCode : fileTab === 'css' ? cssCode : jsCode;
  const setCurrentCode = (val: string) => {
    if (fileTab === 'html') setHtmlCode(val);
    else if (fileTab === 'css') setCssCode(val);
    else setJsCode(val);
  };

  const lang = fileTab === 'html' ? 'html' : fileTab === 'css' ? 'css' : 'javascript';

  const handleStartChallenge = () => {
    if (lesson.challenge) {
      setHtmlCode(lesson.challenge.initialCode);
      setCssCode(lesson.challenge.initialCss || cssCode);
      setJsCode(lesson.challenge.initialJs || jsCode);
      setShowChallenge(true);
      setChallengeResult(null);
      setFileTab('html');
    }
  };

  const handleCheckCode = () => {
    if (!lesson.challenge) return;
    const allCode = (htmlCode + '\n' + cssCode + '\n' + jsCode).toLowerCase();
    const passed = lesson.challenge.validationKeywords.every(kw => allCode.includes(kw.toLowerCase()));
    setChallengeResult(passed ? 'pass' : 'fail');
    if (passed) {
      completeLesson(lesson.id);
    }
  };

  const goToNext = () => {
    const all = getAllLessons();
    const idx = all.findIndex(l => l.id === lesson.id);
    if (idx < all.length - 1) {
      navigate(`/lesson/${all[idx + 1].id}`);
    } else {
      navigate('/learn');
    }
  };

  // Render markdown content
  const renderContent = (md: string) => {
    const lines = md.split('\n');
    const html: string[] = [];
    let inCode = false;
    let codeBlock = '';
    let codeLang = '';

    for (const line of lines) {
      if (line.startsWith('```')) {
        if (inCode) {
          html.push(`<pre class="bg-[hsl(220,20%,8%)] rounded-lg p-4 my-3 text-sm font-mono overflow-x-auto border border-[hsl(220,15%,20%)]"><code class="text-[hsl(175,70%,45%)]">${codeBlock}</code></pre>`);
          codeBlock = '';
        } else {
          codeLang = line.slice(3);
        }
        inCode = !inCode;
        continue;
      }
      if (inCode) {
        codeBlock += line.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '\n';
        continue;
      }
      if (line.startsWith('# ')) {
        html.push(`<h1 class="text-2xl font-bold text-[hsl(210,20%,90%)] mb-4">${line.slice(2)}</h1>`);
      } else if (line.startsWith('## ')) {
        html.push(`<h2 class="text-lg font-semibold text-[hsl(210,20%,90%)] mt-5 mb-2">${line.slice(3)}</h2>`);
      } else if (line.startsWith('- ')) {
        const content = line.slice(2)
          .replace(/`([^`]+)`/g, '<code class="bg-[hsl(220,15%,18%)] px-1.5 py-0.5 rounded text-[hsl(175,70%,45%)] text-sm font-mono">$1</code>')
          .replace(/\*\*([^*]+)\*\*/g, '<strong class="text-[hsl(25,95%,55%)]">$1</strong>');
        html.push(`<li class="ml-4 text-sm text-[hsl(215,15%,55%)] mb-1.5 list-disc">${content}</li>`);
      } else if (line.trim()) {
        const content = line
          .replace(/`([^`]+)`/g, '<code class="bg-[hsl(220,15%,18%)] px-1.5 py-0.5 rounded text-[hsl(175,70%,45%)] text-sm font-mono">$1</code>')
          .replace(/\*\*([^*]+)\*\*/g, '<strong class="text-[hsl(25,95%,55%)]">$1</strong>');
        html.push(`<p class="text-sm text-[hsl(215,15%,65%)] mb-3 leading-relaxed">${content}</p>`);
      }
    }
    return html.join('');
  };

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-2 bg-card border-b border-border">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/learn')} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="text-primary font-semibold text-sm">⚡ {lesson.topic}</span>
          <span className="text-muted-foreground text-xs">— {lesson.title}</span>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Lesson content panel */}
        <div className="w-[380px] flex-shrink-0 border-r border-border overflow-auto bg-card">
          <div className="p-5">
            <div dangerouslySetInnerHTML={{ __html: renderContent(lesson.content) }} />

            {/* Challenge section - inline box */}
            {lesson.challenge && !showChallenge && (
              <div className="mt-6 border border-primary/30 rounded-xl p-4 bg-primary/5">
                <h3 className="text-base font-semibold text-foreground flex items-center gap-2 mb-2">
                  🏆 Challenge
                </h3>
                <p className="text-sm text-muted-foreground mb-3">{lesson.challenge.instruction}</p>
                <button
                  onClick={handleStartChallenge}
                  className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity"
                >
                  Start Challenge
                </button>
              </div>
            )}

            {/* Challenge active */}
            {showChallenge && lesson.challenge && (
              <div className="mt-6 border border-primary/30 rounded-xl p-4 bg-primary/5">
                <h3 className="text-base font-semibold text-foreground flex items-center gap-2 mb-2">
                  🏆 Challenge Active
                </h3>
                <p className="text-sm text-muted-foreground mb-3">{lesson.challenge.instruction}</p>

                {challengeResult === 'pass' && (
                  <div className="flex items-center gap-2 p-3 bg-success/10 rounded-lg text-success text-sm mb-3">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-semibold">Great job! Challenge completed! 🎉</span>
                  </div>
                )}
                {challengeResult === 'fail' && (
                  <div className="flex items-center gap-2 p-3 bg-destructive/10 rounded-lg text-destructive text-sm mb-3">
                    <XCircle className="w-5 h-5" />
                    <span>Not quite right. Check requirements and try again.</span>
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={handleCheckCode}
                    className="flex-1 bg-primary text-primary-foreground py-2 rounded-lg font-semibold text-sm hover:opacity-90"
                  >
                    Check My Code
                  </button>
                  {challengeResult === 'pass' && (
                    <button
                      onClick={goToNext}
                      className="flex items-center gap-1 bg-success text-primary-foreground px-4 py-2 rounded-lg font-semibold text-sm hover:opacity-90"
                    >
                      Next <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Code editor + console */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex items-center border-b border-border bg-card">
            {(['html', 'css', 'js'] as FileTab[]).map(tab => (
              <button
                key={tab}
                onClick={() => setFileTab(tab)}
                className={`px-4 py-2 text-xs font-mono transition-colors border-b-2 ${
                  fileTab === tab ? 'text-foreground border-primary bg-background' : 'text-muted-foreground border-transparent hover:text-foreground hover:bg-secondary/30'
                }`}
              >
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
          <div className="px-3 py-2 border-b border-border text-xs text-muted-foreground font-mono flex items-center gap-2 bg-card">
            <div className="w-2 h-2 rounded-full bg-success" /> Preview
          </div>
          <div className="flex-1 min-h-0">
            <LivePreview html={htmlCode} css={cssCode} js={jsCode} onConsoleLog={handleConsoleLog} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonPage;
