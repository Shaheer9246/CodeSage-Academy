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

  export const PYTHON_TRACK_NOTICE = {
  type: "track-notice",
  notice: "🖥️ **This track does not have a Python preview yet.** In this lesson, you will dive into and understand the core philosophy of Python!"
};
 
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
];

export const getPythonLessonById = (id: string): PythonLesson | undefined =>
  PYTHON_LESSONS.find(l => l.id === id);

export const isPythonLessonUnlocked = (id: string, completedLessons: string[]): boolean => {
  const idx = PYTHON_LESSONS.findIndex(l => l.id === id);
  if (idx <= 0) return true;
  return completedLessons.includes(PYTHON_LESSONS[idx - 1].id);
};
