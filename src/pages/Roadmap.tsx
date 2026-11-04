import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { Lock, Check, Flame, Zap, Trophy, ChevronRight, ChevronDown, Compass, ArrowRight, Sparkles } from 'lucide-react';
import { useState, useEffect, useMemo, useRef, useLayoutEffect } from 'react';
import { motion } from 'framer-motion';
import EnrollDialog from '@/components/EnrollDialog';
import { isEnrolled, type TrackId } from '@/lib/enrollment';
import { NETWORKING_LESSONS } from '@/data/networkingLessons';
import { FULLSTACK_LESSONS } from '@/data/fullstackLessons';
import { FREELANCE_LESSONS } from '@/data/freelanceLessons';
import { PYTHON_LESSONS } from '@/data/pythonLessons';
import { LOCAL_LESSONS } from '@/data/localLessons';
import { SQL_LESSONS } from '@/data/sqlLessons';
import { PYTHON_EXPERT_LESSONS } from '@/data/pythonExpertLessons';
import { AI_LESSONS } from '@/data/aiFundamentalsLesson';
import { INTERMEDIATE_AI_LESSONS } from '@/data/intermediateAiLesson'; // <-- ADD THIS LINE
import { ADVANCED_AI_LESSONS } from '@/data/advancedAiLesson';
import { THREE3D_LESSONS } from '@/data/three3dLessons';
import { REAL_FREELANCE_LESSONS } from '@/data/realfreelanceLesson';
import { JAVA_LESSONS } from '@/data/javaLesson';
import { JAVA_EXPERT_LESSONS } from '@/data/javaExpertLessons';
import { C_LESSONS } from '@/data/cLessons';
import { C_EXPERT_LESSONS } from '@/data/cExpertLessons';
import { CPP_LESSONS } from '@/data/cppLessons';
import { CPP_EXPERT_LESSONS } from '@/data/cppExpertLessons';
import { CYBER_LESSONS } from '@/data/cyberLessons';

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
    | 'py-lesson' | 'local-lesson' | 'sql-lesson' | 'pyx-lesson'| 'ai-lesson' | 'iai-lesson' | 'adv-ai-lesson' | 'three-lesson' | 'rf-lesson'
    | 'java-lesson' | 'javax-lesson'| 'cpp-lesson' | 'cppx-lesson' | 'c-lesson' | 'cx-lesson' | 'cyber-lesson';
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
 'intermediate-ai': buildTrack(INTERMEDIATE_AI_LESSONS.map(l => ({ id: l.id, title: l.title, icon: l.icon || '🤖' })), 'iai-lesson', 'Module 1: Advanced AI Concepts', 'INTERMEDIATE AI MASTER'),
 'advanced-ai': buildTrack(ADVANCED_AI_LESSONS.map(l => ({ id: l.id, title: l.title, icon: l.icon || '⚡' })), 'adv-ai-lesson', 'Module 1: Production AI Systems', 'ADVANCED AI ENGINEER'),
  fullstack:    buildTrack(FULLSTACK_LESSONS.map(l => ({ id: l.id, title: l.title, icon: l.icon })), 'fs-lesson', 'Module 1: Full Stack Frontend Dev', 'FULL STACK COMPLETE'),
  freelance:    buildTrack(FREELANCE_LESSONS.map(l => ({ id: l.id, title: l.title, icon: l.icon })), 'f-lesson', 'Module 1: Freelance & Clients', 'FREELANCE MASTER'),
  python:       buildTrack(PYTHON_LESSONS.map(l => ({ id: l.id, title: l.title, icon: l.icon })), 'py-lesson', 'Module 1: Python Programming', 'PYTHON COMPLETE'),
  local:        buildTrack(LOCAL_LESSONS.map(l => ({ id: l.id, title: l.title, icon: l.icon })), 'local-lesson', 'Module 1: Local-Only Coding', 'LOCAL MASTER'),
  sql:          buildTrack(SQL_LESSONS.map(l => ({ id: l.id, title: l.title, icon: l.icon })), 'sql-lesson', 'Module 1: SQL Databases', 'SQL MASTER'),
  pythonexpert: buildTrack(PYTHON_EXPERT_LESSONS.map(l => ({ id: l.id, title: l.title, icon: l.icon })), 'pyx-lesson', 'Module 1: Python Expert', 'PYTHON EXPERT'),
  three3d:      buildTrack(THREE3D_LESSONS.map(l => ({ id: l.id, title: l.title, icon: l.icon || '🧊' })), 'three-lesson', 'Module 1: 3D Web Dev', '3D MASTER'),
 'real-freelance': buildTrack(REAL_FREELANCE_LESSONS.map(l => ({ id: l.id, title: l.title, icon: l.icon || '💼' })), 'rf-lesson', 'Module 1: Real-World Freelance', 'REAL FREELANCE MASTER'),
  cpp: buildTrack(CPP_LESSONS.map(l => ({ id: l.id, title: l.title, icon: l.icon || '⚙️' })), 'cpp-lesson', 'Module 1: C++ Foundations', 'C++ MASTER'),
  cppexpert: buildTrack(CPP_EXPERT_LESSONS.map(l => ({ id: l.id, title: l.title, icon: l.icon || '🚀' })), 'cppx-lesson', 'Module 1: Advanced C++', 'C++ EXPERT MASTER'),
  java: buildTrack(JAVA_LESSONS.map(l => ({ id: l.id, title: l.title, icon: l.icon })), 'java-lesson', 'Module 1: Java Programming', 'JAVA COMPLETE'),
  javaexpert: buildTrack(JAVA_EXPERT_LESSONS.map(l => ({ id: l.id, title: l.title, icon: l.icon || '☕' })), 'javax-lesson', 'Module 1: Advanced Java', 'JAVA EXPERT MASTER'),
  c: buildTrack(C_LESSONS.map(l => ({ id: l.id, title: l.title, icon: l.icon || '⚡' })), 'c-lesson', 'Module 1: C Foundations', 'C MASTER'),
  cexpert: buildTrack(C_EXPERT_LESSONS.map(l => ({ id: l.id, title: l.title, icon: l.icon || '💻' })), 'cx-lesson', 'Module 1: Advanced C', 'C EXPERT MASTER'),
  cyber: buildTrack(
    CYBER_LESSONS.map(l => ({ id: l.id, title: l.title, icon: l.icon || '🛡️' })),
    'cyber-lesson',
    'Module 1: Hacker Mindset & Foundations',
    'CYBER DEFENDER'
  ),
 };

const TRACKS = [
  { key: 'frontend',     label: 'Frontend Dev' },
  { key: 'cyber',        label: 'Cyber Security' },
  { key: 'java',         label: 'Java' },
  { key: 'javaexpert',   label: 'Java Expert' },
  { key: 'c',            label: 'C' },
  { key: 'cexpert',      label: 'C Expert' },
  { key: 'cpp',          label: 'C++' },
  { key: 'cppexpert',    label: 'C++ Expert' },
  { key: 'networking',   label: 'Networking' },
  { key: 'ai-fundamentals', label: 'AI Fundamentals' },
  { key: 'intermediate-ai', label: 'Intermediate AI' },
  { key: 'advanced-ai', label: 'Advanced AI' },
  { key: 'fullstack',    label: 'Full Stack' },
  { key: 'freelance',    label: 'Freelance' },
  { key: 'python',       label: 'Python' },
  { key: 'local',        label: 'Local-Only' },
  { key: 'sql',          label: 'SQL Databases' },
  { key: 'pythonexpert', label: 'Python Expert' },
  { key: 'three3d',      label: '3D Web Dev' },
  { key: 'real-freelance', label: 'Real Freelance' },
];

const TRACK_KEY_TO_ENROLL_TRACK: Record<string, TrackId> = {
  frontend: 'frontend',
  cyber: 'cyber',
  networking: 'networking',
  fullstack: 'fullstack',
  freelance: 'freelance',
  'real-freelance': 'real-freelance',
  python: 'python',
  local: 'local',
  sql: 'sql',
  pythonexpert: 'pythonexpert',
  'ai-fundamentals': 'ai-fundamentals',
  'intermediate-ai': 'intermediate-ai',
  'advanced-ai': 'advanced-ai',
  three3d: 'three3d',
  java: 'java',
  javaexpert: 'javaexpert',
  cpp: 'cpp',
  cppexpert: 'cppexpert',
  c: 'c',
  cexpert: 'cx',
};

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

// Dynamic wave: 3 cols on mobile/tablet, 5 cols on desktop (≥1024px)
// Pattern goes 0 → max → 0 smoothly: e.g. 5 cols = [0,1,2,3,4,3,2,1]
function getColumnCount(width: number): number {
  if (width >= 1024) return 5;   // desktop: wide serpentine
  if (width >= 768)  return 4;   // tablet: medium
  return 3;                       // mobile: current behavior
}

function buildWave(cols: number): number[] {
  const up = Array.from({ length: cols }, (_, i) => i);
  const down = Array.from({ length: cols - 2 }, (_, i) => cols - 2 - i);
  return [...up, ...down]; // e.g. 5 cols → [0,1,2,3,4,3,2,1]
}

// Fallback for SSR / first render before width is known
const DEFAULT_WAVE = buildWave(3);
const columnFor = (i: number, wave: number[] = DEFAULT_WAVE) => wave[i % wave.length];

const ROW_H_MOBILE = 96;  // extra room so two-line labels below the node don't collide
const ROW_H_DESKTOP = 80;
const NODE_SIZE = 52;     // slightly compact node diameter

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

 const cols = getColumnCount(width);
const wave = width > 0 ? buildWave(cols) : DEFAULT_WAVE;
const maxCol = cols - 1;
const isMobile = width > 0 && width < 640;          // ← ADD THIS
const ROW_H = isMobile ? ROW_H_MOBILE : ROW_H_DESKTOP;  // ← ADD THIS
const rows = sector.nodes.length;
const height = rows * ROW_H + 32;

 const colX = (c: number) => {
  if (width < 640) {
    const pad = 56;
    const span = Math.max(100, width - pad * 2);
    return pad + span * (c / maxCol);
  }
  if (width < 1024) {
    // tablet
    return 70 + (width - 140) * (c / maxCol);
  }
  // desktop — wider padding so labels don't clip at edges
  return 100 + (width - 200) * (c / maxCol);
};

  // Build SVG path threading through node centers
  const pathD = useMemo(() => {
    if (!width) return '';
    const pts = sector.nodes.map((_, i) => ({
  x: colX(columnFor(i, wave)),   // ✅ passes dynamic wave
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
 }, [width, sector.nodes.length, wave, maxCol]);

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
      <div className="relative mb-4 flex items-center gap-2 sm:gap-3 w-full min-w-0 max-w-full overflow-hidden">
        <div className="flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-2 sm:px-3 py-1.5 backdrop-blur-sm min-w-0 flex-1 sm:flex-initial overflow-hidden">
          <span className="font-mono text-[10px] text-primary/70 shrink-0">S{String(sectorIndex + 1).padStart(2, '0')}</span>
          <div className="h-3 w-px bg-primary/30 shrink-0" />
          <span className="font-display text-[10px] sm:text-xs font-bold uppercase tracking-wider text-primary truncate min-w-0">
            {sector.chapter}
          </span>
        </div>
        <div className="relative h-[2px] hidden sm:block flex-1 overflow-hidden rounded-full bg-border/30">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressRatio * 100}%` }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-full bg-gradient-to-r from-primary/40 to-primary shadow-[0_0_8px_hsl(var(--primary))]"
          />
        </div>
        <span className="font-mono text-[10px] text-muted-foreground shrink-0 whitespace-nowrap">
          {completedCount}/{sector.nodes.length}
        </span>
      </div>


      {/* Wave field */}
      {/* Wave field — clipped so no absolute child can push the page wider */}
      <div
        ref={containerRef}
        className="relative w-full max-w-full overflow-hidden"
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
          const cx = colX(columnFor(i, wave)); 
          const cy = 16 + i * ROW_H + ROW_H / 2;
          const isCurrent = status === 'current';
          const isCompleted = status === 'completed';
          const isLocked = status === 'locked';

          // Label side (put label opposite of node lean to keep it visible)
          const col = columnFor(i, wave);          
           const labelLeft = col > maxCol / 2;  

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
  className={`pointer-events-none absolute w-[92px] sm:w-[160px] max-w-[92px] sm:max-w-[160px] text-center sm:text-left ${
    // Mobile (<640px): center under node. sm+: float left/right of node.
    labelLeft
      ? 'top-[105%] left-1/2 -translate-x-1/2 sm:top-1/2 sm:-translate-y-1/2 sm:left-auto sm:right-full sm:mr-3 sm:translate-x-0 sm:text-right'
      : 'top-[105%] left-1/2 -translate-x-1/2 sm:top-1/2 sm:-translate-y-1/2 sm:left-full sm:ml-3 sm:translate-x-0'
  }`}
>
  <p className={`font-display text-[10px] sm:text-xs font-semibold leading-tight truncate ${
    isCompleted ? 'text-foreground' :
    isCurrent   ? 'text-primary' :
                  'text-muted-foreground'
  }`}>
    {node.label}
  </p>
  <p className="mt-0.5 font-mono text-[8px] sm:text-[9px] text-muted-foreground/70 truncate">
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

interface CareerStep {
  title: string;
  trackKey?: string;
  isDsa?: boolean;
}

interface CareerPath {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  duration: string;
  badge: string;
  steps: CareerStep[];
}

const CAREER_PATHS: CareerPath[] = [
  {
    id: 'cyber-career',
    title: 'Cyber Security & Ethical Hacker',
    subtitle: 'From network fundamentals to vulnerability exploitation and SOC defense',
    icon: '🛡️',
    duration: '3–5 Months',
    badge: 'New Track',
    steps: [
      { title: 'Computer Systems & Network Architecture', trackKey: 'networking' },
      { title: 'Cyber Security & Ethical Hacking', trackKey: 'cyber' },
      { title: 'Python for Beginners & Scripting', trackKey: 'python' },
      { title: 'SQL & Database Security', trackKey: 'sql' },
    ],
  },
  {
    id: 'fullstack-career',
    title: 'Full-Stack Developer',
    subtitle: 'Build complete web apps from scratch to production',
    icon: '🚀',
    duration: '4–6 Months',
    badge: 'Most Popular',
    steps: [
      { title: 'Frontend Web Development (HTML, CSS, JS, React)', trackKey: 'frontend' },
      { title: 'Computer & Network Fundamentals', trackKey: 'networking' },
      { title: 'SQL & Database Mastery', trackKey: 'sql' },
      { title: 'Full-Stack Web Development', trackKey: 'fullstack' },
      { title: 'DSA Sheet & Interview Prep', isDsa: true },
    ],
  },
  {
    id: 'ai-career',
    title: 'AI & Machine Learning Engineer',
    subtitle: 'Master Python, Data, LLMs, and modern AI engineering',
    icon: '🤖',
    duration: '4-6 Months',
    badge: 'High Demand',
    steps: [
      { title: 'Python for Beginners', trackKey: 'python' },
      { title: 'Python Advanced & APIs', trackKey: 'pythonexpert' },
      { title: 'SQL & Database Mastery', trackKey: 'sql' },
      { title: 'AI & Machine Learning Fundamentals', trackKey: 'ai-fundamentals' },
      { title: 'Generative AI, LLMs & Prompting', trackKey: 'intermediate-ai' },
      { title: 'Advanced AI Agents & Production Systems', trackKey: 'advanced-ai' }, 
    ],
  },
  {
    id: 'frontend-3d-career',
    title: 'Modern Frontend & 3D Specialist',
    subtitle: 'Create award-winning interactive & 3D web experiences',
    icon: '🎨',
    duration: '3–4 Months',
    badge: 'Creative Tech',
    steps: [
      { title: 'Frontend Web Development (HTML, CSS, JS, React)', trackKey: 'frontend' },
      { title: 'Computer & Network Fundamentals', trackKey: 'networking' },
      { title: '3D Web Development (Three.js & WebGL)', trackKey: 'three3d' },
      { title: 'Real-World Portfolio Projects', trackKey: 'frontend' },
    ],
  },
  {
    id: 'freelance-career',
    title: 'Freelancing Fast-Track',
    subtitle: 'Learn marketable skills and land your first paying clients',
    icon: '💼',
    duration: '2–3 Months',
    badge: 'Earn Fastest',
    steps: [
      { title: 'Choose Frontend Dev OR Python', trackKey: 'frontend' },
      { title: 'Real-World Freelance Execution', trackKey: 'real-freelance' },
      { title: 'Freelance & Client Strategies', trackKey: 'freelance' },
      { title: 'Build 3 Live Client Demos', trackKey: 'real-freelance' },
    ],
  },
];

const Roadmap = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [activeTrack, setActiveTrack] = useState('frontend');
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [enrollDialogTrack, setEnrollDialogTrack] = useState<TrackId | null>(null);
  const [pendingNode, setPendingNode] = useState<TrackNode | null>(null);
  const shouldRedirect = !user;

  useEffect(() => {
    if (shouldRedirect) { navigate('/auth'); return; }
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [shouldRedirect, navigate, activeTrack]);

  const completedLessons = user?.completedLessons || [];
  const activeNodes: TrackNode[] = useMemo(() => TRACKS_DATA[activeTrack] || [], [activeTrack]);
  const statuses = useMemo(() => computeStatuses(activeNodes, completedLessons), [activeNodes, completedLessons]);
  const sectors  = useMemo(() => groupIntoSectors(activeNodes, statuses), [activeNodes, statuses]);

  if (!user) return null;

  const totalDone = statuses.filter(s => s === 'completed').length;
  const totalPct  = activeNodes.length ? Math.round((totalDone / activeNodes.length) * 100) : 0;

  const handleNodeClick = (node: TrackNode) => {
    if (node.lessonIds.length > 0 && !node.locked) {
      // Map activeTrack to TrackId for enrollment verification
      const trackId = (TRACK_KEY_TO_ENROLL_TRACK[activeTrack] || activeTrack) as TrackId;
      if (!isEnrolled(trackId)) {
        setPendingNode(node);
        setEnrollDialogTrack(trackId);
        return;
      }

      const firstIncomplete = node.lessonIds.find(id => !completedLessons.includes(id));
      navigate(`/${node.routePrefix}/${firstIncomplete || node.lessonIds[0]}?from=roadmap`);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background grid-bg">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute -top-32 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-primary/5 blur-[140px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-[300px] w-[300px] rounded-full bg-primary/5 blur-[100px]" />


<div className="relative z-10 mx-auto max-w-4xl lg:max-w-6xl px-3 py-6 sm:px-6 sm:py-8 overflow-x-hidden">
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

        {/* Career Paths & Beginner Guide (Expandable) */}
        <div className="mb-6 rounded-2xl border border-primary/30 bg-gradient-to-r from-primary/10 via-secondary/20 to-primary/5 p-4 backdrop-blur-sm transition-all">
          <button
            type="button"
            onClick={() => setIsGuideOpen(prev => !prev)}
            className="flex w-full items-center justify-between gap-3 text-left"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/20 text-primary shadow-[0_0_15px_hsl(var(--primary)/0.3)]">
                <Compass className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="font-display text-sm sm:text-base font-bold text-foreground">
                    Unsure Where to Start? View Career Paths
                  </h2>
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/20 px-2 py-0.5 font-mono text-[10px] font-semibold text-primary">
                    <Sparkles className="h-2.5 w-2.5" /> Beginner Guide
                  </span>
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  Step-by-step ordered tracks for Full-Stack, AI Engineer, 3D Web, and Freelancing
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
              <span className="hidden sm:inline">{isGuideOpen ? 'Hide Guide' : 'Explore Paths'}</span>
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-200 ${
                  isGuideOpen ? 'rotate-180' : ''
                }`}
              />
            </div>
          </button>

          {isGuideOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-4 grid grid-cols-1 gap-4 border-t border-border/40 pt-4 md:grid-cols-2"
            >
              {CAREER_PATHS.map(career => (
                <div
                  key={career.id}
                  className="flex flex-col justify-between rounded-xl border border-border/50 bg-background/70 p-4 hover:border-primary/40 transition-all"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl">{career.icon}</span>
                        <div>
                          <h3 className="font-display text-sm font-bold text-foreground">
                            {career.title}
                          </h3>
                          <p className="text-[11px] text-muted-foreground">{career.subtitle}</p>
                        </div>
                      </div>
                      <span className="shrink-0 rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-primary">
                        {career.badge}
                      </span>
                    </div>

                    <div className="my-3 space-y-1.5">
                      {career.steps.map((step, idx) => {
                        const isCurrentlySelected = step.trackKey === activeTrack;
                        return (
                          <div
                            key={idx}
                            className={`flex items-center justify-between gap-2 rounded-lg px-2.5 py-1.5 text-xs transition-colors ${
                              isCurrentlySelected
                                ? 'bg-primary/15 border border-primary/30 text-foreground'
                                : 'bg-secondary/20 text-muted-foreground hover:bg-secondary/40 hover:text-foreground'
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/20 font-mono text-[10px] font-bold text-primary">
                                {idx + 1}
                              </span>
                              <span className="truncate font-medium">{step.title}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                if (step.isDsa) {
                                  navigate('/dsa-sheet');
                                } else if (step.trackKey) {
                                  setActiveTrack(step.trackKey);
                                  setIsGuideOpen(false);
                                }
                              }}
                              className="shrink-0 inline-flex items-center gap-1 rounded-md bg-primary/15 px-2 py-0.5 font-mono text-[10px] font-semibold text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                            >
                              {step.isDsa ? 'Open DSA' : isCurrentlySelected ? 'Active' : 'Go'}
                              <ArrowRight className="h-2.5 w-2.5" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-2 flex items-center justify-between border-t border-border/30 pt-2.5">
                    <span className="font-mono text-[10px] text-muted-foreground">
                      ⏱ Est. Time: {career.duration}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const firstTrack = career.steps[0]?.trackKey;
                        if (firstTrack) {
                          setActiveTrack(firstTrack);
                          setIsGuideOpen(false);
                        }
                      }}
                      className="inline-flex items-center gap-1 text-xs font-display font-bold text-primary hover:underline"
                    >
                      Start Step 1 <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Track selector — pill rail */}
        <div className="mb-4 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
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

      {/* Track Enrollment Dialog if learner clicks a node without active enrollment */}
      <EnrollDialog
        open={!!enrollDialogTrack}
        track={enrollDialogTrack}
        onClose={() => {
          setEnrollDialogTrack(null);
          setPendingNode(null);
        }}
        onEnrolled={() => {
          const targetNode = pendingNode;
          setEnrollDialogTrack(null);
          setPendingNode(null);
          if (targetNode) {
            const firstIncomplete = targetNode.lessonIds.find(id => !completedLessons.includes(id));
            navigate(`/${targetNode.routePrefix}/${firstIncomplete || targetNode.lessonIds[0]}?from=roadmap`);
          }
        }}
      />
    </div>
  );
};

export default Roadmap;
