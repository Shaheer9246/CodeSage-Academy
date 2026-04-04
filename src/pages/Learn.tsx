import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { allLevels, getAllLessons, isLessonUnlocked, getCompletedCount } from '@/data/lessons';
import { ArrowLeft, Lock, Check, ChevronDown, ChevronRight, Flame, Trophy } from 'lucide-react';
import { useState } from 'react';

const Learn = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [expandedLevel, setExpandedLevel] = useState<string>('basic');
  const [expandedTopics, setExpandedTopics] = useState<string[]>(['html-basics']);

  if (!user) { navigate('/auth'); return null; }

  const totalLessons = getAllLessons().length;
  const completedCount = user.completedLessons.length;
  const progress = totalLessons ? Math.round((completedCount / totalLessons) * 100) : 0;

  const isLevelUnlocked = (level: string): boolean => {
    if (level === 'basic') return true;
    if (level === 'intermediate') {
      const basicStats = getCompletedCount(user.completedLessons, 'basic');
      return basicStats.completed === basicStats.total && user.completedTests.includes('test-basic');
    }
    if (level === 'expert') {
      const intStats = getCompletedCount(user.completedLessons, 'intermediate');
      return intStats.completed === intStats.total && user.completedTests.includes('test-intermediate');
    }
    return false;
  };

  const levelStyles: Record<string, { badge: string; accent: string }> = {
    basic: { badge: 'text-success border-success/30 bg-success/10', accent: 'bg-success' },
    intermediate: { badge: 'text-warning border-warning/30 bg-warning/10', accent: 'bg-warning' },
    expert: { badge: 'text-destructive border-destructive/30 bg-destructive/10', accent: 'bg-destructive' },
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="glow-orb glow-accent w-48 h-48 top-20 -right-10 opacity-20" />

      <header className="border-b border-border glass-card px-4 sm:px-6 py-3 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/dashboard')} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="w-7 h-7 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
            <span className="text-xs font-bold text-primary-foreground font-mono">&lt;/&gt;</span>
          </div>
          <span className="text-base font-bold text-foreground font-mono">Learning Path</span>
        </div>
        <div className="flex items-center gap-2 bg-primary/10 px-2.5 py-1 rounded-full">
          <Flame className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-bold text-primary">{user.streakCount}</span>
        </div>
      </header>

      <div className="max-w-3xl mx-auto p-4 sm:p-6 relative z-10">
        {/* Progress */}
        <div className="glass-card rounded-xl p-4 mb-5">
          <div className="flex justify-between text-xs mb-2">
            <span className="text-muted-foreground">Overall Progress</span>
            <span className="text-foreground font-mono">{completedCount}/{totalLessons} ({progress}%)</span>
          </div>
          <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary via-accent to-primary rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Levels roadmap */}
        <div className="space-y-3">
          {allLevels.map((level) => {
            const stats = getCompletedCount(user.completedLessons, level.level);
            const unlocked = isLevelUnlocked(level.level);
            const isExpanded = expandedLevel === level.level;
            const style = levelStyles[level.level];

            return (
              <div key={level.level} className={`glass-card rounded-xl overflow-hidden transition-all ${!unlocked ? 'opacity-50' : ''}`}>
                <button
                  onClick={() => unlocked && setExpandedLevel(isExpanded ? '' : level.level)}
                  className={`w-full flex items-center justify-between p-4 text-left ${!unlocked ? 'cursor-not-allowed' : 'hover:bg-secondary/20'} transition-colors`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`px-2.5 py-1 rounded-full text-xs font-bold border ${style.badge}`}>
                      {level.label}
                    </div>
                    <span className="text-xs text-muted-foreground">{stats.completed}/{stats.total} lessons</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    {!unlocked && <Lock className="w-3.5 h-3.5 text-muted-foreground" />}
                    <div className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div className={`h-full ${style.accent} rounded-full transition-all`} style={{ width: `${stats.total ? (stats.completed / stats.total) * 100 : 0}%` }} />
                    </div>
                    {isExpanded ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
                  </div>
                </button>

                {isExpanded && unlocked && (
                  <div className="px-4 pb-4 space-y-2.5">
                    {level.topics.map(topic => {
                      const topicExpanded = expandedTopics.includes(topic.id);
                      const topicCompleted = topic.lessons.filter(l => user.completedLessons.includes(l.id)).length;

                      return (
                        <div key={topic.id} className="border border-border rounded-lg overflow-hidden bg-secondary/10">
                          <button
                            onClick={() => setExpandedTopics(prev => prev.includes(topic.id) ? prev.filter(t => t !== topic.id) : [...prev, topic.id])}
                            className="w-full flex items-center justify-between p-3 hover:bg-secondary/20 transition-colors"
                          >
                            <span className="flex items-center gap-2 text-sm text-foreground">
                              <span>{topic.icon}</span> {topic.name}
                            </span>
                            <span className="text-xs text-muted-foreground font-mono">{topicCompleted}/{topic.lessons.length}</span>
                          </button>

                          {topicExpanded && (
                            <div className="px-3 pb-3 space-y-0.5">
                              {topic.lessons.map((lesson, i) => {
                                const completed = user.completedLessons.includes(lesson.id);
                                const lessonUnlocked = isLessonUnlocked(lesson.id, user.completedLessons);
                                return (
                                  <button
                                    key={lesson.id}
                                    onClick={() => lessonUnlocked && navigate(`/lesson/${lesson.id}`)}
                                    disabled={!lessonUnlocked}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-xs transition-all ${
                                      !lessonUnlocked ? 'text-muted-foreground/30 cursor-not-allowed' :
                                      completed ? 'text-success bg-success/5 hover:bg-success/10' :
                                      'text-foreground hover:bg-secondary/30'
                                    }`}
                                  >
                                    {completed ? <Check className="w-3.5 h-3.5 text-success flex-shrink-0" /> :
                                     !lessonUnlocked ? <Lock className="w-3.5 h-3.5 flex-shrink-0" /> :
                                     <div className="w-3.5 h-3.5 rounded-full border-2 border-muted-foreground/30 flex-shrink-0" />}
                                    <span>{i + 1}. {lesson.title}</span>
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {/* Level test */}
                    {level.level !== 'expert' && (
                      <div className="border border-primary/20 rounded-lg p-4 bg-primary/5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Trophy className="w-4 h-4 text-primary" />
                            <div>
                              <p className="text-xs font-semibold text-foreground">{level.label} Final Test</p>
                              <p className="text-[10px] text-muted-foreground">Complete all lessons to unlock</p>
                            </div>
                          </div>
                          {user.completedTests.includes(`test-${level.level}`) ? (
                            <span className="text-success text-xs font-semibold">✅ Passed</span>
                          ) : stats.completed === stats.total ? (
                            <button
                              onClick={() => navigate(`/test/${level.level}`)}
                              className="bg-primary text-primary-foreground px-3 py-1.5 rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity"
                            >
                              Take Test
                            </button>
                          ) : (
                            <Lock className="w-3.5 h-3.5 text-muted-foreground" />
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Learn;
