// Java Track — Phase 1: Java Basics & Fundamentals (Lessons 1–6)
import type { NetworkingLesson, Concept, QuizQuestion } from './networkingLessons';

export type JavaLesson = NetworkingLesson;

const L = (
  id: string, order: number, title: string, icon: string, philosophy: string,
  concepts: Concept[], practical: JavaLesson['practical'], quiz: QuizQuestion[],
  keyTakeaways: string[]
): JavaLesson => ({
  id, module: 'Module 1: Java Programming', order, title, icon, philosophy,
  concepts, practical, quiz, keyTakeaways,
});

const q = (question: string, options: string[], correctIndex: number, explanation?: string): QuizQuestion =>
  ({ question, options, correctIndex, explanation });

export const JAVA_TRACK_NOTICE = {
  type: "track-notice",
  notice: "☕ Java Track Status: This track is currently focusing on establishing your core Java programming foundation. Please proceed through the available lessons to build your skills; we are actively updating the preview environment and will notify you as soon as the interactive compiler is fully integrated."
};

export const JAVA_LESSONS: JavaLesson[] = [

  // ==========================================
  // LESSON 1: JAVA ARCHITECTURE & CLIENT-SIDE EXECUTION
  // ==========================================
  L(
    'java-01', 1, 'Java Architecture & Client-Side Execution', '🚀',
    '🖥️ **Terminal Notice:** We now have a built-in terminal right here! However, if you want a bigger screen, you can use your computer\'s native terminal. The practical assignment below contains the full setup instructions to install OpenJDK on your machine.\n\nEvery enterprise software engineering journey begins at the terminal shell. Unlike interpreted scripting languages, Java relies on a compiler to convert human-readable source code into intermediate bytecode, which is then dynamically executed inside a virtual runtime machine. Mastering the Java Development Kit (JDK), Java Runtime Environment (JRE), and Java Virtual Machine (JVM) provides the fundamental blueprint for building platform-independent software.',
    [
      {
        title: '1. The Java Platform (JDK vs JRE vs JVM)',
        beginner: 'Think of the JVM as an automatic binary translator that lives inside your computer. When you write Java code, it does not run directly on Windows, Mac, or Linux. Instead, the Java compiler packages your code so the JVM can execute it anywhere. The JDK (Java Development Kit) is the complete toolkit for developers containing the compiler and debugging tools, while the JRE (Java Runtime Environment) is the smaller execution engine used purely to run finished programs.',
        advanced: 'The Java ecosystem is architected in dynamic layers. The JDK provides development tools including `javac`, `javap`, and `jar`. The JRE packages core class libraries (`java.base`) with the JVM execution engine. The JVM abstracts host hardware architectures, handling class loading, bytecode verification, garbage collection, and platform-specific execution.'
      },
      {
        title: '2. Bytecode Compilation (.java to .class)',
        beginner: 'When you save your Java code, it ends up in a file ending in `.java`. Before your computer can read it, you run the Java compiler (`javac Main.java`). This creates a new binary file ending in `.class`. This file contains Bytecode—a special set of instructions that only the JVM understands.',
        advanced: 'Static compilation via `javac` parses `.java` source code into an intermediate, platform-neutral binary representation stored in `.class` files. Bytecode instructions consist of single-byte opcodes followed by optional operands, enforcing stack-based evaluation dynamics.'
      },
      {
        title: '3. The JVM Runtime & JIT Engine',
        beginner: 'When you execute `java Main`, the JVM opens your `.class` file and reads it line by line. To make your program run lightning fast, the JVM includes a JIT (Just-In-Time) compiler. It identifies parts of your code that run repeatedly and translates them directly into raw computer hardware instructions on the fly.',
        advanced: 'At runtime, the JVM ClassLoader subsystem dynamically loads bytecodes into Metaspace. The Execution Engine initially interprets bytecode sequentially. The JIT (HotSpot C1/C2) compiler monitors method execution thresholds, compiling frequently invoked "hot spots" directly into unmanaged native CPU machine code.'
      },
      {
        title: '4. Source Code Files & The main Entry Point',
        beginner: 'Every single line of Java code must live inside a class definition, and the file name must match the class name exactly. Every runnable Java app requires a starter key called the `main` method: `public static void main(String[] args)`. Without this exact main line, the computer won\'t know where to start running your program.',
        advanced: 'Java source files enforce structural modularity. The public class name must align with the `.java` filename. The entry-point signature `public static void main(String[] args)` is invoked by the JVM launcher via reflection; `static` permits invocation prior to instance allocation, and `String[] args` captures command-line flags.'
      }
    ],
    {
      title: 'Workstation Activation & First Java Execution',
      intro: '⚠️ NOTE: This practical assignment covers local OpenJDK verification, compilation via javac, and invoking your first bytecode file using the java runner.',
      steps: [
        'Open your terminal window (PowerShell on Windows, Terminal on macOS/Linux).',
        'Check if Java is installed by typing `java -version` and hitting Enter. Verify you see Java 17 or higher.',
        'If not installed, download and install OpenJDK LTS from [Adoptium / Eclipse Temurin](https://adoptium.net/).',
        'Create a project folder using `mkdir java-basics && cd java-basics`.',
        'Create a file named `Main.java` inside your editor.',
        'Type the exact starter code: `public class Main { public static void main(String[] args) { System.out.println("Java Environment Active!"); } }`. Save the file.',
        'In your terminal, compile the source file into bytecode by running: `javac Main.java`. Notice that a `Main.class` file appears.',
        'Run the compiled bytecode program by executing: `java Main`. Verify the output printed on your terminal screen.'
      ],
      goal: 'You successfully installed OpenJDK, compiled a .java source file into .class bytecode, and executed it inside the JVM.'
    },
    [
      q('What is the main role of the `javac` tool in Java development?', ['It runs the program directly inside browser terminals', 'It compiles human-readable `.java` source files into intermediate `.class` bytecode', 'It deletes unused memory automatically', 'It connects your code to external SQL databases'], 1, 'The `javac` command line tool compiles Java source code files into platform-neutral bytecode (.class).'),
      q('Which JVM runtime component converts frequently executed bytecode into native hardware instructions at runtime?', ['Class File Parser', 'Just-In-Time (JIT) Compiler', 'Garbage Collector', 'Source Code Editor'], 1, 'The JIT compiler analyzes execution hotspots and translates bytecode directly into native host processor instructions.'),
      q('Why must the class name `Main` match the filename `Main.java` exactly?', ['It makes the file download faster from the web', 'Java static class resolution requires file names to match public class declarations', 'It allows your text editor to auto-complete code', 'It converts your code into Python automatically'], 1, 'Java syntax rules require that public class names match their containing `.java` source filenames strictly.'),
      q('What command line invocation runs compiled Java bytecode stored inside `App.class`?', ['javac App.class', 'java App', 'run App.java', 'execute App'], 1, 'Passing the class name parameter without extensions to `java` instructs the JVM to load and execute `App.class`.')
    ],
    [
      'The JDK provides build compilers (`javac`), while the JVM executes compiled bytecode (`.class`).',
      'Java source filenames must match public class names precisely (e.g., `Main.java` contains `public class Main`).',
      'The `public static void main(String[] args)` signature acts as the application entry point for the JVM.',
      'The JIT compiler dynamically converts execution hot spots into fast native machine code.'
    ]
  ),

  // ==========================================
  // LESSON 2: VARIABLES, DATA TYPES & TYPE CASTING
  // ==========================================
  L(
    'java-02', 2, 'Variables, Data Types & Type Casting', '📦',
    '🖥️ **Terminal Notice:** If you want to use a big terminal on your own computer instead of the built-in one, please read Lesson 1 for full setup instructions.\n\nJava is a strongly-typed language. Every variable is a labeled memory container that holds a specific type of data. In this lesson, you will master Java\'s primitive data types, reference memory pointers, type conversion rules (casting), and variable scope dynamics.',
    [
      {
        title: '1. Primitive Data Types',
        beginner: 'Java features eight basic building blocks called primitive types. Whole numbers use `int` (or `long` for massive values). Decimal numbers use `double` (or `float`). Single character letters use `char` (wrapped in single quotes like \'A\'), and true/false switches use `boolean`. Primitives hold raw values directly.',
        advanced: 'Java defines eight static primitive types: `byte` (8-bit), `short` (16-bit), `int` (32-bit), `long` (64-bit), `float` (32-bit IEEE 754), `double` (64-bit IEEE 754), `char` (16-bit UTF-16), and `boolean` (1-bit logical value). Primitives store raw binary payloads without object header overhead.'
      },
      {
        title: '2. Reference Types vs Primitives (Stack vs Heap)',
        beginner: 'While primitive variables store actual raw numbers directly inside local method scope (the Stack), Reference types (like `String` or custom objects) store a memory address pointing to a larger object stored in a shared warehouse area (the Heap).',
        advanced: 'Local primitives reside directly on the active thread activation frame (Execution Stack). Reference variables also store reference addresses on the Stack, but point to dynamic object instances allocated within the Garbage-Collected Heap.'
      },
      {
        title: '3. Type Casting (Implicit & Explicit)',
        beginner: 'Converting values between data types is called type casting. Java automatically converts small numbers into bigger types (like putting an `int` inside a `double`). This is implicit casting. Converting a large `double` down into an `int` requires explicit casting `(int) 9.99`, which chops off decimals completely.',
        advanced: 'Widening primitive conversions (e.g., `int` to `double`) occur automatically without numerical precision loss. Narrowing conversions require explicit cast operators (e.g., `(int) doubleValue`) and perform bit-level truncation, discarding higher-order bits or floating-point mantissas.'
      },
      {
        title: '4. Variable Scope & Local Type Inference (var)',
        beginner: 'Variables only exist inside the curly braces `{}` where they are created. Once execution exits those braces, the variable vanishes. In modern Java, you can also write `var score = 100;` and Java will automatically figure out that `score` is an `int`.',
        advanced: 'Variable scope is bounded by block delimiters `{}`. Local variable type inference (introduced via `var` in Java 10) allows compile-time type deduction based on initializer expressions without compromising static typing guarantees.'
      }
    ],
    {
      title: 'Variable & Type Conversion Playground',
      intro: 'Let\'s create variables, perform manual narrow casting, and test Java type inference inside your program file.',
      steps: [
        'Open your text editor and create a file named `VariablesPlayground.java`.',
        'Add the starter boilerplate: `public class VariablesPlayground { public static void main(String[] args) { ... } }`.',
        'Inside main, declare primitives: `int score = 95; double price = 19.99; boolean passed = true; char grade = \'A\';`.',
        'Perform explicit narrowing cast: `int truncatedPrice = (int) price;`. Print both variables to see how `.99` was truncated.',
        'Declare an inferred type variable using var: `var userMessage = "Java static type inference!";`.',
        'Compile your file using `javac VariablesPlayground.java` and execute with `java VariablesPlayground`.'
      ],
      goal: 'You successfully created primitives, evaluated stack/heap reference mechanics, performed explicit type casting, and used type inference.'
    },
    [
      q('Which primitive type in Java holds a 64-bit floating-point decimal number?', ['float', 'double', 'int', 'long'], 1, '`double` is a double-precision 64-bit IEEE 754 floating-point primitive type.'),
      q('What happens when you execute an explicit narrowing cast like `int result = (int) 8.85;`?', ['The value rounds up to 9', 'The decimal part is truncated, storing 8', 'The program crashes with a runtime error', 'The value is automatically converted to String'], 1, 'Narrowing a floating-point number to an integer explicitly truncates the fractional decimal components.'),
      q('Where are local primitive variables stored during JVM method execution?', ['In Metaspace memory', 'Directly on the thread stack frame', 'In the remote garbage-collected heap', 'Inside hard drive cache'], 1, 'Local variables declared inside method scopes reside on the thread execution stack activation frame.'),
      q('What keyword allows modern Java (10+) to infer variable types from initializers?', ['let', 'val', 'var', 'auto'], 2, 'The `var` keyword instructs `javac` to automatically deduce the static variable type from its assignment expression.')
    ],
    [
      'Primitives hold raw values directly on the stack; reference types store heap addresses.',
      'Implicit casting widens smaller types automatically; explicit casting `(int)` narrows types but truncates values.',
      'Variable scope is strictly limited to the block `{}` in which variables are declared.',
      'Modern Java supports local variable type inference using the compile-time `var` keyword.'
    ]
  ),

  // ==========================================
  // LESSON 3: OPERATORS & MATHEMATICAL EXPRESSIONS
  // ==========================================
  L(
    'java-03', 3, 'Operators & Mathematical Expressions', '🧮',
    '🖥️ **Terminal Notice:** If you want to use a big terminal on your own computer instead of the built-in one, please read Lesson 1 for full setup instructions.\n\nOperators allow software programs to run mathematical calculations, compare values, and execute bitwise logic. Understanding operator precedence, short-circuit evaluation, and automatic binary promotion rules is crucial for building bug-free algorithms.',
    [
      {
        title: '1. Arithmetic & Unary Operators',
        beginner: 'Java supports standard math operations: addition `+`, subtraction `-`, multiplication `*`, division `/`, and remainder `%` (modulo). Unary shortcut operators like `count++` add 1 to a variable, while `--count` subtracts 1 before or after evaluation.',
        advanced: 'Unary increment/decrement operators function differently based on positioning: pre-increment (`++x`) alters the value before expression evaluation; post-increment (`x++`) evaluates the current value first, then increments the variable.'
      },
      {
        title: '2. Relational & Equality Operators',
        beginner: 'Use relational operators to compare numbers: greater than `>`, less than `<`, equal to `==`, and not equal to `!=`. Comparisons always produce a simple `boolean` value: `true` or `false`.',
        advanced: 'Relational operators evaluate relative magnitude yielding boolean outcomes. Note that `==` evaluates reference identity when applied to reference objects, rather than structural contents.'
      },
      {
        title: '3. Logical & Short-Circuit Operators',
        beginner: 'Combine decisions using logical AND `&&` (both must be true) and logical OR `||` (at least one must be true). Java uses short-circuit logic: if the first part of `&&` is false, Java skips checking the second part entirely to save time.',
        advanced: 'Short-circuit evaluation optimizes logical execution: `&&` skips right-operand processing if the left operand evaluates to `false`. `||` skips right-operand evaluation if the left operand resolves to `true`.'
      },
      {
        title: '4. Bitwise Operators & Operand Promotion',
        beginner: 'Bitwise operators (`&`, `|`, `^`, `<<`, `>>`) work directly on individual binary 1s and 0s. When doing arithmetic with smaller numbers like `byte` or `short`, Java automatically converts them into `int` before calculating.',
        advanced: 'Under Java Binary Numeric Promotion rules, operands of type `byte`, `short`, or `char` are promoted to 32-bit `int` prior to operator evaluation. Bitwise shifts (`<<`, `>>`, `>>>`) manipulate integer bit arrays directly.'
      }
    ],
    {
      title: 'Operator & Math Sandbox',
      intro: 'Build a practical math testing script to observe integer division, short-circuit logic, and bitwise shifts.',
      steps: [
        'Create a file named `OperatorSandbox.java`.',
        'Add public class structure and main method.',
        'Test integer division vs double division: Print `10 / 3` vs `10.0 / 3.0`. Notice how integer division drops decimals.',
        'Test short-circuit evaluation: Create a null string checking `String text = null; if (text != null && text.length() > 0)` to verify short-circuiting prevents errors.',
        'Test bitwise left shift: Calculate `int shifted = 5 << 2;` (which multiplies 5 by 2 squared = 20) and print the result.',
        'Compile and run using `javac OperatorSandbox.java && java OperatorSandbox`.'
      ],
      goal: 'You mastered arithmetic calculations, short-circuit protection rules, and bitwise binary operators.'
    },
    [
      q('What is the result of evaluating the integer arithmetic expression `15 / 4` in Java?', ['3.75', '3', '4', '0'], 1, 'Integer division in Java truncates fractional remainders, yielding the whole number integer 3.'),
      q('Why is short-circuit evaluation (`&&`) useful when checking object properties?', ['It runs math calculations 10x faster', 'It avoids evaluating the right side if the left condition fails, preventing NullPointerExceptions', 'It automatically casts objects into numbers', 'It prevents loop structures from breaking'], 1, 'Short-circuit AND skips evaluating the right condition if the left is false, protecting against null access.'),
      q('What occurs when adding two `byte` primitives together in Java arithmetic?', ['The result remains a byte primitive', 'Both operands are promoted to `int` before calculation', 'The system throws a type overflow exception', 'The values are automatically converted to float'], 1, 'Java Binary Numeric Promotion automatically promotes `byte`, `short`, and `char` operands to 32-bit `int` before evaluation.'),
      q('Which operator performs an un-signed right bitwise shift in Java?', ['>>', '<<', '>>>', '^^'], 2, 'The `>>>` operator shifts bit patterns to the right, filling leftmost vacated bits strictly with zeros.')
    ],
    [
      'Integer division truncates decimals; use floating-point types (`double`) when precision is needed.',
      'Short-circuit logical operators (`&&`, `||`) skip unnecessary evaluations to enhance performance and prevent null errors.',
      'Small integral types (`byte`, `short`) are implicitly promoted to `int` during arithmetic operations.',
      'Bitwise operators work directly on binary representations for high-performance operations.'
    ]
  ),

  // ==========================================
  // LESSON 4: CONTROL FLOW & DECISION MAKING
  // ==========================================
  L(
    'java-04', 4, 'Control Flow & Decision Making', '🔀',
    '🖥️ **Terminal Notice:** If you want to use a big terminal on your own computer instead of the built-in one, please read Lesson 1 for full setup instructions.\n\nSoftware applications need to make choices based on changing user input. Control flow structures provide decision forks and branches. Modern Java includes conditional `if-else` trees, compact ternary operators, and modern pattern-matching `switch` expressions.',
    [
      {
        title: '1. if / else if / else Branching',
        beginner: 'An `if` statement checks a true/false condition. If the condition is true, Java executes the code block inside `{}`. If false, it skips to `else if` or defaults to the `else` path.',
        advanced: 'Conditional branching evaluates boolean expressions sequentially. Proper structure requires ordering specific edge cases before general default cases to prevent unreachable branch code.'
      },
      {
        title: '2. Ternary Operator (?:)',
        beginner: 'The ternary operator is a fast, single-line shorthand for `if-else`. It looks like: `variable = (condition) ? valueIfTrue : valueIfFalse;`. It is great for assigning values based on a simple check.',
        advanced: 'The ternary operator `(condition) ? expression1 : expression2` is an inline expression that returns a value. Both return expressions must conform to type compatibility rules.'
      },
      {
        title: '3. Switch Expressions (case -> & yield)',
        beginner: 'When comparing one variable against many options, `switch` is much cleaner than chaining multiple `if` statements. Modern Java lets you use arrow syntax `case "ADMIN" -> "Full Access";` which returns values cleanly without needing `break` statements!',
        advanced: 'Modern Java switch expressions (Java 14+) utilize arrow syntax (`case X ->`) to eliminate accidental fall-through bugs. Multi-line switch expression blocks yield return values explicitly using the `yield` keyword.'
      },
      {
        title: '4. Conditional Logic Patterns',
        beginner: 'Keep your decision logic clean! Nesting too many `if` statements inside each other makes code hard to read. Use early returns to exit methods quickly if inputs are invalid.',
        advanced: 'JVM compiles switch statements using specialized bytecode instructions: `tableswitch` for dense continuous integer sets ($O(1)$ lookups) and `lookupswitch` for sparse or hashed keys ($O(\\log N)$ binary searches).'
      }
    ],
    {
      title: 'Decision Engine & Status Handler',
      intro: 'Build an application status mapper using both `if-else` trees and modern Java `switch` expressions.',
      steps: [
        'Create a file named `DecisionEngine.java`.',
        'Add public class structure and main method.',
        'Declare an HTTP status code integer: `int code = 404;`.',
        'Build a modern switch expression yielding a string description: `String status = switch(code) { case 200 -> "OK"; case 404 -> "Not Found"; default -> "Unknown Status"; };`.',
        'Print the resulting status description.',
        'Compile and execute using `javac DecisionEngine.java && java DecisionEngine`.'
      ],
      goal: 'You implemented conditional execution paths using ternary logic and modern arrow-syntax switch expressions.'
    },
    [
      q('Which switch syntax style prevents accidental fall-through without writing explicit `break` statements?', ['Legacy colon syntax (`case X:`)', 'Arrow syntax (`case X ->`)', 'Loop syntax (`while case X`)', 'If-else syntax (`if case X`)'], 1, 'Modern arrow syntax (`case X ->`) executes only the matching block and eliminates fall-through semantics entirely.'),
      q('What keyword explicitly emits a return value from a multi-line block inside a modern Java switch expression?', ['return', 'yield', 'emit', 'break'], 1, 'The `yield` keyword is used inside multi-statement blocks of modern switch expressions to return calculated values.'),
      q('What is the internal bytecode jump structure generated by `javac` for dense contiguous integer switch keys?', ['lookupswitch', 'tableswitch', 'goto_table', 'branch_switch'], 1, 'The JVM utilizes `tableswitch` for dense, contiguous key sets, allowing direct indexing in $O(1)$ constant time.'),
      q('What is the shorthand ternary operator syntax in Java?', ['(condition) ? trueVal : falseVal', 'if (condition) -> trueVal else falseVal', 'check (condition) { trueVal | falseVal }', '(condition) :: trueVal : falseVal'], 0, 'The ternary operator follows the conditional expression layout `(condition) ? trueValue : falseValue`.')
    ],
    [
      'Use `if-else` trees for complex range evaluations; use `switch` expressions for multi-option discrete value matching.',
      'Modern `switch` expressions using arrow syntax (`->`) prevent fall-through errors without requiring explicit `break` statements.',
      'Use the `yield` keyword to emit values from multi-line statement blocks within switch expressions.',
      'The ternary operator `(?:)` provides a clean inline shorthand for simple binary decisions.'
    ]
  ),

  // ==========================================
  // LESSON 5: LOOPS & ITERATION CONTROL
  // ==========================================
  L(
    'java-05', 5, 'Loops & Iteration Control', '🔁',
    '🖥️ **Terminal Notice:** If you want to use a big terminal on your own computer instead of the built-in one, please read Lesson 1 for full setup instructions.\n\nLoops repeat execution blocks automatically. Java features traditional count-controlled `for` loops, entry-conditioned `while` loops, post-tested `do-while` loops, and control jump commands like `break`, `continue`, and labeled loops.',
    [
      {
        title: '1. for Loops & Step Counters',
        beginner: 'A `for` loop is ideal when you know exactly how many times you want to repeat a task. It keeps track of a counter variable, checks a limit condition, and increments the counter on every turn.',
        advanced: 'Standard `for(init; condition; update)` loops compile down to conditional branch instructions (`if_icmpge`). HotSpot JIT applies loop unrolling optimizations to reduce branch overhead.'
      },
      {
        title: '2. while & do-while Loops',
        beginner: 'A `while` loop checks its condition first and keeps running as long as that condition remains true. A `do-while` loop executes its block first before checking the condition, guaranteeing it runs at least once!',
        advanced: '`while` loops perform pre-test condition verification. `do-while` loops perform post-test condition verification, guaranteeing at least one execution pass before evaluating branch boundaries.'
      },
      {
        title: '3. Nested Loops & Matrix Scans',
        beginner: 'You can put loops inside other loops! This is commonly used to process grids, tables, or multi-dimensional coordinate grids (like rows and columns).',
        advanced: 'Nested iteration exhibits $O(N \times M)$ time complexity. Care must be taken to iterate over contiguous memory boundaries to optimize CPU cache line efficiency.'
      },
      {
        title: '4. break, continue & Labeled Jumps',
        beginner: 'Use `break` to stop a loop immediately. Use `continue` to skip the rest of the current pass and jump to the next turn. If you have nested loops, you can label the outer loop (`outerLoop:`) and use `break outerLoop;` to break out of everything at once!',
        advanced: 'Java supports labeled jump statements (e.g., `break targetLabel;`). Labeled breaks transfer execution directly outside the boundary of the designated outer labeled block.'
      }
    ],
    {
      title: 'The Java FizzBuzz & Matrix Scan',
      intro: 'Build the classic FizzBuzz algorithm and scan a 2D matrix using labeled break statements.',
      steps: [
        'Create a file named `LoopSandbox.java`.',
        'Add public class structure and main method.',
        'Write a for loop counting from 1 to 15: If number is divisible by 3 and 5 print "FizzBuzz", if by 3 print "Fizz", if by 5 print "Buzz", else print the number.',
        'Add a nested grid scan: Define a 2D matrix `int[][] grid = {{1, 2}, {99, 4}};`.',
        'Label the outer loop `outer:` and use `break outer;` when `99` is located.',
        'Compile and execute using `javac LoopSandbox.java && java LoopSandbox`.'
      ],
      goal: 'You executed iterative counting loops, managed loop escape jumps, and mastered labeled nested breaks.'
    },
    [
      q('Which loop structure guarantees its body block executes at least once?', ['for loop', 'while loop', 'do-while loop', 'enhanced for-each loop'], 2, 'The `do-while` loop checks its test condition at the end of the iteration block, guaranteeing at least one pass.'),
      q('What does the `continue` keyword do inside an active loop body?', ['Terminates the program completely', 'Skips the remaining statements in the current iteration and moves to the next turn', 'Restarts the loop from index zero', 'Breaks out of all parent loops'], 1, '`continue` halts current iteration statement execution and advances directly to the next loop pass.'),
      q('How do you break out of a outer parent loop from deep inside a nested inner loop?', ['Call `System.exit(0)`', 'Use a labeled break statement such as `break outerLabel;`', 'Write `break break;`', 'Set all counter variables to null'], 1, 'Labeled break statements (`break labelName;`) transfer execution outside the specified outer labeled loop.'),
      q('What optimization does the HotSpot JIT compiler apply to reduce branch overhead in loops?', ['Garbage collection inline', 'Loop unrolling', 'Bytecode deletion', 'Thread sleeping'], 1, 'Loop unrolling duplicates loop bodies to decrease condition checking branch instructions and maximize CPU pipeline execution.')
    ],
    [
      'Choose `for` loops for bounded iterations, `while` for conditional loops, and `do-while` when guaranteed single execution is required.',
      'Use `break` to terminate loop execution early; use `continue` to skip the remaining code in the current iteration.',
      'Labeled loop statements (`break label;`) enable escaping directly out of complex nested loop hierarchies.',
      'Be mindful of loop boundary conditions to prevent infinite execution loops.'
    ]
  ),

  // ==========================================
  // LESSON 6: METHODS, RECURSION & SCOPE
  // ==========================================
  L(
    'java-06', 6, 'Methods, Recursion & Scope', '🛠️',
    '🖥️ **Terminal Notice:** If you want to use a big terminal on your own computer instead of the built-in one, please read Lesson 1 for full setup instructions.\n\nMethods are modular recipes that take inputs, perform operations, and return output results. In Java, understanding method signature design, strictly enforced Pass-by-Value behavior, method overloading rules, and call stack stack frame dynamics is essential for building structured applications.',
    [
      {
        title: '1. Defining Methods & Parameters',
        beginner: 'A method is a reusable block of code. You define it by specifying access rights (`public`), return type (`int`, `String`, or `void` if nothing is returned), a name, and input parameters inside parentheses. Use `return` to send back results.',
        advanced: 'Method definitions specify modifier access flags, return types, parameter signatures, and potential thrown exception lists. Methods returning values must execute explicit `return` instructions across all control branches.'
      },
      {
        title: '2. Pass-by-Value Mechanics in Java',
        beginner: 'Java strictly passes arguments by value! When you pass a primitive variable to a method, Java sends a copy of the number. Modifying it inside the method does NOT change the original variable outside.',
        advanced: 'Java enforces strict Pass-by-Value semantics without exception. For primitives, the raw value bits are copied into the new method frame. For object references, a copy of the heap reference address is passed into the frame slot.'
      },
      {
        title: '3. Method Overloading Dynamics',
        beginner: 'You can create multiple methods with the exact same name as long as their input parameters are different (different number of inputs or different data types). This is called Method Overloading.',
        advanced: 'Method Overloading (compile-time polymorphism) resolves method targets at build time based on signature parameter lists (count, sequence, and types). Changing return types alone is invalid and causes compile errors.'
      },
      {
        title: '4. Recursion & Call Stack Fundamentals',
        beginner: 'A recursive method is a method that calls itself! To prevent it from running forever until your computer crashes, it must have a base case—a condition that stops the self-calling cycle.',
        advanced: 'Every method invocation allocates a new Stack Frame on the JVM execution stack, containing local variable arrays and operand stacks. Recursive calls without reachable base cases cause stack memory exhaustion, triggering a `StackOverflowError`.'
      }
    ],
    {
      title: '🛠️ Mini-Project: Interactive Command-Line Calculator & Unit Converter',
      intro: 'Build a production-grade modular command-line calculator supporting standard operations, safety checks against division by zero, and recursive calculations.',
      steps: [
        'Create a file named `CommandLineCalculator.java`.',
        'Add a `main` loop using `java.util.Scanner` to read user commands interactively.',
        'Implement modular methods: `public static double add(double a, double b)`, `subtract`, `multiply`, `divide`.',
        'Add division safety: In `divide(a, b)`, check `if (b == 0)` and output an arithmetic error instead of failing.',
        'Implement a recursive factorial calculation method: `public static long factorial(int n)` with base case `if (n <= 1) return 1;`.',
        'Compile and test using `javac CommandLineCalculator.java && java CommandLineCalculator`.'
      ],
      goal: 'You successfully designed a modular, interactive CLI tool using clean method structures, pass-by-value guarantees, and recursive algorithms.'
    },
    [
      q('How does Java handle parameter passing when passing variables into methods?', ['It passes primitives by value and objects by reference', 'It passes strictly EVERYTHING by value (copies of primitives or copies of reference addresses)', 'It uses dynamic memory pointers for all parameters', 'It passes parameters via host OS register locations'], 1, 'Java strictly enforces Pass-by-Value. Primitives pass value copies; objects pass reference address copies.'),
      q('What happens if a recursive method lacks a valid terminating base case?', ['It completes instantly with default zero values', 'It runs indefinitely without memory overhead', 'It exhausts execution stack memory and throws a StackOverflowError', 'The compiler automatically fixes the missing logic'], 2, 'Unterminated recursion pushes infinite frames onto the call stack until `StackOverflowError` occurs.'),
      q('Which of the following creates a valid method overload for `public void compute(int x)`?', ['`public int compute(int x)` (changing return type only)', '`public void compute(int x, double y)` (adding a parameter)', '`private void compute(int x)` (changing access modifier only)', '`public void compute(int value)` (changing variable name only)'], 1, 'Method overloading requires altering parameter signature counts, sequences, or types.'),
      q('What stack structure is created on the execution stack whenever a method is called?', ['Heap Object Pointer', 'Metaspace Binary Buffer', 'Stack Frame', 'Garbage Collector Array'], 2, 'Each method call allocates an isolated Stack Frame containing local variable slots and execution operand stacks.')
    ],
    [
      'Methods encapsulate code into reusable units with declared parameters and return types.',
      'Java passes all method arguments strictly by value.',
      'Method Overloading allows multiple methods to share a name if their parameter signatures differ.',
      'Recursive methods must include base cases to prevent `StackOverflowError` exceptions.'
    ]
  ),

  L(
    'java-07', 7, 'Classes, Objects & Constructors', '🛠️',
    '🖥️ **Terminal Notice:** If you want to use a big terminal on your own computer instead of the built-in one, please read Lesson 1 for full setup instructions.\n\nClasses serve as blueprints for real-world entities, bundling data (state) and methods (behavior) together into single units. Understanding object creation, implicit and parameterized constructors, constructor chaining, and explicit object references using `this` forms the foundation of Object-Oriented Programming in Java.',
    [
      {
        title: '1. Object State and Behavior',
        beginner: 'A class is like a blueprint, and an object is a real thing built from that blueprint. Fields (variables) store the object\'s state (like a car\'s speed), while methods define its behavior (like accelerating).',
        advanced: 'Objects encapsulate state maintained in instance fields allocated on the JVM Heap memory, while behaviors are method definitions stored in the Metaspace/Class area executed against instance memory using reference handles.'
      },
      {
        title: '2. Default vs Parameterized Constructors',
        beginner: 'Constructors are special methods used to build and set up new objects when created. If you don\'t write one, Java creates a hidden default constructor for you. Parameterized constructors allow you to pass initial values when creating an object.',
        advanced: 'Constructors initialize object field memory on heap allocation. If no explicit constructor exists, javac auto-generates an implicit public no-arg constructor initializing fields to default primitive/null values. Custom parameterized constructors override this default.'
      },
      {
        title: '3. The `this` Reference',
        beginner: 'The `this` keyword refers to the current object you are working inside. It is useful when your input parameter names match your class variable names so Java knows which one you mean, and for linking constructors together.',
        advanced: 'The `this` keyword holds an explicit reference to the current invoking instance in non-static context. It resolves variable shadowing between parameter scope and instance fields, and enables constructor chaining via explicit `this(...)` calls.'
      }
    ],
    {
      title: '🛠️ Mini-Project: Interactive Car Assembly & Diagnostics System',
      intro: 'Build a class-based Java application that instantiates custom objects using default and parameterized constructors, manipulates state, and uses the `this` keyword for field assignment.',
      steps: [
        'Create a file named `CarDiagnostics.java`.',
        'Define a `Car` class with fields `String model`, `int speed`, and `boolean engineRunning`.',
        'Implement a default constructor setting default fallback values, and a parameterized constructor utilizing `this` to assign custom properties.',
        'Add methods `startEngine()`, `accelerate(int value)`, and `getDiagnostics()` to output vehicle state.',
        'In `main`, instantiate multiple `Car` instances, run accelerations, and observe unique state updates.',
        'Compile and test using `javac CarDiagnostics.java && java CarDiagnostics`.'
      ],
      goal: 'You successfully modeled real-world entities into reusable Java classes, initialized state with constructors, and manipulated instance variables.'
    },
    [
      q('What happens if you do not define any constructors inside a Java class?', ['The code fails to compile', 'The JVM generates a runtime exception when instantiated', 'The Java compiler provides an implicit default no-argument constructor', 'Objects can no longer be instantiated with the `new` keyword'], 2, 'If no explicit constructor is declared, javac injects an implicit no-arg default constructor.'),
      q('What is the primary function of the `this` keyword in Java?', ['It allocates new memory on the JVM stack', 'It refers to the current executing instance of a class', 'It prevents classes from being extended by subclasses', 'It allows calling static methods inside abstract classes'], 1, 'The `this` keyword represents an explicit memory handle pointing to the current object instance.'),
      q('Where is object instance state data stored in JVM memory during execution?', ['In Metaspace memory', 'Inside local thread register stack frames', 'On the Heap memory', 'Inside CPU cache blocks'], 2, 'Objects and their instance fields are allocated dynamically on the JVM Heap memory.')
    ],
    [
      'Classes act as software blueprints defining object state (fields) and behavior (methods).',
      'Implicit default constructors are automatically provided only when no custom constructors are explicitly defined.',
      'The `this` reference identifies the active instance and resolves variable scope ambiguity.'
    ]
  ),

  L(
    'java-08', 8, 'Encapsulation & Access Modifiers', '🛠️',
    '🖥️ **Terminal Notice:** If you want to use a big terminal on your own computer instead of the built-in one, please read Lesson 1 for full setup instructions.\n\nEncapsulation is the defensive programming technique of restricting direct access to object components. By leveraging strict visibility controls (`private`, package-private, `protected`, `public`), getter/setter access patterns, and class immutability rules, you can safeguard object integrity against invalid mutations.',
    [
      {
        title: '1. Access Modifiers Matrix',
        beginner: 'Access modifiers control who can see or change your variables and methods. `private` hides items inside the same class, package-private (no modifier) allows access in the same folder, `protected` lets subclasses see them, and `public` opens access to everyone.',
        advanced: 'Java controls accessibility across four visibility boundaries: `private` (class-bound scope), default package-private (package boundary), `protected` (package + inheritance hierarchy across packages), and `public` (unrestricted global JVM access).'
      },
      {
        title: '2. Getter/Setter Patterns & Encapsulation',
        beginner: 'Encapsulation keeps your variables `private` and forces external code to use public getter (read) and setter (write) methods. This lets you inspect or block bad data before saving it to an variable.',
        advanced: 'Encapsulation decouples field representation from operational APIs. Setter methods enforce validation invariants, state integrity checks, and side-effect controls prior to mutating internal instance state.'
      },
      {
        title: '3. Immutability Principles',
        beginner: 'An immutable object is an object that cannot be changed once created (like a Java `String`). You make a class immutable by making fields `final` and `private`, avoiding setters, and fully setting state inside the constructor.',
        advanced: 'Immutable class design requires declaring classes `final` (to prevent subclass overrides), declaring fields `private final`, withholding state mutation setters, and performing deep copy defensive reads/writes for mutable reference types.'
      }
    ],
    {
      title: '🛠️ Mini-Project: Secure User Account & Credential Vault',
      intro: 'Construct an encapsulated user management component enforcing validation rules via setters and creating an immutable user record.',
      steps: [
        'Create a file named `SecureVault.java`.',
        'Create a `UserAccount` class with `private` fields `username`, `password`, and `balance`.',
        'Provide public getters, and write a guarded `setBalance(double amount)` setter that rejects negative balance adjustments.',
        'Create an immutable `UserRecord` class using `final` fields without setters.',
        'In `main`, instantiate accounts, trigger validation rules on invalid balance updates, and verify data security.',
        'Compile and execute using `javac SecureVault.java && java SecureVault`.'
      ],
      goal: 'You built an encapsulated system that enforces strict data validation using visibility controls and immutable class structures.'
    },
    [
      q('Which access modifier restricts field visibility strictly to the declaring class alone?', ['`protected`', '`package-private`', '`private`', '`public`'], 2, '`private` is the most restrictive access modifier, limiting access solely to within the declaring class.'),
      q('How do getter and setter methods enforce the principle of Encapsulation?', ['They speed up CPU execution rates', 'They restrict direct field mutation and allow validation checks', 'They force all fields to become constant final values', 'They automatically convert primitive variables into wrapper classes'], 1, 'Encapsulation hides direct fields and forces external modification through validation logic inside setters.'),
      q('Which technique is mandatory when designing a truly immutable Java class containing mutable references?', ['Marking all methods static', 'Defensive copying of mutable objects inside constructors and getters', 'Allowing direct public access to fields', 'Removing all custom constructors'], 1, 'Immutable classes must create defensive copies of mutable reference fields to prevent external state tampering.')
    ],
    [
      'Encapsulation hides raw implementation fields and exposes controlled public interfaces.',
      'Access modifiers enforce code security across class, package, and subclass boundaries.',
      'Immutable classes protect object state permanently by utilizing private final fields and defensive copying.'
    ]
  ),

  L(
    'java-09', 9, 'Inheritance, Method Overriding & super', '🛠️',
    '🖥️ **Terminal Notice:** If you want to use a big terminal on your own computer instead of the built-in one, please read Lesson 1 for full setup instructions.\n\nInheritance allows new classes to acquire properties and behaviors from existing parent classes using `extends`. Mastering inheritance involves navigating single vs. multi-level hierarchies, overriding methods dynamically at runtime, and accessing parent class features using the `super` keyword.',
    [
      {
        title: '1. Extending Classes (Single vs Multi-Level)',
        beginner: 'Inheritance lets a child class reuse code from a parent class using the `extends` keyword. Java allows single inheritance (one direct parent) and multi-level inheritance (grandparent -> parent -> child), but does not allow inheriting directly from multiple classes at once.',
        advanced: 'Java supports single class inheritance and multi-level class extension chains to eliminate duplicate bytecode. Multiple direct class inheritance (`extends A, B`) is prohibited to eliminate structural diamond ambiguity.'
      },
      {
        title: '2. Dynamic Method Dispatch & Overriding',
        beginner: 'Method overriding happens when a child class rewrites a parent method to change its action. Dynamic Method Dispatch means Java picks which method version to call at runtime based on the actual object created, not the reference type.',
        advanced: 'Method Overriding requires identical method names, parameter lists, and compatible return types. Dynamic Method Dispatch resolves virtual method calls dynamically at execution runtime using the object\'s internal vtable lookup.'
      },
      {
        title: '3. The `super` Keyword Mechanics',
        beginner: 'The `super` keyword lets you talk to the parent class. You can call the parent class\'s constructor using `super()`, or invoke parent methods using `super.methodName()` if you override them in the child class.',
        advanced: 'The `super` reference grants explicit access to direct parent class supertype context. `super(...)` delegates constructor execution up the chain (and must sit on line 1 of the child constructor), while `super.method()` invokes superclass virtual methods directly.'
      }
    ],
    {
      title: '🛠️ Mini-Project: Employee Payroll Hierarchy System',
      intro: 'Build a multi-level employee payment manager that overrides calculation methods dynamically based on roles using inherited properties.',
      steps: [
        'Create a file named `PayrollSystem.java`.',
        'Create a base class `Employee` with fields `name`, `baseSalary`, and a method `calculatePay()`.',
        'Create a child class `Manager` extending `Employee` that adds a `bonus` field and overrides `calculatePay()` using `super.calculatePay()`.',
        'Create a sub-child class `Executive` extending `Manager` that overrides `calculatePay()` to include stock options.',
        'In `main`, instantiate polymorphically (`Employee e = new Executive(...);`) and execute `calculatePay()`.',
        'Compile and test using `javac PayrollSystem.java && java PayrollSystem`.'
      ],
      goal: 'You implemented a dynamic class hierarchy utilizing method overriding, constructor delegation, and dynamic runtime method dispatch.'
    },
    [
      q('Why does Java disallow inheriting from multiple direct parent classes simultaneously?', ['To save physical RAM', 'To avoid structural diamond ambiguity conflicts', 'Because interfaces are faster than classes', 'To enforce private field access'], 1, 'Java avoids multiple class inheritance to eliminate method resolution ambiguity known as the Diamond Problem.'),
      q('What determines which overridden method gets called during execution when using dynamic method dispatch?', ['The reference type declared on the left', 'The compiler flag settings', 'The actual underlying runtime object instance on the heap', 'The file directory location'], 2, 'Runtime object type determines method invocation via dynamic dispatch execution.'),
      q('Where must the `super()` call be placed inside a subclass constructor?', ['At the very end of the constructor block', 'Inside a try-catch block', 'On the very first executable line of the subclass constructor', 'It can be placed on any line'], 2, 'Parent constructor invocation `super()` must always execute first on line 1 of a subclass constructor.')
    ],
    [
      'Inheritance shares code across class hierarchies using single and multi-level extensions.',
      'Dynamic Method Dispatch selects the correct overridden method implementation at runtime.',
      'The `super` keyword invokes parent class constructors and accesses supertype method logic.'
    ]
  ),

  L(
    'java-10', 10, 'Polymorphism & Method Overloading', '🛠️',
    '🖥️ **Terminal Notice:** If you want to use a big terminal on your own computer instead of the built-in one, please read Lesson 1 for full setup instructions.\n\nPolymorphism ("many forms") empowers Java programs to treat distinct subclasses through uniform superclass interfaces. This lesson covers compile-time polymorphism (method overloading), runtime polymorphism (method overriding), method signature rules, and variable argument lists (`varargs`).',
    [
      {
        title: '1. Compile-Time vs Runtime Polymorphism',
        beginner: 'Polymorphism allows objects to act in different ways. Compile-time polymorphism happens when method overloading picks the right method while building the code. Runtime polymorphism happens when method overriding decides which action to take while running.',
        advanced: 'Compile-Time Polymorphism (Static Binding) resolves method call targets during compilation based on static signatures. Runtime Polymorphism (Dynamic Binding) delays target resolution until execution based on dynamic heap object types.'
      },
      {
        title: '2. Method Signatures & Overloading Rules',
        beginner: 'Method Overloading means having multiple methods with identical names but different parameter lists (different number or types of parameters). Changing only the return type (`void` vs `int`) is NOT allowed and causes a compiler error!',
        advanced: 'Method Signatures consist exclusively of method name and ordered parameter type lists. Overloading requires unique signatures. Altering visibility, exceptions, or return types alone yields a duplicate method compilation error.'
      },
      {
        title: '3. Variable Arguments (`varargs`)',
        beginner: 'Varargs let a method accept zero, one, or many arguments of the same type using three dots (`String... items`). Inside the method, Java turns those items into a standard array for you.',
        advanced: 'Varargs parameters (`Type... name`) act as implicit syntactic sugar for array parameters (`Type[]`). Java allows only one varargs parameter per method, and it must sit in the final signature position.'
      }
    ],
    {
      title: '🛠️ Mini-Project: Universal Notification Dispatcher',
      intro: 'Build a flexible notification logging service leveraging compile-time method overloading, varargs message handling, and runtime polymorphic dispatches.',
      steps: [
        'Create a file named `NotificationService.java`.',
        'Create a `Notifier` class containing overloaded methods: `send(String msg)`, `send(String msg, int priority)`, and `send(String... batchMessages)`.',
        'Implement a sub-class `SMSNotifier` overriding `send(String msg)` to prepend carrier metadata.',
        'In `main`, demonstrate overloaded method invocations and varargs processing across multiple parameter configurations.',
        'Compile and execute using `javac NotificationService.java && java NotificationService`.'
      ],
      goal: 'You designed a polymorphic notification module using static overloading, runtime overriding, and variable parameter lists.'
    },
    [
      q('Which mechanism resolves method selection for static method overloading?', ['Dynamic dispatch lookup', 'Compile-time resolution based on static parameter signatures', 'Garbage collector execution', 'Runtime Reflection API'], 1, 'Overloading is resolved during compilation by matching arguments against method signature parameters.'),
      q('Which parameter list change successfully creates a valid method overload for `void render(int x)`?', ['`int render(int x)`', '`void render(int y)`', '`void render(int x, double y)`', '`private void render(int x)`'], 2, 'Changing argument type signatures (adding double y) creates a valid method overload.'),
      q('What is the rule regarding the position of varargs parameters inside Java method signatures?', ['Varargs can be placed anywhere in the parameter list', 'Varargs must always be the final parameter declared in the method signature', 'A method can have up to three distinct varargs parameters', 'Varargs parameters can only be used inside static initializers'], 1, 'Java enforces that varargs parameters must be positioned at the very end of method parameter lists.')
    ],
    [
      'Static overloading provides compile-time polymorphism based on signature differences.',
      'Dynamic overriding provides runtime polymorphism using heap instance execution.',
      'Varargs wrap flexible numbers of incoming method arguments into implicitly typed arrays.'
    ]
  ),

  L(
    'java-11', 11, 'Abstraction: Abstract Classes vs Interfaces', '🛠️',
    '🖥️ **Terminal Notice:** If you want to use a big terminal on your own computer instead of the built-in one, please read Lesson 1 for full setup instructions.\n\nAbstraction decouples what an operational component does from how it is internally implemented. This lesson breaks down abstract classes, pure interface contracts, functional interfaces, `default`/`static` interface methods, and multiple inheritance using interface implementations.',
    [
      {
        title: '1. Abstract Classes vs Interfaces',
        beginner: 'Abstract classes are partial templates that can hold state variables, regular methods, and abstract methods (methods without a body). Interfaces are pure contracts defining what methods a class must implement. A class can implement multiple interfaces, but extend only one class.',
        advanced: 'Abstract classes support partial implementation, instance fields, state management, and constructor inheritance via single extension chains. Interfaces define pure behavioral type contracts, support multiple implementations, and contain static constants with stateless default logic.'
      },
      {
        title: '2. Default, Static & Private Interface Methods',
        beginner: 'Modern Java interfaces can include `default` methods (methods with full code bodies so you do not break existing classes), `static` helper methods, and `private` helper methods used internally to share code between default methods.',
        advanced: 'Default methods enable interface contract evolution without breaking implementation classes. Static interface methods serve as utility functions, while private interface methods encapsulate shared execution logic between internal interface default methods.'
      },
      {
        title: '3. Functional Interfaces',
        beginner: 'A Functional Interface is a special interface that contains exactly ONE abstract method. They are marked with `@FunctionalInterface` and are the foundation for writing clean Lambda expressions in Java.',
        advanced: 'Functional Interfaces enforce a single abstract method (SAM) contract, enabling direct instance target mapping for Lambda expressions and method references. They are annotated with `@FunctionalInterface` for build-time validation.'
      }
    ],
    {
      title: '🛠️ Mini-Project: Payment Processing & Gateway Engine',
      intro: 'Build a decoupled payment engine utilizing abstract accounts, interface transaction contracts, and functional processing blocks.',
      steps: [
        'Create a file named `PaymentEngine.java`.',
        'Define an interface `Payable` with abstract method `boolean processPayment(double amount)` and a `default void logTransaction()` method.',
        'Define a `@FunctionalInterface` named `TaxCalculator` with method `double computeTax(double amount)`.',
        'Create an abstract class `PaymentGateway` implementing shared metadata fields.',
        'Create `CreditCardGateway` extending `PaymentGateway` and implementing `Payable`.',
        'In `main`, execute payments and calculate taxes using lambda instances.',
        'Compile and test using `javac PaymentEngine.java && java PaymentEngine`.'
      ],
      goal: 'You built an abstract system utilizing decoupled interfaces, default operational methods, and functional SAM target structures.'
    },
    [
      q('What is a key difference between abstract classes and interfaces in Java?', ['Abstract classes cannot have constructors', 'A class can implement multiple interfaces but extend only one class', 'Interfaces can maintain mutable private instance state fields', 'Abstract classes cannot contain concrete methods'], 1, 'Java allows multiple interface implementation while enforcing single class inheritance extension.'),
      q('What defines a valid Functional Interface in Java?', ['It must contain only static methods', 'It contains exactly one single abstract method (SAM)', 'It must be declared private final', 'It cannot extend any parent interface'], 1, 'Functional interfaces strictly require exactly one abstract method signature.'),
      q('Why were default methods introduced into Java interfaces?', ['To allow multiple class instance variable storage', 'To enable interface evolution without breaking existing implementing classes', 'To remove abstract classes completely from Java', 'To replace the `public` modifier'], 1, 'Default methods allow adding new interface capabilities while maintaining backward compatibility.')
    ],
    [
      'Abstract classes provide partial templates with shared instance state and methods.',
      'Interfaces define multi-implementation contracts and support `default`/`static` utility logic.',
      'Functional Interfaces enforce Single Abstract Method rules to enable clean lambda syntax.'
    ]
  ),

  L(
    'java-12', 12, 'Advanced OOP Concepts', '🛠️',
    '🖥️ **Terminal Notice:** If you want to use a big terminal on your own computer instead of the built-in one, please read Lesson 1 for full setup instructions.\n\nAdvanced OOP concepts complete Java\'s object model. This lesson covers global static members, unmodifiable `final` modifiers, fundamental universal methods inherited from `Object` (`equals`, `hashCode`, `toString`), strongly typed `Enums`, and primitive Autoboxing/Unboxing via Wrapper Classes.',
    [
      {
        title: '1. Static Members & Final Modifiers',
        beginner: '`static` variables and methods belong to the class itself rather than individual objects—there is only one copy shared by everyone. `final` makes things unchangeable: constants for variables, un-overridable methods, and un-extendable classes.',
        advanced: '`static` members allocate once in class Metaspace and execute without instance instantiation. `final` variables prohibit reassignment, `final` methods prevent virtual dispatch overriding, and `final` classes block subclass inheritance trees.'
      },
      {
        title: '2. Object Class Universal Methods',
        beginner: 'All classes automatically inherit from the root `Object` class. You override `toString()` to print readable text, `equals()` to compare actual values instead of memory addresses, and `hashCode()` so objects work inside HashMaps.',
        advanced: 'Root `java.lang.Object` methods establish universal standard operations. Override `equals(Object)` to check structural equality rather than reference identity (`==`), and enforce the `hashCode()` contract to guarantee hash bucket alignment.'
      },
      {
        title: '3. Enums & Wrapper Classes',
        beginner: 'Enums are type-safe sets of constant values (like days of the week). Wrapper classes (`Integer`, `Double`) wrap primitive numbers into real objects so they work inside collections, using auto-boxing to switch between them automatically.',
        advanced: 'Enums compile into type-safe `java.lang.Enum` subclasses featuring fields, methods, and constants. Wrapper classes (`Integer`, `Boolean`) bridge primitives to reference objects via automatic compiler Autoboxing and Unboxing conversions.'
      }
    ],
    {
      title: '🛠️ Mini-Project: Enterprise Account Management System',
      intro: 'Build the full Banking & Account Management System integrating static IDs, final rules, overridden object equality, Enums, and custom type implementations.',
      steps: [
        'Create a file named `BankingSystem.java`.',
        'Create an `AccountStatus` Enum with values `ACTIVE`, `FROZEN`, and `CLOSED`.',
        'Create an abstract class `BankAccount` with static counters for account number generation, private final state fields, and overridden `equals()`, `hashCode()`, and `toString()`.',
        'Create concrete child classes `SavingsAccount` (with min balance rules) and `CheckingAccount` (with overdraft limits).',
        'In `main`, instantiate accounts inside a list, trigger transfers, test object structural equality using `.equals()`, and manage account enum statuses.',
        'Compile and execute using `javac BankingSystem.java && java BankingSystem`.'
      ],
      goal: 'You built an enterprise account system integrating static state counters, object equality contracts, enums, final rules, and inheritance hierarchies.'
    },
    [
      q('What happens when you attempt to override a method declared as `final` in a parent class?', ['The child method executes successfully at runtime', 'The compiler raises a build error', 'The parent method gets permanently deleted from memory', 'The method converts automatically into a static context'], 1, 'The compiler rejects overriding `final` parent methods.'),
      q('What is the crucial relationship contract between `equals()` and `hashCode()` in Java?', ['If two objects are equal according to `equals()`, they must return identical `hashCode()` values', '`hashCode()` must return unique values for all objects even if `equals()` returns true', '`equals()` compares primitives while `hashCode()` compares objects', '`hashCode()` must be overridden only when using abstract classes'], 0, 'Equal objects must always return equal hash code integers to maintain collection contract integrity.'),
      q('What automatic operation converts a primitive type (e.g., `int`) into its corresponding Wrapper object (`Integer`)?', ['Downcasting', 'Autoboxing', 'Dynamic Dispatch', 'Type Erasure'], 1, 'Autoboxing is the automatic compilation conversion of primitive types into object wrappers.')
    ],
    [
      '`static` members share single-instance data across class contexts; `final` locks definitions permanently.',
      'Overriding `equals()` and `hashCode()` maintains object structural comparison standards.',
      'Enums provide strongly typed constants, while Wrapper classes bridge primitives to dynamic object contexts.'
    ]
  ),

  L(
    'java-13', 13, 'Arrays, Multi-dimensional Arrays & Search Logic', '🛠️',
    '🖥️ **Terminal Notice:** If you want to use a big terminal on your own computer instead of the built-in one, please read Lesson 1 for full setup instructions.\n\nArrays are foundational data structures that store multiple variables of the same type in contiguous memory. Mastering fixed-size allocation, traversing 2D matrices, and applying fundamental sorting and search algorithms (like Binary Search) is essential for effective data manipulation.',
    [
      {
        title: '1. Array Memory Allocation',
        beginner: 'An array is a fixed-size container that holds items of the same data type. Once you declare an array to hold 5 items, you cannot resize it. Memory is reserved sequentially, making retrieving elements by their index number extremely fast.',
        advanced: 'Arrays are objects stored on the JVM Heap. Contiguous memory allocation ensures O(1) time complexity for indexed access. Array sizes are immutable post-initialization, and out-of-bounds access immediately throws an `ArrayIndexOutOfBoundsException`.'
      },
      {
        title: '2. Multi-dimensional Arrays (Matrix Operations)',
        beginner: 'A multi-dimensional array is simply an array of arrays—often visualized as a table or a grid with rows and columns. You access elements using two sets of brackets, like `grid[row][column]`.',
        advanced: 'Java handles 2D arrays as arrays of array references, meaning row lengths can vary (jagged arrays). Memory is not strictly a single contiguous 2D block, but rather a primary array pointing to disjoint row arrays scattered on the Heap.'
      },
      {
        title: '3. Searching & Sorting Algorithms',
        beginner: 'Linear Search checks every item one by one. Binary Search is much faster, dividing the search area in half each time, but it only works if the array is already sorted! We also use algorithms like Bubble Sort or Selection Sort to organize our data.',
        advanced: 'Linear search operates in O(n) time. Binary search leverages divide-and-conquer principles to achieve O(log n) time, requiring a pre-sorted dataset. Sorting algorithms reorganize contiguous memory allocations based on comparable object criteria.'
      }
    ],
    {
      title: '🛠️ Mini-Project: 2D Grid Matrix Searcher',
      intro: 'Build an application that generates a multi-dimensional array, populates it with random integers, and performs search operations to locate specific coordinates.',
      steps: [
        'Create a file named `MatrixSearcher.java`.',
        'Initialize a `int[][] grid = new int[5][5];` and populate it with random numbers.',
        'Write a nested loop to format and print the grid to the console.',
        'Implement a method `findCoordinates(int[][] targetGrid, int value)` that returns the row and column of a given number.',
        'Implement `Arrays.sort()` on a 1D array extraction and perform a binary search using `Arrays.binarySearch()`.',
        'Compile and execute using `javac MatrixSearcher.java && java MatrixSearcher`.'
      ],
      goal: 'You successfully manipulated contiguous heap memory, traversed multi-dimensional arrays, and executed both linear and binary searches.'
    },
    [
      q('What is a fundamental limitation of standard Java arrays?', ['They cannot store primitive data types', 'Their size is fixed and cannot be changed after instantiation', 'They can only hold a maximum of 256 elements', 'They require manual memory deallocation'], 1, 'Standard arrays in Java are immutable in length; resizing requires creating an entirely new array object.'),
      q('Which of the following is an absolute requirement before executing a Binary Search on an array?', ['The array must contain only positive integers', 'The array must be multi-dimensional', 'The array must already be sorted in ascending order', 'The array must have an even number of elements'], 2, 'Binary Search relies on sorted data to determine which half of the data set to eliminate on each iteration.'),
      q('How does Java structure a 2D array in memory?', ['As a single contiguous block of rectangular memory', 'As an array of reference pointers pointing to distinct row arrays', 'As a linked list of primitive values', 'As a stack of virtual memory registers'], 1, 'Java implements 2D arrays as "arrays of arrays", allowing for jagged rows rather than forcing a strict rectangular memory block.')
    ],
    [
      'Arrays allocate contiguous fixed-size memory, enabling O(1) indexed element access.',
      'Java 2D arrays are jagged arrays of references rather than strict memory grids.',
      'Binary Search provides O(log n) performance but strictly requires pre-sorted datasets.'
    ]
  ),

  L(
    'java-14', 14, 'String Manipulation, StringBuilder & Regex', '🛠️',
    '🖥️ **Terminal Notice:** If you want to use a big terminal on your own computer instead of the built-in one, please read Lesson 1 for full setup instructions.\n\nText processing is fundamental to software development. This lesson explains Java\'s unique String Pool memory optimization, the consequences of String immutability, performance gains using `StringBuilder`, and advanced text pattern matching using Regular Expressions.',
    [
      {
        title: '1. String Pool & Immutability',
        beginner: 'In Java, Strings are immutable—once created, they cannot be changed. If you try to change a String, Java actually creates a brand new one. To save memory, Java stores matching text in a special cache called the String Pool.',
        advanced: 'String immutability guarantees thread safety and prevents security vulnerabilities. Literal string declarations are interned into the JVM String Pool (stored in Heap memory) to reuse matching character sequences and reduce memory footprints.'
      },
      {
        title: '2. StringBuilder vs StringBuffer',
        beginner: 'Because Strings cannot be changed, modifying them inside loops creates hundreds of wasted memory copies. `StringBuilder` is a special class that lets you edit text rapidly and efficiently without creating new copies every time.',
        advanced: '`StringBuilder` relies on a mutable character array buffer, avoiding the O(n^2) garbage collection overhead of continuous String concatenation. `StringBuffer` offers identical functionality but enforces thread-safe synchronization overhead.'
      },
      {
        title: '3. Regular Expressions (Pattern & Matcher)',
        beginner: 'Regular Expressions (Regex) are special text strings used for describing search patterns. You can use them to validate if an input looks like a valid email address or to strip out unwanted symbols from a paragraph.',
        advanced: 'The `java.util.regex` package provides `Pattern` (compiled regex representation) and `Matcher` (execution engine). Regex operations use finite state machines to validate data structures and extract group-captured substrings efficiently.'
      }
    ],
    {
      title: '🛠️ Mini-Project: Regex Log Parser & String Optimizer',
      intro: 'Build a utility that reads raw server log strings, efficiently extracts error codes using Regex, and formats an output report using StringBuilder.',
      steps: [
        'Create a file named `LogParser.java`.',
        'Create a raw String variable containing simulated server logs with IP addresses and error codes.',
        'Use `Pattern` and `Matcher` with the regex `\\b[0-9]{3}\\b` to identify HTTP status codes.',
        'Instantiate a `StringBuilder` to collect and format the identified errors into a readable report.',
        'Compare the execution time of using standard `+` string concatenation versus `StringBuilder.append()` inside a loop.',
        'Compile and execute using `javac LogParser.java && java LogParser`.'
      ],
      goal: 'You managed text processing securely utilizing the String Pool, optimized concatenation with StringBuilder, and validated patterns with Regex.'
    },
    [
      q('Why are Strings designed to be immutable in Java?', ['To allow dynamic memory resizing', 'To enforce thread safety, caching, and security invariants', 'Because characters take up too much memory', 'To allow strings to inherit from the Integer class'], 1, 'Immutability allows safe sharing in the String Pool, prevents unauthorized data mutation in security protocols, and ensures thread safety.'),
      q('What is the primary difference between `StringBuilder` and `StringBuffer`?', ['StringBuilder is mutable; StringBuffer is immutable', 'StringBuffer is synchronized and thread-safe; StringBuilder is not', 'StringBuilder only handles integers', 'StringBuffer cannot be converted back to a String'], 1, '`StringBuffer` is synchronized for multi-threaded safety, making it slower. `StringBuilder` is unsynchronized and faster for single-threaded tasks.'),
      q('Which regex pattern matches exactly three consecutive digits?', ['`\\D{3}`', '`[a-z]{3}`', '`\\d{3}`', '`\\w+3`'], 2, 'The `\\d` character class represents a digit, and `{3}` specifies exactly three occurrences.')
    ],
    [
      'Java Strings are strictly immutable; operations that modify text always return new object instances.',
      'Use `StringBuilder` to mutate text inside loops to prevent excessive Heap memory allocation.',
      'The `Pattern` and `Matcher` classes apply Regular Expressions to parse and validate text data.'
    ]
  ),

  L(
    'java-15', 15, 'Java Collections Framework — Lists & Sets', '🛠️',
    '🖥️ **Terminal Notice:** If you want to use a big terminal on your own computer instead of the built-in one, please read Lesson 1 for full setup instructions.\n\nThe Java Collections Framework provides standardized, dynamic data structures that automatically resize themselves. Understanding when to use ordered, duplicate-allowing `Lists` versus unordered, unique `Sets` is crucial for writing efficient algorithms.',
    [
      {
        title: '1. Lists (ArrayList vs LinkedList)',
        beginner: 'A List is an ordered collection that allows duplicate items. `ArrayList` acts like a dynamic array—great for reading data quickly. `LinkedList` acts like a chain of connected nodes—great for adding or deleting items in the middle of the list.',
        advanced: '`ArrayList` uses a dynamically resizing backing array, offering O(1) random access but O(n) arbitrary insertions. `LinkedList` implements doubly-linked nodes, yielding O(1) insertions at known nodes but O(n) for indexed traversal.'
      },
      {
        title: '2. Sets (HashSet vs TreeSet)',
        beginner: 'A Set is a collection that automatically rejects duplicate items! `HashSet` is the fastest but scrambles the order of your items. `TreeSet` is slightly slower but keeps your items perfectly sorted alphabetically or numerically.',
        advanced: '`HashSet` is backed by a HashMap using object hash codes for O(1) lookups and insertions. `TreeSet` implements a Red-Black tree structure guaranteeing O(log n) operations while maintaining strict `Comparable` ordering.'
      },
      {
        title: '3. Performance Comparison (O(1) vs O(n))',
        beginner: 'Choosing the right collection speeds up your app. If you need to search if an item exists out of a million items, a List will check one by one (slow), but a HashSet will instantly know if it exists (fast).',
        advanced: 'Understanding Big-O time complexity is critical. Using `List.contains()` is an O(n) linear operation. Using `Set.contains()` is an O(1) constant time operation, providing massive performance gains for large datasets.'
      }
    ],
    {
      title: '🛠️ Mini-Project: Unique Visitor Tracker & Roster',
      intro: 'Build a dynamic registration system that separates all login attempts into a sequential List, and automatically isolates unique visitors using a Set.',
      steps: [
        'Create a file named `VisitorTracker.java`.',
        'Instantiate an `ArrayList<String>` to record every sequential login attempt, including duplicates.',
        'Instantiate a `HashSet<String>` to automatically store strictly unique usernames.',
        'Add mock data (e.g., "Alice", "Bob", "Alice", "Charlie") to both collections.',
        'Iterate through the `ArrayList` to print the timeline, then print the `HashSet` to show the deduplicated unique visitor count.',
        'Compile and execute using `javac VisitorTracker.java && java VisitorTracker`.'
      ],
      goal: 'You implemented dynamic collections, distinguishing between ordered sequential lists and deduplicated hashing sets.'
    },
    [
      q('Which Collection implementation should you choose if you need lightning-fast retrieval of elements by their integer index?', ['`LinkedList`', '`TreeSet`', '`ArrayList`', '`HashSet`'], 2, '`ArrayList` uses contiguous array memory mapping, providing O(1) constant-time access by index.'),
      q('How does a `HashSet` determine if an incoming object is a duplicate?', ['By checking the variable names', 'By comparing the lengths of the strings', 'By evaluating the object\'s `equals()` and `hashCode()` methods', 'By compiling the code sequentially'], 2, 'Sets rely on identical `hashCode()` buckets and `equals()` true returns to identify and reject duplicate objects.'),
      q('What is the defining characteristic of a `TreeSet`?', ['It permits multiple duplicate entries', 'It stores elements in a completely random order', 'It stores elements in sorted, ascending order based on their natural comparison', 'It allows O(1) insertion time across the board'], 2, '`TreeSet` utilizes a Red-Black tree algorithm to keep all elements continuously sorted.')
    ],
    [
      '`Lists` maintain insertion order and permit duplicate elements, making them ideal for sequences.',
      '`Sets` strictly reject duplicate elements by relying on hash codes or tree sorting algorithms.',
      'Selecting the correct Collection implementation drastically alters Big-O algorithm performance.'
    ]
  ),

  L(
    'java-16', 16, 'Java Collections Framework — Maps & Queues', '🛠️',
    '🖥️ **Terminal Notice:** If you want to use a big terminal on your own computer instead of the built-in one, please read Lesson 1 for full setup instructions.\n\nMaps associate distinct keys to specific values, acting like digital dictionaries. Queues enforce specific processing orders (like First-In-First-Out). Mastering these collections enables efficient data lookups and task scheduling.',
    [
      {
        title: '1. Maps (HashMap vs TreeMap)',
        beginner: 'A Map stores Key-Value pairs (like a dictionary storing a Word and a Definition). Keys must be unique! `HashMap` is extremely fast for lookups but unordered. `TreeMap` keeps all your keys sorted automatically.',
        advanced: 'Maps do not inherit from the `Collection` interface. `HashMap` uses hashing algorithms to map keys to bucket indices for O(1) retrieval. `TreeMap` uses tree structures to maintain key order, resulting in O(log n) operations.'
      },
      {
        title: '2. PriorityQueue & ArrayDeque',
        beginner: 'A Queue works like a line at a grocery store—First-In, First-Out (FIFO). `ArrayDeque` is a double-ended queue where you can add/remove from both ends. `PriorityQueue` cuts the line, automatically sorting the most important items to the front.',
        advanced: '`Queue` implementations dictate processing order. `ArrayDeque` handles stack/queue duties faster than standard LinkedLists. `PriorityQueue` utilizes a min-heap structure to ensure the head always represents the smallest/highest-priority element.'
      },
      {
        title: '3. Map Operations & Iteration',
        beginner: 'You cannot loop through a Map directly. You have to loop through its "Key Set" (all the keys) or its "Entry Set" (the matched pairs). Standard methods include `put()`, `get()`, `containsKey()`, and `remove()`.',
        advanced: 'Iterating via `map.entrySet()` is significantly more efficient than looping via `map.keySet()` and retrieving values, as `entrySet()` provides the localized node holding both the key and value simultaneously.'
      }
    ],
    {
      title: '🛠️ Mini-Project: Support Ticket Queue & Lookup Map',
      intro: 'Build a customer service simulator that queues pending support tickets and stores closed resolutions in a fast-lookup dictionary.',
      steps: [
        'Create a file named `SupportDesk.java`.',
        'Create a `Queue<String>` using `ArrayDeque` to represent incoming customer tickets (FIFO).',
        'Create a `Map<String, String>` using `HashMap` to store resolved tickets (Key: TicketID, Value: Resolution Details).',
        'Write logic to `.poll()` (remove and read) the next ticket in line from the queue.',
        'Process the ticket by `.put()`ting it into the HashMap with a resolution status.',
        'Loop through the `entrySet()` of the map to print the final resolution report.',
        'Compile and execute using `javac SupportDesk.java && java SupportDesk`.'
      ],
      goal: 'You implemented FIFO processing pipelines using Queues and O(1) Key-Value dictionary lookups using Maps.'
    },
    [
      q('What happens if you insert a Key-Value pair into a HashMap where the Key already exists?', ['An Exception is thrown and the program crashes', 'The new pair is appended, creating a duplicate key', 'The existing value is silently overwritten with the new value', 'The Map automatically resizes to accommodate both keys'], 2, 'Map Keys must be entirely unique; inserting an existing key overwrites its associated value.'),
      q('Which Collection interface does the `Map` class extend?', ['`List`', '`Set`', '`Collection`', 'None of the above'], 3, '`Map` forms its own independent hierarchy in Java and does NOT extend the base `Collection` interface.'),
      q('How does a `PriorityQueue` determine which element should be at the front of the line?', ['Based on the order they were inserted (FIFO)', 'Based on their natural ordering or a custom Comparator', 'Based on a Random number generator', 'Based on the size of the objects'], 1, 'Priority queues constantly re-sort elements based on comparability, putting the "smallest" or highest-priority items at the head.')
    ],
    [
      '`Maps` establish distinct Key-Value pairs, allowing instant value lookups without iterative searching.',
      '`Queues` manage sequence flow, prioritizing elements by insertion order or natural sorting priorities.',
      'Iterating through Map entries is best achieved using `entrySet()` for memory and performance efficiency.'
    ]
  ),

  L(
    'java-17', 17, 'Generics & Type Safety', '🛠️',
    '🖥️ **Terminal Notice:** If you want to use a big terminal on your own computer instead of the built-in one, please read Lesson 1 for full setup instructions.\n\nGenerics allow developers to abstract over data types while enforcing strict type safety at compile time. By using Generics, you avoid dangerous runtime `ClassCastException` errors, create flexible custom classes, and define boundary constraints using Wildcards.',
    [
      {
        title: '1. Generic Classes & Methods',
        beginner: 'Generics let you create a single class or method that works with ANY data type using a placeholder like `<T>`. Instead of making a separate "IntegerBox" and "StringBox", you make one `Box<T>` and tell Java what goes inside it later.',
        advanced: 'Type parameters (like `<T>`, `<E>`) parameterize classes and methods. They shift type-checking responsibilities to the compiler, eliminating the need for manual downcasting from `Object` references and preventing runtime class casting faults.'
      },
      {
        title: '2. Type Erasure',
        beginner: 'Generics are a trick played by the Java compiler! Once your code is compiled, Java deletes the generic `<T>` types and replaces them with standard Objects to keep your new code compatible with ancient Java versions. This is called Type Erasure.',
        advanced: 'To maintain backward compatibility with pre-Java 5 bytecode, the compiler applies Type Erasure. It replaces generic parameters with their bounds (or `Object`), inserting explicit casting bytecode automatically where required.'
      },
      {
        title: '3. Wildcards (`? extends T`, `? super T`)',
        beginner: 'Wildcards let you define flexible rules. `? extends Number` means "I will accept any type, as long as it is a Number or a subclass of Number" (like Integer or Double). `? super Integer` means the opposite—parents only.',
        advanced: 'Upper Bounded Wildcards (`? extends T`) allow safe reading from a collection. Lower Bounded Wildcards (`? super T`) allow safe writing to a collection. The Unbounded Wildcard (`?`) is used when type dependency is completely irrelevant.'
      }
    ],
    {
      title: '🛠️ Mini-Project: Generic Custom Cache Box',
      intro: 'Build a flexible generic cache class capable of storing and retrieving any object type while maintaining strict compile-time type safety.',
      steps: [
        'Create a file named `GenericCache.java`.',
        'Declare a generic class `public class Cache<T> { private T item; ... }`.',
        'Add a `store(T item)` setter and a `retrieve()` getter returning type `T`.',
        'Create a generic method `public static <E> void printArray(E[] array)` that loops and prints arrays of any type.',
        'In `main`, instantiate a `Cache<String>` and a `Cache<Integer>`, verifying that type safety prevents storing an Integer in the String cache.',
        'Compile and execute using `javac GenericCache.java && java GenericCache`.'
      ],
      goal: 'You designed a reusable generic data structure that adapts to distinct object types while catching type mismatches at compile time.'
    },
    [
      q('What is the primary benefit of using Generics in Java Collections?', ['They make the compiled code execute faster in the CPU', 'They enforce compile-time type safety and eliminate manual object casting', 'They allow storing primitive types like `int` directly', 'They bypass Type Erasure automatically'], 1, 'Generics guarantee type constraints at compilation, heavily reducing runtime casting exceptions.'),
      q('What happens to generic type parameters like `<T>` during the compilation process?', ['They are upgraded to advanced memory pointers', 'They are strictly preserved in the compiled bytecode for runtime use', 'They undergo Type Erasure and are replaced by `Object` or their bounded bounds', 'They are converted directly into wrapper classes'], 2, 'Type Erasure removes generic type information after compilation to ensure backward compatibility with older Java versions.'),
      q('What does the wildcard signature `List<? extends Number>` signify?', ['The list can hold ANY object', 'The list can hold objects of type Number or any of its subclasses (like Integer or Double)', 'The list can ONLY hold exactly the Number class, no subclasses', 'The list can only hold String representations of numbers'], 1, 'The Upper Bound wildcard strictly restricts the generic type to the declared class or its inherited children.')
    ],
    [
      'Generics abstract data types using parameterization, ensuring compile-time type safety.',
      'Java utilizes Type Erasure to remove generic metadata during compilation for legacy compatibility.',
      'Wildcards control generic flexibility, defining upper (`extends`) and lower (`super`) inheritance boundaries.'
    ]
  ),

  L(
    'java-18', 18, 'Exception Handling & Custom Errors', '🛠️',
    '🖥️ **Terminal Notice:** If you want to use a big terminal on your own computer instead of the built-in one, please read Lesson 1 for full setup instructions.\n\nRobust applications do not crash when things go wrong; they handle errors gracefully. This lesson covers the hierarchy of Java exceptions, catching faults, executing mandatory cleanup via `finally`, and designing your own custom business-logic exceptions.',
    [
      {
        title: '1. Checked vs Unchecked Exceptions',
        beginner: 'Checked Exceptions (like trying to open a file that doesn\'t exist) force you to write error-handling code before the program will even compile. Unchecked Exceptions (like dividing by zero) are usually logic mistakes and do not require forced handling.',
        advanced: 'Checked exceptions inherit directly from `Exception` and must be declared in method signatures or wrapped in try-catch. Unchecked exceptions inherit from `RuntimeException` and typically represent preventable programmatic failures.'
      },
      {
        title: '2. try-catch-finally & try-with-resources',
        beginner: 'You place risky code inside a `try` block, handle the error inside a `catch` block, and use a `finally` block for code that MUST run regardless of success or failure. `try-with-resources` automatically closes open files for you!',
        advanced: 'The `finally` block guarantees execution of resource cleanup instructions. `try-with-resources` (Java 7+) automates this by calling `.close()` implicitly on any objects implementing the `AutoCloseable` interface.'
      },
      {
        title: '3. Custom Exception Classes',
        beginner: 'Sometimes standard errors aren\'t enough. You can create your own error (like `InvalidAgeException`) by creating a new class that `extends Exception` or `extends RuntimeException`, and then use the `throw` keyword to trigger it.',
        advanced: 'Custom exceptions provide domain-specific semantic meaning to faults. Extending `Exception` creates a checked compiler mandate, while extending `RuntimeException` creates an unchecked structural fault.'
      }
    ],
    {
      title: '🛠️ Mini-Project: Terminal Student Database & Search System',
      intro: 'Build the Phase 3 capstone project! You will combine Maps, Generics, and Custom Exception handling to build a robust terminal student registry.',
      steps: [
        'Create `StudentSystem.java` and define a custom `StudentNotFoundException extends Exception`.',
        'Create a generic class `Database<K, V>` holding a `HashMap<K, V>`.',
        'Add an `addRecord(K key, V value)` method to the database.',
        'Add a `V getRecord(K key) throws StudentNotFoundException` method that checks if the map `.containsKey()`. If not, `throw new StudentNotFoundException("Student ID not found!");`.',
        'In `main`, wrap your database lookups in a `try-catch` block, purposely searching for an invalid ID to trigger and cleanly handle the custom exception.',
        'Compile and execute using `javac StudentSystem.java && java StudentSystem`.'
      ],
      goal: 'You integrated Phase 3 concepts by combining Generic data constraints, Map lookups, and robust Custom Exception handling pipelines.'
    },
    [
      q('What is the primary difference between a Checked and an Unchecked Exception?', ['Checked exceptions crash the JVM, unchecked do not', 'The compiler forces you to handle Checked exceptions; Unchecked exceptions are optional to handle', 'Checked exceptions only happen with integers', 'Unchecked exceptions must always include a `finally` block'], 1, 'Java strictly forces developers to handle or declare Checked exceptions at compile time.'),
      q('Which block of an exception handling structure is guaranteed to execute whether an error occurs or not?', ['The `try` block', 'The `catch` block', 'The `throws` clause', 'The `finally` block'], 3, 'The `finally` block executes unconditionally, making it the standard location for closing connections or releasing memory.'),
      q('What is required to make an object compatible with the `try-with-resources` automatic closure feature?', ['It must extend `RuntimeException`', 'It must be declared completely private', 'It must implement the `AutoCloseable` interface', 'It must contain a static final integer'], 2, '`try-with-resources` automatically invokes the `.close()` method exclusively on objects implementing `AutoCloseable`.')
    ],
    [
      'Checked exceptions require mandatory handling during compilation; Unchecked exceptions indicate logic faults.',
      'The `finally` block executes unconditionally to ensure vital resources are safely released.',
      'Developers define domain-specific faults by extending the `Exception` or `RuntimeException` hierarchies.'
    ]
  ),

  L(
    'java-19', 19, 'File I/O & Serialization', '🛠️',
    '🖥️ **Terminal Notice:** If you want to use a big terminal on your own computer instead of the built-in one, please read Lesson 1 for full setup instructions.\n\nInput/Output (I/O) operations allow Java applications to interact with external storage systems. This lesson explores classic blocking I/O (`java.io`), modern non-blocking I/O (`java.nio`), efficient file reading/writing strategies, and Java Object Serialization for preserving object state across sessions.',
    [
      {
        title: '1. java.io vs java.nio (NIO.2)',
        beginner: 'Classic `java.io` handles files as streams of bytes or characters one by one. Modern `java.nio` (New I/O) works with buffers and channels, making reading and writing files significantly faster and easier with clean utility classes like `Files` and `Paths`.',
        advanced: '`java.io` relies on stream-oriented, blocking I/O models. `java.nio` (and NIO.2) introduces non-blocking, buffer-oriented architecture leveraging native OS channels and memory mapping. The `java.nio.file.Files` API offers atomic operations, asynchronous I/O, and file tree traversal.'
      },
      {
        title: '2. Reading & Writing Files',
        beginner: 'You can quickly read text files using `Files.readAllLines(path)` or `BufferedReader` for large files to avoid running out of memory. To write text, you can use `Files.write()` or `BufferedWriter`.',
        advanced: 'For large datasets, loading whole files into memory causes Heap memory spikes. Utilizing `BufferedReader` or `Files.lines()` creates a lazy stream of file lines processed line-by-line, drastically reducing memory footprints.'
      },
      {
        title: '3. Object Serialization & serialVersionUID',
        beginner: 'Serialization turns a live Java object into a stream of bytes so you can save it to a file or send it over a network. Deserialization reconstructs the object back into memory. You mark classes with `implements Serializable` to enable this.',
        advanced: 'Object Serialization converts active Heap instances into byte streams. Classes must implement `java.io.Serializable` and declare a `private static final long serialVersionUID` constant to verify class version compatibility during deserialization.'
      }
    ],
    {
      title: '🛠️ Mini-Project: Persistent Configuration Manager',
      intro: 'Build a file I/O utility that writes application configuration data to disk using NIO.2 and persists serializable state objects.',
      steps: [
        'Create a file named `ConfigManager.java`.',
        'Define a `AppConfig` class implementing `Serializable` with `serialVersionUID` and fields `String appName`, `int maxConnections`.',
        'Use `java.nio.file.Files` and `Paths.get("config.txt")` to write text config settings.',
        'Implement an `ObjectOutputStream` to serialize an `AppConfig` object to a binary file `config.ser`.',
        'Implement an `ObjectInputStream` to deserialize the file back into an object and display its restored attributes.',
        'Compile and execute using `javac ConfigManager.java && java ConfigManager`.'
      ],
      goal: 'You successfully wrote disk files using NIO.2 and preserved live object states using Object Serialization.'
    },
    [
      q('What is the main advantage of using `java.nio` over classic `java.io` for file operations?', ['It requires fewer imports', 'It provides non-blocking, buffer-oriented I/O and modern file management APIs', 'It automatically encrypts files saved to disk', 'It removes the need to close file streams'], 1, 'NIO offers high-performance, non-blocking channel/buffer architecture and rich filesystem utilities via `java.nio.file.Files`.'),
      q('Why is it critical to declare a `serialVersionUID` in a `Serializable` class?', ['To allow the file to be opened in text editors', 'To prevent class version incompatibility exceptions during object deserialization', 'To allocate memory on the Stack instead of the Heap', 'To encrypt sensitive data inside the object'], 1, '`serialVersionUID` validates that the sender and receiver of a serialized object share a compatible class structure.'),
      q('Which reader class is best suited for reading giant text files line-by-line without causing OutOfMemory errors?', ['`FileReader`', '`BufferedReader`', '`ObjectInputStream`', '`DataInputStream`'], 1, '`BufferedReader` uses internal buffering to read file lines dynamically without loading the full file into memory.')
    ],
    [
      '`java.nio` provides non-blocking, buffer-oriented file operations for high performance.',
      'Always stream large text files using `BufferedReader` or `Files.lines()` to save memory.',
      'Serialization requires implementing `Serializable` and defining `serialVersionUID` for version control.'
    ]
  ),

  L(
    'java-20', 20, 'Functional Programming — Lambdas & Functional Interfaces', '🛠️',
    '🖥️ **Terminal Notice:** If you want to use a big terminal on your own computer instead of the built-in one, please read Lesson 1 for full setup instructions.\n\nJava 8 introduced functional programming capabilities, enabling cleaner, more concise code. This lesson covers Lambda expressions, Method References, and built-in functional interfaces (`Consumer`, `Supplier`, `Function`, `Predicate`) from the `java.util.function` package.',
    [
      {
        title: '1. Lambda Expressions & Method References',
        beginner: 'A Lambda expression is an anonymous (nameless) short block of code that takes in parameters and returns a value. Method References (`Class::method`) make lambdas even shorter when you are simply calling an existing method directly.',
        advanced: 'Lambdas provide anonymous implementation bodies for Single Abstract Method (SAM) interfaces. Method references (`Object::instanceMethod` or `Class::staticMethod`) offer zero-overhead syntactic sugar compiling into invokedynamic bytecode instructions.'
      },
      {
        title: '2. Core Functional Interfaces: Predicate & Function',
        beginner: '`Predicate<T>` checks a condition and returns `true` or `false` (useful for filtering). `Function<T, R>` takes an input of type `T` and transforms it into a result of type `R` (useful for converting data).',
        advanced: '`Predicate<T>` enforces `boolean test(T t)` and supports logical composition (`and`, `or`, `negate`). `Function<T, R>` enforces `R apply(T t)` and supports monadic method chaining (`andThen`, `compose`).'
      },
      {
        title: '3. Core Functional Interfaces: Consumer & Supplier',
        beginner: '`Consumer<T>` takes an input and performs an action without returning anything (like printing). `Supplier<T>` takes NO inputs but returns a value when requested (like generating a random number).',
        advanced: '`Consumer<T>` enforces `void accept(T t)` for side-effect operations. `Supplier<T>` enforces `T get()` for lazy evaluation, factory generation, and deferring execution until runtime requirements are met.'
      }
    ],
    {
      title: '🛠️ Mini-Project: Functional Data Transformer Pipeline',
      intro: 'Build a flexible data pipeline using standard functional interfaces to filter, transform, generate, and consume data.',
      steps: [
        'Create a file named `FunctionalPipeline.java`.',
        'Define a `Predicate<Integer> isEven = n -> n % 2 == 0;` to filter numbers.',
        'Define a `Function<Integer, String> stringify = n -> "Value: " + n;` to format numbers.',
        'Define a `Supplier<Double> randomGen = Math::random;` using a Method Reference.',
        'Define a `Consumer<String> printMsg = System.out::println;` to display results.',
        'Combine these functional interfaces inside a loop to process dynamically generated data.',
        'Compile and execute using `javac FunctionalPipeline.java && java FunctionalPipeline`.'
      ],
      goal: 'You mastered Java functional programming by chaining built-in functional interfaces and method references.'
    },
    [
      q('Which built-in functional interface would you choose to test if a string starts with the letter "A"?', ['`Supplier<String>`', '`Consumer<String>`', '`Predicate<String>`', '`Function<String, Integer>`'], 2, '`Predicate<T>` takes an object and returns a boolean, making it ideal for validation and condition checking.'),
      q('What is the syntax for a Method Reference pointing to `System.out.println`?', ['`System.out->println`', '`System.out::println`', '`System::out::println()`', '`Class.println(System.out)`'], 1, 'Method references use double colons (`::`) to reference existing methods directly.'),
      q('Which functional interface takes NO parameter arguments but produces an output result?', ['`Consumer<T>`', '`Predicate<T>`', '`Function<T, R>`', '`Supplier<T>`'], 3, '`Supplier<T>` takes zero inputs and produces a value via its `.get()` method.')
    ],
    [
      'Lambdas provide inline, concise functional implementations for single abstract method interfaces.',
      'Method references (`::`) simplify lambdas that directly execute existing methods.',
      'Use `Predicate` for testing, `Function` for mapping, `Consumer` for actions, and `Supplier` for generation.'
    ]
  ),

  L(
    'java-21', 21, 'Stream API & Data Processing', '🛠️',
    '🖥️ **Terminal Notice:** If you want to use a big terminal on your own computer instead of the built-in one, please read Lesson 1 for full setup instructions.\n\nThe Stream API (`java.util.stream`) revolutionized bulk data processing in Java. Streams allow declarative, pipeline-based transformations of data collections through lazy evaluation, intermediate filtering/mapping operations, and terminal aggregation operations.',
    [
      {
        title: '1. Stream Pipelines & Intermediate Operations',
        beginner: 'A Stream is a sequence of elements supporting sequential and parallel operations. Intermediate operations (like `filter()`, `map()`, and `sorted()`) modify the stream and are lazy—they don\'t actually execute until a terminal operation is called!',
        advanced: 'Streams do not alter underlying collections. Intermediate operations return a new Stream handle and utilize lazy evaluation. Elements pass through pipeline operations in a single pass during terminal execution rather than creating temporary collections.'
      },
      {
        title: '2. Terminal Operations (collect, reduce, count)',
        beginner: 'Terminal operations trigger the stream to run and produce a final result (like collecting items into a List with `Collectors.toList()`, counting items with `count()`, or combining items into one with `reduce()`).',
        advanced: 'Terminal operations evaluate the stream pipeline. `collect(Collectors.toList())` accumulates stream results into container structures. `reduce()` combines elements into a single summary result using associative accumulation functions.'
      },
      {
        title: '3. Stream Parallelism & Performance',
        beginner: 'You can convert any standard stream into a parallel stream using `.parallelStream()`. This automatically splits processing across all available CPU cores to handle massive datasets faster.',
        advanced: 'Parallel streams leverage the JVM ForkJoinPool. While efficient for large CPU-bound data operations, parallel streams introduce synchronization overhead and thread contention on small datasets or non-splittable data sources.'
      }
    ],
    {
      title: '🛠️ Mini-Project: E-Commerce Order Analytics Engine',
      intro: 'Build a Stream API data pipeline that processes a list of transactions, filters high-value sales, transforms currency values, and calculates revenue summaries.',
      steps: [
        'Create a file named `OrderAnalytics.java`.',
        'Create an `Order` class with fields `id`, `category`, and `price`.',
        'Instantiate a `List<Order>` filled with mock purchase records.',
        'Use `.stream().filter(o -> o.getPrice() > 50.0)` to isolate premium purchases.',
        'Use `.map(Order::getPrice)` to extract transaction amounts.',
        'Use `.reduce(0.0, Double::sum)` or `.collect(Collectors.summarizingDouble(...))` to compute total sales.',
        'Compile and execute using `javac OrderAnalytics.java && java OrderAnalytics`.'
      ],
      goal: 'You built a declarative data processing engine using Stream filtering, mapping, and reduction operations.'
    },
    [
      q('What happens when you call an intermediate operation like `.filter()` on a Stream without calling a terminal operation?', ['The entire list is immediately filtered in memory', 'Nothing executes yet because intermediate operations are evaluated lazily', 'An Exception is thrown due to missing terminal state', 'The stream converts automatically to a parallel stream'], 1, 'Stream intermediate operations execute lazily and only run when triggered by a terminal operation.'),
      q('Which terminal operation is used to combine all stream elements into a single value (such as computing a sum)?', ['`map()`', '`filter()`', '`reduce()`', '`distinct()`'], 2, '`reduce()` takes stream elements and repeatedly combines them into a single aggregate result.'),
      q('When should you avoid using `.parallelStream()`?', ['When processing millions of simple numeric items', 'When operating on tiny data sets or ordered tasks where thread creation overhead exceeds execution gain', 'When using multi-core processors', 'When reading data from memory arrays'], 1, 'Parallel streams incur thread management overhead, making them slower for small datasets.')
    ],
    [
      'Streams process collection data declaratively without modifying the source data structure.',
      'Intermediate operations are evaluated lazily until a terminal operation (e.g., `collect`, `reduce`) triggers execution.',
      'Use stream mapping, filtering, and collectors to replace verbose nested `for` loops.'
    ]
  ),

  L(
    'java-22', 22, 'Multithreading & Concurrency Basics', '🛠️',
    '🖥️ **Terminal Notice:** If you want to use a big terminal on your own computer instead of the built-in one, please read Lesson 1 for full setup instructions.\n\nMultithreading enables Java programs to execute multiple tasks concurrently, maximizing CPU core utilization. This lesson covers thread creation via `Thread` and `Runnable`, thread lifecycles, race conditions, and thread synchronization using `synchronized`.',
    [
      {
        title: '1. Thread Creation: Thread Class vs Runnable Interface',
        beginner: 'A thread is a single worker executing code concurrently. You create threads by extending the `Thread` class or implementing the `Runnable` interface (preferred because Java only lets you extend one class!). Call `.start()` to run it.',
        advanced: 'Implementing `Runnable` decouples task execution logic from thread management. Calling `.start()` allocates native OS thread resources and invokes `.run()` asynchronously. Calling `.run()` directly executes code synchronously on the caller thread.'
      },
      {
        title: '2. Thread Lifecycle & States',
        beginner: 'Threads move through various states during their lifetime: NEW (created), RUNNABLE (executing), BLOCKED/WAITING (waiting for resources or locks), and TERMINATED (finished execution).',
        advanced: 'JVM thread states (`Thread.State` enum) include NEW, RUNNABLE, BLOCKED (waiting for monitor lock), WAITING, TIMED_WAITING (via `Thread.sleep` or `join`), and TERMINATED. Thread scheduling is non-deterministic and managed by the host OS.'
      },
      {
        title: '3. Race Conditions & The `synchronized` Keyword',
        beginner: 'When multiple threads try to edit the same shared variable at the exact same time, their changes can corrupt the data (a Race Condition). Using `synchronized` locks the code block so only one thread can enter at a time.',
        advanced: 'Race conditions occur when unsynchronized concurrent memory access violates thread-safety invariants. The `synchronized` keyword acquires a intrinsic monitor lock on an object, establishing mutual exclusion and memory visibility boundaries.'
      }
    ],
    {
      title: '🛠️ Mini-Project: Synchronized Counter Simulator',
      intro: 'Build a multi-threaded counter application that demonstrates race conditions when unsynchronized, and fixes data corruption using synchronization.',
      steps: [
        'Create a file named `ThreadCounter.java`.',
        'Create a class `Counter` with an `int count = 0;` variable and a `synchronized void increment()` method.',
        'Create a `Runnable` task that loops 1,000 times calling `increment()`.',
        'In `main`, instantiate two threads sharing the same `Counter` instance and call `.start()`.',
        'Use `thread1.join()` and `thread2.join()` to wait for thread completion before printing the final counter value (expecting exactly 2000).',
        'Compile and execute using `javac ThreadCounter.java && java ThreadCounter`.'
      ],
      goal: 'You managed multithreaded execution, controlled thread lifecycles using `join()`, and prevented race conditions using `synchronized` locks.'
    },
    [
      q('Why is calling `thread.start()` different from calling `thread.run()` directly?', ['`start()` creates a new asynchronous operating system thread; `run()` executes synchronously on the current thread', '`run()` is faster than `start()`', '`start()` can only be called inside static methods', '`run()` automatically synchronizes all memory variables'], 0, 'Calling `.start()` allocates thread stack memory and schedules asynchronous execution; `.run()` runs code synchronously.'),
      q('What risk arises when two or more threads concurrently write to an unsynchronized shared variable?', ['Deadlock', 'Race Condition yielding data corruption', 'StackOverflowError', 'Type Erasure failure'], 1, 'Concurrent unsynchronized state updates cause Race Conditions, leading to unpredictable data corruption.'),
      q('What is the role of the `synchronized` keyword in Java?', ['It compiles code into parallel streams', 'It locks code execution to a single thread at a time, enforcing mutual exclusion', 'It speeds up thread creation time', 'It prevents garbage collection'], 1, '`synchronized` forces threads to acquire an object lock before entering code blocks, preventing race conditions.')
    ],
    [
      'Implement `Runnable` instead of extending `Thread` to decouple tasks from execution mechanics.',
      'Call `.start()` to spin up a new concurrent execution thread; never call `.run()` directly.',
      'Use `synchronized` locks to prevent race conditions on shared mutable object state.'
    ]
  ),

  L(
    'java-23', 23, 'Concurrent Utilities & Executors', '🛠️',
    '🖥️ **Terminal Notice:** If you want to use a big terminal on your own computer instead of the built-in one, please read Lesson 1 for full setup instructions.\n\nManual thread management is error-prone and expensive. Modern Java concurrency relies on the `java.util.concurrent` framework, featuring ExecutorServices for thread pooling, `Callable` for returning asynchronous values, and `CompletableFuture` for non-blocking task chaining.',
    [
      {
        title: '1. ExecutorService & Thread Pools',
        beginner: 'Creating new threads takes computer processing time. A Thread Pool keeps a team of reusable worker threads ready to go. You send tasks to an `ExecutorService` thread pool instead of spawning threads manually.',
        advanced: '`ExecutorService` manages worker threads via thread pools (e.g., `Executors.newFixedThreadPool(n)`), eliminating thread allocation overhead. It queues pending tasks in thread-safe blocking queues and manages pool shutdown lifecycles.'
      },
      {
        title: '2. Callable & Future',
        beginner: '`Runnable` runs code but cannot return a result or throw checked exceptions. `Callable` is like a Runnable that CAN return a value! A `Future` acts as a placeholder that holds the result once the background task finishes.',
        advanced: '`Callable<V>` defines `V call() throws Exception`. Submitting a Callable to an ExecutorService returns a `Future<V>` handle. Calling `future.get()` blocks the calling thread until task completion, while `isDone()` non-blockingly polls task status.'
      },
      {
        title: '3. CompletableFuture & Asynchronous Chaining',
        beginner: '`CompletableFuture` allows you to chain tasks together asynchronously (e.g., "When Task A finishes, automatically pass its result to Task B") without stopping or freezing your main program!',
        advanced: '`CompletableFuture<T>` implements `Future<T>` and `CompletionStage<T>`, enabling non-blocking reactive pipelines. Methods like `.thenApply()`, `.thenAccept()`, and `.thenCombine()` register asynchronous callbacks without blocking worker threads.'
      }
    ],
    {
      title: '🛠️ Mini-Project: Asynchronous Web Data Downloader Simulator',
      intro: 'Build a multi-threaded task runner using ExecutorService thread pools and CompletableFuture to run background download jobs.',
      steps: [
        'Create a file named `AsyncDownloader.java`.',
        'Create an `ExecutorService pool = Executors.newFixedThreadPool(3);`.',
        'Submit multiple `Callable<String>` download tasks to the pool that simulate delay using `Thread.sleep()`.',
        'Use `CompletableFuture.supplyAsync(..., pool)` to chain task dependencies (e.g., downloading data then parsing the string).',
        'Properly shut down the thread pool using `pool.shutdown()`.',
        'Compile and execute using `javac AsyncDownloader.java && java AsyncDownloader`.'
      ],
      goal: 'You built a high-performance concurrency pipeline utilizing ExecutorService thread pools and reactive CompletableFuture chaining.'
    },
    [
      q('What is a major advantage of using an `ExecutorService` thread pool over creating threads manually?', ['It automatically encrypts network connections', 'It reuses worker threads, avoiding the overhead of creating and destroying threads repeatedly', 'It prevents all runtime exceptions', 'It converts single-threaded code into parallel streams'], 1, 'Thread pools maintain reusable worker threads to eliminate thread creation and destruction performance costs.'),
      q('How does `Callable` differ from `Runnable`?', ['`Callable` can return a value and throw checked exceptions; `Runnable` cannot', '`Runnable` can return generic types; `Callable` returns void', '`Callable` cannot be executed in thread pools', '`Runnable` is only used inside GUI apps'], 0, '`Callable<V>` allows tasks to return values and throw checked exceptions, unlike `Runnable` which returns void.'),
      q('Which `CompletableFuture` method registers a callback to transform a task result asynchronously when it completes?', ['`.get()`', '`.thenApply()`', '`.block()`', '`.shutdown()`'], 1, '`.thenApply()` chains a transformation function that executes asynchronously as soon as the future completes.')
    ],
    [
      'Thread pools (`ExecutorService`) prevent resource exhaustion by recycling reusable worker threads.',
      'Use `Callable` and `Future` when background asynchronous tasks need to return result values.',
      'Chain non-blocking asynchronous task pipelines using `CompletableFuture` callbacks.'
    ]
  ),

  L(
    'java-24', 24, 'JVM Memory Structure, Garbage Collection & Reflection', '🛠️',
    '🖥️ **Terminal Notice:** If you want to use a big terminal on your own computer instead of the built-in one, please read Lesson 1 for full setup instructions.\n\nUnderstanding JVM internals empowers developers to build performant, memory-efficient systems. This lesson explores Heap vs. Stack memory allocation, Garbage Collection (GC) algorithms, dynamic introspection using the Java Reflection API, and custom Annotations.',
    [
      {
        title: '1. JVM Memory Model: Heap vs Stack',
        beginner: 'The JVM divides memory into key areas: **Stack** memory stores method calls and local variables (fast, short-lived), while **Heap** memory stores all instantiated objects. Metaspace stores class metadata.',
        advanced: 'Stack memory is thread-private and manages execution frames containing local variables and operand stacks. Heap memory is shared across threads and structured into Young (Eden, Survivor) and Old generations for object allocation. Metaspace holds class runtime bytecode.'
      },
      {
        title: '2. Garbage Collection (GC) Fundamentals',
        beginner: 'Garbage Collection is Java\'s automatic memory cleaner. When an object on the Heap is no longer connected to any active code, GC automatically deletes it to free up memory so you don\'t have to clean memory manually.',
        advanced: 'Garbage Collection uses root reachability analysis (marking reachable objects from Stack/GC Roots). Modern collectors (G1GC, ZGC) minimize "Stop-The-World" pauses by performing generational mark-sweep-compact phases concurrently.'
      },
      {
        title: '3. Reflection API & Custom Annotations',
        beginner: 'Reflection lets your Java code inspect or modify itself at runtime—allowing you to inspect private fields or call methods dynamically. Annotations (like `@Override`) attach metadata tags to your code.',
        advanced: 'The `java.lang.reflect` API inspects class bytecodes dynamically (`Class`, `Field`, `Method`). Custom Annotations (`@interface`) combined with `@Retention(RetentionPolicy.RUNTIME)` allow frameworks to read metadata tags dynamically at runtime.'
      }
    ],
    {
      title: '🛠️ Mini-Project: Multi-Threaded In-Memory File & Log Parser',
      intro: 'Build the Phase 4 capstone mini-project! You will construct a multi-threaded log parsing framework that reads log text via NIO, processes log tokens concurrently using Executors and Streams, and inspects records via Reflection.',
      steps: [
        'Create a file named `MultiThreadedLogParser.java`.',
        'Create a custom `@Retention(RetentionPolicy.RUNTIME) @interface LogInfo` annotation.',
        'Define a annotated `LogRecord` class with fields `timestamp`, `level`, and `message`.',
        'Create an `ExecutorService` thread pool to process simulated log lines asynchronously.',
        'Use Stream API pipelines (`filter`, `collect`) inside thread tasks to extract error logs.',
        'Use Java Reflection (`Class.getDeclaredFields()`) to inspect and display `LogRecord` field annotations at runtime.',
        'Compile and execute using `javac MultiThreadedLogParser.java && java MultiThreadedLogParser`.'
      ],
      goal: 'You integrated Phase 4 concepts into an enterprise parser using NIO, Streams, Executor pools, Annotations, and Reflection.'
    },
    [
      q('Where are local primitive variables stored inside the JVM memory architecture during method execution?', ['On the global Heap memory', 'Inside the class Metaspace area', 'In the thread-private Stack frame', 'In the Garbage Collector root index'], 2, 'Local variables inside methods live within thread-private Stack frames.'),
      q('How does the JVM Garbage Collector determine if an object on the Heap is ready for deletion?', ['By checking if the object is older than 5 minutes', 'By checking root reachability (if no active references point to it from GC Roots)', 'By counting the number of methods inside the object', 'By monitoring CPU execution speed'], 1, 'If an object is unreferenced and unreachable from active thread GC Roots, it becomes eligible for GC collection.'),
      q('What is required to make a custom Annotation inspectable at execution time using Reflection?', ['It must be marked with `@Retention(RetentionPolicy.RUNTIME)`', 'It must extend the Thread class', 'It must be declared private final', 'It must be written in an interface file'], 0, 'RetentionPolicy.RUNTIME ensures annotation metadata is preserved in class bytecode for runtime Reflection.')
    ],
    [
      'Stack memory stores short-lived thread method frames; Heap memory stores shared objects.',
      'Garbage Collection automatically frees unreferenced Heap memory via root reachability analysis.',
      'Reflection and Runtime Annotations enable dynamic code introspection used by frameworks.'
    ]
  ),

  L(
    'java-25', 25, 'Build Tools (Maven & Gradle)', '🛠️',
    '🖥️ **Terminal Notice:** If you want to use a big terminal on your own computer instead of the built-in one, please read Lesson 1 for full setup instructions.\n\nProduction applications rely on build automation tools to manage dependencies, automate compilation, and package software. This lesson covers project layouts, managing dependencies in Maven (`pom.xml`) and Gradle, and understanding automated build lifecycles.',
    [
      {
        title: '1. Standard Directory Layout',
        beginner: 'Modern Java projects follow a universal folder layout so every developer knows where files live: `src/main/java` holds your application code, and `src/test/java` holds your automated unit tests.',
        advanced: 'Maven and Gradle enforce standard convention-over-configuration directory layouts: `src/main/java` (source code), `src/main/resources` (configs/assets), `src/test/java` (unit tests), and `target/` or `build/` (compiled output binaries).'
      },
      {
        title: '2. Dependency Management & Central Repositories',
        beginner: 'Instead of manually downloading `.jar` library files from websites, build tools automatically download third-party software libraries from online registries (like Maven Central) using dependency declarations.',
        advanced: 'Build tools resolve transitively linked remote dependencies declared in configuration files. Maven uses XML (`pom.xml`), while Gradle uses Groovy/Kotlin DSL (`build.gradle`). Libraries are pulled from Maven Central and cached locally.'
      },
      {
        title: '3. Build Lifecycles & Packaging',
        beginner: 'Build tools execute phases in order: `validate` -> `compile` -> `test` -> `package`. Running a package command compiles your code, runs unit tests, and packages everything into an executable `.jar` file.',
        advanced: 'Build lifecycles execute structured goals. The standard lifecycle includes `validate`, `compile`, `test`, `package` (creating JAR/WAR artifacts), `verify`, and `install` (deploying artifacts into local `.m2` cache).'
      }
    ],
    {
      title: '🛠️ Mini-Project: Simulated Maven POM Dependency Resolver',
      intro: 'Simulate how Maven parses project configurations, resolves dependency coordinates, and triggers compilation phases.',
      steps: [
        'Create a file named `BuildToolSimulator.java`.',
        'Create a `Dependency` class with fields `groupId`, `artifactId`, and `version`.',
        'Create a `PomConfig` class holding project metadata and a `List<Dependency>`.',
        'Write a build phase method `executePhase(String phaseName)` that logs build steps: "Compiling `src/main/java`", "Running Tests", "Generating target/app.jar".',
        'Instantiate your project configuration and simulate executing clean install phases.',
        'Compile and execute using `javac BuildToolSimulator.java && java BuildToolSimulator`.'
      ],
      goal: 'You understood build automation principles, standard directory structures, dependency coordinates, and build lifecycles.'
    },
    [
      q('In modern Java build tools, where should application source code files be located?', ['`src/test/java`', '`src/main/java`', '`target/classes`', '`lib/external`'], 1, 'Standard convention places application production code inside `src/main/java`.'),
      q('Which file is used by Maven to declare project dependencies, plugins, and build settings?', ['`build.gradle`', '`settings.json`', '`pom.xml`', '`manifest.mf`'], 2, 'Maven configures projects through its Project Object Model file: `pom.xml`.'),
      q('What happens during the `package` build lifecycle phase in Maven?', ['It deletes all source files from the system', 'It compiles code, runs tests, and packages binaries into an output JAR or WAR artifact', 'It deploys the application directly to AWS', 'It converts Java code to C++'], 1, 'The `package` phase compiles sources, executes tests, and bundles compiled binaries into executable archives.')
    ],
    [
      'Build tools enforce standard project directory layouts (`src/main/java`, `src/test/java`).',
      'Remote dependencies are automatically resolved and downloaded from registries like Maven Central.',
      'Automated build lifecycles compile code, run test suites, and package executable JAR files.'
    ]
  ),

  L(
    'java-26', 26, 'Unit Testing with JUnit 5 & Mockito', '🛠️',
    '🖥️ **Terminal Notice:** If you want to use a big terminal on your own computer instead of the built-in one, please read Lesson 1 for full setup instructions.\n\nUnit testing ensures that individual code components work correctly in isolation before hitting production. This lesson covers writing automated tests with JUnit 5, assertions, lifecycle annotations (`@BeforeEach`, `@Test`), and isolating dependencies using Mockito mocks.',
    [
      {
        title: '1. Writing Unit Tests with JUnit 5',
        beginner: 'Unit tests are small automated programs that test individual methods in your code. You annotate a test method with `@Test` and use assertions like `assertEquals(expected, actual)` to verify results.',
        advanced: 'JUnit 5 (Jupiter) structures automated test suites. The `@Test` annotation marks executable test methods. Assertion methods (`assertEquals`, `assertTrue`, `assertThrows`) validate expected execution outcomes against actual returns.'
      },
      {
        title: '2. Test Lifecycle Hooks',
        beginner: 'Lifecycle annotations let you run setup and cleanup code around your tests: `@BeforeEach` runs before EVERY test (great for resetting test data), and `@AfterEach` runs after every test.',
        advanced: 'JUnit lifecycle hooks manage test state isolation: `@BeforeEach` and `@AfterEach` execute surrounding every individual `@Test` execution. `@BeforeAll` and `@AfterAll` run once per test class execution.'
      },
      {
        title: '3. Mocking Dependencies with Mockito',
        beginner: 'When testing a class that depends on a database or external web server, you shouldn\'t call the real server! Mockito creates "fake" (mock) objects that simulate those external components so your tests stay fast and reliable.',
        advanced: 'Mockito isolates unit classes under test by creating dynamic proxy mocks. `@Mock` generates mock dependencies, `@InjectMocks` injects mocks into the test subject, and `when(mock.method()).thenReturn(value)` stubs behavior.'
      }
    ],
    {
      title: '🛠️ Mini-Project: Isolated Bank Service Test Suite',
      intro: 'Build a unit testing harness that verifies banking business logic using simulated assertions and mock database responses.',
      steps: [
        'Create a file named `UnitTestHarness.java`.',
        'Create a mock database service `DatabaseService` with a method `double getBalance(String accountId)`.',
        'Create an `AccountService` class that depends on `DatabaseService` to execute transfers.',
        'Simulate Mockito behavior by creating a stub method that forces `getBalance()` to return `100.0` without touching a database.',
        'Write custom assertion methods `assertEquals(expected, actual)` to verify transfer calculations.',
        'Simulate a `@BeforeEach` setup reset method and run the test suite inside `main`.',
        'Compile and execute using `javac UnitTestHarness.java && java UnitTestHarness`.'
      ],
      goal: 'You mastered unit testing fundamentals, dependency isolation, stubs/mocks, and test lifecycle execution.'
    },
    [
      q('Which annotation in JUnit 5 marks a method as an executable unit test?', ['`@UnitTest`', '`@Test`', '`@Execute`', '`@MockMethod`'], 1, 'The `@Test` annotation tells the JUnit runner that a method is an executable test.'),
      q('What is the primary purpose of using Mockito in unit testing?', ['To make tests run slower for debugging', 'To create fake mock dependencies so the class under test can be tested in total isolation', 'To generate automatic HTML web layouts', 'To test database connection strings'], 1, 'Mockito creates mock objects to isolate the class under test from external systems like databases or web APIs.'),
      q('Which lifecycle hook in JUnit 5 executes code immediately before EVERY individual test method runs?', ['`@BeforeAll`', '`@BeforeEach`', '`@AfterAll`', '`@SetupOnce`'], 1, '`@BeforeEach` executes setup logic prior to running each individual test method.')
    ],
    [
      'Unit tests isolate and verify individual methods using `@Test` annotations and assertions.',
      'Test lifecycle hooks (`@BeforeEach`, `@AfterEach`) maintain clean, independent test states.',
      'Mockito stubs external dependencies to keep unit tests fast, deterministic, and isolated.'
    ]
  ),

  L(
    'java-27', 27, 'Database Connectivity with JDBC & SQL', '🛠️',
    '🖥️ **Terminal Notice:** If you want to use a big terminal on your own computer instead of the built-in one, please read Lesson 1 for full setup instructions.\n\nDatabases store enterprise application data permanently. This lesson covers connecting Java apps to relational databases via JDBC (Java Database Connectivity), preventing SQL Injection security attacks using `PreparedStatement`, managing SQL transactions, and connection pooling.',
    [
      {
        title: '1. JDBC Architecture & Connections',
        beginner: 'JDBC is Java\'s standard API for communicating with relational databases (like MySQL or PostgreSQL). You connect using a Connection URL, send SQL commands, and receive query answers inside a `ResultSet`.',
        advanced: 'JDBC abstracts database driver implementations via `java.sql.DriverManager` and `Connection`. `Statement` executes raw SQL strings, while `ResultSet` provides a cursor interface to iterate over returned database row records.'
      },
      {
        title: '2. Security: PreparedStatement vs Statement',
        beginner: 'NEVER build SQL queries by gluing user strings together with `+`—hackers can inject bad SQL code (SQL Injection)! Always use `PreparedStatement` with `?` placeholders to keep your database safe.',
        advanced: '`PreparedStatement` pre-compiles SQL statements on the database server. It uses parameterized placeholders (`?`) to strictly separate executable SQL code from user-supplied parameters, completely neutralizing SQL Injection attacks.'
      },
      {
        title: '3. Transactions & Connection Pools',
        beginner: 'A Transaction groups multiple SQL updates together so they ALL succeed, or ALL fail together (using `commit()` and `rollback()`). Connection Pools keep reusable database connections open so your app stays fast.',
        advanced: 'Transactions enforce ACID guarantees. Turning off auto-commit (`conn.setAutoCommit(false)`) allows multi-statement transactions finalized via `conn.commit()` or reverted via `conn.rollback()`. Connection pools (e.g., HikariCP) recycle reusable connection instances.'
      }
    ],
    {
      title: '🛠️ Mini-Project: Secure JDBC Transaction Manager',
      intro: 'Build a database client simulation that executes parameterized SQL updates safely inside a roll-backable transaction.',
      steps: [
        'Create a file named `JdbcTransactionSimulator.java`.',
        'Simulate a `PreparedStatement` parameterized query wrapper that cleans parameter input text.',
        'Implement transaction control methods: `setAutoCommit(false)`, `commit()`, and `rollback()`.',
        'Simulate a bank fund transfer: deduct funds from Account A, inject a simulated SQL error, catch the failure, and trigger `rollback()`.',
        'Demonstrate that the account balances remain untouched due to transaction rollback.',
        'Compile and execute using `javac JdbcTransactionSimulator.java && java JdbcTransactionSimulator`.'
      ],
      goal: 'You built a secure database client architecture enforcing parameterized query security and ACID transaction safety.'
    },
    [
      q('Why is `PreparedStatement` preferred over basic `Statement` for database queries in Java?', ['It runs without requiring a database password', 'It pre-compiles SQL queries and uses parameterized placeholders to prevent SQL Injection attacks', 'It automatically formats tables into HTML', 'It eliminates the need for SQL database connections'], 1, '`PreparedStatement` parameterizes user inputs to prevent SQL Injection security vulnerabilities.'),
      q('What JDBC method must be called to permanently save changes made during a manual transaction?', ['`conn.save()`', '`conn.setAutoCommit(true)`', '`conn.commit()`', '`conn.close()`'], 2, '`conn.commit()` finalizes and persists all transaction updates to the relational database.'),
      q('What is the purpose of using a Connection Pool (like HikariCP) in enterprise applications?', ['To create new database tables automatically', 'To reuse active database connections, preventing the overhead of repeatedly opening/closing sockets', 'To convert SQL tables into JSON strings', 'To format terminal output text'], 1, 'Connection pools maintain active socket connections to prevent high-latency connection setup overhead.')
    ],
    [
      'JDBC connects Java applications to relational SQL databases via Driver Managers.',
      'Always use `PreparedStatement` to parameterize inputs and prevent SQL Injection attacks.',
      'Manage multi-step atomic operations using ACID transactions (`commit()` and `rollback()`).'
    ]
  ),

  L(
    'java-28', 28, 'Spring Boot Essentials & REST APIs', '🛠️',
    '🖥️ **Terminal Notice:** If you want to use a big terminal on your own computer instead of the built-in one, please read Lesson 1 for full setup instructions.\n\nSpring Boot is the industry-standard framework for building production Java web backend applications. This lesson covers Dependency Injection (DI), the Spring IoC Container, building web REST controllers, and mapping HTTP endpoints (`GET`, `POST`, `PUT`, `DELETE`).',
    [
      {
        title: '1. Inversion of Control (IoC) & Dependency Injection (DI)',
        beginner: 'In normal Java, you use `new` to build objects yourself. In Spring, the framework builds and manages objects for you! This is Inversion of Control. Spring automatically "injects" needed objects into your classes using `@Autowired`.',
        advanced: 'The Spring IoC Container manages component lifecycles (Spring Beans). Dependency Injection (DI) injects dependencies dynamically at runtime (preferably via Constructor Injection), decoupling component implementations and simplifying unit testing.'
      },
      {
        title: '2. RESTful Architecture & Controllers',
        beginner: 'REST APIs allow backend Java apps to talk to mobile apps or web frontend frameworks using JSON data over HTTP. You mark web handler classes with `@RestController` to accept web requests.',
        advanced: 'REST APIs communicate statelessly over HTTP using standardized methods (`GET` for reading, `POST` for creation, `PUT` for updates, `DELETE` for removal). Spring\'s `@RestController` serializes Java response objects directly into JSON payload responses.'
      },
      {
        title: '3. Spring HTTP Request Annotations',
        beginner: 'You route HTTP requests using annotations: `@GetMapping("/users")` handles page visits, `@PostMapping` receives new JSON data via `@RequestBody`, and `@PathVariable` extracts IDs directly from the web URL.',
        advanced: 'HTTP request mappings map web routes to handler methods: `@GetMapping`, `@PostMapping`, `@PutMapping`, `@DeleteMapping`. Parameter annotations (`@PathVariable`, `@RequestParam`, `@RequestBody`) parse URL path variables, query parameters, and JSON payloads.'
      }
    ],
    {
      title: '🛠️ Mini-Project: Simulated Spring REST Controller Engine',
      intro: 'Build a simulated lightweight Spring Boot REST controller handling HTTP routes and serializing object responses to JSON strings.',
      steps: [
        'Create a file named `RestControllerSimulator.java`.',
        'Create a `Product` model class with `id`, `name`, and `price`.',
        'Simulate a `@Service` component managed by an IoC container registry.',
        'Create a simulated `@RestController` class containing route handler methods for `GET /products` and `POST /products`.',
        'Simulate receiving a JSON `@RequestBody` string, converting it into a `Product` object, and storing it.',
        'Compile and execute using `javac RestControllerSimulator.java && java RestControllerSimulator`.'
      ],
      goal: 'You understood Spring Boot web architecture, IoC dependency injection, and RESTful HTTP API routing.'
    },
    [
      q('What is Dependency Injection (DI) in the Spring Framework?', ['Downloading JAR files from remote servers', 'A design pattern where the Spring container automatically creates and injects required objects into components', 'Writing raw SQL queries inside text files', 'Converting Java bytecode into web scripts'], 1, 'Spring IoC container automatically manages bean creation and injects dependencies into classes.'),
      q('Which Spring Boot annotation marks a class as a web REST controller that outputs JSON responses?', ['`@Service`', '`@Repository`', '`@RestController`', '`@Configuration`'], 2, '`@RestController` combines `@Controller` and `@ResponseBody` to handle HTTP routes and output JSON data.'),
      q('Which annotation extracts dynamic URL parameters (such as extracting `5` from `/users/5`) inside a Spring endpoint method?', ['`@RequestBody`', '`@PathVariable`', '`@Autowired`', '`@ResponseBody`'], 1, '`@PathVariable` binds dynamic URL path segments directly to method parameter variables.')
    ],
    [
      'Spring Boot uses Dependency Injection to manage object creation and component lifecycles.',
      'REST APIs expose stateless web endpoints that serialize Java objects into JSON payloads.',
      'Use `@GetMapping`, `@PostMapping`, `@RequestBody`, and `@PathVariable` to route HTTP web requests.'
    ]
  ),

  L(
    'java-29', 29, 'Essential Software Design Patterns in Java', '🛠️',
    '🖥️ **Terminal Notice:** If you want to use a big terminal on your own computer instead of the built-in one, please read Lesson 1 for full setup instructions.\n\nDesign patterns are proven, battle-tested solution templates for common software architectural challenges. This lesson covers key Creational, Structural, and Behavioral design patterns in Java: Singleton, Factory, Builder, Observer, and Strategy.',
    [
      {
        title: '1. Creational Patterns: Singleton & Factory',
        beginner: 'The **Singleton** pattern ensures a class can only ever have ONE single instance in the whole program (great for database connections). The **Factory** pattern uses a creator method to generate objects without exposing creation logic.',
        advanced: 'Singleton guarantees a class has only one global instance using private constructors and thread-safe lazy initialization (e.g., Enum Singleton or double-checked locking). Factory Method delegates object instantiation to subclasses or factory methods.'
      },
      {
        title: '2. Creational & Structural Patterns: Builder',
        beginner: 'The **Builder** pattern builds complex objects step-by-step using readable method chains (`new User.Builder().setName("Alice").setAge(30).build()`), avoiding huge confusing constructors with dozens of arguments.',
        advanced: 'Builder eliminates "telescoping constructors" for complex classes with optional parameters. It uses a static inner Builder class providing chainable fluent interface methods culminating in a final `.build()` instantiation step.'
      },
      {
        title: '3. Behavioral Patterns: Observer & Strategy',
        beginner: 'The **Observer** pattern lets objects "subscribe" to event notifications (like push notifications). The **Strategy** pattern lets you swap out algorithms dynamically at runtime (like changing payment processing methods).',
        advanced: 'Observer creates a one-to-many publish-subscribe dependency between objects. Strategy encapsulates interchangeable algorithm behaviors behind a common interface, allowing algorithm selection to vary dynamically at runtime.'
      }
    ],
    {
      title: '🛠️ Mini-Project: Multi-Pattern E-Commerce Order Processor',
      intro: 'Build a modular ordering system integrating Singleton configuration, Builder order construction, and Strategy payment selection.',
      steps: [
        'Create a file named `DesignPatternsDemo.java`.',
        'Implement a thread-safe `DatabaseLogger` using the Singleton pattern.',
        'Implement an `Order` class using the Builder pattern for fluent construction (`new Order.Builder().addItem(...).build()`).',
        'Create a `PaymentStrategy` interface with implementations `CreditCardPayment` and `CryptoPayment`.',
        'In `main`, assemble an order using the Builder, log status using the Singleton, and process payment using the Strategy pattern.',
        'Compile and execute using `javac DesignPatternsDemo.java && java DesignPatternsDemo`.'
      ],
      goal: 'You successfully implemented battle-tested enterprise design patterns (Singleton, Builder, Strategy) in clean Java.'
    },
    [
      q('Which design pattern prevents a class from being instantiated more than once across an entire application?', ['Factory', 'Singleton', 'Observer', 'Strategy'], 1, 'Singleton guarantees a single shared global object instance by enforcing a private constructor.'),
      q('Why is the Builder pattern preferred when creating complex objects with many optional fields?', ['It makes code run faster in CPU memory', 'It replaces long, confusing constructors with clear, chainable, fluent methods', 'It converts Java classes into SQL tables', 'It removes the need for getters'], 1, 'Builder avoids telescoping constructor anti-patterns using readable fluent method chaining.'),
      q('Which pattern enables swapping out an algorithm (such as changing sorting or payment logic) dynamically at runtime?', ['Observer Pattern', 'Strategy Pattern', 'Singleton Pattern', 'Factory Pattern'], 1, 'Strategy encapsulates algorithms behind a shared interface, enabling runtime algorithm substitution.')
    ],
    [
      'Singleton enforces a single global instance; Factory decouples object creation logic.',
      'Builder uses fluent method chaining to cleanly construct complex objects with optional parameters.',
      'Strategy encapsulates interchangeable algorithms behind common interfaces for flexible runtime swapping.'
    ]
  ),

  L(
    'java-30', 30, 'Capstone Project & Deployment', '🛠️',
    '🖥️ **Terminal Notice:** If you want to use a big terminal on your own computer instead of the built-in one, please read Lesson 1 for full setup instructions.\n\nCongratulations on reaching the final lesson! This comprehensive capstone module brings together everything you have learned across all 30 lessons. You will review enterprise application architecture, JAR packaging, Docker containerization basics, and CI/CD deployment pipelines.',
    [
      {
        title: '1. Production Application Architecture',
        beginner: 'Production applications separate code into organized layers: Controllers handle web URLs, Services execute business rules, and Repositories talk to the database. This layered structure keeps systems clean and maintainable.',
        advanced: 'Production Java web systems enforce multi-tier separation of concerns: Presentation Layer (`@RestController`), Business Layer (`@Service`), Data Access Layer (`@Repository`), and Database Storage. DTOs (Data Transfer Objects) isolate internal entity structures.'
      },
      {
        title: '2. Executable JARs & Docker Containerization',
        beginner: 'To ship your app to production, build tools package all compiled code into a single executable `fat-JAR`. Docker packages your JAR file along with a Java runtime into a lightweight "container" that runs anywhere identically.',
        advanced: 'Spring Boot builds executable uber-JARs containing application code and embedded application servers (Tomcat). Docker packages application JARs, JRE runtimes, and dependencies into portable, immutable container images via `Dockerfile` instructions.'
      },
      {
        title: '3. CI/CD Deployment Pipelines',
        beginner: 'Continuous Integration / Continuous Deployment (CI/CD) pipelines automatically compile code, run your unit test suites, build Docker images, and deploy your Java application to cloud servers whenever code is pushed to GitHub.',
        advanced: 'CI/CD pipelines (e.g., GitHub Actions) automate software delivery: code triggers automated builds, executes test suites, performs code quality scans, builds Docker images, pushes artifacts to registries, and deploys containers to cloud platforms.'
      }
    ],
    {
      title: '🛠️ Capstone Project: Full REST API Service Backend',
      intro: 'Build the grand final Capstone Project! You will implement an end-to-end multi-layer REST API service featuring layered architecture, custom exception handling, thread-safe memory storage, functional Stream analytics, and JSON processing.',
      steps: [
        'Create a file named `CapstoneBackend.java`.',
        'Define a `Product` model entity with fields `id`, `name`, `category`, and `price`.',
        'Create a `ProductRepository` handling thread-safe CRUD operations using a `ConcurrentHashMap`.',
        'Create a `ProductService` implementing business rules and processing inventory analytics via Stream pipelines.',
        'Define a custom `ProductNotFoundException` and an error handling handler layer.',
        'Create a `ProductController` mapping simulated HTTP endpoints (`GET /api/products`, `POST /api/products`, `GET /api/analytics`).',
        'In `main`, simulate receiving HTTP web requests, executing service operations, running stream analytics, and returning serialized payload reports.',
        'Compile and execute using `javac CapstoneBackend.java && java CapstoneBackend`.'
      ],
      goal: 'Congratulations! You built a complete, multi-layered REST API backend system integrating OOP, Collections, Concurrency, Streams, Exceptions, and REST architecture!'
    },
    [
      q('Why do production Java backend applications separate code into Controller, Service, and Repository layers?', ['To force the application to use more memory', 'To enforce Separation of Concerns, making code maintainable, decoupled, and easy to test', 'To convert Java code to JavaScript automatically', 'Because Java will not compile without three folders'], 1, 'Layered architecture enforces clear separation of web handling, business logic, and database access.'),
      q('What is the main benefit of containerizing a Java application JAR file using Docker?', ['It removes the need to write unit tests', 'It creates a lightweight, portable container that runs identically across any cloud or local environment', 'It makes database queries run without SQL', 'It doubles the CPU speed automatically'], 1, 'Docker packages application binaries and runtime environments into immutable, portable deployment containers.'),
      q('What is the role of a CI/CD pipeline in modern software development?', ['To write application source code automatically without human input', 'To automate building, testing, packaging, and deploying software whenever changes occur', 'To clean up physical RAM memory chips', 'To replace build tools like Maven'], 1, 'CI/CD pipelines automate software build, test, and deployment workflows to ensure reliable delivery.')
    ],
    [
      'Production Java architectures enforce multi-layered separation of concerns (Controller, Service, Repository).',
      'Docker packages executable Java JAR files into portable, self-contained container images.',
      'Congratulations on completing all 30 lessons! You now possess a solid foundation in core Java, OOP, Collections, Concurrency, and modern web APIs.'
    ]
  )
];

export const getJavaLessonById = (id: string): JavaLesson | undefined =>
  JAVA_LESSONS.find(l => l.id === id);

export const isJavaLessonUnlocked = (id: string, completedLessons: string[]): boolean => {
  const idx = JAVA_LESSONS.findIndex(l => l.id === id);
  if (idx <= 0) return true;
  return completedLessons.includes(JAVA_LESSONS[idx - 1].id);
};
