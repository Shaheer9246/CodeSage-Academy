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
