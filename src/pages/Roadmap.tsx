import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { Lock, Check, Flame } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { NETWORKING_LESSONS } from '@/data/networkingLessons';
import { FULLSTACK_LESSONS } from '@/data/fullstackLessons';
import { FREELANCE_LESSONS } from '@/data/freelanceLessons';
import { PYTHON_LESSONS } from '@/data/pythonLessons';
import { LOCAL_LESSONS } from '@/data/localLessons';

interface TrackNode {
  id: string;
  step: number;
  label: string;
  icon: string;
  chapter?: string;
  milestone?: string;
  lessonIds: string[];
  routePrefix: 'lesson' | 'n-lesson' | 'fs-lesson' | 'f-lesson' | 'py-lesson' | 'local-lesson';
  locked?: boolean;
}

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
  { id: 'css-exp-2', title: 'Modern Layouts', icon: '🪟' },
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
  finalMilestone: string
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
  frontend: buildTrack(FRONTEND_LESSONS, 'lesson', 'HTML — Beginner', 'FRONTEND MASTER'),
  networking: buildTrack(
    NETWORKING_LESSONS.map(l => ({ id: l.id, title: l.title, icon: l.icon })),
    'n-lesson', 'Module 1: Networking Fundamentals', 'NETWORKING COMPLETE'
  ),
  fullstack: buildTrack(
    FULLSTACK_LESSONS.map(l => ({ id: l.id, title: l.title, icon: l.icon })),
    'fs-lesson', 'Module 1: Full Stack Frontend Dev', 'FULL STACK COMPLETE'
  ),
  freelance: buildTrack(
    FREELANCE_LESSONS.map(l => ({ id: l.id, title: l.title, icon: l.icon })),
    'f-lesson', 'Module 1: Freelance & Clients', 'FREELANCE MASTER'
  ),
  python: buildTrack(
    PYTHON_LESSONS.map(l => ({ id: l.id, title: l.title, icon: l.icon })),
    'py-lesson', 'Module 1: Python Programming', 'PYTHON COMPLETE'
  ),
  local: buildTrack(
    LOCAL_LESSONS.map(l => ({ id: l.id, title: l.title, icon: l.icon })),
    'local-lesson', 'Module 1: Local-Only Coding', 'LOCAL MASTER'
  ),
};

const TRACKS = [
  { key: 'frontend',   label: 'Frontend Dev' },
  { key: 'networking', label: 'Networking' },
  { key: 'fullstack',  label: 'Full Stack' },
  { key: 'freelance',  label: 'Freelance' },
  { key: 'python',     label: 'Python' },
  { key: 'local',      label: 'Local-Only' },
];

function getNodeStatus(node: TrackNode, completedLessons: string[]): 'locked' | 'completed' | 'current' | 'upcoming' {
  if (node.locked) return 'locked';
  if (node.lessonIds.length === 0) return 'upcoming';
  const completed = node.lessonIds.filter(id => completedLessons.includes(id)).length;
  if (completed === node.lessonIds.length) return 'completed';
  if (completed > 0) return 'current';
  return 'upcoming';
}

function computeStatuses(nodes: TrackNode[], completedLessons: string[]): Array<'locked' | 'completed' | 'current' | 'upcoming'> {
  const base = nodes.map(n => getNodeStatus(n, completedLessons));
  // First node that is plain 'upcoming' (after all completed) becomes 'current'
  const firstUpcomingIdx = base.findIndex(s => s === 'upcoming');
  if (firstUpcomingIdx !== -1) base[firstUpcomingIdx] = 'current';
  return base;
}


const Roadmap = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [activeTrack, setActiveTrack] = useState('frontend');
  const shouldRedirect = !user;

  useEffect(() => {
    if (shouldRedirect) { navigate('/auth'); return; }
    // Always start at the top — don't auto-scroll to the current node.
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [shouldRedirect, navigate, activeTrack]);

  if (!user) return null;

  const completedLessons = user.completedLessons;

  const handleNodeClick = (node: TrackNode) => {
    if (node.lessonIds.length > 0 && !node.locked) {
      const firstIncomplete = node.lessonIds.find(id => !completedLessons.includes(id));
      navigate(`/${node.routePrefix}/${firstIncomplete || node.lessonIds[0]}?from=roadmap`);
    }
  };

  const activeNodes: TrackNode[] = TRACKS_DATA[activeTrack] || [];

  return (
    <div className="bg-background relative overflow-hidden grid-bg">
      <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-primary/3 blur-[120px] pointer-events-none" />

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="relative z-10 max-w-3xl mx-auto p-4 sm:p-6 space-y-5"
      >
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold font-display">
            <span className="text-primary neon-text">Roadmap</span>
          </h1>
          <div className="flex items-center gap-2 glass-card px-3 py-1.5">
            <Flame className="w-3.5 h-3.5 text-primary" />
            <span className="font-bold text-xs text-primary font-mono">{user.streakCount}</span>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          {TRACKS.map(t => (
            <button key={t.key} onClick={() => setActiveTrack(t.key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-display font-semibold whitespace-nowrap transition-all ${
                activeTrack === t.key
                  ? 'bg-primary/15 text-primary border border-primary/30 neon-border'
                  : 'bg-secondary/30 text-muted-foreground border border-border/30 hover:bg-secondary/50'
              }`}>
              {t.label}
            </button>
          ))}
        </div>

        <p className="text-[10px] text-muted-foreground font-mono">
          {activeNodes.length} lessons · {activeNodes.filter(n => getNodeStatus(n, completedLessons) === 'completed').length} completed
        </p>

        <div className="relative py-4">
          <div className="space-y-3 relative z-10">
            {(() => {
              const statuses = computeStatuses(activeNodes, completedLessons);
              return activeNodes.map((node, i) => {
              const status = statuses[i];

              const isLeft = i % 2 === 0;
              const isCurrent = status === 'current';

              return (
                <div key={node.id}>
                  {node.chapter && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: Math.min(i * 0.02, 0.3) }}
                      className="text-xs text-primary/60 font-display font-semibold uppercase tracking-wider mb-2 pl-4"
                    >
                      {node.chapter}
                    </motion.div>
                  )}

                  <motion.div
                    initial={{ opacity: 0, x: isLeft ? -30 : 30 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: Math.min(i * 0.02, 0.3), type: 'spring', stiffness: 100 }}
                    className={`flex items-center gap-2 ${isLeft ? 'sm:justify-start' : 'sm:justify-end'} ${isCurrent ? 'ring-2 ring-primary/30 rounded-2xl mx-1' : ''}`}
                  >
                    {!isLeft && <div className="hidden sm:block flex-1" />}
                    <button onClick={status !== 'locked' ? () => handleNodeClick(node) : undefined}
                      className={`flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-3 rounded-2xl border-2 transition-all w-full sm:w-auto sm:max-w-[70%] ${
                        status === 'completed' ? 'bg-primary/8 border-primary/30 hover:border-primary/50' :
                        status === 'current' ? 'bg-primary/10 border-primary/40 neon-glow' :
                        status === 'upcoming' ? 'bg-secondary/20 border-border/30 hover:border-primary/20 opacity-70' :
                        'bg-secondary/10 border-border/20 opacity-30 cursor-not-allowed'
                      }`}>
                      <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-base sm:text-lg flex-shrink-0 ${
                        status === 'completed' ? 'bg-primary/15' :
                        status === 'current' ? 'bg-primary/20' :
                        'bg-secondary/30'
                      }`}>
                        {status === 'locked' ? <Lock className="w-4 h-4 text-muted-foreground" /> : node.icon}
                      </div>
                      <div className="text-left min-w-0 flex-1">
                        <p className={`text-[13px] sm:text-sm font-display font-semibold truncate ${
                          status === 'completed' ? 'text-foreground' :
                          status === 'current' ? 'text-primary' :
                          'text-muted-foreground'
                        }`}>{node.label}</p>
                        <p className="text-[10px] text-muted-foreground font-mono">
                          {status === 'completed' ? 'Complete ✓' :
                           status === 'current' ? 'In Progress →' :
                           status === 'upcoming' ? `Step ${node.step}` :
                           'Locked 🔒'}
                        </p>
                      </div>
                      {status === 'completed' && <Check className="w-4 h-4 sm:w-5 sm:h-5 text-primary ml-auto flex-shrink-0" />}
                    </button>
                    {isLeft && <div className="hidden sm:block flex-1" />}
                  </motion.div>


                  {i < activeNodes.length - 1 && (
                    <div className="flex justify-center my-1">
                      <div className={`w-[2px] h-4 border-l-2 border-dashed ${
                        status === 'completed' ? 'border-primary/40' : 'border-border/30'
                      }`} />
                    </div>
                  )}

                  {node.milestone && (
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: Math.min(i * 0.02 + 0.1, 0.4) }}
                      className="flex justify-center my-3">
                      <div className="glass-card px-4 py-2 text-center">
                        <p className="text-[10px] text-primary font-display font-bold uppercase tracking-wider">🏆 {node.milestone}</p>
                      </div>
                    </motion.div>
                  )}
                </div>
              );
              });
            })()}
          </div>
        </div>

      </motion.div>
    </div>
  );
};

export default Roadmap;
