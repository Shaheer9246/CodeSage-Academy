// =============================================================================
// C++ TRACK — 40 lessons (beginner → advanced) 
// =============================================================================
import type { NetworkingLesson, Concept, QuizQuestion } from './networkingLessons';
export type CppLesson = NetworkingLesson;

const L = (
id: string, order: number, title: string, icon: string, philosophy: string,
concepts: Concept[], practical: CppLesson['practical'], quiz: QuizQuestion[],
keyTakeaways: string[], terminalNotice?: string
): CppLesson => ({
id, module: 'Module 1: C++ Foundations', order, title, icon, philosophy,
concepts, practical, quiz, keyTakeaways, terminalNotice,
});

const q = (question: string, options: string[], correctIndex: number, explanation?: string): QuizQuestion =>
({ question, options, correctIndex, explanation });

export const CPP_LESSONS: CppLesson[] = [
L(
'cpp-01', 1, 'Hello C++: The Compilation Pipeline', '🚀',
'🚀 Every C++ program begins life as plain text and ends as pure machine code. Unlike Python, there is no interpreter babysitting your program at runtime — the compiler translates everything ahead of time, which is exactly why C++ runs at blistering speed. Today you install the toolchain, write your first program, and learn what actually happens between pressing "compile" and seeing output.',
[
{ title: '1. From Text to Machine: The Compiler', beginner: 'Think of the compiler as an extremely strict translator. Your computer\'s processor only understands 1s and 0s. The compiler reads your English-like C++ text and translates the WHOLE file into machine instructions before the program ever runs. If you make a spelling mistake, it refuses to translate and tells you exactly which line is wrong.', advanced: 'C++ is an ahead-of-time compiled language. The source file passes through the preprocessor (macros and includes), then the compiler proper (lexing, parsing, semantic analysis, optimization), emitting assembly that the assembler turns into an object file (`.o` / `.obj`). Because translation happens before execution, type errors are caught at compile time and carry zero runtime cost.' },
{ title: '2. The Linker: Stitching Object Files', beginner: 'After translating, you have separate "pages" of machine code. The linker is the bookbinder: it glues your pages together with pages from libraries (like the code that prints text) into one finished executable book.', advanced: 'The linker resolves symbols across translation units: every function call must match exactly one definition. A call with no definition produces the classic `undefined reference` linker error; two definitions of the same symbol violate the One Definition Rule (ODR). Understanding this split (compile vs link) is how professionals diagnose build failures instantly.' },
{ title: '3. main() & Exit Codes', beginner: 'Every C++ program MUST have a function called `main()`. It is the starting line of the race. When you run the program, the computer jumps straight to `main()` and executes its curly-brace block. The `return 0;` at the end is your program telling the operating system: "Everything went fine."', advanced: '`int main()` is the implementation-defined entry point. Its integer return value becomes the process exit status consumed by shells, scripts, and CI pipelines: `0` signals success, any non-zero value signals failure. This is why `return 0;` is a contract with the operating system, not decoration.' },
{ title: '4. #include & the Standard Library', beginner: 'Core C++ is so lightweight it doesn\'t even know how to print to a screen! Writing `#include <iostream>` at the top borrows the official input/output toolbox so `std::cout` exists. No include, no printing.', advanced: '`#include` is a purely textual preprocessor operation: the header\'s contents are pasted into your source before compilation. Headers provide declarations (signatures), while definitions live in pre-compiled library binaries the linker attaches later. This is why `<iostream>` is "free" to include but still costs compile time.' },
{ title: '5. Translation Units & Build Speed (Expert Teaser)', beginner: 'In a big project, each `.cpp` file is translated separately, like separate chefs cooking separate dishes. Because they are independent, the computer can cook many of them at the same time, which is how huge games get built in minutes instead of days.', advanced: '*(Pro Track Preview)* Each `.cpp` plus its included headers forms one Translation Unit (TU), compiled independently — enabling parallel builds but also causing massive redundant parsing. C++20 Modules replace textual inclusion with compiled binary interfaces, cutting build times dramatically. The Expert track dissects TUs, ODR, and module partitions.' }
],
{
title: 'Workstation Setup & First Compilation',
intro: '⚠️ This practical installs your local C++ toolchain (the equivalent of Python\'s Lesson 1 setup) and walks you through compiling, running, and deliberately breaking your first program.',
steps: [
'Install a compiler. WINDOWS: install MSYS2 (or MinGW) to get `g++`, or install Visual Studio with the "C++ workload". MAC: run `xcode-select --install` to get Clang. LINUX: run `sudo apt install build-essential`.',
'Verify it: open your terminal and type `g++ --version` (or `clang++ --version`). You should see a version banner print out.',
'Create a file named `hello.cpp` in your text editor.',
'Type exactly: `#include <iostream>` then on the next line `int main() {` then `    std::cout << "Hello World!" << std::endl;` then `    return 0;` then `}`.',
'Save it, then in your terminal navigate to that folder and compile: `g++ hello.cpp -o hello`. Expect: silence. No output means success — a new executable file just appeared.',
'Run it: type `./hello` (Mac/Linux) or `hello.exe` (Windows). You should see `Hello World!` printed.',
'Now break it on purpose: change `std::cout` to `std::cot`, save, and recompile. Read the compiler error — it names the file and line. Fix it.',
'Break it at link time: add a line `missingFunction();` inside main, recompile, and observe the `undefined reference` LINKER error. Then delete that line and recompile clean.'
],
goal: 'You installed a C++ compiler, compiled source into a binary executable, ran it, and learned to distinguish compiler errors from linker errors.'
},
[
q('Why must C++ code be compiled before it can run?', ['To compress the file so it downloads faster', 'To translate human-readable C++ text into native machine code the processor can execute directly', 'To connect the program to the internet', 'To make the text editor highlight colors'], 1, 'C++ is ahead-of-time compiled: the compiler converts your source into machine instructions before execution, which is why C++ binaries run at native speed with no interpreter. **Why others are wrong:** Compilation has nothing to do with compression, networking, or editor syntax highlighting.'),
q('Which build stage is responsible for combining your object file with library code into a single executable?', ['The preprocessor', 'The compiler', 'The linker', 'The debugger'], 2, 'The linker resolves symbols across translation units and stitches object files plus library binaries into one executable. **Why others are wrong:** The preprocessor only handles `#include`/macros, the compiler only translates one translation unit, and the debugger runs after the build.'),
q('What does `return 0;` at the end of `main()` communicate?', ['It returns zero dollars to the user', 'It signals to the operating system that the process finished successfully', 'It deletes all variables', 'It restarts the program'], 1, 'The integer returned from `main()` becomes the process exit status: `0` means success, non-zero means failure — shells and CI systems read this code. **Why others are wrong:** It does not involve money, memory deletion, or restarting; it is purely an OS-level status contract.'),
q('What does `#include <iostream>` actually do?', ['It downloads the internet library at runtime', 'It textually pastes the input/output declarations into your file before compilation so `std::cout` exists', 'It creates an infinite loop', 'It shuts down the compiler after use'], 1, '`#include` is a preprocessor textual inclusion: the header\'s declarations are inserted into your source, giving the compiler the signatures for `std::cout` and `std::cin`. **Why others are wrong:** Nothing is downloaded at runtime, no loop is created, and the compiler is not shut down.'),
q('You see `undefined reference to \'calculate()\'` when building. What does this mean?', ['You misspelled a variable name', 'The compiler found a declaration but the linker never found the function\'s definition', 'The file is too large', 'You forgot `#include <iostream>`'], 1, 'This is a LINKER error: the call compiled fine (a declaration was visible) but no object file provided the actual definition of `calculate()`. **Why others are wrong:** Misspelled variables and missing includes produce compiler errors, not linker errors, and file size is irrelevant.')
],
['C++ is compiled ahead of time into native machine code — no interpreter at runtime.', 'The linker stitches object files and libraries into one executable; `undefined reference` is a link-stage error.', 'Every program starts at int main() and reports success with return 0.', '#include <iostream> borrows the standard input/output toolbox.', 'Each .cpp file is an independent translation unit, enabling parallel compilation.'],
'We now have a built-in terminal right here! However, C++ requires a real native compiler — for the best experience use your computer\'s own terminal (CMD/PowerShell/Terminal). The practical below contains full setup instructions to install a C++ compiler (GCC/Clang/MSVC) on your machine.'
),

L(
'cpp-02', 2, 'Variables & Core Data Types', '📦',
'📦 In C++ you must tell the compiler exactly what kind of data every variable holds before you use it. This is not bureaucracy — it is how the compiler knows precisely how many bytes of RAM to reserve. Master the core types and you control memory itself.',
[
{ title: '1. Static Typing & Declaration', beginner: 'In C++, variables are strict containers. If you label a box "integers only", you cannot put a word inside it! You write the type first, then the name: `int age = 20;`. The type can never change later.', advanced: 'C++ is statically typed: types are checked at compile time and each variable\'s type fixes its memory footprint and permitted operations. This eliminates entire classes of runtime type errors and enables aggressive compiler optimization.' },
{ title: '2. The Integer Family', beginner: 'Use `int` for whole numbers like `int score = 100;`. C++ also offers smaller and bigger integer boxes: `short`, `long`, and `long long` for truly huge counts.', advanced: 'Integral types differ in width: `short` ≥ 16 bits, `int` ≥ 16 (32 on most platforms), `long` ≥ 32, `long long` ≥ 64. Choosing the right width is a memory-vs-range tradeoff; `<cstdint>` provides exact-width aliases like `int32_t` for portable code.' },
{ title: '3. Decimals: float & double', beginner: 'Use `double` for numbers with decimal points, like `double price = 19.99;`. There is also `float`, but it holds fewer digits — `double` is the default choice.', advanced: 'Floating-point types follow IEEE 754: `float` is 32-bit single precision (~7 digits), `double` is 64-bit double precision (~15 digits). Binary floating point cannot represent 0.1 exactly, which is why `0.1 + 0.2 != 0.3` — compare with an epsilon, never with `==`.' },
{ title: '4. char, bool & Text via std::string', beginner: 'Use `char` for ONE letter in single quotes: `char grade = \'A\';`. Use `bool` for `true`/`false`. For whole sentences use `std::string name = "Sage";` (needs `#include <string>`), and grab keyboard input with `std::cin >> name;`.', advanced: '`char` is a 1-byte integer holding an ASCII/UTF-8 code point; `bool` is 1 byte storing 0/1. `std::string` is a standard-library class managing a dynamic character buffer on the heap, and `std::cin >>` uses the overloaded extraction operator, stopping at whitespace.' },
{ title: '5. sizeof & Fixed-Width Types (Expert Teaser)', beginner: 'You can ask C++ exactly how many bytes any type occupies by writing `sizeof(int)`. It prints the size like a measuring tape for memory.', advanced: '*(Pro Track Preview)* `sizeof` is evaluated at compile time. Widths are platform-dependent, which is why professional code uses `<cstdint>` (`uint8_t`, `int64_t`) for file formats and network protocols. The Expert track covers struct padding and alignment that make `sizeof(struct)` surprising.' }
],
{
title: 'The Type X-Ray Machine',
intro: 'Write a program that measures every core type with sizeof, exposes floating-point precision limits, and reads user input.',
steps: [
'Create `types.cpp` and include `<iostream>` and `<string>`.',
'Inside `main()`, print sizes: `std::cout << "int: " << sizeof(int) << " bytes" << std::endl;` and repeat for `double`, `char`, `bool`.',
'Expect on a typical machine: int 4, double 8, char 1, bool 1.',
'Add a precision demo: `std::cout << (0.1 + 0.2) << std::endl;` and observe it prints `0.3` (rounded) — then add `if (0.1 + 0.2 == 0.3) std::cout << "equal"; else std::cout << "NOT equal";` and expect `NOT equal`.',
'Declare `std::string name; int age;`, prompt with `std::cout`, and read with `std::cin >> name >> age;`.',
'Print them back: `std::cout << name << " is " << age << std::endl;`.',
'Compile with `g++ types.cpp -o types` and run `./types` (or `types.exe`). Feed it input like `Sage 25` and verify the echo.'
],
goal: 'You measured type memory footprints with sizeof, witnessed IEEE 754 precision limits firsthand, and performed typed console I/O.'
},
[
q('What does it mean that C++ is statically typed?', ['Variables can change type at runtime', 'Every variable\'s type is declared and checked at compile time and never changes', 'C++ cannot store text', 'Types are guessed by the CPU'], 1, 'Static typing fixes each variable\'s type at compile time, letting the compiler reserve exact memory and reject type errors before execution. **Why others are wrong:** C++ variables cannot change type, text is fully supported via std::string, and the CPU does not guess types.'),
q('On a typical modern desktop, what does `sizeof(double)` evaluate to?', ['4', '8', '1', '16'], 1, '`double` is a 64-bit (8-byte) IEEE 754 double-precision float on virtually all modern platforms. **Why others are wrong:** 4 bytes is `float`/`int`, 1 byte is `char`/`bool`, and 16 is not a standard double width.'),
q('Why does `0.1 + 0.2 == 0.3` evaluate to false in C++?', ['The compiler is broken', 'Binary floating point cannot represent 0.1 and 0.2 exactly, so tiny rounding errors accumulate', 'Decimals are stored as text', 'The == operator only works on integers'], 1, 'IEEE 754 stores fractions in binary; 0.1 and 0.2 have infinite binary expansions, so their sum differs from 0.3 by ~1e-17. **Why others are wrong:** The compiler is fine, decimals are not text, and `==` works on floats (it is just unsafe for equality checks).'),
q('What is stored in memory when you write `char grade = \'A\';`?', ['The letter as a picture', 'The integer ASCII code 65 in one byte', 'A 4-byte unicode block', 'A pointer to the alphabet'], 1, '`char` is a 1-byte integer type; \'A\' is stored as its ASCII code 65. **Why others are wrong:** Characters are not images or unicode blocks at the `char` level, and no pointer to an alphabet exists.'),
q('Which operator feeds keyboard input from `std::cin` into a variable?', ['<<', '>>', '==', '::'], 1, 'The extraction operator `>>` pulls data out of the input stream and into your variable. **Why others are wrong:** `<<` inserts into output streams, `==` compares, and `::` resolves scope.')
],
['Declare every variable with an explicit type: int, double, char, bool, or std::string.', 'sizeof reveals the exact byte footprint of any type at compile time.', 'double is the default decimal type; never compare floats with ==.', 'char stores a 1-byte integer code; std::string manages real text.', 'std::cin >> reads typed input using the extraction operator.'],
'If you want to use a big terminal, use your CMD. Full guide is in Lesson 1.'
),

L(
'cpp-03', 3, 'Operators & Type Conversions', '🧮',
'🧮 Operators are the verbs of C++ mathematics — but C++ follows hardware rules, not school rules. Divide two integers and the decimals vanish. Mix types and the compiler silently converts them. Learn the rules and the traps before they bite you.',
[
{ title: '1. Arithmetic & Integer Truncation', beginner: 'C++ does addition `+`, subtraction `-`, multiplication `*`, and division `/`. But beware: `10 / 3` gives `3`, not `3.33`! When BOTH sides are integers, C++ chops the decimal away entirely.', advanced: 'Integer division truncates toward zero because the ALU produces an integral quotient. To get real division, at least one operand must be floating point: `10.0 / 3` or `static_cast<double>(10) / 3`.' },
{ title: '2. The Modulo Operator (%)', beginner: 'Modulo `%` gives the REMAINDER: `10 % 3` is `1`. It is the classic trick for detecting even/odd numbers (`n % 2 == 0`).', advanced: '`%` is defined only for integral operands; using it on doubles is a compile error (use `std::fmod`). Negative modulo semantics follow the sign of the dividend in C++, which surprises developers porting from Python.' },
{ title: '3. Increment, Decrement & Prefix vs Postfix', beginner: 'Instead of `score = score + 1`, write `score++` or `++score`. They both add 1 — but in bigger expressions, `++score` adds first then uses, while `score++` uses first then adds.', advanced: 'Prefix `++x` increments and yields the new value; postfix `x++` yields a copy of the OLD value then increments. In tight loops over iterators the postfix copy historically cost performance, which is why `++it` is idiomatic C++.' },
{ title: '4. Comparison & the = vs == Trap', beginner: 'To ask questions use `==` (equal), `!=` (not equal), `>`, `<`, `>=`, `<=`. These return `true`/`false`. The deadliest beginner bug: writing `if (x = 5)` (assignment) instead of `if (x == 5)` (comparison).', advanced: 'Assignment expressions yield the assigned value, which contextually converts to bool — `if (x = 5)` is always true and silently corrupts state. Modern compilers warn with `-Wall`; treat warnings as errors in professional builds.' },
{ title: '5. Casting & Overflow (Expert Teaser)', beginner: 'You can force a type change with a cast: `static_cast<double>(7) / 2` gives `3.5`. Without it, C++ converts types silently using its own rules.', advanced: '*(Pro Track Preview)* Implicit conversions (int → double) are safe widening; double → int is narrowing and truncates. Signed integer overflow is UNDEFINED BEHAVIOR in C++ — the compiler may assume it never happens and optimize "impossible" branches away. The Expert track weaponizes UB knowledge.' }
],
{
title: 'The Precision Converter',
intro: 'Build a temperature converter that proves integer truncation, then fixes it with casting, and demos prefix vs postfix.',
steps: [
'Create `math_demo.cpp` with `<iostream>`.',
'Declare `int celsius = 25;`.',
'Compute wrong: `int fWrong = (celsius * 9 / 5) + 32;` and print it. Expect 77 (integer math happens to work here) — now try `int half = celsius / 2;` and print: expect 12, not 12.5.',
'Compute right: `double fRight = (static_cast<double>(celsius) * 9.0 / 5.0) + 32.0;` and print. Expect 77.',
'Demo postfix: `int x = 5; std::cout << x++ << std::endl;` expect it prints 5, then `std::cout << x << std::endl;` prints 6.',
'Demo prefix: `int y = 5; std::cout << ++y << std::endl;` expect 6 immediately.',
'Compile `g++ math_demo.cpp -o math_demo` and run it; verify every expected number matches.'
],
goal: 'You observed integer truncation, corrected it with static_cast, and distinguished prefix from postfix increment semantics.'
},
[
q('What is the result of `7 / 2` when both operands are `int`?', ['3.5', '4', '3', 'A compile error'], 2, 'Integer division truncates toward zero, discarding the fractional part: 7/2 == 3. **Why others are wrong:** 3.5 requires a floating operand, 4 would be rounding (C++ truncates), and this is perfectly legal code.'),
q('What does `10 % 3` evaluate to?', ['3', '1', '0.33', '30'], 1, 'Modulo returns the remainder after integer division: 10 = 3*3 + 1, so the remainder is 1. **Why others are wrong:** 3 is the quotient, 0.33 is a decimal division, and 30 is multiplication.'),
q('Given `int x = 5; std::cout << x++;`, what prints?', ['6', '5', '4', 'Nothing'], 1, 'Postfix increment yields the OLD value (5) to the stream, then increments x to 6 afterwards. **Why others are wrong:** 6 would be prefix `++x`; 4 is decrement; the expression absolutely prints.'),
q('How do you force true decimal division of two integers `a` and `b`?', ['a // b', 'static_cast<double>(a) / b', 'a / b with a comment', 'decimal(a / b)'], 1, 'Casting one operand to double promotes the whole expression to floating point division. **Why others are wrong:** `//` is not a C++ operator, comments change nothing, and `decimal()` does not exist in C++.'),
q('Why is `if (x = 5) { ... }` dangerous?', ['It is a syntax error always', 'It assigns 5 to x and the condition evaluates to true, silently skipping the comparison you intended', 'It compares x to 5 correctly', 'It deletes x'], 1, 'Assignment yields 5, which converts to `true`, so the branch always runs and x is corrupted — a classic logic bug. **Why others are wrong:** It compiles (often with a warning), it does not compare, and it does not delete anything.')
],
['Integer division truncates decimals; cast to double for real division.', 'Modulo (%) yields remainders — perfect for even/odd logic.', 'Prefix ++x increments before use; postfix x++ uses then increments.', 'Never confuse = (assignment) with == (comparison) inside conditions.', 'Signed integer overflow is undefined behavior — respect type ranges.'],
'If you want to use a big terminal, use your CMD. Full guide is in Lesson 1.'
),

L(
'cpp-04', 4, 'Conditional Logic & Short-Circuit Evaluation', '🚦',
'🚦 Programs become intelligent the moment they can choose. C++ conditionals route execution down different paths — and its logical operators are smarter than they look: they stop evaluating the instant the answer is already known, which professionals exploit to prevent crashes.',
[
{ title: '1. The if Statement & Truthiness', beginner: 'An `if` checks a condition in parentheses. If it is true, the code inside the curly braces runs; otherwise it is skipped. In C++, any non-zero number counts as true, and zero counts as false.', advanced: 'Conditions contextually convert to bool: non-zero integrals, non-null pointers, and non-empty stream states are true; `0` and `nullptr` are false. This is why `if (ptr)` is the idiomatic null check.' },
{ title: '2. else & else-if Ladders', beginner: 'Attach `else` for the backup plan when the condition fails. Chain multiple checks with `else if`. Only ONE branch in the whole ladder ever runs — the first one whose condition is true.', advanced: 'An if/else-if ladder forms mutually exclusive branches; the compiler may emit a jump table or branch predictions. Order matters: put the most likely or most specific condition first for both correctness and performance.' },
{ title: '3. Logical AND (&&) & Short-Circuiting', beginner: '`&&` means BOTH sides must be true. The magic trick: if the left side is false, C++ never even looks at the right side — the answer is already decided.', advanced: 'Short-circuit evaluation guarantees the right operand of `&&` is skipped when the left is false. Professionals write guards like `if (ptr != nullptr && ptr->value > 10)` — dereferencing only happens when the pointer is valid, preventing segmentation faults.' },
{ title: '4. Logical OR (||) & NOT (!)', beginner: '`||` means AT LEAST ONE side true (if the left is true, the right is skipped). `!` flips a condition: `!true` is `false`. Combine them to express any rule.', advanced: '`||` short-circuits on a true left operand. De Morgan\'s laws let you rewrite `!(a && b)` as `!a || !b` — essential when simplifying guard clauses in production code.' },
{ title: '5. The Ternary Operator (Expert Teaser)', beginner: 'For tiny decisions, C++ offers a one-line shortcut: `std::string label = (age >= 18) ? "adult" : "minor";`. It picks one of two values based on a condition.', advanced: '*(Pro Track Preview)* The conditional operator `?:` yields a value (unlike if/else which is a statement), enabling concise initialization and `constexpr` branching. Misusing nested ternaries harms readability — professional style guides cap them at one level.' }
],
{
title: 'The Theme Park Bouncer',
intro: 'Build a ride-access checker that combines &&, ||, and ! with a short-circuit null-guard demo.',
steps: [
'Create `bouncer.cpp` with `<iostream>`.',
'Declare `int age; double height;` and read them with `std::cin >> age >> height;`.',
'Write: `if (age >= 12 && height > 50.0) { std::cout << "Welcome aboard!"; }`.',
'Add: `else if (height <= 50.0) { std::cout << "Too short for this ride."; }`.',
'Add: `else { std::cout << "Cannot ride today."; }`.',
'Test with input `10 40` (expect "Too short"), `15 60` (expect "Welcome"), `20 45` (expect "Too short").',
'Bonus guard demo: declare `int* ptr = nullptr;` and write `if (ptr != nullptr && *ptr > 10) std::cout << "big";` — run it and observe it does NOT crash, proving short-circuit protection.',
'Compile `g++ bouncer.cpp -o bouncer` and run all three test inputs.'
],
goal: 'You routed execution with mutually exclusive branches and used short-circuit evaluation to safely guard a null pointer dereference.'
},
[
q('What happens when an `if` condition evaluates to false?', ['The program crashes', 'The compiler converts it to true', 'The block inside the if is skipped entirely', 'The program restarts'], 2, 'A false condition simply bypasses the guarded block and execution continues after it. **Why others are wrong:** False conditions are normal control flow — no crash, no conversion, no restart.'),
q('How do you require that BOTH condition A and condition B are true?', ['if (A || B)', 'if (A && B)', 'if (A + B)', 'if (A == B)'], 1, 'The logical AND `&&` is true only when both operands are true. **Why others are wrong:** `||` needs only one true, `+` is arithmetic, and `==` compares equality.'),
q('What is short-circuit evaluation?', ['The CPU overheats and stops', 'Writing one statement on multiple lines', 'Skipping evaluation of the right operand of && or || once the result is already determined by the left operand', 'An if without an else'], 2, 'C++ evaluates left-to-right and stops as soon as the logical outcome is fixed — e.g. `false && anything` never evaluates `anything`. **Why others are wrong:** It is not hardware behavior, formatting, or a missing else branch.'),
q('Which operator reverses a boolean value?', ['-', '!', '~', '!='], 1, 'The logical NOT `!` flips true to false and vice versa. **Why others are wrong:** `-` is arithmetic negation, `~` is bitwise NOT, and `!=` is inequality comparison.'),
q('In an if / else-if / else ladder, how many branches execute?', ['All of them', 'Exactly one — the first whose condition is true (or the else)', 'Two at most', 'Zero always'], 1, 'Ladders are mutually exclusive: control enters the first true branch and skips the rest, with else as the fallback. **Why others are wrong:** Multiple branches never run, and else guarantees one runs when nothing matched.')
],
['if executes a block only when its condition is true; non-zero counts as true.', 'else-if ladders are mutually exclusive — only one branch runs.', '&& and || short-circuit: the right side may never be evaluated.', 'Use ptr != nullptr && ptr->x as a crash-proof guard pattern.', '! flips truth; the ternary ?: yields a value for tiny decisions.'],
'If you want to use a big terminal, use your CMD. Full guide is in Lesson 1.'
),

L(
'cpp-05', 5, 'Switch Statements & Scoped Enumerations', '🔀',
'🔀 When you route on one discrete value — a menu choice, a state code, a key press — long else-if ladders are slow and ugly. The switch statement compiles into a jump table, and scoped enumerations give your magic numbers real names. Together they are the backbone of state machines.',
[
{ title: '1. The switch Construct', beginner: 'A `switch(choice)` looks at ONE value and jumps straight to the matching `case` label, like a train switching tracks. No repeated comparisons needed.', advanced: '`switch` requires an integral or enumeration expression. Compilers often lower dense case ranges into a jump table — an O(1) dispatch — making switches measurably faster than sequential if-else chains.' },
{ title: '2. case Labels & break', beginner: 'Each `case 1:` is a destination label. WARNING: after running a matched case, execution FALLS THROUGH into the cases below unless you end it with `break;`. Forgetting break is one of the most classic C++ bugs.', advanced: 'Case labels must be compile-time constants. Fallthrough is deliberate in the language (shared logic), but accidental fallthrough is such a common defect that compilers warn and C++17 added `[[fallthrough]]` to mark intentional cases.' },
{ title: '3. The default Case', beginner: '`default:` is the safety net at the bottom — it runs when no case matches, exactly like a final `else`. Always include it to handle garbage input.', advanced: '`default` may appear anywhere in the block but conventionally ends it. Omitting it on an exhaustive enum switch enables compiler warnings (`-Wswitch`) that catch unhandled enumerators at compile time.' },
{ title: '4. Scoped Enumerations (enum class)', beginner: 'Instead of magic numbers, name your options: `enum class Choice { Cola, Water, Chips };`. Now `Choice::Cola` reads like English and the compiler blocks nonsense comparisons.', advanced: '`enum class` scopes enumerators behind the type name and forbids implicit conversion to int (unlike plain `enum`), eliminating name collisions and accidental arithmetic. You can fix the underlying type: `enum class Choice : uint8_t`.' },
{ title: '5. Switch on Enums & State Machines (Expert Teaser)', beginner: 'Game developers combine enum class + switch to build "state machines": a player is exactly one of Menu, Playing, or Paused, and a switch routes the logic for each.', advanced: '*(Pro Track Preview)* Exhaustive switches over `enum class` plus `-Wswitch` give compile-time proof that every state is handled. The Expert track builds full finite state machines and visitor patterns on this foundation.' }
],
{
title: 'The Vending Machine',
intro: 'Build a menu driven by a scoped enum and a switch, then deliberately trigger the fallthrough bug and fix it.',
steps: [
'Create `vending.cpp` with `<iostream>`.',
'Above main, declare: `enum class Choice { Cola = 1, Water = 2, Chips = 3 };`.',
'In main, read an int: `int input; std::cin >> input;` and convert: `Choice c = static_cast<Choice>(input);`.',
'Write `switch (c) {` with `case Choice::Cola: std::cout << "Dispensing Cola"; break;` and same for Water and Chips.',
'Add `default: std::cout << "Invalid selection"; break;` and close with `}`.',
'BUG DEMO: temporarily delete the `break;` from the Cola case, compile, run with input `1`, and watch it print Cola AND Water AND Chips (fallthrough).',
'Restore the break, recompile, and verify input `1` prints only "Dispensing Cola" and input `9` prints "Invalid selection".',
'Compile with `g++ vending.cpp -o vending` and test inputs 1, 2, 3, and 9.'
],
goal: 'You dispatched on a scoped enum with an O(1) switch, experienced the fallthrough bug firsthand, and hardened the machine with default.'
},
[
q('Which types are permitted inside `switch (x)` in C++?', ['std::string only', 'double only', 'Integral types and enumerations (int, char, enum)', 'Any type'], 2, 'Switch requires an integral or enumeration expression because jump tables need discrete integer indices. **Why others are wrong:** Strings and doubles cannot index a jump table and are rejected at compile time.'),
q('What happens if you omit `break;` at the end of a matched case?', ['A compile error always', 'Execution falls through and runs the following cases too', 'It jumps to default', 'The program exits'], 1, 'Without break, control continues into subsequent case bodies — the classic fallthrough bug. **Why others are wrong:** It compiles fine, does not redirect to default, and does not terminate the program.'),
q('What is the role of the `default:` label?', ['It runs first, before all cases', 'It catches every value that matched no explicit case, like a final else', 'It defines the variable type', 'It frees memory'], 1, '`default` is the fallback branch for unmatched values, guaranteeing graceful handling of unexpected input. **Why others are wrong:** It does not run first, define types, or manage memory.'),
q('Why prefer `enum class` over plain `enum`?', ['It runs faster at runtime', 'It scopes enumerators and forbids implicit int conversion, preventing collisions and accidental arithmetic', 'It allows string values', 'It is required by the linker'], 1, 'Scoped enums namespace their enumerators (`Choice::Cola`) and are type-safe: no implicit conversion to integers, no enumerator name leakage. **Why others are wrong:** Runtime speed is identical, enums still hold integers, and the linker is indifferent.'),
q('Why can a switch be faster than a long if-else chain?', ['It uses the internet', 'Compilers lower dense cases into a jump table giving O(1) dispatch instead of sequential comparisons', 'It skips the CPU', 'It caches variables in the hard drive'], 1, 'A jump table indexes directly into code addresses by case value — constant time regardless of case count. **Why others are wrong:** Networking, skipping the CPU, and disk caching are nonsense in this context.')
],
['switch dispatches on one integral/enum value, often via an O(1) jump table.', 'Always end cases with break unless fallthrough is intentional ([[fallthrough]]).', 'default: catches unmatched input — never omit it in user-facing menus.', 'enum class gives magic numbers names, scope, and type safety.', 'Exhaustive enum switches + -Wswitch catch unhandled states at compile time.'],
'If you want to use a big terminal, use your CMD. Full guide is in Lesson 1.'
),

L(
'cpp-06', 6, 'Loops & Iteration Patterns', '🔄',
'🔄 Repetition is where computers earn their keep. C++ gives you three loop shapes — while, do-while, and for — each engineered for a different kind of repetition. Choose wrong and you get infinite loops or skipped work; choose right and massive work becomes one line.',
[
{ title: '1. The while Loop (Pre-Test)', beginner: 'A `while (condition)` loop checks FIRST, then runs. As long as the condition stays true, it repeats. If the condition starts false, the body never runs even once.', advanced: '`while` is a pre-test loop: the condition is evaluated before every iteration, making it ideal for sentinel-controlled repetition where the iteration count is unknown upfront.' },
{ title: '2. The do-while Loop (Post-Test)', beginner: '`do { ... } while (condition);` runs the body FIRST and checks at the bottom. This guarantees the code executes at least once — perfect for asking the user for input before validating it.', advanced: 'As a post-test loop, do-while guarantees one execution, which maps cleanly to input-validation and menu loops. Note the mandatory trailing semicolon after the condition — a frequent syntax trap.' },
{ title: '3. The for Loop & Counter Scope', beginner: '`for (int i = 0; i < 10; i++)` packs start, condition, and step into one line. The counter `i` exists ONLY inside the loop — it vanishes afterwards, keeping your code clean.', advanced: 'The for-init statement scopes the loop variable to the loop body, preventing leakage and name collisions. The three clauses (init; condition; increment) evaluate in a fixed order: init once, condition before each pass, increment after each pass.' },
{ title: '4. break, continue & Nested Loops', beginner: '`break` smashes out of the loop immediately. `continue` skips the REST of the current pass and jumps to the next iteration. In nested loops, they only affect the INNERMOST loop they sit in.', advanced: '`break`/`continue` bind to the nearest enclosing loop only; exiting multiple levels requires flags, returns, or goto (rarely). `continue` in a for loop still executes the increment clause — a subtle but vital detail.' },
{ title: '5. Infinite Loops & CPU Cost (Expert Teaser)', beginner: 'If the condition never becomes false, the loop runs forever and your computer fan screams. Always ensure something inside the loop moves toward the exit.', advanced: '*(Pro Track Preview)* A tight `while(true)` pegs one CPU core at 100%. Event loops intentionally run forever but MUST block on I/O or sleep between polls. The Expert track covers spin-waits vs blocking waits and cache-line contention in hot loops.' }
],
{
title: 'The Guessing Game & Multiplication Grid',
intro: 'Build a number guessing game with while, validate input with do-while, and print a filtered multiplication table with nested for + continue.',
steps: [
'Create `loops.cpp` with `<iostream>`.',
'Game: `int secret = 7; int guess = 0;` then `while (guess != secret) { std::cout << "Guess: "; std::cin >> guess; }` followed by `std::cout << "You won!";`.',
'Validation: add `int n; do { std::cout << "Enter 1-10: "; std::cin >> n; } while (n < 1 || n > 10);` — run and feed it 99 first, then 5; expect it to re-prompt once.',
'Grid: `for (int r = 1; r <= 3; r++) { for (int c = 1; c <= 4; c++) { if (c == 3) continue; std::cout << r * c << " "; } std::cout << std::endl; }`.',
'Expect row 1 to print `1 2 4` (column 3 skipped by continue).',
'Compile `g++ loops.cpp -o loops`, run it, and play through all three sections verifying outputs.'
],
goal: 'You exercised all three loop shapes, controlled iteration with break/continue, and reasoned about nested loop scope.'
},
[
q('What is the key difference between while and do-while?', ['while is faster', 'do-while checks the condition at the bottom, guaranteeing at least one execution; while checks first', 'do-while cannot use break', 'They are identical'], 1, 'do-while is post-test: the body always runs once before the condition is evaluated. while is pre-test and may run zero times. **Why others are wrong:** Speed is identical, break works in both, and their semantics differ fundamentally.'),
q('What causes an infinite loop?', ['Using for instead of while', 'A condition that never becomes false because nothing inside moves toward the exit', 'Declaring too many variables', 'Using break'], 1, 'If the loop body never changes state so the condition flips false, iteration never terminates and the core spins at 100%. **Why others are wrong:** Loop kind and variable count are irrelevant, and break is the escape hatch, not the cause.'),
q('In `for (int i = 0; i < 5; i++)`, when does `i++` execute?', ['Before the first check', 'After each pass through the loop body', 'Only once at the end', 'Never'], 1, 'The increment clause runs after every iteration of the body, before the next condition check. **Why others are wrong:** Init runs once before, the increment runs per pass, not once at the end.'),
q('Inside a nested loop, what does `continue` affect?', ['Both loops', 'Only the innermost loop containing it', 'The outer loop', 'The whole program'], 1, 'break/continue bind to the nearest enclosing loop; outer loops continue unaffected. **Why others are wrong:** They never reach outward automatically — multi-level exit needs explicit structure.'),
q('How many total inner iterations run for `for r in 1..3` nested with `for c in 1..4` (ignoring continue)?', ['7', '12', '3', '4'], 1, 'Nested loops multiply: 3 outer passes × 4 inner passes = 12 inner iterations. **Why others are wrong:** 7 is the sum (wrong model), 3 and 4 are single-loop counts.')
],
['while checks before running; do-while guarantees one run by checking after.', 'for scopes its counter to the loop body automatically.', 'break exits; continue skips to the next iteration of the INNERMOST loop.', 'Nested loop iterations multiply — reason about total work.', 'Always move state toward the exit condition to avoid infinite loops.'],
'If you want to use a big terminal, use your CMD. Full guide is in Lesson 1.'
),

L(
'cpp-07', 7, 'Functions, Overloading & the Call Stack', '🛠️',
'🛠️ Functions turn chaos into architecture: name a behavior once, call it forever. But beneath every call, C++ is quietly stacking memory frames — understanding that stack is what separates coders from engineers.',
[
{ title: '1. Anatomy of a Function', beginner: 'A function has a return type, a name, parameters in parentheses, and a body in braces: `int add(int a, int b) { return a + b; }`. Call it with `add(2, 3)` and you get 5 back.', advanced: 'The signature (name + parameter types) identifies the function; the return type is NOT part of overload resolution. `return` hands a value back and immediately ends the frame.' },
{ title: '2. Pass-by-Value & Local Scope', beginner: 'When you pass a variable into a function, C++ hands over a COPY. The function can wreck its copy all it wants — your original stays safe. Variables born inside a function die when it ends.', advanced: 'Pass-by-value invokes the copy constructor for class types — potentially expensive. Locals live in the function\'s stack frame and are destroyed on return, which is why returning a reference to a local is a fatal bug.' },
{ title: '3. Prototypes & Separate Compilation', beginner: 'C++ reads top to bottom. If main() calls a function defined BELOW it, you must announce it first with a prototype: `int add(int, int);` at the top. This promise lets the compiler check your calls early.', advanced: 'A declaration (prototype) gives the compiler the signature; the definition provides the body, possibly in another translation unit. This split is the foundation of header/source architecture and parallel compilation.' },
{ title: '4. Function Overloading', beginner: 'You can reuse one name for different jobs: `add(int, int)` and `add(double, double)` can coexist. C++ picks the right one by looking at the argument types you pass.', advanced: 'Overload resolution ranks candidates by conversion quality: exact match > promotion > conversion. Ambiguous matches are compile errors. Return type alone can never distinguish overloads.' },
{ title: '5. The Call Stack & Recursion (Expert Teaser)', beginner: 'Every function call stacks a fresh memory frame on top, like plates. When the function finishes, its plate is popped off. A function that calls itself (recursion) stacks plates until a base case stops it.', advanced: '*(Pro Track Preview)* Each frame holds parameters, locals, and the return address. Unbounded recursion exhausts the stack (typically 1–8 MB) causing a stack overflow crash. The Expert track covers tail-call optimization and stack vs heap lifetimes in depth.' }
],
{
title: 'The Overloaded Calculator & Recursion Depth',
intro: 'Build overloaded add functions with a prototype, then watch the call stack grow with a depth-printing recursive factorial.',
steps: [
'Create `funcs.cpp` with `<iostream>`.',
'At the TOP, write prototypes: `int add(int, int); double add(double, double); int factorial(int, int);`.',
'In main, call `std::cout << add(2, 3) << std::endl;` (expect 5) and `std::cout << add(2.5, 3.1) << std::endl;` (expect 5.6).',
'Call `std::cout << factorial(5, 1) << std::endl;` (expect 120).',
'BELOW main, define: `int add(int a, int b) { return a + b; }` and `double add(double a, double b) { return a + b; }`.',
'Define recursion with a depth trace: `int factorial(int n, int depth) { std::cout << "frame depth: " << depth << std::endl; if (n <= 1) return 1; return n * factorial(n - 1, depth + 1); }`.',
'Compile `g++ funcs.cpp -o funcs` and run; expect depths 1..5 printed then 120.',
'Experiment: call `factorial(20, 1)` and watch 20 frames print — imagine 2 million and you understand stack overflow.'
],
goal: 'You declared prototypes before definitions, resolved overloads by argument type, and visualized stack frames through recursive depth tracing.'
},
[
q('What does a `void` return type mean?', ['It returns true/false', 'It returns an empty string', 'The function returns no value to the caller', 'The function is broken'], 2, '`void` declares that the function performs effects (printing, mutating) without producing a return value. **Why others are wrong:** void is not bool, not string, and not an error state.'),
q('Why write a prototype above main() when the definition lives below it?', ['To make it run faster', 'Because the compiler checks calls top-down and needs the signature before use', 'To satisfy the linker', 'To create the variable'], 1, 'The compiler validates each call against a visible declaration; the prototype provides that signature ahead of the definition. **Why others are wrong:** Speed is unaffected, the linker needs definitions not prototypes, and no variable is created.'),
q('Which pair is a VALID overload set?', ['int f(int); and int f(int);', 'int f(int); and double f(int);', 'int f(int); and int f(double);', 'int f(int); and int F(int);'], 2, 'Same name with different parameter types is a legal overload; the compiler selects by argument type. **Why others are wrong:** Identical signatures redeclare, differing only in return type is illegal, and `F` is a different name (case-sensitive).'),
q('What happens to a local variable when its function returns?', ['It stays alive forever', 'Its stack frame is popped and the variable is destroyed', 'It becomes global', 'It is saved to disk'], 1, 'Locals live in the frame; returning pops the frame and ends their lifetime — hence returning references to locals is undefined behavior. **Why others are wrong:** They do not persist, promote, or persist to storage.'),
q('What stops a recursive function from crashing with stack overflow?', ['Using break', 'A base case that returns without recursing further', 'Declaring variables static', 'Using double instead of int'], 1, 'The base case terminates the recursion chain, unwinding the stacked frames. **Why others are wrong:** break works in loops not recursion, static changes lifetime not termination, and the type is irrelevant.')
],
['Functions encapsulate behavior: return type, name, parameters, body.', 'Pass-by-value copies arguments; locals die when the frame pops.', 'Prototypes let you define functions below their call sites.', 'Overloads differ by parameter types — never by return type alone.', 'Every call stacks a frame; recursion needs a base case to avoid overflow.'],
'If you want to use a big terminal, use your CMD. Full guide is in Lesson 1.'
),

L(
'cpp-08', 8, 'Arrays, Bounds & Memory Layout', '📚',
'📚 An array is a row of identical boxes laid side by side in memory — contiguous, fast, and completely unforgiving. C++ trusts you to stay inside the lines; step outside and you read garbage or crash. Master the layout and arrays become your fastest tool.',
[
{ title: '1. Declaration & Contiguous Memory', beginner: '`int scores[5] = {90, 85, 80, 95, 100};` creates five integer boxes in a perfect row. One name, many slots, all the same type.', advanced: 'A C-array is a contiguous block of N elements of one type. Contiguity is why arrays are cache-friendly: the CPU prefetches neighboring elements into cache lines as you iterate.' },
{ title: '2. Zero-Based Indexing & Offset Math', beginner: 'Counting starts at ZERO: `scores[0]` is the first box, `scores[4]` is the fifth. Under the hood, `scores[2]` means "start address + 2 × sizeof(int)".', advanced: 'Indexing is pure pointer arithmetic: `arr[i] == *(arr + i)`. The compiler multiplies the index by element size and adds it to the base address — constant time, no search.' },
{ title: '3. Fixed Size & Out-of-Bounds = Undefined Behavior', beginner: 'An array\'s size is locked at birth. Ask for `scores[5]` in a 5-element array and C++ will NOT stop you — it hands you whatever garbage lives next door in memory. This is the most dangerous beginner trap.', advanced: 'C-arrays perform no bounds checking; out-of-bounds access is undefined behavior (UB): silent corruption, crashes, or "working" bugs. `std::array` and `std::vector::at()` add checked access for safety-critical code.' },
{ title: '4. Traversal & the Count Trick', beginner: 'Loop with `for (int i = 0; i < 5; i++)` to visit every box. Forgot the size? Compute it: `sizeof(scores) / sizeof(scores[0])` gives the element count.', advanced: 'The sizeof-division trick works only on true arrays in scope (not decayed pointers). Modern C++ prefers range-based for or `std::size(arr)` from `<iterator>` for clarity and safety.' },
{ title: '5. 2D Arrays & Row-Major Layout (Expert Teaser)', beginner: 'A grid is an array of arrays: `int grid[3][3];`. You address cells with two indices: `grid[row][col]`.', advanced: '*(Pro Track Preview)* 2D arrays store rows back-to-back (row-major). Iterating row-first matches memory order and maximizes cache hits; iterating column-first thrashes the cache — a 10x performance swing in real workloads. The Expert track measures it.' }
],
{
title: 'The Grade Book & Grid Printer',
intro: 'Build a grade book that sums and averages an array using the sizeof count trick, then print a 3x3 grid in row-major order.',
steps: [
'Create `arrays.cpp` with `<iostream>`.',
'Declare: `int grades[4] = {85, 92, 78, 90};`.',
'Compute count: `int count = sizeof(grades) / sizeof(grades[0]);` and print it — expect 4.',
'Loop a sum: `int sum = 0; for (int i = 0; i < count; i++) { sum += grades[i]; }` then print `sum` (expect 345) and `sum / count` (expect 86).',
'Declare a grid: `int grid[3][3] = { {1,2,3}, {4,5,6}, {7,8,9} };`.',
'Print row-major with nested loops over r and c using `grid[r][c]` separated by spaces and `std::endl` per row — expect three clean rows.',
'DANGER DEMO (comment out after): print `grades[4]` and observe a garbage value — proof there is no bounds checking.',
'Compile `g++ arrays.cpp -o arrays` and run; verify 4, 345, 86, and the 3x3 grid.'
],
goal: 'You indexed contiguous memory safely, computed element counts with sizeof, traversed a row-major 2D grid, and witnessed unbounded access produce garbage.'
},
[
q('What is the index of the LAST element in `int cars[5];`?', ['5', '4', '1', '6'], 1, 'Zero-based indexing means valid indices are 0..4; index 5 is out of bounds. **Why others are wrong:** 5 and 6 are past the end, and 1 is the second element.'),
q('What happens if you read `arr[10]` from a 5-element C-array?', ['A safe exception is thrown', 'The array grows automatically', 'Undefined behavior: garbage data, a crash, or silent corruption', 'It returns 0'], 2, 'C-arrays have no bounds checking; out-of-bounds access is UB with unpredictable consequences. **Why others are wrong:** No exception is thrown, C-arrays never grow, and 0 is not guaranteed.'),
q('How do you compute the element count of `int grades[4]` in scope?', ['grades.length()', 'sizeof(grades) / sizeof(grades[0])', 'count(grades)', 'grades->size'], 1, 'Total bytes divided by one element\'s bytes yields the element count for a true in-scope array. **Why others are wrong:** `.length()` and `->size` belong to std::string/vector, and `count()` is not a C-array function.'),
q('How is a 2D array like `grid[3][3]` laid out in memory?', ['Column by column (column-major)', 'Row by row (row-major), rows stored back-to-back', 'Randomly scattered', 'In separate heap allocations per row'], 1, 'C++ stores multidimensional arrays row-major: row 0\'s elements, then row 1\'s, contiguously. **Why others are wrong:** Column-major is Fortran\'s layout, and a true 2D C-array is one contiguous block, not scattered heap rows.'),
q('Why are arrays fast to iterate?', ['They compress data', 'Contiguous memory lets the CPU prefetch elements into cache lines', 'They skip the CPU', 'They store indices separately'], 1, 'Spatial locality: sequential access patterns match cache-line prefetching, making array loops dramatically faster than pointer-chasing structures. **Why others are wrong:** No compression is involved, the CPU is not skipped, and indices are computed, not stored.')
],
['Arrays are contiguous, fixed-size rows of one type.', 'Indexing starts at 0; arr[i] is base address + i * sizeof(type).', 'Out-of-bounds access is undefined behavior — C++ will not protect you.', 'sizeof(arr)/sizeof(arr[0]) computes element count for in-scope arrays.', '2D arrays are row-major: iterate rows first for cache-friendly speed.'],
'If you want to use a big terminal, use your CMD. Full guide is in Lesson 1.'
),

 L(
'cpp-09', 9, 'Introduction to Pointers', '🎯',
'Every variable you create lives at a physical address inside your RAM. Most programmers only ever touch the *value* stored in a variable — but elite C++ developers touch the *address itself*. Pointers are the foundation of dynamic memory, fast data structures, hardware control, and every smart pointer you will ever use. Master them here and the rest of C++ stops being magic.',
[
{ title: '1. The Memory Address Operator (&)', beginner: 'When you create `int age = 20;`, the computer puts the number 20 into a real physical box inside your RAM. That box has a house address, like `0x7ffe42`. You can see that address by putting an ampersand `&` in front of the variable: `&age`.', advanced: 'The address-of operator `&` yields the exact byte address of an object within the active stack frame. Addresses are printed in hexadecimal because memory is byte-addressed and hex maps cleanly to binary boundaries.' },
{ title: '2. What is a Pointer? (*)', beginner: 'A pointer is just a special variable that stores ADDRESSES instead of normal data. `int* pAge = &age;` means "pAge holds the address of an integer." Think of it as a sticky note with the GPS coordinates of your variable.', advanced: 'Pointers are strongly typed (`int*`, `double*`) because the type tells the compiler two things: how many bytes to read at that address, and how many bytes to step when doing pointer arithmetic. A pointer on a 64-bit machine is 8 bytes regardless of what it points to.' },
{ title: '3. Dereferencing a Pointer (*)', beginner: 'If a pointer is a GPS coordinate, dereferencing is actually driving to that location and opening the box. Putting a star in front of the pointer, `*pAge`, gives you the value inside. You can even change it: `*pAge = 50;` changes the original variable!', advanced: 'The dereference operator `*` performs a memory read (or write) at the addressed location. Dereferencing an invalid address is Undefined Behavior — the single most common source of crashes in C and C++ programs.' },
{ title: '4. Why Pointers? (No More Heavy Copies)', beginner: 'Imagine handing a friend a 500-page book versus handing them a sticky note that says where the book is. Passing normal variables into functions photocopies the whole book. Passing a pointer hands over the tiny sticky note instead — instant and cheap.', advanced: 'Pass-by-address avoids invoking copy constructors on large objects. This is why C-style strings, arrays, and raw buffers are always passed as pointers: copying them would be an O(n) memory operation on every single call.' },
{ title: '5. nullptr & Dangling Pointers (Expert Teaser)', beginner: 'A pointer that points to nothing should be set to `nullptr` (the modern safe "empty" value). A pointer that points to a variable that already died is called a "dangling pointer" — using it is like visiting a house that was demolished last week.', advanced: '*(Pro Track Preview)* Dangling pointers, wild pointers, and double-frees are the classic memory-safety bugs. Modern C++ eliminates most of them with smart pointers (`unique_ptr`, `shared_ptr`) which we master later in this track — but you must understand raw pointers first to understand what the smart ones are automating.' }
],
{
title: 'The Memory Inspector',
intro: 'Expose raw memory addresses, build a pointer, and remotely mutate a stack variable through dereferencing.',
steps: [
'Create `pointers.cpp` and include `<iostream>`.',
'Inside `main()`, declare: `int ammo = 100;`.',
'Print the address: `std::cout << "Address: " << &ammo << std::endl;`. Expect a hex code like `0x7ffd5c2a`.',
'Create the pointer: `int* pAmmo = &ammo;`.',
'Print the pointer itself (`std::cout << pAmmo`) — expect the SAME hex address.',
'Print the dereferenced value: `std::cout << *pAmmo << std::endl;`. Expect `100`.',
'Remotely mutate it: `*pAmmo = 50;`.',
'Print the original: `std::cout << ammo << std::endl;`. Expect `50` — proof you edited the original variable through its address!'
],
goal: 'You successfully exposed memory addresses, instantiated a typed pointer, and remotely mutated localized stack memory via dereferencing.'
},
[
q('What does the address-of operator `&` return when placed before a variable?', ['A copy of the variable', 'The physical hexadecimal memory location where the variable lives in RAM', 'The data type of the variable', 'A random number'], 1, '`&age` yields the exact byte address of `age` in the active stack frame, printed in hexadecimal. **Why others are wrong:** It does not copy the value, report the type, or produce randomness — it is a pure address query.'),
q('What is a pointer in C++?', ['A variable that stores a memory address', 'A variable that stores only text', 'A function that returns nothing', 'A loop that runs forever'], 0, 'A pointer is a variable whose value is a memory address, typed so the compiler knows how many bytes live at that address. **Why others are wrong:** It is not text-only, not a function, and not a loop construct.'),
q('What happens when you dereference a pointer with `*pAge`?', ['It deletes the pointer', 'It prints the address of the pointer', 'It reads or writes the actual data stored at the address the pointer holds', 'It converts the pointer to an integer'], 2, 'Dereferencing performs a memory access at the pointed-to address, yielding (or mutating) the live value. **Why others are wrong:** It does not delete anything, print the address (that is just `pAge`), or convert types.'),
q('Why are pointers dramatically more efficient than passing large objects by value into functions?', ['They compress the data automatically', 'They pass a tiny 8-byte address instead of copying every byte of the object', 'They skip the compiler checks', 'They store data on the hard drive'], 1, 'Pass-by-address transfers only the pointer (8 bytes on 64-bit), avoiding an O(n) copy constructor invocation on every call. **Why others are wrong:** No compression, no skipped checks, and no disk involvement — it is purely about avoiding copies.'),
q('What is a "dangling pointer"?', ['A pointer set to nullptr', 'A pointer that still holds the address of an object that has already been destroyed', 'A pointer to a global variable', 'A pointer that has never been initialized'], 1, 'After the target object dies (scope exit or `delete`), the pointer keeps pointing at reclaimed memory — dereferencing it is Undefined Behavior. **Why others are wrong:** nullptr is the safe empty state, globals are alive, and a never-initialized pointer is a *wild* pointer, a related but distinct bug.')
],
['Use &var to discover exactly where a variable lives in RAM.', 'A pointer (int* p) is a typed variable that stores a memory address.', 'Use *p (dereferencing) to read or change the data at that address.', 'Pointers avoid expensive copies by passing addresses instead of whole objects.', 'Always initialize pointers to nullptr to avoid dangling and wild pointer bugs.'],
'If you want to use a big terminal, use your CMD. Full guide is in Lesson 1.'
),
L(
'cpp-10', 10, 'References & Pass-by-Reference', '',
'Pointers are powerful but dangerous: they can be null, they can be reseated, and they force you to write stars everywhere. C++ introduced references as the safe, clean alias mechanism — and they are the reason modern C++ function signatures look the way they do. If you want your functions to modify caller data without pointer syntax, this lesson is mandatory.',
[
{ title: '1. What is a Reference? (&)', beginner: 'A reference is a nickname for an existing variable. `int& refAge = age;` means refAge IS age — same box, second name. Change one and you change the other, because there is only one box.', advanced: 'A reference is an alias bound at initialization. Under the hood compilers implement it as a constant pointer that is automatically dereferenced, but the language guarantees it can never be null and never reseat to another object.' },
{ title: '2. Pass-by-Reference', beginner: 'When you pass a variable normally, the function gets a photocopy. If you pass it as a reference (`void fix(int& x)`), the function gets the ORIGINAL box. Changes inside the function survive after it returns!', advanced: 'Pass-by-reference eliminates copy-constructor overhead for heavy objects and enables output parameters. It is the default choice for any non-trivial object that a function must mutate.' },
{ title: '3. References vs Pointers', beginner: 'A pointer is a loose GPS coordinate — you can change it, forget it, or point it at nothing. A reference is a welded-on nickname: once created it can never point anywhere else, and it can never be empty.', advanced: 'Key differences: references must be initialized, cannot be null, cannot reseat, and need no dereference syntax. Pointers remain necessary for optional values, dynamic memory, arrays, and reseating — which is why both exist.' },
{ title: '4. const References (Read-Only, Zero Copy)', beginner: 'What if a function only needs to LOOK at a big object, not change it? Use `const std::string& name`. You get the speed of a reference (no copy) with a guarantee nobody can modify your data.', advanced: '`const T&` parameters are the C++ workhorse: zero-copy passing plus compile-time mutation protection. This is why nearly every professional codebase passes all non-trivial parameters by const reference.' },
{ title: '5. Rvalue References Preview (Expert Teaser)', beginner: 'There is a second flavor of reference written with two ampersands `&&` that only binds to temporary values about to die. It is the key that unlocks "move semantics" — stealing resources instead of copying them.', advanced: '*(Pro Track Preview)* Rvalue references (`T&&`) enable move constructors and `std::move`, turning O(n) deep copies into O(1) pointer steals. We master this fully in the Move Semantics lesson later in this track.' }
],
{
title: 'The Swap Function',
intro: 'Prove that pass-by-value cannot mutate caller data while pass-by-reference can, using the classic swap interview question.',
steps: [
'Create `refs.cpp` with `<iostream>`.',
'Write a BROKEN swap by value: `void swapBad(int a, int b) { int t = a; a = b; b = t; }`.',
'Write a REAL swap by reference: `void swapGood(int& a, int& b) { int t = a; a = b; b = t; }`.',
'In `main()`: `int x = 10, y = 20;`.',
'Call `swapBad(x, y);` then print x and y. Expect `10 20` — nothing changed!',
'Call `swapGood(x, y);` then print x and y. Expect `20 10` — the originals were mutated.',
'Add a read-only function: `void show(const int& v) { std::cout << v; }` and call `show(x);`. Expect `20` with zero copying.'
],
goal: 'You successfully bypassed localized scope restrictions by passing stack variable aliases, enabling remote mutation without pointer syntax.'
},
[
q('What is a reference in C++?', ['A copy of a variable', 'An alias that refers to the exact same memory location as an existing variable', 'A pointer that can change its address freely', 'A new data type for text'], 1, 'A reference is a second name for an existing object; there is one memory box with two labels. **Why others are wrong:** It is not a copy, it cannot reseat like a pointer, and it is not a text type.'),
q('What happens when you pass a variable by reference into a function?', ['The function receives a clone', 'The function receives direct access to the original variable, so mutations persist after the function returns', 'The function crashes', 'The variable becomes constant'], 1, 'The callee operates on the caller\'s object itself, so writes survive the return. **Why others are wrong:** Cloning is pass-by-value, no crash occurs, and constness is a separate qualifier.'),
q('Which statement about references is TRUE?', ['They can be reassigned to a new variable later', 'They can be left uninitialized', 'They must be bound to an object at creation and can never be null', 'They require the * operator to use'], 2, 'References are bound at initialization, non-null, and non-reseatable — that is their safety contract versus pointers. **Why others are wrong:** Reseating, null states, and manual dereferencing are pointer behaviors, not reference behaviors.'),
q('Why do professional C++ codebases pass large objects as `const T&` parameters?', ['To make the function run in a separate thread', 'To avoid copying the object while guaranteeing the function cannot mutate it', 'Because pointers are illegal in functions', 'To force the object onto the heap'], 1, 'Const references give zero-copy performance plus compile-time mutation protection — the best of both worlds. **Why others are wrong:** Threading, legality of pointers, and heap placement are unrelated to parameter passing style.'),
q('What does the double-ampersand `int&& r` declare?', ['A pointer to a pointer', 'A reference to a reference', 'An rvalue reference that binds only to temporary values', 'A constant reference'], 2, '`T&&` is an rvalue reference, binding exclusively to temporaries — the foundation of move semantics. **Why others are wrong:** Pointer-to-pointer is `int**`, references-to-references do not exist, and const references use `const int&`.')
],
['A reference (&) is a permanent alias for an existing variable.', 'Pass-by-reference lets functions mutate caller data with no pointer syntax.', 'References can never be null and never reseat — pointers still own those jobs.', 'Use const T& to pass big objects with zero copy and zero mutation risk.', 'Rvalue references (&&) unlock move semantics later in this track.']
),
'If you want to use a big terminal, use your CMD. Full guide is in Lesson 1.'
),
L(
'cpp-11', 11, 'Stack vs Heap & Dynamic Memory', '🧠',
'Your program has two memory playgrounds: a small, ultra-fast, self-cleaning desk (the Stack) and a giant warehouse you must manage yourself (the Heap). Every memory leak, every stack overflow crash, and every smart pointer in existence exists because of the difference between these two regions. Understand them and you understand C++ memory forever.',
[
{ title: '1. The Stack (Automatic Memory)', beginner: 'The Stack is a neat little desk. Normal variables (`int x = 5;`) are placed on it automatically. When a function ends, the desk is swept clean and everything on it vanishes. Fast, safe, but small.', advanced: 'Stack allocation is just moving the stack pointer — essentially free. Frames are LIFO, cache-friendly, and automatically reclaimed on scope exit. Exceeding the OS limit (often 1–8 MB) causes a Stack Overflow crash.' },
{ title: '2. The Heap (Dynamic Memory)', beginner: 'The Heap is a giant warehouse. When you need a LOT of space, or space that must outlive the function, you request it with `new`. But nobody cleans the warehouse for you — you must return the space with `delete` yourself.', advanced: 'Heap allocation invokes the allocator at runtime, is slower, and can fragment. Memory lives until explicitly `delete`d (or `delete[]` for arrays), which is exactly why leaks and double-frees are possible.' },
{ title: '3. Memory Leaks', beginner: 'If you take space from the warehouse and lose the paperwork (the pointer) without calling `delete`, that space is gone forever while your program runs. That is a memory leak — like renting a storage unit and throwing away the key.', advanced: 'A leak occurs when no reachable pointer refers to an allocated block. In long-running servers, leaks accumulate until the OS kills the process. This is the exact problem RAII and smart pointers solve deterministically.' },
{ title: '4. Choosing Stack vs Heap', beginner: 'Small, short-lived data? Stack. Huge arrays, data whose size you only know at runtime, or objects that must outlive the function? Heap. Rule of thumb: default to the stack, go to the heap only when you have a reason.', advanced: 'Prefer stack allocation for locality and automatic lifetime. Use the heap when size is runtime-dependent, lifetime must exceed scope, or the object is too large for a stack frame. Modern C++ wraps all heap usage in smart pointers.' },
{ title: '5. Smart Pointers Preview (Expert Teaser)', beginner: 'Remembering to call `delete` is exhausting and humans forget. Modern C++ invented "smart pointers" — pointers that delete themselves automatically when they go out of scope. They are your safety net.', advanced: '*(Pro Track Preview)* `std::unique_ptr` and `std::shared_ptr` implement RAII over heap memory, making leaks structurally impossible in well-designed code. We dedicate a full lesson to them later in this track.' }
],
{
title: 'The Heap Array Lab',
intro: 'Allocate a dynamic array on the heap at runtime, use it, and free it correctly — then witness what a leak looks like.',
steps: [
'Create `heap.cpp` with `<iostream>`.',
'Ask for a runtime size: `int n = 3;` (imagine this came from user input).',
'Allocate on the heap: `int* scores = new int[n]{90, 85, 80};`.',
'Loop and print: `for (int i = 0; i < n; i++) std::cout << scores[i] << " ";`. Expect `90 85 80 `.',
'Free it correctly: `delete[] scores;`.',
'Set the pointer to safety: `scores = nullptr;`.',
'LEAK DEMO: comment out the `delete[]` line, recompile, and run. The output looks identical — but the memory was never returned. This invisible waste is exactly why leaks survive code review and kill servers.'
],
goal: 'You successfully allocated and freed runtime-sized heap memory, and visually understood why invisible leaks are so dangerous.'
},
[
q('Which memory region automatically cleans up its variables when a function returns?', ['The Heap', 'The Stack', 'The hard drive', 'The CPU cache'], 1, 'Stack frames are popped on scope exit, reclaiming all local variables deterministically. **Why others are wrong:** The heap requires manual freeing, and disk/cache are not program memory regions in this sense.'),
q('What does `new int[10]` do?', ['Allocates 10 integers on the stack', 'Allocates 10 integers on the heap and returns a pointer to the first one', 'Creates 10 separate pointer variables', 'Reserves 10 bytes total'], 1, '`new[]` requests a contiguous heap block for 10 ints and yields its base address as a pointer. **Why others are wrong:** It is heap not stack, it returns one pointer not ten, and the size is 10 × sizeof(int), not 10 bytes.'),
q('What is a memory leak?', ['Water damage to RAM', 'Allocated heap memory that is never freed because no pointer refers to it anymore', 'Deleting a pointer twice', 'Using too many stack variables'], 1, 'The block stays reserved for the process lifetime with no way to reach or free it. **Why others are wrong:** Double-delete is a different bug (double free), stack variables cannot leak, and physical water is irrelevant.'),
q('Which pair of keywords correctly frees heap memory?', ['free / malloc', 'delete for single objects, delete[] for arrays', 'remove / clear', 'pop / push'], 1, 'C++ pairs `new` with `delete` and `new[]` with `delete[]`; mixing them is Undefined Behavior. **Why others are wrong:** malloc/free are C, not C++ idioms here, and the other pairs do not manage memory.'),
q('When should you prefer the Heap over the Stack?', ['Always, because it is faster', 'When the size is only known at runtime or the object must outlive its creating function', 'Never, the heap is illegal in C++', 'Only for integer variables'], 1, 'Runtime-sized and long-lived data are the two classic heap use cases. **Why others are wrong:** The heap is slower not faster, perfectly legal, and used for all types, not just ints.')
],
['The Stack is small, fast, and self-cleaning; the Heap is huge but manually managed.', 'new allocates heap memory; delete / delete[] must return it.', 'A leak is heap memory with no reachable pointer — invisible and cumulative.', 'Default to the stack; choose the heap only for runtime size or extended lifetime.', 'Smart pointers (later in this track) automate heap cleanup via RAII.']
),
'If you want to use a big terminal, use your CMD. Full guide is in Lesson 1.'
),
L(
'cpp-12', 12, 'Custom Data Types (Structs)', '🏗️',
'Real-world entities are never a single integer. A Player has a name, health, and position. A Product has an ID, price, and stock. Structs let you bundle heterogeneous data into one cohesive, named type — the first step toward modeling reality in code, and the ancestor of the class.',
[
{ title: '1. Defining a Struct', beginner: 'A struct is a blueprint you write above `main()`: `struct Player { std::string name; int health; };`. This teaches C++ what a Player looks like without creating one yet.', advanced: 'A struct is a user-defined aggregate type. In C++ (unlike C) structs can also contain functions, but by convention they model plain data. Members are public by default.' },
{ title: '2. Instantiation & Member Access (.)', beginner: 'Create a real Player with `Player p1;` and reach inside with the dot: `p1.name = "Hero"; p1.health = 100;`. The dot operator is your key into the bundle.', advanced: 'Instantiation allocates a contiguous block large enough for all members. The dot operator resolves each member\'s offset from the base address at compile time — zero runtime cost.' },
{ title: '3. Arrays of Structs & Contiguity', beginner: 'You can make a whole team at once: `Player team[5];`. Access members like `team[0].health = 100;`. All five players sit side by side in memory.', advanced: 'Arrays of structs are dense and cache-friendly, which is why data-oriented design (game engines, SIMD code) prefers structs-of-arrays or arrays-of-structs over pointer-heavy object graphs.' },
{ title: '4. Passing Structs to Functions', beginner: 'Passing a struct normally copies the WHOLE bundle. For big structs that is wasteful — so pass by reference (`void heal(Player& p)`) or const reference (`void show(const Player& p)`) instead.', advanced: 'Copying a struct invokes member-wise copies (or copy constructors). Passing by (const) reference avoids this entirely and is the professional default for any non-trivial aggregate.' },
{ title: '5. Struct Padding & Alignment (Expert Teaser)', beginner: 'You might expect a struct of a char (1 byte) and an int (4 bytes) to be 5 bytes. It is often 8! The compiler inserts invisible spacer bytes so each member sits at a "comfortable" memory boundary.', advanced: '*(Pro Track Preview)* Alignment rules exist because CPUs read aligned words far faster. Padding explains sizeof surprises and matters deeply in network protocols and file formats, where you must control layout with `#pragma pack` or explicit serialization.' }
],
{
title: 'The NPC Generator',
intro: 'Define a custom NPC struct, instantiate it, mutate members, and inspect how much memory the bundle really occupies.',
steps: [
'Create `structs.cpp` with `<iostream>` and `<string>`.',
'Above `main()`, define: `struct NPC { std::string name; int level; };`.',
'Inside `main()`: `NPC guard;`.',
'Assign members: `guard.name = "City Watch"; guard.level = 15;`.',
'Print: `std::cout << guard.name << " L" << guard.level << std::endl;`. Expect `City Watch L15`.',
'Create an array: `NPC squad[2]; squad[0].level = 3; squad[1].level = 7;`.',
'Print sizes: `std::cout << sizeof(int) << " " << sizeof(NPC) << std::endl;`. Expect `4` then a much larger number (often 32 or 40) — the string object plus alignment padding!'
],
goal: 'You successfully defined a custom composite data type, instantiated it, and observed real memory layout including hidden alignment costs.'
},
[
q('What is a struct in C++?', ['A function returning multiple values', 'A built-in math type', 'A user-defined blueprint bundling variables of different types into one unit', 'A type of loop'], 2, 'A struct aggregates heterogeneous members under one named type. **Why others are wrong:** It is not a function, not built-in, and not a control-flow construct.'),
q('Which operator accesses a struct member on a normal instance?', ['->', '*', '.', '&'], 2, 'The dot operator resolves the member offset from the instance base address. **Why others are wrong:** `->` is for pointers-to-struct, `*` dereferences, and `&` takes addresses.'),
q('Why prefer `void show(const NPC& n)` over `void show(NPC n)`?', ['It runs on the GPU', 'It avoids copying the entire struct while preventing mutation', 'Structs cannot be passed by value at all', 'It deletes the struct afterwards'], 1, 'Const reference passing is zero-copy and mutation-safe. **Why others are wrong:** No GPU involvement, pass-by-value is legal but wasteful, and no deletion occurs.'),
q('Why can `sizeof(struct)` be LARGER than the sum of its members\' sizes?', ['The compiler adds invisible padding bytes to satisfy memory alignment rules', 'The struct stores its own name as text', 'Members are duplicated for safety', 'The operating system taxes each struct'], 0, 'Alignment padding inserts spacer bytes so each member starts at an efficiently addressable boundary. **Why others are wrong:** Names are not stored, members are not duplicated, and there is no OS tax.'),
q('What does `Player team[5];` create?', ['Five pointers to one Player', 'Five contiguous Player objects in memory', 'One Player copied lazily five times', 'A heap allocation of five Players'], 1, 'A fixed array stores five full Player objects side by side (on the stack here). **Why others are wrong:** It is not pointers, not lazy copies, and not heap memory unless you used `new[]`.')
],
['Structs bundle heterogeneous variables into one named blueprint.', 'Define structs above main() and instantiate them inside it.', 'Use the dot operator (.) to read and write members.', 'Pass structs by const reference to avoid expensive whole-bundle copies.', 'sizeof includes hidden alignment padding — layout is not naive addition.']
),
'If you want to use a big terminal, use your CMD. Full guide is in Lesson 1.'
),
L(
'cpp-13', 13, 'Classes & Objects (OOP)', '🏭',
'Structs bundle data. Classes bundle data AND the behaviors that operate on that data, wrapped in a protective design philosophy called Object-Oriented Programming. This is the single most important architectural leap in your C++ journey: from writing procedures to designing entities.',
[
{ title: '1. What is a Class?', beginner: 'A Class is a super-struct: it holds variables (attributes) AND functions (methods). If `Car` is a class, `speed` and `color` are attributes, while `drive()` and `brake()` are methods.', advanced: 'A class defines both state layout and behavior, and — critically — defaults its members to private, enforcing encapsulation. The only syntactic difference from struct is default access; the semantic difference is intent: classes model abstract types with invariants.' },
{ title: '2. Objects (Instantiation)', beginner: 'A class is paper; an object is the real thing. `Car myCar;` builds an actual car in memory from the blueprint. Each object gets its own attribute values.', advanced: 'Instantiation allocates per-instance state (usually on the stack unless you use `new`). Methods, however, exist once as compiled code — objects carry state, not copies of functions.' },
{ title: '3. Attributes vs Methods', beginner: 'Attributes are what an object KNOWS (its data). Methods are what an object DOES (its functions). Every object keeps its own attributes; all objects share the same method code.', advanced: 'Member functions receive an implicit pointer to the invoking object (the `this` pointer, next lessons), which is how one shared function body can operate on many distinct states.' },
{ title: '4. Calling Methods (.)', beginner: 'Trigger behavior with the dot: `myCar.drive();`. It reads exactly like English: "my car, drive."', advanced: 'Method calls compile to ordinary function calls with the object address passed implicitly — zero overhead versus free functions, which is why C++ OOP costs nothing at runtime.' },
{ title: '5. Class vs Struct: The Modern Rule (Expert Teaser)', beginner: 'Both work almost identically in C++! The community rule of thumb: use `struct` for simple data bundles, and `class` when you need protection and behavior.', advanced: '*(Pro Track Preview)* The C++ Core Guidelines suggest: use struct for plain data aggregates (all public, no invariants), and class when you must maintain invariants behind private state. This semantic distinction makes codebases instantly more readable.' }
],
{
title: 'Your First Class',
intro: 'Transition from structs to classes by building a Robot blueprint with state and behavior, then instantiate and command it.',
steps: [
'Create `classes.cpp` with `<iostream>` and `<string>`.',
'Above `main()`, declare: `class Robot { public: std::string name; void sayHi() { std::cout << "Beep boop, I am " << name << "!"; } };`.',
'Notice the `public:` label — without it, everything would be locked private by default.',
'Inside `main()`: `Robot r1;`.',
'Set state: `r1.name = "Wall-E";`.',
'Trigger behavior: `r1.sayHi();`. Expect `Beep boop, I am Wall-E!`.',
'Create a second object: `Robot r2; r2.name = "EVE"; r2.sayHi();`. Expect `Beep boop, I am EVE!` — same blueprint, independent state.'
],
goal: 'You successfully transitioned to OOP by defining a class with both state (attributes) and behavior (methods), and instantiated independent objects.'
},
[
q('What is the primary difference between a Class and an Object?', ['They are identical', 'A Class is the blueprint; an Object is a concrete instance built from it', 'A Class is for numbers, an Object is for text', 'An Object is the blueprint, a Class is the instance'], 1, 'The class defines layout and behavior; the object is allocated memory holding real state. **Why others are wrong:** They are distinct concepts, not type-restricted, and the direction of the relationship is class→object.'),
q('What do we call a function defined inside a class?', ['A global function', 'A struct', 'A method (member function)', 'An attribute'], 2, 'Functions bound to a class are methods; they operate on instance state via the implicit this pointer. **Why others are wrong:** Globals live outside classes, structs are types, and attributes are data.'),
q('If two objects come from the same `BankAccount` class, do they share one balance?', ['Yes, all memory is shared', 'No, each object holds its own independent copy of member variables', 'Only inside arrays', 'Yes, unless one is deleted'], 1, 'Per-instance state is allocated separately for every object. **Why others are wrong:** Sharing one balance would require a `static` member, which is a deliberate opt-in, not the default.'),
q('What is the ONLY syntactic difference between `struct` and `class` in C++?', ['struct cannot contain functions', 'class members default to private, struct members default to public', 'struct is faster at runtime', 'class cannot be instantiated'], 1, 'Default access specifier is the sole syntactic distinction; everything else is convention. **Why others are wrong:** Structs can hold functions, performance is identical, and both instantiate normally.'),
q('How do you invoke method `jump()` on object `player1`?', ['jump(player1);', 'player1.jump();', 'player1->jump;', 'jump.player1();'], 1, 'Dot operator on the instance, then method name with parentheses. **Why others are wrong:** Free-function syntax, pointer syntax without call parentheses, and reversed order are all invalid here.')
],
['A Class bundles attributes (state) and methods (behavior) into one blueprint.', 'An Object is a concrete instance with its own independent state.', 'Class members default to private — protection is built in.', 'Methods exist once as code; objects carry only their own data.', 'Use struct for plain data, class for protected types with invariants.']
),
'If you want to use a big terminal, use your CMD. Full guide is in Lesson 1.'
),
L(
'cpp-14', 14, 'Encapsulation & Access Modifiers', '🛡️',
'In a game, you never want a player to type `health = 999999` and cheat. Encapsulation locks the internal state of a class behind a controlled door: the outside world may only interact through methods YOU approved. This is how real systems keep their data valid forever.',
[
{ title: '1. private: The Default Vault', beginner: 'Everything inside a `class` is private by default: invisible and untouchable from `main()`. It is an impenetrable safe.', advanced: 'Private members are accessible only from the class\'s own member functions (and friends). This is compile-time enforcement, costing zero runtime performance.' },
{ title: '2. public: The Approved Door', beginner: 'The `public:` label opens a door. Anything under it can be used normally from outside with the dot operator. Public members are your class\'s official interface.', advanced: 'The public surface is your API contract. Keeping it small and stable is what allows you to refactor internals later without breaking any client code.' },
{ title: '3. Getters (Accessors)', beginner: 'To READ a private variable safely, provide a getter: `int getHealth() { return health; }`. Outside code can look but never touch.', advanced: 'Getters should be marked `const` (`int getHealth() const`) to promise they do not mutate state — enabling use on const objects and references.' },
{ title: '4. Setters (Mutators) with Validation', beginner: 'To CHANGE a private variable safely, provide a setter with rules: `void setHealth(int h) { if (h >= 0) health = h; }`. Negative health is now impossible.', advanced: 'Setters enforce class invariants at the single choke point where mutation happens. This is the core practical payoff of encapsulation: invalid states become unrepresentable.' },
{ title: '5. Friends & const Methods (Expert Teaser)', beginner: 'Sometimes a trusted outsider function needs full access to your private vault. C++ lets you hand out a special key with the `friend` keyword — use it rarely and deliberately.', advanced: '*(Pro Track Preview)* `friend` functions/classes bypass access control, and `const` member functions guarantee non-mutation. Together they form the fine-grained access toolkit used heavily in operator overloading (like `operator<<` for printing).' }
],
{
title: 'The Secure Bank Account',
intro: 'Lock a balance behind encapsulation so that invalid states (negative money) become impossible to create from outside.',
steps: [
'Create `bank.cpp` with `<iostream>`.',
'Define: `class BankAccount { private: double balance = 0.0; public:`.',
'Add getter: `double getBalance() const { return balance; }`.',
'Add validated setter: `void deposit(double amt) { if (amt > 0) balance += amt; }`.',
'Add guarded withdrawal: `void withdraw(double amt) { if (amt > 0 && amt <= balance) balance -= amt; }` and close the class with `};`.',
'In `main()`: `BankAccount acc; acc.deposit(100); acc.withdraw(30); acc.withdraw(500);`.',
'Print `acc.getBalance()`. Expect `70` — the impossible 500 withdrawal was silently rejected by your invariant!',
'Try adding `acc.balance = -5;` in main and compile: expect a COMPILER ERROR proving the vault is sealed.'
],
goal: 'You successfully encapsulated sensitive state and enforced invariants, making invalid states unrepresentable from outside the class.'
},
[
q('What is the default access level of members inside a C++ `class`?', ['public', 'protected', 'private', 'global'], 2, 'Class members are private by default, unlike structs which default to public. **Why others are wrong:** public/protected must be explicitly labeled, and global is not an access specifier.'),
q('What is the main purpose of Encapsulation?', ['To make code run faster', 'To hide internal state and force all interaction through controlled, validated methods', 'To merge multiple classes', 'To delete unused variables'], 1, 'Encapsulation protects invariants by restricting direct state access to approved choke points. **Why others are wrong:** It has no speed purpose, does not merge classes, and does not delete variables.'),
q('Why use a Setter instead of a public variable?', ['The compiler requires it', 'It lets you validate data at the single point of mutation, rejecting invalid values', 'Setters use less memory', 'Variables cannot be public'], 1, 'Validation at the mutation choke point makes invalid states impossible to create. **Why others are wrong:** It is not compulsory, memory is identical, and public variables are legal but unsafe.'),
q('What does a Getter typically return?', ['A reference allowing mutation', 'A copy of the private value, providing read-only access', 'The variable\'s memory address', 'Nothing'], 1, 'Getters hand out copies (or const references) so callers can read but not write. **Why others are wrong:** Returning mutable references or addresses would break encapsulation.'),
q('What does the `friend` keyword do?', ['Makes a function run faster', 'Grants a specific external function or class access to private members', 'Makes all members public', 'Creates a copy of the class'], 1, 'Friendship is a deliberate, explicit access grant bypassing private protection. **Why others are wrong:** It affects access control only — no speed, no global publicity, no copying.')
],
['Class members are private by default — the vault is sealed automatically.', 'public: defines your approved interface to the outside world.', 'Getters (const) provide safe read access to private state.', 'Setters enforce validation rules at the single mutation choke point.', 'friend grants rare, deliberate access — use it sparingly.']
),
'If you want to use a big terminal, use your CMD. Full guide is in Lesson 1.'
),
L(
'cpp-15', 15, 'Constructors & Destructors', '🏗️',
'Objects should never be born broken. A Player must not spawn with garbage health; a database connection must not die without closing. Constructors and destructors are the automatic birth and death ceremonies of every object — the heartbeat of deterministic C++ lifecycles.',
[
{ title: '1. The Default Constructor', beginner: 'A constructor has the EXACT same name as the class and NO return type: `Player() { health = 100; }`. Now every `Player p;` is born with 100 health automatically.', advanced: 'If you define no constructors, the compiler synthesizes a default one. Defining ANY constructor suppresses that implicit default — a rule that surprises every beginner at least once.' },
{ title: '2. Parameterized Constructors', beginner: 'Force callers to provide data at birth: `Player(std::string n) { name = n; }`. Now `Player p1("Arthur");` — nobody can create a nameless player.', advanced: 'Multiple constructors with different signatures coexist via overloading, giving your type several legal birth pathways (default, parameterized, converting).' },
{ title: '3. Member Initializer Lists', beginner: 'The pro way to set up members is with a colon BEFORE the body: `Player(int h) : health(h) {}`. It builds members directly instead of building-then-overwriting them.', advanced: 'Initializer lists construct members in declaration order with no default-construct-then-assign double work. They are MANDATORY for `const` members, reference members, and members without default constructors.' },
{ title: '4. The Destructor (~)', beginner: 'The destructor `~Player() { ... }` runs automatically the moment an object dies (leaves scope). It is your last chance to clean up messes like heap memory or open files.', advanced: 'Destructors run in reverse construction order and are the backbone of RAII: every resource acquired in a constructor is released in the destructor, guaranteeing cleanup even during exception stack unwinding.' },
{ title: '5. The Copy Constructor (Expert Teaser)', beginner: 'What happens when you write `Player p2 = p1;`? A special hidden constructor — the copy constructor — duplicates the object. If your object owns heap memory, the default copy can cause disasters.', advanced: '*(Pro Track Preview)* The copy constructor plus copy-assignment plus destructor form the "Rule of Three": if you define one, you probably need all three. We resolve this fully with move semantics and smart pointers later in this track.' }
],
{
title: 'The Database Connection Lifecycle',
intro: 'Watch constructors and destructors fire automatically as an object enters and leaves a scope block — no manual cleanup calls anywhere.',
steps: [
'Create `lifecycle.cpp` with `<iostream>`.',
'Define: `class Database { public: Database() { std::cout << "OPENED" << std::endl; } ~Database() { std::cout << "CLOSED" << std::endl; } };`.',
'Inside `main()`, open a scope: `{`.',
'Instantiate: `Database db;`. Expect immediate output `OPENED`.',
'Print: `std::cout << "working..." << std::endl;`. Expect `working...`.',
'Close the scope: `}`. Expect immediate output `CLOSED` the instant the brace is crossed.',
'Rerun with `Database db;` placed OUTSIDE the braces at the end of main and observe that CLOSED only appears at program exit — proof that lifetime follows scope exactly.'
],
goal: 'You successfully managed an object\'s automated lifecycle, observing deterministic construction and destruction driven purely by scope.'
},
[
q('What is unique about constructor syntax?', ['It must be named init()', 'It must return bool', 'It shares the exact class name and has no return type', 'It takes exactly one parameter'], 2, 'Name-equals-class and no return type are the defining syntactic rules. **Why others are wrong:** init() is not special, bool returns are illegal here, and parameter counts vary freely.'),
q('When does a constructor execute?', ['Only when called manually', 'Automatically at the exact moment of object instantiation', 'At program end', 'Only when members change'], 1, 'Construction is automatic during instantiation — you never call a constructor like a normal function. **Why others are wrong:** Manual calls, program-end timing, and mutation triggers are all incorrect.'),
q('Why are member initializer lists preferred over assignment in the constructor body?', ['They run after the body', 'They construct members directly, avoiding default-construct-then-assign double work, and are mandatory for const/reference members', 'They delete members first', 'They are the only way to print text'], 1, 'Direct construction is both faster and sometimes the only legal option (const, references, non-default-constructible members). **Why others are wrong:** They run before the body, delete nothing, and printing is unrelated.'),
q('How is a destructor written?', ['delete ClassName()', 'With a tilde: ~ClassName()', 'With a minus sign', 'end()'], 1, 'The tilde prefix marks the destructor, invoked automatically on scope exit or delete. **Why others are wrong:** delete is an operator, minus signs are arithmetic, and end() is not a destructor.'),
q('What does the "Rule of Three" refer to?', ['Three access modifiers', 'Copy constructor, copy-assignment operator, and destructor — if you need one, you likely need all three', 'Three constructors maximum', 'Three member variables minimum'], 1, 'Owning raw resources couples these three special members; defining one without the others invites double-frees or leaks. **Why others are wrong:** It is not about modifiers, constructor counts, or member counts.')
],
['Constructors run automatically at birth; destructors run automatically at death.', 'A constructor shares the class name and has no return type.', 'Member initializer lists construct members directly and are mandatory for const/reference members.', 'Destructors are the backbone of RAII cleanup.', 'Remember the Rule of Three when your class owns raw resources.']
),
'If you want to use a big terminal, use your CMD. Full guide is in Lesson 1.'
),
L(
'cpp-16', 16, 'Class Methods, the this Pointer & static Members', '👉',
'As classes grow, dumping every function body inside the class block becomes unreadable, and parameter names collide with member names. This lesson gives you the professional toolkit: scope resolution for clean separation, the this pointer for disambiguation, and static members for class-level shared state.',
[
{ title: '1. Separating Declaration from Definition (::)', beginner: 'Inside the class, promise the method: `void attack();`. Outside, deliver it: `void Monster::attack() { ... }`. The double colon glues the function back to its class.', advanced: 'This separation is what enables header (.h) / source (.cpp) splitting: declarations in headers, definitions in one translation unit — the foundation of fast incremental compilation in real projects.' },
{ title: '2. The Scope Resolution Operator (::)', beginner: '`::` literally means "belongs to". `Monster::setPower` tells the compiler: this function body belongs to the Monster class over there.', advanced: 'The operator qualifies names into their enclosing scope (class or namespace), resolving ambiguity between same-named entities across scopes.' },
{ title: '3. Name Shadowing & the this Pointer', beginner: 'If a parameter is named `power` and the member is also `power`, writing `power = power;` assigns the parameter to itself — useless! `this->power = power;` fixes it: "MY power gets YOUR value."', advanced: '`this` is an implicit `T* const` pointer passed to every non-static member function, holding the address of the invoking object. The arrow operator dereferences it to reach members.' },
{ title: '4. Method Chaining with this', beginner: 'Because `this` points at the object, a method can return the object itself (`return *this;`) letting you chain calls: `m.setPower(10).setName("Boss");` — fluent and fast.', advanced: 'Returning `*this` by reference enables fluent interfaces. Returning by value would copy the object each link and break chaining semantics for mutating calls.' },
{ title: '5. static Members (Expert Teaser)', beginner: 'Normal members belong to each object. A `static` member belongs to the CLASS itself — one shared value across every object, like a global counter of how many Monsters exist.', advanced: '*(Pro Track Preview)* Static data members exist once per class (defined outside the class body), and static member functions have no `this` pointer — they are the bridge between OOP and class-level global state, used for registries, counters, and singletons.' }
],
{
title: 'The Confused Parameter & Fluent Chaining',
intro: 'Resolve parameter/member name collisions with the this pointer, separate definitions with ::, and build a chainable fluent interface.',
steps: [
'Create `thisptr.cpp` with `<iostream>` and `<string>`.',
'Declare the class: `class Monster { private: int power; std::string name; public:`.',
'Promise methods: `Monster& setPower(int power); Monster& setName(std::string name); void show(); };`.',
'Define outside with scope resolution: `Monster& Monster::setPower(int power) { this->power = power; return *this; }`.',
'Define: `Monster& Monster::setName(std::string name) { this->name = name; return *this; }`.',
'Define: `void Monster::show() { std::cout << name << " P" << power << std::endl; }`.',
'In `main()`: `Monster m; m.setPower(10).setName("Boss").show();`. Expect `Boss P10` — one fluent chain, zero ambiguity.'
],
goal: 'You successfully separated declarations from definitions, resolved shadowing via the this pointer, and built a chainable fluent interface returning *this.'
},
[
q('What does the Scope Resolution Operator `::` do in `void Monster::attack()`?', ['Creates an array', 'Connects an out-of-class function definition back to its class declaration', 'Deletes the method', 'Makes the method static'], 1, 'It qualifies the function name into the Monster class scope. **Why others are wrong:** It creates nothing, deletes nothing, and staticness is a separate keyword.'),
q('Why separate method definitions from the class block?', ['It runs faster', 'It keeps the class a clean blueprint and enables header/source file splitting for faster builds', 'Logic inside classes is illegal', 'It hides code from the compiler'], 1, 'Clean declarations plus external definitions enable .h/.cpp architecture and incremental compilation. **Why others are wrong:** Speed of execution is unchanged, inline logic is legal, and nothing is hidden from the compiler.'),
q('What is Name Shadowing in a setter like `void setPower(int power)`?', ['The class has no name', 'The parameter hides the member of the same name, so bare `power` refers to the parameter', 'Text renders darkly', 'The object is deleted'], 1, 'Inner scope (parameter) wins over class scope, so unqualified names resolve to the parameter. **Why others are wrong:** It is purely a scope-resolution phenomenon, not a naming or rendering issue.'),
q('What exactly is `this` inside a member function?', ['A string holding the class name', 'An implicit pointer to the specific object invoking the method', 'A function returning the object', 'A command to stop execution'], 1, '`this` is a `T* const` implicit parameter holding the invoking object\'s address. **Why others are wrong:** It is not a string, not a function, and not a control command.'),
q('What does a `static` member variable represent?', ['A variable stored on the stack', 'One shared value belonging to the class itself, common to all objects', 'A constant that cannot be read', 'A per-object counter'], 1, 'Static data exists once per class, shared across every instance. **Why others are wrong:** Storage class is unrelated, it is readable, and per-object state is exactly what static is NOT.')
],
['Use :: to define method bodies cleanly outside the class block.', 'Header/source separation builds on declaration-vs-definition splitting.', 'this-> disambiguates members from same-named parameters.', 'Return *this by reference to enable fluent method chaining.', 'static members hold class-level shared state with no this pointer.']
),
'If you want to use a big terminal, use your CMD. Full guide is in Lesson 1.'
),

 L(
'cpp-17', 17, 'Inheritance (Base & Derived Classes)', '🧬',
'If you are building a zoo simulation, a Lion, a Tiger, and a Bear all need a `health` variable and an `eat()` method. Copy-pasting that code into three classes is architectural rot. Inheritance lets you write the shared logic ONCE in a master blueprint and have every child class inherit it automatically — the foundation of reusable, DRY software design.',
[
{ title: '1. Base Classes (The Parent Blueprint)', beginner: 'A Base class holds the code that everyone shares. `class Animal { public: int health; void eat() { ... } };` is your master blueprint. Every animal in your game can reuse it without you rewriting a single line.', advanced: 'The Base class (superclass) centralizes generalized state and behavior, enforcing the DRY (Don\'t Repeat Yourself) principle. In memory, a derived object is laid out as the base subobject first, followed by the derived class\'s own members — which is why a derived object can always be treated as its base.' },
{ title: '2. Derived Classes & the Colon Syntax', beginner: 'To inherit, use a colon: `class Lion : public Animal { ... };`. The Lion class can be completely empty inside, yet it magically possesses the `health` variable and the `eat()` method from Animal!', advanced: 'Inheritance models an "IS-A" relationship (a Lion IS-A Animal). Specifying `public Animal` means the base class\'s public members stay public in the derived class. Private and protected inheritance also exist but restrict that visibility, and are rarely the right tool.' },
{ title: '3. The protected Modifier', beginner: 'We learned that `private` variables are locked away from everyone — unfortunately that includes child classes! If you want a variable hidden from `main()` but still usable by your child classes, use `protected:` instead.', advanced: '`protected` is the intermediate access tier: invisible to external clients (like `private`) but directly visible inside derived class scopes. Use it sparingly — overusing protected weakens encapsulation because every subclass can now mutate parent state.' },
{ title: '4. Construction & Destruction Order', beginner: 'When you build a child object, C++ builds the PARENT part first, then the child part. When the object dies, it destroys the child part first, then the parent. It is exactly like building a house: foundation first, roof last — and demolition in reverse.', advanced: 'Constructors run base-to-derived; destructors run derived-to-base. This ordering guarantees the base subobject is fully initialized before the derived constructor touches it, and still alive while the derived destructor cleans up. Print statements in constructors make this order beautifully visible.' },
{ title: '5. The Diamond Problem (Expert Teaser)', beginner: 'What if a Child inherits from two parents, and both parents inherited from the same Grandparent? The child would accidentally contain TWO copies of the grandparent! This confusing trap is called the Diamond Problem.', advanced: '*(Pro Track Preview)* Multiple inheritance can duplicate a shared base subobject. C++ solves it with *virtual inheritance* (`class A : virtual public Base`), which shares a single base subobject across the diamond. The C++ Expert track dissects virtual base layout and construction order in depth.' }
],
{
title: 'The Vehicle Hierarchy & Lifecycle Trace',
intro: 'Build a Base Vehicle class and a derived Car class, then trace the exact construction and destruction order using print statements.',
steps: [
'Create a file `inherit.cpp` with `#include <iostream>`.',
'Define the base: `class Vehicle { protected: int speed = 0; public: Vehicle() { std::cout << "Vehicle built!" << std::endl; } ~Vehicle() { std::cout << "Vehicle destroyed!" << std::endl; } void setSpeed(int s) { speed = s; } };`.',
'Define the child: `class Car : public Vehicle { public: Car() { std::cout << "Car built!" << std::endl; } ~Car() { std::cout << "Car destroyed!" << std::endl; } void honk() { std::cout << "Beep! Speed: " << speed << std::endl; } };`.',
'In `main()`, open a scope block with `{` and create `Car myCar;` inside it.',
'Call `myCar.setSpeed(60);` (inherited method) and `myCar.honk();` (unique method).',
'Close the scope block with `}` and run the program with `g++ inherit.cpp -o inherit && ./inherit`.',
'EXPECT THIS EXACT OUTPUT ORDER: `Vehicle built!` then `Car built!` then `Beep! Speed: 60` then `Car destroyed!` then `Vehicle destroyed!` — proof of base-first construction and reverse-order destruction.'
],
goal: 'You established an IS-A hierarchy, reused inherited behavior, accessed protected state from a subclass, and traced the deterministic base/derived lifecycle order.'
},
[
q('How do you declare that `class Dog` inherits publicly from `class Animal`?', ['class Dog inherits Animal', 'class Dog + Animal', 'class Dog : public Animal', 'class Animal : public Dog'], 2, 'The colon followed by the access specifier (`: public Animal`) establishes the inheritance link from the base class. **Why others are wrong:** `inherits` and `+` are not C++ syntax, and reversing the order makes Animal the child, inverting the relationship.'),
q('What does the `protected` access modifier do?', ['Makes the variable public to everyone', 'Locks the variable completely, even from child classes', 'Hides the variable from the outside world but allows derived (child) classes to access it directly', 'Changes the variable type'], 2, '`protected` maintains encapsulation from external clients while trusting subclasses with direct access to the member. **Why others are wrong:** It is not public, not fully locked (that is `private`), and access modifiers never change types.'),
q('When a derived object is created, in what order do constructors run?', ['Derived first, then base', 'Base first, then derived', 'Both at the exact same time', 'Random order chosen by the compiler'], 1, 'The base subobject must exist and be initialized before the derived constructor body runs, so construction flows base-to-derived. **Why others are wrong:** Derived-first would let the child touch an uninitialized base, simultaneous execution is impossible, and the order is strictly defined, never random.'),
q('In what order do destructors run when a derived object dies?', ['Derived first, then base', 'Base first, then derived', 'Only the derived destructor runs', 'Only the base destructor runs'], 0, 'Destruction is the reverse of construction: the derived part is torn down first while the base subobject is still alive, then the base destructor runs. **Why others are wrong:** Base-first destruction would destroy state the derived destructor still needs, and both destructors always run.'),
q('Which members of a base class are NOT accessible inside a derived class?', ['public members', 'protected members', 'private members', 'All members are accessible'], 2, 'Private members belong exclusively to the base class scope; derived classes must use public/protected getters or setters to interact with them. **Why others are wrong:** public and protected members are visible to derived classes, so "all members" is incorrect.')
],
['Inheritance lets a child class reuse a parent\'s variables and methods automatically (DRY).', 'Use the colon syntax: class Child : public Parent.', 'protected hides members from outsiders but shares them with child classes.', 'Construction runs base-first; destruction runs derived-first.', 'Beware the Diamond Problem when combining multiple inheritance paths.']
),
'If you want to use a big terminal, use your CMD. Full guide is in Lesson 1.'
),
L(
'cpp-18', 18, 'Polymorphism & Virtual Functions', '🎭',
'A Dog should bark and a Cat should meow — but both are Animals. Polymorphism ("many forms") lets a single command like `speak()` behave differently depending on the TRUE type of the object receiving it. This is the single most powerful idea in object-oriented C++, and it all hinges on one keyword: `virtual`.',
[
{ title: '1. Method Overriding', beginner: 'If the parent class has `void speak()`, the child class can write its OWN `void speak()` with completely different code inside. When you call `speak()` on the child object, the child\'s version wins!', advanced: 'Overriding requires an exact signature match (name, parameters, const-ness). Without the `virtual` keyword, a same-named derived method merely *hides* the base method rather than overriding it — a subtle and classic C++ bug.' },
{ title: '2. The Pointer Problem (Static Binding)', beginner: 'In advanced C++ we group objects using base-class pointers: `Animal* ptr = &myDog;`. But because the pointer THINKS it points at a generic Animal, calling `ptr->speak()` triggers the generic animal sound — NOT the dog bark! Massive problem.', advanced: 'By default, C++ resolves method calls at COMPILE time based on the pointer\'s declared type (static binding). The compiler sees `Animal*` and binds `Animal::speak`, completely ignoring that a `Dog` actually lives at that address at runtime.' },
{ title: '3. The virtual Keyword & the V-Table', beginner: 'To fix this, put `virtual` in front of the parent\'s method: `virtual void speak()`. This tells C++: "At runtime, check what the object REALLY is, and call ITS version!" Now `ptr->speak()` correctly barks.', advanced: '`virtual` enables dynamic dispatch: every object of a polymorphic class carries a hidden pointer (vptr) to a per-class virtual table (vtable) of function pointers. The call becomes an indirect lookup through that table — a tiny runtime cost that buys enormous architectural flexibility.' },
{ title: '4. override & final Keywords', beginner: 'In the child class, add `override` at the end: `void speak() override { ... }`. It doesn\'t change behavior — it makes the compiler double-check that you are truly overriding something, catching typos like `spek()` instantly.', advanced: '`override` and `final` are context-sensitive keywords. `override` forces compile-time verification of the override; `final` on a method blocks further overriding, and `final` on a class blocks further inheritance — both also enable compiler devirtualization optimizations.' },
{ title: '5. Virtual Destructors & Object Slicing (Expert Teaser)', beginner: 'If you delete a child object through a base-class pointer and the base destructor is NOT virtual, only half the object gets cleaned up — a silent memory leak! And copying a child into a base variable chops off the child parts (slicing).', advanced: '*(Pro Track Preview)* Deleting a derived object through a base pointer with a non-virtual destructor is undefined behavior — the derived destructor never runs. Object slicing occurs when passing derived objects by value into base parameters. The C++ Expert track covers vtable internals and slicing defenses in depth.' }
],
{
title: 'The Farm Simulator (Dynamic Dispatch Proof)',
intro: 'Prove that virtual functions make base-class pointers call the correct derived behavior at runtime.',
steps: [
'Create `farm.cpp` with `#include <iostream>`.',
'Define: `class Animal { public: virtual void speak() { std::cout << "*generic sound*" << std::endl; } };`.',
'Define: `class Cow : public Animal { public: void speak() override { std::cout << "Moo!" << std::endl; } };`.',
'Define: `class Dog : public Animal { public: void speak() override { std::cout << "Woof!" << std::endl; } };`.',
'In `main()`: `Cow myCow; Dog myDog;`.',
'Create base pointers: `Animal* ptr1 = &myCow; Animal* ptr2 = &myDog;`.',
'Call `ptr1->speak(); ptr2->speak();` and run. EXPECT: `Moo!` then `Woof!`.',
'EXPERIMENT: remove the word `virtual` from Animal, recompile, and run again. EXPECT: `*generic sound*` twice — proof that static binding ignores the true object type.'
],
goal: 'You implemented run-time polymorphism via vtables, verified dynamic dispatch through base pointers, and empirically observed the failure mode of static binding.'
},
[
q('Why do we need the `virtual` keyword on base class methods?', ['To make the method run on the internet', 'To enable dynamic binding so a base pointer pointing to a derived object executes the derived object\'s overridden method', 'To prevent the method from being modified', 'To delete the method'], 1, '`virtual` installs a vtable lookup so the call is resolved against the object\'s true runtime type instead of the pointer\'s compile-time type. **Why others are wrong:** It has nothing to do with networking or deletion, and it explicitly enables (not prevents) overriding.'),
q('What is the purpose of the `override` keyword in a derived class?', ['It forces the compiler to verify that you are actually overriding a valid virtual base method (catching signature typos)', 'It deletes the base method entirely', 'It makes the code run 10x faster', 'It allows you to change the return type freely'], 0, '`override` turns silent method-hiding bugs into compile errors by demanding a matching virtual base method. **Why others are wrong:** It deletes nothing, changes no performance characteristics, and does not relax return-type rules.'),
q('Without `virtual`, what happens when you call `ptr->speak()` on an `Animal* ptr` that actually points to a `Cow`?', ['The Cow version runs', 'The Animal version runs because the call is bound at compile time to the pointer type', 'The program crashes', 'Both versions run'], 1, 'Static binding resolves the call against the declared pointer type (`Animal`), so the base implementation executes. **Why others are wrong:** The derived version requires dynamic dispatch, crashes do not occur, and only one method ever runs per call.'),
q('Why should a base class that is meant for polymorphic deletion have a virtual destructor?', ['To make destruction faster', 'So that deleting a derived object through a base pointer also runs the derived destructor, preventing leaks and undefined behavior', 'Because destructors cannot be private', 'To allow multiple inheritance'], 1, 'A virtual destructor guarantees the full destruction chain (derived then base) runs when deleting through a base pointer. **Why others are wrong:** It is not about speed, access modifiers, or inheritance permissions — it is about correct, complete cleanup.'),
q('What does marking a method `final` do?', ['It makes the method run at program end', 'It prevents any derived class from overriding that method further', 'It deletes the method after one use', 'It makes the method static'], 1, '`final` seals the method against further overriding, locking the behavior for all deeper subclasses. **Why others are wrong:** It does not affect timing, lifetime, or staticness — only overridability.')
],
['Polymorphism lets one command behave differently per true object type.', 'Base pointers use static binding by default and call the BASE version.', 'The virtual keyword enables runtime dynamic dispatch via vtables.', 'Always add override in child classes to catch signature typos at compile time.', 'Give polymorphic base classes virtual destructors to avoid silent leaks.']
),
'If you want to use a big terminal, use your CMD. Full guide is in Lesson 1.'
),
L(
'cpp-19', 19, 'Abstract Classes & Pure Virtual Interfaces', '📐',
'Some concepts are too abstract to ever exist alone. You can never see a generic "Shape" walking around — only Rectangles and Circles exist. Abstract classes let you define strict contracts: "Any class claiming to be a Shape MUST provide an area() function." This is how professional codebases enforce architecture at compile time.',
[
{ title: '1. Pure Virtual Functions (= 0)', beginner: 'A pure virtual function is a promise with no code behind it: `virtual double area() = 0;`. The `= 0` means "this method has NO body here — every child MUST write its own version."', advanced: 'The `= 0` specifier (pure-specifier) marks a virtual function with no implementation in that class. A class containing at least one pure virtual function becomes an abstract class, and the compiler enforces the contract on every concrete descendant.' },
{ title: '2. Abstract Classes Cannot Be Instantiated', beginner: 'You can never create an object of an abstract class. Typing `Shape s;` makes the compiler scream an error. The blueprint is too incomplete to build — it exists only to be inherited from.', advanced: 'Instantiating an abstract type is a hard compile-time error. You may, however, freely use pointers and references to the abstract type (`Shape*`, `Shape&`) — which is exactly how polymorphic collections are built.' },
{ title: '3. Interfaces in C++', beginner: 'An "Interface" is a special abstract class that contains ONLY promises (pure virtual functions) and no data at all. It is a pure contract: "If you want to plug into this system, you must implement these exact methods."', advanced: 'C++ has no `interface` keyword; the pattern is an all-pure-virtual class with a virtual destructor. Because it holds no state, a class can inherit from MULTIPLE interfaces simultaneously — C++\'s safe, sanctioned form of multiple inheritance.' },
{ title: '4. Derived Classes Must Fulfill EVERY Promise', beginner: 'If a child class forgets to implement even ONE pure virtual function, that child ALSO becomes abstract and cannot be instantiated. The compiler refuses to build half-finished objects.', advanced: 'A derived class remains abstract until it overrides every inherited pure virtual function. This gives you compile-time proof that concrete types fully satisfy their contracts — a powerful architectural guarantee.' },
{ title: '5. Static Polymorphism via CRTP (Expert Teaser)', beginner: 'Virtual functions cost a tiny bit of speed at runtime. There is a trick to get polymorphism with ZERO runtime cost: templates! The child passes ITSELF to the parent as a template parameter.', advanced: '*(Pro Track Preview)* The Curiously Recurring Template Pattern (`class Dog : public Animal<Dog>`) resolves polymorphic calls at compile time through static dispatch, eliminating vtable lookups entirely. The C++ Expert track compares dynamic vs static polymorphism performance in depth.' }
],
{
title: 'The Shape Contract Engine',
intro: 'Define an abstract Shape interface and prove that the compiler enforces the contract on every concrete shape.',
steps: [
'Create `shapes.cpp` with `#include <iostream>` and `#include <vector>`.',
'Define the interface: `class Shape { public: virtual double area() const = 0; virtual ~Shape() {} };`.',
'Define: `class Rectangle : public Shape { double w, h; public: Rectangle(double w, double h) : w(w), h(h) {} double area() const override { return w * h; } };`.',
'Define: `class Circle : public Shape { double r; public: Circle(double r) : r(r) {} double area() const override { return 3.14159 * r * r; } };`.',
'In `main()`: `std::vector<Shape*> shapes = { new Rectangle(3, 4), new Circle(2) };`.',
'Loop: `for (Shape* s : shapes) { std::cout << s->area() << std::endl; }` — EXPECT `12` then `12.5664`.',
'BREAK IT ON PURPOSE: add `Shape s;` anywhere and recompile. Read the compiler error: "cannot declare variable \'s\' to be of abstract type \'Shape\'" — the contract is enforced at compile time!'
],
goal: 'You defined a pure-virtual interface, implemented concrete shapes, stored them polymorphically, and witnessed compile-time contract enforcement.'
},
[
q('What does `virtual double area() = 0;` mean?', ['The method returns zero', 'The method is a pure virtual function with no body here — derived classes must implement it', 'The method is private', 'The method runs zero times'], 1, 'The `= 0` pure-specifier declares a contract with no implementation in this class, making the class abstract. **Why others are wrong:** It does not define a return value, access level, or execution count.'),
q('Can you create an object of an abstract class (e.g., `Shape s;`)?', ['Yes, always', 'No — the compiler rejects instantiation of abstract types', 'Only inside main()', 'Only if it has a constructor'], 1, 'Abstract classes are incomplete blueprints; instantiation is a compile-time error. **Why others are wrong:** No scope or constructor makes an abstract type instantiable — pointers and references are the only legal handles.'),
q('What happens if a derived class forgets to implement ONE pure virtual function?', ['It works fine with a warning', 'The derived class also becomes abstract and cannot be instantiated', 'The base implementation is used automatically', 'The program crashes at runtime'], 1, 'The contract remains unfulfilled, so the derived class inherits abstract status and instantiation fails at compile time. **Why others are wrong:** There is no silent fallback to a base body (none exists), no runtime crash, and no mere warning.'),
q('What is an "interface" in C++ terms?', ['A special compiler flag', 'A class containing only pure virtual functions (and usually a virtual destructor), defining a pure contract with no data', 'A type of loop', 'A header file'], 1, 'The interface pattern is an all-pure-virtual class; implementing classes plug into systems through it, and multiple interface inheritance is safe and common. **Why others are wrong:** It is not a flag, loop, or file — it is a class design pattern.'),
q('Why do interface classes almost always declare a virtual destructor?', ['To make objects delete faster', 'So deleting implementations through an interface pointer runs the full, correct destruction chain', 'Because pure virtual classes cannot have constructors', 'To enable multiple inheritance'], 1, 'Implementations are routinely owned and deleted via interface pointers; a virtual destructor guarantees their derived destructors execute. **Why others are wrong:** Speed is irrelevant, constructors are allowed, and multiple inheritance does not depend on it.')
],
['Pure virtual functions (= 0) define contracts with no implementation.', 'Abstract classes can never be instantiated — only pointed to or referenced.', 'Interfaces are all-pure-virtual classes and allow safe multiple inheritance.', 'A derived class stays abstract until EVERY pure virtual function is overridden.', 'Compile-time contract enforcement catches half-finished implementations before runtime.']
),
'If you want to use a big terminal, use your CMD. Full guide is in Lesson 1.'
),
L(
'cpp-20', 20, 'Dynamic Arrays (std::vector)', '🚄',
'Standard C++ arrays are rigid: `int scores[5]` can never hold a sixth score. But real programs — shopping carts, message queues, game inventories — never know their size in advance. `std::vector` is the smart, self-growing, heap-managed array that solves this forever, and it is the single most-used container in professional C++.',
[
{ title: '1. Declaring Vectors', beginner: 'Include `<vector>`, then create one with angle brackets: `std::vector<int> scores;`. Notice we gave NO size — it starts completely empty and grows as needed!', advanced: '`std::vector<T>` is a sequence container managing a dynamic heap-allocated array. It tracks two numbers: `size()` (active elements) and `capacity()` (allocated slots), decoupling logical length from physical memory.' },
{ title: '2. push_back & Reallocation', beginner: 'Add items with `.push_back(100);` — it pushes the value onto the end and automatically grows the container if it is full. You never manage memory yourself!', advanced: 'When size reaches capacity, `push_back` allocates a LARGER block (typically double), moves existing elements over, and frees the old block. Critical gotcha: reallocation invalidates all pointers, references, and iterators into the vector.' },
{ title: '3. Accessing Elements Safely', beginner: 'Access with brackets like arrays: `scores[0]`. But brackets never check bounds! The safer `.at(0)` method throws a clean error if you go out of range instead of corrupting memory.', advanced: '`operator[]` offers unchecked access for maximum speed; `.at()` performs bounds checking and throws `std::out_of_range`. `.front()`, `.back()`, and `.size()` all run in constant O(1) time.' },
{ title: '4. Removing & Iterating', beginner: 'Delete the last item instantly with `.pop_back()`. And loop through everything cleanly with a range-based for loop: `for (int v : scores) { ... }` — no counters needed!', advanced: '`pop_back` destroys the final element and decrements size (capacity stays reserved for future pushes). Range-for loops use the vector\'s iterators internally; prefer `for (auto& x : vec)` to avoid copying elements each iteration.' },
{ title: '5. reserve() & Cache Locality (Expert Teaser)', beginner: 'If you know you will add 1,000 items, you can tell the vector upfront: `scores.reserve(1000);`. It allocates once and never regrows — much faster!', advanced: '*(Pro Track Preview)* `reserve` eliminates repeated reallocations and element moves. Because vectors store elements contiguously, they are extremely cache-friendly — vastly outperforming node-based containers like `std::list` in real workloads. The Expert track benchmarks this.' }
],
{
title: 'The Dynamic Inventory System',
intro: 'Build a self-growing inventory, inspect its size, iterate it, shrink it, and witness safe bounds checking.',
steps: [
'Create `inventory.cpp` with `#include <iostream>`, `#include <string>`, and `#include <vector>`.',
'In `main()`: `std::vector<std::string> inventory;`.',
'Add items: `inventory.push_back("Sword"); inventory.push_back("Shield"); inventory.push_back("Potion");`.',
'Print the count: `std::cout << inventory.size() << std::endl;` — EXPECT `3`.',
'Loop and print: `for (const auto& item : inventory) { std::cout << item << std::endl; }` — EXPECT Sword, Shield, Potion.',
'Remove the last: `inventory.pop_back();` then print size again — EXPECT `2`.',
'Test safety: wrap `inventory.at(10);` in a try/catch and print the caught message — EXPECT a clean `std::out_of_range` error instead of a crash.'
],
goal: 'You managed a dynamically resizing heap container, iterated it safely, shrank it, and observed exception-based bounds checking in action.'
},
[
q('What is the primary advantage of `std::vector` over a standard C-style array?', ['It uses fewer CPU cycles always', 'It can dynamically resize itself at runtime to accommodate new elements', 'It can hold multiple different data types at once', 'It does not require #include'], 1, 'Vectors allocate and reallocate heap memory automatically as elements are pushed, unlike fixed-size compile-time arrays. **Why others are wrong:** Vectors are homogeneous (one type), still require `<vector>`, and are not universally faster — their win is dynamic sizing.'),
q('What happens internally when a vector runs out of capacity during `push_back`?', ['The program crashes', 'It asks the user for more memory', 'It allocates a larger block, moves existing elements, and frees the old block', 'It converts into a linked list'], 2, 'Reallocation grows capacity (commonly doubling), migrates elements, and releases the old buffer — transparently to the programmer. **Why others are wrong:** No crash, no user prompt, and no conversion to another container type occurs.'),
q('What is the difference between `vec[5]` and `vec.at(5)`?', ['They are identical', '`.at()` performs bounds checking and throws std::out_of_range on invalid indexes; `[]` does not check', '`[]` is slower but safer', '`.at()` only works on strings'], 1, '`.at()` trades a tiny speed cost for memory-safe bounds validation; `[]` is unchecked raw access. **Why others are wrong:** They are not identical, `[]` is the faster-but-unsafe option, and `.at()` works on any element type.'),
q('What does `vec.size()` return?', ['The total allocated capacity', 'The number of active elements currently stored', 'The byte size of the vector', 'The maximum possible elements'], 1, '`size()` counts live elements; `capacity()` reports allocated slots, which may be larger. **Why others are wrong:** Byte size requires `sizeof` math, capacity is a different method, and maximums are implementation limits.'),
q('Why does reallocation invalidate pointers and iterators into a vector?', ['Because the vector encrypts its data', 'Because elements are moved to a brand-new memory block, so old addresses point to freed memory', 'Because iterators expire after 1 second', 'Because the vector becomes private'], 1, 'After reallocation the original buffer is freed; any handle into it dangles. **Why others are wrong:** No encryption, timers, or access changes are involved — it is pure address migration.')
],
['Include <vector> and declare with angle brackets: std::vector<T> name;', 'push_back grows the container automatically; pop_back removes the last item.', 'Use .at() for bounds-checked safety, [] for raw speed.', 'size() counts active elements; capacity() counts allocated slots.', 'reserve() upfront avoids repeated reallocations and iterator invalidation.']
),
'If you want to use a big terminal, use your CMD. Full guide is in Lesson 1.'
),
L(
'cpp-21', 21, 'Advanced Strings (std::string)', '📝',
'You have used strings to store text, but `std::string` is actually a full-featured class packed with methods. Searching for substrings, slicing sentences apart, and gluing text together are built-in superpowers — and understanding how strings manage memory separates beginners from professionals.',
[
{ title: '1. Length & The String Class', beginner: 'Find out how many characters a string holds with `.length()` or `.size()`: `std::string name = "Leo";` means `name.length()` is 3. Both methods do the exact same thing!', advanced: '`std::string` dynamically manages a character buffer. Modern implementations apply the Small String Optimization (SSO): short strings live INSIDE the object itself with zero heap allocation, making small-string operations extremely fast.' },
{ title: '2. Concatenation (+ vs +=)', beginner: 'Glue strings together with `+`: `std::string full = "Bat" + "man";`. Append onto an existing string with `+=`. Both are natural and readable.', advanced: '`+` constructs a brand-new string object (copying both operands), while `+=` appends into the existing buffer, reusing spare capacity. In heavy loops, `+=` (or `.append()`) avoids repeated temporary allocations.' },
{ title: '3. Finding Substrings & npos', beginner: 'Search with `.find("@")`. If found, it returns the index number. If NOT found, it returns a special giant value called `std::string::npos` — always compare against it!', advanced: '`.find()` returns a `size_t` (unsigned). `npos` is the maximum `size_t` value, serving as the universal "not found" sentinel. Never compare find results against `-1` directly without understanding unsigned conversion.' },
{ title: '4. Extracting with substr', beginner: 'Slice out chunks with `.substr(start, length)`. On `"Hello World"`, `.substr(0, 5)` returns exactly `"Hello"` — start at index 0, grab 5 characters.', advanced: '`substr` constructs and returns a NEW string by copying the requested range — it does not create a view. For non-owning, zero-copy slices, modern C++ offers `std::string_view`.' },
{ title: '5. std::string_view (Expert Teaser)', beginner: 'Passing a big string into a function copies the whole text — slow! `std::string_view` is a lightweight "window" that looks at existing text without copying a single character.', advanced: '*(Pro Track Preview)* `string_view` stores only a pointer and a length, giving O(1) non-owning access. The danger: it must never outlive the text it views (dangling view). The Expert track covers ownership-safe view usage.' }
],
{
title: 'The Email Validator & Parser',
intro: 'Search, validate, and slice an email address into username and domain using string member functions.',
steps: [
'Create `email.cpp` with `#include <iostream>` and `#include <string>`.',
'Declare: `std::string email = "hero@server.com";`.',
'Find the at-sign: `size_t pos = email.find("@");`.',
'Validate: `if (pos == std::string::npos) { std::cout << "Invalid email!" << std::endl; }`.',
'Extract username: `std::string user = email.substr(0, pos);` and print it — EXPECT `hero`.',
'Extract domain: `std::string domain = email.substr(pos + 1);` and print it — EXPECT `server.com`.',
'Build a greeting: `std::string msg = "Welcome, " + user + "!";` and print it — EXPECT `Welcome, hero!`.'
],
goal: 'You searched, validated, and sliced string data using find, npos, substr, and concatenation — the core text-processing toolkit.'
},
[
q('What does `myString.find("Z")` return if "Z" is NOT in the string?', ['-1', '0', 'false', 'std::string::npos'], 3, 'Because indexes are unsigned, C++ uses `npos` (the maximum size_t) as the not-found sentinel. **Why others are wrong:** -1 is signed and misleading, 0 is a valid index, and find does not return booleans.'),
q('If `std::string word = "Programming";`, what does `word.substr(3, 4)` extract?', ['"gram"', '"Prog"', '"ramm"', '"ming"'], 0, 'It starts at index 3 (the first \'g\') and copies exactly 4 characters: g-r-a-m. **Why others are wrong:** "Prog" starts at index 0, "ramm" starts at index 4, and "ming" is the tail — none match start=3, length=4.'),
q('Why is `+=` generally more efficient than `+` when building a string in a loop?', ['+= encrypts the data', '+= appends into the existing buffer reusing capacity, while + creates a new temporary string object each time', '+= skips vowels', '+ only works on numbers'], 1, 'Repeated `+` generates and destroys temporaries; `+=` grows the live buffer in place. **Why others are wrong:** No encryption or vowel logic exists, and `+` works on strings just fine — it is simply more allocation-heavy.'),
q('What is the Small String Optimization (SSO)?', ['Storing strings in a database', 'Short strings are stored inside the string object itself, avoiding heap allocation entirely', 'Compressing strings with ZIP', 'Deleting unused strings'], 1, 'SSO keeps small character buffers inline within the object, eliminating heap traffic for the most common string sizes. **Why others are wrong:** It involves no databases, compression algorithms, or deletion policies.'),
q('What is the key characteristic of `std::string_view`?', ['It owns and copies the text', 'It is a non-owning, zero-copy window over existing character data', 'It converts text to numbers', 'It encrypts the text'], 1, 'A string_view holds only a pointer and length, viewing text without copying or owning it. **Why others are wrong:** Ownership, conversion, and encryption are all outside its design — and its non-owning nature is exactly why dangling views must be avoided.')
],
['Use .length()/.size() to count characters and .find() to search.', 'Always compare find() results against std::string::npos for safety.', 'substr(start, length) extracts copied slices of text.', 'Prefer += over + in loops to avoid temporary string allocations.', 'std::string_view gives zero-copy read access — but never let it outlive its source.']
),
'If you want to use a big terminal, use your CMD. Full guide is in Lesson 1.'
),
L(
'cpp-22', 22, 'File I/O (Reading & Writing Streams)', '💾',
'If your player spends five hours building a city and closes the game, RAM is wiped and the city is gone forever. To make data survive power loss, you must write it to physical storage. File streams (`<fstream>`) are C++\'s bridge between volatile memory and the permanent hard drive.',
[
{ title: '1. The <fstream> Header & Stream Types', beginner: 'Include `<fstream>` to unlock three tools: `ofstream` (write OUT to a file), `ifstream` (read IN from a file), and `fstream` (both). Think of them as pipes connecting your program to a file on disk.', advanced: 'File stream objects wrap operating-system file descriptors. They follow RAII: the constructor opens the resource and the destructor closes it, guaranteeing the OS lock is released even if an exception interrupts your code.' },
{ title: '2. Writing with ofstream & Modes', beginner: 'Create and write exactly like `std::cout`: `std::ofstream outFile("save.txt"); outFile << "Score: 100";`. WARNING: by default this ERASES any existing file content!', advanced: 'Default `ios::out` truncates existing files. Pass `std::ios::app` to append without erasing, or `std::ios::binary` to write raw bytes instead of formatted text. Choosing the wrong mode is the #1 beginner data-loss bug.' },
{ title: '3. Reading with ifstream & getline', beginner: 'Read line-by-line with a while loop: `while (std::getline(inFile, line)) { ... }`. The loop automatically stops when the file runs out of lines — no manual counting needed!', advanced: '`std::getline` extracts characters until a newline delimiter and returns the stream, whose boolean state flips false at EOF. The extraction operator `>>` instead stops at whitespace — choose per your data format.' },
{ title: '4. Closing & Error Checking', beginner: 'Always call `.close()` when finished so data is fully flushed to disk and the file is unlocked. And always check `if (!inFile)` after opening — the file might not exist!', advanced: 'The destructor closes implicitly, but explicit `.close()` lets you detect and handle flush errors immediately. Always validate stream state (`is_open()`, `if (!stream)`) before I/O — silent failure on missing files is a classic production bug.' },
{ title: '5. Binary I/O & Serialization (Expert Teaser)', beginner: 'Text files are human-readable but slow and imprecise for numbers. Binary mode saves the raw memory bytes directly — smaller, faster, and exact.', advanced: '*(Pro Track Preview)* Binary I/O uses `read()`/`write()` with `reinterpret_cast<char*>` to dump raw memory. It introduces portability concerns (endianness, struct padding) that the C++ Expert track solves with serialization protocols and `struct` packing.' }
],
{
title: 'The High Score Saver',
intro: 'Write a high score to disk, close the file, read it back, and append a second entry — proving persistent storage works.',
steps: [
'Create `scores.cpp` with `#include <iostream>`, `#include <string>`, and `#include <fstream>`.',
'Write: `std::ofstream outFile("score.txt"); outFile << "High Score: 9999" << std::endl; outFile.close();`.',
'Read back: `std::ifstream inFile("score.txt"); std::string line; std::getline(inFile, line); std::cout << line << std::endl;` — EXPECT `High Score: 9999`.',
'Close it: `inFile.close();`.',
'Append: `std::ofstream app("score.txt", std::ios::app); app << "Runner Up: 5000" << std::endl; app.close();`.',
'Reopen for reading and loop `while (std::getline(in2, line)) std::cout << line << std::endl;` — EXPECT BOTH lines printed, proving append did not erase.',
'Run the program twice and inspect `score.txt` in your file explorer to confirm persistence across runs.'
],
goal: 'You persisted runtime state to non-volatile storage, validated stream states, and controlled truncation vs append behavior with file modes.'
},
[
q('Which header must be included to read and write physical files?', ['<iostream>', '<fstream>', '<file>', '<disk>'], 1, '`<fstream>` defines ofstream, ifstream, and fstream file stream classes. **Why others are wrong:** `<iostream>` handles console streams only, and `<file>`/`<disk>` do not exist in the standard library.'),
q('What happens by default if you open an EXISTING file with `std::ofstream out("data.txt");`?', ['It appends to the end', 'It truncates (erases) the existing content', 'It throws an exception', 'It opens in read-only mode'], 1, 'Default output mode truncates the file, which silently destroys prior data if you intended to append. **Why others are wrong:** Appending requires `std::ios::app`, no exception is thrown by default, and ofstream is write-oriented.'),
q('Why is `while (std::getline(file, line))` the idiomatic line-reading loop?', ['Because getline returns the stream, whose state becomes false at EOF, ending the loop exactly when data runs out', 'Because getline is faster than >>', 'Because it skips empty files entirely', 'Because it auto-closes the file'], 0, 'The stream\'s boolean conversion provides a clean EOF/failure check inline with extraction. **Why others are wrong:** Speed vs `>>` is not the point, empty files are handled naturally, and closing is the destructor\'s job.'),
q('Why should you check `if (!file)` or `file.is_open()` after opening a file?', ['To encrypt the file', 'Because the file may not exist or be locked, and silent failure would corrupt your logic', 'To make reading faster', 'Because C++ requires it syntactically'], 1, 'Opening can fail (missing file, permissions); unchecked streams fail silently and produce garbage logic downstream. **Why others are wrong:** It is not about encryption or speed, and the check is semantic safety, not syntax enforcement.'),
q('What is the purpose of `std::ios::binary` mode?', ['To compress the file automatically', 'To read/write raw memory bytes without text formatting transformations', 'To password-protect the file', 'To convert text to uppercase'], 1, 'Binary mode disables newline translation and formatting, moving exact byte sequences — essential for serialization and media data. **Why others are wrong:** It performs no compression, encryption, or case conversion.')
],
['Include <fstream> for ofstream (write), ifstream (read), fstream (both).', 'Default ofstream mode TRUNCATES; use std::ios::app to append safely.', 'Read line-by-line with while (std::getline(file, line)).', 'Always validate stream state and close files explicitly when done.', 'Binary mode moves raw bytes — the gateway to serialization.']
),
'If you want to use a big terminal, use your CMD. Full guide is in Lesson 1.'
),
L(
'cpp-23', 23, 'Modern C++ Features (auto, nullptr, constexpr)', '⚡',
'Legacy C++ codebases are full of verbose type names and dangerous null-pointer bugs. Modern C++ (C++11 and beyond) introduced sleek features that make code safer, faster, and dramatically cleaner — without sacrificing an ounce of static typing power.',
[
{ title: '1. Type Deduction (auto)', beginner: 'Tired of typing `std::vector<std::string>::iterator`? Just write `auto it = ...;` and the compiler figures out the exact type for you at compile time. Same safety, zero verbosity.', advanced: '`auto` deduction happens entirely at compile time — there is no runtime cost and no dynamic typing. Note it strips references and const by default; write `auto&` or `const auto&` to preserve them, which also avoids accidental copies in loops.' },
{ title: '2. The Safe Null (nullptr)', beginner: 'Old code used `0` or `NULL` for empty pointers, which confused the compiler with integer math. Modern C++ gives us `nullptr` — a dedicated, type-safe "points to nothing" value.', advanced: '`nullptr` has its own type (`std::nullptr_t`), eliminating the infamous overload ambiguity where `0` could match an integer parameter instead of a pointer parameter. It makes intent explicit and templates safer.' },
{ title: '3. Range-Based For Loops', beginner: 'Instead of `for (int i = 0; i < vec.size(); i++)`, write `for (int n : vec)`. It reads like English: "for each number in vec". No counters, no out-of-bounds risks!', advanced: 'Range-for desugars into iterator pairs (`begin()`/`end()`), working uniformly across arrays and all standard containers. Use `for (auto& x : vec)` to mutate in place, or `const auto&` to read without copying.' },
{ title: '4. Compile-Time Evaluation (constexpr)', beginner: 'Some math never changes: `constexpr int SQUARE = 5 * 5;`. The compiler computes it BEFORE your program even runs, saving runtime CPU cycles for free.', advanced: '`constexpr` functions and variables are evaluated at compile time when given constant inputs, enabling their use in array sizes and template arguments. It is a stronger guarantee than `const`, which merely forbids runtime mutation.' },
{ title: '5. Structured Bindings (Expert Teaser)', beginner: 'Got a pair of values? Unpack them in one line: `auto [x, y] = myPair;`. It is like opening a box and naming both contents instantly.', advanced: '*(Pro Track Preview)* C++17 structured bindings decompose pairs, tuples, arrays, and structs into named variables, dramatically cleaning up map iteration and multi-return patterns. The Expert track combines them with range-for over containers.' }
],
{
title: 'The Modern Syntax Refactor',
intro: 'Rewrite legacy-style code using auto, nullptr, range-for, constexpr, and structured bindings.',
steps: [
'Create `modern.cpp` with `#include <iostream>`, `#include <vector>`, and `#include <utility>`.',
'Deduce a container: `auto numbers = std::vector<int>{1, 2, 3, 4, 5};`.',
'Safe null: `int* ptr = nullptr;` then `if (ptr == nullptr) { std::cout << "Empty pointer" << std::endl; }` — EXPECT `Empty pointer`.',
'Range loop: `for (const auto& n : numbers) { std::cout << n << " "; }` — EXPECT `1 2 3 4 5 `.',
'Compile-time math: `constexpr int SQUARE = 5 * 5; std::cout << SQUARE << std::endl;` — EXPECT `25`.',
'Structured binding: `auto pair = std::make_pair(10, 20); auto [a, b] = pair; std::cout << a + b << std::endl;` — EXPECT `30`.',
'Compile with `g++ -std=c++17 modern.cpp -o modern && ./modern` and verify all five expected outputs.'
],
goal: 'You modernized a codebase with compile-time deduction, type-safe nulls, range iteration, compile-time constants, and structured decomposition.'
},
[
q('What does the `auto` keyword do?', ['Makes variables change type at runtime', 'Instructs the compiler to deduce the variable\'s exact type from its initializer at compile time', 'Runs the variable automatically in a thread', 'Creates a loop'], 1, 'Deduction is a compile-time mechanism preserving full static typing with zero runtime cost. **Why others are wrong:** Types never change at runtime, no threading is implied, and auto is not a loop construct.'),
q('Why was `nullptr` introduced to replace `NULL` or `0`?', ['To look cooler', 'To provide a type-safe null literal that eliminates integer/pointer overload ambiguity', 'To speed up the hard drive', 'To allow pointers to hold strings'], 1, '`nullptr_t` cannot be confused with integers in overload resolution or templates. **Why others are wrong:** Aesthetics and disk speed are irrelevant, and pointers never hold strings.'),
q('How does a range-based for loop (`for (int x : list)`) work internally?', ['It uses raw memory addresses', 'It desugars into begin()/end() iterator pairs, iterating safely without manual counters', 'It copies the whole list first', 'It runs in parallel threads'], 0 + 1, 'Range-for is syntactic sugar over the iterator pair protocol, preventing off-by-one and bounds bugs. **Why others are wrong:** No full copy is made, no parallelism is implied, and raw address arithmetic is hidden behind iterators.'),
q('What is the primary benefit of `constexpr`?', ['It makes variables private', 'It evaluates expressions at compile time, saving runtime work and enabling constant contexts', 'It connects code to the cloud', 'It deletes memory leaks'], 1, 'Compile-time evaluation shifts cost to the compiler and unlocks array-size and template-argument usage. **Why others are wrong:** It affects neither access control, networking, nor leak management.'),
q('What does `auto [x, y] = myPair;` accomplish?', ['It creates two copies of the pair', 'It decomposes the pair into two named variables in one line (structured binding)', 'It deletes the pair', 'It sorts the pair'], 1, 'Structured bindings unpack aggregate/pair/tuple contents into individual names cleanly. **Why others are wrong:** The pair remains intact, nothing is deleted, and no sorting occurs.')
],
['Use auto for compile-time deduction — same safety, less noise.', 'Always use nullptr for empty pointers; never 0 or NULL.', 'Range-based for loops iterate containers safely via iterators.', 'constexpr moves computation to compile time for free runtime speed.', 'Structured bindings (C++17) decompose pairs and tuples in one clean line.']
),
'If you want to use a big terminal, use your CMD. Full guide is in Lesson 1.'
),
L(
'cpp-24', 24, 'Smart Pointers & Ownership (unique_ptr, shared_ptr)', '🛡️',
'Managing heap memory with raw `new` and `delete` is dangerous: forget one `delete` and you leak RAM forever; delete twice and your program explodes. Modern C++ solved this permanently with Smart Pointers — pointers that clean up after themselves automatically, making memory leaks structurally impossible in well-designed code.',
[
{ title: '1. The Raw Pointer Problem', beginner: 'When you create heap data with `new`, YOU are 100% responsible for typing `delete` later. If an error crashes your code before the delete line, that memory is lost forever — a memory leak.', advanced: 'Raw pointers carry no ownership semantics. In code with branches, loops, and exceptions, manual delete reliably gets skipped or doubled. This is precisely the class of bug smart pointers erase by construction.' },
{ title: '2. std::unique_ptr (Exclusive Ownership)', beginner: 'A `unique_ptr` guarantees exactly ONE pointer owns the heap data. When that pointer goes out of scope, the data is deleted automatically. You cannot copy it — only move it!', advanced: '`unique_ptr` enforces exclusive ownership: its copy constructor is deleted, and ownership transfers only via `std::move`. Created with `std::make_unique<T>(...)`, it has zero overhead compared to a raw pointer.' },
{ title: '3. std::shared_ptr (Shared Ownership)', beginner: 'What if several parts of your program need the same heap data? `shared_ptr` keeps a secret counter. Every new owner bumps the count up; every owner dying bumps it down. At zero, the data deletes itself!', advanced: '`shared_ptr` uses a heap-allocated control block holding an atomic reference count. Copying shares ownership; the object dies when the count reaches zero. Beware reference cycles, which keep counts above zero forever.' },
{ title: '4. std::weak_ptr (The Observer)', beginner: 'Sometimes you want to LOOK at shared data without owning it (without keeping it alive). `weak_ptr` watches without counting. When the last real owner dies, the weak pointer simply sees "empty".', advanced: '`weak_ptr` references the control block without incrementing the strong count, breaking cyclic-reference leaks. Call `.lock()` to safely obtain a temporary `shared_ptr`, checking expiry atomically.' },
{ title: '5. make_unique/make_shared & Custom Deleters (Expert Teaser)', beginner: 'Always create smart pointers with `std::make_unique` or `std::make_shared` — they are safer and cleaner than using `new` directly.', advanced: '*(Pro Track Preview)* `make_shared` allocates the object AND control block in ONE memory block (better cache locality), and both makers are exception-safe. Custom deleters let smart pointers manage ANY resource — C file handles, sockets, GPU buffers. Expert track deep-dive.' }
],
{
title: 'The Leak-Free Workspace',
intro: 'Replace dangerous raw heap pointers with unique and shared smart pointers and observe automatic cleanup and reference counting.',
steps: [
'Create `smart.cpp` with `#include <iostream>` and `#include <memory>`.',
'Unique ownership: `auto score = std::make_unique<int>(100); std::cout << *score << std::endl;` — EXPECT `100`.',
'Prove no-copy: uncomment `auto copy = score;` and compile — EXPECT a compile error (unique_ptr is move-only). Re-comment it.',
'Shared ownership: `auto item = std::make_shared<int>(500); std::cout << item.use_count() << std::endl;` — EXPECT `1`.',
'Add an owner: `{ auto second = item; std::cout << item.use_count() << std::endl; }` — EXPECT `2` inside the block.',
'After the block closes, print `item.use_count()` again — EXPECT `1`, proving the temporary owner released automatically.',
'Run the program; no deletes anywhere, yet zero leaks — the smart pointers cleaned up on scope exit.'
],
goal: 'You eliminated manual memory management entirely, enforcing exclusive and shared ownership models with automatic, deterministic cleanup.'
},
[
q('Why are smart pointers preferred over raw pointers in Modern C++?', ['They run slower but safer', 'They automatically manage heap lifetime, preventing leaks and double-frees when they go out of scope', 'They can only hold strings', 'They store data on the stack instead'], 1, 'Smart pointers implement RAII ownership: destruction of the pointer deterministically destroys the owned heap object. **Why others are wrong:** unique_ptr has zero overhead (not slower), they hold any type, and the managed data still lives on the heap.'),
q('What is the ownership rule of `std::unique_ptr`?', ['Multiple pointers can share it freely', 'Exclusive ownership: it cannot be copied, only moved', 'It deletes itself immediately after creation', 'It only works inside functions'], 1, 'Copying is deleted at compile time; ownership transfers only through std::move, guaranteeing a single deleter. **Why others are wrong:** Sharing requires shared_ptr, immediate self-deletion is false, and scope is not restricted to functions.'),
q('How does `std::shared_ptr` know when to delete the heap data?', ['It uses a reference count in a control block; deletion happens when the count reaches zero', 'It asks the operating system every second', 'It deletes data randomly', 'It relies on a garbage collector thread'], 0, 'The atomic strong count tracks live owners; zero owners triggers deterministic deletion. **Why others are wrong:** There is no polling, randomness, or GC thread — C++ cleanup is deterministic and count-driven.'),
q('What problem does `std::weak_ptr` solve?', ['It makes shared_ptr faster', 'It observes shared data without owning it, breaking reference cycles that would otherwise leak forever', 'It converts shared_ptr to unique_ptr', 'It encrypts the data'], 1, 'Weak pointers do not increment the strong count, so cyclic structures can still reach zero and be freed; `.lock()` provides safe temporary access. **Why others are wrong:** It does not accelerate, convert, or encrypt — its role is non-owning observation and cycle-breaking.'),
q('Why are `std::make_unique` and `std::make_shared` recommended over raw `new`?', ['They are exception-safe, cleaner, and (for make_shared) allocate object + control block in one block', 'They run the constructor twice', 'They disable destructors', 'They store data in files'], 0, 'Makers prevent leak windows in complex expressions and improve locality; they also express intent clearly. **Why others are wrong:** Constructors run once, destructors remain active, and no file storage is involved.')
],
['Never manage heap memory with raw new/delete in Modern C++.', 'unique_ptr = exclusive ownership; copy is banned, move transfers it.', 'shared_ptr = shared ownership via an atomic reference count.', 'weak_ptr observes without owning and breaks reference cycles.', 'Always construct with make_unique / make_shared for safety and performance.']
),
'If you want to use a big terminal, use your CMD. Full guide is in Lesson 1.'
),

 L(
'cpp-25', 25, 'Function Templates', '🧬',
'If you write a function to swap two integers, what happens when you need to swap two doubles? Or two strings? Copy-pasting the same logic for every type is exactly the kind of rot templates were invented to kill. Function templates let you write ONE generic blueprint, and the compiler manufactures a perfectly optimized, type-safe version for every type you actually use.',
[
{ title: '1. The Template Syntax', beginner: 'You start a template with `template <typename T>`. Here, `T` is a placeholder for "some data type". So `template <typename T> T getMax(T a, T b)` means "give me any two matching things, and I hand back the bigger one." One function, infinite types!', advanced: 'Templates are the foundation of C++ generic programming. A template is not a function — it is a compile-time blueprint. The compiler performs type deduction from your call arguments and generates a concrete function body for each unique type combination used.' },
{ title: '2. Compile-Time Code Generation', beginner: 'When you call `getMax(5, 10)`, the compiler silently writes a custom integer version of your function behind the scenes. Call `getMax(2.5, 3.7)` and it writes a double version too. You get generic code, but the machine still runs fast, native, type-specific code.', advanced: 'This process is Template Instantiation. Each instantiation is fully type-checked and optimized independently, which is why templates cost zero runtime performance compared to hand-written per-type functions — the duplication happens at compile time, not runtime.' },
{ title: '3. Multiple Types & Deduction', beginner: 'You are not limited to one placeholder! `template <typename T1, typename T2> void printPair(T1 a, T2 b)` lets you mix types freely. And most of the time you never even write the type — C++ deduces it from what you pass in.', advanced: 'Argument deduction matches call-site argument types against the template parameter list. Deduction rules explain classic surprises: `max(1, 2.0)` fails because T cannot deduce to two different types simultaneously — you must cast or specify explicitly.' },
{ title: '4. Template Specialization', beginner: 'Sometimes one type needs special treatment. Maybe your generic `print()` works for everything except booleans, which you want to print as "YES"/"NO". Specialization lets you write a custom version just for that one type.', advanced: 'Full specialization (`template <> void print<bool>(bool b)`) replaces the generic body for one exact type. Partial specialization applies to class templates with pattern-matched parameter lists. Specialization is how the standard library tunes behavior for pointers, const types, and more.' },
{ title: '5. Concepts: Constraining Templates (Expert Teaser)', beginner: 'A raw template accepts ANY type — even types that make no sense (like sorting a boolean!). Modern C++ lets you write rules: "this template only accepts types that can be compared with <". If someone breaks the rule, they get a clean error instead of a wall of template garbage.', advanced: '*(Pro Track Preview)* C++20 Concepts (`template <typename T> requires std::totally_ordered<T>`) constrain template parameters declaratively, replacing SFINAE trickery with readable contracts and dramatically better diagnostics. The Expert track builds custom concepts from scratch.' }
],
{
title: 'The Universal Swapper',
intro: 'Write one generic swap function and prove it works across ints, doubles, and strings without rewriting a single line.',
steps: [
'Create `templates.cpp` with `#include <iostream>` and `#include <string>`.',
'Above `main()`, write: `template <typename T> void mySwap(T& a, T& b) { T temp = a; a = b; b = temp; }`.',
'In `main()`, declare `int x = 5, y = 10;` and call `mySwap(x, y);` then print both. Expect `10 5`.',
'Declare `double d1 = 1.5, d2 = 9.25;` and call `mySwap(d1, d2);` then print. Expect `9.25 1.5`.',
'Declare `std::string s1 = "Hello", s2 = "World";` and call `mySwap(s1, s2);` then print. Expect `World Hello`.',
'BREAK IT ON PURPOSE: call `mySwap(x, d1);` and try to compile. Read the deduction error — T cannot be both int and double at once. This proves templates are type-safe, not type-loose!'
],
goal: 'You implemented generic programming via function templates, enabling type-agnostic code reuse with full compile-time type safety.'
},
[
q('What is the primary purpose of a Function Template in C++?', ['To make functions run slower but safer', 'To write a single generic blueprint that the compiler turns into type-safe code for any data type used', 'To create loops automatically', 'To delete duplicate files from your project'], 1, 'Templates enable generic programming: one algorithm definition, instantiated per type at compile time with full type checking. **Why others are wrong:** Templates do not slow code (instantiations are native), they do not create loops, and they have nothing to do with files.'),
q('When is the actual machine code for a template function generated?', ['At runtime, every time it is called', 'During compilation, when the compiler instantiates the template for each concrete type used', 'When the user types input', 'Never — templates are interpreted'], 1, 'Template instantiation is a compile-time code-generation step; the binary contains ordinary optimized functions for each used type. **Why others are wrong:** There is no runtime generation, no user-input dependency, and C++ templates are never interpreted.'),
q('How do you declare a generic type placeholder in a function template?', ['`<type T>`', '`template <typename T>`', '`template <class: T>`', '`generic(T)`'], 1, '`template <typename T>` (or equivalently `template <class T>`) introduces the placeholder type parameter. **Why others are wrong:** The other spellings are not valid C++ template syntax.'),
q('Why does calling `getMax(1, 2.5)` on `template <typename T> T getMax(T a, T b)` fail to compile?', ['Because integers cannot be compared', 'Because T would have to deduce to two different types (int and double) at once, which deduction forbids', 'Because templates only accept strings', 'Because the function is private'], 1, 'A single template parameter T must deduce consistently from all matching arguments; mixed int/double produces conflicting deductions. **Why others are wrong:** Ints compare fine, templates accept any type, and access specifiers are irrelevant here.'),
q('What does a full template specialization (`template <>`) let you do?', ['Replace the generic body with a custom implementation for one exact type', 'Delete the template entirely', 'Make the template run at runtime', 'Force the template to accept only pointers'], 0, 'Specialization overrides the generic definition for a specific type, letting you tune behavior (e.g., printing bools as YES/NO). **Why others are wrong:** It does not delete templates, move work to runtime, or restrict to pointers.')
],
['Function templates let you write one generic function that works for any data type.', 'Declare them with template <typename T> above the signature; the compiler deduces T from your calls.', 'Instantiation happens at compile time, so generic code stays zero-overhead.', 'Mixed argument types can break deduction — cast or specify explicitly when needed.', 'Specialization and C++20 Concepts let you customize and constrain generic behavior cleanly.']
),
L(
'cpp-26', 26, 'Class Templates', '🏗️',
'Just like functions, entire classes can be generic. This single idea is how the C++ standard library ships one `std::vector` that holds ints, strings, or your custom game entities. Today you stop being a consumer of generic containers and become a builder of them.',
[
{ title: '1. Templating a Class', beginner: 'Put `template <typename T>` above a class and every member can now use `T` as a placeholder type. `template <typename T> class Box { T data; };` is a box that can hold anything — decided later, when you create it.', advanced: 'Class templates parameterize the entire class blueprint: members, methods, and constructors all see T. No code exists until instantiation, so unused member functions of a template are never even compiled for your type.' },
{ title: '2. Instantiation & CTAD', beginner: 'When you create the object, you MUST say what goes inside the angle brackets: `Box<int> intBox;` or `Box<std::string> strBox;`. Modern C++ (17+) can often guess it for you from constructor arguments — that guess is called CTAD.', advanced: 'Historically class templates required explicit arguments; C++17 Class Template Argument Deduction (CTAD) infers them from constructor parameters using deduction guides. Explicit specification remains essential for default-constructed or pointer-based containers.' },
{ title: '3. Methods Outside the Class', beginner: 'If you define a template class method outside the class body, you must repeat the template prefix and add `<T>` to the class name: `template <typename T> void Box<T>::set(T val) { ... }`. Forget it and the compiler gets lost.', advanced: 'Every out-of-line member definition of a class template must be prefixed with the template parameter list and scope-resolved as `ClassName<T>::member`. This reflects that the definition itself is still a template, not a concrete function.' },
{ title: '4. The Foundation of the STL', beginner: 'Every container you have used — vector, map, queue — is a class template under the hood. That is why they all use angle brackets. Understanding this demystifies the entire standard library.', advanced: 'STL containers are class templates parameterized not only by element type but also by allocator (and for associative containers, comparator and hasher), which is how the library achieves extreme flexibility without sacrificing performance or type safety.' },
{ title: '5. Non-Type Template Parameters (Expert Teaser)', beginner: 'Template brackets are not only for types! You can also pass plain values, like a size: `template <typename T, int Size> class FixedArray { T data[Size]; };`. Now `FixedArray<int, 10>` and `FixedArray<int, 256>` are different, perfectly-sized types.', advanced: '*(Pro Track Preview)* Non-type template parameters (integral values, and since C++20 even floating-point and string literals) enable compile-time sized structures like `std::array<T, N>`. The Expert track combines them with constexpr to build fully compile-time validated buffers.' }
],
{
title: 'The Generic Pair Container',
intro: 'Build a custom class template that holds two related values of any type, then instantiate it for ints and strings.',
steps: [
'Create `pairbox.cpp` with `#include <iostream>` and `#include <string>`.',
'Write: `template <typename T> class Pair { private: T first; T second; public: Pair(T f, T s) : first(f), second(s) {} void show() const { std::cout << first << " & " << second << std::endl; } };`.',
'In `main()`, instantiate `Pair<int> p1(10, 20);` and call `p1.show();`. Expect `10 & 20`.',
'Instantiate `Pair<std::string> p2("Hello", "World");` and call `p2.show();`. Expect `Hello & World`.',
'Try CTAD: write `Pair p3(1.5, 2.5);` (no angle brackets) and call `p3.show();`. Expect `1.5 & 2.5` — the compiler deduced double for you!',
'Compile and run; verify all three outputs appear correctly.'
],
goal: 'You engineered a type-agnostic custom container class using class templates and witnessed CTAD in action.'
},
[
q('How do you instantiate a class template named `Holder` to store an integer?', ['`Holder holder;`', '`Holder<int> holder;`', '`Holder(int) holder;`', '`int Holder holder;`'], 1, 'Class templates require the type argument in angle brackets at instantiation: `Holder<int>`. **Why others are wrong:** Plain, parenthesized, and prefixed forms are not valid template instantiation syntax.'),
q('When defining a class template member function outside the class body, what prefix is required?', ['Nothing special', '`template <typename T>` followed by `ClassName<T>::methodName`', '`static template`', '`typename only`'], 1, 'Out-of-line definitions must re-declare the template parameters and scope-resolve through the templated class name `ClassName<T>::`. **Why others are wrong:** Omitting the prefix or using bogus keywords fails compilation.'),
q('What is CTAD (C++17)?', ['Class Template Argument Deduction — the compiler infers template arguments from constructor arguments', 'Compile Time Array Declaration', 'Constant Type Allocation Driver', 'Cached Template Access Design'], 0, 'CTAD lets you write `Pair p(10, 20);` and the compiler deduces `Pair<int>` from the constructor parameter types. **Why others are wrong:** The other expansions are invented and do not exist in the standard.'),
q('Why can `std::vector` hold ints, strings, or custom objects with a single definition?', ['Because it stores everything as text', 'Because it is a class template parameterized by element type (and allocator)', 'Because it uses void pointers internally', 'Because it converts all types to double'], 1, 'Class templates generate a concrete container type per element type at compile time, keeping full type safety. **Why others are wrong:** vector does not store text, does not use type-erasing void pointers, and does not convert types.'),
q('What does `template <typename T, int Size> class FixedArray { T data[Size]; };` demonstrate?', ['A template with a syntax error', 'A non-type template parameter giving compile-time sized storage', 'A runtime-resizable array', 'A partial specialization'], 1, '`Size` is a non-type template parameter: each distinct value produces a distinct type with a fixed compile-time array size. **Why others are wrong:** It is valid syntax, the size is fixed not resizable, and this is a primary template, not a specialization.')
],
['Class templates parameterize entire class blueprints by type.', 'Instantiate with angle brackets: Box<int> box; — or rely on CTAD from constructor args.', 'Out-of-line member definitions need the full template <typename T> and Class<T>:: prefix.', 'Every STL container is a class template — this is the mechanism behind vector, map, and queue.', 'Non-type template parameters enable compile-time sized structures like std::array.']
),
L(
'cpp-27', 27, 'Lambda Expressions & Callbacks', '⚡',
'Sometimes you need a tiny, one-off function — but writing a whole named function three files away feels like overkill. Modern C++ introduced lambdas: anonymous, inline function objects you can write exactly where the logic is needed, capture local state from, and hand to algorithms as callbacks.',
[
{ title: '1. Lambda Syntax', beginner: 'A lambda looks like this: `auto myLambda = []() { std::cout << "Hello!"; };`. Empty brackets, parentheses for parameters, braces for the body. You run it by adding `()` at the end: `myLambda();`.', advanced: 'A lambda expression constructs an unnamed closure object — the compiler generates a unique class with an `operator()` behind the scenes. That is why lambdas can be stored in `auto` variables and passed around like values.' },
{ title: '2. The Capture Clause', beginner: 'By default a lambda cannot see variables from outside itself. The square brackets are its backpack: `[x]` packs a COPY of x inside, `[&x]` packs a live reference to x so the lambda can modify the original.', advanced: 'Capturing by value copies the variable into the closure at creation time; capturing by reference stores a reference bound to the outer object. `[=]` and `[&]` capture everything used, but `[&]` inside deferred or async callbacks is a classic dangling-reference bug source.' },
{ title: '3. Mutable Lambdas & Return Types', beginner: 'A value-captured variable is read-only inside the lambda by default. Add the word `mutable` after the parentheses to allow modifying your private copy. And if you return a value, C++ usually deduces the return type automatically.', advanced: '`mutable` makes the closure\'s `operator()` non-const, permitting mutation of by-value captures (the outer variable is still untouched). For complex bodies returning braced or conditional types, specify the return type explicitly with `-> Type`.' },
{ title: '4. Lambdas as Callbacks & Algorithm Fuel', beginner: 'Lambdas shine when paired with standard algorithms: `std::for_each`, `std::count_if`, `std::sort` all accept a lambda as their "custom rule". You inject your logic inline without naming a function anywhere.', advanced: '`std::function<void(int)>` from `<functional>` type-erases any callable (lambda, function pointer, functor) so callbacks can be stored in containers and class members. Prefer passing lambdas directly to templates when possible to keep inlining opportunities.' },
{ title: '5. Generalized Lambdas (Expert Teaser)', beginner: 'You can even write `auto` inside a lambda\'s parameter list: `[](auto a, auto b) { return a + b; }`. Now one tiny lambda behaves like a template and works for any matching types!', advanced: '*(Pro Track Preview)* Generic lambdas with `auto` parameters are implicitly templates — their `operator()` is a member template. Combined with perfect forwarding (`auto&&...`), they power modern metaprogramming patterns without writing a single `template` keyword.' }
],
{
title: 'The Inline Filter',
intro: 'Use a capturing lambda with std::for_each and std::count_if to filter and analyze a vector inline.',
steps: [
'Create `lambdas.cpp` with `#include <iostream>`, `#include <vector>`, and `#include <algorithm>`.',
'Declare `std::vector<int> nums = {10, 25, 30, 45, 50};` and `int threshold = 30;`.',
'Print all values above the threshold: `std::for_each(nums.begin(), nums.end(), [threshold](int n) { if (n > threshold) std::cout << n << " "; });`. Expect `45 50 `.',
'Count them: `int count = std::count_if(nums.begin(), nums.end(), [threshold](int n) { return n > threshold; });`.',
'Print `count`. Expect `2`.',
'Test mutation: `int total = 0; std::for_each(nums.begin(), nums.end(), [&total](int n) { total += n; });` then print `total`. Expect `160` — the reference capture modified the outer variable.'
],
goal: 'You utilized anonymous lambda expressions, value and reference captures, and algorithm callbacks to inject inline logic.'
},
[
q('What is a Lambda Expression in C++?', ['A permanent named function stored on disk', 'An anonymous inline function object (closure) defined exactly where it is needed', 'A mathematical symbol for loops', 'A type of smart pointer'], 1, 'Lambdas compile into unnamed closure objects with an operator(), giving you inline, disposable callables. **Why others are wrong:** They are not named, not stored on disk, not loop syntax, and not pointers.'),
q('What is the role of the capture clause `[]` at the start of a lambda?', ['To declare parameters', 'To bring outer-scope variables into the closure, by value or by reference', 'To name the lambda', 'To specify the return type'], 1, 'The capture list defines which surrounding variables the closure can see and how (copy vs reference). **Why others are wrong:** Parameters go in parentheses, names do not exist, and return types use `->`.'),
q('What is the difference between `[x]` and `[&x]`?', ['No difference', '`[x]` captures a copy (read-only by default); `[&x]` captures a live reference that can modify the original', '`[x]` is for ints, `[&x]` for strings', '`[x]` deletes x'], 1, 'By-value captures are snapshots; by-reference captures alias the living outer variable. **Why others are wrong:** They differ fundamentally, are not type-restricted, and never delete variables.'),
q('How do you execute a lambda immediately after writing it?', ['Add `()` at the very end of the definition', 'Prefix it with `run`', 'It executes automatically on creation', 'Call `lambda.start()`'], 0, 'Appending `()` invokes the closure right away (an immediately-invoked lambda). **Why others are wrong:** Creation alone only builds the object; `run` and `.start()` do not exist.'),
q('Why is `std::for_each(v.begin(), v.end(), [&total](int n){ total += n; })` able to modify the outer `total`?', ['Because algorithms are friends of main', 'Because the reference capture `[&total]` aliases the outer variable inside the closure', 'Because vectors are global', 'Because int is mutable by default'], 1, 'The `&` capture binds the closure to the living outer variable, so mutations inside the lambda hit the original. **Why others are wrong:** Friendship, globals, and type mutability are not involved.')
],
['Lambdas are anonymous inline closure objects written exactly where logic is needed.', 'Capture by value [x] for snapshots; by reference [&x] to modify outer variables.', 'Add mutable to modify by-value captures inside the lambda.', 'Feed lambdas to std::for_each, count_if, and sort as inline custom rules.', 'Generic lambdas with auto parameters act like mini-templates.']
),
L(
'cpp-28', 28, 'Modern Utilities (optional, variant, string_view)', '🧰',
'Older C++ code signaled failure with magic numbers like -1 or nullptr — silent, ambiguous, bug-breeding hacks. Modern C++ (17/20) shipped expressive utilities that make "maybe there is a value" and "one of several types" first-class, compiler-checked concepts, and made passing text around dramatically cheaper.',
[
{ title: '1. std::optional (Maybe Data)', beginner: 'What if a search function sometimes finds nothing? Instead of returning -1 and hoping callers remember, return `std::optional<int>`. It either holds a real value or holds nothing (`std::nullopt`) — and the caller is forced to check.', advanced: '`std::optional<T>` wraps a T plus a presence flag with no heap allocation. Contextual conversion to bool, `.has_value()`, `.value()` (throws if empty), and `.value_or(default)` make absence explicit and impossible to ignore silently.' },
{ title: '2. std::variant (Type-Safe Union)', beginner: 'A `std::variant<int, std::string, double>` is a box that holds exactly ONE of those types at a time. It remembers which one, so you can never misread it the way old C unions let you.', advanced: '`std::variant` tracks its active alternative at runtime. Access via `std::get<T>` (throws on wrong type), `std::get_if`, `std::holds_alternative`, or the fully safe `std::visit` with a visitor callable.' },
{ title: '3. std::string_view (Zero-Copy Text)', beginner: 'Passing a `std::string` by value copies the whole text — slow for big strings. `std::string_view` is a lightweight read-only window over existing text: just a pointer and a length. No copying at all.', advanced: '`string_view` performs no allocation and no ownership; it is O(1) to create from literals or strings. The trade-off: it must not outlive the text it views — dangling views are the classic string_view bug.' },
{ title: '4. Safe Extraction Patterns', beginner: 'With optional, prefer `.value_or(fallback)` for clean defaults. With variant, prefer `std::visit` so the compiler forces you to handle EVERY possible type — forget one and compilation fails.', advanced: 'Extraction discipline: `value()` asserts presence (throws `bad_optional_access` otherwise); `std::get` asserts the active alternative (throws `bad_variant_access`); `std::visit` with an overloaded visitor gives exhaustive, compile-time-checked dispatch.' },
{ title: '5. Monadic optional & visit Overloads (Expert Teaser)', beginner: 'Modern C++ lets you chain optional operations like a pipeline: "if there is a value, transform it; then provide a default". No nested if-statements needed!', advanced: '*(Pro Track Preview)* C++23 adds monadic operations (`and_then`, `transform`, `or_else`) to optional, and the "overloaded" visitor pattern (deduction guides + variant) makes `std::visit` ergonomic. The Expert track builds these pipeline patterns for error-handling architectures.' }
],
{
title: 'The Optional Finder & Zero-Copy Counter',
intro: 'Return std::optional from a search function, handle absence safely, and count characters through a std::string_view without copying.',
steps: [
'Create `modern.cpp` with `#include <iostream>`, `#include <optional>`, `#include <string>`, and `#include <string_view>`.',
'Write: `std::optional<int> findAge(const std::string& name) { if (name == "Alice") return 25; return std::nullopt; }`.',
'In `main()`: `auto result = findAge("Bob");` then `std::cout << result.value_or(-1) << std::endl;`. Expect `-1` (clean absence, no crash).',
'Now `auto hit = findAge("Alice");` and print `hit.value()`. Expect `25`.',
'Write a zero-copy counter: `int countChars(std::string_view sv) { return static_cast<int>(sv.size()); }`.',
'Call it with a literal: `std::cout << countChars("No copies here!") << std::endl;`. Expect `15` — no string object was ever allocated.'
],
goal: 'You utilized modern utility wrappers to model absence explicitly and pass text with zero-copy semantics.'
},
[
q('What is the main purpose of `std::optional`?', ['To make homework optional', 'To explicitly model a value that may or may not exist, replacing magic error numbers like -1', 'To create optional loops', 'To delete files safely'], 1, 'optional makes absence a typed, checked state instead of a sentinel convention callers can forget. **Why others are wrong:** It has nothing to do with loops, files, or literal optionality of tasks.'),
q('How does `std::string_view` improve performance?', ['It compresses text automatically', 'It provides a non-owning pointer+length window over existing text, avoiding copies and allocations', 'It converts strings to integers', 'It encrypts the text'], 1, 'string_view creation is O(1) with no allocation because it only references existing character data. **Why others are wrong:** No compression, conversion, or encryption occurs.'),
q('What is a `std::variant<int, std::string>`?', ['A virus scanner', 'A type-safe union holding exactly one of the listed types at a time, tracking which one is active', 'A variable that renames itself', 'An array of two elements'], 0 + 1, 'variant stores one active alternative plus an index, making misreads detectable instead of undefined behavior. **Why others are wrong:** It is not security software, not self-renaming, and not a two-element array.'),
q('What does `result.value_or(0)` do on an empty `std::optional<int>`?', ['Crashes the program', 'Returns 0 as the provided fallback default', 'Throws an exception', 'Returns nullopt'], 1, '`value_or` returns the contained value if present, otherwise the fallback you supply — the cleanest absence-handling pattern. **Why others are wrong:** It neither crashes nor throws (that is `.value()` on empty), and it returns a real int, not nullopt.'),
q('What is the key danger of `std::string_view`?', ['It is slower than std::string', 'It can dangle if the text it views is destroyed before the view is used', 'It cannot read string literals', 'It allocates double memory'], 1, 'string_view does not own its data; using it after the underlying string/literal dies is undefined behavior. **Why others are wrong:** It is faster/cheaper than string copies, reads literals fine, and allocates nothing.')
],
['Use std::optional to model "maybe a value" instead of magic sentinel numbers.', 'Use std::variant for one-of-several-types with runtime-tracked active state.', 'Use std::string_view for zero-copy, read-only text parameters.', 'Prefer value_or and std::visit for safe, exhaustive extraction.', 'Remember: string_view never owns its data — mind its lifetime.']
),
L(
'cpp-29', 29, 'Exception Handling & Safety (try, catch, throw)', '🚨',
'Even excellent programs meet disasters: disks disconnect, networks die, users type nonsense. Crashing instantly is amateur behavior. C++ exceptions let errors travel up the call stack until someone competent handles them — while destructors clean up everything along the way.',
[
{ title: '1. Throwing & Stack Unwinding', beginner: 'When something unrecoverable happens, you `throw` an error object: `if (age < 0) throw std::invalid_argument("Age cannot be negative!");`. Normal execution stops immediately and C++ starts walking back up through the functions that called you.', advanced: 'Throwing constructs an exception object and initiates stack unwinding: each frame is popped, its local objects destroyed (destructors run!), until a matching handler is found. Uncaught exceptions terminate the program via `std::terminate`.' },
{ title: '2. Try & Catch Blocks', beginner: 'Wrap risky code in `try { ... }`. If anything throws inside, execution jumps straight to your `catch` block where you handle it gracefully instead of dying.', advanced: 'Handlers match by type, most-derived first. Always catch by const reference (`catch (const std::exception& e)`) — catching by value slices polymorphic exceptions and copies unnecessarily.' },
{ title: '3. Custom Exception Classes', beginner: 'You are not limited to built-in errors. Inherit from `std::exception` and create your own: `class InsufficientFunds : public std::exception { const char* what() const noexcept override { return "Not enough money!"; } };`.', advanced: 'Custom exceptions encode domain failures as types, letting callers catch precisely what they can handle. Overriding `what()` (noexcept, returning C-string) provides diagnostic text; prefer inheriting standard subclasses like `std::runtime_error` for free messaging.' },
{ title: '4. Exception Safety & noexcept', beginner: 'C++ promises levels of safety: Basic (no leaks when things throw), Strong (everything rolls back as if nothing happened), and No-throw (this function can never fail). Marking functions `noexcept` tells the compiler which promise you make.', advanced: 'Exception safety guarantees dictate object state behavior under unwinding. `noexcept` enables optimizations (e.g., vector move-reallocation only uses move constructors if they are noexcept) and is mandatory on destructors and swap/move operations in robust designs.' },
{ title: '5. Zero-Cost EH & std::expected (Expert Teaser)', beginner: 'Worried exceptions slow down your fast path? In modern C++ they are "zero-cost": if nothing throws, there is essentially no overhead at all.', advanced: '*(Pro Track Preview)* Table-based unwinding keeps the happy path branch-free; cost appears only when throwing. For expected-failure flows (parsing, I/O), C++23 `std::expected<T, E>` offers error-as-value semantics without exceptions — the Expert track compares both architectures.' }
],
{
title: 'The Safe Division Guard',
intro: 'Throw a standard exception on division by zero, catch it by const reference, and add a custom domain exception.',
steps: [
'Create `errors.cpp` with `#include <iostream>` and `#include <stdexcept>`.',
'Write: `double divide(double a, double b) { if (b == 0) throw std::runtime_error("Division by zero!"); return a / b; }`.',
'In `main()`, wrap: `try { std::cout << divide(10, 2) << std::endl; }` — expect `5`.',
'Add a second try: `try { divide(10, 0); } catch (const std::exception& e) { std::cout << "Caught: " << e.what() << std::endl; }` — expect `Caught: Division by zero!` instead of a crash.',
'Define a custom exception: `struct NegativeAge : std::runtime_error { NegativeAge() : std::runtime_error("Age cannot be negative") {} };`.',
'Throw and catch it: `try { throw NegativeAge(); } catch (const std::runtime_error& e) { std::cout << e.what() << std::endl; }` — expect `Age cannot be negative`. The base-class catch caught the derived type polymorphically!'
],
goal: 'You implemented robust error management with throw/try/catch, const-reference handlers, and custom domain exceptions.'
},
[
q('What happens when an exception is thrown in C++?', ['The computer powers off', 'Normal flow halts and stack unwinding begins, destroying locals and searching for a matching catch block', 'The error is silently ignored', 'An infinite loop starts'], 1, 'Unwinding pops frames, runs destructors, and transfers control to the first compatible handler. **Why others are wrong:** No power-off, no silence, no loop — unwinding is deterministic.'),
q('Why catch by const reference (`catch (const std::exception& e)`)?', ['The compiler requires it', 'It avoids copying and prevents object slicing, preserving polymorphic behavior', 'It makes the error disappear', 'It converts the error to an integer'], 1, 'By-value catches slice derived exceptions and copy unnecessarily; const-ref preserves the full dynamic type and avoids both problems. **Why others are wrong:** It is not mandatory syntax, does not erase errors, and performs no conversion.'),
q('What does the `what()` method provide on standard exceptions?', ['A repair routine', 'A human-readable C-string describing the error', 'A restart command', 'A memory leak report'], 1, '`what()` returns diagnostic text explaining why the exception was thrown. **Why others are wrong:** It performs no repair, restart, or leak analysis.'),
q('What is the Strong Exception Safety Guarantee?', ['The program has no bugs', 'If an operation throws, all state is rolled back as if the operation never happened (commit-or-rollback)', 'Memory is always on the stack', 'Exceptions are disabled'], 1, 'Strong guarantee means failed operations leave zero observable side effects. **Why others are wrong:** It is not bug-freedom, not a stack-memory rule, and exceptions remain enabled.'),
q('Why are modern C++ exceptions called "zero-cost" on the happy path?', ['Because throwing is free too', 'Because table-based unwinding adds no runtime overhead when nothing throws; cost appears only during an actual throw', 'Because they run on the GPU', 'Because the compiler deletes all try blocks'], 1, 'The happy path stays branch-free; unwind tables are consulted only when an exception is actually in flight. **Why others are wrong:** Throwing itself is expensive, GPUs are irrelevant, and try blocks are not deleted.')
],
['Throw to signal unrecoverable errors; unwinding cleans up automatically.', 'Wrap risky code in try and handle failures in catch blocks.', 'Always catch by const reference to avoid slicing and copying.', 'Define custom exception types inheriting std::exception for domain failures.', 'Mark guaranteed-safe functions noexcept; know your basic/strong/nothrow guarantees.']
),
L(
'cpp-30', 30, 'STL Iterators & Algorithms', '🧭',
'Loops are how beginners traverse containers; iterators and algorithms are how professionals do it. The STL separates "where the data lives" from "what you do with it": containers provide iterators, and a library of battle-tested algorithms consumes them. Less hand-written loop code, fewer off-by-one bugs, faster programs.',
[
{ title: '1. The Iterator Concept', beginner: 'An iterator is a smart cursor that points at one element and can move to the next with `++`. Every container hands you its first cursor with `.begin()` and a "past-the-end" marker with `.end()`. Loop from begin until you reach end.', advanced: 'Iterators come in categories (input, forward, bidirectional, random-access) defining which operations are legal. Random-access iterators (vector, deque) support `+n` and comparisons; list iterators only `++/--`. Algorithms are written against the weakest category they need.' },
{ title: '2. The Algorithm Library', beginner: 'Instead of writing sorting loops yourself, call `std::sort(v.begin(), v.end())`. Need to find something? `std::find`. Count matches? `std::count_if`. Sum everything? `std::accumulate`. All pre-written, all optimized.', advanced: '`<algorithm>` and `<numeric>` provide dozens of generic algorithms parameterized by iterator ranges and optional callables (comparators, predicates, lambdas). They are inlined and often vectorized, routinely beating hand-written loops.' },
{ title: '3. Iterator Invalidation Rules', beginner: 'Careful: changing a container can invalidate your cursors! Adding elements to a vector may relocate its memory, leaving old iterators pointing at garbage. Know each container\'s rules or face crashes.', advanced: 'vector/deque: insertion can reallocate and invalidate all iterators; erasure invalidates from the erased point onward. map/set: iterators stay valid across insert/erase (except to the erased element). These rules are the core safety contract of iterator-based code.' },
{ title: '4. Writing Custom Iterators', beginner: 'You can teach your own classes to work with range-for loops and STL algorithms by giving them `begin()` and `end()` functions. Suddenly your custom container joins the STL ecosystem.', advanced: 'A minimal iterator needs operator*, operator++, operator!= (and proper iterator_traits/category tags for full algorithm support). Providing begin/end overloads — including const versions — integrates any type with range-for and the algorithm library.' },
{ title: '5. Parallel Execution Policies (Expert Teaser)', beginner: 'Want your sort or transform to use ALL your CPU cores? Add one word: `std::execution::par`. The same algorithm, now parallelized for you.', advanced: '*(Pro Track Preview)* C++17 execution policies (`seq`, `par`, `par_unseq`) let algorithms dispatch to multi-threaded or vectorized implementations. Correctness requires side-effect-free callables — the Expert track profiles when parallel policies actually win.' }
],
{
title: 'The Algorithm Pipeline',
intro: 'Sort, transform, find, and accumulate a vector using pure STL algorithms and iterators — no manual index loops.',
steps: [
'Create `algos.cpp` with `#include <iostream>`, `#include <vector>`, `#include <algorithm>`, and `#include <numeric>`.',
'Declare `std::vector<int> v = {5, 2, 9, 1, 7};`.',
'Sort it: `std::sort(v.begin(), v.end());` then print all with a range-for. Expect `1 2 5 7 9 `.',
'Double everything in place: `std::transform(v.begin(), v.end(), v.begin(), [](int n){ return n * 2; });` then print. Expect `2 4 10 14 18 `.',
'Find 10: `auto it = std::find(v.begin(), v.end(), 10);` then `if (it != v.end()) std::cout << "Found at index " << (it - v.begin()) << std::endl;`. Expect `Found at index 2`.',
'Sum it: `int sum = std::accumulate(v.begin(), v.end(), 0);` print `sum`. Expect `48`.'
],
goal: 'You replaced manual loops with iterator-driven STL algorithms, mastering ranges, predicates, and iterator arithmetic.'
},
[
q('What do `.begin()` and `.end()` return on a container?', ['The first and last elements', 'An iterator to the first element and a past-the-end marker (not a valid element)', 'Pointers to the heap', 'The container size'], 1, '`end()` is a sentinel one-past-the-last element; dereferencing it is undefined behavior. **Why others are wrong:** They are iterators, not elements, pointers, or sizes.'),
q('Which iterator category does `std::vector` provide?', ['Input-only', 'Forward only', 'Bidirectional', 'Random-access (supports +n, -n, and comparisons)'], 3, 'vector iterators are contiguous random-access, enabling index arithmetic and the fastest algorithm overloads. **Why others are wrong:** vector supports far more than input/forward/bidirectional operations.'),
q('What happens to vector iterators after a `push_back` that triggers reallocation?', ['They stay valid forever', 'All existing iterators may be invalidated because elements moved to a new memory block', 'Only end() changes', 'The program auto-fixes them'], 1, 'Reallocation relocates the underlying array, dangling every old iterator. **Why others are wrong:** Validity is not preserved, not limited to end(), and nothing auto-repairs iterators.'),
q('Why prefer `std::sort(v.begin(), v.end())` over a hand-written bubble sort?', ['It looks shorter only', 'It is a battle-tested introsort implementation, usually far faster and bug-free compared to naive hand loops', 'It uses more memory on purpose', 'It only works on strings'], 0 + 1, 'std::sort uses optimized introsort (quicksort+heapsort+insertion), typically O(n log n) with excellent constants. **Why others are wrong:** It is not cosmetic-only, not memory-hungry by design, and works on any comparable type.'),
q('What does `std::execution::par` do when passed to an algorithm?', ['Makes it run sequentially for debugging', 'Permits the library to execute the algorithm in parallel across threads', 'Converts it to a lambda', 'Disables exceptions'], 1, 'Execution policies authorize parallel (and vectorized) implementations of standard algorithms. **Why others are wrong:** seq is the sequential option; policies do not create lambdas or touch exception handling.')
],
['Iterators are cursors: begin() to end() defines a range for every container.', 'Use std::sort, find, transform, accumulate instead of hand-written loops.', 'Memorize iterator invalidation rules per container — they prevent dangling-cursor crashes.', 'Give custom classes begin()/end() to join the STL ecosystem.', 'Execution policies (par) unlock multi-core algorithm implementations.']
),
L(
'cpp-31', 31, 'Associative Containers (map, set, unordered_map)', '🗂️',
'Vectors find items by position; associative containers find them by KEY. A phone book does not scan every name — it jumps straight to "S". Maps and sets bring that jump-straight-to-it power to C++, backed by trees and hash tables you must understand to choose correctly.',
[
{ title: '1. std::map (Ordered Tree)', beginner: 'A `std::map<std::string, int>` connects keys to values: `ages["Alice"] = 25;`. Lookup by name is fast, and when you loop through it, keys come out already sorted alphabetically.', advanced: '`std::map` is a balanced binary search tree (red-black). Insert/lookup/erase are O(log n), and iteration yields keys in strict sorted order — valuable when order matters, at a modest per-node memory cost.' },
{ title: '2. std::unordered_map (Hash Table)', beginner: 'If you do NOT care about order and want the absolute fastest lookups, use `std::unordered_map`. It hashes your key into a bucket index and jumps straight there — average O(1) speed.', advanced: 'Unordered containers hash keys into buckets; average O(1) but worst-case O(n) under collisions. Performance depends on hash quality and load factor; reserve() buckets upfront to avoid rehashing storms in hot paths.' },
{ title: '3. std::set & Uniqueness', beginner: 'A `std::set` stores only unique values, automatically sorted. Insert the same value twice and the second insert silently does nothing. Perfect for deduplication and membership tests.', advanced: '`set`/`unordered_set` model mathematical sets: insert returns a pair revealing whether insertion happened. Multiset/multimap variants permit duplicates. Membership checks (`count`, `find`) are the primary use case.' },
{ title: '4. Insertion Patterns & Iteration', beginner: 'Beware: `m[key]` on a map CREATES the key with a default value if missing! Use `m.insert({...})`, `m.emplace(...)`, or `m.contains(key)` / `m.find(key)` when you must not invent entries.', advanced: 'operator[] default-constructs missing values (surprising bug source); `insert_or_assign`, `try_emplace`, and `emplace` give precise control. Iterate with structured bindings: `for (const auto& [k, v] : m)` — clean and zero-copy.' },
{ title: '5. Custom Hashers & Heterogeneous Lookup (Expert Teaser)', beginner: 'Want to use your own class as an unordered_map key? You must teach C++ how to hash it and how to compare it. That is your first step into custom hash functions.', advanced: '*(Pro Track Preview)* Keys need `operator==` plus a hash functor (specialize `std::hash` or pass a custom hasher). C++20 heterogeneous lookup lets you query with string_view against string keys without constructing temporaries — a major hot-path win.' }
],
{
title: 'The Word Frequency Counter',
intro: 'Count word occurrences with unordered_map, then display results sorted via std::map — experiencing both engines in one program.',
steps: [
'Create `maps.cpp` with `#include <iostream>`, `#include <string>`, `#include <vector>`, `#include <unordered_map>`, and `#include <map>`.',
'Declare `std::vector<std::string> words = {"the", "cat", "sat", "on", "the", "mat", "the"};`.',
'Count with a hash map: `std::unordered_map<std::string, int> freq; for (const auto& w : words) freq[w]++;`.',
'Print raw counts with structured bindings: `for (const auto& [w, c] : freq) std::cout << w << ":" << c << " ";`. Expect `the:3 cat:1 sat:1 on:1 mat:1` (order may vary — it is unordered!).',
'Now copy into an ordered map: `std::map<std::string, int> sorted(freq.begin(), freq.end());`.',
'Print it the same way. Expect alphabetical order: `cat:1 mat:1 on:1 sat:1 the:3 ` — the tree sorted it for free.'
],
goal: 'You compared hash-table and tree-backed associative containers, mastering key-based lookup, insertion semantics, and structured-binding iteration.'
},
[
q('What is the key behavioral difference between std::map and std::unordered_map?', ['map is slower always', 'map keeps keys sorted with O(log n) ops; unordered_map hashes keys for average O(1) ops with no ordering', 'unordered_map cannot store strings', 'map stores duplicates freely'], 1, 'Tree vs hash table: ordered logarithmic vs unordered constant-average, with iteration order as the visible trade-off. **Why others are wrong:** map is not universally slower, unordered_map stores any hashable type, and map keys are unique.'),
q('What does `m["newkey"]` do on a std::map if "newkey" does not exist?', ['Throws an exception', 'Returns nullptr', 'Inserts the key with a default-constructed value and returns a reference to it', 'Returns end()'], 2, 'operator[] is insert-if-missing semantics — convenient but a classic source of accidental entries; prefer find/contains/try_emplace when probing. **Why others are wrong:** It neither throws, returns nullptr, nor yields end().'),
q('Which container automatically rejects duplicate insertions?', ['std::vector', 'std::deque', 'std::set', 'std::priority_queue'], 2, 'set enforces uniqueness: inserting an existing value is a no-op reported via the returned pair. **Why others are wrong:** vector/deque/priority_queue all permit duplicates.'),
q('How do you cleanly iterate a map without copying pairs?', ['`for (auto p : m)`', '`for (const auto& [key, value] : m)`', '`for (m.each())`', '`while (m.next())`'], 1, 'Structured bindings with a const reference destructure each pair in place, zero-copy and readable. **Why others are wrong:** By-value copies pairs; `.each()`/`.next()` do not exist.'),
q('What must your custom class provide to be an unordered_map key?', ['Only operator<', 'operator== and a hash function (std::hash specialization or custom hasher)', 'A toString method', 'Inheritance from std::hash'], 1, 'Hashing plus equality define bucket placement and collision resolution for custom keys. **Why others are wrong:** operator< is for ordered containers; toString is irrelevant; inheriting std::hash is not the mechanism.')
],
['map = ordered tree (O(log n), sorted iteration); unordered_map = hash table (average O(1)).', 'set/unordered_set enforce uniqueness for dedup and membership tests.', 'operator[] inserts missing keys — use find/contains/try_emplace to probe safely.', 'Iterate with structured bindings: for (const auto& [k, v] : m).', 'Custom keys need operator== plus a hash functor.']
),
L(
'cpp-32', 32, 'Container Adapters (stack, queue, priority_queue)', '🥞',
'Some problems are not about random access at all — they are about ORDER of processing: undo history, print jobs, task scheduling. Container adapters restrict a underlying container to exactly the operations a discipline requires: last-in-first-out, first-in-first-out, or highest-priority-first.',
[
{ title: '1. std::stack (LIFO)', beginner: 'A stack is a pile of pancakes: you add on top (`push`), you look at the top (`top`), you remove the top (`pop`). Last in, first out. This is exactly how function calls and undo buttons work.', advanced: '`std::stack` adapts a `std::deque` by default (configurable to vector/list), exposing only push/pop/top/empty/size. The restriction is the feature: it makes illegal access patterns unrepresentable.' },
{ title: '2. std::queue (FIFO)', beginner: 'A queue is a checkout line: first customer in is first served (`push` at back, `pop` from front, `front` peeks). Perfect for job scheduling and breadth-first searches.', advanced: '`std::queue` adapts deque with push at back and pop at front, both amortized O(1). It is the canonical worklist structure for BFS and producer-consumer pipelines.' },
{ title: '3. std::priority_queue (Heap)', beginner: 'A priority_queue always hands you the BIGGEST item first (by default), no matter the insertion order. Like an ER triage: most critical case jumps the line.', advanced: 'Backed by a binary heap (vector-based), push/pop are O(log n) and top is O(1). Supply a comparator (`std::greater<T>`) for min-heap behavior — essential for Dijkstra and scheduling algorithms.' },
{ title: '4. deque Internals & Choosing Wisely', beginner: 'The engine under stack and queue is the deque: a chain of fixed-size chunks, giving fast push/pop at BOTH ends. Choose stack for undo/reversal, queue for fair ordering, priority_queue for urgency ordering.', advanced: 'deque stores segmented fixed-size arrays, offering O(1) both-end insertion without vector-style reallocation of the whole body, but weaker cache locality than vector. Match the adapter to your processing discipline, not to habit.' },
{ title: '5. Monotonic Stacks (Expert Teaser)', beginner: 'A clever trick: keep a stack where elements always stay sorted by popping violators before pushing. This solves "next greater element" style problems in linear time!', advanced: '*(Pro Track Preview)* Monotonic stacks/queues amortize to O(n) by ensuring each element enters and leaves once. They power sliding-window maximums, histogram problems, and streaming analytics — a favorite elite interview pattern.' }
],
{
title: 'Balanced Parentheses & Task Triage',
intro: 'Validate bracket nesting with a stack, then triage tasks by urgency with a priority_queue.',
steps: [
'Create `adapters.cpp` with `#include <iostream>`, `#include <stack>`, `#include <queue>`, and `#include <string>`.',
'Write a checker: `bool balanced(const std::string& s) { std::stack<char> st; for (char c : s) { if (c == \'(\' ) st.push(c); else if (c == \')\') { if (st.empty()) return false; st.pop(); } } return st.empty(); }`.',
'Test: `std::cout << balanced("((a+b)*c)") << balanced("((x)") << std::endl;`. Expect `10` (true then false).',
'Build a triage: `std::priority_queue<int> pq; pq.push(5); pq.push(50); pq.push(12);`.',
'Drain it: `while (!pq.empty()) { std::cout << pq.top() << " "; pq.pop(); }`. Expect `50 12 5 ` — highest priority first.',
'Flip to min-heap: `std::priority_queue<int, std::vector<int>, std::greater<int>> minQ; minQ.push(5); minQ.push(50); minQ.push(12);` then drain. Expect `5 12 50 `.'
],
goal: 'You applied LIFO, FIFO, and heap disciplines to real problems, understanding adapter restrictions as design features.'
},
[
q('What ordering discipline does std::stack enforce?', ['FIFO', 'LIFO — last in, first out', 'Sorted order', 'Random order'], 1, 'stack exposes only top/push/pop, implementing last-in-first-out like a pancake pile. **Why others are wrong:** FIFO is queue, sorted is priority_queue/set, random is nothing here.'),
q('Which underlying container does std::stack use by default?', ['std::vector', 'std::list', 'std::deque', 'std::map'], 2, 'deque is the default adapted container (both-end O(1), no full reallocation), though vector/list are selectable. **Why others are wrong:** vector and list are options but not the default; map is not an adapter base.'),
q('What does std::priority_queue return from .top() by default?', ['The smallest element', 'The largest element (max-heap)', 'The oldest element', 'A random element'], 1, 'Default comparator is less, yielding a max-heap: greatest value surfaces first. **Why others are wrong:** Min behavior requires std::greater; age and randomness are not heap semantics.'),
q('Why are adapter restrictions (no random access on stack/queue) considered a feature?', ['They make code slower but safer', 'They make illegal usage patterns unrepresentable, encoding the intended discipline in the type', 'They reduce file size', 'They please the compiler'], 1, 'Restricting the interface prevents misusage at compile time — the type itself documents and enforces the processing order. **Why others are wrong:** Speed is unaffected, file size irrelevant, and compiler preference is nonsense.'),
q('How do you make a min-heap with priority_queue?', ['priority_queue<int, vector<int>, greater<int>>', 'priority_queue<int>.min()', 'set_min(true) on the queue', 'priority_queue<int, less<int>>'], 0, 'Supplying std::greater as the comparator inverts ordering so the smallest element becomes the top. **Why others are wrong:** .min() and set_min do not exist, and less is the default max-heap comparator.')
],
['stack = LIFO for undo/reversal/nesting validation.', 'queue = FIFO for fair scheduling and BFS worklists.', 'priority_queue = heap for urgency ordering; swap comparator for min-heap.', 'Adapters restrict interfaces on purpose — illegal patterns become unrepresentable.', 'deque powers stack/queue with O(1) both-end operations.']
),

 L(
'cpp-33', 33, 'Concurrency & std::thread', '🧵',
TERMINAL_NOTICE_SHORT + 'Your CPU is a kitchen with multiple chefs (cores), but a normal C++ program only ever uses one of them. Concurrency is the art of putting every chef to work at the same time. Mastering threads is the gateway to high-performance software, game engines, and servers that handle thousands of users at once.',
[
{ title: '1. Why Concurrency? (The Multi-Core Reality)', beginner: 'Your computer has 4, 8, or even 16 CPU cores. A simple program uses only ONE and leaves the rest sitting idle. Concurrency lets you split your work across all of them, like hiring more chefs so the meals finish faster.', advanced: 'Modern performance scaling no longer comes from faster clocks; it comes from more cores. Exploiting them requires explicit thread-level parallelism (or task-based abstractions), because a single sequential execution stream cannot occupy multiple cores simultaneously.' },
{ title: '2. Launching Threads (std::thread)', beginner: 'To start a second "chef", you create a thread object and hand it a function: `std::thread t(myFunction);`. The moment that line runs, the function starts executing in parallel with the rest of your program.', advanced: '`std::thread` (from `<thread>`) spawns a new OS-level execution stream. The constructor accepts any callable (function, lambda, functor) plus arguments, which are copied/moved into internal storage by default.' },
{ title: '3. join() vs detach() (Thread Lifetime)', beginner: 'A thread is like a child you send on an errand. `t.join()` means you stand at the door and WAIT for it to come home before continuing. `t.detach()` means you let it roam free and never wait — but you must make sure it doesn\'t need anything from you!', advanced: 'Every `std::thread` object must be resolved exactly once: `join()` blocks the caller until completion, while `detach()` releases ownership for independent execution. Destroying a joinable thread without either calls `std::terminate`. C++20\'s `std::jthread` adds RAII auto-joining and cancellation.' },
{ title: '4. Data Races (The Hidden Bug)', beginner: 'If two threads write to the same variable at the same time, the results become garbage — like two people writing on the same piece of paper simultaneously. This is called a data race, and it is one of the nastiest bugs in programming.', advanced: 'A data race occurs when two threads access the same memory location concurrently and at least one access is a write, without synchronization. The C++ memory model defines this as Undefined Behavior — results can be torn, reordered, or silently lost.' },
{ title: '5. Hardware Threads & Amdahl\'s Law (Expert Teaser)', beginner: 'Adding more chefs doesn\'t make EVERY task faster — some steps (like preheating the oven) must still be done by one person. The part of your code that cannot be parallelized limits your total speedup.', advanced: '*(Pro Track Preview)* Amdahl\'s Law quantifies maximum speedup: if 10% of runtime is serial, 100 cores still cap you at ~10x. Hyper-threading also exposes logical cores that share physical execution units, so "core count" overstates true parallel capacity. The Expert track measures this empirically.' }
],
{
title: 'The Two-Chef Kitchen',
intro: 'Launch two threads that do heavy work in parallel, prove they interleave, and measure the speedup against sequential execution.',
steps: [
'Create `threads.cpp` and include `<iostream>`, `<thread>`, and `<chrono>`.',
'Write a worker: `void work(int id) { for (int i = 0; i < 3; i++) std::cout << "Thread " << id << " tick " << i << std::endl; }`.',
'In `main()`, record the start: `auto start = std::chrono::steady_clock::now();`.',
'Launch two threads: `std::thread t1(work, 1); std::thread t2(work, 2);`.',
'Resolve both: `t1.join(); t2.join();`.',
'Measure the end and print the elapsed milliseconds. Notice the output lines from Thread 1 and Thread 2 are INTERLEAVED — proof of true parallel execution.',
'EXPERIMENT: delete the `join()` calls and run again. Watch the program crash with `std::terminate` — proof that thread lifetimes must always be resolved.'
],
goal: 'You successfully launched, synchronized, and measured concurrent execution streams, and witnessed the fatal consequence of unresolved thread lifetimes.'
},
[
q('What does `t.join()` do on a `std::thread` object?', ['It forcibly kills the thread immediately', 'It blocks the calling thread until thread t finishes execution, then merges its lifecycle back', 'It pauses the thread for 1 second', 'It copies the thread into a second core'], 1, '`join()` is the synchronization point: the caller waits until the target thread completes, guaranteeing its work is done before continuing. **Why others are wrong:** join never kills, sleeps, or duplicates threads; termination is a separate (and dangerous) operation.'),
q('What happens if a `std::thread` object is destroyed while still "joinable" (never joined or detached)?', ['The thread keeps running safely in the background', 'The operating system garbage-collects it', 'The program calls std::terminate and crashes', 'The thread is automatically joined'], 2, 'The destructor of a joinable thread invokes `std::terminate` by design, because silently detaching or joining would hide serious lifetime bugs. **Why others are wrong:** C++ never auto-joins or auto-detaches; destruction of a joinable thread is always fatal.'),
q('Which header must be included to use `std::thread`?', ['<concurrency>', '<thread>', '<process>', '<parallel>'], 1, 'The `<thread>` header defines `std::thread` and its lifecycle operations. **Why others are wrong:** The other headers do not exist in the C++ standard library for this purpose.'),
q('What is a "data race"?', ['Two threads reading the same variable at the same time', 'Two threads accessing the same memory concurrently where at least one writes, without synchronization — causing Undefined Behavior', 'A thread that runs faster than the main thread', 'Two CPUs competing for the same cache'], 1, 'Concurrent unsynchronized access with at least one writer produces torn or lost updates and is Undefined Behavior under the C++ memory model. **Why others are wrong:** Read-read concurrency is safe; speed differences and cache contention are performance issues, not data races.'),
q('What is the key danger of calling `t.detach()`?', ['The thread can never use the CPU again', 'The detached thread may outlive the variables or objects it references, causing dangling access crashes', 'detach() is slower than join()', 'The thread loses its priority'], 1, 'Once detached, no one waits for the thread, so if it references stack variables or objects that die first, it reads freed memory. **Why others are wrong:** detach does not starve, slow, or deprioritize the thread; the hazard is purely lifetime-related.')
],
['std::thread launches true parallel execution streams across CPU cores.', 'Every thread must be resolved exactly once: join() to wait, detach() to release.', 'Destroying a joinable thread calls std::terminate — always manage thread lifetimes.', 'Data races (unsynchronized concurrent writes) are Undefined Behavior.', 'Amdahl\'s Law: the serial fraction of your code caps your maximum parallel speedup.']
),
L(
'cpp-34', 34, 'Mutexes, Locks & Condition Variables', '🔒',
TERMINAL_NOTICE_SHORT + 'Threads are powerful but dangerous: two threads writing to the same variable at once corrupts data silently. Synchronization primitives — mutexes, locks, and condition variables — are the traffic laws that make concurrent programs correct, predictable, and safe.',
[
{ title: '1. Critical Sections & Race Conditions', beginner: 'A "critical section" is any code that touches shared data. If two threads enter it at the same time, they can interleave badly and produce wrong results. We must allow only ONE thread inside at a time.', advanced: 'Race conditions arise from non-atomic read-modify-write sequences (like `count++`) interleaving across threads. Protecting critical sections with mutual exclusion restores atomicity at the logical level.' },
{ title: '2. std::mutex & RAII Locks', beginner: 'A mutex is a bathroom key: only the thread holding the key may enter. In C++ we wrap it in a lock object so the key is ALWAYS returned automatically, even if an exception crashes the code inside.', advanced: '`std::mutex` provides `lock()/unlock()`, but manual unlocking is exception-unsafe. RAII wrappers — `std::lock_guard` (simple scope lock) and `std::unique_lock` (deferred/transferable ownership) — acquire on construction and release on destruction deterministically.' },
{ title: '3. Deadlocks & Safe Lock Ordering', beginner: 'A deadlock is a standoff: Thread A holds Key 1 and waits for Key 2, while Thread B holds Key 2 and waits for Key 1. Both freeze forever. The cure is simple: everyone must grab keys in the SAME order.', advanced: 'Deadlock requires four conditions (mutual exclusion, hold-and-wait, no preemption, circular wait). Breaking circular wait via a global lock ordering — or using `std::scoped_lock` which locks multiple mutexes atomically with a deadlock-avoidance algorithm — eliminates it.' },
{ title: '4. Condition Variables (Producer/Consumer)', beginner: 'Sometimes a thread must WAIT until something happens (like data arriving). A condition variable lets it sleep efficiently and be woken up the instant another thread signals "the data is ready!"', advanced: '`std::condition_variable` pairs with a `std::unique_lock` and a predicate. `wait()` atomically releases the mutex and sleeps; `notify_one()/notify_all()` wake waiters, which re-acquire the lock and re-check the predicate to guard against spurious wakeups.' },
{ title: '5. Atomics & Lock-Free Preview (Expert Teaser)', beginner: 'For tiny operations like a counter, locking is overkill. C++ offers "atomic" variables that the hardware guarantees will update in one indivisible step — no lock needed.', advanced: '*(Pro Track Preview)* `std::atomic<T>` compiles to hardware atomic instructions (like `lock xadd`) with configurable memory orders (`relaxed`, `acquire`, `release`). Atomics are the foundation of lock-free queues and spinlocks, which the Expert track builds from scratch.' }
],
{
title: 'The Corrupted Bank',
intro: 'Prove that unsynchronized threads corrupt a shared counter, then fix it perfectly with an RAII mutex lock.',
steps: [
'Create `bank.cpp` and include `<iostream>`, `<thread>`, `<vector>`, and `<mutex>`.',
'Declare shared state: `long long balance = 0;`.',
'Write an UNSAFE worker: `void unsafeAdd() { for (int i = 0; i < 100000; i++) balance++; }`.',
'Launch 4 threads running it, join them, and print `balance`. EXPECT a number LESS than 400000 — lost updates from races!',
'Now add `std::mutex m;` and write a SAFE worker using `std::lock_guard<std::mutex> lock(m);` before `balance++;`.',
'Reset balance to 0, launch 4 threads of the SAFE version, join, and print. EXPECT EXACTLY 400000 every single run.'
],
goal: 'You empirically demonstrated race-condition corruption and eliminated it with deterministic RAII mutual exclusion.'
},
[
q('What is a critical section?', ['The fastest part of your program', 'A code region accessing shared data that must not be executed by multiple threads simultaneously', 'The first function in main()', 'A compiler optimization zone'], 1, 'Critical sections require mutual exclusion because interleaved read-modify-write access corrupts shared state. **Why others are wrong:** The term is about correctness of shared access, not speed, position, or optimization.'),
q('Why is `std::lock_guard` preferred over calling `mutex.lock()` and `mutex.unlock()` manually?', ['It runs faster than manual locking', 'It guarantees the mutex is released when the scope exits, even if an exception is thrown inside the critical section', 'It allows multiple threads to lock at once', 'It automatically deletes the mutex'], 1, 'lock_guard is RAII: construction locks, destruction unlocks — making the lock exception-safe and leak-proof. **Why others are wrong:** It has no speed advantage, does not permit concurrent locking, and never deletes the mutex.'),
q('What causes a deadlock between two threads using two mutexes?', ['Locking the mutexes in different orders, creating a circular wait', 'Using lock_guard instead of unique_lock', 'Having too many CPU cores', 'Forgetting to include <mutex>'], 0, 'Circular wait arises when Thread A holds M1 and wants M2 while Thread B holds M2 and wants M1; a consistent global lock order (or std::scoped_lock) breaks the cycle. **Why others are wrong:** Wrapper choice, core count, and includes do not create circular waits.'),
q('In a condition variable wait loop, why must you re-check the predicate after waking up?', ['Because the mutex might be deleted', 'Because wakeups can be spurious and the condition may no longer be true', 'Because the thread loses its data on sleep', 'Because notify_all is unreliable'], 1, 'Spurious wakeups and races between notification and re-acquisition mean the predicate must always be re-validated (use the predicate overload of wait()). **Why others are wrong:** Mutexes are not deleted, state is not lost on sleep, and notify_all is reliable.'),
q('What advantage does `std::atomic<int>` provide over `int` protected by a mutex for a simple counter?', ['It stores the value in a register forever', 'It performs lock-free, hardware-guaranteed indivisible updates with no mutex overhead', 'It makes the counter thread-private', 'It prevents all deadlocks in the program'], 1, 'Atomics compile to single indivisible hardware instructions, eliminating lock acquisition overhead for simple operations. **Why others are wrong:** Atomics do not pin registers, privatize data, or solve unrelated deadlocks.')
],
['Protect every critical section (shared read-modify-write) with mutual exclusion.', 'Use RAII locks (lock_guard / unique_lock) so mutexes always release, even on exceptions.', 'Prevent deadlocks with a consistent global lock order or std::scoped_lock.', 'Condition variables let threads sleep efficiently until a predicate becomes true.', 'std::atomic gives lock-free indivisible updates for simple shared values.']
),
L(
'cpp-35', 35, 'Cache Locality & Memory Layout', '🧠',
TERMINAL_NOTICE_SHORT + 'Welcome to the elite tier of C++ performance. Your CPU is blindingly fast, but fetching data from RAM is agonizingly slow. The gap between them is bridged by tiny, ultra-fast caches — and how you LAY OUT your data in memory determines whether your program flies or crawls.',
[
{ title: '1. The Memory Hierarchy (CPU vs RAM)', beginner: 'Think of the CPU as a chef, the cache as the countertop, and RAM as the warehouse across the street. Grabbing ingredients from the countertop is instant; walking to the warehouse takes forever. Great code keeps its data on the countertop.', advanced: 'Latency scales dramatically: L1 (~1ns), L2 (~4ns), L3 (~20ns), RAM (~100ns). Performance engineering is largely the discipline of maximizing cache hit rates and minimizing expensive DRAM round-trips.' },
{ title: '2. Cache Lines & Spatial Locality', beginner: 'The CPU never fetches one byte — it grabs a whole chunk (a "cache line", usually 64 bytes) at once. If your data sits neatly in a row, one trip to RAM loads many useful items for free!', advanced: 'Hardware prefetchers exploit spatial locality: sequential access patterns fill cache lines efficiently, while pointer-chasing access patterns trigger a cache miss on nearly every hop.' },
{ title: '3. Why vector Beats list (Contiguous Memory)', beginner: 'Beginners think linked lists are "fast" because they grow easily. In reality, a linked list scatters its nodes randomly across RAM, forcing the CPU to hunt for each one. A vector stores everything in one neat row — almost always dramatically faster in loops.', advanced: 'Iterating `std::vector` is a sequential scan over contiguous memory (perfect prefetching), while `std::list`/`std::map` node traversal is a chain of dependent cache misses. For most workloads, contiguity dominates asymptotic notation.' },
{ title: '4. Struct Padding & Alignment', beginner: 'The CPU likes reading data at "nice" addresses, so the compiler inserts invisible spacer bytes inside structs. That is why a struct of 1+4+1 bytes can actually occupy 12 bytes!', advanced: 'Each member is aligned to its natural boundary; the compiler inserts padding between members and at the end. Reordering members from largest to smallest minimizes padding — a free memory win.' },
{ title: '5. False Sharing & SoA vs AoS (Expert Teaser)', beginner: 'Two threads can slow each other down even when they touch DIFFERENT variables — if those variables sit on the same cache line, the cores keep invalidating each other\'s caches!', advanced: '*(Pro Track Preview)* False sharing occurs when independent threads write to addresses within one cache line, causing constant coherence traffic. Fixes include padding/alignment (`alignas(64)`) and Structure-of-Arrays layouts that separate hot fields — core techniques in game engines and HFT systems.' }
],
{
title: 'The Padding Detective & Row-Major Race',
intro: 'Expose invisible struct padding with sizeof, then measure why row-major traversal crushes column-major traversal on the same data.',
steps: [
'Create `layout.cpp` and include `<iostream>` and `<vector>`.',
'Define `struct Bad { char a; int b; char c; };` and print `sizeof(Bad)`. EXPECT 12, not 10 — invisible padding bytes!',
'Define `struct Good { int b; char a; char c; };` and print `sizeof(Good)`. EXPECT 8 — reordering removed the waste.',
'Build a 2D grid: `const int N = 2000; std::vector<std::vector<int>> grid(N, std::vector<int>(N, 1));`.',
'Sum ROW-major: loop rows outer, columns inner, timing with `std::chrono`.',
'Sum COLUMN-major: loop columns outer, rows inner, timing again.',
'Compare the two timings. EXPECT column-major to be several times SLOWER on the identical data — pure cache locality difference.'
],
goal: 'You visualized invisible alignment padding and empirically proved that memory layout — not algorithm — can dominate runtime performance.'
},
[
q('Why does `struct { char a; int b; char c; }` typically have sizeof == 12 instead of 6?', ['The compiler duplicates members for safety', 'The compiler inserts padding bytes so each member starts at an aligned address', 'Chars are secretly 4 bytes', 'The struct stores its name in memory'], 1, 'Alignment rules require `int` to start at a 4-byte boundary, so padding is inserted after `a` and at the end after `c`. **Why others are wrong:** Members are not duplicated, char is 1 byte, and names are not stored in the object.'),
q('What is a cache line?', ['A queue of waiting CPU instructions', 'The fixed-size block (typically 64 bytes) transferred between RAM and cache in a single fetch', 'A line of source code in the cache', 'A debugging breakpoint'], 1, 'Memory moves between DRAM and cache in fixed-size lines, which is why spatial locality yields free adjacent data. **Why others are wrong:** It is a data-transfer unit, not an instruction queue, source line, or breakpoint.'),
q('Why is iterating a std::vector usually much faster than iterating a std::list with the same element count?', ['vector elements are smaller in size', 'vector stores elements contiguously, enabling cache-line prefetching, while list nodes are scattered causing cache misses', 'list cannot be iterated with for loops', 'vector uses the GPU'], 1, 'Contiguity turns iteration into a sequential prefetch-friendly scan; pointer-chasing a list incurs a dependent cache miss per node. **Why others are wrong:** Element size is identical, lists iterate fine, and no GPU is involved.'),
q('What is "false sharing"?', ['Two threads reading the same variable safely', 'Two threads writing to different variables that reside on the SAME cache line, causing constant cache invalidation between cores', 'A variable shared between two programs', 'Sharing a mutex between threads'], 1, 'Cache coherence operates at line granularity, so independent writes to one line ping-pong between cores and destroy scalability. **Why others are wrong:** Read-sharing is harmless, and it is unrelated to inter-process sharing or mutexes.'),
q('How can you reduce struct memory waste without changing its data members?', ['Reorder members from largest to smallest alignment to minimize padding', 'Declare all members public', 'Add more members', 'Use recursion'], 0, 'Grouping large-alignment members first eliminates most interior padding bytes. **Why others are wrong:** Access specifiers, extra members, and recursion do not affect layout padding.')
],
['The CPU cache hierarchy is ~100x faster than RAM — design for cache hits.', 'Memory moves in 64-byte cache lines; sequential (spatial) access prefetches for free.', 'Contiguous containers (vector) beat pointer-chasing containers (list/map) in real loops.', 'Struct padding is invisible but measurable — reorder members to reclaim bytes.', 'False sharing and SoA/AoS layout choices decide multi-core scalability.']
),
L(
'cpp-36', 36, 'Profiling & The Optimization Mindset', '⏱️',
TERMINAL_NOTICE_SHORT + 'Amateurs guess where their code is slow; professionals MEASURE. Optimization without profiling is superstition — you will polish the wrong 90% while the real bottleneck laughs at you. This lesson installs the scientific method into your engineering workflow.',
[
{ title: '1. Measure First (Profiling Tools)', beginner: 'A profiler is like a fitness tracker for your program: it records exactly which functions consume the most time. Never optimize anything until the profiler points at it.', advanced: 'Sampling profilers (perf, VTune) interrupt execution at intervals to build statistical hotspot profiles; instrumenting profilers (gprof) hook calls. Both reveal the true cost distribution, which intuition almost always gets wrong.' },
{ title: '2. Big-O Before Micro-Optimization', beginner: 'Making a bad algorithm 10% faster is still a bad algorithm. First ask: can I do fundamentally LESS work? Switching from scanning everything to looking things up directly beats any tiny trick.', advanced: 'Algorithmic complexity dominates constants: an O(n) lookup table beats an O(n²) loop regardless of micro-tuning. Optimize complexity class first, cache behavior second, instruction-level tricks last.' },
{ title: '3. The Usual Suspects (Allocations, Copies, Cache Misses)', beginner: 'In real C++ programs, three thieves steal most of the speed: creating/deleting memory constantly (allocations), copying big objects unnecessarily, and jumping around memory randomly (cache misses).', advanced: 'Hotspot patterns cluster around heap churn (prefer reserve(), object pools, stack allocation), redundant copies (pass by const&, move semantics), and poor locality (contiguous layouts). These three categories explain the majority of production performance debt.' },
{ title: '4. Compiler Optimization Flags', beginner: 'By default, compilers build "debug" versions that run slowly on purpose. Flipping one switch (`-O2`) tells the compiler to optimize aggressively — often making the SAME code 5-10x faster for free!', advanced: '`-O2` enables inlining, loop transformations, and dead-code elimination; `-O3` adds vectorization and aggressive unrolling; LTO (`-flto`) optimizes across translation units. Always benchmark release builds — debug measurements are meaningless.' },
{ title: '5. PGO & Flame Graphs (Expert Teaser)', beginner: 'Advanced teams let the program teach the compiler: run it once on typical work, record which paths are hot, then recompile using that recording for even better optimization.', advanced: '*(Pro Track Preview)* Profile-Guided Optimization (PGO) feeds runtime branch frequencies back into code layout and inlining decisions. Flame graphs visualize stacked sampling profiles, making hierarchical bottleneck identification instant. The Expert track runs a full PGO pipeline.' }
],
{
title: 'The Optimization Switch',
intro: 'Compile the exact same code with optimizations off and on, and measure the dramatic difference the compiler alone makes.',
steps: [
'Create `bench.cpp` with `<iostream>` and `<chrono>`.',
'Write a hot loop: sum `i * i` for 200 million iterations into a `long long`, printing the result and elapsed milliseconds.',
'Compile UNOPTIMIZED: `g++ bench.cpp -o bench_slow` and run it. Record the time (e.g., ~300ms).',
'Compile OPTIMIZED: `g++ -O2 bench.cpp -o bench_fast` and run it. Record the time.',
'EXPECT a dramatic drop (often 5-10x) — identical source, radically different binary.',
'Try `g++ -O3 bench.cpp -o bench_max` and compare again. Notice the compiler may even constant-fold or vectorize the loop entirely.'
],
goal: 'You empirically proved that compiler optimization levels dominate naive performance assumptions, cementing the measure-first mindset.'
},
[
q('What is the FIRST step of professional performance work?', ['Rewrite the code in assembly', 'Profile to identify the actual bottleneck before changing anything', 'Add more threads everywhere', 'Replace all loops with recursion'], 1, 'Measurement precedes optimization: profilers reveal where time actually goes, which intuition reliably misjudges. **Why others are wrong:** Assembly, blind threading, and recursion swaps are guesses, not engineering.'),
q('Why does algorithmic complexity (Big-O) matter more than micro-optimizations?', ['It makes code shorter', 'A better complexity class reduces work fundamentally, dominating any constant-factor tuning', 'Compilers require it', 'It reduces memory only'], 1, 'As input grows, O(n) vs O(n²) differences overwhelm any constant-speed tricks. **Why others are wrong:** Complexity is about work scaling, not code length, compiler rules, or memory alone.'),
q('Which trio causes most real-world C++ performance problems?', ['Syntax errors, warnings, comments', 'Heap allocation churn, unnecessary copies, and cache-unfriendly access patterns', 'Long variable names, deep nesting, tabs', 'Using too many headers'], 1, 'Allocation, copying, and locality are the dominant runtime costs in production C++ hotspots. **Why others are wrong:** Style and cosmetic issues have zero runtime cost.'),
q('What does the `-O2` compiler flag do?', ['Disables all error checking', 'Enables aggressive optimizations like inlining and loop transformations, often yielding large free speedups', 'Encrypts the binary', 'Makes compilation instant'], 1, '-O2 activates the standard optimization pipeline without extreme code-size tradeoffs. **Why others are wrong:** It does not disable diagnostics, encrypt output, or speed up compilation (it slows it).'),
q('What is Profile-Guided Optimization (PGO)?', ['Optimizing based on the programmer\'s guesses', 'Recompiling the program using recorded runtime behavior (hot paths, branch frequencies) to guide better code generation', 'A profiling GUI tool', 'Optimizing only the UI code'], 1, 'PGO feeds real execution profiles back into the compiler for superior inlining and layout decisions. **Why others are wrong:** It is measurement-driven, not guess-driven, and is not a GUI or UI-specific technique.')
],
['Never optimize without profiling — measure first, always.', 'Fix algorithmic complexity before micro-tuning constants.', 'Hunt the usual suspects: allocations, copies, and cache misses.', 'Always benchmark release builds (-O2/-O3), never debug builds.', 'Advanced pipelines (PGO, flame graphs) turn runtime data into compiler intelligence.']
),
L(
'cpp-37', 37, 'Multi-File Projects, Headers & CMake', '🏗️',
TERMINAL_NOTICE_SHORT + 'Real C++ software is never one giant file. Professional projects split code into headers (the interface) and source files (the implementation), compiled separately and stitched together by a linker — orchestrated by build systems like CMake. This is how teams of hundreds share one codebase.',
[
{ title: '1. Declaration vs Definition (.h vs .cpp)', beginner: 'A header file (.h) is the menu: it DECLARES what exists ("there is a function called attack"). The source file (.cpp) is the kitchen: it DEFINES how it actually works. Other files only need the menu to use the kitchen.', advanced: 'Declarations introduce names and signatures to the compiler; definitions provide the actual body/storage. The One Definition Rule (ODR) permits many declarations but exactly one definition per entity across the linked program.' },
{ title: '2. Include Guards & #pragma once', beginner: 'If two files both include the same header, and that header includes another, the same declarations could get pasted twice — causing errors. Include guards act like a bouncer: "this header has already been pasted, skip it!"', advanced: 'Traditional guards (`#ifndef X / #define X / #endif`) and `#pragma once` prevent multiple textual inclusion of the same header within one translation unit, avoiding redefinition errors.' },
{ title: '3. Separate Compilation & Linking', beginner: 'Each .cpp file is cooked separately into an object file (.o). Then the LINKER glues all object files together, matching every "promise" from headers with its real definition. If a definition is missing, you get the famous "undefined reference" error.', advanced: 'The compiler processes each translation unit independently; the linker resolves cross-TU symbol references. Missing definitions surface at link time, while missing declarations surface at compile time.' },
{ title: '4. CMake Basics', beginner: 'Typing long g++ commands for 50 files is insanity. CMake is a recipe manager: you write ONE small file (CMakeLists.txt) describing your project, and CMake generates all the build commands for you on any operating system.', advanced: 'CMake is a meta-build system generating native build files (Make, Ninja, VS). `cmake -B build` configures, `cmake --build build` compiles. It manages targets, include paths, dependencies, and toolchains declaratively.' },
{ title: '5. Header Hygiene & C++20 Modules (Expert Teaser)', beginner: 'Headers should only include what they truly need. Bloated headers slow down EVERY file that includes them — like attaching a 100-page appendix to every email.', advanced: '*(Pro Track Preview)* Include-what-you-use minimizes recompilation cascades; forward declarations replace full includes where possible. C++20 Modules finally replace textual headers with compiled binary interfaces, cutting build times dramatically — covered deeply in the Expert track.' }
],
{
title: 'The Two-File Project',
intro: 'Split a Robot class across a header and source file, compile them together, then automate the build with CMake.',
steps: [
'Create a folder and inside it create `Robot.h` with: `#pragma once`, `#include <string>`, and `class Robot { public: Robot(std::string n); void speak(); };`.',
'Create `Robot.cpp` with: `#include "Robot.h"`, `#include <iostream>`, and the definitions: `Robot::Robot(std::string n) : name(n) {}` plus `void Robot::speak() { std::cout << name << " says beep!" << std::endl; }` (add `private: std::string name;` in the header).',
'Create `main.cpp` with `#include "Robot.h"` and a main() that constructs `Robot r("Unit-7");` and calls `r.speak();`.',
'Compile manually: `g++ main.cpp Robot.cpp -o app` and run it. EXPECT "Unit-7 says beep!".',
'Now create `CMakeLists.txt`: `cmake_minimum_required(VERSION 3.15)`, `project(RobotApp)`, `add_executable(app main.cpp Robot.cpp)`.',
'Run `cmake -B build` then `cmake --build build`. Run the generated binary. EXPECT identical output — now built by a real build system.'
],
goal: 'You architected a multi-translation-unit project, mastered declaration/definition separation, and automated compilation with CMake.'
},
[
q('What belongs in a header (.h) file?', ['Function bodies and full implementations', 'Declarations: class blueprints, function signatures, and constants that other files need to see', 'The main() function only', 'Compiled machine code'], 1, 'Headers expose interfaces (declarations) so other translation units can compile against them without seeing implementations. **Why others are wrong:** Bodies live in .cpp files; main belongs in one source file; machine code is linker output.'),
q('What problem do include guards / #pragma once solve?', ['Memory leaks at runtime', 'The same header being textually included multiple times in one translation unit, causing redefinition errors', 'Slow program execution', 'Missing linker symbols'], 1, 'They make header inclusion idempotent within a translation unit, preventing duplicate declarations. **Why others are wrong:** They affect preprocessing only, not runtime memory, speed, or link symbols.'),
q('When do you get an "undefined reference" error?', ['During compilation, when a declaration is missing', 'During linking, when a declaration has no matching definition anywhere', 'At runtime, when a variable is null', 'When a header lacks include guards'], 1, 'The linker cannot resolve a symbol that was declared but never defined in any translation unit. **Why others are wrong:** Missing declarations fail at compile time; null variables and guards are unrelated.'),
q('What is CMake\'s primary role?', ['A faster C++ compiler', 'A meta-build system that generates native build files from a declarative CMakeLists.txt', 'A debugging tool', 'A package manager only'], 1, 'CMake configures and emits build systems (Make/Ninja/IDE projects) rather than compiling code itself. **Why others are wrong:** It is not a compiler, debugger, or (primarily) a package manager.'),
q('Why minimize what a header includes (header hygiene)?', ['To make the binary smaller at runtime', 'Because every file including that header reprocesses its entire include tree, so bloated headers cause massive recompilation cascades', 'To satisfy the compiler', 'To enable recursion'], 1, 'Textual inclusion multiplies preprocessing work across all dependent translation units; lean headers keep build graphs fast. **Why others are wrong:** Runtime binary size and compiler satisfaction are not the drivers.')
],
['Headers declare interfaces; source files define implementations (ODR).', 'Include guards / #pragma once keep inclusion idempotent.', 'Each .cpp compiles independently; the linker resolves cross-file symbols.', 'CMake automates multi-file builds portably via CMakeLists.txt.', 'Lean headers and forward declarations keep large codebases compiling fast.']
),
L(
'cpp-38', 38, 'Bit Manipulation & Low-Level Tricks', '🎛️',
TERMINAL_NOTICE_SHORT + 'Beneath every variable lies a row of bits — ones and zeros. Professional C++ engineers speak this native language fluently, packing flags, permissions, and states into single integers. Bit manipulation is the closest a high-level language gets to talking directly to the hardware.',
[
{ title: '1. Binary & Hex Recap', beginner: 'Computers store everything as bits: 0 or 1. Four bits make a "nibble", eight bits make a byte. Hexadecimal (0-9, A-F) is just a compact human-friendly way to write groups of four bits.', advanced: 'Each hex digit maps to exactly four bits, making hex the natural notation for byte-level inspection. Understanding positional weights (1, 2, 4, 8, 16...) is prerequisite to all bitwise reasoning.' },
{ title: '2. The Bitwise Operators', beginner: 'AND (&) keeps a bit only if BOTH sides have it. OR (|) keeps it if EITHER side has it. XOR (^) keeps it if the sides DIFFER. NOT (~) flips every bit. Shifts (<<, >>) slide bits left or right.', advanced: 'Bitwise ops execute in a single CPU cycle. Left-shifting by n multiplies by 2^n; right-shifting divides (flooring for unsigned). These are the building blocks of masks, flags, and fast arithmetic.' },
{ title: '3. Bit Flags & Masks', beginner: 'Instead of 8 separate boolean variables, pack 8 true/false settings into ONE integer — each bit is one switch. Turn a switch on with OR, off with AND-NOT, and check it with AND.', advanced: 'Flag enums combined with bitwise composition provide O(1), memory-dense option sets (POSIX permissions, GL state, input handling). Masks isolate fields: `(value & mask) >> offset` extracts packed sub-values.' },
{ title: '4. Classic Bit Tricks', beginner: 'Some interview-favorite tricks: `n & 1` tells you if n is odd; `n & (n - 1) == 0` checks if n is a power of two; `n & (n - 1)` clears the lowest set bit.', advanced: 'These identities follow from two\'s-complement structure: subtracting 1 borrows through the lowest set bit, clearing it and setting all lower bits — the foundation of popcount-based algorithms.' },
{ title: '5. std::bitset & popcount (Expert Teaser)', beginner: 'For bigger bit collections, C++ gives you std::bitset — a fixed-size row of switches with handy methods like .count() to count how many are ON.', advanced: '*(Pro Track Preview)* Hardware popcount (`std::popcount` in <bit>, C++20) compiles to a single instruction. Bitsets enable branchless algorithms and compact state machines — techniques used heavily in emulators, compressors, and game AI.' }
],
{
title: 'The Permission Switchboard',
intro: 'Pack multiple user permissions into a single integer using bit flags, then test, set, and toggle them with bitwise operators.',
steps: [
'Create `bits.cpp` with `<iostream>`.',
'Define flags: `const int READ = 1 << 0; const int WRITE = 1 << 1; const int EXEC = 1 << 2;`.',
'Grant permissions: `int perms = READ | WRITE;`.',
'Test a permission: `if (perms & EXEC) std::cout << "can exec"; else std::cout << "no exec";`. EXPECT "no exec".',
'Toggle EXEC on: `perms ^= EXEC;` then test again. EXPECT "can exec".',
'Revoke WRITE: `perms &= ~WRITE;` then test `(perms & WRITE)`. EXPECT false.',
'Bonus: print whether a number is a power of two: `std::cout << ((16 & 15) == 0);`. EXPECT 1 (true).'
],
goal: 'You manipulated individual bits to pack, test, toggle, and clear boolean state inside a single integer — hardware-level data encoding.'
},
[
q('What does `x & (1 << n)` do?', ['Sets bit n of x to 1', 'Tests whether bit n of x is set (non-zero result if set)', 'Clears bit n of x', 'Shifts x left by n'], 1, 'AND with a single-bit mask isolates bit n; a non-zero result means the bit was set. **Why others are wrong:** Setting uses OR, clearing uses AND-NOT, and shifting is a different operator.'),
q('How do you SET bit n of an integer x?', ['x &= (1 << n)', 'x |= (1 << n)', 'x ^= (1 << n)', 'x >> n'], 1, 'OR with the single-bit mask forces bit n to 1 while leaving other bits untouched. **Why others are wrong:** AND would clear other bits, XOR would toggle, and >> shifts.'),
q('What does `n & (n - 1) == 0` detect (for n > 0)?', ['n is even', 'n is a power of two', 'n is negative', 'n is prime'], 1, 'Powers of two have exactly one set bit; subtracting 1 clears it, so the AND yields zero. **Why others are wrong:** Evenness is `n & 1 == 0`; negativity and primality are unrelated to this identity.'),
q('What does XOR (^) produce for a given bit position?', ['1 only if both bits are 1', '1 only if the two bits differ', '1 if either bit is 1 (including both)', 'The inverse of OR'], 1, 'XOR is exclusive: it sets the result bit when inputs differ, which is why it serves as a toggle operation. **Why others are wrong:** Both-1 is AND; either-1-inclusive is OR; it is not the inverse of OR.'),
q('Why pack boolean flags into one integer instead of using many bool variables?', ['Integers print nicer', 'One integer stores many flags densely and allows O(1) bitwise set/test/clear in single instructions', 'Bools are illegal in C++', 'It avoids using memory entirely'], 1, 'Bit packing is memory-dense and each flag operation is a single-cycle bitwise instruction. **Why others are wrong:** Printing is irrelevant, bool exists, and it still uses memory (just less).')
],
['Bits are the hardware\'s native vocabulary; hex is its human shorthand.', 'AND tests, OR sets, AND-NOT clears, XOR toggles — the four flag operations.', 'Shifts multiply/divide by powers of two instantly.', 'Bit identities (n & (n-1)) power classic interview and algorithm tricks.', 'std::bitset and hardware popcount scale bit techniques to real systems.']
),
L(
'cpp-39', 39, 'Namespaces, enum class & Modern Type Safety', '🏷️',
TERMINAL_NOTICE_SHORT + 'As codebases grow, names collide and magic numbers spread like weeds. Modern C++ arms you with namespaces, scoped enumerations, and strong type aliases — the tools that keep large systems organized, self-documenting, and compile-time safe.',
[
{ title: '1. Namespaces (Collision Avoidance)', beginner: 'If two libraries both define a function called `print()`, your program breaks. A namespace is like a family name: `myLib::print()` vs `theirLib::print()` — same first name, different families, no conflict.', advanced: 'Namespaces partition the global identifier space. Nested namespaces, `using` declarations (selective), and `using namespace` (bulk, dangerous in headers) control name visibility and lookup.' },
{ title: '2. enum class (Scoped Enumerations)', beginner: 'Old enums dump their names everywhere and silently convert to numbers, causing bugs. `enum class` keeps its values locked inside its own name (`State::Menu`) and refuses implicit number conversions.', advanced: 'Scoped enumerations avoid identifier pollution and implicit integral conversion, support explicit underlying types (`enum class Color : uint8_t`), and integrate safely with switches and hash maps.' },
{ title: '3. Type Aliases & Strong Types (using)', beginner: 'Instead of repeating `std::vector<std::pair<std::string, int>>` everywhere, give it a nickname: `using ScoreList = std::vector<...>;`. Code becomes readable instantly.', advanced: '`using` aliases (modern typedef) improve readability and enable single-point type changes. For true safety, strong typedef patterns wrap primitives in distinct types so the compiler rejects mixing, e.g., Meters vs Seconds.' },
{ title: '4. const & constexpr Correctness', beginner: '`const` promises "this will not change"; `constexpr` promises "this is computed at compile time". Using them everywhere gives the compiler free optimization opportunities and catches your bugs early.', advanced: 'const-correctness (including const member functions and const references) prevents accidental mutation and enables optimization; constexpr extends compile-time evaluation to functions and objects usable in constant contexts.' },
{ title: '5. [[nodiscard]] & Attributes (Expert Teaser)', beginner: 'Some functions return values you MUST NOT ignore (like error codes). Tagging them [[nodiscard]] makes the compiler warn you if you accidentally throw the result away.', advanced: '*(Pro Track Preview)* Standard attributes ([[nodiscard]], [[maybe_unused]], [[likely]]) encode intent directly into the type system, turning silent logic bugs into compile-time diagnostics — a hallmark of defensive professional codebases.' }
],
{
title: 'The Game State Machine',
intro: 'Build a collision-free, type-safe state machine using namespaces and enum class, and prove old enums would have collided.',
steps: [
'Create `states.cpp` with `<iostream>`.',
'Define `namespace game { enum class State { Menu, Playing, Paused }; void run(State s); }`.',
'Implement `game::run` with a `switch (s)` printing "In menu", "Playing", or "Paused" for each case.',
'In main(), declare `game::State current = game::State::Playing;` and call `game::run(current);`. EXPECT "Playing".',
'PROOF OF SAFETY: try `int x = game::State::Menu;` and compile. EXPECT a compile ERROR — enum class refuses implicit conversion.',
'Add `using Score = int;` alias and a function taking Score; call it normally to show aliases compile transparently.'
],
goal: 'You enforced compile-time name and type safety using namespaces, scoped enumerations, and aliases — eliminating entire bug classes by design.'
},
[
q('What problem do namespaces solve?', ['Slow compilation', 'Name collisions between libraries or modules by partitioning the identifier space', 'Memory leaks', 'Missing headers'], 1, 'Namespaces scope identifiers so identical names from different libraries coexist without ambiguity. **Why others are wrong:** They do not affect compile speed directly, memory, or header resolution.'),
q('How does `enum class` differ from a plain `enum`?', ['It runs faster', 'Its enumerators are scoped inside the enum name and do NOT implicitly convert to integers', 'It can hold strings', 'It allows duplicate values only'], 1, 'Scoped enums prevent identifier leakage and implicit integral conversion, eliminating classic enum bugs. **Why others are wrong:** Performance is identical, underlying types remain integral, and duplicates are unrelated.'),
q('What is the benefit of `using Matrix = std::vector<std::vector<double>>;`?', ['It makes operations faster', 'It creates a readable single-point alias, so the complex type is written once and can be changed in one place', 'It converts the type to an array', 'It makes the type immutable'], 1, 'Aliases centralize type definitions for readability and maintainability. **Why others are wrong:** Aliases add no runtime behavior, conversion, or immutability.'),
q('What does `constexpr` guarantee that plain `const` does not?', ['The value is stored in ROM', 'The value/expression can be evaluated at compile time and used in constant contexts', 'The value is thread-local', 'The value cannot be read'], 1, 'constexpr requires compile-time evaluability, enabling use in array sizes, templates, and other constant contexts. **Why others are wrong:** Storage location, thread locality, and readability are not what constexpr specifies.'),
q('What does the [[nodiscard]] attribute do?', ['Prevents the function from being called twice', 'Makes the compiler warn if the caller ignores the function\'s return value', 'Deletes the return value automatically', 'Marks the function as deprecated'], 1, 'It turns silently discarded results (often error codes) into compile-time warnings, catching real logic bugs. **Why others are wrong:** It does not limit calls, delete values, or deprecate functions.')
],
['Namespaces partition identifier space and prevent library collisions.', 'enum class provides scoped, type-safe enumerations with no implicit conversions.', 'using aliases centralize complex types for readability and single-point change.', 'const/constexpr correctness prevents mutation bugs and unlocks compile-time work.', 'Attributes like [[nodiscard]] convert silent logic errors into compiler diagnostics.']
),
L(
'cpp-40', 40, 'Elite Capstone: The C++ Architectural Review', '🎓',
TERMINAL_NOTICE_SHORT + 'Congratulations — you have reached the summit of the C++ Standard Track. This capstone consolidates everything: memory models, RAII, templates, move semantics, concurrency, layout-aware performance, and professional build workflows. You are no longer a C++ student; you are a C++ engineer.',
[
{ title: '1. The Memory Mental Map (Stack, Heap, RAII)', beginner: 'You now know the whole memory story: stack variables clean themselves automatically, heap memory is YOUR responsibility, and RAII + smart pointers make that responsibility bulletproof.', advanced: 'Deterministic destruction, ownership semantics (unique/shared/weak), and move semantics together form C++\'s resource model — the single most important differentiator from garbage-collected languages.' },
{ title: '2. The Type System Map (Templates, Move, constexpr)', beginner: 'You can write generic code with templates, avoid expensive copies with move semantics, and push work to compile time with constexpr. Your code is reusable, fast, AND safe.', advanced: 'Generic programming (templates + CTAD), value semantics (copy/move elision), and compile-time computation (constexpr/consteval) constitute the modern C++ triad that powers zero-overhead abstractions.' },
{ title: '3. The Hardware Map (Caches, Cores, Concurrency)', beginner: 'You understand that real speed comes from respecting hardware: contiguous memory for caches, threads for cores, and mutexes for correctness. You write code that matches the machine it runs on.', advanced: 'Cache locality, memory ordering, thread lifecycles, and synchronization primitives connect your source code to physical execution — the mindset that separates performance engineers from syntax users.' },
{ title: '4. The Professional Workflow (Multi-file, CMake, Profiling)', beginner: 'You structure projects across headers and sources, build them with CMake, and profile before optimizing. You work like a professional team member, not a hobbyist.', advanced: 'Separate compilation, build automation, measurement-driven optimization, and defensive type safety (namespaces, enum class, attributes) form the engineering workflow expected in production codebases.' },
{ title: '5. Beyond: The Expert Track (Expert Teaser)', beginner: 'Your journey continues: coroutines, C++20 modules, SIMD vectorization, custom allocators, and lock-free data structures await in the Expert Track — the territory of engine developers and systems architects.', advanced: '*(Pro Track Preview)* The Expert Track covers C++20/23 frontiers (concepts, ranges, coroutines, modules), custom memory allocators, SIMD/AVX vectorization, ABI and vtable internals, and lock-free concurrent structures — the final layer of C++ mastery.' }
],
{
title: 'The Elite Capstone Build',
intro: 'Combine the entire track into one coherent multi-file project: a class with RAII, a vector of smart pointers, and a synchronized worker thread.',
steps: [
'Create `Worker.h`: `#pragma once`, `#include <vector>`, `#include <memory>`, `#include <mutex>`, and a class `Worker` with a `std::vector<std::unique_ptr<int>> data;` member, a `std::mutex m;`, and methods `void add(int v);` and `long long sum() const;`.',
'Create `Worker.cpp` implementing `add` (lock_guard, push_back make_unique<int>(v)) and `sum` (iterate and accumulate).',
'Create `main.cpp`: construct a Worker, launch TWO std::thread instances each calling `add` 50,000 times, join them, then print `sum`.',
'Compile: `g++ -O2 -std=c++17 main.cpp Worker.cpp -o capstone` and run.',
'EXPECT the sum to equal exactly 100,000 additions worth of value — proving RAII, ownership, and synchronization all working together.',
'Reflect: identify which lesson each line belongs to (smart pointers = L22, mutex = L34, threads = L33, multi-file = L37, -O2 = L36). You now SEE the architecture.'
],
goal: 'You synthesized the entire 40-lesson curriculum into a single correct, concurrent, memory-safe, multi-file application — proving true C++ engineering mastery.'
},
[
q('Which combination guarantees no memory leaks in the capstone\'s vector of heap integers?', ['Raw pointers + manual delete', 'std::vector<std::unique_ptr<int>> — ownership semantics destroy each integer automatically when the vector dies', 'malloc + free pairs', 'Global variables'], 1, 'unique_ptr ownership + vector destruction = deterministic, exception-safe cleanup with zero manual deletes. **Why others are wrong:** Raw pointers and malloc leak on exceptions or forgotten frees; globals defer the problem forever.'),
q('Why must the capstone\'s add() method lock a mutex?', ['To make it run faster', 'Because two threads perform read-modify-write on shared state concurrently, and unsynchronized access is a data race (UB)', 'Because the compiler requires it', 'To prevent the vector from resizing'], 1, 'Concurrent push_back from multiple threads without synchronization is a data race; the mutex serializes the critical section. **Why others are wrong:** Locking costs speed, is not compiler-mandated, and does not stop resizing (it protects correctness).'),
q('Why join both threads before printing the sum?', ['To free CPU cores', 'To guarantee both threads have finished adding before the result is read', 'Because threads cannot print', 'To reset the mutex'], 1, 'join() establishes a happens-before relationship: all additions complete before sum() reads, making the printed value correct. **Why others are wrong:** Core freeing, printing ability, and mutex state are not the reason.'),
q('What does compiling with -O2 demonstrate in the capstone?', ['It changes program behavior', 'It enables compiler optimizations that speed up identical source code without any source changes', 'It disables threads', 'It removes the mutex'], 1, 'Optimization levels transform the generated machine code while preserving observable behavior (as-if rule). **Why others are wrong:** Behavior is preserved; threads and mutexes remain.'),
q('Which track topic connects `enum class`, namespaces, and [[nodiscard]] into one theme?', ['Runtime speed', 'Compile-time safety and codebase organization', 'Memory allocation', 'File I/O'], 1, 'All three tools shift error detection to compile time and keep large codebases organized and self-documenting. **Why others are wrong:** They are not primarily about speed, allocation, or I/O.')
],
['RAII + smart pointers = deterministic, leak-free resource management.', 'Templates, move semantics, and constexpr deliver zero-overhead abstractions.', 'Cache locality, cores, and synchronization connect code to physical hardware.', 'Multi-file structure, CMake, and profiling define the professional workflow.', 'The Expert Track awaits: coroutines, modules, SIMD, allocators, and lock-free structures.']
)
];
export const getCppLessonById = (id: string): CppLesson | undefined =>
CPP_LESSONS.find(l => l.id === id);
export const isCppLessonUnlocked = (id: string, completedLessons: string[]): boolean => {
const idx = CPP_LESSONS.findIndex(l => l.id === id);
if (idx <= 0) return true;
return completedLessons.includes(CPP_LESSONS[idx - 1].id);
};
