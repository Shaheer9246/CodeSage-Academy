import { useNavigate, useSearchParams } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { NETWORKING_LESSONS, isNetworkingLessonUnlocked } from '@/data/networkingLessons';
import { ArrowLeft, Lock, Check, ChevronRight, Flame } from 'lucide-react';
import { motion } from 'framer-motion';
import { useScrollTop } from '@/hooks/useScrollTop';

const NetworkingLearn = () => {
  useScrollTop();
  const { user } = useUser();
  const navigate = useNavigate();
  const [sp] = useSearchParams();
  const from = sp.get('from');
  const fromQs = from ? `?from=${from}` : '';
  const backTo = from === 'roadmap' ? '/roadmap' : '/dashboard';

  if (!user) { navigate('/auth'); return null; }

  const completed = NETWORKING_LESSONS.filter(l => user.completedLessons.includes(l.id)).length;
  const total = NETWORKING_LESSONS.length;
  const progress = Math.round((completed / total) * 100);

  return (
    <div className="min-h-screen bg-background grid-bg relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-accent-blue/5 blur-[120px] pointer-events-none" />

     <header className="border-b border-border/30 backdrop-blur-xl bg-background/80 px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between sticky top-0 z-20">
  <div className="flex items-center gap-2 sm:gap-3">
          <button onClick={() => navigate(backTo)} className="text-muted-foreground hover:text-foreground p-1 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-1.5 sm:gap-2">
    <span className="text-lg sm:text-xl">🌐</span>
    <span className="text-xs sm:text-sm font-bold font-display">Computer & Networking</span>
  </div>
</div>
<div className="flex items-center gap-1.5 sm:gap-2 bg-primary/10 px-2 py-1 sm:px-2.5 rounded-full border border-primary/20">
  <Flame className="w-3.5 h-3.5 text-primary" />
  <span className="text-[10px] sm:text-xs font-bold text-primary">{user.streakCount}</span>
</div>
      </header>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto p-3 sm:p-4 space-y-3 sm:space-y-4 pb-8 relative z-10">
<div className="glass-card rounded-2xl p-3 sm:p-4">
  <div className="flex justify-between text-[10px] sm:text-xs mb-2">
    <span className="text-muted-foreground">Module Progress</span>
    <span className="text-foreground font-mono">{completed}/{total} ({progress}%)</span>
  </div>
  <div className="w-full h-1.5 sm:h-2 bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>

<div className="space-y-2 sm:space-y-2.5">
          {NETWORKING_LESSONS.map((lesson, i) => {
            const isCompleted = user.completedLessons.includes(lesson.id);
            const isUnlocked = isNetworkingLessonUnlocked(lesson.id, user.completedLessons);

            return (
              <motion.button
                key={lesson.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => isUnlocked && navigate(`/n-lesson/${lesson.id}${fromQs}`)}
                disabled={!isUnlocked}
                className={`w-full glass-card rounded-xl p-3 sm:p-4 flex items-center gap-2.5 sm:gap-3 text-left transition-all ${
                  isUnlocked ? 'hover:neon-border cursor-pointer' : 'opacity-50 cursor-not-allowed'
                }`}
              >
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg sm:text-xl border ${
                    isCompleted
                      ? 'bg-success/15 border-success/30'
                      : 'bg-primary/10 border-primary/20'
                  }`}
                >
                  {lesson.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-[9px] sm:text-[10px] font-mono text-muted-foreground uppercase">
                    Lesson {lesson.order}
                  </p>
                  <p className="text-sm sm:text-base font-display font-semibold text-foreground truncate">
                    {lesson.title}
                  </p>
                </div>

                {isCompleted ? (
                  <Check className="w-4 h-4 text-success flex-shrink-0" />
                ) : isUnlocked ? (
                  <ChevronRight className="w-4 h-4 text-primary flex-shrink-0" />
                ) : (
                  <Lock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                )}
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default NetworkingLearn;
