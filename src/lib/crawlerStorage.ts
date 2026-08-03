export type GameMode = 'zen' | 'core';

export interface CrawlerSave {
  version: 2;
  track: Track;
  difficulty: Difficulty;
  mode: GameMode;
  grid: Grid;
  pos: { x: number; y: number };
  facing: Facing;
  score: number;
  flowStreak: number;     // Replaces 'lives'. Tracks consecutive correct answers for multiplier
  solved: string[];       // gate keys "x,y"
  startedAt: number;
}

const KEY = 'codesage.crawler.save';

export function loadSave(): CrawlerSave | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    
    // Graceful migration: If they have an old v1 save with 'lives', convert it to v2
    if (parsed.version === 1) {
      return {
        version: 2,
        track: parsed.track,
        difficulty: parsed.difficulty,
        mode: 'core', 
        grid: parsed.grid,
        pos: parsed.pos,
        facing: parsed.facing,
        score: parsed.score,
        flowStreak: 0, 
        solved: parsed.solved || [],
        startedAt: parsed.startedAt,
      };
    }
    
    if (parsed.version !== 2) return null;
    return parsed as CrawlerSave;
  } catch { 
    return null; 
  }
}

export function writeSave(s: CrawlerSave) {
  try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* ignore */ }
}

export function clearSave() {
  try { localStorage.removeItem(KEY); } catch { /* ignore */ }
}
export function clearSave() {
  try { localStorage.removeItem(KEY); } catch { /* ignore */ }
}
