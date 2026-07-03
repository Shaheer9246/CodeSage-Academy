// =============================================================================
// PYTHON EXPERT TRACK — Lesson data
// =============================================================================
//
// STRUCTURE (READ THIS BEFORE ADDING LESSONS):
//   Each lesson uses the shared PythonLesson type (same shape as PYTHON_LESSONS).
//   You add lessons by calling the L(...) helper below. The signature is:
//
//     L(
//       id,          // string — MUST start with 'pyx-' (e.g. 'pyx-01', 'pyx-02')
//       order,       // number — display order (1..40)
//       title,       // string — short lesson title
//       icon,        // string — one emoji
//       philosophy,  // string — 1-3 sentences that hook the learner
//       concepts,    // Concept[] — 4 items: { title, beginner, advanced }
//       practical,   // { title, intro, steps[], goal, code? }
//       quiz,        // QuizQuestion[] — 4 items via q(question, options[], correctIdx, explanation)
//       keyTakeaways // string[] — 3-5 bullets shown on the completion card
//     )
//
//   Ordering & unlocking: `isPythonExpertLessonUnlocked` unlocks lesson N when
//   the previous lesson (order N-1) is in user.completedLessons. The very first
//   lesson (order === 1) is always unlocked.
//
// PATTERN GUIDELINES (match PYTHON_LESSONS for consistent UX):
//   • philosophy: motivate WHY this matters at expert level.
//   • concepts:   exactly 4 items, each with a beginner + advanced view.
//   • practical.steps: numbered, concrete, imperative ("Open a shell…", "Type…").
//     Wrap inline code in backticks so the UI renders it as <code>.
//   • quiz: 4 questions, exactly one correctIndex per question, always include a
//     short explanation string — learners rely on it.
//
// TO ADD LESSON N:
//   1. Append a new L(...) block to the PYTHON_EXPERT_LESSONS array below.
//   2. Use id 'pyx-NN' (zero-padded, e.g. 'pyx-02', 'pyx-03', …, 'pyx-40').
//   3. Set `order` to N.
//   4. Follow the exact same field pattern as the sample lesson.
//   5. No other files need to change — routing, the learn page, and the
//      completion flow already know how to render 'pyx-*' lessons.
//
// =============================================================================

import type { NetworkingLesson, Concept, QuizQuestion } from './networkingLessons';

export type PythonExpertLesson = NetworkingLesson;

const L = (
  id: string, order: number, title: string, icon: string, philosophy: string,
  concepts: Concept[], practical: PythonExpertLesson['practical'], quiz: QuizQuestion[],
  keyTakeaways: string[]
): PythonExpertLesson => ({
  id, module: 'Module 1: Python Expert', order, title, icon, philosophy,
  concepts, practical, quiz, keyTakeaways,
});

const q = (question: string, options: string[], correctIndex: number, explanation?: string): QuizQuestion =>
  ({ question, options, correctIndex, explanation });

export const PYTHON_EXPERT_LESSONS: PythonExpertLesson[] = [
  // -------------------------------------------------------------------------
  // SAMPLE LESSON — Use this as the template for the next 39 lessons.
  // -------------------------------------------------------------------------
  L(
    'pyx-01', 1, 'The CPython Object Model', '🧬',
    'At the expert tier we stop treating Python as a scripting language and start treating it as a runtime. Every value in CPython is a `PyObject` — a header carrying a type pointer and a reference count. Once you internalise this, features like descriptors, dunders, GIL behaviour and reference cycles stop being mysteries.',
    [
      {
        title: '1. Everything Is a PyObject',
        beginner: 'In Python, even numbers, functions, and classes are objects living on the heap. Variables are labels that point to those objects — not the objects themselves.',
        advanced: 'Every CPython value is a `PyObject` with an `ob_refcnt` reference count and an `ob_type` type pointer. Identity (`is`) compares pointers; equality (`==`) dispatches to `__eq__`. Immutable small ints (-5..256) and interned short strings are singletons shared across the interpreter.',
      },
      {
        title: '2. Reference Counting & the GC',
        beginner: 'Python cleans up memory automatically. When no name points to a value anymore, Python frees it. Sometimes objects reference each other in a loop — a separate garbage collector handles those.',
        advanced: 'CPython frees objects the moment `ob_refcnt` hits zero. A generational cyclic GC (`gc` module) periodically detects reference cycles among container types. Use `weakref` for parent pointers, caches, and observers to avoid pinning objects alive.',
      },
      {
        title: '3. Types, MRO, and Descriptors',
        beginner: 'A class defines how its instances behave. Python looks up attributes on the instance first, then walks the class hierarchy in a well-defined order.',
        advanced: 'Attribute lookup follows the C3 linearised MRO (`ClassName.__mro__`). Data descriptors (implementing `__set__`/`__delete__`) on the type win over instance `__dict__`; non-data descriptors lose to instance state. `property`, `classmethod`, and `staticmethod` are stock descriptor implementations.',
      },
      {
        title: '4. The GIL & Execution Model',
        beginner: 'Python runs one bytecode instruction at a time per interpreter. That is why raw CPU-bound threads do not go faster on multiple cores — you use processes or async instead.',
        advanced: 'The Global Interpreter Lock serialises access to CPython internals. I/O releases the GIL, so threads scale well for network work. For CPU-bound work reach for `multiprocessing`, `concurrent.futures.ProcessPoolExecutor`, C extensions that release the GIL (NumPy), or PEP 703 "no-GIL" builds when available.',
      },
    ],
    {
      title: 'Inspect CPython Internals from the REPL',
      intro: 'You are going to poke at Python from Python — read reference counts, identity, MRO, and disassembled bytecode. 🖥️ NOTE: If you prefer a larger workspace or want a bigger interface, feel free to open your own computer terminal, run the python interactive shell, and carry on with this practical assignment!',
      steps: [
        'Open a Python REPL by running `python` (or `python3`) in your terminal.',
        'Type `import sys` then `x = "codesage"` and inspect the reference count with `sys.getrefcount(x)`. Note that the return value is one higher than you expect because `getrefcount` itself holds a temporary reference.',
        'Confirm small-int interning: run `a = 256; b = 256; a is b` — that prints `True`. Then run `a = 257; b = 257; a is b` — that prints `False`. Explain to yourself why.',
        'Explore the MRO of a class: run `class A: pass`, `class B(A): pass`, `class C(A): pass`, `class D(B, C): pass`, then `D.__mro__`. Notice the C3 linearisation ordering.',
        'Disassemble a function to see the underlying bytecode: `import dis` then `def f(x): return x * 2 + 1` and `dis.dis(f)`. Read the opcodes and map them to what the function does.',
        'Create a reference cycle and watch the cyclic GC clean it up: `import gc, weakref; class N: pass; a = N(); b = N(); a.ref = b; b.ref = a; del a, b; gc.collect()`. The return value is the number of unreachable objects collected.',
        'Prove descriptors override instance dicts: `class T:` with a `@property` `value` returning `42`, then `t = T(); t.__dict__["value"] = 99; t.value` — you still get `42` because `property` is a data descriptor.',
      ],
      goal: 'You can explain why Python identity, memory, and attribute lookup behave the way they do — and you have proven each rule interactively.',
    },
    [
      q(
        'Which statement about `a is b` in CPython is correct?',
        [
          'It always returns `True` when `a == b`.',
          'It compares the underlying `PyObject *` pointers (object identity), not values.',
          'It is a shortcut for `hash(a) == hash(b)`.',
          'It only works for numbers and strings.',
        ],
        1,
        '`is` compares identity (pointers). Two equal but distinct objects can compare `==` yet be `is`-different.',
      ),
      q(
        'Why does `sys.getrefcount(x)` return a value that looks one too high?',
        [
          'CPython reserves one refcount for the garbage collector.',
          'The argument passed into `getrefcount` itself briefly holds a reference to the object.',
          'Reference counts are always reported plus one for safety.',
          'Because `x` is aliased in the REPL under `_`.',
        ],
        1,
        'Calling `getrefcount(x)` creates a temporary parameter binding, adding one to the count you observe.',
      ),
      q(
        'Given `class A: pass`, `class B(A): pass`, `class C(A): pass`, `class D(B, C): pass`, what does `D.__mro__` show first (after `D`)?',
        ['A', 'C', 'B', 'object'],
        2,
        'C3 linearisation preserves the order in which base classes are declared, so `B` appears before `C` in `D`\'s MRO.',
      ),
      q(
        'Which workload is LEAST helped by using Python threads under the standard CPython GIL?',
        [
          'Downloading many URLs in parallel',
          'Reading a batch of files from disk',
          'A pure-Python loop that crunches numbers',
          'Waiting on many database queries',
        ],
        2,
        'CPU-bound pure-Python code holds the GIL, so threads do not scale. Use processes, C extensions, or async I/O instead.',
      ),
    ],
    [
      'Every Python value is a `PyObject` with a type pointer and reference count.',
      'Reference counting frees most objects; a cyclic GC cleans up reference loops.',
      'Attribute lookup follows the C3 MRO; data descriptors on the type beat the instance `__dict__`.',
      'The GIL makes threads great for I/O and poor for CPU-bound pure-Python code.',
    ],
  ),

  

  // -------------------------------------------------------------------------
  // ADD NEXT LESSONS BELOW (pyx-02 through pyx-40) using the exact same L(...)
  // shape as the sample above. Do not change any other file — the routing,
  // learn list, and completion flow already handle every 'pyx-*' id.
  // -------------------------------------------------------------------------
];

export const getPythonExpertLessonById = (id: string) =>
  PYTHON_EXPERT_LESSONS.find(l => l.id === id);

export function isPythonExpertLessonUnlocked(lessonId: string, completed: string[]): boolean {
  const lesson = getPythonExpertLessonById(lessonId);
  if (!lesson) return false;
  if (lesson.order === 1) return true;
  const prev = PYTHON_EXPERT_LESSONS.find(l => l.order === lesson.order - 1);
  return !!prev && completed.includes(prev.id);
}
