// Local-Only Coding Track — 15 lessons (browser-only, no backend)
import type { FullstackLesson } from './fullstackLessons';
import type { Concept, QuizQuestion } from './networkingLessons';

export type LocalLesson = FullstackLesson;

const L = (
  id: string, order: number, title: string, icon: string, philosophy: string,
  concepts: Concept[], practical: LocalLesson['practical'], quiz: QuizQuestion[],
  keyTakeaways: string[]
): LocalLesson => ({
  id, module: 'Module 1: Local-Only Coding', order, title, icon, philosophy,
  concepts, practical, quiz, keyTakeaways,
});

const q = (question: string, options: string[], correctIndex: number, explanation?: string): QuizQuestion =>
  ({ question, options, correctIndex, explanation });

export const LOCAL_LESSONS: LocalLesson[] = [
  L('local-1', 1, 'What "Local-Only" Means', '🏠',
    'Most tutorials assume a server. You don\'t need one. Modern browsers ship with storage, files, offline support, and even databases — enough to build full apps that work without the internet.',
    [
      { title: '1. The Browser as Runtime', beginner: 'HTML + CSS + JS run anywhere a browser exists.', advanced: 'The browser is a sandboxed OS with file APIs, storage, workers, and crypto built in.' },
      { title: '2. No Server, No Cost', beginner: 'You don\'t need to host anything. Just open the HTML file.', advanced: 'Local apps are ideal for personal tools, classroom apps, low-trust environments.' },
      { title: '3. Trade-offs', beginner: 'Data lives on this device only — no sync.', advanced: 'You can add sync later with Dropbox/iCloud folders or export/import files manually.' },
      { title: '4. When to Stay Local', beginner: 'Single user, no sharing, privacy matters.', advanced: 'Most students never need a backend. Build local-first, add server only when sharing demands it.' },
    ],
    { title: 'Run a File Directly', intro: 'No build, no install.', steps: [
      'Create index.html in any folder.',
      'Add `<h1>Hello local</h1>`.',
      'Double-click the file in your file manager.',
      'It opens in your default browser — no server.',
      'That\'s a deployable app.',
    ], goal: 'You understand the "no-server" mindset.',
      code: { html: `<!DOCTYPE html>\n<html>\n<head><title>Local App</title></head>\n<body>\n  <h1>Hello local</h1>\n  <p>No server. No backend. Just a file.</p>\n</body>\n</html>`, css: '', js: '' } },
    [
      q('Local-only apps need:', ['A server','Just a browser','Cloud','None'], 1),
      q('Best for:', ['Multi-user social','Single-user tools, privacy','Streaming','Realtime chat'], 1),
      q('How to run?', ['Deploy','Open the file','npm start','Need backend'], 1),
      q('Add sync later via:', ['Impossible','File export, cloud folder','Always need server','Magic'], 1),
    ],
    ['Browser = full runtime','No server needed','Privacy by default','Local-first, server-later']
  ),

  L('local-2', 2, 'HTML, CSS, JS Refresher', '📄',
    'Three languages, one team. HTML is structure, CSS is style, JS is behavior. Every local app you build will use these — keep them clean and separated.',
    [
      { title: '1. Structure Layer (HTML)', beginner: 'Tags describe meaning — heading, paragraph, button.', advanced: 'Semantic tags help accessibility and search engines understand your page.' },
      { title: '2. Style Layer (CSS)', beginner: 'Selectors + properties. `.btn { color: red; }`.', advanced: 'CSS variables for theming. Use `:root { --c: red; }` then `var(--c)`.' },
      { title: '3. Behavior Layer (JS)', beginner: 'Add interactivity: clicks, input, animations.', advanced: 'Keep JS out of HTML attributes. Use `addEventListener` for clean separation.' },
      { title: '4. The Linking Rule', beginner: 'CSS in `<head>`, JS at end of `<body>` or with `defer`.', advanced: 'Defer/async on scripts prevents render blocking. Critical CSS inline is even faster.' },
    ],
    { title: 'Mini Toggle', intro: 'All three layers working together.', steps: [
      'HTML: a button and a paragraph.',
      'CSS: hide paragraph by default.',
      'JS: click toggles a `.show` class.',
      'CSS: `.show { display: block }`.',
      'Verify it works.',
    ], goal: 'You can wire HTML+CSS+JS without a framework.',
      code: {
        html: `<!DOCTYPE html>\n<html>\n<head><link rel="stylesheet" href="style.css"></head>\n<body>\n  <button id="t">Toggle</button>\n  <p id="msg">Hello!</p>\n  <script src="script.js"></script>\n</body>\n</html>`,
        css: `#msg { display: none; padding: 1rem; background: #eef; }\n#msg.show { display: block; }\nbutton { padding: .5rem 1rem; }`,
        js: `document.getElementById('t').addEventListener('click', () => {\n  document.getElementById('msg').classList.toggle('show');\n});`
      } },
    [
      q('HTML is for:', ['Style','Structure','Behavior','Server'], 1),
      q('CSS is for:', ['Behavior','Style','Logic','Network'], 1),
      q('JS is for:', ['Structure','Style','Behavior','Storage only'], 2),
      q('Best place for `<script>` tag?', ['Random','End of body or with defer','Inside head','Inside CSS'], 1),
    ],
    ['Three layers, one app','Semantic HTML','CSS variables','defer scripts']
  ),

  L('local-3', 3, 'DOM Manipulation', '🌳',
    'The DOM is your app\'s living UI. JS reads it, writes it, and listens to events on it. Master this and you can build anything in a browser.',
    [
      { title: '1. Selecting Elements', beginner: '`getElementById`, `querySelector`, `querySelectorAll`.', advanced: '`querySelector` accepts any CSS selector — usually all you need.' },
      { title: '2. Reading & Writing', beginner: '`el.textContent`, `el.innerHTML`, `el.value`.', advanced: 'Prefer textContent over innerHTML for user input — prevents XSS injection.' },
      { title: '3. Creating Nodes', beginner: '`document.createElement`, then `.appendChild`.', advanced: 'Build a fragment for batch inserts: `DocumentFragment` reduces reflow cost.' },
      { title: '4. Events', beginner: '`el.addEventListener("click", fn)`.', advanced: 'Use event delegation on a parent for dynamic children. One listener, infinite items.' },
    ],
    { title: 'Live Counter', intro: 'Click adds an item.', steps: [
      'HTML: input + button + ul.',
      'JS: on button click, read input, create <li>, set textContent, append.',
      'Clear the input.',
      'Try event delegation: clicking an li removes it.',
      'Done — no framework needed.',
    ], goal: 'You can build dynamic UI with vanilla JS.',
      code: {
        html: `<!DOCTYPE html>\n<html>\n<head><link rel="stylesheet" href="style.css"></head>\n<body>\n  <input id="t" placeholder="task..." />\n  <button id="b">Add</button>\n  <ul id="list"></ul>\n  <script src="script.js"></script>\n</body>\n</html>`,
        css: `body { font: 16px sans-serif; padding: 1rem; }\nli { padding: .25rem; cursor: pointer; }\nli:hover { background: #fee; }`,
        js: `const input = document.getElementById('t');\nconst list = document.getElementById('list');\n\ndocument.getElementById('b').addEventListener('click', () => {\n  if (!input.value.trim()) return;\n  const li = document.createElement('li');\n  li.textContent = input.value;\n  list.appendChild(li);\n  input.value = '';\n});\n\nlist.addEventListener('click', e => {\n  if (e.target.tagName === 'LI') e.target.remove();\n});`
      } },
    [
      q('Safer than innerHTML?', ['textContent','setAttribute','none','HTML5'], 0),
      q('Pattern for dynamic children?', ['Loop listeners','Event delegation','Inline onclick','Polling'], 1),
      q('Batch DOM inserts use:', ['Loop','DocumentFragment','Promise','Worker'], 1),
      q('Selector library inside browser?', ['jQuery only','querySelector','XPath required','Fetch'], 1),
    ],
    ['querySelector for most','textContent for safety','Delegate events','Fragments batch inserts']
  ),

  L('local-4', 4, 'localStorage', '💾',
    'localStorage is your app\'s drawer — small, simple, persists between visits. Perfect for settings, drafts, last-opened item.',
    [
      { title: '1. The API', beginner: '`localStorage.setItem(key, value)` + `getItem`.', advanced: '~5MB limit per origin. Strings only — you must JSON.stringify objects.' },
      { title: '2. Persistence', beginner: 'Survives reloads, tab close, restart.', advanced: 'Cleared by: user clearing site data, browser privacy mode exits, code calling .clear().' },
      { title: '3. Patterns', beginner: 'Read on load, write on change.', advanced: 'Debounce writes to avoid spamming on every keystroke (use setTimeout).' },
      { title: '4. sessionStorage', beginner: 'Same API, but clears on tab close.', advanced: 'Use for "current session only" data like a multi-step form\'s in-progress state.' },
    ],
    { title: 'Persistent Theme Switcher', intro: 'Remember preference.', steps: [
      'HTML: button "Toggle theme".',
      'On click: toggle body class "dark".',
      'Save: `localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light")`.',
      'On load: read and apply.',
      'Reload — theme persists.',
    ], goal: 'Your app remembers user preferences.',
      code: {
        html: `<!DOCTYPE html>\n<html>\n<head><link rel="stylesheet" href="style.css"></head>\n<body>\n  <button id="t">Toggle Theme</button>\n  <h1>Local Storage Demo</h1>\n  <script src="script.js"></script>\n</body>\n</html>`,
        css: `body { font: 16px sans-serif; padding: 1rem; background: #fff; color: #111; }\nbody.dark { background: #111; color: #fff; }\nbutton { padding: .5rem 1rem; cursor: pointer; }`,
        js: `if (localStorage.getItem('theme') === 'dark') document.body.classList.add('dark');\n\ndocument.getElementById('t').addEventListener('click', () => {\n  document.body.classList.toggle('dark');\n  localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');\n});`
      } },
    [
      q('localStorage stores:', ['Objects','Strings only','Files','Images'], 1),
      q('Approx size limit?', ['1KB','~5MB','Unlimited','100MB'], 1),
      q('Persists when?', ['Just tab','Forever until cleared','One day','One hour'], 1),
      q('Tab-only storage?', ['localStorage','sessionStorage','cookie','IndexedDB'], 1),
    ],
    ['Strings only — JSON the rest','~5MB per origin','Survives reload','sessionStorage = tab-only']
  ),

  L('local-5', 5, 'IndexedDB Basics', '🗄️',
    'When 5MB isn\'t enough or you need real querying, IndexedDB is the browser\'s built-in NoSQL database — bigger, faster, more powerful.',
    [
      { title: '1. Why IndexedDB', beginner: 'Hundreds of MB to GBs. Stores any object (not just strings).', advanced: 'Async, transactional. Perfect for offline apps that hold lots of records.' },
      { title: '2. Conceptual Model', beginner: 'Database → Object Stores (tables) → Records.', advanced: 'Indexes let you query by fields. Schema versioning with `onupgradeneeded`.' },
      { title: '3. Wrappers Help', beginner: 'Raw API is verbose. Use `idb` (~3KB) for a clean Promise API.', advanced: 'Dexie.js for advanced queries, migrations, hooks. Either is fine.' },
      { title: '4. When to Use', beginner: 'Notes app, offline cache, large lists.', advanced: 'Combine with Service Worker for full offline-first apps.' },
    ],
    { title: 'Tiny Notes DB', intro: 'Using the idb wrapper.', steps: [
      'Include idb via CDN: `<script type="module">import { openDB } from "https://cdn.skypack.dev/idb"`.',
      'openDB("notes", 1, { upgrade(db) { db.createObjectStore("n", {keyPath:"id"}) } }).',
      '`db.put("n", { id: Date.now(), text: "hi" })`.',
      '`const all = await db.getAll("n")`.',
      'console.log(all).',
    ], goal: 'You stored persistent data without a server.' },
    [
      q('Limit vs localStorage?', ['Same','Much larger','Less','None'], 1),
      q('IndexedDB is:', ['Sync','Async + transactional','RPC','REST'], 1),
      q('Recommended wrapper?', ['none','idb / Dexie','jQuery','axios'], 1),
      q('Best for offline-first apps?', ['localStorage','IndexedDB','cookies','sessionStorage'], 1),
    ],
    ['Big + async','Stores objects','Use a wrapper','Pairs with Service Workers']
  ),

  L('local-6', 6, 'File API & Drag-and-Drop', '📁',
    'Browsers can read and write files directly. Import a JSON backup, drop an image, export user data — all without leaving the page.',
    [
      { title: '1. <input type="file">', beginner: 'The classic file picker.', advanced: 'Add `multiple` for batch. `accept=".json,.csv"` filters types.' },
      { title: '2. FileReader', beginner: 'Read text or DataURL from a File object.', advanced: 'readAsArrayBuffer for binary; readAsDataURL for image previews.' },
      { title: '3. Drag & Drop', beginner: 'dragover → preventDefault, drop → read e.dataTransfer.files.', advanced: 'Add visual feedback on dragover (highlight). Reset on dragleave.' },
      { title: '4. Saving Files', beginner: 'Create a Blob, make an `<a download>`, click it.', advanced: 'File System Access API (Chrome) writes directly — but limited browser support.' },
    ],
    { title: 'Backup & Restore', intro: 'JSON in, JSON out.', steps: [
      'Add a "Save" button: serialize localStorage to JSON, trigger download.',
      'Add a file input.',
      'On change, FileReader → parse JSON → load into state.',
      'Optionally support drag & drop.',
      'Now your local app has backups.',
    ], goal: 'You can save and load files from disk.' },
    [
      q('Read file content with:', ['FileReader','FileSaver','Worker','fetch'], 0),
      q('Trigger download via:', ['Server','Blob + <a download>','prompt','window.save'], 1),
      q('Multiple files at once?', ['Impossible','multiple attribute','Only Chrome','Loop'], 1),
      q('Save without picker?', ['Always','File System Access API (limited)','Never','localStorage'], 1),
    ],
    ['File input is the gateway','FileReader for content','Blob + download for save','Drag-drop is easy']
  ),

  L('local-7', 7, 'Service Workers & Offline', '📴',
    'A Service Worker is a script the browser runs in the background — it can intercept network requests, serve cached responses, and make your app work offline.',
    [
      { title: '1. What They Do', beginner: 'Proxy between your page and the network.', advanced: 'Lifecycle: install → activate → fetch. Run separately from the page, no DOM access.' },
      { title: '2. Registration', beginner: '`navigator.serviceWorker.register("/sw.js")`.', advanced: 'Must be served over HTTPS (or localhost). Scope = folder where sw.js lives.' },
      { title: '3. Caching Strategies', beginner: 'Cache-first for static, network-first for fresh data.', advanced: 'Stale-while-revalidate gives instant UI + background updates. Workbox simplifies all of this.' },
      { title: '4. Offline UX', beginner: 'Show cached UI; queue write actions to retry.', advanced: 'Use the Background Sync API for guaranteed retries when connection returns.' },
    ],
    { title: 'Cache the Shell', intro: 'Three steps.', steps: [
      'Create sw.js with install event: caches.open("v1").then(c => c.addAll([...assets])).',
      'Add fetch event: caches.match(e.request).then(r => r || fetch(e.request)).',
      'Register from main JS.',
      'DevTools → Application → Service Workers — verify.',
      'Toggle offline and reload — still works.',
    ], goal: 'Your app loads offline.' },
    [
      q('SW requires:', ['HTTP','HTTPS or localhost','VPN','Auth'], 1),
      q('SW lifecycle order?', ['fetch→install','install→activate→fetch','random','one-shot'], 1),
      q('Library to simplify SW?', ['lodash','Workbox','jQuery','axios'], 1),
      q('Stale-while-revalidate is:', ['Bad','Instant + background refresh','Slow','Sync'], 1),
    ],
    ['Background network proxy','HTTPS required','Cache strategies matter','Workbox saves time']
  ),

  L('local-8', 8, 'PWA Essentials', '📱',
    'A Progressive Web App can be installed to a home screen and feels native. Add a manifest + service worker and your local app becomes installable.',
    [
      { title: '1. manifest.json', beginner: 'JSON file describing name, icons, start_url, theme.', advanced: 'display: "standalone" hides browser chrome. Include 192px and 512px icons.' },
      { title: '2. Install Prompt', beginner: 'Browser shows it automatically when criteria met.', advanced: 'Listen to `beforeinstallprompt` to trigger a custom install button.' },
      { title: '3. Splash & Theme', beginner: 'theme_color colors the title bar; background_color the splash.', advanced: 'iOS uses <meta name="apple-mobile-web-app-*" />. Add for full polish.' },
      { title: '4. Discoverability', beginner: 'PWAs are still websites — share via URL.', advanced: 'Add to home screen replaces app stores for many use cases — zero install friction.' },
    ],
    { title: 'Make Your App Installable', intro: 'Minimum viable PWA.', steps: [
      'Create manifest.json with name, icons (192, 512), start_url "/", display "standalone".',
      'Add `<link rel="manifest" href="manifest.json">` in HTML head.',
      'Add a Service Worker (previous lesson).',
      'Lighthouse audit → PWA tab.',
      'Click install in browser address bar.',
    ], goal: 'You have an installable web app.' },
    [
      q('PWA needs at minimum:', ['Manifest only','Manifest + SW + HTTPS','Server','Account'], 1),
      q('Custom install button via:', ['nothing','beforeinstallprompt event','prompt()','alert'], 1),
      q('Recommended icon sizes?', ['16px only','192 & 512','1px','64px'], 1),
      q('PWA users install via:', ['App store','Browser button / home screen','SMS','Manual'], 1),
    ],
    ['Manifest + SW + HTTPS','Two icon sizes minimum','beforeinstallprompt for UX','Bypass app stores']
  ),

  L('local-9', 9, 'Project: Local Notes App', '📝',
    'Time to combine: DOM, localStorage, file save/load, and a touch of CSS. Real local tool, single HTML file.',
    [
      { title: '1. The Spec', beginner: 'Add, edit, delete notes. Persist in localStorage.', advanced: 'Export to JSON for backup, import to restore. Search filter.' },
      { title: '2. Architecture', beginner: 'One state array; render() rebuilds the list each time.', advanced: 'Render functions are pure. State only changes via small action functions.' },
      { title: '3. Persistence', beginner: 'Save after every mutation; load on init.', advanced: 'Debounce save (300ms) — typing in a textarea shouldn\'t blast storage.' },
      { title: '4. Polish', beginner: 'Empty state message, focus the input on add.', advanced: 'Keyboard shortcut: Ctrl+Enter saves. Auto-resize textarea.' },
    ],
    { title: 'Build It', intro: 'In the editor here.', steps: [
      'HTML: textarea + button + ul#notes.',
      'JS: notes = JSON.parse(localStorage.notes || "[]").',
      'addNote() pushes + saves + renders.',
      'render() rebuilds the list with delete buttons.',
      'Add a CSV/JSON export button.',
    ], goal: 'You have a real local notes app.',
      code: {
        html: `<!DOCTYPE html>\n<html>\n<head><link rel="stylesheet" href="style.css"></head>\n<body>\n  <h1>📝 Notes</h1>\n  <textarea id="t" placeholder="new note..."></textarea>\n  <button id="add">Add</button>\n  <ul id="list"></ul>\n  <script src="script.js"></script>\n</body>\n</html>`,
        css: `body { font: 16px sans-serif; max-width: 600px; margin: 2rem auto; padding: 1rem; }\ntextarea { width: 100%; min-height: 80px; }\nul { list-style: none; padding: 0; }\nli { padding: .5rem; border-bottom: 1px solid #ddd; display: flex; gap: 1rem; align-items: flex-start; }\nbutton { cursor: pointer; }`,
        js: `let notes = JSON.parse(localStorage.notes || '[]');\nconst list = document.getElementById('list');\nconst t = document.getElementById('t');\n\nfunction render() {\n  list.innerHTML = '';\n  if (!notes.length) { list.innerHTML = '<li><em>No notes yet.</em></li>'; return; }\n  notes.forEach((n, i) => {\n    const li = document.createElement('li');\n    li.innerHTML = '<span></span><button>×</button>';\n    li.querySelector('span').textContent = n;\n    li.querySelector('button').onclick = () => { notes.splice(i,1); save(); };\n    list.appendChild(li);\n  });\n}\nfunction save() { localStorage.notes = JSON.stringify(notes); render(); }\n\ndocument.getElementById('add').onclick = () => {\n  if (!t.value.trim()) return;\n  notes.unshift(t.value.trim()); t.value = ''; save();\n};\nrender();`
      } },
    [
      q('Persistence layer for this size?', ['Server','localStorage','SQL','Files only'], 1),
      q('Why a single render() function?', ['Faster','Simpler reasoning','Required','Stylish'], 1),
      q('Debounce write because?', ['No reason','Avoid storage spam on every keystroke','Speed','Random'], 1),
      q('Export feature uses:', ['Server','Blob + download','Email','Print'], 1),
    ],
    ['One state array','Render fn rebuilds list','Persist after each change','Add export for backup']
  ),

  L('local-10', 10, 'Project: Habit Tracker', '✅',
    'Daily checkboxes. Streaks. Charts. All local. The kind of app that\'s yours forever, regardless of any service shutting down.',
    [
      { title: '1. Data Shape', beginner: 'habits = [{ name, history: {"2026-06-03": true, ...} }].', advanced: 'Dates as ISO yyyy-mm-dd keys — sortable and timezone-safe enough for daily use.' },
      { title: '2. Today\'s State', beginner: 'Compute today\'s ISO date once. Render a checkbox per habit.', advanced: 'Use Intl.DateTimeFormat for localized display while storing ISO under the hood.' },
      { title: '3. Streak Calc', beginner: 'Count consecutive days ending today.', advanced: 'Cache per render. Recompute only when a checkmark changes.' },
      { title: '4. Visualizing', beginner: 'A 7×N grid of cells — green = done, gray = missed.', advanced: 'CSS Grid + data-attributes makes the calendar a 20-line render.' },
    ],
    { title: 'Build It', intro: 'Quick architecture.', steps: [
      'Load habits from localStorage on init.',
      'Render: for each habit, today\'s checkbox + 7-day strip.',
      'On change: update history, save, re-render.',
      'Show streak number next to each habit.',
      'Bonus: add/remove habits UI.',
    ], goal: 'You have your own habit tracker, forever yours.' },
    [
      q('Best date key format?', ['mm/dd/yy','ISO yyyy-mm-dd','Unix only','locale string'], 1),
      q('Streak calculation triggers re-render when?', ['Daily cron','On every render','On data change','Never'], 2),
      q('Calendar grid with:', ['Tables only','CSS Grid','Canvas','SVG required'], 1),
      q('Risk of cloud habit apps?', ['None','Service shutdown loses data','Faster','Better'], 1),
    ],
    ['ISO date keys','Strip grid renders fast','Recompute on change','Local = forever']
  ),

  L('local-11', 11, 'Project: Markdown Editor', '✍️',
    'Real-time markdown preview with persistent drafts. Single HTML file, no server, no account, no telemetry.',
    [
      { title: '1. Two-pane Layout', beginner: 'Flexbox with textarea on left, preview on right.', advanced: 'Make it responsive: stack on mobile (`flex-direction: column`).' },
      { title: '2. Markdown → HTML', beginner: 'Use the `marked` library via CDN.', advanced: 'Sanitize with DOMPurify — markdown can embed raw HTML which is XSS-risky.' },
      { title: '3. Live Update', beginner: 'On textarea input, parse and inject into preview.', advanced: 'Throttle/debounce if input is huge. Otherwise repaint is fine.' },
      { title: '4. Drafts', beginner: 'localStorage on each input.', advanced: 'Auto-save indicator + "last saved 2s ago" UX builds user trust.' },
    ],
    { title: 'Build It', intro: 'Real editor in 30 lines.', steps: [
      'Two divs in flex container.',
      'textarea + preview div.',
      '<script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>.',
      'On input: preview.innerHTML = DOMPurify.sanitize(marked.parse(value)). Save to LS.',
      'On load: restore value from LS.',
    ], goal: 'You have a real, useful tool you wrote.' },
    [
      q('Live preview triggers on:', ['Save click','input event','blur','timer'], 1),
      q('Why sanitize HTML output?', ['Faster','XSS protection','Style','SEO'], 1),
      q('Persistence layer here?', ['Server','localStorage','None','IndexedDB only'], 1),
      q('Recommended markdown lib?', ['none','marked','jQuery','React'], 1),
    ],
    ['Flex layout','marked + DOMPurify','Live preview on input','Auto-save with indicator']
  ),

  L('local-12', 12, 'Project: Pomodoro Timer', '⏱️',
    'A focus timer that survives reload. Add ticks, beeps, and notifications — all in the browser.',
    [
      { title: '1. Timer Logic', beginner: 'setInterval ticking every second.', advanced: 'Don\'t rely on intervals for time — they drift. Compute remaining from start timestamp.' },
      { title: '2. Persistent State', beginner: 'Save start timestamp + duration in localStorage.', advanced: 'On reload, recompute remaining = end - now. Resume seamlessly.' },
      { title: '3. Audio Cue', beginner: 'new Audio("beep.mp3").play() at zero.', advanced: 'Mobile blocks autoplay — initial user gesture required. Pre-load on first click.' },
      { title: '4. Notifications API', beginner: 'Notification.requestPermission(); new Notification("Done!").', advanced: 'Service Worker registration enables persistent notifications even when tab is closed.' },
    ],
    { title: 'Build It', intro: 'Robust timer.', steps: [
      'Start button stores end = Date.now() + 25*60*1000.',
      'requestAnimationFrame loop computes remaining + updates DOM.',
      'On zero: stop + play beep + send Notification.',
      'On reload: read end, resume if remaining > 0.',
      'Reset clears state.',
    ], goal: 'You have a Pomodoro that just works.' },
    [
      q('Why store end timestamp?', ['Looks cool','Avoids drift on reload','Required','Speed'], 1),
      q('Notification API needs:', ['Nothing','User permission','Server','Cookies'], 1),
      q('Audio on mobile requires:', ['Always works','Initial user gesture','Server','MIDI'], 1),
      q('Best timing primitive?', ['setInterval alone','requestAnimationFrame + computed remaining','setTimeout once','sleep'], 1),
    ],
    ['Store end-time, not seconds-left','Resume after reload','rAF for UI updates','Notifications need permission']
  ),

  L('local-13', 13, 'Project: Local Image Editor', '🖼️',
    'Crop, filter, and download — all client-side. Your users\' photos never touch a server.',
    [
      { title: '1. Loading Images', beginner: 'File input → FileReader → readAsDataURL → set <img> src.', advanced: 'For big files, use URL.createObjectURL — no base64 overhead.' },
      { title: '2. Canvas', beginner: 'Draw image to <canvas> via ctx.drawImage.', advanced: 'Canvas size matters: drawing onto 4K canvas keeps quality. Then resize for display.' },
      { title: '3. Filters', beginner: 'CSS filter on canvas works for preview.', advanced: 'For permanent baked-in filters, use ctx.filter before drawImage.' },
      { title: '4. Download', beginner: 'canvas.toBlob → URL.createObjectURL → `<a download>`.', advanced: 'Specify image/jpeg vs png. JPEG quality 0.92 = sweet spot.' },
    ],
    { title: 'Build It', intro: 'Minimal editor.', steps: [
      'File input → load image.',
      'Draw to canvas.',
      '3 filter buttons that set ctx.filter ("grayscale(1)", "blur(2px)", "sepia(1)") and redraw.',
      'Download button via canvas.toBlob.',
      'No upload ever — everything stays local.',
    ], goal: 'You have a privacy-preserving image tool.' },
    [
      q('Efficient large-file loading?', ['readAsDataURL','URL.createObjectURL','fetch','base64'], 1),
      q('Permanent filter via:', ['CSS only','ctx.filter before drawImage','print','SVG'], 1),
      q('Recommended JPEG quality?', ['1','~0.92','0.5','0.1'], 1),
      q('Download tool?', ['Server','canvas.toBlob + <a download>','copy/paste','Email'], 1),
    ],
    ['Canvas = local power','createObjectURL beats base64','ctx.filter bakes effects','Server-free privacy']
  ),

  L('local-14', 14, 'Local Encryption Basics', '🔐',
    'Web Crypto API ships in every browser. You can encrypt notes with a password before saving — even from yourself.',
    [
      { title: '1. Web Crypto', beginner: 'window.crypto.subtle has hash, encrypt, decrypt, sign.', advanced: 'All async, all native, audited. Never roll your own crypto — use subtle.' },
      { title: '2. PBKDF2', beginner: 'Derives a key from a password + salt.', advanced: '100,000+ iterations slows brute force. Store salt with ciphertext, not the password.' },
      { title: '3. AES-GCM', beginner: 'Symmetric authenticated encryption.', advanced: 'Use a unique IV per encryption. GCM provides integrity for free.' },
      { title: '4. Storage Pattern', beginner: 'Save { salt, iv, ciphertext } in localStorage.', advanced: 'Never store the password. Re-derive the key from user input each session.' },
    ],
    { title: 'Encrypt a Note', intro: 'Concept walk-through.', steps: [
      'subtle.digest with SHA-256 to test it works.',
      'Derive key: PBKDF2 from password + random salt (16 bytes).',
      'Encrypt: AES-GCM with random IV (12 bytes).',
      'Save salt+iv+ciphertext (base64).',
      'On unlock: prompt password → derive same key → decrypt.',
    ], goal: 'You can build truly private local apps.' },
    [
      q('Roll your own crypto?', ['Sometimes','Never — use subtle','Always','Faster'], 1),
      q('PBKDF2 needs:', ['Just password','Password + salt + iterations','Username','Email'], 1),
      q('AES-GCM IV should be:', ['Reused','Unique per encrypt','Empty','Hashed'], 1),
      q('Store the password?', ['Yes','Never — re-derive','Hashed in LS','In cookie'], 1),
    ],
    ['Web Crypto is built-in','Salt + IV are not secret','Iterations slow brute force','Never store the password']
  ),

  L('local-15', 15, 'Shipping Local Apps', '📦',
    'Building is half the work — shipping is the other half. Local apps can be shared, hosted free, or even bundled as desktop apps.',
    [
      { title: '1. Share by URL', beginner: 'Push to GitHub Pages / Netlify / Cloudflare Pages — all free, all static.', advanced: 'Cloudflare Pages gets global edge for free. Drag and drop works.' },
      { title: '2. Share by File', beginner: 'Zip your folder. Recipient unzips and double-clicks index.html.', advanced: 'Use sourcemaps and minified code — same as on the web.' },
      { title: '3. Make a Desktop App', beginner: 'Wrap with Tauri (Rust) or Electron (Node).', advanced: 'Tauri = tiny binaries (~5MB). Electron = batteries-included but heavy (~120MB).' },
      { title: '4. Make a Phone App', beginner: 'Use Capacitor or PWA install.', advanced: 'PWA covers 90% of needs. Capacitor only for native APIs (NFC, biometrics, etc.).' },
    ],
    { title: 'Ship This Course\'s App', intro: 'Pick one path.', steps: [
      'Push to GitHub.',
      'Connect Cloudflare Pages → auto-deploy on push.',
      'Get free HTTPS + global CDN URL.',
      'Or: zip + email to a friend.',
      'Or: wrap with Tauri for a real desktop app.',
    ], goal: 'You can deliver a local app via any channel.' },
    [
      q('Free static hosts include:', ['None','GitHub Pages / Netlify / Cloudflare','Only paid','AWS only'], 1),
      q('Lightweight desktop wrapper?', ['Electron','Tauri','PHP','Java'], 1),
      q('PWA covers most needs?', ['No','Yes','Only iOS','Only Android'], 1),
      q('Best for global edge perf?', ['Heroku','Cloudflare Pages','VPS','FTP'], 1),
    ],
    ['Static hosts = free','Tauri ≪ Electron in size','PWA before Capacitor','Ship via the right channel']
  ),
];

export const getLocalLessonById = (id: string): LocalLesson | undefined =>
  LOCAL_LESSONS.find(l => l.id === id);

export const isLocalLessonUnlocked = (id: string, completedLessons: string[]): boolean => {
  const idx = LOCAL_LESSONS.findIndex(l => l.id === id);
  if (idx <= 0) return true;
  return completedLessons.includes(LOCAL_LESSONS[idx - 1].id);
};
