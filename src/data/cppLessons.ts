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
['Use &var to discover exactly where a variable lives in RAM.', 'A pointer (int* p) is a typed variable that stores a memory address.', 'Use *p (dereferencing) to read or change the data at that address.', 'Pointers avoid expensive copies by passing addresses instead of whole objects.', 'Always initialize pointers to nullptr to avoid dangling and wild pointer bugs.']
),
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

  
];

export const getCppLessonById = (id: string): CppLesson | undefined =>
CPP_LESSONS.find(l => l.id === id);
export const isCppLessonUnlocked = (id: string, completedLessons: string[]): boolean => {
const idx = CPP_LESSONS.findIndex(l => l.id === id);
if (idx <= 0) return true;
return completedLessons.includes(CPP_LESSONS[idx - 1].id);
};
