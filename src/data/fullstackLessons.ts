// Full Stack Frontend Development — 32 lessons
import type { NetworkingLesson, Concept, QuizQuestion } from './networkingLessons';

export interface FullstackLesson extends Omit<NetworkingLesson, 'practical'> {
  practical: NetworkingLesson['practical'] & {
    code?: {
      html?: string;
      css?: string;
      js?: string;
    };
  };
}

const lesson = (
  id: string, order: number, title: string, icon: string, philosophy: string,
  concepts: Concept[], practical: FullstackLesson['practical'], quiz: QuizQuestion[],
  keyTakeaways: string[]
): FullstackLesson => ({
  id, module: 'Module 1: Full Stack Frontend Development', order,
  title, icon, philosophy, concepts, practical, quiz, keyTakeaways,
});

const q = (question: string, options: string[], correctIndex: number, explanation?: string): QuizQuestion =>
  ({ question, options, correctIndex, explanation });

export const FULLSTACK_LESSONS: FullstackLesson[] = [
  lesson('fs-1', 1, 'Web Architecture', '🏗️',
    'Before you write a line of code, understand what actually happens when someone types your URL. Every web app is a conversation between client and server — knowing the choreography lets you debug anything.',
    [
      { title: '1. Client ↔ Server', beginner: 'Browser asks, server answers. That\'s the whole web.', advanced: 'Request includes method, URL, headers, body. Response includes status, headers, body. Everything else is layers on top.' },
      { title: '2. The Request Lifecycle', beginner: 'DNS → TCP → TLS → HTTP → render.', advanced: 'Each step adds latency. Cache DNS, reuse TCP, preconnect for critical origins. Devs who know this debug 10× faster.' },
      { title: '3. Frontend vs Backend', beginner: 'Frontend = what user sees. Backend = data + logic.', advanced: 'SSR, SPA, SSG, ISR — modern frameworks blur the line. Choose based on data freshness needs.' },
      { title: '4. Stateless HTTP', beginner: 'Each request stands alone — the server forgets you.', advanced: 'Cookies, JWTs, session IDs reintroduce "memory". This is why auth is hard.' },
    ],
    { title: 'Watch a Request Happen', intro: 'DevTools is your X-ray vision.', steps: [
      'Open any site → DevTools → Network tab.',
      'Reload — watch the waterfall.',
      'Click the first request (the HTML doc).',
      'Read Headers, Timing, Response tabs.',
      'Notice TTFB (time to first byte) and total time.',
    ], goal: 'You can read any waterfall and explain it.' },
    [
      q('What does the browser do first when you visit a URL?', ['Render','DNS lookup','Send the body','Run JS'], 1),
      q('HTTP is:', ['Stateful','Stateless','Encrypted by default','Faster than TCP'], 1),
      q('TTFB stands for:', ['Time To Final Byte','Time To First Byte','Total Frontend Build','Top Tier File Buffer'], 1),
      q('Modern rendering choices include:', ['Only SPA','SSR, SPA, SSG, ISR','Only static','Only server'], 1),
    ],
    ['Web = client ↔ server','HTTP is stateless','DevTools = X-ray','Latency adds up at every step']
  ),
  lesson('fs-2', 2, 'HTML — Semantic Foundation', '📄',
    'HTML is the skeleton. Bad semantics now = SEO pain, accessibility lawsuits, and CSS spaghetti later.',
    [
      { title: '1. Semantic Tags', beginner: 'Use <header>, <main>, <nav>, <article>, <footer> — not <div> everywhere.', advanced: 'Screen readers and search engines navigate by landmarks. Divs are invisible to them.' },
      { title: '2. Attributes Matter', beginner: 'alt on images, label on inputs, aria when needed.', advanced: 'Missing alt = no SEO + no a11y. Forms without labels = 30% drop in mobile completion.' },
      { title: '3. Document Structure', beginner: 'One <h1>, hierarchical <h2>–<h6>.', advanced: 'Heading order is how assistive tech outlines your page. Skip levels = broken UX for blind users.' },
      { title: '4. Forms', beginner: 'Use <button type="submit">, not <div onClick>.', advanced: 'Native form elements come with free keyboard, focus, screen-reader, autofill, and validation support.' },
    ],
    { title: 'Write Semantic HTML', intro: 'Practice in the editor.', steps: [
      'Wrap the page in <header>, <main>, <footer>.',
      'Replace <div class="title"> with <h1>.',
      'Add alt text to every <img>.',
      'Use <button> for clickable actions.',
      'Open the preview and inspect the outline.',
    ], goal: 'A page a screen reader can navigate.',
      code: {
        html: '<!-- Rewrite this with semantic tags -->\n<div class="header">\n  <div class="title">My Blog</div>\n</div>\n<div class="content">\n  <div class="post">Hello world</div>\n</div>',
        css: 'body { font-family: system-ui; padding: 2rem; }\nh1 { color: #e94560; }',
      },
    },
    [
      q('Best tag for the main page heading?', ['<div>','<h1>','<header>','<title>'], 1),
      q('Why use <button> instead of <div onClick>?', ['Smaller HTML','Free keyboard + a11y','Faster','Required by law'], 1),
      q('alt attribute purpose?', ['Style','Accessibility + SEO fallback text','Tooltip','Required by HTML5'], 1),
      q('How many <h1> per page (recommended)?', ['Zero','One','As many as you want','Six'], 1),
    ],
    ['Semantics > divs','Native elements win','Headings = outline','Forms need labels']
  ),
  lesson('fs-3', 3, 'CSS — Layout & Styling', '🎨',
    'CSS isn\'t styling — it\'s layout engineering. Master the box model and cascade before fighting frameworks.',
    [
      { title: '1. Box Model', beginner: 'content + padding + border + margin.', advanced: 'box-sizing: border-box makes width include padding+border — sane default for every project.' },
      { title: '2. Cascade & Specificity', beginner: 'Later/more-specific rules win.', advanced: 'id (100) > class (10) > tag (1). Inline (1000). !important = nuclear, avoid.' },
      { title: '3. Units', beginner: 'px = fixed, rem = scalable, % = relative.', advanced: 'rem for spacing/typography, % for fluid widths, vh/vw for viewport-based layouts, clamp() for fluid type.' },
      { title: '4. Positioning', beginner: 'static, relative, absolute, fixed, sticky.', advanced: 'absolute = relative to nearest positioned ancestor. Sticky = relative until threshold, then fixed.' },
    ],
    { title: 'Style a Card', intro: 'Use the editor.', steps: [
      'Add padding, border-radius, box-shadow to .card.',
      'Set box-sizing: border-box on *.',
      'Use rem for spacing.',
      'Try hover state.',
      'Watch live preview.',
    ], goal: 'A polished card with consistent spacing.',
      code: {
        html: '<div class="card">\n  <h2>Hello</h2>\n  <p>Style me with great CSS.</p>\n</div>',
        css: '* { box-sizing: border-box; }\nbody { font-family: system-ui; background: #1a1a2e; color: white; padding: 2rem; }\n.card {\n  /* your styles */\n}',
      },
    },
    [
      q('box-sizing: border-box does what?', ['Hides borders','Includes padding+border in width','Removes margins','Centers items'], 1),
      q('Highest specificity?', ['class','id','tag','inline style'], 3),
      q('Best unit for scalable spacing?', ['px','rem','%','vh'], 1),
      q('sticky positioning is:', ['Always fixed','Relative until threshold then fixed','Same as absolute','Removed'], 1),
    ],
    ['Master the box model','Specificity rules','rem > px for scale','Sticky = hybrid']
  ),
  lesson('fs-4', 4, 'Flexbox', '📐',
    'Flexbox is for 1-dimensional layouts (row OR column). Internalize the parent/child mental model and 80% of layouts solve themselves.',
    [
      { title: '1. The Flex Container', beginner: 'display: flex on the parent.', advanced: 'flex-direction (row/column), gap (spacing without margins), flex-wrap (multi-line).' },
      { title: '2. justify-content vs align-items', beginner: 'justify = main axis, align = cross axis.', advanced: 'space-between, space-around, space-evenly — know the differences cold.' },
      { title: '3. Flex Items', beginner: 'flex: 1 = grow to fill.', advanced: 'flex: grow shrink basis. flex: 1 1 0 = equal width. flex: 0 0 200px = fixed.' },
      { title: '4. Common Patterns', beginner: 'Center anything: display:flex; justify-content:center; align-items:center.', advanced: 'Holy grail layout, navbars, card grids — all solvable in 4 lines of flex.' },
    ],
    { title: 'Build a Responsive Navbar', intro: 'Use the editor.', steps: [
      'Add display: flex to .nav.',
      'Set justify-content: space-between.',
      'Add gap between links.',
      'Center vertically with align-items.',
      'Resize the preview to test.',
    ], goal: 'A clean navbar without floats or hacks.',
      code: {
        html: '<nav class="nav">\n  <div class="logo">Sage</div>\n  <ul class="links">\n    <li>Home</li><li>About</li><li>Contact</li>\n  </ul>\n</nav>',
        css: '* { box-sizing: border-box; margin:0; padding:0; }\nbody { font-family: system-ui; background:#1a1a2e; color:white; }\n.nav { padding: 1rem; }\n.links { list-style: none; display: flex; gap: 1rem; }',
      },
    },
    [
      q('Flexbox is best for:', ['2D grids','1D rows/columns','Tables','Print layouts'], 1),
      q('justify-content controls:', ['Cross axis','Main axis alignment','Item order','Colors'], 1),
      q('flex: 1 means:', ['Hide','Grow equally to fill','Fixed 1px','Auto height'], 1),
      q('Centering in flex needs:', ['Margin auto only','justify + align: center','position absolute','translate'], 1),
    ],
    ['Flex = 1D','Main vs cross axis','flex:1 fills space','Gap > margin hacks']
  ),
  lesson('fs-5', 5, 'CSS Grid', '🔲',
    'Grid is for 2-dimensional layouts. Once you stop hacking flex for grids, your layout code shrinks 60%.',
    [
      { title: '1. Grid Container', beginner: 'display: grid + grid-template-columns.', advanced: 'repeat(auto-fit, minmax(200px, 1fr)) = responsive cards without media queries.' },
      { title: '2. fr Units', beginner: '1fr = 1 fraction of available space.', advanced: 'Mix fixed + fr: "200px 1fr 1fr" — sidebar + 2 equal cols.' },
      { title: '3. Grid Areas', beginner: 'Name regions with grid-template-areas.', advanced: 'Visually paint your layout in CSS. Easiest to maintain over time.' },
      { title: '4. Gap', beginner: 'gap: 1rem between cells.', advanced: 'row-gap vs column-gap for asymmetric spacing.' },
    ],
    { title: 'Responsive Card Grid', intro: 'No media queries needed.', steps: [
      'Add display: grid to .grid.',
      'Use repeat(auto-fit, minmax(180px, 1fr)).',
      'Add gap: 1rem.',
      'Resize preview — cards reflow automatically.',
    ], goal: 'Auto-responsive grid in 3 CSS lines.',
      code: {
        html: '<div class="grid">\n  <div class="card">1</div><div class="card">2</div>\n  <div class="card">3</div><div class="card">4</div>\n</div>',
        css: 'body { background:#1a1a2e; color:white; font-family:system-ui; padding:1rem; }\n.grid { display: grid; }\n.card { background:#16213e; padding:2rem; text-align:center; border-radius:8px; }',
      },
    },
    [
      q('Grid is best for:', ['1D','2D row + column layouts','Animations','Forms'], 1),
      q('fr unit means:', ['Pixels','Fraction of available space','Percentage','Fixed'], 1),
      q('Responsive grid without media queries:', ['flexbox','repeat(auto-fit, minmax(...))','floats','tables'], 1),
      q('grid-template-areas lets you:', ['Set colors','Name regions visually','Animate','Hide elements'], 1),
    ],
    ['Grid = 2D','fr beats %','auto-fit + minmax = magic','Areas for readability']
  ),
  lesson('fs-6', 6, 'Terminal & CLI', '💻',
    'GUIs hide power. The terminal exposes it. Every senior dev lives in a shell — get comfortable now and save thousands of hours.',
    [
      { title: '1. Navigation', beginner: 'pwd, ls, cd, mkdir, rm.', advanced: 'Tab autocomplete, !! to repeat, Ctrl+R to search history. These shave 30% off your typing.' },
      { title: '2. Files', beginner: 'cat, touch, cp, mv, rm.', advanced: 'rm -rf is permanent — no recycle bin. Use trash CLI or alias rm to safer version.' },
      { title: '3. Pipes & Redirects', beginner: '> writes, >> appends, | pipes.', advanced: 'ls | grep ".tsx" | wc -l = count TS files. Composability is the terminal\'s superpower.' },
      { title: '4. Shells', beginner: 'bash, zsh, fish — pick one.', advanced: 'zsh + oh-my-zsh + a good prompt (starship) = productivity boost in a weekend.' },
    ],
    { title: 'Practice in your real terminal', intro: 'Open Terminal/iTerm/Windows Terminal.', steps: [
      'pwd — where am I?',
      'ls -la — list everything including hidden files.',
      'mkdir test && cd test',
      'touch a.txt b.txt && ls',
      'cd .. && rm -rf test',
    ], goal: 'You can move around files without a mouse.' },
    [
      q('Print working directory?', ['cd','pwd','ls','dir'], 1),
      q('Delete a folder recursively (Unix)?', ['rm folder','rm -rf folder','del folder','trash folder'], 1),
      q('Pipe stdout into another command?', ['>','>>','|','&'], 2),
      q('Tab key in terminal:', ['Indents','Autocompletes paths/commands','Quits','Cancels'], 1),
    ],
    ['CLI = power','Tab + Ctrl+R = speed','rm -rf is permanent','Pipes compose tools']
  ),
  lesson('fs-7', 7, 'Git Basics', '🔀',
    'Git is the time machine for your code. Not knowing git is like coding without an undo button — eventually you\'ll cry.',
    [
      { title: '1. The 3 States', beginner: 'Working dir → Staging → Repository.', advanced: 'git add stages, git commit records, git push sends to remote. Understand the boundaries.' },
      { title: '2. Commits', beginner: 'A commit = snapshot + message.', advanced: 'Atomic commits + conventional messages (feat:, fix:, refactor:) = readable history forever.' },
      { title: '3. Branches', beginner: 'Branch = parallel timeline. main is default.', advanced: 'Trunk-based dev or git-flow — pick a strategy and stick to it across the team.' },
      { title: '4. Undo', beginner: 'git checkout, git reset, git revert.', advanced: 'revert is safe (creates new commit). reset rewrites history (dangerous on shared branches).' },
    ],
    { title: 'Initialize a Repo', intro: 'In your terminal.', steps: [
      'mkdir my-repo && cd my-repo',
      'git init',
      'echo "Hello" > readme.md',
      'git add readme.md',
      'git commit -m "feat: initial commit"',
    ], goal: 'Your first commit lives forever.' },
    [
      q('git add does what?', ['Saves to history','Stages changes','Pushes to remote','Creates branch'], 1),
      q('Safe undo of pushed commit?', ['reset --hard','revert','rm -rf','rebase'], 1),
      q('Default branch name (modern)?', ['master','main','dev','trunk'], 1),
      q('Commit = ', ['file','snapshot + message','branch','remote'], 1),
    ],
    ['3 states matter','Atomic commits = readable history','Revert > reset on shared branches']
  ),
  lesson('fs-8', 8, 'JS Logic & Fundamentals', '⚡',
    'JavaScript runs everything on the web. Master types, scope, and control flow before reaching for libraries.',
    [
      { title: '1. Types', beginner: 'string, number, boolean, null, undefined, object, symbol, bigint.', advanced: 'JS is dynamically typed. Use === (strict) — == coerces and bites you.' },
      { title: '2. Variables', beginner: 'let, const, var.', advanced: 'const by default, let when reassigning. Never use var — function-scoped surprises.' },
      { title: '3. Functions', beginner: 'function x() {} or const x = () => {}.', advanced: 'Arrow functions don\'t bind their own this. Critical for callbacks and class methods.' },
      { title: '4. Control Flow', beginner: 'if/else, switch, for, while.', advanced: 'Array methods (map, filter, reduce, forEach) beat for loops for readability.' },
    ],
    { title: 'Sum an Array', intro: 'Use the editor.', steps: [
      'Declare an array of numbers.',
      'Use reduce to sum them.',
      'Console log the result.',
      'Try the same with a for loop. Compare.',
    ], goal: 'Two solutions, one mental model.',
      code: {
        html: '<h1>Check the console</h1>',
        js: 'const nums = [1,2,3,4,5];\nconst sum = nums.reduce((acc, n) => acc + n, 0);\nconsole.log("Sum:", sum);',
      },
    },
    [
      q('Strict equality?', ['==','===','=','equals()'], 1),
      q('Default modern variable keyword?', ['var','let','const','define'], 2),
      q('Arrow functions:', ['Bind their own this','Inherit this from enclosing scope','Are slower','Same as function'], 1),
      q('Best for transforming arrays?', ['for','map','while','do-while'], 1),
    ],
    ['Use === always','const by default','Arrow ≠ function for this','Array methods rule']
  ),
  lesson('fs-9', 9, 'The DOM', '🌳',
    'The DOM is your bridge between JS and the page. React abstracts it, but knowing the raw API makes you 10× better at debugging.',
    [
      { title: '1. Selecting', beginner: 'document.querySelector / querySelectorAll.', advanced: 'getElementById is faster but querySelector is more flexible. Use the right tool.' },
      { title: '2. Modifying', beginner: 'el.textContent, el.classList, el.style.', advanced: 'innerHTML is XSS-vulnerable. Use textContent unless rendering trusted HTML.' },
      { title: '3. Events', beginner: 'el.addEventListener("click", fn).', advanced: 'Event delegation: one listener on parent handles many children. Saves memory.' },
      { title: '4. Reflow & Repaint', beginner: 'Changing layout = expensive.', advanced: 'Batch DOM reads/writes. Use requestAnimationFrame for animations.' },
    ],
    { title: 'Click Counter', intro: 'Use the editor.', steps: [
      'Add a button and a span.',
      'On click → increment span text.',
      'Use querySelector + addEventListener.',
    ], goal: 'Vanilla DOM interaction.',
      code: {
        html: '<button id="btn">Click me</button>\n<p>Count: <span id="count">0</span></p>',
        js: 'const btn = document.getElementById("btn");\nconst count = document.getElementById("count");\nlet n = 0;\nbtn.addEventListener("click", () => {\n  n++;\n  count.textContent = n;\n});',
      },
    },
    [
      q('Modern flexible selector?', ['getElementById','querySelector','getElementsByTagName','getAllElements'], 1),
      q('Safest text setter?', ['innerHTML','textContent','outerHTML','document.write'], 1),
      q('Event delegation:', ['Slower','One parent listener for many children','Required','Removed in ES6'], 1),
      q('addEventListener purpose?', ['Style','Attach event handler','Create element','Hide'], 1),
    ],
    ['DOM = JS↔page','Avoid innerHTML','Delegate events','Batch DOM ops']
  ),
  lesson('fs-10', 10, 'GitHub & Collaboration', '🐙',
    'Code lives on GitHub. Pull requests, issues, and CI/CD are the daily reality of every team. Learn the flow before joining one.',
    [
      { title: '1. Remotes', beginner: 'origin = your remote on GitHub.', advanced: 'git push -u origin main first time, then git push. Multiple remotes for forks.' },
      { title: '2. Pull Requests', beginner: 'A PR proposes merging branch → branch.', advanced: 'Small PRs (< 400 lines) get reviewed in minutes. Huge PRs sit for days.' },
      { title: '3. Issues', beginner: 'Bug reports + feature requests.', advanced: 'Link PRs to issues with "Closes #42" — auto-closes on merge.' },
      { title: '4. Actions', beginner: 'Automated workflows (tests, deploy).', advanced: 'CI on every PR catches regressions before merge. Cheap insurance.' },
    ],
    { title: 'Push Your First Repo', intro: 'Real GitHub flow.', steps: [
      'Create a repo on github.com.',
      'In terminal: git remote add origin <url>.',
      'git push -u origin main.',
      'Make a branch: git checkout -b feature/x.',
      'Push and open a PR.',
    ], goal: 'Your code on GitHub with a PR open.' },
    [
      q('Default remote name?', ['main','origin','master','remote'], 1),
      q('Best PR size?', ['Huge','Small (< 400 lines)','Doesn\'t matter','One commit only'], 1),
      q('Auto-close issue from PR?', ['Manual','Use "Closes #N" in description','Impossible','Use webhook'], 1),
      q('GitHub Actions are for:', ['Stars','Automated CI/CD workflows','Issues','Profiles'], 1),
    ],
    ['origin = remote','Small PRs ship','Link issues','CI catches bugs']
  ),
  lesson('fs-11', 11, 'ES6+ Modern JavaScript', '✨',
    'Modern JS is a different language. Destructuring, spread, async/await, modules — these aren\'t optional in 2026.',
    [
      { title: '1. Destructuring', beginner: 'const { name } = obj; const [a, b] = arr;', advanced: 'Rename, defaults, nested — replaces 80% of "extract from object" code.' },
      { title: '2. Spread / Rest', beginner: '...arr to expand, ...args to collect.', advanced: 'Immutability pattern: {...state, key: value}. Beats Object.assign.' },
      { title: '3. Async / Await', beginner: 'async function + await fetch.', advanced: 'Try/catch around await. Promise.all for parallel. Promise.allSettled for tolerance.' },
      { title: '4. Modules', beginner: 'import / export.', advanced: 'Named vs default exports — pick a convention and enforce it via ESLint.' },
    ],
    { title: 'Modern Rewrite', intro: 'Use the editor.', steps: [
      'Destructure { name, age } from an object.',
      'Spread two arrays into one.',
      'Write an async fetch + await + try/catch.',
    ], goal: 'Modern syntax becomes muscle memory.',
      code: {
        html: '<h1>Open the console</h1>',
        js: 'const user = { name: "Sage", age: 21 };\nconst { name, age } = user;\nconsole.log(name, age);\n\nconst a = [1,2]; const b = [3,4];\nconsole.log([...a, ...b]);',
      },
    },
    [
      q('Spread operator?', ['...','---','**','>>'], 0),
      q('Immutable state update pattern?', ['state.key = v','{...state, key: v}','Object.assign(state, {key:v})','delete state.key'], 1),
      q('Parallel awaits?', ['Promise.all','for loop','setTimeout','async wrap'], 0),
      q('Default vs named exports?', ['Same','Different — pick a convention','Default is faster','Named is deprecated'], 1),
    ],
    ['Destructure everything','Spread for immutability','await + try/catch','Modules > globals']
  ),
  lesson('fs-12', 12, 'Working with APIs', '📡',
    'Modern apps are 80% glue between APIs. Master fetch, error handling, and JSON contracts and you\'ll never be stuck.',
    [
      { title: '1. fetch', beginner: 'fetch(url).then(r => r.json()).', advanced: 'fetch doesn\'t throw on 4xx/5xx. Always check response.ok.' },
      { title: '2. REST', beginner: 'GET, POST, PUT, DELETE.', advanced: 'Idempotency: GET, PUT, DELETE = safe to retry. POST = not.' },
      { title: '3. Headers + Auth', beginner: 'Authorization: Bearer <token>.', advanced: 'CORS is server-controlled. Preflight OPTIONS for non-simple requests.' },
      { title: '4. Error UX', beginner: 'Show loading + error states.', advanced: 'Retry with exponential backoff for transient errors. Don\'t retry 4xx.' },
    ],
    { title: 'Fetch a Joke', intro: 'Use the editor.', steps: [
      'Call https://official-joke-api.appspot.com/random_joke.',
      'await response.json().',
      'Render setup + punchline in DOM.',
    ], goal: 'API → UI loop completed.',
      code: {
        html: '<div id="joke">Loading...</div>',
        js: 'async function load() {\n  try {\n    const r = await fetch("https://official-joke-api.appspot.com/random_joke");\n    if (!r.ok) throw new Error("HTTP " + r.status);\n    const j = await r.json();\n    document.getElementById("joke").innerText = j.setup + " — " + j.punchline;\n  } catch (e) { document.getElementById("joke").innerText = "Error: " + e.message; }\n}\nload();',
      },
    },
    [
      q('fetch throws on 500?', ['Yes','No — check response.ok','Only with await','Only in Node'], 1),
      q('Safe-to-retry methods?', ['POST','GET/PUT/DELETE (idempotent)','None','All'], 1),
      q('Auth header standard format?', ['Token: xxx','Authorization: Bearer xxx','X-Auth: xxx','Set-Cookie'], 1),
      q('Show during request?', ['Nothing','Loading + error states','Console log','Alert'], 1),
    ],
    ['fetch + response.ok','REST = verbs + idempotency','Loading + error UX','Backoff retries']
  ),
  lesson('fs-13', 13, 'NPM & Packages', '📦',
    'NPM is the world\'s largest code library. Knowing how to use, audit, and lock dependencies is a senior-level skill.',
    [
      { title: '1. package.json', beginner: 'Project manifest: deps, scripts, version.', advanced: '"dependencies" ships to prod. "devDependencies" stays in dev. Don\'t mix them up.' },
      { title: '2. Lockfiles', beginner: 'package-lock.json pins exact versions.', advanced: 'Commit lockfiles. They\'re why "works on my machine" stops being a thing.' },
      { title: '3. Scripts', beginner: 'npm run dev / build / test.', advanced: 'Compose scripts: "build": "tsc && vite build". Keep them short and Unix-pipeable.' },
      { title: '4. Audit', beginner: 'npm audit shows known vulnerabilities.', advanced: 'Schedule it weekly in CI. High-severity issues block deploys.' },
    ],
    { title: 'Init + Install', intro: 'Real npm flow.', steps: [
      'mkdir test-app && cd test-app && npm init -y.',
      'npm install lodash.',
      'Inspect package.json — see dependencies.',
      'npm install --save-dev vitest.',
      'See "devDependencies".',
    ], goal: 'Understand the manifest cold.' },
    [
      q('Lockfile purpose?', ['Pretty print','Pin exact versions','Backup','Run scripts'], 1),
      q('Difference: deps vs devDeps?', ['None','deps ship to prod','deps are typed','devDeps are private'], 1),
      q('Check vulnerabilities?', ['npm check','npm audit','npm scan','npm secure'], 1),
      q('npm run build executes:', ['Random','The "build" script in package.json','npm itself','vite'], 1),
    ],
    ['Manifest = truth','Commit lockfiles','Scripts compose','Audit weekly']
  ),
  lesson('fs-14', 14, 'Tailwind CSS', '🌬️',
    'Tailwind is utility-first CSS. You stop naming classes, start composing them. Fewer files, faster iteration, no spaghetti.',
    [
      { title: '1. Utility Classes', beginner: 'p-4 = padding 1rem. text-lg = font-size larger.', advanced: 'Constraint-based design system. Spacing scale (4, 8, 16…) prevents pixel-perfect bikeshedding.' },
      { title: '2. Responsive Prefixes', beginner: 'md:p-8 = 1rem mobile, 2rem desktop.', advanced: 'Mobile-first. Stack prefixes for breakpoints. Tailwind compiles to single class per breakpoint.' },
      { title: '3. State Variants', beginner: 'hover:, focus:, active:.', advanced: 'group-hover:, peer-checked: for parent/sibling state. Composable like CSS but typed.' },
      { title: '4. Config', beginner: 'tailwind.config — extend colors, fonts.', advanced: 'Define a design system once. Use semantic tokens (bg-primary), not hex codes in components.' },
    ],
    { title: 'Style with Utilities', intro: 'Use the editor.', steps: [
      'Add p-4 bg-blue-500 text-white to a div.',
      'Add hover:bg-blue-700.',
      'Add md:p-8 for desktop padding.',
    ], goal: 'A responsive hover-able card in 1 line of class.',
      code: {
        html: '<!-- Tailwind via CDN for demo -->\n<script src="https://cdn.tailwindcss.com"></script>\n<div class="p-4 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition">\n  Hover me\n</div>',
      },
    },
    [
      q('p-4 means:', ['padding 4px','padding 1rem (16px)','padding 4%','no padding'], 1),
      q('md: prefix targets:', ['Mobile only','medium screens and up','Print','Dark mode'], 1),
      q('Hover variant?', [':hover','hover:','onHover','hoverable'], 1),
      q('Where to extend colors?', ['Random JS file','tailwind.config','index.css only','Inline'], 1),
    ],
    ['Utility-first = less CSS','Mobile-first','Variants stack','Configure once']
  ),
  lesson('fs-15', 15, 'React Basics', '⚛️',
    'React is the most-used UI library on Earth. Component thinking + state-driven rendering = the modern frontend paradigm.',
    [
      { title: '1. Components', beginner: 'Functions that return JSX.', advanced: 'One responsibility per component. Composition over inheritance. Pass props down, lift state up.' },
      { title: '2. JSX', beginner: 'HTML-in-JS with curly {} for expressions.', advanced: 'JSX compiles to React.createElement. className not class. camelCase event handlers.' },
      { title: '3. Props', beginner: 'Read-only inputs from parent.', advanced: 'Prop drilling is a smell. Context or state libs (Zustand, Redux) for deep trees.' },
      { title: '4. State', beginner: 'useState for changing values.', advanced: 'Never mutate state directly. Always set new reference: setItems([...items, x]).' },
    ],
    { title: 'A Toggle Component', intro: 'Use the editor.', steps: [
      'Create a function returning JSX.',
      'Use useState for a boolean.',
      'Render a button that toggles it.',
    ], goal: 'State-driven UI in 10 lines.',
      code: {
        html: '<div id="root"></div>\n<script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>\n<script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>\n<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>\n<script type="text/babel">\nconst { useState } = React;\nfunction App() {\n  const [on, setOn] = useState(false);\n  return <button onClick={() => setOn(!on)}>{on ? "ON" : "OFF"}</button>;\n}\nReactDOM.createRoot(document.getElementById("root")).render(<App />);\n</script>',
      },
    },
    [
      q('JSX class attribute is:', ['class','className','classname','class-name'], 1),
      q('Mutate state directly?', ['Always','Never — always new reference','Sometimes','Only in arrays'], 1),
      q('Props are:', ['Mutable','Read-only inputs','Functions only','Local state'], 1),
      q('Composition means:', ['Inheritance','Building UIs from smaller components','Single file','Class only'], 1),
    ],
    ['Components > pages','JSX = HTML+JS','Props read-only','New refs for state']
  ),
  lesson('fs-16', 16, 'React Hooks', '🪝',
    'Hooks unlocked functional components. useState, useEffect, useMemo, useCallback — master these four and you handle 90% of cases.',
    [
      { title: '1. useState', beginner: 'Local component state.', advanced: 'Lazy init: useState(() => expensiveCalc()). Functional updater: setCount(c => c + 1).' },
      { title: '2. useEffect', beginner: 'Run side effects after render.', advanced: 'Dependency array controls re-runs. [] = once on mount. Always cleanup subscriptions.' },
      { title: '3. useMemo / useCallback', beginner: 'Memoize values / functions.', advanced: 'Premature optimization is real — only add when profiler shows a bottleneck.' },
      { title: '4. Custom Hooks', beginner: 'Functions starting with use that call other hooks.', advanced: 'Extract reusable stateful logic. useFetch, useDebounce, useLocalStorage — common patterns.' },
    ],
    { title: 'Counter with Effect', intro: 'Use the editor.', steps: [
      'useState for count.',
      'useEffect to log on every change.',
      'Add cleanup in useEffect.',
    ], goal: 'You understand the dep array.',
      code: {
        html: '<div id="root"></div>\n<script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>\n<script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>\n<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>\n<script type="text/babel">\nconst { useState, useEffect } = React;\nfunction App() {\n  const [n, setN] = useState(0);\n  useEffect(() => { console.log("n is", n); }, [n]);\n  return <button onClick={() => setN(n+1)}>Count: {n}</button>;\n}\nReactDOM.createRoot(document.getElementById("root")).render(<App />);\n</script>',
      },
    },
    [
      q('Empty dep array means:', ['Run every render','Run once on mount','Never run','Run on unmount'], 1),
      q('Functional setState:', ['setCount(count+1)','setCount(c => c+1)','setCount.add(1)','count++'], 1),
      q('Custom hook must:', ['Be a class','Start with "use"','Return JSX','Be async'], 1),
      q('When to useMemo?', ['Always','Only when profiler shows a bottleneck','Never','For all calculations'], 1),
    ],
    ['useState + useEffect cover most','Watch dep arrays','Functional updaters','Extract custom hooks']
  ),
  lesson('fs-17', 17, 'Context & Global State', '🔄',
    'Prop drilling 5 levels deep is misery. Context (or Zustand) gives any component access to shared state without the relay race.',
    [
      { title: '1. React Context', beginner: 'createContext + Provider + useContext.', advanced: 'Context re-renders every consumer when value changes. Split contexts to limit re-renders.' },
      { title: '2. When NOT to Context', beginner: 'Don\'t put everything in one global blob.', advanced: 'Server state (queries) belongs in TanStack Query. Local UI state stays in components.' },
      { title: '3. Zustand', beginner: 'Tiny global store, no boilerplate.', advanced: '4kb, selector-based subscriptions = no unnecessary re-renders.' },
      { title: '4. Redux Toolkit', beginner: 'Heavyweight but predictable.', advanced: 'Worth it for large teams + complex flows. Overkill for most apps.' },
    ],
    { title: 'Theme Context', intro: 'In the editor.', steps: [
      'createContext("light").',
      'Wrap App in Provider.',
      'useContext in a deep child.',
    ], goal: 'Shared state without prop drilling.' },
    [
      q('Context provider re-renders consumers when:', ['Always','value changes','Never','On click'], 1),
      q('Server state best lives in:', ['Redux','TanStack Query','useState','Context'], 1),
      q('Zustand selling point?', ['Big API','Tiny + selector-based subs','TypeScript only','New language'], 1),
      q('Prop drilling is:', ['Best practice','A code smell when deep','Required','Fast'], 1),
    ],
    ['Context fixes drilling','Split contexts','Server ≠ client state','Pick the smallest store that works']
  ),
  lesson('fs-18', 18, 'Testing Basics', '🧪',
    'Untested code rots. Tests are how you sleep at night. Start with one test, ship faster forever.',
    [
      { title: '1. Test Pyramid', beginner: 'Many unit, fewer integration, very few E2E.', advanced: 'Unit = fast + cheap. E2E = slow + brittle but catches real-user bugs.' },
      { title: '2. Vitest / Jest', beginner: 'describe, it, expect.', advanced: 'Vitest is Vite-native. Use jsdom for component tests, node for pure logic.' },
      { title: '3. React Testing Library', beginner: 'Query by role/text, not by class.', advanced: 'Test behavior, not implementation. Refactor-friendly tests.' },
      { title: '4. Playwright / Cypress', beginner: 'Real browser, real flows.', advanced: 'Use for critical paths: signup, checkout, payment. Don\'t E2E everything.' },
    ],
    { title: 'Your First Test', intro: 'Concept exercise.', steps: [
      'npm install -D vitest.',
      'Create sum.ts → export const sum = (a,b) => a+b.',
      'Create sum.test.ts → it("adds", () => expect(sum(1,2)).toBe(3)).',
      'npx vitest.',
    ], goal: 'Green checkmark.' },
    [
      q('Test pyramid base?', ['E2E','Unit','Integration','Smoke'], 1),
      q('RTL recommends querying by:', ['class','role/text','id','tag'], 1),
      q('Vitest is built on:', ['Webpack','Vite','Rollup','esbuild only'], 1),
      q('Best place for E2E tests?', ['Every function','Critical user paths','Static pages','UI components'], 1),
    ],
    ['Pyramid > inverted','Test behavior','RTL = role-based','E2E sparingly']
  ),
  lesson('fs-19', 19, 'Security Essentials', '🛡️',
    'Most breaches are stupid mistakes — exposed keys, XSS, missing auth. Knowing the OWASP top 5 saves your career.',
    [
      { title: '1. XSS', beginner: 'Don\'t inject untrusted HTML.', advanced: 'React escapes by default. dangerouslySetInnerHTML — only with DOMPurify.' },
      { title: '2. Secrets', beginner: 'Never commit API keys.', advanced: 'Use env vars + .gitignore. Rotate keys yearly. Scan repos with truffleHog.' },
      { title: '3. CORS / CSRF', beginner: 'Same-origin policy + tokens.', advanced: 'SameSite cookies + CSRF tokens. CORS is a browser feature, not a server one.' },
      { title: '4. Auth', beginner: 'Bcrypt passwords. JWTs in httpOnly cookies.', advanced: 'Refresh-token rotation, short access lifetimes, leaked-password checks.' },
    ],
    { title: 'Security Audit', intro: 'Of your own code.', steps: [
      'Grep your repo for "sk_" / "AKIA" / "secret".',
      'Check .env is gitignored.',
      'Audit dependencies: npm audit.',
      'Review any dangerouslySetInnerHTML.',
    ], goal: 'No secrets in source. No XSS holes.' },
    [
      q('React\'s default XSS protection?', ['None','Auto-escape in JSX','Sanitize on server','CSP only'], 1),
      q('Secrets belong:', ['In code','In env vars + ignored','In package.json','In comments'], 1),
      q('JWTs safest in:', ['localStorage','httpOnly cookies','sessionStorage','URL params'], 1),
      q('npm audit checks:', ['Style','Known vulnerabilities','Speed','Tests'], 1),
    ],
    ['Escape user input','Never commit secrets','httpOnly cookies','Audit deps regularly']
  ),
  lesson('fs-20', 20, 'Deployment & CI/CD', '🚀',
    'Code that ships matters. Vercel, Netlify, GitHub Pages — modern deploy is git-push-and-done. Knowing the pipeline turns a coder into a shipper.',
    [
      { title: '1. Static vs Dynamic', beginner: 'Static = pre-built HTML/CSS/JS.', advanced: 'Static deploys are cheap, fast, secure. Use them whenever data freshness allows.' },
      { title: '2. Platforms', beginner: 'Vercel, Netlify, Cloudflare Pages.', advanced: 'All free for hobby projects. Vercel = best Next.js, Cloudflare = global edge + cheap.' },
      { title: '3. CI/CD', beginner: 'Push to main → tests run → deploy.', advanced: 'GitHub Actions / Vercel auto-deploy. Preview URLs per PR = review velocity boost.' },
      { title: '4. Monitoring', beginner: 'Sentry for errors. Vercel/Plausible for traffic.', advanced: 'Set up alerts before launching. Silent errors lose customers fastest.' },
    ],
    { title: 'Deploy to Vercel', intro: 'In 60 seconds.', steps: [
      'Push your repo to GitHub.',
      'vercel.com → New Project → import repo.',
      'Click Deploy — get a live URL.',
      'Add custom domain.',
      'Push a commit → auto-redeploy.',
    ], goal: 'Live URL anyone can visit.' },
    [
      q('Cheapest, fastest deploy?', ['VPS','Static on a CDN','Bare metal','FTP'], 1),
      q('Preview URLs in CI?', ['Useless','Boost review velocity','Only paid','Insecure'], 1),
      q('Error monitoring tool?', ['Spotify','Sentry','Slack','Notion'], 1),
      q('Auto-deploy trigger?', ['Manual upload','Git push to main / merged PR','Email','Daily cron'], 1),
    ],
    ['Static = cheap, fast, safe','Vercel/Netlify/Cloudflare','CI/CD = push to deploy','Monitor errors']
  ),
  lesson('fs-21', 21, 'TypeScript Fundamentals', '🟦',
    'TypeScript is JavaScript with a safety net. It catches bugs before runtime and makes refactors fearless. Every serious frontend team uses it — being fluent is non-negotiable.',
    [
      { title: '1. Type Annotations', beginner: '`let x: number = 5`. Function params + return types.', advanced: 'Inference is powerful — only annotate what TS can\'t infer. Over-annotating hurts readability.' },
      { title: '2. Interfaces & Types', beginner: 'Shape of an object. `interface User { name: string }`.', advanced: '`type` for unions/intersections, `interface` for object shapes that may be extended.' },
      { title: '3. Generics', beginner: '`function id<T>(x: T): T { return x }`.', advanced: 'Generics unlock reusable, type-safe code. Build your own utility types from `Partial`, `Pick`, `Record`.' },
      { title: '4. Strict Mode', beginner: 'Turn on `strict: true` in tsconfig.', advanced: 'Strict null checks + noImplicitAny prevent ~80% of runtime bugs. Worth every tantrum.' },
    ],
    { title: 'Type a Function', intro: 'Annotate this.', steps: [
      'const add = (a, b) => a + b → type both params + return.',
      'Define interface User with name + age.',
      'Write fn `greet(u: User): string`.',
      'Try `greet({name:"x"})` — see TS error.',
      'Fix it. Notice the safety.',
    ], goal: 'You can write typed JS without fear.' },
    [
      q('Why use TypeScript?', ['Smaller code','Catch bugs at build time','Faster runtime','Less typing'], 1),
      q('Inference means:', ['TS guesses types','You can skip explicit annotations when TS can derive','Errors are silent','None'], 1),
      q('Strict mode is:', ['Optional','Highly recommended','Slow','Buggy'], 1),
      q('Generics give you:', ['Reusable type-safe code','Speed','Smaller bundles','Less syntax'], 0),
    ],
    ['Types catch bugs early','Inference > annotations','Use strict mode','Generics for reuse']
  ),
  lesson('fs-22', 22, 'React Router & Navigation', '🧭',
    'Modern SPAs route on the client. React Router is the standard — learning its patterns means clean URLs, fast nav, and bookmarkable state.',
    [
      { title: '1. Routes & Links', beginner: '`<Route path="/x" element={<X/>} />`. Use `<Link>` not `<a>`.', advanced: 'NavLink gives active state out of the box. `useNavigate` for programmatic nav.' },
      { title: '2. Nested Routes', beginner: 'Routes inside routes; use `<Outlet />` to render children.', advanced: 'Layout routes share UI (sidebar, header). Index routes render at the parent path.' },
      { title: '3. Params & Search', beginner: '`useParams` for `:id`. `useSearchParams` for `?q=`.', advanced: 'Treat URL as state — back/forward navigation Just Works. Avoid local state for shareable filters.' },
      { title: '4. Loaders & Guards', beginner: 'Redirect with `<Navigate to="/auth" />` for protected routes.', advanced: 'Data loaders (v6.4+) fetch before render. Or use suspense + react-query.' },
    ],
    { title: 'Build a Route', intro: 'Two pages + dynamic.', steps: [
      'Install react-router-dom. Wrap app in BrowserRouter.',
      'Add /, /about, /post/:id routes.',
      'Use <Link> to nav between them.',
      'In PostPage, useParams() to read :id.',
      'Try ?sort=new — read with useSearchParams.',
    ], goal: 'You can build a multi-page SPA.' },
    [
      q('Nav between routes uses:', ['<a>','<Link>','window.location','POST'], 1),
      q('Read URL params with:', ['useState','useParams','props','context'], 1),
      q('Protect a route with:', ['<Navigate>','HTTP 401','Cookie','Server only'], 0),
      q('Treat URL as state lets you:', ['Bookmark filters','Back-button works','Shareable links','All of the above'], 3),
    ],
    ['<Link> for client nav','useParams + useSearchParams','URL = source of truth','Guards via redirects']
  ),
  lesson('fs-23', 23, 'State Management Patterns', '🧠',
    'Local state, lifted state, context, Zustand, Redux — each has a use. Picking the right one separates a tidy app from a tangled one.',
    [
      { title: '1. Local First', beginner: '`useState` until it hurts. Lift to parent when siblings need it.', advanced: 'Most React apps live happily with local + a sprinkle of context. Reach for a store only when you need to.' },
      { title: '2. Context', beginner: 'For app-wide values that rarely change: theme, auth, locale.', advanced: 'Context re-renders all consumers on change. Split contexts to limit blast radius.' },
      { title: '3. Zustand', beginner: 'Tiny, simple global store. Hook-based API.', advanced: 'Selectors prevent re-render storms. Persist middleware syncs to localStorage in one line.' },
      { title: '4. Server State', beginner: 'Use react-query / TanStack Query. Don\'t put API responses in Redux.', advanced: 'Server state is async + cached. UI state is sync + derived. Different lifecycles, different tools.' },
    ],
    { title: 'Zustand Counter', intro: 'In 5 lines.', steps: [
      'npm i zustand.',
      'create(set => ({ n: 0, inc: () => set(s => ({n: s.n+1})) })).',
      'In a component: const n = useStore(s => s.n).',
      'Button → useStore.getState().inc().',
      'Counter works app-wide.',
    ], goal: 'You can pick the right state tool.' },
    [
      q('First tool to reach for?', ['Redux','useState','MobX','Context'], 1),
      q('Context is best for:', ['High-frequency updates','Theme/auth/locale','Lists','Async'], 1),
      q('Server state goes in:', ['Redux','React Query / TanStack Query','useState','LocalStorage'], 1),
      q('Selectors in Zustand:', ['Slow it down','Avoid unnecessary re-renders','Are required','Do nothing'], 1),
    ],
    ['Local > lifted > context > store','Split contexts','Zustand = simple global','Server state = query libs']
  ),
  lesson('fs-24', 24, 'Forms & Validation', '📋',
    'Forms are the #1 source of frontend pain. react-hook-form + zod = type-safe, performant, accessible forms in 20 lines.',
    [
      { title: '1. Controlled vs Uncontrolled', beginner: 'Controlled = React owns the value. Uncontrolled = the DOM does.', advanced: 'Hook Form uses uncontrolled by default — fewer re-renders, faster typing.' },
      { title: '2. react-hook-form', beginner: 'register() + handleSubmit. Done.', advanced: 'formState.errors + isValid drives the entire UI. Integrate with any UI library.' },
      { title: '3. zod', beginner: 'Schema-first validation. `z.object({ email: z.string().email() })`.', advanced: '`zod.infer<typeof schema>` gives you the TS type for free. One source of truth.' },
      { title: '4. UX', beginner: 'Show errors inline. Disable submit when invalid.', advanced: 'Show errors on blur, not on every keystroke. Focus first error on submit fail.' },
    ],
    { title: 'Hook-Form + Zod', intro: 'Login form.', steps: [
      'npm i react-hook-form zod @hookform/resolvers.',
      'Schema: z.object({email:z.string().email(), password:z.string().min(8)}).',
      'useForm({ resolver: zodResolver(schema) }).',
      '<input {...register("email")} /> + show errors.email?.message.',
      'On submit → console.log values, type-safe.',
    ], goal: 'You build robust forms quickly.' },
    [
      q('Hook form is by default:', ['Controlled','Uncontrolled','Hybrid','Server-driven'], 1),
      q('Zod gives you:', ['Validation + TS type','Animations','State','Routing'], 0),
      q('Show validation errors when?', ['Every keystroke','On blur / submit','Never','Server only'], 1),
      q('Single source of truth combo?', ['Hook form alone','Hook form + Zod','Yup + Redux','Joi + Mobx'], 1),
    ],
    ['Uncontrolled = perf','register + handleSubmit','Zod schemas double as types','Errors on blur/submit']
  ),
  lesson('fs-25', 25, 'Accessibility (a11y)', '♿',
    'Accessible apps work for everyone — screen readers, keyboards, low-vision, motor disabilities. They\'re also a legal requirement in most countries.',
    [
      { title: '1. Semantic HTML', beginner: 'Use <button>, <a>, <label>, <h1>-<h6> correctly.', advanced: 'Native elements come with keyboard + focus + screen-reader behavior for free. Reach for ARIA only when no native equivalent exists.' },
      { title: '2. Keyboard Navigation', beginner: 'Tab through your app. Everything interactive must be reachable.', advanced: 'Tab order follows DOM order. Use `tabindex="0"` to make non-interactive elements focusable; never positive values.' },
      { title: '3. ARIA', beginner: 'aria-label for icon buttons, aria-live for dynamic regions.', advanced: 'First rule: don\'t use ARIA. Use HTML. Second rule: incorrect ARIA is worse than no ARIA.' },
      { title: '4. Contrast & Motion', beginner: 'WCAG AA: 4.5:1 for text. Respect prefers-reduced-motion.', advanced: 'Run Lighthouse + axe DevTools regularly. Catch 80% of issues automatically.' },
    ],
    { title: 'Audit Your App', intro: 'Five minutes, three tools.', steps: [
      'Open DevTools → Lighthouse → Accessibility audit.',
      'Tab through every page with keyboard only.',
      'Install axe DevTools extension → scan a page.',
      'Fix the top 3 issues.',
      'Recheck with screen reader (VoiceOver/NVDA) on one page.',
    ], goal: 'Your app is usable by everyone.' },
    [
      q('First a11y win?', ['ARIA everywhere','Semantic HTML','SVG sprites','Custom widgets'], 1),
      q('WCAG AA text contrast?', ['1:1','3:1','4.5:1','10:1'], 2),
      q('Reduce motion via:', ['Plugin','prefers-reduced-motion media query','Always','Never'], 1),
      q('Best a11y rule?', ['Use lots of ARIA','Use HTML, ARIA only when needed','Avoid keyboard','Skip alt text'], 1),
    ],
    ['Semantic HTML first','Keyboard reach everything','ARIA is last resort','4.5:1 contrast']
  ),
  lesson('fs-26', 26, 'Performance & Optimization', '⚡',
    'Slow apps lose users. Most perf wins are easy — measure first, optimize what actually matters, ignore the rest.',
    [
      { title: '1. Measure First', beginner: 'Lighthouse + DevTools Performance. Don\'t guess.', advanced: 'Track Core Web Vitals: LCP, INP, CLS. Real-user monitoring beats synthetic tests.' },
      { title: '2. Code Splitting', beginner: 'React.lazy + Suspense splits routes into chunks.', advanced: 'Vite splits automatically per dynamic import. Preload critical chunks with `<link rel="modulepreload">`.' },
      { title: '3. Memoization', beginner: 'React.memo, useMemo, useCallback when render is expensive.', advanced: 'Premature memoization adds noise. Profile first; only memoize hot components.' },
      { title: '4. Asset Optimization', beginner: 'Compress images, lazy-load below the fold.', advanced: 'Use WebP/AVIF. CDN with edge caching. Inline critical CSS, defer the rest.' },
    ],
    { title: 'Speed Audit', intro: 'In ten minutes.', steps: [
      'Lighthouse → Performance scan.',
      'Add React.lazy to your biggest route.',
      'Convert hero image to WebP.',
      'Run Lighthouse again — compare.',
      'Aim for >90 score before optimizing further.',
    ], goal: 'Your app loads fast on real devices.' },
    [
      q('Optimize when?', ['Before measuring','After measuring + finding bottlenecks','Never','Always premature'], 1),
      q('Split chunks via:', ['Manual','React.lazy + Suspense','tsconfig','Webpack only'], 1),
      q('Modern image formats?', ['JPG only','WebP / AVIF','BMP','GIF only'], 1),
      q('Premature useMemo is:', ['Always good','Adds noise without gain','Required','Faster'], 1),
    ],
    ['Measure before optimizing','Lazy-load routes','WebP for images','Memoize hot paths only']
  ),
  lesson('fs-27', 27, 'Animations: CSS & Framer Motion', '🎬',
    'Motion communicates change — but only when used with restraint. Subtle micro-animations make UI feel alive; over-animation gives motion sickness.',
    [
      { title: '1. CSS Transitions', beginner: '`transition: all 0.2s ease`. Hover state changes color smoothly.', advanced: 'Animate transform + opacity only — they\'re GPU-accelerated. Animating width/height/top triggers layout = jank.' },
      { title: '2. Keyframes', beginner: '`@keyframes spin { to { transform: rotate(360deg) } }`.', advanced: 'Loops + delays let you build entire scenes in pure CSS. Pause via `animation-play-state`.' },
      { title: '3. Framer Motion', beginner: '<motion.div animate={{ opacity: 1 }} />. Spring physics, gestures, layout animations.', advanced: 'layoutId magic-moves elements between layouts. AnimatePresence handles exit animations.' },
      { title: '4. Respect Users', beginner: 'Honor prefers-reduced-motion.', advanced: 'Wrap motion components in a hook that disables them when the OS asks. Health > flash.' },
    ],
    { title: 'Page Fade-in', intro: 'Two ways.', steps: [
      'CSS: add `animation: fadeIn .4s ease-out`. Define @keyframes.',
      'Framer: <motion.div initial={{opacity:0}} animate={{opacity:1}}>.',
      'Compare bundle size impact.',
      'For UI primitives → CSS. For interactive gestures → Framer.',
      'Always test with reduced motion on.',
    ], goal: 'Subtle motion improves your UI.' },
    [
      q('GPU-friendly properties?', ['top/left','width','transform/opacity','margin'], 2),
      q('Framer\'s magic move?', ['layoutId','useState','context','styled'], 0),
      q('Reduced motion handling?', ['Ignore','prefers-reduced-motion','Slower','Disable JS'], 1),
      q('Best motion practice?', ['Animate everything','Restraint + purpose','Wild','Hide it'], 1),
    ],
    ['transform/opacity only','Spring > linear','layoutId is magic','Respect prefers-reduced-motion']
  ),
  lesson('fs-28', 28, 'Capstone: Ship a Real SPA', '🏆',
    'You\'ve learned all the parts. Now combine them: build, test, deploy, monitor. This is what a real frontend engineer does on day one.',
    [
      { title: '1. Pick a Scope', beginner: 'Small > unfinished. Notes app, weather app, recipe browser.', advanced: 'Three core features done well beats ten half-baked. Cut scope ruthlessly.' },
      { title: '2. Architecture', beginner: 'Routes + components + hooks. Folder by feature, not type.', advanced: 'src/features/auth/{Login.tsx, useAuth.ts}. Group code that changes together.' },
      { title: '3. Quality Gates', beginner: 'TypeScript strict. ESLint. One test per feature.', advanced: 'Pre-commit hook (husky + lint-staged). PR checks. Block merges on red.' },
      { title: '4. Ship + Monitor', beginner: 'Push → Vercel → Live URL. Add Sentry.', advanced: 'Set up domain, OG image, robots.txt, sitemap, analytics. Production polish.' },
    ],
    { title: 'Build, Ship, Share', intro: 'Three days max.', steps: [
      'Day 1: scaffold + routes + auth + core UI.',
      'Day 2: data + persistence + one test.',
      'Day 3: deploy + share link with three people.',
      'Get feedback. Fix the loudest pain.',
      'Ship v0.2 a week later.',
    ], goal: 'You have shipped a real, live SPA.' },
    [
      q('Best capstone scope?', ['Massive','Small but finished','Average','Copy others'], 1),
      q('Folder pattern?', ['By type','By feature','Flat','Random'], 1),
      q('Block merges via:', ['Hope','Hooks + CI checks','Trust','Email'], 1),
      q('After shipping:', ['Walk away','Get feedback + iterate','Pivot','Forget'], 1),
    ],
    ['Small + done > big + dead','Feature folders','Quality gates in CI','Ship → feedback → iterate']
  ),
  lesson('fs-29', 29, 'Authentication Security & Passwords', '🔑',
    'Passwords and user login are the front door of your application. Storing plaintext passwords or using weak hashing algorithms guarantees a data breach — secure handling is mandatory.',
    [
      { title: '1. Password Hashing', beginner: 'Never store plain passwords. Use bcrypt, Argon2, or PBKDF2.', advanced: 'Hashing is one-way. Salting prevents rainbow table attacks by adding random data to every password before hashing.' },
      { title: '2. Multi-Factor Authentication (MFA)', beginner: 'MFA adds an extra layer (app code, SMS, hardware key).', advanced: 'Time-based One-Time Passwords (TOTP) run on shared secrets via HMAC-SHA1 algorithms.' },
      { title: '3. Safe Session Management', beginner: 'Invalidate old sessions upon login/logout.', advanced: 'Protect against session fixation by regenerating session IDs after authentication.' },
      { title: '4. Rate Limiting Auth Routes', beginner: 'Prevent login brute-force attacks by limiting attempts.', advanced: 'Use Redis-backed rate limiters (e.g., token bucket algorithm) on login and password reset routes.' },
    ],
    { title: 'Audit Password Hashing', intro: 'Practice identifying safe auth implementations.', steps: [
      'Check database schema — verify password fields hold hash strings, not plain text.',
      'Ensure work factor / cost factor for bcrypt is set to at least 10–12.',
      'Add rate limiting middleware to `/api/login`.',
      'Ensure password reset tokens expire in 15 minutes or less.',
    ], goal: 'Understand secure credential storage and brute-force prevention.' },
    [
      q('Why store passwords with salt?', ['Faster lookups','Prevents rainbow table attacks','Saves database space','Decrypts passwords'], 1),
      q('Safe modern algorithm for password hashing?', ['MD5','SHA-1','Argon2 / bcrypt','Base64'], 2),
      q('Rate limiting on login prevents:', ['XSS','Brute-force password guessing','CORS errors','SQL Injection'], 1),
      q('Session fixation is prevented by:', ['Using HTTPS','Regenerating session ID on login','Using smaller cookies','Local storage'], 1),
    ],
    ['Never store plain passwords','Salting beats rainbow tables','Regenerate session IDs','Rate-limit login routes']
  ),
  lesson('fs-30', 30, 'JWT, OAuth & Token Security', '🎫',
    'Tokens power modern stateless authentication across web and mobile. Storing or parsing tokens incorrectly lets attackers impersonate any user.',
    [
      { title: '1. JWT Structure & Pitfalls', beginner: 'A JWT has Header, Payload, and Signature.', advanced: 'Never trust a JWT payload on the frontend without signature verification on the server. Watch out for the "none" algorithm attack.' },
      { title: '2. Secure Storage', beginner: 'Never store sensitive tokens in localStorage.', advanced: 'localStorage is vulnerable to XSS. Store access tokens in memory and refresh tokens in httpOnly, Secure, SameSite cookies.' },
      { title: '3. OAuth 2.0 Basics', beginner: 'OAuth lets users sign in with Google/GitHub without giving you their password.', advanced: 'Understand the Authorization Code Flow with PKCE for single-page applications and mobile clients.' },
      { title: '4. Token Expiration & Refresh', beginner: 'Keep access tokens short-lived (e.g., 15 mins).', advanced: 'Use refresh token rotation so compromised refresh tokens are automatically invalidated upon detection.' },
    ],
    { title: 'Inspect a JWT Safely', intro: 'Understand token payload decoding.', steps: [
      'Understand how header.payload.signature parts separate by dots (.).',
      'Verify JWT claims like exp (expiration) and iat (issued at).',
      'Check response headers to ensure tokens arrive via Set-Cookie with httpOnly.',
    ], goal: 'Know where to safely store and validate client tokens.' },
    [
      q('Where is the safest place to store a refresh token in a browser?', ['localStorage','sessionStorage','httpOnly cookie','URL query parameter'], 2),
      q('OAuth 2.0 is primarily designed for:', ['Database indexing','Delegated authorization','Encrypting files','DOM manipulation'], 1),
      q('Why keep access tokens short-lived?', ['Save server bandwidth','Minimize damage if token is leaked','Required by HTML5','Improves CSS rendering'], 1),
      q('A JWT signature ensures:', ['The payload is secret','The token content has not been tampered with','The database is backed up','The connection uses TCP'], 1),
    ],
    ['httpOnly cookies beat localStorage','JWTs need signature verification','OAuth = delegated auth','Rotate refresh tokens']
  ),
  lesson('fs-31', 31, 'Cross-Site Attacks: XSS, CSRF & CORS', '🛡️',
    'Understanding web security mechanisms like CORS, CSRF, and XSS is essential to prevent malicious scripts from hijacking user accounts.',
    [
      { title: '1. Cross-Site Scripting (XSS)', beginner: 'XSS happens when attackers inject malicious scripts into your site.', advanced: 'Reflected vs Stored vs DOM-based XSS. Use Content Security Policy (CSP) and sanitize inputs to mitigate.' },
      { title: '2. Cross-Site Request Forgery (CSRF)', beginner: 'CSRF tricks a logged-in user into making unwanted requests.', advanced: 'Mitigate using SameSite=Strict/Lax cookie attributes and Anti-CSRF tokens for mutating requests (POST/PUT/DELETE).' },
      { title: '3. CORS Fundamentals', beginner: 'CORS is a browser policy restricting cross-origin requests.', advanced: 'CORS protects users, not servers. Configure Access-Control-Allow-Origin strictly instead of wildcard (`*`).' },
      { title: '4. Security Headers', beginner: 'Add HTTP response headers to harden your app.', advanced: 'Set Content-Security-Policy, X-Content-Type-Options: nosniff, and Strict-Transport-Security (HSTS).' },
    ],
    { title: 'Fix an XSS Vulnerability', intro: 'In the editor.', steps: [
      'Replace dangerouslySetInnerHTML or innerHTML with safe React expressions or textContent.',
      'Configure CSP header in your server code.',
      'Set SameSite=Lax on authentication cookies.',
    ], goal: 'Eliminate XSS vectors and configure browser protections.' },
    [
      q('CORS is enforced by:', ['The database','The browser','The ISP','The user\'s router'], 1),
      q('Which cookie attribute helps prevent CSRF?', ['Secure','Domain','SameSite','Path'], 2),
      q('XSS allows an attacker to:', ['Run arbitrary JavaScript in the victim\'s browser','Crash the database server','Read server source code directly','Bypass DNS'], 0),
      q('Wildcard Access-Control-Allow-Origin (*) in production is:', ['Recommended','A security risk for authenticated APIs','Required for React','Faster for DB queries'], 1),
    ],
    ['CORS is enforced by browsers','SameSite cookies block CSRF','Escape output to stop XSS','Use CSP security headers']
  ),
  lesson('fs-32', 32, 'Injection Attacks & Secure API Design', '🔒',
    'APIs are your application\'s public gateway. Defending against SQL injection and enforcing least-privilege API design ensures data integrity.',
    [
      { title: '1. SQL Injection (SQLi)', beginner: 'SQLi happens when untrusted user input alters database queries.', advanced: 'Never concatenate SQL strings. Use parameterized queries, prepared statements, or ORMs (Prisma, Drizzle).' },
      { title: '2. Input Validation & Sanitization', beginner: 'Validate every incoming API payload before processing.', advanced: 'Use schema validators (Zod, TypeBox). Strip unknown keys, enforce types, and check length bounds.' },
      { title: '3. Broken Object Level Authorization (BOLA)', beginner: 'Ensure users can only access their own data.', advanced: 'Check permissions on every single request: `WHERE id = resource_id AND user_id = current_user_id`.' },
      { title: '4. Secure API Defaults', beginner: 'Hide detailed stack traces in production errors.', advanced: 'Implement error masking, request timeouts, payload size limits, and audit logging for administrative actions.' },
    ],
    { title: 'Parameterized Query Conversion', intro: 'Practice replacing insecure queries.', steps: [
      'Identify string concatenation in raw queries (`SELECT * FROM users WHERE id = ` + req.params.id).',
      'Replace with prepared statement placeholders (`SELECT * FROM users WHERE id = $1`, [req.params.id]).',
      'Add Zod schema validation to request bodies before hitting backend logic.',
    ], goal: 'Prevent SQL injection and authorization bypasses.' },
    [
      q('How do you prevent SQL Injection?', ['Encrypt the database','Use parameterized queries/prepared statements','Use CSS styling','Disable HTTP GET'], 1),
      q('BOLA / IDOR vulnerability occurs when:', ['A server runs out of RAM','An API fails to verify if a user owns the requested resource ID','CSS fails to load','JWT expires'], 1),
      q('In production environments, error responses should:', ['Show full stack traces for debugging','Hide internal implementation details','Be sent via email','Include DB passwords'], 1),
      q('Zod schema validation on API routes helps prevent:', ['Invalid/malformed input processing','Slow network speeds','DNS leaks','CORS errors'], 0),
    ],
    ['Parameterized queries stop SQLi','Check ownership on every endpoint','Validate API inputs with schemas','Hide production stack traces']
  ),
];

export const getFullstackLessonById = (id: string): FullstackLesson | undefined =>
  FULLSTACK_LESSONS.find(l => l.id === id);

export const isFullstackLessonUnlocked = (id: string, completedLessons: string[]): boolean => {
  const idx = FULLSTACK_LESSONS.findIndex(l => l.id === id);
  if (idx <= 0) return true;
  return completedLessons.includes(FULLSTACK_LESSONS[idx - 1].id);
};
