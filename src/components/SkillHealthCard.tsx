import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, ChevronDown, ChevronUp, Check, ArrowRight, BarChart3, AlertTriangle
} from 'lucide-react';
import { getAllQuizAttempts, type QuizAttempt } from '@/lib/quizStorage';
import { 
  TRACK_LESSON_IDS, 
  completedCountFor, 
  getLessonDetails, 
  type LessonTrackKey 
} from '@/data/lessonIndex';
import { TRACK_META, TrackId, isEnrolled, isActive } from '@/lib/enrollment';

const TRACK_EMOJIS: Record<string, string> = {
  frontend: '🌐',
  networking: '🔌',
  fullstack: '⚡',
  freelance: '💼',
  'real-freelance': '🎯',
  python: '🐍',
  pythonexpert: '🚀',
  local: '💻',
  sql: '🗄️',
  'ai-fundamentals': '🧠',
  'intermediate-ai': '🤖',
  'advanced-ai': '⚡',
  three3d: '🎮',
  java: '☕',
  javaexpert: '☕',
  cpp: '⚙️',
  cppexpert: '⚙️',
  c: '🧩',
  cx: '🧩',
};

interface SkillHealthCardProps {
  isGuest?: boolean;
  completedLessonIds?: string[];
  activeTrackIds?: string[];
}

export const SkillHealthCard: React.FC<SkillHealthCardProps> = ({
  isGuest,
  completedLessonIds = [],
  activeTrackIds,
}) => {
  const navigate = useNavigate();
  const [expandedTrackId, setExpandedTrackId] = useState<string | null>(null);
  const [isTracksExpanded, setIsTracksExpanded] = useState(false);

  // Read real quiz attempts
  const realQuizAttempts = useMemo(() => {
    return getAllQuizAttempts();
  }, []);

  // Map real attempts by lesson ID
  const quizMap = useMemo(() => {
    const map = new Map<string, QuizAttempt>();
    realQuizAttempts.forEach(a => map.set(a.lessonId, a));
    return map;
  }, [realQuizAttempts]);

  const completedSet = useMemo(() => new Set(completedLessonIds), [completedLessonIds]);

  // Group tracks with enrollment status, overall progress, and lesson-level breakdown
  const trackCards = useMemo(() => {
    const trackKeys = Object.keys(TRACK_META) as TrackId[];

    const list = trackKeys.map(trackId => {
      const meta = TRACK_META[trackId];
      const lessonKey = trackId as unknown as LessonTrackKey;
      const lessonIds = TRACK_LESSON_IDS[lessonKey] || [];
      const totalLessons = lessonIds.length;
      const completed = completedCountFor(lessonKey, completedLessonIds);
      const enrolled = activeTrackIds
        ? activeTrackIds.includes(trackId)
        : (isActive(trackId) || isEnrolled(trackId));
      const progressPct = totalLessons > 0 ? Math.round((completed / totalLessons) * 100) : 0;

      // Real quizzes taken in this track
      const trackQuizzes: { attempt: QuizAttempt; details: ReturnType<typeof getLessonDetails>; isWeak: boolean }[] = [];
      let totalScoreSum = 0;

      for (const lid of lessonIds) {
        const attempt = quizMap.get(lid);
        if (attempt) {
          const details = getLessonDetails(lid);
          const isWeak = attempt.percentage < 80 || (attempt.missedIndices && attempt.missedIndices.length > 0);
          trackQuizzes.push({ attempt, details, isWeak });
          totalScoreSum += attempt.percentage;
        }
      }

      const avgQuizScore = trackQuizzes.length > 0 ? Math.round(totalScoreSum / trackQuizzes.length) : null;
      const weakQuizzes = trackQuizzes.filter(q => q.isWeak);

      // Lesson-by-lesson progress for this track (lessons completed or quiz attempted)
      const lessonProgressList = lessonIds
        .map((lid, idx) => {
          const attempt = quizMap.get(lid);
          const isCompleted = completedSet.has(lid);
          if (!attempt && !isCompleted) return null;

          const details = getLessonDetails(lid);
          const hasMistakes = attempt ? (attempt.percentage < 100 || (attempt.missedIndices && attempt.missedIndices.length > 0)) : false;

          // Collect specific mistake questions
          const mistakes: string[] = [];
          if (attempt && hasMistakes) {
            if (attempt.missedQuestionsSummary && attempt.missedQuestionsSummary.length > 0) {
              attempt.missedQuestionsSummary.forEach(q => mistakes.push(q));
            } else if (attempt.missedIndices && attempt.missedIndices.length > 0) {
              attempt.missedIndices.forEach(qIdx => mistakes.push(`Question #${qIdx + 1}`));
            } else {
              mistakes.push(`Scored ${attempt.percentage}% on quiz`);
            }
          }

          return {
            id: lid,
            lessonNumber: details?.lessonNumber || idx + 1,
            title: details?.title || attempt?.lessonTitle || `Lesson ${idx + 1}`,
            url: details?.url || `/lesson/${lid}`,
            isCompleted,
            attempt,
            hasMistakes,
            mistakes,
          };
        })
        .filter(Boolean) as {
          id: string;
          lessonNumber: number;
          title: string;
          url: string;
          isCompleted: boolean;
          attempt?: QuizAttempt;
          hasMistakes: boolean;
          mistakes: string[];
        }[];

      return {
        trackId,
        label: meta?.label || trackId,
        short: meta?.short || trackId,
        route: meta?.route || '/learn',
        emoji: TRACK_EMOJIS[trackId] || '📚',
        enrolled,
        totalLessons,
        completed,
        progressPct,
        trackQuizzes,
        avgQuizScore,
        weakQuizzes,
        lessonProgressList,
      };
    });

    // Sort: Enrolled tracks first, then tracks with most completions, then alphabetical
    return list.sort((a, b) => {
      if (a.enrolled !== b.enrolled) return a.enrolled ? -1 : 1;
      if (b.completed !== a.completed) return b.completed - a.completed;
      return a.label.localeCompare(b.label);
    });
  }, [completedLessonIds, activeTrackIds, quizMap, completedSet]);

  if (isGuest) return null;

  // Show only 3 tracks by default; expand to all tracks when toggled
  const displayedTracks = isTracksExpanded ? trackCards : trackCards.slice(0, 3);
  const enrolledCount = trackCards.filter(t => t.enrolled).length;

  return (
    <div className="w-full glass-card rounded-2xl p-5 lg:p-6 border border-border/40 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 grid place-items-center shrink-0">
            <BookOpen className="w-4 h-4 text-primary" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold font-display text-foreground truncate">
                Lessons-Based Track Progress
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 shrink-0">
                {enrolledCount} Active
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground">
              Click any track to review curriculum progress and lesson question mistakes
            </p>
          </div>
        </div>

        {/* Header Expand/Compress Toggle */}
        <button
          type="button"
          onClick={() => setIsTracksExpanded(!isTracksExpanded)}
          className="flex items-center gap-1.5 text-xs text-primary font-semibold hover:underline shrink-0"
        >
          <span>{isTracksExpanded ? 'Show 3' : `Show All (${trackCards.length})`}</span>
          {isTracksExpanded ? (
            <ChevronUp className="w-3.5 h-3.5" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      {/* Track Accordion List */}
      <div className="space-y-2.5">
        {displayedTracks.map(track => {
          const isExpanded = expandedTrackId === track.trackId;

          return (
            <div
              key={track.trackId}
              className={`rounded-xl border transition-all overflow-hidden ${
                track.enrolled
                  ? 'bg-primary/5 border-primary/25 hover:border-primary/35'
                  : track.completed > 0
                  ? 'bg-secondary/20 border-border/40 hover:border-border/60'
                  : 'bg-secondary/10 border-border/20 hover:border-border/35'
              }`}
            >
              {/* Collapsed Track Row Button */}
              <button
                type="button"
                onClick={() => setExpandedTrackId(isExpanded ? null : track.trackId)}
                className="w-full text-left p-3 sm:p-3.5 flex items-center justify-between gap-3 transition-colors hover:bg-secondary/20"
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <span className="text-lg shrink-0 leading-none">{track.emoji}</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs sm:text-sm font-bold font-display text-foreground truncate">
                        {track.label}
                      </span>
                      {track.enrolled ? (
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold">
                          Active
                        </span>
                      ) : track.completed > 0 ? (
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-full bg-primary/10 text-primary border border-primary/20">
                          In Progress
                        </span>
                      ) : (
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-full bg-secondary/40 text-muted-foreground border border-border/30">
                          Not Started
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-muted-foreground font-mono mt-0.5">
                      {track.completed} of {track.totalLessons} lessons completed · {track.progressPct}%
                    </p>
                  </div>
                </div>

                {/* Right side indicator */}
                <div className="flex items-center gap-2.5 shrink-0">
                  {track.avgQuizScore !== null && (
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                      track.avgQuizScore >= 80
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {track.avgQuizScore}% Quiz
                    </span>
                  )}
                  <motion.span
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="inline-flex text-muted-foreground"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </motion.span>
                </div>
              </button>

              {/* Accordion Expanded Panel: Shows 2 distinct things */}
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-t border-border/20 p-3.5 sm:p-4 bg-background/50 space-y-4"
                  >
                    {/* THING 1: Overall Track Progress & Metrics */}
                    <div className="bg-secondary/15 rounded-xl p-3 sm:p-3.5 border border-border/30 space-y-3">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-1.5">
                          <BarChart3 className="w-3.5 h-3.5 text-primary" />
                          <span className="text-xs font-bold font-display uppercase tracking-wider text-foreground">
                            1. Overall Track Progress
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => navigate(track.route)}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:underline"
                        >
                          <span>Open {track.short} Roadmap</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[10px] font-mono text-muted-foreground">
                          <span>Curriculum Completion</span>
                          <span>{track.completed} / {track.totalLessons} Lessons ({track.progressPct}%)</span>
                        </div>
                        <div className="h-2 bg-secondary/50 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-primary to-accent-blue rounded-full transition-all duration-500"
                            style={{ width: `${track.progressPct}%` }}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
                        <div className="bg-background/60 rounded-lg p-2 border border-border/20">
                          <p className="text-[9px] text-muted-foreground uppercase font-mono">Completed</p>
                          <p className="text-sm font-bold font-mono text-foreground mt-0.5">
                            {track.completed} / {track.totalLessons}
                          </p>
                        </div>
                        <div className="bg-background/60 rounded-lg p-2 border border-border/20">
                          <p className="text-[9px] text-muted-foreground uppercase font-mono">
                            {track.trackId === 'frontend' ? 'Format' : 'Quiz Accuracy'}
                          </p>
                          <p className={`text-sm font-bold font-mono mt-0.5 ${
                            track.trackId === 'frontend'
                              ? 'text-primary'
                              : track.avgQuizScore !== null
                              ? track.avgQuizScore >= 80 ? 'text-emerald-400' : 'text-amber-400'
                              : 'text-muted-foreground'
                          }`}>
                            {track.trackId === 'frontend'
                              ? 'Hands-on Code'
                              : track.avgQuizScore !== null
                              ? `${track.avgQuizScore}%`
                              : 'Pending'}
                          </p>
                        </div>
                        <div className="col-span-2 sm:col-span-1 bg-background/60 rounded-lg p-2 border border-border/20">
                          <p className="text-[9px] text-muted-foreground uppercase font-mono">
                            {track.trackId === 'frontend' ? 'Challenges Solved' : 'Quizzes Taken'}
                          </p>
                          <p className="text-sm font-bold font-mono text-foreground mt-0.5">
                            {track.trackId === 'frontend' ? track.completed : track.trackQuizzes.length}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* THING 2: Lesson-by-Lesson Progress & Mistake / Code Review */}
                    <div className="space-y-2.5 pt-1">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          {track.trackId === 'frontend' ? (
                            <BookOpen className="w-3.5 h-3.5 text-primary" />
                          ) : (
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                          )}
                          <span className="text-xs font-bold font-display uppercase tracking-wider text-foreground">
                            {track.trackId === 'frontend'
                              ? '2. Lesson Progress & Code Challenges'
                              : '2. Lesson Progress & Mistakes Review'}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-muted-foreground">
                          {track.lessonProgressList.length} active lesson(s)
                        </span>
                      </div>

                      {track.lessonProgressList.length === 0 ? (
                        <div className="py-4 px-3 rounded-xl bg-secondary/15 border border-border/20 text-center space-y-2">
                          <p className="text-xs text-muted-foreground">
                            No lessons completed in {track.short} yet.
                          </p>
                          <button
                            type="button"
                            onClick={() => navigate(track.route)}
                            className="inline-flex items-center gap-1.5 text-xs font-bold font-display px-3 py-1.5 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-all"
                          >
                            <span>Start {track.short} Lesson 1</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2.5">
                          {track.lessonProgressList.map(lesson => {
                            const isFrontend = track.trackId === 'frontend';
                            const attempt = lesson.attempt;
                            const hasMistakes = !isFrontend && lesson.hasMistakes && lesson.mistakes.length > 0;

                            return (
                              <div
                                key={lesson.id}
                                className={`rounded-xl border p-3 transition-all space-y-2 ${
                                  hasMistakes
                                    ? 'bg-amber-500/5 border-amber-500/30'
                                    : isFrontend || attempt
                                    ? 'bg-emerald-500/5 border-emerald-500/25'
                                    : 'bg-secondary/15 border-border/30'
                                }`}
                              >
                                {/* Lesson Header */}
                                <div className="flex items-center justify-between gap-2">
                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <span className="text-xs font-bold text-foreground truncate">
                                        Lesson {lesson.lessonNumber}: {lesson.title}
                                      </span>
                                      {isFrontend ? (
                                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                                          Challenge Solved ✓
                                        </span>
                                      ) : attempt ? (
                                        <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-semibold ${
                                          hasMistakes
                                            ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                                            : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                        }`}>
                                          {attempt.percentage}% Score ({attempt.correctCount}/{attempt.totalQuestions})
                                        </span>
                                      ) : (
                                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-secondary/50 text-muted-foreground border border-border/40">
                                          Quiz Pending
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  {/* Action Buttons */}
                                  <div className="flex items-center gap-1.5 shrink-0">
                                    <button
                                      type="button"
                                      onClick={() => navigate(lesson.url)}
                                      className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg transition-all ${
                                        isFrontend
                                          ? 'bg-primary/10 text-primary border border-primary/25 hover:bg-primary/20'
                                          : hasMistakes
                                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                                          : attempt
                                          ? 'bg-primary/10 text-primary border border-primary/25 hover:bg-primary/20'
                                          : 'bg-primary text-primary-foreground hover:opacity-90'
                                      }`}
                                    >
                                      {isFrontend ? 'Review Code →' : hasMistakes ? 'Retake Quiz →' : attempt ? 'Review Lesson' : 'Take Quiz →'}
                                    </button>
                                  </div>
                                </div>

                                {/* Details / Mistakes list if any */}
                                {isFrontend ? (
                                  <p className="text-[10px] text-emerald-400/90 flex items-center gap-1">
                                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                    <span>Interactive code challenge completed and validated in the editor.</span>
                                  </p>
                                ) : hasMistakes ? (
                                  <div className="bg-background/70 rounded-lg p-2.5 border border-amber-500/20 space-y-1.5">
                                    <p className="text-[10px] font-bold font-mono text-amber-400 uppercase tracking-wider flex items-center gap-1">
                                      <span>Mistakes on this lesson ({lesson.mistakes.length}):</span>
                                    </p>
                                    <ul className="space-y-1">
                                      {lesson.mistakes.map((mistake, mIdx) => (
                                        <li key={mIdx} className="text-[11px] text-muted-foreground flex items-start gap-1.5">
                                          <span className="text-destructive font-bold text-xs leading-none mt-0.5">✕</span>
                                          <span className="text-foreground/90">{mistake}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                ) : attempt ? (
                                  <p className="text-[10px] text-emerald-400/90 flex items-center gap-1">
                                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                    <span>All questions answered correctly! No mistakes on this lesson.</span>
                                  </p>
                                ) : (
                                  <p className="text-[10px] text-muted-foreground">
                                    Lesson completed. Take the quiz at the end of the lesson to test your retention.
                                  </p>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Bottom Expand / Compress Tracks Button */}
      <div className="pt-2 text-center">
        <button
          type="button"
          onClick={() => setIsTracksExpanded(!isTracksExpanded)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline px-3 py-1 rounded-lg hover:bg-primary/5 transition-colors"
        >
          {isTracksExpanded ? (
            <>
              <ChevronUp className="w-3.5 h-3.5" />
              <span>Compress Tracks (Show 3 Only)</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5" />
              <span>Show All Tracks ({trackCards.length} Courses)</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default SkillHealthCard;
