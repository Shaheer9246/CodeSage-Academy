import { useNavigate, useSearchParams } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { REAL_FREELANCE_LESSONS, isRealFreelanceLessonUnlocked } from '@/data/realfreelanceLesson';
import { ArrowLeft, Lock, Check, ChevronRight, Flame } from 'lucide-react';
import { motion } from 'framer-motion';
import { useScrollTop } from '@/hooks/useScrollTop';

const RealFreelanceLearn = () => {
  useScrollTop();
  const { user } = useUser();
  const navigate = useNavigate();
  const [sp] = useSearchParams();
  const backTo = sp.get('from') === 'roadmap' ? '/roadmap' : '/dashboard';

  if (!user) { navigate('/auth'); return null; }

  const completed = REAL_FREELANCE_LESSONS.filter(l => user.completedLessons.includes(l.id)).length;
  const total = REAL_FREELANCE_LESSONS.length;
  const progress = Math.round((completed / total) * 100);

  return (
    <div className="min-h-screen bg-background grid-bg relative overflow-x-hidden w-full max-w-full">
      <div className="absolute top-[-10%] right-[-5%] w-[280px] sm:w-[400px] h-[280px] sm:h-[400px] rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />

      <header className="border-b border-border/30 backdrop-blur-xl bg-background/80 px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between sticky top-0 z-20 w-full box-border min-w-0 overflow-hidden">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 mr-2 overflow-hidden">
          <button onClick={() => navigate(backTo)} className="text-muted-foreground hover:text-foreground shrink-0 p-1">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1 overflow-hidden">
            <span className="text-lg sm:text-xl shrink-0">⚔️</span>
            <span className="text-xs sm:text-sm font-bold font-display truncate block min-w-0">Real-World Freelancing</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2 bg-primary/10 px-2 py-1 sm:px-2.5 rounded-full border border-primary/20 shrink-0">
          <Flame className="w-3.5 h-3.5 text-primary" />
          <span className="text-[10px] sm:text-xs font-bold text-primary">{user.streakCount}</span>
        </div>
      </header>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto p-3 sm:p-4 space-y-3 sm:space-y-4 relative z-10 w-full box-border">
        <div className="glass-card rounded-2xl p-3 sm:p-4 w-full box-border">
          <div className="flex justify-between text-[10px] sm:text-xs mb-2">
            <span className="text-muted-foreground">Module Progress</span>
            <span className="text-foreground font-mono">{completed}/{total} ({progress}%)</span>
          </div>
          <div className="w-full h-1.5 sm:h-2 bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary to-accent rounded-full" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="space-y-2 sm:space-y-2.5 w-full">
          {REAL_FREELANCE_LESSONS.map((lesson, i) => {
            const isCompleted = user.completedLessons.includes(lesson.id);
            const isUnlocked = isRealFreelanceLessonUnlocked(lesson.id, user.completedLessons);
            return (
              <motion.button
                key={lesson.id}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
                onClick={() => isUnlocked && navigate(`/rf-lesson/${lesson.id}`)}
                disabled={!isUnlocked}
                className={`w-full glass-card rounded-xl p-3 sm:p-4 flex items-center gap-2.5 sm:gap-3 text-left transition-all box-border min-w-0 overflow-hidden ${
                  isUnlocked ? 'hover:neon-border cursor-pointer' : 'opacity-50 cursor-not-allowed'
                }`}
              >
                <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg sm:text-xl border ${
                  isCompleted ? 'bg-success/15 border-success/30' : 'bg-primary/10 border-primary/20'
                }`}>
                  {lesson.icon}
                </div>
                <div className="flex-1 min-w-0 overflow-hidden">
                  <p className="text-[9px] sm:text-[10px] font-mono text-muted-foreground uppercase truncate block">Lesson {lesson.order}</p>
                  <p className="text-xs sm:text-sm font-display font-semibold text-foreground truncate block min-w-0">{lesson.title}</p>
                </div>
                <div className="flex-shrink-0">
                  {isCompleted ? <Check className="w-4 h-4 text-success" /> :
                   isUnlocked ? <ChevronRight className="w-4 h-4 text-primary" /> :
                   <Lock className="w-4 h-4 text-muted-foreground" />}
                </div>
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default RealFreelanceLearn;
