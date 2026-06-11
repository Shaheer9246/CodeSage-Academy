import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, ArrowUp, RotateCcw, Lock, Flame, Heart, Trophy,
  AlertTriangle, ChevronLeft, ChevronRight, KeyRound, Sparkles,
} from 'lucide-react';
import {
  PUZZLES, pickPuzzles, normalize, type Track, type Difficulty, type Puzzle,
} from '@/data/crawlerPuzzles';
import {
  generateMaze, turnLeft, turnRight, delta,
  type Grid, type Facing,
} from '@/lib/mazeGen';
import {
  loadSave, writeSave, clearSave, type CrawlerSave,
} from '@/lib/crawlerStorage';

type Phase = 'setup' | 'maze' | 'puzzle' | 'flame' | 'finish';

const DIFFICULTY_META: Record<Difficulty, { size: number; gates: number; lives: number; label: string }> = {
  easy:   { size: 5, gates: 3, lives: 5, label: 'Easy' },
  medium: { size: 7, gates: 6, lives: 4, label: 'Medium' },
  hard:   { size: 9, gates: 10, lives: 3, label: 'Hard' },
};

const FLAME_QUIPS = [
  'You got incinerated by a missing tag!',
  'Syntax error: you, well done.',
  'The semicolons demanded a sacrifice.',
  'A wild bracket appeared. It was super effective.',
  'Console: undefined is not a function (you).',
];

const RATINGS = [
  { min: 90, title: 'Code Sage', glow: 'text-primary' },
  { min: 75, title: 'Senior Architect', glow: 'text-accent-blue' },
  { min: 50, title: 'Mid-Level', glow: 'text-accent-orange' },
  { min: 0,  title: 'Junior Dev', glow: 'text-muted-foreground' },
];

export default function CodeCrawler() {
  const navigate = useNavigate();

  // ── Run state ──
  const [phase, setPhase] = useState<Phase>('setup');
  const [track, setTrack] = useState<Track>('html');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [grid, setGrid] = useState<Grid | null>(null);
  const [pos, setPos] = useState({ x: 1, y: 1 });
  const [facing, setFacing] = useState<Facing>('E');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(5);
  const [solved, setSolved] = useState<string[]>([]);
  const [startedAt, setStartedAt] = useState(0);

  // puzzle state
  const [activePuzzle, setActivePuzzle] = useState<Puzzle | null>(null);
  const [puzzleGateKey, setPuzzleGateKey] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [typedAnswer, setTypedAnswer] = useState('');
  const [puzzleAttempts, setPuzzleAttempts] = useState(0);
  const [puzzlesAnswered, setPuzzlesAnswered] = useState(0);

  // flame screen
  const [flameQuip, setFlameQuip] = useState(FLAME_QUIPS[0]);

  // existing save detection (for setup screen)
  const [existingSave] = useState<CrawlerSave | null>(() => loadSave());

  // ── Auto-save sync ──
  useEffect(() => {
    if (phase === 'setup' || phase === 'finish') return;
    if (!grid) return;
    writeSave({ version: 1, track, difficulty, grid, pos, facing, score, lives, solved, startedAt });
  }, [phase, grid, pos, facing, score, lives, solved, track, difficulty, startedAt]);

  // ── Timer for puzzle ──
  useEffect(() => {
    if (phase !== 'puzzle' || !activePuzzle) return;
    if (timeLeft <= 0) { triggerFlame(); return; }
    const t = setTimeout(() => setTimeLeft(s => s - 1), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, timeLeft, activePuzzle]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, pos, facing, grid]);

  // ── Setup actions ──
  const startNewRun = () => {
    const meta = DIFFICULTY_META[difficulty];
    const g = generateMaze(meta.size, meta.gates, Math.floor(Math.random() * 1e9));
    // Find start
    let sx = 1, sy = 1;
    for (let y = 0; y < g.length; y++)
      for (let x = 0; x < g.length; x++)
        if (g[y][x] === 4) { sx = x; sy = y; }
    setGrid(g);
    setPos({ x: sx, y: sy });
    setFacing('E');
    setScore(0);
    setLives(meta.lives);
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
    setGrid(existingSave.grid);
    setPos(existingSave.pos);
    setFacing(existingSave.facing);
    setScore(existingSave.score);
    setLives(existingSave.lives);
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
    if (tileAhead === 2 && !solved.includes(`${inFrontPos.x},${inFrontPos.y}`)) return; // gate blocks
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
      setScore(s => s + (difficulty === 'easy' ? 10 : difficulty === 'medium' ? 20 : 35));
      setSolved(prev => [...prev, puzzleGateKey]);
      setActivePuzzle(null);
      setPhase('maze');
    } else {
      const next = puzzleAttempts + 1;
      setPuzzleAttempts(next);
      if (next >= 2) triggerFlame();
    }
  };

  const triggerFlame = () => {
    setFlameQuip(FLAME_QUIPS[Math.floor(Math.random() * FLAME_QUIPS.length)]);
    setActivePuzzle(null);
    setLives(l => l - 1);
    setPhase('flame');
  };

  const respawn = useCallback(() => {
    if (lives <= 0) {
      clearSave();
      setPhase('finish');
      return;
    }
    // respawn at start
    if (!grid) return;
    for (let y = 0; y < grid.length; y++)
      for (let x = 0; x < grid.length; x++)
        if (grid[y][x] === 4) { setPos({ x, y }); break; }
    setFacing('E');
    setPhase('maze');
  }, [lives, grid]);

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
      hasSave={!!existingSave}
      onStart={startNewRun}
      onResume={resumeRun}
      onBack={() => navigate('/dashboard')}
    />;
  }

  if (phase === 'finish') {
    const elapsed = Math.round((Date.now() - startedAt) / 1000);
    const accuracy = puzzlesAnswered ? Math.round(((solved.length) / puzzlesAnswered) * 100) : 0;
    const rating = RATINGS.find(r => accuracy >= r.min)!;
    return <FinishScreen
      won={lives > 0}
      elapsed={elapsed} accuracy={accuracy} score={score}
      title={rating.title} titleClass={rating.glow}
      onPlay={() => { clearSave(); setPhase('setup'); setGrid(null); }}
    />;
  }

  return (
    <div className="min-h-screen bg-background grid-bg overflow-hidden">
      {/* Header */}
      <header className="max-w-2xl mx-auto px-4 pt-4 flex items-center justify-between">
        <button onClick={quitToMenu} className="text-muted-foreground hover:text-foreground flex items-center gap-1.5 text-xs">
          <ArrowLeft className="w-4 h-4" /> Quit
        </button>
        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="flex items-center gap-1 text-primary"><Sparkles className="w-3.5 h-3.5" /> {score}</span>
          <span className="flex items-center gap-1 text-red-400">
            {Array.from({ length: lives }).map((_, i) => <Heart key={i} className="w-3.5 h-3.5 fill-current" />)}
          </span>
        </div>
      </header>

      {/* Maze view */}
      {grid && (
        <main className="max-w-2xl mx-auto p-4 space-y-3">
          <MazeView grid={grid} pos={pos} facing={facing} solved={solved} />
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

      {/* Puzzle overlay */}
      <AnimatePresence>
        {phase === 'puzzle' && activePuzzle && (
          <PuzzleOverlay
            puzzle={activePuzzle}
            timeLeft={timeLeft}
            difficulty={difficulty}
            typed={typedAnswer}
            setTyped={setTypedAnswer}
            attempts={puzzleAttempts}
            onSubmit={submitAnswer}
            onFlee={triggerFlame}
          />
        )}
      </AnimatePresence>

      {/* Flame over */}
      <AnimatePresence>
        {phase === 'flame' && (
          <FlameOver quip={flameQuip} livesLeft={lives} onContinue={respawn} />
        )}
      </AnimatePresence>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// Setup screen
// ════════════════════════════════════════════════════════════════
function SetupScreen({
  track, setTrack, difficulty, setDifficulty, hasSave, onStart, onResume, onBack,
}: {
  track: Track; setTrack: (t: Track) => void;
  difficulty: Difficulty; setDifficulty: (d: Difficulty) => void;
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
            <p className="text-xs text-muted-foreground">Run the maze. Solve the gates. Don't get incinerated.</p>
          </div>
        </div>

        <div className="glass-card border border-warning/40 rounded-2xl p-3 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-warning flex-shrink-0 mt-0.5" />
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            <span className="text-warning font-semibold">Local Storage Active.</span> Progress saves to your browser. Clearing data or switching devices resets the run.
          </p>
        </div>

        <div className="glass-card rounded-2xl p-5 space-y-4">
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
            className="w-full bg-gradient-to-r from-primary to-accent-orange text-primary-foreground py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 neon-glow">
            <KeyRound className="w-4 h-4" /> Enter the Maze
          </button>

          {hasSave && (
            <button onClick={onResume}
              className="w-full bg-secondary/30 border border-border/40 text-foreground py-2.5 rounded-xl font-semibold text-xs flex items-center justify-center gap-2">
              <RotateCcw className="w-3.5 h-3.5" /> Resume Saved Run
            </button>
          )}
        </div>

        <div className="glass-card rounded-2xl p-4 text-[11px] text-muted-foreground space-y-1.5">
          <p className="text-foreground font-semibold flex items-center gap-2"><Lock className="w-3.5 h-3.5 text-primary" /> How it works</p>
          <p>· Move forward, turn left/right with buttons or arrow keys.</p>
          <p>· Locked gates ahead? Open them and fix the broken code.</p>
          <p>· Two wrong answers or a timeout = Flame Over. Lose a life.</p>
          <p>· Reach the exit to get rated.</p>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// Maze view (2.5D)
// ════════════════════════════════════════════════════════════════
function MazeView({ grid, pos, facing, solved }: {
  grid: Grid; pos: { x: number; y: number }; facing: Facing; solved: string[];
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

  return (
    <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-primary/30 bg-black neon-glow">
      {/* Floor + ceiling perspective */}
      <div className="absolute inset-0" style={{ perspective: '600px' }}>
        {/* Ceiling */}
        <div className="absolute top-0 left-0 right-0 h-1/2"
          style={{
            background: 'linear-gradient(to bottom, hsl(145 30% 8%), hsl(145 60% 3%))',
            transform: 'rotateX(60deg)', transformOrigin: 'bottom',
          }} />
        {/* Floor with grid */}
        <div className="absolute bottom-0 left-0 right-0 h-1/2"
          style={{
            backgroundImage: `
              linear-gradient(to right, hsl(145 90% 25% / 0.4) 1px, transparent 1px),
              linear-gradient(to bottom, hsl(145 90% 25% / 0.4) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
            backgroundColor: 'hsl(145 30% 5%)',
            transform: 'rotateX(60deg)', transformOrigin: 'top',
          }} />
      </div>

      {/* Left wall */}
      {leftN === 1 && (
        <div className="absolute left-0 top-[12%] bottom-[12%] w-[28%]"
          style={{
            background: 'linear-gradient(to right, hsl(145 60% 12%), hsl(145 60% 5%))',
            clipPath: 'polygon(0 0, 100% 18%, 100% 82%, 0 100%)',
            borderRight: '1px solid hsl(145 90% 35% / 0.5)',
          }} />
      )}
      {/* Right wall */}
      {rightN === 1 && (
        <div className="absolute right-0 top-[12%] bottom-[12%] w-[28%]"
          style={{
            background: 'linear-gradient(to left, hsl(145 60% 12%), hsl(145 60% 5%))',
            clipPath: 'polygon(0 18%, 100% 0, 100% 100%, 0 82%)',
            borderLeft: '1px solid hsl(145 90% 35% / 0.5)',
          }} />
      )}

      {/* Far wall / gate / finish */}
      {wallAhead && (
        <div className="absolute left-[28%] right-[28%] top-[22%] bottom-[22%]"
          style={{
            background: 'linear-gradient(135deg, hsl(145 60% 14%), hsl(145 60% 6%))',
            border: '1px solid hsl(145 90% 40% / 0.6)',
            boxShadow: 'inset 0 0 30px hsl(145 90% 30% / 0.3)',
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
            background: 'radial-gradient(circle, hsl(145 90% 55% / 0.5), transparent)',
            boxShadow: '0 0 80px hsl(145 90% 55% / 0.6)',
          }}>
          <Trophy className="w-12 h-12 text-primary drop-shadow-[0_0_20px_hsl(145_90%_55%)]" />
        </motion.div>
      )}

      {gateAheadOpen && (
        <div className="absolute left-[28%] right-[28%] top-[22%] bottom-[22%] border border-primary/40 rounded-lg"
          style={{ boxShadow: '0 0 30px hsl(145 90% 55% / 0.3)' }} />
      )}

      {/* Scanline overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{ backgroundImage: 'repeating-linear-gradient(0deg, #fff 0 1px, transparent 1px 3px)' }} />

      {/* Facing indicator */}
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
  puzzle, timeLeft, difficulty, typed, setTyped, attempts, onSubmit, onFlee,
}: {
  puzzle: Puzzle; timeLeft: number; difficulty: Difficulty;
  typed: string; setTyped: (s: string) => void; attempts: number;
  onSubmit: (s: string) => void; onFlee: () => void;
}) {
  const useText = difficulty === 'hard';
  const timeUrgent = timeLeft <= 10;

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 backdrop-blur-md bg-background/80 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
        className="w-full max-w-lg glass-card rounded-2xl border border-accent-orange/50 p-5 space-y-4"
        style={{ boxShadow: '0 0 60px hsl(20 90% 50% / 0.3)' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-accent-orange" />
            <span className="text-xs font-bold text-foreground uppercase tracking-wider">Locked Gate</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
              {puzzle.track.toUpperCase()}
            </span>
          </div>
          <div className={`text-sm font-mono font-bold ${timeUrgent ? 'text-red-400 animate-pulse' : 'text-primary'}`}>
            {String(Math.floor(timeLeft / 60)).padStart(2, '0')}:{String(timeLeft % 60).padStart(2, '0')}
          </div>
        </div>

        <div>
          <p className="text-xs text-muted-foreground mb-2">Fix the broken code:</p>
          <pre className="bg-black/60 border border-border/40 rounded-xl p-3 text-xs font-mono text-foreground overflow-x-auto">
            <code>{puzzle.brokenCode}</code>
          </pre>
        </div>

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

        <div className="flex items-center justify-between text-[10px]">
          <span className="text-muted-foreground">
            <span className="text-warning">{attempts}/2</span> wrong attempts · 💡 {puzzle.hint}
          </span>
          <button onClick={onFlee} className="text-muted-foreground hover:text-red-400">Flee →</button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ════════════════════════════════════════════════════════════════
// Flame over
// ════════════════════════════════════════════════════════════════
function FlameOver({ quip, livesLeft, onContinue }: { quip: string; livesLeft: number; onContinue: () => void }) {
  const dead = livesLeft <= 0;
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 bg-red-600" />
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="relative glass-card rounded-2xl border border-red-500/60 p-6 text-center max-w-sm space-y-4"
        style={{ boxShadow: '0 0 80px hsl(0 90% 50% / 0.6)' }}>
        <motion.div animate={{ rotate: [-5, 5, -5] }} transition={{ duration: 0.4, repeat: 3 }}>
          <Flame className="w-16 h-16 text-red-400 mx-auto drop-shadow-[0_0_20px_hsl(0_90%_50%)]" />
        </motion.div>
        <h2 className="text-2xl font-bold font-display text-foreground">FLAME OVER</h2>
        <p className="text-sm text-muted-foreground italic">"{quip}"</p>
        <p className="text-xs font-mono text-red-400">
          {dead ? 'No lives left.' : `${livesLeft} ${livesLeft === 1 ? 'life' : 'lives'} remaining`}
        </p>
        <button onClick={onContinue}
          className="w-full bg-red-500/20 border border-red-500/60 text-red-300 py-3 rounded-xl font-bold text-sm">
          {dead ? 'See Results' : 'Respawn at Start'}
        </button>
      </motion.div>
    </motion.div>
  );
}

// ════════════════════════════════════════════════════════════════
// Finish screen
// ════════════════════════════════════════════════════════════════
function FinishScreen({
  won, elapsed, accuracy, score, title, titleClass, onPlay,
}: {
  won: boolean; elapsed: number; accuracy: number; score: number;
  title: string; titleClass: string; onPlay: () => void;
}) {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background grid-bg p-4 flex items-center justify-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="max-w-md w-full glass-card rounded-2xl border border-primary/40 p-6 text-center space-y-4 neon-glow">
        <Trophy className={`w-14 h-14 mx-auto ${won ? 'text-primary drop-shadow-[0_0_20px_hsl(145_90%_55%)]' : 'text-muted-foreground'}`} />
        <h2 className="text-2xl font-bold font-display text-foreground">
          {won ? 'Maze Conquered!' : 'Run Ended'}
        </h2>
        <p className={`text-3xl font-bold font-display ${titleClass}`}>{title}</p>
        <div className="grid grid-cols-3 gap-2 pt-2">
          <Stat label="Score" value={score} />
          <Stat label="Accuracy" value={`${accuracy}%`} />
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
