import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Code2,
  CheckCircle2,
  Circle,
  Search,
  Filter,
  Sparkles,
  Trophy,
  Lightbulb,
  Play,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Clock,
  Layers,
  Award,
  BookOpen,
  ArrowLeft,
  X
} from 'lucide-react';
import {
  DSA_PROBLEMS,
  DSA_CATEGORIES,
  DsaProblem,
  DsaCategory,
  DsaDifficulty
} from '@/data/dsaSheetData';
import DsaWorkspace from '@/components/DsaWorkspace';
import { toast } from 'sonner';

const STORAGE_SOLVED_KEY = 'codesage_dsa_solved_ids';

export const DsaSheet = () => {
  const navigate = useNavigate();

  // Solved state in localStorage
  const [solvedIds, setSolvedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_SOLVED_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Solved' | 'Unsolved'>('All');

  // Active Problem for Workspace Modal
  const [activeProblem, setActiveProblem] = useState<DsaProblem | null>(null);

  // Quick Key Points Modal
  const [keyPointsProblem, setKeyPointsProblem] = useState<DsaProblem | null>(null);

  // Accordion collapsed state for categories
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});

  useEffect(() => {
    localStorage.setItem(STORAGE_SOLVED_KEY, JSON.stringify(solvedIds));
  }, [solvedIds]);

  const toggleSolved = (id: string) => {
    setSolvedIds(prev => {
      const isAlready = prev.includes(id);
      if (isAlready) {
        toast.info('Marked as unsolved');
        return prev.filter(x => x !== id);
      } else {
        toast.success('🎉 Problem marked as solved!');
        return [...prev, id];
      }
    });
  };

  const toggleCategoryCollapse = (cat: string) => {
    setCollapsedCategories(prev => ({
      ...prev,
      [cat]: !prev[cat],
    }));
  };

  // Filtered problems
  const filteredProblems = useMemo(() => {
    return DSA_PROBLEMS.filter(p => {
      // Category filter
      if (selectedCategory !== 'All' && p.category !== selectedCategory) {
        return false;
      }
      // Difficulty filter
      if (selectedDifficulty !== 'All' && p.difficulty !== selectedDifficulty) {
        return false;
      }
      // Status filter
      const isSolved = solvedIds.includes(p.id);
      if (statusFilter === 'Solved' && !isSolved) return false;
      if (statusFilter === 'Unsolved' && isSolved) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = p.title.toLowerCase().includes(q);
        const matchesCat = p.category.toLowerCase().includes(q);
        const matchesKeyPoint = p.keyPoints.some(k => k.toLowerCase().includes(q));
        const matchesSummary = p.summary.toLowerCase().includes(q);
        if (!matchesTitle && !matchesCat && !matchesKeyPoint && !matchesSummary) {
          return false;
        }
      }

      return true;
    });
  }, [searchQuery, selectedCategory, selectedDifficulty, statusFilter, solvedIds]);

  // Statistics
  const totalProblems = DSA_PROBLEMS.length;
  const totalSolved = solvedIds.length;
  const progressPct = totalProblems > 0 ? Math.round((totalSolved / totalProblems) * 100) : 0;

  const easyTotal = DSA_PROBLEMS.filter(p => p.difficulty === 'Easy').length;
  const easySolved = DSA_PROBLEMS.filter(p => p.difficulty === 'Easy' && solvedIds.includes(p.id)).length;

  const medTotal = DSA_PROBLEMS.filter(p => p.difficulty === 'Medium').length;
  const medSolved = DSA_PROBLEMS.filter(p => p.difficulty === 'Medium' && solvedIds.includes(p.id)).length;

  const hardTotal = DSA_PROBLEMS.filter(p => p.difficulty === 'Hard').length;
  const hardSolved = DSA_PROBLEMS.filter(p => p.difficulty === 'Hard' && solvedIds.includes(p.id)).length;

  return (
    <div className="min-h-screen bg-[#0f0f1e] text-foreground py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/20 pb-4">
        <div>
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </button>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary shadow-lg shadow-primary/20">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-display font-extrabold tracking-tight text-foreground flex items-center gap-2">
                <span>CodeSage DSA Sheet</span>
                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Top Interview 75
                </span>
              </h1>
              <p className="text-xs md:text-sm text-muted-foreground">
                Master core patterns with multi-language code templates (Python, C++, Java, JS), test runners & key intuition points.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (window.confirm('Reset your solved progress for all DSA problems?')) {
                setSolvedIds([]);
                toast.info('Progress has been reset');
              }
            }}
            className="px-3 py-1.5 rounded-xl text-xs text-muted-foreground hover:text-foreground bg-secondary/30 hover:bg-secondary/60 border border-border/30 transition-colors"
          >
            Reset Progress
          </button>
          <button
            onClick={() => {
              const firstUnsolved = DSA_PROBLEMS.find(p => !solvedIds.includes(p.id)) || DSA_PROBLEMS[0];
              setActiveProblem(firstUnsolved);
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold transition-all shadow-md shadow-primary/20"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Solve Next Problem</span>
          </button>
        </div>
      </div>

      {/* Progress & Overview Dashboard Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Main Progress Bar Card */}
        <div className="sm:col-span-2 lg:col-span-2 p-5 rounded-2xl bg-gradient-to-br from-[#161630] to-[#121226] border border-border/30 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Total Progress
            </span>
            <span className="text-sm font-bold text-primary font-mono">{progressPct}% Complete</span>
          </div>

          <div className="text-2xl md:text-3xl font-extrabold text-foreground font-display flex items-baseline gap-2 mb-3">
            <span>{totalSolved}</span>
            <span className="text-sm text-muted-foreground font-normal">of {totalProblems} solved</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-3 bg-secondary/50 rounded-full overflow-hidden p-0.5 border border-border/30">
            <div
              className="h-full bg-gradient-to-r from-primary via-emerald-400 to-cyan-400 rounded-full transition-all duration-500 shadow-sm"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Easy Breakdown */}
        <div className="p-4 rounded-2xl bg-[#15152a] border border-border/30 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
            <span>Easy</span>
            <span className="font-mono">{easySolved}/{easyTotal}</span>
          </div>
          <div className="text-xl font-bold text-foreground font-mono mt-2">
            {easyTotal > 0 ? Math.round((easySolved / easyTotal) * 100) : 0}%
          </div>
          <div className="w-full h-1.5 bg-secondary/50 rounded-full overflow-hidden mt-2">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${easyTotal > 0 ? (easySolved / easyTotal) * 100 : 0}%` }}
            />
          </div>
        </div>

        {/* Medium Breakdown */}
        <div className="p-4 rounded-2xl bg-[#15152a] border border-border/30 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-bold text-amber-400">
            <span>Medium</span>
            <span className="font-mono">{medSolved}/{medTotal}</span>
          </div>
          <div className="text-xl font-bold text-foreground font-mono mt-2">
            {medTotal > 0 ? Math.round((medSolved / medTotal) * 100) : 0}%
          </div>
          <div className="w-full h-1.5 bg-secondary/50 rounded-full overflow-hidden mt-2">
            <div
              className="h-full bg-amber-500 rounded-full transition-all duration-500"
              style={{ width: `${medTotal > 0 ? (medSolved / medTotal) * 100 : 0}%` }}
            />
          </div>
        </div>

        {/* Hard Breakdown */}
        <div className="p-4 rounded-2xl bg-[#15152a] border border-border/30 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-bold text-rose-400">
            <span>Hard</span>
            <span className="font-mono">{hardSolved}/{hardTotal}</span>
          </div>
          <div className="text-xl font-bold text-foreground font-mono mt-2">
            {hardTotal > 0 ? Math.round((hardSolved / hardTotal) * 100) : 0}%
          </div>
          <div className="w-full h-1.5 bg-secondary/50 rounded-full overflow-hidden mt-2">
            <div
              className="h-full bg-rose-500 rounded-full transition-all duration-500"
              style={{ width: `${hardTotal > 0 ? (hardSolved / hardTotal) * 100 : 0}%` }}
            />
          </div>
        </div>
      </div>

      {/* Filters & Search Control Bar */}
      <div className="p-4 rounded-2xl bg-[#141426] border border-border/30 space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search problem, company, or concept..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-[#181830] border border-border/40 rounded-xl pl-9 pr-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Difficulty & Status Tabs */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Difficulty Filter */}
            <div className="flex items-center bg-[#181830] rounded-xl p-1 border border-border/30 text-xs">
              {(['All', 'Easy', 'Medium', 'Hard'] as const).map(d => (
                <button
                  key={d}
                  onClick={() => setSelectedDifficulty(d)}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    selectedDifficulty === d
                      ? 'bg-primary text-primary-foreground font-bold shadow'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>

            {/* Status Filter */}
            <div className="flex items-center bg-[#181830] rounded-xl p-1 border border-border/30 text-xs">
              {(['All', 'Solved', 'Unsolved'] as const).map(s => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    statusFilter === s
                      ? 'bg-secondary text-foreground font-bold'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Category Horizontal Scrolling Badges */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 scrollbar-none text-xs">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-3 py-1 rounded-xl whitespace-nowrap transition-all font-medium ${
              selectedCategory === 'All'
                ? 'bg-primary/20 text-primary border border-primary/40'
                : 'bg-secondary/30 text-muted-foreground hover:text-foreground hover:bg-secondary/50 border border-transparent'
            }`}
          >
            All Topics ({DSA_PROBLEMS.length})
          </button>
          {DSA_CATEGORIES.map(cat => {
            const count = DSA_PROBLEMS.filter(p => p.category === cat).length;
            const solvedCount = DSA_PROBLEMS.filter(p => p.category === cat && solvedIds.includes(p.id)).length;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-xl whitespace-nowrap transition-all font-medium flex items-center gap-1.5 ${
                  selectedCategory === cat
                    ? 'bg-primary/20 text-primary border border-primary/40'
                    : 'bg-secondary/30 text-muted-foreground hover:text-foreground hover:bg-secondary/50 border border-transparent'
                }`}
              >
                <span>{cat}</span>
                <span className="text-[10px] opacity-75 font-mono">({solvedCount}/{count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Problem Categories & Table */}
      <div className="space-y-4">
        {DSA_CATEGORIES.filter(cat => selectedCategory === 'All' || selectedCategory === cat).map(cat => {
          const problemsInCat = filteredProblems.filter(p => p.category === cat);
          if (problemsInCat.length === 0) return null;

          const isCollapsed = collapsedCategories[cat] || false;
          const solvedInCat = problemsInCat.filter(p => solvedIds.includes(p.id)).length;

          return (
            <div
              key={cat}
              className="rounded-2xl bg-[#141428] border border-border/30 overflow-hidden shadow-lg"
            >
              {/* Category Header */}
              <div
                onClick={() => toggleCategoryCollapse(cat)}
                className="flex items-center justify-between px-5 py-3.5 bg-[#171732] hover:bg-[#1a1a3a] cursor-pointer transition-colors border-b border-border/20 select-none"
              >
                <div className="flex items-center gap-2.5">
                  {isCollapsed ? (
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  )}
                  <h3 className="font-bold text-sm md:text-base text-foreground">
                    {cat}
                  </h3>
                  <span className="text-xs text-muted-foreground font-mono">
                    ({solvedInCat}/{problemsInCat.length} solved)
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-24 h-1.5 bg-secondary/50 rounded-full overflow-hidden hidden sm:block">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{
                        width: `${problemsInCat.length > 0 ? (solvedInCat / problemsInCat.length) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Problem Rows List */}
              {!isCollapsed && (
                <div className="divide-y divide-border/20">
                  {problemsInCat.map(problem => {
                    const isSolved = solvedIds.includes(problem.id);
                    return (
                      <div
                        key={problem.id}
                        className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-3 transition-colors ${
                          isSolved ? 'bg-[#121224]/40 hover:bg-[#15152c]' : 'hover:bg-[#171732]'
                        }`}
                      >
                        {/* Left Side: Checkbox, Number, Title & Tags */}
                        <div className="flex items-start sm:items-center gap-3">
                          <button
                            onClick={() => toggleSolved(problem.id)}
                            className="mt-0.5 sm:mt-0 p-1 rounded-lg text-muted-foreground hover:text-primary transition-colors shrink-0"
                            title={isSolved ? 'Mark as Unsolved' : 'Mark as Solved'}
                          >
                            {isSolved ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-400/20" />
                            ) : (
                              <Circle className="w-5 h-5 hover:text-primary" />
                            )}
                          </button>

                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs font-mono text-muted-foreground font-semibold">
                                #{problem.number}
                              </span>
                              <button
                                onClick={() => setActiveProblem(problem)}
                                className={`text-sm font-semibold hover:text-primary transition-colors text-left ${
                                  isSolved ? 'text-foreground/80 line-through decoration-muted-foreground/40' : 'text-foreground'
                                }`}
                              >
                                {problem.title}
                              </button>
                              <span
                                className={`text-[10px] font-semibold px-2 py-0.2 rounded-full border ${
                                  problem.difficulty === 'Easy'
                                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                    : problem.difficulty === 'Medium'
                                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                                    : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                                }`}
                              >
                                {problem.difficulty}
                              </span>
                            </div>

                            <p className="text-xs text-muted-foreground line-clamp-1">
                              {problem.summary}
                            </p>
                          </div>
                        </div>

                        {/* Right Side: Complexity, Hints trigger & Action Button */}
                        <div className="flex items-center gap-2 sm:self-center self-end shrink-0">
                          <div className="hidden lg:flex items-center gap-2 text-xs font-mono text-muted-foreground px-2 py-1 rounded bg-secondary/20">
                            <span className="text-primary">{problem.timeComplexity}</span>
                            <span>•</span>
                            <span className="text-cyan-400">{problem.spaceComplexity}</span>
                          </div>

                          {/* Quick Key Points Trigger */}
                          <button
                            onClick={() => setKeyPointsProblem(problem)}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-colors"
                            title="View Key Points & Intuition"
                          >
                            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                            <span className="hidden md:inline">Key Points</span>
                          </button>

                          {/* Solve in Workspace Button */}
                          <button
                            onClick={() => setActiveProblem(problem)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold transition-all shadow-sm shadow-primary/20"
                          >
                            <Code2 className="w-3.5 h-3.5" />
                            <span>Solve</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Fullscreen Workspace Modal when problem is selected */}
      {activeProblem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
          <div className="w-full h-full max-w-7xl max-h-[96vh]">
            <DsaWorkspace
              problem={activeProblem}
              isSolved={solvedIds.includes(activeProblem.id)}
              onToggleSolved={toggleSolved}
              onClose={() => setActiveProblem(null)}
            />
          </div>
        </div>
      )}

      {/* Key Points / Intuition Quick Modal */}
      {keyPointsProblem && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-[#16162f] border border-border/40 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border/30 pb-3">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-foreground text-base">
                  Key Intuition: {keyPointsProblem.title}
                </h3>
              </div>
              <button
                onClick={() => setKeyPointsProblem(null)}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-muted-foreground">
              Core mental model and edge cases for this problem:
            </p>

            <div className="space-y-2.5">
              {keyPointsProblem.keyPoints.map((point, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-[#1b1b36] border border-border/30 flex gap-2.5 items-start text-xs text-foreground/90 leading-relaxed"
                >
                  <span className="w-4 h-4 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{point}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="text-xs font-mono text-muted-foreground">
                Complexity: <span className="text-primary">{keyPointsProblem.timeComplexity}</span> | <span className="text-cyan-400">{keyPointsProblem.spaceComplexity}</span>
              </div>
              <button
                onClick={() => {
                  const p = keyPointsProblem;
                  setKeyPointsProblem(null);
                  setActiveProblem(p);
                }}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-colors"
              >
                <span>Open in Workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DsaSheet;
