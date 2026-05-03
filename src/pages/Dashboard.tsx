import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { Flame, Trophy, Star, Sparkles, Code, ArrowRight, Lock, BookOpen, Zap, Target, Check } from 'lucide-react';
import { getAllLessons } from '@/data/lessons';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BADGE_DATA = [
  { id: 'html-hero', label: 'HTML Hero', icon: '🛡️', color: 'from-emerald-500 to-teal-600' },
  { id: 'js-jedi', label: 'JavaScript Jedi', icon: '⚡', color: 'from-yellow-500 to-orange-500' },
  { id: 'deploy-master', label: 'Deploy Master', icon: '🚀', color: 'from-blue-500 to-purple-600' },
  { id: 'security-guard', label: 'Security Guardian', icon: '🔒', color: 'from-amber-500 to-yellow-600' },
  { id: '100xp', label: '100XP Club', icon: '💯', color: 'from-gray-400 to-gray-500' },
];

const LOCKED_BADGES = [
  { id: 'l1', label: 'React Pro' }, { id: 'l2', label: 'API Master' },
  { id: 'l3', label: 'Git Guru' }, { id: 'l4', label: 'CSS Wizard' }, { id: 'l5', label: 'Full Stack' },
];

const MERN_ROADMAP = [
  { step: 1, label: 'Master Web Basics', icon: '🌐', color: 'bg-primary' },
  { step: 2, label: 'HTML/CSS Proficiency', icon: '📄', color: 'bg-primary' },
  { step: 3, label: 'Deep Dive into JavaScript', icon: '⚡', color: 'bg-primary' },
  { step: 4, label: 'Version Control with Git', icon: '🔀', color: 'bg-accent-orange' },
  { step: 5, label: 'Node.js for Server-Side', icon: '🟢', color: 'bg-accent-blue' },
  { step: 6, label: 'NPM for Package Management', icon: '📦', color: 'bg-accent-blue' },
  { step: 7, label: 'Express.js Framework', icon: '🚂', color: 'bg-muted' },
  { step: 8, label: 'MongoDB for Databases', icon: '🍃', color: 'bg-muted' },
];

const LEADERBOARD = [
  { name: 'You (Rank 23)', isYou: true },
  { name: '_ishan' },
  { name: 'username' },
  { name: 'movik' },
  { name: 'moxcder2' },
];

const DAILY_CHALLENGES = [
  { q: 'What is the difference between `==` and `===` in JavaScript?' },
  { q: 'What does CSS `position: sticky` do?' },
  { q: 'What is a closure in JavaScript?' },
  { q: 'What is the Virtual DOM in React?' },
  { q: 'What does `git rebase` do?' },
  { q: 'What is event bubbling in the DOM?' },
  { q: 'What is the difference between `let` and `var`?' },
];

const CODE_LINES = [
  'const app = express();',
  'import React from "react";',
  'function fibonacci(n) {',
  '  if (n <= 1) return n;',
  '  return fibonacci(n-1) + fibonacci(n-2);',
  '}',
  'app.listen(3000);',
  'const [state, setState] = useState();',
  'export default App;',
  'npm install express',
  'git commit -m "init"',
  'docker build -t app .',
];

const Dashboard = () => {
  const { user, updateStreak, applyPromoCode } = useUser();
  const navigate = useNavigate();
  const [promoInput, setPromoInput] = useState('');
  const [promoMsg, setPromoMsg] = useState('');

  useEffect(() => { if (user) updateStreak(); }, []);

  if (!user) { navigate('/auth'); return null; }
  if (!user.name) { navigate('/onboarding'); return null; }

  const totalLessons = getAllLessons().length;
  const completedCount = user.completedLessons.length;
  const progress = totalLessons ? Math.round((completedCount / totalLessons) * 100) : 0;
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  const dailyChallenge = DAILY_CHALLENGES[dayOfYear % DAILY_CHALLENGES.length];

  // Determine current MERN step
  const currentMernStep = Math.min(Math.floor(progress / 12.5) + 1, 8);
  const mernProgress = Math.min(progress * 1.25, 100);

  const handlePromo = () => {
    if (applyPromoCode(promoInput)) { setPromoMsg('✅ Code applied!'); setPromoInput(''); }
    else setPromoMsg('❌ Invalid code');
    setTimeout(() => setPromoMsg(''), 3000);
  };

  // 7-day streak calendar
  const today = new Date();
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const todayIdx = today.getDay();
  const streakDays = weekDays.map((day, i) => ({
    day,
    active: i <= todayIdx && i >= todayIdx - Math.min(user.streakCount, todayIdx),
    isToday: i === todayIdx,
  }));

  return (
    <div className="min-h-screen bg-background relative overflow-hidden grid-bg">
      {/* Code rain background */}
      <div className="code-rain">
        {CODE_LINES.map((line, i) => (
          <div key={i} style={{ paddingLeft: `${(i * 37) % 80}%`, opacity: 0.6 }}>{line}</div>
        ))}
      </div>

      {/* Ambient glow */}
      <div className="absolute top-[-15%] right-[-10%] w-[500px] h-[500px] rounded-full bg-primary/3 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-accent-blue/3 blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative z-10 max-w-5xl mx-auto p-4 sm:p-6 space-y-5"
      >
        {/* Header: Welcome + Streak */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
            <h1 className="text-2xl sm:text-3xl font-bold font-display">
              Welcome Back,<br />
              <span className="text-primary neon-text">{user.name}</span>
            </h1>
          </motion.div>

          {/* Streak Card */}
          <motion.div
            initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}
            className="glass-card p-4 min-w-[200px]"
          >
            <p className="text-xs text-primary/80 font-display font-semibold mb-1">Your Coding Streak</p>
            <div className="flex items-end gap-1 mb-2">
              <span className="text-4xl font-bold text-primary font-display neon-text">{user.streakCount}</span>
              <Flame className="w-6 h-6 text-accent-orange mb-1" />
              <span className="text-sm text-muted-foreground ml-1 mb-1">Days</span>
            </div>
            <div className="flex gap-1">
              {streakDays.map((d, i) => (
                <div key={i} className="flex flex-col items-center gap-0.5">
                  <span className="text-[8px] text-muted-foreground">{d.day}</span>
                  <div className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] ${
                    d.active ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-secondary/30 text-muted-foreground border border-border/20'
                  }`}>
                    {d.active ? <Check className="w-3 h-3" /> : ''}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Achievements */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold font-display">Achievements</h2>
            <span className="text-xs text-accent-orange font-mono">Longest Streak: <strong>{Math.max(user.streakCount, 3)} Days</strong></span>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {BADGE_DATA.map((badge, i) => (
              <motion.div
                key={badge.id}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 + i * 0.08 }}
                className="flex flex-col items-center gap-1 flex-shrink-0"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${badge.color} flex items-center justify-center text-2xl border border-white/10 shadow-lg`}>
                  {badge.icon}
                </div>
                <span className="text-[10px] text-muted-foreground font-medium text-center leading-tight w-16">{badge.label}</span>
              </motion.div>
            ))}
          </div>
          <div className="flex gap-3 mt-2 overflow-x-auto pb-2">
            {LOCKED_BADGES.map((badge) => (
              <div key={badge.id} className="flex flex-col items-center gap-1 flex-shrink-0 opacity-40">
                <div className="w-16 h-16 rounded-2xl bg-secondary/30 border border-border/30 flex items-center justify-center">
                  <Lock className="w-5 h-5 text-muted-foreground" />
                </div>
                <span className="text-[10px] text-muted-foreground font-medium text-center leading-tight w-16">{badge.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Main Grid: Roadmap + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* MERN Roadmap Progress */}
          <motion.div
            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}
            className="lg:col-span-3 glass-card p-5"
          >
            <h3 className="text-base font-bold font-display mb-4">Main MERN Roadmap Progress</h3>
            <div className="space-y-2.5">
              {MERN_ROADMAP.map((item) => {
                const isCompleted = item.step < currentMernStep;
                const isCurrent = item.step === currentMernStep;
                return (
                  <div key={item.step} className="flex items-center gap-3">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                      isCompleted || isCurrent ? 'bg-primary text-primary-foreground' : 'bg-secondary/40 text-muted-foreground'
                    }`}>
                      {item.step}
                    </div>
                    <span className="text-lg mr-1">{item.icon}</span>
                    <span className={`text-sm font-medium ${
                      isCompleted ? 'text-foreground' : isCurrent ? 'text-primary font-semibold' : 'text-muted-foreground'
                    }`}>{item.label}</span>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 pt-3 border-t border-border/20">
              <div className="h-2 bg-secondary/30 rounded-full overflow-hidden mb-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${mernProgress}%` }}
                  transition={{ duration: 1, delay: 0.8 }}
                  className="h-full bg-primary rounded-full neon-glow"
                />
              </div>
              <p className="text-sm">
                <span className="text-primary font-bold">{Math.round(mernProgress)}%</span>
                <span className="text-muted-foreground"> Complete</span>
              </p>
              <p className="text-xs text-muted-foreground">Next up: {MERN_ROADMAP[currentMernStep - 1]?.label || 'All done!'}</p>
            </div>
          </motion.div>

          {/* Right sidebar */}
          <div className="lg:col-span-2 space-y-4">
            {/* Community Leaderboard */}
            <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.6 }} className="glass-card p-4">
              <h3 className="text-sm font-bold font-display mb-3">Community Leaderboard</h3>
              <div className="space-y-2">
                {LEADERBOARD.map((p, i) => (
                  <div key={i} className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm ${
                    p.isYou ? 'bg-primary/10 text-primary border border-primary/20' : 'text-foreground'
                  }`}>
                    <div className="w-6 h-6 rounded-full bg-secondary/40 flex items-center justify-center text-[10px] font-bold border border-border/30">
                      {p.isYou ? '👤' : '🧑'}
                    </div>
                    <span className="font-medium text-xs">{p.name}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Daily Challenge */}
            <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.7 }} className="glass-card p-4">
              <h3 className="text-sm font-bold font-display mb-2">Daily Challenge</h3>
              <p className="text-xs text-muted-foreground mb-3">{dailyChallenge.q}</p>
              <button
                onClick={() => navigate('/challenges')}
                className="w-full text-xs bg-primary/10 text-primary px-3 py-2 rounded-lg hover:bg-primary/20 transition-colors font-display font-semibold border border-primary/20 neon-border"
              >
                Take Challenge
              </button>
            </motion.div>
          </div>
        </div>

        {/* Resume Core Learning */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.8 }} className="glass-card p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-bold font-display">Resume Core Learning</h3>
            <button onClick={() => navigate('/learn')} className="text-xs text-primary font-display font-semibold hover:underline">Continue →</button>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">{completedCount + 1}</div>
            <div>
              <p className="text-sm font-semibold text-primary">React.js</p>
              <p className="text-xs text-muted-foreground">Current lesson</p>
            </div>
          </div>
        </motion.div>

        {/* Promo Code */}
        <div className="glass-card p-4">
          <h3 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider font-mono">promo_code</h3>
          <div className="flex gap-2">
            <input value={promoInput} onChange={e => setPromoInput(e.target.value)} placeholder="ENTER_CODE"
              className="flex-1 bg-secondary/40 border border-border rounded-lg px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 font-mono" />
            <button onClick={handlePromo} className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-xs font-bold font-display hover:neon-glow transition-all">
              Apply
            </button>
          </div>
          {promoMsg && <p className="text-xs mt-2 font-mono">{promoMsg}</p>}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
