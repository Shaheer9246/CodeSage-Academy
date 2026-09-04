import { useState } from 'react';
import { useGuestLessonGate } from '@/lib/guestGate';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useUser } from '@/contexts/UserContext';
import { getFullstackLessonById, isFullstackLessonUnlocked } from '@/data/fullstackLessons';
import { ArrowLeft, BookOpen, FlaskConical, ClipboardCheck, Check, X, ChevronRight, GraduationCap, Lightbulb, Code2, Eye, Sparkles, Target, Zap, type LucideIcon } from 'lucide-react';
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
    { key: 'concept', icon: BookOpen, label: 'Lesson' },
    { key: 'practical', icon: FlaskConical, label: 'Practical' },
    { key: 'quiz', icon: ClipboardCheck, label: 'Test' },
  ];

  const langMap = { html: 'html', css: 'css', js: 'javascript' } as const;
  const codeVal = { html, css, js }[activeFile];
  const codeSet = { html: setHtml, css: setCss, js: setJs }[activeFile];

  const Editor = code && (
    <div className="flex flex-col h-full bg-[#0d1117] rounded-lg overflow-hidden">
      <div className="flex border-b border-gray-700/50 bg-[#161b22]">
        {(['html', 'css', 'js'] as const).map(f => (
          <button key={f} onClick={() => setActiveFile(f)}
            className={`px-4 py-2 text-xs font-mono uppercase transition-all ${
              activeFile === f 
                ? 'bg-[#0d1117] text-emerald-400 border-b-2 border-emerald-400' 
                : 'text-gray-400 hover:text-gray-200'
            }`}>{f}</button>
        ))}
      </div>
      <div className="flex-1 min-h-0">
        <CodeEditor code={codeVal} onChange={codeSet} language={langMap[activeFile]} />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      {/* Header */}
      <header className="sticky top-0 z-20 backdrop-blur-xl bg-gray-900/80 border-b border-gray-800/50 px-6 py-4 flex items-center gap-4">
        <button onClick={() => navigate('/fullstack')} className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-800/50 transition-all">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-500 font-mono uppercase tracking-wider mb-1">{lesson.module}</p>
          <h1 className="font-bold text-lg text-white flex items-center gap-2">
            <span className="text-2xl">{lesson.icon}</span> 
            <span className="truncate">{lesson.title}</span>
          </h1>
        </div>
      </header>

      {/* Section Tabs */}
      <div className="sticky top-[73px] z-10 bg-gray-900/80 backdrop-blur-xl border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-6 flex">
          {SECTIONS.map(s => (
            <button key={s.key} onClick={() => setSection(s.key)}
              className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-medium transition-all border-b-2 ${
                section === s.key 
                  ? 'text-emerald-400 border-emerald-400 bg-emerald-400/5' 
                  : 'text-gray-400 border-transparent hover:text-gray-200'
              }`}>
              <s.icon className="w-4 h-4" />
              {s.label}
              {s.key === 'quiz' && submitted && passed && <Check className="w-4 h-4 text-emerald-400" />}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8 pb-24">
        
        {/* CONCEPT SECTION */}
        {section === 'concept' && (
          <div className="animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Philosophy Card - Left */}
              <div className="lg:col-span-4">
                <div className="sticky top-40 space-y-4">
                  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/20 p-6">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl"></div>
                    <div className="relative">
                      <div className="flex items-center gap-2 mb-4">
                        <Sparkles className="w-5 h-5 text-emerald-400" />
                        <p className="text-xs font-mono text-emerald-400 uppercase tracking-wider font-semibold">Core Philosophy</p>
                      </div>
                      <p className="text-sm text-gray-200 leading-relaxed">{lesson.philosophy}</p>
                    </div>
                  </div>

                  <button onClick={() => setSection('practical')}
                    className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold text-sm py-4 rounded-2xl hover:from-emerald-600 hover:to-emerald-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20">
                    Try the Practical Lab <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Concepts - Right */}
              <div className="lg:col-span-8 space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1 h-8 bg-emerald-400 rounded-full"></div>
                  <div>
                    <p className="text-xs font-mono text-gray-500 uppercase tracking-wider">Detailed Breakdown</p>
                    <h2 className="text-xl font-bold text-white">Understanding the Concepts</h2>
                  </div>
                </div>

                {/* View Toggle */}
                <div className="flex gap-2 p-1.5 bg-gray-800/50 rounded-xl border border-gray-700/50">
                  {(['beginner', 'advanced'] as const).map(v => (
                    <button key={v} onClick={() => setConceptView(v)}
                      className={`flex-1 py-2.5 rounded-lg text-sm font-semibold capitalize transition-all ${
                        conceptView === v 
                          ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                          : 'text-gray-400 hover:text-gray-200'
                      }`}>
                      {v === 'beginner' ? ' Beginner' : '🚀 Advanced'} View
                    </button>
                  ))}
                </div>

                {/* Concept Cards */}
                <div className="space-y-4">
                  {lesson.concepts.map((c, i) => (
                    <div key={i} className="group relative overflow-hidden rounded-2xl bg-gray-800/30 border border-gray-700/50 p-6 hover:border-emerald-500/30 hover:bg-gray-800/50 transition-all">
                      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-emerald-400 to-emerald-600 rounded-l-2xl"></div>
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                          <span className="text-emerald-400 font-bold text-sm">{i + 1}</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-base text-white mb-2 group-hover:text-emerald-400 transition-colors">{c.title}</h3>
                          <p className="text-sm text-gray-400 leading-relaxed">
                            {conceptView === 'beginner' ? c.beginner : c.advanced}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PRACTICAL SECTION */}
        {section === 'practical' && (
          <div className="animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Assignment Sidebar - Left */}
              <div className="lg:col-span-4 space-y-4">
                <div className="sticky top-40 space-y-4">
                  {/* Lab Header */}
                  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 p-6">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl"></div>
                    <div className="relative">
                      <div className="flex items-center gap-2 mb-3">
                        <FlaskConical className="w-5 h-5 text-amber-400" />
                        <p className="text-xs font-mono text-amber-400 uppercase tracking-wider font-semibold">Practical Lab</p>
                      </div>
                      <h2 className="font-bold text-lg text-white mb-2">{lesson.practical.title}</h2>
                      <p className="text-sm text-gray-400">{lesson.practical.intro}</p>
                    </div>
                  </div>

                  {/* Steps */}
                  <div className="rounded-2xl bg-gray-800/30 border border-gray-700/50 p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Target className="w-5 h-5 text-emerald-400" />
                      <p className="text-xs font-mono text-gray-400 uppercase tracking-wider font-semibold">Steps</p>
                    </div>
                    <ol className="space-y-4">
                      {lesson.practical.steps.map((step, i) => (
                        <li key={i} className="flex gap-3">
                          <span className="flex-shrink-0 w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-xs font-bold text-emerald-400">
                            {i + 1}
                          </span>
                          <p className="text-sm text-gray-300 leading-relaxed pt-0.5" dangerouslySetInnerHTML={{
                            __html: step.replace(/`([^`]+)`/g, '<code class="bg-gray-700/50 text-emerald-400 px-2 py-0.5 rounded text-xs font-mono">$1</code>')
                          }} />
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Goal */}
                  <div className="rounded-2xl bg-emerald-500/5 border border-emerald-500/20 p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <Lightbulb className="w-4 h-4 text-emerald-400" />
                      <p className="text-xs font-mono text-emerald-400 uppercase tracking-wider font-semibold">The Goal</p>
                    </div>
                    <p className="text-sm text-gray-300">{lesson.practical.goal}</p>
                  </div>

                  <button onClick={() => setSection('quiz')}
                    className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold text-sm py-4 rounded-2xl hover:from-emerald-600 hover:to-emerald-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20">
                    Take the Mastery Test <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Code & Preview - Right */}
              <div className="lg:col-span-8 space-y-4">
                {code && (
                  <>
                    {/* Code Editor - Top */}
                    <div className="rounded-2xl overflow-hidden border border-gray-700/50 shadow-2xl">
                      <div className="flex items-center gap-2 px-4 py-3 bg-gray-800/80 border-b border-gray-700/50">
                        <div className="flex gap-1.5">
                          <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                          <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                          <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                        </div>
                        <div className="flex-1 flex items-center justify-center">
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <Code2 className="w-3.5 h-3.5" />
                            <span className="font-mono">code-editor</span>
                          </div>
                        </div>
                      </div>
                      <div style={{ height: '45vh' }}>
                        {Editor}
                      </div>
                    </div>

                    {/* Live Preview - Bottom */}
                    <div className="rounded-2xl overflow-hidden border border-gray-700/50 shadow-2xl">
                      <div className="flex items-center gap-2 px-4 py-3 bg-gray-800/80 border-b border-gray-700/50">
                        <div className="flex gap-1.5">
                          <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                          <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                          <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                        </div>
                        <div className="flex-1 flex items-center justify-center">
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <Eye className="w-3.5 h-3.5" />
                            <span className="font-mono">live-preview</span>
                          </div>
                        </div>
                      </div>
                      <div style={{ height: '35vh' }} className="bg-white">
                        <LivePreview html={html} css={css} js={js} />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* QUIZ SECTION */}
        {section === 'quiz' && (
          <div className="animate-fade-in max-w-3xl mx-auto space-y-6">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-transparent border border-purple-500/20 p-6">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl"></div>
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <GraduationCap className="w-5 h-5 text-purple-400" />
                  <p className="text-xs font-mono text-purple-400 uppercase tracking-wider font-semibold">Mastery Test</p>
                </div>
                <h2 className="text-xl font-bold text-white mb-1">Test Your Knowledge</h2>
                <p className="text-sm text-gray-400">Score 3/4 to complete this lesson and earn XP.</p>
              </div>
            </div>

            {lesson.quiz.map((q, qi) => (
              <div key={qi} className="rounded-2xl bg-gray-800/30 border border-gray-700/50 p-6">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-xs font-mono text-gray-500">Question {qi + 1} of {lesson.quiz.length}</p>
                  <div className="w-8 h-8 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                    <span className="text-purple-400 font-bold text-xs">{qi + 1}</span>
                  </div>
                </div>
                <p className="text-base font-semibold text-white mb-4">{q.question}</p>
                <div className="space-y-3">
                  {q.options.map((opt, oi) => {
                    const selected = answers[qi] === oi;
                    const isCorrect = oi === q.correctIndex;
                    let cls = 'border-gray-700/50 hover:border-purple-500/30 text-gray-300';
                    if (submitted && selected && isCorrect) cls = 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300';
                    else if (submitted && selected && !isCorrect) cls = 'border-red-500/50 bg-red-500/10 text-red-300';
                    else if (submitted && isCorrect) cls = 'border-emerald-500/30 bg-emerald-500/5 text-emerald-300';
                    else if (selected) cls = 'border-purple-500/40 bg-purple-500/10 text-purple-300';
                    return (
                      <button key={oi} disabled={submitted} onClick={() => setAnswers(p => ({ ...p, [qi]: oi }))}
                        className={`w-full text-left text-sm px-4 py-3 rounded-xl border-2 transition-all flex items-center justify-between gap-3 ${cls}`}>
                        <span>{opt}</span>
                        {submitted && selected && (isCorrect ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />)}
                        {submitted && !selected && isCorrect && <Check className="w-4 h-4 opacity-60" />}
                      </button>
                    );
                  })}
                </div>
                {submitted && q.explanation && (
                  <div className="mt-4 p-4 bg-purple-500/5 border-l-4 border-purple-500/30 rounded-r-lg">
                    <p className="text-sm text-gray-300 italic">💡 {q.explanation}</p>
                  </div>
                )}
              </div>
            ))}

            {!submitted ? (
              <button disabled={!allAnswered} onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold text-sm py-4 rounded-2xl hover:from-purple-600 hover:to-purple-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-purple-500/20">
                {allAnswered ? 'Submit Test' : `Answer all questions (${Object.keys(answers).length}/${lesson.quiz.length})`}
              </button>
            ) : (
              <div className="rounded-2xl bg-gray-800/30 border border-gray-700/50 p-8 text-center">
                <p className="text-4xl font-bold text-white mb-2">{correctCount} / {lesson.quiz.length}</p>
                <p className={`text-lg font-semibold mb-4 ${passed ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {passed ? '🎉 Lesson Passed!' : 'Almost there — try again'}
                </p>
                {!passed && (
                  <button onClick={() => { setAnswers({}); setSubmitted(false); }}
                    className="bg-purple-500 text-white text-sm font-semibold px-6 py-3 rounded-xl hover:bg-purple-600 transition-all">Retry Test</button>
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
