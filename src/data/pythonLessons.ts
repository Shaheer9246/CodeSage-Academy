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
  'py-01', 1, 'Environment Setup & Language Core', '🚀', 'Every incredible software engineering journey starts at the exact same place: the terminal. Before writing complex automation scripts, machine learning pipelines, or web applications, you must transform your machine into a development workstation. This means correctly installing the Python runtime environment, configuring your operating system path arrays, mastering terminal console inputs, and learning how to cleanly execute both live command sandboxes and standalone script files.',
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
    'Think of your computer\'s memory like a massive warehouse. A variable is just a friendly sticky note label you slap onto a specific item in that warehouse so you can find it instantly later!',
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
    'Programs aren\'t just straight lines—they need to make smart choices and repeat tasks. Think of control flow as adding crossroads, traffic lights, and circular roundabouts to your code.',
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
    'Think of a function as a magical kitchen recipe or a factory machine. You feed it raw ingredients (inputs), it runs a specific set of instructions inside, and it hands you back a finished product (output)!',
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
    'Data structures are simply different kinds of storage containers. Choosing the right container for your data is half the battle in coding—each tool offers unique structural traits, speeds, and behavioral rules.',
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
    'Object-Oriented Programming (OOP) is just a way to group your data and behaviors together under one roof. Think of a class as an architectural blueprint, and an object as the actual physical house built from that blueprint.',
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

 L('py-7', 7, 'Modules & Imports', '📦',
    'Real-world coding projects aren\'t written in one gigantic, messy file. Think of modules and packages as specialized toolboxes and storage drawers that let you organize and divide your code neatly across separate files.',
    [
      { 
        title: '1. Borrowing Tools (import)', 
        beginner: 'To use tools from another file, use the `import` keyword. Writing `import math` brings in a whole toolkit, allowing you to use its functions like `math.sqrt(16)`. If you only need one specific tool, write `from math import sqrt` to pull it out directly!', 
        advanced: 'Using wildcard imports like `from module import *` is a dangerous anti-pattern. It pollutes your active local namespace, causes unpredictable variable name collisions, and completely blinds your IDE\'s reference tracing.' 
      },
      { 
        title: '2. Modules Are Just Files', 
        beginner: 'Every single `.py` file you create is automatically a module! If you have a file named `calculator.py` containing custom code, you can easily load those tools into a separate file by typing `import calculator` (leave off the `.py`).', 
        advanced: 'Python executes a module\'s top-level code exactly once upon its very first import, caching the resulting object in `sys.modules`. Subsequent imports pull instantly from this cache; keep top-level logic free of runtime side effects.' 
      },
      { 
        title: '3. Packages Are Folders', 
        beginner: 'A package is simply a folder on your computer packed with multiple code modules inside it. Placing a special, empty file named `__init__.py` inside that folder tells Python: "Treat this entire directory as an official, organized package bundle!"', 
        advanced: 'Python 3.3+ introduced implicit namespace packages, meaning `__init__.py` is no longer strictly mandatory for basic directory indexing. However, explicit packages remain essential for structuring complex architectures and modular plugin distributions.' 
      },
      { 
        title: '4. The Standard Library (Batteries Included)', 
        beginner: 'Python comes with an absolute warehouse of free, built-in toolboxes called the Standard Library. Without installing anything extra, you can instantly import tools to talk to your operating system (`os`), parse web data (`json`), track time (`datetime`), or pick options (`random`)!', 
        advanced: 'Audit Python\'s standard library documentation regularly. You will discover incredibly fast, highly optimized built-in utilities like `itertools` for advanced stream combinations or `collections` for specialized high-performance data structures.' 
      },
    ],
    { 
      title: 'Splitting Your First Script', 
      intro: 'Let\'s break a single code file apart into a multi-module system that shares tools across your workspace.', 
      steps: [
        'Imagine creating a separate file named `math_utils.py` on your computer.',
        'Inside that file, you write a standalone recipe: `def square(x): return x * x`.',
        'Now imagine switching over to your core workspace file, named `main.py`.',
        'At the absolute top of `main.py`, tell Python to look at your utility file by typing: `from math_utils import square`.',
        'Now execute that imported tool directly inside your main code by running: `print(square(5))`.',
        'When you tell the terminal to run `python3 main.py`, Python pieces the files together and outputs 25 perfectly!'
      ], 
      goal: 'You understand how to link multiple script files together by importing individual functions across modules.' 
    },
    [
      q('Why is writing `from math import *` generally considered a bad coding habit?', ['It makes your final code execution run 10 times slower','It completely pollutes your file workspace with hidden names, hiding where tools came from','It deletes the original math file off your hard drive','It prevents your script from running on Windows computers'], 1, 'Wildcard imports blend hundreds of hidden names into your current file space, making it impossible to track where functions were originally created.'),
      q('What is a Python module in its simplest physical form?', ['A special system app downloaded from the internet','Any standard text file ending with a `.py` extension','A hidden command embedded inside your keyboard hardware','A specific type of mathematical equation loop'], 1, 'Every individual Python file you create is natively considered a separate module that can be shared and imported elsewhere.'),
      q('How many times does Python execute the top-level script code inside a module if it is imported multiple times across your program?', ['It executes the code completely every single time it is imported','Exactly once on the first import, then it safely reads from a fast memory cache','Only when the application crashes and shuts down','Never, unless you add a specific loop wrapper'], 1, 'Python processes imported modules exactly once and stores them in a memory cache. Consecutive imports simply read from that existing cache to save processing power.'),
      q('What does it mean when developers say Python comes with "batteries included"?', ['The programming language requires actual physical batteries to process variables','Python natively ships with a massive library of pre-installed toolkits ready to use immediately','The code automatically saves electricity on laptop computers','It runs perfectly fine without electricity'], 1, '"Batteries included" is a classic phrase celebrating the fact that Python\'s standard library gives you a massive set of built-in software tools out of the box.')
    ],
    ['Use specific imports to keep your file workspace clean and transparent','Every individual .py script file functions as an independent module','Folders act as packages to group related modules together','Always check Python\'s huge built-in standard library before writing tools from scratch']
  ),
  
 L('py-8', 8, 'File I/O', '📂',
    'Working with files is how your program remembers things after it closes. Think of reading and writing files like pulling an physical notebook off a shelf, flipping open to a clean page, writing down or reading notes, and slamming it shut.',
    [
      { 
        title: '1. Safe File Openings (with open)', 
        beginner: 'To read a file on your computer, use the `with open("notes.txt") as f:` block. The `with` keyword acts like a smart personal assistant—the exact moment your indented code finishes running, it automatically slams the file shut for you so your computer memory doesn\'t leak data!', 
        advanced: 'The `with` statement implements Python\'s context manager protocol by executing the file object\'s structural `__enter__()` and `__exit__()` methods. This guarantees underlying operating system file descriptors are released cleanly even if an unhandled runtime exception crashes the block execution.' 
      },
      { 
        title: '2. Operating Modes', 
        beginner: 'When opening a file, you must tell Python what you plan to do. Use `"r"` for reading text. Use `"w"` for writing new text—but be careful, `"w"` completely wipes out and overwrites anything that was inside the file before! Use `"a"` to cleanly append text onto the very bottom of the existing page.', 
        advanced: 'Pass the exclusive creation mode flag `"x"` to force a failure if the target filename already exists on disk. Always explicitly pass `encoding="utf-8"` within text streams to prevent your host operating system\'s default locale settings from corrupting or breaking localized Unicode text formatting.' 
      },
      { 
        title: '3. Streaming Huge Files (Iterating Lines)', 
        beginner: 'If you need to read a massive file line by line, don\'t swallow the whole book at once! Using a simple loop like `for line in f:` tells Python to read only one individual line into memory at a time, protecting your computer from freezing or crashing.', 
        advanced: 'Calling `.read()` on multi-gigabyte structures triggers instant out-of-memory errors by pulling raw bytes directly into standard RAM. Leverage line-by-line file descriptor iteration combined with custom lazy generators to construct memory-bounded streaming data pipelines.' 
      },
      { 
        title: '4. Structured Layouts (JSON & CSV)', 
        beginner: 'Python comes with pre-made tools to parse official formats. Importing the `json` module lets you read API data blocks, while the `csv` module lets you read spreadsheets easily without writing any complex text separation logic yourself.', 
        advanced: 'While the `pandas` library is highly superior for scalable data analysis, utilize Python\'s native `json` and `csv` standard library components inside structural utility tools to minimize application dependencies and keep installation footprints lightweight.' 
      },
    ],
    { 
      title: 'The JSON Storage Round Trip', 
      intro: 'Let\'s write an advanced script that saves a Python variable permanently to a structured file on disk, and then reads it back into memory.', 
      steps: [
        'Open your interactive terminal screen and ensure the Python environment is ready (look for the >>> prompt).',
        'Import the native system tool format by typing: `import json` and hit Enter.',
        'Create a dictionary variable of data: Type `data = {"name": "Sage", "level": 99}` and hit Enter.',
        'Open a brand new file pointer in write mode with clean text handling: Type `with open("out.json", "w", encoding="utf-8") as f:`.',
        'On the next indented line, save your data using indent formatting: Type `json.dump(data, f, indent=2)` and hit Enter twice.',
        'Now read it back! Open the file in read mode: Type `with open("out.json", "r", encoding="utf-8") as f:`.',
        'Extract the data stream safely on the next indented line by running: `loaded = json.load(f)`. Print `loaded["name"]` to see it read from the file!'
      ], 
      goal: 'You successfully serialized a live memory variable straight down to a physical JSON file and read it back.' 
    },
    [
      q('Why should you always use the `with open(...)` pattern instead of manually opening files?', ['It makes the text inside the file completely unreadable to hackers','It automatically closes the file for you when your code block finishes, preventing data leaks','It forces your computer to execute the script twice as fast','It deletes temporary variables to save local space'], 1, 'The `with` keyword acts as a native context wrapper that guarantees your open file streams are automatically and safely shut down under all circumstances.'),
      q('What happens to your data if you open an existing file using the `"w"` mode flag?', ['Python adds new lines directly onto the bottom of the file','It completely deletes the file\'s existing contents and overwrites it from scratch','It throws an immediate error screen to warn you','It duplicates the file and makes a separate copy'], 1, 'The `"w"` flag represents destructive writing; it opens a clear file stream, wiping out any historical data previously written on that file path.'),
      q('What is the safest, most memory-efficient way to process an enormous 10-Gigabyte text file?', ['Load the entire file into a giant variable string using .read()','Iterate through the open file line by line using a standard loop','Convert the text file into a zip bundle before reading','Copy and paste the text lines manually into the terminal'], 1, 'Iterating through a file stream line by line loops through structural data incrementally without overloading your local RAM allocations.'),
      q('Why is it highly recommended to pass `encoding="utf-8"` when opening text files in Python?', ['It encrypts the text inside your local files','It ensures text characters from different world languages are read correctly across all operating systems','It is a mandatory requirement to make file loops work','It compresses your file sizes down to half'], 1, 'Explicitly declaring your character encoder prevents layout reading glitches caused by shifting between cross-platform default locale standards.')
    ],
    ['Always employ the with statement to handle file closure hooks safely','Beware that the write mode flag completely resets historical data contents','Iterate line by line to stream massive files without exhausting memory','Explicitly define your character encoding rules to preserve text integrity']
  ),

  L('py-9', 9, 'Error Handling', '⚠️',
    'Code that ignores errors lies to its users. Think of error handling like setting up a safety net or buckling a seatbelt—unexpected bumps will happen, but a great program catches those bumps gracefully instead of crashing to the floor.',
    [
      { 
        title: '1. The Safety Net (try / except)', 
        beginner: 'Wrap unpredictable code inside a `try:` block. If something goes wrong, Python stops and slides down safely into your matching `except:` recovery cushion. Never write a plain, empty `except:`—always name the exact problem you want to fix!', 
        advanced: 'Writing a bare `except:` clause intercepts all exceptions indiscriminately, including crucial internal runtime interrupts like `KeyboardInterrupt` (Ctrl+C) and `SystemExit`. This acts as a dangerous anti-pattern that masks structural core logic failures.' 
      },
      { 
        title: '2. Naming the Problem (Exception Types)', 
        beginner: 'Python uses different names for different mistakes. Shoving letters into math formulas causes a `TypeError`. Looking for a missing key inside a dictionary triggers a `KeyError`. Spotting these names lets you build targeted fixes for each unique situation!', 
        advanced: 'Always target the narrowest, most explicit exception subclass possible. Catching a broad generic base `Exception` intercepts expected failures but simultaneously blinds your logging and debug stack traces from unpredictable runtime errors.' 
      },
      { 
        title: '3. Guaranteeing Cleanup (finally / else)', 
        beginner: 'The `else:` block runs only if your code succeeds perfectly without hitting any errors. The `finally:` block is your unstoppable cleanup crew—it executes no matter what happens, even if your code hits an error or immediately hits a return statement!', 
        advanced: 'The `finally` block is natively reserved for resource disposal routines like forcing network connection drops or releasing database locks. For local file data streams, prioritizing standard context managers (`with`) provides a cleaner structural footprint.' 
      },
      { 
        title: '4. Sounding the Alarm (Raising Custom Errors)', 
        beginner: 'You can sound a deliberate alarm inside your own code by typing `raise ValueError("Invalid Input Sent!")`. You can even design your own custom alarm names by creating an empty class that inherits from the core Exception blueprint!', 
        advanced: 'Custom exceptions act as the public structural interface of high-level modules and frameworks. Construct logical domain exception hierarchies (e.g., creating a base `DatabaseError` from which specialized `ConnectionTimeout` errors branch) to support modular exception mapping.' 
      },
    ],
    { 
      title: 'The Crash-Proof Divider', 
      intro: 'Let\'s build a robust mathematical function that intercepts bad numbers and text parameters without letting the application crash.', 
      steps: [
        'Open your interactive playground panel and confirm the Python prompt line (>>>) is ready.',
        'Define a dividing template tool by typing: `def divide(a, b):` and hit Enter.',
        'On the next indented line, set up your targeted safety net tracking block by typing: `try:`.',
        'Directly under that tracking line, try to deliver the division math answer: Type `return a / b`.',
        'Catch division by zero attempts safely below it: Type `except ZeroDivisionError: return None`.',
        'Catch bad string data inputs next: Type `except TypeError: raise ValueError("Numbers only!") from None`.',
        'Exit the indents and test both paths by running `divide(10, 0)` and `divide("text", 2)` to verify the clean failures.'
      ], 
      goal: 'You successfully mapped targeted safety blocks to handle math violations and data type mismatches smoothly.' 
    },
    [
      q('Why is writing a bare, nameless `except:` block considered a dangerous coding habit?', ['It forces the computer to restart completely','It swallows every error blindly, including user exit commands, hiding underlying software bugs','It makes function definitions completely uncallable','It deletes your variable attributes'], 1, 'Bare exceptions hide critical logic bugs and block system override commands like Ctrl+C from functioning correctly.'),
      q('Which block is guaranteed to run its code contents no matter what happens inside your error handling safety net?', ['The try block','The except block','The finally block','The else block'], 2, 'The `finally` clause executes unconditionally at the end of the error block, making it the perfect location for data cleanup routines.'),
      q('What is the best practice regarding how specific your exception targets should be?', ['Always catch the generic global Exception to be completely safe','Be as narrow and specific as possible to catch only the exact problem you know how to handle','Never use error blocks and let the application crash naturally','Let your loop handle it randomly'], 1, 'Targeting tight, explicit exception classes prevents your recovery logic from accidentally capturing unrelated system failures.'),
      q('How do custom exceptions assist when you are designing scalable software applications and libraries?', ['They automatically speed up runtime code loops','They provide a clean, highly descriptive public interface for mapping error handling across architectures','They shrink the footprint size of file packages','They eliminate the need to use decorators'], 1, 'Custom exceptions allow systems to differentiate internal application errors from standard structural language environment violations.')
    ],
    ['Wrap risky statements inside targeted try blocks','Use explicit exception types instead of generic catchalls','The finally block triggers resource cleanup routines unconditionally','Raise explicit descriptive errors to prevent predictable silent software failures']
  ),

 L('py-10', 10, 'List Comprehensions & Generators', '⚡',
    'Python lets you process entire collections of data using short, elegant, single-line shortcuts. You can choose to calculate everything instantly all at once, or stream items lazily one by one to save computer memory!',
    [
      { 
        title: '1. List Comprehensions (Instant Transformations)', 
        beginner: 'Instead of writing a long, multi-line `for` loop just to modify items in a list, you can compress it into a clean one-liner inside square brackets, like `[x * 2 for x in nums]`. It loops, transforms, and outputs a brand new list instantly!', 
        advanced: 'List comprehensions generate an entire populated array in memory eagerly. Writing complex, triple-nested comprehensions is a structural code smell that destroys readability—refactor those structures back into explicit standard loops, and use trailing `if` conditions exclusively for shallow filtering.' 
      },
      { 
        title: '2. Dictionary & Set Comprehensions', 
        beginner: 'You can use this exact same one-line loop trick to quickly build custom dictionaries and sets! For example, writing `{x for x in items}` loops through your data and instantly filters out all duplicate items automatically.', 
        advanced: 'Set comprehensions use syntax like `{x for x in items}` to inline deduplicate streams efficiently. Prefer native set comprehensions over wrapping unoptimized casting operations like `list(set(sequence))` when structural clarity is preferred.' 
      },
      { 
        title: '3. Generator Expressions (The Lazy Conveyor Belt)', 
        beginner: 'If you swap out a list\'s square brackets `[]` for round parentheses `()`, you create a Generator expression! Instead of filling your computer memory with millions of items instantly, it waits lazily and calculates the next item only when you explicitly ask for it.', 
        advanced: 'Generator expressions stream data iteratively without allocating intermediate block arrays. Pass them directly as arguments into reduction functions like `sum(x * x for x in data)` or `max()` to perform math over infinite streams at zero memory overhead cost.' 
      },
      { 
        title: '4. Streaming Streams with `yield`', 
        beginner: 'When building a function, swapping out the traditional `return` keyword for `yield` turns your tool into an iterator. Instead of shutting down after outputting one answer, it pauses its state, hands over a value, and waits to pick up right where it left off!', 
        advanced: 'The presence of `yield` transforms a regular call frame into a reusable generator object. Generators act as synchronous coroutines under the hood; utilize `yield from sub_generator` to cleanly delegate iteration duties down into nested streaming pipelines.' 
      },
    ],
    { 
      title: 'The Lazy Infinite Generator', 
      intro: 'Let\'s build a lazy math engine that can calculate squared numbers out to infinity without ever running out of computer memory or freezing your system.', 
      steps: [
        'Open your interactive screen workspace and make sure the active Python prompt (>>>) is listening.',
        'Define a custom lazy generator tool by typing: `def squares():` and hit Enter.',
        'Initialize a baseline tracking number on the next indented line: Type `n = 1`.',
        'Set up an infinite loop container below it: Type `while True:`.',
        'Inside that loop, pause and output the math computation using yield: Type `yield n * n`. Then increment the counter with `n += 1`.',
        'Exit the indents, instantiate your engine by running `g = squares()`, and type `next(g)` multiple times to see numbers stream out on demand!',
        'Now try a rapid, single-line list shortcut for comparison: Type `[x * x for x in range(10)]` and observe the instant calculation array.'
      ], 
      goal: 'You understand the core difference between building an eager data list all at once versus streaming data values lazily.' 
    },
    [
      q('Which tool allows you to transform and filter a massive collection of items lazily without overloading your computer RAM memory?', ['A standard eager list comprehension','A memory-efficient generator expression wrapped in parentheses ()','An implicit structural class declaration','A string slice sequence'], 1, 'Generator expressions use round parentheses to stream transformations step by step on demand, using virtually zero memory overhead.'),
      q('What happens to a Python function when you use the `yield` keyword instead of a standard `return` keyword?', ['The function deletes itself immediately after running once','It transforms the function into a stateful iterator that can pause and resume execution','It converts all outputs into string values','It triggers a fatal compilation type failure'], 1, 'The `yield` keyword creates a generator, suspending execution context dynamically so it can stream multiple distinct data values over time.'),
      q('What is the best structural choice if you find yourself writing a triple-nested list comprehension statement?', ['Keep it on a single line to show off your math skills','Stop and refactor the code back into standard, highly readable multi-line loops','Delete the function and use an external plugin package','Convert the square brackets into strings'], 1, 'Deeply nested comprehensions are a major readability violation; refactoring them back into standard code blocks keeps your system accessible and maintainable.'),
      q('How does a set comprehension assist you when processing incoming raw sequence data collections?', ['It sorts all elements alphabetically','It instantly loops through and filters out all duplicate items from the collection automatically','It encrypts the individual items inside a key-value dictionary','It blocks empty values from entering'], 1, 'Set comprehensions utilize curly brackets `{x for x in data}` to automatically drop duplicates and guarantee structural uniqueness.')
    ],
    ['List comprehensions express data transformations cleanly in a single line of code','Using parentheses creates a lazy generator expression that saves memory','The yield keyword allows functions to pause state and stream values sequentially','Avoid writing deeply nested comprehensions to preserve code readability']
  ),
  
  L('py-11', 11, 'Decorators', '🎨',
    'Think of a decorator like a security guard or a gift-wrapping machine. It wraps itself around an existing function to add extra superpowers—like timing, security clearance, or automatic logging—without touching or messing up the original code inside!',
    [
      { 
        title: '1. Functions as First-Class Values', 
        beginner: 'In Python, functions are just regular items! You can assign a function to a variable, pass it as a gift into another function, or return a function as an output. This flexibility lets us pass whole code recipes around seamlessly.', 
        advanced: 'Decorators fundamentally rely on closures. A closure occurs when a nested inner function retains direct read access to variables defined within its enclosing parent scope, even after that parent function has completely finished executing.' 
      },
      { 
        title: '2. The @ Syntax (Syntactic Sugar)', 
        beginner: 'Placing the `@` symbol above a function definition (like `@my_decorator`) is just a clean shortcut! It tells Python: "Take this function, feed it through the decorator machine, and replace it with the upgraded wrapper version automatically."', 
        advanced: 'The `@decorator` syntax is pure syntactic sugar for an explicit assignment: `f = decorator(f)`. When stacking multiple decorators above a single definition, Python evaluates them from the bottom up (closest to the function definition first).' 
      },
      { 
        title: '3. Identity Protection (functools.wraps)', 
        beginner: 'When you wrap a function inside a decorator, it can accidentally lose its identity and forget its original name! Using a special helper line called `@functools.wraps` ensures your function holds onto its native name and description.', 
        advanced: 'Failing to apply `@functools.wraps(fn)` to your internal wrapper function causes the target function\'s reflection metadata (`__name__` and `__doc__`) to be overwritten. This turns debugging into a nightmare as every function begins to report its name as "wrapper".' 
      },
      { 
        title: '4. Powerful Built-in Decorators', 
        beginner: 'Python has incredible decorators pre-installed! For example, adding `@functools.lru_cache` above a slow function tells Python to remember previous answers so if you ask the exact same question again, it spits out the answer instantly without recalculating!', 
        advanced: 'The `@lru_cache` decorator provides free, high-performance in-memory memoization. Other structural built-ins like `@dataclass` automatically write repetitive boilerplates for you, generating complete `__init__`, `__repr__`, and `__eq__` methods under the hood.' 
      },
    ],
    { 
      title: 'The Code Execution Timer', 
      intro: 'Let\'s build a reusable benchmarking tool that wraps around any function and measures exactly how many milliseconds it takes to run.', 
      steps: [
        'Open your interactive workspace and check that the active Python prompt (>>>) is listening.',
        'Import the core timing utilities: Type `import time` and `import functools` and hit Enter.',
        'Define your custom wrapper machine by typing: `def timer(fn):` and hit Enter.',
        'Protect metadata identity on the next indented line by applying the helper: `@functools.wraps(fn)`.',
        'Directly below that, define the active wrapper function: `def wrapper(*args, **kwargs):`.',
        'Inside the wrapper, record the start time (`start = time.time()`), run the actual code (`result = fn(*args, **kwargs)`), calculate the elapsed time, print it out, and return the result.',
        'Exit all indents, return the internal `wrapper` function from your main tool, and test applying `@timer` to a test script!'
      ], 
      goal: 'You successfully wrote a structural wrapper decorator that captures runtime metrics dynamically.' 
    },
    [
      q('What is the `@` symbol above a function definition actually doing under the hood?', ['It deletes the function from system memory to save space','It is a clean shortcut for feeding the function into a decorator modifier line, like `f = decorator(f)`','It encrypts the lines of code to make them secure','It turns the function into an infinite tracking loop'], 1, 'The `@` decorator operator is native syntactic sugar that automatically passes your target function as an argument directly into the wrapper utility.'),
      q('What debugging issue occurs if you create a decorator but forget to include the `@functools.wraps` modifier helper?', ['The entire python program crashes immediately on compilation','The function loses its original metadata identity and mistakenly reports its name as "wrapper"','The function runs exactly 5 times slower than normal','The return keyword stops working entirely'], 1, 'Without `@functools.wraps`, the interior wrapper function\'s metadata completely overrides the original target function\'s true name and description attributes.'),
      q('Which built-in Python decorator can you use to store previously calculated answers in a fast memory cache?', ['@property','@functools.lru_cache','@staticmethod','@dataclass'], 1, 'The `@lru_cache` decorator acts as a native memoization layer, saving input-output states to completely bypass repetitive execution cycles.'),
      q('What foundational concept allows a nested wrapper function to remember and interact with variables from its outer function?', ['Global environment variables','Closures','Thread loops','System pipeline streams'], 1, 'Decorators operate on closures, which allow inner function definitions to lock down and remember the scope environment variables surrounding them.')
    ],
    ['Decorators wrap functions to add dynamic features without altering original code','The @ syntax acts as clean syntactic sugar for function reassignment','Always use functools.wraps to protect your original function metadata names','Apply lru_cache to inject fast performance memoization caching into functions']
  ),

 L('py-12', 12, 'Iterators & Generators (Deep Dive)', '🔁',
    'Ever wonder how `for` loops actually pull items out of a list? Python uses a universal sequence-grabbing rule called the Iterator Protocol. Master this one mechanic, and you will understand how loops, text parsing, and streaming data engines operate under the hood!',
    [
      { 
        title: '1. The Iteration Rules (The Protocol)', 
        beginner: 'An collection is "iterable" if it allows you to explore its contents. When a `for` loop runs, it drops a matching "iterator claw" into that collection. The claw executes a command called `__next__()` over and over to drag out one item at a time until the container runs completely dry!', 
        advanced: 'Executing `for x in y:` implicitly calls `iter(y)` to retrieve an independent iterator object. It then repeatedly invokes `next()` on that object inside an optimized evaluation loop until a native `StopIteration` exception is raised, which Python catches internally to break the loop.' 
      },
      { 
        title: '2. Building Custom Iterators', 
        beginner: 'You can build your own custom looping tracks by writing a class that includes two internal setup methods: `__iter__()` (which sets up the claw) and `__next__()` (which defines exactly how to calculate or fetch the very next item in line).', 
        advanced: 'While you can engineer explicit iterators by tracking index overrides manually within standard class instances, writing stateful generators with `yield` statements handles frame suspension automatically and cleanly covers 95% of custom data-streaming requirements.' 
      },
      { 
        title: '3. The Advanced Loop Arsenal (itertools)', 
        beginner: 'Instead of writing messy nested loops to join sequences or search for combinations, Python includes a built-in module called `itertools`. It gives you pre-made, high-speed shortcuts to chain collections together or find pairs in a single line!', 
        advanced: 'The `itertools` module offers ultra-fast memory-efficient routines written in optimized C logic. Common patterns like merging streams with `chain()`, chunking with `islice()`, tracking cyclic patterns with `cycle()`, or generating combinations eliminate custom structural iteration boilerplate.' 
      },
      { 
        title: '4. Infinite Data Streams', 
        beginner: 'Because iterators calculate items one by one on demand, you can create loops that run forever without using up your computer\'s memory! For example, `itertools.count()` counts up to infinity safely, and you can slice out just the first few items whenever you want.', 
        advanced: 'Lazy execution semantics allow you to assemble data filtering and transformation pipelines that act over infinitely long structural data streams. This technique process vast external telemetry sets or live socket events without risking an out-of-memory error.' 
      },
    ],
    { 
      title: 'The itertools Hands-on Studio', 
      intro: 'Let\'s run advanced sequence-combinatorics and lazy streaming operations using Python\'s high-performance loop toolkit.', 
      steps: [
        'Open your interactive coding panel and make sure the active Python prompt line (>>>) is listening.',
        'Load the native high-speed looping module by typing: `import itertools` and hit Enter.',
        'Pull 5 elements out of an infinite stream by running: `list(itertools.islice(itertools.count(), 5))`. Observe the resulting list.',
        'Glue two separate data lists together effortlessly into a single pipeline track: Type `list(itertools.chain([1, 2], [3, 4]))`.',
        'Generate every single mathematical pair permutation out of a sequence: Type `list(itertools.combinations([1, 2, 3], 2))`.'
      ], 
      goal: 'You successfully controlled infinite data pipelines and paired sequences utilizing fast built-in iterative primitives.' 
    },
    [
      q('What internal system protocol does a standard `for` loop rely on to grab items out of a collection?', ['The Global Interpreter Lock (GIL)','The implicit structural Iterator Protocol (`__iter__` and `__next__`)','The absolute terminal path directory configuration','A background system memory thread'], 1, 'All collection loops in Python rely directly on the iterator protocol to access sequence data points uniformly.'),
      q('What is the absolute cleanest, most pythonic way to write a custom iterator without manually building class states?', ['Declare a local global variable counter','Write a functional generator that utilizes the `yield` keyword','Import an external third-party matrix pack','Nest five separate if statements together'], 1, 'Generators automatically implement the complete iterator protocol for you, tracking states implicitly behind a clean `yield` statement.'),
      q('Which specific `itertools` helper allows you to safely slice off a small finite chunk from an infinite data stream?', ['itertools.chain','itertools.islice','itertools.product','itertools.cycle'], 1, 'The `itertools.islice()` function slices sequences lazily on demand, making it safe to extract a finite window out of a boundless data generator stream.'),
      q('Which high-speed helper generates a full Cartesian coordinate matrix combination map between elements?', ['zip','itertools.product','enumerate','filter'], 1, 'The `itertools.product()` generator calculates structural Cartesian matrix paths natively inside highly optimized C system logic.')
    ],
    ['The iteration protocol relies on __iter__ and __next__ hooks','Using a yield statement automatically creates a functional iterator structure','The itertools library provides optimized loops for heavy data tasks','Lazy sequence evaluation processes infinite streams with zero memory danger']
  ),
  
 L('py-13', 13, 'Virtual Environments & pip', '🧪',
    'Installing software packages globally on your computer is a dangerous habit. Think of a virtual environment like an isolated, sterile laboratory room built specifically for one single project—keeping its tools completely separated so they never leak out and corrupt your main operating system!',
    [
      { 
        title: '1. Isolation is Mandatory (Why venv)', 
        beginner: 'Different software projects require different versions of tools. If Project A needs an old tool version and Project B needs a brand-new version, installing them globally causes a massive collision that breaks your code! Isolation solves this completely.', 
        advanced: 'Your host operating system relies on its built-in Python installation for core system tasks. Modifying global system-level site-packages can fundamentally destabilize OS utilities. Always combine dependency management tools like `pyenv` and `venv` to enforce workspace sandboxing.' 
      },
      { 
        title: '2. Spawning a Cleanroom (Creating a venv)', 
        beginner: 'You can create a hidden safety environment folder inside your project directory by running `python3 -m venv .venv`. To step inside this cleanroom and start using it, you run an activation command called `source .venv/bin/activate`!', 
        advanced: 'Always add your generated local environment folder path (`.venv/`) directly to your project\'s `.gitignore` file to avoid tracking megabytes of compiled binary dependencies. Maintain identical environment naming conventions across workspaces to standardize automation scripts.' 
      },
      { 
        title: '3. Fetching Gear (pip)', 
        beginner: 'The program named `pip` is your personal delivery drone that downloads open-source libraries from the web! Running `pip install requests` fetches a package instantly, while running `pip freeze > requirements.txt` writes down a clean shopping list of your tools.', 
        advanced: 'Utilize editable installations via `pip install -e .` when engineering local development libraries. Enforce explicit application build reproducibility by pinning exact deterministic package versions using strict double-equals bindings (`==`) inside tracking files.' 
      },
      { 
        title: '4. Modern Next-Gen Workspaces', 
        beginner: 'While standard Python handles basic cleanrooms perfectly, modern developer teams use faster upgraded management tools like Poetry or `uv` to automate their dependency configurations and package setups in seconds.', 
        advanced: 'The rapid adoption of `uv` has revolutionized dependency compilation speed by resolving ecosystem trees 10x to 100x faster than traditional pip architectures. Standardize on unified workspace managers like Poetry or `uv` across development groups to guarantee locked build environments.' 
      },
    ],
    { 
      title: 'The Isolated Workspace Setup', 
      intro: 'Let\'s construct a real sandboxed development sandbox directory from scratch, boot up its environment engine, and save its tool configurations.', 
      steps: [
        'Open your command line terminal app (make sure you are at your computer\'s system shell prompt, not inside the Python >>> loop).',
        'Create and step inside a new directory: Type `mkdir myproject && cd myproject` and hit Enter.',
        'Spawn a fresh, sandboxed workspace folder by running: `python3 -m venv .venv`.',
        'Step inside your new cleanroom: Run `source .venv/bin/activate` (Mac/Linux) or `.venv\\Scripts\\activate` (Windows). Notice your prompt line changes!',
        'Use your package installer to safely fetch an internet tool: Type `pip install requests`.',
        'Save your environment shopping list so other developers can mirror it: Run `pip freeze > requirements.txt`.'
      ], 
      goal: 'You successfully initialized an isolated runtime workspace partition and captured reproducible package installations.' 
    },
    [
      q('Why is it highly discouraged to install third-party Python packages globally across your computer system?', ['Global installations make your computer monitor display incorrect colors','It triggers package version collisions between projects and risks breaking core operating system software tools','It automatically deletes your project files when you shut down','It requires a paid subscription to function'], 1, 'Global package pollution leads to dependency management collisions and can corrupt vital python scripts that your operating system runs natively.'),
      q('Which core execution command initializes a brand-new virtual environment directory container inside your current folder path?', ['python environment build','python3 -m venv .venv','npm init workspace','pip environment create'], 1, 'The native flag command `python3 -m venv .venv` tells Python to execute its virtual environment module and drop a structural configuration folder named `.venv`.'),
      q('What file name convention is standard in the Python ecosystem for saving a list of project package dependencies?', ['package.json','requirements.txt','Gemfile','pom.xml'], 1, 'The `requirements.txt` file is the universal convention used by Python developers to store reproducible package manifest specifications.'),
      q('Which modern dependency resolution speed tool is engineered to execute package installations significantly faster than traditional pip?', ['pip-legacy','uv','npm-resolver','cargo-python'], 1, 'The modern open-source tool `uv` compiles and locks dependency resolution constraints up to 100 times faster than classic package managers.')
    ],
    ['Always isolate software tracks with a virtual environment','Activate your environment script before running package commands','Use pip freeze to output dependency lists for team reproducibility','Explore modern ultra-fast tools like uv to streamline workflow speeds']
  ),

 L('py-14', 14, 'HTTP Requests', '🌐',
    'Modern software applications rarely live in isolation—they talk to external web services and APIs constantly. Think of an HTTP request like sending a delivery courier to a remote warehouse with a specific order note, waiting for them to fetch the item, and receiving a package back!',
    [
      { 
        title: '1. Fetching Data (GET)', 
        beginner: 'When you want to read information from a website or API, you use a `GET` request. In Python, writing `r = requests.get(url)` sends out the courier, and calling `r.json()` instantly unpacks the incoming digital package into a clean dictionary!', 
        advanced: 'By default, the `requests` library will wait indefinitely for a response if a server hangs. Always pass an explicit `timeout` float parameter. For sequential networking pathways, utilize a persistent `requests.Session()` instance to enable TCP socket reuse and automatic connection pooling.' 
      },
      { 
        title: '2. Sending Data & Auth (POST)', 
        beginner: 'When you want to send new information to a web server (like submitting a login form or posting a status update), you use a `POST` request. You can attach data directly using `json={}` and pass secure digital keys using secret access headers.', 
        advanced: 'Pass a standard tuple coordinate `auth=("user", "pass")` to trigger implicit HTTP Basic Authentication. For modern Token or Bearer-based security frameworks, explicitly inject your credential keys directly into the connection header dictionary.' 
      },
      { 
        title: '3. Internet Safety (Error Handling)', 
        beginner: 'Every time an HTTP courier returns, they hand you a numeric status code. A score of `200` means total success! If anything goes wrong, calling the command `r.raise_for_status()` acts like a tripwire that intentionally triggers an error so your code can react.', 
        advanced: 'Network calls are highly volatile. Intercept connection drops by catching `requests.RequestException`. For production-grade stability, mount a custom `HTTPAdapter` configured with a `urllib3.Retry` component to automate exponential backoff routines for handling transient 503 server overloads.' 
      },
      { 
        title: '4. Next-Gen Speeds (httpx & Async)', 
        beginner: 'The classic `requests` tool forces your program to sit completely frozen while waiting for a web server to answer. Modern Python projects use an upgraded tool called `httpx` which allows your script to work on other tasks while requests travel across the web!', 
        advanced: 'When managing hundreds of concurrent remote connection endpoints, blocking synchronous operations exhaust hardware threads rapidly. Switching to `httpx.AsyncClient()` lets a single event loop process non-blocking I/O multiplexing, dramatically escalating networking throughput.' 
      },
    ],
    { 
      title: 'The Real-World Live API Call', 
      intro: 'Let\'s write a robust, network-safe script that pings a live external server, checks its operational health connection status, and unpacks its structure.', 
      steps: [
        'Open your command line terminal app and make sure your isolated cleanroom environment is active.',
        'Install the preferred internet connector tool by running: `pip install requests`.',
        'Boot up your interactive Python environment prompt line (>>>).',
        'Import the network tool by typing `import requests` and hit Enter.',
        'Send a safe, time-bounded request to a live endpoint: Type `r = requests.get("https://api.github.com", timeout=5)`.',
        'Verify the health score of the return stream by printing `r.status_code` and view the raw payload data dictionary using `print(r.json())`!'
      ], 
      goal: 'You successfully executed a live network handshake, protected the script with a timeout cushion, and translated an external web payload.' 
    },
    [
      q('What is the danger of running a standard `requests.get(url)` call without defining an explicit timeout value?', ['The code will run backwards','Python will wait forever if the server goes offline, freezing your program indefinitely','The server will charge you money for the connection','It deletes the local python cache'], 1, 'Without an explicit timeout property configuration, network operations can block your application thread forever if an external server drops packets silently.'),
      q('Which helper statement instantly turns web server error scores (like 404 or 500) into actionable application exceptions?', ['r.json()','r.raise_for_status()','r.status_code','r.headers()'], 1, 'The `raise_for_status()` method evaluates response status codes internally, throwing a clean catchable exception if the server returns a failure marker.'),
      q('How can you optimize performance when your application needs to make dozens of consecutive HTTP requests to the exact same host domain?', ['Re-import the requests module inside a loop','Initialize a persistent connection track using `requests.Session()`','Run the script on a faster operating system','Use string formatting to speed up the url'], 1, 'An active `Session()` instance enables connection pooling under the hood, recycling the same underlying TCP connection to skip costly handshake rituals on consecutive requests.'),
      q('Which modern library acts as an excellent drop-in alternative to `requests` while adding native async support?', ['flask','httpx','django','urllib3'], 1, 'The `httpx` package shares an identical semantic interface with classic requests while introducing asynchronous client workflows for non-blocking network applications.')
    ],
   ['Requests makes interacting with remote REST APIs trivial','Always define explicit timeout limits on network operations to prevent script freezing','Utilize Session objects to enable connection pooling benefits across multi-calls','Transition to httpx to implement asynchronous non-blocking connection streams']
  ),

  L('py-15', 15, 'Dates, Times & Timezones', '⏰',
    'Time is one of the most deceptively complex concepts in computer science. Between leap years, daylight saving time, and global timezones, handling dates manually is a nightmare. Python provides robust built-in tools to manage the flow of time safely!',
    [
      { 
        title: '1. The Time Machine (datetime)', 
        beginner: 'The `datetime` module is your main clock. You can ask Python for the exact current time by writing `datetime.now()`. It bundles the year, month, day, hour, minute, and second into one single, clean object!', 
        advanced: 'Never rely on local system time for structural backend logic. Always operate using UTC (Coordinated Universal Time) via `datetime.now(timezone.utc)` to prevent data corruption when servers migrate across geographic regions.' 
      },
      { 
        title: '2. Formatting Time (strftime & strptime)', 
        beginner: 'Computers read time differently than humans. Use `.strftime()` (String Format Time) to turn a computer date into a readable string like "Monday, January 5th". Use `.strptime()` (String Parse Time) to translate a human string back into computer data!', 
        advanced: 'Memorize the C-standard format codes. `%Y` yields a 4-digit year, while `%y` yields 2 digits. Improperly parsing localized date strings without explicitly declaring the locale format risks critical cross-platform parsing failures.' 
      },
      { 
        title: '3. Time Travel (timedelta)', 
        beginner: 'If you want to know what the date will be exactly 30 days from now, you can\'t just add +30 to a month (what if it rolls over to a new year?). Instead, you add a `timedelta(days=30)` object, and Python calculates the exact future calendar date perfectly!', 
        advanced: 'The `timedelta` object normalizes all inputs down to days, seconds, and microseconds exclusively under the hood. It fully supports native mathematical operators, allowing you to seamlessly add, subtract, or divide time periods.' 
      },
      { 
        title: '4. The Timezone Trap (zoneinfo)', 
        beginner: 'A time without a timezone is called "naive"—it\'s dangerous because nobody knows where in the world it belongs! Always make your times "aware" by attaching a timezone lock using Python\'s modern `zoneinfo` module, like `ZoneInfo("America/New_York")`.', 
        advanced: 'Python 3.9+ introduced `zoneinfo` natively, deprecating legacy third-party libraries like `pytz`. Always store timestamps in your database in raw UTC, and only cast them to local target `ZoneInfo` states at the very last second during frontend UI rendering.' 
      },
    ],
    { 
      title: 'The Global Flight Tracker', 
      intro: 'Let\'s build a time-travel script that calculates exactly when a flight will land in a completely different global timezone.', 
      steps: [
        'Open your interactive terminal prompt (>>>).',
        'Import the core time tools by typing: `from datetime import datetime, timedelta` and `from zoneinfo import ZoneInfo`.',
        'Lock down your current local departure time: Type `now = datetime.now(ZoneInfo("America/Los_Angeles"))`.',
        'Create a flight duration modifier: Type `flight_time = timedelta(hours=5, minutes=30)`.',
        'Add them together to calculate arrival: Type `landing_la = now + flight_time`.',
        'Instantly convert that landing time to the destination\'s local timezone: Type `landing_ny = landing_la.astimezone(ZoneInfo("America/New_York"))` and print it!'
      ], 
      goal: 'You successfully generated timezone-aware objects, performed safe calendar math, and translated temporal coordinates across global regions.' 
    },
    [
      q('Why is it highly recommended to save all database timestamps exclusively in UTC (Coordinated Universal Time)?', ['UTC takes up less hard drive storage space','UTC never changes for Daylight Saving Time, preventing massive data scheduling collisions','UTC automatically translates text into different languages','It is required by the HTTP network protocol'], 1, 'UTC provides a single, immutable anchor point for time. Local timezones shift constantly due to politics and daylight saving, causing overlapping scheduling bugs.'),
      q('Which string command allows you to parse a human-readable text sentence (like "2024-05-12") back into a functional Python datetime object?', ['strftime()','strptime()','timestamp()','isoformat()'], 1, 'The `strptime` (String Parse Time) method translates custom formatted string text back into a valid computational datetime object.'),
      q('What built-in object allows you to safely add exactly 14 days to a current date without breaking the calendar month?', ['A standard integer (+14)','A timedelta object','A math.ceil() function','A tuple array'], 1, 'The `timedelta` class represents a specific duration of time, automatically handling complex leap-year and month-rollover math when added to a datetime object.'),
      q('What is the modern, built-in Python module used to attach strict geographic timezone rules to a naive datetime object?', ['pytz','zoneinfo','os.time','sys.clock'], 1, 'Introduced natively in Python 3.9, the `zoneinfo` module hooks directly into the official IANA Time Zone Database to calculate precise regional timezone offsets.')
    ],
    ['Always store data in UTC; only convert to local timezones for UI viewing','Use strftime to format dates out to strings, and strptime to parse strings into dates','Use timedelta objects to perform safe calendar math without breaking month rollovers','Use the modern zoneinfo module to make naive datetime objects timezone-aware']
  ),

 L('py-16', 16, 'Regular Expressions', '🔎',
    'Regular Expressions (Regex) look like a chaotic mess of punctuation, but they are actually a highly efficient pattern-matching language. Think of regex like a high-tech metal detector calibrated to find specific hidden text targets—like emails, phone numbers, or dates—inside a mountain of messy raw documents!',
    [
      { 
        title: '1. Scanning Text (search vs match)', 
        beginner: 'Python provides different ways to look for patterns. The `re.match()` tool is strict—it only checks if your pattern sits at the absolute beginning of a sentence. If you want to scan and find a pattern hidden anywhere inside a massive paragraph, always use `re.search()` instead!', 
        advanced: 'When executing repetitive pattern matching routines across loop iterations, avoid inlining raw strings. Use `re.compile(pattern)` to compile your regex string into a reusable Regular Expression Object once, maximizing search execution speeds.' 
      },
      { 
        title: '2. Pattern Codes (Common Tokens)', 
        beginner: 'Regex uses clever secret codes called tokens. For example, `\\d` stands for any single digit number, `\\w` stands for any word letter, and a plus sign `+` means "look for one or more of these in a row". Wrapping your pattern inside raw text markers like `r"\\d+"` prevents formatting glitches!', 
        advanced: 'Always prepend regex pattern definitions with a raw string literal prefix (`r"..."`). This instructs Python\'s internal compiler to ignore standard string backslash escape behaviors, avoiding backslash escape hell when building complex character tokens.' 
      },
      { 
        title: '3. Isolating Targets (Groups & Capture)', 
        beginner: 'If you only want to extract a specific sub-chunk out of a long pattern match, wrap that specific part inside round parentheses `(...)`. This forms a capture group, allowing you to cleanly pull out just that isolated piece using `.group(1)`.', 
        advanced: 'Relying on standard numeric index offsets for group isolation quickly introduces structural fragility. Utilize named capture groups using the syntax `(?P<name>...)` to turn your patterns into self-documenting code with explicit dictionary keys.' 
      },
      { 
        title: '4. Dynamic Swapping (Substitution)', 
        beginner: 'If you need to find a messy text pattern and swap it out with something new, use the `re.sub()` command. It works just like a word processor\'s "Find and Replace" tool, but handles dynamic, complex patterns instead of simple exact text!', 
        advanced: 'The substitution method `re.sub(pattern, repl, string)` accepts a callable function as its replacement argument. This allows you to inspect each match object individually and compute replacement strings dynamically at runtime.' 
      },
    ],
    { 
      title: 'The Automated Email Extractor', 
      intro: 'Let\'s build a pattern scanner that instantly searches through a messy, unformatted text string and extracts all valid email addresses.', 
      steps: [
        'Open your interactive workspace and make sure the active Python prompt (>>>) is listening.',
        'Load the native regex scanning engine toolkit by typing: `import re` and hit Enter.',
        'Build a raw token pattern that matches words, an @ symbol, and domain extensions: Type `pattern = r"[\\w.]+@[\\w.]+"`.',
        'Create a messy text sentence string: Type `text = "ping me at contact@sage.com or support@learning.org".`',
        'Tell Python to sweep the text and gather all matching items into a list: Type `emails = re.findall(pattern, text)`.',
        'Print the `emails` variable to confirm that Python detected and extracted both hidden address records flawlessly!'
      ], 
      goal: 'You successfully compiled a token pattern and used it to sweep messy text strings for structured targets.' 
    },
    [
      q('Why should you always write regular expressions as raw string literals, like `r"\\d+"`?', ['It makes the final regex search run exactly twice as fast','It tells Python to ignore standard string backslash escapes, avoiding complex backslash nesting glitches','It automatically capitalizes all letters inside the matched text strings','It is required to print the results onto the console screen'], 1, 'The raw string `r` prefix stops Python from processing backslashes as typical text escape commands, keeping your token patterns clean and accurate.'),
      q('What is the difference between utilizing `re.match()` and `re.search()` in your text parsing code?', ['match() modifies text strings while search() only reads them','match() only checks the absolute beginning of a string, while search() scans the entire string text','search() is an outdated tool that has been fully replaced by match()','They execute the exact same scanning algorithm'], 1, '`re.match()` checks exclusively for patterns at the first character index slot, whereas `re.search()` scans the entire sequence path for matches.'),
      q('What does the special named group syntax `(?P<username>\\w+)` accomplish inside a pattern?', ['It locks down the string to prevent editing','It maps the captured text match directly to a descriptive, readable name key instead of a generic index number','It forces the pattern to match only capital letters','It loops the regex pattern indefinitely until an error occurs'], 1, 'Named groups use the `(?P<name>...)` flag to link matching text chunks directly to explicit string dictionary tracking keys.'),
      q('What is the major performance benefit of utilizing `re.compile()` on a pattern?', ['It shrinks your text file data footprint on disk','It processes and pre-bakes a pattern once so it can be reused across loops rapidly without re-parsing','It automatically fixes spelling mistakes inside your strings','It bypasses the need to import the re module'], 1, 'Pre-compiling patterns via `re.compile()` optimizes your regex logic up front, sparing your application from compiling the exact same pattern repeatedly inside loops.')
    ],
    ['Always prepend regex patterns with an r string token prefix','re.search sweeps full strings while re.match verifies starting indices','Use round capture groups to isolate specific segments from matching targets','Pre-compile regex objects using re.compile to maximize iteration speeds']
  ),

  L('py-17', 17, 'Concurrency: threading, async, multiprocessing', '⚙️',
    'Python provides three distinct ways to execute tasks concurrently. Choosing the wrong model can severely bottleneck your software—it comes down to understanding whether your code is waiting on the outside internet or heavy calculations!',
    [
      { 
        title: '1. The Gatekeeper (The GIL)', 
        beginner: 'Python uses a built-in safety lock called the Global Interpreter Lock (GIL). Think of it like a single master microphone in a kitchen—only one thread can speak or run code instructions at any given microsecond. This makes Python safe, but means standard threads can\'t speed up math calculations.', 
        advanced: 'The GIL prevents race conditions over Python\'s internal reference-counting memory. However, hardware execution threads are still highly useful for tracking I/O bottlenecks (like network requests or disk reading) because Python automatically releases the GIL lock while waiting for hardware responses.' 
      },
      { 
        title: '2. Kitchen Timers (asyncio)', 
        beginner: 'The `asyncio` framework uses a single thread that manages tasks using `async def` and `await`. Think of it like a single chef who sets a digital kitchen timer for a boiling pot, immediately steps away to chop vegetables, and returns only when a timer rings! It avoids wasting time standing still.', 
        advanced: 'The `asyncio` event loop achieves high concurrency via non-blocking OS multiplexing (like epoll or kqueue). Mixing synchronous, blocking libraries (like standard `time.sleep()` or `requests`) inside an async loop stops the entire system train—always use non-blocking equivalents.' 
      },
      { 
        title: '3. Multi-Tasking (threading)', 
        beginner: 'Standard threading spins up multiple workers inside your program. This is useful for older, traditional code that spends a lot of time waiting on slow data downloads or files, letting one worker sleep while another picks up the slack.', 
        advanced: 'Avoid instantiating raw, unmanaged `threading.Thread` instances manually. Utilize `concurrent.futures.ThreadPoolExecutor` to handle worker pools efficiently. For modern greenfield code bases, prefer native asynchronous structural design over multi-threading loops.' 
      },
      { 
        title: '4. Separate Kitchens (multiprocessing)', 
        beginner: 'If your computer needs to crunch massive calculations, render video frames, or process heavy math, standard threads won\'t help due to the lock. You must use `multiprocessing`! This clones your program into completely separate kitchens with their own chefs, smashing past the lock entirely!', 
        advanced: 'Each independent process spawns its own isolated operating system memory footprint and virtual interpreter instance. Use `ProcessPoolExecutor` paired with thread-safe `multiprocessing.Queue` instances to share data states across parallel CPU pipelines without memory corruption.' 
      },
    ],
    { 
      title: 'The Concurrent Web Scanner', 
      intro: 'Let\'s write an asynchronous, non-blocking networking pipeline that fires off multiple concurrent web checks simultaneously instead of waiting on them one by one.', 
      steps: [
        'Open your system terminal window and make sure your isolated runtime cleanroom is active.',
        'Install the asynchronous network utility tool by running: `pip install httpx`.',
        'Open a fresh, blank code file script workspace on your computer.',
        'At the top, import your asynchronous runtime engines: Type `import asyncio` and `import httpx`.',
        'Define a non-blocking web courier function by typing: `async def fetch(url):`.',
        'Inside, open an async client and await the request link: `async with httpx.AsyncClient() as c: return (await c.get(url)).status_code`.',
        'Bundle your concurrent tasks using `await asyncio.gather()` inside a core execution block, and fire up the loop engine using `asyncio.run(main())`!'
      ], 
      goal: 'You successfully launched non-blocking parallel workers to fetch external api data simultaneously.' 
    },
    [
      q('Which concurrency model must you use if your application is bottlenecked by heavy CPU math or video processing?', ['threading','multiprocessing','asyncio','A standard serial list comprehension'], 1, 'Multiprocessing spawns entirely separate system processes with separate execution contexts, successfully bypassing the GIL to scale across multiple CPU cores.'),
      q('What is the modern, highly preferred choice for handling thousands of concurrent web socket or API data connections?', ['multiprocessing','asyncio cooperative loops','Legacy sequential scripting','Re-routing inputs into global arrays'], 1, 'The asynchronous event loop architecture manages massive I/O bound network pipelines on a single thread with minimal system memory overhead.'),
      q('What exactly does Python\'s internal Global Interpreter Lock (GIL) prevent?', ['It stops files from saving down to disk','It prevents multiple system threads from executing Python code blocks simultaneously','It completely blocks internet connections','It causes loops to execute backwards'], 1, 'The GIL is a safety lock ensuring only a single thread processes Python bytecodes at any individual instant to keep internal memory allocation state-safe.'),
      q('What severe consequence happens if you import and run a synchronous blocking library inside an asynchronous loop block?', ['Python speeds up execution automatically','It freezes the entire event loop runner, stalling all other background tasks concurrently','It encrypts the output text fields','It deletes variable attributes from memory'], 1, 'Synchronous blocking commands lack cooperative await yields, monopolizing the single execution thread and preventing the background loop engine from managing other tasks.')
    ],
    ['The GIL limits Python code execution to a single thread at any one moment','Use asyncio to scale up network-heavy operations without wasting memory frames','Use multiprocessing to distribute calculation-heavy tasks across multiple CPU cores','Never mix blocking synchronous commands inside an active async event loop engine']
  ),

  L('py-18', 18, 'Testing with pytest', '🧪',
    'Untested code is broken code waiting to be discovered. Think of automated testing like a high-speed factory inspection rig—instead of clicking through your app manually to see if it works, you write small code checkers that verify your logic instantly!',
    [
      { 
        title: '1. Writing Simple Checkers (Basic Tests)', 
        beginner: 'To make testing easy, name your test files starting with `test_` and name your internal functions starting with `test_`. Inside them, use the standard `assert` keyword followed by a comparison check, like `assert add(2, 3) == 5`. If the math is true, the test passes green!', 
        advanced: 'Pytest utilizes advanced dynamic AST (Abstract Syntax Tree) assert rewriting under the hood. When a test fails, it intercepts the expression evaluation to output rich, detailed variable state inspections directly in your terminal, removing the need for legacy verbose assertions like `assertEqual()`.' 
      },
      { 
        title: '2. Setting Up the Stage (Fixtures)', 
        beginner: 'Sometimes a test needs mock data or a fake database to run cleanly. Adding the `@pytest.fixture` decorator above a function creates a setup wizard that automatically builds this environment right before the test starts, and cleans it up when done!', 
        advanced: 'Manage resource lifecycles explicitly using fixture scoping flags (`function`, `class`, `module`, or `session`). Utilize `yield` statements inside fixtures to separate clean object generation patterns from trailing environmental teardown logic blocks.' 
      },
      { 
        title: '3. Matrix Testing (@parametrize)', 
        beginner: 'Instead of copy-pasting the exact same test five times just to try out different input numbers, you can apply `@pytest.mark.parametrize`. This lets you pass a full table of different values into a single test function, running them all independently!', 
        advanced: 'Parametrization supports clean, data-driven testing pipelines by decoupled test scenarios from core validation logic. Pytest dynamically processes each tuple input row as a separate sub-test case, preventing a single row failure from blocking trailing scenario evaluations.' 
      },
      { 
        title: '4. Tracking Unchecked Lines (Code Coverage)', 
        beginner: 'How do you know what parts of your program haven\'t been tested yet? You run a code coverage scan tool. It checks your codebase as tests execute and prints a clean report showing exactly which lines of code were skipped or missed!', 
        advanced: 'Target a standard baseline code coverage metric of ~80%. Pushing aggressively for 100% code coverage introduces diminishing returns, frequently leading to fragile tests that validate trivial happy-path wrappers rather than targeting complex logical edge-cases.' 
      },
    ],
    { 
      title: 'Your First Pytest Suite', 
      intro: 'Let\'s install the official test framework runner and write a modular test suite that executes matrix inputs and outputs.', 
      steps: [
        'Open your command line terminal shell and ensure your isolated python development environment is active.',
        'Install the de-facto testing library across your framework layout by running: `pip install pytest`.',
        'Create a local test script file on your machine explicitly named: `test_math.py`.',
        'Inside that file, write a simple verification checker: `def test_sum(): assert 1 + 1 == 2`.',
        'Run the master suite check inside your terminal shell by simply typing: `pytest`. Watch it report a green passing check!',
        'Upgrade your file by adding a multi-case parameter table right above your function: `@pytest.mark.parametrize("a, b, expected", [(1, 2, 3), (2, 3, 5)])`. Run `pytest` again to watch it track multiple conditions!'
      ], 
      goal: 'You successfully initialized an automated testing harness, designed basic assertions, and integrated parametrized parameter tables.' 
    },
    [
      q('What file and function name prefix convention does pytest look for when running its automatic test discovery scanner?', ['It scans files starting with `spec_`','It scans files and internal functions starting explicitly with `test_`','It only parses scripts that contain loops','It reads files named config.json'], 1, 'Pytest is built around zero-boilerplate discovery conventions, parsing all module files and local functions prefixed with `test_`.'),
      q('What is the primary architectural purpose of utilizing a `@pytest.fixture` inside your test architecture layout?', ['It encrypts output strings to keep them secure','It provides structured, reusable data setup and environmental cleanup blocks across your test suites','It speeds up system iteration loops by bypassing errors','It automatically deletes empty files on disk'], 1, 'Fixtures are isolated context factories that configure dependencies and clean up environmental resources before and after test executions.'),
      q('How does applying the `@pytest.mark.parametrize` decorator benefit your code testing workflow efficiency?', ['It compresses final script code sizes into a binary bundle','It maps a single test function across an entire matrix array of variable test inputs, eliminating repetitive copy-pasting','It prevents user errors from showing up inside terminals','It formats the code structure to follow standard guidelines'], 1, 'Parametrization feeds structural arrays of input data cases through a single test shell uniformly, executing each case as an independent sub-test tracking marker.'),
      q('Does achieving 100% test line code coverage guarantee that your application is completely bug-free?', ['Yes, it proves mathematically that no logic bugs exist','No, it simply tracks that every line was executed during testing, but does not guarantee edge-case accuracy or faultless behavior','It means your application is fully connected to the cloud','It means your functions are completely immutable'], 1, 'Coverage metrics map structural line execution paths rather than logical verification integrity; 100% line coverage can still mask deep hidden edge-case logic bugs.')
    ],
    ['Pytest automatically scans your project tree for files and functions starting with test_','Use standard python assert expressions for clear native failure reports','Leverage fixtures to establish reliable and repeatable application setup environments','Apply test parametrization to cycle multiple data scenarios through single assertions without duplication']
  ),

  L('py-19', 19, 'Web Scraping & Automation', '🤖',
    'When a public website does not offer a clean data API channel, you can extract its contents using web scraping. Think of scraping like building a custom robot that automatically skims through online text, fills out forms, or downloads target information for you!',
    [
      { 
        title: '1. Internet Etiquette (Ethics & robots.txt)', 
        beginner: 'Before scraping a website, always read its house rules! Checking a site\'s `targetsite.com/robots.txt` file tells you exactly which pages your code is allowed to look at. Never hammer a server with thousands of rapid requests—treat websites with respect!', 
        advanced: 'Enforce strict programmatic rate-limiting parameters (e.g., introducing a `time.sleep(1)` interval between sequential handshakes) and cache downloaded source nodes aggressively. Always prioritize a platform\'s formal API distribution channel over web scraping whenever it exists.' 
      },
      { 
        title: '2. Parsing Static Pages (BeautifulSoup)', 
        beginner: 'If a webpage displays its text immediately without loading complex background animations, it is static. You can fetch its code using `requests` and feed it into a tool called `BeautifulSoup` to easily sort, search, and slice out data by its HTML tags or text classes!', 
        advanced: 'BeautifulSoup breaks raw structural HTML strings down into a navigatible node element tree hierarchy. However, it lacks an integrated JavaScript execution compilation engine; if a target web interface relies on dynamic framework rendering, simple markup string parsers will fail.' 
      },
      { 
        title: '3. Browser Driving (Modern Playwright)', 
        beginner: 'Many modern websites use heavy JavaScript that only reveals text after you click buttons, scroll down, or pass security checks. To extract data from these dynamic pages, use a modern headless browser tool called `Playwright` to simulate a real human explorer!', 
        advanced: 'Avoid using unoptimized implicit wait calls like `time.sleep()`. Implement strict event-driven scripting by utilizing dynamic locator hooks like `page.wait_for_selector()` and prefer modern text-based target queries over brittle, tightly coupled CSS layout selectors.' 
      },
      { 
        title: '4. Automated Tasks (Scheduling)', 
        beginner: 'Once your scraper works perfectly, you can set it up to run on a set schedule automatically! You can use your computer\'s built-in scheduler tool to run your script every morning at 8:00 AM without ever clicking a button yourself.', 
        advanced: 'To deploy script execution tasks without maintaining live physical host hardware partitions, delegate operational triggers out to serverless pipeline execution architectures. Leverage GitHub Actions cron schedules or cloud provider event hooks to automate processing pipelines effortlessly.' 
      },
    ],
    { 
      title: 'The News Headline Extraction Factory', 
      intro: 'Let\'s build a production-grade data extractor script that automatically targets a static informational webpage and slices out all article headlines.', 
      steps: [
        'Open your command line terminal shell screen and confirm your isolated virtual runtime environment is active.',
        'Install your static web parsing tools by executing: `pip install requests beautifulsoup4`.',
        'Boot up your interactive Python interpreter command line prompt (>>>).',
        'Load your network connector and parsing engine toolkits: Type `import requests` and `from bs4 import BeautifulSoup`.',
        'Fetch the raw HTML structural code blueprint of your target text page: Type `html = requests.get("https://news.ycombinator.com").text`.',
        'Convert that raw string into a searchable node tree mapping: Type `soup = BeautifulSoup(html, "html.parser")`.',
        'Execute a search query across the tree to isolate and strip title strings: Run `print([h.text.strip() for h in soup.select(".titleline")])`!'
      ], 
      goal: 'You successfully requested a remote web page, generated a structured element node tree, and parsed explicit elements.' 
    },
    [
      q('What is the absolute first step a ethical developer should take before scraping a public website data stream?', ['Change their network settings to hide their computer location','Check the site\'s rules and constraints by visiting its `/robots.txt` path and configure respectful execution rates','Write an infinite loop to download the entire system database as fast as possible','Delete historical browser cache files'], 1, 'The `/robots.txt` file represents the official compliance boundary declaration map for scrapers, listing explicitly which directories can be safely processed.'),
      q('Which software package must you deploy if a target web platform uses heavy JavaScript frameworks to dynamically load text?', ['A simple raw text markup tracker like BeautifulSoup alone','A full-browser engine automation framework like Playwright or Selenium','A standard mathematical looping expression','An encryption algorithm modifier'], 1, 'Dynamic modern single-page applications run complex compilation routines inside live browsers; programmatic driving suites like Playwright instantiate automated layout layers to capture these states.'),
      q('When writing advanced automation loops, why is it highly recommended to use `page.wait_for_selector()` instead of `time.sleep(5)`?', ['Using wait_for_selector makes the program use twice as much memory','It stops waiting the exact millisecond the item appears, maximizing efficiency and eliminating fragile timing errors','It forces the website to respond faster than normal','It is required to run code on cloud servers'], 1, 'Dynamic event-driven listener targets intercept page states intelligently, preventing your loops from executing too early or idling needlessly after page renders finish.'),
      q('What tool serves as the industry standard for parsing simple static HTML content text blocks in the Python ecosystem?', ['The global regex library module','The BeautifulSoup document parsing utility','The native system file tracking framework','The raw string slicing syntax'], 1, 'BeautifulSoup is the gold standard for navigating structural markup trees, letting you search elements across simple document structures quickly without regex expressions.')
    ],
    ['Always audit a platform\'s robots.txt rules and enforce rate-limiting metrics to preserve ethics','Combine requests with BeautifulSoup to efficiently pull raw records from static page markups','Leverage Playwright automation clients to simulate browser behaviors on heavy dynamic JavaScript apps','Deploy automation scripts to serverless cloud triggers to bypass local hardware maintenance requirements']
  ),
  
  L('py-20', 20, 'Capstone: Build a CLI Tool', '🏆',
    'Real-world Python software doesn\'t just sit hidden inside editor windows—it ships to users as fully operational terminal commands! Think of this final capstone project like assembling a real-world power tool: combining blueprints, user handles, and packaging rules to distribute your code globally.',
    [
      { 
        title: '1. Blueprint Blueprints (Project Structure)', 
        beginner: 'To share a tool professionally, organize your code files inside a dedicated folder structure. Place your active code files inside an inner application directory and keep your test suite scripts sitting in an independent folder alongside it.', 
        advanced: 'Implement the standardized modern `src/` layout pattern to prevent accidental local import shadow bugs during testing. Utilize a unified `pyproject.toml` configuration file as the single, modern source of truth manifest for package declarations.' 
      },
      { 
        title: '2. The Tool Handle (argparse / typer)', 
        beginner: 'A Command Line Interface (CLI) tool needs a clean handle so users can toggle settings! While Python includes a built-in input framework called `argparse`, modern developers love an external library called `typer` that automatically transforms regular variable annotations into beautiful terminal control screens.', 
        advanced: 'For intricate CLI designs scaling past 5 unique sub-commands, the `typer` library (built on top of `click`) drastically reduces implementation bloat. It auto-generates deep interactive `--help` utility screens natively derived from your source documentation docstrings.' 
      },
      { 
        title: '3. Universal Power Plugs (Entry Points)', 
        beginner: 'Instead of forcing users to type long, clunky commands like `python3 path/to/my/internal_script.py`, you can wire up an internal shortcut registry! This links your python logic straight to a short, custom binary name, allowing anyone to run your application by simply typing its nickname.', 
        advanced: 'Define explicit `console_scripts` entry coordinates inside your `pyproject.toml` build configurations. This maps terminal commands straight to internal script entry callables, enabling package installation utilities like `pipx` to cleanly provision globally sandboxed binaries.' 
      },
      { 
        title: '4. Shipping to the Showroom (Publishing)', 
        beginner: 'Once your tool is completely finished, you can publish it straight to the official global Python Package Index (PyPI) warehouse! Once uploaded, any developer anywhere on Earth can download and install your custom program instantly by simply running `pip install your-tool`!', 
        advanced: 'Always test your builds by pushing releases to the isolated TestPyPI warehouse staging site using `twine` before finalizing public updates. Tag package iterations using SemVer compliance standards and integrate secure OpenID Connect (OIDC) trusted publishing tokens.' 
      },
    ],
    { 
      title: 'Building "wc-clone"', 
      intro: 'Let\'s compile your full stack of Python fundamentals to build, test, and locally install a fully custom system file-analysis binary tool.', 
      steps: [
        'Open your command line terminal interface and ensure your project cleanroom path is active.',
        'Create a core project manifest configuration file inside your project root exactly named: `pyproject.toml`.',
        'Add structural package metadata headers to that file and declare a custom binary command pointer inside an `[project.scripts]` block.',
        'Create an internal application engine script named `cli.py` that processes incoming target file paths.',
        'Write logical expressions to open target text documents safely, count total lines, isolate separate words, and compute string character weights.',
        'Run the local editable install flag command in your terminal shell: `pip install -e .`.',
        'Execute your brand new global system binary from anywhere on your computer by typing: `wcclone target_document.txt`!'
      ], 
      goal: 'You successfully synthesized advanced project architectures, built a functional CLI parser, and deployed a local system binary.' 
    },
    [
      q('Which modern configuration manifest file serves as the official single source of truth for modern Python packaging layouts?', ['setup.py','pyproject.toml','Makefile','requirements.txt'], 1, 'The `pyproject.toml` file is the unified standard for managing environment definitions, package metadata, and compiler tool configurations.'),
      q('Which popular library leverages standard python type hints to auto-generate beautiful terminal control screens and help readouts?', ['argparse','typer','sys','os'], 1, 'The `typer` library translates native python function arguments and standard type annotations into fully responsive CLI commands automatically.'),
      q('What utility should end-users run to download and install a Python command-line application into a globally isolated system path safely?', ['pip install','pipx install','npm global run','brew install system'], 1, 'The `pipx` manager isolates application tools inside independent virtual execution slots while simultaneously linking their binaries to your global system path.'),
      q('Where should you upload your compiled wheel package archives to verify installation pathways safely before public open-source deployment?', ['Push straight to main GitHub branches','Upload directly to the TestPyPI staging network repository','Email code zip files to team members','Publish it to the live production PyPI marketplace instantly'], 1, 'The TestPyPI system provides a complete sandboxed testing mirror environment, enabling developers to confirm distribution packaging settings risk-free.')
    ],
    ['Modern frameworks use the src/ directory layout paired with pyproject.toml manifests','The typer framework streamlines terminal engine design through automatic type parsing','Configuring entry points creates direct operational terminal binary hooks for scripts','Use TestPyPI and twine pipelines to safely validate framework releases before global shipment']
  ),

  L(
    'py-21', 21, 'Type Hints & Static Typing', '🏷️', 'Python is famous for being wonderfully dynamic, but as your applications scale into thousands of lines of code, that freedom turns into a liability. When a function expects a dictionary but accidentally receives a string, production servers crash. Static typing adds an optional, powerful safety harness to your architecture, allowing tools to catch fatal bugs while you are typing, long before the code ever actually runs.',
    [
      { title: '1. Type Annotations & Optional', beginner: 'Think of type hints as sticky notes you attach to your variables and function parameters saying, "I expect an integer here." It doesn\'t force Python to stop if you break the rule, but it allows your code editor to draw a red squiggly line under mistakes. If a value might sometimes be empty, you use the `Optional` type so the system knows to expect it.', advanced: 'In enterprise Python, `typing.Optional` (or the modern `| None` syntax) is critical. It forces developers to explicitly handle `None` cases, virtually eliminating the dreaded "NoneType object has no attribute..." runtime exception that plagues dynamic data pipelines.' },
      { title: '2. Union & Literal Types', beginner: 'Sometimes a variable needs to be flexible but still protected. A `Union` lets you say "This can be a string OR a number, but absolutely nothing else." A `Literal` is even stricter: it says "This variable can only hold the exact word \'GET\' or \'POST\'."', advanced: '`Union` and `Literal` types enable static analyzers to perform "exhaustive checking." This means if you write a system that processes 3 specific Literal string commands, the type checker will throw an error if you forget to write an `if/elif` block for one of those exact scenarios.' },
      { title: '3. TypedDict & Protocols', beginner: 'Standard dictionaries are like wildcards—you can put any key inside them. A `TypedDict` forces a dictionary to always have specific keys, like a rigid template. `Protocols` are a way of saying, "I don\'t care what kind of object this is, as long as it has a `.save()` method attached to it!"', advanced: 'Protocols implement formal "structural subtyping" (Duck Typing) at the static analysis level. This allows for brilliant decoupling in massive architectures; modules can interact through verified behavioral contracts without needing to inherit from heavily coupled Base Classes.' },
      { title: '4. The Type-Safe Workflow', beginner: 'Adding type hints is only half the battle. To actually catch bugs, developers run a tool called `mypy` in their terminal. It acts as an incredibly strict, automated spell-checker for your code\'s logic, pointing out exactly where data types are clashing before you ship your app.', advanced: 'Modern professional workflows integrate `mypy --strict` or Microsoft\'s `pyright` directly into CI/CD pipelines. This ensures that no pull request can be merged into the main branch unless the entire application passes rigorous mathematical proofs of type safety.' }
    ],
    {
      title: 'Strongly Typed Task CLI',
      intro: 'We are going to build a completely type-safe task management script where every function boundary is rigorously protected by type annotations.',
      steps: [
        'Import `TypedDict`, `Literal`, and `Optional` from the standard `typing` module.',
        'Define a `Task` TypedDict that requires a string "title", an integer "id", and a Literal "status" (either "pending" or "done").',
        'Write a core function `add_task(task_list: list[Task], new_title: str) -> Optional[Task]:` that securely appends new data.',
        'Intentionally write a bug where you pass an integer as a title, run `mypy script.py` in your terminal, and watch it catch the error for you.'
      ],
      goal: 'You successfully transitioned from writing dynamic, unpredictable scripts to authoring mathematically provable, enterprise-grade type-safe Python architectures.'
    },
    [
      q('Which of the following syntax patterns represents the modern, preferred way to declare a variable that can be either an integer or None in Python 3.10+?', ['int | None', 'Optional[int]', 'Union[int, None]', 'Either[int, None]'], 0, 'While Optional[int] and Union[int, None] remain fully backward-compatible, Python 3.10 introduced the cleaner pipe (|) syntax as the modern, readable standard.'),
      q('If a variable is typed as Literal["read", "write"], what does a static type checker do if you attempt to assign the string "append" to it?', ['It ignores it because "append" is also a string.', 'It raises a static type-checking error because "append" does not match the allowed literal values.', 'It automatically updates the type definition to include "append".', 'It crashes the Python interpreter at runtime.'], 1, 'Literal types restrict a variable to precise, explicit values. Assigning anything outside that exact literal set triggers a static validation error, catching logic flaws before deployment.'),
      q('How does structural subtyping (Protocols) differ from traditional class inheritance chains in Python?', ['It requires explicit subclassing of a shared base class.', 'It evaluates objects entirely on their structure and behaviors (methods) rather than their explicit class hierarchy.', 'It converts dictionary objects into rigid runtime classes.', 'It disables dynamic duck typing completely.'], 1, 'Protocols implement compile-time duck typing. They verify that an object possesses the required methods or attributes without forcing modules to inherit from a heavily coupled base class.'),
      q('What role does a tool like mypy or pyright play in an enterprise Python workflow?', ['It optimizes runtime performance by compiling python code down to native machine C code.', 'It acts as an external static analysis engine that validates code for type violations prior to execution.', 'It automatically strips type annotations from production modules to save space.', 'It manages third-party package dependencies and virtual environments.'], 1, 'Mypy and pyright serve as static type checkers. They scan source files to identify type conflicts and edge-case errors before the code is ever deployed or run.')
    ],
    [
      'Type hints act as an optional safety harness, allowing static tools to catch logic flaws early without altering standard Python runtime speeds.',
      'Modern workflows leverage the concise pipe operator (Type | None) for clean, unambiguous multi-type and optional variable definitions.',
      'TypedDict enforces structural schemas on dictionaries, while Protocols bring formal verification to traditional dynamic duck typing.',
      'Integrating linters like mypy into CI/CD pipelines guarantees automated, mathematical type safety before code can merge into production.'
    ]
  ),

  L(
    'py-22', 22, 'Advanced Functions & Functional Programming', '⚙️', 'In standard programming, functions are just lists of instructions. In Functional Programming, functions are treated like physical objects—you can pass them around, modify them, and even write functions that generate brand new functions on the fly. Mastering this paradigm results in code that is incredibly modular and heavily tested.',
    [
      { title: '1. Higher-Order Functions', beginner: 'A "Higher-Order Function" is a function that either accepts another function as an argument, or spits out a new function as its return value. Imagine a factory machine whose only job is to build and customize smaller machines based on your exact specifications.', advanced: 'This functional pattern enables advanced "strategy injection," where core processing logic is passed into a function dynamically at runtime. This completely eliminates hardcoded conditional chains and makes unit testing significantly easier by allowing you to inject mock strategies.' },
      { title: '2. Closures & State Storage', beginner: 'When a function is created inside another function, it remembers the variables from the outside function—even after the outside function has finished running! This "memory bubble" is called a Closure, and it’s a brilliant way to save data without having to build an entire Class object.', advanced: 'Closures capture and encapsulate their lexical scope. They are the ideal, lightweight mechanism for maintaining internal state, configuration parameters, or caching data without the massive architectural overhead of instantiating standard Object-Oriented classes.' },
      { title: '3. Decorators as Architecture', beginner: 'A decorator (written with the `@` symbol) is just a function that wraps around another function to give it superpower upgrades. Without changing the original function\'s code, a decorator can automatically measure how long it takes to run, or check if the user is logged in before letting it execute.', advanced: 'Decorators elegantly handle "cross-cutting concerns"—code that needs to exist everywhere (like logging, authentication, or retry logic) but shouldn\'t pollute your core business logic. They dynamically intercept, modify, and route function calls at the module loading phase.' },
      { title: '4. Functools & Memoization', beginner: 'Sometimes a function does really heavy math. The `functools` library provides a magical decorator called `@lru_cache`. If you call a function twice with the same exact numbers, this cache remembers the first answer and spits it out instantly the second time, skipping the math entirely.', advanced: 'Memoization through `lru_cache` fundamentally alters the algorithmic time complexity profile of your application. It seamlessly transforms highly expensive, exponential recursive calls into lightning-fast $O(1)$ memory dictionary lookups.' }
    ],
    {
      title: 'Dynamic Decorator Plugin System',
      intro: 'We are going to construct a professional plugin architecture where custom functions automatically register themselves into a global framework simply by using a custom decorator.',
      steps: [
        'Create a global dictionary named `PLUGINS = {}` to act as your central registry.',
        'Write a higher-order function named `register_plugin(name)` that returns a wrapper decorator.',
        'Inside the wrapper, save the incoming function into the `PLUGINS` dictionary using the provided name.',
        'Create three different text-processing functions and decorate them with `@register_plugin("plugin_name")`.',
        'Write a master runner loop that iterates through the `PLUGINS` dictionary and executes all registered tools dynamically.'
      ],
      goal: 'You successfully built a highly decoupled, scalable plugin registry utilizing higher-order functions, closures, and custom decorators.'
    },
    [
      q('What is the defining characteristic of a Python "Closure"?', ['A function that immediately deletes global variables after running', 'A dynamically generated function that remembers and retains access to variables from its original enclosing scope', 'A mandatory method inside an Object-Oriented base class', 'A function that prevents any other code from executing'], 1, 'A closure effectively "closes over" its creation environment, capturing the state of surrounding variables so they can be used securely later on.'),
      q('How does the `@functools.lru_cache` decorator drastically improve application performance?', ['It actively compresses function code to reduce file size', 'It saves the output of expensive function calls to memory, returning the saved result instantly on subsequent identical calls', 'It encrypts function output to prevent memory leaks', 'It multithreads the function across CPU cores automatically'], 1, 'LRU Cache implements memoization, bypassing the execution logic entirely if the specific input parameters have been processed recently.'),
      q('What is the primary architectural advantage of utilizing a custom decorator for a plugin system?', ['It strictly enforces all functions to share the exact same variable names', 'It beautifully isolates the core business logic from the structural registration mechanics', 'It makes the application run significantly slower for security reasons', 'It requires writing substantially more boilerplate code'], 1, 'Decorators keep the actual function definitions completely clean, abstracting the complex registration and metadata storage logic away into the wrapper.'),
      q('Which built-in Python module provides advanced utilities for functional programming concepts like partial application and caching?', ['os', 'functools', 'sys', 'math'], 1, 'The `functools` module is the standard library hub for higher-order functions and operations that manipulate callable objects.')
    ],
    ['Utilize closures to maintain secure, lightweight state without the heavy overhead of instantiating full classes.', 'Apply custom decorators to beautifully isolate cross-cutting concerns like logging, timing, and security checks.', 'Leverage built-in memoization to effortlessly optimize highly repetitive, mathematically expensive function calls.', 'Treat functions as first-class modular objects to build deeply flexible and dynamic application architectures.']
  ),

  L(
    'py-23', 23, 'Iterators, Generators & Lazy Evaluation', '⏳', 'When processing massive datasets—like a 50-Gigabyte server log file—trying to load everything into a standard Python list will instantly consume all your RAM and crash your computer. "Lazy Evaluation" is the professional solution: processing massive mountains of data one single piece at a time, keeping your application incredibly light and lightning-fast.',
    [
      { title: '1. The Iterable Protocol', beginner: 'An "Iterable" is simply any object that you can loop over, like a standard list, a string, or a dictionary. Under the hood, Python checks if the object possesses a hidden `__iter__` method, which acts as the secret instruction manual for how to hand out its items.', advanced: 'Implementing the `__iter__` dunder method returns an Iterator object. This specific mechanism forms the absolute foundation of Python\'s sequence unpacking, standard `for` loops, and sophisticated generator data pipelines.' },
      { title: '2. The Stateful Iterator', beginner: 'While an Iterable is the actual collection of data, an "Iterator" is the little internal bookmark that remembers exactly where you currently are inside the loop. It uses a method called `__next__` to fetch the next item in line until it completely runs out.', advanced: 'Iterators are strictly stateful objects. Once they are fully exhausted, calling `__next__` intentionally raises a `StopIteration` exception. Python\'s native loops silently catch this specific exception to know exactly when to gracefully terminate the cycle.' },
      { title: '3. Generators & Yield', beginner: 'Instead of building a massive list all at once and returning it, a "Generator" is a special function that uses the `yield` keyword. It hands you exactly one item, pauses its own execution, and patiently waits in standby mode until you ask for the next piece.', advanced: 'Generators seamlessly maintain their local state, variables, and instruction pointers automatically between successive calls. They act as highly efficient coroutines, allowing you to construct robust, memory-safe data processing pipelines with minimal boilerplate.' },
      { title: '4. Streaming Data Pipelines', beginner: 'You can actually connect multiple generators together exactly like physical plumbing pipes! One pipe lazily reads data from a file, the next pipe filters out bad data, and the final pipe analyzes the results—all without ever holding the full file in memory.', advanced: 'By chaining generator expressions sequentially, you construct elegant "lazy pipelines" that perfectly mimic Unix shell pipes. This is the absolute optimal architectural pattern for processing multi-gigabyte log files, infinite network streams, or massive database queries.' }
    ],
    {
      title: 'Infinite Streaming Log Analyzer',
      intro: 'We will construct a highly memory-efficient, multi-stage generator pipeline capable of analyzing an infinitely large server log file line-by-line without ever crashing the system memory.',
      steps: [
        'Write a base generator function `read_logs(file)` that opens a text file and `yields` one line at a time.',
        'Write a second generator `filter_errors(lines)` that takes an iterator as input and only yields lines containing the word "CRITICAL".',
        'Write a third generator `extract_timestamp(errors)` that parses out the date from the error strings.',
        'Chain them together: pass the output of the reader directly into the filter, and the filter into the extractor.',
        'Run a basic `for` loop over the final pipeline, proving that the data is flowing lazily from start to finish.'
      ],
      goal: 'You successfully engineered a multi-stage lazy evaluation pipeline capable of chewing through infinitely massive datasets using almost zero system memory.'
    },
    [
      q('What internal exception does an Iterator explicitly raise when it has absolutely no more items left to dispense?', ['EndException', 'StopIteration', 'EmptyError', 'IndexError'], 1, 'Python internally and deliberately uses the StopIteration exception as the standard signal that an iterator is fully exhausted and the loop should terminate.'),
      q('What is the core architectural difference between an Iterable and an Iterator in Python?', ['An Iterable is the actual data collection, while the Iterator is the stateful mechanism tracking the exact current position during a loop', 'They are fundamentally the exact same thing used interchangeably', 'An Iterable strictly uses the yield keyword, while an Iterator uses the return keyword', 'An Iterator is always a standard Python list under the hood'], 0, 'The Iterable provides the raw data structure, while the Iterator manages the internal state pointer as you progress through that data.'),
      q('Why are generators infinitely superior to standard lists for processing multi-gigabyte datasets?', ['They run approximately 10x faster on standard CPU architecture', 'They evaluate data lazily one item at a time, consuming virtually zero system memory overhead', 'They automatically serialize and save data directly to a connected SQL database', 'They natively encrypt the dataset to prevent security breaches'], 1, 'Generators yield data completely on demand, avoiding the fatal memory allocations required to load an entire massive sequence upfront.'),
      q('How do you construct a highly efficient, lazy data pipeline in modern Python?', ['By appending massive lists together continuously', 'By chaining multiple generators together where one yields data sequentially into the next', 'By utilizing the built-in zip() function exclusively', 'By importing the heavy third-party pipeline module'], 1, 'Generator pipelines pass yielded items sequentially through multiple distinct layers of processing, perfectly mimicking the behavior of robust Unix terminal pipes.')
    ],
    ['Implement the __iter__ method to elevate your custom objects into native Python loopable structures.', 'Leverage the yield keyword to create incredibly memory-efficient generator coroutines.', 'Chain multiple generators together to engineer robust, lazy processing pipelines for massive datasets.', 'Always prioritize lazy evaluation over upfront list memory allocation when building enterprise data architecture.']
  ),

  L(
    'py-24', 24, 'Context Managers & Resource Management', '🔌', 'In software engineering, every file you open, database connection you create, or network socket you spin up utilizes finite operating system handles. If your program fails to close them—often due to an unexpected crash or exception—those resources leak, causing servers to freeze and applications to run out of memory. Context managers provide a bulletproof structural pattern that guarantees resource allocation and deterministic cleanup, ensuring your applications remain stable under high enterprise workloads.',
    [
      { title: '1. The With Statement & RAII', beginner: 'Imagine checking out a highly valuable reference book from a library. If you forget to return it, nobody else can use it. The `with` statement in Python acts like an automated librarian. It hands you the book, lets you read it inside a secure study room, and the literal split-second you leave that room, it grabs the book out of your hands and safely returns it to the shelf, even if you tripped and fell flat on your face while reading.', advanced: 'This follows the classic RAII (Resource Acquisition Is Initialization) pattern. By utilizing `with`, Python guarantees that resource teardown occurs deterministically. It wraps the execution block in an internal `try/finally` structure at the bytecode level, ensuring that cleanup routines run even if the block throws catastrophic runtime exceptions or executes a direct return statement.' },
      { title: '2. The Dunder Protocols', beginner: 'To turn an ordinary Python class into a smart context manager, you must give it two secret dunder methods: `__enter__` and `__exit__`. Think of `__enter__` as a specialized doorman who sets up a clean event room and hands you the microphone. Think of `__exit__` as the cleaning crew that sweeps the floors, locks the doors, and turns off the lights when the event is over.', advanced: 'The `__enter__` method sets up the target resource and returns the target value for the `as` clause. The `__exit__` method takes three precise arguments representing an unhandled exception: `exc_type`, `exc_val`, and `exc_tb`. If an exception occurred within the block, `__exit__` can inspect it, clean up resources, and return a strict Boolean value of `True` to completely swallow the error, or `False` to let it propagate up the stack.' },
      { title: '3. Contextlib Utilities', beginner: 'Writing full classes with custom dunder methods can sometimes feel like too much work for basic tasks. The built-in `contextlib` library provides a shortcut decorator called `@contextmanager`. It allows you to convert a simple generator function that uses a single `yield` statement into a fully functional, production-ready context manager.', advanced: 'The `contextlib` module contains critical utilities for advanced production architectures. For instance, `contextlib.suppress` cleanly swallows expected operational exceptions, while `contextlib.ExitStack` allows developers to dynamically manage an arbitrary, variable number of nested context resources simultaneously, completely eliminating deep, unreadable pyramid indentations.' },
      { title: '4. Advanced Exception Trapping', beginner: 'Inside a context manager, you can write defensive rules that look at mistakes happening during execution. If a minor error happens, your cleanup crew can quietly fix the problem, sweep it under the rug, and let the rest of your main program keep running smoothly without crashing.', advanced: 'Advanced usage involves using context managers to build atomic transactional states. If an error occurs midway through data manipulation, `__exit__` intercepts the exception, executes a structural rollback to return the system to its last known healthy state, and then flags the anomaly for logging aggregates without destabilizing the hosting process.' }
    ],
    {
      title: 'Safe Database Transaction Manager',
      intro: 'We are going to architect a robust, production-ready mock SQL database engine that utilizes custom context managers to enforce strict atomic transaction compliance and rollback behaviors.',
      steps: [
        'Create a mock database class that holds a dictionary of critical account balances.',
        'Implement an explicit `__enter__` method that creates a complete, isolated memory backup copy of the database state before modifications begin.',
        'Implement an explicit `__exit__` method with complete exception handling signatures.',
        'Inside `__exit__`, write logic stating that if an error occurred, completely discard the corrupted working changes and restore the pristine memory backup (Rollback).',
        'If no error occurred, confidently save the working changes permanently (Commit).',
        'Test your class by running a transaction that fails halfway through due to a simulated network failure, and verify your database states remain perfectly uncorrupted.'
      ],
      goal: 'You successfully engineered a bulletproof atomic transaction manager utilizing the low-level mechanics of the context manager protocols.'
    },
    [
      q('What happens if an unhandled exception occurs inside a standard `with` statement block in Python?', ['The program ignores the error and continues executing line by line', 'The context manager immediately calls `__exit__` to clean up resources, then allows the exception to bubble up standard runtime channels', 'The operating system forcefully terminates the entire script without cleanup', 'The `__enter__` method is automatically re-run to fix the error'], 1, 'Even during catastrophic block failures, Python guarantees that the `__exit__` method is safely executed to prevent system resource leakage before propagating the error.'),
      q('What precise value must the `__exit__` method return if you want to cleanly suppress and hide an exception that occurred inside its block?', ['The integer `0`', 'The Boolean value `True`', 'The string `"success"`', 'The object reference `None`'], 1, 'Returning `True` explicitly flags Python to swallow the captured exception, preventing it from halting the rest of the application ecosystem.'),
      q('Which utility from the standard `contextlib` module is designed to gracefully handle a highly dynamic, variable list of opened resources without nested loops?', ['contextlib.suppress', 'contextlib.ExitStack', 'contextlib.redirect_stdout', 'contextlib.closing'], 1, '`ExitStack` lets you programmatically enter a dynamic list of context managers and guarantees they are all cleaned up in reverse order when the stack exits.'),
      q('What arguments are passed into the `__exit__` method when an execution block finishes running flawlessly?', ['No arguments are passed', 'Three references to the original object instantiation states', 'Three `None` values representing the lack of an active exception', 'A dictionary containing the local scope variables'], 2, 'If no exception occurs, `exc_type`, `exc_val`, and `exc_tb` are all passed explicitly as `None` to indicate a clean exit.')
    ],
    ['Always utilize with statements for file system handles, network sockets, and database clients to eliminate resource leaks.', 'Implement custom context managers to cleanly wrap setup and teardown boilerplate across distributed microservices.', 'Leverage contextlib.ExitStack when managing highly complex, multi-layered resource initialization trees.', 'Understand the triple exception signature of __exit__ to build bulletproof transactional rollback mechanisms.']
  ),

  L(
    'py-24', 25, 'Python Memory Model & Performance', '🧠', 'Python handles memory automatically using a built-in garbage collector, which tricks developers into thinking memory optimization is irrelevant. In reality, large applications frequently experience heavy performance degradation due to massive memory bloating, hidden object references, and CPU cache misses. By mastering Python’s internal allocation model, object referencing, and profiling systems, you can pinpoint exactly which lines of code are draining system resources and optimize them for high-throughput production environments.',
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
        'Import the standard `sys`, `timeit`, and `cProfile` modules into a script.',
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
    'py-26', 26, 'Advanced Object-Oriented Python', '🏛️', 'Object-Oriented Programming in Python goes infinitely deeper than just writing classes and inheritance. To build frameworks that are truly elegant, you must master meta-programming tools that intercept and manipulate class creation itself. By controlling the Method Resolution Order, creating abstract guardrails, and managing class metadata with descriptors and metaclasses, you can transition from someone who merely consumes tools to an architect who builds major library frameworks.',
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
    'py-27', 27, 'Databases with Python', '🗄️', 'An application is only as powerful as its ability to safely store, query, and manipulate data. Writing data to loose text files eventually corrupts under concurrent load. Production applications rely on relational and non-relational database management systems. Moving beyond raw SQL strings, professional Python engineers utilize Object-Relational Mappings (ORMs) and connection pools to write highly maintainable, optimized, and scalable data-access layers.',
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
        'Install SQLAlchemy via your terminal using `pip install sqlalchemy`.',
        'Import `declarative_base`, `Column`, `Integer`, `String`, and `create_engine` from the framework.',
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
    'py-28', 28, 'API Development with Python', '🌐', 'Modern applications do not live in isolation; they communicate across global server networks using Application Programming Interfaces (APIs). Building web services requires an engineering understanding of network protocols, semantic routing structures, and payload parsing pipelines. By shifting away from legacy web frameworks and adopting modern, asynchronous REST architectures like FastAPI, Python engineers can build self-documenting web services capable of processing high concurrent traffic volumes.',
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
    'py-29', 29, 'Python Security & Secure Coding', '🛡️', 'Functional code means nothing if it leaves user data exposed to theft or system exploitation. In high-performance software engineering, security is not a separate step added at the end of a project; it is an internal structural requirement. From guarding memory buffers to neutralizing malicious inputs, understanding vulnerabilities like injection vectors, supply-chain exploits, and cryptographically broken algorithms is what separates a senior engineer from a junior developer.',
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
    'py-30', 30, 'Professional Python Packaging & Deployment', '📦', 'Writing code that runs beautifully on your personal computer is a great achievement, but the ultimate goal of professional software engineering is distribution—making your tools reliably installable and deployable by other developers and production servers across the globe. Packaging bridges the gap between loose source files and reproducible, enterprise-ready software ecosystems. By mastering modern build backends, binary distributions, semantic versioning contracts, and automated continuous deployment systems, you can transform individual scripts into institutional open-source libraries or highly scalable cloud assets.',
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
];

export const getPythonLessonById = (id: string): PythonLesson | undefined =>
  PYTHON_LESSONS.find(l => l.id === id);

export const isPythonLessonUnlocked = (id: string, completedLessons: string[]): boolean => {
  const idx = PYTHON_LESSONS.findIndex(l => l.id === id);
  if (idx <= 0) return true;
  return completedLessons.includes(PYTHON_LESSONS[idx - 1].id);
};
