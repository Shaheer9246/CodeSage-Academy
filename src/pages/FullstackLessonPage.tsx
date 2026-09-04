import { useState } from 'react';
import { useGuestLessonGate } from '@/lib/guestGate';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useUser } from '@/contexts/UserContext';
import { getFullstackLessonById, isFullstackLessonUnlocked } from '@/data/fullstackLessons';
import { ArrowLeft, BookOpen, FlaskConical, ClipboardCheck, Check, X, ChevronRight, GraduationCap, Lightbulb, Code2, Eye, type LucideIcon } from 'lucide-react';
import CodeEditor from '@/components/CodeEditor';
import LivePreview from '@/components/LivePreview';
import { useIsMobile } from '@/hooks/use-mobile';

type Section = 'concept' | 'practical' | 'quiz';
type MobileLab = 'code' | 'preview';

const FullstackLessonPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, completeLesson } = useUser();
  const isMobile = useIsMobile();

  const lesson = id ? getFullstackLessonById(id) : undefined;
  const [section, setSection] = useState<Section>('concept');
  const [conceptView, setConceptView] = useState<'beginner' | 'advanced'>('beginner');
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [html, setHtml] = useState(lesson?.practical.code?.html || '');
  const [css, setCss] = useState(lesson?.practical.code?.css || '');
  const [js, setJs] = useState(lesson?.practical.code?.js || '');
  const [activeFile, setActiveFile] = useState<'html' | 'css' | 'js'>('html');
  const [mobileLab, setMobileLab] = useState<MobileLab>('code');

  const { isGuest: __pgGuest } = useGuestLessonGate('fullstack', id); if (!user && !__pgGuest) return <Navigate to="/auth" replace />;
  if (!lesson) return <Navigate to="/fullstack" replace />;
  if (!isFullstackLessonUnlocked(lesson.id, (user?.completedLessons || []))) return <Navigate to="/fullstack" replace />;

  const code = lesson.practical.code;
  const correctCount = lesson.quiz.filter((q, i) => answers[i] === q.correctIndex).length;
  const passed = correctCount >= 3;
  const allAnswered = lesson.quiz.every((_, i) => answers[i] !== undefined);

  const handleSubmit = async () => {
    setSubmitted(true);
    if (correctCount >= 3) {
      if (user) await completeLesson(lesson.id);
      toast.success('Lesson complete! +5 XP · +2 Coins 🎉');
      navigate('/complete/' + lesson.id);
    }
  };

  const SECTIONS: { key: Section; icon: LucideIcon; label: string }[] = [
    { key: 'concept', icon: BookOpen, label: 'Concept' },
    { key: 'practical', icon: FlaskConical, label: 'Lab' },
    { key: 'quiz', icon: ClipboardCheck, label: 'Test' },
  ];

  const langMap = { html: 'html', css: 'css', js: 'javascript' } as const;
  const codeVal = { html, css, js }[activeFile];
  const codeSet = { html: setHtml, css: setCss, js: setJs }[activeFile];

  const Editor = code && (
    <div className="flex flex-col h-full bg-[#0a0a0c]">
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-white/[0.02]">
        <div className="flex gap-1">
          {(['html', 'css', 'js'] as const).map(f => (
            <button key={f} onClick={() => setActiveFile(f)}
              className={`px-3 py-1 text-[10px] font-mono uppercase rounded-md transition-all ${
                activeFile === f ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-zinc-300'
              }`}>{f}</button>
          ))}
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-mono">
          <Code2 className="w-3 h-3" /> editor
        </div>
      </div>
      <div className="flex-1 min-h-0">
        <CodeEditor code={codeVal} onChange={codeSet} language={langMap[activeFile]} />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#030305] text-zinc-100 relative overflow-hidden">
      {/* Ambient Background Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px]" />
      </div>

      {/* Minimal Header */}
      <header className="relative z-20 px-6 py-5 flex items-center gap-4">
        <button onClick={() => navigate('/fullstack')} className="text-zinc-500 hover:text-white p-2 rounded-xl hover:bg-white/5 transition-all">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest mb-0.5">{lesson.module}</p>
          <h1 className="font-semibold text-lg text-white truncate flex items-center gap-2">
            <span className="text-xl">{lesson.icon}</span> {lesson.title}
          </h1>
        </div>
      </header>

      {/* Floating Dock Navigation */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
        <div className="flex items-center gap-1 p-1.5 bg-black/60 backdrop-blur-2xl border border-white/10 rounded-full shadow-2xl shadow-black/50">
          {SECTIONS.map(s => (
            <button key={s.key} onClick={() => setSection(s.key)}
              className={`relative px-5 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                section === s.key ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
              }`}>
              {section === s.key && (
                <span className="absolute inset-0 bg-white/10 border border-white/10 rounded-full shadow-inner" />
              )}
              <s.icon className="w-4 h-4 relative z-10" />
              <span className="relative z-10">{s.label}</span>
              {s.key === 'quiz' && submitted && passed && <Check className="w-3 h-3 text-emerald-400 relative z-10" />}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 pt-24 pb-24">
        
        {/* ================= CONCEPT SECTION (BENTO GRID) ================= */}
        {section === 'concept' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-min">
              
              {/* Philosophy Card (Tall) */}
              <div className="lg:row-span-2 lg:col-span-1 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 relative overflow-hidden group hover:border-white/20 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10 h-full flex flex-col">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="p-2 bg-emerald-500/20 rounded-xl text-emerald-400"><FlaskConical className="w-4 h-4" /></div>
                    <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-semibold">Core Philosophy</span>
                  </div>
                  <p className="text-lg text-zinc-200 leading-relaxed font-light flex-1">{lesson.philosophy}</p>
                  <div className="mt-8">
                    <button onClick={() => setSection('practical')}
                      className="w-full bg-white text-black font-semibold text-sm py-3 rounded-xl hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-white/10">
                      Start Practical Lab <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* View Toggle (Wide) */}
              <div className="lg:col-span-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-2 flex items-center justify-between relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5" />
                {(['beginner', 'advanced'] as const).map(v => (
                  <button key={v} onClick={() => setConceptView(v)}
                    className={`relative flex-1 py-3 rounded-2xl text-sm font-semibold capitalize transition-all flex items-center justify-center gap-2 ${
                      conceptView === v ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
                    }`}>
                    {conceptView === v && <span className="absolute inset-0 bg-white/10 border border-white/10 rounded-2xl shadow-inner" />}
                    <span className="relative z-10">{v === 'beginner' ? '🌱 Beginner' : '🚀 Advanced'} View</span>
                  </button>
                ))}
              </div>

              {/* Concept Cards */}
              {lesson.concepts.map((c, i) => (
                <div key={i} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 relative overflow-hidden group hover:border-white/20 hover:bg-white/[0.07] transition-all duration-300">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-xs font-mono text-zinc-400 group-hover:text-white group-hover:border-white/20 transition-all">
                      {String(i + 1).padStart(2, '0')}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-base text-white mb-2 group-hover:text-indigo-300 transition-colors">{c.title}</h3>
                      <p className="text-sm text-zinc-400 leading-relaxed">
                        {conceptView === 'beginner' ? c.beginner : c.advanced}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= PRACTICAL SECTION (WORKSPACE) ================= */}
        {section === 'practical' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 h-[calc(100vh-140px)]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-full">
              
              {/* Left: Assignment Sidebar */}
              <div className="lg:col-span-4 flex flex-col gap-4 overflow-y-auto pr-2 pb-20 custom-scrollbar">
                {/* Lab Header */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-2 bg-amber-500/20 rounded-xl text-amber-400"><FlaskConical className="w-4 h-4" /></div>
                      <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest font-semibold">Mission Briefing</span>
                    </div>
                    <h2 className="font-bold text-xl text-white mb-2">{lesson.practical.title}</h2>
                    <p className="text-sm text-zinc-400 leading-relaxed">{lesson.practical.intro}</p>
                  </div>
                </div>

                {/* Steps */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex-1">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 bg-indigo-500/20 rounded-xl text-indigo-400"><ClipboardCheck className="w-4 h-4" /></div>
                    <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest font-semibold">Execution Steps</span>
                  </div>
                  <ol className="space-y-4">
                    {lesson.practical.steps.map((step, i) => (
                      <li key={i} className="flex gap-3 group">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-mono text-zinc-400 group-hover:bg-indigo-500/20 group-hover:text-indigo-400 group-hover:border-indigo-500/30 transition-all">
                          {i + 1}
                        </span>
                        <p className="text-sm text-zinc-300 leading-relaxed pt-0.5" dangerouslySetInnerHTML={{
                          __html: step.replace(/`([^`]+)`/g, '<code class="bg-black/50 text-indigo-300 px-1.5 py-0.5 rounded text-[11px] font-mono border border-white/5">$1</code>')
                        }} />
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Goal */}
                <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-3xl p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="w-4 h-4 text-emerald-400" />
                    <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-semibold">Success Criteria</span>
                  </div>
                  <p className="text-sm text-zinc-300">{lesson.practical.goal}</p>
                </div>

                <button onClick={() => setSection('quiz')}
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold text-sm py-4 rounded-2xl hover:from-indigo-600 hover:to-purple-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20">
                  Take Mastery Test <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Right: IDE Workspace */}
              <div className="lg:col-span-8 flex flex-col gap-4 h-full min-h-0">
                {/* Code Editor */}
                <div className="flex-1 bg-[#0a0a0c] border border-white/10 rounded-3xl overflow-hidden flex flex-col shadow-2xl shadow-black/50 min-h-0">
                  {Editor}
                </div>
                
                {/* Live Preview */}
                <div className="h-[40%] bg-white border border-white/10 rounded-3xl overflow-hidden shadow-2xl shadow-black/50 relative flex flex-col min-h-0">
                  <div className="flex items-center justify-between px-4 py-2 border-b border-black/5 bg-zinc-50">
                    <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-mono">
                      <Eye className="w-3 h-3" /> live-preview
                    </div>
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
                    </div>
                  </div>
                  <div className="flex-1 min-h-0 overflow-hidden">
                    <LivePreview html={html} css={css} js={js} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= QUIZ SECTION ================= */}
        {section === 'quiz' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl mx-auto space-y-4">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-indigo-500/10" />
              <div className="relative z-10">
                <div className="inline-flex p-3 bg-purple-500/20 rounded-2xl text-purple-400 mb-4">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Mastery Test</h2>
                <p className="text-sm text-zinc-400">Score 3/4 to complete this lesson and earn XP.</p>
              </div>
            </div>

            {lesson.quiz.map((q, qi) => (
              <div key={qi} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 relative overflow-hidden group hover:border-white/20 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Question {qi + 1}</span>
                  <span className="text-[10px] font-mono text-zinc-500 bg-white/5 px-2 py-1 rounded-md border border-white/5">{lesson.quiz.length} Total</span>
                </div>
                <p className="text-lg font-semibold text-white mb-6">{q.question}</p>
                <div className="space-y-3">
                  {q.options.map((opt, oi) => {
                    const selected = answers[qi] === oi;
                    const isCorrect = oi === q.correctIndex;
                    let cls = 'border-white/5 hover:border-white/20 text-zinc-300 bg-white/[0.02]';
                    if (submitted && selected && isCorrect) cls = 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300';
                    else if (submitted && selected && !isCorrect) cls = 'border-red-500/50 bg-red-500/10 text-red-300';
                    else if (submitted && isCorrect) cls = 'border-emerald-500/30 bg-emerald-500/5 text-emerald-300';
                    else if (selected) cls = 'border-indigo-500/50 bg-indigo-500/10 text-indigo-300';
                    return (
                      <button key={oi} disabled={submitted} onClick={() => setAnswers(p => ({ ...p, [qi]: oi }))}
                        className={`w-full text-left text-sm px-4 py-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${cls}`}>
                        <span>{opt}</span>
                        {submitted && selected && (isCorrect ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />)}
                        {submitted && !selected && isCorrect && <Check className="w-4 h-4 opacity-60" />}
                      </button>
                    );
                  })}
                </div>
                {submitted && q.explanation && (
                  <div className="mt-4 p-4 bg-indigo-500/5 border border-indigo-500/20 rounded-xl">
                    <p className="text-sm text-zinc-300 italic">💡 {q.explanation}</p>
                  </div>
                )}
              </div>
            ))}

            {!submitted ? (
              <button disabled={!allAnswered} onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold text-sm py-4 rounded-2xl hover:from-indigo-600 hover:to-purple-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-500/20">
                {allAnswered ? 'Submit Test' : `Answer all questions (${Object.keys(answers).length}/${lesson.quiz.length})`}
              </button>
            ) : (
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-center">
                <p className="text-4xl font-bold text-white mb-2">{correctCount} / {lesson.quiz.length}</p>
                <p className={`text-lg font-semibold mb-6 ${passed ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {passed ? ' Lesson Passed!' : 'Almost there — try again'}
                </p>
                {!passed && (
                  <button onClick={() => { setAnswers({}); setSubmitted(false); }}
                    className="bg-white/10 text-white text-sm font-semibold px-6 py-3 rounded-xl hover:bg-white/20 transition-all border border-white/10">Retry Test</button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FullstackLessonPage;
