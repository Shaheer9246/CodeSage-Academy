// src/components/Navigator.tsx

import React from 'react';
import { Clock } from 'lucide-react';
import { Question } from '../data/exams/python';

interface AnswerState {
  chosen: number | null;
  confirmed: boolean;
  review: boolean;
}

interface NavigatorProps {
  questions: Question[];
  currentQ: number;
  setCurrentQ: (index: number) => void;
  examState: Record<number, AnswerState>;
  trackTitle: string;
  secondsLeft: number;
  onFinishExam: () => void;
}

export const Navigator: React.FC<NavigatorProps> = ({
  questions,
  currentQ,
  setCurrentQ,
  examState,
  trackTitle,
  secondsLeft,
  onFinishExam,
}) => {
  // Format seconds into MM:SS
  const mm = Math.floor(secondsLeft / 60).toString().padStart(2, '0');
  const ss = (secondsLeft % 60).toString().padStart(2, '0');
  
  // Progress calculations based on confirmed status
  const confirmedCount = Object.values(examState).filter((s) => s.confirmed).length;
  const progressPct = questions.length > 0 ? (confirmedCount / questions.length) * 100 : 0;

  return (
    <div className="w-full md:w-64 flex flex-col gap-4">
      {/* Track info & Live Timer Card */}
      <div className="glass-card p-4 rounded-2xl flex items-center justify-between md:flex-col md:items-start md:gap-4">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">
            Track
          </p>
          <p className="text-sm font-bold text-foreground truncate max-w-[180px] md:max-w-none">
            {trackTitle}
          </p>
        </div>
        <div
          className={`flex items-center gap-2 text-sm font-mono px-3 py-1.5 rounded-lg border transition-colors ${
            secondsLeft < 30
              ? 'bg-destructive/15 border-destructive/30 text-destructive'
              : 'bg-primary/10 border-primary/20 text-primary'
          }`}
        >
          <Clock className="w-4 h-4" /> {mm}:{ss}
        </div>
      </div>

      {/* Grid Jump Navigator Card */}
      <div className="glass-card p-4 rounded-2xl flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Navigator
            </h3>
            <span className="text-xs font-mono text-primary">
              {confirmedCount}/{questions.length} Confirmed
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="h-1.5 w-full bg-secondary/30 rounded-full mb-4 overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          {/* Jump Grid */}
          <div className="grid grid-cols-5 gap-2 max-h-64 overflow-y-auto pr-1">
            {questions.map((_, i) => {
              const state = examState[i] || { chosen: null, confirmed: false, review: false };
              const isActive = i === currentQ;
              const isConfirmed = state.confirmed;
              const isReview = state.review;
              
              return (
                <button
                  key={i}
                  onClick={() => setCurrentQ(i)}
                  className={`aspect-square rounded-lg text-xs font-mono font-bold transition-all border-2 flex items-center justify-center relative
                    ${isActive 
                      ? 'border-primary scale-105 shadow-[0_0_10px_rgba(var(--primary),0.3)] z-10' 
                      : 'border-transparent hover:border-border/50'
                    }
                    ${isConfirmed 
                      ? 'bg-primary/20 text-primary' 
                      : 'bg-secondary/40 text-muted-foreground'
                    }
                    ${isReview 
                      ? '!border-accent-orange !text-accent-orange bg-accent-orange/10' 
                      : ''
                    }
                  `}
                >
                  {i + 1}
                  {isReview && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-accent-orange border-2 border-background" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
        
        {/* Early Action Submission Button */}
        <button
          onClick={onFinishExam}
          className="w-full mt-6 bg-secondary/30 hover:bg-destructive/20 hover:text-destructive text-muted-foreground py-2.5 rounded-xl text-xs font-semibold transition-colors"
        >
          Submit Exam Early
        </button>
      </div>
    </div>
  );
};
