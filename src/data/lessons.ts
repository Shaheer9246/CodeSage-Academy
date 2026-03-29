export type LessonLevel = 'basic' | 'intermediate' | 'expert';

export interface Lesson {
  id: string;
  title: string;
  topic: string;
  level: LessonLevel;
  content: string;
  initialCode: string;
  language: 'html' | 'css' | 'javascript' | 'typescript';
  challenge?: {
    instruction: string;
    initialCode: string;
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
      id: 'html-basics',
      name: 'HTML Fundamentals',
      icon: 'E',
      lessons: [
        {
          id: 'html-1',
          title: 'What is HTML?',
          topic: 'HTML Fundamentals',
          level: 'basic',
          content: `# What is HTML?\n\nHTML (HyperText Markup Language) is the standard language for creating web pages. It describes the structure of a web page using **elements** represented by tags.\n\n## Basic Structure\n\nEvery HTML page has this basic structure:\n\n\`\`\`html\n<!DOCTYPE html>\n<html>\n  <head>\n    <title>Page Title</title>\n  </head>\n  <body>\n    <h1>Hello World!</h1>\n  </body>\n</html>\n\`\`\`\n\n- \`<!DOCTYPE html>\` declares the document type\n- \`<html>\` is the root element\n- \`<head>\` contains metadata\n- \`<body>\` contains visible content`,
          initialCode: `<!DOCTYPE html>\n<html>\n<head>\n  <title>My First Page</title>\n</head>\n<body>\n  <h1>Hello World!</h1>\n  <p>This is my first web page.</p>\n</body>\n</html>`,
          language: 'html',
          challenge: {
            instruction: 'Create an HTML page with a heading that says "Welcome" and a paragraph below it saying "I am learning HTML!"',
            initialCode: `<!DOCTYPE html>\n<html>\n<head>\n  <title>My Page</title>\n</head>\n<body>\n  <!-- Write your code here -->\n</body>\n</html>`,
            validationKeywords: ['<h1>', 'Welcome', '<p>', 'I am learning HTML!'],
          },
        },
        {
          id: 'html-2',
          title: 'Headings & Text',
          topic: 'HTML Fundamentals',
          level: 'basic',
          content: `# Headings & Text\n\nHTML has 6 levels of headings, from \`<h1>\` (largest) to \`<h6>\` (smallest).\n\n## Headings\n\`\`\`html\n<h1>Main Heading</h1>\n<h2>Sub Heading</h2>\n<h3>Section Heading</h3>\n\`\`\`\n\n## Text Elements\n- \`<p>\` - Paragraph\n- \`<strong>\` - Bold text\n- \`<em>\` - Italic text\n- \`<br>\` - Line break`,
          initialCode: `<!DOCTYPE html>\n<html>\n<body>\n  <h1>Main Title</h1>\n  <h2>Subtitle</h2>\n  <p>This is a <strong>bold</strong> and <em>italic</em> paragraph.</p>\n  <h3>Section</h3>\n  <p>Another paragraph with a<br>line break.</p>\n</body>\n</html>`,
          language: 'html',
          challenge: {
            instruction: 'Create a page with h1 saying "My Blog", h2 saying "First Post", and a paragraph with some bold text.',
            initialCode: `<!DOCTYPE html>\n<html>\n<body>\n  <!-- Create headings and a paragraph with bold text -->\n</body>\n</html>`,
            validationKeywords: ['<h1>', 'My Blog', '<h2>', 'First Post', '<strong>'],
          },
        },
        {
          id: 'html-3',
          title: 'Links & Navigation',
          topic: 'HTML Fundamentals',
          level: 'basic',
          content: `# Links & Navigation\n\nLinks are created with the \`<a>\` (anchor) tag.\n\n\`\`\`html\n<a href="https://example.com">Visit Example</a>\n\`\`\`\n\n## Attributes\n- \`href\` - The URL to link to\n- \`target="_blank"\` - Opens in new tab\n\n## Navigation\n\`\`\`html\n<nav>\n  <a href="/">Home</a>\n  <a href="/about">About</a>\n</nav>\n\`\`\``,
          initialCode: `<!DOCTYPE html>\n<html>\n<body>\n  <nav>\n    <a href="/">Home</a> |\n    <a href="/about">About</a> |\n    <a href="/contact">Contact</a>\n  </nav>\n  <h1>Welcome!</h1>\n  <p>Visit <a href="https://example.com" target="_blank">Example.com</a></p>\n</body>\n</html>`,
          language: 'html',
        },
        {
          id: 'html-4',
          title: 'Images & Media',
          topic: 'HTML Fundamentals',
          level: 'basic',
          content: `# Images & Media\n\nImages use the \`<img>\` tag (self-closing).\n\n\`\`\`html\n<img src="photo.jpg" alt="Description" width="300">\n\`\`\`\n\n## Key Attributes\n- \`src\` - Image source URL\n- \`alt\` - Alternative text (important for accessibility)\n- \`width\` / \`height\` - Dimensions`,
          initialCode: `<!DOCTYPE html>\n<html>\n<body>\n  <h1>My Gallery</h1>\n  <img src="https://picsum.photos/300/200" alt="Random photo" width="300">\n  <p>A beautiful random image from the web.</p>\n</body>\n</html>`,
          language: 'html',
        },
        {
          id: 'html-5',
          title: 'Lists',
          topic: 'HTML Fundamentals',
          level: 'basic',
          content: `# Lists\n\nHTML has two types of lists:\n\n## Unordered List\n\`\`\`html\n<ul>\n  <li>Item 1</li>\n  <li>Item 2</li>\n</ul>\n\`\`\`\n\n## Ordered List\n\`\`\`html\n<ol>\n  <li>First</li>\n  <li>Second</li>\n</ol>\n\`\`\``,
          initialCode: `<!DOCTYPE html>\n<html>\n<body>\n  <h1>Shopping List</h1>\n  <ul>\n    <li>Apples</li>\n    <li>Bread</li>\n    <li>Milk</li>\n  </ul>\n  <h2>Steps to Make Tea</h2>\n  <ol>\n    <li>Boil water</li>\n    <li>Add tea bag</li>\n    <li>Wait 3 minutes</li>\n    <li>Enjoy!</li>\n  </ol>\n</body>\n</html>`,
          language: 'html',
        },
        {
          id: 'html-6',
          title: 'Tables',
          topic: 'HTML Fundamentals',
          level: 'basic',
          content: `# Tables\n\nTables organize data in rows and columns.\n\n\`\`\`html\n<table>\n  <tr>\n    <th>Name</th>\n    <th>Age</th>\n  </tr>\n  <tr>\n    <td>Alice</td>\n    <td>25</td>\n  </tr>\n</table>\n\`\`\`\n\n- \`<table>\` - Table container\n- \`<tr>\` - Table row\n- \`<th>\` - Header cell\n- \`<td>\` - Data cell`,
          initialCode: `<!DOCTYPE html>\n<html>\n<body>\n  <h1>Student Grades</h1>\n  <table border="1">\n    <tr>\n      <th>Name</th>\n      <th>Subject</th>\n      <th>Grade</th>\n    </tr>\n    <tr>\n      <td>Alice</td>\n      <td>Math</td>\n      <td>A</td>\n    </tr>\n    <tr>\n      <td>Bob</td>\n      <td>Science</td>\n      <td>B+</td>\n    </tr>\n  </table>\n</body>\n</html>`,
          language: 'html',
        },
        {
          id: 'html-7',
          title: 'Forms & Input',
          topic: 'HTML Fundamentals',
          level: 'basic',
          content: `# Forms & Input\n\nForms collect user input.\n\n\`\`\`html\n<form>\n  <label for="name">Name:</label>\n  <input type="text" id="name">\n  <button type="submit">Submit</button>\n</form>\n\`\`\`\n\n## Input Types\n- \`text\`, \`email\`, \`password\`, \`number\`\n- \`checkbox\`, \`radio\`\n- \`textarea\` for multi-line`,
          initialCode: `<!DOCTYPE html>\n<html>\n<body>\n  <h1>Contact Form</h1>\n  <form>\n    <label for="name">Name:</label><br>\n    <input type="text" id="name" placeholder="Your name"><br><br>\n    <label for="email">Email:</label><br>\n    <input type="email" id="email" placeholder="you@example.com"><br><br>\n    <label for="msg">Message:</label><br>\n    <textarea id="msg" rows="4" cols="30"></textarea><br><br>\n    <button type="submit">Send</button>\n  </form>\n</body>\n</html>`,
          language: 'html',
        },
        {
          id: 'html-8',
          title: 'Semantic HTML',
          topic: 'HTML Fundamentals',
          level: 'basic',
          content: `# Semantic HTML\n\nSemantic elements describe their meaning:\n\n- \`<header>\` - Page/section header\n- \`<nav>\` - Navigation links\n- \`<main>\` - Main content\n- \`<article>\` - Independent content\n- \`<section>\` - Themed grouping\n- \`<footer>\` - Page/section footer\n- \`<aside>\` - Side content`,
          initialCode: `<!DOCTYPE html>\n<html>\n<body>\n  <header>\n    <h1>My Website</h1>\n    <nav>\n      <a href="/">Home</a> | <a href="/blog">Blog</a>\n    </nav>\n  </header>\n  <main>\n    <article>\n      <h2>First Article</h2>\n      <p>This is the main content.</p>\n    </article>\n    <aside>\n      <h3>Related Links</h3>\n      <p>Some sidebar content.</p>\n    </aside>\n  </main>\n  <footer>\n    <p>&copy; 2026 My Website</p>\n  </footer>\n</body>\n</html>`,
          language: 'html',
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
          content: `# What is CSS?\n\nCSS (Cascading Style Sheets) styles HTML elements.\n\n## Ways to Add CSS\n1. **Inline**: \`<p style="color: red;">Text</p>\`\n2. **Internal**: \`<style>\` tag in \`<head>\`\n3. **External**: Linked \`.css\` file (best practice)\n\n## Basic Syntax\n\`\`\`css\nselector {\n  property: value;\n}\n\`\`\``,
          initialCode: `<!DOCTYPE html>\n<html>\n<head>\n<style>\n  body {\n    font-family: Arial, sans-serif;\n    background-color: #f0f0f0;\n  }\n  h1 {\n    color: #333;\n    text-align: center;\n  }\n  p {\n    color: #666;\n    font-size: 18px;\n    line-height: 1.6;\n  }\n</style>\n</head>\n<body>\n  <h1>Styled Page</h1>\n  <p>This page uses CSS for styling!</p>\n</body>\n</html>`,
          language: 'html',
        },
        {
          id: 'css-2',
          title: 'Selectors',
          topic: 'CSS Fundamentals',
          level: 'basic',
          content: `# CSS Selectors\n\n## Types\n- **Element**: \`p { }\` - all paragraphs\n- **Class**: \`.highlight { }\` - elements with class="highlight"\n- **ID**: \`#header { }\` - element with id="header"\n- **Descendant**: \`div p { }\` - p inside div`,
          initialCode: `<!DOCTYPE html>\n<html>\n<head>\n<style>\n  .highlight { background-color: yellow; padding: 4px; }\n  #title { color: navy; font-size: 32px; }\n  .card { border: 1px solid #ddd; padding: 16px; margin: 8px; border-radius: 8px; }\n  .card h3 { color: #e74c3c; }\n</style>\n</head>\n<body>\n  <h1 id="title">CSS Selectors</h1>\n  <div class="card">\n    <h3>Card Title</h3>\n    <p>Some <span class="highlight">highlighted</span> text.</p>\n  </div>\n</body>\n</html>`,
          language: 'html',
        },
        {
          id: 'css-3',
          title: 'Box Model',
          topic: 'CSS Fundamentals',
          level: 'basic',
          content: `# The Box Model\n\nEvery element is a box with:\n- **Content** - The actual content\n- **Padding** - Space inside the border\n- **Border** - The border\n- **Margin** - Space outside the border\n\n\`\`\`css\n.box {\n  padding: 20px;\n  border: 2px solid black;\n  margin: 10px;\n}\n\`\`\``,
          initialCode: `<!DOCTYPE html>\n<html>\n<head>\n<style>\n  .box {\n    background-color: #3498db;\n    color: white;\n    padding: 20px;\n    margin: 15px;\n    border: 3px solid #2c3e50;\n    border-radius: 8px;\n    width: 200px;\n    text-align: center;\n  }\n  .box:hover {\n    background-color: #2980b9;\n    transform: scale(1.05);\n    transition: all 0.3s;\n  }\n</style>\n</head>\n<body>\n  <div class="box">Box 1</div>\n  <div class="box">Box 2</div>\n  <div class="box">Box 3</div>\n</body>\n</html>`,
          language: 'html',
        },
        {
          id: 'css-4',
          title: 'Flexbox',
          topic: 'CSS Fundamentals',
          level: 'basic',
          content: `# Flexbox\n\nFlexbox is a layout model for arranging items.\n\n\`\`\`css\n.container {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  gap: 10px;\n}\n\`\`\`\n\n## Key Properties\n- \`flex-direction\`: row | column\n- \`justify-content\`: flex-start | center | space-between\n- \`align-items\`: flex-start | center | stretch`,
          initialCode: `<!DOCTYPE html>\n<html>\n<head>\n<style>\n  .flex-container {\n    display: flex;\n    justify-content: space-around;\n    align-items: center;\n    gap: 16px;\n    padding: 20px;\n    min-height: 200px;\n    background: #1a1a2e;\n  }\n  .flex-item {\n    background: #e94560;\n    color: white;\n    padding: 20px 30px;\n    border-radius: 8px;\n    font-size: 18px;\n    font-weight: bold;\n  }\n</style>\n</head>\n<body>\n  <div class="flex-container">\n    <div class="flex-item">Item 1</div>\n    <div class="flex-item">Item 2</div>\n    <div class="flex-item">Item 3</div>\n  </div>\n</body>\n</html>`,
          language: 'html',
        },
        {
          id: 'css-5',
          title: 'Grid Layout',
          topic: 'CSS Fundamentals',
          level: 'basic',
          content: `# CSS Grid\n\nGrid is a 2D layout system.\n\n\`\`\`css\n.grid {\n  display: grid;\n  grid-template-columns: 1fr 1fr 1fr;\n  gap: 10px;\n}\n\`\`\``,
          initialCode: `<!DOCTYPE html>\n<html>\n<head>\n<style>\n  .grid {\n    display: grid;\n    grid-template-columns: repeat(3, 1fr);\n    gap: 12px;\n    padding: 20px;\n  }\n  .grid-item {\n    background: linear-gradient(135deg, #667eea, #764ba2);\n    color: white;\n    padding: 30px;\n    text-align: center;\n    border-radius: 8px;\n    font-weight: bold;\n  }\n  .grid-item:first-child {\n    grid-column: span 2;\n  }\n</style>\n</head>\n<body>\n  <div class="grid">\n    <div class="grid-item">Wide Item</div>\n    <div class="grid-item">Item 2</div>\n    <div class="grid-item">Item 3</div>\n    <div class="grid-item">Item 4</div>\n    <div class="grid-item">Item 5</div>\n  </div>\n</body>\n</html>`,
          language: 'html',
        },
        {
          id: 'css-6',
          title: 'Animations',
          topic: 'CSS Fundamentals',
          level: 'basic',
          content: `# CSS Animations\n\n## Transitions\n\`\`\`css\n.btn { transition: all 0.3s ease; }\n.btn:hover { transform: scale(1.1); }\n\`\`\`\n\n## Keyframes\n\`\`\`css\n@keyframes slide {\n  from { transform: translateX(-100%); }\n  to { transform: translateX(0); }\n}\n\`\`\``,
          initialCode: `<!DOCTYPE html>\n<html>\n<head>\n<style>\n  @keyframes bounce {\n    0%, 100% { transform: translateY(0); }\n    50% { transform: translateY(-20px); }\n  }\n  @keyframes fadeIn {\n    from { opacity: 0; transform: translateY(20px); }\n    to { opacity: 1; transform: translateY(0); }\n  }\n  .bounce { animation: bounce 1s infinite; display: inline-block; font-size: 40px; }\n  .fade-in { animation: fadeIn 1s ease-out; }\n  .btn {\n    padding: 12px 24px;\n    background: #e74c3c;\n    color: white;\n    border: none;\n    border-radius: 8px;\n    font-size: 16px;\n    cursor: pointer;\n    transition: all 0.3s ease;\n  }\n  .btn:hover { transform: scale(1.1); background: #c0392b; }\n</style>\n</head>\n<body style="text-align:center; padding: 40px;">\n  <div class="bounce">🚀</div>\n  <h1 class="fade-in">CSS Animations!</h1>\n  <button class="btn">Hover Me</button>\n</body>\n</html>`,
          language: 'html',
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
          content: `# What is JavaScript?\n\nJavaScript makes web pages interactive.\n\n## Adding JavaScript\n\`\`\`html\n<script>\n  console.log("Hello!");\n</script>\n\`\`\`\n\n## Variables\n\`\`\`js\nlet name = "Alice";\nconst age = 25;\n\`\`\`\n\nOpen the console to see output!`,
          initialCode: `<!DOCTYPE html>\n<html>\n<head><title>JavaScript</title></head>\n<body>\n  <h1>Check the Console! 👇</h1>\n  <p>Open the console panel at the bottom to see output.</p>\n  <script>\n    console.log("Hello from JavaScript!");\n    let name = "Coder";\n    console.log("Welcome, " + name + "!");\n    const age = 20;\n    console.log("You are " + age + " years old.");\n  </script>\n</body>\n</html>`,
          language: 'html',
          challenge: {
            instruction: 'Create variables for your name and age, then console.log a greeting message.',
            initialCode: `<!DOCTYPE html>\n<html>\n<body>\n  <h1>My First JS</h1>\n  <script>\n    // Create a variable 'name' and 'age'\n    // Then console.log: "Hi, I'm [name] and I'm [age] years old!"\n  </script>\n</body>\n</html>`,
            validationKeywords: ['let', 'console.log'],
          },
        },
        {
          id: 'js-2',
          title: 'Functions',
          topic: 'JavaScript Basics',
          level: 'basic',
          content: `# Functions\n\nFunctions are reusable blocks of code.\n\n\`\`\`js\nfunction greet(name) {\n  return "Hello, " + name;\n}\n\nconst add = (a, b) => a + b;\n\`\`\``,
          initialCode: `<!DOCTYPE html>\n<html>\n<body>\n  <h1>Functions</h1>\n  <div id="output"></div>\n  <script>\n    function greet(name) {\n      return "Hello, " + name + "!";\n    }\n\n    const add = (a, b) => a + b;\n    const multiply = (a, b) => a * b;\n\n    document.getElementById("output").innerHTML = \n      greet("World") + "<br>" +\n      "2 + 3 = " + add(2, 3) + "<br>" +\n      "4 × 5 = " + multiply(4, 5);\n\n    console.log(greet("Console"));\n  </script>\n</body>\n</html>`,
          language: 'html',
        },
        {
          id: 'js-3',
          title: 'DOM Manipulation',
          topic: 'JavaScript Basics',
          level: 'basic',
          content: `# DOM Manipulation\n\nJavaScript can change HTML content dynamically.\n\n\`\`\`js\ndocument.getElementById("demo").textContent = "Changed!";\ndocument.querySelector(".btn").addEventListener("click", () => {\n  alert("Clicked!");\n});\n\`\`\``,
          initialCode: `<!DOCTYPE html>\n<html>\n<head>\n<style>\n  body { font-family: Arial; text-align: center; padding: 40px; }\n  button { padding: 10px 20px; font-size: 16px; cursor: pointer; margin: 5px; border-radius: 8px; border: none; color: white; }\n  .add-btn { background: #2ecc71; }\n  .change-btn { background: #3498db; }\n  .remove-btn { background: #e74c3c; }\n  #output { margin-top: 20px; font-size: 20px; }\n</style>\n</head>\n<body>\n  <h1 id="title">DOM Manipulation</h1>\n  <button class="change-btn" onclick="changeTitle()">Change Title</button>\n  <button class="add-btn" onclick="addItem()">Add Item</button>\n  <button class="remove-btn" onclick="clearList()">Clear</button>\n  <ul id="list"></ul>\n  <div id="output">Click a button!</div>\n  <script>\n    let count = 0;\n    function changeTitle() {\n      document.getElementById("title").textContent = "Title Changed! ✨";\n      document.getElementById("title").style.color = "#e74c3c";\n    }\n    function addItem() {\n      count++;\n      const li = document.createElement("li");\n      li.textContent = "Item " + count;\n      document.getElementById("list").appendChild(li);\n    }\n    function clearList() {\n      document.getElementById("list").innerHTML = "";\n      count = 0;\n    }\n  </script>\n</body>\n</html>`,
          language: 'html',
        },
        {
          id: 'js-4',
          title: 'Events',
          topic: 'JavaScript Basics',
          level: 'basic',
          content: `# Events\n\nEvents let you respond to user actions.\n\n## Common Events\n- \`click\` - Mouse click\n- \`input\` - Input value changes\n- \`keydown\` - Key pressed\n- \`mouseover\` - Mouse enters element`,
          initialCode: `<!DOCTYPE html>\n<html>\n<head>\n<style>\n  body { font-family: Arial; padding: 30px; }\n  .box { width: 200px; height: 200px; background: #3498db; color: white; display: flex; align-items: center; justify-content: center; font-size: 18px; border-radius: 12px; cursor: pointer; transition: all 0.3s; margin: 20px auto; }\n  input { padding: 10px; font-size: 16px; border: 2px solid #ddd; border-radius: 8px; width: 300px; }\n  #preview { margin-top: 10px; font-size: 24px; color: #2c3e50; }\n</style>\n</head>\n<body>\n  <h1>Events Demo</h1>\n  <input type="text" id="nameInput" placeholder="Type your name...">\n  <div id="preview">Hello, stranger!</div>\n  <div class="box" id="colorBox">Click me!</div>\n  <script>\n    document.getElementById("nameInput").addEventListener("input", (e) => {\n      const name = e.target.value || "stranger";\n      document.getElementById("preview").textContent = "Hello, " + name + "!";\n    });\n    const colors = ["#e74c3c", "#2ecc71", "#9b59b6", "#f39c12", "#3498db"];\n    let colorIndex = 0;\n    document.getElementById("colorBox").addEventListener("click", () => {\n      colorIndex = (colorIndex + 1) % colors.length;\n      document.getElementById("colorBox").style.background = colors[colorIndex];\n      document.getElementById("colorBox").textContent = "Color " + (colorIndex + 1);\n    });\n  </script>\n</body>\n</html>`,
          language: 'html',
        },
      ],
    },
    {
      id: 'react-basics',
      name: 'React JSX',
      icon: '⚛️',
      lessons: [
        {
          id: 'react-1',
          title: 'What is React?',
          topic: 'React JSX',
          level: 'basic',
          content: `# What is React?\n\nReact is a JavaScript library for building UIs with components.\n\n## JSX\nJSX lets you write HTML-like code in JavaScript:\n\`\`\`jsx\nconst element = <h1>Hello, React!</h1>;\n\`\`\`\n\n**Note:** In this playground, we simulate React concepts using vanilla JS since we can't run a full React build.`,
          initialCode: `<!DOCTYPE html>\n<html>\n<head>\n<style>\n  body { font-family: Arial; background: #282c34; color: white; padding: 40px; text-align: center; }\n  .component { background: #3b3f47; padding: 20px; margin: 10px; border-radius: 12px; border-left: 4px solid #61dafb; }\n  .react-blue { color: #61dafb; }\n</style>\n</head>\n<body>\n  <h1 class="react-blue">⚛️ React Concepts</h1>\n  <div class="component">\n    <h2>Component: Header</h2>\n    <p>This represents a React component!</p>\n  </div>\n  <div class="component">\n    <h2>Component: Card</h2>\n    <p>Components are reusable building blocks.</p>\n  </div>\n  <script>\n    // React uses components like functions:\n    // function Header() { return <h1>Hello</h1>; }\n    // function App() { return <div><Header /><Card /></div>; }\n    console.log("React uses a virtual DOM for efficient updates!");\n    console.log("Components are like JavaScript functions that return HTML.");\n  </script>\n</body>\n</html>`,
          language: 'html',
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
      icon: 'E',
      lessons: [
        {
          id: 'html-int-1',
          title: 'HTML5 APIs',
          topic: 'Advanced HTML',
          level: 'intermediate',
          content: `# HTML5 APIs\n\nModern HTML5 provides powerful APIs:\n- **Local Storage** - Store data in the browser\n- **Geolocation** - Get user location\n- **Canvas** - Draw graphics\n- **Drag & Drop** - Native drag and drop`,
          initialCode: `<!DOCTYPE html>\n<html>\n<head>\n<style>\n  body { font-family: Arial; padding: 20px; }\n  canvas { border: 2px solid #333; border-radius: 8px; }\n  button { padding: 10px 20px; margin: 5px; cursor: pointer; border-radius: 8px; border: none; background: #3498db; color: white; }\n</style>\n</head>\n<body>\n  <h1>HTML5 Canvas</h1>\n  <canvas id="canvas" width="400" height="300"></canvas>\n  <br>\n  <button onclick="drawCircle()">Draw Circle</button>\n  <button onclick="clearCanvas()">Clear</button>\n  <script>\n    const canvas = document.getElementById("canvas");\n    const ctx = canvas.getContext("2d");\n    function drawCircle() {\n      const x = Math.random() * 350 + 25;\n      const y = Math.random() * 250 + 25;\n      const r = Math.random() * 30 + 10;\n      ctx.beginPath();\n      ctx.arc(x, y, r, 0, Math.PI * 2);\n      ctx.fillStyle = '#' + Math.floor(Math.random()*16777215).toString(16);\n      ctx.fill();\n    }\n    function clearCanvas() { ctx.clearRect(0, 0, 400, 300); }\n  </script>\n</body>\n</html>`,
          language: 'html',
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
          title: 'CSS Variables & Responsive',
          topic: 'Advanced CSS',
          level: 'intermediate',
          content: `# CSS Variables & Responsive Design\n\n## Custom Properties\n\`\`\`css\n:root { --primary: #3498db; }\n.btn { background: var(--primary); }\n\`\`\`\n\n## Media Queries\n\`\`\`css\n@media (max-width: 768px) {\n  .grid { grid-template-columns: 1fr; }\n}\n\`\`\``,
          initialCode: `<!DOCTYPE html>\n<html>\n<head>\n<style>\n  :root {\n    --primary: #6c5ce7;\n    --secondary: #00cec9;\n    --bg: #2d3436;\n    --text: #dfe6e9;\n  }\n  body { background: var(--bg); color: var(--text); font-family: Arial; padding: 20px; }\n  .card-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; }\n  .card { background: #636e72; padding: 20px; border-radius: 12px; border-top: 4px solid var(--primary); }\n  .card h3 { color: var(--secondary); }\n  .btn { background: var(--primary); color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; }\n</style>\n</head>\n<body>\n  <h1>Responsive Cards</h1>\n  <p>Resize the preview to see the grid adapt!</p>\n  <div class="card-grid">\n    <div class="card"><h3>Card 1</h3><p>Responsive grid item</p><button class="btn">Action</button></div>\n    <div class="card"><h3>Card 2</h3><p>Using CSS variables</p><button class="btn">Action</button></div>\n    <div class="card"><h3>Card 3</h3><p>Auto-fit columns</p><button class="btn">Action</button></div>\n  </div>\n</body>\n</html>`,
          language: 'html',
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
          content: `# Async JavaScript\n\n## Promises & Async/Await\n\`\`\`js\nasync function getData() {\n  const res = await fetch("https://api.example.com/data");\n  const data = await res.json();\n  return data;\n}\n\`\`\``,
          initialCode: `<!DOCTYPE html>\n<html>\n<head>\n<style>\n  body { font-family: Arial; padding: 20px; background: #1a1a2e; color: #e0e0e0; }\n  .user-card { background: #16213e; padding: 16px; margin: 8px 0; border-radius: 8px; border-left: 3px solid #e94560; }\n  button { background: #e94560; color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-size: 16px; }\n  .loading { color: #e94560; }\n</style>\n</head>\n<body>\n  <h1>Fetch API Demo</h1>\n  <button onclick="loadUsers()">Load Users</button>\n  <div id="users"></div>\n  <script>\n    async function loadUsers() {\n      document.getElementById("users").innerHTML = '<p class="loading">Loading...</p>';\n      try {\n        const res = await fetch("https://jsonplaceholder.typicode.com/users");\n        const users = await res.json();\n        let html = "";\n        users.slice(0, 5).forEach(user => {\n          html += '<div class="user-card"><strong>' + user.name + '</strong><br>' + user.email + '</div>';\n        });\n        document.getElementById("users").innerHTML = html;\n      } catch(err) {\n        document.getElementById("users").innerHTML = "Error loading data";\n      }\n    }\n  </script>\n</body>\n</html>`,
          language: 'html',
        },
        {
          id: 'js-int-2',
          title: 'Array Methods',
          topic: 'Advanced JavaScript',
          level: 'intermediate',
          content: `# Array Methods\n\nPowerful array methods:\n- \`map()\` - Transform each element\n- \`filter()\` - Keep matching elements\n- \`reduce()\` - Combine to single value\n- \`find()\` - Find first match`,
          initialCode: `<!DOCTYPE html>\n<html>\n<head>\n<style>\n  body { font-family: monospace; padding: 20px; background: #1e1e1e; color: #d4d4d4; }\n  .result { background: #2d2d2d; padding: 12px; margin: 8px 0; border-radius: 6px; border-left: 3px solid #569cd6; }\n  h3 { color: #569cd6; }\n</style>\n</head>\n<body>\n  <h1>Array Methods</h1>\n  <div id="output"></div>\n  <script>\n    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];\n    const doubled = numbers.map(n => n * 2);\n    const evens = numbers.filter(n => n % 2 === 0);\n    const sum = numbers.reduce((acc, n) => acc + n, 0);\n    const products = [{name: "Laptop", price: 999}, {name: "Phone", price: 699}, {name: "Tablet", price: 399}];\n    const expensive = products.filter(p => p.price > 500).map(p => p.name);\n\n    document.getElementById("output").innerHTML = \n      '<div class="result"><h3>Original:</h3>' + JSON.stringify(numbers) + '</div>' +\n      '<div class="result"><h3>Doubled (map):</h3>' + JSON.stringify(doubled) + '</div>' +\n      '<div class="result"><h3>Evens (filter):</h3>' + JSON.stringify(evens) + '</div>' +\n      '<div class="result"><h3>Sum (reduce):</h3>' + sum + '</div>' +\n      '<div class="result"><h3>Expensive Products:</h3>' + JSON.stringify(expensive) + '</div>';\n    \n    console.log("Sum:", sum);\n  </script>\n</body>\n</html>`,
          language: 'html',
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
          content: `# Design Patterns\n\nCommon patterns in JavaScript:\n- **Module Pattern** - Encapsulate private data\n- **Observer Pattern** - Event-based communication\n- **Factory Pattern** - Create objects dynamically`,
          initialCode: `<!DOCTYPE html>\n<html>\n<head>\n<style>\n  body { font-family: monospace; padding: 20px; background: #0d1117; color: #c9d1d9; }\n  .pattern { background: #161b22; padding: 16px; margin: 12px 0; border-radius: 8px; border: 1px solid #30363d; }\n  h3 { color: #58a6ff; }\n  .output { color: #7ee787; }\n</style>\n</head>\n<body>\n  <h1>Design Patterns</h1>\n  <div id="output"></div>\n  <script>\n    // Module Pattern\n    const Counter = (() => {\n      let count = 0;\n      return {\n        increment: () => ++count,\n        decrement: () => --count,\n        getCount: () => count\n      };\n    })();\n\n    Counter.increment();\n    Counter.increment();\n    Counter.increment();\n\n    // Observer Pattern\n    class EventEmitter {\n      constructor() { this.events = {}; }\n      on(event, fn) { (this.events[event] = this.events[event] || []).push(fn); }\n      emit(event, data) { (this.events[event] || []).forEach(fn => fn(data)); }\n    }\n\n    const emitter = new EventEmitter();\n    let messages = [];\n    emitter.on('message', (msg) => messages.push(msg));\n    emitter.emit('message', 'Hello Observer!');\n    emitter.emit('message', 'Pattern works!');\n\n    document.getElementById("output").innerHTML =\n      '<div class="pattern"><h3>Module Pattern</h3><p class="output">Counter: ' + Counter.getCount() + '</p></div>' +\n      '<div class="pattern"><h3>Observer Pattern</h3><p class="output">Messages: ' + JSON.stringify(messages) + '</p></div>';\n    \n    console.log("Count:", Counter.getCount());\n    console.log("Messages:", messages);\n  </script>\n</body>\n</html>`,
          language: 'html',
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
          content: `# Advanced CSS Animations & 3D\n\nCSS can create complex 3D transforms and animations.\n\n\`\`\`css\n.card {\n  transform: perspective(1000px) rotateY(15deg);\n  transition: transform 0.5s;\n}\n\`\`\``,
          initialCode: `<!DOCTYPE html>\n<html>\n<head>\n<style>\n  body { background: #0f0f23; color: white; font-family: Arial; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; perspective: 1000px; }\n  .scene { display: flex; gap: 30px; }\n  .card-3d {\n    width: 150px; height: 200px; position: relative; transform-style: preserve-3d;\n    transition: transform 0.6s; cursor: pointer;\n  }\n  .card-3d:hover { transform: rotateY(180deg); }\n  .card-face {\n    position: absolute; width: 100%; height: 100%; backface-visibility: hidden;\n    display: flex; align-items: center; justify-content: center;\n    border-radius: 12px; font-size: 20px; font-weight: bold;\n  }\n  .front { background: linear-gradient(135deg, #667eea, #764ba2); }\n  .back { background: linear-gradient(135deg, #f093fb, #f5576c); transform: rotateY(180deg); }\n  @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }\n  .card-3d { animation: float 3s ease-in-out infinite; }\n  .card-3d:nth-child(2) { animation-delay: 0.5s; }\n  .card-3d:nth-child(3) { animation-delay: 1s; }\n</style>\n</head>\n<body>\n  <div class="scene">\n    <div class="card-3d"><div class="card-face front">🎯 Front</div><div class="card-face back">✨ Back</div></div>\n    <div class="card-3d"><div class="card-face front">🚀 Front</div><div class="card-face back">💫 Back</div></div>\n    <div class="card-3d"><div class="card-face front">🎨 Front</div><div class="card-face back">🌟 Back</div></div>\n  </div>\n</body>\n</html>`,
          language: 'html',
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
