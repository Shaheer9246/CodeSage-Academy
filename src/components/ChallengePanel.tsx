// src/components/ChallengePanel.tsx

import { CheckCircle2, XCircle, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { Lesson } from '@/data/lessons';

interface ChallengePanelProps {
  lesson: Lesson;
  // Frontend props (optional now)
  html?: string;
  css?: string;
  js?: string;
  // Python/Java prop (optional now)
  scriptCode?: string; 
  onBack: () => void;
  onComplete: () => void;
}

const ChallengePanel = ({ 
  lesson, 
  html = '', 
  css = '', 
  js = '', 
  scriptCode = '', // Default to empty string
  onBack, 
  onComplete 
}: ChallengePanelProps) => {
  const [result, setResult] = useState<'pass' | 'fail' | null>(null);

  if (!lesson.challenge) return null;

  const checkCode = () => {
    let codeToCheck = '';

    // Determine which code to validate based on what was passed
    // If scriptCode has content (or if we are in a non-frontend context), use it.
    // Otherwise combine frontend files.
    const lang = lesson.language as string | undefined;
    if (scriptCode || lang === 'python' || lang === 'java') {
        codeToCheck = scriptCode;
    } else {
        codeToCheck = html + '\n' + css + '\n' + js;
    }

    const normalizedCode = codeToCheck.toLowerCase().replace(/\s+/g, ' ');
    
    // Validate against keywords
    const passed = lesson.challenge!.validationKeywords.every(kw =>
      normalizedCode.includes(kw.toLowerCase())
    );

    setResult(passed ? 'pass' : 'fail');
    if (passed) {
      setTimeout(() => onComplete(), 1500);
    }
  };

  return (
    <div className="h-full flex flex-col bg-card">
      <div className="px-4 py-2 border-b border-border flex items-center gap-2">
        <button onClick={onBack} className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <span className="text-sm font-semibold text-primary">🏆 Challenge</span>
        
        {/* Optional: Show language badge if available in lesson data */}
        {lesson.language && lesson.language !== 'frontend' && (
             <span className="text-[9px] px-1.5 py-0.5 rounded bg-secondary text-muted-foreground border border-border uppercase ml-auto">
                {lesson.language}
             </span>
        )}
      </div>

      <div className="flex-1 overflow-auto p-4">
        <h3 className="text-base font-semibold text-foreground mb-3">Apply what you learned!</h3>
        <p className="text-sm text-muted-foreground mb-4">{lesson.challenge.instruction}</p>

        {result === 'pass' && (
          <div className="flex items-center gap-2 p-3 bg-success/10 rounded-lg text-success text-sm animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-semibold">Great job! Challenge completed! 🎉</span>
          </div>
        )}
        {result === 'fail' && (
          <div className="flex items-center gap-2 p-3 bg-destructive/10 rounded-lg text-destructive text-sm animate-in fade-in slide-in-from-top-2">
            <XCircle className="w-5 h-5" />
            <span>Not quite right. Check the requirements and try again.</span>
          </div>
        )}
      </div>

      <div className="px-4 py-3 border-t border-border">
        <button
          onClick={checkCode}
          className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
        >
          Check My Code
        </button>
      </div>
    </div>
  );
};

export default ChallengePanel;
