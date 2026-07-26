import { useEffect, useState } from 'react';
import { useNavigate, useParams, Navigate, useSearchParams } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { getLessonById, getAllLessons, type Lesson } from '@/data/lessons';
import { NETWORKING_LESSONS } from '@/data/networkingLessons';
import { AI_LESSONS } from '@/data/aiFundamentalsLesson';
import { FREELANCE_LESSONS } from '@/data/freelanceLessons';
import { FULLSTACK_LESSONS } from '@/data/fullstackLessons';
import { PYTHON_LESSONS } from '@/data/pythonLessons';
import { LOCAL_LESSONS } from '@/data/localLessons';
import { PYTHON_EXPERT_LESSONS } from '@/data/pythonExpertLessons';
import { SQL_LESSONS } from '@/data/sqlLessons';
import { THREE3D_LESSONS } from '@/data/three3dLessons';
import { REAL_FREELANCE_LESSONS } from '@/data/realfreelanceLesson';
import { Trophy, Zap, Coins, Flame, ArrowRight, BookOpen, RotateCcw, Sparkles } from 'lucide-react';

type Track = { prefix: string; path: string; list: Array<{ id: string; title: string }> };

const TRACKS: Track[] = [
  { prefix: 'net-',   path: '/n-lesson',     list: NETWORKING_LESSONS.map(l => ({ id: l.id, title: l.title })) },
  { prefix: 'ai-', path: '/ai-lesson',       list: AI_LESSONS.map(l => ({ id: l.id, title: l.title })) },
  { prefix: 'free-',  path: '/f-lesson',     list: FREELANCE_LESSONS.map(l => ({ id: l.id, title: l.title })) },
  { prefix: 'fs-',    path: '/fs-lesson',    list: FULLSTACK_LESSONS.map(l => ({ id: l.id, title: l.title })) },
  { prefix: 'pyx-',   path: '/pyx-lesson',   list: PYTHON_EXPERT_LESSONS.map(l => ({ id: l.id, title: l.title })) },
  { prefix: 'py-',    path: '/py-lesson',    list: PYTHON_LESSONS.map(l => ({ id: l.id, title: l.title })) },
  { prefix: 'local-', path: '/local-lesson', list: LOCAL_LESSONS.map(l => ({ id: l.id, title: l.title })) },
  { prefix: 'sql-',   path: '/sql-lesson',   list: (SQL_LESSONS || []).map(l => ({ id: l.id, title: l.title })) },
  { prefix: 'three3d-', path: '/three-lesson', list: THREE3D_LESSONS.map(l => ({ id: l.id, title: l.title })) },
  { prefix: 'rf-',    path: '/rf-lesson',    list: REAL_FREELANCE_LESSONS.map(l => ({ id: l.id, title: l.title })) },
];

const TRACK_HOME: Record<string, string> = {
  'net-': '/networking', 'free-': '/freelance', 'fs-': '/fullstack',
  'py-': '/python', 'local-': '/local', 'pyx-': '/pythonexpert',
  'sql-': '/sql-learn', 'ai-': '/ai-fundamentals', 'three3d-': '/three3d',
  'rf-': '/real-freelance',
};

const LessonComplete = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useUser();
  const [searchParams] = useSearchParams();
  const [showConfetti, setShowConfetti] = useState(true);

  // Preserve the query parameter across all navigation jumps.
  const from = searchParams.get('from') ?? 'dashboard';
  const fromQs = `?from=${from}`;

  // Find lesson + track (with bulletproof fallback for missing hyphens like 'py1')
  let lesson: Lesson | { id: string; title: string; keyTakeaways?: string[] } | undefined = id ? getLessonById(id) : undefined;
  let track: Track | undefined;
  if (!lesson && id) {
    track = TRACKS.find(t => id.startsWith(t.prefix) || id.startsWith(t.prefix.replace('-', '')));
    if (track) {
      const found = track.list.find(l => l.id === id);
      if (found) lesson = { id: found.id, title: found.title };
    }
  }

  useEffect(() => {
    const t = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(t);
  }, []);

  if (!user) return <Navigate to="/auth" replace />;
  if (!lesson) return <Navigate to="/dashboard" replace />;

  // Determine path/nextLesson
  let lessonPath = '/learn';
  let reviewPath = `${track ? track.path : '/lesson'}/${lesson.id}`;
  let nextPath: string | null = null;
  let nextTitle: string | null = null;

  if (track) {
    lessonPath = TRACK_HOME[track.prefix];
    const idx = track.list.findIndex(l => l.id === lesson.id);
    if (idx >= 0 && idx < track.list.length - 1) {
      const nxt = track.list[idx + 1];
      nextPath = `${track.path}/${nxt.id}`;
      nextTitle = nxt.title;
    }
  } else {
    const all = getAllLessons();
    const idx = all.findIndex(l => l.id === lesson.id);
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
  const isLeveledUp = (user.xp - 5) > 0 && Math.floor((user.xp - 5) / 200) < Math.floor(user.xp / 200);

  return (
    <div className="min-h-screen bg-background grid-bg relative overflow-hidden flex items-center justify-center p-4">
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

      <div className="relative z-10 max-w-md w-full animate-scale-in">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/15 border border-primary/30 neon-glow mb-4">
            <Trophy className="w-10 h-10 text-primary" />
          </div>
          <div className="inline-flex items-center gap-1.5 text-[10px] font-mono text-primary bg-primary/10 px-2.5 py-1 rounded-full mb-3">
            <Sparkles className="w-3 h-3" /> LESSON COMPLETE
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground mb-1">Urrhhhaaa! 🎉</h1>
          <p className="text-sm text-muted-foreground">
            You finished <span className="text-primary font-semibold">{lesson.title}</span>
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-5">
          <div className="glass-card rounded-xl p-3 text-center">
            <Zap className="w-4 h-4 text-yellow-400 mx-auto mb-1" />
            <p className="text-lg font-bold font-display text-foreground">+5</p>
            <p className="text-[9px] text-muted-foreground uppercase tracking-wider">XP</p>
          </div>
          <div className="glass-card rounded-xl p-3 text-center">
            <Coins className="w-4 h-4 text-amber-400 mx-auto mb-1" />
            <p className="text-lg font-bold font-display text-foreground">+2</p>
            <p className="text-[9px] text-muted-foreground uppercase tracking-wider">Coins</p>
          </div>
          <div className="glass-card rounded-xl p-3 text-center">
            <Flame className="w-4 h-4 text-orange-400 mx-auto mb-1" />
            <p className="text-lg font-bold font-display text-foreground">{user.streakCount}</p>
            <p className="text-[9px] text-muted-foreground uppercase tracking-wider">Streak</p>
          </div>
        </div>

        {isLeveledUp && (
          <div className="mb-5 glass-card border border-primary/40 rounded-xl p-3 text-center neon-glow">
            <p className="text-xs font-display font-bold text-primary">⚡ LEVEL UP! You reached Level {user.level}</p>
          </div>
        )}

        <div className="glass-card rounded-2xl p-4 mb-5">
          <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-3">In this lesson you learned</p>
          <ul className="space-y-2">
            {takeaways.map((t, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-foreground">
                <span className="text-primary mt-0.5">✓</span><span>{t}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => navigate(`${lessonPath}${fromQs}`)}
            className="glass-card border border-border/50 text-foreground text-[11px] py-2.5 rounded-xl hover:border-primary/40 hover:neon-glow transition-all flex flex-col items-center justify-center gap-1"
          >
            <BookOpen className="w-3.5 h-3.5 text-primary" /> Lesson Path
          </button>
          <button
            onClick={() => navigate(`${reviewPath}${fromQs}`)}
            className="glass-card border border-border/50 text-foreground text-[11px] py-2.5 rounded-xl hover:border-primary/40 hover:neon-glow transition-all flex flex-col items-center justify-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5 text-primary" /> Review
          </button>
          {nextPath ? (
            <button
              onClick={() => navigate(`${nextPath}${fromQs}`)}
              title={nextTitle || 'Next'}
              className="bg-primary text-primary-foreground text-[11px] font-semibold py-2.5 rounded-xl neon-glow hover:opacity-90 flex flex-col items-center justify-center gap-1"
            >
              <ArrowRight className="w-3.5 h-3.5" /> Next
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
    </div>
  );
};

export default LessonComplete;
