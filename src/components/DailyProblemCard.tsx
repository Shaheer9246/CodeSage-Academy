/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Flame, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Code2, 
  Coins, 
  Zap, 
  Share2 
} from 'lucide-react';
import { getDailyProblem, DailyProblemInfo } from '@/lib/dailyProblem';
import { useUser } from '@/contexts/UserContext';

interface DailyProblemCardProps {
  onOpenShare?: (problemTitle: string, problemTopic: string) => void;
  className?: string;
}

export const DailyProblemCard: React.FC<DailyProblemCardProps> = ({
  onOpenShare,
  className = '',
}) => {
  const navigate = useNavigate();
  const { user } = useUser();

  const potd: DailyProblemInfo = useMemo(() => {
    return getDailyProblem(new Date(), user?.completedLessons);
  }, [user?.completedLessons]);

  const difficultyColors = {
    Easy: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    Medium: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    Hard: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
  };

  const diffClass = difficultyColors[potd.problem.difficulty] || difficultyColors.Medium;

  const handleNavigateToProblem = () => {
    navigate(`/dsa-sheet?problem=${encodeURIComponent(potd.problem.id)}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
       className={`w-full rounded-xl sm:rounded-2xl p-2.5 sm:p-3.5 border border-orange-500/30 bg-card/95 hover:border-orange-500/50 backdrop-blur-md relative overflow-hidden shadow-md shadow-orange-500/5 transition-colors ${className}`}
    >
      {/* Background ambient gradient accent */}
      <div className="absolute -top-16 -right-16 w-48 h-48 bg-orange-500/15 rounded-full blur-3xl pointer-events-none -z-0" />


      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4">
        {/* Left Information Section */}
        <div className="space-y-1 sm:space-y-1.5 min-w-0 flex-1">
          {/* Header kicker with date and rewards */}
          <div className="flex items-center gap-1.5 flex-wrap text-[10px] font-mono">
            <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-orange-500/15 text-orange-400 border border-orange-500/30 font-bold uppercase tracking-wider text-[9px] sm:text-[10px]">
              <Flame className="w-3 h-3 fill-orange-500 text-orange-400" />
              POTD
            </span>
            <span className="text-muted-foreground/40">·</span>
            <span className="text-muted-foreground font-sans">{potd.displayDate}</span>
            <span className="text-muted-foreground/40">·</span>
            <span className="inline-flex items-center gap-0.5 text-amber-400 font-semibold">
              <Zap className="w-2.5 h-2.5 text-amber-400" />
              +{potd.rewardXp} XP
            </span>
            <span className="inline-flex items-center gap-0.5 text-yellow-400 font-semibold">
              <Coins className="w-2.5 h-2.5 text-yellow-400" />
              +{potd.rewardCoins} ◈
            </span>
          </div>

         {/* Problem Title & Category */}
          <div className="flex items-baseline gap-1.5">
            <h3 className="text-sm sm:text-base font-bold font-display text-foreground hover:text-orange-400 transition-colors cursor-pointer truncate"
              onClick={handleNavigateToProblem}>
              {potd.problem.title}
            </h3>
            <span className="text-[11px] text-muted-foreground/70 font-mono shrink-0">
              #{String(potd.problem.number).padStart(2, '0')}
            </span>
          </div>

          {/* Unboxed Metadata & Topic tags */}
          <div className="flex items-center gap-1.5 text-[11px] flex-wrap">
            <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono font-medium border ${diffClass}`}>
              {potd.problem.difficulty}
            </span>
            <span className="text-muted-foreground/40">·</span>
            <span className="text-muted-foreground flex items-center gap-1 font-mono text-[10px]">
              <Code2 className="w-3 h-3 text-primary/80" />
              {potd.problem.category}
            </span>
            <span className="text-muted-foreground/40">·</span>
            <span className="text-muted-foreground/70 font-mono text-[10px]">
              {potd.problem.timeComplexity?.startsWith('O(') 
                ? potd.problem.timeComplexity 
                : `O(${potd.problem.timeComplexity || 'N'})`}
            </span>
          </div>
        </div>
        
        {/* Right Status & Action Controls */}
        <div className="flex items-center shrink-0 pt-1 sm:pt-0">
          {potd.isSolved ? (
            <div className="flex items-center gap-1.5 w-full sm:w-auto">
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[11px] font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Solved</span>
              </div>
              <button
                onClick={handleNavigateToProblem}
                className="px-2.5 py-1 rounded-lg bg-secondary/60 hover:bg-secondary text-muted-foreground text-[11px] font-mono transition-colors"
              >
                Review →
              </button>
            </div>
          ) : (
            <button
              onClick={handleNavigateToProblem}
              className="w-full sm:w-auto flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-display font-bold text-[11px] hover:brightness-110 transition-all shadow-sm active:scale-[0.98]"
            >
              <Sparkles className="w-3 h-3" />
              <span>Solve Problem</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default DailyProblemCard;
