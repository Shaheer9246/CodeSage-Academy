// src/data/exams/python.ts

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
  description: 'Master core Python, data structures, OOP, metaprogramming, memory internals, and async execution.',
  totalAvailable: 24,
  questions: [
    // ================= EASY (6 Questions) =================
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
    {
      topic: 'Control Flow',
      difficulty: 'Easy',
      q: 'Which statement is used to skip the rest of the code in the current loop iteration and move to the next iteration?',
      options: ['break', 'continue', 'pass', 'skip'],
      answer: 1
    },
    {
      topic: 'Functions',
      difficulty: 'Easy',
      q: 'What keyword is used to define a standard function in Python?',
      options: ['func', 'function', 'def', 'create'],
      answer: 2
    },

    // ================= INTERMEDIATE (8 Questions) =================
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
    {
      topic: 'Functions & Defaults',
      difficulty: 'Intermediate',
      q: 'What is a common trap associated with passing a mutable object (e.g., list=[]) as a default argument in Python functions?',
      options: [
        'Python raises a SyntaxError at runtime.',
        'The default value is evaluated once when the function is defined, sharing the same object across subsequent calls.',
        'The list is automatically converted to an immutable tuple.',
        'The function cannot accept any additional positional arguments.'
      ],
      answer: 1
    },
    {
      topic: 'Copying Objects',
      difficulty: 'Intermediate',
      q: 'What is the primary difference between copy.copy() (shallow) and copy.deepcopy() (deep)?',
      options: [
        'Shallow copy works only on lists; deep copy works only on dictionaries.',
        'Shallow copy copies the top-level object but maintains references to nested objects; deep copy recursively copies all nested objects.',
        'Deep copy converts all data types into JSON strings.',
        'There is no difference in modern Python 3.10+.'
      ],
      answer: 1
    },
    {
      topic: 'Scope & Closures',
      difficulty: 'Intermediate',
      q: 'Which keyword allows you to modify a variable in an outer (non-global) enclosing scope inside a nested function?',
      options: ['global', 'nonlocal', 'outer', 'super'],
      answer: 1
    },
    {
      topic: 'Context Managers',
      difficulty: 'Intermediate',
      q: 'Which two dunder (magic) methods must a class implement to support the context manager ("with" statement) protocol?',
      options: ['__start__ and __stop__', '__open__ and __close__', '__enter__ and __exit__', '__init__ and __del__'],
      answer: 2
    },

    // ================= HARD (10 Questions - Advanced & Tough) =================
    {
      topic: 'Advanced Concepts',
      difficulty: 'Hard',
      q: 'What is the Global Interpreter Lock (GIL) in CPython?',
      options: [
        'A module that secures Python scripts from malware',
        'A mutex that allows multiple threads to execute Python bytecodes simultaneously',
        'A mutex that protects access to Python objects, preventing multiple threads from executing CPython bytecodes at once',
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
      q: 'How does CPython handle memory management primarily?',
      options: [
        'Manual allocation and deallocation (malloc/free)',
        'Reference counting supplemented by a cyclic garbage collector for detecting unreachable reference cycles',
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
    },
    {
      topic: 'Metaprogramming',
      difficulty: 'Hard',
      q: 'In Python, what is a Metaclass and what default metaclass creates all standard Python classes?',
      options: [
        'A subclass of object; default metaclass is object',
        'A class whose instances are classes themselves; default metaclass is type',
        'A decorator applied to class definitions; default metaclass is functools.wraps',
        'A module imported from sys; default metaclass is sys.Meta'
      ],
      answer: 1
    },
    {
      topic: 'OOP Internals',
      difficulty: 'Hard',
      q: 'What is the descriptor protocol in Python, and which magic methods define a data descriptor?',
      options: [
        'Methods that control dictionary keys: __getitem__ and __setitem__',
        'Objects implementing __get__, __set__, or __delete__ to override attribute lookup behavior on another class',
        'A mechanism for converting Python functions to C extensions',
        'Functions decorated with @classmethod and @staticmethod'
      ],
      answer: 1
    },
    {
      topic: 'Multiple Inheritance',
      difficulty: 'Hard',
      q: 'How does Python resolve method calls in complex multiple inheritance hierarchies?',
      options: [
        'Depth-First Search (DFS) left-to-right',
        'C3 Linearization Algorithm to generate the Method Resolution Order (MRO)',
        'Breadth-First Search (BFS)',
        'Random selection based on class creation timestamp'
      ],
      answer: 1
    },
    {
      topic: 'Optimization & Slots',
      difficulty: 'Hard',
      q: 'What happens when you define __slots__ = ("a", "b") inside a Python class definition?',
      options: [
        'It forces all instances to be saved to disk as binary tuples.',
        'It prevents the creation of instance __dict__ dictionaries, saving VRAM/RAM and restricting attribute creation to specified names.',
        'It converts the class methods into async coroutines.',
        'It encrypts class attributes at runtime.'
      ],
      answer: 1
    },
    {
      topic: 'Async Execution',
      difficulty: 'Hard',
      q: 'What happens if you execute a blocking I/O operation (like time.sleep(5) or requests.get()) directly inside an async def function without offloading it?',
      options: [
        'Asyncio automatically converts it to a non-blocking thread operation.',
        'It blocks the single-threaded Asyncio event loop, preventing all other scheduled coroutines from running until it finishes.',
        'An AsyncioThreadError is raised immediately.',
        'The loop skips that coroutine and discards its return value.'
      ],
      answer: 1
    },
    {
      topic: 'CPython Internals',
      difficulty: 'Hard',
      q: 'Why does print(a is b) return True for a = 256; b = 256, but False for a = 257; b = 257 in an interactive CPython shell?',
      options: [
        'CPython pre-allocates and caches small integers in the range [-5, 256] globally in memory.',
        '257 exceeds 8-bit memory boundaries.',
        'Odd integers are assigned new heap locations while even numbers use the stack.',
        'The "is" operator performs string comparison on numbers over 256.'
      ],
      answer: 0
    }
  ]
};
