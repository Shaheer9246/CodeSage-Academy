// src/data/cExpertLessons.ts
// C Expert Track — Advanced to Expert (Paid)
// Part 1: cx-01 to cx-08

import type {
  NetworkingLesson,
  Concept,
  QuizQuestion,
} from './networkingLessons';

export type CExpertLesson = NetworkingLesson & {
  tier: 'paid';
};

const L = (
  id: string,
  order: number,
  title: string,
  icon: string,
  philosophy: string,
  concepts: Concept[],
  practical: CExpertLesson['practical'],
  quiz: QuizQuestion[],
  keyTakeaways: string[],
  terminalNotice?: string
): CExpertLesson => ({
  id,
  module: 'Module 2: C Programming — Advanced to Expert (Paid)',
  order,
  title,
  icon,
  philosophy,
  concepts,
  practical,
  quiz,
  keyTakeaways,
  terminalNotice,
  tier: 'paid',
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

export const C_EXPERT_TRACK_NOTICE = {
  type: 'track-notice',
  notice:
    '🔥 C Expert Track Status: This paid track is designed for serious systems engineers. These lessons require a real local C toolchain, including GCC or Clang, debugger support, sanitizers, and operating-system-level inspection tools. The browser C lab is useful for tiny demonstrations, but expert C mastery cannot be learned without local compilation, memory analysis, and system debugging.',
};

export const C_EXPERT_LESSONS: CExpertLesson[] = [
  L(
    'cx-01',
    1,
    'Advanced Pointer Arithmetic & Pointer Type System',
    '🧭',
    '🧭 Pointers are not just addresses. They are typed addresses governed by object lifetime, array bounds, aliasing rules, and provenance. At expert level, you stop thinking of pointers as magical arrows and start thinking of them as controlled memory access contracts. Mastering pointer arithmetic and pointer typing is the gateway to systems programming, memory allocators, embedded firmware, and high-performance C engineering.',
    [
      {
        title: '1. Pointer Provenance and Object Bounds',
        beginner:
          'A pointer should always be connected to a valid object. If you create an array, a pointer derived from that array is allowed to move inside that array. Moving it outside the object and dereferencing it is dangerous.',
        advanced:
          'The C abstract machine treats pointer validity as more than a numeric address. A pointer has provenance: it originates from a specific object or allocation. Even if two objects happen to be adjacent in memory, a pointer derived from one object is not automatically valid for accessing the other. Expert C engineers respect object boundaries because compilers optimize based on these assumptions.',
      },
      {
        title: '2. Pointer Arithmetic Scaling',
        beginner:
          'When you add 1 to an int pointer, the address does not move by one byte. It moves by the size of one int. This is why pointer arithmetic naturally matches array indexing.',
        advanced:
          'Pointer arithmetic is scaled by the size of the pointed-to type. For an int pointer, p + 1 advances by sizeof(int). For a struct pointer, p + 1 advances by the full struct size. This scaling is why pointer arithmetic is only defined for complete object types and why void pointers cannot be directly incremented in standard C.',
      },
      {
        title: '3. One-Past-The-End Pointers',
        beginner:
          'C allows a pointer to point just after the last element of an array. This is useful for loop boundaries. However, you are not allowed to dereference that pointer.',
        advanced:
          'A one-past-the-end pointer is a valid sentinel for range algorithms. It participates in pointer comparison and subtraction, but dereferencing it is undefined behavior. This pattern is central to buffer processing, iterator-style APIs, and allocator boundary checks.',
      },
      {
        title: '4. void Pointers and Generic Memory',
        beginner:
          'A void pointer points to memory without describing the type of the data. You can pass it around, but you must cast it back to a real pointer type before using the data.',
        advanced:
          'void* is the universal memory address type used by malloc, memcpy, qsort, and generic APIs. It carries no element size, so arithmetic is not directly possible. Expert code casts void pointers carefully and respects alignment requirements when converting them back to typed pointers.',
      },
      {
        title: '5. Pointer Casting and Aliasing Discipline',
        beginner:
          'You can cast one pointer type to another, but casting does not change the actual memory. It only changes how the compiler interprets that memory.',
        advanced:
          'Improper pointer casting can violate strict aliasing rules, alignment constraints, and object lifetime expectations. Expert C engineers use casts only when the target type is compatible, when dealing with raw byte buffers using unsigned char or unsigned char pointers, or when implementing well-defined serialization and allocator boundaries.',
      },
    ],
    {
      title: 'Pointer Bounds & Arithmetic Lab',
      intro:
        'This practical uses local GCC or Clang to inspect pointer arithmetic, one-past-the-end boundaries, pointer differences, and void pointer casting.',
      steps: [
        'Create a file named adv_pointers.c.',
        'Add #include <stdio.h> and #include <stddef.h> at the top.',
        'Inside main, declare: int nums[5] = {10, 20, 30, 40, 50};',
        'Create pointers: int *p = nums; int *end = nums + 5;',
        'Print pointer addresses using printf("%p\\n", (void *)p); and printf("%p\\n", (void *)(p + 1));',
        'Observe that p + 1 moves by sizeof(int), not by one byte.',
        'Print *(p + 2) and p[2] to prove indexing equivalence.',
        'Use while (p < end) to traverse the array safely.',
        'Calculate pointer distance: ptrdiff_t distance = end - nums;',
        'Print the distance using printf("%td\\n", distance);',
        'Create a void pointer: void *vp = nums;',
        'Cast it back before dereferencing: printf("%d\\n", *(int *)vp);',
        'Compile with: gcc adv_pointers.c -Wall -Wextra -o adv_pointers',
        'Run the program and inspect every printed address and value.',
      ],
      goal: 'You successfully used typed pointer arithmetic, safe boundary traversal, pointer subtraction, and void pointer casting with correct alignment and type discipline.',
    },
    [
      q(
        'What does adding 1 to an int pointer normally do?',
        [
          'It advances the address by one byte',
          'It advances the address by the size of int',
          'It resets the pointer to NULL',
          'It converts the pointer to void',
        ],
        1,
        'Pointer arithmetic is scaled by the pointed-to type. For an int pointer, adding 1 advances by sizeof(int), not by one raw byte.'
      ),
      q(
        'What is a one-past-the-end pointer used for?',
        [
          'It is used to dereference hidden memory',
          'It is used as a boundary marker for ranges and loops',
          'It automatically frees memory',
          'It encrypts array data',
        ],
        1,
        'A one-past-the-end pointer is valid for comparison and range termination, but it must not be dereferenced.'
      ),
      q(
        'Why can void pointers not be directly incremented in standard C?',
        [
          'Because void has no size information for arithmetic scaling',
          'Because void pointers are always NULL',
          'Because void pointers are read-only',
          'Because void pointers only work with strings',
        ],
        0,
        'Pointer arithmetic requires knowing the size of the pointed-to type. void is incomplete for that purpose, so void pointers must be cast to a complete object pointer type before arithmetic.'
      ),
      q(
        'What does pointer provenance mean at an expert level?',
        [
          'A pointer is valid only because it has a large numeric value',
          'A pointer carries an origin relationship to a particular object or allocation',
          'A pointer can access any address if the address is aligned',
          'A pointer becomes global after one use',
        ],
        1,
        'Provenance describes where a pointer came from. A pointer derived from one object is not automatically valid for accessing another object, even if the numeric address appears reachable.'
      ),
      q(
        'What is the danger of casting pointers carelessly?',
        [
          'It can violate aliasing rules, alignment rules, or object lifetime expectations',
          'It changes the physical RAM size',
          'It converts the program into C++',
          'It deletes the original array',
        ],
        0,
        'Pointer casts change interpretation, not reality. Invalid casts can produce undefined behavior through misalignment, strict aliasing violations, or accessing objects outside their lifetime.'
      ),
    ],
    [
      'Pointer arithmetic is scaled by the pointed-to type.',
      'One-past-the-end pointers are valid for comparison but not dereferencing.',
      'void pointers are generic addresses and must be cast carefully.',
      'Pointer provenance matters: valid addresses are tied to valid objects.',
      'Expert pointer code respects bounds, alignment, aliasing, and lifetime.',
    ],
    'This expert practical requires local GCC or Clang. The browser C lab is not enough for pointer inspection and sanitizer-level debugging.'
  ),

  L(
    'cx-02',
    2,
    'const, volatile, restrict & Type Qualifiers',
    '🛡️',
    '🛡️ Type qualifiers are not decorative keywords. They are contracts between you, the compiler, and the hardware. const expresses immutability intent, volatile defeats dangerous optimization of volatile hardware or signal state, and restrict promises non-overlapping pointer regions. Mastering these qualifiers is essential for safe APIs, embedded systems, and optimized C code.',
    [
      {
        title: '1. const Correctness',
        beginner:
          'The const keyword says that a value should not be modified through a particular name. For example, const int limit = 10; means you should not change limit through that identifier.',
        advanced:
          'const creates a compile-time contract for the compiler and the programmer. It affects pointer-to-const, const pointer, and const pointer-to-const semantics. In APIs, const communicates read-only intent, enables safer composition, and helps static analysis tools detect accidental mutation.',
      },
      {
        title: '2. Pointer Const Variants',
        beginner:
          'There is a difference between a pointer to const data and a const pointer. The first means the data should not change through the pointer. The second means the pointer itself should not be reassigned.',
        advanced:
          'The declaration const int *p means the pointed-to int is const through p. The declaration int *const p means the pointer p is const. The declaration const int *const p means both are const. Expert engineers read declarations from the identifier outward to understand which part is immutable.',
      },
      {
        title: '3. volatile and Hardware Reality',
        beginner:
          'volatile tells the compiler that a variable can change outside the visible code flow. This is common for hardware registers, interrupt flags, and signal handlers.',
        advanced:
          'volatile prevents the compiler from removing or reordering accesses that appear redundant in ordinary code. It does not make operations atomic and does not establish memory ordering for threads. It is a hardware and compiler visibility tool, not a concurrency primitive.',
      },
      {
        title: '4. restrict and Pointer Alias Contracts',
        beginner:
          'The restrict keyword is a promise from the programmer. It says that a pointer is the only way to access that memory region for the lifetime of the pointer.',
        advanced:
          'restrict enables aggressive compiler optimizations because the compiler can assume source and destination buffers do not overlap. If the promise is broken, behavior is undefined. It is heavily used in performance-sensitive memory routines and image processing loops.',
      },
      {
        title: '5. Qualifiers in API Design',
        beginner:
          'Good C APIs use const to show what data is read-only and what data may be modified. This makes functions easier to understand and safer to call.',
        advanced:
          'Expert API design treats qualifiers as semantic documentation enforced by the type system. const correctness reduces mutation surface area, restrict clarifies buffer ownership, and volatile marks external state. Together they form a low-level interface contract.',
      },
    ],
    {
      title: 'Qualifier Contract Lab',
      intro:
        'This practical explores const pointer variants, restrict-based optimization, and volatile awareness using a local compiler.',
      steps: [
        'Create a file named qualifiers.c.',
        'Add #include <stdio.h> and #include <stddef.h> at the top.',
        'Inside main, declare: int value = 100;',
        'Create: const int *ptr_to_const = &value;',
        'Observe that *ptr_to_const = 200; is rejected by the compiler.',
        'Create: int *const const_ptr = &value;',
        'Observe that *const_ptr = 300; is allowed, but reassigning const_ptr is not.',
        'Write a function: void scale(const int *src, int *dst, size_t n).',
        'Inside the function, multiply each src value and store it into dst.',
        'Write another function using restrict: void add_arrays(int *restrict dst, const int *restrict a, const int *restrict b, size_t n).',
        'Compile with warnings: gcc qualifiers.c -Wall -Wextra -o qualifiers',
        'Compile with optimization: gcc qualifiers.c -O2 -Wall -Wextra -o qualifiers_opt',
        'Run both versions and compare behavior.',
      ],
      goal: 'You successfully used const pointer variants, understood compiler enforcement, and applied restrict to express non-overlapping buffer contracts.',
    },
    [
      q(
        'What does const int *p mean?',
        [
          'p is a const pointer',
          'p points to an int that should not be modified through p',
          'p is always NULL',
          'p is a function pointer',
        ],
        1,
        'The const applies to the pointed-to int. The pointer p itself can be reassigned, but the int should not be modified through p.'
      ),
      q(
        'What does int *const p mean?',
        [
          'The pointer p cannot be reassigned',
          'The pointed-to int cannot be modified',
          'Both pointer and data are const',
          'The pointer is volatile',
        ],
        0,
        'Here const applies to the pointer itself. The pointer cannot be changed to point elsewhere, but the pointed-to data may still be modified.'
      ),
      q(
        'What does volatile prevent the compiler from doing?',
        [
          'It prevents all optimization forever',
          'It prevents removing or reordering accesses to volatile objects in ways that would break external visibility',
          'It makes variables private',
          'It converts int to float',
        ],
        1,
        'volatile tells the compiler that the object may change outside the current execution path, so accesses must be preserved and not optimized away.'
      ),
      q(
        'What promise does restrict make?',
        [
          'The pointer is always aligned',
          'The pointer is the only valid way to access that memory region during its scope',
          'The pointer is read-only',
          'The pointer cannot be NULL',
        ],
        1,
        'restrict tells the compiler that no other pointer will be used to access the same object, enabling optimizations based on non-aliasing.'
      ),
      q(
        'Does volatile make a variable thread-safe?',
        [
          'Yes, always',
          'No, volatile does not provide atomicity or proper thread memory ordering',
          'Only on Windows',
          'Only for pointers',
        ],
        1,
        'volatile is about visibility to the compiler, not atomic operations or memory fences. Thread safety requires atomics, locks, or other synchronization mechanisms.'
      ),
    ],
    [
      'Use const to express read-only intent.',
      'Distinguish pointer-to-const from const pointer.',
      'Use volatile for externally changing state, not thread safety.',
      'Use restrict to promise non-overlapping pointer access.',
      'Treat qualifiers as contracts that guide optimization and safety.',
    ],
    'This lesson requires local GCC or Clang because qualifier enforcement and optimization behavior are best observed with real compiler diagnostics.'
  ),

  L(
    'cx-03',
    3,
    'Memory Alignment, Padding & Struct Binary Layout',
    '📐',
    '📐 C structs are not just lists of fields. They are physical memory layouts shaped by alignment rules, padding, architecture constraints, and ABI requirements. Expert C engineers understand struct layout because it affects performance, binary file formats, network protocols, embedded registers, and interoperability with other languages.',
    [
      {
        title: '1. Alignment Requirements',
        beginner:
          'Many CPUs prefer certain data types to start at addresses that are multiples of their size. For example, a 4-byte int often works best at an address divisible by 4. This is alignment.',
        advanced:
          'Alignment affects load and store efficiency and can be mandatory on some architectures. Each type has an alignment requirement, accessible through alignof in modern C. Misaligned access may cause crashes, traps, or slower performance depending on the target platform.',
      },
      {
        title: '2. Struct Padding',
        beginner:
          'The compiler may insert invisible empty bytes between struct fields so each field starts at a properly aligned address. These invisible bytes are called padding.',
        advanced:
          'Padding is determined by field order, type alignment, and ABI rules. Two structs with the same fields in different orders can have different sizes. Expert engineers reorder fields to reduce padding and improve cache behavior when memory layout matters.',
      },
      {
        title: '3. offsetof and Layout Inspection',
        beginner:
          'You can inspect where a field lives inside a struct using offsetof from stddef.h. It tells you how many bytes exist before a particular member.',
        advanced:
          'offsetof is essential for serialization, intrusive containers, and low-level data modeling. It exposes the actual binary layout chosen by the compiler, including padding before the member.',
      },
      {
        title: '4. Packed Structs and Portability Risks',
        beginner:
          'Some compilers allow packed structs that remove padding. This can make structs smaller, but it can also make them slower or unsafe on some platforms.',
        advanced:
          'Packed structures are compiler-specific and can create misaligned access penalties or traps. They are useful for binary protocols and hardware registers, but portable code should serialize fields explicitly instead of assuming a packed struct layout is universally safe.',
      },
      {
        title: '5. Binary Serialization Discipline',
        beginner:
          'If you save a struct directly to a file, you are saving the compiler layout, including padding. That can break when the compiler, platform, or struct order changes.',
        advanced:
          'Production binary formats serialize fields explicitly with defined sizes, endianness, and versioning. Direct struct dumping is convenient but fragile. Expert systems define wire formats separately from in-memory structs.',
      },
    ],
    {
      title: 'Struct Layout Inspection Lab',
      intro:
        'This practical uses sizeof and offsetof to inspect padding, alignment, and field order effects.',
      steps: [
        'Create a file named layout.c.',
        'Add #include <stdio.h> and #include <stddef.h> at the top.',
        'Define struct A: struct A { char c; int i; char d; };',
        'Define struct B: struct B { int i; char c; char d; };',
        'Inside main, print sizeof(struct A) and sizeof(struct B).',
        'Use offsetof(struct A, c), offsetof(struct A, i), and offsetof(struct A, d).',
        'Use offsetof(struct B, i), offsetof(struct B, c), and offsetof(struct B, d).',
        'Compare the sizes and offsets.',
        'Add struct C: struct C { double d; int i; char c; }; and inspect its size.',
        'Reorder fields in struct C and observe how padding changes.',
        'Compile with: gcc layout.c -Wall -Wextra -o layout',
        'Run the program and analyze the memory layout.',
      ],
      goal: 'You successfully inspected struct padding, field offsets, and alignment effects, and learned how field order changes binary layout.',
    },
    [
      q(
        'What is struct padding?',
        [
          'Extra visible fields added by the programmer',
          'Invisible bytes inserted by the compiler to satisfy alignment requirements',
          'A type of compiler error',
          'A network protocol header',
        ],
        1,
        'Padding is unused space inserted between or after struct members to ensure each member is properly aligned according to the ABI and target architecture.'
      ),
      q(
        'Why can two structs with the same fields have different sizes?',
        [
          'Because field order can change padding requirements',
          'Because C randomizes struct sizes',
          'Because one struct is always faster',
          'Because padding is disabled by default',
        ],
        0,
        'Field order changes where padding is needed. Placing large aligned fields first and grouping small fields can reduce wasted space.'
      ),
      q(
        'What does offsetof measure?',
        [
          'The number of fields in a struct',
          'The byte position of a member inside a struct',
          'The alignment of the whole program',
          'The size of a pointer',
        ],
        1,
        'offsetof returns the byte distance from the beginning of the struct to the specified member, including any padding before that member.'
      ),
      q(
        'Why is directly saving a struct to disk risky?',
        [
          'Because the saved layout may include padding and platform-specific representation',
          'Because structs cannot contain numbers',
          'Because files cannot store binary data',
          'Because C prevents file output',
        ],
        0,
        'Direct struct serialization captures compiler-specific layout, padding, endianness, and type sizes. Explicit field serialization is more portable.'
      ),
      q(
        'What is a safer alternative to dumping raw structs into binary files?',
        [
          'Explicit serialization with defined field sizes, order, and endianness',
          'Using printf for all binary formats',
          'Disabling the compiler',
          'Using global variables',
        ],
        0,
        'Explicit serialization defines a stable binary contract. This avoids hidden padding, alignment differences, and platform-specific layout surprises.'
      ),
    ],
    [
      'Alignment affects where objects can safely live in memory.',
      'Padding is invisible but changes struct size.',
      'Field order can reduce or increase padding.',
      'offsetof reveals the real binary layout.',
      'Portable serialization should be explicit, not raw struct dumping.',
    ],
    'This lesson requires local GCC or Clang because struct layout depends on the compiler, architecture, and ABI.'
  ),

  L(
    'cx-04',
    4,
    'Custom Memory Allocators & Arena Design',
    '🏗️',
    '🏗️ malloc is powerful, but it is not always the best tool. Game engines, parsers, virtual machines, and embedded systems often use custom allocators to gain speed, predictable lifetime control, and reduced fragmentation. Arena allocation is one of the most practical patterns: allocate many objects together, then free them all at once.',
    [
      {
        title: '1. Why Custom Allocators Exist',
        beginner:
          'Calling malloc and free for every tiny object can be slow and messy. If many objects live for the same phase of the program, it is better to manage them together.',
        advanced:
          'Custom allocators optimize for allocation patterns, lifetime semantics, cache locality, and fragmentation control. They can reduce syscall pressure, improve determinism, and simplify cleanup by grouping related allocations.',
      },
      {
        title: '2. Arena Allocation Concept',
        beginner:
          'An arena is a large block of memory. Instead of freeing each object one by one, you allocate from the arena and then reset or destroy the whole arena when the phase is complete.',
        advanced:
          'Arena allocators implement bump allocation: each request moves an offset forward, usually with alignment padding. Deallocation is collective, which makes cleanup extremely simple and fast. This is ideal for request-scoped systems, parsers, compilers, and temporary buffers.',
      },
      {
        title: '3. Alignment in Allocators',
        beginner:
          'When allocating memory, the returned address must be suitable for the data type. If you allocate for an int, the address should be properly aligned for an int.',
        advanced:
          'Custom allocators must align offsets manually, often using alignof(max_align_t) or explicit power-of-two alignment. Misaligned allocation can cause crashes or performance penalties on strict architectures.',
      },
      {
        title: '4. Free Lists and General-Purpose Pools',
        beginner:
          'Some custom allocators keep a list of freed blocks. When a new allocation is requested, the allocator reuses an old block instead of asking the system for more memory.',
        advanced:
          'Free-list allocators manage block headers, coalescing, splitting, and fragmentation. They are more complex than arenas but useful when object lifetimes vary. Pool allocators specialize in fixed-size objects to reduce overhead.',
      },
      {
        title: '5. Ownership and Lifetime Design',
        beginner:
          'The biggest question in memory management is: who owns this memory? An allocator design should make ownership obvious. Arena ownership is usually phase-based.',
        advanced:
          'Expert C code designs memory lifetimes as architecture. Ownership can be per-request, per-frame, per-parse, per-connection, or global. Clear lifetime boundaries prevent leaks, dangling pointers, and accidental cross-phase access.',
      },
    ],
    {
      title: 'Arena Allocator Lab',
      intro:
        'This practical builds a simple arena allocator using malloc, aligned bump allocation, reset, and destroy.',
      steps: [
        'Create a file named arena.c.',
        'Add #include <stdio.h>, #include <stdlib.h>, and #include <stddef.h> at the top.',
        'Define struct Arena: struct Arena { unsigned char *buffer; size_t capacity; size_t used; };',
        'Write arena_init: allocate buffer with malloc(capacity) and set used to 0.',
        'Write arena_alloc: align used upward to 8 or 16 bytes, check capacity, return buffer + old used, then increase used.',
        'Write arena_reset: set used back to 0.',
        'Write arena_destroy: free buffer and reset the arena fields.',
        'Inside main, initialize an arena with 1024 bytes.',
        'Allocate space for several integers and one small struct.',
        'Use the allocated memory safely.',
        'Call arena_reset and allocate again to demonstrate phase reuse.',
        'Call arena_destroy at the end.',
        'Compile with: gcc arena.c -Wall -Wextra -o arena',
        'Run the program and verify clean execution.',
      ],
      goal: 'You successfully implemented a simple arena allocator, practiced alignment-aware allocation, and learned phase-based memory ownership.',
    },
    [
      q(
        'What is the main benefit of an arena allocator?',
        [
          'It frees every object individually',
          'It allows many allocations to be released together as one group',
          'It prevents all programming errors',
          'It replaces the CPU cache',
        ],
        1,
        'Arena allocation groups lifetime management. You allocate many objects during a phase, then reset or destroy the arena instead of freeing each object separately.'
      ),
      q(
        'What is bump allocation?',
        [
          'Allocating by moving an offset forward inside a preallocated buffer',
          'Allocating by restarting the program',
          'Allocating only global variables',
          'Allocating memory from the keyboard',
        ],
        0,
        'A bump allocator advances an internal offset for each allocation. It is fast because it avoids per-object free-list management.'
      ),
      q(
        'Why must custom allocators handle alignment?',
        [
          'Because misaligned memory can cause crashes, traps, or slower access',
          'Because alignment changes variable names',
          'Because alignment increases file size',
          'Because alignment disables malloc',
        ],
        0,
        'Many types require addresses that are multiples of certain values. Allocators must return aligned memory for safe and efficient use.'
      ),
      q(
        'When is an arena allocator especially useful?',
        [
          'When many objects share the same lifetime phase',
          'When every object lives forever',
          'When memory is never allocated',
          'When using only global variables',
        ],
        0,
        'Arenas excel when allocations belong to a request, frame, parse, or connection phase and can be freed together.'
      ),
      q(
        'What is a free-list allocator best suited for?',
        [
          'Objects with identical and never-changing lifetimes only',
          'Variable object lifetimes where blocks are reused after being freed',
          'Replacing the operating system',
          'Avoiding all memory alignment',
        ],
        1,
        'Free-list allocators reuse freed blocks, making them useful when individual objects are allocated and deallocated at different times.'
      ),
    ],
    [
      'Custom allocators are architectural tools, not just performance tricks.',
      'Arenas simplify cleanup by grouping allocations into phases.',
      'Alignment must be handled manually in custom allocators.',
      'Ownership design prevents leaks and dangling pointers.',
      'Choose allocator strategy based on lifetime patterns.',
    ],
    'This lesson requires local GCC or Clang and should be verified with sanitizers to prove allocator correctness.'
  ),

  L(
    'cx-05',
    5,
    'Memory Safety: Valgrind, ASan, UBSan',
    '🚨',
    '🚨 C gives you direct memory control, and that control demands verification. Memory bugs are often silent: they corrupt data, crash later, or create security holes. Professional C engineers do not guess. They use AddressSanitizer, UndefinedBehaviorSanitizer, and Valgrind to expose hidden memory errors before users do.',
    [
      {
        title: '1. Memory Error Taxonomy',
        beginner:
          'Memory errors include reading uninitialized memory, writing outside array bounds, using memory after freeing it, freeing the same memory twice, and forgetting to free memory at all.',
        advanced:
          'These errors map to distinct failure classes: out-of-bounds access, use-after-free, double-free, uninitialized reads, invalid frees, and leaks. Each can produce different symptoms, but all are forms of undefined behavior unless detected and corrected.',
      },
      {
        title: '2. AddressSanitizer',
        beginner:
          'AddressSanitizer, often called ASan, is a compiler feature that adds memory checking to your program. It can catch out-of-bounds writes and use-after-free errors.',
        advanced:
          'ASan instruments memory accesses and surrounds allocations with red zones. It detects heap, stack, and global buffer overflows, use-after-free, and double-free errors at runtime. It is enabled with compiler flags such as -fsanitize=address.',
      },
      {
        title: '3. UndefinedBehaviorSanitizer',
        beginner:
          'UndefinedBehaviorSanitizer, or UBSan, checks for dangerous C behavior such as signed integer overflow, misaligned access, or shifting by too many bits.',
        advanced:
          'UBSan detects operations that the C standard leaves undefined. It is commonly combined with ASan. Using -fsanitize=undefined helps catch arithmetic and pointer misuse before optimization turns them into mysterious behavior.',
      },
      {
        title: '4. Valgrind and Dynamic Analysis',
        beginner:
          'Valgrind is a tool that runs your program and watches memory behavior. It can report leaks, invalid reads, invalid writes, and uses of uninitialized values.',
        advanced:
          'Valgrind Memcheck performs heavyweight dynamic analysis without requiring recompilation with sanitizers, although debug symbols improve reports. It is especially valuable for leak tracing and long-running process diagnostics.',
      },
      {
        title: '5. Debugging Workflow',
        beginner:
          'The professional workflow is simple: compile with warnings, run with sanitizers, reproduce the bug, read the report, fix the root cause, and verify again.',
        advanced:
          'Expert debugging combines -g debug symbols, -Wall -Wextra, sanitizers, deterministic test inputs, and minimal reproduction cases. Reports are not noise; they are precise evidence of architectural or coding mistakes.',
      },
    ],
    {
      title: 'Sanitizer Detection Lab',
      intro:
        'This practical creates intentional memory bugs, detects them with sanitizers, and then fixes them.',
      steps: [
        'Create a file named membug.c.',
        'Add #include <stdio.h> and #include <stdlib.h> at the top.',
        'Inside main, allocate: int *values = malloc(5 * sizeof(int));',
        'Write a valid loop for indices 0 through 4.',
        'Add an intentional out-of-bounds write: values[5] = 99;',
        'Compile with sanitizers: gcc membug.c -g -Wall -Wextra -fsanitize=address,undefined -o membug',
        'Run the program and observe the AddressSanitizer report.',
        'Remove the out-of-bounds write.',
        'Add a leak by forgetting free(values); and recompile.',
        'Run again and observe leak reporting if supported by your sanitizer setup.',
        'Fix the program by freeing memory and setting values to NULL.',
        'Recompile and run to verify a clean report.',
      ],
      goal: 'You successfully used compiler sanitizers to detect and fix memory safety bugs instead of relying on unpredictable crashes.',
    },
    [
      q(
        'What does AddressSanitizer primarily detect?',
        [
          'Memory access errors such as buffer overflow and use-after-free',
          'Network latency',
          'Slow internet connections',
          'Incorrect file names only',
        ],
        0,
        'ASan instruments memory accesses and detects invalid reads, invalid writes, use-after-free, double-free, and related memory errors.'
      ),
      q(
        'What does UndefinedBehaviorSanitizer detect?',
        [
          'Operations that the C standard defines as undefined, such as signed overflow or invalid shifts',
          'Only missing header files',
          'Only syntax errors',
          'Only linker errors',
        ],
        0,
        'UBSan detects undefined behavior at runtime, helping catch dangerous arithmetic, pointer misuse, and misaligned operations.'
      ),
      q(
        'What is a use-after-free bug?',
        [
          'Accessing memory after it has been freed',
          'Using a variable before declaring it',
          'Calling a function before main',
          'Including too many headers',
        ],
        0,
        'Use-after-free happens when a pointer still points to memory that has already been returned to the allocator. Dereferencing it is undefined behavior.'
      ),
      q(
        'Why should debug builds use the -g flag?',
        [
          'It adds debug symbols so reports and debuggers can show source locations',
          'It disables all warnings',
          'It makes malloc unnecessary',
          'It converts C to Python',
        ],
        0,
        'The -g flag includes source-level debugging information, making sanitizer reports and debugger traces much more useful.'
      ),
      q(
        'What is the correct response to a sanitizer report?',
        [
          'Fix the root cause and verify with another clean run',
          'Ignore the report if the program still prints output',
          'Disable sanitizers permanently',
          'Restart the computer',
        ],
        0,
        'Sanitizer reports reveal real memory or undefined-behavior issues. They should be treated as high-priority evidence, not ignored.'
      ),
    ],
    [
      'Memory bugs are often silent until they become catastrophic.',
      'Use AddressSanitizer for invalid memory access detection.',
      'Use UndefinedBehaviorSanitizer for arithmetic and pointer misuse.',
      'Use Valgrind for leak tracing and dynamic memory inspection.',
      'Professional C engineering verifies memory safety with tools.',
    ],
    'This lesson requires local GCC or Clang with sanitizer support. Browser simulation is not sufficient.'
  ),

  L(
    'cx-06',
    6,
    'Undefined Behavior Deep Dive',
    '☠️',
    '☠️ Undefined behavior is the most important and dangerous concept in C. When code steps outside the rules of the C standard, the compiler is no longer required to preserve your intended meaning. It may crash, corrupt data, optimize away checks, or appear to work perfectly until production. Expert C engineers design code to avoid undefined behavior, not merely to avoid visible crashes.',
    [
      {
        title: '1. What Undefined Behavior Means',
        beginner:
          'Undefined behavior means the C standard does not define what should happen. The compiler is not required to warn you, and the program may behave differently on different systems.',
        advanced:
          'Undefined behavior removes guarantees from the abstract machine. Compilers may assume undefined behavior never happens and optimize accordingly. This means code containing UB can be transformed in surprising ways that break naive expectations.',
      },
      {
        title: '2. Common Undefined Behavior Patterns',
        beginner:
          'Common examples include dereferencing NULL, reading uninitialized variables, accessing arrays out of bounds, dividing by zero, and overflowing signed integers.',
        advanced:
          'Other patterns include violating strict aliasing, modifying an object more than once between sequence points, calling a function through an incompatible function pointer, and freeing memory twice. Expert engineers memorize these categories and audit for them systematically.',
      },
      {
        title: '3. Optimization and UB',
        beginner:
          'Compilers use the assumption that your code does not contain undefined behavior. If you write a check that could only matter when UB occurs, the compiler may remove it.',
        advanced:
          'Optimizations such as dead code elimination and range analysis can be based on UB assumptions. A signed overflow check may be removed because signed overflow is undefined. This is why UB is not merely a runtime problem; it is a compile-time contract violation.',
      },
      {
        title: '4. Detecting Undefined Behavior',
        beginner:
          'You can detect many undefined behavior cases with compiler warnings and sanitizers. These tools do not find everything, but they catch many serious bugs.',
        advanced:
          'Use -Wall -Wextra -Werror where appropriate, plus UBSan and ASan in testing. Static analyzers and fuzzing help expose UB under diverse inputs. Expert projects combine multiple verification layers.',
      },
      {
        title: '5. Defensive Engineering Against UB',
        beginner:
          'Initialize variables, check bounds, avoid NULL dereference, validate input, and never assume that code that appears to work is correct.',
        advanced:
          'Defensive C architecture uses bounded buffers, explicit ownership, sanitizers, property tests, and clear API contracts. The goal is to make invalid states unrepresentable or detectable before they become undefined behavior.',
      },
    ],
    {
      title: 'UB Observation Lab',
      intro:
        'This practical uses UBSan and ASan to expose common undefined behavior patterns safely in a controlled local environment.',
      steps: [
        'Create a file named ub_demo.c.',
        'Add #include <stdio.h>, #include <stdlib.h>, and #include <limits.h> at the top.',
        'Inside main, create: int x = INT_MAX;',
        'Add a signed overflow: int y = x + 1;',
        'Print y to observe what happens without sanitizer.',
        'Compile without sanitizer: gcc ub_demo.c -Wall -Wextra -o ub_demo',
        'Run the program and observe that it may appear to work.',
        'Compile with UBSan: gcc ub_demo.c -g -Wall -Wextra -fsanitize=undefined -o ub_demo_san',
        'Run the sanitized binary and observe the signed overflow report.',
        'Add an out-of-bounds array access and recompile with ASan.',
        'Observe the ASan report.',
        'Fix the code by using unsigned arithmetic or explicit bounds checks where appropriate.',
      ],
      goal: 'You successfully observed how undefined behavior can appear harmless without tools and how sanitizers expose hidden contract violations.',
    },
    [
      q(
        'What does undefined behavior mean in C?',
        [
          'The C standard imposes no requirements on what happens',
          'The program must print an error message',
          'The compiler must stop compilation',
          'The operating system must restart',
        ],
        0,
        'Undefined behavior removes guarantees. The program may crash, corrupt data, appear normal, or behave differently across compilers and optimization levels.'
      ),
      q(
        'Why can optimizing compilers make undefined behavior seem even stranger?',
        [
          'Because they assume undefined behavior never happens and optimize based on that assumption',
          'Because they delete source files',
          'Because they convert C to Java',
          'Because they disable main',
        ],
        0,
        'Compilers may transform code under the assumption that UB does not occur. This can remove checks or alter control flow in ways that surprise beginners.'
      ),
      q(
        'Which of these is undefined behavior?',
        [
          'Reading an uninitialized automatic variable',
          'Printing a string',
          'Returning 0 from main',
          'Using sizeof(int)',
        ],
        0,
        'Reading an uninitialized automatic variable is undefined behavior because the stored value is indeterminate.'
      ),
      q(
        'What is a common result of signed integer overflow in C?',
        [
          'It is undefined behavior',
          'It always wraps safely',
          'It automatically promotes to double',
          'It closes the program safely',
        ],
        0,
        'Signed integer overflow is undefined behavior. Unsigned overflow has defined modular behavior, but signed overflow does not.'
      ),
      q(
        'What is the best engineering attitude toward undefined behavior?',
        [
          'Avoid it, detect it with tools, and design contracts that prevent it',
          'Use it whenever it appears faster',
          'Ignore it if testing passes once',
          'Assume every compiler handles it identically',
        ],
        0,
        'Professional C engineering treats undefined behavior as a serious defect class. It should be prevented, detected, and eliminated.'
      ),
    ],
    [
      'Undefined behavior removes all guarantees.',
      'Code that appears to work can still contain UB.',
      'Optimizers can assume UB never occurs.',
      'Use sanitizers and warnings to detect UB.',
      'Design APIs and buffers to make UB unlikely.',
    ],
    'This lesson requires local GCC or Clang with UBSan and ASan support.'
  ),

  L(
    'cx-07',
    7,
    'C Standard Library Internals',
    '📚',
    '📚 The C standard library is not a black box. It is a carefully designed collection of memory, string, math, input, output, error, and utility functions. Expert engineers understand how libc functions behave, what guarantees they provide, and where they become dangerous. This knowledge is essential for performance, portability, and secure C programming.',
    [
      {
        title: '1. Header Contracts',
        beginner:
          'Each C library feature lives behind a header. stdio.h provides input and output, string.h provides string and memory functions, stdlib.h provides allocation and conversion utilities, and errno.h provides error reporting.',
        advanced:
          'Headers expose declarations, macros, and sometimes inline functions. Including the correct header allows the compiler to validate function signatures. Missing prototypes can cause subtle and dangerous calling mistakes.',
      },
      {
        title: '2. String and Memory Functions',
        beginner:
          'Functions like strlen, strcmp, memcpy, memmove, and memset operate on bytes and C strings. Some require null termination, while others work with explicit lengths.',
        advanced:
          'Expert engineers distinguish string functions from memory functions. strlen scans until a null terminator, memcpy assumes non-overlapping regions, memmove handles overlap safely, and bounded alternatives or manual length tracking are required for secure string handling.',
      },
      {
        title: '3. stdio Buffering',
        beginner:
          'printf does not always write to the screen immediately. The C I/O system often stores output in a buffer and flushes it later.',
        advanced:
          'stdio streams can be fully buffered, line buffered, or unbuffered depending on the stream and environment. Understanding buffering is essential for interactive programs, pipes, logging, and performance tuning. fflush and setvbuf provide explicit control.',
      },
      {
        title: '4. errno and Error Reporting',
        beginner:
          'Many C library functions report errors through return values and a special variable called errno. You can inspect errno to learn what went wrong.',
        advanced:
          'errno is thread-local in modern hosted environments. Functions only set errno on failure, so return values must be checked first. perror and strerror convert errno into human-readable diagnostics.',
      },
      {
        title: '5. Safety and Replacement Patterns',
        beginner:
          'Some classic C functions are dangerous because they do not check buffer sizes. Expert code avoids them or replaces them with bounded logic.',
        advanced:
          'Modern C code prefers snprintf over sprintf, bounded copies over unbounded copies, fgets over unsafe line reads, and explicit length parameters over null-terminated assumptions. Secure coding is a design pattern, not a single function.',
      },
    ],
    {
      title: 'libc Inspection Lab',
      intro:
        'This practical inspects string functions, memory functions, errno, and stdio buffering behavior.',
      steps: [
        'Create a file named libc_lab.c.',
        'Add #include <stdio.h>, #include <string.h>, #include <stdlib.h>, and #include <errno.h> at the top.',
        'Inside main, declare: const char *message = "systems engineering";',
        'Print strlen(message).',
        'Use strcmp to compare two strings and print the result.',
        'Use memcpy to copy a char array and print the copy.',
        'Use memmove on overlapping arrays and verify correctness.',
        'Attempt to open a missing file with fopen.',
        'If fopen fails, print errno and use perror("fopen failed").',
        'Use strerror(errno) to print the error text.',
        'Use printf without a newline and observe buffering behavior.',
        'Use fflush(stdout) to force output.',
        'Compile with: gcc libc_lab.c -Wall -Wextra -o libc_lab',
        'Run the program and analyze the behavior.',
      ],
      goal: 'You successfully used core libc functions, understood error reporting through errno, and observed stdio buffering behavior.',
    },
    [
      q(
        'What is the difference between memcpy and memmove?',
        [
          'memcpy is faster but requires non-overlapping regions, while memmove handles overlap safely',
          'memmove deletes memory',
          'memcpy only works with strings',
          'memmove is a macro only',
        ],
        0,
        'memcpy may produce undefined behavior if source and destination overlap. memmove is required to handle overlapping memory correctly.'
      ),
      q(
        'What does strlen measure?',
        [
          'The number of bytes before the null terminator',
          'The total allocated buffer size',
          'The number of words in a string',
          'The memory address of the string',
        ],
        0,
        'strlen scans until it finds the null terminator and returns the number of characters before it. It does not know the total buffer capacity.'
      ),
      q(
        'Why should return values be checked before reading errno?',
        [
          'Because errno is only meaningful after a function reports failure',
          'Because errno is always zero',
          'Because errno replaces return values',
          'Because errno only works with printf',
        ],
        0,
        'Functions do not necessarily clear errno on success. The return value tells you whether failure occurred, then errno provides detail.'
      ),
      q(
        'What does fflush(stdout) do?',
        [
          'It forces buffered output to be written to the stream',
          'It deletes stdout',
          'It closes the program',
          'It clears all variables',
        ],
        0,
        'fflush requests that buffered output be delivered to the underlying stream. This is useful for interactive programs and debugging output.'
      ),
      q(
        'Why is snprintf often preferred over sprintf?',
        [
          'Because snprintf allows a maximum output size and reduces buffer overflow risk',
          'Because snprintf does not use strings',
          'Because snprintf is not a standard function',
          'Because snprintf disables formatting',
        ],
        0,
        'snprintf writes at most a specified number of bytes, helping prevent buffer overflow. sprintf has no such limit.'
      ),
    ],
    [
      'The C standard library is built around explicit contracts.',
      'String functions depend on null termination.',
      'Memory functions use explicit byte lengths.',
      'errno provides detailed failure context after return checks.',
      'Prefer bounded and explicit APIs for secure C code.',
    ],
    'This lesson requires local GCC or Clang because libc behavior, buffering, and errno diagnostics are environment-dependent.'
  ),

  L(
    'cx-08',
    8,
    'Bit Manipulation & Embedded Patterns',
    '🔌',
    '🔌 At the lowest level, software is bits. C gives you direct control over bits through bitwise operators, masks, shifts, and compact flag structures. This is essential for embedded systems, hardware registers, compression, cryptography, networking protocols, and performance-sensitive data packing.',
    [
      {
        title: '1. Bitwise Operators',
        beginner:
          'C provides operators that work directly on bits: & for AND, | for OR, ^ for XOR, ~ for NOT, << for left shift, and >> for right shift.',
        advanced:
          'Bitwise operations are constant-time machine-level operations. They are used to build masks, test flags, pack fields, compute hashes, and manipulate binary protocols. Correctness depends on using unsigned types and understanding shift rules.',
      },
      {
        title: '2. Setting, Clearing, Toggling, and Testing Bits',
        beginner:
          'You can turn a bit on with OR, turn it off with AND and NOT, flip it with XOR, and test it with AND. These four operations are the foundation of bit control.',
        advanced:
          'A typical pattern uses x |= mask to set, x &= ~mask to clear, x ^= mask to toggle, and (x & mask) != 0 to test. These macros or inline functions must be written carefully to avoid precedence bugs.',
      },
      {
        title: '3. Masks and Bit Fields',
        beginner:
          'A mask is a value with selected bits turned on. Masks let you isolate part of a number. Bit fields let you name small groups of bits inside a struct.',
        advanced:
          'Masks are portable and explicit. Bit fields can be convenient but have implementation-defined layout. For hardware registers and binary protocols, explicit shift-and-mask operations are often more predictable than bit-field structs.',
      },
      {
        title: '4. Signedness and Shift Safety',
        beginner:
          'Bit manipulation is safest with unsigned integers. Shifting signed integers can create confusing or undefined behavior.',
        advanced:
          'Right shifting signed negative values is implementation-defined in many cases, and shifting by too many bits is undefined. Expert code uses uint8_t, uint16_t, uint32_t, or uint64_t from stdint.h for precise bit manipulation.',
      },
      {
        title: '5. Embedded Register Patterns',
        beginner:
          'Embedded systems often control hardware by writing bits to special registers. You may need to enable one feature while leaving other settings unchanged.',
        advanced:
          'Register programming uses read-modify-write cycles, volatile qualifiers, masks, and precise ordering constraints. Bit manipulation combined with volatile access is central to device drivers and firmware.',
      },
    ],
    {
      title: 'Bit Control Lab',
      intro:
        'This practical builds bit manipulation helper functions, flag packing, and binary printing routines.',
      steps: [
        'Create a file named bits.c.',
        'Add #include <stdio.h> and #include <stdint.h> at the top.',
        'Write a function: uint8_t set_bit(uint8_t value, int position) returning value | (1u << position);',
        'Write clear_bit, toggle_bit, and test_bit using &, ^, and != 0.',
        'Write a print_binary function that prints an 8-bit value from most significant bit to least significant bit.',
        'Inside main, create uint8_t flags = 0;',
        'Set bit 0 and bit 3, then print flags in binary.',
        'Clear bit 0, then print again.',
        'Toggle bit 3, then print again.',
        'Test bit 1 using if (test_bit(flags, 1)).',
        'Pack two 4-bit values into one uint8_t using shifts and masks.',
        'Unpack them using right shift and & 0x0F.',
        'Compile with: gcc bits.c -Wall -Wextra -o bits',
        'Run the program and verify each binary output.',
      ],
      goal: 'You successfully implemented low-level bit manipulation primitives and understood how C controls individual bits safely.',
    },
    [
      q(
        'Which operator is commonly used to set a bit?',
        [
          'Bitwise OR',
          'Bitwise AND only',
          'Logical NOT',
          'Modulo',
        ],
        0,
        'Bitwise OR with a mask sets selected bits to 1 while leaving other bits unchanged.'
      ),
      q(
        'How do you clear a bit?',
        [
          'Use AND with the inverted mask',
          'Use OR with the mask',
          'Use XOR with zero',
          'Use sizeof',
        ],
        0,
        'Clearing uses x &= ~mask. The mask has 1 bits inverted to 0 at the target position, forcing that bit off.'
      ),
      q(
        'Why is unsigned integer type preferred for bit manipulation?',
        [
          'Because signed shifts and negative values can create implementation-defined or undefined behavior',
          'Because unsigned uses more memory',
          'Because unsigned disables optimization',
          'Because signed integers cannot store zero',
        ],
        0,
        'Unsigned integers have well-defined modular arithmetic and shift behavior within valid ranges, making them safer for bit-level programming.'
      ),
      q(
        'What is a bitmask?',
        [
          'A value used to select or modify specific bits',
          'A type of floating-point number',
          'A file extension',
          'A compiler flag only',
        ],
        0,
        'A bitmask isolates or changes selected bits through bitwise operations. Masks are central to flags, registers, and binary protocols.'
      ),
      q(
        'What is a common embedded use of volatile bit manipulation?',
        [
          'Reading and writing hardware registers safely with respect to external changes',
          'Making strings immutable',
          'Compressing text files',
          'Replacing functions',
        ],
        0,
        'Hardware registers can change outside normal program flow. volatile ensures the compiler preserves reads and writes to those locations.'
      ),
    ],
    [
      'Use unsigned fixed-width types for bit manipulation.',
      'Use OR to set, AND NOT to clear, XOR to toggle, AND to test.',
      'Masks isolate and control specific bit regions.',
      'Avoid signed shift pitfalls.',
      'Bit manipulation is essential for embedded and systems engineering.',
    ],
    'This lesson requires local GCC or Clang to inspect exact binary behavior and compiler diagnostics.'
  ),

  // C Expert Track — Part 2: cx-09 to cx-16

L(
  'cx-09',
  9,
  'Endianness, Serialization & Binary Protocols',
  '🌐',
  '🌐 Bytes do not have universal meaning. The same four bytes can represent completely different numbers depending on the machine reading them. Expert C engineers must control binary representation explicitly. Endianness, serialization, and protocol design are the foundations of network programming, file formats, embedded communication, and cross-platform systems.',
  [
    {
      title: '1. Endianness Fundamentals',
      beginner:
        'Endianness is the order in which a computer stores the bytes of a multi-byte number. Big-endian stores the most significant byte first. Little-endian stores the least significant byte first.',
      advanced:
        'Endianness is a hardware and architecture convention. Network protocols commonly use big-endian order, while many desktop and embedded platforms use little-endian. If a program reads binary data without agreeing on byte order, values become corrupted silently.',
    },
    {
      title: '2. Host Order vs Network Order',
      beginner:
        'When sending data over a network, both sides must agree on the byte order. Network order is usually big-endian. Your program may need to convert between its native order and network order.',
      advanced:
        'Portable protocols define a canonical wire format. Conversion functions or explicit shift-and-mask serialization are used to translate between host order and wire order. Relying on raw struct memory is unsafe across architectures.',
    },
    {
      title: '3. Explicit Serialization',
      beginner:
        'Serialization means turning in-memory data into a stable byte sequence. Instead of saving a whole struct, you save each field one by one in a known order.',
      advanced:
        'Professional binary formats define field size, field order, endianness, alignment, and versioning. Explicit serialization avoids hidden padding, compiler-specific layout, and platform-dependent type sizes.',
    },
    {
      title: '4. Struct Padding and Binary Safety',
      beginner:
        'A struct can contain invisible padding bytes added by the compiler. If you write the whole struct to disk or network, those padding bytes can change meaning on another system.',
      advanced:
        'Direct struct dumping is fragile. Padding, alignment, type size, and endianness all vary. Robust systems serialize primitive fields explicitly and reconstruct structs on the receiving side.',
    },
    {
      title: '5. Protocol Versioning and Discipline',
      beginner:
        'A binary protocol should include version information. If you change the format later, old programs can detect the version and handle it correctly.',
      advanced:
        'Production protocols use magic numbers, version fields, length prefixes, checksums, and backward-compatible extension rules. Binary protocol engineering is a contract discipline as much as a coding skill.',
    },
  ],
  {
    title: 'Endian Detection & Serialization Lab',
    intro:
      'This practical detects host endianness, manually serializes an integer into big-endian format, and deserializes it back safely.',
    steps: [
      'Create a file named endian.c.',
      'Add #include <stdio.h> and #include <stdint.h> at the top.',
      'Define a union: union Endian { uint32_t value; uint8_t bytes[4]; };',
      'Inside main, create: union Endian test;',
      'Assign test.value = 0x11223344;',
      'Loop over test.bytes and print each byte using printf("%02x ", test.bytes[i]);',
      'Determine whether the first printed byte is 11 or 44 to identify big-endian or little-endian layout.',
      'Create a buffer: uint8_t buffer[4];',
      'Serialize manually: buffer[0] = (test.value >> 24) & 0xFF; buffer[1] = (test.value >> 16) & 0xFF; buffer[2] = (test.value >> 8) & 0xFF; buffer[3] = test.value & 0xFF;',
      'Deserialize manually: uint32_t restored = ((uint32_t)buffer[0] << 24) | ((uint32_t)buffer[1] << 16) | ((uint32_t)buffer[2] << 8) | buffer[3];',
      'Print restored and compare it with the original value.',
      'Compile with: gcc endian.c -Wall -Wextra -o endian',
      'Run the program and verify correct serialization behavior.',
    ],
    goal: 'You successfully detected endianness, serialized a number into explicit big-endian wire format, and deserialized it without relying on raw struct memory.',
  },
  [
    q(
      'What does little-endian mean?',
      [
        'The least significant byte is stored first',
        'The most significant byte is stored first',
        'All bytes are reversed randomly',
        'Numbers are stored as text',
      ],
      0,
      'Little-endian stores the least significant byte at the lowest memory address. Big-endian stores the most significant byte first.'
    ),
    q(
      'Why is network byte order important?',
      [
        'It ensures different machines agree on a common binary representation',
        'It compresses network traffic automatically',
        'It encrypts packets by default',
        'It replaces IP addresses',
      ],
      0,
      'Network protocols require a canonical byte order so different architectures can exchange binary data correctly. Network byte order is commonly big-endian.'
    ),
    q(
      'Why is writing a raw struct to a network socket dangerous?',
      [
        'Because padding, alignment, endianness, and type sizes may differ between systems',
        'Because structs cannot contain numbers',
        'Because sockets only accept text',
        'Because C prevents struct transmission',
      ],
      0,
      'Raw struct transmission captures compiler-specific memory layout. Explicit field serialization is safer and more portable.'
    ),
    q(
      'What is a wire format?',
      [
        'The exact byte-level representation used when data is transmitted or stored',
        'A physical network cable',
        'A compiler optimization flag',
        'A type of C pointer',
      ],
      0,
      'A wire format defines how data is encoded into bytes for transmission or persistence. It must specify order, size, and meaning.'
    ),
    q(
      'What is a good practice for binary protocol evolution?',
      [
        'Include version fields and design backward-compatible rules',
        'Change layouts randomly without documentation',
        'Remove all length fields',
        'Avoid checksums permanently',
      ],
      0,
      'Versioning allows receivers to detect format changes. Length prefixes, magic numbers, and checksums improve robustness.'
    ),
  ],
  [
    'Endianness determines byte order for multi-byte values.',
    'Network protocols usually use big-endian order.',
    'Serialize fields explicitly instead of dumping raw structs.',
    'Hidden padding makes raw struct transfer unsafe.',
    'Design binary protocols with versioning, length, and checksum discipline.',
  ],
  'This expert practical requires local GCC or Clang. Browser simulation is not sufficient for binary memory inspection.'
),

L(
  'cx-10',
  10,
  'ABI, Calling Conventions & Object Files',
  '🧬',
  '🧬 C code does not exist alone. It must connect with compiled libraries, operating systems, loaders, and other object files. The Application Binary Interface is the machine-level contract that makes this possible. Understanding ABI, calling conventions, symbols, and object files turns you from a C programmer into a systems builder.',
  [
    {
      title: '1. What Is an ABI?',
      beginner:
        'An ABI is a low-level contract. It defines how functions receive arguments, how values are returned, how memory is laid out, and how programs connect with compiled code.',
      advanced:
        'The ABI includes calling conventions, register usage, stack alignment, struct layout, name representation, and exception or error mechanisms. It is more concrete than an API because it governs compiled binary behavior, not just source-level declarations.',
    },
    {
      title: '2. Calling Conventions',
      beginner:
        'When a function is called, the computer must know where arguments go and where the return value comes from. The rules for this are called the calling convention.',
      advanced:
        'Calling conventions define which registers carry arguments, which registers are preserved, who cleans the stack, and how return values are passed. Differences between platforms explain why binary compatibility is fragile and why foreign function interfaces need careful configuration.',
    },
    {
      title: '3. Symbols and Object Files',
      beginner:
        'When you compile a C file without linking, you get an object file. It contains machine code and a list of symbols, such as function names and global variables.',
      advanced:
        'Object files contain sections for code, data, read-only data, relocation entries, and symbol tables. Symbols can be defined, undefined, local, or global. The linker resolves undefined symbols by connecting them to definitions in other objects or libraries.',
    },
    {
      title: '4. Linking and Relocation',
      beginner:
        'Linking combines object files into one executable. The linker matches function calls with function definitions and assigns final memory locations.',
      advanced:
        'Relocation entries tell the linker where addresses must be patched once final section locations are known. Position-independent code and shared libraries rely on advanced relocation and dynamic linking mechanisms.',
    },
    {
      title: '5. Inspecting Binaries',
      beginner:
        'You can inspect compiled C programs using tools like nm, objdump, and readelf. These tools reveal symbols, sections, and generated instructions.',
      advanced:
        'Binary inspection is essential for debugging linker errors, understanding ABI behavior, analyzing performance, and diagnosing platform-specific failures. Expert engineers read symbol tables and disassembly as naturally as source code.',
    },
  ],
  {
    title: 'Symbol & Assembly Inspection Lab',
    intro:
      'This practical compiles C code into object files, inspects symbols, and examines how source becomes assembly and machine code.',
    steps: [
      'Create a file named abi.c.',
      'Add #include <stdio.h> at the top.',
      'Write a function: int add(int a, int b) { return a + b; }',
      'Inside main, call add(10, 20) and print the result.',
      'Compile to an object file: gcc -c abi.c -o abi.o',
      'Inspect symbols: nm abi.o',
      'Look for the symbol representing add and the symbol representing main.',
      'Generate assembly: gcc -S abi.c -o abi.s',
      'Open abi.s and locate the call to add.',
      'Link the object file: gcc abi.o -o abi',
      'Run the executable and verify the output.',
      'Optional: inspect disassembly with objdump -d abi or a platform equivalent.',
    ],
    goal: 'You successfully observed the boundary between source code, object files, symbols, assembly, and linked executables.',
  },
  [
    q(
      'What does an ABI define?',
      [
        'Binary-level rules for compiled code interaction',
        'Only the spelling of variable names',
        'Only source code formatting',
        'Only terminal colors',
      ],
      0,
      'An ABI defines binary-level behavior such as calling conventions, struct layout, symbol representation, and linking expectations.'
    ),
    q(
      'What is a calling convention?',
      [
        'Rules for passing arguments and returning values between functions',
        'A style guide for variable names',
        'A network protocol',
        'A file compression method',
      ],
      0,
      'Calling conventions determine how arguments, return values, registers, and stack responsibilities are handled during function calls.'
    ),
    q(
      'What does an object file contain?',
      [
        'Compiled machine code plus metadata such as symbols and relocation information',
        'Only comments from the source file',
        'Only user documentation',
        'Only preprocessor directives',
      ],
      0,
      'Object files are intermediate artifacts. They contain code, data, symbol tables, and information needed by the linker.'
    ),
    q(
      'What does the linker do?',
      [
        'It resolves symbols and combines object files into an executable or library',
        'It formats source code',
        'It replaces all functions with macros',
        'It deletes unused header files',
      ],
      0,
      'The linker connects function calls to definitions, assigns final addresses, and produces a runnable binary or library.'
    ),
    q(
      'Why are symbols important?',
      [
        'They allow the linker and debugger to identify functions and variables',
        'They encrypt the executable',
        'They increase compiler warnings',
        'They replace header files',
      ],
      0,
      'Symbols identify compiled entities. They are essential for linking, debugging, profiling, and dynamic loading.'
    ),
  ],
  [
    'ABI is the binary contract between compiled code and the system.',
    'Calling conventions control function argument and return behavior.',
    'Object files contain symbols, sections, and relocation data.',
    'Linking resolves symbols into a final executable.',
    'Use nm, objdump, and readelf to inspect real binaries.',
  ],
  'This lesson requires local GCC or Clang and binary inspection tools.'
),

L(
  'cx-11',
  11,
  'Function Pointers, Callbacks & Plugin Architecture',
  '🔗',
  '🔗 Function pointers turn behavior into data. They allow programs to choose algorithms at runtime, notify components when events happen, and build extensible plugin systems. This is one of the most powerful patterns in C, used in operating systems, event loops, GUI toolkits, interpreters, and embedded control systems.',
  [
    {
      title: '1. Function Pointers as Behavior References',
      beginner:
        'A function pointer stores the address of a function. You can call the function through the pointer, pass it around, or store it in a table.',
      advanced:
        'Function pointers introduce indirect control flow. The actual code executed depends on runtime state. This enables polymorphic behavior in C but requires strict type discipline because calling through an incompatible pointer type is undefined behavior.',
    },
    {
      title: '2. Callbacks',
      beginner:
        'A callback is a function you give to another function so it can call it later. For example, a sort function can call your comparison function whenever it needs to compare two items.',
      advanced:
        'Callbacks implement inversion of control. The framework calls your code instead of your code calling the framework. This pattern is central to event systems, asynchronous I/O, timers, and plugin hooks.',
    },
    {
      title: '3. Dispatch Tables',
      beginner:
        'A dispatch table is an array of function pointers. Instead of writing many if statements, you select an index and call the function stored there.',
      advanced:
        'Dispatch tables provide O(1) command routing and clean extensibility. They are common in virtual machines, command-line interpreters, protocol handlers, and state machines.',
    },
    {
      title: '4. Plugin Architecture Concepts',
      beginner:
        'A plugin architecture lets a program load new behavior without recompiling the main executable. In C, this can be done with dynamic libraries and function pointer registration.',
      advanced:
        'Real plugin systems use dynamic loading APIs such as dlopen and dlsym on Unix-like systems. They require stable ABI boundaries, versioned interfaces, careful ownership rules, and safe unload semantics.',
    },
    {
      title: '5. Type-Safe Function Pointer Design',
      beginner:
        'Function pointer syntax can be confusing. Use typedef to create clear names for function pointer types, such as typedef int (*binary_op)(int, int);',
      advanced:
        'Strong function pointer typing reduces accidental mismatches. Expert code documents expected signatures, avoids casting incompatible function pointers, and uses registration functions to enforce interface contracts.',
    },
  ],
  {
    title: 'Callback Dispatch Lab',
    intro:
      'This practical builds a command dispatch table and uses a callback comparator with qsort.',
    steps: [
      'Create a file named callbacks.c.',
      'Add #include <stdio.h> and #include <stdlib.h> at the top.',
      'Define functions: int add(int a, int b), int subtract(int a, int b), int multiply(int a, int b).',
      'Declare: typedef int (*binary_op)(int, int);',
      'Create a dispatch struct: struct Command { const char *name; binary_op op; };',
      'Create an array of commands mapping names like add, sub, and mul to the matching functions.',
      'Inside main, loop through the command array and call each operation with sample values.',
      'Create an integer array with unsorted values.',
      'Write a comparator function for ascending order.',
      'Call qsort using your comparator function pointer.',
      'Print the sorted array.',
      'Compile with: gcc callbacks.c -Wall -Wextra -o callbacks',
      'Run the program and verify dispatch and sorting behavior.',
    ],
    goal: 'You successfully used function pointers to dispatch behavior, implemented callback-style control flow, and integrated with the standard library qsort function.',
  },
  [
    q(
      'What is a callback?',
      [
        'A function passed to another function to be called later',
        'A variable that stores text',
        'A compiler error',
        'A type of header file',
      ],
      0,
      'A callback allows one function to invoke another function supplied by the caller, enabling flexible and extensible behavior.'
    ),
    q(
      'What is a dispatch table?',
      [
        'An array or table that maps commands to function pointers',
        'A table used only for printing text',
        'A file containing compiler settings',
        'A database of passwords',
      ],
      0,
      'Dispatch tables route operations to functions using indexes or keys, reducing long conditional chains and supporting clean extension.'
    ),
    q(
      'Why is function pointer type safety important?',
      [
        'Calling through an incompatible function pointer can cause undefined behavior',
        'Function pointers cannot store addresses',
        'Function pointers are always slower than integers',
        'Function pointers replace all variables',
      ],
      0,
      'Function pointers must match the expected signature. Mismatched return types or parameter lists can corrupt execution state.'
    ),
    q(
      'What does qsort use from the programmer?',
      [
        'A comparator function pointer that defines element ordering',
        'A global sorted array',
        'A network connection',
        'A terminal color theme',
      ],
      0,
      'qsort is generic because it receives a comparator callback. The comparator tells qsort how to order any type of data.'
    ),
    q(
      'What is a common use of dynamic loading in plugin systems?',
      [
        'Loading shared libraries at runtime and resolving function symbols',
        'Deleting unused source files',
        'Converting C into Python',
        'Disabling the compiler',
      ],
      0,
      'Dynamic loading allows programs to extend behavior by loading compiled modules at runtime and locating exported functions.'
    ),
  ],
  [
    'Function pointers store behavior as data.',
    'Callbacks enable inversion of control.',
    'Dispatch tables route commands efficiently.',
    'Use typedef to simplify function pointer declarations.',
    'Maintain strict signature discipline to avoid undefined behavior.',
  ],
  'This lesson requires local GCC or Clang to verify function pointer behavior and standard library callbacks.'
),

L(
  'cx-12',
  12,
  'Variadic Functions & Type Erasure',
  '🧰',
  '🧰 Variadic functions allow C to accept a variable number of arguments. They power printf, scanf, logging systems, and flexible APIs. But this flexibility comes with responsibility: C loses type information at runtime, so the programmer must create safe conventions for argument count, type expectations, and termination.',
  [
    {
      title: '1. Variadic Function Basics',
      beginner:
        'A variadic function can take extra arguments using three dots, like int sum(int count, ...). The function then reads those arguments one by one.',
      advanced:
        'Variadic functions rely on the stdarg.h machinery. The compiler places arguments according to the calling convention, and va_start, va_arg, and va_end navigate that runtime argument area.',
    },
    {
      title: '2. va_start, va_arg, va_end',
      beginner:
        'va_start prepares to read extra arguments. va_arg retrieves the next argument with a specified type. va_end cleans up when you are finished.',
      advanced:
        'va_arg requires the correct type name. If the requested type does not match the actual argument type after default promotions, behavior is undefined. This is why variadic APIs need strict format or count conventions.',
    },
    {
      title: '3. Type Erasure and Runtime Type Loss',
      beginner:
        'When arguments are passed into a variadic function, the function does not automatically know their types. You must tell it by using a count, format string, sentinel value, or tagged structure.',
      advanced:
        'Type erasure is the loss of compile-time type information. C compensates using explicit protocols: printf uses format strings, some APIs use sentinel values, and others use tagged unions or descriptor structures.',
    },
    {
      title: '4. Default Argument Promotions',
      beginner:
        'Small types are often promoted when passed into variadic functions. For example, char and short may become int, and float may become double.',
      advanced:
        'The C standard specifies default argument promotions for variadic calls. Requesting the original small type directly through va_arg can be invalid. Expert code requests the promoted type.',
    },
    {
      title: '5. Safe Variadic API Design',
      beginner:
        'Variadic functions should be designed carefully. Always include a count, a format string, or a clear terminator so the function knows when to stop reading arguments.',
      advanced:
        'Modern C APIs often prefer typed arrays, structs, or builder functions over raw variadic interfaces unless the API genuinely benefits from printf-style flexibility. Variadic functions should be wrapped behind safe helper macros or functions.',
    },
  ],
  {
    title: 'Variadic Sum & Average Lab',
    intro:
      'This practical implements a variadic integer sum function and a safe count-driven average function.',
    steps: [
      'Create a file named variadic.c.',
      'Add #include <stdio.h> and #include <stdarg.h> at the top.',
      'Write: int sum_ints(int count, ...)',
      'Inside sum_ints, declare: va_list args;',
      'Initialize: va_start(args, count);',
      'Loop from 0 to count - 1 and retrieve each value using va_arg(args, int).',
      'End with va_end(args); and return the total.',
      'Write: double average_ints(int count, ...) using the same pattern.',
      'Inside main, call sum_ints(3, 10, 20, 30) and print the result.',
      'Call sum_ints(5, 1, 2, 3, 4, 5) and print the result.',
      'Call average_ints(4, 10, 20, 30, 40) and print the result.',
      'Compile with: gcc variadic.c -Wall -Wextra -o variadic',
      'Run the program and verify correct argument traversal.',
    ],
    goal: 'You successfully implemented variadic functions, understood argument traversal, and used count-driven conventions to prevent unsafe argument reading.',
  },
  [
    q(
      'What header is required for variadic functions in C?',
      [
        'stdarg.h',
        'math.h',
        'ctype.h',
        'time.h',
      ],
      0,
      'The stdarg.h header provides va_list, va_start, va_arg, and va_end for traversing variable argument lists.'
    ),
    q(
      'What does va_arg(args, int) do?',
      [
        'It retrieves the next argument as an int',
        'It creates a new integer variable',
        'It deletes the argument list',
        'It prints all arguments',
      ],
      0,
      'va_arg advances through the variadic argument area and returns the next value interpreted as the specified type.'
    ),
    q(
      'Why do variadic functions need a count, format string, or terminator?',
      [
        'Because the function does not automatically know how many arguments were passed or what types they have',
        'Because C requires all functions to have exactly one argument',
        'Because variadic functions cannot return values',
        'Because arguments are stored in files',
      ],
      0,
        'Variadic calls erase type and count information at runtime. The API must provide a protocol for safe traversal.'
    ),
    q(
      'What happens if va_arg requests the wrong type?',
      [
        'It can cause undefined behavior',
        'It automatically converts the value safely',
        'It restarts the program',
        'It deletes the remaining arguments',
      ],
      0,
      'Type mismatches in variadic argument retrieval are unsafe because the runtime argument area does not contain full type metadata.'
    ),
    q(
      'Why does printf need format specifiers?',
      [
        'They tell printf how many arguments exist and what types to interpret',
        'They encrypt the output',
        'They compress the string',
        'They replace the standard library',
      ],
      0,
      'Format specifiers provide the runtime type protocol for printf. Without them, printf would not know how to interpret the variadic arguments.'
    ),
  ],
  [
    'Variadic functions accept variable argument lists.',
    'Use va_start, va_arg, and va_end correctly.',
    'Runtime type information is erased in variadic calls.',
    'Design safe conventions such as counts or format strings.',
    'Respect default argument promotion rules.',
  ],
  'This lesson requires local GCC or Clang because variadic calling behavior depends on the real compiler and ABI.'
),

L(
  'cx-13',
  13,
  'setjmp/longjmp & Error Recovery',
  '🚑',
  '🚑 C does not have built-in exceptions. When deep call chains fail, returning error codes through every layer can become painful. setjmp and longjmp provide non-local jumps, allowing a program to escape from deep failure points back to a recovery location. This power is useful, but it must be used with extreme discipline.',
  [
    {
      title: '1. Non-Local Jumps',
      beginner:
        'setjmp saves a snapshot of where the program is. longjmp jumps back to that saved place. It is like placing a checkpoint and then teleporting back to it when something goes wrong.',
      advanced:
        'setjmp captures a jmp_buf environment containing enough execution context to resume at the saved point. longjmp restores that context, bypassing intermediate function returns. This is not normal control flow and must be used carefully.',
    },
    {
      title: '2. Error Recovery Patterns',
      beginner:
        'You can use setjmp at a high level. If a deeply nested function detects a fatal error, it calls longjmp to return to the high level, where cleanup and reporting happen.',
      advanced:
        'This pattern resembles exception handling but without automatic stack unwinding. Resources acquired between setjmp and longjmp are not automatically released, so cleanup discipline is essential.',
    },
    {
      title: '3. Volatile and Variable State',
      beginner:
        'When longjmp jumps back, some variables may not have the values you expect. Variables that change between setjmp and longjmp may need the volatile keyword.',
      advanced:
        'The C standard specifies that certain automatic variables may become indeterminate after longjmp if they are modified between setjmp and longjmp and are not declared volatile. Expert code marks such variables volatile.',
    },
    {
      title: '4. Interaction with Signals',
      beginner:
        'setjmp and longjmp are sometimes used with signal handlers. However, signal handling has strict rules about what is safe to call.',
      advanced:
        'For signal-safe non-local jumps, sigsetjmp and siglongjmp are preferred because they can preserve or restore the signal mask. Ordinary longjmp inside signal handlers can create subtle race conditions.',
    },
    {
      title: '5. Alternatives and Discipline',
      beginner:
        'Before using setjmp/longjmp, consider simpler patterns: return codes, goto cleanup inside a function, or centralized error handling helpers.',
      advanced:
        'setjmp/longjmp should be reserved for situations where error propagation through many layers is truly impractical. Modern C systems often combine error codes, cleanup labels, and structured ownership instead of pervasive non-local jumps.',
    },
  ],
  {
    title: 'Checkpoint Recovery Lab',
    intro:
      'This practical builds a controlled recovery checkpoint using setjmp and longjmp.',
    steps: [
      'Create a file named recovery.c.',
      'Add #include <stdio.h> and #include <setjmp.h> at the top.',
      'Declare a global or file-scope: static jmp_buf checkpoint;',
      'Write a function: void deep_operation(int fail) that prints progress.',
      'Inside deep_operation, if fail is true, call longjmp(checkpoint, 1);',
      'Write another function: void middle_layer(int fail) that calls deep_operation(fail);',
      'Inside main, declare: volatile int state = 0;',
      'Use if (setjmp(checkpoint) == 0) to enter the normal path.',
      'In the normal path, set state = 1 and call middle_layer(0).',
      'Then set state = 2 and call middle_layer(1) to trigger recovery.',
      'In the else branch, print that recovery occurred and inspect state.',
      'Compile with: gcc recovery.c -Wall -Wextra -o recovery',
      'Run the program and observe the jump back to main.',
    ],
    goal: 'You successfully implemented a non-local error recovery checkpoint and understood why volatile state and cleanup discipline are required.',
  },
  [
    q(
      'What does setjmp do?',
      [
        'It saves the current execution context for a later non-local jump',
        'It allocates heap memory',
        'It closes all files',
        'It creates a new thread',
      ],
      0,
      'setjmp stores execution context into a jmp_buf so that longjmp can return to that point later.'
    ),
    q(
      'What does longjmp do?',
      [
        'It jumps back to a previously saved setjmp context',
        'It deletes a variable',
        'It restarts the compiler',
        'It clears the terminal',
      ],
      0,
      'longjmp restores the saved context and transfers control back to the setjmp location, bypassing intermediate function returns.'
    ),
    q(
      'Why are resources not automatically cleaned up by longjmp?',
      [
        'Because C does not perform automatic stack unwinding with destructors',
        'Because longjmp deletes the heap',
        'Because setjmp closes all files automatically',
        'Because C has no functions',
      ],
      0,
      'Unlike exceptions in some languages, longjmp does not invoke cleanup logic automatically. The programmer must release resources explicitly.'
    ),
    q(
      'Why might a variable need volatile when using setjmp/longjmp?',
      [
        'To preserve its value correctly across the non-local jump',
        'To make it print faster',
        'To convert it into a pointer',
        'To make it global',
      ],
      0,
      'Variables modified between setjmp and longjmp may require volatile to avoid indeterminate values after the jump.'
    ),
    q(
      'What is a safer alternative for many C error-handling cases?',
      [
        'Return codes with cleanup labels or centralized error helpers',
        'Deleting the main function',
        'Using only global variables',
        'Disabling compiler warnings',
      ],
      0,
      'Structured error codes and cleanup patterns are often simpler and less dangerous than non-local jumps.'
    ),
  ],
  [
    'setjmp saves a recovery checkpoint.',
    'longjmp returns to that checkpoint from deep code.',
    'Non-local jumps bypass normal function returns.',
    'Use volatile for state that changes before longjmp.',
    'Prefer structured cleanup unless non-local jumps are truly needed.',
  ],
  'This lesson requires local GCC or Clang and careful terminal observation of non-local control flow.'
),

L(
  'cx-14',
  14,
  'Signals & Asynchronous Control',
  '📡',
  '📡 Signals are asynchronous notifications sent to a process by the operating system. They can indicate user interruption, segmentation faults, timer expiration, or termination requests. Expert C engineers must handle signals safely, because signal handlers run outside the normal flow of the program.',
  [
    {
      title: '1. What Signals Are',
      beginner:
        'A signal is a message sent to your program. For example, pressing Ctrl+C sends SIGINT, asking the program to stop. Your program can choose to ignore, handle, or default-handle many signals.',
      advanced:
        'Signals are software interrupts delivered asynchronously. They can arrive at almost any point during execution, which means signal safety requires careful design and minimal work inside handlers.',
    },
    {
      title: '2. Signal Handlers',
      beginner:
        'A signal handler is a function that runs when a signal arrives. You register it with the operating system so your code responds instead of using the default action.',
      advanced:
        'Handlers registered with sigaction are preferred over the older signal function because sigaction provides clearer semantics and portability. Handlers should be small, fast, and async-signal-safe.',
    },
    {
      title: '3. Async-Signal-Safe Functions',
      beginner:
        'Not every C function is safe inside a signal handler. Functions like printf or malloc may be in the middle of their own work when the signal arrives, causing corruption.',
      advanced:
        'Only async-signal-safe functions should be called from signal handlers. Common safe operations include writing with write, setting volatile sig_atomic_t flags, and exiting through _exit in limited cases.',
    },
    {
      title: '4. volatile sig_atomic_t Flags',
      beginner:
        'A common safe pattern is to set a flag inside the signal handler and check that flag in the main program loop.',
      advanced:
        'The type volatile sig_atomic_t is designed for variables accessed between signal handlers and normal code. It avoids data races for simple flag updates in many practical environments.',
    },
    {
      title: '5. Signal Masks and Race Control',
      beginner:
        'Sometimes you need to block signals temporarily while doing important work. This prevents the handler from interrupting at a bad moment.',
      advanced:
        'sigprocmask and related functions control signal masks. Expert code uses signal blocking to create critical sections and prevent races between signal delivery and normal execution.',
    },
  ],
  {
    title: 'Graceful SIGINT Handling Lab',
    intro:
      'This practical handles Ctrl+C gracefully using sigaction and a volatile flag.',
    steps: [
      'Create a file named signals.c.',
      'Add #include <stdio.h>, #include <stdlib.h>, #include <signal.h>, and #include <unistd.h> at the top.',
      'Declare: static volatile sig_atomic_t running = 1;',
      'Write a handler: void handle_sigint(int sig) { (void)sig; running = 0; }',
      'Inside main, create: struct sigaction sa;',
      'Zero the structure and set sa.sa_handler = handle_sigint;',
      'Use sigemptyset(&sa.sa_mask); and set sa.sa_flags = 0;',
      'Register with: sigaction(SIGINT, &sa, NULL);',
      'Print that the program is running and can be stopped with Ctrl+C.',
      'Use while (running) { sleep(1); }',
      'After the loop, print a clean shutdown message.',
      'Compile with: gcc signals.c -Wall -Wextra -o signals',
      'Run the program and press Ctrl+C to verify graceful termination.',
    ],
    goal: 'You successfully registered a signal handler, used a volatile sig_atomic_t flag, and implemented graceful shutdown behavior.',
  },
  [
    q(
      'What is a signal?',
      [
        'An asynchronous notification delivered to a process',
        'A type of loop',
        'A compiler flag',
        'A file extension',
      ],
      0,
      'Signals notify processes about events such as interruption, termination, invalid memory access, or timer expiration.'
    ),
    q(
      'Why should signal handlers be small and fast?',
      [
        'Because they run asynchronously and should avoid unsafe or slow operations',
        'Because they must print large logs',
        'Because they allocate large memory blocks',
        'Because they replace main',
      ],
      0,
      'Signal handlers interrupt normal execution. Doing too much work inside them can cause deadlocks, corruption, or undefined behavior.'
    ),
    q(
      'Which type is commonly used for flags shared between signal handlers and main code?',
      [
        'volatile sig_atomic_t',
        'double',
        'FILE pointer',
        'struct tm',
      ],
      0,
      'volatile sig_atomic_t is designed for simple atomic-style flag communication between signal handlers and normal execution.'
    ),
    q(
      'Why is printf usually unsafe inside a signal handler?',
      [
        'Because printf may not be async-signal-safe and can be interrupted while holding internal state',
        'Because printf cannot print numbers',
        'Because printf only works in main',
        'Because printf deletes output',
      ],
      0,
      'Many standard library functions are not async-signal-safe. Calling them from handlers can corrupt internal state or deadlock.'
    ),
    q(
      'Why is sigaction preferred over the older signal function?',
      [
        'It provides clearer, more portable signal registration behavior',
        'It makes signals disappear',
        'It converts C into C++',
        'It disables the operating system',
      ],
      0,
      'sigaction gives explicit control over handler behavior, signal masks, and flags, making it more reliable across platforms.'
    ),
  ],
  [
    'Signals are asynchronous process notifications.',
    'Handlers should be minimal and async-signal-safe.',
    'Use volatile sig_atomic_t flags for communication.',
    'Prefer sigaction for portable signal handling.',
    'Block signals carefully around critical sections.',
  ],
  'This lesson requires a local Unix-like terminal environment. Browser simulation is not sufficient.'
),

L(
  'cx-15',
  15,
  'Processes & System Calls',
  '🖥️',
  '🖥️ C is the language of operating systems. To master C, you must understand processes: how programs are created, how they execute new code, how they wait for children, and how they communicate with the kernel through system calls. This lesson moves you from writing programs to controlling program lifecycles.',
  [
    {
      title: '1. Process Concept',
      beginner:
        'A process is a running program. It has memory, an execution position, open files, and an identity called a process ID.',
      advanced:
        'A process is an operating system abstraction providing isolated address space, resource ownership, and scheduling state. Processes are the fundamental unit of isolation and execution in Unix-like systems.',
    },
    {
      title: '2. fork',
      beginner:
        'The fork system call creates a new process by copying the current process. The original is the parent, and the new one is the child.',
      advanced:
        'fork returns twice: once in the parent with the child PID, and once in the child with zero. Modern kernels use copy-on-write to avoid duplicating memory immediately.',
    },
    {
      title: '3. exec',
      beginner:
        'After creating a child process, you often want it to run a different program. The exec family of functions replaces the current process image with a new program.',
      advanced:
        'exec does not create a new process; it transforms the current process image. The combination of fork and exec is the classic Unix process creation pattern.',
    },
    {
      title: '4. wait and Exit Status',
      beginner:
        'A parent process can wait for its child to finish using wait. The parent can then inspect the child exit status.',
      advanced:
        'wait and waitpid provide child reaping and status inspection. Proper waiting prevents zombie processes and allows reliable orchestration of child tasks.',
    },
    {
      title: '5. System Calls vs Library Calls',
      beginner:
        'A system call asks the kernel to do something, like create a process or read a file. A library call is a function provided by a library, which may use one or more system calls internally.',
      advanced:
        'System calls cross the user-kernel boundary and have performance and security implications. Understanding the distinction helps explain error behavior, permissions, and performance characteristics.',
    },
  ],
  {
    title: 'Process Creation Lab',
    intro:
      'This practical creates a child process, runs a simple command in the child, and waits for completion in the parent.',
    steps: [
      'Create a file named process.c.',
      'Add #include <stdio.h>, #include <unistd.h>, #include <sys/wait.h>, and #include <stdlib.h> at the top.',
      'Inside main, print the current process ID using getpid().',
      'Call pid_t pid = fork();',
      'Check if pid < 0 and handle failure.',
      'In the child branch, print the child PID and parent PID.',
      'Replace the child program using execvp with a safe command such as echo and an argument array.',
      'In the parent branch, call wait(NULL) or waitpid to wait for the child.',
      'Print that the parent observed child completion.',
      'Compile with: gcc process.c -Wall -Wextra -o process',
      'Run the program and verify both parent and child behavior.',
      'Modify the exec command to test another simple program if desired.',
    ],
    goal: 'You successfully created a child process, used exec to replace the child program, and waited safely in the parent process.',
  },
  [
    q(
      'What does fork do?',
      [
        'It creates a new child process by copying the calling process',
        'It deletes a process',
        'It compiles source code',
        'It connects to the internet',
      ],
      0,
      'fork creates a new process that is initially a copy of the parent. The child receives zero from fork, while the parent receives the child PID.'
    ),
    q(
      'What does exec do?',
      [
        'It replaces the current process image with a new program',
        'It creates a new thread',
        'It closes all files',
        'It forks twice automatically',
      ],
      0,
      'exec loads and runs a new program inside the existing process. It does not return on success because the old program image is replaced.'
    ),
    q(
      'Why does fork return twice?',
      [
        'Because execution continues in both the parent and the child process',
        'Because it is a compiler bug',
        'Because the terminal is duplicated',
        'Because variables are copied twice',
      ],
      0,
      'fork creates a new execution context. Both parent and child continue from the fork call, but receive different return values.'
    ),
    q(
      'What is a zombie process?',
      [
        'A child process that has exited but whose status has not yet been collected by the parent',
        'A process that runs forever',
        'A process with no memory',
        'A process that cannot be created',
      ],
      0,
      'Zombies remain in the process table until the parent reads their exit status with wait or the system cleans them up.'
    ),
    q(
      'What is the difference between a system call and a library call?',
      [
        'A system call requests kernel services; a library call uses code provided by a library',
        'A system call is always faster',
        'A library call cannot use functions',
        'A system call only works in C++',
      ],
      0,
      'System calls cross into kernel mode. Library calls may wrap system calls or provide purely user-space functionality.'
    ),
  ],
  [
    'A process is a running program with its own resources.',
    'fork creates a child process.',
    'exec replaces the process image with a new program.',
    'wait prevents zombie processes.',
    'System calls interact directly with the kernel.',
  ],
  'This lesson requires a local Unix-like environment. Browser simulation cannot create real processes.'
),

L(
  'cx-16',
  16,
  'File Descriptors, select, poll, epoll',
  '📞',
  '📞 High-performance C systems do not block forever waiting for one input source. They monitor many file descriptors and react when data becomes ready. Understanding file descriptors and I/O multiplexing is essential for servers, event loops, network programming, and real-time systems.',
  [
    {
      title: '1. File Descriptors',
      beginner:
        'A file descriptor is a small integer that represents an open input or output source. It can refer to a file, pipe, socket, or device.',
      advanced:
        'In Unix-like systems, almost all I/O resources are represented as file descriptors. The kernel tracks them in a per-process descriptor table. Standard input, output, and error are descriptors 0, 1, and 2.',
    },
    {
      title: '2. Blocking vs Non-Blocking I/O',
      beginner:
        'Blocking I/O makes your program wait until data is available. Non-blocking I/O lets your program ask and continue if data is not ready yet.',
      advanced:
        'Non-blocking descriptors return errors like EAGAIN or EWOULDBLOCK when operations cannot proceed. Event loops combine non-blocking I/O with readiness notifications to avoid stalling.',
    },
    {
      title: '3. select',
      beginner:
        'select watches several file descriptors and tells you which ones are ready for reading, writing, or have exceptional conditions.',
      advanced:
        'select uses bitmasks and has a fixed descriptor limit on many systems. It modifies the masks to indicate readiness. Despite limitations, it is portable and historically important.',
    },
    {
      title: '4. poll',
      beginner:
        'poll improves on select by using an array of structures instead of bitmasks. You list the descriptors you care about and the events you want.',
      advanced:
        'poll scales better in readability and avoids some select limitations, but it still scans the descriptor list on each call. It is widely used and portable across Unix-like systems.',
    },
    {
      title: '5. epoll and Event-Driven Architecture',
      beginner:
        'epoll is a Linux-specific high-performance way to monitor many file descriptors. You register descriptors once and then wait for events efficiently.',
      advanced:
        'epoll supports level-triggered and edge-triggered notification modes. Edge-triggered mode requires careful non-blocking I/O and full-drain reading patterns. epoll is the foundation of many high-performance Linux servers.',
    },
  ],
  {
    title: 'Pipe Monitoring with poll Lab',
    intro:
      'This practical creates a pipe, writes to it, and uses poll to detect when data is ready to read.',
    steps: [
      'Create a file named multiplex.c.',
      'Add #include <stdio.h>, #include <unistd.h>, #include <poll.h>, and #include <string.h> at the top.',
      'Inside main, declare: int fds[2];',
      'Create a pipe: pipe(fds);',
      'Write data: write(fds[1], "ready", 5);',
      'Create: struct pollfd watched;',
      'Set watched.fd = fds[0]; watched.events = POLLIN; watched.revents = 0;',
      'Call poll(&watched, 1, 1000); to wait up to one second.',
      'Check if watched.revents & POLLIN is true.',
      'If ready, read from fds[0] into a buffer and print the received data.',
      'Close both pipe ends.',
      'Compile with: gcc multiplex.c -Wall -Wextra -o multiplex',
      'Run the program and observe readiness notification.',
    ],
    goal: 'You successfully used file descriptors, pipes, and poll to perform basic I/O multiplexing.',
  },
  [
    q(
      'What is a file descriptor?',
      [
        'An integer handle representing an open I/O resource',
        'A file name extension',
        'A compiler flag',
        'A type of pointer only',
      ],
      0,
      'File descriptors represent files, pipes, sockets, terminals, and other I/O resources inside a process.'
    ),
    q(
      'What does poll do?',
      [
        'It monitors multiple file descriptors and reports which ones are ready',
        'It deletes closed files',
        'It compiles multiple source files',
        'It creates threads automatically',
      ],
      0,
      'poll waits for events on a set of descriptors and returns readiness information through revents fields.'
    ),
    q(
      'What does non-blocking I/O mean?',
      [
        'The operation returns immediately if it cannot proceed',
        'The program exits instantly',
        'The file is locked permanently',
        'The terminal is disabled',
      ],
      0,
      'Non-blocking I/O allows programs to continue execution instead of waiting indefinitely for a resource.'
    ),
    q(
      'What is a major limitation of select?',
      [
        'It often has descriptor limits and uses bitmask manipulation',
        'It cannot read files',
        'It only works with keyboards',
        'It replaces the kernel',
      ],
      0,
      'select can be awkward to use and may have limited descriptor capacity depending on the system configuration.'
    ),
    q(
      'What makes epoll powerful on Linux?',
      [
        'It efficiently monitors many descriptors and supports edge-triggered event notification',
        'It removes the need for file descriptors',
        'It converts sockets into files automatically',
        'It disables blocking permanently',
      ],
      0,
      'epoll is designed for high-concurrency servers. It avoids repeated scanning and provides scalable readiness notification.'
    ),
  ],
  [
    'File descriptors are integer handles to I/O resources.',
    'Use non-blocking I/O for event-driven programs.',
    'select, poll, and epoll monitor descriptor readiness.',
    'poll is simpler and more scalable than select.',
    'epoll enables high-performance Linux event loops.',
  ],
  'This lesson requires a local Unix-like environment. Browser simulation cannot provide real file descriptors or I/O multiplexing.'
),

// C Expert Track — Part 3: cx-17 to cx-25

L(
  'cx-17',
  17,
  'Threads & pthreads',
  '🧵',
  '🧵 Threads allow a single process to execute multiple flows of control at the same time. They are essential for servers, real-time systems, user interfaces, and high-performance applications. But threads also introduce shared memory, race conditions, and lifecycle complexity. Expert C engineers must understand thread creation, joining, argument passing, and safe execution.',
  [
    {
      title: '1. Processes vs Threads',
      beginner:
        'A process is an independent running program with its own memory. A thread is a smaller execution flow inside a process. Threads share the same memory space, which makes communication fast but also dangerous if not controlled.',
      advanced:
        'Threads share address space, file descriptors, and process resources, but each thread has its own stack, registers, and program counter. This shared-state model makes threads efficient for concurrency but requires synchronization to avoid data races and undefined behavior.',
    },
    {
      title: '2. pthread_create and Thread Entry',
      beginner:
        'In POSIX C, you create a thread using pthread_create. The new thread starts by calling a function you provide. That function usually takes a void pointer argument and returns a void pointer result.',
      advanced:
        'The pthread API treats thread entry functions as generic callbacks. The void pointer argument allows passing structured data, but lifetime and ownership must be managed carefully. Passing the address of a stack variable that disappears before the thread reads it is a classic bug.',
    },
    {
      title: '3. pthread_join and Lifecycle Control',
      beginner:
        'When a thread finishes, you may want to wait for it and collect its result. pthread_join does this. It blocks the calling thread until the target thread exits.',
      advanced:
        'Joining also releases thread resources. A thread that is neither joined nor detached becomes a resource leak. Detached threads clean themselves up, but they cannot be joined and their result cannot be retrieved.',
    },
    {
      title: '4. Shared State and Race Conditions',
      beginner:
        'Because threads share memory, two threads can try to change the same variable at the same time. If you do not coordinate them, the final value can be wrong.',
      advanced:
        'Unsynchronized concurrent reads and writes create data races, which are undefined behavior in C. Compilers may optimize based on the assumption that data races do not exist. Correct concurrent code uses mutexes, atomics, or other synchronization primitives.',
    },
    {
      title: '5. Thread Argument Design',
      beginner:
        'A thread function can only receive one pointer argument. If you need to pass multiple values, you usually create a struct and pass its address.',
      advanced:
        'Thread argument structs must outlive thread startup. Common patterns include heap allocation with clear ownership, thread-local initialization, or passing indices into shared arrays. Expert code documents who owns the data and when it may be freed.',
    },
  ],
  {
    title: 'POSIX Thread Creation Lab',
    intro:
      'This practical creates multiple POSIX threads, passes structured arguments, joins them safely, and observes concurrent execution.',
    steps: [
      'Create a file named threads.c.',
      'Add #include <stdio.h>, #include <stdlib.h>, and #include <pthread.h> at the top.',
      'Define a struct: struct ThreadInfo { int id; int value; };',
      'Write a thread function: void *worker(void *arg). Cast arg to struct ThreadInfo *.',
      'Inside worker, print the thread id and value using printf.',
      'Return NULL from worker.',
      'Inside main, declare an array of struct ThreadInfo for three threads.',
      'Declare an array of pthread_t for three threads.',
      'Use pthread_create for each thread, passing &infos[i] as the argument.',
      'Use pthread_join for each thread to wait for completion.',
      'Compile with: gcc threads.c -pthread -Wall -Wextra -o threads',
      'Run the program and observe thread execution order.',
    ],
    goal: 'You successfully created POSIX threads, passed structured arguments, joined threads safely, and observed concurrent execution behavior.',
  },
  [
    q(
      'What is a major difference between threads and processes?',
      [
        'Threads share the same address space inside one process',
        'Threads cannot run at the same time',
        'Processes are always faster',
        'Threads do not use memory',
      ],
      0,
      'Threads exist inside a process and share its memory. Processes are isolated execution environments. Sharing memory makes threads powerful but also introduces synchronization responsibilities.'
    ),
    q(
      'What does pthread_create do?',
      [
        'It creates a new thread of execution inside the current process',
        'It creates a new process',
        'It opens a file',
        'It allocates heap memory',
      ],
      0,
      'pthread_create starts a new thread that runs a specified entry function. The new thread shares the process address space.'
    ),
    q(
      'What is the purpose of pthread_join?',
      [
        'It waits for a thread to finish and releases its resources',
        'It deletes a thread instantly',
        'It merges two executables',
        'It prevents compilation',
      ],
      0,
      'pthread_join blocks until the target thread exits. It also allows the caller to retrieve the thread return value and clean up thread resources.'
    ),
    q(
      'Why are race conditions dangerous in threaded C programs?',
      [
        'Because unsynchronized access to shared data can produce incorrect or undefined behavior',
        'Because threads cannot use variables',
        'Because race conditions delete files',
        'Because threads cannot print output',
      ],
      0,
      'When threads modify shared state without coordination, the result depends on timing. This can corrupt data and create undefined behavior.'
    ),
    q(
      'What is a common way to pass multiple values to a pthread function?',
      [
        'Use a struct and pass its address as the void pointer argument',
        'Use global macros only',
        'Pass multiple separate void pointers directly',
        'Use printf',
      ],
      0,
      'pthread entry functions accept one void pointer. A struct is commonly used to bundle multiple arguments into one coherent data object.'
    ),
  ],
  [
    'Threads share process memory but have separate stacks.',
    'Use pthread_create to launch threads.',
    'Use pthread_join to wait and clean up.',
    'Shared state requires synchronization.',
    'Thread argument lifetime must be managed carefully.',
  ],
  'This expert practical requires a local Unix-like environment with POSIX threads. Browser simulation is not sufficient.'
),

L(
  'cx-18',
  18,
  'Mutexes, Condition Variables & Thread Safety',
  '🔒',
  '🔒 Shared memory is powerful, but uncontrolled shared access destroys correctness. Mutexes provide mutual exclusion, allowing only one thread to enter a critical section at a time. Condition variables allow threads to wait for state changes. Together, they form the foundation of thread-safe C systems.',
  [
    {
      title: '1. Mutual Exclusion Basics',
      beginner:
        'A mutex is like a lock on a bathroom door. A thread locks the mutex before touching shared data and unlocks it after finishing. Other threads must wait until the lock is released.',
      advanced:
        'A mutex enforces atomicity for critical sections. Correct mutex usage requires consistent locking discipline, minimal lock scope, and careful ordering to avoid deadlock and priority inversion.',
    },
    {
      title: '2. pthread_mutex_lock and unlock',
      beginner:
        'You create a mutex, lock it before updating shared data, and unlock it when done. If another thread tries to lock the same mutex, it waits until the mutex is available.',
      advanced:
        'Mutexes can be normal, recursive, or error-checking depending on attributes. Recursive mutexes allow the same thread to lock multiple times, but they can hide design flaws. Most high-performance code prefers short, non-recursive critical sections.',
    },
    {
      title: '3. Deadlock',
      beginner:
        'Deadlock happens when two threads wait for each other forever. For example, thread one locks resource A and waits for B, while thread two locks B and waits for A.',
      advanced:
        'Deadlock prevention requires consistent lock acquisition order, lock timeouts, trylock patterns, or lock-free designs. Expert engineers analyze lock graphs and avoid nested locking whenever possible.',
    },
    {
      title: '4. Condition Variables',
      beginner:
        'Sometimes a thread must wait until something becomes true. A condition variable lets a thread sleep until another thread signals that the condition has changed.',
      advanced:
        'Condition variables must always be used with a mutex. The wait operation atomically releases the mutex and blocks. Spurious wakeups require checking the condition inside a loop, not with a simple if statement.',
    },
    {
      title: '5. Thread-Safe Design Patterns',
      beginner:
        'Thread-safe code protects shared state. You can protect data with mutexes, make data immutable, give each thread private data, or use queues to pass messages safely.',
      advanced:
        'Production thread-safe systems minimize shared mutable state. They use ownership boundaries, message passing, atomic operations, and bounded queues. Synchronization should be part of the architecture, not a patch added later.',
    },
  ],
  {
    title: 'Producer Consumer Queue Lab',
    intro:
      'This practical builds a thread-safe bounded buffer using mutexes and condition variables.',
    steps: [
      'Create a file named sync.c.',
      'Add #include <stdio.h>, #include <stdlib.h>, #include <pthread.h> at the top.',
      'Define a bounded buffer struct with an int array, capacity, count, and index variables.',
      'Create one pthread_mutex_t and two pthread_cond_t variables: not_full and not_empty.',
      'Write a producer thread function that inserts values into the buffer.',
      'Inside producer, lock the mutex, wait on not_full if buffer is full, add an item, signal not_empty, then unlock.',
      'Write a consumer thread function that removes values from the buffer.',
      'Inside consumer, lock the mutex, wait on not_empty if buffer is empty, remove an item, signal not_full, then unlock.',
      'Create one producer thread and one consumer thread.',
      'Join both threads.',
      'Destroy the mutex and condition variables.',
      'Compile with: gcc sync.c -pthread -Wall -Wextra -o sync',
      'Run the program and verify safe producer-consumer behavior.',
    ],
    goal: 'You successfully implemented mutual exclusion, condition waiting, signaling, and a thread-safe bounded buffer.',
  },
  [
    q(
      'What does a mutex protect?',
      [
        'A critical section of code that accesses shared state',
        'The keyboard',
        'The compiler',
        'The terminal window',
      ],
      0,
      'A mutex ensures only one thread can execute the protected section at a time, preventing data races on shared state.'
    ),
    q(
      'What is deadlock?',
      [
        'A situation where threads wait for each other forever',
        'A compiler error',
        'A file permission problem',
        'A type conversion bug',
      ],
      0,
      'Deadlock occurs when threads block each other due to circular waiting on locks or resources.'
    ),
    q(
      'Why should condition variable waits be placed inside a loop?',
      [
        'Because spurious wakeups and state changes require rechecking the condition',
        'Because loops make threads faster',
        'Because condition variables cannot be used once',
        'Because mutexes require loops',
      ],
      0,
      'A thread can wake up even if the condition is not truly satisfied. The condition must be checked again after waking.'
    ),
    q(
      'What is the relationship between condition variables and mutexes?',
      [
        'Condition variables must be used together with a mutex protecting the shared state',
        'Condition variables replace mutexes completely',
        'Mutexes are not needed with condition variables',
        'Condition variables only work with file I/O',
      ],
      0,
      'The mutex protects the state, while the condition variable coordinates waiting and signaling about that state.'
    ),
    q(
      'What is a good strategy to reduce deadlock risk?',
      [
        'Acquire multiple locks in a consistent global order',
        'Lock everything forever',
        'Avoid unlocking mutexes',
        'Use global variables without protection',
      ],
      0,
      'Consistent lock ordering prevents circular waiting. Minimizing lock scope and avoiding nested locks also reduces deadlock risk.'
    ),
  ],
  [
    'Mutexes protect shared mutable state.',
    'Always unlock mutexes on every exit path.',
    'Use condition variables for state-based waiting.',
    'Check conditions in loops after waking.',
    'Design systems to minimize shared mutable state.',
  ],
  'This expert practical requires a local Unix-like environment with POSIX threads.'
),

L(
  'cx-19',
  19,
  'Atomics & Memory Ordering',
  '⚛️',
  '⚛️ Modern CPUs and compilers reorder operations for performance. In single-threaded code this is usually invisible, but in multithreaded code it can cause surprising behavior. Atomics provide controlled concurrent operations and memory ordering guarantees. They are essential for lock-free structures, high-performance counters, and low-level synchronization.',
  [
    {
      title: '1. Data Races and Atomicity',
      beginner:
        'If two threads change the same value at the same time without synchronization, the result can be unpredictable. Atomic operations guarantee that certain reads and writes happen as one indivisible action.',
      advanced:
        'A data race is undefined behavior. C11 atomics provide atomic types and operations with defined concurrency semantics. Atomicity alone does not solve all ordering problems; memory order must also be considered.',
    },
    {
      title: '2. C11 Atomic Types and Operations',
      beginner:
        'C11 provides stdatomic.h. You can declare atomic int, atomic_bool, and other atomic types. Functions like atomic_load, atomic_store, and atomic_fetch_add operate safely across threads.',
      advanced:
        'C11 atomics expose both high-level convenience and explicit memory order control. atomic_fetch_add, atomic_exchange, and atomic_compare_exchange_strong are foundational building blocks for counters, flags, spinlocks, and lock-free algorithms.',
    },
    {
      title: '3. Memory Ordering Basics',
      beginner:
        'Memory ordering controls how operations appear to other threads. The simplest safe option is sequential consistency, but it can be slower. More advanced code uses weaker orders for performance.',
      advanced:
        'C11 defines memory_order_seq_cst, acquire, release, relaxed, acq_rel, and consume. Release-store and acquire-load form synchronization pairs. Relaxed ordering provides atomicity without ordering guarantees.',
    },
    {
      title: '4. Compare and Swap',
      beginner:
        'Compare-and-swap checks whether a value is still what you expect, and changes it only if it has not changed. This is useful for updating shared data without locking.',
      advanced:
        'atomic_compare_exchange_weak and strong support lock-free algorithms. Weak compare-exchange may fail spuriously and is usually used inside loops. Strong compare-exchange is simpler but may be less efficient on some platforms.',
    },
    {
      title: '5. Lock-Free vs Wait-Free vs Mutex',
      beginner:
        'Lock-free code uses atomic operations instead of mutexes. It can be faster, but it is harder to design correctly. Mutexes are simpler but can block threads.',
      advanced:
        'Lock-free means system-wide progress is guaranteed even if some threads stall. Wait-free is stronger and requires each thread to complete in bounded steps. Most practical C systems use mutexes unless profiling proves lock-free design is necessary.',
    },
  ],
  {
    title: 'Atomic Counter Lab',
    intro:
      'This practical compares unsafe counter behavior with atomic counter behavior using C11 atomics.',
    steps: [
      'Create a file named atomics.c.',
      'Add #include <stdio.h>, #include <stdlib.h>, #include <pthread.h>, and #include <stdatomic.h> at the top.',
      'Define a global atomic_int safe_counter;',
      'Define a global int unsafe_counter;',
      'Write a thread function that increments safe_counter using atomic_fetch_add.',
      'Also increment unsafe_counter without atomics to observe potential data race behavior.',
      'Create several threads, each performing many increments.',
      'Join all threads.',
      'Print both counters.',
      'Compile with: gcc atomics.c -pthread -std=c11 -Wall -Wextra -o atomics',
      'Run the program multiple times and compare the counters.',
      'Modify atomic_fetch_add to use memory_order_relaxed and observe that the atomic counter remains consistent for simple counting.',
    ],
    goal: 'You successfully used C11 atomic operations to build a thread-safe counter and understood why memory ordering matters.',
  },
  [
    q(
      'What is a data race?',
      [
        'Unsynchronized concurrent access to shared data where at least one access is a write',
        'A fast network connection',
        'A type of loop',
        'A compiler optimization flag',
      ],
      0,
      'A data race occurs when threads access the same memory concurrently without proper synchronization. It is undefined behavior in C.'
    ),
    q(
      'What header provides C11 atomics?',
      [
        'stdatomic.h',
        'string.h',
        'math.h',
        'ctype.h',
      ],
      0,
      'The stdatomic.h header defines atomic types and atomic operations in modern C.'
    ),
    q(
      'What does atomic_fetch_add do?',
      [
        'It atomically adds a value and returns the previous value',
        'It deletes a variable',
        'It locks a mutex',
        'It creates a thread',
      ],
      0,
      'atomic_fetch_add performs the addition as one atomic operation and returns the value before the addition.'
    ),
    q(
      'What is memory_order_relaxed useful for?',
      [
        'Atomicity without strong ordering guarantees',
        'File locking',
        'Network routing',
        'String formatting',
      ],
      0,
      'Relaxed ordering guarantees atomic access but does not create synchronization ordering between different memory locations.'
    ),
    q(
      'Why is lock-free programming difficult?',
      [
        'Because memory ordering, progress guarantees, and subtle race conditions must be proven carefully',
        'Because atomic operations are illegal in C',
        'Because lock-free code cannot use variables',
        'Because mutexes are always faster',
      ],
      0,
      'Lock-free algorithms require precise reasoning about atomicity, ordering, failure paths, and platform behavior.'
    ),
  ],
  [
    'Data races are undefined behavior.',
    'C11 atomics provide controlled concurrent operations.',
    'Atomicity and memory ordering are separate concerns.',
    'Use acquire-release pairs for synchronization.',
    'Prefer mutexes unless lock-free design is justified.',
  ],
  'This expert practical requires local GCC or Clang with C11 atomics support.'
),

L(
  'cx-20',
  20,
  'Sockets & Network Programming',
  '🌍',
  '🌍 Network programming turns C into a global systems language. Sockets allow programs to communicate across machines using TCP and UDP. Mastering sockets teaches you how the operating system, kernel, protocol stack, and application code work together. This is the foundation of servers, proxies, databases, game engines, and distributed systems.',
  [
    {
      title: '1. Socket Basics',
      beginner:
        'A socket is an endpoint for network communication. A server listens for connections, and a client connects to the server. TCP sockets provide reliable, ordered byte streams.',
      advanced:
        'A socket is a kernel object exposed through a file descriptor. TCP sockets provide stream semantics, flow control, congestion control, and reliable delivery. UDP sockets provide datagram semantics with lower overhead but no reliability guarantees.',
    },
    {
      title: '2. Server Lifecycle',
      beginner:
        'A TCP server creates a socket, binds it to an address and port, listens for connections, and accepts incoming clients. Each accepted connection gets its own descriptor.',
      advanced:
        'The server lifecycle includes socket, bind, listen, and accept. Accept blocks until a client connects unless non-blocking I/O is used. Production servers combine accept with event loops or thread pools.',
    },
    {
      title: '3. Client Lifecycle',
      beginner:
        'A TCP client creates a socket and connects to a server address. After the connection is established, it can send and receive data.',
      advanced:
        'Client connection involves DNS resolution, TCP handshake, and socket setup. Robust clients handle timeouts, partial writes, partial reads, and reconnection strategies.',
    },
    {
      title: '4. send, recv, and Partial Transfers',
      beginner:
        'Network communication uses send and recv. A common beginner mistake is assuming one send equals one complete message on the other side.',
      advanced:
        'TCP is a byte stream, not a message protocol. send and recv may transfer fewer bytes than requested. Professional code loops until the full payload is transferred or an error occurs.',
    },
    {
      title: '5. Application Protocol Design',
      beginner:
        'Since TCP sends bytes, both sides must agree on a protocol. For example, a request might be a line of text ending with a newline, and a response might begin with a status code.',
      advanced:
        'Robust protocols define framing, encoding, length prefixes, delimiters, timeouts, versioning, and error responses. Protocol design is as important as socket code.',
    },
  ],
  {
    title: 'TCP Echo Server Lab',
    intro:
      'This practical builds a simple TCP echo server and client that exchange text over a local socket.',
    steps: [
      'Create a file named server.c.',
      'Add #include <stdio.h>, #include <stdlib.h>, #include <string.h>, #include <unistd.h>, #include <arpa/inet.h>, and #include <sys/socket.h> at the top.',
      'Inside main, create a socket using socket(AF_INET, SOCK_STREAM, 0).',
      'Configure sockaddr_in with AF_INET, INADDR_ANY, and a port such as 8080.',
      'Bind the socket using bind.',
      'Listen using listen.',
      'Accept a client connection using accept.',
      'Read bytes with recv into a buffer.',
      'Send the same bytes back using send.',
      'Close the client and server descriptors.',
      'Create client.c that connects to 127.0.0.1:8080, sends a message, receives the reply, and prints it.',
      'Compile both: gcc server.c -Wall -Wextra -o server and gcc client.c -Wall -Wextra -o client',
      'Run the server in one terminal and the client in another terminal.',
    ],
    goal: 'You successfully built a TCP server and client, exchanged data over sockets, and understood stream-based network communication.',
  },
  [
    q(
      'What does a TCP socket provide?',
      [
        'A reliable ordered byte stream between two endpoints',
        'A guaranteed instant message object',
        'A file compression service',
        'A graphical interface',
      ],
      0,
      'TCP provides reliable, ordered delivery of a byte stream. It does not preserve message boundaries automatically.'
    ),
    q(
      'What system call prepares a server socket to receive connections?',
      [
        'listen',
        'printf',
        'malloc',
        'fork',
      ],
      0,
      'listen marks the socket as passive and prepares it to accept incoming connections.'
    ),
    q(
      'What does accept return in a TCP server?',
      [
        'A new socket descriptor for the connected client',
        'A file name',
        'A thread ID',
        'A process exit code',
      ],
      0,
      'accept creates a new connected socket for the client while the listening socket continues accepting more clients.'
    ),
    q(
      'Why must recv often be called in a loop?',
      [
        'Because TCP may deliver fewer bytes than requested in one call',
        'Because recv deletes data permanently',
        'Because sockets cannot be reused',
        'Because recv only works with UDP',
      ],
      0,
      'recv may return partial data due to network buffering and stream semantics. Application code must continue reading until the expected amount is received.'
    ),
    q(
      'What is framing in network programming?',
      [
        'Defining how bytes are grouped into complete application messages',
        'Encrypting packets',
        'Compressing files',
        'Drawing windows',
      ],
      0,
      'TCP streams bytes, so the application protocol must define message boundaries using delimiters, length prefixes, or other framing techniques.'
    ),
  ],
  [
    'Sockets are file descriptors for network I/O.',
    'TCP provides reliable byte streams.',
    'Servers use socket, bind, listen, accept.',
    'Always handle partial send and recv.',
    'Design clear application protocol framing.',
  ],
  'This expert practical requires a local Unix-like environment. Browser simulation cannot create real sockets.'
),

L(
  'cx-21',
  21,
  'Performance Profiling & Optimization',
  '⚡',
  '⚡ Fast code is not written by guessing. It is measured, analyzed, and improved with evidence. Performance engineering combines profiling, algorithmic thinking, cache awareness, and compiler behavior. Expert C developers optimize hot paths, not cold code, and they always verify improvements with real measurements.',
  [
    {
      title: '1. Measure Before Optimizing',
      beginner:
        'Before making code faster, you must find out what is slow. Profiling tools show where the program spends its time. This prevents wasting effort on code that does not matter.',
      advanced:
        'Premature optimization is dangerous because it can make code more complex without measurable benefit. Performance work begins with profiling, benchmarking, and identifying hot paths that dominate execution time.',
    },
    {
      title: '2. Timing and Profiling Tools',
      beginner:
        'Simple tools like time can show total execution duration. More advanced tools like perf, gprof, or Instruments show which functions consume CPU cycles.',
      advanced:
        'Sampling profilers collect stack traces at intervals and produce call graphs or flame graphs. Instrumentation profilers add measurement code during compilation. Each method has overhead and precision trade-offs.',
    },
    {
      title: '3. Algorithmic Complexity',
      beginner:
        'Sometimes code is slow because it uses a bad algorithm. Searching a list one by one can be much slower than using a better data structure.',
      advanced:
        'Big-O analysis reveals scaling behavior. An O(n squared) loop can dominate performance long before low-level tuning matters. Algorithmic improvement usually beats micro-optimization.',
    },
    {
      title: '4. Cache Locality and Memory Access',
      beginner:
        'Modern CPUs are much faster when data is close together. Arrays are often faster than linked lists because their elements are stored next to each other.',
      advanced:
        'Cache lines, prefetching, stride patterns, and false sharing affect performance. Data-oriented design organizes memory for sequential access, reducing cache misses and improving throughput.',
    },
    {
      title: '5. Optimization Discipline',
      beginner:
        'After changing code for speed, run the benchmark again. If the change did not help, revert it. Keep optimizations simple, tested, and explainable.',
      advanced:
        'Professional optimization uses version control, reproducible benchmarks, and statistical measurement. Compiler flags, input datasets, and system state must remain consistent during comparison.',
    },
  ],
  {
    title: 'Profiling & Cache Optimization Lab',
    intro:
      'This practical measures execution time, compares two loop patterns, and observes how memory access affects performance.',
    steps: [
      'Create a file named perf_lab.c.',
      'Add #include <stdio.h>, #include <stdlib.h>, #include <time.h> at the top.',
      'Allocate a large array using malloc, for example 10 million integers.',
      'Write a function that initializes the array sequentially.',
      'Write a function that accesses the array with a large stride, such as jumping by 16 elements.',
      'Use clock_gettime or clock to measure both functions.',
      'Compile with optimization: gcc perf_lab.c -O2 -Wall -Wextra -o perf_lab',
      'Run the program and compare timings.',
      'Optional on Linux: use perf stat ./perf_lab to inspect cache and cycle statistics.',
      'Modify array size and observe how timing changes.',
      'Analyze why sequential access is usually faster than strided access.',
    ],
    goal: 'You successfully measured performance, compared memory access patterns, and understood why cache locality matters.',
  },
  [
    q(
      'What should you do before optimizing code?',
      [
        'Measure and profile to find the real bottleneck',
        'Rewrite the entire program',
        'Add comments everywhere',
        'Increase font size',
      ],
      0,
      'Optimization without measurement is guesswork. Profiling identifies the code paths that actually dominate execution time.'
    ),
    q(
      'What does a sampling profiler do?',
      [
        'It periodically records where the program is executing to estimate hot paths',
        'It deletes slow functions',
        'It converts C to Python',
        'It prevents crashes',
      ],
      0,
      'Sampling profilers interrupt execution at intervals and collect stack traces, building a statistical view of CPU usage.'
    ),
    q(
      'Why are arrays often faster than linked lists for traversal?',
      [
        'Because arrays store elements contiguously, improving cache locality',
        'Because arrays use encryption',
        'Because linked lists cannot store integers',
        'Because arrays use threads',
      ],
      0,
      'Contiguous memory allows the CPU to prefetch data efficiently. Linked list nodes are often scattered, causing cache misses.'
    ),
    q(
      'What is a hot path?',
      [
        'A section of code that consumes a large portion of execution time',
        'A file that is too large',
        'A network cable',
        'A compiler warning',
      ],
      0,
      'Hot paths are the functions or loops where the program spends most of its time. They are the primary targets for optimization.'
    ),
    q(
      'Why should benchmarks be run multiple times?',
      [
        'To reduce the effect of noise and system variation',
        'To make the program larger',
        'To trigger undefined behavior',
        'To clear the terminal',
      ],
      0,
      'System load, cache state, and scheduling can affect timing. Multiple runs produce more reliable performance evidence.'
    ),
  ],
  [
    'Always profile before optimizing.',
    'Optimize hot paths first.',
    'Algorithm choice dominates performance.',
    'Cache locality is critical for modern CPUs.',
    'Verify optimizations with reproducible benchmarks.',
  ],
  'This lesson requires local GCC or Clang and preferably perf or another profiling tool.'
),

L(
  'cx-22',
  22,
  'Compiler Optimizations & Code Generation',
  '🏭',
  '🏭 The compiler is not just a translator. It is an optimizer that reshapes your code to run faster and smaller. Expert C engineers understand optimization levels, inlining, loop transformations, and how undefined behavior can change generated machine code. Reading assembly is a superpower for verifying what the compiler actually does.',
  [
    {
      title: '1. Optimization Levels',
      beginner:
        'Compilers offer optimization flags. -O0 disables optimization for debugging. -O1 does basic optimization. -O2 is commonly used for production. -O3 is more aggressive, and -Os optimizes for size.',
      advanced:
        'Higher optimization levels enable vectorization, inlining, loop unrolling, and interprocedural analysis. They can also amplify the effects of undefined behavior. Production builds should be tested under the same flags used for deployment.',
    },
    {
      title: '2. Inlining and Function Call Cost',
      beginner:
        'When a function is very small, the compiler may copy its body directly into the caller instead of generating a call. This is called inlining.',
      advanced:
        'Inlining removes call overhead and can expose further optimizations. Excessive inlining increases code size and instruction cache pressure. Compilers use heuristics and attributes such as inline and always_inline where appropriate.',
    },
    {
      title: '3. Loop Optimizations',
      beginner:
        'Compilers can improve loops by moving calculations outside them, combining loops, or processing multiple items at once.',
      advanced:
        'Common loop optimizations include loop-invariant code motion, strength reduction, unrolling, and vectorization. Vectorization uses SIMD instructions to operate on multiple data elements in one CPU instruction.',
    },
    {
      title: '4. Undefined Behavior and Optimization',
      beginner:
        'If your code contains undefined behavior, the compiler may produce surprising results. This is not a compiler bug; the C standard allows the compiler to assume undefined behavior does not happen.',
      advanced:
        'Optimizers exploit UB assumptions for range analysis, dead code elimination, and aliasing. Signed overflow checks may disappear, and invalid pointer comparisons may be transformed. Safe C code must eliminate UB before optimizing.',
    },
    {
      title: '5. Inspecting Generated Code',
      beginner:
        'You can ask the compiler to show assembly output instead of creating a final program. This helps you see what your C code became.',
      advanced:
        'Use -S to generate assembly, objdump to inspect binaries, and Compiler Explorer for interactive analysis. Expert engineers compare assembly across optimization levels to understand performance effects.',
    },
  ],
  {
    title: 'Assembly & Optimization Comparison Lab',
    intro:
      'This practical compiles the same C code with different optimization levels and inspects the generated assembly.',
    steps: [
      'Create a file named optimize.c.',
      'Add #include <stdio.h> at the top.',
      'Write a small function: int square(int x) { return x * x; }',
      'Write another function that sums squares in a loop over an array.',
      'Inside main, call the sum function and print the result.',
      'Compile with no optimization: gcc optimize.c -O0 -Wall -Wextra -o opt0',
      'Compile with production optimization: gcc optimize.c -O2 -Wall -Wextra -o opt2',
      'Generate assembly: gcc optimize.c -O2 -S -o optimize.s',
      'Open optimize.s and locate the square function.',
      'Observe whether square was inlined into the caller.',
      'Optional: compare -O2 and -O3 assembly output.',
      'Run both executables and compare behavior.',
    ],
    goal: 'You successfully observed compiler optimization behavior, inspected assembly output, and understood how optimization levels affect generated code.',
  },
  [
    q(
      'What does -O2 usually do?',
      [
        'Enables a common set of safe performance optimizations',
        'Deletes debug information',
        'Disables the compiler',
        'Converts C to Java',
      ],
      0,
      '-O2 enables many widely used optimizations while preserving expected behavior for valid C programs.'
    ),
    q(
      'What is function inlining?',
      [
        'Replacing a function call with the body of the function',
        'Renaming a variable',
        'Creating a new process',
        'Closing a file',
      ],
      0,
      'Inlining removes call overhead and can enable additional optimizations, but it may increase binary size.'
    ),
    q(
      'Why can undefined behavior make optimization surprising?',
      [
        'Because compilers may assume undefined behavior never happens and optimize based on that assumption',
        'Because compilers ignore all code',
        'Because undefined behavior only affects Python',
        'Because optimization is random',
      ],
      0,
      'Optimizers rely on the C abstract machine rules. If code violates those rules, generated behavior may differ from programmer expectations.'
    ),
    q(
      'What does vectorization do?',
      [
        'Uses CPU instructions that process multiple data elements at once',
        'Draws graphics automatically',
        'Creates virtual memory',
        'Encrypts arrays',
      ],
      0,
      'Vectorization uses SIMD instructions to improve throughput on suitable loops and data layouts.'
    ),
    q(
      'Which flag generates assembly output from C source?',
      [
        '-S',
        '-l',
        '-p',
        '-x',
      ],
      0,
      'The -S flag tells the compiler to stop after generating assembly code instead of producing an object file or executable.'
    ),
  ],
  [
    'Optimization levels control compiler transformation depth.',
    'Inlining can remove call overhead.',
    'Loops are major optimization targets.',
    'Undefined behavior can distort optimized code.',
    'Inspect assembly to verify compiler behavior.',
  ],
  'This lesson requires local GCC or Clang and a tool for viewing assembly output.'
),

L(
  'cx-23',
  23,
  'Secure C Coding & Exploit Prevention',
  '🛡️',
  '🛡️ C gives you power, but unsafe C code can become a security disaster. Buffer overflows, format string bugs, integer overflows, and use-after-free errors can allow attackers to control programs. Secure C engineering is about designing code that fails safely, validates input, and eliminates memory corruption.',
  [
    {
      title: '1. Buffer Overflow Basics',
      beginner:
        'A buffer overflow happens when a program writes more data into a memory region than it can hold. The extra data can overwrite nearby memory and change program behavior.',
      advanced:
        'Stack buffer overflows can corrupt return addresses and function pointers. Heap overflows can corrupt allocator metadata. Modern defenses include stack canaries, ASLR, DEP, and fortification, but secure coding remains essential.',
    },
    {
      title: '2. Unsafe String Functions',
      beginner:
        'Functions like gets and unbounded strcpy can copy too much data. Safer alternatives use explicit size limits, such as snprintf, strncat with care, or custom bounded copy functions.',
      advanced:
        'Classic unsafe APIs do not know the destination buffer size. Secure code uses bounded operations, tracks capacity explicitly, and treats all external input as potentially hostile.',
    },
    {
      title: '3. Format String Vulnerabilities',
      beginner:
        'Passing user input directly to printf as the format string is dangerous. An attacker can use format specifiers to read or write memory.',
      advanced:
        'Always use a constant format string, such as printf("%s", user_input), rather than printf(user_input). Format string bugs can leak stack data and corrupt memory through %n on vulnerable platforms.',
    },
    {
      title: '4. Integer Overflow and Bounds',
      beginner:
        'If a number becomes too large for its type, the program may wrap around or behave unexpectedly. This can cause incorrect buffer size calculations.',
      advanced:
        'Signed integer overflow is undefined behavior. Unsigned overflow wraps but can still create logic bugs. Secure code checks arithmetic bounds before allocation, indexing, and pointer arithmetic.',
    },
    {
      title: '5. Defensive Security Patterns',
      beginner:
        'Validate input. Limit sizes. Initialize memory. Check return values. Free memory once. Do not trust data from files, networks, or users.',
      advanced:
        'Defense in depth combines sanitizers, compiler hardening flags, static analysis, fuzzing, code review, and safe API design. Security is not a single tool; it is an engineering process.',
    },
  ],
  {
    title: 'Exploit Prevention Lab',
    intro:
      'This practical demonstrates unsafe buffer handling, safe bounded alternatives, and compiler hardening flags.',
    steps: [
      'Create a file named secure.c.',
      'Add #include <stdio.h> and #include <string.h> at the top.',
      'Write a function that uses snprintf to copy a string into a small buffer safely.',
      'Print the resulting string and its length.',
      'Write another function that validates input length before copying.',
      'Avoid gets completely and do not pass user input directly as a printf format string.',
      'Use printf("%s", buffer) when printing user-controlled text.',
      'Compile with hardening: gcc secure.c -Wall -Wextra -Werror -fstack-protector-all -D_FORTIFY_SOURCE=2 -o secure',
      'Run the program with normal input.',
      'Modify the test input to be longer than the buffer and verify that bounded logic prevents overflow.',
      'Optional: compile with -fsanitize=address and test invalid memory behavior safely.',
    ],
    goal: 'You successfully applied bounded string handling, input validation, and compiler hardening techniques to reduce memory corruption risk.',
  },
  [
    q(
      'What is a buffer overflow?',
      [
        'Writing more data into a buffer than it can safely hold',
        'A type of file compression',
        'A normal compiler warning',
        'A terminal color setting',
      ],
      0,
      'Buffer overflows corrupt adjacent memory and can cause crashes or exploitable behavior.'
    ),
    q(
      'Why is gets dangerous?',
      [
        'It has no way to limit the amount of input written to the buffer',
        'It is too slow',
        'It cannot read text',
        'It deletes files',
      ],
      0,
      'gets reads input without bounds checking and has been removed from modern C standards because it is inherently unsafe.'
    ),
    q(
      'Why is printf(user_input) unsafe?',
      [
        'Because user input may contain format specifiers that expose or corrupt memory',
        'Because printf cannot print variables',
        'Because user input is always empty',
        'Because printf only works with files',
      ],
      0,
      'User-controlled format strings can trigger format string vulnerabilities. Use printf("%s", user_input) instead.'
    ),
    q(
      'What does stack protector technology help detect or prevent?',
      [
        'Some stack buffer overflow attacks by inserting canary values',
        'All logic bugs',
        'Network latency',
        'File permission changes',
      ],
      0,
      'Stack canaries help detect corruption before a function returns, making some exploitation attempts harder.'
    ),
    q(
      'What is a secure habit when handling external input?',
      [
        'Validate length and treat all external data as untrusted',
        'Copy it directly into fixed buffers',
        'Ignore return values',
        'Assume input is always valid',
      ],
      0,
      'Secure C code validates input, enforces bounds, and checks return values. External data must never be trusted blindly.'
    ),
  ],
  [
    'Avoid unbounded string and memory functions.',
    'Use constant format strings with printf.',
    'Check arithmetic before allocation and indexing.',
    'Compile with warnings, sanitizers, and hardening flags.',
    'Treat all external input as hostile.',
  ],
  'This lesson requires local GCC or Clang with security and sanitizer support.'
),

L(
  'cx-24',
  24,
  'C FFI, Embedding & Interop',
  '🧪',
  '🧪 C is the universal interface language of modern software. Python, Ruby, Lua, Rust, Java, JavaScript runtimes, operating systems, and embedded platforms all communicate with C through foreign function interfaces. Understanding C ABI, shared libraries, and interop boundaries allows you to build components that work across languages and systems.',
  [
    {
      title: '1. The C ABI',
      beginner:
        'An ABI is the machine-level contract for how functions are called, how arguments are passed, and how data is laid out. C has a simple and widely supported ABI.',
      advanced:
        'The C ABI includes calling convention, register usage, stack alignment, type sizes, and struct layout. It is why C libraries can be consumed by many languages and platforms.',
    },
    {
      title: '2. Shared Libraries',
      beginner:
        'A shared library is a compiled piece of code that multiple programs can load and use. Instead of copying code into every executable, the system loads the library when needed.',
      advanced:
        'Shared libraries support dynamic linking and plugin systems. Symbol visibility, versioning, and stable interfaces are critical for maintaining compatibility over time.',
    },
    {
      title: '3. extern C and Language Interop',
      beginner:
        'When C++ code needs to expose functions to C, it uses extern C. This prevents C++ name mangling and keeps the function names simple for other languages.',
      advanced:
        'FFI boundaries often require extern C, opaque handles, primitive types, and explicit memory ownership. Passing complex language-specific objects across boundaries is unsafe.',
    },
    {
      title: '4. Dynamic Loading with dlopen',
      beginner:
        'A program can load a library at runtime using dlopen and find functions using dlsym. This is the basis of many plugin systems.',
      advanced:
        'Dynamic loading enables extensibility but requires careful error handling, symbol typing, and lifecycle management. Function pointers retrieved from dlsym must be cast to correct prototypes.',
    },
    {
      title: '5. Embedding C Components',
      beginner:
        'You can write a small C library and use it from another language. For example, Python can call C functions using ctypes or cffi.',
      advanced:
        'Embedding C requires designing a stable API: simple types, clear ownership, error codes, and no hidden runtime assumptions. Good C interop is minimal, explicit, and binary-safe.',
    },
  ],
  {
    title: 'Shared Library & Dynamic Loading Lab',
    intro:
      'This practical builds a shared C library and loads it dynamically from another C program.',
    steps: [
      'Create a file named mathlib.c.',
      'Add a simple function: int add(int a, int b) { return a + b; }',
      'Compile it as a shared library: gcc -shared -fPIC mathlib.c -o libmathlib.so',
      'Create a file named loader.c.',
      'Add #include <stdio.h> and #include <dlfcn.h> at the top.',
      'Use dlopen("./libmathlib.so", RTLD_NOW) to load the library.',
      'Check for NULL and print dlerror if loading fails.',
      'Use dlsym(handle, "add") and cast the result to int (*)(int, int).',
      'Call the loaded function and print the result.',
      'Use dlclose(handle) to unload the library.',
      'Compile the loader: gcc loader.c -ldl -Wall -Wextra -o loader',
      'Run the loader and verify that the dynamically loaded function works.',
    ],
    goal: 'You successfully built a shared library, loaded it at runtime, resolved a symbol dynamically, and called it through a function pointer.',
  },
  [
    q(
      'What is an ABI?',
      [
        'A binary-level contract for how compiled code interacts',
        'A text file format',
        'A Python module',
        'A type of loop',
      ],
      0,
      'An ABI defines low-level details such as calling conventions, data layout, and symbol behavior across compiled components.'
    ),
    q(
      'What does a shared library allow?',
      [
        'Code to be loaded and used by multiple programs dynamically',
        'Files to be compressed automatically',
        'The internet to run faster',
        'Compilers to disappear',
      ],
      0,
      'Shared libraries provide reusable compiled code that can be linked or loaded at runtime.'
    ),
    q(
      'What does dlopen do?',
      [
        'It loads a shared library at runtime',
        'It closes the terminal',
        'It creates a new thread',
        'It formats text',
      ],
      0,
      'dlopen loads a dynamic library and returns a handle that can be used to resolve symbols.'
    ),
    q(
      'What does dlsym return?',
      [
        'A symbol address that can be cast to a function pointer or object pointer',
        'A file descriptor',
        'A process ID',
        'A string length',
      ],
      0,
      'dlsym looks up a symbol by name inside a loaded library. The result must be cast to the correct type before use.'
    ),
    q(
      'Why is extern C important when exposing C functions from C++?',
      [
        'It prevents C++ name mangling and preserves C-compatible symbols',
        'It makes functions private',
        'It deletes unused variables',
        'It converts code to Python',
      ],
      0,
      'C++ may mangle function names to support overloading. extern C keeps symbol names compatible with C linkage.'
    ),
  ],
  [
    'C ABI is the foundation of cross-language interop.',
    'Shared libraries enable reusable and plugin-style components.',
    'Use extern C for C-compatible symbols.',
    'Dynamic loading uses dlopen and dlsym.',
    'Design FFI APIs with simple types and clear ownership.',
  ],
  'This lesson requires a local Unix-like environment with dynamic linking support.'
),

L(
  'cx-25',
  25,
  'Expert Capstone: Mini HTTP Server',
  '🎓',
  '🎓 This capstone proves that you have crossed from learning C into engineering C systems. You will combine sockets, I/O, processes or threads, memory safety, error handling, protocol parsing, and defensive design into one complete network server. This is the bridge to operating systems, proxies, databases, and high-performance backend engineering.',
  [
    {
      title: '1. Server Architecture',
      beginner:
        'A web server waits for clients, reads requests, and sends responses. The simplest version accepts one connection at a time, but real servers handle many clients efficiently.',
      advanced:
        'Server architecture choices include blocking single-threaded loops, thread-per-connection models, process pools, and event-driven I/O multiplexing. Each model has trade-offs in complexity, latency, memory, and throughput.',
    },
    {
      title: '2. HTTP Request Parsing',
      beginner:
        'An HTTP request begins with a request line, such as GET /path HTTP/1.1. After that come headers and sometimes a body. A minimal server needs to parse at least the method and path.',
      advanced:
        'Robust parsing requires framing, bounded buffers, state machines, invalid input handling, and protection against oversized or malicious requests. Never trust client input.',
    },
    {
      title: '3. HTTP Response Formatting',
      beginner:
        'An HTTP response starts with a status line, such as HTTP/1.1 200 OK. Then come headers like Content-Type and Content-Length, followed by the body.',
      advanced:
        'Correct responses require valid headers, accurate content length, connection handling, and consistent encoding. Logging responses supports debugging and monitoring.',
    },
    {
      title: '4. Concurrency and Robustness',
      beginner:
        'A server that handles only one client at a time can become blocked. You can improve it by creating a new thread or process for each connection.',
      advanced:
        'Production servers must handle partial reads, client disconnects, timeouts, resource cleanup, and graceful shutdown. Concurrency must be combined with synchronization or isolation.',
    },
    {
      title: '5. Security and Testing',
      beginner:
        'A server is exposed to hostile input. Limit request size, reject invalid paths, and avoid unsafe string handling.',
      advanced:
        'Security testing includes fuzzing, malformed request simulation, sanitizer builds, and permission checks. A professional server logs errors, closes resources deterministically, and fails safely.',
    },
  ],
  {
    title: 'Mini HTTP Server Build',
    intro:
      'This practical builds a minimal HTTP server that accepts connections, parses simple GET requests, and returns basic HTTP responses.',
    steps: [
      'Create a file named http_server.c.',
      'Add #include <stdio.h>, #include <stdlib.h>, #include <string.h>, #include <unistd.h>, #include <arpa/inet.h>, and #include <sys/socket.h> at the top.',
      'Create a TCP socket using socket(AF_INET, SOCK_STREAM, 0).',
      'Configure sockaddr_in to listen on 127.0.0.1 and port 8080.',
      'Bind and listen on the socket.',
      'Enter an accept loop that waits for client connections.',
      'For each accepted client, read request bytes with recv into a bounded buffer.',
      'Check whether the request begins with GET.',
      'If the request is valid, send an HTTP 200 response with Content-Type text/plain and a short body.',
      'If the request is invalid, send HTTP 400 Bad Request.',
      'Close the client socket after each response.',
      'Compile with: gcc http_server.c -Wall -Wextra -o http_server',
      'Run the server, then open a browser or use curl http://127.0.0.1:8080/ to test it.',
      'Test invalid input and verify the server responds safely.',
    ],
    goal: 'You successfully built a working HTTP server that combines sockets, protocol parsing, bounded I/O, and safe error handling.',
  },
  [
    q(
      'What does a minimal HTTP server need to do?',
      [
        'Accept connections, parse requests, and send responses',
        'Only print text to the terminal',
        'Compile other programs',
        'Replace the operating system',
      ],
      0,
      'A basic HTTP server listens for connections, reads request data, interprets it, and writes a valid HTTP response.'
    ),
    q(
      'Why must an HTTP server handle partial recv results?',
      [
        'Because TCP is a byte stream and data may arrive in pieces',
        'Because recv deletes data',
        'Because HTTP does not use bytes',
        'Because sockets cannot be closed',
      ],
      0,
      'TCP does not guarantee that one recv call returns a complete request. Server code must accumulate bytes until a full message is parsed.'
    ),
    q(
      'What should a server do when request input is too large?',
      [
        'Reject or close the connection safely instead of overflowing buffers',
        'Copy it into a small buffer anyway',
        'Ignore memory limits',
        'Restart the computer',
      ],
      0,
        'Bounded input handling prevents buffer overflow and denial-of-service risks. Servers must enforce limits.'
    ),
    q(
      'What is one way to handle multiple clients in a simple C server?',
      [
        'Create a thread or process per connection',
        'Close the server after one client',
        'Use only global variables',
        'Disable the network',
      ],
      0,
      'Thread-per-connection or process-per-connection models allow concurrent client handling, though event-driven designs can scale further.'
    ),
    q(
      'What is the most important security habit when building a network server?',
      [
        'Treat all client input as untrusted and validate it carefully',
        'Assume all clients are friendly',
        'Use gets for request parsing',
        'Ignore error codes',
      ],
      0,
      'Network servers are exposed to hostile input. Validation, bounded buffers, and safe error handling are mandatory.'
    ),
  ],
  [
    'Use sockets to build real network services.',
    'Parse protocols with bounded buffers.',
    'Send well-formed HTTP responses.',
    'Handle concurrency and cleanup carefully.',
    'Test servers with invalid and hostile input.',
  ],
  'This capstone requires a local Unix-like environment. Browser simulation cannot provide real sockets or server behavior.'
 )
];

export const getCExpertLessonById = (id: string): CExpertLesson | undefined =>
  C_EXPERT_LESSONS.find((lesson) => lesson.id === id);

export const isCExpertLessonUnlocked = (
  id: string,
  completedLessons: string[]
): boolean => {
  const index = C_EXPERT_LESSONS.findIndex((lesson) => lesson.id === id);

  if (index <= 0) return true;

  return completedLessons.includes(C_EXPERT_LESSONS[index - 1].id);
};
