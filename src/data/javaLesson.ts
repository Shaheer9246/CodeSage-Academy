// Java Track — Part 1: Phase 1 (Lessons 1-6)
import type { NetworkingLesson, Concept, QuizQuestion } from './networkingLessons';

export type JavaLesson = NetworkingLesson;

const L = (
  id: string, order: number, title: string, icon: string, philosophy: string,
  concepts: Concept[], practical: JavaLesson['practical'], quiz: QuizQuestion[],
  keyTakeaways: string[]
): JavaLesson => ({
  id, module: 'Module 1: Java Basics & Fundamentals', order, title, icon, philosophy,
  concepts, practical, quiz, keyTakeaways,
});

const q = (question: string, options: string[], correctIndex: number, explanation?: string): QuizQuestion =>
  ({ question, options, correctIndex, explanation });

export const JAVA_TRACK_NOTICE = {
  type: "track-notice",
  notice: "☕ Java Track Status: Part 1 of 3 (Phase 1: Fundamentals). We are establishing your core statically-typed programming foundation. Please proceed through the available lessons to build your skills; we are actively updating the environment and will notify you as soon as Phase 2 (Object-Oriented Programming) is fully integrated."
};

export const JAVA_LESSONS: JavaLesson[] = [

  L(
  'java-01', 1, 'Java Architecture & Execution', '☕', 
  '🖥️ **Terminal Notice:** Every great Java developer starts in the terminal. Before building massive enterprise systems or Android apps, you must understand how Java translates your human-readable code into something any machine in the world can understand. Java revolutionized programming with its "Write Once, Run Anywhere" philosophy, powered by a brilliant two-step execution engine.',
  [
    { title: '1. The JDK, JRE, and JVM', beginner: 'Think of Java as a massive toolbox. The JVM (Java Virtual Machine) is the engine that actually runs your code. The JRE (Java Runtime Environment) bundles the JVM with ready-to-use standard libraries. The JDK (Java Development Kit) is the ultimate master toolkit—it includes the JRE plus compilers and debugging tools you need to write and build programs.', advanced: 'The JVM is an abstract computing machine that enables Java\'s platform independence. It provides a runtime environment in which Java bytecode can be executed, managing hardware interactions, memory allocation (Heap/Stack), and garbage collection dynamically at runtime.' },
    { title: '2. The Two-Step Compilation Process', beginner: 'Unlike languages that translate directly to computer hardware, Java does a two-step dance. First, a tool called `javac` compiles your English-like Java code into a middle-ground language called "Bytecode". Then, the JVM reads this Bytecode and runs it. This is why a Java program written on a Mac can run perfectly on Windows!', advanced: 'The `javac` compiler converts `.java` source code into `.class` files containing platform-neutral bytecode. When executed using the `java` command, the JVM\'s ClassLoader loads the bytecode, and the Execution Engine interprets it. HotSpot JVMs also feature a Just-In-Time (JIT) compiler that dynamically compiles heavily used bytecode into native machine code for extreme performance.' },
    { title: '3. JShell: The Java REPL', beginner: 'Historically, running Java meant writing huge files just to test one line of code. Not anymore! Modern Java (Java 9+) includes a fantastic live terminal playground called `jshell`. Just like Python, you can type code and see the results instantly without saving files.', advanced: '`jshell` provides an interactive Read-Eval-Print-Loop (REPL) for Java. It operates by creating synthetic wrapper classes and methods behind the scenes to execute standalone expressions and statements, bypassing the traditional rigid class structure required by standard Java execution.' },
    { title: '4. The Standard Entry Point (main method)', beginner: 'When you save a permanent Java file, the JVM needs to know exactly where to start reading. It always looks for a very specific door: the `public static void main(String[] args)` method. If your file doesn\'t have this exact door, Java will refuse to run it.', advanced: 'The `main` method must be `public` so the JVM can invoke it from outside the class, `static` so it can be invoked without instantiating the class, and `void` because it exits the program rather than returning a value to the runtime process. The `args` array captures command-line arguments.' }
  ],
  {
    title: 'Workstation Activation & First Java Program',
    intro: 'Let\'s compile and run your very first Java application using the terminal, followed by a quick test in the modern JShell playground.',
    steps: [
      'Install the latest JDK (Java Development Kit) from Adoptium or Oracle. Ensure you check "Add to PATH" during installation.',
      'Open your terminal and type `java -version` followed by `javac -version`. Verify both print out version numbers successfully.',
      'Enter the live playground! Type `jshell` and press Enter. Type `System.out.println("Hello from JShell!")` and hit Enter. Watch it execute instantly. Type `/exit` to leave.',
      'Now create a permanent file. Open a text editor, write exactly: `public class Main { public static void main(String[] args) { System.out.println("Hello World!"); } }`',
      'Save the file perfectly as `Main.java` (Java filenames MUST match the public class name inside them exactly!).',
      'In your terminal, navigate to the folder where you saved the file. Compile the file by typing: `javac Main.java`. Notice this creates a new hidden file called `Main.class` (this is your Bytecode!).',
      'Run the compiled bytecode by typing: `java Main` (Note: do NOT add the .class extension when running!).'
    ],
    goal: 'You successfully installed the JDK, utilized the JShell REPL, and completed the two-step compile-and-execute lifecycle for a standalone Java program.'
  },
  [
    q('Which Java component is strictly responsible for converting your human-readable `.java` source code into `.class` bytecode?', ['The JRE (Java Runtime Environment)','The JVM (Java Virtual Machine)','The `javac` compiler included in the JDK','The Just-In-Time (JIT) compiler'], 2, 'The `javac` (Java Compiler) tool takes your source code and translates it into the intermediate platform-independent bytecode.'),
    q('Why must the main method in Java be declared as `static`?', ['To prevent hackers from modifying the code','So the JVM can execute the method without needing to create an object/instance of the class first','Because standard methods are too slow','To make the variables inside it unchangeable'], 1, 'The JVM needs an entry point to bootstrap the program. Making it `static` allows the JVM to call the method directly on the class memory space.'),
    q('What is the defining purpose of Java Bytecode?', ['It is a specialized form of HTML for web browsers','It acts as an intermediate, platform-neutral instruction set that any machine with a JVM can execute','It is heavily encrypted source code','It executes 100x faster than C++'], 1, 'Bytecode is the secret to Java\'s "Write Once, Run Anywhere" capability. It isn\'t tied to Mac or Windows hardware; it\'s tied only to the JVM.'),
    q('What command safely closes the modern interactive `jshell` environment?', ['exit()','/exit','stop','Ctrl + Alt + Delete'], 1, 'In JShell, administrative and environment commands are prefixed with a forward slash, so `/exit` is the proper way to terminate the session.')
  ],
  ['The JDK contains everything; the JRE runs things; the JVM is the engine itself.', 'Java uses a two-step process: compile to Bytecode (.class) first, then execute.', 'JShell allows for rapid prototyping without writing full class files.', 'Every executable Java program requires a perfectly formatted main method signature.']
),

  L('java-02', 2, 'Variables, Data Types & Type Casting', '📦',
    'Java is a "Statically Typed" language. This means you cannot just create a box and throw anything inside it. You must declare the exact shape and size of the box (the data type) before you put anything inside. This strictness catches thousands of bugs before your program even runs!',
    [
      { 
        title: '1. Primitive Data Types', 
        beginner: 'Primitives are the simplest, fastest data boxes in Java. `int` holds whole numbers, `double` holds decimals, `boolean` holds true/false, and `char` holds a single letter surrounded by single quotes (like \'A\'). You must declare the type first: `int age = 25;`.', 
        advanced: 'Java primitives are not objects; they are raw values stored directly in the thread\'s Stack memory. Sizes are strictly defined by the language specification (e.g., int is exactly 32-bit signed, double is 64-bit IEEE 754 float), ensuring consistent memory footprints across all OS platforms.' 
      },
      { 
        title: '2. Reference Data Types (Strings)', 
        beginner: 'Unlike a single letter `char`, a text sentence like `"Hello"` is a complex object called a `String`. Notice that `String` starts with a capital letter! In Java, capital letters usually mean you are dealing with a complex "Reference" type, not a simple primitive.', 
        advanced: 'Reference types do not hold their data directly in the variable. Instead, the variable sits on the Stack and holds a memory address (a pointer) pointing to the actual object located in the Heap memory. Strings in Java are immutable and managed in a special Heap area called the String Pool.' 
      },
      { 
        title: '3. Type Casting (Implicit vs Explicit)', 
        beginner: 'Sometimes you need to move data between different sized boxes. Moving a small `int` into a large `double` happens automatically (Implicit). But forcing a large decimal `double` into a small whole number `int` chops off the decimal! You must do this forcefully (Explicit) by writing: `int x = (int) 9.99;`.', 
        advanced: 'Implicit casting (Widening) guarantees no data loss and requires no special syntax (e.g., `long l = myInt;`). Explicit casting (Narrowing) requires a cast operator because it may cause precision loss or overflow by forcefully truncating higher-order bits (e.g., `byte b = (byte) myInt;`).' 
      },
      { 
        title: '4. Variable Scope', 
        beginner: 'Where you create a variable matters! If you create a variable inside a set of curly braces `{}`, it is locked inside that block. As soon as the closing brace `}` hits, the variable vanishes forever. This is called "Scope".', 
        advanced: 'Block scope limits the visibility and lifecycle of local variables. Method variables are pushed onto the call stack and popped off (destroyed) when the block terminates. Unlike class-level instance variables, local block variables are never assigned default values and must be explicitly initialized before use.' 
      },
    ],
    { 
      title: 'The Type Casting Playground', 
      intro: 'Let\'s use Java\'s JShell to witness how Java handles strict types and data truncation.', 
      steps: [
        'Open your terminal and type `jshell` to enter the interactive Java playground.',
        'Create a whole number: `int score = 100;`',
        'Create a decimal number: `double preciseScore = score;` (Notice Java automatically converts the int to a double: 100.0).',
        'Now try to go backwards: `int strictScore = 99.99;`. Notice Java throws a massive Error!',
        'Force it to work using explicit casting: `int strictScore = (int) 99.99;`. Check the value of strictScore—the .99 was completely chopped off!',
        'Create a text String: `String name = "Java";` (Remember the capital S and double quotes!).'
      ], 
      goal: 'You successfully declared primitive and reference variables, triggered a type-safety compiler error, and bypassed it using explicit casting.' 
    },
    [
      q('Why is Java considered a "Statically Typed" language?', ['Because variables cannot change their values once set','Because you must explicitly declare the data type of a variable before it compiles and runs','Because it does not support objects','Because it uses static electricity to process data'], 1, 'Static typing means type checking occurs at compile-time. You must define a variable\'s data type (like int or double) explicitly, unlike Python\'s dynamic inference.'),
      q('What happens when you explicitly cast a double to an int, like `(int) 4.85`?', ['It rounds up to 5','It crashes the program','It chops off the decimal entirely, resulting in 4','It converts the number into a text string'], 2, 'Narrowing primitive conversion from floating-point to integer always truncates (chops off) the fractional part; it does not round mathematically.'),
      q('Which of the following is a Reference Type, not a Primitive Type, in Java?', ['boolean','char','int','String'], 3, '`String` is an object (Reference Type) derived from the `java.lang.String` class, which is why it begins with an uppercase letter, unlike lowercase primitives.'),
      q('What is the default value of a local `int` variable declared inside a method if you don\'t assign a number to it?', ['0','null','-1','It has no default value and triggers a compilation error if you try to use it'], 3, 'Unlike class-level fields (which default to 0 or null), local block variables must be explicitly initialized before they are read, otherwise the compiler throws an error.')
    ],
    ['Primitives hold simple data directly; Reference types point to complex objects.', 'Strings require double quotes ("") and chars require single quotes (\'\').', 'Moving from a large type to a small type requires explicit (forced) casting.', 'Variables only live inside the curly braces {} where they were created.']
  ),
  
  L('java-3', 3, 'Operators & Mathematical Expressions', '🧮',
    'Operators are the special symbols that tell Java to perform specific mathematical, relational, or logical operations. They are the gears that make your program actually "do" things with the data you stored.',
    [
      { 
        title: '1. Arithmetic & Assignment', 
        beginner: 'Standard math works exactly as expected: `+`, `-`, `*`, `/`. The modulo operator `%` gives you the remainder of division (great for checking if numbers are even or odd). You can also use shorthand assignments like `score += 10;` to add 10 to a variable instantly.', 
        advanced: 'Integer division in Java truncates towards zero (e.g., `5 / 2` yields `2`). To get a floating-point result, at least one operand must be a float or double (`5.0 / 2` yields `2.5`). Arithmetic overflow on integers wraps around silently based on two\'s complement binary representation.' 
      },
      { 
        title: '2. Unary & Increment Operators', 
        beginner: 'Java offers lightning-fast shortcuts to add or subtract 1: `x++` or `x--`. Be careful where you place them! Putting the `++` after the variable (post-increment) uses the current value first, then adds 1. Putting it before (pre-increment, `++x`) adds 1 first, then uses the new value.', 
        advanced: 'The placement dictates expression evaluation order. `int y = x++;` assigns the original value of `x` to `y`, then increments `x`. `int y = ++x;` increments `x` first, then assigns the new value to `y`. Both operations are fundamentally non-atomic in multi-threaded contexts.' 
      },
      { 
        title: '3. Relational Operators', 
        beginner: 'Programs need to compare things. Use `==` to check if primitives are equal, `!=` for not equal, and `>`, `<`, `>=`, `<=` for sizing. The result is always a true/false `boolean` value!', 
        advanced: '⚠️ CRITICAL: Never use `==` to compare the content of Strings or Objects! `==` only compares the memory address reference (do they point to the exact same object in the heap?). Always use `string1.equals(string2)` to compare actual text content.' 
      },
      { 
        title: '4. Logical Operators (Short-Circuiting)', 
        beginner: 'You can combine multiple true/false checks. `&&` means AND (both must be true). `||` means OR (only one needs to be true). `!` means NOT (flips true to false).', 
        advanced: '`&&` and `||` are "short-circuit" operators. If the left side of `&&` is `false`, Java completely skips evaluating the right side because the overall expression can never be true. This prevents runtime errors, like avoiding a null check crash: `if (obj != null && obj.isValid())`.' 
      },
    ],
    { 
      title: 'The Logic Gate Lab', 
      intro: 'Let\'s test Java\'s short-circuit logic and increment behaviors directly in JShell.', 
      steps: [
        'Open `jshell` in your terminal.',
        'Test integer division: Type `7 / 2` (Notice it equals 3). Type `7.0 / 2` (Notice it equals 3.5).',
        'Test post-increment: Type `int a = 5;`, then type `System.out.println(a++);`. It prints 5! Now type `a` again... it is now 6.',
        'Test pre-increment: Type `int b = 5;`, then type `System.out.println(++b);`. It prints 6 immediately!',
        'Test Object equality danger: Type `String s1 = new String("Java");` and `String s2 = new String("Java");`.',
        'Compare them incorrectly: Type `s1 == s2` (Returns false because they are different memory boxes).',
        'Compare them correctly: Type `s1.equals(s2)` (Returns true because the text matches).'
      ], 
      goal: 'You mastered integer division truncation, unary increment timing, and the critical difference between object reference equality (==) and content equality (.equals()).' 
    },
    [
      q('What is the result of the expression `10 % 3` in Java?', ['3.33','3','1','0'], 2, 'The modulo operator `%` returns the remainder of the division. 10 divided by 3 is 9, leaving a remainder of 1.'),
      q('If `int x = 10;`, what is the value of `y` after executing `int y = ++x;`?', ['9','10','11','Error'], 2, 'The pre-increment operator `++x` increases the value of x to 11 first, and then assigns that updated value to y.'),
      q('Why should you use `.equals()` instead of `==` when comparing two Strings?', ['Because `==` is only for numbers','Because `==` checks if they are the exact same object in memory, while `.equals()` checks if the text letters are identical','Because `.equals()` is faster','Because `==` triggers a syntax error with Strings'], 1, 'In Java, `==` on Reference Types strictly compares memory pointer addresses. To compare the actual characters inside the String objects, you must invoke the `.equals()` method.'),
      q('How does the short-circuit AND operator `&&` behave if the left-hand condition is false?', ['It immediately evaluates the right-hand condition to be safe','It stops and returns false instantly without ever looking at the right-hand condition','It throws a NullPointerException','It converts the result to true'], 1, 'Short-circuiting means that if the overall result can be guaranteed by the left operand (false AND anything is always false), the JVM entirely skips executing the right operand.')
    ],
    ['Integer division chops off decimals; use a double for precise division.', 'x++ uses the value then adds; ++x adds then uses the value.', 'NEVER use == to compare Strings. Always use string.equals().', '&& and || use short-circuiting to optimize performance and prevent crashes.']
  ),

  L('java-4', 4, 'Control Flow & Decision Making', '🔀',
    'Programs need to make smart choices. Control flow structures act as the traffic directors of your code, evaluating boolean logic to route data down different execution paths based on real-time conditions.',
    [
      { 
        title: '1. If / Else If / Else', 
        beginner: 'The classic fork in the road. `if (condition)` checks if something is true. If not, it falls to `else if`. If absolutely nothing matches, it falls into the final `else` bucket. Notice that unlike Python, Java requires parentheses `()` around the condition and curly braces `{}` around the code block!', 
        advanced: 'While curly braces `{}` are technically optional for single-line statements following an `if`, omitting them is considered a massive security/readability anti-pattern (infamous for causing the Apple "goto fail" SSL bug). Always enforce block braces.' 
      },
      { 
        title: '2. The Ternary Operator', 
        beginner: 'Want to write a simple `if-else` statement on a single line? The ternary operator acts as a mini-if statement: `condition ? trueResult : falseResult;`. For example: `String status = (score >= 50) ? "Pass" : "Fail";`.', 
        advanced: 'The ternary operator (`?:`) is an expression, meaning it evaluates and directly returns a value. Both the true and false return branches must resolve to compatible data types, or the compiler will throw a type mismatch error.' 
      },
      { 
        title: '3. Traditional Switch Statement', 
        beginner: 'When checking the exact same variable against many specific values (like checking days of the week 1-7), an `if-else` chain gets messy. A `switch(variable)` lets you define clean `case` blocks. But watch out: you MUST put a `break;` at the end of every case, or Java will "fall through" and execute the next cases too!', 
        advanced: 'Traditional switch statements compare using equality (`==`). They only support `byte`, `short`, `char`, `int`, `String`, and Enums. If a `break` is omitted, execution permanently falls through to all subsequent cases ignoring their case labels—a common source of logical bugs.' 
      },
      { 
        title: '4. Modern Switch Expressions', 
        beginner: 'Starting in Java 14, the switch statement got a massive upgrade. By using an arrow `->` instead of a colon `:`, you no longer need to write `break;`! It also allows the switch to return a value directly into a variable.', 
        advanced: 'Switch expressions yield values and utilize arrow syntax `case X ->`. This fundamentally eliminates fall-through behavior. If you need a multi-line block inside an arrow case, you use the `yield` keyword to return the value from that specific block.' 
      },
    ],
    { 
      title: 'The Menu Router', 
      intro: 'Let\'s build a choice-based system using both traditional and modern switch routing in JShell.', 
      steps: [
        'Open `jshell`.',
        'Create a variable: `int menuChoice = 2;`',
        'Write a traditional switch: \n`switch(menuChoice) { \n  case 1: System.out.println("Start"); break; \n  case 2: System.out.println("Load"); break; \n  default: System.out.println("Quit"); \n}`',
        'Now remove the `break;` from case 2 and run it again with `menuChoice = 2;`. Notice it prints "Load" AND "Quit"! This is the fall-through danger.',
        'Now try a modern switch expression (Java 14+): \n`String action = switch(menuChoice) { \n  case 1 -> "Start"; \n  case 2 -> "Load"; \n  default -> "Quit"; \n};`',
        'Print the `action` variable. Notice how clean it is without needing breaks!'
      ], 
      goal: 'You constructed conditional logic paths and experienced the danger of switch fall-through versus the safety of modern arrow-switch expressions.' 
    },
    [
      q('What happens if you forget to include a `break;` statement in a traditional Java `switch` case?', ['The code will refuse to compile','Execution stops immediately after that case finishes','Execution "falls through" and automatically runs the code in the next case block below it','It skips to the default block'],Here is the continuation to complete Lesson 5 and provide the next block of the Python curriculum (Lessons 6 through 10). This establishes a solid "Part 1" for your complete 20-lesson track. 

```typescript
      q('What happens if you attempt to create an ordered tuple structure and then append a new item to it later in the code?', ['Python quietly turns the tuple into a list','It triggers an immediate error because tuples are locked and immutable','The item overwrites the first element inside the tuple','The computer drops the new item completely'], 1, 'Tuples are strictly immutable. They lack mutability methods like `.append()`, so attempting to alter them raises an immediate AttributeError at runtime.'),
      q('What is the safest way to extract a value from a Dictionary without risking a crash if the target key does not exist?', ['By using a `try/catch` loop','By using the `.get(key, default)` method','By using the `.pop()` method','By slicing the dictionary index'], 1, 'The `.get()` method attempts to retrieve the key but gracefully returns a default fallback value (like None) instead of crashing if the key is missing.')
    ],
    ['Lists dynamically expand and shrink as needed.', 'Tuples provide locked, memory-efficient data records.', 'Dictionaries map unique keys to values for instant data retrieval.', 'Sets eliminate duplicate items entirely and offer lightning-fast membership checking.']
  ),

  L('py-6', 6, 'Error Handling & Exceptions', '🛡️',
    'Mistakes are inevitable. Error handling is the armor your code wears to survive unexpected crashes in the wild. Instead of letting bad data destroy your program, you can catch explosions safely and redirect the flow.',
    [
      { 
        title: '1. The Try/Except Block', 
        beginner: 'When you think a line of code might crash (like dividing by zero or reading a missing file), you wrap it in a `try` block. If it explodes, the program doesn\'t die; it instantly jumps into your `except` block to handle the mess safely.', 
        advanced: 'Exception handling utilizes the system stack trace. Capturing generic `Exception` blocks is considered a dangerous anti-pattern. Always catch specific subclass anomalies (e.g., `ValueError`, `KeyError`) to avoid masking unrelated catastrophic system failures (like `KeyboardInterrupt`).' 
      },
      { 
        title: '2. The Finally Clause', 
        beginner: 'Sometimes you open a file or a network connection, and you absolutely must close it—even if a crash happens. The `finally` block runs no matter what, guaranteeing your cleanup code executes whether the `try` succeeded or failed.', 
        advanced: 'The `finally` block executes unconditionally during the stack-unwinding phase. If an unhandled exception is propagating upward, or a `return` is triggered inside the `try`, the `finally` block perfectly intercepts execution to clear resources before relinquishing scope.' 
      },
      { 
        title: '3. Raising Exceptions', 
        beginner: 'You don\'t just have to catch errors; you can create them! If a user gives you a negative age, you can use the `raise` keyword to purposely trigger a `ValueError` to stop the program before it does something illogical.', 
        advanced: 'Using `raise` intentionally propagates domain-specific validation failures up the call stack, forcing upstream caller functions to explicitly handle the invariant violation.' 
      }
    ],
    { 
      title: 'The Unbreakable Calculator', 
      intro: 'Create a mathematical function that cannot be crashed by bad user input.', 
      steps: [
        'Open your interactive terminal REPL (look for the >>> prompt).',
        'Define a function: `def safe_divide(a, b):`',
        'Start a `try:` block and attempt to calculate `result = a / b`.',
        'Add an `except ZeroDivisionError:` block that returns "You cannot divide by zero!"',
        'Add an `except TypeError:` block that returns "Please only use numbers!"',
        'Test your unbreakable function by calling `safe_divide(10, 0)` and `safe_divide(10, "apple")`. Notice how it returns a clean message instead of terminating the system!'
      ], 
      goal: 'You successfully intercepted specific runtime crash states and transformed them into clean, manageable application outputs.' 
    },
    [
      q('Why is it dangerous to write a bare `except:` block that catches everything?', ['It slows down the computer processor','It masks entirely unrelated critical errors, making debugging impossible','It forces the program into an infinite loop','It automatically deletes the script file'], 1, 'Catching all exceptions broadly hides syntax typos and critical system interruptions, producing invisible software bugs.'),
      q('When does a `finally` block execute during a try/except sequence?', ['Only when the try block succeeds','Only when the except block is triggered','Always, regardless of whether an error occurred or not','Only if the program crashes completely'], 2, 'The `finally` clause is structurally guaranteed to run as the ultimate cleanup step before the execution context closes.')
    ],
    ['Use try/except blocks to gracefully catch anticipated code crashes.', 'Never catch generic exceptions; target specific expected error types.', 'Use finally blocks to guarantee resource cleanup.', 'Raise custom errors to stop invalid data before it processes.']
  ),

  L('py-7', 7, 'File Operations', '📁',
    'Files are your program\'s memory. By reading and writing to the hard drive, your scripts can process thousands of data logs, save user settings, and generate permanent reports.',
    [
      { 
        title: '1. The Context Manager (with open)', 
        beginner: 'To interact with a file, you use the `with` keyword. Writing `with open("data.txt", "r") as file:` creates a safe zone. The moment your code finishes that indented block, Python automatically closes and unlocks the file for you!', 
        advanced: 'The `with` statement utilizes the Context Manager protocol. It implicitly invokes the `__enter__()` and `__exit__()` dunder methods of the file object, guaranteeing secure OS descriptor teardown even during fatal exception unwinding.' 
      },
      { 
        title: '2. Read, Write, and Append Modes', 
        beginner: 'You must tell Python exactly what you want to do with a file. Use `"r"` to purely read text. Use `"w"` to completely overwrite a file with brand new text. Use `"a"` to append (add) new text safely to the absolute bottom of an existing file.', 
        advanced: 'Be highly cautious with the `"w"` parameter. It truncates the target file to zero bytes immediately upon opening, erasing all previous contents. For structured serialization, you will eventually wrap these modes with modules like `json` or `csv`.' 
      },
      { 
        title: '3. Reading Lines', 
        beginner: 'If a file is massive, you shouldn\'t load the whole thing into memory at once. You can use a `for` loop to read it line by line: `for line in file:`. This ensures your program stays fast and doesn\'t crash your computer!', 
        advanced: 'File objects are iterators that lazily yield lines from a buffered disk stream. Looping over them scales cleanly at $O(1)$ memory complexity regardless of the file\'s actual disk footprint.' 
      }
    ],
    { 
      title: 'The Permanent Diary', 
      intro: 'Write a script that creates a brand new text file on your hard drive and saves a message inside it.', 
      steps: [
        'Open your terminal and type `python` to enter the live REPL.',
        'Type `with open("diary.txt", "w") as f:` and press Enter. (The "w" stands for Write mode!)',
        'On the indented line, type `f.write("I am mastering Python today!")` and press Enter twice to execute.',
        'Exit the REPL using `exit()`.',
        'Look inside your current working folder—you will see a brand new `diary.txt` file created entirely by your code!'
      ], 
      goal: 'You manipulated the system file I/O interface to generate a persistent data asset on your hard drive.' 
    },
    [
      q('What is the primary advantage of using the `with open(...)` context manager syntax?', ['It encrypts the file automatically','It guarantees the file stream is safely closed, preventing memory leaks','It allows you to read images as text','It automatically formats your text into JSON'], 1, 'The `with` context manager systematically handles all resource teardown operations, completely eliminating the risk of hanging system file locks.'),
      q('Which file mode character dictates that a file should be completely overwritten from scratch?', ['"r" (Read)','"a" (Append)','"w" (Write)','"x" (Exclusive)'], 2, 'The `"w"` parameter truncates the target file to zero length immediately upon opening, erasing all previous contents before writing new streams.')
    ],
    ['Always prefer the `with` keyword context manager to handle file lifecycles.', 'Use "r" to read, "w" to overwrite entirely, and "a" to safely append data.', 'Looping over large files line-by-line preserves system memory.']
  ),

  L('py-8', 8, 'Classes & Objects (OOP Basics)', '🏗️',
    'Think of Object-Oriented Programming (OOP) as a factory blueprint. Instead of scattering variables and functions everywhere, you package them together into neat, predictable real-world objects.',
    [
      { 
        title: '1. What is a Class?', 
        beginner: 'A class is a master blueprint. For example, a `Car` blueprint dictates that every car needs a color and a start engine button. An Object (or Instance) is the actual physical car built from that blueprint. You can build 100 different cars from one single class!', 
        advanced: 'Classes provide structural encapsulation. They bind contextual state (instance attributes) and behavior (methods) together into cohesive logical models. In Python, everything—including integers and functions—is ultimately derived from the base `object` class.' 
      },
      { 
        title: '2. The __init__ Constructor', 
        beginner: 'The `__init__` function is the factory assembly line. It fires automatically the moment you create a new object. It sets up the starting conditions—like assigning a specific name or starting balance to a brand new Bank Account object.', 
        advanced: 'The `__init__` dunder (double underscore) method initializes the namespace of a newly instantiated object. It is strictly forbidden from returning any value other than `None`.' 
      },
      { 
        title: '3. The "self" Keyword', 
        beginner: 'Inside a class blueprint, `self` is how the object talks to itself! If a dog barks and loses energy, you write `self.energy -= 10`. It ensures that only THIS specific dog loses energy, not every dog in the entire program.', 
        advanced: 'Unlike some languages that use implicit context pointers (like `this`), Python heavily adheres to the "Explicit is better than implicit" philosophy. `self` is strictly passed as the first positional argument to all standard instance methods to definitively resolve namespace scope.' 
      }
    ],
    { 
      title: 'Building a Robot Factory', 
      intro: 'Write a basic class blueprint that manufactures personalized, interactive robots.', 
      steps: [
        'Open a brand new standard `.py` file in your editor (e.g., `robots.py`).',
        'Define the blueprint: `class Robot:`',
        'Add the constructor line: `def __init__(self, name):`',
        'Inside the constructor, save the name: `self.name = name`',
        'Add an action method below it: `def greet(self): return f"Beep boop! I am {self.name}."`',
        'Outside the class completely, build a robot! `r1 = Robot("R2-D2")`',
        'Print `r1.greet()` and run the file to see your factory creation come alive.'
      ], 
      goal: 'You built a structural class blueprint, instantiated an isolated object from it, and executed its bound methods.' 
    },
    [
      q('What is the primary purpose of the `__init__` function inside a Python class?', ['It deletes the object from memory when it is no longer needed','It acts as the constructor that initializes the object\'s starting attributes when it is first created','It pauses the execution loop','It turns the class into a string representation'], 1, 'The `__init__` double-underscore method is triggered immediately upon instantiation to populate the fresh object\'s initial variable state.'),
      q('Why is the `self` keyword required as the first parameter in almost every class method?', ['Because it makes the code run faster on Windows','It allows the method to explicitly target and alter the exact instance object that called it','It stops other programmers from reading the code','It connects the class to the internet'], 1, 'Python requires explicit scoping. Passing `self` guarantees the interpreter knows exactly which instance\'s memory address to look up and modify.')
    ],
    ['Classes serve as structured blueprints; Objects are the concrete items built from them.', 'The __init__ method automatically sets up starting variables for new objects.', 'The self parameter explicitly binds methods and attributes to their specific instance.']
  ),

  L('py-9', 9, 'Inheritance & Polymorphism', '🧬',
    'Why write the same code twice? Inheritance allows new blueprints to completely absorb the abilities of older blueprints. It allows you to build highly specialized tools without reinventing the wheel.',
    [
      { 
        title: '1. Class Inheritance', 
        beginner: 'If you already have a `Vehicle` class that handles standard steering and fuel, you can create a `Motorcycle` class that inherits all of it instantly. You write `class Motorcycle(Vehicle):`. Now the motorcycle can steer perfectly without you typing a single line of steering code!', 
        advanced: 'Inheritance establishes an explicit "is-a" structural relationship hierarchy. It allows child subclasses to inherit all parent namespace attributes and methods natively, drastically reducing code duplication and enforcing DRY (Don\'t Repeat Yourself) principles.' 
      },
      { 
        title: '2. Overriding & Polymorphism', 
        beginner: 'What if the child needs to behave differently? You simply rewrite the exact same method inside the child class. If the parent `Animal` class makes a generic sound, the child `Dog` class overrides it to explicitly say "Woof!". This lets different objects respond to the same command in their own unique way.', 
        advanced: 'Method overriding achieves runtime polymorphism. The Python interpreter uses dynamic dispatch (via the Method Resolution Order / MRO) to evaluate the object\'s explicit type at execution time and route the call to the most localized, specialized method implementation.' 
      },
      { 
        title: '3. The Super() Function', 
        beginner: 'Sometimes you want to upgrade a parent\'s method rather than completely destroy it. The `super()` command allows a child class to reach backward and temporarily borrow the original parent\'s code before adding its own unique twist.', 
        advanced: 'The `super()` proxy object elegantly delegates method calls upward through the MRO hierarchy. It is critical during complex multiple-inheritance scenarios to ensure that every parent constructor fires exactly once.' 
      }
    ],
    { 
      title: 'The Employee Hierarchy', 
      intro: 'Build a system where different types of employees calculate their pay differently.', 
      steps: [
        'Create a parent class: `class Employee:` that contains a basic `__init__(self, name)` and a `calculate_pay(self)` method that just returns 0.',
        'Create a child class: `class Salaried(Employee):` that overrides the pay calculation to return 5000.',
        'Create another child: `class Hourly(Employee):` that takes `hours` in its own `__init__` (using `super().__init__(name)` to handle the name) and returns `hours * 20` for pay.',
        'Instantiate one of each and call `.calculate_pay()` on them to see Polymorphism in action.'
      ], 
      goal: 'You implemented class inheritance, utilized the `super()` proxy to share initialization logic, and dynamically overrode parent methods.' 
    },
    [
      q('What does writing `class Wizard(Character):` instruct Python to do?', ['It crashes the program because Wizard is not defined','It creates a Wizard class that automatically inherits all attributes and abilities from the Character class','It converts the Character class into a Wizard','It swaps the two classes'], 1, 'Passing a class name inside the definition parentheses instructs Python to establish an inheritance hierarchy, granting the subclass access to the parent\'s namespace.'),
      q('What is the primary function of the `super()` command?', ['It makes the code execute 10 times faster','It grants admin privileges to the application','It allows a child subclass to safely reach up and call methods or constructors from its parent class','It forces a loop to end instantly'], 2, 'The `super()` object acts as a hierarchical proxy, allowing overridden child methods to safely trigger the original logic defined in their ancestral classes.')
    ],
    ['Inheritance allows child classes to instantly absorb parent logic and variables.', 'Polymorphism allows different objects to share the same method names but behave uniquely.', 'Use super() to safely extend parent logic rather than outright replacing it.']
  ),

  L('py-10', 10, 'Modules & Standard Library', '🧰',
    'You don\'t have to build a house from scratch. Python comes with a massive toolbox built-in. Modules are just pre-written code files you can import to instantly grant your script new superpowers.',
    [
      { 
        title: '1. Importing Modules', 
        beginner: 'To grab a tool from the toolbox, use the `import` keyword. Writing `import math` brings in a massive library of advanced calculators. You can then use tools like `math.sqrt(16)` immediately.', 
        advanced: 'The `import` statement locates the target module, evaluates its top-level code exactly once within an isolated namespace, and binds it to a local reference. Repeated imports refer back to the globally cached `sys.modules` dictionary.' 
      },
      { 
        title: '2. Selective Importing (from X import Y)', 
        beginner: 'If you only need a single tool, you don\'t have to drag the entire toolbox into your program. Using `from random import choice` allows you to pluck exactly one function and use it directly without typing the module name first!', 
        advanced: 'Selective importing cleanly reduces namespace clutter. However, avoid wildcard imports (`from math import *`) as they blindly dump unknown identifiers into the local scope, causing massive structural ambiguity and variable shadowing.' 
      },
      { 
        title: '3. The Python Standard Library', 
        beginner: 'Python ships "batteries included". You already have access to `os` (for folders), `datetime` (for clocks and calendars), `json` (for web data), and `random` (for games and chaos) without downloading a single extra file.', 
        advanced: 'Familiarity with the Standard Library is the mark of a seasoned Python developer. Re-implementing core utilities (like building a custom CSV parser instead of using the `csv` module) is widely considered a failure to utilize Python\'s native architectural strengths.' 
      }
    ],
    { 
      title: 'The Digital Dice Roller', 
      intro: 'Import the built-in random module to create an unpredictable dice engine.', 
      steps: [
        'Open a blank `.py` script.',
        'At the absolute top of the file, type: `import random`',
        'Create a function called `roll_dice(sides=6):`',
        'Inside the function, tell it to return `random.randint(1, sides)`.',
        'Call the function multiple times inside a `for` loop and print the results to see true programmatic chaos!'
      ], 
      goal: 'You successfully attached an external standard library module to your script and invoked its contained utility methods.' 
    },
    [
      q('Why is it highly discouraged to use wildcard imports like `from random import *`?', ['It is strictly forbidden by the Python interpreter and will not run','It secretly deletes other files','It blindly dumps dozens of unseen function names into your file, making it incredibly easy to accidentally overwrite your own variables','It forces you to pay for the module'], 2, 'Wildcard imports poison the local namespace with untracked identifiers, completely removing your ability to know exactly where a function originated.'),
      q('Which built-in Python module would you import if you needed to figure out what the current date and time was?', ['import clock','import datetime','import sys','import os'], 1, 'The natively included `datetime` module supplies advanced classes for safely extracting, formatting, and manipulating timezone-aware chronometric data.')
    ],
    ['Use the import keyword to access pre-written external files and libraries.', 'Target specific functions cleanly using the from...import syntax.', 'Always rely on the built-in Standard Library before attempting to write utilities from scratch.']
  )
];
