import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  ArrowLeft,
  BookOpen,
  Lightbulb,
  Sparkles,
  ArrowRight,
  Clock,
  Layers,
  Code2,
  Play,
  Terminal,
  Check,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  Building2,
  Cpu
} from 'lucide-react';
import { DsaProblem, SupportedLanguage, DSA_PROBLEMS } from '@/data/dsaSheetData';
import PythonWorkspace from '@/components/PythonWorkspace';
import CppWorkspace from '@/components/CppWorkspace';
import JavaWorkspace from '@/components/JavaWorkspace';
import CodeEditor from '@/components/CodeEditor';
import ConsolePanel from '@/components/ConsolePanel';
import { AdBannerCard } from '@/components/AdBannerCard';
import { toast } from 'sonner';

interface DsaWorkspaceProps {
  problem: DsaProblem;
  isSolved: boolean;
  onToggleSolved: (problemId: string) => void;
  onClose?: () => void;
  onSelectProblem?: (problem: DsaProblem) => void;
}

type StageKey = 'problem' | 'code' | 'hints' | 'solution';

const STAGES: { key: StageKey; label: string; hint: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: 'problem', label: 'Problem & Dry Run', hint: 'Specs, examples & visual trace', icon: BookOpen },
  { key: 'code', label: 'Code Lab', hint: 'Multi-language IDE & terminal', icon: Terminal },
  { key: 'hints', label: 'Intuition & Pattern', hint: 'Mental model & complexity', icon: Lightbulb },
  { key: 'solution', label: 'Optimal Solution', hint: 'Reference code in 4 languages', icon: Sparkles },
];

export const DsaWorkspace: React.FC<DsaWorkspaceProps> = ({
  problem,
  isSolved,
  onToggleSolved,
  onClose,
  onSelectProblem,
}) => {
  const [lang, setLang] = useState<SupportedLanguage>('python');
  const [stage, setStage] = useState<StageKey>('problem');
  const [jsLogs, setJsLogs] = useState<{ type: string; message: string }[]>([]);
  const [selectedTestCaseIdx, setSelectedTestCaseIdx] = useState(0);
  const [openIntuition, setOpenIntuition] = useState<number>(0);
  const [currentCode, setCurrentCode] = useState<string>(() => {
    return localStorage.getItem(`codesage_dsa_code_${problem.id}_python`) || problem.starterCode.python;
  });

  // Find previous & next problem for smooth sequential navigation
  const currentIndex = DSA_PROBLEMS.findIndex(p => p.id === problem.id);
  const prevProblem = currentIndex > 0 ? DSA_PROBLEMS[currentIndex - 1] : null;
  const nextProblem = currentIndex >= 0 && currentIndex < DSA_PROBLEMS.length - 1 ? DSA_PROBLEMS[currentIndex + 1] : null;

  // Whenever problem or language switches, load saved code or starter code
  useEffect(() => {
    const saved = localStorage.getItem(`codesage_dsa_code_${problem.id}_${lang}`);
    setCurrentCode(saved || problem.starterCode[lang]);
    setJsLogs([]);
    setSelectedTestCaseIdx(0);
  }, [problem.id, lang, problem.starterCode]);

  const handleCodeChange = (newCode: string) => {
    setCurrentCode(newCode);
    localStorage.setItem(`codesage_dsa_code_${problem.id}_${lang}`, newCode);
  };

  const handleResetStarter = () => {
    const fresh = problem.starterCode[lang];
    setCurrentCode(fresh);
    localStorage.setItem(`codesage_dsa_code_${problem.id}_${lang}`, fresh);
    toast.info('Reset to starter code template');
  };

  // Safe client-side JS runner for JavaScript tab
  const handleRunJs = () => {
    const logs: { type: string; message: string }[] = [];
    const origLog = console.log;
    const origError = console.error;
    const origWarn = console.warn;

    try {
      console.log = (...args: unknown[]) => {
        logs.push({
          type: 'log',
          message: args.map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' ')
        });
        origLog(...args);
      };
      console.error = (...args: unknown[]) => {
        logs.push({
          type: 'error',
          message: args.map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' ')
        });
        origError(...args);
      };
      console.warn = (...args: unknown[]) => {
        logs.push({
          type: 'warn',
          message: args.map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' ')
        });
        origWarn(...args);
      };

      const runner = new Function('console', `${currentCode}\nreturn true;`);
      runner(console);
      toast.success('JavaScript executed in browser sandbox');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      logs.push({ type: 'error', message: `Runtime Error: ${msg}` });
      toast.error('JavaScript execution failed');
    } finally {
      console.log = origLog;
      console.error = origError;
      console.warn = origWarn;
      setJsLogs(logs);
    }
  };

  const stageIndex = STAGES.findIndex(s => s.key === stage);
  const journeyPct = Math.round(((stageIndex + 1) / STAGES.length) * 100);
  const activeTestCase = problem.testCases[selectedTestCaseIdx] || problem.testCases[0];

  return (
    <div className="min-h-screen bg-background grid-bg relative overflow-x-hidden text-foreground">
      {/* Ambient background glow matching CodeSage lessons */}
      <div className="absolute top-[-10%] right-[-5%] w-[360px] h-[360px] rounded-full bg-primary/5 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-15%] left-[-10%] w-[420px] h-[420px] rounded-full bg-accent-blue/5 blur-[150px] pointer-events-none" />

      {/* Sticky Top Header matching LessonPage */}
      <header className="sticky top-0 z-30 border-b border-border/30 bg-background/85 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-3 md:px-5 py-2.5 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            {onClose && (
              <button
                onClick={onClose}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-secondary/40 hover:bg-secondary text-muted-foreground hover:text-foreground text-xs font-medium transition-colors shrink-0"
                title="Back to DSA Sheet"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">DSA Sheet</span>
              </button>
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground">
                <span className="text-primary font-semibold">PROBLEM #{String(problem.number).padStart(2, '0')}</span>
                <span aria-hidden="true">·</span>
                <span className="truncate">{problem.category}</span>
                <span aria-hidden="true">·</span>
                <span
                  className={
                    problem.difficulty === 'Easy'
                      ? 'text-emerald-400 font-semibold'
                      : problem.difficulty === 'Medium'
                      ? 'text-amber-400 font-semibold'
                      : 'text-rose-400 font-semibold'
                  }
                >
                  {problem.difficulty}
                </span>
              </div>
              <h1 className="font-display font-bold text-sm md:text-base text-foreground truncate">
                {problem.title}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Prev / Next Problem Switcher */}
            {onSelectProblem && (
              <div className="hidden md:flex items-center gap-1 bg-secondary/30 border border-border/30 rounded-xl p-0.5">
                <button
                  disabled={!prevProblem}
                  onClick={() => prevProblem && onSelectProblem(prevProblem)}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
                  title={prevProblem ? `Previous: #${prevProblem.number} ${prevProblem.title}` : 'First problem'}
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <span className="text-[10px] font-mono text-muted-foreground px-1.5 tabular-nums">
                  {problem.number}/{DSA_PROBLEMS.length}
                </span>
                <button
                  disabled={!nextProblem}
                  onClick={() => nextProblem && onSelectProblem(nextProblem)}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
                  title={nextProblem ? `Next: #${nextProblem.number} ${nextProblem.title}` : 'Last problem'}
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-mono px-2.5 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary shrink-0">
              <Sparkles className="w-3 h-3" /> +1 XP · +2 ◈
            </div>

            <button
              onClick={() => onToggleSolved(problem.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-display font-bold transition-all whitespace-nowrap ${
                isSolved
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'bg-primary text-primary-foreground hover:neon-glow'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{isSolved ? 'Solved' : 'Mark Solved'}</span>
            </button>
          </div>
        </div>

        {/* Top Progress Hairline */}
        <div className="h-0.5 bg-secondary/40">
          <div
            className="h-full bg-gradient-to-r from-primary to-emerald-400 transition-all duration-500"
            style={{ width: `${Math.max(journeyPct, 15)}%` }}
          />
        </div>
      </header>

      {/* Main Content Layout with Stage Rail (Matches PythonLessonPage) */}
      <div className="max-w-6xl mx-auto px-3 md:px-5 py-4 md:py-6 pb-20 md:pb-24 md:flex md:gap-6 relative z-10">
        {/* Left Stage Rail */}
        <nav className="md:w-56 md:shrink-0 mb-4 md:mb-0">
          <div className="md:sticky md:top-20 space-y-3">
            <div className="grid grid-cols-2 md:grid-cols-1 gap-2">
              {STAGES.map((s, i) => {
                const active = stage === s.key;
                const done = i < stageIndex || (s.key === 'code' && isSolved);
                return (
                  <button
                    key={s.key}
                    onClick={() => setStage(s.key)}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-left transition-all ${
                      active
                        ? 'border-primary/50 bg-primary/10 text-primary shadow-[0_0_20px_-8px_hsl(var(--primary))]'
                        : 'border-border/30 bg-card/40 text-muted-foreground hover:border-primary/25 hover:text-foreground'
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-lg grid place-items-center shrink-0 border text-[10px] font-mono ${
                        done
                          ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-400'
                          : 'border-current/30 bg-background/40'
                      }`}
                    >
                      {done ? <Check className="w-3 h-3" /> : <s.icon className="w-3 h-3" />}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-xs font-display font-semibold leading-tight truncate">
                        {s.label}
                      </span>
                      <span className="hidden md:block text-[10px] opacity-70 leading-tight truncate">
                        {s.hint}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Target Complexity Card in Rail */}
            <div className="hidden md:block glass-card rounded-2xl p-3.5 border border-border/30 space-y-2">
              <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                Target Complexity
              </p>
              <div className="space-y-1.5 text-xs font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-primary" /> Time
                  </span>
                  <span className="text-primary font-semibold">{problem.timeComplexity}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-accent-blue" /> Space
                  </span>
                  <span className="text-accent-blue font-semibold">{problem.spaceComplexity}</span>
                </div>
              </div>
              {problem.companies && problem.companies.length > 0 && (
                <div className="pt-2 border-t border-border/20">
                  <p className="text-[10px] font-mono text-muted-foreground mb-1 flex items-center gap-1">
                    <Building2 className="w-3 h-3 text-primary" /> Asked At
                  </p>
                  <p className="text-[11px] text-foreground/85 leading-relaxed">
                    {problem.companies.join(' · ')}
                  </p>
                </div>
              )}
            </div>

            {/* Sponsor Ad Rail */}
            <div className="hidden md:block pt-1">
              <AdBannerCard slotName="lessonSidebar" format="compact" />
            </div>
          </div>
        </nav>

        {/* Main Stage Content */}
        <main className="flex-1 min-w-0">
          {/* STAGE 1: PROBLEM & INTERACTIVE DRY RUN */}
          {stage === 'problem' && (
            <div className="space-y-5 animate-fade-in">
              {/* Mission Brief Card */}
              <section className="relative overflow-hidden rounded-3xl border border-primary/25 bg-gradient-to-br from-primary/12 via-card/60 to-transparent p-5">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <p className="text-[10px] font-mono text-primary uppercase tracking-[0.2em]">
                    Algorithmic Specification
                  </p>
                  <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                    <span>Time: <strong className="text-primary">{problem.timeComplexity}</strong></span>
                    <span aria-hidden="true">·</span>
                    <span>Space: <strong className="text-accent-blue">{problem.spaceComplexity}</strong></span>
                  </div>
                </div>
                <h2 className="text-base md:text-lg font-display font-bold text-foreground mb-2">
                  {problem.number}. {problem.title}
                </h2>
                <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                  {problem.summary}
                </p>
                <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-primary/15 blur-3xl pointer-events-none" />
              </section>

              {/* Problem Statement Card */}
              <div className="glass-card rounded-2xl p-5 border border-border/30 space-y-4">
                <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.18em]">
                  Problem Statement
                </p>
                <div className="whitespace-pre-line text-xs md:text-sm text-foreground/90 leading-relaxed">
                  {problem.description}
                </div>
              </div>

              {/* Interactive Dry-Run Test Case Inspector */}
              {problem.testCases.length > 0 && (
                <div className="glass-card rounded-2xl p-5 border border-primary/20 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-[10px] font-mono text-primary uppercase tracking-[0.18em]">
                        Interactive Test Case Inspector
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Click any test case to inspect input state and expected output before coding.
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 bg-secondary/40 p-1 rounded-xl border border-border/30">
                      {problem.testCases.map((tc, idx) => (
                        <button
                          key={tc.id}
                          onClick={() => setSelectedTestCaseIdx(idx)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all whitespace-nowrap ${
                            selectedTestCaseIdx === idx
                              ? 'bg-primary text-primary-foreground font-semibold'
                              : 'text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          {tc.label || `Case ${idx + 1}`}
                        </button>
                      ))}
                    </div>
                  </div>

                  {activeTestCase && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div className="rounded-xl bg-secondary/30 border border-border/40 p-3.5 font-mono text-xs space-y-1">
                        <span className="text-[10px] text-muted-foreground uppercase block">Input Parameters</span>
                        <div className="text-foreground font-semibold break-all">{activeTestCase.input}</div>
                      </div>
                      <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-3.5 font-mono text-xs space-y-1">
                        <span className="text-[10px] text-emerald-400 uppercase block">Expected Return</span>
                        <div className="text-emerald-300 font-semibold break-all">{activeTestCase.expected}</div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Examples Breakdown */}
              <div className="space-y-3">
                <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.18em]">
                  Trace Examples ({problem.examples.length})
                </p>
                <div className="grid grid-cols-1 gap-3">
                  {problem.examples.map((ex, idx) => (
                    <div
                      key={idx}
                      className="glass-card rounded-2xl p-4 border border-border/30 space-y-2"
                    >
                      <div className="text-[10px] font-mono text-primary uppercase">
                        Example {idx + 1}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-xs">
                        <div className="p-2.5 rounded-xl bg-secondary/30 border border-border/30">
                          <span className="text-muted-foreground">Input: </span>
                          <span className="text-foreground">{ex.input}</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-secondary/30 border border-border/30">
                          <span className="text-muted-foreground">Output: </span>
                          <span className="text-primary font-semibold">{ex.output}</span>
                        </div>
                      </div>
                      {ex.explanation && (
                        <p className="text-xs text-muted-foreground leading-relaxed pt-1">
                          <strong className="text-foreground/85">Walkthrough: </strong>
                          {ex.explanation}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Constraints */}
              {problem.constraints.length > 0 && (
                <div className="glass-card rounded-2xl p-4 border border-border/30 space-y-2">
                  <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.18em]">
                    Input Constraints & Bounds
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {problem.constraints.map((c, i) => (
                      <code
                        key={i}
                        className="text-xs font-mono px-2.5 py-1 rounded-lg bg-secondary/40 border border-border/30 text-foreground/90"
                      >
                        {c}
                      </code>
                    ))}
                  </div>
                </div>
              )}

              {/* Bottom CTA to jump to Code Lab */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => setStage('hints')}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-border/40 bg-card/40 hover:border-primary/30 text-xs font-display font-semibold text-foreground transition-all"
                >
                  <Lightbulb className="w-4 h-4 text-amber-400" />
                  <span>Read Intuition First</span>
                </button>
                <button
                  onClick={() => setStage('code')}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-display font-bold hover:neon-glow transition-all"
                >
                  <Code2 className="w-4 h-4" />
                  <span>Open Code Lab</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STAGE 2: MULTI-LANGUAGE CODE LAB & TERMINAL */}
          {stage === 'code' && (
            <div className="space-y-4 animate-fade-in">
              {/* Language & Problem Summary Bar */}
              <section className="glass-card rounded-2xl p-4 border border-primary/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 text-[10px] font-mono text-primary uppercase tracking-wider">
                    <Cpu className="w-3.5 h-3.5" />
                    <span>Interactive Multi-Language Sandbox</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {problem.summary}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                  <div className="flex items-center bg-secondary/50 p-1 rounded-xl border border-border/40">
                    {(['python', 'javascript', 'cpp', 'java'] as SupportedLanguage[]).map(l => (
                      <button
                        key={l}
                        onClick={() => setLang(l)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all whitespace-nowrap ${
                          lang === l
                            ? 'bg-primary text-primary-foreground font-bold shadow-sm'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {l === 'python'
                          ? 'Python 3'
                          : l === 'javascript'
                          ? 'JavaScript'
                          : l === 'cpp'
                          ? 'C++ 20'
                          : 'Java 17'}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={handleResetStarter}
                    className="p-2 rounded-xl bg-secondary/40 hover:bg-secondary text-muted-foreground hover:text-foreground border border-border/30 transition-colors"
                    title="Reset to starter template"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </section>

              {/* Quick Reference Test Cases Bar */}
              {problem.testCases.length > 0 && (
                <div className="glass-card rounded-2xl p-3.5 border border-border/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
                  <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
                    <span className="text-[10px] text-muted-foreground uppercase shrink-0">Sample Verify:</span>
                    {problem.testCases.map((tc, idx) => (
                      <button
                        key={tc.id}
                        onClick={() => setSelectedTestCaseIdx(idx)}
                        className={`px-2 py-0.5 rounded-md text-[11px] transition-colors whitespace-nowrap ${
                          selectedTestCaseIdx === idx
                            ? 'bg-primary/20 text-primary border border-primary/30'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        Case {idx + 1}
                      </button>
                    ))}
                  </div>
                  {activeTestCase && (
                    <div className="text-[11px] text-muted-foreground truncate">
                      Input: <span className="text-foreground">{activeTestCase.input}</span> → Expected:{' '}
                      <span className="text-emerald-400 font-semibold">{activeTestCase.expected}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Spacious 80vh Code Editor + Terminal Container (Matches PythonLessonPage) */}
              <div className="glass-card rounded-2xl overflow-hidden border border-border/40 shadow-2xl h-[78vh] min-h-[520px] flex flex-col">
                {lang === 'python' && (
                  <PythonWorkspace
                    key={`python-${problem.id}`}
                    embedded={true}
                    initialCode={currentCode}
                    onCodeChange={handleCodeChange}
                  />
                )}

                {lang === 'cpp' && (
                  <CppWorkspace
                    key={`cpp-${problem.id}`}
                    embedded={true}
                    initialCode={currentCode}
                    onCodeChange={handleCodeChange}
                  />
                )}

                {lang === 'java' && (
                  <JavaWorkspace
                    key={`java-${problem.id}`}
                    embedded={true}
                    initialCode={currentCode}
                    onCodeChange={handleCodeChange}
                  />
                )}

                {lang === 'javascript' && (
                  <div className="flex flex-col h-full w-full overflow-hidden bg-background">
                    <div className="flex items-center justify-between px-3 py-2 bg-secondary/40 border-b border-border/30 shrink-0">
                      <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-primary">
                        <Terminal className="w-3 h-3" /> JavaScript V8 Sandbox
                      </div>
                      <button
                        onClick={handleRunJs}
                        className="flex items-center gap-1 bg-primary text-primary-foreground text-[11px] font-semibold px-3 py-1 rounded-lg neon-glow transition-all"
                      >
                        <Play className="w-3 h-3" /> Run Code
                      </button>
                    </div>
                    <div className="flex-1 min-h-0 border-b border-border/30 flex flex-col">
                      <CodeEditor
                        code={currentCode}
                        onChange={handleCodeChange}
                        language="javascript"
                        showShortcuts={false}
                      />
                    </div>
                    <div className="flex-1 min-h-0 flex flex-col bg-zinc-950 overflow-hidden">
                      <ConsolePanel logs={jsLogs} onClear={() => setJsLogs([])} />
                    </div>
                  </div>
                )}
              </div>

              {/* Footer Actions under Code Lab */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <button
                  onClick={() => setStage('hints')}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border/40 bg-card/40 hover:border-primary/30 text-xs font-display font-semibold text-muted-foreground hover:text-foreground transition-all"
                >
                  <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                  <span>Need a Hint?</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onToggleSolved(problem.id)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-display font-bold transition-all ${
                      isSolved
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'bg-primary text-primary-foreground hover:neon-glow'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isSolved ? 'Completed ✓' : 'Mark Problem Solved'}</span>
                  </button>
                  {nextProblem && onSelectProblem && (
                    <button
                      onClick={() => {
                        onSelectProblem(nextProblem);
                        setStage('problem');
                      }}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-secondary/50 hover:bg-secondary text-foreground text-xs font-display font-semibold border border-border/40 transition-all"
                    >
                      <span>Next Problem</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STAGE 3: KEY INTUITION & PATTERN (Accordion Spine like PythonLessonPage) */}
          {stage === 'hints' && (
            <div className="space-y-5 animate-fade-in">
              <section className="relative overflow-hidden rounded-3xl border border-amber-500/25 bg-gradient-to-br from-amber-500/10 via-card/60 to-transparent p-5">
                <p className="text-[10px] font-mono text-amber-400 uppercase tracking-[0.2em] mb-1.5 flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5" /> Algorithmic Intuition
                </p>
                <h2 className="font-display font-bold text-base md:text-lg text-foreground mb-1">
                  How to Think About "{problem.title}"
                </h2>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Step through each insight below before looking at the reference implementation.
                </p>
              </section>

              {/* Accordion Spine matching LessonPage */}
              <div className="relative pl-5">
                <span className="absolute left-[9px] top-2 bottom-2 w-px bg-gradient-to-b from-primary/50 via-border/40 to-transparent" />
                <div className="space-y-2.5">
                  {problem.keyPoints.map((point, i) => {
                    const open = openIntuition === i;
                    return (
                      <div key={i} className="relative">
                        <span
                          className={`absolute -left-5 top-4 w-[11px] h-[11px] rounded-full border-2 transition-colors ${
                            open ? 'bg-primary border-primary' : 'bg-background border-border'
                          }`}
                        />
                        <button
                          onClick={() => setOpenIntuition(open ? -1 : i)}
                          className={`w-full text-left glass-card rounded-2xl px-4 py-3.5 border transition-all ${
                            open ? 'border-primary/35' : 'border-border/25 hover:border-primary/20'
                          }`}
                        >
                          <span className="flex items-center gap-2.5">
                            <span className="text-[10px] font-mono text-primary font-bold">
                              {String(i + 1).padStart(2, '0')}
                            </span>
                            <span className="flex-1 font-display font-bold text-xs sm:text-sm text-foreground">
                              {i === 0
                                ? 'Brute-Force Baseline & Bottleneck'
                                : i === 1
                                ? 'Core Data Structure / Pattern Insight'
                                : i === 2
                                ? 'Algorithmic Execution & Edge Cases'
                                : `Complexity & Optimization Note #${i + 1}`}
                            </span>
                            <ChevronRight
                              className={`w-4 h-4 text-muted-foreground transition-transform ${
                                open ? 'rotate-90 text-primary' : ''
                              }`}
                            />
                          </span>
                          {open && (
                            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mt-2.5 animate-fade-in">
                              {point}
                            </p>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Complexity Summary Card */}
              <div className="glass-card rounded-2xl p-4 border border-border/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                    Optimal Complexity Target
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Aim for these bounds in your interview solution:
                  </p>
                </div>
                <div className="flex items-center gap-4 text-xs font-mono">
                  <div>
                    <span className="text-muted-foreground">Time: </span>
                    <strong className="text-primary">{problem.timeComplexity}</strong>
                  </div>
                  <span aria-hidden="true">·</span>
                  <div>
                    <span className="text-muted-foreground">Space: </span>
                    <strong className="text-accent-blue">{problem.spaceComplexity}</strong>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => setStage('solution')}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-border/40 bg-card/40 hover:border-primary/30 text-xs font-display font-semibold text-foreground transition-all"
                >
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>View Optimal Solution</span>
                </button>
                <button
                  onClick={() => setStage('code')}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-display font-bold hover:neon-glow transition-all"
                >
                  <Code2 className="w-4 h-4" />
                  <span>Try in Code Lab</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STAGE 4: OPTIMAL SOLUTION & REFERENCE CODE */}
          {stage === 'solution' && (
            <div className="space-y-5 animate-fade-in">
              <section className="relative overflow-hidden rounded-3xl border border-emerald-500/25 bg-gradient-to-br from-emerald-500/10 via-card/60 to-transparent p-5">
                <p className="text-[10px] font-mono text-emerald-400 uppercase tracking-[0.2em] mb-1.5 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Official Reference Walkthrough
                </p>
                <h2 className="font-display font-bold text-base md:text-lg text-foreground mb-2">
                  Optimal Approach — {problem.title}
                </h2>
                <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed">
                  {problem.solutionExplanation}
                </p>
              </section>

              <div className="glass-card rounded-2xl p-4 sm:p-5 border border-border/30 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center bg-secondary/50 p-1 rounded-xl border border-border/40">
                    {(['python', 'javascript', 'cpp', 'java'] as SupportedLanguage[]).map(l => (
                      <button
                        key={l}
                        onClick={() => setLang(l)}
                        className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-all ${
                          lang === l
                            ? 'bg-primary text-primary-foreground font-bold'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {l === 'python'
                          ? 'Python 3'
                          : l === 'javascript'
                          ? 'JavaScript'
                          : l === 'cpp'
                          ? 'C++ 20'
                          : 'Java 17'}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      handleCodeChange(problem.solutionCode[lang]);
                      setStage('code');
                      toast.success('Optimal solution loaded into Code Lab!');
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-display font-bold hover:neon-glow transition-all"
                  >
                    <span>Load into Code Lab</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <pre className="p-4 rounded-xl bg-zinc-950 border border-border/40 text-xs font-mono text-emerald-300 overflow-x-auto leading-relaxed">
                  <code>{problem.solutionCode[lang]}</code>
                </pre>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default DsaWorkspace;
