import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { ArrowLeft, XCircle, Trophy } from 'lucide-react';

interface TestQuestion {
  question: string;
  options: string[];
  correct: number;
}

const TESTS: Record<string, { title: string; questions: TestQuestion[] }> = {
  basic: {
    title: 'Basics Final Test',
    questions: [
      { question: 'What does HTML stand for?', options: ['Hyper Text Markup Language', 'High Tech Modern Language', 'Home Tool Markup Language', 'Hyper Transfer Markup Language'], correct: 0 },
      { question: 'Which tag is used for the largest heading?', options: ['<heading>', '<h6>', '<h1>', '<head>'], correct: 2 },
      { question: 'What does CSS stand for?', options: ['Computer Style Sheets', 'Cascading Style Sheets', 'Creative Style System', 'Colorful Style Sheets'], correct: 1 },
      { question: 'Which property changes text color in CSS?', options: ['text-color', 'font-color', 'color', 'text-style'], correct: 2 },
      { question: 'Which tag creates a link?', options: ['<link>', '<a>', '<href>', '<url>'], correct: 1 },
      { question: 'What is the correct way to add JavaScript to HTML?', options: ['<javascript>', '<js>', '<script>', '<code>'], correct: 2 },
      { question: 'Which CSS property controls spacing inside an element?', options: ['margin', 'spacing', 'padding', 'border'], correct: 2 },
      { question: 'What does the <img> tag require?', options: ['href attribute', 'src attribute', 'link attribute', 'url attribute'], correct: 1 },
      { question: 'Which is a self-closing tag?', options: ['<p>', '<div>', '<br>', '<span>'], correct: 2 },
      { question: 'What does "display: flex" do?', options: ['Hides element', 'Makes flexible layout', 'Adds animation', 'Changes font'], correct: 1 },
    ],
  },
  intermediate: {
    title: 'Intermediate Final Test',
    questions: [
      { question: 'What is the CSS Box Model order from inside out?', options: ['Margin, Border, Padding, Content', 'Content, Padding, Border, Margin', 'Padding, Content, Margin, Border', 'Content, Margin, Padding, Border'], correct: 1 },
      { question: 'What does "position: absolute" do?', options: ['Positions relative to viewport', 'Positions relative to nearest positioned ancestor', 'Positions at the top', 'Makes it invisible'], correct: 1 },
      { question: 'What is a CSS media query used for?', options: ['Loading media files', 'Responsive design', 'Playing videos', 'Importing fonts'], correct: 1 },
      { question: 'What does document.querySelector() return?', options: ['All matching elements', 'First matching element', 'Last matching element', 'A boolean'], correct: 1 },
      { question: 'What is the difference between let and const?', options: ['No difference', 'let can be reassigned, const cannot', 'const can be reassigned, let cannot', 'Both are the same as var'], correct: 1 },
      { question: 'What is an event listener?', options: ['CSS animation', 'A function that runs on user interaction', 'An HTML tag', 'A server request'], correct: 1 },
      { question: 'What does JSON stand for?', options: ['JavaScript Object Notation', 'Java Standard Object Naming', 'JavaScript Online Network', 'Java Syntax Object Notation'], correct: 0 },
      { question: 'What is CSS Grid used for?', options: ['Animations', 'Two-dimensional layouts', 'Font styling', 'Color management'], correct: 1 },
      { question: 'What does "async" mean in JavaScript?', options: ['Synchronous execution', 'Code that runs without waiting', 'A CSS property', 'An HTML tag'], correct: 1 },
      { question: 'What is localStorage used for?', options: ['Styling pages', 'Storing data in the browser', 'Running servers', 'Creating databases'], correct: 1 },
    ],
  },
};

const LevelTest = () => {
  const { level } = useParams<{ level: string }>();
  const navigate = useNavigate();
  const { user, completeTest } = useUser();
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);

  if (!user || !level) { navigate('/learn'); return null; }
  const test = TESTS[level];
  if (!test) { navigate('/learn'); return null; }

  const handleAnswer = (idx: number) => {
    const newAnswers = [...answers, idx];
    setAnswers(newAnswers);
    if (currentQ < test.questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      setShowResults(true);
      const correct = newAnswers.filter((a, i) => a === test.questions[i].correct).length;
      if (correct >= test.questions.length * 0.7) completeTest(`test-${level}`, 3);
    }
  };

  if (showResults) {
    const correct = answers.filter((a, i) => a === test.questions[i].correct).length;
    const passed = correct >= test.questions.length * 0.7;
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden animated-bg">
        <div className="glow-orb glow-primary w-64 h-64 top-10 -right-20" />
        <div className="glass-card-strong rounded-3xl p-8 max-w-md w-full text-center relative z-10 neon-border-subtle">
          {passed ? (
            <>
              <Trophy className="w-16 h-16 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-2">Congratulations! 🎉</h2>
              <p className="text-muted-foreground text-sm mb-4">You passed with {correct}/{test.questions.length} correct answers!</p>
              <p className="text-xs text-success mb-6">The next level is now unlocked!</p>
            </>
          ) : (
            <>
              <XCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-2">Not quite!</h2>
              <p className="text-muted-foreground text-sm mb-4">You got {correct}/{test.questions.length}. You need at least 70% to pass.</p>
              <p className="text-xs text-muted-foreground mb-6">Review the lessons and try again!</p>
            </>
          )}
          <button onClick={() => navigate('/learn')}
            className="bg-gradient-to-r from-primary to-accent text-primary-foreground px-6 py-3 rounded-xl font-semibold hover:opacity-90 shadow-lg shadow-primary/20">
            Back to Learning
          </button>
        </div>
      </div>
    );
  }

  const q = test.questions[currentQ];
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden animated-bg">
      <div className="glow-orb glow-accent w-48 h-48 top-20 -left-10 opacity-20" />
      <div className="w-full max-w-lg relative z-10">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => navigate('/learn')} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="text-xs text-muted-foreground font-mono">{currentQ + 1} / {test.questions.length}</span>
        </div>
        <div className="flex gap-1 mb-6">
          {test.questions.map((_, i) => (
            <div key={i} className={`flex-1 h-1.5 rounded-full transition-all ${i < currentQ ? 'bg-primary' : i === currentQ ? 'bg-primary/50' : 'bg-secondary'}`} />
          ))}
        </div>
        <div className="glass-card-strong rounded-2xl p-6 neon-border-subtle">
          <h2 className="text-base font-semibold text-foreground mb-5">{q.question}</h2>
          <div className="space-y-2.5">
            {q.options.map((opt, i) => (
              <button key={i} onClick={() => handleAnswer(i)}
                className="w-full text-left px-4 py-3 rounded-xl border border-border bg-secondary/40 text-foreground hover:border-primary/40 hover:bg-primary/5 transition-all text-sm">
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LevelTest;
