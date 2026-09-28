import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  X,
  BookOpen,
  Lightbulb,
  Sparkles,
  ArrowRight,
  Clock,
  Layers,
  Code2
} from 'lucide-react';
import { DsaProblem, SupportedLanguage } from '@/data/dsaSheetData';
import PythonWorkspace from '@/components/PythonWorkspace';
import CppWorkspace from '@/components/CppWorkspace';
import JavaWorkspace from '@/components/JavaWorkspace';
import CodeEditor from '@/components/CodeEditor';
import ConsolePanel from '@/components/ConsolePanel';
import { toast } from 'sonner';

interface DsaWorkspaceProps {
  problem: DsaProblem;
  isSolved: boolean;
  onToggleSolved: (problemId: string) => void;
  onClose?: () => void;
}

export const DsaWorkspace: React.FC<DsaWorkspaceProps> = ({
  problem,
  isSolved,
  onToggleSolved,
  onClose,
}) => {
  const [lang, setLang] = useState<SupportedLanguage>('python');
  const [activeTab, setActiveTab] = useState<'problem' | 'hints' | 'solution'>('problem');
  const [jsLogs, setJsLogs] = useState<{ type: string; message: string }[]>([]);
  const [currentCode, setCurrentCode] = useState<string>(() => {
    return localStorage.getItem(`codesage_dsa_code_${problem.id}_python`) || problem.starterCode.python;
  });

  // Whenever problem or language switches, load saved code or starter code
  useEffect(() => {
    const saved = localStorage.getItem(`codesage_dsa_code_${problem.id}_${lang}`);
    setCurrentCode(saved || problem.starterCode[lang]);
    setJsLogs([]);
  }, [problem.id, lang]);

  const handleCodeChange = (newCode: string) => {
    setCurrentCode(newCode);
    localStorage.setItem(`codesage_dsa_code_${problem.id}_${lang}`, newCode);
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
      toast.success('JavaScript executed successfully!');
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

  return (
    <div className="flex flex-col h-full bg-[#121224] text-foreground border border-border/30 rounded-2xl overflow-hidden shadow-2xl">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#181830] border-b border-border/30 shrink-0">
        <div className="flex items-center gap-3">
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-secondary/40 hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
              title="Close Workspace"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-primary/20 text-primary border border-primary/30">
            #{problem.number}
          </span>
          <h2 className="text-sm md:text-base font-bold text-foreground truncate max-w-[200px] md:max-w-md">
            {problem.title}
          </h2>
          <span
            className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
              problem.difficulty === 'Easy'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : problem.difficulty === 'Medium'
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
            }`}
          >
            {problem.difficulty}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Mark Solved Toggle */}
          <button
            onClick={() => onToggleSolved(problem.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              isSolved
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25'
                : 'bg-secondary/60 hover:bg-secondary text-muted-foreground hover:text-foreground border border-border/40'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isSolved ? 'Solved' : 'Mark Solved'}</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Split Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-0 overflow-hidden">
        {/* Left Column: Problem, Key Intuition, Solution (5 cols on lg) */}
        <div className="lg:col-span-5 flex flex-col border-b lg:border-b-0 lg:border-r border-border/30 bg-[#141428] overflow-hidden">
          {/* Sub Navigation Tabs */}
          <div className="flex items-center gap-1 px-3 py-2 bg-[#16162d] border-b border-border/30 shrink-0">
            <button
              onClick={() => setActiveTab('problem')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'problem'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/40'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Description</span>
            </button>
            <button
              onClick={() => setActiveTab('hints')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'hints'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/40'
              }`}
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              <span>Key Points & Intuition</span>
            </button>
            <button
              onClick={() => setActiveTab('solution')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'solution'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/40'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Solution</span>
            </button>
          </div>

          {/* Left Panel Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs md:text-sm leading-relaxed scrollbar-thin">
            {activeTab === 'problem' && (
              <>
                <div>
                  <h3 className="text-base font-bold text-foreground mb-1">
                    {problem.number}. {problem.title}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-primary" /> {problem.timeComplexity}
                    </span>
                    <span className="flex items-center gap-1">
                      <Layers className="w-3 h-3 text-cyan-400" /> {problem.spaceComplexity}
                    </span>
                  </div>
                </div>

                <div className="whitespace-pre-line text-foreground/90 font-sans">
                  {problem.description}
                </div>

                {/* Examples */}
                <div className="space-y-3">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
                    Examples
                  </h4>
                  {problem.examples.map((ex, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-[#1a1a36] border border-border/40 font-mono text-xs space-y-1.5"
                    >
                      <div>
                        <span className="text-primary font-bold">Input: </span>
                        <span className="text-foreground/90">{ex.input}</span>
                      </div>
                      <div>
                        <span className="text-emerald-400 font-bold">Output: </span>
                        <span className="text-foreground/90">{ex.output}</span>
                      </div>
                      {ex.explanation && (
                        <div className="text-muted-foreground font-sans text-[11px] pt-1 border-t border-border/20">
                          <span className="font-semibold text-foreground/80">Explanation: </span>
                          {ex.explanation}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Constraints */}
                {problem.constraints.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
                      Constraints
                    </h4>
                    <ul className="list-disc pl-4 space-y-1 text-xs text-muted-foreground font-mono">
                      {problem.constraints.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}

            {activeTab === 'hints' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs">
                  <Lightbulb className="w-4 h-4 shrink-0 text-amber-400" />
                  <span>
                    Study these core insights before revealing the full solution code to develop deep problem-solving intuition!
                  </span>
                </div>

                <div className="space-y-3">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-foreground">
                    💡 Key Intuition & Problem Points
                  </h4>
                  {problem.keyPoints.map((point, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-[#1b1b36] border border-border/30 flex gap-2.5 items-start"
                    >
                      <div className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <p className="text-xs text-foreground/90 leading-relaxed">{point}</p>
                    </div>
                  ))}
                </div>

                <div className="p-3 rounded-xl bg-secondary/30 border border-border/20 space-y-1">
                  <div className="text-xs font-bold text-foreground">Target Complexity</div>
                  <div className="flex gap-4 text-xs font-mono text-muted-foreground">
                    <span>Time: <strong className="text-primary">{problem.timeComplexity}</strong></span>
                    <span>Space: <strong className="text-cyan-400">{problem.spaceComplexity}</strong></span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'solution' && (
              <div className="space-y-4">
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs">
                  <Sparkles className="w-4 h-4 inline mr-1 text-emerald-400" />
                  <strong>Optimal Solution Explanation:</strong>
                  <p className="mt-1 text-foreground/90 leading-relaxed font-sans">
                    {problem.solutionExplanation}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      {lang.toUpperCase()} Reference Code
                    </span>
                    <button
                      onClick={() => {
                        handleCodeChange(problem.solutionCode[lang]);
                        toast.success('Loaded solution into workspace');
                      }}
                      className="text-xs text-primary hover:underline flex items-center gap-1"
                    >
                      <span>Load into Editor</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                  <pre className="p-3 rounded-xl bg-[#0e0e1e] border border-border/30 text-xs font-mono text-emerald-400 overflow-x-auto leading-relaxed">
                    <code>{problem.solutionCode[lang]}</code>
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Embedded Original Language Workspaces (7 cols on lg) */}
        <div className="lg:col-span-7 flex flex-col bg-[#0f0f20] overflow-hidden">
          {/* Language Selector Bar */}
          <div className="flex items-center justify-between px-4 py-2 bg-[#16162d] border-b border-border/30 shrink-0">
            <div className="flex items-center gap-1.5">
              {(['python', 'javascript', 'cpp', 'java'] as SupportedLanguage[]).map(l => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-all ${
                    lang === l
                      ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary/40'
                  }`}
                >
                  {l === 'python' ? 'Python 3' : l === 'javascript' ? 'JavaScript' : l === 'cpp' ? 'C++ 20' : 'Java 17'}
                </button>
              ))}
            </div>

            <div className="text-[11px] font-mono text-emerald-400/90 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>100% In-Browser Safe</span>
            </div>
          </div>

          {/* Direct Workspace Integration by Language */}
          <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
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
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 min-h-[260px] relative">
                  <CodeEditor
                    code={currentCode}
                    onChange={handleCodeChange}
                    language="javascript"
                    theme="vs-dark"
                    fontSize={13}
                  />
                </div>
                <div className="h-44 border-t border-border/30 flex flex-col bg-[#121226] shrink-0">
                  <div className="flex items-center justify-between px-3 py-1.5 bg-[#171732] border-b border-border/30">
                    <span className="text-xs font-mono text-muted-foreground">
                      JavaScript Console
                    </span>
                    <button
                      onClick={handleRunJs}
                      className="px-3 py-1 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold transition-all shadow-sm"
                    >
                      ▶ Run Code
                    </button>
                  </div>
                  <ConsolePanel
                    logs={jsLogs}
                    onClear={() => setJsLogs([])}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DsaWorkspace;
