import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, AlertTriangle, CheckCircle2, RotateCcw, 
  Sparkles, BookOpen, Layers, Award
} from 'lucide-react';
import { getSkillHealthSummary, type QuizAttempt } from '@/lib/quizStorage';
import { getLessonDetails } from '@/data/lessonIndex';

interface SkillHealthCardProps {
  isGuest?: boolean;
  completedLessonIds?: string[];
}

export const SkillHealthCard: React.FC<SkillHealthCardProps> = ({ isGuest, completedLessonIds }) => {
  const navigate = useNavigate();
  const [filterTab, setFilterTab] = useState<'all' | 'weak' | 'mastered'>('all');

  // Read quiz attempts and diagnostic state, including any completed lessons
  const summary = useMemo(() => {
    return getSkillHealthSummary(completedLessonIds);
  }, [completedLessonIds]);

  // Enrich all attempts with lesson metadata
  const allItems = useMemo(() => {
    const attempts = summary.recentAttempts.length > 0 ? summary.recentAttempts : [];
    // Combine all attempts (weak + strong, sorted by timestamp descending)
    const combinedMap = new Map<string, QuizAttempt>();
    summary.weakAttempts.forEach(a => combinedMap.set(a.lessonId, a));
    summary.strongAttempts.forEach(a => {
      if (!combinedMap.has(a.lessonId)) combinedMap.set(a.lessonId, a);
    });
    summary.recentAttempts.forEach(a => {
      if (!combinedMap.has(a.lessonId)) combinedMap.set(a.lessonId, a);
    });

    const list = Array.from(combinedMap.values()).sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

    return list.map(attempt => {
      const details = getLessonDetails(attempt.lessonId);
      const isWeak = attempt.percentage < 80 || (attempt.missedIndices && attempt.missedIndices.length > 0);
      return {
        attempt,
        title: details?.title || attempt.lessonTitle || `Lesson ${attempt.lessonId}`,
        trackLabel: details?.trackLabel || 'Course Lesson',
        url: details?.url || `/lesson/${attempt.lessonId}?from=dashboard`,
        isWeak,
      };
    });
  }, [summary]);

  if (isGuest) return null;

  const weakCount = allItems.filter(i => i.isWeak).length;
  const masteredCount = allItems.filter(i => !i.isWeak).length;

  const displayedItems = allItems.filter(item => {
    if (filterTab === 'weak') return item.isWeak;
    if (filterTab === 'mastered') return !item.isWeak;
    return true;
  });

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
                Skill Diagnostics & Quiz Scores
              </h3>
              {summary.totalQuizzesTaken > 0 && (
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${badge.color}`}>
                  {badge.label}
                </span>
              )}
            </div>
            <p className="text-[11px] text-muted-foreground">
              {summary.totalQuizzesTaken > 0 
                ? `Tracking across ${summary.totalQuizzesTaken} completed assessment${summary.totalQuizzesTaken > 1 ? 's' : ''}`
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
              <p className={`text-base sm:text-lg font-bold font-mono leading-none mt-0.5 ${weakCount > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {weakCount}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="mt-3 relative z-10">
        {summary.totalQuizzesTaken === 0 ? (
          <div className="py-5 px-4 text-center rounded-xl bg-secondary/20 border border-border/30">
            <div className="w-8 h-8 rounded-full bg-primary/10 mx-auto grid place-items-center mb-2">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <p className="text-xs font-semibold text-foreground">No Quiz Attempts Recorded Yet</p>
            <p className="text-[11px] text-muted-foreground max-w-md mx-auto mt-1">
              When you complete the quiz step at the end of any lesson, your scores, test accuracy, and any missed concepts will automatically appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Filter Tabs */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-secondary/30 border border-border/30">
                <button
                  onClick={() => setFilterTab('all')}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-medium transition-all flex items-center gap-1.5 ${
                    filterTab === 'all'
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Layers className="w-3 h-3" />
                  <span>All Quizzes ({allItems.length})</span>
                </button>
                <button
                  onClick={() => setFilterTab('weak')}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-medium transition-all flex items-center gap-1.5 ${
                    filterTab === 'weak'
                      ? 'bg-amber-500 text-black font-bold shadow-sm'
                      : 'text-muted-foreground hover:text-amber-400'
                  }`}
                >
                  <AlertTriangle className="w-3 h-3" />
                  <span>Weak Spots ({weakCount})</span>
                </button>
                <button
                  onClick={() => setFilterTab('mastered')}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-medium transition-all flex items-center gap-1.5 ${
                    filterTab === 'mastered'
                      ? 'bg-emerald-500 text-black font-bold shadow-sm'
                      : 'text-muted-foreground hover:text-emerald-400'
                  }`}
                >
                  <Award className="w-3 h-3" />
                  <span>Mastered ({masteredCount})</span>
                </button>
              </div>

              {weakCount > 0 && filterTab !== 'weak' && (
                <button
                  onClick={() => setFilterTab('weak')}
                  className="text-[10px] font-mono text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
                >
                  <AlertTriangle className="w-3 h-3" />
                  <span>{weakCount} quiz need{weakCount > 1 ? '' : 's'} review</span>
                </button>
              )}
            </div>

            {/* List of quiz items */}
            {displayedItems.length === 0 ? (
              <div className="py-6 text-center text-xs text-muted-foreground border border-border/20 rounded-xl bg-secondary/10">
                {filterTab === 'weak' 
                  ? '🎉 No weak spots detected! All examined lessons passed with high scores.'
                  : 'No quizzes found in this category.'}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {displayedItems.map(({ attempt, title, trackLabel, url, isWeak }) => (
                  <div
                    key={attempt.lessonId}
                    className={`rounded-xl p-3 border transition-all flex flex-col justify-between gap-2.5 ${
                      isWeak 
                        ? 'bg-secondary/30 border-amber-500/30 hover:border-amber-500/50' 
                        : 'bg-secondary/20 border-border/40 hover:border-emerald-500/30'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded uppercase border ${
                          isWeak 
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' 
                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        }`}>
                          {trackLabel}
                        </span>
                        <span className={`text-[10px] font-mono font-bold ${
                          isWeak ? 'text-amber-400' : 'text-emerald-400'
                        }`}>
                          {attempt.percentage}% Score ({attempt.correctCount}/{attempt.totalQuestions})
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-foreground font-display truncate">
                        {title}
                      </h4>

                      {/* Missed questions brief or pass celebration */}
                      {isWeak ? (
                        attempt.missedQuestionsSummary && attempt.missedQuestionsSummary.length > 0 ? (
                          <p className="text-[10px] text-muted-foreground line-clamp-1 mt-1">
                            <strong className="text-amber-400 font-medium">Missed:</strong> {attempt.missedQuestionsSummary[0]}
                            {attempt.missedQuestionsSummary.length > 1 ? ` (+${attempt.missedQuestionsSummary.length - 1} more)` : ''}
                          </p>
                        ) : (
                          <p className="text-[10px] text-muted-foreground mt-1">
                            {attempt.missedIndices?.length || 1} question(s) missed. Needs review.
                          </p>
                        )
                      ) : (
                        <p className="text-[10px] text-emerald-400/80 flex items-center gap-1 mt-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span>All assessment questions answered correctly.</span>
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-border/20">
                      <button
                        onClick={() => navigate(`/complete/${attempt.lessonId}?from=dashboard`)}
                        className="text-[10px] text-muted-foreground hover:text-foreground font-mono flex items-center gap-1 transition-colors"
                      >
                        <BookOpen className="w-3 h-3" />
                        <span>Review Answers</span>
                      </button>
                      <button
                        onClick={() => navigate(url)}
                        className={`inline-flex items-center gap-1 text-[10px] font-bold font-mono px-2.5 py-1 rounded-lg border transition-all ${
                          isWeak 
                            ? 'text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/25' 
                            : 'text-primary hover:text-foreground bg-primary/10 hover:bg-primary/20 border-primary/25'
                        }`}
                      >
                        <RotateCcw className="w-2.5 h-2.5" />
                        <span>{isWeak ? 'Retake Quiz' : 'Revisit Lesson'}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default SkillHealthCard;
