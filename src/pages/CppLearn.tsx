// src/pages/CppLearn.tsx
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { CPP_LESSONS, isCppLessonUnlocked } from '@/data/cppLessons';
import { ArrowLeft, Lock, Check, ChevronRight, Flame } from 'lucide-react';
import { motion } from 'framer-motion';
import { useScrollTop } from '@/hooks/useScrollTop';
import { AdBannerCard } from '@/components/AdBannerCard';

const CppLearn = () => {
  useScrollTop();

  const { user } = useUser();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const from = params.get('from');
  const fromQs = from ? `?from=${from}` : '';

  if (!user) {
    navigate('/auth');
    return null;
  }

  const lessonList = CPP_LESSONS.filter(l => !('type' in l));
  const completed = lessonList.filter(l =>
    user.completedLessons.includes(l.id)
  ).length;

  const total = lessonList.length;
  const progress = Math.round((completed / total) * 100);

  return (
    <div className="min-h-screen bg-background grid-bg relative overflow-x-hidden w-full max-w-full">
      {/* Background Glow Effect - Adjusted to a C++ themed blue/cyan tint */}
      <div className="absolute top-[-10%] right-[-5%] w-[300px] sm:w-[400px] h-[300px] sm:h-[400px] rounded-full bg-blue-400/5 blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="border-b border-border/30 backdrop-blur-xl bg-background/80 px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between sticky top-0 z-20 w-full box-border">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 mr-2">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-muted-foreground hover:text-foreground p-1 rounded-lg transition-colors flex-shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1">
            <span className="text-lg sm:text-xl flex-shrink-0">⚙️</span>
            <span className="text-xs sm:text-sm font-bold font-display truncate block">
              C++ Programming
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 bg-primary/10 px-2 py-1 sm:px-2.5 rounded-full border border-primary/20 flex-shrink-0">
          <Flame className="w-3.5 h-3.5 text-primary" />
          <span className="text-[10px] sm:text-xs font-bold text-primary">
            {user.streakCount}
          </span>
        </div>
      </header>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto p-3 sm:p-4 space-y-3 sm:space-y-4 pb-8 relative z-10 w-full box-border"
      >
        {/* Progress Card */}
        <div className="glass-card rounded-2xl p-3 sm:p-4">
          <div className="flex justify-between text-[10px] sm:text-xs mb-2">
            <span className="text-muted-foreground">Module Progress</span>
            <span className="text-foreground font-mono">
              {completed}/{total} ({progress || 0}%)
            </span>
          </div>

          <div className="w-full h-1.5 sm:h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500"
              style={{ width: `${progress || 0}%` }}
            />
          </div>
        </div>

        {/* Developer Track Sponsor Banner */}
        <div className="pt-0.5">
          <AdBannerCard slotName="learnTrackPage" format="horizontal-banner" />
        </div>

        {/* Lessons List */}
        <div className="space-y-2 sm:space-y-2.5">
          {lessonList.map((lesson, i) => {
            const isCompleted = user.completedLessons.includes(lesson.id);
            const isUnlocked = isCppLessonUnlocked(
              lesson.id,
              user.completedLessons
            );

            return (
              <motion.button
                key={lesson.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.02 }}
                onClick={() =>
                  isUnlocked &&
                  navigate(`/cpp-lesson/${lesson.id}${fromQs}`)
                }
                disabled={!isUnlocked}
                className={`w-full glass-card rounded-xl p-3 sm:p-4 flex items-center gap-2.5 sm:gap-3 text-left transition-all ${
                  isUnlocked
                    ? 'hover:neon-border cursor-pointer'
                    : 'opacity-50 cursor-not-allowed'
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
                  <p className="text-[9px] sm:text-[10px] font-mono text-muted-foreground uppercase truncate">
                    Lesson {lesson.order}
                  </p>

                  <p className="text-xs sm:text-sm font-display font-semibold text-foreground truncate block">
                    {lesson.title}
                  </p>
                </div>

                <div className="flex-shrink-0">
                  {isCompleted ? (
                    <Check className="w-4 h-4 text-success" />
                  ) : isUnlocked ? (
                    <ChevronRight className="w-4 h-4 text-primary" />
                  ) : (
                    <Lock className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default CppLearn;
