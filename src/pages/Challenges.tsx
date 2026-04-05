import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { ArrowLeft, CheckCircle2, XCircle, Trophy, Lightbulb } from 'lucide-react';
import CodeEditor from '@/components/CodeEditor';
import LivePreview from '@/components/LivePreview';
import ConsolePanel from '@/components/ConsolePanel';

interface Challenge {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  initialHtml: string;
  initialCss: string;
  initialJs: string;
  validationKeywords: string[];
  hint: string;
}

function normalizeCode(code: string): string {
  return code.toLowerCase().replace(/'/g, '"').replace(/\s+/g, ' ').replace(/\s*=\s*/g, '=');
}

const challenges: Challenge[] = [
  {
    id: 'ch-1', title: 'Build a Profile Card', difficulty: 'Easy',
    description: 'Create a profile card with an image, name (h2), and a short bio paragraph.',
    initialHtml: `<!DOCTYPE html>\n<html>\n<head><link rel="stylesheet" href="style.css"></head>\n<body>\n  <!-- Build a profile card here -->\n</body>\n</html>`,
    initialCss: `body { font-family: Arial; background: #0f0a2e; color: white; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; }\n.card { background: #1a1040; padding: 30px; border-radius: 16px; text-align: center; max-width: 300px; }\nimg { border-radius: 50%; width: 100px; }`,
    initialJs: '', validationKeywords: ['<img', '<h2', '<p'],
    hint: 'Create a div with class="card", add an <img> tag, an <h2> for the name, and a <p> for the bio.',
  },
  {
    id: 'ch-2', title: 'Navigation Bar', difficulty: 'Easy',
    description: 'Create a horizontal navigation bar with at least 4 links using <nav> and styled links.',
    initialHtml: `<!DOCTYPE html>\n<html>\n<head><link rel="stylesheet" href="style.css"></head>\n<body>\n  <!-- Create a navigation bar -->\n</body>\n</html>`,
    initialCss: `body { font-family: Arial; background: #0f0a2e; color: white; margin: 0; }\nnav { background: #1a1040; padding: 15px; display: flex; gap: 20px; }\nnav a { color: #e98a2e; text-decoration: none; }`,
    initialJs: '', validationKeywords: ['<nav>', '<a', 'href'],
    hint: 'Use <nav> to wrap your links. Add at least 4 <a> tags with href attributes.',
  },
  {
    id: 'ch-3', title: 'Interactive Counter', difficulty: 'Easy',
    description: 'Build a counter with +, -, and Reset buttons. Display the count in an h1 tag.',
    initialHtml: `<!DOCTYPE html>\n<html>\n<head><link rel="stylesheet" href="style.css"></head>\n<body>\n  <h1 id="count">0</h1>\n  <!-- Add buttons for +, -, Reset -->\n  <script src="script.js"></script>\n</body>\n</html>`,
    initialCss: `body { font-family: Arial; background: #0f0a2e; color: white; text-align: center; padding: 50px; }\nh1 { font-size: 4rem; color: #e98a2e; }\nbutton { padding: 10px 20px; margin: 5px; border: none; border-radius: 8px; cursor: pointer; font-size: 1rem; }`,
    initialJs: `// Write JavaScript to make the counter work\nlet count = 0;\n// Hint: use document.getElementById and addEventListener`,
    validationKeywords: ['button', 'innerhtml'],
    hint: 'Create 3 buttons (+, -, Reset). Use getElementById to get the h1 and update its innerHTML when buttons are clicked.',
  },
  {
    id: 'ch-4', title: 'Responsive Grid Gallery', difficulty: 'Easy',
    description: 'Create a responsive image gallery using CSS Grid with at least 4 images.',
    initialHtml: `<!DOCTYPE html>\n<html>\n<head><link rel="stylesheet" href="style.css"></head>\n<body>\n  <h1>Gallery</h1>\n  <div class="gallery">\n    <!-- Add images -->\n  </div>\n</body>\n</html>`,
    initialCss: `body { font-family: Arial; background: #0f0a2e; color: white; padding: 20px; }\nh1 { text-align: center; color: #e98a2e; }\n.gallery { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 15px; }\n.gallery img { width: 100%; border-radius: 10px; }`,
    initialJs: '', validationKeywords: ['<img', 'grid'],
    hint: 'Add 4+ <img> tags inside the gallery div. The CSS Grid is already set up for you!',
  },
  {
    id: 'ch-5', title: 'Todo List App', difficulty: 'Easy',
    description: 'Build a todo list with an input field, add button, and display items in a list.',
    initialHtml: `<!DOCTYPE html>\n<html>\n<head><link rel="stylesheet" href="style.css"></head>\n<body>\n  <h1>Todo List</h1>\n  <input type="text" id="todoInput" placeholder="Add a task...">\n  <button onclick="addTodo()">Add</button>\n  <ul id="todoList"></ul>\n  <script src="script.js"></script>\n</body>\n</html>`,
    initialCss: `body { font-family: Arial; background: #0f0a2e; color: white; max-width: 500px; margin: 0 auto; padding: 30px; }\nh1 { color: #e98a2e; }\ninput { padding: 10px; width: 70%; border-radius: 8px; border: 1px solid #333; background: #1a1040; color: white; }\nbutton { padding: 10px 15px; background: #e98a2e; color: white; border: none; border-radius: 8px; cursor: pointer; }\nli { padding: 10px; margin: 5px 0; background: #1a1040; border-radius: 8px; list-style: none; }`,
    initialJs: `function addTodo() {\n  const input = document.getElementById('todoInput');\n  const list = document.getElementById('todoList');\n  // Create a new li element and add it to the list\n}`,
    validationKeywords: ['appendchild', 'createelement'],
    hint: 'In addTodo(), use document.createElement("li") to create a list item, set its textContent from the input value, then use appendChild to add it to the list.',
  },
  {
    id: 'ch-6', title: 'Animated Landing Page', difficulty: 'Easy',
    description: 'Create a landing page with a CSS animation on the heading and a styled hero section.',
    initialHtml: `<!DOCTYPE html>\n<html>\n<head><link rel="stylesheet" href="style.css"></head>\n<body>\n  <!-- Create a hero section with animated heading -->\n  <script src="script.js"></script>\n</body>\n</html>`,
    initialCss: `body { font-family: Arial; background: #0f0a2e; color: white; margin: 0; }`,
    initialJs: '',
    validationKeywords: ['@keyframes', 'animation'],
    hint: 'Create a @keyframes rule in CSS (e.g., fadeIn) and apply it with the animation property on your heading.',
  },
  {
    id: 'ch-7', title: 'Simple Calculator', difficulty: 'Easy',
    description: 'Build a basic calculator that can add two numbers. Use an input, a button, and display the result.',
    initialHtml: `<!DOCTYPE html>\n<html>\n<head><link rel="stylesheet" href="style.css"></head>\n<body>\n  <h1>Calculator</h1>\n  <input type="number" id="num1" placeholder="First number">\n  <input type="number" id="num2" placeholder="Second number">\n  <button onclick="calculate()">Add</button>\n  <p id="result">Result: </p>\n  <script src="script.js"></script>\n</body>\n</html>`,
    initialCss: `body { font-family: Arial; background: #0f0a2e; color: white; text-align: center; padding: 50px; }\ninput { padding: 10px; margin: 5px; border-radius: 8px; border: 1px solid #333; background: #1a1040; color: white; width: 120px; }\nbutton { padding: 10px 20px; background: #e98a2e; color: white; border: none; border-radius: 8px; cursor: pointer; margin: 10px; }\n#result { font-size: 24px; color: #e98a2e; margin-top: 20px; }`,
    initialJs: `function calculate() {\n  // Get values from inputs and show the sum in #result\n}`,
    validationKeywords: ['getelementbyid', 'innerhtml'],
    hint: 'Use getElementById to get both input values, convert them with Number(), add them, and set the result paragraph\'s innerHTML.',
  },
];

type FileTab = 'html' | 'css' | 'js';

const Challenges = () => {
  const navigate = useNavigate();
  const { user, completeLesson } = useUser();
  const [selected, setSelected] = useState<Challenge | null>(null);
  const [htmlCode, setHtmlCode] = useState('');
  const [cssCode, setCssCode] = useState('');
  const [jsCode, setJsCode] = useState('');
  const [result, setResult] = useState<'pass' | 'fail' | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [fileTab, setFileTab] = useState<FileTab>('html');
  const [consoleLogs, setConsoleLogs] = useState<{ type: string; message: string }[]>([]);

  const handleConsoleLog = useCallback((log: { type: string; message: string }) => {
    setConsoleLogs(prev => [...prev, log]);
  }, []);

  if (!user) { navigate('/auth'); return null; }

  const startChallenge = (ch: Challenge) => {
    setSelected(ch);
    setHtmlCode(ch.initialHtml);
    setCssCode(ch.initialCss);
    setJsCode(ch.initialJs);
    setResult(null);
    setShowHint(false);
    setFileTab('html');
    setConsoleLogs([]);
  };

  const checkCode = () => {
    if (!selected) return;
    const allCode = normalizeCode(htmlCode + '\n' + cssCode + '\n' + jsCode);
    const passed = selected.validationKeywords.every(kw => allCode.includes(normalizeCode(kw)));
    setResult(passed ? 'pass' : 'fail');
    if (passed) completeLesson(`challenge-${selected.id}`);
  };

  const currentCode = fileTab === 'html' ? htmlCode : fileTab === 'css' ? cssCode : jsCode;
  const setCurrentCode = (val: string) => {
    if (fileTab === 'html') setHtmlCode(val);
    else if (fileTab === 'css') setCssCode(val);
    else setJsCode(val);
  };

  if (selected) {
    return (
      <div className="h-screen flex flex-col bg-background overflow-hidden">
        <header className="flex items-center justify-between px-3 py-2 glass-card border-b border-border">
          <div className="flex items-center gap-2 min-w-0">
            <button onClick={() => setSelected(null)} className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <Trophy className="w-4 h-4 text-primary flex-shrink-0" />
            <span className="text-foreground font-semibold text-xs truncate">{selected.title}</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full flex-shrink-0 ${
              selected.difficulty === 'Easy' ? 'bg-success/20 text-success' :
              selected.difficulty === 'Medium' ? 'bg-warning/20 text-warning' :
              'bg-destructive/20 text-destructive'
            }`}>{selected.difficulty}</span>
          </div>
          <button onClick={checkCode} className="bg-gradient-to-r from-primary to-accent text-primary-foreground px-3 py-1.5 rounded-lg text-xs font-semibold hover:opacity-90 shadow-lg shadow-primary/20 flex-shrink-0">
            Check My Code
          </button>
        </header>

        {result && (
          <div className={`px-4 py-2 text-xs flex items-center gap-2 ${result === 'pass' ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}`}>
            {result === 'pass' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
            {result === 'pass' ? 'Challenge completed! 🎉' : 'Not quite right. Use the hint below!'}
          </div>
        )}

        <div className="flex-1 flex flex-col sm:flex-row overflow-hidden">
          {/* Description + Hint sidebar */}
          <div className="w-full sm:w-56 flex-shrink-0 border-b sm:border-b-0 sm:border-r border-border p-3 overflow-auto glass-card">
            <p className="text-xs text-muted-foreground mb-3">{selected.description}</p>
            <button onClick={() => setShowHint(!showHint)}
              className="flex items-center gap-1.5 text-xs text-warning hover:text-warning/80 transition-colors">
              <Lightbulb className="w-3.5 h-3.5" />
              {showHint ? 'Hide Hint' : 'Show Hint'}
            </button>
            {showHint && (
              <div className="mt-2 p-2 bg-warning/10 border border-warning/20 rounded-lg text-xs text-warning">
                💡 {selected.hint}
              </div>
            )}
          </div>

          {/* Editor with file tabs */}
          <div className="flex-1 flex flex-col min-w-0">
            <div className="flex items-center border-b border-border glass-card">
              {(['html', 'css', 'js'] as FileTab[]).map(tab => (
                <button key={tab} onClick={() => setFileTab(tab)}
                  className={`px-3 py-2 text-[10px] font-mono transition-colors border-b-2 ${
                    fileTab === tab ? 'text-foreground border-primary bg-background' : 'text-muted-foreground border-transparent hover:text-foreground hover:bg-secondary/20'
                  }`}>
                  {tab === 'html' ? 'index.html' : tab === 'css' ? 'style.css' : 'script.js'}
                </button>
              ))}
            </div>
            <div className="flex-1 min-h-0">
              <CodeEditor code={currentCode} onChange={setCurrentCode}
                language={fileTab === 'html' ? 'html' : fileTab === 'css' ? 'css' : 'javascript'} />
            </div>
            <ConsolePanel logs={consoleLogs} onClear={() => setConsoleLogs([])} />
          </div>

          {/* Preview */}
          <div className="hidden sm:flex flex-1 flex-col min-w-0 border-l border-border">
            <div className="px-3 py-2 border-b border-border text-[10px] text-muted-foreground font-mono glass-card flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" /> Preview
            </div>
            <div className="flex-1 min-h-0">
              <LivePreview html={htmlCode} css={cssCode} js={jsCode} onConsoleLog={handleConsoleLog} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden animated-bg">
      <div className="glow-orb glow-primary w-48 h-48 top-20 -right-10 opacity-20" />

      <header className="border-b border-border glass-card px-4 sm:px-6 py-3 flex items-center gap-3 relative z-10">
        <button onClick={() => navigate('/dashboard')} className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <Trophy className="w-4 h-4 text-primary" />
        <span className="text-base font-bold gradient-text font-mono">Coding Challenges</span>
      </header>

      <div className="max-w-3xl mx-auto p-4 sm:p-6 space-y-3 relative z-10">
        {challenges.map(ch => {
          const completed = user.completedLessons.includes(`challenge-${ch.id}`);
          return (
            <button key={ch.id} onClick={() => startChallenge(ch)}
              className="w-full glass-card rounded-xl p-4 text-left hover:border-primary/20 hover:neon-border-subtle transition-all flex items-center justify-between group">
              <div className="flex items-center gap-3 min-w-0">
                {completed && <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />}
                <div className="min-w-0">
                  <h3 className="font-semibold text-foreground text-sm truncate group-hover:text-primary transition-colors">{ch.title}</h3>
                  <p className="text-[10px] text-muted-foreground mt-0.5 truncate">{ch.description}</p>
                </div>
              </div>
              <span className={`text-[10px] px-2.5 py-1 rounded-full font-medium flex-shrink-0 ml-2 ${
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
