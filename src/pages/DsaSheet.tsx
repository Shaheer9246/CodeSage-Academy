import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Code2,
  CheckCircle2,
  Circle,
  Search,
  Sparkles,
  Lightbulb,
  Play,
  ArrowRight,
  ChevronDown,
  ChevronRight,
  ArrowLeft,
  X,
  Flame,
  RotateCcw,
  Share2
} from 'lucide-react';
import {
  DSA_PROBLEMS,
  DSA_CATEGORIES,
  DsaProblem
} from '@/data/dsaSheetData';
import DsaWorkspace from '@/components/DsaWorkspace';
import { AdBannerCard } from '@/components/AdBannerCard';
import { useUser } from '@/contexts/UserContext';
import { useScrollTop } from '@/hooks/useScrollTop';
import { getDailyProblem, claimDailyProblemReward, POTD_REWARD_XP, POTD_REWARD_COINS } from '@/lib/dailyProblem';
import ShareAchievementModal from '@/components/ShareAchievementModal';
import { toast } from 'sonner';

const STORAGE_SOLVED_KEY = 'codesage_dsa_solved_ids';

export const DsaSheet = () => {
  useScrollTop();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, completeLesson, addXp, addCoins } = useUser();
  const [shareProblem, setShareProblem] = useState<DsaProblem | null>(null);

  // Solved state in localStorage + synced with user.completedLessons
  const [solvedIds, setSolvedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_SOLVED_KEY);
      const parsed: string[] = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  // Merge any solved DSA lessons from user profile
  useEffect(() => {
    if (user?.completedLessons) {
      const fromProfile = user.completedLessons
        .filter(id => id.startsWith('dsa-'))
        .map(id => id.replace(/^dsa-sheet-/, ''));
      if (fromProfile.length > 0) {
        setSolvedIds(prev => Array.from(new Set([...prev, ...fromProfile])));
      }
    }
  }, [user?.completedLessons]);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Solved' | 'Unsolved'>('All');

  // Active Problem for Full-Page CodeSage Workspace
  const [activeProblem, setActiveProblem] = useState<DsaProblem | null>(null);

  // Auto-open requested problem from query param (e.g. from Problem of the Day on Dashboard)
  useEffect(() => {
    const requestedId = searchParams.get('problem');
    if (requestedId) {
      const matched = DSA_PROBLEMS.find(p => p.id === requestedId || p.slug === requestedId);
      if (matched) {
        setActiveProblem(matched);
      }
    }
  }, [searchParams]);

  // Quick Key Points Drawer/Modal
  const [keyPointsProblem, setKeyPointsProblem] = useState<DsaProblem | null>(null);

  // Inline reset confirmation state (avoids window.confirm in iframe)
  const [confirmReset, setConfirmReset] = useState(false);

  // Accordion collapsed state for categories
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_SOLVED_KEY, JSON.stringify(solvedIds));
    } catch {
      // ignore storage quota errors
    }
  }, [solvedIds]);

  const toggleSolved = (id: string) => {
    setSolvedIds(prev => {
      const isAlready = prev.includes(id);
      if (isAlready) {
        toast.info('Marked as unsolved');
        return prev.filter(x => x !== id);
      } else {
        // Check if this problem is today's Problem of the Day
        const currentPotd = getDailyProblem(new Date(), user?.completedLessons);
        const isPotd = currentPotd.problem.id === id || currentPotd.problem.slug === id;

        if (isPotd && !currentPotd.bonusClaimed) {
          claimDailyProblemReward(id);
          addXp(POTD_REWARD_XP);
          addCoins(POTD_REWARD_COINS);
          toast.success(`🎉 Problem of the Day Solved! +${POTD_REWARD_XP} XP & +${POTD_REWARD_COINS} Sage Coins awarded!`);
        } else {
          toast.success('Problem solved! +1 XP & +2 Sage Coins awarded');
        }

        if (user) {
          void completeLesson(id);
        }

        // Set share candidate for modal
        const prob = DSA_PROBLEMS.find(p => p.id === id || p.slug === id);
        if (prob) {
          setShareProblem(prob);
        }

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
      if (selectedCategory !== 'All' && p.category !== selectedCategory) {
        return false;
      }
      if (selectedDifficulty !== 'All' && p.difficulty !== selectedDifficulty) {
        return false;
      }
      const isSolved = solvedIds.includes(p.id);
      if (statusFilter === 'Solved' && !isSolved) return false;
      if (statusFilter === 'Unsolved' && isSolved) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = p.title.toLowerCase().includes(q);
        const matchesCat = p.category.toLowerCase().includes(q);
        const matchesCompany = p.companies?.some(c => c.toLowerCase().includes(q)) ?? false;
        const matchesKeyPoint = p.keyPoints.some(k => k.toLowerCase().includes(q));
        const matchesSummary = p.summary.toLowerCase().includes(q);
        if (!matchesTitle && !matchesCat && !matchesCompany && !matchesKeyPoint && !matchesSummary) {
          return false;
        }
      }

      return true;
    });
  }, [searchQuery, selectedCategory, selectedDifficulty, statusFilter, solvedIds]);

  // Statistics
  const totalProblems = DSA_PROBLEMS.length;
  const totalSolved = DSA_PROBLEMS.filter(p => solvedIds.includes(p.id)).length;
  const progressPct = totalProblems > 0 ? Math.round((totalSolved / totalProblems) * 100) : 0;

  const easyTotal = DSA_PROBLEMS.filter(p => p.difficulty === 'Easy').length;
  const easySolved = DSA_PROBLEMS.filter(p => p.difficulty === 'Easy' && solvedIds.includes(p.id)).length;

  const medTotal = DSA_PROBLEMS.filter(p => p.difficulty === 'Medium').length;
  const medSolved = DSA_PROBLEMS.filter(p => p.difficulty === 'Medium' && solvedIds.includes(p.id)).length;

  const hardTotal = DSA_PROBLEMS.filter(p => p.difficulty === 'Hard').length;
  const hardSolved = DSA_PROBLEMS.filter(p => p.difficulty === 'Hard' && solvedIds.includes(p.id)).length;

  // When a problem is active, render the full-page DsaWorkspace (matching Challenges & PythonLessonPage)
  if (activeProblem) {
    return (
      <DsaWorkspace
        problem={activeProblem}
        isSolved={solvedIds.includes(activeProblem.id)}
        onToggleSolved={toggleSolved}
        onClose={() => setActiveProblem(null)}
        onSelectProblem={nextProb => setActiveProblem(nextProb)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background grid-bg relative overflow-x-hidden text-foreground">
      {/* Ambient Background Glows matching Dashboard & Tracks */}
      <div className="absolute top-[-10%] right-[-5%] w-[420px] h-[420px] rounded-full bg-primary/5 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-15%] left-[-10%] w-[480px] h-[480px] rounded-full bg-accent-blue/5 blur-[160px] pointer-events-none" />

      {/* Sticky Glass Header */}
      <header className="border-b border-border/30 backdrop-blur-xl bg-background/80 px-3 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-20 w-full">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1 mr-2">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-muted-foreground hover:text-foreground p-1.5 rounded-xl hover:bg-secondary/40 transition-colors shrink-0"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="w-9 h-9 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary neon-glow shrink-0">
            <Code2 className="w-4 h-4" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-display font-bold text-foreground truncate">
                CodeSage DSA Sheet
              </h1>
              <span className="hidden sm:inline text-[10px] font-mono text-primary">
                · Top Interview {totalProblems}
              </span>
            </div>
            <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
              Curated patterns · Python 3, C++ 20, Java 17 &amp; JS in-browser compiler
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {user && (
            <div className="hidden sm:flex items-center gap-1.5 bg-primary/10 px-2.5 py-1 rounded-full border border-primary/20">
              <Flame className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-bold text-primary font-mono tabular-nums">
                {user.streakCount}d
              </span>
            </div>
          )}

          <button
            onClick={() => {
              const firstUnsolved = DSA_PROBLEMS.find(p => !solvedIds.includes(p.id)) || DSA_PROBLEMS[0];
              setActiveProblem(firstUnsolved);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-display font-bold hover:neon-glow transition-all whitespace-nowrap"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{totalSolved > 0 ? 'Continue Solving' : 'Start First Problem'}</span>
          </button>
        </div>
      </header>

      {/* Main Content Container */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto px-3 sm:px-6 py-5 space-y-5 pb-20 relative z-10"
      >
        {/* Hero Mastery & Difficulty Breakdown HUD */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
          {/* Overall Mastery Progress Card */}
          <div className="lg:col-span-6 glass-card rounded-2xl p-4 sm:p-5 border border-primary/25 relative overflow-hidden flex flex-col justify-between">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent-blue/5 pointer-events-none" />
            <div className="relative z-10 flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-mono text-primary uppercase tracking-wider mb-1">
                  Interview Readiness Tracker
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-display font-black text-foreground tabular-nums">
                    {totalSolved}
                  </span>
                  <span className="text-xs text-muted-foreground font-mono tabular-nums">
                    / {totalProblems} problems mastered ({progressPct}%)
                  </span>
                </div>
              </div>

              {confirmReset ? (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      setSolvedIds([]);
                      setConfirmReset(false);
                      toast.info('DSA Sheet progress reset');
                    }}
                    className="px-2.5 py-1 rounded-lg bg-destructive text-destructive-foreground text-[10px] font-bold"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => setConfirmReset(false)}
                    className="px-2 py-1 rounded-lg bg-secondary text-muted-foreground text-[10px]"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                totalSolved > 0 && (
                  <button
                    onClick={() => setConfirmReset(true)}
                    className="flex items-center gap-1 text-[10px] font-mono text-muted-foreground hover:text-foreground px-2 py-1 rounded-lg bg-secondary/40 hover:bg-secondary transition-colors"
                    title="Reset Solved Progress"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset</span>
                  </button>
                )
              )}
            </div>

            <div className="relative z-10 mt-4 space-y-1.5">
              <div className="w-full h-2.5 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary via-emerald-400 to-accent-blue rounded-full transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground">
                <span>9 Core Algorithmic Patterns</span>
                <span className="text-primary">+1 XP · +2 Coins per problem</span>
              </div>
            </div>
          </div>

          {/* Easy / Medium / Hard Breakdown Cards */}
          <div className="lg:col-span-6 grid grid-cols-3 gap-2.5 sm:gap-3">
            {/* Easy */}
            <button
              onClick={() => setSelectedDifficulty(selectedDifficulty === 'Easy' ? 'All' : 'Easy')}
              className={`glass-card rounded-2xl p-3.5 text-left transition-all flex flex-col justify-between border ${
                selectedDifficulty === 'Easy'
                  ? 'border-emerald-500/50 bg-emerald-500/10'
                  : 'border-border/40 hover:border-emerald-500/30'
              }`}
            >
              <div className="flex items-center justify-between w-full text-xs">
                <span className="font-display font-bold text-emerald-400">Easy</span>
                <span className="font-mono text-[11px] text-muted-foreground tabular-nums">
                  {easySolved}/{easyTotal}
                </span>
              </div>
              <div className="text-lg sm:text-xl font-display font-bold text-foreground font-mono tabular-nums my-1.5">
                {easyTotal > 0 ? Math.round((easySolved / easyTotal) * 100) : 0}%
              </div>
              <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-400 rounded-full transition-all duration-500"
                  style={{ width: `${easyTotal > 0 ? (easySolved / easyTotal) * 100 : 0}%` }}
                />
              </div>
            </button>

            {/* Medium */}
            <button
              onClick={() => setSelectedDifficulty(selectedDifficulty === 'Medium' ? 'All' : 'Medium')}
              className={`glass-card rounded-2xl p-3.5 text-left transition-all flex flex-col justify-between border ${
                selectedDifficulty === 'Medium'
                  ? 'border-amber-500/50 bg-amber-500/10'
                  : 'border-border/40 hover:border-amber-500/30'
              }`}
            >
              <div className="flex items-center justify-between w-full text-xs">
                <span className="font-display font-bold text-amber-400">Medium</span>
                <span className="font-mono text-[11px] text-muted-foreground tabular-nums">
                  {medSolved}/{medTotal}
                </span>
              </div>
              <div className="text-lg sm:text-xl font-display font-bold text-foreground font-mono tabular-nums my-1.5">
                {medTotal > 0 ? Math.round((medSolved / medTotal) * 100) : 0}%
              </div>
              <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-400 rounded-full transition-all duration-500"
                  style={{ width: `${medTotal > 0 ? (medSolved / medTotal) * 100 : 0}%` }}
                />
              </div>
            </button>

            {/* Hard */}
            <button
              onClick={() => setSelectedDifficulty(selectedDifficulty === 'Hard' ? 'All' : 'Hard')}
              className={`glass-card rounded-2xl p-3.5 text-left transition-all flex flex-col justify-between border ${
                selectedDifficulty === 'Hard'
                  ? 'border-rose-500/50 bg-rose-500/10'
                  : 'border-border/40 hover:border-rose-500/30'
              }`}
            >
              <div className="flex items-center justify-between w-full text-xs">
                <span className="font-display font-bold text-rose-400">Hard</span>
                <span className="font-mono text-[11px] text-muted-foreground tabular-nums">
                  {hardSolved}/{hardTotal}
                </span>
              </div>
              <div className="text-lg sm:text-xl font-display font-bold text-foreground font-mono tabular-nums my-1.5">
                {hardTotal > 0 ? Math.round((hardSolved / hardTotal) * 100) : 0}%
              </div>
              <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-rose-400 rounded-full transition-all duration-500"
                  style={{ width: `${hardTotal > 0 ? (hardSolved / hardTotal) * 100 : 0}%` }}
                />
              </div>
            </button>
          </div>
        </div>

        {/* Sponsor Ad Banner (consistent with all Track pages) */}
        <div className="pt-0.5">
          <AdBannerCard slotName="learnTrackPage" format="horizontal-banner" />
        </div>

        {/* Search & Filter Control Card */}
        <div className="glass-card rounded-2xl p-3.5 sm:p-4 border border-border/40 space-y-3">
          <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search problem, company (Google, Meta), or pattern..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-secondary/40 border border-border/50 rounded-xl pl-9 pr-8 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
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

            {/* Segmented Filter Controls */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-between md:justify-end">
              {/* Difficulty Segmented Control */}
              <div className="flex items-center bg-secondary/40 rounded-xl p-1 border border-border/40 text-xs">
                {(['All', 'Easy', 'Medium', 'Hard'] as const).map(d => (
                  <button
                    key={d}
                    onClick={() => setSelectedDifficulty(d)}
                    className={`px-2.5 py-1 rounded-lg transition-all whitespace-nowrap ${
                      selectedDifficulty === d
                        ? 'bg-primary text-primary-foreground font-display font-bold shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>

              {/* Status Segmented Control */}
              <div className="flex items-center bg-secondary/40 rounded-xl p-1 border border-border/40 text-xs">
                {(['All', 'Solved', 'Unsolved'] as const).map(s => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`px-2.5 py-1 rounded-lg transition-all whitespace-nowrap ${
                      statusFilter === s
                        ? 'bg-card text-foreground font-display font-bold border border-border/50 shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Topic Filter Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5 scrollbar-none text-xs">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all font-display font-semibold ${
                selectedCategory === 'All'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-secondary/30 text-muted-foreground hover:text-foreground hover:bg-secondary/60 border border-border/30'
              }`}
            >
              All Patterns ({DSA_PROBLEMS.length})
            </button>
            {DSA_CATEGORIES.map(cat => {
              const count = DSA_PROBLEMS.filter(p => p.category === cat).length;
              const solvedCount = DSA_PROBLEMS.filter(p => p.category === cat && solvedIds.includes(p.id)).length;
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(active ? 'All' : cat)}
                  className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all font-display font-semibold flex items-center gap-1.5 ${
                    active
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'bg-secondary/30 text-muted-foreground hover:text-foreground hover:bg-secondary/60 border border-border/30'
                  }`}
                >
                  <span>{cat}</span>
                  <span className={`text-[10px] font-mono tabular-nums ${active ? 'text-primary-foreground/90' : 'opacity-70'}`}>
                    {solvedCount}/{count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Empty Search State */}
        {filteredProblems.length === 0 && (
          <div className="glass-card rounded-2xl p-8 text-center border border-border/40 space-y-3">
            <p className="text-sm font-display font-bold text-foreground">
              No matching DSA problems found
            </p>
            <p className="text-xs text-muted-foreground">
              Try clearing your search query or switching difficulty/topic filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSelectedDifficulty('All');
                setStatusFilter('All');
              }}
              className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-display font-bold hover:neon-glow transition-all"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Problem Categories & Rows (Matches Dashboard Sections & Track Lists) */}
        <div className="space-y-3.5">
          {DSA_CATEGORIES.filter(cat => selectedCategory === 'All' || selectedCategory === cat).map((cat, catIdx) => {
            const problemsInCat = filteredProblems.filter(p => p.category === cat);
            if (problemsInCat.length === 0) return null;

            const isCollapsed = collapsedCategories[cat] || false;
            const solvedInCat = problemsInCat.filter(p => solvedIds.includes(p.id)).length;
            const catPct = problemsInCat.length > 0 ? Math.round((solvedInCat / problemsInCat.length) * 100) : 0;

            return (
              <motion.section
                key={cat}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: catIdx * 0.03 }}
                className="glass-card rounded-2xl border border-border/50 overflow-hidden"
              >
                {/* Category Header */}
                <button
                  onClick={() => toggleCategoryCollapse(cat)}
                  className="w-full flex items-center justify-between px-4 sm:px-5 py-3.5 bg-secondary/20 hover:bg-secondary/35 transition-colors border-b border-border/30 text-left"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-7 h-7 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center text-xs font-mono font-bold text-primary shrink-0 tabular-nums">
                      {String(catIdx + 1).padStart(2, '0')}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h2 className="font-display font-bold text-sm sm:text-base text-foreground truncate">
                          {cat}
                        </h2>
                        <span className="text-xs text-muted-foreground font-mono tabular-nums shrink-0">
                          · {solvedInCat}/{problemsInCat.length}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="w-24 h-1.5 bg-secondary rounded-full overflow-hidden hidden sm:block">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-accent-blue rounded-full transition-all duration-300"
                        style={{ width: `${catPct}%` }}
                      />
                    </div>
                    {isCollapsed ? (
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                </button>

                {/* Problem Rows */}
                <AnimatePresence initial={false}>
                  {!isCollapsed && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="divide-y divide-border/25"
                    >
                      {problemsInCat.map(problem => {
                        const isSolved = solvedIds.includes(problem.id);
                        return (
                          <div
                            key={problem.id}
                            className={`flex flex-col sm:flex-row sm:items-center justify-between px-4 sm:px-5 py-3.5 gap-3 transition-colors group ${
                              isSolved ? 'bg-primary/5 hover:bg-primary/10' : 'hover:bg-secondary/25'
                            }`}
                          >
                            {/* Left: Solved Checkbox + Title + Metadata */}
                            <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
                              <button
                                onClick={() => toggleSolved(problem.id)}
                                className="mt-0.5 sm:mt-0 p-1 rounded-lg text-muted-foreground hover:text-primary transition-colors shrink-0"
                                title={isSolved ? 'Mark as Unsolved' : 'Mark as Solved'}
                              >
                                {isSolved ? (
                                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                                ) : (
                                  <Circle className="w-5 h-5 hover:text-primary" />
                                )}
                              </button>

                              <div className="min-w-0 flex-1 space-y-0.5">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="text-xs font-mono text-muted-foreground tabular-nums">
                                    #{String(problem.number).padStart(2, '0')}
                                  </span>
                                  <button
                                    onClick={() => setActiveProblem(problem)}
                                    className={`text-xs sm:text-sm font-display font-bold hover:text-primary transition-colors text-left ${
                                      isSolved ? 'text-foreground/85' : 'text-foreground'
                                    }`}
                                  >
                                    {problem.title}
                                  </button>
                                  <span aria-hidden="true" className="text-muted-foreground/50">·</span>
                                  <span
                                    className={`text-xs font-mono font-semibold ${
                                      problem.difficulty === 'Easy'
                                        ? 'text-emerald-400'
                                        : problem.difficulty === 'Medium'
                                        ? 'text-amber-400'
                                        : 'text-rose-400'
                                    }`}
                                  >
                                    {problem.difficulty}
                                  </span>
                                  {problem.companies && problem.companies.length > 0 && (
                                    <>
                                      <span aria-hidden="true" className="hidden md:inline text-muted-foreground/40">·</span>
                                      <span className="hidden md:inline text-[11px] text-muted-foreground truncate">
                                        {problem.companies.slice(0, 3).join(' / ')}
                                      </span>
                                    </>
                                  )}
                                </div>

                                <p className="text-xs text-muted-foreground line-clamp-1">
                                  {problem.summary}
                                </p>
                              </div>
                            </div>

                            {/* Right: Complexity + Intuition Trigger + Solve CTA */}
                            <div className="flex items-center gap-2 sm:self-center self-end shrink-0">
                              <div className="hidden lg:flex items-center gap-1.5 text-xs font-mono text-muted-foreground mr-1">
                                <span className="text-primary">{problem.timeComplexity}</span>
                                <span aria-hidden="true">·</span>
                                <span className="text-accent-blue">{problem.spaceComplexity}</span>
                              </div>

                              <button
                                onClick={() => setKeyPointsProblem(problem)}
                                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs bg-secondary/40 hover:bg-secondary text-muted-foreground hover:text-foreground border border-border/40 transition-colors whitespace-nowrap"
                                title="View Key Intuition"
                              >
                                <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                                <span className="hidden md:inline">Intuition</span>
                              </button>

                              <button
                                onClick={() => setActiveProblem(problem)}
                                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-primary/15 hover:bg-primary text-primary hover:text-primary-foreground border border-primary/30 text-xs font-display font-bold transition-all whitespace-nowrap"
                              >
                                <Code2 className="w-3.5 h-3.5" />
                                <span>Solve</span>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.section>
            );
          })}
        </div>
      </motion.div>

      {/* Quick Intuition Modal */}
      {keyPointsProblem && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setKeyPointsProblem(null)}
        >
          <div
            className="w-full max-w-lg glass-card border border-primary/30 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border/30 pb-3">
              <div className="flex items-center gap-2 min-w-0">
                <Lightbulb className="w-5 h-5 text-amber-400 shrink-0" />
                <h3 className="font-display font-bold text-foreground text-sm sm:text-base truncate">
                  #{keyPointsProblem.number} {keyPointsProblem.title} — Intuition
                </h3>
              </div>
              <button
                onClick={() => setKeyPointsProblem(null)}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5">
              {keyPointsProblem.keyPoints.map((point, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-secondary/35 border border-border/40 flex gap-2.5 items-start text-xs text-foreground/90 leading-relaxed"
                >
                  <span className="w-5 h-5 rounded-md bg-primary/15 text-primary flex items-center justify-center font-mono font-bold text-[10px] shrink-0 mt-0.5">
                    0{idx + 1}
                  </span>
                  <span>{point}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-border/30">
              <div className="text-xs font-mono text-muted-foreground">
                Time: <span className="text-primary font-semibold">{keyPointsProblem.timeComplexity}</span> · Space:{' '}
                <span className="text-accent-blue font-semibold">{keyPointsProblem.spaceComplexity}</span>
              </div>
              <button
                onClick={() => {
                  const p = keyPointsProblem;
                  setKeyPointsProblem(null);
                  setActiveProblem(p);
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-display font-bold hover:neon-glow transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Open in Code Lab</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Viral Share Achievement Modal */}
      <ShareAchievementModal
        isOpen={shareProblem !== null}
        onClose={() => setShareProblem(null)}
        title={shareProblem?.title}
        topic={shareProblem?.category}
        achievementType="dsa"
      />
    </div>
  );
};

export default DsaSheet;
