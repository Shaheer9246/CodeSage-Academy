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

export const PYTHON_TRACK_NOTICE = {
  type: "track-notice",
  notice: "🖥️ Python Track Status: This track is currently under development. In this module, we are focusing on establishing your core programming foundation. Please proceed through the available lessons to build your skills; we are actively updating the preview environment and will notify you as soon as the interactive compiler is fully integrated."
};

export const PYTHON_LESSONS: PythonLesson[] = [

  L(
  'py-01', 1, 'Environment Setup & Language Core', '🚀', 
  '🖥️ **Terminal Notice:** We now have a built-in terminal right here! However, if you want a bigger screen, you can use your computer\'s native terminal. The practical assignment below contains the full setup instructions to install Python on your machine.\n\nEvery incredible software engineering journey starts at the exact same place: the terminal. Before writing complex automation scripts, machine learning pipelines, or web applications, you must transform your machine into a development workstation. This means correctly installing the Python runtime environment, configuring your operating system path arrays, mastering terminal console inputs, and learning how to cleanly execute both live command sandboxes and standalone script files.',
  [
    { title: '1. The Python Interpreter Engine', beginner: 'Think of the Python Interpreter as an elite automatic translator. Your computer processor cannot read human English words or clean code text; it only understands raw binary pulses (ones and zeros). When you write a line of code, the interpreter acts as the middleman, reading your syntax, evaluating your intent, and converting it into instructions the machine can instantly execute.', advanced: 'At a lower system level, standard Python (CPython) acts as both a compiler and a virtual machine. When you run a script, it first parses your source code text into an optimized, intermediate binary layer called Bytecode (stored inside hidden `.pyc` files), which is then safely evaluated sequentially by the virtual machine runtime environment.' },
    { title: '2. Terminal Shell Navigation', beginner: 'Most everyday computer users click on colorful graphical desktop icons to open apps and move files. As a developer, you will drop behind the curtains and use the Terminal (Command Prompt or PowerShell on Windows, Terminal app on Mac/Linux). It is a text-only command station where you talk directly to your operating system using specific typed code paths.', advanced: 'The terminal communicates directly with your system shell. When you type a word like `python`, the shell searches through a specific environmental configuration list called the `PATH` variable. If the absolute folder address of your compiler isn\'t recorded inside that PATH array, your terminal will throw an annoying "command not found" error.' },
    { title: '3. The REPL Interactive Playground', beginner: 'Python features a fantastic live testing sandbox called the REPL (Read-Eval-Print-Loop). When you type `python` into the terminal without specifying a file, you step into a live environment where typing code immediately prints out results on the screen. It is an incredible scratchpad for running quick experiments or testing out ideas without saving any files.', advanced: 'The REPL provides a volatile, interactive runtime state machine. It parses expressions on the fly, evaluates them inside the active execution stack, displays standard output streams, and loops back to await the next evaluation block. It is a critical workspace tool for checking object attributes and running quick micro-benchmarks.' },
    { title: '4. Standalone Source Code Files', beginner: 'While the REPL playground is fantastic for quick tests, it completely forgets your work the moment you close it. To build real, permanent programs, you write code inside standard text files and save them with a special `.py` file extension. This creates a permanent script asset that your machine can execute from top to bottom at any time.', advanced: 'Executing standard source script files (`python script.py`) instantiates an isolated, non-volatile interpreter execution lifecycle. The system processes the module environment boundaries, loads dependencies from top to bottom, evaluates scope assignments, and cleanly frees all allocated system memory addresses once the file reaches its terminal line.' }
  ],
  {
    title: 'Workstation Activation & First Script Execution',
    intro: '⚠️ NOTE: This practical assignment is significantly larger and more detailed than standard lessons because it covers your complete local system installation, terminal mapping setup, and file system orchestration!',
    steps: [
      'Open your internet browser and navigate directly to the official [Python Downloads Page](https://www.python.org/downloads/). Download the latest stable release package matching your specific operating system (Windows, macOS, or Linux).',
      'Launch the downloaded installer file. CRITICAL STEP FOR WINDOWS USERS: Look closely at the very first wizard screen and check the box that explicitly says "Add Python to PATH" before clicking Install. If you skip this, your terminal will remain completely blind to your installation.',
      'Open your machine\'s native terminal window. On Windows, search your apps for "PowerShell" or "Command Prompt". On a Mac, press Cmd+Space, type "Terminal", and open the application.',
      'Inside your clean terminal prompt, type `python --version` (or `python3 --version` on some macOS machines) and press Enter. Verify that the terminal cleanly prints back your newly installed version number, proving your system PATH configuration is successful.',
      'Now, enter the live interactive playground! Type `python` (or `python3`) and press Enter. Notice that your traditional terminal path prompt vanishes, replaced by a triple arrow symbol `>>>`. This means you are now officially inside the live Python interpreter engine.',
      'Type your first absolute line of code: `print("Hello World")` and press Enter. Watch the system immediately evaluate your command and print the text stream cleanly underneath.',
      'LEARN THE TOGGLE CYCLE (CLOSE & REOPEN): To exit and close the Python sandbox playground and safely return to your ordinary system terminal prompt, type the explicit function command `exit()` and press Enter (Alternatively, press `Ctrl + D` on Mac/Linux, or `Ctrl + Z` followed by Enter on Windows). Notice the `>>>` prompt vanishes. To reopen it and reactivate the sandbox engine at any time, simply type `python` again!',
      'Now create a permanent script file. Open any basic, plain-text text editor on your system (like Notepad, TextEdit, or VS Code). Create a brand-new file, type `print("Automating the terminal!")` on line one, and save the document inside an easy-to-find folder naming the file explicitly as `app.py`.',
      'Return to your main terminal window, navigate to that specific directory folder using the change-directory command (e.g., `cd Desktop` or `cd Documents`), and run your script file permanently by executing: `python app.py`.'
    ],
    goal: 'You successfully installed the core engine, initialized and safely exited the live terminal REPL sandbox, created permanent source files, and orchestrated script execution paths directly from the shell prompt.'
  },
  [
    q('How do you safely exit and close the interactive Python REPL playground to return to your normal computer terminal prompt?', ['Type the word `stop` and hit Enter', 'Close the entire laptop monitor lid completely', 'Type the command `exit()` and press Enter, or use keyboard shortcuts like Ctrl+D / Ctrl+Z', 'Delete the python execution app from your hard drive'], 2, 'The explicit function command `exit()` or environmental breakout keystrokes cleanly disconnect the terminal session from the active execution sub-process.'),
    q('Why is checking the "Add Python to PATH" checkbox absolutely critical during the Windows setup installation phase?', ['It increases the download speed of the installer files from the internet', 'It records the compiler binary directory inside the operating system environment list, allowing your terminal shell to recognize and run the `python` command from any folder path', 'It automatically changes your desktop wallpaper background to the Python logo', 'It converts your mouse pointer cursor into a command terminal shortcut'], 1, 'Without adding the executable application paths to the system environment PATH directory array, your system shell will fail to locate the interpreter engine binary when called.'),
    q('What is the core structural difference between writing code in the interactive REPL playground versus saving code inside a `.py` file?', ['The REPL runs significantly slower than source file scripts', 'The REPL playground is a volatile live scratchpad that completely forgets your code strings the moment you close it, whereas file scripts are permanent reusable assets', 'Files can only store text numbers, while the REPL can only process text words', 'Code saved in source files requires a permanent internet connection to execute'], 1, 'The REPL loop provides immediate volatile expression evaluations, while `.py` files store non-volatile, persistent, and structured code assets for repeated system deployment.'),
    q('Which command utility pattern is executed inside the terminal shell to run a permanent script file named `server.py` from a target folder location?', ['run server.py script', 'python server.py', 'open python compiled server', 'execute --file=server'], 1, 'Passing the target source filename parameter directly to the primary interpreter command instructs the system to initialize an isolated runtime pass over that exact target file structure.')
  ],
  ['Ensure Python is mapped cleanly to your OS PATH environment array to allow universal terminal command execution.', 'Master the interactive REPL sandbox shell for quick structural prototyping, algorithm testing, and syntax verification loops.', 'Always remember that `exit()` or shortcut triggers are required to cleanly suspend live interpreters and return control back to your standard shell prompt.', 'Organize source code workflows into dedicated `.py` text assets to assemble permanent, reproducible automation scripts.']
),

 L('py-2', 2, 'Variables & Data Types', '📦',
    '🖥️ **Terminal Notice:** If you want to use a big terminal on your own computer instead of the built-in one, please read Lesson 1 for the full setup instructions.\n\nThink of your computer\'s memory like a massive warehouse. A variable is just a friendly sticky note label you slap onto a specific item in that warehouse so you can find it instantly later!',
    [
      { 
        title: '1. Naming & Assignment', 
        beginner: 'Writing `wallet = 50` creates a label named "wallet" and stores the number 50 inside it. In Python, we write multiple words using lowercase letters joined by underscores, like `total_cash_left = 100` (called snake_case).', 
        advanced: 'Variables are references (pointers) to memory addresses, not isolated boxes. If `a = [1,2]` and `b = a`, then `b.append(3)` alters the underlying object, meaning `a` will now output `[1,2,3]` too.' 
      },
      { 
        title: '2. Numbers', 
        beginner: 'Python automatically reads whole numbers (like `5` or `100`) as integers (`int`), and numbers with decimals (like `3.14` or `99.9`) as floats (`float`). You don\'t have to tell Python which is which—it figures it out for you!', 
        advanced: 'True division `/` always returns a float, whereas integer floor division `//` yields a truncated integer. Beware binary floating-point precision constraints (e.g., `0.1 + 0.2 != 0.3`). Use the `decimal` module for currency calculations.' 
      },
      { 
        title: '3. Strings (Text)', 
        beginner: 'Any text wrapped inside single or double quotes is a string (`str`), like `"Hello!"`. Strings are unchangeable (immutable) after creation. You can measure their length using `len("hi")` or make them loud using `.upper()`.', 
        advanced: 'Strings are indexable, immutable sequences of Unicode characters. They support slicing syntax like `s[start:stop:step]` and negative indexing (`s[-1]` for the last character). Always prefer modern f-strings for string building.' 
      },
      { 
        title: '4. Booleans & None', 
        beginner: 'Programs need logic! A boolean can only be `True` or `False`. If you need a label to point to something completely empty or unassigned, Python provides a special placeholder value called `None`.', 
        advanced: 'Python evaluates empty collections (`[]`, `{}`, `""`), zero values (`0`, `0.0`), and `None` as falsy in boolean contexts. When evaluating equality for singletons like `None`, syntax convention dictates using identity checks (`is None`) rather than equality (`== None`).' 
      },
    ],
    { 
      title: 'Variable Playground', 
      intro: 'Let\'s create variables inside your open REPL screen and inspect their hidden data types.', 
      steps: [
        'Make sure your terminal is active with Python running (you should see the >>> prompt).',
        'Type `x = 10` and hit Enter. Then type `name = "Sage"` and hit Enter.',
        'Now ask Python what type those items are! Type `type(x)` and check the answer, then try `type(name)`.',
        'Test division styles: Type `10 / 3` to see the float answer, then try `10 // 3` to see it chop off the decimals.',
        'Try a clean text merge: Type `f"{name} has {x} points"` and watch Python cleanly build the full sentence.'
      ], 
      goal: 'You successfully created multiple types of data labels and read their properties using Python expressions.' 
    },
    [
      q('What does dynamic typing mean in Python?', ['You must declare a type before using a variable','Python determines the data type automatically based on the assigned value','Variables can never change their values','Code runs significantly slower'], 1, 'Dynamic typing means Python detects whether something is a number, text, or true/false logic automatically when you assign it.'),
      q('Which of the following follows the official Python naming style (snake_case)?', ['myUserScore','my_user_score','MyUserScore','my-user-score'], 1, 'The official Python style guide (PEP 8) uses lowercase words separated by underscores for variable and function names.'),
      q('What is the difference between writing `10 / 3` and `10 // 3`?', ['They do exactly the same thing','/ gives the full decimal answer, while // chops off decimals and returns a whole number','// multiplies instead of dividing','/ triggers an error'], 1, 'The single slash `/` performs standard float division, whereas the double slash `//` performs floor division to return a whole integer.'),
      q('What is the safest way to check if a variable points to a completely empty `None` value?', ['if x == None:','if x is None:','if x.empty():','if x = None:'], 1, 'Using `is None` is the standard, optimized Python way to verify the identity of an unassigned or empty placeholder variable.')
    ],
    ['Variables act as names pointing to data values','Python automatically figures out data types','Integers hold whole numbers; Floats hold decimals','Always use identity check (is None) to evaluate None values']
  ),
  
 L('py-3', 3, 'Control Flow', '🔀',
    '🖥️ **Terminal Notice:** If you want to use a big terminal on your own computer instead of the built-in one, please read Lesson 1 for the full setup instructions.\n\nPrograms aren\'t just straight lines—they need to make smart choices and repeat tasks. Think of control flow as adding crossroads, traffic lights, and circular roundabouts to your code.',
    [
      { 
        title: '1. if / elif / else', 
        beginner: 'This is a fork in the road. `if` checks a condition (like `if cash > 10:`). If it\'s true, Python drives down that path. If not, it checks the next `elif` (else-if) path, or defaults to the `else` path. Remember, clean indentation tells Python exactly which commands belong inside each path!', 
        advanced: 'Utilize the walrus operator `:=` (introduced in Python 3.8) to simultaneously assign a value to a variable and evaluate it within a conditional expression to decrease code redundancy.' 
      },
      { 
        title: '2. while loops', 
        beginner: 'A `while` loop is a repeating roundabout. It tells your code: "Keep running this block over and over again as long as this condition remains True!" Be careful—if the condition never becomes False, your loop will run forever and crash your program!', 
        advanced: 'Prefer `for` loops for predictable sequence bounded iteration. Reserve `while True:` combined with an internal conditional `break` for infinite polling sequences and low-level system event loops.' 
      },
      { 
        title: '3. for loops', 
        beginner: 'A `for` loop is like an automated conveyor belt. It pulls items out of a collection one by one (like a list of names or a batch of numbers) and runs your code block for each individual item until the collection is completely empty.', 
        advanced: 'Leverage `enumerate()` to extract tracking index offsets alongside sequence values, `zip()` to unpack and pair multi-iterable streams simultaneously, and lazy `range()` objects for memory-efficient numeric index stepping.' 
      },
      { 
        title: '4. break / continue / else', 
        beginner: 'Use `break` to smash open a loop and escape out of it immediately. Use `continue` to instantly skip the rest of the current turn and jump straight to the next item on the conveyor belt.', 
        advanced: 'Python supports an uncommon `for-else` construct where the `else:` block fires exclusively if the loop runs to natural completion without encountering an explicit intercepting `break` statement.' 
      },
    ],
    { 
      title: 'The FizzBuzz Challenge', 
      intro: 'Let\'s build a famous programmer screening puzzle that forces Python to make multiple complex choices in a loop.', 
      steps: [
        'Make sure your terminal is active with Python running (look for the >>> prompt).',
        'We want to check numbers from 1 to 20 using a loop.',
        'If a number is perfectly divisible by BOTH 3 and 5, tell Python to print "FizzBuzz".',
        'Otherwise, if the number is only divisible by 3, tell Python to print "Fizz".',
        'Otherwise, if the number is only divisible by 5, tell Python to print "Buzz".',
        'If none of those match, simply tell Python to print the number itself.'
      ], 
      goal: 'Your program successfully processes numbers 1 through 20, swapping out matching numbers for text seamlessly.' 
    },
    [
      q('What does Python use to understand which commands belong inside an `if` statement block?', ['A pair of closing parentheses ()','Consistent vertical text alignment and spaces (Indentation)','Wrapping sentences inside quotation marks','Semicolons printed at the end of each line'], 1, 'Python relies entirely on clean indentation spaces to map out the physical scope of structural code blocks.'),
      q('Which helper should you use if you need both the item count index AND the item value inside a `for` loop?', ['range(len(x))','enumerate(x)','zip(x)','iter(x)'], 1, 'The `enumerate()` function cleanly yields a tracking index counter along with the raw value item on every single loop loop cycle.'),
      q('What happens when Python encounters a `break` statement inside a loop?', ['It pauses for 5 seconds','It stops the loop instantly and jumps outside of it','It skips to the next turn of the loop','It restarts the computer'], 1, 'The `break` keyword immediately cuts off execution of the active loop and shoots execution out past the bottom block.'),
      q('When does an `else:` block attached directly to a `for` loop run?', ['It runs on every single loop turn','It runs only if the loop completes its entire run without hitting a break statement','It runs only if the loop breaks on the very first try','It never runs and triggers an error'], 1, 'In a `for-else` configuration, the else logic acts as a success confirmation, running only if the loop ran to full completion without breaking.')
    ],
    ['Indentation defines logical code blocks','For loops are the standard choice for walking through sequences','Use enumerate() to track indices and values together','Break exits loops immediately, while continue skips the current step']
  ),

  L('py-4', 4, 'Functions', '🛠️',
    '🖥️ **Terminal Notice:** If you want to use a big terminal on your own computer instead of the built-in one, please read Lesson 1 for the full setup instructions.\n\nThink of a function as a magical kitchen recipe or a factory machine. You feed it raw ingredients (inputs), it runs a specific set of instructions inside, and it hands you back a finished product (output)!',
    [
      { 
        title: '1. Defining a Function (def)', 
        beginner: 'To create a reusable tool, write `def` followed by a custom name and a pair of parentheses, like `def greet(name):`. Inside, use the `return` keyword to send the final result back to whoever called your tool. If you forget `return`, Python automatically hands back `None`!', 
        advanced: 'Functions in Python are first-class objects. This means they can be dynamically assigned to variables, passed as standard arguments into other functions, or returned from nested closures.' 
      },
      { 
        title: '2. Default & Keyword Args', 
        beginner: 'You can give parameters a backup value just in case the user leaves them empty, like `def buy_pizza(count=1):`. If a user calls `buy_pizza()`, they get 1 pizza by default. You can also name your inputs explicitly when calling a function so their order doesn\'t matter!', 
        advanced: '⚠️ Avoid the mutable default argument trap: `def append_item(x=[])` instantiates a single persistent list object at parse time, reusing it across consecutive calls. Always use `x=None` and initialize conditionally inside.' 
      },
      { 
        title: '3. Packing Inputs (*args & **kwargs)', 
        beginner: 'Sometimes you don\'t know how many items a user will throw into your function. Putting an asterisk `*` before a parameter name packs an endless list of values into a single tidy collection so you can loop through them easily.', 
        advanced: 'The parameter syntax `*args` unpacks positional elements into an immutable tuple, while `**kwargs` packs named keyword elements into a standard mutable dictionary. Essential for building flexible proxy wrappers and high-level structural decorators.' 
      },
      { 
        title: '4. Docstrings & Type Hints', 
        beginner: 'You can leave a clean instruction manual inside your function by wrapping text in triple quotes `"""` right under the definition line. You can also label your expected data types, like `(price: float)`, to help your code editor spot typing mistakes instantly!', 
        advanced: 'Type hints are completely ignored by the runtime interpreter but are heavily utilized by static analyzers like `mypy` and IDE type checkers to trace parameters and block type errors before deployment.' 
      },
    ],
    { 
      title: 'The Smart Calculator', 
      intro: 'Let\'s build a strictly typed, documented mathematical tool that calculates numbers perfectly.', 
      steps: [
        'Open your interactive terminal screen (look for the >>> listening line).',
        'Define a function by typing: `def add(a: float, b: float) -> float:` and press Enter.',
        'On the next indented line, add a clean triple-quoted documentation note explaining what it does.',
        'On the next indented line, tell Python to output the combined value by typing: `return a + b`.',
        'Hit Enter to finalize the function, then test your new creation by typing: `add(3, 4)`.',
        'Test out keyword calling out of order: Type `add(b=10, a=5)` and watch Python match the correct variables!'
      ], 
      goal: 'You successfully wrote a custom function with explicit type labels, documented it, and executed it.' 
    },
    [
      q('What does the `return` keyword do inside a function block?', ['It restarts the entire function from the beginning','It stops execution and passes the final calculated result back out','It deletes all variables inside memory','It prints text directly onto the dark screen'], 1, 'The `return` statement immediately ends the function\'s execution and delivers the final object back to the caller expression.'),
      q('What is the danger of writing a mutable collection as a default argument, like `def design(items=[])`?', ['The program will crash instantly on the very first try','Python creates and shares the exact same list across every single call, blending old data','The function will execute 10 times slower','It locks your keyboard from typing'], 1, 'Mutable default objects are evaluated exactly once when the module loads, causing subsequent function execution states to bleed together.'),
      q('What data collection type does Python use to pack positional parameters using `*args`?', ['A completely customizable List','An unchangeable, sequence-locked Tuple','A key-value tracking Dictionary','An unordered unique Set'], 1, 'The `*` symbol packs an arbitrary sequence of unmapped positional arguments into an immutable tuple collection.'),
      q('Are Python type hints (like `x: int`) strictly enforced while your code is running at runtime?', ['Yes, Python throws an error instantly if the wrong type is used','No, they are ignored at runtime and act as documentation markers for editors and analyzers','They only work if you are connected to the internet','They are only allowed inside loop definitions'], 1, 'Python is dynamically typed; hints do not change runtime behavior but are used by external developer tools like `mypy` to find logical bugs.')
    ],
    ['Use def to build reusable code recipes','The return keyword outputs a value and closes the function','Be careful with mutable default arguments like empty lists','Type hints make code significantly easier for code editors to read and predict']
  ),

 L('py-5', 5, 'Data Structures: List, Tuple, Dict, Set', '📚',
    '🖥️ **Terminal Notice:** If you want to use a big terminal on your own computer instead of the built-in one, please read Lesson 1 for the full setup instructions.\n\nData structures are simply different kinds of storage containers. Choosing the right container for your data is half the battle in coding—each tool offers unique structural traits, speeds, and behavioral rules.',
    [
      { 
        title: '1. Lists (The Expandable Grocery List)', 
        beginner: 'A list is a flexible, ordered sequence wrapped in square brackets, like `items = ["apple", "banana"]`. You can freely add items with `.append()`, remove the last item using `.pop()`, or slice out specific chunks. It keeps everything in the exact order you added it!', 
        advanced: 'Lists are dynamic arrays under the hood. Appending or popping from the absolute end is highly efficient at $O(1)$ amortized time, but inserting or deleting elements from the middle requires shifting trailing references, resulting in an $O(n)$ time cost. Use `collections.deque` if you require an optimized double-ended queue.' 
      },
      { 
        title: '2. Tuples (The Locked Glass Case)', 
        beginner: 'A tuple is an ordered sequence locked inside round parentheses, like `point = (10, 20)`. Unlike lists, tuples are completely unchangeable (immutable) after creation. Use them for fixed data sets that you want to protect from accidental edits!', 
        advanced: 'Because tuples have a fixed length and immutable state, they are strictly hashable. This allows them to safely serve as composite dictionary keys. Consider leveraging `collections.namedtuple` or data classes to add explicit property field descriptors to your record structures.' 
      },
      { 
        title: '3. Dictionaries / Dicts (The Contact Address Book)', 
        beginner: 'A dictionary connects a unique search key to a piece of data, wrapped in curly brackets: `user = {"id": 101, "name": "Sage"}`. Instead of searching by line index numbers, you look up values instantly by calling their exact name keys!', 
        advanced: 'Python dictionaries use internal hash tables to look up, insert, and delete items in highly optimized $O(1)$ average time. Dictionaries preserve insertion order natively. Always employ the `.get(key, default)` extraction pattern to cleanly handle missing fields without risking an accidental `KeyError` crash.' 
      },
      { 
        title: '4. Sets (The Magic Sorting Basket)', 
        beginner: 'A set is an unordered collection of unique items wrapped in curly brackets, like `lucky_numbers = {3, 7, 9}`. Sets strictly ban duplicate elements! If you try to add a duplicate, the set simply swallows it up and ignores it.', 
        advanced: 'Sets are implemented as dummy-value hash tables, giving them lightning-fast $O(1)$ membership lookup checks (`if item in my_set`). They natively support powerful mathematical Venn diagram operations like union (`|`), intersection (`&`), and difference (`-`).' 
      },
    ],
    { 
      title: 'The Intelligent Word Counter', 
      intro: 'Let\'s build a text analyzer that counts how many times individual words appear inside a sentence by choosing the perfect dictionary tracking container.', 
      steps: [
        'Open your terminal and ensure the Python environment is active (the >>> prompt is showing).',
        'Create a text sentence to analyze: Type `s = "the cat sat on the mat"` and hit Enter.',
        'Break the text into a clean list of individual words by typing: `words = s.split()`.',
        'Create a completely empty dictionary container to hold your tracking scores: Type `counts = {}`.',
        'Loop through the list: For each word, use `counts[w] = counts.get(w, 0) + 1` to safely look up its old score (or 0 if new) and add 1.',
        'Print `counts` to verify that Python grouped and tabulated the word frequencies perfectly!'
      ], 
      goal: 'You successfully split text data and aggregated frequency records using a key-value dictionary tool.' 
    },
    [
      q('Which data container should you use if your absolute highest priority is checking whether an item exists in a fraction of a millisecond?', ['A standard ordered list','An unordered, unique Set','An unchangeable tuple record','A long text string sequence'], 1, 'Sets use underlying hash lookups, making membership verification checks almost instantaneous regardless of how large the collection grows.'),
      q('What happens if you attempt to create an ordered tuple structure and then append a new item to it later in the code?', ['Python quietly turns the tuple into a list','It triggers an immediate error because tuples are locked and immutable','The item overwrites the first element inside the tuple','The computer drops the value entirely without telling you'], 1, 'Tuples are completely immutable; any runtime attempts to alter their underlying state or physical capacity will trigger an error.'),
      q('Starting from Python 3.7+, what happens to the internal layout order of a dictionary when you add new key-value pairs?', ['The order is randomized completely to optimize memory','The insertion order is preserved exactly as items are added','The dictionary auto-sorts all items alphabetically','All numerical keys are pushed to the back'], 1, 'Modern Python dictates that dictionaries maintain insertion ordering as a core language specification feature.'),
      q('What is the primary benefit of using `my_dict.get("age", 0)` instead of direct tracking access like `my_dict["age"]`?', ['It executes twice as fast','It automatically prevents an application-breaking KeyError if the key is missing from the system','It formats the returned value into an integer string','It clears out the dictionary values to save memory space'], 1, 'The `.get()` method allows you to safely request a dictionary key while supplying a fallback recovery value if that key doesn\'t exist yet.')
    ],
    ['Lists store ordered mutable item sequences','Tuples enforce unchangeable structured records','Dictionaries map unique keys to fast-access values','Sets filter out duplicate inputs and execute instant lookups']
  ),

 L('py-6', 6, 'Object-Oriented Programming', '🧱',
    '🖥️ **Terminal Notice:** If you want to use a big terminal on your own computer instead of the built-in one, please read Lesson 1 for the full setup instructions.\n\nObject-Oriented Programming (OOP) is just a way to group your data and behaviors together under one roof. Think of a class as an architectural blueprint, and an object as the actual physical house built from that blueprint.',
    [
      { 
        title: '1. Class & Instance (The Blueprint vs The House)', 
        beginner: 'A class is a master design template, like a blueprint for a `Dog`. Writing `d = Dog()` takes that generic blueprint and constructs a real, living, unique dog object (called an instance) inside your computer\'s memory space.', 
        advanced: 'Classes themselves are runtime objects instantiated from a metaclass type. In Python\'s "everything is an object" paradigm, `type` serves as the default primitive constructor class from which all standard user-defined class definitions descend.' 
      },
      { 
        title: '2. __init__ & self (The Birth Ceremony & Passport)', 
        beginner: 'The `__init__` command is a special birth ceremony that runs automatically the exact millisecond a new object is created. The word `self` is like a personal passport photo—it allows the specific object being born to point to its own unique traits, like its own name or age!', 
        advanced: 'The keyword `self` explicitly passes the memory address of the target object instance as the first positional argument to instance methods. Unlike implicit tracking mechanisms in languages like Java or C++, Python requires explicit declaration by design (PEP 8).' 
      },
      { 
        title: '3. Methods & Attributes', 
        beginner: 'Variables locked inside a class are called attributes (things the object knows about itself, like `color`). Functions locked inside a class are called methods (actions the object can perform, like `.bark()`).', 
        advanced: 'Use `@classmethod` to receive the underlying class object as an argument (frequently used for alternative constructors) and `@staticmethod` for isolated utility logic. Apply the `@property` decorator to cleanly mask evaluation methods as standard read-only tracking attributes.' 
      },
      { 
        title: '4. Inheritance (Family Trees)', 
        beginner: 'Inheritance allows a new child class to automatically adopt all attributes and methods from a parent class, like writing `class Cat(Animal):`. This means a `Cat` automatically gains generic animal traits without you rewriting any code!', 
        advanced: 'Avoid deep hierarchical inheritance chains which introduce fragile coupling. Prioritize structural object composition over class inheritance patterns for behavior sharing. Use abstract base classes (`abc.ABC`) to declare clean, explicit system interfaces.' 
      },
    ],
    { 
      title: 'The Dog Model Factory', 
      intro: 'Let\'s build a fully operational object factory template that models real-world characteristics and dynamic behaviors.', 
      steps: [
        'Open your terminal screen and verify that the Python environment is ready (look for the >>> prompt).',
        'Create a master design by typing: `class Dog:` and hit Enter.',
        'Add the automatic birth constructor on the next indented line: `def __init__(self, name, age):`.',
        'Inside that setup block, attach personal traits by typing: `self.name = name` and `self.age = age`.',
        'Add a custom method action block below it: `def bark(self): return f"{self.name} says woof!"`.',
        'Exit the indent blocks, stamp out a live object by typing `d = Dog("Rex", 3)`, and test its action using `d.bark()`!'
      ], 
      goal: 'You successfully designed a structural class blueprint, assigned local instance states, and executed a custom method.' 
    },
    [
      q('What does the keyword `self` physically represent inside a Python class method?', ['The global application script context','The specific individual object instance currently running that method','The parent directory path','The total number of loops executed'], 1, '`self` acts as a direct reference pointing to the specific, individual object instance that is executing the code block.'),
      q('When exactly does the special internal method `__init__` execute?', ['Only when the program finishes running','Automatically the exact moment a new object instance is created from a class template','When a variable gets deleted','Only if you call it manually by typing its full name'], 1, '`__init__` is the object initializer method that fires automatically to configure object traits at creation time.'),
      q('What is the difference between an attribute and a method inside an object?', ['Attributes are strings and methods are numbers','Attributes are data variables that store values, while methods are functions that perform actions','Methods run automatically and attributes are completely ignored','They mean the exact same thing'], 1, 'Attributes hold structural data values belonging to an object, whereas methods contain executable instruction blocks.'),
      q('What does the `@property` decorator do when placed directly above an object method definition?', ['It converts the entire class into a background static method','It allows a method to be read directly like a standard structural variable attribute without parentheses','It deletes data to optimize memory layout','It encrypts the object values'], 1, 'The `@property` decorator wraps a method so it can be cleanly accessed as if it were a computed, read-only variable attribute.')
    ],
    ['Classes serve as master blueprints while objects are live instances','The __init__ method initializes data values at object birth','Attributes define what an object knows; methods define what it does','Use self to ensure an object reads and modifies its own local properties']
  ),

  // ... (You can leave py-7 through py-20 exactly as they currently are in your file!)

L('py-7', 7, 'Error Handling & Exceptions', '🚨',
    '🖥️ **Terminal Notice:** If you want to use a big terminal on your own computer instead of the built-in one, please read Lesson 1 for the full setup instructions.\n\nCode breaks. It is a fundamental law of software engineering. Learning to predict, catch, and handle those breaks gracefully is what separates amateur scripts from professional, crash-resistant applications.',
    [
      { 
        title: '1. The Traceback', 
        beginner: 'When Python crashes, it prints a massive wall of red text called a Traceback. Don\'t panic! Read it from the bottom up. The very last line tells you exactly what went wrong (like a `NameError` or `TypeError`), and the lines above it tell you exactly which file and line number caused it.', 
        advanced: 'Tracebacks traverse the execution call stack. Unhandled exceptions propagate upwards dynamically until they are caught or hit the global interpreter boundary. You can manipulate or suppress stack traces at runtime using the `sys.exc_info()` module and custom exception hooks.' 
      },
      { 
        title: '2. try / except Blocks', 
        beginner: 'Think of `try/except` as a safety net. You put risky code (like downloading a file or doing math) inside the `try` block. If it crashes, Python stops the `try` block instantly and jumps into the `except` block to run backup code, preventing the whole program from dying!', 
        advanced: 'Always catch specific exceptions (e.g., `except ValueError:`) rather than bare `except:` clauses. Bare exceptions catch system-level events like `KeyboardInterrupt` (Ctrl+C) and `SystemExit`, which can accidentally trap users inside infinite zombie loops.' 
      },
      { 
        title: '3. Raising Custom Errors', 
        beginner: 'You don\'t have to wait for Python to crash—you can crash it yourself! Using the `raise` keyword, you can throw a custom error if a user does something wrong, like `raise ValueError("Age cannot be negative!")`.', 
        advanced: 'Raising exceptions allows you to enforce strict API contracts. You can subclass the base `Exception` class to create highly specific, domain-level error structures (e.g., `class DatabaseTimeoutError(Exception): pass`) to cleanly segment your failure logic.' 
      },
      { 
        title: '4. finally & else', 
        beginner: 'A `finally` block runs at the very end of your try/except, no matter what happens (crash or no crash). It is perfect for closing files or turning off connections. An `else` block only runs if the `try` block succeeds without any errors at all.', 
        advanced: 'The `finally` block is guaranteed to execute even if the `try` block returns a value, breaks a loop, or raises a new unhandled exception. It is the backbone of resource management and context cleanup operations.' 
      },
    ],
    { 
      title: 'The Crash-Proof Calculator', 
      intro: 'Let\'s build a division tool that uses error handling to survive bad inputs, like trying to divide by zero or passing text instead of numbers.', 
      steps: [
        'Open your terminal and launch the Python REPL (>>>).',
        'Create a function: `def safe_divide(a, b):`.',
        'Inside the function, start a `try:` block and attempt to calculate `result = a / b`.',
        'Add a specific safety net for zero: `except ZeroDivisionError:` and print a friendly warning instead of crashing.',
        'Add another net for bad data types: `except TypeError:` and tell the user to only use numbers.',
        'Add an `else:` block to print and return the final `result` if everything went perfectly.',
        'Call `safe_divide(10, 0)` and `safe_divide(10, "two")` to watch your safety nets catch the crashes in real-time!'
      ], 
      goal: 'You successfully trapped specific runtime crashes and diverted them into graceful backup logic without stopping the application.' 
    },
    [
      q('Which block of code is guaranteed to run regardless of whether an exception was triggered or not?', ['The `try` block','The `else` block','The `finally` block','The `except` block'], 2, 'The `finally` block is designed strictly for resource cleanup and executes unconditionally at the end of the error handling chain.'),
      q('Why is writing a bare `except:` clause (catching all errors blindly) considered a bad practice?', ['It makes the code run too slowly','It catches system-level interrupts like Ctrl+C, making it nearly impossible to shut the program down manually','It deletes the original file','It triggers a syntax error immediately'], 1, 'Bare except clauses trap everything, including crucial `SystemExit` and `KeyboardInterrupt` signals, masking critical system failures.'),
      q('How do you manually trigger a custom error inside your own program?', ['Use the `stop` keyword','Use the `raise` keyword followed by an Error class','Use the `break` keyword','Type `crash()`'], 1, 'The `raise` keyword explicitly initializes an exception event and throws it up the active execution call stack.'),
      q('When debugging a crashed program, which part of the printed red Traceback should you read first?', ['The very top line','The middle lines showing the memory addresses','The very last line at the bottom','None of it, it is machine code'], 2, 'The bottom line of a Traceback always contains the specific exception name and the specific error message text.')
    ],
    ['Use try/except blocks as safety nets around risky operations','Never use bare except blocks; always specify the exact error you expect','The raise keyword lets you enforce your own rules and errors','The finally block is perfect for closing files or connections cleanly']
  ),

  L('py-8', 8, 'File Systems & I/O', '📂',
    '🖥️ **Terminal Notice:** If you want to use a big terminal on your own computer instead of the built-in one, please read Lesson 1 for the full setup instructions.\n\nYour programs need to interact with the outside world. Reading text from files, parsing CSV data, and saving logs directly to your hard drive are essential skills for building persistent applications.',
    [
      { 
        title: '1. open() and File Modes', 
        beginner: 'To interact with a file, you must open it. The `open()` command requires a file name and a mode: `"r"` to read text, `"w"` to write (which overwrites the whole file!), or `"a"` to append (add text to the very bottom).', 
        advanced: 'Standard file handling operations lock system resources. Modes like `"rb"` and `"wb"` allow raw byte-stream manipulation for images or non-text binaries. Always explicitly declare string encoding (e.g., `encoding="utf-8"`) to prevent cross-platform character corruption.' 
      },
      { 
        title: '2. The `with` Context Manager', 
        beginner: 'If you open a file, you MUST close it using `.close()`, otherwise your file might get corrupted. To avoid forgetting, Python has a `with open(...) as file:` block. It acts as an automatic door that safely closes the file the moment your code block finishes!', 
        advanced: 'Context managers implement the `__enter__` and `__exit__` dunder methods. The `with` statement guarantees that the `__exit__` cleanup logic fires deterministically, instantly releasing the OS-level file descriptor lock even if a fatal exception is raised inside the block.' 
      },
      { 
        title: '3. Reading Data', 
        beginner: 'Once a file is open in read mode, you can use `.read()` to grab the entire file as one giant text block, or use a `for` loop to cleanly read the file line-by-line (perfect for massive files!).', 
        advanced: 'Using `.read()` loads the entire file payload into active RAM, which will crash your system on gigabyte-scale datasets. Iterating over the file object directly (`for line in file:`) utilizes a lazy generator pattern, consuming memory for only one line at a time.' 
      },
      { 
        title: '4. Parsing JSON', 
        beginner: 'JSON is the standard format for sending data across the internet. Python has a built-in `json` tool. Use `json.loads()` to convert JSON text into a usable Python dictionary, and `json.dumps()` to convert your dictionary back into text to save it!', 
        advanced: 'The built-in `json` module natively handles serialization (dumping) and deserialization (loading). For direct file interactions, utilize `json.dump(obj, file)` and `json.load(file)` to pipe data directly into open system streams without buffering intermediate strings.' 
      },
    ],
    { 
      title: 'The Permanent Log Book', 
      intro: 'Let\'s create a script that writes a permanent text file to your hard drive, reads it back, and displays the content.', 
      steps: [
        'Open your terminal and start Python.',
        'Use the automatic door manager to create a file: `with open("diary.txt", "w") as f:`',
        'Inside the block, write a string: `f.write("System initialized.\\n")` (the \\n forces a new line).',
        'Press Enter to exit the block. Python automatically closes and saves the file to your disk!',
        'Now append to it! `with open("diary.txt", "a") as f:` and `f.write("Task complete.")`',
        'Finally, read it back: `with open("diary.txt", "r") as f:` and then print `f.read()` to see your combined file output.'
      ], 
      goal: 'You successfully wrote, appended, and extracted permanent data from your operating system\'s hard drive using Python streams.' 
    },
    [
      q('What is the safest, standard way to open a file in Python to guarantee it closes properly?', ['Calling `open()` and manually typing `.close()` at the end','Using the `with open() as file:` context manager block','Leaving the file open in the background','Restarting your terminal'], 1, 'The `with` statement guarantees the file descriptor lock is safely released when the block ends, even if the program crashes.'),
      q('Which file mode should you use if you want to add a new sentence to the bottom of a text file without deleting the old text?', ['"r" (Read)','"w" (Write)','"a" (Append)','"x" (Execute)'], 2, 'The `"a"` (append) mode places the stream cursor at the very end of the file to preserve existing data.'),
      q('What happens if you use `.read()` on a massive 10-Gigabyte text file?', ['Python will read it 10 times faster','The entire file is loaded into RAM all at once, potentially crashing your computer','Python automatically zips the file','Python skips the first half of the file'], 1, '`.read()` dumps the entire file payload into active memory, which is highly inefficient for massive datasets compared to line-by-line iteration.'),
      q('Which standard library module handles converting Python dictionaries into formatted internet text structures?', ['The `math` module','The `csv` module','The `json` module','The `os` module'], 2, 'The built-in `json` module handles serialization mapping between Python objects and standard JSON strings.')
    ],
    ['Always use the with open() context manager to prevent file corruption','Mode w overwrites files completely, while mode a adds to the bottom','Loop through files line-by-line to save computer memory','JSON is the universal standard for saving and sending data structures']
  ),

  L('py-9', 9, 'Modules & the Standard Library', '🧩',
    '🖥️ **Terminal Notice:** If you want to use a big terminal on your own computer instead of the built-in one, please read Lesson 1 for the full setup instructions.\n\nYou don\'t have to build everything from scratch! Python comes with a massive "batteries included" standard library, and a rich ecosystem of external packages you can snap into your project like Lego bricks.',
    [
      { 
        title: '1. The import Keyword', 
        beginner: 'To use tools that aren\'t loaded by default, you must `import` them at the very top of your file. Typing `import math` gives you access to a huge toolbox of advanced calculators, which you can use by typing `math.sqrt(16)`.', 
        advanced: 'Importing a module executes that module\'s global namespace entirely from top to bottom. The interpreter caches imported modules inside the `sys.modules` dictionary, ensuring that subsequent imports reference the same cached memory object rather than reloading the file.' 
      },
      { 
        title: '2. Specific Imports (from / as)', 
        beginner: 'If you only need one specific tool from a massive toolbox, you can extract it directly: `from random import randint`. Now you can just type `randint(1, 10)` instead of `random.randint`. You can also rename long tools using `as`, like `import datetime as dt`.', 
        advanced: 'Use explicit `from x import y` statements rather than wildcard `from x import *` patterns. Wildcard imports pollute the local namespace, silently overwriting existing variables and making static analysis tools fail to track data origin.' 
      },
      { 
        title: '3. Custom Modules', 
        beginner: 'Any `.py` file you write can be imported! If you write a cool function inside `helper.py`, you can open a totally different file named `main.py` and type `import helper` to use your code. It keeps your projects clean and organized.', 
        advanced: 'Python locates custom modules by scanning the directory paths mapped inside the `sys.path` list. The current working directory (where you executed the script) is always placed at index 0, prioritizing local files over system-installed packages.' 
      },
      { 
        title: '4. __name__ == "__main__"', 
        beginner: 'When you import your custom `helper.py` file, Python runs all the code inside it instantly. To stop it from running tests or printing things during an import, hide that code under `if __name__ == "__main__":`. It acts as a shield!', 
        advanced: 'The global `__name__` variable is automatically assigned the string `"__main__"` if the script is executed directly by the terminal. If the script is loaded via an import statement, `__name__` is assigned the module\'s actual filename, bypassing the execution block.' 
      },
    ],
    { 
      title: 'The Password Generator', 
      intro: 'Let\'s leverage Python\'s built-in standard library to build a highly secure, randomized password creator without writing complex math ourselves.', 
      steps: [
        'Open your terminal REPL.',
        'Import the tools you need: `import random` and `import string`.',
        'Explore the string module! Type `string.ascii_letters` and `string.digits` to see the built-in alphabet arrays.',
        'Combine them into a pool: `pool = string.ascii_letters + string.digits`.',
        'Use the random module to pick 12 characters: `chars = random.choices(pool, k=12)`.',
        'Join the resulting list back into a clean string: `password = "".join(chars)`.',
        'Print your new random password!'
      ], 
      goal: 'You successfully imported standard library modules, accessed built-in constants, and utilized imported functions to generate secure outputs.' 
    },
    [
      q('Why is it dangerous to use a wildcard import like `from math import *` in a large project?', ['It forces the computer to restart','It silently dumps every variable from that module into your file, potentially overwriting your own custom variables with the same names','It triggers a firewall alert','It prevents the code from running on Mac computers'], 1, 'Wildcard imports heavily pollute the global namespace, causing naming collisions and making the origin of functions completely untraceable.'),
      q('Where does Python look first when you type an `import` statement for a custom file?', ['The official Python website server','The exact local folder where your main script is currently running','The computer\'s trash bin','The C: drive root'], 1, 'Python always prioritizes the current working directory (index 0 of `sys.path`) before scanning system-wide installation libraries.'),
      q('What does `if __name__ == "__main__":` actually do?', ['It converts all text to uppercase','It acts as a shield, ensuring the code underneath it only runs if the file is executed directly, NOT if it is imported by another file','It connects the code to the main internet router','It deletes the main file'], 1, 'This structural block protects executable script logic from firing automatically when the file is imported as a library component.'),
      q('If you type `import datetime as dt`, how must you call the module\'s functions later in the code?', ['datetime.function()','dt.function()','function()','datetime.dt.function()'], 1, 'The `as` keyword assigns an alias; you must strictly use that new aliased namespace (`dt`) to access the module\'s internal contents.')
    ],
    ['Use import statements at the top of your file to pull in tools','Aliasing with the `as` keyword keeps long module names clean and brief','Avoid wildcard (*) imports to protect your variable names','Always use the __main__ shield when building custom reusable files']
  ),

  L('py-10', 10, 'Virtual Environments & pip', '🛡️',
    '🖥️ **Terminal Notice:** If you want to use a big terminal on your own computer instead of the built-in one, please read Lesson 1 for the full setup instructions.\n\nWhen you build multiple projects, their dependencies will eventually clash. Virtual environments allow you to create isolated bubbles for each project, ensuring their external libraries never interfere with each other.',
    [
      { 
        title: '1. What is pip?', 
        beginner: '`pip` (Pip Installs Packages) is Python\'s official app store downloader. It allows you to download code written by other people from the internet straight into your project. Need to build a web scraper? Just type `pip install requests` in your terminal!', 
        advanced: 'Pip connects directly to PyPI (The Python Package Index). It handles dependency resolution, ensuring that if package A requires package B to run, both are downloaded and mapped correctly without manual intervention.' 
      },
      { 
        title: '2. The Dependency Nightmare', 
        beginner: 'Imagine Project 1 needs version 1.0 of a library, but Project 2 needs version 2.0. If you install them globally on your computer, one project will break! This is why you should never install packages directly onto your main system.', 
        advanced: 'Global environment pollution causes unrecoverable application rot. Managing dependencies strictly through isolated project-level boundaries is a mandatory requirement for stable deployment and CI/CD pipeline integration.' 
      },
      { 
        title: '3. Virtual Environments (venv)', 
        beginner: 'A virtual environment (`venv`) is an isolated bubble folder. When you create one and "activate" it, your terminal pretends it\'s a brand new, empty Python installation. Anything you `pip install` while the bubble is active stays securely trapped inside that folder!', 
        advanced: 'Executing `python -m venv .venv` generates an isolated binary tree. Activating the environment manipulates your system\'s `$PATH` variable, forcefully prioritizing the localized `python` and `pip` binaries over the global OS binaries.' 
      },
      { 
        title: '4. requirements.txt', 
        beginner: 'When you share your code with a friend, you don\'t send them your massive downloaded package folder. Instead, you create a text list of the tools you used (`pip freeze > requirements.txt`). Your friend can then install the exact same tools instantly using that list!', 
        advanced: 'The requirements file ensures deterministic builds. A proper deployment architecture requires strict version pinning (e.g., `requests==2.31.0`) to guarantee that future updates to third-party libraries do not introduce breaking API changes.' 
      },
    ],
    { 
      title: 'Creating the Bubble', 
      intro: 'Let\'s create a protected sandbox folder, activate the bubble, and install a powerful external library.', 
      steps: [
        'Open your normal system terminal (do not start the python >>> REPL yet).',
        'Create a new project folder and navigate inside it (`mkdir my_project` then `cd my_project`).',
        'Build the bubble folder: Type `python -m venv .venv` and hit Enter. Wait a few seconds for it to build.',
        'Activate the bubble! On Windows: `.venv\\Scripts\\activate`. On Mac/Linux: `source .venv/bin/activate`.',
        'Look at your terminal prompt—you should now see `(.venv)` at the beginning of the line! You are inside the bubble.',
        'Install a package safely: Type `pip install requests` and watch it download.',
        'To exit the bubble and return to normal, simply type the command `deactivate`.'
      ], 
      goal: 'You successfully scaffolded an isolated environment, rerouted your terminal paths, and installed external packages safely.' 
    },
    [
      q('What is the primary danger of installing all Python packages globally on your main operating system?', ['It costs a lot of money','Different projects requiring different versions of the same library will overwrite each other, causing projects to break permanently','The computer will run out of electricity','The internet connection will sever'], 1, 'Global pollution leads to dependency conflicts. Project A and Project B cannot easily share the same global namespace if they rely on conflicting library versions.'),
      q('What visual cue in your terminal indicates that a virtual environment has been successfully activated?', ['The terminal turns green','A prefix, typically `(.venv)`, appears at the very beginning of your terminal input line','A python logo pops up on screen','The terminal deletes all previous text'], 1, 'Activation scripts modify the terminal prompt variable (PS1) to display the name of the active environment bubble as a visual confirmation.'),
      q('How do you generate a text file listing every package currently installed inside your virtual environment?', ['pip list-all > text.txt','python download.txt','pip freeze > requirements.txt','export packages'], 2, 'The `pip freeze` command outputs a cleanly formatted list of all installed packages and their exact version numbers, perfect for a requirements file.'),
      q('What does `pip` stand for and what is its primary function?', ['Python Internet Protocol, for networking','Pip Installs Packages, the official tool for securely downloading and installing external libraries from PyPI','Personal Integer Parser, for math','Program Interface Panel, for UI'], 1, 'Pip is the official, built-in package manager used to query, download, and resolve external module dependencies from the Python Package Index.')
    ],
    ['Never pip install tools globally; always use an isolated project bubble','Use python -m venv to create a clean virtual environment folder','Look for the (.venv) prompt to confirm your bubble is active','Use requirements.txt to share your package list easily with other developers']
  ),

  L('py-11', 11, 'Comprehensions & Generators', '⚡',
    '🖥️ **Terminal Notice:** If you want to use a big terminal on your own computer instead of the built-in one, please read Lesson 1 for the full setup instructions.\n\nWriting "Pythonic" code means leaning into the language\'s unique, highly optimized features. Comprehensions allow you to map and filter lists in a single readable line, while generators let you handle massive datasets without running out of memory.',
    [
      { 
        title: '1. List Comprehensions', 
        beginner: 'Instead of writing a bulky 4-line `for` loop just to edit a list of items, you can write it all inside one pair of brackets! `[x * 2 for x in numbers]` instantly creates a brand new list where every number is doubled. It is clean, fast, and very popular.', 
        advanced: 'List comprehensions execute using optimized internal C-code routines, making them measurably faster than standard `for` loops utilizing `.append()`. They cleanly map to standard map/filter functional paradigms without the lambda overhead.' 
      },
      { 
        title: '2. Conditional Filtering', 
        beginner: 'You can add an `if` statement to the very end of a comprehension to filter out bad data instantly. Writing `[name for name in users if name != "admin"]` creates a new list with all the regular users, cleanly ignoring the admin in a single line!', 
        advanced: 'The standard conditional syntax `[expression for item in iterable if condition]` evaluates the filter first. If you need ternary assignment (changing the value based on a condition), it moves to the front: `[x if x > 0 else 0 for x in sequence]`.' 
      },
      { 
        title: '3. The `yield` Keyword (Generators)', 
        beginner: 'A normal function uses `return` to hand back a complete list. But what if the list has a billion items? Your computer would crash! Instead, use `yield`. It hands back one item, pauses the function, and waits. It generates items on-the-fly, saving massive amounts of memory.', 
        advanced: 'Generators implement the Iterator protocol (`__iter__` and `__next__`). Because they lazily evaluate and maintain their internal local state between `yield` calls, they represent $O(1)$ memory consumption regardless of how infinitely large the dataset sequence is.' 
      },
      { 
        title: '4. Generator Expressions', 
        beginner: 'If you swap the square brackets of a List Comprehension `[...]` for round parentheses `(...)`, you create a Generator Expression! It looks identical, but instead of building the whole list at once, it becomes a lazy machine that only calculates the next item when you ask for it.', 
        advanced: 'Always prefer generator expressions `(x**2 for x in data)` when piping sequences directly into aggregate functions like `sum()`, `max()`, or `any()`. It avoids materializing redundant intermediate lists in memory.' 
      },
    ],
    { 
      title: 'The One-Line Data Filter', 
      intro: 'Let\'s use Pythonic comprehensions to clean up a messy data array in a single, lightning-fast line of code.', 
      steps: [
        'Open your terminal REPL.',
        'Create a messy list of text: `data = ["apple", "BANANA", "cherry", "DATE"]`.',
        'We want a new list with only the lowercase words, and we want to capitalize their first letters.',
        'Write the comprehension: `clean = [fruit.capitalize() for fruit in data if fruit.islower()]`.',
        'Print `clean`. You should see `["Apple", "Cherry"]`.',
        'Now try a generator: Type `gen = (x * 10 for x in range(3))` and hit Enter.',
        'Type `next(gen)` to get 0. Type `next(gen)` again to get 10. You control the flow!'
      ], 
      goal: 'You successfully condensed multi-line loop/filter logic into a single comprehension and manually stepped through a lazy generator object.' 
    },
    [
      q('Why is a List Comprehension generally preferred over a standard `for` loop that uses `.append()`?', ['It connects to databases faster','It is more readable and executes faster because it utilizes optimized underlying C-level routines','It allows you to skip writing variables','It creates tuples instead of lists'], 1, 'Comprehensions are syntactically concise and execute faster because they bypass the continuous function-call overhead of `.append()`.'),
      q('What is the core functional difference between `yield` and `return`?', ['`return` pauses the function, `yield` ends it entirely','`return` only works with numbers, `yield` works with text','`return` terminates the function and passes data, `yield` passes data but suspends the function state so it can resume later','They are identical in every way'], 2, '`yield` turns a function into a lazy generator, preserving local state variables so execution can resume exactly where it left off on the next call.'),
      q('How do you quickly turn a List Comprehension into a memory-saving Generator Expression?', ['Change the square brackets `[...]` to round parentheses `(...)`','Add the word `lazy` to the front','Change the `for` to a `while`','Wrap it in quotation marks'], 0, 'Swapping brackets for parentheses changes the immediate list construction into a lazy generator expression.'),
      q('If you run `sum( x for x in range(1000000) )`, how much memory does the generator expression consume?', ['1 million bytes of RAM','Barely any, because it only calculates and holds one number in memory at a time','1 Gigabyte','It crashes immediately'], 1, 'Generators evaluate lazily; they yield a single value to the `sum()` function and discard it before calculating the next, keeping memory footprint flat at $O(1)$.')
    ],
    ['Use list comprehensions to write clean, fast, single-line loops','Filter data instantly by adding an if statement to the end of a comprehension','Use yield instead of return to build massive sequences without crashing your RAM','Use round parentheses to make comprehensions lazy and memory-efficient']
  ),

  L('py-12', 12, 'Decorators & Advanced Functions', '🎁',
    '🖥️ **Terminal Notice:** If you want to use a big terminal on your own computer instead of the built-in one, please read Lesson 1 for the full setup instructions.\n\nDecorators are Python\'s way of wrapping a gift. They allow you to dynamically alter or enhance the behavior of a function without actually modifying the function\'s internal code. It is a superpower for logging, timing, and security checks.',
    [
      { 
        title: '1. Functions are Objects', 
        beginner: 'In Python, functions are just data objects. You can save a function to a variable (`my_var = print`), pass a function as an argument into another function, or even return a function from inside another function!', 
        advanced: 'Python treats functions as first-class citizens. This means they are instances of the generic `function` object, capable of carrying custom attributes and being injected dynamically into complex higher-order routing pipelines.' 
      },
      { 
        title: '2. Inner Functions (Closures)', 
        beginner: 'You can define a new function completely hidden inside another function. This inner function has a special memory trick called a "closure"—it can remember and access the variables from the outer function even after the outer function has finished running!', 
        advanced: 'Closures bind local variables from the enclosing lexical scope into the inner function\'s namespace (`__closure__` attribute). This allows persistent state retention without requiring class instantiation or global variables.' 
      },
      { 
        title: '3. The Decorator Concept', 
        beginner: 'A decorator is simply a function that takes another function, adds some extra behavior (like printing a timestamp), and gives you back the newly improved function. It is like putting a plain phone inside a protective, waterproof case.', 
        advanced: 'Decorators implement the structural Wrapper pattern. They intercept the original function reference, replace it with a newly synthesized closure wrapper, and map the original execution block securely inside the wrapper scope.' 
      },
      { 
        title: '4. The @ Syntax', 
        beginner: 'Instead of writing ugly nested code to wrap functions, Python gives us the beautiful `@` symbol. Placing `@timer` directly above `def my_function():` instantly wraps your function inside the timer code automatically!', 
        advanced: 'The `@decorator` syntactic sugar explicitly executes `my_func = decorator(my_func)` at module load time. Always utilize `functools.wraps` inside your decorators to explicitly preserve the original function\'s identity, docstrings, and name signatures.' 
      },
    ],
    { 
      title: 'Building a Speed Tracker', 
      intro: 'Let\'s write a custom decorator from scratch that automatically times how long it takes for any function to execute.', 
      steps: [
        'Open your terminal REPL.',
        'Import the time tool: `import time`.',
        'Create the master decorator: `def speed_test(func):`.',
        'Inside it, create the wrapper: `def wrapper():`.',
        'Inside the wrapper, record start time: `start = time.time()`.',
        'Execute the target function: `func()`.',
        'Record end time and print: `print(f"Time: {time.time() - start}")`.',
        'End the decorator block by returning the wrapper: `return wrapper`.',
        'Now use it! Type `@speed_test`, and on the next line type `def slow_loop(): time.sleep(1)`.',
        'Call `slow_loop()` and watch your decorator automatically track the 1-second delay!'
      ], 
      goal: 'You successfully authored a higher-order wrapper function and applied it using syntactic sugar to augment existing behaviors without altering source code.' 
    },
    [
      q('What does it mean when we say functions are "first-class objects" in Python?', ['Functions must be written at the absolute top of the file','Functions can be assigned to variables, passed as arguments, and returned from other functions just like standard data','Functions are always processed faster than classes','Functions require an internet connection'], 1, 'Treating functions as first-class citizens allows for high-level functional programming, meaning they can be passed and modified dynamically like integers or strings.'),
      q('What is a "closure" in Python?', ['A secure way to close an open text file','An inner function that remembers the specific local variables of its parent function, even after the parent function has finished executing','A syntax error caused by missing parentheses','A tool used to shut down the computer'], 1, 'Closures capture and lock external lexical state inside their own localized namespace, allowing inner functions to retain persistent memory.'),
      q('What does placing the `@decorator_name` symbol directly above a function definition actually do?', ['It tells Python to ignore the function','It automatically wraps the target function inside the decorator logic right as the file is loaded into memory','It converts the function into an email address string','It triggers an immediate error'], 1, 'The `@` symbol is syntactic sugar that automatically intercepts the function creation, wraps it, and replaces the original variable name with the enhanced wrapper.'),
      q('Why is using `functools.wraps` highly recommended when building custom decorators?', ['It makes the code run 10x faster','It encrypts the source code automatically','It preserves the original function\'s metadata (like its specific name and documentation strings) which would otherwise be erased by the wrapper','It zips the file to save disk space'], 2, 'By default, decorators overwrite the target function\'s identity with the generic wrapper\'s identity. `wraps` cleanly restores the original name and docstrings.')
    ],
    ['Python functions are data objects that can be wrapped and moved around','Closures allow hidden inner functions to remember variables from their parents','Decorators modify behavior dynamically without altering the original code','Use the @ symbol directly above a function to instantly wrap it']
  ),
  
L('py-13', 13, 'Object-Oriented Programming I', '🏗️',
    '🖥️ **Terminal Notice:** If you want to use a big terminal on your own computer instead of the built-in one, please read Lesson 1 for the full setup instructions.\n\nAs programs grow, throwing hundreds of random functions and lists together becomes a chaotic mess. Object-Oriented Programming (OOP) fixes this by bundling related data and functions together into organized, reusable blueprints called Classes.',
    [
      { 
        title: '1. Classes vs. Objects', 
        beginner: 'A Class is just a blueprint. If you design a `Car` blueprint, you can\'t drive it. But you can use that blueprint to build an Object: an actual red Ferrari that you can drive. You build one Class to create thousands of unique Objects!', 
        advanced: 'Classes define memory structures and method resolution orders (MRO). Instantiating a class invokes its constructor, allocating contiguous memory for the object\'s specific state while maintaining references to the shared class-level namespace.' 
      },
      { 
        title: '2. The __init__ Method', 
        beginner: 'When you build a new object from your blueprint, Python instantly runs a special setup function called `__init__`. This is where you assign the object\'s initial properties, like giving a new user a `name` and starting their `score` at 0.', 
        advanced: '`__init__` is the initializer, not the true constructor (which is `__new__`). It mutates the newly allocated object state before returning it to the caller. Failing to initialize variables here leads to shared class-attribute pollution.' 
      },
      { 
        title: '3. The "self" Keyword', 
        beginner: 'Every function inside a class must have the word `self` as its first argument. `self` is how the object talks to itself! If the object wants to change its own score, it must explicitly type `self.score = 100`.', 
        advanced: '`self` is just a strong naming convention for the active instance reference dynamically passed by the interpreter during bound method calls. `obj.method()` is implicitly translated into `Class.method(obj)` at runtime.' 
      },
      { 
        title: '4. Methods vs. Attributes', 
        beginner: 'Attributes are things an object HAS (like `self.color = "Red"`). Methods are things an object can DO (like `def honk(self):`). Think of attributes as nouns, and methods as verbs.', 
        advanced: 'Attributes map to instance dictionaries (`__dict__`), while methods are bound functions stored in the class dictionary. Python descriptor protocols handle the seamless translation between the underlying function and the bound instance method.' 
      },
    ],
    { 
      title: 'Building a Robot Factory', 
      intro: 'Let\'s write our very first Class, use it to spawn a customized Robot object, and command it to speak.', 
      steps: [
        'Open your terminal REPL.',
        'Define the blueprint: `class Robot:`',
        'Add the setup function (indent 4 spaces!): `def __init__(self, name):`',
        'Assign the attribute (indent 8 spaces!): `self.name = name` and `self.battery = 100`.',
        'Add a behavior at the 4-space indent level: `def speak(self): print(f"I am {self.name}.")`',
        'Press Enter until you are out of the class block.',
        'Spawn an object! `r1 = Robot("Wall-E")`',
        'Check its battery: `print(r1.battery)`. Now make it talk: `r1.speak()`!'
      ], 
      goal: 'You successfully transitioned from procedural scripts into stateful Object-Oriented design by defining a class blueprint and instantiating a functional object.' 
    },
    [
      q('What is the core difference between a Class and an Object?', ['A Class is written in C, an Object is written in Python','A Class is a blueprint, an Object is the actual usable item built from that blueprint','A Class holds numbers, an Object holds text','They are the exact same thing'], 1, 'Classes act as abstract templates defining structure and behavior, while objects are concrete, instantiated manifestations of those templates existing in active memory.'),
      q('What is the primary purpose of the `__init__` method?', ['To delete the object from memory','To securely initialize the object\'s specific starting data right when it is created','To connect the object to the internet','To print error messages'], 1, 'The `__init__` (initializer) method is automatically triggered upon instantiation to establish the object\'s foundational instance variables and starting state.'),
      q('Why is the `self` keyword strictly required inside class methods?', ['To pass password checks','It explicitly tells Python to apply the changes to this specific object instance, rather than a generic global variable','It makes the code run infinitely','It prevents other files from reading the class'], 1, '`self` binds the method to the specific calling instance, allowing the method to read and write to that exact object\'s distinct memory address.'),
      q('If an object has a variable `self.speed = 50`, what is that conceptually known as?', ['An Attribute (a noun/property)','A Method (a verb/action)','A Class','An Exception'], 0, 'Instance variables tracking state (like color, speed, or health) are known as Attributes, while the functions dictating actions are Methods.')
    ],
    ['A Class is a blueprint; an Object is the actual item you build from it','The __init__ method sets up your object the moment it is born','Always use the self keyword so the object can interact with its own data','Attributes are nouns (properties); Methods are verbs (actions)']
  ),

  L('py-14', 14, 'Object-Oriented Programming II', '🧬',
    '🖥️ **Terminal Notice:** If you want to use a big terminal on your own computer instead of the built-in one, please read Lesson 1 for the full setup instructions.\n\nOnce you have basic classes, you can use Inheritance to share logic between them without copy-pasting code. A "Dog" class and a "Cat" class can both inherit the ability to eat from a master "Animal" class!',
    [
      { 
        title: '1. Inheritance', 
        beginner: 'If you want to build a `Drone` class, and you already have a `Robot` class, you don\'t have to start from scratch. `class Drone(Robot):` tells Python that the Drone should instantly inherit all the weapons and batteries the Robot already has!', 
        advanced: 'Inheritance represents an "is-a" structural relationship. Python supports multiple inheritance, resolving parent attribute lookups dynamically via the C3 Linearization algorithm (viewable via `Class.mro()`).' 
      },
      { 
        title: '2. The super() Function', 
        beginner: 'When a child class overrides its parent\'s setup, it still needs the parent\'s basic tools. `super().__init__()` acts as a direct phone line to the parent class, ensuring the parent\'s setup code runs alongside the child\'s new code.', 
        advanced: 'The `super()` proxy object cleanly routes method calls to the next class in the Method Resolution Order (MRO), preventing redundant executions and structural breaks in complex multi-inheritance architectures.' 
      },
      { 
        title: '3. Overriding Methods', 
        beginner: 'If a parent `Bird` class has a `def speak(): print("Chirp")`, a child `Duck` class can simply rewrite its own `def speak(): print("Quack")`. The child\'s unique code completely overrides the parent\'s default behavior!', 
        advanced: 'Method overriding leverages Polymorphism. Because Python uses Duck Typing, the caller does not care if the object is a Bird or a Duck, only that the resulting object implements the requested interface successfully at runtime.' 
      },
      { 
        title: '4. Dunder (Magic) Methods', 
        beginner: 'Methods with double-underscores (`__`) are Python\'s secret system hooks. By defining `__str__(self):`, you can control exactly what prints to the screen when someone types `print(my_object)`, making it readable instead of ugly computer gibberish.', 
        advanced: 'Dunder methods overload fundamental operator behavior. `__add__` controls the `+` operator, `__len__` controls `len()`, and `__eq__` controls `==`. Mastering them allows custom objects to interact natively with Python\'s built-in syntax.' 
      },
    ],
    { 
      title: 'The Flying Robot', 
      intro: 'Let\'s inherit from the Robot blueprint we made earlier, give the new subclass the unique ability to fly, and customize how it prints to the screen.', 
      steps: [
        'Open your terminal REPL.',
        'Define a parent: `class Robot:` and give it `def move(self): print("Rolling...")`.',
        'Create a child class that inherits it: `class Drone(Robot):`',
        'Inside the child, add a new ability: `def fly(self): print("Taking off!")`.',
        'Override the parent\'s movement: `def move(self): print("Flying...")`.',
        'Add a magic string method: `def __str__(self): return "I am a high-tech Drone."`',
        'Exit the block and spawn it: `d = Drone()`.',
        'Call `d.fly()`, check the overridden `d.move()`, and just type `print(d)` to see your magic string!'
      ], 
      goal: 'You successfully implemented inheritance, extended functionality with new child methods, overridden default behaviors, and customized internal dunder outputs.' 
    },
    [
      q('What is the primary benefit of Class Inheritance?', ['It makes code run asynchronously','It eliminates repetitive copy-pasting by allowing a child class to share and reuse the logic established in a parent class','It forces all variables to be strings','It prevents errors globally'], 1, 'Inheritance enforces the DRY (Don\'t Repeat Yourself) principle, centralizing shared logic in the parent class while allowing targeted specialization in the subclasses.'),
      q('If a subclass has its own `__init__` setup, how does it properly trigger the parent class\'s setup as well?', ['By typing `run_parent()`','By deleting its own `__init__`','By utilizing the `super().__init__()` proxy function inside its own setup block','Parents cannot be triggered'], 2, 'The `super()` function delegates method resolution up the inheritance chain, safely executing parent initializations without hardcoding the parent\'s direct class name.'),
      q('If both the parent class and the child class have a method named `def attack(self):`, what happens when the child object calls it?', ['Python crashes with a duplicate name error','Both attack methods fire simultaneously','The child\'s custom attack method completely overrides and replaces the parent\'s version','The parent\'s version runs, ignoring the child'], 2, 'Subclasses structurally override parent definitions. When the runtime executes a method lookup, it checks the child\'s dictionary first, firing the localized logic.'),
      q('What does defining the special `__str__(self):` magic method allow you to do?', ['Turn all text into strings automatically','Control the exact, readable text output that appears when someone uses `print()` on your object','Connect to the string module','Prevent the object from being deleted'], 1, 'The `__str__` dunder method overloads the default system representation, replacing the raw memory address output with a clean, human-readable string representation.')
    ],
    ['Inheritance creates a Parent-Child relationship, letting you reuse code instantly','Use super() to safely call a parent\'s methods from inside the child','Subclasses can Override parent methods by simply reusing the exact same function name','Dunder methods (like __str__) let you secretly hook into standard Python actions']
  ),

  L('py-15', 15, 'Type Hinting & Pydantic', '🏷️',
    '🖥️ **Terminal Notice:** If you want to use a big terminal on your own computer instead of the built-in one, please read Lesson 1 for the full setup instructions.\n\nPython lets you put text into a variable that was meant for numbers, causing explosive crashes later. Type Hinting fixes this by letting you label your variables. It is the secret to building massive, unbreakable enterprise applications.',
    [
      { 
        title: '1. Basic Type Annotations', 
        beginner: 'You can hint what a variable should be by adding a colon. `age: int = 25` tells other developers (and your code editor) that `age` must be an integer. For functions, `def greet(name: str) -> str:` says it takes text and returns text!', 
        advanced: 'Python is fundamentally dynamically typed; standard type hints are strictly ignored by the runtime interpreter. They exist solely for static analysis tools (like MyPy) and IDE language servers to enforce structural integrity pre-execution.' 
      },
      { 
        title: '2. The typing Module', 
        beginner: 'What if you have a list, but you want to guarantee it only holds numbers? You can import tools to get specific! Using `List[int]` means a list of integers. `Dict[str, int]` means a dictionary with text keys and number values.', 
        advanced: 'As of Python 3.9+, standard collections natively support generics (e.g., `list[int]` instead of importing `typing.List`). However, understanding the `typing` module is mandatory for backwards compatibility and advanced structural patterns like `Callable` and `Any`.' 
      },
      { 
        title: '3. Union and Optional', 
        beginner: 'Sometimes a variable can be more than one thing. `Union[int, float]` means it can be a whole number OR a decimal. `Optional[str]` is a lifesaver—it means the variable should be text, but it is also allowed to be totally empty (`None`).', 
        advanced: 'In modern Python (3.10+), `Union[int, str]` is cleanly syntactically simplified to the bitwise OR operator `int | str`. `Optional[str]` is exactly equivalent to `str | None`.' 
      },
      { 
        title: '4. Intro to Pydantic', 
        beginner: 'Standard type hints don\'t actually stop bad code from running. That is where external libraries like `Pydantic` come in. It turns your hints into strict bouncers. If you hint `age: int` and someone tries to pass the word "Twenty", Pydantic actively blocks it and throws an error!', 
        advanced: 'Pydantic bridges the gap between static typing and runtime validation. By extending `BaseModel`, it automatically coerces types during parsing (e.g., casting string "5" to int 5) and guarantees API payload integrity for frameworks like FastAPI.' 
      },
    ],
    { 
      title: 'The Typed Calculator', 
      intro: 'Let\'s write a fully annotated function to see how Type Hints make our code self-documenting and easier for other developers to read.', 
      steps: [
        'Open your terminal REPL.',
        'Define a heavily typed function: `def calculate_tax(price: float, tax_rate: float) -> float:`',
        'Inside, return the math: `return price + (price * tax_rate)`.',
        'Notice how the `-> float` clearly tells anyone reading the code exactly what to expect back.',
        'Run it: `calculate_tax(100.0, 0.05)`.',
        'Now type `calculate_tax("One Hundred", "Five")`.',
        'Notice that it crashes! Type Hints do not stop execution on their own, but if you used an editor like VSCode, it would have shown a giant red underline warning you BEFORE you ran it!'
      ], 
      goal: 'You successfully applied static type constraints and return annotations to a function signature, improving developer readability and enabling static analysis.' 
    },
    [
      q('What actually happens at runtime if you violate a standard Python type hint (like passing a string to an `int` hint)?', ['Python crashes instantly with a TypeError','Python ignores the hint completely; standard hints do not stop the code from running','Python secretly converts the string','The computer restarts'], 1, 'Standard type annotations are purely organizational metadata. The Python interpreter ignores them during execution; they rely entirely on external linters (like MyPy) to catch errors.'),
      q('In the function signature `def fetch_user() -> dict:`, what does the `-> dict` represent?', ['It forces the function to take a dictionary as input','It restricts the function to one line of code','It explicitly documents that the function will return a dictionary data structure to the caller','It imports the dictionary module'], 2, 'The arrow syntax `->` designates the expected return type of the function, providing crucial structural guarantees to whoever relies on the function output.'),
      q('What does the type hint `Optional[str]` indicate?', ['The user can skip writing this code','The variable must be a string, or it is allowed to be exactly `None` (empty)','It chooses a random string','It creates an optional checkbox UI'], 1, '`Optional[X]` is standard shorthand for `Union[X, None]`. It signals that missing or null values are an explicitly expected and permitted state.'),
      q('Why do professional developers use the external library `Pydantic`?', ['Because it makes Python run faster in the browser','Because it enforces type hints AT RUNTIME, aggressively blocking bad data and converting inputs to protect the application','Because it replaces the standard library','It designs web graphics'], 1, 'Unlike standard hints which are passive, Pydantic actively validates data payloads during execution, casting valid inputs and crashing immediately on structural violations.')
    ],
    ['Use colons to hint variables, and arrows (->) to hint what functions give back','Hints act as highly visible documentation that smart code editors use to warn you of bugs','Optional[X] is perfect for data that might be missing or empty','Standard hints don\'t stop the program; use libraries like Pydantic for strict runtime defense']
  ),

  L('py-16', 16, 'APIs & Web Requests', '🌐',
    '🖥️ **Terminal Notice:** If you want to use a big terminal on your own computer instead of the built-in one, please read Lesson 1 for the full setup instructions.\n\nYour code doesn\'t have to live in isolation. APIs (Application Programming Interfaces) allow your Python scripts to talk to the rest of the internet—fetching live weather data, sending automated emails, or pulling stock prices in real-time.',
    [
      { 
        title: '1. What is an API?', 
        beginner: 'Think of an API as a digital restaurant waiter. You (the client) give the waiter an order (a Request). The waiter takes it to the kitchen (the Server). The kitchen prepares the food, and the waiter brings it back to you (the Response).', 
        advanced: 'RESTful APIs operate over HTTP, mapping standard stateless CRUD operations (Create, Read, Update, Delete) to highly structured URI endpoints. Payloads are heavily serialized, typically transmitted as JSON.' 
      },
      { 
        title: '2. The Requests Library', 
        beginner: 'Python\'s built-in internet tools are clunky. The external `requests` library is the industry standard for web scraping and API calls. You can fetch a webpage instantly just by typing `requests.get("https://google.com")`!', 
        advanced: 'The `requests` library abstracts underlying `urllib3` connection pooling, SSL/TLS verification, and session state persistence, making low-level socket management completely invisible to the developer.' 
      },
      { 
        title: '3. Status Codes', 
        beginner: 'When a server replies, it includes a 3-digit number. `200` means "Perfect, here is your data!" `404` means "File Not Found." `401` means "You are not authorized (bad password)." Always check your status code before trusting the data!', 
        advanced: 'HTTP Status Codes categorize response behaviors structurally. 2xx dictates success, 3xx dictates redirection, 4xx dictates client-side failure (bad payload/auth), and 5xx dictates catastrophic upstream server failures.' 
      },
      { 
        title: '4. GET vs. POST & JSON', 
        beginner: 'A `GET` request just asks to read data (like loading a webpage). A `POST` request securely sends new data up to the server (like submitting a login form). Most APIs reply in JSON text, which `requests` can instantly convert to a dictionary using `.json()`.', 
        advanced: 'GET requests encode parameters strictly in the query string of the URL, exposing them to router logs. POST requests encapsulate payloads securely within the HTTP message body, allowing complex, massive data transmission.' 
      },
    ],
    { 
      title: 'The PokeAPI Fetcher', 
      intro: 'Let\'s write a script that connects to the public Pokemon API over the internet, fetches live JSON data, and parses it cleanly.', 
      steps: [
        'Open your terminal and ensure you are in an environment with the library installed (`pip install requests`).',
        'Launch the REPL and type `import requests`.',
        'Make the GET request: `response = requests.get("https://pokeapi.co/api/v2/pokemon/pikachu")`.',
        'Check the status to ensure the server liked your request: `print(response.status_code)`. (Look for 200!).',
        'Extract the JSON data into a dictionary: `data = response.json()`.',
        'Now parse it! Find Pikachu\'s weight: `print(data["weight"])`.',
        'Find his ID number: `print(data["id"])`.'
      ], 
      goal: 'You successfully executed a stateless HTTP GET request, verified the network handshake, deserialized the JSON response body, and extracted targeted dictionary data.' 
    },
    [
      q('What is the primary difference between an HTTP GET request and a POST request?', ['GET is fast, POST is slow','GET asks to read data from the server, POST safely submits new payload data up to the server','GET deletes databases, POST creates them','There is no difference'], 1, 'GET requests are idempotent and used strictly for data retrieval, while POST requests package body data to mutate or create new state on the destination server.'),
      q('If your API request returns a Status Code of `404`, what does it mean?', ['The server crashed completely','You forgot to pay for the API','The specific URL or data you requested could not be found','The request was a perfect success'], 2, 'The 404 status code universally dictates a Client Error where the server is alive and responding, but the specific endpoint resource does not exist.'),
      q('What does the standard `.json()` method do when attached to a successful `requests` response object?', ['It deletes the file','It zips the response to save hard drive space','It translates the raw internet text perfectly into a usable Python dictionary','It launches a web browser'], 2, 'The `.json()` function automatically deserializes the raw string payload body into native Python lists and dictionaries.'),
      q('Why is the `requests` library overwhelmingly preferred over Python\'s built-in internet tools?', ['It is built by Google','Its syntax is highly abstracted, readable, and handles complex SSL and session management invisibly','It is the only library allowed on Mac computers','It requires no memory'], 1, '`requests` revolutionized Python networking by aggressively abstracting the horrific boilerplate code required by standard built-in modules like `urllib`.')
    ],
    ['Use the external requests library to communicate with the internet easily','Always verify your response.status_code == 200 before trusting the data','GET requests ask for information; POST requests submit new information','Use .json() to magically turn API text responses into workable Python dictionaries']
  ),

  L(
    'py-test-1', 16.5, 'Midterm Assessment: Core Python Mastery', '📝', 
    'Welcome to the Midterm Assessment! This is a comprehensive review checkpoint. Instead of learning a new topic, you are going to test your mastery of everything covered from Lesson 1 through Lesson 15. This includes core data structures, control flow logic, functional programming, basic Object-Oriented architecture, file handling, and virtual environments.',
    [
      { title: '1. Core Mechanics & Data Structures', beginner: 'You should feel completely comfortable creating variables, looping through lists, looking up values in dictionaries, and writing if/else logic to control how your program makes decisions under different conditions.', advanced: 'At this stage, your understanding of mutable versus immutable types, memory reference assignment, and scope resolution (the LEGB rule) should be solid. You should know how to manipulate basic data structures efficiently without causing unintended side effects.' },
      { title: '2. Functions & Error Handling', beginner: 'You must know how to write custom functions that accept incoming arguments and return processed results. Additionally, you should know how to use try/except blocks to stop your program from crashing entirely when something unexpected happens.', advanced: 'You should be fully capable of utilizing `*args` and `**kwargs` for highly flexible function signatures, raising custom application-specific exceptions, and tracking the complete execution flow of `try/except/else/finally` blocks.' },
      { title: '3. Object-Oriented Basics', beginner: 'You should understand how to build custom classes acting as blueprints, create individual object instances from those blueprints, and use the `__init__` method to safely set up their starting data.', advanced: 'You must understand the explicit difference between class-level attributes and instance-level attributes, how to set up foundational inheritance structures, and how to define standard dunder methods like `__str__` to control how objects are represented.' },
      { title: '4. The Development Environment', beginner: 'You need to be comfortable opening your computer\'s terminal, activating a virtual environment, installing external tools with the `pip` command, and running your Python scripts natively from the command line.', advanced: 'Your workflow should seamlessly integrate strict isolated virtual environments for every single project you build, heavily utilizing `requirements.txt` files to safely manage and share third-party dependencies.' }
    ],
    {
      title: 'Midterm Capstone Application',
      intro: 'For your practical exam, you will combine everything you know to build a fully functional, object-oriented weather data processor that fetches live information from an API, parses JSON payloads, and handles unexpected network errors safely.',
      steps: [
        'Open your terminal, create a new project directory, and initialize a fresh virtual environment.',
        'Install the `requests` library via pip and freeze your dependencies into a `requirements.txt` file.',
        'Create a class named `WeatherClient` that takes a base API URL and an authentication key during its `__init__` instantiation.',
        'Write a method inside the class that uses a `try/except` block to execute a GET request, safely catching any `requests.exceptions.ConnectionError` if the internet fails.',
        'Parse the returning JSON data from the API and dynamically instantiate local, custom `CityWeather` data objects for each result.',
        'Write an execution script that loops through these objects and writes a formatted data summary to a local `.txt` file using the `with open()` context manager.'
      ],
      goal: 'You successfully integrated core logic, API networking, OOP, error handling, and file I/O into a single cohesive, crash-proof application.'
    },
    [
      q('In Python, what exactly happens if you attempt to modify or reassign an element inside a tuple after it has been created?', ['The tuple resizes automatically to accommodate the data change', 'A TypeError is thrown because tuples are strictly immutable data structures', 'The tuple silently converts itself into a list', 'The change is saved temporarily but wipes when the script closes'], 1, 'Tuples are immutable. Once instantiated, their internal structure and element assignments are locked and cannot be altered. Lists should be utilized if mutability is required.'),
      q('What is the architectural purpose of the `finally` block in a `try/except` error handling pipeline?', ['It forces the program to crash entirely if an error occurs', 'It is an optional block that executes only if NO exceptions were raised', 'It executes unconditionally at the end of the block sequence, making it the standard location for cleaning up system resources like open files or database connections regardless of success or failure', 'It automatically restarts the loop if an error was successfully caught'], 2, 'The `finally` block is strictly guaranteed to run by the Python interpreter, making it the architectural standard for ensuring critical teardowns always execute.'),
      q('When defining instance methods inside a custom class, why must `self` be explicitly declared as the first parameter?', ['Because Python uses `self` to automatically import external libraries', 'Because the interpreter automatically passes the specific object instance calling the method as the first argument, allowing the method to access its internal instance data', 'Because it is a strict security requirement to prevent data leaks across classes', 'Because `self` flags the method to run asynchronously'], 1, 'Instance methods act directly on specific object instances. Python implicitly passes the instance (`self`) so the internal logic knows exactly which object\'s data dictionary it should interact with.'),
      q('What is the primary danger of installing third-party packages globally on your system using pip instead of using an isolated Virtual Environment?', ['Global packages run significantly slower than local packages', 'Global installations can cause catastrophic version conflicts across different projects, breaking older scripts when newer package versions are globally overwritten', 'Global packages automatically delete themselves from the system after 30 days', 'Global packages are completely blocked from being uploaded to GitHub'], 1, 'Virtual environments isolate project dependencies. Installing packages globally pollutes the root system Python interpreter and leads to unavoidable dependency version collisions.'),
      q('Which of the following built-in tools is specifically designed to iterate through an iterable while automatically tracking both the current index number and the value simultaneously?', ['range()', 'enumerate()', 'zip()', 'filter()'], 1, 'The `enumerate()` function wraps an iterable and yields a tuple containing the iteration count (the index) and the value, completely eliminating the need to manually track integer index counters inside loops.')
    ],
    ['You have fully mastered the foundational mechanics of Python development.', 'You can successfully structure multi-file projects and manage external system dependencies.', 'You understand how to encapsulate business logic using robust Object-Oriented design patterns.', 'You are officially ready to advance into complex software architecture!']
  ),

  L('py-17', 17, 'Asynchronous Python', '⏱️',
    '🖥️ **Terminal Notice:** If you want to use a big terminal on your own computer instead of the built-in one, please read Lesson 1 for the full setup instructions.\n\nNormal Python code is "synchronous"—it does one thing at a time. If it asks an API for data, the entire script freezes and waits. Asynchronous Python (`async/await`) fixes this by letting your code multitask in the background while waiting for slow things like networking or file downloads!',
    [
      { 
        title: '1. The Event Loop', 
        beginner: 'Think of the Event Loop as a super-fast chef. If the chef puts a turkey in the oven (a slow API request), they don\'t stand there staring at it for 4 hours. They move on to chop veggies! The Event Loop manages tasks, pausing the slow ones and running the fast ones.', 
        advanced: 'The `asyncio` event loop is a single-threaded cooperative multitasking architecture. It continuously cycles through an internal queue of tasks, yielding execution thread-time during I/O blocking operations.' 
      },
      { 
        title: '2. async def', 
        beginner: 'To tell Python that a function is capable of multitasking, you simply add the word `async` to the front of it: `async def fetch_data():`. This turns your normal function into a special pausing object called a Coroutine.', 
        advanced: 'Declaring a function with `async def` changes its return behavior entirely. Instead of executing code when called, it strictly returns an unexecuted Coroutine object that must be explicitly scheduled onto the event loop.' 
      },
      { 
        title: '3. The await Keyword', 
        beginner: 'Inside your async function, when you hit a slow task, you type `await`. `await slow_download()` tells Python: "This will take a while. Pause this function, go do other things, and come back here exactly when the download finishes!"', 
        advanced: 'The `await` expression yields control back to the central event loop. It can only be applied to "Awaitable" objects (Coroutines, Tasks, or Futures). It fundamentally acts as an execution suspension point.' 
      },
      { 
        title: '4. asyncio.gather()', 
        beginner: 'If you need to download 10 different files, synchronous Python does them one-by-one, taking 10 minutes. By putting them into `asyncio.gather()`, Python launches all 10 downloads instantly at the exact same time, finishing in just 1 minute!', 
        advanced: '`asyncio.gather()` takes multiple coroutines, schedules them concurrently as tasks on the active loop, and aggregates their returned results into a localized list while maintaining the original execution order.' 
      },
    ],
    { 
      title: 'The Multitasking Chef', 
      intro: 'Let\'s write an asynchronous script that cooks two different meals at the same time, proving that Python can run background tasks without freezing.', 
      steps: [
        'Open your terminal and launch Python.',
        'Import the core async tool: `import asyncio`.',
        'Create a slow coroutine: `async def cook(food, delay):`',
        'Inside it, add a print: `print(f"Started {food}...")`.',
        'Add the magic pause: `await asyncio.sleep(delay)`. (This simulates slow cooking).',
        'Finish it: `print(f"Finished {food}!")`.',
        'Create the master runner: `async def main():`',
        'Inside `main`, launch both concurrently: `await asyncio.gather(cook("Steak", 3), cook("Eggs", 1))`',
        'Exit the blocks, and trigger the event loop: `asyncio.run(main())`. Notice how Eggs finish BEFORE Steak, even though Steak started first!'
      ], 
      goal: 'You successfully implemented a cooperative multitasking coroutine, yielding control back to the event loop, and executing concurrent blocking operations simultaneously.' 
    },
    [
      q('What is the core difference between synchronous and asynchronous code?', ['Sync is for math, Async is for text','Sync freezes and waits for each task to finish before moving on; Async pauses slow tasks to work on other things simultaneously','Sync is built into Python, Async requires a monthly subscription','There is no difference'], 1, 'Synchronous code blocks execution entirely during I/O delays. Asynchronous architecture yields the execution thread to other tasks during I/O waits, maximizing throughput.'),
      q('What happens if you call an `async def` function directly without using the `await` keyword?', ['It crashes the computer entirely','It runs normally but very fast','It does NOT run the code inside; it just returns a suspended Coroutine memory object','It formats your hard drive'], 2, 'Calling an async function implicitly generates an unexecuted coroutine object. The logic inside strictly requires an event loop scheduler (via `await` or `run()`) to actually execute.'),
      q('What is the purpose of the `await` keyword inside an async function?', ['It acts as a breakpoint, yielding control back to the Event Loop to do other things until the slow task completes','It stops the program forever','It makes the internet connection faster','It downloads a specific file'], 0, '`await` tells the runtime: "Suspend this exact function state and process other loop queue tasks until this specific I/O operation returns a result."'),
      q('Why is `asyncio.gather()` considered an incredibly powerful tool for networking?', ['It encrypts all network data natively','It completely bypasses all firewall security','It allows you to fire off dozens of API requests simultaneously instead of waiting for them one by one','It acts as a physical router'], 2, '`gather()` schedules multiple awaitable coroutines onto the loop simultaneously, turning sequential network blocking bottlenecks into highly concurrent, massive parallel requests.')
    ],
    ['Use the async keyword to create functions that are capable of pausing','Use the await keyword right before slow tasks to let Python multitask in the background','The Event Loop is the traffic controller managing all the pausing and resuming','Use asyncio.gather() to launch massive amounts of tasks at the exact same time']
  ),

  L('py-18', 18, 'Unit Testing & Pytest', '🧪',
    '🖥️ **Terminal Notice:** If you want to use a big terminal on your own computer instead of the built-in one, please read Lesson 1 for the full setup instructions.\n\nWriting code is easy; writing code that doesn\'t randomly break 6 months later is hard. Unit testing involves writing separate "robot scripts" that constantly check your main code to ensure it still works exactly as intended.',
    [
      { 
        title: '1. Why Test?', 
        beginner: 'Imagine you update a calculator function, but accidentally break division without noticing. If you release the code, users will crash. Tests are tiny automated alarms. Before you release code, you run your tests. If division breaks, the test flashes red, saving you from disaster!', 
        advanced: 'Test-Driven Development (TDD) ensures CI/CD pipeline integrity. Unit tests strictly isolate domain logic, guaranteeing that refactoring or dependency updates do not cause systemic logic regressions in production environments.' 
      },
      { 
        title: '2. The assert Keyword', 
        beginner: 'The foundation of all testing is `assert`. It simply means "I claim this is true!" If you write `assert 1 + 1 == 2`, Python does nothing because it is true. If you write `assert 1 + 1 == 3`, Python violently crashes with an AssertionError. We use these crashes as alarms!', 
        advanced: 'The `assert` keyword evaluates the subsequent boolean expression. It is optimized away entirely if Python is run in optimized mode (`-O` flag), which is why assertions should strictly be used for testing, never for runtime data validation.' 
      },
      { 
        title: '3. Intro to Pytest', 
        beginner: 'While Python has built-in testing tools, the entire industry uses an external library called `pytest`. It is incredibly easy. You just name a file `test_math.py`, write a function named `test_addition()`, and run the `pytest` command. It automatically finds your asserts and prints a beautiful report!', 
        advanced: 'Pytest heavily utilizes introspection. It rewrites standard assertion ASTs (Abstract Syntax Trees) at runtime to provide deep, highly detailed variable comparisons in its traceback outputs without requiring verbose boilerplate classes.' 
      },
      { 
        title: '4. Test Isolation', 
        beginner: 'A good test only checks ONE specific thing, and never relies on other tests. If `test_login` fails, it shouldn\'t cause `test_logout` to fail too. Keep your tests completely separated so you know exactly what broke!', 
        advanced: 'Tests must be completely deterministic and stateless. Pytest implements "Fixtures" via decorators to cleanly inject setup/teardown state (like mock database connections) into specific test functions, maintaining strict isolation.' 
      },
    ],
    { 
      title: 'Building the Alarms', 
      intro: 'Let\'s write a simple math function, and then use the `assert` keyword to build an automated safety test around it.', 
      steps: [
        'Open your terminal REPL.',
        'Write the logic you want to test: `def get_square(num): return num * num`.',
        'Write your test function: `def test_get_square():`',
        'Inside the test, add an assertion that you KNOW should pass: `assert get_square(4) == 16`.',
        'Add another assertion: `assert get_square(0) == 0`.',
        'Run your test by typing `test_get_square()`. Notice nothing happens! Silence means it passed perfectly!',
        'Now deliberately break it: `assert get_square(5) == 30`.',
        'Run it again. Watch the `AssertionError` scream at you, successfully warning you that the logic is wrong!'
      ], 
      goal: 'You successfully implemented the foundation of automated software verification by utilizing the assertion keyword to structurally evaluate function outputs.' 
    },
    [
      q('What is the absolute primary purpose of writing Unit Tests in a software project?', ['To increase the visual graphics of a website','To automatically detect when new code changes accidentally break older, functioning code','To permanently delete error messages','To deploy code to AWS servers'], 1, 'Unit tests act as regression guards. They run constantly to ensure that refactored features and new commits do not violate the core business logic established previously.'),
      q('What happens in Python when an `assert` statement evaluates to `False`?', ['The program instantly crashes and throws an AssertionError','Python secretly fixes the math to make it true','Python emails the developer','The program skips the line and continues'], 0, 'Assertions act as rigid boolean checkpoints. If the statement evaluates to False, the runtime violently terminates, flagging the exact failure point.'),
      q('If you are using the industry-standard `pytest` framework, how must you name your test files so the framework can find them automatically?', ['They must be named `secure.py`','They must be zipped into a folder named `tests`','They must start with `test_` (like `test_calculator.py`)','They must have no file extension'], 2, 'Pytest utilizes auto-discovery. It systematically scans directory trees for files prefixed with `test_` or suffixed with `_test`, automatically mapping and executing the assertions inside.'),
      q('Why is it dangerous to rely on `assert` for runtime security checks (like validating user passwords) instead of just using it for testing?', ['Asserts cannot check strings','Asserts slow down the computer too much','Python can be run in "optimized mode" which entirely ignores and skips all `assert` statements','Asserts only work on Mac computers'], 2, 'Assertions are specifically designed for developer debugging. If the interpreter runs with the `-O` optimization flag, all `assert` blocks are stripped from bytecode, destroying your security checks.')
    ],
    ['Automated tests are safety nets that prevent you from accidentally breaking old code','The assert keyword violently crashes the program if a statement is false','Use the Pytest library and name your files test_something.py for automatic scanning','Keep tests strictly isolated so an error in one doesn\'t poison the others']
  ),

 L('py-19', 19, 'Advanced Decorator Patterns', '🎩',
    '🖥️ **Terminal Notice:** If you want to use a big terminal on your own computer instead of the built-in one, please read Lesson 1 for the full setup instructions.\n\nNow that you know how to build simple decorators, let\'s look at professional-grade patterns. Decorators are the secret weapon for injecting cross-cutting logic—like security, logging, or caching—into any part of your system without touching the original code.',
    [
      { 
        title: '1. Decorators with Arguments', 
        beginner: 'What if you want your decorator to take an input? (e.g., `@retry(times=3)`). You need to add an extra layer of nesting: a function that returns a decorator, which returns the wrapper. It is the "Russian Nesting Doll" of Python coding.', 
        advanced: 'Creating decorators with arguments requires three levels of closure nesting. The outer function processes the arguments, the middle level intercepts the decorated function, and the inner level handles the execution wrap.' 
      },
      { 
        title: '2. functools.wraps', 
        beginner: 'Whenever you wrap a function in a decorator, the original function "forgets" its own name and documentation. Always import `functools` and use the `@wraps(func)` decorator inside your wrapper to copy the original function\'s identity to the wrapper.', 
        advanced: 'Without `@wraps`, the decorated function loses its `__name__` and `__doc__` attributes, which breaks introspection tools, type checkers, and documentation generators like Sphinx.' 
      },
      { 
        title: '3. Class-Based Decorators', 
        beginner: 'You don\'t have to use functions to decorate! You can use a Class. By defining `__init__` (to take the function) and `__call__` (to run the wrapper logic), your object acts exactly like a function.', 
        advanced: 'Class-based decorators are superior for managing complex stateful data between calls. `__call__` turns the instance into a callable object, allowing you to maintain internal caches or counts across multiple method executions.' 
      },
      { 
        title: '4. Method Decorators', 
        beginner: 'Decorating a method inside a class is tricky because methods have `self`. Your wrapper must accept `*args` and `**kwargs` to make sure it can handle the hidden `self` argument passed to the class method.', 
        advanced: 'The decorator must be "method-aware." By using `*args` and `**kwargs`, you ensure that the decorator doesn\'t crash when it encounters the instance reference (`self`) or class reference (`cls`) passed during bound method calls.' 
      },
    ],
    { 
      title: 'The "Retry" Security Guard', 
      intro: 'Let\'s build a professional decorator that automatically retries a function if it crashes, which is vital for unreliable network connections.', 
      steps: [
        'Open your terminal REPL.',
        'Import tools: `import functools`, `import time`.',
        'Create the factory: `def retry(attempts):`.',
        'Inside, create the decorator: `def decorator(func):`.',
        'Inside that, use `@functools.wraps(func)` and define the `wrapper`.',
        'Use a `for` loop inside the wrapper to try running `func()` and `except` errors, sleeping between attempts.',
        'Test it with a function that fails twice then succeeds!'
      ], 
      goal: 'You successfully engineered a multi-level nesting decorator factory, maintained function identity with wraps, and implemented stateful retry logic.' 
    },
    [
      q('Why is `@functools.wraps(func)` considered a mandatory best practice in professional decorators?', ['It makes the code run in parallel','It copies the original function\'s name and docstrings to the wrapper, preserving its identity for debuggers and documentation tools','It prevents the decorator from running too often','It zips the project folder'], 1, 'Without `@wraps`, the original function metadata is lost, which makes debugging and automated documentation impossible.'),
      q('What is the "Russian Nesting Doll" pattern in decorators used for?', ['To delete the code','To pass parameters into a decorator (like @retry(times=3))','To make the computer louder','To bypass password protection'], 1, 'Decorators that accept arguments require an extra layer of outer function nesting to capture those arguments before the actual decoration happens.'),
      q('When writing a class-based decorator, which dunder method allows the class instance to be used like a function?', ['`__init__`','`__call__`','`__str__`','`__new__`'], 1, 'The `__call__` method allows an object instance to be invoked with parentheses, making it interchangeable with functions in decorator syntax.'),
      q('Why must your decorator wrapper include `*args` and `**kwargs`?', ['To save disk space','To ensure the wrapper can successfully receive any number of arguments or the hidden `self` instance when decorating class methods','To increase execution speed','To allow the code to run offline'], 1, '`*args` and `**kwargs` make the wrapper signature flexible, ensuring it can handle any function signature—including class methods that include a hidden `self` parameter.')
    ],
    ['Use three levels of nesting for decorators that accept arguments','Always use @functools.wraps to keep your function names and docs intact','Class-based decorators are perfect for storing state across multiple calls','Use *args and **kwargs to ensure your decorators don\'t break when applied to class methods']
  ),

  L('py-20', 20, 'Generators & Iterators', '🔄',
    '🖥️ **Terminal Notice:** If you want to use a big terminal on your own computer instead of the built-in one, please read Lesson 1 for the full setup instructions.\n\nEverything in Python is an object, but not everything needs to be in memory at once. Iterators and Generators are how you process petabytes of data on a machine with only 8GB of RAM. They are the backbone of high-performance Python.',
    [
      { 
        title: '1. The Iterator Protocol', 
        beginner: 'Behind every `for` loop is an Iterator. It has two rules: `__iter__` (give me the list) and `__next__` (give me the next item). If there are no items left, it raises a `StopIteration` error. Your `for` loop secretly catches this and stops.', 
        advanced: 'Python handles the `StopIteration` automatically within for-loops. Understanding the protocol allows you to build custom, streaming data structures that integrate natively with the language\'s loop syntax.' 
      },
      { 
        title: '2. Generators as State Machines', 
        beginner: 'A generator function is like a script that pauses. When you `yield` a value, the function doesn\'t die—it goes to sleep, saving exactly where it was. When you ask for `next()`, it wakes up right where it left off.', 
        advanced: 'Generators hold the entire local stack frame in memory. Unlike a normal function that clears its variables on return, the generator preserves its local scope, variables, and instruction pointer between calls.' 
      },
      { 
        title: '3. Generator Delegation (yield from)', 
        beginner: 'If you have a generator inside a generator, don\'t write a loop to yield each item. Use `yield from other_generator()`. It is a clean, optimized shorthand that hands the work over to the inner generator.', 
        advanced: '`yield from` establishes a transparent, high-performance pipe between the caller and the sub-generator. It also handles the complex `send()` and `throw()` propagation channels required for advanced coroutine patterns.' 
      },
      { 
        title: '4. itertools: The Pro Toolbox', 
        beginner: 'Never write a nested loop to create combinations or permutations. The `itertools` library is a standard toolset for professional data science. It is built in C and is lightning-fast.', 
        advanced: '`itertools` provides memory-efficient, lazy-evaluated combinatorics. Tools like `chain()`, `cycle()`, and `islice()` allow you to manipulate infinite streams of data without ever materializing an intermediate list in memory.' 
      },
    ],
    { 
      title: 'Building a Lazy Sequence', 
      intro: 'Let\'s create a custom generator that produces an infinite sequence of Fibonacci numbers, demonstrating how we can represent infinite data in a tiny amount of memory.', 
      steps: [
        'Open your terminal REPL.',
        'Define the generator: `def fib():`.',
        'Set state: `a, b = 0, 1`.',
        'Start an infinite loop: `while True:`.',
        'Yield: `yield a`.',
        'Update: `a, b = b, a + b`.',
        'Instantiate: `gen = fib()`.',
        'Get numbers: `next(gen)`, `next(gen)`, `next(gen)`. Watch it calculate on demand!'
      ], 
      goal: 'You successfully implemented a stateful generator, understood the iterator protocol, and built a memory-efficient sequence that can run infinitely.' 
    },
    [
      q('What is the fundamental benefit of a Generator over a standard List?', ['Generators are better for graphics','Generators are lazy, meaning they only calculate one item at a time and don\'t need to hold the entire sequence in RAM','Generators are always written with square brackets','Generators require an internet connection'], 1, 'Generators evaluate lazily, allowing for the processing of massive or infinite datasets using a flat, constant memory footprint.'),
      q('What does `yield from` do?', ['It restarts the computer','It is a shorthand to hand off iteration control to another generator, piping values cleanly to the caller','It deletes the database','It converts numbers to text'], 1, '`yield from` creates an optimized sub-generator bridge, delegating iteration responsibilities and signal handling to an inner generator structure.'),
      q('What happens when an iterator runs out of data?', ['It returns `None`','It raises a `StopIteration` exception','It starts over from the beginning','It crashes the operating system'], 1, 'Raising `StopIteration` is the official signal defined by the iterator protocol to notify the loop that the sequence is exhausted.'),
      q('Why would you choose `itertools` over writing your own custom nested loops?', ['It is slower','It is written in optimized C code and provides battle-tested, memory-efficient patterns for complex combinatorics','It makes your code look harder to read','It requires special permissions'], 1, '`itertools` is a high-performance standard library module that provides robust, optimized building blocks for complex iterator manipulation.')
    ],
    ['The Iterator Protocol consists of __iter__ and __next__','Generators are state machines that pause and resume, keeping their local variables alive','Use yield from to hand off work to inner generators','itertools is your best friend for high-performance sequence operations']
  ),

  L('py-21', 21, 'Context Managers', '🚪',
    '🖥️ **Terminal Notice:** If you want to use a big terminal on your own computer instead of the built-in one, please read Lesson 1 for the full setup instructions.\n\nYou know `with open(...)` already, but did you know you can build your OWN context managers? They are perfect for anything that needs a "start" and an "end" phase—like locking databases, timing code, or resetting settings.',
    [
      { 
        title: '1. The Context Manager Protocol', 
        beginner: 'A context manager is just an object with two special methods: `__enter__` (setup) and `__exit__` (cleanup). When you enter the `with` block, `__enter__` runs. When you exit, `__exit__` runs automatically.', 
        advanced: 'Context managers are the mechanism for deterministic resource cleanup. They guarantee that `__exit__` executes even if the `with` block crashes with an unhandled exception.' 
      },
      { 
        title: '2. Class-Based Contexts', 
        beginner: 'If you want to create a manager that handles a connection, write a class. Put your `socket.connect()` inside `__enter__` and `socket.close()` inside `__exit__`. Now you never have to remember to close the socket again!', 
        advanced: 'The `__exit__` method receives exception details (`exc_type`, `exc_value`, `traceback`) as arguments. If it returns `True`, it suppresses the exception; if it returns `False` (or `None`), it propagates the exception upwards.' 
      },
      { 
        title: '3. contextlib (The Easy Way)', 
        beginner: 'If you don\'t want to build a whole class, use the `@contextmanager` decorator. It lets you write a generator function where the code *before* the `yield` is the setup, and the code *after* the `yield` is the cleanup.', 
        advanced: '`@contextmanager` turns a generator into a context manager. It manages the `__enter__` and `__exit__` boilerplate automatically, allowing you to focus on the setup/teardown logic using simple `try/finally` blocks.' 
      },
      { 
        title: '4. Real-World Usage', 
        beginner: 'Use them for everything! Database transactions (open/commit), timing functions (start/stop), or even temporary directory switching. It keeps your code dry, safe, and readable.', 
        advanced: 'Professional libraries like `FastAPI` and `SQLAlchemy` rely heavily on context managers to handle transient session lifecycles, ensuring connection pools are returned to the server immediately after query completion.' 
      },
    ],
    { 
      title: 'The Automatic Timer', 
      intro: 'Let\'s build a custom context manager that automatically times any code block you place inside it, printing the total duration when the block finishes.', 
      steps: [
        'Open your terminal REPL.',
        'Import: `from contextlib import contextmanager`, `import time`.',
        'Define: `@contextmanager def timer():`.',
        'Setup: `start = time.time()`.',
        'Yield control: `yield`.',
        'Teardown: `print(f"Took {time.time() - start} seconds")`.',
        'Run it: `with timer(): ... (put a slow loop here) ...`'
      ], 
      goal: 'You successfully implemented a custom context manager using the decorator pattern, decoupling timing logic from your business code.' 
    },
    [
      q('What is the main advantage of using a context manager?', ['It makes the internet faster','It automates resource setup and guaranteed cleanup (like closing files or database connections) in one clean block','It replaces the `if` statement','It makes the code run in colors'], 1, 'Context managers use `__enter__` and `__exit__` to guarantee that cleanup tasks occur deterministically, regardless of whether the block succeeds or crashes.'),
      q('What happens in the `__exit__` method of a context manager if an error occurs inside the `with` block?', ['The context manager is ignored','The `__exit__` method still executes, receiving the error details so it can clean up resources safely','The program freezes forever','The computer shuts down'], 1, 'The `__exit__` method receives exception information as arguments, ensuring that resources (like open database locks) are released even during a crash.'),
      q('What does the `@contextmanager` decorator turn a generator function into?', ['A standard loop','A full context manager, where the code before `yield` is the setup and code after is the teardown','An infinite loop','A binary file'], 1, '`@contextmanager` simplifies context manager creation by abstracting the dunder methods into a simple yield-based generator structure.'),
      q('Why would you choose a Class-based context manager over the `@contextmanager` decorator?', ['It is slower','Classes are better for complex managers that need to hold persistent state or shared data across multiple calls','Classes are smaller','Classes are required for math'], 1, 'Class-based managers are more robust for complex state tracking, whereas generator-based managers (`@contextmanager`) are best for simple, transient setup/teardown logic.')
    ],
    ['Context managers use the __enter__ and __exit__ protocol to automate resource handling','@contextmanager is the fastest way to build a context manager without writing a class','Always place cleanup code (like close() or commit()) inside the __exit__ phase','Use context managers for database connections, timing, and file locking']
  ),

  L('py-22', 22, 'Metaclasses & Introspection', '🧠',
    '🖥️ **Terminal Notice:** If you want to use a big terminal on your own computer instead of the built-in one, please read Lesson 1 for the full setup instructions.\n\nMetaclasses are the "code that builds your code." Most developers never need them, but they are how libraries like `Django` or `Pydantic` magically inspect your classes to build databases or web forms automatically.',
    [
      { 
        title: '1. Everything is an Object', 
        beginner: 'In Python, a Class is itself an object! It was created by a "Metaclass." If you run `type(MyClass)`, it doesn\'t say "class"—it says `type`. That\'s because `type` is the default metaclass that builds every standard class you write.', 
        advanced: 'Python uses a "Class Factory" pattern. Classes are instances of a metaclass, and objects are instances of a class. Understanding this triad is the key to deep-level framework architecture.' 
      },
      { 
        title: '2. Introspection (dir/getattr)', 
        beginner: 'You can inspect objects while they are running! `dir(obj)` lists every attribute and method a class has. `getattr(obj, "name")` allows you to grab a property even if you don\'t know the name ahead of time. This is how plugin systems work.', 
        advanced: 'Introspection allows for dynamic dispatching. By dynamically querying object interfaces at runtime, you can build modular systems where the application reacts to new code without needing a restart.' 
      },
      { 
        title: '3. Custom Metaclasses', 
        beginner: 'You can create a custom Metaclass to force rules on other classes. For example, you could write a Metaclass that crashes the program if a class doesn\'t have a specific docstring or a specific method. It\'s an "architectural enforcer."', 
        advanced: 'Inheriting from `type` allows you to override `__new__`. This is the hook where the metaclass intercepts the class definition before it is fully constructed, allowing you to inject attributes, validate signatures, or modify the MRO.' 
      },
      { 
        title: '4. The Use Case', 
        beginner: 'Use introspection to build dynamic tools (like a search tool that scans all attributes). Save Metaclasses for framework development—if you ever find yourself needing to change how *classes themselves are built*, that is the time for a Metaclass.', 
        advanced: 'Metaclasses are the ultimate "hidden" power. They are responsible for the magic in frameworks like Django ORM, where simple class definitions are magically transformed into complex SQL table mappings.' 
      },
    ],
    { 
      title: 'The Inspector Gadget', 
      intro: 'Let\'s build a simple introspection tool that scans any object you give it and prints a beautiful report of all its methods and attributes.', 
      steps: [
        'Open your terminal REPL.',
        'Define a demo class: `class User: name = "Sage"; def dance(self): pass`.',
        'Create the scanner: `def scan(obj):`.',
        'Inside, use `dir(obj)` to get the list of items.',
        'Loop: `for attr in dir(obj):`.',
        'Check type: `val = getattr(obj, attr)`.',
        'Print: `print(f"{attr}: {type(val)}")`.',
        'Run it: `scan(User())`!'
      ], 
      goal: 'You successfully performed live runtime introspection, dynamically accessing object members to build a diagnostic tool.' 
    },
    [
      q('What is a Metaclass in Python?', ['A secret password','A "class of a class" that dictates how a class definition itself is constructed and instantiated','A database driver','A type of loop'], 1, 'Metaclasses are the blueprint for classes, intercepting the class creation process to allow for structural modifications and automated validation.'),
      q('Why would a developer use `getattr(obj, "attr_name")` instead of `obj.attr_name`?', ['To make the code faster','To dynamically access attributes when the attribute name is a variable or unknown until runtime','To prevent the computer from crashing','To save space'], 1, 'Dynamic access allows for "loosely coupled" code where you can interact with objects whose structure isn\'t known at compile-time (essential for plugin/API systems).'),
      q('What does `dir(obj)` return?', ['The object size','A list of all attributes and methods available on the object','The current directory path','A list of numbers'], 1, '`dir()` is the primary introspection tool for listing the contents of an object\'s namespace.'),
      q('If you run `type(str)`, what does it return?', ['A string','`type` (indicating that classes themselves are objects created by the `type` metaclass)','A boolean','A dictionary'], 1, 'Python is completely object-oriented; classes are objects, and their type is the `type` metaclass.')
    ],
    ['Classes themselves are objects created by Metaclasses','Introspection (dir/getattr) lets you scan and query code while it is running','Use Metaclasses (inheritance from type) only for framework-level architectural enforcement','Dynamic attribute access enables powerful, decoupled plugin-based architectures']
  ),

  L('py-23', 23, 'Concurrent Futures', '⚡',
    '🖥️ **Terminal Notice:** If you want to use a big terminal on your own computer instead of the built-in one, please read Lesson 1 for the full setup instructions.\n\n`asyncio` is great for networking, but sometimes you have "CPU-heavy" work—like processing images or crunching massive math equations. For that, you need the `concurrent.futures` module to spin up actual parallel CPU cores.',
    [
      { 
        title: '1. ThreadPoolExecutor', 
        beginner: 'This launches multiple tasks at once. Each task runs in its own "thread." It is perfect for I/O tasks like downloading 50 files simultaneously. Note: Python\'s Global Interpreter Lock (GIL) limits threads to one CPU core.', 
        advanced: 'Threads share the same memory space. Use them for I/O-bound concurrent operations where the program spends most of its time waiting for the network or disk.' 
      },
      { 
        title: '2. ProcessPoolExecutor', 
        beginner: 'This launches a separate "Python process." Each process gets its own CPU core. If you need to do heavy image processing, this is your tool—it effectively bypasses the GIL and gives you real parallel speed.', 
        advanced: 'Processes have isolated memory spaces. They communicate via serialization (pickling) data. Use this for CPU-bound tasks like encryption, compression, or data science modeling.' 
      },
      { 
        title: '3. The Future Object', 
        beginner: 'When you submit a task to the pool, you don\'t get the result immediately. You get a "Future"—a placeholder object. It means: "I am working on it, I promise to have the result eventually." You can ask it `future.result()` later.', 
        advanced: 'Futures encapsulate the eventual state of an asynchronous operation. They support callbacks, cancelation, and state monitoring (pending, running, or finished).' 
      },
      { 
        title: '4. Choosing the Right Tool', 
        beginner: 'If you are waiting on the internet (API/File), use `ThreadPoolExecutor`. If you are burning the CPU (Math/Images), use `ProcessPoolExecutor`. Choosing the wrong one can actually make your code slower!', 
        advanced: 'Overhead is a critical metric. Spawning a new process is significantly more "expensive" in terms of OS time than spawning a thread. Use processes only for long-lived, computation-heavy tasks.' 
      },
    ],
    { 
      title: 'The Parallel Processor', 
      intro: 'Let\'s use the `ProcessPoolExecutor` to run a heavy math calculation across multiple CPU cores simultaneously, proving we can outrun standard sequential code.',
      steps: [
        'Open your terminal REPL.',
        'Import: `from concurrent.futures import ProcessPoolExecutor`.',
        'Define a heavy task: `def power(x): return x**x`.',
        'Setup: `with ProcessPoolExecutor() as executor:`.',
        'Run: `results = list(executor.map(power, [10, 11, 12, 13]))`.',
        'Print `results` to see your parallel output!'
      ], 
      goal: 'You successfully launched parallel CPU processes, used a pool to map inputs across cores, and aggregated the results using future objects.' 
    },
    [
      q('What is the primary difference between a Thread and a Process in Python?', ['Threads are faster, Processes are slower','Threads share memory and are limited by the GIL; Processes have isolated memory and use separate CPU cores','Processes are for text, Threads are for numbers','There is no difference'], 1, 'Threads share a single process and memory space, constrained by the GIL, while Processes represent separate system tasks with their own memory and CPU core allocation.'),
      q('When should you use a `ProcessPoolExecutor`?', ['For fast network calls','For CPU-heavy tasks like image processing, encryption, or heavy math calculations','For writing text files','For testing the internet'], 1, 'Processes break the GIL limitation, allowing for true parallel computation across multiple physical CPU cores for heavy mathematical logic.'),
      q('What does a "Future" object represent?', ['An object that predicts the future','A placeholder for a result that will be calculated in the background eventually','A file that has been deleted','A type of constant'], 1, 'Futures serve as the bridge between background task submission and result retrieval, signaling the pending completion status of an execution thread.'),
      q('What happens if you use threads to do heavy CPU math?', ['The GIL makes it perform essentially no better than a single-threaded program because only one thread can execute Python bytecode at a time','It runs 100x faster','It deletes your hard drive','It turns off your CPU fan'], 0, 'Due to the Global Interpreter Lock (GIL), multiple Python threads cannot execute bytecode simultaneously, making them ineffective for pure CPU-bound mathematical operations.')
    ],
    ['Use ThreadPoolExecutor for I/O-bound tasks (network/files)','Use ProcessPoolExecutor for CPU-bound tasks (math/images)','A Future object is a "promise" of a result that you can collect later','Understand the GIL: Threads are for waiting, Processes are for calculating']
  ),

  L('py-24', 24, 'Packaging & Distribution', '📦',
    '🖥️ **Terminal Notice:** If you want to use a big terminal on your own computer instead of the built-in one, please read Lesson 1 for the full setup instructions.\n\nGreat, you built a library! But how do you let the rest of the world use it? Packaging turns your scattered `.py` files into a standardized, installable asset that anyone can download with `pip install my-cool-project`.',
    [
      { 
        title: '1. Project Structure', 
        beginner: 'Your project folder needs a specific layout. Put your code inside a sub-folder named after your project (the "package"), include a `README.md`, and a `pyproject.toml` file.', 
        advanced: 'The `pyproject.toml` (PEP 518/621) is the modern standard for configuring builds. It defines build dependencies and metadata, replacing the archaic and discouraged `setup.py` scripts.' 
      },
      { 
        title: '2. The pyproject.toml', 
        beginner: 'This is the "manifesto" of your package. It tells the world: "My name is X, I require these libraries, and my code starts here." It is what `pip` reads to know exactly what to do.', 
        advanced: 'It leverages build backends like `hatch`, `flit`, or `setuptools`. It provides a clean, declarative configuration interface, ensuring that builds remain reproducible across different platforms and environments.' 
      },
      { 
        title: '3. Building a Wheel', 
        beginner: 'You don\'t upload your raw `.py` files to the internet. You "build" a Wheel (a `.whl` file). It is a zipped, pre-compiled package that `pip` knows how to unpack instantly. It is the gold standard for easy distribution.', 
        advanced: 'Wheels are binary distributions (PEP 427). They eliminate the need for end-users to compile C-extensions from source, drastically reducing installation time and environment dependency errors.' 
      },
      { 
        title: '4. PyPI (The Global Store)', 
        beginner: 'PyPI (Python Package Index) is the "App Store" for Python. You upload your Wheel file to PyPI using a tool called `twine`, and suddenly anyone in the world can run `pip install your-package-name`.', 
        advanced: 'PyPI enforces strict namespace security. Once you publish a project, it is permanent. Always use a TestPyPI account to verify your build configuration before deploying to the global public repository.' 
      },
    ],
    { 
      title: 'The Manifest Builder', 
      intro: 'Let\'s create a simple project manifest (`pyproject.toml`) and understand how we package our code for the public.', 
      steps: [
        'Open your terminal.',
        'Navigate to your project folder.',
        'Create `pyproject.toml`.',
        'Add: `[project] name = "my-robot", version = "0.1.0", dependencies = ["requests"]`.',
        'Look at the modern build system requirements by searching the docs for `pyproject.toml` standards.',
        'Install the build tool: `pip install build`.',
        'Build the project: `python -m build`.',
        'Look inside your new `dist/` folder—there is your `.whl`!'
      ], 
      goal: 'You successfully transitioned your local code into a standardized package structure, configured build metadata, and generated a distributable binary wheel.' 
    },
    [
      q('What is the modern standard file used for configuring Python package builds and dependencies?', ['`setup.py`','`pyproject.toml`','`config.txt`','`manifest.xml`'], 1, 'PEP 518/621 standardized `pyproject.toml` as the declarative, modern configuration file for building Python projects.'),
      q('Why is a "Wheel" (.whl) better than just sending your raw source code files to others?', ['It is smaller','It is a pre-compiled, standardized format that makes installation instant and eliminates compilation errors on the user\'s machine','It looks cooler','It is easier to hack'], 1, 'Wheels are binary distributions that bypass local compilation requirements, making installation reliable, fast, and platform-independent.'),
      q('What is PyPI?', ['A file hosting service','The Python Package Index, the global "App Store" where developers upload packages for universal download via pip','A type of encryption','A secret Python club'], 1, 'PyPI is the centralized repository for Python packages, powering the global ecosystem you access every time you run `pip install`.'),
      q('What tool is used to upload your finished build to the PyPI repository?', ['`build`','`twine`','`upload`','`pip`'], 1, '`twine` is the standard, secure utility used for authenticating and uploading built distribution packages to PyPI.')
    ],
    ['Use pyproject.toml as your single configuration manifest','Package your code into binary Wheel files for easy distribution','Use twine to securely upload your builds to the public PyPI registry','Always test your builds on TestPyPI before going public']
  ),

 L(
    'py-25', 25, 'Python Memory Model & Performance', '🧠', 
    '🖥️ **Terminal Notice:** If you want to use a big terminal on your own computer instead of the built-in one, please read Lesson 1 for the full setup instructions.\n\nPython handles memory automatically using a built-in garbage collector, which tricks developers into thinking memory optimization is irrelevant. In reality, large applications frequently experience heavy performance degradation due to massive memory bloating, hidden object references, and CPU cache misses. By mastering Python’s internal allocation model, object referencing, and profiling systems, you can pinpoint exactly which lines of code are draining system resources and optimize them for high-throughput production environments.',
    [
      { title: '1. Reference Counting & GC', beginner: 'Think of every piece of data you create in Python as a floating party balloon, and variables as strings tied to it. Every time you point a new variable at that data, you tie another string. Python keeps a tally of these strings. The exact millisecond the tally hits zero (all strings are cut), the balloon instantly vanishes from existence, freeing up room in your house.', advanced: 'Python\'s primary memory management system is deterministic Reference Counting. However, reference counting fails when objects refer to each other in an isolated circle (Cyclic References). To resolve this, Python runs a cyclical Garbage Collector that periodically sweeps through three distinct memory "generations", detecting un-killable loops and purging stranded object clusters from memory allocations.' },
      { title: '2. Object Memory & Slots', beginner: 'By default, Python treats custom objects like a massive, open-ended cardboard box where you can throw any new variable name at runtime. This box is powered by a hidden dictionary that consumes massive amounts of RAM. By using a feature called `__slots__`, you replace that bulky cardboard box with a sleek, perfectly sized plastic tray with exact fixed slots, cutting down your RAM usage by up to 70%.', advanced: 'Every standard class instance stores its attributes inside a dynamic dictionary instance variable named `__dict__`. Dicts are highly optimized but memory-intensive due to underlying hash table structures. Defining `__slots__ = ("attribute1", "attribute2")` explicitly bypasses `__dict__` entirely, allocating a highly compressed, fixed-size array structure in memory that is critical when generating millions of micro-objects.' },
      { title: '3. Profiling with Timeit & CProfile', beginner: 'If your web server is running slowly, guessing which function is broken is a waste of time. Python provides a quick stopwatch tool called `timeit` for checking small code clips, and a full medical diagnostic system called `cProfile` that records every single internal function call, tracking exactly how many milliseconds each operation took.', advanced: '`cProfile` is a deterministic execution profiler. It hooks into the Python interpreter loop to record call counts and cumulative execution times. Analyzing cProfile text reports or parsing them into visual flame graphs allows engineers to locate internal bottlenecks, such as deep recursive loop overloads or sluggish database queries, with scientific precision.' },
      { title: '4. Production Optimization Strategies', beginner: 'Optimizing code doesn\'t mean writing cryptic hacks; it means picking the right tools built into Python. Using fast loops called list comprehensions, avoiding unnecessary global lookups, and reusing objects instead of recreating them constantly is how you build lightning-fast code.', advanced: 'High-performance Python architectures rely heavily on memory locality and caching. Developers optimize loops by binding global functions to local variables, replacing expensive string concatenations with list joins, utilizing generator streams to keep memory profiles flat, or offloading highly intense algorithmic computation to native C-extensions via Cython.' }
    ],
    {
      title: 'High-Performance Data Optimizer',
      intro: 'We will write a memory-intensive geolocation processing engine that purposefully strains system RAM, track its footprint, and then completely optimize it using low-level internal memory architectures.',
      steps: [
        'Open your terminal and create a new script file.',
        'Import the standard `sys`, `timeit`, and `cProfile` modules into the script.',
        'Define a standard class named `LegacyDataPoint` that records latitude, longitude, and elevation variables.',
        'Write a function that instantiates one million instances of `LegacyDataPoint` and appends them to a master list.',
        'Use `sys.getsizeof` and trace modules to measure the massive RAM footprint of this collection.',
        'Refactor the class into an optimized version named `OptimizedDataPoint` by adding a strict `__slots__` configuration.',
        'Execute the million-object loop again, measuring the dramatic memory reduction and execution speedup via `cProfile` analytics.'
      ],
      goal: 'You successfully diagnosed a major system memory leak and optimized an enterprise application footprint by mastering Python object allocation internals.'
    },
    [
      q('What is a cyclic reference error in Python memory management, and how is it resolved?', ['An infinite loop that crashes the CPU; resolved by changing variable names', 'When two or more objects hold reference pointers to each other, preventing reference counts from hitting zero; resolved by the cyclical Garbage Collector', 'When an object is saved to a hard drive incorrectly; resolved by deleting the files', 'A syntax error caused by importing files recursively'], 1, 'Reference counting alone cannot free objects trapped in isolated loops of mutual references; Python relies on its generational garbage collector to sweep and free these cyclic blocks.'),
      q('What is the direct low-level mechanical consequence of defining `__slots__` inside a custom Python class?', ['It automatically encrypts class attributes for secure storage', 'It completely bypasses the creation of the memory-heavy instance dictionary (`__dict__`), utilizing a highly compressed fixed array instead', 'It forces the class to execute inside a separate thread automatically', 'It allows the class to inherit from multiple abstract base classes at once'], 1, 'By eliminating the dynamic attribute dictionary container, `__slots__` significantly compresses the per-object memory footprint, optimizing RAM for millions of data models.'),
      q('Which built-in module should an engineer use to run a highly accurate, isolated micro-benchmark on a specific tiny code snippet?', ['unittest', 'timeit', 'sys', 'logging'], 1, 'The `timeit` module runs snippet executions millions of times inside an isolated environment to provide highly accurate, unpolluted timing benchmarks.'),
      q('What performance danger is introduced when writing deep loops that reference variables located in the global scope?', ['Global variables are automatically deleted during loop cycles', 'Global variables trigger automatic database updates on every lookup', 'Python must perform an expensive, multi-layered namespace dictionary lookup on every single iteration of the loop', 'Global scope lookups consume twice as much network bandwidth'], 2, 'Looking up global names inside loops forces Python to continuously query scope lookups. Binding global variables to local references before entering tight loops optimizes bytecode execution paths.')
    ],
    ['Leverage __slots__ whenever your application needs to instantiate millions of small data-holding models to slash RAM usage.', 'Never guess performance paths; always generate precise cProfile trace reports to locate actual compute bottlenecks.', 'Be mindful of object reference lifecycles to avoid accidentally keeping massive data sets alive in the global execution scope.', 'Utilize built-in data processing functions and list comprehensions, as they execute close to the bare metal in highly optimized C loops.']
  ),

  L(
    'py-26', 26, 'Advanced Object-Oriented Python', '🏛️', 
    '🖥️ **Terminal Notice:** If you want to use a big terminal on your own computer instead of the built-in one, please read Lesson 1 for the full setup instructions.\n\nObject-Oriented Programming in Python goes infinitely deeper than just writing classes and inheritance. To build frameworks that are truly elegant, you must master meta-programming tools that intercept and manipulate class creation itself. By controlling the Method Resolution Order, creating abstract guardrails, and managing class metadata with descriptors and metaclasses, you can transition from someone who merely consumes tools to an architect who builds major library frameworks.',
    [
      { title: '1. Dataclasses & Properties', beginner: 'Writing a class that just holds data usually requires writing lines of boring boilerplate code. A `@dataclass` automatically generates all that boilerplate for you out of the box. Meanwhile, `@property` acts like an invisible security guard standing watch over a class variable, intercepting any attempt to read or change its data so you can run safety checks first.', advanced: 'Dataclasses use class decorators to dynamically inspect type annotations and generate standard dunder methods like `__init__` and `__repr__` at compile-time. Utilizing `frozen=True` enforces perfect object immutability, which automatically makes the instances hashable and incredibly safe to pass around across concurrent thread operations.' },
      { title: '2. Abstract Base Classes (ABCs)', beginner: 'Think of an Abstract Base Class as a strict structural building code issued by a city. You can\'t physically move into a building code—it\'s just words on paper. However, if any developer wants to construct a real house in the city, the building code forces them to include a front door, plumbing, and a roof, or the inspector halts construction.', advanced: 'Python\'s `abc` module enforces formal interface specifications at the instantiation phase. A class that inherits from an ABC and uses the `@abstractmethod` decorator cannot be instantiated unless *all* abstract methods are fully implemented by the child class. This is a foundational requirement for building robust object patterns in enterprise applications.' },
      { title: '3. Multiple Inheritance & MRO', beginner: 'Python allows a single class to inherit traits from multiple different parent classes at the same time. If two parents have a method with the exact same name, Python follows a highly structured family tree rulebook called the Method Resolution Order (MRO) to determine precisely which parent\'s advice it should listen to first.', advanced: 'Python resolves inheritance paths utilizing the C3 Linearization Algorithm. This deterministic ordering can be inspected at any time via the `.mro()` method on a class. Understanding MRO is absolutely vital to properly leveraging the behavior of `super()`, preventing the classic "Diamond Inheritance Hazard" where methods are accidentally run multiple times or completely bypassed.' },
      { title: '4. Descriptors & Metaclasses', beginner: 'A "Descriptor" is a reusable validation guard tool that you can share across completely different classes to keep bad data out. A "Metaclass" is the ultimate power tool: it is a class that builds other classes, allowing you to intercept and modify how code structures are assembled before the program even starts.', advanced: 'Descriptors are objects that implement the `__get__`, `__set__`, or `__delete__` protocol methods, taking total control over attribute access lookup chains. Metaclasses inherit directly from `type`. By overriding a metaclass\'s `__new__` method, developers can inspect, register, or rewrite class definitions globally, which is exactly how modern frameworks like Django, Pydantic, and SQLAlchemy implement their data models.' }
    ],
    {
      title: 'Mini Validation ORM Framework',
      intro: 'We are going to engineer a micro Object-Relational Mapping (ORM) framework architecture that uses abstract base classes and custom descriptors to dynamically enforce data validation on custom classes.',
      steps: [
        'Open your terminal REPL.',
        'Import `ABC` and `abstractmethod` from the standard `abc` module.',
        'Write a custom Descriptor class named `IntegerField` that intercepts `__set__` inputs and throws a strict `TypeError` if a user attempts to store a string value.',
        'Create an Abstract Base Class named `Model` that requires all child frameworks to implement a custom `.save()` method configuration.',
        'Create a real class named `UserAccount(Model)` that utilizes your `IntegerField` descriptor to secure an `account_id` attribute boundary.',
        'Instantiate your user model, test its strict type validation behaviors, and execute the inherited database engine structures.'
      ],
      goal: 'You successfully built an industrial-grade architectural framework utilizing advanced OOP, descriptors, and class structural contracts.'
    },
    [
      q('What advanced architectural challenge does Python\'s C3 Linearization Algorithm solve?', ['It automatically encrypts multiple class files for security compliance', 'It cleanly defines the deterministic Method Resolution Order (MRO) for resolving attributes during complex multiple inheritance configurations', 'It compiles Python objects down to native machine code structures', 'It prevents classes from taking up excess space inside the memory model'], 1, 'C3 Linearization guarantees a reliable, predictable lookup sequence across complex multiple inheritance class networks, ensuring `super()` execution flows smoothly without unexpected skips.'),
      q('What happens if a developer attempts to instantiate a child class that inherits from an Abstract Base Class but forgets to write code for one of its `@abstractmethod` decorators?', ['Python creates a blank placeholder method automatically and runs without crashing', 'The class instantiates perfectly but logs a critical warning to terminal outputs', 'Python immediately throws a fatal `TypeError` at instantiation time, blocking object creation', 'The entire script crashes with a low-level memory allocation error'], 2, 'Abstract Base Classes enforce architectural design patterns; you cannot instantiate a subclass unless it satisfies every contractual obligation defined by abstract methods.'),
      q('What low-level dunder protocols must an object implement to officially be recognized as a reusable Python Descriptor?', ['`__enter__` and `__exit__` exclusively', '`__iter__` and `__next__` exclusively', 'At least one of the `__get__`, `__set__`, or `__delete__` method operations', '`__init__` and `__repr__` exclusively'], 2, 'Descriptors manage class attribute lookups by binding directly to the low-level object attribute access pathways via the get/set/delete protocols.'),
      q('What is the fundamental relationship between a standard Class and a Metaclass in Python architecture?', ['A metaclass is a class that inherits from a dataclass container', 'A standard class defines how its individual object instances behave, while a metaclass defines how class structures themselves are created and configured', 'Metaclasses are older legacy structures that have been replaced by standard class configurations', 'A metaclass is a special function used to delete class configurations from memory'], 1, 'Metaclasses are the factories that construct class definitions. They inherit from `type`, providing deep hook pathways to modify class architectures at runtime initialization phases.')
    ],
    ['Use @dataclass with frozen=True to create lightweight, immutable, and thread-safe data models effortlessly.', 'Enforce rigorous engineering standards across multi-developer codebases by integrating Abstract Base Classes.', 'Always query class.mro() to visually map out and understand complex multiple inheritance lookup structures.', 'Leverage custom descriptors to isolate validation algorithms away from core business data definitions.']
  ),

  L(
    'py-27', 27, 'Databases with Python', '🗄️', 
    '🖥️ **Terminal Notice:** If you want to use a big terminal on your own computer instead of the built-in one, please read Lesson 1 for the full setup instructions.\n\nAn application is only as powerful as its ability to safely store, query, and manipulate data. Writing data to loose text files eventually corrupts under concurrent load. Production applications rely on relational and non-relational database management systems. Moving beyond raw SQL strings, professional Python engineers utilize Object-Relational Mappings (ORMs) and connection pools to write highly maintainable, optimized, and scalable data-access layers.',
    [
      { title: '1. SQL Fundamentals & SQLite', beginner: 'Think of a relational database as a giant digital filing cabinet packed with highly organized spreadsheets called tables. Each table has rigid columns (like First Name or Age) and infinite rows of actual data. Python comes with a built-in database named SQLite that saves everything into a single file on your computer, allowing you to search and filter records using a language called SQL.', advanced: 'SQLite is an in-process, serverless library ideal for local storage, caching, and testing. Python\'s `sqlite3` driver requires explicitly opening connections and managing execution `cursors`. To defend against fatal SQL injection attacks, developers must never use python string formatting to build queries; instead, they pass arguments as parameterized tuples to let the underlying database engine safely escape inputs.' },
      { title: '2. SQLAlchemy & ORM Patterns', beginner: 'Writing raw SQL code inside your Python scripts can quickly become messy and hard to read. An Object-Relational Mapper (ORM) like SQLAlchemy acts as an automatic translator. It allows you to represent a database table as a standard Python Class, and rows of data as regular Python object instances, letting you look up or update data using clean Python code.', advanced: 'SQLAlchemy utilizes the powerful Data Mapper pattern, splitting database schema layout from business domain models. Managing database interactions relies heavily on the `Session` object, which implements the Unit of Work design pattern. Engineers must be highly careful with the "N+1 Query Problem"—where a loop lazily loads database relationships one row at a time. This is mitigated by explicitly configuring `joinedload` or `subqueryload` for eager fetching.' },
      { title: '3. PostgreSQL & Enterprise Concepts', beginner: 'While SQLite is excellent for small projects, it locks up when hundreds of people try to write data at the exact same millisecond. Enterprise apps scale up to PostgreSQL—a separate, massive database server architecture that lives on a dedicated cloud machine designed to run heavy multi-user workloads simultaneously without ever losing data.', advanced: 'PostgreSQL scales via strict enforcement of ACID compliance (Atomicity, Consistency, Isolation, Durability). Optimizing production databases requires Python developers to understand indexes, constraint checks, and database performance metrics. You can write custom raw execution steps or migration files using tools like Alembic to safely update live production schemas without causing server downtime.' },
      { title: '4. Connection Pooling Mechanics', beginner: 'Every single time your code asks the database a question, establishing a new network path across the internet takes significant time and energy. Connection Pooling is like keeping a collection of open, pre-verified communication lines standing by in a lounge room. When a request comes in, it immediately grabs an open line, uses it, and drops it back in the pool for the next person.', advanced: 'Instantiating a database connection requires a heavy TCP handshake and authentication overhead. SQLAlchemy manages this transparently using an internal connection pool. Engineers must configure pool parameters carefully for production workloads, optimizing settings like `pool_size` (the total number of permanent connections to keep open) and `max_overflow` (temporary extra lanes allowed under sudden traffic spikes) to prevent socket exhaustion.' }
    ],
    {
      title: 'Production Inventory Management System',
      intro: 'We are going to construct an enterprise-grade inventory management layer using SQLAlchemy to map Python data models directly into a relational database engine with automated schema generation.',
      steps: [
        'Open your terminal.',
        'Install SQLAlchemy via your terminal using `pip install sqlalchemy`.',
        'Import `declarative_base`, `Column`, `Integer`, `String`, and `create_engine` from the framework in your script.',
        'Define a base declarative class and construct an `InventoryItem` data model requiring a primary key, string name, and integer quantity count.',
        'Initialize an engine connection instance using an in-memory SQLite URL path string.',
        'Use the model metadata bindings to programmatically build the physical database tables.',
        'Open a transactional session wrapper, programmatically stage three new stock items, execute a clean commit, and query the records back utilizing advanced query filtering filters.'
      ],
      goal: 'You successfully engineered a relational data access layer using professional ORM architecture, mapping object-oriented models to structured database tables.'
    },
    [
      q('What is the fundamental danger of utilizing standard Python string formatting (like f-strings) to inject user input directly into a SQL statement?', ['The database query will execute significantly slower', 'It introduces highly critical SQL Injection vulnerabilities, allowing malicious actors to wipe out or steal database records', 'Python will immediately throw a syntax compilation error', 'The database will automatically convert all integers into text variables'], 1, 'String formatting patches raw user text directly into database command lines; parameterized inputs isolate the data parameters completely, rendering injection attacks harmless.'),
      q('Which software architecture pattern describes the behavior of a database Session acting as a checkpoint that tracks changes before committing them all at once?', ['The Singleton Pattern', 'The Unit of Work Pattern', 'The Factory Pattern', 'The Model-View-Controller Pattern'], 1, 'The Unit of Work pattern maintains a list of database transactions affected by a business workflow and coordinates the writing out of changes in a single unified block.'),
      q('How does the "N+1 Query Problem" typically manifest inside an unoptimized Python ORM data pipeline?', ['The application runs out of memory because the database returns too much data at once', 'The application fires one initial query to fetch a list of items, and then executes an additional separate database query for every single row in that list to fetch related data, destroying performance', 'The script crashes because multiple users attempt to edit the same column simultaneously', 'The ORM fails to parse the incoming date strings correctly'], 1, 'Lazy loading causes the ORM to poll the database repetitively inside loops; loading relationships eagerly via joins aggregates data into a single efficient query execution.'),
      q('What is the primary operational objective of establishing a Connection Pool configuration for a database client?', ['To encrypt database passwords using advanced security protocols', 'To reduce performance lag by keeping a collection of active, reusable database connections open, avoiding the time overhead of creating new paths repeatedly', 'To automatically backup database records to cloud storage', 'To completely replace the need for writing Python models'], 1, 'Connection pools eliminate the heavy setup and teardown network costs associated with spinning up a separate database connection channel for every individual user action.')
    ],
    ['Never use string interpolation to create database queries; always pass parameters via secure driver tuples.', 'Leverage ORM engines like SQLAlchemy to abstract database vendor dialects away from your core code components.', 'Be highly vigilant against the N+1 query trap by configuring eager relationship joins inside heavy application loops.', 'Tune connection pool properties appropriately to handle multi-threaded concurrency spikes in high-volume microservices.']
  ),

  L(
    'py-28', 28, 'API Development with Python', '🌐', 
    '🖥️ **Terminal Notice:** If you want to use a big terminal on your own computer instead of the built-in one, please read Lesson 1 for the full setup instructions.\n\nModern applications do not live in isolation; they communicate across global server networks using Application Programming Interfaces (APIs). Building web services requires an engineering understanding of network protocols, semantic routing structures, and payload parsing pipelines. By shifting away from legacy web frameworks and adopting modern, asynchronous REST architectures like FastAPI, Python engineers can build self-documenting web services capable of processing high concurrent traffic volumes.',
    [
      { title: '1. HTTP & REST Architecture', beginner: 'Imagine an API as a highly efficient waiter working inside a busy restaurant. You (the client web browser) don\'t walk into the kitchen to cook food; instead, you look at a menu and ask the waiter using standard phrases. In the web world, these phrases are HTTP actions: `GET` to fetch data, `POST` to create something new, and standard status numbers like `200 OK` or `404 Not Found` to tell you if the order succeeded.', advanced: 'Representational State Transfer (REST) is a stateless architectural style for designing networked applications. It treats web data as unique resources mapped to structured Uniform Resource Identifiers (URIs). Systems communicate using standard HTTP metadata headers, content negotiation frameworks (typically parsing application/json data structures), and clear status definitions to manage interface contracts cleanly.' },
      { title: '2. FastAPI & Asynchronous ASGI', beginner: 'Traditional web systems process incoming requests like a single file line at a bank teller—if the person at the front takes ten seconds to check a database, everyone else stands waiting. FastAPI uses a modern "Asynchronous" engine. It lets the bank teller take a request, hand it off to the database, and immediately serve the next customer in line while waiting for the first data to come back.', advanced: 'FastAPI is built natively on the Asynchronous Server Gateway Interface (ASGI) specification, typically hosted via production runners like Uvicorn. By defining routes using async keywords (`async def`), operations execute concurrently via the Python Event Loop, making FastAPI incredibly performant for I/O-bound web operations and streaming webhooks.' },
      { title: '3. Pydantic Data Validation', beginner: 'When random users send data to your web API, you cannot trust them blindly. If a route expects an age number but someone sends the text word "banana", your database will break. FastAPI fixes this using a tool called Pydantic. It acts as an automatic filter checklist that screens incoming data before it ever hits your main code, blocking bad inputs instantly.', advanced: 'Pydantic enforces runtime type safety using Python type hints. When a request arrives, Pydantic parses incoming JSON, validates fields against a strict `BaseModel` schema, coerces data types where safe, and produces structured errors automatically. This input parsing layer shields internal business boundaries from malformed external data injections.' },
      { title: '4. Stateless Token Security', beginner: 'An API shouldn\'t require a user to log in with a password every time they click a button. Instead, when they log in once, the server hands them a secure, digital wristband called a JWT token. The browser includes this token in the header of every future message. The server can verify the wristband is authentic without needing to run slow database lookups every single time.', advanced: 'JSON Web Tokens (JWT) allow for completely stateless authorization architectures. A JWT contains a cryptographically signed payload (including expiration timestamps and user scope arrays) verified at the API routing gate using a secret hashing key. FastAPI utilizes Dependency Injection systems via `Depends` to natively resolve token extraction, user validation, and route privilege guards.' }
    ],
    {
      title: 'Enterprise REST API Service',
      intro: 'We are going to build a high-performance web API containing structured data validation modeling, asynchronous operations, and automated documentation compilation using FastAPI.',
      steps: [
        'Open your terminal.',
        'Install the necessary core libraries using `pip install fastapi uvicorn pydantic`.',
        'Create an application instance file and import the required Pydantic `BaseModel` utilities.',
        'Define a strict data validation model class named `ProductSchema` containing explicit string annotations and numeric range limits.',
        'Create an asynchronous `POST` endpoint route that receives data matching your product validation schema layout.',
        'Create an asynchronous `GET` endpoint route that returns an array collection of mock dataset rows.',
        'Launch your web service locally from the terminal using `uvicorn main:app --reload`.',
        'Open your web browser, navigate to the `/docs` path, and test your API live using the interactive Swagger UI interface.'
      ],
      goal: 'You successfully engineered a production-grade asynchronous REST API complete with runtime validation filters and self-generating system documentation.'
    },
    [
      q('What does the "stateless" nature of a RESTful web API mean for software architecture?', ['The server must save the complete user session state permanently into local RAM', 'Every single incoming request must contain all the context, credentials, and metadata required to process it, independent of prior requests', 'The API is not allowed to communicate with external SQL databases', 'The API can only be deployed on cloud machines running a specific operating system'], 1, 'REST architecture dictates stateless communication; servers do not track user conversational state in memory, enabling horizontal scaling across multiple load-balanced machines.'),
      q('How does FastAPI leverage Pydantic schemas during an active web request cycle?', ['It encrypts the incoming network traffic using advanced TLS pathways', 'It automatically parses, enforces, and validates the incoming JSON payload against specified type layouts before executing the core route logic', 'It converts Python script files into binary assembly files to increase performance', 'It deletes old temporary files from the hosting application server'], 1, 'Pydantic operates as a data protection layer, automatically rejecting malformed payloads with a standardized 422 Unprocessable Entity code.'),
      q('Which HTTP request method is architecturally designated as "Idempotent" when designing standardized REST APIs?', ['POST', 'GET', 'PATCH', 'CONNECT'], 1, 'An HTTP method is idempotent if executing it multiple times leaves the system state identical. `GET` operations merely retrieve data without altering resource states.'),
      q('What mechanism does FastAPI use to build reusable, testable logic blocks (like extractors or authenticators) that execute prior to route entry?', ['Global environment system variables', 'Dependency Injection pipelines via the `Depends` architecture utility', 'Deep object-oriented class inheritance trees exclusively', 'Background daemon thread loops running in parallel'], 1, 'FastAPI\'s dependency injection framework allows developers to cleanly inject shared utility modules, authentication logic, and database sessions directly into path operation parameters.')
    ],
    ['Design web APIs around unique resources using clear semantic HTTP verbs and descriptive URI path structures.', 'Utilize async routing operations natively to build microservices capable of scaling under high concurrent workloads.', 'Enforce strict data contract schemas with Pydantic to ensure malformed JSON input never reaches database targets.', 'Leverage FastAPI\'s built-in dependency injection model to write highly reusable, decoupled authentication and helper routines.']
  ),

  L(
    'py-29', 29, 'Python Security & Secure Coding', '🛡️', 
    '🖥️ **Terminal Notice:** If you want to use a big terminal on your own computer instead of the built-in one, please read Lesson 1 for the full setup instructions.\n\nFunctional code means nothing if it leaves user data exposed to theft or system exploitation. In high-performance software engineering, security is not a separate step added at the end of a project; it is an internal structural requirement. From guarding memory buffers to neutralizing malicious inputs, understanding vulnerabilities like injection vectors, supply-chain exploits, and cryptographically broken algorithms is what separates a senior engineer from a junior developer.',
    [
      { title: '1. Neutralizing Injection Vectors', beginner: 'Imagine running an online library where users type book names into a search bar. If a user types "Give me Harry Potter AND THEN burn down the library building", a naive system might follow the full text command literally. Injection vulnerabilities happen when an application accidentally executes user inputs as code commands instead of treating it like harmless text.', advanced: 'Injection attacks occur when untrusted data is sent directly to an interpreter as part of a command sequence. Beyond database-level SQL Injections, Python applications are highly vulnerable to OS Command Injection through misuse of functions like `os.system()` or setting `shell=True` inside the `subprocess` module. Developers must pass arguments as isolated arrays to completely segregate executable code from raw user input parameters.' },
      { title: '2. Cryptographic Password Hashing', beginner: 'Never save user passwords as clear, readable text in a database. If an attacker gains access to the database file, every account is immediately compromised. Instead, you run the password through a digital meat-grinder algorithm called a Hash. The machine saves only the resulting pattern string. When a user tries to log in, you grind their input again and see if the patterns match.', advanced: 'Standard hashing algorithms like MD5 or SHA-256 are designed for speed and are completely vulnerable to brute-force attacks via rainbow tables and modern GPU chips. Production systems must utilize slow, adaptive cryptographic hashing algorithms like `bcrypt` or `Argon2id`. These frameworks combine unique per-password "Salts" alongside a configurable computational work factor to make password database cracking mathematically unfeasible.' },
      { title: '3. Secrets & Environment Isolation', beginner: 'When writing code that connects to sensitive external systems, you need access codes and master keys. Writing these secret keys directly inside your Python file is incredibly dangerous because if you share your code on GitHub, your security credentials are fully exposed to the public internet. Instead, you keep keys in an external locked drawer called environment variables.', advanced: 'Hardcoding sensitive production credentials within code files breaks basic configuration isolation guidelines. Secure architectures load secrets dynamically into the runtime environment block using variables or isolated configuration files protected by `.gitignore` rules. Enterprise deployments integrate programmatically with dedicated secure credential stores like HashiCorp Vault, AWS Secrets Manager, or Google Secret Manager.' },
      { title: '4. Dependency Supply Chain Safety', beginner: 'When you install external code tools using `pip install`, you are importing thousands of lines of code written by completely random developers online. If one of those developers turns rogue or gets hacked, they can update their library to steal your files. Supply chain security means continuously checking your external ingredients to ensure they haven\'t been poisoned.', advanced: 'Supply chain vulnerabilities represent a major modern attack vector. Attackers leverage techniques like typosquatting (naming malicious modules similarly to popular packages) to compromise platforms. Professional workflows mandate lockfiles (`requirements.txt` with strict hashes or `poetry.lock`) and run continuous vulnerability scanners like `pip-audit` or `safety` inside deployment stages to flag outdated or compromised dependencies.' }
    ],
    {
      title: 'Enterprise Cryptographic Security Module',
      intro: 'We are going to construct an industrial-grade authentication security module that safely extracts environment secrets, prevents shell command injection, and implements salted cryptographic password hashing.',
      steps: [
        'Open your terminal.',
        'Install the professional security libraries using `pip install bcrypt pip-audit`.',
        'Create a mock user database configuration and a secure `.env` file simulation.',
        'Write a function that safely captures an access secret from the environment block without leaking credentials inside source control paths.',
        'Implement a secure user registration method that cryptographically salts and hashes incoming raw password strings using `bcrypt.hashpw`.',
        'Implement a secure validation method that evaluates input login attempts using `bcrypt.checkpw`.',
        'Write a terminal command utility execution using `subprocess.run` that passes argument arrays safely, explicitly avoiding any `shell=True` runtime configurations.',
        'Run an automated supply-chain audit scan by executing `pip-audit` in your terminal to inspect dependencies for vulnerabilities.'
      ],
      goal: 'You successfully engineered an industry-standard security verification module, isolating environmental secrets, closing shell execution holes, and deploying robust hashing algorithms.'
    },
    [
      q('Why is the usage of `shell=True` inside Python\'s `subprocess` module considered a massive security hazard?', ['It makes the application consume twice as much processing memory', 'It passes raw command strings directly to the system shell interpreter, allowing malicious users to execute unauthorized OS commands via input manipulation', 'It prevents the script from opening network sockets properly', 'It completely disables all print statements in the terminal output'], 1, 'Setting `shell=True` exposes systems to OS Command Injection; passing arguments as a structured array allows the OS to process flags without interpreting dangerous string sequences.'),
      q('Which hashing architecture strategy provides the most secure defense when saving user passwords into a production database infrastructure?', ['Running input strings through quick SHA-256 loops multiple times', 'Utilizing slow, adaptive cryptographic hashing algorithms like `bcrypt` or `Argon2id` combined with an automatic, randomized per-user cryptographic Salt', 'Encoding data into standard Base64 string formats', 'Saving passwords inside an encrypted plain text file in a private folder'], 1, 'Bcrypt and Argon2id are slow by design, forcing computers to expend heavy resources on every evaluation, which renders large-scale automated cracking efforts unfeasible.'),
      q('What is the operational purpose of running utility tools like `pip-audit` or `safety` inside an automated CI/CD software pipeline?', ['To automatically format code style rules according to strict PEP 8 guidelines', 'To scan installed third-party dependencies for known security vulnerabilities and supply-chain exploits published in vulnerability databases', 'To deploy applications to cloud servers automatically', 'To verify that all unit tests are passing perfectly without warnings'], 1, 'Audit utilities scan project lockfiles against security databases, ensuring no compromised dependency versions are bundled into production software deployments.'),
      q('How should a professional software engineering team handle sensitive production database connection strings and secret access keys?', ['By saving them at the top of the main code files using descriptive global variable names', 'By separating configuration states away from application logic, injecting keys dynamically as Environment Variables at launch', 'By writing credentials inside a public README.md file for developer visibility', 'By committing keys into a public Git repository file structure'], 1, 'Decoupling application variables from logic via environment arrays keeps master operational credentials locked down outside repository source systems.')
    ],
    ['Never use shell=True or raw string concatenations inside execution layers to eliminate injection access paths.', 'Deploy bcrypt or Argon2id for password storage routines to protect user authentication records.', 'Isolate production configurations cleanly inside environment blocks, avoiding credential leaks in source control.', 'Integrate pip-audit testing pipelines directly into your deployment cycles to defend against supply chain attacks.']
  ),

  L(
    'py-30', 30, 'Professional Python Packaging & Deployment', '📦', 
    '🖥️ **Terminal Notice:** If you want to use a big terminal on your own computer instead of the built-in one, please read Lesson 1 for the full setup instructions.\n\nWriting code that runs beautifully on your personal computer is a great achievement, but the ultimate goal of professional software engineering is distribution—making your tools reliably installable and deployable by other developers and production servers across the globe. Packaging bridges the gap between loose source files and reproducible, enterprise-ready software ecosystems. By mastering modern build backends, binary distributions, semantic versioning contracts, and automated continuous deployment systems, you can transform individual scripts into institutional open-source libraries or highly scalable cloud assets.',
    [
      { title: '1. Modern Build Systems & Pyproject', beginner: 'Imagine your Python project is a premium meal kits business. To ship it out, you need an official box containing an exact card layout listing ingredients, cooking times, and allergies. The `pyproject.toml` file is that master box label. It has completely replaced older messy setup scripts, giving Python a single, clean, standardized document to understand exactly what your library requires to compile and run.', advanced: 'The `pyproject.toml` file implements the modern standards defined in PEP 517 and PEP 518. It decouples the build frontend tool from the underlying build backend framework. Instead of executing legacy, unsecure imperative `setup.py` scripts, developers specify declarative backends like `hatchling`, `flit`, or `setuptools` directly inside the build-system table, ensuring fully isolated, highly reproducible dependency resolution environments.' },
      { title: '2. Source Distributions vs. Wheels', beginner: 'When you share code, you can send it in two ways. A Source Distribution is like sending someone raw Lego blocks inside a generic plastic bag—their computer has to spend time sorting and building it from scratch. A "Wheel" file is like sending a pre-assembled, perfectly glued toy model that snaps right into their project instantly, saving massive amounts of setup time and energy.', advanced: 'A Source Distribution (`sdist`) contains the pure raw source code and asset files, requiring the target machine to execute installation overhead. A Wheel (`.whl`) is a built package format that completely bypasses compilation steps during a `pip install` sequence. For projects utilizing complex C or Rust extensions, wheels must be pre-compiled across specific platform architectures using automated matrix tools like `cibuildwheel` to guarantee flawless binary compatibility.' },
      { title: '3. Semantic Versioning & Technical Docs', beginner: 'Version numbers are not just random tracking marks; they are a highly strict 3-position code (Major.Minor.Patch, like 2.4.1) that forms a promise with your users. Changing the first number warns them that you changed the code layout so much that their old programs might break. Combine this tracking with professional documentation websites to teach others how your tools operate.', advanced: 'Adherence to Semantic Versioning (SemVer) metrics complies with the strict PEP 440 specification guidelines, allowing automated dependency solvers to safely evaluate version constraint ranges. Professional package lifecycles unify codebases with automated docstring generation suites like Sphinx or MkDocs, building static assets that publish seamlessly onto public hosting services like GitHub Pages or ReadTheDocs.' },
      { title: '4. CI/CD & Automated PyPI Delivery', beginner: 'You should never publish production software manually from your laptop—it leaves too much room for human error. Instead, developers use a tireless robotic workflow assistant called a CI/CD pipeline. The exact moment you save your finished project to GitHub, this robot runs automated quality checks, packages your code into clean wheels, and safely delivers them to the global Python library registry.', advanced: 'Continuous Integration and Continuous Deployment (CI/CD) pipelines, written via automation engines like GitHub Actions, remove human vulnerability pathways from release lifecycles. Modern workflows utilize "Trusted Publishing" authentication protocols powered by short-lived OpenID Connect (OIDC) identity tokens. This eliminates the catastrophic security hazard of storing permanent, hardcoded PyPI API tokens inside repository environment configurations.' }
    ],
    {
      title: 'Enterprise Package Architecture & Distribution',
      intro: 'We are going to construct a fully standardized, standard-compliant Python package infrastructure containing modern metadata schemas, modular source directories, and compiled asset wheels ready for distribution.',
      steps: [
        'Open your terminal.',
        'Structure your codebase workspace utilizing the industry-standard `src/` directory layout to shield modules from accidental local execution artifacts.',
        'Create a comprehensive `pyproject.toml` file at your project root directory, explicitly configuring project metadata metadata, licensing, dependency lists, and declaring a build backend.',
        'Expose clean external interface entry points inside your package\'s `__init__.py` files to control public API exposure boundaries.',
        'Install the modern, isolated packaging utility tool in your environment via `pip install build`.',
        'Execute the build command `python -m build` at your project root to trigger isolated environment generation paths.',
        'Inspect the output to verify that a clean Source Distribution archive and a pre-compiled binary Wheel asset have been built inside your newly generated `dist/` directory.'
      ],
      goal: 'You successfully engineered an industrial-grade, shareable Python package asset ready for global distribution compliance across corporate or open-source software indexes.'
    },
    [
      q('What major architectural advancement is achieved by utilizing a declarative `pyproject.toml` layout over legacy imperatively written `setup.py` scripts?', ['It allows the Python application to automatically compile down to mobile app formats', 'It separates project metadata and build-system definitions into a single standardized file, decoupling frontends from specific backends according to PEP 517/518 specifications', 'It completely eliminates the need to specify third-party dependency requirements', 'It forces all functions inside the package to execute in parallel threads'], 1, '`pyproject.toml` establishes a predictable, declarative metadata platform that allows standard build frontends to cleanly isolate and compile distribution assets without running unsafe code.'),
      q('Why is delivering software via Wheel files (`.whl`) preferred over pure Source Distributions (`.tar.gz`) for enterprise application pipelines?', ['Wheels automatically encrypt the underlying python source code to prevent piracy', 'Wheels are pre-built distribution assets that install near-instantly by bypassing build and compilation execution tracks on the target machine', 'Wheels run up to five times faster on old server operating systems', 'Wheels allow Python modules to bypass standard variable scope restrictions'], 1, 'Wheels are binary distributions; because they skip compilation overhead on installation, they significantly optimize continuous deployment build speeds for infrastructure consumers.'),
      q('Under strict Semantic Versioning (SemVer) logic, which position in a version identifier string (e.g., 1.2.3) must change when delivering a breaking API modification?', ['The third position representing Patch updates', 'The first position representing Major architectural changes', 'The second position representing Minor feature expansions', 'The trailing positional number denoting building timestamps'], 1, 'Major version shifts indicate structural breaks in backward compatibility; updating it signals consuming systems that they must audit integration points before adopting the upgrade.'),
      q('What is the modern security benefit of utilizing Trusted Publishing via OpenID Connect (OIDC) inside a cloud CI/CD distribution deployment pipeline?', ['It compresses compiled file sizes to conserve hosting space', 'It completely eliminates the need to save long-lived, hardcoded PyPI authentication tokens or passwords inside repository secret stores by utilizing transient identity tokens', 'It translates Python error messages into multiple languages automatically', 'It prevents non-paying users from installing open-source library tools'], 1, 'OIDC trusted connections negotiate cryptographic access on the fly based on verifiable environment provenance, completely removing static credential theft risks from code repositories.')
    ],
    ['Adopt the declarative pyproject.toml specification layout for all new library or software applications.', 'Distribute built software via compiled Wheel artifacts to maximize speed and installation predictability for end-users.', 'Adhere strictly to Semantic Versioning specifications to protect system consumers from unexpected dependency breakage.', 'Automate package compilation and registry delivery workflows using secure, OIDC-trusted CI/CD deployment channels.']
  ),

  L(
    'py-test-2', 30.5, 'Final Assessment: Full-Stack Python Mastery', '🎓', 
    'Welcome to the Final Assessment! You have traversed the entire Python curriculum. This capstone test evaluates your mastery over the full spectrum of the language: from basic logic strings to advanced architectural patterns, memory management, asynchronous execution loops, relational database mapping, and modern deployment pipelines. It is time to prove you are a professional Python engineer.',
    [
      { title: '1. Advanced Iteration & Memory Control', beginner: 'You should deeply understand the difference between returning a massive list of data versus yielding data one piece at a time using Generators to save computer memory.', advanced: 'Your architectural knowledge must include the internal mechanics of iterators (`__iter__`, `__next__`), the deterministic memory advantages of `__slots__`, and the usage of custom Context Managers (`__enter__`, `__exit__`) for safe resource allocation.' },
      { title: '2. Concurrency & Metaprogramming', beginner: 'You should know how to write programs that execute tasks concurrently—using Threading for slow network operations and Multiprocessing to utilize all of your CPU cores for heavy math.', advanced: 'You must fully comprehend the Event Loop mechanics of `asyncio`, write non-blocking coroutines, and utilize advanced Metaclasses and Descriptors to manipulate class creation architectures dynamically before runtime.' },
      { title: '3. Web APIs & Database ORMs', beginner: 'You should be fully capable of building web endpoints using modern frameworks like FastAPI and saving data permanently to a structured database using standard SQL.', advanced: 'You should master ORM implementations via SQLAlchemy (managing transactional Sessions, preventing N+1 query traps), strict input validation via Pydantic, and RESTful stateless architecture using cryptographically signed JWT tokens.' },
      { title: '4. Testing, Security & Packaging', beginner: 'You should never guess if your code works; you should prove it systematically using `pytest`. You must also know how to package your project so others can install it flawlessly.', advanced: 'You must be fully capable of mocking external dependencies, neutralizing OS injection attack vectors, managing cryptographic hashing frameworks (like bcrypt), and structuring production-ready deployments utilizing `pyproject.toml` and CI/CD distribution pipelines.' }
    ],
    {
      title: 'The Master Enterprise Capstone',
      intro: 'Your final challenge is to engineer a fully validated, systematically tested, and secure backend microservice from scratch, combining every advanced architectural concept you have learned into one seamless application.',
      steps: [
        'Initialize a completely new project layout and create a declarative `pyproject.toml` file to manage the core dependencies (FastAPI, SQLAlchemy, Pytest, Uvicorn, Pydantic).',
        'Implement a FastAPI web application structure heavily utilizing asynchronous routing pathways.',
        'Engineer a SQLAlchemy database layer, defining an explicit declarative base model and utilizing a custom Descriptor to handle automated string validation on the models.',
        'Build strict Pydantic schemas to validate all incoming JSON payloads, thoroughly preventing malformed data from ever entering the core routing logic.',
        'Write a suite of deterministic unit tests using `pytest`, employing custom fixtures to create temporary, in-memory SQLite databases for completely isolated test execution runs.',
        'Profile the application\'s database population loops using `cProfile` to explicitly ensure your data iteration techniques are highly optimized.'
      ],
      goal: 'You successfully architected, tested, and optimized an enterprise-grade async web service, proving your complete mastery of the professional Python programming ecosystem.'
    },
    [
      q('When engineering high-throughput I/O bound web services, what is the primary architectural advantage of using `asyncio` over traditional OS Multiprocessing?', ['`asyncio` bypasses the CPU entirely and uses the computer\'s GPU for processing web requests', '`asyncio` operates purely within a single native thread using an Event Loop to aggressively context-switch during idle waiting periods, utilizing vastly less system RAM and overhead than spinning up heavy OS-level processes', '`asyncio` automatically translates Python code into native C code prior to execution', '`asyncio` strictly prevents network users from making too many requests simultaneously'], 1, 'Asynchronous programming is incredibly efficient for I/O operations because it completely eliminates the heavy RAM footprints and OS-level context-switching costs associated with managing separate system processes.'),
      q('What structural limitation does the standard Python Global Interpreter Lock (GIL) enforce when writing concurrent software architectures?', ['It prevents the host computer from connecting to multiple cloud databases simultaneously', 'It strictly limits standard Python to executing only one native thread of Python bytecode at a time per process, effectively bottlenecking parallel CPU-bound multithreaded performance', 'It locks the application\'s `.env` configuration files, preventing dynamic runtime updates', 'It immediately crashes the script execution if more than 10 threads are opened'], 1, 'The GIL is a mutex designed to protect internal Python objects from concurrent access data races. While safe, it effectively neutralizes the multi-core execution advantages of standard multithreading for heavy mathematical (CPU-bound) workloads.'),
      q('How does an Object-Relational Mapper (ORM) framework like SQLAlchemy inherently defend against catastrophic SQL Injection attacks?', ['By automatically encrypting the entire database file locally before executing queries', 'By strictly utilizing parameterized query bindings that cleanly isolate untrusted user inputs from the core SQL execution string, treating input purely as data rather than executable commands', 'By globally limiting the length of all user string inputs to 15 characters', 'By utilizing a Metaclass hook to delete dangerous variables from system memory immediately'], 1, 'ORMs rely on parameterized queries native to database drivers. This rigidly enforces the segregation of executable SQL syntax from user data arguments, completely neutralizing injection vectors.'),
      q('What is the direct operational benefit of using a Generator function (`yield`) to parse a massive 50GB server log file instead of returning a standard data list?', ['Generators compress the target text file on the hard drive automatically to save space', 'Generators evaluate and stream one line of data at a time lazily, keeping the system RAM footprint practically flat instead of attempting to load all 50GB into memory simultaneously', 'Generators execute parsing loops up to 10 times faster than standard lists', 'Generators natively convert text strings into secure binary data tokens'], 1, 'Generators evaluate code lazily. By yielding one single item and pausing state execution, they can process infinitely large datasets systematically without ever exceeding the hardware\'s physical RAM constraints.'),
      q('In professional software testing architectures utilizing `pytest`, what is the exact operational purpose of implementing a "Mock" object?', ['To generate large arrays of random string data for load testing pipelines', 'To replace complex, slow, or highly unpredictable external dependencies (such as a third-party payment API) with a controlled, predictable fake object that tracks exactly how it was interacted with', 'To force a test suite to fail automatically in order to verify the CI/CD error logging configurations', 'To precisely measure the raw execution time of a specific functional block in milliseconds'], 1, 'Mocking structurally isolates the specific unit of code being tested. Simulating external systems ensures that sudden network failures or third-party latency drops do not trigger false-positive test suite failures.')
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
