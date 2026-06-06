export type Tier = 'Easy' | 'Medium' | 'Hard' | 'Complex';

export interface ChallengeDef {
  id: string;
  title: string;
  tier: Tier;
  description: string;
  initialHtml: string;
  initialCss: string;
  initialJs: string;
  validationKeywords: string[];
  hint: string;
  xp: number;
}

const base = (extra = '') => `body { font-family: Arial; background: #0f0a2e; color: white; padding: 24px; margin: 0; }\n${extra}`;

export const CHALLENGES: ChallengeDef[] = [
  // ===== EASY (6) =====
  {
    id: 'e1', title: 'Profile Card', tier: 'Easy', xp: 10,
    description: 'Build a profile card with an <img>, <h2> name, and <p> bio.',
    initialHtml: `<!DOCTYPE html><html><head><link rel="stylesheet" href="style.css"></head><body>\n  <!-- profile card -->\n</body></html>`,
    initialCss: base('.card{background:#1a1040;padding:24px;border-radius:16px;text-align:center;max-width:280px;margin:0 auto}img{border-radius:50%;width:96px}'),
    initialJs: '', validationKeywords: ['<img', '<h2', '<p'], hint: 'Wrap img, h2 and p inside a div.card.',
  },
  {
    id: 'e2', title: 'Nav Bar', tier: 'Easy', xp: 10,
    description: 'Make a <nav> with 4 styled <a> links.',
    initialHtml: `<!DOCTYPE html><html><head><link rel="stylesheet" href="style.css"></head><body>\n  <!-- nav -->\n</body></html>`,
    initialCss: base('nav{background:#1a1040;padding:14px;display:flex;gap:16px}nav a{color:#e98a2e;text-decoration:none}'),
    initialJs: '', validationKeywords: ['<nav', '<a', 'href'], hint: '4 <a href="#"> inside <nav>.',
  },
  {
    id: 'e3', title: 'Counter', tier: 'Easy', xp: 10,
    description: 'Counter with +/-/Reset buttons updating <h1 id="count">.',
    initialHtml: `<!DOCTYPE html><html><head><link rel="stylesheet" href="style.css"></head><body>\n  <h1 id="count">0</h1>\n  <!-- buttons -->\n  <script src="script.js"></script>\n</body></html>`,
    initialCss: base('h1{font-size:3rem;color:#e98a2e;text-align:center}button{padding:8px 18px;margin:4px;border-radius:8px;border:none;cursor:pointer}'),
    initialJs: `let count = 0;\n// wire up the buttons`,
    validationKeywords: ['button', 'addeventlistener'], hint: 'Use addEventListener and update document.getElementById("count").innerText.',
  },
  {
    id: 'e4', title: 'Hello Form', tier: 'Easy', xp: 10,
    description: 'Form with one input and a submit button that alerts the value.',
    initialHtml: `<!DOCTYPE html><html><head><link rel="stylesheet" href="style.css"></head><body>\n  <!-- form -->\n  <script src="script.js"></script>\n</body></html>`,
    initialCss: base('input,button{padding:10px;border-radius:6px;border:1px solid #333}'),
    initialJs: '', validationKeywords: ['<form', '<input', 'submit'], hint: 'Use <form onsubmit="..."> with <input> and submit button.',
  },
  {
    id: 'e5', title: 'Gallery Grid', tier: 'Easy', xp: 10,
    description: 'CSS Grid gallery with 4+ <img> placeholders.',
    initialHtml: `<!DOCTYPE html><html><head><link rel="stylesheet" href="style.css"></head><body>\n  <div class="gallery"><!-- 4 imgs --></div>\n</body></html>`,
    initialCss: base('.gallery{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:12px}.gallery img{width:100%;border-radius:8px}'),
    initialJs: '', validationKeywords: ['<img', 'grid'], hint: 'Add 4+ <img src="..."> inside .gallery.',
  },
  {
    id: 'e6', title: 'Centered Box', tier: 'Easy', xp: 10,
    description: 'Center a div using Flexbox (display:flex + justify+align center).',
    initialHtml: `<!DOCTYPE html><html><head><link rel="stylesheet" href="style.css"></head><body>\n  <div class="wrap"><div class="box">Centered</div></div>\n</body></html>`,
    initialCss: base('.wrap{height:100vh;}.box{background:#e98a2e;padding:24px;border-radius:12px}'),
    initialJs: '', validationKeywords: ['display:flex', 'justify-content', 'align-items'],
    hint: 'On .wrap: display:flex; justify-content:center; align-items:center.',
  },
  // ===== MEDIUM (6) =====
  {
    id: 'm1', title: 'Todo List', tier: 'Medium', xp: 20,
    description: 'Add todos to a <ul> using createElement + appendChild.',
    initialHtml: `<!DOCTYPE html><html><head><link rel="stylesheet" href="style.css"></head><body>\n  <input id="i"><button onclick="add()">Add</button>\n  <ul id="list"></ul>\n  <script src="script.js"></script>\n</body></html>`,
    initialCss: base('li{background:#1a1040;padding:8px;margin:4px 0;border-radius:6px;list-style:none}'),
    initialJs: `function add(){\n  // create li, append to #list\n}`,
    validationKeywords: ['createelement', 'appendchild'], hint: 'document.createElement("li") + appendChild on #list.',
  },
  {
    id: 'm2', title: 'Toggle Theme', tier: 'Medium', xp: 20,
    description: 'Button that toggles a "dark" class on <body>.',
    initialHtml: `<!DOCTYPE html><html><head><link rel="stylesheet" href="style.css"></head><body>\n  <button onclick="toggle()">Toggle</button>\n  <script src="script.js"></script>\n</body></html>`,
    initialCss: base('.dark{background:#000;color:#fff}'),
    initialJs: `function toggle(){\n  // toggle dark class on body\n}`,
    validationKeywords: ['classlist', 'toggle'], hint: 'document.body.classList.toggle("dark").',
  },
  {
    id: 'm3', title: 'Live Search Filter', tier: 'Medium', xp: 20,
    description: 'Filter list items as user types in an input.',
    initialHtml: `<!DOCTYPE html><html><head><link rel="stylesheet" href="style.css"></head><body>\n  <input id="s" placeholder="filter...">\n  <ul id="list"><li>Apple</li><li>Banana</li><li>Cherry</li></ul>\n  <script src="script.js"></script>\n</body></html>`,
    initialCss: base('li{padding:6px}'),
    initialJs: `// listen to input events on #s and hide non-matching <li>`,
    validationKeywords: ['addeventlistener', 'input', 'queryselectorall'],
    hint: 'document.querySelectorAll("li").forEach(li=>li.style.display=...).',
  },
  {
    id: 'm4', title: 'Accordion', tier: 'Medium', xp: 20,
    description: '3 panels — clicking the title shows/hides body. Only one open at a time.',
    initialHtml: `<!DOCTYPE html><html><head><link rel="stylesheet" href="style.css"></head><body>\n  <div class="acc"><h3>One</h3><p>body1</p></div>\n  <div class="acc"><h3>Two</h3><p>body2</p></div>\n  <script src="script.js"></script>\n</body></html>`,
    initialCss: base('.acc p{display:none}.acc.open p{display:block}h3{cursor:pointer}'),
    initialJs: `// click handlers to toggle .open and close siblings`,
    validationKeywords: ['queryselectorall', 'classlist'],
    hint: 'forEach acc → addEventListener click → remove .open from all, add to clicked.',
  },
  {
    id: 'm5', title: 'Tabbed Interface', tier: 'Medium', xp: 20,
    description: '3 tab buttons swap visible panel.',
    initialHtml: `<!DOCTYPE html><html><head><link rel="stylesheet" href="style.css"></head><body>\n  <div class="tabs"><button data-tab="a">A</button><button data-tab="b">B</button></div>\n  <div id="a" class="panel">A panel</div>\n  <div id="b" class="panel hidden">B panel</div>\n  <script src="script.js"></script>\n</body></html>`,
    initialCss: base('.hidden{display:none}.panel{padding:20px;background:#1a1040;border-radius:8px;margin-top:8px}'),
    initialJs: `// wire buttons to show matching panel and hide others`,
    validationKeywords: ['queryselectorall', 'addeventlistener', 'dataset'],
    hint: 'Read btn.dataset.tab, hide all .panel, then unhide matching id.',
  },
  {
    id: 'm6', title: 'Form Validation', tier: 'Medium', xp: 20,
    description: 'Email field — show "Invalid" message until @ appears.',
    initialHtml: `<!DOCTYPE html><html><head><link rel="stylesheet" href="style.css"></head><body>\n  <input id="e"><p id="msg"></p>\n  <script src="script.js"></script>\n</body></html>`,
    initialCss: base('#msg{color:#f87171}'),
    initialJs: `// listen for input on #e and set #msg`,
    validationKeywords: ['addeventlistener', 'input', 'includes'],
    hint: 'e.value.includes("@") → clear #msg; else set "Invalid".',
  },
  // ===== HARD (6) =====
  {
    id: 'h1', title: 'Stopwatch', tier: 'Hard', xp: 35,
    description: 'Start/Stop/Reset stopwatch updating mm:ss.ms every 10ms.',
    initialHtml: `<!DOCTYPE html><html><head><link rel="stylesheet" href="style.css"></head><body>\n  <h1 id="t">00:00.00</h1>\n  <button onclick="start()">Start</button><button onclick="stop()">Stop</button><button onclick="reset()">Reset</button>\n  <script src="script.js"></script>\n</body></html>`,
    initialCss: base('h1{font-size:3rem;color:#22c55e;text-align:center;font-family:monospace}'),
    initialJs: `let id, ms = 0;\nfunction start(){}\nfunction stop(){}\nfunction reset(){}`,
    validationKeywords: ['setinterval', 'clearinterval'],
    hint: 'setInterval(()=>ms+=10,10), update DOM, clearInterval on stop.',
  },
  {
    id: 'h2', title: 'Drag to Sort', tier: 'Hard', xp: 35,
    description: 'List items with draggable=true. Reorder them on drop.',
    initialHtml: `<!DOCTYPE html><html><head><link rel="stylesheet" href="style.css"></head><body>\n  <ul id="l"><li draggable="true">A</li><li draggable="true">B</li><li draggable="true">C</li></ul>\n  <script src="script.js"></script>\n</body></html>`,
    initialCss: base('li{padding:10px;background:#1a1040;margin:4px 0;border-radius:6px;list-style:none;cursor:move}'),
    initialJs: `// wire dragstart/dragover/drop`,
    validationKeywords: ['dragstart', 'dragover', 'drop'],
    hint: 'Use dragstart to store source, dragover preventDefault, drop to swap.',
  },
  {
    id: 'h3', title: 'Fetch Cat Facts', tier: 'Hard', xp: 35,
    description: 'On button click, fetch https://catfact.ninja/fact and show the fact.',
    initialHtml: `<!DOCTYPE html><html><head><link rel="stylesheet" href="style.css"></head><body>\n  <button onclick="go()">Fact</button><p id="o"></p>\n  <script src="script.js"></script>\n</body></html>`,
    initialCss: base(''),
    initialJs: `async function go(){\n  // fetch and display\n}`,
    validationKeywords: ['fetch', 'await', 'json'],
    hint: 'const r = await fetch(url); const d = await r.json(); o.innerText = d.fact.',
  },
  {
    id: 'h4', title: 'Local Notes', tier: 'Hard', xp: 35,
    description: 'Save & load notes from localStorage. Survive page reload.',
    initialHtml: `<!DOCTYPE html><html><head><link rel="stylesheet" href="style.css"></head><body>\n  <textarea id="n" rows="6" cols="40"></textarea><br>\n  <button onclick="save()">Save</button>\n  <script src="script.js"></script>\n</body></html>`,
    initialCss: base('textarea{padding:10px;background:#1a1040;color:#fff;border:1px solid #333;border-radius:6px}'),
    initialJs: `// onload: read localStorage 'note' into textarea\n// save(): write to localStorage`,
    validationKeywords: ['localstorage', 'setitem', 'getitem'],
    hint: 'localStorage.setItem("note", value) and getItem("note") on load.',
  },
  {
    id: 'h5', title: 'Modal Dialog', tier: 'Hard', xp: 35,
    description: 'Open/close a modal — close on overlay click + Escape key.',
    initialHtml: `<!DOCTYPE html><html><head><link rel="stylesheet" href="style.css"></head><body>\n  <button onclick="open()">Open</button>\n  <div id="m" class="hidden overlay"><div class="dlg">Hi<button onclick="close()">X</button></div></div>\n  <script src="script.js"></script>\n</body></html>`,
    initialCss: base('.overlay{position:fixed;inset:0;background:rgba(0,0,0,.7);display:flex;align-items:center;justify-content:center}.dlg{background:#1a1040;padding:24px;border-radius:12px}.hidden{display:none}'),
    initialJs: `// implement open(), close(), Escape key`,
    validationKeywords: ['addeventlistener', 'keydown', 'classlist'],
    hint: 'document.addEventListener("keydown", e=>e.key==="Escape"&&close()).',
  },
  {
    id: 'h6', title: 'Image Slider', tier: 'Hard', xp: 35,
    description: 'Carousel with Next/Prev buttons cycling 3 colored slides.',
    initialHtml: `<!DOCTYPE html><html><head><link rel="stylesheet" href="style.css"></head><body>\n  <div id="s" class="slider"><div class="slide" style="background:#e94560"></div><div class="slide hidden" style="background:#22c55e"></div><div class="slide hidden" style="background:#3b82f6"></div></div>\n  <button onclick="prev()">Prev</button><button onclick="next()">Next</button>\n  <script src="script.js"></script>\n</body></html>`,
    initialCss: base('.slide{height:240px;border-radius:12px}.hidden{display:none}'),
    initialJs: `let i = 0;\n// next() and prev() show only slides[i]`,
    validationKeywords: ['queryselectorall', 'classlist'],
    hint: 'Hide all .slide then unhide slides[i].',
  },
  // ===== COMPLEX (6) =====
  {
    id: 'c1', title: 'Mini Calculator', tier: 'Complex', xp: 50,
    description: 'Build a 4-op calculator with display + clear.',
    initialHtml: `<!DOCTYPE html><html><head><link rel="stylesheet" href="style.css"></head><body>\n  <div id="d">0</div>\n  <div id="pad"><!-- digit & op buttons --></div>\n  <script src="script.js"></script>\n</body></html>`,
    initialCss: base('#d{font-size:2rem;background:#000;padding:14px;border-radius:8px;text-align:right}button{width:48px;height:48px;margin:2px;border-radius:6px;border:none}'),
    initialJs: `// build a tiny state machine for + - * /`,
    validationKeywords: ['function', 'switch', 'innertext'],
    hint: 'Track current, operator, accumulator; eval on "=".',
  },
  {
    id: 'c2', title: 'Tic Tac Toe', tier: 'Complex', xp: 50,
    description: '3×3 grid, alternating X/O, detect win or draw.',
    initialHtml: `<!DOCTYPE html><html><head><link rel="stylesheet" href="style.css"></head><body>\n  <div id="b" class="board"></div><p id="msg"></p>\n  <script src="script.js"></script>\n</body></html>`,
    initialCss: base('.board{display:grid;grid-template-columns:repeat(3,80px);gap:4px}.cell{width:80px;height:80px;background:#1a1040;display:flex;align-items:center;justify-content:center;font-size:2rem;cursor:pointer}'),
    initialJs: `// render 9 cells, handle clicks, detect winner`,
    validationKeywords: ['createelement', 'addeventlistener', 'function'],
    hint: 'Track [9] array, switch turn, check 8 winning lines.',
  },
  {
    id: 'c3', title: 'Markdown Preview', tier: 'Complex', xp: 50,
    description: 'Textarea on left, live HTML preview on right. Support **bold** and # heading.',
    initialHtml: `<!DOCTYPE html><html><head><link rel="stylesheet" href="style.css"></head><body>\n  <textarea id="i" rows="10" cols="30"></textarea><div id="o"></div>\n  <script src="script.js"></script>\n</body></html>`,
    initialCss: base('body{display:flex;gap:20px}#o{flex:1;background:#1a1040;padding:14px;border-radius:8px}'),
    initialJs: `// input listener that transforms **x** to <b>x</b> etc.`,
    validationKeywords: ['addeventlistener', 'replace', 'innerhtml'],
    hint: 'Use .replace(/\\*\\*(.+?)\\*\\*/g, "<b>$1</b>").',
  },
  {
    id: 'c4', title: 'Weather Card', tier: 'Complex', xp: 50,
    description: 'Fetch wttr.in/?format=j1 and render city/temp/condition.',
    initialHtml: `<!DOCTYPE html><html><head><link rel="stylesheet" href="style.css"></head><body>\n  <div id="c" class="card">Loading...</div>\n  <script src="script.js"></script>\n</body></html>`,
    initialCss: base('.card{background:#1a1040;padding:24px;border-radius:12px;max-width:260px}'),
    initialJs: `// fetch wttr.in then render`,
    validationKeywords: ['fetch', 'await', 'innerhtml'],
    hint: 'await fetch("https://wttr.in/?format=j1"); parse current_condition[0].',
  },
  {
    id: 'c5', title: 'Quiz Engine', tier: 'Complex', xp: 50,
    description: 'Quiz of 3 questions tracking score and showing final result.',
    initialHtml: `<!DOCTYPE html><html><head><link rel="stylesheet" href="style.css"></head><body>\n  <div id="q"></div>\n  <script src="script.js"></script>\n</body></html>`,
    initialCss: base('button{display:block;margin:4px 0;padding:10px;width:100%;background:#1a1040;color:#fff;border:none;border-radius:6px;cursor:pointer}'),
    initialJs: `const Qs=[{q:"2+2",opts:["3","4"],a:1}];\nlet i=0,score=0;\n// render question, handle clicks, advance`,
    validationKeywords: ['function', 'forEach', 'addeventlistener'],
    hint: 'render(): clear #q, build buttons, on click compare to .a.',
  },
  {
    id: 'c6', title: 'Kanban Board', tier: 'Complex', xp: 50,
    description: 'Drag cards between Todo / Doing / Done columns.',
    initialHtml: `<!DOCTYPE html><html><head><link rel="stylesheet" href="style.css"></head><body>\n  <div class="board">\n    <div class="col" data-name="todo"><h3>Todo</h3><div class="card" draggable="true">Task 1</div></div>\n    <div class="col" data-name="doing"><h3>Doing</h3></div>\n    <div class="col" data-name="done"><h3>Done</h3></div>\n  </div>\n  <script src="script.js"></script>\n</body></html>`,
    initialCss: base('.board{display:flex;gap:14px}.col{flex:1;background:#1a1040;padding:12px;border-radius:8px;min-height:240px}.card{background:#e98a2e;padding:8px;margin:4px 0;border-radius:6px;cursor:move}'),
    initialJs: `// wire dragstart on cards, dragover+drop on cols`,
    validationKeywords: ['dragstart', 'dragover', 'drop', 'appendchild'],
    hint: 'dragstart: store id. drop: e.preventDefault() then col.appendChild(card).',
  },
];

export const TIER_INFO: Record<Tier, { label: string; icon: string; chip: string; tab: string }> = {
  Easy:    { label: 'Easy',    icon: '🌱', chip: 'bg-success/20 text-success',         tab: 'bg-success/20 border-success/40 text-success' },
  Medium:  { label: 'Medium',  icon: '⚡', chip: 'bg-warning/20 text-warning',         tab: 'bg-warning/20 border-warning/40 text-warning' },
  Hard:    { label: 'Hard',    icon: '🔥', chip: 'bg-destructive/20 text-destructive', tab: 'bg-destructive/20 border-destructive/40 text-destructive' },
  Complex: { label: 'Complex', icon: '💎', chip: 'bg-primary/20 text-primary',         tab: 'bg-primary/20 border-primary/40 text-primary' },
};
