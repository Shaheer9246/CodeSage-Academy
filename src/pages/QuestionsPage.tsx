import { useState, useEffect, useRef, useCallback } from 'react';
import { useUser } from '@/contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, XCircle, RotateCcw, Clock, Award, Target, BookOpen, Play } from 'lucide-react';
import { motion } from 'framer-motion';

interface Question {
  q: string;
  options: string[];
  answer: number;
  topic: string;
}

const BANK: Question[] = [
  // Computer basics
  { topic: 'Computer Basics', q: 'What does CPU stand for?', options: ['Central Processing Unit', 'Computer Personal Unit', 'Central Program Utility', 'Core Processing Unit'], answer: 0 },
  { topic: 'Computer Basics', q: 'Which is an input device?', options: ['Monitor', 'Printer', 'Keyboard', 'Speaker'], answer: 2 },
  { topic: 'Computer Basics', q: 'What does RAM stand for?', options: ['Read Access Memory', 'Random Access Memory', 'Run App Memory', 'Rapid Access Module'], answer: 1 },
  { topic: 'Computer Basics', q: 'What is the brain of a computer?', options: ['RAM', 'Hard Drive', 'CPU', 'GPU'], answer: 2 },
  // Networking
  { topic: 'Networking', q: 'Which protocol browses the web?', options: ['FTP', 'SMTP', 'HTTP', 'SSH'], answer: 2 },
  { topic: 'Networking', q: 'How many layers does OSI have?', options: ['5', '6', '7', '4'], answer: 2 },
  { topic: 'Networking', q: 'Default HTTP port?', options: ['21', '22', '443', '80'], answer: 3 },
  { topic: 'Networking', q: 'What is localhost?', options: ['Remote server', 'Your own computer', 'Cloud service', 'Domain'], answer: 1 },
  { topic: 'Networking', q: 'DNS stands for?', options: ['Domain Name System', 'Digital Network Service', 'Data Name Server', 'Domain Network System'], answer: 0 },
  { topic: 'Networking', q: 'HTTPS is?', options: ['Insecure HTTP', 'Secure HTTP', 'File format', 'Server'], answer: 1 },
  // HTML
  { topic: 'HTML', q: 'Largest heading tag?', options: ['<heading>', '<h6>', '<h1>', '<head>'], answer: 2 },
  { topic: 'HTML', q: 'Tag that creates a link?', options: ['<link>', '<a>', '<href>', '<url>'], answer: 1 },
  { topic: 'HTML', q: 'The <img> tag needs?', options: ['href', 'src', 'link', 'url'], answer: 1 },
  { topic: 'HTML', q: 'Numbered list tag?', options: ['<ul>', '<nl>', '<ol>', '<list>'], answer: 2 },
  // CSS
  { topic: 'CSS', q: 'Property that changes background color?', options: ['bgcolor', 'background-color', 'color-background', 'bg-color'], answer: 1 },
  { topic: 'CSS', q: 'Select an element by ID?', options: ['.id', '#id', '*id', '@id'], answer: 1 },
  { topic: 'CSS', q: 'Which value hides an element?', options: ['hidden', 'none', 'invisible', 'collapse'], answer: 1 },
  { topic: 'CSS', q: 'Flexbox is?', options: ['JS library', 'CSS layout model', 'HTML tag', 'Browser'], answer: 1 },
  // JavaScript
  { topic: 'JavaScript', q: 'Declares a variable?', options: ['var', 'variable', 'v', 'dim'], answer: 0 },
  { topic: 'JavaScript', q: '=== does what?', options: ['Assignment', 'Strict equality', 'Loose equality', 'Not equal'], answer: 1 },
  { topic: 'JavaScript', q: 'JS comment syntax?', options: ['<!-- -->', '// x', '** x **', '## x'], answer: 1 },
  { topic: 'JavaScript', q: 'Print to console?', options: ['print()', 'console.log()', 'log()', 'echo()'], answer: 1 },
  // DOM
  { topic: 'DOM', q: 'DOM stands for?', options: ['CSS framework', 'Document Object Model', 'JS library', 'Server'], answer: 1 },
  { topic: 'DOM', q: 'Click event handler attribute?', options: ['onhover', 'onclick', 'onpress', 'ontouch'], answer: 1 },
  { topic: 'DOM', q: 'Selects first matching element?', options: ['queryAll', 'querySelector', 'findOne', 'select'], answer: 1 },
  // Git
  { topic: 'Git', q: 'Git is?', options: ['Language', 'Version control', 'Browser', 'CSS framework'], answer: 1 },
  { topic: 'Git', q: '"git commit" does?', options: ['Uploads', 'Saves snapshot', 'Deletes files', 'Creates branch'], answer: 1 },
  { topic: 'Git', q: 'A branch is?', options: ['Code copy', 'Separate dev line', 'A file', 'A commit'], answer: 1 },
  // React
  { topic: 'React', q: 'React is?', options: ['CSS framework', 'JS library for UI', 'Database', 'Server lang'], answer: 1 },
  { topic: 'React', q: 'State hook?', options: ['useEffect', 'useState', 'useRef', 'useMemo'], answer: 1 },
  { topic: 'React', q: 'Props are?', options: ['CSS props', 'Data passed to components', 'JS vars', 'HTML attrs'], answer: 1 },
  // APIs
  { topic: 'APIs', q: 'API stands for?', options: ['App Programming Interface', 'Application Programming Interface', 'Active Process Index', 'Auto Program Input'], answer: 1 },
  { topic: 'APIs', q: 'JSON stands for?', options: ['JavaScript Object Notation', 'Java Standard Object Naming', 'JS Online Node', 'JS Open Network'], answer: 0 },
  { topic: 'APIs', q: 'fetch() does?', options: ['Creates element', 'Makes HTTP requests', 'Styles pages', 'Manages state'], answer: 1 },
];

type Mode = 'menu' | 'exam' | 'result';
interface AnswerLog { qIdx: number; chosen: number; correct: boolean; }

const EXAM_LENGTHS = [10, 20, 30];
const EXAM_SECONDS_PER_Q = 30;

function pickQuestions(count: number, topic: string | 'All'): Question[] {
  const pool = topic === 'All' ? BANK : BANK.filter(q => q.topic === topic);
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

const ALL_TOPICS = Array.from(new Set(BANK.map(q => q.topic)));

const QuestionsPage = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>('menu');
  const [length, setLength] = useState(10);
  const [topic, setTopic] = useState<string | 'All'>('All');

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [logs, setLogs] = useState<AnswerLog[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const timerRef = useRef<number | null>(null);

  const finishExam = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setMode('result');
  }, []);

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

  const restart = () => { setMode('menu'); setLogs([]); setSelected(null); setCurrentQ(0); };

  const startExam = () => {
    const qs = pickQuestions(length, topic);
    if (qs.length === 0) return;
    setQuestions(qs);
    setCurrentQ(0);
    setLogs([]);
    setSelected(null);
    setSecondsLeft(qs.length * EXAM_SECONDS_PER_Q);
    setMode('exam');
  };

  const recordAnswer = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    const correct = idx === questions[currentQ].answer;
    setLogs(prev => [...prev, { qIdx: currentQ, chosen: idx, correct }]);
  };

  const nextQ = () => {
    if (currentQ + 1 >= questions.length) finishExam();
    else { setCurrentQ(currentQ + 1); setSelected(null); }
  };

  if (!user) { navigate('/auth'); return null; }

  // ===== MENU =====
  if (mode === 'menu') {
    return (
      <div className="min-h-screen bg-background grid-bg p-4">
        <div className="max-w-lg mx-auto space-y-4">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/dashboard')} className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold font-display text-foreground">Exam Simulator</h1>
              <p className="text-xs text-muted-foreground">Timed multiple-choice quizzes with deep results.</p>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-5 space-y-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Length</label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {EXAM_LENGTHS.map(n => (
                  <button key={n} onClick={() => setLength(n)}
                    className={`py-2.5 rounded-xl border text-sm font-semibold ${
                      length === n ? 'bg-primary/15 border-primary/40 text-primary' : 'bg-secondary/20 border-border/30 text-foreground'
                    }`}>
                    {n} questions
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-muted-foreground mt-2">Time limit: 30 seconds per question.</p>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Topic</label>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {(['All', ...ALL_TOPICS] as const).map(t => (
                  <button key={t} onClick={() => setTopic(t)}
                    className={`px-3 py-1 rounded-full text-[11px] font-semibold border ${
                      topic === t ? 'bg-primary/15 border-primary/40 text-primary' : 'bg-secondary/20 border-border/30 text-muted-foreground'
                    }`}>{t}</button>
                ))}
              </div>
            </div>

            <button onClick={startExam}
              className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90">
              <Play className="w-4 h-4" /> Start Exam
            </button>
          </div>

          <div className="glass-card rounded-2xl p-4 text-xs text-muted-foreground">
            <BookOpen className="w-4 h-4 text-primary mb-2" />
            Results show your score, accuracy by topic, and a review sheet of every question you missed.
          </div>
        </div>
      </div>
    );
  }

  // ===== EXAM =====
  if (mode === 'exam') {
    const q = questions[currentQ];
    const mm = Math.floor(secondsLeft / 60).toString().padStart(2, '0');
    const ss = (secondsLeft % 60).toString().padStart(2, '0');
    return (
      <div className="min-h-screen bg-background grid-bg p-4">
        <div className="max-w-lg mx-auto space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-mono">Question {currentQ + 1}/{questions.length}</span>
            <div className={`flex items-center gap-1.5 text-xs font-mono px-2 py-1 rounded-full ${secondsLeft < 30 ? 'bg-destructive/15 text-destructive' : 'bg-primary/10 text-primary'}`}>
              <Clock className="w-3.5 h-3.5" /> {mm}:{ss}
            </div>
          </div>

          <div className="flex gap-1">
            {questions.map((_, i) => (
              <div key={i} className={`flex-1 h-1 rounded-full ${
                i < currentQ ? 'bg-primary/40' : i === currentQ ? 'bg-primary' : 'bg-secondary/30'
              }`} />
            ))}
          </div>

          <motion.div key={currentQ} initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="glass-card p-5 rounded-2xl">
            <p className="text-[10px] text-primary mb-1 font-mono uppercase tracking-wider">{q.topic}</p>
            <p className="text-sm font-semibold text-foreground mb-4">{q.q}</p>
            <div className="space-y-2">
              {q.options.map((opt, i) => {
                const isCorrect = i === q.answer;
                const isPicked = selected === i;
                const showResult = selected !== null;
                return (
                  <button key={i} onClick={() => recordAnswer(i)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-xs font-medium transition-all border ${
                      showResult && isCorrect ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400' :
                      showResult && isPicked && !isCorrect ? 'bg-red-500/15 border-red-500/40 text-red-400' :
                      'bg-secondary/20 border-border/30 text-foreground hover:bg-secondary/40'
                    }`}>
                    <span className="mr-2 font-mono">{String.fromCharCode(65 + i)}.</span>{opt}
                    {showResult && isCorrect && <CheckCircle2 className="w-4 h-4 inline ml-2" />}
                    {showResult && isPicked && !isCorrect && <XCircle className="w-4 h-4 inline ml-2" />}
                  </button>
                );
              })}
            </div>
            {selected !== null && (
              <button onClick={nextQ}
                className="mt-4 w-full bg-primary text-primary-foreground py-2.5 rounded-xl text-sm font-semibold">
                {currentQ + 1 < questions.length ? 'Next' : 'See Results'}
              </button>
            )}
          </motion.div>
        </div>
      </div>
    );
  }

  // ===== RESULT =====
  const total = questions.length;
  const correct = logs.filter(l => l.correct).length;
  const pct = Math.round((correct / total) * 100);
  const passed = pct >= 70;

  const topicBreakdown: Record<string, { right: number; total: number }> = {};
  logs.forEach(l => {
    const t = questions[l.qIdx].topic;
    if (!topicBreakdown[t]) topicBreakdown[t] = { right: 0, total: 0 };
    topicBreakdown[t].total++;
    if (l.correct) topicBreakdown[t].right++;
  });

  const missed = logs.filter(l => !l.correct);

  return (
    <div className="min-h-screen bg-background grid-bg p-4">
      <div className="max-w-lg mx-auto space-y-4">
        <div className="glass-card rounded-2xl p-6 text-center">
          <Award className={`w-10 h-10 mx-auto mb-2 ${passed ? 'text-emerald-400' : 'text-warning'}`} />
          <h2 className="text-2xl font-bold font-display text-foreground">{passed ? 'Passed!' : 'Keep studying'}</h2>
          <p className="text-4xl font-bold text-primary mt-2 font-mono">{correct}/{total}</p>
          <p className="text-xs text-muted-foreground mt-1">{pct}% accuracy</p>
          <span className={`inline-block mt-3 px-3 py-1 rounded-full text-[11px] font-semibold ${passed ? 'bg-emerald-500/15 text-emerald-400' : 'bg-warning/15 text-warning'}`}>
            {passed ? 'PASS · ≥70%' : 'FAIL · need 70%'}
          </span>
        </div>

        <div className="glass-card rounded-2xl p-5">
          <h3 className="text-sm font-bold font-display flex items-center gap-2 mb-3">
            <Target className="w-4 h-4 text-primary" /> Topic Strengths
          </h3>
          <div className="space-y-2">
            {Object.entries(topicBreakdown).map(([t, d]) => {
              const tp = Math.round((d.right / d.total) * 100);
              const tier = tp >= 80 ? 'Mastered' : tp >= 50 ? 'Solid' : 'Needs Review';
              const cls = tp >= 80 ? 'text-emerald-400' : tp >= 50 ? 'text-primary' : 'text-warning';
              return (
                <div key={t} className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-semibold text-foreground truncate">{t}</span>
                      <span className={`font-mono ${cls}`}>{tp}% · {tier}</span>
                    </div>
                    <div className="h-1.5 bg-secondary/30 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${tp >= 80 ? 'bg-emerald-400' : tp >= 50 ? 'bg-primary' : 'bg-warning'}`} style={{ width: `${tp}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {missed.length > 0 && (
          <div className="glass-card rounded-2xl p-5">
            <h3 className="text-sm font-bold font-display flex items-center gap-2 mb-3">
              <BookOpen className="w-4 h-4 text-primary" /> Review Sheet ({missed.length})
            </h3>
            <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
              {missed.map(l => {
                const q = questions[l.qIdx];
                return (
                  <div key={l.qIdx} className="bg-secondary/15 rounded-xl p-3 border border-border/30">
                    <p className="text-[10px] text-muted-foreground font-mono mb-1">{q.topic}</p>
                    <p className="text-xs font-semibold text-foreground mb-2">{q.q}</p>
                    <div className="space-y-1 text-[11px]">
                      <div className="flex items-start gap-2 text-red-400">
                        <XCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                        <span>You chose: {q.options[l.chosen]}</span>
                      </div>
                      <div className="flex items-start gap-2 text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                        <span>Correct: {q.options[q.answer]}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <button onClick={restart} className="flex-1 bg-secondary/30 text-foreground py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2">
            <RotateCcw className="w-4 h-4" /> Another Exam
          </button>
         <button 
  onClick={async () => {
    // 1. Mark onboarding complete in the database
    await supabase.from('profiles').update({ isOnboarded: true }).eq('id', user.id);
    
    // 2. Navigate away
    window.location.href = '/dashboard';
  }} 
  className="flex-1 bg-primary text-primary-foreground py-3 rounded-xl text-sm font-semibold"
>
  Done
</button>
        </div>
      </div>
    </div>
  );
};

export default QuestionsPage;
