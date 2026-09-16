import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, AlertTriangle, CheckCircle2, RotateCcw, 
  ChevronRight, ChevronDown, Sparkles, BookOpen 
} from 'lucide-react';
import { getSkillHealthSummary, type QuizAttempt } from '@/lib/quizStorage';
import { getLessonDetails } from '@/data/lessonIndex';

interface SkillHealthCardProps {
  isGuest?: boolean;
}

export const SkillHealthCard: React.FC<SkillHealthCardProps> = ({ isGuest }) => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  // Read quiz attempts and diagnostic state
  const summary = useMemo(() => {
    return getSkillHealthSummary();
  }, []);

  // Enrich weak attempts with real lesson metadata
  const weakItems = useMemo(() => {
    return summary.weakAttempts.map(attempt => {
      const details = getLessonDetails(attempt.lessonId);
      return {
        attempt,
        title: details?.title || attempt.lessonTitle || `Lesson ${attempt.lessonId}`,
        trackLabel: details?.trackLabel || 'Course Lesson',
        url: details?.url || `/lesson/${attempt.lessonId}?from=dashboard`,
      };
    });
  }, [summary.weakAttempts]);

  // Don't render for guests who haven't signed in
  if (isGuest) return null;

  // Determine skill health badge & color
  const getRatingBadge = (score: number) => {
    if (score >= 90) return { label: 'Mastery', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' };
    if (score >= 75) return { label: 'Proficient', color: 'text-sky-400 bg-sky-500/10 border-sky-500/20' };
    if (score >= 60) return { label: 'Reviewing', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' };
    return { label: 'Needs Practice', color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' };
  };

  const badge = getRatingBadge(summary.averageScore);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full glass-card rounded-2xl p-4 sm:p-5 border border-border/50 bg-secondary/15 relative overflow-hidden"
    >
      {/* Decorative subtle ambient backdrop */}
      <div className="absolute top-0 right-0 w-64 h-32 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10 pb-3 border-b border-border/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 grid place-items-center shrink-0">
            <Target className="w-5 h-5 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold font-display text-foreground">
                Skill Diagnostics & Weak Areas
              </h3>
              {summary.totalQuizzesTaken > 0 && (
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${badge.color}`}>
                  {badge.label}
                </span>
              )}
            </div>
            <p className="text-[11px] text-muted-foreground">
              {summary.totalQuizzesTaken > 0 
                ? `Detailed performance tracking across ${summary.totalQuizzesTaken} lesson quiz assessment${summary.totalQuizzesTaken > 1 ? 's' : ''}`
                : 'Complete lesson quizzes to generate your personalized skill diagnostics'}
            </p>
          </div>
        </div>

        {summary.totalQuizzesTaken > 0 && (
          <div className="flex items-center gap-4 shrink-0">
            <div className="text-right">
              <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Avg Accuracy</p>
              <p className="text-base sm:text-lg font-bold font-mono text-primary leading-none mt-0.5">
                {summary.averageScore}%
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Weak Spots</p>
              <p className={`text-base sm:text-lg font-bold font-mono leading-none mt-0.5 ${summary.weakAttempts.length > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {summary.weakAttempts.length}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="mt-3 relative z-10">
        {summary.totalQuizzesTaken === 0 ? (
          // Empty State
          <div className="py-5 px-4 text-center rounded-xl bg-secondary/20 border border-border/30">
            <div className="w-8 h-8 rounded-full bg-primary/10 mx-auto grid place-items-center mb-2">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <p className="text-xs font-semibold text-foreground">No Quiz Attempts Recorded Yet</p>
            <p className="text-[11px] text-muted-foreground max-w-md mx-auto mt-1">
              When you complete the quiz step at the end of any lesson, your scores, test accuracy, and any missed concepts will automatically appear here.
            </p>
          </div>
        ) : summary.weakAttempts.length === 0 ? (
          // All skills strong celebration
          <div className="py-4 px-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <p className="text-xs font-bold text-emerald-300">All Examined Skills Strong! 🎉</p>
                <p className="text-[11px] text-emerald-400/80">
                  You've passed your quizzes with high accuracy. No weak areas detected in your completed tests.
                </p>
              </div>
            </div>
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-[11px] font-mono font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 shrink-0"
            >
              <span>{expanded ? 'Hide History' : 'View Scores'}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} />
            </button>
          </div>
        ) : (
          // Weak areas identified
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-mono uppercase tracking-wider text-amber-400 flex items-center gap-1.5 font-semibold">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span>Recommended for Review ({weakItems.length})</span>
              </p>
              {weakItems.length > 2 && (
                <button
                  type="button"
                  onClick={() => setExpanded(!expanded)}
                  className="text-[10px] font-mono text-muted-foreground hover:text-foreground flex items-center gap-1"
                >
                  <span>{expanded ? 'Show Less' : `Show All (${weakItems.length})`}</span>
                  <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} />
                </button>
              )}
            </div>

            {/* List of weak area items */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {(expanded ? weakItems : weakItems.slice(0, 2)).map(({ attempt, title, trackLabel, url }) => (
                <div
                  key={attempt.lessonId}
                  className="rounded-xl p-3 bg-secondary/30 border border-amber-500/20 hover:border-amber-500/40 transition-all flex flex-col justify-between gap-2.5"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase">
                        {trackLabel}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-amber-400">
                        {attempt.percentage}% Score ({attempt.correctCount}/{attempt.totalQuestions})
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-foreground font-display truncate">
                      {title}
                    </h4>

                    {/* Missed questions brief */}
                    {attempt.missedQuestionsSummary && attempt.missedQuestionsSummary.length > 0 ? (
                      <p className="text-[10px] text-muted-foreground line-clamp-1 mt-1">
                        <strong className="text-amber-400/90 font-medium">Missed:</strong> {attempt.missedQuestionsSummary[0]}
                        {attempt.missedQuestionsSummary.length > 1 ? ` (+${attempt.missedQuestionsSummary.length - 1} more)` : ''}
                      </p>
                    ) : (
                      <p className="text-[10px] text-muted-foreground mt-1">
                        {attempt.missedIndices?.length || 1} question(s) need review to achieve mastery.
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border/20">
                    <button
                      onClick={() => navigate(`/complete/${attempt.lessonId}?from=dashboard`)}
                      className="text-[10px] text-muted-foreground hover:text-foreground font-mono flex items-center gap-1 transition-colors"
                    >
                      <BookOpen className="w-3 h-3" />
                      <span>Review Test</span>
                    </button>
                    <button
                      onClick={() => navigate(url)}
                      className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-400 hover:text-amber-300 font-mono px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 transition-all"
                    >
                      <RotateCcw className="w-2.5 h-2.5" />
                      <span>Retake Quiz</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Expandable History Drawer when all are strong */}
        <AnimatePresence>
          {expanded && summary.weakAttempts.length === 0 && summary.strongAttempts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 pt-3 border-t border-border/20 space-y-2 overflow-hidden"
            >
              <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                Mastered Quizzes
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {summary.strongAttempts.map(attempt => {
                  const details = getLessonDetails(attempt.lessonId);
                  return (
                    <div
                      key={attempt.lessonId}
                      className="p-2.5 rounded-lg bg-secondary/20 border border-border/30 flex items-center justify-between text-xs"
                    >
                      <div className="min-w-0 pr-2">
                        <p className="font-semibold text-foreground truncate text-[11px]">
                          {details?.title || attempt.lessonTitle || attempt.lessonId}
                        </p>
                        <p className="text-[9px] text-muted-foreground font-mono">
                          {details?.trackLabel || 'Lesson'}
                        </p>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-400 font-bold shrink-0">
                        {attempt.percentage}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
export default SkillHealthCard;
