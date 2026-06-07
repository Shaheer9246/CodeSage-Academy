import { Lesson } from '@/data/lessons';

interface LessonContentProps {
  lesson: Lesson | { type: string; message: string }; 
  lessonIndex: number;
  totalLessons: number;
  onPrev: () => void;
  onNext: () => void;
  onStartChallenge: () => void;
  isLastInTopic: boolean;
}

/** Escape HTML entities in text */
function escapeHtml(str: string): string {
  return str.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

const LessonContent = ({ lesson, lessonIndex, totalLessons, onPrev, onNext, onStartChallenge }: LessonContentProps) => {
  const renderContent = (md: string) => {
    const lines = md.split('\n');
    const html: string[] = [];
    let inCode = false;
    let codeBlock = '';

    for (const line of lines) {
      if (line.startsWith('```')) {
        if (inCode) {
          html.push(`<pre class="bg-secondary/50 rounded-lg p-3 my-2 text-sm font-mono overflow-x-auto text-accent"><code>${codeBlock}</code></pre>`);
          codeBlock = '';
        }
        inCode = !inCode;
        continue;
      }
      if (inCode) {
        codeBlock += escapeHtml(line) + '\n';
        continue;
      }

      // Escape HTML FIRST, then apply markdown formatting
      const escaped = escapeHtml(line);

      if (escaped.startsWith('# ')) {
        html.push(`<h1 class="text-xl font-bold text-foreground mb-3">${escaped.slice(2)}</h1>`);
      } else if (escaped.startsWith('## ')) {
        html.push(`<h2 class="text-lg font-semibold text-foreground mt-4 mb-2">${escaped.slice(3)}</h2>`);
      } else if (escaped.startsWith('- ')) {
        const content = escaped.slice(2).replace(/`([^`]+)`/g, '<code class="bg-secondary px-1 py-0.5 rounded text-accent text-sm">$1</code>')
          .replace(/\*\*([^*]+)\*\*/g, '<strong class="text-primary">$1</strong>');
        html.push(`<li class="ml-4 text-sm text-muted-foreground mb-1">${content}</li>`);
      } else if (escaped.trim()) {
        const content = escaped.replace(/`([^`]+)`/g, '<code class="bg-secondary px-1 py-0.5 rounded text-accent text-sm">$1</code>')
          .replace(/\*\*([^*]+)\*\*/g, '<strong class="text-primary">$1</strong>');
        html.push(`<p class="text-sm text-muted-foreground mb-2">${content}</p>`);
      }
    }
    return html.join('');
  };

  return (
    <div className="h-full flex flex-col">
      {lesson.notice && (
      <div className="bg-amber-50 border-b border-amber-200 p-4 text-amber-900 text-sm flex gap-2">
        <span>💡</span>
        <p className="font-medium">{lesson.notice}</p>
      </div>
    )}
      <div className="px-4 py-2 border-b border-border flex items-center gap-2 text-xs text-muted-foreground">
        <span className="text-primary font-semibold">⚡</span>
        <span className="uppercase tracking-wider">{lesson.topic}</span>
        <span>•</span>
        <span>LESSON {lessonIndex + 1}/{totalLessons}</span>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <div dangerouslySetInnerHTML={{ __html: renderContent(lesson.content) }} />
      </div>

      <div className="flex items-center justify-between px-4 py-2 border-t border-border">
        <button onClick={onPrev} disabled={lessonIndex === 0}
          className="text-xs text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors">
          Previous
        </button>
        <div className="flex gap-1">
          {Array.from({ length: totalLessons }, (_, i) => (
            <div key={i} className={`w-2 h-2 rounded-full ${i === lessonIndex ? 'bg-primary' : 'bg-secondary'}`} />
          ))}
        </div>
        <div className="flex gap-2">
          {lesson.challenge && (
            <button onClick={onStartChallenge}
              className="text-xs bg-gradient-to-r from-primary to-accent text-primary-foreground px-3 py-1 rounded hover:opacity-90 transition-opacity">
              Challenge
            </button>
          )}
          <button onClick={onNext} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default LessonContent;
