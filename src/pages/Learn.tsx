import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { allLevels, getAllLessons, isLessonUnlocked, getCompletedCount } from '@/data/lessons';
import { Code2, ArrowLeft, Lock, Check, ChevronDown, ChevronRight, Flame, Trophy } from 'lucide-react';
import { useState } from 'react';

const LEVEL_TESTS: Record<string, { requiredLevel: string; label: string }> = {
  'test-basic': { requiredLevel: 'basic', label: 'Basics Final Test' },
  'test-intermediate': { requiredLevel: 'intermediate', label: 'Intermediate Final Test' },
};

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
      // All basic lessons completed + basic test passed
      const basicStats = getCompletedCount(user.completedLessons, 'basic');
      return basicStats.completed === basicStats.total && user.completedTests.includes('test-basic');
    }
    if (level === 'expert') {
      const intStats = getCompletedCount(user.completedLessons, 'intermediate');
      return intStats.completed === intStats.total && user.completedTests.includes('test-intermediate');
    }
    return false;
  };

  const levelColors: Record<string, string> = {
    basic: 'text-success border-success/30 bg-success/10',
    intermediate: 'text-warning border-warning/30 bg-warning/10',
    expert: 'text-destructive border-destructive/30 bg-destructive/10',
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/dashboard')} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
            <Code2 className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-foreground font-mono">Learning Path</span>
        </div>
        <div className="flex items-center gap-3">
          <Flame className="w-5 h-5 text-primary" />
          <span className="text-sm font-bold text-primary">{user.streakCount}</span>
        </div>
      </header>

      <div className="max-w-3xl mx-auto p-6">
        {/* Progress bar */}
        <div className="bg-card border border-border rounded-xl p-4 mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Overall Progress</span>
            <span className="text-foreground font-mono">{completedCount}/{totalLessons} ({progress}%)</span>
          </div>
          <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Levels roadmap */}
        <div className="space-y-4">
          {allLevels.map((level) => {
            const stats = getCompletedCount(user.completedLessons, level.level);
            const unlocked = isLevelUnlocked(level.level);
            const isExpanded = expandedLevel === level.level;

            return (
              <div key={level.level} className={`border rounded-xl overflow-hidden transition-all ${unlocked ? 'border-border bg-card' : 'border-border/50 bg-card/50 opacity-60'}`}>
                <button
                  onClick={() => unlocked && setExpandedLevel(isExpanded ? '' : level.level)}
                  className={`w-full flex items-center justify-between p-4 text-left ${!unlocked ? 'cursor-not-allowed' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`px-3 py-1 rounded-full text-xs font-bold border ${levelColors[level.level]}`}>
                      {level.label}
                    </div>
                    <span className="text-sm text-muted-foreground">{stats.completed}/{stats.total} lessons</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {!unlocked && <Lock className="w-4 h-4 text-muted-foreground" />}
                    <div className="w-20 h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${stats.total ? (stats.completed / stats.total) * 100 : 0}%` }} />
                    </div>
                    {isExpanded ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
                  </div>
                </button>

                {isExpanded && unlocked && (
                  <div className="px-4 pb-4 space-y-3">
                    {level.topics.map(topic => {
                      const topicExpanded = expandedTopics.includes(topic.id);
                      const topicCompleted = topic.lessons.filter(l => user.completedLessons.includes(l.id)).length;

                      return (
                        <div key={topic.id} className="border border-border rounded-lg overflow-hidden">
                          <button
                            onClick={() => setExpandedTopics(prev => prev.includes(topic.id) ? prev.filter(t => t !== topic.id) : [...prev, topic.id])}
                            className="w-full flex items-center justify-between p-3 hover:bg-secondary/30 transition-colors"
                          >
                            <span className="flex items-center gap-2 text-sm text-foreground">
                              <span>{topic.icon}</span> {topic.name}
                            </span>
                            <span className="text-xs text-muted-foreground">{topicCompleted}/{topic.lessons.length}</span>
                          </button>

                          {topicExpanded && (
                            <div className="px-3 pb-3 space-y-1">
                              {topic.lessons.map((lesson, i) => {
                                const completed = user.completedLessons.includes(lesson.id);
                                const unlocked = isLessonUnlocked(lesson.id, user.completedLessons);
                                return (
                                  <button
                                    key={lesson.id}
                                    onClick={() => unlocked && navigate(`/lesson/${lesson.id}`)}
                                    disabled={!unlocked}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-sm transition-all ${
                                      !unlocked ? 'text-muted-foreground/40 cursor-not-allowed' :
                                      completed ? 'text-success bg-success/5' :
                                      'text-foreground hover:bg-secondary/50'
                                    }`}
                                  >
                                    {completed ? <Check className="w-4 h-4 text-success flex-shrink-0" /> :
                                     !unlocked ? <Lock className="w-4 h-4 flex-shrink-0" /> :
                                     <div className="w-4 h-4 rounded-full border-2 border-muted-foreground flex-shrink-0" />}
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
                      <div className="border border-primary/30 rounded-lg p-4 bg-primary/5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Trophy className="w-5 h-5 text-primary" />
                            <div>
                              <p className="text-sm font-semibold text-foreground">{level.label} Final Test</p>
                              <p className="text-xs text-muted-foreground">Complete all lessons to unlock</p>
                            </div>
                          </div>
                          {user.completedTests.includes(`test-${level.level}`) ? (
                            <span className="text-success text-xs font-semibold">✅ Passed</span>
                          ) : stats.completed === stats.total ? (
                            <button
                              onClick={() => navigate(`/test/${level.level}`)}
                              className="bg-primary text-primary-foreground px-4 py-1.5 rounded-lg text-xs font-semibold hover:opacity-90"
                            >
                              Take Test
                            </button>
                          ) : (
                            <Lock className="w-4 h-4 text-muted-foreground" />
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
