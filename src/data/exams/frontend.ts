// src/data/exams/frontend.ts

import { ExamTrack } from './python';

export const frontendTrack: ExamTrack = {
  id: 'frontend',
  title: 'Frontend & Local Development',
  description: 'Master advanced DOM mechanics, modern CSS architectures, JavaScript execution internals, React fiber & reconciliation, and complex Git workflows.',
  totalAvailable: 24,
  questions: [
    // --- EASY ---
    {
      topic: 'HTML',
      difficulty: 'Easy',
      q: 'Which HTML tag is used to embed responsive vector images that adjust depending on media criteria without requiring wrapper CSS?',
      options: ['<img> with srcset', '<picture>', '<svg-container>', '<canvas>'],
      answer: 1
    },
    {
      topic: 'CSS',
      difficulty: 'Easy',
      q: 'Which CSS property alters how the total width and height of an element are calculated by including padding and borders?',
      options: ['box-sizing: border-box', 'box-model: strict', 'size-calculation: computed', 'display: boundary'],
      answer: 0
    },
    {
      topic: 'JavaScript',
      difficulty: 'Easy',
      q: 'What will `typeof NaN` evaluate to in JavaScript?',
      options: ['"undefined"', '"nan"', '"number"', '"object"'],
      answer: 2
    },
    {
      topic: 'Git',
      difficulty: 'Easy',
      q: 'Which command allows you to save uncommitted changes temporarily without committing them so you can work on a clean directory?',
      options: ['git stash', 'git pause', 'git shelf', 'git save --temp'],
      answer: 0
    },
    {
      topic: 'DOM',
      difficulty: 'Easy',
      q: 'Which DOM method creates a new HTML element node that can subsequently be appended to the Document Tree?',
      options: ['document.createElement()', 'document.buildNode()', 'document.appendTag()', 'document.generateElement()'],
      answer: 0
    },
    {
      topic: 'React',
      difficulty: 'Easy',
      q: 'Why does React require a unique `key` prop when rendering list elements dynamically?',
      options: ['To automatically apply CSS styles to specific list items', 'To help React identify which items have changed, been added, or removed during Reconciliation', 'To enforce strict ordering of asynchronous data', 'To automatically memoize the list item component'],
      answer: 1
    },
    {
      topic: 'CSS Flexbox',
      difficulty: 'Easy',
      q: 'In a Flexbox container with `flex-direction: column`, which property controls alignment along the horizontal axis?',
      options: ['justify-content', 'align-items', 'text-align', 'flex-align'],
      answer: 1
    },
    {
      topic: 'JavaScript Fundamentals',
      difficulty: 'Easy',
      q: 'What is the default value of a variable declared with `let` that has not been initialized with a value?',
      options: ['null', 'undefined', '0', 'ReferenceError'],
      answer: 1
    },

    // --- INTERMEDIATE ---
    {
      topic: 'DOM & Events',
      difficulty: 'Intermediate',
      q: 'What is Event Delegation in JavaScript DOM manipulation?',
      options: [
        'A technique where event listeners are bound to multiple worker threads',
        'Attaching a single event listener to a parent element to handle events on descendant elements using Event Bubbling',
        'Using custom browser events to trigger native DOM mutations',
        'Preventing the browser default action using `event.preventDefault()`'
      ],
      answer: 1
    },
    {
      topic: 'React',
      difficulty: 'Intermediate',
      q: 'What is the key difference between `useMemo` and `useCallback` in React?',
      options: [
        '`useMemo` caches the result of a function invocation; `useCallback` caches the function instance itself',
        '`useMemo` runs synchronously during render; `useCallback` always runs asynchronously after DOM mutation',
        '`useMemo` is used exclusively for primitive types; `useCallback` is used for objects and arrays',
        'There is no difference; `useCallback` is just a legacy alias for `useMemo`'
      ],
      answer: 0
    },
    {
      topic: 'APIs & Async',
      difficulty: 'Intermediate',
      q: 'What occurs when a `fetch()` HTTP request encounters a standard `404 Not Found` or `500 Internal Server Error` status code?',
      options: [
        'The returned Promise rejects immediately with a NetworkError',
        'The Promise resolves successfully, but the `response.ok` property is set to `false`',
        'The browser retries the request automatically up to 3 times',
        'The fetch API throws a fatal JavaScript execution exception'
      ],
      answer: 1
    },
    {
      topic: 'JavaScript Scoping',
      difficulty: 'Intermediate',
      q: 'What is the result of accessing a `let` variable before its line of declaration within its block scope?',
      options: [
        'It returns `undefined` due to variable hoisting',
        'It throws a `ReferenceError` because the variable resides in the Temporal Dead Zone (TDZ)',
        'It automatically coerces to `null`',
        'It falls back to the globally scoped variable with the same name'
      ],
      answer: 1
    },
    {
      topic: 'CSS Architecture',
      difficulty: 'Intermediate',
      q: 'Given the following CSS selectors, which one has the highest specificity score according to W3C rules?',
      options: [
        '#header .nav-link:hover',
        'header ul.nav li a.active',
        '#header #navigation a',
        'body #header .menu-item'
      ],
      answer: 2
    },
    {
      topic: 'React State Mechanics',
      difficulty: 'Intermediate',
      q: 'When setting state in React based on previous state value (e.g., counter increments), why should you pass an updater function (e.g., `setCount(prev => prev + 1)`)?',
      options: [
        'It prevents React from triggering re-renders',
        'It guarantees access to the latest state value regardless of asynchronous state batching',
        'It forces synchronous DOM mutation bypassing the Virtual DOM',
        'It converts the state value into a mutable ref'
      ],
      answer: 1
    },
    {
      topic: 'Git Workflows',
      difficulty: 'Easy',
      q: 'What does `git cherry-pick <commit-hash>` do?',
      options: [
        'Deletes the specified commit from the branch history',
        'Applies the changes introduced by an existing commit from another branch onto your current branch as a new commit',
        'Reverts the repository to the state of that exact commit hash permanently',
        'Merges two branches together excluding conflicting files'
      ],
      answer: 1
    },
    {
      topic: 'JavaScript Objects',
      difficulty: 'Intermediate',
      q: 'What is the primary difference between `Object.freeze()` and `Object.seal()` in JavaScript?',
      options: [
        '`Object.freeze()` prevents adding/deleting properties and mutating existing property values; `Object.seal()` allows modifying existing property values',
        '`Object.seal()` converts properties to private fields, while `Object.freeze()` deletes getters',
        '`Object.freeze()` works recursively on nested objects, whereas `Object.seal()` is shallow',
        'There is no difference in modern ES6 standard engines'
      ],
      answer: 0
    },

    // --- HARD ---
    {
      topic: 'React Fiber & Lifecycle',
      difficulty: 'Hard',
      q: 'How does `useLayoutEffect` differ from `useEffect` in React component rendering?',
      options: [
        '`useLayoutEffect` runs asynchronously after browser paint; `useEffect` runs synchronously before paint',
        '`useLayoutEffect` fires synchronously after all DOM mutations but BEFORE the browser repaints the screen, blocking painting',
        '`useLayoutEffect` can only be invoked within server-rendered components (SSR)',
        '`useLayoutEffect` automatically memoizes the component sub-tree'
      ],
      answer: 1
    },
    {
      topic: 'JavaScript Event Loop',
      difficulty: 'Hard',
      q: 'Consider the output order of the following snippet:\n`console.log(1); setTimeout(() => console.log(2), 0); Promise.resolve().then(() => console.log(3)); console.log(4);`',
      options: [
        '1, 2, 3, 4',
        '1, 4, 2, 3',
        '1, 4, 3, 2',
        '1, 3, 4, 2'
      ],
      answer: 2
    },
    {
      topic: 'CSS Stacking Context',
      difficulty: 'Hard',
      q: 'Which set of CSS properties will NOT create a new Stacking Context on an element?',
      options: [
        'position: absolute with z-index: 10',
        'opacity: 0.9',
        'transform: translate3d(0,0,0)',
        'margin: auto with position: static'
      ],
      answer: 3
    },
    {
      topic: 'Git Internals',
      difficulty: 'Hard',
      q: 'What is the fundamental architectural difference between `git merge --no-ff` and a fast-forward merge?',
      options: [
        '`--no-ff` forces Git to create a dedicated merge commit even if the target branch can be fast-forwarded, preserving historical branch topology',
        '`--no-ff` bypasses pre-commit hooks during the merge',
        'Fast-forward merges rewrite remote commit SHAs, whereas `--no-ff` does not',
        '`--no-ff` resolves merge conflicts automatically using the ours strategy'
      ],
      answer: 0
    },
    {
      topic: 'JavaScript Prototypes & Closures',
      difficulty: 'Hard',
      q: 'When an arrow function is defined within a JavaScript method, how is its `this` binding determined?',
      options: [
        'Dynamically at call time depending on how the function is invoked',
        'Lexically from the surrounding execution context where the arrow function was defined',
        'It is bound strictly to globalThis/window object',
        'It is bound to `undefined` in strict mode'
      ],
      answer: 1
    },
    {
      topic: 'Browser Performance',
      difficulty: 'Hard',
      q: 'What triggers a browser "Reflow" (Layout) phase as opposed to merely a "Repaint"?',
      options: [
        'Changing an element\'s `background-color` or `visibility`',
        'Modifying properties that affect element geometry, such as `width`, `font-size`, or querying `offsetHeight`',
        'Applying a 2D `transform: scale()` property',
        'Updating the `opacity` of an element using CSS animations'
      ],
      answer: 1
    },
    {
      topic: 'Web APIs & Security',
      difficulty: 'Hard',
      q: 'How does Cross-Origin Resource Sharing (CORS) preflight check work under the HTTP protocol?',
      options: [
        'The browser sends an HTTP `OPTIONS` request before non-simple requests to verify server permission headers',
        'The server requests client SSL certificates prior to returning JSON payloads',
        'The browser blocks incoming `GET` responses containing `Access-Control-Allow-Origin: *`',
        'The client encrypts request headers using a public key provided by the preflight endpoint'
      ],
      answer: 0
    },
    {
      topic: 'React Architecture',
      difficulty: 'Hard',
      q: 'What is the purpose of React\'s `useImperativeHandle` hook when used alongside `forwardRef`?',
      options: [
        'To force synchronous DOM updates without triggering state transitions',
        'To customize and restrict the instance value/methods exposed to parent components via a ref',
        'To bypass Virtual DOM reconciliation for third-party canvas animation libraries',
        'To create a global singleton store accessible across component boundaries'
      ],
      answer: 1
    }
  ]
};
