// Computer & Networking Module 1 — 15 lessons
// Sourced from the official CodeSage curriculum PDF (Module 1)

export interface Concept {
  title: string;
  beginner: string;
  advanced: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

export interface NetworkingLesson {
  id: string;
  module: string;
  order: number;
  title: string;
  icon: string;
  philosophy: string;
  concepts: Concept[];
  practical: {
    title: string;
    intro: string;
    steps: string[];
    goal: string;
  };
  quiz: QuizQuestion[];
  keyTakeaways: string[];
}

export const NETWORKING_LESSONS: NetworkingLesson[] = [
 {
  id: 'net-1',
  module: 'Module 1: Computer & Network Fundamentals',
  order: 1,
  title: 'Hardware Architecture for Developers',
  icon: '🖥️',
  philosophy: 'Think of your hardware as your "Player Inventory." A weak inventory makes the game sluggish; an optimized one makes you unstoppable. Every line of code you write consumes resources from this stash. A professional developer does not just write logic; they budget CPU time, RAM, GPU layers, and disk access like a game designer balancing performance.',
  concepts: [
    {
      title: '1. The Processor (CPU) — The Main Engine',
      beginner: 'The CPU is the brain of the computer. It follows instructions one by one, doing math, comparing values, and making decisions. When your code runs, the CPU is usually the worker carrying out those steps.',
      advanced: 'A CPU executes machine instructions through a pipeline: fetch, decode, execute, access memory, and write result. In the browser, JavaScript usually runs on the main thread, which also handles layout, painting, and user input. If a loop runs for 200ms, the event loop cannot process clicks or animation frames, so the UI feels frozen. The target for smooth 60fps animation is about 16.7ms per frame. Use the DevTools Performance panel to find long tasks, break work into smaller chunks, and use Web Workers for heavy computation that does not need to touch the DOM.',
    },
    {
      title: '2. Memory (RAM) — The Active Workspace',
      beginner: 'RAM is your temporary backpack. It holds data that your program is using right now. When you close the app, the backpack is emptied. If the backpack gets too full, the computer slows down or the browser tab crashes.',
      advanced: 'RAM is fast addressable memory where the OS stores live processes. In JavaScript, objects live in the heap, and function calls live in the stack. The garbage collector frees objects that are no longer reachable. A memory leak happens when unused objects are still reachable through forgotten timers, closures, global variables, event listeners, or detached DOM nodes. Use Chrome DevTools Memory panel, take Heap Snapshots, compare Allocation over time, and look for large retained size or detached nodes.',
    },
    {
      title: '3. Graphics (GPU) — The Visual Specialist',
      beginner: 'The GPU is a team of artists specialized in drawing pictures really fast. It is great for games, animations, videos, and anything that needs many pixels updated at once.',
      advanced: 'A GPU contains many small cores designed for parallel work, especially transforming vertices and drawing pixels. Browsers use the GPU for compositing layers, transforms, opacity, WebGL, and some canvas work. CSS `will-change` hints the browser to promote an element to its own layer so animation can happen on the compositor. Use this carefully because each layer costs GPU memory and management overhead. Too many promoted layers can cause layer explosion and make performance worse. Prefer `transform` and `opacity` animations over animating width, height, top, left, or box-shadow.',
    },
    {
      title: '4. Storage (SSD) — The Permanent Library',
      beginner: 'Storage is your long-term vault. It saves files, programs, and data even after the power is turned off. An SSD is a modern vault that is much faster than old spinning hard drives.',
      advanced: 'SSD storage is non-volatile block storage, meaning it keeps data without power. It is much faster than old spinning disks, but still far slower than RAM because it must go through storage controllers, file systems, and operating system calls. For web apps, repeated disk or network reads can make the UI feel slow. Use memory caches for hot data, IndexedDB for large structured data, Cache Storage for network responses, and localStorage only for tiny synchronous values. Always remember that localStorage can block the main thread if overused.',
    },
    {
      title: '5. Binary and Data Representation — The Secret Language',
      beginner: 'Inside the computer, everything is made of tiny switches that are either off or on. We write those as 0 and 1. A single 0 or 1 is a bit. Eight bits make a byte. Letters, numbers, pictures, and sounds are all stored as patterns of bits.',
      advanced: 'Binary is the physical and logical foundation of computing. A bit is a binary digit, a byte is usually 8 bits, and larger units are built from bytes. Text uses encodings such as UTF-8, numbers use integer or floating-point formats, and images store pixel data as binary patterns. Developers see this in network transfer sizes, file sizes, memory usage, color channels, and bitwise operations. Understanding bits helps you reason about bugs, limits, security, compression, and performance.',
    },
    {
      title: '6. The Memory Hierarchy — Why Speed Matters',
      beginner: 'Imagine a kitchen. The CPU is the chef. CPU cache is the cutting board right in front of the chef. RAM is the kitchen counter. SSD is the pantry. The chef cooks fastest with food already on the cutting board, slower from the counter, and slowest from the pantry.',
      advanced: 'The memory hierarchy exists because faster memory is more expensive and smaller. Registers and CPU caches are extremely close to execution units, RAM is larger but slower, SSD storage is larger but much slower, and network storage is slower still. Programs perform best when they reuse data that is already nearby, called cache locality. In software, this same idea appears in memoization, database indexes, browser caches, CDNs, and avoiding repeated expensive calculations. A developer who understands hierarchy knows not to treat all memory as equal.',
    },
    {
      title: '7. Buses and I/O — The Communication Roads',
      beginner: 'A bus is like a road inside the computer. It carries data between the CPU, memory, graphics, storage, and devices. If the road is narrow or blocked, data waits in traffic.',
      advanced: 'Buses and I/O paths determine how quickly components can exchange data. A CPU can be fast, but if it waits on slow input/output, the system becomes I/O bound. Modern systems use PCIe lanes, DMA, interrupts, and storage controllers to move data efficiently. In web development, network requests, disk reads, database queries, and large message passing can become I/O bottlenecks. Asynchronous APIs exist so the main thread can keep responding while slow operations finish in the background.',
    },
    {
      title: '8. Von Neumann Architecture — Why Programs Live in Memory',
      beginner: 'Most computers use one big idea: both data and instructions live in memory. The CPU fetches an instruction from memory, reads it, does it, then fetches the next one.',
      advanced: 'The Von Neumann model stores program instructions and data in the same addressable memory. The CPU repeatedly fetches, decodes, and executes instructions. This design makes computers flexible because changing the program changes the behavior without rewiring the machine. For developers, it explains why code size, memory layout, cache behavior, and instruction overhead matter. It also helps explain vulnerabilities such as buffer overflows, where bad data can corrupt control flow.',
    },
  ],
  practical: {
    title: 'Hardware Inspection Lab',
    intro: 'To be a professional, you must monitor your machine. In this lab, you will see CPU, RAM, GPU, storage, and browser processes with your own eyes.',
    steps: [
      'Open your system monitor. On Windows press Ctrl+Shift+Esc to open Task Manager. On macOS press Cmd+Space, type Activity Monitor, and press Enter. On Linux, open your system monitor or run a terminal command such as top. You should see CPU, Memory, Disk, and sometimes GPU graphs. This matters because every program must borrow these resources from the OS.',
      'Open your browser. In Chrome, Edge, or Brave press Shift+Esc to open the browser task manager. If that does not work, open the browser menu, go to More tools, then Task Manager. You should see tabs, extensions, and subframes listed as separate processes. This matters because modern browsers isolate work so one heavy page cannot easily destroy the whole browser.',
      'Open a graphics-heavy page such as https://www.google.com/earth/ or a WebGL demo. Watch the GPU and CPU columns. You should see GPU usage rise when the scene moves. This matters because drawing many pixels and 3D shapes is parallel visual work, which the GPU handles better than the CPU.',
      'Open 10 to 20 normal web pages in new tabs. Watch the Memory column increase. This matters because each tab usually gets its own process, and each process needs its own JavaScript heap, DOM structures, images, and browser overhead.',
      'Open DevTools with F12 or Ctrl+Shift+I, then open the Performance panel. Record for about five seconds while scrolling or interacting with a page. Stop and look for long tasks, usually highlighted in red or marked as long. This matters because long tasks block user input and cause jank.',
      'Open the DevTools Memory panel and take a Heap Snapshot. You should see many objects, strings, arrays, and DOM nodes. This matters because memory leaks are found by comparing snapshots and looking for objects that should have been released but were retained.',
      'Open the DevTools Console with F12, click Console, type navigator.hardwareConcurrency and press Enter. You should see a number representing logical processors. This matters because Web Workers and browser scheduling can use multiple cores.',
      'In the same Console, type navigator.deviceMemory and press Enter if supported. You should see an approximate RAM value in gibibytes. This matters because low-memory devices need lighter apps.',
      'Close one heavy tab and watch the browser task manager. Memory and CPU usage should drop for that page or process, although the operating system may not show an instant drop everywhere. This matters because freeing resources is how programs stay stable over long sessions.',
    ],
    goal: 'Learn to see hardware as a budget. A well-built app uses minimum RAM, keeps CPU idle usage low, uses GPU acceleration only when helpful, and avoids unnecessary disk or network waiting.',
  },
  quiz: [
    {
      question: 'Which component handles thousands of small simultaneous calculations for animations?',
      options: ['CPU', 'RAM', 'GPU', 'SSD'],
      correctIndex: 2,
      explanation: 'The GPU is designed for massive parallel work, especially drawing pixels, textures, and animation frames. The CPU is better for general serial logic, RAM is working memory, and SSD is long-term storage.',
    },
    {
      question: 'A browser feels sluggish with high memory usage. Which resource is exhausted?',
      options: ['Long-term storage', 'Random Access Memory (RAM)', 'Network bandwidth', 'Battery'],
      correctIndex: 1,
      explanation: 'Random Access Memory is exhausted when active data grows too large. Long-term storage is disk capacity, network bandwidth affects transfer speed, and battery is power, not active workspace.',
    },
    {
      question: 'Why do developers care about multi-core CPUs?',
      options: [
        'To make the computer look better',
        'To run different parts of an app in parallel without slowing each other down',
        'To increase storage capacity',
        'To make the internet faster',
      ],
      correctIndex: 1,
      explanation: 'Multiple cores allow the operating system and browser to run separate tasks in parallel. Better looks are cosmetic, storage capacity is about disks, and internet speed depends on network bandwidth.',
    },
    {
      question: 'What happens during a Memory Leak?',
      options: [
        'The computer leaks electricity',
        'The SSD fills with junk',
        'The app keeps consuming more RAM until the system crashes',
        'The CPU overheats',
      ],
      correctIndex: 2,
      explanation: 'A memory leak means unused memory is still considered in use by the program. Over time this can exhaust RAM and crash the tab or app. It is not electricity, disk junk, or CPU heat.',
    },
    {
      question: 'What is the smallest unit of digital data?',
      options: ['A byte', 'A bit', 'A file', 'A path'],
      correctIndex: 1,
      explanation: 'A bit is one binary value, either 0 or 1. A byte is usually 8 bits, a file is a stored object, and a path is a location reference.',
    },
    {
      question: 'Which storage level is usually fastest for the CPU to access?',
      options: ['SSD', 'RAM', 'CPU cache', 'Cloud storage'],
      correctIndex: 2,
      explanation: 'CPU cache is closest to the processor and fastest. RAM is next, SSD is slower, and cloud storage is network-based and usually slowest for immediate access.',
    },
    {
      question: 'What problem do Web Workers help solve?',
      options: [
        'They make images smaller',
        'They run heavy JavaScript away from the main thread',
        'They replace the need for RAM',
        'They improve Wi-Fi speed',
      ],
      correctIndex: 1,
      explanation: 'Web Workers run scripts in background threads so the main thread can keep handling UI and user input. They do not compress images, replace RAM, or speed up Wi-Fi.',
    },
    {
      question: 'Why should hot data be cached in RAM instead of repeatedly reading from SSD?',
      options: [
        'RAM is permanent',
        'RAM is much faster than SSD',
        'SSD has no security',
        'SSD cannot store text',
      ],
      correctIndex: 1,
      explanation: 'RAM is much faster for active data, while SSD is persistent but slower. RAM is not permanent, SSD can store text, and security is not the main reason here.',
    },
    {
      question: 'What is a risk of using too many GPU layers?',
      options: [
        'It can cause layer explosion and waste GPU memory',
        'It makes the keyboard slower',
        'It deletes browser history',
        'It prevents DNS resolution',
      ],
      correctIndex: 0,
      explanation: 'Each promoted layer consumes GPU memory and compositor work. Too many layers can hurt performance. GPU layers do not affect keyboard, browser history, or DNS.',
    },
    {
      question: 'What is a key idea of Von Neumann architecture?',
      options: [
        'The CPU stores data permanently without RAM',
        'Program instructions and data can be stored together in memory',
        'The GPU replaces the CPU',
        'Files are stored only in the cloud',
      ],
      correctIndex: 1,
      explanation: 'Von Neumann architecture stores instructions and data in memory so the CPU can fetch and execute them. It is not permanent storage only, GPU replacement, or cloud-only files.',
    },
  ],
  keyTakeaways: [
    'CPU runs instructions; use Web Workers to prevent blocking.',
    'RAM is for current state; use DevTools memory snapshots to fix leaks.',
    'GPU is for parallel rendering; use CSS hardware acceleration sparingly.',
    'SSD is slow compared to RAM; use IndexedDB to cache data intelligently.',
    'All data is binary. Bits and bytes shape file sizes, network payloads, text encoding, and memory usage.',
    'The memory hierarchy explains performance. CPU cache, RAM, SSD, and network storage have very different speeds.',
    'Buses and I/O can become bottlenecks. Fast CPU does not help if the system waits on slow input or output.',
    'Von Neumann architecture explains why programs are data: CPU fetches instructions from memory.',
    'Professional performance work is budgeting: CPU time, memory, GPU layers, disk access, and network latency.',
  ],
},
{
  id: 'net-2',
  module: 'Module 1: Computer & Network Fundamentals',
  order: 2,
  title: 'Operating Systems — The Software Manager',
  icon: '⚙️',
  philosophy: 'Think of the OS as the "Game Master." It controls the rules, manages resources, and ensures your app does not crash the machine while trying to play the game. It decides which program gets CPU time, how memory is shared, which files may be opened, and how hardware is accessed. When you understand the OS, you stop seeing crashes as magic and start seeing them as resource, permission, and process decisions.',
  concepts: [
    {
      title: '1. The Kernel — The Heart of the OS',
      beginner: 'The kernel is the core control center. It starts early, talks to hardware, and checks whether programs are allowed to do things. It is like a security guard plus a traffic officer.',
      advanced: 'The kernel is the privileged core of the operating system. It manages processes, memory, scheduling, file systems, devices, and system calls. When an application wants to read a file, send network data, or create a new process, it usually requests the kernel through a system call. The kernel checks permissions, validates resources, and talks to drivers. This separation protects the machine because normal programs cannot directly touch hardware or memory owned by other programs.',
    },
    {
      title: '2. Process vs. Thread',
      beginner: 'A process is a running program, like one open game. A thread is a worker inside that program, like one helper doing a specific task. A process can have many threads.',
      advanced: 'A process is an isolated execution environment with its own virtual address space, resource handles, and security identity. A thread is a lighter sequence of execution inside a process, sharing the same heap and resources. Threads are faster to create and communicate than processes, but a bad pointer, crash, or blocking loop can affect the whole process. Browsers use multiple processes to isolate tabs, while servers often use threads or async event loops to handle many requests. Understanding this helps you diagnose crashes, memory spikes, and CPU saturation.',
    },
    {
      title: '3. Filesystems',
      beginner: 'A filesystem is the digital filing cabinet. It gives files names, puts them in folders, and remembers where things live so you can find them later.',
      advanced: 'A file system organizes data on storage media into files, directories, metadata, permissions, and allocation units. On Linux and macOS, many resources are represented like files, including devices and sockets. Paths can be absolute, starting from the root, or relative, starting from the current directory. Relative paths such as ./assets/logo.png make projects more portable across machines and environments. Developers also need to understand case sensitivity, symbolic links, file locking, and permission errors when moving code between Windows, macOS, Linux, servers, and containers.',
    },
    {
      title: '4. Virtual Memory — The Illusion of Endless RAM',
      beginner: 'Virtual memory is a neat trick. Each program thinks it has its own big block of memory. The operating system quietly moves data between RAM and storage when needed.',
      advanced: 'Virtual memory gives each process its own address space and maps virtual addresses to physical RAM using the MMU and page tables. This isolation prevents one program from easily corrupting another. When RAM is tight, the OS may move inactive pages to swap or page file on disk. This can keep programs running, but heavy swapping makes the system slow because disk is far slower than RAM. Developers see this as memory pressure, OOM kills, browser tab crashes, and slow performance when too many processes compete.',
    },
    {
      title: '5. The Scheduler — The CPU Time Manager',
      beginner: 'The scheduler is the OS time manager. It gives each program a short turn on the CPU, then moves to the next one, so many apps seem to run at once.',
      advanced: 'The scheduler decides which thread runs on which CPU core, for how long, and with what priority. It uses time slicing, preemption, queues, and load balancing. If a thread blocks on disk or network, the scheduler can switch to another ready thread. If a thread runs an endless tight loop, it may starve other work unless the OS preempts it. For developers, this explains why blocking the main thread freezes UI, why async APIs matter, and why CPU-heavy work should be isolated into workers or separate processes.',
    },
    {
      title: '6. Drivers — Hardware Translators',
      beginner: 'A driver is a translator. It helps the operating system talk to a specific piece of hardware, such as a printer, graphics card, or Wi-Fi adapter.',
      advanced: 'Drivers are software modules that implement the specific commands needed by hardware devices. They often live in or near the kernel and expose a more standard interface to the rest of the OS. A good driver hides hardware complexity; a bad or outdated driver can cause crashes, power issues, poor GPU performance, or missing devices. Developers care because graphics bugs, audio problems, USB devices, virtualization support, and performance behavior often depend on driver quality.',
    },
    {
      title: '7. Permissions and Users — The Security Fence',
      beginner: 'Permissions are like locks on doors. They decide who can read a file, change it, or run it. This keeps your private data private and your system safer.',
      advanced: 'Permissions and access control lists let the OS enforce security boundaries. On Unix-like systems, files often have read, write, and execute bits for owner, group, and others. On Windows, ACLs provide more detailed access rules. Programs should run with the least privilege needed. This is why a normal user process cannot overwrite system files, why browsers sandbox tabs, and why file access errors appear when code runs in a different user context, server, or container.',
    },
    {
      title: '8. System Interfaces — Shell, APIs, and Environment',
      beginner: 'The shell and system settings are how you give commands to the computer. You can open programs, list files, set options, and ask the OS to do work.',
      advanced: 'Operating systems expose interfaces such as shells, system calls, environment variables, services, and APIs. A terminal command like ls or dir asks the OS to read a directory. Environment variables such as PATH and NODE_ENV configure program behavior without changing code. In Node.js, process.env reads these variables. In browsers, the operating system still controls file access, networking, and process life, but the browser adds its own sandbox and web APIs. Understanding these layers helps you debug differences between local machines, CI pipelines, servers, and containers.',
    },
    {
      title: '9. Boot Process and Services — From Power to Ready',
      beginner: 'When you press the power button, the computer runs checks, starts the OS, and loads the programs you need. It is like opening the store before customers arrive.',
      advanced: 'At boot, firmware such as UEFI initializes hardware and loads the OS loader. The kernel starts, initializes drivers, mounts file systems, and launches system services or daemons. On Linux, systemd or another init system manages services. On Windows, services and user sessions start after the kernel and session manager. Developers care because startup behavior affects logs, permissions, environment variables, background agents, and why apps behave differently when run as a service versus a normal user process.',
    },
  ],
  practical: {
    title: 'The Process, File, and Permission Investigation',
    intro: 'Time to peek behind the curtain and see the OS managing processes, memory, files, and permissions.',
    steps: [
      'Open your system process viewer. On Windows press Ctrl+Shift+Esc to open Task Manager. On macOS press Cmd+Space, type Activity Monitor, and press Enter. On Linux open a terminal with Ctrl+Alt+T and run top or htop if installed. You should see running processes, CPU usage, and memory usage. This matters because the OS is actively deciding which process gets resources.',
      'Open your browser task manager. In Chrome, Edge, or Brave press Shift+Esc. If that does not work, open the browser menu, go to More tools, then Task Manager. You should see multiple rows for the browser, tabs, extensions, GPU, network, and utility processes. This matters because modern browsers use OS processes to isolate risky or heavy work.',
      'Find a browser sub-process for one tab or extension and end it. You should see only that tab, extension, or feature stop, while the rest of the browser usually stays alive. This matters because process isolation protects the whole application from one crashing part.',
      'Open a terminal. On Windows press Win+X and choose Terminal or PowerShell. On macOS press Cmd+Space, type Terminal, and press Enter. On Linux press Ctrl+Alt+T. Type pwd and press Enter to see your current folder. On Windows PowerShell, type Get-Location instead if pwd does not work. This matters because the OS tracks your current working directory for relative paths.',
      'Type ls and press Enter on macOS or Linux. On Windows use dir. You should see a list of files and folders. This matters because a directory listing is the OS giving your shell metadata about stored files.',
      'Create a safe test folder. Type mkdir os-lab and press Enter. Then type cd os-lab and press Enter. Then type echo hello > note.txt and press Enter. On macOS or Linux type cat note.txt to view the file. On Windows type type note.txt. You should see the word hello. This matters because creating, writing, and reading a file requires OS file system support and permissions.',
      'Check file permissions or access rules. On macOS or Linux type ls -l note.txt. You should see read, write, and execute flags. On Windows type icacls note.txt to see access control entries. This matters because the OS enforces who can access or modify the file.',
      'Check how long your computer has been running. On Windows open Task Manager, go to Performance, and look for Up time. On macOS or Linux open a terminal and type uptime. You should see how long the OS has been active. This matters because the boot process and system services have been running since startup, even when you do not see them.',
      'Open many browser tabs or a heavy local application again, then watch memory. If RAM becomes very full, you may see the system use swap or page file, or the browser may close a tab. This matters because virtual memory is a fallback, not a magic speed boost. Disk-based swap is much slower than real RAM.',
    ],
    goal: 'Understand that your code is one process among many. The OS manages CPU time, memory isolation, file access, permissions, drivers, and device requests. When you debug like a professional, you ask what resource, permission, or process boundary caused the behavior.',
  },
  quiz: [
    {
      question: 'What is the main job of the Kernel?',
      options: [
        'To provide a pretty desktop background',
        'To act as the bridge between software and physical hardware',
        'To play music',
        'To store your login password',
      ],
      correctIndex: 1,
      explanation: 'The kernel bridges software and hardware by managing system calls, memory, processes, and devices. Desktop backgrounds, music, and password storage are not its main job.',
    },
    {
      question: 'Why does Chrome use a separate Process per tab?',
      options: [
        'To make the computer hotter',
        'So one crashed tab does not crash the whole browser',
        'To use less RAM',
        'To make internet speed faster',
      ],
      correctIndex: 1,
      explanation: 'Separate processes isolate tabs so a crash or hang in one tab is less likely to take down the whole browser. It may use more RAM, not less, and it does not directly make internet speed faster.',
    },
    {
      question: 'What is a "System Call"?',
      options: [
        'A phone call to support',
        'A program asking the Kernel for permission to use hardware',
        'An automatic restart',
        'An error message',
      ],
      correctIndex: 1,
      explanation: 'A system call is a request from a program to the kernel for privileged operations such as file access, networking, or process creation. It is not support, restart, or an error message.',
    },
    {
      question: 'Which is a primary job of the OS?',
      options: [
        'Increasing typing speed',
        'Managing how much CPU and RAM each running app gets',
        'Fixing broken hardware',
        'Cleaning dust',
      ],
      correctIndex: 1,
      explanation: 'The OS manages resources such as CPU time, RAM, storage access, devices, and security. It does not increase typing speed, fix broken hardware, or clean dust.',
    },
    {
      question: 'What is the main purpose of virtual memory?',
      options: [
        'It makes RAM physically larger',
        'It gives each process a protected address space and can use disk when RAM is full',
        'It replaces the need for files',
        'It only exists on phones',
      ],
      correctIndex: 1,
      explanation: 'Virtual memory provides isolation and mapping between virtual and physical memory, and may use swap when RAM is scarce. It does not physically increase RAM, replace files, or exist only on phones.',
    },
    {
      question: 'What is a driver?',
      options: [
        'A person who drives',
        'A software translator that helps the OS control hardware',
        'A type of web browser',
        'A game controller',
      ],
      correctIndex: 1,
      explanation: 'A driver is software that knows how to communicate with specific hardware. It is not a person, browser, or controller by itself.',
    },
    {
      question: 'Why are relative paths useful for developers?',
      options: [
        'They look more colorful',
        'They make projects more portable across machines',
        'They give the CPU more cores',
        'They encrypt files automatically',
      ],
      correctIndex: 1,
      explanation: 'Relative paths depend on the current location instead of a fixed machine-specific location, making code easier to move. They do not affect CPU cores, appearance, or encryption.',
    },
    {
      question: 'What do file permissions do?',
      options: [
        'They make files load faster',
        'They control who can read, write, or execute files',
        'They increase screen brightness',
        'They compress images',
      ],
      correctIndex: 1,
      explanation: 'Permissions protect files and programs by controlling access. They do not improve speed, brightness, or compression.',
    },
    {
      question: 'What does the OS scheduler do?',
      options: [
        'It chooses which ready thread or process runs on the CPU',
        'It stores passwords',
        'It draws pixels',
        'It cools the CPU',
      ],
      correctIndex: 0,
      explanation: 'The scheduler assigns CPU time to ready work. Password storage, pixel drawing, and cooling are handled by other subsystems or hardware/firmware.',
    },
    {
      question: 'If a thread crashes inside a process, what can happen?',
      options: [
        'It always shuts down the computer',
        'It can crash the whole process if the thread is inside that process',
        'It never causes problems',
        'It deletes files',
      ],
      correctIndex: 1,
      explanation: 'Threads share the memory of their process, so a serious crash in one thread can bring down that process. Separate processes provide stronger isolation. It does not necessarily shut down the whole computer or delete files.',
    },
    {
      question: 'What is the general order of a modern boot process?',
      options: [
        'Browser, desktop, kernel, firmware',
        'Firmware, OS loader, kernel, services',
        'SSD, GPU, mouse, web page',
        'User login, compiler, printer, network',
      ],
      correctIndex: 1,
      explanation: 'Firmware initializes hardware and starts the OS loader, which starts the kernel, then drivers and services load. A browser or user login comes later, and hardware devices do not define the boot order by themselves.',
    },
  ],
  keyTakeaways: [
    'The Kernel is the ultimate gatekeeper of hardware.',
    'Processes = apps; Threads = workers inside those apps.',
    'Modern apps isolate tasks to prevent full-system crashes.',
    'Use relative paths so your code does not break when moved.',
    'System calls are how programs ask the OS for privileged resources.',
    'Virtual memory gives isolation and helps when RAM is full, but swapping is slow.',
    'Drivers translate between the OS and hardware devices.',
    'Permissions enforce security boundaries and least privilege.',
    'The scheduler explains why blocking code freezes apps and why async matters.',
    'Boot and services explain why system state, logs, and permissions differ after startup.',
  ],
},

  {
    id: 'net-3',
    module: 'Module 1: Computer & Network Fundamentals',
    order: 3,
    title: 'The Command Line — The Developer\'s Power Tool',
    icon: '💻',
    philosophy: 'Think of the CLI as your "Developer Console." GUIs are for users, but the command line is for creators—it gives you direct access to the machine without the "filter" of menus. When you master the terminal, you stop clicking buttons and start writing scripts that automate entire servers.',
    concepts: [
      {
        title: '1. Absolute vs Relative Paths',
        beginner: 'A path is simply the address of a file or folder on your computer. An absolute path is the full address from the very top of the computer. A relative path is like giving directions from where you are currently standing.',
        advanced: 'Absolute paths start from the root directory (`/` on Unix, `C:\` on Windows). Relative paths start from your Current Working Directory (CWD). Pro-tip: Always use relative paths in your codebase (like `./src/index.js`). If you hardcode absolute paths, your code will instantly break when deployed to a cloud server or cloned by another developer because their root directory is different.',
      },
      {
        title: '2. Standard Streams (stdin, stdout, stderr)',
        beginner: 'Imagine a machine with three pipes. Pipe 0 takes raw materials in (stdin). Pipe 1 spits out the finished product (stdout). Pipe 2 spits out error messages if something breaks (stderr).',
        advanced: 'Every CLI process opens three file descriptors: 0 (stdin), 1 (stdout), and 2 (stderr). When you use the `>` operator, you only redirect stdout (1). If a command crashes, the error still prints to your terminal because stderr (2) was not redirected. To capture both, you must use `&>` or redirect stderr explicitly with `2>`. Understanding streams is the foundation of chaining commands and building CI/CD pipelines.',
      },
      {
        title: '3. The PATH and Environment Variables',
        beginner: 'The PATH is a list of folders the computer checks to find your commands. Environment variables are like sticky notes the computer remembers while it works.',
        advanced: 'When you type `node` or `git`, the shell does not magically know where they live. It iterates through the directories listed in the `$PATH` environment variable. If a tool is not in the PATH, you get a "command not found" error. Developers constantly modify PATH in `.bashrc`, `.zshrc`, or system settings to add global CLI tools. Environment variables (like `NODE_ENV=production`) are also how you inject secrets and config into apps without hardcoding them.',
      },
      {
        title: '4. Piping and Redirection (The Unix Philosophy)',
        beginner: 'Piping (`|`) is like connecting a hose from one machine directly into another. The output of the first machine becomes the input of the second machine.',
        advanced: 'The Unix philosophy dictates that programs should do one thing well and accept text streams as input/output. The pipe operator (`|`) takes the stdout of the left command and feeds it into the stdin of the right command. For example, `cat server.log | grep "ERROR" | wc -l` reads a file, filters for errors, and counts the lines. This allows developers to build complex data processing pipelines without writing custom code.',
      },
      {
        title: '5. Permissions & Danger',
        beginner: 'Some commands are locked behind "Admin" mode for safety. The terminal will do exactly what you tell it to do, even if you tell it to destroy the house.',
        advanced: 'The CLI bypasses GUI safety nets like the Recycle Bin. `rm -rf /` is the "game-ender" command that recursively forces deletion of the root directory. Treat the terminal with respect. `sudo` (Mac/Linux) or "Run as Administrator" (Windows) elevates your process to root/kernel privileges. Use them sparingly, as a typo with `sudo` can instantly brick your operating system.',
      },
    ],
    practical: {
      title: 'Stream Routing and File Creation',
      intro: 'Level up your skills by building files, routing data, and navigating without ever touching the mouse.',
      steps: [
        'Open your Terminal (Mac/Linux) or PowerShell (Windows).',
        'Type `cd Desktop` and press Enter to move to your base camp. Type `pwd` (or `cd` in PowerShell) to verify your current absolute path.',
        'Type `mkdir code-sage-test` and press Enter to spawn a new folder. Type `cd code-sage-test` to enter it.',
        'Type `echo "Hello World" > test.txt` and press Enter. You will see no output, which means it succeeded. Type `cat test.txt` (or `type test.txt` on Windows) to verify the file contents. This matters because `>` redirects the stdout stream directly into a file.',
        'Type `ls` (or `dir`) to see your file. Now type `ls fake-folder` and press Enter. You will see an error message. This error came through the stderr pipe, not stdout.',
        'Type `ls fake-folder 2> error.log` and press Enter. The screen will be blank. Type `cat error.log` to see the error message saved in a file. You just successfully redirected the stderr stream!',
      ],
      goal: 'Prove you can navigate the machine, manipulate data streams, and understand how the OS handles input and output like a pro.',
    },
    quiz: [
      {
        question: 'How do you go up one folder level in the terminal?',
        options: ['`cd forward`', '`cd ..`', '`exit`', '`mkdir back`'],
        correctIndex: 1,
        explanation: '`..` is the universal directory alias for the "parent directory". `cd forward` is not a real command, `exit` closes the terminal session, and `mkdir back` creates a new folder named back.',
      },
      {
        question: 'Which command lists files in the current directory (Mac/Linux)?',
        options: ['`list`', '`ls`', '`show`', '`open`'],
        correctIndex: 1,
        explanation: '`ls` stands for "list" and is the standard POSIX command for directory contents. `list`, `show`, and `open` are not standard terminal commands for this purpose.',
      },
      {
        question: 'What happens when you use the `>` operator in a command?',
        options: [
          'It deletes the file',
          'It redirects the standard output (stdout) to a file',
          'It runs the command as an administrator',
          'It pipes the output to another command',
        ],
        correctIndex: 1,
        explanation: 'The `>` operator redirects file descriptor 1 (stdout) into a file, overwriting it. It does not delete files (`rm`), elevate privileges (`sudo`), or pipe to another command (`|`).',
      },
      {
        question: 'Why might you get a "command not found" error even if a tool is installed?',
        options: [
          'The internet is down',
          'The tool\'s folder is not listed in your PATH environment variable',
          'The tool is only for Mac computers',
          'You typed the command too fast',
        ],
        correctIndex: 1,
        explanation: 'The shell relies on the `$PATH` variable to locate executables. If the installation directory is missing from PATH, the shell cannot find it. It has nothing to do with internet speed, OS brand, or typing speed.',
      },
      {
        question: 'Why is the CLI considered powerful and dangerous?',
        options: [
          'It can damage the screen',
          'A wrong command can delete files or the whole OS without a confirmation prompt',
          'It uses too much RAM',
          'It blocks the internet',
        ],
        correctIndex: 1,
        explanation: 'The CLI bypasses GUI safety checks like the Recycle Bin or "Are you sure?" popups. Commands like `rm -rf` execute instantly and permanently. It does not physically damage screens, inherently consume excessive RAM, or block network access.',
      },
    ],
    keyTakeaways: [
      'Use relative paths (`./`) so your code stays portable on any machine.',
      'Master the streams: stdin (input), stdout (success output), and stderr (errors).',
      'The `$PATH` variable is how your terminal finds installed tools.',
      'Piping (`|`) and redirection (`>`) allow you to chain small tools into massive workflows.',
      'Admin commands (`sudo`) are "God Mode"—they bypass safety checks and are permanent.',
    ],
  },
  {
    id: 'net-4',
    module: 'Module 1: Computer & Network Fundamentals',
    order: 4,
    title: 'IP Addressing — The Internet\'s House Numbers',
    icon: '📍',
    philosophy: 'Think of an IP address as your device’s "Global Mailing Address." Without it, the internet wouldn’t know how to deliver data packets to your doorstep. But addressing is deeper than just one number—it involves local networks, subnets, and the physical hardware underneath.',
    concepts: [
      {
        title: '1. IPv4 vs IPv6',
        beginner: 'IPv4 looks like `192.168.1.1`. IPv6 is a much longer string of numbers and letters. We ran out of IPv4 addresses, so IPv6 was invented to give every device on Earth an address.',
        advanced: 'IPv4 uses 32-bit addresses, capping out at ~4.3 billion unique IPs. IPv6 uses 128-bit hexadecimal addresses, providing 340 undecillion addresses. While IPv4 relies heavily on NAT to survive, IPv6 restores true end-to-end connectivity. Developers must ensure their applications and databases can parse and store 128-bit IPv6 strings, as legacy 32-bit integer columns will crash.',
      },
      {
        title: '2. Public vs Private IP & NAT',
        beginner: 'Private IPs stay inside your home network; Public IPs are visible to the outside world. Your router acts as the "Receptionist," hiding your private devices behind one public address.',
        advanced: 'RFC 1918 defines private IP ranges (e.g., `192.168.x.x`, `10.x.x.x`). Because these are not routable on the public internet, your router uses Network Address Translation (NAT) to map multiple internal private IPs to a single public IP. This is a massive security buff, but it breaks peer-to-peer connections, which is why WebRTC requires STUN/TURN servers to "punch holes" through NAT.',
      },
      {
        title: '3. Subnetting and CIDR Notation',
        beginner: 'Imagine a giant pizza. Subnetting is just slicing the pizza into smaller, manageable pieces so different groups of people can eat without fighting. A "/24" just means "this slice has 256 seats available."',
        advanced: 'Subnetting divides a larger IP network into smaller sub-networks using CIDR (Classless Inter-Domain Routing) notation. A `/24` subnet mask (255.255.255.0) leaves 8 bits for host addresses, yielding 256 total IPs. Developers encounter this constantly in cloud VPCs (Virtual Private Clouds), Docker networking, and Kubernetes pod CIDRs. Understanding CIDR prevents IP overlap errors when connecting microservices.',
      },
      {
        title: '4. MAC Addresses vs IP Addresses',
        beginner: 'An IP address is like your mailing address—it can change if you move. A MAC address is like your fingerprint or Social Security Number—it is burned into your device at the factory and never changes.',
        advanced: 'IP addresses operate at Layer 3 (Network) and handle logical routing across the globe. MAC addresses operate at Layer 2 (Data Link) and handle physical delivery within a local network (LAN). When a packet arrives at your router, the router strips the old MAC address and stamps its own MAC address on it before handing it to your PC via ARP (Address Resolution Protocol).',
      },
      {
        title: '5. Localhost and the Loopback Address',
        beginner: 'Localhost is your computer talking to itself. It\'s like sending a letter to your own house. The address is always `127.0.0.1`.',
        advanced: 'The `127.0.0.0/8` block is reserved for loopback. Traffic sent to `127.0.0.1` never leaves the network interface card; it is routed internally by the OS kernel. Developers use this to run local databases and servers. Mapping `localhost` to `127.0.0.1` happens in the local `hosts` file. IPv6 uses `::1` for its loopback address.',
      },
    ],
    practical: {
      title: 'Network Topology Inspection',
      intro: 'Time to see your machine’s mailing address, trace the roads to the internet, and check your hardware fingerprint.',
      steps: [
        'Find your Private IP and MAC Address: Open terminal and type `ipconfig /all` (Windows) or `ifconfig` / `ip addr` (Mac/Linux). Look for "IPv4 Address" and "Physical Address" (MAC). This matters because this is your local identity on the LAN.',
        'Find your Public IP: Search "What is my IP?" in your browser. Compare it to your private IP. Notice they are different? That’s NAT in action shielding your local network.',
        'Test Localhost: Open terminal and type `ping 127.0.0.1` and press Enter. You should see replies with `<1ms` time. This matters because it proves your OS network stack is functioning perfectly without needing a router or internet.',
        'Trace the Route: Type `tracert 8.8.8.8` (Windows) or `traceroute 8.8.8.8` (Mac/Linux). You will see a list of "hops" (routers) your packet visits to reach Google. This matters because it visualizes the physical and logical path your data takes across the internet.',
      ],
      goal: 'Understand the difference between your local hardware ID (MAC), your local network ID (Private IP), and your global identity (Public IP).',
    },
    quiz: [
      {
        question: 'Which addressing system provides the most unique addresses?',
        options: ['IPv4', 'IPv6', 'MAC', 'Subnet'],
        correctIndex: 1,
        explanation: 'IPv6 uses 128-bit addressing, providing virtually infinite addresses. IPv4 is limited to 32 bits, MAC addresses are 48 bits and only for local hardware, and Subnetting is a way to divide IPs, not an addressing system itself.',
      },
      {
        question: 'Who acts as the "Receptionist" to assign private IPs and hide them behind one public IP?',
        options: ['The web browser', 'The router (via NAT)', 'The CPU', 'The DNS server'],
        correctIndex: 1,
        explanation: 'The router uses Network Address Translation (NAT) to map multiple private internal IPs to a single public IP. Browsers, CPUs, and DNS servers do not handle local network routing or NAT.',
      },
      {
        question: 'What is the primary purpose of the `127.0.0.1` address?',
        options: [
          'To connect to the nearest Wi-Fi router',
          'To allow the computer to send network traffic to itself (Loopback)',
          'To broadcast a message to all devices on the network',
          'To connect to Google\'s public DNS',
        ],
        correctIndex: 1,
        explanation: '`127.0.0.1` is the IPv4 loopback address, used for internal testing and local servers. It does not connect to routers, broadcast to networks, or reach external DNS servers.',
      },
      {
        question: '`192.168.1.5` is an example of what?',
        options: ['Public IP', 'Private IP (RFC 1918)', 'MAC address', 'IPv6 address'],
        correctIndex: 1,
        explanation: '`192.168.x.x` is a standard private IP range defined by RFC 1918 for local networks. It is not routable on the public internet, not a 48-bit MAC address, and not a hexadecimal IPv6 address.',
      },
      {
        question: 'What is the main difference between an IP address and a MAC address?',
        options: [
          'IP is for wireless; MAC is for cables',
          'IP handles logical routing across networks; MAC handles physical delivery on a local network',
          'IP addresses are permanent; MAC addresses change every day',
          'MAC addresses are only used by Apple computers',
        ],
        correctIndex: 1,
        explanation: 'IP (Layer 3) handles global logical routing, while MAC (Layer 2) handles physical hardware delivery within a LAN. Both work on wired and wireless, IP changes while MAC is burned-in, and MAC is used by all hardware brands.',
      },
    ],
    keyTakeaways: [
      'IPv6 was created to solve the IPv4 32-bit address shortage.',
      'Public IP = your router\'s internet address; Private IPs = local device identities hidden by NAT.',
      'Subnetting (CIDR) slices networks into manageable pieces; crucial for cloud and Docker configs.',
      'MAC addresses are physical hardware IDs (Layer 2); IP addresses are logical routing IDs (Layer 3).',
      'Localhost (`127.0.0.1`) is the OS loopback interface for internal network testing.',
    ],
  },
  {
    id: 'net-5',
    module: 'Module 1: Computer & Network Fundamentals',
    order: 5,
    title: 'DNS & DHCP — The Internet\'s Phonebook',
    icon: '📒',
    philosophy: 'Think of DNS as the Internet’s Contact List. Humans love names, but machines speak in numbers. DNS translates names to IPs, while DHCP is the invisible assistant that assigns those IDs automatically. When the internet "breaks," 90% of the time, it is a DNS issue.',
    concepts: [
      {
        title: '1. The DNS Lookup Chain',
        beginner: 'You type a website name; the internet "magically" finds the right server. It\'s a relay race: your computer asks the router, the router asks the ISP, the ISP asks the root servers, until the final IP is found.',
        advanced: 'The resolution path is: Browser Cache → OS Cache → ISP Recursive Resolver → Root Nameservers (.) → TLD Nameservers (.com) → Authoritative Nameserver. Every stop caches the result based on TTL (Time To Live). Developers must understand this chain to debug propagation delays and DNS hijacking.',
      },
      {
        title: '2. Common DNS Records',
        beginner: 'Different record types act as specialized entries in the phonebook. Some point to websites, some point to mail servers, and some prove you own the domain.',
        advanced: 'Master these keys: `A` (Maps to IPv4), `AAAA` (Maps to IPv6), `CNAME` (Alias to another domain), `MX` (Mail server routing), and `TXT` (Verification/SPF/DKIM). Misconfiguring an MX record drops emails; misconfiguring a CNAME can break SSL certificate generation.',
      },
      {
        title: '3. DNS Propagation and TTL',
        beginner: 'When you change a website\'s address in the phonebook, it takes time for all the phonebooks around the world to update. This waiting time is called propagation.',
        advanced: 'TTL (Time To Live) dictates how long a DNS record is cached by resolvers, measured in seconds. A TTL of 3600 means resolvers will cache the IP for one hour before asking again. When migrating servers, developers lower the TTL to 300 (5 minutes) days in advance to ensure rapid global propagation when the actual IP swap occurs.',
      },
      {
        title: '4. The Local Hosts File Override',
        beginner: 'The `hosts` file is a secret VIP list your computer checks *before* it calls the internet\'s phonebook. If you put a website on this list and point it to a fake address, your computer will never call the real website.',
        advanced: 'The local `hosts` file (`/etc/hosts` on Unix, `C:\Windows\System32\drivers\etc\hosts` on Windows) overrides external DNS resolution. The OS checks this file first. Developers use it to map production domains to `127.0.0.1` for local testing, block telemetry domains, or test SSL certificates locally before DNS propagation completes.',
      },
      {
        title: '5. DHCP — Auto IP Assignment',
        beginner: 'Your device automatically gets an IP when it joins a network. It asks for an address, the router offers one, and they agree on a time limit (a lease).',
        advanced: 'DHCP operates via the DORA process: Discover (broadcast), Offer (router proposes IP), Request (client accepts), Acknowledge (router finalizes). It leases IPs from a defined pool. In enterprise networks, DHCP reservations map specific MAC addresses to static IPs, ensuring printers and servers always get the same local address.',
      },
    ],
    practical: {
      title: 'Trace, Flush, and Override DNS',
      intro: 'Time to see the "translation" happening in real-time and learn how to hack your local phonebook.',
      steps: [
        'Open your terminal and run `nslookup google.com` (or `dig google.com` on Mac/Linux). Observe the server that answered and the IP address it returned.',
        'Run `ping google.com`. Notice how it resolves the name to an IP before pinging. This proves DNS is working silently in the background.',
        'Flush your OS DNS cache: Type `ipconfig /flushdns` (Windows) or `sudo dscacheutil -flushcache` (Mac). This forces your computer to forget old IPs and fetch fresh ones.',
        'Open your `hosts` file as Administrator (Windows: Notepad as Admin -> `C:\Windows\System32\drivers\etc\hosts`; Mac/Linux: `sudo nano /etc/hosts`).',
        'Add this line at the bottom: `127.0.0.1 facebook.com`. Save the file. Open your browser and try to visit facebook.com. It will fail to load. You just successfully intercepted DNS at the OS level!',
        'Remove the line from the `hosts` file to restore access.',
      ],
      goal: 'Realize that DNS is not magic; it is a distributed, cached database that you can inspect, flush, and override locally.',
    },
    quiz: [
      {
        question: 'What is the primary role of DNS?',
        options: [
          'Encrypts your private traffic',
          'Translates human-readable domain names into IP addresses',
          'Boosts your CPU performance',
          'Assigns MAC addresses to hardware',
        ],
        correctIndex: 1,
        explanation: 'DNS (Domain Name System) resolves domain names to IP addresses. It does not encrypt traffic (TLS does), boost CPU, or assign MAC addresses (which are factory burned-in).',
      },
      {
        question: 'Which DNS record is used to map a domain to an IPv4 address?',
        options: ['MX', 'CNAME', 'A', 'TXT'],
        correctIndex: 2,
        explanation: 'The `A` (Address) record maps a domain to an IPv4 address. `MX` is for mail, `CNAME` is for aliases, and `TXT` is for text verification.',
      },
      {
        question: 'What does the TTL (Time To Live) value in DNS control?',
        options: [
          'How long the domain name registration lasts before you have to pay again',
          'How long resolvers and browsers are allowed to cache the DNS record',
          'The physical distance the data packet can travel',
          'The speed of the internet connection',
        ],
        correctIndex: 1,
        explanation: 'TTL dictates the cache duration in seconds. It has nothing to do with domain registration billing cycles, physical packet distance, or connection bandwidth.',
      },
      {
        question: 'What happens if you map `google.com` to `127.0.0.1` in your local `hosts` file?',
        options: [
          'Your internet speed doubles',
          'Your browser will try to load Google from your own computer and fail',
          'Google will block your IP address globally',
          'The DNS server will crash',
        ],
        correctIndex: 1,
        explanation: 'The OS checks the `hosts` file before querying DNS. It will route traffic for google.com to your local loopback interface (`127.0.0.1`), where no web server is running, causing a connection refused error. It does not affect global routing or external DNS servers.',
      },
      {
        question: 'What is the correct order of the DHCP "DORA" process?',
        options: [
          'Direct, Offer, Route, Acknowledge',
          'Discover, Offer, Request, Acknowledge',
          'Download, Open, Read, Archive',
          'Disconnect, Offer, Reconnect, Assign',
        ],
        correctIndex: 1,
        explanation: 'DHCP uses Discover (client broadcast), Offer (server proposes IP), Request (client accepts), and Acknowledge (server finalizes lease). The other acronyms are fabricated.',
      },
    ],
    keyTakeaways: [
      'DNS acts as the distributed phonebook of the internet (Name → IP).',
      'Learn your records: A, AAAA, CNAME, MX, and TXT are developer essentials.',
      'TTL controls caching; lower it before migrations to speed up propagation.',
      'The local `hosts` file overrides DNS, perfect for local testing and blocking.',
      'DHCP (DORA process) automates local IP assignment so you don\'t have to configure every device manually.',
    ],
  },
  {
    id: 'net-6',
    module: 'Module 1: Computer & Network Fundamentals',
    order: 6,
    title: 'The OSI Model — How Data Travels',
    icon: '🌐',
    philosophy: 'Think of the OSI Model as the "Shipping Pipeline." Data doesn\'t just teleport; it passes through 7 distinct stations. If your app breaks, this model helps you pinpoint exactly which station is failing. "Is it a physical cable issue, a routing issue, or a code issue?" The OSI model gives you the vocabulary to know.',
    concepts: [
      {
        title: '1. The Upper Layers (7, 6, 5): Application, Presentation, Session',
        beginner: 'Layer 7 is the app you see (the browser). Layer 6 translates languages and locks the box (encryption). Layer 5 sets up the phone call and keeps it connected.',
        advanced: 'Layer 7 (Application) is where HTTP, DNS, and FTP live—it\'s the user-facing protocol. Layer 6 (Presentation) handles data formatting, compression, and encryption (TLS/SSL). Layer 5 (Session) manages the establishment, maintenance, and teardown of communication sessions (like NetBIOS or RPC). When a browser throws a "Certificate Error," it is a Layer 6 failure.',
      },
      {
        title: '2. The Transport Layer (Layer 4): TCP vs UDP',
        beginner: 'Layer 4 is the delivery truck. TCP is a careful driver who gets a signature for every package (reliable). UDP is a pizza delivery guy who throws the box on your porch and drives off (fast, but might drop a slice).',
        advanced: 'Layer 4 handles end-to-end delivery and multiplexing via Ports. TCP (Transmission Control Protocol) guarantees delivery, ordering, and error-checking via a 3-way handshake (SYN, SYN-ACK, ACK). It is mandatory for HTTP and databases. UDP (User Datagram Protocol) is connectionless and stateless, offering pure speed with zero guarantees. It is mandatory for WebRTC, live video, and gaming.',
      },
      {
        title: '3. The Network Layer (Layer 3): IP Routing',
        beginner: 'Layer 3 is the GPS system. It looks at the destination address (IP) and figures out the best route across the world to get the package to the right city.',
        advanced: 'Layer 3 handles logical addressing (IP) and routing across different networks. Routers operate here, reading the destination IP and consulting routing tables to forward packets. ICMP (Ping) and IPSec also live here. If you can ping a server but cannot load the website, Layer 3 is working, but Layer 4 or 7 is failing.',
      },
      {
        title: '4. The Local Layers (2 & 1): Data Link & Physical',
        beginner: 'Layer 2 is the local mailman who reads the house name (MAC address) and drops it in the right mailbox. Layer 1 is the actual road, the truck, or the physical cable carrying the box.',
        advanced: 'Layer 2 (Data Link) handles physical addressing (MAC addresses), framing, and local switching (Ethernet/Wi-Fi). Switches operate here. Layer 1 (Physical) is the raw transmission of bits over copper cables, fiber optics, or radio waves. If a cable is unplugged or Wi-Fi is jammed, it is a Layer 1 failure.',
      },
      {
        title: '5. Encapsulation (The Envelope Trick)',
        beginner: 'Each layer wraps your data in its own envelope. By the time it leaves your computer, your message is inside 5 nested envelopes. The server opens them one by one.',
        advanced: 'As data moves down the stack, it is encapsulated: Data (L7-5) → Segment (L4, adds TCP/UDP header) → Packet (L3, adds IP header) → Frame (L2, adds MAC header) → Bits (L1). The receiving machine de-encapsulates it in reverse. Wireshark allows developers to see these exact headers and diagnose where a packet is being dropped.',
      },
    ],
    practical: {
      title: 'Inspect the Pipeline in DevTools',
      intro: 'Time to see the 7 layers in your own browser and test the physical and network layers.',
      steps: [
        'Open any website and press F12 → Network tab. Reload the page and click on the first HTML request.',
        'Look at the "Headers" tab. The HTTP methods and status codes are Layer 7 (Application). The TLS certificate info is Layer 6 (Presentation).',
        'Look at "Remote Address". That is the Layer 3 (Network) IP address. The port number (like `:443`) is Layer 4 (Transport).',
        'Open your terminal and type `ping google.com`. This uses ICMP to test Layer 3 (Network) connectivity. If it replies, the physical cables (L1), local switches (L2), and global routers (L3) are all working perfectly.',
        'Type `tracert google.com` (Windows) or `traceroute google.com` (Mac). Watch the packet hop from router to router. Each hop is a Layer 3 device making a routing decision.',
      ],
      goal: 'Realize that a single mouse click triggers encapsulation across all 7 layers in just a few milliseconds, and learn how to isolate which layer is broken.',
    },
    quiz: [
      {
        question: 'Which protocol favors speed over perfect accuracy and operates at Layer 4?',
        options: ['HTTP', 'TCP', 'UDP', 'IP'],
        correctIndex: 2,
        explanation: 'UDP (User Datagram Protocol) is connectionless and drops packets for speed, ideal for streaming/gaming. TCP guarantees delivery. HTTP is Layer 7, and IP is Layer 3.',
      },
      {
        question: 'On which OSI layer does HTTP and DNS live?',
        options: ['Physical (1)', 'Network (3)', 'Transport (4)', 'Application (7)'],
        correctIndex: 3,
        explanation: 'HTTP and DNS are Application layer protocols (Layer 7) because they provide services directly to the user application. They rely on the lower layers to actually move the data.',
      },
      {
        question: 'What does the Network layer (Layer 3) primarily handle?',
        options: ['Encrypting passwords', 'Routing packets using IP addresses across different networks', 'Rendering HTML', 'Managing physical cables'],
        correctIndex: 1,
        explanation: 'Layer 3 handles logical IP addressing and routing between different networks. Encryption is Layer 6, HTML is Layer 7, and physical cables are Layer 1.',
      },
      {
        question: 'If you can successfully "ping" a server, but the website won\'t load in your browser, which layers are confirmed working?',
        options: [
          'Only Layer 7',
          'Layers 1, 2, and 3 (Physical, Data Link, Network)',
          'All 7 layers',
          'Only Layer 4',
        ],
        correctIndex: 1,
        explanation: 'Ping uses ICMP (Layer 3). If it succeeds, the physical connection (L1), local MAC routing (L2), and global IP routing (L3) are working. The failure must be at Layer 4 (Port blocked) or Layer 7 (HTTP server down).',
      },
      {
        question: 'What is the process of adding headers to data as it moves down the OSI stack called?',
        options: ['Decryption', 'Encapsulation', 'Routing', 'Handshaking'],
        correctIndex: 1,
        explanation: 'Encapsulation is the process of wrapping data with protocol headers at each layer (Segment, Packet, Frame). Decryption is Layer 6, Routing is Layer 3, and Handshaking is Layer 4/5.',
      },
    ],
    keyTakeaways: [
      'The OSI Model has 7 layers. Memorize them to isolate network bugs (e.g., "Is it a DNS issue or a cable issue?").',
      'Layer 7 (App), Layer 4 (Transport/TCP/UDP), and Layer 3 (Network/IP) are the most critical for web developers.',
      'TCP = Reliability (HTTP, DBs); UDP = Speed (Video, Gaming).',
      'Encapsulation wraps data in headers at every step; Wireshark lets you see these envelopes.',
      'If Ping works but HTTP fails, the lower layers are fine; check your firewall ports (L4) or server code (L7).',
    ],
  },
  {
    id: 'net-7',
    module: 'Module 1: Computer & Network Fundamentals',
    order: 7,
    title: 'Protocols — The Rules of the Road',
    icon: '🛣️',
    philosophy: 'Think of protocols as the "Languages of the Internet." If two computers don\'t speak the same protocol, they’re just two strangers passing in the night. Mastering these rules is what makes your apps fast, secure, and capable of real-time communication.',
    concepts: [
      {
        title: '1. HTTP & HTTPS — The Web Foundation',
        beginner: 'HTTP fetches website pages; HTTPS is the secure, encrypted version. Never use plain HTTP for anything important today.',
        advanced: 'HTTPS is HTTP wrapped in a TLS encryption jacket. Modern browsers flag HTTP as "Insecure," and APIs like Geolocation or Service Workers flat-out reject non-HTTPS contexts. HTTP is stateless; every request is independent. Understand HTTP methods (GET, POST, PUT, DELETE) and status codes (200 OK, 404 Not Found, 500 Server Error) to debug API failures.',
      },
      {
        title: '2. WebSockets — Real-Time Persistence',
        beginner: 'HTTP is like sending a letter: you ask, get an answer, and the conversation ends. WebSockets are like a phone call: you connect once, and both sides can talk instantly without hanging up.',
        advanced: 'While HTTP is a stateless request/response protocol, WebSockets (`ws://` or `wss://`) provide a persistent, full-duplex TCP connection. After an initial HTTP Upgrade handshake, the connection stays open, allowing the server to push data to the client with near-zero latency. This is mandatory for chat apps, live dashboards, and multiplayer games, avoiding the massive overhead of HTTP polling.',
      },
      {
        title: '3. SSH & SFTP — Server Management',
        beginner: 'SSH is for logging into remote computers securely; SFTP is for moving files securely. Never use plain FTP.',
        advanced: 'SSH (Secure Shell, Port 22) provides an encrypted terminal session to run commands on a server. SFTP (SSH File Transfer Protocol) uses the same encrypted tunnel to move files. Plain FTP (Port 21) broadcasts passwords in clear text and should be considered completely compromised. Always use SSH keys instead of passwords for server authentication.',
      },
      {
        title: '4. SMTP / IMAP — The Mailroom',
        beginner: 'SMTP is for sending mail; IMAP is for reading mail. If your app sends emails, it uses SMTP.',
        advanced: 'When your app sends a "Forgot Password" email, it talks via SMTP (Port 587/465). However, sending the email is only half the battle. To prevent it from landing in spam, you must configure DNS records: SPF (who is allowed to send), DKIM (cryptographic signature), and DMARC (what to do if it fails).',
      },
      {
        title: '5. Ports and Sockets — The Endpoints',
        beginner: 'If an IP address is the apartment building, a Port is the specific apartment number. It tells the computer exactly which app should receive the data.',
        advanced: 'A socket is the combination of an IP address and a Port number (e.g., `192.168.1.5:443`). Ports range from 0 to 65535. Well-known ports are 80 (HTTP), 443 (HTTPS), 22 (SSH), and 3306 (MySQL). Firewalls block unauthorized ports. When a Node.js server crashes with "EADDRINUSE," it means another process is already bound to that specific port socket.',
      },
    ],
    practical: {
      title: 'Protocol Inspection and Handshakes',
      intro: 'Time to see your machine’s active connections and manually speak HTTP to a server.',
      steps: [
        'Open your terminal and run `netstat -an` (Windows/Mac/Linux) or `Get-NetTCPConnection` in PowerShell. Scan the "Local Address" and "Foreign Address" columns.',
        'Look for port numbers: `:443` (HTTPS), `:80` (HTTP), and `:22` (SSH). Notice the "ESTABLISHED" or "LISTENING" states. This is Layer 4 in action.',
        'Open a browser, load a new site, and run the command again—you’ll see a brand new "live connection" appear instantly on port 443.',
        'Type `curl -I https://google.com` and press Enter. The `-I` flag asks for only the HTTP Headers (Layer 7). You will see the server\'s response code (HTTP/2 200) and security headers before the HTML body even downloads.',
      ],
      goal: 'Realize that your machine is constantly opening and closing sockets across dozens of different protocols, and learn how to inspect the raw HTTP handshake.',
    },
    quiz: [
      {
        question: 'Which is the secure, encrypted version of HTTP?',
        options: ['HTTP2', 'HTTPS', 'FTP', 'SMTP'],
        correctIndex: 1,
        explanation: 'HTTPS (HTTP Secure) wraps HTTP in TLS encryption. HTTP/2 is a faster version of HTTP but not inherently encrypted by itself. FTP is for files, and SMTP is for mail.',
      },
      {
        question: 'Why are WebSockets preferred over HTTP Polling for a live chat application?',
        options: [
          'They use less battery on mobile devices',
          'They maintain a persistent, open connection allowing instant two-way data push',
          'They automatically translate languages',
          'They bypass the need for IP addresses',
        ],
        correctIndex: 1,
        explanation: 'WebSockets keep a single TCP connection open for full-duplex communication, eliminating the massive overhead of repeatedly opening and closing HTTP connections (polling). They still require IP addresses and do not translate languages.',
      },
      {
        question: 'What is the primary use of SSH?',
        options: ['Sending mass emails', 'Securely logging into a remote server\'s shell', 'Loading website assets', 'Streaming high-def video'],
        correctIndex: 1,
        explanation: 'SSH (Secure Shell) provides an encrypted command-line interface to remote servers. SMTP sends emails, HTTP loads assets, and UDP/RTP handles streaming.',
      },
      {
        question: 'If your server crashes with an "EADDRINUSE" error, what happened?',
        options: [
          'The server ran out of RAM',
          'Another program is already using the network port your app wants to bind to',
          'The internet connection was lost',
          'The database password was incorrect',
        ],
        correctIndex: 1,
        explanation: 'EADDRINUSE means "Error: Address Already in Use." A socket (IP + Port) can only be bound to one process at a time. It is not a RAM, network drop, or database auth issue.',
      },
      {
        question: 'Why must developers avoid plain FTP?',
        options: [
          'It is technically slower than other protocols',
          'It transmits your login credentials and files in plain text',
          'It only works on Apple Mac machines',
          'It consumes excessive system RAM',
        ],
        correctIndex: 1,
        explanation: 'Plain FTP (Port 21) sends usernames, passwords, and data unencrypted, making it trivial for attackers on the network to intercept. SFTP or SCP should always be used instead.',
      },
    ],
    keyTakeaways: [
      'HTTPS encrypts HTTP—it is the mandatory baseline for all modern web traffic.',
      'WebSockets provide persistent, real-time, two-way communication without HTTP overhead.',
      'Always use SSH/SFTP over insecure FTP for server management and file transfers.',
      'SMTP sends mail, but DNS records (SPF/DKIM/DMARC) are what protect your sender reputation.',
      'Ports are apartment numbers for IP addresses; "EADDRINUSE" means the port is already taken.',
    ],
  },
  {
    id: 'net-8',
    module: 'Module 1: Computer & Network Fundamentals',
    order: 8,
    title: 'Web Security Basics — The Shield',
    icon: '🛡️',
    philosophy: 'Think of security as your app’s "Armor." It isn\'t a luxury; it\'s the foundation. A single weak point can end a startup, leak user data, and destroy trust. We learn the patterns of the "defenders" to stop the "intruders" before they get in.',
    concepts: [
      {
        title: '1. Encryption (TLS / SSL)',
        beginner: 'The digital lock on your data that keeps eavesdroppers from reading your secrets while it travels across the internet.',
        advanced: 'TLS (Transport Layer Security) starts with an asymmetric "handshake" using public/private keys to securely agree on a shared secret. Then, it switches to a high-speed symmetric cipher for the actual data transfer. The lock icon in your browser proves the server presented a valid certificate signed by a trusted Certificate Authority (CA).',
      },
      {
        title: '2. Authentication vs Authorization',
        beginner: 'Authentication is "Who are you?" (checking your ID). Authorization is "What are you allowed to do?" (checking if your ID lets you into the VIP room).',
        advanced: 'Never store plaintext passwords—use `bcrypt`, `scrypt`, or `argon2` to hash them with a unique salt. For Authorization, use Role-Based Access Control (RBAC) or JWTs (JSON Web Tokens). A common flaw is Broken Access Control, where a standard user manually changes a URL parameter to access an admin endpoint because the server forgot to check Authorization.',
      },
      {
        title: '3. The Big Three Attacks (XSS, SQLi, CSRF)',
        beginner: 'Hackers try to trick your app using malicious inputs. XSS injects fake scripts, SQL Injection tricks your database, and CSRF tricks users into clicking things they didn\'t mean to.',
        advanced: 'XSS (Cross-Site Scripting) executes malicious JS in the victim\'s browser; prevent it by escaping output and using CSP. SQL Injection manipulates database queries; prevent it by using Parameterized Queries or ORMs. CSRF (Cross-Site Request Forgery) forces an authenticated user to execute an action; prevent it using Anti-CSRF tokens and the `SameSite=Strict` cookie attribute.',
      },
      {
        title: '4. CORS (Cross-Origin Resource Sharing)',
        beginner: 'A security guard stopping a website from stealing data from another website. CORS is the special permission slip the bank gives if they actually *want* to share that data.',
        advanced: 'The Same-Origin Policy (SOP) prevents a malicious script on Origin A from reading sensitive data from Origin B. CORS relaxes SOP. The backend must explicitly opt-in by sending the `Access-Control-Allow-Origin` HTTP header. If a frontend developer sees a "CORS error" in DevTools, it means the backend API failed to send the correct permission headers for the frontend\'s domain.',
      },
      {
        title: '5. Content Security Policy (CSP)',
        beginner: 'CSP is a strict dress code for your website. It tells the browser, "Only allow pictures from our server, and never run any JavaScript unless it\'s in a file we wrote."',
        advanced: 'CSP is an HTTP header (`Content-Security-Policy`) that mitigates XSS by declaring approved sources of content. By restricting `script-src` to `\'self\'` and specific trusted CDNs, and disabling `unsafe-inline`, you render most injected XSS payloads inert. It shifts security from purely sanitizing input to strictly controlling the browser\'s execution environment.',
      },
    ],
    practical: {
      title: 'Inspect the Armor and Trigger a CORS Error',
      intro: 'Time to put on your detective hat, inspect a site\'s TLS armor, and intentionally trigger a security block.',
      steps: [
        'Click the lock icon next to any URL in your browser → "Connection is secure" → "Certificate is valid." Check the issuer (e.g., Let\'s Encrypt) and expiration.',
        'Open DevTools (F12) → Security tab: Peek at the TLS version (should be TLS 1.2 or 1.3) and the specific cipher suite being used.',
        'Try visiting `http://neverssl.com`—observe how your browser warns you because the "Armor" (TLS) is missing.',
        'Open DevTools → Console on any site. Type `fetch(\'https://api.github.com\')` and press Enter. You will likely see a "CORS error" in red text. This is the browser\'s Same-Origin Policy blocking your local page from reading GitHub\'s API without permission.',
        'Open DevTools → Network tab, reload the page, and click the first HTML request. Look at the "Response Headers". Search for `Content-Security-Policy` or `Strict-Transport-Security` (HSTS). These are the invisible shields protecting the site.',
      ],
      goal: 'Develop a "security instinct." You should feel uneasy on plain HTTP, understand why CORS blocks happen, and know how to verify a site\'s cryptographic armor.',
    },
    quiz: [
      {
        question: 'What is the key difference between Authentication and Authorization?',
        options: [
          'They mean exactly the same thing',
          'Authentication = "Who are you?"; Authorization = "What are you permitted to do?"',
          'Authentication = Passwords; Authorization = Usernames',
          'Authentication is only required for system administrators',
        ],
        correctIndex: 1,
        explanation: 'Authentication verifies identity (login). Authorization verifies permissions (access control). You can be authenticated (logged in) but not authorized to view an admin page.',
      },
      {
        question: 'Why must you hash passwords with bcrypt instead of storing them as plain text?',
        options: [
          'It saves disk space on your server',
          'If the database is leaked, attackers cannot easily reverse the hash to read the actual passwords',
          'It makes the login process faster for the user',
          'Web browsers require hashed passwords to function',
        ],
        correctIndex: 1,
        explanation: 'Bcrypt is a slow, one-way hashing algorithm with built-in salting. If hackers steal the database, they cannot easily reverse the hashes. It does not save space, speed up login, or relate to browser requirements.',
      },
      {
        question: 'What is XSS (Cross-Site Scripting)?',
        options: [
          'A specific type of high-speed network cable',
          'Injecting malicious scripts into a webpage viewed by other users',
          'A faster, more efficient version of HTTPS',
          'A standardized backup file format',
        ],
        correctIndex: 1,
        explanation: 'XSS occurs when an attacker injects client-side scripts into web pages viewed by others, stealing cookies or performing actions. It is not a cable, HTTPS version, or backup format.',
      },
      {
        question: 'If your frontend gets a "CORS Error" when fetching data from your backend, what is the most likely fix?',
        options: [
          'Change your database password',
          'Configure the backend server to send the `Access-Control-Allow-Origin` header',
          'Buy a more expensive internet router',
          'Rewrite the frontend in Python',
        ],
        correctIndex: 1,
        explanation: 'CORS is enforced by the browser. The backend must explicitly allow the frontend\'s domain by sending the correct CORS HTTP headers. It is not a database, hardware, or language issue.',
      },
      {
        question: 'What does a Content Security Policy (CSP) header primarily protect against?',
        options: [
          'DDoS attacks',
          'Cross-Site Scripting (XSS) and data injection attacks',
          'Slow internet speeds',
          'Forgotten passwords',
        ],
        correctIndex: 1,
        explanation: 'CSP restricts where the browser can load resources (scripts, images) from, effectively neutralizing most injected XSS payloads. It does not stop network-level DDoS attacks or speed up the internet.',
      },
    ],
    keyTakeaways: [
      'Always serve your app over HTTPS (TLS)—it is the baseline for trust and modern browser APIs.',
      'Hash passwords with `bcrypt`/`argon2`—never store them in plain text.',
      'Treat all user input as "radioactive": Validate, escape, and use Parameterized Queries to prevent XSS and SQLi.',
      'CORS is a browser security feature; backend servers must explicitly opt-in to allow cross-origin reads.',
      'Implement Content Security Policy (CSP) headers to create a strict execution environment against XSS.',
    ],
  },

  {
    id: 'net-9',
    module: 'Module 1: Computer & Network Fundamentals',
    order: 9,
    title: 'The Browser — Where the Web Lives',
    icon: '🌍',
    philosophy: 'Think of the browser as your app’s "Execution Arena." It is one of the most complex, highly-optimized machines ever built. It is not just a window that shows pictures; it is a full operating system, a database, and a rendering engine. Understanding how it paints pixels and schedules code is the exact difference between a "laggy, amateur site" and a "buttery-smooth professional experience."',
    concepts: [
      {
        title: '1. The Rendering Engine (The Pixel Factory)',
        beginner: 'The browser has an inner team of artists and builders. They read your HTML to build the skeleton (DOM), read your CSS to pick the clothes (CSSOM), combine them, calculate exactly where everything goes on the screen, and finally paint the pixels.',
        advanced: 'The rendering pipeline is strict: Parse HTML (DOM) + Parse CSS (CSSOM) → Render Tree → Layout (Reflow/Geometry) → Paint (Rasterization) → Composite (GPU Layering). "Layout Thrashing" happens when JavaScript repeatedly reads layout properties (like `offsetHeight`) and then changes the DOM, forcing the browser to recalculate the geometry synchronously on the main thread. This is the #1 cause of choppy scrolling and jank. Always batch DOM reads and writes.',
      },
      {
        title: '2. The JavaScript Engine (V8 / SpiderMonkey)',
        beginner: 'Computers only understand 1s and 0s, not JavaScript. The JS Engine is a live translator that reads your human code and turns it into machine code while the app is running, optimizing it on the fly to make it blazing fast.',
        advanced: 'Chrome uses V8, which employs JIT (Just-In-Time) compilation. It first interprets code quickly, then identifies "hot" functions that run often and compiles them into highly optimized machine code using "Hidden Classes" and inline caching. It also runs a Garbage Collector (Mark-and-Sweep) in the background to free up memory. Firefox uses SpiderMonkey, and Safari uses JavaScriptCore. They all follow the ECMAScript standard, but their internal optimization strategies differ wildly.',
      },
      {
        title: '3. The Event Loop (The Traffic Controller)',
        beginner: 'JavaScript can only do one thing at a time. The Event Loop is the traffic controller that decides which task goes next. It makes sure your clicks, animations, and network requests all get a turn without freezing the screen.',
        advanced: 'JS is single-threaded, meaning it has one Call Stack. The Event Loop constantly checks: Is the Call Stack empty? If yes, it pushes tasks from the queues. Crucially, it prioritizes the Microtask Queue (Promises, `queueMicrotask`) over the Macrotask Queue (`setTimeout`, `setInterval`, UI events). A resolved Promise will *always* execute before a `setTimeout(..., 0)`. If you block the Call Stack with a heavy `while` loop, the Event Loop halts, and the entire UI freezes (jank).',
      },
      {
        title: '4. Browser Storage (The Memory Banks)',
        beginner: 'The browser has built-in lockers to remember things. Cookies are tiny notes sent to the server. LocalStorage is a bigger locker that stays forever. SessionStorage is a temporary locker that empties when you close the tab.',
        advanced: 'Choose your weapon carefully: Cookies (max 4KB, sent with every HTTP request, use `HttpOnly` and `Secure` flags for auth tokens), LocalStorage (sync API, ~5MB limit, persists forever, vulnerable to XSS), SessionStorage (tab-scoped, clears on close), and IndexedDB (async, massive structured data, uses transactions). Modern apps also use the Cache API to store entire network responses for offline support via Service Workers.',
      },
      {
        title: '5. Service Workers (The Offline Intercepters)',
        beginner: 'A Service Worker is a special background script that acts like a proxy. It can intercept your network requests and serve files from a hidden cache, allowing your website to work even when the internet is completely turned off!',
        advanced: 'Service Workers run on a separate thread, completely isolated from the DOM. They intercept `fetch` events, allowing developers to implement advanced caching strategies (Cache First, Network First, Stale While Revalidate). They are the foundational technology for PWAs (Progressive Web Apps), push notifications, and background sync. They require HTTPS to run, ensuring the "man-in-the-middle" cannot inject malicious offline code.',
      },
    ],
    practical: {
      title: 'Spy on the Engine and Freeze the Loop',
      intro: 'Time to peek into the browser\'s memory banks and intentionally break the Event Loop to see how it works.',
      steps: [
        'Open DevTools (F12) → Application tab → Storage → Local Storage. Click on any domain to see the "keys" and "values" websites have saved on your machine. This matters because this is your app\'s persistent client-side database.',
        'Open the Console and type `localStorage.setItem("test", "hello")`. Refresh the page and run `localStorage.getItem("test")`. The browser remembered your data! This matters because LocalStorage survives page reloads and browser restarts.',
        'Now, let\'s freeze the Event Loop. In the Console, type: `let i = 0; while(i < 10000000000) { i++; }` and press Enter. Try to hover over buttons or scroll the page. You will see the UI is completely frozen and unresponsive. This matters because you just blocked the single Call Stack; the Event Loop cannot process mouse events until the math finishes.',
        'Go to the Network tab, check "Disable cache", and reload a site. Click on an image request. Look at the "Initiator" column. This matters because it tells you exactly which line of JavaScript or HTML triggered the browser\'s network stack to fetch that asset.',
        'In the Application tab, look at the "Service Workers" section on the left. If you are on a modern PWA (like Twitter or Starbucks), you will see one registered and running. This matters because that script is currently intercepting your network requests in the background.',
      ],
      goal: 'Understand that the browser is a complex pipeline of rendering, memory, and scheduling. Your job as a developer is to feed it data efficiently without blocking the main Event Loop.',
    },
    quiz: [
      {
        question: 'Which JS engine powers the Google Chrome and Node.js environments?',
        options: ['SpiderMonkey', 'V8', 'JavaScriptCore', 'Chakra'],
        correctIndex: 1,
        explanation: 'V8 is the open-source JS engine developed by Google, used in Chrome and Node.js. SpiderMonkey is Firefox, JavaScriptCore is Safari, and Chakra was the legacy Edge engine. They all run JS, but V8 is the specific engine for Chrome.',
      },
      {
        question: 'Why does a Promise resolve before a `setTimeout(..., 0)`, even though the timeout is zero?',
        options: [
          'Promises are natively faster at executing code',
          'The Event Loop processes the Microtask Queue (Promises) completely before checking the Macrotask Queue (setTimeout)',
          'setTimeout is broken in modern browsers',
          'Promises run on a separate CPU core',
        ],
        correctIndex: 1,
        explanation: 'The Event Loop specification dictates that all Microtasks (Promises) must be drained before the next Macrotask (setTimeout, setInterval) is executed. It is about queue priority, not native execution speed, browser bugs, or CPU cores.',
      },
      {
        question: 'What is "Layout Thrashing" in the rendering engine?',
        options: [
          'When the server sends the wrong CSS file',
          'When JavaScript repeatedly reads and writes DOM geometry, forcing the browser to constantly recalculate layouts synchronously',
          'When the user resizes the browser window too fast',
          'When the GPU runs out of memory',
        ],
        correctIndex: 1,
        explanation: 'Layout thrashing occurs when JS forces synchronous layout calculations (like reading `offsetHeight`) right after mutating the DOM. It is a main-thread performance killer. It is not caused by server CSS, user resizing, or GPU memory limits.',
      },
      {
        question: 'Which storage method is sent to the server with *every single HTTP request*?',
        options: ['LocalStorage', 'SessionStorage', 'Cookies', 'IndexedDB'],
        correctIndex: 2,
        explanation: 'Cookies are automatically attached to the `Cookie` header of every HTTP request to the matching domain. LocalStorage, SessionStorage, and IndexedDB are strictly client-side and are never sent over the network automatically.',
      },
      {
        question: 'What is the primary superpower of a Service Worker?',
        options: [
          'It makes the CPU run 10x faster',
          'It intercepts network requests in the background, enabling offline caching and push notifications',
          'It automatically fixes JavaScript syntax errors',
          'It compresses images before they are uploaded',
        ],
        correctIndex: 1,
        explanation: 'Service Workers act as a client-side proxy, intercepting `fetch` requests to serve cached assets offline. They do not alter CPU speed, fix syntax errors, or automatically compress image uploads.',
      },
    ],
    keyTakeaways: [
      'The Render Pipeline is strict: DOM + CSSOM → Layout → Paint → Composite. Avoid Layout Thrashing.',
      'JS Engines use JIT compilation to optimize "hot" code paths on the fly.',
      'The Event Loop prioritizes Microtasks (Promises) over Macrotasks (setTimeout). Never block the main thread.',
      'Choose storage wisely: Cookies for auth (HttpOnly), LocalStorage for simple sync data, IndexedDB for heavy structured data.',
      'Service Workers intercept network requests, enabling powerful offline experiences and PWAs.',
    ],
  },
  {
    id: 'net-10',
    module: 'Module 1: Computer & Network Fundamentals',
    order: 10,
    title: 'Servers & The Cloud — Where the Web Lives',
    icon: '☁️',
    philosophy: 'Think of "The Cloud" not as a magical vapor in the sky, but as "someone else’s computer"—millions of high-performance machines in giant, air-conditioned warehouses. As a professional developer, your job is to package your code and ship it to these remote machines so they can serve your app to the world reliably, securely, and at massive scale.',
    concepts: [
      {
        title: '1. What is a Server?',
        beginner: 'A server is just a computer that stays powered on 24/7, locked in a closet, specifically designed to answer incoming requests from other computers.',
        advanced: 'While the hardware is similar to a PC, servers are optimized for "uptime," massive I/O, and concurrency. They run headless (no monitor) and use specialized software like Nginx, Node.js, or PostgreSQL. Modern servers use event-driven, non-blocking I/O (like `epoll` in Linux) to handle tens of thousands of simultaneous connections without spawning a new thread for each one.',
      },
      {
        title: '2. The Cloud Tiers (IaaS, PaaS, SaaS, Serverless)',
        beginner: 'Instead of buying a server, you rent one. IaaS is renting the raw metal. PaaS is renting a pre-configured room where you just drop your code. SaaS is renting a finished app like Gmail. Serverless is renting a chef who only cooks when you order food.',
        advanced: 'Know your stack: IaaS (AWS EC2—you manage the OS and runtime), PaaS (Vercel/Heroku—you push code, they manage the infrastructure), SaaS (Salesforce/Gmail). "Serverless" (AWS Lambda) is actually FaaS (Function as a Service); it scales to zero when idle and spins up containers per-request, meaning you only pay for exact execution milliseconds, but you must manage "cold starts."',
      },
      {
        title: '3. Static vs Dynamic Sites',
        beginner: 'Static sites are pre-printed brochures handed out to everyone. Dynamic sites are custom letters written on the spot just for you.',
        advanced: 'Static sites (SSG) are pre-built HTML/CSS/JS files pushed to a CDN. They are insanely fast, cheap, and secure because there is no database or server-side code to hack. Dynamic sites (SSR) run code at the moment of request (database queries, user auth). Modern "Full Stack" frameworks (Next.js, Nuxt) blur this line by serving static shells and dynamically injecting personalized data via API calls.',
      },
      {
        title: '4. CDN (Content Delivery Network)',
        beginner: 'A CDN is a network of "clone" servers stored in cities all over the world. Instead of a user in Tokyo downloading a picture from your New York server, the CDN hands it to them from a server right down the street in Tokyo.',
        advanced: 'CDNs (Cloudflare, Fastly, AWS CloudFront) use Edge Locations and Anycast routing to serve static assets from the physically closest node. They cut latency 5–10x. They also provide massive DDoS protection and SSL termination. Developers must master `Cache-Control` headers (like `max-age`, `s-maxage`, `stale-while-revalidate`) to tell the CDN exactly how long to hold onto a file before asking the origin server for a fresh copy.',
      },
      {
        title: '5. Reverse Proxies & Load Balancers',
        beginner: 'A reverse proxy is like a receptionist at a giant hospital. You don\'t go straight to the doctor; you go to the desk, and they route you to the next available doctor. This keeps the doctors from getting overwhelmed.',
        advanced: 'A Reverse Proxy (like Nginx or HAProxy) sits in front of your backend servers. It handles SSL termination (decrypting HTTPS), compresses responses, caches static files, and routes traffic. A Load Balancer distributes incoming traffic across multiple servers using algorithms like Round Robin or Least Connections, and performs "Health Checks" to automatically remove crashed servers from the rotation.',
      },
    ],
    practical: {
      title: 'Inspect the Cloud and CDN Headers',
      intro: 'Time to see who is actually serving your web requests and prove the CDN is working.',
      steps: [
        'Open DevTools (F12) → Network tab. Reload any major site (like github.com or vercel.com) and click the very first HTML request.',
        'Navigate to the "Headers" tab → "Response Headers." Look for clues like `server: cloudflare`, `cf-ray:`, or `x-vercel-id:`. This matters because it proves the request was intercepted by a cloud provider\'s edge network, not just a single raw server.',
        'Look for the `cache-control` header. You might see `public, max-age=31536000, immutable`. This matters because it tells the browser and CDN, "Keep this file for a year, it will never change." This is how sites load instantly on the second visit.',
        'Open your terminal and type `ping google.com`. Note the time (e.g., 20ms). Now type `ping 8.8.8.8` (Google\'s DNS). Compare the physical distance. This matters because it shows the literal speed-of-light delay (latency) between your house and the remote data center.',
      ],
      goal: 'Understand that every click you make triggers a lightning-fast journey through load balancers, CDNs, and reverse proxies before it ever touches the actual application code.',
    },
    quiz: [
      {
        question: 'What is the primary advantage of a "Serverless" (FaaS) architecture like AWS Lambda?',
        options: [
          'It does not use any physical computers',
          'It scales to zero when idle, meaning you only pay for exact execution time, but you must manage cold starts',
          'It is always faster than a traditional server',
          'It automatically writes your code for you',
        ],
        correctIndex: 1,
        explanation: 'Serverless still runs on physical servers, but the provider manages them. It scales to zero (no idle costs) but suffers from "cold starts" (latency when spinning up a new container). It does not write code or guarantee faster execution than a well-tuned dedicated server.',
      },
      {
        question: 'What is the main role of a Reverse Proxy like Nginx?',
        options: [
          'To hide the client\'s IP address from the internet',
          'To sit in front of backend servers, handle SSL termination, cache assets, and route traffic',
          'To compile JavaScript into machine code',
          'To act as the primary database for the app',
        ],
        correctIndex: 1,
        explanation: 'A reverse proxy protects and optimizes backend servers by handling SSL, load balancing, and caching. A *forward* proxy hides the client. It does not compile JS or act as a database.',
      },
      {
        question: 'Why is a Static Site (SSG) generally faster and more secure than a purely Dynamic Site (SSR)?',
        options: [
          'Static sites use a special "fast" version of HTML',
          'Static sites are pre-built into flat files and served via CDN, eliminating database queries and server-side code execution on every request',
          'Dynamic sites are blocked by modern browsers',
          'Static sites do not require an internet connection',
        ],
        correctIndex: 1,
        explanation: 'Static sites serve pre-rendered HTML/CSS/JS directly from edge CDNs, bypassing the need for a live server to query a database for every user. There is no "fast HTML" version, dynamic sites aren\'t blocked, and all sites need the internet.',
      },
      {
        question: 'What does the `Cache-Control: max-age=3600` header tell the CDN and browser?',
        options: [
          'The file is 3600 megabytes in size',
          'The file is considered fresh and can be served from cache for 3600 seconds (1 hour) before checking the origin server again',
          'The server will shut down in 3600 seconds',
          'The file is encrypted with a 3600-bit key',
        ],
        correctIndex: 1,
        explanation: '`max-age` is defined in seconds. It dictates how long the asset is considered "fresh" in the cache. It has nothing to do with file size, server uptime, or encryption keys.',
      },
      {
        question: 'If a user in Tokyo visits a site hosted in New York without a CDN, what is the primary cause of the slow load time?',
        options: [
          'The Tokyo internet cables are broken',
          'Latency: The physical speed-of-light delay for data to travel across the Pacific Ocean and back',
          'The New York server is asleep',
          'The browser in Japan does not understand English HTML',
        ],
        correctIndex: 1,
        explanation: 'Latency is the time it takes for a packet to travel physically. A CDN solves this by putting a copy in Tokyo. It is not caused by broken cables, sleeping servers (they are 24/7), or language barriers in HTML.',
      },
    ],
    keyTakeaways: [
      'Servers are always-on, headless computers optimized for massive concurrency and uptime.',
      '"The Cloud" is renting computing power: IaaS (raw metal), PaaS (managed runtime), Serverless (pay-per-execution).',
      'Static sites (SSG) are pre-built for speed and security; dynamic sites (SSR) are built on-the-fly for personalization.',
      'CDNs cache assets at the "Edge" (close to the user) to destroy latency. Master `Cache-Control` headers.',
      'Reverse Proxies and Load Balancers protect your backend servers by handling SSL, caching, and traffic distribution.',
    ],
  },
  {
    id: 'net-11',
    module: 'Module 1: Computer & Network Fundamentals',
    order: 11,
    title: 'Ports & Sockets — The Virtual Doorways',
    icon: '🔌',
    philosophy: 'If the IP address is the apartment building, the Port is the specific apartment number. Sockets are the actual "doorways" that allow your software to send and receive data. Without understanding ports, your server will be a locked vault, and your apps will constantly crash with "Address Already in Use" errors.',
    concepts: [
      {
        title: '1. Port Numbers (The Virtual Doors)',
        beginner: 'A port is a virtual doorway (numbered 0 to 65535) on your computer. It tells the operating system exactly which app should receive the incoming data. Mail goes to door 25, web pages go to door 80.',
        advanced: 'Ports are divided into three ranges: Well-Known (0–1023, reserved for system services like HTTP/80, SSH/22), Registered (1024–49151, used by user applications like PostgreSQL/5432), and Dynamic/Ephemeral (49152–65535). Never bind your custom app to a well-known port, or the OS will block it for security reasons.',
      },
      {
        title: '2. Sockets (The Data Pipes)',
        beginner: 'A socket is the actual plug your app uses to connect to the wall outlet (the port). It is the endpoint that lets your JavaScript or Python code talk to the network.',
        advanced: 'In the OS kernel, a socket is a file descriptor. A full socket connection is defined by a 5-tuple: Protocol (TCP/UDP), Local IP, Local Port, Remote IP, Remote Port. When a server "listens" on a port, it is waiting for a client to connect. WebSockets build on top of TCP sockets to create a persistent, full-duplex pipe.',
      },
      {
        title: '3. Listening vs. Connecting',
        beginner: 'The server "listens" at a specific door, waiting for a knock. The client "connects" by knocking on that door from a random, temporary door of their own.',
        advanced: 'A server calls `bind()` to claim a specific well-known port, then `listen()` to queue incoming connections, and `accept()` to handle them. A client does not need a specific port; the OS automatically assigns it a random "Ephemeral Port" from the high range to use for the duration of the chat. This is how your browser can have 50 tabs open to the same server simultaneously.',
      },
      {
        title: '4. Port Forwarding & NAT',
        beginner: 'Your home router has one public address. If you want to run a Minecraft server in your bedroom, you have to tell the router, "If anyone knocks on the front door asking for Minecraft, send them down the hall to my bedroom."',
        advanced: 'Because of NAT (Network Address Translation), devices on a local network do not have public IPs. To expose a local server (like `localhost:3000`) to the internet, you must configure Port Forwarding on the router, mapping an external public port to your internal private IP and port. Alternatively, developers use tunneling tools like Ngrok or Cloudflare Tunnels to bypass router config entirely.',
      },
    ],
    practical: {
      title: 'Hunt for Open Ports and Ephemeral Connections',
      intro: 'See exactly what doorways your computer is currently listening to, and what random doors your browser is using.',
      steps: [
        'Open your terminal. On Windows type `netstat -an | findstr LISTEN`. On Mac/Linux type `lsof -i -P -n | grep LISTEN`. You will see a list of local ports in a "LISTEN" state. This matters because these are the servers currently running on your machine.',
        'Look for port `:3000`, `:8080`, or `:5432`. If you see them, you have a local dev server or database running. If you try to start another one on that same port, you will get an "EADDRINUSE" error.',
        'Now, open your web browser and visit any site. Keep the tab open.',
        'Run the command again, but look for "ESTABLISHED" connections instead of LISTEN. You will see your local IP connected to a remote IP on port 443.',
        'Look at the *local* port number your computer is using for that connection (e.g., `192.168.1.5:54321`). Notice it is a very high number (an Ephemeral Port). This matters because it proves your OS assigned a random temporary door for the browser to receive the server\'s reply.',
      ],
      goal: 'Identify the active doorways your computer uses, understand why port collisions happen, and see ephemeral ports in action.',
    },
    quiz: [
      {
        question: 'Which port range is strictly reserved for system-level, well-known services (like HTTP and SSH)?',
        options: ['0–1023', '3000–5000', '49152–65535', 'Any range is fine'],
        correctIndex: 0,
        explanation: 'Ports 0–1023 are Well-Known Ports and require root/admin privileges to bind. 3000-5000 are common user ports, and 49152-65535 are ephemeral/dynamic ports used by clients.',
      },
      {
        question: 'What happens when you try to start a Node.js server on a port that is already in use?',
        options: [
          'The OS automatically moves it to the next available port',
          'The app crashes with an "EADDRINUSE" (Address Already in Use) error',
          'The computer reboots to clear the port',
          'It shares the port with the other app perfectly',
        ],
        correctIndex: 1,
        explanation: 'A TCP port can only be bound to one listening process at a time. The OS will reject the second attempt with EADDRINUSE. It does not auto-assign, reboot, or share the port.',
      },
      {
        question: 'What is an "Ephemeral Port"?',
        options: [
          'A port used permanently by the web server',
          'A temporary, high-numbered port automatically assigned by the OS to a client making an outgoing connection',
          'A port that only works on Wi-Fi',
          'A port used to encrypt data',
        ],
        correctIndex: 1,
        explanation: 'When a client (like a browser) connects to a server, the OS assigns it a random ephemeral port from the high range to receive the reply. It is temporary and released when the connection closes. Servers use well-known ports, not ephemeral ones.',
      },
      {
        question: 'What exactly is a "Socket" in networking terms?',
        options: [
          'The physical plastic hole you plug the ethernet cable into',
          'The software endpoint defined by an IP address and a Port number',
          'A type of database table',
          'A JavaScript framework for building UI',
        ],
        correctIndex: 1,
        explanation: 'A socket is the software abstraction (file descriptor) representing the endpoint of a network connection, defined by the IP and Port. The physical hole is an RJ45 port, not a network socket.',
      },
      {
        question: 'If you want to show your local `localhost:3000` app to a client over the internet without configuring your home router, what tool should you use?',
        options: [
          'A CDN like Cloudflare',
          'A tunneling tool like Ngrok or Cloudflare Tunnels',
          'The `ping` command',
          'LocalStorage',
        ],
        correctIndex: 1,
        explanation: 'Tunneling tools create a secure outbound connection to a public server, which then routes public traffic back down the tunnel to your local port. CDNs cache static files, ping tests connectivity, and LocalStorage is browser memory.',
      },
    ],
    keyTakeaways: [
      'IP = Building Address; Port = Specific apartment doorway (0-65535).',
      'Ports 0–1023 are strictly reserved for system services; use high ports for your apps.',
      'A Socket is the software endpoint (IP + Port) that allows code to talk to the network.',
      'Clients use random "Ephemeral Ports" to connect; Servers "Listen" on fixed Well-Known ports.',
      'Use `netstat` or `lsof` to debug "EADDRINUSE" errors and see active connections.',
    ],
  },
  {
    id: 'net-12',
    module: 'Module 1: Computer & Network Fundamentals',
    order: 12,
    title: 'The Complete Request Journey',
    icon: '🚀',
    philosophy: 'Every time you type a URL and press Enter, a miniature "epic quest" begins. Data travels through the labyrinth of the internet, crossing oceans and passing through dozens of routers to fetch your content. Understanding this exact journey is how you stop guessing and start debugging exactly why a site is slow or failing to load.',
    concepts: [
      {
        title: '1. The Setup (DNS Resolution)',
        beginner: 'The browser checks its own memory first. If it doesn\'t know the address, it asks the computer, then the router, then the ISP, until it finds the IP address of the website.',
        advanced: 'The resolution chain is: Browser Cache → OS Cache (`hosts` file) → Router Cache → ISP Recursive Resolver → Root/TLD/Authoritative Servers. If the domain doesn\'t exist, you get an `NXDOMAIN` error. If the DNS server is down, you get a `DNS_PROBE_FINISHED_BAD_CONFIG` error in the browser.',
      },
      {
        title: '2. The Handshake (TCP & TLS)',
        beginner: 'Before sending the actual message, the browser and server do a quick "hello" to agree on how to talk, and then they lock the briefcase with a digital key so no one can spy on them.',
        advanced: 'First, the TCP 3-way handshake (SYN → SYN-ACK → ACK) establishes a reliable connection. Then, the TLS handshake occurs (ClientHello, ServerHello, Certificate Exchange, Key Exchange). TLS 1.3 reduced this to a 1-RTT (Round Trip Time) handshake, making HTTPS nearly as fast as HTTP. If the certificate is expired or self-signed, the browser throws a `NET::ERR_CERT_AUTHORITY_INVALID` error.',
      },
      {
        title: '3. The Request & Response (HTTP)',
        beginner: 'The browser sends a formal letter asking for a specific page. The server reads it, does the work, and sends back a status code (like "200 OK" or "404 Not Found") along with the actual page.',
        advanced: 'The client sends an HTTP Request (Method, Path, Headers, Body). The server processes it (routing, DB queries) and returns an HTTP Response (Status Code, Headers, Body). Status codes are critical: 2xx (Success), 3xx (Redirect), 4xx (Client Error - e.g., 401 Unauthorized, 404 Not Found), 5xx (Server Error - e.g., 500 Internal Server Error, 502 Bad Gateway).',
      },
      {
        title: '4. The Return Journey & Multiplexing',
        beginner: 'The data doesn\'t just teleport back. It hops from router to router. Modern browsers are smart: instead of making a new phone call for every single image, they keep one line open and ask for 50 things at the exact same time.',
        advanced: 'Packets route back via BGP (Border Gateway Protocol). In HTTP/1.1, browsers had to open 6 parallel TCP connections to download assets because of "head-of-line blocking." HTTP/2 introduced Multiplexing, allowing unlimited requests over a single TCP connection. HTTP/3 (QUIC) moves this to UDP, completely eliminating TCP head-of-line blocking and making connections survive network switches (like Wi-Fi to Cellular).',
      },
    ],
    practical: {
      title: 'Dissect the Network Waterfall',
      intro: 'Visualize the exact anatomy of a network request in your browser and find out where the lag is hiding.',
      steps: [
        'Open DevTools (F12) → Network tab. Check "Disable cache" to force a fresh journey.',
        'Reload the page and click the very first HTML document request in the list.',
        'Click the "Timing" tab. You will see the exact breakdown of the journey. This matters because this is how professionals diagnose slow websites.',
        'Look at "Queueing" and "Stalled". This is the browser waiting for a free TCP socket or prioritizing other requests.',
        'Look at "DNS Lookup", "Initial Connection" (TCP), and "SSL" (TLS). If these are high, the server is physically far away or the handshake is slow.',
        'Look at "Waiting for server response" (This is TTFB - Time To First Byte). If this is high (e.g., > 500ms), the network is fine, but the backend code or database is slow.',
        'Look at "Content Download". If this is high, the file is too large and needs compression or a CDN.',
      ],
      goal: 'Stop saying "the site is slow." Start saying "The TTFB is high because the database query is slow," or "The SSL handshake is slow because we need to upgrade to TLS 1.3."',
    },
    quiz: [
      {
        question: 'What does a high TTFB (Time To First Byte) in the DevTools Timing tab indicate?',
        options: [
          'The user\'s internet download speed is very slow',
          'The backend server is taking a long time to process the request and generate the first byte of the response',
          'The images on the page are too large',
          'The DNS lookup failed completely',
        ],
        correctIndex: 1,
        explanation: 'TTFB measures the time from the request being sent to the first byte arriving. A high TTFB means the backend (code, DB, SSR) is slow. Download speed affects the "Content Download" phase, not TTFB. DNS is a separate phase.',
      },
      {
        question: 'What problem did HTTP/2 Multiplexing solve?',
        options: [
          'It encrypted the data for the first time',
          'It allowed multiple requests and responses to happen simultaneously over a single TCP connection, eliminating head-of-line blocking',
          'It compressed images automatically',
          'It replaced the need for DNS',
        ],
        correctIndex: 1,
        explanation: 'HTTP/1.1 suffered from head-of-line blocking, requiring multiple TCP connections. HTTP/2 multiplexes streams over one connection. Encryption is TLS, compression is Brotli/Gzip, and DNS is still required.',
      },
      {
        question: 'If a user types a URL and gets a "502 Bad Gateway" error, whose fault is it?',
        options: [
          'The user typed the wrong password',
          'The frontend browser crashed',
          'The reverse proxy or load balancer could not get a valid response from the backend origin server',
          'The domain name does not exist',
        ],
        correctIndex: 2,
        explanation: 'A 502 error means the edge server (proxy/load balancer/CDN) is working, but the upstream backend server it tried to contact crashed, timed out, or returned garbage. It is not a client auth error (401), browser crash, or DNS error (NXDOMAIN).',
      },
      {
        question: 'Why is TLS 1.3 significantly faster than TLS 1.2?',
        options: [
          'It uses weaker encryption that requires less math',
          'It reduces the handshake to 1-RTT (Round Trip Time) by combining steps',
          'It bypasses the need for a TCP connection',
          'It only works on local networks',
        ],
        correctIndex: 1,
        explanation: 'TLS 1.3 optimized the handshake process to 1-RTT (and supports 0-RTT resumption), cutting the latency of establishing a secure connection in half compared to TLS 1.2. It uses stronger encryption, still requires TCP (or QUIC in HTTP/3), and works globally.',
      },
      {
        question: 'What happens if the DNS resolution fails during the request journey?',
        options: [
          'The browser shows a 404 Not Found page',
          'The browser shows a "Server Not Found" or DNS Probe error, and the TCP handshake never begins',
          'The server returns a 500 error',
          'The browser automatically guesses the IP address',
        ],
        correctIndex: 1,
        explanation: 'If DNS fails, the browser has no IP address to connect to. The journey stops at step 1. A 404 means DNS worked but the file is missing. A 500 means the server crashed. Browsers do not guess IPs.',
      },
    ],
    keyTakeaways: [
      'The Request Journey: DNS Lookup → TCP Handshake → TLS Handshake → HTTP Request → Server Processing → HTTP Response.',
      'TTFB (Time To First Byte) is the ultimate metric for backend server health and database speed.',
      'HTTP/2 Multiplexing and HTTP/3 (QUIC) solve head-of-line blocking, making modern web loading insanely fast.',
      'Status codes tell the exact story: 4xx means the client messed up; 5xx means the server messed up.',
      'Use the DevTools Network "Timing" tab to isolate exactly which phase of the journey is causing lag.',
    ],
  },
  {
    id: 'net-13',
    module: 'Module 1: Computer & Network Fundamentals',
    order: 13,
    title: 'Network Troubleshooting Tools',
    icon: '🛠️',
    philosophy: 'When the internet acts like a black box and your app fails to load, these CLI tools are your flashlight. Amateurs guess and restart the router. Professionals use `ping`, `traceroute`, and `curl` to mathematically prove exactly which cable, router, or server is broken. If you can\'t ping it, you can\'t reach it.',
    concepts: [
      {
        title: '1. Ping — "Are you there?"',
        beginner: 'Ping sends a tiny, invisible "pulse" to a server and waits for an echo. It tells you if the server is awake and exactly how far away it is in milliseconds.',
        advanced: 'Ping uses the ICMP (Internet Control Message Protocol) Echo Request/Reply. It measures Latency (round-trip time) and Packet Loss. High latency means physical distance or congestion. Packet loss means a router along the path is dropping data. Note: Some firewalls block ICMP, so a failed ping doesn\'t *always* mean the server is dead.',
      },
      {
        title: '2. Traceroute — "The Map"',
        beginner: 'Traceroute draws a map of every single "hop" (router) your data visits on its way to the destination. If the map stops at hop #5, you know exactly whose fault it is.',
        advanced: 'Traceroute works by manipulating the TTL (Time To Live) field in the IP header. It sends a packet with TTL=1. The first router drops it and replies with an "ICMP Time Exceeded" error, revealing its IP. Then it sends TTL=2, then TTL=3, mapping the entire path. Asterisks (`* * *`) mean a router is configured to silently drop ICMP packets (stealth mode).',
      },
      {
        title: '3. Curl — "The Direct Request"',
        beginner: 'Curl is a web browser that lives inside the terminal. It fetches web data directly without drawing any pictures, making it the fastest way to test if an API is working.',
        advanced: '`curl` is the ultimate HTTP debugging tool. Use `curl -I` to fetch only the HTTP headers (checking status codes and CORS). Use `curl -v` (verbose) to see the exact TCP/TLS handshake and raw request/response bytes. Use `curl -X POST -H "Content-Type: application/json" -d \'{"key":"value"}\'` to manually test API endpoints without writing frontend code.',
      },
      {
        title: '4. Dig / Nslookup — "The Phonebook Inspector"',
        beginner: 'These tools let you manually look up a domain name in the internet\'s phonebook to see what IP address it is currently pointing to.',
        advanced: '`dig` (Domain Information Groper) is the professional standard for DNS debugging. Use `dig google.com A` to check IPv4, `dig MX` for mail servers. Crucially, use `dig @8.8.8.8 google.com` to bypass your local ISP cache and ask Google\'s public DNS server directly. This is how you prove if a DNS change has actually propagated globally.',
      },
      {
        title: '5. Netstat / ss — "The Socket Spy"',
        beginner: 'These tools show you every single active conversation your computer is having with the outside world, and which app is having it.',
        advanced: '`netstat` (or the modern Linux equivalent `ss`) displays socket statistics, routing tables, and interface data. Use `netstat -tulpn` (Linux) or `netstat -ano` (Windows) to map a listening port directly to the Process ID (PID) that owns it. This is the only way to kill a "ghost" process that is holding your development port hostage.',
      },
    ],
    practical: {
      title: 'Diagnose a Dead Connection',
      intro: 'Time to use the professional toolkit to map your journey and inspect raw HTTP headers.',
      steps: [
        'Open your terminal. Type `ping google.com` and press Enter. Watch the `time=XXms` values. If you see "Request timed out" or 100% packet loss, your local network or ISP is down.',
        'Type `traceroute google.com` (Mac/Linux) or `tracert google.com` (Windows). Watch the hops. If it fails at Hop 1, your local router is the problem. If it fails at Hop 10, your ISP\'s backbone is the problem.',
        'Type `curl -I https://google.com`. You will see the raw HTTP headers, including `HTTP/2 200`. This matters because it proves the server is alive and responding, even if your browser is failing to render it.',
        'Type `curl -v https://google.com`. Watch the verbose output. You will literally see the `* TLSv1.3 handshake` happening in real-time. This matters because it proves the encryption layer is functioning.',
        'Type `dig google.com`. Look at the "ANSWER SECTION" to see the IP. Now type `dig @1.1.1.1 google.com` to ask Cloudflare\'s DNS directly. Compare the results to check for DNS propagation issues.',
      ],
      goal: 'Stop guessing. Use ICMP to test reachability, TTL manipulation to map the path, and raw HTTP clients to verify server logic.',
    },
    quiz: [
      {
        question: 'How does the `traceroute` command map the path to a server?',
        options: [
          'It sends a GPS signal to every router',
          'It sends packets with increasing TTL (Time To Live) values, forcing each router along the path to return an error message',
          'It asks the destination server for a list of all connected routers',
          'It reads the physical serial numbers of the cables',
        ],
        correctIndex: 1,
        explanation: 'Traceroute manipulates the IP TTL field. When a router decrements TTL to 0, it drops the packet and sends back an ICMP Time Exceeded message, revealing its IP. It does not use GPS, ask the destination, or read physical cables.',
      },
      {
        question: 'What does "Request timed out" in a ping test usually mean?',
        options: [
          'The server is too fast for your computer',
          'The packet was dropped by a firewall, or the destination is offline/unreachable',
          'Your password is incorrect',
          'The internet is too congested to send text',
        ],
        correctIndex: 1,
        explanation: 'A timeout means the ICMP Echo Reply never came back. This happens if the target is dead, the network is broken, or a firewall is silently dropping ICMP packets. It has nothing to do with speed, passwords, or text congestion.',
      },
      {
        question: 'How can `curl -I` help a developer debug a broken website?',
        options: [
          'It automatically fixes the HTML code',
          'It fetches only the HTTP headers, allowing you to check status codes, CORS, and caching without downloading the whole page',
          'It clears the browser cache',
          'It restarts the remote server',
        ],
        correctIndex: 1,
        explanation: '`curl -I` sends a HEAD request, returning only headers. This is perfect for checking if a server is returning a 200 OK, a 301 Redirect, or a 500 Error, without wasting bandwidth on the body. It does not fix code, clear cache, or restart servers.',
      },
      {
        question: 'Why would a developer use `dig @8.8.8.8 mysite.com` instead of just `ping mysite.com`?',
        options: [
          'To bypass the local ISP cache and query Google\'s public DNS server directly to check global propagation',
          'To make the website load faster',
          'To encrypt the DNS request',
          'To find the physical address of the server',
        ],
        correctIndex: 0,
        explanation: 'Specifying `@8.8.8.8` forces the tool to ask Google\'s DNS instead of the local OS/ISP cache. This is critical for verifying if a recent DNS record change has actually propagated across the internet. It does not affect speed, encryption, or physical location.',
      },
      {
        question: 'What protocol does the `ping` command use under the hood?',
        options: ['ICMP', 'TCP', 'UDP', 'HTTP'],
        correctIndex: 0,
        explanation: 'Ping uses ICMP (Internet Control Message Protocol), which is a network-layer protocol designed for diagnostics and error reporting. It does not use TCP (connection-oriented), UDP (connectionless data), or HTTP (web pages).',
      },
    ],
    keyTakeaways: [
      'Ping (ICMP) tests basic reachability and latency. Beware of firewalls blocking it.',
      'Traceroute manipulates TTL to map the exact physical and logical path, isolating ISP outages.',
      'Curl is your raw HTTP scalpel. Use `-I` for headers and `-v` to inspect the TLS handshake.',
      'Dig allows you to query specific DNS servers (`@8.8.8.8`) to verify global record propagation.',
      'Netstat/ss maps active ports to Process IDs, allowing you to kill ghost processes holding your dev ports.',
    ],
  },

  {
    id: 'net-14',
    module: 'Module 1: Computer & Network Fundamentals',
    order: 14,
    title: 'Wireless Fundamentals — The Invisible Cables',
    icon: '📡',
    philosophy: 'Think of wireless networking as shouting across a crowded, noisy room. Unlike a physical cable where your voice is trapped in a tube, wireless signals bounce off walls, get absorbed by water, and fight with your neighbor\'s router. Understanding the physics of the "invisible cables" is the only way to debug why a mobile app works perfectly on your desk but fails when the user walks into their kitchen.',
    concepts: [
      {
        title: '1. Radio Frequencies (2.4GHz vs 5GHz vs 6GHz)',
        beginner: 'Wi-Fi uses invisible radio waves, just like FM radio. 2.4GHz is a low, bass-heavy wave that travels through walls easily but is slow. 5GHz is a high, fast wave that carries lots of data but gets blocked by a single wall. 6GHz is the newest, widest highway.',
        advanced: 'Frequency dictates wavelength and propagation characteristics. 2.4GHz (longer wavelength) penetrates solid objects better and has a larger coverage area, but suffers from massive co-channel interference (only 3 non-overlapping channels). 5GHz and 6GHz (shorter wavelengths) offer vastly more bandwidth and non-overlapping channels but suffer from high attenuation (signal loss) through physical obstructions like concrete and water (which absorbs 2.4/5GHz).',
      },
      {
        title: '2. Signal Strength & Interference (RSSI and SNR)',
        beginner: 'Signal strength is how loud the router is shouting. Interference is how loud the rest of the room is. If the room is too noisy, your computer can\'t hear the router, even if the router is shouting.',
        advanced: 'Wireless health is measured by RSSI (Received Signal Strength Indicator) in dBm (decibel-milliwatts). Closer to 0 is better (e.g., -50 dBm is excellent, -80 dBm is unusable). However, raw signal doesn\'t matter without SNR (Signal-to-Noise Ratio). If the Noise Floor is -90 dBm and your signal is -85 dBm, you have a terrible SNR and will experience massive packet loss and retransmissions, destroying throughput.',
      },
      {
        title: '3. Wi-Fi Generations (Wi-Fi 5, 6, and 7)',
        beginner: 'Just like iPhones get a new number every year, Wi-Fi gets new versions. Wi-Fi 6 is like adding double-decker buses to the road so more people can ride at once, instead of just making the cars drive faster.',
        advanced: 'Wi-Fi 5 (802.11ac) introduced MU-MIMO (Multi-User Multiple Input Multiple Output) for downstream only. Wi-Fi 6 (802.11ax) introduced OFDMA (Orthogonal Frequency-Division Multiple Access), allowing a single transmission to carry data for multiple devices simultaneously, drastically reducing latency in crowded environments. Wi-Fi 7 (802.11be) introduces MLO (Multi-Link Operation), allowing devices to send data across 2.4, 5, and 6GHz bands simultaneously.',
      },
      {
        title: '4. Bluetooth & BLE (Bluetooth Low Energy)',
        beginner: 'Bluetooth is a very short, invisible wire meant to connect things right next to you, like headphones or a smartwatch. BLE is a special mode that sips battery so a sensor can run for years on a coin battery.',
        advanced: 'Classic Bluetooth creates a "Piconet" for continuous, higher-bandwidth streams (audio). BLE (Bluetooth Low Energy) is designed for bursty, tiny payloads. BLE devices "advertise" packets, and central devices scan for them. Developers use GATT (Generic Attribute Profile) to read "Characteristics" (like heart rate or battery level). It operates on the 2.4GHz band but uses frequency hopping to avoid Wi-Fi collisions.',
      },
      {
        title: '5. Cellular Networks (4G/5G) & Mobile Latency',
        beginner: 'Cell phones connect to giant towers. 4G is fast enough for video, but 5G is so fast it feels like you are plugged into the wall, even when you are on a train.',
        advanced: 'Mobile networks introduce unique challenges for developers: high jitter, frequent IP changes, and radio state transitions (the radio goes to "sleep" to save battery, causing a 1-2 second delay on the next request). 5G comes in two flavors: Sub-6GHz (wide coverage, moderate speed) and mmWave (millimeter wave - insane speed and low latency, but blocked by a single leaf or window). Mobile apps must implement aggressive retry logic and offline-first caching.',
      },
    ],
    practical: {
      title: 'The RF (Radio Frequency) Site Survey',
      intro: 'Time to see the invisible radio waves bouncing around your room and measure your actual signal health.',
      steps: [
        'On a Mac: Hold the `Option` key and click the Wi-Fi icon in the top menu bar. Look for "RSSI" and "Noise". Calculate your SNR (Signal minus Noise). On Windows, use a free app like "WiFi Analyzer" from the Microsoft Store.',
        'Stand right next to your router. Note the RSSI (should be around -40 to -50 dBm). Now walk two rooms away and close the doors. Watch the RSSI drop to -70 dBm or lower. This matters because every -3 dBm drop means the signal power is cut in half.',
        'Open your browser and run a speed test next to the router. Then run it in the room with the closed door. Notice how the speed drops drastically even if you still have "2 bars" of Wi-Fi. This matters because low SNR forces the router to drop to slower, more resilient modulation schemes.',
        'Look at the "Channel" number in your Wi-Fi menu. If you are on 2.4GHz, check if it is channel 1, 6, or 11. If it is on channel 3 or 8, it is overlapping with neighbors and causing interference. Log into your router and change it to 1, 6, or 11.',
        'If you have a Bluetooth device (like a smartwatch or fitness tracker), open your phone\'s Bluetooth settings and look at the "Connected" status. Realize this device is sending tiny advertising packets right now on the exact same 2.4GHz frequency as your Wi-Fi, using frequency hopping to dodge it.',
      ],
      goal: 'Stop blaming "the internet" for slow mobile apps. Learn to measure physical signal degradation, channel overlap, and the realities of wireless physics.',
    },
    quiz: [
      {
        question: 'Why does 5GHz Wi-Fi generally provide faster speeds but worse range than 2.4GHz?',
        options: [
          '5GHz routers are physically more powerful',
          'Higher frequency waves have shorter wavelengths, which carry more data but are easily absorbed by physical obstructions like walls',
          '2.4GHz is reserved only for government use',
          '5GHz signals travel through water better than 2.4GHz',
        ],
        correctIndex: 1,
        explanation: 'Physics dictates that higher frequencies (5GHz/6GHz) have shorter wavelengths, allowing wider channels and more data, but they suffer from high attenuation (absorption) by solid objects and water. 2.4GHz penetrates walls better but has less bandwidth.',
      },
      {
        question: 'What does an RSSI of -85 dBm indicate compared to an RSSI of -50 dBm?',
        options: [
          '-85 dBm is a much stronger, faster signal',
          '-85 dBm is a very weak signal, while -50 dBm is a strong signal (closer to zero is better)',
          'They mean the exact same thing, just measured differently',
          '-85 dBm means the router is turned off',
        ],
        correctIndex: 1,
        explanation: 'RSSI is measured in negative decibels. Closer to 0 is stronger. -50 dBm is excellent (right next to the router), while -85 dBm is extremely weak and on the edge of dropping the connection.',
      },
      {
        question: 'What major problem did Wi-Fi 6 (802.11ax) solve in crowded areas like stadiums or apartments?',
        options: [
          'It doubled the physical size of the antennas',
          'It introduced OFDMA, allowing a single transmission to carry data for multiple devices simultaneously, reducing latency',
          'It switched entirely to 5G cellular networks',
          'It eliminated the need for passwords',
        ],
        correctIndex: 1,
        explanation: 'OFDMA (Orthogonal Frequency-Division Multiple Access) allows the router to divide a channel into smaller sub-channels and serve multiple clients in a single clock cycle, drastically reducing "airtime" congestion. It did not change antenna physical size, use 5G, or remove security.',
      },
      {
        question: 'Why do mobile apps often experience a 1-2 second delay when making a request after being idle for a while?',
        options: [
          'The phone\'s CPU goes to sleep and needs to reboot',
          'The cellular radio enters a low-power "sleep" state to save battery and must wake up and negotiate with the cell tower',
          'The server turns off when no one is looking',
          'GPS needs to recalibrate',
        ],
        correctIndex: 1,
        explanation: 'Cellular radios use aggressive power-saving states (like RRC Idle). Waking the radio, performing a random access procedure, and establishing a bearer with the cell tower introduces significant latency on the first request after idle. It is not a CPU reboot or server shutdown.',
      },
      {
        question: 'If your Wi-Fi signal is strong (-40 dBm) but your internet is still incredibly slow and dropping packets, what is the most likely culprit?',
        options: [
          'The router is out of ink',
          'A high Noise Floor or Co-Channel Interference from a neighbor\'s router on the same channel',
          'The ethernet cable is too long',
          'The browser cache is full',
        ],
        correctIndex: 1,
        explanation: 'A strong signal with poor performance indicates a terrible Signal-to-Noise Ratio (SNR). If your neighbor\'s router is blasting on the exact same channel, the "noise" drowns out your data, causing collisions and retransmissions. Cables, ink, and cache do not affect wireless RF interference.',
      },
    ],
    keyTakeaways: [
      '2.4GHz penetrates walls but is slow and crowded; 5GHz/6GHz is fast but easily blocked by physical objects.',
      'Signal strength (RSSI) is measured in negative dBm. Closer to 0 is better. Always check the Noise Floor to calculate SNR.',
      'Wi-Fi 6 (OFDMA) and Wi-Fi 7 (MLO) solve network congestion by allowing simultaneous multi-device transmissions.',
      'Bluetooth/BLE operates on 2.4GHz but uses frequency hopping and tiny advertising packets to save power.',
      'Mobile networks (4G/5G) introduce high jitter and radio wake-up latency; mobile apps must be built "offline-first."',
    ],
  },
  {
    id: 'net-15',
    module: 'Module 1: Computer & Network Fundamentals',
    order: 15,
    title: 'The IT Pro Mindset — Systematic Troubleshooting',
    icon: '🧠',
    philosophy: 'Amateurs guess, click "Refresh," and pray. Professionals isolate variables, read the logs, and mathematically prove where the bug lives. Troubleshooting is not a talent; it is a repeatable scientific process. When you master the "Divide and Conquer" mindset, no system—no matter how complex—can hide its secrets from you.',
    concepts: [
      {
        title: '1. The Scientific Method of Debugging',
        beginner: 'Don\'t just randomly change code and hope it works. Make a guess about what is broken, test that specific guess, and if you are wrong, make a new guess. Change only one thing at a time!',
        advanced: 'Professional debugging follows the scientific method: 1. Observe the symptom. 2. Form a hypothesis. 3. Isolate the variable (change ONLY ONE THING). 4. Test and falsify. If you change three lines of code and a config file at the same time and the bug disappears, you have learned nothing and likely introduced a new bug. Reproduce the issue consistently before attempting to fix it.',
      },
      {
        title: '2. Divide and Conquer (Binary Search Debugging)',
        beginner: 'Imagine you have a deck of 100 cards and you need to find the one red card. Instead of checking them one by one, cut the deck in half. Is the red card in the top half or bottom half? Keep cutting in half until you find it.',
        advanced: 'When facing a massive system failure, halve the stack. Is it a frontend issue or backend issue? (Check the Network tab). Is it a network issue or database issue? (Check server logs). Is it a recent code change? Use `git bisect` to automatically binary search your commit history to find the exact commit that introduced the bug. This turns a 10-hour search into a 10-minute search.',
      },
      {
        title: '3. Reading Logs and Stack Traces',
        beginner: 'When an app crashes, it leaves behind a diary entry called a "Stack Trace." It looks scary, but it is just a list of steps the computer took right before it tripped and fell. Always read the very top line first.',
        advanced: 'Logs are categorized by levels: DEBUG (verbose noise), INFO (normal flow), WARN (recoverable issues), ERROR (failures), FATAL (crashes). When reading a stack trace, ignore the framework\'s internal boilerplate at the bottom. Look for the first line that references *your* codebase. That is the exact file and line number where the state became invalid. Never say "it doesn\'t work"; say "the server returned a 500 error at line 42 of `auth.js`."',
      },
      {
        title: '4. State, Time, and Cache Invalidation',
        beginner: 'Computers have terrible short-term memory. Sometimes the screen shows old data because the computer "remembered" it from five minutes ago and forgot to ask for the new version.',
        advanced: '90% of "ghost bugs" are caused by stale state or caching. If a UI doesn\'t update, check the React/Vue state tree. If an API returns old data, check the CDN `Cache-Control` headers, the browser\'s disk cache, or the Redis/Memcached layer. The hardest problem in computer science is cache invalidation. When in doubt, systematically invalidate the cache at every layer to see which one was lying to you.',
      },
      {
        title: '5. Rubber Ducking & Documentation (RTFM)',
        beginner: 'If you are stuck, explain your code line-by-line out loud to a rubber duck (or a pet). Forcing your brain to speak the logic out loud often makes you instantly realize your own mistake.',
        advanced: '"Rubber Ducking" forces the brain to switch from fast, implicit intuition to slow, explicit logical processing. Furthermore, professionals Read The F***ing Manual (RTFM). Before asking a senior dev or posting on StackOverflow, read the official documentation, read the library\'s source code on GitHub, and search the repository\'s "Issues" tab. Someone else has already fought this exact battle.',
      },
    ],
    practical: {
      title: 'The "Broken App" Autopsy',
      intro: 'Time to intentionally break an app and use the professional toolkit to find the exact point of failure without guessing.',
      steps: [
        'Open any local development project (or clone a simple open-source Node/React app). Run it and ensure it works perfectly.',
        'Intentionally introduce a silent bug: Go to a backend API route and change a variable name slightly (e.g., change `user.id` to `user.Id`). Save the file.',
        'Refresh your frontend. It will likely show a generic "Error" or a blank screen. Do NOT guess. Open the DevTools Network tab. Look at the failed request. It will likely be a 500 Internal Server Error. You just proved the bug is on the backend, not the frontend.',
        'Open your backend terminal where the server logs are printing. Look for the red text. Find the "Stack Trace." Look for the first line that mentions your file name and line number. Go to that line. You will see the exact typo.',
        'If the bug was introduced weeks ago and you have no idea when, open your terminal and type `git bisect start`. Tell git which commit is "bad" (today) and which is "good" (last month). Git will automatically checkout the middle commit. Test the app, tell git `git bisect good` or `git bisect bad`, and watch it binary search history to find the exact culprit in seconds.',
      ],
      goal: 'Stop staring at code hoping to spot the typo. Use the Network tab to divide the stack, use logs to pinpoint the file, and use git to travel through time.',
    },
    quiz: [
      {
        question: 'Why is it a bad practice to change three different files and a database setting all at once when trying to fix a bug?',
        options: [
          'The computer will run out of RAM',
          'If the bug disappears, you will not know which change actually fixed it, and you may have introduced new bugs',
          'Git will refuse to save the changes',
          'It makes the internet slower',
        ],
        correctIndex: 1,
        explanation: 'The Scientific Method requires isolating variables. If you change multiple things simultaneously, you cannot falsify your hypothesis or know the actual root cause. It does not affect RAM, Git limits, or internet speed.',
      },
      {
        question: 'When reading a massive, scary Stack Trace after a server crash, where should you look first?',
        options: [
          'The very bottom line of the trace',
          'The middle of the trace where the framework code is',
          'The first line that references a file and line number inside your own codebase',
          'You should just delete the file and rewrite it',
        ],
        correctIndex: 2,
        explanation: 'The top of the trace is the actual crash point, but it is usually deep inside a framework (like Express or React). You must scan down to the first line that references *your* specific code, as that is where you passed invalid data into the framework. Rewriting blindly is amateur behavior.',
      },
      {
        question: 'What is the primary purpose of the `git bisect` command?',
        options: [
          'To automatically fix syntax errors in your code',
          'To perform a binary search through your commit history to find the exact commit that introduced a bug',
          'To split a large file into two smaller files',
          'To upload your code to GitHub twice as fast',
        ],
        correctIndex: 1,
        explanation: '`git bisect` automates the "Divide and Conquer" strategy. It checks out the middle commit between a known "good" and "bad" state, allowing you to find the exact bug-introducing commit in logarithmic time. It does not fix code, split files, or affect upload speeds.',
      },
      {
        question: 'A user reports that they updated their profile picture, but the website still shows the old one. What is the most likely professional diagnosis?',
        options: [
          'The server is physically broken',
          'The user\'s monitor is defective',
          'A caching layer (Browser, CDN, or Database) is serving a stale version of the data and needs invalidation',
          'The database deleted the user\'s account',
        ],
        correctIndex: 2,
        explanation: 'Stale data presentation is almost always a cache invalidation issue. The new data exists, but an intermediate layer is serving the old "cached" copy to save time. Monitors do not selectively cache images, and the server is likely functioning.',
      },
      {
        question: 'What is the "Rubber Duck" method of debugging?',
        options: [
          'A specialized software tool that scans for viruses',
          'Explaining your code line-by-line out loud to an inanimate object to force your brain into explicit logical processing',
          'Taking a bath while coding to relax',
          'A type of network cable used in data centers',
        ],
        correctIndex: 1,
        explanation: 'Rubber Ducking is a cognitive tool. By forcing yourself to articulate the logic out loud, you bypass mental blind spots and often realize your own flawed assumptions. It is not a software tool, bath ritual, or cable.',
      },
    ],
    keyTakeaways: [
      'Debugging is a science: Observe, Hypothesize, Isolate ONE variable, Test, and Falsify.',
      'Use "Divide and Conquer" (Network tab, Logs) to halve the problem space until the bug is trapped.',
      'Stack traces are your friends. Ignore framework noise and find the first line pointing to YOUR code.',
      '90% of "ghost bugs" are just stale caches. Suspect the Cache (Browser, CDN, State) first.',
      'Use `git bisect` to time-travel and find exactly when a bug was introduced.',
    ],
  },
];

export const getNetworkingLessonById = (id: string): NetworkingLesson | undefined =>
  NETWORKING_LESSONS.find(l => l.id === id);

export const isNetworkingLessonUnlocked = (id: string, completedLessons: string[]): boolean => {
  const idx = NETWORKING_LESSONS.findIndex(l => l.id === id);
  if (idx <= 0) return true;
  const prev = NETWORKING_LESSONS[idx - 1];
  return completedLessons.includes(prev.id);
};
