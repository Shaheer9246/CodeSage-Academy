import { useNavigate, useSearchParams } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { CYBER_LESSONS, isCyberLessonUnlocked } from '@/data/cyberLessons';
import { ArrowLeft, Lock, Check, ChevronRight, Flame, Shield, Terminal } from 'lucide-react';
import { motion } from 'framer-motion';
import { useScrollTop } from '@/hooks/useScrollTop';

const CyberLearn = () => {
  useScrollTop();
  const { user } = useUser();
  const navigate = useNavigate();
  const [sp] = useSearchParams();
  const from = sp.get('from');
  const fromQs = from ? `?from=${from}` : '';
  const backTo = from === 'roadmap' ? '/roadmap' : '/dashboard';

  if (!user) {
    navigate('/auth');
    return null;
  }

  const completed = CYBER_LESSONS.filter(l => user.completedLessons.includes(l.id)).length;
  const total = CYBER_LESSONS.length;
  const progress = Math.round((completed / total) * 100);

  return (
    <div className="min-h-screen bg-background grid-bg relative overflow-x-hidden w-full max-w-full">
      {/* Background Cyber Glow */}
      <div className="absolute top-[-10%] right-[-5%] w-[300px] sm:w-[400px] h-[300px] sm:h-[400px] rounded-full bg-emerald-500/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[250px] sm:w-[350px] h-[250px] sm:h-[350px] rounded-full bg-cyan-500/10 blur-[130px] pointer-events-none" />

      {/* Header */}
      <header className="border-b border-border/30 backdrop-blur-xl bg-background/80 px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between sticky top-0 z-20 w-full box-border">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 mr-2">
          <button 
            onClick={() => navigate(backTo)} 
            className="text-muted-foreground hover:text-foreground transition-colors p-1 flex-shrink-0"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1">
            <span className="text-lg sm:text-xl flex-shrink-0">🛡️</span>
            <div className="min-w-0">
              <span className="text-xs sm:text-sm font-bold font-display truncate block">Cyber Security & Defense</span>
              <span className="text-[10px] text-muted-foreground font-mono hidden sm:block">TryHackMe-Style Pre-Security Path</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2 bg-primary/10 px-2 py-1 sm:px-2.5 rounded-full border border-primary/20 flex-shrink-0">
          <Flame className="w-3.5 h-3.5 text-primary" />
          <span className="text-[10px] sm:text-xs font-bold text-primary">{user.streakCount}</span>
        </div>
      </header>

      {/* Main Content */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="max-w-2xl mx-auto p-3 sm:p-4 space-y-3 sm:space-y-4 pb-12 relative z-10 w-full box-border"
      >
        {/* Track Banner */}
        <div className="glass-card rounded-2xl p-4 sm:p-5 border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 via-card/60 to-transparent relative overflow-hidden">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-[10px] font-mono text-emerald-400 mb-1.5 uppercase tracking-wider">
                <Terminal className="w-3 h-3" /> 20 Practical Missions
              </div>
              <h1 className="font-display font-bold text-base sm:text-lg text-foreground">Ethical Hacker Foundations</h1>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                Linux internals, packet forensics, reconnaissance, OWASP Top 10 web vulnerabilities, and modern cryptography.
              </p>
            </div>
            <Shield className="w-10 h-10 text-emerald-400/40 shrink-0 hidden sm:block" />
          </div>

          <div className="space-y-1.5 pt-2 border-t border-border/20">
            <div className="flex justify-between text-[10px] sm:text-xs">
              <span className="text-muted-foreground">Track Mastery</span>
              <span className="text-foreground font-mono font-bold">{completed}/{total} ({progress || 0}%)</span>
            </div>
            <div className="w-full h-1.5 sm:h-2 bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-400 via-primary to-cyan-400 rounded-full transition-all duration-500" 
                style={{ width: `${progress || 0}%` }} 
              />
            </div>
          </div>
        </div>

        {/* Lessons List */}
        <div className="space-y-2 sm:space-y-2.5">
          {CYBER_LESSONS.map((lesson, i) => {
            const isCompleted = user.completedLessons.includes(lesson.id);
            const isUnlocked = isCyberLessonUnlocked(lesson.id, user.completedLessons);

            return (
              <motion.button
                key={lesson.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.015 }}
                onClick={() => isUnlocked && navigate(`/cyber-lesson/${lesson.id}${fromQs}`)}
                disabled={!isUnlocked}
                className={`w-full glass-card rounded-xl p-3 sm:p-4 flex items-center gap-2.5 sm:gap-3 text-left transition-all ${
                  isUnlocked 
                    ? 'hover:border-emerald-500/40 hover:shadow-[0_0_20px_-8px_rgba(16,185,129,0.25)] cursor-pointer' 
                    : 'opacity-50 cursor-not-allowed'
                }`}
              >
                <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg sm:text-xl border ${
                  isCompleted 
                    ? 'bg-emerald-500/15 border-emerald-500/30' 
                    : isUnlocked 
                    ? 'bg-primary/10 border-primary/20' 
                    : 'bg-secondary/40 border-border/30'
                }`}>
                  {lesson.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <p className="text-[9px] sm:text-[10px] font-mono text-muted-foreground uppercase truncate">
                      Mission {lesson.order} · {lesson.module.split(':')[0]}
                    </p>
                  </div>
                  <p className="text-xs sm:text-sm font-display font-semibold text-foreground truncate block">
                    {lesson.title}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  {isCompleted ? (
                    <Check className="w-4 h-4 text-emerald-400" />
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

export default CyberLearn;
