import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { ArrowLeft, CheckCircle2, XCircle, Trophy, Lightbulb, Sparkles } from 'lucide-react';
import CodeEditor from '@/components/CodeEditor';
import LivePreview from '@/components/LivePreview';
import ConsolePanel from '@/components/ConsolePanel';
import { CHALLENGES, TIER_INFO, ChallengeDef, Tier } from '@/data/challengesData';

function normalize(code: string): string {
  return code.toLowerCase().replace(/'/g, '"').replace(/\s+/g, ' ').replace(/\s*=\s*/g, '=');
}

// 1. Added 'preview' tab for mobile views
type FileTab = 'html' | 'css' | 'js' | 'preview';
const TIERS: Tier[] = ['Easy', 'Medium', 'Hard', 'Complex'];

const Challenges = () => {
  const navigate = useNavigate();
  const { user, completeLesson } = useUser();
  const [activeTier, setActiveTier] = useState<Tier>('Easy');
  const [selected, setSelected] = useState<ChallengeDef | null>(null);
  const [htmlCode, setHtmlCode] = useState('');
  const [cssCode, setCssCode] = useState('');
  const [jsCode, setJsCode] = useState('');
  const [result, setResult] = useState<'pass' | 'fail' | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [fileTab, setFileTab] = useState<FileTab>('html');
  const [consoleLogs, setConsoleLogs] = useState<{ type: string; message: string }[]>([]);

  const handleLog = useCallback((log: { type: string; message: string }) => {
    setConsoleLogs(prev => [...prev, log]);
  }, []);

  const byTier = useMemo(() => CHALLENGES.filter(c => c.tier === activeTier), [activeTier]);

  if (!user) { navigate('/auth'); return null; }

  const start = (c: ChallengeDef) => {
    setSelected(c);
    setHtmlCode(c.initialHtml); setCssCode(c.initialCss); setJsCode(c.initialJs);
    setResult(null); setShowHint(false); setFileTab('html'); setConsoleLogs([]);
  };

  const check = () => {
    if (!selected) return;
    const all = normalize(htmlCode + '\n' + cssCode + '\n' + jsCode);
    const passed = selected.validationKeywords.every(k => all.includes(normalize(k)));
    setResult(passed ? 'pass' : 'fail');
    if (passed) completeLesson(`challenge-${selected.id}`);
  };

  const currentCode = fileTab === 'html' ? htmlCode : fileTab === 'css' ? cssCode : jsCode;
  const setCurrent = (v: string) => {
    if (fileTab === 'html') setHtmlCode(v);
    else if (fileTab === 'css') setCssCode(v);
    else setJsCode(v);
  };

  if (selected) {
    const tierInfo = TIER_INFO[selected.tier];
    return (
      <div className="h-screen flex flex-col bg-background overflow-hidden w-full">
        {/* Editor Header: Added shrink-0 max-w-full to prevent push */}
        <header className="flex items-center justify-between gap-2 px-2 sm:px-3 py-2 glass-card border-b border-border shrink-0 max-w-full overflow-hidden">
          <div className="flex items-center gap-1.5 min-w-0 flex-1">
            <button onClick={() => setSelected(null)} className="text-muted-foreground hover:text-foreground flex-shrink-0">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <Trophy className="w-4 h-4 text-primary flex-shrink-0" />
            <span className="text-foreground font-semibold text-xs truncate">{selected.title}</span>
            <span className={`text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full flex-shrink-0 ${tierInfo.chip} hidden xs:inline-flex`}>
              {tierInfo.icon} +{selected.xp} XP
            </span>
          </div>
          <button onClick={check} className="bg-gradient-to-r from-primary to-accent text-primary-foreground px-2.5 sm:px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold hover:opacity-90 shadow-lg shadow-primary/20 flex-shrink-0 whitespace-nowrap">
            Check Code
          </button>
        </header>

        {result && (
          <div className={`px-4 py-2 text-xs flex items-center gap-2 shrink-0 ${result === 'pass' ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}`}>
            {result === 'pass' ? <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> : <XCircle className="w-3.5 h-3.5 shrink-0" />}
            <span className="truncate">{result === 'pass' ? `Challenge complete! +${selected.xp} XP 🎉` : 'Not quite — peek at the hint and try again.'}</span>
          </div>
        )}

        <div className="flex-1 flex flex-col sm:flex-row overflow-hidden w-full">
          <div className="w-full sm:w-56 flex-shrink-0 border-b sm:border-b-0 sm:border-r border-border p-3 overflow-y-auto glass-card max-h-[25vh] sm:max-h-full">
            <p className="text-xs text-muted-foreground mb-3">{selected.description}</p>
            <button onClick={() => setShowHint(!showHint)} className="flex items-center gap-1.5 text-xs text-warning hover:text-warning/80">
              <Lightbulb className="w-3.5 h-3.5" /> {showHint ? 'Hide Hint' : 'Show Hint'}
            </button>
            {showHint && (
              <div className="mt-2 p-2 bg-warning/10 border border-warning/20 rounded-lg text-xs text-warning">💡 {selected.hint}</div>
            )}
          </div>

          <div className="flex-1 flex flex-col min-w-0 w-full overflow-hidden">
            {/* Added Preview tab and horizontal scrolling for mobile */}
            <div className="flex items-center border-b border-border glass-card overflow-x-auto scrollbar-none shrink-0 w-full">
              {(['html', 'css', 'js', 'preview'] as FileTab[]).map(t => (
                <button key={t} onClick={() => setFileTab(t)} className={`px-3 py-2 text-[10px] font-mono border-b-2 whitespace-nowrap ${
                  fileTab === t ? 'text-foreground border-primary bg-background font-bold' : 'text-muted-foreground border-transparent hover:text-foreground hover:bg-secondary/20'
                } ${t === 'preview' ? 'sm:hidden text-primary' : ''}`}>
                  {t === 'html' ? 'index.html' : t === 'css' ? 'style.css' : t === 'js' ? 'script.js' : '👁️ Preview'}
                </button>
              ))}
            </div>
            
            {/* Conditional logic: Render Preview ONLY on mobile if selected, otherwise render Code Editor */}
            <div className="flex-1 min-h-0 relative flex flex-col overflow-hidden w-full">
              {fileTab === 'preview' ? (
                <div className="w-full h-full sm:hidden">
                  <LivePreview html={htmlCode} css={cssCode} js={jsCode} onConsoleLog={handleLog} />
                </div>
              ) : (
                <CodeEditor code={currentCode} onChange={setCurrent} language={fileTab === 'html' ? 'html' : fileTab === 'css' ? 'css' : 'javascript'} />
              )}
            </div>
            
            {/* Locked Console Panel Height to max 40% of viewport */}
            <div className="max-h-[40vh] sm:max-h-[50vh] overflow-y-auto shrink-0 border-t border-border bg-background w-full">
              <ConsolePanel logs={consoleLogs} onClear={() => setConsoleLogs([])} />
            </div>
          </div>

          <div className="hidden sm:flex flex-1 flex-col min-w-0 border-l border-border w-full">
            <div className="px-3 py-2 border-b border-border text-[10px] text-muted-foreground font-mono glass-card flex items-center gap-2 shrink-0">
              <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" /> Preview
            </div>
            <div className="flex-1 min-h-0">
              <LivePreview html={htmlCode} css={cssCode} js={jsCode} onConsoleLog={handleLog} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const total = CHALLENGES.length;
  const done = CHALLENGES.filter(c => user.completedLessons.includes(`challenge-${c.id}`)).length;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden animated-bg w-full">
      <div className="glow-orb glow-primary w-48 h-48 top-20 -right-10 opacity-20" />

      {/* Main header layout fix */}
      <header className="border-b border-border glass-card px-3 sm:px-6 py-3 flex items-center gap-2 relative z-10 w-full overflow-hidden">
        <button onClick={() => navigate('/dashboard')} className="text-muted-foreground hover:text-foreground shrink-0">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <Trophy className="w-4 h-4 text-primary shrink-0 hidden sm:block" />
        <span className="text-sm sm:text-base font-bold gradient-text font-mono truncate flex-1">Coding Challenges</span>
        <span className="shrink-0 text-[10px] text-muted-foreground font-mono">{done}/{total} solved</span>
      </header>

      <div className="max-w-3xl mx-auto px-3 sm:px-6 py-4 space-y-4 relative z-10 w-full overflow-x-hidden">
        {/* Tier tabs layout fix: Added flex-col inside buttons to prevent horizontal stretch */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2 w-full">
          {TIERS.map(t => {
            const info = TIER_INFO[t];
            const count = CHALLENGES.filter(c => c.tier === t).length;
            const active = activeTier === t;
            return (
              <button key={t} onClick={() => setActiveTier(t)}
                className={`px-1 py-2 sm:px-2 sm:py-3 rounded-xl border text-xs font-semibold transition-all min-w-0 flex flex-col items-center justify-center text-center overflow-hidden w-full ${
                  active ? `${info.tab}` : 'bg-secondary/20 border-border/30 text-muted-foreground hover:border-primary/30'
                }`}>
                <div className="text-sm sm:text-base mb-0.5">{info.icon}</div>
                <div className="w-full truncate text-[11px] sm:text-xs">{info.label}</div>
                <div className="w-full text-[8px] sm:text-[9px] opacity-70 font-mono truncate">{count} tasks</div>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground w-full">
          <Sparkles className="w-3.5 h-3.5 text-primary shrink-0" />
          <span className="truncate">Pick a tier. Each tier rewards more XP!</span>
        </div>

        <div className="space-y-2 w-full">
          {byTier.map(c => {
            const completed = user.completedLessons.includes(`challenge-${c.id}`);
            const info = TIER_INFO[c.tier];
            return (
              <button key={c.id} onClick={() => start(c)}
                className="w-full glass-card rounded-xl p-3 sm:p-4 text-left hover:border-primary/20 hover:neon-border-subtle transition-all flex items-center justify-between gap-2 group overflow-hidden">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  {completed && <CheckCircle2 className="w-4 h-4 text-success shrink-0" />}
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-foreground text-xs sm:text-sm truncate group-hover:text-primary transition-colors">{c.title}</h3>
                    <p className="text-[10px] text-muted-foreground mt-0.5 truncate">{c.description}</p>
                  </div>
                </div>
                <span className={`text-[9px] sm:text-[10px] px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full font-medium shrink-0 whitespace-nowrap ${info.chip}`}>
                  +{c.xp} XP
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Challenges;
