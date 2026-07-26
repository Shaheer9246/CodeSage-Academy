import { useState } from 'react';
import { useGuestLessonGate } from '@/lib/guestGate';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useUser } from '@/contexts/UserContext';
import { REAL_FREELANCE_LESSONS, getRealFreelanceLessonById, isRealFreelanceLessonUnlocked } from '@/data/realfreelanceLesson';
import { ArrowLeft, BookOpen, FlaskConical, ClipboardCheck, Check, X, ChevronRight, GraduationCap, Lightbulb, type LucideIcon } from 'lucide-react';

type Section = 'concept' | 'practical' | 'quiz';

const RealFreelanceLessonPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, completeLesson } = useUser();

  const lesson = id ? getRealFreelanceLessonById(id) : undefined;
  const [section, setSection] = useState<Section>('concept');
  const [conceptView, setConceptView] = useState<'beginner' | 'advanced'>('beginner');
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const { isGuest: __pgGuest } = useGuestLessonGate('real-freelance', id); 
  if (!user && !__pgGuest) return <Navigate to="/auth" replace />;
  if (!lesson) return <Navigate to="/real-freelance" replace />;
  if (!isRealFreelanceLessonUnlocked(lesson.id, (user?.completedLessons || []))) return <Navigate to="/real-freelance" replace />;

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

  return (
    <div className="min-h-screen bg-background grid-bg">
      <header className="sticky top-0 z-20 backdrop-blur-xl bg-background/80 border-b border-border/30 px-3 py-2.5 flex items-center gap-3">
        <button onClick={() => navigate('/real-freelance')} className="text-muted-foreground hover:text-foreground p-1">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider truncate">{lesson.module}</p>
          <h1 className="font-display font-bold text-sm text-foreground truncate flex items-center gap-1.5">
            <span>{lesson.icon}</span> {lesson.title}
          </h1>
        </div>
      </header>

      <div className="sticky top-[57px] z-10 bg-background/80 backdrop-blur-xl border-b border-border/30 flex">
        {SECTIONS.map(s => (
          <button key={s.key} onClick={() => setSection(s.key)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-all border-b-2 ${
              section === s.key ? 'text-primary border-primary bg-primary/5' : 'text-muted-foreground border-transparent'
            }`}>
            <s.icon className="w-3.5 h-3.5" />
            {s.label}
            {s.key === 'quiz' && submitted && passed && <Check className="w-3 h-3 text-emerald-400" />}
          </button>
        ))}
      </div>

      <div className="max-w-2xl mx-auto px-4 py-5 pb-24">
        {section === 'concept' && (
          <div className="space-y-5 animate-fade-in">
            <div className="glass-card rounded-2xl p-4 border border-primary/20">
              <p className="text-[10px] font-mono text-primary uppercase tracking-wider mb-2">I. Core Philosophy</p>
              <p className="text-sm text-foreground leading-relaxed">{lesson.philosophy}</p>
            </div>

            <div>
              <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-2 px-1">II. Detailed Breakdown</p>
              <div className="flex gap-1 mb-3 p-1 glass-card rounded-xl w-full">
                {(['beginner', 'advanced'] as const).map(v => (
                  <button key={v} onClick={() => setConceptView(v)}
                    className={`flex-1 py-1.5 rounded-lg text-[11px] font-display font-semibold capitalize transition-all ${
                      conceptView === v ? 'bg-primary/20 text-primary' : 'text-muted-foreground'
                    }`}>
                    {v} View
                  </button>
                ))}
              </div>
              <div className="space-y-3">
                {lesson.concepts.map((c, i) => (
                  <div key={i} className="glass-card rounded-xl p-4">
                    <h3 className="font-display font-bold text-sm text-foreground mb-2">{c.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {conceptView === 'beginner' ? c.beginner : c.advanced}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <button onClick={() => setSection('practical')}
              className="w-full bg-primary text-primary-foreground font-display font-semibold text-sm py-3 rounded-2xl neon-glow hover:opacity-90 flex items-center justify-center gap-2">
              Try the Practical Lab <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {section === 'practical' && (
          <div className="space-y-4 animate-fade-in">
            <div className="glass-card rounded-2xl p-4 border border-amber-500/20">
              <p className="text-[10px] font-mono text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                <FlaskConical className="w-3 h-3" /> III. Practical Lab
              </p>
              <h2 className="font-display font-bold text-base text-foreground mb-1">{lesson.practical.title}</h2>
              <p className="text-xs text-muted-foreground">{lesson.practical.intro}</p>
            </div>

            <div className="glass-card rounded-2xl p-4">
              <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider mb-3">Steps</p>
              <ol className="space-y-3">
                {lesson.practical.steps.map((step, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center text-[10px] font-bold text-primary font-mono">
                      {i + 1}
                    </span>
                    <p className="text-xs text-foreground leading-relaxed pt-0.5" dangerouslySetInnerHTML={{
                      __html: step.replace(/`([^`]+)`/g, '<code class="bg-secondary/60 text-primary px-1.5 py-0.5 rounded text-[11px] font-mono">$1</code>')
                    }} />
                  </li>
                ))}
              </ol>
            </div>

            <div className="glass-card rounded-2xl p-4 border border-primary/20 bg-primary/5">
              <p className="text-[10px] font-mono text-primary uppercase tracking-wider mb-1 flex items-center gap-1">
                <Lightbulb className="w-3 h-3" /> The Goal
              </p>
              <p className="text-xs text-foreground">{lesson.practical.goal}</p>
            </div>

            <button onClick={() => setSection('quiz')}
              className="w-full bg-primary text-primary-foreground font-display font-semibold text-sm py-3 rounded-2xl neon-glow hover:opacity-90 flex items-center justify-center gap-2">
              Take the Mastery Test <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {section === 'quiz' && (
          <div className="space-y-4 animate-fade-in">
            <div className="glass-card rounded-2xl p-4 border border-primary/20">
              <p className="text-[10px] font-mono text-primary uppercase tracking-wider mb-1 flex items-center gap-1">
                <GraduationCap className="w-3 h-3" /> IV. Mastery Test
              </p>
              <p className="text-xs text-muted-foreground">Score 3/4 to complete this lesson and earn XP.</p>
            </div>

            {lesson.quiz.map((q, qi) => (
              <div key={qi} className="glass-card rounded-2xl p-4">
                <p className="text-[10px] font-mono text-muted-foreground mb-2">Question {qi + 1} of {lesson.quiz.length}</p>
                <p className="text-sm font-display font-semibold text-foreground mb-3">{q.question}</p>
                <div className="space-y-2">
                  {q.options.map((opt, oi) => {
                    const selected = answers[qi] === oi;
                    const isCorrect = oi === q.correctIndex;
                    let cls = 'border-border/30 hover:border-primary/30 text-foreground';
                    if (submitted && selected && isCorrect) cls = 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300';
                    else if (submitted && selected && !isCorrect) cls = 'border-red-500/50 bg-red-500/10 text-red-300';
                    else if (submitted && isCorrect) cls = 'border-emerald-500/30 bg-emerald-500/5 text-emerald-300';
                    else if (selected) cls = 'border-primary/40 bg-primary/10 text-primary';
                    return (
                      <button key={oi} disabled={submitted} onClick={() => setAnswers(p => ({ ...p, [qi]: oi }))}
                        className={`w-full text-left text-xs px-3 py-2.5 rounded-xl border-2 transition-all flex items-center justify-between gap-2 ${cls}`}>
                        <span>{opt}</span>
                        {submitted && selected && (isCorrect ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />)}
                        {submitted && !selected && isCorrect && <Check className="w-3.5 h-3.5 opacity-60" />}
                      </button>
                    );
                  })}
                </div>
                {submitted && q.explanation && (
                  <p className="text-[11px] text-muted-foreground mt-3 italic border-l-2 border-primary/30 pl-3">💡 {q.explanation}</p>
                )}
              </div>
            ))}

            {!submitted ? (
              <button disabled={!allAnswered} onClick={handleSubmit}
                className="w-full bg-primary text-primary-foreground font-display font-semibold text-sm py-3 rounded-2xl neon-glow hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                {allAnswered ? 'Submit Test' : `Answer all questions (${Object.keys(answers).length}/${lesson.quiz.length})`}
              </button>
            ) : (
              <div className="glass-card rounded-2xl p-5 text-center">
                <p className="text-2xl font-display font-bold text-foreground mb-1">{correctCount} / {lesson.quiz.length}</p>
                <p className={`text-sm font-display font-semibold mb-3 ${passed ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {passed ? '🎉 Lesson Passed!' : 'Almost there — try again'}
                </p>
                {!passed && (
                  <button onClick={() => { setAnswers({}); setSubmitted(false); }}
                    className="bg-primary text-primary-foreground text-xs font-semibold px-4 py-2 rounded-xl">Retry Test</button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RealFreelanceLessonPage;
