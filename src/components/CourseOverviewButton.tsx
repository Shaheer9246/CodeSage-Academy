import { useState } from 'react';
import { BookOpen, Sparkles } from 'lucide-react';
import CourseOverviewModal from '@/components/CourseOverviewModal';

interface CourseOverviewButtonProps {
  trackId: string;
  className?: string;
  variant?: 'compact' | 'badge' | 'full';
  label?: string;
}

export default function CourseOverviewButton({
  trackId,
  className = '',
  variant = 'compact',
  label
}: CourseOverviewButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const buttonText = label || (variant === 'badge' ? 'Syllabus' : 'Course Syllabus & Outcomes');

  return (
    <>
      <button
        type="button"
        onClick={e => {
          e.stopPropagation();
          setIsOpen(true);
        }}
        className={`inline-flex items-center gap-1.5 rounded-lg font-medium transition-all select-none ${
          variant === 'badge'
            ? 'px-2 py-0.5 text-[11px] bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30'
            : variant === 'compact'
            ? 'px-2.5 py-1 text-xs bg-secondary/50 hover:bg-secondary border border-border/40 hover:border-primary/40 text-muted-foreground hover:text-foreground'
            : 'px-3 py-1.5 text-xs bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary font-semibold shadow-sm'
        } ${className}`}
        title="View full course syllabus, learning outcomes, and deliverables"
        aria-label="View course syllabus and outcomes"
      >
        <BookOpen className="w-3.5 h-3.5 text-primary shrink-0" />
        <span className="truncate">{buttonText}</span>
        {variant === 'full' && <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />}
      </button>

      <CourseOverviewModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        initialTrackId={trackId}
      />
    </>
  );
}
