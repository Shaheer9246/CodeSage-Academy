// Python Track — 30 lessons (beginner → advanced)
import type { NetworkingLesson, Concept, QuizQuestion } from './networkingLessons';

export type PythonLesson = NetworkingLesson;

const L = (
  id: string, order: number, title: string, icon: string, philosophy: string,
  concepts: Concept[], practical: PythonLesson['practical'], quiz: QuizQuestion[],
  keyTakeaways: string[], terminalNotice?: string // <--- Added parameter
): PythonLesson => ({
  id, module: 'Module 1: Python Programming', order, title, icon, philosophy,
  concepts, practical, quiz, keyTakeaways, terminalNotice, // <--- Added to object
});

const q = (question: string, options: string[], correctIndex: number, explanation?: string): QuizQuestion =>
  ({ question, options, correctIndex, explanation });

export const PYTHON_TRACK_NOTICE = {
  type: "track-notice",
  notice: "🖥️ Python Track Status: This track is currently under development. In this module, we are focusing on establishing your core programming foundation. Please proceed through the available lessons to build your skills; we are actively updating the preview environment and will notify you as soon as the interactive compiler is fully integrated."
};

export const PYTHON_LESSONS: PythonLesson[] = [
L(
'py-01', 1, 'Environment Setup & Language Core', '🚀',
'🚀 Every incredible software engineering journey starts at the exact same place: the terminal. Before writing complex automation scripts, machine learning pipelines, or web applications, you must transform your machine from a simple consumption device into a powerful development workstation. You are no longer just a user; you are becoming a creator.',
[
{ title: '1. The Python Interpreter Engine', beginner: 'Think of the Python Interpreter as an elite automatic translator. Your computer processor cannot read human English words or clean code text; it only understands raw binary pulses (ones and zeros). When you write a line of code, the interpreter acts as the middleman, reading your syntax, evaluating your intent, and converting it into instructions the machine can instantly execute.', advanced: 'At a lower system level, standard Python (CPython) acts as both a compiler and a virtual machine. When you run a script, it first parses your source code text into an Abstract Syntax Tree (AST), then compiles it into an optimized, intermediate binary layer called Bytecode (stored inside hidden `.pyc` files). This bytecode is then safely evaluated sequentially by the Python Virtual Machine (PVM) runtime environment.' },
{ title: '2. Terminal Shell Navigation', beginner: 'Most everyday computer users click on colorful graphical desktop icons to open apps and move files. As a developer, you will drop behind the curtains and use the Terminal (Command Prompt or PowerShell on Windows, Terminal app on Mac/Linux). It is a text-only command station where you talk directly to your operating system using specific typed code paths.', advanced: 'The terminal communicates directly with your system shell (like bash, zsh, or cmd). When you type a word like `python`, the shell searches through a specific environmental configuration list called the `PATH` variable. If the absolute folder address of your compiler isn\'t recorded inside that PATH array, your terminal will throw an annoying "command not found" error because it literally doesn\'t know where the executable binary lives on your hard drive.' },
{ title: '3. The REPL Interactive Playground', beginner: 'Python features a fantastic live testing sandbox called the REPL (Read-Eval-Print-Loop). When you type `python` into the terminal without specifying a file, you step into a live environment where typing code immediately prints out results on the screen. It is an incredible scratchpad for running quick experiments or testing out ideas without saving any files.', advanced: 'The REPL provides a volatile, interactive runtime state machine. It reads standard input (sys.stdin), parses expressions on the fly, evaluates them inside the active execution stack, displays standard output streams (sys.stdout), and loops back to await the next evaluation block. It is a critical workspace tool for checking object attributes, inspecting memory states, and running quick micro-benchmarks.' },
{ title: '4. Standalone Source Code Files', beginner: 'While the REPL playground is fantastic for quick tests, it completely forgets your work the moment you close it. To build real, permanent programs, you write code inside standard text files and save them with a special `.py` file extension. This creates a permanent script asset that your machine can execute from top to bottom at any time.', advanced: 'Executing standard source script files (`python script.py`) instantiates an isolated, non-volatile interpreter execution lifecycle. The system processes the module environment boundaries, loads dependencies from top to bottom, evaluates scope assignments, and cleanly frees all allocated system memory addresses via garbage collection once the file reaches its terminal line or triggers a sys.exit() call.' },
{ title: '5. The Execution Pipeline (How Code Actually Runs)', beginner: 'When you tell the computer to run your file, it doesn\'t just read it like a book. It goes through a strict assembly line. First, it checks for spelling mistakes (Lexing). Then, it maps out the grammar and structure (Parsing). Finally, it translates it into the machine\'s native language (Execution). If you make a grammar mistake, the assembly line stops and throws an error before it even tries to run!', advanced: 'The CPython execution pipeline consists of distinct phases: Tokenization (breaking source into tokens), Parsing (building the Abstract Syntax Tree), AST Compilation (transforming the AST into a control flow graph and emitting bytecode), and finally PVM Evaluation (executing the bytecode via the main evaluation loop). Understanding this pipeline is crucial for debugging SyntaxErrors (which fail at parse time) versus runtime Exceptions (which fail during PVM evaluation).' }
],
{
title: 'Workstation Activation & First Script Execution',
intro: '⚠️ NOTE: This practical assignment is significantly larger and more detailed because it covers your complete local system installation, terminal mapping setup, and file system orchestration!',
steps: [
'Open your internet browser and navigate directly to the official Python Downloads Page. Download the latest stable release package matching your specific operating system.',
'Launch the downloaded installer file. CRITICAL STEP FOR WINDOWS USERS: Look closely at the very first wizard screen and check the box that explicitly says "Add Python to PATH" before clicking Install. If you skip this, your terminal will remain completely blind to your installation.',
'Open your machine\'s native terminal window. On Windows, press the `Windows Key`, type `cmd`, and press `Enter`. On a Mac, press `Cmd+Space`, type `Terminal`, and press `Enter`.',
'Inside your clean terminal prompt, type `python --version` (or `python3 --version` on some macOS machines) and press `Enter`. Verify that the terminal cleanly prints back your newly installed version number, proving your system PATH configuration is successful.',
'Now, enter the live interactive playground! Type `python` (or `python3`) and press `Enter`. Notice that your traditional terminal path prompt vanishes, replaced by a triple arrow symbol `>>>`. This means you are now officially inside the live Python interpreter engine.',
'Type your first absolute line of code: `print("Hello World")` and press `Enter`. Watch the system immediately evaluate your command and print the text stream cleanly underneath.',
'LEARN THE TOGGLE CYCLE: To exit and close the Python sandbox playground and safely return to your ordinary system terminal prompt, type the explicit function command `exit()` and press `Enter`. Notice the `>>>` prompt vanishes. To reopen it, simply type `python` again!',
'Now create a permanent script file. Open any basic, plain-text text editor on your system. Create a brand-new file, type `print("Automating the terminal!")` on line one, and save the document inside an easy-to-find folder naming the file explicitly as `app.py`.',
'Return to your main terminal window, navigate to that specific directory folder using the change-directory command (e.g., `cd Desktop`), and run your script file permanently by executing: `python app.py`.'
],
goal: 'You successfully installed the core engine, initialized and safely exited the live terminal REPL sandbox, created permanent source files, and orchestrated script execution paths directly from the shell prompt.'
},
[
q('How do you safely exit and close the interactive Python REPL playground to return to your normal computer terminal prompt?', ['Type the word `stop` and hit Enter', 'Close the entire laptop monitor lid completely', 'Type the command `exit()` and press Enter, or use keyboard shortcuts like Ctrl+D / Ctrl+Z', 'Delete the python execution app from your hard drive'], 2, 'The explicit function command `exit()` or environmental breakout keystrokes (Ctrl+D/Z) cleanly disconnect the terminal session from the active execution sub-process, returning you to the OS shell. **Why others are wrong:** Typing `stop` is not a recognized Python command and will throw a NameError. Closing the laptop lid just suspends the hardware state without closing the software process. Deleting the app destroys your installation entirely rather than just exiting the current session.'),
q('Why is checking the "Add Python to PATH" checkbox absolutely critical during the Windows setup installation phase?', ['It increases the download speed of the installer files from the internet', 'It records the compiler binary directory inside the operating system environment list, allowing your terminal shell to recognize and run the `python` command from any folder path', 'It automatically changes your desktop wallpaper background to the Python logo', 'It converts your mouse pointer cursor into a command terminal shortcut'], 1, 'Adding Python to PATH records the executable application paths inside the system environment directory array, allowing your terminal shell to recognize and run the `python` command from any folder path. **Why others are wrong:** It has zero impact on internet download speeds or desktop wallpapers. It doesn\'t convert your mouse cursor; it simply updates a hidden text list in your OS settings that the shell reads to find programs.'),
q('What is the core structural difference between writing code in the interactive REPL playground versus saving code inside a `.py` file?', ['The REPL runs significantly slower than source file scripts', 'The REPL playground is a volatile live scratchpad that completely forgets your code strings the moment you close it, whereas file scripts are permanent reusable assets', 'Files can only store text numbers, while the REPL can only process text words', 'Code saved in source files requires a permanent internet connection to execute'], 1, 'The REPL loop provides immediate volatile expression evaluations that vanish on exit, while `.py` files store non-volatile, persistent, and structured code assets for repeated system deployment. **Why others are wrong:** The REPL does not run significantly slower; in fact, it\'s instant. Files can store any data type, not just numbers. Neither requires an internet connection to execute locally.'),
q('Which command utility pattern is executed inside the terminal shell to run a permanent script file named `server.py` from a target folder location?', ['run server.py script', 'python server.py', 'open python compiled server', 'execute --file=server'], 1, 'Passing the target source filename parameter directly to the primary interpreter command (`python server.py`) instructs the system to initialize an isolated runtime pass over that exact target file structure. **Why others are wrong:** `run`, `open`, and `execute --file` are not valid native Python CLI commands. The Python executable strictly expects the script path as the first positional argument.'),
q('If you make a grammar mistake in your code, like forgetting a closing parenthesis `)`, when will Python catch this error?', ['While the code is actively running line-by-line', 'During the initial parsing phase before any code actually executes', 'Only after the program finishes and saves a log file', 'It will ignore the mistake and guess what you meant'], 1, 'Python catches grammar and structural mistakes (SyntaxErrors) during the initial parsing phase when it builds the Abstract Syntax Tree, long before the PVM executes any logic. **Why others are wrong:** It doesn\'t wait until runtime (that\'s for logic errors like dividing by zero). It doesn\'t wait for a log file, and Python strictly refuses to guess missing syntax; it will immediately crash and point to the exact line number of the mistake.')
],
['Ensure Python is mapped cleanly to your OS PATH environment array to allow universal terminal command execution.', 'Master the interactive REPL sandbox shell for quick structural prototyping, algorithm testing, and syntax verification loops.', 'Always remember that `exit()` or shortcut triggers are required to cleanly suspend live interpreters and return control back to your standard shell prompt.', 'Organize source code workflows into dedicated `.py` text assets to assemble permanent, reproducible automation scripts.', 'Understand that code goes through a strict assembly line (Lexing, Parsing, Execution) before it actually runs.'],
'We now have a built-in terminal right here! However, if you want a bigger screen, you can use your computer\'s native terminal (CMD/PowerShell/Terminal). The practical assignment below contains the full setup instructions to install Python on your machine and map it to your system PATH.'
),

L(
  'py-2', 2, 'Variables & Data Types', '📦',
  '📦 **Philosophy:** Think of your computer\'s memory like a massive, infinite warehouse. A variable is not a physical box that holds data; it is simply a friendly sticky note label you slap onto a specific object in that warehouse so you can find it instantly later! Understanding this distinction is the key to mastering Python.\n\n*If you want to use a big terminal, use your CMD. Full guide is in Lesson 1.*',
  [
    { title: '1. Naming & Assignment', beginner: 'Writing `wallet = 50` creates a label named "wallet" and points it to the number 50. In Python, we write multiple words using lowercase letters joined by underscores, like `total_cash_left = 100` (called snake_case). If you point a second label to the same item, both labels look at the exact same object!', advanced: 'Variables are references (pointers) to memory addresses, not isolated boxes. If `a = [1,2]` and `b = a`, then `b.append(3)` alters the underlying object, meaning `a` will now output `[1,2,3]` too. Use the built-in `id()` function to inspect the raw memory address of any object to prove they share the same location.' },
    { title: '2. Numbers', beginner: 'Python automatically reads whole numbers (like `5` or `100`) as integers (`int`), and numbers with decimals (like `3.14` or `99.9`) as floats (`float`). You don\'t have to tell Python which is which—it figures it out for you! Python can also handle massively huge numbers without breaking.', advanced: 'True division `/` always returns a float, whereas integer floor division `//` yields a truncated integer. Beware binary floating-point precision constraints (IEEE 754 standard) where `0.1 + 0.2 != 0.3`. Use the `decimal` module for currency. Note that Python 3 integers have arbitrary precision, meaning they can grow to fill your RAM without overflowing like they do in C++ or Java.' },
    { title: '3. Strings (Text)', beginner: 'Any text wrapped inside single or double quotes is a string (`str`), like `"Hello!"`. Strings are unchangeable (immutable) after creation. If you want to change a word, you actually have to build a brand new string. You can measure their length using `len("hi")` or make them loud using `.upper()`.', advanced: 'Strings are indexable, immutable sequences of Unicode characters. They support slicing syntax like `s[start:stop:step]` and negative indexing (`s[-1]`). Under the hood, Python uses UTF-8 encoding and employs "string interning" to save memory by reusing identical short string objects in a hidden global pool.' },
    { title: '4. Booleans & None', beginner: 'Programs need logic! A boolean can only be `True` or `False`. If you need a label to point to something completely empty or unassigned, Python provides a special placeholder value called `None`. It\'s like an empty parking spot.', advanced: 'Python evaluates empty collections (`[]`, `{}`, `""`), zero values (`0`, `0.0`), and `None` as falsy in boolean contexts via the `__bool__` or `__len__` dunder methods. When evaluating equality for singletons like `None`, syntax convention dictates using identity checks (`is None`) rather than equality (`== None`) to bypass custom `__eq__` overrides.' },
    { title: '5. Memory & Identity', beginner: 'How does Python know if two things are exactly the same? It uses the `is` keyword to check if two labels point to the exact same physical object in memory, and the `==` keyword to check if they just hold the same text or numbers. When no labels point to an object anymore, Python automatically throws it in the trash to save space!', advanced: 'Python uses automatic reference counting for memory management. Every object keeps a hidden tally of how many variables point to it. When the count drops to zero, the garbage collector instantly destroys the object and frees the RAM. Use the `is` operator to check if two variables point to the exact same memory address, and `==` to check if their contents match.' }
  ],
  { 
    title: 'Variable Playground & Memory Inspection', 
    intro: 'Let\'s create variables inside your open REPL screen, inspect their hidden data types, and look at their actual memory addresses.', 
    steps: [
      'Make sure your terminal is active with Python running (you should see the `>>>` prompt).',
      'Type `x = 10` and press `Enter`. Then type `name = "Sage"` and press `Enter`. Notice that Python prints absolutely nothing. This is by design; assignment is a silent action.',
      'Now ask Python what type those items are! Type `type(x)` and press `Enter`. You should see `<class \'int\'>`. Then type `type(name)` to see `<class \'str\'>`.',
      'Test memory identity: Type `a = [1, 2]` and press `Enter`. Then type `b = a` and press `Enter`. Now type `id(a)` and `id(b)`. Notice the massive numbers are exactly identical, proving they point to the exact same list in your computer\'s RAM.',
      'Test division styles: Type `10 / 3` to see the float answer `3.333...`, then try `10 // 3` to see it chop off decimals and return `3`.',
      'Try a clean text merge: Type `f"{name} has {x} points"` and watch Python cleanly build the full sentence using f-strings.'
    ], 
    goal: 'You successfully created multiple types of data labels, read their properties, and proved how Python manages memory references.' 
  },
  [
    q('What does dynamic typing mean in Python?', ['You must declare a type before using a variable', 'Python determines the data type automatically based on the assigned value', 'Variables can never change their values', 'Code runs significantly slower'], 1, 'Dynamic typing means Python detects whether something is a number, text, or true/false logic automatically when you assign it, without requiring explicit type declarations. **Why others are wrong:** You do not need to declare types (that\'s static typing). Variables can change values freely. While dynamic typing has a slight overhead, it does not make code "significantly slower" in a way that prevents its use in production.'),
    q('Which of the following follows the official Python naming style (snake_case)?', ['myUserScore', 'my_user_score', 'MyUserScore', 'my-user-score'], 1, 'The official Python style guide (PEP 8) uses lowercase words separated by underscores for variable and function names. **Why others are wrong:** `myUserScore` is camelCase (used in JavaScript). `MyUserScore` is PascalCase (used for Python Classes). `my-user-score` uses hyphens, which Python interprets as a minus sign, causing a syntax error.'),
    q('What is the difference between writing `10 / 3` and `10 // 3`?', ['They do exactly the same thing', '/ gives the full decimal answer, while // chops off decimals and returns a whole number', '// multiplies instead of dividing', '/ triggers an error'], 1, 'The single slash `/` performs standard float division, whereas the double slash `//` performs floor division to return a whole integer. **Why others are wrong:** They do not do the same thing. `//` does not multiply. `/` does not trigger an error; it is the standard mathematical division operator.'),
    q('What is the safest way to check if a variable points to a completely empty `None` value?', ['if x == None:', 'if x is None:', 'if x.empty():', 'if x = None:'], 1, 'Using `is None` is the standard, optimized Python way to verify the identity of an unassigned or empty placeholder variable. **Why others are wrong:** `== None` can be overridden by custom classes to return True incorrectly. `.empty()` is not a built-in Python method for None. `=` is an assignment operator, not a comparison operator, and will cause a SyntaxError in an if statement.'),
    q('Why does Python use Reference Counting for memory management?', ['To count how many lines of code you have written', 'To track how many variables point to an object, so it can delete the object when the count hits zero', 'To limit the number of variables you can create', 'To make the internet connection faster'], 1, 'Reference counting tracks how many labels point to an object; when the count hits zero, the garbage collector instantly destroys the object and frees the RAM. **Why others are wrong:** It has nothing to do with counting lines of code, limiting variable creation, or internet speeds. It is strictly an internal memory optimization mechanism.')
  ],
  ['Variables act as names pointing to data values in memory, not physical boxes.', 'Python automatically figures out data types (Dynamic Typing).', 'Integers hold whole numbers; Floats hold decimals (beware IEEE 754 precision).', 'Always use identity check (`is None`) to evaluate None values.', 'Use `id()` to inspect memory addresses and understand object references.']
),

L(
  'py-3', 3, 'Control Flow', '🔀',
  '🔀 **Philosophy:** Code is a journey, but it doesn\'t have to be a straight line. Control flow is the map that dictates which paths the CPU travels down. By adding crossroads (if/else) and circular roundabouts (loops), you transform a simple list of instructions into a smart, decision-making engine.\n\n*If you want to use a big terminal, use your CMD. Full guide is in Lesson 1.*',
  [
    { title: '1. if / elif / else', beginner: 'This is a fork in the road. `if` checks a condition (like `if cash > 10:`). If it\'s true, Python drives down that path. If not, it checks the next `elif` (else-if) path, or defaults to the `else` path. Remember, clean indentation tells Python exactly which commands belong inside each path!', advanced: 'Utilize the walrus operator `:=` (introduced in Python 3.8) to simultaneously assign a value to a variable and evaluate it within a conditional expression to decrease code redundancy. Python also uses "short-circuit evaluation" in `and`/`or` statements, meaning it stops checking conditions the exact millisecond the final outcome is guaranteed.' },
    { title: '2. while loops', beginner: 'A `while` loop is a repeating roundabout. It tells your code: "Keep running this block over and over again as long as this condition remains True!" Be careful—if the condition never becomes False, your loop will run forever and crash your program!', advanced: 'Prefer `for` loops for predictable sequence bounded iteration. Reserve `while True:` combined with an internal conditional `break` for infinite polling sequences, low-level system event loops, and server listeners. Always include a `time.sleep()` call in infinite loops to prevent maxing out your CPU cycles.' },
    { title: '3. for loops', beginner: 'A `for` loop is like an automated conveyor belt. It pulls items out of a collection one by one (like a list of names or a batch of numbers) and runs your code block for each individual item until the collection is completely empty.', advanced: 'Under the hood, `for` loops rely on the Iterator Protocol. They call the `__iter__()` method to get an iterator, and then repeatedly call `__next__()` until a `StopIteration` exception is raised. Leverage `enumerate()` to extract tracking index offsets, and lazy `range()` objects for memory-efficient numeric index stepping.' },
    { title: '4. break / continue / else', beginner: 'Use `break` to smash open a loop and escape out of it immediately. Use `continue` to instantly skip the rest of the current turn and jump straight to the next item on the conveyor belt.', advanced: 'Python supports an uncommon `for-else` construct where the `else:` block fires exclusively if the loop runs to natural completion without encountering an explicit intercepting `break` statement. This is highly useful for search algorithms where you need to execute fallback logic only if an item was NOT found.' },
    { title: '5. Scope & The LEGB Rule', beginner: 'When you create a variable inside a loop or an if-statement, where does it live? Python has strict rules about "scope" (visibility). Variables created inside a function are trapped inside that function. Variables created outside are global and can be seen by everyone.', advanced: 'Python resolves variable names using the LEGB rule: Local (inside the current function), Enclosing (inside any wrapping outer functions), Global (at the top level of the module), and Built-in (Python\'s pre-loaded keywords). Use the `global` or `nonlocal` keywords to explicitly mutate variables outside your immediate local scope.' }
  ],
  { 
    title: 'The FizzBuzz Challenge (Multi-line REPL Mastery)', 
    intro: 'Let\'s build a famous programmer screening puzzle. Because we are using the REPL, we must carefully manage our indentation and press Enter on an empty line to tell Python the loop is finished.', 
    steps: [
      'Make sure your terminal is active with Python running (look for the `>>>` prompt).',
      'Type `for i in range(1, 21):` and press `Enter`. Notice the prompt changes to `...` indicating Python expects an indented block.',
      'Type exactly 4 spaces, then `if i % 15 == 0: print("FizzBuzz")` and press `Enter`.',
      'Type exactly 4 spaces, then `elif i % 3 == 0: print("Fizz")` and press `Enter`.',
      'Type exactly 4 spaces, then `elif i % 5 == 0: print("Buzz")` and press `Enter`.',
      'Type exactly 4 spaces, then `else: print(i)` and press `Enter`.',
      'CRITICAL STEP: Press `Enter` one more time on a completely empty line. This tells Python you are done with the loop block. Watch the numbers and words flood the screen!',
      'Analyze the output to verify that multiples of 3, 5, and both were correctly swapped for text.'
    ], 
    goal: 'Your program successfully processes numbers 1 through 20, and you mastered the tricky multi-line indentation rules of the interactive REPL.' 
  },
  [
    q('What does Python use to understand which commands belong inside an `if` statement block?', ['A pair of closing parentheses ()', 'Consistent vertical text alignment and spaces (Indentation)', 'Wrapping sentences inside quotation marks', 'Semicolons printed at the end of each line'], 1, 'Python relies entirely on clean indentation spaces to map out the physical scope of structural code blocks. **Why others are wrong:** Parentheses group mathematical expressions, not code blocks. Quotation marks are for strings. Semicolons are used in languages like C++ or Java to end lines, but Python uses line breaks and indentation.'),
    q('Which helper should you use if you need both the item count index AND the item value inside a `for` loop?', ['range(len(x))', 'enumerate(x)', 'zip(x)', 'iter(x)'], 1, 'The `enumerate()` function cleanly yields a tracking index counter along with the raw value item on every single loop cycle. **Why others are wrong:** `range(len(x))` works but is considered unpythonic and slower. `zip()` pairs two different lists together. `iter()` just creates an iterator object without tracking indices.'),
    q('What happens when Python encounters a `break` statement inside a loop?', ['It pauses for 5 seconds', 'It stops the loop instantly and jumps outside of it', 'It skips to the next turn of the loop', 'It restarts the computer'], 1, 'The `break` keyword immediately cuts off execution of the active loop and shoots execution out past the bottom block. **Why others are wrong:** It does not pause (that would require `time.sleep()`). It does not skip to the next turn (that is `continue`). It certainly does not restart the hardware.'),
    q('When does an `else:` block attached directly to a `for` loop run?', ['It runs on every single loop turn', 'It runs only if the loop completes its entire run without hitting a break statement', 'It runs only if the loop breaks on the very first try', 'It never runs and triggers an error'], 1, 'In a `for-else` configuration, the else logic acts as a success confirmation, running only if the loop ran to full completion without breaking. **Why others are wrong:** It does not run on every turn. It does not run if a break is hit. It is a valid, documented Python feature and does not trigger an error.'),
    q('According to the LEGB rule, where does Python look FIRST when trying to find the value of a variable?', ['Global scope (top of the file)', 'Built-in scope (Python\'s internal keywords)', 'Local scope (inside the current function)', 'Enclosing scope (outer wrapping functions)'], 2, 'Python always checks the Local scope first (inside the current function block) before moving outward to Enclosing, Global, and finally Built-in scopes. **Why others are wrong:** Global, Built-in, and Enclosing are checked subsequently only if the variable is not found in the immediate Local scope.')
  ],
  ['Indentation defines logical code blocks; never mix tabs and spaces.', 'For loops are the standard choice for walking through sequences via the Iterator Protocol.', 'Use enumerate() to track indices and values together cleanly.', 'Break exits loops immediately, while continue skips the current step.', 'Understand LEGB scope resolution to avoid variable shadowing bugs.']
),

L(
  'py-4', 4, 'Functions', '🛠️',
  '🛠️ **Philosophy:** Functions are the ultimate tool for abstraction and the DRY (Don\'t Repeat Yourself) principle. They allow you to solve a complex problem once, name it, and reuse it forever. Think of a function as a magical black box: you feed it raw ingredients (inputs), it runs a specific set of instructions inside, and it hands you back a finished product (output)!\n\n*If you want to use a big terminal, use your CMD. Full guide is in Lesson 1.*',
  [
    { title: '1. Defining a Function (def)', beginner: 'To create a reusable tool, write `def` followed by a custom name and a pair of parentheses, like `def greet(name):`. Inside, use the `return` keyword to send the final result back to whoever called your tool. If you forget `return`, Python automatically hands back `None`!', advanced: 'Functions in Python are first-class objects. This means they can be dynamically assigned to variables, passed as standard arguments into other functions, or returned from nested closures. When called, they create a new "stack frame" in memory to hold their local variables, which is destroyed upon return.' },
    { title: '2. Default & Keyword Args', beginner: 'You can give parameters a backup value just in case the user leaves them empty, like `def buy_pizza(count=1):`. If a user calls `buy_pizza()`, they get 1 pizza by default. You can also name your inputs explicitly when calling a function so their order doesn\'t matter!', advanced: '⚠️ Avoid the mutable default argument trap: `def append_item(x=[])` instantiates a single persistent list object at parse time, reusing it across consecutive calls. Always use `x=None` and initialize conditionally inside. Use the `*` symbol in the parameter list to force all subsequent arguments to be passed strictly as keywords.' },
    { title: '3. Packing Inputs (*args & **kwargs)', beginner: 'Sometimes you don\'t know how many items a user will throw into your function. Putting an asterisk `*` before a parameter name packs an endless list of values into a single tidy collection so you can loop through them easily.', advanced: 'The parameter syntax `*args` unpacks positional elements into an immutable tuple, while `**kwargs` packs named keyword elements into a standard mutable dictionary. These are essential for building flexible proxy wrappers, high-level structural decorators, and passing arguments dynamically via `*` and `**` at the call site.' },
    { title: '4. Docstrings & Type Hints', beginner: 'You can leave a clean instruction manual inside your function by wrapping text in triple quotes `"""` right under the definition line. You can also label your expected data types, like `(price: float)`, to help your code editor spot typing mistakes instantly!', advanced: 'Type hints are completely ignored by the runtime interpreter but are heavily utilized by static analyzers like `mypy` and IDE type checkers to trace parameters and block type errors before deployment. Docstrings are stored in the function\'s `__doc__` attribute and can be accessed dynamically via the `help()` function.' },
    { title: '5. Closures & State', beginner: 'Did you know a function can "remember" things even after it finishes running? If you create a small function inside a bigger function, the small one can pack up the bigger one\'s variables and carry them around. This is called a closure!', advanced: 'Closures occur when a nested function references variables from its enclosing lexical scope. Use the `nonlocal` keyword to mutate these captured outer variables. This is the foundational mechanism behind factory functions and stateful decorators without needing to write full Object-Oriented classes.' }
  ],
  { 
    title: 'The Smart Calculator (REPL Multi-line Definition)', 
    intro: 'Let\'s build a strictly typed, documented mathematical tool. We will carefully manage our indents in the REPL to define the function block.', 
    steps: [
      'Open your interactive terminal screen (look for the `>>>` listening line).',
      'Type `def add(a: float, b: float) -> float:` and press `Enter`. The prompt changes to `...`.',
      'Type exactly 4 spaces, then `"""Adds two numbers together."""` and press `Enter`.',
      'Type exactly 4 spaces, then `return a + b` and press `Enter`.',
      'CRITICAL STEP: Press `Enter` one more time on a completely empty line. The `>>>` prompt returns, meaning your function is successfully saved in memory!',
      'Test your new creation by typing: `add(3.5, 4.2)` and press `Enter`.',
      'Test out keyword calling out of order: Type `add(b=10.0, a=5.0)` and watch Python match the correct variables perfectly!'
    ], 
    goal: 'You successfully wrote a custom function with explicit type labels, documented it, managed REPL indentation, and executed it.' 
  },
  [
    q('What does the `return` keyword do inside a function block?', ['It restarts the entire function from the beginning', 'It stops execution and passes the final calculated result back out', 'It deletes all variables inside memory', 'It prints text directly onto the dark screen'], 1, 'The `return` statement immediately ends the function\'s execution, destroys the local stack frame, and delivers the final object back to the caller expression. **Why others are wrong:** It does not restart the function. It does not manually delete variables (the garbage collector does that). It does not print to the screen (that is `print()`).'),
    q('What is the danger of writing a mutable collection as a default argument, like `def design(items=[])`?', ['The program will crash instantly on the very first try', 'Python creates and shares the exact same list across every single call, blending old data', 'The function will execute 10 times slower', 'It locks your keyboard from typing'], 1, 'Mutable default objects are evaluated exactly once when the module loads, causing subsequent function execution states to bleed together and share the same list reference. **Why others are wrong:** It does not crash instantly. It does not slow down execution. It has no effect on hardware peripherals like the keyboard.'),
    q('What data collection type does Python use to pack positional parameters using `*args`?', ['A completely customizable List', 'An unchangeable, sequence-locked Tuple', 'A key-value tracking Dictionary', 'An unordered unique Set'], 1, 'The `*` symbol packs an arbitrary sequence of unmapped positional arguments into an immutable tuple collection. **Why others are wrong:** It does not create a mutable List, a key-value Dictionary (that is `**kwargs`), or an unordered Set. Tuples are used because they are faster and guarantee the argument order cannot be accidentally modified inside the function.'),
    q('Are Python type hints (like `x: int`) strictly enforced while your code is running at runtime?', ['Yes, Python throws an error instantly if the wrong type is used', 'No, they are ignored at runtime and act as documentation markers for editors and analyzers', 'They only work if you are connected to the internet', 'They are only allowed inside loop definitions'], 1, 'Python is dynamically typed; hints do not change runtime behavior but are used by external developer tools like `mypy` to find logical bugs before deployment. **Why others are wrong:** Python does not throw runtime errors for type hints. They do not require an internet connection. They are allowed anywhere variables or parameters are defined, not just in loops.'),
    q('What is a "Closure" in Python?', ['A function that closes the terminal window', 'A nested function that remembers and carries variables from its outer enclosing scope', 'A special command to lock a file', 'A loop that runs forever'], 1, 'A closure occurs when a nested function references variables from its enclosing lexical scope, effectively "packing them up" to be used later even after the outer function has finished. **Why others are wrong:** It has nothing to do with closing terminal windows, locking files, or infinite loops. It is a specific memory and scoping mechanism.')
  ],
  ['Use def to build reusable code recipes that create isolated stack frames.', 'The return keyword outputs a value and closes the function.', 'Be careful with mutable default arguments like empty lists; use None instead.', 'Type hints make code significantly easier for code editors to read and predict.', 'Leverage *args and **kwargs for highly flexible, dynamic function signatures.']
),

L(
  'py-5', 5, 'Data Structures: List, Tuple, Dict, Set', '📚',
  '📚 **Philosophy:** Data structures are simply different kinds of storage containers. Choosing the right container for your data is half the battle in coding—each tool offers unique structural traits, speeds, and behavioral rules. Choose the wrong foundation, and your application will collapse under its own weight as it scales!\n\n*If you want to use a big terminal, use your CMD. Full guide is in Lesson 1.*',
  [
    { title: '1. Lists (The Expandable Grocery List)', beginner: 'A list is a flexible, ordered sequence wrapped in square brackets, like `items = ["apple", "banana"]`. You can freely add items with `.append()`, remove the last item using `.pop()`, or slice out specific chunks. It keeps everything in the exact order you added it!', advanced: 'Lists are dynamic arrays under the hood. Appending or popping from the absolute end is highly efficient at $O(1)$ amortized time, but inserting or deleting elements from the middle requires shifting trailing references, resulting in an $O(n)$ time cost. Python secretly over-allocates memory to prevent resizing on every single append. Use `collections.deque` if you require an optimized double-ended queue.' },
    { title: '2. Tuples (The Locked Glass Case)', beginner: 'A tuple is an ordered sequence locked inside round parentheses, like `point = (10, 20)`. Unlike lists, tuples are completely unchangeable (immutable) after creation. Use them for fixed data sets that you want to protect from accidental edits!', advanced: 'Because tuples have a fixed length and immutable state, they are strictly hashable. This allows them to safely serve as composite dictionary keys. They are also more memory-compact than lists because they don\'t require over-allocation. Consider leveraging `collections.namedtuple` or data classes to add explicit property field descriptors to your record structures.' },
    { title: '3. Dictionaries / Dicts (The Contact Address Book)', beginner: 'A dictionary connects a unique search key to a piece of data, wrapped in curly brackets: `user = {"id": 101, "name": "Sage"}`. Instead of searching by line index numbers, you look up values instantly by calling their exact name keys!', advanced: 'Python dictionaries use internal hash tables to look up, insert, and delete items in highly optimized $O(1)$ average time. They handle hash collisions silently behind the scenes. Dictionaries preserve insertion order natively since Python 3.7. Always employ the `.get(key, default)` extraction pattern to cleanly handle missing fields without risking an accidental `KeyError` crash.' },
    { title: '4. Sets (The Magic Sorting Basket)', beginner: 'A set is an unordered collection of unique items wrapped in curly brackets, like `lucky_numbers = {3, 7, 9}`. Sets strictly ban duplicate elements! If you try to add a duplicate, the set simply swallows it up and ignores it.', advanced: 'Sets are implemented as dummy-value hash tables, giving them lightning-fast $O(1)$ membership lookup checks (`if item in my_set`). They natively support powerful mathematical Venn diagram operations like union (`|`), intersection (`&`), and difference (`-`), making them ideal for deduplicating massive datasets instantly.' },
    { title: '5. Time Complexity & Big O Notation', beginner: 'How do we measure which container is faster? We use "Big O" to count how many steps the computer takes as your data grows. $O(1)$ means it takes the exact same amount of time no matter how big the list gets (like a dictionary). $O(n)$ means it takes longer and longer as the list grows (like searching a list one by one).', advanced: 'Big O notation describes the upper bound of an algorithm\'s time or space complexity as the input size $n$ approaches infinity. Understanding the difference between $O(1)$ hash lookups (Dicts/Sets) and $O(n)$ linear scans (Lists) is the single most important factor in optimizing high-performance Python applications and avoiding catastrophic scaling bottlenecks.' }
  ],
  { 
    title: 'The Intelligent Word Counter', 
    intro: 'Let\'s build a text analyzer that counts how many times individual words appear inside a sentence by choosing the perfect dictionary tracking container.', 
    steps: [
      'Open your terminal and ensure the Python environment is active (the `>>>` prompt is showing).',
      'Create a text sentence to analyze: Type `s = "the cat sat on the mat"` and hit `Enter`.',
      'Break the text into a clean list of individual words by typing: `words = s.split()` and hit `Enter`.',
      'Create a completely empty dictionary container to hold your tracking scores: Type `counts = {}` and hit `Enter`.',
      'Type `for w in words:` and hit `Enter` (prompt becomes `...`).',
      'Type exactly 4 spaces, then `counts[w] = counts.get(w, 0) + 1` and hit `Enter`.',
      'CRITICAL STEP: Press `Enter` on an empty line to close the loop block.',
      'Print `counts` to verify that Python grouped and tabulated the word frequencies perfectly!'
    ], 
    goal: 'You successfully split text data, managed REPL loop indentation, and aggregated frequency records using a key-value dictionary tool.' 
  },
  [
    q('Which data container should you use if your absolute highest priority is checking whether an item exists in a fraction of a millisecond?', ['A standard ordered list', 'An unordered, unique Set', 'An unchangeable tuple record', 'A long text string sequence'], 1, 'Sets use underlying hash lookups, making membership verification checks almost instantaneous $O(1)$ regardless of how large the collection grows. **Why others are wrong:** Lists, Tuples, and Strings require $O(n)$ linear scanning, meaning the computer must check every single item one by one, which becomes incredibly slow as the data size increases.'),
    q('What happens if you attempt to create an ordered tuple structure and then append a new item to it later in the code?', ['Python quietly turns the tuple into a list', 'It triggers an immediate error because tuples are locked and immutable', 'The item overwrites the first element inside the tuple', 'The computer drops the value entirely without telling you'], 1, 'Tuples are completely immutable; any runtime attempts to alter their underlying state or physical capacity will trigger an `AttributeError`. **Why others are wrong:** Python does not silently convert types. It does not overwrite elements. It does not drop values silently; it strictly enforces immutability to guarantee memory safety and hashability.'),
    q('Starting from Python 3.7+, what happens to the internal layout order of a dictionary when you add new key-value pairs?', ['The order is randomized completely to optimize memory', 'The insertion order is preserved exactly as items are added', 'The dictionary auto-sorts all items alphabetically', 'All numerical keys are pushed to the back'], 1, 'Modern Python dictates that dictionaries maintain insertion ordering as a core language specification feature, thanks to a compact memory layout redesign. **Why others are wrong:** It does not randomize order. It does not auto-sort alphabetically (you must use `sorted()` for that). It does not segregate numerical keys.'),
    q('What is the primary benefit of using `my_dict.get("age", 0)` instead of direct tracking access like `my_dict["age"]`?', ['It executes twice as fast', 'It automatically prevents an application-breaking KeyError if the key is missing from the system', 'It formats the returned value into an integer string', 'It clears out the dictionary values to save memory space'], 1, 'The `.get()` method allows you to safely request a dictionary key while supplying a fallback recovery value if that key doesn\'t exist yet, preventing a fatal crash. **Why others are wrong:** It is not faster (direct access is slightly faster). It does not format strings. It does not clear memory.'),
    q('What does $O(n)$ time complexity mean in plain English?', ['The operation takes the exact same amount of time no matter the data size', 'The operation takes twice as long if you add one more item', 'The time it takes grows proportionally as the amount of data increases', 'The operation is impossible to calculate'], 2, '$O(n)$ means the time it takes grows linearly and proportionally as the amount of data ($n$) increases (e.g., searching a list item by item). **Why others are wrong:** $O(1)$ is constant time (same time regardless of size). $O(n)$ does not mean "twice as long per item", it means proportional growth. It is a standard mathematical calculation, not impossible.')
  ],
  ['Lists store ordered mutable item sequences (Dynamic Arrays).', 'Tuples enforce unchangeable, hashable structured records.', 'Dictionaries map unique keys to fast-access $O(1)$ values via Hash Tables.', 'Sets filter out duplicate inputs and execute instant lookups.', 'Always consider Big O Time Complexity when choosing a data structure for large datasets.']
),

L(
  'py-6', 6, 'Object-Oriented Programming', '🧱',
  '🧱 **Philosophy:** Object-Oriented Programming (OOP) is about modeling reality. It shifts your mindset from writing "instructions" to creating "entities" that interact with each other. Think of a class as an architectural blueprint, and an object as the actual physical house built from that blueprint. By grouping data and behaviors together, you build systems that are modular, scalable, and easy to reason about.\n\n*If you want to use a big terminal, use your CMD. Full guide is in Lesson 1.*',
  [
    { title: '1. Class & Instance (The Blueprint vs The House)', beginner: 'A class is a master design template, like a blueprint for a `Dog`. Writing `d = Dog()` takes that generic blueprint and constructs a real, living, unique dog object (called an instance) inside your computer\'s memory space.', advanced: 'Classes themselves are runtime objects instantiated from a metaclass type. In Python\'s "everything is an object" paradigm, `type` serves as the default primitive constructor class from which all standard user-defined class definitions descend. Class attributes are shared across all instances, while instance attributes are unique to each object.' },
    { title: '2. __init__ & self (The Birth Ceremony & Passport)', beginner: 'The `__init__` command is a special birth ceremony that runs automatically the exact millisecond a new object is created. The word `self` is like a personal passport photo—it allows the specific object being born to point to its own unique traits, like its own name or age!', advanced: 'The keyword `self` explicitly passes the memory address of the target object instance as the first positional argument to instance methods. Unlike implicit tracking mechanisms in languages like Java or C++, Python requires explicit declaration by design (PEP 8). Note that `__init__` is actually the initializer; the true allocator is the `__new__` method, which is rarely overridden outside of metaclass programming.' },
    { title: '3. Methods & Attributes', beginner: 'Variables locked inside a class are called attributes (things the object knows about itself, like `color`). Functions locked inside a class are called methods (actions the object can perform, like `.bark()`).', advanced: 'Use `@classmethod` to receive the underlying class object as an argument (frequently used for alternative constructors) and `@staticmethod` for isolated utility logic that doesn\'t touch class or instance state. Apply the `@property` decorator to cleanly mask evaluation methods as standard read-only tracking attributes, enabling computed properties.' },
    { title: '4. Inheritance (Family Trees)', beginner: 'Inheritance allows a new child class to automatically adopt all attributes and methods from a parent class, like writing `class Cat(Animal):`. This means a `Cat` automatically gains generic animal traits without you rewriting any code!', advanced: 'Avoid deep hierarchical inheritance chains which introduce fragile coupling. Prioritize structural object composition over class inheritance patterns for behavior sharing. When inheriting, Python uses the C3 Linearization algorithm to determine the Method Resolution Order (MRO), dictating exactly which parent class gets checked first when calling `super()`.' },
    { title: '5. Magic (Dunder) Methods', beginner: 'Python objects have hidden superpowers called "Magic Methods" (because they start and end with double underscores, like `__str__`). They let you teach your custom objects how to behave like built-in Python objects, like knowing how to print themselves nicely or how to add themselves together with a `+` sign!', advanced: 'Dunder (Double UNDERscore) methods hook directly into Python\'s internal operator overloading and lifecycle protocols. Implementing `__repr__` defines the developer-facing string representation, `__len__` hooks into the `len()` built-in, and `__add__` intercepts the `+` operator. Mastering dunders is the hallmark of writing truly "Pythonic" custom data structures.' }
  ],
  { 
    title: 'The Dog Model Factory', 
    intro: 'Let\'s build a fully operational object factory template that models real-world characteristics and dynamic behaviors, carefully managing REPL class indentation.', 
    steps: [
      'Open your terminal screen and verify that the Python environment is ready (look for the `>>>` prompt).',
      'Create a master design by typing: `class Dog:` and hit `Enter`. The prompt changes to `...`.',
      'Type 4 spaces, then `def __init__(self, name, age):` and hit `Enter`.',
      'Type 8 spaces, then `self.name = name` and hit `Enter`.',
      'Type 8 spaces, then `self.age = age` and hit `Enter`.',
      'Type 4 spaces, then `def bark(self):` and hit `Enter`.',
      'Type 8 spaces, then `return f"{self.name} says woof!"` and hit `Enter`.',
      'CRITICAL STEP: Press `Enter` on an empty line to close the class block. The `>>>` prompt returns.',
      'Stamp out a live object by typing `d = Dog("Rex", 3)` and test its action using `print(d.bark())`!'
    ], 
    goal: 'You successfully designed a structural class blueprint, managed deep nested indentation in the REPL, assigned local instance states, and executed a custom method.' 
  },
  [
    q('What does the keyword `self` physically represent inside a Python class method?', ['The global application script context', 'The specific individual object instance currently running that method', 'The parent directory path', 'The total number of loops executed'], 1, '`self` acts as a direct reference pointing to the specific, individual object instance that is executing the code block, allowing it to access its own unique attributes. **Why others are wrong:** It is not the global context (that is `globals()`). It has nothing to do with file directories or loop counters. It is strictly the memory pointer to the current instance.'),
    q('When exactly does the special internal method `__init__` execute?', ['Only when the program finishes running', 'Automatically the exact moment a new object instance is created from a class template', 'When a variable gets deleted', 'Only if you call it manually by typing its full name'], 1, '`__init__` is the object initializer method that fires automatically to configure object traits at creation time, immediately after `__new__` allocates the memory. **Why others are wrong:** It does not run at program end. It does not run on deletion (that is `__del__`). You should almost never call `__init__` manually; it is triggered by the class instantiation syntax `MyClass()`.'),
    q('What is the difference between an attribute and a method inside an object?', ['Attributes are strings and methods are numbers', 'Attributes are data variables that store values, while methods are functions that perform actions', 'Methods run automatically and attributes are completely ignored', 'They mean the exact same thing'], 1, 'Attributes hold structural data values belonging to an object (state), whereas methods contain executable instruction blocks (behavior) bound to that object. **Why others are wrong:** Attributes can be any data type, not just strings. Methods do not run automatically (unless hooked into lifecycle dunders). They are fundamentally different concepts (state vs behavior).'),
    q('What does the `@property` decorator do when placed directly above an object method definition?', ['It converts the entire class into a background static method', 'It allows a method to be read directly like a standard structural variable attribute without parentheses', 'It deletes data to optimize memory layout', 'It encrypts the object values'], 1, 'The `@property` decorator wraps a method so it can be cleanly accessed as if it were a computed, read-only variable attribute (e.g., `obj.area` instead of `obj.area()`). **Why others are wrong:** It does not convert the class to a static method. It does not delete data or encrypt values. It strictly alters the access syntax to mimic a property.'),
    q('What is the primary purpose of "Magic" or "Dunder" methods like `__str__` or `__add__`?', ['To hide code from other developers', 'To allow custom objects to hook into and override built-in Python operators and functions', 'To make the code run 100x faster', 'To connect the program to a database'], 1, 'Dunder methods hook directly into Python\'s internal operator overloading and lifecycle protocols, allowing custom objects to behave natively with built-in syntax like `print()` or `+`. **Why others are wrong:** They are not for hiding code (they are public APIs). They do not inherently speed up execution. They have no direct relation to database connections.')
  ],
  ['Classes serve as master blueprints while objects are live instances.', 'The __init__ method initializes data values at object birth; self points to the instance.', 'Attributes define what an object knows; methods define what it does.', 'Use inheritance sparingly; prefer composition for complex behavior sharing.', 'Master Dunder methods to make your custom objects feel like native Python built-ins.']
),
 
  // ... (You can leave py-7 through py-20 exactly as they currently are in your file!)
L('py-7', 7, 'Error Handling & Exceptions', '🚨',
    '*If you want to use a big terminal, use your CMD. Full guide is in Lesson 1.*\n\n🚨 **Philosophy:** Code breaks. It is a fundamental, unavoidable law of software engineering. Networks drop, users type letters instead of numbers, and files go missing. The difference between an amateur script and a professional, enterprise-grade application is not that the professional code never breaks—it\'s that the professional code *expects* to break and handles it gracefully. This is called Defensive Programming. By mastering exceptions, you transform fatal, screen-filling crashes into controlled, logical detours.',
    [
      { 
        title: '1. The Traceback & Call Stack', 
        beginner: 'When Python crashes, it prints a massive wall of red text called a Traceback. Don\'t panic! Read it from the bottom up. The very last line tells you exactly what went wrong (like a `NameError`), and the lines above it show the exact "breadcrumb trail" of functions that led to the crash, including the exact file and line number.', 
        advanced: 'Tracebacks traverse the execution call stack. When an error occurs, Python creates an Exception object and begins "unwinding" the stack, popping off function frames one by one until it finds a `try/except` block to catch it. If it reaches the global interpreter boundary without being caught, it prints the stack trace and terminates. You can inspect this live stack using the `traceback` module or `sys.exc_info()`.' 
      },
      { 
        title: '2. try / except Blocks', 
        beginner: 'Think of `try/except` as a safety net. You put risky code (like downloading a file or doing math) inside the `try` block. If it crashes, Python stops the `try` block instantly and jumps into the `except` block to run backup code, preventing the whole program from dying!', 
        advanced: 'Always catch specific exceptions (e.g., `except ValueError:`) rather than bare `except:` clauses. Python evaluates `except` blocks top-to-bottom. You can also capture the exception object itself using `except ValueError as e:` to log the exact error message or pass it to a centralized logging pipeline.' 
      },
      { 
        title: '3. Raising Custom Errors', 
        beginner: 'You don\'t have to wait for Python to crash—you can crash it yourself! Using the `raise` keyword, you can throw a custom error if a user does something wrong, like `raise ValueError("Age cannot be negative!")`. This acts as a strict bouncer for your functions.', 
        advanced: 'Raising exceptions allows you to enforce strict API contracts and domain-driven design. You should subclass the base `Exception` class to create highly specific, domain-level error structures (e.g., `class InsufficientFundsError(Exception): pass`). This allows upstream callers to catch and handle specific business-logic failures independently of generic system errors.' 
      },
      { 
        title: '4. finally & else', 
        beginner: 'A `finally` block runs at the very end of your try/except, no matter what happens (crash or no crash). It is perfect for closing files or turning off connections. An `else` block only runs if the `try` block succeeds without any errors at all.', 
        advanced: 'The `finally` block is guaranteed to execute even if the `try` block returns a value, breaks a loop, or raises a new unhandled exception. It is the foundational pattern for deterministic resource management (often abstracted away by Context Managers). The `else` block is useful for executing code that should only run if no exceptions were raised, keeping the `try` block strictly limited to the operations that might actually fail.' 
      },
      { 
        title: '5. The Exception Hierarchy', 
        beginner: 'Not all errors are created equal! Python has a family tree of errors. At the very top is `BaseException`. Below it is `Exception`, which covers normal coding mistakes. Things like pressing Ctrl+C to stop a program are special system signals that live outside the normal `Exception` family so they don\'t get accidentally blocked!', 
        advanced: 'All exceptions inherit from `BaseException`. However, standard application errors inherit from `Exception`. System-exiting events like `KeyboardInterrupt` and `SystemExit` inherit directly from `BaseException`. This architectural separation ensures that a broad `except Exception:` block will catch logic errors but will intentionally allow the user to forcefully kill the process via Ctrl+C, preventing "zombie" infinite loops.' 
      }
    ],
    { 
      title: 'The Crash-Proof Calculator', 
      intro: 'Let\'s build a division tool that uses error handling to survive bad inputs, like trying to divide by zero or passing text instead of numbers. We will define this as a multi-line function in the REPL.', 
      steps: [
        'Open your terminal and launch the Python REPL (`>>>`).',
        'Type `def safe_divide(a, b):` and press `Enter`. The prompt changes to `...`.',
        'Type 4 spaces, then `try:` and press `Enter`.',
        'Type 8 spaces, then `result = a / b` and press `Enter`.',
        'Type 4 spaces, then `except ZeroDivisionError:` and press `Enter`.',
        'Type 8 spaces, then `print("Error: Cannot divide by zero!")` and press `Enter`.',
        'Type 4 spaces, then `except TypeError:` and press `Enter`.',
        'Type 8 spaces, then `print("Error: Please use numbers only.")` and press `Enter`.',
        'Type 4 spaces, then `else:` and press `Enter`.',
        'Type 8 spaces, then `print(f"Success: {result}")` and press `Enter`.',
        'CRITICAL STEP: Press `Enter` on an empty line to close the function block. The `>>>` prompt returns.',
        'Test the safety nets! Type `safe_divide(10, 0)` and watch it catch the math error. Then type `safe_divide(10, "two")` to catch the type error. Finally, type `safe_divide(10, 2)` to trigger the `else` block!'
      ], 
      goal: 'You successfully trapped specific runtime crashes, managed deep REPL indentation, and diverted them into graceful backup logic without stopping the application.' 
    },
    [
      q('Which block of code is guaranteed to run regardless of whether an exception was triggered or not?', ['The `try` block', 'The `else` block', 'The `finally` block', 'The `except` block'], 2, 'The `finally` block is designed strictly for deterministic resource cleanup and executes unconditionally at the end of the error handling chain, even if a `return` or `break` statement is encountered. **Why others are wrong:** The `try` block stops immediately upon an error. The `else` block only runs if NO errors occurred. The `except` block only runs if an error WAS caught.'),
      q('Why is writing a bare `except:` clause (catching all errors blindly) considered a dangerous practice?', ['It makes the code run too slowly', 'It catches system-level interrupts like Ctrl+C, making it nearly impossible to shut the program down manually', 'It deletes the original file', 'It triggers a syntax error immediately'], 1, 'Bare `except:` clauses catch everything inheriting from `BaseException`, including crucial `SystemExit` and `KeyboardInterrupt` signals, effectively trapping the user inside the program and masking critical system failures. **Why others are wrong:** It does not affect execution speed, delete files, or trigger syntax errors (it is valid syntax, just bad practice). Always use `except Exception:` instead.'),
      q('How do you manually trigger a custom error inside your own program to enforce a rule?', ['Use the `stop` keyword', 'Use the `raise` keyword followed by an Error class', 'Use the `break` keyword', 'Type `crash()`'], 1, 'The `raise` keyword explicitly initializes an exception object and throws it up the active execution call stack, immediately halting normal flow until it is caught. **Why others are wrong:** `stop` and `crash()` are not Python keywords. `break` is only used to exit loops, not to throw exceptions.'),
      q('When debugging a crashed program, which part of the printed red Traceback should you read first to understand the core issue?', ['The very top line', 'The middle lines showing the memory addresses', 'The very last line at the bottom', 'None of it, it is machine code'], 2, 'The bottom line of a Traceback always contains the specific exception class name (e.g., `ValueError`) and the specific error message text, which is the most critical piece of diagnostic information. **Why others are wrong:** The top and middle lines show the call stack (the "breadcrumb trail" of how you got there), which is useful for context, but the bottom line tells you *what* actually broke. It is human-readable text, not machine code.'),
      q('What is the difference between `BaseException` and `Exception` in Python\'s hierarchy?', ['They are exactly the same thing', '`BaseException` is for normal code errors, while `Exception` is for system crashes', '`Exception` is the base class for standard application errors, while `BaseException` includes system-level events like Ctrl+C that shouldn\'t be caught by normal error handlers', '`BaseException` only works on Windows'], 2, '`Exception` inherits from `BaseException`. Standard application errors inherit from `Exception`, while system-exiting events like `KeyboardInterrupt` inherit directly from `BaseException`. This ensures `except Exception:` catches bugs but allows the user to force-quit the app. **Why others are wrong:** They are not the same. It has nothing to do with OS platforms. The hierarchy is precisely the opposite of the second option.')
    ],
    ['Use try/except blocks as safety nets around risky operations to prevent fatal crashes.', 'Never use bare except blocks; always specify the exact Exception class you expect to catch.', 'The raise keyword lets you enforce your own domain rules and throw custom errors.', 'The finally block is guaranteed to run, making it perfect for closing files or network connections cleanly.', 'Understand the Exception Hierarchy to avoid accidentally trapping system-level interrupts like Ctrl+C.']
  ),

  L('py-8', 8, 'File Systems & I/O', '📂',
    '*If you want to use a big terminal, use your CMD. Full guide is in Lesson 1.*\n\n📂 **Philosophy:** RAM is volatile; the moment your computer loses power, everything in memory vanishes. To build applications that remember things, you must cross the bridge from volatile memory to persistent storage. Mastering File I/O is about understanding how your code interacts with the operating system\'s hardware, managing data streams, and ensuring that your application leaves a permanent, structured footprint on the disk.',
    [
      { 
        title: '1. open() and File Modes', 
        beginner: 'To interact with a file, you must open it. The `open()` command requires a file name and a mode: `"r"` to read text, `"w"` to write (which overwrites the whole file completely!), or `"a"` to append (add text to the very bottom without deleting old text).', 
        advanced: 'Standard file handling operations request a "file descriptor" from the Operating System. Modes like `"rb"` and `"wb"` allow raw byte-stream manipulation for images or non-text binaries, bypassing text encoding layers. Always explicitly declare string encoding (e.g., `encoding="utf-8"`) to prevent cross-platform character corruption, as Windows defaults to `cp1252` while Mac/Linux default to `utf-8`.' 
      },
      { 
        title: '2. The `with` Context Manager', 
        beginner: 'If you open a file, you MUST close it using `.close()`, otherwise your file might get corrupted or locked. To avoid forgetting, Python has a `with open(...) as file:` block. It acts as an automatic door that safely closes and saves the file the exact moment your code block finishes!', 
        advanced: 'Context managers implement the `__enter__` and `__exit__` dunder methods (the RAII pattern: Resource Acquisition Is Initialization). The `with` statement guarantees that the `__exit__` cleanup logic fires deterministically, instantly releasing the OS-level file descriptor lock even if a fatal exception is raised or a `return` statement is executed inside the block.' 
      },
      { 
        title: '3. Reading Data & Memory', 
        beginner: 'Once a file is open in read mode, you can use `.read()` to grab the entire file as one giant text block. But for massive files, it\'s better to use a `for` loop to cleanly read the file line-by-line, which saves your computer from running out of memory!', 
        advanced: 'Using `.read()` loads the entire file payload into active RAM, which will trigger an `MemoryError` or swap-thrashing on gigabyte-scale datasets. Iterating over the file object directly (`for line in file:`) utilizes a lazy generator pattern backed by an internal C-buffer, consuming memory for only one line at a time ($O(1)$ memory complexity).' 
      },
      { 
        title: '4. Parsing JSON', 
        beginner: 'JSON is the standard format for sending data across the internet. Python has a built-in `json` tool. Use `json.loads()` to convert JSON text into a usable Python dictionary, and `json.dumps()` to convert your dictionary back into text to save it!', 
        advanced: 'The built-in `json` module natively handles serialization (dumping) and deserialization (loading). For direct file interactions, utilize `json.dump(obj, file)` and `json.load(file)` to pipe data directly into open system streams without buffering intermediate strings in RAM. Note that JSON only supports basic types (strings, numbers, lists, dicts, booleans, null); custom Python objects require custom encoder classes.' 
      },
      { 
        title: '5. File Paths & `pathlib`', 
        beginner: 'Finding a file on your computer can be tricky because Windows uses backslashes (`\\`) and Mac uses forward slashes (`/`). Python\'s modern `pathlib` tool fixes this! It creates a smart "Path" object that automatically figures out the correct slashes for whatever computer you are using.', 
        advanced: 'The `pathlib` module provides an object-oriented approach to filesystem paths, replacing the legacy string-manipulation `os.path` module. It handles absolute vs. relative path resolution, directory traversal, and globbing (`Path.glob("*.txt")`) natively. It is the modern, Pythonic standard for all filesystem interactions.' 
      }
    ],
    { 
      title: 'The Permanent Log Book', 
      intro: 'Let\'s create a script that writes a permanent text file to your hard drive, appends to it, and reads it back using the safest methods.', 
      steps: [
        'Open your terminal and start Python (`>>>`).',
        'Import the modern path tool: `from pathlib import Path` and press `Enter`.',
        'Create a smart path object: `log_file = Path("diary.txt")` and press `Enter`.',
        'Use the automatic door manager to write: `with log_file.open("w", encoding="utf-8") as f:` and press `Enter`.',
        'Type 4 spaces, then `f.write("System initialized.\\n")` and press `Enter`.',
        'Press `Enter` on an empty line to close the block. Python automatically closes and saves the file!',
        'Now append to it! Type `with log_file.open("a", encoding="utf-8") as f:` and press `Enter`.',
        'Type 4 spaces, then `f.write("Task complete.")` and press `Enter`, then press `Enter` again to close.',
        'Finally, read it back: Type `with log_file.open("r", encoding="utf-8") as f:` and press `Enter`.',
        'Type 4 spaces, then `print(f.read())` and press `Enter`, then press `Enter` again to close. Watch your combined text print perfectly!'
      ], 
      goal: 'You successfully wrote, appended, and extracted permanent data from your operating system\'s hard drive using context managers and modern path objects.' 
    },
    [
      q('What is the safest, standard way to open a file in Python to guarantee it closes properly and releases system resources?', ['Calling `open()` and manually typing `.close()` at the end', 'Using the `with open() as file:` context manager block', 'Leaving the file open in the background', 'Restarting your terminal'], 1, 'The `with` statement guarantees the file descriptor lock is safely released via the `__exit__` dunder method when the block ends, even if the program crashes or returns early. **Why others are wrong:** Manual `.close()` is easily forgotten if an exception occurs before it is reached. Leaving it open causes resource leaks and file corruption. Restarting is a destructive hack, not a programming pattern.'),
      q('Which file mode should you use if you want to add a new sentence to the bottom of a text file without deleting the old text?', ['"r" (Read)', '"w" (Write)', '"a" (Append)', '"x" (Execute)'], 2, 'The `"a"` (append) mode places the stream cursor at the very end of the file, preserving existing data and adding new bytes sequentially. **Why others are wrong:** `"r"` is read-only. `"w"` truncates (deletes) the file contents immediately upon opening. `"x"` is for exclusive creation and fails if the file already exists.'),
      q('What happens if you use `.read()` on a massive 10-Gigabyte text file on a machine with 8GB of RAM?', ['Python will read it 10 times faster', 'The entire file is loaded into RAM all at once, causing the OS to swap to disk or crash the program with a MemoryError', 'Python automatically zips the file', 'Python skips the first half of the file'], 1, '`.read()` dumps the entire file payload into active memory. If the file exceeds available RAM, the OS will thrash the swap file, or Python will throw a `MemoryError`. **Why others are wrong:** It does not speed up reading, auto-zip, or skip data. For massive files, you must iterate line-by-line (`for line in file:`).'),
      q('Which standard library module handles converting Python dictionaries into formatted internet text structures (JSON)?', ['The `math` module', 'The `csv` module', 'The `json` module', 'The `os` module'], 2, 'The built-in `json` module handles serialization mapping between Python objects and standard JSON strings via `dumps()` and `loads()`. **Why others are wrong:** `math` is for calculations. `csv` is for comma-separated tabular data. `os` is for operating system interactions.'),
      q('Why is the `pathlib` module preferred over the older `os.path` string manipulation for handling file locations?', ['It downloads files from the internet faster', 'It provides an object-oriented interface that automatically handles cross-platform slash differences (Windows vs Mac/Linux) and path resolution', 'It encrypts the file paths for security', 'It is the only way to open text files'], 1, '`pathlib` treats paths as intelligent objects rather than dumb strings, natively handling OS-specific separators, absolute/relative resolution, and directory globbing. **Why others are wrong:** It does not download files, encrypt paths, or replace the `open()` function (it just provides the path object to pass into it).')
    ],
    ['Always use the `with open()` context manager to prevent file descriptor leaks and corruption.', 'Mode "w" overwrites files completely, while mode "a" safely appends to the bottom.', 'Loop through files line-by-line to maintain $O(1)$ memory usage on massive datasets.', 'JSON is the universal standard for serializing and sending data structures across networks.', 'Use `pathlib` for robust, cross-platform, object-oriented file path manipulation.']
  ),

  L('py-9', 9, 'Modules & the Standard Library', '🧩',
    '*If you want to use a big terminal, use your CMD. Full guide is in Lesson 1.*\n\n🧩 **Philosophy:** You don\'t have to build everything from scratch! "Standing on the shoulders of giants" is the core tenet of modern software engineering. Python comes with a massive "batteries included" standard library, and a rich ecosystem of external packages. Mastering modules is about understanding namespaces, code organization, and how to snap pre-built, highly-tested Lego bricks into your project to solve complex problems instantly.',
    [
      { 
        title: '1. The import Keyword', 
        beginner: 'To use tools that aren\'t loaded by default, you must `import` them at the very top of your file. Typing `import math` gives you access to a huge toolbox of advanced calculators, which you can use by typing `math.sqrt(16)`.', 
        advanced: 'Importing a module executes that module\'s global namespace entirely from top to bottom. The interpreter caches imported modules inside the `sys.modules` dictionary, ensuring that subsequent imports reference the same cached memory object rather than reloading and re-executing the file from disk.' 
      },
      { 
        title: '2. Specific Imports (from / as)', 
        beginner: 'If you only need one specific tool from a massive toolbox, you can extract it directly: `from random import randint`. Now you can just type `randint(1, 10)` instead of `random.randint`. You can also rename long tools using `as`, like `import datetime as dt`.', 
        advanced: 'Use explicit `from x import y` statements rather than wildcard `from x import *` patterns. Wildcard imports heavily pollute the local namespace, silently overwriting existing variables and making static analysis tools (like linters and IDE autocompletes) fail to track data origin.' 
      },
      { 
        title: '3. Custom Modules & sys.path', 
        beginner: 'Any `.py` file you write can be imported! If you write a cool function inside `helper.py`, you can open a totally different file named `main.py` and type `import helper` to use your code. It keeps your projects clean and organized.', 
        advanced: 'Python locates custom modules by scanning the directory paths mapped inside the `sys.path` list. The current working directory (where you executed the script) is always placed at index 0, prioritizing local files over system-installed packages. You can manipulate `sys.path` at runtime to dynamically load modules from arbitrary disk locations.' 
      },
      { 
        title: '4. __name__ == "__main__"', 
        beginner: 'When you import your custom `helper.py` file, Python runs all the code inside it instantly. To stop it from running tests or printing things during an import, hide that code under `if __name__ == "__main__":`. It acts as a shield!', 
        advanced: 'The global `__name__` variable is automatically assigned the string `"__main__"` if the script is executed directly by the terminal. If the script is loaded via an import statement, `__name__` is assigned the module\'s actual filename. This structural guard is mandatory for creating files that act as both reusable libraries and standalone executable scripts.' 
      },
      { 
        title: '5. Packages & __init__.py', 
        beginner: 'When your project gets huge, you put files inside folders. But Python won\'t look inside folders unless you give it permission! Adding a blank file named `__init__.py` inside a folder tells Python, "Treat this entire folder as one giant toolbox (called a Package)!"', 
        advanced: 'The `__init__.py` file signifies to the import system that the directory should be treated as a Python Package. It can also be used to define the package\'s public API by importing specific classes into the top level, or to execute package-wide initialization code when the package is first imported.' 
      }
    ],
    { 
      title: 'The Password Generator & Custom Module', 
      intro: 'Let\'s leverage Python\'s built-in standard library to build a secure password creator, and then learn how to save it as a reusable custom module using terminal commands.', 
      steps: [
        'Open your normal system terminal (do not start the python >>> REPL yet).',
        'Create a new file using a terminal text editor (like `nano gen.py` on Mac/Linux or `notepad gen.py` on Windows).',
        'Inside the file, type: `import random, string` and press Enter.',
        'Type: `def make_pwd(length=12):` and press Enter.',
        'Type: `    pool = string.ascii_letters + string.digits` and press Enter.',
        'Type: `    return "".join(random.choices(pool, k=length))` and press Enter.',
        'Add the shield at the bottom: `if __name__ == "__main__":` and press Enter.',
        'Type: `    print(make_pwd())` and press Enter. Save and close the file!',
        'Back in your normal terminal, run it directly: `python gen.py`. You will see a random password print out!',
        'Now, open the Python REPL by typing `python`. Type `import gen` and press Enter. Notice it does NOT print a password because of the shield!',
        'Type `gen.make_pwd(20)` to use your custom module\'s tool to generate a 20-character password!'
      ], 
      goal: 'You successfully imported standard library modules, authored a custom reusable module, and utilized the __main__ execution guard.' 
    },
    [
      q('Why is it dangerous to use a wildcard import like `from math import *` in a large project?', ['It forces the computer to restart', 'It silently dumps every variable from that module into your file, potentially overwriting your own custom variables with the same names', 'It triggers a firewall alert', 'It prevents the code from running on Mac computers'], 1, 'Wildcard imports heavily pollute the global namespace, causing naming collisions and making the origin of functions completely untraceable for linters and developers. **Why others are wrong:** It does not restart the computer, trigger firewalls, or block specific OS platforms. It is purely a namespace hygiene issue.'),
      q('Where does Python look first when you type an `import` statement for a custom file?', ['The official Python website server', 'The exact local folder where your main script is currently running (sys.path index 0)', 'The computer\'s trash bin', 'The C: drive root'], 1, 'Python always prioritizes the current working directory (index 0 of `sys.path`) before scanning system-wide installation libraries in `site-packages`. **Why others are wrong:** It does not search the internet for local imports. It ignores the trash bin and root drives unless explicitly added to `sys.path`.'),
      q('What does `if __name__ == "__main__":` actually do?', ['It converts all text to uppercase', 'It acts as a shield, ensuring the code underneath it only runs if the file is executed directly, NOT if it is imported by another file', 'It connects the code to the main internet router', 'It deletes the main file'], 1, 'This structural block protects executable script logic from firing automatically when the file is imported as a library component, because `__name__` evaluates to the filename during imports, not `"__main__"`. **Why others are wrong:** It has no effect on text casing, network routing, or file deletion.'),
      q('If you type `import datetime as dt`, how must you call the module\'s functions later in the code?', ['datetime.function()', 'dt.function()', 'function()', 'datetime.dt.function()'], 1, 'The `as` keyword assigns an alias; you must strictly use that new aliased namespace (`dt`) to access the module\'s internal contents. The original name `datetime` is not bound in the local namespace. **Why others are wrong:** `datetime` is not available. `function()` lacks the namespace prefix. `datetime.dt` is invalid syntax.'),
      q('What is the purpose of an `__init__.py` file inside a project folder?', ['It initializes the computer\'s hardware', 'It tells Python to treat the folder as an importable Package and can define the public API', 'It deletes old cache files', 'It encrypts the folder'], 1, 'The `__init__.py` file signifies to the import system that the directory should be treated as a Python Package, allowing you to import modules from within that folder structure. **Why others are wrong:** It does not touch hardware, delete caches, or encrypt files. It is strictly a namespace and import-system marker.')
    ],
    ['Use import statements at the top of your file to pull in tools and manage namespaces.', 'Aliasing with the `as` keyword keeps long module names clean and prevents collisions.', 'Avoid wildcard (*) imports to protect your variable names and enable static analysis.', 'Always use the `__name__ == "__main__"` shield when building custom reusable files.', 'Use `__init__.py` to organize massive projects into importable folder Packages.']
  ),

  L('py-10', 10, 'Virtual Environments & pip', '🛡️',
    '*If you want to use a big terminal, use your CMD. Full guide is in Lesson 1.*\n\n🛡️ **Philosophy:** "It works on my machine" is the most infamous phrase in software engineering. When you build multiple projects, their external dependencies will eventually clash. Virtual environments allow you to create isolated, pristine bubbles for each project, ensuring their external libraries never interfere with each other. Mastering environment isolation is the hallmark of a professional developer who builds reproducible, deployable systems.',
    [
      { 
        title: '1. What is pip?', 
        beginner: '`pip` (Pip Installs Packages) is Python\'s official app store downloader. It allows you to download code written by other people from the internet straight into your project. Need to build a web scraper? Just type `pip install requests` in your terminal!', 
        advanced: 'Pip connects directly to PyPI (The Python Package Index). It handles complex dependency resolution, ensuring that if package A requires package B to run, both are downloaded, compiled (if necessary), and mapped correctly without manual intervention. It primarily downloads pre-compiled binary "wheels" for speed, falling back to source distributions (sdists) if needed.' 
      },
      { 
        title: '2. The Dependency Nightmare', 
        beginner: 'Imagine Project 1 needs version 1.0 of a library, but Project 2 needs version 2.0. If you install them globally on your computer, one project will break! This is why you should never install packages directly onto your main system.', 
        advanced: 'Global environment pollution causes unrecoverable application rot and "dependency hell." Managing dependencies strictly through isolated project-level boundaries is a mandatory requirement for stable deployment, CI/CD pipeline integration, and ensuring that security patches in one project don\'t accidentally break another.' 
      },
      { 
        title: '3. Virtual Environments (venv)', 
        beginner: 'A virtual environment (`venv`) is an isolated bubble folder. When you create one and "activate" it, your terminal pretends it\'s a brand new, empty Python installation. Anything you `pip install` while the bubble is active stays securely trapped inside that folder!', 
        advanced: 'Executing `python -m venv .venv` generates an isolated binary tree containing a local Python executable and a `site-packages` directory. Activating the environment manipulates your system\'s `$PATH` environment variable, forcefully prioritizing the localized binaries over the global OS binaries for that specific terminal session.' 
      },
      { 
        title: '4. requirements.txt', 
        beginner: 'When you share your code with a friend, you don\'t send them your massive downloaded package folder. Instead, you create a text list of the tools you used (`pip freeze > requirements.txt`). Your friend can then install the exact same tools instantly using that list!', 
        advanced: 'The requirements file ensures deterministic builds. A proper deployment architecture requires strict version pinning (e.g., `requests==2.31.0`) to guarantee that future updates to third-party libraries do not introduce breaking API changes. Modern workflows often use tools like `pip-tools` or `Poetry` to manage complex dependency trees and lockfiles.' 
      },
      { 
        title: '5. The site-packages Directory', 
        beginner: 'When you install a package, where does it actually go? It goes into a special folder called `site-packages`. In a virtual environment, this folder is safely tucked inside your project\'s bubble. In the global system, it\'s buried deep in your computer\'s Python installation folders.', 
        advanced: 'The `site-packages` directory is the target destination for all `pip install` operations. It is automatically appended to `sys.path` by the Python interpreter at startup. Inspecting this directory reveals the actual source code or compiled binaries of every third-party library your application relies on.' 
      }
    ],
    { 
      title: 'Creating the Bubble', 
      intro: 'Let\'s create a protected sandbox folder, activate the bubble, and install a powerful external library safely.', 
      steps: [
        'Open your normal system terminal (do not start the python >>> REPL yet).',
        'Create a new project folder and navigate inside it: Type `mkdir my_project` then `cd my_project`.',
        'Build the bubble folder: Type `python -m venv .venv` and hit Enter. Wait a few seconds for it to build the local Python tree.',
        'Activate the bubble! On Windows: Type `.venv\\Scripts\\activate`. On Mac/Linux: Type `source .venv/bin/activate`.',
        'Look at your terminal prompt—you should now see `(.venv)` at the beginning of the line! Your `$PATH` has been rerouted.',
        'Install a package safely: Type `pip install requests` and watch it download the wheel into your isolated `site-packages` folder.',
        'Generate your recipe: Type `pip freeze > requirements.txt` to save the exact versions.',
        'To exit the bubble and return to normal, simply type the command `deactivate`.'
      ], 
      goal: 'You successfully scaffolded an isolated environment, rerouted your terminal paths, installed external packages safely, and generated a deterministic requirements file.' 
    },
    [
      q('What is the primary danger of installing all Python packages globally on your main operating system?', ['It costs a lot of money', 'Different projects requiring different versions of the same library will overwrite each other, causing projects to break permanently', 'The computer will run out of electricity', 'The internet connection will sever'], 1, 'Global pollution leads to dependency conflicts. Project A and Project B cannot easily share the same global `site-packages` namespace if they rely on conflicting library versions (e.g., v1.0 vs v2.0). **Why others are wrong:** PyPI packages are free. It does not affect hardware power or network connectivity.'),
      q('What visual cue in your terminal indicates that a virtual environment has been successfully activated?', ['The terminal turns green', 'A prefix, typically `(.venv)`, appears at the very beginning of your terminal input line', 'A python logo pops up on screen', 'The terminal deletes all previous text'], 1, 'Activation scripts modify the terminal prompt variable (PS1) to display the name of the active environment bubble as a visual confirmation that your `$PATH` is currently rerouted. **Why others are wrong:** It does not change terminal color by default, pop up GUI logos, or delete history.'),
      q('How do you generate a text file listing every package currently installed inside your virtual environment?', ['pip list-all > text.txt', 'python download.txt', 'pip freeze > requirements.txt', 'export packages'], 2, 'The `pip freeze` command outputs a cleanly formatted list of all installed packages and their exact pinned version numbers, redirecting it into a `requirements.txt` file for deterministic builds. **Why others are wrong:** `pip list` shows a human-readable table but isn\'t formatted for installation. The other commands do not exist.'),
      q('What does `pip` stand for and what is its primary function?', ['Python Internet Protocol, for networking', 'Pip Installs Packages, the official tool for securely downloading and installing external libraries from PyPI', 'Personal Integer Parser, for math', 'Program Interface Panel, for UI'], 1, 'Pip is the official, built-in package manager used to query, download, and resolve external module dependencies from the Python Package Index (PyPI). **Why others are wrong:** It is not a networking protocol, math parser, or UI panel. It strictly manages Python software packages.'),
      q('Where do packages actually live on your hard drive after you run `pip install`?', ['In your Downloads folder', 'In the `site-packages` directory of the active Python environment', 'On the desktop', 'In the Recycle Bin'], 1, 'Pip installs all source code and compiled wheels directly into the `site-packages` directory, which the Python interpreter automatically adds to `sys.path` at runtime. **Why others are wrong:** It does not use standard user folders like Downloads or Desktop. It integrates directly into the Python environment\'s internal library structure.')
    ],
    ['Never pip install tools globally; always use an isolated project bubble to prevent dependency hell.', 'Use `python -m venv` to create a clean virtual environment folder with its own `site-packages`.', 'Look for the `(.venv)` prompt to confirm your terminal `$PATH` is successfully rerouted.', 'Use `pip freeze > requirements.txt` to share your exact package list for deterministic builds.', 'Understand that pip resolves complex dependency trees automatically from PyPI.']
  ),

  L('py-11', 11, 'Comprehensions & Generators', '⚡',
    '*If you want to use a big terminal, use your CMD. Full guide is in Lesson 1.*\n\n⚡ **Philosophy:** Writing "Pythonic" code means leaning into the language\'s unique, highly optimized features rather than writing C-style loops. Comprehensions allow you to map and filter data structures in a single, highly readable line, while generators let you handle infinitely massive datasets without running out of memory. This is the balance between elegance and raw computational efficiency.',
    [
      { 
        title: '1. List Comprehensions', 
        beginner: 'Instead of writing a bulky 4-line `for` loop just to edit a list of items, you can write it all inside one pair of brackets! `[x * 2 for x in numbers]` instantly creates a brand new list where every number is doubled. It is clean, fast, and very popular.', 
        advanced: 'List comprehensions execute using optimized internal C-code routines, making them measurably faster than standard `for` loops utilizing `.append()`. They cleanly map to standard map/filter functional paradigms without the overhead of lambda functions, and the resulting list is fully materialized in RAM.' 
      },
      { 
        title: '2. Conditional Filtering & Ternary', 
        beginner: 'You can add an `if` statement to the very end of a comprehension to filter out bad data instantly. Writing `[name for name in users if name != "admin"]` creates a new list cleanly ignoring the admin. You can also use "if/else" at the front to change values instead of filtering them!', 
        advanced: 'The standard conditional syntax `[expression for item in iterable if condition]` evaluates the filter first. If you need ternary assignment (changing the value based on a condition), the logic moves to the front: `[x if x > 0 else 0 for x in sequence]`. Mixing these up is a common source of `SyntaxError` for beginners.' 
      },
      { 
        title: '3. The `yield` Keyword (Generators)', 
        beginner: 'A normal function uses `return` to hand back a complete list. But what if the list has a billion items? Your computer would crash! Instead, use `yield`. It hands back one item, pauses the function, and waits. It generates items on-the-fly, saving massive amounts of memory.', 
        advanced: 'Generators implement the Iterator protocol (`__iter__` and `__next__`). Because they lazily evaluate and maintain their internal local state (suspended stack frames) between `yield` calls, they represent $O(1)$ memory consumption regardless of how infinitely large the dataset sequence is. They raise `StopIteration` when exhausted.' 
      },
      { 
        title: '4. Generator Expressions', 
        beginner: 'If you swap the square brackets of a List Comprehension `[...]` for round parentheses `(...)`, you create a Generator Expression! It looks identical, but instead of building the whole list at once, it becomes a lazy machine that only calculates the next item when you ask for it.', 
        advanced: 'Always prefer generator expressions `(x**2 for x in data)` when piping sequences directly into aggregate functions like `sum()`, `max()`, or `any()`. It avoids materializing redundant intermediate lists in memory, drastically reducing the garbage collection overhead and peak RAM footprint.' 
      },
      { 
        title: '5. Dict & Set Comprehensions', 
        beginner: 'Comprehensions aren\'t just for lists! You can use curly brackets `{}` to build Dictionaries and Sets in a single line. `{k: v for k, v in pairs}` builds a dictionary instantly, while `{x for x in data if x > 0}` builds a set of unique positive numbers!', 
        advanced: 'Dictionary comprehensions `{k: v for ...}` are highly optimized for building lookup tables and transposing data structures. Set comprehensions `{x for ...}` leverage the underlying hash table to instantly deduplicate massive streams of data during the iteration phase, combining filtering and uniqueness enforcement in a single C-level pass.' 
      }
    ],
    { 
      title: 'The One-Line Data Filter & Lazy Pipeline', 
      intro: 'Let\'s use Pythonic comprehensions to clean up a messy data array, build a dictionary, and manually step through a lazy generator.', 
      steps: [
        'Open your terminal REPL (`>>>`).',
        'Create a messy list: `data = ["apple", "BANANA", "cherry", "DATE"]`.',
        'Write a list comprehension to filter and capitalize: `clean = [f.capitalize() for f in data if f.islower()]`. Print `clean` to see `["Apple", "Cherry"]`.',
        'Now build a dictionary! Create pairs: `pairs = [("a", 1), ("b", 2)]`.',
        'Use a dict comprehension: `my_dict = {k: v for k, v in pairs}`. Print `my_dict` to see `{"a": 1, "b": 2}`.',
        'Now try a lazy generator: Type `gen = (x * 10 for x in range(3))` and hit Enter. Notice it prints `<generator object...>`, not a list!',
        'Type `next(gen)` to get 0. Type `next(gen)` again to get 10. Type it one last time to get 20.',
        'Type `next(gen)` one more time and watch it throw a `StopIteration` error, proving the lazy stream is completely exhausted!'
      ], 
      goal: 'You successfully condensed multi-line loop/filter logic into single-line comprehensions for lists, dicts, and sets, and manually stepped through a lazy generator object.' 
    },
    [
      q('Why is a List Comprehension generally preferred over a standard `for` loop that uses `.append()`?', ['It connects to databases faster', 'It is more readable and executes faster because it utilizes optimized underlying C-level routines', 'It allows you to skip writing variables', 'It creates tuples instead of lists'], 1, 'Comprehensions are syntactically concise and execute faster because they bypass the continuous Python-level function-call overhead of `.append()`, pushing the loop mechanics down to optimized C-code. **Why others are wrong:** It does not connect to databases. You still use iteration variables. It creates lists, not tuples.'),
      q('What is the core functional difference between `yield` and `return`?', ['`return` pauses the function, `yield` ends it entirely', '`return` only works with numbers, `yield` works with text', '`return` terminates the function and passes data, `yield` passes data but suspends the function state so it can resume later', 'They are identical in every way'], 2, '`yield` turns a function into a lazy generator, preserving local state variables and the instruction pointer so execution can resume exactly where it left off on the next `__next__()` call. **Why others are wrong:** `return` destroys the stack frame. `yield` works with any data type. They are fundamentally different mechanisms.'),
      q('How do you quickly turn a List Comprehension into a memory-saving Generator Expression?', ['Change the square brackets `[...]` to round parentheses `(...)`', 'Add the word `lazy` to the front', 'Change the `for` to a `while`', 'Wrap it in quotation marks'], 0, 'Swapping brackets for parentheses changes the immediate list construction into a lazy generator expression that yields items one by one. **Why others are wrong:** Adding words or changing keywords causes SyntaxErrors. Quotation marks turn it into a string.'),
      q('If you run `sum( x for x in range(1000000) )`, how much memory does the generator expression consume?', ['1 million bytes of RAM', 'Barely any, because it only calculates and holds one number in memory at a time ($O(1)$)', '1 Gigabyte', 'It crashes immediately'], 1, 'Generators evaluate lazily; they yield a single value to the `sum()` function and discard it before calculating the next, keeping memory footprint flat at $O(1)$ regardless of the range size. **Why others are wrong:** It does not materialize the million items in RAM (that would be a list comprehension `[...]`), nor does it crash.'),
      q('What is the correct syntax to build a Dictionary using a comprehension?', ['`[k: v for k, v in pairs]`', '`{k: v for k, v in pairs}`', '`(k: v for k, v in pairs)`', '`dict(k=v for k, v in pairs)`'], 1, 'Dictionary comprehensions use curly brackets `{}` with a key-value colon separator `k: v` inside the loop expression. **Why others are wrong:** Square brackets create lists. Parentheses create generators (which cannot yield key-value pairs directly like this). The `dict()` constructor syntax is different and less efficient for this specific mapping pattern.')
    ],
    ['Use list comprehensions to write clean, fast, single-line loops optimized at the C-level.', 'Filter data instantly by adding an `if` statement to the end of a comprehension.', 'Use `yield` instead of `return` to build massive sequences without crashing your RAM ($O(1)$ memory).', 'Use round parentheses `(...)` to make comprehensions lazy and memory-efficient.', 'Leverage `{}` for lightning-fast Dictionary and Set comprehensions to build lookup tables and deduplicate data.']
  ),

  L('py-12', 12, 'Decorators & Advanced Functions', '🎁',
    '*If you want to use a big terminal, use your CMD. Full guide is in Lesson 1.*\n\n🎁 **Philosophy:** Decorators are Python\'s gateway to Metaprogramming and Aspect-Oriented Programming (AOP). They allow you to dynamically alter or enhance the behavior of a function without actually modifying the function\'s internal source code. By mastering decorators, you learn how to write highly reusable, cross-cutting concerns like logging, timing, authentication, and caching that can be snapped onto any function with a single line of code.',
    [
      { 
        title: '1. Functions are Objects', 
        beginner: 'In Python, functions are just data objects. You can save a function to a variable (`my_var = print`), pass a function as an argument into another function, or even return a function from inside another function! They are treated exactly like numbers or strings.', 
        advanced: 'Python treats functions as first-class citizens. This means they are instances of the generic `function` object, capable of carrying custom attributes (e.g., `my_func.custom_tag = True`) and being injected dynamically into complex higher-order routing pipelines and callback registries.' 
      },
      { 
        title: '2. Inner Functions (Closures)', 
        beginner: 'You can define a new function completely hidden inside another function. This inner function has a special memory trick called a "closure"—it can remember and access the variables from the outer function even after the outer function has finished running and been deleted!', 
        advanced: 'Closures bind local variables from the enclosing lexical scope into the inner function\'s namespace via hidden "cell" objects (accessible via the `__closure__` attribute). This allows persistent state retention and data hiding without requiring class instantiation or polluting the global namespace.' 
      },
      { 
        title: '3. The Decorator Concept', 
        beginner: 'A decorator is simply a function that takes another function, adds some extra behavior (like printing a timestamp), and gives you back the newly improved function. It is like putting a plain phone inside a protective, waterproof case. The phone still works, but now it has new features!', 
        advanced: 'Decorators implement the structural Wrapper pattern. They intercept the original function reference, replace it with a newly synthesized closure wrapper, and map the original execution block securely inside the wrapper scope. This allows pre-processing (validation) and post-processing (caching) of the original function\'s inputs and outputs.' 
      },
      { 
        title: '4. The @ Syntax', 
        beginner: 'Instead of writing ugly nested code to wrap functions, Python gives us the beautiful `@` symbol. Placing `@timer` directly above `def my_function():` instantly wraps your function inside the timer code automatically when the file loads!', 
        advanced: 'The `@decorator` syntactic sugar explicitly executes `my_func = decorator(my_func)` at module load time. Always utilize `functools.wraps` inside your decorators to explicitly preserve the original function\'s identity, docstrings, and name signatures, which would otherwise be overwritten by the wrapper\'s metadata.' 
      },
      { 
        title: '5. Decorators with Arguments', 
        beginner: 'What if you want to tell your decorator how many times to repeat a function? You can pass arguments to decorators! It requires building a "decorator factory"—a function that builds the actual decorator, which then builds the wrapper. It\'s like a Russian nesting doll of functions!', 
        advanced: 'To create a decorator that accepts arguments (e.g., `@retry(times=3)`), you must implement a three-level nested function structure. The outer function captures the decorator arguments, the middle function captures the target function, and the inner wrapper function executes the logic. Alternatively, `functools.partial` or class-based decorators with `__call__` can manage this state.' 
      }
    ],
    { 
      title: 'Building a Speed Tracker & Metadata Inspector', 
      intro: 'Let\'s write a custom decorator from scratch that automatically times how long it takes for any function to execute, and learn how to protect the function\'s original name.', 
      steps: [
        'Open your terminal REPL (`>>>`).',
        'Import the tools: `import time` and `from functools import wraps`.',
        'Create the master decorator: `def speed_test(func):` and press Enter.',
        'Inside it, add the metadata shield: Type 4 spaces, then `@wraps(func)` and press Enter.',
        'Create the wrapper: Type 4 spaces, then `def wrapper(*args, **kwargs):` and press Enter.',
        'Inside the wrapper, record start time: Type 8 spaces, then `start = time.time()`.',
        'Execute the target function: Type 8 spaces, then `result = func(*args, **kwargs)`.',
        'Record end time and print: Type 8 spaces, then `print(f"Time: {time.time() - start}")`.',
        'Return the result: Type 8 spaces, then `return result`.',
        'End the decorator block by returning the wrapper: Type 4 spaces, then `return wrapper`. Press Enter on an empty line.',
        'Now use it! Type `@speed_test`, and on the next line type `def slow_add(a, b): time.sleep(1); return a + b`.',
        'Call `print(slow_add(5, 5))` to see the result AND the time. Then type `print(slow_add.__name__)` to prove the `@wraps` shield kept the original name!'
      ], 
      goal: 'You successfully authored a higher-order wrapper function, handled dynamic arguments with *args/**kwargs, applied it using syntactic sugar, and preserved function metadata.' 
    },
    [
      q('What does it mean when we say functions are "first-class objects" in Python?', ['Functions must be written at the absolute top of the file', 'Functions can be assigned to variables, passed as arguments, and returned from other functions just like standard data', 'Functions are always processed faster than classes', 'Functions require an internet connection'], 1, 'Treating functions as first-class citizens allows for high-level functional programming, meaning they can be passed, modified, and stored dynamically like integers or strings. **Why others are wrong:** Placement in the file does not define first-class status. They are not inherently faster than classes. They do not require network access.'),
      q('What is a "closure" in Python?', ['A secure way to close an open text file', 'An inner function that remembers the specific local variables of its parent function, even after the parent function has finished executing', 'A syntax error caused by missing parentheses', 'A tool used to shut down the computer'], 1, 'Closures capture and lock external lexical state inside their own localized namespace via cell objects, allowing inner functions to retain persistent memory without global variables. **Why others are wrong:** It has nothing to do with file I/O, syntax errors, or system shutdowns. It is strictly a scoping and memory retention mechanism.'),
      q('What does placing the `@decorator_name` symbol directly above a function definition actually do?', ['It tells Python to ignore the function', 'It automatically wraps the target function inside the decorator logic right as the file is loaded into memory', 'It converts the function into an email address string', 'It triggers an immediate error'], 1, 'The `@` symbol is syntactic sugar that automatically intercepts the function creation at parse time, passes it to the decorator, and replaces the original variable name with the enhanced wrapper. **Why others are wrong:** It does not ignore the function, create strings, or trigger errors (unless the decorator itself is broken).'),
      q('Why is using `functools.wraps` highly recommended when building custom decorators?', ['It makes the code run 10x faster', 'It encrypts the source code automatically', 'It preserves the original function\'s metadata (like its specific name and documentation strings) which would otherwise be erased by the wrapper', 'It zips the file to save disk space'], 2, 'By default, decorators overwrite the target function\'s identity with the generic wrapper\'s identity (making `__name__` return "wrapper"). `@wraps` cleanly restores the original name, docstrings, and type hints. **Why others are wrong:** It does not affect execution speed, encrypt code, or compress files.'),
      q('If you want to build a decorator that accepts arguments (like `@retry(times=3)`), what structural pattern must you use?', ['A single standard function', 'A three-level nested function structure (a decorator factory)', 'A `while` loop', 'A list comprehension'], 1, 'A decorator with arguments requires a three-level nesting: the outer function captures the arguments (`times=3`), the middle captures the target function, and the inner wrapper executes the logic. **Why others are wrong:** A single function cannot capture both the decorator arguments and the target function simultaneously. Loops and comprehensions are irrelevant to decorator architecture.')
    ],
    ['Python functions are first-class data objects that can be wrapped, passed, and stored.', 'Closures allow hidden inner functions to remember variables from their parents via lexical scoping.', 'Decorators modify behavior dynamically (AOP) without altering the original source code.', 'Use the `@` symbol directly above a function to instantly wrap it at module load time.', 'Always use `functools.wraps` to preserve original function metadata and build 3-level nests for decorators with arguments.']
  ),

 L('py-13', 13, 'Object-Oriented Programming I', '🏗️',
    '*If you want to use a big terminal, use your CMD. Full guide is in Lesson 1.*\n\n🏗️ **Philosophy:** As programs grow, throwing hundreds of random functions and global variables together becomes a chaotic, unmaintainable mess. Object-Oriented Programming (OOP) is the architectural discipline of bundling related data and behaviors together into organized, reusable blueprints called Classes. By modeling your code after real-world entities, you transform fragile scripts into robust, scalable systems that are easy to reason about, test, and extend.',
    [
      { 
        title: '1. Classes vs. Objects', 
        beginner: 'A Class is just a blueprint. If you design a `Car` blueprint, you can\'t drive it. But you can use that blueprint to build an Object: an actual red Ferrari that you can drive. You build one Class to create thousands of unique Objects!', 
        advanced: 'Classes define memory structures and method resolution orders (MRO). Instantiating a class invokes its constructor, allocating contiguous memory for the object\'s specific state (`__dict__`) while maintaining references to the shared class-level namespace.' 
      },
      { 
        title: '2. The __init__ Method & Object Birth', 
        beginner: 'When you build a new object from your blueprint, Python instantly runs a special setup function called `__init__`. This is where you assign the object\'s initial properties, like giving a new user a `name` and starting their `score` at 0.', 
        advanced: '`__init__` is the initializer, not the true memory allocator (which is `__new__`). It mutates the newly allocated object state before returning it to the caller. Failing to initialize variables here and instead putting them at the class level leads to shared class-attribute pollution across all instances.' 
      },
      { 
        title: '3. The "self" Keyword & Method Binding', 
        beginner: 'Every function inside a class must have the word `self` as its first argument. `self` is how the object talks to itself! If the object wants to change its own score, it must explicitly type `self.score = 100`.', 
        advanced: '`self` is a strong naming convention for the active instance reference dynamically passed by the interpreter during bound method calls. When you call `obj.method()`, Python\'s descriptor protocol implicitly translates this into `Class.method(obj)` at runtime, injecting the instance memory address as the first positional argument.' 
      },
      { 
        title: '4. Methods vs. Attributes', 
        beginner: 'Attributes are things an object HAS (like `self.color = "Red"`). Methods are things an object can DO (like `def honk(self):`). Think of attributes as nouns, and methods as verbs.', 
        advanced: 'Attributes map to the instance\'s internal dictionary (`__dict__`), while methods are bound functions stored in the class dictionary. Python\'s descriptor protocols handle the seamless translation between the underlying unbound function and the bound instance method.' 
      },
      { 
        title: '5. Class Attributes vs. Instance Attributes', 
        beginner: 'Class attributes are like a poster on the classroom wall—every student shares the exact same one. Instance attributes are like your personal notebook—only you can see and change yours. If you change a shared class attribute, it changes for everyone!', 
        advanced: 'Class attributes are stored in the class\'s `__dict__` and shared across all instances. Instance attributes are stored in the instance\'s `__dict__`. Mutating a mutable class attribute (like a list or dictionary) is a catastrophic anti-pattern, as it pollutes the state of all instantiated objects simultaneously.' 
      }
    ],
    { 
      title: 'Building a Robot Factory & Inspecting Memory', 
      intro: 'Let\'s write our very first Class, use it to spawn a customized Robot object, inspect its hidden memory dictionary, and command it to speak.', 
      steps: [
        'Open your terminal REPL (look for the `>>>` prompt).',
        'Define the blueprint: Type `class Robot:` and press `Enter`. The prompt changes to `...`.',
        'Add the setup function (indent exactly 4 spaces!): Type `def __init__(self, name):` and press `Enter`.',
        'Assign the attributes (indent exactly 8 spaces!): Type `self.name = name` and press `Enter`.',
        'Type 8 spaces, then `self.battery = 100` and press `Enter`.',
        'Add a behavior at the 4-space indent level: Type `def speak(self):` and press `Enter`.',
        'Type 8 spaces, then `print(f"I am {self.name}. Battery at {self.battery}%")` and press `Enter`.',
        'CRITICAL STEP: Press `Enter` on a completely empty line to close the class block. The `>>>` prompt returns.',
        'Spawn an object! Type `r1 = Robot("Wall-E")` and press `Enter`.',
        'Inspect its internal memory dictionary by typing `print(r1.__dict__)`. You will see exactly where its data lives: `{"name": "Wall-E", "battery": 100}`!',
        'Now make it talk: Type `r1.speak()` and watch it execute its bound method!'
      ], 
      goal: 'You successfully transitioned from procedural scripts into stateful Object-Oriented design, defined a class blueprint, instantiated a functional object, and inspected its underlying memory dictionary.' 
    },
    [
      q('What is the core difference between a Class and an Object?', ['A Class is written in C, an Object is written in Python', 'A Class is a blueprint, an Object is the actual usable item built from that blueprint', 'A Class holds numbers, an Object holds text', 'They are the exact same thing'], 1, 'Classes act as abstract templates defining structure and behavior in memory, while objects are concrete, instantiated manifestations of those templates existing in active RAM. **Why others are wrong:** Both are written in Python (though CPython is C under the hood, the concepts apply to the language level). Classes can hold any data type, not just numbers. They are fundamentally distinct concepts (template vs instance).'),
      q('What is the primary purpose of the `__init__` method?', ['To delete the object from memory', 'To securely initialize the object\'s specific starting data right when it is created', 'To connect the object to the internet', 'To print error messages'], 1, 'The `__init__` (initializer) method is automatically triggered upon instantiation to establish the object\'s foundational instance variables and starting state inside its `__dict__`. **Why others are wrong:** It does not delete memory (that is `__del__`), connect to networks, or strictly handle errors.'),
      q('Why is the `self` keyword strictly required inside class methods?', ['To pass password checks', 'It explicitly tells Python to apply the changes to this specific object instance, rather than a generic global variable', 'It makes the code run infinitely', 'It prevents other files from reading the class'], 1, '`self` binds the method to the specific calling instance, allowing the method to read and write to that exact object\'s distinct memory address. **Why others are wrong:** It has nothing to do with security, infinite loops, or file access. It is purely a memory reference mechanism.'),
      q('If an object has a variable `self.speed = 50`, what is that conceptually known as?', ['An Attribute (a noun/property)', 'A Method (a verb/action)', 'A Class', 'An Exception'], 0, 'Instance variables tracking state (like color, speed, or health) are known as Attributes, while the functions dictating actions are Methods. **Why others are wrong:** It is not a method (which would be `def speed(self):`), nor a class or exception.'),
      q('What happens if you define a mutable list as a Class Attribute (e.g., `class Car: parts = []`) and then append to it via one object?', ['Only that specific object gets the new part', 'The program crashes instantly', 'The new part is added to the shared list, meaning ALL objects of that class now have the new part', 'Python automatically converts the list into a tuple'], 2, 'Class attributes are stored in the class\'s `__dict__` and shared across all instances. Mutating a mutable class attribute pollutes the state of all instantiated objects simultaneously. **Why others are wrong:** It does not isolate to one object, crash, or auto-convert to a tuple. This is why mutable defaults should always be instance attributes initialized inside `__init__`.')
    ],
    ['A Class is a blueprint; an Object is the actual item you build from it.', 'The __init__ method sets up your object\'s instance dictionary the moment it is born.', 'Always use the self keyword so the object can interact with its own specific memory address.', 'Attributes are nouns (properties stored in __dict__); Methods are verbs (actions).', 'Never use mutable data types (like lists) as shared Class Attributes.']
  ),

  L('py-14', 14, 'Object-Oriented Programming II', '🧬',
    '*If you want to use a big terminal, use your CMD. Full guide is in Lesson 1.*\n\n🧬 **Philosophy:** Once you have basic classes, you unlock the power of code evolution. Inheritance allows you to share logic between blueprints without copy-pasting code, creating a genetic family tree of objects. However, true mastery lies in knowing when to use Inheritance (an "is-a" relationship) versus Composition (a "has-a" relationship) to build systems that are flexible, testable, and resistant to brittle architectural collapse.',
    [
      { 
        title: '1. Inheritance & The MRO', 
        beginner: 'If you want to build a `Drone` class, and you already have a `Robot` class, you don\'t have to start from scratch. `class Drone(Robot):` tells Python that the Drone should instantly inherit all the weapons and batteries the Robot already has!', 
        advanced: 'Inheritance represents an "is-a" structural relationship. Python supports multiple inheritance, resolving parent attribute lookups dynamically via the C3 Linearization algorithm. You can inspect this exact lookup path at runtime by calling `Class.mro()` (Method Resolution Order).' 
      },
      { 
        title: '2. The super() Function', 
        beginner: 'When a child class overrides its parent\'s setup, it still needs the parent\'s basic tools. `super().__init__()` acts as a direct phone line to the parent class, ensuring the parent\'s setup code runs alongside the child\'s new code.', 
        advanced: 'The `super()` proxy object cleanly routes method calls to the next class in the Method Resolution Order (MRO). This prevents redundant executions and structural breaks in complex multi-inheritance architectures, enabling cooperative multiple inheritance patterns.' 
      },
      { 
        title: '3. Overriding & Polymorphism', 
        beginner: 'If a parent `Bird` class has a `def speak(): print("Chirp")`, a child `Duck` class can simply rewrite its own `def speak(): print("Quack")`. The child\'s unique code completely overrides the parent\'s default behavior!', 
        advanced: 'Method overriding leverages Polymorphism. Because Python uses Duck Typing, the caller does not care if the object is a Bird or a Duck, only that the resulting object implements the requested interface successfully at runtime. This adheres to the Liskov Substitution Principle.' 
      },
      { 
        title: '4. Dunder (Magic) Methods', 
        beginner: 'Methods with double-underscores (`__`) are Python\'s secret system hooks. By defining `__str__(self):`, you can control exactly what prints to the screen when someone types `print(my_object)`, making it readable instead of ugly computer gibberish.', 
        advanced: 'Dunder methods overload fundamental operator behavior. `__add__` controls the `+` operator, `__len__` controls `len()`, and `__eq__` controls `==`. Note the distinction: `__str__` is for readable user output, while `__repr__` is for unambiguous developer debugging output.' 
      },
      { 
        title: '5. Composition vs. Inheritance', 
        beginner: 'Instead of a Car *being* an Engine (Inheritance), a Car *has* an Engine (Composition). It\'s like building with Lego blocks instead of genetic cloning. You just pass an Engine object into the Car\'s setup!', 
        advanced: 'Inheritance creates tight, fragile coupling (the "Gorilla holding the banana" problem). Composition favors assembling small, focused objects into larger systems, adhering to the Single Responsibility Principle. It makes unit testing vastly easier because you can swap out real components for mock objects.' 
      }
    ],
    { 
      title: 'The Flying Robot & Memory Inspection', 
      intro: 'Let\'s inherit from the Robot blueprint, give the new subclass the unique ability to fly, customize how it prints to the screen, and inspect its Method Resolution Order.', 
      steps: [
        'Open your terminal REPL (`>>>`).',
        'Define a parent: Type `class Robot:` and press `Enter`.',
        'Type 4 spaces, then `def move(self): print("Rolling...")` and press `Enter`.',
        'Press `Enter` on an empty line to close the parent block.',
        'Create a child class: Type `class Drone(Robot):` and press `Enter`.',
        'Type 4 spaces, then `def fly(self): print("Taking off!")` and press `Enter`.',
        'Type 4 spaces, then `def move(self): print("Flying...")` and press `Enter`.',
        'Type 4 spaces, then `def __str__(self): return "I am a high-tech Drone."` and press `Enter`.',
        'Press `Enter` on an empty line to close the child block.',
        'Spawn it: Type `d = Drone()` and press `Enter`.',
        'Call the new method: `d.fly()`. Check the overridden method: `d.move()`.',
        'Type `print(d)` to see your magic `__str__` string!',
        'Inspect the genetics: Type `print(Drone.mro())` to see exactly how Python searches for methods!'
      ], 
      goal: 'You successfully implemented inheritance, extended functionality, overridden default behaviors, customized dunder outputs, and inspected the C3 Method Resolution Order.' 
    },
    [
      q('What is the primary benefit of Class Inheritance?', ['It makes code run asynchronously', 'It eliminates repetitive copy-pasting by allowing a child class to share and reuse the logic established in a parent class', 'It forces all variables to be strings', 'It prevents errors globally'], 1, 'Inheritance enforces the DRY (Don\'t Repeat Yourself) principle, centralizing shared logic in the parent class while allowing targeted specialization in the subclasses. **Why others are wrong:** It does not affect async execution, force string types, or magically prevent all errors.'),
      q('If a subclass has its own `__init__` setup, how does it properly trigger the parent class\'s setup as well?', ['By typing `run_parent()`', 'By deleting its own `__init__`', 'By utilizing the `super().__init__()` proxy function inside its own setup block', 'Parents cannot be triggered'], 2, 'The `super()` function delegates method resolution up the inheritance chain, safely executing parent initializations without hardcoding the parent\'s direct class name. **Why others are wrong:** `run_parent()` is not a Python keyword. Deleting `__init__` removes the child\'s custom setup. Parents can absolutely be triggered.'),
      q('If both the parent class and the child class have a method named `def attack(self):`, what happens when the child object calls it?', ['Python crashes with a duplicate name error', 'Both attack methods fire simultaneously', 'The child\'s custom attack method completely overrides and replaces the parent\'s version', 'The parent\'s version runs, ignoring the child'], 2, 'Subclasses structurally override parent definitions. When the runtime executes a method lookup, it checks the child\'s dictionary first (via the MRO), firing the localized logic. **Why others are wrong:** It does not crash, fire both simultaneously, or ignore the child.'),
      q('What does defining the special `__str__(self):` magic method allow you to do?', ['Turn all text into strings automatically', 'Control the exact, readable text output that appears when someone uses `print()` on your object', 'Connect to the string module', 'Prevent the object from being deleted'], 1, 'The `__str__` dunder method overloads the default system representation, replacing the raw memory address output with a clean, human-readable string representation. **Why others are wrong:** It does not auto-convert types, connect to modules, or prevent garbage collection.'),
      q('Why do senior architects often prefer "Composition" (giving an object a component) over deep "Inheritance" (making an object a subclass)?', ['Composition makes the code run 10x faster', 'Inheritance creates tight, fragile coupling, while Composition allows you to assemble small, focused objects that are easier to test and swap out', 'Inheritance is illegal in Python 3', 'Composition uses less RAM'], 1, 'Inheritance creates tight coupling (the "Gorilla holding the banana" problem). Composition favors assembling small, focused objects, adhering to the Single Responsibility Principle and making unit testing vastly easier. **Why others are wrong:** It does not inherently change execution speed or RAM usage, and inheritance is perfectly legal.')
    ],
    ['Inheritance creates a Parent-Child relationship, letting you reuse code instantly via the MRO.', 'Use super() to safely call a parent\'s methods from inside the child without hardcoding names.', 'Subclasses can Override parent methods by simply reusing the exact same function name.', 'Dunder methods (like __str__ and __repr__) let you secretly hook into standard Python actions.', 'Prefer Composition ("has-a") over deep Inheritance ("is-a") to avoid fragile, tightly-coupled architectures.']
  ),

  L('py-15', 15, 'Type Hinting & Pydantic', '🏷️',
    '*If you want to use a big terminal, use your CMD. Full guide is in Lesson 1.*\n\n🏷️ **Philosophy:** Python\'s dynamic nature is a superpower for rapid prototyping, but a nightmare for massive enterprise systems. Putting text into a variable meant for numbers causes explosive crashes in production. Type Hinting transforms Python from a wild scripting language into a strictly contracted, self-documenting engineering tool. It is the secret to building massive, unbreakable applications where the code editor catches your bugs before you even press "Run".',
    [
      { 
        title: '1. Basic Type Annotations', 
        beginner: 'You can hint what a variable should be by adding a colon. `age: int = 25` tells other developers (and your code editor) that `age` must be an integer. For functions, `def greet(name: str) -> str:` says it takes text and returns text!', 
        advanced: 'Python is fundamentally dynamically typed; standard type hints are strictly ignored by the runtime interpreter. They exist solely as metadata for static analysis tools (like MyPy) and IDE language servers (like Pylance) to enforce structural integrity and enable autocompletion pre-execution.' 
      },
      { 
        title: '2. The typing Module & Generics', 
        beginner: 'What if you have a list, but you want to guarantee it only holds numbers? You can import tools to get specific! Using `List[int]` means a list of integers. `Dict[str, int]` means a dictionary with text keys and number values.', 
        advanced: 'As of Python 3.9+ (PEP 585), standard collections natively support generics (e.g., `list[int]` instead of importing `typing.List`). However, understanding the `typing` module remains mandatory for backwards compatibility and advanced structural patterns like `Callable`, `TypeVar`, and `Any`.' 
      },
      { 
        title: '3. Union, Optional & Modern Syntax', 
        beginner: 'Sometimes a variable can be more than one thing. `Union[int, float]` means it can be a whole number OR a decimal. `Optional[str]` is a lifesaver—it means the variable should be text, but it is also allowed to be totally empty (`None`).', 
        advanced: 'In modern Python (3.10+ via PEP 604), `Union[int, str]` is cleanly syntactically simplified to the bitwise OR operator `int | str`. `Optional[str]` is exactly equivalent to `str | None`. This drastically reduces visual clutter in complex function signatures.' 
      },
      { 
        title: '4. Intro to Pydantic & Runtime Validation', 
        beginner: 'Standard type hints don\'t actually stop bad code from running. That is where external libraries like `Pydantic` come in. It turns your hints into strict bouncers. If you hint `age: int` and someone tries to pass the word "Twenty", Pydantic actively blocks it and throws an error!', 
        advanced: 'Pydantic bridges the gap between static typing and runtime validation. By extending `BaseModel`, it automatically coerces types during parsing (e.g., casting string `"5"` to int `5`) and guarantees API payload integrity. It is the foundational data-validation layer for modern frameworks like FastAPI.' 
      },
      { 
        title: '5. Static Analysis Tools (MyPy)', 
        beginner: 'Since Python ignores hints when running, how do we actually check them? We use a separate "spellchecker" for code called MyPy. It reads your file without running it and yells if you broke your own rules!', 
        advanced: 'Tools like MyPy and Pyright perform static type checking by building an Abstract Syntax Tree (AST) and tracing type flows before execution. Integrating this into CI/CD pipelines prevents type-related runtime exceptions from ever reaching production, enforcing strict architectural contracts.' 
      }
    ],
    { 
      title: 'The Typed Calculator & Pydantic Bouncer', 
      intro: 'Let\'s write a fully annotated function to see how Type Hints make our code self-documenting, and then use Pydantic to enforce those hints at runtime.', 
      steps: [
        'Open your terminal REPL (`>>>`).',
        'Define a heavily typed function: `def calculate_tax(price: float, tax_rate: float) -> float:`',
        'Inside, return the math: `return price + (price * tax_rate)`.',
        'Run it: `calculate_tax(100.0, 0.05)`. It works perfectly.',
        'Now type `calculate_tax("One Hundred", "Five")`. Notice it crashes with a TypeError! Standard hints didn\'t stop it, but the math failed.',
        'Now let\'s add the bouncer. Type `from pydantic import BaseModel` (ensure it is installed via pip first).',
        'Create a strict data model: `class User(BaseModel):` and press `Enter`.',
        'Type 4 spaces: `name: str` and press `Enter`.',
        'Type 4 spaces: `age: int` and press `Enter`. Press `Enter` on an empty line.',
        'Try to create a valid user: `u1 = User(name="Alice", age=30)`. It works!',
        'Try to break it: `u2 = User(name="Bob", age="Thirty")`. Watch Pydantic violently reject the bad data with a massive, highly detailed ValidationError!'
      ], 
      goal: 'You successfully applied static type constraints, understood their runtime limitations, and implemented Pydantic to enforce strict runtime data validation and coercion.' 
    },
    [
      q('What actually happens at runtime if you violate a standard Python type hint (like passing a string to an `int` hint)?', ['Python crashes instantly with a TypeError', 'Python ignores the hint completely; standard hints do not stop the code from running', 'Python secretly converts the string', 'The computer restarts'], 1, 'Standard type annotations are purely organizational metadata. The Python interpreter ignores them during execution; they rely entirely on external linters (like MyPy) to catch errors. **Why others are wrong:** Python does not crash purely because of a hint violation, nor does it auto-convert types based on hints.'),
      q('In the function signature `def fetch_user() -> dict:`, what does the `-> dict` represent?', ['It forces the function to take a dictionary as input', 'It restricts the function to one line of code', 'It explicitly documents that the function will return a dictionary data structure to the caller', 'It imports the dictionary module'], 2, 'The arrow syntax `->` designates the expected return type of the function, providing crucial structural guarantees to whoever relies on the function output. **Why others are wrong:** It does not dictate input parameters, restrict line count, or import modules.'),
      q('What does the modern type hint `str | None` (or `Optional[str]`) indicate?', ['The user can skip writing this code', 'The variable must be a string, or it is allowed to be exactly `None` (empty)', 'It chooses a random string', 'It creates an optional checkbox UI'], 1, '`str | None` is standard shorthand indicating that missing or null values are an explicitly expected and permitted state. **Why others are wrong:** It has nothing to do with skipping code execution, random selection, or UI elements.'),
      q('Why do professional developers use the external library `Pydantic`?', ['Because it makes Python run faster in the browser', 'Because it enforces type hints AT RUNTIME, aggressively blocking bad data and converting inputs to protect the application', 'Because it replaces the standard library', 'It designs web graphics'], 1, 'Unlike standard hints which are passive, Pydantic actively validates data payloads during execution, casting valid inputs and crashing immediately on structural violations. **Why others are wrong:** It does not speed up browser execution, replace the standard library, or design graphics.'),
      q('How do tools like MyPy actually catch type errors if Python ignores the hints at runtime?', ['They run the code 100 times to see if it crashes', 'They read the source code and build an Abstract Syntax Tree (AST) to trace type flows before the code ever executes', 'They ask the Python interpreter for a report', 'They only work on Mac computers'], 1, 'Static analyzers like MyPy parse the source code into an AST and mathematically trace the type flows pre-execution, catching mismatches without running the program. **Why others are wrong:** They do not execute the code, rely on interpreter reports, or have OS restrictions.')
    ],
    ['Use colons to hint variables, and arrows (->) to hint what functions give back.', 'Standard hints act as highly visible documentation that smart code editors use to warn you of bugs.', 'Use `X | None` (or Optional[X]) for data that might be missing or empty.', 'Standard hints don\'t stop the program; use libraries like Pydantic for strict runtime defense.', 'Integrate static analysis tools like MyPy into your workflow to catch errors before execution.']
  ),

  L('py-16', 16, 'APIs & Web Requests', '🌐',
    '*If you want to use a big terminal, use your CMD. Full guide is in Lesson 1.*\n\n🌐 **Philosophy:** Your code doesn\'t have to live in isolation. The modern internet is a massive web of interconnected services talking to each other. APIs (Application Programming Interfaces) allow your Python scripts to tap into this global nervous system—fetching live weather data, sending automated emails, or pulling stock prices in real-time. Mastering HTTP and RESTful architecture is the bridge between writing local scripts and building global, distributed systems.',
    [
      { 
        title: '1. What is an API & REST?', 
        beginner: 'Think of an API as a digital restaurant waiter. You (the client) give the waiter an order (a Request). The waiter takes it to the kitchen (the Server). The kitchen prepares the food, and the waiter brings it back to you (the Response).', 
        advanced: 'RESTful APIs operate over HTTP, mapping standard stateless CRUD operations (Create, Read, Update, Delete) to highly structured URI endpoints. They treat data as "Resources" and rely on standard HTTP verbs (GET, POST, PUT, DELETE) to manipulate those resources without maintaining server-side session state.' 
      },
      { 
        title: '2. The Requests Library', 
        beginner: 'Python\'s built-in internet tools are clunky. The external `requests` library is the industry standard for web scraping and API calls. You can fetch a webpage instantly just by typing `requests.get("https://google.com")`!', 
        advanced: 'The `requests` library abstracts underlying `urllib3` connection pooling, SSL/TLS verification, and session state persistence. It handles complex multipart file uploads and automatic decompression of gzip responses, making low-level socket management completely invisible to the developer.' 
      },
      { 
        title: '3. HTTP Status Codes', 
        beginner: 'When a server replies, it includes a 3-digit number. `200` means "Perfect, here is your data!" `404` means "File Not Found." `401` means "You are not authorized." Always check your status code before trusting the data!', 
        advanced: 'HTTP Status Codes categorize response behaviors structurally. 2xx dictates success, 3xx dictates redirection, 4xx dictates client-side failure (bad payload/auth), and 5xx dictates catastrophic upstream server failures. Professional code strictly raises exceptions for any non-2xx response.' 
      },
      { 
        title: '4. GET vs. POST & Payloads', 
        beginner: 'A `GET` request just asks to read data (like loading a webpage). A `POST` request securely sends new data up to the server (like submitting a login form). Most APIs reply in JSON text, which `requests` can instantly convert to a dictionary using `.json()`.', 
        advanced: 'GET requests encode parameters strictly in the query string of the URL, exposing them to router logs and browser history. POST requests encapsulate payloads securely within the HTTP message body, allowing complex, massive data transmission and adhering to RESTful creation semantics.' 
      },
      { 
        title: '5. Headers & Authentication', 
        beginner: 'Sometimes an API needs an ID badge to let you in. You pass this badge in the "Headers" of your request, usually as an API Key or a secret token, so the server knows who you are.', 
        advanced: 'HTTP Headers carry metadata, not payload data. Authentication is typically handled via the `Authorization` header using schemes like Bearer (JWTs) or Basic Auth. Passing secrets in URL query parameters is a severe security vulnerability as they are logged in plaintext in server access logs.' 
      }
    ],
    { 
      title: 'The PokeAPI Fetcher & Header Inspection', 
      intro: 'Let\'s write a script that connects to the public Pokemon API over the internet, fetches live JSON data, inspects the hidden headers, and parses it cleanly.', 
      steps: [
        'Open your terminal and ensure you are in an environment with the library installed (`pip install requests`).',
        'Launch the REPL and type `import requests`.',
        'Make the GET request: `response = requests.get("https://pokeapi.co/api/v2/pokemon/pikachu")`.',
        'Check the status to ensure the server liked your request: `print(response.status_code)`. (Look for 200!).',
        'Inspect the hidden metadata: Type `print(response.headers["Content-Type"])`. You will see `application/json`!',
        'Extract the JSON data into a dictionary: `data = response.json()`.',
        'Now parse it! Find Pikachu\'s weight: `print(data["weight"])`.',
        'Find his ID number: `print(data["id"])`.'
      ], 
      goal: 'You successfully executed a stateless HTTP GET request, verified the network handshake, inspected response headers, deserialized the JSON payload, and extracted targeted dictionary data.' 
    },
    [
      q('What is the primary difference between an HTTP GET request and a POST request?', ['GET is fast, POST is slow', 'GET asks to read data from the server, POST safely submits new payload data up to the server', 'GET deletes databases, POST creates them', 'There is no difference'], 1, 'GET requests are idempotent and used strictly for data retrieval (parameters in URL), while POST requests package body data to mutate or create new state on the destination server. **Why others are wrong:** Speed is not the defining difference. GET does not delete (that is DELETE). They are fundamentally different HTTP verbs.'),
      q('If your API request returns a Status Code of `404`, what does it mean?', ['The server crashed completely', 'You forgot to pay for the API', 'The specific URL or data you requested could not be found', 'The request was a perfect success'], 2, 'The 404 status code universally dictates a Client Error where the server is alive and responding, but the specific endpoint resource does not exist. **Why others are wrong:** Server crashes are 5xx errors. Payment issues are usually 402 or 403. Success is 2xx.'),
      q('What does the standard `.json()` method do when attached to a successful `requests` response object?', ['It deletes the file', 'It zips the response to save hard drive space', 'It translates the raw internet text perfectly into a usable Python dictionary', 'It launches a web browser'], 2, 'The `.json()` function automatically deserializes the raw string payload body into native Python lists and dictionaries using the built-in `json` module. **Why others are wrong:** It does not delete, zip, or launch browsers. It strictly parses text into memory.'),
      q('Why is the `requests` library overwhelmingly preferred over Python\'s built-in internet tools?', ['It is built by Google', 'Its syntax is highly abstracted, readable, and handles complex SSL and session management invisibly', 'It is the only library allowed on Mac computers', 'It requires no memory'], 1, '`requests` revolutionized Python networking by aggressively abstracting the horrific boilerplate code required by standard built-in modules like `urllib`. **Why others are wrong:** It is not built by Google, has no OS restrictions, and absolutely uses memory.'),
      q('Why is it a severe security vulnerability to pass API keys or passwords in the URL query string (e.g., `?api_key=123`) instead of the Headers?', ['URLs are slower to process', 'URLs are routinely logged in plaintext by servers, routers, and browser history, exposing the secret', 'Headers cannot hold text', 'Python blocks URL parameters'], 1, 'URLs are routinely logged in plaintext by servers, routers, and browser history, exposing the secret to anyone with log access. Headers are kept out of standard access logs. **Why others are wrong:** It has nothing to do with speed, header text limits, or Python blocking parameters.')
    ],
    ['Use the external requests library to communicate with the internet easily.', 'Always verify your response.status_code == 200 before trusting the data payload.', 'GET requests ask for information; POST requests submit new information in the body.', 'Use .json() to magically turn API text responses into workable Python dictionaries.', 'Never put secrets in URLs; always use HTTP Headers for authentication and metadata.']
  ),

  L(
    'py-test-1', 16.5, 'Midterm Assessment: Core Python Mastery', '📝', 
    '*If you want to use a big terminal, use your CMD. Full guide is in Lesson 1.*\n\n📝 **Philosophy:** Welcome to the Midterm Assessment! This is a comprehensive review checkpoint. Instead of learning a new topic, you are going to test your mastery of everything covered from Lesson 1 through Lesson 15. True engineering mastery isn\'t about memorizing syntax; it\'s about synthesizing data structures, control flow, OOP, and environment management into cohesive, crash-proof systems. This capstone proves you are ready for advanced architecture.',
    [
      { title: '1. Core Mechanics & Data Structures', beginner: 'You should feel completely comfortable creating variables, looping through lists, looking up values in dictionaries, and writing if/else logic to control how your program makes decisions under different conditions.', advanced: 'At this stage, your understanding of mutable versus immutable types, memory reference assignment, and scope resolution (the LEGB rule) should be solid. You should know how to manipulate basic data structures efficiently without causing unintended side effects or $O(n)$ bottlenecks.' },
      { title: '2. Functions & Error Handling', beginner: 'You must know how to write custom functions that accept incoming arguments and return processed results. Additionally, you should know how to use try/except blocks to stop your program from crashing entirely when something unexpected happens.', advanced: 'You should be fully capable of utilizing `*args` and `**kwargs` for highly flexible function signatures, raising custom application-specific exceptions, and tracking the complete execution flow of `try/except/else/finally` blocks to ensure deterministic resource cleanup.' },
      { title: '3. Object-Oriented Basics', beginner: 'You should understand how to build custom classes acting as blueprints, create individual object instances from those blueprints, and use the `__init__` method to safely set up their starting data.', advanced: 'You must understand the explicit difference between class-level attributes and instance-level attributes, how to set up foundational inheritance structures, and how to define standard dunder methods like `__str__` to control how objects are represented in memory.' },
      { title: '4. The Development Environment', beginner: 'You need to be comfortable opening your computer\'s terminal, activating a virtual environment, installing external tools with the `pip` command, and running your Python scripts natively from the command line.', advanced: 'Your workflow should seamlessly integrate strict isolated virtual environments for every single project you build, heavily utilizing `requirements.txt` files to safely manage and share third-party dependencies without polluting the global OS namespace.' }
    ],
    {
      title: 'Midterm Capstone Application',
      intro: 'For your practical exam, you will combine everything you know to build a fully functional, object-oriented weather data processor that fetches live information from an API, parses JSON payloads, and handles unexpected network errors safely.',
      steps: [
        'Open your terminal, create a new project directory (`mkdir midterm_project`), and navigate inside it (`cd midterm_project`).',
        'Initialize a fresh virtual environment: `python -m venv .venv` and activate it.',
        'Install the `requests` library via pip (`pip install requests`) and freeze your dependencies (`pip freeze > requirements.txt`).',
        'Create a file named `weather.py`. Inside, define a class named `WeatherClient` that takes a base API URL during its `__init__` instantiation.',
        'Write a method inside the class that uses a `try/except` block to execute a GET request, safely catching any `requests.exceptions.ConnectionError` if the internet fails.',
        'Parse the returning JSON data from the API and dynamically instantiate local, custom `CityWeather` data objects for each result.',
        'Write an execution script at the bottom (protected by `if __name__ == "__main__":`) that loops through these objects and writes a formatted data summary to a local `.txt` file using the `with open()` context manager.',
        'Run the script from your terminal: `python weather.py`. Verify the text file was created and contains the parsed data!'
      ],
      goal: 'You successfully integrated core logic, API networking, OOP, error handling, and file I/O into a single cohesive, crash-proof application, proving your readiness for advanced software architecture.'
    },
    [
      q('In Python, what exactly happens if you attempt to modify or reassign an element inside a tuple after it has been created?', ['The tuple resizes automatically to accommodate the data change', 'A TypeError is thrown because tuples are strictly immutable data structures', 'The tuple silently converts itself into a list', 'The change is saved temporarily but wipes when the script closes'], 1, 'Tuples are immutable. Once instantiated, their internal structure and element assignments are locked and cannot be altered. Lists should be utilized if mutability is required. **Why others are wrong:** Tuples do not resize, auto-convert, or save temporarily. They strictly enforce immutability to guarantee hashability and memory safety.'),
      q('What is the architectural purpose of the `finally` block in a `try/except` error handling pipeline?', ['It forces the program to crash entirely if an error occurs', 'It is an optional block that executes only if NO exceptions were raised', 'It executes unconditionally at the end of the block sequence, making it the standard location for cleaning up system resources regardless of success or failure', 'It automatically restarts the loop if an error was successfully caught'], 2, 'The `finally` block is strictly guaranteed to run by the Python interpreter, making it the architectural standard for ensuring critical teardowns (like closing files or DB connections) always execute. **Why others are wrong:** It does not force crashes, it is not conditional on success (that is `else`), and it does not restart loops.'),
      q('When defining instance methods inside a custom class, why must `self` be explicitly declared as the first parameter?', ['Because Python uses `self` to automatically import external libraries', 'Because the interpreter automatically passes the specific object instance calling the method as the first argument, allowing the method to access its internal instance data', 'Because it is a strict security requirement to prevent data leaks across classes', 'Because `self` flags the method to run asynchronously'], 1, 'Instance methods act directly on specific object instances. Python implicitly passes the instance (`self`) so the internal logic knows exactly which object\'s data dictionary it should interact with. **Why others are wrong:** It does not import libraries, act as a security boundary, or flag async execution.'),
      q('What is the primary danger of installing third-party packages globally on your system using pip instead of using an isolated Virtual Environment?', ['Global packages run significantly slower than local packages', 'Global installations can cause catastrophic version conflicts across different projects, breaking older scripts when newer package versions are globally overwritten', 'Global packages automatically delete themselves from the system after 30 days', 'Global packages are completely blocked from being uploaded to GitHub'], 1, 'Virtual environments isolate project dependencies. Installing packages globally pollutes the root system Python interpreter and leads to unavoidable dependency version collisions. **Why others are wrong:** It does not affect execution speed, auto-delete, or block GitHub uploads.'),
      q('Which of the following built-in tools is specifically designed to iterate through an iterable while automatically tracking both the current index number and the value simultaneously?', ['range()', 'enumerate()', 'zip()', 'filter()'], 1, 'The `enumerate()` function wraps an iterable and yields a tuple containing the iteration count (the index) and the value, completely eliminating the need to manually track integer index counters inside loops. **Why others are wrong:** `range()` generates numbers. `zip()` pairs multiple iterables. `filter()` removes items based on a condition.')
    ],
    ['You have fully mastered the foundational mechanics of Python development.', 'You can successfully structure multi-file projects and manage external system dependencies.', 'You understand how to encapsulate business logic using robust Object-Oriented design patterns.', 'You are officially ready to advance into complex software architecture!']
  ),

  L('py-17', 17, 'Asynchronous Python', '⏱️',
    '*If you want to use a big terminal, use your CMD. Full guide is in Lesson 1.*\n\n⏱️ **Philosophy:** Normal Python code is "synchronous"—it does one thing at a time. If it asks an API for data, the entire script freezes and waits. In a world of microservices and high-latency networks, this is incredibly inefficient. Asynchronous Python (`async/await`) unlocks cooperative multitasking, allowing your code to juggle thousands of background tasks simultaneously. Mastering this is the difference between a script that takes an hour to scrape 1,000 pages, and one that takes 10 seconds.',
    [
      { 
        title: '1. Concurrency vs. Parallelism', 
        beginner: 'Concurrency is like a chef juggling multiple dishes (switching between them quickly). Parallelism is like having two separate chefs cooking at the exact same time. Python\'s async is concurrency (one chef juggling), not parallelism!', 
        advanced: 'Concurrency deals with managing multiple tasks concurrently (I/O bound), while parallelism executes tasks simultaneously on multiple CPU cores (CPU bound). Because of the GIL (Global Interpreter Lock), standard Python `asyncio` achieves high throughput for I/O via single-threaded cooperative multitasking, but cannot bypass the GIL for CPU-bound parallelism.' 
      },
      { 
        title: '2. The Event Loop', 
        beginner: 'Think of the Event Loop as a super-fast chef. If the chef puts a turkey in the oven (a slow API request), they don\'t stand there staring at it for 4 hours. They move on to chop veggies! The Event Loop manages tasks, pausing the slow ones and running the fast ones.', 
        advanced: 'The `asyncio` event loop is a single-threaded cooperative multitasking architecture. It continuously cycles through an internal queue of tasks, yielding execution thread-time during I/O blocking operations. It relies on the OS-level `epoll` or `kqueue` for highly efficient network socket monitoring.' 
      },
      { 
        title: '3. async def & Coroutines', 
        beginner: 'To tell Python that a function is capable of multitasking, you simply add the word `async` to the front of it: `async def fetch_data():`. This turns your normal function into a special pausing object called a Coroutine.', 
        advanced: 'Declaring a function with `async def` changes its return behavior entirely. Instead of executing code when called, it strictly returns an unexecuted Coroutine object (a state machine) that must be explicitly scheduled onto the event loop via `await` or `asyncio.run()`.' 
      },
      { 
        title: '4. The await Keyword', 
        beginner: 'Inside your async function, when you hit a slow task, you type `await`. `await slow_download()` tells Python: "This will take a while. Pause this function, go do other things, and come back here exactly when the download finishes!"', 
        advanced: 'The `await` expression yields control back to the central event loop. It can only be applied to "Awaitable" objects (Coroutines, Tasks, or Futures). It fundamentally acts as an execution suspension point, saving the local stack frame state until the I/O operation resolves.' 
      },
      { 
        title: '5. asyncio.gather() & Task Management', 
        beginner: 'If you need to download 10 different files, synchronous Python does them one-by-one. By putting them into `asyncio.gather()`, Python launches all 10 downloads instantly at the exact same time, finishing in just a fraction of the time!', 
        advanced: '`asyncio.gather()` takes multiple coroutines, schedules them concurrently as tasks on the active loop, and aggregates their returned results into a localized list while maintaining the original execution order. For fire-and-forget background tasks, `asyncio.create_task()` is preferred to avoid blocking the current coroutine.' 
      }
    ],
    { 
      title: 'The Multitasking Chef', 
      intro: 'Let\'s write an asynchronous script that cooks two different meals at the same time, proving that Python can run background tasks without freezing the main thread.', 
      steps: [
        'Open your terminal and launch Python (`>>>`).',
        'Import the core async tool: `import asyncio`.',
        'Create a slow coroutine: Type `async def cook(food, delay):` and press `Enter`.',
        'Type 4 spaces, then `print(f"Started {food}...")` and press `Enter`.',
        'Type 4 spaces, then `await asyncio.sleep(delay)` and press `Enter`. (This simulates slow I/O cooking).',
        'Type 4 spaces, then `print(f"Finished {food}!")` and press `Enter`.',
        'Press `Enter` on an empty line to close the function.',
        'Create the master runner: Type `async def main():` and press `Enter`.',
        'Type 4 spaces, then `await asyncio.gather(cook("Steak", 3), cook("Eggs", 1))` and press `Enter`.',
        'Press `Enter` on an empty line to close `main`.',
        'Trigger the event loop: Type `asyncio.run(main())` and press `Enter`.',
        'Watch the output! Notice how Eggs finish BEFORE Steak, proving the chef didn\'t stand still waiting for the Steak!'
      ], 
      goal: 'You successfully implemented a cooperative multitasking coroutine, yielded control back to the event loop during I/O blocks, and executed concurrent operations simultaneously.' 
    },
    [
      q('What is the core difference between synchronous and asynchronous code?', ['Sync is for math, Async is for text', 'Sync freezes and waits for each task to finish before moving on; Async pauses slow tasks to work on other things simultaneously', 'Sync is built into Python, Async requires a monthly subscription', 'There is no difference'], 1, 'Synchronous code blocks execution entirely during I/O delays. Asynchronous architecture yields the execution thread to other tasks during I/O waits, maximizing throughput. **Why others are wrong:** It has nothing to do with math vs text, or subscriptions. They are fundamentally different execution models.'),
      q('What happens if you call an `async def` function directly without using the `await` keyword or an event loop?', ['It crashes the computer entirely', 'It runs normally but very fast', 'It does NOT run the code inside; it just returns a suspended Coroutine memory object', 'It formats your hard drive'], 2, 'Calling an async function implicitly generates an unexecuted coroutine object. The logic inside strictly requires an event loop scheduler (via `await` or `run()`) to actually execute. **Why others are wrong:** It does not crash, run normally, or format drives. It just silently returns an object.'),
      q('What is the purpose of the `await` keyword inside an async function?', ['It acts as a breakpoint, yielding control back to the Event Loop to do other things until the slow task completes', 'It stops the program forever', 'It makes the internet connection faster', 'It downloads a specific file'], 0, '`await` tells the runtime: "Suspend this exact function state and process other loop queue tasks until this specific I/O operation returns a result." **Why others are wrong:** It does not stop the program forever, speed up the physical network, or download files directly.'),
      q('Why is `asyncio.gather()` considered an incredibly powerful tool for networking?', ['It encrypts all network data natively', 'It completely bypasses all firewall security', 'It allows you to fire off dozens of API requests simultaneously instead of waiting for them one by one', 'It acts as a physical router'], 2, '`gather()` schedules multiple awaitable coroutines onto the loop simultaneously, turning sequential network blocking bottlenecks into highly concurrent, massive parallel requests. **Why others are wrong:** It does not encrypt data, bypass firewalls, or act as hardware.'),
      q('Why can\'t Python\'s `asyncio` speed up heavy mathematical calculations (CPU-bound tasks)?', ['Because math is inherently slow', 'Because of the Global Interpreter Lock (GIL), which prevents multiple Python threads from executing bytecode simultaneously on multiple CPU cores', 'Because async only works with text', 'Because the Event Loop blocks math'], 1, 'The GIL ensures only one thread executes Python bytecode at a time. `asyncio` only yields during I/O waits; it cannot split CPU-bound math across multiple cores (which requires the `multiprocessing` module). **Why others are wrong:** Math is not inherently slow, async works with all data types, and the loop doesn\'t block math specifically.')
    ],
    ['Understand the difference between Concurrency (juggling) and Parallelism (multiple chefs).', 'Use the async keyword to create functions that are capable of pausing (Coroutines).', 'Use the await keyword right before slow I/O tasks to let Python multitask in the background.', 'The Event Loop is the single-threaded traffic controller managing all the pausing and resuming.', 'Use asyncio.gather() to launch massive amounts of I/O tasks at the exact same time.']
  ),

  L('py-18', 18, 'Unit Testing & Pytest', '🧪',
    '*If you want to use a big terminal, use your CMD. Full guide is in Lesson 1.*\n\n🧪 **Philosophy:** Writing code is easy; writing code that doesn\'t randomly break 6 months later is hard. Unit testing involves writing separate "robot scripts" that constantly check your main code to ensure it still works exactly as intended. In the professional world, untested code is considered broken code. Mastering testing gives you the ultimate superpower: the confidence to refactor, upgrade, and scale your application without the paralyzing fear of destroying it.',
    [
      { 
        title: '1. Why Test & TDD', 
        beginner: 'Imagine you update a calculator function, but accidentally break division without noticing. If you release the code, users will crash. Tests are tiny automated alarms. Before you release code, you run your tests. If division breaks, the test flashes red, saving you from disaster!', 
        advanced: 'Test-Driven Development (TDD) ensures CI/CD pipeline integrity. Unit tests strictly isolate domain logic, guaranteeing that refactoring or dependency updates do not cause systemic logic regressions in production environments. They act as executable, living documentation of your system\'s expected behaviors.' 
      },
      { 
        title: '2. The assert Keyword', 
        beginner: 'The foundation of all testing is `assert`. It simply means "I claim this is true!" If you write `assert 1 + 1 == 2`, Python does nothing because it is true. If you write `assert 1 + 1 == 3`, Python violently crashes with an AssertionError. We use these crashes as alarms!', 
        advanced: 'The `assert` keyword evaluates the subsequent boolean expression. It is optimized away entirely if Python is run in optimized mode (`-O` flag), which is why assertions should strictly be used for testing, never for runtime data validation or security checks.' 
      },
      { 
        title: '3. Intro to Pytest & AST Rewriting', 
        beginner: 'While Python has built-in testing tools, the entire industry uses an external library called `pytest`. It is incredibly easy. You just name a file `test_math.py`, write a function named `test_addition()`, and run the `pytest` command. It automatically finds your asserts and prints a beautiful report!', 
        advanced: 'Pytest heavily utilizes AST (Abstract Syntax Tree) rewriting. It intercepts standard `assert` statements at import time and rewrites them into highly detailed comparison blocks, providing deep variable introspection in its traceback outputs without requiring verbose boilerplate classes.' 
      },
      { 
        title: '4. Test Isolation & Fixtures', 
        beginner: 'A good test only checks ONE specific thing, and never relies on other tests. If `test_login` fails, it shouldn\'t cause `test_logout` to fail too. Keep your tests completely separated so you know exactly what broke!', 
        advanced: 'Tests must be completely deterministic and stateless. Pytest implements "Fixtures" via the `@pytest.fixture` decorator to cleanly inject setup/teardown state (like mock database connections or temporary files) into specific test functions, maintaining strict isolation and dependency injection.' 
      },
      { 
        title: '5. Mocking & Side Effects', 
        beginner: 'What if your test needs to check a function that sends a real email? You don\'t want to spam people! "Mocking" creates a fake, pretend email sender just for the test, so you can check if it was called without actually sending anything.', 
        advanced: 'Mocking (via `unittest.mock.patch`) replaces real external dependencies (APIs, databases) with controlled, simulated objects. This ensures tests remain fast, deterministic, and strictly isolated from network flakiness, third-party rate limits, or accidental production side-effects.' 
      }
    ],
    { 
      title: 'Building the Alarms & Running Pytest', 
      intro: 'Let\'s write a simple math function, build an automated safety test around it, and run it using the industry-standard pytest framework from your terminal.', 
      steps: [
        'Open your normal system terminal (not the Python REPL).',
        'Ensure pytest is installed: `pip install pytest`.',
        'Create a new file named `test_math.py` using your text editor.',
        'Inside the file, write the logic: `def get_square(num): return num * num`.',
        'Write your test function below it: `def test_get_square():`.',
        'Inside the test, add an assertion: `assert get_square(4) == 16`.',
        'Add another assertion: `assert get_square(0) == 0`.',
        'Save the file and close the editor.',
        'Back in your terminal, simply type `pytest` and press `Enter`.',
        'Watch Pytest automatically find your file, run the tests, and print a beautiful green "2 passed" report!',
        'Now open the file, deliberately break it: change `16` to `30`. Save and run `pytest` again. Watch the red AssertionError alarm save you!'
      ], 
      goal: 'You successfully implemented the foundation of automated software verification, utilized the assertion keyword, and executed a professional test suite using the Pytest framework.' 
    },
    [
      q('What is the absolute primary purpose of writing Unit Tests in a software project?', ['To increase the visual graphics of a website', 'To automatically detect when new code changes accidentally break older, functioning code', 'To permanently delete error messages', 'To deploy code to AWS servers'], 1, 'Unit tests act as regression guards. They run constantly to ensure that refactored features and new commits do not violate the core business logic established previously. **Why others are wrong:** They do not affect graphics, delete errors, or deploy code.'),
      q('What happens in Python when an `assert` statement evaluates to `False`?', ['The program instantly crashes and throws an AssertionError', 'Python secretly fixes the math to make it true', 'Python emails the developer', 'The program skips the line and continues'], 0, 'Assertions act as rigid boolean checkpoints. If the statement evaluates to False, the runtime violently terminates, flagging the exact failure point. **Why others are wrong:** Python does not auto-fix math, email developers, or skip failed assertions.'),
      q('If you are using the industry-standard `pytest` framework, how must you name your test files so the framework can find them automatically?', ['They must be named `secure.py`', 'They must be zipped into a folder named `tests`', 'They must start with `test_` (like `test_calculator.py`)', 'They must have no file extension'], 2, 'Pytest utilizes auto-discovery. It systematically scans directory trees for files prefixed with `test_` or suffixed with `_test`, automatically mapping and executing the assertions inside. **Why others are wrong:** It does not require specific secure names, zipping, or removing extensions.'),
      q('Why is it dangerous to rely on `assert` for runtime security checks (like validating user passwords) instead of just using it for testing?', ['Asserts cannot check strings', 'Asserts slow down the computer too much', 'Python can be run in "optimized mode" which entirely ignores and skips all `assert` statements', 'Asserts only work on Mac computers'], 2, 'Assertions are specifically designed for developer debugging. If the interpreter runs with the `-O` optimization flag, all `assert` blocks are stripped from bytecode, destroying your security checks. **Why others are wrong:** They can check strings, do not inherently slow down execution, and work on all OS platforms.'),
      q('What is the primary purpose of "Mocking" external services (like APIs or Databases) during a unit test?', ['To make the test run slower', 'To replace real external dependencies with fake, controlled objects so the test remains fast, isolated, and doesn\'t cause real-world side effects', 'To encrypt the test data', 'To connect the test to the live production server'], 1, 'Mocking replaces real external dependencies with controlled, simulated objects, ensuring tests remain fast, deterministic, and strictly isolated from network flakiness or accidental production side-effects. **Why others are wrong:** It makes tests faster, not slower. It does not encrypt data or connect to production.')
    ],
    ['Automated tests are safety nets that prevent you from accidentally breaking old code (regressions).', 'The assert keyword violently crashes the program if a statement is false, acting as an alarm.', 'Use the Pytest library and name your files test_something.py for automatic scanning.', 'Keep tests strictly isolated using Fixtures so an error in one doesn\'t poison the others.', 'Use Mocking to fake external APIs and databases, keeping tests fast and free of real-world side effects.']
  ), 


L('py-19', 19, 'Advanced Decorator Patterns', '🎩',
    '*If you want to use a big terminal, use your CMD. Full guide is in Lesson 1.*\n\n🎩 **Philosophy:** Decorators are Python\'s gateway to Aspect-Oriented Programming (AOP). In massive enterprise systems, you often have "cross-cutting concerns"—logic like security checks, rate limiting, or logging that needs to be applied to hundreds of functions. Instead of copy-pasting that logic everywhere, decorators allow you to inject it cleanly from the outside. Mastering advanced decorator patterns is what separates developers who write scripts from architects who design resilient, decoupled frameworks.',
    [
      { 
        title: '1. Decorators with Arguments (The Nesting Doll)', 
        beginner: 'What if you want your decorator to take an input? (e.g., `@retry(times=3)`). You need to add an extra layer of nesting: a function that returns a decorator, which returns the wrapper. It is the "Russian Nesting Doll" of Python coding.', 
        advanced: 'Creating decorators with arguments requires three levels of closure nesting. The outer function captures the decorator arguments, the middle level intercepts the decorated function, and the inner level handles the execution wrap. This is because `@retry(times=3)` is actually evaluated as `func = retry(times=3)(func)`.' 
      },
      { 
        title: '2. Preserving Identity (functools.wraps)', 
        beginner: 'Whenever you wrap a function in a decorator, the original function "forgets" its own name and documentation. Always import `functools` and use the `@wraps(func)` decorator inside your wrapper to copy the original function\'s identity to the wrapper.', 
        advanced: 'Without `@wraps`, the decorated function loses its `__name__`, `__doc__`, and `__module__` attributes. This breaks introspection tools, type checkers, routing frameworks (like Flask/FastAPI), and documentation generators like Sphinx. `@wraps` updates the wrapper\'s `__dict__` to mirror the original function.' 
      },
      { 
        title: '3. Class-Based Decorators', 
        beginner: 'You don\'t have to use functions to decorate! You can use a Class. By defining `__init__` (to take the function) and `__call__` (to run the wrapper logic), your object acts exactly like a function.', 
        advanced: 'Class-based decorators are vastly superior for managing complex stateful data between calls. Because the decorator is an instantiated object, you can maintain internal caches, counters, or database connections as instance attributes (`self`) across multiple executions of the decorated function.' 
      },
      { 
        title: '4. Method Decorators & Signature Flexibility', 
        beginner: 'Decorating a method inside a class is tricky because methods have `self`. Your wrapper must accept `*args` and `**kwargs` to make sure it can handle the hidden `self` argument passed to the class method.', 
        advanced: 'The decorator must be "signature-agnostic." By strictly utilizing `*args` and `**kwargs` and passing them transparently to the original function, you ensure the decorator doesn\'t crash when it encounters the implicit instance reference (`self`) or class reference (`cls`) during bound method dispatch.' 
      },
      { 
        title: '5. Decorator Stacking Order', 
        beginner: 'You can stack multiple decorators on top of each other! But be careful: they wrap from the bottom up, but execute from the top down. It\'s like putting on a shirt, then a sweater, then a jacket. When you take them off, the jacket comes off first!', 
        advanced: 'When stacking decorators, the syntax `@A @B def func():` is evaluated as `func = A(B(func))`. The wrapping occurs bottom-up (B wraps func, then A wraps B\'s result). However, at runtime, execution flows top-down: A\'s wrapper fires first, calls B\'s wrapper, which finally calls the original function. Understanding this flow is critical for debugging complex middleware chains.' 
      }
    ],
    { 
      title: 'The "Retry" Security Guard', 
      intro: 'Let\'s build a professional, stateful decorator that automatically retries a function if it crashes, which is vital for unreliable network connections. We will use a 3-level nesting factory.', 
      steps: [
        'Open your terminal REPL (`>>>`).',
        'Import tools: `import functools`, `import time`, `import random`.',
        'Create the 3-level factory: Type `def retry(max_attempts):` and press `Enter`.',
        'Type 4 spaces, then `def decorator(func):` and press `Enter`.',
        'Type 8 spaces, then `@functools.wraps(func)` and press `Enter`.',
        'Type 8 spaces, then `def wrapper(*args, **kwargs):` and press `Enter`.',
        'Type 12 spaces, then `for attempt in range(max_attempts):` and press `Enter`.',
        'Type 16 spaces, then `try: return func(*args, **kwargs)` and press `Enter`.',
        'Type 16 spaces, then `except Exception as e:` and press `Enter`.',
        'Type 20 spaces, then `print(f"Attempt {attempt+1} failed. Retrying...")` and press `Enter`.',
        'Type 20 spaces, then `time.sleep(1)` and press `Enter`.',
        'Type 16 spaces, then `raise Exception("Max retries exceeded!")` and press `Enter`.',
        'Press `Enter` repeatedly to close all indentation blocks until `>>>` returns.',
        'Type `return wrapper` (at 8 spaces), press `Enter`. Type `return decorator` (at 4 spaces), press `Enter`. Press `Enter` to close.',
        'Test it! Define a flaky function using `@retry(max_attempts=3)` that fails randomly, and watch your decorator save the day!'
      ], 
      goal: 'You successfully engineered a multi-level nesting decorator factory, maintained function identity with wraps, and implemented stateful retry logic with signature flexibility.' 
    },
    [
      q('Why is `@functools.wraps(func)` considered a mandatory best practice in professional decorators?', ['It makes the code run in parallel', 'It copies the original function\'s name and docstrings to the wrapper, preserving its identity for debuggers and documentation tools', 'It prevents the decorator from running too often', 'It zips the project folder'], 1, 'Without `@wraps`, the original function metadata (`__name__`, `__doc__`) is overwritten by the wrapper\'s metadata, breaking introspection, routing, and automated documentation. **Why others are wrong:** It does not affect execution speed, parallelism, or file compression.'),
      q('What is the "Russian Nesting Doll" pattern (3-level nesting) in decorators used for?', ['To delete the code', 'To pass parameters into a decorator (like @retry(times=3))', 'To make the computer louder', 'To bypass password protection'], 1, 'Decorators that accept arguments require an outer function to capture those arguments, which returns the actual decorator, which returns the wrapper. **Why others are wrong:** It is strictly for argument capture, not deletion, audio, or security bypasses.'),
      q('When writing a class-based decorator, which dunder method allows the class instance to be used like a function?', ['`__init__`', '`__call__`', '`__str__`', '`__new__`'], 1, 'The `__call__` method allows an object instance to be invoked with parentheses `()`, making it interchangeable with functions in decorator syntax. **Why others are wrong:** `__init__` handles instantiation. `__str__` handles string conversion. `__new__` handles memory allocation.'),
      q('Why must your decorator wrapper include `*args` and `**kwargs`?', ['To save disk space', 'To ensure the wrapper can successfully receive any number of arguments or the hidden `self` instance when decorating class methods', 'To increase execution speed', 'To allow the code to run offline'], 1, '`*args` and `**kwargs` make the wrapper signature completely flexible, ensuring it can handle any function signature—including class methods that implicitly pass a `self` parameter. **Why others are wrong:** It does not affect disk space, execution speed, or network connectivity.'),
      q('If you stack decorators like `@A` then `@B` above a function, in what order do they execute at runtime?', ['B executes first, then A', 'A executes first, then B (Top-Down execution)', 'They execute at the exact same time', 'The order is randomized'], 1, 'While wrapping happens bottom-up (`A(B(func))`), runtime execution flows top-down. A\'s wrapper fires first, calls B\'s wrapper, which finally calls the original function. **Why others are wrong:** They do not execute simultaneously or randomly; the call stack dictates a strict top-down entry flow.')
    ],
    ['Use three levels of nesting for decorators that accept arguments (Decorator Factories).', 'Always use @functools.wraps to keep your function names and docs intact for introspection.', 'Class-based decorators are perfect for storing persistent state across multiple calls.', 'Use *args and **kwargs to ensure your decorators don\'t break when applied to class methods.', 'Understand that stacked decorators wrap bottom-up, but execute top-down at runtime.']
  ),

  L('py-20', 20, 'Generators & Iterators', '🔄',
    '*If you want to use a big terminal, use your CMD. Full guide is in Lesson 1.*\n\n🔄 **Philosophy:** Everything in Python is an object, but not everything needs to be in memory at once. In the era of Big Data, loading a 50GB log file into a list will instantly crash your server. Iterators and Generators are the architectural backbone of high-performance Python, allowing you to process petabytes of data on a machine with only 8GB of RAM by utilizing "Lazy Evaluation".',
    [
      { 
        title: '1. The Iterator Protocol', 
        beginner: 'Behind every `for` loop is an Iterator. It has two rules: `__iter__` (give me the list) and `__next__` (give me the next item). If there are no items left, it raises a `StopIteration` error. Your `for` loop secretly catches this and stops.', 
        advanced: 'The Iterator Protocol is the foundation of Python\'s `for` loops. An object is iterable if it implements `__iter__` (returning an iterator), and an iterator if it implements `__next__` (returning the next value or raising `StopIteration`). Understanding this allows you to build custom, streaming data structures that integrate natively with the language\'s syntax.' 
      },
      { 
        title: '2. Generators as State Machines', 
        beginner: 'A generator function is like a script that pauses. When you `yield` a value, the function doesn\'t die—it goes to sleep, saving exactly where it was. When you ask for `next()`, it wakes up right where it left off.', 
        advanced: 'Generators hold the entire local stack frame in memory. Unlike a normal function that destroys its local variables and instruction pointer upon `return`, a generator preserves its local scope, variables, and execution state between `yield` suspensions, acting as a lightweight, pausable state machine.' 
      },
      { 
        title: '3. Generator Delegation (yield from)', 
        beginner: 'If you have a generator inside a generator, don\'t write a loop to yield each item. Use `yield from other_generator()`. It is a clean, optimized shorthand that hands the work over to the inner generator.', 
        advanced: '`yield from` establishes a transparent, high-performance pipe between the caller and the sub-generator. Crucially, it also handles the complex `send()` and `throw()` propagation channels required for advanced two-way coroutine communication patterns.' 
      },
      { 
        title: '4. Two-Way Communication (.send & .throw)', 
        beginner: 'Did you know you can send data *into* a paused generator? Using `.send(value)`, you can pass information back into the exact spot where the `yield` keyword is waiting. It turns your generator into a two-way radio!', 
        advanced: '*(Expert Teaser)* Generators are not just data producers; they are coroutines. The `yield` expression can capture values sent via `.send()`. Furthermore, `.throw(Exception)` allows the caller to inject exceptions directly into the suspended generator\'s stack frame, enabling highly advanced error-handling and async pipeline routing.' 
      },
      { 
        title: '5. itertools: The Pro Toolbox', 
        beginner: 'Never write a nested loop to create combinations or permutations. The `itertools` library is a standard toolset for professional data science. It is built in C and is lightning-fast.', 
        advanced: '`itertools` provides memory-efficient, lazy-evaluated combinatorics written in highly optimized C code. Tools like `chain()`, `cycle()`, `product()`, and `islice()` allow you to manipulate infinite streams of data without ever materializing an intermediate list in RAM.' 
      }
    ],
    { 
      title: 'Building a Lazy Sequence & Two-Way Radio', 
      intro: 'Let\'s create a custom generator that produces an infinite sequence, and then learn how to send data back into it while it is paused.', 
      steps: [
        'Open your terminal REPL (`>>>`).',
        'Define a two-way generator: Type `def accumulator():` and press `Enter`.',
        'Type 4 spaces, then `total = 0` and press `Enter`.',
        'Type 4 spaces, then `while True:` and press `Enter`.',
        'Type 8 spaces, then `x = yield total` and press `Enter`.',
        'Type 8 spaces, then `if x is not None: total += x` and press `Enter`.',
        'Press `Enter` to close the block.',
        'Instantiate it: `gen = accumulator()`.',
        'Prime the generator (advance to first yield): `next(gen)`.',
        'Send data in! Type `gen.send(10)`. It returns 10. Type `gen.send(5)`. It returns 15!',
        'You just built a stateful, memory-efficient accumulator that pauses and resumes on demand!'
      ], 
      goal: 'You successfully implemented a stateful generator, understood the iterator protocol, and utilized two-way `.send()` communication to inject data into a suspended stack frame.' 
    },
    [
      q('What is the fundamental benefit of a Generator over a standard List?', ['Generators are better for graphics', 'Generators are lazy, meaning they only calculate one item at a time and don\'t need to hold the entire sequence in RAM', 'Generators are always written with square brackets', 'Generators require an internet connection'], 1, 'Generators evaluate lazily, allowing for the processing of massive or infinite datasets using a flat, constant $O(1)$ memory footprint. **Why others are wrong:** They are not specific to graphics, use parentheses `()` not brackets `[]`, and run entirely offline.'),
      q('What does `yield from` do?', ['It restarts the computer', 'It is a shorthand to hand off iteration control to another generator, piping values cleanly to the caller', 'It deletes the database', 'It converts numbers to text'], 1, '`yield from` creates an optimized sub-generator bridge, delegating iteration responsibilities and signal handling to an inner generator structure. **Why others are wrong:** It does not restart hardware, delete databases, or convert types.'),
      q('What happens when an iterator runs out of data?', ['It returns `None`', 'It raises a `StopIteration` exception', 'It starts over from the beginning', 'It crashes the operating system'], 1, 'Raising `StopIteration` is the official signal defined by the iterator protocol to notify the `for` loop (or `next()` call) that the sequence is exhausted. **Why others are wrong:** It does not return `None` (which is a valid data value), auto-restart, or crash the OS.'),
      q('Why would you choose `itertools` over writing your own custom nested loops?', ['It is slower', 'It is written in optimized C code and provides battle-tested, memory-efficient patterns for complex combinatorics', 'It makes your code look harder to read', 'It requires special permissions'], 1, '`itertools` is a high-performance standard library module written in C, providing robust, optimized building blocks for complex iterator manipulation that vastly outperform pure Python loops. **Why others are wrong:** It is faster, makes code more readable (Pythonic), and requires no special permissions.'),
      q('How do you pass data *into* a paused generator at the exact location of the `yield` keyword?', ['Using the `return` statement', 'Using the `.send(value)` method on the generator object', 'Using a global variable', 'You cannot pass data into a generator'], 1, 'The `.send(value)` method resumes the generator and injects the value into the `yield` expression, enabling two-way coroutine communication. **Why others are wrong:** `return` exits the function. Global variables bypass the local stack frame. Two-way communication is a core feature of generators.')
    ],
    ['The Iterator Protocol consists of __iter__ and __next__ (raising StopIteration).', 'Generators are state machines that pause and resume, keeping their local variables alive in memory.', 'Use `yield from` to hand off work to inner generators cleanly.', 'Use `.send()` to inject data directly into a suspended generator\'s stack frame.', '`itertools` is your best friend for high-performance, C-optimized sequence operations.']
  ),

  L('py-21', 21, 'Context Managers', '🚪',
    '*If you want to use a big terminal, use your CMD. Full guide is in Lesson 1.*\n\n🚪 **Philosophy:** In software engineering, acquiring a resource (opening a file, locking a database, connecting to a network) is easy. Remembering to release it when things go wrong is hard. Context Managers implement the RAII (Resource Acquisition Is Initialization) pattern, guaranteeing deterministic cleanup. They are the ultimate defense against memory leaks, locked files, and exhausted connection pools.',
    [
      { 
        title: '1. The Context Manager Protocol', 
        beginner: 'A context manager is just an object with two special methods: `__enter__` (setup) and `__exit__` (cleanup). When you enter the `with` block, `__enter__` runs. When you exit, `__exit__` runs automatically, even if the code crashes!', 
        advanced: 'Context managers are the mechanism for deterministic resource cleanup. The `with` statement guarantees that `__exit__` executes even if the block raises an unhandled exception, ensuring that OS-level file descriptors and network sockets are reliably returned to the system.' 
      },
      { 
        title: '2. Exception Handling in __exit__', 
        beginner: 'If an error happens inside your `with` block, Python passes the error details to the `__exit__` method. If `__exit__` returns `True`, Python "swallows" the error and keeps running. If it returns `False`, the error crashes the program normally.', 
        advanced: 'The `__exit__(self, exc_type, exc_value, traceback)` method receives the exact exception triad. Returning a truthy value suppresses the exception propagation. This is heavily used in database transactions to automatically `rollback()` on failure and `commit()` on success.' 
      },
      { 
        title: '3. contextlib (The Generator Way)', 
        beginner: 'If you don\'t want to build a whole class, use the `@contextmanager` decorator. It lets you write a generator function where the code *before* the `yield` is the setup, and the code *after* the `yield` is the cleanup.', 
        advanced: '`@contextmanager` turns a generator into a context manager. It manages the `__enter__` and `__exit__` boilerplate automatically, allowing you to focus on the setup/teardown logic using simple `try/finally` blocks inside the generator body.' 
      },
      { 
        title: '4. Managing Multiple Resources (ExitStack)', 
        beginner: 'What if you need to open a dynamic number of files, but you don\'t know how many until the code runs? You can\'t write 50 `with` statements! `ExitStack` lets you add context managers to a pile and close them all at once automatically.', 
        advanced: '`contextlib.ExitStack` is a programmatic context manager that dynamically registers other context managers via `.enter_context()`. It guarantees that all registered resources are torn down in reverse order (LIFO) upon exiting the stack, which is essential for dynamic resource allocation in frameworks.' 
      },
      { 
        title: '5. Real-World Usage Patterns', 
        beginner: 'Use them for everything! Database transactions (open/commit), timing functions (start/stop), or temporarily changing directories. It keeps your code dry, safe, and readable.', 
        advanced: 'Professional libraries like `FastAPI`, `SQLAlchemy`, and `Pytest` rely heavily on context managers to handle transient session lifecycles, dependency injection, and test isolation, ensuring connection pools are returned to the server immediately after query completion.' 
      }
    ],
    { 
      title: 'The Automatic Timer & Exception Swallower', 
      intro: 'Let\'s build a custom class-based context manager that times code execution AND gracefully catches and suppresses specific errors so the program doesn\'t crash.', 
      steps: [
        'Open your terminal REPL (`>>>`).',
        'Import time: `import time`.',
        'Define the class: `class SafeTimer:` and press `Enter`.',
        'Type 4 spaces, then `def __enter__(self):` and press `Enter`.',
        'Type 8 spaces, then `self.start = time.time()` and press `Enter`.',
        'Type 8 spaces, then `return self` and press `Enter`.',
        'Type 4 spaces, then `def __exit__(self, exc_type, exc_val, tb):` and press `Enter`.',
        'Type 8 spaces, then `print(f"Took {time.time() - self.start} seconds")` and press `Enter`.',
        'Type 8 spaces, then `if exc_type is ValueError: print("Caught error!"); return True` and press `Enter`.',
        'Type 8 spaces, then `return False` and press `Enter`.',
        'Press `Enter` to close the class.',
        'Test it! Type `with SafeTimer(): raise ValueError("Oops")`. Watch it print the time, catch the error, and SURVIVE without crashing!'
      ], 
      goal: 'You successfully implemented a class-based context manager, handled the exception triad in __exit__, and utilized exception suppression to prevent application crashes.' 
    },
    [
      q('What is the main advantage of using a context manager?', ['It makes the internet faster', 'It automates resource setup and guaranteed cleanup (like closing files or database connections) in one clean block', 'It replaces the `if` statement', 'It makes the code run in colors'], 1, 'Context managers use `__enter__` and `__exit__` to guarantee that cleanup tasks occur deterministically, regardless of whether the block succeeds or crashes. **Why others are wrong:** They do not affect network speed, replace conditionals, or alter terminal colors.'),
      q('What happens in the `__exit__` method of a context manager if an error occurs inside the `with` block?', ['The context manager is ignored', 'The `__exit__` method still executes, receiving the error details so it can clean up resources safely', 'The program freezes forever', 'The computer shuts down'], 1, 'The `__exit__` method receives exception information (`exc_type`, `exc_value`, `traceback`) as arguments, ensuring that resources are released even during a crash. **Why others are wrong:** It is never ignored, does not freeze the program, and does not shut down hardware.'),
      q('What does the `@contextmanager` decorator turn a generator function into?', ['A standard loop', 'A full context manager, where the code before `yield` is the setup and code after is the teardown', 'An infinite loop', 'A binary file'], 1, '`@contextmanager` simplifies context manager creation by abstracting the dunder methods into a simple yield-based generator structure wrapped in a `try/finally` block. **Why others are wrong:** It does not create standard loops, infinite loops, or binary files.'),
      q('Why would you choose a Class-based context manager over the `@contextmanager` decorator?', ['It is slower', 'Classes are better for complex managers that need to hold persistent state or shared data across multiple calls', 'Classes are smaller', 'Classes are required for math'], 1, 'Class-based managers are more robust for complex state tracking and method exposure, whereas generator-based managers are best for simple, transient setup/teardown logic. **Why others are wrong:** Classes are not inherently slower, smaller, or restricted to math.'),
      q('How does `contextlib.ExitStack` solve the problem of opening a dynamic, unknown number of files?', ['It merges all files into one giant file', 'It allows you to programmatically register multiple context managers at runtime and guarantees they are all closed in reverse order when the stack exits', 'It deletes the files automatically', 'It converts the files to text'], 1, '`ExitStack` dynamically registers context managers via `.enter_context()`, guaranteeing LIFO (Last-In-First-Out) teardown of all resources upon exiting the block. **Why others are wrong:** It does not merge, delete, or convert files; it strictly manages their lifecycle.')
    ],
    ['Context managers use the __enter__ and __exit__ protocol to automate deterministic resource handling.', 'Returning True from __exit__ suppresses exceptions, allowing for automatic error recovery.', '@contextmanager is the fastest way to build a context manager without writing a full class.', 'Use contextlib.ExitStack to manage a dynamic, unknown number of resources safely.', 'Apply context managers to database transactions, timing, file locking, and dependency injection.']
  ),

  L('py-22', 22, 'Metaclasses & Introspection', '🧠',
    '*If you want to use a big terminal, use your CMD. Full guide is in Lesson 1.*\n\n🧠 **Philosophy:** Metaclasses are the "code that builds your code." Most application developers will never need to write one, but understanding them is the key to reading the source code of massive frameworks like Django, SQLAlchemy, or Pydantic. They are the matrix behind the curtain, allowing libraries to magically inspect your class definitions and generate complex database schemas or API routes automatically.',
    [
      { 
        title: '1. The Metaclass Triad', 
        beginner: 'In Python, a Class is itself an object! It was created by a "Metaclass." If you run `type(MyClass)`, it doesn\'t say "class"—it says `type`. That\'s because `type` is the default metaclass that builds every standard class you write.', 
        advanced: 'Python uses a "Class Factory" pattern. Objects are instances of Classes, and Classes are instances of Metaclasses. The default metaclass is `type`. Understanding this triad (`object`, `class`, `type`) is the key to deep-level framework architecture and manipulating the class creation pipeline.' 
      },
      { 
        title: '2. Introspection (dir/getattr)', 
        beginner: 'You can inspect objects while they are running! `dir(obj)` lists every attribute and method a class has. `getattr(obj, "name")` allows you to grab a property even if you don\'t know the name ahead of time. This is how plugin systems work.', 
        advanced: 'Introspection allows for dynamic dispatching and reflection. By dynamically querying object interfaces at runtime via `dir()`, `getattr()`, and `hasattr()`, you can build modular, loosely-coupled systems where the application reacts to new code structures without needing a recompile or restart.' 
      },
      { 
        title: '3. Custom Metaclasses', 
        beginner: 'You can create a custom Metaclass to force rules on other classes. For example, you could write a Metaclass that crashes the program if a class doesn\'t have a specific docstring or a specific method. It\'s an "architectural enforcer."', 
        advanced: 'Inheriting from `type` allows you to override the `__new__` method. This is the exact hook where the metaclass intercepts the class definition byte-stream before the class object is fully constructed in memory, allowing you to inject attributes, validate method signatures, or modify the MRO dynamically.' 
      },
      { 
        title: '4. The Modern Alternative: __init_subclass__', 
        beginner: 'Metaclasses are notoriously hard to read and debug. Python recently added a simpler magic trick: `__init_subclass__`. If you put this in a parent class, it automatically runs whenever a new child class is created, letting you register or modify child classes easily!', 
        advanced: 'Introduced in PEP 487, `__init_subclass__` is a hook on the parent class that fires upon subclass creation. It solves 90% of use-cases that previously required complex custom metaclasses (like automatic plugin registries or attribute validation), drastically reducing architectural complexity and avoiding metaclass conflicts.' 
      },
      { 
        title: '5. Real-World Framework Magic', 
        beginner: 'Have you ever wondered how Django knows what your database tables look like just by reading your classes? It uses Metaclasses! It reads your class definition, steals the variables, and turns them into SQL commands behind the scenes.', 
        advanced: 'ORMs (Object-Relational Mappers) like SQLAlchemy and Django rely heavily on metaclasses to intercept class attributes (like `Column(Integer)`) and map them to internal schema registries. This allows developers to write pure Python objects that seamlessly translate into complex relational database queries.' 
      }
    ],
    { 
      title: 'The Auto-Registry (Plugin System)', 
      intro: 'Let\'s build a modern plugin registry using `__init_subclass__` that automatically tracks every new child class created, without needing a complex metaclass.', 
      steps: [
        'Open your terminal REPL (`>>>`).',
        'Define the base plugin class: Type `class PluginBase:` and press `Enter`.',
        'Type 4 spaces, then `registry = []` and press `Enter`.',
        'Type 4 spaces, then `def __init_subclass__(cls, **kwargs):` and press `Enter`.',
        'Type 8 spaces, then `super().__init_subclass__(**kwargs)` and press `Enter`.',
        'Type 8 spaces, then `cls.registry.append(cls)` and press `Enter`.',
        'Type 8 spaces, then `print(f"Registered new plugin: {cls.__name__}")` and press `Enter`.',
        'Press `Enter` to close the base class.',
        'Now create a child! Type `class PDFPlugin(PluginBase): pass` and press `Enter`.',
        'Watch the console instantly print "Registered new plugin: PDFPlugin"!',
        'Create another: `class ImagePlugin(PluginBase): pass`.',
        'Check the registry: Type `print(PluginBase.registry)` to see both classes automatically captured!'
      ], 
      goal: 'You successfully performed live runtime introspection and utilized the modern __init_subclass__ hook to build an automatic, decoupled plugin registry system.' 
    },
    [
      q('What is a Metaclass in Python?', ['A secret password', 'A "class of a class" that dictates how a class definition itself is constructed and instantiated', 'A database driver', 'A type of loop'], 1, 'Metaclasses are the blueprint for classes, intercepting the class creation process (via `__new__`) to allow for structural modifications and automated validation. **Why others are wrong:** They are not passwords, database drivers, or loops.'),
      q('Why would a developer use `getattr(obj, "attr_name")` instead of `obj.attr_name`?', ['To make the code faster', 'To dynamically access attributes when the attribute name is a variable or unknown until runtime', 'To prevent the computer from crashing', 'To save space'], 1, 'Dynamic access allows for "loosely coupled" code where you can interact with objects whose structure isn\'t known at compile-time (essential for plugin/API systems). **Why others are wrong:** It is actually slightly slower than direct dot-notation, does not prevent crashes, and does not save memory.'),
      q('What does `dir(obj)` return?', ['The object size in bytes', 'A list of all attributes and methods available on the object\'s namespace', 'The current directory path', 'A list of numbers'], 1, '`dir()` is the primary introspection tool for listing the contents of an object\'s namespace, including inherited dunder methods. **Why others are wrong:** It does not return byte size (use `sys.getsizeof`), file paths, or numbers.'),
      q('If you run `type(str)`, what does it return?', ['A string', '`type` (indicating that classes themselves are objects created by the `type` metaclass)', 'A boolean', 'A dictionary'], 1, 'Python is completely object-oriented; classes are objects, and their type is the `type` metaclass. **Why others are wrong:** `str` is a class, not an instance, so its type is the metaclass `type`, not a string, boolean, or dict.'),
      q('Why is `__init_subclass__` generally preferred over writing a custom Metaclass in modern Python?', ['It runs faster on the internet', 'It solves 90% of metaclass use-cases (like registries) with much simpler syntax, avoiding complex metaclass conflicts and inheritance headaches', 'It deletes old code automatically', 'It is the only way to create classes'], 1, '`__init_subclass__` provides a clean, explicit hook on the parent class for subclass creation, avoiding the deep magic, debugging nightmares, and multiple-inheritance conflicts associated with custom metaclasses. **Why others are wrong:** It does not affect network speed, auto-delete code, or replace standard class creation.')
    ],
    ['Classes themselves are objects created by Metaclasses (default is `type`).', 'Introspection (dir/getattr) lets you scan and query code structures dynamically while running.', 'Use Metaclasses (inheritance from type) only for deep framework-level architectural enforcement.', 'Prefer `__init_subclass__` for modern, clean plugin registries and subclass validation.', 'Dynamic attribute access enables powerful, decoupled, plugin-based architectures.']
  ),

  L('py-23', 23, 'Concurrent Futures', '⚡',
    '*If you want to use a big terminal, use your CMD. Full guide is in Lesson 1.*\n\n⚡ **Philosophy:** `asyncio` is incredible for network I/O, but it cannot help you when your CPU is melting trying to process 10,000 images or train a machine learning model. To break free from Python\'s single-core limitations, you must understand true Parallelism. The `concurrent.futures` module is your interface to multi-core hardware, allowing you to distribute heavy computational loads across every CPU core your machine possesses.',
    [
      { 
        title: '1. The Global Interpreter Lock (GIL)', 
        beginner: 'Python has a built-in "padlock" called the GIL. It only allows one thread to execute Python code at a time, even if you have an 8-core processor! This means standard threads won\'t speed up heavy math. You must use Processes to bypass it.', 
        advanced: 'The GIL is a mutex that protects access to Python objects, preventing multiple native threads from executing Python bytecodes at once. It exists because CPython\'s memory management (reference counting) is not thread-safe. To achieve true CPU parallelism, you must spawn separate OS processes, each with its own Python interpreter and GIL.' 
      },
      { 
        title: '2. ThreadPoolExecutor (I/O Bound)', 
        beginner: 'This launches multiple tasks at once in "threads." Because threads share memory, they are incredibly fast to start. Use them when your code is mostly *waiting* (downloading files, querying databases), because the GIL is released while waiting!', 
        advanced: 'Threads share the same memory space and process ID. They are highly efficient for I/O-bound concurrent operations because the GIL is released during blocking system calls (like network sockets or file reads), allowing other threads to execute while one waits.' 
      },
      { 
        title: '3. ProcessPoolExecutor (CPU Bound)', 
        beginner: 'This launches a separate "Python process." Each process gets its own CPU core and its own memory. If you need to do heavy image processing or math, this is your tool—it effectively bypasses the GIL and gives you real parallel speed!', 
        advanced: 'Processes have completely isolated memory spaces. They communicate via IPC (Inter-Process Communication) by serializing (pickling) data across boundaries. Use this strictly for CPU-bound tasks like encryption, compression, or data science modeling where the GIL would otherwise throttle performance.' 
      },
      { 
        title: '4. The Future Object & Callbacks', 
        beginner: 'When you submit a task to the pool, you don\'t get the result immediately. You get a "Future"—a placeholder object. It means: "I am working on it, I promise to have the result eventually." You can ask it `future.result()` later.', 
        advanced: 'Futures encapsulate the eventual state of an asynchronous operation. They support state monitoring (pending, running, finished), cancellation, and crucially, `.add_done_callback()`, which allows you to attach functions that automatically fire the exact millisecond the background task completes.' 
      },
      { 
        title: '5. The Overhead Trade-off', 
        beginner: 'Processes are powerful, but they are "heavy." It takes time and memory for the computer to build a whole new Python process. Don\'t use them for tiny, fast tasks, or the setup time will be longer than the task itself!', 
        advanced: 'Spawning a new OS process is significantly more "expensive" in terms of system resources and time than spawning a thread. Furthermore, the serialization (pickling) overhead of passing data between processes can become a massive bottleneck if the data payloads are too large.' 
      }
    ],
    { 
      title: 'The Parallel Processor (Breaking the GIL)', 
      intro: 'Let\'s use the `ProcessPoolExecutor` to run a heavy math calculation across multiple CPU cores simultaneously, proving we can outrun standard sequential code and bypass the GIL.', 
      steps: [
        'Open your normal system terminal (not the REPL, as multiprocessing requires saved files).',
        'Create a file named `parallel.py` and open it in your text editor.',
        'Import the tool: `from concurrent.futures import ProcessPoolExecutor`.',
        'Import math: `import math`.',
        'Define a heavy task: `def heavy_math(x): return sum(math.sqrt(i) for i in range(x))`.',
        'Add the main guard: `if __name__ == "__main__":`.',
        'Inside, setup the pool: `with ProcessPoolExecutor() as executor:`.',
        'Run: `results = list(executor.map(heavy_math, [5_000_000, 5_000_000, 5_000_000, 5_000_000]))`.',
        'Print: `print("Done!", len(results))`.',
        'Save the file and run it from your terminal: `python parallel.py`.',
        'Watch your CPU usage spike as all cores fire simultaneously to crush the math!'
      ], 
      goal: 'You successfully launched parallel CPU processes, bypassed the GIL for CPU-bound tasks, and aggregated the results using the executor map.' 
    },
    [
      q('What is the primary difference between a Thread and a Process in Python?', ['Threads are faster, Processes are slower', 'Threads share memory and are limited by the GIL; Processes have isolated memory and use separate CPU cores', 'Processes are for text, Threads are for numbers', 'There is no difference'], 1, 'Threads share a single process and memory space, constrained by the GIL, while Processes represent separate system tasks with their own memory, Python interpreter, and CPU core allocation. **Why others are wrong:** Speed depends on the task type, they are not restricted by data types, and they are fundamentally different OS constructs.'),
      q('When should you use a `ProcessPoolExecutor`?', ['For fast network calls', 'For CPU-heavy tasks like image processing, encryption, or heavy math calculations', 'For writing text files', 'For testing the internet'], 1, 'Processes break the GIL limitation, allowing for true parallel computation across multiple physical CPU cores for heavy mathematical logic. **Why others are wrong:** Network calls and file I/O are better suited for Threads or Asyncio due to the high overhead of process creation.'),
      q('What does a "Future" object represent?', ['An object that predicts the future', 'A placeholder for a result that will be calculated in the background eventually', 'A file that has been deleted', 'A type of constant'], 1, 'Futures serve as the bridge between background task submission and result retrieval, signaling the pending completion status of an execution thread or process. **Why others are wrong:** They do not predict events, represent deleted files, or act as constants.'),
      q('What happens if you use standard Threads to do heavy CPU math in Python?', ['The GIL makes it perform essentially no better than a single-threaded program because only one thread can execute Python bytecode at a time', 'It runs 100x faster', 'It deletes your hard drive', 'It turns off your CPU fan'], 0, 'Due to the Global Interpreter Lock (GIL), multiple Python threads cannot execute bytecode simultaneously, making them ineffective for pure CPU-bound mathematical operations. **Why others are wrong:** It does not speed up CPU math, delete drives, or control hardware fans.'),
      q('Why is passing massive datasets between Processes slower than passing them between Threads?', ['Processes use slower internet', 'Processes have isolated memory and must serialize (pickle) the data to pass it across OS boundaries, which takes significant CPU time', 'Threads encrypt the data', 'Processes refuse large data'], 1, 'Because processes do not share memory, data must be serialized (pickled) into bytes, sent via IPC, and deserialized on the other side, creating a massive overhead bottleneck for large payloads. **Why others are wrong:** It has nothing to do with internet speed, thread encryption, or arbitrary refusals.')
    ],
    ['Understand the GIL: Threads are for waiting (I/O), Processes are for calculating (CPU).', 'Use ThreadPoolExecutor for I/O-bound tasks (network/files) where the GIL is released.', 'Use ProcessPoolExecutor for CPU-bound tasks (math/images) to achieve true multi-core parallelism.', 'A Future object is a "promise" of a result that you can collect later or attach callbacks to.', 'Beware of pickling overhead: passing massive data between Processes can create severe bottlenecks.']
  ),

  L('py-24', 24, 'Packaging & Distribution', '📦',
    '*If you want to use a big terminal, use your CMD. Full guide is in Lesson 1.*\n\n📦 **Philosophy:** Writing brilliant code is only half the battle; delivering it to the world is the other. Packaging transforms your scattered `.py` files into a standardized, installable, and versioned asset. By mastering the modern Python packaging ecosystem, you transition from a solo scripter to an open-source contributor, capable of distributing your tools to millions of developers via `pip install`.',
    [
      { 
        title: '1. Project Structure & PEP 621', 
        beginner: 'Your project folder needs a specific layout. Put your code inside a sub-folder named after your project (the "package"), include a `README.md` for humans, and a `pyproject.toml` file for computers.', 
        advanced: 'The `pyproject.toml` (PEP 518/621) is the modern, unified standard for configuring builds. It defines build dependencies, project metadata, and tool configurations (like black, pytest, mypy) in a single declarative file, replacing the archaic and discouraged `setup.py` execution model.' 
      },
      { 
        title: '2. Build Backends (Hatch, Flit, Setuptools)', 
        beginner: 'The `pyproject.toml` file needs a "builder" to actually do the work. You can choose modern, fast builders like `hatch` or `flit`, or the classic `setuptools`. They read your manifesto and package your code correctly.', 
        advanced: 'PEP 517 introduced the concept of isolated build environments and pluggable build backends. Tools like `hatchling` or `flit-core` act as the backend, reading the `pyproject.toml` and generating the distribution artifacts without requiring the user to install build dependencies globally.' 
      },
      { 
        title: '3. Source Distributions (sdist) vs Wheels (.whl)', 
        beginner: 'You don\'t upload your raw `.py` files to the internet. You build a "Wheel" (a `.whl` file). It is a zipped, pre-compiled package that `pip` knows how to unpack instantly. It is the gold standard for easy distribution.', 
        advanced: 'Wheels (PEP 427) are binary distributions that bypass the need for end-users to compile C-extensions from source, drastically reducing installation time. Source distributions (`sdist`, `.tar.gz`) contain the raw source and build scripts, acting as a fallback for platforms without pre-built wheels.' 
      },
      { 
        title: '4. PyPI & Twine', 
        beginner: 'PyPI (Python Package Index) is the "App Store" for Python. You upload your Wheel file to PyPI using a secure tool called `twine`, and suddenly anyone in the world can run `pip install your-package-name`.', 
        advanced: 'PyPI enforces strict namespace security and requires API tokens for authentication. Always use TestPyPI to verify your build configuration, metadata rendering, and wheel integrity before deploying to the global public repository, as uploads are permanent and cannot be overwritten.' 
      },
      { 
        title: '5. Entry Points (CLI Tools)', 
        beginner: 'Want your package to be a command-line tool? You can add an "entry point" in your config. This tells Python: "When the user types `my-tool` in the terminal, run this specific function!"', 
        advanced: 'The `[project.scripts]` table in `pyproject.toml` defines console entry points. The build backend generates wrapper executable scripts in the user\'s `bin/` or `Scripts/` directory that bootstrap the Python environment and invoke your designated module function.' 
      }
    ],
    { 
      title: 'The Manifest Builder & Wheel Inspection', 
      intro: 'Let\'s create a modern project manifest (`pyproject.toml`), build a distributable Wheel, and inspect its contents to understand how pip installs it.', 
      steps: [
        'Open your terminal and create a new folder: `mkdir my_tool && cd my_tool`.',
        'Create the source folder: `mkdir src` then `mkdir src/my_tool`.',
        'Create an empty init file: `touch src/my_tool/__init__.py` (or `New-Item` on Windows).',
        'Create the manifesto: Open `pyproject.toml` in your editor and add: `[build-system] requires = ["hatchling"] build-backend = "hatchling.build"`.',
        'Add metadata: `[project] name = "my-cool-tool" version = "0.1.0"`.',
        'Save the file and close the editor.',
        'Install the build frontend: `pip install build`.',
        'Build the project: `python -m build`.',
        'Look inside your new `dist/` folder. You will see a `.whl` file and a `.tar.gz` file!',
        'Inspect the wheel (it is just a zip file!): Rename the `.whl` to `.zip`, extract it, and look at the `METADATA` file inside to see your manifesto in action!'
      ], 
      goal: 'You successfully transitioned your local code into a standardized PEP 621 package structure, configured a modern build backend, and generated a distributable binary wheel.' 
    },
    [
      q('What is the modern standard file used for configuring Python package builds, metadata, and tool settings?', ['`setup.py`', '`pyproject.toml`', '`config.txt`', '`manifest.xml`'], 1, 'PEP 518/621 standardized `pyproject.toml` as the declarative, unified configuration file for building Python projects and configuring linters/formatters. **Why others are wrong:** `setup.py` is the legacy, executable-based standard that is now discouraged. The others are not Python standards.'),
      q('Why is a "Wheel" (.whl) better than just sending your raw source code files (sdist) to others?', ['It is smaller', 'It is a pre-compiled, standardized format that makes installation instant and eliminates compilation errors on the user\'s machine', 'It looks cooler', 'It is easier to hack'], 1, 'Wheels are binary distributions that bypass local compilation requirements (especially for C-extensions), making installation reliable, fast, and platform-independent. **Why others are wrong:** They are not necessarily smaller, "cooler", or easier to hack; they are strictly an installation optimization.'),
      q('What is PyPI?', ['A file hosting service', 'The Python Package Index, the global "App Store" where developers upload packages for universal download via pip', 'A type of encryption', 'A secret Python club'], 1, 'PyPI is the centralized, official repository for Python packages, powering the global ecosystem you access every time you run `pip install`. **Why others are wrong:** It is specifically for Python packages, not generic file hosting, encryption, or a social club.'),
      q('What tool is officially recommended to securely upload your finished build to the PyPI repository?', ['`build`', '`twine`', '`upload`', '`pip`'], 1, '`twine` is the standard, secure utility used for authenticating (via API tokens) and uploading built distribution packages to PyPI over HTTPS. **Why others are wrong:** `build` creates the artifacts. `pip` downloads/installs them. `upload` is not a standard Python CLI tool.'),
      q('How do you make your installed package executable directly from the terminal (e.g., typing `my-tool` instead of `python -m my_tool`)?', ['By naming the file `run.py`', 'By defining a console script entry point in the `[project.scripts]` section of `pyproject.toml`', 'By uploading it to GitHub', 'By making the file hidden'], 1, 'The `[project.scripts]` table defines console entry points, instructing the build backend to generate executable wrapper scripts in the user\'s system PATH. **Why others are wrong:** File names, GitHub uploads, and hidden attributes do not create global terminal commands.')
    ],
    ['Use `pyproject.toml` (PEP 621) as your single, declarative configuration manifest.', 'Rely on modern build backends like Hatch or Flit instead of legacy `setup.py` scripts.', 'Package your code into binary Wheel (.whl) files for instant, compilation-free distribution.', 'Use `twine` to securely upload your builds to the public PyPI registry via API tokens.', 'Define `[project.scripts]` entry points to turn your library into a global terminal command.']
  ),

  L(
  'py-25', 25, 'Python Memory Model & Performance', '🧠', 
  '*If you want to use a big terminal, use your CMD. Full guide is in Lesson 1.*\n\n🧠 **Philosophy:** Memory isn\'t just an infinite bucket; it is a physical, finite resource governed by the laws of hardware. Python\'s automatic garbage collector tricks developers into thinking memory optimization is irrelevant. In reality, large applications frequently experience heavy performance degradation due to massive memory bloating, hidden object references, and CPU cache misses. By mastering Python’s internal allocation model, object referencing, and profiling systems, you transition from writing code that "just works" to engineering high-throughput systems that respect the physical limitations of the machine.',
  [
    { 
      title: '1. Reference Counting & The GC', 
      beginner: 'Think of every piece of data you create in Python as a floating party balloon, and variables as strings tied to it. Every time you point a new variable at that data, you tie another string. Python keeps a tally of these strings. The exact millisecond the tally hits zero (all strings are cut), the balloon instantly vanishes from existence, freeing up room in your house.', 
      advanced: 'Python\'s primary memory management system is deterministic Reference Counting. However, reference counting fails when objects refer to each other in an isolated circle (Cyclic References). To resolve this, Python runs a cyclical Garbage Collector (GC) that periodically sweeps through three distinct memory "generations", detecting un-killable loops and purging stranded object clusters from memory allocations.' 
    },
    { 
      title: '2. Object Memory & __slots__', 
      beginner: 'By default, Python treats custom objects like a massive, open-ended cardboard box where you can throw any new variable name at runtime. This box is powered by a hidden dictionary that consumes massive amounts of RAM. By using a feature called `__slots__`, you replace that bulky cardboard box with a sleek, perfectly sized plastic tray with exact fixed slots, cutting down your RAM usage by up to 70%.', 
      advanced: 'Every standard class instance stores its attributes inside a dynamic dictionary instance variable named `__dict__`. Dicts are highly optimized for speed but memory-intensive due to underlying hash table structures and sparse arrays. Defining `__slots__ = ("attribute1", "attribute2")` explicitly bypasses `__dict__` entirely, allocating a highly compressed, fixed-size C-array structure in memory that is critical when generating millions of micro-objects.' 
    },
    { 
      title: '3. Profiling with Timeit & CProfile', 
      beginner: 'If your web server is running slowly, guessing which function is broken is a waste of time. Python provides a quick stopwatch tool called `timeit` for checking small code clips, and a full medical diagnostic system called `cProfile` that records every single internal function call, tracking exactly how many milliseconds each operation took.', 
      advanced: '`cProfile` is a deterministic execution profiler. It hooks into the Python interpreter\'s C-level evaluation loop to record call counts and cumulative execution times. Analyzing cProfile text reports or parsing them into visual flame graphs allows engineers to locate internal bottlenecks, such as deep recursive loop overloads or sluggish database queries, with scientific precision.' 
    },
    { 
      title: '4. Production Optimization Strategies', 
      beginner: 'Optimizing code doesn\'t mean writing cryptic hacks; it means picking the right tools built into Python. Using fast loops called list comprehensions, avoiding unnecessary global lookups, and reusing objects instead of recreating them constantly is how you build lightning-fast code.', 
      advanced: 'High-performance Python architectures rely heavily on memory locality and caching. Developers optimize loops by binding global functions to local variables (bypassing the `LOAD_GLOBAL` bytecode instruction), replacing expensive string concatenations with `"".join()`, and utilizing generator streams to keep memory profiles flat.' 
    },
    { 
      title: '5. Memory Fragmentation & CPU Caches (Expert Teaser)', 
      beginner: 'Your computer\'s brain (CPU) has a tiny, super-fast short-term memory called a "Cache". If your data is stored neatly in a row, the CPU grabs it instantly. If your data is scattered randomly all over the place, the CPU wastes time hunting for it. Keeping data organized is the secret to true speed!', 
      advanced: '*(Pro Track Preview)* Hardware relies on spatial locality. Iterating over a contiguous C-array is vastly faster than traversing a linked list of scattered Python objects because the CPU prefetches memory into L1/L2 cache lines (typically 64 bytes). In the Expert track, we explore how CPython allocates memory in 4KB pages and how to write C-extensions to bypass Python\'s object overhead entirely.' 
    }
  ],
  {
    title: 'High-Performance Data Optimizer',
    intro: 'We will write a memory-intensive geolocation processing engine that purposefully strains system RAM, track its footprint, and then completely optimize it using low-level internal memory architectures.',
    steps: [
      'Open your normal system terminal and create a new file named `memory_test.py` using your text editor.',
      'Import the size tracker: `import sys`.',
      'Define the bloated class: `class LegacyPoint:` followed by `def __init__(self, x, y, z): self.x=x; self.y=y; self.z=z`.',
      'Define the optimized class: `class OptPoint:` followed by `__slots__ = ["x", "y", "z"]` and the exact same `__init__`.',
      'Write a test loop at the bottom: `legacy = [LegacyPoint(1,2,3) for _ in range(100_000)]`.',
      'Write the optimized loop: `opt = [OptPoint(1,2,3) for _ in range(100_000)]`.',
      'Print the sizes: `print("Legacy:", sys.getsizeof(legacy[0]) + sys.getsizeof(legacy[0].__dict__))`.',
      'Print the optimized size: `print("Optimized:", sys.getsizeof(opt[0]))`.',
      'Save the file and run it from your terminal: `python memory_test.py`.',
      'Watch the terminal output! You will see the Legacy object consuming roughly 200+ bytes, while the `__slots__` object drops to under 70 bytes. You just saved 65% of your RAM!'
    ],
    goal: 'You successfully diagnosed a major system memory bloat and optimized an enterprise application footprint by mastering Python object allocation internals and the __slots__ C-array mapping.'
  },
  [
    q('What is a cyclic reference error in Python memory management, and how is it resolved?', ['An infinite loop that crashes the CPU; resolved by changing variable names', 'When two or more objects hold reference pointers to each other, preventing reference counts from hitting zero; resolved by the cyclical Garbage Collector', 'When an object is saved to a hard drive incorrectly; resolved by deleting the files', 'A syntax error caused by importing files recursively'], 1, 'Reference counting alone cannot free objects trapped in isolated loops of mutual references (e.g., A points to B, B points to A). Python relies on its generational garbage collector to sweep and free these cyclic blocks. **Why others are wrong:** It is not an infinite CPU loop, a hard drive error, or a syntax error.'),
    q('What is the direct low-level mechanical consequence of defining `__slots__` inside a custom Python class?', ['It automatically encrypts class attributes for secure storage', 'It completely bypasses the creation of the memory-heavy instance dictionary (`__dict__`), utilizing a highly compressed fixed array instead', 'It forces the class to execute inside a separate thread automatically', 'It allows the class to inherit from multiple abstract base classes at once'], 1, 'By eliminating the dynamic attribute dictionary container, `__slots__` significantly compresses the per-object memory footprint, mapping attributes to a fixed C-array. **Why others are wrong:** It does not encrypt data, spawn threads, or alter inheritance rules.'),
    q('Which built-in module should an engineer use to run a highly accurate, isolated micro-benchmark on a specific tiny code snippet?', ['unittest', 'timeit', 'sys', 'logging'], 1, 'The `timeit` module temporarily disables the garbage collector and runs snippet executions millions of times inside an isolated environment to provide highly accurate, unpolluted timing benchmarks. **Why others are wrong:** `unittest` is for logical assertions. `sys` is for system parameters. `logging` is for text output.'),
    q('What performance danger is introduced when writing deep loops that reference variables located in the global scope?', ['Global variables are automatically deleted during loop cycles', 'Global variables trigger automatic database updates on every lookup', 'Python must perform an expensive, multi-layered namespace dictionary lookup on every single iteration of the loop', 'Global scope lookups consume twice as much network bandwidth'], 2, 'Looking up global names inside loops forces Python to continuously execute the `LOAD_GLOBAL` bytecode instruction, querying scope dictionaries. Binding global variables to local references before entering tight loops optimizes bytecode execution paths via `LOAD_FAST`. **Why others are wrong:** It does not delete variables, trigger databases, or consume network bandwidth.'),
    q('Why does iterating over a standard Python List generally execute faster than iterating over a custom Linked List structure?', ['Lists use less internet bandwidth', 'Lists store data contiguously in memory, allowing the CPU\'s L1/L2 Cache to prefetch data efficiently via spatial locality', 'Lists are written in Java', 'Linked lists are illegal in Python'], 1, 'Hardware relies on spatial locality. Contiguous memory layouts (like C-arrays backing Python lists) allow the CPU to prefetch memory into ultra-fast cache lines, whereas scattered Linked List nodes cause constant "cache misses". **Why others are wrong:** It has nothing to do with internet, Java, or legality.')
  ],
  ['Leverage __slots__ whenever your application needs to instantiate millions of small data-holding models to slash RAM usage.', 'Never guess performance paths; always generate precise cProfile trace reports to locate actual compute bottlenecks.', 'Be mindful of object reference lifecycles to avoid accidentally keeping massive data sets alive in the global execution scope.', 'Bind global functions to local variables inside tight loops to bypass expensive namespace dictionary lookups.', 'Understand that hardware CPU caches favor contiguous memory layouts (spatial locality) over scattered objects.']
),

L(
  'py-26', 26, 'Advanced Object-Oriented Python', '🏛️', 
  '*If you want to use a big terminal, use your CMD. Full guide is in Lesson 1.*\n\n🏛️ **Philosophy:** Basic Object-Oriented Programming is about modeling reality. *Advanced* OOP is about modeling the *rules* of reality. To build frameworks that are truly elegant, you must master meta-programming tools that intercept and manipulate class creation itself. By controlling the Method Resolution Order, creating abstract guardrails, and managing class metadata with descriptors, you transition from someone who merely consumes tools to an architect who builds the frameworks that other developers use.',
  [
    { 
      title: '1. Dataclasses & Immutability', 
      beginner: 'Writing a class that just holds data usually requires writing lines of boring boilerplate code. A `@dataclass` automatically generates all that boilerplate for you out of the box. Meanwhile, setting it to "frozen" acts like a glass display case—once the data is put inside, it can never be changed, keeping it perfectly safe!', 
      advanced: 'Dataclasses use class decorators to dynamically inspect type annotations and generate standard dunder methods like `__init__`, `__repr__`, and `__eq__` at compile-time. Utilizing `frozen=True` enforces perfect object immutability, which automatically makes the instances hashable and incredibly safe to pass around across concurrent thread operations or use as dictionary keys.' 
    },
    { 
      title: '2. Abstract Base Classes (ABCs)', 
      beginner: 'Think of an Abstract Base Class as a strict structural building code issued by a city. You can\'t physically move into a building code—it\'s just words on paper. However, if any developer wants to construct a real house in the city, the building code forces them to include a front door and a roof, or the inspector halts construction.', 
      advanced: 'Python\'s `abc` module enforces formal interface specifications at the instantiation phase. A class that inherits from an ABC and uses the `@abstractmethod` decorator cannot be instantiated unless *all* abstract methods are fully implemented by the child class. This is a foundational requirement for building robust, contract-driven object patterns in enterprise applications.' 
    },
    { 
      title: '3. Multiple Inheritance & MRO', 
      beginner: 'Python allows a single class to inherit traits from multiple different parent classes at the same time. If two parents have a method with the exact same name, Python follows a highly structured family tree rulebook called the Method Resolution Order (MRO) to determine precisely which parent\'s advice it should listen to first.', 
      advanced: 'Python resolves inheritance paths utilizing the C3 Linearization Algorithm. This deterministic ordering can be inspected at any time via the `.mro()` method on a class. Understanding MRO is absolutely vital to properly leveraging the behavior of `super()`, preventing the classic "Diamond Inheritance Hazard" where methods are accidentally run multiple times or completely bypassed.' 
    },
    { 
      title: '4. Descriptors & Metaclasses', 
      beginner: 'A "Descriptor" is a reusable validation guard tool that you can share across completely different classes to keep bad data out. A "Metaclass" is the ultimate power tool: it is a class that builds other classes, allowing you to intercept and modify how code structures are assembled before the program even starts.', 
      advanced: 'Descriptors are objects that implement the `__get__`, `__set__`, or `__delete__` protocol methods, taking total control over attribute access lookup chains at the class level. Metaclasses inherit directly from `type`. By overriding a metaclass\'s `__new__` method, developers can inspect, register, or rewrite class definitions globally, which is exactly how modern frameworks like Django and Pydantic implement their data models.' 
    },
    { 
      title: '5. The `__post_init__` Hook', 
      beginner: 'Sometimes a dataclass needs to do some math or setup right after it is born, but you can\'t write a normal `__init__` because the dataclass already wrote one for you! `__post_init__` is a special backdoor that runs immediately after the automatic setup finishes.', 
      advanced: 'When using `@dataclass`, the generated `__init__` method automatically calls `__post_init__(self)` at the very end of its execution. This is the designated hook for deriving secondary attributes, validating complex cross-field constraints, or initializing external resources without overriding the auto-generated constructor signature.' 
    }
  ],
  {
    title: 'Mini Validation ORM Framework',
    intro: 'We are going to engineer a micro Object-Relational Mapping (ORM) framework architecture that uses abstract base classes and custom descriptors to dynamically enforce data validation on custom classes.',
    steps: [
      'Open your terminal REPL (`>>>`).',
      'Import the tools: `from abc import ABC, abstractmethod`.',
      'Create the Descriptor: Type `class IntegerGuard:` and press `Enter`.',
      'Type 4 spaces, then `def __set_name__(self, owner, name): self.name = name` and press `Enter`.',
      'Type 4 spaces, then `def __set__(self, obj, value):` and press `Enter`.',
      'Type 8 spaces, then `if not isinstance(value, int): raise TypeError("Must be int")` and press `Enter`.',
      'Type 8 spaces, then `obj.__dict__[self.name] = value` and press `Enter`.',
      'Press `Enter` to close the Descriptor.',
      'Create the ABC: Type `class Model(ABC):` and press `Enter`.',
      'Type 4 spaces, then `@abstractmethod` and press `Enter`.',
      'Type 4 spaces, then `def save(self): pass` and press `Enter`.',
      'Press `Enter` to close the ABC.',
      'Create the final class: Type `class User(Model):` and press `Enter`.',
      'Type 4 spaces, then `age = IntegerGuard()` and press `Enter`.',
      'Type 4 spaces, then `def save(self): print("Saved!")` and press `Enter`.',
      'Press `Enter` to close. Test it: `u = User()`. Try `u.age = "twenty"` and watch the Descriptor block it!'
    ],
    goal: 'You successfully built an industrial-grade architectural framework utilizing advanced OOP, descriptors, and class structural contracts.'
  },
  [
    q('What advanced architectural challenge does Python\'s C3 Linearization Algorithm solve?', ['It automatically encrypts multiple class files for security compliance', 'It cleanly defines the deterministic Method Resolution Order (MRO) for resolving attributes during complex multiple inheritance configurations', 'It compiles Python objects down to native machine code structures', 'It prevents classes from taking up excess space inside the memory model'], 1, 'C3 Linearization guarantees a reliable, predictable lookup sequence across complex multiple inheritance class networks, ensuring `super()` execution flows smoothly without unexpected skips or infinite loops. **Why others are wrong:** It does not encrypt, compile to machine code, or manage memory size.'),
    q('What happens if a developer attempts to instantiate a child class that inherits from an Abstract Base Class but forgets to write code for one of its `@abstractmethod` decorators?', ['Python creates a blank placeholder method automatically and runs without crashing', 'The class instantiates perfectly but logs a critical warning to terminal outputs', 'Python immediately throws a fatal `TypeError` at instantiation time, blocking object creation', 'The entire script crashes with a low-level memory allocation error'], 2, 'Abstract Base Classes enforce architectural design patterns; you cannot instantiate a subclass unless it satisfies every contractual obligation defined by abstract methods. **Why others are wrong:** Python does not auto-generate placeholders, log silent warnings, or crash the memory allocator. It strictly raises a `TypeError` upon calling the class constructor.'),
    q('What low-level dunder protocols must an object implement to officially be recognized as a reusable Python Descriptor?', ['`__enter__` and `__exit__` exclusively', '`__iter__` and `__next__` exclusively', 'At least one of the `__get__`, `__set__`, or `__delete__` method operations', '`__init__` and `__repr__` exclusively'], 2, 'Descriptors manage class attribute lookups by binding directly to the low-level object attribute access pathways via the get/set/delete protocols. **Why others are wrong:** `__enter__`/`__exit__` are for Context Managers. `__iter__`/`__next__` are for Iterators. `__init__`/`__repr__` are standard lifecycle methods.'),
    q('What is the fundamental relationship between a standard Class and a Metaclass in Python architecture?', ['A metaclass is a class that inherits from a dataclass container', 'A standard class defines how its individual object instances behave, while a metaclass defines how class structures themselves are created and configured', 'Metaclasses are older legacy structures that have been replaced by standard class configurations', 'A metaclass is a special function used to delete class configurations from memory'], 1, 'Metaclasses are the factories that construct class definitions. They inherit from `type`, providing deep hook pathways to modify class architectures at runtime initialization phases. **Why others are wrong:** They do not inherit from dataclasses, are not legacy (they power modern ORMs), and do not delete memory.'),
    q('When using the `@dataclass` decorator, what is the specific purpose of the `__post_init__` method?', ['It runs before the class is defined to check for syntax errors', 'It executes automatically at the very end of the auto-generated `__init__` method, allowing for derived attribute calculation or complex validation', 'It deletes the object from memory when the script ends', 'It converts the dataclass into a standard dictionary'], 1, 'Because `@dataclass` auto-generates the `__init__` method, `__post_init__` serves as the designated hook to run custom logic immediately after the standard fields are assigned. **Why others are wrong:** It does not run before definition, delete memory, or convert to dictionaries.')
  ],
  ['Use @dataclass with frozen=True to create lightweight, immutable, and thread-safe data models effortlessly.', 'Enforce rigorous engineering standards across multi-developer codebases by integrating Abstract Base Classes (ABCs).', 'Always query class.mro() to visually map out and understand complex multiple inheritance lookup structures.', 'Leverage custom descriptors to isolate validation algorithms away from core business data definitions.', 'Utilize __post_init__ in dataclasses to safely compute derived attributes after auto-initialization.']
),

L(
  'py-27', 27, 'Databases with Python', '🗄️', 
  '*If you want to use a big terminal, use your CMD. Full guide is in Lesson 1.*\n\n🗄️ **Philosophy:** Code is ephemeral; data is permanent. An application is only as powerful as its ability to safely store, query, and manipulate data. Writing data to loose text files eventually corrupts under concurrent load. Production applications rely on relational database management systems (RDBMS). Moving beyond raw SQL strings, professional Python engineers utilize Object-Relational Mappings (ORMs) and connection pools to write highly maintainable, optimized, and scalable data-access layers.',
  [
    { 
      title: '1. SQL Fundamentals & SQLite', 
      beginner: 'Think of a relational database as a giant digital filing cabinet packed with highly organized spreadsheets called tables. Each table has rigid columns (like First Name or Age) and infinite rows of actual data. Python comes with a built-in database named SQLite that saves everything into a single file on your computer, allowing you to search and filter records using a language called SQL.', 
      advanced: 'SQLite is an in-process, serverless library ideal for local storage, caching, and testing. Python\'s `sqlite3` driver requires explicitly opening connections and managing execution `cursors`. To defend against fatal SQL injection attacks, developers must never use python string formatting to build queries; instead, they pass arguments as parameterized tuples to let the underlying database engine safely escape inputs.' 
    },
    { 
      title: '2. SQLAlchemy & ORM Patterns', 
      beginner: 'Writing raw SQL code inside your Python scripts can quickly become messy and hard to read. An Object-Relational Mapper (ORM) like SQLAlchemy acts as an automatic translator. It allows you to represent a database table as a standard Python Class, and rows of data as regular Python object instances, letting you look up or update data using clean Python code.', 
      advanced: 'SQLAlchemy utilizes the powerful Data Mapper pattern, splitting database schema layout from business domain models. Managing database interactions relies heavily on the `Session` object, which implements the Unit of Work design pattern. Engineers must be highly careful with the "N+1 Query Problem"—where a loop lazily loads database relationships one row at a time. This is mitigated by explicitly configuring `joinedload` or `subqueryload` for eager fetching.' 
    },
    { 
      title: '3. PostgreSQL & Enterprise Concepts', 
      beginner: 'While SQLite is excellent for small projects, it locks up when hundreds of people try to write data at the exact same millisecond. Enterprise apps scale up to PostgreSQL—a separate, massive database server architecture that lives on a dedicated cloud machine designed to run heavy multi-user workloads simultaneously without ever losing data.', 
      advanced: 'PostgreSQL scales via strict enforcement of ACID compliance (Atomicity, Consistency, Isolation, Durability). Optimizing production databases requires Python developers to understand indexes, constraint checks, and database performance metrics. You can write custom raw execution steps or migration files using tools like Alembic to safely update live production schemas without causing server downtime.' 
    },
    { 
      title: '4. Connection Pooling Mechanics', 
      beginner: 'Every single time your code asks the database a question, establishing a new network path across the internet takes significant time and energy. Connection Pooling is like keeping a collection of open, pre-verified communication lines standing by in a lounge room. When a request comes in, it immediately grabs an open line, uses it, and drops it back in the pool for the next person.', 
      advanced: 'Instantiating a database connection requires a heavy TCP handshake and authentication overhead. SQLAlchemy manages this transparently using an internal connection pool. Engineers must configure pool parameters carefully for production workloads, optimizing settings like `pool_size` (the total number of permanent connections to keep open) and `max_overflow` (temporary extra lanes allowed under sudden traffic spikes) to prevent socket exhaustion.' 
    },
    { 
      title: '5. Database Indexing & B-Trees (Expert Teaser)', 
      beginner: 'If you have a million books in a library, finding one by reading every single title takes forever. An "Index" is like a master catalog at the front desk that tells you exactly which shelf the book is on. It makes searching lightning fast!', 
      advanced: '*(Pro Track Preview)* Databases utilize B-Tree (Balanced Tree) data structures to implement indexes. While an index reduces lookup time from $O(n)$ full-table scans to $O(\log n)$ tree traversals, it introduces write-amplification overhead because the tree must be rebalanced on every `INSERT` or `UPDATE`. In the Expert track, we analyze query execution plans (`EXPLAIN ANALYZE`) to optimize composite indexes.' 
    }
  ],
  {
    title: 'Production Inventory Management System',
    intro: 'We are going to construct an enterprise-grade inventory management layer using SQLAlchemy to map Python data models directly into a relational database engine with automated schema generation.',
    steps: [
      'Open your terminal and ensure SQLAlchemy is installed (`pip install sqlalchemy`).',
      'Create a file named `inventory.py` and open it in your text editor.',
      'Import the tools: `from sqlalchemy import create_engine, Column, Integer, String` and `from sqlalchemy.orm import declarative_base, Session`.',
      'Initialize the base: `Base = declarative_base()`.',
      'Define the model: `class Item(Base):` followed by `__tablename__ = "items"`.',
      'Add columns: `id = Column(Integer, primary_key=True)` and `name = Column(String)` and `qty = Column(Integer)`.',
      'Create the engine: `engine = create_engine("sqlite:///:memory:")`.',
      'Build the tables: `Base.metadata.create_all(engine)`.',
      'Add data: `with Session(engine) as db:` followed by `db.add(Item(name="Apple", qty=50))` and `db.commit()`.',
      'Query data: `result = db.query(Item).filter_by(name="Apple").first()`.',
      'Print the result: `print(f"Found {result.name} with {result.qty} in stock!")`.',
      'Save and run the file: `python inventory.py`. Watch your Python objects seamlessly translate into SQL!'
    ],
    goal: 'You successfully engineered a relational data access layer using professional ORM architecture, mapping object-oriented models to structured database tables.'
  },
  [
    q('What is the fundamental danger of utilizing standard Python string formatting (like f-strings) to inject user input directly into a SQL statement?', ['The database query will execute significantly slower', 'It introduces highly critical SQL Injection vulnerabilities, allowing malicious actors to wipe out or steal database records', 'Python will immediately throw a syntax compilation error', 'The database will automatically convert all integers into text variables'], 1, 'String formatting patches raw user text directly into database command lines; parameterized inputs isolate the data parameters completely, rendering injection attacks harmless. **Why others are wrong:** It does not inherently slow down the query, trigger Python syntax errors, or auto-convert types. It creates a severe security hole.'),
    q('Which software architecture pattern describes the behavior of a database Session acting as a checkpoint that tracks changes before committing them all at once?', ['The Singleton Pattern', 'The Unit of Work Pattern', 'The Factory Pattern', 'The Model-View-Controller Pattern'], 1, 'The Unit of Work pattern maintains a list of database transactions affected by a business workflow and coordinates the writing out of changes in a single unified block (commit). **Why others are wrong:** Singleton restricts instantiation. Factory creates objects. MVC separates UI from logic.'),
    q('How does the "N+1 Query Problem" typically manifest inside an unoptimized Python ORM data pipeline?', ['The application runs out of memory because the database returns too much data at once', 'The application fires one initial query to fetch a list of items, and then executes an additional separate database query for every single row in that list to fetch related data, destroying performance', 'The script crashes because multiple users attempt to edit the same column simultaneously', 'The ORM fails to parse the incoming date strings correctly'], 1, 'Lazy loading causes the ORM to poll the database repetitively inside loops; loading relationships eagerly via joins aggregates data into a single efficient query execution. **Why others are wrong:** It is not a memory overflow, a concurrency crash, or a parsing error. It is strictly a network latency bottleneck caused by excessive round-trips.'),
    q('What is the primary operational objective of establishing a Connection Pool configuration for a database client?', ['To encrypt database passwords using advanced security protocols', 'To reduce performance lag by keeping a collection of active, reusable database connections open, avoiding the time overhead of creating new paths repeatedly', 'To automatically backup database records to cloud storage', 'To completely replace the need for writing Python models'], 1, 'Connection pools eliminate the heavy setup and teardown network costs associated with spinning up a separate database connection channel for every individual user action. **Why others are wrong:** Pools do not encrypt passwords, backup data, or replace ORM models.'),
    q('What is the trade-off of adding a Database Index to a table column?', ['It makes the database file smaller', 'It drastically speeds up read (SELECT) queries but slows down write (INSERT/UPDATE) operations because the index tree must be rebalanced', 'It encrypts the column data', 'It prevents users from deleting rows'], 1, 'Indexes utilize B-Tree structures to reduce lookup time to $O(\log n)$, but every write operation requires updating and rebalancing the tree, introducing write-amplification overhead. **Why others are wrong:** Indexes increase file size, do not encrypt data, and do not prevent deletions.')
  ],
  ['Never use string interpolation to create database queries; always pass parameters via secure driver tuples.', 'Leverage ORM engines like SQLAlchemy to abstract database vendor dialects away from your core code components.', 'Be highly vigilant against the N+1 query trap by configuring eager relationship joins inside heavy application loops.', 'Tune connection pool properties appropriately to handle multi-threaded concurrency spikes in high-volume microservices.', 'Understand that Database Indexes speed up reads but introduce write-amplification overhead.']
),

L(
  'py-28', 28, 'API Development with Python', '🌐', 
  '*If you want to use a big terminal, use your CMD. Full guide is in Lesson 1.*\n\n🌐 **Philosophy:** Modern applications do not live in isolation; they communicate across global server networks using Application Programming Interfaces (APIs). Building web services requires an engineering understanding of network protocols, semantic routing structures, and payload parsing pipelines. By shifting away from legacy web frameworks and adopting modern, asynchronous REST architectures like FastAPI, Python engineers can build self-documenting web services capable of processing massive concurrent traffic volumes.',
  [
    { 
      title: '1. HTTP & REST Architecture', 
      beginner: 'Imagine an API as a highly efficient waiter working inside a busy restaurant. You (the client web browser) don\'t walk into the kitchen to cook food; instead, you look at a menu and ask the waiter using standard phrases. In the web world, these phrases are HTTP actions: `GET` to fetch data, `POST` to create something new, and standard status numbers like `200 OK` or `404 Not Found` to tell you if the order succeeded.', 
      advanced: 'Representational State Transfer (REST) is a stateless architectural style for designing networked applications. It treats web data as unique resources mapped to structured Uniform Resource Identifiers (URIs). Systems communicate using standard HTTP metadata headers, content negotiation frameworks (typically parsing application/json data structures), and clear status definitions to manage interface contracts cleanly.' 
    },
    { 
      title: '2. FastAPI & Asynchronous ASGI', 
      beginner: 'Traditional web systems process incoming requests like a single file line at a bank teller—if the person at the front takes ten seconds to check a database, everyone else stands waiting. FastAPI uses a modern "Asynchronous" engine. It lets the bank teller take a request, hand it off to the database, and immediately serve the next customer in line while waiting for the first data to come back.', 
      advanced: 'FastAPI is built natively on the Asynchronous Server Gateway Interface (ASGI) specification, typically hosted via production runners like Uvicorn. By defining routes using async keywords (`async def`), operations execute concurrently via the Python Event Loop, making FastAPI incredibly performant for I/O-bound web operations and streaming webhooks.' 
    },
    { 
      title: '3. Pydantic Data Validation', 
      beginner: 'When random users send data to your web API, you cannot trust them blindly. If a route expects an age number but someone sends the text word "banana", your database will break. FastAPI fixes this using a tool called Pydantic. It acts as an automatic filter checklist that screens incoming data before it ever hits your main code, blocking bad inputs instantly.', 
      advanced: 'Pydantic enforces runtime type safety using Python type hints. When a request arrives, Pydantic parses incoming JSON, validates fields against a strict `BaseModel` schema, coerces data types where safe, and produces structured errors automatically. This input parsing layer shields internal business boundaries from malformed external data injections.' 
    },
    { 
      title: '4. Stateless Token Security', 
      beginner: 'An API shouldn\'t require a user to log in with a password every time they click a button. Instead, when they log in once, the server hands them a secure, digital wristband called a JWT token. The browser includes this token in the header of every future message. The server can verify the wristband is authentic without needing to run slow database lookups every single time.', 
      advanced: 'JSON Web Tokens (JWT) allow for completely stateless authorization architectures. A JWT contains a cryptographically signed payload (including expiration timestamps and user scope arrays) verified at the API routing gate using a secret hashing key. FastAPI utilizes Dependency Injection systems via `Depends` to natively resolve token extraction, user validation, and route privilege guards.' 
    },
    { 
      title: '5. WSGI vs ASGI (Expert Teaser)', 
      beginner: 'Older web frameworks were built for a simpler internet where one request meant one full task. Modern frameworks use a new standard (ASGI) that allows the server to juggle thousands of half-finished tasks at once, making it perfect for live chat apps and real-time notifications!', 
      advanced: '*(Pro Track Preview)* WSGI (Web Server Gateway Interface) is a synchronous, blocking protocol that maps one thread to one request. ASGI (Asynchronous Server Gateway Interface) introduces a two-callable interface supporting async lifecycles, WebSockets, and HTTP/2 server push. In the Expert track, we build custom ASGI middleware to intercept raw byte streams before they hit the routing layer.' 
    }
  ],
  {
    title: 'Enterprise REST API Service',
    intro: 'We are going to build a high-performance web API containing structured data validation modeling, asynchronous operations, and automated documentation compilation using FastAPI.',
    steps: [
      'Open your terminal and install the core libraries: `pip install fastapi uvicorn pydantic`.',
      'Create a file named `main.py` and open it in your text editor.',
      'Import the tools: `from fastapi import FastAPI` and `from pydantic import BaseModel`.',
      'Initialize the app: `app = FastAPI()`.',
      'Define the schema: `class Product(BaseModel):` followed by `name: str` and `price: float`.',
      'Create the route: `@app.post("/items/")` followed by `async def create_item(item: Product):`.',
      'Return the data: `return {"message": "Received", "data": item}`.',
      'Save the file and close the editor.',
      'Launch the server from your terminal: `uvicorn main:app --reload`.',
      'Open your web browser and navigate to `http://127.0.0.1:8000/docs`.',
      'Watch in awe as FastAPI automatically generates a fully interactive Swagger UI webpage where you can test your API live!'
    ],
    goal: 'You successfully engineered a production-grade asynchronous REST API complete with runtime validation filters and self-generating system documentation.'
  },
  [
    q('What does the "stateless" nature of a RESTful web API mean for software architecture?', ['The server must save the complete user session state permanently into local RAM', 'Every single incoming request must contain all the context, credentials, and metadata required to process it, independent of prior requests', 'The API is not allowed to communicate with external SQL databases', 'The API can only be deployed on cloud machines running a specific operating system'], 1, 'REST architecture dictates stateless communication; servers do not track user conversational state in memory, enabling horizontal scaling across multiple load-balanced machines. **Why others are wrong:** It explicitly forbids server-side session tracking, allows database communication, and is OS-agnostic.'),
    q('How does FastAPI leverage Pydantic schemas during an active web request cycle?', ['It encrypts the incoming network traffic using advanced TLS pathways', 'It automatically parses, enforces, and validates the incoming JSON payload against specified type layouts before executing the core route logic', 'It converts Python script files into binary assembly files to increase performance', 'It deletes old temporary files from the hosting application server'], 1, 'Pydantic operates as a data protection layer, automatically rejecting malformed payloads with a standardized 422 Unprocessable Entity code before the route function executes. **Why others are wrong:** It does not handle TLS encryption, compile to binary, or manage file systems.'),
    q('Which HTTP request method is architecturally designated as "Idempotent" when designing standardized REST APIs?', ['POST', 'GET', 'PATCH', 'CONNECT'], 1, 'An HTTP method is idempotent if executing it multiple times leaves the system state identical. `GET` operations merely retrieve data without altering resource states. **Why others are wrong:** `POST` creates new resources (not idempotent). `PATCH` modifies state. `CONNECT` establishes tunnels.'),
    q('What mechanism does FastAPI use to build reusable, testable logic blocks (like extractors or authenticators) that execute prior to route entry?', ['Global environment system variables', 'Dependency Injection pipelines via the `Depends` architecture utility', 'Deep object-oriented class inheritance trees exclusively', 'Background daemon thread loops running in parallel'], 1, 'FastAPI\'s dependency injection framework allows developers to cleanly inject shared utility modules, authentication logic, and database sessions directly into path operation parameters. **Why others are wrong:** It does not rely on global variables, strict inheritance, or background daemons for pre-route logic.'),
    q('What is the fundamental difference between WSGI and ASGI web server protocols?', ['WSGI is for databases, ASGI is for text files', 'WSGI is synchronous and blocking (one thread per request), while ASGI is asynchronous and supports concurrent I/O, WebSockets, and long-lived connections', 'WSGI is faster than ASGI', 'ASGI only works on Windows'], 1, 'ASGI was designed to overcome WSGI\'s blocking limitations by introducing an async interface capable of handling WebSockets and high-concurrency I/O via the Python Event Loop. **Why others are wrong:** They are both web protocols, ASGI is faster for I/O, and both are cross-platform.')
  ],
  ['Design web APIs around unique resources using clear semantic HTTP verbs and descriptive URI path structures.', 'Utilize async routing operations natively to build microservices capable of scaling under high concurrent workloads.', 'Enforce strict data contract schemas with Pydantic to ensure malformed JSON input never reaches database targets.', 'Leverage FastAPI\'s built-in dependency injection model to write highly reusable, decoupled authentication and helper routines.', 'Understand that ASGI enables asynchronous, non-blocking web server architectures compared to legacy WSGI.']
),

L(
  'py-29', 29, 'Python Security & Secure Coding', '🛡️', 
  '*If you want to use a big terminal, use your CMD. Full guide is in Lesson 1.*\n\n🛡️ **Philosophy:** Security is not a feature you bolt on at the end of a project; it is a fundamental property of the system\'s architecture. Functional code means nothing if it leaves user data exposed to theft or system exploitation. From guarding memory buffers to neutralizing malicious inputs, understanding vulnerabilities like injection vectors, supply-chain exploits, and cryptographically broken algorithms is what separates a senior engineer from a junior developer.',
  [
    { 
      title: '1. Neutralizing Injection Vectors', 
      beginner: 'Imagine running an online library where users type book names into a search bar. If a user types "Give me Harry Potter AND THEN burn down the library building", a naive system might follow the full text command literally. Injection vulnerabilities happen when an application accidentally executes user inputs as code commands instead of treating it like harmless text.', 
      advanced: 'Injection attacks occur when untrusted data is sent directly to an interpreter as part of a command sequence. Beyond database-level SQL Injections, Python applications are highly vulnerable to OS Command Injection through misuse of functions like `os.system()` or setting `shell=True` inside the `subprocess` module. Developers must pass arguments as isolated arrays to completely segregate executable code from raw user input parameters.' 
    },
    { 
      title: '2. Cryptographic Password Hashing', 
      beginner: 'Never save user passwords as clear, readable text in a database. If an attacker gains access to the database file, every account is immediately compromised. Instead, you run the password through a digital meat-grinder algorithm called a Hash. The machine saves only the resulting pattern string. When a user tries to log in, you grind their input again and see if the patterns match.', 
      advanced: 'Standard hashing algorithms like MD5 or SHA-256 are designed for speed and are completely vulnerable to brute-force attacks via rainbow tables and modern GPU chips. Production systems must utilize slow, adaptive cryptographic hashing algorithms like `bcrypt` or `Argon2id`. These frameworks combine unique per-password "Salts" alongside a configurable computational work factor to make password database cracking mathematically unfeasible.' 
    },
    { 
      title: '3. Secrets & Environment Isolation', 
      beginner: 'When writing code that connects to sensitive external systems, you need access codes and master keys. Writing these secret keys directly inside your Python file is incredibly dangerous because if you share your code on GitHub, your security credentials are fully exposed to the public internet. Instead, you keep keys in an external locked drawer called environment variables.', 
      advanced: 'Hardcoding sensitive production credentials within code files breaks basic configuration isolation guidelines. Secure architectures load secrets dynamically into the runtime environment block using variables or isolated configuration files protected by `.gitignore` rules. Enterprise deployments integrate programmatically with dedicated secure credential stores like HashiCorp Vault, AWS Secrets Manager, or Google Secret Manager.' 
    },
    { 
      title: '4. Dependency Supply Chain Safety', 
      beginner: 'When you install external code tools using `pip install`, you are importing thousands of lines of code written by completely random developers online. If one of those developers turns rogue or gets hacked, they can update their library to steal your files. Supply chain security means continuously checking your external ingredients to ensure they haven\'t been poisoned.', 
      advanced: 'Supply chain vulnerabilities represent a major modern attack vector. Attackers leverage techniques like typosquatting (naming malicious modules similarly to popular packages) to compromise platforms. Professional workflows mandate lockfiles (`requirements.txt` with strict hashes or `poetry.lock`) and run continuous vulnerability scanners like `pip-audit` or `safety` inside deployment stages to flag outdated or compromised dependencies.' 
    },
    { 
      title: '5. Timing Attacks & Constant-Time Comparison', 
      beginner: 'If a hacker is trying to guess a secret password, and your code stops checking the exact millisecond it finds a wrong letter, the hacker can measure how long the computer takes to guess the first letter, then the second, slowly building the password! To stop this, secure code always takes the exact same amount of time to check, no matter what.', 
      advanced: '*(Pro Track Preview)* Standard string comparison (`==`) short-circuits on the first mismatched byte, leaking information via execution time differentials. Cryptographic verification requires constant-time comparison algorithms (like `hmac.compare_digest`) that evaluate the entire byte array regardless of mismatch location, neutralizing microsecond-level timing side-channel attacks.' 
    }
  ],
  {
    title: 'Enterprise Cryptographic Security Module',
    intro: 'We are going to construct an industrial-grade authentication security module that safely extracts environment secrets, prevents shell command injection, and implements salted cryptographic password hashing.',
    steps: [
      'Open your terminal and install the security libraries: `pip install bcrypt python-dotenv`.',
      'Create a file named `.env` and add a secret: `DB_PASSWORD=SuperSecret123`.',
      'Create a file named `security.py` and open it in your text editor.',
      'Import the tools: `import os`, `import bcrypt`, `import subprocess`, `from dotenv import load_dotenv`.',
      'Load the secrets: `load_dotenv()` followed by `secret = os.getenv("DB_PASSWORD")`.',
      'Hash a password: `pwd = b"user_password"`, `salt = bcrypt.gensalt()`, `hashed = bcrypt.hashpw(pwd, salt)`.',
      'Verify a password: `is_valid = bcrypt.checkpw(pwd, hashed)`. Print `is_valid` (it will be True!).',
      'Execute a safe terminal command: `subprocess.run(["ls", "-l"], shell=False)` (Notice `shell=False`!).',
      'Save the file and run it: `python security.py`.',
      'Finally, run a supply chain audit in your terminal: `pip-audit`. Watch it scan your installed packages for known vulnerabilities!'
    ],
    goal: 'You successfully engineered an industry-standard security verification module, isolating environmental secrets, closing shell execution holes, and deploying robust hashing algorithms.'
  },
  [
    q('Why is the usage of `shell=True` inside Python\'s `subprocess` module considered a massive security hazard?', ['It makes the application consume twice as much processing memory', 'It passes raw command strings directly to the system shell interpreter, allowing malicious users to execute unauthorized OS commands via input manipulation', 'It prevents the script from opening network sockets properly', 'It completely disables all print statements in the terminal output'], 1, 'Setting `shell=True` exposes systems to OS Command Injection; passing arguments as a structured array allows the OS to process flags without interpreting dangerous string sequences. **Why others are wrong:** It does not affect memory consumption, network sockets, or print statements.'),
    q('Which hashing architecture strategy provides the most secure defense when saving user passwords into a production database infrastructure?', ['Running input strings through quick SHA-256 loops multiple times', 'Utilizing slow, adaptive cryptographic hashing algorithms like `bcrypt` or `Argon2id` combined with an automatic, randomized per-user cryptographic Salt', 'Encoding data into standard Base64 string formats', 'Saving passwords inside an encrypted plain text file in a private folder'], 1, 'Bcrypt and Argon2id are slow by design, forcing computers to expend heavy resources on every evaluation, which renders large-scale automated cracking efforts unfeasible. **Why others are wrong:** SHA-256 is too fast (vulnerable to GPUs). Base64 is encoding, not hashing. Encrypted text files still rely on key management and don\'t solve the hashing problem.'),
    q('What is the operational purpose of running utility tools like `pip-audit` or `safety` inside an automated CI/CD software pipeline?', ['To automatically format code style rules according to strict PEP 8 guidelines', 'To scan installed third-party dependencies for known security vulnerabilities and supply-chain exploits published in vulnerability databases', 'To deploy applications to cloud servers automatically', 'To verify that all unit tests are passing perfectly without warnings'], 1, 'Audit utilities scan project lockfiles against security databases (like the OSV database), ensuring no compromised dependency versions are bundled into production software deployments. **Why others are wrong:** They do not format code (use `black`), deploy apps, or run unit tests.'),
    q('How should a professional software engineering team handle sensitive production database connection strings and secret access keys?', ['By saving them at the top of the main code files using descriptive global variable names', 'By separating configuration states away from application logic, injecting keys dynamically as Environment Variables at launch', 'By writing credentials inside a public README.md file for developer visibility', 'By committing keys into a public Git repository file structure'], 1, 'Decoupling application variables from logic via environment arrays keeps master operational credentials locked down outside repository source systems. **Why others are wrong:** Hardcoding in files, READMEs, or Git commits guarantees credential leakage and immediate system compromise.'),
    q('Why must cryptographic signature verification utilize "constant-time" comparison functions instead of standard `==` operators?', ['Standard operators are too slow for modern networks', 'Standard operators short-circuit on the first mismatched byte, leaking information via execution time differentials (Timing Attacks)', 'Constant-time functions encrypt the data automatically', 'Standard operators only work on text, not numbers'], 1, 'Standard comparison short-circuits, allowing attackers to measure microsecond differences to guess bytes one by one. Constant-time functions evaluate the entire array regardless of mismatch location. **Why others are wrong:** It is not about network speed, auto-encryption, or data types.')
  ],
  ['Never use shell=True or raw string concatenations inside execution layers to eliminate injection access paths.', 'Deploy bcrypt or Argon2id for password storage routines to protect user authentication records.', 'Isolate production configurations cleanly inside environment blocks, avoiding credential leaks in source control.', 'Integrate pip-audit testing pipelines directly into your deployment cycles to defend against supply chain attacks.', 'Utilize constant-time comparison functions to neutralize microsecond-level timing side-channel attacks.']
),

L(
  'py-30', 30, 'Professional Python Packaging & Deployment', '📦', 
  '*If you want to use a big terminal, use your CMD. Full guide is in Lesson 1.*\n\n📦 **Philosophy:** Code that only runs on your machine is a hobby; code that runs reliably everywhere is a product. Packaging bridges the gap between loose source files and reproducible, enterprise-ready software ecosystems. By mastering modern build backends, binary distributions, semantic versioning contracts, and automated continuous deployment systems, you transform individual scripts into institutional open-source libraries or highly scalable cloud assets.',
  [
    { 
      title: '1. Modern Build Systems & Pyproject', 
      beginner: 'Imagine your Python project is a premium meal kits business. To ship it out, you need an official box containing an exact card layout listing ingredients, cooking times, and allergies. The `pyproject.toml` file is that master box label. It has completely replaced older messy setup scripts, giving Python a single, clean, standardized document to understand exactly what your library requires to compile and run.', 
      advanced: 'The `pyproject.toml` file implements the modern standards defined in PEP 517 and PEP 518. It decouples the build frontend tool from the underlying build backend framework. Instead of executing legacy, unsecure imperative `setup.py` scripts, developers specify declarative backends like `hatchling`, `flit`, or `setuptools` directly inside the build-system table, ensuring fully isolated, highly reproducible dependency resolution environments.' 
    },
    { 
      title: '2. Source Distributions vs. Wheels', 
      beginner: 'When you share code, you can send it in two ways. A Source Distribution is like sending someone raw Lego blocks inside a generic plastic bag—their computer has to spend time sorting and building it from scratch. A "Wheel" file is like sending a pre-assembled, perfectly glued toy model that snaps right into their project instantly, saving massive amounts of setup time and energy.', 
      advanced: 'A Source Distribution (`sdist`) contains the pure raw source code and asset files, requiring the target machine to execute installation overhead. A Wheel (`.whl`) is a built package format that completely bypasses compilation steps during a `pip install` sequence. For projects utilizing complex C or Rust extensions, wheels must be pre-compiled across specific platform architectures using automated matrix tools like `cibuildwheel` to guarantee flawless binary compatibility.' 
    },
    { 
      title: '3. Semantic Versioning & Technical Docs', 
      beginner: 'Version numbers are not just random tracking marks; they are a highly strict 3-position code (Major.Minor.Patch, like 2.4.1) that forms a promise with your users. Changing the first number warns them that you changed the code layout so much that their old programs might break. Combine this tracking with professional documentation websites to teach others how your tools operate.', 
      advanced: 'Adherence to Semantic Versioning (SemVer) metrics complies with the strict PEP 440 specification guidelines, allowing automated dependency solvers to safely evaluate version constraint ranges. Professional package lifecycles unify codebases with automated docstring generation suites like Sphinx or MkDocs, building static assets that publish seamlessly onto public hosting services like GitHub Pages or ReadTheDocs.' 
    },
    { 
      title: '4. CI/CD & Automated PyPI Delivery', 
      beginner: 'You should never publish production software manually from your laptop—it leaves too much room for human error. Instead, developers use a tireless robotic workflow assistant called a CI/CD pipeline. The exact moment you save your finished project to GitHub, this robot runs automated quality checks, packages your code into clean wheels, and safely delivers them to the global Python library registry.', 
      advanced: 'Continuous Integration and Continuous Deployment (CI/CD) pipelines, written via automation engines like GitHub Actions, remove human vulnerability pathways from release lifecycles. Modern workflows utilize "Trusted Publishing" authentication protocols powered by short-lived OpenID Connect (OIDC) identity tokens. This eliminates the catastrophic security hazard of storing permanent, hardcoded PyPI API tokens inside repository environment configurations.' 
    },
    { 
      title: '5. Lockfiles & Cryptographic Hashes', 
      beginner: 'When you install a tool, you want the exact same version your teammate has. A "Lockfile" writes down the exact fingerprint (hash) of every single file downloaded. If a hacker tries to secretly swap the file on the internet, the lockfile notices the fingerprint doesn\'t match and blocks the installation!', 
      advanced: '*(Pro Track Preview)* Tools like `pip-tools` or `Poetry` generate strict lockfiles containing SHA-256 cryptographic hashes for every transitive dependency. During deployment, the package manager verifies these hashes against the downloaded artifacts, completely neutralizing man-in-the-middle (MITM) attacks and compromised PyPI mirror payloads.' 
    }
  ],
  {
    title: 'Enterprise Package Architecture & Distribution',
    intro: 'We are going to construct a fully standardized, standard-compliant Python package infrastructure containing modern metadata schemas, modular source directories, and compiled asset wheels ready for distribution.',
    steps: [
      'Open your terminal and create a new folder: `mkdir my_pkg && cd my_pkg`.',
      'Create the source layout: `mkdir src` then `mkdir src/my_pkg`.',
      'Create the init file: `touch src/my_pkg/__init__.py` (or `New-Item` on Windows).',
      'Create the manifesto: Open `pyproject.toml` in your editor and add: `[build-system] requires = ["hatchling"] build-backend = "hatchling.build"`.',
      'Add metadata: `[project] name = "my-cool-pkg" version = "0.1.0"`.',
      'Save the file and close the editor.',
      'Install the build frontend: `pip install build`.',
      'Execute the build command: `python -m build`.',
      'Watch the terminal output as it spins up an isolated environment and compiles your assets.',
      'Inspect the output: Type `ls dist` (or `dir dist`). You will see a `.tar.gz` (sdist) and a `.whl` (Wheel) file ready for global upload!'
    ],
    goal: 'You successfully engineered an industrial-grade, shareable Python package asset ready for global distribution compliance across corporate or open-source software indexes.'
  },
  [
    q('What major architectural advancement is achieved by utilizing a declarative `pyproject.toml` layout over legacy imperatively written `setup.py` scripts?', ['It allows the Python application to automatically compile down to mobile app formats', 'It separates project metadata and build-system definitions into a single standardized file, decoupling frontends from specific backends according to PEP 517/518 specifications', 'It completely eliminates the need to specify third-party dependency requirements', 'It forces all functions inside the package to execute in parallel threads'], 1, '`pyproject.toml` establishes a predictable, declarative metadata platform that allows standard build frontends to cleanly isolate and compile distribution assets without running unsafe code. **Why others are wrong:** It does not compile to mobile apps, eliminate dependencies, or force parallel execution.'),
    q('Why is delivering software via Wheel files (`.whl`) preferred over pure Source Distributions (`.tar.gz`) for enterprise application pipelines?', ['Wheels automatically encrypt the underlying python source code to prevent piracy', 'Wheels are pre-built distribution assets that install near-instantly by bypassing build and compilation execution tracks on the target machine', 'Wheels run up to five times faster on old server operating systems', 'Wheels allow Python modules to bypass standard variable scope restrictions'], 1, 'Wheels are binary distributions; because they skip compilation overhead on installation, they significantly optimize continuous deployment build speeds for infrastructure consumers. **Why others are wrong:** They do not encrypt source code, alter runtime execution speed, or bypass variable scopes.'),
    q('Under strict Semantic Versioning (SemVer) logic, which position in a version identifier string (e.g., 1.2.3) must change when delivering a breaking API modification?', ['The third position representing Patch updates', 'The first position representing Major architectural changes', 'The second position representing Minor feature expansions', 'The trailing positional number denoting building timestamps'], 1, 'Major version shifts indicate structural breaks in backward compatibility; updating it signals consuming systems that they must audit integration points before adopting the upgrade. **Why others are wrong:** Patches are for bug fixes. Minors are for backward-compatible features. Timestamps are not part of SemVer.'),
    q('What is the modern security benefit of utilizing Trusted Publishing via OpenID Connect (OIDC) inside a cloud CI/CD distribution deployment pipeline?', ['It compresses compiled file sizes to conserve hosting space', 'It completely eliminates the need to save long-lived, hardcoded PyPI authentication tokens or passwords inside repository secret stores by utilizing transient identity tokens', 'It translates Python error messages into multiple languages automatically', 'It prevents non-paying users from installing open-source library tools'], 1, 'OIDC trusted connections negotiate cryptographic access on the fly based on verifiable environment provenance, completely removing static credential theft risks from code repositories. **Why others are wrong:** It does not compress files, translate errors, or restrict open-source access.'),
    q('What is the purpose of including cryptographic hashes inside a dependency Lockfile?', ['To encrypt the source code of the library', 'To verify that the downloaded package exactly matches the original artifact, neutralizing man-in-the-middle attacks and compromised mirrors', 'To speed up the installation process', 'To compress the file size'], 1, 'Lockfile hashes ensure the integrity of the downloaded artifact. If a hacker intercepts the download and swaps the file, the hash mismatch will cause the package manager to abort the installation. **Why others are wrong:** It does not encrypt source code, speed up installation, or compress files.')
  ],
  ['Adopt the declarative pyproject.toml specification layout for all new library or software applications.', 'Distribute built software via compiled Wheel artifacts to maximize speed and installation predictability for end-users.', 'Adhere strictly to Semantic Versioning specifications to protect system consumers from unexpected dependency breakage.', 'Automate package compilation and registry delivery workflows using secure, OIDC-trusted CI/CD deployment channels.', 'Utilize Lockfiles with cryptographic hashes to guarantee supply-chain integrity and prevent MITM attacks.']
),

L(
  'py-test-2', 30.5, 'Final Assessment: Full-Stack Python Mastery', '🎓', 
  '*If you want to use a big terminal, use your CMD. Full guide is in Lesson 1.*\n\n🎓 **Philosophy:** Welcome to the Final Assessment. You have traversed the entire Python curriculum, from the raw mechanics of the interpreter to the architectural heights of asynchronous microservices and secure deployment pipelines. This capstone evaluates your ability to synthesize these concepts into cohesive, production-grade systems. True mastery is not just knowing the syntax; it is understanding the trade-offs, the memory implications, and the security boundaries of every line of code you write.',
  [
    { 
      title: '1. Advanced Iteration & Memory Control', 
      beginner: 'You should deeply understand the difference between returning a massive list of data versus yielding data one piece at a time using Generators to save computer memory.', 
      advanced: 'Your architectural knowledge must include the internal mechanics of iterators (`__iter__`, `__next__`), the deterministic memory advantages of `__slots__`, and the usage of custom Context Managers (`__enter__`, `__exit__`) for safe resource allocation.' 
    },
    { 
      title: '2. Concurrency & Metaprogramming', 
      beginner: 'You should know how to write programs that execute tasks concurrently—using Threading for slow network operations and Multiprocessing to utilize all of your CPU cores for heavy math.', 
      advanced: 'You must fully comprehend the Event Loop mechanics of `asyncio`, write non-blocking coroutines, and utilize advanced Metaclasses and Descriptors to manipulate class creation architectures dynamically before runtime.' 
    },
    { 
      title: '3. Web APIs & Database ORMs', 
      beginner: 'You should be fully capable of building web endpoints using modern frameworks like FastAPI and saving data permanently to a structured database using standard SQL.', 
      advanced: 'You should master ORM implementations via SQLAlchemy (managing transactional Sessions, preventing N+1 query traps), strict input validation via Pydantic, and RESTful stateless architecture using cryptographically signed JWT tokens.' 
    },
    { 
      title: '4. Testing, Security & Packaging', 
      beginner: 'You should never guess if your code works; you should prove it systematically using `pytest`. You must also know how to package your project so others can install it flawlessly.', 
      advanced: 'You must be fully capable of mocking external dependencies, neutralizing OS injection attack vectors, managing cryptographic hashing frameworks (like bcrypt), and structuring production-ready deployments utilizing `pyproject.toml` and CI/CD distribution pipelines.' 
    }
  ],
  {
    title: 'The Master Enterprise Capstone',
    intro: 'Your final challenge is to engineer a fully validated, systematically tested, and secure backend microservice from scratch, combining every advanced architectural concept you have learned into one seamless application.',
    steps: [
      'Initialize a completely new project layout and create a declarative `pyproject.toml` file to manage the core dependencies (FastAPI, SQLAlchemy, Pytest, Uvicorn, Pydantic).',
      'Implement a FastAPI web application structure heavily utilizing asynchronous routing pathways (`async def`).',
      'Engineer a SQLAlchemy database layer, defining an explicit declarative base model and utilizing a custom Descriptor to handle automated string validation on the models.',
      'Build strict Pydantic schemas to validate all incoming JSON payloads, thoroughly preventing malformed data from ever entering the core routing logic.',
      'Write a suite of deterministic unit tests using `pytest`, employing custom fixtures to create temporary, in-memory SQLite databases for completely isolated test execution runs.',
      'Profile the application\'s database population loops using `cProfile` to explicitly ensure your data iteration techniques are highly optimized and free of N+1 query traps.',
      'Run `pip-audit` to verify your dependency tree is free of known supply-chain vulnerabilities.',
      'Build your final Wheel artifact using `python -m build` and verify the `dist/` directory contents.'
    ],
    goal: 'You successfully architected, tested, and optimized an enterprise-grade async web service, proving your complete mastery of the professional Python programming ecosystem.'
  },
  [
    q('When engineering high-throughput I/O bound web services, what is the primary architectural advantage of using `asyncio` over traditional OS Multiprocessing?', ['`asyncio` bypasses the CPU entirely and uses the computer\'s GPU for processing web requests', '`asyncio` operates purely within a single native thread using an Event Loop to aggressively context-switch during idle waiting periods, utilizing vastly less system RAM and overhead than spinning up heavy OS-level processes', '`asyncio` automatically translates Python code into native C code prior to execution', '`asyncio` strictly prevents network users from making too many requests simultaneously'], 1, 'Asynchronous programming is incredibly efficient for I/O operations because it completely eliminates the heavy RAM footprints and OS-level context-switching costs associated with managing separate system processes. **Why others are wrong:** It does not use GPUs, compile to C, or act as a rate-limiter.'),
    q('What structural limitation does the standard Python Global Interpreter Lock (GIL) enforce when writing concurrent software architectures?', ['It prevents the host computer from connecting to multiple cloud databases simultaneously', 'It strictly limits standard Python to executing only one native thread of Python bytecode at a time per process, effectively bottlenecking parallel CPU-bound multithreaded performance', 'It locks the application\'s `.env` configuration files, preventing dynamic runtime updates', 'It immediately crashes the script execution if more than 10 threads are opened'], 1, 'The GIL is a mutex designed to protect internal Python objects from concurrent access data races. While safe, it effectively neutralizes the multi-core execution advantages of standard multithreading for heavy mathematical (CPU-bound) workloads. **Why others are wrong:** It does not block network connections, lock `.env` files, or crash at 10 threads.'),
    q('How does an Object-Relational Mapper (ORM) framework like SQLAlchemy inherently defend against catastrophic SQL Injection attacks?', ['By automatically encrypting the entire database file locally before executing queries', 'By strictly utilizing parameterized query bindings that cleanly isolate untrusted user inputs from the core SQL execution string, treating input purely as data rather than executable commands', 'By globally limiting the length of all user string inputs to 15 characters', 'By utilizing a Metaclass hook to delete dangerous variables from system memory immediately'], 1, 'ORMs rely on parameterized queries native to database drivers. This rigidly enforces the segregation of executable SQL syntax from user data arguments, completely neutralizing injection vectors. **Why others are wrong:** ORMs do not encrypt local files, arbitrarily limit string lengths, or delete memory via metaclasses.'),
    q('What is the direct operational benefit of using a Generator function (`yield`) to parse a massive 50GB server log file instead of returning a standard data list?', ['Generators compress the target text file on the hard drive automatically to save space', 'Generators evaluate and stream one line of data at a time lazily, keeping the system RAM footprint practically flat instead of attempting to load all 50GB into memory simultaneously', 'Generators execute parsing loops up to 10 times faster than standard lists', 'Generators natively convert text strings into secure binary data tokens'], 1, 'Generators evaluate code lazily. By yielding one single item and pausing state execution, they can process infinitely large datasets systematically without ever exceeding the hardware\'s physical RAM constraints. **Why others are wrong:** They do not compress files, execute faster (they are often slightly slower per-item due to suspension overhead), or convert to binary tokens.'),
    q('In professional software testing architectures utilizing `pytest`, what is the exact operational purpose of implementing a "Mock" object?', ['To generate large arrays of random string data for load testing pipelines', 'To replace complex, slow, or highly unpredictable external dependencies (such as a third-party payment API) with a controlled, predictable fake object that tracks exactly how it was interacted with', 'To force a test suite to fail automatically in order to verify the CI/CD error logging configurations', 'To precisely measure the raw execution time of a specific functional block in milliseconds'], 1, 'Mocking structurally isolates the specific unit of code being tested. Simulating external systems ensures that sudden network failures or third-party latency drops do not trigger false-positive test suite failures. **Why others are wrong:** Mocks are not for load testing, forcing failures, or measuring execution time (use `timeit` or `cProfile` for that).')
  ],
  ['You can confidently engineer and deploy complex Object-Oriented architectures.', 'You know how to secure, systematically test, and mathematically optimize code for production cloud environments.', 'You have mastered both synchronous blocking and asynchronous non-blocking execution models.', 'Congratulations! You are officially a Full-Stack Python Engineer!']
 ),
];

export const getPythonLessonById = (id: string): PythonLesson | undefined =>
  PYTHON_LESSONS.find(l => l.id === id);

export const isPythonLessonUnlocked = (id: string, completedLessons: string[]): boolean => {
  const idx = PYTHON_LESSONS.findIndex(l => l.id === id);
  if (idx <= 0) return true;
  return completedLessons.includes(PYTHON_LESSONS[idx - 1].id);
};
