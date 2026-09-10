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
