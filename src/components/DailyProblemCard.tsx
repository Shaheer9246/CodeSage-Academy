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
      className={`w-full rounded-2xl p-4 sm:p-5 border border-primary/30 bg-[#16213e]/90 backdrop-blur-md relative overflow-hidden shadow-xl shadow-primary/5 ${className}`}
    >
      {/* Background ambient gradient accent */}
      <div className="absolute -top-16 -right-16 w-48 h-48 bg-primary/15 rounded-full blur-3xl pointer-events-none -z-0" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left Information Section */}
        <div className="space-y-2 min-w-0 flex-1">
          {/* Header kicker with date and rewards */}
          <div className="flex items-center gap-2 flex-wrap text-[11px] font-mono">
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-primary/15 text-primary border border-primary/30 font-bold uppercase tracking-wider">
              <Flame className="w-3.5 h-3.5 fill-primary text-primary" />
              Problem of the Day
            </span>
            <span className="text-muted-foreground/50">·</span>
            <span className="text-muted-foreground font-sans">{potd.displayDate}</span>
            <span className="text-muted-foreground/50">·</span>
            <span className="inline-flex items-center gap-1 text-amber-400 font-semibold">
              <Zap className="w-3 h-3 text-amber-400" />
              +{potd.rewardXp} XP
            </span>
            <span className="inline-flex items-center gap-1 text-yellow-400 font-semibold">
              <Coins className="w-3 h-3 text-yellow-400" />
              +{potd.rewardCoins} ◈
            </span>
          </div>

          {/* Problem Title & Category */}
          <div className="flex items-baseline gap-2 flex-wrap">
            <h3 className="text-base sm:text-lg font-bold font-display text-foreground hover:text-primary transition-colors cursor-pointer truncate max-w-full"
                onClick={handleNavigateToProblem}>
              {potd.problem.title}
            </h3>
            <span className="text-xs text-muted-foreground font-mono">
              #{String(potd.problem.number).padStart(2, '0')}
            </span>
          </div>

          {/* Unboxed Metadata & Topic tags */}
          <div className="flex items-center gap-2 text-xs flex-wrap">
            <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-medium border ${diffClass}`}>
              {potd.problem.difficulty}
            </span>
            <span className="text-muted-foreground/50">·</span>
            <span className="text-muted-foreground flex items-center gap-1 font-mono">
              <Code2 className="w-3.5 h-3.5 text-primary/80" />
              {potd.problem.category}
            </span>
            <span className="text-muted-foreground/50">·</span>
            <span className="text-muted-foreground/80 font-mono text-[11px]">
              O({potd.problem.timeComplexity || 'N'})
            </span>
          </div>
        </div>

        {/* Right Status & Action Controls */}
        <div className="flex items-center sm:self-auto self-stretch gap-2.5 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-border/40">
          {potd.isSolved ? (
            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
              <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Solved Today</span>
              </div>
              {onOpenShare && (
                <button
                  onClick={() => onOpenShare(potd.problem.title, potd.problem.category)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-secondary/80 hover:bg-secondary text-foreground text-xs font-medium border border-border/60 transition-colors"
                  title="Share your accomplishment"
                >
                  <Share2 className="w-3.5 h-3.5 text-primary" />
                  <span className="hidden sm:inline">Share</span>
                </button>
              )}
              <button
                onClick={handleNavigateToProblem}
                className="px-3 py-2 rounded-xl bg-secondary/60 hover:bg-secondary text-muted-foreground hover:text-foreground text-xs font-mono transition-colors"
                title="Review problem solution"
              >
                Review →
              </button>
            </div>
          ) : (
            <button
              onClick={handleNavigateToProblem}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-display font-bold text-xs hover:neon-glow transition-all shadow-md shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Solve Today's Problem</span>
              <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default DailyProblemCard;
