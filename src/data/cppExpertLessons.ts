// =============================================================================
// C++ EXPERT TRACK 
// =============================================================================
import type { NetworkingLesson, Concept, QuizQuestion } from './networkingLessons';
export type CppLesson = NetworkingLesson;

const L = (
  id: string, order: number, title: string, icon: string, philosophy: string,
  concepts: Concept[], practical: CppLesson['practical'], quiz: QuizQuestion[],
  keyTakeaways: string[], terminalNotice?: string
): CppLesson => ({
  id, module: 'Module 1: C++ Expert Foundations', order, title, icon, philosophy,
  concepts, practical, quiz, keyTakeaways, terminalNotice,
});

const q = (question: string, options: string[], correctIndex: number, explanation?: string): QuizQuestion =>
  ({ question, options, correctIndex, explanation });

export const CPPX_LESSONS: CppLesson[] = [
  L(
    'cppx-01', 1, 'Memory Layout, Assembly & Executable Internals', '⚡',
    '⚡ True mastery of C++ begins where the compiler leaves off. Python and high-level languages isolate you from physical memory; expert C++ developers design systems around CPU caches, instruction pipelines, and OS memory management. Today you will dissect compiled machine code, inspect binary segment layouts, and learn how C++ maps directly onto raw hardware.',
    [
      {
        title: '1. The Memory Map of a Process',
        beginner: 'When your operating system runs a C++ program, it creates a special blueprint in memory. Text goes in one section, global data in another, your local variables live on the Stack, and dynamic requests live on the Heap.',
        advanced: 'A process virtual address space is partitioned into contiguous segments: `.text` (read-only machine instructions), `.rodata` (constants and literal strings), `.data` (initialized static/global variables), `.bss` (zero-initialized static/global variables), the Heap (dynamically allocated memory expanding upward), and the Stack (stack frames expanding downward). Understanding segment placement is essential for memory safety and binary optimization.'
      },
      {
        title: '2. From C++ Statements to Machine Instructions',
        beginner: 'Every line of C++ code you write gets turned into tiny CPU steps like "move number to box" or "add these two boxes". Looking at assembly lets you see what the CPU actually does.',
        advanced: 'Inspecting assembly output (`g++ -S -O2` or compiler-explorer/godbolt) reveals zero-cost abstractions, register allocation (`rax`, `rdi`), instruction-level parallelism, and vectorization. Writing cache-friendly, branch-predictable C++ requires inspecting how high-level constructs translate to ISA (x86-64 / ARM64) machine instructions.'
      },
      {
        title: '3. The Mechanics of the Call Stack & Stack Frames',
        beginner: 'When you call a function, the computer creates a small box in memory called a stack frame to hold that function\'s local variables. When the function finishes, the box is instantly wiped and reused.',
        advanced: 'Each function invocation pushes a Stack Frame containing argument registers/spills, return address, caller stack pointer, and local stack-allocated variables. Stack allocation is practically instantaneous—incrementing/decrementing the Stack Pointer register (`rsp`). Stack overflows occur when unbounded recursion or giant local arrays exceed the thread stack limit (~1-8MB).'
      },
      {
        title: '4. ABI, Name Mangling & The Linker Vector',
        beginner: 'Because C++ allows multiple functions with the same name (overloading), the compiler transforms function names into long secret codes so the linker never gets confused.',
        advanced: 'The Application Binary Interface (ABI) defines calling conventions, structure alignment rules, and symbol name mangling (e.g., `_Z3sumii`). Name mangling encodes namespace, class, and parameter type signatures into exported symbol tables, allowing function overloading at the binary level. Declaring `extern "C"` disables mangling for C compatibility.'
      },
      {
        title: '5. Microarchitectural Reality: Cache Lines & Alignment',
        beginner: 'CPUs don\'t read memory byte-by-byte; they fetch memory in small chunks called cache lines. Aligning your data properly helps the CPU read it significantly faster.',
        advanced: 'Modern CPUs fetch main memory into L1/L2/L3 caches in 64-byte blocks (cache lines). Misaligned data or poor data locality causes cache misses and false sharing across cores. Expert C++ developers use `alignas`, strict struct field ordering, and cache-aware structures to maximize IPC (Instructions Per Cycle).'
      }
    ],
    {
      title: 'Binary Dissection & Assembly Inspection',
      intro: '⚠️ This advanced practical will guide you through inspecting object files, reading generated assembly code, and analyzing ELF/PE executable headers.',
      steps: [
        'Create a file named `expert_mem.cpp` containing static variables, stack variables, heap allocations (`new int`), and a simple function.',
        'Emit readable assembly without running full optimization: `g++ -S -masm=intel -O1 expert_mem.cpp -o expert_mem.s`.',
        'Open `expert_mem.s` in your editor and locate your function name, register assignments, and stack adjustments (`sub rsp`).',
        'Compile to a binary: `g++ -O2 expert_mem.cpp -o expert_mem`.',
        'Inspect symbol tables using system binary tools (Linux/Mac: `nm expert_mem` or `objdump -t expert_mem`; Windows MSVC: `dumpbin /symbols expert_mem.exe`).',
        'Observe how function names are mangled in the symbol table and filter them using `c++filt` (e.g., `nm expert_mem | c++filt`).',
        'Modify a variable to use `alignas(64)` and inspect the assembly again to observe explicit alignment directives.'
      ],
      goal: 'You dissected C++ execution down to raw x86-64 assembly, verified segment organization, and decoded compiler symbol mangling.'
    },
    [
      q(
        'Which memory segment in a compiled C++ binary stores read-only string literals?',
        ['.bss segment', '.rodata segment', 'The Stack', 'The Heap'],
        1,
        'Constant string literals and read-only global data are stored in `.rodata`. **Why others are wrong:** `.bss` stores zero-initialized global/static data, the Stack stores local automatic variables, and the Heap is for dynamic runtime allocations.'
      ),
      q(
        'Why does C++ perform "name mangling" during translation?',
        ['To encrypt binary contents from reverse engineering', 'To encode namespaces, class scopes, and parameter signatures into unique symbol names', 'To speed up file downloads over network sockets', 'To allow Python scripts to run C++ binaries directly'],
        1,
        'Name mangling encodes parameter types and namespaces into linker symbol names to support function overloading and scoping at the binary level. **Why others are wrong:** Mangling is not security encryption, network optimization, or a Python integration mechanism.'
      ),
      q(
        'What hardware mechanism makes stack frame allocation virtually zero-cost compared to dynamic heap memory allocation?',
        ['Automatic garbage collection threads', 'Stack allocation only requires adjusting a single CPU stack pointer register (e.g., rsp)', 'The GPU handles stack memory in parallel', 'Stack memory is pre-downloaded from BIOS'],
        1,
        'Allocating stack memory simply increments or decrements the stack pointer register (`rsp`), taking a single CPU cycle. Heap allocation requires search algorithms and OS thread synchronization. **Why others are wrong:** C++ does not have garbage collection threads, GPUs do not manage function stack frames, and BIOS does not manage app memory.'
      ),
      q(
        'What is the purpose of the `extern "C"` directive in C++ header files?',
        ['It automatically converts C++ code into Python', 'It disables C++ name mangling, giving functions C linkage for binary compatibility', 'It allocates memory on the GPU', 'It forces all variables to be stored in the .text segment'],
        1,
        '`extern "C"` forces the C++ compiler to generate C-compatible linker symbols without name mangling. **Why others are wrong:** It has nothing to do with Python, GPU allocation, or forcing variables into instruction memory.'
      ),
      q(
        'What causes a CPU "cache miss" at the hardware level during data access?',
        ['When requested memory is not present in L1/L2/L3 cache lines and must be fetched from main RAM', 'When a variable has an invalid type signature', 'When the linker cannot locate a function implementation', 'When the operating system runs out of disk space'],
        0,
        'A cache miss occurs when the processor requests memory addresses not currently cached in low-latency L1/L2/L3 lines, forcing high-latency access to main system RAM. **Why others are wrong:** Type signatures are compile-time concepts, missing functions are linker errors, and disk space does not affect CPU CPU cache hits.'
      )
    ],
    [
      'Process memory is organized into .text, .rodata, .data, .bss, Stack, and Heap segments.',
      'Stack frames are managed via fast CPU register arithmetic; heap allocations require runtime memory management.',
      'C++ compiler name mangling enables function overloading at the binary linker level.',
      'extern "C" suppresses mangling to provide ABI compatibility with C interfaces.',
      'Hardware cache lines (64 bytes) and byte alignment directly dictate memory access latency and performance.'
    ],
    'For inspecting low-level assembly and binary headers, use GDB, LLDB, or Compiler Explorer (godbolt.org) alongside your terminal.'
  ),

  L(
  'cppx-02', 2, 'Custom Allocators & Memory Arenas', '🏟️',
  'Standard `new` and `delete` are too slow and unpredictable for high-performance engines. Calling the OS for every single object causes heap fragmentation and cache misses. Elite systems (game engines, HFT platforms) bypass the heap entirely, using Memory Arenas to allocate thousands of objects in O(1) time and free them all at once with a single pointer reset.',
  [
    {
      title: '1. The True Cost of `new`',
      beginner: 'Every time you use `new`, your program pauses to ask the Operating System for a tiny piece of RAM. Doing this millions of times creates "swiss cheese" memory (fragmentation), slowing down your CPU cache.',
      advanced: 'Global `new` invokes `malloc`, which requires thread-safe locking, block coalescing, and OS-level page faults. In latency-sensitive environments, this non-deterministic overhead is unacceptable. Custom allocators bypass the OS by requesting one massive contiguous block upfront and managing it locally.'
    },
    {
      title: '2. Bump (Linear) Allocators',
      beginner: 'Imagine a tape measure. To allocate memory, you just pull the tape out (move a pointer forward). To free EVERYTHING, you just snap the tape back to zero. It is instant and leaves no gaps!',
      advanced: 'A Bump Allocator maintains a single `current_ptr` and an `end_ptr`. Allocation is literally `ptr += size; return ptr;` (O(1) with zero branching). Deallocation is a no-op; the entire arena is freed by resetting `current_ptr` to the base address. Perfect for frame-scoped data or parsing trees.'
    },
    {
      title: '3. Pool Allocators',
      beginner: 'If you are spawning 10,000 identical bullets or particles, a Pool Allocator pre-slices a giant block of RAM into 10,000 equal-sized slots. When you need a bullet, you grab a free slot. When it dies, you put it back.',
      advanced: 'Pool allocators eliminate fragmentation for fixed-size objects. They typically use an embedded free-list (storing the index of the next free block inside the unused memory itself). Allocation and deallocation are strictly O(1) and guarantee perfect CPU cache locality for arrays of entities.'
    },
    {
      title: '4. Stack (LIFO) Allocators',
      beginner: 'Sometimes you need to free memory in the exact reverse order you created it (Last-In, First-Out). A Stack Allocator lets you push memory, and then "pop" it back, exactly like the call stack.',
      advanced: 'Stack allocators track a `top` pointer. They are ideal for recursive algorithms, command buffers, or temporary scratchpads. You can save a "marker" (the current pointer state) and later roll back to that marker, instantly freeing all allocations made after that point.'
    },
    {
      title: '5. STL Allocator Traits (Expert Teaser)',
      beginner: 'You can actually tell standard C++ containers like `std::vector` to stop using the normal heap and start using YOUR custom arena instead!',
      advanced: '*(Pro Track Preview)* By implementing the C++17 `std::pmr::memory_resource` interface or custom `allocator_traits`, you can inject Bump or Pool allocators directly into STL containers. The Expert track covers building a polymorphic allocator that routes memory based on runtime scope tags.'
    }
  ],
  {
    title: 'Building a Zero-Fragmentation Bump Allocator',
    intro: 'We will write a custom Bump Allocator from scratch, proving that we can allocate millions of objects with zero OS overhead and free them all in a single CPU cycle.',
    steps: [
      'Create `arena.cpp` and include `<iostream>`, `<vector>`, and `<cstddef>`.',
      'Define the arena: `class BumpAllocator { uint8_t* buffer; size_t capacity; size_t offset = 0; public: BumpAllocator(size_t size) : capacity(size) { buffer = new uint8_t[size]; } ~BumpAllocator() { delete[] buffer; } }`.',
      'Add the O(1) allocation method: `void* allocate(size_t size, size_t align = 8) { size_t aligned_offset = (offset + align - 1) & ~(align - 1); if (aligned_offset + size > capacity) return nullptr; void* ptr = buffer + aligned_offset; offset = aligned_offset + size; return ptr; }`.',
      'Add the instant reset method: `void reset() { offset = 0; }`.',
      'In `main()`, instantiate a 1GB arena: `BumpAllocator arena(1024 * 1024 * 1024);`.',
      'Run a loop allocating 10 million `int` pointers using `arena.allocate(sizeof(int))`. Measure the time with `<chrono>`. It will take fractions of a millisecond.',
      'Call `arena.reset()`. The entire gigabyte of memory is instantly "freed" without a single `delete` call.'
    ],
    goal: 'You bypassed the OS heap and engineered a deterministic, zero-fragmentation memory arena capable of O(1) bulk deallocation.'
  },
  [
    q('Why is a Bump (Linear) Allocator considered O(1) for allocation?', ['It uses a hash table to find empty slots', 'It simply increments a pointer by the requested byte size, requiring zero searching or branching', 'It asks the OS for a new page every time', 'It uses a binary search tree'], 1, 'Bump allocation is pure pointer arithmetic. There are no free-lists to traverse or locks to acquire; it is the fastest possible allocation strategy. **Why others are wrong:** Hash tables, OS calls, and trees introduce O(log n) or O(1)-with-high-overhead complexities.'),
    q('How does a Pool Allocator typically track which memory blocks are free without using extra RAM?', ['It stores a separate boolean array', 'It embeds a "next free" pointer directly inside the unused memory of the free blocks themselves (Intrusive Free List)', 'It asks the CPU cache', 'It uses a global database'], 1, 'Because the block is currently unused, its memory can safely be overwritten to store the index or pointer to the next available free block, consuming zero overhead. **Why others are wrong:** External arrays waste memory and cache locality; CPUs and databases are irrelevant.'),
    q('What is the primary weakness of a Bump Allocator?', ['It is too slow', 'It cannot free individual objects; memory is only reclaimed when the entire arena is reset', 'It causes heap fragmentation', 'It only works on Linux'], 1, 'Bump allocators do not support individual `free()` operations. If you allocate 100 objects and only want to delete the 5th one, you cannot. You must wait until the entire scope ends and reset the arena. **Why others are wrong:** It is incredibly fast, prevents fragmentation, and is OS-agnostic.'),
    q('What does "Memory Fragmentation" cause in a long-running application?', ['The code compiles slower', 'The heap becomes "swiss cheese", causing the OS to allocate new pages and destroying CPU cache locality', 'The CPU fan stops working', 'Variables change their data types'], 1, 'Fragmentation leaves small, unusable gaps between allocated blocks. Eventually, the OS must map new virtual pages, scattering data across physical RAM and causing massive cache misses. **Why others are wrong:** It affects runtime memory layout, not compilation, hardware fans, or types.'),
    q('Which C++ standard library feature allows you to inject custom allocators into standard containers like `std::vector`?', ['`std::unique_ptr`', '`std::pmr::memory_resource` (Polymorphic Allocator)', '`std::thread`', '`std::mutex`'], 1, 'Introduced in C++17, `std::pmr` (Polymorphic Memory Resources) allows containers to accept custom memory arenas via a standardized interface, decoupling data structures from the global heap. **Why others are wrong:** Smart pointers, threads, and mutexes do not manage container allocation strategies.')
  ],
  [
    'Global `new`/`delete` causes non-deterministic latency and heap fragmentation.',
    'Bump Allocators provide O(1) allocation via pointer arithmetic and O(1) bulk deallocation via pointer reset.',
    'Pool Allocators use intrusive free-lists to manage fixed-size objects with zero fragmentation.',
    'Stack (LIFO) Allocators are perfect for frame-scoped scratchpads and command buffers.',
    'C++17 `std::pmr` allows you to inject custom arenas directly into STL containers.'
  ],
  '🖥️ **Terminal Notice:** If you want to use a big terminal on your own computer instead of the built-in one, please read Lesson 1 for the full setup instructions.\n'
),
L(
  'cppx-03', 3, 'Lock-Free Concurrency & Memory Ordering', '⚛️',
  'Mutexes cause thread contention, context-switching, and priority inversion. True elite concurrency uses atomic operations and lock-free data structures. But hardware is not sequentially consistent—CPUs reorder instructions and cache lines. To write lock-free code, you must master the C++ Memory Model and Acquire/Release semantics.',
  [
    {
      title: '1. Hardware Atomics & CAS',
      beginner: 'If two threads try to add `+1` to a counter at the exact same microsecond, one update is lost. Atomics use special CPU instructions (like Compare-And-Swap) to guarantee the math happens in one indivisible step.',
      advanced: '`std::atomic<T>` compiles down to hardware lock-prefixed instructions (e.g., `lock xadd` on x86) or Load-Link/Store-Conditional (LL/SC) on ARM. The Compare-And-Swap (CAS) operation is the fundamental building block of all lock-free algorithms, allowing threads to safely update state without mutexes.'
    },
    {
      title: '2. The Illusion of Sequential Consistency',
      beginner: 'You write code line-by-line, but your CPU and compiler aggressively shuffle those lines to run faster. In a multi-core system, Thread B might see Thread A\'s updates in a completely different order than you wrote them!',
      advanced: 'CPUs utilize Store Buffers and Cache Coherence protocols (MESI). Without explicit memory barriers, the compiler and CPU will reorder independent reads/writes (Instruction-Level Parallelism). This causes "torn reads" and invisible race conditions that only manifest under heavy production load.'
    },
    {
      title: '3. Memory Orders (Acquire/Release)',
      beginner: 'To stop the CPU from shuffling your code, you use "Memory Orders". `memory_order_release` tells the CPU: "Do not move any writes below this line." `memory_order_acquire` says: "Do not move any reads above this line."',
      advanced: 'Acquire/Release semantics establish a "happens-before" relationship across threads without the massive performance penalty of `memory_order_seq_cst` (Sequential Consistency). Release stores flush the store buffer; Acquire loads invalidate stale cache lines, ensuring safe publication of non-atomic data.'
    },
    {
      title: '4. The ABA Problem',
      beginner: 'Imagine a thread reads a value "A", gets paused, another thread changes it to "B" and back to "A". The first thread wakes up, sees "A", and thinks nothing changed—but the underlying state is completely corrupted!',
      advanced: 'The ABA problem plagues lock-free CAS loops. It is solved using "Tagged Pointers" (packing a monotonically increasing counter into the unused upper bits of a 64-bit pointer) or Hazard Pointers, ensuring that even if the memory address is reused, the version tag will fail the CAS check.'
    },
    {
      title: '5. Lock-Free Queues (Expert Teaser)',
      beginner: 'You can build queues that thousands of threads can push and pull from simultaneously without a single lock, keeping your server responsive under extreme load.',
      advanced: '*(Pro Track Preview)* The Michael-Scott lock-free queue uses CAS on head/tail pointers and requires careful memory reclamation (like Epoch-Based Reclamation or RCU) to prevent Use-After-Free bugs when threads read nodes that another thread is trying to delete.'
    }
  ],
  {
    title: 'The Lock-Free SPSC Ring Buffer',
    intro: 'We will build a Single-Producer Single-Consumer (SPSC) Ring Buffer using raw atomics and Acquire/Release semantics, achieving zero-lock thread communication.',
    steps: [
      'Create `spsc.cpp` and include `<iostream>`, `<atomic>`, `<thread>`, and `<vector>`.',
      'Define the buffer: `template<typename T, size_t Size> class SPSCQueue { std::atomic<size_t> head{0}; std::atomic<size_t> tail{0}; T buffer[Size]; }`.',
      'Write the push method (Producer): `bool push(const T& item) { size_t current = head.load(std::memory_order_relaxed); size_t next = (current + 1) % Size; if (next == tail.load(std::memory_order_acquire)) return false; buffer[current] = item; head.store(next, std::memory_order_release); return true; }`.',
      'Write the pop method (Consumer): `bool pop(T& item) { size_t current = tail.load(std::memory_order_relaxed); if (current == head.load(std::memory_order_acquire)) return false; item = buffer[current]; tail.store((current + 1) % Size, std::memory_order_release); return true; }`.',
      'In `main()`, launch a producer thread pushing 10 million integers, and a consumer thread popping and summing them.',
      'Run it. Notice the CPU usage is perfectly split, and there are zero mutex locks or context switches.'
    ],
    goal: 'You engineered a lock-free concurrent data structure using hardware atomics and Acquire/Release memory barriers to guarantee safe cross-thread publication.'
  },
  [
    q('What does the Compare-And-Swap (CAS) hardware instruction do?', ['It swaps two variables in memory', 'It atomically compares a memory location to an expected value, and if they match, replaces it with a new value in a single indivisible step', 'It locks a mutex', 'It compresses data'], 1, 'CAS is the foundation of lock-free programming. It allows a thread to optimistically update state, failing safely if another thread modified the memory in the meantime. **Why others are wrong:** It does not swap variables, use OS mutexes, or compress data.'),
    q('Why is `memory_order_seq_cst` generally avoided in high-performance lock-free code?', ['It causes syntax errors', 'It forces a global memory fence across all CPU cores, destroying instruction-level parallelism and cache performance', 'It deletes variables', 'It only works on single-core machines'], 1, 'Sequential Consistency requires expensive hardware barriers to ensure a single global modification order for all threads. Acquire/Release provides the necessary safety for publication patterns with vastly superior performance. **Why others are wrong:** It is valid syntax, preserves data, and works on multi-core (but slowly).'),
    q('What is the "ABA Problem" in lock-free programming?', ['When a variable name is too short', 'When a CAS operation succeeds because a value changed from A to B and back to A, masking the fact that the underlying resource was freed and reallocated', 'When the compiler optimizes away a loop', 'When a thread crashes'], 1, 'ABA occurs when a pointer is freed, reallocated at the exact same address, and passed back. The CAS sees the same address and succeeds, leading to catastrophic Use-After-Free or state corruption. **Why others are wrong:** It is strictly a concurrency/state-tracking hazard.'),
    q('In an Acquire/Release pattern, what does `memory_order_release` guarantee on a store operation?', ['That the program will crash if it fails', 'That all prior memory writes (atomic and non-atomic) are visible to any thread that performs an Acquire load on the same atomic variable', 'That the CPU will sleep', 'That the variable is deleted'], 1, 'Release semantics prevent the compiler and CPU from reordering prior writes past the store, and flush the store buffer, ensuring safe publication of payload data to the acquiring thread. **Why others are wrong:** It does not cause crashes, sleep threads, or delete variables.'),
    q('Why are SPSC (Single-Producer Single-Consumer) queues significantly faster than MPMC (Multi-Producer Multi-Consumer) queues?', ['SPSC queues use less RAM', 'SPSC queues can use simple atomic loads/stores with Acquire/Release, while MPMC requires heavy CAS loops and contention on both head and tail pointers', 'SPSC queues run on the GPU', 'MPMC queues are illegal in C++'], 1, 'With only one writer and one reader, head and tail pointers are exclusively owned, eliminating the need for CAS retry loops and drastically reducing cache-line bouncing (False Sharing). **Why others are wrong:** RAM usage is similar, GPUs are irrelevant, and MPMC is perfectly legal.')
  ],
  [
    'std::atomic compiles to hardware lock-free instructions (CAS, LL/SC).',
    'CPUs and compilers reorder instructions; Memory Orders enforce execution boundaries.',
    'Acquire/Release semantics establish cross-thread "happens-before" relationships without global fences.',
    'The ABA problem masks memory reuse; solve it with tagged pointers or hazard pointers.',
    'SPSC ring buffers achieve zero-lock, zero-contention thread communication.'
  ],
  '🖥️ **Terminal Notice:** If you want to use a big terminal on your own computer instead of the built-in one, please read Lesson 1 for the full setup instructions.\n'
),
L(
  'cppx-04', 4, 'SIMD, Vectorization & Intrinsics', '🚀',
  'Your CPU has specialized 256-bit and 512-bit registers that can process 8 or 16 numbers in a single clock cycle. Standard C++ loops often fail to use them. SIMD (Single Instruction, Multiple Data) is the secret to crushing math-heavy workloads, physics engines, and audio processing pipelines.',
  [
    {
      title: '1. What is SIMD?',
      beginner: 'Instead of adding two numbers together one by one, SIMD lets you put 8 numbers in a giant "wide" register, and add them to another 8 numbers all at the exact same time. One instruction, eight results!',
      advanced: 'SIMD (Single Instruction, Multiple Data) leverages wide vector registers (SSE=128-bit, AVX2=256-bit, AVX-512=512-bit). A single `_mm256_add_ps` instruction executes 8 single-precision float additions simultaneously, yielding theoretical 8x throughput improvements for data-parallel tasks.'
    },
    {
      title: '2. Auto-Vectorization',
      beginner: 'Modern compilers are smart. If you write a clean, simple `for` loop that adds arrays together, the compiler will secretly translate it into SIMD instructions for you behind the scenes!',
      advanced: 'Compilers (GCC/Clang/MSVC) attempt auto-vectorization at `-O2` and `-O3`. However, it is incredibly fragile: pointer aliasing, non-contiguous memory strides, and complex branching will silently force the compiler to fall back to scalar (SISD) execution. `#pragma omp simd` or `__restrict` can force the compiler\'s hand.'
    },
    {
      title: '3. Explicit Intrinsics',
      beginner: 'When the compiler fails to auto-vectorize, you can write SIMD code directly using "Intrinsics"—special C++ functions that map exactly to one CPU assembly instruction.',
      advanced: 'Intrinsics (`<immintrin.h>`) like `_mm256_loadu_ps` (load unaligned) and `_mm256_mul_ps` (multiply) give you absolute control over the vector pipeline. While highly performant, they are architecture-specific (x86 vs ARM NEON) and require manual loop unrolling and tail-handling.'
    },
    {
      title: '4. Data Layout: AoS vs SoA',
      beginner: 'If you have a list of 3D Vectors (X, Y, Z), storing them as `Vector3 {x, y, z}` is bad for SIMD. You must rearrange your data into an Array of Structs (SoA): one giant array of all X\'s, one of all Y\'s, one of all Z\'s.',
      advanced: 'Structure of Arrays (SoA) enables contiguous memory loads into SIMD registers. AoS (Array of Structures) requires expensive "gather/scatter" instructions or costly "shuffle/permute" operations to de-interleave the X, Y, and Z components before math can occur.'
    },
    {
      title: '5. FMA & Math Pipelines (Expert Teaser)',
      beginner: 'Some CPUs can multiply two numbers and add a third number in the exact same step, without rounding errors in between!',
      advanced: '*(Pro Track Preview)* Fused Multiply-Add (FMA) instructions (`_mm256_fmadd_ps`) execute `a * b + c` in a single cycle with a single rounding step, doubling throughput and vastly improving numerical precision for dot products and matrix multiplications.'
    }
  ],
  {
    title: 'SIMD Array Multiplication & Assembly Inspection',
    intro: 'We will write a scalar array multiplier, force the compiler to auto-vectorize it, and then write explicit AVX2 intrinsics to guarantee maximum hardware utilization.',
    steps: [
      'Create `simd.cpp` and include `<iostream>`, `<vector>`, `<immintrin.h>`, and `<chrono>`.',
      'Write a standard scalar loop: `void multiply_scalar(float* a, float* b, float* out, size_t n) { for(size_t i=0; i<n; ++i) out[i] = a[i] * b[i]; }`.',
      'Write the explicit AVX2 intrinsic version: `void multiply_avx(float* a, float* b, float* out, size_t n) { for(size_t i=0; i<n; i+=8) { __m256 va = _mm256_loadu_ps(&a[i]); __m256 vb = _mm256_loadu_ps(&b[i]); __m256 vr = _mm256_mul_ps(va, vb); _mm256_storeu_ps(&out[i], vr); } }`.',
      'In `main()`, allocate three `std::vector<float>` of size 100,000,000.',
      'Time the scalar version. Then time the AVX version. Expect the AVX version to be 4x to 8x faster.',
      'Compile with `g++ -O3 -mavx2 simd.cpp`. Use `objdump -d` or Compiler Explorer to inspect the assembly and verify the `vmulps` (Vector Multiply Packed Single) instruction is present.'
    ],
    goal: 'You bypassed scalar execution limits, utilized explicit AVX2 intrinsics to process 8 floats per cycle, and verified hardware vectorization at the assembly level.'
  },
  [
    q('What does SIMD stand for?', ['Single Instruction, Multiple Data', 'System Integration Memory Device', 'Sequential Instruction Main Data', 'Standard Integer Math Division'], 0, 'SIMD allows a single CPU instruction to operate on multiple data points simultaneously using wide vector registers. **Why others are wrong:** The other options are fabricated acronyms.'),
    q('Why is Structure of Arrays (SoA) generally preferred over Array of Structures (AoS) for SIMD math?', ['SoA uses less RAM', 'SoA stores identical components (e.g., all X coordinates) contiguously, allowing the CPU to load them directly into SIMD registers without expensive shuffle/permute instructions', 'SoA is easier to read for beginners', 'AoS causes memory leaks'], 1, 'SIMD registers require homogeneous data. AoS interleaves data (X,Y,Z, X,Y,Z), forcing the CPU to waste cycles extracting the X\'s. SoA groups them (X,X,X, Y,Y,Y), enabling direct vector loads. **Why others are wrong:** RAM usage is identical, readability is subjective, and AoS does not leak memory.'),
    q('What is the primary danger of relying entirely on compiler "Auto-Vectorization"?', ['It makes the code run slower than scalar code', 'It is highly fragile; pointer aliasing, complex branching, or unknown memory strides will silently cause the compiler to fall back to slow scalar execution', 'It deletes the source code', 'It only works on Mac'], 1, 'Compilers must mathematically prove that memory regions do not overlap (alias) and that loops are safe to parallelize. If they cannot prove it, they silently emit scalar code, destroying expected performance. **Why others are wrong:** It never makes code slower than scalar, does not delete code, and is cross-platform.'),
    q('Which header file must be included to use x86 AVX2 SIMD intrinsics in C++?', ['<vector>', '<immintrin.h>', '<simd.h>', '<math.h>'], 1, '`<immintrin.h>` is the master header for all Intel/AMD x86 intrinsic instruction sets (SSE, AVX, AVX2, AVX-512). **Why others are wrong:** `<vector>` is the STL container, `<simd.h>` is not standard C++, and `<math.h>` is for scalar math.'),
    q('What does the `_mm256_loadu_ps` intrinsic do?', ['Loads 8 single-precision floats from an unaligned memory address into a 256-bit AVX register', 'Loads a single double-precision float', 'Saves data to the hard drive', 'Allocates 256 bytes of RAM'], 0, 'The `u` stands for "unaligned". It fetches 256 bits (8 floats) from RAM without requiring the memory address to be strictly 32-byte aligned, preventing segfaults at a minor performance cost compared to aligned loads. **Why others are wrong:** It does not load doubles, save to disk, or allocate RAM.')
  ],
  [
    'SIMD processes multiple data points per instruction using wide CPU registers (AVX2/AVX-512).',
    'Auto-vectorization is fragile; use `#pragma omp simd` or `__restrict` to guide the compiler.',
    'Explicit intrinsics (`<immintrin.h>`) guarantee hardware utilization when the compiler fails.',
    'Restructure data from AoS to SoA to enable contiguous vector loads and eliminate shuffles.',
    'FMA (Fused Multiply-Add) instructions double math throughput and improve numerical precision.'
  ],
  '🖥️ **Terminal Notice:** If you want to use a big terminal on your own computer instead of the built-in one, please read Lesson 1 for the full setup instructions.\n'
),
L(
  'cppx-05', 5, 'Advanced Template Metaprogramming (TMP)', '🧬',
  'Templates are not just for generic containers; they are a Turing-complete functional language that executes *during compilation*. By mastering SFINAE, variadic templates, and `constexpr`, you shift massive computational workloads and architectural validation to compile-time, resulting in zero-cost runtime abstractions.',
  [
    {
      title: '1. SFINAE & Type Traits',
      beginner: 'SFINAE stands for "Substitution Failure Is Not An Error". It allows you to write a function that ONLY compiles if the data type passed to it has a specific trait (like "is an integer" or "has a .size() method").',
      advanced: 'SFINAE leverages `std::enable_if` and type traits (`<type_traits>`) to selectively remove invalid function overloads from the compiler\'s candidate set during template instantiation, rather than triggering a hard compilation error. This is the foundation of compile-time polymorphism.'
    },
    {
      title: '2. Variadic Templates & Parameter Packs',
      beginner: 'Before C++11, if you wanted a function that took 3 arguments, you wrote it. If you wanted 4, you wrote another. Variadic templates (`template<typename... Args>`) let you write ONE function that accepts an infinite number of arguments of any type!',
      advanced: 'Parameter packs (`Args...`) capture arbitrary template arguments. Combined with C++17 Fold Expressions (`(args + ...)`), you can recursively unpack and operate on infinite argument lists at compile-time, replacing massive macro hacks and repetitive overloads.'
    },
    {
      title: '3. `if constexpr` (Compile-Time Branching)',
      beginner: 'Normal `if` statements evaluate at runtime. `if constexpr` evaluates at COMPILE TIME. If the condition is false, the compiler completely deletes that block of code from the final binary!',
      advanced: 'Introduced in C++17, `if constexpr` prunes the AST during template instantiation. It eliminates the need for complex tag-dispatching or recursive SFINAE overloads, allowing you to write clean, linear code that statically adapts to type properties without generating dead code.'
    },
    {
      title: '4. `constexpr` vs `consteval`',
      beginner: '`constexpr` tells the compiler: "Calculate this math right now, during compilation, and bake the answer directly into the machine code." `consteval` (C++20) forces it: "If you cannot calculate this at compile time, crash the build!"',
      advanced: '`constexpr` functions can execute at compile-time OR runtime depending on context. C++20\'s `consteval` (Immediate Functions) strictly enforces compile-time evaluation, enabling powerful compile-time reflection, string hashing, and routing tables that cost zero CPU cycles at runtime.'
    },
    {
      title: '5. Expression Templates (Expert Teaser)',
      beginner: 'If you add three giant matrices together `A + B + C`, standard C++ creates two useless temporary matrices in RAM. Expression templates delay the math until the very end, doing it all in one pass!',
      advanced: '*(Pro Track Preview)* Expression Templates use operator overloading to build an Abstract Syntax Tree (AST) of operations at compile-time. The final assignment operator traverses the AST, fusing loops and eliminating all intermediate temporary allocations (Lazy Evaluation). This is how libraries like Eigen achieve BLAS-level speeds.'
    }
  ],
  {
    title: 'Compile-Time Type Validator & Variadic Sum',
    intro: 'We will use SFINAE to build a function that only accepts numeric types, and C++17 Fold Expressions to sum an infinite number of arguments at compile-time.',
    steps: [
      'Create `tmp.cpp` and include `<iostream>`, `<type_traits>`, and `<string>`.',
      'Write a variadic sum using a C++17 Fold Expression: `template<typename... Args> constexpr auto sum(Args... args) { return (args + ...); }`.',
      'In `main()`, test it: `constexpr int result = sum(1, 2, 3, 4, 5);`. Because it is `constexpr`, the compiler calculates `15` and hardcodes it into the binary. No runtime addition occurs!',
      'Now write a SFINAE guarded function: `template<typename T, std::enable_if_t<std::is_arithmetic_v<T>, int> = 0> void process(T val) { std::cout << "Number: " << val << std::endl; }`.',
      'Call `process(42);` and `process(3.14);`. They compile and run perfectly.',
      'Try to call `process(std::string("Hello"));`. The compiler will violently reject the build, proving your type-trait guard successfully blocked non-arithmetic types at compile-time.'
    ],
    goal: 'You utilized Variadic Fold Expressions for zero-cost runtime math and SFINAE type-traits to enforce strict architectural contracts during compilation.'
  },
  [
    q('What does SFINAE stand for and what is its purpose?', ['System Failure Is Not An Error; it catches runtime crashes', 'Substitution Failure Is Not An Error; it allows the compiler to silently discard invalid template overloads instead of failing the build', 'Static Function Inline Allocation Engine; it speeds up loops', 'Standard Float Integer Arithmetic Engine'], 1, 'SFINAE is a core TMP rule: if substituting template arguments fails, the compiler simply removes that function from the overload resolution set rather than throwing a hard error. **Why others are wrong:** It is strictly a compile-time overload resolution mechanism.'),
    q('What does a C++17 Fold Expression like `(args + ...)` do?', ['It folds an array in half', 'It recursively unpacks a variadic parameter pack and applies the `+` operator across all arguments at compile-time', 'It deletes duplicate arguments', 'It converts arguments to strings'], 1, 'Fold expressions provide clean, native syntax for reducing variadic parameter packs, completely replacing the need for complex recursive template unpacking. **Why others are wrong:** It operates on template packs, not arrays, duplicates, or strings.'),
    q('What is the primary advantage of `if constexpr` over a standard `if` statement inside a template?', ['It runs faster at runtime', 'It prunes the unselected branch during compilation, preventing compile errors for invalid types and eliminating dead code from the binary', 'It allows you to use global variables', 'It prevents memory leaks'], 1, 'Standard `if` requires both branches to be syntactically valid for all instantiated types. `if constexpr` completely discards the false branch during AST generation, allowing type-specific logic to coexist safely. **Why others are wrong:** It is a compile-time AST pruning tool, not a runtime optimizer.'),
    q('How does `consteval` (C++20) differ from `constexpr`?', ['`consteval` is slower', '`constexpr` can run at runtime or compile-time, while `consteval` strictly forces compile-time execution and will fail the build if evaluated at runtime', '`consteval` only works on floats', 'There is no difference'], 1, '`consteval` designates Immediate Functions, guaranteeing that the function is evaluated strictly during translation, enabling powerful compile-time string parsing and reflection. **Why others are wrong:** It is stricter than `constexpr`, not slower or type-restricted.'),
    q('What problem do Expression Templates solve in linear algebra libraries?', ['They make the code shorter to type', 'They build a compile-time AST of math operations, fusing loops and completely eliminating the creation of expensive temporary intermediate matrices', 'They connect to the GPU', 'They encrypt the matrices'], 1, 'By delaying evaluation until the final assignment, Expression Templates transform `A + B + C` from two separate allocations and passes into a single, highly optimized fused loop (Lazy Evaluation). **Why others are wrong:** They optimize memory and cache, not typing length, GPU routing, or encryption.')
  ],
  [
    'SFINAE and `std::enable_if` selectively prune invalid template overloads at compile-time.',
    'Variadic templates and C++17 Fold Expressions process infinite argument lists without recursion.',
    '`if constexpr` prunes the AST, enabling safe type-specific branching without dead code.',
    '`consteval` enforces strict compile-time evaluation for zero-cost runtime abstractions.',
    'Expression Templates utilize lazy evaluation to eliminate temporary allocations in math pipelines.'
  ],
  '🖥️ **Terminal Notice:** If you want to use a big terminal on your own computer instead of the built-in one, please read Lesson 1 for the full setup instructions.\n'
),

  L(
  'cppx-06', 6, 'C++20 Concepts & Constraints', '📜',
  'For decades, C++ templates relied on SFINAE and `std::enable_if` to enforce type requirements, resulting in horrific, pages-long compiler errors when a type mismatch occurred. C++20 introduces Concepts: first-class, readable, compile-time contracts that restrict template arguments and transform template metaprogramming from a dark art into a clean, expressive engineering discipline.',
  [
    {
      title: '1. The SFINAE Nightmare',
      beginner: 'Before C++20, if you wanted a template function to only accept numbers, you had to write complex "substitution failure" tricks. If you passed a string by mistake, the compiler would vomit 100 lines of unreadable template errors.',
      advanced: 'Substitution Failure Is Not An Error (SFINAE)利用 `std::enable_if` and `void_t` to remove invalid overloads from the candidate set. While powerful, it destroys IDE autocompletion, generates massive AST depth, and produces impenetrable diagnostic traces.'
    },
    {
      title: '2. Introducing `concept` & `requires`',
      beginner: 'Concepts let you write plain English rules for your templates. `template <std::integral T>` tells the compiler: "Only accept integer types here." If you pass a float, the compiler gives a clean, one-line error.',
      advanced: 'A `concept` is a named set of constraints evaluated at compile-time. The `requires` clause specifies boolean constant expressions that must evaluate to `true` for the template to be instantiated. This shifts type-checking from the instantiation phase to the constraint-resolution phase.'
    },
    {
      title: '3. Standard Library Concepts',
      beginner: 'You don\'t have to write every rule from scratch. C++20 provides a massive toolbox of pre-built concepts like `std::sortable`, `std::copyable`, and `std::invocable` inside the `<concepts>` header.',
      advanced: 'The `<concepts>` header provides foundational language concepts (`SameAs`, `DerivedFrom`) and library concepts (`Integral`, `FloatingPoint`, `Regular`). These are rigorously tested and form the bedrock of modern generic STL algorithms.'
    },
    {
      title: '4. Constrained Auto & Abbreviated Templates',
      beginner: 'You can now use concepts directly in function parameters without writing the word "template" at all! `void print(std::integral auto x)` is a fully constrained template function.',
      advanced: 'Abbreviated function templates allow concepts to constrain `auto` parameters. This unifies the syntax for generic lambdas and template functions, drastically reducing visual boilerplate while maintaining strict compile-time type safety.'
    },
    {
      title: '5. Subsumption & Concept Composition (Expert Teaser)',
      beginner: 'You can combine concepts using AND (`&&`) and OR (`||`). Furthermore, if Concept A is stricter than Concept B, the compiler automatically knows to prefer A when both match!',
      advanced: '*(Pro Track Preview)* Concept subsumption allows the compiler to logically deduce that `std::integral` subsumes `std::arithmetic`. This enables partial ordering of constrained templates without the fragile overload-resolution hacks required by SFINAE.'
    }
  ],
  {
    title: 'The Constrained Math Pipeline',
    intro: 'We will replace legacy SFINAE traits with C++20 Concepts to build a generic math pipeline that strictly enforces numeric and sortable constraints with beautiful compiler diagnostics.',
    steps: [
      'Create `concepts.cpp` and include `<concepts>`, `<vector>`, and `<iostream>`.',
      'Define a custom concept: `template<typename T> concept Numeric = std::integral<T> || std::floating_point<T>;`.',
      'Write a constrained template function: `template<Numeric T> T add(T a, T b) { return a + b; }`.',
      'Write an abbreviated template function: `void print_sortable(std::sortable auto& vec) { std::sort(vec.begin(), vec.end()); }`.',
      'In `main()`, test valid types: `add(5, 10);` and `add(3.14, 2.0);`.',
      'Test the constraint: Try to compile `add(std::string("A"), std::string("B"));`. Observe the clean, immediate compiler error stating the constraint was not satisfied.',
      'Compile with `-std=c++20` and verify the binary executes flawlessly.'
    ],
    goal: 'You replaced archaic SFINAE metaprogramming with C++20 Concepts, enforcing strict compile-time type contracts with readable syntax and precise diagnostics.'
  },
  [
    q('What primary problem do C++20 Concepts solve that SFINAE struggled with?', ['Runtime memory leaks', 'Impenetrable compiler error messages and lack of IDE autocompletion for generic type requirements', 'Slow execution speeds', 'Inability to use pointers'], 1, 'Concepts evaluate constraints before instantiation, providing clear, localized diagnostic messages when a type fails to meet the requirements, unlike the deep template tracebacks of SFINAE. **Why others are wrong:** Concepts are strictly a compile-time type-system feature.'),
    q('What does the `requires` clause do in a template declaration?', ['It allocates memory dynamically', 'It specifies a boolean constant expression that must evaluate to true for the template to be considered a valid candidate', 'It forces the function to run asynchronously', 'It encrypts the source code'], 1, 'The `requires` clause acts as a gatekeeper, pruning the overload resolution set if the compile-time boolean expression evaluates to false. **Why others are wrong:** It has no runtime, async, or security implications.'),
    q('Which header must be included to use standard library concepts like `std::integral` or `std::copyable`?', ['<type_traits>', '<concepts>', '<templates>', '<constraints>'], 1, 'The `<concepts>` header defines the standard library\'s foundational and library concepts. **Why others are wrong:** `<type_traits>` is the legacy SFINAE header; the others do not exist.'),
    q('What is an "Abbreviated Function Template"?', ['A macro that expands into a class', 'A function using `auto` parameters constrained by a concept (e.g., `void f(std::integral auto x)`), eliminating the `template<...>` prefix', 'A function that returns void', 'A lambda expression'], 1, 'Abbreviated templates allow concepts to be applied directly to `auto` parameters, providing a clean, lambda-like syntax for generic functions. **Why others are wrong:** It is not a macro, void-returning, or a lambda.'),
    q('What is "Concept Subsumption"?', ['When a concept deletes another concept', 'The compiler\'s ability to logically deduce that one concept is strictly stricter than another, enabling proper overload ordering', 'When a template inherits from a class', 'A memory leak in the compiler'], 1, 'Subsumption allows the compiler to rank constrained templates. If Concept A implies Concept B, A is considered more specialized and is preferred during overload resolution. **Why others are wrong:** It is a logical ordering mechanism, not deletion, inheritance, or a leak.')
  ],
  [
    'Concepts replace SFINAE with readable, first-class compile-time type contracts.',
    'The `requires` clause prunes invalid templates before instantiation, yielding clean errors.',
    'The `<concepts>` header provides a robust standard library of type traits.',
    'Abbreviated function templates unify generic lambdas and constrained `auto` parameters.',
    'Concept subsumption enables logical partial ordering of constrained overloads.'
  ],
  '🖥️ **Terminal Notice:** If you want to use a big terminal on your own computer instead of the built-in one, please read Lesson 1 for the full setup instructions.\n'
),
L(
  'cppx-07', 7, 'C++20 Coroutines & Async Frameworks', '🌪️',
  'Asynchronous C++ has historically relied on deeply nested callbacks or heavy OS threads. C++20 Coroutines introduce stackless, compiler-generated state machines that allow you to write asynchronous, non-blocking code that reads exactly like clean, synchronous logic. This is the foundation of modern high-performance networking and game engines.',
  [
    {
      title: '1. The Callback Hell & State Machines',
      beginner: 'When you wait for a network response, you usually have to write a "callback" function that runs later. If you have 5 steps, you end up with 5 nested callbacks. Coroutines let you write it top-to-bottom, pausing and resuming automatically!',
      advanced: 'Traditional async C++ relies on the Proactor pattern and manual state machines (e.g., Boost.Asio). Coroutines abstract this by allowing the compiler to automatically slice a function into a state machine, suspending at `co_await` and resuming when the I/O completes.'
    },
    {
      title: '2. The Three Keywords',
      beginner: 'A function becomes a coroutine if it uses one of three words: `co_await` (pause and wait for something), `co_yield` (pause and hand back a value), or `co_return` (finish and hand back the final result).',
      advanced: 'These keywords transform the function into a coroutine frame. `co_await` evaluates an Awaitable, `co_yield` maps to `promise.yield_value()`, and `co_return` maps to `promise.return_value()` followed by frame destruction.'
    },
    {
      title: '3. Promises, Awaitables, and Awaiters',
      beginner: 'Coroutines have a hidden manager called a "Promise" that controls its lifecycle. When you `co_await` a task, the task acts as an "Awaitable" that tells the coroutine whether it\'s ready to resume or needs to sleep.',
      advanced: 'The Promise object handles allocation, return value storage, and unhandled exceptions. The Awaitable trait (`await_ready`, `await_suspend`, `await_resume`) dictates the exact suspension mechanics and how the execution handle is passed to the scheduler.'
    },
    {
      title: '4. Symmetric Transfer & Heap Elision',
      beginner: 'Normally, pausing and resuming takes time. C++20 includes a trick called "Symmetric Transfer" that lets one coroutine instantly jump into the next one without returning to the main scheduler, saving massive CPU cycles!',
      advanced: 'Returning `std::coroutine_handle` from `await_suspend` enables symmetric transfer, preventing stack overflow in deeply chained coroutines. Furthermore, compilers aggressively perform Heap Allocation Elision (HALO), keeping the coroutine frame entirely on the stack if its lifetime can be statically proven.'
    },
    {
      title: '5. Asio & Custom Executors (Expert Teaser)',
      beginner: 'You can plug coroutines into massive networking libraries like Asio, allowing your server to handle 100,000 concurrent connections on a single thread without breaking a sweat.',
      advanced: '*(Pro Track Preview)* Coroutines decouple the async logic from the execution context. By integrating with `boost::asio::use_awaitable` or custom executors, you can route coroutine resumption across thread pools, work-stealing schedulers, or io_uring rings.'
    }
  ],
  {
    title: 'The Lazy Task Generator',
    intro: 'We will build a custom coroutine Promise and Awaitable to create a "Lazy Task" that only executes when explicitly awaited, proving the mechanics of stackless suspension.',
    steps: [
      'Create `coro.cpp` and include `<coroutine>`, `<iostream>`, and `<exception>`.',
      'Define the Task struct: `struct Task { struct promise_type; using handle_type = std::coroutine_handle<promise_type>; handle_type h; }`.',
      'Define the Promise: `struct Task::promise_type { Task get_return_object() { return {handle_type::from_promise(*this)}; } std::suspend_always initial_suspend() { return {}; } std::suspend_always final_suspend() noexcept { return {}; } void return_void() {} void unhandled_exception() { std::exit(1); } };`.',
      'Write a coroutine: `Task my_task() { std::cout << "Step 1\\n"; co_await std::suspend_always{}; std::cout << "Step 2\\n"; }`.',
      'In `main()`, instantiate it: `Task t = my_task();`. Notice NOTHING prints yet! It is suspended at `initial_suspend`.',
      'Resume it manually: `t.h.resume();`. "Step 1" prints, then it suspends at `co_await`.',
      'Resume again: `t.h.resume();`. "Step 2" prints. Finally, destroy it: `t.h.destroy();`.'
    ],
    goal: 'You engineered a custom C++20 Coroutine Promise and Awaitable, manually driving the stackless state machine lifecycle and proving lazy evaluation.'
  },
  [
    q('What makes C++20 Coroutines "stackless"?', ['They do not use RAM', 'The compiler transforms the local variables and instruction pointer into a heap-allocated (or elided) state machine frame, rather than preserving a full OS thread stack', 'They run on the GPU', 'They delete the call stack'], 1, 'Stackless coroutines suspend by saving only the necessary state into a coroutine frame, allowing millions of coroutines to exist simultaneously without the memory overhead of OS thread stacks. **Why others are wrong:** They use RAM, do not require GPUs, and do not delete the hardware call stack.'),
    q('Which keyword pauses a coroutine and yields a value back to the caller?', ['co_pause', 'co_yield', 'await', 'return'], 1, '`co_yield` suspends the coroutine and invokes `promise.yield_value()`, passing data out to the iterator or caller. **Why others are wrong:** `co_await` suspends for an awaitable, `return` is standard, and `co_pause` does not exist.'),
    q('What is the role of the `promise_type` in a coroutine?', ['It guarantees the coroutine will succeed', 'It acts as the control block managing the coroutine\'s lifecycle, return value storage, suspension behavior, and exception handling', 'It connects the coroutine to the internet', 'It allocates CPU cores'], 1, 'The Promise object is the architectural backbone of the coroutine, defining how it starts, yields, returns, and handles errors. **Why others are wrong:** It does not guarantee success, handle networking, or allocate hardware cores.'),
    q('What is "Symmetric Transfer" in C++20 coroutines?', ['Moving data between two CPUs', 'Returning a `std::coroutine_handle` from `await_suspend` to immediately resume another coroutine without returning to the scheduler, preventing stack overflow', 'Copying a coroutine to another thread', 'Encrypting the coroutine state'], 1, 'Symmetric transfer allows a suspending coroutine to directly tail-call into the next awaiting coroutine, eliminating scheduler overhead and infinite recursion depth limits. **Why others are wrong:** It is a control-flow optimization, not hardware transfer, threading, or encryption.'),
    q('What is Heap Allocation Elision (HALO) in the context of coroutines?', ['The compiler deletes the coroutine code', 'The compiler optimizes away the heap allocation of the coroutine frame, placing it entirely on the stack if its lifetime is strictly bound to the caller', 'The OS compresses the RAM', 'The garbage collector frees the frame'], 1, 'HALO is a critical optimization where the compiler proves the coroutine frame does not outlive the calling scope, allowing it to be allocated on the fast stack instead of the slow heap. **Why others are wrong:** It does not delete code, compress RAM, or rely on garbage collection.')
  ],
  [
    'C++20 Coroutines are stackless state machines generated by the compiler.',
    '`co_await`, `co_yield`, and `co_return` dictate suspension and data flow.',
    'The `promise_type` controls the coroutine\'s lifecycle, allocation, and error handling.',
    'Symmetric transfer prevents stack overflow in deeply chained async operations.',
    'Heap Allocation Elision (HALO) keeps coroutine frames on the stack for zero-cost async.'
  ],
  '🖥️ **Terminal Notice:** If you want to use a big terminal on your own computer instead of the built-in one, please read Lesson 1 for the full setup instructions.\n'
),
L(
  'cppx-08', 8, 'C++20 Modules & Modern Build Architectures', '📦',
  'The `#include` preprocessor is a 50-year-old text-pasting hack that destroys build times, leaks macros, and violates encapsulation. C++20 Modules replace textual inclusion with compiled Binary Module Interfaces (BMIs), fundamentally revolutionizing C++ build architectures, scaling to massive codebases, and finally isolating macros.',
  [
    {
      title: '1. The `#include` Bottleneck',
      beginner: 'Every time you `#include <vector>`, the compiler literally copies and pastes 10,000 lines of text into your file. If 100 files include it, the compiler reads those 10,000 lines 100 times. This makes C++ compilation agonizingly slow.',
      advanced: 'The preprocessor performs blind textual substitution. This causes O(N^2) parsing overhead in large projects, leaks internal macros across translation units, and forces strict include-guard hygiene. It is the primary bottleneck in C++ CI/CD pipelines.'
    },
    {
      title: '2. Module Interfaces (`export module`)',
      beginner: 'Modules let you compile a file ONCE into a binary format. Other files simply `import` that binary. It\'s like buying a pre-built engine instead of reading the blueprint and building it from scratch every time.',
      advanced: 'A Module Interface Unit (MIU) declares `export module MyLib;`. The compiler parses it once and emits a Binary Module Interface (BMI). Downstream translation units `import MyLib;`, consuming the pre-digested AST instantly without re-parsing source text.'
    },
    {
      title: '3. Partitions & Implementation Units',
      beginner: 'You can split a massive module into smaller "partitions" to organize your code, and hide the private implementation details in separate files that the user cannot see or import.',
      advanced: 'Module partitions (`export module MyLib:part;`) allow parallel compilation of a single module\'s interface. Module Implementation Units (`module MyLib;`) provide definitions without re-exporting them, enforcing strict architectural boundaries and hiding internal template instantiations.'
    },
    {
      title: '4. Macro Isolation & ODR Guarantees',
      beginner: 'In old C++, if a header defined `#define MAX 100`, it infected every file that included it. Modules completely trap macros inside their own file. They do not leak!',
      advanced: 'Modules do not export preprocessor macros. Furthermore, modules guarantee that entities are compiled exactly once, mathematically eliminating One Definition Rule (ODR) violations that plague large header-based codebases.'
    },
    {
      title: '5. Standard Library Modules (`import std;`) (Expert Teaser)',
      beginner: 'Instead of including 50 different standard headers like `<iostream>` and `<vector>`, C++23 lets you just type `import std;` and instantly get the entire standard library in one microsecond!',
      advanced: '*(Pro Track Preview)* C++23 introduces `import std;` and `import std.compat;`. This pre-compiled standard library module drastically reduces the baseline parsing overhead of every translation unit in the C++ ecosystem.'
    }
  ],
  {
    title: 'The Binary Module Transition',
    intro: 'We will transition a legacy header/source architecture into a modern C++20 Module, proving the isolation of internal state and the elimination of textual inclusion.',
    steps: [
      'Create `math_module.cppm` (or `.ixx` depending on compiler). Write: `export module MathLib; export int add(int a, int b) { return a + b; } int secret_internal_state = 42;`.',
      'Create `main.cpp`. Write: `import MathLib; import <iostream>; int main() { std::cout << add(5, 10); }`.',
      'Attempt to access the hidden variable in main: `std::cout << secret_internal_state;`. Compile and watch it fail cleanly—the variable is not exported and does not leak!',
      'Compile the module interface (Clang/GCC syntax varies, e.g., `clang++ -std=c++20 -fmodules -c math_module.cppm -o MathLib.pcm`).',
      'Compile the main app against the BMI: `clang++ -std=c++20 -fmodules -fprebuilt-module-path=. main.cpp MathLib.pcm`.',
      'Run the binary. You have successfully bypassed the preprocessor and consumed a compiled AST.'
    ],
    goal: 'You bypassed the legacy preprocessor, engineered a Binary Module Interface (BMI), and enforced strict architectural encapsulation without header guards.'
  },
  [
    q('What is the fundamental performance flaw of the `#include` preprocessor directive?', ['It deletes files', 'It performs blind textual substitution, forcing the compiler to repeatedly parse the same thousands of lines of code for every translation unit', 'It encrypts the hard drive', 'It only works on Windows'], 1, 'Textual inclusion causes massive O(N^2) parsing overhead in large codebases, as every `#include` forces the compiler to re-lex and re-parse the included AST. **Why others are wrong:** It does not delete files, encrypt drives, or have OS restrictions.'),
    q('What does a C++20 Module emit that downstream files consume?', ['A raw text file', 'A Binary Module Interface (BMI) containing the pre-compiled Abstract Syntax Tree', 'A Python script', 'A zip archive'], 1, 'The compiler processes the Module Interface Unit once and emits a BMI (`.pcm`, `.gcm`, `.ifc`), which downstream translation units import instantly without re-parsing source text. **Why others are wrong:** It is a compiler-specific binary AST format, not text, Python, or zip.'),
    q('How do C++20 Modules handle preprocessor macros (`#define`)?', ['They export them globally', 'Macros are strictly isolated to the translation unit where they are defined and do not leak across module boundaries', 'They convert them to functions', 'They delete them'], 1, 'Modules do not export macros. This eliminates the macro-pollution and naming collisions that have plagued C++ header files for decades. **Why others are wrong:** They do not export, convert, or delete them; they simply contain them.'),
    q('What is a Module Implementation Unit?', ['A file that exports the public API', 'A file that provides definitions for a module without re-exporting them, hiding internal details from the consumer', 'A file that runs the program', 'A testing framework'], 1, 'Implementation units (`module MyLib;`) allow you to split the compilation of a module\'s private logic, keeping the BMI small and hiding internal template instantiations from the public interface. **Why others are wrong:** It does not export the API, run the program, or act as a test framework.'),
    q('What is the primary benefit of `import std;` introduced in C++23?', ['It makes the code run faster at runtime', 'It provides a pre-compiled binary module of the entire standard library, drastically reducing baseline compilation times for every translation unit', 'It connects to the internet', 'It replaces the compiler'], 1, '`import std;` eliminates the need to textually parse thousands of standard library headers, providing a massive CI/CD build-time optimization. **Why others are wrong:** It affects compile-time, not runtime execution speed, networking, or compiler replacement.')
  ],
  [
    'Modules replace textual `#include` with compiled Binary Module Interfaces (BMIs).',
    'BMIs eliminate O(N^2) parsing overhead, drastically scaling CI/CD build times.',
    'Modules strictly isolate macros, preventing cross-translation-unit pollution.',
    'Module Partitions and Implementation Units enforce strict architectural encapsulation.',
    '`import std;` (C++23) provides a pre-compiled standard library for instant baseline parsing.'
  ],
  '🖥️ **Terminal Notice:** If you want to use a big terminal on your own computer instead of the built-in one, please read Lesson 1 for the full setup instructions.\n'
),
L(
  'cppx-09', 9, 'Sanitizers, Fuzz Testing & Undefined Behavior', '🔬',
  'C++ gives you absolute power, which means absolute responsibility. Undefined Behavior (UB) is the silent killer of production systems, causing security exploits and random crashes months after deployment. Elite engineers do not guess; they use compiler instrumentation (Sanitizers) and coverage-guided Fuzzing to mathematically hunt down memory corruption and edge-case vulnerabilities before they reach production.',
  [
    {
      title: '1. The Reality of Undefined Behavior (UB)',
      beginner: 'If you read past the end of an array, C++ doesn\'t always crash. It might just read garbage data, or worse, the compiler might assume it never happens and delete your security checks! This is Undefined Behavior.',
      advanced: 'UB occurs when code violates the C++ standard\'s rules (e.g., signed integer overflow, strict aliasing, out-of-bounds access). Compilers aggressively optimize based on the assumption that UB never occurs, leading to silent, catastrophic logic failures and security vulnerabilities.'
    },
    {
      title: '2. AddressSanitizer (ASan)',
      beginner: 'ASan is a tool that acts like a security guard for your RAM. It puts "poisoned" invisible walls around your variables. If you accidentally read or write past an array, you hit the wall and the program instantly crashes with a perfect report!',
      advanced: 'ASan instruments the binary at compile-time (`-fsanitize=address`), utilizing "Shadow Memory" to map every 8 bytes of application memory to 1 byte of shadow metadata. It detects heap/stack buffer overflows, use-after-free, and double-frees with minimal performance overhead.'
    },
    {
      title: '3. ThreadSanitizer (TSan)',
      beginner: 'Data races happen when two threads touch the same variable at the same time. TSan watches every single memory access across all threads and yells if two threads touch the same data without a lock!',
      advanced: 'TSan (`-fsanitize=thread`) implements a happens-before vector clock algorithm. It tracks the synchronization history of every memory location, detecting lock-order inversions and unsynchronized concurrent accesses that lead to torn reads and race conditions.'
    },
    {
      title: '4. UndefinedBehaviorSanitizer (UBSan)',
      beginner: 'UBSan catches the "legal-looking" math errors that C++ secretly hates, like multiplying two massive numbers until they overflow, or dividing by zero.',
      advanced: 'UBSan (`-fsanitize=undefined`) instruments arithmetic operations, pointer alignment, and null-dereferences. It catches signed integer overflow, shift-base violations, and strict-aliasing violations that standard ASan cannot see.'
    },
    {
      title: '5. LibFuzz & Coverage-Guided Fuzzing (Expert Teaser)',
      beginner: 'Instead of writing manual tests, Fuzzing throws millions of random, mutated garbage inputs at your code to see if it crashes. It finds bugs that human testers would never think to look for!',
      advanced: '*(Pro Track Preview)* LibFuzzer utilizes compiler-injected coverage edges (`-fsanitize=fuzzer`) to map the execution graph. It uses genetic algorithms to mutate input seeds, systematically maximizing code coverage and discovering deep, hidden edge-case vulnerabilities in parsers and network protocols.'
    }
  ],
  {
    title: 'The Invisible Bug Hunt',
    intro: 'We will intentionally write hidden memory corruptions and data races, and then use compiler Sanitizers to expose the invisible bugs that standard debuggers miss.',
    steps: [
      'Create `bugs.cpp` and include `<iostream>`, `<vector>`, and `<thread>`.',
      'Write a Heap Buffer Overflow: `void overflow() { std::vector<int> v(5); v[10] = 99; }` (Standard execution might not crash!).',
      'Write a Data Race: `int counter = 0; void race() { for(int i=0; i<10000; i++) counter++; }`.',
      'Compile NORMALLY: `g++ -O2 bugs.cpp -o bugs`. Run it. It likely succeeds silently, hiding the corruption.',
      'Compile with ASan: `g++ -fsanitize=address -g bugs.cpp -o bugs_asan`. Run it. Watch ASan instantly abort the program and print the exact line of the heap overflow!',
      'Compile with TSan: `g++ -fsanitize=thread -g bugs.cpp -o bugs_tsan`. Add threads calling `race()` in main. Run it. Watch TSan map the exact vector clock conflict of the data race.'
    ],
    goal: 'You instrumented binaries with Shadow Memory and Vector Clocks, mathematically exposing silent heap corruptions and multithreading data races that evade standard testing.'
  },
  [
    q('What is "Shadow Memory" in the context of AddressSanitizer (ASan)?', ['A backup hard drive', 'A compressed mapping where every 8 bytes of application memory is tracked by 1 byte of metadata to detect out-of-bounds accesses', 'A GPU rendering technique', 'A type of encryption'], 1, 'ASan maintains a shadow memory map that tracks the validity (poisoned/unpoisoned state) of application memory, allowing it to instantly detect buffer overflows and use-after-free errors. **Why others are wrong:** It is a RAM instrumentation technique, not storage, GPU, or encryption.'),
    q('How does ThreadSanitizer (TSan) detect data races without stopping the program?', ['It pauses all threads constantly', 'It utilizes a happens-before vector clock algorithm to track the synchronization history and memory access order of every thread', 'It uses a mutex on every variable', 'It reads the hard drive'], 1, 'TSan tracks the causal ordering of memory accesses across threads. If two accesses conflict and lack a happens-before relationship (e.g., a mutex lock), it flags a data race. **Why others are wrong:** It does not pause execution, lock variables, or read disk.'),
    q('Why is Signed Integer Overflow considered Undefined Behavior (UB) in C++?', ['Because CPUs cannot add numbers', 'Because the compiler assumes it never happens and uses that assumption to aggressively optimize and delete code branches', 'Because it causes a syntax error', 'Because it deletes the file'], 1, 'Compilers optimize based on the premise that UB does not occur. Signed overflow can cause the compiler to eliminate infinite loop checks or security bounds, leading to silent logic failures. **Why others are wrong:** CPUs handle it, it is not a syntax error, and it does not delete files.'),
    q('What is the primary mechanism of Coverage-Guided Fuzzing (e.g., LibFuzzer)?', ['Sending random emails', 'Using compiler-instrumented execution edges to map the code graph, then using genetic algorithms to mutate inputs to maximize code coverage', 'Running the code on 100 computers', 'Asking the user for input'], 1, 'Fuzzers monitor which branches are taken. If a mutated input triggers a new, unseen branch, the fuzzer keeps that input as a seed to explore deeper into the application logic. **Why others are wrong:** It is an automated, coverage-driven binary analysis technique.'),
    q('Which compiler flag enables the UndefinedBehaviorSanitizer (UBSan)?', ['-fsanitize=address', '-fsanitize=thread', '-fsanitize=undefined', '-fsanitize=leak'], 2, '`-fsanitize=undefined` (or UBSan) instruments the binary to catch arithmetic overflows, null dereferences, and alignment violations at runtime. **Why others are wrong:** Address is ASan, Thread is TSan, and Leak is LSan.')
  ],
  [
    'Undefined Behavior allows compilers to aggressively optimize, causing silent logic failures.',
    'AddressSanitizer (ASan) uses Shadow Memory to instantly catch heap/stack corruptions.',
    'ThreadSanitizer (TSan) uses Vector Clocks to detect unsynchronized data races.',
    'UBSan catches silent arithmetic overflows and strict-aliasing violations.',
    'Coverage-guided Fuzzing uses genetic mutations to discover deep edge-case vulnerabilities.'
  ],
  '🖥️ **Terminal Notice:** If you want to use a big terminal on your own computer instead of the built-in one, please read Lesson 1 for the full setup instructions.\n'
),
L(
  'cppx-10', 10, 'Elite Capstone: The Zero-Cost Abstraction Engine', '🎓',
  'Congratulations. You have reached the zenith of the C++ Expert Track. You have mastered hardware sympathy, memory arenas, lock-free concurrency, SIMD vectorization, metaprogramming, and modern C++20 architectures. This capstone synthesizes the entire curriculum into a single, high-performance, lock-free, arena-backed asynchronous task engine.',
  [
    {
      title: '1. Architectural Synthesis',
      beginner: 'You are no longer writing scripts; you are engineering systems. This capstone combines the Bump Allocators from Lesson 2, the Atomics from Lesson 3, and the Concepts from Lesson 6 into one unified engine.',
      advanced: 'Elite C++ architecture requires composing zero-cost abstractions. We will build a task scheduler where memory allocation is O(1) via arenas, synchronization is lock-free via acquire/release semantics, and type safety is guaranteed at compile-time via Concepts.'
    },
    {
      title: '2. The Arena-Backed Task Queue',
      beginner: 'Instead of using `new` to create tasks (which is slow), we will allocate every task out of a massive pre-allocated Memory Arena, ensuring zero fragmentation and instant cleanup.',
      advanced: 'The task queue will utilize a custom Bump Allocator. Tasks are constructed in-place using placement new, ensuring perfect cache locality and eliminating OS-level heap contention during high-frequency scheduling.'
    },
    {
      title: '3. Lock-Free Dispatch',
      beginner: 'Multiple threads will pull tasks from the queue without using slow Mutex locks. We will use atomic Compare-And-Swap (CAS) to ensure threads never block each other.',
      advanced: 'The queue head/tail pointers will be managed via `std::atomic` with `memory_order_acq_rel`. This establishes strict happens-before relationships, ensuring safe publication of task payloads across CPU cores without kernel context switches.'
    },
    {
      title: '4. Concept Validation',
      beginner: 'We will use C++20 Concepts to ensure that only valid, callable functions can be submitted to the task engine, catching bad submissions before the code even compiles.',
      advanced: 'The submission API will be constrained by `std::invocable` and custom `ArenaAllocatable` concepts, enforcing strict architectural contracts and preventing invalid state mutations at the compiler boundary.'
    },
    {
      title: '5. The C++ Zenith',
      beginner: 'You have transitioned from a C++ student to a C++ Systems Architect. You now understand the machine, the memory, and the metaprogramming required to build the engines that power the world.',
      advanced: '*(Pro Track Preview)* True mastery is continuous. The next frontier involves kernel-bypass networking (DPDK), custom compiler passes (Clang AST matchers), and writing custom allocators for heterogeneous GPU memory spaces. The journey continues.'
    }
  ],
  {
    title: 'The Elite Task Scheduler',
    intro: 'Synthesize the Expert Track by architecting a lock-free, arena-backed task dispatcher constrained by C++20 Concepts and validated by Sanitizers.',
    steps: [
      'Create `capstone.cpp` and include `<atomic>`, `<concepts>`, `<vector>`, `<iostream>`, and `<thread>`.',
      'Define the Arena: `class Arena { std::vector<char> buf; size_t off = 0; public: Arena(size_t s) : buf(s) {} void* alloc(size_t s) { void* p = &buf[off]; off += s; return p; } void reset() { off = 0; } };`.',
      'Define the Concept: `template<typename F> concept Task = std::invocable<F>;`.',
      'Define the Lock-Free Node: `struct Node { void (*exec)(); std::atomic<Node*> next{nullptr}; };`.',
      'Write the constrained submit function: `template<Task F> void submit(Arena& a, std::atomic<Node*>& head, F f) { Node* n = new (a.alloc(sizeof(Node))) Node{...}; /* CAS loop to prepend */ }`.',
      'In `main()`, instantiate the Arena and the atomic head pointer.',
      'Launch 4 threads submitting 10,000 tasks each via `submit()`.',
      'Compile with `-O3 -std=c++20 -fsanitize=thread` to verify zero data races, and execute to witness the zero-cost abstraction engine in action.'
    ],
    goal: 'You successfully synthesized Memory Arenas, Lock-Free Atomics, and C++20 Concepts into a unified, high-performance, thread-safe systems architecture.'
  },
  [
    q('Why is a Bump Allocator preferred over the global heap for a high-frequency task scheduler?', ['It uses less CPU cores', 'It provides O(1) allocation via pointer arithmetic and guarantees perfect cache locality without OS-level heap fragmentation', 'It encrypts the tasks', 'It runs on the GPU'], 1, 'Bump allocators eliminate the non-deterministic latency of `malloc` and prevent heap fragmentation, ensuring the scheduler maintains microsecond-level predictability. **Why others are wrong:** It is a memory layout optimization, not a CPU/GPU or encryption feature.'),
    q('What memory order should be used on the atomic store when publishing a new task to the lock-free queue?', ['memory_order_relaxed', 'memory_order_release (paired with acquire on the load) to ensure the task payload is fully written before the pointer is visible to other threads', 'memory_order_seq_cst exclusively', 'No memory order is needed'], 1, 'Release semantics flush the store buffer, guaranteeing that the task\'s data is visible to any thread that subsequently performs an Acquire load on the queue pointer. **Why others are wrong:** Relaxed allows reordering, SeqCst is overkill, and no order causes data races.'),
    q('How do C++20 Concepts improve the task scheduler\'s submission API?', ['They make it run faster at runtime', 'They enforce at compile-time that the submitted payload is strictly callable (`std::invocable`), preventing invalid state mutations before the binary is even built', 'They compress the binary size', 'They connect to the network'], 1, 'Concepts shift type-validation to the constraint-resolution phase, providing clean diagnostics and preventing invalid template instantiations. **Why others are wrong:** They are a compile-time type-system feature, not a runtime or network optimization.'),
    q('Why must the Capstone be compiled with `-fsanitize=thread` during development?', ['To make it run faster', 'To mathematically verify that the lock-free atomic CAS loops and memory publications are free of hidden data races and torn reads', 'To encrypt the source code', 'To delete memory leaks'], 1, 'ThreadSanitizer instruments the binary to track vector clocks, proving that the custom lock-free architecture correctly establishes happens-before relationships without relying on standard mutexes. **Why others are wrong:** It is a verification tool, not an optimizer or encryptor.'),
    q('What is the ultimate philosophy of "Zero-Cost Abstractions" in C++?', ['Writing code that is completely free', 'Writing high-level, readable, generic code that compiles down to the exact same optimized machine code as if you had written it manually in low-level assembly', 'Using zero variables', 'Avoiding functions entirely'], 1, 'Zero-cost abstractions ensure that architectural elegance (Concepts, Templates, RAII) does not incur runtime overhead, perfectly mapping high-level intent to hardware reality. **Why others are wrong:** It is about compiler optimization fidelity, not financial cost or variable count.')
  ],
  [
    'Elite C++ architecture synthesizes Arenas, Atomics, and Concepts into unified systems.',
    'O(1) Bump Allocation eliminates heap contention in high-frequency schedulers.',
    'Acquire/Release semantics guarantee safe publication in lock-free data structures.',
    'C++20 Concepts enforce architectural contracts at the compiler boundary.',
    'Sanitizers mathematically prove the absence of UB and data races in custom engines.'
  ],
  '🖥️ **Terminal Notice:** If you want to use a big terminal on your own computer instead of the built-in one, please read Lesson 1 for the full setup instructions.\n'
 )
];

export const getCppxLessonById = (id: string): CppLesson | undefined =>
  CPPX_LESSONS.find(l => l.id === id);

export const isCppxLessonUnlocked = (id: string, completedLessons: string[]): boolean => {
  const idx = CPPX_LESSONS.findIndex(l => l.id === id);
  if (idx <= 0) return true;
  return completedLessons.includes(CPPX_LESSONS[idx - 1].id);
};

// Aliases used across pages
export const CPP_EXPERT_LESSONS = CPPX_LESSONS;
export const getCppExpertLessonById = getCppxLessonById;
export const isCppExpertLessonUnlocked = isCppxLessonUnlocked;
