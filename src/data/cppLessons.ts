// C++ Track — 30 lessons (beginner → advanced)
import type { NetworkingLesson, Concept, QuizQuestion } from './networkingLessons';

export type CppLesson = NetworkingLesson;

const L = (
  id: string, order: number, title: string, icon: string, philosophy: string,
  concepts: Concept[], practical: CppLesson['practical'], quiz: QuizQuestion[],
  keyTakeaways: string[]
): CppLesson => ({
  id, module: 'Module 1: C++ Foundations', order, title, icon, philosophy,
  concepts, practical, quiz, keyTakeaways,
});

const q = (question: string, options: string[], correctIndex: number, explanation?: string): QuizQuestion =>
  ({ question, options, correctIndex, explanation });

export const CPP_TRACK_NOTICE = {
  type: "track-notice",
  notice: "🖥️ C++ Track Status: This track is currently under development. In this module, we are focusing on establishing your core programming foundation. Please proceed through the available lessons to build your skills; we are actively updating the preview environment and will notify you as soon as the interactive compiler is fully integrated."
};

const TERMINAL_NOTICE_FULL = "🖥️ **Terminal Notice:** We now have a built-in terminal right here! However, if you want a bigger screen, you can use your computer's native terminal. The practical assignment below contains the full setup instructions to install a C++ compiler on your machine.\n\n";
const TERMINAL_NOTICE_SHORT = "🖥️ **Terminal Notice:** If you want to use a big terminal on your own computer instead of the built-in one, please read Lesson 1 for the full setup instructions.\n\n";

export const CPP_LESSONS: CppLesson[] = [

  L(
    'cpp-01', 1, 'Hello C++ World: Compilers & Output', '🚀', 
    TERMINAL_NOTICE_FULL + 'Every incredible software engineering journey in C++ starts at the exact same place: the compiler. Unlike Python, C++ does not read and execute your text instantly. You must transform your raw text into low-level machine code using a Compiler before your computer can understand it. Today, we setup your tools and write your first program.',
    [
      { title: '1. The C++ Compiler & Linker', beginner: 'Think of the C++ Compiler as a highly strict translator. Your computer processor only understands 1s and 0s. The compiler takes your readable C++ English text and translates it entirely into an executable file (.exe or .out) that your machine can run at lightning speed.', advanced: 'C++ utilizes a multi-stage build process. The Preprocessor resolves macros and includes, the Compiler translates translation units into assembly/object files (`.o`), and finally, the Linker resolves symbol references to stitch those object files into a singular executable binary.' },
      { title: '2. The main() Function', beginner: 'Every C++ program MUST have a function called `main()`. This is the starting line of your race. When you click run, the computer looks specifically for `main()` and executes whatever is inside its curly braces `{}` first.', advanced: 'The `int main()` function serves as the designated entry point for the operating system execution sequence. It strictly returns an integer status code to the OS; a return of `0` signals successful execution, while any non-zero integer flags an error or abnormal termination.' },
      { title: '3. Header Includes (#include)', beginner: 'C++ is extremely lightweight by default; it doesn\'t even know how to print text to a screen! To get tools like printing, you have to "borrow" them by writing `#include <iostream>` at the very top of your file. This tells C++ to pack the standard input/output toolbox.', advanced: 'The `#include` directive is a preprocessor command that literally copies and pastes the contents of standard library header files directly into your source code before actual compilation begins, exposing function prototypes and stream objects.' },
      { title: '4. Basic Output (std::cout)', beginner: 'To talk to the screen, we use `std::cout` (Standard Character Output) combined with two arrows `<<`. For example: `std::cout << "Hello";`. To press Enter and go to a new line, we attach `<< std::endl;` at the end.', advanced: '`std::cout` is a globally scoped instance of the `std::ostream` class. The `<<` is an overloaded stream insertion operator. Utilizing `std::endl` not only inserts a newline character but also explicitly flushes the output buffer, whereas using `\\n` avoids the performance cost of flushing.' }
    ],
    {
      title: 'Workstation Setup & Compilation',
      intro: '⚠️ NOTE: This practical covers setting up your local C++ compiler (GCC/MinGW for Windows, Clang for Mac/Linux) and compiling your first script!',
      steps: [
        'WINDOWS: Download and install MSYS2 or MinGW to get the GCC compiler. MAC: Open terminal and type `xcode-select --install` to get Clang. LINUX: Type `sudo apt install build-essential`.',
        'Open your native terminal and verify the installation by typing `g++ --version` (or `clang++ --version`).',
        'Create a new text file named `app.cpp` in your favorite editor.',
        'Type the standard boilerplate: `#include <iostream>`, followed by `int main() {`, then `std::cout << "Hello World!" << std::endl;`, and finally `return 0; }`.',
        'In your terminal, navigate to the folder where you saved `app.cpp`.',
        'Compile the code by typing: `g++ app.cpp -o app` (This creates an executable named "app").',
        'Run the compiled binary! On Windows type `.\\app.exe`, on Mac/Linux type `./app`.'
      ],
      goal: 'You successfully installed a C++ compiler, wrote a standard main function, compiled the source code into a binary executable, and ran it.'
    },
    [
      q('Why does C++ require a compiler before you can run your code?', ['To check for spelling mistakes in your variable names', 'To translate your human-readable C++ text into low-level machine code (binary) that the processor can actually execute', 'To connect your computer to the internet', 'To make the text editor look colorful'], 1, 'C++ is a compiled language. The source code must be fully translated into a native machine code executable prior to runtime execution.'),
      q('What is the absolute required starting point for any executable C++ program?', ['#include <start>', 'void begin()', 'int main()', 'std::cout'], 2, 'The OS explicitly looks for the `main()` function as the entry point to begin executing the program\'s logical sequence.'),
      q('What does the `#include <iostream>` directive actually do?', ['It imports the standard input/output stream tools, allowing your program to print to the screen and read keyboard input', 'It allows the program to connect to Apple iOS devices', 'It creates a loop that runs forever', 'It shuts down the compiler'], 0, 'iostream stands for Input/Output Stream. Without including it, the compiler has no concept of what `std::cout` or `std::cin` are.'),
      q('What is the structural difference between `std::endl` and `\\n` when formatting text output?', ['There is no difference, they are identical under the hood', '`std::endl` inserts a new line AND forces the program to instantly flush the output buffer, while `\\n` only inserts a new line', '`\\n` deletes the previous line of text', '`std::endl` causes the program to crash if used twice'], 1, 'While both create a new line, `std::endl` explicitly flushes the output buffer stream, which is safer but slightly less performant inside massive loops than `\\n`.')
    ],
    ['C++ code must be compiled into an executable binary before it can run.', 'Every C++ program begins execution at the int main() function.', 'You must include <iostream> to gain access to screen printing tools.', 'Use std::cout << "text" to print, and return 0; to exit successfully.']
  ),

  L(
    'cpp-02', 2, 'Variables & Core Data Types', '📦', 
    TERMINAL_NOTICE_SHORT,
    [
      { title: '1. Strongly Typed Variables', beginner: 'In C++, variables are like strict containers. If you label a box as "Numbers Only", you cannot put a word inside it! You must tell C++ exactly what type of data you are storing the moment you create the variable, like `int age = 20;`.', advanced: 'C++ uses static typing. Variable types are evaluated and strictly enforced at compile-time, allocating precise byte sizes in memory. This eliminates the runtime overhead associated with dynamically typed languages like Python.' },
      { title: '2. Integers (int) & Decimals (double)', beginner: 'Use `int` for whole numbers (e.g., `int score = 100;`). Use `double` for numbers with decimal points (e.g., `double price = 19.99;`). Don\'t mix them up, or C++ might chop off your decimals automatically!', advanced: 'An `int` typically occupies 4 bytes (32 bits), while a `double` is a double-precision floating-point format occupying 8 bytes (64 bits), conforming to the IEEE 754 standard for floating-point arithmetic.' },
      { title: '3. Characters (char) & Logic (bool)', beginner: 'Use `char` to store a single letter wrapped in single quotes, like `char grade = \'A\';`. Use `bool` for logic that is either true or false, like `bool isGameOver = false;`.', advanced: 'A `char` requires exactly 1 byte of memory and actually stores the underlying ASCII integer value of the character. A `bool` evaluates strictly to `1` (true) or `0` (false) and technically occupies 1 byte for memory addressability.' },
      { title: '4. Strings & User Input (std::cin)', beginner: 'To store full sentences, use `std::string name = "Sage";` (requires `#include <string>`). To let a user type their name into your program, use `std::cin >> name;` (Standard Character Input). Notice the arrows point INTO the variable!', advanced: '`std::string` is not a primitive type; it is a class provided by the standard library that dynamically manages a heap-allocated array of chars. `std::cin` utilizes the overloaded stream extraction operator `>>` to parse delimited input.' }
    ],
    {
      title: 'The User Profile Generator',
      intro: 'Let\'s create a program that asks the user for their details, stores them in the correct strictly-typed containers, and prints a profile.',
      steps: [
        'Create a file named `profile.cpp`.',
        'Include your headers: `#include <iostream>` and `#include <string>`.',
        'Inside `main()`, declare four different variables: an `int` for age, a `double` for height, a `char` for their favorite letter, and a `std::string` for their name.',
        'Use `std::cout` to ask: "What is your name? ".',
        'Use `std::cin >> name;` to grab their keyboard input and store it.',
        'Repeat the ask-and-store process for their age, height, and favorite letter.',
        'Finally, use `std::cout` to print a cleanly formatted sentence using all 4 variables.'
      ],
      goal: 'You successfully declared strongly-typed variables, received input via std::cin, and printed dynamically injected memory values.'
    },
    [
      q('What does it mean that C++ is a "Statically Typed" language?', ['Variables can change their data type at any time', 'You must explicitly declare the data type of a variable before compiling, and it cannot change', 'It cannot run on laptops', 'Text can only be printed in static black and white'], 1, 'Static typing means type checking occurs during compile-time. The compiler must know exactly how much memory to allocate for a variable before the program ever runs.'),
      q('Which data type should you use to store the value `3.14159`?', ['int', 'char', 'bool', 'double'], 3, '`double` (double-precision floating point) is the standard C++ data type for storing numerical values that require decimal precision.'),
      q('What is the fundamental difference between single quotes (\'\') and double quotes ("") in C++?', ['There is no difference', 'Single quotes are for single `char` values, double quotes are for `std::string` text sequences', 'Single quotes are used for numbers, double quotes for text', 'Double quotes make the text print larger on the screen'], 1, 'In C++, syntax is strict: \'A\' is a single primitive character (char), while "A" is a character array / string sequence.'),
      q('Which operator is used to extract keyboard input from `std::cin` into a variable?', ['<<', '>>', '==', '++'], 1, 'The stream extraction operator `>>` points data coming FROM the console (cin) INTO your target variable.')
    ],
    ['Always declare the data type (int, double, bool) when creating a variable.', 'C++ enforces static typing; an int cannot suddenly become a string.', 'Use single quotes for chars (\'A\') and double quotes for strings ("Hello").', 'std::cin >> var; extracts user keyboard input into your variables.']
  ),

  L(
    'cpp-03', 3, 'Operators & Mathematical Expressions', '🧮', 
    TERMINAL_NOTICE_SHORT,
    [
      { title: '1. Standard Arithmetic', beginner: 'C++ can do all your basic math: Addition `+`, Subtraction `-`, Multiplication `*`, and Division `/`. Just remember, if you divide two whole integers (like `10 / 3`), C++ will chop off the decimal and just give you `3`!', advanced: 'Integer division truncates towards zero. To achieve float-precision division, at least one operand must be cast or declared as a floating-point type (e.g., `10.0 / 3` or `(double)x / y`).' },
      { title: '2. The Modulo Operator (%)', beginner: 'The Modulo operator `%` gives you the REMAINDER of a division. For example, `10 % 3` is `1` (because 3 fits into 10 three times, with 1 left over). This is highly useful for figuring out if a number is even or odd!', advanced: 'Modulo `%` is strictly defined for integer operands in C++. Attempting to use `%` on floating-point types will result in a compiler error (use `fmod()` from `<cmath>` for floats).' },
      { title: '3. Assignment & Incrementing', beginner: 'Programmers are lazy! Instead of writing `score = score + 5`, you can just write `score += 5`. Need to just add 1? Use the increment operator `score++`. Need to subtract 1? Use `score--`.', advanced: 'Be aware of postfix (`x++`) vs prefix (`++x`) evaluation. Prefix increments the value before evaluating the expression, whereas postfix evaluates the current value first, then increments the underlying memory address.' },
      { title: '4. Comparison Operators', beginner: 'To ask C++ a question, use comparison operators. Is equal to: `==`. Is not equal to: `!=`. Greater than: `>`. Less than: `<`. These equations don\'t return numbers; they strictly return boolean logic (`true` or `false`).', advanced: 'A common critical bug in C++ is accidentally using a single `=` (assignment) instead of `==` (equality) inside a condition. An assignment returns the assigned value, which usually evaluates to truthy, causing logic failures.' }
    ],
    {
      title: 'The Even/Odd Calculator',
      intro: 'Let\'s utilize the Modulo operator and assignment math to build a quick calculation engine.',
      steps: [
        'Inside a new `main()` function, declare an integer variable `int myNum = 15;`.',
        'Use the increment operator to add one to it: `myNum++;`.',
        'Use compound assignment to multiply it by two: `myNum *= 2;`.',
        'Declare an integer to capture the remainder: `int remainder = myNum % 2;`.',
        'Print the final remainder to the screen using `std::cout`. If the remainder is 0, the number is mathematically even!'
      ],
      goal: 'You successfully mutated variable data using shorthand assignment operators and utilized modulo arithmetic to extract a remainder.'
    },
    [
      q('What is the result of `7 / 2` in C++ if both numbers are stored as `int`?', ['3.5', '4', '3', 'Error'], 2, 'Because both operands are integers, C++ performs integer division, which completely truncates (chops off) the decimal portion, resulting in 3.'),
      q('What does the modulo operator (`%`) return?', ['The percentage of a number', 'The mathematical remainder after integer division', 'The square root of a number', 'A random number generator'], 1, 'Modulo evaluates the remainder. For example, `10 % 4` equals `2`.'),
      q('What is the difference between `=` and `==` in C++?', ['`=` means equal, `==` means very equal', '`=` assigns a value to a variable, `==` compares two values to see if they are the same', '`=` is for integers, `==` is for strings', 'There is no difference'], 1, 'The single equals sign assigns data into memory. The double equals sign is a logical question asking "are these two items identical?".'),
      q('What is the fastest way to add exactly 1 to an integer named `count`?', ['count = count + 1.0;', 'add(count, 1);', 'count++;', 'count + 1;'], 2, 'The increment operator `++` is the standard, optimized shorthand for adding exactly 1 to a variable\'s current state.')
    ],
    ['Integer division chops off decimals; use a double if you need precision.', 'Modulo (%) finds the remainder, perfect for even/odd logic.', 'Use shorthand like += and *= to save time and keep code clean.', 'Never confuse = (assignment) with == (comparison).']
  ),

  L(
    'cpp-04', 4, 'Conditional Logic (If/Else)', '🚦', 
    TERMINAL_NOTICE_SHORT,
    [
      { title: '1. The if Statement', beginner: 'An `if` statement allows your program to make decisions. It checks a condition inside parentheses `()`. If the condition is true, it executes the code inside the curly braces `{}`. If false, it simply skips it!', advanced: 'An `if` statement evaluates any expression to a boolean context. Non-zero integers and non-null pointers evaluate to `true`, while `0` and `nullptr` evaluate to `false`.' },
      { title: '2. The else & else if Statements', beginner: 'What if the condition is false? You can attach an `else` block to provide a backup plan. If you have multiple conditions to check in a row, you can chain them together using `else if`!', advanced: 'Chained `else if` statements form a mutually exclusive branch network. The compiler optimizes these jumps, ensuring that once a single truth condition is met, all subsequent branches in the chain are entirely bypassed.' },
      { title: '3. Logical AND (&&)', beginner: 'Sometimes a decision needs TWO things to be true at the same time. The logical AND operator `&&` connects two conditions. For example: `if (age > 18 && hasTicket == true)`.', advanced: 'C++ utilizes "short-circuit evaluation" for `&&`. If the left operand evaluates to `false`, the compiler entirely skips evaluating the right operand, which is crucial for preventing segmentation faults (e.g., checking if a pointer is null before checking its value).' },
      { title: '4. Logical OR (||) & NOT (!)', beginner: 'The logical OR operator `||` means "if THIS is true OR THAT is true, run the code". The NOT operator `!` is placed in front of a condition to reverse it. `!true` becomes `false`!', advanced: 'Similar to `&&`, the `||` operator short-circuits. If the left operand evaluates to `true`, the right operand is skipped. The `!` operator logically negates the evaluated boolean state of the expression it precedes.' }
    ],
    {
      title: 'The Theme Park Bouncer',
      intro: 'Write a program that determines if a user is allowed to ride a rollercoaster based on their height and age.',
      steps: [
        'Create `bouncer.cpp`. Declare an `int age;` and `double height;`.',
        'Ask the user for their age and height using `std::cin`.',
        'Write an `if` statement: if age is greater than or equal to 12 AND height is greater than 50.0, print "Welcome to the ride!".',
        'Add an `else if` statement: if they are too short (height < 50.0), print "Sorry, you are not tall enough yet.".',
        'Add a final `else` statement to catch any other scenario and print "Sorry, you cannot ride today.".'
      ],
      goal: 'You successfully controlled program flow using mutually exclusive conditional branches and logical operators.'
    },
    [
      q('What happens if the condition inside an `if` statement evaluates to `false`?', ['The program crashes immediately', 'The program automatically turns it into `true`', 'The compiler skips the code block inside the `if` statement and moves on', 'The program restarts'], 2, 'If the condition is false, the execution pointer skips the corresponding code block entirely.'),
      q('How do you check if BOTH condition A and condition B are true?', ['if (A || B)', 'if (A && B)', 'if (A + B)', 'if (A == B)'], 1, 'The `&&` (logical AND) operator requires both the left and right sides to be strictly true.'),
      q('What is "short-circuit evaluation" in C++?', ['When the computer gets too hot and stops running code', 'When a single line of code is written on multiple lines', 'When C++ skips evaluating the right side of an `&&` or `||` operator because the overall result is already determined by the left side', 'When an `if` statement has no `else`'], 2, 'If evaluating `(false && ...)` C++ knows the whole expression is false immediately, so it skips reading the rest of the conditions to save time and prevent errors.'),
      q('Which operator reverses a boolean value from true to false?', ['-', '!', '~', '!='], 1, 'The logical NOT operator `!` placed before a boolean or expression flips its logic.')
    ],
    ['Use if to execute code only when a specific condition is met.', 'Chain else if and else to handle backup conditions.', '&& means BOTH must be true. || means AT LEAST ONE must be true.', '! reverses the truth (e.g., !true is false).']
  ),

  L(
    'cpp-05', 5, 'Branching with Switch Statements', '🔀', 
    TERMINAL_NOTICE_SHORT,
    [
      { title: '1. The Switch Construct', beginner: 'When you have a long list of specific values to check (like a restaurant menu with choices 1, 2, and 3), writing a giant chain of `else if` statements gets messy. A `switch` statement lets you "switch" execution tracks based on a single integer or character.', advanced: 'The `switch` statement evaluates a single integral expression (int, char, enum). Compilers often heavily optimize switches by generating a "jump table" in machine code, making them significantly faster than long sequential `if-else` chains.' },
      { title: '2. Cases & Execution', beginner: 'Inside a `switch`, you define different `case` paths. If the variable matches a case, the program jumps to that line and starts running the code. E.g., `case 1: std::cout << "Pizza";`.', advanced: 'A `case` label must be a compile-time constant expression. You cannot use dynamic variables as case labels.' },
      { title: '3. The break Keyword', beginner: 'WARNING: Once a `switch` finds a matching case, it runs that code, but then it keeps running ALL the cases below it! To stop this, you MUST put the word `break;` at the end of each case to tell C++ to escape the switch.', advanced: 'This behavior is known as "fallthrough". While usually a bug for beginners, intentional fallthrough can be powerful when multiple cases need to share the exact same execution logic without duplicating code.' },
      { title: '4. The default Case', beginner: 'What if the user types a choice that isn\'t on the list? You use the `default:` case at the very bottom. It acts exactly like an `else` statement, catching anything that didn\'t match!', advanced: 'The `default` case is technically optional and can be placed anywhere within the switch block, though conventionally placed at the end. Best practices dictate always including a default case to handle unexpected integral states.' }
    ],
    {
      title: 'The Vending Machine Menu',
      intro: 'Build a text-based menu that responds to specific numeric choices using a switch statement.',
      steps: [
        'Declare an integer variable `int choice;`.',
        'Print a menu using `std::cout`: "1. Cola, 2. Water, 3. Chips".',
        'Use `std::cin` to capture the user\'s choice.',
        'Create a `switch(choice) { ... }` block.',
        'Write `case 1:`, print "Dispensing Cola", and add a `break;`.',
        'Do the same for cases 2 and 3.',
        'Add a `default:` case that prints "Invalid selection.".'
      ],
      goal: 'You successfully routed control flow using optimized jump tables and properly managed execution fallthrough with break statements.'
    },
    [
      q('What data types are allowed inside the parentheses of a `switch(x)` statement in C++?', ['Only strings (`std::string`)', 'Only floating-point numbers (`double`)', 'Integral types like integers (`int`), characters (`char`), and enums', 'Any data type'], 2, 'C++ strictly requires the expression evaluated in a switch to be of an integral or enumeration type.'),
      q('What happens if you forget to put a `break;` at the end of a matched `case`?', ['The program crashes', 'The switch statement skips to the default case', 'The program exhibits "fallthrough" and continues executing the code in the cases immediately below it', 'The compiler automatically adds a break for you'], 2, 'Without a break, execution falls right through the case boundaries and runs all subsequent code in the switch block until it hits a break or the end of the block.'),
      q('What is the role of the `default:` case in a switch statement?', ['It runs first before any other cases', 'It catches any values that did not match any of the defined cases, acting like an `else` fallback', 'It defines the default variable type', 'It deletes the variable from memory'], 1, 'The `default` case acts as the catch-all execution path if none of the specific cases evaluate to a match.'),
      q('Why might a programmer choose a `switch` statement over a long chain of `if-else` statements?', ['Switches can check for strings', 'Switches are faster because compilers optimize them into jump tables, and they are generally cleaner to read for specific discrete values', 'Switches do not require curly braces', 'Switches use less RAM'], 1, 'For many discrete checks against a single integral variable, jump tables are computationally faster and visually cleaner than sequential evaluation chains.')
    ],
    ['Use switch when checking a single integer or character against specific discrete values.', 'Always use break; at the end of a case unless you intentionally want fallthrough.', 'Include a default: case to handle unexpected inputs.', 'Switch statements cannot be used to check strings or doubles in C++.']
  ),

  L(
    'cpp-06', 6, 'Loops & Iteration', '🔄', 
    TERMINAL_NOTICE_SHORT,
    [
      { title: '1. The while Loop', beginner: 'A `while` loop is basically an `if` statement that repeats forever! As long as the condition inside the parentheses remains true, it will run the code block, jump back to the top, and do it again.', advanced: 'A `while` loop is a pre-test loop. The condition is evaluated before every single iteration. If the condition evaluates to `false` initially, the internal block is never executed.' },
      { title: '2. The Danger of Infinite Loops', beginner: 'If you create a `while` loop but never change the condition inside it, it will loop forever and crash your computer! You must ensure there is some logic inside the loop (like adding to a counter) that eventually makes the condition false.', advanced: 'An infinite loop (e.g., `while(true)`) blocks the main thread of execution permanently. Without an explicit escape trigger or operating system interrupt, the process will consume CPU resources indefinitely.' },
      { title: '3. The do-while Loop', beginner: 'A `do-while` loop is unique. It runs the code block FIRST, and THEN checks the condition at the very bottom. This guarantees the code runs at least one single time, no matter what!', advanced: 'A `do-while` loop is a post-test loop. It is highly useful in scenarios like user input validation, where you must prompt the user for data at least once before validating if the data requires reprompting.' },
      { title: '4. The for Loop', beginner: 'The `for` loop is the ultimate counter. It packs three things into one line: a starting variable, a condition, and an incrementer. E.g., `for(int i = 0; i < 10; i++)`. It is perfect for when you know exactly how many times you want to loop.', advanced: 'The `for` loop structure initializes a localized variable that exists strictly within the loop\'s scope, evaluates the test condition before the block, and processes the increment statement after the block completes.' }
    ],
    {
      title: 'The Number Guessing Game',
      intro: 'Build a game that forces the user to guess a secret number using a while loop.',
      steps: [
        'Declare a variable `int secret = 7;` and `int guess = 0;`.',
        'Create a `while` loop with the condition `(guess != secret)`.',
        'Inside the loop, print "Guess the secret number: " and use `std::cin` to capture `guess`.',
        'Still inside the loop, add an `if` statement: if `guess != secret`, print "Wrong, try again!".',
        'Outside and below the loop, print "You won!". This line will only run once the loop is escaped.'
      ],
      goal: 'You successfully utilized dynamic iteration logic to block program execution until a specific user input condition was met.'
    },
    [
      q('What is the main structural difference between a `while` loop and a `do-while` loop?', ['`while` loops are used for math, `do-while` loops are used for text', 'A `do-while` loop evaluates the condition at the end, guaranteeing the code executes at least once. A `while` loop checks the condition first', 'A `while` loop is faster', 'There is no difference'], 1, 'Because the `do-while` evaluates at the bottom (post-test), the internal block is guaranteed to run an initial time regardless of the condition.'),
      q('What causes an "Infinite Loop"?', ['Using a `for` loop instead of a `while` loop', 'Creating a loop where the truth condition is never modified to evaluate as false, trapping execution forever', 'Having too many variables inside the loop', 'Using the `break` keyword'], 1, 'If the condition never becomes false (e.g., you forget to increment a counter), the loop will run infinitely and lock the program.'),
      q('In the statement `for(int i = 0; i < 5; i++)`, what does `i++` do?', ['It checks if `i` is positive', 'It initializes `i` to zero', 'It increments (adds 1 to) `i` at the end of every loop iteration', 'It prints `i` to the screen'], 2, 'The third parameter of a `for` loop dictates how the control variable changes after every single pass through the block.'),
      q('What keyword allows you to manually force an exit out of a loop immediately, ignoring the condition?', ['stop', 'exit', 'break', 'return'], 2, 'The `break` keyword immediately halts iteration and jumps the execution pointer completely out of the active loop structure.')
    ],
    ['Use while when you don\'t know how many times the loop needs to run.', 'Use for when you know the exact number of iterations.', 'do-while guarantees the code will run at least once.', 'Always ensure your loops have a way to finish (avoid infinite loops).']
  ),

  L(
    'cpp-07', 7, 'Functions & Scope', '🛠️', 
    TERMINAL_NOTICE_SHORT,
    [
      { title: '1. Modularizing Code', beginner: 'Instead of writing hundreds of lines of code inside `main()`, we can create our own custom mini-programs called "Functions". You write a function once, name it, and then you can "call" it as many times as you want!', advanced: 'Functions allow for functional decomposition. By isolating logic into distinct operational blocks, you reduce redundancy, increase maintainability, and isolate memory scope on the call stack.' },
      { title: '2. Return Types & Parameters', beginner: 'Every function needs a Return Type (what it gives back) and Parameters (what it takes in). E.g., `int addNumbers(int a, int b)`. This means "I take in two integers, and I promise to hand you an integer back." If a function gives nothing back, its return type is `void`.', advanced: 'The parameters defined in the function signature dictate the exact memory footprint allocated on the stack frame when the function is invoked. A `void` return type omits the return instruction payload in assembly.' },
      { title: '3. Forward Declarations', beginner: 'C++ reads your file from top to bottom. If you call a function in `main()` but you wrote the function underneath `main()`, C++ will crash because it hasn\'t seen it yet! You fix this by writing the function\'s "signature" at the very top of the file as a promise.', advanced: 'Forward declarations (function prototypes) inform the compiler of the function\'s signature (name, return type, parameters) prior to definition, allowing the linker to safely resolve the memory addresses later during compilation.' },
      { title: '4. Variable Scope', beginner: 'Variables created inside a function are strictly trapped inside that function! If you make `int x = 5;` inside `main()`, a different function cannot see or use `x`. This is called "Local Scope".', advanced: 'Local scope variables are pushed onto the active function\'s stack frame. When the function returns and the stack frame pops, all localized variables are automatically destroyed, freeing the memory.' }
    ],
    {
      title: 'The Math Calculator Module',
      intro: 'Create a custom function to handle mathematical operations outside of the main function.',
      steps: [
        'Above your `main()` function, define a new function: `int multiply(int x, int y) { ... }`.',
        'Inside that function, write `return x * y;`.',
        'Inside your `main()` function, declare an integer: `int result = multiply(5, 4);`.',
        'Use `std::cout` to print `result`.',
        'Call the function again with different numbers and print it directly: `std::cout << multiply(10, 10);`.'
      ],
      goal: 'You successfully abstracted logic into a reusable block, managed parameters, and returned computed values back to the calling scope.'
    },
    [
      q('What does a `void` return type mean?', ['The function returns a boolean true or false', 'The function returns a massive string', 'The function does not return any data back to where it was called from', 'The function is broken'], 2, '`void` indicates the function strictly performs an action (like printing to a screen) without returning any payload data.'),
      q('Why might C++ give you an error if you define a custom function directly below `main()`?', ['Because functions cannot be below main', 'Because C++ reads sequentially from top to bottom. If main() calls the function before seeing its definition or prototype, the compiler throws an "undeclared identifier" error', 'Because main() deletes all other functions', 'Because it violates variable scope'], 1, 'The compiler needs a forward declaration (prototype) at the top of the file to know the function exists before it encounters it in the main flow.'),
      q('What is Variable Scope in C++?', ['The total size of a variable on the hard drive', 'The rule that variables declared inside a set of curly braces (like a function) are only visible and accessible within those braces', 'A tool used to zoom in on code', 'The maximum number a variable can hold'], 1, 'Scope defines visibility. Variables declared inside a local block (function/loop) are invisible to the rest of the program.'),
      q('In the function signature `int calculate(double a, double b)`, what data type does this function promise to return?', ['double', 'calculate', 'int', 'void'], 2, 'The very first word in a function signature (`int`) explicitly defines the return type.')
    ],
    ['Functions organize your code into reusable, labeled blocks.', 'A function takes in arguments (parameters) and hands back a result (return type).', 'Use void if the function just performs an action and returns nothing.', 'Variables created inside a function cannot be seen by other functions.']
  ),

  L(
    'cpp-08', 8, 'Fixed-Size Collections (Arrays)', '📚', 
    TERMINAL_NOTICE_SHORT,
    [
      { title: '1. What is an Array?', beginner: 'Imagine you need to store 100 test scores. Creating 100 separate variables (`score1`, `score2`...) is terrible! An array is a single variable that holds a list of items of the same type. E.g., `int scores[5] = {90, 85, 80, 95, 100};`.', advanced: 'A C-style array is a contiguous block of memory allocated specifically for a fixed number of homogeneous elements. The array variable itself essentially decays into a pointer to the memory address of the first element.' },
      { title: '2. Zero-Based Indexing', beginner: 'To access a specific item in an array, you use square brackets `[]`. But remember, computers start counting at ZERO, not one! To get the very first item in the `scores` array, you ask for `scores[0]`.', advanced: 'The index represents an address offset. `scores[2]` instructs the compiler to take the base memory address of the array, calculate an offset of 2 integer sizes (usually 2 * 4 bytes), and fetch the data at that exact location.' },
      { title: '3. Fixed Memory Constraints', beginner: 'Standard C++ arrays are extremely rigid. When you create `int numbers[10];`, you are telling the computer "give me exactly 10 boxes". You CANNOT add an 11th box later. It is permanently locked at that size!', advanced: 'Because standard arrays are allocated on the stack at compile-time (or fixed heap size), their dimensions must be constant. C++ does not perform automatic bounds checking, making arrays dangerous if indexing limits are breached.' },
      { title: '4. Iterating with Loops', beginner: 'Arrays and `for` loops are best friends! You can use a `for` loop to easily step through every item in an array one by one by passing the loop\'s counter variable directly into the array brackets.', advanced: 'Iteration utilizes the counter integer as the dynamic index offset. Modern C++ also offers Range-Based For Loops (e.g., `for (int val : scores)`) to automatically iterate through bounds safely.' }
    ],
    {
      title: 'The Grade Book Iteration',
      intro: 'Create an array of grades and use a for loop to calculate the total sum of all grades.',
      steps: [
        'Inside `main()`, declare an array: `int grades[4] = {85, 92, 78, 90};`.',
        'Declare an integer to hold the total: `int sum = 0;`.',
        'Create a `for` loop starting at `int i = 0;`, going up to `i < 4;`, incrementing by `i++`.',
        'Inside the loop, add the current array item to the sum: `sum += grades[i];`.',
        'Outside the loop, use `std::cout` to print the final calculated sum.'
      ],
      goal: 'You successfully initialized contiguous memory structures and dynamically processed the elements using iterative address offsets.'
    },
    [
      q('If you declare an array `int cars[5];`, what is the index of the last element in the array?', ['5', '4', '1', '6'], 1, 'Because C++ uses zero-based indexing, an array of size 5 has indexes 0, 1, 2, 3, and 4. Accessing index 5 goes out of bounds.'),
      q('What happens if you try to add a 6th item to an array that was created with a size of 5?', ['The array automatically grows larger', 'The compiler creates a second array automatically', 'It causes an out-of-bounds memory error which can lead to severe program crashes or data corruption', 'The 6th item replaces the 1st item'], 2, 'Standard C-style arrays have fixed bounds and zero safety checks. Writing beyond bounds corrupts neighboring memory addresses.'),
      q('Which loop is most commonly paired with an array to iterate over its elements?', ['A do-while loop', 'A for loop', 'A switch statement', 'An infinite while loop'], 1, 'A `for` loop provides a clean, localized counter variable that perfectly aligns with sequential array index numbers.'),
      q('How does the compiler technically handle array indexing under the hood?', ['It searches through a text file', 'It calculates a memory offset by multiplying the index by the byte size of the data type and adding it to the base address', 'It asks the operating system to find the data', 'It converts the array into a string'], 1, 'Indexing `arr[3]` is mathematical: Base Address + (3 * sizeof(type)).')
    ],
    ['Arrays store multiple items of the SAME data type in a single row.', 'C++ arrays start counting at zero (index 0 is the first item).', 'Standard arrays cannot change their size once created.', 'Use a for loop to quickly iterate through every index of an array.']
  ),

  L(
    'cpp-09', 9, 'Introduction to Pointers', '🎯', 
    TERMINAL_NOTICE_SHORT,
    [
      { title: '1. The Memory Address Operator (&)', beginner: 'When you create a variable like `int age = 20;`, the computer stores the number 20 in a physical location inside your RAM. You can actually see the exact physical address of that box by putting an ampersand `&` in front of the variable: `&age`. It looks like a crazy hex code (e.g., 0x7ffe4)!', advanced: 'The `&` (address-of) operator retrieves the literal hexadecimal memory address of a variable in the active execution stack frame.' },
      { title: '2. What is a Pointer? (*)', beginner: 'A pointer is just a special type of variable that stores MEMORY ADDRESSES instead of normal data. To create a pointer that points to an integer, you use a star `*`. E.g., `int* pAge = &age;`. Now `pAge` acts as a direct GPS coordinate to your `age` variable.', advanced: 'Pointers are strongly typed (`int*`, `double*`) because the compiler needs to know exactly how many bytes to step over when navigating pointer arithmetic, and how to format the data it accesses at that address.' },
      { title: '3. Dereferencing a Pointer (*)', beginner: 'If you have a GPS coordinate (a pointer), how do you actually look inside the box to see the data? You use the star `*` again! Putting a star in front of a pointer is called "Dereferencing". `std::cout << *pAge;` will print `20`.', advanced: 'The dereference operator `*` accesses the value stored in the memory location that the pointer holds. Modifying a dereferenced pointer directly mutates the original variable\'s memory block.' },
      { title: '4. Why use Pointers?', beginner: 'Pointers are what make C++ incredibly fast and powerful. Instead of handing a giant 500-page book (a massive variable) to a friend and making a heavy photocopy, you just hand them a tiny sticky note with the GPS address of where the book is located!', advanced: 'Pointers eliminate massive overhead during function calls (pass-by-address instead of pass-by-value), allow direct hardware manipulation, and are the fundamental requirement for dynamic heap allocation.' }
    ],
    {
      title: 'The Memory Inspector',
      intro: 'Create a pointer to track a variable, print the raw memory addresses, and change the data remotely using dereferencing.',
      steps: [
        'Declare an integer: `int ammo = 100;`.',
        'Print the raw memory address of ammo using the `&` operator.',
        'Declare a pointer that stores that address: `int* pAmmo = &ammo;`.',
        'Use the dereference operator to print the value inside the pointer: `std::cout << *pAmmo;`.',
        'Now, change the value of ammo through the pointer: `*pAmmo = 50;`.',
        'Print the original `ammo` variable. Notice how it magically changed to 50!'
      ],
      goal: 'You successfully exposed memory addresses, instantiated a pointer, and remotely mutated localized stack memory via dereferencing.'
    },
    [
      q('What does the address-of operator `&` do in C++?', ['It adds two strings together', 'It fetches the physical hexadecimal memory location where a variable is stored in RAM', 'It deletes the variable', 'It creates a pointer'], 1, 'The ampersand `&` placed before a variable yields its explicit location address in memory.'),
      q('What is a Pointer?', ['A variable that stores a memory address', 'A variable that stores only text', 'A function that returns nothing', 'A loop that runs forever'], 0, 'Pointers are special variables strictly designed to hold GPS-like memory addresses linking to other data.'),
      q('What happens when you "dereference" a pointer using the `*` operator (e.g., `*pX`)?', ['It deletes the pointer', 'It reveals the memory address of the pointer itself', 'It reaches into the memory address stored in the pointer and interacts with the actual data inside', 'It causes the program to crash'], 2, 'Dereferencing follows the pointer\'s stored address to evaluate or mutate the raw data located at that specific coordinate.'),
      q('Why are pointers highly efficient when dealing with massive data structures?', ['They compress the data automatically', 'Instead of copying massive amounts of data in memory, a pointer simply passes a tiny address, saving massive amounts of RAM and CPU time', 'They turn C++ code into Python code', 'They allow variables to have no data type'], 1, 'Passing data by value forces the system to make heavy duplicate copies. Passing a pointer just hands over a lightweight 8-byte address.')
    ],
    ['Use &var to find out EXACTLY where a variable lives in RAM.', 'A pointer (int* pVar) is a variable that stores a memory address.', 'Use *pVar (dereferencing) to remotely view or change the data at that address.', 'Pointers save memory and speed up your program by avoiding heavy data copies.']
  ),

  L(
    'cpp-10', 10, 'References & Stack vs. Heap', '🧠', 
    TERMINAL_NOTICE_SHORT,
    [
      { title: '1. What is a Reference? (&)', beginner: 'Pointers can be confusing with all the stars and ampersands. C++ introduced "References" to make it easier. A reference is just an alias—a nickname—for an existing variable. If you say `int& refAge = age;`, `refAge` is now the EXACT same box as `age`.', advanced: 'A reference acts as an implicit, immutable pointer. Once bound to a variable upon declaration, it cannot be reassigned to alias a different memory address, offering safety that raw pointers lack.' },
      { title: '2. Pass-by-Reference', beginner: 'When you pass a variable into a function normally, C++ makes a complete COPY of it. If the function changes it, your original variable is safe. But if you pass it as a reference (`void add(int& x)`), the function gets a direct link and CAN permanently change your original variable!', advanced: 'Passing by reference avoids the overhead of copy constructors for heavy objects. It allows functions to mutate state across scope boundaries cleanly without the syntactic burden of dereferencing pointers.' },
      { title: '3. The Stack (Automatic Memory)', beginner: 'Imagine the Stack as a neat, small desk. Whenever you create normal variables (like `int x = 5;`), C++ puts them on the desk. When a function finishes, C++ automatically sweeps the desk clean and deletes them. It is fast, safe, but limited in size.', advanced: 'Stack allocation handles contiguous, LIFO (Last-In-First-Out) memory management. It is incredibly fast because allocation/deallocation strictly involves adjusting the stack pointer, but a "Stack Overflow" occurs if you exceed the OS limit.' },
      { title: '4. The Heap (Dynamic Memory)', beginner: 'The Heap is a giant warehouse outside. If you need a massive amount of space, you ask C++ to put it in the warehouse using the word `new`. BUT, C++ will NOT clean the warehouse for you! You must manually delete it using `delete`, or your computer runs out of memory (a memory leak)!', advanced: 'Heap (dynamic) allocation occurs at runtime. The OS allocates fragmented blocks of memory on request. Because it is unmanaged in C/C++, failure to explicitly `delete` dynamically allocated memory results in severe Memory Leaks.' }
    ],
    {
      title: 'The Swap Function',
      intro: 'Write a function that swaps the values of two variables using Pass-by-Reference.',
      steps: [
        'Above `main()`, create a function: `void swap(int& a, int& b) { ... }`. Notice the `&` symbols!',
        'Inside the function, declare a temporary integer: `int temp = a;`.',
        'Set `a = b;`.',
        'Set `b = temp;`.',
        'Inside `main()`, declare `int x = 10;` and `int y = 20;`.',
        'Call `swap(x, y);` and then print `x` and `y`. They should now be reversed!'
      ],
      goal: 'You successfully bypassed localized scope restrictions by passing stack variable aliases, allowing remote mutation without pointer syntax.'
    },
    [
      q('What is a Reference in C++?', ['A copy of a variable', 'An alias (nickname) that points to the exact same memory location as an existing variable', 'A pointer that can change its address', 'A new data type for text'], 1, 'References are syntactically simpler implicit pointers. They bind directly to an existing variable upon creation.'),
      q('What happens when you pass a variable to a function by "Reference" instead of by "Value"?', ['The function receives a clone of the data', 'The function receives direct access to the original variable, meaning any changes made inside the function will permanently alter the original variable', 'The function crashes', 'The function changes the data type to a string'], 1, 'Pass-by-value copies data. Pass-by-reference shares the exact same memory space, enabling cross-scope mutation.'),
      q('What is the key difference between Stack memory and Heap memory?', ['Stack memory is slow, Heap memory is fast', 'Stack variables are automatically cleaned up when they go out of scope. Heap variables require manual cleanup using `delete`', 'Stack memory is used for hard drives, Heap memory is for RAM', 'There is no difference'], 1, 'The Stack utilizes automatic lifetime scope destruction. The Heap requires manual memory management by the programmer.'),
      q('What is a "Memory Leak"?', ['When water gets into your computer motherboard', 'When variables are copied too many times', 'When you allocate memory on the Heap using `new`, but forget to clean it up using `delete`, causing the computer to permanently lose that chunk of RAM', 'When an array gets too big'], 2, 'Memory leaks occur when dynamic memory is orphaned. The program loses the pointer to the heap block, preventing the OS from ever reclaiming that RAM.')
    ],
    ['A reference (&) acts as a permanent nickname/alias for an existing variable.', 'Pass-by-reference allows functions to directly modify your original variables.', 'The Stack is fast and cleans up automatically. The Heap is massive but requires manual cleanup.', 'Using the word "new" creates data on the Heap. You must always use "delete" when finished to prevent Memory Leaks.']
  ),

  
 L(
    'cpp-11', 11, 'Custom Data Types (Structs)', '🏗️', 
    TERMINAL_NOTICE_SHORT + 'Up until now, you have used built-in containers like int and double. But what if you need to store a "Player" that has a name, a health score, and a position? Creating 3 separate variables for every player is a nightmare. Structs allow you to bundle different data types together into a single, custom super-variable.',
    [
      { title: '1. Defining a Struct', beginner: 'You define a struct outside of main(). Think of it as a blueprint. `struct Player { std::string name; int health; };`. You haven\'t created a player yet; you just taught C++ what a "Player" looks like!', advanced: 'A `struct` in C++ is a user-defined type. By default, all members of a struct are public. It dictates the memory layout of the bundled variables, padding them according to architecture alignment requirements.' },
      { title: '2. Creating Struct Instances', beginner: 'Once the blueprint is made, you can create actual variables using it inside main(): `Player p1;`. Now `p1` is a single variable that holds both a name and health inside it!', advanced: 'Instantiating a struct allocates a contiguous block of memory on the stack large enough to hold all its member variables, accounting for byte alignment.' },
      { title: '3. Member Access Operator (.)', beginner: 'To look inside your struct variable and change its data, use a period `.`. E.g., `p1.name = "Hero";` and `p1.health = 100;`.', advanced: 'The dot operator `.` resolves the memory offset of the specific member variable relative to the base address of the struct instance.' },
      { title: '4. Arrays of Structs', beginner: 'You can create an array of your new custom type! `Player team[5];` gives you 5 players. You can access them like this: `team[0].health = 100;`.', advanced: 'An array of structs creates a dense, contiguous array of these composite types. This layout is highly cache-friendly for performance-critical loops.' }
    ],
    {
      title: 'The NPC Generator',
      intro: 'Create a custom struct for a Non-Player Character (NPC) and instantiate it.',
      steps: [
        'Above `main()`, define a `struct NPC { std::string name; int level; };`.',
        'Inside `main()`, create an instance: `NPC guard;`.',
        'Use the dot operator to assign: `guard.name = "City Watch";` and `guard.level = 15;`.',
        'Print out a greeting using the struct\'s data: "Halt! I am " + name + " (Level " + level + ")".'
      ],
      goal: 'You successfully defined a custom composite data type and instantiated it to manage grouped variables.'
    },
    [
      q('What is a Struct in C++?', ['A function that returns multiple values', 'A built-in data type for math', 'A user-defined blueprint that groups multiple variables of different data types into a single unit', 'A type of loop'], 2, 'Structs bundle related variables (like an int, double, and string) into one cohesive block of data.'),
      q('Which operator is used to access or modify the internal variables of a struct instance?', ['->', '*', '.', '&'], 2, 'The dot operator `.` allows you to reach inside the instantiated struct and access its specific members.'),
      q('Where should you typically define the blueprint for a struct?', ['Inside a for loop', 'Outside and above the `main()` function, so the compiler knows about the custom type before it is used', 'At the very end of the file', 'Inside a string'], 1, 'Like forward declarations, the compiler must see the struct definition before it can allocate memory for it in main().'),
      q('If you have `struct Car { int speed; };` and create `Car myCar;`, how do you set the speed to 60?', ['Car(60);', 'myCar = 60;', 'myCar.speed = 60;', 'speed.myCar = 60;'], 2, 'You must reference the specific instance (`myCar`), use the dot operator, and then target the member variable (`speed`).')
    ],
    ['Structs allow you to bundle multiple different variables into one custom type.', 'Define your struct blueprints above main().', 'Use the dot operator (.) to read or change a struct\'s internal data.', 'You can create arrays of structs to manage massive lists of grouped data efficiently.']
  ),

  L(
    'cpp-12', 12, 'Classes & Objects (OOP)', '🏭', 
    TERMINAL_NOTICE_SHORT + 'Structs are great for grouping data, but what if we want to group data AND the functions that manipulate that data together? Welcome to Object-Oriented Programming (OOP). Classes are the ultimate blueprints. They don\'t just store data; they define behaviors!',
    [
      { title: '1. What is a Class?', beginner: 'A Class is a super-struct. Instead of just holding variables (Attributes), it also holds functions (Methods). If a `Car` is a class, its attributes are `speed` and `color`, and its methods are `drive()` and `brake()`.', advanced: 'A Class is the fundamental building block of OOP in C++. The only technical difference between a struct and a class in C++ is default visibility: struct members are public by default, while class members are private.' },
      { title: '2. Objects (Instantiation)', beginner: 'A Class is just a blueprint on a piece of paper. You can\'t drive a blueprint! An "Object" is the actual car built from that blueprint. E.g., `Car myCar;` creates an Object from the `Car` class.', advanced: 'Instantiation is the process of allocating memory for a class object. Each object maintains its own distinct state (instance variables) in memory.' },
      { title: '3. Attributes (Member Variables)', beginner: 'Variables inside a class are called Attributes. Every object you create gets its own unique set of attributes. My car can be red, while your car can be blue, even though they came from the same blueprint.', advanced: 'Non-static member variables are allocated per instance. Static member variables exist once at the class level and are shared among all instances.' },
      { title: '4. Methods (Member Functions)', beginner: 'Functions written inside a class are called Methods. You call them using the dot operator just like data! `myCar.drive();`.', advanced: 'Member functions possess an implicit parameter, the `this` pointer, which points to the memory address of the specific object invoking the method.' }
    ],
    {
      title: 'Your First Class',
      intro: 'Transition from structs to classes by building a simple Robot blueprint.',
      steps: [
        'Above `main()`, declare `class Robot { public: std::string name; void sayHi() { std::cout << "Beep boop!"; } };`.',
        'Notice the word `public:`! (We will explain this in the next lesson).',
        'Inside `main()`, instantiate an object: `Robot r1;`.',
        'Set the name: `r1.name = "Wall-E";`.',
        'Call the object\'s method: `r1.sayHi();`.'
      ],
      goal: 'You successfully transitioned to OOP by defining a class with both state (variables) and behavior (methods).'
    },
    [
      q('What is the primary difference between a Class and an Object?', ['They are the same thing', 'A Class is the theoretical blueprint; an Object is the physical instance created from that blueprint', 'A Class is for numbers, an Object is for text', 'An Object is the blueprint, a Class is the instance'], 1, 'The Class defines what the entity is and does. The Object is the actual allocated data residing in memory.'),
      q('What do we call a function that is defined inside a class?', ['A global function', 'A struct', 'A method (or member function)', 'An attribute'], 2, 'Functions bound to a specific class blueprint are referred to as Methods or Member Functions.'),
      q('If you create two objects from the same `BankAccount` class, do they share the same account balance?', ['Yes, they share all memory', 'No, each instantiated object maintains its own independent set of member variables (attributes)', 'Only if they are in an array', 'Yes, unless you delete one'], 1, 'Every object gets its own distinct memory block for its state. One account can have $50 while the other has $100.'),
      q('How do you trigger a method named `jump()` on an object named `player1`?', ['jump(player1);', 'player1.jump();', 'player1->jump;', 'jump.player1();'], 1, 'You use the dot operator on the object instance, followed by the method name and parentheses.')
    ],
    ['A Class is a blueprint that groups variables (attributes) AND functions (methods).', 'An Object is a concrete instance built from a Class blueprint.', 'Every Object maintains its own independent state (variable values).', 'Use the dot operator to trigger an object\'s custom methods.']
  ),

  L(
    'cpp-13', 13, 'Encapsulation & Access Modifiers', '🛡️', 
    TERMINAL_NOTICE_SHORT + 'In a video game, you wouldn\'t want a player to be able to type `player.health = 999999;` and cheat! We need to protect our class data from the outside world. This concept of locking down data and controlling how it is accessed is called Encapsulation.',
    [
      { title: '1. Private Access Modifier', beginner: 'By default, everything inside a C++ class is strictly `private`. This means nothing outside the class (like `main()`) can see or touch those variables. It is an impenetrable safe!', advanced: 'Private access restricts visibility strictly to the class\'s own member functions and explicitly declared `friend` classes/functions.' },
      { title: '2. Public Access Modifier', beginner: 'To allow the outside world to interact with your class, you use the `public:` label. Anything written under `public:` can be accessed normally from `main()` using the dot operator.', advanced: 'Public members define the API (Application Programming Interface) of your class. Best practice dictates keeping state (variables) private and exposing behavior (methods) publicly.' },
      { title: '3. Getters (Accessors)', beginner: 'If a variable like `health` is locked in the private safe, how do we read it? We create a public function called a "Getter". E.g., `int getHealth() { return health; }`. Now `main()` can safely ask for the value without being able to arbitrarily change it!', advanced: 'Getters should typically be marked with the `const` qualifier (e.g., `int getHealth() const;`) to guarantee to the compiler that calling this method will not mutate the object\'s state.' },
      { title: '4. Setters (Mutators)', beginner: 'To safely change a private variable, we use a "Setter". E.g., `void setHealth(int h)`. Why do this? Because inside the setter, you can add rules! E.g., `if (h < 0) health = 0; else health = h;`. This stops negative health bugs!', advanced: 'Setters enforce class invariants and encapsulate validation logic, preventing the object from entering an invalid or undefined state.' }
    ],
    {
      title: 'The Secure Bank Account',
      intro: 'Protect a bank balance using encapsulation, ensuring no one can set it to a negative number.',
      steps: [
        'Create a `class BankAccount { ... };`.',
        'Inside, create a `private:` section with `double balance = 0.0;`.',
        'Create a `public:` section.',
        'Add a getter: `double getBalance() { return balance; }`.',
        'Add a setter: `void deposit(double amount)`. Inside it, write an `if` statement so it only adds to the balance if the amount is greater than 0.',
        'In `main()`, try to access `.balance` directly (it will error!). Then use your setter and getter to safely manage the money.'
      ],
      goal: 'You successfully encapsulated sensitive state data and enforced strict mutation rules using public accessors and mutators.'
    },
    [
      q('What is the default access modifier for members of a C++ `class` if you don\'t specify one?', ['public', 'protected', 'private', 'global'], 2, 'Unlike structs which default to public, class members are completely locked down (private) by default in C++.'),
      q('What is the main purpose of Encapsulation in Object-Oriented Programming?', ['To make the code run faster', 'To bundle data and methods together and hide the internal state, preventing unauthorized direct modification', 'To allow multiple classes to merge', 'To delete unused variables'], 1, 'Encapsulation protects the integrity of an object by forcing the outside world to interact with it strictly through approved public methods.'),
      q('Why use a Setter method instead of just making the variable public?', ['Setters are required by the compiler', 'Setters allow you to add validation logic (like checking bounds) before actually modifying the internal data', 'Setters use less memory', 'Variables cannot be public in C++'], 1, 'A setter acts as a gatekeeper. It can intercept bad data (like negative age or negative money) and reject it before the internal state is corrupted.'),
      q('What does a Getter method typically do?', ['Changes the variable to zero', 'Returns a copy of the private variable\'s current value to the outside world', 'Deletes the variable', 'Creates a new object'], 1, 'Getters simply "get" the data and hand it back, providing read-only access to a private attribute.')
    ],
    ['By default, everything in a C++ class is private and locked away.', 'Use the public: label to expose methods to the outside world.', 'Keep variables private, and use public Getters to read them.', 'Use Setters to change private variables safely by adding validation rules.']
  ),

  L(
    'cpp-14', 14, 'Constructors & Destructors', '🏗️', 
    TERMINAL_NOTICE_SHORT + 'When an object is born (instantiated), you usually want to set up its initial data immediately. You don\'t want a player spawning into the game with zero health! Constructors are special functions that run automatically the exact millisecond an object is created.',
    [
      { title: '1. The Default Constructor', beginner: 'A Constructor is a method that has the EXACT SAME NAME as the class and has NO return type (not even void). `class Player { public: Player() { health = 100; } };`. Now, every time you type `Player p1;`, they get 100 health automatically!', advanced: 'If you do not explicitly define any constructor, the C++ compiler implicitly generates a default, parameterless constructor. However, if you define any custom constructor, the implicit one is suppressed.' },
      { title: '2. Parameterized Constructors', beginner: 'You can pass data into a constructor right when you create the object! `Player(std::string n) { name = n; }`. To use it in main: `Player p1("Arthur");`. This forces anyone making a Player to provide a name!', advanced: 'Parameterized constructors allow for Constructor Overloading. You can define multiple constructors with different parameter signatures to offer various initialization pathways.' },
      { title: '3. Member Initializer Lists', beginner: 'There is a faster way to assign data in a constructor. Instead of writing it inside the brackets, you can use a colon: `Player(int h) : health(h) {}`. This is the preferred C++ way to initialize attributes!', advanced: 'Initializer lists are significantly more efficient. They initialize the member directly during allocation, rather than default-constructing it and then explicitly assigning a new value in the constructor body. For constant (`const`) or reference members, initializer lists are mandatory.' },
      { title: '4. The Destructor (~)', beginner: 'If a Constructor runs when an object is born, a Destructor runs when an object dies (gets deleted or the function ends). It has a tilde in front: `~Player() { ... }`. It is used to clean up messy data!', advanced: 'The Destructor handles cleanup tasks, primarily `delete`-ing dynamically allocated heap memory to prevent memory leaks. The compiler automatically invokes it when an object goes out of scope.' }
    ],
    {
      title: 'The Database Connection',
      intro: 'Simulate opening and closing a database connection using Constructors and Destructors.',
      steps: [
        'Create a `class Database { ... };`.',
        'Add a public Constructor: `Database() { std::cout << "Database Opened!"; }`.',
        'Add a public Destructor: `~Database() { std::cout << "Database Closed!"; }`.',
        'Inside `main()`, create a scope block using plain curly braces `{ ... }`.',
        'Inside those braces, instantiate `Database db;`.',
        'Run the program. You will see it open, and then immediately close as soon as it hits the closing brace and goes out of scope!'
      ],
      goal: 'You successfully managed an object\'s automated lifecycle, executing initialization and teardown logic implicitly based on scope.'
    },
    [
      q('What is unique about the syntax of a Constructor function?', ['It must be named `init()`', 'It must return a boolean', 'It shares the exact name of the Class and has absolutely no return type defined', 'It can only take one parameter'], 2, 'Constructors are strictly identified by matching the class name identically and omitting return types (even void).'),
      q('When does a Constructor execute?', ['When you manually call `obj.Constructor()`', 'Automatically, at the exact moment the object is instantiated into memory', 'Right before the program ends', 'Only when variables are modified'], 1, 'Constructors are lifecycle hooks that the compiler automatically invokes during memory allocation to initialize the state.'),
      q('What is the purpose of a Member Initializer List?', ['To create an array inside a class', 'To initialize member variables more efficiently before the constructor body even executes', 'To delete variables', 'To list out all functions'], 1, 'It directly constructs the member variables with the provided values, avoiding a double-operation of default construction followed by reassignment.'),
      q('How is a Destructor function denoted in C++?', ['Using the `delete` keyword', 'Using a tilde `~` before the class name', 'Using the `-` minus sign', 'Using `end()`'], 1, 'The tilde (`~ClassName()`) defines the destructor, which the compiler calls automatically when the object is destroyed.')
    ],
    ['Constructors run automatically when an object is created to set up initial data.', 'A Constructor shares the exact same name as the class and has no return type.', 'You can pass parameters to a constructor to force custom setups (e.g., passing a name).', 'Destructors (~Class) run automatically when an object dies to clean up memory.']
  ),

  L(
    'cpp-15', 15, 'Class Methods & The \'this\' Pointer', '👉', 
    TERMINAL_NOTICE_SHORT + 'As your classes grow, your code can get messy. Best practice in C++ is to separate the "What it does" (Declaration) from the "How it does it" (Definition). Also, what happens if your function parameter has the exact same name as your class attribute? You need the `this` pointer!',
    [
      { title: '1. Separation of Definition', beginner: 'Instead of writing long functions inside the class blueprint, we just write the promise: `void attack();`. Then, entirely outside the class, we write the actual code using the Scope Resolution Operator `::`. E.g., `void Player::attack() { ... }`.', advanced: 'In real-world C++, the class declaration is placed in a Header file (`.h` / `.hpp`), and the implementation (definitions using `::`) is placed in a Source file (`.cpp`). This drastically improves compilation times.' },
      { title: '2. The Scope Resolution Operator (::)', beginner: 'The double colon `::` basically tells the compiler "This function belongs to that class over there." It maps the external code back to the original blueprint.', advanced: 'The `::` operator resolves naming scope. It explicitly qualifies a member, telling the linker which namespace or class a specific identifier resides in.' },
      { title: '3. Name Shadowing', beginner: 'Imagine your class has a private variable `int health`. Your setter is `void setHealth(int health)`. Now you have two variables named `health`! If you write `health = health;`, C++ gets confused. This is called Name Shadowing.', advanced: 'When a local variable or parameter shares an identical identifier with a member variable, the local scope shadows (hides) the class scope member.' },
      { title: '4. The \'this\' Pointer', beginner: 'To fix Name Shadowing, use the `this` keyword! `this->health` explicitly means "The health variable belonging to THIS specific object." So you write `this->health = health;`. (The parameter value goes into the object\'s value).', advanced: '`this` is an implicit, constant pointer passed to all non-static member functions. It holds the memory address of the specific object instance invoking the function. You use the `->` operator because `this` is a pointer, not a direct value.' }
    ],
    {
      title: 'The Confused Parameter',
      intro: 'Resolve a name shadowing conflict using the this pointer and separate your function definition.',
      steps: [
        'Create a `class Monster { private: int power; public: void setPower(int power); };`.',
        'Outside the class, define the function using `::`: `void Monster::setPower(int power) { ... }`.',
        'Inside the function body, resolve the naming conflict: `this->power = power;`.',
        'In `main()`, instantiate a Monster and set its power!'
      ],
      goal: 'You successfully separated class declarations from definitions using scope resolution, and navigated identifier shadowing via the `this` pointer.'
    },
    [
      q('What is the purpose of the Scope Resolution Operator `::` when defining class methods?', ['To create an array', 'To connect a method implementation written outside the class back to its original class declaration', 'To delete a method', 'To make variables public'], 1, 'It qualifies the function name, e.g., `ClassName::methodName()`, ensuring the compiler knows exactly which class owns this specific logic.'),
      q('Why might developers prefer to write method bodies outside of the class block?', ['Because it runs faster', 'To keep the class declaration clean, readable, and focused strictly on the blueprint structure, paving the way for Header/Source file splitting', 'Because you cannot write logic inside a class', 'Because it hides the code from users'], 1, 'Inline definitions clutter the blueprint. Separating them keeps the declaration concise and allows for proper multi-file architecture.'),
      q('What is Name Shadowing in this context?', ['When a class has no name', 'When a function parameter has the exact same name as a class attribute, causing the compiler to prioritize the parameter and hide the attribute', 'When text becomes dark in the terminal', 'When an object is deleted'], 1, 'The innermost local scope (the parameter) takes precedence, completely hiding the wider class scope variable.'),
      q('What exactly is the `this` keyword in C++?', ['A string representing the class name', 'An implicit pointer that holds the memory address of the specific object instance currently executing the method', 'A function that returns the object', 'A command to stop the program'], 1, '`this` explicitly points to the current object. `this->variableName` guarantees you are modifying the object\'s attribute, not a local parameter.')
    ],
    ['Use the Scope Resolution Operator (::) to write function code outside of the main class block.', 'A local function parameter with the same name as a class variable causes "Shadowing".', 'The \'this\' keyword is a pointer to the specific object running the code.', 'Use this->variableName to explicitly target the object\'s attribute instead of the local parameter.']
  ),

  L(
    'cpp-16', 16, 'Inheritance (Base & Derived Classes)', '🧬', 
    TERMINAL_NOTICE_SHORT + 'If you are making a zoo simulation, you might have a Lion, a Tiger, and a Bear. They all need a `health` variable and a `move()` method. Copying and pasting that code into three different classes is terrible! Inheritance lets you create a master "Animal" class, and have other classes inherit its code automatically.',
    [
      { title: '1. Base Classes (The Parent)', beginner: 'A Base class holds the common code. `class Animal { public: int health; void eat() { ... } };`. This is your master blueprint.', advanced: 'The Base class (Superclass) defines generalized state and behavior. It centralizes common logic, promoting strict DRY (Don\'t Repeat Yourself) principles.' },
      { title: '2. Derived Classes (The Child)', beginner: 'To inherit from Animal, use a colon: `class Lion : public Animal { ... };`. Now, the Lion class is totally empty inside, but it MAGICALLY possesses the `health` variable and `eat()` method from the Animal class!', advanced: 'The Derived class (Subclass) inherits the memory layout and methods of the Base class. Specifying `public Animal` means public base members remain public in the derived class.' },
      { title: '3. Adding Specifics', beginner: 'The child class isn\'t restricted to just parent code! The Lion can have its own unique things. You can add `void roar()` inside the Lion class. The Lion can eat AND roar, but standard Animals cannot roar!', advanced: 'Inheritance models an "IS-A" relationship. A Lion IS-A Animal. The derived class extends the base class with specialized behavior while retaining generalized capabilities.' },
      { title: '4. The Protected Modifier', beginner: 'We learned that `private` variables cannot be touched by anyone. Unfortunately, that includes Child classes! If you want variables to be hidden from `main()`, BUT still accessible to child classes, use `protected:` instead of `private:`.', advanced: '`protected` acts as an intermediary access modifier. It restricts access from external clients (like private does) but explicitly grants visibility to derived class scopes.' }
    ],
    {
      title: 'The Vehicle Hierarchy',
      intro: 'Create a Base Vehicle class and inherit from it to create a specific Car class.',
      steps: [
        'Define a base class: `class Vehicle { protected: int speed; public: void setSpeed(int s) { speed = s; } };`.',
        'Define a child class: `class Car : public Vehicle { public: void honk() { std::cout << "Beep! Speed: " << speed; } };`.',
        'Notice how the Car class can directly access the `speed` variable because it is `protected`!',
        'In `main()`, instantiate `Car myCar;`.',
        'Call `myCar.setSpeed(60);` (Inherited method).',
        'Call `myCar.honk();` (Unique method).'
      ],
      goal: 'You successfully established an IS-A relationship hierarchy, inherited generalized methods, and utilized protected visibility for subclass data access.'
    },
    [
      q('What is the main benefit of Inheritance in OOP?', ['It makes code run faster', 'It prevents you from writing the exact same common variables and methods multiple times across different classes, promoting code reuse', 'It allows variables to hold multiple data types', 'It deletes unused classes automatically'], 1, 'Inheritance centralizes common logic. If a bug is found in the common code, you only fix it in the Base class, and all Child classes inherit the fix immediately.'),
      q('How do you declare that `class Dog` inherits publicly from `class Animal`?', ['class Dog inherits Animal', 'class Dog + Animal', 'class Dog : public Animal', 'class Animal : public Dog'], 2, 'The colon followed by the access specifier (`: public Animal`) establishes the inheritance link from the Base class.'),
      q('What does the `protected` access modifier do?', ['Makes the variable public to everyone', 'Locks the variable completely, even from child classes', 'Hides the variable from the outside world, but allows Derived (child) classes to directly access and modify it', 'Changes the variable type'], 2, '`protected` is specifically designed for inheritance. It maintains encapsulation from external clients while trusting subclasses with internal data.'),
      q('If `class Car` inherits from `class Vehicle`, which statement is true?', ['A Vehicle can use all of Car\'s unique methods', 'A Car possesses all public methods and attributes of Vehicle, plus its own unique ones', 'Vehicle is the derived class', 'They are completely unrelated'], 1, 'The flow of inheritance is strictly top-down. The child inherits the parent\'s traits, but the parent does not receive the child\'s traits.')
    ],
    ['Inheritance allows a Child class to automatically copy the variables and methods of a Parent class.', 'Use a colon to inherit: class Child : public Parent.', 'Child classes can add their own unique methods on top of the inherited ones.', 'Use protected: instead of private: if you want child classes to have direct access to parent variables.']
  ),

  L(
    'cpp-17', 17, 'Polymorphism & Virtual Functions', '🎭', 
    TERMINAL_NOTICE_SHORT + 'If a Base class `Animal` has a `makeSound()` method, a Dog should bark, but a Cat should meow. Polymorphism (Many-Forms) allows Child classes to OVERWRITE the Parent\'s methods so they can behave uniquely while sharing the same command!',
    [
      { title: '1. Method Overriding', beginner: 'If the Parent class has `void speak()`, the Child class can just write its own `void speak()` with new code inside. When you call `speak()` on the Child, it uses its own new version, ignoring the Parent\'s version!', advanced: 'Method overriding redefines a base class method in a derived class. The method signatures (name, parameters, const-ness) must match exactly.' },
      { title: '2. The Problem with Pointers', beginner: 'In advanced C++, we often use Pointers to group things. E.g., `Animal* ptr = &myDog;`. Because the pointer thinks it is looking at a generic Animal, if you call `ptr->speak()`, it will trigger the generic Animal sound, NOT the Dog bark! This is a massive problem.', advanced: 'Standard method resolution occurs at Compile-Time (Static Binding) based strictly on the pointer\'s declared type, completely ignoring the actual derived object type residing in memory.' },
      { title: '3. The \'virtual\' Keyword', beginner: 'To fix this, we put the word `virtual` in front of the Parent\'s method: `virtual void speak()`. This acts as a flag that tells C++: "Hey! If a pointer looks at this, wait until the code is actually running, check what the object REALLY is (a Dog), and use the Dog\'s overridden method!"', advanced: 'The `virtual` keyword enables Run-Time Polymorphism (Dynamic Binding). The compiler constructs a V-Table (Virtual Table) of function pointers for the class, allowing the program to dynamically resolve the correct overridden method implementation at runtime.' },
      { title: '4. The \'override\' Keyword', beginner: 'In the Child class, when you rewrite the method, it is good practice to put `override` at the end: `void speak() override { ... }`. This doesn\'t change how it works, but it double-checks your spelling and prevents bugs!', advanced: '`override` is a context-sensitive keyword that forces the compiler to verify that the method actually overrides a virtual base method. If signatures mismatch, it throws a compile error instead of accidentally creating a new, unrelated method.' }
    ],
    {
      title: 'The Farm Simulator',
      intro: 'Utilize virtual functions to ensure pointers trigger the correct polymorphic behavior.',
      steps: [
        'Create a base class `Animal` with a virtual method: `virtual void speak() { std::cout << "?"; }`.',
        'Create a derived class `Cow : public Animal`.',
        'Override the method in Cow: `void speak() override { std::cout << "Moo!"; }`.',
        'In `main()`, create a Cow: `Cow myCow;`.',
        'Create a base class pointer that points to your Cow: `Animal* ptr = &myCow;`.',
        'Trigger the method through the pointer: `ptr->speak();`. Without `virtual`, it would print "?". With `virtual`, it prints "Moo!".'
      ],
      goal: 'You successfully implemented Run-Time Polymorphism via V-Tables, ensuring dynamic binding resolved to the correct derived implementation.'
    },
    [
      q('What does Polymorphism mean in the context of Object-Oriented Programming?', ['Writing code using multiple programming languages', 'The ability for different derived classes to implement their own unique versions of a shared base class method', 'Hiding variables from the user', 'Creating infinite loops'], 1, 'Polymorphism (Many Forms) allows a single interface/method name to dictate different underlying behaviors depending on the specific object type executing it.'),
      q('Why do we need the `virtual` keyword on base class methods?', ['To make the method run on the internet', 'To enable dynamic binding, ensuring that a Base pointer pointing to a Derived object correctly executes the Derived object\'s overridden method', 'To prevent the method from being modified', 'To delete the method'], 1, 'Without `virtual`, a base pointer strictly uses static binding (executing the base method). `virtual` forces runtime inspection (V-Tables).'),
      q('What is the purpose of the `override` keyword in a derived class?', ['It forces the compiler to verify that you are actually overriding a valid virtual base method (catching typos in method names)', 'It deletes the base method entirely', 'It makes the code run 10x faster', 'It allows you to change the return type'], 0, '`override` is a safety net. If you accidentally misspell the method name in the child class, the compiler will alert you that nothing is actually being overridden.'),
      q('If `class Bird` inherits from `Animal`, and `Animal` has `virtual void fly()`, can `Bird` choose to NOT override `fly()`?', ['No, it must override it or the program crashes', 'Yes. If Bird doesn\'t override it, it simply inherits and uses the generic `fly()` implementation from Animal', 'No, only mammals can override', 'Yes, but the method gets deleted'], 1, 'Overriding is optional. If a derived class lacks an explicit override, it seamlessly falls back to the base class implementation.')
    ],
    ['Polymorphism allows Child classes to "overwrite" (redefine) Parent methods with custom logic.', 'Standard pointers look at the data type, not the actual object, causing them to trigger the wrong methods.', 'Putting the word \'virtual\' on a Parent method forces pointers to look at the TRUE object type at runtime.', 'Always use the \'override\' keyword in Child classes to catch spelling mistakes!']
  ),

  L(
    'cpp-18', 18, 'Dynamic Arrays (std::vector)', '🚄', 
    TERMINAL_NOTICE_SHORT + 'Standard arrays in C++ are rigid. Once you say `int scores[5]`, it can NEVER hold 6 scores. If you are building a shopping cart, you have no idea how many items the user will add! Enter `std::vector`: the smart, dynamic, resizing array of C++.',
    [
      { title: '1. Including and Declaring', beginner: 'First, you must `#include <vector>`. To create one, you specify the data type in angle brackets: `std::vector<int> scores;`. Notice we didn\'t give it a size! It starts completely empty.', advanced: '`std::vector` is a sequence container from the Standard Template Library (STL). It dynamically manages a heap-allocated array, abstracting away manual memory management and reallocation.' },
      { title: '2. Adding Elements (push_back)', beginner: 'To add data, use the `push_back()` method. `scores.push_back(100);`. This literally pushes the number 100 onto the back of the list. The vector automatically grows to accommodate it!', advanced: 'When a vector reaches its capacity, `push_back` triggers a reallocation. The container allocates a new, larger memory block (usually double the size), copies/moves existing elements, and destroys the old block.' },
      { title: '3. Accessing & Sizing', beginner: 'You access elements just like normal arrays: `scores[0]`. To find out exactly how many items are currently inside the vector, you use the `.size()` method. This is incredibly helpful for loops!', advanced: 'The `[]` operator provides direct access without bounds checking (fast). The `.at()` method provides bounds checking and throws a `std::out_of_range` exception if breached (safe). `.size()` evaluates in constant time O(1).' },
      { title: '4. Removing Elements', beginner: 'If the user removes an item from their cart, you can use `.pop_back()` to instantly delete the very last item in the vector and shrink its size down by one.', advanced: '`pop_back` destroys the final element and decrements the internal size counter, but it does NOT typically reduce the underlying allocated memory `capacity()`, preventing reallocation overhead on subsequent pushes.' }
    ],
    {
      title: 'The Dynamic Inventory',
      intro: 'Create an expanding inventory system using std::vector that automatically adjusts its size.',
      steps: [
        'Include `<iostream>`, `<string>`, and `<vector>`.',
        'In `main()`, declare an empty vector of strings: `std::vector<std::string> inventory;`.',
        'Use `.push_back("Sword");` and `.push_back("Shield");`.',
        'Print out the size of the inventory using `inventory.size()`.',
        'Use a `for` loop to iterate from `0` to `inventory.size()` and print each item using `inventory[i]`.',
        'Call `.pop_back();` to drop the Shield, and print the size again!'
      ],
      goal: 'You successfully utilized STL containers to manage dynamically scaling heap memory without manual allocation.'
    },
    [
      q('What is the primary advantage of a `std::vector` over a standard C-style array?', ['It uses fewer CPU cycles', 'It can dynamically resize itself at runtime to accommodate new elements', 'It can hold multiple different data types at once', 'It does not require `#include`'], 1, 'While standard arrays have fixed compile-time bounds, vectors automatically allocate more heap memory and scale as you push more data into them.'),
      q('Which method is used to add a new item to the very end of a vector?', ['add_end()', 'insert()', 'push_back()', 'append()'], 2, '`push_back(value)` appends the data to the contiguous sequence, increasing the vector\'s active size by one.'),
      q('How do you safely determine exactly how many active elements are inside `std::vector<int> myVec`?', ['myVec.length', 'myVec.size()', 'sizeof(myVec)', 'myVec.count'], 1, 'The `.size()` method returns an unsigned integer representing the exact number of active elements currently managed by the vector.'),
      q('What happens behind the scenes when a vector runs out of memory capacity during a `push_back()`?', ['The program crashes', 'It asks the user to delete data', 'It automatically allocates a larger block of memory, copies the old data over, and deletes the old block', 'It converts into a standard array'], 2, 'This is the hidden magic of STL containers. It handles the heavy lifting of dynamic heap reallocation and data migration for you.')
    ],
    ['Include <vector> to access dynamic arrays that can grow and shrink.', 'Create them using angle brackets: std::vector<dataType> name;', 'Use .push_back(value) to add items, and .pop_back() to remove the last item.', 'Use .size() to loop through them safely without going out of bounds.']
  ),

  L(
    'cpp-19', 19, 'Advanced Strings (std::string)', '📝', 
    TERMINAL_NOTICE_SHORT + 'You\'ve used basic strings to store text, but `std::string` is actually a powerful Class packed with methods! Searching for words, slicing sentences apart, and dynamically chaining text together are all built-in features you need to master.',
    [
      { title: '1. Length and Capacity', beginner: 'Just like vectors, you can find out exactly how many characters are in a string using `.length()` or `.size()`. `std::string name = "Leo";` means `name.length()` is 3!', advanced: '`std::string` dynamically manages a character array. `.length()` and `.size()` are synonymous and execute in O(1) time. The underlying `.capacity()` may be larger to optimize concatenation.' },
      { title: '2. Concatenation (+)', beginner: 'You can glue strings together (Concatenation) using the simple `+` operator. `string fullName = "Bat" + "man";`. You can also use `+=` to append text to an existing variable!', advanced: 'The overloaded `+` operator generates a new string object and copies the buffer. Using `+=` or `.append()` is generally more performant as it attempts to utilize existing capacity without full reallocation.' },
      { title: '3. Finding Substrings', beginner: 'Want to know if an email contains an "@" symbol? Use `.find()`. E.g., `email.find("@");`. If it finds it, it returns the exact index number. If it doesn\'t, it returns a massive error number called `std::string::npos`.', advanced: '`.find()` returns an unsigned integer `size_t`. Comparing the result against `std::string::npos` (which represents the maximum possible value for `size_t`) is the standard validation paradigm for search failures.' },
      { title: '4. Extracting Substrings', beginner: 'You can extract a specific chunk of text using `.substr(start_index, length)`. If your string is `"Hello World"`, doing `.substr(0, 5)` starts at index 0 and grabs 5 letters, returning just `"Hello"`!', advanced: '`substr()` instantiates and returns a brand new string object by copying the requested character block. Be mindful of performance inside heavy loops.' }
    ],
    {
      title: 'The Email Validator',
      intro: 'Write a program that analyzes an email address string and extracts the username.',
      steps: [
        'Include `<string>`.',
        'Declare `std::string email = "hero@server.com";`.',
        'Find the index of the "@" symbol: `int pos = email.find("@");`.',
        'Write an `if` statement checking if `pos` is NOT equal to `std::string::npos`.',
        'If it is found, extract the username using `email.substr(0, pos)` and print it out. (The length of the username is exactly the index of the @ symbol!)'
      ],
      goal: 'You successfully utilized string member methods to search character arrays and dynamically extract substring data based on algorithmic conditions.'
    },
    [
      q('Which operator allows you to seamlessly glue two `std::string` objects together?', ['&', '+', '*', '->'], 1, 'The overloaded `+` addition operator handles string concatenation cleanly (e.g., `string A + string B`).'),
      q('What does `myString.find("Z")` return if the letter "Z" is NOT in the string?', ['-1', '0', 'false', 'std::string::npos'], 3, 'Because indexes are unsigned (cannot be negative), C++ returns the constant `npos` (no-position) to indicate a failed search.'),
      q('If `std::string word = "Programming";`, what will `word.substr(3, 4)` extract?', ['"gram"', '"Prog"', '"ramm"', '"ming"'], 0, 'It starts at index 3 (the letter \'g\') and pulls exactly 4 characters total, resulting in "gram".'),
      q('Are `.size()` and `.length()` functionally different for `std::string`?', ['Yes, size() includes spaces, length() does not', 'No, they are identical and return the exact number of characters in the string', 'Yes, size() returns bytes, length() returns characters', 'Yes, one is for arrays, one is for text'], 1, 'They are exactly the same. `.length()` exists to make strings feel natural to read, while `.size()` exists to maintain consistency with STL containers like vectors.')
    ],
    ['Use the + operator to easily glue (concatenate) strings together.', 'string.find("text") returns the index of the text, or std::string::npos if it fails.', 'string.substr(start, length) extracts a custom slice of the string.', '.length() and .size() do the exact same thing for strings.']
  ),

  L(
    'cpp-20', 20, 'File I/O (Reading & Writing)', '💾', 
    TERMINAL_NOTICE_SHORT + 'If your user plays your game for 5 hours, gets a high score, and closes the window... the RAM is wiped and the score is gone forever! To save data permanently to a hard drive, we must learn to Read and Write to physical text files.',
    [
      { title: '1. The <fstream> Header', beginner: 'To interact with the hard drive, you must `#include <fstream>` (File Stream). This library provides the tools to open files, write text into them, and read text back out.', advanced: '`<fstream>` utilizes the RAII (Resource Acquisition Is Initialization) pattern. It manages underlying OS file descriptors, opening streams upon instantiation and releasing OS locks upon destruction.' },
      { title: '2. Writing to Files (ofstream)', beginner: 'To output (write) data, use `std::ofstream`. `std::ofstream myFile("save.txt");`. This creates a text file. You write to it EXACTLY like `std::cout`! `myFile << "Score: 100";`.', advanced: '`ofstream` defaults to `std::ios::out`. If the file does not exist, it creates it. If it does exist, it completely overwrites it (truncates). To append without erasing, initialize with `std::ios::app`.' },
      { title: '3. Closing Files', beginner: 'When you are done writing, you MUST close the file: `myFile.close();`. If you don\'t, the file gets locked by the operating system, and data might not fully save!', advanced: 'While the destructor of `ofstream` implicitly calls `close()`, explicitly calling `.close()` allows you to catch and handle any final I/O flush errors before the object goes out of scope.' },
      { title: '4. Reading from Files (ifstream)', beginner: 'To input (read) data, use `std::ifstream`. You can use a `while` loop combined with the `getline()` function to read the file line-by-line until it reaches the end! `while (getline(myFile, lineText)) { ... }`.', advanced: '`std::getline(stream, string_var)` extracts characters from the input stream until a delimiter (newline) is found. The stream state implicitly evaluates to `false` when EOF (End Of File) is reached.' }
    ],
    {
      title: 'The High Score Saver',
      intro: 'Write a program that writes a high score to a text file, closes it, and then reads it back to prove it saved to the hard drive.',
      steps: [
        'Include `<iostream>`, `<string>`, and `<fstream>`.',
        'In `main()`, open a file for writing: `std::ofstream outFile("score.txt");`.',
        'Write to it: `outFile << "High Score: 9999" << std::endl;`.',
        'Close it: `outFile.close();`.',
        'Now, open it for reading: `std::ifstream inFile("score.txt");`.',
        'Create a string to hold the incoming text: `std::string line;`.',
        'Use `std::getline(inFile, line);` to grab the text, and print `line` using `std::cout`!'
      ],
      goal: 'You successfully persisted runtime state to physical non-volatile storage via stream insertion, and retrieved it via stream extraction.'
    },
    [
      q('Which C++ standard library header must be included to read and write physical files?', ['<iostream>', '<fstream>', '<file>', '<disk>'], 1, '`<fstream>` stands for File Stream and contains the definitions for `ofstream` and `ifstream`.'),
      q('What happens if you open a file using `std::ofstream myFile("data.txt");` and the file "data.txt" does not exist yet?', ['The program crashes', 'It asks the user to create the file', 'C++ automatically creates the new file for you on the hard drive', 'It throws an exception'], 2, 'By default, output streams will automatically generate the specified file if it cannot be found in the directory.'),
      q('Why is it critically important to call `.close()` on your file streams when you are finished?', ['To free up RAM, release the OS file lock, and guarantee all buffered text is permanently flushed to the hard drive', 'To encrypt the file', 'To delete the file', 'To prevent viruses'], 0, 'Failing to close a file stream can leave data hanging in an output buffer, resulting in incomplete file saves and locked resources.'),
      q('Which function is best used inside a while loop to read a file completely line-by-line?', ['cin >>', 'file.read()', 'std::getline()', 'file.text()'], 2, '`std::getline(stream, string)` elegantly grabs an entire line of text including spaces, advancing the stream pointer until it gracefully hits the End Of File.')
    ],
    ['Include <fstream> to unlock file saving and loading.', 'Use std::ofstream to Output (write) data exactly like you use std::cout.', 'Always use .close() when you are done to save the data properly.', 'Use std::ifstream and std::getline() to read data back line-by-line.']
  ),

  L(
    'cpp-21', 21, 'Modern C++ Features (auto, nullptr, constexpr)', '⚡', 
    TERMINAL_NOTICE_SHORT + 'Older C++ codebases were messy and prone to dangerous null pointer bugs. Modern C++ (C++11 and beyond) introduced sleek features that make your code safer, faster, and much cleaner to write.',
    [
      { title: '1. Type Deduction (auto)', beginner: 'Tired of typing long data types? `auto` tells the compiler to automatically figure out the type for you! E.g., `auto score = 100;` automatically knows it is an integer. It saves time without sacrificing static typing speed.', advanced: 'Type deduction happens strictly at compile-time. It does not incur runtime overhead, but note that `auto` strips away references and const qualifiers by default unless explicitly specified as `auto&`.' },
      { title: '2. The Safe Null Pointer (nullptr)', beginner: 'In old C++, programmers used the number `0` or `NULL` to represent empty pointers, which caused massive confusion with integer math. Modern C++ introduced `nullptr` as a dedicated, type-safe keyword for unassigned pointers.', advanced: '`nullptr` has its own type (`std::nullptr_t`), eliminating the ambiguity of integer-zero overloads in function signatures and preventing subtle compiler resolution bugs.' },
      { title: '3. Range-Based For Loops', beginner: 'Remember writing `for(int i = 0; i < vec.size(); i++)`? Modern C++ lets you loop through lists effortlessly: `for (int num : myVector) { ... }`. It reads like plain English!', advanced: 'Range-based for loops under the hood utilize iterator pairs (`begin()` and `end()`), providing a clean, concise syntactic abstraction for sequential container iteration.' },
      { title: '4. Compile-Time Evaluation (constexpr)', beginner: 'Want calculations to happen BEFORE your program even runs to speed things up? Use `constexpr`. It forces the compiler to compute the math during compilation time rather than wasting CPU cycles at runtime!', advanced: '`constexpr` instructs the compiler to evaluate expressions at compile-time, allowing computed values to be used in constant contexts like array bounds or template arguments.' }
    ],
    {
      title: 'Modern Syntax Refactor',
      intro: 'Refactor old-style code using auto, nullptr, and range-based loops.',
      steps: [
        'Include `<vector>` and `<iostream>`.',
        'Declare a vector of integers using `auto`: `auto numbers = {1, 2, 3, 4, 5};`.',
        'Create a pointer initialized safely: `int* ptr = nullptr;`.',
        'Use a range-based for loop to print every number in the vector: `for (int n : numbers) { std::cout << n; }`.'
      ],
      goal: 'You successfully modernized your codebase by implementing compile-time type deduction, safe null pointers, and range-based loops.'
    },
    [
      q('What does the `auto` keyword do in Modern C++?', ['It makes the variable run automatically in the background', 'It instructs the compiler to automatically deduce the variable\'s data type from its initialization value at compile-time', 'It allows a variable to change its data type at runtime', 'It creates a loop'], 1, '`auto` simplifies syntax by letting the compiler figure out the type during compilation, preserving strict static typing.'),
      q('Why was `nullptr` introduced to replace `NULL` or `0` for empty pointers?', ['To make code look cooler', 'To provide a distinct, type-safe null pointer literal that avoids ambiguity with integer types in function overloads', 'To speed up the computer\'s hard drive', 'To allow pointers to hold strings'], 1, '`nullptr` prevents type-matching ambiguity where integer `0` could accidentally match integer function parameters instead of pointer parameters.'),
      q('How does a Range-Based For Loop (`for (int x : list)`) differ from a standard index loop?', ['It is slower', 'It completely hides iterator logic, allowing you to seamlessly pull elements out of a container without managing index numbers or bounds', 'It only works with strings', 'It runs infinitely'], 1, 'Range-based loops abstract away the counter variables and index lookups, preventing out-of-bounds errors entirely.'),
      q('What is the primary benefit of using `constexpr`?', ['It makes variables private', 'It evaluates expressions at compile-time, saving runtime CPU cycles and enabling constant expression mapping', 'It connects your code to the cloud', 'It deletes memory leaks'], 1, '`constexpr` shifts computational costs from runtime execution over to the compilation phase.')
    ],
    ['Use auto to let the compiler deduce types, keeping code clean without losing performance.', 'Always use nullptr instead of 0 or NULL to represent empty pointers safely.', 'Range-based for loops (for (auto item : list)) make iterating through collections effortless.', 'Use constexpr to evaluate math and logic at compile-time for ultimate optimization.']
  ),

  L(
    'cpp-22', 22, 'Smart Pointers & Ownership (unique_ptr, shared_ptr)', '🛡️', 
    TERMINAL_NOTICE_SHORT + 'Managing raw heap memory with `new` and `delete` is dangerous. If you forget to delete, you get a Memory Leak. If you delete twice, your program crashes. Modern C++ solved this forever with "Smart Pointers", which automatically clean up after themselves!',
    [
      { title: '1. The Problem with Raw Pointers', beginner: 'When you create data on the Heap using `new`, YOU are entirely responsible for remembering to type `delete` later. If an exception throws before you reach the delete line, your RAM leaks permanently.', advanced: 'Raw pointers lack deterministic ownership semantics. In complex codebases with branching logic and early returns, manual memory management reliably leads to leaks or double-frees.' },
      { title: '2. std::unique_ptr (Exclusive Ownership)', beginner: 'A `unique_ptr` guarantees that ONLY ONE pointer can own that heap data at a time. You cannot copy it. When the unique_ptr goes out of scope, it automatically destroys the heap data for you! E.g., `std::unique_ptr<int> p = std::make_unique<int>(50);`.', advanced: '`unique_ptr` enforces exclusive ownership semantics. Its copy constructor is explicitly deleted; ownership can only be transferred via move semantics (`std::move`).' },
      { title: '3. std::shared_ptr (Shared Ownership)', beginner: 'What if multiple parts of your program need to point to the exact same heap data? Use `std::shared_ptr`. It keeps a secret "Reference Count". Every time a new shared pointer points to it, the count goes up. When a pointer dies, the count goes down. When the count hits zero, it automatically deletes the data!', advanced: '`shared_ptr` maintains a control block containing a reference counter. While incredibly flexible, it introduces minor atomic increment/decrement overhead and risks cyclic reference memory leaks if not paired with weak_ptr.' },
      { title: '4. std::make_unique & std::make_shared', beginner: 'Always use `std::make_unique` and `std::make_shared` to create your smart pointers. It is cleaner, safer, and prevents subtle memory allocation bugs.', advanced: '`make_shared` allocates the control block and the object in a single contiguous memory block, drastically improving cache locality and performance compared to separate allocations.' }
    ],
    {
      title: 'The Leak-Free Workspace',
      intro: 'Replace dangerous raw heap pointers with modern unique and shared smart pointers.',
      steps: [
        'Include `<memory>` and `<iostream>`.',
        'Create a unique pointer holding an integer: `std::unique_ptr<int> score = std::make_unique<int>(100);`.',
        'Print the value by dereferencing it: `std::cout << *score;`.',
        'Create a shared pointer structure: `std::shared_ptr<int> item = std::make_shared<int>(500);`.',
        'Check the reference count using `item.use_count();` (It will output 1).'
      ],
      goal: 'You successfully eliminated manual memory management by implementing automated smart pointer ownership models.'
    },
    [
      q('Why are Smart Pointers preferred over raw pointers in Modern C++?', ['They run slower', 'They automatically manage heap lifetime, preventing memory leaks and double-free crashes when they go out of scope', 'They can only hold strings', 'They use the stack instead of the heap'], 1, 'Smart pointers implement RAII, ensuring heap memory is deterministically freed when the pointer object is destroyed.'),
      q('What is the ownership rule of a `std::unique_ptr`?', ['Multiple pointers can share it', 'It has exclusive ownership; it cannot be copied, only moved to another unique pointer', 'It can only be accessed inside functions', 'It deletes itself immediately'], 1, '`unique_ptr` enforces strict single ownership. Copying is banned to prevent multiple pointers from attempting to delete the same memory block.'),
      q('How does a `std::shared_ptr` track when it is safe to delete underlying heap data?', ['It uses a reference count that increments when shared and decrements when pointers go out of scope', 'It asks the operating system every second', 'It deletes data randomly', 'It relies on garbage collection'], 0, 'A control block tracks the active reference count. The memory is only freed when the counter drops precisely to zero.'),
      q('Which helper function is strongly recommended when instantiating a unique pointer?', ['new int()', 'std::make_unique<int>()', 'malloc()', 'auto_ptr()'], 1, '`std::make_unique` is exception-safe and modern, wrapping the allocation cleanly without requiring explicit `new` syntax.')
    ],
    ['Never use raw new and delete in Modern C++; use smart pointers instead.', 'std::unique_ptr enforces exclusive ownership and cleans up automatically when out of scope.', 'std::shared_ptr allows multiple pointers to share ownership using a reference count.', 'Always use std::make_unique and std::make_shared for safe, clean allocations.']
  ),

  L(
    'cpp-23', 23, 'RAII Pattern (Resource Acquisition Is Initialization)', '🔒', 
    TERMINAL_NOTICE_SHORT + 'RAII is the single most important design pattern in C++. It ties the lifecycle of system resources (like files, database connections, and locks) directly to the lifespan of stack objects. When an object dies, its destructor cleans up the resource automatically!',
    [
      { title: '1. What is RAII?', beginner: 'Resource Acquisition Is Initialization. It sounds complex, but it means this: Wrap your resources inside an object. When the object is created (initialized), it grabs the resource. When the object goes out of scope and dies, its destructor automatically releases the resource.', advanced: 'RAII bridges memory management and resource acquisition. Because stack unwinding guarantees deterministic destruction when exceptions occur, RAII eliminates resource leaks without garbage collection.' },
      { title: '2. Deterministic Destruction', beginner: 'In languages with Garbage Collection, you never know WHEN resources will be cleaned up. In C++, destruction is 100% deterministic. The exact nanosecond your code leaves a set of curly braces `{}`, the destructor fires immediately.', advanced: 'Deterministic destruction ensures predictable resource reclamation. File locks, sockets, and GPU handles are released instantly upon scope exit, preventing resource starvation.' },
      { title: '3. Exception Safety via RAII', beginner: 'Imagine opening a file, and halfway through reading, an exception crashes your code. If you used manual cleanup, the file never closes! With RAII, because the object leaves scope during the stack unwind, the destructor STILL fires, safely closing your file.', advanced: 'RAII achieves strong exception safety guarantees. Even during stack unwinding due to unhandled exceptions, local object destructors are guaranteed to execute.' },
      { title: '4. Building an RAII Wrapper', beginner: 'You can build your own RAII classes! Simply open a resource in the constructor, and close/free it in the destructor. Now you never have to worry about cleanup code again.', advanced: 'Custom RAII wrappers manage unique resource handles (e.g., custom mutex locks, file descriptors) by deleting copy constructors and implementing move semantics.' }
    ],
    {
      title: 'The Custom File RAII Wrapper',
      intro: 'Build a custom RAII class that automatically opens a log file on birth and closes it on death.',
      steps: [
        'Create a `class LogFile { private: std::ofstream file; public: ... };`.',
        'In the Constructor, open the file: `LogFile(std::string filename) { file.open(filename); }`.',
        'In the Destructor, close the file: `~LogFile() { if(file.is_open()) file.close(); }`.',
        'Add a method to write logs: `void write(std::string msg) { file << msg; }`.',
        'In `main()`, instantiate your wrapper inside a scope block. Watch it manage the file lifecycle automatically!'
      ],
      goal: 'You successfully implemented the RAII design pattern, binding non-memory system resources to deterministic stack object lifecycles.'
    },
    [
      q('What does the RAII design pattern stand for and mean?', ['Random Access Internal Index; finding data fast', 'Resource Acquisition Is Initialization; binding resource management to object lifecycles so destruction handles cleanup automatically', 'Run All Instances Immediately; threading pattern', 'Real-time Artificial Intelligence Integration'], 1, 'RAII ties acquiring a resource to object construction, and releasing that resource directly to object destruction.'),
      q('Why is deterministic destruction a massive advantage in C++?', ['It makes the screen flicker', 'You know the exact nanosecond a resource is freed when an object goes out of scope, eliminating memory and handle leaks', 'It uses garbage collection', 'It prevents classes from being inherited'], 1, 'Unlike garbage collection which runs unpredictably, RAII guarantees immediate, deterministic resource cleanup upon scope exit.'),
      q('How does RAII protect your program during an exception crash?', ['It restarts the computer', 'Because local stack objects are guaranteed to be destroyed during stack unwinding, their destructors fire and clean up resources even if an exception occurs', 'It deletes all files', 'It turns off exceptions'], 1, 'Stack unwinding guarantees that all active local objects are destroyed, executing their destructors and preventing resource leaks during error states.'),
      q('Which standard C++ features are prime examples of RAII in action?', ['std::vector and std::unique_ptr', 'if statements and switches', 'int and double primitives', 'for loops'], 0, 'Smart pointers and containers manage heap memory and buffer allocations via RAII, releasing them automatically upon destruction.')
    ],
    ['RAII ties resource cleanup directly to object destruction.', 'Destruction in C++ is 100% deterministic; it happens the exact moment an object leaves scope.', 'RAII guarantees exception safety because destructors still fire even if your code crashes.', 'Use RAII wrappers to manage files, network sockets, and locks without manual close statements.']
  ),

  L(
    'cpp-24', 24, 'References Deep Dive & Move Semantics (rvalues, std::move)', '📦', 
    TERMINAL_NOTICE_SHORT + 'In C++, copying massive objects (like a vector with 1 million items) into functions wastes immense CPU time and RAM. Modern C++ introduced Move Semantics, allowing you to "steal" resources from temporary objects instantly instead of copying them!',
    [
      { title: '1. Lvalues vs. Rvalues', beginner: 'An Lvalue has a permanent memory address that you can point to (e.g., a named variable like `int x = 10;`). An Rvalue is a temporary, nameless value that is about to vanish immediately (e.g., the number `50`, or the result of `a + b`).', advanced: 'An lvalue (locator value) persists beyond a single expression. An rvalue is a temporary value with no persistent storage address.' },
      { title: '2. Rvalue References (&&)', beginner: 'Modern C++ introduced double-ampersands `&&` to capture temporary rvalues. E.g., `int&& ref = 50;`. This allows your code to target dying temporary objects directly.', advanced: 'An rvalue reference (`T&&`) binds specifically to temporary objects, enabling functions to distinguish between persistent variables and ephemeral temporaries.' },
      { title: '3. The Cost of Copying', beginner: 'When you pass a massive string or vector into a function, C++ usually makes a heavy duplicate copy byte-by-byte. For large datasets, this slows your application down significantly.', advanced: 'Copying heap-allocated containers triggers deep copies: allocating new heap memory, copying every element, and deallocating later. This is a severe performance bottleneck.' },
      { title: '4. std::move & Stealing Resources', beginner: '`std::move` doesn\'t actually move anything! It simply casts an lvalue into an rvalue. This tricks C++ into saying: "Treat this variable like a temporary; you have permission to STEAL its internal heap pointer instead of copying it!"', advanced: '`std::move` casts an object to an rvalue reference, invoking the move constructor or move assignment operator. The destination steals the source\'s internal buffer pointers, leaving the source in a valid but empty state.' }
    ],
    {
      title: 'The Resource Stealer',
      intro: 'Utilize std::move to transfer ownership of heavy heap data without making duplicate copies.',
      steps: [
        'Include `<iostream>` and `<string>`, `<utility>`.',
        'Declare a heavy string: `std::string source = "Massive Data Payload";`.',
        'Use `std::move` to cast it into a temporary: `std::string destination = std::move(source);`.',
        'Print `source`. You will notice it is now completely empty because its internal heap buffer was stolen by destination!'
      ],
      goal: 'You successfully bypassed deep-copy performance penalties by implementing move semantics and resource stealing.'
    },
    [
      q('What is the fundamental difference between an Lvalue and an Rvalue?', ['Lvalues are large, Rvalues are small', 'Lvalues have a persistent memory address and a name, while Rvalues are temporary, nameless values about to expire', 'Lvalues are numbers, Rvalues are text', 'There is no difference'], 1, 'Lvalues persist in memory (variables), while Rvalues are ephemeral expressions or literals.'),
      q('What does `std::move` actually do under the hood?', ['It teleports variables to another computer', 'It acts as a cast that converts an lvalue into an rvalue reference, enabling resource stealing instead of copying', 'It deletes variables from memory', 'It sorts an array'], 1, '`std::move` performs zero runtime data movement; it merely casts the type to trigger move constructors/assignments.'),
      q('Why are Move Semantics a massive performance upgrade for C++?', ['They eliminate expensive deep-copy operations by stealing internal heap pointers from temporary objects', 'They make the compiler compile code twice as fast', 'They remove the need for functions', 'They automatically compress hard drives'], 0, 'Moving transfers ownership of existing heap allocations in O(1) time instead of duplicating data byte-by-byte.'),
      q('What happens to a source variable after its contents are moved using `std::move`?', ['It explodes', 'It is permanently deleted from RAM', 'It remains in a valid but unspecified/empty state until reassigned or destroyed', 'It doubles in size'], 2, 'The source object is left empty (e.g., size 0, null pointer), safe to be destructed or reused.')
    ],
    ['Lvalues have names and persistent memory addresses; Rvalues are temporary expressions.', 'Rvalue references (&&) allow you to capture and interact with temporary objects.', 'std::move casts a variable into an rvalue, granting permission to steal its data.', 'Move semantics provide massive performance boosts by avoiding heavy deep copies.']
  ),

  L(
    'cpp-25', 25, 'Function Templates', '🧬', 
    TERMINAL_NOTICE_SHORT + 'If you write a function to swap two integers, what happens when you want to swap two doubles? Or two strings? Writing the exact same function three times is exhausting. Function Templates let you write ONE generic blueprint that automatically works for any data type!',
    [
      { title: '1. The Template Syntax', beginner: 'You start a template with `template <typename T>`. Here, `T` is a placeholder for a data type. E.g., `template <typename T> T getMax(T a, T b) { return (a > b) ? a : b; }`. Now this function can compare ints, doubles, or strings!', advanced: 'Templates are the foundation of C++ generic programming. They are not actual code; they are blueprints that instruct the compiler to generate specialized function code for every data type you pass in.' },
      { title: '2. Compile-Time Code Generation', beginner: 'When you call `getMax(5, 10)`, the compiler looks at your template and automatically writes a custom integer version of the function behind the scenes. It gives you the best of both worlds: generic code for you, and optimized native code for the machine.', advanced: 'This process is known as Template Instantiation. The compiler performs syntactic checks and generates specialized binary code for each unique type combination used.' },
      { title: '3. Multiple Template Types', beginner: 'You aren\'t limited to just one placeholder! You can define multiple types in your template brackets: `template <typename T1, typename T2> void printPair(T1 a, T2 b) { ... }`.', advanced: 'Multi-parameter templates allow heterogeneous data handling, forming the architectural backbone for STL containers like `std::pair` and `std::unordered_map`.' },
      { title: '4. Template Deduction', beginner: 'In most cases, you don\'t even need to tell the template what type you are using. If you call `getMax(10.5, 20.1)`, C++ automatically deduces that `T` is a `double`.', advanced: 'The compiler performs argument deduction by matching function call parameter types against the template parameter list.' }
    ],
    {
      title: 'The Universal Sorter',
      intro: 'Write a generic template function that can swap any two variables regardless of their data type.',
      steps: [
        'Write the template declaration above your function: `template <typename T> void mySwap(T& a, T& b) { T temp = a; a = b; b = temp; }`.',
        'Inside `main()`, declare two integers: `int x = 5, y = 10;`.',
        'Call your template function: `mySwap(x, y);`. They are swapped!',
        'Now, test it with strings: `std::string s1 = "Hello", s2 = "World";`.',
        'Call `mySwap(s1, s2);`. It works instantly without rewriting code!'
      ],
      goal: 'You successfully implemented generic programming via function templates, enabling type-agnostic code reuse.'
    },
    [
      q('What is the primary purpose of a Function Template in C++', ['To make functions run slower', 'To write a single generic function blueprint that automatically generates type-safe code for any data type', 'To create loops', 'To delete duplicate files'], 1, 'Templates enable generic programming, letting you write algorithms once and apply them to ints, doubles, classes, and more.'),
      q('When does the compiler actually generate the specific machine code for a template function?', ['At runtime', 'During compilation, when the compiler encounters specific template instantiations in your code', 'When the user types input', 'Never'], 1, 'Templates are meta-programming blueprints. The compiler instantiates concrete functions for each unique data type used during compilation.'),
      q('How do you declare a template placeholder type in C++?', ['<type T>', '<typename T>', '<class:T>', '<template.T>'], 1, '`template <typename T>` (or `template <class T>`) defines the generic type placeholder.'),
      q('Can a template function accept more than one generic data type?', ['No, templates are restricted to exactly one type', 'Yes, by defining multiple parameters like `template <typename T1, typename T2>`', 'Only if the types are both integers', 'Only inside classes'], 1, 'Templates support multiple comma-separated type parameters for handling heterogeneous data.')
    ],
    ['Function templates let you write one generic function that works for any data type.', 'Define templates using template <typename T> right above your function signature.', 'The compiler automatically generates optimized, type-specific code behind the scenes during compilation.', 'You can use multiple types in a single template (e.g., template <typename T1, typename T2>).']
  ),

  L(
    'cpp-26', 26, 'Class Templates', '🏗️', 
    TERMINAL_NOTICE_SHORT + 'Just like functions can be templated, entire Classes can be templated! This is how the creators of C++ built `std::vector`—a container that can hold ints, strings, or custom objects. Today, you will build your own generic container class.',
    [
      { title: '1. Templating a Class', beginner: 'If you want to build a custom box class that can hold ANY data type, you template the class: `template <typename T> class Box { private: T data; public: void set(T val) { data = val; } };`.', advanced: 'Class templates parameterize entire class blueprints. Member functions defined outside the class template also require full template prefixing.' },
      { title: '2. Instantiating a Template Class', beginner: 'When creating an object from a class template, you MUST explicitly tell C++ what data type goes inside the angle brackets! E.g., `Box<int> intBox;` or `Box<std::string> strBox;`.', advanced: 'Unlike function templates which support argument deduction, class templates historically required explicit argument specification (though C++17 introduced class template argument deduction - CTAD).' },
      { title: '3. Defining Methods Outside the Class', beginner: 'When writing class template method definitions outside the class body, you must include the full template prefix: `template <typename T> void Box<T>::set(T val) { ... }`.', advanced: 'Every outside method definition must be prefixed with `template <typename T>` and scope-resolved with `ClassName<T>::methodName`, reflecting its templated nature to the compiler.' },
      { title: '4. The Foundation of the STL', beginner: 'Every major container in the C++ Standard Template Library (Vectors, Queues, Maps) is built using Class Templates under the hood!', advanced: 'Standard Template Library (STL) containers leverage class templates and allocator parameters to achieve extreme flexibility, type safety, and high performance.' }
    ],
    {
      title: 'The Generic Pair Container',
      intro: 'Build a custom class template that holds two related items of any data type.',
      steps: [
        'Write the template declaration: `template <typename T> class Pair { private: T first; T second; public: ... };`.',
        'Add a constructor that initializes both items using an initializer list.',
        'Add a public getter method to print them out.',
        'In `main()`, instantiate an integer pair: `Pair<int> p1(10, 20);`.',
        'Instantiate a string pair: `Pair<std::string> p2("Hello", "World");`. Both use the exact same class blueprint!'
      ],
      goal: 'You successfully engineered a type-agnostic custom container class using class templates.'
    },
    [
      q('How do you instantiate an object from a class template named `Holder` holding an integer?', ['Holder holder;', 'Holder<int> holder;', 'Holder(int) holder;', 'template<Holder> int;'], 1, 'Class templates require explicit type specification in angle brackets during instantiation (e.g., `Holder<int>`).'),
      q('When writing a class template method definition outside the class body, what prefix is required?', ['`class::method`', '`template <typename T> returnType ClassName<T>::methodName`', '`void`', '`template<>::`'], 1, 'You must re-declare the template parameter and attach `<T>` to the class scope resolution.'),
      q('What is the main benefit of Class Templates?', ['They compile instantly', 'They allow you to design reusable container structures (like vectors or pairs) that work with any data type securely', 'They eliminate the need for destructors', 'They convert code into Python'], 1, 'Class templates enable type-safe container design, avoiding code duplication across different data types.'),
      q('What does CTAD stand for in Modern C++ (C++17)?', ['Class Template Argument Deduction', 'Compiled Type Array Data', 'Common Template Access Design', 'Conditional Type Allocation Driver'], 0, 'CTAD allows the compiler to deduce class template parameters from constructor arguments automatically, e.g., `Pair p(10, 20);`.')
    ],
    ['Class templates let you build generic data structures that work with any data type.', 'Instantiate class templates by providing the type in angle brackets (e.g., Box<int> box;).', 'Outside method definitions require the full template <typename T> and Class<T>:: prefix.', 'This is the exact mechanism behind C++ STL containers like std::vector.']
  ),

  L(
    'cpp-27', 27, 'Lambda Expressions & Callbacks', '⚡', 
    TERMINAL_NOTICE_SHORT + 'Sometimes you need a quick, one-off function for a specific task, but writing an entire named function feels like overkill. Modern C++ introduced "Lambdas"—anonymous, inline functions that you can write directly inside your code on the fly!',
    [
      { title: '1. Lambda Syntax', beginner: 'A Lambda is an anonymous function written like this: `auto myLambda = []() { std::cout << "Hello Lambda!"; };`. You trigger it by adding parentheses at the end: `myLambda();`.', advanced: 'A lambda expression generates an unnamed function object (functor) under the hood. The compiler creates a unique closure class for every lambda.' },
      { title: '2. The Capture Clause ([ ])', beginner: 'By default, a lambda is trapped in its own world and cannot see variables declared outside of it. The Capture Clause `[]` at the very beginning lets you "capture" outside variables into the lambda.', advanced: 'Capturing bridges outer scope variables into the closure object. Capturing by value creates a copied member variable inside the closure; capturing by reference maintains a reference.' },
      { title: '3. Capturing by Value vs. Reference', beginner: 'Capture by value using `[x]` to take a read-only copy of `x`. Capture by reference using `[&x]` to give the lambda permission to modify the outside variable `x`. Capture everything using `[=]` or `[&]`.', advanced: 'Use `[=]` with caution inside asynchronous callbacks to prevent dangling references if the outer stack frame expires before execution.' },
      { title: '4. Passing Lambdas as Callbacks', beginner: 'Lambdas are extremely powerful when paired with algorithms or asynchronous event callbacks, allowing you to inject custom inline logic directly into functions.', advanced: '`std::function<void(int)>` from `<functional>` can store, copy, and invoke lambda expressions, providing type-erased callback flexibility.' }
    ],
    {
      title: 'The Inline Filter',
      intro: 'Write a lambda expression with a capture clause to filter and print data from a vector.',
      steps: [
        'Include `<vector>`, `<iostream>`, and `<algorithm>`.',
        'Declare a vector of numbers: `std::vector<int> nums = {10, 25, 30, 45, 50};`.',
        'Declare a threshold variable: `int threshold = 30;`.',
        'Use `std::for_each` combined with a lambda capturing threshold by value: `std::for_each(nums.begin(), nums.end(), [threshold](int n) { if(n > threshold) std::cout << n; });`.',
        'Run the code and watch it filter inline without a separate named function!'
      ],
      goal: 'You successfully utilized anonymous lambda expressions and capture clauses to inject inline logic into algorithms.'
    },
    [
      q('What is a Lambda Expression in C++?', ['A permanent function stored on the hard drive', 'An anonymous, inline function object that can be defined directly where it is needed', 'A mathematical symbol for loops', 'A type of smart pointer'], 1, 'Lambdas are anonymous inline closures that eliminate the need to write separate named functions for one-off tasks.'),
      q('What is the role of the Capture Clause `[]` at the beginning of a lambda?', ['To hold function parameters', 'To bring variables from the surrounding outer scope into the lambda\'s internal closure', 'To name the function', 'To return data'], 1, 'The capture clause explicitly defines how outer scope variables are accessed inside the lambda body.'),
      q('What is the difference between `[x]` and `[&x]` capture clauses?', ['There is no difference', '`[x]` captures the variable by value (copy), while `[&x]` captures it by reference (allowing modification)', '`[x]` is for integers, `[&x]` is for strings', '`[x]` deletes the variable'], 1, 'Capture by value creates an internal copy; capture by reference binds directly to the outer variable.'),
      q('How do you immediately execute a lambda the moment it is written?', ['By adding `()` at the very end of the lambda definition', 'By writing `run` in front', 'It runs automatically', 'You cannot execute lambdas immediately'], 0, 'Adding `()` immediately invokes the generated closure object (Immediately Invoked Lambda Expression - IILE).')
    ],
    ['Lambdas are anonymous, inline functions written directly inside your code.', 'Use the capture clause [] to pull outside variables into your lambda.', 'Capture by value [var] for read copies, or by reference [&var] to modify outside variables.', 'Lambdas are perfect for short, one-off tasks and algorithm callbacks.']
  ),

  L(
    'cpp-28', 28, 'Modern Utilities (std::optional, std::variant, std::string_view)', '🧰', 
    TERMINAL_NOTICE_SHORT + 'Older C++ code relied on messy hacks—like returning `-1` or `nullptr`—to indicate that a function failed to find data. Modern C++ (C++17/20) introduced robust standard utilities to make your code expressive, safe, and lightning fast.',
    [
      { title: '1. std::optional (Maybe Data)', beginner: 'What if a function searches for a user in a database, but the user doesn\'t exist? Instead of returning an error code, use `std::optional<User>`. It explicitly represents a value that might exist OR might be empty (`std::nullopt`).', advanced: '`std::optional` wraps a value with an internal boolean flag indicating presence. It prevents the use of magic numbers (`-1`, `nullptr`) and enforces safe `.has_value()` or `.value()` checks.' },
      { title: '2. std::variant (Type-Safe Unions)', beginner: 'A `std::variant` is a variable that can hold ONE of several different data types safely. E.g., `std::variant<int, std::string, double> result;`. It can hold an int today, and a string tomorrow!', advanced: '`std::variant` is a type-safe successor to C-style unions. It tracks its active type at runtime and throws exceptions or prevents unsafe type extraction.' },
      { title: '3. std::string_view (Zero-Copy Text)', beginner: 'Passing a `std::string` into a function creates a brand new copy of the text string in memory, which is slow. `std::string_view` is a lightweight read-only "window" pointing to existing text without copying a single byte!', advanced: '`std::string_view` stores a pointer and a length. It provides O(1) non-owning read access to string literals or std::strings, eliminating allocation overhead.' },
      { title: '4. Safe Data Extraction', beginner: 'Using `.value()` on an optional or `std::get<T>` on a variant ensures your program safely inspects data with built-in runtime exception checks.', advanced: 'Modern utilities prioritize type safety and explicit state management, reducing undefined behavior across complex systems.' }
    ],
    {
      title: 'The Optional Finder',
      intro: 'Write a function returning a std::optional to handle missing search results safely without magic numbers.',
      steps: [
        'Include `<optional>` and `<iostream>`, `<string>`.',
        'Write a function returning optional: `std::optional<int> findAge(std::string name) { if(name == "Alice") return 25; return std::nullopt; }`.',
        'In `main()`, call the function: `auto result = findAge("Bob");`.',
        'Use an `if` statement with `.has_value()` or check `if (result)` to handle the missing data safely without crashing!'
      ],
      goal: 'You successfully utilized modern utility wrappers to handle missing data and zero-copy string views.'
    },
    [
      q('What is the main purpose of `std::optional`?', ['To make optional homework assignments', 'To explicitly represent a value that may or may not exist, eliminating confusing magic error numbers like `-1` or `nullptr`', 'To create optional loops', 'To delete files'], 1, '`std::optional` cleanly encapsulates presence or absence, making function return contracts explicit.'),
      q('How does `std::string_view` improve string performance?', ['It compresses files', 'It provides a lightweight, read-only pointer window to existing string memory, avoiding expensive duplicate string allocations', 'It turns strings into integers', 'It deletes strings when finished'], 1, '`string_view` avoids copying string data by acting as a non-owning pointer-and-length wrapper.'),
      q('What is a `std::variant`?', ['A virus scanner', 'A type-safe union container that can hold one of several specified data types at any given time', 'A variable that changes its name', 'An array of vectors'], 1, '`variant` allows a single variable to safely alternate between multiple distinct types with runtime state tracking.'),
      q('What does `std::nullopt` represent when working with `std::optional`?', ['An infinite loop', 'An explicit empty state indicating the optional holds no value', 'A null pointer exception crash', 'A zero-copy string'], 1, '`std::nullopt` is the designated literal used to reset or initialize an optional to an empty state.')
    ],
    ['Use std::optional to return values that might not exist, avoiding magic error numbers.', 'std::variant lets a variable hold one of several distinct types safely.', 'std::string_view provides zero-copy read-only access to text, boosting performance.', 'These modern utilities make your codebase cleaner, expressive, and robust.']
  ),

  L(
    'cpp-29', 29, 'Exception Handling & Safety (try, catch, throw)', '🚨', 
    TERMINAL_NOTICE_SHORT + 'Even the best programs encounter disasters: hard drives disconnect, network servers crash, and users type invalid text. Instead of letting your program crash instantly, Modern C++ uses Exception Handling to catch errors gracefully and recover.',
    [
      { title: '1. Throwing Exceptions', beginner: 'When an unrecoverable error occurs inside your code, you "throw" an exception object. E.g., `if (age < 0) throw std::invalid_argument("Age cannot be negative!");`. This instantly stops normal execution.', advanced: 'Throwing an exception constructs an exception object and initiates stack unwinding, searching up the call stack for a matching catch block.' },
      { title: '2. Try and Catch Blocks', beginner: 'To protect risky code, wrap it inside a `try { ... }` block. If an exception is thrown inside the try block, execution instantly jumps to the attached `catch (const std::exception& e)` block where you can handle the error safely.', advanced: 'Catch blocks handle exceptions polymorphically by catching base exception classes or specific derived errors. Always catch exceptions by const reference to avoid slicing.' },
      { title: '3. Custom Exception Classes', beginner: 'You aren\'t limited to standard errors! You can build your own custom exceptions by inheriting from `std::exception`. E.g., `class InsufficientFunds : public std::exception { ... };`.', advanced: 'Custom exceptions inherit from `std::exception` and override the `what()` method to provide descriptive diagnostic strings for debugging.' },
      { title: '4. Exception Safety Guarantees', beginner: 'Modern C++ promotes robust guarantees: Basic (no memory leaks when exceptions throw), Strong (commit-or-rollback transactions), and No-throw (guaranteed never to fail).', advanced: 'Exception safety guarantees dictate how object states and memory buffers behave during stack unwinding under error conditions.' }
    ],
    {
      title: 'The Safe Division Guard',
      intro: 'Write a division function that throws an exception on zero division and catches it gracefully.',
      steps: [
        'Include `<iostream>` and `<stdexcept>`.',
        'Write a function: `double divide(double a, double b) { if(b == 0) throw std::runtime_error("Division by zero!"); return a / b; }`.',
        'In `main()`, wrap a risky call in a `try { divide(10, 0); }` block.',
        'Attach a catch block: `catch (const std::exception& e) { std::cout << "Error caught: " << e.what(); }`.',
        'Run the code. Instead of crashing, it catches the error gracefully!'
      ],
      goal: 'You successfully implemented robust error management using try-catch blocks and exception throwing.'
    },
    [
      q('What happens when an exception is thrown inside a C++ program?', ['The computer turns off', 'Normal execution halts, and the program initiates "stack unwinding", searching up the call stack for a matching catch block', 'The error is ignored', 'An infinite loop starts'], 1, 'Throwing an exception interrupts normal flow, triggering stack unwinding and invoking destructors until a catch block intercepts it.'),
      q('Why should you always catch exceptions by `const reference` (e.g., `catch (const std::exception& e)`)?', ['It is required by the compiler', 'It prevents object slicing, preserves polymorphism, and avoids expensive object copying', 'It makes the error disappear', 'It turns the exception into an integer'], 1, 'Catching by reference ensures polymorphic derived exceptions are caught correctly without slicing away derived data.'),
      q('What is the role of the `what()` method on standard exceptions?', ['It deletes the exception', 'It returns a C-style character string describing the error details for debugging', 'It restarts the program', 'It checks memory leaks'], 1, '`what()` provides a descriptive human-readable error message explaining why the exception was triggered.'),
      q('What is a "Strong Exception Safety Guarantee"?', ['The program never has bugs', 'A transactional guarantee stating that if an operation fails due to an exception, the program state remains entirely unchanged (commit-or-rollback)', 'Memory is allocated on the stack', 'Exceptions are turned off'], 1, 'Strong safety ensures zero side-effects occur if an operation aborts halfway through, preserving clean state integrity.')
    ],
    ['Use throw to signal when an unrecoverable error occurs in your code.', 'Wrap risky operations inside a try block and handle failures using catch.', 'Always catch exceptions by const reference (catch (const std::exception& e)) to prevent object slicing.', 'Custom exceptions inherit from std::exception and override what() for clear debugging.']
  ),

  L(
    'cpp-30', 30, 'C++ Performance & Memory Layout (Cache Locality, Profiling)', '🚀', 
    TERMINAL_NOTICE_SHORT + 'Congratulations on reaching Lesson 30! You are now entering the elite tier of C++ development. To write high-performance software (game engines, physics simulators, high-frequency trading), you must understand how your hardware\'s CPU cache actually interacts with RAM memory layouts.',
    [
      { title: '1. The Hardware Reality (CPU vs RAM)', beginner: 'Your CPU is blindingly fast, but fetching data from your RAM is agonizingly slow (in computer terms!). To solve this, CPUs use small, ultra-fast "Caches" (L1, L2, L3) to store data nearby before processing it.', advanced: 'RAM latency is orders of magnitude slower than CPU register operations. Modern performance optimization revolves entirely around feeding the CPU cache efficiently.' },
      { title: '2. Cache Locality (Contiguous Memory)', beginner: 'When your CPU fetches one item from an array or vector, the computer grabs a whole chunk of neighboring items and loads them into the cache together. This is called Cache Locality. Storing data in contiguous blocks (like std::vector) makes your code fly!', advanced: 'Spatial locality ensures that sequential memory accesses hit the CPU cache line directly, avoiding expensive RAM cache misses.' },
      { title: '3. Linked Lists vs. Vectors (Performance Myth)', beginner: 'Beginners often think Linked Lists are fast because they can grow anywhere. In reality, Linked Lists scatter nodes randomly all over RAM, causing constant CPU cache misses. A `std::vector` is almost ALWAYS faster because its memory is contiguous!', advanced: 'Pointer chasing in node-based containers (std::list, std::map) causes cache thrashing. Dense arrays/vectors maximize hardware cache prefetching.' },
      { title: '4. Profiling & Optimization Mindset', beginner: 'Never guess where your code is slow—measure it! Use profiling tools like Valgrind, gprof, or modern IDE profilers to inspect CPU bottlenecks and memory footprints before optimizing.', advanced: 'Premature optimization is the root of all evil. Profile first, identify cache misses or algorithmic bottlenecks, and optimize hot loops scientifically.' }
    ],
    {
      title: 'The Elite C++ Architectural Review',
      intro: 'Review your complete journey across 30 foundational lessons and understand elite hardware optimization.',
      steps: [
        'Reflect on your progression from basic `std::cout` compilers in Lesson 1 all the way to advanced memory layouts in Lesson 30.',
        'Review how choosing `std::vector` over scattered pointer structures maximizes CPU cache locality.',
        'Ensure all dynamic allocations in your projects are wrapped in smart pointers, utilizing RAII for 100% leak-free execution.',
        'You have mastered C++ Foundations, Object-Oriented Programming, and Modern C++ Memory Mastery. Welcome to the elite tier!'
      ],
      goal: 'You successfully completed the entire 30-lesson C++ track, mastering memory layouts, cache optimization, and elite systems engineering.'
    },
    [
      q('Why is `std::vector` generally much faster in performance-critical loops than a Linked List (`std::list`)?', ['Vectors use more RAM', 'Vectors store elements contiguously in memory, maximizing CPU cache locality and preventing cache misses', 'Linked lists cannot hold integers', 'Vectors use smart pointers'], 1, 'Contiguous memory layout allows the CPU cache prefetcher to load subsequent elements instantly, whereas linked lists scatter nodes randomly across RAM.'),
      q('What is a "Cache Miss" in computer hardware?', ['When you forget your computer password', 'When the CPU looks for data in its fast local cache, fails to find it, and is forced to wait for a slow retrieval from main RAM', 'When a pointer is set to nullptr', 'When an exception is thrown'], 1, 'Cache misses stall the CPU pipeline while waiting for memory buses to fetch data from RAM, heavily degrading application performance.'),
      q('What is the golden rule of software optimization?', ['Always rewrite your code in assembly', 'Never guess where code is slow—profile first to identify actual bottlenecks before optimizing', 'Never use functions', 'Use as many global variables as possible'], 1, 'Premature optimization wastes engineering time. Profiling tools provide empirical data on where bottlenecks actually reside.'),
      q('What design pattern ensures 100% leak-free, exception-safe resource management across your entire C++ codebase?', ['Garbage Collection', 'RAII (Resource Acquisition Is Initialization) combined with Smart Pointers', 'Infinite while loops', 'Global variables'], 1, 'RAII ties resource lifecycles strictly to stack scopes, eliminating memory and handle leaks deterministically.')
    ],
    ['Contiguous memory structures (std::vector) maximize CPU cache locality and speed.', 'Scattered node structures (linked lists) cause cache misses and slow down high-performance loops.', 'Always profile your code using tools like Valgrind or profilers before attempting optimization.', 'You have completed the entire 30-lesson C++ track! You are now ready to build elite, high-performance software.']
  ) 
];

export const getCppLessonById = (id: string): CppLesson | undefined =>
  CPP_LESSONS.find(l => l.id === id);

export const isCppLessonUnlocked = (id: string, completedLessons: string[]): boolean => {
  const idx = CPP_LESSONS.findIndex(l => l.id === id);
  if (idx <= 0) return true;
  return completedLessons.includes(CPP_LESSONS[idx - 1].id);
};
  
