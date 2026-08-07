// src/data/challenges.ts

export type Tier = 'Easy' | 'Medium' | 'Hard' | 'Complex';
export type Language = 'frontend' | 'python' | 'java';

export interface ChallengeDef {
  id: string;
  title: string;
  tier: Tier;
  description: string;
  language: Language; // NEW: Determines editor mode
  xp: number;
  hint: string;
  validationKeywords: string[];
  
  // Frontend specific
  initialHtml?: string;
  initialCss?: string;
  initialJs?: string;
  
  // Python/Java specific (Single file)
  initialCode?: string; 
}

const base = (extra = '') => `body { font-family: Arial; background: #0f0a2e; color: white; padding: 24px; margin: 0; }\n${extra}`;

export const CHALLENGES: ChallengeDef[] = [
  // ==========================================
  // FRONTEND CHALLENGES (Existing)
  // ==========================================
  
  // ===== EASY =====
  {
    id: 'e1', title: 'Profile Card', tier: 'Easy', xp: 10, language: 'frontend',
    description: 'Build a profile card with an <img>, <h2> name, and <p> bio.',
    initialHtml: `<!DOCTYPE html><html><head><link rel="stylesheet" href="style.css"></head><body>\n  <!-- profile card -->\n</body></html>`,
    initialCss: base('.card{background:#1a1040;padding:24px;border-radius:16px;text-align:center;max-width:280px;margin:0 auto}img{border-radius:50%;width:96px}'),
    initialJs: '', validationKeywords: ['<img', '<h2', '<p'], hint: 'Wrap img, h2 and p inside a div.card.',
  },
  {
    id: 'e2', title: 'Nav Bar', tier: 'Easy', xp: 10, language: 'frontend',
    description: 'Make a <nav> with 4 styled <a> links.',
    initialHtml: `<!DOCTYPE html><html><head><link rel="stylesheet" href="style.css"></head><body>\n  <!-- nav -->\n</body></html>`,
    initialCss: base('nav{background:#1a1040;padding:14px;display:flex;gap:16px}nav a{color:#e98a2e;text-decoration:none}'),
    initialJs: '', validationKeywords: ['<nav', '<a', 'href'], hint: '4 <a href="#"> inside <nav>.',
  },
  {
    id: 'e3', title: 'Counter', tier: 'Easy', xp: 10, language: 'frontend',
    description: 'Counter with +/-/Reset buttons updating <h1 id="count">.',
    initialHtml: `<!DOCTYPE html><html><head><link rel="stylesheet" href="style.css"></head><body>\n  <h1 id="count">0</h1>\n  <!-- buttons -->\n  <script src="script.js"></script>\n</body></html>`,
    initialCss: base('h1{font-size:3rem;color:#e98a2e;text-align:center}button{padding:8px 18px;margin:4px;border-radius:8px;border:none;cursor:pointer}'),
    initialJs: `let count = 0;\n// wire up the buttons`,
    validationKeywords: ['button', 'addeventlistener'], hint: 'Use addEventListener and update document.getElementById("count").innerText.',
  },
  
  // ===== MEDIUM =====
  {
    id: 'm1', title: 'Todo List', tier: 'Medium', xp: 20, language: 'frontend',
    description: 'Add todos to a <ul> using createElement + appendChild.',
    initialHtml: `<!DOCTYPE html><html><head><link rel="stylesheet" href="style.css"></head><body>\n  <input id="i"><button onclick="add()">Add</button>\n  <ul id="list"></ul>\n  <script src="script.js"></script>\n</body></html>`,
    initialCss: base('li{background:#1a1040;padding:8px;margin:4px 0;border-radius:6px;list-style:none}'),
    initialJs: `function add(){\n  // create li, append to #list\n}`,
    validationKeywords: ['createelement', 'appendchild'], hint: 'document.createElement("li") + appendChild on #list.',
  },
  {
    id: 'm2', title: 'Toggle Theme', tier: 'Medium', xp: 20, language: 'frontend',
    description: 'Button that toggles a "dark" class on <body>.',
    initialHtml: `<!DOCTYPE html><html><head><link rel="stylesheet" href="style.css"></head><body>\n  <button onclick="toggle()">Toggle</button>\n  <script src="script.js"></script>\n</body></html>`,
    initialCss: base('.dark{background:#000;color:#fff}'),
    initialJs: `function toggle(){\n  // toggle dark class on body\n}`,
    validationKeywords: ['classlist', 'toggle'], hint: 'document.body.classList.toggle("dark").',
  },

  // ===== HARD =====
  {
    id: 'h1', title: 'Stopwatch', tier: 'Hard', xp: 35, language: 'frontend',
    description: 'Start/Stop/Reset stopwatch updating mm:ss.ms every 10ms.',
    initialHtml: `<!DOCTYPE html><html><head><link rel="stylesheet" href="style.css"></head><body>\n  <h1 id="t">00:00.00</h1>\n  <button onclick="start()">Start</button><button onclick="stop()">Stop</button><button onclick="reset()">Reset</button>\n  <script src="script.js"></script>\n</body></html>`,
    initialCss: base('h1{font-size:3rem;color:#22c55e;text-align:center;font-family:monospace}'),
    initialJs: `let id, ms = 0;\nfunction start(){}\nfunction stop(){}\nfunction reset(){}`,
    validationKeywords: ['setinterval', 'clearinterval'],
    hint: 'setInterval(()=>ms+=10,10), update DOM, clearInterval on stop.',
  },
  {
    id: 'h3', title: 'Fetch Cat Facts', tier: 'Hard', xp: 35, language: 'frontend',
    description: 'On button click, fetch https://catfact.ninja/fact and show the fact.',
    initialHtml: `<!DOCTYPE html><html><head><link rel="stylesheet" href="style.css"></head><body>\n  <button onclick="go()">Fact</button><p id="o"></p>\n  <script src="script.js"></script>\n</body></html>`,
    initialCss: base(''),
    initialJs: `async function go(){\n  // fetch and display\n}`,
    validationKeywords: ['fetch', 'await', 'json'],
    hint: 'const r = await fetch(url); const d = await r.json(); o.innerText = d.fact.',
  },

  // ===== COMPLEX =====
  {
    id: 'c2', title: 'Tic Tac Toe', tier: 'Complex', xp: 50, language: 'frontend',
    description: '3×3 grid, alternating X/O, detect win or draw.',
    initialHtml: `<!DOCTYPE html><html><head><link rel="stylesheet" href="style.css"></head><body>\n  <div id="b" class="board"></div><p id="msg"></p>\n  <script src="script.js"></script>\n</body></html>`,
    initialCss: base('.board{display:grid;grid-template-columns:repeat(3,80px);gap:4px}.cell{width:80px;height:80px;background:#1a1040;display:flex;align-items:center;justify-content:center;font-size:2rem;cursor:pointer}'),
    initialJs: `// render 9 cells, handle clicks, detect winner`,
    validationKeywords: ['createelement', 'addeventlistener', 'function'],
    hint: 'Track [9] array, switch turn, check 8 winning lines.',
  },

  // ==========================================
  // PYTHON CHALLENGES (New)
  // ==========================================
  {
    id: 'py-e1', title: 'Hello Python', tier: 'Easy', xp: 10, language: 'python',
    description: 'Use the print function to output "Hello Codesage".',
    initialCode: '# Write your code below\n',
    validationKeywords: ['print', 'hello codesage'],
    hint: 'Use print("Hello Codesage")',
  },
  {
    id: 'py-e2', title: 'Variable Math', tier: 'Easy', xp: 10, language: 'python',
    description: 'Create variables x=10, y=5 and print their sum.',
    initialCode: '# Define x and y, then print sum\n',
    validationKeywords: ['x', '=', '10', 'y', '5', 'print', '+'],
    hint: 'x = 10\\ny = 5\\nprint(x + y)',
  },
  {
    id: 'py-m1', title: 'The For Loop', tier: 'Medium', xp: 20, language: 'python',
    description: 'Create a loop that prints numbers 0 to 4.',
    initialCode: '# Use range()\n',
    validationKeywords: ['for', 'range', '5', 'print'],
    hint: 'for i in range(5): print(i)',
  },
  {
    id: 'py-m2', title: 'List Filter', tier: 'Medium', xp: 20, language: 'python',
    description: 'Given a list of numbers, create a new list with only even numbers.',
    initialCode: 'nums = [1, 2, 3, 4, 5, 6]\nevens = []\n# Your code here\n',
    validationKeywords: ['for', 'if', '%', '2', 'append'],
    hint: 'Loop through nums, if n % 2 == 0, append to evens.',
  },
  {
    id: 'py-h1', title: 'Factorial Function', tier: 'Hard', xp: 35, language: 'python',
    description: 'Write a function factorial(n) that returns the factorial of n.',
    initialCode: 'def factorial(n):\n    # return result\n    pass\n',
    validationKeywords: ['def', 'factorial', 'return', 'if', 'else'],
    hint: 'Base case: if n <= 1 return 1. Else return n * factorial(n-1).',
  },
  {
    id: 'py-c1', title: 'Class Definition', tier: 'Complex', xp: 50, language: 'python',
    description: 'Create a class Dog with __init__ taking name, and a method bark().',
    initialCode: 'class Dog:\n    # Define __init__ and bark\n    pass\n',
    validationKeywords: ['class', 'dog', '__init__', 'self', 'def', 'bark'],
    hint: 'def __init__(self, name): self.name = name',
  },

  // ==========================================
  // JAVA CHALLENGES (New)
  // ==========================================
  {
    id: 'java-e1', title: 'Java Hello World', tier: 'Easy', xp: 10, language: 'java',
    description: 'Write the standard main method and print "Hello Codesage".',
    initialCode: 'public class Main {\n  public static void main(String[] args) {\n    // Print here\n  }\n}',
    validationKeywords: ['system.out.println', 'hello codesage'],
    hint: 'System.out.println("Hello Codesage");',
  },
  {
    id: 'java-e2', title: 'Integer Sum', tier: 'Easy', xp: 10, language: 'java',
    description: 'Declare two ints, sum them, and print the result.',
    initialCode: 'public class Main {\n  public static void main(String[] args) {\n    // int a = ... \n  }\n}',
    validationKeywords: ['int', '=', '+', 'system.out.println'],
    hint: 'int a = 5; int b = 10; System.out.println(a+b);',
  },
  {
    id: 'java-m1', title: 'For Loop', tier: 'Medium', xp: 20, language: 'java',
    description: 'Write a for loop that prints 1 to 5.',
    initialCode: 'public class Main {\n  public static void main(String[] args) {\n    // Loop here\n  }\n}',
    validationKeywords: ['for', 'int', 'i', '++', 'system.out.println'],
    hint: 'for(int i=1; i<=5; i++) { ... }',
  },
  {
    id: 'java-m2', title: 'If Else', tier: 'Medium', xp: 20, language: 'java',
    description: 'Check if variable age is >= 18. Print "Adult" or "Minor".',
    initialCode: 'public class Main {\n  public static void main(String[] args) {\n    int age = 20;\n    // Check here\n  }\n}',
    validationKeywords: ['if', 'else', '>=', '18', 'adult', 'minor'],
    hint: 'if (age >= 18) { ... } else { ... }',
  },
  {
    id: 'java-h1', title: 'Array Sum', tier: 'Hard', xp: 35, language: 'java',
    description: 'Sum all elements in an int array using a loop.',
    initialCode: 'public class Main {\n  public static void main(String[] args) {\n    int[] nums = {1, 2, 3, 4};\n    int sum = 0;\n    // Loop and sum\n  }\n}',
    validationKeywords: ['for', 'int', 'sum', '+=', 'nums.length'],
    hint: 'for(int i=0; i<nums.length; i++) sum += nums[i];',
  },
  {
    id: 'java-c1', title: 'Java Class', tier: 'Complex', xp: 50, language: 'java',
    description: 'Create a class Car with a constructor and a drive() method.',
    initialCode: 'public class Main {\n  // Define class Car here\n}\n\nclass Car {\n  // Constructor and method\n}',
    validationKeywords: ['class', 'car', 'public', 'car(', 'void', 'drive'],
    hint: 'class Car { public Car() {} public void drive() {} }',
  },
];

export const TIER_INFO: Record<Tier, { label: string; icon: string; chip: string; tab: string }> = {
  Easy:    { label: 'Easy',    icon: '🌱', chip: 'bg-success/20 text-success',         tab: 'bg-success/20 border-success/40 text-success' },
  Medium:  { label: 'Medium',  icon: '⚡', chip: 'bg-warning/20 text-warning',         tab: 'bg-warning/20 border-warning/40 text-warning' },
  Hard:    { label: 'Hard',    icon: '🔥', chip: 'bg-destructive/20 text-destructive', tab: 'bg-destructive/20 border-destructive/40 text-destructive' },
  Complex: { label: 'Complex', icon: '💎', chip: 'bg-primary/20 text-primary',         tab: 'bg-primary/20 border-primary/40 text-primary' },
};
