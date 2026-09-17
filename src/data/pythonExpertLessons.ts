// =============================================================================
// PYTHON EXPERT TRACK — Lesson data (PREMIUM UPGRADE)
// =============================================================================
import type { NetworkingLesson, Concept, QuizQuestion } from './networkingLessons';
export type PythonExpertLesson = NetworkingLesson;

const L = (
id: string, order: number, title: string, icon: string, philosophy: string,
concepts: Concept[], practical: PythonExpertLesson['practical'], quiz: QuizQuestion[],
keyTakeaways: string[], terminalNotice?: string // <--- Added parameter for UI box
): PythonExpertLesson => ({
id, module: 'Module 2: Python Expert', order, title, icon, philosophy,
concepts, practical, quiz, keyTakeaways, terminalNotice, // <--- Added to object
});

const q = (question: string, options: string[], correctIndex: number, explanation?: string): QuizQuestion =>
({ question, options, correctIndex, explanation });

export const PYTHON_EXPERT_LESSONS: PythonExpertLesson[] = [
// -------------------------------------------------------------------------
// LESSON 1
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
{
title: '5. The Free Lists & pymalloc (Expert Teaser)',
beginner: 'When you create and delete thousands of tiny objects, asking the operating system for memory every single time is slow. Python keeps a secret stash of recycled memory to hand out instantly.',
advanced: '*(Pro Track Preview)* CPython utilizes `pymalloc`, a specialized arena-based allocator for objects under 512 bytes. It also maintains "free lists" for commonly used objects like floats, tuples, and empty lists. When an object is deallocated, its memory isn\'t returned to the OS; it\'s pushed onto a free list for instant reuse, drastically reducing `malloc` overhead.',
}
],
{
title: 'Inspect CPython Internals from the REPL',
intro: 'You are going to poke at Python from Python — read reference counts, identity, MRO, and disassembled bytecode.',
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
q('Which statement about `a is b` in CPython is correct?', ['It always returns `True` when `a == b`.', 'It compares the underlying `PyObject *` pointers (object identity), not values.', 'It is a shortcut for `hash(a) == hash(b)`.', 'It only works for numbers and strings.'], 1, '`is` compares identity (pointers). Two equal but distinct objects can compare `==` yet be `is`-different. **Why others are wrong:** `==` checks value equality, not identity. Hash collisions mean `hash(a) == hash(b)` does not guarantee `a == b`. `is` works on all objects, not just primitives.'),
q('Why does `sys.getrefcount(x)` return a value that looks one too high?', ['CPython reserves one refcount for the garbage collector.', 'The argument passed into `getrefcount` itself briefly holds a reference to the object.', 'Reference counts are always reported plus one for safety.', 'Because `x` is aliased in the REPL under `_`.'], 1, 'Calling `getrefcount(x)` creates a temporary parameter binding, adding one to the count you observe. **Why others are wrong:** The GC does not reserve a refcount. Refcounts are exact, not padded for safety. While `_` holds a reference in the REPL, the +1 happens even in script execution due to the function call mechanism.'),
q('Given `class A: pass`, `class B(A): pass`, `class C(A): pass`, `class D(B, C): pass`, what does `D.__mro__` show first (after `D`)?', ['A', 'C', 'B', 'object'], 2, 'C3 linearisation preserves the order in which base classes are declared, so `B` appears before `C` in `D`\'s MRO. **Why others are wrong:** A and object appear later in the resolution order. C appears after B because B was listed first in D\'s inheritance declaration.'),
q('Which workload is LEAST helped by using Python threads under the standard CPython GIL?', ['Downloading many URLs in parallel', 'Reading a batch of files from disk', 'A pure-Python loop that crunches numbers', 'Waiting on many database queries'], 2, 'CPU-bound pure-Python code holds the GIL, so threads do not scale. Use processes, C extensions, or async I/O instead. **Why others are wrong:** I/O-bound tasks (network, disk, DB) release the GIL while waiting, allowing threads to overlap execution effectively.'),
q('How does CPython optimize the allocation of millions of tiny objects (under 512 bytes)?', ['It asks the OS for memory every single time.', 'It uses `pymalloc` arenas and "free lists" to recycle memory instantly without calling `malloc`.', 'It compresses the objects into ZIP files.', 'It moves them to the hard drive.'], 1, '`pymalloc` manages memory in 4KB arenas, and free lists keep recently deallocated objects ready for instant reuse, bypassing expensive OS-level memory allocation calls. **Why others are wrong:** It does not ask the OS every time, use ZIP compression, or swap to disk.')
],
[
'Every Python value is a `PyObject` with a type pointer and reference count.',
'Reference counting frees most objects; a cyclic GC cleans up reference loops.',
'Attribute lookup follows the C3 MRO; data descriptors on the type beat the instance `__dict__`.',
'The GIL makes threads great for I/O and poor for CPU-bound pure-Python code.',
'CPython uses `pymalloc` arenas and free lists to instantly recycle memory for small objects.'
],
'We now have a built-in terminal right here! However, for these Expert-level lessons, you will get the best experience by running these advanced scripts in your local CMD/Terminal.'
),

// -------------------------------------------------------------------------
// LESSON 2
// -------------------------------------------------------------------------
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
},
{
title: '5. Metaclass Conflicts & Diamond Inheritance (Expert Teaser)',
beginner: 'If you try to combine two parent classes that were built by different factories, Python gets confused and crashes. It refuses to build a child class with two different bosses.',
advanced: '*(Pro Track Preview)* A `TypeError: metaclass conflict` occurs when the metaclass of a derived class is not a subclass of the metaclasses of all its bases. To resolve this, you must create a "bridge" metaclass that inherits from both parent metaclasses, ensuring a unified class construction pipeline.'
}
],
{
title: 'Automated API Validation Registry',
intro: 'We are going to build a plugin system where creating a new class automatically registers it into a central routing dictionary without writing any setup code.',
steps: [
'Open your REPL or an empty Python script.',
'Define a global dictionary: `registry = {}`.',
'Create a base class `PluginBase`. Inside it, define a classmethod: `def __init_subclass__(cls, **kwargs): super().__init_subclass__(**kwargs); registry[cls.__name__] = cls`.',
'Define two child classes: `class AuthPlugin(PluginBase): pass` and `class CachePlugin(PluginBase): pass`.',
'Print the `registry` dictionary. You will see both child classes automatically registered the moment they were defined, without you ever instantiating them.',
'Now, build a Singleton using `__new__`: `class Singleton: _instance = None; def __new__(cls): if cls._instance is None: cls._instance = super().__new__(cls); return cls._instance`.',
'Verify it: `a = Singleton(); b = Singleton(); print(a is b)` — it prints `True`.'
],
goal: 'You have successfully intercepted the class creation pipeline, using Python\'s metaprogramming hooks to build self-registering architectures and memory-controlled Singletons.',
},
[
q('What is the fundamental difference between `__new__` and `__init__`?', ['`__new__` initializes data, `__init__` allocates memory.', '`__new__` creates and returns the object instance, `__init__` sets up its initial state.', 'There is no difference; they are aliases for the same operation.', '`__new__` is only used in Metaclasses.'], 1, '`__new__` is the actual constructor that allocates memory and returns a new instance. `__init__` is the initializer that mutates the instance after it exists. **Why others are wrong:** They have distinct roles (allocation vs initialization). `__new__` is used in standard classes too, especially for immutables.'),
q('If you call `type("MyClass", (object,), {"x": 5})`, what is the result?', ['It throws a TypeError.', 'It returns the string "MyClass".', 'It dynamically creates and returns a new class object named MyClass with an attribute x.', 'It instantiates an object of type MyClass.'], 2, 'The `type` function, when called with three arguments (name, bases, dict), acts as the default metaclass and dynamically constructs a new class type at runtime. **Why others are wrong:** It does not return a string, throw an error, or instantiate an object (it creates the class itself).'),
q('Why was `__init_subclass__` introduced to Python?', ['To replace `__init__` entirely for performance reasons.', 'To provide a simpler, more readable alternative to metaclasses for tracking or modifying subclasses.', 'To prevent classes from being subclassed.', 'To allow multiple inheritance without the MRO.'], 1, '`__init_subclass__` allows a parent class to execute code whenever a subclass is defined, covering most plugin-registration and validation use cases without the complexity of a custom metaclass. **Why others are wrong:** It does not replace `__init__`, prevent subclassing, or alter MRO mechanics.'),
q('In a custom metaclass, what does overriding `__new__` allow you to do?', ['Modify the class dictionary (methods, attributes) before the class is actually constructed.', 'Prevent the garbage collector from cleaning up the class.', 'Change how instances of the class are deleted.', 'Bypass the Global Interpreter Lock.'], 0, 'Metaclass `__new__` receives the class dictionary as an argument, allowing you to inject, alter, or validate class-level attributes before the class object is allocated in memory. **Why others are wrong:** It does not affect GC, instance deletion, or the GIL.'),
q('What causes a `TypeError: metaclass conflict` in Python?', ['Using `__init__` instead of `__new__`.', 'A derived class inherits from bases whose metaclasses are not strictly compatible (not a subclass of all of them).', 'Forgetting to call `super()`.', 'Using `__slots__` in a metaclass.'], 1, 'Python requires the metaclass of a derived class to be a subclass of the metaclasses of all its bases. If two parents have conflicting custom metaclasses, you must create a bridge metaclass inheriting from both. **Why others are wrong:** It is not caused by `__init__`, missing `super()`, or `__slots__`.')
],
[
'Classes are instances of Metaclasses; the default metaclass in Python is `type`.',
'`__new__` handles object memory allocation, whereas `__init__` handles object initialization.',
'Metaclasses intercept the creation of the class object itself, enabling strict validation and attribute injection.',
'`__init_subclass__` is the modern, highly preferred way to build auto-registering plugins and subclass hooks.',
'Metaclass conflicts require a "bridge" metaclass inheriting from all parent metaclasses to resolve.'
],
'If you want to use a big terminal, use your CMD. Full guide is in Lesson 1.'
),

// -------------------------------------------------------------------------
// LESSON 3
// -------------------------------------------------------------------------
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
beginner: 'If a descriptor only knows how to read data, instance variables can overwrite it. If it knows how to write data, it acts like an unbreakable forcefield around the attribute.',
advanced: 'A "data descriptor" implements `__set__` or `__delete__` and always takes precedence over the instance `__dict__`. A "non-data descriptor" only implements `__get__` (like a standard method) and is shadowed if an attribute of the same name exists in the instance `__dict__`.'
},
{
title: '3. `__getattr__` vs `__getattribute__`',
beginner: 'These two sound identical but act differently. One is a safety net for missing attributes; the other is a strict gatekeeper for EVERY attribute.',
advanced: '`__getattribute__` intercepts every dot access unconditionally (warning: highly prone to infinite recursion). `__getattr__` is only triggered as a fallback if the attribute is not found in the instance dict or class tree. Use `__getattr__` for dynamic APIs and lazy loading.'
},
{
title: '4. Properties under the Hood',
beginner: 'You have likely used the `@property` decorator to make a method look like a variable. Underneath, `@property` is just a built-in descriptor!',
advanced: '`property()` is a C-implemented data descriptor. It takes `fget`, `fset`, and `fdel` functions. By writing your own custom descriptors, you can replicate `@property` but abstract the logic across multiple fields—perfect for building ORMs (Object-Relational Mappers).'
},
{
title: '5. `__set_name__` & Self-Aware Descriptors (Expert Teaser)',
beginner: 'In the past, descriptors didn\'t know what variable name they were assigned to. Now, Python automatically whispers the variable name into the descriptor\'s ear the moment the class is built.',
advanced: '*(Pro Track Preview)* Introduced in Python 3.6, `__set_name__(self, owner, name)` is invoked automatically at class creation. This eliminates the need for fragile metaclass hacks or manually passing string names into descriptor constructors, allowing descriptors to manage instance `__dict__` keys autonomously.'
}
],
{
title: 'Forge a Type-Enforced ORM Field',
intro: 'We are going to build a custom data descriptor that strictly enforces data types on class attributes, similar to how SQLAlchemy or Pydantic works under the hood.',
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
goal: 'You have bypassed standard dictionary lookups and implemented property validation at the core CPython descriptor level.',
},
[
q('What is the main difference between `__getattr__` and `__getattribute__`?', ['`__getattr__` is called for every access; `__getattribute__` is only called if the attribute is missing.', '`__getattribute__` intercepts all attribute lookups; `__getattr__` is a fallback for missing attributes.', '`__getattr__` handles methods, `__getattribute__` handles variables.', 'There is no difference.'], 1, '`__getattribute__` runs unconditionally on every single dot access. `__getattr__` is much safer as it only fires when an attribute cannot be found via normal MRO/dict lookups. **Why others are wrong:** The roles are reversed in the first option. They handle all attributes, not just methods or variables.'),
q('What makes a class a "Data Descriptor"?', ['It inherits from the `Data` built-in class.', 'It implements `__get__` and strictly returns an integer or string.', 'It implements `__set__` or `__delete__`.', 'It saves data directly to a database.'], 2, 'Implementing `__set__` or `__delete__` elevates a descriptor to a "Data Descriptor," giving it priority over the instance\'s own dictionary during attribute lookup. **Why others are wrong:** There is no `Data` built-in. Return types don\'t define it. It doesn\'t inherently save to databases.'),
q('Why must descriptors be instantiated at the class level (e.g., `name = StringField()`) rather than inside `__init__`?', ['Because `__init__` cannot instantiate objects.', 'Because the descriptor protocol is triggered by the class dictionary, not the instance dictionary.', 'To save memory in the garbage collector.', 'So they can bypass the Global Interpreter Lock.'], 1, 'Python\'s `__getattribute__` specifically checks the class definition (and its MRO) for descriptors. Putting them in `self.__dict__` inside `__init__` breaks the protocol. **Why others are wrong:** `__init__` can instantiate objects. It\'s not about GC memory or the GIL.'),
q('Which built-in Python feature is actually a data descriptor under the hood?', ['`list`', '`@property`', '`dict`', '`lambda`'], 1, 'The `@property` decorator is simply a convenient built-in class that implements the descriptor protocol (`__get__`, `__set__`, `__delete__`) using the functions you wrap. **Why others are wrong:** list, dict, and lambda are not descriptors.'),
q('What is the purpose of the `__set_name__` method in a descriptor?', ['To rename the class dynamically.', 'To automatically receive the attribute name and owner class at class creation time, eliminating manual string passing.', 'To delete the descriptor from memory.', 'To change the descriptor into a property.'], 1, '`__set_name__` is invoked automatically when the owner class is created, providing the descriptor with its assigned variable name so it can manage instance `__dict__` keys autonomously. **Why others are wrong:** It does not rename classes, delete memory, or convert to properties.')
],
[
'The Descriptor Protocol (`__get__`, `__set__`, `__delete__`) overrides default attribute access.',
'Data descriptors (implementing `__set__`) take absolute precedence over instance variables.',
'`__getattribute__` fires on all lookups, while `__getattr__` is a safe fallback for missing attributes.',
'Descriptors are the architectural foundation for ORMs, Type Checkers, and the `@property` decorator.',
'`__set_name__` allows descriptors to autonomously capture their variable names at class creation.'
],
'If you want to use a big terminal, use your CMD. Full guide is in Lesson 1.'
),

// -------------------------------------------------------------------------
// LESSON 4
// -------------------------------------------------------------------------
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
},
{
title: '5. `yield from` & Subgenerator Delegation (Expert Teaser)',
beginner: 'If you have a generator inside a generator, you don\'t need a messy loop to pass data up. You can just hand the controls over to the inner generator completely.',
advanced: '*(Pro Track Preview)* `yield from` establishes a transparent, bidirectional pipe between the caller and a subgenerator. It delegates `send()`, `throw()`, and `close()` calls directly to the inner generator, and captures its final `return` value. This is the exact mechanism `asyncio` uses to chain coroutines.'
}
],
{
title: 'Build an Atomic File Writer',
intro: 'We are going to build a context manager that writes to a temporary file. If the write succeeds, it renames it to the real file. If an error happens, it deletes the temporary file, ensuring the original file is never corrupted.',
steps: [
'Open your REPL and run `import os` and `from contextlib import contextmanager`.',
'Define the generator: `@contextmanager \\n def atomic_write(filename): \\n temp_file = filename + ".tmp"`.',
'Open the temp file and yield it: `f = open(temp_file, "w") \\n try: yield f`.',
'Handle the success case: `except Exception: \\n f.close(); os.remove(temp_file); raise`.',
'Finalize the success case in an `else:` block: `f.close(); os.rename(temp_file, filename)`.',
'Test a success: `with atomic_write("test.txt") as f: f.write("Success!")`. Check your directory; `test.txt` exists.',
'Test a failure: `with atomic_write("test2.txt") as f: f.write("Fail!"); raise ValueError("Crash!")`. Check your directory; the temporary file was cleanly deleted and `test2.txt` was never created.'
],
goal: 'You have mastered resource routing, utilizing generator state suspension and context management to create a resilient, atomic I/O operation.',
},
[
q('What happens natively when a generator yields its final value and terminates?', ['It returns `None`.', 'It restarts from the beginning.', 'It raises a `StopIteration` exception.', 'It deletes itself from memory immediately.'], 2, 'When a generator function naturally reaches the end of its code block or hits a `return` statement, Python automatically raises `StopIteration` to signal exhaustion. **Why others are wrong:** It does not return None to the caller (it raises). It does not restart or delete itself immediately.'),
q('What is the primary purpose of `generator.send(value)`?', ['To pass a new parameter to the generator\'s `__init__` method.', 'To inject a value back into the generator at the current `yield` expression.', 'To send the generator to another thread.', 'To reset the generator\'s internal state.'], 1, '`send()` resumes the generator and causes the `yield` expression where it was paused to evaluate to the injected value, enabling two-way coroutine communication. **Why others are wrong:** It does not affect `__init__`, move threads, or reset state.'),
q('If an exception occurs inside a `with` block, how can a custom `__exit__` method prevent the program from crashing?', ['By calling `sys.exit(0)`.', 'By raising a different exception.', 'By returning the boolean `True`.', 'By yielding `None`.'], 2, 'If `__exit__` returns `True`, Python interprets this as "the exception has been handled safely" and suppresses the error, allowing the program to continue executing after the `with` block. **Why others are wrong:** sys.exit kills the program. Raising another exception crashes it. Yielding is invalid in `__exit__`.'),
q('When using `@contextmanager`, where should the cleanup code (like closing a connection) be placed?', ['Inside a `finally` block immediately following the `yield` statement.', 'Before the `yield` statement.', 'In a separate `__del__` method.', 'Inside the `except StopIteration` block.'], 0, 'Placing cleanup code in a `finally` block after the `yield` ensures that the teardown logic executes flawlessly, regardless of whether the `with` block completed successfully or crashed. **Why others are wrong:** Before yield is setup. `__del__` is unreliable. StopIteration is handled internally by the decorator.'),
q('What does `yield from` do in a generator?', ['It stops the generator permanently.', 'It creates a transparent, bidirectional pipe delegating `send`, `throw`, and `close` to a subgenerator.', 'It converts the generator into a list.', 'It bypasses the GIL.'], 1, '`yield from` delegates iteration and coroutine signals directly to an inner subgenerator, capturing its final return value. This is the foundation of asyncio coroutine chaining. **Why others are wrong:** It does not stop the generator, convert to a list, or bypass the GIL.')
],
[
'Generators act as cooperative state machines, pausing execution frames via `yield`.',
'Using `.send()` and `.throw()` transforms generators from simple iterators into dynamic coroutines.',
'The Context Manager Protocol (`__enter__` / `__exit__`) is the standard for bulletproof resource cleanup.',
'`@contextmanager` elegantly combines generator states and `try/finally` blocks into clean, classless context managers.',
'`yield from` delegates execution and signals transparently to subgenerators, forming the basis of asyncio.'
],
'If you want to use a big terminal, use your CMD. Full guide is in Lesson 1.'
),

// -------------------------------------------------------------------------
// LESSON 5
// -------------------------------------------------------------------------
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
},
{
title: '5. `epoll` vs `select` (Expert Teaser)',
beginner: 'Older programs had to ask the computer "Is the data ready?" for every single connection one by one. Modern programs just tell the computer "Wake me up when ANY of these are ready," which is infinitely faster.',
advanced: '*(Pro Track Preview)* The legacy `select` system call scales poorly ($O(N)$) because it requires copying all file descriptors to the kernel on every poll. `epoll` (Linux) and `kqueue` (BSD/Mac) use a registration model ($O(1)$), allowing a single thread to efficiently monitor millions of concurrent sockets without CPU thrashing.'
}
],
{
title: 'Code an Async TCP Scanner',
intro: 'We are going to build an asynchronous port scanner that checks hundreds of network ports concurrently in a fraction of a second, vastly outperforming standard blocking loops.',
steps: [
'Open your REPL or an empty script. Import modules: `import asyncio`',
'Write the check function: `async def check_port(host, port): \\n try: \\n await asyncio.wait_for(asyncio.open_connection(host, port), timeout=0.5) \\n print(f"Port {port} is OPEN") \\n except Exception: pass`',
'Write the main loop: `async def main(): \\n tasks = [asyncio.create_task(check_port("8.8.8.8", p)) for p in [53, 80, 443, 8080, 22]] \\n await asyncio.gather(*tasks)`',
'Run it: `asyncio.run(main())`. Notice how all ports are checked simultaneously; the entire script finishes in ~0.5 seconds regardless of how many ports fail.',
'Now add a simulated blocking function: `import time \\n def bad_sleep(): time.sleep(2)`. Call this inside `check_port` and watch the concurrent performance completely collapse.'
],
goal: 'You successfully utilized the event loop to multiplex network I/O, proving that `asyncio` can handle massive concurrency natively—provided the loop remains unblocked.',
},
[
q('What is the actual difference between an asyncio Coroutine and a Task?', ['A Coroutine runs in a separate thread; a Task runs in the main thread.', 'Calling a Coroutine executes it immediately; a Task delays execution.', 'A Coroutine is an unstarted state machine; a Task schedules that state machine onto the event loop to run concurrently.', 'They are synonymous in Python 3.10+.'], 2, 'Simply calling `async_func()` returns a coroutine object but does not execute it. Wrapping it via `asyncio.create_task(async_func())` informs the event loop to actively drive its execution. **Why others are wrong:** Both run in the main thread. Coroutines don\'t execute immediately. They are distinct objects.'),
q('Why is calling `time.sleep()` disastrous in an asyncio program?', ['It triggers a `RuntimeError` immediately.', 'It halts the underlying OS thread, preventing the single-threaded event loop from processing any other concurrent tasks.', 'It consumes massive amounts of memory by keeping coroutines open.', 'It randomly kills pending Futures.'], 1, 'Asyncio is single-threaded. `time.sleep()` blocks the actual OS thread, completely stopping the event loop from polling file descriptors or resuming other tasks. **Why others are wrong:** It does not trigger RuntimeError, consume massive memory, or kill futures.'),
q('If you have a CPU-intensive math calculation, how should you execute it within an asyncio application?', ['Wrap it in `asyncio.create_task()`.', 'Add `await` before the function call.', 'Pass the function to `loop.run_in_executor()` using a ProcessPoolExecutor.', 'Use `yield from` instead of `await`.'], 2, 'CPU-bound operations will block the loop. You must offload them to a separate process (or thread for pure C-extensions) using executors, allowing the main event loop to remain unblocked. **Why others are wrong:** create_task and await keep it in the event loop, blocking it. yield from is legacy.'),
q('Which underlying operating system mechanism powers the Python event loop\'s ability to monitor thousands of network connections efficiently?', ['The Global Interpreter Lock (GIL)', 'Multithreading contexts', 'I/O multiplexing system calls like `epoll` or `kqueue`', 'Subprocess Pipes'], 2, 'The event loop relies on low-level OS multiplexing (`epoll` on Linux, `kqueue` on BSD/Mac). These system calls allow a single thread to monitor thousands of file descriptors efficiently without polling them individually. **Why others are wrong:** GIL restricts threads. Multithreading isn\'t used for the loop itself. Pipes are for IPC.'),
q('Why is `epoll` vastly superior to the legacy `select` system call for high-concurrency servers?', ['`epoll` uses multiple CPU cores automatically.', '`epoll` uses an $O(1)$ registration model, avoiding the $O(N)$ overhead of copying all file descriptors to the kernel on every poll.', '`epoll` bypasses the GIL.', '`epoll` encrypts network traffic.'], 1, '`select` requires passing all active file descriptors to the kernel on every single loop iteration ($O(N)$). `epoll` registers them once and only notifies the kernel of changes ($O(1)$), scaling to millions of sockets. **Why others are wrong:** It does not use multiple cores, bypass the GIL, or encrypt traffic.')
],
[
'The Event Loop is a single-threaded infinite loop that uses OS multiplexing to resume paused I/O tasks.',
'Coroutines are state machines; they must be wrapped in `Task` objects to run concurrently in the background.',
'Never run blocking I/O or CPU-bound code directly in an `async` function; use `run_in_executor`.',
'Futures are low-level awaitables that represent data that will eventually resolve.',
'`epoll`/`kqueue` use $O(1)$ registration models, vastly outscaling the legacy $O(N)$ `select` call.'
],
'If you want to use a big terminal, use your CMD. Full guide is in Lesson 1.'
),

// -------------------------------------------------------------------------
// LESSON 6
// -------------------------------------------------------------------------
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
},
{
title: '5. Pickling Protocols & `__reduce__` (Expert Teaser)',
beginner: 'When Python sends an object to another process, it has to flatten it into a byte stream. If your object is too complex, Python doesn\'t know how to flatten it and crashes. You can teach it how!',
advanced: '*(Pro Track Preview)* The `pickle` module uses protocols (0 to 5) to serialize objects. For custom C-extensions or complex classes, you can implement the `__reduce__` or `__getstate__`/`__setstate__` dunder methods to explicitly define how an object is flattened and reconstructed across IPC boundaries, bypassing default reflection overhead.'
}
],
{
title: 'Parallel CPU Chunk Pipeline',
intro: 'We are going to prove that threading fails for CPU-bound tasks in Python, and write a parallelized mathematical cruncher utilizing ProcessPoolExecutor to max out your CPU cores.',
steps: [
'Open a Python script file (not REPL, as multiprocessing on Windows requires `if __name__ == "__main__":`).',
'Write a heavy CPU task: `def heavy_math(x): return sum(i * i for i in range(10_000_000))`',
'Import tools: `import time; from concurrent.futures import ProcessPoolExecutor, ThreadPoolExecutor`',
'Time the ThreadPool: `start = time.time()` \\n `with ThreadPoolExecutor() as ex: list(ex.map(heavy_math, range(4)))` \\n `print(f"Threads: {time.time() - start}")`. (It will be slow!).',
'Time the ProcessPool: `start = time.time()` \\n `with ProcessPoolExecutor() as ex: list(ex.map(heavy_math, range(4)))` \\n `print(f"Processes: {time.time() - start}")`. (It will be significantly faster on a multi-core machine!).',
'Bonus: Notice that if you change `heavy_math` to sleep for 2 seconds (`time.sleep(2)`), both Threads and Processes take ~2 seconds. The GIL only restricts CPU execution, not I/O waits.'
],
goal: 'You have quantified the GIL\'s restriction on CPU-bound threading and successfully bypassed it by architecting a true multi-core process pool.',
},
[
q('Why does the `multiprocessing` module bypass the Global Interpreter Lock (GIL)?', ['It disables the GIL entirely at the C compiler level.', 'It uses C-extensions for all underlying code.', 'It spawns independent Python interpreter instances at the OS level, each possessing its own GIL and isolated memory space.', 'It converts Python code to asynchronous coroutines.'], 2, 'The multiprocessing module doesn\'t remove the GIL; it circumvents it by running multiple separate Python programs. Because they are separate OS processes, they don\'t share the same memory or lock. **Why others are wrong:** It does not disable the GIL, rely solely on C-extensions, or use coroutines.'),
q('What is a major performance bottleneck to watch out for when passing data between multiple processes?', ['Data must be serialized (Pickled) and deserialized, which incurs high CPU and memory overhead.', 'The processes will constantly trigger the garbage collector.', 'The OS will randomly pause processes to sync their clocks.', 'Child processes cannot use the `math` module.'], 0, 'Because memory is isolated, Python must Pickle (convert to bytes) objects in Process A, push them through an OS pipe, and unpickle them in Process B. For massive datasets, this overhead can ruin your parallel speedup. **Why others are wrong:** GC isn\'t the main bottleneck. Clock sync isn\'t an issue. Child processes can use standard libraries.'),
q('When using `ProcessPoolExecutor.map()`, what does the `chunksize` argument optimize?', ['It limits how much memory the Python interpreter is allowed to consume.', 'It batches multiple iterables together into a single IPC transfer, minimizing serialization and pipe overhead.', 'It divides the CPU cores into logical chunks.', 'It determines the size of the shared memory block.'], 1, 'Chunking groups many small tasks together before passing them through the IPC pipeline. This drastically reduces the overhead of constantly serializing and passing single items back and forth. **Why others are wrong:** It does not limit memory, divide cores, or set shared memory size.'),
q('If you need multiple processes to read and write to the same massive multidimensional array with maximum performance, what should you use?', ['`multiprocessing.Queue`', '`multiprocessing.Manager().list()`', '`multiprocessing.shared_memory` (and tools like NumPy)', 'A temporary SQLite database'], 2, '`shared_memory` allows multiple processes to map the exact same block of raw RAM without pickling, IPC pipes, or proxies. It offers true zero-copy performance. **Why others are wrong:** Queues and Managers require serialization/pickling. SQLite is disk-based and slow.'),
q('How can you customize how a complex custom object is serialized across process boundaries?', ['By decorating it with `@parallel`.', 'By implementing `__reduce__` or `__getstate__`/`__setstate__` to explicitly define the pickling byte-stream reconstruction.', 'By adding `__slots__`.', 'By converting it to JSON manually.'], 1, 'Implementing `__reduce__` or the state dunders gives you explicit control over the pickle protocol, allowing you to bypass default reflection and optimize IPC byte-stream generation. **Why others are wrong:** There is no `@parallel` decorator. `__slots__` doesn\'t control pickling logic. Manual JSON is slower and loses type fidelity.')
],
[
'The multiprocessing module achieves true CPU parallelism by spawning entirely isolated Python interpreters.',
'Inter-Process Communication (IPC) requires Pickling, making it dangerous for passing massive datasets back and forth.',
'ProcessPoolExecutor handles worker management automatically; utilize `chunksize` to mitigate IPC overhead.',
'Use `shared_memory` for zero-copy data sharing, avoiding the severe performance hits of proxy Managers.',
'Implement `__reduce__` to explicitly control how complex objects are serialized across IPC boundaries.'
],
'If you want to use a big terminal, use your CMD. Full guide is in Lesson 1.'
),

  // -------------------------------------------------------------------------
// LESSON 7
// -------------------------------------------------------------------------
L(
'pyx-07', 7, 'Advanced Function & Class Decorators', '🎁',
'Decorators are the backbone of Python frameworks like Flask, FastAPI, and Pytest. Moving beyond basic `@timer` functions, expert metaprogramming requires parameterized decorators, preserving signatures with `wraps`, dynamic argument inspection, and wrapping entire classes.',
[
{
title: '1. The Anatomy of a Closure',
beginner: 'A decorator is just a function that takes another function, adds some behavior, and returns a new function. It remembers the variables from the outside function using something called a "closure".',
advanced: 'Closures occur when a nested function references variables from its enclosing scope. Python stores these references in the `__closure__` attribute as a tuple of "cell" objects. This late-binding scope resolution is what allows decorators to maintain state between executions without relying on global variables.'
},
{
title: '2. Parameterized Decorators',
beginner: 'If you want a decorator that takes arguments, like `@retry(times=3)`, you have to write a function inside a function inside a function! It creates a factory that builds your decorator.',
advanced: 'A parameterized decorator requires three layers: The outer factory (takes arguments), the middle decorator (takes the function), and the inner wrapper (takes the `*args, **kwargs`). Alternatively, implementing `__call__` on a class makes stateful decorators much easier to read and debug.'
},
{
title: '3. Signature Preservation (`wraps`)',
beginner: 'When you wrap a function, its name and documentation get overwritten by the wrapper function. You use `@wraps` to copy the original function\'s identity back onto the wrapper.',
advanced: '`functools.wraps` copies `__name__`, `__doc__`, `__module__`, and `__annotations__`. For advanced framework development, you use `inspect.signature()` to deeply introspect the wrapped function, allowing your decorator to magically inject dependencies (like FastAPI does with routes) based on type hints.'
},
{
title: '4. Class Decorators',
beginner: 'Decorators aren\'t just for functions. You can put a decorator above a `class` definition to automatically modify the class, add methods, or register it into a system.',
advanced: 'A class decorator receives the class object itself after it has been created by the metaclass. It is a lighter, simpler alternative to Metaclasses or `__init_subclass__` for tasks like wrapping all methods with logging, implementing Singleton logic, or dataclass-style automatic `__init__` generation.'
},
{
title: '5. Descriptor-Based Method Wrapping (Expert Teaser)',
beginner: 'Did you know that when you call a method on a class, Python is actually using a hidden descriptor to bind the `self` variable? You can write your own descriptors to create entirely new types of methods!',
advanced: '*(Pro Track Preview)* Standard methods work because functions implement the descriptor protocol (`__get__`). When accessed via an instance, `__get__` returns a "bound method" with `self` pre-filled. By writing custom non-data descriptors, you can create `@classmethod`, `@staticmethod`, or entirely novel constructs like `@cached_property` from scratch.'
}
],
{
title: 'Build an Enterprise Rate-Limiter',
intro: 'We are going to build a highly advanced, parameterized class-based decorator that tracks function execution times and enforces a strict rate limit, utilizing stateful closures.',
steps: [
'Open your REPL or script.',
'Create a class-based decorator: `class RateLimit:` \\n `def __init__(self, max_per_sec): self.max = max_per_sec; self.calls = []`',
'Implement `__call__`: `def __call__(self, func):` \\n `import time; from functools import wraps` \\n `@wraps(func)` \\n `def wrapper(*args, **kwargs):`',
'Add the logic inside the wrapper: `now = time.time(); self.calls = [t for t in self.calls if now - t < 1.0]` \\n `if len(self.calls) >= self.max: raise Exception("Rate Limit Exceeded!")` \\n `self.calls.append(now); return func(*args, **kwargs)`',
'Return the wrapper: `return wrapper` at the end of the `__call__` method.',
'Use it: `@RateLimit(max_per_sec=2)` \\n `def fetch_data(): print("Fetching...")`',
'Test it: Call `fetch_data()` three times rapidly. The first two will print, and the third will immediately raise your custom Exception!'
],
goal: 'You have abstracted complex stateful logic (rate limiting) entirely away from your business logic, utilizing class-based decorators and `functools.wraps`.'
},
[
q('When building a decorator that accepts arguments (e.g., `@retry(retries=3)`), using standard functions, how many layers of nested functions are required?', ['One', 'Two', 'Three', 'Four'], 2, 'Three layers are required: Layer 1 takes the arguments (`retries=3`), Layer 2 takes the callable (`func`), and Layer 3 (the wrapper) catches the execution arguments (`*args, **kwargs`). **Why others are wrong:** One or two layers cannot capture both the decorator arguments and the function execution arguments simultaneously.'),
q('What is the primary function of `functools.wraps`?', ['It safely handles exceptions raised inside decorators.', 'It forces the wrapped function to execute inside a separate thread.', 'It copies metadata (like `__name__`, `__doc__`, and signatures) from the original function to the wrapper function.', 'It compiles the function into optimized C code.'], 2, 'Without `@wraps`, the decorated function loses its identity, appearing as "wrapper" to debuggers, profilers, and help() menus. `wraps` restores the original metadata. **Why others are wrong:** It does not handle exceptions, manage threads, or compile to C.'),
q('Why might an architect choose a Class Decorator over a Metaclass to add a standard `__repr__` method to several classes?', ['Class decorators are evaluated before the class dict is created, making them safer.', 'Class decorators bypass the MRO entirely.', 'Class decorators apply logic to the class *after* creation and are generally simpler and more explicit to read than metaclasses.', 'Metaclasses cannot modify `__repr__`.'], 2, 'Metaclasses are heavy and can cause MRO conflicts when multiple inheritances are involved. Class decorators simply receive the fully constructed class and return it modified, making them highly composable. **Why others are wrong:** Class decorators run *after* creation, do not bypass MRO, and metaclasses can absolutely modify `__repr__`.'),
q('If a decorator modifies a function\'s arguments dynamically before executing it, how can the decorator programmatically figure out what arguments the original function expects?', ['By reading `sys.argv`.', 'By analyzing `inspect.signature(func)`.', 'By parsing the `__doc__` string.', 'It is impossible in Python.'], 1, 'The `inspect` module (specifically `inspect.signature()`) allows metaprogrammers to deeply analyze the exact parameters, defaults, and type hints of a function at runtime. **Why others are wrong:** `sys.argv` is for CLI arguments, docstrings are unstructured text, and it is entirely possible via introspection.'),
q('How does Python natively implement standard instance methods (where `self` is automatically passed)?', ['Via a compiler macro.', 'Via the Garbage Collector.', 'Via the Descriptor Protocol (`__get__`) on standard function objects.', 'Via `__init_subclass__`.'], 2, 'Functions in Python are non-data descriptors. When accessed via an instance (`obj.method`), the function\'s `__get__` method fires, returning a "bound method" object with the instance pre-filled as the first argument. **Why others are wrong:** It is not a macro, GC feature, or subclass hook; it is pure descriptor mechanics.')
],
[
'A decorator is a Higher-Order Function that leverages closures to retain state and variable access.',
'Parameterized decorators require three nested functions, though class-based decorators implementing `__call__` offer cleaner state management.',
'Always use `@wraps` to preserve function identity, docstrings, and typing metadata.',
'Class decorators provide a clean, composable alternative to Metaclasses for post-creation class mutation.',
'Standard methods rely on the Descriptor Protocol (`__get__`) to bind `self` automatically.'
],
'If you want to use a big terminal, use your CMD. Full guide is in Lesson 1.'
),

// -------------------------------------------------------------------------
// LESSON 8
// -------------------------------------------------------------------------
L(
'pyx-08', 8, 'Memory Optimization & Control', '💾',
'Python is notoriously memory-hungry because every object carries significant overhead. When scaling systems to handle millions of objects, you cannot rely on the default garbage collector. You must actively optimize memory allocation by stripping away dynamic dictionaries, utilizing unboxed arrays, and performing zero-copy memory operations.',
[
{
title: '1. The `__dict__` Overhead',
beginner: 'By default, every custom object you create has a hidden dictionary (`__dict__`) that stores its variables. Dictionaries are incredibly fast, but they consume a massive amount of RAM.',
advanced: 'A completely empty class instance in CPython takes roughly 48 bytes (on 64-bit systems). The moment you add an attribute, Python allocates a dictionary, instantly adding over 100 bytes of overhead. Multiply that by 10 million objects, and you lose gigabytes of RAM to structural overhead alone.'
},
{
title: '2. Restricting Memory with `__slots__`',
beginner: 'You can tell Python, "I only want exactly these three variables on my class, and no more." By doing this, Python refuses to build the hidden dictionary, saving enormous amounts of memory.',
advanced: 'Defining `__slots__ = ("name", "id")` instructs the C struct to allocate memory strictly for those specific pointers. It completely disables the instance `__dict__` and `__weakref__`. This reduces memory usage by up to 60% and slightly speeds up attribute access by bypassing hash table lookups.'
},
{
title: '3. Lists vs. Arrays',
beginner: 'A Python `list` can hold anything—a string, an integer, and a custom class, all at once. But this flexibility costs memory. If you only need to store numbers, standard lists are terribly inefficient.',
advanced: 'A Python `list` is actually a dynamic array of pointers to `PyObject`s scattered across the heap. The `array` module (e.g., `array.array("i")`) allocates a continuous block of unboxed C integers. It destroys the flexibility of standard lists but provides massive cache locality and RAM savings.'
},
{
title: '4. Zero-Copy with `memoryview`',
beginner: 'If you have a massive 1GB file loaded in memory and you want to slice the first half of it, standard Python creates a brand new 500MB copy. `memoryview` lets you look at that half without copying it.',
advanced: '`memoryview` exposes the C-level buffer protocol. When you slice a `memoryview`, it simply returns a new view object pointing to the original memory address with modified offsets and strides. This allows for zero-copy binary data manipulation, crucial for high-performance networking and image processing.'
},
{
title: '5. `pymalloc` Arena Architecture (Expert Teaser)',
beginner: 'When you ask Python for a tiny piece of memory, it doesn\'t ask the operating system every single time. That would be too slow! Instead, Python grabs a big chunk of memory and slices it up itself.',
advanced: '*(Pro Track Preview)* CPython uses `pymalloc`, a specialized allocator for objects under 512 bytes. It requests memory from the OS in 256KB "Arenas", divides them into 4KB "Pools", and finally into fixed-size "Blocks". Understanding this hierarchy explains why Python\'s memory footprint doesn\'t always shrink immediately after deleting objects—the Arenas are only returned to the OS when completely empty.'
}
],
{
title: 'Analyze Object Memory Footprints',
intro: 'We are going to use the `sys` module to deeply inspect exactly how much RAM different Python data structures consume, proving the power of `__slots__`.',
steps: [
'Open your REPL and run `import sys`.',
'Create a standard class: `class NormalUser:` \\n `def __init__(self): self.name = "A"; self.id = 1`',
'Create a slotted class: `class SlottedUser:` \\n `__slots__ = ("name", "id")` \\n `def __init__(self): self.name = "A"; self.id = 1`',
'Instantiate both: `n = NormalUser(); s = SlottedUser()`',
'Check the base size: `print(sys.getsizeof(n))` vs `print(sys.getsizeof(s))`. You will immediately see `SlottedUser` is smaller.',
'But wait, check the dictionary! Run `print(sys.getsizeof(n.__dict__))`. The normal user secretly hides a massive dictionary footprint that `getsizeof(n)` does not automatically recursively count.',
'Try to run `s.__dict__`. It raises an AttributeError because slotted classes do not have dictionaries!'
],
goal: 'You successfully visualized the hidden memory overhead of Python objects and implemented structural restrictions to drastically reduce application RAM consumption.'
},
[
q('What is the primary technical drawback of using `__slots__` in a class?', ['It makes attribute access significantly slower.', 'It prevents the class from using standard inheritance, disabling dynamic attribute assignment and breaking some metaprogramming tools.', 'It causes the Garbage Collector to ignore the object entirely.', 'It prevents the object from being passed into a function.'], 1, 'Because `__slots__` destroys the `__dict__`, you can no longer assign new, arbitrary attributes to the object at runtime. It also complicates multiple inheritance setups if parent classes don\'t align their slots. **Why others are wrong:** Attribute access is actually faster, GC still tracks it, and it can be passed to functions normally.'),
q('Why does an `array.array("i", [1, 2, 3])` use less memory than `[1, 2, 3]`?', ['Because arrays automatically compress data into ZIP formats.', 'Because lists store a pointer to a separate PyObject for every single element, whereas arrays store raw, unboxed C values continuously in memory.', 'Because arrays delete elements after they are read once.', 'Because lists allocate memory for 100 elements even when empty.'], 1, 'Standard lists require a PyObject header (type and refcount) for every single item, plus a pointer. Arrays bypass PyObjects entirely, storing bare C primitives sequentially. **Why others are wrong:** Arrays do not use ZIP compression, delete elements, or pre-allocate 100 elements.'),
q('If you execute `data = my_bytes[0:1000]`, what happens in memory?', ['Python creates a brand new 1000-byte object and copies the data into it.', 'Python creates a pointer to the original memory address.', 'Python deletes the original bytes.', 'Python compresses the bytes.'], 0, 'Standard slicing natively creates a new copy of the data. To avoid this costly allocation, you must wrap the bytes in a `memoryview` first. **Why others are wrong:** Standard slicing copies data; it does not just create a pointer, delete the original, or compress it.'),
q('Which built-in module exposes the exact byte-size of a Python object?', ['`os.size()`', '`memory.footprint()`', '`sys.getsizeof()`', '`gc.sizeof()`'], 2, '`sys.getsizeof()` queries the object\'s C struct for its exact size in memory. However, remember that it is not recursive—it will not weigh the contents of containers natively. **Why others are wrong:** The other functions do not exist in the standard library.'),
q('Why doesn\'t Python\'s memory usage immediately drop to zero after deleting millions of small objects?', ['Because the Garbage Collector is broken.', 'Because `pymalloc` holds onto 256KB Arenas and only returns them to the OS when every single block inside the Arena is free.', 'Because the CPU cache locks the memory.', 'Because Python encrypts deleted memory.'], 1, '`pymalloc` allocates memory in large Arenas to avoid slow OS calls. An Arena is only released back to the operating system when it is 100% empty, which causes memory fragmentation in long-running processes. **Why others are wrong:** The GC works fine, CPU caches don\'t lock RAM, and Python doesn\'t encrypt deleted memory.')
],
[
'Every dynamic Python object carries a hidden, memory-heavy `__dict__`.',
'Declaring `__slots__` strips the dictionary, rigidly defining attributes to save massive amounts of RAM.',
'For numerical sequences, `array.array` offers dense C-level memory packing compared to standard lists.',
'`memoryview` utilizes the buffer protocol to allow zero-copy slicing of binary data.',
'`pymalloc` Arenas cause memory fragmentation, preventing immediate RAM release to the OS.'
],
'If you want to use a big terminal, use your CMD. Full guide is in Lesson 1.'
),

// -------------------------------------------------------------------------
// LESSON 9
// -------------------------------------------------------------------------
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
},
{
title: '5. Protocol Variance (Expert Teaser)',
beginner: 'If a function expects a "Reader", and you give it a "FileReader", it works. But sometimes, generic protocols get confused about whether they should accept sub-types or super-types. This is called Variance.',
advanced: '*(Pro Track Preview)* Protocols can be Covariant, Contravariant, or Invariant. A covariant protocol (like `Iterable[T]`) allows you to pass a more specific type (e.g., `Iterable[Cat]` where `Iterable[Animal]` is expected). Understanding variance is critical for building mathematically sound, generic type architectures in enterprise Python.'
}
],
{
title: 'Build a Plug-and-Play Architecture',
intro: 'We are going to define a formal Protocol and prove that objects can satisfy strict typing requirements without ever inheriting from a parent base class.',
steps: [
'Open your REPL.',
'Import tools: `from typing import Protocol, runtime_checkable`',
'Define a runtime Protocol: \\n `@runtime_checkable` \\n `class Logger(Protocol):` \\n `def log(self, msg: str) -> None: ...`',
'Create a class that DOES NOT inherit from Logger: \\n `class ConsoleLogger:` \\n `def log(self, msg: str): print(msg)`',
'Create a class that fails the rule: \\n `class BadLogger:` \\n `def print_out(self, msg: str): print(msg)`',
'Test them dynamically: run `print(isinstance(ConsoleLogger(), Logger))` — it prints `True`! Python structurally verified the `.log()` method exists.',
'Run `print(isinstance(BadLogger(), Logger))` — it prints `False`! It protected your system without using rigid inheritance.'
],
goal: 'You have implemented structural subtyping, allowing discrete systems to interact through behavioral contracts rather than heavy, nominal class inheritance.'
},
[
q('What is the defining characteristic of "Nominal Subtyping" (like standard Abstract Base Classes)?', ['It relies entirely on duck typing.', 'It requires explicit, named inheritance (e.g., `class A(Base):`).', 'It is only checked by the garbage collector.', 'It allows objects to dynamically change types.'], 1, 'Nominal typing requires an explicit declaration of a relationship. A class is only considered a subtype if its definition literally names the parent class in its inheritance list. **Why others are wrong:** It is the opposite of duck typing, has nothing to do with GC, and doesn\'t allow dynamic type changing.'),
q('How does `typing.Protocol` differ from `abc.ABC`?', ['Protocols are much slower at runtime than ABCs.', 'Protocols force you to write the method logic inside the Protocol definition.', 'Protocols allow type checkers to verify structural compatibility without requiring explicit inheritance.', 'Protocols cannot contain methods, only variables.'], 2, 'Protocols enable compile-time Duck Typing. A class implicitly satisfies a Protocol simply by possessing the required methods, completely decoupling the implementation from the interface definition. **Why others are wrong:** Protocols are static (no runtime speed penalty), contain stubs (not logic), and definitely contain methods.'),
q('What is a limitation of using the `@runtime_checkable` decorator with Protocols?', ['It crashes if you use `isinstance()`.', 'It checks that the method names exist, but it cannot verify if the method\'s runtime arguments or return types match the Protocol.', 'It permanently alters the MRO of the class.', 'It deletes the type annotations from memory.'], 1, 'At runtime, `@runtime_checkable` simply uses `hasattr` to verify that the required method names exist on the object. It does not perform deep signature validation during execution. **Why others are wrong:** It enables `isinstance()`, does not alter MRO, and does not delete annotations.'),
q('Why is structural subtyping highly preferred in modern enterprise architectures over deep inheritance trees?', ['Because it makes the code execute 10x faster.', 'It prevents the Global Interpreter Lock from blocking.', 'It allows highly decoupled architectures where modules only depend on behavior, making testing and refactoring drastically easier.', 'It automatically serializes objects to JSON.'], 2, 'Decoupling is the primary goal of expert architecture. Protocols allow you to swap out databases, loggers, or APIs easily, as long as the new object matches the required structural behavior. **Why others are wrong:** It doesn\'t affect execution speed, the GIL, or JSON serialization.'),
q('If a Protocol is defined as Covariant, what does it allow?', ['It allows passing a more specific subtype where a general supertype is expected (e.g., `Cat` where `Animal` is expected).', 'It allows passing a general supertype where a specific subtype is expected.', 'It prevents any type checking.', 'It forces the class to inherit from `object`.'], 0, 'Covariance preserves the direction of subtyping. If `Cat` is a subtype of `Animal`, a covariant `Box[Cat]` can be safely passed to a function expecting `Box[Animal]`. **Why others are wrong:** Passing a supertype where a subtype is expected is Contravariance. It doesn\'t prevent checking or force inheritance.')
],
[
'Dynamic Duck Typing is flexible but prone to catastrophic runtime errors in large systems.',
'Abstract Base Classes enforce Nominal Subtyping, creating heavily coupled inheritance chains.',
'`typing.Protocol` introduces compile-time Structural Subtyping, decoupling interfaces from implementations.',
'`@runtime_checkable` extends Protocols, allowing `isinstance` checks against behavior rather than base classes.',
'Understanding Protocol Variance (Covariance/Contravariance) is key to advanced generic typing.'
],
'If you want to use a big terminal, use your CMD. Full guide is in Lesson 1.'
),

// -------------------------------------------------------------------------
// LESSON 10
// -------------------------------------------------------------------------
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
},
{
title: '5. The `sys.settrace` Overhead (Expert Teaser)',
beginner: 'How do tools like debuggers and line profilers know exactly which line of code is running? They use a secret tracking hook that slows down your program massively.',
advanced: '*(Pro Track Preview)* `sys.settrace()` registers a callback that fires on every single line execution, function call, and return. While essential for `pdb` and coverage tools, it forces the interpreter into a highly inefficient evaluation mode, slowing execution down by 10x to 100x. This is why `cProfile` (which uses C-level hooks) is preferred for performance analysis.'
}
],
{
title: 'Deterministic C-Profiling',
intro: 'We are going to generate an intentional bottleneck and use Python\'s built-in `cProfile` engine to statistically isolate the exact delegators and culprits in the call stack.',
steps: [
'Open a fresh script file (not REPL).',
'Write a sleeper: `import time` \\n `def slow_sub_task(): time.sleep(1)`',
'Write a math cruncher: `def heavy_math(): return sum(i * i for i in range(5_000_000))`',
'Write the main function: `def main(): slow_sub_task(); heavy_math()`',
'Import the profiler at the top: `import cProfile, pstats`',
'Run the profiler: `cProfile.run("main()", "stats.prof")`',
'Read the stats: `p = pstats.Stats("stats.prof")` \\n `p.strip_dirs().sort_stats("tottime").print_stats(10)`',
'Analyze the output: Look at the difference between `main()` (high cumtime, low tottime), `slow_sub_task()` (high tottime in sleep), and your generator expression.'
],
goal: 'You have transitioned from blind optimization to deterministic profiling, mastering the ability to mathematically isolate execution bottlenecks within the CPython runtime.'
},
[
q('What is the core difference between `cProfile` and the standard `profile` module?', ['`cProfile` can only profile C-extensions.', '`cProfile` is written in C and introduces drastically less overhead than the pure-Python `profile` module.', '`profile` profiles memory, while `cProfile` profiles CPU.', 'There is no difference; one is an alias for the other.'], 1, 'Because `cProfile` is implemented natively in C, its interference with the execution graph is minimal, making it the industry standard for deterministic CPU profiling in Python. **Why others are wrong:** It profiles Python code, `profile` is also for CPU, and they are distinct modules.'),
q('When reviewing a `cProfile` report, what does a high `cumtime` but a low `tottime` indicate about a function?', ['The function is a massive bottleneck doing heavy computational work itself.', 'The function is waiting on an external database.', 'The function executes quickly itself but calls out to other heavily time-consuming functions.', 'The function raised an exception.'], 2, 'Cumulative Time includes all sub-function calls. If Total Time is low but Cumulative is high, the function is primarily a delegator or manager waiting on its children to finish. **Why others are wrong:** It isn\'t doing heavy work itself, it isn\'t necessarily a DB wait, and exceptions don\'t dictate this metric.'),
q('Why might a senior engineer choose to use `line_profiler` over `cProfile`?', ['To monitor memory leaks.', 'To bypass the GIL.', 'Because `cProfile` only reports execution times at the function level, making it difficult to isolate the exact bottleneck within a massive 500-line function.', 'Because it is much faster.'], 2, '`cProfile` tells you *which* function is slow. `line_profiler` takes you deeper, analyzing the bytecode execution of *each specific line* within that slow function. **Why others are wrong:** It doesn\'t monitor memory, bypass the GIL, and it is actually much slower due to tracing overhead.'),
q('What is the fundamental mechanism that allows Cython to drastically speed up Python loops?', ['It parallelizes the loop across all CPU cores automatically.', 'It transpiles the code into JavaScript for V8 execution.', 'By adding static type hints, it bypasses dynamic PyObject overhead and compiles the logic directly into raw, native C code.', 'It removes the garbage collector.'], 2, 'The primary bottleneck in pure Python loops is the constant boxing/unboxing and type-checking of PyObjects. Cython utilizes static typing to generate highly optimized, raw C variables and functions. **Why others are wrong:** It doesn\'t auto-parallelize, use JS, or remove the GC.'),
q('Why is `sys.settrace()` rarely used for performance profiling?', ['Because it only works on Windows.', 'Because it forces the interpreter to fire a Python callback on every single line, slowing execution down by 10x to 100x.', 'Because it cannot track function returns.', 'Because it encrypts the output.'], 1, '`sys.settrace()` is designed for debuggers and coverage tools. The overhead of bouncing between C and Python on every single line execution makes it completely unsuitable for accurate performance timing. **Why others are wrong:** It works cross-platform, tracks returns, and doesn\'t encrypt output.')
],
[
'Optimization without profiling is blind; always use deterministic metrics to isolate bottlenecks.',
'`cProfile` provides low-overhead, function-level metrics; `tottime` vs `cumtime` helps trace the exact culprit.',
'`line_profiler` introduces overhead but provides surgical, line-by-line execution analytics.',
'When algorithmic scaling limits are reached, compiling bottlenecks via Cython or Rust (PyO3) yields native-level speeds.',
'`sys.settrace()` provides deep visibility but destroys performance, making it useless for timing.'
],
'If you want to use a big terminal, use your CMD. Full guide is in Lesson 1.'
),

// -------------------------------------------------------------------------
// LESSON 11
// -------------------------------------------------------------------------
L(
'pyx-11', 11, 'The Descriptor Protocol Engine', '🔑',
'Descriptors are the hidden machinery behind Python features like `@property`, class methods, and ORMs (like SQLAlchemy or Django models). Mastering descriptors allows you to intercept attribute access, set up custom data-binding, and control object lookup mechanics at the lowest level.',
[
{
title: '1. What is a Descriptor?',
beginner: 'A descriptor is simply an object that controls what happens when you get, set, or delete an attribute on another class. Think of it like an invisible security guard guarding a variable.',
advanced: 'A descriptor is any object that implements at least one method of the descriptor protocol: `__get__()`, `__set__()`, or `__delete__()`. When an attribute lookup occurs on an instance, Python\'s `__getattribute__` machinery routes the request through the descriptor instead of the standard instance dictionary.'
},
{
title: '2. Data vs Non-Data Descriptors',
beginner: 'If your guard only watches people read values, it acts one way. If it also controls who can write values, it behaves completely differently, altering Python\'s search priority.',
advanced: 'Data descriptors implement both `__get__` and `__set__`. Non-data descriptors only implement `__get__` (like standard methods). Crucially, data descriptors override entry lookup in the instance\'s `__dict__`. Non-data descriptors are overridden *by* the instance\'s `__dict__`.'
},
{
title: '3. Dynamic Naming with `__set_name__`',
beginner: 'In older Python versions, descriptors didn\'t know the name of the variable they were assigned to. Now, they are automatically told their own name when the class is created.',
advanced: 'Introduced in Python 3.6, `__set_name__(self, owner, name)` is automatically invoked at class creation time. It provides the descriptor with the class object (`owner`) and the variable string name (`name`), removing the need for fragile metaclass naming hacks.'
},
{
title: '4. Read-Only Properties & Validation',
beginner: 'Descriptors are perfect for verifying data. For example, you can create a single descriptor that ensures an age field or a price field can never be a negative number.',
advanced: 'By managing variable state inside the instance\'s `__dict__` using the field name resolved by `__set_name__`, a single descriptor can enforce type-checking and validation across infinite class attributes without duplicating getter/setter code.'
},
{
title: '5. The `__get__` Signature Nuance (Expert Teaser)',
beginner: 'When a descriptor fetches a value, it needs to know if it\'s being called on a specific object, or on the class itself. It uses a special signature to figure this out.',
advanced: '*(Pro Track Preview)* The `__get__(self, instance, owner)` method receives the instance (or `None` if accessed via the class) and the owner class. If `instance` is `None`, the descriptor should typically return itself. This nuance is exactly how `@classmethod` and unbound methods are implemented under the hood.'
}
],
{
title: 'Build a Custom ORM Field Validator',
intro: 'We are going to build a data-descriptor that forces database-style string length validation and integer bounds checking on standard class attributes.',
steps: [
'Open your REPL or script file.',
'Define the descriptor: `class NonNegative:` \\n `def __set_name__(self, owner, name): self.name = name` \\n `def __get__(self, instance, owner): return instance.__dict__.get(self.name) if instance else self`',
'Implement validation in `__set__`: `def __set__(self, instance, value):` \\n `if not isinstance(value, (int, float)) or value < 0: raise ValueError(f"{self.name} must be positive")` \\n `instance.__dict__[self.name] = value`',
'Create a target class using it: `class Product:` \\n `price = NonNegative()` \\n `stock = NonNegative()` \\n `def __init__(self, price, stock): self.price = price; self.stock = stock`',
'Instantiate safely: `p = Product(19.99, 5)`. Check variables: `print(p.price)`.',
'Test the guard: Try to run `p.price = -100`. Watch your descriptor intercept the assignment and fire a ValueError!'
],
goal: 'You have mastered Python\'s attribute lookup protocol, building a reusable database-style validation field that controls instance state transitions.'
},
[
q('What distinguishes a Data Descriptor from a Non-Data Descriptor?', ['Data descriptors store data in a database, non-data descriptors do not.', 'Data descriptors implement `__set__` or `__delete__`; non-data descriptors only implement `__get__`.', 'Non-data descriptors can bypass the Global Interpreter Lock.', 'Data descriptors are evaluated at compile time.'], 1, 'Implementing `__set__` or `__delete__` elevates a descriptor to a "data descriptor," which fundamentally changes its lookup priority over instance dictionaries. **Why others are wrong:** It has nothing to do with databases, the GIL, or compile time evaluation.'),
q('If an instance dictionary contains a key named "foo", and the class possesses a Data Descriptor also named "foo", which one wins during attribute lookup?', ['The instance dictionary key wins.', 'The Data Descriptor wins.', 'They merge into a single list.', 'Python triggers a NameError.'], 1, 'Data descriptors take ultimate precedence over instance dictionaries in CPython attribute lookup resolution (`__getattribute__`). **Why others are wrong:** Instance dicts lose to data descriptors. They don\'t merge, and no NameError is triggered.'),
q('What purpose does the `__set_name__` method serve in the descriptor lifecycle?', ['It sets the name of the author of the code.', 'It automatically renames the parent class.', 'It supplies the descriptor with the string name of the attribute it was assigned to during class definition.', 'It changes the variable type at runtime.'], 2, '`__set_name__` executes automatically when the owner class is constructed, allowing descriptors to capture their attribute string labels cleanly. **Why others are wrong:** It doesn\'t track authors, rename classes, or change types.'),
q('Why is it dangerous to store instance state directly inside a descriptor instance attribute (e.g., `self.value = value`)?', ['The descriptor is shared across all instances of the owner class, meaning changing the attribute on one instance would overwrite it for all instances.', 'It causes immediate memory corruption.', 'The variable becomes unreadable.', 'It breaks inheritance patterns.'], 0, 'A descriptor is instantiated once at the class level. Storing state on `self` makes it global to all instances. State must be routed into the target `instance.__dict__`. **Why others are wrong:** It doesn\'t corrupt memory, make variables unreadable, or break inheritance; it just causes logical data bleeding.'),
q('When a descriptor is accessed via the class itself (e.g., `MyClass.my_descriptor`), what is the value of the `instance` argument in `__get__`?', ['The class object.', 'A new instance of the class.', '`None`.', 'The string name of the descriptor.'], 2, 'When accessed via the class, `instance` is `None`. This allows the descriptor to return itself (unbound) rather than trying to fetch instance-specific data. **Why others are wrong:** It is not the class object (that\'s `owner`), not a new instance, and not the string name.')
],
[
'Descriptors intercept attribute lookup, management, and removal using specific special magic methods.',
'Data descriptors (`__set__` present) take lookup precedence over the standard instance `__dict__`.',
'The `__set_name__` method eliminates boilerplate naming registration at the class instantiation level.',
'Always store execution-state variables inside the target instance dictionary, never on the descriptor itself.',
'The `__get__` method uses `instance=None` to distinguish between class-level and instance-level access.'
],
'If you want to use a big terminal, use your CMD. Full guide is in Lesson 1.'
),

// -------------------------------------------------------------------------
// LESSON 12
// -------------------------------------------------------------------------
L(
'pyx-12', 12, 'Metaclasses & Class Construction', '🧬',
'Metaclasses are the blueprint of blueprints. In Python, classes themselves are objects created by a higher factory. Understanding metaclasses unlocks the absolute pinnacle of metaprogramming, allowing you to intercept class creation, modify class fields dynamically, and enforce architectural rules across large software suites.',
[
{
title: '1. Classes as Objects',
beginner: 'In Python, everything is an object—including classes. Since every object must come from a factory, classes must have a factory too. That factory is called a Metaclass.',
advanced: 'By default, all classes in Python are instances of the built-in metaclass `type`. When Python executes a `class MyClass:` block, it parses the body and passes it to `type(name, bases, dict)` to dynamically instantiate the class object.'
},
{
title: '2. The Interception Point (`__new__`)',
beginner: 'When you want to alter a class before it is officially built, you hook into a method called `__new__`. It allows you to inspect and modify everything about the class ahead of time.',
advanced: 'The metaclass `__new__` method is invoked before the class object is allocated in memory. It receives the metaclass instance, class name, parent inheritance bases, and the namespace dictionary, allowing full mutation of the class layout.'
},
{
title: '3. Enforcing Corporate Architecture',
beginner: 'Metaclasses are like automated strict code reviewers. You can write a metaclass that automatically rejects any class that doesn\'t write documentation or forgets to define a specific variable.',
advanced: 'By analyzing the class dictionary inside a custom metaclass, you can programmatically raise a `TypeError` at import-time if a concrete implementation fails to conform to strict naming structures or structural conventions.'
},
{
title: '4. Alternatives: `__init_subclass__`',
beginner: 'Writing full metaclasses can be complicated. For simpler hooks, Python provides a cleaner shortcut called `__init_subclass__` that lets parent classes supervise their children.',
advanced: 'Introduced in Python 3.6, `__init_subclass__` allows simple behavioral interception of subclasses without altering the metaclass. It is cleaner and prevents metaclass conflict errors during multiple inheritance cascades.'
},
{
title: '5. The Metaclass Conflict Hazard (Expert Teaser)',
beginner: 'If you try to inherit from two parent classes that were built by two different custom metaclasses, Python gets confused and crashes. It refuses to build a child class with two different bosses.',
advanced: '*(Pro Track Preview)* A `TypeError: metaclass conflict` occurs if the metaclass of a derived class is not a strict subclass of the metaclasses of all its bases. To resolve this, you must dynamically create a "bridge" metaclass that inherits from both parent metaclasses, unifying the construction pipeline.'
}
],
{
title: 'Build an API Enforcement Engine',
intro: 'We are going to build a strict metaclass that inspects child classes at boot-time and throws immediate system failures if a developer forgets to provide explicit snake_case names for methods.',
steps: [
'Open your script file or REPL.',
'Define your custom metaclass inheriting from type: `class StrictMeta(type):`',
'Override `__new__`: `def __new__(mcs, name, bases, dct):` \\n `for attr in dct:` \\n `if hasattr(dct[attr], "__call__") and not attr.startswith("__"):` \\n `if not attr.islower(): raise TypeError(f"Method \'{attr}\' must be lower_case!")` \\n `return super().__new__(mcs, name, bases, dct)`',
'Create a base class using this meta: `class APIBase(metaclass=StrictMeta): pass`',
'Test a correct class: `class GoodAPI(APIBase): def get_data(self): pass`. This imports perfectly!',
'Test a breaking class: `class BadAPI(APIBase): def getData(self): pass`. Watch Python crash with a TypeError the exact split-second the file is loaded!'
],
goal: 'You have leveraged CPython class-generation hooks to enforce organizational coding standards automatically at application boot-time.'
},
[
q('What is the default metaclass for all standard classes in Python?', ['object', 'type', 'abc.ABC', 'dict'], 1, 'In Python, `type` is the default metaclass responsible for manufacturing all class definitions at runtime. **Why others are wrong:** `object` is the base class, `abc.ABC` is a specific metaclass for abstract classes, and `dict` is a data structure.'),
q('What is the core difference between `__new__` and `__init__` inside a metaclass context?', ['`__new__` creates the class object in memory; `__init__` configures it after it is created.', '`__init__` executes first.', '`__new__` is only for numerical computations.', '`__init__` handles file streams.'], 0, '`__new__` handles the actual allocation and structural creation of the class object, whereas `__init__` configures the generated object after creation. **Why others are wrong:** `__new__` executes first, it isn\'t for math, and `__init__` doesn\'t handle files here.'),
q('What common architectural problem occurs when combining separate classes that have different custom metaclasses?', ['Memory overflow errors.', 'The Global Interpreter Lock breaks.', 'Metaclass Conflict (TypeError), because a class cannot have multiple independent metaclasses.', 'The code executes too slowly.'], 2, 'Python throws a Metaclass Conflict if a subclass tries to inherit from parents driven by distinct, unaligned custom metaclasses. **Why others are wrong:** It doesn\'t cause memory overflow, break the GIL, or slow down execution; it strictly halts class creation.'),
q('When should a developer prefer `__init_subclass__` over a full Metaclass?', ['When performance must be increased by 50%.', 'For simple registration or attribute validation on subclasses, avoiding the complexity and conflicts of custom metaclasses.', 'When rewriting the CPython garbage collector.', 'When working with legacy Python 2.7 systems.'], 1, '`__init_subclass__` is an explicit, lightweight lifecycle hook that handles most subclass setup needs without declaring a formal custom metaclass architecture. **Why others are wrong:** It doesn\'t boost performance by 50%, rewrite the GC, or work in Python 2.7.'),
q('How do you resolve a Metaclass Conflict when inheriting from two parents with different metaclasses?', ['You cannot resolve it; you must rewrite the parents.', 'You create a new "bridge" metaclass that inherits from both parent metaclasses.', 'You use `__slots__`.', 'You delete the `__dict__`.'], 1, 'By creating a bridge metaclass (e.g., `class CombinedMeta(MetaA, MetaB): pass`), you unify the construction pipeline, satisfying Python\'s requirement that the derived metaclass is a subclass of all base metaclasses. **Why others are wrong:** It is resolvable, `__slots__` is irrelevant, and deleting `__dict__` doesn\'t fix metaclass logic.')
],
[
'Classes are themselves dynamic run-time objects manufactured directly by metaclasses.',
'Metaclass `__new__` provides absolute power to alter or reject class schemas before instantiation.',
'Metaclasses operate at import/compile time, catching architectural compliance errors before execution.',
'Utilize `__init_subclass__` as a clean, localized alternative to minimize metaclass collision risks.',
'Metaclass conflicts require a "bridge" metaclass to unify divergent parent construction pipelines.'
],
'If you want to use a big terminal, use your CMD. Full guide is in Lesson 1.'
),

  // -------------------------------------------------------------------------
// LESSON 13
// -------------------------------------------------------------------------
L(
'pyx-13', 13, 'Advanced Context Managers', '🚪',
'Context managers are vastly more capable than simply closing open files. By diving into the deep lifecycle of the `with` statement, you can build enterprise transactional safety nets, custom exception suppression shields, and localized resource management contexts.',
[
{
title: '1. The Context Protocol Lifecycle',
beginner: 'The `with` statement runs setup code when you enter a block, and guarantees cleanup code runs when you leave, even if your program crashes inside.',
advanced: 'The protocol requires `__enter__()` and `__exit__()`. When entering the block, `__enter__` returns the context object. When leaving, `__exit__` catches any active exceptions and manages stack teardown operations.'
},
{
title: '2. Suppressing Exceptions cleanly',
beginner: 'Usually, if an error happens inside a block, your app crashes. A context manager can act like a sponge, soaking up specific errors and letting the program continue silently.',
advanced: 'If the `__exit__` method returns a truthy value (like `True`), CPython swallows the active exception entirely. Returning a falsy value (or `None`) forces the exception to bubble up the execution tree natively.'
},
{
title: '3. Generator-Based Managers',
beginner: 'You don\'t always need to write a whole new class to manage a context. Python provides a helper called `@contextmanager` that lets you use a simple generator with a `yield` statement.',
advanced: '`contextlib.contextmanager` transforms a generator function into a full class protocol. Code before the `yield` serves as `__enter__`, and everything inside a `finally:` block after the `yield` acts as `__exit__`.'
},
{
title: '4. Dynamic Context Stacking',
beginner: 'If you need to open 5 files or 10 database connections at the exact same time dynamically, you shouldn\'t nest 10 `with` statements inside each other. You use a tool called `ExitStack`.',
advanced: '`contextlib.ExitStack` lets you programmatically enter an arbitrary number of context managers dynamically. It tracks their teardown order and guarantees every context exits correctly in reverse order, regardless of intermediate failures.'
},
{
title: '5. Asynchronous Context Managers (Expert Teaser)',
beginner: 'What if your setup or cleanup code needs to wait for something, like downloading a file or closing a network connection? Standard `with` blocks freeze your program while waiting. You need an async version!',
advanced: '*(Pro Track Preview)* For I/O-bound teardowns, Python provides `async with` syntax, requiring `__aenter__` and `__aexit__` coroutine methods. This allows the event loop to yield control during resource acquisition and release, preventing blocking operations from stalling concurrent tasks.'
}
],
{
title: 'Build a Database Transaction Rollback Simulator',
intro: 'We are going to build a production-grade transaction rollback manager that saves mutations, but completely discards state modifications if an unhandled crash occurs inside the operational block.',
steps: [
'Open your editor or REPL.',
'Create your model dictionary: `db = {"balance": 100}`',
'Write the transactional class: `class Transaction:` \\n `def __enter__(self): self.backup = db.copy(); return db`',
'Implement failure rollback in exit: `def __exit__(self, exc_type, exc_val, exc_tb):` \\n `global db` \\n `if exc_type:` \\n `print("Crash detected! Rolling back..."); db = self.backup` \\n `else: print("Transaction committed successfully.")` \\n `return True`',
'Run a successful operation: `with Transaction() as tx: tx["balance"] += 50`. Check balance: `print(db)`. It works.',
'Run a failing operation: `with Transaction() as tx:` \\n `tx["balance"] += 500` \\n `raise RuntimeError("Network Timeout!")`',
'Check balance now: `print(db)`. It successfully rolled back to 150, discarding the corrupted state adjustment!'
],
goal: 'You have engineered an enterprise atomic rollback context manager capable of preserving state integrity against run-time failures.'
},
[
q('What happens if the `__exit__` method of a context manager returns `True`?', ['The program reboots completely.', 'Any exception raised inside the `with` block is completely suppressed and swallowed.', 'An intermediate thread is spawned.', 'Python raises a RuntimeError.'], 1, 'Returning `True` inside `__exit__` indicates to the interpreter that the error was fully handled and suppressed, halting propagation. **Why others are wrong:** It does not reboot, spawn threads, or raise a new error; it explicitly silences the active exception.'),
q('What are the three mandatory positional arguments that Python passes directly to `__exit__`?', ['`self`, `instance`, `owner`', '`exc_type`, `exc_value`, `traceback`', '`args`, `kwargs`, `context`', '`time`, `date`, `runtime`'], 1, '`__exit__` requires `exc_type` (the exception class), `exc_value` (the exception instance), and `traceback` (the execution stack trace frame object). **Why others are wrong:** The other options represent descriptor protocols, function signatures, or irrelevant data types.'),
q('When writing a generator-based context manager via `@contextmanager`, where should resource cleanup logic be safely declared?', ['Before the `yield` statement.', 'Inside a `try...finally` block immediately following or surrounding the `yield`.', 'In a separate function entirely.', 'Inside a lambda function.'], 1, 'Because an error can happen inside the calling context, wrapping the `yield` in a `try...finally` ensures the cleanup code executes flawlessly. **Why others are wrong:** Code before `yield` is setup. Separate functions or lambdas bypass the generator protocol\'s automatic teardown guarantees.'),
q('Which utility class should you use to manage an unpredictable, dynamic list of context managers simultaneously?', ['`contextlib.ExitStack`', '`contextlib.supress`', '`asyncio.gather`', '`multiprocessing.Pool`'], 0, '`ExitStack` allows flexible, programmatic expansion of nested active context states at runtime without hardcoded visual indentation trees. **Why others are wrong:** `suppress` only ignores specific exceptions. `gather` is for async coroutines. `Pool` is for CPU parallelism.'),
q('Why would an engineer choose `async with` over a standard `with` block for managing a network socket?', ['Because `async with` executes faster on single-core CPUs.', 'Because standard `with` blocks execute synchronously, which would freeze the entire asyncio event loop if the socket teardown involves network I/O waits.', 'Because `async with` automatically encrypts the socket data.', 'Because standard `with` blocks cannot handle exceptions.'], 1, 'Standard `with` blocks call synchronous `__enter__` and `__exit__` methods. If those methods perform blocking I/O (like waiting for a server ACK), they stall the event loop. `async with` uses awaitable `__aenter__`/`__aexit__` to yield control during waits. **Why others are wrong:** It is not about CPU speed, encryption, or exception handling capabilities.')
],
[
'The context protocol handles automatic resource acquisition and deterministic disposal actions.',
'`__exit__` maps full visibility into active system exception signals and stack states.',
'A truthy return value from `__exit__` swallows runtime execution errors.',
'Use `contextlib.ExitStack` to structurally orchestrate arrays of multiple runtime contexts dynamically.',
'For I/O-bound setup/teardown, utilize `async with` and `__aenter__`/`__aexit__` to prevent event loop blocking.'
],
'If you want to use a big terminal, use your CMD. Full guide is in Lesson 1.'
),

// -------------------------------------------------------------------------
// LESSON 14
// -------------------------------------------------------------------------
L(
'pyx-14', 14, 'Low-Level Socket Multiplexing', '🌐',
'High-performance networking requires stepping away from abstract web frameworks and interacting directly with operating system system-calls. By mastering non-blocking raw sockets and I/O multiplexing selectors, you can handle thousands of network streams on a single core without thread thrashing.',
[
{
title: '1. Sockets Demystified',
beginner: 'A raw socket is like a direct telephone connection between two programs across the internet. One program listens for a call, and the other dials the number.',
advanced: 'A socket is an operating system abstraction representing an endpoint for communication. Sockets map directly to file descriptors within the kernel, transmitting byte arrays over network cards via TCP or UDP protocols.'
},
{
title: '2. The Danger of Blocking Sockets',
beginner: 'By default, reading from a socket freezes your entire program. If a client connects and doesn\'t send any letters, your code gets stuck forever waiting on that one line.',
advanced: 'Standard sockets are blocking. Methods like `.accept()` or `.recv()` pause the execution thread entirely at the kernel level until new data transitions into the network buffer, making sequential single-threaded tracking impossible.'
},
{
title: '3. Intercepting with `selectors`',
beginner: 'Instead of standing by one phone waiting for a ring, you tell the OS: "Here are 100 phones. Wake my program up the exact microsecond any single one of them starts ringing!"',
advanced: 'Python\'s `selectors` module provides high-level I/O multiplexing. It maps to efficient kernel polling abstractions like `epoll` (Linux) or `kqueue` (macOS), waking a single loop process up only when specific buffers are ready to read or write.'
},
{
title: '4. Non-Blocking Byte Buffers',
beginner: 'When sockets are non-blocking, they never freeze. If they have no new data to read, they immediately throw an exception saying "Try again later!", allowing your loop to move to the next task.',
advanced: 'Setting `sock.setblocking(False)` configures operations to return immediately. If data isn\'t available, the OS fires a `BlockingIOError` (or `EWOULDBLOCK`). Developers must manage partial byte assemblies manually using explicit state queues.'
},
{
title: '5. The C10K Problem & Zero-Copy (Expert Teaser)',
beginner: 'Years ago, servers crashed if 10,000 people connected at once because the computer ran out of memory keeping track of them. Modern tools solve this by sharing memory directly with the network card.',
advanced: '*(Pro Track Preview)* The C10K problem was solved by shifting from thread-per-connection models to event-driven architectures. Advanced techniques like `sendfile()` or `splice()` enable "zero-copy" networking, where data moves from disk to socket entirely within kernel space, bypassing Python\'s memory space and the GIL entirely.'
}
],
{
title: 'Architect a Non-Blocking Echo Engine',
intro: 'We are going to configure a raw non-blocking socket server using the system selector loop to accept multiple overlapping connection frames on a single main thread.',
steps: [
'Open a script file.',
'Import components: `import socket, selectors` \\n `sel = selectors.DefaultSelector()`',
'Configure the host server: \\n `server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)` \\n `server.bind(("127.0.0.1", 9999)); server.listen()` \\n `server.setblocking(False)`',
'Register server into selector: `def accept(sock, mask):` \\n `conn, addr = sock.accept()` \\n `conn.setblocking(False)` \\n `sel.register(conn, selectors.EVENT_READ, read)` \\n `sel.register(server, selectors.EVENT_READ, accept)`',
'Write read handler: `def read(conn, mask):` \\n `try:` \\n `data = conn.recv(1024)` \\n `if data: conn.send(data)` \\n `else: sel.unregister(conn); conn.close()` \\n `except Exception: sel.unregister(conn); conn.close()`',
'Run the infinite selector poll loop: \\n `print("Server Active..."); while True:` \\n `events = sel.select(timeout=1)` \\n `for key, mask in events: callback = key.data; callback(key.fileobj, mask)`',
'Test it: Run this script, then open multiple separate terminal panels and connect via `nc 127.0.0.1 9999` to see instantaneous, concurrent processing without thread forks!'
],
goal: 'You have built an OS-multiplexed networking server from scratch, unlocking the raw design mechanics that power frameworks like NodeJS and Asyncio.'
},
[
q('What does setting `sock.setblocking(False)` do to network read execution?', ['It optimizes data compression speeds.', 'It forces network calls to instantly return data, raising a `BlockingIOError` if no inbound transmission bytes reside in the buffer.', 'It offloads the socket network traffic to an asynchronous subprocess pool.', 'It locks the network card entirely.'], 1, 'Non-blocking settings force immediate execution return from the kernel space, alerting the program through exceptions if buffers are empty. **Why others are wrong:** It does not affect compression, spawn subprocesses, or lock hardware.'),
q('Which low-level OS mechanism does the `selectors` module prioritize under the hood on standard Linux distributions?', ['The Global Interpreter Lock loop', '`epoll`', '`kqueue`', 'Subprocess Pipes'], 1, 'On Linux platforms, `selectors.DefaultSelector` maps directly to `epoll`, which tracks millions of descriptors with high efficiency. **Why others are wrong:** The GIL is a Python construct. `kqueue` is for BSD/macOS. Pipes are for IPC.'),
q('In a selector loop, what is typically attached to the `data` parameter during registration (`sel.register`)?', ['A secure authorization password hash string.', 'A callback reference function to handle subsequent data activity for that specific descriptor.', 'An integer representing file stream lengths.', 'A bytearray clone block.'], 1, 'Passing callback function references via registration parameters allows immediate event routing cascades during loop iteration evaluations. **Why others are wrong:** Passwords, integers, and bytearrays do not provide executable logic for event handling.'),
q('What happens when a TCP client cleanly disconnects a connection frame?', ['The server receives an infinite loop of empty bytes (`b""`) during a `.recv()` evaluation loop.', 'A `ConnectionError` crashes the system context.', 'The server drops memory allocations instantly.', 'A hardware signal fires.'], 0, 'A clean TCP connection termination manifests as an active read event that continually yields an empty byte-string (`b""`). **Why others are wrong:** It does not crash, auto-drop memory, or fire hardware signals; it requires explicit application logic to unregister and close the socket.'),
q('Why is `sendfile()` considered a "zero-copy" operation in advanced networking?', ['Because it compresses the file to zero bytes.', 'Because it transfers data directly from a file descriptor to a socket descriptor within the kernel, bypassing user-space memory copies and Python\'s GIL.', 'Because it sends the file without waiting for an acknowledgment.', 'Because it deletes the file after sending.'], 1, '`sendfile()` instructs the OS kernel to move data directly between file and socket buffers, eliminating the overhead of copying data into Python\'s user-space memory. **Why others are wrong:** It does not compress to zero bytes, skip TCP ACKs, or delete files.')
],
[
'Raw network sockets correspond straight to low-level operating system file descriptors.',
'Blocking calls halt systemic execution flow, forcing architecture scaling to crash without concurrency designs.',
'The `selectors` framework abstracts low-level OS event flags like `epoll` and `kqueue`.',
'An empty byte collection received on an active socket indicates client-side pipeline closure.',
'Zero-copy operations like `sendfile()` bypass user-space memory entirely for maximum throughput.'
],
'If you want to use a big terminal, use your CMD. Full guide is in Lesson 1.'
),

// -------------------------------------------------------------------------
// LESSON 15
// -------------------------------------------------------------------------
L(
'pyx-15', 15, 'CPython Memory & GC Internals', '♻️',
'To build bulletproof enterprise systems, you must understand how Python manages memory. Python combines reference counting with a cyclical garbage collector. Gaining mastery over memory lifecycles allows you to isolate memory leaks, manipulate object generation frames, and write zero-leak architectures.',
[
{
title: '1. Reference Counting Engine',
beginner: 'Python tracks how many other things are pointing to an object. The exact millisecond that count hits zero, the object is completely deleted from your computer\'s memory.',
advanced: 'Every object in CPython inherits the `PyObject` structure, which contains `ob_refcnt`. Passing an object to a function increments this count. Exiting the function decrements it. When it drops to zero, CPython calls the object\'s type-specific deallocator instantly.'
},
{
title: '2. Reference Cycles (The Hidden Traps)',
beginner: 'If Object A holds a link to Object B, and Object B holds a link to Object A, their counts will never hit zero—even if you lose access to both of them. This creates a permanent memory leak.',
advanced: 'Reference cycles cannot be cleaned up by pure reference counting. CPython resolves this by tracking all container objects (lists, dicts, custom objects) in double-linked lists across separate internal cyclical collection heaps.'
},
{
title: '3. The Generational Collector',
beginner: 'Python divides memory objects into three separate life stages: Generation 0, 1, and 2. New objects start in Generation 0, and are checked for leaks frequently. Long-lived objects move to Generation 2.',
advanced: 'The cyclic Garbage Collector utilizes heuristic generations. Generation 0 contains newly allocated items. If an item survives a GC cycle, it scales up to Gen 1, eventually reaching Gen 2. Long-lived objects are checked much less frequently to reduce CPU overhead.'
},
{
title: '4. Debugging Leaks with `tracemalloc`',
beginner: 'When your application memory keeps growing over time and you don\'t know why, you can use a built-in tool to take snapshots of your RAM allocations and compare them.',
advanced: 'The `tracemalloc` module hooks directly into CPython memory allocations. By capturing snapshots over time, developers can run differential analyses to isolate the exact line numbers and filenames inflating memory footprints.'
},
{
title: '5. `pymalloc` Arenas & Pools (Expert Teaser)',
beginner: 'Asking the operating system for tiny pieces of memory one by one is incredibly slow. Python grabs memory in huge chunks and slices it up itself to hand out instantly.',
advanced: '*(Pro Track Preview)* CPython uses `pymalloc`, a specialized allocator for objects under 512 bytes. It requests memory from the OS in 256KB "Arenas", divides them into 4KB "Pools", and finally into fixed-size "Blocks". Understanding this hierarchy explains why Python\'s memory footprint doesn\'t always shrink immediately after deleting objects—the Arenas are only returned to the OS when completely empty.'
}
],
{
title: 'Leak Isolation & Cycle Hunting',
intro: 'We are going to construct a cyclic memory leak intentionally and use the built-in `gc` engine to expose how Python detects and breaks unreferenced loop topologies.',
steps: [
'Open your REPL environment.',
'Import configurations: `import gc` \\n `gc.disable()` (Turn off the automatic background collection loop temporarily).',
'Define a node class: `class Node: pass`',
'Construct a cycle: `a = Node(); b = Node()` \\n `a.friend = b; b.friend = a`',
'Sever standard access references: `del a; del b`',
'Verify items are lost but stuck in memory: Check `gc.get_objects()`. The nodes are orphaned but alive because their reference counts are still 1.',
'Trigger a manual cyclical harvest: run `print(gc.collect())`. You will see Python return `2`, indicating it successfully discovered and freed your cyclic memory leak!'
],
goal: 'You have successfully diagnosed cyclic memory leak traps and mastered runtime garbage collection inspection routines.'
},
[
q('What internal tracking variable exists inside every single object structure in standard CPython?', ['`__gc_id__`', '`ob_refcnt`', '`sys.mem_addr`', '`Py_Malloc_Block`'], 1, 'The `ob_refcnt` attribute keeps track of how many active references point to the object, forming Python\'s primary memory management layer. **Why others are wrong:** The other options are fabricated or refer to unrelated modules.'),
q('Why can standard reference counting never reclaim memory occupied by cyclic references?', ['Because cyclic reference loops always hold reference counts of at least 1, preventing them from hitting zero natively.', 'Because cycles disable the C compiler optimization layers.', 'Because cycles migrate directly into OS swap files.', 'Because reference counting doesn\'t check container definitions.'], 0, 'Since cyclic nodes refer to each other, their tracking count remains locked above zero even after all global application variables are deleted. **Why others are wrong:** It has nothing to do with C compilers, OS swap files, or container definitions.'),
q('How many generations does the CPython cyclical garbage collector use to manage objects over time?', ['One generation.', 'Two generations.', 'Three generations (Gen 0, Gen 1, Gen 2).', 'Infinite dynamic generations.'], 2, 'Python utilizes three specific generations to group items based on their structural survival lifetimes, optimizing collection frequency heuristics. **Why others are wrong:** The GC strictly uses a 3-generation model, not 1, 2, or infinite.'),
q('Which built-in module tracks real-time execution allocation graphs to pin down memory inflation points?', ['`sys.getsizeof`', '`tracemalloc`', '`gc.get_referrers`', '`os.memory`'], 1, '`tracemalloc` provides robust, high-resolution differential snapshots of script line memory performance histories. **Why others are wrong:** `sys.getsizeof` only checks single object size. `gc.get_referrers` finds references but doesn\'t track allocation history. `os.memory` does not exist.'),
q('Why doesn\'t Python\'s RAM usage immediately drop to zero after deleting millions of small objects?', ['Because the Garbage Collector is broken.', 'Because `pymalloc` holds onto 256KB Arenas and only returns them to the OS when every single block inside the Arena is free.', 'Because the CPU cache locks the memory.', 'Because Python encrypts deleted memory.'], 1, '`pymalloc` allocates memory in large Arenas to avoid slow OS calls. An Arena is only released back to the operating system when it is 100% empty, which causes memory fragmentation in long-running processes. **Why others are wrong:** The GC works fine, CPU caches don\'t lock RAM, and Python doesn\'t encrypt deleted memory.')
],
[
'CPython relies primarily on immediate, deterministic reference counting for memory deletion.',
'Cyclic loops keep object reference counters above zero, creating severe memory leaks.',
'The cyclic GC engine acts as a secondary layer to inspect and break isolated reference loop topologies.',
'Use `tracemalloc` to record multi-generational stack trace memory allocation differences across operations.',
'`pymalloc` Arenas cause memory fragmentation, preventing immediate RAM release to the OS.'
],
'If you want to use a big terminal, use your CMD. Full guide is in Lesson 1.'
),

// -------------------------------------------------------------------------
// LESSON 16
// -------------------------------------------------------------------------
L(
'pyx-16', 16, 'Abstract Syntax Trees & Dynamic Execution', '🌳',
'Metaprogramming reaches its final evolution when you treat code as data. By converting Python code into Abstract Syntax Trees (AST), you can analyze syntax structures, modify code behavior at runtime, and write custom code-generation tools or secure execution environments.',
[
{
title: '1. The Compilation Pipeline',
beginner: 'Before Python executes your source text, it translates the characters into an organized tree structural layout that maps out the logical grammar of your commands.',
advanced: 'The compiler takes raw source code text, parses it through a lexical scanner into tokens, and builds an Abstract Syntax Tree (AST). The AST represents the structural logical hierarchy of the code before it is compiled into bytecode.'
},
{
title: '2. Inspecting Code via `ast`',
beginner: 'You can use Python\'s built-in `ast` module to read any python script file and inspect exactly how many loops, functions, or variables are inside it without running it.',
advanced: 'By utilizing `ast.parse()`, you generate an interactive tree of node objects (such as `ast.For`, `ast.FunctionDef`). You can then traverse this tree using an `ast.NodeVisitor` to perform static analysis or secure validation sweeps.'
},
{
title: '3. Codegen and Mutation',
beginner: 'You can write code that automatically rewrites other code. For example, you can programmatically change every addition sign (`+`) in a script into a multiplication sign (`*`) before it executes.',
advanced: 'Inheriting from `ast.NodeTransformer` allows you to intercept tree node generation. By returning modified or entirely different nodes from visitor methods, you dynamically transpile or inject middleware straight into the target runtime tree.'
},
{
title: '4. Dynamic Compilation safely',
beginner: 'Running code dynamically using standard `eval()` or `exec()` is incredibly dangerous because users can pass malicious commands. AST parsing allows you to inspect and block dangerous commands before they can run.',
advanced: 'To safely use dynamic code compilation, parse your inputs with `ast.parse()`, pass it through a validation node-visitor to verify no unauthorized nodes (`ast.Import`, `ast.Call`) exist, then invoke `compile()` and `exec()` on the validated tree.'
},
{
title: '5. AST vs. Bytecode Manipulation (Expert Teaser)',
beginner: 'Modifying the syntax tree is like editing the blueprint of a house before it\'s built. But sometimes, experts need to edit the actual bricks and mortar after the house is already standing.',
advanced: '*(Pro Track Preview)* While AST manipulation happens at the source level, advanced metaprogramming sometimes requires modifying the compiled `code` object\'s bytecode directly (using tools like `bytecode` or `xdis`). This allows for runtime instrumentation, profiling hooks, and obfuscation without access to the original source text.'
}
],
{
title: 'Build a Secure Code Sandbox Guard',
intro: 'We are going to construct a security engine that parses dynamic Python strings, inspects the abstract tree layout, and throws a security exception if any unauthorized imports are attempted.',
steps: [
'Open your script editor.',
'Import core modules: `import ast`',
'Write your security visitor class: `class SecurityGuard(ast.NodeVisitor):`',
'Override import tracking hooks: `def visit_Import(self, node): raise SecurityError("Imports are BANNED!")` \\n `def visit_ImportFrom(self, node): raise SecurityError("Imports are BANNED!")`',
'Create a mock custom exception: `class SecurityError(Exception): pass`',
'Test a safe script: `tree = ast.parse("x = 10 + 20 \\n print(x)")` \\n `SecurityGuard().visit(tree)`. It passes safely!',
'Test an unsafe script: `unsafe_tree = ast.parse("import os \\n os.system(\'rm -rf /\')")` \\n Run `SecurityGuard().visit(unsafe_tree)` and watch your AST guard catch the violation and block compilation immediately!'
],
goal: 'You have manipulated source-level abstract syntax graphs, creating a robust structural security validation engine for dynamic computations.'
},
[
q('What does `ast.parse()` generate when given a string of Python code?', ['An executable binary compilation module.', 'An Abstract Syntax Tree object consisting of nested syntactic node structures.', 'A dictionary mapping line execution speeds.', 'A raw byte array string sequence.'], 1, '`ast.parse()` reads text and compiles it into an Abstract Syntax Tree structure, representing code blocks as interactive node objects. **Why others are wrong:** It does not generate executable binaries, speed dictionaries, or raw byte arrays.'),
q('Which base class should you inherit from to modify nodes inside an AST layout dynamically?', ['`ast.NodeVisitor`', '`ast.NodeTransformer`', '`ast.ClassDef`', '`type`'], 1, '`ast.NodeTransformer` extends the visitor pattern, allowing methods to return entirely mutated node variations into the tree structure. **Why others are wrong:** `NodeVisitor` only inspects. `ClassDef` is a node type. `type` is a metaclass.'),
q('Why is analyzing an AST safer than using standard string scanning (e.g., `if "import" in code_str`) to secure dynamic execution blocks?', ['Because AST blocks cannot be bypassed by tricks like formatting, multi-line spacing, obfuscated encodings, or alias assignments.', 'Because AST runs within a completely separate OS sub-thread framework.', 'Because AST parses code significantly slower.', 'Because string scanning removes comments.'], 0, 'String matches fail against basic spacing or encoding obfuscations. AST maps actual syntactic evaluation goals, rendering evasion techniques useless. **Why others are wrong:** It does not run in sub-threads, speed is not the primary security factor, and comment removal is irrelevant to syntax validation.'),
q('What mandatory step must happen after a structural AST is mutated before it can be executed by `exec()`?', ['It must be written to a physical disk `.py` file.', 'It must be compiled into CPython bytecode using the built-in `compile()` function.', 'It must be converted into a JSON schema matrix.', 'The Garbage Collector must be flushed.'], 1, 'The execution runtime understands bytecode; mutated or newly generated syntax trees must clear the `compile()` phase before invocation. **Why others are wrong:** It does not need to be written to disk, converted to JSON, or require GC flushing.'),
q('What is the primary advantage of modifying bytecode directly instead of manipulating the AST?', ['It is much easier to read and write.', 'It allows for runtime instrumentation and modification of already-compiled code objects without needing access to the original source text.', 'It bypasses the Global Interpreter Lock.', 'It automatically optimizes the code for multi-core CPUs.'], 1, 'Bytecode manipulation operates on the compiled `code` object, enabling runtime hooks, profiling, and obfuscation even when the original `.py` source is unavailable. **Why others are wrong:** Bytecode is harder to read than AST. It does not bypass the GIL or auto-optimize for multi-core.')
],
[
'The AST maps an interactive logical blueprint of instructions prior to bytecode translation.',
'Use `ast.NodeVisitor` to statically inspect syntax structures without risk of runtime side-effects.',
'`ast.NodeTransformer` permits deep structural modifications of code components on the fly.',
'Validate raw AST schemas ahead of `compile()` triggers to run user expressions securely.',
'Bytecode manipulation enables runtime instrumentation when source-level AST access is unavailable.'
],
'If you want to use a big terminal, use your CMD. Full guide is in Lesson 1.'
),

// -------------------------------------------------------------------------
// LESSON 17
// -------------------------------------------------------------------------
L(
'pyx-17', 17, 'Advanced Pytest Metaprogramming', '🧪',
'Senior engineers don\'t write repetitive tests; they build custom test engines. By leveraging advanced Pytest metaprogramming hooks, custom plugin factories, and structural test parameterization fixtures, you can build dynamic testing suites that scale to handle massive software architectures.',
[
{
title: '1. The Pytest Execution Hook System',
beginner: 'Pytest isn\'t magic—it is a collection of hooks that let you intercept how test files are discovered, loaded, executed, and reported.',
advanced: 'Pytest organizes operations via a series of strictly defined configuration hooks (such as `pytest_runtest_setup`, `pytest_collection_modifyitems`). By defining these hooks in a `conftest.py` file, you can dynamically alter the framework\'s core test discovery and execution pipeline.'
},
{
title: '2. Dynamic Test Generation',
beginner: 'Instead of copy-pasting 50 test functions for 50 different inputs, you can write code that intercepts testing initialization and builds tests on the fly.',
advanced: 'By implementing the `pytest_generate_tests(metafunc)` hook, you can programmatically inspect custom function annotations or external database configurations, dynamically generating parameterized testing pipelines at collection time.'
},
{
title: '3. Advanced Fixture Factories',
beginner: 'Fixtures can do more than just return a string or list. A fixture can return a dynamic function, allowing you to pass configuration values straight into your test setup.',
advanced: 'A factory fixture returns a nested function execution block. This closure allows test scripts to pass dynamic setup parameters straight into the fixture scope while still leveraging Pytest\'s automatic dependency cleanup guarantees.'
},
{
title: '4. Intercepting Failures Programmatically',
beginner: 'You can write a hook that takes a picture of the screen or logs a precise database state the exact millisecond a test fails anywhere in your suite.',
advanced: 'By hooking into `pytest_runtest_makereport(item, call)`, you gain complete access to the outcome frame of an execution stage. If `report.failed` is true, you can introspect local frame variables to capture deep debugging data automatically.'
},
{
title: '5. Custom Pytest Plugins & `pytest.ini` (Expert Teaser)',
beginner: 'If your team has specific rules—like "every test must finish in under 1 second"—you can write a custom plugin that enforces these rules automatically across the entire company.',
advanced: '*(Pro Track Preview)* Beyond `conftest.py`, you can package reusable testing logic into installable Pytest plugins using `pytest11` entry points in your `pyproject.toml`. This allows you to distribute custom markers, CLI arguments, and assertion rewriting hooks across multiple repositories seamlessly.'
}
],
{
title: 'Build a Dynamic API Parameterization Engine',
intro: 'We are going to hook into Pytest\'s compilation engine inside an active conftest script to programmatically manifest test configurations dynamically out of structural lists.',
steps: [
'Create a fresh test directory workspace containing a dummy `test_api.py` and a configuration `conftest.py`.',
'In `conftest.py`, define your dynamic collection hook: `def pytest_generate_tests(metafunc):`',
'Add structural registration check logic: \\n `if "endpoint_route" in metafunc.fixturenames:` \\n `metafunc.parametrize("endpoint_route", ["/users", "/products", "/billing"])`',
'In your `test_api.py` file, write a single test function that consumes the dynamic input: \\n `def test_endpoint(endpoint_route):` \\n `print(f"Testing route: {endpoint_route}"); assert endpoint_route.startswith("/")`',
'Execute the suite inside your terminal workspace using standard shell tools: `pytest -s -v`',
'Observe the output: Pytest dynamically evaluated the configuration hooks, manufacturing three completely isolated, named test scenarios out of your meta array!'
],
goal: 'You have altered Pytest\'s boot collection tree, engineering a scalable data-driven test generation engine.'
},
[
q('Where must custom framework hooks be declared for Pytest to automatically discover and integrate them?', ['Inside the primary execution entry file.', 'Within a specialized configuration file strictly named `conftest.py`.', 'In the system initialization settings.', 'Inside standard python `__init__.py` files.'], 1, 'Pytest looks for `conftest.py` modules within target directories to register directory-level plugin hooks and modular fixture graphs. **Why others are wrong:** It does not scan entry files, system settings, or `__init__.py` for hooks.'),
q('What hook interface facilitates programmatic creation of test parameters during collection phase execution pipelines?', ['`pytest_runtest_setup`', '`pytest_generate_tests`', '`pytest_collection_finish`', '`pytest_make_test`'], 1, 'The `pytest_generate_tests(metafunc)` hook grants complete programmatic control over test matrix generation during the compilation stage. **Why others are wrong:** The other hooks handle setup, completion, or are non-existent.'),
q('What is a major advantage of utilizing a Factory Fixture pattern over a standard fixed return fixture configuration?', ['It executes 10x faster.', 'It allows tests to pass dynamic arguments into the fixture setup logic while maintaining automatic teardown protections.', 'It bypasses global isolation rules.', 'It doesn\'t require python decorators.'], 1, 'Factory fixtures return a callable function closure, giving tests full programmatic control over data configuration parameters during runtime initialization. **Why others are wrong:** It is not inherently faster, does not bypass isolation, and still relies on decorators.'),
q('Which property of the `pytest_runtest_makereport` report object reveals if an operation triggered an assertion failure?', ['`report.crashed`', '`report.failed`', '`report.status_code`', '`report.trace_error`'], 1, 'The `report.failed` boolean attribute lets developers intercept test failures and log diagnostic metrics or screenshots instantly. **Why others are wrong:** The other properties do not exist on the standard report object.'),
q('How can you distribute a custom Pytest hook across multiple different repositories in a large organization?', ['By copying the `conftest.py` file manually into every repo.', 'By packaging the hook as an installable plugin using the `pytest11` entry point in `pyproject.toml`.', 'By submitting a pull request to the Pytest GitHub repository.', 'By modifying the Python standard library.'], 1, 'Using the `pytest11` entry point allows you to build an installable pip package that Pytest automatically discovers and loads, centralizing testing logic. **Why others are wrong:** Manual copying is unscalable. PRs to Pytest are for core features. Modifying stdlib is dangerous and unsupported.')
],
[
'Pytest hooks expose absolute structural control over the entire testing execution lifecycle.',
'Use `conftest.py` scripts to inject global plugin middleware across targeted codebase suites.',
'The `pytest_generate_tests` framework hook automates complex testing arrays from configuration logs.',
'Factory fixture closures safely unify dynamic configuration parameters with deterministic resource tear downs.',
'Package reusable hooks as `pytest11` entry-point plugins for cross-repository testing standardization.'
],
'If you want to use a big terminal, use your CMD. Full guide is in Lesson 1.'
),

// -------------------------------------------------------------------------
// LESSON 18
// -------------------------------------------------------------------------
L(
'pyx-18', 18, 'Behavioral Design Patterns Pythonified', '🎨',
'Gang of Four design patterns often require overly verbose, rigid architectures in languages like Java or C++. Python\'s highly dynamic nature transforms these patterns. By mastering Pythonic implementations of Strategy, State, and Observer patterns, you can build incredibly flexible architectures with a fraction of the boilerplate code.',
[
{
title: '1. Pythonic Strategy Pattern',
beginner: 'The Strategy pattern lets you swap out the algorithm your code uses at runtime. In Python, you don\'t need to create complex class hierarchies to do this—you can just pass functions as arguments.',
advanced: 'Since functions are first-class objects in Python, a Strategy pattern does not require nominal class inheritance interfaces. You can store function references directly inside a execution lookup dictionary or pass them as callables, eliminating class boilerplate.'
},
{
title: '2. The State Pattern Engine',
beginner: 'If an object changes its behavior completely depending on its current mode (like a shopping cart that blocks edits after payment), you can let the object swap out its internal behavior class dynamically.',
advanced: 'The State pattern can be implemented in Python by dynamically updating an instance\'s `__class__` pointer at runtime. By swapping `instance.__class__ = PaidState`, the object immediately inherits a completely different set of methods natively.'
},
{
title: '3. Decoupled Observer Systems',
beginner: 'The Observer pattern lets an object broadcast news to an array of listening objects whenever its data changes, without needing to know anything about who is listening.',
advanced: 'Using custom descriptors or tracking properties, you can create an observable core that registers subscriber callbacks. When attributes mutate, the setter loops through the collection array, dispatching asynchronous updates smoothly.'
},
{
title: '4. Command Pattern with Callables',
beginner: 'The Command pattern packages an action into an object, allowing you to delay its execution, queue it up, or undo it later on.',
advanced: 'Implementing `__call__` transforms any standard object into a callable command frame. Storing these objects inside lists lets you build undo/redo histories and thread-safe pipeline queues with ease.'
},
{
title: '5. The Singleton via Metaclass (Expert Teaser)',
beginner: 'Sometimes you need to guarantee that only ONE copy of a class ever exists in your entire program (like a database connection manager). If someone tries to make a second one, they get the first one back.',
advanced: '*(Pro Track Preview)* While module-level variables or `__new__` overrides can enforce Singletons, the most robust Pythonic implementation uses a custom Metaclass that intercepts `__call__`. If an instance already exists in the metaclass registry, it returns the cached object, completely bypassing `__init__` and preventing duplicate allocation.'
}
],
{
title: 'Build an Ultra-Light State Machine',
intro: 'We are going to utilize Pythonic class pointer swapping to build an elegant state-machine that completely changes its operational responses without nested conditional statements.',
steps: [
'Open your script workspace or REPL environment.',
'Define state behavior one: `class DraftState:` \\n `@staticmethod` \\n `def send(ctx): print("Sending draft..."); ctx.__class__ = SentState`',
'Define state behavior two: `class SentState:` \\n `@staticmethod` \\n `def send(ctx): raise ValueError("Already sent! Action blocked.")`',
'Define the core context container: `class Document:` \\n `def __init__(self): self.__class__ = DraftState` \\n `def send(self): self.__class__.send(self)`',
'Instantiate your document object: `doc = Document()`',
'Trigger the first action call: `doc.send()`. It prints the success message and transitions state.',
'Trigger it again: `doc.send()`. Watch it immediately fire a ValueError because the object\'s underlying methods were swapped out behind the scenes!'
],
goal: 'You have leveraged Python\'s dynamic class assignment mechanics to build a state pattern with zero conditional branching.'
},
[
q('Why is the classical Strategy Pattern vastly simplified in Python?', ['Because Python compiles strategy patterns into native execution layers.', 'Because functions are first-class objects, allowing callables to be passed around directly without wrapping them in interface classes.', 'Because Python disables inheritance cascades.', 'Because dictionaries automatically generate strategies.'], 1, 'First-class function support allows developers to pass functional behaviors directly into context parameters, bypassing classical object wrapper hierarchies. **Why others are wrong:** It does not compile to native layers, disable inheritance, or auto-generate strategies.'),
q('What feature allows a Python object to instantly mutate its entire behavior profile and method execution map at runtime?', ['Modifying the memory address pointer manually.', 'Dynamically reassigning the instance\'s `__class__` attribute to point to a new state class block.', 'Defragmenting the system dictionary layout.', 'Re-running the system initialization script.'], 1, 'Reassigning `obj.__class__` dynamically updates CPython method lookup patterns, shifting behavior to the new target definition instantly. **Why others are wrong:** Manual memory modification is unsafe/impossible in pure Python. Defragmentation and re-init are irrelevant.'),
q('Which magic method allows any custom class instance to function as a Command Pattern object natively?', ['`__init__`', '`__call__`', '`__execute__`', '`__invoke__`'], 1, 'Implementing `__call__` makes an instance a callable object, allowing it to be stored, queued, and executed just like a standard function pointer. **Why others are wrong:** `__init__` is for setup. `__execute__` and `__invoke__` are not standard Python dunders.'),
q('What design advantage does the Observer pattern offer to scaling architectures?', ['It increases raw network transmission velocities.', 'It heavily decouples state providers from downstream consumers, preventing hardcoded dependencies.', 'It merges all class scopes into a unified dictionary space.', 'It removes the need for garbage collection loops.'], 1, 'Decoupled event broadcasting lets system states notify infinite downstream targets without introducing direct hardcoded imports or rigid couplings. **Why others are wrong:** It does not affect network speed, merge scopes, or remove GC needs.'),
q('What is the most robust way to implement a Singleton pattern in Python?', ['By using a global variable.', 'By overriding `__new__` to return a cached instance.', 'By using a custom Metaclass that intercepts `__call__` and returns a cached instance, bypassing `__init__` on subsequent calls.', 'By decorating the class with `@staticmethod`.'], 2, 'A metaclass intercepts the instantiation call (`MyClass()`). If an instance exists, it returns it directly, preventing `__init__` from running again and resetting state. **Why others are wrong:** Global variables are not encapsulated. `__new__` overrides still trigger `__init__` on every call unless carefully guarded. `@staticmethod` is irrelevant.')
],
[
'First-class functions eliminate structural boilerplate from classical design patterns.',
'Swapping `__class__` references shifts object behavioral states without nested conditional branches.',
'The Observer pattern decouples publisher engines from consumer dependency graphs.',
'Implement `__call__` to build command structures that can be queued, deferred, or rolled back.',
'Use a custom Metaclass to enforce robust, initialization-safe Singleton patterns.'
],
'If you want to use a big terminal, use your CMD. Full guide is in Lesson 1.'
),


  // -------------------------------------------------------------------------
// LESSON 19
// -------------------------------------------------------------------------
L(
'pyx-19', 19, 'Advanced Multi-Threading & Synchronization', '🧵',
'While the GIL restricts pure Python code to a single CPU core, multi-threading is highly efficient for I/O-bound applications. However, concurrent execution introduces race conditions and data corruption. To build rock-solid systems, you must master low-level primitives like Locks, Semaphores, and Thread-Safe Queues.',
[
{
title: '1. The GIL and Thread Context Switching',
beginner: 'Python threads don\'t run at the same time on multiple CPU cores, but the operating system constantly switches between them at lightning speed, making them perfect for waiting on network web calls.',
advanced: 'CPython uses cooperative and preemptive scheduling. The interpreter pauses a thread after a set period (the sys switch interval, defaulting to 15 milliseconds) to release the GIL, letting the next thread execute its bytecode frames.'
},
{
title: '2. Race Conditions Demystified',
beginner: 'If two separate threads try to update the exact same variable at the exact same fraction of a microsecond, the data can get corrupted, and you will lose tracking updates.',
advanced: 'Operations that look like a single line in Python (e.g., `x += 1`) are actually compiled into multiple distinct bytecode steps (LOAD, ADD, STORE). If a thread switch hits midway through those steps, updates from other threads get completely overwritten.'
},
{
title: '3. Synchronization Primitives',
beginner: 'To prevent data corruption, you use a Lock. It works like a bathroom key: only the thread holding the key can modify the shared variable. Everyone else must wait in line.',
advanced: '`threading.Lock` acts as a binary semaphore. When a thread calls `.acquire()`, it blocks further execution of other threads trying to claim the lock until `.release()` is safely invoked, ensuring atomic operations.'
},
{
title: '4. Thread-Safe Pipelines via `queue`',
beginner: 'Instead of manually locking and unlocking variables, you should pass data between threads using a thread-safe Queue. It handles all the locking safety rules automatically behind the scenes.',
advanced: 'The built-in `queue.Queue` module encapsulates all necessary locking and condition variable logic under the hood. It uses an internal deque to coordinate atomic thread-safe producer-consumer pipelines effortlessly.'
},
{
title: '5. Deadlocks & The Dining Philosophers (Expert Teaser)',
beginner: 'A deadlock happens when Thread A is waiting for a key held by Thread B, but Thread B is waiting for a key held by Thread A. They both freeze forever, and your program hangs!',
advanced: '*(Pro Track Preview)* Deadlocks occur when multiple locks are acquired in inconsistent orders across different threads. Advanced architectures prevent this by enforcing strict lock hierarchies, utilizing timeout-based acquisitions (`lock.acquire(timeout=1)`), or leveraging `threading.RLock` (Reentrant Locks) to allow the same thread to acquire a lock multiple times without freezing.'
}
],
{
title: 'Architect a Secure Atomic Ledger',
intro: 'We are going to simulate a race condition where multiple concurrent threads corrupt a global balance variable, then implement low-level thread locking to restore perfect atomic execution safety.',
steps: [
'Open a script file.',
'Import threading engines: `import threading, time` \\n `balance = 0; lock = threading.Lock()`',
'Write a dangerous update loop: `def deposit(): \\n global balance \\n for _ in range(100_000): \\n current = balance; time.sleep(0.000001); balance = current + 1`',
'Launch concurrent workers without safety: `t1 = threading.Thread(target=deposit); t2 = threading.Thread(target=deposit)` \\n `t1.start(); t2.start(); t1.join(); t2.join()`',
'Print out the result: `print(f"Corrupted Balance: {balance}")`. It will be significantly less than 200,000 due to race condition overwrite swaps!',
'Fix it with atomic locks: rewrite the loop to wrap the operational block inside a context manager: \\n `with lock: \\n current = balance; time.sleep(0.000001); balance = current + 1`',
'Reset balance to 0 and re-run your threads. Verify the total now reaches exactly 200,000 every single time!'
],
goal: 'You have isolated concurrent race conditions and implemented primitive locks to protect shared state integrity.'
},
[
q('Why can a simple line like `total += 1` trigger data corruption during concurrent execution flows?', ['Because integers are mutable in Python.', 'Because the expression resolves into multiple independent bytecode compilation operations, which can be interrupted by thread context switching.', 'Because the operating system randomly deletes calculations.', 'Because threads operate in separate memory silos.'], 1, '`total += 1` requires loading, modifying, and storing data. A thread switch occurring mid-operation causes data loss due to dirty read modifications. **Why others are wrong:** Integers are immutable in Python. The OS does not randomly delete calculations. Threads share the same memory space, which is exactly why the corruption occurs.'),
q('What mechanism governs the standard interval rate for CPython thread switching operations?', ['The garbage collector generation sweep clock.', 'The `sys.setswitchinterval()` configuration settings.', 'The CPU core temperature throttling sensor.', 'The socket connection polling mask.'], 1, '`sys.setswitchinterval()` determines how long the interpreter executes bytecode on a single thread before checking for a release request. **Why others are wrong:** It is not tied to the GC clock, CPU temperature, or socket masks.'),
q('Which data structure pattern is explicitly optimized for safe, boilerplate-free worker task distribution arrays?', ['A standard global list array.', 'A thread-safe `queue.Queue` class object.', 'An Abstract Syntax Tree lookup node.', 'A dictionary protected by slots.'], 1, '`queue.Queue` manages thread context coordination and block-release calls natively, protecting concurrent pipelines without manual lock boilerplate. **Why others are wrong:** Global lists require manual locking. AST nodes are for parsing. Slotted dictionaries do not provide thread-safe queuing mechanics.'),
q('What happens when a thread calls `lock.acquire()` on a Lock object that is already held by a different thread?', ['It raises a fatal `ThreadConflictError`.', 'It pauses execution indefinitely, blocking at that line until the holding thread calls `.release()`.', 'It terminates the secondary thread instantly.', 'It creates a clone copy of the lock resource.'], 1, 'Acquiring an active lock blocks execution processing on that thread, forcing it to wait until the lock asset is formally released. **Why others are wrong:** It does not raise an error (unless `blocking=False` is used), terminate the thread, or clone the lock.'),
q('What is a "Deadlock" in multi-threaded programming, and how can it be prevented?', ['A thread crashing due to a syntax error; prevented by using `try/except`.', 'Two or more threads permanently blocking each other by waiting for locks held by the others; prevented by enforcing a strict lock acquisition order.', 'A thread consuming too much RAM; prevented by using `__slots__`.', 'The GIL disabling all threads; prevented by using `multiprocessing`.'], 1, 'A deadlock is a permanent freeze caused by circular lock dependencies. Enforcing a strict, global lock acquisition hierarchy prevents threads from waiting on each other in a circle. **Why others are wrong:** It is not a syntax crash, a RAM issue, or a GIL disablement.')
],
[
'Multi-threading scales performance across high-volume network and I/O application contexts.',
'Interrupted execution steps trigger race conditions and state corruption across unprotected variables.',
'Wrap atomic operations within `threading.Lock` contexts to guarantee data modification integrity.',
'Utilize `queue.Queue` components to decouple data pipelines safely across distinct worker threads.',
'Prevent deadlocks by enforcing strict lock acquisition hierarchies across all concurrent threads.'
],
'If you want to use a big terminal, use your CMD. Full guide is in Lesson 1.'
),

// -------------------------------------------------------------------------
// LESSON 20
// -------------------------------------------------------------------------
L(
'pyx-20', 20, 'Abstract Base Classes & Interfaces', '📐',
'Dynamic duck typing is powerful, but enterprise codebases require enforceable structural contracts. While Protocols provide implicit checking at compile-time, Abstract Base Classes (ABCs) provide strict runtime enforcement. Mastering ABCs allows you to design rigid API lifecycles, construct secure plugin frameworks, and control inheritance behavior.',
[
{
title: '1. The Core Purpose of ABCs',
beginner: 'An Abstract Base Class is like a mandatory template for other classes. It lets you say: "Any class inheriting from me MUST write its own version of a `.connect()` method, or the program will refuse to start."',
advanced: 'ABCs utilize the `abc.ABCMeta` metaclass to define interfaces. By marking methods with `@abstractmethod`, you block runtime instantiation of any subclass that has not explicitly overridden those target structures.'
},
{
title: '2. Enforcing Initialization Contracts',
beginner: 'You can use abstract classes to guarantee that every single child class accepts the exact same setup configuration inputs when it is first initialized.',
advanced: 'Applying the `@abstractmethod` decorator to a class\'s `__init__` constructor forces all downstream child classes to implement that signature contract, standardizing dependency injection patterns across your architecture.'
},
{
title: '3. Mixing in Shared Functionality',
beginner: 'Abstract classes aren\'t just empty rules—they can also contain standard helper code that all child classes inherit automatically, giving you the perfect blend of enforcement and code reusability.',
advanced: 'ABCs can mix abstract constraints with concrete logic. Subclasses inherit fully working companion methods while remaining rigidly forced to build out the missing abstract core blocks.'
},
{
title: '4. Virtual Subclassing via `.register()`',
beginner: 'Sometimes you want an external third-party class to count as a child of your abstract template without actually changing its source code. You can register it virtually.',
advanced: 'Calling `MyABC.register(ThirdPartyClass)` performs structural virtual subclassing. The target class passes `issubclass()` and `isinstance()` evaluations cleanly, allowing you to bridge disparate framework patterns gracefully.'
},
{
title: '5. ABCs vs. Protocols (Expert Teaser)',
beginner: 'Protocols check if an object "looks like a duck" (has the right methods) without needing to inherit from anything. ABCs check if the object "is a duck" (explicitly inherited from the Duck class).',
advanced: '*(Pro Track Preview)* ABCs enforce Nominal Subtyping (explicit inheritance), which is great for strict internal architecture but terrible for mocking or integrating third-party libraries. Protocols enforce Structural Subtyping (implicit matching), which is highly flexible but only checked statically by tools like MyPy unless decorated with `@runtime_checkable`. Senior architects use ABCs for core domain models and Protocols for external integrations.'
}
],
{
title: 'Architect a Rigid Custom Plugin Framework',
intro: 'We are going to build an abstract plugin interface that forces all external subclasses to implement strict operational checkpoints before they can execute.',
steps: [
'Open your script development file.',
'Import framework elements: `from abc import ABC, abstractmethod`',
'Define your blueprint structure: `class PluginBase(ABC):`',
'Decorate required methods: \\n `@abstractmethod \\n def initialize(self): pass` \\n `@abstractmethod \\n def execute(self): pass`',
'Attempt to create a breaking subclass: `class BadPlugin(PluginBase): def initialize(self): print("Init")`',
'Try to instantiate your breaking module: `plugin = BadPlugin()`. Watch CPython throw a TypeError at boot time, preventing instantiation because `execute` was forgotten!',
'Create a valid subclass providing both methods, and watch it compile and run flawlessly!'
],
goal: 'You have implemented rigid structural interface controls, establishing strict software contract enforcement frameworks.'
},
[
q('What happens if you attempt to instantiate an Abstract Base Class that contains unfulfilled `@abstractmethod` blocks?', ['It creates an empty instance wrapper.', 'Python throws a `TypeError` at runtime, completely blocking instantiation.', 'It converts the class into a dictionary.', 'It offloads execution to the root thread.'], 1, 'CPython strictly blocks instantiation of classes containing unfulfilled abstract method protocols to guarantee structural safety. **Why others are wrong:** It does not create wrappers, convert to dicts, or offload threads. It raises a hard `TypeError`.'),
q('How do Abstract Base Classes (ABCs) differ fundamentally from typing Protocols?', ['ABCs are evaluated at compile time; Protocols run at execution time.', 'ABCs require explicit nominal inheritance chains, while Protocols evaluate implicit structural matching configurations.', 'ABCs can only contain static variable fields.', 'Protocols disable standard method calls.'], 1, 'ABCs utilize nominal subtyping requiring explicit class declarations (`class MyClass(MyABC)`). Protocols match implicitly based on an object\'s available structural features. **Why others are wrong:** ABCs are runtime enforced, Protocols are primarily static. ABCs can contain methods. Protocols do not disable calls.'),
q('What advanced feature allows a class to satisfy `isinstance()` checks against an ABC without explicitly inheriting from it?', ['The `@runtime_checkable` decorator layout.', 'Invoking the `.register()` method on the target Abstract Base Class.', 'Adding `__slots__` arrays to the object.', 'Running garbage collection passes.'], 1, 'Calling `.register()` on an ABC links the target class virtually, satisfying inheritance verification utilities across modules. **Why others are wrong:** `@runtime_checkable` is for Protocols. `__slots__` is for memory. GC is irrelevant here.'),
q('Can an abstract method definition contain working execution code inside the base class?', ['No, abstract methods must remain entirely empty using `pass`.', 'Yes, abstract methods can contain default fallback logic that child classes can invoke using `super()`.', 'Only if the class is compiled into a C extension.', 'Only when dealing with asynchronous loops.'], 1, 'Abstract methods can contain code blocks. Downstream child overrides can leverage `super().method()` to cleanly combine base logic with custom extensions. **Why others are wrong:** They are not required to be empty, nor restricted to C-extensions or async loops.'),
q('Why might a senior architect choose a `Protocol` over an `ABC` when integrating a third-party payment library?', ['Because Protocols execute 10x faster at runtime.', 'Because Protocols allow the third-party class to be accepted without modifying its source code to inherit from your ABC.', 'Because ABCs cannot be used with external libraries.', 'Because Protocols automatically encrypt the payment data.'], 1, 'Protocols use structural subtyping, meaning the third-party class only needs to possess the required methods (like `.charge()`) to satisfy the type checker, without needing to explicitly inherit from your base class. **Why others are wrong:** Speed is identical. ABCs can be used externally via `.register()`. Protocols do not encrypt data.')
],
[
'Abstract Base Classes enforce explicit structural blueprints across class inheritance paths.',
'Any missing abstract method blocks completely halt subclass instantiation loops.',
'ABCs fuse strict interface enforcement rules with reusable shared concrete helper methods.',
'Use `.register()` workflows to virtually map foreign library modules into systemic type validation trees.',
'Use ABCs for strict internal domain models, and Protocols for flexible external library integrations.'
],
'If you want to use a big terminal, use your CMD. Full guide is in Lesson 1.'
),

// -------------------------------------------------------------------------
// LESSON 21
// -------------------------------------------------------------------------
L(
'pyx-21', 21, 'Weak References & Memory Lifecycles', '🔗',
'While standard references increase an object\'s lifecycle counter, expert-level system caching requires references that do not hold memory captive. By mastering the `weakref` engine, you can construct massive in-memory data pools, manage circular dependencies cleanly, and create automated cache invalidation patterns.',
[
{
title: '1. What is a Weak Reference?',
beginner: 'A standard reference is like a heavy chain keeping an object locked in memory. A weak reference is like a sticky note; it points to the object but lets Python throw it away the exact moment nobody else is using it.',
advanced: 'A weak reference (`weakref.ref`) provides a handle to an object without incrementing its `ob_refcnt`. If all strong references to the underlying object disappear, the object is immediately garbage collected, and the weak reference cleanly evaluates to `None`.'
},
{
title: '2. The `WeakValueDictionary` Protocol',
beginner: 'If you try to build a cache using a standard dictionary, the cache itself will accidentally keep all your items alive forever, leaking memory. A weak dictionary drops keys automatically when they die.',
advanced: '`weakref.WeakValueDictionary` stores values weakly. When the only strong references left pointing to an object reside inside the `WeakValueDictionary`, the object is automatically reclaimed by the runtime, and its key is evacuated from the mapping.'
},
{
title: '3. Dead-Object Callback Triggers',
beginner: 'You can attach a silent alarm to an object that fires a custom cleanup function the absolute millisecond the object is destroyed from memory.',
advanced: 'The `weakref.ref(obj, callback)` constructor accepts an optional second argument: a callable execution handler. This callback fires automatically during object deallocation, enabling clean cross-system tracking and explicit resource teardowns.'
},
{
title: '4. Structural Limitations',
beginner: 'Not every object in Python can handle weak references. Basic types like small integers, short strings, and standard tuples refuse to accept them.',
advanced: 'Objects must possess a `__weakref__` slot pointer to be weakly referenced. Built-in primitives (`int`, `str`, `dict`, `tuple`) omit this structural slot to minimize memory footprints. Custom classes inherit it automatically unless stripped via `__slots__`.'
},
{
title: '5. Weak Methods & `WeakMethod` (Expert Teaser)',
beginner: 'If you try to make a weak reference to a method (like `obj.do_something`), it might disappear unexpectedly because methods are created on the fly. Python provides a special `WeakMethod` tool to handle this safely.',
advanced: '*(Pro Track Preview)* Bound methods are ephemeral; they are created dynamically upon attribute access and discarded immediately. A standard `weakref.ref` to a bound method will often return `None` instantly because the method object itself has no other strong references. `weakref.WeakMethod` solves this by internally storing a weak reference to the instance (`obj`) and a strong reference to the underlying function (`do_something`), reconstructing the bound method safely on demand.'
}
],
{
title: 'Engineer a Self-Cleaning Database Cache',
intro: 'We are going to implement a specialized WeakValueDictionary cache layer that tracks live query results without preventing the garbage collector from managing them.',
steps: [
'Open your script space or interactive REPL.',
'Import tools: `import weakref, gc`',
'Create a model tracking target: `class UserSession: \\n def __init__(self, token): self.token = token`',
'Initialize your weak caching array: `cache = weakref.WeakValueDictionary()`',
'Populate an active item: `session = UserSession("AUTH_777") \\n cache["user_1"] = session`',
'Verify item status in cache: `print(cache["user_1"].token)` — it resolves flawlessly.',
'Destroy the primary reference handle: `del session; gc.collect()`',
'Test cache entry status: Check `len(cache)` or run `"user_1" in cache`. It returns `False`! The cache automatically cleaned itself.'
],
goal: 'You have designed a zero-leak caching container that dynamically adapts to runtime object lifecycles.'
},
[
q('What happens when you invoke a weak reference wrapper (`weak_obj()`) after its target object has been deleted?', ['It blocks execution frames.', 'It returns a `None` value.', 'It raises a fatal ReferenceError.', 'It automatically instantiates a new object template.'], 1, 'Calling a dead weak reference evaluates to `None`, indicating the underlying object no longer exists in memory. **Why others are wrong:** It does not block frames, raise a `ReferenceError` (unless using a `proxy`), or instantiate new objects.'),
q('Why is a standard Python `dict` dangerous to use as a long-lived object cache container?', ['Because it encrypts data packets.', 'Because it holds strong references to items, preventing the garbage collector from reclaiming them and creating memory leaks.', 'Because dictionary lookups drop performance scales.', 'Because standard dictionaries drop keys randomly.'], 1, 'Standard dictionaries hold strong references, ensuring items remain locked in RAM for as long as the dictionary itself exists. **Why others are wrong:** It does not encrypt data, drop performance significantly, or drop keys randomly.'),
q('Which magic slot allocation attribute must exist on an object structure to allow weak references?', ['`__dict__`', '`__weakref__`', '`__slots__`', '`__refcnt__`'], 1, 'The `__weakref__` slot pointer contains the linked list of weak references pointing to that object. **Why others are wrong:** `__dict__` is for attributes. `__slots__` restricts attributes. `__refcnt__` is the strong reference counter.'),
q('Which native Python types reject weak references completely?', ['Custom classes.', 'Basic unslotted structures.', 'Core primitives like `int`, `list`, `str`, and `tuple`.', 'Asynchronous task definitions.'], 2, 'Core built-in types lack the `__weakref__` slot layout to conserve base memory footprints across the CPython virtual machine. **Why others are wrong:** Custom classes support them by default. Async tasks support them.'),
q('Why must you use `weakref.WeakMethod` instead of a standard `weakref.ref` when caching a bound object method?', ['Because standard refs encrypt the method.', 'Because bound methods are ephemeral and discarded immediately after access, causing a standard weak ref to return `None` instantly.', 'Because `WeakMethod` executes the method faster.', 'Because standard refs cannot point to functions.'], 1, 'Bound methods are created on-the-fly and have no strong references of their own. `WeakMethod` bypasses this by weakly referencing the parent instance and strongly referencing the underlying function. **Why others are wrong:** It is not about encryption, speed, or inability to point to functions.')
],
[
'Weak references allow object tracking without incrementing underlying reference counters.',
'`WeakValueDictionary` frameworks drop keys automatically as their primary object counterparts expire.',
'Register callback functions within weak references to handle localized cleanup operations instantly.',
'Custom slotted configurations must explicitly declare `__weakref__` to support weak mapping lookups.',
'Use `WeakMethod` to safely cache bound object methods without triggering premature garbage collection.'
],
'If you want to use a big terminal, use your CMD. Full guide is in Lesson 1.'
),

// -------------------------------------------------------------------------
// LESSON 22
// -------------------------------------------------------------------------
L(
'pyx-22', 22, 'Custom Iterators & Generator Pipelines', '⚙️',
'Iterators are the computational workhorses behind Python loops. Beyond standard lists, senior engineers build customized memory-efficient iteration engines, leverage advanced generator manipulation tools (`send`, `throw`, `close`), and orchestrate multi-stage data streaming pipelines.',
[
{
title: '1. The Iteration Engine Protocol',
beginner: 'Loops look simple, but under the hood, Python calls a secret engine that grabs elements one-by-one until the container yells: "Stop, I am out of items!"',
advanced: 'The protocol requires two steps: `__iter__()` returning an object implementing `__next__()`. When data runs dry, `__next__` must explicitly raise a `StopIteration` exception, which the CPython loop interprets as a clean exit signal.'
},
{
title: '2. Bidirectional Generators via `.send()`',
beginner: 'Generators don\'t just spit data out using `yield`. You can actually pass values back *into* a generator mid-execution, changing its calculations on the fly.',
advanced: 'The `yield` keyword acts as an expression. Executing `value = yield output` pauses execution. When external scopes invoke `gen.send(new_data)`, that data replaces the yield expression and resumes generator execution.'
},
{
title: '3. Lifecycle Controls: `throw()` & `close()`',
beginner: 'You have complete remote control over a running generator. You can force an exception to explode inside its loop, or cleanly kill it whenever you want.',
advanced: 'Calling `gen.throw(Exception)` raises that exception at the generator\'s current `yield` suspension line. Calling `gen.close()` raises a `GeneratorExit` exception internally, forcing clean stack winding and execution termination.'
},
{
title: '4. Stream Processing Pipelines',
beginner: 'If you have a 50GB file, you cannot load it all into memory. You pass it through a chain of generators that process one line at a time, keeping RAM usage close to zero.',
advanced: 'Generator composition passes lazy iterator streams through successive filter modifications. Since rows are computed on-demand, you achieve linear memory layouts ($O(1)$ space complexity) regardless of dataset sizes.'
},
{
title: '5. `yield from` as a Coroutine Bridge (Expert Teaser)',
beginner: 'When you nest generators, `yield from` acts like a transparent tunnel. It passes all the `.send()` and `.throw()` signals straight through to the deepest generator without you writing any extra loops.',
advanced: '*(Pro Track Preview)* Before `async/await` existed, Python developers built complex asynchronous state machines using `yield from` to delegate execution to sub-generators. `yield from` doesn\'t just iterate; it establishes a bidirectional communication channel, forwarding `send()`, `throw()`, and `close()` signals directly to the sub-generator, and capturing its final `return` value as the expression result. This is the exact mechanical foundation of `asyncio`.'
}
],
{
title: 'Architect an Interactive Data Modifier',
intro: 'We are going to write a bidirectional data pipeline that streams data chunks and allows structural modification inputs mid-stream via the `.send()` protocol.',
steps: [
'Open a fresh script file.',
'Define a stateful generator: `def pricing_stream(): \\n discount = 0.0 \\n while True: \\n base_price = 100 \\n mod = yield base_price * (1.0 - discount) \\n if mod is not None: discount = mod`',
'Instantiate your processor: `stream = pricing_stream()`',
'Prime the generator to the first yield line: `print(next(stream))` — returns `100.0`.',
'Advance normally: `print(stream.send(None))` — returns `100.0` again.',
'Inject a runtime parameter adjustment: `print(stream.send(0.20))` — returns `80.0`!',
'Terminate the pipeline cleanly: `stream.close()`'
],
goal: 'You have engineered an interactive, multi-directional runtime generator state machine.'
},
[
q('Which exception must be raised by the `__next__` method to signal an intentional loop termination?', ['`IndexError`', '`StopIteration`', '`EOFError`', '`GeneratorExit`'], 1, 'The `StopIteration` exception is the standard protocol indicator used to wind down iteration loops cleanly. **Why others are wrong:** `IndexError` is for lists. `EOFError` is for input streams. `GeneratorExit` is for forced closure via `.close()`.'),
q('What action must occur before you can pass a meaningful data argument to a generator using `.send(value)`?', ['The generator must be closed.', 'The generator must be "primed" by executing `next(generator)` or `generator.send(None)` to advance it to its first internal `yield` expression.', 'The generator must be compiled.', 'The garbage collector must be flushed.'], 1, 'A newly instantiated generator is unprimed and has no active yield statement waiting for input. It must be advanced to the first yield line first. **Why others are wrong:** Closing it kills it. Compilation happens at definition. GC is irrelevant.'),
q('What exception does calling `generator.close()` trigger inside the suspended framework frame?', ['`RuntimeError`', '`GeneratorExit`', '`SystemExit`', '`StopIteration`'], 1, '`GeneratorExit` is raised inside the block, allowing optional `finally` containment execution blocks to run before termination. **Why others are wrong:** It is specifically `GeneratorExit`, not a generic runtime error, system exit, or standard stop iteration.'),
q('What is the spatial memory complexity ($O$) when processing infinite rows via chained generator pipelines?', ['Overlapping exponential scaling ($O(N^2)$)', 'Linear data tracking ($O(N)$)', 'Constant resource layout ($O(1)$)', 'Logarithmic decay curves'], 2, 'Because generators yield items lazily one at a time, the resident structural RAM footprint remains entirely constant ($O(1)$). **Why others are wrong:** It does not scale with N because data is not stored in memory.'),
q('What does `yield from sub_generator()` actually return when the sub-generator finishes execution?', ['It returns `None` always.', 'It returns the final value passed to the sub-generator\'s `return` statement.', 'It raises a `StopIteration` error to the caller.', 'It returns a list of all yielded items.'], 1, '`yield from` captures the sub-generator\'s `return` value and uses it as the result of the `yield from` expression in the parent generator. **Why others are wrong:** It does not return None (unless the sub-generator returns None), it does not leak the StopIteration to the caller, and it does not aggregate items into a list.')
],
[
'The Iterator Protocol requires custom implementations of `__iter__` and `__next__`.',
'The `yield` keyword acts as a bidirectional path, receiving values via `.send()` actions.',
'Control active loops remotely utilizing the `.throw()` and `.close()` generator controls.',
'Chain multiple lazy iterators together to process massive files within constant memory spaces.',
'`yield from` establishes a bidirectional coroutine bridge, capturing sub-generator return values.'
],
'If you want to use a big terminal, use your CMD. Full guide is in Lesson 1.'
),

// -------------------------------------------------------------------------
// LESSON 23
// -------------------------------------------------------------------------
L(
'pyx-23', 23, 'Dynamic Import Hooks & Metaprogramming', '📦',
'Python\'s import system is incredibly modular. Beyond typical `import sys` declarations, senior systems developers can intercept package loading pipelines, compile virtual modules out of network or JSON data, and configure custom code compilation filters.',
[
{
title: '1. The Import Lifecycle Engine',
beginner: 'When you type `import my_code`, Python doesn\'t just grab a file. It searches a specific array of locations, verifies system caches, and dynamically manufactures a module object.',
advanced: 'The import machinery checks `sys.modules` cache first. If missed, it queries finders listed in `sys.meta_path`. These finders return a module spec object, which a loader interprets to execute code and populate the module namespace.'
},
{
title: '2. Intercepting with Meta Finders',
beginner: 'You can build a custom security shield that watches every single import attempt and blocks unauthorized modules from loading into your app.',
advanced: 'A custom finder implements `find_spec(fullname, path, target)`. By registering this finder into `sys.meta_path`, you can inspect import paths at boot-time, intercept modules, or inject dynamic encryption authorization checks.'
},
{
title: '3. Virtual Module Synthesis',
beginner: 'You can write an application that imports code that doesn\'t even exist on disk. It can pull text files from a remote URL or a database and turn them into modules at runtime.',
advanced: 'By pairing a custom finder with an `importlib.machinery.ModuleSpec` loader, you can dynamically create a module object via `types.ModuleType`, inject raw code strings into its `__dict__`, and bypass disk I/O entirely.'
},
{
title: '4. Absolute Cache Control',
beginner: 'If you modify a Python file while a program is running, retyping `import` won\'t reload it because Python caches everything. You must wipe the cache to see updates.',
advanced: 'Wiping an entry from `sys.modules` forces CPython to repeat the entire `sys.meta_path` lookup pipeline upon the next import call, which enables hot-reloading configurations in production servers.'
},
{
title: '5. Namespace Packages & PEP 420 (Expert Teaser)',
beginner: 'Normally, a folder needs an `__init__.py` file to be recognized as a Python package. Modern Python allows "Namespace Packages"—folders without `__init__.py` that can be split across multiple different directories on your hard drive!',
advanced: '*(Pro Track Preview)* PEP 420 introduced Implicit Namespace Packages. If a finder exhausts `sys.meta_path` without finding a standard package, it falls back to a `PathFinder` that aggregates all matching directory paths across `sys.path` into a single virtual namespace. This allows massive enterprise libraries (like `google.cloud`) to be distributed across dozens of independent pip packages that merge seamlessly at runtime without conflicting `__init__.py` files.'
}
],
{
title: 'Build a Virtual JSON Module Loader',
intro: 'We are going to construct a meta import hook that allows your program to import raw data variables straight out of structural JSON strings as if they were standard python module files.',
steps: [
'Open a fresh python script file.',
'Import internal core elements: `import sys, types; from importlib.machinery import ModuleSpec`',
'Create a virtual loader class: `class JSONImporter: \\n def find_spec(self, name, path, target=None): \\n if name == "virtual_config": return ModuleSpec(name, self) \\n return None \\n def exec_module(self, module): \\n module.api_key = "SECURE_KEY_123"; module.timeout = 30`',
'Register your engine into the system path: `sys.meta_path.insert(0, JSONImporter())`',
'Execute the dynamic import: `import virtual_config`',
'Verify your imported synthetic variables: `print(virtual_config.api_key)` — outputs your key dynamically!'
],
goal: 'You have mastered CPython\'s import pipeline, constructing a virtual module factory completely decoupled from disk storage.'
},
[
q('Which system cache array does Python check first before initiating a full search for an imported package?', ['`sys.path`', '`sys.modules`', '`sys.meta_path`', '`os.environ`'], 1, '`sys.modules` maintains the cache list of all previously loaded modules, optimizing lookup speeds. **Why others are wrong:** `sys.path` is for directory locations. `sys.meta_path` is for finders. `os.environ` is for environment variables.'),
q('What list must you modify to hook a customized package-finding engine into the global import lifecycle?', ['`sys.path`', '`sys.meta_path`', '`importlib.loaders`', '`sys.plugins`'], 1, 'Inserting an object into `sys.meta_path` allows your custom hook to intercept and process all module resolution loops. **Why others are wrong:** `sys.path` is for directories. The others are not standard import hook lists.'),
q('What type object must a loader create to initialize a brand-new runtime module workspace container?', ['`types.ModuleType`', '`dict`', '`importlib.VirtualObject`', '`sys.FrameType`'], 0, '`types.ModuleType` instantiates the raw, standard runtime namespace block for modules. **Why others are wrong:** `dict` is just a dictionary. The others are not standard module containers.'),
q('What happens if you clear a module key from the `sys.modules` reference mapping and call `import` on that target again?', ['Python crashes with an ImportError.', 'Python performs a full search via `sys.meta_path`, effectively reloading the module fresh from its source or loader.', 'The variable is permanently locked.', 'It reads from local disk memory without validation.'], 1, 'Removing keys from `sys.modules` invalidates the import cache, forcing the subsystem to re-evaluate the module lookups. **Why others are wrong:** It does not crash, lock variables, or skip validation.'),
q('What is the primary advantage of Implicit Namespace Packages (PEP 420)?', ['They execute 10x faster than standard packages.', 'They allow a single logical package to be split across multiple disjoint directories on disk without requiring `__init__.py` files.', 'They automatically encrypt the package source code.', 'They prevent the package from being imported by external scripts.'], 1, 'Namespace packages aggregate paths from multiple locations, allowing massive libraries to be distributed as separate pip packages that merge seamlessly at runtime. **Why others are wrong:** Speed is identical. They do not encrypt or restrict imports.')
],
[
'The import pipeline resolves lookups by coordinating cache systems, finders, and loader classes.',
'Inject objects into `sys.meta_path` to build secure, custom import interception layers.',
'Virtual modules can be dynamically compiled out of text, dictionaries, or databases at runtime.',
'Manipulate `sys.modules` entries to trigger deep runtime code reloading behaviors.',
'Implicit Namespace Packages allow disjoint directories to merge into a single logical module.'
],
'If you want to use a big terminal, use your CMD. Full guide is in Lesson 1.'
),

// -------------------------------------------------------------------------
// LESSON 24
// -------------------------------------------------------------------------
L(
'pyx-24', 24, 'Frame Introspection & Call Stack Control', '🧱',
'Python code executes within runtime evaluation environments called frames. Gaining command over frame introspection unlocks high-level library capabilities, allowing you to walk the execution stack, extract local variables from outer scopes, and write advanced validation engines.',
[
{
title: '1. The Runtime Frame Layout',
beginner: 'Every time a function gets called, Python creates an isolated tracking box called a frame that stores that specific function\'s local variables and line progress.',
advanced: 'Frames are represented as `types.FrameType` objects in CPython. They form a linked list stack via `f_back` pointers. A frame maintains references to its bytecode execution block (`f_code`), local namespace (`f_locals`), and global tracking dictionary (`f_globals`).'
},
{
title: '2. Stack Crawling via `sys._getframe`',
beginner: 'A function can peek backward through time to see exactly which function called it, inspecting variables outside its own local boundaries.',
advanced: 'Invoking `sys._getframe(1)` fetches the immediate parent execution frame. Developers can crawl backwards down the active runtime call stack by chaining `.f_back` properties, allowing for structural runtime tracing.'
},
{
title: '3. Dynamic Frame Local Modification',
beginner: 'Reading frame variables is safe, but trying to inject new variables or overwrite strings inside a parent function\'s locals can lead to highly erratic, unpredictable behavior.',
advanced: 'CPython optimizes function access by mapping local names straight to array slots (fast locals) at compile-time. While `frame.f_locals` exposes this map as a dict, writing directly to it won\'t reliably update the underlying array without invoking `ctypes.pythonapi.PyFrame_LocalsToFast`.'
},
{
title: '4. Trace Injection Mechanics',
beginner: 'You can inject a custom tracking function that hooks into Python\'s core engine, firing code automatically on every single line change or function return across your entire program.',
advanced: '`sys.settrace(callback)` configures global interpreter line tracing. The registered handler intercepts every execution frame event (`call`, `line`, `return`, `exception`), providing the blueprint for advanced debuggers and coverage tools.'
},
{
title: '5. The Danger of `sys._getframe` in Production (Expert Teaser)',
beginner: 'Peeking into parent frames is a cool trick for debugging, but doing it in a live production server can cause massive slowdowns and break optimizations.',
advanced: '*(Pro Track Preview)* Accessing `sys._getframe()` forces CPython to materialize the full frame object and its `f_locals` dictionary, which bypasses the highly optimized "fast locals" array slots. Furthermore, holding references to frames (e.g., storing them in a list for later inspection) prevents the garbage collector from freeing the entire call stack above it, leading to severe memory leaks. Production frameworks like FastAPI strictly avoid frame introspection in hot paths.'
}
],
{
title: 'Build a Parent Scope Variable Inspector',
intro: 'We are going to construct an introspection utility that bypasses functional argument boundaries, digging backwards into the call stack to read the local variables of its caller.',
steps: [
'Open a fresh script file.',
'Import core utilities: `import sys`',
'Define your inspector function: `def reveal_caller_locals(): \\n caller_frame = sys._getframe(1) \\n print("Caller variables discovered:", caller_frame.f_locals)`',
'Create a parent executor function: `def orchestrate_logic(): \\n secret_token = "ADMIN_PASS_99" \\n user_id = 42 \\n reveal_caller_locals()`',
'Execute the wrapper call: `orchestrate_logic()`',
'Observe your output panel: The nested function successfully crawled backwards and printed variables out of the parent execution frame!'
],
goal: 'You have breached standard functional boundaries, leveraging runtime introspection to trace call stack data scopes.'
},
[
q('Which reference pointer allows a frame object to access the execution frame directly below it on the call stack?', ['`f_down`', '`f_back`', '`f_parent`', '`f_link`'], 1, 'The `f_back` property targets the preceding execution frame object, mapping out the linked stack structure. **Why others are wrong:** The standard attribute is specifically named `f_back`.'),
q('Why is writing updates directly to a frame\'s `f_locals` dictionary unreliable for modifying function execution state?', ['Because `f_locals` deletes data arrays instantly.', 'Because CPython optimizes local access via compiled static array indices ("fast locals") rather than dynamic dictionary lookups.', 'Because frames are encrypted.', 'Because it triggers garbage collection failures.'], 1, 'CPython uses array slot optimization for local variable tracking; modifying the exposed dictionary layout doesn\'t sync automatically back to the optimized fast slots without lower-level CAPI synchronization calls. **Why others are wrong:** It does not delete arrays, frames are not encrypted, and it does not trigger GC failures.'),
q('Which standard method hooks a callback function directly into the interpreter engine to watch line changes globally?', ['`sys.settrace()`', '`sys.watch_lines()`', '`os.profile()`', '`gc.set_hook()`'], 0, '`sys.settrace()` registers deterministic trace functions to intercept all lines, updates, and function calls at runtime. **Why others are wrong:** The standard method is specifically `sys.settrace()`.'),
q('What variable inside a frame object exposes the compiled bytecode identifier metadata?', ['`f_bytecode`', '`f_code`', '`f_binary`', '`f_asm`'], 1, 'The `f_code` reference points to the underlying `PyCodeObject` structure containing the function\'s bytecode instructions. **Why others are wrong:** The standard attribute is specifically named `f_code`.'),
q('Why is holding a long-lived reference to a frame object (e.g., appending it to a global list) dangerous in a production application?', ['Because it encrypts the frame data.', 'Because it prevents the garbage collector from freeing the entire call stack above it, causing severe memory leaks.', 'Because it disables the GIL permanently.', 'Because it converts the frame into a C-extension.'], 1, 'Frames hold strong references to their parent frames via `f_back`. Keeping one frame alive keeps the entire chain of parent frames and their local variables alive in memory. **Why others are wrong:** It does not encrypt, disable the GIL, or convert to C-extensions.')
],
[
'Frames manage execution states, tracing data variables across local and global scopes.',
'Utilize `sys._getframe()` to crawl up and down active application stack layers.',
'Modifying local variables via frame dictionaries requires low-level CAPI fast-slot sync steps.',
'`sys.settrace` drives testing tools and profilers by intercepting frame lifecycle state events.',
'Avoid holding long-lived frame references in production to prevent catastrophic call-stack memory leaks.'
],
'If you want to use a big terminal, use your CMD. Full guide is in Lesson 1.'
),

  // -------------------------------------------------------------------------
// LESSON 25
// -------------------------------------------------------------------------
L(
'pyx-25', 25, 'Binary Packing & Memory Buffer Safety', '📦',
'Low-level system networking, binary files, and hardware interfaces communicate via raw byte strings. Moving past basic text encodings, senior engineers must master dense binary data serialization, strict C-style structure configurations, and safe memory array manipulation.',
[
{
title: '1. The `struct` Serialization Protocol',
beginner: 'Computers don\'t send Python objects across networks; they send raw streams of zeros and ones. The `struct` tool lets you convert values like numbers into exact binary formats.',
advanced: 'The `struct` module maps Python primitives straight to C-language structural byte layouts. Using compact character format strings (e.g., `>I2h`), it packs elements into predictable binary buffers matching exact endianness alignments.'
},
{
title: '2. Buffer Formatting Tokens',
beginner: 'When packing binary data, you must use shorthand formatting codes. For example, a capital "I" represents a large positive integer, while a lowercase "h" denotes a small short number.',
advanced: 'Format sequences define data structures precisely: `i` denotes a 4-byte integer, `h` represents a 2-byte short, and `f` targets standard floats. Prefix tokens like `>` enforce big-endian network byte ordering, while `<` enforces little-endian formats.'
},
{
title: '3. In-Place Modifications with `pack_into`',
beginner: 'If you are managing high-volume data streams, creating new byte strings over and over will kill your performance. You should write changes straight into a reusable, mutable memory buffer.',
advanced: '`struct.pack_into(fmt, buffer, offset, *v)` writes binary bytes straight into pre-allocated mutable arrays like `bytearray`. This prevents garbage collection thrashing and avoids costly reallocations during high-frequency network exchanges.'
},
{
title: '4. Binary Splitting Safeguards',
beginner: 'If you try to unpack a chunk of bytes using the wrong format or size rule, Python blocks your code to prevent raw memory corruption errors.',
advanced: 'The `struct` engine strictly calculates expected byte sizes via `struct.calcsize(fmt)`. If an incoming byte stream\'s total weight fails to align with this formula, it raises a `struct.error`, protecting the execution context from buffer-underflow anomalies.'
},
{
title: '5. The `memoryview` Zero-Copy Engine (Expert Teaser)',
beginner: 'If you have a massive 1GB video file in memory and want to slice out a 10MB chunk, standard Python copies all 10MB into a new variable. `memoryview` lets you look at that slice without copying a single byte!',
advanced: '*(Pro Track Preview)* `memoryview` exposes the C-level buffer protocol. When you slice a `memoryview`, it returns a new view object pointing to the original memory address with modified offsets and strides. This allows for zero-copy binary data manipulation, crucial for high-performance image processing and cryptography.'
}
],
{
title: 'Architect a Binary Network Header Parser',
intro: 'We are going to construct a binary communication packet parser that packs structured integer and version flags into raw big-endian network byte chunks, then unpacks them safely.',
steps: [
'Open your script space or REPL environment.',
'Import your binary engine: `import struct`.',
'Define a packet layout format string: `fmt = ">IHH"` (Big-endian: 4-byte Transaction ID, 2-byte Status Code, 2-byte Protocol Version).',
'Pack data values into a raw byte stream: `packet = struct.pack(fmt, 98765, 200, 3)`.',
'Inspect the raw byte length: `print(len(packet))` — outputs exactly 8 packed bytes.',
'Print the raw byte visual layout: `print(packet)` — displays condensed escaped notation format.',
'Unpack the stream back to variables: `tx_id, status, ver = struct.unpack(fmt, packet)`.',
'Verify your unpacked variables: `print(tx_id, status, ver)` — returns `98765 200 3` perfectly!'
],
goal: 'You have bypassed string constraints, engineering high-speed binary protocol representations natively.'
},
[
q('What format prefix character must be passed to enforce strict Big-Endian network byte-ordering during struct pack operations?', ['`<`', '`>`', '`!`', '`@`'], 1, 'The `>` token forces big-endian formatting, standardizing byte arrays for cross-platform network safety. **Why others are wrong:** `<` is little-endian. `!` is network (which is big-endian, but `>` is the explicit standard). `@` is native.'),
q('How does `struct.pack_into` optimize performance compared to standard `struct.pack`?', ['It compiles scripts directly into machine instructions.', 'It writes data straight into an existing mutable memory buffer, avoiding fresh allocations and reducing garbage collection overhead.', 'It parallelizes calculations across separate process threads.', 'It compresses byte streams into ZIP file formats.'], 1, '`pack_into` mutates an allocated memory slice in-place, eliminating allocation steps and memory overhead entirely. **Why others are wrong:** It does not compile to machine code, parallelize threads, or compress to ZIP.'),
q('Which utility function precisely measures the expected byte length of a given format string configuration ahead of execution?', ['`len()`', '`sys.getsizeof()`', '`struct.calcsize()`', '`os.buffer_weight()`'], 2, '`struct.calcsize()` parses structural layout tokens, computing the target byte count required to safely map data arrays. **Why others are wrong:** `len()` measures sequence length. `sys.getsizeof()` measures Python object overhead. `os.buffer_weight()` does not exist.'),
q('What exception fires if you provide a 6-byte stream to a struct unpack configuration that requires exactly 8 bytes?', ['`ValueError`', '`struct.error`', '`BufferError`', '`IndexError`'], 1, 'The `struct.error` exception is raised when incoming payload sizes do not align with specified format layout expectations. **Why others are wrong:** It is specifically `struct.error`, not a generic ValueError, BufferError, or IndexError.'),
q('Why is `memoryview` critical for high-performance binary data manipulation?', ['It encrypts the data automatically.', 'It allows zero-copy slicing of large byte arrays, preventing massive memory duplication overhead.', 'It converts bytes to strings faster.', 'It bypasses the GIL completely.'], 1, '`memoryview` exposes the C-level buffer protocol, allowing you to slice and manipulate large binary data without copying the underlying bytes, saving massive amounts of RAM and CPU time. **Why others are wrong:** It does not encrypt, convert to strings, or bypass the GIL.')
],
[
'The `struct` framework serializes native Python variables straight into raw C-struct byte arrays.',
'Endianness characters (`>` or `<`) standardize multi-byte word interpretations across different operating systems.',
'Leverage `pack_into` setups to update pre-allocated data blocks in-place without instantiation cycles.',
'Utilize `struct.calcsize` to compute structural byte footprint dimensions dynamically before reading streams.',
'Use `memoryview` for zero-copy slicing of massive binary payloads to prevent memory duplication.'
],
'If you want to use a big terminal, use your CMD. Full guide is in Lesson 1.'
),

// -------------------------------------------------------------------------
// LESSON 26
// -------------------------------------------------------------------------
L(
'pyx-26', 26, 'Framework Typing & Generic Poly-Architecture', '📐',
'Enterprise-grade codebases rely heavily on strict typing interfaces to catch bugs at compile-time. Moving beyond standard annotations like `list[str]`, senior python software architects build abstract type structures, use generics, and capture complex decorator signatures with type variables.',
[
{
title: '1. Type Variables (`TypeVar`)',
beginner: 'If you want a function that can accept an integer and return an integer, OR accept a string and return a string, you use a Type Variable to link the input type directly to the output type.',
advanced: '`typing.TypeVar` enables true parametric polymorphism. It establishes a generic relationship across parameters. Static type checkers (like `mypy`) use it to bind types across function invocation frames dynamically.'
},
{
title: '2. Generic Blueprint Interfaces',
beginner: 'You can design a master class template—like a Repository or Cache wrapper—that doesn\'t care what kind of data it holds until you initialize it (e.g., `Repository[User]`).',
advanced: 'By inheriting from `typing.Generic[T]`, a class becomes structurally generic. Static verification engines can track internal variable types throughout data management lifecycles based on the class\'s type parameterization.'
},
{
title: '3. Decorator Signature Capture (`ParamSpec`)',
beginner: 'When you build a decorator, it can easily mess up autocomplete and type checks for the function it wraps. `ParamSpec` acts like a copy-paste tool that preserves all parameter type details perfectly.',
advanced: 'Introduced in Python 3.10, `typing.ParamSpec` captures the complete variable argument signatures (`*args, **kwargs`) of callables. It links decorated function inputs straight to final wrapper definitions, preserving autocompletion trees.'
},
{
title: '4. Runtime Type Guarding (`TypeGuard`)',
beginner: 'You can write a custom validation function that handles messy runtime objects, confirming to the static type checker that the item is definitely safe to use as a specific class.',
advanced: '`typing.TypeGuard[TargetType]` tells static type checkers that returning `True` guarantees an object conforms to `TargetType`. This allows conditional blocks to narrow vague type descriptions down to strict, specialized classes safely.'
},
{
title: '5. Variance in Generics (Expert Teaser)',
beginner: 'If a function expects a "Box of Animals", can you safely give it a "Box of Cats"? Sometimes yes, sometimes no! Variance rules tell the type checker when it\'s safe to swap subtypes.',
advanced: '*(Pro Track Preview)* Generics can be Covariant (accepting subtypes, like `Iterable[Cat]` for `Iterable[Animal]`), Contravariant (accepting supertypes, like `Callable[[Animal], None]` for `Callable[[Cat], None]`), or Invariant (strict match required, like `List[Cat]` vs `List[Animal]`). Understanding variance prevents subtle type-safety holes in complex architectures.'
}
],
{
title: 'Architect a Strict Generic Container Stack',
intro: 'We are going to build a parameterized generic data array box that enforces consistent internal object type compliance throughout pushing and popping cycles.',
steps: [
'Open a fresh script workspace.',
'Import typing elements: `from typing import TypeVar, Generic, List`.',
'Define a custom bound parameter placeholder: `T = TypeVar("T")`.',
'Create your generic structure: `class Registry(Generic[T]):` \\n `def __init__(self) -> None: self._storage: List[T] = []` \\n `def register(self, item: T) -> None: self._storage.append(item)` \\n `def retrieve(self) -> T: return self._storage.pop()`.',
'Instantiate a typed variant: `str_registry = Registry[str]()`.',
'Test compliance: `str_registry.register("SYSTEM_ACTIVE")`.',
'Verify signature layouts: Look at how your editor autocomplete knows `retrieve()` will output a strict `str` primitive object!'
],
goal: 'You have implemented type parameterization, enabling static compilers to validate your container layouts perfectly.'
},
[
q('What capability does the `ParamSpec` object introduce to advanced Python decorator development?', ['It speeds up runtime loop execution frames.', 'It captures and forwards the exact input parameter type signatures of callables, preventing decorators from breaking autocomplete rules.', 'It compiles functions into binary C structures.', 'It overrides class method resolution orders.'], 1, '`ParamSpec` lets type engines capture and replicate complex input argument signatures across decorator wrappers seamlessly. **Why others are wrong:** It does not affect runtime speed, compile to C, or alter MRO.'),
q('What structural type narrowing signal does a function return when annotated with `TypeGuard[User]`?', ['It returns an initialized instance of the User class object.', 'It returns a boolean value, and tells type engines that a `True` result validates the targeted object matches the User type contract.', 'It triggers a compilation error if inputs are invalid.', 'It returns a dictionary array of parameters.'], 1, '`TypeGuard` tells static type checkers that a truthy response guarantees structural compatibility with the designated target type contract. **Why others are wrong:** It returns a bool, not an instance, error, or dict.'),
q('How do you define a class as an open generic template capable of tracking variable internal types?', ['By decorating it with `@runtime_checkable`.', 'By inheriting directly from `typing.Generic[T]`.', 'By using the `__slots__` variable structure.', 'By defining all internal methods as lambdas.'], 1, 'Inheriting from `typing.Generic` declares the class as an open template that tracks parameter types across internal operations. **Why others are wrong:** `@runtime_checkable` is for Protocols. `__slots__` is for memory. Lambdas are irrelevant.'),
q('What happens during standard Python runtime execution if a generic type parameter boundary is violated (e.g., passing an int to `Registry[str]()`)?', ['The script throws a TypeError immediately.', 'The Python interpreter completely ignores type annotations at runtime, so execution proceeds normally unless explicit code checks are violated.', 'The object is corrupted in RAM.', 'The garbage collector freezes operations.'], 1, 'Python type hints are inherently metadata annotations for external analysis tools. The core interpreter does not enforce type compliance at runtime. **Why others are wrong:** It does not throw TypeError, corrupt RAM, or freeze GC.'),
q('If a generic class is defined as Invariant (the default for `List[T]`), what does it mean?', ['You can pass a `List[Cat]` where a `List[Animal]` is expected.', 'You must pass the exact type specified; subtypes and supertypes are rejected by the type checker.', 'It accepts any type at all.', 'It only works with integers.'], 1, 'Invariant generics require an exact type match. A `List[Cat]` is not considered a subtype of `List[Animal]` because modifying the list could violate type safety. **Why others are wrong:** It does not accept subtypes (that\'s covariant), any type, or just integers.')
],
[
'`TypeVar` constructs flexible polymorphic relationships across input and output data parameters.',
'Subclass `Generic[T]` to build data management structures that enforce class-level parameter safety.',
'Utilize `ParamSpec` inside decorators to preserve autocomplete and typing trees for wrapped functions.',
'Implement `TypeGuard` interfaces to safely narrow generic references down to specific object definitions.',
'Understand Variance (Covariant, Contravariant, Invariant) to prevent subtle type-safety holes in complex generics.'
],
'If you want to use a big terminal, use your CMD. Full guide is in Lesson 1.'
),

// -------------------------------------------------------------------------
// LESSON 27
// -------------------------------------------------------------------------
L(
'pyx-27', 27, 'Dynamic Code Synthesis & Restricted Execution', '🧬',
'Advanced frameworks often require runtime generation of executable logic. By mastering dynamic string compilation, abstract bytecode generation, and restricted global environments, you can synthesize high-speed logic factories and protect systems from malicious code injection.',
[
{
title: '1. The Dynamic Runtime Engine',
beginner: 'Python allows you to write a string of code inside a text block and command the computer to compile and run it as an active script mid-execution.',
advanced: 'The built-in `compile(source, filename, mode)` parses raw source text into executable CPython code objects (`PyCodeObject`). These compiled blocks can be fed directly into `exec()` or `eval()` loops, bypassing repetitive string-parsing steps.'
},
{
title: '2. Isolating Scopes via Namespaces',
beginner: 'When executing text code dynamically, you must wrap it in an isolated dictionary sandbox. Otherwise, it could accidentally overwrite variables in your main program.',
advanced: 'Both `exec()` and `eval()` accept explicit global and local dictionary contexts: `exec(code_obj, globals_dict, locals_dict)`. Isolating these spaces protects your active workspace from getting corrupted by dynamic assignments.'
},
{
title: '3. Sandbox Hazards & Escape Paths',
beginner: 'Simply wiping out the standard `__builtins__` list is not enough to secure a sandbox. Clever hackers can crawl up system class trees to import the `os` module and wipe files.',
advanced: 'Even if `__builtins__` is restricted, dynamic expressions can explore object graphs via attributes like `__class__.__base__.__subclasses__()`. True sandbox isolation requires parsing syntax trees with tools like `ast` before compilation.'
},
{
title: '4. Performance Tuning via Bytecode Optimization',
beginner: 'Never pass raw strings directly into a loop running `exec()`. Always compile the string once outside the loop to keep things running at peak performance.',
advanced: 'Parsing text strings is highly CPU-intensive. Pre-compiling code via `compile(string, "", "exec")` generates static bytecode. Running this pre-compiled block inside loops minimizes execution latency.'
},
{
title: '5. AST Node Transformation (Expert Teaser)',
beginner: 'Instead of just blocking bad code, you can actually rewrite code on the fly! You can take a string of Python, change every `+` to a `-`, and then run the modified version.',
advanced: '*(Pro Track Preview)* By inheriting from `ast.NodeTransformer`, you can intercept the Abstract Syntax Tree generation process. You can programmatically inject logging, modify control flow, or strip out dangerous function calls before the code is ever compiled to bytecode, enabling highly sophisticated metaprogramming.'
}
],
{
title: 'Architect a Dynamic Calculation Factory',
intro: 'We are going to pre-compile an algebraic text formula into an optimized bytecode routine, running it inside a clean namespace sandbox.',
steps: [
'Open your script space or interactive REPL panels.',
'Define a dynamic code formula string: `formula = "result = (x * 10) + y"`.',
'Pre-compile the string into standard execution bytecode: `code_obj = compile(formula, "<string>", "exec")`.',
'Create an isolated sandbox global namespace dict: `sandbox_globals = {"__builtins__": None}`.',
'Establish unique data point states: `scope_one = {"x": 5, "y": 2}; scope_two = {"x": 10, "y": 5}`.',
'Execute using your pre-compiled object block: `exec(code_obj, sandbox_globals, scope_one)`.',
'Execute across the secondary scope: `exec(code_obj, sandbox_globals, scope_two)`.',
'Extract metrics safely: `print(scope_one["result"], scope_two["result"])` — returns `52 105` perfectly!'
],
goal: 'You have engineered an un-aliased, high-speed dynamic formula execution sandbox engine.'
},
[
q('Which core function translates raw code text strings into highly optimized CPython bytecode objects?', ['`eval()`', '`exec()`', '`compile()`', '`ast.transpile()`'], 2, '`compile()` transforms character strings into optimized bytecode blocks, ready for efficient execution loops. **Why others are wrong:** `eval()` and `exec()` run the code, they don\'t compile it. `ast.transpile()` does not exist.'),
q('What dangerous loophole allows malicious strings to escape sandboxes that only clear out standard built-in libraries?', ['Dynamic list comprehension loops.', 'Objects can crawl inheritance attributes using fields like `__class__.__base__.__subclasses__()` to find and reactivate core system tools.', 'Garbage collection cycle dumps.', 'Unslotted class parameters.'], 1, 'Every object links back to its parent type definition. Malicious actors can traverse subclass arrays to recover references to powerful system modules if left unchecked. **Why others are wrong:** List comprehensions, GC, and slots are not the primary escape vectors for this specific sandbox bypass.'),
q('Why should you use pre-compiled code objects instead of executing raw strings directly inside high-frequency evaluation loops?', ['Because strings leak memory arrays.', 'Because strings bypass the Global Interpreter Lock.', 'Because parsing a raw text string requires intensive compilation overhead every time, whereas code objects skip straight to runtime execution blocks.', 'Because code objects encrypt strings.'], 2, 'Pre-compiling code text once outside loops eliminates repetitive lexical parsing and tokenizing overhead, keeping performance high. **Why others are wrong:** Strings don\'t inherently leak memory here, bypass the GIL, or get encrypted.'),
q('What positional arguments must be explicitly passed to isolate dynamic execution environments from local application variables?', ['`self`, `instance`, `owner`', 'Global and Local runtime namespace dictionaries.', '`*args, **kwargs`', 'Bytearray reference buffers.'], 1, 'Passing custom global and local dictionaries encapsulates dynamic execution states, keeping them fully separated from your main application scope. **Why others are wrong:** The other options are not the correct arguments for `exec()`/`eval()` scope isolation.'),
q('How does `ast.NodeTransformer` enable advanced metaprogramming?', ['It runs code in a separate thread.', 'It allows you to programmatically modify the Abstract Syntax Tree before compilation, injecting or altering logic dynamically.', 'It compiles Python to C.', 'It bypasses the GIL.'], 1, '`ast.NodeTransformer` lets you intercept and mutate the AST nodes, enabling you to rewrite code logic (like injecting logging or stripping dangerous calls) before it is compiled to bytecode. **Why others are wrong:** It does not use threads, compile to C, or bypass the GIL.')
],
[
'The `compile()` engine transforms raw string commands into executable bytecode blocks.',
'Explicitly pass custom dictionary scopes into `exec` loops to prevent state corruption.',
'Securing sandboxes requires structural syntax tree checks to block reflective attribute crawling.',
'Pre-compile text commands outside loop blocks to eliminate string-parsing latency.',
'Use `ast.NodeTransformer` to programmatically rewrite code logic before compilation.'
],
'If you want to use a big terminal, use your CMD. Full guide is in Lesson 1.'
),

// -------------------------------------------------------------------------
// LESSON 28
// -------------------------------------------------------------------------
L(
'pyx-28', 28, 'Thread Coordination & State Synchronization', '🚦',
'Locks stop threads from corrupting variables, but scaling multi-threaded applications requires coordinating when threads execute. By mastering synchronization primitives like Conditions, Events, and Semaphores, you can build reliable producer-consumer topologies and coordinate thread tasks smoothly.',
[
{
title: '1. Thread Signals via `threading.Event`',
beginner: 'An Event is like an internal traffic light. Threads stop and wait when the light is red, then blast forward the exact millisecond another thread switches the light to green.',
advanced: '`threading.Event` wraps an atomic boolean flag. Threads calling `.wait()` pause efficiently without wasting CPU cycles. When another thread executes `.set()`, all waiting threads wake up simultaneously.'
},
{
title: '2. Complex Coordination via `Condition`',
beginner: 'Sometimes threads need to wait for a specific condition—like a queue filling up. A Condition lets threads sleep securely, waking them up one-by-one as resources become available.',
advanced: '`threading.Condition` combines an underlying Lock with an internal notification queue. Threads call `.wait()` to release the lock and sleep. Calling `.notify()` or `.notify_all()` wakes up waiting threads, forcing them to re-acquire the lock before continuing.'
},
{
title: '3. Throttling Rates via `Semaphore`',
beginner: 'A Semaphore is like a bouncer at a club. If your club only holds 5 people, the bouncer makes the 6th person wait outside until someone else exits the building.',
advanced: '`threading.Semaphore` manages an atomic internal counter. Calling `.acquire()` decrements this counter. If it hits zero, subsequent threads block until active threads call `.release()`, making it perfect for throttling connection rates.'
},
{
title: '4. Fork-Safety Patterns',
beginner: 'If you duplicate an application using an OS process fork while multi-threading, your background locks can get stuck in a broken state. You must use register hooks to clean them up.',
advanced: 'Forking a multi-threaded process copy inherits only the thread that called the fork. Any locks held by other threads will remain permanently locked in the child process. Use `os.register_at_fork` to reset synchronization primitives safely.'
},
{
title: '5. Deadlock Prevention Strategies (Expert Teaser)',
beginner: 'A deadlock is when Thread A waits for Thread B, and Thread B waits for Thread A. They freeze forever! To stop this, always grab locks in the exact same order everywhere.',
advanced: '*(Pro Track Preview)* Deadlocks occur when multiple locks are acquired in inconsistent orders. Advanced architectures prevent this by enforcing strict lock hierarchies, utilizing timeout-based acquisitions (`lock.acquire(timeout=1)`), or leveraging `threading.RLock` (Reentrant Locks) to allow the same thread to acquire a lock multiple times without freezing.'
}
],
{
title: 'Architect an Ordered Multi-Stage Assembly Pipeline',
intro: 'We are going to leverage threading Events to build a multi-stage production worker flow where Thread B safely waits for Thread A to complete data processing tasks.',
steps: [
'Open a fresh script file workspace.',
'Import threading elements: `import threading, time` \\n `ready_signal = threading.Event(); data_payload = []`.',
'Write the producer loop: `def stage_one():` \\n `print("Stage 1: Gathering inputs..."); time.sleep(1)` \\n `data_payload.append("TX_DATA_PACKET"); ready_signal.set()`.',
'Write the consumer loop: `def stage_two():` \\n `print("Stage 2: Standing by..."); ready_signal.wait()` \\n `print("Stage 2: Processing verified data:", data_payload[0])`.',
'Instantiate your workers: `t1 = threading.Thread(target=stage_one); t2 = threading.Thread(target=stage_two)`.',
'Start both workers simultaneously: `t2.start(); t1.start(); t1.join(); t2.join()`.',
'Observe your logs: Thread 2 stands by efficiently, instantly waking up the millisecond Thread 1 signals completion.'
],
goal: 'You have coordinated thread execution order using native synchronization signaling.'
},
[
q('What behavior occurs when a thread calls the `.wait()` command on an un-set `threading.Event` object?', ['It terminates execution loops.', 'It pauses execution, putting the thread to sleep efficiently without wasting CPU cycles until `.set()` is invoked.', 'It triggers a ThreadingConflictError.', 'It forks a new worker process.'], 1, 'Calling `.wait()` puts threads to sleep without consuming CPU cycles until an external `.set()` signal changes the event state. **Why others are wrong:** It does not terminate, trigger errors, or fork processes.'),
q('Which synchronization tool should you use to limit resource access to an exact number of concurrent threads?', ['`threading.Lock`', '`threading.Semaphore`', '`threading.Event`', '`sys.settrace`'], 1, 'Semaphores manage internal counters that limit resource access to a configurable number of concurrent threads. **Why others are wrong:** Locks are binary (1 thread). Events are for signaling. `sys.settrace` is for debugging.'),
q('What dangerous bug can occur when a multi-threaded application forks an OS subprocess copy without resetting its locks?', ['The Global Interpreter Lock is disabled permanently.', 'Child processes inherit locked state references from missing threads, leading to permanent deadlocks.', 'Memory structures are immediately deallocated.', 'The application switches to JavaScript compilation layers.'], 1, 'Forking copies only the thread that initiated the call. Any locks held by other threads will remain locked forever in the child process, causing instant deadlocks. **Why others are wrong:** It does not disable the GIL, deallocate memory, or switch to JS.'),
q('Which method wakes up all threads currently sleeping on a `threading.Condition` primitive container simultaneously?', ['`.set()`', '`.notify_all()`', '`.release()`', '`.wake_up()`'], 1, 'Calling `.notify_all()` alerts every thread currently sleeping on that condition object, moving them to the lock acquisition queue. **Why others are wrong:** `.set()` is for Events. `.release()` is for Locks/Semaphores. `.wake_up()` does not exist.'),
q('How does `threading.RLock` (Reentrant Lock) differ from a standard `threading.Lock`?', ['It is faster.', 'It allows the same thread to acquire the lock multiple times without deadlocking itself.', 'It works across multiple processes.', 'It automatically releases after 1 second.'], 1, 'An RLock tracks which thread owns it and how many times it has been acquired, allowing the owning thread to re-acquire it safely. A standard Lock would deadlock if the same thread tried to acquire it twice. **Why others are wrong:** It is not necessarily faster, does not work across processes, and does not auto-release.')
],
[
'`threading.Event` structures manage binary coordination signals across multiple threads.',
'`threading.Condition` coordinates thread pools by pairing lock controls with notification queues.',
'Use `Semaphore` boundaries to throttle concurrent access to sensitive external resource pools.',
'Register `os.register_at_fork` hooks to reset synchronization primitives across process forks.',
'Enforce strict lock hierarchies or use `RLock` to prevent catastrophic thread deadlocks.'
],
'If you want to use a big terminal, use your CMD. Full guide is in Lesson 1.'
),

// -------------------------------------------------------------------------
// LESSON 29
// -------------------------------------------------------------------------
L(
'pyx-29', 29, 'Context-Aware Logging & Tracing Infrastructures', '🪵',
'Production logging is much more than simple print statements. When diagnosing anomalies across complex asynchronous or multi-threaded applications, senior engineers must build structured logging factories, deploy thread-safe filters, and track diagnostic context IDs across system borders.',
[
{
title: '1. The Structured Log Flow Architecture',
beginner: 'Standard print commands output flat text everywhere. Production systems require structured loggers that route messages through filters and formatting engines, organizing data into clean formats like JSON.',
advanced: 'The `logging` module processes entries through an execution chain. Loggers forward records to Handlers (like `StreamHandler`, `FileHandler`), which pass data through Filters before a Formatter outputs the final string payload.'
},
{
title: '2. Thread-Safe Context via `ContextVar`',
beginner: 'If your application is handling 100 user requests at the same time, your log files can quickly look like a jumbled mess. You can use a special tracking variable to stamp each log with the correct user ID automatically.',
advanced: '`contextvars.ContextVar` isolates data across concurrent execution paths. Unlike thread-local storage, `ContextVar` tracks values accurately across both OS thread switches and asynchronous coroutine hops.'
},
{
title: '3. Custom Log Filter Injection',
beginner: 'You don\'t need to manually inject a tracking token into every single logging line. You can write a master filter that automatically stamps information onto every message passing through your system.',
advanced: 'Subclassing `logging.Filter` and overriding `filter(self, record)` lets you inject variables directly into the `LogRecord` dictionary. Formatters can then use tokens like `%(request_id)s` to enforce structured tracking schemas globally.'
},
{
title: '4. Performance Overheads & Blocking I/O',
beginner: 'Writing log messages straight to a slow disk file can bottleneck your entire application. High-performance systems push logs into background thread queues to keep the main code running fast.',
advanced: 'Writing directly to disk file streams causes blocking I/O bottlenecks. Production architectures wrap standard log handlers in a `logging.handlers.QueueHandler`, offloading message writing tasks to an asynchronous background thread.'
},
{
title: '5. Asynchronous Logging Pipelines (Expert Teaser)',
beginner: 'If your app generates 10,000 logs a second, even a background thread might struggle. Elite systems push logs into a fast memory queue and let a separate process handle the disk writing entirely.',
advanced: '*(Pro Track Preview)* For ultra-high-throughput systems, `QueueListener` is paired with `QueueHandler` to decouple logging entirely from the request lifecycle. Logs are buffered in memory and flushed asynchronously, ensuring that disk I/O latency never impacts API response times.'
}
],
{
title: 'Architect a Context-Stamped JSON Log Filter',
intro: 'We are going to implement a logging infrastructure that leverages ContextVar variables to automatically stamp correlation IDs onto log messages across concurrent threads.',
steps: [
'Open a fresh script file.',
'Import core engines: `import logging, contextvars, uuid` \\n `req_id_var = contextvars.ContextVar("req_id", default="SYSTEM")`.',
'Create your filter: `class ContextFilter(logging.Filter):` \\n `def filter(self, record):` \\n `record.req_id = req_id_var.get(); return True`.',
'Configure the logger: `logger = logging.getLogger("api")` \\n `logger.setLevel(logging.INFO)` \\n `handler = logging.StreamHandler()`.',
'Inject your filter and layout formatting rules: \\n `handler.addFilter(ContextFilter())` \\n `handler.setFormatter(logging.Formatter("[%(req_id)s] %(message)s"))` \\n `logger.addHandler(handler)`.',
'Simulate an active request context: `req_id_var.set(str(uuid.uuid4())[:8])`.',
'Trigger a log message: `logger.info("Database transaction committed successfully.")`.',
'Observe your output log pattern: Your message is automatically stamped with the active context ID!'
],
goal: 'You have built a context-aware tracking log pipeline, the cornerstone of modern observability platforms.'
},
[
q('Which scoping utility tracks context state accurately across BOTH multi-threaded swaps and asynchronous coroutine hops?', ['`threading.local()`', '`contextvars.ContextVar`', '`sys.getframe()`', '`os.environ`'], 1, '`ContextVar` provides context-local isolation that tracks accurately across both asynchronous tasks and multi-threaded systems. **Why others are wrong:** `threading.local()` fails across async hops. `sys.getframe()` is for stack inspection. `os.environ` is global process state.'),
q('What role does a custom `logging.Filter` fulfill when subclassed and integrated into a logging pipeline?', ['It deletes old log files from the disk.', 'It encrypts message payloads.', 'It can dynamically inspect, reject, or inject variables directly into the target LogRecord metadata structure.', 'It speeds up loop processing frames.'], 2, 'Filters can mutate the `LogRecord` metadata structure dynamically, making them perfect for injecting tracking IDs globally. **Why others are wrong:** They do not delete files, encrypt payloads, or speed up loops.'),
q('How should you configure logging handlers to prevent slow disk I/O operations from bottlenecking your application performance?', ['Wrap your log handlers inside a `logging.handlers.QueueHandler` framework to delegate disk writes to background threads.', 'Convert your log messages into integer primitives.', 'Disable log file formatting rules.', 'Disable the Garbage Collector.'], 0, '`QueueHandler` pipes log messages to background threads, freeing your main application thread from blocking disk operations. **Why others are wrong:** Converting to ints, disabling formatting, or disabling GC does not solve disk I/O blocking.'),
q('What attribute on a `logging.LogRecord` represents the raw, unfiltered text string message supplied by the developer?', ['`record.text`', '`record.msg`', '`record.payload`', '`record.string`'], 1, 'The `.msg` attribute holds the raw message string prior to applying formatting templates. **Why others are wrong:** The standard attribute is specifically `.msg`, not `.text`, `.payload`, or `.string`.'),
q('Why is `QueueListener` paired with `QueueHandler` in ultra-high-throughput systems?', ['To encrypt the logs.', 'To completely decouple logging from the request lifecycle, buffering logs in memory and flushing them asynchronously to prevent disk I/O latency.', 'To compress the logs into ZIP files.', 'To bypass the GIL.'], 1, 'This pairing ensures that disk I/O latency never impacts API response times by handling all file writing in a separate, asynchronous listener thread/process. **Why others are wrong:** It does not encrypt, compress to ZIP, or bypass the GIL.')
],
[
'Log processing pipelines pass execution records through custom loggers, handlers, filters, and formatters.',
'Deploy `ContextVar` variables to preserve tracing tokens across concurrent execution blocks safely.',
'Subclass `logging.Filter` to automate metadata injection schemas across your logging pipeline.',
'Utilize `QueueHandler` setups to offload blocking file-writing operations away from your critical path.',
'Pair `QueueListener` with `QueueHandler` for ultra-high-throughput, non-blocking asynchronous logging.'
],
'If you want to use a big terminal, use your CMD. Full guide is in Lesson 1.'
),

// -------------------------------------------------------------------------
// LESSON 30
// -------------------------------------------------------------------------
L(
'pyx-30', 30, 'C-Types & Raw Foreign Function Interfaces', '🔌',
'The absolute limit of Python optimization requires stepping outside the CPython virtual machine entirely. By mastering the `ctypes` foreign function interface, you can load compiled C libraries, allocate unmanaged heap memory, and map binary C structures directly onto Python classes.',
[
{
title: '1. What is a Foreign Function Interface (FFI)?',
beginner: 'An FFI is like a universal data bridge. It lets your Python script load and execute fast compiled code libraries written in languages like C or C++ directly from memory.',
advanced: 'The `ctypes` module serves as a foreign function interface (FFI). It loads shared libraries (`.so` on Linux, `.dll` on Windows), wraps their symbols, and translates Python data types straight into native binary C conventions.'
},
{
title: '2. Enforcing Strict Type Signatures',
beginner: 'Before calling an external C library function, you must tell Python exactly what data types the library expects and what type it will return. If you mix this up, your application will crash.',
advanced: 'Developers must explicitly configure a library function\'s signatures: `.argtypes` defines expected input types (e.g., `[ctypes.c_int, ctypes.c_char_p]`), and `.restype` sets the output type contract, preventing memory access crashes.'
},
{
title: '3. Mapping Python Classes to C Structs',
beginner: 'You can design a special class in Python that maps its fields directly to exact byte-by-byte memory locations matching standard C structures.',
advanced: 'By inheriting from `ctypes.Structure` and declaring the fields array schema `_fields_ = [("field_name", ctypes.c_int)]`, you define an explicit C-compatible memory block that can be read and written directly by compiled C extensions.'
},
{
title: '4. Direct Pointer & Memory Control',
beginner: 'With ctypes, you can read raw memory addresses and create pointers, completely bypassing the standard Python security controls.',
advanced: 'Functions like `ctypes.pointer(x)` and `ctypes.byref(x)` extract raw memory addresses. This enables zero-copy operations across external C boundaries, but removes CPython safety protections, making your code prone to core segmentation faults.'
},
{
title: '5. The Segmentation Fault Hazard (Expert Teaser)',
beginner: 'If you make a mistake with raw memory pointers in C, the program doesn\'t give you a friendly Python error. It just instantly vanishes in a puff of smoke called a "Segmentation Fault".',
advanced: '*(Pro Track Preview)* Because `ctypes` operates outside the CPython virtual machine safety net, memory boundary violations (like writing past the end of an allocated C array) bypass Python\'s exception handling entirely. The OS kernel detects the illegal memory access and immediately terminates the process with a SIGSEGV (core dumped), leaving no Python traceback to debug.'
}
],
{
title: 'Call Native OS C Math Engines Directly',
intro: 'We are going to load the operating system\'s native C standard library directly from memory and run an optimized math function using explicit typing controls.',
steps: [
'Open your script space or interactive REPL.',
'Import your FFI package engine: `import ctypes, sys`.',
'Load the native OS C standard runtime library: \\n `libc = ctypes.CDLL("libc.so.6")` (Linux) OR \\n `libc = ctypes.CDLL("msvcrt.dll")` (Windows) OR \\n `libc = ctypes.CDLL("libc.dylib")` (macOS).',
'Configure the C input parameter verification signatures: `libc.abs.argtypes = [ctypes.c_int]`.',
'Configure the C execution return value structure contract: `libc.abs.restype = ctypes.c_int`.',
'Execute the native C calculation directly: `result = libc.abs(-12345)`.',
'Verify the computation: `print(result)` — returns `12345` directly from the OS C runtime engine!'
],
goal: 'You have bypassed the virtual machine layer, calling native compiled OS binaries directly.'
},
[
q('Which configuration attribute enforces strict parameter type-checking on an external `ctypes` function before it executes?', ['`.argtypes`', '`.restype`', '`.signatures`', '`__slots__`'], 0, 'The `.argtypes` attribute defines the input validation sequence required to map native parameters to external C data structures correctly. **Why others are wrong:** `.restype` is for return types. `.signatures` and `__slots__` are not used for ctypes type checking.'),
q('What happens if you introduce an index or memory error while working with raw pointers via `ctypes`?', ['The CPython compiler outputs a friendly warning message.', 'The Python virtual machine crashes with an immediate, uncatchable Segmentation Fault (core dumped).', 'The variable turns into a string value.', 'A standard `IndexError` exception fires.'], 1, '`ctypes` operates outside the CPython virtual machine safety net; memory boundary violations bypass exception handling and trigger immediate kernel segmentation faults. **Why others are wrong:** It does not output warnings, convert to strings, or fire standard Python exceptions.'),
q('How do you declare a Python class as an explicit byte-for-byte representation of a native C structure mapping schema?', ['Decorate your class with `@runtime_checkable`.', 'Inherit from `ctypes.Structure` and declare your field maps inside the `_fields_` variable list attribute.', 'Add `__slots__` arrays to your object.', 'Compile the class definition into JSON.'], 1, 'Inheriting from `ctypes.Structure` paired with `_fields_` configurations instructs the engine to allocate an exact C-compatible memory footprint for instance variables. **Why others are wrong:** `@runtime_checkable` is for Protocols. `__slots__` is for Python memory optimization. JSON is irrelevant.'),
q('What does passing an object reference through the `ctypes.byref(x)` utility optimize?', ['It encrypts the variable.', 'It passes a lightweight memory address pointer instead of copying the full object data footprint, mimicking C-style call-by-reference logic.', 'It serializes data to a disk file.', 'It triggers garbage collection loops.'], 1, '`ctypes.byref()` extracts the memory pointer of an object efficiently, avoiding data copying overhead across external function calls. **Why others are wrong:** It does not encrypt, serialize to disk, or trigger GC.'),
q('Why is debugging `ctypes` memory errors significantly harder than standard Python errors?', ['Because the code runs too fast.', 'Because memory violations bypass Python\'s exception handling and cause immediate OS-level process termination (SIGSEGV) without a traceback.', 'Because C libraries are encrypted.', 'Because Python hides the errors intentionally.'], 1, 'Since `ctypes` operates outside the VM, illegal memory accesses are caught by the OS kernel, which kills the process instantly without giving Python a chance to generate a traceback. **Why others are wrong:** Speed, encryption, and intentional hiding are not the reasons; it\'s the lack of VM safety boundaries.')
],
[
'The `ctypes` FFI enables direct execution of compiled native binary libraries from Python.',
'Configure `.argtypes` and `.restype` signatures precisely to prevent fatal memory corruption crashes.',
'Subclass `ctypes.Structure` to map class properties straight onto dense C memory layouts.',
'Use `byref` and pointer primitives to pass raw memory addresses, enabling zero-copy execution pipelines.',
'Beware of Segmentation Faults: memory errors in ctypes bypass Python exceptions and crash the OS process instantly.'
],
'If you want to use a big terminal, use your CMD. Full guide is in Lesson 1.'
)
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
