export type PuzzleTrack = 'html' | 'css' | 'js' | 'python' | 'java' | 'cs' | 'networking';
export type Track = PuzzleTrack | 'all';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Puzzle {
  id: string;
  track: PuzzleTrack;
  difficulty: Difficulty;
  brokenCode: string;
  expectedFix: string;
  choices?: string[];
  hint: string;
  timeLimit: number;
  message: string;
  explanation: string; // NEW: For the relaxing post-solve review screen
}

export const PUZZLES: Puzzle[] = [
  // ── HTML EASY ──
  { id: 'h-e-1', track: 'html', difficulty: 'easy', timeLimit: 30, hint: 'Closing tags need a slash.',
    brokenCode: '<h1>Welcome<h1>', expectedFix: '<h1>Welcome</h1>',
    choices: ['<h1>Welcome</h1>', '<h1>Welcome<h1>', '<h1/>Welcome<h1>', '</h1>Welcome<h1>'],
    message: 'Tag sealed!', explanation: 'HTML tags usually come in pairs. The closing tag needs a forward slash `/` to tell the browser where the heading ends.' },
  { id: 'h-e-2', track: 'html', difficulty: 'easy', timeLimit: 30, hint: '<img> requires src.',
    brokenCode: '<img href="cat.png">', expectedFix: '<img src="cat.png">',
    choices: ['<img src="cat.png">', '<img link="cat.png">', '<img url="cat.png">', '<image src="cat.png">'],
    message: 'Image loaded!', explanation: 'Images use the `src` (source) attribute to load files, not `href` which is reserved for links.' },
  { id: 'h-e-3', track: 'html', difficulty: 'easy', timeLimit: 30, hint: 'Anchor tag.',
    brokenCode: '<link href="home.html">Home</link>', expectedFix: '<a href="home.html">Home</a>',
    choices: ['<a href="home.html">Home</a>', '<link href="home.html">Home</link>', '<href="home.html">Home</href>', '<url>home.html</url>'],
    message: 'Link unlocked!', explanation: 'The `<a>` (anchor) tag is used for hyperlinks. `<link>` is only used in the `<head>` for stylesheets.' },
  { id: 'h-e-4', track: 'html', difficulty: 'easy', timeLimit: 30, hint: 'Lists need item tags.',
    brokenCode: '<ul><item>One</item></ul>', expectedFix: '<ul><li>One</li></ul>',
    choices: ['<ul><li>One</li></ul>', '<ul><item>One</item></ul>', '<ol><li>One</li></ol>', '<list><li>One</li></list>'],
    message: 'Listed!', explanation: 'List items must be wrapped in `<li>` tags, not `<item>`, so the browser knows how to format them.' },
  { id: 'h-e-5', track: 'html', difficulty: 'easy', timeLimit: 30, hint: 'Self-closing void element.',
    brokenCode: '<br></br>', expectedFix: '<br>',
    choices: ['<br>', '<br></br>', '<break>', '</br>'],
    message: 'Line broken!', explanation: '`<br>` is a void element (like `<img>`). It doesn\'t wrap text, so it doesn\'t need a closing tag.' },

  // ── HTML MEDIUM ──
  { id: 'h-m-1', track: 'html', difficulty: 'medium', timeLimit: 35, hint: 'Form inputs need a name.',
    brokenCode: '<input type="text" id="email">', expectedFix: '<input type="email" name="email" id="email">',
    choices: ['<input type="email" name="email" id="email">', '<input type="text" id="email">', '<input email="true" id="email">', '<input>email</input>'],
    message: 'Form wired!', explanation: 'Inputs need a `name` attribute so the server knows what data is being sent, and `type="email"` validates the format.' },
  { id: 'h-m-2', track: 'html', difficulty: 'medium', timeLimit: 35, hint: 'Semantic landmarks.',
    brokenCode: '<div class="header"><h1>Site</h1></div>', expectedFix: '<header><h1>Site</h1></header>',
    choices: ['<header><h1>Site</h1></header>', '<div class="header"><h1>Site</h1></div>', '<head><h1>Site</h1></head>', '<top><h1>Site</h1></top>'],
    message: 'Semantics restored!', explanation: 'Semantic tags like `<header>` help screen readers and search engines understand your page structure better than generic `<div>`s.' },
  { id: 'h-m-3', track: 'html', difficulty: 'medium', timeLimit: 35, hint: 'Alt text matters.',
    brokenCode: '<img src="hero.jpg">', expectedFix: '<img src="hero.jpg" alt="Hero banner">',
    choices: ['<img src="hero.jpg" alt="Hero banner">', '<img src="hero.jpg" title="Hero">', '<img src="hero.jpg" desc="Hero">', '<img src="hero.jpg" name="hero">'],
    message: 'Accessible!', explanation: '`alt` text is crucial for accessibility. It describes the image to visually impaired users using screen readers.' },
  { id: 'h-m-4', track: 'html', difficulty: 'medium', timeLimit: 35, hint: 'Label uses for, input uses id.',
    brokenCode: '<label name="email">Email</label><input id="email">', expectedFix: '<label for="email">Email</label><input id="email">',
    choices: ['<label for="email">Email</label><input id="email">', '<label name="email">Email</label><input id="email">', '<label id="email">Email</label><input for="email">', '<label>Email</label><input id="email">'],
    message: 'Label linked!', explanation: 'The `for` attribute on a label must match the `id` of the input. This makes the entire label clickable, improving UX.' },
  { id: 'h-m-5', track: 'html', difficulty: 'medium', timeLimit: 35, hint: 'Buttons over divs.',
    brokenCode: '<div onclick="go()">Click</div>', expectedFix: '<button onclick="go()">Click</button>',
    choices: ['<button onclick="go()">Click</button>', '<div onclick="go()">Click</div>', '<a onclick="go()">Click</a>', '<span click="go()">Click</span>'],
    message: 'Button forged!', explanation: 'Always use `<button>` for actions. Divs lack built-in keyboard accessibility and focus states that buttons have.' },

  // ── HTML HARD ──
  { id: 'h-h-1', track: 'html', difficulty: 'hard', timeLimit: 45, hint: 'Close the paragraph properly.',
    brokenCode: '<p>Hello world<p>', expectedFix: '<p>Hello world</p>', message: 'Closed!', explanation: 'Paragraphs need a closing `</p>` tag to prevent layout bleeding into subsequent elements.' },
  { id: 'h-h-2', track: 'html', difficulty: 'hard', timeLimit: 45, hint: 'Use <nav> for navigation.',
    brokenCode: '<div id="nav"><a>Home</a></div>', expectedFix: '<nav><a>Home</a></nav>', message: 'Navigation set!', explanation: 'The `<nav>` tag explicitly tells browsers and assistive tech that this section contains primary navigation links.' },
  { id: 'h-h-3', track: 'html', difficulty: 'hard', timeLimit: 45, hint: 'Meta viewport for mobile.',
    brokenCode: '<meta name="viewport">', expectedFix: '<meta name="viewport" content="width=device-width, initial-scale=1">', message: 'Responsive ready!', explanation: 'Without the viewport meta tag, mobile browsers will render the page at a desktop width and scale it down.' },
  { id: 'h-h-4', track: 'html', difficulty: 'hard', timeLimit: 45, hint: 'Use <article> wrapper.',
    brokenCode: '<div class="post"><h2>Post</h2></div>', expectedFix: '<article><h2>Post</h2></article>', message: 'Article published!', explanation: '`<article>` is for independent, self-contained content that could be syndicated (like a blog post or news story).' },
  { id: 'h-h-5', track: 'html', difficulty: 'hard', timeLimit: 45, hint: 'Wrap rows in <tr>.',
    brokenCode: '<table><td>A</td><td>B</td></table>', expectedFix: '<table><tr><td>A</td><td>B</td></tr></table>', message: 'Table built!', explanation: 'Table cells (`<td>`) must always be wrapped in a table row (`<tr>`) to render correctly.' },

  // ── CSS EASY ──
  { id: 'c-e-1', track: 'css', difficulty: 'easy', timeLimit: 30, hint: 'Property name is background-color.',
    brokenCode: 'body { bgcolor: red; }', expectedFix: 'body { background-color: red; }',
    choices: ['body { background-color: red; }', 'body { bgcolor: red; }', 'body { bg: red; }', 'body { color-bg: red; }'],
    message: 'Painted!', explanation: 'CSS properties use hyphens for multi-word names. `bgcolor` is an old HTML attribute, not CSS.' },
  { id: 'c-e-2', track: 'css', difficulty: 'easy', timeLimit: 30, hint: 'IDs start with #.',
    brokenCode: '.main { color: blue; }', expectedFix: '#main { color: blue; }',
    choices: ['#main { color: blue; }', '.main { color: blue; }', '@main { color: blue; }', '*main { color: blue; }'],
    message: 'Selector fixed!', explanation: 'In CSS, IDs are targeted with a hash `#`, while classes use a dot `.`.' },
  { id: 'c-e-3', track: 'css', difficulty: 'easy', timeLimit: 30, hint: 'display:none hides.',
    brokenCode: '.hidden { visibility: gone; }', expectedFix: '.hidden { display: none; }',
    choices: ['.hidden { display: none; }', '.hidden { visibility: gone; }', '.hidden { hide: true; }', '.hidden { show: false; }'],
    message: 'Hidden!', explanation: '`visibility: hidden` makes things invisible but they still take up space. `display: none` removes them completely.' },
  { id: 'c-e-4', track: 'css', difficulty: 'easy', timeLimit: 30, hint: 'Units required.',
    brokenCode: '.box { width: 100; }', expectedFix: '.box { width: 100px; }',
    choices: ['.box { width: 100px; }', '.box { width: 100; }', '.box { width: 100pixels; }', '.box { width: 100p; }'],
    message: 'Sized!', explanation: 'CSS requires units (like px, rem, or %) for dimensions so the browser knows how to measure it.' },
  { id: 'c-e-5', track: 'css', difficulty: 'easy', timeLimit: 30, hint: 'Center text alignment.',
    brokenCode: '.title { align: center; }', expectedFix: '.title { text-align: center; }',
    choices: ['.title { text-align: center; }', '.title { align: center; }', '.title { center: true; }', '.title { text: center; }'],
    message: 'Centered!', explanation: 'The correct property for horizontal text alignment is `text-align`.' },

  // ── CSS MEDIUM ──
  { id: 'c-m-1', track: 'css', difficulty: 'medium', timeLimit: 35, hint: 'Flex direction property.',
    brokenCode: '.row { display: flex; direction: column; }', expectedFix: '.row { display: flex; flex-direction: column; }',
    choices: ['.row { display: flex; flex-direction: column; }', '.row { display: flex; direction: column; }', '.row { display: column; }', '.row { flex: column; }'],
    message: 'Stacked!', explanation: 'Flexbox uses `flex-direction` to control whether items stack vertically or horizontally.' },
  { id: 'c-m-2', track: 'css', difficulty: 'medium', timeLimit: 35, hint: 'Use justify-content.',
    brokenCode: '.row { display: flex; align: center; }', expectedFix: '.row { display: flex; justify-content: center; }',
    choices: ['.row { display: flex; justify-content: center; }', '.row { display: flex; align: center; }', '.row { display: flex; center: true; }', '.row { display: flex; horizontal: center; }'],
    message: 'Justified!', explanation: '`justify-content` aligns items along the main axis (usually horizontal), while `align-items` handles the cross axis.' },
  { id: 'c-m-3', track: 'css', difficulty: 'medium', timeLimit: 35, hint: 'box-sizing border-box.',
    brokenCode: '* { box-size: border; }', expectedFix: '* { box-sizing: border-box; }',
    choices: ['* { box-sizing: border-box; }', '* { box-size: border; }', '* { sizing: border; }', '* { box: border-box; }'],
    message: 'Resized!', explanation: '`box-sizing: border-box` includes padding and borders in the element\'s total width/height, making layouts much easier.' },
  { id: 'c-m-4', track: 'css', difficulty: 'medium', timeLimit: 35, hint: 'Position absolute needs parent relative.',
    brokenCode: '.tag { position: absolute; place: top; }', expectedFix: '.tag { position: absolute; top: 0; }',
    choices: ['.tag { position: absolute; top: 0; }', '.tag { position: absolute; place: top; }', '.tag { position: top; }', '.tag { absolute: top; }'],
    message: 'Positioned!', explanation: 'Use `top`, `right`, `bottom`, or `left` to offset absolutely positioned elements.' },
  { id: 'c-m-5', track: 'css', difficulty: 'medium', timeLimit: 35, hint: 'rgba uses 4 values.',
    brokenCode: '.shade { background: rgb(0, 0, 0, 0.5); }', expectedFix: '.shade { background: rgba(0, 0, 0, 0.5); }',
    choices: ['.shade { background: rgba(0, 0, 0, 0.5); }', '.shade { background: rgb(0, 0, 0, 0.5); }', '.shade { background: rgb(0, 0, 0); opacity: 0.5; }', '.shade { background-alpha: 0.5; }'],
    message: 'Shaded!', explanation: '`rgb` only takes 3 values. To add transparency (alpha), you must use `rgba` or the newer `rgb(0 0 0 / 0.5)` syntax.' },

  // ── CSS HARD ──
  { id: 'c-h-1', track: 'css', difficulty: 'hard', timeLimit: 45, hint: 'Grid template columns.',
    brokenCode: '.grid { display: grid; columns: 3; }', expectedFix: '.grid { display: grid; grid-template-columns: repeat(3, 1fr); }', message: 'Grid laid!', explanation: 'CSS Grid uses `grid-template-columns`. `repeat(3, 1fr)` creates 3 equal fractional columns.' },
  { id: 'c-h-2', track: 'css', difficulty: 'hard', timeLimit: 45, hint: 'transition needs property + duration.',
    brokenCode: '.btn { transition: 0.3s; }', expectedFix: '.btn { transition: all 0.3s ease; }', message: 'Smooth!', explanation: 'A transition needs to know WHAT property to animate, for HOW LONG, and the timing function.' },
  { id: 'c-h-3', track: 'css', difficulty: 'hard', timeLimit: 45, hint: 'Use transform: translate.',
    brokenCode: '.box { move-x: 50px; }', expectedFix: '.box { transform: translateX(50px); }', message: 'Translated!', explanation: 'CSS doesn\'t have a `move-x` property. We use `transform: translateX()` for hardware-accelerated movement.' },
  { id: 'c-h-4', track: 'css', difficulty: 'hard', timeLimit: 45, hint: 'Media query syntax.',
    brokenCode: '@media (mobile) { .box { width: 100%; } }', expectedFix: '@media (max-width: 768px) { .box { width: 100%; } }', message: 'Responsive!', explanation: 'Media queries require specific conditions like `max-width` or `min-width` followed by a pixel value.' },
  { id: 'c-h-5', track: 'css', difficulty: 'hard', timeLimit: 45, hint: 'CSS variable syntax.',
    brokenCode: ':root { primary: blue; } .btn { color: primary; }', expectedFix: ':root { --primary: blue; } .btn { color: var(--primary); }', message: 'Variable bound!', explanation: 'CSS variables must start with two dashes `--` and are accessed using the `var()` function.' },

  // ── JS EASY ──
  { id: 'j-e-1', track: 'js', difficulty: 'easy', timeLimit: 30, hint: 'console.log not print.',
    brokenCode: 'print("hi");', expectedFix: 'console.log("hi");',
    choices: ['console.log("hi");', 'print("hi");', 'echo("hi");', 'log("hi");'],
    message: 'Logged!', explanation: 'JavaScript uses `console.log()` to output to the browser\'s developer console.' },
  { id: 'j-e-2', track: 'js', difficulty: 'easy', timeLimit: 30, hint: 'Use let/const.',
    brokenCode: 'x = 5;', expectedFix: 'let x = 5;',
    choices: ['let x = 5;', 'x = 5;', 'variable x = 5;', 'dim x = 5;'],
    message: 'Declared!', explanation: 'Always declare variables with `let` or `const` to avoid accidentally creating global variables.' },
  { id: 'j-e-3', track: 'js', difficulty: 'easy', timeLimit: 30, hint: 'Strict equality.',
    brokenCode: 'if (a = 1) {}', expectedFix: 'if (a === 1) {}',
    choices: ['if (a === 1) {}', 'if (a = 1) {}', 'if (a == = 1) {}', 'if (a -> 1) {}'],
    message: 'Compared!', explanation: 'A single `=` assigns a value. Use `===` for strict equality comparison to avoid weird type-coercion bugs.' },
  { id: 'j-e-4', track: 'js', difficulty: 'easy', timeLimit: 30, hint: 'Function keyword.',
    brokenCode: 'func greet() {}', expectedFix: 'function greet() {}',
    choices: ['function greet() {}', 'func greet() {}', 'def greet() {}', 'fn greet() {}'],
    message: 'Function declared!', explanation: 'The correct keyword to declare a standard function in JS is `function`.' },
  { id: 'j-e-5', track: 'js', difficulty: 'easy', timeLimit: 30, hint: 'Array length property.',
    brokenCode: 'arr.size', expectedFix: 'arr.length',
    choices: ['arr.length', 'arr.size', 'arr.count', 'arr.len'],
    message: 'Measured!', explanation: 'Arrays in JavaScript use the `.length` property, unlike some other languages that use `.size`.' },

  // ── JS MEDIUM ──
  { id: 'j-m-1', track: 'js', difficulty: 'medium', timeLimit: 35, hint: 'Arrow function syntax.',
    brokenCode: 'const sq = x -> x * x;', expectedFix: 'const sq = x => x * x;',
    choices: ['const sq = x => x * x;', 'const sq = x -> x * x;', 'const sq = function(x) -> x * x;', 'const sq = (x) :: x * x;'],
    message: 'Arrow fired!', explanation: 'Arrow functions use the `=>` (fat arrow) syntax, not `->`.' },
  { id: 'j-m-2', track: 'js', difficulty: 'medium', timeLimit: 35, hint: 'Template literal backticks.',
    brokenCode: 'const s = "hi " + name;', expectedFix: 'const s = `hi ${name}`;',
    choices: ['const s = `hi ${name}`;', 'const s = "hi {name}";', 'const s = "hi " + {name};', 'const s = $"hi {name}";'],
    message: 'Interpolated!', explanation: 'Template literals use backticks ``` ` ``` and `${}` to embed variables directly inside strings.' },
  { id: 'j-m-3', track: 'js', difficulty: 'medium', timeLimit: 35, hint: 'Promise needs await or .then.',
    brokenCode: 'const data = fetch("/api");', expectedFix: 'const data = await fetch("/api");',
    choices: ['const data = await fetch("/api");', 'const data = fetch("/api");', 'const data = sync fetch("/api");', 'const data = fetch.wait("/api");'],
    message: 'Awaited!', explanation: '`fetch` returns a Promise. You must use `await` (inside an async function) to get the actual response.' },
  { id: 'j-m-4', track: 'js', difficulty: 'medium', timeLimit: 35, hint: 'map returns new array.',
    brokenCode: 'arr.foreach(x => x * 2);', expectedFix: 'arr.map(x => x * 2);',
    choices: ['arr.map(x => x * 2);', 'arr.foreach(x => x * 2);', 'arr.each(x => x * 2);', 'arr.iterate(x => x * 2);'],
    message: 'Mapped!', explanation: '`forEach` just loops. `map` creates and returns a brand new array with the transformed values.' },
  { id: 'j-m-5', track: 'js', difficulty: 'medium', timeLimit: 35, hint: 'Destructure object.',
    brokenCode: 'const name = user.name;', expectedFix: 'const { name } = user;',
    choices: ['const { name } = user;', 'const name = user.name;', 'const [name] = user;', 'const name <- user;'],
    message: 'Destructured!', explanation: 'Object destructuring `{ name }` extracts properties cleanly without repeating the object name.' },

  // ── JS HARD ──
  { id: 'j-h-1', track: 'js', difficulty: 'hard', timeLimit: 45, hint: 'Add await.',
    brokenCode: 'async function f() { return fetch("/x").json(); }', expectedFix: 'async function f() { return (await fetch("/x")).json(); }', message: 'Async fixed!', explanation: 'You must `await` the fetch promise before you can call `.json()` on the response object.' },
  { id: 'j-h-2', track: 'js', difficulty: 'hard', timeLimit: 45, hint: 'querySelector returns one node.',
    brokenCode: 'document.getElement(".btn")', expectedFix: 'document.querySelector(".btn")', message: 'Selected!', explanation: '`getElement` doesn\'t exist. Use `querySelector` for CSS selectors or `getElementById` for IDs.' },
  { id: 'j-h-3', track: 'js', difficulty: 'hard', timeLimit: 45, hint: 'Spread to copy array.',
    brokenCode: 'const copy = arr;', expectedFix: 'const copy = [...arr];', message: 'Spread!', explanation: 'Assigning an array just copies the reference. Use the spread operator `[...]` to create a shallow clone.' },
  { id: 'j-h-4', track: 'js', difficulty: 'hard', timeLimit: 45, hint: 'Filter returns matches.',
    brokenCode: 'const evens = arr.where(n % 2 === 0);', expectedFix: 'const evens = arr.filter(n => n % 2 === 0);', message: 'Filtered!', explanation: 'JavaScript arrays use `.filter()` to create a new array with elements that pass a test.' },
  { id: 'j-h-5', track: 'js', difficulty: 'hard', timeLimit: 45, hint: 'addEventListener with callback.',
    brokenCode: 'btn.click = handle;', expectedFix: 'btn.addEventListener("click", handle);', message: 'Listener bound!', explanation: 'Assigning to `.onclick` overwrites existing listeners. `addEventListener` is safer and allows multiple listeners.' },
// ════════════════════════════════════════════════════════════════
  // 🐍 PYTHON TRACK
  // ════════════════════════════════════════════════════════════════
  // ── PYTHON EASY ──
  { id: 'py-e-1', track: 'python', difficulty: 'easy', timeLimit: 30, hint: 'Python 3 requires parentheses for print.',
    brokenCode: 'print "Hello World"', expectedFix: 'print("Hello World")',
    choices: ['print("Hello World")', 'print "Hello World"', 'console.log("Hello World")', 'echo("Hello World")'],
    message: 'Printed!', explanation: 'In Python 3, `print` is a function, so it requires parentheses around its arguments.' },
  { id: 'py-e-2', track: 'python', difficulty: 'easy', timeLimit: 30, hint: 'Python uses len() for length.',
    brokenCode: 'my_list.length', expectedFix: 'len(my_list)',
    choices: ['len(my_list)', 'my_list.length', 'my_list.size()', 'length(my_list)'],
    message: 'Measured!', explanation: 'Unlike JS or Java, Python uses the built-in `len()` function instead of a `.length` property.' },
  { id: 'py-e-3', track: 'python', difficulty: 'easy', timeLimit: 30, hint: 'Python uses def for functions.',
    brokenCode: 'function add(a, b): return a + b', expectedFix: 'def add(a, b):\n    return a + b',
    choices: ['def add(a, b):\n    return a + b', 'function add(a, b):\n    return a + b', 'def add(a, b) { return a + b }', 'func add(a, b): return a + b'],
    message: 'Defined!', explanation: 'Python uses the `def` keyword to define functions, followed by a colon and indented code.' },

  // ── PYTHON MEDIUM ──
  { id: 'py-m-1', track: 'python', difficulty: 'medium', timeLimit: 35, hint: 'List comprehension syntax.',
    brokenCode: 'squares = [x * x for x in range(5)]', expectedFix: 'squares = [x**2 for x in range(5)]',
    choices: ['squares = [x**2 for x in range(5)]', 'squares = [x * x for x in range(5)]', 'squares = map(x => x*x, range(5))', 'squares = [Math.pow(x, 2) for x in range(5)]'],
    message: 'Comprehended!', explanation: 'While `x * x` works, the idiomatic Python way to write exponents is the `**` operator (e.g., `x**2`).' },
  { id: 'py-m-2', track: 'python', difficulty: 'medium', timeLimit: 35, hint: 'Dictionary key access.',
    brokenCode: 'user = {"name": "Alice"}\nprint(user.name)', expectedFix: 'user = {"name": "Alice"}\nprint(user["name"])',
    choices: ['user = {"name": "Alice"}\nprint(user["name"])', 'user = {"name": "Alice"}\nprint(user.name)', 'user = {"name": "Alice"}\nprint(user->name)', 'user = {"name": "Alice"}\nprint(user(name))'],
    message: 'Accessed!', explanation: 'Python dictionaries use bracket notation `["key"]` to access values, unlike JS objects which can use dot notation.' },

  // ── PYTHON HARD ──
  { id: 'py-h-1', track: 'python', difficulty: 'hard', timeLimit: 45, hint: 'Generators use yield.',
    brokenCode: 'def count():\n    for i in range(3):\n        return i', expectedFix: 'def count():\n    for i in range(3):\n        yield i',
    message: 'Generated!', explanation: 'Using `return` stops the function completely. `yield` pauses it, returning a value and resuming on the next call, creating a generator.' },

  // ════════════════════════════════════════════════════════════════
  // ☕ JAVA TRACK
  // ════════════════════════════════════════════════════════════════
  // ── JAVA EASY ──
  { id: 'jv-e-1', track: 'java', difficulty: 'easy', timeLimit: 30, hint: 'Standard output in Java.',
    brokenCode: 'console.log("Hello");', expectedFix: 'System.out.println("Hello");',
    choices: ['System.out.println("Hello");', 'console.log("Hello");', 'print("Hello");', 'System.print("Hello");'],
    message: 'Printed!', explanation: 'Java uses `System.out.println()` to print to the console, not `console.log()`.' },
  { id: 'jv-e-2', track: 'java', difficulty: 'easy', timeLimit: 30, hint: 'String comparison in Java.',
    brokenCode: 'if (str1 == str2) {}', expectedFix: 'if (str1.equals(str2)) {}',
    choices: ['if (str1.equals(str2)) {}', 'if (str1 == str2) {}', 'if (str1 === str2) {}', 'if (equals(str1, str2)) {}'],
    message: 'Compared!', explanation: 'In Java, `==` compares object references (memory addresses). You must use `.equals()` to compare the actual text inside Strings.' },

  // ── JAVA MEDIUM ──
  { id: 'jv-m-1', track: 'java', difficulty: 'medium', timeLimit: 35, hint: 'ArrayList initialization.',
    brokenCode: 'List<String> list = new List<>();', expectedFix: 'List<String> list = new ArrayList<>();',
    choices: ['List<String> list = new ArrayList<>();', 'List<String> list = new List<>();', 'ArrayList<String> list = new List<String>();', 'var list = new List();'],
    message: 'Instantiated!', explanation: '`List` is an interface in Java, so you cannot instantiate it directly with `new`. You must use a concrete class like `ArrayList`.' },

  // ════════════════════════════════════════════════════════════════
  // 🧠 COMPUTER SCIENCE (CS) TRACK
  // ════════════════════════════════════════════════════════════════
  // ── CS EASY ──
  { id: 'cs-e-1', track: 'cs', difficulty: 'easy', timeLimit: 30, hint: 'First In, First Out.',
    brokenCode: 'Scenario: A line at a grocery store. Which data structure mimics this?', expectedFix: 'Queue',
    choices: ['Queue', 'Stack', 'Array', 'Tree'],
    message: 'Queued!', explanation: 'A Queue follows FIFO (First-In-First-Out) order, exactly like a line of people waiting.' },
  { id: 'cs-e-2', track: 'cs', difficulty: 'easy', timeLimit: 30, hint: 'Binary basics.',
    brokenCode: 'What is the decimal value of the binary number 101?', expectedFix: '5',
    choices: ['5', '3', '10', '101'],
    message: 'Converted!', explanation: 'In binary (base 2), 101 means (1 * 4) + (0 * 2) + (1 * 1) = 5.' },

  // ── CS MEDIUM ──
  { id: 'cs-m-1', track: 'cs', difficulty: 'medium', timeLimit: 35, hint: 'Searching algorithms.',
    brokenCode: 'What is the absolute requirement for using Binary Search?', expectedFix: 'The array must be sorted',
    choices: ['The array must be sorted', 'The array must contain integers', 'The array must have an even length', 'The array must be small'],
    message: 'Searched!', explanation: 'Binary search works by repeatedly dividing the search interval in half. This is only possible if the data is sorted beforehand.' },
  { id: 'cs-m-2', track: 'cs', difficulty: 'medium', timeLimit: 35, hint: 'Big O Notation.',
    brokenCode: 'What is the time complexity of accessing an element in a Hash Table (Dictionary) by its key?', expectedFix: 'O(1)',
    choices: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'],
    message: 'Optimized!', explanation: 'Hash tables use a hashing function to compute the exact memory location of a value, resulting in O(1) or "constant time" average access.' },

  // ════════════════════════════════════════════════════════════════
  // 🌐 NETWORKING TRACK
  // ════════════════════════════════════════════════════════════════
  // ── NET EASY ──
  { id: 'net-e-1', track: 'networking', difficulty: 'easy', timeLimit: 30, hint: 'Web protocols.',
    brokenCode: 'Which protocol securely encrypts data sent between a browser and a server?', expectedFix: 'HTTPS',
    choices: ['HTTPS', 'HTTP', 'FTP', 'SMTP'],
    message: 'Secured!', explanation: 'HTTPS (Hypertext Transfer Protocol Secure) uses TLS/SSL to encrypt data, protecting it from eavesdroppers.' },
  { id: 'net-e-2', track: 'networking', difficulty: 'easy', timeLimit: 30, hint: 'The phonebook of the internet.',
    brokenCode: 'What system translates human-readable domain names (like google.com) into IP addresses?', expectedFix: 'DNS',
    choices: ['DNS', 'DHCP', 'HTTP', 'TCP'],
    message: 'Resolved!', explanation: 'DNS (Domain Name System) acts like a phonebook, mapping domain names to the numerical IP addresses computers use to route traffic.' },

  // ── NET MEDIUM ──
  { id: 'net-m-1', track: 'networking', difficulty: 'medium', timeLimit: 35, hint: 'Reliable vs Fast transport.',
    brokenCode: 'You are building a live video streaming app. Which transport protocol is best to minimize lag, even if a few frames drop?', expectedFix: 'UDP',
    choices: ['UDP', 'TCP', 'HTTP', 'FTP'],
    message: 'Streamed!', explanation: 'UDP (User Datagram Protocol) is connectionless and doesn\'t guarantee delivery, making it much faster and ideal for real-time video/audio where a dropped frame isn\'t a disaster.' },
  { id: 'net-m-2', track: 'networking', difficulty: 'medium', timeLimit: 35, hint: 'HTTP Status Codes.',
    brokenCode: 'Your frontend requests a user profile, but the server returns a 404 status code. What does this mean?', expectedFix: 'Not Found',
    choices: ['Not Found', 'Server Error', 'Unauthorized', 'Success'],
    message: 'Handled!', explanation: '404 means "Not Found". The server is reachable, but the specific resource (like a user ID that doesn\'t exist) could not be located.' },
];

export function pickPuzzles(track: Track, difficulty: Difficulty, count: number): Puzzle[] {
  const pool = PUZZLES.filter(p => (track === 'all' || p.track === track) && p.difficulty === difficulty);
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  const out: Puzzle[] = [];
  while (out.length < count) out.push(...shuffled);
  return out.slice(0, count);
}

export function normalize(s: string): string {
  // Slightly updated to handle plain text answers (like "Queue" or "DNS") better while still stripping code whitespace
  return s.replace(/\s+/g, ' ').replace(/\s*([<>{}();,:])\s*/g, '$1').trim().toLowerCase();
}
