import { ChevronDown, ChevronRight, Check, Lock } from 'lucide-react';
import { useState } from 'react';
import { allLevels, LevelData, Topic, Lesson, getCompletedCount } from '@/data/lessons';

interface LearnSidebarProps {
  completedLessons: string[];
  currentLessonId?: string;
  onSelectLesson: (lesson: Lesson) => void;
}

const LearnSidebar = ({ completedLessons, currentLessonId, onSelectLesson }: LearnSidebarProps) => {
  const [expandedLevel, setExpandedLevel] = useState<string>('basic');
  const [expandedTopics, setExpandedTopics] = useState<string[]>(['html-basics']);

  const toggleTopic = (id: string) => {
    setExpandedTopics(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]);
  };

  const levelColors: Record<string, string> = {
    basic: 'text-success',
    intermediate: 'text-warning',
    expert: 'text-destructive',
  };

  return (
    <div className="h-full overflow-auto p-3 space-y-4">
      {allLevels.map((level) => {
        const stats = getCompletedCount(completedLessons, level.level);
        const isExpanded = expandedLevel === level.level;

        return (
          <div key={level.level}>
            <button
              onClick={() => setExpandedLevel(isExpanded ? '' : level.level)}
              className="w-full flex items-center justify-between text-left py-2 px-3 rounded-lg hover:bg-secondary transition-colors"
            >
              <div>
                <span className={`font-semibold text-sm ${levelColors[level.level]}`}>
                  {level.label}
                </span>
                <div className="text-xs text-muted-foreground">
                  {stats.completed}/{stats.total} completed
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      level.level === 'basic' ? 'bg-success' :
                      level.level === 'intermediate' ? 'bg-warning' : 'bg-destructive'
                    }`}
                    style={{ width: `${stats.total ? (stats.completed / stats.total) * 100 : 0}%` }}
                  />
                </div>
                {isExpanded ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
              </div>
            </button>

            {isExpanded && (
              <div className="ml-2 mt-1 space-y-1">
                {level.topics.map((topic) => (
                  <TopicSection
                    key={topic.id}
                    topic={topic}
                    expanded={expandedTopics.includes(topic.id)}
                    onToggle={() => toggleTopic(topic.id)}
                    completedLessons={completedLessons}
                    currentLessonId={currentLessonId}
                    onSelectLesson={onSelectLesson}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

function TopicSection({ topic, expanded, onToggle, completedLessons, currentLessonId, onSelectLesson }: {
  topic: Topic;
  expanded: boolean;
  onToggle: () => void;
  completedLessons: string[];
  currentLessonId?: string;
  onSelectLesson: (lesson: Lesson) => void;
}) {
  const completedCount = topic.lessons.filter(l => completedLessons.includes(l.id)).length;

  return (
    <div>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-1.5 px-2 text-sm rounded hover:bg-secondary/50 transition-colors"
      >
        <span className="flex items-center gap-2 text-sidebar-foreground">
          <span className="text-xs">{topic.icon}</span>
          {topic.name}
        </span>
        <span className="text-xs text-muted-foreground">
          {completedCount}/{topic.lessons.length}
        </span>
      </button>

      {expanded && (
        <div className="ml-4 border-l border-border pl-2 space-y-0.5 mt-1">
          {topic.lessons.map((lesson) => {
            const isCompleted = completedLessons.includes(lesson.id);
            const isCurrent = lesson.id === currentLessonId;

            return (
              <button
                key={lesson.id}
                onClick={() => onSelectLesson(lesson)}
                className={`w-full text-left text-xs py-1.5 px-2 rounded flex items-center gap-2 transition-colors ${
                  isCurrent
                    ? 'bg-primary/20 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/30'
                }`}
              >
                {isCompleted ? (
                  <Check className="w-3 h-3 text-success flex-shrink-0" />
                ) : (
                  <div className="w-3 h-3 rounded-full border border-muted-foreground flex-shrink-0" />
                )}
                {lesson.title}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default LearnSidebar;
