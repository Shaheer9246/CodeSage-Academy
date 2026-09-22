// src/components/ScriptChallengePanel.tsx

import { CheckCircle2, XCircle } from 'lucide-react';
import { useState } from 'react';

interface ScriptChallengeData {
  instruction: string;
  validationKeywords: string[];
}

interface ScriptLesson {
  challenge?: ScriptChallengeData;
}

interface ScriptChallengePanelProps {
  lesson: ScriptLesson;
  code: string; // The single string of Python or Java code from the editor
  language: 'python' | 'java';
  onComplete?: () => void;
}

const ScriptChallengePanel = ({ lesson, code, language, onComplete }: ScriptChallengePanelProps) => {
  const [status, setStatus] = useState<'idle' | 'pass' | 'fail'>('idle');

  const challenge = lesson.challenge;
  if (!challenge) return null;

  const check = () => {
    const src = code.toLowerCase();
    const ok = challenge.validationKeywords.every(k => src.includes(k.toLowerCase()));
    setStatus(ok ? 'pass' : 'fail');
    if (ok) onComplete?.();
  };

  return (
    <div className="glass-card rounded-2xl p-4 space-y-3">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono">
        {language} challenge
      </p>
      <p className="text-sm text-foreground whitespace-pre-wrap">{challenge.instruction}</p>

      <button
        onClick={check}
        className="bg-primary text-primary-foreground px-4 py-2 rounded-xl text-xs font-display font-semibold hover:opacity-90 transition-opacity"
      >
        Check my code
      </button>

      {status === 'pass' && (
        <p className="flex items-center gap-2 text-xs text-primary">
          <CheckCircle2 className="w-4 h-4" /> Nice work — challenge passed!
        </p>
      )}
      {status === 'fail' && (
        <p className="flex items-center gap-2 text-xs text-destructive">
          <XCircle className="w-4 h-4" /> Not quite yet — re-read the instruction and try again.
        </p>
      )}
    </div>
  );
};

export default ScriptChallengePanel;
