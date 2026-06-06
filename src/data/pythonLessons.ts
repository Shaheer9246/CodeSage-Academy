// Python Track — 20 lessons (beginner → advanced)
import type { NetworkingLesson, Concept, QuizQuestion } from './networkingLessons';

export type PythonLesson = NetworkingLesson;

const L = (
  id: string, order: number, title: string, icon: string, philosophy: string,
  concepts: Concept[], practical: PythonLesson['practical'], quiz: QuizQuestion[],
  keyTakeaways: string[]
): PythonLesson => ({
  id, module: 'Module 1: Python Programming', order, title, icon, philosophy,
  concepts, practical, quiz, keyTakeaways,
});

const q = (question: string, options: string[], correctIndex: number, explanation?: string): QuizQuestion =>
  ({ question, options, correctIndex, explanation });

export const PYTHON_LESSONS: PythonLesson[] = [
  L('py-1', 1, 'Python Setup & Syntax', '🐍',
    'Welcome! Python reads almost like simple English—and that is its true superpower. Before we write complex programs, let\'s learn how to open a direct chat line with Python and see how it speaks back to us.',
    [
      { 
        title: '1. What is Python?', 
        beginner: 'Think of Python as a friendly translator. You write instructions using plain words, and Python translates them behind the scenes into a binary language that your computer\'s processor chip can execute.', 
        advanced: 'Python is an interpreted, high-level language. Source code is compiled down to bytecode (.pyc files) which runs inside the platform-agnostic Python Virtual Machine (PVM).' 
      },
      { 
        title: '2. The REPL (Your Instant Python Chat)', 
        beginner: 'The REPL is an instant messaging prompt where you text Python directly. You type a single line of code, hit Enter, and Python reads it and replies immediately! Look for the three arrows ">>>" on your screen—that is Python saying "I am listening!"', 
        advanced: 'REPL stands for Read-Eval-Print Loop. It accepts expressions, evaluates their memory references, prints results to stdout, and loops back to the input prompt context.' 
      },
      { 
        title: '3. Indentation IS Syntax', 
        beginner: 'Other languages trap their code inside messy curly brackets {}. Python throws brackets away and uses clean vertical spacing (4 spaces or hitting Tab) to align matching code blocks. Keeping your lines aligned is mandatory!', 
        advanced: 'Mixing tabs and spaces triggers an IndentationError at parsing time. PEP 8 rules dictate using spaces exclusively to guarantee multi-platform layout consistency.' 
      },
      { 
        title: '4. print() & Comments', 
        beginner: 'The print() command tells your computer to display text out loud on your output panel. If you start a line with a hashtag #, Python will completely ignore it—letting you write secret notes and explanations to yourself.', 
        advanced: 'Modern string interpolation uses f-strings (f"value = {x}"). This optimizes memory formatting runtime speed compared to legacy % or .format() operators.' 
      },
    ],
    { 
      title: 'Your First Live Conversation', 
      intro: 'Let\'s wake up Python inside the playground terminal and make it speak to you.', 
      steps: [
        'Look at the dark interactive terminal box on the right side of your screen.',
        'Type the word: python3 and press the Enter key to launch the environment.',
        'Verify the listening sign: Look closely for the >>> arrows to appear on the line.',
        'Type your first message: print("Hello World") and press Enter.',
        'Watch Python display Hello World back to you! When done, type exit() and hit Enter to say goodbye.'
      ], 
      goal: 'You have successfully entered the REPL, executed your first direct command, and shut down the chat safely.' 
    },
    [
      q('What do the three arrows (>>>) mean in your terminal window?', ['Python is broken','Python is active and listening for your code input','The computer is shutting down','A file is saving'], 1, 'The >>> prompt indicates that the Python REPL scratchpad is successfully open and waiting for you to type an instruction.'),
      q('How does Python know which lines of code belong inside a block?', ['Using pairs of curly brackets {}','Using clean spacing and text alignment (Indentation)','Using semicolons at the end of every sentence','It guesses randomly'], 1, 'Python uses strict spacing/indentation instead of brackets to group structural code paths together.'),
      q('What is the modern, standard way to inject variables into text strings?', ['Glue strings together with the + sign','Use f-strings like f"Hello {name}"','Type the value out manually each time','Use the old % operator'], 1, 'f-strings are the absolute cleanest, fastest way to safely interpolate variables into your Python text strings.'),
      q('How do you leave a line note inside your file that Python will ignore?', ['Wrap sentences in regular parentheses','Start the line with a hashtag symbol (#)','Write it in all CAPITAL letters','Put it inside square brackets'], 1, 'The # symbol creates a human-readable comment line that Python completely skips over during execution.')
    ],
    ['Python text reads naturally like English','The >>> indicator means Python is ready for input','Indentation defines visual code structure','Use f-strings for clean variable interpolation']
  ),

  L('py-2', 2, 'Variables & Data Types', '📦',
    'A variable is a label pointing to a value in memory. Python is dynamically typed — variables don\'t declare a type, but the value always has one.',
    [
      { title: '1. Naming & Assignment', beginner: '`x = 5` creates a variable. snake_case is the convention.', advanced: 'Names are references, not boxes. `a = [1,2]; b = a; b.append(3)` — `a` changes too.' },
      { title: '2. Numbers', beginner: '`int` (whole), `float` (decimal), `complex` (rare).', advanced: 'Integer division `//` vs true division `/`. Beware float precision: 0.1 + 0.2 != 0.3. Use `decimal` for money.' },
      { title: '3. Strings', beginner: 'Text in quotes. Immutable. `len(s)`, `s.upper()`, `s.split()`.', advanced: 'Strings are sequences. Slicing `s[1:4]`, negative indices `s[-1]`. f-strings for interpolation.' },
      { title: '4. Booleans & None', beginner: '`True`, `False`, `None` (Python\'s null).', advanced: 'Truthiness: `0`, `""`, `[]`, `{}`, `None` all evaluate falsy. Use `is None`, not `== None`.' },
    ],
    { title: 'Variable Playground', intro: 'Play with types in the REPL.', steps: [
      'Open `python3`.',
      'Try: `x = 10`, `y = 3.14`, `name = "Sage"`.',
      'Try: `type(x)`, `type(y)`, `type(name)`.',
      'Try: `10 / 3` vs `10 // 3` — note the difference.',
      'Try: f-string `f"{name} is {x}"`.',
    ], goal: 'You understand the four basic types and dynamic typing.' },
    [
      q('Python is:', ['Statically typed','Dynamically typed','Typeless','Manually typed'], 1),
      q('Best style for variable names?', ['camelCase','snake_case','PascalCase','kebab-case'], 1),
      q('`10 // 3` returns:', ['3.33','3','3.0','Error'], 1),
      q('Compare to None with:', ['== None','is None','equals(None)','None()'], 1),
    ],
    ['Dynamically typed','snake_case naming','// integer division','is None for None checks']
  ),

  L('py-3', 3, 'Control Flow', '🔀',
    'Programs need to make decisions and repeat work. if/elif/else and loops are the bones of every algorithm.',
    [
      { title: '1. if / elif / else', beginner: 'Branch on a condition. Indentation defines the block.', advanced: 'Use the walrus operator `:=` (3.8+) to assign and test in one expression.' },
      { title: '2. while loops', beginner: 'Repeat while a condition is true.', advanced: 'Use sparingly — most iteration belongs in `for` loops. `while True` + `break` for event loops.' },
      { title: '3. for loops', beginner: 'Iterate over any iterable. `for x in [1,2,3]:`.', advanced: '`enumerate()` for index+value, `zip()` to pair iterables, `range()` for numeric loops.' },
      { title: '4. break / continue / else', beginner: '`break` exits, `continue` skips to next iteration.', advanced: '`for-else` runs when the loop completes without break — handy for search patterns.' },
    ],
    { title: 'FizzBuzz', intro: 'The classic.', steps: [
      'Loop i from 1 to 20.',
      'If i divisible by 3 AND 5 → print "FizzBuzz".',
      'Else if divisible by 3 → print "Fizz".',
      'Else if divisible by 5 → print "Buzz".',
      'Else print i.',
    ], goal: 'Your script prints FizzBuzz correctly for 1-20.' },
    [
      q('Indentation defines:', ['Comments','Code blocks','Strings','Nothing'], 1),
      q('Iterate index+value with:', ['for i in range(len(x))','enumerate(x)','zip(x)','iter(x)'], 1),
      q('`for-else` runs when:', ['Always','Loop completes without break','Loop breaks','First iteration only'], 1),
      q('Best for unknown iteration count?', ['for','while','do-while','goto'], 1),
    ],
    ['Indentation = blocks','for loops dominate','enumerate/zip/range','break/continue/for-else']
  ),

  L('py-4', 4, 'Functions', '🛠️',
    'Functions are reusable units of behavior. Small, single-purpose functions make code readable, testable, and refactor-friendly.',
    [
      { title: '1. def', beginner: '`def greet(name): return f"hi {name}"`. Return is optional.', advanced: 'Functions are first-class — assign them to variables, pass as args, return from other functions.' },
      { title: '2. Default & Keyword Args', beginner: '`def f(x, y=10):` — y has a default.', advanced: '⚠️ Mutable default arg trap: `def f(x=[]):` reuses the same list across calls. Use `None` + check inside.' },
      { title: '3. *args / **kwargs', beginner: 'Variable-length args. `*args` = tuple, `**kwargs` = dict.', advanced: 'Use for wrappers and decorators. `def log(fn): def wrapper(*a, **kw): ...`.' },
      { title: '4. Docstrings & Type Hints', beginner: '`"""description"""` first line. `def f(x: int) -> str:`.', advanced: 'Use `mypy` to check types statically. Hints are documentation that the IDE understands.' },
    ],
    { title: 'Calculator Function', intro: 'Write a typed function.', steps: [
      'Define `def add(a: float, b: float) -> float:`.',
      'Add a docstring explaining what it does.',
      'Return `a + b`.',
      'Call it with `add(3, 4)` and print the result.',
      'Try `add(b=10, a=5)` — keyword args.',
    ], goal: 'You can write a typed, documented function.' },
    [
      q('Mutable default arg danger?', ['None','Reused across calls','Faster','Same as immutable'], 1),
      q('*args is a:', ['List','Tuple','Dict','Set'], 1),
      q('Type hints are:', ['Enforced at runtime','Documentation for tools','Required','Ignored by Python'], 1),
      q('Functions in Python are:', ['Second-class','First-class objects','Static only','Not values'], 1),
    ],
    ['def + return','Beware mutable defaults','*args/**kwargs','Type hints help tooling']
  ),

  L('py-5', 5, 'Data Structures: List, Tuple, Dict, Set', '📚',
    'Choosing the right container is half of algorithm design. Each has different speed and meaning.',
    [
      { title: '1. Lists', beginner: 'Ordered, mutable. `[1,2,3]`. append, pop, slice.', advanced: 'O(1) append/pop end. O(n) insert/delete middle. Use `collections.deque` for queues.' },
      { title: '2. Tuples', beginner: 'Ordered, immutable. `(1,2)`. Good for fixed records.', advanced: 'Hashable → usable as dict keys. Named tuples (`from collections import namedtuple`) for clarity.' },
      { title: '3. Dicts', beginner: 'Key→value. `{"a": 1}`. O(1) lookups.', advanced: 'Insertion-ordered since 3.7. Use `dict.get(k, default)` to avoid KeyError. `defaultdict` for grouping.' },
      { title: '4. Sets', beginner: 'Unique unordered. `{1,2,3}`. Fast membership.', advanced: 'Set math: union `|`, intersection `&`, difference `-`. Frozen sets are immutable/hashable.' },
    ],
    { title: 'Word Counter', intro: 'Count word frequency.', steps: [
      'Take a sentence: `s = "the cat sat on the mat"`.',
      'Split into words: `words = s.split()`.',
      'Make an empty dict `counts = {}`.',
      'For each word, do `counts[w] = counts.get(w, 0) + 1`.',
      'Print `counts`.',
    ], goal: 'You can pick the right container for any problem.' },
    [
      q('Need fast membership test?', ['list','set','tuple','string'], 1),
      q('Immutable + ordered =', ['list','tuple','dict','set'], 1),
      q('Dict insertion order:', ['Random','Preserved (3.7+)','Sorted','Reversed'], 1),
      q('Avoid KeyError with:', ['try/except always','dict.get','set.add','list.find'], 1),
    ],
    ['List = ordered mutable','Tuple = immutable','Dict = O(1) lookup','Set = uniqueness']
  ),

  L('py-6', 6, 'Object-Oriented Programming', '🧱',
    'Classes bundle data + behavior. Use them when state and operations belong together — not for everything.',
    [
      { title: '1. Class & Instance', beginner: '`class Dog: pass`. Create with `d = Dog()`.', advanced: 'Classes are objects too — Python is "everything is an object". `type` is the class of classes.' },
      { title: '2. __init__ & self', beginner: '`__init__` runs at instance creation. `self` = the instance.', advanced: 'self is explicit by convention (PEP 8). Other languages hide it — Python\'s honesty pays off.' },
      { title: '3. Methods & Attributes', beginner: 'Functions inside a class are methods. Variables are attributes.', advanced: '@classmethod for alt constructors, @staticmethod for utility fns. @property for computed attrs.' },
      { title: '4. Inheritance', beginner: '`class Cat(Animal):` — Cat IS an Animal.', advanced: 'Prefer composition over inheritance for reuse. Use abstract base classes (`abc.ABC`) for interfaces.' },
    ],
    { title: 'Dog Class', intro: 'Model a simple Dog.', steps: [
      'Define `class Dog:`.',
      'Add `__init__(self, name, age)` setting `self.name` and `self.age`.',
      'Add method `bark(self): return f"{self.name} says woof!"`.',
      'Create `d = Dog("Rex", 3)` and call `d.bark()`.',
      'Add a `@property def is_puppy(self): return self.age < 1`.',
    ], goal: 'You can model state + behavior with a class.' },
    [
      q('`self` represents:', ['The class','The current instance','Nothing','The parent'], 1),
      q('`__init__` is called:', ['Never','At instance creation','At class definition','Manually'], 1),
      q('Prefer composition over inheritance?', ['No','Often yes','Always inherit','Inheritance is faster'], 1),
      q('@property turns a method into:', ['Static','A computed attribute','Private','Public'], 1),
    ],
    ['Classes bundle state+behavior','self is the instance','Prefer composition','@property = computed attr']
  ),

  L('py-7', 7, 'Modules & Imports', '📦',
    'Real projects are split into many files. Modules and packages let you organize code without losing your mind.',
    [
      { title: '1. import', beginner: '`import math; math.sqrt(16)`. Or `from math import sqrt`.', advanced: '`from x import *` is an anti-pattern — pollutes namespace and hides origins.' },
      { title: '2. Modules = Files', beginner: 'Any .py file is a module. Import by filename (no .py).', advanced: 'Each module runs once; subsequent imports return the cached object. Avoid side effects at top-level.' },
      { title: '3. Packages', beginner: 'A folder with `__init__.py` becomes a package.', advanced: 'Implicit (namespace) packages since 3.3 — no __init__ needed. Use them for plugin systems.' },
      { title: '4. The Standard Library', beginner: 'os, sys, json, datetime, random, re — batteries included.', advanced: 'Read the stdlib docs once a year. You\'ll find tools you didn\'t know existed (e.g. `itertools`, `collections`).' },
    ],
    { title: 'Split a Script', intro: 'Refactor into modules.', steps: [
      'Create `math_utils.py` with `def square(x): return x*x`.',
      'Create `main.py`.',
      'In main.py: `from math_utils import square`.',
      'Call `print(square(5))`.',
      'Run `python3 main.py`.',
    ], goal: 'You can split code into multiple files.' },
    [
      q('`from x import *` is:', ['Best practice','An anti-pattern','Required','Faster'], 1),
      q('A package is:', ['A .py file','A folder with __init__.py (or namespace)','A pip install','A zip'], 1),
      q('Modules run on import:', ['Every time','Once, then cached','Never','On exit'], 1),
      q('Reach for stdlib first?', ['No, use pip','Yes','Only if old','Never'], 1),
    ],
    ['import sparingly + explicitly','Files = modules','Folders = packages','Stdlib is huge']
  ),

  L('py-8', 8, 'File I/O', '📂',
    'Reading and writing files is the gateway to real-world data — configs, logs, CSVs, JSON, anything on disk.',
    [
      { title: '1. open() & with', beginner: '`with open("f.txt") as f: data = f.read()`.', advanced: '`with` is the context manager pattern — auto-closes the file even on exception. Always prefer it.' },
      { title: '2. Modes', beginner: '"r" read, "w" write (overwrites!), "a" append, "b" binary.', advanced: 'Add "x" for exclusive create (fails if exists). Always specify encoding="utf-8" for text.' },
      { title: '3. Iterating Lines', beginner: '`for line in f:` reads one line at a time — memory-efficient.', advanced: 'Reading 10GB file? Iterate, don\'t `.read()`. Combine with generators for streaming pipelines.' },
      { title: '4. JSON / CSV', beginner: '`import json; json.load(f)`. `import csv; csv.reader(f)`.', advanced: 'Pandas crushes both for analytical work. Use stdlib for small scripts to avoid heavy deps.' },
    ],
    { title: 'Read & Write JSON', intro: 'A round trip.', steps: [
      'Make a dict `data = {"name": "Sage", "level": 99}`.',
      '`import json`. Open `out.json` with mode "w" + encoding.',
      '`json.dump(data, f, indent=2)`.',
      'Read it back: open with "r", `loaded = json.load(f)`.',
      'Print `loaded["name"]`.',
    ], goal: 'You can persist Python data to a JSON file.' },
    [
      q('Best file-open pattern?', ['open() + close()','with open() as f:','os.read','file()'], 1),
      q('Reading a huge file:', ['.read() the whole thing','Iterate line by line','Load to memory','Use ML'], 1),
      q('"w" mode does what to existing file?', ['Appends','Overwrites','Errors','Renames'], 1),
      q('Specify encoding for text files?', ['Optional','Always','Never','Only Windows'], 1),
    ],
    ['Always use `with`','Stream big files','Mind file modes','json/csv stdlib for small data']
  ),

  L('py-9', 9, 'Error Handling', '⚠️',
    'Code that ignores errors lies to its users. Errors should be loud, specific, and recoverable when possible.',
    [
      { title: '1. try / except', beginner: 'Wrap risky code. Catch specific exceptions, not bare `except:`.', advanced: 'Bare `except` swallows KeyboardInterrupt and SystemExit too — almost always a bug.' },
      { title: '2. Exception Types', beginner: 'ValueError, TypeError, KeyError, FileNotFoundError, etc.', advanced: 'Use the most specific. Catching `Exception` masks bugs.' },
      { title: '3. finally / else', beginner: '`finally` runs no matter what. `else` runs on success.', advanced: '`finally` is for cleanup (file close, lock release). `with` blocks are usually cleaner.' },
      { title: '4. Raising Custom Errors', beginner: '`raise ValueError("bad")`. Create your own: `class MyError(Exception): pass`.', advanced: 'Custom exceptions form the public API of your library. Make hierarchies (e.g. MyAPIError → MyAuthError).' },
    ],
    { title: 'Safe Division', intro: 'Handle bad input.', steps: [
      'Define `def divide(a, b):`.',
      'try: return a / b.',
      'except ZeroDivisionError: return None.',
      'except TypeError: raise ValueError("Numbers only") from None.',
      'Test with `divide(10, 0)` and `divide("a", 2)`.',
    ], goal: 'You write code that fails predictably.' },
    [
      q('Bare except is:', ['Recommended','An anti-pattern','Required','Fast'], 1),
      q('Always-runs block?', ['try','except','else','finally'], 3),
      q('Most specific is:', ['Best practice','Slower','Equivalent','Bad'], 0),
      q('Custom exceptions help with:', ['Speed','Public API design','Memory','Nothing'], 1),
    ],
    ['Catch specific exceptions','finally for cleanup','raise loud and clear','Custom exceptions = API']
  ),

  L('py-10', 10, 'List Comprehensions & Generators', '⚡',
    'Pythonic code reads like math. Comprehensions express transformations in one line; generators stream them lazily.',
    [
      { title: '1. List Comprehensions', beginner: '`[x*2 for x in nums]` — one-line transform.', advanced: 'Triple-nested comps are a smell — switch to a loop. Add `if` for filtering.' },
      { title: '2. Dict/Set Comprehensions', beginner: '`{k: v*2 for k, v in d.items()}`.', advanced: 'Set comp `{x for x in items}` dedupes. Use over `list(set(...))` for clarity.' },
      { title: '3. Generator Expressions', beginner: 'Same as list comp but `()` — lazy, memory-efficient.', advanced: 'Pass directly to `sum()`, `max()`, etc. without the temp list: `sum(x*x for x in nums)`.' },
      { title: '4. yield', beginner: '`def gen(): yield 1; yield 2`. Function becomes an iterator.', advanced: 'Generators are coroutines under the hood. `yield from` delegates. Use for streaming pipelines.' },
    ],
    { title: 'Squares Generator', intro: 'Lazy infinity.', steps: [
      'Define `def squares():` with `n = 1` then a `while True:` loop.',
      'Inside, `yield n*n; n += 1`.',
      '`g = squares()`. Call `next(g)` four times.',
      'Now write list comp: `[x*x for x in range(10)]`.',
      'Compare memory: a million-square list vs generator.',
    ], goal: 'You know when to be lazy vs eager.' },
    [
      q('Memory-efficient transform?', ['list comp','generator expression','for + append','map(list, ...)'], 1),
      q('yield turns a function into:', ['A class','An iterator','A coroutine','A decorator'], 1),
      q('Triple-nested list comp is:', ['Pythonic','A smell — use a loop','Required','Faster'], 1),
      q('Set comprehension dedupes?', ['No','Yes','Sometimes','Only ints'], 1),
    ],
    ['Comps express transforms','() = lazy generator','yield streams data','Avoid deep nesting']
  ),

  L('py-11', 11, 'Decorators', '🎨',
    'A decorator is a function that wraps another function. They\'re how Flask routes, caching, timing, and auth checks are added without polluting your business logic.',
    [
      { title: '1. Functions as Values', beginner: 'You can assign and return functions.', advanced: 'Closures capture variables from enclosing scope — the foundation of decorators.' },
      { title: '2. The @ Syntax', beginner: '`@my_decorator` above a `def` is sugar for `f = my_decorator(f)`.', advanced: 'Stack decorators bottom-up. Order matters for things like `@property` + `@classmethod`.' },
      { title: '3. functools.wraps', beginner: 'Preserve the original function\'s name + docstring inside your wrapper.', advanced: 'Without it, debugging is hell — every function looks like "wrapper".' },
      { title: '4. Common Built-ins', beginner: '@staticmethod, @classmethod, @property, @functools.lru_cache.', advanced: 'lru_cache is free memoization. @dataclass auto-generates __init__, __repr__, __eq__.' },
    ],
    { title: 'Timer Decorator', intro: 'Measure runtime.', steps: [
      'Import time and functools.',
      'Define `def timer(fn):`.',
      'Inside, `@functools.wraps(fn) def wrapper(*a, **kw):` measure time, call fn, print elapsed.',
      'Return `wrapper`.',
      'Apply `@timer` to any function and call it.',
    ], goal: 'You can write a reusable decorator.' },
    [
      q('@ syntax is sugar for:', ['Method call','f = decorator(f)','Class wrap','Import'], 1),
      q('Without functools.wraps:', ['Better perf','Loses metadata','Crashes','Faster'], 1),
      q('Free memoization?', ['@property','@lru_cache','@staticmethod','@dataclass'], 1),
      q('Decorators rely on:', ['Globals','Closures','Threads','Pipes'], 1),
    ],
    ['Decorators wrap functions','@ = syntactic sugar','Use functools.wraps','lru_cache for memoization']
  ),

  L('py-12', 12, 'Iterators & Generators (Deep Dive)', '🔁',
    'Python\'s iterator protocol is the secret behind for loops, comprehensions, and async. Master it once, never struggle with iteration again.',
    [
      { title: '1. The Protocol', beginner: 'An iterable has __iter__; an iterator has __next__.', advanced: '`for x in y:` calls `iter(y)` then loops `next()` until StopIteration.' },
      { title: '2. Building Iterators', beginner: 'Custom class with __iter__ + __next__.', advanced: 'Generators (yield) do this for you — 95% of the time, use them.' },
      { title: '3. itertools', beginner: 'chain, islice, groupby, count, cycle, product, combinations.', advanced: 'Most "I need to loop weirdly" problems have a one-liner in itertools.' },
      { title: '4. Infinite Streams', beginner: '`count()` counts forever. Combine with `islice` to take N items.', advanced: 'Lazy evaluation lets you compose infinite pipelines without OOM.' },
    ],
    { title: 'itertools Hands-on', intro: 'Two useful tricks.', steps: [
      'Import itertools.',
      '`list(itertools.islice(itertools.count(), 5))` → first 5 naturals.',
      '`list(itertools.chain([1,2], [3,4]))` → joined.',
      '`list(itertools.combinations([1,2,3], 2))` → all pairs.',
      'Use these in your next loop instead of writing them manually.',
    ], goal: 'You reach for itertools before reinventing it.' },
    [
      q('for loop relies on:', ['Range','Iterator protocol','GIL','None'], 1),
      q('Easiest way to write an iterator?', ['Class','Generator (yield)','Module','Thread'], 1),
      q('Take first N from infinite stream?', ['list()','itertools.islice','range','break'], 1),
      q('Cartesian product helper?', ['zip','itertools.product','enumerate','filter'], 1),
    ],
    ['__iter__ + __next__','yield = simple iterator','itertools is a treasure','Lazy = infinite-safe']
  ),

  L('py-13', 13, 'Virtual Environments & pip', '🧪',
    'Installing packages globally is how careers die. Every project gets its own isolated environment — no exceptions.',
    [
      { title: '1. Why venv', beginner: 'Each project needs different package versions. Globals collide.', advanced: 'OS-level Python is "owned" by the OS. Modifying it breaks the OS. Use pyenv + venv.' },
      { title: '2. Creating one', beginner: '`python3 -m venv .venv`. Activate with `source .venv/bin/activate`.', advanced: 'Put `.venv` in `.gitignore`. Use the same name everywhere for consistency.' },
      { title: '3. pip', beginner: '`pip install requests`. `pip freeze > requirements.txt`.', advanced: 'Prefer `pip install -e .` for libraries. Pin exact versions with `==`, ranges with `>=`.' },
      { title: '4. Modern Tools', beginner: 'pipenv, poetry, uv all manage venvs + deps.', advanced: 'uv (2024+) is 10-100× faster than pip. Poetry is the most opinionated. Pick one per team.' },
    ],
    { title: 'Project Setup', intro: 'Clean start.', steps: [
      'mkdir myproject && cd myproject.',
      '`python3 -m venv .venv`.',
      '`source .venv/bin/activate` (Mac/Linux) or `.venv\\Scripts\\activate` (Win).',
      '`pip install requests`.',
      '`pip freeze > requirements.txt`.',
    ], goal: 'You have an isolated project environment.' },
    [
      q('Install packages globally?', ['Best practice','Never','Sometimes','Always'], 1),
      q('Create venv with:', ['python venv','python3 -m venv .venv','npm init','pip env'], 1),
      q('Save deps to:', ['package.json','requirements.txt','Gemfile','pom.xml'], 1),
      q('Modern fast resolver?', ['pip','uv','npm','cargo'], 1),
    ],
    ['Always use venv','source activate','pip freeze for repro','uv = fast modern alt']
  ),

  L('py-14', 14, 'HTTP Requests', '🌐',
    'Most modern apps talk to APIs. `requests` is the most-loved Python library for a reason — it makes HTTP trivial.',
    [
      { title: '1. GET', beginner: '`r = requests.get(url); r.json()`.', advanced: 'Always set timeout. Use sessions for connection pooling: `s = requests.Session()`.' },
      { title: '2. POST / Auth', beginner: '`requests.post(url, json={...}, headers={"Authorization": "Bearer x"})`.', advanced: 'Use `auth=(user, pass)` for basic auth. Token-based auth → custom session headers.' },
      { title: '3. Error Handling', beginner: 'Check `r.status_code`. Call `r.raise_for_status()` to auto-throw.', advanced: 'Retry transient errors with `urllib3.Retry` + `HTTPAdapter`. Exponential backoff.' },
      { title: '4. httpx & async', beginner: 'Drop-in replacement with async support.', advanced: 'For 100s of concurrent requests, async httpx > threads. Less mem, more throughput.' },
    ],
    { title: 'Public API Call', intro: 'Fetch JSON.', steps: [
      '`pip install requests`.',
      'Import and call `requests.get("https://api.github.com")`.',
      'Print `r.status_code` and `r.json()`.',
      'Add timeout=5.',
      'Wrap in try/except for `requests.RequestException`.',
    ], goal: 'You can fetch and parse any REST API.' },
    [
      q('Default timeout in requests?', ['5s','None — must set','30s','Infinite is fine'], 1),
      q('Auto-throw on 4xx/5xx?', ['raise_for_status()','status_code','json()','headers'], 0),
      q('Connection pooling via:', ['get()','Session()','urllib','Thread'], 1),
      q('Async HTTP client?', ['requests','httpx','flask','django'], 1),
    ],
    ['requests is king','Always set timeout','Use sessions','httpx for async']
  ),

  L('py-15', 15, 'Working with JSON & CSV', '📊',
    'Most real data arrives as JSON (APIs) or CSV (exports). Python\'s stdlib handles both, and pandas crushes them at scale.',
    [
      { title: '1. JSON Round-trip', beginner: '`json.dumps(obj)` → str. `json.loads(s)` → obj.', advanced: 'Pass `default=str` to handle datetime, Decimal. `indent=2` for human-readable files.' },
      { title: '2. CSV stdlib', beginner: '`csv.DictReader(f)` yields dicts.', advanced: 'Specify `dialect` or `delimiter` for tabs/pipes. `csv.QUOTE_NONNUMERIC` for safe writes.' },
      { title: '3. pandas', beginner: '`pd.read_csv("f.csv")` → DataFrame.', advanced: 'Use `dtype=` to control parsing. `chunksize=` for streaming huge files.' },
      { title: '4. Data Hygiene', beginner: 'Strip whitespace, handle missing values.', advanced: 'Always validate schema (pydantic or pandera). Bad data > no data, but only when checked.' },
    ],
    { title: 'CSV → JSON', intro: 'Convert a file.', steps: [
      'Create `data.csv` with header `name,age` and 3 rows.',
      'Open with `csv.DictReader`.',
      'Build a list of dicts.',
      '`json.dump(list, open("out.json","w"), indent=2)`.',
      'Open out.json — verify.',
    ], goal: 'You can convert between common data formats.' },
    [
      q('JSON-encode datetime?', ['Auto','Pass default=str','Impossible','Use pickle'], 1),
      q('Read CSV as dicts?', ['csv.reader','csv.DictReader','open()','json'], 1),
      q('Stream huge CSV in pandas?', ['Load all','chunksize=N','Manual loop','sed'], 1),
      q('Validate data shape with:', ['print','pydantic / pandera','os','random'], 1),
    ],
    ['json.dumps/loads','csv.DictReader rocks','pandas for scale','Validate every input']
  ),

  L('py-16', 16, 'Regular Expressions', '🔎',
    'Regex is a tiny language for matching patterns in text. Painful to read, but unbeatable for parsing log lines, emails, URLs.',
    [
      { title: '1. re.search vs re.match', beginner: '`search` scans anywhere; `match` only from start.', advanced: 'Compile once (`re.compile`) when reusing patterns. Faster + clearer.' },
      { title: '2. Common Tokens', beginner: '`\\d` digit, `\\w` word, `.` any, `*` 0+, `+` 1+.', advanced: 'Use raw strings (`r"..."`) always — avoids escape hell with backslashes.' },
      { title: '3. Groups & Capture', beginner: '`(...)` captures. `m.group(1)` retrieves it.', advanced: 'Named groups `(?P<name>...)` make regex self-documenting.' },
      { title: '4. Substitution', beginner: '`re.sub(pattern, replacement, text)`.', advanced: 'Pass a function as replacement for dynamic logic. Use `re.sub` over `str.replace` for patterns.' },
    ],
    { title: 'Extract Emails', intro: 'Find all emails in text.', steps: [
      'Import re.',
      'Pattern: `r"[\\w.]+@[\\w.]+"`.',
      'text = "ping me at a@x.com or b@y.org".',
      '`emails = re.findall(pattern, text)`.',
      'Print emails.',
    ], goal: 'You can extract structured data from messy text.' },
    [
      q('Raw strings in regex?', ['Optional','Always','Never','Only Windows'], 1),
      q('Match anywhere in string?', ['re.match','re.search','re.start','re.find'], 1),
      q('Named groups syntax?', ['(name:...)','(?P<name>...)','<name>...','{name:...}'], 1),
      q('Reuse same pattern?', ['Recompile each','re.compile once','Always inline','Use loop'], 1),
    ],
    ['Raw strings r"…"','search vs match','Named groups','Compile once']
  ),

  L('py-17', 17, 'Concurrency: threading, async, multiprocessing', '⚙️',
    'Python has three concurrency models. Picking the wrong one wastes everyone\'s time — including yours.',
    [
      { title: '1. The GIL', beginner: 'Only one Python thread runs Python code at a time.', advanced: 'Threads still help with I/O (sleep, network, disk) — they release the GIL during waits.' },
      { title: '2. asyncio', beginner: '`async def` + `await`. Single-thread, cooperative.', advanced: 'Best for thousands of network connections. Don\'t mix sync libraries — they block the loop.' },
      { title: '3. threading', beginner: 'Use for I/O-bound work in legacy sync code.', advanced: 'ThreadPoolExecutor is the modern API. Stick with asyncio for new code.' },
      { title: '4. multiprocessing', beginner: 'Use for CPU-bound work. Bypasses the GIL.', advanced: 'Each process = own memory. Use ProcessPoolExecutor + queues for parallel CPU.' },
    ],
    { title: 'Async Fetch', intro: 'Concurrent requests.', steps: [
      'pip install httpx.',
      '`import asyncio, httpx`.',
      '`async def fetch(url): async with httpx.AsyncClient() as c: return (await c.get(url)).status_code`.',
      '`async def main(): print(await asyncio.gather(*[fetch(u) for u in urls]))`.',
      'asyncio.run(main()).',
    ], goal: 'You can pick the right concurrency tool.' },
    [
      q('CPU-bound work needs:', ['threading','multiprocessing','async','none'], 1),
      q('I/O-bound modern choice?', ['asyncio','multiprocessing','sync','requests'], 0),
      q('GIL stops:', ['All Python','>1 thread of Python code at once','I/O','async'], 1),
      q('Mix sync libs in async?', ['Fine','Blocks the loop','Faster','Required'], 1),
    ],
    ['GIL = 1 thread Python at a time','asyncio for I/O','multiprocessing for CPU','Pools > raw threads']
  ),

  L('py-18', 18, 'Testing with pytest', '🧪',
    'Untested code is broken code waiting to be discovered. pytest is the de-facto standard — friendly, powerful, free.',
    [
      { title: '1. Basic Tests', beginner: 'Files start with `test_`. Functions start with `test_`. Use `assert`.', advanced: 'Pytest rewrites asserts for great failure messages — no need for `assertEqual`.' },
      { title: '2. Fixtures', beginner: '`@pytest.fixture` provides setup/teardown.', advanced: 'Scope fixtures (`function`, `module`, `session`). Auto-use sparingly.' },
      { title: '3. Parametrize', beginner: '`@pytest.mark.parametrize("x,expected", [...])`.', advanced: 'One test, many cases. Data-driven testing without copy-paste.' },
      { title: '4. Coverage', beginner: '`pip install coverage; coverage run -m pytest; coverage report`.', advanced: 'Aim for ~80%. 100% is diminishing returns. Cover edge cases, not happy paths only.' },
    ],
    { title: 'First Pytest', intro: 'Two minutes setup.', steps: [
      '`pip install pytest`.',
      'Create `test_math.py` with `def test_sum(): assert 1+1 == 2`.',
      'Run `pytest`.',
      'Add a parametrize: `@pytest.mark.parametrize("a,b,c", [(1,2,3),(2,3,5)])`.',
      'Run again — see all cases.',
    ], goal: 'You have a green test suite.' },
    [
      q('Pytest discovers files starting with:', ['spec_','test_','it_','check_'], 1),
      q('Setup/teardown helper?', ['fixture','spy','mock','assert'], 0),
      q('Data-driven tests via:', ['copy-paste','@parametrize','for loop','class'], 1),
      q('100% coverage means:', ['Bug-free','All lines run, not all bugs found','Perfect','Done'], 1),
    ],
    ['pytest just works','Use plain assert','fixtures for setup','parametrize for cases']
  ),

  L('py-19', 19, 'Web Scraping & Automation', '🤖',
    'When a website has no API, you scrape. When a manual task repeats, you automate. Python excels at both.',
    [
      { title: '1. Ethics & robots.txt', beginner: 'Respect robots.txt. Don\'t hammer servers.', advanced: 'Rate-limit yourself (e.g. 1 req/sec). Cache aggressively. Use the site\'s API if it exists.' },
      { title: '2. BeautifulSoup', beginner: 'Parse HTML by tag/class.', advanced: 'Combine with requests. For JS-rendered sites, you need Selenium or Playwright.' },
      { title: '3. Playwright (modern)', beginner: 'Headless browser automation that handles JS, clicks, forms.', advanced: 'Wait for selectors, not sleeps. Use `page.locator(...).fill(...)` over CSS selectors.' },
      { title: '4. Scheduling', beginner: 'cron (unix) or APScheduler in Python.', advanced: 'For cloud, GitHub Actions cron or Cloudflare Workers cron triggers — no server needed.' },
    ],
    { title: 'Scrape Headlines', intro: 'Static page extraction.', steps: [
      '`pip install requests beautifulsoup4`.',
      'Pick a static news site URL.',
      '`html = requests.get(url).text`.',
      '`soup = BeautifulSoup(html, "html.parser")`.',
      'Print `[h.text.strip() for h in soup.select("h2")]`.',
    ], goal: 'You can extract data from any HTML page.' },
    [
      q('Always respect:', ['robots.txt + rate limits','Nothing','Only EU rules','Server uptime'], 0),
      q('JS-rendered sites need:', ['requests','Playwright/Selenium','curl','BeautifulSoup alone'], 1),
      q('Modern scheduler in cloud?', ['cron only','GitHub Actions cron','None','Daily restart'], 1),
      q('Best HTML parsing lib?', ['regex','BeautifulSoup','json','xml'], 1),
    ],
    ['Be ethical','requests + BS4 for static','Playwright for JS','Schedule with cron/actions']
  ),

  L('py-20', 20, 'Capstone: Build a CLI Tool', '🏆',
    'Real Python projects ship. Combine everything: package structure, CLI args, file I/O, HTTP, tests, and an actual install command.',
    [
      { title: '1. Project Structure', beginner: 'mytool/ contains __init__.py + cli.py. tests/ at root.', advanced: 'Use `src/` layout to avoid import bugs. `pyproject.toml` is the modern manifest.' },
      { title: '2. argparse / typer', beginner: 'argparse is stdlib. typer (built on click) makes CLIs feel like type-hinted Python.', advanced: 'For 5+ commands, typer wins on dev speed. Add `--help` everywhere.' },
      { title: '3. Entry Points', beginner: 'Define a console_script in pyproject.toml so users run `mytool` not `python mytool/cli.py`.', advanced: 'Lets `pipx install mytool` provide a global isolated CLI.' },
      { title: '4. Publish', beginner: 'pip wheel + upload to PyPI (or just GitHub).', advanced: 'twine upload to TestPyPI first. Tag releases with semver. Use trusted publishing for security.' },
    ],
    { title: 'Build "wc-clone"', intro: 'Count words in a file.', steps: [
      'Create pyproject.toml with name + entry_points.',
      'Make cli.py with typer or argparse: take a filepath.',
      'Open file, count lines, words, chars.',
      'Print results.',
      '`pip install -e .` then run `wcclone myfile.txt`.',
    ], goal: 'You shipped a working installable CLI.' },
    [
      q('Modern Python manifest?', ['setup.py','pyproject.toml','Makefile','requirements.txt'], 1),
      q('Type-hinted CLI lib?', ['argparse','typer','sys','os'], 1),
      q('Global isolated CLI install?', ['pip','pipx','npm','brew'], 1),
      q('Test upload before PyPI?', ['Just push','Use TestPyPI','No tests','Email users'], 1),
    ],
    ['src/ layout','typer for CLI ergonomics','Entry points = real binaries','pipx for users']
  ),
];

export const getPythonLessonById = (id: string): PythonLesson | undefined =>
  PYTHON_LESSONS.find(l => l.id === id);

export const isPythonLessonUnlocked = (id: string, completedLessons: string[]): boolean => {
  const idx = PYTHON_LESSONS.findIndex(l => l.id === id);
  if (idx <= 0) return true;
  return completedLessons.includes(PYTHON_LESSONS[idx - 1].id);
};
