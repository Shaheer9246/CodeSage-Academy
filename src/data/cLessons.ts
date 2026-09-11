
import type {
  NetworkingLesson,
  Concept,
  QuizQuestion,
} from './networkingLessons';

export type CFreeLesson = NetworkingLesson & {
  tier: 'free';
};

const L = (
  id: string,
  order: number,
  title: string,
  icon: string,
  philosophy: string,
  concepts: Concept[],
  practical: CFreeLesson['practical'],
  quiz: QuizQuestion[],
  keyTakeaways: string[],
  terminalNotice?: string
): CFreeLesson => ({
  id,
  module: 'Module 1: C Programming — Beginner to Advanced (Free)',
  order,
  title,
  icon,
  philosophy,
  concepts,
  practical,
  quiz,
  keyTakeaways,
  terminalNotice,
  tier: 'free',
});

const q = (
  question: string,
  options: string[],
  correctIndex: number,
  explanation?: string
): QuizQuestion => ({
  question,
  options,
  correctIndex,
  explanation,
});

export const C_FREE_TRACK_NOTICE = {
  type: 'track-notice',
  notice:
    '🧠 C Free Track Status: This track takes you from absolute C beginner to advanced systems thinking. You will learn compilation, memory, pointers, arrays, strings, functions, debugging, and professional C discipline. Use the lightweight browser C lab for small examples, but always verify serious programs using GCC or Clang in your local terminal.',
};

export const C_FREE_LESSONS: CFreeLesson[] = [
  L(
    'c-01',
    1,
    'Environment Setup & Language Core',
    '🚀',
    '🚀 C is the language that lets you speak directly to the machine. Before building operating systems, embedded firmware, game engines, or high-performance tools, you must prepare your development environment and understand how a C program moves from text to execution. This lesson turns your computer into a real C development workstation.',
    [
      {
        title: '1. The C Compiler Toolchain',
        beginner:
          'A C compiler is the machine that translates your human-readable C code into a program your computer can execute. When you write code in a file like main.c, the compiler reads it, checks it, and produces an executable file that your operating system can run.',
        advanced:
          'The C toolchain is not just one program. It includes a preprocessor, compiler, assembler, and linker. GCC and Clang are compiler drivers that coordinate these stages. They transform source code through preprocessing, translation, assembly, and linking to create a final executable binary.',
      },
      {
        title: '2. Terminal and Shell Control',
        beginner:
          'The terminal is your control room. Instead of clicking icons, you type commands to move through folders, create files, compile code, and run programs. In C development, the terminal is essential because compilers are command-line tools.',
        advanced:
          'The shell resolves commands through environment paths. When you type gcc, the shell searches your PATH environment variable for the compiler executable. If the compiler is not installed or not mapped correctly, the shell returns a command-not-found error.',
      },
      {
        title: '3. Structure of a C Program',
        beginner:
          'A basic C program starts with a main function. The main function is the entry point of your program. Inside it, you write instructions. The printf function is commonly used to print text to the terminal.',
        advanced:
          'A hosted C program normally begins execution in main with a return type of int. Returning 0 conventionally indicates successful termination. Header files like stdio.h expose standard library declarations so the compiler can validate calls such as printf.',
      },
      {
        title: '4. The Compile and Run Loop',
        beginner:
          'C development follows a loop: write code, compile it, run it, observe the output, then fix mistakes. You will repeat this cycle constantly. This loop teaches you how the computer responds to every instruction.',
        advanced:
          'The compile-run cycle exposes the difference between compile-time errors, linker errors, and runtime behavior. A program may compile successfully but still contain logic errors, undefined behavior, or memory mistakes that only appear during execution.',
      },
      {
        title: '5. Errors, Warnings, and Standards',
        beginner:
          'When your code has a syntax mistake, the compiler stops and shows an error. Warnings are also important. They often point to suspicious code that may still compile but can cause bugs later.',
        advanced:
          'Professional C development uses strict warning flags such as -Wall and -Wextra. C also has standards like C89, C99, C11, C17, and C23. Compiler behavior can differ depending on the selected standard and platform.',
      },
    ],
    {
      title: 'Compiler Activation & First C Program',
      intro:
        '⚠️ This practical is best completed in your local terminal because it verifies a real C compiler installation and builds your first executable program.',
      steps: [
        'Open your terminal. On Windows, use Command Prompt, PowerShell, or a MSYS2 terminal. On macOS or Linux, use the default terminal.',
        'Check if a compiler is available by typing: gcc --version or clang --version.',
        'If no compiler is found, install MinGW-w64 or MSYS2 on Windows, Xcode Command Line Tools on macOS, or build-essential on Linux.',
        'Create a new file named hello.c using any plain-text editor.',
        'Write this program inside hello.c: #include <stdio.h> then int main() { printf("Hello, C!\\n"); return 0; }',
        'Compile the program by typing: gcc hello.c -o hello',
        'Run the program. On macOS or Linux, type: ./hello. On Windows, type: hello.exe if needed.',
        'Modify the printed message, recompile, and run again to see the updated output.',
        'Intentionally remove a semicolon, recompile, and observe how the compiler reports the syntax error.',
      ],
      goal: 'You successfully installed or verified a C compiler, wrote a C source file, compiled it, executed the resulting program, and observed how compile-time errors work.',
    },
    [
      q(
        'What is the main job of a C compiler?',
        [
          'To edit source code automatically',
          'To translate C source code into an executable program',
          'To store files in the cloud',
          'To design graphical interfaces',
        ],
        1,
        'A compiler translates human-readable C source code into machine-level executable code that the operating system can run. The other options are not compiler responsibilities.'
      ),
      q(
        'Which command compiles a file named hello.c into an executable named hello?',
        [
          'compile hello.c',
          'gcc hello.c -o hello',
          'run hello.c',
          'make hello execute',
        ],
        1,
        'The command gcc hello.c -o hello tells the GCC compiler to compile hello.c and produce an output executable named hello. The other commands are not valid standard compiler commands.'
      ),
      q(
        'What is the purpose of the main function in a standard hosted C program?',
        [
          'It stores global variables',
          'It is the entry point where program execution begins',
          'It prints errors only',
          'It connects to the internet',
        ],
        1,
        'In a normal hosted C program, execution begins at main. The other options describe unrelated functionality.'
      ),
      q(
        'What does #include <stdio.h> provide?',
        [
          'It adds graphics support',
          'It declares standard input and output functions such as printf',
          'It creates a database',
          'It compiles the program faster',
        ],
        1,
        'The stdio.h header provides declarations for standard input/output functions, including printf. It does not provide graphics, databases, or compiler speed improvements.'
      ),
      q(
        'What should you do when the compiler gives a warning?',
        [
          'Ignore it permanently',
          'Delete the compiler',
          'Investigate it because it may indicate a real problem',
          'Restart the computer',
        ],
        2,
        'Compiler warnings often reveal suspicious or dangerous code patterns. Professional developers treat warnings seriously and investigate them. Ignoring warnings can hide real bugs.'
      ),
    ],
    [
      'Install and verify a C compiler such as GCC or Clang.',
      'Use the terminal to navigate, compile, and run C programs.',
      'Understand that main is the standard entry point of a C program.',
      'Learn the compile-run-fix development loop.',
      'Pay attention to compiler errors and warnings from day one.',
    ],
    'This lesson is best completed in your local terminal because it verifies a real C compiler installation.'
  ),

  L(
    'c-02',
    2,
    'The C Compilation Pipeline',
    '🏭',
    '🏭 A C program does not become an executable by magic. It moves through a precise industrial pipeline: preprocessing, compilation, assembly, and linking. Understanding this pipeline separates people who merely write C code from engineers who understand how C software is actually built.',
    [
      {
        title: '1. Preprocessing',
        beginner:
          'Before the compiler translates your code, the preprocessor prepares it. It handles lines that begin with #, such as #include and #define. For example, #include <stdio.h> tells the preprocessor to bring in declarations from the stdio header.',
        advanced:
          'The preprocessor performs textual transformation before compilation. It expands macros, includes header contents, and processes conditional compilation directives such as #ifdef, #ifndef, and #endif. This stage does not understand C semantics; it manipulates source text.',
      },
      {
        title: '2. Compilation to Assembly',
        beginner:
          'After preprocessing, the compiler translates your C code into assembly language. Assembly is a low-level language that is much closer to the processor than C, but still readable by humans.',
        advanced:
          'The compiler parses preprocessed source into an abstract syntax tree, performs optimizations, and emits target-specific assembly. This stage is where many semantic errors are detected, including type mismatches and invalid expressions.',
      },
      {
        title: '3. Assembly to Object Files',
        beginner:
          'The assembler converts assembly code into an object file. An object file contains machine code, but it may not yet be a complete program because it can still need code from other files or libraries.',
        advanced:
          'Object files contain machine code plus metadata such as symbol tables, relocation information, and section layout. They are intermediate artifacts that the linker later combines into a final executable or shared library.',
      },
      {
        title: '4. Linking',
        beginner:
          'Linking connects your compiled code with other code it needs. If your program uses printf, the linker connects your code to the standard library implementation. The final result is an executable program.',
        advanced:
          'The linker resolves symbols across object files and libraries. It assigns final addresses, combines sections, and integrates runtime startup code. Linker errors often appear when a function is declared but its implementation is missing.',
      },
      {
        title: '5. Build Flags and Diagnostics',
        beginner:
          'Compiler flags change how the build behaves. For example, -Wall enables many useful warnings, and -o chooses the output file name. Learning flags helps you catch mistakes early.',
        advanced:
          'Production builds may use flags such as -Wall, -Wextra, -O2, -g, -std=c11, and sanitizer options. These flags control warnings, optimization level, debug symbols, language standard, and runtime safety checks.',
      },
    ],
    {
      title: 'Pipeline Inspection Lab',
      intro:
        'This practical reveals each stage of the C build pipeline by producing intermediate files with GCC.',
      steps: [
        'Create a file named pipeline.c.',
        'Write a simple program: #include <stdio.h> then int main() { printf("Pipeline active\\n"); return 0; }',
        'Run the preprocessor only: gcc -E pipeline.c -o pipeline.i',
        'Open pipeline.i and notice how the header contents have been inserted.',
        'Generate assembly output: gcc -S pipeline.c -o pipeline.s',
        'Open pipeline.s and observe the low-level assembly representation.',
        'Create an object file: gcc -c pipeline.c -o pipeline.o',
        'Link the object file into an executable: gcc pipeline.o -o pipeline',
        'Run the executable and confirm the output.',
        'Recompile with strict warnings: gcc pipeline.c -Wall -Wextra -o pipeline',
      ],
      goal: 'You successfully inspected the preprocessing, compilation, assembly, and linking stages of the C build pipeline.',
    },
    [
      q(
        'What stage handles #include directives?',
        [
          'Linking',
          'Preprocessing',
          'Runtime execution',
          'Garbage collection',
        ],
        1,
        'The preprocessor handles #include directives by inserting header contents into the source before compilation. The other stages do not perform this task.'
      ),
      q(
        'What does an object file contain?',
        [
          'Only source code comments',
          'Machine code and metadata that still may need linking',
          'Only user documentation',
          'A complete graphical interface',
        ],
        1,
        'An object file contains compiled machine code and metadata, but it may still need to be linked with other object files or libraries before becoming a complete executable.'
      ),
      q(
        'Which stage resolves symbols like printf from the standard library?',
        [
          'Preprocessing',
          'Linking',
          'Variable declaration',
          'Input scanning',
        ],
        1,
        'The linker resolves symbols and connects your code with library implementations such as printf. Preprocessing only prepares source text.'
      ),
      q(
        'What does the -Wall flag do?',
        [
          'Deletes warnings',
          'Enables many common compiler warnings',
          'Makes the program run slower',
          'Prevents compilation',
        ],
        1,
        'The -Wall flag enables many useful warnings that help detect suspicious code patterns. It does not delete warnings or prevent compilation by itself.'
      ),
      q(
        'Why can a program compile but fail during linking?',
        [
          'Because the source code has no functions',
          'Because a required function or object implementation is missing during symbol resolution',
          'Because the terminal is closed',
          'Because the file extension is .c',
        ],
        1,
        'A linker failure usually means the compiler understood the declarations, but the linker could not find the actual implementation of a required symbol. The other options are unrelated.'
      ),
    ],
    [
      'C code passes through preprocessing, compilation, assembly, and linking.',
      '#include directives are processed before real compilation.',
      'Object files are intermediate build artifacts.',
      'The linker combines object files and libraries into executables.',
      'Use compiler flags to improve diagnostics and build quality.',
    ],
    'This lesson is best completed in your local terminal because it inspects real compiler pipeline artifacts.'
  ),

  L(
    'c-03',
    3,
    'Variables & Data Types',
    '📦',
    '📦 Variables are named storage locations, and data types define what kind of data those locations can hold. In C, types are not optional decoration. They control memory size, interpretation, arithmetic behavior, and performance. Mastering types is the first step toward understanding memory.',
    [
      {
        title: '1. Typed Storage',
        beginner:
          'A variable is like a labeled box in memory. Before using it, you must say what type of data it will store. For example, int age = 20; creates an integer variable named age and gives it the value 20.',
        advanced:
          'C is statically typed. The compiler uses type information to allocate storage, select instructions, and detect invalid operations. A type defines representation, size, alignment, and permitted operations.',
      },
      {
        title: '2. Core Primitive Types',
        beginner:
          'C provides basic types such as int for whole numbers, char for single characters, float for decimal numbers, and double for more precise decimal numbers. Choosing the right type matters.',
        advanced:
          'Primitive type sizes are implementation-defined in some cases. The C standard guarantees minimum ranges, not fixed byte sizes for every type. Use fixed-width types from stdint.h when exact sizes are required.',
      },
      {
        title: '3. Declaration and Initialization',
        beginner:
          'You declare a variable by writing its type and name. You can initialize it immediately, like int score = 100;. Initializing variables prevents them from containing unpredictable garbage values.',
        advanced:
          'Uninitialized automatic variables have indeterminate values. Reading them can cause undefined behavior. Professional C code initializes variables deliberately, especially local variables with automatic storage duration.',
      },
      {
        title: '4. sizeof and Memory Awareness',
        beginner:
          'The sizeof operator tells you how much memory a type or variable uses. For example, sizeof(int) may return 4, meaning an int uses 4 bytes on many systems.',
        advanced:
          'sizeof yields a size_t value and is evaluated at compile time for most types. Memory awareness is central to C engineering because buffer size, alignment, and allocation all depend on type size.',
      },
      {
        title: '5. Type Conversion',
        beginner:
          'Sometimes C converts one type to another automatically. For example, if you divide 5 by 2 using integers, the result is 2, not 2.5. If you use floating-point numbers, the result becomes 2.5.',
        advanced:
          'C performs implicit conversions according to integer promotion and usual arithmetic conversion rules. Explicit casts override default conversion, but unsafe casts can hide serious bugs and invoke undefined behavior.',
      },
    ],
    {
      title: 'Type Size & Value Lab',
      intro:
        'This practical explores how C stores common types and how type choice changes program output.',
      steps: [
        'Create a file named types.c.',
        'Add #include <stdio.h> at the top.',
        'Inside main, declare: int count = 10; float price = 19.99; char grade = 65; double precise = 3.1415926535;',
        'Print each value using printf with correct format specifiers: %d, %f, %c, and %f.',
        'Print type sizes using printf("sizeof(int): %zu bytes\\n", sizeof(int));',
        'Repeat sizeof for char, float, and double.',
        'Add integer division: printf("%d\\n", 5 / 2);',
        'Add floating division: printf("%f\\n", 5.0 / 2.0);',
        'Compile with: gcc types.c -Wall -Wextra -o types',
        'Run the program and compare integer division with floating-point division.',
      ],
      goal: 'You successfully declared typed variables, printed values with correct format specifiers, measured type sizes, and observed integer versus floating-point division.',
    },
    [
      q(
        'What does int age = 21; do?',
        [
          'Declares an integer variable named age and initializes it to 21',
          'Creates a text string',
          'Prints 21 to the screen',
          'Deletes a variable',
        ],
        0,
        'The statement declares an int variable named age and initializes it with the value 21. It does not print anything by itself.'
      ),
      q(
        'Which type is most appropriate for storing a single character?',
        [
          'double',
          'char',
          'float',
          'long',
        ],
        1,
        'The char type is designed to store a single character value, represented internally as an integer. The other types are numeric types for larger or fractional values.'
      ),
      q(
        'What is the result of 5 / 2 when both values are integers?',
        [
          '2.5',
          '3',
          '2',
          'Error',
        ],
        2,
        'Integer division discards the fractional part, so 5 / 2 produces 2. To get 2.5, at least one operand must be a floating-point value.'
      ),
      q(
        'What does sizeof(double) return?',
        [
          'The value stored in a double variable',
          'The number of bytes used by the double type on the target platform',
          'The maximum value of double',
          'The address of double',
        ],
        1,
        'sizeof returns the amount of memory used by a type or expression. For double, it commonly returns 8 bytes on many systems, but the exact value depends on the platform.'
      ),
      q(
        'Why should you initialize local variables?',
        [
          'To make the compiler ignore them',
          'To avoid reading unpredictable indeterminate values',
          'To convert them into strings',
          'To reserve network memory',
        ],
        1,
        'Local variables without initialization can contain indeterminate values. Initializing them gives your program predictable behavior and prevents many bugs.'
      ),
    ],
    [
      'Variables are typed storage locations.',
      'C types control size, interpretation, and allowed operations.',
      'Initialize variables to avoid unpredictable values.',
      'Use sizeof to build memory awareness.',
      'Integer division and floating-point division behave differently.',
    ],
    'You can use the browser C lab for small examples, but local GCC or Clang gives the full type and compiler experience.'
  ),

  L(
    'c-04',
    4,
    'Operators & Expressions',
    '➗',
    '➗ Operators are the verbs of C. They calculate, compare, assign, and combine values. Expressions are the sentences built from those verbs. In C, expressions are powerful, but they demand precision because evaluation order, integer behavior, and precedence can change the meaning of your code.',
    [
      {
        title: '1. Arithmetic Operators',
        beginner:
          'C uses + for addition, - for subtraction, * for multiplication, / for division, and % for remainder. The remainder operator works with integers and tells you what is left after division.',
        advanced:
          'Arithmetic behavior depends on operand types. Integer division truncates toward zero, and division by zero is invalid. Signed integer overflow is undefined behavior, while unsigned overflow wraps predictably.',
      },
      {
        title: '2. Relational and Logical Operators',
        beginner:
          'Relational operators compare values: <, >, <=, >=, ==, and !=. Logical operators combine conditions: && means and, || means or, and ! means not.',
        advanced:
          'C does not have a native boolean type in older standards; it uses integers where zero is false and nonzero is true. Logical operators short-circuit, meaning evaluation may stop once the result is known.',
      },
      {
        title: '3. Assignment and Compound Assignment',
        beginner:
          'The = operator stores a value into a variable. Compound forms like +=, -=, *=, and /= update a variable using its current value. For example, score += 10 adds 10 to score.',
        advanced:
          'Assignment is an expression in C and produces the assigned value. Although this enables chained assignment, it also creates bugs when = is accidentally used instead of == inside conditions.',
      },
      {
        title: '4. Increment and Decrement',
        beginner:
          'The ++ operator increases a value by one, and -- decreases it by one. You can place them before or after a variable, but the position changes when the value is used.',
        advanced:
          'Prefix and postfix forms have different evaluation semantics. Modifying the same variable more than once between sequence points can cause undefined behavior. Keep increment expressions simple.',
      },
      {
        title: '5. Precedence and Parentheses',
        beginner:
          'Operators have a priority order. Multiplication happens before addition unless parentheses force a different order. When in doubt, use parentheses to make your meaning clear.',
        advanced:
          'Precedence and associativity determine how expressions are parsed, but they do not fully define evaluation order. Complex expressions can be hard to audit, so professional code favors clarity over cleverness.',
      },
    ],
    {
      title: 'Expression Behavior Lab',
      intro:
        'This practical tests arithmetic, comparison, compound assignment, and precedence behavior.',
      steps: [
        'Create a file named operators.c.',
        'Add #include <stdio.h> at the top.',
        'Inside main, declare: int a = 10; int b = 3;',
        'Print a + b, a - b, a * b, a / b, and a % b using printf.',
        'Create int c = 5; then use c += 2; and print c.',
        'Create int d = 7; then use d *= 3; and print d.',
        'Print comparison results: printf("%d\\n", a > b);',
        'Print logical results: printf("%d\\n", (a > b) && (b != 0));',
        'Print precedence behavior: printf("%d\\n", 2 + 3 * 4);',
        'Print grouped behavior: printf("%d\\n", (2 + 3) * 4);',
        'Compile with: gcc operators.c -Wall -Wextra -o operators',
        'Run the program and verify each result.',
      ],
      goal: 'You successfully used arithmetic, comparison, logical, assignment, and precedence rules in working C expressions.',
    },
    [
      q(
        'What does 10 % 3 evaluate to?',
        [
          '3',
          '1',
          '0',
          '10',
        ],
        1,
        'The % operator returns the remainder after integer division. Ten divided by three leaves a remainder of one.'
      ),
      q(
        'What does x += 4 do?',
        [
          'Sets x to 4',
          'Adds 4 to the current value of x and stores the result back in x',
          'Checks whether x equals 4',
          'Deletes x',
        ],
        1,
        'The compound assignment x += 4 is equivalent to x = x + 4. It updates x by adding 4 to its current value.'
      ),
      q(
        'Which operator checks equality?',
        [
          '=',
          '==',
          '!=',
          '=>',
        ],
        1,
        'The == operator checks equality. The single = operator assigns a value, which is a common source of bugs when used inside conditions.'
      ),
      q(
        'What is the result of 2 + 3 * 4?',
        [
          '20',
          '14',
          '24',
          '9',
        ],
        1,
        'Multiplication has higher precedence than addition, so 3 * 4 is evaluated first, then 2 is added, producing 14.'
      ),
      q(
        'Why should increment and decrement expressions be kept simple?',
        [
          'Because they are slow',
          'Because complex modification of the same variable can create confusing or undefined behavior',
          'Because they only work with floats',
          'Because they cannot be used in loops',
        ],
        1,
        'Simple increment and decrement expressions are easier to reason about. Complex expressions that modify the same variable multiple times can introduce subtle bugs and undefined behavior.'
      ),
    ],
    [
      'Operators build expressions that compute and compare values.',
      'Integer division truncates the fractional part.',
      'Use == for comparison and = for assignment.',
      'Compound assignment operators make updates cleaner.',
      'Use parentheses to remove ambiguity from expressions.',
    ],
    'You can use the browser C lab for small expression experiments, but local compilation with warnings is recommended.'
  ),

  L(
    'c-05',
    5,
    'Control Flow',
    '🔀',
    '🔀 A program becomes intelligent when it can choose paths and repeat work. Control flow gives C its decision-making power. With if statements, loops, and switches, your program can respond to data, validate input, and process large amounts of information efficiently.',
    [
      {
        title: '1. if and else',
        beginner:
          'The if statement checks a condition. If the condition is true, the code inside runs. The else branch runs when the condition is false. This lets your program choose between different paths.',
        advanced:
          'C conditions are scalar expressions. Zero is false, and nonzero is true. Understanding branch prediction and predictable conditional structure can matter in performance-sensitive systems code.',
      },
      {
        title: '2. switch Statements',
        beginner:
          'A switch statement compares one value against many possible constant values. It is useful for menus, commands, and state values. Each case represents one possible match.',
        advanced:
          'Switch statements require integral expressions and constant case labels. Fallthrough behavior can be useful but dangerous. The break statement usually prevents accidental execution of the next case.',
      },
      {
        title: '3. while and do while Loops',
        beginner:
          'A while loop repeats code as long as its condition remains true. A do while loop runs the body first and checks the condition afterward, guaranteeing the body runs at least once.',
        advanced:
          'Loop conditions must eventually become false, or the program enters an infinite loop. Low-level C programs often use while loops for parsing, polling, reading streams, and processing buffers.',
      },
      {
        title: '4. for Loops',
        beginner:
          'A for loop is perfect when you know how many times you want to repeat something. It combines initialization, condition, and update in one line.',
        advanced:
          'The for loop has three expressions, but any of them can be omitted. In systems programming, for loops often iterate over arrays, buffers, file descriptors, and memory regions.',
      },
      {
        title: '5. break and continue',
        beginner:
          'The break statement exits a loop immediately. The continue statement skips the rest of the current loop iteration and moves to the next one.',
        advanced:
          'break and continue affect control flow locally, but overusing them can make loop logic harder to verify. In nested loops, break exits only the innermost loop.',
      },
    ],
    {
      title: 'FizzBuzz & Menu Control Lab',
      intro:
        'This practical builds decision logic and loop control using a classic programming challenge.',
      steps: [
        'Create a file named flow.c.',
        'Add #include <stdio.h> at the top.',
        'Inside main, write a for loop that counts from 1 to 20.',
        'Inside the loop, use if and the modulo operator to detect multiples of 3 and 5.',
        'Print FizzBuzz for multiples of both 3 and 5.',
        'Print Fizz for multiples of 3 only.',
        'Print Buzz for multiples of 5 only.',
        'Print the number itself for all other values.',
        'Compile with: gcc flow.c -Wall -Wextra -o flow',
        'Run the program and verify that the output is correct.',
        'Add a switch statement that prints a message based on an int menuChoice value.',
      ],
      goal: 'You successfully used if statements, modulo logic, for loops, and switch statements to control program execution.',
    },
    [
      q(
        'What does an if statement do?',
        [
          'It repeats code forever',
          'It executes a block of code only when a condition is true',
          'It defines a function',
          'It creates a variable',
        ],
        1,
        'An if statement evaluates a condition and executes its body when the condition is true. It does not define functions or create variables.'
      ),
      q(
        'What is the purpose of break inside a switch statement?',
        [
          'To restart the switch',
          'To exit the switch and prevent fallthrough into the next case',
          'To skip all cases',
          'To print errors',
        ],
        1,
        'The break statement exits the switch block. Without it, execution can continue into the next case, which is called fallthrough.'
      ),
      q(
        'Which loop checks its condition before running the loop body?',
        [
          'do while loop',
          'while loop',
          'switch loop',
          'case loop',
        ],
        1,
        'A while loop checks the condition before executing the body. A do while loop executes the body first and checks the condition afterward.'
      ),
      q(
        'What are the three parts of a typical for loop header?',
        [
          'Input, output, error',
          'Initialization, condition, update',
          'Compile, link, run',
          'Read, write, close',
        ],
        1,
        'A for loop commonly has initialization, condition, and update expressions. This structure is ideal for counted iteration.'
      ),
      q(
        'What does continue do inside a loop?',
        [
          'It stops the entire program',
          'It skips the remaining code in the current iteration and moves to the next iteration',
          'It restarts the computer',
          'It deletes the loop variable',
        ],
        1,
        'The continue statement skips the rest of the current loop iteration and proceeds with the next iteration. It does not stop the entire program.'
      ),
    ],
    [
      'Use if and else to make decisions.',
      'Use switch for multi-way constant value selection.',
      'Use while when repetition depends on a condition.',
      'Use for when iteration count is known.',
      'Use break and continue carefully to keep loop logic clear.',
    ],
    'You can use the browser C lab for small control-flow experiments, but local compilation is recommended for full warning output.'
  ),

  L(
    'c-06',
    6,
    'Functions',
    '🛠️',
    '🛠️ Functions are the first level of real software organization. They let you break a large problem into named, reusable pieces. In C, functions also reveal how the machine handles calls, arguments, return values, and stack frames. This is where C starts teaching you not just programming, but computer architecture.',
    [
      {
        title: '1. Defining and Calling Functions',
        beginner:
          'A function is a named block of code that performs a task. You define it once, then call it whenever you need that task. Functions can receive inputs and return outputs.',
        advanced:
          'A function definition specifies return type, name, parameters, and body. A function call creates a runtime activation, passing arguments according to the platform calling convention.',
      },
      {
        title: '2. Parameters and Return Values',
        beginner:
          'Parameters are the inputs a function receives. The return statement sends a result back to the caller. If a function returns int, it must produce an integer result.',
        advanced:
          'C arguments are passed by value by default. The callee receives a copy of the argument, not the original variable. To allow a function to modify caller data, pointers are used.',
      },
      {
        title: '3. Function Prototypes',
        beginner:
          'A prototype declares a function before you define it. It tells the compiler the function name, return type, and parameter types. This allows you to call the function earlier in the file.',
        advanced:
          'Prototypes enable compile-time argument checking. Missing or mismatched prototypes can hide serious bugs, especially when functions are used across multiple source files.',
      },
      {
        title: '4. Scope and Lifetime',
        beginner:
          'Variables created inside a function are local. They exist while the function runs and cannot be accessed from outside. This keeps functions isolated and easier to understand.',
        advanced:
          'Automatic local variables have stack-based lifetime. Static local variables retain storage across calls. Global variables have static storage duration but increase coupling and maintenance risk.',
      },
      {
        title: '5. The Call Stack',
        beginner:
          'When a function calls another function, the computer remembers where to return. It stacks function calls one on top of another. When a function finishes, control returns to the caller.',
        advanced:
          'Each call creates a stack frame containing parameters, locals, return address, and bookkeeping data. Deep recursion can exhaust stack space, while heap allocation follows different lifetime rules.',
      },
    ],
    {
      title: 'Function Composition Lab',
      intro:
        'This practical builds reusable math functions and demonstrates return values, parameters, and prototypes.',
      steps: [
        'Create a file named functions.c.',
        'Add #include <stdio.h> at the top.',
        'Add prototypes: int add(int a, int b); int multiply(int a, int b); int square(int value);',
        'Define add so it returns a + b.',
        'Define multiply so it returns a * b.',
        'Define square so it returns value * value.',
        'Inside main, call add(4, 5), multiply(3, 6), and square(7).',
        'Print each result with printf.',
        'Compile with: gcc functions.c -Wall -Wextra -o functions',
        'Run the program and verify the results.',
      ],
      goal: 'You successfully declared, defined, and called multiple functions with parameters and return values.',
    },
    [
      q(
        'What does a function return?',
        [
          'A value sent back to the caller using the return statement',
          'A global variable',
          'A header file',
          'A compiler flag',
        ],
        0,
        'The return statement sends a value back to the caller. The type of the returned value must match the function return type or be convertible to it.'
      ),
      q(
        'What does pass by value mean in C?',
        [
          'The function receives a copy of the argument',
          'The function always changes the original variable',
          'The argument is stored in a file',
          'The argument is sent over the network',
        ],
        0,
        'C passes arguments by value by default, meaning the function receives a copy. To modify the original variable, the caller must pass a pointer.'
      ),
      q(
        'Why are function prototypes useful?',
        [
          'They let the compiler check function calls before the function definition appears',
          'They make functions run faster',
          'They replace main',
          'They prevent all bugs',
        ],
        0,
        'Prototypes declare function signatures so the compiler can validate calls. They do not make functions faster or prevent all bugs.'
      ),
      q(
        'Where do local variables inside a function usually live?',
        [
          'On the stack',
          'In the database',
          'In the browser cache',
          'In the keyboard buffer',
        ],
        0,
        'Local automatic variables usually live on the stack. Their lifetime ends when the function returns.'
      ),
      q(
        'What happens when a function finishes?',
        [
          'Control returns to the caller',
          'The computer restarts',
          'The source file is deleted',
          'The compiler runs again',
        ],
        0,
        'When a function finishes, execution returns to the point where the function was called. The other options do not describe normal C behavior.'
      ),
    ],
    [
      'Functions organize code into reusable units.',
      'Parameters bring data in; return values send data out.',
      'C passes arguments by value by default.',
      'Prototypes help the compiler validate calls.',
      'Function calls are managed through the call stack.',
    ],
    'You can use the browser C lab for small function experiments, but local compilation is recommended for complete diagnostics.'
  ),

  L(
    'c-07',
    7,
    'Arrays',
    '🧮',
    '🧮 Arrays are your first real step into structured memory. An array stores multiple values of the same type in one continuous block of memory. Understanding arrays is essential because they are the foundation of buffers, matrices, strings, and low-level data processing.',
    [
      {
        title: '1. Array Basics',
        beginner:
          'An array is a list of values. For example, int scores[5]; creates space for five integers. Each item is accessed by an index, starting from zero.',
        advanced:
          'An array type describes a contiguous sequence of elements with fixed size. Array indexing is offset arithmetic: array[i] means the element located i positions from the beginning.',
      },
      {
        title: '2. Zero-Based Indexing',
        beginner:
          'C arrays start at index 0. The first element is scores[0], the second is scores[1], and the last element of a five-item array is scores[4].',
        advanced:
          'Zero-based indexing aligns naturally with pointer arithmetic and memory offsets. The element at index i is located at the base address plus i times the element size.',
      },
      {
        title: '3. Array Initialization',
        beginner:
          'You can initialize an array when you create it: int numbers[3] = {10, 20, 30};. If you provide fewer values than the array size, the remaining elements are initialized to zero.',
        advanced:
          'Array initialization rules depend on storage duration and initializer list completeness. Partial initialization zero-fills remaining elements, which is useful for buffers and lookup tables.',
      },
      {
        title: '4. Iterating with Loops',
        beginner:
          'Loops and arrays work together. A for loop can visit every element in an array. This is how you sum values, search for items, or print all elements.',
        advanced:
          'Array iteration is common in performance-critical code. Cache locality makes contiguous arrays efficient, but incorrect bounds can cause memory corruption.',
      },
      {
        title: '5. Bounds and Safety',
        beginner:
          'C does not automatically check whether an array index is valid. If you access scores[10] in a five-element array, your program may crash or behave strangely.',
        advanced:
          'Out-of-bounds array access is undefined behavior. It can corrupt adjacent memory, expose secrets, or create security vulnerabilities. Bounds checking is the responsibility of the C programmer.',
      },
    ],
    {
      title: 'Array Processing Lab',
      intro:
        'This practical builds array initialization, iteration, summation, and reversal logic.',
      steps: [
        'Create a file named arrays.c.',
        'Add #include <stdio.h> at the top.',
        'Inside main, declare: int values[5] = {4, 8, 15, 16, 23};',
        'Use a for loop to print every element.',
        'Create an int sum variable initialized to 0.',
        'Use another for loop to add every element to sum.',
        'Print the total sum.',
        'Write a reverse loop that prints the array from index 4 down to 0.',
        'Compile with: gcc arrays.c -Wall -Wextra -o arrays',
        'Run the program and verify the forward order, sum, and reverse order.',
      ],
      goal: 'You successfully created, initialized, iterated, summed, and reversed an array while respecting valid index bounds.',
    },
    [
      q(
        'What is the index of the first element in a C array?',
        [
          '1',
          '0',
          '-1',
          'It depends on the compiler',
        ],
        1,
        'C arrays are zero-based. The first element is at index 0, the second at index 1, and so on.'
      ),
      q(
        'What does int values[4]; create?',
        [
          'An array with four integer elements',
          'A single integer named values',
          'A floating-point array',
          'A text file',
        ],
        0,
        'The declaration int values[4]; creates an array capable of storing four int values, indexed from 0 through 3.'
      ),
      q(
        'What happens if you access an array outside its valid index range?',
        [
          'C automatically fixes the index',
          'The program may crash, corrupt memory, or behave unpredictably',
          'The compiler deletes the array',
          'The operating system restarts',
        ],
        1,
        'Out-of-bounds access is undefined behavior. C does not automatically protect you from invalid array indexing.'
      ),
      q(
        'Which loop is commonly used to visit every element in an array?',
        [
          'A for loop',
          'A switch loop',
          'A header loop',
          'A linker loop',
        ],
        0,
        'A for loop is commonly used to iterate through array elements because the number of elements is usually known.'
      ),
      q(
        'If an array has 10 elements, what is the last valid index?',
        [
          '10',
          '9',
          '1',
          '0',
        ],
        1,
        'Because arrays are zero-based, a 10-element array has valid indexes from 0 through 9.'
      ),
    ],
    [
      'Arrays store multiple values of the same type.',
      'Array indexes start at zero.',
      'Loops are the standard way to process arrays.',
      'C does not automatically check array bounds.',
      'Out-of-bounds access is dangerous and undefined.',
    ],
    'You can use the browser C lab for small array examples, but local compilation with warnings is recommended.'
  ),

  L(
    'c-08',
    8,
    'Strings & Character Data',
    '🔤',
    '🔤 In C, strings are not magical objects. They are arrays of characters ending with a special null terminator. This design gives C enormous power and efficiency, but it also places responsibility on you. Mastering strings means mastering memory, buffers, and safety.',
    [
      {
        title: '1. Characters as Integers',
        beginner:
          'The char type stores a character, but underneath it is stored as a number. For example, the character A has a numeric code. This is why C can do arithmetic with characters.',
        advanced:
          'char is an integer type. Character literals map to execution character set values, commonly ASCII-compatible. Signedness of char is implementation-defined, so use unsigned char when raw byte semantics matter.',
      },
      {
        title: '2. Null-Terminated Strings',
        beginner:
          'A C string is a character array that ends with a special character called the null terminator. It is written as \\0. This marker tells string functions where the string ends.',
        advanced:
          'C string APIs rely on null termination. If the terminator is missing, functions like strlen may read beyond the buffer, causing undefined behavior and security vulnerabilities.',
      },
      {
        title: '3. String Literals and Arrays',
        beginner:
          'A string literal looks like "Hello". You can store it in a character array: char message[] = "Hello";. The compiler automatically includes space for the null terminator.',
        advanced:
          'String literals have static storage duration and may be stored in read-only memory. Modifying a literal through a non-const char pointer is undefined behavior.',
      },
      {
        title: '4. String Library Functions',
        beginner:
          'The string.h header provides useful functions. strlen measures length, strcpy copies strings, and strcmp compares strings. These functions expect valid null-terminated strings.',
        advanced:
          'Classic functions like strcpy and strcat are unsafe when buffer sizes are unknown. Professional code prefers bounded alternatives such as snprintf, strncpy with care, or safer library wrappers.',
      },
      {
        title: '5. Input and Buffer Safety',
        beginner:
          'When reading text input, you must provide enough space for the characters and the null terminator. The fgets function is safer than gets because it lets you specify a buffer size.',
        advanced:
          'Buffer overflow is one of the most dangerous C security flaws. Always validate input length, initialize buffers, and avoid unbounded reads. The gets function is obsolete and must never be used.',
      },
    ],
    {
      title: 'String Inspection & Safe Input Lab',
      intro:
        'This practical explores character arrays, string length, comparison, and safe input handling.',
      steps: [
        'Create a file named strings.c.',
        'Add #include <stdio.h> and #include <string.h> at the top.',
        'Inside main, declare: char name[32];',
        'Print a prompt: printf("Enter your name: ");',
        'Read input safely with fgets(name, sizeof(name), stdin);',
        'Print the length: printf("Length: %zu\\n", strlen(name));',
        'Declare char copy[32]; and copy the string with snprintf(copy, sizeof(copy), "%s", name);',
        'Print both strings and compare them using strcmp.',
        'Compile with: gcc strings.c -Wall -Wextra -o strings',
        'Run the program with short input and observe the output.',
        'Run again with a long input and observe how fgets prevents overflow by truncating the stored text.',
      ],
      goal: 'You successfully worked with null-terminated strings, measured length, copied safely, and used bounded input handling.',
    },
    [
      q(
        'What marks the end of a C string?',
        [
          'A period',
          'A null terminator written as \\0',
          'A semicolon',
          'A newline only',
        ],
        1,
        'C strings end with a null terminator. String functions continue reading characters until they encounter this terminator.'
      ),
      q(
        'What does strlen("Hello") return?',
        [
          '5',
          '6',
          '4',
          'It returns the full memory size of the buffer',
        ],
        0,
        'strlen returns the number of characters before the null terminator. The word Hello has five characters, so strlen returns 5.'
      ),
      q(
        'Why is fgets safer than gets?',
        [
          'Because fgets allows you to specify the buffer size',
          'Because fgets is faster',
          'Because gets uses encryption',
          'Because fgets deletes invalid input',
        ],
        0,
        'fgets limits the number of characters read, helping prevent buffer overflow. The gets function has no buffer size limit and is dangerous.'
      ),
      q(
        'What is a buffer overflow?',
        [
          'Writing more data into a buffer than it can hold',
          'A type of compiler warning',
          'A normal C feature',
          'A way to compress files',
        ],
        0,
        'A buffer overflow happens when data exceeds the allocated buffer size and overwrites adjacent memory. It can cause crashes or security vulnerabilities.'
      ),
      q(
        'What does strcmp compare?',
        [
          'Two strings',
          'Two integers',
          'Two files',
          'Two compilers',
        ],
        0,
        'The strcmp function compares two null-terminated strings and returns a value indicating their relationship. It does not compare files, compilers, or raw integers.'
      ),
    ],
    [
      'C strings are null-terminated character arrays.',
      'The null terminator tells string functions where the string ends.',
      'Use strlen, strcmp, and safe copy routines carefully.',
      'Always use bounded input functions like fgets.',
      'Never use gets because it can cause buffer overflow.',
    ],
    'You can use the browser C lab for small string examples, but local terminal execution is recommended for input-focused practicals.'
  ),
// C Free Track — Part 2: c-09 to c-16

L(
  'c-09',
  9,
  'Pointer Foundations',
  '🧭',
  '🧭 Pointers are the moment C stops being a simple programming language and becomes a machine control language. A pointer is not magic. It is a memory address with a type. When you master pointers, you understand how C really passes data, how arrays work, and how programs manipulate memory directly.',
  [
    {
      title: '1. Addresses and the & Operator',
      beginner:
        'Every variable lives at a memory address. The & operator gives you that address. If you write int x = 10; then &x means the location where x is stored. A pointer is simply a variable designed to hold an address.',
      advanced:
        'An address is an offset into the process address space. The type of the address matters because pointer arithmetic scales by the size of the pointed-to type. The compiler uses pointer type information to generate correct load and store instructions for the target architecture.',
    },
    {
      title: '2. Declaring Pointers and Dereferencing',
      beginner:
        'A pointer declaration uses a type and an asterisk. For example, int *p; means p can store the address of an int. The * operator dereferences a pointer, meaning it accesses the value stored at that address.',
      advanced:
        'Dereferencing is the operation that turns an address into usable data. The expression *p is an lvalue if p points to a modifiable object. Dereferencing an uninitialized, dangling, or null pointer is undefined behavior.',
    },
    {
      title: '3. Pointer Assignment and Aliasing',
      beginner:
        'When you assign one pointer to another, you copy the address, not the data. If two pointers point to the same variable, changing the value through one pointer can be seen through the other pointer.',
      advanced:
        'Pointer assignment creates aliasing. Multiple pointers can refer to the same storage location. Aliasing rules affect optimization, correctness, and low-level debugging. The restrict qualifier exists to promise the compiler that pointer ranges do not overlap.',
    },
    {
      title: '4. NULL and Safe Pointer Habits',
      beginner:
        'NULL is a special pointer value that means the pointer does not point to anything valid. Before dereferencing a pointer, you should often check whether it is NULL. This prevents many crashes.',
      advanced:
        'NULL is commonly implemented as address zero, but dereferencing it is undefined behavior on hosted systems. Defensive C code initializes pointers to NULL, checks allocation results, and sets pointers back to NULL after freeing them.',
    },
    {
      title: '5. Pass by Reference Using Pointers',
      beginner:
        'C functions normally receive copies of arguments. If you want a function to modify the original variable, you pass the address of that variable. The function receives a pointer and updates the value through it.',
      advanced:
        'C is strictly pass-by-value, but pointer values allow indirect access to caller storage. This is the foundation of output parameters, mutable data structures, and systems APIs that return status codes while writing results through pointer arguments.',
    },
  ],
  {
    title: 'Pointer Inspection Lab',
    intro:
      'This practical builds pointer awareness by printing addresses, values, pointer sizes, and modifying data indirectly through a pointer.',
    steps: [
      'Create a file named pointers.c.',
      'Add #include <stdio.h> at the top.',
      'Inside main, declare: int x = 42;',
      'Declare a pointer to x: int *p = &x;',
      'Print the value of x using printf("x = %d\\n", x);',
      'Print the address of x using printf("address of x = %p\\n", (void *)&x);',
      'Print the pointer value using printf("p = %p\\n", (void *)p);',
      'Print the value pointed to by p using printf("*p = %d\\n", *p);',
      'Modify x indirectly: *p = 99;',
      'Print x again and confirm that x changed to 99.',
      'Declare a null pointer: int *empty = NULL;',
      'Use if (empty == NULL) to print a safe warning instead of dereferencing it.',
      'Compile with: gcc pointers.c -Wall -Wextra -o pointers',
      'Run the program and inspect every printed value.',
    ],
    goal: 'You successfully created a pointer, inspected memory addresses, dereferenced safely, modified a variable indirectly, and handled a NULL pointer without crashing.',
  },
  [
    q(
      'What does the & operator do in C?',
      [
        'It multiplies two values',
        'It returns the memory address of a variable',
        'It dereferences a pointer',
        'It frees memory',
      ],
      1,
      'The & operator returns the address of a variable. The other options describe unrelated pointer or memory operations.'
    ),
    q(
      'What does int *p; mean?',
      [
        'p is an integer variable',
        'p is a pointer that can store the address of an int',
        'p is a floating-point number',
        'p is a constant value',
      ],
      1,
      'The declaration int *p; creates a pointer variable named p that is intended to store the address of an int object.'
    ),
    q(
      'What does *p do when p points to a valid int?',
      [
        'It prints p',
        'It accesses the value stored at the address held by p',
        'It deletes p',
        'It allocates new memory',
      ],
      1,
      'The dereference operator * accesses the object located at the address stored in p. If p is invalid, dereferencing causes undefined behavior.'
    ),
    q(
      'What does NULL represent?',
      [
        'A pointer that points to address zero or no valid object',
        'A normal integer value of one',
        'A hidden string',
        'A compiler flag',
      ],
      0,
      'NULL represents a null pointer constant. It indicates that the pointer does not currently point to a valid object.'
    ),
    q(
      'Why is pointer type important?',
      [
        'It changes the color of terminal output',
        'It determines how pointer arithmetic and dereferencing interpret memory',
        'It prevents all bugs automatically',
        'It makes pointers run faster',
      ],
      1,
      'Pointer type tells the compiler how large the pointed-to object is and how to interpret the memory at that address. This affects arithmetic, dereferencing, and optimization.'
    ),
  ],
  [
    'A pointer stores a memory address.',
    'Use & to get the address of a variable.',
    'Use * to access the value at a pointer address.',
    'Initialize pointers to NULL when they do not point anywhere yet.',
    'Pointers enable indirect modification of caller data in functions.',
  ],
  'This lesson is best completed in your local terminal because pointer addresses and sizes depend on the real compiler and platform.'
),

L(
  'c-10',
  10,
  'Pointers & Arrays',
  '🔗',
  '🔗 Arrays and pointers are deeply connected in C. An array represents contiguous memory, and a pointer can walk through that memory using arithmetic. Understanding this relationship unlocks buffers, strings, dynamic data, and performance-sensitive C code.',
  [
    {
      title: '1. Array Name and Address Behavior',
      beginner:
        'In many expressions, the name of an array acts like a pointer to its first element. If you have int nums[5]; then nums can be used to access the first element address. This is why arrays and pointers often look similar.',
      advanced:
        'The array name is not a pointer variable. It is an array object that decays to a pointer to its first element in most expression contexts. The decay is a conversion rule, not an identity. sizeof and & on the array reveal the difference.',
    },
    {
      title: '2. Pointer Arithmetic',
      beginner:
        'Pointer arithmetic lets you move from one element to the next. If p points to the first element of an int array, p + 1 points to the next int, not the next byte. The compiler automatically scales the step by the size of the type.',
      advanced:
        'Pointer arithmetic is defined only within an array object or one past its end. Subtracting pointers from the same array yields a difference in element units. Arithmetic outside object bounds is undefined behavior.',
    },
    {
      title: '3. Array Indexing Is Pointer Arithmetic',
      beginner:
        'The expression nums[i] is a convenient way to access an array element. Under the hood, it means the element located i positions from the beginning of the array. This is why C arrays start at index zero.',
      advanced:
        'The subscript operator is defined in terms of pointer arithmetic. nums[i] is equivalent to *(nums + i). This relationship is foundational to understanding buffers, iterators, and low-level memory traversal.',
    },
    {
      title: '4. Arrays vs Pointers',
      beginner:
        'Arrays and pointers are related, but they are not the same thing. An array owns a fixed block of memory. A pointer is a variable that stores an address and can be reassigned to point somewhere else.',
      advanced:
        'An array object has storage for its elements. A pointer object has storage for an address. Assigning a pointer to an array name stores the decayed address. The pointer can change target; the array object remains fixed.',
    },
    {
      title: '5. Bounds and Pointer Safety',
      beginner:
        'C does not automatically check whether an array index is valid. If you move a pointer beyond the array, your program may read garbage, crash, or corrupt memory. You must respect the array bounds.',
      advanced:
        'Out-of-bounds pointer arithmetic and dereferencing are undefined behavior. Secure C code tracks length explicitly, uses size parameters, and avoids raw pointer loops unless the bounds are proven correct.',
    },
  ],
  {
    title: 'Pointer Array Traversal Lab',
    intro:
      'This practical explores array decay, pointer arithmetic, indexing equivalence, and safe traversal.',
    steps: [
      'Create a file named array_pointers.c.',
      'Add #include <stdio.h> at the top.',
      'Inside main, declare: int nums[5] = {10, 20, 30, 40, 50};',
      'Declare a pointer to the array: int *p = nums;',
      'Print the first element three ways: nums[0], *nums, and *p.',
      'Use a for loop from i = 0 to i < 5 and print nums[i].',
      'Use another for loop and print *(nums + i).',
      'Use another for loop and print p[i].',
      'Move the pointer: p = &nums[4];',
      'Print *p to confirm it is 50.',
      'Move the pointer backward: p--;',
      'Print *p to confirm it is 40.',
      'Compile with: gcc array_pointers.c -Wall -Wextra -o array_pointers',
      'Run the program and verify that all traversal methods produce the same values.',
    ],
    goal: 'You successfully connected array indexing and pointer arithmetic, traversed an array using multiple techniques, and observed how pointers move through contiguous memory.',
  },
  [
    q(
      'What does nums[i] usually mean at a lower level?',
      [
        'It calls a function named nums',
        'It accesses the element i positions from the start of nums',
        'It creates a new array',
        'It deletes element i',
      ],
      1,
      'Array indexing is equivalent to pointer arithmetic. nums[i] means the element located i positions from the beginning of the array.'
    ),
    q(
      'If p points to an int array element, what does p + 1 point to?',
      [
        'The next byte in memory',
        'The next int element in the array',
        'The end of the program',
        'A random address always',
      ],
      1,
      'Pointer arithmetic scales by the size of the pointed-to type. If p points to an int, p + 1 points to the next int object.'
    ),
    q(
      'What is the relationship between nums and &nums[0]?',
      [
        'They are never related',
        'In most expressions, nums decays to the address of its first element',
        'nums is always larger than &nums[0]',
        '&nums[0] is invalid C',
      ],
      1,
      'In most expression contexts, an array name decays to a pointer to its first element. This is why nums and &nums[0] often behave similarly.'
    ),
    q(
      'What is a major danger when using pointer arithmetic on arrays?',
      [
        'It can move outside valid bounds and cause undefined behavior',
        'It makes arrays immutable',
        'It automatically deletes the array',
        'It prevents compilation',
      ],
      0,
      'Pointer arithmetic outside valid array bounds is undefined behavior. It can crash the program, expose invalid memory, or corrupt data.'
    ),
    q(
      'What is the difference between an array and a pointer?',
      [
        'An array owns contiguous element storage; a pointer stores an address',
        'A pointer owns memory and an array cannot exist',
        'They are exactly identical in every context',
        'Arrays cannot be used in C',
      ],
      0,
      'An array object stores elements directly. A pointer object stores an address. Arrays can decay to pointers, but they are not the same type or concept.'
    ),
  ],
  [
    'Arrays are contiguous blocks of typed memory.',
    'Array indexing is implemented using pointer arithmetic.',
    'Pointer arithmetic scales by the size of the pointed-to type.',
    'A pointer can be reassigned; an array object is fixed.',
    'Always respect array bounds when using pointers.',
  ],
  'You can use the browser C lab for small examples, but local GCC or Clang is recommended for pointer and memory experiments.'
),

L(
  'c-11',
  11,
  'Structures',
  '🧱',
  '🧱 Structures allow C to model real-world data by grouping related values into one named type. They are the foundation of records, objects, system structs, network packets, and low-level data modeling. Mastering structs is essential before moving into advanced memory and systems programming.',
  [
    {
      title: '1. Defining and Using Structures',
      beginner:
        'A structure groups variables under one name. For example, a Student struct can contain an id, a score, and a name. You access each member using the dot operator, like student.id.',
      advanced:
        'A struct defines a composite type with a layout determined by the compiler. Member order, alignment, and padding affect the final size and binary representation. Struct layout matters in systems programming, file formats, and network protocols.',
    },
    {
      title: '2. Initializing Structures',
      beginner:
        'You can initialize a struct when you create it. For example, struct Student s1 = {1, 95, "Alice"}; assigns values in the order the members are declared. You can also set members one by one after creation.',
      advanced:
        'C supports positional initialization, designated initializers, and partial initialization. Partial initialization zero-initializes remaining members, which is useful for creating clean default structures.',
    },
    {
      title: '3. Structs in Memory',
      beginner:
        'A struct stores its members together in memory. The total size is not always just the sum of member sizes because the compiler may add padding for alignment.',
      advanced:
        'The compiler inserts padding to satisfy alignment requirements of each member and the struct itself. The ABI and target platform influence layout. Packing directives can change layout but may hurt performance or portability.',
    },
    {
      title: '4. Arrays of Structures',
      beginner:
        'You can create an array of structs to store multiple records. For example, an array of Student records lets you loop through each student and print or update their data.',
      advanced:
        'Arrays of structs provide contiguous record storage and cache-friendly iteration. For performance-critical work, developers sometimes reorganize data into structure-of-arrays layouts to improve vectorization and memory access patterns.',
    },
    {
      title: '5. Passing Structs to Functions',
      beginner:
        'You can pass a struct to a function. By default, the function receives a copy. If the struct is large or needs to be modified, you can pass a pointer to the struct instead.',
      advanced:
        'Passing by pointer avoids copying and allows mutation. The arrow operator, ->, accesses members through a pointer. Const pointers communicate read-only intent and help prevent accidental modification.',
    },
  ],
  {
    title: 'Student Record Lab',
    intro:
      'This practical builds a simple record system using structs, arrays of structs, and pointer access.',
    steps: [
      'Create a file named structs.c.',
      'Add #include <stdio.h> at the top.',
      'Define a structure: struct Student { int id; int score; char name[32]; };',
      'Inside main, create: struct Student s1 = {1, 95, "Alice"};',
      'Print s1 members using printf("%d %s %d\\n", s1.id, s1.name, s1.score);',
      'Create an array: struct Student class[2];',
      'Assign values to class[0] and class[1] using the dot operator.',
      'Use a for loop to print every student in the array.',
      'Create a pointer: struct Student *ptr = &s1;',
      'Update the score through the pointer: ptr->score = 100;',
      'Print s1.score again and confirm it changed.',
      'Compile with: gcc structs.c -Wall -Wextra -o structs',
      'Run the program and verify record creation, iteration, and pointer mutation.',
    ],
    goal: 'You successfully defined a struct, initialized records, stored them in an array, iterated through them, and modified a struct through a pointer.',
  },
  [
    q(
      'What does a struct allow you to do?',
      [
        'Group related variables into one named type',
        'Only store numbers',
        'Replace the compiler',
        'Avoid writing functions',
      ],
      0,
      'A struct groups related values into one composite type. This is essential for modeling records, packets, configuration objects, and system data.'
    ),
    q(
      'Which operator accesses a struct member directly from a struct variable?',
      [
        '->',
        '.',
        '*',
        '&',
      ],
      1,
      'The dot operator accesses members of a struct variable. The arrow operator is used when accessing members through a pointer to a struct.'
    ),
    q(
      'What does ptr->score mean?',
      [
        'It accesses the score member through a pointer named ptr',
        'It creates a new pointer',
        'It deletes the score member',
        'It compares ptr and score',
      ],
      0,
      'The arrow operator dereferences a struct pointer and accesses a member. ptr->score is equivalent to (*ptr).score.'
    ),
    q(
      'Why might sizeof(struct Student) be larger than the sum of its visible member sizes?',
      [
        'Because the compiler may add padding for alignment',
        'Because C adds random data',
        'Because structs are always corrupted',
        'Because the terminal is slow',
      ],
      0,
      'Compilers insert padding to satisfy alignment requirements. This can make the total struct size larger than the simple sum of member sizes.'
    ),
    q(
      'Why pass a large struct to a function using a pointer?',
      [
        'To avoid copying the whole struct and allow modification if needed',
        'To make the function run slower',
        'To delete the struct automatically',
        'To convert it into a string',
      ],
      0,
      'Passing a pointer avoids copying large objects and allows the function to modify the original struct. Use const pointers when modification is not intended.'
    ),
  ],
  [
    'Structs group related data into one type.',
    'Use the dot operator to access struct members.',
    'Use the arrow operator to access members through a pointer.',
    'Struct size can include padding.',
    'Arrays of structs are useful for record collections.',
  ],
  'You can use the browser C lab for small struct examples, but local GCC or Clang is recommended for inspecting real struct sizes and warnings.'
),

L(
  'c-12',
  12,
  'Unions & Bit Fields',
  '🧩',
  '🧩 Unions and bit fields reveal how C exposes raw memory layout. A union allows different types to share the same storage. Bit fields allow you to pack flags into individual bits. These tools are powerful in embedded systems, hardware registers, protocol parsing, and low-level optimization.',
  [
    {
      title: '1. Union Basics',
      beginner:
        'A union looks similar to a struct, but all members share the same memory space. If a union contains an int and a float, both use the same storage. Only one member should be considered active at a time.',
      advanced:
        'A union occupies enough storage to hold its largest member, subject to alignment. Writing one member and reading another can produce implementation-defined or undefined behavior depending on the types and access pattern. Type-punning through unions must be used carefully.',
    },
    {
      title: '2. Union Use Cases',
      beginner:
        'Unions are useful when a value can be interpreted in different ways. For example, one field can store an integer, while another field stores the raw bytes of that integer.',
      advanced:
        'Unions are common in interpreters, tagged values, hardware registers, serialization buffers, and variant types. They are also used in systems code where one storage region must represent multiple formats depending on runtime state.',
    },
    {
      title: '3. Bit Fields',
      beginner:
        'Bit fields allow you to specify that a struct member uses a certain number of bits. For example, unsigned int readable : 1; creates a one-bit flag. This is useful for storing many true/false values compactly.',
      advanced:
        'Bit-field layout is implementation-defined in several important ways, including ordering and packing. Bit fields are useful for hardware registers and compact flags, but they are not always portable across compilers or architectures.',
    },
    {
      title: '4. Endianness Awareness',
      beginner:
        'Computers store multi-byte values in different byte orders. Some systems store the most significant byte first, while others store the least significant byte first. This affects how raw bytes represent numbers.',
      advanced:
        'Endianness matters when inspecting union bytes, writing binary files, implementing network protocols, or communicating between architectures. Network byte order is big-endian, and portable code must convert explicitly.',
    },
    {
      title: '5. Safety and Type Discipline',
      beginner:
        'Because unions and bit fields operate close to memory, mistakes can be subtle. Always know which member is active and avoid reading meaningless data.',
      advanced:
        'Professional C code often wraps unions in tagged structures, where an enum indicates the active member. This creates a disciplined variant type and prevents invalid member access patterns.',
    },
  ],
  {
    title: 'Union Bytes & Bit Flags Lab',
    intro:
      'This practical explores shared storage, raw byte inspection, and compact bit-field flags.',
    steps: [
      'Create a file named unions.c.',
      'Add #include <stdio.h> at the top.',
      'Define a union: union IntBytes { int value; unsigned char bytes[4]; };',
      'Inside main, create: union IntBytes data;',
      'Assign data.value = 65;',
      'Use a for loop to print data.bytes[0] through data.bytes[3] with %u.',
      'Observe that the byte order depends on your platform.',
      'Define a bit-field struct: struct Flags { unsigned int readable : 1; unsigned int writable : 1; unsigned int executable : 1; };',
      'Create struct Flags flags;',
      'Assign flags.readable = 1; flags.writable = 0; flags.executable = 1;',
      'Print each flag value.',
      'Print sizeof(flags) to observe how compact the bit fields are.',
      'Compile with: gcc unions.c -Wall -Wextra -o unions',
      'Run the program and analyze the output.',
    ],
    goal: 'You successfully used a union to inspect raw bytes, observed platform byte layout, and created compact bit-field flags.',
  },
  [
    q(
      'What is the key difference between a struct and a union?',
      [
        'A struct gives each member its own storage; a union shares storage among members',
        'A union is faster in every case',
        'A struct cannot contain integers',
        'A union is only used for strings',
      ],
      0,
      'A struct stores members in separate locations, while a union stores members in overlapping storage. Only one union member should be treated as active at a time.'
    ),
    q(
      'What does unsigned int readable : 1; mean?',
      [
        'readable is a one-bit bit field',
        'readable is one byte',
        'readable is one array element',
        'readable is one function',
      ],
      0,
      'The : 1 syntax creates a bit field that occupies one bit. This is useful for compact boolean flags.'
    ),
    q(
      'Why can reading union bytes produce different results on different machines?',
      [
        'Because byte order and representation can vary by architecture',
        'Because unions are always broken',
        'Because C changes variables randomly',
        'Because compilers delete bytes',
      ],
      0,
      'Byte order, alignment, and representation can differ across platforms. This is why raw memory inspection requires portability awareness.'
    ),
    q(
      'What is a safe pattern for using unions in larger C programs?',
      [
        'Use a tag or enum to track which union member is active',
        'Read all members at the same time',
        'Avoid initializing unions',
        'Use unions instead of arrays for all data',
      ],
      0,
      'Tagged unions use an explicit discriminator to track the active member. This prevents invalid reads and makes the data model easier to reason about.'
    ),
    q(
      'When are bit fields especially useful?',
      [
        'For compact flags and hardware register layouts',
        'For replacing all arrays',
        'For avoiding compilation',
        'For making code run without memory',
      ],
      0,
      'Bit fields are useful when storage is tight or when modeling hardware registers and protocol flags. Portability must be considered.'
    ),
  ],
  [
    'Unions share one storage region among multiple members.',
    'Only one union member should be active at a time.',
    'Bit fields pack small integer values into bits.',
    'Endianness affects raw byte interpretation.',
    'Use tagged unions for safer variant-style data.',
  ],
  'This lesson is best completed in your local terminal because union layout, padding, and endianness are platform-specific.'
),

L(
  'c-13',
  13,
  'Enum, Typedef & Type Design',
  '🏷️',
  '🏷️ C gives you powerful tools for designing clean types. Enums create named constant sets. Typedef creates readable aliases. Together, they transform raw integers and structs into meaningful domain types. Good type design makes C code safer, clearer, and more maintainable.',
  [
    {
      title: '1. Enum Basics',
      beginner:
        'An enum is a set of named integer constants. For example, enum Mode { MODE_OFF, MODE_ON }; gives names to states instead of using magic numbers like 0 and 1.',
      advanced:
        'Enumerators are compile-time integer constants. The underlying enum type is implementation-defined but compatible with an integer type. Enums improve readability and enable switch-based state handling.',
    },
    {
      title: '2. Enums for State Machines',
      beginner:
        'Enums are perfect for representing states, such as OFF, ON, ERROR, or PENDING. You can use a switch statement to respond differently based on the current state.',
      advanced:
        'State machines in C often combine an enum state value with transition functions. Explicit states make invalid transitions easier to detect and debug.',
    },
    {
      title: '3. Typedef Aliases',
      beginner:
        'Typedef creates a new name for an existing type. For example, typedef int Score; lets you write Score instead of int. This can make code more expressive.',
      advanced:
        'Typedef does not create a distinct strong type. It creates an alias. However, it improves abstraction, simplifies complex declarations, and helps centralize type changes.',
    },
    {
      title: '4. Typedef with Structs and Pointers',
      beginner:
        'Typedef can make struct usage cleaner. Instead of writing struct Point everywhere, you can typedef struct Point Point; or define the struct and typedef together.',
      advanced:
        'Typedef is common in C APIs for opaque types, callback signatures, and pointer types. It can hide implementation details and create cleaner public interfaces.',
    },
    {
      title: '5. Designing Meaningful Types',
      beginner:
        'Instead of passing raw integers everywhere, think about what the value means. A state, a score, a direction, or a status can each become a named type. This reduces confusion.',
      advanced:
        'Professional C code uses enums for finite states, typedefs for abstraction, and structs for grouped data. Strong naming discipline compensates for C lacking modern strong type features.',
    },
  ],
  {
    title: 'Type Design Lab',
    intro:
      'This practical creates clean type aliases, enum states, and a small type-driven state machine.',
    steps: [
      'Create a file named types_design.c.',
      'Add #include <stdio.h> at the top.',
      'Define an enum: typedef enum { STATE_OFF, STATE_ON, STATE_ERROR } MachineState;',
      'Define a struct: typedef struct { MachineState state; int code; } Machine;',
      'Inside main, create: Machine machine = { STATE_OFF, 0 };',
      'Write a function named state_name that takes MachineState and returns a const char * string for each state using switch.',
      'Print the current state using state_name(machine.state).',
      'Change machine.state = STATE_ON;',
      'Print the state again.',
      'Change machine.state = STATE_ERROR and set machine.code = 42;',
      'Print the state and error code.',
      'Compile with: gcc types_design.c -Wall -Wextra -o types_design',
      'Run the program and verify state transitions.',
    ],
    goal: 'You successfully used enums, typedef, and structs to build a small typed state model.',
  },
  [
    q(
      'What is an enum used for?',
      [
        'To define named integer constants',
        'To allocate dynamic memory',
        'To open files',
        'To create loops',
      ],
      0,
      'An enum defines named integer constants. It improves readability and helps represent states, modes, and options.'
    ),
    q(
      'What does typedef do?',
      [
        'It creates an alias name for an existing type',
        'It deletes a type',
        'It makes a variable global',
        'It compiles faster',
      ],
      0,
      'Typedef creates a new name for a type. It does not create a separate strong type, but it improves code readability and abstraction.'
    ),
    q(
      'Why are enums useful in switch statements?',
      [
        'They make state handling explicit and readable',
        'They prevent the program from running',
        'They replace all functions',
        'They automatically fix bugs',
      ],
      0,
      'Enums provide named cases for switch logic. This makes state machines and option handling easier to read and maintain.'
    ),
    q(
      'What is a benefit of typedef with structs?',
      [
        'It reduces repetitive struct keyword usage and improves clarity',
        'It changes the struct size',
        'It removes padding',
        'It makes structs immutable',
      ],
      0,
      'Typedef simplifies struct declarations and can make APIs cleaner. It does not change memory layout or mutability.'
    ),
    q(
      'What is good type design in C?',
      [
        'Using meaningful named types instead of raw magic numbers',
        'Using only int for everything',
        'Avoiding enums completely',
        'Never naming types',
      ],
      0,
      'Meaningful types improve clarity and reduce mistakes. Enums, typedefs, and structs help express domain intent even though C is not strongly typed in the modern sense.'
    ),
  ],
  [
    'Enums define named constant sets.',
    'Typedef creates readable type aliases.',
    'Enums improve switch-based state handling.',
    'Typedef can simplify struct and pointer declarations.',
    'Good type design reduces magic numbers and improves maintainability.',
  ],
  'You can use the browser C lab for small examples, but local GCC or Clang is recommended for full warning output.'
),

L(
  'c-14',
  14,
  'Memory Layout: Stack, Heap, Data',
  '🧠',
  '🧠 Every C program runs inside a structured memory map. Local variables live on the stack. Dynamic memory lives on the heap. Global and static data live in separate data regions. Understanding this layout is the key to understanding lifetimes, crashes, leaks, and performance.',
  [
    {
      title: '1. Process Memory Regions',
      beginner:
        'A running C program is not just code. It has several memory regions. The code region stores instructions. The stack stores local variables. The heap stores dynamically allocated memory. Data regions store global and static variables.',
      advanced:
        'A typical process layout includes text, read-only data, initialized data, uninitialized data (BSS), heap, and stack. The exact layout depends on the operating system, ABI, and compiler, but the conceptual regions remain essential.',
    },
    {
      title: '2. The Stack',
      beginner:
        'Local variables created inside functions usually live on the stack. When a function is called, a stack frame is created. When the function returns, that frame is destroyed.',
      advanced:
        'Stack allocation is fast because it usually only moves the stack pointer. Stack objects have automatic storage duration. Deep recursion or large local arrays can cause stack overflow.',
    },
    {
      title: '3. The Heap',
      beginner:
        'The heap is used for memory that you request manually with functions like malloc. Heap memory stays available until you free it. This gives you control, but also responsibility.',
      advanced:
        'Heap allocation involves an allocator, free lists, alignment, and possible fragmentation. Heap lifetimes are manual, which enables flexible data structures but introduces leaks and dangling pointer risks.',
    },
    {
      title: '4. Global and Static Storage',
      beginner:
        'Global variables exist for the entire program. Static variables inside functions also keep their value between calls. They do not disappear when the function returns.',
      advanced:
        'Global and static objects have static storage duration. Initialized globals usually live in data segments, while zero-initialized globals live in BSS. Overusing globals increases coupling and makes testing harder.',
    },
    {
      title: '5. Lifetimes and Ownership',
      beginner:
        'Every value has a lifetime. Local variables die when their function ends. Heap values live until freed. Global values live until the program exits. You must know which lifetime you are using.',
      advanced:
        'Ownership discipline is central to safe C. A pointer must have a clear owner responsible for freeing it. Mixing stack, heap, and static lifetimes incorrectly causes dangling pointers, leaks, and undefined behavior.',
    },
  ],
  {
    title: 'Memory Region Inspection Lab',
    intro:
      'This practical prints addresses from different memory regions to build intuition about stack, heap, global, static, and read-only storage.',
    steps: [
      'Create a file named memory_layout.c.',
      'Add #include <stdio.h> and #include <stdlib.h> at the top.',
      'Above main, declare: int global_value = 10;',
      'Above main, declare: static int static_value = 20;',
      'Inside main, declare: int local_value = 30;',
      'Declare a string literal pointer: const char *message = "read-only";',
      'Allocate heap memory: int *heap_value = malloc(sizeof(int));',
      'Check if heap_value == NULL and return 1 if allocation failed.',
      'Assign *heap_value = 40;',
      'Print the address of global_value using %p and a (void *) cast.',
      'Print the address of static_value using %p and a (void *) cast.',
      'Print the address of local_value using %p and a (void *) cast.',
      'Print the address of message using %p and a (void *) cast.',
      'Print the address of heap_value itself and the address stored in heap_value.',
      'Free heap memory: free(heap_value);',
      'Set heap_value = NULL;',
      'Compile with: gcc memory_layout.c -Wall -Wextra -o memory_layout',
      'Run the program and compare the printed addresses.',
    ],
    goal: 'You successfully inspected global, static, local, string, and heap addresses, building a practical mental model of C memory layout.',
  },
  [
    q(
      'Where do local function variables usually live?',
      [
        'On the stack',
        'In the database',
        'In the browser cache',
        'In the keyboard buffer',
      ],
      0,
      'Local automatic variables usually live on the stack. Their lifetime ends when the function returns.'
    ),
    q(
      'Where does malloc allocate memory?',
      [
        'On the heap',
        'On the stack',
        'In read-only instruction memory',
        'In the compiler settings',
      ],
      0,
      'malloc allocates memory from the heap. The programmer is responsible for freeing that memory later.'
    ),
    q(
      'What happens to a normal local variable when its function returns?',
      [
        'Its storage lifetime ends',
        'It becomes global',
        'It is automatically saved to disk',
        'It becomes heap memory',
      ],
      0,
      'Automatic local variables end when the function returns. Returning a pointer to such storage is dangerous and invalid.'
    ),
    q(
      'What is a major risk of heap memory?',
      [
        'Memory leaks and dangling pointers if free is mismanaged',
        'It cannot store integers',
        'It is always slower than global variables',
        'It cannot be used with structs',
      ],
      0,
      'Heap memory gives flexibility but requires manual management. Forgetting free causes leaks, and using freed memory causes dangling pointer bugs.'
    ),
    q(
      'What is true about global variables?',
      [
        'They exist for the lifetime of the program',
        'They disappear after each function call',
        'They must always be allocated with malloc',
        'They cannot be integers',
      ],
      0,
      'Global variables have static storage duration and exist until program termination. They are useful but can increase coupling.'
    ),
  ],
  [
    'A C program uses multiple memory regions.',
    'Stack memory is automatic and fast.',
    'Heap memory is manual and flexible.',
    'Global and static variables live for the whole program.',
    'Always understand the lifetime of every pointer you use.',
  ],
  'This lesson is best completed in your local terminal because memory layout behavior depends on the real compiler, linker, and operating system.'
),

L(
  'c-15',
  15,
  'Dynamic Memory Allocation',
  '💾',
  '💾 Dynamic memory allocation is where C becomes truly powerful and truly dangerous. With malloc, calloc, realloc, and free, you can build data structures whose size is decided at runtime. But every allocation creates responsibility. Mastering dynamic memory is essential for professional C engineering.',
  [
    {
      title: '1. malloc and Allocation Basics',
      beginner:
        'malloc requests a block of memory at runtime. You tell it how many bytes you need, and it returns a pointer. If allocation fails, it returns NULL. Always check the result.',
      advanced:
        'malloc returns a pointer suitably aligned for any object type with the requested size. It does not initialize memory. Allocation failure must be handled explicitly in robust systems code.',
    },
    {
      title: '2. calloc and Zero Initialization',
      beginner:
        'calloc allocates memory and initializes it to zero. It takes a count and a size. For example, calloc(10, sizeof(int)) allocates space for ten integers and clears them.',
      advanced:
        'calloc can protect against uninitialized memory bugs, but it may cost more than malloc because the allocator must zero the memory. It also helps prevent some information leakage bugs.',
    },
    {
      title: '3. realloc and Resizing',
      beginner:
        'realloc changes the size of an existing allocated block. It can grow or shrink memory. If successful, it returns a pointer to the new block, which may be at a different address.',
      advanced:
        'realloc may move the allocation to a new region. Safe code assigns the result to a temporary pointer, checks for NULL, and then updates the original pointer. This prevents leaks when realloc fails.',
    },
    {
      title: '4. free and Ownership',
      beginner:
        'When you are done with heap memory, you must release it using free. If you forget, your program wastes memory. If you free the same pointer twice, your program may crash.',
      advanced:
        'free returns memory to the allocator. The pointer value remains, but the object is gone. Accessing freed memory is undefined behavior. Setting the pointer to NULL after free helps prevent accidental reuse.',
    },
    {
      title: '5. Leaks, Dangling Pointers, and Discipline',
      beginner:
        'A memory leak happens when allocated memory is no longer reachable and cannot be freed. A dangling pointer happens when you keep using memory after freeing it. Both are serious bugs.',
      advanced:
        'Professional C code uses ownership rules, cleanup functions, goto-based error handling when appropriate, and sanitizers or Valgrind to detect leaks and invalid accesses.',
    },
  ],
  {
    title: 'Dynamic Array Lab',
    intro:
      'This practical builds a dynamic integer array using malloc, realloc, and free while practicing safe ownership habits.',
    steps: [
      'Create a file named dynamic.c.',
      'Add #include <stdio.h> and #include <stdlib.h> at the top.',
      'Inside main, allocate: int *values = malloc(5 * sizeof(int));',
      'Check if values == NULL and return 1 if allocation failed.',
      'Use a for loop to assign values[i] = i * 10.',
      'Use another for loop to print all five values.',
      'Resize the array: int *temp = realloc(values, 10 * sizeof(int));',
      'Check if temp == NULL. If it is NULL, free(values) and return 1.',
      'Assign values = temp;',
      'Initialize the new elements from index 5 to 9.',
      'Print all ten values.',
      'Free the memory: free(values);',
      'Set values = NULL;',
      'Compile with: gcc dynamic.c -Wall -Wextra -o dynamic',
      'Run the program and verify allocation, resizing, and cleanup.',
    ],
    goal: 'You successfully allocated dynamic memory, resized it safely, handled failure cases, and freed memory without leaking it.',
  },
  [
    q(
      'What does malloc return?',
      [
        'A pointer to allocated memory, or NULL if allocation fails',
        'A guaranteed zeroed array',
        'A file descriptor',
        'A compiler flag',
      ],
      0,
      'malloc returns a pointer to uninitialized heap memory, or NULL if the allocation fails. Always check the result before using it.'
    ),
    q(
      'What is the difference between malloc and calloc?',
      [
        'calloc initializes memory to zero, while malloc does not',
        'malloc is safer in every case',
        'calloc cannot allocate arrays',
        'malloc frees memory automatically',
      ],
      0,
      'calloc allocates and zero-initializes memory. malloc allocates without initialization. Both require manual freeing.'
    ),
    q(
      'Why should realloc result be assigned to a temporary pointer first?',
      [
        'Because if realloc fails, the original pointer remains valid and can be freed',
        'Because realloc deletes the old pointer automatically',
        'Because C requires it by law',
        'Because temp variables make code slower',
      ],
      0,
      'If realloc fails, it returns NULL but leaves the original block allocated. Assigning directly to the original pointer can leak the old memory.'
    ),
    q(
      'What is a memory leak?',
      [
        'Allocated memory that is no longer reachable and cannot be freed',
        'A file that is too large',
        'A syntax error',
        'A terminal bug',
      ],
      0,
      'A memory leak occurs when heap memory remains allocated but the program no longer has a valid way to free it.'
    ),
    q(
      'What should you do after freeing a pointer that may be used again accidentally?',
      [
        'Set it to NULL',
        'Delete the variable name',
        'Restart the compiler',
        'Convert it to a string',
      ],
      0,
      'Setting a freed pointer to NULL helps prevent accidental reuse. Dereferencing a freed pointer is undefined behavior.'
    ),
  ],
  [
    'malloc allocates uninitialized heap memory.',
    'calloc allocates and zero-initializes memory.',
    'realloc resizes allocations but may move them.',
    'free releases heap memory manually.',
    'Ownership discipline prevents leaks and dangling pointers.',
  ],
  'This lesson requires a real local C environment because dynamic memory behavior, diagnostics, and sanitizers are best verified with GCC or Clang.'
),

L(
  'c-16',
  16,
  'printf, scanf & I/O Formatting',
  '📺',
  '📺 Input and output are how your program communicates with humans and machines. C gives you precise formatting control through printf and scanf, but that precision requires discipline. Mastering format specifiers, return checks, and safe input handling is essential for reliable C programs.',
  [
    {
      title: '1. Format Specifiers',
      beginner:
        'printf uses format specifiers to print values. %d prints integers, %f prints floating-point numbers, %c prints characters, %s prints strings, and %p prints pointers. The specifier must match the value type.',
      advanced:
        'Mismatched format specifiers cause undefined behavior. Variadic functions like printf do not automatically verify argument types at compile time in all cases. Compiler warnings can detect many mismatches, but not all.',
    },
    {
      title: '2. Width, Precision, and Alignment',
      beginner:
        'You can control how values appear. For example, %5d prints an integer in a field at least five characters wide. %.2f prints a floating-point value with two digits after the decimal point.',
      advanced:
        'Format control is important for reports, logs, tables, and user interfaces. Flags such as -, +, 0, and space modify alignment, sign display, and padding behavior.',
    },
    {
      title: '3. scanf Input Rules',
      beginner:
        'scanf reads formatted input. For most types, you must pass the address of the variable using &. For example, scanf("%d", &age); reads an integer into age.',
      advanced:
        'scanf returns the number of successful conversions. Professional code checks this return value. Field width limits, such as %31s, help prevent buffer overflow. Whitespace handling rules can surprise beginners.',
    },
    {
      title: '4. Input Buffers and Newlines',
      beginner:
        'When you type input and press Enter, a newline character remains in the input stream. This can affect later input calls, especially when reading characters or mixing scanf with other input functions.',
      advanced:
        'C I/O is buffered. Mixing formatted input, character input, and line input requires understanding buffer state. Consuming or discarding unwanted newlines is often necessary.',
    },
    {
      title: '5. Safer Input with fgets and sscanf',
      beginner:
        'For strings and user input, fgets is usually safer than scanf because you specify the buffer size. You can read a full line and then parse it with sscanf if needed.',
      advanced:
        'A robust input pattern uses fgets for line acquisition and sscanf or strtol for parsing. This separates buffer safety from format parsing and gives better control over invalid input.',
    },
  ],
  {
    title: 'Formatted Input & Output Lab',
    intro:
      'This practical builds a formatted data entry and display program using printf, scanf, field widths, and safer input patterns.',
    steps: [
      'Create a file named io_format.c.',
      'Add #include <stdio.h> at the top.',
      'Inside main, declare: int age; float height; char name[32];',
      'Print a prompt: printf("Enter age height name: ");',
      'Read input safely: scanf("%d %f %31s", &age, &height, name);',
      'Check the return value: if it is not 3, print Invalid input and return 1.',
      'Print a formatted table header: printf("%-12s | %5s | %8s\\n", "Name", "Age", "Height");',
      'Print the user data: printf("%-12s | %5d | %8.2f\\n", name, age, height);',
      'Create a line buffer: char line[64];',
      'Print: printf("Enter a favorite number: ");',
      'Use fgets(line, sizeof(line), stdin); to read a line.',
      'Parse it: int favorite; sscanf(line, "%d", &favorite);',
      'Print the parsed number.',
      'Compile with: gcc io_format.c -Wall -Wextra -o io_format',
      'Run the program with valid input, then run it again with invalid input to test error handling.',
    ],
    goal: 'You successfully used format specifiers, checked scanf results, limited string input width, and used fgets with sscanf for safer line-based input.',
  },
  [
    q(
      'Which format specifier is commonly used to print an int?',
      [
        '%f',
        '%d',
        '%p',
        '%s',
      ],
      1,
      'The %d specifier is used for signed decimal integers. The other specifiers are for floating-point values, pointers, and strings.'
    ),
    q(
      'Why does scanf usually need & before a variable?',
      [
        'Because scanf needs the address where it should store the input',
        'Because & makes the variable global',
        'Because & deletes the variable',
        'Because scanf cannot read numbers',
      ],
      0,
      'scanf writes input into variables, so it needs their addresses. Passing the value instead of the address is a common and dangerous mistake.'
    ),
    q(
      'What does scanf return?',
      [
        'The number of successful input conversions',
        'The total number of characters in the file',
        'The ASCII value of the Enter key',
        'A random number',
      ],
      0,
      'scanf returns the number of successfully matched and assigned input items. Checking this value is essential for robust input handling.'
    ),
    q(
      'Why is %31s safer than %s when reading into char name[32]?',
      [
        'It limits the number of characters written, leaving space for the null terminator',
        'It encrypts the string',
        'It removes spaces automatically',
        'It converts the string to uppercase',
      ],
      0,
      'A field width prevents buffer overflow by limiting how many characters are stored. One space remains for the null terminator in a 32-byte buffer.'
    ),
    q(
      'Why is fgets often safer than scanf for reading user text?',
      [
        'Because fgets lets you specify the buffer size and reads a full line',
        'Because fgets is faster in every case',
        'Because fgets does not use memory',
        'Because fgets skips all validation',
      ],
      0,
      'fgets reads at most one less than the specified size and preserves buffer safety. It is a better default for line-based user input.'
    ),
  ],
  [
    'Match printf format specifiers exactly to argument types.',
    'Use width and precision to control output layout.',
    'Check scanf return values for successful conversions.',
    'Limit string input width to prevent buffer overflow.',
    'Prefer fgets and sscanf for safer line-based input.',
  ],
  'You can use the browser C lab for small examples, but local terminal execution is recommended for input-focused practicals.'
),
  // C Free Track — Part 3: c-17 to c-25

L(
  'c-17',
  17,
  'File I/O',
  '📂',
  '📂 Programs become truly useful when they can remember data after execution ends. File I/O connects your C program to the operating system file layer. You will learn streams, file handles, read and write modes, binary data, and disciplined resource cleanup.',
  [
    {
      title: '1. FILE Streams and File Handles',
      beginner:
        'C does not directly touch files with raw variables. It uses a FILE stream as an interface between your program and the operating system. When you open a file, you receive a FILE pointer that represents the active connection.',
      advanced:
        'A FILE object is an abstraction over a file descriptor and buffered I/O state. The C standard library manages buffering, position tracking, error state, and flush behavior. Understanding streams is essential because text mode, binary mode, buffering, and EOF behavior differ across platforms.',
    },
    {
      title: '2. Opening Modes',
      beginner:
        'You open files using fopen with a mode string. The mode "r" opens for reading, "w" opens for writing and erases existing content, and "a" opens for appending to the end without deleting old data.',
      advanced:
        'Modes such as "rb", "wb", and "ab" open binary streams. Text mode may transform newline representations on some systems, while binary mode preserves raw bytes exactly. Choosing the correct mode is critical for cross-platform correctness.',
    },
    {
      title: '3. Text Reading and Writing',
      beginner:
        'You can write formatted text to files using fprintf, and read text using fscanf or fgets. fgets is especially useful because it reads a line safely into a buffer with a size limit.',
      advanced:
        'Text I/O functions operate on streams and respect buffering. fscanf can fail silently if input does not match the format. Robust C code checks return values and prefers bounded line-based reading functions over unbounded scans.',
    },
    {
      title: '4. Binary I/O with fread and fwrite',
      beginner:
        'Binary I/O lets you save raw memory directly to a file. fwrite writes bytes from memory to a file, and fread reads bytes from a file back into memory. This is useful for saving arrays, structs, or compact data records.',
      advanced:
        'Binary file formats require attention to type size, alignment, padding, and endianness. Writing a struct directly may include padding bytes and platform-specific layout. Portable binary formats often serialize fields explicitly.',
    },
    {
      title: '5. Error Checking and fclose',
      beginner:
        'Always check whether fopen returns NULL. If a file cannot be opened, your program should handle the failure instead of crashing. When finished, close the file with fclose so the system can release the resource.',
      advanced:
        'Failing to close files can leak file descriptors and lose buffered output. feof and ferror help distinguish end-of-file from I/O failure. Professional C code uses deterministic cleanup patterns, especially when multiple resources are open.',
    },
  ],
  {
    title: 'Persistent Log & Binary Storage Lab',
    intro:
      'This practical writes text logs, appends data, reads lines back, and stores raw binary data using fwrite and fread.',
    steps: [
      'Create a file named file_io.c.',
      'Add #include <stdio.h> and #include <stdlib.h> at the top.',
      'Inside main, open a text file for writing: FILE *file = fopen("log.txt", "w");',
      'Check if file == NULL. If it is NULL, print an error and return 1.',
      'Write a line: fprintf(file, "System started\\n");',
      'Close the file: fclose(file);',
      'Reopen the same file in append mode: FILE *append_file = fopen("log.txt", "a");',
      'Append another line: fprintf(append_file, "Task completed\\n");',
      'Close the append file.',
      'Open the file in read mode: FILE *read_file = fopen("log.txt", "r");',
      'Read line by line using: char line[128]; while (fgets(line, sizeof(line), read_file)) { printf("%s", line); }',
      'Close the read file.',
      'Create an int array: int values[3] = {10, 20, 30};',
      'Open a binary file: FILE *bin = fopen("data.bin", "wb");',
      'Write the array: fwrite(values, sizeof(int), 3, bin);',
      'Close the binary file.',
      'Read it back into int copy[3]; using fopen("data.bin", "rb") and fread(copy, sizeof(int), 3, bin);',
      'Print the copied values.',
      'Compile with: gcc file_io.c -Wall -Wextra -o file_io',
      'Run the program and inspect log.txt and data.bin.',
    ],
    goal: 'You successfully wrote text files, appended data, read lines safely, stored binary data, and cleaned up file resources correctly.',
  },
  [
    q(
      'What does fopen return if it successfully opens a file?',
      [
        'A FILE pointer to the opened stream',
        'An integer error code',
        'A string containing the file contents',
        'A file name',
      ],
      0,
      'fopen returns a FILE pointer representing the stream. If opening fails, it returns NULL.'
    ),
    q(
      'Which fopen mode appends data to the end of a file without deleting existing content?',
      [
        '"w"',
        '"a"',
        '"r"',
        '"x"',
      ],
      1,
      'The "a" mode opens a file for appending. New data is written after existing content. The "w" mode would erase the file first.'
    ),
    q(
      'Why must you check whether fopen returns NULL?',
      [
        'Because the file may fail to open due to permissions, missing files, or system limits',
        'Because fopen is optional',
        'Because files cannot be reused',
        'Because NULL is a normal success value',
      ],
      0,
      'If fopen fails, it returns NULL. Dereferencing or using a NULL FILE pointer causes undefined behavior and crashes.'
    ),
    q(
      'Why is fgets usually safer than unbounded input functions?',
      [
        'Because you provide a buffer size limit',
        'Because it automatically deletes invalid input',
        'Because it reads only numbers',
        'Because it never fails',
      ],
      0,
      'fgets reads at most one less than the specified buffer size, leaving space for the null terminator. This helps prevent buffer overflow.'
    ),
    q(
      'What is the purpose of fclose?',
      [
        'It releases the file stream and ensures buffered output is flushed',
        'It deletes the file from disk',
        'It clears the terminal',
        'It converts text to binary',
      ],
      0,
      'fclose closes the stream, flushes pending output, and releases the associated resource. It does not delete the file.'
    ),
  ],
  [
    'Use FILE pointers to interact with files through streams.',
    'Choose the correct file mode: read, write, append, or binary.',
    'Always check fopen results before using the stream.',
    'Prefer bounded functions like fgets for text input.',
    'Close files with fclose to release resources and flush data.',
  ],
  'This lesson requires local file system access. Use your local terminal with GCC or Clang.'
),

L(
  'c-18',
  18,
  'Preprocessor & Macros',
  '⚙️',
  '⚙️ Before the compiler sees your C code, the preprocessor transforms it. It expands includes, replaces macros, and selects code paths using conditional directives. Mastering the preprocessor helps you understand headers, build configuration, compile-time constants, and common macro pitfalls.',
  [
    {
      title: '1. The Preprocessor Stage',
      beginner:
        'The preprocessor runs before real compilation. It handles lines that begin with #, such as #include and #define. It does not understand C logic; it transforms source text.',
      advanced:
        'Preprocessing is a textual transformation phase. It expands macros, inserts header contents, and evaluates conditional compilation directives. Because it operates before semantic analysis, macro mistakes can produce strange compiler errors or hidden logic bugs.',
    },
    {
      title: '2. #include and Header Expansion',
      beginner:
        'The #include directive copies declarations from another file into your source file before compilation. For example, #include <stdio.h> gives your program access to printf declarations.',
      advanced:
        'Angle brackets search system or compiler include paths, while quotes usually search local project paths first. Include order and include guards matter because headers can be included multiple times through dependency chains.',
    },
    {
      title: '3. Object-Like and Function-Like Macros',
      beginner:
        'The #define directive creates a macro. A simple macro like #define MAX_SCORE 100 replaces every MAX_SCORE with 100. A function-like macro such as #define SQUARE(x) ((x) * (x)) replaces code patterns.',
      advanced:
        'Function-like macros are expanded inline and do not perform type checking. They can evaluate arguments multiple times. Always parenthesize macro parameters and the entire macro body to avoid precedence bugs.',
    },
    {
      title: '4. Conditional Compilation',
      beginner:
        'Directives like #if, #ifdef, and #ifndef tell the compiler to include or exclude code based on conditions. This is useful for debug logging, platform-specific code, and feature toggles.',
      advanced:
        'Conditional compilation is heavily used in cross-platform C and library design. Include guards use #ifndef, #define, and #endif to prevent duplicate type definitions when headers are included multiple times.',
    },
    {
      title: '5. Macro Pitfalls',
      beginner:
        'Macros can be dangerous if written carelessly. For example, SQUARE(2 + 3) without parentheses may become 2 + 3 * 2 + 3, producing the wrong answer. Good macro design avoids these surprises.',
      advanced:
        'Macros can cause multiple evaluation, obscure debugging, and type-unsafe behavior. For complex logic, prefer inline functions, const variables, or enums. Use macros mainly for constants, guards, and controlled compile-time configuration.',
    },
  ],
  {
    title: 'Macro Behavior Lab',
    intro:
      'This practical explores macro expansion, safe parentheses, conditional compilation, and preprocessor output.',
    steps: [
      'Create a file named macros.c.',
      'Add #include <stdio.h> at the top.',
      'Define constants: #define MAX_USERS 100 and #define APP_NAME "MacroLab"',
      'Define a safe macro: #define SQUARE(x) ((x) * (x))',
      'Define another safe macro: #define MAX(a, b) ((a) > (b) ? (a) : (b))',
      'Inside main, print MAX_USERS and APP_NAME.',
      'Print SQUARE(5) and SQUARE(2 + 3) to verify correct expansion.',
      'Print MAX(10, 20) and MAX(50, 30).',
      'Add: #define DEBUG_MODE 1',
      'Use conditional compilation: #if DEBUG_MODE printf("Debug mode is active\\n"); #endif',
      'Compile normally: gcc macros.c -Wall -Wextra -o macros',
      'Run the program and verify the output.',
      'Inspect preprocessing only: gcc -E macros.c -o macros.i',
      'Open macros.i and observe how macros were expanded.',
    ],
    goal: 'You successfully used object-like macros, function-like macros, conditional compilation, and preprocessor inspection.',
  },
  [
    q(
      'When does the C preprocessor run?',
      [
        'Before the compiler performs full translation',
        'After the program finishes',
        'Only when using printf',
        'Only on Windows',
      ],
      0,
      'The preprocessor runs before compilation and transforms source text by expanding includes, macros, and conditional directives.'
    ),
    q(
      'What does #define MAX_SCORE 100 create?',
      [
        'A macro that replaces MAX_SCORE with 100 during preprocessing',
        'A variable stored in RAM',
        'A function named MAX_SCORE',
        'A file named MAX_SCORE',
      ],
      0,
      'This is an object-like macro. The preprocessor replaces occurrences of MAX_SCORE with 100 before actual compilation.'
    ),
    q(
      'Why should macro parameters be wrapped in parentheses?',
      [
        'To prevent operator precedence bugs during expansion',
        'To make macros run faster',
        'To make macros visible in the terminal',
        'To avoid using functions',
      ],
      0,
      'Parentheses preserve the intended order of operations. Without them, macro expansion can produce incorrect expressions.'
    ),
    q(
      'What is a common danger of function-like macros?',
      [
        'They may evaluate an argument multiple times and have no type checking',
        'They cannot accept numbers',
        'They delete variables',
        'They prevent compilation permanently',
      ],
      0,
      'Macros are textual replacements. They can evaluate arguments multiple times and do not enforce types like functions do.'
    ),
    q(
      'What is the purpose of #ifndef in include guards?',
      [
        'To include header content only if a symbol has not already been defined',
        'To define a new function',
        'To remove comments',
        'To link object files',
      ],
      0,
      '#ifndef checks whether a symbol is not defined. Include guards use this to prevent duplicate definitions when headers are included multiple times.'
    ),
  ],
  [
    'The preprocessor transforms source text before compilation.',
    '#include inserts declarations from headers.',
    '#define creates constants and macros.',
    'Always parenthesize macro arguments and bodies.',
    'Use conditional compilation for debug and platform control.',
  ],
  'You can use the browser C lab for small macro examples, but local GCC or Clang is recommended for preprocessor inspection.'
),

L(
  'c-19',
  19,
  'Header Files & Separate Compilation',
  '🧰',
  '🧰 Real C projects are not written in one giant file. They are split into headers and source files. Headers describe interfaces, while source files contain implementations. Separate compilation lets large projects build efficiently and keeps code organized, testable, and maintainable.',
  [
    {
      title: '1. Declarations vs Definitions',
      beginner:
        'A declaration tells the compiler that something exists, such as a function prototype. A definition provides the actual implementation. Header files usually contain declarations, while .c files contain definitions.',
      advanced:
        'The One Definition Rule in C requires that functions and global objects have exactly one definition across the final linked program. Headers can be included multiple times, but definitions must not be duplicated.',
    },
    {
      title: '2. Header Files as Interfaces',
      beginner:
        'A header file is like a contract. It tells other files what functions, types, and constants are available. Your main program includes the header and uses the functions without needing to see their internal code.',
      advanced:
        'Headers form the public API of a module. Good headers expose minimal necessary declarations and hide implementation details. This reduces coupling and improves maintainability.',
    },
    {
      title: '3. Include Guards',
      beginner:
        'If a header is included twice, the compiler may see duplicate declarations and complain. Include guards prevent this by using #ifndef, #define, and #endif around the entire header.',
      advanced:
        'Include guards make headers idempotent. Some compilers also support #pragma once, but traditional include guards remain highly portable across C toolchains.',
    },
    {
      title: '4. Separate Compilation',
      beginner:
        'You can compile each .c file separately into an object file. This means when you change one file, you only need to rebuild that file, not the whole project.',
      advanced:
        'Separate compilation produces object files containing compiled machine code and symbol information. The linker later combines these object files and libraries into a final executable.',
    },
    {
      title: '5. Linking and Build Organization',
      beginner:
        'After compiling separate files, you link them together. For example, gcc main.c mathlib.c -o app compiles and links in one command. For larger projects, you compile objects first and then link them.',
      advanced:
        'Build systems such as Make, CMake, or Meson manage dependencies, compiler flags, object files, and linking. Understanding manual compilation helps you diagnose linker errors and build configuration issues.',
    },
  ],
  {
    title: 'Multi-File Math Library Lab',
    intro:
      'This practical creates a small math library with a header file, an implementation file, and a main program, then compiles and links them separately.',
    steps: [
      'Create a file named mathlib.h.',
      'Add an include guard: #ifndef MATHLIB_H, then #define MATHLIB_H, and at the bottom #endif.',
      'Inside the guard, declare: int add(int a, int b); int multiply(int a, int b);',
      'Create a file named mathlib.c.',
      'Include mathlib.h and define add and multiply.',
      'Create a file named main.c.',
      'Include stdio.h and mathlib.h.',
      'Inside main, call add(3, 4) and multiply(5, 6), then print the results.',
      'Compile objects separately: gcc -c mathlib.c -o mathlib.o and gcc -c main.c -o main.o',
      'Link the objects: gcc mathlib.o main.o -o app',
      'Run the program: ./app on macOS or Linux, or app.exe on Windows.',
      'Modify mathlib.c only, recompile mathlib.o, and relink without recompiling main.c.',
    ],
    goal: 'You successfully organized a C project into headers and source files, compiled object files separately, and linked them into one executable.',
  },
  [
    q(
      'What is the main purpose of a header file?',
      [
        'To declare interfaces such as functions, types, and constants',
        'To store executable machine code permanently',
        'To replace the compiler',
        'To prevent all bugs',
      ],
      0,
      'Header files declare what other code can use. The actual implementation usually lives in .c files.'
    ),
    q(
      'What does a function prototype declare?',
      [
        'The function name, return type, and parameter types',
        'The full function body',
        'The operating system version',
        'The memory address of main',
      ],
      0,
      'A prototype tells the compiler how to call a function. The definition provides the actual body.'
    ),
    q(
      'Why are include guards used?',
      [
        'To prevent a header from being processed multiple times in the same translation unit',
        'To make headers load faster',
        'To encrypt header files',
        'To remove comments',
      ],
      0,
      'Include guards prevent duplicate declarations and definitions caused by multiple inclusion of the same header.'
    ),
    q(
      'What does gcc -c main.c -o main.o do?',
      [
        'It compiles main.c into an object file without linking',
        'It runs the program immediately',
        'It deletes main.c',
        'It creates a header file',
      ],
      0,
      'The -c flag compiles source code into an object file. Linking is performed later.'
    ),
    q(
      'What happens during linking?',
      [
        'Object files and libraries are combined into a final executable',
        'The preprocessor expands macros',
        'Source code is checked for spelling only',
        'The terminal clears previous output',
      ],
      0,
      'The linker resolves symbols and combines object files into a runnable program.'
    ),
  ],
  [
    'Headers declare interfaces; source files define implementations.',
    'Use include guards to prevent duplicate inclusion.',
    'Compile separate .c files into object files.',
    'Link object files to create the final executable.',
    'Organize projects into modules for maintainability.',
  ],
  'This lesson requires local compilation and file organization. Use your local terminal with GCC or Clang.'
),

L(
  'c-20',
  20,
  'Error Handling & Debugging Basics',
  '🚨',
  '🚨 C does not protect you from mistakes. It gives you power, but it expects discipline. Professional C programmers design for failure: failed file opens, invalid input, allocation errors, and impossible states. Error handling and debugging turn mysterious crashes into controlled, understandable behavior.',
  [
    {
      title: '1. C Error Philosophy',
      beginner:
        'C usually reports errors through return values. A function may return NULL, -1, or 0 to signal failure. Your job is to check those return values and respond safely.',
      advanced:
        'C error handling is explicit and manual. Functions often use sentinel return values, output parameters, or global error state. Robust systems define clear error contracts and cleanup paths.',
    },
    {
      title: '2. errno, perror, and strerror',
      beginner:
        'When a system-related function fails, C often stores an error code in errno. You can use perror to print a human-readable message, or strerror to get the error text.',
      advanced:
        'errno is thread-local in modern hosted environments. Functions only set errno on failure, so you should check the return value first. perror prints to stderr and includes the reason associated with the current errno value.',
    },
    {
      title: '3. assert and Internal Invariants',
      beginner:
        'The assert macro checks a condition that should always be true in correct code. If the condition is false, the program stops and shows where the assumption failed.',
      advanced:
        'assert is for internal programmer assumptions, not for validating normal user input or recoverable runtime errors. Defining NDEBUG disables assertions in release builds.',
    },
    {
      title: '4. Defensive Programming',
      beginner:
        'Defensive programming means checking values before using them. Check pointers before dereferencing them. Check file handles before reading or writing. Check array indexes before access.',
      advanced:
        'Defensive C code centralizes validation, fails fast on impossible states, and cleans up resources deterministically. Error paths should be as tested as success paths.',
    },
    {
      title: '5. Debugging Tools',
      beginner:
        'The simplest debugging tool is printf. Print values at important points to understand what your program is doing. Compile with warnings enabled so the compiler can help you find mistakes.',
      advanced:
        'Use gcc -g to include debug symbols, gdb to inspect runtime state, -Wall -Wextra for diagnostics, and sanitizers like AddressSanitizer to detect memory errors. Debugging is a workflow, not a single command.',
    },
  ],
  {
    title: 'Failure Detection & Debugging Lab',
    intro:
      'This practical demonstrates failed file opening, errno reporting, assertions, warning flags, and debug builds.',
    steps: [
      'Create a file named errors.c.',
      'Add #include <stdio.h>, #include <stdlib.h>, #include <errno.h>, and #include <assert.h>.',
      'Inside main, attempt to open a missing file: FILE *file = fopen("missing_file.txt", "r");',
      'If file == NULL, call perror("fopen failed") and observe the message.',
      'Print the numeric error code: printf("errno = %d\\n", errno);',
      'Create a valid integer: int value = 10;',
      'Use assert(value > 0); to validate an internal assumption.',
      'Add a deliberately suspicious expression such as int result = value / 0; only if you want to observe a crash, otherwise keep it commented out.',
      'Compile with warnings: gcc errors.c -Wall -Wextra -o errors',
      'Compile with debug symbols: gcc errors.c -Wall -Wextra -g -o errors_debug',
      'Run the program and observe the error handling output.',
      'Optional: run gdb ./errors_debug to inspect the program state.',
    ],
    goal: 'You successfully detected runtime failure, used errno and perror, applied assertions, and built debug-ready binaries.',
  },
  [
    q(
      'How does C usually report errors from functions?',
      [
        'Through return values such as NULL, -1, or other sentinel values',
        'By automatically restarting the program',
        'By sending errors to the cloud',
        'By deleting corrupted files automatically',
      ],
      0,
      'C relies on explicit return values and manual checking. The programmer is responsible for handling failure cases.'
    ),
    q(
      'What is errno used for?',
      [
        'It stores an error code set by some library and system functions after a failure',
        'It stores the number of variables in a program',
        'It stores the size of the stack',
        'It stores random numbers',
      ],
      0,
      'errno holds an error code that can be inspected after a function reports failure. It is commonly used with perror and strerror.'
    ),
    q(
      'What does perror do?',
      [
        'It prints a descriptive error message to stderr based on errno',
        'It fixes the error automatically',
        'It closes all files',
        'It restarts the compiler',
      ],
      0,
      'perror prints your custom message followed by a system description of the current errno value.'
    ),
    q(
      'When should assert be used?',
      [
        'For internal assumptions that should never be false in correct code',
        'For all user input validation',
        'For network connections',
        'For replacing error handling completely',
      ],
      0,
      'assert is for impossible states and internal invariants. Recoverable errors should be handled with normal error logic.'
    ),
    q(
      'Why compile with -Wall -Wextra?',
      [
        'To enable many useful compiler warnings that reveal suspicious code',
        'To disable all error messages',
        'To make the program run without testing',
        'To remove debug symbols',
      ],
      0,
      'Warning flags help detect uninitialized variables, unused values, type mismatches, and other dangerous patterns early.'
    ),
  ],
  [
    'Check return values from every important C function.',
    'Use errno, perror, and strerror for system-level errors.',
    'Use assert for internal invariants, not normal input validation.',
    'Compile with warnings enabled.',
    'Use debug builds and sanitizers to investigate memory errors.',
  ],
  'This lesson is best completed in your local terminal because debugging and error inspection depend on real compiler and system behavior.'
),

L(
  'c-21',
  21,
  'Structs, Pointers & Data Modeling',
  '🏗️',
  '🏗️ Real programs model entities: users, products, packets, configuration records, and devices. Structs provide the data shape, while pointers provide the control. Combining them lets you build dynamic, efficient, and realistic C data models.',
  [
    {
      title: '1. Structs as Domain Models',
      beginner:
        'A struct groups related fields into one type. For example, a Student struct can contain an id, a score, and a name. This makes your code easier to understand because data is organized meaningfully.',
      advanced:
        'Structs are composite types with layout and alignment rules. They are the foundation of records, protocol messages, configuration objects, and systems data structures.',
    },
    {
      title: '2. Pointers to Structs',
      beginner:
        'You can store the address of a struct in a pointer. Instead of using the dot operator, you use the arrow operator to access members through the pointer.',
      advanced:
        'The arrow operator combines dereferencing and member access. Passing struct pointers avoids copying large objects and enables mutation, but it also requires lifetime awareness.',
    },
    {
      title: '3. Dynamic Structs',
      beginner:
        'You can create structs at runtime using malloc. This is useful when the number of records is not known before the program runs. Always check whether malloc succeeds and free the memory later.',
      advanced:
        'Dynamic structs live on the heap. Ownership becomes explicit: some code is responsible for allocation, some for use, and some for deallocation. Clear ownership prevents leaks and dangling pointers.',
    },
    {
      title: '4. Data Modeling Discipline',
      beginner:
        'Good data modeling means choosing clear field names, initializing all fields, and deciding whether data should be copied or shared. Do not treat structs as random bags of memory.',
      advanced:
        'Professional C data modeling considers alignment, padding, ownership, mutability, and serialization. Structs may be passed by value, by pointer, or by const pointer depending on intent.',
    },
    {
      title: '5. Const Correctness',
      beginner:
        'If a function only reads a struct and does not change it, use a const pointer. This communicates that the data should not be modified.',
      advanced:
        'Const correctness improves safety and documentation. A const struct pointer prevents member modification through that pointer and helps compilers catch accidental writes.',
    },
  ],
  {
    title: 'Dynamic Record Model Lab',
    intro:
      'This practical creates a struct model, passes it through pointers, allocates it dynamically, and cleans it up safely.',
    steps: [
      'Create a file named modeling.c.',
      'Add #include <stdio.h> and #include <stdlib.h> at the top.',
      'Define: struct Student { int id; int score; char name[32]; };',
      'Write a print function: void print_student(const struct Student *s) using printf and the arrow operator.',
      'Inside main, create a stack struct: struct Student s1 = {1, 90, "Alice"};',
      'Call print_student(&s1);',
      'Allocate a dynamic struct: struct Student *s2 = malloc(sizeof(struct Student));',
      'Check if s2 == NULL and return 1 if allocation failed.',
      'Assign fields: s2->id = 2; s2->score = 88; use snprintf(s2->name, sizeof(s2->name), "%s", "Bob");',
      'Call print_student(s2);',
      'Update the score through the pointer: s2->score = 95;',
      'Print again to confirm mutation.',
      'Free the dynamic struct: free(s2);',
      'Set s2 = NULL;',
      'Compile with: gcc modeling.c -Wall -Wextra -o modeling',
      'Run the program and verify both stack and heap records.',
    ],
    goal: 'You successfully modeled data with structs, used pointers to access and mutate records, allocated dynamic memory, and cleaned it up safely.',
  },
  [
    q(
      'What does the arrow operator -> do?',
      [
        'It accesses a struct member through a pointer',
        'It creates a new struct',
        'It frees memory',
        'It compares two structs',
      ],
      0,
      'The arrow operator dereferences a struct pointer and accesses a member. ptr->id is equivalent to (*ptr).id.'
    ),
    q(
      'Why pass a large struct to a function using a pointer?',
      [
        'To avoid copying the whole struct and allow modification if needed',
        'To make the struct immutable',
        'To delete the struct automatically',
        'To convert it into a string',
      ],
      0,
      'Passing by pointer is efficient and can allow mutation. Use const pointers when the function should only read the data.'
    ),
    q(
      'Where does a struct created with malloc live?',
      [
        'On the heap',
        'On the stack',
        'In read-only instruction memory',
        'In the compiler cache',
      ],
      0,
      'malloc allocates memory from the heap. The programmer must later release it with free.'
    ),
    q(
      'What is ownership in C memory management?',
      [
        'Knowing which part of the code is responsible for freeing allocated memory',
        'Owning the source code file',
        'Keeping all variables global',
        'Preventing functions from returning values',
      ],
      0,
      'Ownership determines who must free memory. Without clear ownership, programs leak memory or free it twice.'
    ),
    q(
      'What does const struct Student *s mean?',
      [
        's points to a Student struct that should not be modified through s',
        's is a constant integer',
        's cannot be printed',
        's is automatically freed',
      ],
      0,
      'The const qualifier prevents modification of the struct through that pointer. It is useful for read-only function parameters.'
    ),
  ],
  [
    'Use structs to model meaningful domain data.',
    'Use pointers to avoid copies and enable mutation.',
    'Use -> to access struct members through pointers.',
    'Use malloc for runtime-created records.',
    'Use const pointers for read-only access.',
  ],
  'This lesson is best completed in your local terminal because dynamic memory and debugging are easier to verify with real tools.'
),

L(
  'c-22',
  22,
  'Function Pointers',
  '🎯',
  '🎯 Function pointers allow code to treat behavior as data. You can store a function in a variable, pass it to another function, and choose algorithms at runtime. This is the foundation of callbacks, dispatch tables, plugin systems, and many standard C library patterns.',
  [
    {
      title: '1. Functions Have Addresses',
      beginner:
        'A function is stored in memory like other program components. You can take the address of a function and store it in a specially typed pointer variable.',
      advanced:
        'A function pointer references executable code. Its type includes the return type and parameter types. Calling through the wrong function pointer type is undefined behavior.',
    },
    {
      title: '2. Declaring Function Pointers',
      beginner:
        'A function pointer declaration can look strange at first. For example, int (*op)(int, int) means op is a pointer to a function that takes two ints and returns an int.',
      advanced:
        'Typedef can simplify function pointer declarations. For example, typedef int (*binary_op)(int, int); creates an alias that makes code cleaner and easier to maintain.',
    },
    {
      title: '3. Calling Through Pointers',
      beginner:
        'Once a function pointer points to a function, you can call it like a normal function. The pointer determines which code runs.',
      advanced:
        'Function pointer calls introduce indirect control flow. Debuggers and profilers may show indirect branches. Correct typing and initialization are essential.',
    },
    {
      title: '4. Callbacks and Dispatch Tables',
      beginner:
        'You can build a menu system where each choice selects a different function. Instead of many if statements, you can store functions in an array or table and call the selected one.',
      advanced:
        'Dispatch tables map commands or opcodes to function pointers. This pattern is common in interpreters, command-line tools, event systems, and embedded control loops.',
    },
    {
      title: '5. Function Pointers in Standard C',
      beginner:
        'Some standard library functions accept function pointers. The qsort function uses a comparator function to decide how to sort elements.',
      advanced:
        'qsort demonstrates generic programming in C. The comparator receives const void pointers and returns a negative, zero, or positive value to express ordering.',
    },
  ],
  {
    title: 'Operation Dispatch Lab',
    intro:
      'This practical builds a small calculator dispatch table and uses qsort with a custom comparator.',
    steps: [
      'Create a file named func_ptrs.c.',
      'Add #include <stdio.h> and #include <stdlib.h> at the top.',
      'Define functions: int add(int a, int b), int subtract(int a, int b), int multiply(int a, int b).',
      'Declare a function pointer type: typedef int (*binary_op)(int, int);',
      'Inside main, create: binary_op operation = add;',
      'Call through the pointer: printf("%d\\n", operation(4, 5));',
      'Reassign operation = multiply; and call it again.',
      'Create an array: binary_op ops[3] = { add, subtract, multiply };',
      'Loop through the array and call each function with arguments 10 and 3.',
      'Create an int array: int nums[5] = {40, 10, 30, 20, 50};',
      'Write a comparator function for ascending order using const int * casts.',
      'Call qsort(nums, 5, sizeof(int), compare_asc);',
      'Print the sorted array.',
      'Compile with: gcc func_ptrs.c -Wall -Wextra -o func_ptrs',
      'Run the program and verify dispatch and sorting behavior.',
    ],
    goal: 'You successfully stored functions in variables, selected behavior at runtime, built a dispatch table, and used qsort with a comparator.',
  },
  [
    q(
      'What is a function pointer?',
      [
        'A variable that stores the address of a function',
        'A pointer to a global variable',
        'A file containing functions',
        'A compiler flag',
      ],
      0,
      'A function pointer stores the address of executable code and can be used to call that function indirectly.'
    ),
    q(
      'What does int (*op)(int, int) declare?',
      [
        'A pointer to a function that takes two ints and returns an int',
        'An array of two integers',
        'A struct with two ints',
        'A function named op',
      ],
      0,
      'This declares op as a function pointer with a specific signature. The parentheses around *op are important.'
    ),
    q(
      'Why are function pointers useful?',
      [
        'They allow behavior to be selected or passed at runtime',
        'They remove the need for functions',
        'They make variables immutable',
        'They automatically optimize loops',
      ],
      0,
      'Function pointers enable callbacks, dispatch tables, sorting comparators, and plugin-style architectures.'
    ),
    q(
      'What does qsort require from the programmer?',
      [
        'A comparator function that defines the ordering of elements',
        'A global variable containing the sorted result',
        'A separate executable file',
        'A network connection',
      ],
      0,
      'qsort uses a user-provided comparator to determine element ordering. The comparator receives pointers to elements.'
    ),
    q(
      'What is a dispatch table?',
      [
        'A table that maps commands or choices to function pointers',
        'A table used only for printing text',
        'A database of user passwords',
        'A compiler optimization flag',
      ],
      0,
      'A dispatch table maps operations to functions, allowing clean runtime selection of behavior without long if chains.'
    ),
  ],
  [
    'Functions can be referenced through pointers.',
    'Function pointer syntax includes return type and parameter types.',
    'Use typedef to simplify function pointer declarations.',
    'Dispatch tables select behavior at runtime.',
    'qsort demonstrates standard library callback usage.',
  ],
  'This lesson is best completed in your local terminal because indirect function calls and sorting are easier to verify with real compiler output.'
),

L(
  'c-23',
  23,
  'Recursion & Call Stack',
  '🔁',
  '🔁 Recursion is a function calling itself to solve smaller versions of a problem. It is elegant and powerful, but it depends on the call stack. Understanding recursion helps you understand function frames, stack limits, and the trade-off between clarity and resource usage.',
  [
    {
      title: '1. Recursive Thinking',
      beginner:
        'A recursive function solves a problem by reducing it to a smaller version of the same problem. For example, factorial of 5 is 5 times factorial of 4, and factorial of 4 is 4 times factorial of 3, and so on.',
      advanced:
        'Recursive design requires identifying a recursive case and a base case. The recursive case must move toward the base case, or the function will never terminate.',
    },
    {
      title: '2. Base Cases',
      beginner:
        'A base case is the condition where the function stops calling itself. Without a base case, recursion continues forever and eventually crashes.',
      advanced:
        'Base cases define termination and correctness. In recursive algorithms, each call should reduce the problem state in a way that eventually reaches a base case.',
    },
    {
      title: '3. The Call Stack',
      beginner:
        'Every function call creates a stack frame. This frame stores parameters, local variables, and the return location. When the function returns, the frame is removed.',
      advanced:
        'Recursion consumes stack space proportional to call depth. Deep recursion can exhaust the stack and cause stack overflow, especially in systems with limited stack size.',
    },
    {
      title: '4. Recursion vs Iteration',
      beginner:
        'Many recursive solutions can also be written with loops. Recursion can be clearer for tree traversal, divide-and-conquer, and mathematical definitions. Iteration can be more memory-efficient.',
      advanced:
        'Tail-call optimization is not guaranteed in C. Performance-critical code often converts deep recursion into explicit stacks or iterative algorithms to control memory usage.',
    },
    {
      title: '5. Debugging Recursion',
      beginner:
        'When recursion fails, print the input at each call. Watch whether the value moves toward the base case. If it does not, the recursive case is wrong.',
      advanced:
        'Use debuggers to inspect stack frames and call depth. For production systems, consider maximum input size, stack limits, and whether recursion depth can be bounded.',
    },
  ],
  {
    title: 'Recursive Function Lab',
    intro:
      'This practical implements factorial and countdown recursion, observes call depth, and compares recursion with iteration.',
    steps: [
      'Create a file named recursion.c.',
      'Add #include <stdio.h> at the top.',
      'Define: int factorial(int n) with base case if (n <= 1) return 1;',
      'Recursive case: return n * factorial(n - 1);',
      'Define: void countdown(int n) that prints n, then calls countdown(n - 1) if n > 0.',
      'Inside main, print factorial(5), factorial(7), and factorial(10).',
      'Call countdown(5).',
      'Write an iterative version: int factorial_loop(int n) using a for loop.',
      'Compare factorial(10) and factorial_loop(10).',
      'Compile with: gcc recursion.c -Wall -Wextra -o recursion',
      'Run the program and verify results.',
      'Optional: add a debug printf inside factorial to observe call depth.',
    ],
    goal: 'You successfully implemented recursive functions, understood base cases, observed call depth, and compared recursion with iteration.',
  },
  [
    q(
      'What is recursion?',
      [
        'A function calling itself to solve smaller versions of a problem',
        'A loop that never ends',
        'A way to delete functions',
        'A file compression method',
      ],
      0,
      'Recursion solves problems by reducing them to smaller instances of the same problem until a base case is reached.'
    ),
    q(
      'What is a base case?',
      [
        'The condition that stops recursion',
        'The first variable in main',
        'The largest input allowed',
        'A compiler optimization',
      ],
      0,
      'The base case prevents infinite recursion. It returns a result without making another recursive call.'
    ),
    q(
      'What happens if a recursive function has no working base case?',
      [
        'It may recurse until the stack overflows',
        'It automatically returns zero',
        'It converts to a loop',
        'It deletes local variables safely',
      ],
      0,
      'Without a base case, recursive calls continue until system resources are exhausted, typically causing stack overflow.'
    ),
    q(
      'Where are recursive function calls stored during execution?',
      [
        'On the call stack',
        'In the binary file',
        'In the keyboard buffer',
        'In global constants',
      ],
      0,
      'Each call creates a stack frame. Deep recursion consumes more stack memory.'
    ),
    q(
      'Why might iteration be preferred over deep recursion?',
      [
        'It can use less stack memory and avoid stack overflow',
        'It prevents all bugs',
        'It removes the need for variables',
        'It makes functions invisible',
      ],
      0,
      'Iteration avoids creating many stack frames. This can be important for performance and stability in constrained environments.'
    ),
  ],
  [
    'Recursion requires a base case and a recursive case.',
    'Each recursive call creates a stack frame.',
    'Deep recursion can exhaust stack memory.',
    'Use debug output to trace recursive calls.',
    'Compare recursion with iteration for efficiency.',
  ],
  'You can use the browser C lab for small recursion examples, but local execution is recommended for stack and debugging experiments.'
),

L(
  'c-24',
  24,
  'Basic Data Structures in C',
  '📚',
  '📚 Data structures are the skeletons of software. Arrays, stacks, queues, and linked lists determine how efficiently your program stores and processes data. In C, building them manually teaches you memory layout, pointer ownership, and algorithmic thinking.',
  [
    {
      title: '1. Arrays as Foundations',
      beginner:
        'Arrays store values in contiguous memory. They are simple, fast to index, and cache-friendly. Many higher-level structures are built on top of arrays.',
      advanced:
        'Arrays provide O(1) indexing but fixed capacity unless combined with dynamic allocation and resizing logic. Resizing must be handled carefully to avoid leaks or invalid pointers.',
    },
    {
      title: '2. Stack Concept',
      beginner:
        'A stack is a last-in, first-out structure. You push items onto the stack and pop them off the top. Think of a stack of plates.',
      advanced:
        'Array-based stacks use a top index and capacity. Dynamic stacks may resize using realloc. Stack operations are usually O(1), making them ideal for call management, undo systems, and parsing.',
    },
    {
      title: '3. Queue Concept',
      beginner:
        'A queue is first-in, first-out. The first item added is the first item removed, like a line at a checkout counter.',
      advanced:
        'Queues can be implemented with arrays using circular indexing or with linked nodes. The choice affects memory usage, resizing strategy, and pointer management.',
    },
    {
      title: '4. Linked Lists',
      beginner:
        'A linked list stores nodes where each node contains a value and a pointer to the next node. Unlike arrays, nodes do not need to be stored next to each other.',
      advanced:
        'Linked lists allow O(1) insertion at the head but O(n) traversal. They introduce pointer ownership and require careful freeing to avoid leaks.',
    },
    {
      title: '5. Memory Ownership in Structures',
      beginner:
        'When a data structure allocates memory, you must decide who frees it. If a list owns its nodes, the list cleanup function should free every node.',
      advanced:
        'Ownership discipline prevents double free, dangling pointers, and leaks. Data structure APIs should clearly document allocation and deallocation responsibilities.',
    },
  ],
  {
    title: 'Stack & Linked List Lab',
    intro:
      'This practical builds an array-based stack and a simple singly linked list with proper cleanup.',
    steps: [
      'Create a file named structures.c.',
      'Add #include <stdio.h> and #include <stdlib.h> at the top.',
      'Define an array stack: int stack[100]; int top = -1;',
      'Write push and pop functions. Push should check capacity, and pop should check underflow.',
      'Inside main, push 10, 20, and 30 onto the stack.',
      'Pop values and print them to verify last-in, first-out order.',
      'Define a linked list node: struct Node { int value; struct Node *next; };',
      'Write a function to create a node using malloc and check for NULL.',
      'Build a small list by linking three nodes together.',
      'Write a print_list function that walks the list and prints each value.',
      'Write a free_list function that frees every node safely.',
      'Compile with: gcc structures.c -Wall -Wextra -o structures',
      'Run the program and verify stack order, list printing, and cleanup.',
    ],
    goal: 'You successfully implemented a stack and a linked list, understood ownership, and freed dynamically allocated nodes correctly.',
  },
  [
    q(
      'What is the access pattern of a stack?',
      [
        'Last-in, first-out',
        'First-in, first-out',
        'Random access only',
        'Sorted access only',
      ],
      0,
      'A stack pops the most recently pushed item first. This is last-in, first-out behavior.'
    ),
    q(
      'What is the access pattern of a queue?',
      [
        'First-in, first-out',
        'Last-in, first-out',
        'Only top access',
        'Only reverse access',
      ],
      0,
      'A queue removes elements in the same order they were added.'
    ),
    q(
      'What does a singly linked list node usually contain?',
      [
        'A value and a pointer to the next node',
        'Only a value',
        'Only a pointer',
        'A file descriptor',
      ],
      0,
      'A singly linked list node stores data and a pointer to the next node in the chain.'
    ),
    q(
      'What is a major advantage of arrays over linked lists?',
      [
        'Fast direct indexing and better cache locality',
        'Automatic resizing without code',
        'No memory usage',
        'Built-in sorting',
      ],
      0,
      'Arrays provide constant-time indexing and contiguous memory layout, which is often faster for traversal.'
    ),
    q(
      'What must you do after building a linked list with malloc?',
      [
        'Free every allocated node when finished',
        'Delete the source file',
        'Close the terminal',
        'Convert it into a global variable',
      ],
      0,
      'Each malloc call must be matched with a free call. A cleanup function should traverse and free the list.'
    ),
  ],
  [
    'Arrays provide contiguous, fast indexed storage.',
    'Stacks use last-in, first-out access.',
    'Queues use first-in, first-out access.',
    'Linked lists use nodes connected by pointers.',
    'Always define ownership and free allocated structure memory.',
  ],
  'This lesson is best completed in your local terminal because dynamic memory cleanup should be verified with real compiler diagnostics.'
),

L(
  'c-25',
  25,
  'Free Track Capstone: Systems Calculator',
  '🧪',
  '🧪 This capstone proves that you have moved beyond isolated syntax exercises. You will combine variables, control flow, functions, pointers, structs, dynamic memory, file I/O, error handling, and modular design into one complete C system. This is the bridge to advanced C engineering.',
  [
    {
      title: '1. Program Architecture',
      beginner:
        'A capstone program should not be written as one chaotic block. Separate concerns: input, math operations, history storage, display, and file logging. Clean structure makes debugging easier.',
      advanced:
        'Professional C architecture separates policy from mechanism. Interfaces should be small, ownership should be explicit, and failure paths should be handled deterministically.',
    },
    {
      title: '2. Input Parsing and Validation',
      beginner:
        'User input is dangerous. Always check whether input was read successfully. Reject invalid menu choices, non-numeric values, and division by zero.',
      advanced:
        'Robust parsing checks return values from scanf, fgets, or sscanf. It clears or consumes invalid input and maintains a valid program state.',
    },
    {
      title: '3. Operation Dispatch',
      beginner:
        'A calculator can use if statements, but a better design uses functions and function pointers. Each operation becomes a callable behavior selected by the menu.',
      advanced:
        'Function pointer dispatch tables reduce branching complexity and make the system easier to extend with new operations.',
    },
    {
      title: '4. Dynamic History Storage',
      beginner:
        'The calculator should remember previous calculations. You can store history entries in a dynamically growing array using malloc and realloc.',
      advanced:
        'Dynamic history requires capacity tracking, allocation failure handling, and cleanup. Each history entry should be initialized and printed safely.',
    },
    {
      title: '5. Persistent Logging',
      beginner:
        'A professional calculator writes each operation to a log file. This creates a persistent record and practices safe file handling.',
      advanced:
        'Logging should open files carefully, check for NULL, append entries, and close streams. Error messages should go to stderr when appropriate.',
    },
  ],
  {
    title: 'Systems Calculator Build',
    intro:
      'This practical builds a menu-driven calculator with dynamic history, function pointer dispatch, error handling, and persistent logging.',
    steps: [
      'Create a file named calculator.c.',
      'Add #include <stdio.h>, #include <stdlib.h>, and #include <string.h> at the top.',
      'Define operation functions: double add(double a, double b), double subtract(double a, double b), double multiply(double a, double b), double divide(double a, double b).',
      'Make divide check for zero and return a special error value or set an error flag.',
      'Define a function pointer type: typedef double (*operation_fn)(double, double);',
      'Define a history struct: struct HistoryEntry { double left; double right; double result; char op; };',
      'Create dynamic history storage: struct HistoryEntry *history = NULL; size_t history_count = 0; size_t history_capacity = 0;',
      'Write a function to append history using realloc, checking for NULL.',
      'Write a menu loop that reads user choices: 1 add, 2 subtract, 3 multiply, 4 divide, 5 show history, 6 exit.',
      'For each math choice, read two double values and validate input.',
      'Dispatch the selected operation through a function pointer.',
      'Append the operation to history.',
      'Append the operation to calculator_log.txt using fopen("calculator_log.txt", "a").',
      'Check all fopen and malloc results.',
      'Free history before exiting.',
      'Compile with: gcc calculator.c -Wall -Wextra -o calculator',
      'Run the program and test valid input, invalid input, division by zero, history display, and exit behavior.',
    ],
    goal: 'You successfully built a complete C application combining control flow, functions, pointers, structs, dynamic memory, file I/O, and error handling.',
  },
  [
    q(
      'Why should the capstone calculator validate user input?',
      [
        'Because invalid input can cause incorrect behavior or crashes',
        'Because validation makes the compiler unnecessary',
        'Because input should never be stored',
        'Because C automatically fixes bad input',
      ],
      0,
      'C does not automatically sanitize input. The program must check return values and reject invalid data.'
    ),
    q(
      'What is the benefit of using function pointers in the calculator?',
      [
        'They allow operations to be selected and dispatched cleanly at runtime',
        'They remove the need for variables',
        'They prevent all math errors',
        'They automatically log history',
      ],
      0,
      'Function pointers support dispatch tables and callbacks, making operation selection cleaner than long conditional chains.'
    ),
    q(
      'Why use dynamic memory for history storage?',
      [
        'Because the number of history entries may not be known in advance',
        'Because stack memory is always forbidden',
        'Because dynamic memory never fails',
        'Because history must be stored in binary only',
      ],
      0,
      'Dynamic memory allows the program to grow history capacity at runtime while managing allocation and cleanup explicitly.'
    ),
    q(
      'What should happen if realloc fails while expanding history?',
      [
        'The program should handle the failure without losing existing history',
        'The program should ignore the failure',
        'The program should delete all previous entries',
        'The program should restart the computer',
      ],
      0,
      'If realloc fails, it returns NULL while the original allocation remains valid. Professional code preserves the old pointer and handles the error.'
    ),
    q(
      'Why write operations to a log file?',
      [
        'To create a persistent record and practice safe file handling',
        'To replace the terminal',
        'To make the program slower permanently',
        'To avoid using functions',
      ],
      0,
      'Logging demonstrates file I/O, append behavior, error checking, and resource cleanup.'
    ),
  ],
  [
    'Structure programs into clear modules and responsibilities.',
    'Validate all input and handle failure cases.',
    'Use function pointers for clean operation dispatch.',
    'Use dynamic memory carefully and track ownership.',
    'Persist data with safe file I/O and cleanup.',
  ],
  'This capstone requires local execution because it uses dynamic memory, file persistence, and full program testing.'
 )
];

export const getCFreeLessonById = (id: string): CFreeLesson | undefined =>
  C_FREE_LESSONS.find((lesson) => lesson.id === id);

export const isCFreeLessonUnlocked = (
  id: string,
  completedLessons: string[]
): boolean => {
  const index = C_FREE_LESSONS.findIndex((lesson) => lesson.id === id);

  if (index <= 0) return true;

  return completedLessons.includes(C_FREE_LESSONS[index - 1].id);
};
