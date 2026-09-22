// Java Track — Part 1: Lessons 1–5 (JVM Core → Syntax → Control Flow)
import type { NetworkingLesson, Concept, QuizQuestion } from './networkingLessons';

export type JavaLesson = NetworkingLesson;

const L = (
  id: string, order: number, title: string, icon: string, philosophy: string,
  concepts: Concept[], practical: JavaLesson['practical'], quiz: QuizQuestion[],
  keyTakeaways: string[], terminalNotice?: string
): JavaLesson => ({
  id, module: 'Module 2: Java Engineering', order, title, icon, philosophy,
  concepts, practical, quiz, keyTakeaways, terminalNotice,
});

const q = (question: string, options: string[], correctIndex: number, explanation?: string): QuizQuestion =>
  ({ question, options, correctIndex, explanation });

export const JAVA_TRACK_NOTICE = {
  type: "track-notice",
  notice: "☕ Java Track Status: This track is currently focusing on establishing your core Java programming foundation. Please proceed through the available lessons to build your skills; we are actively updating the preview environment and will notify you as soon as the interactive compiler is fully integrated."
};

export const JAVA_LESSONS: JavaLesson[] = [

// ==========================================
// LESSON 1: JVM ARCHITECTURE & THE EXECUTION ENGINE
// ==========================================
L(
  'java-01', 1, 'JVM Architecture & The Execution Engine', '🚀',
  '☕ Every enterprise software engineering journey in Java begins not with syntax, but with understanding the machine beneath the language. Unlike interpreted scripting languages that run directly on your OS, Java introduces an entire virtual computer between your code and the hardware. This is the Java Virtual Machine (JVM)—a software engine so powerful that it allows your code to run unmodified on Windows, Linux, macOS, ARM servers, and even embedded devices. You are not writing code for a processor; you are writing code for a universal platform. Mastering the JDK, JRE, JVM, and the bytecode compilation pipeline is the foundational blueprint for building truly platform-independent software.',
  [
    {
      title: '1. The Compilation Pipeline (WORA)',
      beginner: 'Think of Java as a universal translator at the United Nations. You write your code in English-like Java syntax. The compiler (javac) translates it into a neutral "blueprint" called Bytecode. This blueprint doesn\'t speak to any specific computer—it speaks to the JVM. Any machine that has a JVM installed can read this blueprint and execute it. This is the "Write Once, Run Anywhere" (WORA) promise: you compile once, and the same .class file runs everywhere without modification.',
      advanced: 'The javac compiler performs lexical analysis, syntax parsing, semantic type-checking, and annotation processing before emitting platform-independent bytecode instructions. This bytecode is NOT native machine code—it is a stack-based intermediate representation (IR) designed for the JVM specification. The compilation pipeline is: Source (.java) → Lexer → Parser → AST → Semantic Analysis → Bytecode Emission → .class file. Each .class file contains a magic number (0xCAFEBABE), constant pool metadata, method descriptors, and stack-based opcodes. This architectural separation means the same compiled artifact executes identically on x86, ARM, RISC-V, or any compliant JVM implementation.'
    },
    {
      title: '2. JDK vs JRE vs JVM (The Ecosystem Layers)',
      beginner: 'Think of three nesting boxes. The JVM is the innermost engine—it reads bytecode and executes it. The JRE (Java Runtime Environment) wraps the JVM with the standard library (all the pre-written tools like System.out.println). The JDK (Java Development Kit) wraps the JRE with developer tools: javac (compiler), javap (bytecode disassembler), jar (packaging tool), jdb (debugger), and monitoring tools. As a developer, you ALWAYS need the JDK. End-users who just run programs only need the JRE.',
      advanced: 'The JVM is a specification (JSR/JEP), not an implementation. Oracle HotSpot, OpenJ9, GraalVM, and Amazon Corretto are all compliant implementations with different performance characteristics. The JRE bundles the JVM + core class libraries (java.base, java.logging, java.xml modules). The JDK adds tooling: javac, javap, jshell, jconsole, jvisualvm, and jlink (for creating custom runtime images via JPMS since Java 9). Modern Java (9+) modularizes this via the Java Platform Module System (JPMS), allowing developers to create minimal custom runtimes containing only required modules.'
    },
    {
      title: '3. Bytecode & The .class File Format',
      beginner: 'When you run javac Main.java, a new file appears: Main.class. This file contains Bytecode—a special set of instructions that only the JVM understands. It is NOT machine code for your CPU. Think of it as an intermediate language, like assembly for a virtual processor. Each instruction is a small number (an opcode) that tells the JVM exactly what to do: push a value, add two numbers, call a method, or jump to another instruction.',
      advanced: 'The .class file format is a binary structure containing: magic number (CA FE BA BE), version flags, constant pool (string literals, class references, method signatures), access flags, this_class/super_class references, interfaces, fields, methods (with Code attributes containing bytecode), and attributes. Bytecode instructions are stack-based: operations like iadd pop two integers from the operand stack and push the result. You can inspect any .class file using javap -c -v ClassName to view the full disassembly including local variable tables, stack depth, and exception handlers.'
    },
    {
      title: '4. The Execution Engine & JIT Compilation',
      beginner: 'When you type java Main, the JVM loads your .class file and starts reading bytecode instructions one by one (interpretation). But interpretation is slow. So the JVM has a secret weapon: the JIT (Just-In-Time) compiler. It watches your program run and notices which methods get called thousands of times (called "hot spots"). It then translates those hot methods directly into raw CPU machine code, making them run 10-100x faster. The longer your program runs, the faster it gets!',
      advanced: 'The JVM Execution Engine has three modes: (1) Interpreter—executes bytecode instruction-by-instruction (slow startup, zero compilation cost). (2) C1 Compiler (Client)—quickly compiles methods with basic optimizations for fast startup. (3) C2 Compiler (Server)—aggressively optimizes hot methods with inlining, escape analysis, loop unrolling, and vectorization. The JIT uses profiling data (branch prediction, type speculation) gathered during interpretation. Methods exceeding invocation thresholds (default ~10,000 calls) are compiled to native code stored in the Code Cache (off-heap native memory). GraalVM replaces C2 with the Graal compiler for ahead-of-time (AOT) native compilation.'
    },
    {
      title: '5. The ClassLoader Subsystem & Metaspace',
      beginner: 'How does the JVM find your .class files? It uses ClassLoaders—special components that search for classes in specific locations. The Bootstrap ClassLoader finds core Java classes (like String and System). The Application ClassLoader finds YOUR classes. You can even write custom ClassLoaders to load classes from databases, network streams, or encrypted files!',
      advanced: '(Expert Teaser) The ClassLoader subsystem operates on three principles: Delegation (child loaders delegate to parents first), Uniqueness (each loader maintains its own namespace), and Visibility (child can see parent classes, not vice versa). Loaded class metadata is stored in Metaspace (off-heap native memory since Java 8, replacing the old PermGen). The class loading lifecycle is: Load → Link (Verify → Prepare → Resolve) → Initialize. Custom ClassLoaders enable hot-deployment in application servers (Tomcat, WildFly) and are the foundation of frameworks like Spring Boot DevTools. In the Expert track, we explore bytecode manipulation via ASM and Javassist to dynamically generate classes at runtime.'
    }
  ],
  {
    title: 'Workstation Activation & Bytecode Inspection',
    intro: '⚠️ NOTE: This practical assignment covers complete local JDK verification, source compilation via javac, bytecode inspection using javap, and first program execution. You will prove the entire compilation pipeline exists on your machine.',
    steps: [
      'Open your terminal window (PowerShell/CMD on Windows, Terminal on macOS/Linux).',
      'Verify JDK installation: Type `java -version` and press Enter. You MUST see version 17 or higher. Then type `javac -version` and press Enter. BOTH must return matching versions. If javac fails, you installed the JRE, not the JDK.',
      'If not installed, download OpenJDK LTS from Adoptium (Eclipse Temurin). Install and verify PATH configuration.',
      'Create a project folder: `mkdir java-fundamentals && cd java-fundamentals`.',
      'Create a file named `Main.java` in your editor. Type: `public class Main { public static void main(String[] args) { System.out.println("JVM Engine Active!"); } }`. Save the file.',
      'Compile the source into bytecode: `javac Main.java`. Verify that `Main.class` appeared in your directory using `ls` or `dir`.',
      'CRITICAL STEP — Inspect the bytecode: Run `javap -c Main`. Read the output carefully. Identify opcodes like `getstatic`, `ldc`, `invokevirtual`, and `return`. This is what the JVM actually executes.',
      'Execute the compiled program: `java Main`. Verify the output prints "JVM Engine Active!" to your terminal.',
      'BONUS: Modify the println string, recompile with javac, and observe how the bytecode changes in javap output.'
    ],
    goal: 'You successfully installed OpenJDK, compiled a .java source file into .class bytecode, inspected the raw JVM instructions using javap, and executed the program inside the JVM runtime.'
  },
  [
    q('What is the primary purpose of Java Bytecode (.class files)?', ['To make code run faster than compiled C++', 'To serve as a platform-independent intermediate representation executable by any compliant JVM', 'To encrypt source code from reverse engineering', 'To replace the need for a compiler entirely'], 1, 'Bytecode decouples compilation from execution. The same .class files run on Windows, Linux, ARM, or x86 without modification because the JVM abstracts the hardware layer. Why others are wrong: Bytecode is typically SLOWER than optimized native code initially (until JIT warms up). It is NOT encryption—javap can disassemble it. A compiler (javac) IS required to produce bytecode.'),
    q('Which JVM runtime component converts frequently executed bytecode into native CPU instructions?', ['The ClassLoader', 'The Just-In-Time (JIT) Compiler', 'The Garbage Collector', 'The Bytecode Verifier'], 1, 'The JIT compiler (HotSpot C1/C2 or Graal) monitors method invocation counts and compiles "hot" methods into optimized native machine code stored in the Code Cache. Why others are wrong: ClassLoaders find and load classes. The Garbage Collector reclaims memory. The Verifier checks bytecode safety before execution.'),
    q('Why must the public class name match the .java filename exactly?', ['To make file downloads faster', 'Java enforces that public class declarations align with source filenames for the compiler to locate the entry point', 'To enable IDE autocomplete features', 'It is purely a style convention with no technical requirement'], 1, 'javac enforces that if a class is declared public, its containing file MUST be named ClassName.java. This allows the compiler and JVM to deterministically locate class definitions. Why others are wrong: It has nothing to do with download speed or autocomplete. It is NOT optional—it causes a hard compilation error.'),
    q('What command executes compiled bytecode stored in App.class?', ['javac App.class', 'java App', 'run App.java', 'execute App.class'], 1, 'The java launcher takes the fully-qualified class name (WITHOUT .class extension), loads it via the Application ClassLoader, and invokes main via reflection. Why others are wrong: javac compiles source—it cannot execute .class files. "run" and "execute" are not valid Java CLI commands.'),
    q('What happens if you install only the JRE instead of the JDK?', ['Your code runs twice as fast', 'You can execute .class files but cannot compile .java source files because javac is missing', 'You cannot run Java programs at all', 'Garbage collection stops working'], 1, 'The JRE contains the JVM + runtime libraries but lacks development tools (javac, javap, jdb). You need the JDK for compilation. Why others are wrong: JRE executes programs fine. GC is part of the JVM, included in JRE. The limitation is ONLY compilation.')
  ],
  [
    'Java compiles to platform-independent bytecode (.class), NOT native machine code.',
    'The JDK provides development tools (javac); the JVM executes compiled bytecode.',
    'The JIT compiler dynamically converts hot methods into optimized native instructions.',
    'Source filenames must match public class names precisely (Main.java → public class Main).',
    'The public static void main(String[] args) signature is the JVM entry point invoked via reflection.'
  ],
  'We now have a built-in terminal right here! However, if you want a bigger screen, you can use your computer\'s native terminal (CMD/PowerShell/Terminal). The practical assignment below contains the full setup instructions to install OpenJDK on your machine and verify the compilation pipeline.'
),

// ==========================================
// LESSON 2: VARIABLES, MEMORY MODEL & TYPE SYSTEM
// ==========================================
L(
  'java-02', 2, 'Variables, Memory Model & Type System', '📦',
  '📦 Java is a strongly-typed, statically-verified language. Every variable is a labeled memory container with a fixed, declared type that the compiler enforces before your program ever runs. But beneath this simple abstraction lies a critical architectural split: primitive values live directly on the fast Stack, while objects live on the shared, garbage-collected Heap. Understanding WHERE your data lives in JVM memory is the single most important foundation for writing performant Java. This lesson maps the entire memory landscape—from raw bits to reference pointers—and gives you total control over type conversion.',
  [
    {
      title: '1. The 8 Primitive Types (Raw Memory Blocks)',
      beginner: 'Java has exactly 8 primitive building blocks, each with a fixed size in memory. Whole numbers: byte (tiny, 8 bits), short (small, 16 bits), int (standard, 32 bits), long (huge, 64 bits). Decimals: float (32 bits, less precise) and double (64 bits, standard precision). A single character: char (16 bits, stores Unicode). True/false logic: boolean. These store RAW values directly—no object overhead, no hidden metadata.',
      advanced: 'The 8 primitives map directly to CPU register operations: byte (8-bit signed two\'s complement, range -128 to 127), short (16-bit, -32768 to 32767), int (32-bit, ±2.1 billion), long (64-bit, ±9.2 quintillion), float (32-bit IEEE 754 single precision, ~7 decimal digits), double (64-bit IEEE 754 double precision, ~15 decimal digits), char (16-bit unsigned UTF-16 code unit, 0 to 65535), boolean (JVM implementation-dependent, typically 1 byte). Primitives have ZERO object header overhead—they are stored as raw binary patterns in stack frame slots. The JVM specification does not mandate boolean size; HotSpot uses 1 byte with 0=false, 1=true.'
    },
    {
      title: '2. Stack vs Heap (Where Data Lives)',
      beginner: 'Imagine your program is a factory with two zones. The Stack is your personal workbench—fast, organized, and private to each worker (thread). Local variables and method calls live here. When a method finishes, its workbench is instantly cleared. The Heap is the massive shared warehouse where all objects (anything created with new) are stored. Multiple workers can access the same warehouse, but it requires a cleaning crew (Garbage Collector) to remove trash.',
      advanced: 'The JVM runtime data areas include: (1) JVM Stacks—thread-private, one frame per method invocation, storing local variable arrays (indexed slots), operand stacks, and frame data. Stack overflow → StackOverflowError. (2) Heap—shared across ALL threads, structured into Young Generation (Eden + Survivor spaces) and Old Generation. Objects allocated here require GC. (3) Metaspace—stores class metadata, method bytecode, and constant pools (off-heap since Java 8). Local primitives live in stack frame slots. Reference variables store a pointer (compressed oop, typically 4 bytes with UseCompressedOops) on the stack, pointing to the actual object on the heap.'
    },
    {
      title: '3. Reference Types vs Primitives (Identity vs Value)',
      beginner: 'When you write int x = 5, the number 5 lives directly inside the variable x. But when you write String name = "Alice", the variable name doesn\'t hold the text—it holds a memory ADDRESS pointing to where "Alice" lives in the Heap warehouse. If you copy a primitive, you get an independent duplicate. If you copy a reference, you get a SECOND pointer to the SAME object. Modifying through one reference changes what both see!',
      advanced: 'Assignment semantics differ fundamentally: primitives copy VALUE bits; references copy the ADDRESS (pointer). If int[] a = {1,2,3}; int[] b = a; then b[0] = 99; → a[0] is ALSO 99 (both point to the same heap array). The == operator on references checks pointer identity (same heap address), NOT structural content. Use .equals() for value comparison. The JVM uses Compressed Ordinary Object Pointers (CompressedOops) to store 64-bit heap addresses in 32 bits when heap < 32GB, reducing memory footprint of reference-heavy data structures.'
    },
    {
      title: '4. Type Casting (Widening vs Narrowing)',
      beginner: 'Converting between types is called casting. Java AUTOMATICALLY converts small types to big ones (int → long → float → double) because no data is lost. This is Widening (implicit). But converting big to small (double → int) requires YOU to explicitly write the cast: (int) 9.99 becomes 9. The decimal is CHOPPED OFF, not rounded. This is Narrowing (explicit), and it can lose data.',
      advanced: 'Widening conversions (byte→short→int→long→float→double) are guaranteed lossless for integer types (though int→float may lose precision for values > 2^24 due to mantissa limits). Narrowing conversions require explicit cast syntax (TargetType) expression and perform: (1) For float/double→int: truncation toward zero (floor for positive, ceiling for negative). (2) For int→byte/short/char: modular arithmetic (high-order bits discarded). Example: (byte) 130 → -126 due to two\'s complement overflow. The compiler REJECTS implicit narrowing. Java 21+ introduces pattern matching for switch that can replace manual casting chains.'
    },
    {
      title: '5. Local Variable Type Inference (var) & Memory Identity',
      beginner: 'Since Java 10, you can write var score = 100; and Java automatically figures out that score is an int. This is NOT dynamic typing—the type is LOCKED at compile time and cannot change. var is purely syntactic sugar to reduce boilerplate. The variable still has a fixed type; the compiler just deduces it from the initializer.',
      advanced: '(Expert Teaser) The var keyword triggers Local Variable Type Inference (JEP 286). The compiler performs type deduction from the initializer expression at compile time. The resulting bytecode is IDENTICAL to explicit declaration—there is ZERO runtime overhead. However, var cannot be used for: method parameters, return types, class fields, or null initializers. Under the hood, the JVM does not distinguish var from explicit types; the .class file contains the same descriptor signatures. In the Expert track, we explore how the JVM\'s type profiling in the JIT compiler uses Class Hierarchy Analysis (CHA) to devirtualize method calls based on observed types.'
    }
  ],
  {
    title: 'Variable & Type Conversion Playground',
    intro: '⚠️ NOTE: This lab verifies your understanding of primitive memory layout, reference semantics, explicit narrowing casts, and compile-time type inference by building a test program that demonstrates each concept.',
    steps: [
      'Open your editor and create a file named `VariablesPlayground.java`.',
      'Add the boilerplate: `public class VariablesPlayground { public static void main(String[] args) { } }`.',
      'Inside main, declare all 8 primitives: `byte b = 127; short s = 32000; int i = 2_100_000_000; long l = 9_000_000_000L; float f = 3.14f; double d = 2.718281828; char c = \'A\'; boolean flag = true;`. Print each using System.out.println.',
      'Demonstrate widening: `int small = 100; long big = small;` (automatic). Print both. Then demonstrate narrowing: `double price = 19.99; int truncated = (int) price;`. Print both and observe how .99 is chopped off.',
      'Demonstrate reference semantics: `int[] arr1 = {1, 2, 3}; int[] arr2 = arr1; arr2[0] = 99;`. Print arr1[0] and observe it is ALSO 99 (both references point to the same heap array).',
      'Use var type inference: `var message = "Java infers String"; var count = 42;`. Print message.getClass().getSimpleName() to prove it is String.',
      'Compile: `javac VariablesPlayground.java`. Execute: `java VariablesPlayground`. Verify all outputs match expectations.'
    ],
    goal: 'You successfully created all 8 primitive types, demonstrated stack/heap reference mechanics, performed explicit narrowing casts, proved reference aliasing, and used compile-time type inference.'
  },
  [
    q('Which primitive type in Java holds a 64-bit floating-point decimal number?', ['float', 'double', 'int', 'long'], 1, 'double is the 64-bit IEEE 754 double-precision floating-point type, offering ~15 significant decimal digits. Why others are wrong: float is 32-bit single precision. int and long are integer types that cannot store decimals.'),
    q('What happens when you execute int result = (int) 8.85;?', ['The value rounds up to 9', 'The decimal part is truncated toward zero, storing 8', 'The program crashes with a ClassCastException', 'The value converts to String "8.85"'], 1, 'Narrowing cast from double to int truncates the fractional part toward zero. 8.85 → 8. Why others are wrong: Java truncates, it does NOT round. No exception is thrown—this is valid syntax. No String conversion occurs.'),
    q('Where are local primitive variables stored during JVM method execution?', ['In Metaspace', 'Directly on the thread-local Stack frame', 'On the shared garbage-collected Heap', 'In CPU L1 cache exclusively'], 1, 'Local primitives are allocated as slots in the current method\'s stack frame on the thread-local JVM Stack. They are destroyed when the method returns. Why others are wrong: Metaspace stores class metadata. Heap stores objects. CPU cache is a hardware optimization, not a JVM memory area.'),
    q('If int[] a = {1,2,3}; int[] b = a; b[0] = 99;, what is a[0]?', ['1 (unchanged)', '99 (both references point to the same array object)', '0 (default value)', 'Compilation error'], 1, 'Assignment b = a copies the REFERENCE (pointer), not the array contents. Both a and b point to the identical heap array. Mutating through b is visible through a. Why others are wrong: Primitives copy values, but references copy pointers. No compilation error occurs—this is valid Java.'),
    q('What keyword allows modern Java (10+) to infer variable types from initializers?', ['let', 'val', 'var', 'auto'], 2, 'The var keyword (JEP 286) instructs javac to deduce the static type from the initializer expression at compile time. The type is fixed and cannot change. Why others are wrong: let and val are Kotlin/Scala keywords. auto is C++. Java specifically chose var.')
  ],
  [
    'Primitives (int, double, char, boolean) store raw values directly on the Stack with zero object overhead.',
    'Reference types store a HEAP ADDRESS on the stack; the actual object lives on the shared Heap.',
    'Implicit casting widens automatically (int→long); explicit casting (int) narrows but truncates data.',
    'The == operator on references checks pointer identity; use .equals() for content comparison.',
    'The var keyword provides compile-time type inference with zero runtime cost—types remain fixed.'
  ],
  'If you want to use a big terminal on your own computer instead of the built-in one, please read Lesson 1 for full JDK setup instructions.'
),

// ==========================================
// LESSON 3: OPERATORS, BINARY PROMOTION & BITWISE LOGIC
// ==========================================
L(
  'java-03', 3, 'Operators, Binary Promotion & Bitwise Logic', '🧮',
  '🧮 Operators are the atomic verbs of computation—they transform, compare, and combine values. But Java\'s operator system hides subtle rules that trip up even experienced developers: integer division truncates decimals silently, small types are secretly promoted to int before arithmetic, short-circuit logic can prevent NullPointerExceptions, and bitwise shifts manipulate individual binary digits for maximum performance. Mastering these rules is the difference between code that works by accident and code that works by design.',
  [
    {
      title: '1. Arithmetic & Unary Operators (Pre vs Post)',
      beginner: 'Java supports standard math: + (add), - (subtract), * (multiply), / (divide), % (remainder/modulo). The unary operators ++ and -- add or subtract 1. BUT their position matters: count++ (post-increment) uses the CURRENT value first, THEN adds 1. ++count (pre-increment) adds 1 FIRST, then uses the new value. This distinction causes countless bugs in loops and assignments.',
      advanced: 'Unary increment/decrement compile to iinc bytecode instructions (for int locals). Post-increment (x++) evaluates to the ORIGINAL value, then increments the variable slot. Pre-increment (++x) increments FIRST, then evaluates to the NEW value. Example: int x = 5; int y = x++; → y=5, x=6. int x = 5; int y = ++x; → y=6, x=6. Integer division (/) TRUNCATES toward zero: 7/2=3, -7/2=-3. The modulo operator (%) preserves the sign of the DIVIDEND: -7%2=-1. Division by zero throws ArithmeticException for integers; for floating-point, it produces Infinity or NaN (IEEE 754 behavior).'
    },
    {
      title: '2. Relational & Equality Operators (The == Trap)',
      beginner: 'Comparison operators (>, <, >=, <=, ==, !=) always produce a boolean result. BUT there is a critical trap: when comparing OBJECTS (like Strings or arrays), == checks if they are the SAME object in memory (same address), NOT if they have the same content. Use .equals() to compare content. This is the #1 beginner bug in Java.',
      advanced: 'Relational operators on primitives compare raw bit patterns. The == operator on reference types performs pointer identity comparison (are both references pointing to the exact same heap address?). Due to String Pool interning, "hello" == "hello" may be TRUE (same interned literal), but new String("hello") == "hello" is FALSE (different heap objects). Always use .equals() for structural equality. The equals() method in java.lang.Object defaults to == (identity), but classes like String, Integer, and ArrayList override it for content comparison. Autoboxing caches Integer values -128 to 127, so Integer.valueOf(100) == Integer.valueOf(100) is TRUE, but Integer.valueOf(200) == Integer.valueOf(200) is FALSE.'
    },
    {
      title: '3. Logical & Short-Circuit Operators',
      beginner: 'Combine conditions with AND (&&) and OR (||). Java uses SHORT-CIRCUIT evaluation: if the first part of && is false, Java SKIPS the second part entirely (because the result is already determined). This is not just an optimization—it PREVENTS crashes! Writing if (obj != null && obj.length() > 0) is safe because if obj IS null, Java never calls .length().',
      advanced: 'Short-circuit operators (&& and ||) compile to conditional branch bytecode (ifeq, ifne, goto). The right operand is ONLY evaluated if the left operand does not determine the result. For &&: if left is false → skip right, result is false. For ||: if left is true → skip right, result is true. This is guaranteed by the JLS (Java Language Specification §15.23-24). Non-short-circuit bitwise AND (&) and OR (|) on booleans ALWAYS evaluate both sides—useful only when side-effects in the right operand are required. Short-circuit evaluation is the foundation of null-safety patterns, Optional chains, and guard clauses.'
    },
    {
      title: '4. Binary Numeric Promotion (The Hidden int Conversion)',
      beginner: 'Here is a rule that surprises everyone: when you do math with byte or short values, Java SECRETLY converts them to int BEFORE calculating. So byte a = 10; byte b = 20; byte c = a + b; is a COMPILATION ERROR! The result of a+b is int, and you cannot assign int back to byte without an explicit cast: byte c = (byte)(a + b);',
      advanced: 'JLS §5.6.2 defines Binary Numeric Promotion: if either operand is double → promote both to double. Else if float → float. Else if long → long. Otherwise → BOTH promoted to int. This means byte+byte, short+short, char+char ALL produce int. This rule exists because the JVM has no byte/short arithmetic opcodes—only iadd, isub, imul, idiv for 32-bit integers. The bytecode performs 32-bit operations and truncates on storage. Compound assignment (a += b) includes an IMPLICIT cast, so byte a = 10; a += 5; compiles fine (equivalent to a = (byte)(a + 5)). This is a deliberate JLS exception.'
    },
    {
      title: '5. Bitwise Operators & Shift Operations',
      beginner: 'Bitwise operators work directly on the individual 1s and 0s of a number\'s binary representation. & (AND), | (OR), ^ (XOR), ~ (NOT) manipulate each bit independently. Shift operators << (left shift) and >> (right shift) move all bits left or right, effectively multiplying or dividing by powers of 2. The >>> operator is an UNSIGNED right shift that fills with zeros instead of copying the sign bit.',
      advanced: '(Expert Teaser) Bitwise operations compile to single-cycle CPU instructions (iand, ior, ixor, ishl, ishr, iushr). Left shift << n multiplies by 2^n. Arithmetic right shift >> n divides by 2^n (preserving sign via sign-extension). Unsigned right shift >>> n fills vacated bits with 0 regardless of sign. Common patterns: check even/odd with (x & 1) == 0; swap variables without temp using XOR: a ^= b; b ^= a; a ^= b; extract individual bytes: (value >> 24) & 0xFF. In the Expert track, we explore how the JIT compiler uses bitwise patterns for branchless programming, SIMD vectorization, and how Java\'s Vector API (Project Panama) maps bitwise operations to AVX-512 CPU instructions.'
    }
  ],
  {
    title: 'Operator & Math Sandbox',
    intro: '⚠️ NOTE: Build a practical testing script to observe integer division truncation, short-circuit null protection, binary promotion rules, and bitwise shift mechanics.',
    steps: [
      'Create a file named `OperatorSandbox.java` with the standard public class and main method boilerplate.',
      'Test integer vs floating-point division: Print `10 / 3` (expect 3) vs `10.0 / 3.0` (expect 3.333...). Observe how integer division silently drops the decimal.',
      'Test pre/post increment: Write `int x = 5; int a = x++; int b = ++x;`. Print x, a, b. Verify a=5, b=7, x=7.',
      'Test short-circuit protection: Write `String text = null; if (text != null && text.length() > 0) { ... } else { System.out.println("Safe! Short-circuit prevented NullPointerException"); }`. Verify no crash occurs.',
      'Test binary promotion: Write `byte b1 = 10; byte b2 = 20;` then attempt `byte b3 = b1 + b2;`. Observe the COMPILATION ERROR. Fix it: `byte b3 = (byte)(b1 + b2);`.',
      'Test bitwise left shift: Calculate `int shifted = 5 << 2;` (5 × 4 = 20). Print the result. Then test unsigned right shift: `int neg = -8; int unsigned = neg >>> 1;`. Print both and observe how >>> fills with zeros.',
      'Compile: `javac OperatorSandbox.java`. Execute: `java OperatorSandbox`. Verify all outputs.'
    ],
    goal: 'You mastered arithmetic truncation, short-circuit null safety, binary numeric promotion rules, and bitwise shift operations with full understanding of the underlying mechanics.'
  },
  [
    q('What is the result of evaluating 15 / 4 in Java?', ['3.75', '3', '4', 'Compilation error'], 1, 'Integer division truncates the fractional remainder toward zero. 15/4 = 3 (not 3.75, not rounded to 4). Why others are wrong: 3.75 requires floating-point operands (15.0/4). It does not round up. No error—this is valid integer arithmetic.'),
    q('Why is short-circuit evaluation (&&) critical when checking object properties?', ['It makes math calculations 10x faster', 'It skips evaluating the right operand if the left is false, preventing NullPointerExceptions', 'It automatically casts objects to numbers', 'It prevents loops from running infinitely'], 1, 'If text != null && text.length() > 0 and text IS null, the left operand is false, so Java NEVER evaluates text.length(). Without short-circuit, a NullPointerException would crash the program. Why others are wrong: It has nothing to do with math speed, casting, or loops.'),
    q('What happens when you add two byte primitives: byte a = 10; byte b = 20; byte c = a + b;?', ['c equals 30, compiles fine', 'Compilation error: a+b is promoted to int, cannot assign int to byte without cast', 'Runtime ArithmeticException', 'The values overflow and wrap to -226'], 1, 'Binary Numeric Promotion (JLS §5.6.2) promotes both bytes to int before addition. The result is int, which cannot be implicitly narrowed to byte. Fix: byte c = (byte)(a + b). Why others are wrong: It does NOT compile without cast. No runtime exception. No overflow—30 fits in byte range.'),
    q('Which operator performs an UNSIGNED right bitwise shift (fills with zeros)?', ['>>', '<<', '>>>', '^'], 2, 'The >>> operator shifts bits right and fills vacated leftmost positions with 0, regardless of the sign bit. Why others are wrong: >> is arithmetic right shift (preserves sign via sign-extension). << is left shift. ^ is XOR, not a shift.'),
    q('What is the value of x after: int x = 5; int y = x++;?', ['x = 6, y = 6', 'x = 6, y = 5', 'x = 5, y = 5', 'x = 5, y = 6'], 1, 'Post-increment (x++) evaluates to the CURRENT value (5) for the assignment to y, THEN increments x to 6. So y=5, x=6. Why others are wrong: Pre-increment (++x) would give y=6, x=6. Post-increment always yields the original value first.')
  ],
  [
    'Integer division truncates decimals; use double operands when precision is required.',
    'Short-circuit operators (&&, ||) skip unnecessary evaluations, preventing NullPointerExceptions.',
    'Binary Numeric Promotion converts byte/short/char to int before arithmetic—explicit cast needed to store back.',
    'The == operator on objects checks pointer identity; use .equals() for content comparison.',
    'Bitwise shifts (<<, >>, >>>) provide single-cycle multiplication/division by powers of 2.'
  ],
  'If you want to use a big terminal on your own computer instead of the built-in one, please read Lesson 1 for full JDK setup instructions.'
),

// ==========================================
// LESSON 4: CONTROL FLOW & MODERN SWITCH EXPRESSIONS
// ==========================================
L(
  'java-04', 4, 'Control Flow & Modern Switch Expressions', '🔀',
  '🔀 Programs that execute the same path every time are calculators. Programs that make decisions are intelligence. Control flow structures—if/else branches, ternary expressions, and switch statements—give your code the ability to fork, choose, and adapt based on runtime data. Modern Java (14+) revolutionized the switch statement into a powerful expression that returns values, eliminates fall-through bugs, and supports pattern matching. This lesson bridges classic branching logic with cutting-edge language features that make your code both safer and more expressive.',
  [
    {
      title: '1. if / else if / else Branching',
      beginner: 'An if statement checks a true/false condition. If true, it executes the code block inside {}. If false, it checks the next else if, or falls through to the else default. You can chain as many else if blocks as needed, but Java executes ONLY the first matching branch—it does not check the rest once a match is found.',
      advanced: 'Conditional branching compiles to ifeq/ifne/if_icmp* bytecode instructions followed by goto jumps. The JVM evaluates conditions sequentially; ordering matters for performance (place most-likely-true conditions first). Deeply nested if-else chains (>3 levels) are an anti-pattern—refactor using early returns (guard clauses) or polymorphism. The ternary operator (condition ? a : b) compiles to the same bytecode as if-else but is restricted to expressions (no statements). Java does NOT have truthy/falsy values—only boolean expressions are valid in conditions.'
    },
    {
      title: '2. The Ternary Operator (?:)',
      beginner: 'The ternary operator is a one-line shorthand for simple if-else assignments. It looks like: result = (condition) ? valueIfTrue : valueIfFalse; If the condition is true, result gets the first value; otherwise, it gets the second. It is perfect for quick assignments but should NOT be nested more than one level deep (readability suffers).',
      advanced: 'The ternary operator (conditional expression, JLS §15.25) is a true expression that yields a value (unlike if-else which is a statement). Both branches must have compatible types—the compiler determines the result type via numeric promotion or reference type unification. Example: int max = (a > b) ? a : b; compiles to identical bytecode as if-else. Nested ternaries are legal but strongly discouraged. The ternary cannot contain void method calls, throw statements, or multi-statement blocks. For complex logic, use switch expressions (Java 14+) which support yield for multi-statement branches.'
    },
    {
      title: '3. Switch Expressions (Java 14+: Arrow Syntax & yield)',
      beginner: 'When comparing one value against many options, switch is cleaner than chaining if statements. Modern Java (14+) lets you use arrow syntax: case "ADMIN" -> "Full Access"; This RETURNS a value directly and NEVER falls through to the next case. No more forgetting break statements and accidentally running multiple cases!',
      advanced: 'Switch expressions (JEP 361, finalized in Java 14) transform switch from a statement into an expression that yields a value. Arrow syntax (case X ->) eliminates fall-through entirely—no break needed. For multi-statement blocks, use yield: case "MANAGER" -> { log(); yield "Partial Access"; }. The compiler enforces exhaustiveness: all possible inputs MUST be covered (or include default). Switch expressions work with: byte, short, char, int, their wrappers, String, enum types, and (Java 21+) pattern matching for sealed types. The legacy colon syntax (case X:) still exists but permits fall-through and requires explicit break/yield.'
    },
    {
      title: '4. Pattern Matching in Switch (Java 21+)',
      beginner: 'Java 21 introduced a revolutionary upgrade: switch can now check TYPES, not just values! Instead of writing if (obj instanceof String) { String s = (String) obj; ... }, you can write case String s -> s.length(); inside a switch. This eliminates manual casting chains and makes polymorphic code dramatically cleaner.',
      advanced: '(Expert Teaser) Pattern matching for switch (JEP 441, Java 21) allows type patterns (case String s), record patterns (case Point(int x, int y)), and guard patterns (case Integer i when i > 0). The compiler generates optimized instanceof checks and automatic cast bindings. Combined with sealed classes (JEP 409), the compiler can verify exhaustiveness without a default branch—if you add a new subclass to a sealed hierarchy, the compiler FORCES you to handle it in every switch. This is the foundation of algebraic data types in Java. In the Expert track, we explore how sealed interfaces + pattern matching replace the Visitor pattern and enable compiler-verified state machines.'
    },
    {
      title: '5. JVM Bytecode: tableswitch vs lookupswitch',
      beginner: 'Behind the scenes, the compiler chooses one of two strategies for switch. If your cases are consecutive numbers (1, 2, 3, 4, 5), it builds a direct lookup table—instant access, like an array index. If your cases are scattered (1, 100, 9999), it builds a search structure that checks each possibility.',
      advanced: 'javac emits tableswitch for dense, contiguous integer keys (O(1) direct index lookup via base+offset) and lookupswitch for sparse keys (O(n) linear scan of key-offset pairs, sorted for potential binary search). String switches compile to a two-phase process: first, switch on hashCode() (using tableswitch/lookupswitch), then verify with .equals() to handle collisions. Enum switches compile to ordinal()-based tableswitch. The JIT compiler may further optimize by converting lookupswitch to a balanced binary search or replacing the entire switch with a polymorphic call site (invokevirtual with vtable dispatch). Understanding bytecode emission helps explain why dense int switches outperform String switches.'
    }
  ],
  {
    title: 'Decision Engine & Status Handler',
    intro: '⚠️ NOTE: Build an application status mapper using if-else trees, ternary operators, and modern Java switch expressions with arrow syntax and yield.',
    steps: [
      'Create a file named `DecisionEngine.java` with the standard public class and main method boilerplate.',
      'Declare an HTTP status code: `int code = 404;`.',
      'Build a modern switch EXPRESSION that returns a String: `String status = switch(code) { case 200 -> "OK"; case 404 -> "Not Found"; case 500 -> "Server Error"; default -> "Unknown Status"; };`. Print the result.',
      'Test multi-statement yield: `String detail = switch(code) { case 404 -> { System.out.println("Logging 404..."); yield "Resource missing"; } default -> { yield "No details"; } };`. Print detail.',
      'Test ternary: `String level = (code >= 500) ? "CRITICAL" : "STANDARD";`. Print level.',
      'Test if-else chain: Write an if/else if/else block that categorizes codes into ranges (2xx=Success, 4xx=Client Error, 5xx=Server Error).',
      'Compile: `javac DecisionEngine.java`. Execute: `java DecisionEngine`. Verify all outputs match expected values.'
    ],
    goal: 'You implemented conditional execution using if-else trees, ternary expressions, and modern arrow-syntax switch expressions with yield for multi-statement blocks.'
  },
  [
    q('Which switch syntax prevents accidental fall-through without requiring break statements?', ['Legacy colon syntax (case X:)', 'Arrow syntax (case X ->)', 'while-case syntax', 'if-case syntax'], 1, 'Arrow syntax (case X ->) executes ONLY the matching branch and exits immediately. Fall-through is structurally impossible. Why others are wrong: Legacy colon syntax REQUIRES break/yield to prevent fall-through. while-case and if-case do not exist in Java.'),
    q('What keyword emits a value from a multi-statement block inside a switch expression?', ['return', 'yield', 'emit', 'break'], 1, 'The yield keyword is used inside switch expression blocks to return a value to the enclosing expression. Why others are wrong: return exits a method entirely. emit does not exist in Java. break exits a switch statement but does not yield a value in expression context.'),
    q('What bytecode instruction does javac generate for dense contiguous integer switch keys?', ['lookupswitch', 'tableswitch', 'goto_table', 'branch_map'], 1, 'tableswitch provides O(1) direct-indexed lookup for dense keys (e.g., case 0,1,2,3,4). Why others are wrong: lookupswitch is for SPARSE keys. goto_table and branch_map are not real JVM instructions.'),
    q('What is the correct ternary operator syntax in Java?', ['(condition) ? trueVal : falseVal', 'if (condition) -> trueVal else falseVal', 'check(condition) { trueVal | falseVal }', '(condition) :: trueVal : falseVal'], 0, 'The ternary follows (condition) ? expressionIfTrue : expressionIfFalse. Why others are wrong: Java has no if->else expression syntax. check() is not a keyword. :: is the method reference operator, not a conditional.'),
    q('What happens if a switch expression is missing a case and has no default branch?', ['It returns null automatically', 'Compilation error: switch expression must be exhaustive', 'Runtime SwitchException', 'It silently skips the unmatched value'], 1, 'Switch expressions MUST be exhaustive—all possible input values must be covered, or a default branch must exist. The compiler enforces this at build time. Why others are wrong: It does not return null, throw runtime exceptions, or silently skip. It is a hard compilation error.')
  ],
  [
    'Use if-else for range checks; use switch expressions for discrete multi-value matching.',
    'Modern switch expressions (case X ->) eliminate fall-through bugs without break statements.',
    'The yield keyword returns values from multi-statement switch expression blocks.',
    'The ternary operator (?:) provides inline shorthand for simple binary decisions.',
    'Java 21 pattern matching in switch eliminates manual instanceof + cast chains.'
  ],
  'If you want to use a big terminal on your own computer instead of the built-in one, please read Lesson 1 for full JDK setup instructions.'
),

// ==========================================
// LESSON 5: LOOPS, ITERATION & THE ENHANCED FOR-LOOP
// ==========================================
L(
  'java-05', 5, 'Loops, Iteration & The Enhanced For-Loop', '🔁',
  '🔁 Repetition is the heartbeat of computation. Loops allow you to process millions of data items, scan multi-dimensional grids, and repeat operations until a goal is achieved. Java provides four distinct loop structures—each optimized for different scenarios. But beyond syntax, understanding how the JVM optimizes loops (unrolling, vectorization, branch prediction) and how the enhanced for-each loop connects to the Iterable interface reveals the engineering depth beneath simple repetition.',
  [
    {
      title: '1. for Loops & Step Counters',
      beginner: 'A for loop is ideal when you know exactly how many times to repeat. It has three parts: initialization (start), condition (keep going?), and update (step forward). Example: for (int i = 0; i < 10; i++) starts at 0, continues while i < 10, and adds 1 each time. The counter variable i lives ONLY inside the loop.',
      advanced: 'Standard for(init; condition; update) compiles to: init → conditional branch (if_icmpge/if_icmpgt) → body → update → goto (loop back). The loop variable\'s scope is bounded to the for statement. HotSpot JIT applies aggressive loop optimizations: loop unrolling (duplicating body to reduce branch overhead), loop peeling (extracting first/last iterations for null-check elimination), range check elimination (for array access), and vectorization (converting scalar operations to SIMD instructions via the Vector API). The JIT uses loop profiling to determine trip counts and select optimal strategies.'
    },
    {
      title: '2. while & do-while Loops',
      beginner: 'A while loop checks its condition FIRST—if false from the start, the body NEVER runs. A do-while loop runs the body FIRST, then checks—guaranteeing at least ONE execution. Use while when you might not need to run at all (like reading until EOF). Use do-while when you must run at least once (like a menu that must display before asking to exit).',
      advanced: 'while(condition) { body } compiles to: condition check → body → goto (loop back). do { body } while(condition) compiles to: body → condition check → conditional branch (loop back). The structural difference is the placement of the conditional branch instruction: while uses ifeq/ifne at the TOP, do-while uses it at the BOTTOM. Both support break/continue. The JIT applies the same optimizations as for loops. In practice, while(true) with internal break is the idiomatic pattern for event loops, server listeners, and REPL implementations. Always include Thread.sleep() or I/O blocking in infinite loops to prevent CPU saturation.'
    },
    {
      title: '3. Enhanced for-each Loop & The Iterable Interface',
      beginner: 'The enhanced for loop (for (String item : collection)) is a clean shorthand for iterating over arrays and collections without managing index counters. It reads naturally: "for each item in this collection, do something." But it is not magic—under the hood, it uses an Iterator that tracks position.',
      advanced: 'The enhanced for loop (JLS §14.14.2) desugars differently based on target type: For arrays: compiles to index-based for loop with length caching. For Iterable collections: compiles to Iterator pattern—calls collection.iterator(), then loops with hasNext()/next(). This means: (1) You CANNOT modify the collection structure during iteration (ConcurrentModificationException). (2) You CANNOT access the index counter. (3) Custom classes can support for-each by implementing Iterable<T> and returning an Iterator. The Iterator pattern enables lazy evaluation—elements are produced on-demand, not pre-computed. This is the foundation for Stream API pipelines and lazy database cursors.'
    },
    {
      title: '4. break, continue & Labeled Jumps',
      beginner: 'Use break to instantly EXIT a loop. Use continue to SKIP the rest of the current iteration and jump to the next one. For nested loops, you can LABEL the outer loop and use break labelName; to escape from deep inside. Think of labels as named exit doors—break exits through the nearest door unless you specify which one.',
      advanced: 'break exits the innermost loop (or labeled loop). continue skips to the update phase of the innermost loop (or labeled loop). Labels are identifiers followed by colon (outer:) placed before any statement. Labeled break compiles to a goto targeting the instruction AFTER the labeled block. Labeled continue compiles to a goto targeting the UPDATE expression of the labeled loop. Java does NOT have goto (it is a reserved keyword but unused). Labels provide structured equivalents for multi-level exits. In bytecode, all loops compile to combinations of goto and conditional branches—there is no dedicated "loop" instruction. The JIT may optimize labeled breaks by eliminating dead code paths.'
    },
    {
      title: '5. Loop Performance & JIT Optimizations',
      beginner: 'Not all loops are equally fast! Looping over an ArrayList by index is faster than using an Iterator for simple access. Looping over arrays is faster than collections because arrays have no method call overhead. And the JIT compiler can unroll small loops, process multiple items per iteration, or even eliminate the loop entirely if the result is predictable.',
      advanced: '(Expert Teaser) The JIT compiler applies a hierarchy of loop optimizations: (1) Loop unrolling—duplicating body N times to reduce branch overhead (effective for trip counts < 8). (2) Loop vectorization—converting scalar operations to SIMD (Single Instruction Multiple Data) using AVX2/AVX-512 instructions. (3) Range check elimination—proving array indices are always in-bounds, removing per-access checks. (4) Loop-invariant code motion—hoisting computations outside the loop. (5) Loop peeling—handling first/last iterations separately to enable optimizations. The C2 compiler uses Ideal Graph representation and iterative GVN (Global Value Numbering) to detect optimization opportunities. In the Expert track, we explore the Java Vector API (Project Panama) for explicit SIMD programming and JMH (Java Microbenchmark Harness) for scientific loop performance measurement.'
    }
  ],
  {
    title: 'The Java FizzBuzz & Matrix Scanner',
    intro: '⚠️ NOTE: Build the classic FizzBuzz algorithm using for loops, then scan a 2D matrix using nested loops with labeled break statements to demonstrate advanced loop control.',
    steps: [
      'Create a file named `LoopSandbox.java` with the standard public class and main method boilerplate.',
      'Write the FizzBuzz for loop: Iterate from 1 to 15. If divisible by both 3 and 5, print "FizzBuzz". If by 3 only, print "Fizz". If by 5 only, print "Buzz". Otherwise, print the number.',
      'Add a 2D matrix: `int[][] grid = {{1, 2, 3}, {4, 99, 6}, {7, 8, 9}};`.',
      'Write a nested loop to scan the grid. Label the OUTER loop: `outer:` before the outer for.',
      'Inside the inner loop, check: `if (grid[i][j] == 99) { System.out.println("Found 99 at [" + i + "," + j + "]"); break outer; }`.',
      'After the labeled break, print "Search complete" to prove execution exited BOTH loops.',
      'Add an enhanced for-each loop: `for (int[] row : grid) { for (int val : row) { System.out.print(val + " "); } System.out.println(); }` to print the full grid.',
      'Compile: `javac LoopSandbox.java`. Execute: `java LoopSandbox`. Verify FizzBuzz output and matrix scan results.'
    ],
    goal: 'You executed iterative counting loops, managed loop escape with labeled break, and iterated multi-dimensional arrays using both indexed and enhanced for-each patterns.'
  },
  [
    q('Which loop structure guarantees its body executes at least once?', ['for loop', 'while loop', 'do-while loop', 'enhanced for-each loop'], 2, 'do-while checks the condition AFTER executing the body, guaranteeing minimum one pass. Why others are wrong: for and while check conditions BEFORE the first iteration (body may never run). Enhanced for-each requires a non-empty collection.'),
    q('What does the continue keyword do inside a loop?', ['Terminates the entire program', 'Skips the remaining statements in the current iteration and jumps to the next iteration', 'Restarts the loop from index zero', 'Pauses execution for 1 second'], 1, 'continue immediately transfers control to the loop\'s update expression (for) or condition check (while/do-while), skipping the rest of the current body. Why others are wrong: It does NOT terminate the program (that is System.exit). It does not reset the counter. It does not pause.'),
    q('How do you break out of an OUTER parent loop from inside a nested inner loop?', ['Call System.exit(0)', 'Use a labeled break: break outerLabel;', 'Write break break;', 'Set all loop counters to -1'], 1, 'Labeled break (break labelName;) transfers execution to the instruction immediately AFTER the labeled loop block, exiting all nested levels at once. Why others are wrong: System.exit kills the entire JVM. "break break" is invalid syntax. Setting counters is unreliable and does not guarantee exit.'),
    q('What does the enhanced for loop (for (Type item : collection)) use internally for Iterable objects?', ['Direct array indexing', 'The Iterator pattern (hasNext/next method calls)', 'Java Reflection API', 'Native OS file descriptors'], 1, 'For Iterable collections, the enhanced for desugars to: Iterator it = collection.iterator(); while(it.hasNext()) { Type item = it.next(); ... }. Why others are wrong: Array indexing is only for actual arrays. Reflection and file descriptors are unrelated to iteration.'),
    q('What JIT optimization duplicates loop bodies to reduce branch instruction overhead?', ['Garbage collection inlining', 'Loop unrolling', 'Bytecode deletion', 'Thread sleeping'], 1, 'Loop unrolling replicates the loop body N times, reducing the number of conditional branch instructions (if_icmpge) and enabling better CPU pipeline utilization. Why others are wrong: GC inlining is unrelated. Bytecode deletion is not an optimization. Thread sleeping is a concurrency operation.')
  ],
  [
    'Choose for for bounded iterations, while for condition-driven loops, do-while for guaranteed single execution.',
    'The enhanced for-each loop uses Iterator internally for collections; direct indexing for arrays.',
    'Use break to exit loops; use continue to skip iterations; use labeled break for nested exits.',
    'Binary Numeric Promotion applies inside loops: byte arithmetic produces int results.',
    'The JIT compiler applies loop unrolling, vectorization, and range-check elimination for performance.'
  ],
  'If you want to use a big terminal on your own computer instead of the built-in one, please read Lesson 1 for full JDK setup instructions.'
),

L(
  'java-06', 6, 'Methods, Recursion & The Call Stack', '🛠️',
  '🛠️ Methods are the fundamental units of computation in Java. Every method call is a precise, choreographed dance of stack frame allocation, parameter passing, and value return. Understanding how the JVM physically manages method execution — from stack frames to return addresses — transforms you from someone who writes functions into someone who engineers computation. This lesson reveals the hidden mechanics beneath every method call: Pass-by-Value guarantees, overloading resolution, and the recursive call stack that powers everything from Fibonacci sequences to file system traversals.',
  [
    {
      title: '1. Method Anatomy & Signature Design',
      beginner: 'A method is a reusable block of code that performs a specific task. It has a name, accepts inputs (parameters), executes logic, and can return a result. The signature consists of the method name and parameter list. Java requires you to declare the return type: int, String, boolean, or void (meaning nothing is returned). Every method lives inside a class.',
      advanced: 'A method definition specifies: access modifiers (public, private, protected, default), optional modifiers (static, final, abstract, synchronized), return type, method name, parameter list (zero or more typed parameters), optional throws clause for checked exceptions, and the method body enclosed in braces. The method signature (used for overloading resolution) is ONLY the name + parameter types/order. Return type, access modifiers, and throws clauses are NOT part of the signature. The JVM stores method bytecode in Metaspace and generates invokestatic/invokevirtual/invokeinterface/inokespecial bytecode instructions depending on the call type.'
    },
    {
      title: '2. Pass-by-Value: Java\'s Sacred Rule',
      beginner: 'Java passes ALL arguments by value — always, without exception. When you pass a primitive (int, double), Java copies the number. When you pass an object, Java copies the REFERENCE (the memory address pointing to the object), NOT the object itself. This means you can modify the object\'s contents inside a method, but you cannot change which object the original reference points to.',
      advanced: 'Java enforces strict Pass-by-Value semantics (JLS §8.4.1, §15.12). For primitives: the raw value bits are copied into the callee\'s stack frame slot. For references: the reference value (compressed oop, typically 4 bytes) is copied. The callee receives a COPY of the pointer, not the original variable. This means: (1) Reassigning the parameter inside the method does NOT affect the caller\'s reference. (2) Mutating the object through the copied reference DOES affect the shared object. This distinction is the #1 interview question and the source of countless "why didn\'t my object update?" bugs. There is NO pass-by-reference in Java. Period.'
    },
    {
      title: '3. Method Overloading (Compile-Time Polymorphism)',
      beginner: 'You can create multiple methods with the same name as long as their parameter lists are different (different number of parameters, different types, or different order). This is called Method Overloading. Java decides which method to call at COMPILE TIME based on the arguments you pass. Changing only the return type is NOT a valid overload — it causes a compilation error.',
      advanced: 'Method overloading (static polymorphism) is resolved at compile time by javac based on the method signature: name + parameter count/types/order. The compiler performs overload resolution using three phases: (1) exact match, (2) widening (subtyping), (3) boxing/unboxing, (4) varargs. Ambiguous overloads cause compile errors. Return type is NOT part of the signature, so void process(int x) and int process(int x) are DUPLICATE method errors. The JVM stores overloaded methods as separate entries in the method table, distinguished by descriptor strings like (I)V vs (I)I.'
    },
    {
      title: '4. The Call Stack & Stack Frames',
      beginner: 'Every time a method is called, Java creates a new "stack frame" — a small memory block that holds the method\'s local variables, parameters, and a return address (where to go when done). Frames are stacked on top of each other. When a method finishes, its frame is popped off and execution returns to the caller. This is the Call Stack.',
      advanced: 'Each method invocation allocates a JVM Stack Frame on the thread-local execution stack. A frame contains: (1) Local Variable Array — indexed slots storing parameters and local variables (slot 0 is this for instance methods). (2) Operand Stack — working area for bytecode computation. (3) Frame Data — constant pool reference, return address, exception handler table. The default thread stack size is ~512KB (configurable via -Xss). Each frame consumes ~100-200 bytes. This means a thread can support roughly 2,000-5,000 nested method calls before StackOverflowError. The JIT compiler performs escape analysis to eliminate heap allocation for objects that don\'t escape the method.'
    },
    {
      title: '5. Recursion & Stack Overflow Mechanics',
      beginner: 'A recursive method is a method that calls itself. To prevent infinite execution, every recursive method MUST have a base case — a condition that stops the recursion. Without a base case, the method keeps calling itself until the stack runs out of memory, causing a StackOverflowError. Think of it like stacking plates — eventually, you run out of space.',
      advanced: '(Expert Teaser) Recursive calls allocate a new stack frame for each invocation. Without a reachable base case, frames accumulate until the thread stack is exhausted, triggering StackOverflowError (NOT OutOfMemoryError — the heap is fine; the stack is full). Tail call optimization (TCO) is NOT implemented in HotSpot JVM, so even tail-recursive functions consume O(n) stack frames. For deep recursion (>5,000 levels), convert to iterative loops or use explicit stack data structures. In the Expert track, we explore how the GraalVM compiler performs partial escape analysis and scalar replacement to optimize recursive object allocation, and how Project Loom\'s virtual threads change the stack overflow calculus by using heap-allocated continuations instead of OS thread stacks.'
    }
  ],
  {
    title: '🛠️ Mini-Project: Interactive CLI Calculator & Recursive Engine',
    intro: '⚠️ NOTE: Build a production-grade modular command-line calculator supporting standard operations, division-by-zero safety, and recursive factorial calculation to demonstrate Pass-by-Value, overloading, and call stack mechanics.',
    steps: [
      'Create a file named CommandLineCalculator.java with the standard public class and main method boilerplate.',
      'Import java.util.Scanner for interactive input: import java.util.Scanner;',
      'Implement modular static methods: public static double add(double a, double b), public static double subtract(double a, double b), public static double multiply(double a, double b), public static double divide(double a, double b).',
      'Add division safety: In divide(a, b), check if (b == 0) and return Double.NaN or print "Error: Division by zero" instead of crashing.',
      'Implement method overloading: Create public static double calculate(double a, double b) and public static double calculate(double a, double b, String operation) to demonstrate compile-time polymorphism.',
      'Implement a recursive factorial method: public static long factorial(int n) { if (n <= 1) return 1; return n * factorial(n - 1); }. Note the base case (n <= 1) that stops recursion.',
      'In main, create a Scanner, prompt the user for two numbers and an operation, call the appropriate method, and print the result.',
      'Test factorial: Call factorial(10) and print the result (3628800). Then call factorial(20) to see how recursion handles deeper stacks.',
      'Compile and execute: javac CommandLineCalculator.java && java CommandLineCalculator.',
      'BONUS: Call factorial(5000) and observe the StackOverflowError. This proves that each recursive call allocates a stack frame.'
    ],
    goal: 'You successfully designed a modular CLI tool using clean method structures, demonstrated Pass-by-Value guarantees, implemented method overloading, and executed recursive algorithms with base cases.'
  },
  [
    q('How does Java handle parameter passing when passing variables into methods?', ['It passes primitives by value and objects by reference', 'It passes strictly EVERYTHING by value (copies of primitives or copies of reference addresses)', 'It uses dynamic memory pointers for all parameters', 'It passes parameters via host OS register locations'], 1, 'Java strictly enforces Pass-by-Value. Primitives pass value copies; objects pass reference address copies. You CANNOT change which object the caller\'s reference points to. Why others are wrong: Java does NOT pass objects by reference. There are no C-style pointers. Parameters are not passed via OS registers.'),
    q('What happens if a recursive method lacks a valid terminating base case?', ['It completes instantly with default zero values', 'It runs indefinitely without memory overhead', 'It exhausts execution stack memory and throws a StackOverflowError', 'The compiler automatically fixes the missing logic'], 2, 'Unterminated recursion pushes infinite frames onto the call stack until the thread stack is exhausted, triggering StackOverflowError. Why others are wrong: It does NOT complete instantly. It DOES have memory overhead (each call allocates a frame). The compiler does not fix logic errors.'),
    q('Which of the following creates a valid method overload for public void compute(int x)?', ['public int compute(int x) (changing return type only)', 'public void compute(int x, double y) (adding a parameter)', 'private void compute(int x) (changing access modifier only)', 'public void compute(int value) (changing variable name only)'], 1, 'Method overloading requires altering parameter signature counts, sequences, or types. Adding a double parameter creates a new signature. Why others are wrong: Changing return type alone is a DUPLICATE method error. Changing access modifier alone is invalid. Changing variable names does not change the signature.'),
    q('What stack structure is created on the execution stack whenever a method is called?', ['Heap Object Pointer', 'Metaspace Binary Buffer', 'Stack Frame containing local variables, operand stack, and return address', 'Garbage Collector Array'], 2, 'Each method call allocates an isolated Stack Frame on the thread-local JVM stack containing local variable slots, operand stack, and frame data (return address, exception handlers). Why others are wrong: Heap stores objects, not method frames. Metaspace stores class metadata. GC does not allocate per-method structures.'),
    q('What is the maximum recursion depth before StackOverflowError on a default JVM thread stack?', ['Exactly 100 calls', 'Unlimited (Java auto-expands the stack)', 'Approximately 2,000-5,000 calls depending on frame size and -Xss setting', 'Exactly 1,000,000 calls'], 2, 'The default thread stack size is ~512KB. Each frame consumes ~100-200 bytes, yielding roughly 2,000-5,000 recursive calls before overflow. Configurable via -Xss. Why others are wrong: There is no fixed limit of 100 or 1,000,000. Java does NOT auto-expand the stack — it throws StackOverflowError.')
  ],
  [
    'Methods encapsulate code into reusable units with declared parameters and return types.',
    'Java passes ALL arguments strictly by value — primitives copy values, objects copy references.',
    'Method overloading is resolved at compile time based on parameter signatures (count/types/order).',
    'Every method call allocates a stack frame; recursion without base cases causes StackOverflowError.',
    'The method signature is name + parameter list; return type is NOT part of the signature.'
  ],
  'If you want to use a big terminal on your own computer instead of the built-in one, please read Lesson 1 for full JDK setup instructions.'
),

// ==========================================
// LESSON 7: CLASSES, OBJECTS & CONSTRUCTORS
// ==========================================
L(
  'java-07', 7, 'Classes, Objects & Constructors', '🏗️',
  '🏗️ Object-Oriented Programming begins here. A class is a blueprint; an object is a living instance built from that blueprint. Every object you create with the new keyword triggers a precise sequence of memory allocation, constructor invocation, and field initialization on the JVM Heap. Understanding this lifecycle — from ClassLoader metadata to Heap allocation to Garbage Collection eligibility — is the foundation of all Java engineering. This lesson reveals how objects are born, how constructors chain, and how the this reference connects you to the current instance.',
  [
    {
      title: '1. Classes as Blueprints & Object State/Behavior',
      beginner: 'A class is a template that defines what an object knows (fields/attributes) and what it can do (methods/behavior). For example, a Car class has fields like model, speed, and engineRunning, and methods like startEngine() and accelerate(). An object is a specific instance: myCar = new Car() creates a real, usable car in memory.',
      advanced: 'A class definition is stored in Metaspace as runtime metadata: field descriptors, method bytecode, constant pool references, and access flags. When you execute new Car(), the JVM: (1) allocates memory on the Heap for the object (header + fields). (2) Initializes fields to default values (0, null, false). (3) Executes the constructor to set initial state. (4) Returns a reference (pointer) to the heap location. Object state lives in instance fields on the Heap; behavior (methods) lives in Metaspace and is shared across all instances. The object header (12-16 bytes) contains: mark word (hashcode, GC age, lock status), class pointer (compressed oop), and array length (for arrays).'
    },
    {
      title: '2. Default vs Parameterized Constructors',
      beginner: 'Constructors are special methods that run automatically when you create an object with new. They have the same name as the class and NO return type. If you don\'t write any constructor, Java secretly provides a default no-argument constructor that sets fields to default values (0, null, false). Parameterized constructors let you pass initial values: new Car("Tesla", 100).',
      advanced: 'If no explicit constructor is declared, javac auto-generates an implicit public no-arg constructor that calls super() (the parent class constructor) and initializes fields to JVM defaults. Once you declare ANY constructor (even private), the implicit default is NOT generated. Parameterized constructors enable dependency injection at construction time. Constructor bytecode is invoked via the invokespecial instruction (NOT invokevirtual), ensuring the exact constructor is called without dynamic dispatch. Constructors cannot be inherited, overridden, or called directly — they are ONLY invoked via new or this()/super() chaining.'
    },
    {
      title: '3. Constructor Chaining (this() and super())',
      beginner: 'Constructors can call other constructors using this(...). This is called constructor chaining — it lets you build complex constructors by reusing simpler ones. The call to this(...) or super(...) MUST be the very first line of the constructor. You cannot have both this() and super() in the same constructor.',
      advanced: 'Constructor chaining resolves the initialization sequence: this(...) delegates to another constructor in the SAME class; super(...) delegates to the PARENT class constructor. The JVM enforces that the first statement of every constructor is either this(...) or super(...) — if neither is written, the compiler inserts super() implicitly. This creates a chain that ultimately reaches java.lang.Object\'s constructor. The bytecode instruction invokespecial handles constructor delegation. Violating the "first line" rule causes a compilation error: "call to this/super must be first statement in constructor."'
    },
    {
      title: '4. The this Reference',
      beginner: 'The this keyword refers to the current object — the specific instance that is executing the code. It resolves name conflicts: if a parameter has the same name as a field, this.fieldName refers to the instance field, while the plain name refers to the parameter. It also enables constructor chaining: this(value).',
      advanced: 'The this reference is an implicit parameter passed to every instance method and constructor. In bytecode, it occupies local variable slot 0 (slot 0 in the method frame). this.fieldName compiles to getfield instruction with the objectref from slot 0. this.method() compiles to invokevirtual/invokeinterface. Static methods do NOT receive this — they have no implicit instance reference, which is why static methods cannot access instance fields directly. The this reference is also used for fluent API design: return this; enables method chaining like builder.setName("x").setAge(30).build().'
    },
    {
      title: '5. Object Lifecycle & Memory Identity',
      beginner: 'Objects are born with new, live on the Heap, and die when no references point to them anymore. Two variables can point to the SAME object — modifying through one affects the other. Use == to check if two references point to the same object (identity), and .equals() to check if they have the same content (equality).',
      advanced: '(Expert Teaser) Object lifecycle: (1) ClassLoader loads class metadata into Metaspace. (2) new allocates heap memory (TLAB — Thread-Local Allocation Buffer for thread safety). (3) Constructor executes, initializing fields. (4) Object lives, referenced by stack variables, collection entries, or other objects. (5) When unreachable from GC Roots, object becomes eligible for garbage collection. Identity comparison (==) checks if two references point to the exact same heap address (pointer equality). Structural equality (.equals()) checks content. The default Object.equals() implementation IS == (identity). Classes like String, Integer, ArrayList override equals() for value comparison. In the Expert track, we explore how the JVM\'s escape analysis can allocate objects on the stack instead of the heap when they don\'t escape the method, and how compressed oops reduce reference size from 8 bytes to 4 bytes.'
    }
  ],
  {
    title: '🛠️ Mini-Project: Interactive Car Assembly & Diagnostics System',
    intro: '⚠️ NOTE: Build a class-based Java application that instantiates custom objects using default and parameterized constructors, demonstrates constructor chaining, manipulates state via methods, and uses the this keyword for field assignment.',
    steps: [
      'Create a file named CarDiagnostics.java with the standard public class and main method boilerplate.',
      'Define a Car class with private fields: String model, int speed, boolean engineRunning.',
      'Implement a default constructor: public Car() { this("Unknown", 0); } — note how it chains to the parameterized constructor using this().',
      'Implement a parameterized constructor: public Car(String model, int speed) { this.model = model; this.speed = speed; this.engineRunning = false; } — note how this resolves the name conflict between parameter and field.',
      'Add methods: public void startEngine() { this.engineRunning = true; System.out.println(model + " engine started!"); }, public void accelerate(int value) { if (engineRunning) { this.speed += value; System.out.println(model + " speed: " + this.speed); } else { System.out.println("Start engine first!"); } }.',
      'Add a diagnostics method: public String getDiagnostics() { return "Model: " + model + ", Speed: " + speed + ", Engine: " + (engineRunning ? "ON" : "OFF"); }.',
      'In main, instantiate multiple Car instances: Car car1 = new Car(); Car car2 = new Car("Tesla", 50); Car car3 = new Car("BMW", 0);.',
      'Call methods: car2.startEngine(); car2.accelerate(30); System.out.println(car2.getDiagnostics());.',
      'Demonstrate reference semantics: Car car4 = car2; car4.accelerate(10); System.out.println(car2.getDiagnostics()); — observe that car2\'s speed ALSO increased (both point to the same object).',
      'Compile and execute: javac CarDiagnostics.java && java CarDiagnostics.'
    ],
    goal: 'You successfully modeled real-world entities into reusable Java classes, initialized state with chained constructors, resolved name conflicts with this, and demonstrated reference identity semantics.'
  },
  [
    q('What happens if you do not define any constructors inside a Java class?', ['The code fails to compile', 'The JVM generates a runtime exception when instantiated', 'The Java compiler provides an implicit default no-argument constructor', 'Objects can no longer be instantiated with the new keyword'], 2, 'If no explicit constructor is declared, javac injects an implicit no-arg default constructor that calls super() and initializes fields to defaults. Why others are wrong: It compiles fine. No runtime exception. You CAN still use new — the implicit constructor is invoked.'),
    q('What is the primary function of the this keyword in Java?', ['It allocates new memory on the JVM stack', 'It refers to the current executing instance of a class (occupies slot 0 in the stack frame)', 'It prevents classes from being extended by subclasses', 'It allows calling static methods inside abstract classes'], 1, 'The this keyword represents an explicit memory handle pointing to the current object instance. It occupies local variable slot 0 in instance methods and constructors. Why others are wrong: It does not allocate memory. It does not prevent inheritance (that is final). It has nothing to do with static methods.'),
    q('Where is object instance state data stored in JVM memory during execution?', ['In Metaspace memory', 'Inside local thread register stack frames', 'On the Heap memory', 'Inside CPU cache blocks'], 2, 'Objects and their instance fields are allocated dynamically on the JVM Heap memory. Metaspace stores class metadata. Stack frames store local variables and method state. Why others are wrong: Heap is the ONLY location for object instance data. Metaspace is for class definitions, not instances.'),
    q('Where must a this() or super() call be placed inside a constructor?', ['Anywhere in the constructor body', 'On the very first executable line of the constructor', 'At the end of the constructor', 'Inside a try-catch block'], 1, 'The JVM enforces that this(...) or super(...) must be the FIRST statement in a constructor. This ensures the parent/sibling constructor completes before the current constructor\'s logic executes. Why others are wrong: It cannot be anywhere, at the end, or inside try-catch. Violation causes a compilation error.'),
    q('If Car a = new Car("Tesla"); Car b = a; b.speed = 100;, what is a.speed?', ['0 (unchanged)', '100 (both references point to the same object)', 'Compilation error', 'Runtime NullPointerException'], 1, 'Assignment b = a copies the REFERENCE (pointer), not the object. Both a and b point to the identical heap object. Mutating through b is visible through a. Why others are wrong: Primitives copy values, but references copy pointers. No compilation error. No NPE — the object exists.')
  ],
  [
    'Classes are blueprints stored in Metaspace; objects are instances allocated on the Heap.',
    'Constructors have no return type and are invoked via new; the implicit default constructor is provided only if no constructors are declared.',
    'Constructor chaining via this() or super() must be the first statement in a constructor.',
    'The this keyword refers to the current instance (slot 0) and resolves field/parameter name conflicts.',
    'Reference assignment copies pointers, not objects — use == for identity, .equals() for content.'
  ],
  'If you want to use a big terminal on your own computer instead of the built-in one, please read Lesson 1 for full JDK setup instructions.'
),

// ==========================================
// LESSON 8: ENCAPSULATION & ACCESS MODIFIERS
// ==========================================
L(
  'java-08', 8, 'Encapsulation & Access Modifiers', '🔒',
  '🔒 Encapsulation is the defensive architecture of Object-Oriented Programming. It is the principle of hiding internal state and requiring all interaction through controlled, validated channels. Without encapsulation, any code anywhere can corrupt your object\'s data, violate invariants, and create cascading failures. Access modifiers are the enforcement mechanism — they define visibility boundaries at the bytecode level. Mastering encapsulation, immutability, and defensive copying is what separates fragile prototypes from production-grade systems.',
  [
    {
      title: '1. The Access Modifiers Matrix',
      beginner: 'Java has four visibility levels that control who can see and use your classes, fields, and methods. private: only inside the same class. package-private (no modifier): inside the same package/folder. protected: same package + subclasses in other packages. public: accessible everywhere. Use the MOST restrictive modifier that works — start with private and only expose what\'s necessary.',
      advanced: 'The four access levels map to JVM access flags in the class file: ACC_PRIVATE (0x0002), ACC_PUBLIC (0x0001), ACC_PROTECTED (0x0004), and default (0x0000 — no flag). Visibility is enforced at bytecode verification time by the JVM, not just at compile time. The visibility matrix: private < package-private < protected < public. Top-level classes can only be public or package-private (not private/protected). Nested/inner classes can use all four. Package-private is the DEFAULT when no modifier is specified — this is a common source of accidental exposure.'
    },
    {
      title: '2. Getter/Setter Patterns & Validation Invariants',
      beginner: 'Encapsulation means making fields private and providing public getter (read) and setter (write) methods. The setter can validate input before saving: if (age < 0) throw new IllegalArgumentException("Age cannot be negative"). This protects your object from invalid state. The getter can return defensive copies of mutable objects.',
      advanced: 'Getter/setter methods decouple field representation from operational APIs. Setters enforce validation invariants, state integrity checks, and side-effect controls prior to mutating internal instance state. Getters can perform lazy computation, return defensive copies, or compute derived values. The IDE-generated getter/setter pattern is syntactic boilerplate; modern Java (14+) records automate this for immutable data carriers. For mutable objects, ALWAYS return defensive copies from getters and accept defensive copies in setters to prevent external mutation of internal state.'
    },
    {
      title: '3. Immutability Principles',
      beginner: 'An immutable object cannot be changed after creation. Java Strings are immutable — every "modification" creates a new String. To make your class immutable: (1) Mark the class final (prevent subclassing). (2) Make all fields private final. (3) No setters. (4) Initialize all fields in the constructor. (5) For mutable reference fields, create defensive copies.',
      advanced: 'Immutable class design requires: (1) Declare the class final to prevent subclass method overrides that could expose mutation. (2) Declare all fields private final. (3) Withhold state mutation setters. (4) Perform deep defensive copies for mutable reference types in constructors and getters. (5) Do not expose internal mutable state. Benefits: thread-safety without synchronization, safe sharing in collections, cache-friendly hashcodes, safe use as HashMap keys. Java records (Java 14+) provide concise immutable data carriers. String, Integer, BigDecimal are canonical immutable classes.'
    },
    {
      title: '4. Defensive Copying & Mutable Reference Traps',
      beginner: 'If your class has a field that is a mutable object (like a Date or a List), you must be careful. If you just assign the parameter directly, the caller keeps a reference to your internal object and can modify it! Instead, create a copy: this.date = new Date(date.getTime()). Same for getters — return a copy, not the original.',
      advanced: 'The mutable reference trap: if a class stores a direct reference to a caller-provided mutable object, the caller can mutate the object after construction, violating the class\'s invariants. Defensive copying in constructors: this.list = new ArrayList<>(inputList). Defensive copying in getters: return new ArrayList<>(this.list). For arrays: this.arr = inputArr.clone(). This is mandatory for truly immutable classes containing mutable references. Failure to defensively copy is the #1 security vulnerability in Java (e.g., java.util.Date mutability exploited in early JDK versions).'
    },
    {
      title: '5. Package-Private & Module System Visibility',
      beginner: 'When you write a class without any access modifier, it is package-private — visible only to classes in the same package (folder). This is a powerful tool for hiding implementation details. In Java 9+, the Module System (JPMS) adds another layer: you can control which packages are exported to other modules.',
      advanced: '(Expert Teaser) Package-private (default) visibility is the strongest encapsulation boundary below private. It enables implementation hiding within a package while allowing collaboration between classes in the same package. The Java Platform Module System (JPMS, Java 9+) adds module-level visibility: module-info.java declares exports (which packages are visible to other modules) and requires (which modules are dependencies). Non-exported packages are invisible to other modules even if classes are public. In the Expert track, we explore how strong encapsulation in JPMS enables JDK internals to evolve without breaking applications, and how --add-opens bypasses encapsulation for reflection frameworks like Spring.'
    }
  ],
  {
    title: '🛠️ Mini-Project: Secure User Account & Credential Vault',
    intro: '⚠️ NOTE: Construct an encapsulated user management component enforcing validation rules via setters, creating an immutable user record, and demonstrating defensive copying for mutable reference fields.',
    steps: [
      'Create a file named SecureVault.java with the standard public class and main method boilerplate.',
      'Create a UserAccount class with private fields: String username, String password, double balance, java.util.ArrayList<String> transactionHistory.',
      'Provide public getters. Write a guarded setter: public void setBalance(double amount) { if (amount < 0) throw new IllegalArgumentException("Balance cannot be negative"); this.balance = amount; }.',
      'Demonstrate defensive copying: In the constructor, initialize transactionHistory with new ArrayList<>(initialHistory). In the getter, return new ArrayList<>(this.transactionHistory) instead of the original.',
      'Create an immutable UserRecord class: public final class UserRecord { private final String username; private final int age; public UserRecord(String username, int age) { this.username = username; this.age = age; } public String getUsername() { return username; } public int getAge() { return age; } } — note: final class, final fields, no setters.',
      'In main, instantiate UserAccount, trigger validation on invalid balance updates: try { account.setBalance(-100); } catch (IllegalArgumentException e) { System.out.println("Blocked: " + e.getMessage()); }.',
      'Demonstrate defensive copying: Create a list, pass it to UserAccount, modify the original list, and verify the account\'s internal list is unaffected.',
      'Instantiate UserRecord and verify immutability: attempt to modify (you can\'t — there are no setters).',
      'Compile and execute: javac SecureVault.java && java SecureVault.'
    ],
    goal: 'You built an encapsulated system that enforces strict data validation using visibility controls, immutable class structures, and defensive copying for mutable references.'
  },
  [
    q('Which access modifier restricts field visibility strictly to the declaring class alone?', ['protected', 'package-private', 'private', 'public'], 2, 'private is the most restrictive access modifier, limiting access solely to within the declaring class. It maps to ACC_PRIVATE in the class file. Why others are wrong: protected allows subclass access. package-private allows same-package access. public allows universal access.'),
    q('How do getter and setter methods enforce the principle of Encapsulation?', ['They speed up CPU execution rates', 'They restrict direct field mutation and allow validation checks before state changes', 'They force all fields to become constant final values', 'They automatically convert primitive variables into wrapper classes'], 1, 'Encapsulation hides direct fields and forces external modification through validation logic inside setters. Getters can return defensive copies. Why others are wrong: It has nothing to do with CPU speed, forcing final, or autoboxing.'),
    q('Which technique is mandatory when designing a truly immutable Java class containing mutable references?', ['Marking all methods static', 'Defensive copying of mutable objects inside constructors and getters', 'Allowing direct public access to fields', 'Removing all custom constructors'], 1, 'Immutable classes must create defensive copies of mutable reference fields to prevent external state tampering. Without defensive copying, callers can mutate internal state after construction. Why others are wrong: Static methods don\'t help. Public fields break immutability. Removing constructors makes the class unusable.'),
    q('What happens if you declare a class as final?', ['It cannot be instantiated', 'It cannot be extended (subclassed)', 'It cannot have methods', 'It becomes invisible to the JVM'], 1, 'A final class cannot be subclassed. This is essential for immutability — it prevents subclasses from overriding methods and exposing mutation. Why others are wrong: Final classes CAN be instantiated. They CAN have methods. They are fully visible to the JVM. String, Integer are final.'),
    q('What is the default access level when no modifier is specified?', ['public', 'private', 'package-private (visible only within the same package)', 'protected'], 2, 'When no access modifier is written, the default is package-private — visible to all classes in the same package, invisible outside. This is NOT public. Why others are wrong: public requires explicit declaration. private requires explicit declaration. protected requires explicit declaration.')
  ],
  [
    'Encapsulation hides raw implementation fields and exposes controlled public interfaces.',
    'Access modifiers enforce code security across class, package, and subclass boundaries.',
    'Immutable classes protect object state permanently using private final fields and defensive copying.',
    'Setters validate input before mutation; getters return defensive copies of mutable objects.',
    'Package-private is the default visibility; use the most restrictive modifier that works.'
  ],
  'If you want to use a big terminal on your own computer instead of the built-in one, please read Lesson 1 for full JDK setup instructions.'
),

// ==========================================
// LESSON 9: INHERITANCE, METHOD OVERRIDING & SUPER
// ==========================================
L(
  'java-09', 9, 'Inheritance, Method Overriding & super', '🧬',
  '🧬 Inheritance is the mechanism by which new classes acquire the state and behavior of existing classes, forming hierarchical relationships. It enables code reuse, establishes polymorphic type relationships, and creates the architectural backbone of frameworks. But inheritance is a double-edged sword: it creates tight coupling, fragile base class problems, and deep hierarchies that resist change. Understanding single vs. multiple inheritance, dynamic method dispatch, constructor chaining via super, and the Object root class is essential for sound OOP design.',
  [
    {
      title: '1. Extending Classes (Single vs Multi-Level)',
      beginner: 'Inheritance lets a child class reuse code from a parent class using the extends keyword. Java allows single inheritance (one direct parent) and multi-level inheritance (grandparent → parent → child), but does NOT allow inheriting from multiple classes at once. This prevents the "Diamond Problem" where two parents have conflicting methods.',
      advanced: 'Java supports single class inheritance via the extends keyword. The JVM stores the superclass reference in the class file\'s super_class field. Multi-level chains (A → B → C) create inheritance trees. Multiple direct class inheritance (extends A, B) is prohibited to eliminate the Diamond Problem: if A has method foo(), and B and C both extend A and override foo() differently, which foo() does D inherit? Interfaces solve this with multiple inheritance of TYPE (not implementation). All classes implicitly extend java.lang.Object — the universal root with equals(), hashCode(), toString(), getClass(), notify(), wait().'
    },
    {
      title: '2. Method Overriding & Dynamic Dispatch',
      beginner: 'Method overriding happens when a child class rewrites a parent method to change its behavior. The method must have the EXACT same name, parameters, and compatible return type. When you call an overridden method, Java uses Dynamic Method Dispatch — it looks at the ACTUAL object type at runtime, not the reference type, to decide which method to execute.',
      advanced: 'Method overriding requires: identical method name, identical parameter list, covariant return type (child can return a subclass of the parent\'s return type), and equal or broader access (cannot narrow visibility). The @Override annotation triggers compile-time verification. Dynamic Method Dispatch resolves virtual method calls at runtime via the object\'s vtable (virtual method table). Each class has a vtable containing pointers to its method implementations. invokevirtual bytecode performs vtable lookup based on the actual object type (not the reference type). This is runtime polymorphism. The JIT compiler uses inline caching to optimize repeated virtual calls.'
    },
    {
      title: '3. The super Keyword Mechanics',
      beginner: 'The super keyword lets you access the parent class. super() calls the parent constructor (must be the first line of the child constructor). super.methodName() calls the parent\'s version of an overridden method. super.fieldName accesses a parent field that was shadowed by a child field with the same name.',
      advanced: 'The super reference grants explicit access to the direct parent class supertype context. super(...) delegates constructor execution up the inheritance chain and MUST be the first executable line of the child constructor (if omitted, javac inserts super() implicitly). super.method() invokes the superclass method directly via invokespecial bytecode (NOT invokevirtual), bypassing dynamic dispatch. This is critical for calling overridden parent behavior. super.fieldName accesses shadowed parent fields. Note: super.super is NOT valid in Java — you cannot skip levels in the hierarchy.'
    },
    {
      title: '4. Object: The Universal Root Class',
      beginner: 'Every class in Java inherits from java.lang.Object, even if you don\'t write extends. Object provides fundamental methods: toString() (text representation), equals() (comparison), hashCode() (for hash-based collections), getClass() (runtime type info). You should override toString(), equals(), and hashCode() in your classes.',
      advanced: 'java.lang.Object is the root of the entire class hierarchy. Its methods: toString() defaults to ClassName@hexHashCode; equals(Object) defaults to == (identity comparison); hashCode() returns a hash derived from the object\'s memory address (identity hash); getClass() returns the runtime Class object; wait()/notify()/notifyAll() provide thread synchronization; finalize() is deprecated (Java 9+). When you override equals(), you MUST override hashCode() to maintain the contract: equal objects must have equal hash codes. Failure breaks HashMap, HashSet, and all hash-based collections.'
    },
    {
      title: '5. Composition vs Inheritance (Design Decision)',
      beginner: 'Inheritance creates an "is-a" relationship (a Dog IS an Animal). Composition creates a "has-a" relationship (a Car HAS an Engine). Deep inheritance hierarchies are fragile — changing the parent can break all children. Composition is more flexible: you can swap components at runtime. Prefer composition for behavior sharing; use inheritance for type hierarchy.',
      advanced: '(Expert Teaser) The "Fragile Base Class" problem: subclasses depend on the parent\'s implementation details. Changing the parent\'s internal logic can silently break subclasses. Composition (has-a) decouples components: the containing class delegates to a helper object, enabling runtime swapping, easier testing (mock injection), and adherence to the Single Responsibility Principle. Inheritance should be reserved for true type hierarchy (Liskov Substitution Principle). Effective Java Item 18: "Favor composition over inheritance." In the Expert track, we explore how the Strategy Pattern, Decorator Pattern, and Delegation Pattern replace deep inheritance trees, and how Java\'s sealed classes (Java 17) restrict inheritance to approved subclasses.'
    }
  ],
  {
    title: '🛠️ Mini-Project: Employee Payroll Hierarchy System',
    intro: '⚠️ NOTE: Build a multi-level employee payment manager that overrides calculation methods dynamically based on roles, demonstrates constructor chaining via super(), and exhibits dynamic method dispatch through polymorphic references.',
    steps: [
      'Create a file named PayrollSystem.java with the standard public class and main method boilerplate.',
      'Create a base class Employee with fields: String name, double baseSalary. Constructor: public Employee(String name, double baseSalary) { this.name = name; this.baseSalary = baseSalary; }. Method: public double calculatePay() { return baseSalary; }.',
      'Create a child class Manager extends Employee with an additional field: double bonus. Constructor: public Manager(String name, double baseSalary, double bonus) { super(name, baseSalary); this.bonus = bonus; } — note the super() call on the first line.',
      'Override calculatePay in Manager: @Override public double calculatePay() { return super.calculatePay() + bonus; } — note how super.calculatePay() calls the parent version.',
      'Create a sub-child class Executive extends Manager with field double stockOptions. Constructor chains: super(name, baseSalary, bonus). Override calculatePay: return super.calculatePay() + stockOptions.',
      'In main, instantiate polymorphically: Employee e1 = new Employee("Alice", 50000); Employee e2 = new Manager("Bob", 60000, 10000); Employee e3 = new Executive("Charlie", 80000, 20000, 30000);.',
      'Call calculatePay on all three: System.out.println(e1.getName() + ": $" + e1.calculatePay()); etc. Observe dynamic dispatch — each object uses its own overridden method.',
      'Demonstrate super.method(): In Executive, add a method showDetails() { System.out.println("Base: " + super.calculatePay()); }.',
      'Compile and execute: javac PayrollSystem.java && java PayrollSystem.'
    ],
    goal: 'You implemented a dynamic class hierarchy utilizing method overriding, constructor delegation via super(), and dynamic runtime method dispatch through polymorphic references.'
  },
  [
    q('Why does Java disallow inheriting from multiple direct parent classes simultaneously?', ['To save physical RAM', 'To avoid the Diamond Problem: method resolution ambiguity when two parents define the same method', 'Because interfaces are faster than classes', 'To enforce private field access'], 1, 'Java avoids multiple class inheritance to eliminate method resolution ambiguity known as the Diamond Problem. If B and C both extend A and override foo() differently, which foo() does D inherit? Interfaces solve this with default methods and explicit resolution. Why others are wrong: It\'s not about RAM, speed, or access modifiers.'),
    q('What determines which overridden method gets called during execution when using dynamic method dispatch?', ['The reference type declared on the left', 'The compiler flag settings', 'The actual underlying runtime object instance on the heap (vtable lookup)', 'The file directory location'], 2, 'Runtime object type determines method invocation via dynamic dispatch. The JVM performs vtable lookup based on the actual object, not the reference type. Employee e = new Manager() calls Manager\'s calculatePay(). Why others are wrong: Reference type is irrelevant at runtime. Compiler flags don\'t affect dispatch. File location is meaningless.'),
    q('Where must the super() call be placed inside a subclass constructor?', ['At the very end of the constructor block', 'Inside a try-catch block', 'On the very first executable line of the subclass constructor', 'It can be placed on any line'], 2, 'Parent constructor invocation super() must always execute first on line 1 of a subclass constructor. This ensures the parent is fully initialized before the child\'s logic runs. If omitted, javac inserts super() implicitly. Why others are wrong: It cannot be at the end, in try-catch, or on any line. Violation causes compilation error.'),
    q('What bytecode instruction is used to invoke super.method() directly, bypassing dynamic dispatch?', ['invokevirtual', 'invokeinterface', 'invokespecial', 'invokestatic'], 2, 'super.method() compiles to invokespecial, which calls the exact specified method without vtable lookup. This bypasses dynamic dispatch and directly invokes the parent\'s implementation. Why others are wrong: invokevirtual uses dynamic dispatch. invokeinterface is for interface methods. invokestatic is for static methods.'),
    q('What happens if you override equals() but forget to override hashCode()?', ['Nothing — they are independent', 'The code compiles but hash-based collections (HashMap, HashSet) break: equal objects may not be found', 'The JVM throws a runtime exception', 'The compiler refuses to compile'], 1, 'The equals/hashCode contract requires: equal objects MUST have equal hash codes. Violating this breaks HashMap, HashSet, and all hash-based collections. Equal objects with different hashes land in different buckets and become unfindable. Why others are wrong: It compiles fine. No runtime exception. But it silently breaks collections.')
  ],
  [
    'Inheritance shares code across class hierarchies using single and multi-level extensions.',
    'Dynamic Method Dispatch selects the correct overridden method implementation at runtime via vtable lookup.',
    'The super keyword invokes parent constructors (first line) and accesses parent methods/fields via invokespecial.',
    'All classes inherit from java.lang.Object — override toString(), equals(), hashCode() appropriately.',
    'Prefer composition (has-a) over deep inheritance (is-a) for behavior sharing to avoid fragile coupling.'
  ],
  'If you want to use a big terminal on your own computer instead of the built-in one, please read Lesson 1 for full JDK setup instructions.'
),

// ==========================================
// LESSON 10: POLYMORPHISM & METHOD OVERLOADING
// ==========================================
L(
  'java-10', 10, 'Polymorphism, Method Overloading & Varargs', '🎭',
  '🎭 Polymorphism — "many forms" — is the crown jewel of Object-Oriented Programming. It empowers Java programs to treat distinct subclasses through uniform superclass interfaces, enabling code that works with entire families of objects without knowing their specific types. This lesson covers compile-time polymorphism (method overloading), runtime polymorphism (method overriding + dynamic dispatch), method signature rules, variable argument lists (varargs), and the subtle interplay between static binding and dynamic binding that defines Java\'s type system.',
  [
    {
      title: '1. Compile-Time vs Runtime Polymorphism',
      beginner: 'Polymorphism allows objects to behave differently based on context. Compile-time polymorphism (static binding) happens with method OVERLOADING — Java picks the right method while compiling based on the argument types. Runtime polymorphism (dynamic binding) happens with method OVERRIDING — Java picks the right method while running based on the actual object type.',
      advanced: 'Compile-Time Polymorphism (Static Binding): resolved during compilation by javac based on method signatures. Method overloading, operator overloading (limited: + for strings), and generic type erasure are compile-time decisions. Runtime Polymorphism (Dynamic Binding): resolved during execution by the JVM based on the actual heap object type. Method overriding via invokevirtual/invokeinterface uses vtable/itable lookup. The JIT compiler uses inline caching and type profiling to optimize repeated virtual calls. Static methods, private methods, and final methods are statically bound (cannot be overridden).'
    },
    {
      title: '2. Method Signatures & Overloading Rules',
      beginner: 'Method overloading means having multiple methods with the same name but different parameter lists (different count, different types, or different order). Changing ONLY the return type is NOT a valid overload — it causes a "duplicate method" compilation error. Changing ONLY the access modifier or parameter names is also invalid.',
      advanced: 'Method signatures consist exclusively of method name and ordered parameter type lists. Overloading requires unique signatures. The JVM stores overloaded methods as separate entries in the method table with distinct descriptor strings: (I)V, (II)V, (ILjava/lang/String;)V. Overload resolution follows: (1) exact match, (2) widening (subtyping), (3) boxing/unboxing, (4) varargs. Ambiguous overloads (e.g., method(int, double) vs method(double, int)) cause compile errors. Changing visibility, exceptions, or return types alone yields duplicate method compilation errors. The compiler performs overload resolution BEFORE the code runs.'
    },
    {
      title: '3. Variable Arguments (varargs)',
      beginner: 'Varargs let a method accept zero, one, or many arguments of the same type using three dots: String... items. Inside the method, Java treats items as a standard array. You can loop through it with a for-each loop. Only ONE varargs parameter is allowed per method, and it must be the LAST parameter.',
      advanced: 'Varargs parameters (Type... name) act as implicit syntactic sugar for array parameters (Type[]). The compiler generates array creation and packing code at the call site. Java allows only one varargs parameter per method, and it must sit in the final signature position. Varargs compile to array descriptors in the method signature: (I[Ljava/lang/String;)V. Overloading with varargs vs array is ambiguous: method(String... args) and method(String[] args) are DUPLICATE signatures. Varargs with generics can trigger unchecked warnings due to array covariance. Use @SafeVarargs annotation on static/final methods to suppress warnings.'
    },
    {
      title: '4. Upcasting, Downcasting & instanceof',
      beginner: 'Upcasting is automatic: you can assign a child object to a parent reference (Employee e = new Manager()). This is safe because a Manager IS an Employee. Downcasting is manual and risky: Manager m = (Manager) e; — if e is NOT actually a Manager, you get a ClassCastException. Use instanceof to check before casting: if (e instanceof Manager) { ... }.',
      advanced: 'Upcasting (widening reference conversion) is implicit and safe: the child IS-A parent type. Downcasting (narrowing reference conversion) requires explicit cast syntax and is checked at runtime via checkcast bytecode. If the object is not an instance of the target type, ClassCastException is thrown. The instanceof operator compiles to instanceof bytecode and checks the object\'s class hierarchy. Java 16+ introduces pattern matching for instanceof: if (obj instanceof String s) { s.length(); } — this eliminates manual casting. The JIT compiler uses type profiling to optimize instanceof checks and eliminate redundant checkcast instructions.'
    },
    {
      title: '5. Static Binding vs Dynamic Binding Table',
      beginner: 'Some method calls are resolved at compile time (static binding): static methods, private methods, final methods, and overloaded methods. Others are resolved at runtime (dynamic binding): overridden instance methods. Knowing which is which helps you understand why certain methods can\'t be overridden and why polymorphism works the way it does.',
      advanced: '(Expert Teaser) Static binding (early binding): resolved by javac at compile time. Applies to: static methods (invokestatic), private methods (invokespecial), final methods (invokespecial or devirtualized invokevirtual), constructors (invokespecial), and overloaded methods (signature-based). Dynamic binding (late binding): resolved by JVM at runtime. Applies to: overridden instance methods (invokevirtual) and interface methods (invokeinterface). The JIT compiler performs Class Hierarchy Analysis (CHA) to devirtualize calls when only one implementation exists, converting invokevirtual to invokespecial for performance. In the Expert track, we explore how sealed classes (Java 17) enable the JIT to prove exhaustiveness and devirtualize all calls in a sealed hierarchy, and how invokedynamic (Java 7+) powers lambda expressions and the Nashorn JavaScript engine.'
    }
  ],
  {
    title: '🛠️ Mini-Project: Universal Notification Dispatcher',
    intro: '⚠️ NOTE: Build a flexible notification logging service leveraging compile-time method overloading, varargs message handling, runtime polymorphic dispatches, upcasting/downcasting with instanceof, and dynamic binding demonstration.',
    steps: [
      'Create a file named NotificationService.java with the standard public class and main method boilerplate.',
      'Create a base class Notifier with method: public void send(String msg) { System.out.println("Base: " + msg); }.',
      'Create overloaded methods in Notifier: public void send(String msg, int priority) { System.out.println("Priority " + priority + ": " + msg); } and public void send(String... batchMessages) { for (String m : batchMessages) System.out.println("Batch: " + m); }.',
      'Create a subclass SMSNotifier extends Notifier that overrides send(String msg): @Override public void send(String msg) { System.out.println("SMS Carrier: " + msg); }.',
      'In main, demonstrate overloading: Notifier n = new Notifier(); n.send("Hello"); n.send("Urgent", 1); n.send("A", "B", "C");.',
      'Demonstrate runtime polymorphism: Notifier sms = new SMSNotifier(); sms.send("Polymorphic!"); — observe SMSNotifier\'s version is called despite the Notifier reference.',
      'Demonstrate upcasting: Object obj = new SMSNotifier(); — SMSNotifier upcast to Object.',
      'Demonstrate instanceof + downcasting: if (obj instanceof SMSNotifier s) { s.send("Pattern matched!"); } — Java 16+ pattern matching.',
      'Compile and execute: javac NotificationService.java && java NotificationService.'
    ],
    goal: 'You designed a polymorphic notification module using static overloading, runtime overriding, variable parameter lists, upcasting, and pattern matching for instanceof.'
  },
  [
    q('Which mechanism resolves method selection for static method overloading?', ['Dynamic dispatch lookup at runtime', 'Compile-time resolution based on static parameter signatures', 'Garbage collector execution', 'Runtime Reflection API'], 1, 'Overloading is resolved during compilation by javac matching arguments against method signature parameters. The compiler selects the most specific applicable method. Why others are wrong: Dynamic dispatch is for overriding, not overloading. GC is irrelevant. Reflection is not used for normal method calls.'),
    q('Which parameter list change successfully creates a valid method overload for void render(int x)?', ['int render(int x) (changing return type only)', 'void render(int y) (changing parameter name only)', 'void render(int x, double y) (adding a parameter)', 'private void render(int x) (changing access modifier only)'], 2, 'Adding a double y parameter creates a new signature: (ID)V vs (I)V. This is a valid overload. Why others are wrong: Changing return type alone is a duplicate method error. Changing parameter names does not change the signature. Changing access modifier alone is invalid.'),
    q('What is the rule regarding the position of varargs parameters inside Java method signatures?', ['Varargs can be placed anywhere in the parameter list', 'Varargs must always be the final parameter declared in the method signature', 'A method can have up to three distinct varargs parameters', 'Varargs parameters can only be used inside static initializers'], 1, 'Java enforces that varargs parameters must be positioned at the very end of method parameter lists. Only ONE varargs parameter is allowed per method. Why others are wrong: Varargs cannot be in the middle. Only one is allowed. They work in any method, not just static initializers.'),
    q('What happens when you call an overridden method through a parent reference: Employee e = new Manager(); e.calculatePay();?', ['Employee\'s calculatePay() is called (reference type)', 'Compilation error', 'Manager\'s calculatePay() is called (actual object type via dynamic dispatch)', 'Runtime ClassCastException'], 2, 'Dynamic method dispatch resolves the call based on the ACTUAL object type (Manager), not the reference type (Employee). The JVM performs vtable lookup on the Manager object. Why others are wrong: Reference type is irrelevant for overridden methods. No compilation error. No ClassCastException — the call is valid.'),
    q('What is the purpose of the instanceof operator in Java?', ['To create a new instance of a class', 'To check if an object is an instance of a specific class or its subclasses (type checking before downcasting)', 'To initialize static variables', 'To compare two objects for equality'], 1, 'instanceof checks the object\'s class hierarchy at runtime, returning true if the object is an instance of the specified type or any subclass. It is essential for safe downcasting. Why others are wrong: It does not create instances (new does that). It does not initialize variables. It does not compare equality (equals does that).')
  ],
  [
    'Static overloading provides compile-time polymorphism based on signature differences.',
    'Dynamic overriding provides runtime polymorphism using vtable lookup on the actual heap object.',
    'Varargs wrap flexible numbers of incoming method arguments into implicitly typed arrays (must be last).',
    'Upcasting is automatic and safe; downcasting requires instanceof checks to avoid ClassCastException.',
    'Static methods, private methods, and final methods are statically bound and cannot be overridden.'
  ],
  'If you want to use a big terminal on your own computer instead of the built-in one, please read Lesson 1 for full JDK setup instructions.'
),


L(
  'java-11', 11, 'Abstraction: Abstract Classes vs Interfaces', '🎭',
  '🎭 Abstraction is the art of hiding complexity behind clean contracts. It decouples WHAT a component does from HOW it does it internally. In Java, abstraction is enforced through two powerful mechanisms: abstract classes (partial blueprints with shared state) and interfaces (pure behavioral contracts). Understanding when to use each, how default methods enable interface evolution, and how functional interfaces power lambda expressions is the foundation of scalable, framework-grade Java architecture.',
  [
    {
      title: '1. Abstract Classes vs Interfaces (The Core Distinction)',
      beginner: 'An abstract class is a partial blueprint — it can have both implemented methods AND abstract methods (methods with no body that children MUST implement). It can also hold state (fields) and constructors. An interface is a pure contract — it defines WHAT methods a class must have, but traditionally has no implementation. A class can implement MULTIPLE interfaces but extend only ONE abstract class.',
      advanced: 'Abstract classes support: instance fields (state), constructors, concrete methods, abstract methods, and single inheritance via extends. Interfaces support: constants (public static final), abstract methods, default methods, static methods, private methods (Java 9+), and MULTIPLE implementation via implements. At the bytecode level, abstract classes use the standard class file format with ACC_ABSTRACT flag. Interfaces use ACC_INTERFACE | ACC_ABSTRACT flags. Method dispatch differs: abstract class methods use invokevirtual (vtable), interface methods use invokeinterface (itable lookup), which is slightly slower due to the additional indirection layer.'
    },
    {
      title: '2. Default, Static & Private Interface Methods',
      beginner: 'Since Java 8, interfaces can have methods WITH bodies! Default methods (marked with the default keyword) provide a fallback implementation so existing classes don\'t break when you add new methods to the interface. Static methods are utility helpers. Since Java 9, private methods let you share code between default methods internally.',
      advanced: 'Default methods (JEP 218, Java 8) enable interface evolution without breaking implementing classes — a critical feature for library maintainers. When a class implements multiple interfaces with conflicting default methods, the compiler FORCES the class to override and explicitly resolve the ambiguity. Static interface methods are invoked via invokestatic and cannot be overridden. Private interface methods (Java 9, JEP 213) enable code reuse between default methods without exposing implementation to implementors. The bytecode for default methods uses invokevirtual with a special InterfaceMethodref entry in the constant pool.'
    },
    {
      title: '3. Functional Interfaces & The SAM Contract',
      beginner: 'A Functional Interface is a special interface with EXACTLY ONE abstract method. It is marked with @FunctionalInterface. These are the foundation of lambda expressions in Java — when you write (x) -> x * 2, you are implementing a functional interface anonymously. Common examples: Runnable (run), Comparator (compare), Predicate (test).',
      advanced: 'Functional Interfaces enforce the Single Abstract Method (SAM) contract. The @FunctionalInterface annotation triggers compile-time verification that exactly one abstract method exists (default/static/private methods don\'t count). At the bytecode level, lambda expressions compile to invokedynamic instructions (NOT anonymous inner classes). The LambdaMetafactory generates the implementation class at runtime, producing zero garbage collection overhead compared to anonymous classes. Core SAM interfaces in java.util.function: Predicate<T> (boolean test(T)), Function<T,R> (R apply(T)), Consumer<T> (void accept(T)), Supplier<T> (T get()).'
    },
    {
      title: '4. Multiple Inheritance of Type (Not Implementation)',
      beginner: 'Java forbids inheriting from multiple CLASSES (to avoid the Diamond Problem), but allows implementing multiple INTERFACES. This gives you the flexibility of multiple inheritance for TYPE (your object can be treated as many types) without the danger of conflicting implementations.',
      advanced: 'Java supports multiple inheritance of TYPE through interfaces, not multiple inheritance of STATE or IMPLEMENTATION. A class implementing InterfaceA and InterfaceB can be assigned to variables of either type (polymorphism). The Diamond Problem is resolved at compile time: if two interfaces provide conflicting default methods, the implementing class MUST override and explicitly choose (or combine) via InterfaceName.super.method(). This is the "class wins" rule: if a class inherits a method from its superclass AND an interface provides a default, the superclass version always wins.'
    },
    {
      title: '5. Sealed Classes & Pattern Matching (Java 17+)',
      beginner: 'Java 17 introduced sealed classes — a way to say "only THESE specific classes can extend me." Combined with pattern matching in switch, this lets the compiler verify you handled every possible case. It\'s like a closed family tree where the compiler knows all the members.',
      advanced: '(Expert Teaser) Sealed classes (JEP 409, Java 17) restrict which classes can extend/implement a type using the permits clause: public sealed interface Shape permits Circle, Rectangle, Triangle. Combined with pattern matching for switch (JEP 441, Java 21), the compiler performs exhaustiveness checking — if you add a new permitted subclass, every switch expression over that type becomes a compilation error until handled. This is the foundation of Algebraic Data Types (ADTs) in Java. At the bytecode level, sealed classes store permitted subclasses in the PermittedSubclasses attribute. In the Expert track, we explore how sealed interfaces + pattern matching replace the Visitor pattern, enable compiler-verified state machines, and how frameworks like Spring use them for exhaustive request handling.'
    }
  ],
  {
    title: '🛠️ Mini-Project: Payment Processing & Gateway Engine',
    intro: '⚠️ NOTE: Build a decoupled payment engine utilizing abstract classes for shared state, interface contracts for processing rules, functional interfaces for tax calculation lambdas, and default methods for shared logging logic.',
    steps: [
      'Create a file named PaymentEngine.java with the standard public class and main method boilerplate.',
      'Define an interface Payable with: abstract method boolean processPayment(double amount); default method void logTransaction(String msg) { System.out.println("[LOG] " + msg); } — note how default provides shared implementation.',
      'Define a @FunctionalInterface named TaxCalculator with single method: double computeTax(double amount);.',
      'Create an abstract class PaymentGateway implementing Payable with: protected field String gatewayName; constructor; abstract method String getReceipt();.',
      'Create CreditCardGateway extends PaymentGateway with: field double processingFee; implement processPayment() and getReceipt().',
      'Create CryptoGateway extends PaymentGateway with: field String walletAddress; implement processPayment() and getReceipt() differently.',
      'In main, instantiate polymorphically: Payable p1 = new CreditCardGateway("Visa", 2.5); Payable p2 = new CryptoGateway("Bitcoin", "0x123...");.',
      'Process payments: p1.processPayment(100.0); p2.processPayment(50.0);.',
      'Use a functional interface with lambda: TaxCalculator tax = amount -> amount * 0.08; System.out.println("Tax: $" + tax.computeTax(100.0));.',
      'Compile and execute: javac PaymentEngine.java && java PaymentEngine.'
    ],
    goal: 'You built an abstract payment system utilizing interface contracts with default methods, abstract class hierarchies with shared state, functional interfaces with lambda expressions, and polymorphic processing.'
  },
  [
    q('What is a key structural difference between abstract classes and interfaces in Java?', ['Abstract classes cannot have constructors', 'A class can implement multiple interfaces but extend only one abstract class', 'Interfaces can maintain mutable private instance state fields', 'Abstract classes cannot contain concrete (implemented) methods'], 1, 'Java allows multiple interface implementation (implements A, B, C) while enforcing single class inheritance (extends X). This enables multiple inheritance of TYPE without the Diamond Problem of conflicting implementations. Why others are wrong: Abstract classes CAN have constructors. Interfaces CANNOT have instance fields (only constants). Abstract classes CAN contain concrete methods.'),
    q('What defines a valid Functional Interface in Java?', ['It must contain only static methods', 'It contains exactly one single abstract method (SAM contract)', 'It must be declared private final', 'It cannot extend any parent interface'], 1, 'Functional interfaces strictly require exactly one abstract method signature. The @FunctionalInterface annotation enforces this at compile time. Default, static, and private methods do NOT count toward the SAM limit. Why others are wrong: It can have static/default/private methods. It does not need to be private/final. It CAN extend parent interfaces (inherited abstract methods count toward the total).'),
    q('Why were default methods introduced into Java interfaces in Java 8?', ['To allow interfaces to store instance variables', 'To enable interface evolution without breaking existing implementing classes', 'To remove abstract classes completely from Java', 'To replace the public access modifier'], 1, 'Default methods allow library maintainers to add new methods to interfaces without forcing every implementing class to provide an implementation. This was critical for adding stream() to Collection without breaking millions of existing implementations. Why others are wrong: Interfaces still cannot have instance fields. Abstract classes still exist and serve different purposes. Default has nothing to do with access modifiers.'),
    q('What bytecode instruction is used to invoke a method defined in an interface?', ['invokevirtual', 'invokeinterface', 'invokespecial', 'invokestatic'], 1, 'Interface method calls compile to invokeinterface, which performs an itable (interface method table) lookup at runtime. This is slightly slower than invokevirtual (vtable lookup) due to the additional indirection required to resolve the correct implementation across multiple interfaces. Why others are wrong: invokevirtual is for class methods. invokespecial is for constructors/super/private. invokestatic is for static methods.'),
    q('What happens if a class implements two interfaces that both provide a default method with the same signature?', ['The first interface listed wins automatically', 'Compilation error: the class MUST override the method and explicitly resolve the conflict', 'The JVM picks one at runtime randomly', 'Both methods execute simultaneously'], 1, 'Java forces explicit resolution. The implementing class must override the conflicting method and can call either parent via InterfaceName.super.method(). This prevents the Diamond Problem ambiguity at compile time. Why others are wrong: There is no automatic winner. It is a hard compilation error, not a runtime decision. Both do not execute.')
  ],
  [
    'Abstract classes provide partial blueprints with shared state and single inheritance; interfaces define pure contracts with multiple implementation.',
    'Default methods enable interface evolution without breaking existing code; static methods provide utilities; private methods share internal logic.',
    'Functional Interfaces enforce the Single Abstract Method (SAM) contract, enabling lambda expressions via invokedynamic.',
    'Java supports multiple inheritance of TYPE through interfaces, resolving conflicts via explicit override rules.',
    'Sealed classes (Java 17+) + pattern matching enable compiler-verified exhaustive type handling (Algebraic Data Types).'
  ],
  'If you want to use a big terminal on your own computer instead of the built-in one, please read Lesson 1 for full JDK setup instructions.'
),

// ==========================================
// LESSON 12: ADVANCED OOP CONCEPTS
// ==========================================
L(
  'java-12', 12, 'Advanced OOP: Static, Final, Object, Enums & Records', '🏛️',
  '🏛️ Beyond basic classes and inheritance lies the complete Java object model. Static members create class-level shared state that exists independently of any instance. Final modifiers create immutability guarantees. The universal Object class provides the foundational methods every object inherits. Enums create type-safe constant sets with behavior. And modern Java Records revolutionize immutable data carriers. Mastering these concepts transforms you from someone who writes classes into someone who engineers type systems.',
  [
    {
      title: '1. Static Members & Class-Level State',
      beginner: 'The static keyword makes a member belong to the CLASS itself, not to any individual object. There is only ONE copy shared by everyone. static variables are like a scoreboard visible to all players. static methods (like Math.sqrt()) can be called without creating an object. static blocks run once when the class is first loaded.',
      advanced: 'Static members are allocated in Metaspace (class metadata area) when the ClassLoader loads the class. They exist BEFORE any instance is created and are shared across ALL instances and ALL threads. Static fields are accessed via getstatic/putstatic bytecode (no objectref needed). Static methods use invokestatic (no dynamic dispatch). Static initialization blocks execute in textual order during class initialization (<clinit> method). Thread safety of static mutable state requires explicit synchronization or volatile. The class initialization is thread-safe by JLS guarantee — the JVM ensures <clinit> runs exactly once.'
    },
    {
      title: '2. Final Modifiers & Immutability Enforcement',
      beginner: 'The final keyword means "cannot be changed." A final variable is a constant — assign once, never change. A final method cannot be overridden by subclasses. A final class cannot be extended at all. String is final — that\'s why you can\'t create a class that extends String.',
      advanced: 'final operates at three levels: (1) final fields: the JVM guarantees that a properly constructed final field is visible to all threads without synchronization (happens-before relationship via JMM). This is critical for immutable objects. (2) final methods: compiled with ACC_FINAL flag, preventing virtual dispatch override. The JIT can devirtualize calls to final methods (convert invokevirtual to direct call). (3) final classes: prevent subclassing entirely (String, Integer, Math are final). The JIT uses Class Hierarchy Analysis (CHA) on final classes to prove only one implementation exists, enabling aggressive inlining.'
    },
    {
      title: '3. Object: The Universal Root & Its Contract',
      beginner: 'Every class in Java inherits from java.lang.Object, even if you never write extends. Object gives you: toString() (text representation), equals() (comparison), hashCode() (for hash collections), getClass() (runtime type), and thread coordination methods (wait/notify). You should override toString(), equals(), and hashCode() in your classes.',
      advanced: 'java.lang.Object defines the universal contract: toString() defaults to ClassName@identityHashCode. equals(Object) defaults to reference identity (==). hashCode() returns an identity hash derived from object header (mark word). The equals/hashCode contract is LAW: equal objects MUST have equal hash codes. Violating this breaks HashMap, HashSet, ConcurrentHashMap. getClass() returns the runtime Class<?> object for reflection. wait()/notify()/notifyAll() use the object\'s monitor (intrinsic lock) for thread coordination. finalize() is deprecated since Java 9 — use Cleaner or try-with-resources instead.'
    },
    {
      title: '4. Enums: Type-Safe Constants with Behavior',
      beginner: 'An enum is a special class that represents a fixed set of constants (like days of the week or order statuses). Unlike simple int constants, enums are type-safe — you can\'t accidentally pass a random number where a DayOfWeek is expected. Enums can even have fields, methods, and constructors!',
      advanced: 'Enums compile to classes extending java.lang.Enum<E>. Each constant is a public static final instance of the enum class, created via a static initializer. Enums support: fields, constructors (implicitly private), methods, abstract methods (each constant provides its own implementation), and interfaces. The ordinal() method returns the declaration index. values() returns all constants. valueOf(String) performs reverse lookup. At the bytecode level, switch over enums compiles to a synthetic $SwitchMap array mapping ordinals to case indices. Enums are inherently serializable and comparable. They are the foundation of the Type-Safe Enum pattern and replace the old int-constant anti-pattern.'
    },
    {
      title: '5. Records: Modern Immutable Data Carriers (Java 14+)',
      beginner: 'Java 14 introduced records — a one-line way to create immutable data classes. Instead of writing 30 lines of boilerplate (fields, constructor, getters, equals, hashCode, toString), you write: record Point(int x, int y) {}. Java generates everything automatically!',
      advanced: '(Expert Teaser) Records (JEP 395, Java 16 final) are transparent carriers of immutable data. record Point(int x, int y) generates: private final fields, canonical constructor, accessor methods (x() not getX()), equals(), hashCode(), toString(). Records are implicitly final and cannot extend other classes (they implicitly extend java.lang.Record). They CAN implement interfaces. The compact constructor allows validation: public Point { if (x < 0) throw new IllegalArgumentException(); }. At the bytecode level, records use the Record attribute in the class file. In the Expert track, we explore how records + sealed interfaces create Algebraic Data Types, how pattern matching deconstructs records (case Point(int x, int y)), and how serialization handles records differently from traditional Serializable classes.'
    }
  ],
  {
    title: '🛠️ Mini-Project: Enterprise Banking System with Enums & Records',
    intro: '⚠️ NOTE: Build a comprehensive banking system integrating static ID counters, final immutability rules, overridden Object methods (equals/hashCode/toString), Enum status tracking, and modern Record data carriers.',
    steps: [
      'Create a file named BankingSystem.java with the standard public class and main method boilerplate.',
      'Create an enum AccountStatus with values: ACTIVE, FROZEN, CLOSED. Add a method: public String getDescription() using a switch expression.',
      'Create a record MoneyAmount(double value, String currency) with a compact constructor that validates value >= 0.',
      'Create a class BankAccount with: private static int nextId = 1000; private final int accountId; private final String owner; private double balance; private AccountStatus status.',
      'In the constructor, assign accountId = nextId++ (static counter). Override toString(), equals() (based on accountId), and hashCode().',
      'Create a method: public void deposit(MoneyAmount amount) { if (status == AccountStatus.FROZEN) throw new IllegalStateException("Account frozen"); this.balance += amount.value(); }.',
      'In main, create accounts: BankAccount a1 = new BankAccount("Alice", 1000); BankAccount a2 = new BankAccount("Bob", 500);.',
      'Test static counter: Print a1 and a2 — observe they have different accountIds (1000, 1001) from the shared static counter.',
      'Test enum: a1.deposit(new MoneyAmount(250.0, "USD")); Print a1 status and balance.',
      'Test equals: Create a duplicate reference and verify equals() works correctly. Compile and execute: javac BankingSystem.java && java BankingSystem.'
    ],
    goal: 'You built an enterprise banking system integrating static state counters, final immutability, Object method contracts, type-safe enums with behavior, and modern record data carriers.'
  },
  [
    q('What happens when you attempt to override a method declared as final in a parent class?', ['The child method executes successfully at runtime', 'The compiler raises a compilation error — final methods cannot be overridden', 'The parent method gets permanently deleted from memory', 'The method converts automatically into a static context'], 1, 'The compiler rejects overriding final parent methods. The ACC_FINAL flag in the method\'s access_flags prevents virtual dispatch override. The JIT uses this to devirtualize calls. Why others are wrong: It does not execute at runtime. It does not delete the parent method. It does not convert to static.'),
    q('What is the crucial relationship contract between equals() and hashCode() in Java?', ['If two objects are equal according to equals(), they MUST return identical hashCode() values', 'hashCode() must return unique values for all objects even if equals() returns true', 'equals() compares primitives while hashCode() compares objects', 'hashCode() must be overridden only when using abstract classes'], 0, 'The equals/hashCode contract (JLS §Object.hashCode) mandates: if a.equals(b) is true, then a.hashCode() == b.hashCode() MUST be true. Violating this breaks HashMap, HashSet, and all hash-based collections — equal objects land in different buckets and become unfindable. Why others are wrong: hashCode does NOT need to be unique for unequal objects. Both methods compare objects. hashCode matters for ALL classes used in hash collections, not just abstract ones.'),
    q('What automatic operation converts a primitive type (e.g., int) into its corresponding Wrapper object (Integer)?', ['Downcasting', 'Autoboxing', 'Dynamic Dispatch', 'Type Erasure'], 1, 'Autoboxing is the compiler-generated automatic conversion: int → Integer.valueOf(int). The reverse (Integer → int) is unboxing. At the bytecode level, autoboxing inserts invokevirtual Integer.valueOf(). The Integer cache (-128 to 127) means Integer.valueOf(100) == Integer.valueOf(100) is TRUE, but Integer.valueOf(200) == Integer.valueOf(200) is FALSE. Why others are wrong: Downcasting is reference narrowing. Dynamic dispatch is method resolution. Type erasure is generic compilation.'),
    q('What is the primary advantage of using Java Records (Java 14+) over traditional POJO classes?', ['Records execute faster at runtime', 'Records auto-generate immutable fields, canonical constructor, accessors, equals(), hashCode(), and toString() in one line — eliminating boilerplate', 'Records can extend other classes for inheritance', 'Records automatically connect to databases'], 1, 'Records provide a concise, compiler-generated immutable data carrier. record Point(int x, int y) replaces ~30 lines of boilerplate. Records are implicitly final, cannot extend classes, and enforce immutability. Why others are wrong: Records do not execute faster (same bytecode). They CANNOT extend other classes. They have no database connection magic.'),
    q('Where are static variables stored in JVM memory?', ['On the thread-local Stack', 'On the shared Heap inside each object instance', 'In Metaspace (class metadata area), shared across all instances and threads', 'In CPU registers only'], 2, 'Static fields are stored in Metaspace as part of the class metadata. They are initialized during class loading (<clinit>) and shared across ALL instances and ALL threads. They exist before any object is created. Why others are wrong: Stack stores local variables. Heap stores instance fields (non-static). CPU registers are transient execution units.')
  ],
  [
    'static members belong to the class itself (Metaspace), shared across all instances and threads.',
    'final enforces immutability: final fields (JMM visibility guarantee), final methods (no override), final classes (no extension).',
    'Override equals() and hashCode() together to maintain the contract required by hash-based collections.',
    'Enums are full classes extending java.lang.Enum — they support fields, methods, constructors, and abstract behavior.',
    'Records (Java 14+) provide one-line immutable data carriers with auto-generated equals/hashCode/toString.'
  ],
  'If you want to use a big terminal on your own computer instead of the built-in one, please read Lesson 1 for full JDK setup instructions.'
),

// ==========================================
// LESSON 13: ARRAYS, MULTI-DIMENSIONAL ARRAYS & SEARCH LOGIC
// ==========================================
L(
  'java-13', 13, 'Arrays, Multi-dimensional Arrays & Search Logic', '🔢',
  '🔢 Arrays are the foundational data structure of computing — contiguous blocks of memory that provide O(1) indexed access. In Java, arrays are objects on the Heap with a fixed size determined at creation. Understanding array memory layout, multi-dimensional (jagged) structures, and fundamental search/sort algorithms is essential before moving to dynamic collections. This lesson bridges raw memory manipulation with algorithmic thinking.',
  [
    {
      title: '1. Array Memory Allocation & O(1) Access',
      beginner: 'An array is a fixed-size container that holds items of the SAME type in a row. Once you create int[] nums = new int[5], you get exactly 5 slots, numbered 0 through 4. You cannot resize it. Accessing any slot by its index number is instant — the computer calculates the exact memory address using simple math.',
      advanced: 'Java arrays are objects allocated on the Heap. The array object header contains: mark word, class pointer (to a synthetic array class like [I for int[]), and the length field. Element storage is contiguous: base_address + (index × element_size). This enables O(1) random access. Array bounds are checked at EVERY access via arraylength + if_icmpge bytecode — out-of-bounds throws ArrayIndexOutOfBoundsException. The JIT compiler performs Range Check Elimination (RCE) in loops where it can prove indices are always valid, removing per-access overhead. Arrays of primitives store raw values; arrays of objects store references (pointers) to Heap objects.'
    },
    {
      title: '2. Multi-dimensional Arrays (Jagged Structures)',
      beginner: 'A 2D array is an "array of arrays" — like a table with rows and columns. You access elements with two indices: grid[row][column]. But here\'s the surprise: each ROW can have a different length! This is called a "jagged array."',
      advanced: 'Java implements multi-dimensional arrays as arrays of references. int[][] grid = new int[3][4] creates: one outer array of 3 references, plus three separate inner arrays of 4 ints each. These inner arrays may be scattered across the Heap — they are NOT guaranteed to be contiguous. This means 2D array traversal has poorer cache locality than a flat 1D array. Jagged arrays (int[][] jagged = new int[3][]; jagged[0] = new int[2]; jagged[1] = new int[5];) are valid and memory-efficient for sparse data. The bytecode uses aaload (array reference load) twice for grid[i][j]: first to get the row reference, then to access the element.'
    },
    {
      title: '3. Searching Algorithms: Linear vs Binary',
      beginner: 'Linear Search checks every item one by one — simple but slow for big data. Binary Search is much faster: it looks at the MIDDLE item, decides which half to keep, and repeats. But Binary Search ONLY works on SORTED data! Think of it like looking up a word in a dictionary — you don\'t read every page.',
      advanced: 'Linear search: O(n) time, works on unsorted data, sequential scan. Binary search: O(log n) time, REQUIRES sorted data, divide-and-conquer. At each step, binary search eliminates half the remaining elements. For n = 1,000,000: linear takes up to 1,000,000 comparisons; binary takes at most 20 (log₂(1,000,000) ≈ 20). Java provides Arrays.binarySearch() which returns the index if found, or (-(insertion point) - 1) if not found. The JIT can optimize binary search branches using profile-guided branch prediction. For sorted arrays with frequent lookups, binary search is vastly superior. For unsorted arrays with frequent insertions, consider HashSet (O(1) lookup).'
    },
    {
      title: '4. Sorting Algorithms & Arrays.sort()',
      beginner: 'Sorting arranges data in order (smallest to largest). Java provides Arrays.sort() which works automatically. For small arrays, it uses Insertion Sort. For large arrays, it uses a highly optimized Dual-Pivot QuickSort for primitives and TimSort (merge sort variant) for objects.',
      advanced: 'Arrays.sort() implementation varies by type: (1) Primitive arrays (int[], double[]): Dual-Pivot QuickSort — O(n log n) average, O(n²) worst case, in-place (no extra memory), NOT stable. (2) Object arrays (String[], Integer[]): TimSort — O(n log n), stable (preserves relative order of equal elements), uses temporary space. The stability requirement for objects is mandated by the Comparable/Comparator contract. For custom sorting, pass a Comparator: Arrays.sort(arr, Comparator.reverseOrder()). The sort is performed via a tuned merge-insertion hybrid. For parallel sorting of large arrays, use Arrays.parallelSort() which leverages ForkJoinPool.'
    },
    {
      title: '5. CPU Cache Locality & Performance (Expert Teaser)',
      beginner: 'Your CPU has a tiny, super-fast memory called "cache." If your data is stored neatly in a row (like an array), the CPU grabs chunks of it instantly. If your data is scattered randomly (like a linked list), the CPU wastes time hunting for each piece. This is why arrays are often faster than fancy data structures!',
      advanced: '(Expert Teaser) Modern CPUs fetch memory in cache lines (typically 64 bytes). Contiguous array access exploits spatial locality — when the CPU loads element [0], it prefetches [1] through [15] into L1 cache automatically. Linked structures (LinkedList, trees) suffer cache misses because nodes are scattered across the Heap. This explains why ArrayList often outperforms LinkedList even for operations where LinkedList has better Big-O complexity. The JVM\'s array layout (contiguous elements after the header) is designed for cache friendliness. In the Expert track, we explore how the Java Vector API (Project Panama) processes array elements in SIMD batches, how @Contended annotation prevents false sharing in concurrent arrays, and how mechanical sympathy (aligning data structures with CPU cache hierarchy) can yield 10-100x performance improvements.'
    }
  ],
  {
    title: '🛠️ Mini-Project: 2D Grid Matrix Searcher & Sort Engine',
    intro: '⚠️ NOTE: Build an application that generates a multi-dimensional array, populates it with random integers, performs linear search to locate coordinates, extracts a 1D slice, sorts it, and executes binary search.',
    steps: [
      'Create a file named MatrixSearcher.java with the standard public class and main method boilerplate.',
      'Import java.util.Arrays and java.util.Random.',
      'Initialize a 2D array: int[][] grid = new int[5][5]; and populate it with random numbers (1-100) using nested loops and Random.',
      'Write a method printGrid(int[][] g) that formats and prints the grid as a table using nested loops.',
      'Write a method findCoordinates(int[][] targetGrid, int value) that performs LINEAR search and returns a String like "Found at [2,3]" or "Not found".',
      'Extract a 1D row: int[] row = grid[2]; and sort it: Arrays.sort(row);.',
      'Perform binary search on the sorted row: int index = Arrays.binarySearch(row, row[2]); Print the result.',
      'Demonstrate jagged array: int[][] jagged = new int[3][]; jagged[0] = new int[2]; jagged[1] = new int[5]; jagged[2] = new int[3]; Print each row length.',
      'Compile and execute: javac MatrixSearcher.java && java MatrixSearcher.'
    ],
    goal: 'You successfully manipulated contiguous heap memory, traversed multi-dimensional jagged arrays, executed linear and binary searches, and applied Arrays.sort() with verified results.'
  },
  [
    q('What is a fundamental limitation of standard Java arrays?', ['They cannot store primitive data types', 'Their size is fixed at creation and cannot be changed after instantiation', 'They can only hold a maximum of 256 elements', 'They require manual memory deallocation like C++'], 1, 'Standard arrays in Java are immutable in length. The length field is final in the array object header. Resizing requires creating an entirely new array and copying elements (Arrays.copyOf). For dynamic sizing, use ArrayList. Why others are wrong: Arrays CAN store primitives. There is no 256 limit (limited by int max and available heap). Java has automatic GC — no manual deallocation.'),
    q('Which of the following is an absolute requirement before executing a Binary Search on an array?', ['The array must contain only positive integers', 'The array must be multi-dimensional', 'The array must already be sorted in ascending order', 'The array must have an even number of elements'], 2, 'Binary Search relies on sorted data to determine which half to eliminate on each comparison. If the array is unsorted, the algorithm produces incorrect results silently (no exception). Use Arrays.sort() before Arrays.binarySearch(). Why others are wrong: It works with negative numbers, 1D arrays, and odd-length arrays. The ONLY requirement is sorted order.'),
    q('How does Java structure a 2D array in memory?', ['As a single contiguous block of rectangular memory', 'As an array of reference pointers pointing to distinct row arrays (arrays of arrays)', 'As a linked list of primitive values', 'As a stack of virtual memory registers'], 1, 'Java implements 2D arrays as "arrays of arrays." The outer array holds references to inner row arrays. These rows may be scattered across the Heap and can have different lengths (jagged arrays). Why others are wrong: It is NOT a single contiguous block (unlike C/C++ 2D arrays). It is not a linked list. It is not CPU registers.'),
    q('What is the time complexity of accessing an element by index in a Java array?', ['O(n) — must scan from the beginning', 'O(1) — constant time via address calculation', 'O(log n) — binary search required', 'O(n²) — nested loop required'], 1, 'Array access is O(1) because the memory address is calculated directly: base_address + (index × element_size). No scanning or searching is needed. This is why arrays are the fastest structure for indexed access. Why others are wrong: O(n) is for LinkedList access. O(log n) is for binary search. O(n²) is for nested operations.'),
    q('Why does ArrayList often outperform LinkedList in practice, even for operations where LinkedList has better Big-O complexity?', ['ArrayList uses less code', 'ArrayList\'s contiguous array layout exploits CPU cache locality (spatial prefetching), while LinkedList nodes are scattered across the Heap causing cache misses', 'LinkedList is deprecated in modern Java', 'ArrayList compresses data automatically'], 1, 'CPU cache lines (64 bytes) prefetch contiguous memory automatically. ArrayList\'s backing array benefits from spatial locality. LinkedList nodes are individual Heap objects scattered randomly, causing L1/L2 cache misses on every traversal. This "mechanical sympathy" effect can yield 10x+ real-world performance differences. Why others are wrong: It is not about code size. LinkedList is not deprecated. ArrayList does not compress data.')
  ],
  [
    'Arrays allocate contiguous fixed-size memory on the Heap, enabling O(1) indexed access via address calculation.',
    'Java 2D arrays are jagged "arrays of arrays" — rows can have different lengths and are scattered on the Heap.',
    'Binary Search provides O(log n) performance but STRICTLY requires pre-sorted datasets.',
    'Arrays.sort() uses Dual-Pivot QuickSort for primitives and stable TimSort for objects.',
    'CPU cache locality explains why contiguous arrays often outperform linked structures in practice.'
  ],
  'If you want to use a big terminal on your own computer instead of the built-in one, please read Lesson 1 for full JDK setup instructions.'
),

// ==========================================
// LESSON 14: STRING MANIPULATION, STRINGBUILDER & REGEX
// ==========================================
L(
  'java-14', 14, 'String Manipulation, StringBuilder & Regex', '📝',
  '📝 Text processing is fundamental to every application — from user input validation to log parsing to network protocol handling. Java\'s String class is one of the most optimized classes in the JVM, featuring immutability guarantees, a dedicated String Pool for memory sharing, and deep JIT compiler integration. Understanding String immutability, StringBuilder performance, and Regular Expression pattern matching is essential for writing efficient, secure text-processing code.',
  [
    {
      title: '1. String Pool & Immutability',
      beginner: 'In Java, Strings are IMMUTABLE — once created, they can NEVER be changed. When you "modify" a String, Java actually creates a brand new String object. To save memory, Java stores all String literals in a special cache called the String Pool. If two variables hold "hello", they point to the SAME pooled object!',
      advanced: 'String immutability is enforced by: (1) the class is final (cannot be subclassed), (2) the internal byte[]/char[] array is private final, (3) no methods mutate internal state. Benefits: thread safety without synchronization, safe use as HashMap keys (hashCode never changes), security (class names, URLs, file paths cannot be mutated after validation). The String Pool (intern pool) is stored in the Heap (moved from PermGen to Heap in Java 7). String literals are automatically interned at class load time. String.intern() manually adds to the pool. Since Java 9, Strings use a compact byte[] representation (Latin-1 encoding for ASCII strings) instead of char[], reducing memory by ~50% for English text.'
    },
    {
      title: '2. StringBuilder vs StringBuffer',
      beginner: 'Because Strings are immutable, concatenating in a loop creates a NEW object every iteration — incredibly wasteful! StringBuilder is a mutable text builder that edits in-place without creating garbage. Use it whenever you build strings in loops. StringBuffer is the same but thread-safe (synchronized) — slower, but safe for multi-threaded code.',
      advanced: 'StringBuilder maintains an internal mutable char[]/byte[] buffer (default capacity 16). append(), insert(), delete() mutate the buffer in-place — O(1) amortized per operation. When capacity is exceeded, the buffer grows by (oldCapacity * 2 + 2) and copies via Arrays.copyOf. String concatenation in loops: s += "x" compiles to new StringBuilder().append(s).append("x").toString() — creating TWO objects per iteration (StringBuilder + new String). For n iterations, this is O(n²) garbage. StringBuilder in a loop is O(n). StringBuffer adds synchronized to every method — use ONLY when multiple threads mutate the same buffer concurrently (rare). The JIT compiler can optimize simple concatenation chains via invokedynamic StringConcatFactory (Java 9+).'
    },
    {
      title: '3. Essential String Methods & Operations',
      beginner: 'String provides dozens of built-in methods: length() counts characters, charAt(i) gets one character, substring(start, end) extracts a piece, indexOf("text") finds position, contains("text") checks existence, toUpperCase()/toLowerCase() change case, split(",") breaks into an array, and trim()/strip() remove whitespace.',
      advanced: 'Key String operations and their complexity: length() O(1) (stored field). charAt(i) O(1) (array access). indexOf(String) O(n*m) naive, but HotSpot uses optimized intrinsic implementations with SIMD vectorization for common patterns. substring() O(1) in Java 7+ (shares backing array via offset — changed in Java 7u6 to copy for GC friendliness). split(String regex) compiles regex per call — cache Pattern for repeated use. equals() O(n) with early exit on length mismatch. hashCode() O(n) with caching (computed once, stored in hash field). compareTo() O(n) lexicographic. Since Java 11: isBlank(), strip() (Unicode-aware vs trim() ASCII-only), lines(), repeat(n).'
    },
    {
      title: '4. Regular Expressions (Pattern & Matcher)',
      beginner: 'Regular Expressions (Regex) are special text patterns used for searching, validating, and extracting data. \\d matches digits, \\w matches word characters, + means "one or more", {3} means "exactly three." Java provides Pattern (compiled regex) and Matcher (execution engine) classes.',
      advanced: 'The java.util.regex package implements NFA (Non-deterministic Finite Automaton) based regex matching. Pattern.compile(regex) compiles the regex into an internal automaton (expensive — cache and reuse). matcher.find() searches for matches, matcher.matches() requires full-string match, matcher.group(n) extracts capture groups. Key classes: Pattern (compiled, immutable, thread-safe), Matcher (stateful, NOT thread-safe). Common patterns: \\b[0-9]{3}\\b (3-digit number), ^[\\w.]+@[\\w.]+\\.\\w+$ (email), (?<name>...) (named groups). Performance: regex with backtracking (.*, alternation) can be exponential — avoid catastrophic backtracking on user input. For simple operations (contains, startsWith), prefer String methods over regex.'
    },
    {
      title: '5. String Formatting & Template Patterns',
      beginner: 'Java offers multiple ways to build formatted strings: String.format("Hello %s, age %d", name, age) uses printf-style placeholders. Since Java 15, Text Blocks (triple quotes) allow multi-line strings. And f-string-like formatting can be achieved with String.formatted() (Java 15+).',
      advanced: '(Expert Teaser) String formatting options: (1) String.format()/printf: uses java.util.Formatter, supports %s, %d, %f, %t (date), locale-aware. Slow for hot paths (reflection + parsing). (2) MessageFormat: {0}, {1} placeholders, locale-aware. (3) Text Blocks (Java 15, JEP 378): """ multi-line """ with automatic indentation stripping. (4) StringConcatFactory (Java 9+): the JIT uses invokedynamic for + concatenation, generating optimized bytecode at runtime. (5) StringBuilder for loop concatenation. In the Expert track, we explore how StringConcatFactory generates specialized concatenation strategies (byte[] vs char[], Latin-1 vs UTF-16) at JIT compile time, and how GraalVM\'s partial escape analysis can eliminate StringBuilder allocation entirely for simple concatenation chains.'
    }
  ],
  {
    title: '🛠️ Mini-Project: Regex Log Parser & StringBuilder Report Generator',
    intro: '⚠️ NOTE: Build a utility that processes raw server log strings, extracts HTTP error codes using compiled Regex patterns, builds an efficient report using StringBuilder, and demonstrates the performance difference between String concatenation and StringBuilder.',
    steps: [
      'Create a file named LogParser.java with the standard public class and main method boilerplate.',
      'Import java.util.regex.Pattern and java.util.regex.Matcher.',
      'Create a raw log String: String logs = "192.168.1.1 GET /api 200\\n10.0.0.5 POST /login 401\\n172.16.0.9 GET /data 500\\n192.168.1.1 GET /home 200";.',
      'Compile a Pattern for HTTP status codes: Pattern codePattern = Pattern.compile("\\\\b[0-9]{3}\\\\b");.',
      'Create a Matcher: Matcher m = codePattern.matcher(logs);.',
      'Loop with while (m.find()) and collect all codes into a StringBuilder report: StringBuilder report = new StringBuilder("Error Report:\\n");.',
      'Inside the loop, check if the code starts with "4" or "5" (client/server errors) and append to report.',
      'Demonstrate performance: Time String concatenation in a loop (String s = ""; for 10000 iterations s += "x") vs StringBuilder. Print elapsed times.',
      'Print the final report: System.out.println(report.toString());.',
      'Compile and execute: javac LogParser.java && java LogParser.'
    ],
    goal: 'You managed text processing utilizing the String Pool, optimized concatenation with StringBuilder vs String, and validated/extracted patterns with compiled Regex.'
  },
  [
    q('Why are Strings designed to be immutable in Java?', ['To allow dynamic memory resizing at runtime', 'To enforce thread safety, enable safe caching in the String Pool, and prevent security vulnerabilities from post-validation mutation', 'Because characters take up too much memory to modify', 'To allow strings to inherit from the Integer class'], 1, 'Immutability guarantees: (1) thread safety without synchronization, (2) safe sharing in the String Pool, (3) stable hashCode for HashMap keys, (4) security — validated strings (class names, URLs) cannot be mutated after checks. Why others are wrong: Immutability does not enable dynamic resizing. It is not about memory size of characters. String does not inherit from Integer.'),
    q('What is the primary difference between StringBuilder and StringBuffer?', ['StringBuilder is mutable; StringBuffer is immutable', 'StringBuffer is synchronized (thread-safe) but slower; StringBuilder is unsynchronized and faster for single-threaded use', 'StringBuilder only handles integers', 'StringBuffer cannot be converted back to a String'], 1, 'StringBuffer adds synchronized to every method for thread safety, incurring locking overhead. StringBuilder has no synchronization — use it in single-threaded contexts (99% of cases). Both are mutable. Both produce String via toString(). Why others are wrong: Both are mutable. StringBuilder handles all characters. Both convert to String.'),
    q('Which regex pattern matches exactly three consecutive digits?', ['\\D{3}', '[a-z]{3}', '\\d{3}', '\\w+3'], 2, '\\d is the digit character class [0-9]. {3} is the quantifier meaning "exactly three occurrences." Combined: \\d{3} matches exactly three digits. Why others are wrong: \\D matches NON-digits. [a-z]{3} matches three lowercase letters. \\w+3 is malformed (\\w+ means one or more word chars, then literal 3).'),
    q('What happens when you concatenate Strings using + inside a loop (s += "x") for 10,000 iterations?', ['Java optimizes it automatically to O(n) performance', 'Each iteration creates a new StringBuilder AND a new String object, resulting in O(n²) time complexity and massive garbage collection pressure', 'The loop fails with an OutOfMemoryError immediately', 'Java converts the String to a StringBuilder automatically'], 1, 's += "x" compiles to: new StringBuilder().append(s).append("x").toString(). Each iteration allocates 2 objects and copies the entire accumulated string. For n iterations: O(n²) character copies and 2n object allocations. Use StringBuilder.append() in loops for O(n). Why others are wrong: The JIT does NOT optimize this pattern away. It does not immediately OOM (but stresses GC). Java does not auto-convert.'),
    q('Why should you cache and reuse a compiled Pattern object instead of calling String.matches(regex) repeatedly?', ['Pattern objects are smaller in memory', 'Pattern.compile() is expensive (builds an automaton); String.matches() recompiles the regex on EVERY call — caching avoids redundant compilation', 'String.matches() is deprecated', 'Pattern objects run in parallel automatically'], 1, 'Pattern.compile(regex) parses and builds an NFA automaton — expensive O(m) operation. String.matches(regex) internally calls Pattern.compile(regex).matches() — recompiling every call. For repeated matching, compile once and reuse the Pattern (thread-safe). Why others are wrong: It is not about memory size. matches() is not deprecated. Pattern does not auto-parallelize.')
  ],
  [
    'Java Strings are strictly immutable — operations that "modify" text always create new objects.',
    'The String Pool interns literals to share memory; use .intern() for manual pooling.',
    'Use StringBuilder in loops to prevent O(n²) garbage from String concatenation.',
    'Compile Pattern objects once and reuse — never call String.matches() in hot loops.',
    'Since Java 9, Strings use compact byte[] (Latin-1) representation, halving memory for ASCII text.'
  ],
  'If you want to use a big terminal on your own computer instead of the built-in one, please read Lesson 1 for full JDK setup instructions.'
),

// ==========================================
// LESSON 15: JAVA COLLECTIONS FRAMEWORK — LISTS & SETS
// ==========================================
L(
  'java-15', 15, 'Java Collections Framework — Lists & Sets', '📚',
  '📚 The Java Collections Framework (JCF) provides standardized, dynamic data structures that automatically resize, enforce uniqueness, and maintain ordering. Unlike fixed-size arrays, collections grow and shrink as needed. Understanding when to use ordered Lists (ArrayList vs LinkedList) versus unique Sets (HashSet vs TreeSet) — and the Big-O performance implications of each — is the single most important data structure decision you will make in Java engineering.',
  [
    {
      title: '1. Lists: ArrayList vs LinkedList',
      beginner: 'A List is an ordered collection that ALLOWS duplicates and maintains insertion order. ArrayList is like a dynamic array — instant access by index, but slow insertions in the middle. LinkedList is like a chain of connected nodes — fast insertions/deletions at known positions, but slow index-based access.',
      advanced: 'ArrayList: backed by a resizable Object[] array. get(i) is O(1) (direct array access). add(element) is O(1) amortized (append to end). add(i, element) is O(n) (shifts trailing elements). Default capacity 10, grows by 1.5x. Implements RandomAccess marker interface (signals O(1) random access to algorithms). LinkedList: doubly-linked nodes (prev/next pointers). get(i) is O(n) (traverse from head or tail). addFirst()/addLast() O(1). add(i, element) O(n) for traversal but O(1) insertion once node found. Implements Deque interface (can act as stack/queue). Memory: ArrayList stores references in contiguous array (cache-friendly). LinkedList allocates a Node object per element (16-byte header + 2 pointers + element ref = ~40 bytes overhead per element). In practice, ArrayList outperforms LinkedList for nearly ALL use cases due to cache locality.'
    },
    {
      title: '2. Sets: HashSet vs TreeSet vs LinkedHashSet',
      beginner: 'A Set is a collection that REJECTS duplicates! HashSet is the fastest but gives no ordering guarantees. TreeSet keeps elements sorted but is slightly slower. LinkedHashSet maintains insertion order. Sets rely on hashCode() and equals() to detect duplicates.',
      advanced: 'HashSet: backed by HashMap (elements are keys, dummy PRESENT object is value). add/get/remove are O(1) average. No ordering. Requires proper hashCode()/equals() implementation. TreeSet: backed by TreeMap (Red-Black tree). add/get/remove are O(log n). Elements sorted by natural ordering (Comparable) or Comparator. NavigableSet interface provides floor(), ceiling(), headSet(), tailSet(). LinkedHashSet: HashMap + doubly-linked list for insertion-order iteration. O(1) operations with predictable iteration order. The Set contract: no duplicate elements (as defined by equals()). Adding a duplicate returns false and does not modify the set. Null handling: HashSet allows one null. TreeSet rejects null (NullPointerException on compareTo).'
    },
    {
      title: '3. Performance Comparison & Big-O Analysis',
      beginner: 'Choosing the right collection is critical for performance. Need to check if an item exists among a million items? List.contains() checks one by one (slow — O(n)). HashSet.contains() uses hashing to find it instantly (fast — O(1)). The right choice can make your app 1000x faster!',
      advanced: 'Big-O comparison: ArrayList.get(i) O(1), ArrayList.contains(x) O(n), LinkedList.get(i) O(n), LinkedList.addFirst() O(1), HashSet.contains(x) O(1) average / O(n) worst (hash collisions), TreeSet.contains(x) O(log n), TreeSet.first()/last() O(log n). For n = 1,000,000: ArrayList.contains() = 1,000,000 comparisons. HashSet.contains() = 1 hash computation + 1 equals check. This is why Sets are mandatory for membership testing, deduplication, and lookup-heavy workloads. The Collections.unmodifiableList()/Set() wrappers create read-only views. List.of()/Set.of() (Java 9+) create immutable factory collections.'
    },
    {
      title: '4. The Collection Interface Hierarchy',
      beginner: 'All collections share a common ancestor: the Collection interface. It defines the basic operations: add(), remove(), contains(), size(), iterator(). List, Set, and Queue all extend Collection. But Map does NOT — it has its own separate hierarchy because it stores key-value pairs, not individual elements.',
      advanced: 'The JCF hierarchy: Iterable → Collection → (List, Set, Queue). Map is a SEPARATE root interface (does NOT extend Collection). This is a common interview question. Key interfaces: Collection (base), List (ordered, duplicates), Set (unique), Queue (FIFO/priority), Deque (double-ended), Map (key-value), SortedSet/NavigableSet, SortedMap/NavigableMap. The Collections utility class provides static methods: sort(), shuffle(), unmodifiableList(), synchronizedList(), emptyList(). The Arrays utility bridges arrays and collections: Arrays.asList(), Arrays.stream(). Since Java 9: List.of(), Set.of(), Map.of() create compact immutable collections.'
    },
    {
      title: '5. Internal Data Structures & Fail-Fast Iterators',
      beginner: 'When you loop through a collection with a for-each loop, Java uses an Iterator behind the scenes. If you modify the collection DURING iteration (add or remove elements), Java throws a ConcurrentModificationException to protect you from corrupted data. This is called "fail-fast" behavior.',
      advanced: '(Expert Teaser) All JCF iterators are fail-fast: they maintain a modCount field that tracks structural modifications. If modCount changes during iteration (via collection.add/remove instead of iterator.remove()), the iterator throws ConcurrentModificationException on the next next() call. This is NOT thread-safety — it only detects single-threaded structural modification. For concurrent access, use ConcurrentHashMap, CopyOnWriteArrayList, or Collections.synchronizedList(). Internal structures: ArrayList uses Object[] with System.arraycopy for shifts. HashMap uses Node[] buckets + linked list / Red-Black tree (Java 8+ treeifies buckets with >8 nodes). In the Expert track, we explore how JMH benchmarks reveal that ArrayList.iterator() allocates zero heap objects (JIT scalar replacement), how concurrent collections use lock striping and CAS operations, and how the Vector API can process collection elements in SIMD batches.'
    }
  ],
  {
    title: '🛠️ Mini-Project: Unique Visitor Tracker & Performance Comparator',
    intro: '⚠️ NOTE: Build a dynamic registration system that records sequential login attempts in an ArrayList (preserving duplicates and order), automatically deduplicates unique visitors using a HashSet, and compares contains() performance between List and Set.',
    steps: [
      'Create a file named VisitorTracker.java with the standard public class and main method boilerplate.',
      'Import java.util.ArrayList, java.util.HashSet, java.util.List, java.util.Set.',
      'Instantiate collections: List<String> loginTimeline = new ArrayList<>(); Set<String> uniqueVisitors = new HashSet<>();.',
      'Add mock data with duplicates: String[] attempts = {"Alice", "Bob", "Alice", "Charlie", "Bob", "Alice", "Diana"};.',
      'Loop through attempts: add each to loginTimeline (preserves order + duplicates) AND to uniqueVisitors (auto-deduplicates).',
      'Print the timeline: System.out.println("Timeline: " + loginTimeline); — observe duplicates and order preserved.',
      'Print unique visitors: System.out.println("Unique: " + uniqueVisitors); — observe no duplicates.',
      'Performance test: Add 100,000 strings to both an ArrayList and a HashSet. Time list.contains("target") vs set.contains("target"). Print elapsed times.',
      'Demonstrate fail-fast: Try modifying the list during a for-each loop and observe the ConcurrentModificationException.',
      'Compile and execute: javac VisitorTracker.java && java VisitorTracker.'
    ],
    goal: 'You implemented dynamic collections, distinguished between ordered Lists and deduplicated Sets, compared O(n) vs O(1) contains() performance, and observed fail-fast iterator behavior.'
  },
  [
    q('Which Collection implementation should you choose if you need lightning-fast retrieval of elements by their integer index?', ['LinkedList', 'TreeSet', 'ArrayList', 'HashSet'], 2, 'ArrayList uses a contiguous backing array, providing O(1) constant-time access by index via direct array lookup. It also implements the RandomAccess marker interface. Why others are wrong: LinkedList.get(i) is O(n) (traverse nodes). TreeSet and HashSet do not support index-based access at all (no get(i) method).'),
    q('How does a HashSet determine if an incoming object is a duplicate?', ['By checking the variable names', 'By comparing the string lengths', 'By evaluating the object\'s hashCode() to find the bucket, then equals() to confirm identity', 'By compiling the code sequentially'], 2, 'HashSet is backed by HashMap. On add(element): (1) compute hashCode() to find bucket index, (2) if bucket is empty → add, (3) if bucket has nodes → call equals() on each node to check for duplicates. This is why overriding equals() REQUIRES overriding hashCode() — equal objects must hash to the same bucket. Why others are wrong: Variable names and string lengths are irrelevant. Compilation order has no effect.'),
    q('What is the defining characteristic of a TreeSet compared to a HashSet?', ['It permits multiple duplicate entries', 'It stores elements in a completely random order', 'It stores elements in sorted ascending order using a Red-Black tree, with O(log n) operations', 'It allows O(1) insertion time across the board'], 2, 'TreeSet is backed by TreeMap (Red-Black self-balancing tree). Elements are maintained in sorted order (natural ordering via Comparable, or custom Comparator). All operations (add, remove, contains) are O(log n). It also provides NavigableSet methods: first(), last(), floor(), ceiling(), headSet(), tailSet(). Why others are wrong: Sets reject duplicates. TreeSet is NOT random (it is sorted). Operations are O(log n), not O(1).'),
    q('What happens if you modify a collection (add/remove elements) while iterating over it with a for-each loop?', ['The loop silently skips the modified elements', 'The iterator throws a ConcurrentModificationException (fail-fast behavior)', 'The collection automatically creates a backup copy', 'The JVM pauses garbage collection'], 1, 'JCF iterators are fail-fast. They track a modCount field. Structural modification via collection methods (not iterator.remove()) increments modCount. On the next iterator.next(), the mismatch is detected and ConcurrentModificationException is thrown. Use iterator.remove() for safe removal during iteration. Why others are wrong: It does not silently skip. No backup copy is created. GC is unaffected.'),
    q('Why is ArrayList almost always preferred over LinkedList in modern Java, even for operations where LinkedList theoretically has better Big-O?', ['LinkedList is deprecated since Java 11', 'ArrayList\'s contiguous array layout exploits CPU cache locality; LinkedList\'s scattered Node objects cause cache misses that dominate the theoretical Big-O advantage', 'LinkedList cannot store String objects', 'ArrayList uses less source code to write'], 1, 'Despite LinkedList\'s O(1) addFirst() vs ArrayList\'s O(n) shift, the constant factors and cache behavior favor ArrayList. Each LinkedList node is a separate Heap object (~40 bytes overhead) scattered randomly, causing L1/L2 cache misses. ArrayList\'s backing array is contiguous, enabling CPU spatial prefetching. JMH benchmarks consistently show ArrayList winning for nearly all workloads. Why others are wrong: LinkedList is NOT deprecated. It CAN store Strings. Code length is irrelevant.')
  ],
  [
    'Lists maintain insertion order and permit duplicates — ArrayList for index access, LinkedList for frequent head/tail operations.',
    'Sets strictly reject duplicates — HashSet for O(1) lookups, TreeSet for sorted O(log n) operations.',
    'HashSet requires proper hashCode()/equals() overrides to function correctly.',
    'ArrayList\'s contiguous array layout exploits CPU cache locality, outperforming LinkedList in practice.',
    'JCF iterators are fail-fast — modifying a collection during iteration throws ConcurrentModificationException.'
  ],
  'If you want to use a big terminal on your own computer instead of the built-in one, please read Lesson 1 for full JDK setup instructions.'
),

L(
  'java-16', 16, 'Java Collections Framework — Maps & Queues', '🗺️',
  '🗺️ Maps and Queues complete the Collections Framework arsenal. Maps provide O(1) key-value lookups that power everything from caching layers to database indexes. Queues manage ordered processing pipelines that drive task schedulers, message brokers, and breadth-first search algorithms. Understanding the internal data structures — hash buckets, Red-Black trees, binary heaps — is what separates developers who use collections from engineers who select them strategically for performance-critical systems.',
  [
    {
      title: '1. HashMap Internals (Buckets & Treeification)',
      beginner: 'A HashMap stores key-value pairs like a dictionary. When you put("name", "Alice"), Java calculates a number from the key (its hashCode) to decide which "bucket" to store it in. Finding the value later is instant because Java goes directly to that bucket. If two keys hash to the same bucket (a collision), they are chained together.',
      advanced: 'HashMap is backed by a Node[] array (default capacity 16). On put(key, value): (1) compute key.hashCode(), (2) spread hash via (h ^ (h >>> 16)), (3) find bucket index via (n-1) & hash, (4) if bucket empty → store Node, (5) if collision → chain via linked list. Since Java 8, when a bucket chain exceeds 8 nodes AND the table has ≥64 buckets, the linked list TREEIFIES into a Red-Black Tree (O(n) → O(log n) worst case). Load factor 0.75 triggers resize (double capacity) when threshold exceeded. Keys MUST implement hashCode()/equals() correctly. Null keys are allowed (stored in bucket 0). HashMap is NOT thread-safe.'
    },
    {
      title: '2. TreeMap & LinkedHashMap (Ordered Maps)',
      beginner: 'HashMap gives you speed but no order. TreeMap keeps all keys SORTED automatically (like a phone book). LinkedHashMap remembers the ORDER you inserted items (like a playlist). Choose based on whether you need sorted keys or insertion-order iteration.',
      advanced: 'TreeMap is backed by a Red-Black self-balancing binary search tree. All operations (put, get, remove) are O(log n). Keys must be Comparable or a Comparator must be provided. Provides NavigableMap API: firstKey(), lastKey(), floorKey(), ceilingKey(), headMap(), tailMap(), subMap(). LinkedHashMap extends HashMap with a doubly-linked list threading all entries in insertion order (or access-order for LRU caches). Iteration is O(size) regardless of capacity. Both are NOT thread-safe.'
    },
    {
      title: '3. Queue & Deque (FIFO Processing)',
      beginner: 'A Queue works like a line at a store — First In, First Out (FIFO). You add to the back (offer) and remove from the front (poll). ArrayDeque is a double-ended queue that can act as both a stack (LIFO) and a queue (FIFO), and is faster than LinkedList for both use cases.',
      advanced: 'The Queue interface defines: offer() (add to tail), poll() (remove head, returns null if empty), peek() (view head without removing). ArrayDeque is backed by a circular Object[] array — faster than LinkedList for both stack and queue operations due to cache locality and no Node allocation overhead. Deque (Double-Ended Queue) adds: addFirst(), addLast(), pollFirst(), pollLast(). LinkedList implements Deque but is rarely optimal. BlockingQueue implementations (LinkedBlockingQueue, ArrayBlockingQueue) add thread-safe put()/take() with blocking semantics for producer-consumer patterns.'
    },
    {
      title: '4. PriorityQueue (Binary Heap)',
      beginner: 'A PriorityQueue is NOT a normal line — it is a smart line where the most important item always jumps to the front. The smallest (or highest-priority) element is always at the head. Internally, it uses a binary heap — a tree stored in an array.',
      advanced: 'PriorityQueue is backed by a binary min-heap stored in an Object[] array. The heap invariant: parent ≤ children. offer() is O(log n) — sift-up to restore heap property. poll() is O(log n) — remove root, move last element to root, sift-down. peek() is O(1) — view root. Default ordering is natural ordering (min-heap); pass Comparator.reverseOrder() for max-heap. Does NOT permit null elements. NOT thread-safe — use PriorityBlockingQueue for concurrent access. The heap array grows by 50% when capacity is exceeded.'
    },
    {
      title: '5. Map Iteration & ConcurrentHashMap (Expert Teaser)',
      beginner: 'You cannot loop through a Map directly with a for-each. Instead, you loop through its entrySet() (key-value pairs), keySet() (just keys), or values() (just values). entrySet() is the most efficient because it gives you both key and value in one step.',
      advanced: '(Expert Teaser) Map iteration patterns: (1) entrySet() — most efficient, single traversal yields both key and value. (2) keySet() + get() — two lookups per entry, O(n) extra hash computations. (3) values() — when only values needed. Java 8+ adds forEach(BiConsumer) for lambda iteration. ConcurrentHashMap (java.util.concurrent) provides thread-safe maps WITHOUT locking the entire map. It uses lock striping (Java 7: 16 segments) or CAS + synchronized on individual buckets (Java 8+). Reads are lock-free (volatile Node values). Writes synchronize on the bucket head node. size() uses a distributed counter (baseCount + CounterCell[]). In the Expert track, we explore how ConcurrentHashMap.computeIfAbsent() enables atomic cache population, how lock striping compares to ReadWriteLock, and how the ForkJoinPool leverages concurrent collections for parallel stream processing.'
    }
  ],
  {
    title: '🛠️ Mini-Project: Support Ticket Queue & Resolution Map',
    intro: '⚠️ NOTE: Build a customer service simulator that queues incoming support tickets using ArrayDeque (FIFO processing), stores resolved tickets in a HashMap for O(1) lookup, and demonstrates PriorityQueue for urgent ticket escalation.',
    steps: [
      'Create a file named SupportDesk.java with the standard public class and main method boilerplate.',
      'Import java.util.ArrayDeque, java.util.HashMap, java.util.PriorityQueue, java.util.Queue, java.util.Map.',
      'Create a FIFO queue for incoming tickets: Queue<String> ticketQueue = new ArrayDeque<>();.',
      'Add tickets: ticketQueue.offer("T-101: Login issue"); ticketQueue.offer("T-102: Payment failed"); ticketQueue.offer("T-103: UI bug");.',
      'Process tickets in order: while (!ticketQueue.isEmpty()) { String ticket = ticketQueue.poll(); System.out.println("Processing: " + ticket); }.',
      'Create a resolution map: Map<String, String> resolutions = new HashMap<>();.',
      'Store resolutions: resolutions.put("T-101", "Password reset sent"); resolutions.put("T-102", "Refund processed");.',
      'Lookup a resolution: System.out.println("T-101 resolution: " + resolutions.get("T-101"));.',
      'Create a priority queue for urgent tickets: PriorityQueue<String> urgentQueue = new PriorityQueue<>();.',
      'Add urgent tickets and poll them: observe that they come out in SORTED order, not insertion order.',
      'Iterate the map efficiently: for (Map.Entry<String, String> entry : resolutions.entrySet()) { System.out.println(entry.getKey() + " → " + entry.getValue()); }.',
      'Compile and execute: javac SupportDesk.java && java SupportDesk.'
    ],
    goal: 'You implemented FIFO processing pipelines using ArrayDeque, O(1) key-value lookups using HashMap, priority-based scheduling using PriorityQueue, and efficient Map iteration using entrySet().'
  },
  [
    q('What happens if you insert a Key-Value pair into a HashMap where the Key already exists?', ['An Exception is thrown and the program crashes', 'The new pair is appended, creating a duplicate key', 'The existing value is silently overwritten with the new value', 'The Map automatically resizes to accommodate both keys'], 2, 'Map keys must be unique. HashMap.put(existingKey, newValue) overwrites the old value and returns it. The size does not change. Why others are wrong: No exception is thrown. Duplicate keys are impossible by contract. No resize occurs for overwrites.'),
    q('Which Collection interface does the Map class extend?', ['List', 'Set', 'Collection', 'None of the above — Map has its own separate hierarchy'], 3, 'Map is a SEPARATE root interface. It does NOT extend Collection. This is because Map stores key-value pairs, not individual elements. The Collections utility class bridges them, but the type hierarchies are distinct. Why others are wrong: Map is not a List, Set, or Collection subtype. This is a common interview question.'),
    q('How does a PriorityQueue determine which element should be at the front of the line?', ['Based on the order they were inserted (FIFO)', 'Based on their natural ordering or a custom Comparator (smallest/highest-priority at head)', 'Based on a random number generator', 'Based on the size of the objects'], 1, 'PriorityQueue is backed by a binary min-heap. The head is always the smallest element (natural ordering) or the highest-priority element (custom Comparator). Why others are wrong: It is NOT FIFO. It is not random. Object size is irrelevant.'),
    q('What internal data structure does HashMap use when a single bucket accumulates more than 8 colliding entries (Java 8+)?', ['A doubly-linked list', 'A Red-Black Tree (treeification)', 'An ArrayList', 'A HashSet'], 1, 'Since Java 8, when a bucket chain exceeds 8 nodes AND the table has ≥64 buckets, HashMap converts the linked list to a Red-Black Tree. This improves worst-case lookup from O(n) to O(log n), protecting against hash-flooding attacks. Why others are wrong: It was a linked list BEFORE Java 8. ArrayList and HashSet are not used internally for bucket storage.'),
    q('Why is entrySet() iteration more efficient than keySet() + get() for processing all Map entries?', ['entrySet() uses less source code', 'entrySet() provides both key and value in a single traversal; keySet() + get() performs an extra hash lookup for every entry', 'keySet() is deprecated in modern Java', 'entrySet() automatically sorts the entries'], 1, 'entrySet() yields Map.Entry objects containing both key and value — one hash computation per entry. keySet() iteration followed by map.get(key) performs TWO hash lookups per entry (one for iteration, one for retrieval), doubling the work. Why others are wrong: It is not about code length. keySet() is not deprecated. entrySet() does not sort.')
  ],
  [
    'HashMap provides O(1) average lookups via hash buckets; treeification (Java 8+) protects against collisions.',
    'TreeMap maintains sorted keys via Red-Black tree (O(log n)); LinkedHashMap preserves insertion order.',
    'ArrayDeque outperforms LinkedList for both stack and queue operations due to cache locality.',
    'PriorityQueue uses a binary heap for O(log n) priority-based retrieval.',
    'Map does NOT extend Collection; iterate via entrySet() for maximum efficiency.'
  ],
  'If you want to use a big terminal on your own computer instead of the built-in one, please read Lesson 1 for full JDK setup instructions.'
),

// ==========================================
// LESSON 17: GENERICS & TYPE SAFETY
// ==========================================
L(
  'java-17', 17, 'Generics & Type Safety', '🔒',
  '🔒 Generics are Java\'s compile-time type safety net. They eliminate the dangerous cast-from-Object patterns of pre-Java 5 code, catch type mismatches at compile time instead of runtime, and enable writing truly reusable data structures. But generics in Java come with a surprising secret: they are erased at compile time. Understanding Type Erasure, wildcards, and the PECS principle is essential for mastering Java\'s type system and writing library-grade code.',
  [
    {
      title: '1. Generic Classes & Methods',
      beginner: 'Generics let you write ONE class that works with ANY type. Instead of creating IntegerBox, StringBox, and UserBox separately, you create Box<T> — a single blueprint where T is a placeholder. When you use it, you specify the actual type: Box<String> or Box<Integer>.',
      advanced: 'Type parameters (<T>, <E>, <K>, <V>) parameterize classes, interfaces, and methods. The compiler enforces type constraints at compile time, eliminating the need for manual downcasting from Object and preventing ClassCastException at runtime. Generic method syntax: public <T> T process(T input). Type parameters can be bounded: <T extends Comparable<T>> restricts T to types implementing Comparable. Multiple bounds: <T extends Serializable & Comparable<T>>. Generic type information is used ONLY at compile time for verification.'
    },
    {
      title: '2. Type Erasure (The Big Secret)',
      beginner: 'Here is the surprise: Java generics are a compile-time trick! After compilation, all <T> placeholders are DELETED and replaced with Object (or the bound type). This is called Type Erasure. It exists so that old Java code (pre-Java 5) can still run with new generic code.',
      advanced: 'Type Erasure (JLS §4.6) removes all generic type information during compilation. Unbounded type parameters (<T>) are erased to Object. Bounded type parameters (<T extends Number>) are erased to their first bound (Number). The compiler inserts explicit casts at retrieval points: (String) list.get(0). This means: (1) You cannot use instanceof with generic types (x instanceof List<String> is illegal). (2) You cannot create arrays of generic types (new T[] is illegal). (3) You cannot use primitives as type arguments (List<int> is illegal — use List<Integer>). (4) All List<String> and List<Integer> become raw List at runtime. Type erasure ensures backward compatibility with pre-Java 5 bytecode.'
    },
    {
      title: '3. Wildcards (? extends T, ? super T)',
      beginner: 'Wildcards make generics flexible. List<? extends Number> means "a list of Number OR any subclass (Integer, Double)". You can READ from it safely. List<? super Integer> means "a list of Integer OR any parent (Number, Object)". You can WRITE to it safely. Remember: PECS — Producer Extends, Consumer Super.',
      advanced: 'The PECS principle (Producer Extends, Consumer Super) governs wildcard usage: (1) ? extends T (Upper Bounded): You can READ T from the collection (producer), but CANNOT add to it (except null). The compiler knows elements are AT LEAST T. (2) ? super T (Lower Bounded): You can ADD T to the collection (consumer), but can only READ as Object. The compiler knows elements are AT MOST T. (3) ? (Unbounded): Read as Object, cannot add. Example: Collections.copy(List<? super T> dest, List<? extends T> src). The Collections utility class uses PECS extensively.'
    },
    {
      title: '4. Bounded Type Parameters & Constraints',
      beginner: 'You can restrict what types are allowed. <T extends Number> means T must be Number or a subclass (Integer, Double, etc.). This lets you call Number methods like .doubleValue() on the generic parameter safely.',
      advanced: 'Bounded type parameters restrict the type argument to a specific hierarchy. <T extends Comparable<T>> enables sorting algorithms that call compareTo(). Multiple bounds use &: <T extends Serializable & Comparable<T>>. The erased type is the FIRST bound. Bounded wildcards in method signatures enable flexible APIs: void process(List<? extends Shape> shapes) accepts List<Circle>, List<Rectangle>, etc. The get-and-put principle: use extends when getting, super when putting, unbounded when both.'
    },
    {
      title: '5. Bridge Methods & Reifiable Types (Expert Teaser)',
      beginner: 'Because generics are erased, the JVM sometimes needs to create hidden "bridge methods" to make sure overriding still works correctly. And some generic types are "reifiable" — they survive erasure because they have no type parameters at all.',
      advanced: '(Expert Teaser) Type erasure creates a problem with method overriding. If class Node<T> has void set(T t) and subclass StringNode extends Node<String> overrides void set(String s), erasure turns the parent into void set(Object). The compiler generates a BRIDGE METHOD: void set(Object t) { set((String) t); } to preserve polymorphism. Reifiable types are types whose generic information survives erasure: raw types (List), unbounded wildcards (List<?>), and non-generic types. Non-reifiable types (List<String>) cannot be used with instanceof, arrays, or varargs safely. In the Expert track, we explore how the compiler generates bridge methods, how super type tokens (Neal Gafter\'s pattern) preserve generic type info at runtime via anonymous subclasses, and how frameworks like Jackson and Gson use TypeToken to deserialize generic collections despite erasure.'
    }
  ],
  {
    title: '🛠️ Mini-Project: Generic Cache Box & Type-Safe Utilities',
    intro: '⚠️ NOTE: Build a flexible generic cache class capable of storing and retrieving any object type while maintaining strict compile-time type safety. Demonstrate bounded generics, generic methods, and wildcard flexibility.',
    steps: [
      'Create a file named GenericCache.java with the standard public class and main method boilerplate.',
      'Declare a generic class: public class Cache<T> { private T item; public void store(T item) { this.item = item; } public T retrieve() { return item; } }.',
      'Create a bounded generic method: public static <T extends Comparable<T>> T findMax(T[] array) { T max = array[0]; for (T val : array) { if (val.compareTo(max) > 0) max = val; } return max; }.',
      'Create a wildcard method: public static void printList(java.util.List<?> list) { for (Object item : list) System.out.println(item); }.',
      'In main, instantiate typed caches: Cache<String> textCache = new Cache<>(); textCache.store("Hello"); Cache<Integer> numCache = new Cache<>(); numCache.store(42);.',
      'Demonstrate type safety: Attempt textCache.store(100); — observe the COMPILATION ERROR. This proves generics catch mistakes at compile time.',
      'Test the bounded method: Integer[] nums = {3, 1, 4, 1, 5}; System.out.println("Max: " + findMax(nums));.',
      'Test the wildcard: java.util.List<String> names = java.util.List.of("Alice", "Bob"); printList(names);.',
      'Compile and execute: javac GenericCache.java && java GenericCache.'
    ],
    goal: 'You designed reusable generic data structures, enforced compile-time type safety, implemented bounded type constraints, and applied wildcard flexibility using the PECS principle.'
  },
  [
    q('What is the primary benefit of using Generics in Java Collections?', ['They make the compiled code execute faster in the CPU', 'They enforce compile-time type safety and eliminate manual object casting', 'They allow storing primitive types like int directly in collections', 'They bypass Type Erasure automatically'], 1, 'Generics guarantee type constraints at compilation, eliminating ClassCastException at runtime and removing the need for manual (String) obj casts. Why others are wrong: Generics do NOT affect runtime speed (they are erased). Collections CANNOT store primitives (only wrapper objects). Type Erasure is fundamental and cannot be bypassed.'),
    q('What happens to generic type parameters like <T> during the compilation process?', ['They are upgraded to advanced memory pointers', 'They are strictly preserved in the compiled bytecode for runtime use', 'They undergo Type Erasure and are replaced by Object or their bounded types', 'They are converted directly into wrapper classes'], 2, 'Type Erasure removes all generic type information after compilation. Unbounded <T> becomes Object; bounded <T extends Number> becomes Number. This ensures backward compatibility with pre-Java 5 bytecode. Why others are wrong: They are not preserved at runtime. They are not memory pointers. They are not converted to wrappers.'),
    q('What does the wildcard signature List<? extends Number> signify?', ['The list can hold ANY object', 'The list can hold objects of type Number or any of its subclasses (like Integer or Double)', 'The list can ONLY hold exactly the Number class, no subclasses', 'The list can only hold String representations of numbers'], 1, 'Upper Bounded Wildcard (? extends Number) restricts the generic type to Number or its subclasses. You can READ Numbers from it safely, but CANNOT add to it (except null). Why others are wrong: It cannot hold ANY object (only Number subtypes). It DOES allow subclasses. It has nothing to do with Strings.'),
    q('According to the PECS principle, which wildcard should you use when you need to READ elements from a collection?', ['? super T', '? extends T (Producer Extends)', '? (unbounded)', 'No wildcard needed'], 1, 'PECS: Producer Extends, Consumer Super. When READING from a collection (it produces elements), use ? extends T. The compiler guarantees elements are at least type T. Why others are wrong: ? super T is for WRITING (consuming). Unbounded ? only allows reading as Object.'),
    q('Why can you NOT write List<int> in Java?', ['int is a reserved keyword', 'Generics require Object types; primitives must be wrapped (List<Integer>)', 'Java does not support int in collections since Java 8', 'It is a syntax error introduced in Java 11'], 1, 'Type erasure replaces <T> with Object. Primitives (int, double, char) are NOT objects and cannot be assigned to Object. You must use wrapper classes: List<Integer>, List<Double>. Why others are wrong: int is not reserved. Primitives were never supported in generics. This limitation exists since Java 5 (generics introduction), not Java 8 or 11.')
  ],
  [
    'Generics enforce compile-time type safety, eliminating ClassCastException and manual casting.',
    'Type Erasure removes generic type information at compile time for backward compatibility.',
    'PECS principle: Producer Extends (? extends T) for reading; Consumer Super (? super T) for writing.',
    'Bounded type parameters (<T extends Number>) restrict generics to specific hierarchies.',
    'Primitives cannot be used as type arguments — always use wrapper classes (Integer, Double).'
  ],
  'If you want to use a big terminal on your own computer instead of the built-in one, please read Lesson 1 for full JDK setup instructions.'
),

// ==========================================
// LESSON 18: EXCEPTION HANDLING & CUSTOM ERRORS
// ==========================================
L(
  'java-18', 18, 'Exception Handling & Custom Errors', '🚨',
  '🚨 Robust applications do not crash when things go wrong — they handle errors gracefully and recover. Java\'s exception system is a structured, type-safe mechanism for signaling and handling exceptional conditions. Understanding the hierarchy (Checked vs Unchecked), the try-catch-finally lifecycle, try-with-resources for automatic cleanup, and designing custom domain exceptions is the foundation of production-grade error handling.',
  [
    {
      title: '1. Checked vs Unchecked Exceptions',
      beginner: 'Java has two families of errors. Checked Exceptions (like FileNotFoundException) are predictable problems the compiler FORCES you to handle — your code won\'t even compile without try-catch or throws. Unchecked Exceptions (like NullPointerException) are usually logic bugs that happen at runtime.',
      advanced: 'The exception hierarchy: Throwable → (Error, Exception). Error: JVM-level failures (OutOfMemoryError, StackOverflowError) — generally unrecoverable, do not catch. Exception → RuntimeException: Unchecked exceptions (NullPointerException, IllegalArgumentException, ArrayIndexOutOfBoundsException) — represent programming errors, not mandatory to handle. Exception (non-RuntimeException): Checked exceptions (IOException, SQLException, FileNotFoundException) — represent recoverable external conditions, MUST be declared via throws or handled via try-catch. The compiler enforces checked exception handling at compile time (Catch or Declare rule).'
    },
    {
      title: '2. try-catch-finally Lifecycle',
      beginner: 'Put risky code in try. If it fails, Java jumps to the matching catch block. The finally block ALWAYS runs at the end — whether an error happened or not. This is where you close files and release resources.',
      advanced: 'Execution flow: (1) try block executes. (2) If exception thrown → search for matching catch block (top-to-bottom, most specific first). (3) finally block executes UNCONDITIONALLY — even if try returns, catch throws, or Thread.interrupt() occurs. The ONLY things that prevent finally from running: System.exit() or JVM crash. Multiple catch blocks can be combined: catch (IOException | SQLException e). The exception variable in multi-catch is effectively final. Java 7+ allows catching multiple exception types in a single block with |.'
    },
    {
      title: '3. try-with-resources (AutoCloseable)',
      beginner: 'Forgetting to close files causes resource leaks. try-with-resources solves this: any object implementing AutoCloseable is AUTOMATICALLY closed when the block exits, even if an exception occurs. No more finally blocks for cleanup!',
      advanced: 'try-with-resources (Java 7, JEP 213) automates resource cleanup. Resources declared in the try(...) header must implement AutoCloseable. The compiler generates implicit finally blocks calling close() in REVERSE declaration order. Suppressed exceptions: if close() throws while handling another exception, the close() exception is SUPPRESSED and attached to the primary exception via addSuppressed(). Retrieve via getSuppressed(). This prevents exception masking. Common AutoCloseable resources: FileInputStream, BufferedReader, Connection, Statement, ResultSet.'
    },
    {
      title: '4. Custom Exception Classes',
      beginner: 'Standard errors aren\'t always enough. You can create your own error types by extending Exception (checked) or RuntimeException (unchecked). This gives your business logic specific, meaningful error names like InsufficientFundsException.',
      advanced: 'Custom exception design: (1) Extend Exception for checked (compiler-enforced handling): public class InsufficientFundsException extends Exception. (2) Extend RuntimeException for unchecked (programming errors): public class InvalidConfigurationException extends RuntimeException. Best practices: (1) Name exceptions with Exception suffix. (2) Provide constructors accepting message and cause: super(message, cause). (3) Make exceptions immutable (no setters). (4) Document when the exception occurs in Javadoc. (5) Use exception chaining (throw new ServiceException("Failed", cause)) to preserve the original stack trace.'
    },
    {
      title: '5. Exception Performance & Stack Traces (Expert Teaser)',
      beginner: 'Throwing exceptions is expensive! Every time you throw, Java captures the entire call stack (every method that led to the error). This takes time and memory. Don\'t use exceptions for normal control flow.',
      advanced: '(Expert Teaser) Exception creation cost: new Exception() calls fillInStackTrace() — a native method that walks the entire call stack and captures StackTraceElement[] for every frame. This is O(stack_depth) and allocates an array. For deep stacks (100+ frames), this can take microseconds. Optimization strategies: (1) Override fillInStackTrace() to return this (loses stack trace but is fast). (2) Pre-allocate and reuse exceptions for hot paths. (3) Use exceptions only for truly exceptional conditions, not control flow. (4) In high-throughput systems, consider sentinel values or Optional instead of exceptions. In the Expert track, we explore how the JIT compiler optimizes exception handling via exception table lookups, how async stack traces work in reactive frameworks (Project Reactor), and how GraalVM Native Image handles exceptions differently from JIT-compiled code.'
    }
  ],
  {
    title: '🛠️ Mini-Project: Student Database & Search System',
    intro: '⚠️ NOTE: Build the Phase 3 capstone project! You will combine Maps, Generics, and Custom Exception handling to build a robust terminal student registry with proper error handling pipelines.',
    steps: [
      'Create a file named StudentSystem.java with the standard public class and main method boilerplate.',
      'Define a custom checked exception: public class StudentNotFoundException extends Exception { public StudentNotFoundException(String message) { super(message); } }.',
      'Create a generic database class: public class Database<K, V> { private java.util.HashMap<K, V> records = new java.util.HashMap<>(); public void addRecord(K key, V value) { records.put(key, value); } public V getRecord(K key) throws StudentNotFoundException { if (!records.containsKey(key)) throw new StudentNotFoundException("Student ID not found: " + key); return records.get(key); } }.',
      'In main, instantiate: Database<String, String> db = new Database<>();.',
      'Add records: db.addRecord("S001", "Alice"); db.addRecord("S002", "Bob");.',
      'Test successful lookup in try-catch: try { String student = db.getRecord("S001"); System.out.println("Found: " + student); } catch (StudentNotFoundException e) { System.out.println("Error: " + e.getMessage()); }.',
      'Test failed lookup: try { db.getRecord("S999"); } catch (StudentNotFoundException e) { System.out.println("Caught: " + e.getMessage()); }.',
      'Demonstrate try-with-resources: try (java.io.FileWriter fw = new java.io.FileWriter("test.txt")) { fw.write("Exception handling works!"); } catch (java.io.IOException e) { System.out.println("IO Error: " + e.getMessage()); }.',
      'Compile and execute: javac StudentSystem.java && java StudentSystem.'
    ],
    goal: 'You integrated Generic data constraints, Map lookups, custom checked exceptions, try-catch-finally pipelines, and try-with-resources automatic cleanup into a robust application.'
  },
  [
    q('What is the primary difference between a Checked and an Unchecked Exception?', ['Checked exceptions crash the JVM, unchecked do not', 'The compiler forces you to handle Checked exceptions; Unchecked exceptions are optional to handle', 'Checked exceptions only happen with integers', 'Unchecked exceptions must always include a finally block'], 1, 'Checked exceptions (IOException, SQLException) MUST be declared via throws or handled via try-catch — the compiler enforces this. Unchecked exceptions (RuntimeException subclasses) represent programming errors and are not mandatory to handle. Why others are wrong: Neither type crashes the JVM inherently. Checked exceptions are not limited to integers. finally blocks are optional for both.'),
    q('Which block of an exception handling structure is guaranteed to execute whether an error occurs or not?', ['The try block', 'The catch block', 'The throws clause', 'The finally block'], 3, 'The finally block executes UNCONDITIONALLY — even if try returns, catch throws a new exception, or the thread is interrupted. The only exceptions are System.exit() or JVM crash. Why others are wrong: try stops at the first exception. catch only runs if an exception matches. throws is a declaration, not an executable block.'),
    q('What is required to make an object compatible with the try-with-resources automatic closure feature?', ['It must extend RuntimeException', 'It must be declared completely private', 'It must implement the AutoCloseable interface', 'It must contain a static final integer'], 2, 'try-with-resources automatically invokes close() on objects implementing AutoCloseable (or its subinterface Closeable). Resources are closed in REVERSE declaration order. Why others are wrong: It has nothing to do with RuntimeException, access modifiers, or static fields.'),
    q('What happens if close() throws an exception while another exception is already being handled in try-with-resources?', ['The program crashes immediately', 'The close() exception REPLACES the original exception', 'The close() exception is SUPPRESSED and attached to the original exception via addSuppressed()', 'Both exceptions are ignored'], 2, 'Suppressed exceptions prevent exception masking. The primary exception is thrown; the close() exception is attached via addSuppressed() and retrievable via getSuppressed(). Why others are wrong: It does not crash. It does not replace the original. It does not ignore either exception.'),
    q('Why is throwing exceptions expensive in terms of performance?', ['Exceptions allocate heap memory for the error message string', 'new Exception() calls fillInStackTrace(), which walks the entire call stack and captures every frame — O(stack_depth) cost', 'The JVM pauses all threads when an exception is thrown', 'Exceptions require network calls to log the error'], 1, 'fillInStackTrace() is a native method that captures StackTraceElement[] for every stack frame. For deep call stacks, this can take microseconds and allocate significant memory. This is why exceptions should not be used for normal control flow. Why others are wrong: The message string is trivial. The JVM does not pause all threads. No network calls are required.')
  ],
  [
    'Checked exceptions require mandatory handling (Catch or Declare); Unchecked exceptions indicate logic faults.',
    'The finally block executes unconditionally — use it for critical resource cleanup.',
    'try-with-resources automatically closes AutoCloseable objects in reverse order.',
    'Custom exceptions extend Exception (checked) or RuntimeException (unchecked) for domain-specific errors.',
    'Exception creation is expensive (fillInStackTrace) — never use exceptions for normal control flow.'
  ],
  'If you want to use a big terminal on your own computer instead of the built-in one, please read Lesson 1 for full JDK setup instructions.'
),

// ==========================================
// LESSON 19: FILE I/O & SERIALIZATION
// ==========================================
L(
  'java-19', 19, 'File I/O & Serialization', '💾',
  '💾 Data in memory is volatile — it vanishes when the JVM exits. File I/O bridges the gap between transient computation and persistent storage. Java provides two generations of I/O APIs: the classic stream-based java.io and the modern buffer/channel-based java.nio. Understanding when to use streams vs NIO, how to efficiently read large files without exhausting memory, and how to serialize objects for persistence or network transmission is essential for building data-durable applications.',
  [
    {
      title: '1. java.io vs java.nio (NIO.2)',
      beginner: 'Classic java.io reads files like a stream of water — byte by byte or character by character. Modern java.nio (New I/O) works with buffers and channels, like filling a bucket all at once. NIO also provides the Files and Paths utility classes that make file operations dramatically simpler.',
      advanced: 'java.io: Stream-oriented, blocking I/O. Classes: FileInputStream, BufferedReader, InputStreamReader. java.nio (NIO.2, Java 7+): Buffer-oriented, supports non-blocking I/O via Channels. The java.nio.file.Files API provides static utility methods: readAllLines(), write(), lines() (lazy Stream), copy(), move(), delete(), walk() (recursive traversal). Path objects (Paths.get()) replace File objects. NIO.2 supports atomic operations, file attributes, symbolic links, and WatchService for file system event monitoring. For simple text operations, Files API is preferred. For high-throughput I/O, Channels + Buffers are optimal.'
    },
    {
      title: '2. Reading & Writing Files (Memory Efficiency)',
      beginner: 'For small files, Files.readAllLines() is convenient. But for HUGE files (gigabytes), loading everything into memory will crash your app with OutOfMemoryError! Use BufferedReader or Files.lines() to read one line at a time.',
      advanced: 'Files.readAllLines(path) loads the ENTIRE file into a List<String> — O(file_size) memory. For large files: (1) BufferedReader: wraps FileReader with an 8KB buffer, reads line-by-line via readLine(). (2) Files.lines(path): returns a lazy Stream<String> — processes one line at a time, O(1) memory. (3) For binary files: BufferedInputStream with byte[] buffer. Writing: Files.write(path, lines) for small data; BufferedWriter for streaming writes. ALWAYS use try-with-resources to ensure streams are closed. Character encoding: specify StandardCharsets.UTF_8 explicitly to avoid platform-dependent defaults.'
    },
    {
      title: '3. Object Serialization (Serializable)',
      beginner: 'Serialization converts a live Java object into a stream of bytes that can be saved to a file or sent over a network. Deserialization reconstructs the object. Mark your class with implements Serializable to enable this.',
      advanced: 'Object Serialization (java.io.Serializable) converts object graphs into byte streams via ObjectOutputStream.writeObject(). Deserialization reconstructs via ObjectInputStream.readObject(). Requirements: (1) Class must implement Serializable (marker interface, no methods). (2) ALL fields must be serializable (or marked transient to skip). (3) Declare private static final long serialVersionUID = 1L; to verify class version compatibility. Without serialVersionUID, the JVM auto-generates one from class structure — changing the class breaks deserialization. Security warning: deserialization is a major attack vector ( gadget chains). Prefer JSON (Jackson/Gson) for data exchange; use serialization only for trusted internal persistence.'
    },
    {
      title: '4. Path & Files API (NIO.2 Utilities)',
      beginner: 'The Path class represents a file location (like "C:/data/config.txt"). The Files class provides one-line operations: copy, move, delete, check existence, list directory contents. It replaces the old clunky File class methods.',
      advanced: 'Path (java.nio.file.Path): Immutable, represents a file system path. Methods: getFileName(), getParent(), resolve() (join paths), relativize() (compute relative path). Files (java.nio.file.Files): Static utility methods. Key operations: Files.exists(), Files.isDirectory(), Files.createDirectories(), Files.copy(src, dest, StandardCopyOption.REPLACE_EXISTING), Files.move(), Files.delete(), Files.list(dir) (Stream<Path>), Files.walk(root) (recursive Stream), Files.find() (predicate-based search). All Files methods throw IOException — use try-catch or try-with-resources.'
    },
    {
      title: '5. Memory-Mapped Files & Channels (Expert Teaser)',
      beginner: 'For extremely large files, there is a secret weapon: Memory-Mapped Files. Instead of reading the file through Java, you ask the operating system to map the file directly into your program\'s memory. It is like having the file already loaded without actually loading it!',
      advanced: '(Expert Teaser) Memory-Mapped Files (MappedByteBuffer) map a file region directly into virtual memory via FileChannel.map(). The OS page cache handles loading — only accessed pages are loaded from disk. Benefits: (1) Zero-copy reads (no user-space buffer copying). (2) OS-level caching. (3) Random access without seeking. Use cases: large database files, log processing, high-frequency trading systems. Limitations: (1) Mapped regions are fixed size. (2) Unmapping requires System.gc() hack (no explicit unmap API). (3) Not suitable for files that grow dynamically. In the Expert track, we explore how Apache Kafka and RocksDB leverage memory-mapped files, how FileChannel.transferTo() enables zero-copy network transmission (sendfile syscall), and how AsynchronousFileChannel enables non-blocking I/O with CompletableFuture callbacks.'
    }
  ],
  {
    title: '🛠️ Mini-Project: Persistent Configuration Manager',
    intro: '⚠️ NOTE: Build a file I/O utility that writes application configuration data to disk using NIO.2, reads it back efficiently, and persists serializable state objects for cross-session storage.',
    steps: [
      'Create a file named ConfigManager.java with the standard public class and main method boilerplate.',
      'Import java.nio.file.Files, java.nio.file.Path, java.nio.file.Paths, java.io.*.',
      'Define a serializable config class: public class AppConfig implements Serializable { private static final long serialVersionUID = 1L; private String appName; private int maxConnections; public AppConfig(String appName, int maxConnections) { this.appName = appName; this.maxConnections = maxConnections; } public String toString() { return appName + " (" + maxConnections + " connections)"; } }.',
      'In main, write text config using NIO.2: Path configPath = Paths.get("config.txt"); Files.write(configPath, java.util.List.of("app=MyService", "port=8080", "timeout=30"));.',
      'Read it back: java.util.List<String> lines = Files.readAllLines(configPath); lines.forEach(System.out::println);.',
      'Serialize an object: AppConfig config = new AppConfig("MyService", 100); try (ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream("config.ser"))) { oos.writeObject(config); }.',
      'Deserialize the object: try (ObjectInputStream ois = new ObjectInputStream(new FileInputStream("config.ser"))) { AppConfig restored = (AppConfig) ois.readObject(); System.out.println("Restored: " + restored); } catch (ClassNotFoundException e) { System.out.println("Class not found: " + e.getMessage()); }.',
      'Compile and execute: javac ConfigManager.java && java ConfigManager.',
      'Verify files created: ls (or dir) — you should see config.txt and config.ser.'
    ],
    goal: 'You successfully wrote disk files using NIO.2 Files API, read them back efficiently, and preserved live object states using Object Serialization with serialVersionUID version control.'
  },
  [
    q('What is the main advantage of using java.nio over classic java.io for file operations?', ['It requires fewer imports', 'It provides buffer-oriented I/O, modern file management APIs (Files/Path), and supports non-blocking channels', 'It automatically encrypts files saved to disk', 'It removes the need to close file streams'], 1, 'NIO.2 offers high-performance buffer/channel architecture, the Files utility API for one-line operations, Path objects for robust path manipulation, and support for asynchronous I/O. Why others are wrong: It does not encrypt files. It does not remove the need to close streams (use try-with-resources). Import count is irrelevant.'),
    q('Why is it critical to declare a serialVersionUID in a Serializable class?', ['To allow the file to be opened in text editors', 'To prevent class version incompatibility exceptions during object deserialization', 'To allocate memory on the Stack instead of the Heap', 'To encrypt sensitive data inside the object'], 1, 'serialVersionUID validates that the sender and receiver of a serialized object share a compatible class structure. If the UID differs, deserialization throws InvalidClassException. Without explicit declaration, the JVM auto-generates one from class structure — any class modification breaks compatibility. Why others are wrong: It has nothing to do with text editors, stack allocation, or encryption.'),
    q('Which reader class is best suited for reading giant text files line-by-line without causing OutOfMemory errors?', ['FileReader', 'BufferedReader (or Files.lines() Stream)', 'ObjectInputStream', 'DataInputStream'], 1, 'BufferedReader uses internal buffering to read file lines dynamically without loading the full file into memory. Files.lines() returns a lazy Stream<String> — O(1) memory regardless of file size. Why others are wrong: FileReader alone reads char-by-char without buffering. ObjectInputStream is for deserialization. DataInputStream is for primitive binary data.'),
    q('What does the transient keyword do when applied to a field in a Serializable class?', ['It makes the field immutable', 'It EXCLUDES the field from serialization — the field is skipped during object-to-byte conversion', 'It encrypts the field automatically', 'It makes the field static'], 1, 'transient fields are skipped during serialization. Upon deserialization, transient fields are initialized to default values (null, 0, false). Use for sensitive data (passwords) or non-serializable fields (Thread, Socket). Why others are wrong: It does not make fields immutable, encrypt them, or make them static.'),
    q('What is the memory complexity of using Files.lines(path) to process a 10GB log file?', ['O(10GB) — the entire file is loaded into memory', 'O(1) — lines are processed lazily one at a time via Stream', 'O(10GB / 2) — half the file is buffered', 'It throws OutOfMemoryError immediately'], 1, 'Files.lines() returns a lazy Stream<String>. Each line is read, processed, and discarded before the next is loaded. Memory footprint is constant regardless of file size. Why others are wrong: It does NOT load the entire file. It does not buffer half. It does not throw OOM — that is the whole point of lazy streams.')
  ],
  [
    'java.nio.Files API provides modern one-line file operations; prefer it over legacy java.io for text files.',
    'Use BufferedReader or Files.lines() for large files to maintain O(1) memory usage.',
    'Serialization requires implements Serializable and serialVersionUID for version control.',
    'Mark sensitive fields transient to exclude them from serialization.',
    'Path objects (NIO.2) replace legacy File objects for robust path manipulation.'
  ],
  'If you want to use a big terminal on your own computer instead of the built-in one, please read Lesson 1 for full JDK setup instructions.'
),

// ==========================================
// LESSON 20: FUNCTIONAL PROGRAMMING — LAMBDAS & FUNCTIONAL INTERFACES
// ==========================================
L(
  'java-20', 20, 'Functional Programming — Lambdas & Functional Interfaces', 'λ',
  'λ Java 8 revolutionized the language by introducing functional programming capabilities. Lambda expressions enable passing behavior as data — treating code blocks as first-class values that can be stored, passed, and composed. Combined with the java.util.function package\'s standard interfaces (Predicate, Function, Consumer, Supplier), lambdas eliminate boilerplate anonymous classes and enable declarative, composable data processing pipelines. Understanding how lambdas compile (invokedynamic, NOT anonymous classes) is the key to writing zero-overhead functional code.',
  [
    {
      title: '1. Lambda Expressions & Syntax',
      beginner: 'A lambda is a short, anonymous function you can write inline. Instead of creating a whole class just to implement one method, you write (x) -> x * 2. The left side is parameters, the arrow points to the body. It is perfect for callbacks, filters, and transformations.',
      advanced: 'Lambda syntax: (parameters) -> expression or (parameters) -> { statements; }. Type inference: parameter types can be omitted when inferrable. Single-parameter lambdas can omit parentheses: x -> x * 2. Lambdas are NOT anonymous inner classes — they compile to invokedynamic instructions. The JVM\'s LambdaMetafactory generates the implementation class at runtime, producing zero allocation overhead compared to anonymous classes. Lambdas can only implement Functional Interfaces (interfaces with exactly ONE abstract method). They capture variables from the enclosing scope (closures), but captured variables must be effectively final.'
    },
    {
      title: '2. Core Functional Interfaces (java.util.function)',
      beginner: 'Java provides four core functional interfaces: Predicate checks a condition and returns true/false. Function transforms input to output. Consumer takes input and does something (no return). Supplier provides a value with no input.',
      advanced: 'java.util.function package: (1) Predicate<T>: boolean test(T t) — filtering. Supports composition: and(), or(), negate(). (2) Function<T,R>: R apply(T t) — transformation. Supports chaining: andThen(), compose(). (3) Consumer<T>: void accept(T t) — side effects. Supports chaining: andThen(). (4) Supplier<T>: T get() — lazy generation, factories. Specialized variants avoid autoboxing: IntPredicate, IntFunction, IntConsumer, IntSupplier (and Long/Double variants). BiFunction<T,U,R>, BiConsumer<T,U>, BiPredicate<T,U> for two-argument operations. UnaryOperator<T> and BinaryOperator<T> for same-type operations.'
    },
    {
      title: '3. Method References (::)',
      beginner: 'When your lambda just calls an existing method, you can shorten it further using :: (double colon). System.out::println means "call println on System.out". It is cleaner and more readable than writing x -> System.out.println(x).',
      advanced: 'Method reference types: (1) Static method: ClassName::staticMethod (Math::random). (2) Instance method on specific object: instance::method (System.out::println). (3) Instance method on arbitrary object of type: ClassName::instanceMethod (String::length). (4) Constructor: ClassName::new (ArrayList::new). Method references compile to the same invokedynamic bytecode as lambdas — zero overhead difference. They are syntactic sugar for lambdas that directly delegate to existing methods.'
    },
    {
      title: '4. Closure Capture & Effectively Final',
      beginner: 'Lambdas can "remember" variables from the surrounding code. But there is a rule: the variable must not change after the lambda is created. Java calls this "effectively final" — you don\'t need to write final, but you can\'t reassign it.',
      advanced: 'Lambda capture semantics: lambdas capture variables from the enclosing scope (lexical closure). Captured local variables must be effectively final (not reassigned after initialization). This is because the lambda may execute after the enclosing method returns — the captured value is COPIED into the lambda object. Capturing mutable state leads to concurrency bugs. Instance fields (this.field) are captured by reference (the lambda holds a reference to this). Static fields are accessed directly. The effectively-final requirement prevents data races in concurrent lambda execution.'
    },
    {
      title: '5. invokedynamic & LambdaMetafactory (Expert Teaser)',
      beginner: 'Here is a secret: lambdas are NOT compiled into anonymous inner classes like you might expect. Java uses a special bytecode instruction called invokedynamic that lets the JVM decide AT RUNTIME how to create the lambda implementation. This makes lambdas incredibly efficient!',
      advanced: '(Expert Teaser) Lambda compilation: javac emits invokedynamic instructions (NOT new AnonymousClass()). At first execution, the JVM invokes LambdaMetafactory.metafactory() which: (1) Generates a class implementing the functional interface via ASM bytecode generation. (2) Caches the generated class for subsequent calls. (3) Returns a MethodHandle for direct invocation. This means: (1) No class file bloat (no MyClass$1.class files). (2) Zero allocation for stateless lambdas (JVM can singleton them). (3) The JIT can inline lambda bodies directly into call sites. In the Expert track, we explore how LambdaMetafactory generates bytecode at runtime, how the JIT devirtualizes functional interface calls via inline caching, how parallel streams leverage lambda composition for fork-join decomposition, and how Project Valhalla\'s value types will further optimize functional interface dispatch.'
    }
  ],
  {
    title: '🛠️ Mini-Project: Functional Data Transformer Pipeline',
    intro: '⚠️ NOTE: Build a flexible data pipeline using standard functional interfaces to filter, transform, generate, and consume data. Demonstrate lambda composition, method references, and closure capture.',
    steps: [
      'Create a file named FunctionalPipeline.java with the standard public class and main method boilerplate.',
      'Import java.util.function.Predicate, Function, Consumer, Supplier, java.util.List, java.util.ArrayList.',
      'Define a Predicate to filter even numbers: Predicate<Integer> isEven = n -> n % 2 == 0;.',
      'Define a Function to format numbers: Function<Integer, String> stringify = n -> "Value: " + n;.',
      'Define a Supplier using method reference: Supplier<Double> randomGen = Math::random;.',
      'Define a Consumer using method reference: Consumer<String> printMsg = System.out::println;.',
      'Create a list of numbers: List<Integer> numbers = List.of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);.',
      'Build a processing pipeline: List<String> results = new ArrayList<>(); for (Integer n : numbers) { if (isEven.test(n)) { results.add(stringify.apply(n)); } }.',
      'Consume results: results.forEach(printMsg);.',
      'Demonstrate closure capture: String prefix = "RESULT: "; Consumer<String> prefixedPrint = s -> System.out.println(prefix + s); results.forEach(prefixedPrint);.',
      'Generate random values: for (int i = 0; i < 3; i++) { System.out.println("Random: " + randomGen.get()); }.',
      'Compile and execute: javac FunctionalPipeline.java && java FunctionalPipeline.'
    ],
    goal: 'You mastered Java functional programming by implementing Predicate filtering, Function transformation, Supplier generation, Consumer side-effects, method references, and closure capture.'
  },
  [
    q('Which built-in functional interface would you choose to test if a string starts with the letter "A"?', ['Supplier<String>', 'Consumer<String>', 'Predicate<String>', 'Function<String, Integer>'], 2, 'Predicate<T> takes an object and returns a boolean — ideal for validation and condition checking. test("Apple") returns true. Why others are wrong: Supplier generates values (no input). Consumer performs side effects (no return). Function transforms input to output (not boolean).'),
    q('What is the syntax for a Method Reference pointing to System.out.println?', ['System.out->println', 'System.out::println', 'System::out::println()', 'Class.println(System.out)'], 1, 'Method references use double colons (::). System.out::println references the println instance method on the System.out object. Why others are wrong: -> is lambda syntax, not method reference. Triple colons are invalid. The last option is not valid Java syntax.'),
    q('Which functional interface takes NO parameter arguments but produces an output result?', ['Consumer<T>', 'Predicate<T>', 'Function<T, R>', 'Supplier<T>'], 3, 'Supplier<T> takes zero inputs and produces a value via its get() method. Used for lazy evaluation, factories, and random generation. Why others are wrong: Consumer takes input, returns void. Predicate takes input, returns boolean. Function takes input, returns transformed output.'),
    q('How are lambda expressions compiled in Java (since Java 8)?', ['They are compiled into anonymous inner classes (MyClass$1.class)', 'They are compiled into invokedynamic instructions, with implementation generated at runtime by LambdaMetafactory', 'They are compiled into static methods', 'They are interpreted at runtime without compilation'], 1, 'Lambdas compile to invokedynamic bytecode. LambdaMetafactory generates the implementation class at runtime via ASM. This produces zero class file bloat and enables JIT optimization. Why others are wrong: Anonymous inner classes were the pre-Java 8 pattern. Lambdas are NOT static methods. They ARE compiled (not interpreted).'),
    q('What does "effectively final" mean for variables captured by lambdas?', ['The variable must be declared with the final keyword explicitly', 'The variable must not be reassigned after initialization, even if not declared final', 'The variable must be a constant literal', 'The variable must be static'], 1, 'Effectively final means the variable is not reassigned after initialization. The final keyword is optional — the compiler checks reassignment. This is required because the lambda captures a COPY of the value and may execute after the enclosing method returns. Why others are wrong: The final keyword is not required. It does not need to be a literal. It does not need to be static.')
  ],
  [
    'Lambdas provide inline functional implementations for Single Abstract Method interfaces.',
    'Use Predicate for testing, Function for mapping, Consumer for actions, Supplier for generation.',
    'Method references (::) simplify lambdas that directly delegate to existing methods.',
    'Captured variables must be effectively final — lambdas capture COPIES of local values.',
    'Lambdas compile to invokedynamic (NOT anonymous classes) — zero allocation for stateless lambdas.'
  ],
  'If you want to use a big terminal on your own computer instead of the built-in one, please read Lesson 1 for full JDK setup instructions.'
),

L(
  'java-21', 21, 'Stream API & Data Processing', '🌊',
  '🌊 The Stream API (Java 8+) revolutionized how Java processes collections. Instead of writing verbose for-loops with manual accumulation, streams enable declarative, pipeline-based data processing. You describe WHAT you want (filter, transform, aggregate), and the stream engine figures out HOW to execute it — including automatic parallelization across CPU cores. Understanding lazy evaluation, intermediate vs terminal operations, and the internal Spliterator mechanics is the key to writing high-performance data pipelines.',
  [
    {
      title: '1. Stream Pipelines & Lazy Evaluation',
      beginner: 'A Stream is NOT a collection — it does not store data. It is a conveyor belt that carries data from a source (list, array, file) through a series of processing steps. The magic: intermediate operations (filter, map, sorted) are LAZY. They don\'t actually execute until a terminal operation (collect, count, forEach) triggers the pipeline!',
      advanced: 'Streams do not mutate the underlying collection. Intermediate operations return a NEW Stream handle and build an internal pipeline representation (a linked list of stages). Execution is deferred until a terminal operation is invoked. At that point, the pipeline is fused: elements pass through ALL stages in a single pass (loop fusion), avoiding intermediate collection allocation. This is fundamentally different from chaining collection operations, which allocate a new collection at each step. The lazy model enables short-circuiting: findFirst() stops after the first match, even if the source has millions of elements.'
    },
    {
      title: '2. Intermediate Operations (filter, map, sorted, distinct)',
      beginner: 'Intermediate operations transform the stream and return a new stream. filter() keeps only matching elements. map() transforms each element (like extracting a price from an Order). sorted() reorders elements. distinct() removes duplicates. You can chain as many as you want!',
      advanced: 'Intermediate operations are stateless (filter, map, peek) or stateful (sorted, distinct, limit). Stateless operations can be fused into a single pass. Stateful operations require buffering: sorted() must see ALL elements before emitting any (O(n) memory), distinct() maintains a HashSet. map() accepts a Function<T,R> and supports specialized variants: mapToInt(), mapToLong(), mapToDouble() to avoid autoboxing overhead. flatMap() transforms each element into a stream and flattens the results — essential for one-to-many transformations.'
    },
    {
      title: '3. Terminal Operations (collect, reduce, forEach)',
      beginner: 'Terminal operations trigger the pipeline to actually run and produce a final result. collect() gathers results into a List, Set, or Map using Collectors. reduce() combines all elements into a single value (like summing prices). forEach() performs an action on each element. count() returns the number of elements.',
      advanced: 'Terminal operations consume the stream — a stream cannot be reused after termination. collect(Collector) is the most powerful: Collectors.toList(), toSet(), toMap(keyFn, valueFn), groupingBy(classifier), partitioningBy(predicate), joining(), summarizingDouble(). reduce(identity, accumulator) performs a fold: the identity is the initial value, the accumulator combines elements. For parallel safety, reduce requires an ASSOCIATIVE accumulator: (a⊕b)⊕c = a⊕(b⊕c). forEach() on parallel streams has no ordering guarantee — use forEachOrdered() if order matters.'
    },
    {
      title: '4. Parallel Streams & ForkJoinPool',
      beginner: 'You can convert any stream into a parallel stream using .parallelStream(). Java automatically splits the data across all your CPU cores, processes chunks simultaneously, and merges the results. It is like having 8 workers on an assembly line instead of 1. But beware: for small datasets, the overhead of coordinating workers is slower than doing it sequentially!',
      advanced: 'parallelStream() uses the common ForkJoinPool (default parallelism = Runtime.availableProcessors() - 1). The stream source is recursively split via Spliterator.trySplit() until chunks are small enough to process sequentially. Results are merged via the combiner function. CRITICAL: parallel streams are only beneficial for: (1) large datasets (>10,000 elements), (2) CPU-bound operations, (3) easily splittable sources (ArrayList, arrays — NOT LinkedList or IO streams). Shared mutable state in parallel streams causes data races. Use reduce/collect (thread-safe accumulation) instead of mutating external variables. The common pool is SHARED across the entire JVM — blocking operations in parallel streams can starve other parallel operations.'
    },
    {
      title: '5. Spliterator & Stream Internals (Expert Teaser)',
      beginner: 'Behind every stream is a hidden component called a Spliterator (Splittable Iterator). It knows how to divide the data source into chunks for parallel processing. Different data sources have different Spliterators optimized for their structure.',
      advanced: '(Expert Teaser) The Spliterator interface defines: tryAdvance() (consume one element), trySplit() (divide into two Spliterators), estimateSize(), and characteristics() (ORDERED, DISTINCT, SORTED, SIZED, SUBSIZED, IMMUTABLE, CONCURRENT, NONNULL). ArrayList.spliterator() returns an ArrayListSpliterator that splits by halving index ranges (perfect for parallel). LinkedList cannot split efficiently (no random access). Stream pipelines are implemented via the java.util.stream package: AbstractPipeline → ReferencePipeline → StatelessOp/StatefulOp. The JIT compiler aggressively inlines lambda bodies and can vectorize simple map/filter operations using SIMD instructions. In the Expert track, we explore how custom Spliterators enable streaming over databases, message queues, and infinite sequences, and how the Stream API integrates with Project Panama\'s Vector API for GPU-accelerated data processing.'
    }
  ],
  {
    title: '🛠️ Mini-Project: E-Commerce Order Analytics Engine',
    intro: '⚠️ NOTE: Build a Stream API data pipeline that processes a list of transactions, filters high-value sales, transforms currency values, groups by category, and calculates revenue summaries using reduce and collectors.',
    steps: [
      'Create a file named OrderAnalytics.java with the standard public class and main method boilerplate.',
      'Import java.util.List, java.util.stream.Collectors, java.util.Map, java.util.DoubleSummaryStatistics.',
      'Create an Order class with fields: String id, String category, double price. Add a constructor and getters.',
      'Instantiate a List<Order> with 10+ mock records: List<Order> orders = List.of(new Order("O1", "Electronics", 120.0), new Order("O2", "Books", 15.0), ...);.',
      'Filter premium purchases: List<Order> premium = orders.stream().filter(o -> o.getPrice() > 50.0).collect(Collectors.toList());. Print the count.',
      'Extract and sum prices using reduce: double totalRevenue = orders.stream().map(Order::getPrice).reduce(0.0, Double::sum);. Print the result.',
      'Group by category: Map<String, List<Order>> byCategory = orders.stream().collect(Collectors.groupingBy(Order::getCategory));. Print each category.',
      'Compute statistics: DoubleSummaryStatistics stats = orders.stream().collect(Collectors.summarizingDouble(Order::getPrice));. Print max, min, average.',
      'Test parallel stream: long count = orders.parallelStream().filter(o -> o.getPrice() > 50).count();. Print the count.',
      'Compile and execute: javac OrderAnalytics.java && java OrderAnalytics.'
    ],
    goal: 'You built a declarative data processing engine using Stream filtering, mapping, reduction, grouping collectors, and parallel stream execution.'
  },
  [
    q('What happens when you call an intermediate operation like .filter() on a Stream WITHOUT calling a terminal operation?', ['The entire list is immediately filtered in memory', 'Nothing executes yet because intermediate operations are evaluated lazily', 'An Exception is thrown due to missing terminal state', 'The stream converts automatically to a parallel stream'], 1, 'Stream intermediate operations execute lazily and only run when triggered by a terminal operation (collect, reduce, forEach, count). This enables loop fusion and short-circuiting optimizations. Why others are wrong: It does not execute eagerly. No exception is thrown. It does not auto-parallelize.'),
    q('Which terminal operation is used to combine all stream elements into a single value (such as computing a sum)?', ['map()', 'filter()', 'reduce()', 'distinct()'], 2, 'reduce(identity, accumulator) takes stream elements and repeatedly combines them into a single aggregate result. The identity is the initial value (0.0 for sums). Why others are wrong: map() is an intermediate transformation. filter() is an intermediate filter. distinct() removes duplicates.'),
    q('When should you AVOID using .parallelStream()?', ['When processing millions of simple numeric items', 'When operating on tiny data sets or ordered tasks where thread coordination overhead exceeds execution gain', 'When using multi-core processors', 'When reading data from memory arrays'], 1, 'Parallel streams incur ForkJoinPool coordination overhead. For small datasets (<10,000 elements), this overhead dominates the actual work, making parallel SLOWER than sequential. Also avoid for: LinkedList sources (poor splittability), IO-bound operations, and operations requiring strict ordering. Why others are wrong: Millions of items benefit from parallelism. Multi-core processors are the target. Arrays are ideal parallel sources.'),
    q('What is the key difference between a Stream and a Collection?', ['Streams store data; Collections do not', 'Collections store data; Streams are pipelines that process data without storing it', 'Streams are faster than Collections', 'Collections cannot be iterated'], 1, 'A Stream does NOT store data — it conveys elements from a source through a pipeline. Collections (List, Set) store and manage data. Streams can be infinite, lazily evaluated, and parallelized. Collections have finite size and eager loading. Why others are wrong: Streams do not store data. Speed depends on context. Collections are iterable by definition.'),
    q('Why must the accumulator function in reduce() be associative for parallel streams?', ['To make the code compile', 'Because parallel streams split work across threads and merge results in arbitrary order — non-associative operations produce different results depending on merge order', 'To prevent StackOverflowError', 'Because reduce() only works with integers'], 1, 'Parallel reduce splits the stream, reduces chunks independently, then combines results. If the operation is not associative ((a⊕b)⊕c ≠ a⊕(b⊕c)), the final result depends on which chunks were merged first — producing non-deterministic bugs. Why others are wrong: It compiles either way. It does not prevent stack overflow. reduce works with any type.')
  ],
  [
    'Streams process collection data declaratively without modifying the source data structure.',
    'Intermediate operations are evaluated lazily until a terminal operation triggers execution.',
    'Use collect(), reduce(), and groupingBy() to replace verbose nested for loops.',
    'Parallel streams leverage ForkJoinPool but require large datasets and splittable sources.',
    'The reduce() accumulator MUST be associative for correct parallel execution.'
  ],
  'If you want to use a big terminal on your own computer instead of the built-in one, please read Lesson 1 for full JDK setup instructions.'
),

// ==========================================
// LESSON 22: MULTITHREADING & CONCURRENCY BASICS
// ==========================================
L(
  'java-22', 22, 'Multithreading & Concurrency Basics', '🧵',
  '🧵 Multithreading enables Java programs to execute multiple tasks concurrently, maximizing CPU core utilization and keeping UIs responsive while background work proceeds. But concurrency introduces the most dangerous bugs in software engineering: race conditions, deadlocks, and memory visibility issues. Understanding thread creation, lifecycle states, synchronization mechanics, and the Java Memory Model is the foundation of building correct concurrent systems.',
  [
    {
      title: '1. Thread Creation: Thread Class vs Runnable Interface',
      beginner: 'A thread is an independent execution path within your program. You can create one by extending the Thread class OR implementing the Runnable interface. Prefer Runnable because Java only allows extending ONE class — implementing Runnable leaves your class free to extend something else. Call .start() to launch the thread!',
      advanced: 'Implementing Runnable decouples the task (what to execute) from the execution mechanism (how to execute). Calling thread.start() allocates a native OS thread, creates a new JVM stack (~512KB default), and invokes run() asynchronously on the new thread. CRITICAL: calling run() directly executes synchronously on the caller thread — no new thread is created. Thread extends Runnable and adds thread management methods: sleep(), join(), interrupt(), setPriority(). For production code, prefer ExecutorService (Lesson 23) over manual thread creation to leverage thread pooling.'
    },
    {
      title: '2. Thread Lifecycle & States',
      beginner: 'Threads move through states during their lifetime: NEW (created but not started), RUNNABLE (executing or waiting for CPU), BLOCKED (waiting for a lock), WAITING (waiting for another thread), TIMED_WAITING (sleeping), and TERMINATED (finished). You can check a thread\'s state with getState().',
      advanced: 'Thread.State enum defines: NEW (before start()), RUNNABLE (running or ready-to-run in OS scheduler), BLOCKED (waiting to acquire a monitor lock), WAITING (indefinite wait via wait(), join(), or LockSupport.park()), TIMED_WAITING (sleep(ms), wait(ms), join(ms)), TERMINATED (run() completed or exception thrown). Thread scheduling is non-deterministic — the OS scheduler decides which RUNNABLE thread gets CPU time. There is NO guarantee of execution order between threads. Thread.sleep() releases CPU but NOT locks. Thread.yield() hints the scheduler but is not guaranteed.'
    },
    {
      title: '3. Race Conditions & The synchronized Keyword',
      beginner: 'When two threads modify the same variable at the same time, their changes can interleave and corrupt the data. This is a Race Condition. Using synchronized locks the code block so only ONE thread can enter at a time. It is like a bathroom lock — the next person must wait.',
      advanced: 'Race conditions occur when unsynchronized concurrent access to shared mutable state violates atomicity. Example: counter++ is NOT atomic — it compiles to three bytecode instructions: read counter, increment, write counter. Two threads can interleave: both read 5, both increment to 6, both write 6 — losing one increment. synchronized acquires the intrinsic monitor lock (stored in the object header mark word) before entering the block. Only one thread holds the lock at a time. Exiting the block (normally or via exception) releases the lock. synchronized also establishes memory visibility: writes before unlock are visible to threads after lock (happens-before relationship).'
    },
    {
      title: '4. volatile & Memory Visibility',
      beginner: 'Each CPU core has its own tiny cache. A thread might read a stale cached value instead of the latest value from main memory. The volatile keyword forces reads and writes to go directly to main memory, ensuring all threads see the same value instantly.',
      advanced: 'The Java Memory Model (JMM) permits threads to cache shared variables in CPU registers and L1/L2 caches. Without synchronization, one thread\'s writes may never become visible to others. volatile guarantees: (1) Visibility — writes to a volatile variable are immediately flushed to main memory; reads always fetch from main memory. (2) Ordering — prevents instruction reordering around the volatile access (happens-before edge). However, volatile does NOT guarantee atomicity: volatile int counter; counter++ is STILL not thread-safe. Use AtomicInteger for atomic operations. volatile is ideal for flags: private volatile boolean running = true;'
    },
    {
      title: '5. Deadlocks & Thread Coordination (Expert Teaser)',
      beginner: 'A deadlock happens when Thread A holds Lock 1 and waits for Lock 2, while Thread B holds Lock 2 and waits for Lock 1. Both wait forever! It is like two people in a doorway, each saying "after you" endlessly.',
      advanced: '(Expert Teaser) Deadlock requires four conditions simultaneously (Coffman conditions): Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait. Prevention strategies: acquire locks in a consistent global order, use tryLock() with timeout (java.util.concurrent.locks), or use higher-level constructs (ExecutorService, Concurrent collections). wait()/notify()/notifyAll() enable thread coordination via the object monitor: wait() releases the lock AND suspends the thread; notify() wakes one waiting thread. In the Expert track, we explore how the JVM detects deadlocks via ThreadMXBean.findDeadlockedThreads(), how StampedLock provides optimistic reading without blocking writers, and how Project Loom\'s virtual threads eliminate the OS-thread bottleneck by multiplexing millions of lightweight threads onto a small carrier thread pool.'
    }
  ],
  {
    title: '🛠️ Mini-Project: Synchronized Counter Simulator',
    intro: '⚠️ NOTE: Build a multi-threaded counter application that demonstrates race conditions when unsynchronized, and fixes data corruption using synchronized locks and volatile flags.',
    steps: [
      'Create a file named ThreadCounter.java with the standard public class and main method boilerplate.',
      'Create a class Counter with a private int count = 0; field.',
      'Add a synchronized increment method: public synchronized void increment() { count++; }.',
      'Add a getter: public synchronized int getCount() { return count; }.',
      'Create a Runnable task: Runnable task = () -> { for (int i = 0; i < 1000; i++) counter.increment(); };.',
      'In main, instantiate: Counter counter = new Counter(); Thread t1 = new Thread(task); Thread t2 = new Thread(task);.',
      'Start both threads: t1.start(); t2.start();.',
      'Wait for completion: t1.join(); t2.join();.',
      'Print the final count: System.out.println("Final count: " + counter.getCount()); — expect exactly 2000.',
      'BONUS: Remove synchronized and run again. Observe the count is LESS than 2000 due to race conditions!',
      'Compile and execute: javac ThreadCounter.java && java ThreadCounter.'
    ],
    goal: 'You managed multithreaded execution, controlled thread lifecycles using join(), and prevented race conditions using synchronized locks.'
  },
  [
    q('Why is calling thread.start() different from calling thread.run() directly?', ['start() creates a new asynchronous OS thread; run() executes synchronously on the current thread', 'run() is faster than start()', 'start() can only be called inside static methods', 'run() automatically synchronizes all memory variables'], 0, 'Calling start() allocates a native OS thread, creates a new JVM stack, and invokes run() asynchronously. Calling run() directly executes the code synchronously on the caller thread — no new thread is created. Why others are wrong: run() is not faster (it does the same work on one thread). start() can be called anywhere. run() does not synchronize anything.'),
    q('What risk arises when two or more threads concurrently write to an unsynchronized shared variable?', ['Deadlock', 'Race Condition yielding data corruption', 'StackOverflowError', 'Type Erasure failure'], 1, 'Concurrent unsynchronized writes interleave non-atomically. counter++ is three bytecode instructions (read, increment, write) that can interleave, causing lost updates. Why others are wrong: Deadlock is circular lock waiting, not data corruption. StackOverflowError is stack exhaustion. Type erasure is a generics compilation concept.'),
    q('What is the role of the synchronized keyword in Java?', ['It compiles code into parallel streams', 'It locks code execution to a single thread at a time via the object monitor, enforcing mutual exclusion AND memory visibility', 'It speeds up thread creation time', 'It prevents garbage collection'], 1, 'synchronized acquires the object\'s intrinsic monitor lock. Only one thread can hold the lock. It also establishes happens-before memory visibility: writes before unlock are visible after lock. Why others are wrong: It does not compile to streams, speed up creation, or affect GC.'),
    q('What does the volatile keyword guarantee for a shared variable?', ['Atomicity of compound operations like counter++', 'Visibility (all threads see the latest write) and ordering (no reordering around the access)', 'Thread-safe increment operations', 'Faster execution speed'], 1, 'volatile guarantees visibility (writes flushed to main memory, reads from main memory) and prevents instruction reordering. It does NOT guarantee atomicity — counter++ on a volatile int is still a race condition. Why others are wrong: Atomicity requires synchronized or AtomicInteger. It does not make operations thread-safe. It may actually slow execution due to memory barriers.'),
    q('What is a deadlock in multithreaded programming?', ['When a thread runs too fast', 'When two or more threads hold locks and wait for each other\'s locks in a circular dependency, blocking forever', 'When a thread throws an exception', 'When the JVM runs out of memory'], 1, 'Deadlock occurs when Thread A holds Lock 1 and waits for Lock 2, while Thread B holds Lock 2 and waits for Lock 1. Both wait indefinitely. Prevention: acquire locks in consistent order, use tryLock() with timeout. Why others are wrong: It is not about speed, exceptions, or memory.')
  ],
  [
    'Implement Runnable instead of extending Thread to decouple tasks from execution mechanics.',
    'Call .start() to create a new thread; NEVER call .run() directly (it runs synchronously).',
    'Use synchronized locks to prevent race conditions on shared mutable state.',
    'Use volatile for visibility flags; use AtomicInteger for atomic counters.',
    'Deadlocks arise from circular lock dependencies — acquire locks in consistent order.'
  ],
  'If you want to use a big terminal on your own computer instead of the built-in one, please read Lesson 1 for full JDK setup instructions.'
),

// ==========================================
// LESSON 23: CONCURRENT UTILITIES & EXECUTORS
// ==========================================
L(
  'java-23', 23, 'Concurrent Utilities & Executors', '⚙️',
  '⚙️ Manual thread management is error-prone, expensive, and unscalable. Creating a new OS thread costs ~1MB of stack memory and significant allocation time. Modern Java concurrency relies on the java.util.concurrent framework: ExecutorService thread pools recycle worker threads, Callable/Future enable asynchronous results, CompletableFuture enables non-blocking pipeline chaining, and concurrent collections provide thread-safe data structures without coarse-grained locking.',
  [
    {
      title: '1. ExecutorService & Thread Pools',
      beginner: 'Creating new threads takes computer processing time and memory. A Thread Pool keeps a team of reusable worker threads ready to go. You submit tasks to an ExecutorService pool instead of spawning threads manually. The pool manages the workers, queues pending tasks, and recycles threads when tasks finish.',
      advanced: 'ExecutorService manages worker threads via thread pools. Executors factory methods: newFixedThreadPool(n) — fixed n workers, unbounded queue. newCachedThreadPool() — grows/shrinks dynamically, 60s idle timeout. newSingleThreadExecutor() — sequential execution guarantee. newScheduledThreadPool(n) — delayed/periodic tasks. In production, prefer ThreadPoolExecutor directly to control: corePoolSize, maximumPoolSize, keepAliveTime, workQueue (ArrayBlockingQueue for bounded backpressure), and RejectedExecutionHandler. ALWAYS call shutdown() to release threads. Thread pools eliminate per-task thread allocation overhead (~1ms → ~0.001ms).'
    },
    {
      title: '2. Callable & Future',
      beginner: 'Runnable runs code but CANNOT return a result or throw checked exceptions. Callable is like a Runnable that CAN return a value! When you submit a Callable to a pool, you get back a Future — a placeholder that says "I\'m working on it, come back later for the result."',
      advanced: 'Callable<V> defines V call() throws Exception — it can return a value AND throw checked exceptions. Submitting to ExecutorService returns Future<V>. Future methods: get() blocks until completion, get(timeout, unit) waits with timeout, isDone() polls non-blockingly, cancel(mayInterrupt) attempts cancellation. Future.get() throws ExecutionException wrapping the task\'s exception. For multiple tasks: invokeAll(callables) waits for ALL; invokeAny(callables) returns the FIRST successful result. In Java 8+, CompletableFuture supersedes Future for complex async pipelines.'
    },
    {
      title: '3. CompletableFuture & Asynchronous Chaining',
      beginner: 'CompletableFuture allows you to chain tasks together asynchronously: "When Task A finishes, automatically pass its result to Task B, then pass THAT result to Task C" — all without blocking your main thread! It is like setting up dominoes that fall in sequence.',
      advanced: 'CompletableFuture<T> implements Future<T> and CompletionStage<T>, enabling non-blocking reactive pipelines. Key methods: supplyAsync(supplier, executor) — async computation. thenApply(fn) — transform result. thenAccept(consumer) — consume result. thenCombine(other, fn) — combine two futures. thenCompose(fn) — chain dependent futures. exceptionally(fn) — error recovery. allOf(futures) — wait for all. anyOf(futures) — wait for first. All callbacks execute asynchronously on the ForkJoinPool common pool (or a specified executor). This is the foundation of reactive microservice architectures.'
    },
    {
      title: '4. BlockingQueue & Producer-Consumer',
      beginner: 'A BlockingQueue is a thread-safe queue that automatically blocks when full (producers wait) or empty (consumers wait). It is the backbone of the Producer-Consumer pattern: producers add items, consumers take items, and the queue coordinates everything without explicit locks.',
      advanced: 'BlockingQueue implementations: ArrayBlockingQueue (bounded, array-backed, fair/unfair), LinkedBlockingQueue (optionally bounded, linked nodes), PriorityBlockingQueue (priority ordering), SynchronousQueue (zero-capacity handoff), DelayQueue (delayed elements). put() blocks if full; take() blocks if empty. offer()/poll() have timeout variants. This is the foundation of thread pools (work queue) and message-passing architectures. For high-throughput scenarios, consider Disruptor (LMAX) which uses a lock-free ring buffer with mechanical sympathy for cache-line padding.'
    },
    {
      title: '5. ForkJoinPool & Work-Stealing (Expert Teaser)',
      beginner: 'The ForkJoinPool is a special thread pool designed for recursive tasks. It splits big tasks into smaller subtasks (fork), processes them in parallel, and merges results (join). If one worker finishes early, it "steals" work from busy workers — keeping all CPUs busy!',
      advanced: '(Expert Teaser) ForkJoinPool implements work-stealing: each worker thread has a double-ended deque of tasks. Workers push/pop from their own deque, but STEAL from the tail of other workers\' deques when idle. This minimizes contention and maximizes CPU utilization. RecursiveTask<V> returns a result; RecursiveAction does not. The common ForkJoinPool (ForkJoinPool.commonPool()) powers parallel streams. ManagedBlocker allows blocking operations without starving the pool. In the Expert track, we explore how parallel streams use Spliterator.trySplit() to feed ForkJoinPool, how work-stealing achieves near-linear scaling for divide-and-conquer algorithms, and how Project Loom\'s virtual threads integrate with ForkJoinPool as carrier threads.'
    }
  ],
  {
    title: '🛠️ Mini-Project: Asynchronous Web Data Downloader Simulator',
    intro: '⚠️ NOTE: Build a multi-threaded task runner using ExecutorService thread pools and CompletableFuture to run background download jobs with chained transformations.',
    steps: [
      'Create a file named AsyncDownloader.java with the standard public class and main method boilerplate.',
      'Import java.util.concurrent.* and java.util.List.',
      'Create an ExecutorService: ExecutorService pool = Executors.newFixedThreadPool(3);.',
      'Submit Callable tasks: for (int i = 1; i <= 5; i++) { int taskId = i; pool.submit(() -> { Thread.sleep(1000); return "Data-" + taskId; }); }.',
      'Use CompletableFuture: CompletableFuture<String> future = CompletableFuture.supplyAsync(() -> { try { Thread.sleep(500); } catch (Exception e) {} return "RawData"; }, pool);.',
      'Chain transformations: future.thenApply(data -> data.toUpperCase()).thenAccept(result -> System.out.println("Processed: " + result)).join();.',
      'Demonstrate invokeAll: List<Callable<String>> tasks = List.of(() -> "A", () -> "B", () -> "C"); List<Future<String>> results = pool.invokeAll(tasks);.',
      'Print results: for (Future<String> f : results) System.out.println(f.get());.',
      'Properly shut down: pool.shutdown();.',
      'Compile and execute: javac AsyncDownloader.java && java AsyncDownloader.'
    ],
    goal: 'You built a high-performance concurrency pipeline utilizing ExecutorService thread pools, Callable/Future results, and reactive CompletableFuture chaining.'
  },
  [
    q('What is a major advantage of using an ExecutorService thread pool over creating threads manually?', ['It automatically encrypts network connections', 'It reuses worker threads, avoiding the ~1MB stack allocation overhead of creating and destroying threads repeatedly', 'It prevents all runtime exceptions', 'It converts single-threaded code into parallel streams'], 1, 'Thread pools maintain reusable worker threads. Each OS thread costs ~1MB stack + allocation time. Pools amortize this cost across thousands of tasks. Why others are wrong: It does not encrypt, prevent exceptions, or convert code to streams.'),
    q('How does Callable differ from Runnable?', ['Callable can return a value and throw checked exceptions; Runnable cannot', 'Runnable can return generic types; Callable returns void', 'Callable cannot be executed in thread pools', 'Runnable is only used inside GUI apps'], 0, 'Callable<V> defines V call() throws Exception — it returns a value and can throw checked exceptions. Runnable defines void run() — no return, no checked exceptions. Why others are wrong: Runnable cannot return values. Callable works in thread pools. Neither is GUI-specific.'),
    q('Which CompletableFuture method registers a callback to TRANSFORM a task result asynchronously when it completes?', ['.get()', '.thenApply()', '.block()', '.shutdown()'], 1, 'thenApply(Function) chains a transformation that executes asynchronously when the future completes, returning a NEW CompletableFuture with the transformed result. Why others are wrong: get() blocks and retrieves the result. block() does not exist. shutdown() is an ExecutorService method.'),
    q('What happens when you call put() on a full ArrayBlockingQueue?', ['It throws an exception immediately', 'It blocks the calling thread until space becomes available', 'It silently drops the item', 'It resizes the queue automatically'], 1, 'BlockingQueue.put() blocks indefinitely until space is available. This provides natural backpressure in producer-consumer architectures. Use offer(item, timeout, unit) for timeout-based behavior. Why others are wrong: add() throws an exception. offer() returns false. ArrayBlockingQueue is bounded and does not resize.'),
    q('What is the "work-stealing" algorithm in ForkJoinPool?', ['Workers steal memory from other threads', 'Idle workers steal tasks from the tail of busy workers\' deques, maximizing CPU utilization', 'The pool steals CPU cycles from the OS', 'Tasks are stolen by the garbage collector'], 1, 'Each ForkJoinPool worker has a deque. Workers push/pop their own tasks but steal from the TAIL of other workers\' deques when idle. This minimizes contention (stealing from tail, owner pops from head) and keeps all cores busy. Why others are wrong: It does not steal memory, CPU cycles, or involve GC.')
  ],
  [
    'Thread pools (ExecutorService) prevent resource exhaustion by recycling reusable worker threads.',
    'Use Callable and Future when background tasks need to return result values.',
    'Chain non-blocking asynchronous pipelines using CompletableFuture callbacks (thenApply, thenAccept).',
    'BlockingQueue provides thread-safe producer-consumer coordination with automatic blocking.',
    'ForkJoinPool uses work-stealing for efficient divide-and-conquer parallelism.'
  ],
  'If you want to use a big terminal on your own computer instead of the built-in one, please read Lesson 1 for full JDK setup instructions.'
),

// ==========================================
// LESSON 24: JVM MEMORY, GARBAGE COLLECTION & REFLECTION
// ==========================================
L(
  'java-24', 24, 'JVM Memory Structure, Garbage Collection & Reflection', '🧠',
  '🧠 Understanding JVM internals empowers developers to build performant, memory-efficient systems and diagnose production issues. This lesson explores the complete JVM memory architecture (Heap generations, Stack frames, Metaspace), Garbage Collection algorithms (G1, ZGC, Shenandoah), dynamic introspection via the Reflection API, and custom Annotations that power every major Java framework from Spring to Hibernate.',
  [
    {
      title: '1. JVM Memory Model: Heap, Stack, Metaspace',
      beginner: 'The JVM divides memory into key areas: Stack memory stores method calls and local variables (fast, short-lived, thread-private). Heap memory stores all instantiated objects (shared, garbage-collected). Metaspace stores class metadata (how many classes are loaded, their methods, fields).',
      advanced: 'JVM runtime data areas: (1) Heap — shared, GC-managed, structured into Young Generation (Eden + Survivor S0/S1) and Old Generation. Objects allocated in Eden, promoted to Old after surviving GC cycles. (2) JVM Stacks — thread-private, one frame per method call, storing locals + operand stack. StackOverflowError on deep recursion. (3) Metaspace — off-heap native memory (replaced PermGen in Java 8), storing class metadata, method bytecode, constant pools. (4) PC Register — per-thread, stores current instruction address. (5) Native Method Stack — for JNI calls. Configure via -Xms (initial heap), -Xmx (max heap), -Xss (stack size), -XX:MaxMetaspaceSize.'
    },
    {
      title: '2. Garbage Collection (GC) Fundamentals',
      beginner: 'Garbage Collection is Java\'s automatic memory cleaner. When an object on the Heap is no longer connected to any active code (unreachable from GC Roots), GC automatically deletes it to free up memory so you don\'t have to clean memory manually. Think of it as a robotic janitor that finds trash and removes it.',
      advanced: 'GC uses reachability analysis from GC Roots (stack variables, static fields, JNI references, active threads). Unreachable objects are garbage. Modern collectors: (1) G1GC (default since Java 9) — region-based, targets configurable pause times (-XX:MaxGCPauseMillis), prioritizes regions with most garbage. (2) ZGC (Java 15+) — concurrent, sub-millisecond pauses (<1ms) even for multi-TB heaps. (3) Shenandoah — concurrent compaction, low pause. Generational hypothesis: most objects die young → Minor GC cleans Young gen frequently, Major GC cleans Old gen rarely. GC pauses are "Stop-The-World" events — critical for low-latency systems.'
    },
    {
      title: '3. Reflection API (java.lang.reflect)',
      beginner: 'Reflection lets your Java code inspect or modify itself at runtime — allowing you to inspect private fields, call methods dynamically, and create objects without knowing their class at compile time. It is how frameworks like Spring know about your classes without you explicitly telling them.',
      advanced: 'The java.lang.reflect API provides: Class.forName(name) — load class dynamically. clazz.getDeclaredFields() — inspect fields (including private). clazz.getDeclaredMethods() — inspect methods. method.invoke(obj, args) — call methods dynamically. field.setAccessible(true) — bypass access control. Reflection is POWERFUL but SLOW (~50x slower than direct calls) due to: dynamic type checking, method lookup, and JIT optimization barriers. SecurityManager can restrict reflection. Frameworks cache reflection results to amortize cost. Use MethodHandles (Java 7+) for faster dynamic invocation.'
    },
    {
      title: '4. Custom Annotations & Retention Policies',
      beginner: 'Annotations (like @Override, @Autowired) attach metadata tags to your code. You can create your OWN annotations! @Retention(RUNTIME) keeps the tag visible at runtime so frameworks can read it via Reflection. @Target specifies where the annotation can be placed (class, method, field).',
      advanced: 'Custom annotations are declared with @interface. Retention policies: SOURCE (discarded after compilation, e.g., @Override), CLASS (stored in .class but not visible at runtime, default), RUNTIME (visible via reflection, required for framework processing). @Target({ElementType.METHOD, ElementType.FIELD}) restricts placement. Annotation processors (javax.annotation.processing) generate code at compile time (Lombok, Dagger, MapStruct). Runtime annotations + Reflection enable dependency injection (Spring @Autowired), ORM mapping (JPA @Entity), and serialization (Jackson @JsonProperty).'
    },
    {
      title: '5. ClassLoader Deep Dive & Bytecode Manipulation (Expert Teaser)',
      beginner: 'How does the JVM find your classes? ClassLoaders search for .class files in specific locations. The Bootstrap loader finds core Java classes. The Application loader finds YOUR classes. You can even write custom loaders to load classes from databases or encrypted files!',
      advanced: '(Expert Teaser) ClassLoader hierarchy: Bootstrap (java.base module) → Platform (extension modules) → Application (classpath). Custom ClassLoaders enable: hot-deployment (Tomcat reloads webapps), plugin systems (OSGi), and encrypted class loading. Class loading lifecycle: Load → Verify → Prepare → Resolve → Initialize. Bytecode manipulation libraries (ASM, Javassist, ByteBuddy) generate/modify .class files at runtime — this is how AOP proxies (Spring), mocking frameworks (Mockito), and agent instrumentation work. In the Expert track, we explore how Java Agents (java.lang.instrument) attach to running JVMs to modify bytecode, how GraalVM Native Image performs AOT compilation eliminating classloaders entirely, and how the Java Module System (JPMS) enforces strong encapsulation at the classloader level.'
    }
  ],
  {
    title: '🛠️ Mini-Project: Multi-Threaded In-Memory Log Parser with Reflection',
    intro: '⚠️ NOTE: Build the Phase 4 capstone mini-project! Construct a multi-threaded log parsing framework that reads log text via NIO, processes log tokens concurrently using Executors and Streams, and inspects records via Reflection.',
    steps: [
      'Create a file named MultiThreadedLogParser.java with the standard public class and main method boilerplate.',
      'Import java.lang.reflect.*, java.lang.annotation.*, java.util.concurrent.*, java.util.stream.*, java.nio.file.*.',
      'Create a custom annotation: @Retention(RetentionPolicy.RUNTIME) @Target(ElementType.FIELD) @interface LogField { String description(); }.',
      'Define an annotated LogRecord class with fields: @LogField(description="Timestamp") private String timestamp; @LogField(description="Level") private String level; @LogField(description="Message") private String message;. Add constructors and getters.',
      'Create an ExecutorService: ExecutorService pool = Executors.newFixedThreadPool(2);.',
      'Create a list of mock log lines: List<String> logs = List.of("INFO: Started", "ERROR: Failed", "WARN: Slow");.',
      'Process concurrently: List<Future<LogRecord>> futures = logs.stream().map(line -> pool.submit(() -> parseLog(line))).collect(Collectors.toList());.',
      'Use Reflection to inspect LogRecord: for (Field f : LogRecord.class.getDeclaredFields()) { LogField ann = f.getAnnotation(LogField.class); if (ann != null) System.out.println(f.getName() + " → " + ann.description()); }.',
      'Shut down the pool: pool.shutdown();.',
      'Compile and execute: javac MultiThreadedLogParser.java && java MultiThreadedLogParser.'
    ],
    goal: 'You integrated Phase 4 concepts into an enterprise parser using NIO, Streams, Executor pools, custom Annotations, and Reflection-based introspection.'
  },
  [
    q('Where are local primitive variables stored inside the JVM memory architecture during method execution?', ['On the global Heap memory', 'Inside the class Metaspace area', 'In the thread-private Stack frame', 'In the Garbage Collector root index'], 2, 'Local variables inside methods live within thread-private Stack frames. Each method call allocates a frame with local variable slots. Frames are destroyed when the method returns. Why others are wrong: Heap stores objects. Metaspace stores class metadata. GC roots are references, not storage.'),
    q('How does the JVM Garbage Collector determine if an object on the Heap is ready for deletion?', ['By checking if the object is older than 5 minutes', 'By checking root reachability (if no active references point to it from GC Roots)', 'By counting the number of methods inside the object', 'By monitoring CPU execution speed'], 1, 'GC traces from GC Roots (stack variables, static fields, JNI refs). Any object unreachable from roots is garbage. Age-based promotion exists but is not the deletion criterion. Why others are wrong: Age affects generation promotion, not deletion. Method count is irrelevant. CPU speed is unrelated.'),
    q('What is required to make a custom Annotation inspectable at execution time using Reflection?', ['It must be marked with @Retention(RetentionPolicy.RUNTIME)', 'It must extend the Thread class', 'It must be declared private final', 'It must be written in an interface file'], 0, 'RetentionPolicy.RUNTIME ensures annotation metadata is preserved in class bytecode and accessible via reflection at runtime. SOURCE and CLASS retention discard the annotation before runtime. Why others are wrong: Annotations do not extend Thread. Access modifiers are irrelevant. Annotations use @interface, not interface.'),
    q('Why is Reflection significantly slower than direct method calls?', ['Reflection uses the internet', 'Reflection requires dynamic type checking, method lookup, and bypasses JIT optimization, making it ~50x slower than direct calls', 'Reflection deletes objects', 'Reflection only works on static methods'], 1, 'Reflection performs runtime type verification, method resolution via name lookup, and cannot be inlined by the JIT compiler. Direct calls are statically dispatched and aggressively optimized. Why others are wrong: It does not use the internet, delete objects, or require static methods.'),
    q('What is the default Garbage Collector in modern Java (9+)?', ['Serial GC', 'G1GC (Garbage-First)', 'ZGC', 'Shenandoah'], 1, 'G1GC became the default in Java 9. It divides the heap into regions, prioritizes regions with most garbage, and targets configurable pause times via -XX:MaxGCPauseMillis. Why others are wrong: Serial GC is for single-core. ZGC and Shenandoah are low-pause alternatives but not defaults.')
  ],
  [
    'Stack memory stores short-lived thread method frames; Heap memory stores shared objects.',
    'Garbage Collection automatically frees unreferenced Heap memory via root reachability analysis.',
    'G1GC is the default collector; ZGC provides sub-millisecond pauses for low-latency systems.',
    'Reflection and Runtime Annotations enable dynamic code introspection used by all major frameworks.',
    'ClassLoaders enable hot-deployment, plugin systems, and dynamic class generation.'
  ],
  'If you want to use a big terminal on your own computer instead of the built-in one, please read Lesson 1 for full JDK setup instructions.'
),

// ==========================================
// LESSON 25: BUILD TOOLS (MAVEN & GRADLE)
// ==========================================
L(
  'java-25', 25, 'Build Tools (Maven & Gradle)', '🏗️',
  '🏗️ Production applications rely on build automation tools to manage dependencies, automate compilation, run tests, and package software. Writing javac commands manually is unsustainable for projects with hundreds of dependencies. Maven and Gradle solve this with declarative configuration, transitive dependency resolution, and reproducible build lifecycles. Understanding project layouts, dependency coordinates, and build phases is essential for professional Java development.',
  [
    {
      title: '1. Standard Directory Layout (Convention over Configuration)',
      beginner: 'Modern Java projects follow a universal folder layout so every developer knows where files live: src/main/java holds your application code, src/main/resources holds config files, src/test/java holds automated tests, and target/ (Maven) or build/ (Gradle) holds compiled output.',
      advanced: 'Maven and Gradle enforce convention-over-configuration directory layouts. Maven: src/main/java, src/main/resources, src/test/java, src/test/resources, target/. Gradle: same structure, output in build/. This standardization enables: automatic source discovery, IDE integration, CI/CD pipeline predictability, and team onboarding speed. Deviating from convention requires explicit configuration overrides — always prefer the standard layout.'
    },
    {
      title: '2. Dependency Management & Maven Central',
      beginner: 'Instead of manually downloading .jar library files from websites, build tools automatically download third-party libraries from online registries (like Maven Central) using dependency coordinates: groupId:artifactId:version. If library A needs library B, the tool downloads BOTH automatically (transitive dependencies)!',
      advanced: 'Dependencies are identified by coordinates: groupId (organization), artifactId (project name), version. Maven resolves transitively via pom.xml <dependencies>. Gradle uses build.gradle dependencies block with configurations: implementation (compile+runtime), compileOnly (compile only), runtimeOnly (runtime only), testImplementation (test only). Maven Central (repo.maven.apache.org) is the default repository. Dependencies are cached locally in ~/.m2/repository (Maven) or ~/.gradle/caches (Gradle). Version conflicts are resolved via "nearest wins" (Maven) or configurable resolution strategies (Gradle).'
    },
    {
      title: '3. Build Lifecycles & Phases',
      beginner: 'Build tools execute phases in a strict order: validate → compile → test → package → verify → install → deploy. Running mvn package compiles your code, runs ALL unit tests, and packages everything into an executable .jar file. If any test fails, the build STOPS.',
      advanced: 'Maven lifecycle phases: validate (check project structure), compile (javac src/main/java), test (run unit tests via Surefire plugin), package (create JAR/WAR), verify (integration tests via Failsafe), install (deploy to local ~/.m2), deploy (upload to remote repository). Gradle tasks are more granular and DAG-based: compileJava, processResources, classes, test, jar, assemble, build. Gradle supports incremental builds (only recompile changed files) and build caching (reuse outputs from previous builds).'
    },
    {
      title: '4. Maven vs Gradle (Choosing Your Tool)',
      beginner: 'Maven uses XML configuration (pom.xml) and is the industry standard for enterprise Java. Gradle uses Groovy/Kotlin code (build.gradle) and is faster, more flexible, and the default for Android development. Both are excellent — choose based on your team and project needs.',
      advanced: 'Maven: XML-based, rigid lifecycle, excellent for standard enterprise projects, massive plugin ecosystem, predictable builds. Gradle: DSL-based (Groovy/Kotlin), incremental compilation, build cache, parallel task execution, 2-10x faster for large projects. Gradle wrapper (gradlew) ensures reproducible builds across environments. Maven wrapper (mvnw) provides the same. Spring Initializr supports both. Modern trend: Gradle for new projects, Maven for legacy enterprise.'
    },
    {
      title: '5. Multi-Module Projects & Build Cache (Expert Teaser)',
      beginner: 'Large projects are split into modules (like separate folders for API, Database, UI). Build tools understand these relationships and build them in the correct order. Gradle adds a Build Cache that remembers previous build outputs — if nothing changed, it skips the work entirely!',
      advanced: '(Expert Teaser) Multi-module projects define parent POM (Maven) or settings.gradle (Gradle) with module declarations. Inter-module dependencies are resolved automatically. Gradle Build Cache: stores task outputs keyed by input hashes. If inputs are unchanged, outputs are restored from cache (local or remote HTTP cache). This enables CI/CD speedups of 10-50x for large monorepos. Gradle Composite Builds allow substituting published dependencies with local source for development. In the Expert track, we explore how Bazel and Buck2 achieve hermetic builds with remote execution, how GraalVM Native Image integrates with build tools for AOT compilation, and how build tool plugins generate code (protobuf, OpenAPI) during compilation.'
    }
  ],
  {
    title: '🛠️ Mini-Project: Simulated Maven POM Dependency Resolver',
    intro: '⚠️ NOTE: Simulate how Maven parses project configurations, resolves dependency coordinates, and triggers compilation phases. Build a Java model of the build system itself.',
    steps: [
      'Create a file named BuildToolSimulator.java with the standard public class and main method boilerplate.',
      'Import java.util.List, java.util.ArrayList, java.util.Map, java.util.HashMap.',
      'Create a Dependency class with fields: String groupId, String artifactId, String version. Add constructor and toString().',
      'Create a PomConfig class holding: String projectName, List<Dependency> dependencies. Add addDependency() method.',
      'Write a build phase method: public static void executePhase(String phaseName) { System.out.println("[" + phaseName + "] Executing..."); }.',
      'Simulate dependency resolution: public static void resolveDependencies(PomConfig config) { for (Dependency d : config.dependencies) { System.out.println("Downloading: " + d); } }.',
      'In main, create a project: PomConfig project = new PomConfig("MyApp"); project.addDependency(new Dependency("org.springframework", "spring-core", "6.0.0"));.',
      'Simulate the build lifecycle: executePhase("validate"); resolveDependencies(project); executePhase("compile"); executePhase("test"); executePhase("package");.',
      'Compile and execute: javac BuildToolSimulator.java && java BuildToolSimulator.'
    ],
    goal: 'You understood build automation principles, standard directory structures, dependency coordinates, and build lifecycle phases by modeling the build system itself.'
  },
  [
    q('In modern Java build tools, where should application source code files be located?', ['src/test/java', 'src/main/java', 'target/classes', 'lib/external'], 1, 'Standard convention places application production code inside src/main/java. Test code goes in src/test/java. target/ and build/ are output directories. Why others are wrong: src/test/java is for tests. target/classes is compiled output. lib/external is not a standard directory.'),
    q('Which file is used by Maven to declare project dependencies, plugins, and build settings?', ['build.gradle', 'settings.json', 'pom.xml', 'manifest.mf'], 2, 'Maven configures projects through its Project Object Model file: pom.xml (XML format). It declares dependencies, plugins, profiles, and build configuration. Why others are wrong: build.gradle is Gradle. settings.json is VS Code. manifest.mf is JAR metadata.'),
    q('What happens during the package build lifecycle phase in Maven?', ['It deletes all source files from the system', 'It compiles code, runs tests, and packages binaries into an output JAR or WAR artifact', 'It deploys the application directly to AWS', 'It converts Java code to C++'], 1, 'The package phase compiles sources, executes tests, and bundles compiled binaries into executable archives (JAR for libraries, WAR for web apps). Why others are wrong: It does not delete files, deploy to cloud (that is the deploy phase), or convert languages.'),
    q('What is the key advantage of Gradle over Maven for large projects?', ['Gradle uses XML which is easier to read', 'Gradle supports incremental compilation, build caching, and parallel task execution, making builds 2-10x faster', 'Gradle does not require dependencies', 'Gradle only works on Windows'], 1, 'Gradle\'s incremental builds recompile only changed files. Build cache reuses outputs from previous builds. Parallel execution runs independent tasks concurrently. Why others are wrong: Gradle uses Groovy/Kotlin DSL, not XML. All build tools manage dependencies. Gradle is cross-platform.'),
    q('What does "transitive dependency resolution" mean?', ['Downloading dependencies from multiple websites', 'When dependency A requires dependency B, the build tool automatically downloads BOTH without you declaring B explicitly', 'Converting dependencies to different formats', 'Deleting unused dependencies automatically'], 1, 'If spring-core requires spring-jcl, Maven/Gradle automatically downloads spring-jcl even though you only declared spring-core. This is transitive resolution. Why others are wrong: It is not about multiple websites, format conversion, or deletion.')
  ],
  [
    'Build tools enforce standard project directory layouts (src/main/java, src/test/java).',
    'Dependencies are identified by coordinates (groupId:artifactId:version) and resolved transitively.',
    'Maven uses pom.xml (XML); Gradle uses build.gradle (Groovy/Kotlin DSL).',
    'Build lifecycles execute phases in order: validate → compile → test → package → deploy.',
    'Gradle\'s incremental compilation and build cache provide 2-10x faster builds for large projects.'
  ],
  'If you want to use a big terminal on your own computer instead of the built-in one, please read Lesson 1 for full JDK setup instructions.'
),

// ==========================================
// LESSON 26: UNIT TESTING WITH JUNIT 5 & MOCKITO
// ==========================================
L(
  'java-26', 26, 'Unit Testing with JUnit 5 & Mockito', '🧪',
  '🧪 Professional software engineering is not about writing code that works once — it is about writing code that keeps working after every change. Unit testing transforms development from guesswork into engineering discipline. JUnit 5 provides the assertion framework; Mockito provides isolation from external dependencies. Together, they form the safety net that enables fearless refactoring, continuous integration, and production confidence. Untested code is not done — it is broken and waiting to be discovered.',
  [
    {
      title: '1. JUnit 5 Architecture & Annotations',
      beginner: 'JUnit 5 is the industry-standard testing framework for Java. You write test methods marked with @Test, and JUnit runs them automatically. Assertions like assertEquals(expected, actual) verify your code produces the correct results. If the assertion fails, the test turns red!',
      advanced: 'JUnit 5 (Jupiter) consists of three modules: JUnit Platform (launcher), JUnit Jupiter (test programming model), JUnit Vintage (JUnit 3/4 support). Key annotations: @Test (marks test method), @BeforeEach (runs before each test), @AfterEach (runs after each test), @BeforeAll (runs once before all tests, must be static), @AfterAll (runs once after all tests). Assertions: assertEquals, assertTrue, assertFalse, assertNull, assertNotNull, assertThrows, assertTimeout. Tests are discovered via reflection and executed by the JUnit Platform Launcher.'
    },
    {
      title: '2. Test Lifecycle & Isolation',
      beginner: 'Each test must run in isolation — one test should never depend on another test running first. JUnit lifecycle hooks (@BeforeEach, @AfterEach) run setup and cleanup code around EVERY test method, ensuring a clean slate for each test.',
      advanced: 'JUnit creates a NEW instance of the test class for EACH test method by default (per-method lifecycle). @BeforeEach executes before each test — ideal for resetting mocks, creating test fixtures, or initializing state. @AfterEach executes after each test — ideal for cleanup (closing connections, deleting temp files). @BeforeAll/@AfterAll execute once per class (must be static) — ideal for expensive setup like database connections. For shared state between tests, use @TestInstance(Lifecycle.PER_CLASS).'
    },
    {
      title: '3. Mockito Mocking & Stubbing',
      beginner: 'When testing a class that depends on a database or external API, you should NOT call the real database in unit tests! Mockito creates "fake" objects (mocks) that simulate external dependencies. You can program the mock to return specific values, and verify that your code called it correctly.',
      advanced: 'Mockito creates dynamic proxy mocks at runtime using ByteBuddy bytecode generation. @Mock generates mock dependencies. @InjectMocks injects mocks into the test subject via constructor/field injection. Stubbing: when(mock.method()).thenReturn(value) programs the mock response. Verification: verify(mock).method() asserts the method was called. ArgumentCaptor captures actual arguments passed to mocks for assertion. Mockito mocks are thread-local by default. Use @ExtendWith(MockitoExtension.class) to enable annotation processing.'
    },
    {
      title: '4. Test-Driven Development (TDD)',
      beginner: 'Test-Driven Development flips the traditional workflow: write the TEST first (which fails), then write the MINIMUM code to make it pass, then REFACTOR for cleanliness. This Red-Green-Refactor cycle ensures every line of production code has a test proving it works.',
      advanced: 'TDD cycle: (1) RED — write a failing test that defines expected behavior. (2) GREEN — write the minimum code to make the test pass. (3) REFACTOR — improve code structure while keeping tests green. Benefits: forces upfront API design, ensures 100% test coverage, prevents over-engineering, provides living documentation. In enterprise teams, TDD integrates with CI/CD pipelines — tests run on every commit, blocking merges if any test fails.'
    },
    {
      title: '5. Integration Testing & Test Pyramid (Expert Teaser)',
      beginner: 'Unit tests check individual functions in isolation. Integration tests check how components work TOGETHER (like testing the whole database flow). The Test Pyramid says: many unit tests at the bottom, fewer integration tests in the middle, and very few end-to-end tests at the top.',
      advanced: '(Expert Teaser) The Test Pyramid (Mike Cohn): Unit tests (fast, isolated, many) → Integration tests (database/API, fewer) → E2E tests (browser, fewest). In the Expert track, we explore: Testcontainers (real databases in Docker for integration tests), WireMock (HTTP mock server for API testing), ArchUnit (architecture tests enforcing layer dependencies), JaCoCo (code coverage reports), and Mutation Testing (PIT) which verifies tests actually catch bugs by injecting mutations into production code. We also explore how Spring Boot Test slices (@WebMvcTest, @DataJpaTest) enable targeted integration testing without loading the full application context.'
    }
  ],
  {
    title: '🛠️ Mini-Project: Isolated Bank Service Test Suite',
    intro: '⚠️ NOTE: Build a unit testing harness that verifies banking business logic using simulated assertions and mock database responses. Since we cannot install JUnit/Mockito in a single file, we simulate the framework patterns.',
    steps: [
      'Create a file named UnitTestHarness.java with the standard public class and main method boilerplate.',
      'Create a mock database service: public class DatabaseService { public double getBalance(String accountId) { return 0; } }.',
      'Create the service under test: public class AccountService { private DatabaseService db; public AccountService(DatabaseService db) { this.db = db; } public double transfer(String from, String to, double amount) { double balance = db.getBalance(from); if (balance < amount) throw new RuntimeException("Insufficient funds"); return balance - amount; } }.',
      'Create a stubbed mock: DatabaseService mockDb = new DatabaseService() { @Override public double getBalance(String accountId) { return 100.0; } };.',
      'Write custom assertion: public static void assertEquals(double expected, double actual) { if (Math.abs(expected - actual) > 0.001) throw new AssertionError("Expected " + expected + " but got " + actual); }.',
      'Write a test method: public static void testTransferSuccess() { DatabaseService mock = ...; AccountService service = new AccountService(mock); double result = service.transfer("A1", "A2", 50); assertEquals(50.0, result); System.out.println("✅ testTransferSuccess PASSED"); }.',
      'Write a test for insufficient funds: public static void testTransferInsufficientFunds() { try { service.transfer("A1", "A2", 200); throw new AssertionError("Should have thrown"); } catch (RuntimeException e) { System.out.println("✅ testTransferInsufficientFunds PASSED"); } }.',
      'Add a @BeforeEach simulation: public static void setUp() { System.out.println("Setting up test fixtures..."); }.',
      'In main, run all tests: setUp(); testTransferSuccess(); testTransferSuccess();.',
      'Compile and execute: javac UnitTestHarness.java && java UnitTestHarness.'
    ],
    goal: 'You mastered unit testing fundamentals: dependency isolation via mocks, assertion verification, test lifecycle management, and exception testing patterns.'
  },
  [
    q('Which annotation in JUnit 5 marks a method as an executable unit test?', ['@UnitTest', '@Test', '@Execute', '@MockMethod'], 1, 'The @Test annotation tells the JUnit Platform that a method is an executable test case. It is discovered via reflection and executed by the test engine. Why others are wrong: @UnitTest, @Execute, and @MockMethod do not exist in JUnit 5.'),
    q('What is the primary purpose of using Mockito in unit testing?', ['To make tests run slower for debugging', 'To create fake mock dependencies so the class under test can be tested in total isolation from external systems', 'To generate automatic HTML web layouts', 'To test database connection strings directly'], 1, 'Mockito creates mock objects to isolate the class under test from external dependencies like databases, APIs, or file systems. This ensures tests are fast, deterministic, and repeatable. Why others are wrong: It does not slow tests, generate HTML, or test real connections.'),
    q('Which lifecycle hook in JUnit 5 executes code immediately before EVERY individual test method runs?', ['@BeforeAll', '@BeforeEach', '@AfterAll', '@SetupOnce'], 1, '@BeforeEach executes setup logic prior to running each individual @Test method. It runs once per test method, not once per class. Why others are wrong: @BeforeAll runs once per class (must be static). @AfterAll runs once after all tests. @SetupOnce does not exist.'),
    q('What does when(mock.method()).thenReturn(value) do in Mockito?', ['It makes the mock throw an exception', 'It stubs the mock to return a specific value when that method is called', 'It verifies the method was called', 'It deletes the mock object'], 1, 'when().thenReturn() is Mockito\'s stubbing API. It programs the mock to return the specified value when the method is invoked during the test. Why others are wrong: It does not throw exceptions (that is when().thenThrow()). It does not verify (that is verify()). It does not delete mocks.'),
    q('Why is it dangerous to write tests that depend on the execution order of other tests?', ['It makes the code run slower', 'It creates fragile tests that break when test order changes, violating test isolation principles', 'JUnit forbids it with a compilation error', 'It deletes previous test results'], 1, 'Test isolation is fundamental. If test B depends on test A running first, changing test order (parallel execution, filtering) breaks test B. Each test must set up its own state. Why others are wrong: It does not inherently slow code. JUnit does not forbid it at compile time. It does not delete results.')
  ],
  [
    'JUnit 5 provides @Test annotations and assertions (assertEquals, assertThrows) for automated verification.',
    'Test lifecycle hooks (@BeforeEach, @AfterEach) maintain clean, independent test states.',
    'Mockito stubs external dependencies with when().thenReturn() to keep unit tests fast and isolated.',
    'TDD follows Red-Green-Refactor: write failing test → minimum code to pass → refactor.',
    'The Test Pyramid recommends many unit tests, fewer integration tests, fewest E2E tests.'
  ],
  'If you want to use a big terminal on your own computer instead of the built-in one, please read Lesson 1 for full JDK setup instructions.'
),

// ==========================================
// LESSON 27: DATABASE CONNECTIVITY WITH JDBC & SQL
// ==========================================
L(
  'java-27', 27, 'Database Connectivity with JDBC & SQL', '🗄️',
  '🗄️ Data in memory is ephemeral; data in databases is permanent. Enterprise applications live and die by their ability to reliably store, query, and manipulate persistent data. JDBC (Java Database Connectivity) is the standard API bridging Java applications to relational databases. Mastering PreparedStatement security, transaction management, and connection pooling is the foundation of every backend system you will ever build.',
  [
    {
      title: '1. JDBC Architecture & Connections',
      beginner: 'JDBC is Java\'s standard API for talking to relational databases like MySQL or PostgreSQL. You connect using a URL, create a Connection, execute SQL statements, and receive results in a ResultSet. Think of it as a phone line between your Java code and the database server.',
      advanced: 'JDBC abstracts database vendor differences via the Driver interface. DriverManager.getConnection(url, user, password) establishes a TCP socket connection to the database server. The Connection object manages transactions and creates Statement objects. Statement executes raw SQL. PreparedStatement pre-compiles parameterized SQL. ResultSet provides a forward-only cursor over query results. All JDBC resources (Connection, Statement, ResultSet) implement AutoCloseable and MUST be closed via try-with-resources to prevent connection leaks.'
    },
    {
      title: '2. PreparedStatement vs Statement (SQL Injection Defense)',
      beginner: 'NEVER build SQL queries by concatenating user input with + signs! Hackers can inject malicious SQL (like \' OR 1=1 --) to steal or delete data. PreparedStatement uses ? placeholders that are safely filled AFTER the SQL is compiled, completely blocking injection attacks.',
      advanced: 'PreparedStatement pre-compiles SQL on the database server, creating an execution plan. Parameters are bound via setString(1, value), setInt(2, value), etc. The database driver handles proper escaping and type conversion. This provides: (1) SQL Injection immunity — user input is treated as data, never as code. (2) Performance — the compiled plan is cached for repeated executions. (3) Type safety — setInt() prevents string-to-number errors. Statement with string concatenation is NEVER safe for user input.'
    },
    {
      title: '3. Transactions & ACID Compliance',
      beginner: 'A transaction groups multiple SQL operations so they ALL succeed or ALL fail together. If you transfer money from Account A to Account B, both the deduction AND the deposit must complete. If either fails, you ROLLBACK everything. This is controlled by commit() and rollback().',
      advanced: 'Transactions enforce ACID properties: Atomicity (all or nothing), Consistency (valid state transitions), Isolation (concurrent transactions don\'t interfere), Durability (committed data survives crashes). By default, JDBC uses auto-commit (each statement commits immediately). For multi-statement transactions: conn.setAutoCommit(false); ... conn.commit(); on success or conn.rollback(); on exception. Transaction isolation levels (READ_COMMITTED, REPEATABLE_READ, SERIALIZABLE) control concurrency visibility. Spring\'s @Transactional declaratively manages this via AOP proxies.'
    },
    {
      title: '4. Connection Pooling (HikariCP)',
      beginner: 'Opening a database connection is expensive — it requires a network handshake, authentication, and resource allocation. Instead of opening and closing connections for every query, Connection Pools keep a set of pre-opened connections ready to reuse. HikariCP is the fastest pool in Java.',
      advanced: 'Connection pools maintain a fixed number of open connections (pool size). When code needs a connection, it borrows from the pool; when done, it returns the connection for reuse. HikariCP configuration: maximumPoolSize (default 10), connectionTimeout (30s), idleTimeout (10 min), maxLifetime (30 min). Pool exhaustion occurs when all connections are checked out and none are available — configure appropriately for your concurrent load. Spring Boot auto-configures HikariCP via spring.datasource.* properties.'
    },
    {
      title: '5. ORM Frameworks & JPA (Expert Teaser)',
      beginner: 'Writing raw SQL everywhere gets messy. ORM (Object-Relational Mapping) frameworks like Hibernate let you represent database tables as Java classes and rows as objects. You write Java code, and the framework generates the SQL for you!',
      advanced: '(Expert Teaser) JPA (Jakarta Persistence API) is the standard ORM specification; Hibernate is the most popular implementation. @Entity marks a class as a table mapping. @Id marks the primary key. @Column maps fields to columns. EntityManager manages entity lifecycle (persist, merge, remove, find). JPQL (Java Persistence Query Language) provides object-oriented queries. The N+1 query problem occurs when lazy-loaded associations trigger individual queries per entity — solve with JOIN FETCH or @EntityGraph. In the Expert track, we explore: Hibernate first/second-level caches, dirty checking mechanics, optimistic locking (@Version), Criteria API for dynamic queries, and Flyway/Liquibase for database schema migrations. We also explore how Spring Data JPA repositories auto-generate implementations from method names.'
    }
  ],
  {
    title: '🛠️ Mini-Project: Secure JDBC Transaction Manager',
    intro: '⚠️ NOTE: Build a database client simulation that executes parameterized SQL updates safely inside a rollback-capable transaction. Since we cannot connect to a real database in this environment, we simulate the JDBC patterns.',
    steps: [
      'Create a file named JdbcTransactionSimulator.java with the standard public class and main method boilerplate.',
      'Create a simulated PreparedStatement: public class SimulatedPreparedStatement { private String sql; private java.util.Map<Integer, Object> params = new java.util.HashMap<>(); public SimulatedPreparedStatement(String sql) { this.sql = sql; } public void setString(int index, String value) { params.put(index, value); System.out.println("Bound param " + index + " = " + value); } public void executeUpdate() { System.out.println("Executing: " + sql + " with " + params.size() + " params"); } }.',
      'Create transaction control: public class TransactionManager { private boolean autoCommit = true; public void setAutoCommit(boolean value) { this.autoCommit = value; } public void commit() { System.out.println("✅ Transaction COMMITTED"); } public void rollback() { System.out.println("❌ Transaction ROLLED BACK"); } }.',
      'Simulate a bank transfer: public static void transferFunds(TransactionManager tx, double fromBalance, double amount) { tx.setAutoCommit(false); try { System.out.println("Deducting " + amount + " from Account A"); if (fromBalance < amount) throw new RuntimeException("Insufficient funds"); System.out.println("Adding " + amount + " to Account B"); tx.commit(); } catch (Exception e) { System.out.println("Error: " + e.getMessage()); tx.rollback(); } }.',
      'In main, test successful transfer: transferFunds(tx, 100.0, 50.0);.',
      'Test failed transfer with rollback: transferFunds(tx, 100.0, 200.0);.',
      'Demonstrate PreparedStatement security: SimulatedPreparedStatement ps = new SimulatedPreparedStatement("UPDATE accounts SET balance = ? WHERE id = ?"); ps.setString(1, "100.0"); ps.setString(2, "user_input"); ps.executeUpdate();.',
      'Compile and execute: javac JdbcTransactionSimulator.java && java JdbcTransactionSimulator.'
    ],
    goal: 'You built a secure database client architecture enforcing parameterized query security, ACID transaction safety, and connection management patterns.'
  },
  [
    q('Why is PreparedStatement preferred over basic Statement for database queries in Java?', ['It runs without requiring a database password', 'It pre-compiles SQL queries and uses parameterized placeholders to prevent SQL Injection attacks', 'It automatically formats tables into HTML', 'It eliminates the need for SQL database connections'], 1, 'PreparedStatement parameterizes user inputs via ? placeholders, separating SQL code from data. This completely neutralizes SQL Injection because user input is never interpreted as executable SQL. Why others are wrong: It still requires credentials. It does not format HTML. It still requires a connection.'),
    q('What JDBC method must be called to permanently save changes made during a manual transaction?', ['conn.save()', 'conn.setAutoCommit(true)', 'conn.commit()', 'conn.close()'], 2, 'conn.commit() finalizes and persists all transaction updates to the database. Without commit, changes are rolled back when the connection closes. Why others are wrong: conn.save() does not exist. setAutoCommit(true) changes the commit mode but does not commit the current transaction. close() closes the connection.'),
    q('What is the purpose of using a Connection Pool (like HikariCP) in enterprise applications?', ['To create new database tables automatically', 'To reuse active database connections, preventing the overhead of repeatedly opening and closing TCP sockets', 'To convert SQL tables into JSON strings', 'To format terminal output text'], 1, 'Connection pools eliminate the expensive TCP handshake and authentication overhead of creating a new connection per query. Pools maintain pre-opened connections that are borrowed and returned. Why others are wrong: Pools do not create tables, convert to JSON, or format output.'),
    q('What does the "A" in ACID stand for in database transactions?', ['Availability', 'Atomicity — all operations in a transaction succeed together or all fail together', 'Authentication', 'Asynchrony'], 1, 'Atomicity guarantees that a transaction is treated as a single unit: either ALL statements commit, or NONE do. If any statement fails, the entire transaction rolls back. Why others are wrong: Availability is a distributed systems concept. Authentication is security. Asynchrony is concurrency.'),
    q('What is the N+1 query problem in ORM frameworks?', ['When a query returns more than N rows', 'When loading a list of entities triggers one initial query plus N additional queries to load lazy associations for each entity', 'When the database has more than N tables', 'When a transaction has more than N statements'], 1, 'N+1 occurs when lazy-loaded relationships (like order.getItems()) trigger a separate query for EACH parent entity. For 100 orders, this becomes 1 + 100 = 101 queries instead of 1 JOIN query. Why others are wrong: It is not about row count, table count, or statement count. It is specifically about lazy loading inefficiency.')
  ],
  [
    'JDBC connects Java to relational databases via DriverManager and Connection objects.',
    'ALWAYS use PreparedStatement with ? placeholders to prevent SQL Injection attacks.',
    'Manage multi-step atomic operations using ACID transactions (setAutoCommit(false), commit(), rollback()).',
    'Connection pools (HikariCP) eliminate TCP handshake overhead by reusing open connections.',
    'ORM frameworks (Hibernate/JPA) map Java objects to database tables, but beware the N+1 query trap.'
  ],
  'If you want to use a big terminal on your own computer instead of the built-in one, please read Lesson 1 for full JDK setup instructions.'
),

// ==========================================
// LESSON 28: SPRING BOOT ESSENTIALS & REST APIs
// ==========================================
L(
  'java-28', 28, 'Spring Boot Essentials & REST APIs', '🌱',
  '🌱 Spring Boot is the industry-standard framework for building production Java backend applications. It eliminates boilerplate configuration through auto-configuration, embedded servers, and opinionated defaults. Understanding Dependency Injection (Inversion of Control), RESTful API design, and Spring\'s annotation-driven architecture is the gateway to enterprise Java development. Every major company — from banks to streaming services — runs on Spring.',
  [
    {
      title: '1. Inversion of Control (IoC) & Dependency Injection',
      beginner: 'In normal Java, YOU create objects with new. In Spring, the framework creates and manages objects for you! This is Inversion of Control. Spring scans your classes, creates instances (called Beans), and automatically "injects" them wherever they are needed using @Autowired.',
      advanced: 'The Spring IoC Container (ApplicationContext) manages the lifecycle of Spring Beans. Dependency Injection (DI) decouples components: instead of new Service(), Spring injects the dependency via constructor, setter, or field injection. Constructor injection is preferred (immutable, testable, explicit). @Component, @Service, @Repository, @Controller are stereotypes auto-detected by component scanning. @Configuration + @Bean methods define programmatic bean definitions. DI enables loose coupling, easy mocking in tests, and adherence to SOLID principles.'
    },
    {
      title: '2. RESTful Architecture & HTTP Semantics',
      beginner: 'REST APIs allow backend Java apps to communicate with frontend apps, mobile apps, or other services using JSON over HTTP. GET reads data, POST creates new data, PUT updates existing data, DELETE removes data. Spring\'s @RestController handles all of this automatically!',
      advanced: 'REST (Representational State Transfer) is a stateless architectural style. Resources are identified by URIs (/api/users/123). HTTP methods map to CRUD: GET (read), POST (create), PUT/PATCH (update), DELETE (remove). @RestController combines @Controller + @ResponseBody — return values are serialized to JSON via Jackson. @RequestMapping/@GetMapping/@PostMapping map URIs to handler methods. HTTP status codes: 200 OK, 201 Created, 204 No Content, 400 Bad Request, 404 Not Found, 500 Internal Server Error.'
    },
    {
      title: '3. Spring Annotations & Request Handling',
      beginner: 'Spring uses annotations to route web requests: @GetMapping("/users") handles page visits, @PostMapping receives new JSON data via @RequestBody, and @PathVariable extracts IDs directly from the URL like /users/5.',
      advanced: 'HTTP request mappings: @GetMapping, @PostMapping, @PutMapping, @DeleteMapping, @PatchMapping. Parameter annotations: @PathVariable binds URI segments (/users/{id}), @RequestParam binds query parameters (?page=1), @RequestBody deserializes JSON payload to Java object via Jackson, @RequestHeader extracts HTTP headers. Response: ResponseEntity<T> allows custom status codes and headers. @Valid triggers Bean Validation (JSR-380) on @RequestBody payloads. Exception handling: @ExceptionHandler methods or @ControllerAdvice for global error handling.'
    },
    {
      title: '4. Spring Data JPA & Repository Pattern',
      beginner: 'Spring Data JPA eliminates boilerplate database code. You define an interface extending JpaRepository, and Spring automatically generates the implementation! Methods like findByName(String name) are parsed and converted to SQL queries automatically.',
      advanced: 'Spring Data JPA generates repository implementations at runtime via dynamic proxies. JpaRepository<T, ID> provides CRUD methods (save, findById, delete, findAll). Derived queries: findByEmail(String email) generates SELECT * FROM users WHERE email = ?. @Query allows custom JPQL or native SQL. Pagination: Pageable parameter + Page<T> return type. The @Repository stereotype enables exception translation (SQLException → DataAccessException). Transaction management: @Transactional on service methods ensures atomicity.'
    },
    {
      title: '5. Spring Security & Microservices (Expert Teaser)',
      beginner: 'Production APIs need security! Spring Security handles authentication (who are you?) and authorization (what can you do?). For large systems, Spring Cloud enables microservices — splitting your app into small, independent services that communicate over HTTP.',
      advanced: '(Expert Teaser) Spring Security provides filter-chain-based authentication/authorization. JWT (JSON Web Tokens) enable stateless API security. @PreAuthorize enforces method-level security. OAuth2/OpenID Connect enables social login. For microservices: Spring Cloud Netflix (Eureka service discovery, Ribbon load balancing), Spring Cloud Gateway (API gateway), Spring Cloud Config (centralized configuration), Resilience4j (circuit breakers). In the Expert track, we explore: reactive programming with Spring WebFlux, GraphQL APIs with Spring for GraphQL, distributed tracing with Micrometer/Zipkin, event-driven architecture with Spring Cloud Stream/Kafka, and Kubernetes deployment patterns for Spring Boot microservices.'
    }
  ],
  {
    title: '🛠️ Mini-Project: Simulated Spring REST Controller Engine',
    intro: '⚠️ NOTE: Build a simulated lightweight Spring Boot REST controller handling HTTP routes and serializing object responses to JSON strings. Since we cannot run a full Spring Boot server in this environment, we simulate the framework patterns.',
    steps: [
      'Create a file named RestControllerSimulator.java with the standard public class and main method boilerplate.',
      'Create a Product model: public class Product { private int id; private String name; private double price; /* constructors, getters, setters */ }.',
      'Simulate a @Service component: public class ProductService { private java.util.Map<Integer, Product> products = new java.util.HashMap<>(); public ProductService() { products.put(1, new Product(1, "Laptop", 999.99)); } public Product findById(int id) { return products.get(id); } public void save(Product p) { products.put(p.getId(), p); } }.',
      'Simulate a @RestController: public class ProductController { private ProductService service; public ProductController(ProductService service) { this.service = service; } }.',
      'Simulate @GetMapping("/products/{id}"): public String handleGet(int id) { Product p = service.findById(id); return toJson(p); }.',
      'Simulate @PostMapping("/products"): public String handlePost(String jsonBody) { Product p = fromJson(jsonBody); service.save(p); return "201 Created"; }.',
      'Write a simple toJson method: private String toJson(Product p) { return "{\\"id\\":" + p.getId() + ",\\"name\\":\\"" + p.getName() + "\\",\\"price\\":" + p.getPrice() + "}"; }.',
      'In main, simulate dependency injection: ProductService service = new ProductService(); ProductController controller = new ProductController(service);.',
      'Test GET: System.out.println(controller.handleGet(1));.',
      'Test POST: System.out.println(controller.handlePost("{\\"id\\":2,\\"name\\":\\"Phone\\",\\"price\\":599.99}"));.',
      'Compile and execute: javac RestControllerSimulator.java && java RestControllerSimulator.'
    ],
    goal: 'You understood Spring Boot web architecture, IoC dependency injection, RESTful HTTP API routing, and JSON serialization patterns.'
  },
  [
    q('What is Dependency Injection (DI) in the Spring Framework?', ['Downloading JAR files from remote servers', 'A design pattern where the Spring container automatically creates and injects required objects into components instead of the components creating them manually', 'Writing raw SQL queries inside text files', 'Converting Java bytecode into web scripts'], 1, 'Spring IoC container manages bean creation and injects dependencies via constructor, setter, or field injection. This decouples components and enables easy testing with mocks. Why others are wrong: It is not about downloading files, writing SQL, or converting bytecode.'),
    q('Which Spring Boot annotation marks a class as a web REST controller that outputs JSON responses?', ['@Service', '@Repository', '@RestController', '@Configuration'], 2, '@RestController combines @Controller + @ResponseBody. It handles HTTP routes and automatically serializes return values to JSON via Jackson. Why others are wrong: @Service is business logic. @Repository is data access. @Configuration defines bean definitions.'),
    q('Which annotation extracts dynamic URL parameters (such as extracting 5 from /users/5) inside a Spring endpoint method?', ['@RequestBody', '@PathVariable', '@Autowired', '@ResponseBody'], 1, '@PathVariable binds URI template variables to method parameters. In @GetMapping("/users/{id}"), @PathVariable int id extracts the value 5 from /users/5. Why others are wrong: @RequestBody parses JSON payload. @Autowired injects dependencies. @ResponseBody marks return values for serialization.'),
    q('What does the @Transactional annotation do in Spring?', ['It makes the code run faster', 'It wraps the method in a database transaction — committing on success and rolling back on exception', 'It translates the method to another language', 'It prevents the method from being called'], 1, '@Transactional enables declarative transaction management via AOP proxies. If the method completes normally, the transaction commits. If a RuntimeException is thrown, it rolls back. Why others are wrong: It does not affect speed, translate code, or block execution.'),
    q('What is the purpose of Spring Data JPA repositories?', ['To store files on the filesystem', 'To auto-generate database access implementations from interface method names, eliminating boilerplate SQL code', 'To create user interface components', 'To manage network connections'], 1, 'Spring Data JPA generates repository implementations at runtime. Methods like findByName(String name) are parsed and converted to SQL queries automatically. Why others are wrong: It is not for file storage, UI components, or network connections.')
  ],
  [
    'Spring Boot uses Dependency Injection to manage object creation and component lifecycles automatically.',
    'REST APIs expose stateless web endpoints that serialize Java objects into JSON payloads via Jackson.',
    'Use @GetMapping, @PostMapping, @RequestBody, @PathVariable to route and parse HTTP web requests.',
    'Spring Data JPA auto-generates database access code from repository interface method names.',
    '@Transactional provides declarative transaction management for ACID compliance.'
  ],
  'If you want to use a big terminal on your own computer instead of the built-in one, please read Lesson 1 for full JDK setup instructions.'
),

// ==========================================
// LESSON 29: ESSENTIAL SOFTWARE DESIGN PATTERNS IN JAVA
// ==========================================
L(
  'java-29', 29, 'Essential Software Design Patterns in Java', '🏛️',
  '🏛️ Design patterns are proven, battle-tested solution templates for recurring software architectural challenges. They are not code libraries — they are thinking frameworks distilled from decades of engineering experience. The Gang of Four (GoF) catalog categorizes patterns into Creational (object creation), Structural (object composition), and Behavioral (object communication). Mastering these patterns transforms you from someone who writes code into someone who architects systems.',
  [
    {
      title: '1. Creational Patterns: Singleton & Factory',
      beginner: 'The Singleton pattern ensures a class can only ever have ONE instance in the whole program — great for database connections or configuration managers. The Factory pattern uses a creator method to generate objects without exposing the complex creation logic to the caller.',
      advanced: 'Singleton guarantees a single global instance via private constructor + static getInstance(). Thread-safe implementations: (1) Enum Singleton (best — serialization-safe, reflection-proof), (2) Double-Checked Locking with volatile, (3) Bill Pugh (static inner class). Factory Method delegates instantiation to subclasses or static factory methods, hiding complex construction logic. Abstract Factory creates families of related objects. These patterns decouple object creation from usage, enabling dependency injection and testability.'
    },
    {
      title: '2. Creational Pattern: Builder',
      beginner: 'The Builder pattern builds complex objects step-by-step using readable method chains like new User.Builder().setName("Alice").setAge(30).build(). This avoids huge confusing constructors with dozens of optional arguments!',
      advanced: 'Builder eliminates "telescoping constructors" — constructors with 10+ optional parameters that become unreadable. Implementation: static inner Builder class with fluent setter methods returning this, culminating in a final build() method. Effective Java Item 2: "Consider a builder when faced with many constructor parameters." Modern Java records + static factory methods can replace simple builders. Lombok @Builder auto-generates builder code at compile time.'
    },
    {
      title: '3. Structural Patterns: Adapter & Decorator',
      beginner: 'The Adapter pattern converts one interface into another so incompatible classes can work together — like a power adapter for international travel. The Decorator pattern adds new functionality to objects dynamically without changing their class — like adding toppings to a pizza.',
      advanced: 'Adapter (structural) wraps an existing class with a new interface, enabling incompatible interfaces to collaborate. Java examples: InputStreamReader adapts byte streams to character streams. Decorator (structural) adds behavior dynamically via composition rather than inheritance. Java I/O is built on Decorator: new BufferedReader(new InputStreamReader(new FileInputStream("file"))). This enables runtime flexibility and avoids class explosion from inheritance hierarchies.'
    },
    {
      title: '4. Behavioral Patterns: Observer & Strategy',
      beginner: 'The Observer pattern lets objects "subscribe" to event notifications — like YouTube subscribers getting notified when a new video drops. The Strategy pattern lets you swap out algorithms dynamically at runtime — like switching between different payment methods.',
      advanced: 'Observer (behavioral) implements publish-subscribe: a Subject maintains a list of Observers and notifies them on state changes. Java has PropertyChangeListener and Spring ApplicationEvent. Strategy (behavioral) encapsulates interchangeable algorithms behind a common interface, enabling runtime algorithm substitution. Payment processing: PaymentStrategy interface with CreditCardStrategy, PayPalStrategy, CryptoStrategy implementations. This replaces conditional if/else chains with polymorphism.'
    },
    {
      title: '5. SOLID Principles & Enterprise Patterns (Expert Teaser)',
      beginner: 'Design patterns work best when combined with SOLID principles: Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion. These five rules guide you toward maintainable, scalable architectures.',
      advanced: '(Expert Teaser) SOLID principles underpin all design patterns: SRP (one reason to change), OCP (open for extension, closed for modification), LSP (subtypes must be substitutable), ISP (no client should depend on unused methods), DIP (depend on abstractions). Enterprise patterns: Repository Pattern (data access abstraction), Service Layer Pattern (business logic isolation), DTO Pattern (data transfer objects), CQRS (Command Query Responsibility Segregation), Event Sourcing (store events, not state). In the Expert track, we explore: Domain-Driven Design (DDD) with aggregates and bounded contexts, Hexagonal Architecture (ports and adapters), microservices patterns (Saga, API Gateway, Circuit Breaker), and reactive patterns with Project Reactor.'
    }
  ],
  {
    title: '🛠️ Mini-Project: Multi-Pattern E-Commerce Order Processor',
    intro: '⚠️ NOTE: Build a modular ordering system integrating Singleton configuration, Builder order construction, and Strategy payment selection.',
    steps: [
      'Create a file named DesignPatternsDemo.java with the standard public class and main method boilerplate.',
      'Implement Singleton: public class AppConfig { private static AppConfig instance; private String dbUrl; private AppConfig() { this.dbUrl = "jdbc:mysql://localhost/shop"; } public static synchronized AppConfig getInstance() { if (instance == null) instance = new AppConfig(); return instance; } public String getDbUrl() { return dbUrl; } }.',
      'Implement Builder: public class Order { private final String customer; private final String product; private final double total; private Order(Builder b) { this.customer = b.customer; this.product = b.product; this.total = b.total; } public static class Builder { private String customer, product; private double total; public Builder customer(String c) { this.customer = c; return this; } public Builder product(String p) { this.product = p; return this; } public Builder total(double t) { this.total = t; return this; } public Order build() { return new Order(this); } } }.',
      'Implement Strategy: public interface PaymentStrategy { void pay(double amount); } public class CreditCardPayment implements PaymentStrategy { public void pay(double amount) { System.out.println("Paid $" + amount + " via Credit Card"); } } public class CryptoPayment implements PaymentStrategy { public void pay(double amount) { System.out.println("Paid $" + amount + " via Bitcoin"); } }.',
      'Create OrderProcessor: public class OrderProcessor { private PaymentStrategy strategy; public void setStrategy(PaymentStrategy s) { this.strategy = s; } public void process(Order order) { strategy.pay(order.getTotal()); } }.',
      'In main, demonstrate all three patterns: AppConfig config = AppConfig.getInstance(); Order order = new Order.Builder().customer("Alice").product("Laptop").total(999.99).build(); OrderProcessor processor = new OrderProcessor(); processor.setStrategy(new CreditCardPayment()); processor.process(order);.',
      'Swap strategy at runtime: processor.setStrategy(new CryptoPayment()); processor.process(order);.',
      'Compile and execute: javac DesignPatternsDemo.java && java DesignPatternsDemo.'
    ],
    goal: 'You successfully implemented battle-tested enterprise design patterns (Singleton, Builder, Strategy) demonstrating creational and behavioral pattern mastery.'
  },
  [
    q('Which design pattern prevents a class from being instantiated more than once across an entire application?', ['Factory', 'Singleton', 'Observer', 'Strategy'], 1, 'Singleton guarantees a single global instance by enforcing a private constructor and providing a static getInstance() accessor. Thread-safe implementations use enum, double-checked locking, or static inner class. Why others are wrong: Factory creates multiple instances. Observer manages subscriptions. Strategy swaps algorithms.'),
    q('Why is the Builder pattern preferred when creating complex objects with many optional fields?', ['It makes code run faster in CPU memory', 'It replaces long, confusing telescoping constructors with clear, chainable, fluent methods', 'It converts Java classes into SQL tables', 'It removes the need for getters'], 1, 'Builder avoids the telescoping constructor anti-pattern (constructors with 10+ parameters) by providing readable fluent method chaining: builder.setName().setAge().build(). Why others are wrong: It does not affect CPU speed, convert to SQL, or remove getters.'),
    q('Which pattern enables swapping out an algorithm (such as changing sorting or payment logic) dynamically at runtime?', ['Observer Pattern', 'Strategy Pattern', 'Singleton Pattern', 'Factory Pattern'], 1, 'Strategy encapsulates interchangeable algorithms behind a common interface, allowing the client to switch implementations at runtime without modifying the client code. Why others are wrong: Observer is for notifications. Singleton is for single instances. Factory is for object creation.'),
    q('What does the "S" in SOLID stand for?', ['Static binding', 'Single Responsibility Principle — a class should have only one reason to change', 'Synchronized methods', 'String manipulation'], 1, 'Single Responsibility Principle states that a class should have exactly one responsibility and one reason to change. This promotes cohesion and reduces coupling. Why others are wrong: It is not about static binding, synchronization, or strings.'),
    q('What is the primary difference between the Adapter and Decorator patterns?', ['Adapter adds new functionality; Decorator changes interfaces', 'Adapter converts one interface to another for compatibility; Decorator adds behavior dynamically without changing the interface', 'They are identical', 'Adapter is for databases; Decorator is for UI'], 1, 'Adapter changes the interface to make incompatible classes work together. Decorator keeps the same interface but adds behavior dynamically via composition. Why others are wrong: They are not identical, and both apply to any domain, not specific ones.')
  ],
  [
    'Singleton enforces a single global instance; Factory decouples object creation logic from usage.',
    'Builder uses fluent method chaining to cleanly construct complex objects with optional parameters.',
    'Adapter converts interfaces for compatibility; Decorator adds behavior dynamically via composition.',
    'Strategy encapsulates interchangeable algorithms behind common interfaces for flexible runtime swapping.',
    'SOLID principles guide pattern application: Single Responsibility, Open/Closed, Liskov, Interface Segregation, Dependency Inversion.'
  ],
  'If you want to use a big terminal on your own computer instead of the built-in one, please read Lesson 1 for full JDK setup instructions.'
),

// ==========================================
// LESSON 30: CAPSTONE PROJECT & DEPLOYMENT
// ==========================================
L(
  'java-30', 30, 'Capstone Project & Deployment', '🚀',
  '🚀 Congratulations on reaching the final lesson of the core Java track! This capstone module synthesizes everything you have learned across 30 lessons into a production-grade, multi-layered application. You will review enterprise architecture patterns, build executable JAR artifacts, containerize with Docker, and automate deployment via CI/CD pipelines. This is the bridge between learning Java and shipping Java to the world.',
  [
    {
      title: '1. Production Application Architecture',
      beginner: 'Production applications separate code into organized layers: Controllers handle web URLs, Services execute business rules, and Repositories talk to the database. This layered structure keeps systems clean, testable, and maintainable.',
      advanced: 'Multi-tier architecture enforces Separation of Concerns: Presentation Layer (@RestController) handles HTTP, Business Layer (@Service) contains domain logic, Data Access Layer (@Repository) manages persistence, Database stores data. DTOs (Data Transfer Objects) isolate internal entities from external APIs. Dependency flow is strictly downward: Controller → Service → Repository. This enables independent testing, team parallelism, and technology swapping per layer.'
    },
    {
      title: '2. Executable JARs & Build Artifacts',
      beginner: 'To ship your app to production, build tools package all compiled code and dependencies into a single executable "fat JAR" file. You can run it anywhere with java -jar app.jar — no installation needed!',
      advanced: 'Maven/Gradle package applications into JAR archives. Spring Boot creates executable uber-JARs containing application code + embedded Tomcat server + all dependencies. The JAR manifest specifies Main-Class for java -jar execution. Multi-module projects produce separate JARs per module. Versioning follows Semantic Versioning (MAJOR.MINOR.PATCH). Build reproducibility requires pinned dependency versions and deterministic compilation flags.'
    },
    {
      title: '3. Docker Containerization',
      beginner: 'Docker packages your JAR file along with a Java runtime into a lightweight "container" that runs identically on your laptop, your teammate\'s laptop, and the cloud server. No more "it works on my machine"!',
      advanced: 'Dockerfile defines container build: FROM eclipse-temurin:21-jre (base image with JRE), COPY target/app.jar /app.jar, ENTRYPOINT ["java", "-jar", "/app.jar"]. Multi-stage builds separate build environment (JDK) from runtime environment (JRE), reducing image size. Docker Compose orchestrates multi-container applications (app + database + cache). Container registries (Docker Hub, AWS ECR, Google Artifact Registry) store versioned images. Containers are ephemeral — state lives in volumes or external databases.'
    },
    {
      title: '4. CI/CD Deployment Pipelines',
      beginner: 'Continuous Integration / Continuous Deployment (CI/CD) pipelines automatically compile code, run unit tests, build Docker images, and deploy to cloud servers whenever code is pushed to GitHub. No more manual deployments!',
      advanced: 'CI/CD pipelines (GitHub Actions, Jenkins, GitLab CI) automate delivery: code push triggers build → test → package → deploy. GitHub Actions workflow: on push, run mvn clean verify (compile + test), docker build, docker push to registry, deploy to Kubernetes/ECS. Blue-green deployments minimize downtime. Feature flags enable gradual rollouts. Monitoring (Prometheus, Grafana) and alerting (PagerDuty) complete the production loop.'
    },
    {
      title: '5. Cloud Deployment & Career Path (Expert Teaser)',
      beginner: 'Your Java application can run on cloud platforms like AWS, Google Cloud, or Azure. These platforms handle servers, scaling, and monitoring so you can focus on code. The Java Expert track dives deep into cloud-native development!',
      advanced: '(Expert Teaser) Cloud deployment options: (1) PaaS (Heroku, Google App Engine) — simplest, push code and it runs. (2) Containers (AWS ECS, Google Cloud Run, Kubernetes) — Docker containers with orchestration. (3) Serverless (AWS Lambda) — function-per-request, auto-scaling. (4) IaaS (AWS EC2) — full control, manual management. Spring Boot integrates with cloud services via Spring Cloud AWS/GCP/Azure. In the Expert track, we explore: Kubernetes orchestration (deployments, services, ingress), Helm charts, Istio service mesh, distributed tracing (Jaeger, Zipkin), log aggregation (ELK stack), and cost optimization strategies for cloud-native Java applications.'
    }
  ],
  {
    title: '🛠️ Capstone Project: Full REST API Service Backend',
    intro: '⚠️ NOTE: Build the grand final Capstone Project! Implement an end-to-end multi-layer REST API service featuring layered architecture, custom exception handling, thread-safe memory storage, functional Stream analytics, and JSON processing.',
    steps: [
      'Create a file named CapstoneBackend.java with the standard public class and main method boilerplate.',
      'Define a Product model: public class Product { private int id; private String name; private String category; private double price; /* constructors, getters */ }.',
      'Create ProductRepository: public class ProductRepository { private java.util.concurrent.ConcurrentHashMap<Integer, Product> store = new java.util.concurrent.ConcurrentHashMap<>(); public void save(Product p) { store.put(p.getId(), p); } public Product findById(int id) { return store.get(id); } public java.util.Collection<Product> findAll() { return store.values(); } }.',
      'Create ProductService with Stream analytics: public class ProductService { private ProductRepository repo; public ProductService(ProductRepository repo) { this.repo = repo; } public java.util.Map<String, Double> getRevenueByCategory() { return repo.findAll().stream().collect(java.util.stream.Collectors.groupingBy(Product::getCategory, java.util.stream.Collectors.summingDouble(Product::getPrice))); } }.',
      'Define custom exception: public class ProductNotFoundException extends Exception { public ProductNotFoundException(String msg) { super(msg); } }.',
      'Create ProductController: public class ProductController { private ProductService service; public ProductController(ProductService service) { this.service = service; } public String handleGetAnalytics() { return service.getRevenueByCategory().toString(); } }.',
      'In main, wire dependencies (simulating DI): ProductRepository repo = new ProductRepository(); repo.save(new Product(1, "Laptop", "Electronics", 999.99)); repo.save(new Product(2, "Book", "Education", 29.99));.',
      'Create service and controller: ProductService service = new ProductService(repo); ProductController controller = new ProductController(service);.',
      'Simulate HTTP GET /api/analytics: System.out.println("GET /api/analytics → " + controller.handleGetAnalytics());.',
      'Compile and execute: javac CapstoneBackend.java && java CapstoneBackend.',
      'Congratulations! You built a complete, multi-layered REST API backend integrating OOP, Collections, Concurrency, Streams, Exceptions, and REST architecture!'
    ],
    goal: 'You built a complete, multi-layered REST API backend system integrating OOP, Collections, Concurrency, Streams, Exceptions, and REST architecture. Congratulations on completing all 30 lessons!'
  },
  [
    q('Why do production Java backend applications separate code into Controller, Service, and Repository layers?', ['To force the application to use more memory', 'To enforce Separation of Concerns, making code maintainable, decoupled, and easy to test', 'To convert Java code to JavaScript automatically', 'Because Java will not compile without three folders'], 1, 'Layered architecture enforces clear separation of web handling (Controller), business logic (Service), and database access (Repository). This enables independent testing, team parallelism, and technology swapping. Why others are wrong: It does not increase memory, convert languages, or require specific folder counts.'),
    q('What is the main benefit of containerizing a Java application JAR file using Docker?', ['It removes the need to write unit tests', 'It creates a lightweight, portable container that runs identically across any cloud or local environment', 'It makes database queries run without SQL', 'It doubles the CPU speed automatically'], 1, 'Docker packages application binaries and runtime environments into immutable, portable deployment containers, eliminating "it works on my machine" inconsistencies. Why others are wrong: It does not remove testing, bypass SQL, or affect CPU speed.'),
    q('What is the role of a CI/CD pipeline in modern software development?', ['To write application source code automatically without human input', 'To automate building, testing, packaging, and deploying software whenever changes occur', 'To clean up physical RAM memory chips', 'To replace build tools like Maven'], 1, 'CI/CD pipelines automate software build, test, and deployment workflows to ensure reliable, repeatable delivery. Every code push triggers automated verification and deployment. Why others are wrong: It does not write code, clean hardware, or replace build tools.'),
    q('What is a "fat JAR" in Java deployment?', ['A JAR file that is compressed to save space', 'A JAR file that contains the application code PLUS all its dependencies bundled together, enabling java -jar execution', 'A JAR file that only works on Windows', 'A JAR file that cannot be run'], 1, 'A fat JAR (uber-JAR) packages application code + all dependencies into a single executable archive. Spring Boot creates these with embedded Tomcat, enabling standalone execution via java -jar app.jar. Why others are wrong: It is not compressed, not OS-specific, and is specifically designed to be runnable.'),
    q('What does "infrastructure as code" mean in cloud deployment?', ['Writing code that runs on physical servers only', 'Defining cloud infrastructure (servers, networks, databases) via configuration files that can be versioned and automated', 'Coding the hardware chips manually', 'Using only GUI tools to manage servers'], 1, 'Infrastructure as Code (IaC) tools like Terraform, AWS CloudFormation, or Kubernetes manifests define infrastructure declaratively, enabling version control, automation, and reproducibility. Why others are wrong: It is not physical-only, not hardware coding, and is the opposite of GUI-only management.')
  ],
  [
    'Production Java architectures enforce multi-layered separation of concerns (Controller, Service, Repository).',
    'Docker packages executable Java JAR files into portable, self-contained container images.',
    'CI/CD pipelines automate build, test, and deployment workflows for reliable software delivery.',
    'Fat JARs bundle application code + dependencies for standalone java -jar execution.',
    'Congratulations on completing all 30 lessons! You now possess a solid foundation in core Java, OOP, Collections, Concurrency, and modern web APIs.'
  ],
  'If you want to use a big terminal on your own computer instead of the built-in one, please read Lesson 1 for full JDK setup instructions.'
),

// ==========================================
// PART 7: EXPERT BRIDGE LESSONS (31-35)
// ==========================================

// ==========================================
// LESSON 31: ADVANCED STREAMS & FUNCTIONAL COMPOSITION
// ==========================================
L(
  'java-31', 31, 'Advanced Streams & Functional Composition', '🌊',
  '🌊 You have mastered the basics of the Stream API. Now it is time to unlock the advanced capabilities that separate intermediate developers from functional programming experts. Custom Spliterators, flatMap for nested structures, advanced collectors with downstream grouping, and stream pipeline optimization are the tools that power high-performance data processing in enterprise systems. This lesson bridges the gap between using streams and mastering them.',
  [
    {
      title: '1. flatMap & Nested Structure Flattening',
      beginner: 'What if you have a list of lists, and you want to process ALL items as one big stream? flatMap is your tool! It transforms each element into a stream and flattens all those streams into one continuous pipeline.',
      advanced: 'flatMap(Function<T, Stream<R>>) applies a one-to-many transformation: each input element maps to a stream of output elements, and all streams are flattened into a single output stream. Example: List<List<Integer>> nested → nested.stream().flatMap(List::stream) produces a single Stream<Integer>. This is the monadic bind operation from functional programming. Common use cases: splitting strings into words, extracting tags from articles, traversing tree structures.'
    },
    {
      title: '2. Advanced Collectors & Downstream Grouping',
      beginner: 'Collectors can do much more than toList()! You can group by multiple levels, compute statistics per group, join strings with separators, and even partition data into two groups based on a condition.',
      advanced: 'Collectors.groupingBy(classifier, downstream) enables multi-level grouping: groupingBy(Department::getName, groupingBy(Employee::getRole, counting())) produces Map<String, Map<String, Long>>. Downstream collectors: summingDouble, averagingDouble, summarizingDouble, joining, toSet, mapping, reducing. partitioningBy(predicate) splits into Map<Boolean, List<T>>. Collectors.toMap(keyFn, valueFn, mergeFn) handles key collisions. These composable collectors eliminate imperative nested loops entirely.'
    },
    {
      title: '3. Stream Pipeline Optimization & Short-Circuiting',
      beginner: 'Streams are smart! Operations like findFirst() and anyMatch() stop processing as soon as they find an answer. This is called short-circuiting, and it can save millions of operations on large datasets.',
      advanced: 'Short-circuiting operations: findFirst(), findAny(), anyMatch(), allMatch(), noneMatch(), limit(n). These terminate the pipeline early. For infinite streams (Stream.generate, Stream.iterate), short-circuiting is MANDATORY to avoid infinite execution. The JIT compiler optimizes stream pipelines via loop fusion (combining multiple operations into a single pass), escape analysis, and vectorization. For maximum performance: prefer stateless operations (filter, map) over stateful ones (sorted, distinct), and use primitive streams (IntStream, LongStream, DoubleStream) to avoid autoboxing.'
    },
    {
      title: '4. Custom Spliterators & Infinite Streams',
      beginner: 'You can create streams that never end! Stream.generate(() -> Math.random()) produces infinite random numbers. Stream.iterate(0, n -> n + 1) counts forever. Combine with limit() to take only what you need.',
      advanced: 'Custom Spliterators enable streaming over non-collection data sources: database cursors, file systems, message queues, infinite mathematical sequences. Spliterator interface: tryAdvance(Consumer), trySplit(), estimateSize(), characteristics(). The characteristics (ORDERED, DISTINCT, SORTED, SIZED, SUBSIZED, IMMUTABLE, CONCURRENT, NONNULL) inform the stream engine about optimization opportunities. Stream.generate(Supplier) produces infinite streams. Stream.iterate(seed, next) produces sequential streams. These are lazy — elements are computed on demand.'
    },
    {
      title: '5. Stream Anti-Patterns & Performance Traps (Expert Teaser)',
      beginner: 'Streams are powerful but not always the right tool. Using parallelStream() on tiny lists, mutating external state inside stream operations, or overusing streams for simple loops can actually make your code SLOWER and harder to read.',
      advanced: '(Expert Teaser) Stream anti-patterns: (1) parallelStream() on small datasets (< 10,000 elements) — ForkJoinPool overhead dominates. (2) Mutating external collections inside forEach — breaks parallel safety. (3) Using streams for simple index-based loops — overhead exceeds benefit. (4) Boxing with map(Integer::intValue) instead of mapToInt. (5) Collecting to intermediate lists unnecessarily. Performance traps: sorted() is O(n) memory, distinct() maintains a HashSet, limit() on sorted streams still sorts everything. In the Expert track, we explore JMH benchmarking for stream performance, SIMD vectorization via the Vector API, and how GraalVM Native Image optimizes stream pipelines differently from JIT compilation.'
    }
  ],
  {
    title: '🛠️ Mini-Project: Advanced Data Analytics Pipeline',
    intro: '⚠️ NOTE: Build an advanced analytics engine using flatMap, multi-level grouping, short-circuiting, and infinite streams.',
    steps: [
      'Create a file named AdvancedStreams.java with the standard public class and main method boilerplate.',
      'Import java.util.*, java.util.stream.*.',
      'Create nested data: List<List<String>> teams = List.of(List.of("Alice", "Bob"), List.of("Charlie", "Diana"));.',
      'Flatten with flatMap: List<String> allMembers = teams.stream().flatMap(List::stream).collect(Collectors.toList()); Print allMembers.',
      'Create Employee class with name, department, salary. Create a list of 10 employees.',
      'Multi-level grouping: Map<String, Double> avgSalaryByDept = employees.stream().collect(Collectors.groupingBy(Employee::getDepartment, Collectors.averagingDouble(Employee::getSalary))); Print result.',
      'Short-circuit: Optional<Employee> highEarner = employees.stream().filter(e -> e.getSalary() > 100000).findFirst(); Print if found.',
      'Infinite stream with limit: List<Integer> squares = Stream.iterate(1, n -> n + 1).map(n -> n * n).limit(10).collect(Collectors.toList()); Print squares.',
      'Primitive stream optimization: int sum = employees.stream().mapToInt(Employee::getSalary).sum(); Print sum.',
      'Compile and execute: javac AdvancedStreams.java && java AdvancedStreams.'
    ],
    goal: 'You mastered advanced stream operations: flatMap flattening, multi-level collectors, short-circuiting, infinite streams, and primitive stream optimization.'
  },
  [
    q('What does flatMap do in a Stream pipeline?', ['It sorts the elements alphabetically', 'It transforms each element into a stream and flattens all resulting streams into a single output stream', 'It removes duplicate elements', 'It converts the stream to a list'], 1, 'flatMap applies a one-to-many transformation: each input element maps to a Stream, and all streams are merged into one. Example: List<List<Integer>> → flatMap(List::stream) → Stream<Integer>. Why others are wrong: It does not sort (that is sorted()). It does not deduplicate (that is distinct()). It does not convert to list (that is collect()).'),
    q('What is the benefit of using IntStream instead of Stream<Integer> for numeric operations?', ['IntStream is easier to read', 'IntStream avoids autoboxing overhead by operating on primitive int values directly', 'IntStream is the only stream that works with numbers', 'IntStream runs on a separate thread'], 1, 'Stream<Integer> boxes each int into an Integer object, creating garbage collection pressure. IntStream operates on raw primitives, eliminating boxing overhead and enabling SIMD optimizations. Why others are wrong: It is not about readability. Stream<Integer> also works with numbers. It does not run on a separate thread.'),
    q('What happens when you call findFirst() on a stream of 10 million elements?', ['It processes all 10 million elements', 'It stops processing as soon as it finds the first matching element (short-circuiting)', 'It throws an exception', 'It returns a random element'], 1, 'findFirst() is a short-circuiting terminal operation. It terminates the pipeline immediately after finding the first element, potentially skipping millions of elements. Why others are wrong: It does not process all elements. It does not throw exceptions. It returns the first element in encounter order, not random.'),
    q('When should you AVOID using parallelStream()?', ['When processing 10 million elements', 'When processing fewer than 10,000 elements where ForkJoinPool overhead dominates the actual work', 'When using map operations', 'When collecting to a list'], 1, 'parallelStream() uses the common ForkJoinPool, which has thread coordination overhead. For small datasets, this overhead exceeds the parallelism benefit, making it SLOWER than sequential. Why others are wrong: Large datasets benefit from parallelism. map operations and collecting to lists work fine in parallel.'),
    q('What does Collectors.groupingBy(classifier, downstream) enable?', ['Sorting elements by the classifier', 'Multi-level grouping where each group is further processed by the downstream collector', 'Filtering elements based on the classifier', 'Converting elements to strings'], 1, 'groupingBy with a downstream collector enables nested aggregation: groupingBy(Department::getName, averagingDouble(Employee::getSalary)) produces Map<String, Double> with average salary per department. Why others are wrong: It does not sort (that is sorted()). It does not filter. It does not convert to strings.')
  ],
  [
    'flatMap flattens nested structures by transforming each element into a stream and merging them.',
    'Advanced collectors enable multi-level grouping, statistics computation, and string joining.',
    'Short-circuiting operations (findFirst, anyMatch) terminate pipelines early for performance.',
    'Infinite streams (generate, iterate) combined with limit() enable lazy sequence generation.',
    'Use primitive streams (IntStream, DoubleStream) to avoid autoboxing overhead in numeric pipelines.'
  ],
  'If you want to use a big terminal on your own computer instead of the built-in one, please read Lesson 1 for full JDK setup instructions.'
),

// ==========================================
// LESSON 32: VIRTUAL THREADS & MODERN CONCURRENCY (JAVA 21)
// ==========================================
L(
  'java-32', 32, 'Virtual Threads & Modern Concurrency (Java 21)', '🧵',
  '🧵 Java 21 revolutionized concurrency with Virtual Threads (Project Loom). For decades, Java developers were forced to choose between platform threads (expensive, limited) and reactive programming (complex, hard to debug). Virtual threads eliminate this trade-off: millions of lightweight threads that scale like async code but read like synchronous code. This is the biggest concurrency advancement in Java since the original Thread class.',
  [
    {
      title: '1. The Platform Thread Bottleneck',
      beginner: 'Traditional Java threads (platform threads) map 1:1 to operating system threads. Each one costs about 1MB of memory for its stack. If you need to handle 100,000 concurrent users, you would need 100,000 threads = 100GB of RAM! This is why servers struggle with high concurrency.',
      advanced: 'Platform threads wrap OS threads (pthread on Linux, Win32 threads on Windows). Each thread allocates a fixed stack (default 512KB-1MB via -Xss). Thread creation involves a system call, kernel data structure allocation, and scheduler registration. Context switching between OS threads requires kernel mode transitions (~1-10 microseconds). For I/O-bound applications, threads spend most time BLOCKED waiting for network/disk, wasting allocated stack memory. This is the C10K problem — difficulty handling 10,000 concurrent connections.'
    },
    {
      title: '2. Virtual Threads (Project Loom)',
      beginner: 'Virtual threads are lightweight threads managed by the JVM instead of the operating system. They cost only a few kilobytes of memory, and you can create MILLIONS of them! When a virtual thread blocks on I/O, the JVM automatically switches to another virtual thread, keeping the CPU busy.',
      advanced: 'Virtual threads (JEP 444, Java 21) are scheduled by the JVM onto a small pool of carrier threads (platform threads). When a virtual thread blocks (I/O, sleep, lock), it is UNMOUNTED from the carrier thread, freeing it for other virtual threads. When unblocked, it is REMOUNTED. Memory: virtual threads start with a small stack (few hundred bytes) that grows on demand. Creation: Thread.ofVirtual().start(runnable) or Executors.newVirtualThreadPerTaskExecutor(). This enables thread-per-request architectures at massive scale without reactive complexity.'
    },
    {
      title: '3. Structured Concurrency',
      beginner: 'Structured concurrency makes concurrent code as organized as sequential code. Instead of launching threads and hoping they finish, you group related tasks together and wait for ALL of them to complete. If one fails, you can cancel the others automatically!',
      advanced: 'Structured Concurrency (JEP 453, preview) treats groups of concurrent tasks as a single unit of work. StructuredTaskScope.ShutdownOnFailure: submit multiple tasks, join() waits for all, propagateException() rethrows the first failure. StructuredTaskScope.ShutdownOnSuccess: returns the first successful result, cancels remaining tasks. This eliminates orphaned threads, ensures proper cleanup, and makes concurrent code debuggable via thread dumps. It brings the discipline of structured programming (blocks with clear entry/exit) to concurrency.'
    },
    {
      title: '4. Scoped Values (Replacing ThreadLocal)',
      beginner: 'ThreadLocal variables let each thread have its own copy of data, but they are slow and memory-hungry when you have millions of threads. Scoped Values are the modern replacement: they share data efficiently across virtual threads without copying!',
      advanced: 'Scoped Values (JEP 446, preview) provide immutable, scoped data sharing between threads. Unlike ThreadLocal (mutable, per-thread copy, requires cleanup), ScopedValue is: (1) Immutable — cannot be changed after binding. (2) Inherited — automatically available to child threads/tasks. (3) Scoped — automatically cleaned up when the scope exits. (4) Efficient — shared across virtual threads without per-thread copies. Usage: ScopedValue.where(KEY, value).run(() -> { /* KEY is available here */ });. This is critical for request context propagation in virtual thread architectures.'
    },
    {
      title: '5. Reactive vs Virtual Threads (Expert Teaser)',
      beginner: 'Before virtual threads, Java developers used reactive programming (Project Reactor, RxJava) for high concurrency. Reactive code is powerful but hard to read and debug. Virtual threads give you the same scalability with simple, readable synchronous code!',
      advanced: '(Expert Teaser) Reactive programming (Project Reactor, RxJava) achieves high concurrency via non-blocking event loops and operator chains (map, filter, flatMap on Mono/Flux). Downsides: steep learning curve, difficult debugging (stack traces are fragmented), operator fusion complexity. Virtual threads achieve similar throughput with synchronous code: each request gets its own virtual thread, blocking I/O is cheap, stack traces are complete. Migration path: replace WebClient with blocking HttpClient, replace reactive repositories with blocking JPA. In the Expert track, we explore: when reactive is still preferable (streaming backpressure, event-driven systems), hybrid architectures, and how Spring Boot 3.2+ integrates virtual threads via spring.threads.virtual.enabled=true.'
    }
  ],
  {
    title: '🛠️ Mini-Project: Virtual Thread Web Crawler Simulator',
    intro: '⚠️ NOTE: Build a concurrent task runner using virtual threads (Java 21+) to simulate processing thousands of requests with minimal memory overhead.',
    steps: [
      'Create a file named VirtualThreadDemo.java with the standard public class and main method boilerplate.',
      'Check Java version: Ensure you are using Java 21+ (java -version). Virtual threads require Java 21.',
      'Create a virtual thread executor: try (var executor = java.util.concurrent.Executors.newVirtualThreadPerTaskExecutor()) { ... }.',
      'Submit 10,000 tasks: for (int i = 0; i < 10000; i++) { int taskId = i; executor.submit(() -> { System.out.println(Thread.currentThread() + " processing task " + taskId); }); }.',
      'Observe the thread names: you will see VirtualThread[#123]/runnable — these are NOT platform threads!',
      'Simulate I/O blocking: Inside the task, add Thread.sleep(100) to simulate network latency. Watch how virtual threads handle blocking efficiently.',
      'Compare with platform threads: Try Executors.newFixedThreadPool(10) with the same 10,000 tasks. Observe the difference in throughput.',
      'Print thread info: System.out.println("Is virtual: " + Thread.currentThread().isVirtual());.',
      'Compile and execute: javac VirtualThreadDemo.java && java VirtualThreadDemo.',
      'Congratulations! You created 10,000 concurrent threads with minimal memory overhead!'
    ],
    goal: 'You experienced the virtual thread revolution: millions of lightweight threads, efficient blocking, and simplified concurrent programming without reactive complexity.'
  },
  [
    q('What is the primary advantage of virtual threads over platform threads?', ['Virtual threads run faster on CPU calculations', 'Virtual threads are lightweight (few KB memory) and can scale to millions, while platform threads cost ~1MB each and are limited by OS resources', 'Virtual threads do not require the JVM', 'Virtual threads automatically encrypt data'], 1, 'Virtual threads are JVM-managed, start with small stacks, and unmount when blocked, enabling millions of concurrent threads. Platform threads wrap OS threads with fixed ~1MB stacks. Why others are wrong: They do not speed up CPU work. They require the JVM. They do not encrypt data.'),
    q('What happens when a virtual thread blocks on I/O (like reading from a socket)?', ['The entire JVM pauses', 'The virtual thread is unmounted from its carrier thread, freeing the carrier for other virtual threads', 'The program crashes', 'The virtual thread converts to a platform thread'], 1, 'When a virtual thread blocks, the JVM unmounts it from the carrier (platform) thread. The carrier is freed to execute other virtual threads. When unblocked, the virtual thread is remounted. Why others are wrong: The JVM does not pause. It does not crash. It does not convert to a platform thread.'),
    q('How do you create a virtual thread in Java 21?', ['new Thread(runnable)', 'Thread.ofVirtual().start(runnable)', 'VirtualThread.create(runnable)', 'Thread.virtual(runnable)'], 1, 'Thread.ofVirtual().start(runnable) creates and starts a virtual thread. Alternatively, Executors.newVirtualThreadPerTaskExecutor() creates an executor that spawns a virtual thread per task. Why others are wrong: new Thread() creates platform threads. VirtualThread.create() and Thread.virtual() do not exist.'),
    q('What is Structured Concurrency?', ['A way to organize code into packages', 'A programming model that treats groups of concurrent tasks as a single unit of work with clear lifecycle and error propagation', 'A database design pattern', 'A way to compress files'], 1, 'Structured Concurrency (JEP 453) groups concurrent tasks via StructuredTaskScope, ensuring all tasks complete or are cancelled together, errors propagate cleanly, and no orphaned threads remain. Why others are wrong: It is not about packages, databases, or file compression.'),
    q('When should you still consider reactive programming (Project Reactor) instead of virtual threads?', ['Always — virtual threads are never better', 'For streaming backpressure scenarios, event-driven systems, or when you need fine-grained control over asynchronous data flow', 'Never — reactive programming is obsolete', 'Only for mathematical calculations'], 1, 'Virtual threads excel for request-response I/O. Reactive is still preferable for: streaming backpressure (Kafka consumers), event-driven architectures, and scenarios requiring explicit control over asynchronous data flow. Why others are wrong: Virtual threads are not universally better. Reactive is not obsolete. It is not limited to math.')
  ],
  [
    'Virtual threads (Java 21) are lightweight JVM-managed threads that scale to millions with minimal memory.',
    'When virtual threads block on I/O, they unmount from carrier threads, freeing them for other work.',
    'Thread.ofVirtual().start() creates virtual threads; Executors.newVirtualThreadPerTaskExecutor() creates virtual thread executors.',
    'Structured Concurrency groups concurrent tasks with clear lifecycle and error propagation.',
    'Virtual threads eliminate the need for reactive programming in most I/O-bound applications.'
  ],
  'If you want to use a big terminal on your own computer instead of the built-in one, please read Lesson 1 for full JDK setup instructions.'
),

// ==========================================
// LESSON 33: JVM PERFORMANCE TUNING & PROFILING
// ==========================================
L(
  'java-33', 33, 'JVM Performance Tuning & Profiling', '📊',
  '📊 Writing code that works is the baseline. Writing code that performs under production load is the craft. JVM performance tuning is the discipline of measuring, analyzing, and optimizing application behavior across memory allocation, garbage collection pauses, JIT compilation, and CPU utilization. This lesson equips you with the profiling tools and tuning strategies used by performance engineers at scale.',
  [
    {
      title: '1. JVM Performance Metrics & Monitoring',
      beginner: 'Before you can optimize, you must measure! Key metrics include: heap memory usage, garbage collection frequency and pause times, thread count, CPU utilization, and method execution times. Java provides built-in tools like jconsole and jvisualvm to watch these metrics live.',
      advanced: 'JMX (Java Management Extensions) exposes runtime metrics via MBeans. Key metrics: HeapMemoryUsage (used/committed/max), GarbageCollectorMXBean (collection count/time), ThreadMXBean (thread count, deadlock detection), OperatingSystemMXBean (CPU load). Tools: jconsole (GUI), jvisualvm (advanced GUI), jcmd (CLI: jcmd <pid> GC.heap_info), JFR (Java Flight Recorder — low-overhead continuous profiling). Spring Boot Actuator exposes these as /actuator/metrics endpoints.'
    },
    {
      title: '2. Garbage Collection Tuning',
      beginner: 'The Garbage Collector pauses your application to clean up memory. These pauses can cause lag in user-facing apps. By tuning GC settings (like choosing the right collector and adjusting heap sizes), you can minimize these pauses and keep your app responsive.',
      advanced: 'GC tuning parameters: -Xms (initial heap), -Xmx (max heap), -XX:+UseG1GC (G1 collector), -XX:MaxGCPauseMillis=200 (G1 pause target), -XX:+UseZGC (sub-millisecond pauses). GC logs: -Xlog:gc* to analyze collection events. G1GC: region-based, good for large heaps with pause targets. ZGC: concurrent, <1ms pauses, ideal for low-latency. Shenandoah: concurrent compaction. Choose collector based on: heap size, latency requirements, throughput needs. Profile before tuning — premature optimization is the root of all evil.'
    },
    {
      title: '3. JIT Compilation & Escape Analysis',
      beginner: 'The JIT compiler watches your code run and optimizes the hot parts. It can even figure out when objects don\'t "escape" a method and allocate them on the stack instead of the heap, saving garbage collection work!',
      advanced: 'JIT optimizations: (1) Method inlining — replacing method calls with method bodies. (2) Escape analysis — if an object doesn\'t escape a method, allocate on stack (scalar replacement). (3) Loop unrolling — reducing branch overhead. (4) Intrinsics — replacing common methods (Math.sqrt, String.hashCode) with CPU instructions. JIT flags: -XX:+PrintCompilation to see what gets compiled. GraalVM Native Image performs AOT (Ahead-of-Time) compilation, eliminating JIT warmup but losing runtime optimizations.'
    },
    {
      title: '4. Profiling with JFR & async-profiler',
      beginner: 'Profilers are like X-ray machines for your code. They show you exactly which methods take the most time, where memory is allocated, and where threads are blocked. Java Flight Recorder (JFR) is built into the JVM and has almost zero overhead!',
      advanced: 'Java Flight Recorder (JFR): built-in, <2% overhead, continuous recording. Enable: -XX:StartFlightRecording=duration=60s,filename=recording.jfr. Analyze with JDK Mission Control (JMC). Events: method profiling, allocation, GC, thread locks, I/O. async-profiler: open-source, low-overhead CPU/allocation/lock profiler. Generates flame graphs showing time distribution across call stacks. Flame graphs visualize: wide bars = more time, vertical depth = call stack. Essential for identifying CPU hotspots and allocation storms.'
    },
    {
      title: '5. Benchmarking with JMH (Expert Teaser)',
      beginner: 'How do you know if your optimization actually worked? You need scientific benchmarking! JMH (Java Microbenchmark Harness) is the gold standard for measuring code performance accurately, avoiding common pitfalls like JIT warmup and dead code elimination.',
      advanced: '(Expert Teaser) JMH (Java Microbenchmark Harness) is the standard for Java microbenchmarking. It handles: JIT warmup iterations, measurement iterations, fork isolation (separate JVM per benchmark), dead code elimination prevention (Blackhole), and statistical analysis. Annotations: @Benchmark, @BenchmarkMode, @OutputTimeUnit, @Warmup, @Measurement, @Fork. Common pitfalls JMH avoids: measuring cold JIT code, dead code elimination removing your benchmark, loop optimizations skewing results. In the Expert track, we explore: performance regression testing in CI/CD, A/B testing optimizations with statistical significance, memory allocation profiling with JFR, and GraalVM Native Image performance characteristics vs JIT compilation.'
    }
  ],
  {
    title: '🛠️ Mini-Project: Performance Analyzer & GC Logger',
    intro: '⚠️ NOTE: Build a performance monitoring utility that measures execution time, tracks memory allocation, and demonstrates GC behavior.',
    steps: [
      'Create a file named PerformanceAnalyzer.java with the standard public class and main method boilerplate.',
      'Measure execution time: public static long measureTime(Runnable task) { long start = System.nanoTime(); task.run(); return System.nanoTime() - start; }.',
      'Track memory: Runtime runtime = Runtime.getRuntime(); long before = runtime.totalMemory() - runtime.freeMemory(); System.gc(); long after = runtime.totalMemory() - runtime.freeMemory(); System.out.println("Memory used: " + (after - before) + " bytes");.',
      'Create allocation pressure: List<byte[]> garbage = new ArrayList<>(); for (int i = 0; i < 1000; i++) { garbage.add(new byte[1024 * 1024]); } // 1MB each.',
      'Measure allocation time: long allocTime = measureTime(() -> { for (int i = 0; i < 10000; i++) { new byte[1024]; } }); System.out.println("Allocation time: " + allocTime + " ns");.',
      'Enable GC logging: Run with java -Xlog:gc* PerformanceAnalyzer to see GC events in the console.',
      'Use jcmd to inspect: In another terminal, run jps to find the process ID, then jcmd <pid> GC.heap_info.',
      'Compile and execute: javac PerformanceAnalyzer.java && java -Xlog:gc* PerformanceAnalyzer.',
      'Observe the GC log output showing Young/Old generation collections!'
    ],
    goal: 'You built a performance monitoring utility, measured execution time and memory allocation, and observed GC behavior via JVM logging.'
  },
  [
    q('What is the primary purpose of Java Flight Recorder (JFR)?', ['To record video of your screen', 'To continuously profile JVM performance (CPU, memory, GC, threads) with minimal overhead (<2%)', 'To play audio files', 'To encrypt application data'], 1, 'JFR is a built-in, low-overhead profiling tool that records JVM events: method execution, memory allocation, GC pauses, thread locks, I/O operations. Analyze recordings with JDK Mission Control. Why others are wrong: It does not record video/audio or encrypt data.'),
    q('What does the -Xmx JVM flag control?', ['The maximum number of threads', 'The maximum heap memory size the JVM can use', 'The maximum number of classes', 'The maximum file size'], 1, '-Xmx sets the maximum heap size (e.g., -Xmx4g = 4GB max heap). -Xms sets the initial heap size. Setting -Xms = -Xmx avoids heap resizing overhead. Why others are wrong: It does not control threads, classes, or file sizes.'),
    q('What is a flame graph in performance profiling?', ['A graph showing CPU temperature', 'A visualization showing time distribution across method call stacks, where width represents time spent and depth represents call depth', 'A graph of network traffic', 'A chart of database queries'], 1, 'Flame graphs visualize profiling data: each rectangle represents a method, width = time spent, vertical position = call stack depth. Wide bars at the top indicate CPU hotspots. Generated by async-profiler or JFR. Why others are wrong: It does not show temperature, network traffic, or database queries.'),
    q('Why is JMH (Java Microbenchmark Harness) preferred over System.currentTimeMillis() for benchmarking?', ['JMH is faster to write', 'JMH handles JIT warmup, dead code elimination, fork isolation, and statistical analysis automatically', 'JMH uses less memory', 'JMH only works on Windows'], 1, 'JMH provides scientific benchmarking: warmup iterations for JIT, Blackhole to prevent dead code elimination, fork isolation for reproducibility, and statistical analysis. System.currentTimeMillis() is affected by JIT warmup, OS scheduling, and dead code elimination. Why others are wrong: It is not about writing speed, memory, or OS restrictions.'),
    q('What is escape analysis in JIT optimization?', ['Analyzing code for security vulnerabilities', 'Determining if an object is only used within a method, allowing stack allocation instead of heap allocation', 'Checking if code escapes the compiler', 'Analyzing network packets'], 1, 'Escape analysis determines if an object "escapes" the method scope. If not, the JIT can allocate it on the stack (scalar replacement) or eliminate the allocation entirely, reducing GC pressure. Why others are wrong: It is not security analysis, compiler escape, or network analysis.')
  ],
  [
    'Measure before optimizing: use JFR, jcmd, and JMX to understand actual performance bottlenecks.',
    'Tune GC based on workload: G1GC for large heaps with pause targets, ZGC for sub-millisecond latency.',
    'JIT optimizations include inlining, escape analysis, loop unrolling, and intrinsics.',
    'Flame graphs from async-profiler visualize CPU time distribution across call stacks.',
    'Use JMH for scientific microbenchmarking with JIT warmup and dead code elimination prevention.'
  ],
  'If you want to use a big terminal on your own computer instead of the built-in one, please read Lesson 1 for full JDK setup instructions.'
),

// ==========================================
// LESSON 34: MICROSERVICES & DISTRIBUTED SYSTEMS
// ==========================================
L(
  'java-34', 34, 'Microservices & Distributed Systems', '🌐',
  '🌐 Monolithic applications are simple to build but difficult to scale. Microservices architecture decomposes systems into small, independent services that communicate over networks. This enables team autonomy, technology diversity, and independent deployment — but introduces distributed systems challenges: network failures, data consistency, and observability. Understanding these patterns is essential for modern cloud-native Java development.',
  [
    {
      title: '1. Monolith vs Microservices',
      beginner: 'A monolith is one big application containing everything. It is easy to develop and deploy initially, but as it grows, one bug can bring down the entire system, and you cannot scale just the busy parts. Microservices split the application into small, independent services that can be deployed and scaled separately.',
      advanced: 'Monolith: single deployment unit, shared database, in-process communication. Advantages: simple development, easy debugging, transactional consistency. Disadvantages: coupling, single technology stack, full redeployment for any change. Microservices: independent deployment units, separate databases, network communication (HTTP/gRPC/message queues). Advantages: team autonomy, technology diversity, independent scaling, fault isolation. Disadvantages: distributed complexity, network latency, eventual consistency, operational overhead.'
    },
    {
      title: '2. Service Communication Patterns',
      beginner: 'Microservices need to talk to each other! They can use synchronous communication (HTTP REST or gRPC — like a phone call) or asynchronous communication (message queues like Kafka — like sending a text message and waiting for a reply later).',
      advanced: 'Synchronous: REST (HTTP/JSON, simple, universal), gRPC (HTTP/2 + Protocol Buffers, fast, typed), GraphQL (flexible queries). Asynchronous: Message queues (RabbitMQ, ActiveMQ), Event streaming (Kafka, Pulsar). Patterns: Request-Reply, Fire-and-Forget, Publish-Subscribe, Event Sourcing. Synchronous is simpler but creates temporal coupling (both services must be up). Asynchronous decouples services but adds complexity (message ordering, delivery guarantees, idempotency).'
    },
    {
      title: '3. Service Discovery & API Gateway',
      beginner: 'When you have 50 microservices, how do they find each other? Service Discovery is like a phone book for services. The API Gateway is the front door — it receives all requests from outside and routes them to the correct internal service.',
      advanced: 'Service Discovery: Client-side (Eureka, Consul — services register themselves), Server-side (Kubernetes DNS — platform handles discovery). API Gateway (Spring Cloud Gateway, Kong, AWS API Gateway): routing, load balancing, authentication, rate limiting, request/response transformation. Service Mesh (Istio, Linkerd): infrastructure layer handling service-to-service communication, mTLS encryption, observability, traffic management — sidecar proxies per service.'
    },
    {
      title: '4. Distributed Data & Sagas',
      beginner: 'In microservices, each service has its own database. But what if a business operation spans multiple services? The Saga pattern coordinates a series of local transactions, with compensating actions to undo changes if a later step fails.',
      advanced: 'Distributed transactions: 2PC (Two-Phase Commit) is blocking and fragile. Saga pattern: sequence of local transactions, each with a compensating transaction. Choreography (events trigger next steps) vs Orchestration (central coordinator). Example: Order → Payment → Inventory → Shipping. If Payment fails, compensate Order (cancel). Eventual consistency: data becomes consistent over time, not instantly. CQRS (Command Query Responsibility Segregation): separate write model from read model for optimization.'
    },
    {
      title: '5. Cloud-Native & Kubernetes (Expert Teaser)',
      beginner: 'Modern microservices run on cloud platforms using container orchestration tools like Kubernetes. Kubernetes automatically deploys, scales, and heals your services. It is the operating system of the cloud!',
      advanced: '(Expert Teaser) Kubernetes primitives: Pod (container group), Deployment (replica management), Service (network load balancing), Ingress (external access), ConfigMap/Secret (configuration). Spring Boot integrates via: Spring Cloud Kubernetes (service discovery, config), Micrometer (metrics for Prometheus), Sleuth/Micrometer Tracing (distributed tracing). 12-Factor App principles guide cloud-native design: config in environment, backing services attached, stateless processes, port binding. In the Expert track, we explore: GitOps deployment (ArgoCD, Flux), canary releases and feature flags, chaos engineering (fault injection testing), multi-region active-active architectures, and cost optimization strategies for cloud-native Java applications.'
    }
  ],
  {
    title: '🛠️ Mini-Project: Simulated Microservices Communication',
    intro: '⚠️ NOTE: Build a simulated microservices architecture with service discovery, synchronous communication, and saga coordination.',
    steps: [
      'Create a file named MicroservicesDemo.java with the standard public class and main method boilerplate.',
      'Create a service registry: public class ServiceRegistry { private Map<String, String> services = new HashMap<>(); public void register(String name, String address) { services.put(name, address); } public String discover(String name) { return services.get(name); } }.',
      'Create OrderService: public class OrderService { public String createOrder(String productId) { return "Order created for " + productId; } }.',
      'Create PaymentService: public class PaymentService { public boolean processPayment(double amount) { return amount <= 1000; } }.',
      'Create InventoryService: public class InventoryService { public boolean reserveStock(String productId) { return true; } }.',
      'Create SagaOrchestrator: public class SagaOrchestrator { public void executeSaga(String productId, double amount) { System.out.println("Step 1: Create Order"); System.out.println("Step 2: Process Payment"); if (!paymentService.processPayment(amount)) { System.out.println("COMPENSATE: Cancel Order"); return; } System.out.println("Step 3: Reserve Inventory"); System.out.println("Saga COMPLETED"); } }.',
      'In main, register services and execute a successful saga: saga.executeSaga("Laptop", 500.0);.',
      'Execute a failing saga: saga.executeSaga("Laptop", 2000.0); Observe the compensation!',
      'Compile and execute: javac MicroservicesDemo.java && java MicroservicesDemo.'
    ],
    goal: 'You simulated microservices communication patterns: service discovery, synchronous calls, and saga coordination with compensating transactions.'
  },
  [
    q('What is the primary advantage of microservices over a monolithic architecture?', ['Microservices are always faster', 'Independent deployment, scaling, and team autonomy for each service', 'Microservices require less code', 'Microservices do not need databases'], 1, 'Microservices enable independent deployment (deploy one service without redeploying everything), independent scaling (scale only busy services), and team autonomy (each team owns their service). Why others are wrong: They are not always faster (network overhead). They do not require less code. They still need databases.'),
    q('What is the Saga pattern in distributed systems?', ['A storytelling framework', 'A sequence of local transactions where each step has a compensating transaction to undo changes if a later step fails', 'A database optimization technique', 'A UI design pattern'], 1, 'Saga coordinates distributed transactions without 2PC. Each service performs a local transaction and publishes an event. If a step fails, compensating transactions undo previous steps. Why others are wrong: It is not storytelling, database optimization, or UI design.'),
    q('What is the purpose of an API Gateway in microservices architecture?', ['To store all the data', 'To act as the single entry point, routing external requests to internal services, handling authentication, and load balancing', 'To replace all microservices', 'To encrypt the source code'], 1, 'API Gateway is the front door: routing, authentication, rate limiting, load balancing, request/response transformation. It shields internal services from external complexity. Why others are wrong: It does not store data, replace services, or encrypt source code.'),
    q('What is the difference between synchronous and asynchronous communication in microservices?', ['Synchronous is faster', 'Synchronous (REST/gRPC) waits for immediate response; asynchronous (message queues) sends messages without waiting, decoupling services', 'Asynchronous is always better', 'They are identical'], 1, 'Synchronous: caller waits for response (temporal coupling). Asynchronous: caller sends message and continues (decoupled, but adds complexity). Choose based on consistency requirements and fault tolerance needs. Why others are wrong: Neither is universally faster or better. They are fundamentally different.'),
    q('What is eventual consistency in distributed systems?', ['Data is eventually deleted', 'Data becomes consistent across all services over time, not instantly, allowing temporary discrepancies for better availability', 'The system eventually shuts down', 'Data is compressed eventually'], 1, 'Eventual consistency accepts temporary inconsistency for availability and partition tolerance (CAP theorem). Data converges to consistency over time via event propagation. Why others are wrong: It does not delete data, shut down systems, or compress data.')
  ],
  [
    'Microservices enable independent deployment, scaling, and team autonomy at the cost of distributed complexity.',
    'Synchronous communication (REST/gRPC) is simple but creates temporal coupling; asynchronous (Kafka) decouples services.',
    'API Gateway is the front door for external requests; Service Discovery is the phone book for internal services.',
    'Saga pattern coordinates distributed transactions with compensating actions instead of blocking 2PC.',
    'Kubernetes orchestrates container deployment, scaling, and healing for cloud-native microservices.'
  ],
  'If you want to use a big terminal on your own computer instead of the built-in one, please read Lesson 1 for full JDK setup instructions.'
),

// ==========================================
// LESSON 35: JAVA EXPERT TRACK PREVIEW (PAID TEASER)
// ==========================================
L(
  'java-35', 35, 'Java Expert Track Preview', '💎',
  '💎 You have completed the free Java track — congratulations! You now possess a solid foundation in core Java, OOP, collections, concurrency, streams, testing, and web APIs. But this is only the beginning. The Java Expert Track (paid) takes you from competent developer to elite engineer: JVM internals, bytecode manipulation, advanced concurrency, performance engineering, distributed systems, and the architectural patterns used by FAANG companies. This lesson previews what awaits you.',
  [
    {
      title: '1. JVM Deep Dive: Bytecode & ClassLoaders',
      beginner: 'In the Expert Track, you will learn to read and write bytecode — the actual instructions the JVM executes. You will build custom ClassLoaders that load classes from databases, encrypt class files, and hot-deploy code without restarting the application.',
      advanced: 'Expert curriculum: (1) Bytecode analysis with javap -c -v: stack frames, local variable tables, constant pools. (2) Bytecode generation with ASM/ByteBuddy: creating classes at runtime for AOP proxies, mocking frameworks, and agent instrumentation. (3) Custom ClassLoaders: isolation, hot-deployment, plugin systems. (4) Java Agents: attaching to running JVMs to modify bytecode via java.lang.instrument. (5) GraalVM Native Image: AOT compilation eliminating classloaders and JIT warmup.'
    },
    {
      title: '2. Advanced Concurrency: Lock-Free & Reactive',
      beginner: 'You will master lock-free data structures that use atomic CPU instructions instead of locks, build reactive streams that handle backpressure, and understand the Java Memory Model at the hardware level.',
      advanced: 'Expert curriculum: (1) Lock-free structures: CAS (Compare-And-Swap), Atomic classes, ConcurrentLinkedQueue, LongAdder. (2) Java Memory Model: happens-before, visibility, ordering, volatile semantics at CPU level. (3) Reactive Streams: Flow API, Project Reactor, backpressure protocols. (4) Disruptor pattern: lock-free ring buffers for ultra-low-latency systems. (5) ForkJoinPool internals: work-stealing, recursive decomposition.'
    },
    {
      title: '3. Performance Engineering & Profiling',
      beginner: 'You will learn to profile applications with JFR and async-profiler, tune garbage collectors for sub-millisecond pauses, and optimize hot paths using JMH benchmarks. You will make applications 10-100x faster.',
      advanced: 'Expert curriculum: (1) JFR/JMC deep dive: allocation profiling, lock contention analysis, GC tuning. (2) Flame graph interpretation and optimization. (3) GC tuning: G1 region sizing, ZGC load barriers, Shenandoah concurrent compaction. (4) JMH benchmarking: avoiding pitfalls, statistical analysis. (5) Mechanical sympathy: CPU cache hierarchy, branch prediction, SIMD vectorization via Vector API.'
    },
    {
      title: '4. Distributed Systems & Cloud-Native',
      beginner: 'You will build microservices with Spring Cloud, deploy to Kubernetes, implement distributed tracing, and design systems that survive failures across multiple data centers.',
      advanced: 'Expert curriculum: (1) Spring Cloud: Config Server, Service Discovery, Circuit Breakers, API Gateway. (2) Kubernetes: deployments, services, ingress, Helm charts. (3) Distributed tracing: Micrometer, Zipkin, Jaeger. (4) Event-driven architecture: Kafka, Event Sourcing, CQRS. (5) Multi-region: active-active, data replication, consistency models.'
    },
    {
      title: '5. Enterprise Architecture & Career Growth',
      beginner: 'The Expert Track concludes with enterprise architecture patterns used by FAANG companies: Domain-Driven Design, Hexagonal Architecture, and the system design skills needed for senior/staff engineer interviews.',
      advanced: 'Expert curriculum: (1) Domain-Driven Design: aggregates, bounded contexts, ubiquitous language. (2) Hexagonal Architecture: ports and adapters, dependency inversion. (3) System Design: load balancers, caching strategies, database sharding, CAP theorem. (4) Interview Preparation: coding challenges, system design whiteboarding, behavioral questions. (5) Career Path: Junior → Mid → Senior → Staff → Principal engineer progression, open-source contribution, technical writing.'
    }
  ],
  {
    title: '🛠️ Expert Track Preview: Bytecode Inspection',
    intro: '⚠️ NOTE: Get a taste of the Expert Track by inspecting the actual bytecode of a simple Java program using javap.',
    steps: [
      'Create a file named BytecodePreview.java with the standard public class and main method boilerplate.',
      'Add a simple method: public static int add(int a, int b) { return a + b; }.',
      'Compile: javac BytecodePreview.java.',
      'Inspect bytecode: javap -c BytecodePreview. Observe the iload, iadd, ireturn instructions.',
      'Inspect verbose: javap -c -v BytecodePreview. Observe the constant pool, stack size, and local variable table.',
      'Identify the main method bytecode: getstatic (System.out), ldc ("Hello"), invokevirtual (println), return.',
      'This is what the JVM actually executes! The Expert Track teaches you to read, write, and manipulate this bytecode.',
      'Upgrade to the Expert Track to master: bytecode generation, custom ClassLoaders, JVM agents, and performance engineering!'
    ],
    goal: 'You previewed the Expert Track by inspecting JVM bytecode and understanding the compilation pipeline at the instruction level.'
  },
  [
    q('What is bytecode in the context of the JVM?', ['Encrypted source code', 'The intermediate instruction set that the JVM executes, produced by compiling .java files', 'A type of database query', 'A network protocol'], 1, 'Bytecode is the platform-independent instruction set (.class files) that the JVM executes. It is produced by javac from .java source files. The Expert Track teaches you to read and manipulate bytecode. Why others are wrong: It is not encrypted source, database queries, or network protocols.'),
    q('What tool do you use to inspect Java bytecode?', ['javac', 'javap', 'java', 'jar'], 1, 'javap disassembles .class files into readable bytecode. javap -c shows opcodes. javap -c -v shows verbose output with constant pool and local variable tables. Why others are wrong: javac compiles. java executes. jar packages.'),
    q('What is a Java Agent?', ['A secret program that steals data', 'A program that attaches to a running JVM to modify bytecode and monitor behavior', 'A type of virus', 'A database administrator'], 1, 'Java Agents (java.lang.instrument) attach to running JVMs to modify bytecode, add monitoring, or transform classes. Used by APM tools (New Relic, Datadog), AOP frameworks, and mocking libraries. Why others are wrong: It is not malware, a virus, or a DBA.'),
    q('What is GraalVM Native Image?', ['A photo editing tool', 'A technology that compiles Java code ahead-of-time (AOT) into standalone native executables with instant startup', 'A game engine', 'A web browser'], 1, 'GraalVM Native Image performs AOT compilation, producing native executables with instant startup and low memory. Used for serverless and CLI tools. Trade-off: no runtime optimizations, closed-world assumption. Why others are wrong: It is not photo editing, gaming, or browsing.'),
    q('What is the primary benefit of upgrading to the Java Expert Track?', ['You get a certificate', 'You master JVM internals, advanced concurrency, performance engineering, and enterprise architecture patterns used by FAANG companies', 'You get free hosting', 'You can skip learning Python'], 1, 'The Expert Track takes you from competent developer to elite engineer: bytecode manipulation, lock-free concurrency, GC tuning, distributed systems, and FAANG-level system design. Why others are wrong: Certificates are secondary. No free hosting. Python is a separate skill.')
  ],
  [
    'The Expert Track covers bytecode manipulation, custom ClassLoaders, and JVM agent instrumentation.',
    'Advanced concurrency includes lock-free data structures, Java Memory Model, and reactive streams.',
    'Performance engineering covers JFR profiling, GC tuning, and JMH benchmarking.',
    'Distributed systems covers Spring Cloud, Kubernetes, and event-driven architecture.',
    'Upgrade to the Java Expert Track to become an elite engineer with FAANG-level skills!'
  ],
  'If you want to use a big terminal on your own computer instead of the built-in one, please read Lesson 1 for full JDK setup instructions.'
),

// ==========================================
// PART 8: FINAL ASSESSMENT
// ==========================================
L(
  'java-test-2', 35.5, 'Final Assessment: Full-Stack Java Mastery', '🎓',
  '🎓 Welcome to the Final Assessment. You have traversed the entire Java curriculum, from JVM architecture and memory models to asynchronous microservices and secure deployment pipelines. This capstone evaluates your ability to synthesize these concepts into cohesive, production-grade systems. True mastery is not just knowing the syntax; it is understanding the trade-offs, the memory implications, and the security boundaries of every line of code you write.',
  [
    {
      title: '1. Advanced OOP & Memory Model',
      beginner: 'You should deeply understand the difference between stack and heap memory, how objects are allocated and garbage collected, and how to design immutable, thread-safe classes.',
      advanced: 'Your architectural knowledge must include: JVM memory regions (Heap, Stack, Metaspace), GC algorithms (G1, ZGC), object header layout, compressed oops, escape analysis, and the Java Memory Model (happens-before, visibility, atomicity).'
    },
    {
      title: '2. Concurrency & Asynchronous Programming',
      beginner: 'You should know how to write thread-safe code using synchronized locks, atomic variables, and concurrent collections. You should understand the difference between threads, executors, and virtual threads.',
      advanced: 'You must fully comprehend: thread lifecycle, deadlock prevention, ExecutorService thread pools, CompletableFuture chaining, ForkJoinPool work-stealing, virtual threads (Java 21), and structured concurrency patterns.'
    },
    {
      title: '3. Streams, Generics & Functional Programming',
      beginner: 'You should be fully capable of processing collections using Stream pipelines, writing generic classes and methods with type safety, and composing functions using lambda expressions.',
      advanced: 'You should master: lazy evaluation, short-circuiting, parallel streams, type erasure, PECS wildcards, functional interfaces (Predicate, Function, Consumer, Supplier), and method references.'
    },
    {
      title: '4. Testing, Security & Deployment',
      beginner: 'You should never guess if your code works; you should prove it systematically using JUnit and Mockito. You must also know how to prevent SQL injection, manage transactions, and deploy containerized applications.',
      advanced: 'You must be fully capable of: TDD workflows, mocking external dependencies, PreparedStatement security, ACID transactions, connection pooling, Docker containerization, CI/CD pipelines, and cloud deployment patterns.'
    }
  ],
  {
    title: 'The Master Enterprise Capstone',
    intro: 'Your final challenge is to engineer a fully validated, systematically tested, and secure backend microservice from scratch, combining every advanced architectural concept you have learned into one seamless application.',
    steps: [
      'Initialize a new Maven project with dependencies: Spring Boot, Spring Data JPA, H2 Database, JUnit 5, Mockito.',
      'Implement a Spring Boot REST application with @RestController, @Service, and @Repository layers.',
      'Engineer a JPA entity with @Entity, @Id, @Column annotations and a Spring Data JPA repository interface.',
      'Build strict validation using @Valid and Bean Validation annotations on @RequestBody payloads.',
      'Write a suite of deterministic unit tests using JUnit 5 and Mockito, employing @Mock and @InjectMocks for dependency isolation.',
      'Implement transaction management with @Transactional on service methods.',
      'Create a Dockerfile: FROM eclipse-temurin:21-jre, COPY target/app.jar /app.jar, ENTRYPOINT ["java", "-jar", "/app.jar"].',
      'Build the Docker image: docker build -t my-app .',
      'Run the container: docker run -p 8080:8080 my-app.',
      'Verify the application responds: curl http://localhost:8080/api/health.'
    ],
    goal: 'You successfully architected, tested, and containerized an enterprise-grade Java microservice, proving your complete mastery of the professional Java programming ecosystem.'
  },
  [
    q('When engineering high-throughput I/O bound web services, what is the primary architectural advantage of using virtual threads (Java 21) over traditional platform threads?', ['Virtual threads bypass the CPU entirely and use the GPU', 'Virtual threads operate within a single carrier thread pool, unmounting when blocked, utilizing vastly less memory than spawning OS-level threads', 'Virtual threads automatically translate Java code into native C code', 'Virtual threads strictly prevent network users from making too many requests'], 1, 'Virtual threads are JVM-managed, start with small stacks, and unmount when blocked, enabling millions of concurrent threads without OS thread overhead. Why others are wrong: They do not use GPUs, compile to C, or rate-limit requests.'),
    q('What structural limitation does the Java Memory Model (JMM) enforce when writing concurrent software?', ['It prevents the computer from connecting to multiple databases', 'It defines happens-before relationships that determine visibility of writes across threads, requiring synchronization for guaranteed visibility', 'It locks the application configuration files', 'It immediately crashes if more than 10 threads are opened'], 1, 'The JMM defines when writes by one thread become visible to another. Without synchronization (synchronized, volatile, locks), visibility is not guaranteed due to CPU caching and instruction reordering. Why others are wrong: It does not block connections, lock files, or crash at 10 threads.'),
    q('How does PreparedStatement inherently defend against SQL Injection attacks?', ['By encrypting the entire database file', 'By strictly utilizing parameterized query bindings that isolate untrusted user inputs from the core SQL execution string', 'By globally limiting the length of all user inputs', 'By using a Metaclass hook to delete dangerous variables'], 1, 'PreparedStatement separates SQL code from data via ? placeholders. User input is bound as data, never interpreted as executable SQL. Why others are wrong: It does not encrypt files, limit lengths, or use metaclasses.'),
    q('What is the direct operational benefit of using Stream.flatMap() to parse nested collections?', ['flatMap compresses the target file automatically', 'flatMap transforms each element into a stream and flattens all streams into a single output stream, enabling processing of nested structures', 'flatMap executes parsing loops up to 10 times faster', 'flatMap natively converts text strings into secure binary tokens'], 1, 'flatMap applies a one-to-many transformation: each input element maps to a Stream, and all streams are merged into one. This enables processing List<List<T>> as a single Stream<T>. Why others are wrong: It does not compress files, speed up loops, or convert to binary.'),
    q('In professional software testing architectures utilizing Mockito, what is the exact operational purpose of implementing a Mock object?', ['To generate large arrays of random data for load testing', 'To replace complex, slow, or unpredictable external dependencies with a controlled, predictable fake object that tracks interactions', 'To force a test suite to fail automatically', 'To precisely measure the raw execution time of a functional block'], 1, 'Mocking isolates the unit under test from external systems (databases, APIs). Mocks return programmed responses and record invocations for verification. Why others are wrong: They are not for load testing, forced failures, or timing measurements.')
  ],
  [
    'You can confidently engineer and deploy complex Object-Oriented architectures.',
    'You know how to secure, systematically test, and optimize code for production environments.',
    'You have mastered both synchronous blocking and asynchronous non-blocking execution models.',
    'Congratulations! You are officially a Full-Stack Java Engineer!'
  ],
  'If you want to use a big terminal on your own computer instead of the built-in one, please read Lesson 1 for full JDK setup instructions.'
 )
];

export const getJavaLessonById = (id: string): JavaLesson | undefined =>
  JAVA_LESSONS.find(l => l.id === id);

export const isJavaLessonUnlocked = (id: string, completedLessons: string[]): boolean => {
  const idx = JAVA_LESSONS.findIndex(l => l.id === id);
  if (idx <= 0) return true;
  return completedLessons.includes(JAVA_LESSONS[idx - 1].id);
};
