import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * ==============================================================================
 * SYSTEM_LOGS: Hacker/Cyberpunk themed motivational directives
 * ==============================================================================
 */
const SYSTEM_LOGS = [
  "> CONSISTENCY.EXE > Transforms average into excellence.",
  "> DELTA_UPDATES > Small daily patches compile to stunning results.",
  "> OVERRIDE_TARGET > Focus on progress. Perfection is a trap.",
  "> INIT_SEQUENCE > The secret of getting ahead is getting started.",
  "> FUTURE_SELF.SYS > Acknowledging today's effort...",
  "> SKILL_TREE.SYS > Daily commits detected. Upgrading capabilities..."
];

/**
 * ==============================================================================
 * useStreakMonitor: Headless UI hook for streak tracking and modal state
 * ==============================================================================
 */
interface UseStreakMonitorReturn {
  isOpen: boolean;
  activeLog: string;
  todayIdx: number;
  daysOfWeek: string[];
  terminateProcess: () => void;
}

function useStreakMonitor(): UseStreakMonitorReturn {
  const [isOpen, setIsOpen] = useState(false);
  const [activeLog, setActiveLog] = useState('');
  
  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const todayIdx = new Date().getDay();

  const bootSequence = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    const lastAccess = localStorage.getItem('codesage_sys_access_log');

    if (lastAccess !== today) {
      const randomLog = SYSTEM_LOGS[Math.floor(Math.random() * SYSTEM_LOGS.length)];
      setActiveLog(randomLog);
      setIsOpen(true);
      localStorage.setItem('codesage_sys_access_log', today);
    }
  }, []);

  useEffect(() => {
    bootSequence();
  }, [bootSequence]);

  const terminateProcess = useCallback(() => setIsOpen(false), []);

  return { isOpen, activeLog, todayIdx, daysOfWeek, terminateProcess };
}

/**
 * ==============================================================================
 * StreakModal: CRT Terminal UI Component
 * ==============================================================================
 */
interface StreakModalProps {
  streakCount: number;
}

export function StreakModal({ streakCount }: StreakModalProps) {
  const { isOpen, activeLog, todayIdx, daysOfWeek, terminateProcess } = useStreakMonitor();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4">
        <motion.div
          initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="relative w-full max-w-md bg-black border border-green-500/40 shadow-[0_0_40px_rgba(34,197,94,0.15)] rounded-sm overflow-hidden font-mono text-green-400"
        >
          {/* CRT Scanlines & RGB Sub-pixel Overlay */}
          <div 
            className="pointer-events-none absolute inset-0 z-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_3px,4px_100%] opacity-40"
            aria-hidden="true"
          />
          {/* CRT Vignette / Screen Glow */}
          <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-b from-transparent via-green-500/5 to-black/40" aria-hidden="true" />

          {/* Terminal Header Bar */}
          <div className="flex items-center justify-between px-3 py-2 bg-green-500/10 border-b border-green-500/40 text-[10px] tracking-widest text-green-300 uppercase relative z-30">
            <span>bash-5.1$ ./streak_monitor.sh</span>
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 hover:bg-red-400 cursor-pointer" onClick={terminateProcess} title="SIGKILL" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
            </div>
          </div>

          {/* Main Terminal Content */}
          <div className="p-6 relative z-30">
            {/* Command Prompt Intro */}
            <div className="mb-4 text-xs opacity-80">
              <span className="text-cyan-400">root@codesage</span>:<span className="text-purple-400">~/user/streaks</span>$ cat current_status.log
            </div>

            {/* Header Status */}
            <motion.h2
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl font-bold text-green-400 mb-1 tracking-tight"
              style={{ textShadow: '0 0 8px rgba(34,197,94,0.8)' }}
            >
              [ACCESS GRANTED] STREAK LVL: <span className="text-yellow-400" style={{ textShadow: '0 0 8px rgba(250,204,21,0.8)' }}>{String(streakCount).padStart(2, '0')}</span>
            </motion.h2>
            
            <p className="text-[10px] text-green-500/70 mb-6 uppercase tracking-widest">
              &gt; Uptime maintained. System operational.
            </p>

            {/* System Log (Quote) */}
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="bg-green-500/5 border border-green-500/30 p-4 mb-6 relative"
            >
              <div className="absolute top-2 right-2 text-[9px] text-green-500/50 tracking-wider">SYS.LOG</div>
              <p className="text-sm text-green-300 leading-relaxed pr-8">
                <span className="text-green-500 mr-1">$</span> {activeLog}
                <motion.span 
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ repeat: Infinity, duration: 0.8 }}
                  className="inline-block w-2 h-4 bg-green-400 ml-1 align-middle" 
                />
              </p>
            </motion.div>

            {/* Cycle Map (7-Day Progress) */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3 border-b border-green-500/20 pb-1">
                <p className="text-[10px] uppercase tracking-widest text-cyan-400/80">
                  [ SECTOR MAP: LAST 7 CYCLES ]
                </p>
                <p className="text-[10px] text-green-500/50">MEM_DUMP</p>
              </div>
              <div className="grid grid-cols-7 gap-2 text-center text-[10px]">
                {daysOfWeek.map((day, i) => {
                  const isActive = i <= todayIdx && i >= todayIdx - Math.min(streakCount - 1, todayIdx);
                  const isToday = i === todayIdx;

                  return (
                    <div key={i} className="flex flex-col items-center gap-1.5">
                      <span className={`font-bold ${isToday ? 'text-yellow-400' : 'text-green-500/60'}`}>{day}</span>
                      <div
                        className={`w-9 h-9 flex items-center justify-center border transition-all ${
                          isToday
                            ? 'border-yellow-400 bg-yellow-400/20 text-yellow-400 shadow-[0_0_12px_rgba(250,204,21,0.4)]'
                            : isActive
                            ? 'border-green-500 bg-green-500/20 text-green-400 shadow-[0_0_10px_rgba(34,197,94,0.3)]'
                            : 'border-green-500/30 bg-black text-green-500/20'
                        }`}
                      >
                        {isActive ? (
                          <span className="text-xs font-bold tracking-tighter">{isToday ? '0x1' : '0x0'}</span>
                        ) : (
                          <span className="text-xs">---</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Execute Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={terminateProcess}
              className="w-full bg-green-500/10 border border-green-500 text-green-400 font-bold py-3 hover:bg-green-500 hover:text-black transition-all text-sm tracking-widest relative group overflow-hidden"
              style={{ textShadow: '0 0 5px rgba(34,197,94,0.5)' }}
            >
              <span className="relative z-10">&gt; EXECUTE: CONTINUE_CODING.sh</span>
              <div className="absolute inset-0 bg-green-400 opacity-0 group-hover:opacity-20 transition-opacity" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
