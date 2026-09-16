import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, AlertTriangle, CheckCircle2, RotateCcw, 
  Sparkles, BookOpen, ChevronDown, ChevronRight, GraduationCap, ArrowRight
} from 'lucide-react';
import { getSkillHealthSummary, type QuizAttempt } from '@/lib/quizStorage';
import { 
  TRACK_LESSON_IDS, 
  completedCountFor, 
  getLessonDetails, 
  type LessonTrackKey 
} from '@/data/lessonIndex';
import { TRACK_META, TrackId, isEnrolled } from '@/lib/enrollment';

interface SkillHealthCardProps {
  isGuest?: boolean;
  completedLessonIds?: string[];
}

export const SkillHealthCard: React.FC<SkillHealthCardProps> = ({ isGuest, completedLessonIds = [] }) => {
  const navigate = useNavigate();
  const [expandedTracks, setExpandedTracks] = useState<Record<string, boolean>>({});

  // Read full quiz attempts
  const summary = useMemo(() => {
    return getSkillHealthSummary(completedLessonIds);
  }, [completedLessonIds]);

  // Map all quiz attempts by lesson ID
  const quizMap = useMemo(() => {
    const map = new Map<string, QuizAttempt>();
    summary.recentAttempts.forEach(a => map.set(a.lessonId, a));
    summary.weakAttempts.forEach(a => map.set(a.lessonId, a));
    summary.strongAttempts.forEach(a => map.set(a.lessonId, a));
    return map;
  }, [summary]);

  // Group tracks with enrollment status and lesson/quiz progress
  const trackCards = useMemo(() => {
    const trackKeys = Object.keys(TRACK_META) as TrackId[];

    const list = trackKeys.map(trackId => {
      const meta = TRACK_META[trackId];
      const lessonKey = trackId as unknown as LessonTrackKey;
      const lessonIds = TRACK_LESSON_IDS[lessonKey] || [];
      const totalLessons = lessonIds.length;
      const completed = completedCountFor(lessonKey, completedLessonIds);
      const enrolled = isEnrolled(trackId) || completed > 0;
      const progressPct = totalLessons > 0 ? Math.round((completed / totalLessons) * 100) : 0;

      // Find all quizzes in this track
      const trackQuizzes: { attempt: QuizAttempt; details: ReturnType<typeof getLessonDetails>; isWeak: boolean }[] = [];
      let totalScoreSum = 0;
      let quizCount = 0;

      for (const lid of lessonIds) {
        const attempt = quizMap.get(lid);
        if (attempt) {
          const details = getLessonDetails(lid);
          const isWeak = attempt.percentage < 80 || (attempt.missedIndices && attempt.missedIndices.length > 0);
          trackQuizzes.push({ attempt, details, isWeak });
          totalScoreSum += attempt.percentage;
          quizCount++;
        }
      }

      const avgQuizScore = quizCount > 0 ? Math.round(totalScoreSum / quizCount) : null;
      const weakQuizCount = trackQuizzes.filter(q => q.isWeak).length;

      return {
        trackId,
        label: meta?.label || trackId,
        short: meta?.short || trackId,
        route: meta?.route || '/dashboard',
        enrolled,
        totalLessons,
        completed,
        progressPct,
        trackQuizzes,
        avgQuizScore,
        weakQuizCount,
      };
    });

    // Sort: Enrolled/active tracks first, then tracks with completions, then alphabetical
    return list.sort((a, b) => {
      if (a.enrolled !== b.enrolled) return a.enrolled ? -1 : 1;
      if (b.completed !== a.completed) return b.completed - a.completed;
      return a.label.localeCompare(b.label);
    });
  }, [completedLessonIds, quizMap]);

  if (isGuest) return null;

  const toggleExpand = (trackId: string) => {
    setExpandedTracks(prev => ({
      ...prev,
      [trackId]: !prev[trackId],
    }));
  };

  const enrolledTracksCount = trackCards.filter(t => t.enrolled).length;

  return (
    <div className="w-full glass-card rounded-2xl p-5 lg:p-6 border border-border/40 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 grid place-items-center shrink-0">
            <Target className="w-5 h-5 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold font-display text-foreground">
                Track Progress & Skill Diagnostics
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                {enrolledTracksCount} Enrolled
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Track-by-track breakdown of curriculum progress, quiz mastery, and diagnostics
            </p>
          </div>
        </div>

        {summary.totalQuizzesTaken > 0 && (
          <div className="flex items-center gap-4 shrink-0">
            <div className="text-right">
              <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Quiz Accuracy</p>
              <p className="text-base font-bold font-mono text-primary leading-none mt-0.5">
                {summary.averageScore}%
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Weak Spots</p>
              <p className={`text-base font-bold font-mono leading-none mt-0.5 ${summary.weakAttempts.length > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {summary.weakAttempts.length}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Track Accordion List */}
      <div className="space-y-2.5">
        {trackCards.map(track => {
          const isExpanded = !!expandedTracks[track.trackId];

          return (
            <div
              key={track.trackId}
              className={`rounded-xl border transition-all overflow-hidden ${
                track.enrolled
                  ? 'bg-secondary/20 border-primary/25 hover:border-primary/40'
                  : 'bg-secondary/10 border-border/30 hover:border-border/50'
              }`}
            >
              {/* Accordion Header Row */}
              <button
                type="button"
                onClick={() => toggleExpand(track.trackId)}
                className="w-full text-left p-3.5 sm:p-4 flex items-center justify-between gap-3 transition-colors hover:bg-secondary/20"
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <div className="shrink-0 text-muted-foreground">
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-primary" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-xs sm:text-sm font-bold font-display text-foreground truncate">
                        {track.label}
                      </h4>
                      {track.enrolled ? (
                        <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold">
                          Enrolled
                        </span>
                      ) : (
                        <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-secondary/50 text-muted-foreground border border-border/40">
                          Not Active
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-muted-foreground font-mono mt-0.5">
                      {track.completed} of {track.totalLessons} lessons completed ({track.progressPct}%)
                    </p>
                  </div>
                </div>

                {/* Right side teaser pill */}
                <div className="flex items-center gap-3 shrink-0">
                  {track.avgQuizScore !== null && (
                    <div className="hidden sm:block text-right">
                      <span className="text-[9px] font-mono text-muted-foreground uppercase block">Avg Quiz</span>
                      <span className={`text-xs font-mono font-bold ${
                        track.avgQuizScore >= 80 ? 'text-emerald-400' : 'text-amber-400'
                      }`}>
                        {track.avgQuizScore}%
                      </span>
                    </div>
                  )}
                  <span className="text-xs font-mono text-primary font-bold">
                    {track.progressPct}%
                  </span>
                </div>
              </button>

              {/* Accordion Expanded Panel */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-t border-border/20 p-3.5 sm:p-4 bg-background/50 space-y-3.5"
                  >
                    {/* Progress bar */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[10px] font-mono text-muted-foreground">
                        <span>Curriculum Progress</span>
                        <span>{track.completed} / {track.totalLessons} Lessons ({track.progressPct}%)</span>
                      </div>
                      <div className="h-2 bg-secondary/50 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-accent-blue rounded-full transition-all duration-500"
                          style={{ width: `${track.progressPct}%` }}
                        />
                      </div>
                    </div>

                    {/* Quiz breakdown in this track */}
                    <div className="space-y-2 pt-1">
                      <div className="flex items-center justify-between">
                        <h5 className="text-[11px] font-bold font-display uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                          <BookOpen className="w-3 h-3 text-primary" />
                          Track Assessments & Quiz Scores ({track.trackQuizzes.length})
                        </h5>
                        {track.avgQuizScore !== null && (
                          <span className="text-[10px] font-mono text-foreground">
                            Track Accuracy: <strong className="text-primary">{track.avgQuizScore}%</strong>
                          </span>
                        )}
                      </div>

                      {track.trackQuizzes.length === 0 ? (
                        <div className="py-3 px-3 rounded-lg bg-secondary/20 text-center border border-border/20">
                          <p className="text-[11px] text-muted-foreground">
                            No quizzes completed in this track yet. Take quizzes at the end of each lesson to see your scores and diagnostic review here.
                          </p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {track.trackQuizzes.map(({ attempt, details, isWeak }) => (
                            <div
                              key={attempt.lessonId}
                              className={`p-2.5 rounded-lg border text-xs flex flex-col justify-between gap-2 ${
                                isWeak
                                  ? 'bg-amber-500/5 border-amber-500/25'
                                  : 'bg-secondary/20 border-border/30'
                              }`}
                            >
                              <div>
                                <div className="flex items-center justify-between gap-1 mb-1">
                                  <span className="text-[10px] font-semibold text-foreground truncate">
                                    {details?.title || attempt.lessonTitle || `Lesson ${attempt.lessonId}`}
                                  </span>
                                  <span className={`text-[10px] font-mono font-bold shrink-0 ${
                                    isWeak ? 'text-amber-400' : 'text-emerald-400'
                                  }`}>
                                    {attempt.percentage}%
                                  </span>
                                </div>
                                {isWeak ? (
                                  <p className="text-[10px] text-amber-400/90 flex items-center gap-1">
                                    <AlertTriangle className="w-3 h-3 shrink-0" />
                                    <span>Needs review ({attempt.missedIndices?.length || 1} missed)</span>
                                  </p>
                                ) : (
                                  <p className="text-[10px] text-emerald-400/80 flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3 shrink-0" />
                                    <span>Mastered ({attempt.correctCount}/{attempt.totalQuestions})</span>
                                  </p>
                                )}
                              </div>

                              <div className="flex items-center justify-between pt-1.5 border-t border-border/20">
                                <button
                                  type="button"
                                  onClick={() => navigate(`/complete/${attempt.lessonId}?from=settings`)}
                                  className="text-[10px] font-mono text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                                >
                                  Review
                                </button>
                                <button
                                  type="button"
                                  onClick={() => navigate(details?.url || `/lesson/${attempt.lessonId}?from=settings`)}
                                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border transition-all ${
                                    isWeak
                                      ? 'text-amber-400 bg-amber-500/10 border-amber-500/30 hover:bg-amber-500/20'
                                      : 'text-primary bg-primary/10 border-primary/20 hover:bg-primary/20'
                                  }`}
                                >
                                  {isWeak ? 'Retake' : 'Revisit'}
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Action button to roadmap */}
                    <div className="pt-2 flex justify-end">
                      <button
                        type="button"
                        onClick={() => navigate(track.route)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold font-display px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 border border-primary/25 transition-all"
                      >
                        <span>Open {track.short} Roadmap</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SkillHealthCard;
