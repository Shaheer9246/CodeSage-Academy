import { useNavigate, useSearchParams } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { PYTHON_LESSONS, isPythonLessonUnlocked } from '@/data/pythonLessons';
import { ArrowLeft, Lock, Check, ChevronRight, Flame } from 'lucide-react';
import { motion } from 'framer-motion';

const PythonLearn = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const fromDashboard = params.get('from') === 'dashboard';
  if (!user) { navigate('/auth'); return null; }

const lessonList = PYTHON_LESSONS.filter(l => !('type' in l));
const completed = lessonList.filter(l => user.completedLessons.includes(l.id)).length;
const total = lessonList.length;
  const progress = Math.round((completed / total) * 100);

  return (
    <div className="min-h-screen bg-background grid-bg relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-yellow-400/5 blur-[120px] pointer-events-none" />

      <header className="border-b border-border/30 backdrop-blur-xl bg-background/80 px-4 py-3 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(fromDashboard ? '/roadmap' : '/dashboard')} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xl">🐍</span>
            <span className="text-sm font-bold font-display">Python Programming</span>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-primary/10 px-2.5 py-1 rounded-full border border-primary/20">
          <Flame className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-bold text-primary">{user.streakCount}</span>
        </div>
      </header>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto p-4 space-y-4 relative z-10">
        <div className="glass-card rounded-2xl p-4">
          <div className="flex justify-between text-xs mb-2">
            <span className="text-muted-foreground">Module Progress</span>
            <span className="text-foreground font-mono">{completed}/{total} ({progress}%)</span>
          </div>
          <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary to-accent rounded-full" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="space-y-2">
         {lessonList.map((lesson, i) => {
            const isCompleted = user.completedLessons.includes(lesson.id);
            const isUnlocked = isPythonLessonUnlocked(lesson.id, user.completedLessons);
            return (
              <motion.button key={lesson.id}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.02 }}
                onClick={() => isUnlocked && navigate(`/py-lesson/${lesson.id}`)}
                disabled={!isUnlocked}
                className={`w-full glass-card rounded-xl p-4 flex items-center gap-3 text-left transition-all ${
                  isUnlocked ? 'hover:neon-border cursor-pointer' : 'opacity-50 cursor-not-allowed'
                }`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-xl border ${
                  isCompleted ? 'bg-success/15 border-success/30' : 'bg-primary/10 border-primary/20'
                }`}>{lesson.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-mono text-muted-foreground uppercase">Lesson {lesson.order}</p>
                  <p className="text-sm font-display font-semibold text-foreground truncate">{lesson.title}</p>
                </div>
                {isCompleted ? <Check className="w-4 h-4 text-success" /> :
                 isUnlocked ? <ChevronRight className="w-4 h-4 text-primary" /> :
                 <Lock className="w-4 h-4 text-muted-foreground" />}
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default PythonLearn;
