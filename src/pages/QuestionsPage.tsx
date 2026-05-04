import { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, XCircle, ArrowRight, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';

interface Question {
  q: string;
  options: string[];
  answer: number; // index of correct option
}

const QUESTION_BATCHES: Question[][] = [
  // Batch 1 - Computer Basics
  [
    { q: 'What does CPU stand for?', options: ['Central Processing Unit', 'Computer Personal Unit', 'Central Program Utility', 'Core Processing Unit'], answer: 0 },
    { q: 'Which of these is an input device?', options: ['Monitor', 'Printer', 'Keyboard', 'Speaker'], answer: 2 },
    { q: 'What does RAM stand for?', options: ['Read Access Memory', 'Random Access Memory', 'Run Application Memory', 'Rapid Access Module'], answer: 1 },
    { q: 'What is the brain of a computer?', options: ['RAM', 'Hard Drive', 'CPU', 'GPU'], answer: 2 },
    { q: 'Which protocol is used to browse the web?', options: ['FTP', 'SMTP', 'HTTP', 'SSH'], answer: 2 },
    { q: 'What does HTML stand for?', options: ['Hyper Text Markup Language', 'High Tech Modern Language', 'Hyper Transfer Markup Language', 'Home Tool Markup Language'], answer: 0 },
    { q: 'What is an IP address?', options: ['Internet Protocol address', 'Internal Program address', 'Internet Packet address', 'Input Process address'], answer: 0 },
    { q: 'Which layer of OSI model handles routing?', options: ['Physical', 'Data Link', 'Network', 'Transport'], answer: 2 },
    { q: 'What does DNS stand for?', options: ['Domain Name System', 'Digital Network Service', 'Data Name Server', 'Domain Network System'], answer: 0 },
    { q: 'Which tag is used for the largest heading in HTML?', options: ['<heading>', '<h6>', '<h1>', '<head>'], answer: 2 },
  ],
  // Batch 2 - Networking
  [
    { q: 'What is a firewall?', options: ['A type of virus', 'Network security system', 'A web browser', 'A programming language'], answer: 1 },
    { q: 'How many layers does the OSI model have?', options: ['5', '6', '7', '4'], answer: 2 },
    { q: 'What is a MAC address?', options: ['Email address', 'Hardware address', 'IP address', 'Web address'], answer: 1 },
    { q: 'What does LAN stand for?', options: ['Large Area Network', 'Local Access Node', 'Local Area Network', 'Long Area Network'], answer: 2 },
    { q: 'Which port does HTTP use by default?', options: ['21', '22', '443', '80'], answer: 3 },
    { q: 'What is a router?', options: ['A type of cable', 'Forwards data packets between networks', 'A web server', 'An operating system'], answer: 1 },
    { q: 'What does TCP stand for?', options: ['Transfer Control Protocol', 'Transmission Control Protocol', 'Technical Control Program', 'Total Connection Protocol'], answer: 1 },
    { q: 'Which CSS property changes text color?', options: ['font-color', 'text-color', 'color', 'foreground'], answer: 2 },
    { q: 'What is localhost?', options: ['A remote server', 'Your own computer', 'A cloud service', 'A domain name'], answer: 1 },
    { q: 'What does the <p> tag do in HTML?', options: ['Creates a page', 'Creates a paragraph', 'Creates a picture', 'Creates a panel'], answer: 1 },
  ],
  // Batch 3 - HTML & Web Basics
  [
    { q: 'Which tag creates a link?', options: ['<link>', '<a>', '<href>', '<url>'], answer: 1 },
    { q: 'What is CSS used for?', options: ['Database management', 'Styling web pages', 'Server scripting', 'Network security'], answer: 1 },
    { q: 'What does the <img> tag need?', options: ['href attribute', 'src attribute', 'link attribute', 'url attribute'], answer: 1 },
    { q: 'Which is NOT a programming language?', options: ['Python', 'HTML', 'Java', 'JavaScript'], answer: 1 },
    { q: 'What creates a numbered list?', options: ['<ul>', '<nl>', '<ol>', '<list>'], answer: 2 },
    { q: 'Which attribute opens link in new tab?', options: ['target="_new"', 'target="_blank"', 'new="true"', 'open="_blank"'], answer: 1 },
    { q: 'What is the correct HTML element for inserting a line break?', options: ['<break>', '<lb>', '<br>', '<newline>'], answer: 2 },
    { q: 'What does the <strong> tag do?', options: ['Makes text italic', 'Makes text bold', 'Makes text underlined', 'Makes text bigger'], answer: 1 },
    { q: 'Where do you put JavaScript in HTML?', options: ['<javascript>', '<js>', '<script>', '<code>'], answer: 2 },
    { q: 'What is a boolean value?', options: ['A number', 'True or False', 'A string', 'An array'], answer: 1 },
  ],
  // Batch 4 - CSS
  [
    { q: 'Which property changes background color?', options: ['bgcolor', 'background-color', 'color-background', 'bg-color'], answer: 1 },
    { q: 'What does "margin" do in CSS?', options: ['Adds space inside element', 'Adds space outside element', 'Changes font size', 'Changes border'], answer: 1 },
    { q: 'How do you select an element by ID?', options: ['.myId', '#myId', '*myId', '@myId'], answer: 1 },
    { q: 'Which display value hides an element?', options: ['hidden', 'none', 'invisible', 'collapse'], answer: 1 },
    { q: 'What is flexbox?', options: ['A JavaScript library', 'A CSS layout model', 'An HTML tag', 'A browser'], answer: 1 },
    { q: 'How do you make text italic in CSS?', options: ['font-style: italic', 'text-style: italic', 'font: italic', 'style: italic'], answer: 0 },
    { q: 'Which unit is relative to parent font size?', options: ['px', 'em', 'cm', 'pt'], answer: 1 },
    { q: 'What does z-index control?', options: ['Font size', 'Element stacking order', 'Margin', 'Opacity'], answer: 1 },
    { q: 'How do you select all <p> elements?', options: ['#p', '.p', 'p', '*p'], answer: 2 },
    { q: 'What is "padding" in CSS?', options: ['Space outside element', 'Space inside element', 'Border width', 'Text spacing'], answer: 1 },
  ],
  // Batch 5 - JavaScript Basics
  [
    { q: 'Which keyword declares a variable in JS?', options: ['var', 'variable', 'v', 'dim'], answer: 0 },
    { q: 'What does === do?', options: ['Assignment', 'Strict equality check', 'Loose equality', 'Not equal'], answer: 1 },
    { q: 'How do you write a comment in JS?', options: ['<!-- comment -->', '// comment', '** comment **', '## comment'], answer: 1 },
    { q: 'What is an array?', options: ['A single value', 'A function', 'An ordered list of values', 'A CSS property'], answer: 2 },
    { q: 'How do you print to the console?', options: ['print()', 'console.log()', 'log()', 'echo()'], answer: 1 },
    { q: 'What is a function?', options: ['A CSS selector', 'Reusable block of code', 'An HTML tag', 'A data type'], answer: 1 },
    { q: 'What does NaN mean?', options: ['Not a Name', 'Not a Number', 'No Answer Needed', 'New Array Number'], answer: 1 },
    { q: 'Which loop runs at least once?', options: ['for', 'while', 'do...while', 'forEach'], answer: 2 },
    { q: 'What is "null" in JavaScript?', options: ['Zero', 'Undefined', 'Intentional absence of value', 'An error'], answer: 2 },
    { q: 'How do you create an object?', options: ['[]', '()', '{}', '<>'], answer: 2 },
  ],
  // Batch 6 - More Networking
  [
    { q: 'What is bandwidth?', options: ['A type of cable', 'Data transfer capacity', 'A protocol', 'A server type'], answer: 1 },
    { q: 'What is HTTPS?', options: ['Insecure HTTP', 'Secure HTTP', 'A file format', 'A server'], answer: 1 },
    { q: 'What does WAN stand for?', options: ['Wide Area Network', 'Web Access Node', 'Wireless Area Network', 'World Access Network'], answer: 0 },
    { q: 'What is a subnet mask?', options: ['A firewall setting', 'Divides IP into network/host', 'A type of virus', 'A browser plugin'], answer: 1 },
    { q: 'What is ping used for?', options: ['Testing network connectivity', 'Sending emails', 'Creating websites', 'Downloading files'], answer: 0 },
    { q: 'What is a gateway?', options: ['A web page', 'Entry point to another network', 'A database', 'An HTML element'], answer: 1 },
    { q: 'Which protocol transfers files?', options: ['HTTP', 'FTP', 'SMTP', 'DNS'], answer: 1 },
    { q: 'What is an ethernet cable?', options: ['Power cable', 'Wired network cable', 'USB cable', 'Audio cable'], answer: 1 },
    { q: 'What does ISP stand for?', options: ['Internet Service Provider', 'Internal System Program', 'Internet Safety Protocol', 'Input Signal Processor'], answer: 0 },
    { q: 'What is cloud computing?', options: ['Weather forecasting', 'Remote computing services', 'A programming language', 'A type of hardware'], answer: 1 },
  ],
  // Batch 7 - DOM & Events
  [
    { q: 'What is the DOM?', options: ['A CSS framework', 'Document Object Model', 'A JavaScript library', 'A server'], answer: 1 },
    { q: 'How do you get an element by ID?', options: ['getElement()', 'document.getElementById()', 'findById()', 'select()'], answer: 1 },
    { q: 'What is an event listener?', options: ['A CSS property', 'Waits for user actions', 'A server', 'An HTML tag'], answer: 1 },
    { q: 'Which event fires on a click?', options: ['onhover', 'onclick', 'onpress', 'ontouch'], answer: 1 },
    { q: 'What is event bubbling?', options: ['Events flow from child to parent', 'Events only fire once', 'Events go from parent to child', 'Events are cancelled'], answer: 0 },
    { q: 'How do you change text content?', options: ['innerHTML', 'textContent', 'Both A and B', 'setText()'], answer: 2 },
    { q: 'What is querySelector?', options: ['A database query', 'Selects first matching element', 'A CSS property', 'An HTML tag'], answer: 1 },
    { q: 'What does preventDefault() do?', options: ['Stops the default action', 'Prevents CSS', 'Deletes element', 'Stops JavaScript'], answer: 0 },
    { q: 'Which method adds a class?', options: ['addClass()', 'classList.add()', 'setClass()', 'appendClass()'], answer: 1 },
    { q: 'What creates a new HTML element?', options: ['document.createElement()', 'new Element()', 'makeElement()', 'buildElement()'], answer: 0 },
  ],
  // Batch 8 - Git & Version Control
  [
    { q: 'What is Git?', options: ['A programming language', 'A version control system', 'A web browser', 'A CSS framework'], answer: 1 },
    { q: 'What does "git init" do?', options: ['Deletes a repo', 'Initializes a new repo', 'Clones a repo', 'Pushes code'], answer: 1 },
    { q: 'What does "git commit" do?', options: ['Uploads code', 'Saves a snapshot', 'Deletes files', 'Creates a branch'], answer: 1 },
    { q: 'What is a branch in Git?', options: ['A copy of the code', 'A separate line of development', 'A file', 'A commit'], answer: 1 },
    { q: 'What does "git push" do?', options: ['Downloads code', 'Uploads commits to remote', 'Merges branches', 'Creates files'], answer: 1 },
    { q: 'What is GitHub?', options: ['A Git command', 'A hosting platform for Git repos', 'A text editor', 'A language'], answer: 1 },
    { q: 'What does "git clone" do?', options: ['Creates a branch', 'Copies a remote repo locally', 'Deletes a repo', 'Merges code'], answer: 1 },
    { q: 'What is a merge conflict?', options: ['A Git error', 'When two changes conflict', 'A broken commit', 'A deleted branch'], answer: 1 },
    { q: 'What file tells Git what to ignore?', options: ['.gitconfig', '.gitignore', '.gitskip', '.gitexclude'], answer: 1 },
    { q: 'What is a pull request?', options: ['A Git download', 'A request to merge changes', 'A branch deletion', 'A commit'], answer: 1 },
  ],
  // Batch 9 - React Basics
  [
    { q: 'What is React?', options: ['A CSS framework', 'A JavaScript library for UI', 'A database', 'A server language'], answer: 1 },
    { q: 'What is JSX?', options: ['JavaScript XML syntax', 'A CSS preprocessor', 'A Node module', 'A testing tool'], answer: 0 },
    { q: 'What is a component in React?', options: ['A CSS class', 'A reusable UI piece', 'An HTML tag', 'A database table'], answer: 1 },
    { q: 'What hook manages state?', options: ['useEffect', 'useState', 'useRef', 'useMemo'], answer: 1 },
    { q: 'What are props?', options: ['CSS properties', 'Data passed to components', 'JavaScript variables', 'HTML attributes'], answer: 1 },
    { q: 'What does useEffect do?', options: ['Manages state', 'Handles side effects', 'Creates routes', 'Styles components'], answer: 1 },
    { q: 'How do you render a list in React?', options: ['for loop', '.map()', 'while loop', 'forEach()'], answer: 1 },
    { q: 'What is the virtual DOM?', options: ['The actual DOM', 'A lightweight copy of the DOM', 'A CSS model', 'A database'], answer: 1 },
    { q: 'What is conditional rendering?', options: ['Rendering CSS conditionally', 'Showing UI based on conditions', 'A hook type', 'Server rendering'], answer: 1 },
    { q: 'What creates a React app?', options: ['npm init', 'create-react-app', 'react-new', 'npm start'], answer: 1 },
  ],
  // Batch 10 - Mixed Advanced
  [
    { q: 'What is an API?', options: ['A programming language', 'Application Programming Interface', 'A browser', 'A CSS property'], answer: 1 },
    { q: 'What does JSON stand for?', options: ['JavaScript Object Notation', 'Java Standard Object Naming', 'JavaScript Online Node', 'Java Script Open Network'], answer: 0 },
    { q: 'What is async/await?', options: ['A CSS feature', 'Handles asynchronous code', 'An HTML tag', 'A Git command'], answer: 1 },
    { q: 'What is npm?', options: ['A browser', 'Node Package Manager', 'A database', 'A CSS framework'], answer: 1 },
    { q: 'What is responsive design?', options: ['Fast loading', 'Adapting to screen sizes', 'Server-side rendering', 'A JavaScript pattern'], answer: 1 },
    { q: 'What is localStorage?', options: ['Server storage', 'Browser storage for key-value data', 'A database', 'Cloud storage'], answer: 1 },
    { q: 'What does fetch() do?', options: ['Creates elements', 'Makes HTTP requests', 'Styles pages', 'Manages state'], answer: 1 },
    { q: 'What is a Promise?', options: ['A CSS value', 'An object representing async result', 'An HTML element', 'A variable type'], answer: 1 },
    { q: 'What is TypeScript?', options: ['A new language', 'JavaScript with types', 'A CSS preprocessor', 'A testing framework'], answer: 1 },
    { q: 'What is deployment?', options: ['Writing code', 'Making app available to users', 'Testing code', 'Designing UI'], answer: 1 },
  ],
];

const QuestionsPage = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  // Determine today's batch
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  const batchIndex = dayOfYear % QUESTION_BATCHES.length;
  const questions = QUESTION_BATCHES[batchIndex];

  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState<boolean[]>(new Array(10).fill(false));
  const [correct, setCorrect] = useState(0);
  const [showResult, setShowResult] = useState(false);

  if (!user) { navigate('/auth'); return null; }

  const question = questions[currentQ];

  const handleSelect = (idx: number) => {
    if (answered[currentQ]) return;
    setSelected(idx);
    const newAnswered = [...answered];
    newAnswered[currentQ] = true;
    setAnswered(newAnswered);
    if (idx === question.answer) setCorrect(c => c + 1);
  };

  const handleNext = () => {
    if (currentQ < 9) {
      setCurrentQ(c => c + 1);
      setSelected(null);
    } else {
      setShowResult(true);
    }
  };

  const handleRetry = () => {
    setCurrentQ(0);
    setSelected(null);
    setAnswered(new Array(10).fill(false));
    setCorrect(0);
    setShowResult(false);
  };

  if (showResult) {
    return (
      <div className="min-h-screen bg-background grid-bg flex items-center justify-center p-4">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-card p-8 rounded-2xl text-center max-w-sm w-full">
          <div className="text-5xl mb-4">{correct >= 7 ? '🎉' : correct >= 5 ? '👍' : '📚'}</div>
          <h2 className="text-2xl font-bold font-display text-foreground mb-2">Quiz Complete!</h2>
          <p className="text-3xl font-bold text-primary mb-1">{correct}/10</p>
          <p className="text-sm text-muted-foreground mb-4">
            {correct >= 7 ? 'Excellent! Great knowledge!' : correct >= 5 ? 'Good effort! Keep learning!' : 'Keep practicing, you\'ll get there!'}
          </p>
          <p className="text-[10px] text-muted-foreground mb-4">Batch {batchIndex + 1} of {QUESTION_BATCHES.length} • New questions tomorrow</p>
          <button onClick={handleRetry} className="flex items-center gap-2 mx-auto bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-semibold text-sm">
            <RotateCcw className="w-4 h-4" /> Retry
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background grid-bg">
      <div className="max-w-lg mx-auto p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold font-display text-foreground">Daily Questions</h1>
          <span className="text-xs text-muted-foreground font-mono">Batch {batchIndex + 1}</span>
        </div>

        {/* Progress dots */}
        <div className="flex gap-1.5 justify-center">
          {questions.map((_, i) => (
            <div key={i} className={`w-2.5 h-2.5 rounded-full transition-all ${
              i === currentQ ? 'bg-primary scale-125' : answered[i] ? 'bg-primary/40' : 'bg-secondary/50'
            }`} />
          ))}
        </div>

        {/* Question */}
        <motion.div key={currentQ} initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="glass-card p-5 rounded-2xl">
          <p className="text-xs text-muted-foreground mb-1 font-mono">Question {currentQ + 1}/10</p>
          <p className="text-sm font-semibold text-foreground mb-4">{question.q}</p>

          <div className="space-y-2">
            {question.options.map((opt, i) => {
              const isAnswered = answered[currentQ];
              const isCorrectOption = i === question.answer;
              const isSelected = selected === i;
              return (
                <button key={i} onClick={() => handleSelect(i)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-xs font-medium transition-all border ${
                    isAnswered && isCorrectOption ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400' :
                    isAnswered && isSelected && !isCorrectOption ? 'bg-red-500/15 border-red-500/40 text-red-400' :
                    isSelected ? 'bg-primary/10 border-primary/30 text-primary' :
                    'bg-secondary/20 border-border/30 text-foreground hover:bg-secondary/40'
                  }`}
                >
                  <span className="mr-2 font-mono">{String.fromCharCode(65 + i)}.</span>
                  {opt}
                  {isAnswered && isCorrectOption && <CheckCircle2 className="w-4 h-4 inline ml-2" />}
                  {isAnswered && isSelected && !isCorrectOption && <XCircle className="w-4 h-4 inline ml-2" />}
                </button>
              );
            })}
          </div>

          {answered[currentQ] && (
            <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              onClick={handleNext}
              className="mt-4 w-full bg-primary text-primary-foreground py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2">
              {currentQ < 9 ? <>Next <ArrowRight className="w-4 h-4" /></> : 'See Results'}
            </motion.button>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default QuestionsPage;
