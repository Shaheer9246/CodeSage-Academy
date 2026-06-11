import type { Grid, Facing } from './mazeGen';
import type { Track, Difficulty } from '@/data/crawlerPuzzles';

export interface CrawlerSave {
  version: 1;
  track: Track;
  difficulty: Difficulty;
  grid: Grid;
  pos: { x: number; y: number };
  facing: Facing;
  score: number;
  lives: number;
  solved: string[];        // gate keys "x,y"
  startedAt: number;
}

const KEY = 'codesage.crawler.save';

export function loadSave(): CrawlerSave | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CrawlerSave;
    if (parsed.version !== 1) return null;
    return parsed;
  } catch { return null; }
}

export function writeSave(s: CrawlerSave) {
  try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* ignore */ }
}

export function clearSave() {
  try { localStorage.removeItem(KEY); } catch { /* ignore */ }
}
