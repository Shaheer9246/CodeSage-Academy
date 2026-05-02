import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { Lock, Check, ArrowLeft, Flame } from 'lucide-react';
import { getAllLessons } from '@/data/lessons';

interface RoadmapNode {
  id: string;
  label: string;
  icon: string;
  lessonIds: string[];
  locked?: boolean;
}

const FRONTEND_TRACK: RoadmapNode[] = [
  { id: 'fn-1', label: 'HTML Basics', icon: '📄', lessonIds: ['html-1', 'html-2', 'html-3', 'html-4', 'html-5'] },
  { id: 'fn-2', label: 'CSS Styling', icon: '🎨', lessonIds: ['css-1', 'css-2', 'css-3', 'css-4', 'css-5'] },
  { id: 'fn-3', label: 'JavaScript', icon: '⚡', lessonIds: ['js-1', 'js-2', 'js-3', 'js-4', 'js-5'] },
  { id: 'fn-4', label: 'Flexbox', icon: '📐', lessonIds: ['int-flex-1', 'int-flex-2'] },
  { id: 'fn-5', label: 'Grid Layout', icon: '🔲', lessonIds: ['int-grid-1', 'int-grid-2'] },
  { id: 'fn-6', label: 'Responsive', icon: '📱', lessonIds: ['int-resp-1', 'int-resp-2'] },
  { id: 'fn-7', label: 'DOM', icon: '🌳', lessonIds: ['int-dom-1', 'int-dom-2'] },
  { id: 'fn-8', label: 'Events', icon: '🖱️', lessonIds: ['int-events-1'] },
  { id: 'fn-9', label: 'Fetch API', icon: '🌐', lessonIds: ['int-fetch-1'] },
  { id: 'fn-10', label: 'Animations', icon: '✨', lessonIds: ['int-anim-1', 'int-anim-2'] },
  { id: 'fn-11', label: 'Canvas/SVG', icon: '🖼️', lessonIds: ['int-multimedia-1', 'int-multimedia-2'] },
  { id: 'fn-12', label: 'Forms', icon: '📝', lessonIds: ['int-forms-1', 'int-forms-2'] },
  { id: 'fn-13', label: 'Accessibility', icon: '♿', lessonIds: ['int-a11y-1'] },
  { id: 'fn-14', label: 'Async/Await', icon: '⏳', lessonIds: ['exp-async-1', 'exp-async-2'] },
  { id: 'fn-15', label: 'React Basics', icon: '⚛️', lessonIds: ['exp-react-1', 'exp-react-2'] },
  { id: 'fn-16', label: 'State Mgmt', icon: '🔄', lessonIds: ['exp-state-1'] },
  { id: 'fn-17', label: 'React Router', icon: '🗺️', lessonIds: ['exp-router-1'] },
  { id: 'fn-18', label: 'APIs & Data', icon: '📊', lessonIds: ['exp-api-1'] },
  { id: 'fn-19', label: 'Testing', icon: '🧪', lessonIds: ['exp-testing-1'] },
  { id: 'fn-20', label: 'Deploy', icon: '🚀', lessonIds: ['exp-deploy-1'] },
];

const NETWORKING_TRACK: RoadmapNode[] = [
  { id: 'net-1', label: 'HTTP Basics', icon: '🌐', lessonIds: [], locked: true },
  { id: 'net-2', label: 'REST APIs', icon: '📡', lessonIds: [], locked: true },
  { id: 'net-3', label: 'DNS & Domain', icon: '🏠', lessonIds: [], locked: true },
  { id: 'net-4', label: 'HTTPS/SSL', icon: '🔒', lessonIds: [], locked: true },
  { id: 'net-5', label: 'WebSockets', icon: '🔌', lessonIds: [], locked: true },
  { id: 'net-6', label: 'Auth & JWT', icon: '🔑', lessonIds: [], locked: true },
  { id: 'net-7', label: 'CORS & Security', icon: '🛡️', lessonIds: [], locked: true },
  { id: 'net-8', label: 'GraphQL', icon: '💎', lessonIds: [], locked: true },
];

const FREELANCING_TRACK: RoadmapNode[] = [
  { id: 'fl-1', label: 'Portfolio', icon: '🎨', lessonIds: ['exp-portfolio-1'] },
  { id: 'fl-2', label: 'Clients', icon: '🤝', lessonIds: [], locked: true },
  { id: 'fl-3', label: 'Proposals', icon: '📝', lessonIds: [], locked: true },
  { id: 'fl-4', label: 'Pricing', icon: '💰', lessonIds: [], locked: true },
  { id: 'fl-5', label: 'Contracts', icon: '📃', lessonIds: [], locked: true },
  { id: 'fl-6', label: 'Communication', icon: '💬', lessonIds: [], locked: true },
  { id: 'fl-7', label: 'Time Mgmt', icon: '⏰', lessonIds: [], locked: true },
  { id: 'fl-8', label: 'Scale Up', icon: '📈', lessonIds: [], locked: true },
];

function getNodeStatus(node: RoadmapNode, completedLessons: string[]): 'locked' | 'completed' | 'available' | 'in-progress' {
  if (node.locked) return 'locked';
  if (node.lessonIds.length === 0) return 'locked';
  const completed = node.lessonIds.filter(id => completedLessons.includes(id)).length;
  if (completed === node.lessonIds.length) return 'completed';
  if (completed > 0) return 'in-progress';
  return 'available';
}

function HexNode({ node, status, onClick }: { node: RoadmapNode; status: string; onClick: () => void }) {
  const colors = {
    completed: 'bg-primary/15 border-primary/40 neon-border',
    'in-progress': 'bg-primary/8 border-primary/25',
    available: 'bg-secondary/30 border-border/50 hover:border-primary/20',
    locked: 'bg-secondary/10 border-border/20 opacity-40 cursor-not-allowed',
  };

  return (
    <button
      onClick={status !== 'locked' ? onClick : undefined}
      className={`relative w-[72px] h-[72px] rounded-2xl flex flex-col items-center justify-center gap-0.5 border-2 transition-all ${colors[status as keyof typeof colors]}`}
      style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
    >
      <span className="text-lg">{status === 'locked' ? '🔒' : node.icon}</span>
      <span className={`text-[7px] font-mono font-bold leading-tight text-center px-1 ${
        status === 'completed' ? 'text-primary' : status === 'locked' ? 'text-muted-foreground' : 'text-foreground'
      }`}>{node.label}</span>
      {status === 'completed' && (
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
          <Check className="w-2.5 h-2.5 text-primary-foreground" />
        </div>
      )}
    </button>
  );
}

function SnakePath({ nodes, completedLessons, onNodeClick }: {
  nodes: RoadmapNode[];
  completedLessons: string[];
  onNodeClick: (node: RoadmapNode) => void;
}) {
  const cols = 4;
  const rows: RoadmapNode[][] = [];
  for (let i = 0; i < nodes.length; i += cols) {
    const row = nodes.slice(i, i + cols);
    // Reverse every odd row for snake effect
    if (Math.floor(i / cols) % 2 === 1) row.reverse();
    rows.push(row);
  }

  return (
    <div className="space-y-2">
      {rows.map((row, ri) => (
        <div key={ri} className="flex items-center justify-center gap-2">
          {row.map((node, ni) => {
            const status = getNodeStatus(node, completedLessons);
            return (
              <div key={node.id} className="flex items-center gap-1">
                <HexNode node={node} status={status} onClick={() => onNodeClick(node)} />
                {ni < row.length - 1 && (
                  <div className={`w-3 h-[2px] ${
                    status === 'completed' ? 'bg-primary/40' : 'bg-border/30'
                  }`} />
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

const Roadmap = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  if (!user) { navigate('/auth'); return null; }

  const completedLessons = user.completedLessons;

  const handleNodeClick = (node: RoadmapNode) => {
    if (node.lessonIds.length > 0) {
      // Find first incomplete lesson in this node
      const firstIncomplete = node.lessonIds.find(id => !completedLessons.includes(id));
      if (firstIncomplete) {
        navigate(`/lesson/${firstIncomplete}`);
      } else {
        navigate(`/lesson/${node.lessonIds[0]}`);
      }
    }
  };

  const tracks = [
    { label: 'Frontend Development', color: 'text-primary', nodes: FRONTEND_TRACK, icon: '📱' },
    { label: 'Networking', color: 'text-info', nodes: NETWORKING_TRACK, icon: '🌐' },
    { label: 'Freelancing', color: 'text-warning', nodes: FREELANCING_TRACK, icon: '💼' },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden ambient-grid">
      <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-primary/4 blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto p-4 sm:p-6 space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/dashboard')} className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold font-mono">
              <span className="text-primary neon-text">Roadmap</span>
            </h1>
          </div>
          <div className="flex items-center gap-2 bg-card/60 px-3 py-1.5 rounded-xl border border-border/40">
            <Flame className="w-3.5 h-3.5 text-primary" />
            <span className="font-bold text-xs text-primary font-mono">{user.streakCount}</span>
          </div>
        </div>

        {tracks.map(track => {
          const totalNodes = track.nodes.filter(n => !n.locked).length;
          const completedNodes = track.nodes.filter(n => getNodeStatus(n, completedLessons) === 'completed').length;
          const progress = totalNodes > 0 ? Math.round((completedNodes / totalNodes) * 100) : 0;

          return (
            <div key={track.label} className="glass-card rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className={`text-sm font-bold font-mono flex items-center gap-2 ${track.color}`}>
                  <span className="text-lg">{track.icon}</span>
                  {track.label}
                </h2>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${progress}%` }} />
                  </div>
                  <span className="text-[10px] text-muted-foreground font-mono">{progress}%</span>
                </div>
              </div>

              <SnakePath
                nodes={track.nodes}
                completedLessons={completedLessons}
                onNodeClick={handleNodeClick}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Roadmap;
