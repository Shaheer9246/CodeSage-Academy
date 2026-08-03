import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, ArrowUp, RotateCcw, Lock, Trophy,
  ChevronLeft, ChevronRight, KeyRound, Sparkles,
  Zap, Leaf, Brain, X
} from 'lucide-react';
import {
  PUZZLES, pickPuzzles, normalize, type Track, type Difficulty, type Puzzle,
} from '@/data/crawlerPuzzles';
import {
  generateMaze, turnLeft, turnRight, delta,
  type Grid, type Facing,
} from '@/lib/mazeGen';
import {
  loadSave, writeSave, clearSave, type CrawlerSave, type GameMode,
} from '@/lib/crawlerStorage';

type Phase = 'setup' | 'maze' | 'puzzle' | 'review' | 'finish';

const MAX_FLOW = 3; // Streak required to enter "Flow State" (2x XP)

const DIFFICULTY_META: Record<Difficulty, { size: number; gates: number; label: string }> = {
  easy:   { size: 5, gates: 3, label: 'Easy' },
  medium: { size: 7, gates: 6, label: 'Medium' },
  hard:   { size: 9, gates: 10, label: 'Hard' },
};

const RATINGS = [
  { min: 150, title: 'Code Sage', glow: 'text-primary' },
  { min: 100, title: 'Senior Architect', glow: 'text-accent-blue' },
  { min: 50, title: 'Mid-Level', glow: 'text-accent-orange' },
  { min: 0,  title: 'Junior Dev', glow: 'text-muted-foreground' },
];

export default function CodeCrawler() {
  const navigate = useNavigate();

  // ── Run state ──
  const [phase, setPhase] = useState<Phase>('setup');
  const [track, setTrack] = useState<Track>('html');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [mode, setMode] = useState<GameMode>('core');
  const [grid, setGrid] = useState<Grid | null>(null);
  const [pos, setPos] = useState({ x: 1, y: 1 });
  const [facing, setFacing] = useState<Facing>('E');
  const [score, setScore] = useState(0);
  const [flowStreak, setFlowStreak] = useState(0);
  const [solved, setSolved] = useState<string[]>([]);
  const [startedAt, setStartedAt] = useState(0);

  // puzzle state
  const [activePuzzle, setActivePuzzle] = useState<Puzzle | null>(null);
  const [puzzleGateKey, setPuzzleGateKey] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [typedAnswer, setTypedAnswer] = useState('');
  const [puzzleAttempts, setPuzzleAttempts] = useState(0);
  const [puzzlesAnswered, setPuzzlesAnswered] = useState(0);
  
  // UI state
  const [shake, setShake] = useState(false);

  // existing save detection
  const [existingSave] = useState<CrawlerSave | null>(() => loadSave());

  const isFlowing = flowStreak >= MAX_FLOW;

  // ── Auto-save sync ──
  useEffect(() => {
    if (phase === 'setup' || phase === 'finish') return;
    if (!grid) return;
    writeSave({ version: 2, track, difficulty, mode, grid, pos, facing, score, flowStreak, solved, startedAt });
  }, [phase, grid, pos, facing, score, flowStreak, solved, track, difficulty, mode, startedAt]);

  // ── Timer for puzzle (Core Mode Only) ──
  useEffect(() => {
    if (phase !== 'puzzle' || !activePuzzle || mode === 'zen') return;
    if (timeLeft <= 0) { 
      // Time's up: break streak, close puzzle, gate stays locked
      setFlowStreak(0);
      setActivePuzzle(null);
      setPhase('maze');
      return; 
    }
    const t = setTimeout(() => setTimeLeft(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, timeLeft, activePuzzle, mode]);

  // ── Keyboard controls ──
  useEffect(() => {
    if (phase !== 'maze') return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') doTurn('L');
      else if (e.key === 'ArrowRight') doTurn('R');
      else if (e.key === 'ArrowUp') doMove();
      else if (e.key === ' ' || e.key === 'Enter') tryOpenGate();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [phase, pos, facing, grid]);

  // ── Setup actions ──
  const startNewRun = () => {
    const meta = DIFFICULTY_META[difficulty];
    const g = generateMaze(meta.size, meta.gates, Math.floor(Math.random() * 1e9));
    let sx = 1, sy = 1;
    for (let y = 0; y < g.length; y++)
      for (let x = 0; x < g.length; x++)
        if (g[y][x] === 4) { sx = x; sy = y; }
    setGrid(g);
    setPos({ x: sx, y: sy });
    setFacing('E');
    setScore(0);
    setFlowStreak(0);
    setSolved([]);
    setPuzzlesAnswered(0);
    setStartedAt(Date.now());
    clearSave();
    setPhase('maze');
  };

  const resumeRun = () => {
    if (!existingSave) return;
    setTrack(existingSave.track);
    setDifficulty(existingSave.difficulty);
    setMode(existingSave.mode);
    setGrid(existingSave.grid);
    setPos(existingSave.pos);
    setFacing(existingSave.facing);
    setScore(existingSave.score);
    setFlowStreak(existingSave.flowStreak);
    setSolved(existingSave.solved);
    setStartedAt(existingSave.startedAt);
    setPhase('maze');
  };

  // ── Movement ──
  const tileAt = (x: number, y: number) => grid?.[y]?.[x] ?? 1;
  const inFrontPos = useMemo(() => {
    const [dx, dy] = delta(facing);
    return { x: pos.x + dx, y: pos.y + dy };
  }, [pos, facing]);
  const tileAhead = tileAt(inFrontPos.x, inFrontPos.y);
  const gateAhead = tileAhead === 2 && !solved.includes(`${inFrontPos.x},${inFrontPos.y}`);
  const finishAhead = tileAhead === 3;

  const doTurn = (dir: 'L' | 'R') => setFacing(f => (dir === 'L' ? turnLeft(f) : turnRight(f)));
  const doMove = () => {
    if (tileAhead === 1) return;
    if (tileAhead === 2 && !solved.includes(`${inFrontPos.x},${inFrontPos.y}`)) return;
    setPos(inFrontPos);
    if (tileAhead === 3) setTimeout(() => setPhase('finish'), 400);
  };

  // ── Puzzle ──
  const tryOpenGate = () => {
    if (!gateAhead) return;
    const pool = PUZZLES.filter(p => (track === 'all' || p.track === track) && p.difficulty === difficulty);
    const p = pool[Math.floor(Math.random() * pool.length)] ?? pickPuzzles(track, difficulty, 1)[0];
    setActivePuzzle(p);
    setPuzzleGateKey(`${inFrontPos.x},${inFrontPos.y}`);
    setTimeLeft(p.timeLimit);
    setTypedAnswer('');
    setPuzzleAttempts(0);
    setPhase('puzzle');
  };

  const submitAnswer = (answer: string) => {
    if (!activePuzzle) return;
    const right = normalize(answer) === normalize(activePuzzle.expectedFix);
    setPuzzlesAnswered(n => n + 1);
    
    if (right) {
      const newStreak = flowStreak + 1;
      setFlowStreak(newStreak);
      
      const multiplier = newStreak >= MAX_FLOW ? 2 : 1;
      const baseScore = difficulty === 'easy' ? 10 : difficulty === 'medium' ? 20 : 35;
      setScore(s => s + (baseScore * multiplier));
      
      setSolved(prev => [...prev, puzzleGateKey]);
      setPhase('review'); // Transition to educational review screen
    } else {
      if (mode === 'zen') {
        // Zen mode: gentle shake, infinite tries
        setShake(true);
        setTimeout(() => setShake(false), 500);
      } else {
        // Core mode: strict attempts
        const next = puzzleAttempts + 1;
        setPuzzleAttempts(next);
        if (next >= 2) {
          setFlowStreak(0); // Break the streak
          setActivePuzzle(null);
          setPhase('maze'); // Gate stays locked
        }
      }
    }
  };

  const quitToMenu = () => {
    clearSave();
    setPhase('setup');
    setGrid(null);
  };

  // ── Render ──
  if (phase === 'setup') {
    return <SetupScreen
      track={track} setTrack={setTrack}
      difficulty={difficulty} setDifficulty={setDifficulty}
      mode={mode} setMode={setMode}
      hasSave={!!existingSave}
      onStart={startNewRun}
      onResume={resumeRun}
      onBack={() => navigate('/dashboard')}
    />;
  }

  if (phase === 'finish') {
    const elapsed = Math.round((Date.now() - startedAt) / 1000);
    const rating = RATINGS.find(r => score >= r.min)!;
    return <FinishScreen
      elapsed={elapsed} score={score} maxStreak={flowStreak}
      title={rating.title} titleClass={rating.glow}
      onPlay={() => { clearSave(); setPhase('setup'); setGrid(null); }}
    />;
  }

  return (
    <div className="min-h-screen bg-background grid-bg overflow-hidden">
      <header className="max-w-2xl mx-auto px-4 pt-4 flex items-center justify-between">
        <button onClick={quitToMenu} className="text-muted-foreground hover:text-foreground flex items-center gap-1.5 text-xs">
          <ArrowLeft className="w-4 h-4" /> Quit
        </button>
        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="flex items-center gap-1 text-primary"><Sparkles className="w-3.5 h-3.5" /> {score}</span>
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full border transition-all duration-500 ${
            isFlowing ? 'bg-accent-blue/20 border-accent-blue/50 neon-glow' : 'bg-secondary/30 border-border/40'
          }`}>
            <Zap className={`w-3.5 h-3.5 ${isFlowing ? 'text-accent-blue fill-accent-blue animate-pulse' : 'text-muted-foreground'}`} />
            <span className={`font-bold ${isFlowing ? 'text-accent-blue' : 'text-foreground'}`}>{flowStreak}/{MAX_FLOW}</span>
          </div>
        </div>
      </header>

      {grid && (
        <main className="max-w-2xl mx-auto p-4 space-y-3">
          <MazeView grid={grid} pos={pos} facing={facing} solved={solved} isFlowing={isFlowing} />
          <MazeControls
            canMove={tileAhead !== 1 && (tileAhead !== 2 || solved.includes(`${inFrontPos.x},${inFrontPos.y}`))}
            gateAhead={gateAhead}
            finishAhead={finishAhead}
            onLeft={() => doTurn('L')}
            onRight={() => doTurn('R')}
            onForward={doMove}
            onOpen={tryOpenGate}
          />
          <Minimap grid={grid} pos={pos} facing={facing} solved={solved} />
        </main>
      )}

      <AnimatePresence>
        {phase === 'puzzle' && activePuzzle && (
          <PuzzleOverlay
            puzzle={activePuzzle}
            timeLeft={timeLeft}
            mode={mode}
            typed={typedAnswer}
            setTyped={setTypedAnswer}
            attempts={puzzleAttempts}
            shake={shake}
            onSubmit={submitAnswer}
            onFlee={() => { setActivePuzzle(null); setPhase('maze'); }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {phase === 'review' && activePuzzle && (
          <ReviewOverlay 
            puzzle={activePuzzle} 
            isFlowing={isFlowing}
            onContinue={() => {
              setActivePuzzle(null);
              setPhase('maze');
            }} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// Setup screen
// ════════════════════════════════════════════════════════════════
function SetupScreen({
  track, setTrack, difficulty, setDifficulty, mode, setMode, hasSave, onStart, onResume, onBack,
}: {
  track: Track; setTrack: (t: Track) => void;
  difficulty: Difficulty; setDifficulty: (d: Difficulty) => void;
  mode: GameMode; setMode: (m: GameMode) => void;
  hasSave: boolean; onStart: () => void; onResume: () => void; onBack: () => void;
}) {
  return (
    <div className="min-h-screen bg-background grid-bg p-4">
      <div className="max-w-lg mx-auto space-y-4">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold font-display text-foreground">Code Crawler</h1>
            <p className="text-xs text-muted-foreground">Find your flow. Fix the code. Master the maze.</p>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 space-y-4">
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Vibe</label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <button onClick={() => setMode('core')}
                className={`py-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 ${
                  mode === 'core' ? 'bg-primary/15 border-primary/40 text-primary neon-glow' : 'bg-secondary/20 border-border/30 text-foreground'
                }`}>
                <Brain className="w-4 h-4" />
                Core Mode
                <span className="text-[9px] text-muted-foreground font-normal">Timers & Strict Grading</span>
              </button>
              <button onClick={() => setMode('zen')}
                className={`py-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 ${
                  mode === 'zen' ? 'bg-accent-blue/15 border-accent-blue/40 text-accent-blue neon-glow' : 'bg-secondary/20 border-border/30 text-foreground'
                }`}>
                <Leaf className="w-4 h-4" />
                Zen Mode
                <span className="text-[9px] text-muted-foreground font-normal">No Timers · Infinite Tries</span>
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Track</label>
            <div className="grid grid-cols-4 gap-2 mt-2">
              {(['html', 'css', 'js', 'all'] as Track[]).map(t => (
                <button key={t} onClick={() => setTrack(t)}
                  className={`py-2.5 rounded-xl border text-xs font-semibold uppercase ${
                    track === t ? 'bg-primary/15 border-primary/40 text-primary neon-glow' : 'bg-secondary/20 border-border/30 text-foreground'
                  }`}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Difficulty</label>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {(['easy', 'medium', 'hard'] as Difficulty[]).map(d => {
                const m = DIFFICULTY_META[d];
                return (
                  <button key={d} onClick={() => setDifficulty(d)}
                    className={`py-2.5 rounded-xl border text-xs font-semibold ${
                      difficulty === d ? 'bg-primary/15 border-primary/40 text-primary neon-glow' : 'bg-secondary/20 border-border/30 text-foreground'
                    }`}>
                    {m.label}
                    <div className="text-[9px] text-muted-foreground font-mono mt-0.5">{m.size}×{m.size} · {m.gates} gates</div>
                  </button>
                );
              })}
            </div>
          </div>

          <button onClick={onStart}
            className="w-full bg-gradient-to-r from-primary to-accent-blue text-primary-foreground py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 neon-glow">
            <KeyRound className="w-4 h-4" /> Enter the Maze
          </button>

          {hasSave && (
            <button onClick={onResume}
              className="w-full bg-secondary/30 border border-border/40 text-foreground py-2.5 rounded-xl font-semibold text-xs flex items-center justify-center gap-2">
              <RotateCcw className="w-3.5 h-3.5" /> Resume Saved Run
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// Maze view (2.5D)
// ════════════════════════════════════════════════════════════════
function MazeView({ grid, pos, facing, solved, isFlowing }: {
  grid: Grid; pos: { x: number; y: number }; facing: Facing; solved: string[]; isFlowing: boolean;
}) {
  const [dx, dy] = delta(facing);
  const [lx, ly] = delta(turnLeft(facing));
  const [rx, ry] = delta(turnRight(facing));

  const ahead1 = grid[pos.y + dy]?.[pos.x + dx] ?? 1;
  const ahead2 = grid[pos.y + dy * 2]?.[pos.x + dx * 2] ?? 1;
  const leftN = grid[pos.y + ly]?.[pos.x + lx] ?? 1;
  const rightN = grid[pos.y + ry]?.[pos.x + rx] ?? 1;

  const gateAheadOpen = ahead1 === 2 && solved.includes(`${pos.x + dx},${pos.y + dy}`);
  const gateAhead = ahead1 === 2 && !gateAheadOpen;
  const finishAhead = ahead1 === 3 || ahead2 === 3;
  const wallAhead = ahead1 === 1;

  // Dynamic color shifting for Flow State
  const h1 = isFlowing ? '280 90%' : '145 90%'; // Primary glow (Purple vs Green)
  const h2 = isFlowing ? '280 30%' : '145 30%'; // Background dark
  const h3 = isFlowing ? '280 60%' : '145 60%'; // Walls

  return (
    <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-primary/30 bg-black neon-glow transition-all duration-1000">
      <div className="absolute inset-0" style={{ perspective: '600px' }}>
        <div className="absolute top-0 left-0 right-0 h-1/2"
          style={{
            background: `linear-gradient(to bottom, hsl(${h2} 8%), hsl(${h2} 3%))`,
            transform: 'rotateX(60deg)', transformOrigin: 'bottom',
          }} />
        <div className="absolute bottom-0 left-0 right-0 h-1/2"
          style={{
            backgroundImage: `
              linear-gradient(to right, hsl(${h1} 25% / 0.4) 1px, transparent 1px),
              linear-gradient(to bottom, hsl(${h1} 25% / 0.4) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
            backgroundColor: `hsl(${h2} 5%)`,
            transform: 'rotateX(60deg)', transformOrigin: 'top',
          }} />
      </div>

      {leftN === 1 && (
        <div className="absolute left-0 top-[12%] bottom-[12%] w-[28%]"
          style={{
            background: `linear-gradient(to right, hsl(${h3} 12%), hsl(${h3} 5%))`,
            clipPath: 'polygon(0 0, 100% 18%, 100% 82%, 0 100%)',
            borderRight: `1px solid hsl(${h1} 35% / 0.5)`,
          }} />
      )}
      
      {rightN === 1 && (
        <div className="absolute right-0 top-[12%] bottom-[12%] w-[28%]"
          style={{
            background: `linear-gradient(to left, hsl(${h3} 12%), hsl(${h3} 5%))`,
            clipPath: 'polygon(0 18%, 100% 0, 100% 100%, 0 82%)',
            borderLeft: `1px solid hsl(${h1} 35% / 0.5)`,
          }} />
      )}

      {wallAhead && (
        <div className="absolute left-[28%] right-[28%] top-[22%] bottom-[22%]"
          style={{
            background: `linear-gradient(135deg, hsl(${h3} 14%), hsl(${h3} 6%))`,
            border: `1px solid hsl(${h1} 40% / 0.6)`,
            boxShadow: `inset 0 0 30px hsl(${h1} 30% / 0.3)`,
          }} />
      )}

      {gateAhead && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
          className="absolute left-[20%] right-[20%] top-[15%] bottom-[15%] flex items-center justify-center">
          <div className="relative w-full h-full rounded-lg"
            style={{
              background: 'linear-gradient(180deg, hsl(20 90% 20% / 0.3), hsl(20 90% 10% / 0.6))',
              border: '2px solid hsl(20 90% 50% / 0.8)',
              boxShadow: '0 0 60px hsl(20 90% 50% / 0.5), inset 0 0 30px hsl(20 90% 40% / 0.3)',
            }}>
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                <Lock className="w-16 h-16 text-accent-orange drop-shadow-[0_0_20px_hsl(20_90%_50%)]" />
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}

      {finishAhead && (
        <motion.div
          animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute left-[35%] right-[35%] top-[30%] bottom-[30%] rounded-lg flex items-center justify-center"
          style={{
            background: `radial-gradient(circle, hsl(${h1} 55% / 0.5), transparent)`,
            boxShadow: `0 0 80px hsl(${h1} 55% / 0.6)`,
          }}>
          <Trophy className={`w-12 h-12 drop-shadow-[0_0_20px_hsl(${h1}_90%_55%)]`} style={{ color: `hsl(${h1} 70%)` }} />
        </motion.div>
      )}

      {gateAheadOpen && (
        <div className="absolute left-[28%] right-[28%] top-[22%] bottom-[22%] border border-primary/40 rounded-lg"
          style={{ boxShadow: `0 0 30px hsl(${h1} 55% / 0.3)` }} />
      )}

      <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{ backgroundImage: 'repeating-linear-gradient(0deg, #fff 0 1px, transparent 1px 3px)' }} />

      <div className="absolute top-2 left-2 text-[10px] font-mono text-primary/70 bg-black/40 px-2 py-1 rounded">
        FACING {facing}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// Controls
// ════════════════════════════════════════════════════════════════
function MazeControls({
  canMove, gateAhead, finishAhead, onLeft, onRight, onForward, onOpen,
}: {
  canMove: boolean; gateAhead: boolean; finishAhead: boolean;
  onLeft: () => void; onRight: () => void; onForward: () => void; onOpen: () => void;
}) {
  return (
    <div className="space-y-2">
      {gateAhead && (
        <motion.button
          initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          onClick={onOpen}
          className="w-full bg-gradient-to-r from-accent-orange to-primary text-primary-foreground py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 neon-glow">
          <Lock className="w-5 h-5" /> 🔓 Open the Door
        </motion.button>
      )}
      <div className="grid grid-cols-3 gap-2">
        <button onClick={onLeft}
          className="bg-secondary/40 border border-border/40 hover:neon-border py-4 rounded-2xl flex flex-col items-center justify-center gap-1 text-foreground">
          <ChevronLeft className="w-5 h-5" />
          <span className="text-[10px] font-mono">Turn Left</span>
        </button>
        <button onClick={onForward} disabled={!canMove}
          className={`py-4 rounded-2xl flex flex-col items-center justify-center gap-1 border ${
            canMove ? 'bg-primary/15 border-primary/40 text-primary neon-glow' : 'bg-secondary/20 border-border/30 text-muted-foreground opacity-50'
          }`}>
          <ArrowUp className="w-5 h-5" />
          <span className="text-[10px] font-mono">{finishAhead ? 'Exit!' : 'Forward'}</span>
        </button>
        <button onClick={onRight}
          className="bg-secondary/40 border border-border/40 hover:neon-border py-4 rounded-2xl flex flex-col items-center justify-center gap-1 text-foreground">
          <ChevronRight className="w-5 h-5" />
          <span className="text-[10px] font-mono">Turn Right</span>
        </button>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// Minimap
// ════════════════════════════════════════════════════════════════
function Minimap({ grid, pos, facing, solved }: { grid: Grid; pos: { x: number; y: number }; facing: Facing; solved: string[] }) {
  return (
    <div className="glass-card rounded-2xl p-3">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Minimap</p>
        <p className="text-[10px] font-mono text-primary">{pos.x},{pos.y}</p>
      </div>
      <div className="inline-grid mx-auto" style={{ gridTemplateColumns: `repeat(${grid.length}, 1fr)` }}>
        {grid.map((row, y) =>
          row.map((tile, x) => {
            const isMe = x === pos.x && y === pos.y;
            const isGateOpen = tile === 2 && solved.includes(`${x},${y}`);
            const bg =
              isMe ? 'bg-primary' :
              tile === 1 ? 'bg-secondary/60' :
              tile === 2 ? (isGateOpen ? 'bg-primary/30' : 'bg-accent-orange/70') :
              tile === 3 ? 'bg-accent-blue' :
              tile === 4 ? 'bg-primary/40' :
              'bg-background';
            return (
              <div key={`${x}-${y}`} className={`w-3 h-3 ${bg} ${isMe ? 'neon-glow' : ''}`}>
                {isMe && <div className="w-full h-full flex items-center justify-center text-[8px] text-primary-foreground font-bold">
                  {facing === 'N' ? '↑' : facing === 'E' ? '→' : facing === 'S' ? '↓' : '←'}
                </div>}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// Puzzle overlay
// ════════════════════════════════════════════════════════════════
function PuzzleOverlay({
  puzzle, timeLeft, mode, typed, setTyped, attempts, shake, onSubmit, onFlee,
}: {
  puzzle: Puzzle; timeLeft: number; mode: GameMode;
  typed: string; setTyped: (s: string) => void; attempts: number; shake: boolean;
  onSubmit: (s: string) => void; onFlee: () => void;
}) {
  const useText = puzzle.difficulty === 'hard';
  const timeUrgent = mode === 'core' && timeLeft <= 10;

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 backdrop-blur-md bg-background/80 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
        className="w-full max-w-lg glass-card rounded-2xl border border-accent-orange/50 p-5 space-y-4"
        style={{ boxShadow: '0 0 60px hsl(20 90% 50% / 0.3)' }}>
        
        <motion.div animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}} transition={{ duration: 0.4 }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-accent-orange" />
              <span className="text-xs font-bold text-foreground uppercase tracking-wider">Locked Gate</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                {puzzle.track.toUpperCase()}
              </span>
            </div>
            {mode === 'core' && (
              <div className={`text-sm font-mono font-bold ${timeUrgent ? 'text-red-400 animate-pulse' : 'text-primary'}`}>
                {String(Math.floor(timeLeft / 60)).padStart(2, '0')}:{String(timeLeft % 60).padStart(2, '0')}
              </div>
            )}
          </div>

          <div>
            <p className="text-xs text-muted-foreground mb-2">Fix the broken code:</p>
            <pre className="bg-black/60 border border-border/40 rounded-xl p-3 text-xs font-mono text-foreground overflow-x-auto">
              <code>{puzzle.brokenCode}</code>
            </pre>
          </div>
        </motion.div>

        {useText ? (
          <div>
            <p className="text-[10px] text-muted-foreground mb-1.5 font-mono">Type the correct version:</p>
            <textarea value={typed} onChange={e => setTyped(e.target.value)}
              autoFocus rows={2}
              className="w-full bg-black/60 border border-border/40 rounded-xl p-3 text-xs font-mono text-foreground focus:border-primary/60 focus:outline-none resize-none" />
            <button onClick={() => onSubmit(typed)} disabled={!typed.trim()}
              className="mt-2 w-full bg-primary text-primary-foreground py-2.5 rounded-xl text-sm font-bold disabled:opacity-30">
              Submit Fix
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {puzzle.choices?.map((c, i) => (
              <button key={i} onClick={() => onSubmit(c)}
                className="w-full text-left px-3 py-3 rounded-xl bg-secondary/30 border border-border/30 hover:border-primary/50 hover:bg-primary/5 text-xs font-mono text-foreground transition-all">
                <span className="text-primary mr-2">{String.fromCharCode(65 + i)}.</span>{c}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between text-[10px] pt-2 border-t border-border/20">
          <span className="text-muted-foreground">
            {mode === 'zen' ? (
              <>💡 {puzzle.hint}</>
            ) : (
              <><span className="text-warning">{attempts}/2</span> attempts · 💡 {puzzle.hint}</>
            )}
          </span>
          <button onClick={onFlee} className="text-muted-foreground hover:text-red-400 flex items-center gap-1">
            <X className="w-3 h-3" /> Flee
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ════════════════════════════════════════════════════════════════
// Review overlay (Post-Solve Education)
// ════════════════════════════════════════════════════════════════
function ReviewOverlay({ puzzle, isFlowing, onContinue }: { puzzle: Puzzle; isFlowing: boolean; onContinue: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 backdrop-blur-md bg-background/90 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
        className="w-full max-w-lg glass-card rounded-2xl border border-primary/50 p-6 space-y-4"
        style={{ boxShadow: isFlowing ? '0 0 80px hsl(280 90% 55% / 0.4)' : '0 0 80px hsl(145 90% 55% / 0.4)' }}
      >
        <div className="flex items-center gap-2 text-primary">
          <Sparkles className={`w-5 h-5 ${isFlowing ? 'text-accent-blue' : 'text-primary'}`} />
          <h3 className="text-lg font-bold font-display">{puzzle.message}</h3>
          {isFlowing && <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent-blue/20 text-accent-blue border border-accent-blue/40 font-mono animate-pulse">2X FLOW XP!</span>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3">
            <p className="text-[10px] font-bold text-red-400 uppercase mb-1">❌ Broken Code</p>
            <pre className="text-xs font-mono text-foreground/80 whitespace-pre-wrap">{puzzle.brokenCode}</pre>
          </div>
          <div className="bg-primary/10 border border-primary/30 rounded-xl p-3">
            <p className="text-[10px] font-bold text-primary uppercase mb-1">✅ Fixed Code</p>
            <pre className="text-xs font-mono text-foreground whitespace-pre-wrap">{puzzle.expectedFix}</pre>
          </div>
        </div>

        {puzzle.explanation && (
          <div className="bg-secondary/20 border border-border/40 rounded-xl p-3">
            <p className="text-xs text-foreground leading-relaxed">
              <span className="font-bold text-accent-blue">💡 Why it works:</span> {puzzle.explanation}
            </p>
          </div>
        )}

        <button 
          onClick={onContinue}
          className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold text-sm neon-glow flex items-center justify-center gap-2"
        >
          Continue Crawl <ArrowUp className="w-4 h-4" />
        </button>
      </motion.div>
    </motion.div>
  );
}

// ════════════════════════════════════════════════════════════════
// Finish screen
// ════════════════════════════════════════════════════════════════
function FinishScreen({
  elapsed, score, maxStreak, title, titleClass, onPlay,
}: {
  elapsed: number; score: number; maxStreak: number;
  title: string; titleClass: string; onPlay: () => void;
}) {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background grid-bg p-4 flex items-center justify-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="max-w-md w-full glass-card rounded-2xl border border-primary/40 p-6 text-center space-y-4 neon-glow">
        <Trophy className="w-14 h-14 mx-auto text-primary drop-shadow-[0_0_20px_hsl(145_90%_55%)]" />
        <h2 className="text-2xl font-bold font-display text-foreground">
          Maze Conquered!
        </h2>
        <p className={`text-3xl font-bold font-display ${titleClass}`}>{title}</p>
        <div className="grid grid-cols-3 gap-2 pt-2">
          <Stat label="Score" value={score} />
          <Stat label="Max Flow" value={`${maxStreak}x`} />
          <Stat label="Time" value={`${Math.floor(elapsed / 60)}:${String(elapsed % 60).padStart(2, '0')}`} />
        </div>
        <div className="flex gap-2 pt-2">
          <button onClick={() => navigate('/dashboard')}
            className="flex-1 bg-secondary/40 border border-border/40 text-foreground py-3 rounded-xl text-sm font-semibold">
            Dashboard
          </button>
          <button onClick={onPlay}
            className="flex-1 bg-primary text-primary-foreground py-3 rounded-xl text-sm font-bold neon-glow">
            Play Again
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-secondary/20 rounded-xl p-2">
      <p className="text-[9px] text-muted-foreground uppercase tracking-wider">{label}</p>
      <p className="text-base font-bold font-mono text-primary mt-0.5">{value}</p>
    </div>
  );
}
