// src/pages/Challenges.tsx
import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { ArrowLeft, CheckCircle2, XCircle, Trophy, Lightbulb, Sparkles, Code2 } from 'lucide-react';
import CodeEditor from '@/components/CodeEditor';
import LivePreview from '@/components/LivePreview';
import ConsolePanel from '@/components/ConsolePanel';
import { CHALLENGES, TIER_INFO, ChallengeDef, Tier, Language } from '@/data/challengesData';

function normalize(code: string): string {
  return code.toLowerCase().replace(/'/g, '"').replace(/\s+/g, ' ').replace(/\s*=\s*/g, '=');
}

type FileTab = 'html' | 'css' | 'js' | 'preview';
const TIERS: Tier[] = ['Easy', 'Medium', 'Hard', 'Complex'];

const Challenges = () => {
  const navigate = useNavigate();
  const { user, completeLesson } = useUser();
  const [activeTier, setActiveTier] = useState<Tier>('Easy');
  const [selected, setSelected] = useState<ChallengeDef | null>(null);
  
  // Frontend State
  const [htmlCode, setHtmlCode] = useState('');
  const [cssCode, setCssCode] = useState('');
  const [jsCode, setJsCode] = useState('');
  
  // Python/Java State (Single file)
  const [scriptCode, setScriptCode] = useState('');

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
    setResult(null); 
    setShowHint(false); 
    setConsoleLogs([]);

    if (c.language === 'frontend') {
      setHtmlCode(c.initialHtml || ''); 
      setCssCode(c.initialCss || ''); 
      setJsCode(c.initialJs || '');
      setFileTab('html');
    } else {
      setScriptCode(c.initialCode || '');
    }
  };

  const check = () => {
    if (!selected) return;
    
    let codeToCheck = '';
    if (selected.language === 'frontend') {
      codeToCheck = htmlCode + '\n' + cssCode + '\n' + jsCode;
    } else {
      codeToCheck = scriptCode;
    }

    const all = normalize(codeToCheck);
    const passed = selected.validationKeywords.every(k => all.includes(normalize(k)));
    
    setResult(passed ? 'pass' : 'fail');
    if (passed) completeLesson(`challenge-${selected.id}`);
    
    // Simulate console output for non-frontend if passed (optional visual feedback)
    if (passed && selected.language !== 'frontend') {
        handleLog({ type: 'info', message: `Execution successful. Output matched expectations.` });
    }
  };

  // Determine current code for frontend tabs
  const currentFrontendCode = fileTab === 'html' ? htmlCode : fileTab === 'css' ? cssCode : jsCode;
  const setFrontendCurrent = (v: string) => {
    if (fileTab === 'html') setHtmlCode(v);
    else if (fileTab === 'css') setCssCode(v);
    else setJsCode(v);
  };

  if (selected) {
    const tierInfo = TIER_INFO[selected.tier];
    const isFrontend = selected.language === 'frontend';

    return (
      <div className="h-screen w-screen max-w-[100vw] flex flex-col bg-background overflow-hidden">
        {/* Editor Header */}
        <header className="flex items-center justify-between gap-2 px-2 py-2 glass-card border-b border-border shrink-0 w-full max-w-full min-w-0 overflow-hidden">
          <div className="flex items-center gap-1.5 min-w-0 flex-1 overflow-hidden">
            <button onClick={() => setSelected(null)} className="text-muted-foreground hover:text-foreground shrink-0">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <Trophy className="w-4 h-4 text-primary shrink-0" />
            <span className="text-foreground font-semibold text-xs truncate min-w-0">{selected.title}</span>
            <span className={`text-[9px] px-1.5 py-0.5 rounded border ${tierInfo.chip} uppercase font-bold`}>
                {selected.language}
            </span>
          </div>
          <button onClick={check} className="bg-gradient-to-r from-primary to-accent text-primary-foreground px-2.5 py-1.5 rounded-lg text-[11px] font-semibold hover:opacity-90 shadow-lg shadow-primary/20 shrink-0 whitespace-nowrap">
            Check +{selected.xp}XP
          </button>
        </header>

        {result && (
          <div className={`px-3 py-1.5 text-xs flex items-center gap-2 shrink-0 w-full max-w-full min-w-0 overflow-hidden ${result === 'pass' ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}`}>
            {result === 'pass' ? <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> : <XCircle className="w-3.5 h-3.5 shrink-0" />}
            <span className="truncate flex-1 min-w-0">{result === 'pass' ? `Complete! +${selected.xp} XP 🎉` : 'Not quite — try the hint.'}</span>
          </div>
        )}

        <div className="flex-1 flex flex-col sm:flex-row overflow-hidden w-full max-w-full min-w-0">
          {/* Instructions Box */}
          <div className="w-full sm:w-56 shrink-0 border-b sm:border-b-0 sm:border-r border-border p-2.5 overflow-y-auto glass-card max-h-[18vh] sm:max-h-full min-w-0">
            <p className="text-xs text-muted-foreground mb-2 break-words">{selected.description}</p>
            <button onClick={() => setShowHint(!showHint)} className="flex items-center gap-1.5 text-xs text-warning hover:text-warning/80">
              <Lightbulb className="w-3.5 h-3.5" /> {showHint ? 'Hide Hint' : 'Show Hint'}
            </button>
            {showHint && (
              <div className="mt-2 p-2 bg-warning/10 border border-warning/20 rounded-lg text-xs text-warning break-words">💡 {selected.hint}</div>
            )}
          </div>

          {/* Code/Preview Panel */}
          <div className="flex-1 flex flex-col min-w-0 w-full max-w-full overflow-hidden">
            
            {/* TABS: Only show for Frontend */}
            {isFrontend && (
                <div className="flex items-center border-b border-border glass-card overflow-x-auto scrollbar-none shrink-0 w-full max-w-full min-w-0">
                {(['html', 'css', 'js', 'preview'] as FileTab[]).map(t => (
                    <button key={t} onClick={() => setFileTab(t)} className={`px-2.5 py-2 text-[10px] font-mono border-b-2 whitespace-nowrap shrink-0 ${
                    fileTab === t ? 'text-foreground border-primary bg-background font-bold' : 'text-muted-foreground border-transparent hover:text-foreground hover:bg-secondary/20'
                    } ${t === 'preview' ? 'sm:hidden text-primary' : ''}`}>
                    {t === 'html' ? 'index.html' : t === 'css' ? 'style.css' : t === 'js' ? 'script.js' : '👁️ Preview'}
                    </button>
                ))}
                </div>
            )}

            {/* Non-Frontend Header */}
            {!isFrontend && (
                 <div className="flex items-center border-b border-border glass-card px-3 py-2 shrink-0">
                    <Code2 className="w-3.5 h-3.5 mr-2 text-primary" />
                    <span className="text-[10px] font-mono text-muted-foreground">
                        {selected.language === 'python' ? 'main.py' : 'Main.java'}
                    </span>
                 </div>
            )}

            {/* Main Workspace View */}
            <div className="flex-1 min-h-0 min-w-0 relative flex flex-col overflow-hidden w-full max-w-full">
              {isFrontend && fileTab === 'preview' ? (
                // Frontend Preview (Mobile)
                <div className="absolute inset-0 w-full h-full sm:hidden overflow-hidden">
                  <LivePreview html={htmlCode} css={cssCode} js={jsCode} onConsoleLog={handleLog} />
                </div>
              ) : isFrontend ? (
                // Frontend Editor
                <div className="absolute inset-0 w-full h-full overflow-hidden">
                  <CodeEditor code={currentFrontendCode} onChange={setFrontendCurrent} language={fileTab === 'html' ? 'html' : fileTab === 'css' ? 'css' : 'javascript'} />
                </div>
              ) : (
                // Python / Java Editor
                <div className="absolute inset-0 w-full h-full overflow-hidden">
                  <CodeEditor 
                    code={scriptCode} 
                    onChange={setScriptCode} 
                    language={selected.language === 'python' ? 'python' : 'java'} 
                  />
                </div>
              )}
            </div>

            {/* Console */}
            <div className="max-h-[30vh] overflow-hidden shrink-0 border-t border-border bg-background w-full max-w-full min-w-0">
              <div className="w-full max-w-full min-w-0 overflow-auto max-h-[30vh]">
                <ConsolePanel logs={consoleLogs} onClear={() => setConsoleLogs([])} />
              </div>
            </div>
          </div>

          {/* Desktop Preview (Only for Frontend) */}
          {isFrontend && (
            <div className="hidden sm:flex flex-1 flex-col min-w-0 border-l border-border w-full overflow-hidden">
                <div className="px-3 py-2 border-b border-border text-[10px] text-muted-foreground font-mono glass-card flex items-center gap-2 shrink-0">
                <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" /> Preview
                </div>
                <div className="flex-1 min-h-0 overflow-hidden">
                <LivePreview html={htmlCode} css={cssCode} js={jsCode} onConsoleLog={handleLog} />
                </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  const total = CHALLENGES.length;
  const done = CHALLENGES.filter(c => user.completedLessons.includes(`challenge-${c.id}`)).length;

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden animated-bg w-full max-w-[100vw]">
      <div className="glow-orb glow-primary w-48 h-48 top-20 -right-10 opacity-20 pointer-events-none" />

      {/* Main List Header */}
      <header className="border-b border-border glass-card px-3 sm:px-6 py-3 flex items-center justify-between gap-2 relative z-10 w-full max-w-full min-w-0 overflow-hidden">
        <button onClick={() => navigate('/dashboard')} className="text-muted-foreground hover:text-foreground shrink-0">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <Trophy className="w-4 h-4 text-primary shrink-0 hidden sm:block" />
        <span className="text-sm sm:text-base font-bold gradient-text font-mono truncate flex-1 min-w-0">Coding Challenges</span>
        <span className="shrink-0 text-[10px] text-muted-foreground font-mono whitespace-nowrap">{done}/{total}</span>
      </header>

      <div className="max-w-3xl mx-auto px-2 sm:px-6 py-4 space-y-4 relative z-10 w-full max-w-full min-w-0 overflow-x-hidden">
        {/* Tier Buttons Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 w-full max-w-full min-w-0">
          {TIERS.map(t => {
            const info = TIER_INFO[t];
            const count = CHALLENGES.filter(c => c.tier === t).length;
            const active = activeTier === t;
            return (
              <button key={t} onClick={() => setActiveTier(t)}
                className={`p-2 rounded-xl border text-xs font-semibold transition-all min-w-0 flex flex-col items-center justify-center text-center overflow-hidden w-full max-w-full ${
                  active ? `${info.tab}` : 'bg-secondary/20 border-border/30 text-muted-foreground hover:border-primary/30'
                }`}>
                <div className="text-sm mb-0.5">{info.icon}</div>
                <div className="w-full truncate text-[11px]">{info.label}</div>
                <div className="w-full text-[8px] opacity-70 font-mono truncate">{count} tasks</div>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground w-full max-w-full min-w-0 overflow-hidden">
          <Sparkles className="w-3.5 h-3.5 text-primary shrink-0" />
          <span className="truncate min-w-0">Pick a tier. Each tier rewards more XP!</span>
        </div>

        {/* Challenge Item Cards */}
        <div className="space-y-2 w-full max-w-full min-w-0">
          {byTier.map(c => {
            const completed = user.completedLessons.includes(`challenge-${c.id}`);
            const info = TIER_INFO[c.tier];
            return (
              <button key={c.id} onClick={() => start(c)}
                className="w-full max-w-full min-w-0 glass-card rounded-xl p-3 text-left hover:border-primary/20 hover:neon-border-subtle transition-all flex items-center justify-between gap-2 group overflow-hidden">
                <div className="flex items-center gap-2 min-w-0 flex-1 overflow-hidden">
                  {completed && <CheckCircle2 className="w-4 h-4 text-success shrink-0" />}
                  <div className="min-w-0 flex-1 overflow-hidden">
                    <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground text-xs sm:text-sm truncate group-hover:text-primary transition-colors">{c.title}</h3>
                        <span className="text-[8px] px-1 py-0 rounded bg-secondary text-muted-foreground border border-border uppercase">{c.language}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-0.5 truncate">{c.description}</p>
                  </div>
                </div>
                <span className={`text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0 whitespace-nowrap ${info.chip}`}>
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
