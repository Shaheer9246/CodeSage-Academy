import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { Lock, Check, ArrowLeft, Flame } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TrackNode {
  id: string;
  step: number;
  label: string;
  icon: string;
  chapter?: string;
  milestone?: string;
  lessonIds: string[];
  locked?: boolean;
}

const NETWORKING_TRACK: TrackNode[] = [
  { id: 'net-1', step: 1, label: 'Hardware Basics', icon: '🖥️', chapter: 'Foundations', lessonIds: [] },
  { id: 'net-2', step: 2, label: 'Operating Systems', icon: '💻', lessonIds: [] },
  { id: 'net-3', step: 3, label: 'IP Addressing', icon: '🌐', lessonIds: [] },
  { id: 'net-4', step: 4, label: 'DNS & Domains', icon: '🏠', milestone: 'NETWORKING BASICS COMPLETE', lessonIds: [] },
  { id: 'net-5', step: 5, label: 'OSI Model', icon: '📶', chapter: 'Advanced', lessonIds: [], locked: true },
  { id: 'net-6', step: 6, label: 'Protocols', icon: '📡', lessonIds: [], locked: true },
  { id: 'net-7', step: 7, label: 'Security', icon: '🔒', lessonIds: [], locked: true },
  { id: 'net-8', step: 8, label: 'Browsers', icon: '🌍', lessonIds: [], locked: true },
];

const FRONTEND_TRACK: TrackNode[] = [
  { id: 'fe-1', step: 1, label: 'Web Architecture', icon: '🏗️', chapter: 'Web Foundations', lessonIds: ['html-1'] },
  { id: 'fe-2', step: 2, label: 'HTML', icon: '📄', lessonIds: ['html-2', 'html-3', 'html-4', 'html-5'] },
  { id: 'fe-3', step: 3, label: 'CSS', icon: '🎨', lessonIds: ['css-1', 'css-2', 'css-3'] },
  { id: 'fe-4', step: 4, label: 'Flexbox', icon: '📐', lessonIds: ['css-4', 'css-5'] },
  { id: 'fe-5', step: 5, label: 'Grid', icon: '🔲', milestone: 'FIRST MILESTONE: HTML/CSS MASTER', lessonIds: ['css-6'] },
  { id: 'fe-6', step: 6, label: 'Terminal & CLI', icon: '💻', chapter: 'Developer Tools', lessonIds: ['html-6'] },
  { id: 'fe-7', step: 7, label: 'Git Basics', icon: '🔀', lessonIds: ['html-7'] },
  { id: 'fe-8', step: 8, label: 'JavaScript Logic', icon: '⚡', chapter: 'JavaScript', lessonIds: ['js-1', 'js-2', 'js-3'] },
  { id: 'fe-9', step: 9, label: 'DOM Manipulation', icon: '🌳', lessonIds: ['js-4', 'js-5'] },
  { id: 'fe-10', step: 10, label: 'GitHub', icon: '🐙', milestone: 'JAVASCRIPT GURU', lessonIds: ['html-8'] },
  { id: 'fe-11', step: 11, label: 'ES6+ Features', icon: '✨', chapter: 'Modern JS', lessonIds: ['js-int-1', 'js-int-2'] },
  { id: 'fe-12', step: 12, label: 'APIs & Fetch', icon: '📡', lessonIds: ['js-int-3'] },
  { id: 'fe-13', step: 13, label: 'NPM', icon: '📦', lessonIds: ['js-int-4'] },
  { id: 'fe-14', step: 14, label: 'Tailwind CSS', icon: '🌬️', lessonIds: ['css-int-1'] },
  { id: 'fe-15', step: 15, label: 'React Basics', icon: '⚛️', milestone: 'REACT DEVELOPER', chapter: 'React', lessonIds: ['react-1', 'react-2'] },
  { id: 'fe-16', step: 16, label: 'Hooks', icon: '🪝', lessonIds: ['react-3', 'react-4'] },
  { id: 'fe-17', step: 17, label: 'Context & State', icon: '🔄', lessonIds: ['react-int-1'] },
  { id: 'fe-18', step: 18, label: 'Testing', icon: '🧪', lessonIds: [], locked: true },
  { id: 'fe-19', step: 19, label: 'Security', icon: '🛡️', lessonIds: [], locked: true },
  { id: 'fe-20', step: 20, label: 'Deployment', icon: '🚀', lessonIds: [], locked: true },
];

const FREELANCE_TRACK: TrackNode[] = [
  { id: 'fl-1', step: 1, label: 'Find Your Niche', icon: '🎯', chapter: 'Getting Started', lessonIds: [] },
  { id: 'fl-2', step: 2, label: 'Build Portfolio', icon: '🎨', lessonIds: ['proj-1'] },
  { id: 'fl-3', step: 3, label: 'Personal Branding', icon: '💡', lessonIds: [] },
  { id: 'fl-4', step: 4, label: 'Platforms', icon: '🌐', milestone: 'FREELANCE READY', lessonIds: [], locked: true },
  { id: 'fl-5', step: 5, label: 'Cold Outreach', icon: '📧', chapter: 'Scaling', lessonIds: [], locked: true },
  { id: 'fl-6', step: 6, label: 'Pricing', icon: '💰', lessonIds: [], locked: true },
  { id: 'fl-7', step: 7, label: 'Contracts', icon: '📃', lessonIds: [], locked: true },
  { id: 'fl-8', step: 8, label: 'Client Management', icon: '🤝', lessonIds: [], locked: true },
];

const TRACKS = [
  { key: 'networking', label: 'Networking', nodes: NETWORKING_TRACK, icon: '🌐' },
  { key: 'frontend', label: 'Frontend (20 Steps)', nodes: FRONTEND_TRACK, icon: '📱' },
  { key: 'freelance', label: 'Freelancing', nodes: FREELANCE_TRACK, icon: '💼' },
];

function getNodeStatus(node: TrackNode, completedLessons: string[]): 'locked' | 'completed' | 'current' | 'upcoming' {
  if (node.locked) return 'locked';
  if (node.lessonIds.length === 0) return 'upcoming';
  const completed = node.lessonIds.filter(id => completedLessons.includes(id)).length;
  if (completed === node.lessonIds.length) return 'completed';
  if (completed > 0) return 'current';
  return 'upcoming';
}

const Roadmap = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [activeTrack, setActiveTrack] = useState('frontend');
  const currentRef = useRef<HTMLDivElement>(null);

  if (!user) { navigate('/auth'); return null; }

  const completedLessons = user.completedLessons;
  const track = TRACKS.find(t => t.key === activeTrack) || TRACKS[1];

  useEffect(() => {
    setTimeout(() => currentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 500);
  }, [activeTrack]);

  const handleNodeClick = (node: TrackNode) => {
    if (node.lessonIds.length > 0) {
      const firstIncomplete = node.lessonIds.find(id => !completedLessons.includes(id));
      navigate(`/lesson/${firstIncomplete || node.lessonIds[0]}`);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden grid-bg">
      <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-primary/3 blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative z-10 max-w-3xl mx-auto p-4 sm:p-6 space-y-5"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/dashboard')} className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold font-display">
              <span className="text-primary neon-text">Roadmap</span>
            </h1>
          </div>
          <div className="flex items-center gap-2 glass-card px-3 py-1.5">
            <Flame className="w-3.5 h-3.5 text-primary" />
            <span className="font-bold text-xs text-primary font-mono">{user.streakCount}</span>
          </div>
        </div>

        {/* Track Switcher */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {TRACKS.map(t => (
            <button
              key={t.key}
              onClick={() => setActiveTrack(t.key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-display font-semibold whitespace-nowrap transition-all ${
                activeTrack === t.key
                  ? 'bg-primary/15 text-primary border border-primary/30 neon-border'
                  : 'bg-secondary/30 text-muted-foreground border border-border/30 hover:bg-secondary/50'
              }`}
            >
              <span>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>

        {/* Zigzag Path */}
        <div className="relative py-4">
          {/* SVG connecting path */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
            <defs>
              <linearGradient id="pathGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(145 90% 55%)" stopOpacity="0.4" />
                <stop offset="100%" stopColor="hsl(145 90% 55%)" stopOpacity="0.1" />
              </linearGradient>
            </defs>
          </svg>

          <div className="space-y-3 relative z-10">
            {track.nodes.map((node, i) => {
              const status = getNodeStatus(node, completedLessons);
              const isLeft = i % 2 === 0;
              const isCurrent = status === 'current';
              const showChapter = node.chapter;
              const showMilestone = node.milestone;

              return (
                <div key={node.id}>
                  {showChapter && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="text-xs text-primary/60 font-display font-semibold uppercase tracking-wider mb-2 pl-4"
                    >
                      {showChapter}
                    </motion.div>
                  )}

                  <motion.div
                    ref={isCurrent ? currentRef : undefined}
                    initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06, type: 'spring', stiffness: 100 }}
                    className={`flex items-center gap-3 ${isLeft ? 'justify-start' : 'justify-end'}`}
                  >
                    {!isLeft && <div className="flex-1" />}

                    <button
                      onClick={status !== 'locked' ? () => handleNodeClick(node) : undefined}
                      className={`flex items-center gap-3 px-4 py-3 rounded-2xl border-2 transition-all max-w-[85%] sm:max-w-[70%] ${
                        status === 'completed'
                          ? 'bg-primary/8 border-primary/30 hover:border-primary/50'
                          : status === 'current'
                            ? 'bg-primary/10 border-primary/40 neon-glow animate-pulse-glow'
                            : status === 'upcoming'
                              ? 'bg-secondary/20 border-border/30 hover:border-primary/20 opacity-70'
                              : 'bg-secondary/10 border-border/20 opacity-30 cursor-not-allowed'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${
                        status === 'completed' ? 'bg-primary/15' :
                        status === 'current' ? 'bg-primary/20' :
                        'bg-secondary/30'
                      }`}>
                        {status === 'locked' ? <Lock className="w-4 h-4 text-muted-foreground" /> : node.icon}
                      </div>
                      <div className="text-left">
                        <p className={`text-sm font-display font-semibold ${
                          status === 'completed' ? 'text-foreground' :
                          status === 'current' ? 'text-primary' :
                          'text-muted-foreground'
                        }`}>{node.label}</p>
                        <p className="text-[10px] text-muted-foreground font-mono">
                          {status === 'completed' ? 'Lesson complete ✓' :
                           status === 'current' ? 'Current Lesson · Start →' :
                           status === 'upcoming' ? `Step ${node.step}` :
                           'Locked 🔒'}
                        </p>
                      </div>
                      {status === 'completed' && (
                        <Check className="w-5 h-5 text-primary ml-auto flex-shrink-0" />
                      )}
                    </button>

                    {isLeft && <div className="flex-1" />}
                  </motion.div>

                  {/* Connecting dashed line */}
                  {i < track.nodes.length - 1 && (
                    <div className="flex justify-center my-1">
                      <div className={`w-[2px] h-4 border-l-2 border-dashed ${
                        status === 'completed' ? 'border-primary/40' : 'border-border/30'
                      }`} />
                    </div>
                  )}

                  {showMilestone && (
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: i * 0.06 + 0.1 }}
                      className="flex justify-center my-3"
                    >
                      <div className="glass-card px-4 py-2 text-center">
                        <p className="text-[10px] text-primary font-display font-bold uppercase tracking-wider">🏆 {showMilestone}</p>
                      </div>
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Roadmap;
