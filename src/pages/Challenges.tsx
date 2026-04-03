import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { ArrowLeft, Code2, CheckCircle2, XCircle, Trophy } from 'lucide-react';
import CodeEditor from '@/components/CodeEditor';
import LivePreview from '@/components/LivePreview';

interface Challenge {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  initialHtml: string;
  initialCss: string;
  initialJs: string;
  validationKeywords: string[];
}

const challenges: Challenge[] = [
  {
    id: 'ch-1',
    title: 'Build a Profile Card',
    difficulty: 'Easy',
    description: 'Create a profile card with an image, name (h2), and a short bio paragraph.',
    initialHtml: `<!DOCTYPE html>\n<html>\n<head><link rel="stylesheet" href="style.css"></head>\n<body>\n  <!-- Build a profile card here -->\n</body>\n</html>`,
    initialCss: `body { font-family: Arial; background: #1a1a2e; color: white; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; }\n.card { background: #16213e; padding: 30px; border-radius: 16px; text-align: center; max-width: 300px; }\nimg { border-radius: 50%; width: 100px; }`,
    initialJs: '',
    validationKeywords: ['<img', '<h2', '<p', 'class="card"'],
  },
  {
    id: 'ch-2',
    title: 'Navigation Bar',
    difficulty: 'Easy',
    description: 'Create a horizontal navigation bar with at least 4 links using <nav> and styled links.',
    initialHtml: `<!DOCTYPE html>\n<html>\n<head><link rel="stylesheet" href="style.css"></head>\n<body>\n  <!-- Create a navigation bar -->\n</body>\n</html>`,
    initialCss: `body { font-family: Arial; background: #1a1a2e; color: white; margin: 0; }\nnav { background: #16213e; padding: 15px; display: flex; gap: 20px; }\nnav a { color: #e94560; text-decoration: none; }`,
    initialJs: '',
    validationKeywords: ['<nav>', '<a', 'href'],
  },
  {
    id: 'ch-3',
    title: 'Interactive Counter',
    difficulty: 'Medium',
    description: 'Build a counter with +, -, and Reset buttons. Display the count in an h1 tag.',
    initialHtml: `<!DOCTYPE html>\n<html>\n<head><link rel="stylesheet" href="style.css"></head>\n<body>\n  <h1 id="count">0</h1>\n  <!-- Add buttons for +, -, Reset -->\n  <script src="script.js"></script>\n</body>\n</html>`,
    initialCss: `body { font-family: Arial; background: #1a1a2e; color: white; text-align: center; padding: 50px; }\nh1 { font-size: 4rem; color: #e94560; }\nbutton { padding: 10px 20px; margin: 5px; border: none; border-radius: 8px; cursor: pointer; font-size: 1rem; }`,
    initialJs: `// Write JavaScript to make the counter work\nlet count = 0;\n// Add click event listeners to buttons`,
    validationKeywords: ['addeventlistener', 'innerhtml', 'button'],
  },
  {
    id: 'ch-4',
    title: 'Responsive Grid Gallery',
    difficulty: 'Medium',
    description: 'Create a responsive image gallery using CSS Grid with at least 6 images.',
    initialHtml: `<!DOCTYPE html>\n<html>\n<head><link rel="stylesheet" href="style.css"></head>\n<body>\n  <h1>Gallery</h1>\n  <div class="gallery">\n    <!-- Add 6+ images -->\n  </div>\n</body>\n</html>`,
    initialCss: `body { font-family: Arial; background: #1a1a2e; color: white; padding: 20px; }\nh1 { text-align: center; color: #e94560; }\n.gallery { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 15px; }\n.gallery img { width: 100%; border-radius: 10px; }`,
    initialJs: '',
    validationKeywords: ['<img', 'grid', 'class="gallery"'],
  },
  {
    id: 'ch-5',
    title: 'Todo List App',
    difficulty: 'Hard',
    description: 'Build a todo list with an input field, add button, and the ability to mark items as done.',
    initialHtml: `<!DOCTYPE html>\n<html>\n<head><link rel="stylesheet" href="style.css"></head>\n<body>\n  <h1>Todo List</h1>\n  <input type="text" id="todoInput" placeholder="Add a task...">\n  <button onclick="addTodo()">Add</button>\n  <ul id="todoList"></ul>\n  <script src="script.js"></script>\n</body>\n</html>`,
    initialCss: `body { font-family: Arial; background: #1a1a2e; color: white; max-width: 500px; margin: 0 auto; padding: 30px; }\nh1 { color: #e94560; }\ninput { padding: 10px; width: 70%; border-radius: 8px; border: 1px solid #333; background: #16213e; color: white; }\nbutton { padding: 10px 15px; background: #e94560; color: white; border: none; border-radius: 8px; cursor: pointer; }\nli { padding: 10px; margin: 5px 0; background: #16213e; border-radius: 8px; list-style: none; cursor: pointer; }`,
    initialJs: `function addTodo() {\n  // Get input value, create li, add to list\n}`,
    validationKeywords: ['addeventlistener', 'appendchild', 'createelement'],
  },
];

const Challenges = () => {
  const navigate = useNavigate();
  const { user, completeLesson } = useUser();
  const [selected, setSelected] = useState<Challenge | null>(null);
  const [htmlCode, setHtmlCode] = useState('');
  const [cssCode, setCssCode] = useState('');
  const [jsCode, setJsCode] = useState('');
  const [result, setResult] = useState<'pass' | 'fail' | null>(null);
  const handleConsoleLog = useCallback(() => {}, []);

  if (!user) { navigate('/auth'); return null; }

  const startChallenge = (ch: Challenge) => {
    setSelected(ch);
    setHtmlCode(ch.initialHtml);
    setCssCode(ch.initialCss);
    setJsCode(ch.initialJs);
    setResult(null);
  };

  const checkCode = () => {
    if (!selected) return;
    const allCode = (htmlCode + '\n' + cssCode + '\n' + jsCode).toLowerCase();
    const passed = selected.validationKeywords.every(kw => allCode.includes(kw.toLowerCase()));
    setResult(passed ? 'pass' : 'fail');
    if (passed) completeLesson(`challenge-${selected.id}`);
  };


  if (selected) {
    return (
      <div className="h-screen flex flex-col bg-background overflow-hidden">
        <header className="flex items-center justify-between px-4 py-2 bg-card border-b border-border">
          <div className="flex items-center gap-3">
            <button onClick={() => setSelected(null)} className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <Trophy className="w-5 h-5 text-primary" />
            <span className="text-foreground font-semibold text-sm">{selected.title}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              selected.difficulty === 'Easy' ? 'bg-success/20 text-success' :
              selected.difficulty === 'Medium' ? 'bg-warning/20 text-warning' :
              'bg-destructive/20 text-destructive'
            }`}>{selected.difficulty}</span>
          </div>
          <button onClick={checkCode} className="bg-primary text-primary-foreground px-4 py-1.5 rounded-lg text-sm font-semibold hover:opacity-90">
            Check My Code
          </button>
        </header>

        {result && (
          <div className={`px-4 py-2 text-sm flex items-center gap-2 ${result === 'pass' ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}`}>
            {result === 'pass' ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
            {result === 'pass' ? 'Challenge completed! 🎉' : 'Not quite right. Keep trying!'}
          </div>
        )}

        <div className="flex-1 flex overflow-hidden">
          <div className="w-72 flex-shrink-0 border-r border-border p-4 overflow-auto bg-card">
            <p className="text-sm text-muted-foreground">{selected.description}</p>
          </div>
          <div className="flex-1 min-h-0">
            <CodeEditor code={htmlCode} onChange={setHtmlCode} language="html" />
          </div>
          <div className="flex-1 flex flex-col min-w-0 border-l border-border">
            <div className="px-3 py-2 border-b border-border text-xs text-muted-foreground font-mono bg-card">Preview</div>
            <div className="flex-1 min-h-0">
              <LivePreview html={htmlCode} css={cssCode} js={jsCode} onConsoleLog={handleConsoleLog} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card px-6 py-3 flex items-center gap-3">
        <button onClick={() => navigate('/dashboard')} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <Trophy className="w-5 h-5 text-primary" />
        <span className="text-lg font-bold text-foreground">Coding Challenges</span>
      </header>

      <div className="max-w-3xl mx-auto p-6 space-y-4">
        {challenges.map(ch => {
          const completed = user.completedLessons.includes(`challenge-${ch.id}`);
          return (
            <button
              key={ch.id}
              onClick={() => startChallenge(ch)}
              className="w-full bg-card border border-border rounded-xl p-5 text-left hover:border-primary/30 transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                {completed && <CheckCircle2 className="w-5 h-5 text-success" />}
                <div>
                  <h3 className="font-semibold text-foreground">{ch.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{ch.description}</p>
                </div>
              </div>
              <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                ch.difficulty === 'Easy' ? 'bg-success/20 text-success' :
                ch.difficulty === 'Medium' ? 'bg-warning/20 text-warning' :
                'bg-destructive/20 text-destructive'
              }`}>{ch.difficulty}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Challenges;
