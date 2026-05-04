import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { Lock, Check, ArrowLeft, Flame } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

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

const FRONTEND_TRACK: TrackNode[] = [
  // HTML Beginner
  { id: 'fe-1', step: 1, label: 'What is HTML?', icon: '📄', chapter: 'HTML — Beginner', lessonIds: ['html-1'] },
  { id: 'fe-2', step: 2, label: 'Headings & Text', icon: '📝', lessonIds: ['html-2'] },
  { id: 'fe-3', step: 3, label: 'Links & Navigation', icon: '🔗', lessonIds: ['html-3'] },
  { id: 'fe-4', step: 4, label: 'Images & Media', icon: '🖼️', lessonIds: ['html-4'] },
  { id: 'fe-5', step: 5, label: 'Lists', icon: '📋', lessonIds: ['html-5'] },
  { id: 'fe-6', step: 6, label: 'Tables', icon: '📊', milestone: 'HTML BASICS COMPLETE', lessonIds: ['html-6'] },
  // CSS Beginner
  { id: 'fe-7', step: 7, label: 'CSS Introduction', icon: '🎨', chapter: 'CSS — Beginner', lessonIds: ['css-1'] },
  { id: 'fe-8', step: 8, label: 'Colors & Typography', icon: '🖌️', lessonIds: ['css-2'] },
  { id: 'fe-9', step: 9, label: 'Box Model', icon: '📦', lessonIds: ['css-3'] },
  { id: 'fe-10', step: 10, label: 'Flexbox', icon: '📐', lessonIds: ['css-4', 'css-5'] },
  { id: 'fe-11', step: 11, label: 'CSS Grid', icon: '🔲', milestone: 'CSS BASICS COMPLETE', lessonIds: ['css-6'] },
  // JS Beginner
  { id: 'fe-12', step: 12, label: 'JS Introduction', icon: '⚡', chapter: 'JavaScript — Beginner', lessonIds: ['js-1'] },
  { id: 'fe-13', step: 13, label: 'Variables & Types', icon: '📦', lessonIds: ['js-2'] },
  { id: 'fe-14', step: 14, label: 'Functions', icon: '🔧', lessonIds: ['js-3'] },
  { id: 'fe-15', step: 15, label: 'DOM Manipulation', icon: '🌳', lessonIds: ['js-4', 'js-5'] },
  { id: 'fe-16', step: 16, label: 'Events', icon: '🎯', milestone: 'JS BASICS COMPLETE', lessonIds: ['js-5'] },
  // Intermediate
  { id: 'fe-17', step: 17, label: 'ES6+ Features', icon: '✨', chapter: 'Intermediate', lessonIds: ['js-int-1', 'js-int-2'] },
  { id: 'fe-18', step: 18, label: 'APIs & Fetch', icon: '📡', lessonIds: ['js-int-3'] },
  { id: 'fe-19', step: 19, label: 'Tailwind CSS', icon: '🌬️', lessonIds: ['css-int-1'] },
  { id: 'fe-20', step: 20, label: 'React Basics', icon: '⚛️', milestone: 'INTERMEDIATE COMPLETE', lessonIds: ['react-1', 'react-2'] },
  // Advanced
  { id: 'fe-21', step: 21, label: 'React Hooks', icon: '🪝', chapter: 'Advanced', lessonIds: ['react-3', 'react-4'] },
  { id: 'fe-22', step: 22, label: 'Context & State', icon: '🔄', lessonIds: ['react-int-1'] },
  { id: 'fe-23', step: 23, label: 'Testing', icon: '🧪', lessonIds: [], locked: true },
  { id: 'fe-24', step: 24, label: 'Security', icon: '🛡️', lessonIds: [], locked: true },
  { id: 'fe-25', step: 25, label: 'Deployment', icon: '🚀', milestone: 'FRONTEND MASTER', lessonIds: [], locked: true },
];

const TRACKS = [
  { key: 'frontend', label: 'Frontend Dev', locked: false },
  { key: 'networking', label: 'Networking', locked: true },
  { key: 'freelance', label: 'Freelancing', locked: true },
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

  useEffect(() => {
    setTimeout(() => currentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 500);
  }, [activeTrack]);

  const handleNodeClick = (node: TrackNode) => {
    if (node.lessonIds.length > 0 && !node.locked) {
      const firstIncomplete = node.lessonIds.find(id => !completedLessons.includes(id));
      navigate(`/lesson/${firstIncomplete || node.lessonIds[0]}`);
    }
  };

  const isTrackLocked = TRACKS.find(t => t.key === activeTrack)?.locked;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden grid-bg">
      <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-primary/3 blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
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
              {t.locked && <Lock className="w-3 h-3" />}
              {t.label}
            </button>
          ))}
        </div>

        {/* Locked track message */}
        {isTrackLocked ? (
          <div className="glass-card p-8 rounded-2xl text-center">
            <Lock className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <h2 className="text-lg font-bold font-display text-foreground mb-1">Coming Soon</h2>
            <p className="text-sm text-muted-foreground">This track is being developed. Stay tuned!</p>
          </div>
        ) : (
          /* Frontend Zigzag Path */
          <div className="relative py-4">
            <div className="space-y-3 relative z-10">
              {FRONTEND_TRACK.map((node, i) => {
                const status = getNodeStatus(node, completedLessons);
                const isLeft = i % 2 === 0;
                const isCurrent = status === 'current';

                return (
                  <div key={node.id}>
                    {node.chapter && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.03 }}
                        className="text-xs text-primary/60 font-display font-semibold uppercase tracking-wider mb-2 pl-4"
                      >
                        {node.chapter}
                      </motion.div>
                    )}

                    <motion.div
                      ref={isCurrent ? currentRef : undefined}
                      initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04, type: 'spring', stiffness: 100 }}
                      className={`flex items-center gap-3 ${isLeft ? 'justify-start' : 'justify-end'}`}
                    >
                      {!isLeft && <div className="flex-1" />}

                      <button
                        onClick={status !== 'locked' ? () => handleNodeClick(node) : undefined}
                        className={`flex items-center gap-3 px-4 py-3 rounded-2xl border-2 transition-all max-w-[85%] sm:max-w-[70%] ${
                          status === 'completed' ? 'bg-primary/8 border-primary/30 hover:border-primary/50' :
                          status === 'current' ? 'bg-primary/10 border-primary/40 neon-glow' :
                          status === 'upcoming' ? 'bg-secondary/20 border-border/30 hover:border-primary/20 opacity-70' :
                          'bg-secondary/10 border-border/20 opacity-30 cursor-not-allowed'
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
                            {status === 'completed' ? 'Complete ✓' :
                             status === 'current' ? 'In Progress →' :
                             status === 'upcoming' ? `Step ${node.step}` :
                             'Locked 🔒'}
                          </p>
                        </div>
                        {status === 'completed' && <Check className="w-5 h-5 text-primary ml-auto flex-shrink-0" />}
                      </button>

                      {isLeft && <div className="flex-1" />}
                    </motion.div>

                    {i < FRONTEND_TRACK.length - 1 && (
                      <div className="flex justify-center my-1">
                        <div className={`w-[2px] h-4 border-l-2 border-dashed ${
                          status === 'completed' ? 'border-primary/40' : 'border-border/30'
                        }`} />
                      </div>
                    )}

                    {node.milestone && (
                      <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: i * 0.04 + 0.1 }}
                        className="flex justify-center my-3"
                      >
                        <div className="glass-card px-4 py-2 text-center">
                          <p className="text-[10px] text-primary font-display font-bold uppercase tracking-wider">🏆 {node.milestone}</p>
                        </div>
                      </motion.div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Roadmap;
