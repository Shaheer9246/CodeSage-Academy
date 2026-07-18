export type LessonLevel = 'basic' | 'intermediate' | 'expert';

export interface Lesson {
  id: string;
  title: string;
  topic: string;
  level: LessonLevel;
  content: string;
  initialCode: string;
  initialCss?: string;
  initialJs?: string;
  initialJsx?: string;
  notice?: string;
  language: 'html' | 'css' | 'javascript' | 'typescript';
  challenge?: {
    instruction: string;
    initialCode: string;
    initialCss?: string;
    initialJs?: string;
    initialJsx?: string;
    validationKeywords: string[];
  };
}

export interface Topic {
  id: string;
  name: string;
  icon: string;
  lessons: Lesson[];
}

export interface LevelData {
  level: LessonLevel;
  label: string;
  topics: Topic[];
}

const basicLessons: LevelData = {
  level: 'basic',
  label: 'Basic',
  topics: [
{
      id: 'ai-basics',
      name: 'AI Fundamentals',
      icon: '🤖',
      lessons: [
       
        {
          id: 'html-1',
          title: 'What is HTML?',
          topic: 'HTML Fundamentals',
          level: 'basic',
          content: `# What is HTML?

Welcome to your very first lesson! 🎉 Let's start from the absolute beginning.

## Think of it Like Building a House 🏠

Imagine you're building a house:

- **HTML** is the **structure** — the walls, rooms, doors, and windows
- **CSS** is the **decoration** — the paint, furniture, curtains
- **JavaScript** is the **electricity** — making things work, lights turning on, doors opening

**HTML** stands for HyperText Markup Language. Don't let the fancy name scare you! It's simply a way to tell the browser: "Hey, this is a heading, this is a paragraph, this is an image."

## How HTML Works

HTML uses **tags** — special words wrapped in angle brackets \`< >\`. Most tags come in pairs:

\`\`\`html
<h1>This is a heading</h1>
<p>This is a paragraph</p>
\`\`\`

The first tag \`<h1>\` **opens** and the second \`</h1>\` **closes**. Everything between them is the content.

## The Basic Structure

Every web page needs this skeleton:

\`\`\`html
<!DOCTYPE html>
<html>
  <head>
    <title>Page Title</title>
  </head>
  <body>
    <!-- Your content goes here -->
  </body>
</html>
\`\`\`

- \`<!DOCTYPE html>\` tells the browser "this is an HTML page"
- \`<html>\` wraps everything
- \`<head>\` has invisible info (like the page title)
- \`<body>\` has everything you can **see** on the page

Try editing the code on the right! Change the text inside the \`<h1>\` tag and watch the preview update instantly! ✨`,
          initialCode: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>My First Page</title>
</head>
<body>
  <h1>Hello World!</h1>
  <!-- Try adding an h1 and a p tag -->
</body>
</html>`,
          initialCss: `/* CSS is automatically applied for you!
   Don't worry about this file yet.
   You'll learn CSS in later lessons. */

body {
  font-family: Arial, sans-serif;
  padding: 20px;
  background-color: #1a1a2e;
  color: #e0e0e0;
}

h1 {
  color: #e94560;
}

p {
  color: #ccc;
  font-size: 18px;
  line-height: 1.6;
}`,
          initialJs: `// JavaScript will be covered later!
// For now, this file is empty.`,
          language: 'html',
          challenge: {
            instruction: 'Add a heading that says "Welcome" and a paragraph that says "I am learning HTML!" inside the body.',
            initialCode: `<!DOCTYPE html>
<html>
<head>
  <title>My Challenge</title>
</head>
<body>
  <!-- Add an <h1> with "Welcome" -->
  <!-- Add a <p> with "I am learning HTML!" -->
</body>
</html>`,
            validationKeywords: ['<h1>', 'welcome', '<p>', 'i am learning html'],
          },
        },
        {
          id: 'html-2',
          title: 'Headings & Text',
          topic: 'HTML Fundamentals',
          level: 'basic',
          content: `# Headings & Text

Now that you know what HTML is, let's learn about the most basic building blocks: **headings** and **text**! 📝

## Headings — Like Chapter Titles

HTML has 6 heading levels. Think of them like a book:
- \`<h1>\` = Book title (biggest, most important — use only ONE per page)
- \`<h2>\` = Chapter title
- \`<h3>\` = Section title
- \`<h4>\` to \`<h6>\` = Smaller sub-sections

\`\`\`html
<h1>My Website</h1>
<h2>About Me</h2>
<h3>My Hobbies</h3>
\`\`\`

## Paragraphs — Your Main Text

Use \`<p>\` for paragraphs. Each \`<p>\` starts on a new line:

\`\`\`html
<p>This is the first paragraph.</p>
<p>This is the second paragraph.</p>
\`\`\`

## Making Text Special

- \`<strong>\` makes text **bold** (important text)
- \`<em>\` makes text *italic* (emphasized text)
- \`<br>\` creates a line break (no closing tag needed!)

\`\`\`html
<p>This is <strong>very important</strong> and this is <em>emphasized</em>.</p>
\`\`\`

Try creating headings of different sizes in the editor!`,
          initialCode: `<!DOCTYPE html>
<html>
<head><title>Headings</title></head>
<body>
  <h1>Main Title</h1>
  <h2>Subtitle</h2>
  <p>This is a <strong>bold</strong> and <em>italic</em> paragraph.</p>
  <h3>Section</h3>
  <p>Another paragraph with a<br>line break.</p>
</body>
</html>`,
          initialCss: `body {
  font-family: Arial, sans-serif;
  padding: 20px;
  background: #1a1a2e;
  color: #e0e0e0;
}
h1 { color: #e94560; }
h2 { color: #0f3460; }
h3 { color: #16c79a; }
p { line-height: 1.6; color: #ccc; }`,
          language: 'html',
          challenge: {
            instruction: 'Create a page with an h1 saying "My Blog", an h2 saying "First Post", and a paragraph with some bold text using <strong>.',
            initialCode: `<!DOCTYPE html>
<html>
<body>
  <!-- Create headings and a paragraph with bold text -->
</body>
</html>`,
            validationKeywords: ['<h1>', 'my blog', '<h2>', 'first post', '<strong>'],
          },
        },
        {
          id: 'html-3',
          title: 'Links & Navigation',
          topic: 'HTML Fundamentals',
          level: 'basic',
          content: `# Links & Navigation 🔗

Links are what make the web a "web"! They connect pages together. Let's learn how to create them.

## The Anchor Tag

Links use the \`<a>\` tag (short for "anchor"):

\`\`\`html
<a href="https://google.com">Go to Google</a>
\`\`\`

- \`href\` is the **address** (where the link goes)
- The text between tags is what people **click on**

## Open in New Tab

Add \`target="_blank"\` to open in a new tab:

\`\`\`html
<a href="https://google.com" target="_blank">Google (new tab)</a>
\`\`\`

## Navigation Menus

Use \`<nav>\` to group navigation links:

\`\`\`html
<nav>
  <a href="/">Home</a>
  <a href="/about">About</a>
  <a href="/contact">Contact</a>
</nav>
\`\`\`

## Email & Phone Links

\`\`\`html
<a href="mailto:hello@example.com">Email Us</a>
<a href="tel:+1234567890">Call Us</a>
\`\`\`

Try adding your own links in the editor!`,
          initialCode: `<!DOCTYPE html>
<html>
<body>
  <nav>
    <a href="/">Home</a> |
    <a href="/about">About</a> |
    <a href="/contact">Contact</a>
  </nav>
  <h1>Welcome!</h1>
  <p>Visit <a href="https://example.com" target="_blank">Example.com</a></p>
  <p><a href="mailto:hello@example.com">Send an email</a></p>
</body>
</html>`,
          initialCss: `body { font-family: Arial; padding: 20px; background: #1a1a2e; color: #e0e0e0; }
nav { background: #16213e; padding: 12px; border-radius: 8px; margin-bottom: 20px; }
nav a { color: #e94560; margin: 0 10px; text-decoration: none; }
nav a:hover { text-decoration: underline; }
a { color: #4fc3f7; }`,
          language: 'html',
          challenge: {
            instruction: 'Create a navigation with 3 links: Home, About, and Contact. Then add a paragraph with a link to any website.',
            initialCode: `<!DOCTYPE html>
<html>
<body>
  <!-- Create a <nav> with 3 links -->
  <!-- Add a paragraph with a link -->
</body>
</html>`,
            validationKeywords: ['<nav>', '<a', 'href', 'home', 'about', 'contact'],
          },
        },
        {
          id: 'html-4',
          title: 'Images & Media',
          topic: 'HTML Fundamentals',
          level: 'basic',
          content: `# Images & Media 🖼️

Let's make your pages more visual by adding images!

## The Image Tag

Images use \`<img>\` — a **self-closing** tag (no \`</img>\` needed):

\`\`\`html
<img src="photo.jpg" alt="A cute cat" width="300">
\`\`\`

## Important Attributes

- \`src\` — the image address (URL or file path)
- \`alt\` — description of the image (VERY important for accessibility!)
- \`width\` / \`height\` — size in pixels

## Using Online Images

You can use any image URL:

\`\`\`html
<img src="https://picsum.photos/400/300" alt="Random photo">
\`\`\`

## Why \`alt\` Matters

- Screen readers read \`alt\` text for blind users
- Shows when image fails to load
- Helps search engines understand your page

Always add meaningful \`alt\` text! Instead of \`alt="image"\`, write \`alt="Golden retriever playing in the park"\`.`,
          initialCode: `<!DOCTYPE html>
<html>
<body>
  <h1>My Gallery</h1>
  <img src="https://picsum.photos/300/200" alt="Random photo" width="300">
  <p>A beautiful random image from the web.</p>
  <img src="https://picsum.photos/300/200?random=2" alt="Another random photo" width="300">
</body>
</html>`,
          initialCss: `body { font-family: Arial; padding: 20px; background: #1a1a2e; color: #e0e0e0; text-align: center; }
h1 { color: #e94560; }
img { border-radius: 12px; margin: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.3); }
p { color: #ccc; }`,
          language: 'html',
          challenge: {
            instruction: 'Add an image using <img> with a src attribute pointing to any URL and an alt attribute describing the image.',
            initialCode: `<!DOCTYPE html>
<html>
<body>
  <h1>My Photo</h1>
  <!-- Add an <img> tag with src and alt attributes -->
</body>
</html>`,
            validationKeywords: ['<img', 'src=', 'alt='],
          },
        },
        {
          id: 'html-5',
          title: 'Lists',
          topic: 'HTML Fundamentals',
          level: 'basic',
          content: `# Lists 📋

Lists help organize information. HTML has two main types.

## Unordered List (Bullet Points)

Use \`<ul>\` with \`<li>\` items:

\`\`\`html
<ul>
  <li>Apples</li>
  <li>Bananas</li>
  <li>Oranges</li>
</ul>
\`\`\`

## Ordered List (Numbered)

Use \`<ol>\` with \`<li>\` items:

\`\`\`html
<ol>
  <li>Wake up</li>
  <li>Brush teeth</li>
  <li>Eat breakfast</li>
</ol>
\`\`\`

## Nested Lists

You can put lists inside lists!

\`\`\`html
<ul>
  <li>Fruits
    <ul>
      <li>Apple</li>
      <li>Banana</li>
    </ul>
  </li>
</ul>
\`\`\`

Try creating your own shopping list or recipe steps!`,
          initialCode: `<!DOCTYPE html>
<html>
<body>
  <h1>Shopping List</h1>
  <ul>
    <li>Apples</li>
    <li>Bread</li>
    <li>Milk</li>
  </ul>
  <h2>Steps to Make Tea</h2>
  <ol>
    <li>Boil water</li>
    <li>Add tea bag</li>
    <li>Wait 3 minutes</li>
    <li>Enjoy!</li>
  </ol>
</body>
</html>`,
          initialCss: `body { font-family: Arial; padding: 20px; background: #1a1a2e; color: #e0e0e0; }
h1, h2 { color: #e94560; }
ul, ol { padding-left: 25px; }
li { margin: 8px 0; color: #ccc; }`,
          language: 'html',
          challenge: {
            instruction: 'Create an unordered list with at least 3 items and an ordered list with at least 3 steps.',
            initialCode: `<!DOCTYPE html>
<html>
<body>
  <h1>My Lists</h1>
  <!-- Create a <ul> with 3+ items -->
  <!-- Create an <ol> with 3+ items -->
</body>
</html>`,
            validationKeywords: ['<ul>', '<ol>', '<li>'],
          },
        },
        {
          id: 'html-6',
          title: 'Tables',
          topic: 'HTML Fundamentals',
          level: 'basic',
          content: `# Tables 📊

Tables organize data into rows and columns — like a spreadsheet!

## Basic Table Structure

\`\`\`html
<table>
  <tr>
    <th>Name</th>
    <th>Age</th>
  </tr>
  <tr>
    <td>Alice</td>
    <td>25</td>
  </tr>
</table>
\`\`\`

## Table Tags

- \`<table>\` — the whole table
- \`<tr>\` — a table **row**
- \`<th>\` — a **header** cell (bold, centered)
- \`<td>\` — a **data** cell

Think of it like this:
- \`<tr>\` = a new row (going across →)
- \`<td>\` or \`<th>\` = a cell in that row

Try adding more rows and columns!`,
          initialCode: `<!DOCTYPE html>
<html>
<body>
  <h1>Student Grades</h1>
  <table border="1">
    <tr>
      <th>Name</th>
      <th>Subject</th>
      <th>Grade</th>
    </tr>
    <tr>
      <td>Alice</td>
      <td>Math</td>
      <td>A</td>
    </tr>
    <tr>
      <td>Bob</td>
      <td>Science</td>
      <td>B+</td>
    </tr>
  </table>
</body>
</html>`,
          initialCss: `body { font-family: Arial; padding: 20px; background: #1a1a2e; color: #e0e0e0; }
h1 { color: #e94560; }
table { border-collapse: collapse; width: 100%; max-width: 500px; }
th, td { padding: 12px; text-align: left; border: 1px solid #333; }
th { background: #16213e; color: #e94560; }
tr:nth-child(even) { background: #1e2a3a; }`,
          language: 'html',
          challenge: {
            instruction: 'Create a table with 3 columns (Product, Price, Quantity) and at least 2 rows of data.',
            initialCode: `<!DOCTYPE html>
<html>
<body>
  <h1>Price List</h1>
  <!-- Create a table with th and td -->
</body>
</html>`,
            validationKeywords: ['<table', '<tr>', '<th>', '<td>'],
          },
        },
        {
          id: 'html-7',
          title: 'Forms & Input',
          topic: 'HTML Fundamentals',
          level: 'basic',
          content: `# Forms & Input 📝

Forms let users type information and send it. Think of signup pages, search bars, contact forms.

## Basic Form

\`\`\`html
<form>
  <label for="name">Name:</label>
  <input type="text" id="name">
  <button type="submit">Submit</button>
</form>
\`\`\`

## Input Types

- \`type="text"\` — regular text
- \`type="email"\` — email address
- \`type="password"\` — hidden text
- \`type="number"\` — numbers only
- \`type="checkbox"\` — a checkbox
- \`type="radio"\` — pick one from a group

## Labels Are Important!

Always pair inputs with \`<label>\`. The \`for\` attribute connects them:

\`\`\`html
<label for="email">Email:</label>
<input type="email" id="email" placeholder="you@example.com">
\`\`\`

## Textarea for Long Text

\`\`\`html
<textarea rows="4" cols="30">Write here...</textarea>
\`\`\``,
          initialCode: `<!DOCTYPE html>
<html>
<body>
  <h1>Contact Form</h1>
  <form>
    <label for="name">Name:</label><br>
    <input type="text" id="name" placeholder="Your name"><br><br>
    <label for="email">Email:</label><br>
    <input type="email" id="email" placeholder="you@example.com"><br><br>
    <label for="msg">Message:</label><br>
    <textarea id="msg" rows="4" cols="30"></textarea><br><br>
    <button type="submit">Send</button>
  </form>
</body>
</html>`,
          initialCss: `body { font-family: Arial; padding: 20px; background: #1a1a2e; color: #e0e0e0; }
h1 { color: #e94560; }
input, textarea { padding: 10px; border-radius: 6px; border: 1px solid #333; background: #16213e; color: #e0e0e0; width: 100%; max-width: 300px; margin: 4px 0; }
button { background: #e94560; color: white; border: none; padding: 10px 24px; border-radius: 6px; cursor: pointer; margin-top: 8px; }
button:hover { background: #c0392b; }
label { color: #ccc; }`,
          language: 'html',
          challenge: {
            instruction: 'Create a form with a text input for name, an email input, and a submit button.',
            initialCode: `<!DOCTYPE html>
<html>
<body>
  <h1>Sign Up</h1>
  <!-- Create a form with inputs and a button -->
</body>
</html>`,
            validationKeywords: ['<form', '<input', 'type=', '<button'],
          },
        },
        {
          id: 'html-8',
          title: 'Semantic HTML',
          topic: 'HTML Fundamentals',
          level: 'basic',
          content: `# Semantic HTML 🏗️

Semantic tags describe what the content **means**, not just how it looks.

## Why Semantic HTML?

Instead of using \`<div>\` for everything, use tags that describe the content:

- \`<header>\` — top of the page (logo, nav)
- \`<nav>\` — navigation links
- \`<main>\` — the main content
- \`<article>\` — independent content (blog post, news article)
- \`<section>\` — a group of related content
- \`<footer>\` — bottom of the page
- \`<aside>\` — sidebar content

## Why Does This Matter?

1. **Screen readers** understand your page better (accessibility!)
2. **Search engines** can find your content easier (SEO!)
3. **Other developers** can read your code more easily

## Bad vs Good

❌ Bad:
\`\`\`html
<div class="header"><div class="nav">...</div></div>
\`\`\`

✅ Good:
\`\`\`html
<header><nav>...</nav></header>
\`\`\`

Same result visually, but the good version has **meaning**.`,
          initialCode: `<!DOCTYPE html>
<html>
<body>
  <header>
    <h1>My Website</h1>
    <nav>
      <a href="/">Home</a> | <a href="/blog">Blog</a>
    </nav>
  </header>
  <main>
    <article>
      <h2>First Article</h2>
      <p>This is the main content.</p>
    </article>
    <aside>
      <h3>Related Links</h3>
      <p>Some sidebar content.</p>
    </aside>
  </main>
  <footer>
    <p>&copy; 2026 My Website</p>
  </footer>
</body>
</html>`,
          initialCss: `body { font-family: Arial; margin: 0; background: #1a1a2e; color: #e0e0e0; }
header { background: #16213e; padding: 20px; }
header h1 { color: #e94560; margin: 0; }
nav { margin-top: 10px; }
nav a { color: #4fc3f7; margin-right: 15px; text-decoration: none; }
main { padding: 20px; display: flex; gap: 20px; }
article { flex: 2; }
aside { flex: 1; background: #16213e; padding: 15px; border-radius: 8px; }
footer { background: #16213e; padding: 15px; text-align: center; margin-top: 20px; }
h2 { color: #e94560; }
h3 { color: #16c79a; }`,
          language: 'html',
          challenge: {
            instruction: 'Create a page with <header>, <main>, and <footer> tags. The header should have an h1 and the footer should have a paragraph.',
            initialCode: `<!DOCTYPE html>
<html>
<body>
  <!-- Use semantic tags: header, main, footer -->
</body>
</html>`,
            validationKeywords: ['<header>', '<main>', '<footer>', '<h1>'],
          },
        },
        {
          id: 'html-9',
          title: 'Audio & Video',
          topic: 'HTML Fundamentals',
          level: 'basic',
          content: `# Audio & Video in HTML 🎬

Want to add videos or music to your website? HTML makes it easy!

## Adding a Video

Use the \`<video>\` tag:

\`\`\`html
<video width="400" controls>
  <source src="movie.mp4" type="video/mp4">
  Your browser doesn't support video.
</video>
\`\`\`

## Video Attributes

- \`controls\` — shows play, pause, volume buttons
- \`autoplay\` — starts playing automatically
- \`loop\` — repeats the video
- \`muted\` — starts muted (needed for autoplay in most browsers)
- \`poster\` — shows an image before video plays

## Adding Audio

Use the \`<audio>\` tag:

\`\`\`html
<audio controls>
  <source src="song.mp3" type="audio/mpeg">
  Your browser doesn't support audio.
</audio>
\`\`\`

## Embedding YouTube Videos

Use \`<iframe>\` for YouTube:

\`\`\`html
<iframe width="560" height="315"
  src="https://www.youtube.com/embed/VIDEO_ID"
  allowfullscreen>
</iframe>
\`\`\`

Replace \`VIDEO_ID\` with the actual YouTube video ID (the part after \`v=\` in the URL).`,
          initialCode: `<!DOCTYPE html>
<html>
<body>
  <h1>Media Gallery</h1>
  
  <h2>Video</h2>
  <video width="400" controls poster="https://picsum.photos/400/225">
    <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4">
    Your browser doesn't support video.
  </video>
  
  <h2>Audio</h2>
  <audio controls>
    <source src="https://www.w3schools.com/html/horse.ogg" type="audio/ogg">
    Your browser doesn't support audio.
  </audio>
  
  <h2>YouTube Embed</h2>
  <iframe width="400" height="225"
    src="https://www.youtube.com/embed/dQw4w9WgXcQ"
    allowfullscreen>
  </iframe>
</body>
</html>`,
          initialCss: `body { font-family: Arial; padding: 20px; background: #1a1a2e; color: #e0e0e0; }
h1 { color: #e94560; }
h2 { color: #16c79a; margin-top: 20px; }
video, iframe { border-radius: 12px; margin: 10px 0; }`,
          language: 'html',
          challenge: {
            instruction: 'Add a video with controls and an audio element with controls to your page.',
            initialCode: `<!DOCTYPE html>
<html>
<body>
  <h1>My Media Page</h1>
  <!-- Add a <video> tag with controls -->
  <!-- Add an <audio> tag with controls -->
</body>
</html>`,
            validationKeywords: ['<video', 'controls', '<audio'],
          },
        },
        {
          id: 'html-10',
          title: 'Div & Span',
          topic: 'HTML Fundamentals',
          level: 'basic',
          content: `# Div & Span — Container Tags 📦

These are the most common tags for grouping content.

## The \`<div>\` Tag

\`<div>\` is a **block** container — it takes up the full width:

\`\`\`html
<div class="box">
  <h2>Title</h2>
  <p>Content inside a div</p>
</div>
\`\`\`

Think of \`<div>\` as a box that holds things together.

## The \`<span>\` Tag

\`<span>\` is an **inline** container — it stays in the same line:

\`\`\`html
<p>My favorite color is <span style="color: red;">red</span>!</p>
\`\`\`

## When to Use What?

- \`<div>\` for grouping sections (cards, containers, layouts)
- \`<span>\` for styling small parts of text
- Use semantic tags (\`<header>\`, \`<nav>\`, etc.) when possible instead of \`<div>\`

## Classes & IDs

- \`class\` — can be reused on many elements
- \`id\` — must be unique on the page

\`\`\`html
<div class="card">Card 1</div>
<div class="card">Card 2</div>
<div id="special">Unique element</div>
\`\`\``,
          initialCode: `<!DOCTYPE html>
<html>
<body>
  <div class="card">
    <h2>Card 1</h2>
    <p>This is inside a <span class="highlight">div container</span>.</p>
  </div>
  <div class="card">
    <h2>Card 2</h2>
    <p>Another card with <span class="highlight">highlighted</span> text.</p>
  </div>
</body>
</html>`,
          initialCss: `body { font-family: Arial; padding: 20px; background: #1a1a2e; color: #e0e0e0; }
.card { background: #16213e; padding: 20px; border-radius: 12px; margin: 10px 0; border: 1px solid #333; }
h2 { color: #e94560; margin-top: 0; }
.highlight { color: #f39c12; font-weight: bold; }`,
          language: 'html',
          challenge: {
            instruction: 'Create two div elements with class="box" and use a span inside a paragraph to highlight a word.',
            initialCode: `<!DOCTYPE html>
<html>
<body>
  <!-- Create 2 divs with class="box" -->
  <!-- Use <span> inside a paragraph -->
</body>
</html>`,
            validationKeywords: ['<div', 'class="box"', '<span'],
          },
        },
      ],
    },
    {
      id: 'css-basics',
      name: 'CSS Fundamentals',
      icon: '🎨',
      lessons: [
        {
          id: 'css-1',
          title: 'What is CSS?',
          topic: 'CSS Fundamentals',
          level: 'basic',
          content: `# What is CSS? 🎨

CSS (Cascading Style Sheets) is how you make web pages **beautiful**! If HTML is the skeleton, CSS is the skin, clothes, and makeup.

## Three Ways to Add CSS

**1. Inline** (directly on elements):
\`\`\`html
<p style="color: red;">Red text</p>
\`\`\`

**2. Internal** (\`<style>\` tag inside \`<head>\`):
\`\`\`html
<style>
  p { color: red; }
</style>
\`\`\`

**3. External** (separate .css file — BEST practice!):
\`\`\`html
<link rel="stylesheet" href="style.css">
\`\`\`

In our editor, the **style.css** tab is your external CSS file!

## CSS Syntax

\`\`\`css
selector {
  property: value;
}
\`\`\`

Example:
\`\`\`css
h1 {
  color: blue;
  font-size: 24px;
}
\`\`\`

This says: "Find all \`<h1>\` tags, make them blue, and 24 pixels big."

Try editing the CSS tab to change colors and sizes!`,
          initialCode: `<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <h1>Styled Page</h1>
  <p>This page uses CSS for styling!</p>
  <p class="highlight">This text is highlighted.</p>
</body>
</html>`,
          initialCss: `body {
  font-family: Arial, sans-serif;
  padding: 20px;
  background-color: #1a1a2e;
  color: #e0e0e0;
}

h1 {
  color: #e94560;
  text-align: center;
  font-size: 36px;
}

p {
  color: #ccc;
  font-size: 18px;
  line-height: 1.6;
}

.highlight {
  background-color: #16213e;
  padding: 10px;
  border-radius: 8px;
  border-left: 4px solid #e94560;
}`,
          language: 'html',
          challenge: {
            instruction: 'In the CSS tab, change the h1 color to any color you like and set the body background-color to a dark color.',
            initialCode: `<!DOCTYPE html>
<html>
<head><link rel="stylesheet" href="style.css"></head>
<body>
  <h1>Style Me!</h1>
  <p>Change the CSS to make me look different.</p>
</body>
</html>`,
            initialCss: `/* Change the h1 color and body background-color */
h1 {

}

body {

}`,
            validationKeywords: ['color:', 'background'],
          },
        },
        {
          id: 'css-2',
          title: 'Selectors',
          topic: 'CSS Fundamentals',
          level: 'basic',
          content: `# CSS Selectors 🎯

Selectors tell CSS **which elements** to style. Think of them as pointing at things on your page.

## Element Selector

Style ALL elements of that type:
\`\`\`css
p { color: blue; }  /* ALL paragraphs */
h1 { color: red; }  /* ALL h1 headings */
\`\`\`

## Class Selector (.)

Style elements with a specific class:
\`\`\`css
.warning { color: orange; }
.big { font-size: 30px; }
\`\`\`

Use in HTML: \`<p class="warning">Watch out!</p>\`

## ID Selector (#)

Style ONE specific element:
\`\`\`css
#title { color: gold; }
\`\`\`

Use in HTML: \`<h1 id="title">Hello</h1>\`

## Quick Rule

- **Classes** (\`.\`) — reuse on many elements
- **IDs** (\`#\`) — use on ONE element only

Try adding classes to the HTML and styling them in the CSS tab!`,
          initialCode: `<!DOCTYPE html>
<html>
<head><link rel="stylesheet" href="style.css"></head>
<body>
  <h1 id="title">CSS Selectors</h1>
  <div class="card">
    <h3>Card Title</h3>
    <p>Some <span class="highlight">highlighted</span> text.</p>
  </div>
  <div class="card special">
    <h3>Special Card</h3>
    <p>This card has two classes.</p>
  </div>
</body>
</html>`,
          initialCss: `body { font-family: Arial; padding: 20px; background: #1a1a2e; color: #e0e0e0; }

#title { color: #e94560; font-size: 32px; text-align: center; }

.card {
  border: 1px solid #333;
  padding: 16px;
  margin: 8px 0;
  border-radius: 8px;
  background: #16213e;
}

.card h3 { color: #4fc3f7; }

.highlight {
  background-color: #e94560;
  padding: 2px 6px;
  border-radius: 4px;
  color: white;
}

.special { border-left: 4px solid #16c79a; }`,
          language: 'html',
          challenge: {
            instruction: 'Add a class "important" to a paragraph in HTML and style it in CSS with a different color and font-size.',
            initialCode: `<!DOCTYPE html>
<html>
<head><link rel="stylesheet" href="style.css"></head>
<body>
  <h1>My Page</h1>
  <p>Normal paragraph.</p>
  <!-- Add class="important" to a paragraph -->
  <p>Make me important!</p>
</body>
</html>`,
            initialCss: `body { font-family: Arial; padding: 20px; background: #1a1a2e; color: #e0e0e0; }
h1 { color: #e94560; }

/* Style the .important class */`,
            validationKeywords: ['class=', 'important', 'color'],
          },
        },
        {
          id: 'css-3',
          title: 'Colors & Typography',
          topic: 'CSS Fundamentals',
          level: 'basic',
          content: `# Colors & Typography 🌈

Let's learn how to make your pages colorful and text beautiful!

## Colors in CSS

**Named colors:**
\`\`\`css
color: red;
color: blue;
color: tomato;
\`\`\`

**Hex codes** (most common):
\`\`\`css
color: #ff0000;   /* red */
color: #3498db;   /* nice blue */
color: #2ecc71;   /* green */
\`\`\`

**RGB:**
\`\`\`css
color: rgb(255, 0, 0);    /* red */
color: rgba(0, 0, 0, 0.5); /* 50% transparent black */
\`\`\`

## Typography

\`\`\`css
p {
  font-family: Arial, sans-serif;
  font-size: 18px;
  font-weight: bold;
  line-height: 1.6;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 2px;
}
\`\`\`

Try mixing different colors and font properties!`,
          initialCode: `<!DOCTYPE html>
<html>
<head><link rel="stylesheet" href="style.css"></head>
<body>
  <h1>Colors & Fonts</h1>
  <p class="red">I am red!</p>
  <p class="blue">I am blue!</p>
  <p class="fancy">I am fancy text!</p>
  <p class="big">I am BIG text!</p>
</body>
</html>`,
          initialCss: `body { font-family: Arial; padding: 20px; background: #1a1a2e; color: #e0e0e0; }

h1 { color: #e94560; text-align: center; }

.red { color: #e74c3c; font-size: 20px; }
.blue { color: #3498db; font-size: 20px; }

.fancy {
  font-family: Georgia, serif;
  font-style: italic;
  font-size: 24px;
  color: #f39c12;
  letter-spacing: 2px;
}

.big {
  font-size: 36px;
  font-weight: bold;
  color: #2ecc71;
  text-transform: uppercase;
}`,
          language: 'html',
          challenge: {
            instruction: 'Style 3 different paragraphs with different colors using hex codes and different font-sizes.',
            initialCode: `<!DOCTYPE html>
<html>
<head><link rel="stylesheet" href="style.css"></head>
<body>
  <h1>My Colors</h1>
  <p class="first">First paragraph</p>
  <p class="second">Second paragraph</p>
  <p class="third">Third paragraph</p>
</body>
</html>`,
            initialCss: `body { background: #1a1a2e; padding: 20px; }
h1 { color: white; }

/* Style .first, .second, .third with different colors and font-sizes */`,
            validationKeywords: ['.first', '.second', '.third', 'color:', 'font-size:'],
          },
        },
        {
          id: 'css-4',
          title: 'The Box Model',
          topic: 'CSS Fundamentals',
          level: 'basic',
          content: `# The Box Model 📦

Every HTML element is a **box**. Understanding the box model is KEY to CSS layouts!

## Four Layers (Inside → Outside)

1. **Content** — your text/images
2. **Padding** — space INSIDE the border
3. **Border** — the edge of the box
4. **Margin** — space OUTSIDE the border

\`\`\`css
.box {
  padding: 20px;    /* inner space */
  border: 2px solid black;
  margin: 10px;     /* outer space */
}
\`\`\`

## Shorthand

\`\`\`css
padding: 10px;              /* all sides */
padding: 10px 20px;         /* top/bottom, left/right */
padding: 10px 20px 30px 40px; /* top, right, bottom, left */
\`\`\`

## Box Sizing

Add this to make life easier:
\`\`\`css
* { box-sizing: border-box; }
\`\`\`

This makes \`width\` include padding and border (no surprises!).`,
          initialCode: `<!DOCTYPE html>
<html>
<head><link rel="stylesheet" href="style.css"></head>
<body>
  <div class="box box-1">Padding: 10px</div>
  <div class="box box-2">Padding: 30px</div>
  <div class="box box-3">Margin: 40px</div>
</body>
</html>`,
          initialCss: `* { box-sizing: border-box; }
body { font-family: Arial; padding: 20px; background: #1a1a2e; color: white; }

.box {
  background: #16213e;
  border-radius: 8px;
  margin: 10px 0;
  text-align: center;
}

.box-1 {
  padding: 10px;
  border: 2px solid #e94560;
}

.box-2 {
  padding: 30px;
  border: 2px solid #4fc3f7;
}

.box-3 {
  padding: 20px;
  margin: 40px;
  border: 2px solid #2ecc71;
}`,
          language: 'html',
          challenge: {
            instruction: 'Create a box with padding of 20px, margin of 15px, and a border of 3px solid with any color.',
            initialCode: `<!DOCTYPE html>
<html>
<head><link rel="stylesheet" href="style.css"></head>
<body>
  <div class="my-box">Style this box!</div>
</body>
</html>`,
            initialCss: `body { background: #1a1a2e; padding: 20px; color: white; }

.my-box {
  /* Add padding, margin, and border */
}`,
            validationKeywords: ['padding', 'margin', 'border'],
          },
        },
        {
          id: 'css-5',
          title: 'Flexbox Layout',
          topic: 'CSS Fundamentals',
          level: 'basic',
          content: `# Flexbox Layout 📐

Flexbox makes arranging items EASY. No more fighting with floats!

## Enable Flexbox

\`\`\`css
.container {
  display: flex;
}
\`\`\`

That's it! Now the children line up in a row.

## Main Properties

\`\`\`css
.container {
  display: flex;
  justify-content: center;     /* horizontal alignment */
  align-items: center;         /* vertical alignment */
  gap: 10px;                   /* space between items */
  flex-direction: row;         /* row or column */
}
\`\`\`

## justify-content Options
- \`flex-start\` — items at the start
- \`center\` — items in the middle
- \`space-between\` — equal space between
- \`space-around\` — equal space around

## align-items Options
- \`flex-start\` — items at the top
- \`center\` — items in the middle
- \`stretch\` — items stretch to fill

Try changing the properties to see what happens!`,
          initialCode: `<!DOCTYPE html>
<html>
<head><link rel="stylesheet" href="style.css"></head>
<body>
  <h1>Flexbox Demo</h1>
  <div class="flex-container">
    <div class="item">1</div>
    <div class="item">2</div>
    <div class="item">3</div>
  </div>
</body>
</html>`,
          initialCss: `body { font-family: Arial; padding: 20px; background: #1a1a2e; color: white; }
h1 { color: #e94560; text-align: center; }

.flex-container {
  display: flex;
  justify-content: space-around;
  align-items: center;
  gap: 16px;
  padding: 20px;
  min-height: 200px;
  background: #16213e;
  border-radius: 12px;
}

.item {
  background: #e94560;
  color: white;
  padding: 20px 40px;
  border-radius: 8px;
  font-size: 24px;
  font-weight: bold;
}`,
          language: 'html',
          challenge: {
            instruction: 'Create a flex container with 3 items centered both horizontally and vertically using display: flex, justify-content, and align-items.',
            initialCode: `<!DOCTYPE html>
<html>
<head><link rel="stylesheet" href="style.css"></head>
<body>
  <div class="container">
    <div class="box">A</div>
    <div class="box">B</div>
    <div class="box">C</div>
  </div>
</body>
</html>`,
            initialCss: `body { background: #1a1a2e; margin: 0; }
.box { background: #e94560; color: white; padding: 20px; border-radius: 8px; }

.container {
  /* Add display: flex, justify-content, align-items */
  min-height: 100vh;
}`,
            validationKeywords: ['display: flex', 'justify-content', 'align-items'],
          },
        },
        {
          id: 'css-6',
          title: 'Responsive Design',
          topic: 'CSS Fundamentals',
          level: 'basic',
          content: `# Responsive Design 📱

Your website should look good on phones, tablets, AND desktops!

## Media Queries

Change styles based on screen size:

\`\`\`css
/* Default styles (mobile first) */
.container { padding: 10px; }

/* Tablet and up */
@media (min-width: 768px) {
  .container { padding: 20px; }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .container { padding: 40px; }
}
\`\`\`

## Responsive Units

- \`%\` — percentage of parent
- \`vw\` / \`vh\` — percentage of screen width/height
- \`rem\` — relative to root font size
- \`em\` — relative to parent font size

## Max-Width Trick

\`\`\`css
img { max-width: 100%; height: auto; }
\`\`\`

This makes images scale down on small screens!`,
          initialCode: `<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="container">
    <h1>Responsive Page</h1>
    <div class="grid">
      <div class="card">Card 1</div>
      <div class="card">Card 2</div>
      <div class="card">Card 3</div>
    </div>
  </div>
</body>
</html>`,
          initialCss: `body { font-family: Arial; margin: 0; background: #1a1a2e; color: white; }
.container { max-width: 1200px; margin: 0 auto; padding: 20px; }
h1 { color: #e94560; text-align: center; }

.grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

.card {
  background: #16213e;
  padding: 30px;
  border-radius: 12px;
  text-align: center;
  font-size: 18px;
}

@media (min-width: 500px) {
  .grid { grid-template-columns: 1fr 1fr; }
}

@media (min-width: 800px) {
  .grid { grid-template-columns: 1fr 1fr 1fr; }
}`,
          language: 'html',
          challenge: {
            instruction: 'Create a grid that shows 1 column on small screens and 3 columns on wide screens using @media query.',
            initialCode: `<!DOCTYPE html>
<html>
<head><link rel="stylesheet" href="style.css"></head>
<body>
  <div class="grid">
    <div class="item">A</div>
    <div class="item">B</div>
    <div class="item">C</div>
  </div>
</body>
</html>`,
            initialCss: `body { background: #1a1a2e; padding: 20px; }
.item { background: #e94560; color: white; padding: 20px; border-radius: 8px; text-align: center; }

.grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

/* Add @media query for wider screens */`,
            validationKeywords: ['@media', 'grid-template-columns'],
          },
        },
      ],
    },
    {
      id: 'js-basics',
      name: 'JavaScript Basics',
      icon: '⚡',
      lessons: [
        {
          id: 'js-1',
          title: 'What is JavaScript?',
          topic: 'JavaScript Basics',
          level: 'basic',
          content: `# What is JavaScript? ⚡

JavaScript (JS) makes your web pages come alive! Buttons that click, menus that slide, forms that validate — that's all JavaScript.

## Where Does JS Go?

In the **script.js** tab! Or in a \`<script>\` tag:

\`\`\`html
<script src="script.js"></script>
\`\`\`

## Your First JavaScript

Open the console at the bottom to see output:

\`\`\`javascript
console.log("Hello, World!");
\`\`\`

## Variables — Storing Data

\`\`\`javascript
let name = "Alice";    // can change later
const age = 25;        // cannot change (constant)
var old = "don't use"; // old way, avoid it
\`\`\`

## Data Types

- **String**: \`"hello"\` (text)
- **Number**: \`42\`, \`3.14\`
- **Boolean**: \`true\`, \`false\`
- **Array**: \`[1, 2, 3]\`

Open the console below to see the output!`,
          initialCode: `<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <h1>Check the Console! 👇</h1>
  <p>Open the console panel at the bottom to see output.</p>
  <script src="script.js"></script>
</body>
</html>`,
          initialCss: `body { font-family: Arial; padding: 40px; background: #1a1a2e; color: #e0e0e0; text-align: center; }
h1 { color: #f39c12; font-size: 36px; }
p { color: #ccc; font-size: 18px; }`,
          initialJs: `// Welcome to JavaScript!
console.log("Hello from JavaScript!");

let name = "Coder";
console.log("Welcome, " + name + "!");

const age = 20;
console.log("You are " + age + " years old.");

// Try changing the name and age above!`,
          language: 'html',
          challenge: {
            instruction: 'Create variables for your name and age using let/const, then console.log a greeting message.',
            initialCode: `<!DOCTYPE html>
<html>
<body>
  <h1>My First JS</h1>
  <script src="script.js"></script>
</body>
</html>`,
            initialJs: `// Create a variable 'name' with let
// Create a variable 'age' with const
// Then console.log a greeting message`,
            validationKeywords: ['let', 'console.log'],
          },
        },
        {
          id: 'js-2',
          title: 'Variables & Data Types',
          topic: 'JavaScript Basics',
          level: 'basic',
          content: `# Variables & Data Types 📦

Let's dig deeper into storing and using data in JavaScript.

## let vs const

\`\`\`javascript
let score = 0;     // Can change: score = 10;
const PI = 3.14;   // Cannot change. Trying will cause an error!
\`\`\`

**Rule of thumb:** Use \`const\` unless you NEED to change the value.

## Strings (Text)

\`\`\`javascript
const greeting = "Hello";
const name = 'World';
const message = \`Hi \${name}!\`;  // Template literal (backticks)
\`\`\`

## Numbers

\`\`\`javascript
const age = 25;
const price = 9.99;
const sum = 10 + 5;      // 15
const remainder = 10 % 3; // 1
\`\`\`

## Booleans

\`\`\`javascript
const isLoggedIn = true;
const isEmpty = false;
const isAdult = age >= 18; // true
\`\`\`

## Checking Types

\`\`\`javascript
console.log(typeof "hello"); // "string"
console.log(typeof 42);      // "number"
console.log(typeof true);    // "boolean"
\`\`\``,
          initialCode: `<!DOCTYPE html>
<html>
<head><link rel="stylesheet" href="style.css"></head>
<body>
  <h1>Variables & Types</h1>
  <p>Check the console!</p>
  <script src="script.js"></script>
</body>
</html>`,
          initialCss: `body { font-family: Arial; padding: 30px; background: #1a1a2e; color: #e0e0e0; text-align: center; }
h1 { color: #f39c12; }`,
          initialJs: `// Strings
const firstName = "Alice";
const lastName = "Smith";
const fullName = firstName + " " + lastName;
console.log("Full name:", fullName);

// Template literals (modern way!)
const greeting = \`Hello, \${fullName}!\`;
console.log(greeting);

// Numbers
const a = 10;
const b = 3;
console.log(a + " + " + b + " = " + (a + b));
console.log(a + " - " + b + " = " + (a - b));
console.log(a + " * " + b + " = " + (a * b));

// Booleans
const isHappy = true;
console.log("Is happy?", isHappy);
console.log("Type of name:", typeof firstName);
console.log("Type of age:", typeof a);`,
          language: 'html',
          challenge: {
            instruction: 'Create a const string, a let number, and log their types using typeof.',
            initialCode: `<!DOCTYPE html>
<html><body><h1>Types</h1><script src="script.js"></script></body></html>`,
            initialJs: `// Create a const string variable
// Create a let number variable
// Log both using typeof`,
            validationKeywords: ['const', 'let', 'typeof', 'console.log'],
          },
        },
        {
          id: 'js-3',
          title: 'Functions',
          topic: 'JavaScript Basics',
          level: 'basic',
          content: `# Functions 🔧

Functions are reusable blocks of code. Write once, use many times!

## Creating a Function

\`\`\`javascript
function greet(name) {
  return "Hello, " + name + "!";
}
\`\`\`

## Calling a Function

\`\`\`javascript
const result = greet("Alice");
console.log(result); // "Hello, Alice!"
\`\`\`

## Arrow Functions (Modern Way)

\`\`\`javascript
const add = (a, b) => a + b;
const square = (n) => n * n;
\`\`\`

## Functions with Multiple Lines

\`\`\`javascript
const calculateTotal = (price, quantity) => {
  const subtotal = price * quantity;
  const tax = subtotal * 0.1;
  return subtotal + tax;
};
\`\`\`

## Default Parameters

\`\`\`javascript
function greet(name = "stranger") {
  return "Hello, " + name;
}
greet();      // "Hello, stranger"
greet("Bob"); // "Hello, Bob"
\`\`\``,
          initialCode: `<!DOCTYPE html>
<html>
<head><link rel="stylesheet" href="style.css"></head>
<body>
  <h1>Functions</h1>
  <div id="output"></div>
  <script src="script.js"></script>
</body>
</html>`,
          initialCss: `body { font-family: Arial; padding: 30px; background: #1a1a2e; color: #e0e0e0; }
h1 { color: #f39c12; }
#output { background: #16213e; padding: 20px; border-radius: 8px; font-family: monospace; line-height: 2; }`,
          initialJs: `function greet(name) {
  return "Hello, " + name + "!";
}

const add = (a, b) => a + b;
const multiply = (a, b) => a * b;

const output = document.getElementById("output");
output.innerHTML =
  greet("World") + "<br>" +
  "2 + 3 = " + add(2, 3) + "<br>" +
  "4 × 5 = " + multiply(4, 5);

console.log(greet("Console"));
console.log("Sum:", add(10, 20));`,
          language: 'html',
          challenge: {
            instruction: 'Create a function called "multiply" that takes two numbers and returns their product. Call it and log the result.',
            initialCode: `<!DOCTYPE html>
<html><body><h1>Functions</h1><script src="script.js"></script></body></html>`,
            initialJs: `// Create a function called multiply
// Call it and console.log the result`,
            validationKeywords: ['function', 'return', 'console.log'],
          },
        },
        {
          id: 'js-4',
          title: 'Conditionals & Loops',
          topic: 'JavaScript Basics',
          level: 'basic',
          content: `# Conditionals & Loops 🔄

## If/Else — Making Decisions

\`\`\`javascript
const age = 18;

if (age >= 18) {
  console.log("You can vote!");
} else {
  console.log("Too young to vote.");
}
\`\`\`

## Comparison Operators
- \`===\` — equals (use this, not ==)
- \`!==\` — not equals
- \`>\`, \`<\`, \`>=\`, \`<=\`

## For Loop — Repeating Things

\`\`\`javascript
for (let i = 0; i < 5; i++) {
  console.log("Count:", i);
}
\`\`\`

## While Loop

\`\`\`javascript
let count = 0;
while (count < 3) {
  console.log(count);
  count++;
}
\`\`\`

## Looping Through Arrays

\`\`\`javascript
const fruits = ["apple", "banana", "cherry"];
for (const fruit of fruits) {
  console.log(fruit);
}
\`\`\``,
          initialCode: `<!DOCTYPE html>
<html>
<head><link rel="stylesheet" href="style.css"></head>
<body>
  <h1>Conditionals & Loops</h1>
  <div id="output"></div>
  <script src="script.js"></script>
</body>
</html>`,
          initialCss: `body { font-family: monospace; padding: 30px; background: #1a1a2e; color: #e0e0e0; }
h1 { color: #f39c12; }
#output { background: #16213e; padding: 15px; border-radius: 8px; white-space: pre-line; }`,
          initialJs: `// If/Else
const temperature = 30;
let weather;

if (temperature > 30) {
  weather = "It's hot! 🔥";
} else if (temperature > 20) {
  weather = "Nice weather! ☀️";
} else {
  weather = "It's cold! 🥶";
}
console.log(weather);

// For loop
let result = "";
for (let i = 1; i <= 5; i++) {
  result += "⭐".repeat(i) + "\\n";
}

document.getElementById("output").textContent = result;

// Loop through array
const colors = ["red", "green", "blue"];
for (const color of colors) {
  console.log("Color:", color);
}`,
          language: 'html',
          challenge: {
            instruction: 'Write an if/else that checks if a number is positive, negative, or zero. Then use a for loop to count from 1 to 5.',
            initialCode: `<!DOCTYPE html>
<html><body><h1>Logic</h1><script src="script.js"></script></body></html>`,
            initialJs: `// Check if a number is positive, negative, or zero
const num = 5;

// Use for loop to count 1 to 5`,
            validationKeywords: ['if', 'else', 'for', 'console.log'],
          },
        },
        {
          id: 'js-5',
          title: 'DOM Manipulation',
          topic: 'JavaScript Basics',
          level: 'basic',
          content: `# DOM Manipulation 🎮

The DOM (Document Object Model) is how JavaScript talks to HTML. You can change text, colors, add elements — anything!

## Getting Elements

\`\`\`javascript
// By ID
const title = document.getElementById("title");

// By class
const cards = document.querySelectorAll(".card");

// First match
const btn = document.querySelector(".btn");
\`\`\`

## Changing Content

\`\`\`javascript
title.textContent = "New Title!";
title.innerHTML = "<em>Italic Title</em>";
\`\`\`

## Changing Styles

\`\`\`javascript
title.style.color = "red";
title.style.fontSize = "32px";
\`\`\`

## Adding Event Listeners

\`\`\`javascript
btn.addEventListener("click", () => {
  alert("Button clicked!");
});
\`\`\`

Try clicking the buttons in the preview!`,
          initialCode: `<!DOCTYPE html>
<html>
<head><link rel="stylesheet" href="style.css"></head>
<body>
  <h1 id="title">DOM Manipulation</h1>
  <button class="btn change-btn" onclick="changeTitle()">Change Title</button>
  <button class="btn add-btn" onclick="addItem()">Add Item</button>
  <button class="btn remove-btn" onclick="clearList()">Clear</button>
  <ul id="list"></ul>
  <div id="output">Click a button!</div>
  <script src="script.js"></script>
</body>
</html>`,
          initialCss: `body { font-family: Arial; text-align: center; padding: 40px; background: #1a1a2e; color: #e0e0e0; }
h1 { color: #e94560; }
.btn { padding: 10px 20px; font-size: 16px; cursor: pointer; margin: 5px; border-radius: 8px; border: none; color: white; }
.change-btn { background: #3498db; }
.add-btn { background: #2ecc71; }
.remove-btn { background: #e74c3c; }
#output { margin-top: 20px; font-size: 20px; color: #ccc; }
ul { list-style: none; padding: 0; }
li { background: #16213e; padding: 8px; margin: 4px auto; border-radius: 6px; max-width: 200px; }`,
          initialJs: `let count = 0;

function changeTitle() {
  const title = document.getElementById("title");
  title.textContent = "Title Changed! ✨";
  title.style.color = "#f39c12";
}

function addItem() {
  count++;
  const li = document.createElement("li");
  li.textContent = "Item " + count;
  document.getElementById("list").appendChild(li);
}

function clearList() {
  document.getElementById("list").innerHTML = "";
  count = 0;
}`,
          language: 'html',
          challenge: {
            instruction: 'Create a button that when clicked, changes the text of a paragraph using document.getElementById and textContent.',
            initialCode: `<!DOCTYPE html>
<html>
<body>
  <p id="text">Click the button to change me!</p>
  <button onclick="changeText()">Change Text</button>
  <script src="script.js"></script>
</body>
</html>`,
            initialJs: `// Create the changeText function
// Use document.getElementById to get the paragraph
// Change its textContent`,
            validationKeywords: ['function', 'document.getElementById', 'textContent'],
          },
        },
      ],
    },
    {
      id: 'react-basics',
      name: 'React Fundamentals',
      icon: '⚛️',
      lessons: [
        {
          id: 'react-1',
          title: 'Components & JSX',
          topic: 'React Fundamentals',
          level: 'basic',
          content: `# Components & JSX ⚛️

React builds UIs with **components** — reusable pieces of your page.

## What is a Component?

A component is a JavaScript function that returns HTML-like code (called **JSX**):

\`\`\`jsx
function Welcome() {
  return <h1>Hello, World!</h1>;
}
\`\`\`

## JSX Rules

1. Must return **one parent element** (use \`<div>\` or \`<>\`)
2. Use \`className\` instead of \`class\`
3. Close all tags: \`<img />\`, \`<br />\`

## Components are Building Blocks

Think of them like LEGO pieces:
- \`<Header />\` — the top bar
- \`<Card />\` — a content card
- \`<Footer />\` — the bottom section

**Note:** In this playground, we demonstrate React concepts. The App.jsx tab shows component patterns!`,
          initialCode: `<!DOCTYPE html>
<html>
<head><link rel="stylesheet" href="style.css"></head>
<body>
  <div id="app"></div>
  <script src="script.js"></script>
</body>
</html>`,
          initialCss: `body { font-family: Arial; background: #282c34; color: white; padding: 0; margin: 0; }
.app { padding: 40px; text-align: center; }
.react-blue { color: #61dafb; }
.component { background: #3b3f47; padding: 20px; margin: 10px auto; border-radius: 12px; border-left: 4px solid #61dafb; max-width: 500px; text-align: left; }
.component h3 { color: #61dafb; margin-top: 0; }`,
          initialJs: `// Simulating React components with vanilla JS
function Header() {
  return '<h1 class="react-blue">⚛️ React Components</h1>';
}

function Card(title, text) {
  return \`
    <div class="component">
      <h3>\${title}</h3>
      <p>\${text}</p>
    </div>
  \`;
}

// "Rendering" our components
const app = document.getElementById("app");
app.innerHTML = \`
  <div class="app">
    \${Header()}
    \${Card("Component: Header", "The top section of your page")}
    \${Card("Component: Card", "A reusable content container")}
    \${Card("Component: Footer", "The bottom section")}
  </div>
\`;

console.log("React uses a virtual DOM for efficient updates!");`,
          initialJsx: `// This is what React JSX looks like:
// (This is for learning — it runs in the preview as vanilla JS)

// function App() {
//   return (
//     <div>
//       <Header />
//       <Card title="Hello" text="World" />
//     </div>
//   );
// }

// function Header() {
//   return <h1>My App</h1>;
// }

// function Card({ title, text }) {
//   return (
//     <div className="card">
//       <h3>{title}</h3>
//       <p>{text}</p>
//     </div>
//   );
// }`,
          language: 'html',
          challenge: {
            instruction: 'Create a function called "Card" that takes a title and returns HTML with an h3 heading. Use it to render 2 cards.',
            initialCode: `<!DOCTYPE html>
<html>
<body>
  <div id="app"></div>
  <script src="script.js"></script>
</body>
</html>`,
            initialJs: `// Create a Card function that returns HTML
// Render 2 cards into #app`,
            validationKeywords: ['function', 'card', 'innerhtml'],
          },
        },
        {
          id: 'react-2',
          title: 'State with useState',
          topic: 'React Fundamentals',
          level: 'basic',
          content: `# State with useState 🔄

State is data that can **change** and makes your UI update automatically!

## What is State?

In React:
\`\`\`jsx
const [count, setCount] = useState(0);
\`\`\`

- \`count\` — the current value
- \`setCount\` — function to update it
- \`0\` — the starting value

## When State Changes, UI Updates!

\`\`\`jsx
function Counter() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
    </div>
  );
}
\`\`\`

In our playground, we simulate state with regular variables and DOM updates.`,
          initialCode: `<!DOCTYPE html>
<html>
<head><link rel="stylesheet" href="style.css"></head>
<body>
  <div id="app"></div>
  <script src="script.js"></script>
</body>
</html>`,
          initialCss: `body { font-family: Arial; background: #282c34; color: white; padding: 40px; text-align: center; }
.counter { font-size: 48px; color: #61dafb; margin: 20px; }
button { padding: 12px 24px; font-size: 18px; border: none; border-radius: 8px; cursor: pointer; margin: 5px; }
.inc { background: #2ecc71; color: white; }
.dec { background: #e74c3c; color: white; }
.reset { background: #3498db; color: white; }`,
          initialJs: `// Simulating React useState
let count = 0;

function render() {
  document.getElementById("app").innerHTML = \`
    <h1 style="color: #61dafb;">⚛️ State Demo</h1>
    <div class="counter">\${count}</div>
    <button class="dec" onclick="decrement()">- 1</button>
    <button class="reset" onclick="reset()">Reset</button>
    <button class="inc" onclick="increment()">+ 1</button>
    <p style="color: #888; margin-top: 20px;">
      In React: const [count, setCount] = useState(0)
    </p>
  \`;
}

function increment() { count++; render(); }
function decrement() { count--; render(); }
function reset() { count = 0; render(); }

render(); // Initial render`,
          language: 'html',
          challenge: {
            instruction: 'Create a counter with increment and decrement buttons that update a displayed number.',
            initialCode: `<!DOCTYPE html>
<html>
<body>
  <div id="app"></div>
  <script src="script.js"></script>
</body>
</html>`,
            initialJs: `// Create a counter variable
// Create render(), increment(), decrement() functions`,
            validationKeywords: ['let', 'function', 'innerhtml', 'onclick'],
          },
        },
        {
          id: 'react-3',
          title: 'Props & Data Flow',
          topic: 'React Fundamentals',
          level: 'basic',
          content: `# Props & Data Flow 📨

Props (properties) let you pass data FROM a parent TO a child component.

## In React:

\`\`\`jsx
function UserCard({ name, age, role }) {
  return (
    <div className="card">
      <h2>{name}</h2>
      <p>Age: {age}</p>
      <p>Role: {role}</p>
    </div>
  );
}

// Using it:
<UserCard name="Alice" age={25} role="Developer" />
\`\`\`

## Key Rules:
1. Props flow **one way**: parent → child
2. Props are **read-only** in the child
3. Use them to make components reusable

## In Our Playground:

We pass data as function arguments (same concept!):

\`\`\`javascript
function Card(props) {
  return \`<div><h3>\${props.name}</h3></div>\`;
}
\`\`\``,
          initialCode: `<!DOCTYPE html>
<html>
<head><link rel="stylesheet" href="style.css"></head>
<body>
  <div id="app"></div>
  <script src="script.js"></script>
</body>
</html>`,
          initialCss: `body { font-family: Arial; background: #282c34; color: white; padding: 20px; }
h1 { color: #61dafb; text-align: center; }
.cards { display: flex; gap: 16px; flex-wrap: wrap; justify-content: center; }
.user-card { background: #3b3f47; padding: 20px; border-radius: 12px; min-width: 200px; border-top: 4px solid #61dafb; }
.user-card h3 { color: #61dafb; margin-top: 0; }
.user-card .role { color: #2ecc71; font-weight: bold; }`,
          initialJs: `// Simulating Props
function UserCard({ name, age, role, emoji }) {
  return \`
    <div class="user-card">
      <h3>\${emoji} \${name}</h3>
      <p>Age: \${age}</p>
      <p class="role">\${role}</p>
    </div>
  \`;
}

const users = [
  { name: "Alice", age: 28, role: "Developer", emoji: "👩‍💻" },
  { name: "Bob", age: 32, role: "Designer", emoji: "🎨" },
  { name: "Charlie", age: 25, role: "Manager", emoji: "📊" },
];

const app = document.getElementById("app");
app.innerHTML = \`
  <h1>⚛️ Props Demo</h1>
  <div class="cards">
    \${users.map(u => UserCard(u)).join("")}
  </div>
\`;

console.log("Props let you pass data to components!");`,
          language: 'html',
          challenge: {
            instruction: 'Create a ProductCard function that takes name and price, and render 3 products.',
            initialCode: `<!DOCTYPE html>
<html>
<body>
  <div id="app"></div>
  <script src="script.js"></script>
</body>
</html>`,
            initialJs: `// Create ProductCard function with name and price
// Render 3 products into #app`,
            validationKeywords: ['function', 'productcard', 'innerhtml'],
          },
        },
        {
          id: 'react-4',
          title: 'Event Handling',
          topic: 'React Fundamentals',
          level: 'basic',
          content: `# Event Handling 🖱️

React handles events with camelCase names.

## In React:
\`\`\`jsx
<button onClick={() => alert("Clicked!")}>Click Me</button>
<input onChange={(e) => setName(e.target.value)} />
\`\`\`

## Common Events:
- \`onClick\` — mouse click
- \`onChange\` — input value changes
- \`onSubmit\` — form submission
- \`onMouseEnter\` / \`onMouseLeave\` — hover

## Practical Example:

A real-time search filter is a great way to see events in action!`,
          initialCode: `<!DOCTYPE html>
<html>
<head><link rel="stylesheet" href="style.css"></head>
<body>
  <div id="app"></div>
  <script src="script.js"></script>
</body>
</html>`,
          initialCss: `body { font-family: Arial; background: #282c34; color: white; padding: 20px; }
h1 { color: #61dafb; text-align: center; }
input { width: 100%; max-width: 400px; padding: 12px; border-radius: 8px; border: 2px solid #444; background: #3b3f47; color: white; font-size: 16px; display: block; margin: 10px auto; }
.list { max-width: 400px; margin: 0 auto; }
.list-item { background: #3b3f47; padding: 12px; margin: 6px 0; border-radius: 8px; cursor: pointer; transition: background 0.2s; }
.list-item:hover { background: #4b4f57; }`,
          initialJs: `const items = ["Apple", "Banana", "Cherry", "Date", "Elderberry", "Fig", "Grape"];
let filtered = [...items];

function render() {
  document.getElementById("app").innerHTML = \`
    <h1>🔍 Search Filter</h1>
    <input type="text" placeholder="Type to search..." oninput="handleSearch(this.value)">
    <div class="list">
      \${filtered.map(item => \`<div class="list-item">\${item}</div>\`).join("")}
    </div>
  \`;
}

function handleSearch(query) {
  filtered = items.filter(item =>
    item.toLowerCase().includes(query.toLowerCase())
  );
  render();
}

render();`,
          language: 'html',
          challenge: {
            instruction: 'Create an input that filters a list of items as the user types. Use addEventListener or oninput.',
            initialCode: `<!DOCTYPE html>
<html>
<body>
  <input type="text" id="search" placeholder="Search...">
  <ul id="list"></ul>
  <script src="script.js"></script>
</body>
</html>`,
            initialJs: `// Create an array of items
// Add an input event listener that filters and re-renders the list`,
            validationKeywords: ['filter', 'innerhtml', 'addeventlistener'],
          },
        },
      ],
    },
  ],
};

const intermediateLessons: LevelData = {
  level: 'intermediate',
  label: 'Intermediate',
  topics: [
    {
      id: 'html-intermediate',
      name: 'Advanced HTML',
      icon: '📄',
      lessons: [
        {
          id: 'html-int-1',
          title: 'HTML5 APIs',
          topic: 'Advanced HTML',
          level: 'intermediate',
          content: `# HTML5 APIs 🚀

Modern HTML5 provides powerful built-in features!

## Local Storage

Store data that persists even after closing the browser:
\`\`\`javascript
localStorage.setItem("name", "Alice");
const name = localStorage.getItem("name");
\`\`\`

## Canvas — Drawing Graphics

The \`<canvas>\` element lets you draw shapes, animations, and games:
\`\`\`html
<canvas id="canvas" width="400" height="300"></canvas>
\`\`\`

## Data Attributes

Store custom data on any element:
\`\`\`html
<div data-id="42" data-color="blue">Item</div>
\`\`\`

## Audio & Video

\`\`\`html
<video src="movie.mp4" controls width="400"></video>
<audio src="song.mp3" controls></audio>
\`\`\``,
          initialCode: `<!DOCTYPE html>
<html>
<head><link rel="stylesheet" href="style.css"></head>
<body>
  <h1>HTML5 Canvas</h1>
  <canvas id="canvas" width="400" height="300"></canvas>
  <br>
  <button onclick="drawCircle()">Draw Circle</button>
  <button onclick="clearCanvas()">Clear</button>
  <script src="script.js"></script>
</body>
</html>`,
          initialCss: `body { font-family: Arial; padding: 20px; background: #1a1a2e; color: #e0e0e0; text-align: center; }
h1 { color: #e94560; }
canvas { border: 2px solid #333; border-radius: 8px; background: #0d1117; }
button { padding: 10px 20px; margin: 5px; cursor: pointer; border-radius: 8px; border: none; background: #3498db; color: white; font-size: 14px; }
button:hover { opacity: 0.8; }`,
          initialJs: `const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

function drawCircle() {
  const x = Math.random() * 350 + 25;
  const y = Math.random() * 250 + 25;
  const r = Math.random() * 30 + 10;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = "#" + Math.floor(Math.random()*16777215).toString(16).padStart(6, "0");
  ctx.fill();
}

function clearCanvas() {
  ctx.clearRect(0, 0, 400, 300);
}

console.log("Click 'Draw Circle' to add random circles!");`,
          language: 'html',
          challenge: {
            instruction: 'Create a canvas and draw a rectangle and a circle using the Canvas API.',
            initialCode: `<!DOCTYPE html>
<html>
<body>
  <canvas id="canvas" width="400" height="300"></canvas>
  <script src="script.js"></script>
</body>
</html>`,
            initialJs: `const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
// Draw a rectangle with fillRect
// Draw a circle with arc`,
            validationKeywords: ['getcontext', 'fillrect', 'arc'],
          },
        },
        {
          id: 'html-int-2',
          title: 'Accessibility (a11y)',
          topic: 'Advanced HTML',
          level: 'intermediate',
          content: `# Accessibility (a11y) ♿

Making your website usable by EVERYONE, including people with disabilities.

## ARIA Attributes

\`\`\`html
<button aria-label="Close menu">X</button>
<div role="alert">Error occurred!</div>
<input aria-required="true" aria-invalid="false">
\`\`\`

## Key Practices

1. **Always use alt text** on images
2. **Use semantic HTML** (header, nav, main, etc.)
3. **Labels on inputs** — always pair label + input
4. **Keyboard navigation** — users should be able to tab through
5. **Color contrast** — text must be readable
6. **Focus indicators** — don't remove outline on focus

## Skip Navigation

\`\`\`html
<a href="#main" class="skip-link">Skip to content</a>
\`\`\`

## Testing

- Tab through your page — can you reach everything?
- Use a screen reader to hear your page
- Check color contrast ratios (4.5:1 minimum)`,
          initialCode: `<!DOCTYPE html>
<html lang="en">
<head><link rel="stylesheet" href="style.css"></head>
<body>
  <a href="#main" class="skip-link">Skip to main content</a>
  <header>
    <nav aria-label="Main navigation">
      <a href="/">Home</a>
      <a href="/about">About</a>
    </nav>
  </header>
  <main id="main">
    <h1>Accessible Page</h1>
    <form>
      <label for="name">Name (required):</label>
      <input type="text" id="name" aria-required="true">
      <button type="submit">Submit</button>
    </form>
    <img src="https://picsum.photos/200/150" alt="A beautiful landscape photo">
  </main>
</body>
</html>`,
          initialCss: `body { font-family: Arial; background: #1a1a2e; color: #e0e0e0; margin: 0; }
.skip-link { position: absolute; top: -40px; left: 0; background: #e94560; color: white; padding: 8px; z-index: 100; }
.skip-link:focus { top: 0; }
header { background: #16213e; padding: 15px; }
nav a { color: #4fc3f7; margin-right: 20px; }
main { padding: 20px; }
h1 { color: #e94560; }
label { display: block; margin-top: 15px; color: #ccc; }
input { padding: 10px; border-radius: 6px; border: 2px solid #333; background: #16213e; color: white; margin-top: 5px; }
input:focus { border-color: #4fc3f7; outline: none; }
button { margin-top: 15px; padding: 10px 24px; background: #e94560; color: white; border: none; border-radius: 6px; cursor: pointer; }
img { border-radius: 8px; margin-top: 15px; }`,
          language: 'html',
          challenge: {
            instruction: 'Create a form with proper labels, aria-required on inputs, and a button with aria-label.',
            initialCode: `<!DOCTYPE html>
<html lang="en">
<body>
  <form>
    <!-- Add label, input with aria-required, and button with aria-label -->
  </form>
</body>
</html>`,
            validationKeywords: ['<label', 'aria-required', 'aria-label'],
          },
        },
      ],
    },
    {
      id: 'css-intermediate',
      name: 'Advanced CSS',
      icon: '🎨',
      lessons: [
        {
          id: 'css-int-1',
          title: 'CSS Variables',
          topic: 'Advanced CSS',
          level: 'intermediate',
          content: `# CSS Variables (Custom Properties) 🎛️

CSS variables let you define reusable values!

## Defining Variables

\`\`\`css
:root {
  --primary: #3498db;
  --bg-dark: #1a1a2e;
  --spacing: 16px;
}
\`\`\`

## Using Variables

\`\`\`css
.button {
  background: var(--primary);
  padding: var(--spacing);
}
\`\`\`

## Why Use Variables?

1. Change one value, update everywhere
2. Easy theming (dark/light mode!)
3. Cleaner, more maintainable code

## Dynamic Theming

You can change variables with JavaScript:
\`\`\`javascript
document.documentElement.style.setProperty('--primary', '#e74c3c');
\`\`\``,
          initialCode: `<!DOCTYPE html>
<html>
<head><link rel="stylesheet" href="style.css"></head>
<body>
  <h1>CSS Variables</h1>
  <div class="card-grid">
    <div class="card"><h3>Card 1</h3><p>Using CSS variables</p><button class="btn" onclick="changeTheme()">Change Theme</button></div>
    <div class="card"><h3>Card 2</h3><p>Responsive and themed</p><button class="btn">Action</button></div>
    <div class="card"><h3>Card 3</h3><p>Easy to customize</p><button class="btn">Action</button></div>
  </div>
  <script src="script.js"></script>
</body>
</html>`,
          initialCss: `:root {
  --primary: #6c5ce7;
  --secondary: #00cec9;
  --bg: #2d3436;
  --text: #dfe6e9;
  --card-bg: #636e72;
  --radius: 12px;
  --spacing: 16px;
}

body { background: var(--bg); color: var(--text); font-family: Arial; padding: 20px; }
h1 { color: var(--primary); text-align: center; }

.card-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: var(--spacing); }
.card { background: var(--card-bg); padding: 20px; border-radius: var(--radius); border-top: 4px solid var(--primary); }
.card h3 { color: var(--secondary); }
.btn { background: var(--primary); color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; }
.btn:hover { opacity: 0.8; }`,
          initialJs: `const themes = [
  { primary: "#6c5ce7", secondary: "#00cec9", bg: "#2d3436", card: "#636e72" },
  { primary: "#e94560", secondary: "#f39c12", bg: "#1a1a2e", card: "#16213e" },
  { primary: "#2ecc71", secondary: "#3498db", bg: "#0d1117", card: "#161b22" },
];
let themeIndex = 0;

function changeTheme() {
  themeIndex = (themeIndex + 1) % themes.length;
  const t = themes[themeIndex];
  document.documentElement.style.setProperty("--primary", t.primary);
  document.documentElement.style.setProperty("--secondary", t.secondary);
  document.documentElement.style.setProperty("--bg", t.bg);
  document.documentElement.style.setProperty("--card-bg", t.card);
  console.log("Theme changed to:", themeIndex + 1);
}`,
          language: 'html',
          challenge: {
            instruction: 'Define CSS variables for --primary and --bg in :root, and use them on elements.',
            initialCode: `<!DOCTYPE html>
<html><head><link rel="stylesheet" href="style.css"></head>
<body><h1>Themed</h1><p class="box">Styled box</p></body></html>`,
            initialCss: `:root {
  /* Define --primary and --bg variables */
}
body { background: var(--bg); }
h1 { color: var(--primary); }
.box { border: 2px solid var(--primary); padding: 20px; }`,
            validationKeywords: ['--primary', '--bg', 'var('],
          },
        },
        {
          id: 'css-int-2',
          title: 'CSS Grid Advanced',
          topic: 'Advanced CSS',
          level: 'intermediate',
          content: `# CSS Grid — Advanced 📐

Let's go deeper with CSS Grid for complex layouts!

## Grid Template Areas

Name your grid areas:
\`\`\`css
.layout {
  display: grid;
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
  grid-template-columns: 250px 1fr;
}
.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main { grid-area: main; }
\`\`\`

## Auto-Fill & Auto-Fit

\`\`\`css
/* Cards that auto-wrap */
grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
\`\`\`

## Grid Item Placement

\`\`\`css
.featured { grid-column: span 2; }
.tall { grid-row: span 2; }
\`\`\``,
          initialCode: `<!DOCTYPE html>
<html>
<head><link rel="stylesheet" href="style.css"></head>
<body>
  <div class="layout">
    <header class="header">Header</header>
    <aside class="sidebar">Sidebar</aside>
    <main class="main">Main Content</main>
    <footer class="footer">Footer</footer>
  </div>
</body>
</html>`,
          initialCss: `* { box-sizing: border-box; margin: 0; }
body { font-family: Arial; background: #0d1117; color: white; }

.layout {
  display: grid;
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
  grid-template-columns: 200px 1fr;
  grid-template-rows: 60px 1fr 50px;
  min-height: 100vh;
  gap: 2px;
}

.header { grid-area: header; background: #161b22; padding: 15px; display: flex; align-items: center; font-size: 20px; color: #e94560; font-weight: bold; }
.sidebar { grid-area: sidebar; background: #161b22; padding: 15px; }
.main { grid-area: main; background: #0d1117; padding: 20px; }
.footer { grid-area: footer; background: #161b22; padding: 15px; text-align: center; color: #666; }`,
          language: 'html',
          challenge: {
            instruction: 'Create a grid layout with named template areas for header, sidebar, main, and footer.',
            initialCode: `<!DOCTYPE html>
<html><head><link rel="stylesheet" href="style.css"></head>
<body>
  <div class="layout">
    <div class="header">Header</div>
    <div class="sidebar">Sidebar</div>
    <div class="main">Main</div>
    <div class="footer">Footer</div>
  </div>
</body></html>`,
            initialCss: `.layout {
  display: grid;
  /* Add grid-template-areas */
}
.header { grid-area: header; background: #333; padding: 10px; }
.sidebar { grid-area: sidebar; background: #444; padding: 10px; }
.main { grid-area: main; background: #555; padding: 10px; }
.footer { grid-area: footer; background: #333; padding: 10px; }`,
            validationKeywords: ['grid-template-areas', 'grid-area'],
          },
        },
        {
          id: 'css-int-3',
          title: 'Animations & Transitions',
          topic: 'Advanced CSS',
          level: 'intermediate',
          content: `# Animations & Transitions 🎬

## Transitions — Smooth Changes

\`\`\`css
.button {
  background: blue;
  transition: all 0.3s ease;
}
.button:hover {
  background: red;
  transform: scale(1.1);
}
\`\`\`

## Keyframe Animations

\`\`\`css
@keyframes slideIn {
  from { transform: translateX(-100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

.element {
  animation: slideIn 0.5s ease-out;
}
\`\`\`

## Animation Properties
- \`animation-name\` — which keyframes to use
- \`animation-duration\` — how long
- \`animation-timing-function\` — speed curve (ease, linear)
- \`animation-iteration-count\` — how many times (or \`infinite\`)
- \`animation-delay\` — wait before starting`,
          initialCode: `<!DOCTYPE html>
<html>
<head><link rel="stylesheet" href="style.css"></head>
<body>
  <div class="bounce">🚀</div>
  <h1 class="fade-in">CSS Animations!</h1>
  <button class="btn">Hover Me</button>
  <div class="spinner"></div>
</body>
</html>`,
          initialCss: `body { text-align: center; padding: 40px; background: #1a1a2e; color: white; font-family: Arial; }

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-30px); }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.bounce { animation: bounce 1s infinite; display: inline-block; font-size: 50px; }
.fade-in { animation: fadeIn 1s ease-out; color: #e94560; }

.btn {
  padding: 15px 30px; background: #e94560; color: white; border: none;
  border-radius: 8px; font-size: 18px; cursor: pointer;
  transition: all 0.3s ease;
}
.btn:hover { transform: scale(1.1) rotate(2deg); background: #c0392b; box-shadow: 0 10px 30px rgba(233,69,96,0.4); }

.spinner {
  width: 40px; height: 40px; border: 4px solid #333;
  border-top-color: #e94560; border-radius: 50%;
  animation: spin 1s linear infinite; margin: 30px auto;
}`,
          language: 'html',
          challenge: {
            instruction: 'Create a @keyframes animation and apply it to an element. Also add a hover transition to a button.',
            initialCode: `<!DOCTYPE html>
<html><head><link rel="stylesheet" href="style.css"></head>
<body>
  <div class="animated">🎉</div>
  <button class="btn">Hover me</button>
</body></html>`,
            initialCss: `body { text-align: center; padding: 40px; background: #1a1a2e; color: white; }

/* Create @keyframes and apply to .animated */
/* Add transition to .btn */`,
            validationKeywords: ['@keyframes', 'animation:', 'transition:'],
          },
        },
      ],
    },
    {
      id: 'js-intermediate',
      name: 'Advanced JavaScript',
      icon: '⚡',
      lessons: [
        {
          id: 'js-int-1',
          title: 'Async/Await & Fetch',
          topic: 'Advanced JavaScript',
          level: 'intermediate',
          content: `# Async JavaScript 🌐

## The Problem

Some operations take time (loading data from the internet). JavaScript doesn't wait — it keeps running!

## Promises

A promise is like ordering food: you get a receipt (promise) and pick up later.

\`\`\`javascript
fetch("https://api.example.com/data")
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));
\`\`\`

## Async/Await (Cleaner!)

\`\`\`javascript
async function getData() {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed:", error);
  }
}
\`\`\`

\`async\` marks the function. \`await\` pauses until done.`,
          initialCode: `<!DOCTYPE html>
<html>
<head><link rel="stylesheet" href="style.css"></head>
<body>
  <h1>Fetch API Demo</h1>
  <button onclick="loadUsers()">Load Users</button>
  <div id="users"></div>
  <script src="script.js"></script>
</body>
</html>`,
          initialCss: `body { font-family: Arial; padding: 20px; background: #1a1a2e; color: #e0e0e0; }
h1 { color: #e94560; }
button { background: #e94560; color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-size: 16px; }
.user-card { background: #16213e; padding: 16px; margin: 8px 0; border-radius: 8px; border-left: 3px solid #e94560; }
.loading { color: #e94560; font-style: italic; }`,
          initialJs: `async function loadUsers() {
  const container = document.getElementById("users");
  container.innerHTML = '<p class="loading">Loading...</p>';

  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/users");
    const users = await response.json();

    container.innerHTML = users.slice(0, 5).map(user => \`
      <div class="user-card">
        <strong>\${user.name}</strong><br>
        \${user.email}
      </div>
    \`).join("");

    console.log("Loaded", users.length, "users");
  } catch (error) {
    container.innerHTML = "Error loading data";
    console.error("Fetch error:", error);
  }
}`,
          language: 'html',
          challenge: {
            instruction: 'Use fetch() with async/await to load data from https://jsonplaceholder.typicode.com/posts and display the first 3 titles.',
            initialCode: `<!DOCTYPE html>
<html>
<body>
  <h1>Posts</h1>
  <button onclick="loadPosts()">Load Posts</button>
  <div id="posts"></div>
  <script src="script.js"></script>
</body>
</html>`,
            initialJs: `// Create an async function loadPosts
// Fetch from https://jsonplaceholder.typicode.com/posts
// Display first 3 post titles`,
            validationKeywords: ['async', 'await', 'fetch'],
          },
        },
        {
          id: 'js-int-2',
          title: 'Array Methods',
          topic: 'Advanced JavaScript',
          level: 'intermediate',
          content: `# Array Methods 🧰

Modern JavaScript has powerful array methods. They're used CONSTANTLY!

## map() — Transform each item

\`\`\`javascript
const numbers = [1, 2, 3];
const doubled = numbers.map(n => n * 2); // [2, 4, 6]
\`\`\`

## filter() — Keep matching items

\`\`\`javascript
const evens = numbers.filter(n => n % 2 === 0); // [2]
\`\`\`

## reduce() — Combine into one value

\`\`\`javascript
const sum = numbers.reduce((total, n) => total + n, 0); // 6
\`\`\`

## find() — First match

\`\`\`javascript
const found = numbers.find(n => n > 1); // 2
\`\`\`

## Chaining Methods

\`\`\`javascript
const result = products
  .filter(p => p.price > 50)
  .map(p => p.name)
  .sort();
\`\`\``,
          initialCode: `<!DOCTYPE html>
<html>
<head><link rel="stylesheet" href="style.css"></head>
<body>
  <h1>Array Methods</h1>
  <div id="output"></div>
  <script src="script.js"></script>
</body>
</html>`,
          initialCss: `body { font-family: monospace; padding: 20px; background: #0d1117; color: #c9d1d9; }
h1 { color: #e94560; }
.result { background: #161b22; padding: 12px; margin: 8px 0; border-radius: 6px; border-left: 3px solid #4fc3f7; }
h3 { color: #4fc3f7; margin: 0 0 5px 0; }`,
          initialJs: `const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const doubled = numbers.map(n => n * 2);
const evens = numbers.filter(n => n % 2 === 0);
const sum = numbers.reduce((acc, n) => acc + n, 0);

const products = [
  { name: "Laptop", price: 999 },
  { name: "Phone", price: 699 },
  { name: "Tablet", price: 399 },
  { name: "Watch", price: 199 },
];
const expensive = products.filter(p => p.price > 500).map(p => p.name);

document.getElementById("output").innerHTML =
  '<div class="result"><h3>Original:</h3>' + JSON.stringify(numbers) + '</div>' +
  '<div class="result"><h3>Doubled (map):</h3>' + JSON.stringify(doubled) + '</div>' +
  '<div class="result"><h3>Evens (filter):</h3>' + JSON.stringify(evens) + '</div>' +
  '<div class="result"><h3>Sum (reduce):</h3>' + sum + '</div>' +
  '<div class="result"><h3>Expensive (>$500):</h3>' + JSON.stringify(expensive) + '</div>';

console.log("Sum:", sum);
console.log("Expensive items:", expensive);`,
          language: 'html',
          challenge: {
            instruction: 'Use map() to double an array of numbers and filter() to keep only even results.',
            initialCode: `<!DOCTYPE html>
<html><body><div id="output"></div><script src="script.js"></script></body></html>`,
            initialJs: `const numbers = [1, 2, 3, 4, 5];
// Use map to double them
// Use filter to keep evens
// Display results`,
            validationKeywords: ['.map(', '.filter(', 'console.log'],
          },
        },
        {
          id: 'js-int-3',
          title: 'Objects & Destructuring',
          topic: 'Advanced JavaScript',
          level: 'intermediate',
          content: `# Objects & Destructuring 📦

## Objects — Key-Value Pairs

\`\`\`javascript
const user = {
  name: "Alice",
  age: 28,
  skills: ["HTML", "CSS", "JS"],
};
console.log(user.name); // "Alice"
\`\`\`

## Destructuring — Unpack Values

\`\`\`javascript
const { name, age } = user;
console.log(name); // "Alice"
\`\`\`

## Spread Operator

\`\`\`javascript
const updated = { ...user, age: 29 };
const combined = [...arr1, ...arr2];
\`\`\`

## Optional Chaining

\`\`\`javascript
const city = user?.address?.city; // undefined (no error!)
\`\`\``,
          initialCode: `<!DOCTYPE html>
<html>
<head><link rel="stylesheet" href="style.css"></head>
<body>
  <h1>Objects & Destructuring</h1>
  <div id="output"></div>
  <script src="script.js"></script>
</body>
</html>`,
          initialCss: `body { font-family: monospace; padding: 20px; background: #0d1117; color: #c9d1d9; }
h1 { color: #e94560; }
.card { background: #161b22; padding: 15px; margin: 10px 0; border-radius: 8px; border-left: 3px solid #2ecc71; }
.card h3 { color: #2ecc71; margin: 0 0 8px 0; }
.skill { display: inline-block; background: #e94560; color: white; padding: 3px 8px; border-radius: 4px; margin: 2px; font-size: 12px; }`,
          initialJs: `const user = {
  name: "Alice",
  age: 28,
  role: "Developer",
  skills: ["HTML", "CSS", "JavaScript", "React"],
};

// Destructuring
const { name, age, role, skills } = user;

// Spread operator
const updatedUser = { ...user, age: 29, city: "NYC" };

document.getElementById("output").innerHTML = \`
  <div class="card">
    <h3>\${name} (\${age})</h3>
    <p>Role: \${role}</p>
    <p>Skills: \${skills.map(s => '<span class="skill">' + s + '</span>').join(" ")}</p>
  </div>
  <div class="card">
    <h3>Updated User (Spread)</h3>
    <pre>\${JSON.stringify(updatedUser, null, 2)}</pre>
  </div>
\`;

console.log("Destructured:", { name, age, role });
console.log("Updated:", updatedUser);`,
          language: 'html',
          challenge: {
            instruction: 'Create an object with name, age, and hobby properties. Use destructuring to extract them and log each one.',
            initialCode: `<!DOCTYPE html>
<html><body><script src="script.js"></script></body></html>`,
            initialJs: `// Create an object
// Destructure it
// Console.log each property`,
            validationKeywords: ['const {', 'console.log'],
          },
        },
        {
          id: 'js-int-4',
          title: 'Error Handling',
          topic: 'Advanced JavaScript',
          level: 'intermediate',
          content: `# Error Handling 🛡️

Things go wrong. Good code handles errors gracefully!

## Try/Catch

\`\`\`javascript
try {
  // Code that might fail
  const data = JSON.parse(badString);
} catch (error) {
  console.error("Something went wrong:", error.message);
} finally {
  console.log("This always runs");
}
\`\`\`

## Throwing Custom Errors

\`\`\`javascript
function divide(a, b) {
  if (b === 0) throw new Error("Cannot divide by zero!");
  return a / b;
}
\`\`\`

## Error Types
- \`TypeError\` — wrong data type
- \`ReferenceError\` — variable doesn't exist
- \`SyntaxError\` — bad syntax
- \`RangeError\` — number out of range`,
          initialCode: `<!DOCTYPE html>
<html>
<head><link rel="stylesheet" href="style.css"></head>
<body>
  <h1>Error Handling</h1>
  <div id="output"></div>
  <script src="script.js"></script>
</body>
</html>`,
          initialCss: `body { font-family: monospace; padding: 20px; background: #0d1117; color: #c9d1d9; }
h1 { color: #e94560; }
.success { background: #0d2818; border-left: 3px solid #2ecc71; padding: 12px; margin: 8px 0; border-radius: 6px; }
.error { background: #2d0a0a; border-left: 3px solid #e74c3c; padding: 12px; margin: 8px 0; border-radius: 6px; }`,
          initialJs: `const output = document.getElementById("output");
let html = "";

// Example 1: JSON parsing
try {
  const data = JSON.parse('{"name": "Alice"}');
  html += '<div class="success">✅ Parsed: ' + data.name + '</div>';
} catch (e) {
  html += '<div class="error">❌ ' + e.message + '</div>';
}

// Example 2: Bad JSON
try {
  const bad = JSON.parse("not json");
  html += '<div class="success">✅ This won\\'t show</div>';
} catch (e) {
  html += '<div class="error">❌ ' + e.message + '</div>';
}

// Example 3: Custom error
function divide(a, b) {
  if (b === 0) throw new Error("Cannot divide by zero!");
  return a / b;
}

try {
  html += '<div class="success">✅ 10 / 2 = ' + divide(10, 2) + '</div>';
  html += '<div class="success">✅ 10 / 0 = ' + divide(10, 0) + '</div>';
} catch (e) {
  html += '<div class="error">❌ ' + e.message + '</div>';
}

output.innerHTML = html;`,
          language: 'html',
          challenge: {
            instruction: 'Write a function that throws an error if the input is not a number, and wrap the call in try/catch.',
            initialCode: `<!DOCTYPE html>
<html><body><script src="script.js"></script></body></html>`,
            initialJs: `// Create a function that validates input
// Throw an error if not a number
// Wrap in try/catch`,
            validationKeywords: ['try', 'catch', 'throw', 'error'],
          },
        },
      ],
    },
    {
      id: 'react-intermediate',
      name: 'Advanced React',
      icon: '⚛️',
      lessons: [
        {
          id: 'react-int-1',
          title: 'Lists & Keys',
          topic: 'Advanced React',
          level: 'intermediate',
          content: `# Lists & Keys 📋

In React, rendering lists uses \`.map()\` and requires unique **keys**.

## Rendering a List

\`\`\`jsx
function TodoList({ items }) {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>{item.text}</li>
      ))}
    </ul>
  );
}
\`\`\`

## Why Keys?

Keys help React know WHICH items changed:
- Use unique IDs (from database, etc.)
- DON'T use array index if items can be reordered
- Keys must be unique among siblings

## Filtering & Sorting Lists

\`\`\`jsx
const filtered = items
  .filter(item => !item.done)
  .map(item => <TodoItem key={item.id} {...item} />);
\`\`\``,
          initialCode: `<!DOCTYPE html>
<html>
<head><link rel="stylesheet" href="style.css"></head>
<body>
  <div id="app"></div>
  <script src="script.js"></script>
</body>
</html>`,
          initialCss: `body { font-family: Arial; background: #282c34; color: white; padding: 20px; }
h1 { color: #61dafb; text-align: center; }
input { width: 100%; max-width: 400px; padding: 10px; border-radius: 8px; border: 2px solid #444; background: #3b3f47; color: white; font-size: 16px; }
.todo-item { display: flex; align-items: center; gap: 10px; background: #3b3f47; padding: 12px; margin: 6px 0; border-radius: 8px; }
.todo-item.done { opacity: 0.5; text-decoration: line-through; }
.todo-item button { background: #e74c3c; color: white; border: none; padding: 4px 10px; border-radius: 4px; cursor: pointer; }
.add-btn { background: #61dafb; color: #282c34; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-weight: bold; margin-left: 8px; }`,
          initialJs: `let todos = [
  { id: 1, text: "Learn HTML", done: true },
  { id: 2, text: "Learn CSS", done: true },
  { id: 3, text: "Learn JavaScript", done: false },
  { id: 4, text: "Learn React", done: false },
];
let nextId = 5;

function render() {
  document.getElementById("app").innerHTML = \`
    <h1>📋 Todo List (Lists & Keys)</h1>
    <div style="display:flex;justify-content:center;margin-bottom:20px;">
      <input type="text" id="newTodo" placeholder="Add new todo..." onkeypress="if(event.key==='Enter')addTodo()">
      <button class="add-btn" onclick="addTodo()">Add</button>
    </div>
    <div style="max-width:400px;margin:0 auto;">
      \${todos.map(todo => \`
        <div class="todo-item \${todo.done ? 'done' : ''}" data-key="\${todo.id}">
          <input type="checkbox" \${todo.done ? 'checked' : ''} onchange="toggleTodo(\${todo.id})">
          <span style="flex:1">\${todo.text}</span>
          <button onclick="deleteTodo(\${todo.id})">✕</button>
        </div>
      \`).join("")}
    </div>
    <p style="text-align:center;color:#666;margin-top:20px;">\${todos.filter(t=>!t.done).length} items remaining</p>
  \`;
}

function addTodo() {
  const input = document.getElementById("newTodo");
  if (!input.value.trim()) return;
  todos.push({ id: nextId++, text: input.value, done: false });
  render();
}

function toggleTodo(id) {
  todos = todos.map(t => t.id === id ? { ...t, done: !t.done } : t);
  render();
}

function deleteTodo(id) {
  todos = todos.filter(t => t.id !== id);
  render();
}

render();`,
          language: 'html',
          challenge: {
            instruction: 'Create a todo list where you can add items and mark them as done using an array and .map().',
            initialCode: `<!DOCTYPE html>
<html><body><div id="app"></div><script src="script.js"></script></body></html>`,
            initialJs: `// Create a todos array
// Render function using .map()
// Add and toggle functions`,
            validationKeywords: ['.map(', 'innerhtml', 'function'],
          },
        },
      ],
    },
    {
      id: 'multimedia',
      name: 'Multimedia & Embeds',
      icon: '🎬',
      lessons: [
        {
          id: 'multi-1',
          title: 'Adding Video to Websites',
          topic: 'Multimedia & Embeds',
          level: 'intermediate',
          content: `# Adding Video to Websites 🎬

The \`<video>\` element lets you embed videos directly into your web pages without plugins.

## Basic Video Element

\`\`\`html
<video width="640" height="360" controls>
  <source src="movie.mp4" type="video/mp4">
  Your browser does not support video.
</video>
\`\`\`

## Key Attributes
- **controls** — Shows play/pause, volume, fullscreen buttons
- **autoplay** — Starts playing automatically (muted required for autoplay)
- **loop** — Replays the video when it ends
- **muted** — Starts muted (required for autoplay in most browsers)
- **poster** — Shows an image before the video plays
- **preload** — \`auto\`, \`metadata\`, or \`none\`

## Responsive Video
\`\`\`css
video {
  width: 100%;
  max-width: 800px;
  height: auto;
}
\`\`\`

## Embedding YouTube Videos
\`\`\`html
<iframe width="560" height="315"
  src="https://www.youtube.com/embed/VIDEO_ID"
  frameborder="0" allowfullscreen>
</iframe>
\`\`\``,
          initialCode: `<div style="text-align: center; padding: 20px;">
  <h1>My Video Page</h1>
  <video width="400" controls poster="">
    <source src="" type="video/mp4">
    Your browser does not support video.
  </video>
  <p>Add a video with controls!</p>
</div>`,
          language: 'html',
          challenge: {
            instruction: 'Create a page with a video element that has controls, width of 500, and a poster attribute. Also add an iframe for a YouTube embed.',
            initialCode: `<div style="padding: 20px;">
  <h1>Video Gallery</h1>
  <!-- Add video element with controls, width, poster -->
  <!-- Add YouTube iframe embed -->
</div>`,
            validationKeywords: ['<video', 'controls', 'width', '<iframe'],
          },
        },
        {
          id: 'multi-2',
          title: 'Adding Audio to Websites',
          topic: 'Multimedia & Embeds',
          level: 'intermediate',
          content: `# Adding Audio to Websites 🔊

The \`<audio>\` element lets you embed sound content in your pages.

## Basic Audio Element
\`\`\`html
<audio controls>
  <source src="song.mp3" type="audio/mpeg">
  <source src="song.ogg" type="audio/ogg">
  Your browser does not support audio.
</audio>
\`\`\`

## Attributes
- **controls** — Shows play/pause, volume, progress
- **autoplay** — Starts automatically (often blocked by browsers)
- **loop** — Replays when finished
- **muted** — Starts muted
- **preload** — \`auto\`, \`metadata\`, or \`none\`

## Multiple Sources
Provide multiple formats for browser compatibility:
\`\`\`html
<audio controls>
  <source src="audio.mp3" type="audio/mpeg">
  <source src="audio.ogg" type="audio/ogg">
  <source src="audio.wav" type="audio/wav">
</audio>
\`\`\`

## JavaScript Audio Control
\`\`\`javascript
const audio = document.getElementById('myAudio');
audio.play();
audio.pause();
audio.volume = 0.5; // 0 to 1
\`\`\``,
          initialCode: `<div style="text-align: center; padding: 20px;">
  <h1>🎵 Music Player</h1>
  <audio controls>
    <source src="" type="audio/mpeg">
    Your browser does not support audio.
  </audio>
</div>`,
          language: 'html',
          challenge: {
            instruction: 'Create a page with an audio element that has controls and loop attributes. Add a title above it.',
            initialCode: `<div style="padding: 20px;">
  <h1>My Podcast Player</h1>
  <!-- Add audio element with controls and loop -->
</div>`,
            validationKeywords: ['<audio', 'controls', 'loop'],
          },
        },
        {
          id: 'multi-3',
          title: 'Canvas & SVG Graphics',
          topic: 'Multimedia & Embeds',
          level: 'intermediate',
          content: `# Canvas & SVG Graphics 🎨

## HTML Canvas
The \`<canvas>\` element lets you draw graphics with JavaScript.

\`\`\`html
<canvas id="myCanvas" width="400" height="300"></canvas>
\`\`\`

\`\`\`javascript
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

// Rectangle
ctx.fillStyle = '#e98a2e';
ctx.fillRect(50, 50, 100, 80);

// Circle
ctx.beginPath();
ctx.arc(250, 100, 40, 0, Math.PI * 2);
ctx.fillStyle = '#7c3aed';
ctx.fill();

// Text
ctx.font = '20px Arial';
ctx.fillStyle = 'white';
ctx.fillText('Hello Canvas!', 100, 200);
\`\`\`

## SVG (Scalable Vector Graphics)
SVG is XML-based and scales without losing quality:

\`\`\`html
<svg width="200" height="200">
  <circle cx="100" cy="100" r="80" fill="#e98a2e" />
  <text x="100" y="110" text-anchor="middle" fill="white" font-size="20">SVG</text>
</svg>
\`\`\`

Canvas = pixel-based (good for games, animations). SVG = vector-based (good for icons, logos, charts).`,
          initialCode: `<div style="text-align: center; padding: 20px; background: #1a1a2e; color: white;">
  <h1>Canvas Drawing</h1>
  <canvas id="myCanvas" width="400" height="200" style="border: 1px solid #333;"></canvas>
  <script>
    const canvas = document.getElementById('myCanvas');
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#e98a2e';
    ctx.fillRect(50, 50, 100, 80);
  </script>
</div>`,
          language: 'html',
          challenge: {
            instruction: 'Create a canvas element and draw a rectangle and a circle on it using JavaScript. Also add an SVG with a circle.',
            initialCode: `<div style="padding: 20px;">
  <!-- Add canvas element -->
  <!-- Draw shapes with JavaScript -->
  <!-- Add SVG circle -->
</div>`,
            validationKeywords: ['<canvas', 'getcontext', 'fillrect', '<svg'],
          },
        },
      ],
    },
    {
      id: 'forms-validation',
      name: 'Forms & Validation',
      icon: '📝',
      lessons: [
        {
          id: 'form-1',
          title: 'Advanced Forms',
          topic: 'Forms & Validation',
          level: 'intermediate',
          content: `# Advanced HTML Forms 📝

## Input Types
HTML5 provides many specialized input types:

\`\`\`html
<input type="email" placeholder="Email" required>
<input type="url" placeholder="Website URL">
<input type="tel" placeholder="Phone number">
<input type="number" min="0" max="100" step="5">
<input type="range" min="0" max="100">
<input type="color" value="#e98a2e">
<input type="date">
<input type="time">
<input type="datetime-local">
<input type="file" accept="image/*" multiple>
<input type="search" placeholder="Search...">
\`\`\`

## Form Validation Attributes
- **required** — Field must be filled
- **minlength / maxlength** — Text length limits
- **min / max** — Number range limits
- **pattern** — Regex pattern matching
- **placeholder** — Hint text

## Custom Validation with JavaScript
\`\`\`javascript
const form = document.getElementById('myForm');
form.addEventListener('submit', (e) => {
  const email = document.getElementById('email').value;
  if (!email.includes('@')) {
    e.preventDefault();
    alert('Please enter a valid email!');
  }
});
\`\`\``,
          initialCode: `<div style="padding: 20px; background: #1a1a2e; color: white; max-width: 400px; margin: auto;">
  <h1>Registration Form</h1>
  <form id="myForm">
    <label>Name:</label><br>
    <input type="text" required minlength="2" style="width:100%; padding:8px; margin:5px 0;"><br>
    <label>Email:</label><br>
    <input type="email" required style="width:100%; padding:8px; margin:5px 0;"><br>
    <label>Age:</label><br>
    <input type="number" min="13" max="120" style="width:100%; padding:8px; margin:5px 0;"><br>
    <button type="submit" style="background:#e98a2e; color:white; padding:10px 20px; border:none; cursor:pointer; margin-top:10px;">Submit</button>
  </form>
</div>`,
          language: 'html',
          challenge: {
            instruction: 'Create a contact form with name (required, min 2 chars), email (required), phone (tel type), message (textarea, required), and a submit button.',
            initialCode: `<form style="padding: 20px;">
  <h2>Contact Us</h2>
  <!-- Add name input (required, minlength 2) -->
  <!-- Add email input (required) -->
  <!-- Add phone input (type tel) -->
  <!-- Add textarea for message (required) -->
  <!-- Add submit button -->
</form>`,
            validationKeywords: ['required', 'type="email"', 'type="tel"', '<textarea', '<button'],
          },
        },
        {
          id: 'form-2',
          title: 'Password Show/Hide & Validation',
          topic: 'Forms & Validation',
          level: 'intermediate',
          content: `# Password Show/Hide & Validation 🔐

## Toggle Password Visibility
\`\`\`html
<div>
  <input type="password" id="password">
  <button onclick="togglePassword()">👁️ Show</button>
</div>
\`\`\`

\`\`\`javascript
function togglePassword() {
  const pw = document.getElementById('password');
  const btn = event.target;
  if (pw.type === 'password') {
    pw.type = 'text';
    btn.textContent = '🙈 Hide';
  } else {
    pw.type = 'password';
    btn.textContent = '👁️ Show';
  }
}
\`\`\`

## Password Strength Checker
\`\`\`javascript
function checkStrength(password) {
  let strength = 0;
  if (password.length >= 8) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;
  
  const labels = ['Weak', 'Fair', 'Good', 'Strong'];
  return labels[strength - 1] || 'Too short';
}
\`\`\`

## Confirm Password Match
\`\`\`javascript
const pw1 = document.getElementById('password');
const pw2 = document.getElementById('confirmPassword');
pw2.addEventListener('input', () => {
  if (pw1.value !== pw2.value) {
    pw2.setCustomValidity('Passwords do not match');
  } else {
    pw2.setCustomValidity('');
  }
});
\`\`\``,
          initialCode: `<!DOCTYPE html>
<html><head><style>
body { background: #1a1a2e; color: white; font-family: Arial; padding: 20px; }
input { padding: 8px; width: 200px; margin: 5px; }
button { padding: 8px 12px; cursor: pointer; background: #e98a2e; color: white; border: none; }
</style></head><body>
  <h1>Login Form</h1>
  <input type="password" id="pw" placeholder="Password">
  <button onclick="toggle()">👁️ Show</button>
  <script>
    function toggle() {
      const pw = document.getElementById('pw');
      pw.type = pw.type === 'password' ? 'text' : 'password';
    }
  </script>
</body></html>`,
          language: 'html',
          challenge: {
            instruction: 'Create a login form with email, password with show/hide toggle, and a password strength indicator that updates as you type.',
            initialCode: `<!DOCTYPE html>
<html><body>
  <h2>Login</h2>
  <!-- Email input -->
  <!-- Password input with show/hide button -->
  <!-- Password strength indicator -->
  <script>
    // togglePassword function
    // checkStrength function
  </script>
</body></html>`,
            validationKeywords: ['type="password"', 'toggle', 'strength', 'function'],
          },
        },
      ],
    },
    {
      id: 'accessibility-seo',
      name: 'Accessibility & SEO',
      icon: '♿',
      lessons: [
        {
          id: 'a11y-1',
          title: 'Web Accessibility Basics',
          topic: 'Accessibility & SEO',
          level: 'intermediate',
          content: `# Web Accessibility (a11y) ♿

Accessibility ensures everyone can use your website, including people with disabilities.

## Semantic HTML
Use proper elements instead of generic divs:
\`\`\`html
<!-- Bad -->
<div class="header">...</div>
<div class="nav">...</div>

<!-- Good -->
<header>...</header>
<nav>...</nav>
<main>...</main>
<footer>...</footer>
<article>...</article>
<section>...</section>
\`\`\`

## ARIA Attributes
\`\`\`html
<button aria-label="Close menu">✕</button>
<div role="alert">Error: Invalid email</div>
<img src="photo.jpg" alt="A sunset over the ocean">
<nav aria-label="Main navigation">...</nav>
\`\`\`

## Key Rules
1. **Always add alt text** to images
2. **Use proper heading hierarchy** (h1 → h2 → h3)
3. **Ensure color contrast** (4.5:1 ratio for text)
4. **Make everything keyboard navigable** (Tab, Enter, Escape)
5. **Use labels for form inputs**
\`\`\`html
<label for="email">Email:</label>
<input id="email" type="email">
\`\`\`

## SEO Basics
\`\`\`html
<head>
  <title>My Website - Best Coding Platform</title>
  <meta name="description" content="Learn coding for free">
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
\`\`\``,
          initialCode: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Accessible Page</title>
</head>
<body style="font-family: Arial; padding: 20px; background: #1a1a2e; color: white;">
  <header>
    <h1>My Accessible Website</h1>
    <nav aria-label="Main navigation">
      <a href="#home">Home</a> |
      <a href="#about">About</a>
    </nav>
  </header>
  <main>
    <article>
      <h2>Welcome</h2>
      <p>This page follows accessibility best practices.</p>
      <img src="" alt="A descriptive alt text for the image">
    </article>
  </main>
  <footer>
    <p>&copy; 2024 My Website</p>
  </footer>
</body>
</html>`,
          language: 'html',
          challenge: {
            instruction: 'Create a page using semantic HTML (header, nav, main, article, footer). Add proper alt text to an image, aria-label to a button, and label elements for form inputs.',
            initialCode: `<!DOCTYPE html>
<html lang="en">
<body>
  <!-- Use semantic HTML elements -->
  <!-- Add nav with aria-label -->
  <!-- Add image with alt text -->
  <!-- Add form with labels -->
  <!-- Add footer -->
</body>
</html>`,
            validationKeywords: ['<header', '<nav', '<main', '<footer', 'alt=', 'aria-label', '<label'],
          },
        },
      ],
    },
  ],
};

const expertLessons: LevelData = {
  level: 'expert',
  label: 'Expert',
  topics: [
    {
      id: 'js-expert',
      name: 'Expert JavaScript',
      icon: '⚡',
      lessons: [
        {
          id: 'js-exp-1',
          title: 'Design Patterns',
          topic: 'Expert JavaScript',
          level: 'expert',
          content: `# Design Patterns 🏗️

Patterns are proven solutions to common problems.

## Module Pattern — Encapsulation

\`\`\`javascript
const Counter = (() => {
  let count = 0; // private
  return {
    increment: () => ++count,
    getCount: () => count,
  };
})();
\`\`\`

## Observer Pattern — Events

\`\`\`javascript
class EventEmitter {
  constructor() { this.events = {}; }
  on(event, fn) { (this.events[event] ||= []).push(fn); }
  emit(event, data) { this.events[event]?.forEach(fn => fn(data)); }
}
\`\`\`

## Factory Pattern — Object Creation

\`\`\`javascript
function createUser(name, role) {
  return { name, role, id: Date.now() };
}
\`\`\`

## Singleton Pattern — One Instance

\`\`\`javascript
class Database {
  static instance = null;
  static getInstance() {
    if (!Database.instance) Database.instance = new Database();
    return Database.instance;
  }
}
\`\`\``,
          initialCode: `<!DOCTYPE html>
<html>
<head><link rel="stylesheet" href="style.css"></head>
<body>
  <h1>Design Patterns</h1>
  <div id="output"></div>
  <script src="script.js"></script>
</body>
</html>`,
          initialCss: `body { font-family: monospace; padding: 20px; background: #0d1117; color: #c9d1d9; }
h1 { color: #e94560; }
.pattern { background: #161b22; padding: 16px; margin: 12px 0; border-radius: 8px; border: 1px solid #30363d; }
h3 { color: #58a6ff; margin: 0 0 8px 0; }
.output { color: #7ee787; }`,
          initialJs: `// Module Pattern
const Counter = (() => {
  let count = 0;
  return {
    increment: () => ++count,
    decrement: () => --count,
    getCount: () => count,
  };
})();

Counter.increment();
Counter.increment();
Counter.increment();

// Observer Pattern
class EventEmitter {
  constructor() { this.events = {}; }
  on(event, fn) { (this.events[event] = this.events[event] || []).push(fn); }
  emit(event, data) { (this.events[event] || []).forEach(fn => fn(data)); }
}

const emitter = new EventEmitter();
let messages = [];
emitter.on("message", msg => messages.push(msg));
emitter.emit("message", "Hello Observer!");
emitter.emit("message", "Pattern works!");

document.getElementById("output").innerHTML =
  '<div class="pattern"><h3>Module Pattern</h3><p class="output">Counter: ' + Counter.getCount() + '</p></div>' +
  '<div class="pattern"><h3>Observer Pattern</h3><p class="output">Messages: ' + JSON.stringify(messages) + '</p></div>';

console.log("Count:", Counter.getCount());
console.log("Messages:", messages);`,
          language: 'html',
          challenge: {
            instruction: 'Implement the Module Pattern: create a module with private data and public methods to interact with it.',
            initialCode: `<!DOCTYPE html>
<html><body><script src="script.js"></script></body></html>`,
            initialJs: `// Create a Module Pattern with private state
// and public methods`,
            validationKeywords: ['const', 'return', 'function'],
          },
        },
        {
          id: 'js-exp-2',
          title: 'Closures & Scope',
          topic: 'Expert JavaScript',
          level: 'expert',
          content: `# Closures & Scope 🔒

A closure is a function that remembers variables from its outer scope even after the outer function has returned.

## Basic Closure

\`\`\`javascript
function makeCounter() {
  let count = 0;
  return function() {
    count++;
    return count;
  };
}

const counter = makeCounter();
counter(); // 1
counter(); // 2
\`\`\`

## Practical Uses

**1. Data Privacy:**
\`\`\`javascript
function createWallet(initial) {
  let balance = initial;
  return {
    deposit: (amount) => balance += amount,
    getBalance: () => balance,
  };
}
\`\`\`

**2. Function Factories:**
\`\`\`javascript
function multiplier(factor) {
  return (n) => n * factor;
}
const double = multiplier(2);
double(5); // 10
\`\`\`

## Scope Chain

JavaScript looks for variables: local → outer → outer → ... → global`,
          initialCode: `<!DOCTYPE html>
<html>
<head><link rel="stylesheet" href="style.css"></head>
<body>
  <h1>Closures & Scope</h1>
  <div id="output"></div>
  <script src="script.js"></script>
</body>
</html>`,
          initialCss: `body { font-family: monospace; padding: 20px; background: #0d1117; color: #c9d1d9; }
h1 { color: #e94560; }
.demo { background: #161b22; padding: 15px; margin: 10px 0; border-radius: 8px; border-left: 3px solid #58a6ff; }
.demo h3 { color: #58a6ff; margin: 0 0 8px 0; }
.value { color: #7ee787; font-weight: bold; }`,
          initialJs: `// Closure: Counter
function makeCounter() {
  let count = 0;
  return {
    increment: () => ++count,
    getCount: () => count,
  };
}

const counter = makeCounter();
counter.increment();
counter.increment();
counter.increment();

// Closure: Wallet
function createWallet(initial) {
  let balance = initial;
  return {
    deposit: (amt) => { balance += amt; return balance; },
    withdraw: (amt) => { balance -= amt; return balance; },
    getBalance: () => balance,
  };
}

const wallet = createWallet(100);
wallet.deposit(50);
wallet.withdraw(30);

// Function Factory
function multiplier(factor) {
  return (n) => n * factor;
}
const double = multiplier(2);
const triple = multiplier(3);

document.getElementById("output").innerHTML = \`
  <div class="demo"><h3>Counter Closure</h3>Count: <span class="value">\${counter.getCount()}</span></div>
  <div class="demo"><h3>Wallet Closure</h3>Balance: <span class="value">$\${wallet.getBalance()}</span></div>
  <div class="demo"><h3>Function Factory</h3>
    double(5) = <span class="value">\${double(5)}</span>,
    triple(5) = <span class="value">\${triple(5)}</span>
  </div>
\`;`,
          language: 'html',
          challenge: {
            instruction: 'Create a closure-based counter with increment, decrement, and getCount methods.',
            initialCode: `<!DOCTYPE html>
<html><body><script src="script.js"></script></body></html>`,
            initialJs: `// Create makeCounter function using closures`,
            validationKeywords: ['function', 'return', 'let'],
          },
        },
        {
          id: 'js-exp-3',
          title: 'Promises & Async Patterns',
          topic: 'Expert JavaScript',
          level: 'expert',
          content: `# Advanced Async Patterns ⚡

## Promise.all — Run in Parallel

\`\`\`javascript
const [users, posts] = await Promise.all([
  fetch("/users").then(r => r.json()),
  fetch("/posts").then(r => r.json()),
]);
\`\`\`

## Promise.race — First to Finish

\`\`\`javascript
const result = await Promise.race([
  fetch(url),
  timeout(5000),
]);
\`\`\`

## Promise.allSettled — All Complete

\`\`\`javascript
const results = await Promise.allSettled([p1, p2, p3]);
results.forEach(r => {
  if (r.status === "fulfilled") console.log(r.value);
  else console.log("Failed:", r.reason);
});
\`\`\`

## Debounce Pattern

\`\`\`javascript
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
\`\`\``,
          initialCode: `<!DOCTYPE html>
<html>
<head><link rel="stylesheet" href="style.css"></head>
<body>
  <h1>Async Patterns</h1>
  <button onclick="runAll()">Promise.all</button>
  <button onclick="runRace()">Promise.race</button>
  <div id="output"></div>
  <script src="script.js"></script>
</body>
</html>`,
          initialCss: `body { font-family: monospace; padding: 20px; background: #0d1117; color: #c9d1d9; text-align: center; }
h1 { color: #e94560; }
button { background: #e94560; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; margin: 5px; font-size: 14px; }
#output { text-align: left; max-width: 500px; margin: 20px auto; }
.result { background: #161b22; padding: 12px; margin: 8px 0; border-radius: 6px; border-left: 3px solid #58a6ff; }`,
          initialJs: `const output = document.getElementById("output");

async function runAll() {
  output.innerHTML = '<p style="color:#e94560">Loading all...</p>';
  const start = Date.now();

  const [users, posts] = await Promise.all([
    fetch("https://jsonplaceholder.typicode.com/users").then(r => r.json()),
    fetch("https://jsonplaceholder.typicode.com/posts").then(r => r.json()),
  ]);

  const time = Date.now() - start;
  output.innerHTML = \`
    <div class="result">✅ Users: \${users.length} loaded</div>
    <div class="result">✅ Posts: \${posts.length} loaded</div>
    <div class="result">⏱️ Total time: \${time}ms (parallel!)</div>
  \`;
  console.log("Promise.all completed in", time, "ms");
}

async function runRace() {
  output.innerHTML = '<p style="color:#e94560">Racing...</p>';

  const fast = new Promise(resolve => setTimeout(() => resolve("Fast wins! 🏆"), 100));
  const slow = new Promise(resolve => setTimeout(() => resolve("Slow... 🐢"), 2000));

  const winner = await Promise.race([fast, slow]);
  output.innerHTML = '<div class="result">🏁 Winner: ' + winner + '</div>';
  console.log("Race winner:", winner);
}`,
          language: 'html',
          challenge: {
            instruction: 'Use Promise.all to fetch from two different endpoints simultaneously.',
            initialCode: `<!DOCTYPE html>
<html><body><button onclick="loadBoth()">Load Both</button><div id="result"></div><script src="script.js"></script></body></html>`,
            initialJs: `// Use Promise.all to fetch users and posts simultaneously`,
            validationKeywords: ['promise.all', 'await', 'fetch'],
          },
        },
      ],
    },
    {
      id: 'css-expert',
      name: 'Expert CSS',
      icon: '🎨',
      lessons: [
        {
          id: 'css-exp-1',
          title: 'Advanced Animations & 3D',
          topic: 'Expert CSS',
          level: 'expert',
          content: `# Advanced Animations & 3D 🎭

## 3D Transforms

\`\`\`css
.scene { perspective: 1000px; }
.card {
  transform-style: preserve-3d;
  transition: transform 0.6s;
}
.card:hover { transform: rotateY(180deg); }
\`\`\`

## Multi-Step Animations

\`\`\`css
@keyframes complex {
  0% { transform: scale(1); background: red; }
  25% { transform: scale(1.2); background: blue; }
  50% { transform: scale(1) rotate(180deg); }
  100% { transform: scale(1) rotate(360deg); }
}
\`\`\`

## Performance Tips

- Use \`transform\` and \`opacity\` for animations (GPU-accelerated!)
- Avoid animating \`width\`, \`height\`, \`top\`, \`left\` (slow!)
- Use \`will-change\` sparingly for hints`,
          initialCode: `<!DOCTYPE html>
<html>
<head><link rel="stylesheet" href="style.css"></head>
<body>
  <div class="scene">
    <div class="card-3d"><div class="card-face front">🎯 Front</div><div class="card-face back">✨ Back</div></div>
    <div class="card-3d"><div class="card-face front">🚀 Front</div><div class="card-face back">💫 Back</div></div>
    <div class="card-3d"><div class="card-face front">🎨 Front</div><div class="card-face back">🌟 Back</div></div>
  </div>
</body>
</html>`,
          initialCss: `body { background: #0f0f23; color: white; font-family: Arial; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; perspective: 1000px; }
.scene { display: flex; gap: 30px; }
.card-3d {
  width: 150px; height: 200px; position: relative; transform-style: preserve-3d;
  transition: transform 0.6s; cursor: pointer;
}
.card-3d:hover { transform: rotateY(180deg); }
.card-face {
  position: absolute; width: 100%; height: 100%; backface-visibility: hidden;
  display: flex; align-items: center; justify-content: center;
  border-radius: 12px; font-size: 20px; font-weight: bold;
}
.front { background: linear-gradient(135deg, #667eea, #764ba2); }
.back { background: linear-gradient(135deg, #f093fb, #f5576c); transform: rotateY(180deg); }
@keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
.card-3d { animation: float 3s ease-in-out infinite; }
.card-3d:nth-child(2) { animation-delay: 0.5s; }
.card-3d:nth-child(3) { animation-delay: 1s; }`,
          language: 'html',
          challenge: {
            instruction: 'Create a 3D card flip effect using CSS transform: rotateY, perspective, and backface-visibility.',
            initialCode: `<!DOCTYPE html>
<html><head><link rel="stylesheet" href="style.css"></head>
<body><div class="card"><div class="front">Front</div><div class="back">Back</div></div></body></html>`,
            initialCss: `/* Create 3D card flip with perspective and rotateY */`,
            validationKeywords: ['perspective', 'rotatey', 'backface-visibility'],
          },
        },
        {
          id: 'css-exp-2',
          title: 'CSS Architecture',
          topic: 'Expert CSS',
          level: 'expert',
          content: `# CSS Architecture — Scalable CSS 📐

## BEM Naming Convention

**Block__Element--Modifier**

\`\`\`css
.card { }              /* Block */
.card__title { }       /* Element */
.card__title--large { } /* Modifier */
.card--featured { }    /* Block modifier */
\`\`\`

\`\`\`html
<div class="card card--featured">
  <h2 class="card__title card__title--large">Title</h2>
  <p class="card__body">Content</p>
</div>
\`\`\`

## Utility Classes

Small, single-purpose classes:
\`\`\`css
.text-center { text-align: center; }
.mt-4 { margin-top: 16px; }
.flex { display: flex; }
.gap-2 { gap: 8px; }
\`\`\`

## CSS Custom Properties for Theming

\`\`\`css
[data-theme="dark"] {
  --bg: #0d1117;
  --text: #c9d1d9;
}
[data-theme="light"] {
  --bg: #ffffff;
  --text: #24292f;
}
\`\`\``,
          initialCode: `<!DOCTYPE html>
<html>
<head><link rel="stylesheet" href="style.css"></head>
<body data-theme="dark">
  <button class="theme-toggle" onclick="toggleTheme()">Toggle Theme</button>
  <div class="card-grid">
    <div class="card card--featured">
      <h3 class="card__title">Featured Post</h3>
      <p class="card__body">BEM naming makes CSS scalable and maintainable.</p>
      <span class="card__tag">CSS</span>
    </div>
    <div class="card">
      <h3 class="card__title">Regular Post</h3>
      <p class="card__body">Utility classes + BEM = powerful combo!</p>
      <span class="card__tag">Architecture</span>
    </div>
  </div>
  <script src="script.js"></script>
</body>
</html>`,
          initialCss: `[data-theme="dark"] {
  --bg: #0d1117; --surface: #161b22; --text: #c9d1d9;
  --primary: #e94560; --border: #30363d;
}
[data-theme="light"] {
  --bg: #f6f8fa; --surface: #ffffff; --text: #24292f;
  --primary: #e94560; --border: #d0d7de;
}

body { background: var(--bg); color: var(--text); font-family: Arial; padding: 20px; transition: all 0.3s; margin: 0; }

.theme-toggle { background: var(--primary); color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; margin-bottom: 20px; }

.card-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 16px; }

.card { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 20px; }
.card--featured { border-left: 4px solid var(--primary); }
.card__title { color: var(--primary); margin-top: 0; }
.card__body { line-height: 1.6; }
.card__tag { display: inline-block; background: var(--primary); color: white; padding: 2px 8px; border-radius: 4px; font-size: 12px; }`,
          initialJs: `function toggleTheme() {
  const body = document.body;
  const current = body.getAttribute("data-theme");
  body.setAttribute("data-theme", current === "dark" ? "light" : "dark");
  console.log("Theme:", body.getAttribute("data-theme"));
}`,
          language: 'html',
          challenge: {
            instruction: 'Create a card using BEM naming (.card, .card__title, .card__body, .card--featured) and add dark/light theme toggling with CSS variables.',
            initialCode: `<!DOCTYPE html>
<html><head><link rel="stylesheet" href="style.css"></head>
<body data-theme="dark">
  <button onclick="toggleTheme()">Toggle</button>
  <div class="card card--featured">
    <h3 class="card__title">BEM Card</h3>
    <p class="card__body">Content</p>
  </div>
  <script src="script.js"></script>
</body></html>`,
            initialCss: `/* Define theme variables and BEM styles */`,
            initialJs: `function toggleTheme() {
  // Toggle data-theme attribute
}`,
            validationKeywords: ['card__', 'card--', '--bg', 'var('],
          },
        },
      ],
    },
    {
      id: 'react-expert',
      name: 'Expert React',
      icon: '⚛️',
      lessons: [
        {
          id: 'react-exp-1',
          title: 'State Management',
          topic: 'Expert React',
          level: 'expert',
          content: `# State Management Patterns 🧠

## Local State vs Global State

**Local:** Button click counter → \`useState\`
**Global:** User auth, theme, cart → Context/Store

## The Store Pattern

\`\`\`javascript
const store = {
  state: { count: 0, todos: [] },
  listeners: [],
  subscribe(fn) { this.listeners.push(fn); },
  dispatch(action) {
    this.state = reducer(this.state, action);
    this.listeners.forEach(fn => fn(this.state));
  }
};
\`\`\`

## Reducer Pattern (like Redux)

\`\`\`javascript
function reducer(state, action) {
  switch (action.type) {
    case "ADD_TODO":
      return { ...state, todos: [...state.todos, action.payload] };
    case "TOGGLE":
      return { ...state, todos: state.todos.map(t =>
        t.id === action.payload ? { ...t, done: !t.done } : t
      )};
    default: return state;
  }
}
\`\`\`

## React Context API

\`\`\`jsx
const ThemeContext = createContext('light');
// Provider wraps the app
// useContext(ThemeContext) reads the value
\`\`\``,
          initialCode: `<!DOCTYPE html>
<html>
<head><link rel="stylesheet" href="style.css"></head>
<body>
  <div id="app"></div>
  <script src="script.js"></script>
</body>
</html>`,
          initialCss: `body { font-family: monospace; background: #0d1117; color: #c9d1d9; padding: 20px; }
h1 { color: #61dafb; text-align: center; }
.store-view { background: #161b22; padding: 15px; border-radius: 8px; margin: 10px 0; border: 1px solid #30363d; }
.store-view h3 { color: #58a6ff; margin: 0 0 8px 0; }
button { background: #238636; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; margin: 3px; }
button.danger { background: #da3633; }
.todo { display: flex; gap: 8px; align-items: center; padding: 6px 0; }
.todo.done { opacity: 0.5; text-decoration: line-through; }
input { padding: 8px; border-radius: 6px; border: 1px solid #30363d; background: #0d1117; color: #c9d1d9; }`,
          initialJs: `// Simple Store Pattern (Redux-like)
function createStore(reducer, initialState) {
  let state = initialState;
  const listeners = [];
  return {
    getState: () => state,
    dispatch: (action) => {
      state = reducer(state, action);
      listeners.forEach(fn => fn(state));
    },
    subscribe: (fn) => listeners.push(fn),
  };
}

function reducer(state, action) {
  switch (action.type) {
    case "ADD_TODO":
      return { ...state, todos: [...state.todos, { id: Date.now(), text: action.payload, done: false }] };
    case "TOGGLE":
      return { ...state, todos: state.todos.map(t => t.id === action.payload ? { ...t, done: !t.done } : t) };
    case "DELETE":
      return { ...state, todos: state.todos.filter(t => t.id !== action.payload) };
    default: return state;
  }
}

const store = createStore(reducer, { todos: [
  { id: 1, text: "Learn State Management", done: false },
  { id: 2, text: "Build a Store", done: false },
] });

function render() {
  const { todos } = store.getState();
  document.getElementById("app").innerHTML = \`
    <h1>🧠 State Management</h1>
    <div class="store-view">
      <h3>Store State</h3>
      <pre>\${JSON.stringify(store.getState(), null, 2)}</pre>
    </div>
    <div style="display:flex;gap:8px;margin:10px 0;">
      <input id="newTodo" placeholder="New todo..." onkeypress="if(event.key==='Enter')addTodo()">
      <button onclick="addTodo()">Dispatch ADD</button>
    </div>
    \${todos.map(t => \`
      <div class="todo \${t.done ? 'done' : ''}">
        <input type="checkbox" \${t.done ? 'checked' : ''} onchange="store.dispatch({type:'TOGGLE',payload:\${t.id}})">
        <span style="flex:1">\${t.text}</span>
        <button class="danger" onclick="store.dispatch({type:'DELETE',payload:\${t.id}})">✕</button>
      </div>
    \`).join("")}
  \`;
}

function addTodo() {
  const input = document.getElementById("newTodo");
  if (input.value.trim()) {
    store.dispatch({ type: "ADD_TODO", payload: input.value });
  }
}

store.subscribe(render);
render();`,
          language: 'html',
          challenge: {
            instruction: 'Create a simple store with a reducer that handles ADD and REMOVE actions for a list of items.',
            initialCode: `<!DOCTYPE html>
<html><body><div id="app"></div><script src="script.js"></script></body></html>`,
            initialJs: `// Create a store with reducer pattern
// Handle ADD and REMOVE actions`,
            validationKeywords: ['reducer', 'dispatch', 'switch', 'case'],
          },
        },
      ],
    },
    {
      id: 'pro-projects',
      name: 'Pro Projects',
      icon: '🚀',
      lessons: [
        {
          id: 'pro-1',
          title: 'Build a Login Page',
          topic: 'Pro Projects',
          level: 'expert',
          content: `# Build a Beautiful Login Page 🔐

Now let's build something real — a professional login page!

## What Makes a Good Login Page?

- Clean, centered design
- Proper form with email and password
- Show/hide password toggle
- Responsive design
- Good visual feedback

## The Structure

\`\`\`html
<div class="login-container">
  <form class="login-form">
    <h1>Welcome Back</h1>
    <input type="email" placeholder="Email">
    <div class="password-field">
      <input type="password" id="password">
      <button type="button" onclick="togglePassword()">👁</button>
    </div>
    <button type="submit">Sign In</button>
  </form>
</div>
\`\`\`

## Password Show/Hide

\`\`\`javascript
function togglePassword() {
  const pw = document.getElementById("password");
  pw.type = pw.type === "password" ? "text" : "password";
}
\`\`\`

This is a very common feature in real apps!`,
          initialCode: `<!DOCTYPE html>
<html>
<head><link rel="stylesheet" href="style.css"></head>
<body>
  <div class="login-container">
    <form class="login-form">
      <h1>🔐 Welcome Back</h1>
      <p>Sign in to your account</p>
      <input type="email" placeholder="Email address" required>
      <div class="password-field">
        <input type="password" id="password" placeholder="Password" required>
        <button type="button" onclick="togglePassword()">👁</button>
      </div>
      <button type="submit" class="btn-primary">Sign In</button>
      <p class="link">Don't have an account? <a href="#">Sign Up</a></p>
    </form>
  </div>
  <script src="script.js"></script>
</body>
</html>`,
          initialCss: `* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: Arial; background: linear-gradient(135deg, #0f0c29, #302b63, #24243e); min-height: 100vh; display: flex; align-items: center; justify-content: center; }
.login-container { width: 100%; max-width: 400px; padding: 20px; }
.login-form { background: rgba(255,255,255,0.05); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; padding: 40px; }
h1 { color: white; font-size: 24px; margin-bottom: 8px; }
.login-form > p { color: #888; font-size: 14px; margin-bottom: 24px; }
input { width: 100%; padding: 14px; border: 1px solid rgba(255,255,255,0.15); border-radius: 10px; background: rgba(255,255,255,0.05); color: white; font-size: 14px; margin-bottom: 16px; outline: none; }
input:focus { border-color: #e94560; }
.password-field { position: relative; }
.password-field button { position: absolute; right: 12px; top: 14px; background: none; border: none; cursor: pointer; font-size: 18px; }
.btn-primary { width: 100%; padding: 14px; background: linear-gradient(135deg, #e94560, #c0392b); color: white; border: none; border-radius: 10px; font-size: 16px; font-weight: bold; cursor: pointer; margin-top: 8px; }
.btn-primary:hover { opacity: 0.9; }
.link { text-align: center; margin-top: 20px; color: #888; font-size: 13px; }
.link a { color: #e94560; text-decoration: none; }`,
          initialJs: `function togglePassword() {
  const pw = document.getElementById("password");
  if (pw.type === "password") {
    pw.type = "text";
  } else {
    pw.type = "password";
  }
}`,
          language: 'html',
          challenge: {
            instruction: 'Build a login form with email input, password input with show/hide toggle, and a submit button. Add the togglePassword function.',
            initialCode: `<!DOCTYPE html>
<html>
<head><link rel="stylesheet" href="style.css"></head>
<body>
  <!-- Build a login form with password toggle -->
  <script src="script.js"></script>
</body>
</html>`,
            initialCss: `body { font-family: Arial; background: #1a1a2e; color: white; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; }`,
            initialJs: `// Create togglePassword function`,
            validationKeywords: ['type="password"', 'type="email"', 'togglepassword', 'type'],
          },
        },
        {
          id: 'pro-2',
          title: 'Animated Card Gallery',
          topic: 'Pro Projects',
          level: 'expert',
          content: `# Animated Card Gallery with Hover Effects ✨

Let's build a professional card gallery with smooth animations!

## CSS Transitions

\`\`\`css
.card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0,0,0,0.3);
}
\`\`\`

## CSS Animations

\`\`\`css
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.card { animation: fadeIn 0.5s ease forwards; }
\`\`\`

## Animation Delay for Staggered Effect

\`\`\`css
.card:nth-child(1) { animation-delay: 0.1s; }
.card:nth-child(2) { animation-delay: 0.2s; }
.card:nth-child(3) { animation-delay: 0.3s; }
\`\`\``,
          initialCode: `<!DOCTYPE html>
<html>
<head><link rel="stylesheet" href="style.css"></head>
<body>
  <h1>Project Showcase</h1>
  <div class="gallery">
    <div class="card">
      <img src="https://picsum.photos/300/200?random=1" alt="Project 1">
      <h3>Web App</h3>
      <p>A modern web application</p>
      <span class="tag">HTML/CSS</span>
    </div>
    <div class="card">
      <img src="https://picsum.photos/300/200?random=2" alt="Project 2">
      <h3>Dashboard</h3>
      <p>Analytics dashboard</p>
      <span class="tag">JavaScript</span>
    </div>
    <div class="card">
      <img src="https://picsum.photos/300/200?random=3" alt="Project 3">
      <h3>Mobile App</h3>
      <p>Cross-platform mobile app</p>
      <span class="tag">React</span>
    </div>
  </div>
</body>
</html>`,
          initialCss: `* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: Arial; background: #0f0f1a; color: white; padding: 40px; }
h1 { text-align: center; color: #e94560; margin-bottom: 30px; font-size: 28px; }
.gallery { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; max-width: 1000px; margin: 0 auto; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
.card { background: #16213e; border-radius: 16px; overflow: hidden; animation: fadeIn 0.6s ease forwards; opacity: 0; transition: transform 0.3s ease, box-shadow 0.3s ease; cursor: pointer; }
.card:nth-child(1) { animation-delay: 0.1s; }
.card:nth-child(2) { animation-delay: 0.3s; }
.card:nth-child(3) { animation-delay: 0.5s; }
.card:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(233,69,96,0.2); }
.card img { width: 100%; height: 180px; object-fit: cover; }
.card h3 { padding: 16px 16px 4px; color: white; }
.card p { padding: 0 16px; color: #888; font-size: 14px; }
.tag { display: inline-block; margin: 12px 16px 16px; padding: 4px 12px; background: rgba(233,69,96,0.2); color: #e94560; border-radius: 20px; font-size: 12px; }`,
          language: 'html',
          challenge: {
            instruction: 'Create a card gallery with at least 3 cards, each with hover effects using CSS transitions and a fadeIn animation.',
            initialCode: `<!DOCTYPE html>
<html><head><link rel="stylesheet" href="style.css"></head>
<body>
  <!-- Build an animated card gallery -->
</body>
</html>`,
            initialCss: `body { font-family: Arial; background: #0f0f1a; color: white; padding: 40px; }`,
            validationKeywords: ['class="card"', 'transition', '@keyframes', 'hover'],
          },
        },
        {
          id: 'pro-3',
          title: 'Dark/Light Theme Toggle',
          topic: 'Pro Projects',
          level: 'expert',
          content: `# Dark/Light Theme Toggle 🌓

Let's build a theme switcher — a must-have feature for modern websites!

## The Strategy

1. Define CSS variables for both themes
2. Toggle a class on the body
3. Save preference in localStorage

## CSS Variables for Themes

\`\`\`css
:root {
  --bg: #1a1a2e;
  --text: #e0e0e0;
  --card: #16213e;
}
body.light {
  --bg: #f5f5f5;
  --text: #333;
  --card: #ffffff;
}
\`\`\`

## Toggle with JavaScript

\`\`\`javascript
function toggleTheme() {
  document.body.classList.toggle('light');
  const theme = document.body.classList.contains('light') ? 'light' : 'dark';
  localStorage.setItem('theme', theme);
}

// Load saved theme
if (localStorage.getItem('theme') === 'light') {
  document.body.classList.add('light');
}
\`\`\``,
          initialCode: `<!DOCTYPE html>
<html>
<head><link rel="stylesheet" href="style.css"></head>
<body>
  <header>
    <h1>My Website</h1>
    <button onclick="toggleTheme()" id="themeBtn">🌙 Dark</button>
  </header>
  <main>
    <div class="card">
      <h2>Welcome!</h2>
      <p>Click the theme button to switch between dark and light mode.</p>
    </div>
    <div class="card">
      <h2>It Saves!</h2>
      <p>Your preference is saved using localStorage.</p>
    </div>
  </main>
  <script src="script.js"></script>
</body>
</html>`,
          initialCss: `:root { --bg: #1a1a2e; --text: #e0e0e0; --card: #16213e; --accent: #e94560; }
body.light { --bg: #f0f2f5; --text: #333; --card: #ffffff; --accent: #e94560; }
* { box-sizing: border-box; margin: 0; padding: 0; transition: background-color 0.3s, color 0.3s; }
body { font-family: Arial; background: var(--bg); color: var(--text); min-height: 100vh; }
header { display: flex; justify-content: space-between; align-items: center; padding: 20px 30px; border-bottom: 1px solid rgba(128,128,128,0.2); }
h1 { color: var(--accent); font-size: 22px; }
#themeBtn { background: var(--card); color: var(--text); border: 1px solid rgba(128,128,128,0.3); padding: 8px 16px; border-radius: 8px; cursor: pointer; font-size: 14px; }
main { padding: 30px; display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; max-width: 800px; margin: 0 auto; }
.card { background: var(--card); padding: 24px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
.card h2 { color: var(--accent); margin-bottom: 8px; }
.card p { line-height: 1.6; opacity: 0.8; }`,
          initialJs: `function toggleTheme() {
  document.body.classList.toggle('light');
  const btn = document.getElementById('themeBtn');
  if (document.body.classList.contains('light')) {
    btn.textContent = '☀️ Light';
    localStorage.setItem('theme', 'light');
  } else {
    btn.textContent = '🌙 Dark';
    localStorage.setItem('theme', 'dark');
  }
}

// Load saved theme
if (localStorage.getItem('theme') === 'light') {
  document.body.classList.add('light');
  document.getElementById('themeBtn').textContent = '☀️ Light';
}`,
          language: 'html',
          challenge: {
            instruction: 'Create a theme toggle using CSS variables and JavaScript. Store the preference in localStorage.',
            initialCode: `<!DOCTYPE html>
<html><head><link rel="stylesheet" href="style.css"></head>
<body>
  <button onclick="toggleTheme()">Toggle Theme</button>
  <h1>Theme Test</h1>
  <script src="script.js"></script>
</body>
</html>`,
            initialCss: `:root { --bg: #1a1a2e; --text: white; }
body { background: var(--bg); color: var(--text); font-family: Arial; padding: 20px; }`,
            initialJs: `// Create toggleTheme function with localStorage`,
            validationKeywords: ['classlist', 'localstorage', 'toggle', '--bg'],
          },
        },
      ],
    },
    {
      id: 'real-projects',
      name: 'Real-World Projects',
      icon: '🏗️',
      lessons: [
        {
          id: 'proj-1',
          title: 'Build a Login Page',
          topic: 'Real-World Projects',
          level: 'expert',
          content: `# Build a Professional Login Page 🔐\n\nPut everything together: glassmorphism design, password show/hide, form validation, responsive layout.\n\n## Key Techniques\n- \`backdrop-filter: blur(10px)\` for glass effect\n- Toggle \`input.type\` between "password" and "text"\n- \`form.addEventListener('submit', ...)\` for validation\n- CSS \`linear-gradient\` backgrounds`,
          initialCode: `<!DOCTYPE html>\n<html><head><link rel="stylesheet" href="style.css"></head>\n<body>\n  <div class="container">\n    <div class="login-card">\n      <h1>🔐 Welcome Back</h1>\n      <form id="loginForm">\n        <input type="email" id="email" placeholder="Email" required>\n        <div class="pw-wrap">\n          <input type="password" id="pw" placeholder="Password" required>\n          <button type="button" onclick="togglePw()">👁️</button>\n        </div>\n        <button type="submit" class="btn">Login</button>\n      </form>\n    </div>\n  </div>\n  <script src="script.js"></script>\n</body></html>`,
          initialCss: `* { box-sizing: border-box; margin: 0; } body { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #0f0a2e, #1a1040); font-family: Arial; } .container { width: 100%; max-width: 400px; padding: 20px; } .login-card { background: rgba(255,255,255,0.05); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; padding: 40px; color: white; } h1 { text-align: center; margin-bottom: 30px; } input { width: 100%; padding: 12px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; color: white; margin-bottom: 15px; outline: none; } .pw-wrap { position: relative; } .pw-wrap button { position: absolute; right: 10px; top: 12px; background: none; border: none; cursor: pointer; } .btn { width: 100%; padding: 12px; background: #e98a2e; color: white; border: none; border-radius: 10px; cursor: pointer; font-size: 16px; }`,
          initialJs: `function togglePw() { const p = document.getElementById('pw'); p.type = p.type === 'password' ? 'text' : 'password'; }\ndocument.getElementById('loginForm').addEventListener('submit', e => { e.preventDefault(); alert('Login successful!'); });`,
          language: 'html',
          challenge: { instruction: 'Build a signup page with name, email, password with show/hide, confirm password with match validation, and glassmorphism styling.', initialCode: `<!DOCTYPE html><html><body><!-- Build signup form --><script src="script.js"></script></body></html>`, initialCss: `body { background: #0f0a2e; color: white; font-family: Arial; display: flex; justify-content: center; align-items: center; min-height: 100vh; }`, initialJs: `// Add toggle and validation`, validationKeywords: ['type="password"', 'backdrop-filter', 'function'] },
        },
        {
          id: 'proj-2',
          title: 'Build a Portfolio Website',
          topic: 'Real-World Projects',
          level: 'expert',
          content: `# Build a Portfolio Website 🌐\n\nCreate a professional portfolio with hero, about, skills, projects grid, contact form, and smooth scroll navigation.\n\n## Key Concepts\n- \`scroll-behavior: smooth\`\n- CSS Grid for project cards\n- Fixed navbar with \`backdrop-filter\`\n- Responsive design with \`auto-fit\``,
          initialCode: `<!DOCTYPE html>\n<html><head><link rel="stylesheet" href="style.css"></head>\n<body>\n  <nav><a href="#hero">Home</a> <a href="#projects">Projects</a> <a href="#contact">Contact</a></nav>\n  <section id="hero"><h1>Hi, I'm <span style="color:#e98a2e">CodeSage Dev</span></h1><p>Frontend Developer</p></section>\n  <section id="projects"><h2>Projects</h2><div class="grid"><div class="card"><h3>🌐 Web App</h3></div><div class="card"><h3>📱 Mobile UI</h3></div><div class="card"><h3>🎨 Dashboard</h3></div></div></section>\n  <section id="contact"><h2>Contact</h2><form><input placeholder="Name"><input placeholder="Email" type="email"><textarea placeholder="Message"></textarea><button type="submit">Send</button></form></section>\n</body></html>`,
          initialCss: `* { margin: 0; padding: 0; box-sizing: border-box; } html { scroll-behavior: smooth; } body { background: #0f0a2e; color: white; font-family: Arial; } nav { position: fixed; top: 0; width: 100%; padding: 15px 30px; background: rgba(15,10,46,0.9); backdrop-filter: blur(10px); z-index: 100; } nav a { color: #aaa; margin-right: 20px; text-decoration: none; } section { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 80px 20px; text-align: center; } h1 { font-size: 48px; } .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; max-width: 800px; width: 100%; margin-top: 20px; } .card { background: rgba(255,255,255,0.05); padding: 30px; border-radius: 15px; border: 1px solid rgba(255,255,255,0.08); } form { display: flex; flex-direction: column; gap: 10px; max-width: 400px; width: 100%; } input, textarea { padding: 12px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: white; outline: none; } button { padding: 12px; background: #e98a2e; border: none; border-radius: 8px; color: white; cursor: pointer; }`,
          initialJs: ``,
          language: 'html',
          challenge: { instruction: 'Add an About section with skills tags, a 4th project card, and social media links in a footer.', initialCode: `<!DOCTYPE html><html><head><link rel="stylesheet" href="style.css"></head><body><!-- Build portfolio --></body></html>`, initialCss: `html{scroll-behavior:smooth}body{background:#0f0a2e;color:white;font-family:Arial}`, validationKeywords: ['<nav', '<section', 'grid', 'footer'] },
        },
      ],
    },
  ],
};

export const allLevels: LevelData[] = [basicLessons, intermediateLessons, expertLessons];

export function getAllLessons(): Lesson[] {
  return allLevels.flatMap(level => level.topics.flatMap(topic => topic.lessons));
}

export function getLessonById(id: string): Lesson | undefined {
  return getAllLessons().find(l => l.id === id);
}

export function getCompletedCount(completedIds: string[], level: LessonLevel): { completed: number; total: number } {
  const lessons = allLevels.find(l => l.level === level)?.topics.flatMap(t => t.lessons) || [];
  return {
    completed: lessons.filter(l => completedIds.includes(l.id)).length,
    total: lessons.length,
  };
}

// Check if a lesson is unlocked (previous lesson's challenge must be completed)
export function isLessonUnlocked(lessonId: string, completedLessons: string[]): boolean {
  const allLessonsList = getAllLessons();
  const lessonIndex = allLessonsList.findIndex(l => l.id === lessonId);
  if (lessonIndex <= 0) return true; // First lesson is always unlocked

  // Find the previous lesson in the same topic
  const lesson = allLessonsList[lessonIndex];
  const topic = allLevels
    .flatMap(l => l.topics)
    .find(t => t.lessons.some(l => l.id === lessonId));

  if (!topic) return true;

  const topicLessonIndex = topic.lessons.findIndex(l => l.id === lessonId);
  if (topicLessonIndex <= 0) {
    // First lesson in a topic - check if previous topic's last lesson is completed
    const level = allLevels.find(l => l.topics.some(t => t.id === topic.id));
    if (!level) return true;
    const topicIndex = level.topics.findIndex(t => t.id === topic.id);
    if (topicIndex <= 0) return true; // First topic in level
    const prevTopic = level.topics[topicIndex - 1];
    const lastLesson = prevTopic.lessons[prevTopic.lessons.length - 1];
    return completedLessons.includes(lastLesson.id);
  }

  // Previous lesson in same topic must be completed
  const prevLesson = topic.lessons[topicLessonIndex - 1];
  return completedLessons.includes(prevLesson.id);
}
