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

  L(
    'pyx-02', 2, 'Advanced Metaprogramming', '🧠',
    'In standard Python, you use classes to create objects. But what creates the classes? Classes themselves are objects, created by Metaclasses. By hooking into the class creation process using `__new__`, `__init_subclass__`, or custom metaclasses, you can manipulate class definitions before they even exist in memory.',
    [
      {
        title: '1. Classes as Objects (`type`)',
        beginner: 'Just like `x = 5` creates an integer object, writing `class Foo:` creates a class object. You can pass classes around, assign them to variables, or create them on the fly using the `type()` function.',
        advanced: 'The `type` built-in is actually the default metaclass. Calling `type(name, bases, dict)` dynamically allocates a new class heap type at runtime. Every class you define implicitly calls `type` under the hood to construct itself.'
      },
      {
        title: '2. Allocation vs Initialization',
        beginner: 'Most developers think `__init__` creates an object. It doesn\'t! `__init__` just sets up the object after it\'s already been created. The actual creation happens in a method called `__new__`.',
        advanced: '`__new__(cls, *args, **kwargs)` is a static method responsible for allocating memory and returning the instance. `__init__` is then called on that returned instance. Overriding `__new__` is essential for subclassing immutable types (like `tuple` or `str`) or implementing the Singleton pattern.'
      },
      {
        title: '3. Metaclasses',
        beginner: 'A metaclass is a "class factory." If you want every class in your project to automatically have a specific method or follow a strict naming rule, a metaclass enforces those rules before the class is even finished loading.',
        advanced: 'By inheriting from `type`, you create a custom metaclass. Overriding `__new__` or `__init__` on the metaclass allows you to intercept the class dictionary, inject descriptors, or validate attributes during module import time (e.g., how Django ORM builds database models).'
      },
      {
        title: '4. The Modern Hook: `__init_subclass__`',
        beginner: 'Writing metaclasses is notoriously complex. Python 3.6 introduced a much easier way to track or modify child classes automatically when they inherit from your parent class.',
        advanced: '`__init_subclass__(cls, **kwargs)` is a class method called on the parent whenever a subclass is defined. It replaces metaclasses for 90% of use cases, making tasks like auto-registering plugins or validating child signatures vastly more readable and less prone to MRO conflicts.'
      }
    ],
    {
      title: 'Automated API Validation Registry',
      intro: 'We are going to build a plugin system where creating a new class automatically registers it into a central routing dictionary without writing any setup code. 🖥️ NOTE: If you prefer a larger workspace or want a bigger interface, feel free to open your computer terminal, run the python interactive shell, and carry on with this practical assignment!',
      steps: [
        'Open your REPL or an empty Python script.',
        'Define a global dictionary: `registry = {}`.',
        'Create a base class `PluginBase`. Inside it, define a classmethod: `def __init_subclass__(cls, **kwargs): super().__init_subclass__(**kwargs); registry[cls.__name__] = cls`.',
        'Define two child classes: `class AuthPlugin(PluginBase): pass` and `class CachePlugin(PluginBase): pass`.',
        'Print the `registry` dictionary. You will see both child classes automatically registered the moment they were defined, without you ever instantiating them.',
        'Now, build a Singleton using `__new__`: `class Singleton: _instance = None; def __new__(cls): if cls._instance is None: cls._instance = super().__new__(cls); return cls._instance`.',
        'Verify it: `a = Singleton(); b = Singleton(); print(a is b)` — it prints `True`.'
      ],
      goal: 'You have successfully intercepted the class creation pipeline, using Python\'s metaprogramming hooks to build self-registering architectures and memory-controlled Singletons.'
    },
    [
      q('What is the fundamental difference between `__new__` and `__init__`?', ['`__new__` initializes data, `__init__` allocates memory.', '`__new__` creates and returns the object instance, `__init__` sets up its initial state.', 'There is no difference; they are aliases for the same operation.', '`__new__` is only used in Metaclasses.'], 1, '`__new__` is the actual constructor that allocates memory and returns a new instance. `__init__` is the initializer that mutates the instance after it exists.'),
      q('If you call `type("MyClass", (object,), {"x": 5})`, what is the result?', ['It throws a TypeError.', 'It returns the string "MyClass".', 'It dynamically creates and returns a new class object named MyClass with an attribute x.', 'It instantiates an object of type MyClass.'], 2, 'The `type` function, when called with three arguments (name, bases, dict), acts as the default metaclass and dynamically constructs a new class type at runtime.'),
      q('Why was `__init_subclass__` introduced to Python?', ['To replace `__init__` entirely for performance reasons.', 'To provide a simpler, more readable alternative to metaclasses for tracking or modifying subclasses.', 'To prevent classes from being subclassed.', 'To allow multiple inheritance without the MRO.'], 1, '`__init_subclass__` allows a parent class to execute code whenever a subclass is defined, covering most plugin-registration and validation use cases without the complexity of a custom metaclass.'),
      q('In a custom metaclass, what does overriding `__new__` allow you to do?', ['Modify the class dictionary (methods, attributes) before the class is actually constructed.', 'Prevent the garbage collector from cleaning up the class.', 'Change how instances of the class are deleted.', 'Bypass the Global Interpreter Lock.'], 0, 'Metaclass `__new__` receives the class dictionary as an argument, allowing you to inject, alter, or validate class-level attributes before the class object is allocated in memory.')
    ],
    [
      'Classes are instances of Metaclasses; the default metaclass in Python is `type`.',
      '`__new__` handles object memory allocation, whereas `__init__` handles object initialization.',
      'Metaclasses intercept the creation of the class object itself, enabling strict validation and attribute injection.',
      '`__init_subclass__` is the modern, highly preferred way to build auto-registering plugins and subclass hooks.'
    ]
  ),

  L(
    'pyx-03', 3, 'Custom Descriptors & Hooks', '🪝',
    'When you type `obj.attribute`, Python does not just look in a dictionary. It triggers a complex chain of hooks. By mastering the Descriptor Protocol (`__get__`, `__set__`, `__delete__`) and dynamic attribute hooks (`__getattr__`), you can take absolute control over how data is accessed, validated, and computed in your applications.',
    [
      {
        title: '1. The Descriptor Protocol',
        beginner: 'A descriptor is any class that defines how its values are accessed or changed using `__get__`, `__set__`, or `__delete__`. When you assign this class to an attribute of another class, it takes over.',
        advanced: 'Descriptors must be instantiated at the class level (not in `__dict__`). When `instance.attr` is accessed, Python\'s `__getattribute__` checks the class dictionary. If the value has a `__get__` method, Python calls it instead of returning the object itself.'
      },
      {
        title: '2. Data vs. Non-Data Descriptors',
        beginner: 'If a descriptor only knows how to *read* data, instance variables can overwrite it. If it knows how to *write* data, it acts like an unbreakable forcefield around the attribute.',
        advanced: 'A "data descriptor" implements `__set__` or `__delete__` and always takes precedence over the instance `__dict__`. A "non-data descriptor" only implements `__get__` (like a standard method) and is shadowed if an attribute of the same name exists in the instance `__dict__`.'
      },
      {
        title: '3. `__getattr__` vs `__getattribute__`',
        beginner: 'These two sound identical but act differently. One is a safety net for missing attributes; the other is a strict gatekeeper for EVERY attribute.',
        advanced: '`__getattribute__` intercepts *every* dot access unconditionally (warning: highly prone to infinite recursion). `__getattr__` is only triggered as a fallback if the attribute is not found in the instance dict or class tree. Use `__getattr__` for dynamic APIs and lazy loading.'
      },
      {
        title: '4. Properties under the Hood',
        beginner: 'You have likely used the `@property` decorator to make a method look like a variable. Underneath, `@property` is just a built-in descriptor!',
        advanced: '`property()` is a C-implemented data descriptor. It takes `fget`, `fset`, and `fdel` functions. By writing your own custom descriptors, you can replicate `@property` but abstract the logic across multiple fields—perfect for building ORMs (Object-Relational Mappers).'
      }
    ],
    {
      title: 'Forge a Type-Enforced ORM Field',
      intro: 'We are going to build a custom data descriptor that strictly enforces data types on class attributes, similar to how SQLAlchemy or Pydantic works under the hood. 🖥️ NOTE: If you prefer a larger workspace or want a bigger interface, feel free to open your computer terminal, run the python interactive shell, and carry on with this practical assignment!',
      steps: [
        'Open your REPL.',
        'Create a descriptor class: `class StringField:`',
        'Add an `__init__(self, name)` to store the internal dictionary key.',
        'Add `def __get__(self, instance, owner): return instance.__dict__[self.name]`.',
        'Add `def __set__(self, instance, value): if not isinstance(value, str): raise TypeError("Must be string!"); instance.__dict__[self.name] = value`.',
        'Now, use it in a class: `class User: name = StringField("name")`.',
        'Test it: `u = User()`, then `u.name = "Alice"` (works!), then `u.name = 123` (raises your custom TypeError!).',
        'Test dynamic fallback: Add `def __getattr__(self, item): return f"Missing {item}"` to the `User` class. Try accessing `u.age`. It returns "Missing age" instead of an AttributeError.'
      ],
      goal: 'You have bypassed standard dictionary lookups and implemented property validation at the core CPython descriptor level.'
    },
    [
      q('What is the main difference between `__getattr__` and `__getattribute__`?', ['`__getattr__` is called for every access; `__getattribute__` is only called if the attribute is missing.', '`__getattribute__` intercepts all attribute lookups; `__getattr__` is a fallback for missing attributes.', '`__getattr__` handles methods, `__getattribute__` handles variables.', 'There is no difference.'], 1, '`__getattribute__` runs unconditionally on every single dot access. `__getattr__` is much safer as it only fires when an attribute cannot be found via normal MRO/dict lookups.'),
      q('What makes a class a "Data Descriptor"?', ['It inherits from the `Data` built-in class.', 'It implements `__get__` and strictly returns an integer or string.', 'It implements `__set__` or `__delete__`.', 'It saves data directly to a database.'], 2, 'Implementing `__set__` or `__delete__` elevates a descriptor to a "Data Descriptor," giving it priority over the instance\'s own dictionary during attribute lookup.'),
      q('Why must descriptors be instantiated at the class level (e.g., `name = StringField()`) rather than inside `__init__`?', ['Because `__init__` cannot instantiate objects.', 'Because the descriptor protocol is triggered by the class dictionary, not the instance dictionary.', 'To save memory in the garbage collector.', 'So they can bypass the Global Interpreter Lock.'], 1, 'Python\'s `__getattribute__` specifically checks the class definition (and its MRO) for descriptors. Putting them in `self.__dict__` inside `__init__` breaks the protocol.'),
      q('Which built-in Python feature is actually a data descriptor under the hood?', ['`list`', '`@property`', '`dict`', '`lambda`'], 1, 'The `@property` decorator is simply a convenient built-in class that implements the descriptor protocol (`__get__`, `__set__`, `__delete__`) using the functions you wrap.')
    ],
    [
      'The Descriptor Protocol (`__get__`, `__set__`, `__delete__`) overrides default attribute access.',
      'Data descriptors (implementing `__set__`) take absolute precedence over instance variables.',
      '`__getattribute__` fires on all lookups, while `__getattr__` is a safe fallback for missing attributes.',
      'Descriptors are the architectural foundation for ORMs, Type Checkers, and the `@property` decorator.'
    ]
  ),

  L(
    'pyx-04', 4, 'Generators & Custom Contexts', '⏳',
    'Expert Python doesn\'t load massive files into memory; it streams them. By mastering advanced generators and the Context Manager protocol (`__enter__` / `__exit__`), you can build state machines and safe resource handlers that guarantee memory efficiency and flawless tear-downs, even when exceptions occur.',
    [
      {
        title: '1. Generators as State Machines',
        beginner: 'A generator is a function that uses `yield` instead of `return`. It pauses its execution, hands a value back to you, and waits. When you ask for the next value, it picks up right where it left off.',
        advanced: 'Generators compile into objects holding a frame object (`gi_frame`) and an instruction pointer. They are cooperative state machines. Calling `next()` resumes the frame until the next `yield` opcode. When exhausted, they raise `StopIteration`.'
      },
      {
        title: '2. Coroutines: `send` and `throw`',
        beginner: 'Generators don\'t just output data; they can receive data too! You can send values directly into a paused generator, changing how it behaves on the fly.',
        advanced: 'By using `val = yield`, a generator becomes a coroutine. You use `gen.send(value)` to inject data back into the paused frame. `gen.throw(Exception)` injects an error into the generator, forcing it to handle it or crash. This is the historical foundation of Python\'s `asyncio`.'
      },
      {
        title: '3. The Context Manager Protocol',
        beginner: 'When you use `with open("file.txt") as f:`, Python ensures the file closes even if your code crashes. You can build this "safe zone" for your own objects using context managers.',
        advanced: 'The protocol requires `__enter__(self)` and `__exit__(self, exc_type, exc_val, traceback)`. If an exception occurs inside the `with` block, `__exit__` receives the exception details. Returning `True` from `__exit__` swallows the exception; returning `False` allows it to propagate.'
      },
      {
        title: '4. `@contextmanager` Generator Hook',
        beginner: 'Writing a full class with `__enter__` and `__exit__` is a lot of typing. Python provides a shortcut to turn a simple generator into a context manager.',
        advanced: '`contextlib.contextmanager` wraps a generator. Everything before the `yield` runs as `__enter__`. The `yield` yields the variable to the `as` clause. Everything after the `yield` (typically inside a `finally` block) runs as `__exit__`. It is elegant and highly pythonic.'
      }
    ],
    {
      title: 'Build an Atomic File Writer',
      intro: 'We are going to build a context manager that writes to a temporary file. If the write succeeds, it renames it to the real file. If an error happens, it deletes the temporary file, ensuring the original file is never corrupted. 🖥️ NOTE: If you prefer a larger workspace or want a bigger interface, feel free to open your computer terminal, run the python interactive shell, and carry on with this practical assignment!',
      steps: [
        'Open your REPL and run `import os` and `from contextlib import contextmanager`.',
        'Define the generator: `@contextmanager \n def atomic_write(filename): \n temp_file = filename + ".tmp"`.',
        'Open the temp file and yield it: `f = open(temp_file, "w") \n try: yield f`.',
        'Handle the success case: `except Exception: \n f.close(); os.remove(temp_file); raise`.',
        'Finalize the success case in an `else:` block: `f.close(); os.rename(temp_file, filename)`.',
        'Test a success: `with atomic_write("test.txt") as f: f.write("Success!")`. Check your directory; `test.txt` exists.',
        'Test a failure: `with atomic_write("test2.txt") as f: f.write("Fail!"); raise ValueError("Crash!")`. Check your directory; the temporary file was cleanly deleted and `test2.txt` was never created.'
      ],
      goal: 'You have mastered resource routing, utilizing generator state suspension and context management to create a resilient, atomic I/O operation.'
    },
    [
      q('What happens natively when a generator yields its final value and terminates?', ['It returns `None`.', 'It restarts from the beginning.', 'It raises a `StopIteration` exception.', 'It deletes itself from memory immediately.'], 2, 'When a generator function naturally reaches the end of its code block or hits a `return` statement, Python automatically raises `StopIteration` to signal exhaustion.'),
      q('What is the primary purpose of `generator.send(value)`?', ['To pass a new parameter to the generator\'s `__init__` method.', 'To inject a value back into the generator at the current `yield` expression.', 'To send the generator to another thread.', 'To reset the generator\'s internal state.'], 1, '`send()` resumes the generator and causes the `yield` expression where it was paused to evaluate to the injected value, enabling two-way coroutine communication.'),
      q('If an exception occurs inside a `with` block, how can a custom `__exit__` method prevent the program from crashing?', ['By calling `sys.exit(0)`.', 'By raising a different exception.', 'By returning the boolean `True`.', 'By yielding `None`.'], 2, 'If `__exit__` returns `True`, Python interprets this as "the exception has been handled safely" and suppresses the error, allowing the program to continue executing after the `with` block.'),
      q('When using `@contextmanager`, where should the cleanup code (like closing a connection) be placed?', ['Inside a `finally` block immediately following the `yield` statement.', 'Before the `yield` statement.', 'In a separate `__del__` method.', 'Inside the `except StopIteration` block.'], 0, 'Placing cleanup code in a `finally` block after the `yield` ensures that the teardown logic executes flawlessly, regardless of whether the `with` block completed successfully or crashed.')
    ],
    [
      'Generators act as cooperative state machines, pausing execution frames via `yield`.',
      'Using `.send()` and `.throw()` transforms generators from simple iterators into dynamic coroutines.',
      'The Context Manager Protocol (`__enter__` / `__exit__`) is the standard for bulletproof resource cleanup.',
      '`@contextmanager` elegantly combines generator states and `try/finally` blocks into clean, classless context managers.'
    ]
  ),

  L(
    'pyx-05', 5, 'Asyncio Engine Core', '⚡',
    'Modern high-performance Python relies heavily on asynchronous I/O. Instead of blocking while waiting for network requests or database queries, `asyncio` pauses the current function and switches to another. To master it, you must understand the Event Loop, the distinction between Coroutines and Tasks, and how to bridge synchronous code using executors.',
    [
      {
        title: '1. The Event Loop',
        beginner: 'Think of the event loop as a hyper-efficient traffic cop. When one car (function) gets stuck at a red light (waiting for data), the cop immediately directs another car to go. Nobody waits idly.',
        advanced: 'The event loop uses OS-level I/O multiplexing (`epoll` on Linux, `kqueue` on Mac). It keeps track of file descriptors and continuously polls them. When a socket is ready to read or write, the loop resumes the exact Python frame waiting on that descriptor.'
      },
      {
        title: '2. Coroutines vs. Tasks',
        beginner: 'Calling an `async def` function does not actually run it—it just creates a coroutine. To make it run concurrently in the background, you have to wrap it in a Task.',
        advanced: 'A Coroutine is just a generator-like state machine. A Task (`asyncio.create_task()`) is a wrapper that actively schedules the coroutine onto the Event Loop. Without a Task, coroutines only execute sequentially when explicitly `await`ed.'
      },
      {
        title: '3. Futures & Awaitables',
        beginner: 'A Future is like a restaurant buzzer. It is an empty placeholder that says, "I don\'t have your data yet, but I will buzz you when I do."',
        advanced: 'Any object that implements `__await__` is an "awaitable." Futures are low-level awaitables representing the eventual result of an asynchronous operation. Tasks actually inherit from Futures, adding the ability to step through a coroutine\'s execution.'
      },
      {
        title: '4. Blocking the Loop',
        beginner: 'The golden rule of asyncio: Never use `time.sleep()` or standard `requests.get()`. Because there is only one traffic cop, if one car stalls in the intersection, the entire city stops moving.',
        advanced: 'If you must run CPU-bound work or legacy blocking I/O (like SQLAlchemy 1.x), you must offload it to a separate thread or process pool using `loop.run_in_executor()`. This prevents the main thread\'s loop from stalling.'
      }
    ],
    {
      title: 'Code an Async TCP Scanner',
      intro: 'We are going to build an asynchronous port scanner that checks hundreds of network ports concurrently in a fraction of a second, vastly outperforming standard blocking loops. 🖥️ NOTE: If you prefer a larger workspace or want a bigger interface, feel free to open your computer terminal, run the python interactive shell, and carry on with this practical assignment!',
      steps: [
        'Open your REPL or an empty script. Import modules: `import asyncio`',
        'Write the check function: `async def check_port(host, port): \n try: \n  await asyncio.wait_for(asyncio.open_connection(host, port), timeout=0.5) \n  print(f"Port {port} is OPEN") \n except Exception: pass`',
        'Write the main loop: `async def main(): \n tasks = [asyncio.create_task(check_port("8.8.8.8", p)) for p in [53, 80, 443, 8080, 22]] \n await asyncio.gather(*tasks)`',
        'Run it: `asyncio.run(main())`. Notice how all ports are checked simultaneously; the entire script finishes in ~0.5 seconds regardless of how many ports fail.',
        'Now add a simulated blocking function: `import time \n def bad_sleep(): time.sleep(2)`. Call this inside `check_port` and watch the concurrent performance completely collapse.'
      ],
      goal: 'You successfully utilized the event loop to multiplex network I/O, proving that `asyncio` can handle massive concurrency natively—provided the loop remains unblocked.'
    },
    [
      q('What is the actual difference between an asyncio Coroutine and a Task?', ['A Coroutine runs in a separate thread; a Task runs in the main thread.', 'Calling a Coroutine executes it immediately; a Task delays execution.', 'A Coroutine is an unstarted state machine; a Task schedules that state machine onto the event loop to run concurrently.', 'They are synonymous in Python 3.10+.'], 2, 'Simply calling `async_func()` returns a coroutine object but does not execute it. Wrapping it via `asyncio.create_task(async_func())` informs the event loop to actively drive its execution.'),
      q('Why is calling `time.sleep()` disastrous in an asyncio program?', ['It triggers a `RuntimeError` immediately.', 'It halts the underlying OS thread, preventing the single-threaded event loop from processing any other concurrent tasks.', 'It consumes massive amounts of memory by keeping coroutines open.', 'It randomly kills pending Futures.'], 1, 'Asyncio is single-threaded. `time.sleep()` blocks the actual OS thread, completely stopping the event loop from polling file descriptors or resuming other tasks.'),
      q('If you have a CPU-intensive math calculation, how should you execute it within an asyncio application?', ['Wrap it in `asyncio.create_task()`.', 'Add `await` before the function call.', 'Pass the function to `loop.run_in_executor()` using a ProcessPoolExecutor.', 'Use `yield from` instead of `await`.'], 2, 'CPU-bound operations will block the loop. You must offload them to a separate process (or thread for pure C-extensions) using executors, allowing the main event loop to remain unblocked.'),
      q('Which underlying operating system mechanism powers the Python event loop\'s ability to monitor thousands of network connections efficiently?', ['The Global Interpreter Lock (GIL)', 'Multithreading contexts', 'I/O multiplexing system calls like `epoll` or `kqueue`', 'Subprocess Pipes'], 2, 'The event loop relies on low-level OS multiplexing (`epoll` on Linux, `kqueue` on BSD/Mac). These system calls allow a single thread to monitor thousands of file descriptors efficiently without polling them individually.')
    ],
    [
      'The Event Loop is a single-threaded infinite loop that uses OS multiplexing to resume paused I/O tasks.',
      'Coroutines are state machines; they must be wrapped in `Task` objects to run concurrently in the background.',
      'Never run blocking I/O or CPU-bound code directly in an `async` function; use `run_in_executor`.',
      'Futures are low-level awaitables that represent data that will eventually resolve.'
    ]
  ),

  L(
    'pyx-06', 6, 'High-Performance Parallelism', '🚀',
    'When you need to crush massive amounts of mathematical data or process heavy image files, threading and `asyncio` won\'t save you because of the Global Interpreter Lock (GIL). To achieve true parallelism, you must spin up separate OS processes, manage Inter-Process Communication (IPC), and avoid memory serialization bottlenecks.',
    [
      {
        title: '1. Bypassing the GIL',
        beginner: 'Python threads can\'t run Python code on multiple CPU cores at the exact same time. To use all your cores, you use the `multiprocessing` module to launch entirely separate Python programs that work together.',
        advanced: 'Each subprocess has its own GIL, its own memory space, and its own Python interpreter. While this achieves true multi-core CPU utilization, spinning up processes takes significant OS resources and introduces memory isolation.'
      },
      {
        title: '2. IPC: Queues & Pipes',
        beginner: 'Because separate processes have separate memory, they can\'t just share a standard list or dictionary. They have to pass messages to each other using Queues, like sending mail between houses.',
        advanced: 'Inter-Process Communication (IPC) relies on Pickling (serialization) to convert Python objects into byte streams, pushing them through OS-level pipes, and unpickling them on the other side. This serialization overhead can sometimes destroy the performance gains of parallelization.'
      },
      {
        title: '3. Process Pools & Chunking',
        beginner: 'Instead of manually starting and stopping 100 processes for 100 tasks, you create a "Pool" of workers (e.g., 8 workers for an 8-core CPU) and feed them tasks from a queue.',
        advanced: 'Using `concurrent.futures.ProcessPoolExecutor` is standard. The key to performance is "chunksize". Sending 1,000,000 tiny tasks over IPC will throttle the system; grouping them into 1,000 chunks of 1,000 tasks minimizes IPC serialization overhead.'
      },
      {
        title: '4. Shared Memory & Managers',
        beginner: 'If you absolutely must share a live dictionary between processes, Python provides "Managers." But for ultimate speed, you can carve out raw memory in your computer\'s RAM that all processes can read instantly.',
        advanced: '`multiprocessing.Manager` creates a server process that holds objects and provides proxies to other processes—safe, but slow due to network/IPC overhead. Python 3.8+ introduced `multiprocessing.shared_memory`, allowing direct, zero-copy access to raw memory blocks (perfect for massive NumPy arrays).'
      }
    ],
    {
      title: 'Parallel CPU Chunk Pipeline',
      intro: 'We are going to prove that threading fails for CPU-bound tasks in Python, and write a parallelized mathematical cruncher utilizing ProcessPoolExecutor to max out your CPU cores. 🖥️ NOTE: If you prefer a larger workspace or want a bigger interface, feel free to open your computer terminal, run the python interactive shell, and carry on with this practical assignment!',
      steps: [
        'Open a Python script file (not REPL, as multiprocessing on Windows requires `if __name__ == "__main__":`).',
        'Write a heavy CPU task: `def heavy_math(x): return sum(i * i for i in range(10_000_000))`',
        'Import tools: `import time; from concurrent.futures import ProcessPoolExecutor, ThreadPoolExecutor`',
        'Time the ThreadPool: `start = time.time()` \n `with ThreadPoolExecutor() as ex: list(ex.map(heavy_math, range(4)))` \n `print(f"Threads: {time.time() - start}")`. (It will be slow!).',
        'Time the ProcessPool: `start = time.time()` \n `with ProcessPoolExecutor() as ex: list(ex.map(heavy_math, range(4)))` \n `print(f"Processes: {time.time() - start}")`. (It will be significantly faster on a multi-core machine!).',
        'Bonus: Notice that if you change `heavy_math` to sleep for 2 seconds (`time.sleep(2)`), both Threads and Processes take ~2 seconds. The GIL only restricts CPU execution, not I/O waits.'
      ],
      goal: 'You have quantified the GIL\'s restriction on CPU-bound threading and successfully bypassed it by architecting a true multi-core process pool.'
    },
    [
      q('Why does the `multiprocessing` module bypass the Global Interpreter Lock (GIL)?', ['It disables the GIL entirely at the C compiler level.', 'It uses C-extensions for all underlying code.', 'It spawns independent Python interpreter instances at the OS level, each possessing its own GIL and isolated memory space.', 'It converts Python code to asynchronous coroutines.'], 2, 'The multiprocessing module doesn\'t remove the GIL; it circumvents it by running multiple separate Python programs. Because they are separate OS processes, they don\'t share the same memory or lock.'),
      q('What is a major performance bottleneck to watch out for when passing data between multiple processes?', ['Data must be serialized (Pickled) and deserialized, which incurs high CPU and memory overhead.', 'The processes will constantly trigger the garbage collector.', 'The OS will randomly pause processes to sync their clocks.', 'Child processes cannot use the `math` module.'], 0, 'Because memory is isolated, Python must Pickle (convert to bytes) objects in Process A, push them through an OS pipe, and unpickle them in Process B. For massive datasets, this overhead can ruin your parallel speedup.'),
      q('When using `ProcessPoolExecutor.map()`, what does the `chunksize` argument optimize?', ['It limits how much memory the Python interpreter is allowed to consume.', 'It batches multiple iterables together into a single IPC transfer, minimizing serialization and pipe overhead.', 'It divides the CPU cores into logical chunks.', 'It determines the size of the shared memory block.'], 1, 'Chunking groups many small tasks together before passing them through the IPC pipeline. This drastically reduces the overhead of constantly serializing and passing single items back and forth.'),
      q('If you need multiple processes to read and write to the same massive multidimensional array with maximum performance, what should you use?', ['`multiprocessing.Queue`', '`multiprocessing.Manager().list()`', '`multiprocessing.shared_memory` (and tools like NumPy)', 'A temporary SQLite database'], 2, '`shared_memory` allows multiple processes to map the exact same block of raw RAM without pickling, IPC pipes, or proxies. It offers true zero-copy performance.')
    ],
    [
      'The multiprocessing module achieves true CPU parallelism by spawning entirely isolated Python interpreters.',
      'Inter-Process Communication (IPC) requires Pickling, making it dangerous for passing massive datasets back and forth.',
      'ProcessPoolExecutor handles worker management automatically; utilize `chunksize` to mitigate IPC overhead.',
      'Use `shared_memory` for zero-copy data sharing, avoiding the severe performance hits of proxy Managers.'
    ]
  ),

  L(
    'pyx-07', 7, 'Advanced Function & Class Decorators', '🎁',
    'Decorators are the backbone of Python frameworks like Flask, FastAPI, and Pytest. Moving beyond basic `@timer` functions, expert metaprogramming requires parameterized decorators, preserving signatures with `wraps`, dynamic argument inspection, and wrapping entire classes.',
    [
      {
        title: '1. The Anatomy of a Closure',
        beginner: 'A decorator is just a function that takes another function, adds some behavior, and returns a new function. It remembers the variables from the outside function using something called a "closure".',
        advanced: 'Closures occur when a nested function references variables from its enclosing scope. Python stores these references in the `__closure__` attribute. This late-binding scope resolution is what allows decorators to maintain state between executions.'
      },
      {
        title: '2. Parameterized Decorators',
        beginner: 'If you want a decorator that takes arguments, like `@retry(times=3)`, you have to write a function inside a function inside a function! It creates a factory that builds your decorator.',
        advanced: 'A parameterized decorator requires three layers: The outer factory (takes arguments), the middle decorator (takes the function), and the inner wrapper (takes the `*args, **kwargs`). Alternatively, implementing `__call__` on a class makes stateful decorators much easier to read.'
      },
      {
        title: '3. Signature Preservation (`wraps`)',
        beginner: 'When you wrap a function, its name and documentation get overwritten by the wrapper function. You use `@wraps` to copy the original function\'s identity back onto the wrapper.',
        advanced: '`functools.wraps` copies `__name__`, `__doc__`, and `__annotations__`. For advanced framework development, you use `inspect.signature()` to deeply introspect the wrapped function, allowing your decorator to magically inject dependencies (like FastAPI does with routes).'
      },
      {
        title: '4. Class Decorators',
        beginner: 'Decorators aren\'t just for functions. You can put a decorator above a `class` definition to automatically modify the class, add methods, or register it into a system.',
        advanced: 'A class decorator receives the class object itself. It is a lighter, simpler alternative to Metaclasses or `__init_subclass__` for tasks like wrapping all methods with logging, implementing Singleton logic, or dataclass-style automatic `__init__` generation.'
      }
    ],
    {
      title: 'Build an Enterprise Rate-Limiter',
      intro: 'We are going to build a highly advanced, parameterized class-based decorator that tracks function execution times and enforces a strict rate limit, utilizing stateful closures. 🖥️ NOTE: If you prefer a larger workspace or want a bigger interface, feel free to open your computer terminal, run the python interactive shell, and carry on with this practical assignment!',
      steps: [
        'Open your REPL or script.',
        'Create a class-based decorator: `class RateLimit:` \n `def __init__(self, max_per_sec): self.max = max_per_sec; self.calls = []`',
        'Implement `__call__`: `def __call__(self, func):` \n `import time; from functools import wraps` \n `@wraps(func) \n def wrapper(*args, **kwargs):`',
        'Add the logic inside the wrapper: `now = time.time(); self.calls = [t for t in self.calls if now - t < 1.0]` \n `if len(self.calls) >= self.max: raise Exception("Rate Limit Exceeded!")` \n `self.calls.append(now); return func(*args, **kwargs)`',
        'Return the wrapper: `return wrapper` at the end of the `__call__` method.',
        'Use it: `@RateLimit(max_per_sec=2) \n def fetch_data(): print("Fetching...")`',
        'Test it: Call `fetch_data()` three times rapidly. The first two will print, and the third will immediately raise your custom Exception!'
      ],
      goal: 'You have abstracted complex stateful logic (rate limiting) entirely away from your business logic, utilizing class-based decorators and `functools.wraps`.'
    },
    [
      q('When building a decorator that accepts arguments (e.g., `@retry(retries=3)`), using standard functions, how many layers of nested functions are required?', ['One', 'Two', 'Three', 'Four'], 2, 'Three layers are required: Layer 1 takes the arguments (`retries=3`), Layer 2 takes the callable (`func`), and Layer 3 (the wrapper) catches the execution arguments (`*args, **kwargs`).'),
      q('What is the primary function of `functools.wraps`?', ['It safely handles exceptions raised inside decorators.', 'It forces the wrapped function to execute inside a separate thread.', 'It copies metadata (like `__name__`, `__doc__`, and signatures) from the original function to the wrapper function.', 'It compiles the function into optimized C code.'], 2, 'Without `@wraps`, the decorated function loses its identity, appearing as "wrapper" to debuggers, profilers, and help() menus. `wraps` restores the original metadata.'),
      q('Why might an architect choose a Class Decorator over a Metaclass to add a standard `__repr__` method to several classes?', ['Class decorators are evaluated before the class dict is created, making them safer.', 'Class decorators bypass the MRO entirely.', 'Class decorators apply logic to the class *after* creation and are generally simpler and more explicit to read than metaclasses.', 'Metaclasses cannot modify `__repr__`.'], 2, 'Metaclasses are heavy and can cause MRO conflicts when multiple inheritances are involved. Class decorators simply receive the fully constructed class and return it modified, making them highly composable.'),
      q('If a decorator modifies a function\'s arguments dynamically before executing it, how can the decorator programmatically figure out what arguments the original function expects?', ['By reading `sys.argv`.', 'By analyzing `inspect.signature(func)`.', 'By parsing the `__doc__` string.', 'It is impossible in Python.'], 1, 'The `inspect` module (specifically `inspect.signature()`) allows metaprogrammers to deeply analyze the exact parameters, defaults, and type hints of a function at runtime.')
    ],
    [
      'A decorator is a Higher-Order Function that leverages closures to retain state and variable access.',
      'Parameterized decorators require three nested functions, though class-based decorators implementing `__call__` offer cleaner state management.',
      'Always use `@wraps` to preserve function identity, docstrings, and typing metadata.',
      'Class decorators provide a clean, composable alternative to Metaclasses for post-creation class mutation.'
    ]
  ),

  L(
    'pyx-08', 8, 'Memory Optimization & Control', '💾',
    'Python is notoriously memory-hungry because every object carries significant overhead. When scaling systems to handle millions of objects, you cannot rely on the default garbage collector. You must actively optimize memory allocation by stripping away dynamic dictionaries, utilizing unboxed arrays, and performing zero-copy memory operations.',
    [
      {
        title: '1. The `__dict__` Overhead',
        beginner: 'By default, every custom object you create has a hidden dictionary (`__dict__`) that stores its variables. Dictionaries are incredibly fast, but they consume a massive amount of RAM.',
        advanced: 'A completely empty class instance in CPython takes roughly 48 bytes. The moment you add an attribute, Python allocates a dictionary, instantly adding over 100 bytes of overhead. Multiply that by 10 million objects, and you lose gigabytes of RAM to structural overhead alone.'
      },
      {
        title: '2. Restricting Memory with `__slots__`',
        beginner: 'You can tell Python, "I only want exactly these three variables on my class, and no more." By doing this, Python refuses to build the hidden dictionary, saving enormous amounts of memory.',
        advanced: 'Defining `__slots__ = ("name", "id")` instructs the C struct to allocate memory strictly for those specific pointers. It completely disables the instance `__dict__` and `__weakref__`. This reduces memory usage by up to 60% and slightly speeds up attribute access.'
      },
      {
        title: '3. Lists vs. Arrays',
        beginner: 'A Python `list` can hold anything—a string, an integer, and a custom class, all at once. But this flexibility costs memory. If you only need to store numbers, standard lists are terribly inefficient.',
        advanced: 'A Python `list` is actually an array of pointers to `PyObject`s scattered across the heap. The `array` module (e.g., `array.array("i")`) allocates a continuous block of unboxed C integers. It destroys the flexibility of standard lists but provides massive cache locality and RAM savings.'
      },
      {
        title: '4. Zero-Copy with `memoryview`',
        beginner: 'If you have a massive 1GB file loaded in memory and you want to slice the first half of it, standard Python creates a brand new 500MB copy. `memoryview` lets you look at that half without copying it.',
        advanced: '`memoryview` exposes the C-level buffer protocol. When you slice a `memoryview`, it simply returns a new view object pointing to the original memory address with modified offsets and strides. This allows for zero-copy binary data manipulation.'
      }
    ],
    {
      title: 'Analyze Object Memory Footprints',
      intro: 'We are going to use the `sys` module to deeply inspect exactly how much RAM different Python data structures consume, proving the power of `__slots__`. 🖥️ NOTE: If you prefer a larger workspace or want a bigger interface, feel free to open your computer terminal, run the python interactive shell, and carry on with this practical assignment!',
      steps: [
        'Open your REPL and run `import sys`.',
        'Create a standard class: `class NormalUser: \n def __init__(self): self.name = "A"; self.id = 1`',
        'Create a slotted class: `class SlottedUser: \n __slots__ = ("name", "id") \n def __init__(self): self.name = "A"; self.id = 1`',
        'Instantiate both: `n = NormalUser(); s = SlottedUser()`',
        'Check the base size: `print(sys.getsizeof(n))` vs `print(sys.getsizeof(s))`. You will immediately see `SlottedUser` is smaller.',
        'But wait, check the dictionary! Run `print(sys.getsizeof(n.__dict__))`. The normal user secretly hides a massive dictionary footprint that `getsizeof(n)` does not automatically recursively count.',
        'Try to run `s.__dict__`. It raises an AttributeError because slotted classes do not have dictionaries!'
      ],
      goal: 'You successfully visualized the hidden memory overhead of Python objects and implemented structural restrictions to drastically reduce application RAM consumption.'
    },
    [
      q('What is the primary technical drawback of using `__slots__` in a class?', ['It makes attribute access significantly slower.', 'It prevents the class from using standard inheritance, disabling dynamic attribute assignment and breaking some metaprogramming tools.', 'It causes the Garbage Collector to ignore the object entirely.', 'It prevents the object from being passed into a function.'], 1, 'Because `__slots__` destroys the `__dict__`, you can no longer assign new, arbitrary attributes to the object at runtime. It also complicates multiple inheritance setups.'),
      q('Why does an `array.array("i", [1, 2, 3])` use less memory than `[1, 2, 3]`?', ['Because arrays automatically compress data into ZIP formats.', 'Because lists store a pointer to a separate PyObject for every single element, whereas arrays store raw, unboxed C values continuously in memory.', 'Because arrays delete elements after they are read once.', 'Because lists allocate memory for 100 elements even when empty.'], 1, 'Standard lists require a PyObject header (type and refcount) for every single item, plus a pointer. Arrays bypass PyObjects entirely, storing bare C primitives sequentially.'),
      q('If you execute `data = my_bytes[0:1000]`, what happens in memory?', ['Python creates a brand new 1000-byte object and copies the data into it.', 'Python creates a pointer to the original memory address.', 'Python deletes the original bytes.', 'Python compresses the bytes.'], 0, 'Standard slicing natively creates a new copy of the data. To avoid this costly allocation, you must wrap the bytes in a `memoryview` first.'),
      q('Which built-in module exposes the exact byte-size of a Python object?', ['`os.size()`', '`memory.footprint()`', '`sys.getsizeof()`', '`gc.sizeof()`'], 2, '`sys.getsizeof()` queries the object\'s C struct for its exact size in memory. However, remember that it is not recursive—it will not weigh the contents of containers natively.')
    ],
    [
      'Every dynamic Python object carries a hidden, memory-heavy `__dict__`.',
      'Declaring `__slots__` strips the dictionary, rigidly defining attributes to save massive amounts of RAM.',
      'For numerical sequences, `array.array` offers dense C-level memory packing compared to standard lists.',
      '`memoryview` utilizes the buffer protocol to allow zero-copy slicing of binary data.'
    ]
  ),

  L(
    'pyx-09', 9, 'Structural Design & Protocols', '🏗️',
    'Enterprise Python requires strict contracts between modules. For years, developers used heavy inheritance (Abstract Base Classes) to enforce these rules. Modern Python has shifted toward Structural Subtyping via `typing.Protocol`—allowing you to strictly verify behavior at compile-time without tightly coupling your architecture together.',
    [
      {
        title: '1. Duck Typing (The Dynamic Way)',
        beginner: 'If it walks like a duck and quacks like a duck, Python treats it like a duck. If an object has a `.save()` method, Python will let you call `.save()` on it, completely ignoring what class it belongs to.',
        advanced: 'Dynamic Duck Typing enables rapid prototyping but becomes a nightmare in massive systems. If a developer accidentally renames `.save()` to `.commit()`, the error won\'t be caught until the code executes in production and crashes.'
      },
      {
        title: '2. Abstract Base Classes (Nominal)',
        beginner: 'To fix random crashing, we use ABCs. You create a master "Storage" class that forces all child classes to have a `.save()` method. If a child forgets it, Python crashes immediately when you start the program.',
        advanced: 'ABCs (`abc.ABC`) enforce "Nominal Subtyping." An object is only valid if it explicitly inherits from the ABC (`class Disk(Storage):`). This creates tight, rigid coupling across codebases and makes mocking third-party libraries difficult.'
      },
      {
        title: '3. Protocols (Structural Subtyping)',
        beginner: 'Protocols give you the best of both worlds. You write a rule saying "I need an object with a `.save()` method." You don\'t force classes to inherit anything. The type checker automatically verifies if the object matches the rule.',
        advanced: '`typing.Protocol` implements static structural subtyping. Tools like `mypy` inspect the structural layout of a class (its methods and signatures). If it matches the Protocol, it passes type-checking, achieving compile-time Duck Typing with zero runtime coupling.'
      },
      {
        title: '4. `@runtime_checkable`',
        beginner: 'Usually, type hints are ignored when the code actually runs. But by adding a special decorator to your Protocol, you can make Python check the rules while the program is actively running!',
        advanced: 'Applying `@runtime_checkable` to a `Protocol` allows you to use `isinstance(obj, MyProtocol)`. Under the hood, Python dynamically checks `obj.__class__` to see if it possesses the methods defined in the protocol. Note: it only checks method names, not their type signatures.'
      }
    ],
    {
      title: 'Build a Plug-and-Play Architecture',
      intro: 'We are going to define a formal Protocol and prove that objects can satisfy strict typing requirements without ever inheriting from a parent base class. 🖥️ NOTE: If you prefer a larger workspace or want a bigger interface, feel free to open your computer terminal, run the python interactive shell, and carry on with this practical assignment!',
      steps: [
        'Open your REPL.',
        'Import tools: `from typing import Protocol, runtime_checkable`',
        'Define a runtime Protocol: \n `@runtime_checkable \n class Logger(Protocol): \n  def log(self, msg: str) -> None: ...`',
        'Create a class that DOES NOT inherit from Logger: \n `class ConsoleLogger: \n  def log(self, msg: str): print(msg)`',
        'Create a class that fails the rule: \n `class BadLogger: \n  def print_out(self, msg: str): print(msg)`',
        'Test them dynamically: run `print(isinstance(ConsoleLogger(), Logger))` — it prints `True`! Python structurally verified the `.log()` method exists.',
        'Run `print(isinstance(BadLogger(), Logger))` — it prints `False`! It protected your system without using rigid inheritance.'
      ],
      goal: 'You have implemented structural subtyping, allowing discrete systems to interact through behavioral contracts rather than heavy, nominal class inheritance.'
    },
    [
      q('What is the defining characteristic of "Nominal Subtyping" (like standard Abstract Base Classes)?', ['It relies entirely on duck typing.', 'It requires explicit, named inheritance (e.g., `class A(Base):`).', 'It is only checked by the garbage collector.', 'It allows objects to dynamically change types.'], 1, 'Nominal typing requires an explicit declaration of a relationship. A class is only considered a subtype if its definition literally names the parent class in its inheritance list.'),
      q('How does `typing.Protocol` differ from `abc.ABC`?', ['Protocols are much slower at runtime than ABCs.', 'Protocols force you to write the method logic inside the Protocol definition.', 'Protocols allow type checkers to verify structural compatibility without requiring explicit inheritance.', 'Protocols cannot contain methods, only variables.'], 2, 'Protocols enable compile-time Duck Typing. A class implicitly satisfies a Protocol simply by possessing the required methods, completely decoupling the implementation from the interface definition.'),
      q('What is a limitation of using the `@runtime_checkable` decorator with Protocols?', ['It crashes if you use `isinstance()`.', 'It checks that the method names exist, but it cannot verify if the method\'s runtime arguments or return types match the Protocol.', 'It permanently alters the MRO of the class.', 'It deletes the type annotations from memory.'], 1, 'At runtime, `@runtime_checkable` simply uses `hasattr` to verify that the required method names exist on the object. It does not perform deep signature validation during execution.'),
      q('Why is structural subtyping highly preferred in modern enterprise architectures over deep inheritance trees?', ['Because it makes the code execute 10x faster.', 'It prevents the Global Interpreter Lock from blocking.', 'It allows highly decoupled architectures where modules only depend on behavior, making testing and refactoring drastically easier.', 'It automatically serializes objects to JSON.'], 2, 'Decoupling is the primary goal of expert architecture. Protocols allow you to swap out databases, loggers, or APIs easily, as long as the new object matches the required structural behavior.')
    ],
    [
      'Dynamic Duck Typing is flexible but prone to catastrophic runtime errors in large systems.',
      'Abstract Base Classes enforce Nominal Subtyping, creating heavily coupled inheritance chains.',
      '`typing.Protocol` introduces compile-time Structural Subtyping, decoupling interfaces from implementations.',
      '`@runtime_checkable` extends Protocols, allowing `isinstance` checks against behavior rather than base classes.'
    ]
  ),

  L(
    'pyx-10', 10, 'Profiling & C-Extensions', '⏱️',
    'Amateurs guess why their code is slow; experts measure it. Before attempting to optimize, you must profile your execution graph to isolate exact bottlenecks. If algorithmic optimization fails to yield results, your final weapon is bypassing the Python interpreter entirely by compiling bottlenecks into native C or Rust extensions.',
    [
      {
        title: '1. Guessing vs Measuring',
        beginner: 'If your app is slow, your intuition is usually wrong about where the problem is. Never rewrite code to make it faster until a profiler proves exactly which line is causing the delay.',
        advanced: 'Python provides `cProfile`, a deterministic C-extension profiler. It tracks every single function call, return, and exception, mapping an exact statistical breakdown of execution time without heavily skewing the execution speed.'
      },
      {
        title: '2. Tottime vs Cumtime',
        beginner: 'When reading a profile report, there are two important times. One is how long a function took on its own. The other is how long it took including all the other functions it called.',
        advanced: '`tottime` (Total Time) measures time spent strictly inside the function\'s own code block. `cumtime` (Cumulative Time) includes the execution of all nested sub-calls. A function with high `cumtime` but low `tottime` is just a delegator; the true bottleneck lies deeper in the call stack.'
      },
      {
        title: '3. Line Profiling',
        beginner: 'Standard profilers tell you "Function A took 5 seconds." But if Function A is 100 lines long, you still don\'t know the problem. Line profilers tell you how much time every single line took.',
        advanced: '`line_profiler` (a third-party tool) hooks into Python\'s tracing facilities. By decorating a suspect function with `@profile`, it outputs deterministic metrics per line. It introduces massive overhead, so it is strictly used for localized debugging, not system-wide profiling.'
      },
      {
        title: '4. Cython & Rust (PyO3)',
        beginner: 'If your math loop is simply too slow in Python, you can write that specific loop in a faster language like C or Rust, compile it, and import it into Python just like a normal module.',
        advanced: 'Cython allows you to add static type declarations to Python code and compiles it down to C extensions. More recently, the community is moving toward Rust via PyO3, which offers memory safety and fearless concurrency while perfectly binding directly into the CPython ABI.'
      }
    ],
    {
      title: 'Deterministic C-Profiling',
      intro: 'We are going to generate an intentional bottleneck and use Python\'s built-in `cProfile` engine to statistically isolate the exact delegators and culprits in the call stack. 🖥️ NOTE: If you prefer a larger workspace or want a bigger interface, feel free to open your computer terminal, run the python interactive shell, and carry on with this practical assignment!',
      steps: [
        'Open a fresh script file (not REPL).',
        'Write a sleeper: `import time \n def slow_sub_task(): time.sleep(1)`',
        'Write a math cruncher: `def heavy_math(): return sum(i * i for i in range(5_000_000))`',
        'Write the main function: `def main(): slow_sub_task(); heavy_math()`',
        'Import the profiler at the top: `import cProfile, pstats`',
        'Run the profiler: `cProfile.run("main()", "stats.prof")`',
        'Read the stats: `p = pstats.Stats("stats.prof") \n p.strip_dirs().sort_stats("tottime").print_stats(10)`',
        'Analyze the output: Look at the difference between `main()` (high cumtime, low tottime), `slow_sub_task()` (high tottime in sleep), and your generator expression.'
      ],
      goal: 'You have transitioned from blind optimization to deterministic profiling, mastering the ability to mathematically isolate execution bottlenecks within the CPython runtime.'
    },
    [
      q('What is the core difference between `cProfile` and the standard `profile` module?', ['`cProfile` can only profile C-extensions.', '`cProfile` is written in C and introduces drastically less overhead than the pure-Python `profile` module.', '`profile` profiles memory, while `cProfile` profiles CPU.', 'There is no difference; one is an alias for the other.'], 1, 'Because `cProfile` is implemented natively in C, its interference with the execution graph is minimal, making it the industry standard for deterministic CPU profiling in Python.'),
      q('When reviewing a `cProfile` report, what does a high `cumtime` but a low `tottime` indicate about a function?', ['The function is a massive bottleneck doing heavy computational work itself.', 'The function is waiting on an external database.', 'The function executes quickly itself but calls out to other heavily time-consuming functions.', 'The function raised an exception.'], 2, 'Cumulative Time includes all sub-function calls. If Total Time is low but Cumulative is high, the function is primarily a delegator or manager waiting on its children to finish.'),
      q('Why might a senior engineer choose to use `line_profiler` over `cProfile`?', ['To monitor memory leaks.', 'To bypass the GIL.', 'Because `cProfile` only reports execution times at the function level, making it difficult to isolate the exact bottleneck within a massive 500-line function.', 'Because it is much faster.'], 2, '`cProfile` tells you *which* function is slow. `line_profiler` takes you deeper, analyzing the bytecode execution of *each specific line* within that slow function.'),
      q('What is the fundamental mechanism that allows Cython to drastically speed up Python loops?', ['It parallelizes the loop across all CPU cores automatically.', 'It transpiles the code into JavaScript for V8 execution.', 'By adding static type hints, it bypasses dynamic PyObject overhead and compiles the logic directly into raw, native C code.', 'It removes the garbage collector.'], 2, 'The primary bottleneck in pure Python loops is the constant boxing/unboxing and type-checking of PyObjects. Cython utilizes static typing to generate highly optimized, raw C variables and functions.')
    ],
    [
      'Optimization without profiling is blind; always use deterministic metrics to isolate bottlenecks.',
      '`cProfile` provides low-overhead, function-level metrics; `tottime` vs `cumtime` helps trace the exact culprit.',
      '`line_profiler` introduces overhead but provides surgical, line-by-line execution analytics.',
      'When algorithmic scaling limits are reached, compiling bottlenecks via Cython or Rust (PyO3) yields native-level speeds.'
    ]
  )

  

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
