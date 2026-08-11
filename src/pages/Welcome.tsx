import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Code2, Rocket, BookOpen, Wifi, Briefcase, Terminal, Compass, 
  Database, Box, Cpu, Coffee, Layers 
} from 'lucide-react';

/**
 * ==============================================================================
 * SYSTEM_CONFIG: Typed curriculum modules
 * ==============================================================================
 */
interface Module {
  icon: React.ElementType;
  title: string;
  desc: string;
  tag: string;
  color: string; // Tailwind classes for text/border/bg
}

const CURRICULUM_MODULES: Module[] = [
  { 
    icon: Code2, 
    title: 'Frontend Engineering', 
    desc: 'React, Next.js, DOM Architecture', 
    tag: 'WEB', 
    color: 'text-cyan-400 border-cyan-400/30 bg-cyan-400/5' 
  },
  { 
    icon: Box, 
    title: '3D Web & Graphics', 
    desc: 'Three.js, WebGL, React Three Fiber, Shaders', 
    tag: '3D', 
    color: 'text-pink-400 border-pink-400/30 bg-pink-400/5' 
  },
  { 
    icon: Coffee, 
    title: 'Enterprise Java', 
    desc: 'Core Java, Spring Boot, OOP Architecture', 
    tag: 'JVM', 
    color: 'text-orange-400 border-orange-400/30 bg-orange-400/5' 
  },
  { 
    icon: Cpu, 
    title: 'Systems & C++', 
    desc: 'Memory management, DSA, Performance tuning', 
    tag: 'SYS', 
    color: 'text-blue-400 border-blue-400/30 bg-blue-400/5' 
  },
  { 
    icon: Database, 
    title: 'Database & SQL', 
    desc: 'Relational design, Complex queries, Optimization', 
    tag: 'DATA', 
    color: 'text-emerald-400 border-emerald-400/30 bg-emerald-400/5' 
  },
  { 
    icon: Wifi, 
    title: 'Network Protocols', 
    desc: 'TCP/IP, DNS, HTTP/3, Cybersecurity basics', 
    tag: 'NET', 
    color: 'text-violet-400 border-violet-400/30 bg-violet-400/5' 
  },
  { 
    icon: Briefcase, 
    title: 'Dev Career & Freelance', 
    desc: 'Git workflows, System Design, Client comms', 
    tag: 'PRO', 
    color: 'text-amber-400 border-amber-400/30 bg-amber-400/5' 
  },
  { 
    icon: Layers, 
    title: 'Python & Automation', 
    desc: 'Scripting, Backend logic, Local-only execution', 
    tag: 'PY', 
    color: 'text-yellow-400 border-yellow-400/30 bg-yellow-400/5' 
  },
];

/**
 * ==============================================================================
 * useAuthRedirect: Headless hook for session validation
 * ==============================================================================
 */
function useAuthRedirect() {
  const navigate = useNavigate();
  const { isLoggedIn, loading } = useUser();

  useEffect(() => {
    if (!loading && isLoggedIn) {
      navigate('/dashboard', { replace: true });
    }
  }, [loading, isLoggedIn, navigate]);

  return { loading };
}

/**
 * ==============================================================================
 * BootSequence: Elegant loading state
 * ==============================================================================
 */
const BootSequence = () => (
  <div className="min-h-screen bg-background flex items-center justify-center font-mono text-emerald-400">
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="flex items-center gap-2"
    >
      <Terminal className="w-5 h-5 animate-pulse" />
      <span>Initializing CodeSage Environment...</span>
    </motion.div>
  </div>
);

/**
 * ==============================================================================
 * Welcome: Main Landing Component
 * ==============================================================================
 */
const Welcome = () => {
  const { loading } = useAuthRedirect();
  const navigate = useNavigate();

  if (loading) return <BootSequence />;

  // Animation variants for staggered entry
  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Engineering Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      
      {/* Subtle Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="relative z-10 max-w-5xl mx-auto px-5 py-8 min-h-screen flex flex-col"
      >
        {/* Header */}
        <motion.header variants={itemVariants} className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-black border border-emerald-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.15)]">
              <Terminal className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="font-display font-bold text-lg tracking-tight text-foreground">CodeSage</span>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-[11px] font-mono text-muted-foreground">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            <span>ENV: <span className="text-emerald-400">LOCAL_SANDBOX</span></span>
          </div>
        </motion.header>

        {/* Hero Section */}
        <div className="flex-1 flex flex-col lg:flex-row gap-12 items-center">
          <div className="flex-1 max-w-xl">
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 text-[11px] font-mono text-emerald-400 bg-emerald-400/5 border border-emerald-400/20 px-3 py-1.5 rounded-full mb-6 backdrop-blur-sm">
              <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              OPEN_SOURCE // 100% FREE FOR STUDENTS
            </motion.div>

            <motion.h1 variants={itemVariants} className="font-display text-4xl sm:text-5xl font-bold tracking-tight mb-4 text-foreground leading-[1.1]">
              Master the <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">stack</span>.
              <br />
              <span className="text-muted-foreground">Zero tuition. Local execution.</span>
            </motion.h1>

            <motion.p variants={itemVariants} className="text-base text-muted-foreground leading-relaxed mb-8 max-w-md">
              A comprehensive engineering environment. Learn systems, frontend, 3D graphics, and networking through interactive, bite-sized terminal sessions.
            </motion.p>

            {/* Action Buttons */}
            <motion.div variants={itemVariants} className="space-y-3">
              <button
                onClick={() => navigate('/auth')}
                className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-bold text-sm px-8 py-3.5 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:scale-[1.02] transition-all flex items-center justify-center gap-3 group"
              >
                <span className="font-mono text-xs opacity-70 group-hover:opacity-100 transition-opacity">~/ $</span>
                <span>Start Building</span>
                <Rocket className="w-4 h-4 ml-auto" />
              </button>

              <div className="flex gap-3">
                <button
                  onClick={() => navigate('/playground')}
                  className="flex-1 glass-card border border-border/50 text-foreground font-semibold text-sm py-3 rounded-xl hover:border-cyan-500/40 hover:text-cyan-400 transition-all flex items-center justify-center gap-2"
                >
                  <Code2 className="w-4 h-4" /> Instant Sandbox
                </button>
                <button
                  onClick={() => navigate('/trip')}
                  className="flex-1 bg-transparent border border-border/50 text-foreground font-semibold text-sm py-3 rounded-xl hover:border-violet-500/40 hover:text-violet-400 transition-all flex items-center justify-center gap-2"
                >
                  <Compass className="w-4 h-4" /> Demo Lesson ⚡
                </button>
              </div>
            </motion.div>
          </div>

          {/* Tech Stack Grid (The "Modules") */}
          <motion.div variants={itemVariants} className="flex-1 w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {CURRICULUM_MODULES.map((mod, i) => (
                <motion.div
                  key={mod.tag}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + (i * 0.05) }}
                  className="glass-card border border-border/40 p-4 rounded-xl hover:border-primary/40 hover:bg-white/[0.02] transition-all group cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className={`w-8 h-8 rounded-lg border ${mod.color} flex items-center justify-center`}>
                      <mod.icon className="w-4 h-4" />
                    </div>
                    <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${mod.color}`}>
                      {mod.tag}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-foreground mb-1 group-hover:text-primary transition-colors">
                    {mod.title}
                  </h3>
                  <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
                    {mod.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.footer variants={itemVariants} className="mt-12 pt-8 border-t border-border/30">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-muted-foreground/60">
            <p>No credit card · No subscriptions · Open for everyone</p>
            <div className="flex items-center gap-4">
              <button onClick={() => navigate('/privacy')} className="hover:text-primary transition-colors">
                Privacy &amp; Terms
              </button>
              <span className="text-border">|</span>
              <button onClick={() => navigate('/contact')} className="hover:text-primary transition-colors">
                Contact SysAdmin
              </button>
            </div>
          </div>
        </motion.footer>
      </motion.div>
    </div>
  );
};

export default Welcome;
