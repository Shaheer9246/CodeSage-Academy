// src/data/exams/frontend.ts

import { ExamTrack } from './python';

export const frontendTrack: ExamTrack = {
  id: 'frontend',
  title: 'Frontend & Local Development',
  description: 'Test your skills in HTML, CSS, JavaScript, React, DOM manipulation, and Git version control.',
  totalAvailable: 12,
  questions: [
    // --- EASY ---
    {
      topic: 'HTML',
      difficulty: 'Easy',
      q: 'Which HTML tag is used to create a hyperlink?',
      options: ['<link>', '<a>', '<href>', '<url>'],
      answer: 1
    },
    {
      topic: 'CSS',
      difficulty: 'Easy',
      q: 'Which CSS property is used to change the background color of an element?',
      options: ['bgcolor', 'background-color', 'color-background', 'bg-color'],
      answer: 1
    },
    {
      topic: 'JavaScript',
      difficulty: 'Easy',
      q: 'Which operator is used for strict equality comparison in JavaScript?',
      options: ['=', '==', '===', '!='],
      answer: 2
    },
    {
      topic: 'Git',
      difficulty: 'Easy',
      q: 'What does the "git commit" command do?',
      options: [
        'Uploads code to a remote repository',
        'Saves a snapshot of your changes to the local repository',
        'Deletes untracked files',
        'Creates a new branch'
      ],
      answer: 1
    },

    // --- INTERMEDIATE ---
    {
      topic: 'DOM',
      difficulty: 'Intermediate',
      q: 'Which method selects the first element within the document that matches a specified CSS selector?',
      options: ['document.queryAll()', 'document.querySelector()', 'document.getElementById()', 'document.select()'],
      answer: 1
    },
    {
      topic: 'React',
      difficulty: 'Intermediate',
      q: 'Which React Hook is used to manage local state within a functional component?',
      options: ['useEffect', 'useState', 'useRef', 'useContext'],
      answer: 1
    },
    {
      topic: 'APIs',
      difficulty: 'Intermediate',
      q: 'What does the JavaScript fetch() API return?',
      options: ['A JSON object', 'A string of HTML', 'A Promise', 'An XMLHttpRequest object'],
      answer: 2
    },
    {
      topic: 'JavaScript',
      difficulty: 'Intermediate',
      q: 'What is the difference between "let" and "var" in JavaScript?',
      options: [
        '"let" is function-scoped, "var" is block-scoped',
        '"let" is block-scoped, "var" is function-scoped',
        'There is no difference',
        '"let" can only be used for numbers'
      ],
      answer: 1
    },

    // --- HARD ---
    {
      topic: 'React',
      difficulty: 'Hard',
      q: 'What happens if you omit the dependency array in a React useEffect hook?',
      options: [
        'The effect will never run',
        'The effect will only run once on initial mount',
        'The effect will run after every single render of the component',
        'React will throw a compilation error'
      ],
      answer: 2
    },
    {
      topic: 'JavaScript',
      difficulty: 'Hard',
      q: 'How does the JavaScript Event Loop handle Promises (Microtasks) versus setTimeout (Macrotasks)?',
      options: [
        'Macrotasks are executed before Microtasks',
        'Microtasks are executed immediately after the currently executing script, before any Macrotasks',
        'They are executed in the exact order they were created',
        'They are handled on separate CPU threads entirely'
      ],
      answer: 1
    },
    {
      topic: 'CSS',
      difficulty: 'Hard',
      q: 'In CSS Grid, what does the "1fr" unit represent?',
      options: [
        '1 pixel on a retina screen',
        '1 fraction of the available free space in the grid container',
        '1 percent of the viewport width',
        '1 fixed row height'
      ],
      answer: 1
    },
    {
      topic: 'Git',
      difficulty: 'Hard',
      q: 'What is the primary difference between "git merge" and "git rebase"?',
      options: [
        '"merge" creates a new commit tying two histories together, while "rebase" rewrites commit history by moving the branch base',
        '"merge" deletes the old branch, "rebase" keeps it',
        '"merge" only works on remote repositories, "rebase" is local only',
        'There is no functional difference; they are aliases of the same command'
      ],
      answer: 0
    }
  ]
};
