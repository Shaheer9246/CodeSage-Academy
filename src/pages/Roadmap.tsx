import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { Lock, Check, Flame, Zap, Trophy, ChevronRight } from 'lucide-react';
import { useState, useEffect, useMemo, useRef, useLayoutEffect } from 'react';
import { motion } from 'framer-motion';
import { NETWORKING_LESSONS } from '@/data/networkingLessons';
import { FULLSTACK_LESSONS } from '@/data/fullstackLessons';
import { FREELANCE_LESSONS } from '@/data/freelanceLessons';
import { PYTHON_LESSONS } from '@/data/pythonLessons';
import { LOCAL_LESSONS } from '@/data/localLessons';
import { SQL_LESSONS } from '@/data/sqlLessons';
import { PYTHON_EXPERT_LESSONS } from '@/data/pythonExpertLessons';
import { AI_LESSONS } from '@/data/aiFundamentalsLesson';
import { THREE3D_LESSONS } from '@/data/three3dLessons';

/* ------------------------------------------------------------------ */
/*  TYPES + DATA (identical shape to your original — just re-authored) */
/* ------------------------------------------------------------------ */

interface TrackNode {
  id: string;
  step: number;
  label: string;
  icon: string;
  chapter?: string;
  milestone?: string;
  lessonIds: string[];
  routePrefix:
    | 'lesson' | 'n-lesson' | 'fs-lesson' | 'f-lesson'
    | 'py-lesson' | 'local-lesson' | 'sql-lesson' | 'pyx-lesson'| 'ai-lesson' | 'three-lesson';
  locked?: boolean;
}

type Status = 'locked' | 'completed' | 'current' | 'upcoming';

const FRONTEND_LESSONS: Array<{ id: string; title: string; icon: string; chapter?: string; milestone?: string }> = [
  { id: 'html-1', title: 'What is HTML?', icon: '📄', chapter: 'HTML — Beginner' },
  { id: 'html-2', title: 'Headings & Text', icon: '📝' },
  { id: 'html-3', title: 'Links & Navigation', icon: '🔗' },
  { id: 'html-4', title: 'Images & Media', icon: '🖼️' },
  { id: 'html-5', title: 'Lists', icon: '📋' },
  { id: 'html-6', title: 'Tables', icon: '📊' },
  { id: 'html-7', title: 'Forms', icon: '📝' },
  { id: 'html-8', title: 'Semantic HTML', icon: '🏛️' },
  { id: 'html-9', title: 'Meta & SEO Tags', icon: '🔎' },
  { id: 'html-10', title: 'HTML Mastery', icon: '🎓', milestone: 'HTML COMPLETE' },
  { id: 'css-1', title: 'CSS Introduction', icon: '🎨', chapter: 'CSS — Beginner' },
  { id: 'css-2', title: 'Colors & Typography', icon: '🖌️' },
  { id: 'css-3', title: 'Box Model', icon: '📦' },
  { id: 'css-4', title: 'Flexbox Basics', icon: '📐' },
  { id: 'css-5', title: 'Flexbox Advanced', icon: '📏' },
  { id: 'css-6', title: 'CSS Grid', icon: '🔲', milestone: 'CSS BASICS COMPLETE' },
  { id: 'js-1', title: 'JS Introduction', icon: '⚡', chapter: 'JavaScript — Beginner' },
  { id: 'js-2', title: 'Variables & Types', icon: '📦' },
  { id: 'js-3', title: 'Functions', icon: '🔧' },
  { id: 'js-4', title: 'DOM Manipulation', icon: '🌳' },
  { id: 'js-5', title: 'Events', icon: '🎯', milestone: 'JS BASICS COMPLETE' },
  { id: 'html-int-1', title: 'Advanced Forms', icon: '📋', chapter: 'Intermediate' },
  { id: 'html-int-2', title: 'Tables & Data', icon: '🗂️' },
  { id: 'css-int-1', title: 'Tailwind CSS', icon: '🌬️' },
  { id: 'css-int-2', title: 'Animations', icon: '✨' },
  { id: 'css-int-3', title: 'Responsive Design', icon: '📱' },
  { id: 'js-int-1', title: 'ES6+ Features', icon: '🆕' },
  { id: 'js-int-2', title: 'Async & Promises', icon: '⏳' },
  { id: 'js-int-3', title: 'APIs & Fetch', icon: '📡' },
  { id: 'js-int-4', title: 'Error Handling', icon: '🛡️' },
  { id: 'react-1', title: 'React Basics', icon: '⚛️', chapter: 'React' },
  { id: 'react-2', title: 'JSX & Components', icon: '🧩' },
  { id: 'react-3', title: 'Props & State', icon: '🪝' },
  { id: 'react-4', title: 'Lifecycle & Effects', icon: '♻️' },
  { id: 'react-int-1', title: 'Context API', icon: '🔄' },
  { id: 'multi-1', title: 'Audio & Video', icon: '🎬', chapter: 'Multimedia & Forms' },
  { id: 'multi-2', title: 'Canvas Basics', icon: '🖼️' },
  { id: 'multi-3', title: 'SVG Graphics', icon: '✏️' },
  { id: 'form-1', title: 'Form Validation', icon: '✅' },
  { id: 'form-2', title: 'Advanced Inputs', icon: '🎛️' },
  { id: 'a11y-1', title: 'Accessibility & SEO', icon: '♿' },
  { id: 'js-exp-1', title: 'Closures & Scope', icon: '🧠', chapter: 'Expert' },
  { id: 'js-exp-2', title: 'Prototypes & OOP', icon: '🏗️' },
  { id: 'js-exp-3', title: 'Modules & Bundling', icon: '📚' },
  { id: 'css-exp-1', title: 'CSS Architecture', icon: '🏛️' },
  { id: 'css-exp-2', title: 'Modern Layouts', icon: '🔟' },
  { id: 'react-exp-1', title: 'React Performance', icon: '🚀' },
  { id: 'pro-1', title: 'Build a Portfolio', icon: '💼', chapter: 'Pro Projects' },
  { id: 'pro-2', title: 'Build a Dashboard', icon: '📊' },
  { id: 'pro-3', title: 'Build an E-commerce', icon: '🛒' },
  { id: 'proj-1', title: 'Real Project: Blog', icon: '📝' },
  { id: 'proj-2', title: 'Real Project: SaaS UI', icon: '💎', milestone: 'FRONTEND MASTER' },
];

const buildTrack = (
  lessons: Array<{ id: string; title: string; icon: string; chapter?: string; milestone?: string }>,
  prefix: TrackNode['routePrefix'],
  firstChapter: string,
  finalMilestone: string,
): TrackNode[] =>
  lessons.map((l, i) => ({
    id: l.id,
    step: i + 1,
    label: l.title,
    icon: l.icon,
    chapter: l.chapter || (i === 0 ? firstChapter : undefined),
    milestone: l.milestone || (i === lessons.length - 1 ? finalMilestone : undefined),
    lessonIds: [l.id],
    routePrefix: prefix,
  }));

const TRACKS_DATA: Record<string, TrackNode[]> = {
  frontend:     buildTrack(FRONTEND_LESSONS, 'lesson', 'HTML — Beginner', 'FRONTEND MASTER'),
  networking:   buildTrack(NETWORKING_LESSONS.map(l => ({ id: l.id, title: l.title, icon: l.icon })), 'n-lesson', 'Module 1: Networking Fundamentals', 'NETWORKING COMPLETE'),
 'ai-fundamentals': buildTrack(AI_LESSONS.map(l => ({ id: l.id, title: l.title, icon: l.icon || '🧠' })), 'ai-lesson', 'Module 1: Foundations of AI', 'AI BASICS COMPLETE'),
  fullstack:    buildTrack(FULLSTACK_LESSONS.map(l => ({ id: l.id, title: l.title, icon: l.icon })), 'fs-lesson', 'Module 1: Full Stack Frontend Dev', 'FULL STACK COMPLETE'),
  freelance:    buildTrack(FREELANCE_LESSONS.map(l => ({ id: l.id, title: l.title, icon: l.icon })), 'f-lesson', 'Module 1: Freelance & Clients', 'FREELANCE MASTER'),
  python:       buildTrack(PYTHON_LESSONS.map(l => ({ id: l.id, title: l.title, icon: l.icon })), 'py-lesson', 'Module 1: Python Programming', 'PYTHON COMPLETE'),
  local:        buildTrack(LOCAL_LESSONS.map(l => ({ id: l.id, title: l.title, icon: l.icon })), 'local-lesson', 'Module 1: Local-Only Coding', 'LOCAL MASTER'),
  sql:          buildTrack(SQL_LESSONS.map(l => ({ id: l.id, title: l.title, icon: l.icon })), 'sql-lesson', 'Module 1: SQL Databases', 'SQL MASTER'),
  pythonexpert: buildTrack(PYTHON_EXPERT_LESSONS.map(l => ({ id: l.id, title: l.title, icon: l.icon })), 'pyx-lesson', 'Module 1: Python Expert', 'PYTHON EXPERT'),
  three3d: buildTrack(THREE3D_LESSONS.map(l => ({ id: l.id, title: l.title, icon: l.icon || '🧊' })), 'three-lesson', 'Module 1: 3D Web Dev', '3D MASTER'),
};

const TRACKS = [
  { key: 'frontend',     label: 'Frontend Dev' },
  { key: 'networking',   label: 'Networking' },
  { key: 'ai-fundamentals', label: 'AI Fundamentals' },
  { key: 'fullstack',    label: 'Full Stack' },
  { key: 'freelance',    label: 'Freelance' },
  { key: 'python',       label: 'Python' },
  { key: 'local',        label: 'Local-Only' },
  { key: 'sql',          label: 'SQL Databases' },
  { key: 'pythonexpert', label: 'Python Expert' },
  { key: 'three3d',      label: '3D Web Dev' },
];

/* ------------------------------------------------------------------ */
/*  STATUS + SECTOR GROUPING                                          */
/* ------------------------------------------------------------------ */

function getNodeStatus(node: TrackNode, completedLessons: string[]): Status {
  if (node.locked) return 'locked';
  if (node.lessonIds.length === 0) return 'upcoming';
  const done = node.lessonIds.filter(id => completedLessons.includes(id)).length;
  if (done === node.lessonIds.length) return 'completed';
  if (done > 0) return 'current';
  return 'upcoming';
}

function computeStatuses(nodes: TrackNode[], completed: string[]): Status[] {
  const base = nodes.map(n => getNodeStatus(n, completed));
  const firstUp = base.findIndex(s => s === 'upcoming');
  if (firstUp !== -1) base[firstUp] = 'current';
  return base;
}

interface Sector {
  chapter: string;
  nodes: Array<{ node: TrackNode; status: Status; globalIdx: number }>;
  milestone?: string;
}

function groupIntoSectors(nodes: TrackNode[], statuses: Status[]): Sector[] {
  const sectors: Sector[] = [];
  let current: Sector | null = null;
  nodes.forEach((node, i) => {
    if (node.chapter || !current) {
      current = { chapter: node.chapter || 'Path', nodes: [], milestone: undefined };
      sectors.push(current);
    }
    current!.nodes.push({ node, status: statuses[i], globalIdx: i });
    if (node.milestone) current!.milestone = node.milestone;
  });
  return sectors;
}

/* ------------------------------------------------------------------ */
/*  SERPENTINE WAVE — 3-COLUMN LAYOUT with SVG curve threading nodes  */
/* ------------------------------------------------------------------ */

// Wave pattern: 0=left, 1=center, 2=right, 1=center, 0=left ...
// This creates a smoother S-wave than the boring 2-col zig-zag.
const WAVE = [0, 1, 2, 1] as const;
const columnFor = (i: number) => WAVE[i % WAVE.length];

const ROW_H = 96;         // vertical distance between nodes
const NODE_SIZE = 68;     // hex node diameter

function SectorPod({
  sector,
  sectorIndex,
  onNodeClick,
}: {
  sector: Sector;
  sectorIndex: number;
  onNodeClick: (n: TrackNode) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver(entries => setWidth(entries[0].contentRect.width));
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const rows = sector.nodes.length;
  const height = rows * ROW_H + 32;

  // Column X positions (0=left, 1=center, 2=right) — responsive
  const colX = (c: number) => {
    if (width < 480) {
      // Mobile: tighter wave
      const pad = 44;
      return pad + ((width - pad * 2) / 2) * (c / 2);
    }
    return 60 + ((width - 120) / 2) * (c / 2);
  };

  // Build SVG path threading through node centers
  const pathD = useMemo(() => {
    if (!width) return '';
    const pts = sector.nodes.map((_, i) => ({
      x: colX(columnFor(i)),
      y: 16 + i * ROW_H + ROW_H / 2,
    }));
    if (pts.length < 2) return '';
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 1; i < pts.length; i++) {
      const p0 = pts[i - 1], p1 = pts[i];
      const midY = (p0.y + p1.y) / 2;
      d += ` C ${p0.x} ${midY}, ${p1.x} ${midY}, ${p1.x} ${p1.y}`;
    }
    return d;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width, sector.nodes.length]);

  // Progress along the curve based on completion
  const completedCount = sector.nodes.filter(n => n.status === 'completed').length;
  const progressRatio = sector.nodes.length ? completedCount / sector.nodes.length : 0;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(sectorIndex * 0.05, 0.3) }}
      className="relative"
    >
      {/* Sector header — glowing panel */}
      <div className="relative mb-4 flex items-center gap-3">
        <div className="flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-3 py-1.5 backdrop-blur-sm">
          <span className="font-mono text-[10px] text-primary/70">SECTOR {String(sectorIndex + 1).padStart(2, '0')}</span>
          <div className="h-3 w-px bg-primary/30" />
          <span className="font-display text-xs font-bold uppercase tracking-wider text-primary">
            {sector.chapter}
          </span>
        </div>
        <div className="relative h-[2px] flex-1 overflow-hidden rounded-full bg-border/30">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressRatio * 100}%` }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-full bg-gradient-to-r from-primary/40 to-primary shadow-[0_0_8px_hsl(var(--primary))]"
          />
        </div>
        <span className="font-mono text-[10px] text-muted-foreground">
          {completedCount}/{sector.nodes.length}
        </span>
      </div>

      {/* Wave field */}
      <div
        ref={containerRef}
        className="relative w-full"
        style={{ height }}
      >
        {/* SVG curve threading nodes */}
        {width > 0 && (
          <svg
            className="pointer-events-none absolute inset-0"
            width={width}
            height={height}
            style={{ overflow: 'visible' }}
          >
            <defs>
              <linearGradient id={`grad-${sectorIndex}`} x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.6" />
                <stop offset={`${progressRatio * 100}%`} stopColor="hsl(var(--primary))" stopOpacity="0.9" />
                <stop offset={`${progressRatio * 100}%`} stopColor="hsl(var(--border))" stopOpacity="0.25" />
                <stop offset="100%" stopColor="hsl(var(--border))" stopOpacity="0.15" />
              </linearGradient>
            </defs>
            {/* base dim curve */}
            <path d={pathD} fill="none" stroke="hsl(var(--border))" strokeOpacity="0.25" strokeWidth="2" strokeDasharray="4 6" />
            {/* progress curve */}
            <path d={pathD} fill="none" stroke={`url(#grad-${sectorIndex})`} strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        )}

        {/* Nodes */}
        {sector.nodes.map((entry, i) => {
          const { node, status } = entry;
          const cx = colX(columnFor(i));
          const cy = 16 + i * ROW_H + ROW_H / 2;
          const isCurrent = status === 'current';
          const isCompleted = status === 'completed';
          const isLocked = status === 'locked';

          // Label side (put label opposite of node lean to keep it visible)
          const col = columnFor(i);
          const labelLeft = col === 2;

          return (
            <div
              key={node.id}
              className="absolute"
              style={{
                left: cx - NODE_SIZE / 2,
                top: cy - NODE_SIZE / 2,
                width: NODE_SIZE,
                height: NODE_SIZE,
              }}
            >
              {/* Hex node */}
              <motion.button
                whileHover={!isLocked ? { scale: 1.08 } : undefined}
                whileTap={!isLocked ? { scale: 0.95 } : undefined}
                onClick={() => !isLocked && onNodeClick(node)}
                disabled={isLocked}
                className="group relative h-full w-full"
                aria-label={node.label}
              >
                {/* Orbital progress ring (SVG) */}
                <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full -rotate-90">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="hsl(var(--border))" strokeOpacity="0.3" strokeWidth="3" />
                  {(isCompleted || isCurrent) && (
                    <motion.circle
                      cx="50" cy="50" r="45" fill="none"
                      stroke="hsl(var(--primary))" strokeWidth="3" strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: isCompleted ? 1 : 0.5 }}
                      transition={{ duration: 0.9, delay: 0.1 }}
                      style={{ filter: 'drop-shadow(0 0 6px hsl(var(--primary)))' }}
                    />
                  )}
                </svg>

                {/* Inner hex face */}
                <div
                  className={`absolute inset-[10px] flex items-center justify-center text-2xl transition-all ${
                    isCompleted ? 'bg-primary/15 text-primary' :
                    isCurrent   ? 'bg-primary/20 text-primary shadow-[0_0_20px_hsl(var(--primary)/0.5)]' :
                    isLocked    ? 'bg-secondary/20 text-muted-foreground opacity-40' :
                                  'bg-secondary/30 text-foreground/70 group-hover:bg-primary/10'
                  }`}
                  style={{
                    clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
                  }}
                >
                  {isLocked ? <Lock className="h-4 w-4" /> : node.icon}
                </div>

                {/* Status badge */}
                {isCompleted && (
                  <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_0_10px_hsl(var(--primary))]">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </div>
                )}
                {isCurrent && (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 1.6, repeat: Infinity }}
                    className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground"
                  >
                    <Zap className="h-3 w-3" strokeWidth={2.5} />
                  </motion.div>
                )}
              </motion.button>

              {/* Floating label */}
              <div
                className={`pointer-events-none absolute top-1/2 -translate-y-1/2 whitespace-nowrap ${
                  labelLeft ? 'right-full mr-3 text-right' : 'left-full ml-3 text-left'
                }`}
              >
                <p className={`font-display text-xs font-semibold leading-tight ${
                  isCompleted ? 'text-foreground' :
                  isCurrent   ? 'text-primary' :
                                'text-muted-foreground'
                }`}>
                  {node.label}
                </p>
                <p className="mt-0.5 font-mono text-[9px] text-muted-foreground/70">
                  {isCompleted ? 'COMPLETE' :
                   isCurrent   ? 'IN PROGRESS →' :
                   isLocked    ? 'LOCKED' :
                                 `STEP ${node.step}`}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Milestone gate */}
      {sector.milestone && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="my-6 flex justify-center"
        >
          <div className="group relative">
            <div className="absolute inset-0 rounded-2xl bg-primary/20 blur-xl" />
            <div className="relative flex items-center gap-3 rounded-2xl border-2 border-primary/40 bg-background/80 px-5 py-2.5 backdrop-blur-sm">
              <Trophy className="h-4 w-4 text-primary" />
              <span className="font-display text-xs font-bold uppercase tracking-[0.15em] text-primary">
                {sector.milestone}
              </span>
              <ChevronRight className="h-4 w-4 text-primary/60" />
            </div>
          </div>
        </motion.div>
      )}
    </motion.section>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE                                                              */
/* ------------------------------------------------------------------ */

const Roadmap = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [activeTrack, setActiveTrack] = useState('frontend');
  const shouldRedirect = !user;

  useEffect(() => {
    if (shouldRedirect) { navigate('/auth'); return; }
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [shouldRedirect, navigate, activeTrack]);

  if (!user) return null;

  const completedLessons = user.completedLessons;
  const activeNodes: TrackNode[] = TRACKS_DATA[activeTrack] || [];
  const statuses = useMemo(() => computeStatuses(activeNodes, completedLessons), [activeNodes, completedLessons]);
  const sectors  = useMemo(() => groupIntoSectors(activeNodes, statuses), [activeNodes, statuses]);

  const totalDone = statuses.filter(s => s === 'completed').length;
  const totalPct  = activeNodes.length ? Math.round((totalDone / activeNodes.length) * 100) : 0;

  const handleNodeClick = (node: TrackNode) => {
    if (node.lessonIds.length > 0 && !node.locked) {
      const firstIncomplete = node.lessonIds.find(id => !completedLessons.includes(id));
      navigate(`/${node.routePrefix}/${firstIncomplete || node.lessonIds[0]}?from=roadmap`);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background grid-bg">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute -top-32 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-primary/5 blur-[140px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-[300px] w-[300px] rounded-full bg-primary/5 blur-[100px]" />

      <div className="relative z-10 mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary/60">
              Learning Path
            </p>
            <h1 className="font-display text-2xl font-bold sm:text-3xl">
              <span className="text-primary neon-text">Roadmap</span>
            </h1>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1.5 backdrop-blur-sm">
            <Flame className="h-4 w-4 text-primary" />
            <span className="font-mono text-sm font-bold text-primary">{user.streakCount}</span>
          </div>
        </div>

        {/* Global progress console */}
        <div className="mb-6 rounded-2xl border border-border/40 bg-secondary/10 p-4 backdrop-blur-sm">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              Track progress · {activeNodes.length} lessons
            </span>
            <span className="font-display text-lg font-bold text-primary">{totalPct}%</span>
          </div>
          <div className="relative h-2 overflow-hidden rounded-full bg-border/30">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${totalPct}%` }}
              transition={{ duration: 0.9 }}
              className="h-full rounded-full bg-gradient-to-r from-primary/60 via-primary to-primary/60 shadow-[0_0_12px_hsl(var(--primary))]"
            />
          </div>
        </div>

        {/* Track selector — pill rail */}
        <div className="mb-8 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {TRACKS.map(t => (
            <button
              key={t.key}
              onClick={() => setActiveTrack(t.key)}
              className={`whitespace-nowrap rounded-full border px-4 py-1.5 font-display text-xs font-semibold transition-all ${
                activeTrack === t.key
                  ? 'border-primary/50 bg-primary/15 text-primary shadow-[0_0_15px_hsl(var(--primary)/0.3)]'
                  : 'border-border/40 bg-secondary/20 text-muted-foreground hover:border-primary/20 hover:text-foreground'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Sectors */}
        <div className="space-y-10">
          {sectors.map((sector, i) => (
            <SectorPod
              key={`${activeTrack}-${i}`}
              sector={sector}
              sectorIndex={i}
              onNodeClick={handleNodeClick}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 flex items-center justify-center gap-2 pb-24">
          <div className="h-px w-12 bg-border/40" />
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            End of transmission
          </span>
          <div className="h-px w-12 bg-border/40" />
        </div>
      </div>
    </div>
  );
};

export default Roadmap;
