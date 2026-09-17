// src/components/ExamCard.tsx

import React from 'react';
import { Play } from 'lucide-react';
import { ExamTrack } from '../data/exams/python'; // Import the shared interface

interface ExamCardProps {
  track: ExamTrack;
  onStart: (track: ExamTrack) => void;
}

export const ExamCard: React.FC<ExamCardProps> = ({ track, onStart }) => {
  return (
    <div className="glass-card rounded-2xl p-5 flex flex-col justify-between hover:neon-border transition-all group">
      <div>
        <h3 className="text-lg font-bold text-foreground mb-1">{track.title}</h3>
        <p className="text-xs text-muted-foreground mb-4 line-clamp-2">
          {track.description}
        </p>
      </div>
      
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/30">
        <span className="text-xs font-mono text-primary/80">
          {track.totalAvailable} Qs Bank
        </span>
        
        <button 
          onClick={() => onStart(track)}
          className="bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
        >
          <Play className="w-3.5 h-3.5" /> Start
        </button>
      </div>
    </div>
  );
};
