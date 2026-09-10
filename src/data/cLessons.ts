// =============================================================================
// C TRACK — 40 lessons (beginner → advanced) 
// =============================================================================
import type { NetworkingLesson, Concept, QuizQuestion } from './networkingLessons';
export type CLesson = NetworkingLesson;

const L = (
  id: string, order: number, title: string, icon: string, philosophy: string,
  concepts: Concept[], practical: CLesson['practical'], quiz: QuizQuestion[],
  keyTakeaways: string[], terminalNotice?: string
): CLesson => ({
  id, module: 'Module 1: C Foundations', order, title, icon, philosophy,
  concepts, practical, quiz, keyTakeaways, terminalNotice,
});

const TERMINAL_NOTICE_SHORT = 'If you want to use a big terminal, use your CMD. Full guide is in Lesson 1. ';

const q = (question: string, options: string[], correctIndex: number, explanation?: string): QuizQuestion =>
  ({ question, options, correctIndex, explanation });

export const C_LESSONS: CLesson[] = [
  L(
    'c-01', 1, 'Hello C: The Compilation & Execution Model', '⚡',
    '⚡ C is the foundational language of modern computing, created by Dennis Ritchie at Bell Labs in 1972. Operating systems like Linux, macOS, and Windows—along with embedded systems, databases, and Python’s engine—are written in C. Today you will set up your C toolchain, write your first program, and discover how C source code transforms directly into machine binary.',
    [
      {
        title: '1. Why Learn C in the Modern Era?',
        beginner: 'C gives you raw power and direct control over your computer. Unlike higher-level languages that hide how memory and processors work, C lets you talk directly to hardware. It teaches you how software actually executes under the hood.',
        advanced: 'C is a statically-typed, imperative, procedural language. It provides minimal abstractions over machine instructions, providing close-to-metal performance and predictable memory footprints without the overhead of garbage collection or runtime virtual machines.'
      },
      {
        title: '2. The C Compilation Pipeline',
        beginner: 'Your computer’s CPU cannot directly understand C code. The C compiler acts as a strict translator, converting your human-readable file (.c) into raw binary instructions (.o / executable file) that the CPU runs directly.',
        advanced: 'The GCC/Clang build process flows through 4 distinct stages: 1) Preprocessing (macro expansion & header inclusion), 2) Compilation (C code to assembly language), 3) Assembly (assembly to relocatable machine object code), and 4) Linking (combining object files and C standard libraries into an executable binary).'
      },
      {
        title: '3. main() & Process Exit Status',
        beginner: 'Every C program must start execution inside a main() function. When execution finishes, return 0 tells the operating system: "Program completed with zero errors."',
        advanced: '`int main(void)` or `int main(int argc, char *argv[])` serves as the entry point defined by the ISO C standard. Returning `0` (or `EXIT_SUCCESS` from `<stdlib.h>`) signals clean execution back to the parent shell process.'
      },
      {
        title: '4. Standard I/O & `#include <stdio.h>`',
        beginner: 'To print output to the screen, C needs access to input/output functions. Writing `#include <stdio.h>` imports the standard input/output library so you can use `printf()`.',
        advanced: '`#include` is a preprocessor directive that textually pastes header definitions into the translation unit before compilation starts. `<stdio.h>` declares prototypes like `printf()` and standard stream macros (`stdout`, `stderr`).'
      }
    ],
    {
      title: 'Environment Setup & First C Program',
      intro: '⚠️ Set up your local C toolchain (GCC or Clang) and compile your first C source file.',
      steps: [
        'Install a C compiler. WINDOWS: install MSYS2 or MinGW to get `gcc`. MAC: run `xcode-select --install` to get Clang/GCC. LINUX: run `sudo apt install build-essential`.',
        'Verify your toolchain: open terminal and run `gcc --version`. Ensure a version banner appears.',
        'Create a file named `main.c` in your code editor.',
        'Write the following code:\n#include <stdio.h>\n\nint main() {\n    printf("Hello, C World!\\n");\n    return 0;\n}',
        'Save the file, open your terminal, and run: `gcc main.c -o main`',
        'Execute the binary: `./main` (Mac/Linux) or `main.exe` (Windows). You should see `Hello, C World!` displayed.',
        'Deliberately break it: remove the semicolon `;` after `printf`, attempt to recompile, and observe the syntax error message.'
      ],
      goal: 'You installed GCC, wrote a standard C source file, compiled it into a native binary executable, and executed it.'
    },
    [
      q('Who developed the C programming language and where?', ['Guido van Rossum at Google', 'Dennis Ritchie at Bell Labs', 'Bjarne Stroustrup at MIT', 'James Gosling at Sun Microsystems'], 1, 'C was created by Dennis Ritchie in 1972 at Bell Labs to build the Unix operating system.'),
      q('Which header file must be included to use the printf() function?', ['<stdlib.h>', '<stdio.h>', '<string.h>', '<iostream>'], 1, '<stdio.h> stands for Standard Input Output and declares functions like printf() and scanf().'),
      q('What does returning 0 from the main() function signify?', ['It clears the computer memory', 'It signals success to the operating system', 'It creates an infinite loop', 'It deletes the binary file'], 1, 'Return 0 is an exit status contract indicating the process completed successfully with no errors.')
    ],
    [
      'C is a compiled, procedural language that underpins operating systems, database engines, and compilers.',
      'The main() function is the mandatory entry point for every execution in C.',
      '#include <stdio.h> grants access to standard input/output functions like printf().',
      'The C compilation flow transforms human readable code through Preprocessor → Compiler → Assembler → Linker.'
    ],
    TERMINAL_NOTICE_SHORT
  )
];

export const getCLessonById = (id: string): CLesson | undefined =>
  C_LESSONS.find(l => l.id === id);

export const isCLessonUnlocked = (id: string, completedLessons: string[]): boolean => {
  const idx = C_LESSONS.findIndex(l => l.id === id);
  if (idx <= 0) return true;
  return completedLessons.includes(C_LESSONS[idx - 1].id);
};
