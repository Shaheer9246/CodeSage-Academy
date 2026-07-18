// src/data/exams/python.ts

// We define the interfaces here so they can be exported and used by all other exam files.
// (You can also move these to a dedicated src/types/exam.ts file later if you prefer).
export type Difficulty = 'Easy' | 'Intermediate' | 'Hard';

export interface Question {
  q: string;
  options: string[];
  answer: number; // Index of the correct option
  topic: string;
  difficulty: Difficulty;
}

export interface ExamTrack {
  id: string;
  title: string;
  description: string;
  totalAvailable: number;
  questions: Question[];
}

export const pythonTrack: ExamTrack = {
  id: 'python',
  title: 'Python Developer',
  description: 'Master core Python, data structures, PEP 8, and object-oriented programming.',
  totalAvailable: 12,
  questions: [
    // --- EASY ---
    {
      topic: 'Core Concepts',
      difficulty: 'Easy',
      q: 'Which of the following data types is immutable in Python?',
      options: ['List', 'Dictionary', 'Set', 'Tuple'],
      answer: 3
    },
    {
      topic: 'Syntax',
      difficulty: 'Easy',
      q: 'What is the correct file extension for Python files?',
      options: ['.pt', '.pyt', '.py', '.pyth'],
      answer: 2
    },
    {
      topic: 'Variables',
      difficulty: 'Easy',
      q: 'How do you create a variable with the numeric value 5?',
      options: ['x = 5', 'int x = 5', 'x = int(5)', 'Both A and C are correct'],
      answer: 3
    },
    {
      topic: 'Syntax',
      difficulty: 'Easy',
      q: 'How do you insert comments in Python code?',
      options: ['// This is a comment', '/* This is a comment */', '# This is a comment', '<!-- This is a comment -->'],
      answer: 2
    },

    // --- INTERMEDIATE ---
    {
      topic: 'Data Structures',
      difficulty: 'Intermediate',
      q: 'What will be the output of: print([x for x in range(3)])?',
      options: ['[1, 2, 3]', '[0, 1, 2]', '0 1 2', 'TypeError'],
      answer: 1
    },
    {
      topic: 'Functions',
      difficulty: 'Intermediate',
      q: 'What keyword is used to create an anonymous function in Python?',
      options: ['def', 'anonymous', 'lambda', 'function'],
      answer: 2
    },
    {
      topic: 'Object-Oriented',
      difficulty: 'Intermediate',
      q: 'What does the __init__ method do in Python classes?',
      options: ['Destroys an object', 'Initializes a new class instance', 'Imports a module', 'Returns a string representation of the object'],
      answer: 1
    },
    {
      topic: 'Error Handling',
      difficulty: 'Intermediate',
      q: 'Which block lets you execute code, regardless of the result of the try-and-except blocks?',
      options: ['catch', 'finally', 'else', 'continue'],
      answer: 1
    },

    // --- HARD ---
    {
      topic: 'Advanced Concepts',
      difficulty: 'Hard',
      q: 'What is the Global Interpreter Lock (GIL) in CPython?',
      options: [
        'A module that secures Python scripts from malware',
        'A mutex that allows multiple threads to execute Python bytecodes simultaneously',
        'A mutex that protects access to Python objects, preventing multiple threads from executing Python bytecodes at once',
        'A built-in encryption standard for databases'
      ],
      answer: 2
    },
    {
      topic: 'Decorators',
      difficulty: 'Hard',
      q: 'Fundamentally, what is a decorator in Python?',
      options: [
        'A class that inherits from another class',
        'A function that takes another function and extends its behavior without explicitly modifying it',
        'A module used to style the terminal output',
        'A variable that cannot be reassigned'
      ],
      answer: 1
    },
    {
      topic: 'Memory Management',
      difficulty: 'Hard',
      q: 'How does Python handle memory management primarily?',
      options: [
        'Manual allocation and deallocation (malloc/free)',
        'Reference counting and a cyclic garbage collector',
        'A purely tracing Mark-and-Sweep garbage collector',
        'Operating system paging only'
      ],
      answer: 1
    },
    {
      topic: 'Advanced Data Structures',
      difficulty: 'Hard',
      q: 'Which of the following is true about a Python generator?',
      options: [
        'It evaluates all its items at once and stores them in memory.',
        'It uses the "yield" keyword and evaluates lazily, keeping a minimal memory footprint.',
        'It cannot be iterated over.',
        'It is just another name for a list comprehension.'
      ],
      answer: 1
    }
  ]
};
