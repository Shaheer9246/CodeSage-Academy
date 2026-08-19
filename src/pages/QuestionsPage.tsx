import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext'; // Adjust path if needed
import { 
  ArrowLeft, CheckCircle2, XCircle, RotateCcw, Award, Target, BookOpen, 
  ChevronRight, Flag, Check, Zap, Terminal, ShieldAlert 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- COMPONENTS ---
import { ExamCard } from '@/components/ExamCard'; // Adjust path
import { Navigator } from '@/components/Navigator'; // Adjust path

// --- DATA TRACKS ---
import { pythonTrack } from '@/data/exams/python';
import { sqlTrack } from '@/data/exams/sql';
import { fundamentalsTrack } from '@/data/exams/fundamentals';
import { aiTrack } from '@/data/exams/ai';
import { frontendTrack } from '@/data/exams/frontend';
import { javaTrack } from '@/data/exams/java';
import { ExamTrack, Question } from '@/data/exams/python'; // Shared interfaces

const ALL_TRACKS: ExamTrack[] = [
  pythonTrack,
  javaTrack,
  sqlTrack,
  fundamentalsTrack,
  aiTrack,
  frontendTrack
];

// --- TYPES & CONFIG ---
type Mode = 'menu' | 'exam' | 'result';
interface AnswerState {
  chosen: number | null;
  confirmed: boolean;
  review: boolean;
}

const EXAM_SECONDS_PER_Q = 30;
const QUESTIONS_PER_EXAM = 10; // Number of questions to draw from the bank

const QuestionsPage = () => {
  const { user, completeTest } = useUser();
  const navigate = useNavigate();
  
  // App State
  const [mode, setMode] = useState<Mode>('menu');
  const [selectedTrack, setSelectedTrack] = useState<ExamTrack | null>(null);
  
  // Exam State
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [examState, setExamState] = useState<Record<number, AnswerState>>({});
  const [secondsLeft, setSecondsLeft] = useState(0);
  const timerRef = useRef<number | null>(null);

    const finishExam = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    
    // Calculate if the user passed (>= 70%)
    const total = questions.length;
    const correctCount = total > 0 ? questions.reduce((acc, q, i) => acc + (examState[i]?.chosen === q.answer ? 1 : 0), 0) : 0;
    const passed = total > 0 && Math.round((correctCount / total) * 100) >= 70;

    // If passed, securely record the test completion (awards XP/Coins via UserContext)
    if (passed && selectedTrack) {
      completeTest(selectedTrack.id);
    }
    
    setMode('result');
  }, [questions, examState, selectedTrack, completeTest]);

  useEffect(() => {
    if (mode !== 'exam') return;
    timerRef.current = window.setInterval(() => {
      setSecondsLeft(s => {
        if (s <= 1) { finishExam(); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [mode, finishExam]);

  const restart = () => { 
    setMode('menu'); 
    setExamState({}); 
    setCurrentQ(0); 
    setSelectedTrack(null);
  };

  const startExam = (track: ExamTrack) => {
    // Shuffle and pick a subset for the exam instance
    const qs = [...track.questions]
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.min(QUESTIONS_PER_EXAM, track.questions.length)); 
    
    if (qs.length === 0) return;
    
    setSelectedTrack(track);
    setQuestions(qs);
    setCurrentQ(0);
    
    // Initialize exam state for all selected questions
    const initialState: Record<number, AnswerState> = {};
    qs.forEach((_, i) => {
      initialState[i] = { chosen: null, confirmed: false, review: false };
    });
    setExamState(initialState);
    
    setSecondsLeft(qs.length * EXAM_SECONDS_PER_Q);
    setMode('exam');
  };

  const handleSelectOption = (optIdx: number) => {
    if (examState[currentQ]?.confirmed) return; // Prevent changing if already confirmed
    setExamState(prev => ({
      ...prev,
      [currentQ]: { ...prev[currentQ], chosen: optIdx }
    }));
  };

  const handleConfirm = () => {
    setExamState(prev => ({
      ...prev,
      [currentQ]: { ...prev[currentQ], confirmed: true }
    }));
  };

  const toggleReview = () => {
    setExamState(prev => ({
      ...prev,
      [currentQ]: { ...prev[currentQ], review: !prev[currentQ].review }
    }));
  };

  const nextQ = () => {
    if (currentQ + 1 < questions.length) setCurrentQ(currentQ + 1);
  };

  if (!user) { navigate('/auth'); return null; }

  // ===================== LOBBY / MENU (Futuristic Grid) =====================
  if (mode === 'menu') {
    return (
      <div className="min-h-screen bg-[#050505] text-slate-300 p-4 md:p-8 relative overflow-hidden font-sans">
        {/* Ambient Futuristic Background Glows */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-600/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto space-y-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 border-b border-white/10 pb-6"
          >
            <button onClick={() => navigate('/dashboard')} className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-cyan-400 transition-colors border border-white/5">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
             <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 tracking-tight">
             NEURAL_ASSESSMENT_SYSTEM
              </h1>
              <p className="text-sm font-mono text-slate-400 flex items-center gap-2 mt-1">
                <Terminal className="w-4 h-4" /> Initialize certification matrix.
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial="hidden" animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
            }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {ALL_TRACKS.map((track) => (
              <motion.div key={track.id} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                <ExamCard track={track} onStart={startExam} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    );
  }

  // ===================== EXAM VIEW (Command Center) =====================
  if (mode === 'exam' && selectedTrack) {
    const q = questions[currentQ];
    const qState = examState[currentQ];

    return (
      <div className="min-h-screen bg-[#050505] text-slate-300 p-3 sm:p-4 md:p-6 flex flex-col lg:flex-row gap-4 md:gap-6 max-w-[1400px] mx-auto relative overflow-hidden">
        {/* Tech Grid Background Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

        {/* Sidebar Navigator */}
        <div className="relative z-10 w-full lg:w-80">
          <Navigator 
            questions={questions}
            currentQ={currentQ}
            setCurrentQ={setCurrentQ}
            examState={examState}
            trackTitle={selectedTrack.title}
            secondsLeft={secondsLeft}
            onFinishExam={finishExam}
          />
        </div>

        {/* Main Question Display */}
        <div className="flex-1 relative z-10 flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div 
  key={currentQ} 
  initial={{ x: 20, opacity: 0, filter: 'blur(4px)' }} 
  animate={{ x: 0, opacity: 1, filter: 'blur(0px)' }} 
  exit={{ x: -20, opacity: 0, filter: 'blur(4px)' }}
  transition={{ duration: 0.3 }}
  className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-4 sm:p-6 md:p-10 flex-1 flex flex-col shadow-[0_0_30px_rgba(0,0,0,0.5)]"
>
  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-6 md:mb-8 gap-4">
    <div>
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <span className="px-3 py-1 rounded-md bg-cyan-950/50 border border-cyan-800/50 text-cyan-400 font-mono text-[10px] uppercase tracking-widest flex items-center gap-1.5">
                      <Zap className="w-3 h-3" /> {q.topic}
                    </span>
                    <span className={`px-3 py-1 rounded-md font-mono text-[10px] uppercase tracking-widest border ${
                      q.difficulty === 'Hard' ? 'bg-purple-950/50 border-purple-800/50 text-purple-400' :
                      q.difficulty === 'Intermediate' ? 'bg-amber-950/50 border-amber-800/50 text-amber-400' :
                      'bg-emerald-950/50 border-emerald-800/50 text-emerald-400'
                    }`}>
                      {q.difficulty}
                    </span>
                  </div>
                  <h2 className="text-xl md:text-2xl font-semibold text-white leading-relaxed">
                    <span className="text-cyan-500 mr-2">{currentQ + 1}.</span> {q.q}
                  </h2>
                </div>
                
                <button onClick={toggleReview} className={`p-2.5 rounded-xl transition-all flex gap-2 items-center text-xs font-mono tracking-wider border self-start sm:self-auto flex-shrink-0 ${qState.review ? 'bg-amber-500/10 border-amber-500/50 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'}`}>
  <Flag className="w-4 h-4" />
  <span>{qState.review ? 'FLAGGED' : 'FLAG FOR REVIEW'}</span>
</button>
              </div>

              <div className="space-y-4 flex-1">
                {q.options.map((opt, i) => {
                  const isPicked = qState.chosen === i;
                  return (
                    <button 
                      key={i} 
                      onClick={() => handleSelectOption(i)}
                      disabled={qState.confirmed}
                      className={`w-full text-left px-4 py-3.5 sm:px-6 sm:py-5 rounded-xl text-xs sm:text-sm md:text-base font-medium transition-all border relative overflow-hidden group ${
                        isPicked 
                          ? 'bg-cyan-950/30 border-cyan-500 text-white shadow-[0_0_20px_rgba(6,182,212,0.15)]' 
                          : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20'
                      } ${qState.confirmed && !isPicked ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {/* Active Selector Indicator */}
                      {isPicked && <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]" />}
                      
                      <span className={`mr-4 font-mono ${isPicked ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-400'}`}>
                        {String.fromCharCode(65 + i)}.
                      </span>
                      {opt}
                    </button>
                  );
                })}
              </div>

            
             {/* Action Footer */}
<div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-[#050505]/50 -mx-4 -mb-4 px-4 py-4 sm:-mx-6 sm:-mb-6 sm:px-6 md:-mx-10 md:-mb-10 md:px-10 md:py-6 rounded-b-2xl">
  <div className="text-xs font-mono text-center sm:text-left">
    {qState.confirmed ? (
      <span className="flex items-center justify-center sm:justify-start gap-2 text-emerald-400"><CheckCircle2 className="w-4 h-4" /> DATA_LOCKED</span>
    ) : (
      <span className="text-slate-500 flex items-center justify-center sm:justify-start gap-2"><Terminal className="w-4 h-4" /> AWAITING_INPUT...</span>
    )}
  </div>
  
  <div className="flex gap-4 w-full sm:w-auto">
    {!qState.confirmed ? (
      <button 
        onClick={handleConfirm} 
        disabled={qState.chosen === null}
        className="w-full sm:w-auto justify-center bg-cyan-500 hover:bg-cyan-400 text-black px-6 sm:px-8 py-3 rounded-xl text-sm font-bold tracking-wider disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)]"
      >
        <Check className="w-4 h-4" /> CONFIRM
      </button>
    ) : (
      <button 
        onClick={currentQ + 1 < questions.length ? nextQ : finishExam}
        className="w-full sm:w-auto justify-center bg-white hover:bg-slate-200 text-black px-6 sm:px-8 py-3 rounded-xl text-sm font-bold tracking-wider flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]"
      >
        {currentQ + 1 < questions.length ? 'NEXT_QUERY' : 'FINISH_EXAM'} <ChevronRight className="w-4 h-4" />
      </button>
    )}
  </div>
</div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    );
  }

  // ===================== RESULT VIEW (Aftermath) =====================
  const total = questions.length;
  const correctCount = questions.reduce((acc, q, i) => acc + (examState[i]?.chosen === q.answer ? 1 : 0), 0);
  const pct = Math.round((correctCount / total) * 100);
  const passed = pct >= 70;

  const missed = questions.map((q, i) => ({ q, state: examState[i] || { chosen: null }, idx: i })).filter(item => item.state.chosen !== item.q.answer);

  return (
    <div className="min-h-screen bg-[#050505] text-slate-300 p-4 md:p-8 relative overflow-hidden font-sans">
      <div className={`absolute top-[-20%] left-[30%] w-[40%] h-[40%] blur-[150px] rounded-full pointer-events-none ${passed ? 'bg-emerald-600/20' : 'bg-red-600/20'}`} />
      
      <div className="max-w-3xl mx-auto space-y-6 relative z-10">
        {/* Score Card */}
        <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 md:p-12 text-center relative overflow-hidden shadow-2xl">
  <div className={`absolute top-0 left-0 w-full h-1 ${passed ? 'bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,1)]' : 'bg-red-500 shadow-[0_0_20px_rgba(239,68,68,1)]'}`} />
  
  {passed ? (
    <Award className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-emerald-400 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
  ) : (
    <ShieldAlert className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-red-400 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
  )}
  
  <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-2 tracking-tight">
    {passed ? 'ASSESSMENT_CLEARED' : 'SYSTEM_FAILURE'}
  </h2>
  <p className="text-xs sm:text-sm font-mono text-slate-400 mb-6 sm:mb-8 uppercase tracking-widest">{selectedTrack?.title}</p>
  
  <div className="flex justify-center items-end gap-2 mb-6">
    <span className={`text-5xl sm:text-7xl font-bold font-mono leading-none ${passed ? 'text-emerald-400' : 'text-red-400'}`}>
      {correctCount}
    </span>
    <span className="text-2xl sm:text-3xl font-mono text-slate-500 mb-1">/ {total}</span>
  </div>
  
  <span className={`inline-block px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-mono tracking-widest border ${
            passed 
              ? 'bg-emerald-950/50 text-emerald-400 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]' 
              : 'bg-red-950/50 text-red-400 border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
          }`}>
            {pct}% ACCURACY · REQUIREMENT: 70%
          </span>
        </div>

        {/* Missed Logs */}
        {missed.length > 0 && (
          <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8">
            <h3 className="text-lg font-bold text-white flex items-center gap-3 mb-6">
              <BookOpen className="w-5 h-5 text-cyan-400" /> 
              ERROR_LOGS ({missed.length})
            </h3>
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-4 custom-scrollbar">
              {missed.map(({ q, state, idx }) => (
                <div key={idx} className="bg-white/5 rounded-2xl p-5 border border-white/5 hover:bg-white/10 transition-colors">
                  <div className="flex gap-2 mb-3">
                    <span className="text-[10px] text-cyan-500 font-mono uppercase tracking-wider border border-cyan-500/30 px-2 py-0.5 rounded bg-cyan-950/30">
                      {q.topic}
                    </span>
                  </div>
                  <p className="text-base font-medium text-white mb-4">{q.q}</p>
                  
                  <div className="space-y-3 font-mono text-xs md:text-sm bg-black/50 p-4 rounded-xl border border-white/5">
                    <div className="flex items-start gap-3 text-red-400">
                      <XCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span><span className="opacity-50">INPUT:</span> {state.chosen !== null ? q.options[state.chosen] : 'NULL (OUT OF TIME/SKIPPED)'}</span>
                    </div>
                    <div className="flex items-start gap-3 text-emerald-400">
                      <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span><span className="opacity-50">VALID:</span> {q.options[q.answer]}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <button 
            onClick={restart} 
            className="flex-1 bg-white/5 border border-white/10 hover:bg-white/10 text-white py-4 rounded-xl text-sm font-bold tracking-widest flex items-center justify-center gap-2 transition-all font-mono"
          >
            <RotateCcw className="w-4 h-4" /> REBOOT_EXAM
          </button>
          <button 
            onClick={() => navigate('/dashboard')} 
            className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-black py-4 rounded-xl text-sm font-bold tracking-widest transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] font-mono"
          >
            EXIT_SYSTEM
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionsPage;
