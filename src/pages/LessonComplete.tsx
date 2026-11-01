import { useEffect, useState, useMemo } from 'react';
import { useNavigate, useParams, Navigate, useSearchParams, useLocation } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { getLessonById, getAllLessons, type Lesson } from '@/data/lessons';
import { NETWORKING_LESSONS } from '@/data/networkingLessons';
import { AI_LESSONS } from '@/data/aiFundamentalsLesson';
import { INTERMEDIATE_AI_LESSONS } from '@/data/intermediateAiLesson';
import { ADVANCED_AI_LESSONS } from '@/data/advancedAiLesson';
import { FREELANCE_LESSONS } from '@/data/freelanceLessons';
import { FULLSTACK_LESSONS } from '@/data/fullstackLessons';
import { PYTHON_LESSONS } from '@/data/pythonLessons';
import { LOCAL_LESSONS } from '@/data/localLessons';
import { PYTHON_EXPERT_LESSONS } from '@/data/pythonExpertLessons';
import { SQL_LESSONS } from '@/data/sqlLessons';
import { THREE3D_LESSONS } from '@/data/three3dLessons';
import { JAVA_LESSONS } from '@/data/javaLesson';
import { JAVA_EXPERT_LESSONS } from '@/data/javaExpertLessons';
import { C_LESSONS } from '@/data/cLessons';
import { C_EXPERT_LESSONS } from '@/data/cExpertLessons';
import { CPP_LESSONS } from '@/data/cppLessons';
import { CPP_EXPERT_LESSONS } from '@/data/cppExpertLessons';
import { REAL_FREELANCE_LESSONS } from '@/data/realfreelanceLesson';
import { 
  Trophy, Zap, Coins, Flame, ArrowRight, BookOpen, RotateCcw, Sparkles,
  CheckCircle2, XCircle, AlertTriangle, Award, ChevronDown, ChevronUp, Check, X,
  Code2, Share2
} from 'lucide-react';
import { badgeForLessons } from '@/lib/gamification';
import { getLessonQuizAttempt, saveLessonQuizAttempt, type QuizAttempt } from '@/lib/quizStorage';
import { canClaimDaily2x, markDaily2xClaimed, recordFreeLessonFinished, PRO_TRACK_PREFIXES } from '@/lib/lessonAds';
import { ADS_CONFIG } from '@/config/adsConfig';
import ShareAchievementModal from '@/components/ShareAchievementModal';
import { playTestPassed, playLevelUp } from '@/lib/soundFx';
import { AdsterraBanner } from '@/components/AdsterraBanner';

type TrackLessonItem = { 
  id: string; 
  title: string; 
  keyTakeaways?: string[];
  quiz?: any[];
  topic?: string;
  challenge?: any;
};

type Track = { 
  prefix: string; 
  path: string; 
  list: TrackLessonItem[];
};

const TRACKS: Track[] = [
  { prefix: 'net-',        path: '/n-lesson',     list: NETWORKING_LESSONS.map(l => ({ id: l.id, title: l.title, keyTakeaways: (l as any).keyTakeaways, quiz: (l as any).quiz || (l as any).questions, topic: (l as any).topic, challenge: (l as any).challenge })) },
  { prefix: 'ai-',         path: '/ai-lesson',    list: AI_LESSONS.map(l => ({ id: l.id, title: l.title, keyTakeaways: (l as any).keyTakeaways, quiz: (l as any).quiz || (l as any).questions, topic: (l as any).topic, challenge: (l as any).challenge })) },
  { prefix: 'aiin-',       path: '/iai-lesson',   list: INTERMEDIATE_AI_LESSONS.map(l => ({ id: l.id, title: l.title, keyTakeaways: (l as any).keyTakeaways, quiz: (l as any).quiz || (l as any).questions, topic: (l as any).topic, challenge: (l as any).challenge })) },
  { prefix: 'aiadv-', path: '/adv-ai-lesson', list: ADVANCED_AI_LESSONS.map(l => ({ id: l.id, title: l.title, keyTakeaways: (l as any).keyTakeaways, quiz: (l as any).quiz || (l as any).questions, topic: (l as any).topic, challenge: (l as any).challenge })) },
  { prefix: 'fs-',         path: '/fs-lesson',    list: FULLSTACK_LESSONS.map(l => ({ id: l.id, title: l.title, keyTakeaways: (l as any).keyTakeaways, quiz: (l as any).quiz || (l as any).questions, topic: (l as any).topic, challenge: (l as any).challenge })) },
  { prefix: 'pyx-',        path: '/pyx-lesson',   list: PYTHON_EXPERT_LESSONS.map(l => ({ id: l.id, title: l.title, keyTakeaways: (l as any).keyTakeaways, quiz: (l as any).quiz || (l as any).questions, topic: (l as any).topic, challenge: (l as any).challenge })) },
  { prefix: 'py-',         path: '/py-lesson',    list: PYTHON_LESSONS.map(l => ({ id: l.id, title: l.title, keyTakeaways: (l as any).keyTakeaways, quiz: (l as any).quiz || (l as any).questions, topic: (l as any).topic, challenge: (l as any).challenge })) },
  { prefix: 'local-',      path: '/local-lesson', list: LOCAL_LESSONS.map(l => ({ id: l.id, title: l.title, keyTakeaways: (l as any).keyTakeaways, quiz: (l as any).quiz || (l as any).questions, topic: (l as any).topic, challenge: (l as any).challenge })) },
  { prefix: 'sql-',        path: '/sql-lesson',   list: (SQL_LESSONS || []).map(l => ({ id: l.id, title: l.title, keyTakeaways: (l as any).keyTakeaways, quiz: (l as any).quiz || (l as any).questions, topic: (l as any).topic, challenge: (l as any).challenge })) },
  { prefix: 'three3d-',    path: '/three-lesson', list: THREE3D_LESSONS.map(l => ({ id: l.id, title: l.title, keyTakeaways: (l as any).keyTakeaways, quiz: (l as any).quiz || (l as any).questions, topic: (l as any).topic, challenge: (l as any).challenge })) },
  { prefix: 'three-',      path: '/three-lesson', list: THREE3D_LESSONS.map(l => ({ id: l.id, title: l.title, keyTakeaways: (l as any).keyTakeaways, quiz: (l as any).quiz || (l as any).questions, topic: (l as any).topic, challenge: (l as any).challenge })) },
  { prefix: 'cppx-',       path: '/cppx-lesson',  list: CPP_EXPERT_LESSONS.map(l => ({ id: l.id, title: l.title, keyTakeaways: (l as any).keyTakeaways, quiz: (l as any).quiz || (l as any).questions, topic: (l as any).topic, challenge: (l as any).challenge })) },
  { prefix: 'cpp-',        path: '/cpp-lesson',   list: CPP_LESSONS.map(l => ({ id: l.id, title: l.title, keyTakeaways: (l as any).keyTakeaways, quiz: (l as any).quiz || (l as any).questions, topic: (l as any).topic, challenge: (l as any).challenge })) },
  { prefix: 'c-',          path: '/c-lesson',     list: C_LESSONS.map(l => ({ id: l.id, title: l.title, keyTakeaways: (l as any).keyTakeaways, quiz: (l as any).quiz || (l as any).questions, topic: (l as any).topic, challenge: (l as any).challenge })) },
  { prefix: 'cx-',         path: '/cx-lesson',    list: C_EXPERT_LESSONS.map(l => ({ id: l.id, title: l.title, keyTakeaways: (l as any).keyTakeaways, quiz: (l as any).quiz || (l as any).questions, topic: (l as any).topic, challenge: (l as any).challenge })) },
  { prefix: 'java-',       path: '/java-lesson',  list: JAVA_LESSONS.map(l => ({ id: l.id, title: l.title, keyTakeaways: (l as any).keyTakeaways, quiz: (l as any).quiz || (l as any).questions, topic: (l as any).topic, challenge: (l as any).challenge })) },
  { prefix: 'javax-',      path: '/javax-lesson', list: JAVA_EXPERT_LESSONS.map(l => ({ id: l.id, title: l.title, keyTakeaways: (l as any).keyTakeaways, quiz: (l as any).quiz || (l as any).questions, topic: (l as any).topic, challenge: (l as any).challenge })) },
  { prefix: 'free-',       path: '/f-lesson',     list: FREELANCE_LESSONS.map(l => ({ id: l.id, title: l.title, keyTakeaways: (l as any).keyTakeaways, quiz: (l as any).quiz || (l as any).questions, topic: (l as any).topic, challenge: (l as any).challenge })) },
  { prefix: 'real-free-',  path: '/rf-lesson',    list: REAL_FREELANCE_LESSONS.map(l => ({ id: l.id, title: l.title, keyTakeaways: (l as any).keyTakeaways, quiz: (l as any).quiz || (l as any).questions, topic: (l as any).topic, challenge: (l as any).challenge })) },
];

const TRACK_HOME: Record<string, string> = {
  'net-': '/networking',
  'ai-': '/ai-fundamentals',
  'aiin-': '/intermediate-ai',
  'aiadv-': '/advanced-ai',
  'free-': '/freelance',
  'fs-': '/fullstack',
  'pyx-': '/pythonexpert',
  'py-': '/python',
  'local-': '/local',
  'sql-': '/sql-learn',
  'three3d-': '/three3d',
  'three-': '/three3d',
  'java-': '/java',
  'javax-': '/java-expert',
  'jvx-': '/java-expert',
  'c-': '/c',
  'cx-': '/c-expert',
  'cppx-': '/cpp/expert',
  'cpp-': '/cpp',
  'real-free-': '/real-freelance',
};

const LessonComplete = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, addXp, addCoins } = useUser();
  const [claimedDaily2x, setClaimedDaily2x] = useState(!canClaimDaily2x());
  const [searchParams] = useSearchParams();
  const [showConfetti, setShowConfetti] = useState(true);
  const [showFullReview, setShowFullReview] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    const isPro = id ? PRO_TRACK_PREFIXES.some(prefix => id.startsWith(prefix)) : false;
    if (!isPro) {
      recordFreeLessonFinished();
    }
  }, [id]);

  const handleClaimDaily2x = () => {
    addXp(1);
    addCoins(2);
    markDaily2xClaimed();
    setTimeout(() => {
      setClaimedDaily2x(true);
    }, 150);
  };

  // Preserve the query parameter across all navigation jumps.
  const from = searchParams.get('from') ?? 'dashboard';
  const fromQs = `?from=${from}`;

  // 1. Resolve lesson & track
  let lesson: Lesson | TrackLessonItem | undefined;
  let track: Track | undefined;

  if (id) {
    track = TRACKS.find(t => id.startsWith(t.prefix));
    if (track) {
      const found = track.list.find(l => l.id === id);
      if (found) lesson = found;
    }

    // Fallback to core lessons
    if (!lesson) {
      lesson = getLessonById(id);
    }
  }

  useEffect(() => {
    const t = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(t);
  }, []);

  // 2. Normalize Quiz Questions
  const rawQuiz = (lesson as any)?.quiz || (lesson as any)?.questions || [];
  const quizQuestions = useMemo(() => {
    if (!Array.isArray(rawQuiz) || rawQuiz.length === 0) return [];
    return rawQuiz.map((q: any) => ({
      question: q.question || q.q || '',
      options: Array.isArray(q.options) ? q.options : [],
      correctIndex: typeof q.correctIndex === 'number' 
        ? q.correctIndex 
        : (typeof q.answer === 'number' ? q.answer : 0),
      explanation: q.explanation || q.explain || '',
      topic: q.topic || (lesson as any)?.topic || 'Concept Check',
    }));
  }, [rawQuiz, lesson]);

  // 3. Resolve Attempt State (From router location or persistent storage)
  const attempt = useMemo<QuizAttempt | null>(() => {
    if (!id) return null;
    const navState = location.state as { answers?: Record<number, number> } | undefined;
    if (navState && navState.answers) {
      return saveLessonQuizAttempt(id, navState.answers, quizQuestions, lesson?.title);
    }
    return getLessonQuizAttempt(id);
  }, [id, location.state, quizQuestions]);

  // 4. Calculate Missed and Correct Questions for Weak Area Assessment
  const { missedQuestions, correctQuestions, accuracyPercent, isPerfectScore } = useMemo(() => {
    if (!quizQuestions.length) {
      return { missedQuestions: [], correctQuestions: [], accuracyPercent: 100, isPerfectScore: true };
    }

    if (attempt?.answers) {
      const missed = quizQuestions
        .map((q, idx) => {
          const userChoice = attempt.answers[idx];
          const isCorrect = userChoice === q.correctIndex;
          return {
            q,
            index: idx,
            userChoiceIndex: userChoice,
            userChoiceText: userChoice !== undefined && q.options[userChoice] ? q.options[userChoice] : undefined,
            correctChoiceText: q.options[q.correctIndex] ?? 'Correct Option',
            isCorrect,
          };
        })
        .filter((item) => !item.isCorrect);

      const correct = quizQuestions
        .map((q, idx) => ({
          q,
          index: idx,
          isCorrect: attempt.answers[idx] === q.correctIndex,
        }))
        .filter((item) => item.isCorrect);

      const pct = Math.round((correct.length / quizQuestions.length) * 100);
      return {
        missedQuestions: missed,
        correctQuestions: correct,
        accuracyPercent: pct,
        isPerfectScore: missed.length === 0,
      };
    }

    return { missedQuestions: [], correctQuestions: [], accuracyPercent: 100, isPerfectScore: false };
  }, [quizQuestions, attempt]);

  if (!user) return <Navigate to="/auth" replace />;
  if (!lesson) {
    console.warn(`[LessonComplete] Lesson with ID "${id}" was not found! Redirecting to dashboard.`);
    return <Navigate to="/dashboard" replace />;
  }

  // Determine path/nextLesson
  let lessonPath = '/learn';
  let reviewPath = `${track ? track.path : '/lesson'}/${lesson.id}`;
  let nextPath: string | null = null;
  let nextTitle: string | null = null;

  if (track) {
    lessonPath = TRACK_HOME[track.prefix] || '/dashboard';
    const idx = track.list.findIndex(l => l.id === lesson!.id);
    if (idx >= 0 && idx < track.list.length - 1) {
      const nxt = track.list[idx + 1];
      nextPath = `${track.path}/${nxt.id}`;
      nextTitle = nxt.title;
    }
  } else {
    const all = getAllLessons();
    const idx = all.findIndex(l => l.id === lesson!.id);
    if (idx >= 0 && idx < all.length - 1) {
      const nxt = all[idx + 1];
      nextPath = `/lesson/${nxt.id}`;
      nextTitle = nxt.title;
    }
  }

  const takeaways: string[] = (lesson as { keyTakeaways?: string[] }).keyTakeaways || [
    `You learned ${String(lesson.title).toLowerCase()}`,
    'You completed the practice challenge',
    'You earned XP and Sage Coins',
  ];

  // Badge-based level up logic
  const completedCount = user.completedLessons.length;
  const currentLevel = user.level;
  const prevLevel = completedCount > 0 ? badgeForLessons(completedCount - 1).level : 1;
  const isLeveledUp = currentLevel > prevLevel;

  useEffect(() => {
    if (isLeveledUp) {
      playLevelUp();
    } else {
      playTestPassed();
    }
  }, [isLeveledUp]);

  return (
    <div className="min-h-screen bg-background grid-bg relative overflow-hidden flex items-center justify-center p-4 py-8">
      <div className="glow-orb glow-primary w-96 h-96 -top-20 -right-20 opacity-30" />
      <div className="glow-orb glow-accent w-72 h-72 -bottom-10 -left-10 opacity-20" />

      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-20 overflow-hidden">
          {Array.from({ length: 40 }).map((_, i) => (
            <span key={i} className="absolute w-2 h-2 rounded-sm animate-confetti"
              style={{
                left: `${Math.random() * 100}%`, top: '-20px',
                background: ['hsl(var(--primary))', 'hsl(var(--accent))', '#fbbf24', '#f87171'][i % 4],
                animationDelay: `${Math.random() * 1.5}s`,
                animationDuration: `${1.5 + Math.random() * 1.5}s`,
                transform: `rotate(${Math.random() * 360}deg)`,
              }} />
          ))}
        </div>
      )}

      <div className="relative z-10 max-w-xl w-full animate-scale-in">
        {/* Header celebratory banner */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/15 border border-primary/30 neon-glow mb-4">
            <Trophy className="w-10 h-10 text-primary" />
          </div>
          <div className="inline-flex items-center gap-1.5 text-[10px] font-mono text-primary bg-primary/10 px-2.5 py-1 rounded-full mb-3">
            <Sparkles className="w-3 h-3" /> LESSON COMPLETE
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-1">Urrhhhaaa! 🎉</h1>
          <p className="text-sm text-muted-foreground">
            You finished <span className="text-primary font-semibold">{lesson.title}</span>
          </p>
        </div>

        {/* Gamification Stats */}
        <div className="grid grid-cols-3 gap-2 mb-5">
          <div className="glass-card rounded-xl p-3 text-center border border-border/50">
            <Zap className="w-4 h-4 text-primary mx-auto mb-1" />
            <p className="text-lg font-bold font-display text-foreground">+1</p>
            <p className="text-[9px] text-muted-foreground uppercase tracking-wider">XP Earned</p>
          </div>
          <div className="glass-card rounded-xl p-3 text-center border border-border/50">
            <Coins className="w-4 h-4 text-amber-400 mx-auto mb-1" />
            <p className="text-lg font-bold font-display text-foreground">+2</p>
            <p className="text-[9px] text-muted-foreground uppercase tracking-wider">Coins</p>
          </div>
          <div className="glass-card rounded-xl p-3 text-center border border-border/50">
            <Flame className="w-4 h-4 text-orange-400 mx-auto mb-1" />
            <p className="text-lg font-bold font-display text-foreground">{user.streakCount}</p>
            <p className="text-[9px] text-muted-foreground uppercase tracking-wider">Streak Days</p>
          </div>
        </div>

        {/* Daily 2x Reward Boost (1 time per day) */}
        <div className="mb-5 glass-card rounded-xl p-3.5 border border-amber-500/30 bg-amber-500/5 relative overflow-hidden">
          {!claimedDaily2x ? (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                  <Zap className="w-4 h-4 fill-current" />
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    Daily 2x Reward Boost <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400">1x / Day</span>
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Visit sponsor to double this lesson's earnings (+1 XP, +2 Coins).
                  </p>
                </div>
              </div>
              <a
                href={ADS_CONFIG.defaultSponsorLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleClaimDaily2x}
                className="w-full sm:w-auto px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-md shrink-0 flex items-center justify-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5" /> Claim 2x Bonus
              </a>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 text-xs font-mono text-emerald-400 py-0.5">
              <CheckCircle2 className="w-4 h-4" /> 2x Reward claimed for today. Next boost ready tomorrow!
            </div>
          )}
        </div>

         {/* Real Live Running Adsterra Native Banner */}
          <div className="mb-5">
            <AdsterraBanner />
          </div>



        {isLeveledUp && (
          <div className="mb-5 glass-card border border-primary/40 rounded-xl p-3 text-center neon-glow">
            <p className="text-xs font-display font-bold text-primary">⚡ LEVEL UP! You reached Level {user.level}</p>
          </div>
        )}

        {/* ── EXAM ASSESSMENT & WEAK AREAS REVIEW ────────────── */}
        {quizQuestions.length > 0 && (
          <div className="space-y-4 mb-5">
            {/* Accuracy & Assessment Scorecard */}
            {attempt ? (
              <div className="glass-card rounded-2xl p-4 border border-border/50 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm font-mono shrink-0 ${
                    attempt.passed 
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' 
                      : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                  }`}>
                    {accuracyPercent}%
                  </div>
                  <div>
                    <p className="text-xs font-mono font-bold text-foreground uppercase tracking-wider">
                      Assessment Score
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {correctQuestions.length} of {quizQuestions.length} questions answered correctly
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-mono px-2.5 py-1 rounded-full font-semibold border ${
                    attempt.passed 
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  }`}>
                    {attempt.passed ? 'PASSED · CLEAR' : 'NEEDS PRACTICE'}
                  </span>
                </div>
              </div>
            ) : (
              <div className="glass-card rounded-2xl p-3.5 border border-border/40 flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-mono text-[11px]">Assessments on this module: {quizQuestions.length} Questions</span>
                <button
                  onClick={() => navigate(`${reviewPath}?stage=quiz${fromQs}`)}
                  className="text-primary hover:underline font-mono text-[11px] flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" /> Retake Test
                </button>
              </div>
            )}

            {/* 1. WEAK AREAS / ERROR LOGS (If any question was missed) */}
            {missedQuestions.length > 0 && (
              <div className="glass-card rounded-2xl p-4 md:p-5 border border-rose-500/30 bg-rose-500/5 space-y-3">
                <div className="flex items-center justify-between gap-2 border-b border-rose-500/20 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center text-xs shrink-0">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider">
                        WEAK_AREAS & ERROR_LOGS ({missedQuestions.length})
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        Review your incorrect responses to build mastery
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300">
                    Fix Required
                  </span>
                </div>

                <div className="space-y-3 pt-1">
                  {missedQuestions.map(({ q, index, userChoiceText, correctChoiceText }) => (
                    <div key={index} className="p-3.5 rounded-xl border border-rose-500/25 bg-background/80 space-y-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-mono text-muted-foreground uppercase">
                          Question {index + 1}
                        </span>
                        <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20">
                          {q.topic}
                        </span>
                      </div>

                      <p className="text-xs md:text-sm font-semibold text-foreground leading-snug">
                        {q.question}
                      </p>

                      {/* Error & Solution Contrast */}
                      <div className="space-y-2 pt-1">
                        {/* User Input (Red) */}
                        <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/25 flex items-start gap-2 text-xs">
                          <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                          <div className="min-w-0 flex-1">
                            <span className="text-[9px] font-mono text-rose-400 uppercase tracking-wider font-bold block mb-0.5">
                              YOUR INPUT:
                            </span>
                            <span className="text-rose-200 font-medium break-words">
                              {userChoiceText || 'Skipped or unselected'}
                            </span>
                          </div>
                        </div>

                        {/* Valid Solution (Emerald) */}
                        <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/25 flex items-start gap-2 text-xs">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <div className="min-w-0 flex-1">
                            <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-wider font-bold block mb-0.5">
                              VALID FIX:
                            </span>
                            <span className="text-emerald-200 font-medium break-words">
                              {correctChoiceText}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Explanation */}
                      {q.explanation && (
                        <div className="pt-1">
                          <p className="text-[11px] text-muted-foreground border-l-2 border-primary/50 pl-2.5 py-0.5 leading-relaxed bg-primary/5 rounded-r">
                            💡 <span className="font-semibold text-foreground/80">Explanation:</span> {q.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 2. PERFECT MASTERY CARD (If 100% score) */}
            {attempt && isPerfectScore && (
              <div className="glass-card rounded-2xl p-4 border border-emerald-500/40 bg-emerald-500/5 flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Award className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                      PERFECT MASTERY (100%)
                    </p>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                      0 Errors
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Flawless execution! You answered all assessment questions correctly with zero weak areas detected.
                  </p>
                </div>
              </div>
            )}

            {/* 3. FULL SKILL & QUESTION REVIEW (Expandable Accordion) */}
            <div className="glass-card rounded-2xl border border-border/50 overflow-hidden">
              <button
                onClick={() => setShowFullReview(!showFullReview)}
                className="w-full p-3.5 px-4 flex items-center justify-between text-left hover:bg-secondary/30 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-primary" />
                  <span className="text-xs font-mono font-semibold text-foreground">
                    Complete Exam & Skill Breakdown ({quizQuestions.length} Questions)
                  </span>
                </div>
                {showFullReview ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                )}
              </button>

              {showFullReview && (
                <div className="p-4 pt-1 space-y-3 border-t border-border/30 bg-background/50">
                  {quizQuestions.map((q, idx) => {
                    const userSelected = attempt?.answers ? attempt.answers[idx] : undefined;
                    const isPassed = userSelected === q.correctIndex;
                    const hasAnswered = userSelected !== undefined;

                    return (
                      <div
                        key={idx}
                        className={`p-3.5 rounded-xl border transition-all ${
                          hasAnswered
                            ? isPassed
                              ? 'border-emerald-500/30 bg-emerald-500/5'
                              : 'border-rose-500/30 bg-rose-500/5'
                            : 'border-border/30 bg-background/40'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <p className="text-xs font-semibold text-foreground flex items-start gap-2">
                            {hasAnswered ? (
                              isPassed ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                              ) : (
                                <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                              )
                            ) : (
                              <span className="w-4 h-4 rounded-full border border-border flex items-center justify-center text-[9px] text-muted-foreground shrink-0 mt-0.5">
                                {idx + 1}
                              </span>
                            )}
                            <span>{q.question}</span>
                          </p>
                        </div>

                        <div className="space-y-1.5 pl-6">
                          {q.options.map((opt, oi) => {
                            const isCorrect = oi === q.correctIndex;
                            const isChosen = userSelected === oi;

                            let optCls = 'border-border/20 text-muted-foreground bg-background/40';
                            if (isCorrect) {
                              optCls = 'border-emerald-500/50 bg-emerald-500/15 text-emerald-300 font-medium';
                            } else if (isChosen && !isCorrect) {
                              optCls = 'border-rose-500/50 bg-rose-500/15 text-rose-300 font-medium';
                            }

                            return (
                              <div
                                key={oi}
                                className={`text-xs px-2.5 py-1.5 rounded-lg border flex items-center justify-between gap-2 ${optCls}`}
                              >
                                <span>{opt}</span>
                                {isCorrect && (
                                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                                    Correct
                                  </span>
                                )}
                                {isChosen && !isCorrect && (
                                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300">
                                    Your choice
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        {q.explanation && (
                          <p className="text-[11px] text-muted-foreground mt-2 pl-6 italic border-l border-primary/30 ml-6">
                            💡 {q.explanation}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── CODING CHALLENGE VERIFICATION (For Coding Tracks) ── */}
        {(lesson as any)?.challenge && (
          <div className="glass-card rounded-2xl p-4 mb-5 border border-border/50">
            <div className="flex items-center gap-2 mb-2">
              <Code2 className="w-4 h-4 text-primary" />
              <p className="text-xs font-mono font-bold text-foreground uppercase tracking-wider">
                Coding Challenge Validation
              </p>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              {(lesson as any).challenge.instruction || 'Practical coding challenge passed successfully.'}
            </p>
            {(lesson as any).challenge.validationKeywords && (
              <div className="flex flex-wrap gap-1.5">
                {(lesson as any).challenge.validationKeywords.map((kw: string, i: number) => (
                  <span
                    key={i}
                    className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1"
                  >
                    <Check className="w-3 h-3" /> {kw}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── KEY TAKEAWAYS ─────────────────────────────────── */}
        <div className="glass-card rounded-2xl p-4 mb-5 border border-border/50">
          <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-3">
            In this lesson you learned
          </p>
          <ul className="space-y-2">
            {takeaways.map((t, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-foreground">
                <span className="text-primary mt-0.5">✓</span><span>{t}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* ── 1-CLICK VIRAL SHARE BUTTON ───────────────────── */}
        <button
          onClick={() => setShowShareModal(true)}
          className="w-full mb-3 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-primary/20 via-primary/30 to-accent-blue/20 hover:from-primary/30 hover:to-accent-blue/30 text-foreground border border-primary/40 font-bold text-xs shadow-md transition-all hover:scale-[1.01] active:scale-[0.99]"
        >
          <Share2 className="w-4 h-4 text-primary" />
          <span>Share Achievement to WhatsApp & Socials 🔥</span>
        </button>

        {/* ── ACTION COMMAND BAR ───────────────────────────── */}
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => navigate(`${lessonPath}${fromQs}`)}
            className="glass-card border border-border/50 text-foreground text-[11px] py-2.5 rounded-xl hover:border-primary/40 hover:neon-glow transition-all flex flex-col items-center justify-center gap-1"
          >
            <BookOpen className="w-3.5 h-3.5 text-primary" /> Lesson Path
          </button>
          
          <button
            onClick={() => navigate(`${reviewPath}?stage=quiz${fromQs}`)}
            className="glass-card border border-border/50 text-foreground text-[11px] py-2.5 rounded-xl hover:border-primary/40 hover:neon-glow transition-all flex flex-col items-center justify-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5 text-primary" /> Retake Quiz
          </button>

          {nextPath ? (
            <button
              onClick={() => navigate(`${nextPath}${fromQs}`)}
              title={nextTitle || 'Next'}
              className="bg-primary text-primary-foreground text-[11px] font-semibold py-2.5 rounded-xl neon-glow hover:opacity-90 flex flex-col items-center justify-center gap-1"
            >
              <ArrowRight className="w-3.5 h-3.5" /> Next Lesson
            </button>
          ) : (
            <button
              onClick={() => navigate(`/dashboard${fromQs}`)}
              className="bg-primary text-primary-foreground text-[11px] font-semibold py-2.5 rounded-xl neon-glow"
            >
              Dashboard
            </button>
          )}
        </div>
      </div>

      {/* Share Achievement Modal */}
      <ShareAchievementModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        title={lesson?.title || 'Lesson'}
        topic={track?.prefix ? track.prefix.replace('-', ' ') : 'Software Engineering'}
        achievementType="lesson"
      />
    </div>
  );
};

export default LessonComplete;
