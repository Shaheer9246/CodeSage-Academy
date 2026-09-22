// Comprehensive curriculum data for all 18 CodeSage tracks.
// Used by TopUtilityBar (high-level curriculum guide) and in-lesson CourseOverviewModal (100% in-depth syllabus).

export interface CourseCurriculumInfo {
  id: string;
  trackId: string;
  title: string;
  shortTitle: string;
  credentialCode: string;
  emoji: string;
  category: 'Systems & Low-Level' | 'Web & Frontend Architecture' | 'Enterprise & Cloud Backend' | 'AI & Autonomous Models' | 'Consultancy & Commercial Practice';
  lessonsCount: number;
  level: 'Beginner' | 'Beginner → Intermediate' | 'Beginner → Advanced' | 'Intermediate' | 'Intermediate → Advanced' | 'Advanced' | 'Expert' | 'All Levels';
  route: string;
  // High-level overview (for Top Bar About modal)
  briefOverview: string;
  whatYouWillGet: string;
  // 100% In-depth overview (for the in-lesson Course Overview modal)
  inDepthSummary: string;
  modules: {
    title: string;
    description: string;
    topics: string[];
  }[];
  whatYouWillBeAbleToDo: string[];
  capstoneProjects: string[];
  prerequisites: string;
  targetRoles: string[];
}

export const COURSE_CURRICULUM: CourseCurriculumInfo[] = [
  {
    id: 'frontend',
    trackId: 'frontend',
    title: 'Modern Frontend Engineering',
    shortTitle: 'Frontend Engineering',
    credentialCode: 'CS-FE',
    emoji: '📱',
    category: 'Web & Frontend Architecture',
    lessonsCount: 52,
    level: 'Beginner → Advanced',
    route: '/learn',
    briefOverview: 'Zero-to-one mastery of semantic HTML5, modern CSS layouts (Flexbox/Grid), ECMAScript JavaScript, and interactive component state.',
    whatYouWillGet: 'The ability to architect responsive, accessible web user interfaces from raw code without relying on drag-and-drop templates.',
    inDepthSummary: 'A 52-lesson hands-on coding track in the Monaco editor. Progress from DOM manipulation and modern CSS animations into advanced asynchronous JavaScript, REST client integration, and modular component architectures.',
    modules: [
      {
        title: 'Module 1: Semantic HTML5 & Accessible DOM',
        description: 'Master structure, metadata, forms, tables, accessibility standards (WCAG), and responsive media.',
        topics: ['Semantic Tags & Landmarks', 'Accessible Forms & Validation', 'Media & Canvas Embeds', 'SEO & OpenGraph Tags']
      },
      {
        title: 'Module 2: Modern CSS, Flexbox & Grid Systems',
        description: 'Build responsive multi-device layouts, custom UI themes, and CSS hardware-accelerated animations.',
        topics: ['Box Model & Reset Strategies', 'Flexbox Alignment & Workflows', 'CSS Grid 2D Positioning', 'Variables, Pseudo-classes & Media Queries']
      },
      {
        title: 'Module 3: Modern JavaScript (ES6+)',
        description: 'Core programming logic, functional programming, DOM event listeners, and asynchronous execution.',
        topics: ['Variables & Lexical Scope', 'Arrow Functions & Closures', 'Array Methods (map, filter, reduce)', 'Promises, Async/Await & Fetch API']
      },
      {
        title: 'Module 4: Component Architecture & State',
        description: 'Transitioning from vanilla DOM manipulation into clean state-driven component patterns.',
        topics: ['Modular UI Components', 'Reactive State Patterns', 'Client-side Routing Basics', 'Production Asset Bundling']
      }
    ],
    whatYouWillBeAbleToDo: [
      'Write standards-compliant semantic HTML5 and accessible CSS layouts from Figma mockups.',
      'Manipulate the browser DOM dynamically and handle complex user interactions.',
      'Consume asynchronous RESTful APIs using modern async/await patterns.',
      'Architect modular, scalable user interfaces ready for production web hosting.'
    ],
    capstoneProjects: [
      'Interactive Analytics Dashboard UI',
      'Dynamic E-Commerce Product Filter & Cart Engine',
      'Multi-Step Application Form with Live Validation'
    ],
    prerequisites: 'No prior coding experience required. Designed for absolute beginners up to junior engineers.',
    targetRoles: ['Frontend Developer', 'UI Engineer', 'Web Developer', 'Design Systems Engineer']
  },
  {
    id: 'fullstack',
    trackId: 'fullstack',
    title: 'Full-Stack Application Architecture',
    shortTitle: 'Full-Stack Frontend',
    credentialCode: 'CS-FS',
    emoji: '🚀',
    category: 'Web & Frontend Architecture',
    lessonsCount: 28,
    level: 'Intermediate',
    route: '/fullstack',
    briefOverview: 'React component lifecycles, custom hooks, global state management, TypeScript integration, and automated CI/CD deployment.',
    whatYouWillGet: 'The complete engineering skill set to build, package, test, and ship live production-grade web applications to global CDNs.',
    inDepthSummary: 'Learn how professional engineering teams build web applications. Dive deep into React reconciliation, memoization, TypeScript interfaces, client cache synchronization, and zero-downtime deployment pipelines.',
    modules: [
      {
        title: 'Module 1: Modern React Foundation',
        description: 'JSX mechanics, declarative rendering, unidirectional data flow, and synthetic event handling.',
        topics: ['Declarative UI vs Imperative DOM', 'Component Decomposition', 'Props, State & Pure Functions']
      },
      {
        title: 'Module 2: Advanced Hooks & Custom State',
        description: 'Deep mastery of React hooks lifecycle and custom reusable business logic.',
        topics: ['useState & useEffect Pitfalls', 'useMemo, useCallback & Profiling', 'useRef & Imperative Handles', 'Building Custom Reusable Hooks']
      },
      {
        title: 'Module 3: TypeScript for React Applications',
        description: 'Enforcing strict type safety across props, state, API contracts, and event signatures.',
        topics: ['Generics in React', 'Discriminated Unions for UI State', 'Strict Event & Ref Typing']
      },
      {
        title: 'Module 4: API Integration, State & Live Deployment',
        description: 'Connecting backend endpoints, handling optimistic UI updates, and deploying to cloud infrastructure.',
        topics: ['Client Query Caching', 'Error Boundaries & Fallbacks', 'Vite Bundling & Code Splitting', 'Production Deployment on Netlify/Vercel']
      }
    ],
    whatYouWillBeAbleToDo: [
      'Architect scalable Single Page Applications (SPAs) using React and TypeScript.',
      'Eliminate unnecessary component re-renders using advanced memoization and profiling.',
      'Integrate third-party REST and GraphQL APIs with optimistic UI and error recovery.',
      'Configure automated CI/CD deployment pipelines on modern cloud infrastructure.'
    ],
    capstoneProjects: [
      'Real-Time Collaborative Kanban Workspace',
      'Crypto & Stock Market Financial Terminal',
      'Production-Ready Cloud SaaS Dashboard with Auth & State Sync'
    ],
    prerequisites: 'Modern Frontend Engineering (HTML, CSS, modern JavaScript fundamentals).',
    targetRoles: ['React Developer', 'Full-Stack Web Engineer', 'Frontend Platform Engineer']
  },
  {
    id: 'networking',
    trackId: 'networking',
    title: 'Computer Systems & Network Architecture',
    shortTitle: 'Systems & Networking',
    credentialCode: 'CS-NET',
    emoji: '🌐',
    category: 'Systems & Low-Level',
    lessonsCount: 13,
    level: 'Beginner → Intermediate',
    route: '/networking',
    briefOverview: 'Demystifying how computers, operating systems, and global network protocols actually communicate underneath software.',
    whatYouWillGet: 'Clear mental models of CPU execution, memory hierarchy, DNS resolution, TCP/IP handshakes, and transport layer security (TLS).',
    inDepthSummary: 'A foundational engineering track covering computer hardware architecture, CPU instruction cycles, memory addressing, and the OSI 7-layer networking stack that powers the modern internet.',
    modules: [
      {
        title: 'Module 1: Machine Architecture & OS Primitives',
        description: 'How code transforms into electrical signals, CPU clock cycles, registers, and kernel processes.',
        topics: ['CPU Cycles & Von Neumann Model', 'RAM, Registers & Cache Lines', 'Kernel Processes, Threads & Context Switching']
      },
      {
        title: 'Module 2: The Internet Protocol Stack',
        description: 'Packet transmission, packet routing, IP addressing, and the transport layer.',
        topics: ['OSI 7-Layer vs TCP/IP Model', 'IP Routing & Subnetting (IPv4 / IPv6)', 'TCP 3-Way Handshake vs UDP Datagrams']
      },
      {
        title: 'Module 3: Application Protocols & Web Infrastructure',
        description: 'How the web resolves names, serves content, and secures communications.',
        topics: ['DNS Hierarchies & Record Resolution', 'HTTP/1.1 to HTTP/2 and HTTP/3 QUIC', 'TLS 1.3 Encryption & Handshakes', 'WebSockets & Long Polling']
      }
    ],
    whatYouWillBeAbleToDo: [
      'Diagnose latency bottlenecks across networks using ping, traceroute, and packet sniffers.',
      'Understand how the operating system schedules processes and allocates virtual memory.',
      'Architect backend services choosing the optimal protocol (TCP, UDP, WebSockets, gRPC).',
      'Explain precisely what happens from typing a URL to rendering pixels on screen.'
    ],
    capstoneProjects: [
      'Custom Raw HTTP Client & Socket Parser',
      'Packet Sniffer & Protocol Analyzer Simulator',
      'Network Subnet Calculator & Topology Visualizer'
    ],
    prerequisites: 'Curiosity about how computers and the internet operate. No coding required.',
    targetRoles: ['Systems Engineer', 'DevOps / SRE', 'Network Architect', 'Backend Developer']
  },
  {
    id: 'python',
    trackId: 'python',
    title: 'Python Software Engineering',
    shortTitle: 'Python Engineering',
    credentialCode: 'CS-PY',
    emoji: '🐍',
    category: 'Enterprise & Cloud Backend',
    lessonsCount: 32,
    level: 'Beginner → Advanced',
    route: '/python',
    briefOverview: 'Core algorithmic programming, object-oriented design, data structures, file I/O, and modular software packaging in Python 3.',
    whatYouWillGet: 'Fluent Python problem-solving capabilities, idiomatic design patterns, and clean OOP architecture used in backend and data systems.',
    inDepthSummary: 'Step-by-step progression from Python syntax and control flow into list comprehensions, object-oriented inheritance, error handling, generator functions, and algorithmic data structures.',
    modules: [
      {
        title: 'Module 1: Foundations & Idiomatic Syntax',
        description: 'Variables, types, control flow, functions, and idiomatic Pythonic patterns.',
        topics: ['Data Types & Mutability', 'Conditional Branching & Loops', 'Functions & Scope', 'List/Dict/Set Comprehensions']
      },
      {
        title: 'Module 2: Data Structures & Algorithms',
        description: 'Stacks, queues, hash maps, sorting, and algorithmic complexity.',
        topics: ['Tuples, Dictionaries & Sets', 'Stack & Queue Implementations', 'Big-O Analysis & Time Complexity']
      },
      {
        title: 'Module 3: Object-Oriented Software Architecture',
        description: 'Building maintainable systems with classes, inheritance, encapsulation, and polymorphism.',
        topics: ['Classes, Dunder Methods & Properties', 'Inheritance & Composition', 'Custom Exceptions & Robust Error Handling']
      },
      {
        title: 'Module 4: I/O, Generators & Modular Packages',
        description: 'File streams, memory-efficient generators, context managers, and modules.',
        topics: ['Context Managers (with statement)', 'Yield & Generator Iterators', 'Module Architecture & pip Packaging']
      }
    ],
    whatYouWillBeAbleToDo: [
      'Write clean, idiomatic, PEP 8-compliant Python 3 software.',
      'Design modular object-oriented systems with robust encapsulation and testability.',
      'Process high-volume data streams using memory-efficient generators.',
      'Solve intermediate to advanced algorithmic interview problems with optimal Big-O.'
    ],
    capstoneProjects: [
      'Multi-Threaded Log File Parser & Aggregator',
      'Object-Oriented Bank Account & Ledger Simulation',
      'Automated CLI Task Engine with File Persistence'
    ],
    prerequisites: 'None. Suitable for complete programming beginners.',
    targetRoles: ['Python Developer', 'Data Engineer', 'Backend Engineer', 'Automation Specialist']
  },
  {
    id: 'pythonexpert',
    trackId: 'pythonexpert',
    title: 'Advanced Python: Metaprogramming & AsyncIO',
    shortTitle: 'Python Expert',
    credentialCode: 'CS-PYX',
    emoji: '🧙‍♂️',
    category: 'Enterprise & Cloud Backend',
    lessonsCount: 30,
    level: 'Expert',
    route: '/pythonexpert',
    briefOverview: 'Metaclasses, custom decorators, descriptor protocols, AsyncIO event loop concurrency, and high-performance FastAPI microservices.',
    whatYouWillGet: 'The ability to author internal frameworks, high-throughput asynchronous services, and deep Python runtime optimizations.',
    inDepthSummary: 'Explore the innermost mechanics of CPython. Master class creation hooks, descriptor protocols, bytecode evaluation, non-blocking asynchronous event loops, and production FastAPI architecture.',
    modules: [
      {
        title: 'Module 1: Advanced Metaprogramming & Descriptors',
        description: 'Custom metaclasses, `__new__` vs `__init__`, and descriptor-based ORM fields.',
        topics: ['Metaclasses & Class Construction', 'Descriptor Protocol (`__get__`, `__set__`)', 'Abstract Base Classes & Protocols']
      },
      {
        title: 'Module 2: High-Performance Decorators & Closures',
        description: 'Parameterized function and class decorators with metadata preservation.',
        topics: ['Closures & Scope Introspection', 'Parametric Decorators & functools.wraps', 'Class-level Decorators & Monkey Patching']
      },
      {
        title: 'Module 3: AsyncIO & Concurrency Architecture',
        description: 'Event loops, coroutines, non-blocking I/O, tasks, and thread/process pools.',
        topics: ['The AsyncIO Event Loop', 'Coroutines, Tasks & Futures', 'Async Context Managers & Iterators', 'Threading vs Multiprocessing vs AsyncIO']
      },
      {
        title: 'Module 4: Enterprise FastAPI Architecture',
        description: 'Asynchronous REST APIs with dependency injection and Pydantic validation.',
        topics: ['Pydantic Data Schemas', 'FastAPI Dependency Injection', 'Asynchronous Database Drivers', 'Testing with pytest-asyncio']
      }
    ],
    whatYouWillBeAbleToDo: [
      'Build custom validation frameworks and ORMs using descriptors and metaclasses.',
      'Write high-concurrency microservices processing thousands of requests per second with AsyncIO.',
      'Diagnose and resolve Global Interpreter Lock (GIL) and memory leak bottlenecks in CPython.',
      'Architect modular FastAPI services with dependency injection and OpenAPI specifications.'
    ],
    capstoneProjects: [
      'Custom Lightweight Async ORM Engine',
      'High-Throughput Concurrent Web Crawler using AsyncIO',
      'Microservices API Gateway with Rate-Limiting & JWT Middleware'
    ],
    prerequisites: 'Completion of Python Software Engineering or equivalent proficiency in OOP.',
    targetRoles: ['Senior Python Engineer', 'Backend Architect', 'Platform Infrastructure Engineer']
  },
  {
    id: 'c',
    trackId: 'c',
    title: 'Systems Programming in C',
    shortTitle: 'Systems Programming in C',
    credentialCode: 'CS-C',
    emoji: '⚡',
    category: 'Systems & Low-Level',
    lessonsCount: 30,
    level: 'Intermediate',
    route: '/c',
    briefOverview: 'Pointers, pointer arithmetic, manual heap management with malloc/free, memory layouts, structs, and UNIX system calls.',
    whatYouWillGet: 'Unshakable comprehension of how memory works at the hardware level, preventing buffer overflows and memory corruption.',
    inDepthSummary: 'No garbage collection, no runtime safety nets. Learn how operating systems and high-performance runtimes are crafted from the bare metal up using ISO C.',
    modules: [
      {
        title: 'Module 1: C Syntax & Procedural Logic',
        description: 'Types, bits and bytes, integer widths, preprocessor directives, and translation units.',
        topics: ['Primitive Data Types & Bit Widths', 'Preprocessor (#define, #include, macros)', 'Header Files & Modular Compilation']
      },
      {
        title: 'Module 2: Pointers & Address Arithmetic',
        description: 'The essence of C: dereferencing, pointer arithmetic, function pointers, and void pointers.',
        topics: ['Pointers to Variables & Arrays', 'Pointer Arithmetic & Memory Offsets', 'Pass-by-Reference & Function Pointers']
      },
      {
        title: 'Module 3: Dynamic Memory & Heap Allocation',
        description: 'Mastering malloc, calloc, realloc, free, and avoiding use-after-free and memory leaks.',
        topics: ['Stack vs Heap Architecture', 'malloc, calloc, realloc & free', 'Valgrind Memory Debugging & Leaks']
      },
      {
        title: 'Module 4: Structs, Unions & Low-Level I/O',
        description: 'Custom composite data structures, byte alignment, and POSIX file descriptors.',
        topics: ['Struct Padding & Byte Alignment', 'Unions & Bitfields', 'POSIX File Descriptors (open, read, write)']
      }
    ],
    whatYouWillBeAbleToDo: [
      'Write safe, high-performance C code free of memory leaks and buffer overruns.',
      'Navigate and inspect raw memory addresses and binary structures directly.',
      'Implement fundamental data structures (linked lists, dynamic arrays, hash tables) from scratch.',
      'Interact directly with the OS kernel through POSIX system calls.'
    ],
    capstoneProjects: [
      'Custom Dynamic Array (Vector) & Linked List Library',
      'In-Memory Key-Value Store with Custom Hash Function',
      'UNIX Command-Line Shell with Fork, Exec & Pipe Handling'
    ],
    prerequisites: 'Basic familiarity with variables and loops in any programming language.',
    targetRoles: ['Systems Engineer', 'Embedded Systems Developer', 'Kernel Developer', 'Security Researcher']
  },
  {
    id: 'cx',
    trackId: 'cx',
    title: 'Advanced Low-Level Systems & Memory',
    shortTitle: 'C Systems Expert',
    credentialCode: 'CS-CX',
    emoji: '🧙‍♂️',
    category: 'Systems & Low-Level',
    lessonsCount: 30,
    level: 'Expert',
    route: '/c-expert',
    briefOverview: 'Custom arena allocators, memory alignment, cache-line optimization, lock-free data structures, and kernel primitives.',
    whatYouWillGet: 'The ability to build custom memory engines, zero-copy packet parsers, and mission-critical systems software.',
    inDepthSummary: 'For software engineers building high-frequency trading engines, database storage managers, game engines, and OS kernels where every microsecond and CPU cache miss counts.',
    modules: [
      {
        title: 'Module 1: Custom Allocators & Arena Memory',
        description: 'Replacing standard malloc with arena, pool, and stack allocators.',
        topics: ['Arena Allocators & Bump Allocation', 'Fixed-size Pool / Slab Allocators', 'Memory Page Alignment & posix_memalign']
      },
      {
        title: 'Module 2: CPU Cache Optimization & SIMD',
        description: 'Hardware cache lines, spatial/temporal locality, and vectorization.',
        topics: ['L1/L2/L3 Cache Lines & False Sharing', 'Data-Oriented Design (SoA vs AoS)', 'SIMD Vectorization Primitives']
      },
      {
        title: 'Module 3: Concurrency & Lock-Free Primitives',
        description: 'Atomic operations, memory barriers, lock-free ring buffers, and mutexes.',
        topics: ['C11 Stdatomic Primitives', 'Memory Orderings (Acquire, Release, Sequential)', 'Lock-Free Single-Producer Single-Consumer Queue']
      },
      {
        title: 'Module 4: Systems Primitives & IPC',
        description: 'Memory-mapped files (mmap), shared memory, and UNIX domain sockets.',
        topics: ['mmap for Zero-Copy File I/O', 'Shared Memory (`shm_open`) IPC', 'Signal Handling & Asynchronous Safety']
      }
    ],
    whatYouWillBeAbleToDo: [
      'Design sub-microsecond custom memory allocators tailored to specific workload profiles.',
      'Eliminate CPU cache misses by restructuring data layouts into Data-Oriented structures.',
      'Build lock-free thread-safe queues and communication channels without OS mutex overhead.',
      'Perform zero-copy file processing using OS memory-mapped I/O (mmap).'
    ],
    capstoneProjects: [
      'High-Performance Arena & Pool Memory Manager',
      'Lock-Free Single-Producer Single-Consumer Ring Buffer',
      'Zero-Copy High-Throughput Binary Telemetry Parser'
    ],
    prerequisites: 'Systems Programming in C (pointers, memory management, structs).',
    targetRoles: ['Low-Level Systems Architect', 'High-Frequency Trading (HFT) Engineer', 'Game Engine Programmer']
  },
  {
    id: 'cpp',
    trackId: 'cpp',
    title: 'Modern C++ Engineering & RAII',
    shortTitle: 'Modern C++ (C++20)',
    credentialCode: 'CS-CPP',
    emoji: '⚙️',
    category: 'Systems & Low-Level',
    lessonsCount: 30,
    level: 'Intermediate → Advanced',
    route: '/cpp',
    briefOverview: 'RAII memory management, smart pointers, copy/move semantics, STL containers and algorithms, and modern C++ design.',
    whatYouWillGet: 'The ability to write robust, zero-overhead modern C++ that manages hardware resources safely and predictably.',
    inDepthSummary: 'Leave legacy C-style C++ behind. Learn modern idioms (C++17/C++20) centered on Resource Acquisition Is Initialization (RAII), value semantics, move constructors, and standard template algorithms.',
    modules: [
      {
        title: 'Module 1: Modern C++ Syntax & Type System',
        description: 'References, const-correctness, auto type deduction, and namespace modularity.',
        topics: ['Lvalues, Rvalues & References', 'Const-Correctness & Immutability', 'Structured Bindings & Auto']
      },
      {
        title: 'Module 2: RAII & Smart Pointer Memory Safety',
        description: 'Deterministic destruction, `std::unique_ptr`, `std::shared_ptr`, and rule of zero/three/five.',
        topics: ['RAII Principle & Lifetime Guarantees', 'unique_ptr & shared_ptr Mechanics', 'The Rule of Five (Copy/Move Constructors)']
      },
      {
        title: 'Module 3: The Standard Template Library (STL)',
        description: 'Vectors, maps, sets, iterators, and high-performance algorithms.',
        topics: ['Vector Internals & Reallocation', 'Associative Containers (std::map, unordered_map)', 'STL Algorithms with Lambdas']
      },
      {
        title: 'Module 4: Modern Object Architecture',
        description: 'Polymorphism without memory overhead, abstract interfaces, and operator overloading.',
        topics: ['Virtual Dispatch & VTables', 'Abstract Interfaces & Dependency Inversion', 'Operator Overloading Guidelines']
      }
    ],
    whatYouWillBeAbleToDo: [
      'Write safe, leak-free C++ code using RAII and modern smart pointer idioms.',
      'Eliminate deep copies through move constructors and rvalue references (`std::move`).',
      'Harness standard STL containers and algorithms for maximum execution performance.',
      'Implement clean class hierarchies with virtual interfaces and deterministic lifecycles.'
    ],
    capstoneProjects: [
      'RAII Managed Database Connection Pool',
      'High-Performance Matrix Math Library with Move Semantics',
      'Event-Driven Multithreaded Job Dispatcher'
    ],
    prerequisites: 'Basic knowledge of procedural programming or C fundamentals.',
    targetRoles: ['C++ Software Engineer', 'Graphics Engineer', 'Simulation Engineer', 'Robotics Software Developer']
  },
  {
    id: 'cppexpert',
    trackId: 'cppexpert',
    title: 'High-Performance C++ & Metaprogramming',
    shortTitle: 'C++ Metaprogramming',
    credentialCode: 'CS-CPPX',
    emoji: '🚀',
    category: 'Systems & Low-Level',
    lessonsCount: 30,
    level: 'Expert',
    route: '/cpp/expert',
    briefOverview: 'Template metaprogramming, compile-time computation (`constexpr`/`consteval`), C++20 Concepts, and lock-free multi-threading.',
    whatYouWillGet: 'The expertise to shift expensive runtime checks into compile-time guarantees with zero performance penalty.',
    inDepthSummary: 'Push the C++ compiler to its limits. Learn how libraries like Boost, PyTorch, and Unreal Engine leverage template metaprogramming, fold expressions, type traits, concepts, and atomic synchronization.',
    modules: [
      {
        title: 'Module 1: Compile-Time Computation & Constexpr',
        description: 'Executing complex algorithmic computation during compilation.',
        topics: ['`constexpr` & `consteval` Evaluation', 'Compile-Time Lookup Tables & Hashing', 'Type Traits (`std::is_same`, `enable_if`)']
      },
      {
        title: 'Module 2: Template Metaprogramming & Fold Expressions',
        description: 'Variadic templates, template specialization, and fold expressions.',
        topics: ['Variadic Templates & Parameter Packs', 'Fold Expressions (C++17)', 'SFINAE & Expression SFINAE']
      },
      {
        title: 'Module 3: C++20 Concepts & Modern Constrained Types',
        description: 'Clear compile-time interface constraints and readable error messages.',
        topics: ['`requires` Clauses & Custom Concepts', 'Constrained Template Specialization', 'Overload Resolution with Concepts']
      },
      {
        title: 'Module 4: Low-Level Concurrency & Atomics',
        description: '`std::atomic`, memory fences, lock-free algorithms, and thread synchronization.',
        topics: ['std::atomic & Cache Coherency', 'Memory Order (Relaxed, Acquire-Release, SeqCst)', 'Building a Lock-Free Ring Buffer']
      }
    ],
    whatYouWillBeAbleToDo: [
      'Perform complex algorithmic computations entirely at compile-time with `constexpr`.',
      'Author flexible generic libraries using variadic templates and C++20 Concepts.',
      'Eliminate runtime type checks and virtual method overhead through static polymorphism (CRTP).',
      'Architect lock-free, multi-producer multi-consumer concurrent systems using atomics.'
    ],
    capstoneProjects: [
      'Compile-Time Reflection & JSON Serialization Engine',
      'Lock-Free Multi-Threaded Task Scheduler',
      'Zero-Overhead Mathematical Expression Template Solver'
    ],
    prerequisites: 'Completion of Modern C++ Engineering & RAII.',
    targetRoles: ['Principal C++ Architect', 'HFT Quantitative Developer', 'Game Engine Lead']
  },
  {
    id: 'java',
    trackId: 'java',
    title: 'Enterprise Java & Object Architecture',
    shortTitle: 'Enterprise Java',
    credentialCode: 'CS-JV',
    emoji: '☕',
    category: 'Enterprise & Cloud Backend',
    lessonsCount: 30,
    level: 'Beginner → Intermediate',
    route: '/java',
    briefOverview: 'Strongly-typed object-oriented architecture, Collections Framework, Generics, Stream API, and Spring Boot REST foundations.',
    whatYouWillGet: 'The enterprise industry standard for building robust, backwards-compatible, multi-tier corporate software systems.',
    inDepthSummary: 'Java powers the world’s largest enterprise applications, financial institutions, and Android platforms. Master strict OOP, encapsulation, Java Collections, lambda streams, and microservice fundamentals.',
    modules: [
      {
        title: 'Module 1: Java OOP & Encapsulation',
        description: 'Classes, abstract classes, interfaces, records, and access modifiers.',
        topics: ['Inheritance & Interface Design', 'Java Records & Value Objects', 'Checked vs Unchecked Exceptions']
      },
      {
        title: 'Module 2: Collections Framework & Generics',
        description: 'Lists, sets, maps, custom generic classes, and type erasure.',
        topics: ['ArrayList vs LinkedList Internals', 'HashMap Buckets & Collision Resolution', 'Generics & Wildcards (`? extends`, `? super`)']
      },
      {
        title: 'Module 3: Modern Java: Streams & Lambdas',
        description: 'Functional programming in Java, parallel streams, and Optional monads.',
        topics: ['Functional Interfaces & Method References', 'Stream API (filter, map, collect, reduce)', 'Optional<T> to Eliminate NullPointerExceptions']
      },
      {
        title: 'Module 4: Enterprise REST & Spring Boot Foundations',
        description: 'Dependency injection, controllers, repositories, and entity mapping.',
        topics: ['Inversion of Control (IoC) & DI', 'Building REST Endpoints with Spring MVC', 'JPA / Hibernate Entity Relationships']
      }
    ],
    whatYouWillBeAbleToDo: [
      'Design clean, maintainable enterprise software adhering to SOLID principles.',
      'Select and optimize the correct Java Collections data structures for performance.',
      'Transform complex data sets declaratively using the Java 8+ Stream API.',
      'Build scalable RESTful microservices with Spring Boot and dependency injection.'
    ],
    capstoneProjects: [
      'Enterprise E-Commerce Order Processing Engine',
      'Bank Ledger & Transaction Auditing Service',
      'Spring Boot RESTful Customer Relationship Management (CRM) API'
    ],
    prerequisites: 'Basic familiarity with variables and logic.',
    targetRoles: ['Java Developer', 'Backend Software Engineer', 'Enterprise Applications Developer']
  },
  {
    id: 'javaexpert',
    trackId: 'javaexpert',
    title: 'Advanced Java Systems & JVM Internals',
    shortTitle: 'Java Expert & JVM',
    credentialCode: 'CS-JVX',
    emoji: '🧙‍♂️',
    category: 'Enterprise & Cloud Backend',
    lessonsCount: 30,
    level: 'Expert',
    route: '/java-expert',
    briefOverview: 'JVM bytecode execution, Garbage Collection tuning (G1/ZGC), Java Concurrency API (`java.util.concurrent`), and memory models.',
    whatYouWillGet: 'The deep JVM knowledge required to troubleshoot multi-threaded race conditions, memory leaks, and GC latency in production.',
    inDepthSummary: 'Look under the hood of the Java Virtual Machine. Learn how bytecode is executed, how the JIT compiler optimizes hot paths, how garbage collectors manage generational memory, and how virtual threads scale to millions of concurrent tasks.',
    modules: [
      {
        title: 'Module 1: JVM Architecture & Bytecode',
        description: 'ClassLoaders, Method Area, Heap, Stack frames, and JIT compilation.',
        topics: ['ClassLoader Hierarchy & Bytecode Verification', 'Stack Frames vs Heap Memory Allocation', 'JIT Tiered Compilation (C1/C2) & Inlining']
      },
      {
        title: 'Module 2: Garbage Collection & Memory Profiling',
        description: 'Generational hypothesis, GC algorithms (Serial, Parallel, G1, ZGC), and profiling.',
        topics: ['Generational Memory (Young, Eden, Tenured)', 'Garbage Collection Algorithms & Stop-the-World Pauses', 'VisualVM Heap Dump Analysis & Leak Detection']
      },
      {
        title: 'Module 3: Java Concurrency & The Java Memory Model',
        description: 'Thread pools, volatile memory semantics, synchronized blocks, and Locks.',
        topics: ['Java Memory Model (JMM) & Happens-Before', 'ReentrantLock & ReadWriteLock', 'Atomic Variables & Non-Blocking Algorithms']
      },
      {
        title: 'Module 4: High-Scale Concurrency & Virtual Threads',
        description: 'Executors, CompletableFuture pipelines, and Project Loom Virtual Threads.',
        topics: ['CompletableFuture Reactive Pipelines', 'ForkJoinPool & Work-Stealing', 'Project Loom Virtual Threads & Fibers']
      }
    ],
    whatYouWillBeAbleToDo: [
      'Tune JVM garbage collection flags for low-latency or high-throughput enterprise systems.',
      'Diagnose and resolve JVM heap memory leaks and CPU starvation using thread dumps.',
      'Architect thread-safe distributed services without race conditions or deadlocks.',
      'Scale backend microservices to millions of concurrent requests using Virtual Threads.'
    ],
    capstoneProjects: [
      'High-Throughput Concurrent Financial Order Matcher',
      'Custom JVM Memory Leak & Thread Deadlock Detector',
      'Asynchronous Event Pipeline with CompletableFuture & Virtual Threads'
    ],
    prerequisites: 'Enterprise Java & Object Architecture.',
    targetRoles: ['Lead Java Architect', 'JVM Performance Engineer', 'Distributed Systems Specialist']
  },
  {
    id: 'sql',
    trackId: 'sql',
    title: 'Relational Database Engineering & SQL',
    shortTitle: 'Database & SQL',
    credentialCode: 'CS-SQL',
    emoji: '🛢️',
    category: 'Enterprise & Cloud Backend',
    lessonsCount: 18,
    level: 'Beginner → Intermediate',
    route: '/sql',
    briefOverview: 'Relational database schema modeling, ACID transactions, complex multi-table joins, indexing, and query plan optimization.',
    whatYouWillGet: 'The ability to design resilient relational schemas and write blazing-fast SQL queries that scale under production loads.',
    inDepthSummary: 'Data is the core of every modern business. Learn how relational engines store, index, and retrieve data safely using standard ANSI SQL, PostgreSQL, and SQLite with ACID compliance.',
    modules: [
      {
        title: 'Module 1: Relational Modeling & Schema Design',
        description: 'Tables, data types, primary and foreign keys, and database normalization (1NF–3NF).',
        topics: ['Relational Data Modeling', 'Primary Keys, Foreign Keys & Constraints', 'Database Normalization to Prevent Redundancy']
      },
      {
        title: 'Module 2: Advanced Queries, Aggregations & Joins',
        description: 'Inner joins, outer joins, grouping, aggregations, and subqueries.',
        topics: ['INNER, LEFT, RIGHT & FULL OUTER Joins', 'GROUP BY, HAVING & Aggregate Functions', 'Subqueries & Common Table Expressions (CTEs)']
      },
      {
        title: 'Module 3: Indexing, EXPLAIN & Performance Optimization',
        description: 'B-tree index mechanics, composite indexes, and analyzing query execution plans.',
        topics: ['How B-Tree Indexes Work Internally', 'Analyzing Query Plans with EXPLAIN ANALYZE', 'Preventing Slow Full Table Scans']
      },
      {
        title: 'Module 4: ACID Transactions & Concurrency',
        description: 'Transactions, commit/rollback, isolation levels, and row-level locking.',
        topics: ['ACID Guarantees Explained', 'Transaction Isolation Levels (Read Committed, Serializable)', 'Deadlocks & Row-Level Locking']
      }
    ],
    whatYouWillBeAbleToDo: [
      'Design normalized, robust database schemas for multi-tenant applications.',
      'Author complex multi-table analytical queries using CTEs and window functions.',
      'Speed up sluggish database queries by inspecting EXPLAIN query execution trees.',
      'Ensure absolute data integrity across financial mutations using ACID transactions.'
    ],
    capstoneProjects: [
      'Multi-Vendor E-Commerce Relational Schema with Inventory Locking',
      'Financial Ledger Database with Audit Logging & Rollbacks',
      'Analytical Dashboard Reporting Pipeline using Complex Joins & CTEs'
    ],
    prerequisites: 'Basic familiarity with spreadsheet tables or web applications.',
    targetRoles: ['Database Administrator (DBA)', 'Backend Engineer', 'Data Analyst', 'Data Architect']
  },
  {
    id: 'ai-fundamentals',
    trackId: 'ai-fundamentals',
    title: 'Foundations of AI & Neural Models',
    shortTitle: 'AI Foundations',
    credentialCode: 'CS-AI',
    emoji: '🧠',
    category: 'AI & Autonomous Models',
    lessonsCount: 12,
    level: 'Beginner → Intermediate',
    route: '/ai-fundamentals',
    briefOverview: 'Machine Learning paradigms, artificial neural networks, Transformer attention mechanisms, embeddings, and autonomous agent loops.',
    whatYouWillGet: 'A clear engineering understanding of how modern generative AI and LLMs actually work behind the marketing buzzwords.',
    inDepthSummary: 'Demystify artificial intelligence from perceptrons to modern LLMs. Understand how tokenization, self-attention, vector embeddings, and autonomous agent tool loops function in real software.',
    modules: [
      {
        title: 'Module 1: Machine Learning Paradigms',
        description: 'Supervised vs unsupervised learning, loss functions, gradient descent, and training loops.',
        topics: ['Supervised, Unsupervised & Reinforcement Learning', 'Loss Functions & Gradient Descent', 'Overfitting vs Generalization']
      },
      {
        title: 'Module 2: Neural Networks & Transformers',
        description: 'Perceptrons, multi-layer networks, activation functions, and Transformer Self-Attention.',
        topics: ['Feedforward Networks & Backpropagation', 'The Transformer Architecture & Self-Attention', 'Tokens, Context Windows & Hallucinations']
      },
      {
        title: 'Module 3: Vector Embeddings & Similarity',
        description: 'How text and images convert into multi-dimensional vectors for semantic search.',
        topics: ['High-Dimensional Vector Spaces', 'Cosine Similarity & Dot Product', 'Vector Search Fundamentals']
      },
      {
        title: 'Module 4: Modern LLMs & Autonomous Agents',
        description: 'Prompt engineering, Function Calling, structured output, and ReAct agent workflows.',
        topics: ['Zero-Shot & Few-Shot Prompting', 'Tool Calling & Structured JSON Extraction', 'ReAct Agent Loops (Reason + Act)']
      }
    ],
    whatYouWillBeAbleToDo: [
      'Explain the mathematical intuition behind neural network training and transformers.',
      'Implement semantic search pipelines using vector embeddings and cosine similarity.',
      'Integrate LLMs into production software using structured function calling.',
      'Design autonomous AI agent loops capable of using external tools to solve multi-step problems.'
    ],
    capstoneProjects: [
      'Semantic Document Search Engine using Vector Embeddings',
      'Autonomous Research Assistant Agent with Web Tool Integration',
      'Interactive Neural Network Forward-Pass Visualizer'
    ],
    prerequisites: 'No math degree required. High-school algebra and basic coding logic.',
    targetRoles: ['AI Application Developer', 'Machine Learning Engineer', 'Product Manager (AI)', 'GenAI Specialist']
  },
  {
    id: 'intermediate-ai',
    trackId: 'intermediate-ai',
    title: 'Applied Generative AI & Fine-Tuning',
    shortTitle: 'Applied GenAI & RAG',
    credentialCode: 'CS-AIIN',
    emoji: '🤖',
    category: 'AI & Autonomous Models',
    lessonsCount: 8,
    level: 'Intermediate → Advanced',
    route: '/intermediate-ai',
    briefOverview: 'Production Retrieval-Augmented Generation (RAG), Parameter-Efficient Fine-Tuning (PEFT, LoRA/QLoRA), and vector database optimization.',
    whatYouWillGet: 'The production skills to adapt, specialize, and ground Large Language Models on private enterprise datasets.',
    inDepthSummary: 'Move beyond basic API calls. Learn how leading AI teams build enterprise-grade RAG systems with hybrid search, re-ranking, chunking strategies, and fine-tune open-weight models using Low-Rank Adaptation (LoRA).',
    modules: [
      {
        title: 'Module 1: Production RAG Architectures',
        description: 'Document ingestion, semantic chunking, embedding generation, and hybrid retrieval.',
        topics: ['Chunking Strategies (Fixed, Semantic, Recursive)', 'Hybrid Search: Keyword BM25 + Vector Dense Search', 'Cross-Encoder Re-Ranking Models']
      },
      {
        title: 'Module 2: Parameter-Efficient Fine-Tuning (PEFT)',
        description: 'Fine-tuning open weights without retraining the entire model.',
        topics: ['Why Fine-Tune vs Why RAG', 'LoRA (Low-Rank Adaptation) Mathematics', 'QLoRA 4-bit Quantization on Consumer GPUs']
      },
      {
        title: 'Module 3: Model Evaluation & Guardrails',
        description: 'Evaluating LLM hallucination rates, RAG Triad metrics, and safety guardrails.',
        topics: ['The RAG Triad (Context Relevance, Groundedness, Answer Relevance)', 'Input/Output Guardrails & PII Masking', 'Benchmarking Model Drift']
      }
    ],
    whatYouWillBeAbleToDo: [
      'Build production-grade RAG pipelines that prevent LLM hallucinations on enterprise documents.',
      'Fine-tune open-weight models (Llama, Mistral) on domain-specific datasets using LoRA.',
      'Implement hybrid search engines combining dense vectors with BM25 keyword matching.',
      'Evaluate and score AI pipeline performance using automated LLM-as-a-judge frameworks.'
    ],
    capstoneProjects: [
      'Enterprise Document Q&A System with Hybrid Search & Re-Ranking',
      'Domain-Specific Model Fine-Tuning Pipeline with LoRA / QLoRA',
      'Automated RAG Quality & Hallucination Auditing Dashboard'
    ],
    prerequisites: 'Completion of Foundations of AI & Neural Models or equivalent experience.',
    targetRoles: ['Applied AI Engineer', 'LLMOps Engineer', 'RAG Architect', 'AI Solutions Consultant']
  },
  {
    id: 'local',
    trackId: 'local',
    title: 'Offline-First Software Engineering',
    shortTitle: 'Offline-First PWAs',
    credentialCode: 'CS-LO',
    emoji: '🏠',
    category: 'Web & Frontend Architecture',
    lessonsCount: 15,
    level: 'Intermediate',
    route: '/local',
    briefOverview: 'Building resilient web software that functions 100% offline using Service Workers, IndexedDB, Cache API, and Progressive Web App manifests.',
    whatYouWillGet: 'The ability to build web apps that never show a dinosaur disconnected screen and store large datasets securely on client devices.',
    inDepthSummary: 'The modern web is often unreliable. Master the offline-first engineering philosophy: caching assets via Service Workers, storing gigabytes in client-side IndexedDB, and syncing data seamlessly when connectivity returns.',
    modules: [
      {
        title: 'Module 1: Client Storage & IndexedDB',
        description: 'Moving beyond 5MB localStorage to transactional, structured IndexedDB storage.',
        topics: ['localStorage vs sessionStorage Limits', 'IndexedDB Object Stores, Indexes & Transactions', 'Async Promisified Storage Wrappers']
      },
      {
        title: 'Module 2: Service Workers & Cache Storage API',
        description: 'Intercepting network requests, background caching, and cache lifecycle strategies.',
        topics: ['Service Worker Registration & Lifecycle', 'Cache-First vs Network-First Strategies', 'Stale-While-Revalidate Patterns']
      },
      {
        title: 'Module 3: Progressive Web Apps (PWAs) & Background Sync',
        description: 'App manifests, installation banners, background data synchronization, and push events.',
        topics: ['Web App Manifest & App Store Compliance', 'Background Sync API for Queued Mutations', 'Offline Indicators & State Sync']
      }
    ],
    whatYouWillBeAbleToDo: [
      'Engineer web applications that launch and function entirely without internet access.',
      'Store complex relational and binary data locally using client-side IndexedDB.',
      'Implement bulletproof caching strategies for assets and dynamic API responses.',
      'Package web applications into installable, standalone desktop and mobile PWAs.'
    ],
    capstoneProjects: [
      'Zero-Latency Offline Note & Markdown Editor with IndexedDB',
      'Full PWA Task Tracker with Background Mutation Queue & Sync',
      'Offline-First Audio & Media Player with Cache Storage API'
    ],
    prerequisites: 'Modern Frontend Engineering (HTML, CSS, JavaScript DOM fundamentals).',
    targetRoles: ['PWA Engineer', 'Frontend Performance Specialist', 'Offline-First Architect']
  },
  {
    id: 'three3d',
    trackId: 'three3d',
    title: 'Interactive 3D Graphics & WebGL',
    shortTitle: '3D Graphics & WebGL',
    credentialCode: 'CS-3D',
    emoji: '🧊',
    category: 'Web & Frontend Architecture',
    lessonsCount: 16,
    level: 'Intermediate → Advanced',
    route: '/three3d',
    briefOverview: 'Three.js 3D scene architecture, WebGL shaders, camera projections, lighting models, custom geometries, and spatial interactivity.',
    whatYouWillGet: 'The rare visual engineering skillset to create high-performance 3D graphics, animations, and product configurators directly in web browsers.',
    inDepthSummary: 'Step into spatial web development. Learn how GPU hardware renders triangles, manipulate 3D vectors and quaternions, apply PBR materials, load 3D GLTF models, and create interactive browser-based 3D showcases.',
    modules: [
      {
        title: 'Module 1: Three.js Fundamentals & Coordinate Space',
        description: 'Scenes, cameras, perspective projections, render loops, and coordinate math.',
        topics: ['PerspectiveCamera vs OrthographicCamera', 'The RequestAnimationFrame Render Loop', '3D Coordinate Space & Transformations']
      },
      {
        title: 'Module 2: Geometries, Materials & Lighting',
        description: 'Parametric geometries, physically based rendering (PBR) materials, and realistic lighting.',
        topics: ['MeshStandardMaterial vs MeshPhysicalMaterial', 'Directional, Ambient, Spot & Point Lights', 'Shadow Maps & Environmental Reflection Maps']
      },
      {
        title: 'Module 3: Interactivity, Physics & Model Loading',
        description: 'Raycasting for user mouse interaction, loading 3D GLTF/GLB models, and animation clips.',
        topics: ['Raycasting & Hover/Click Detection', 'Importing Optimized GLTF / GLB Assets', 'Three.js AnimationMixer & Bone Rigs']
      },
      {
        title: 'Module 4: Particle Systems & Custom Shaders',
        description: 'GPU particle simulations and introduction to custom GLSL vertex and fragment shaders.',
        topics: ['BufferGeometry & Points Particle Systems', 'GLSL Vertex Shaders for Mesh Deformation', 'GLSL Fragment Shaders for Procedural Colors']
      }
    ],
    whatYouWillBeAbleToDo: [
      'Render smooth 60fps 3D scenes in the browser using Three.js and WebGL.',
      'Import, optimize, and animate real-world 3D assets exported from Blender.',
      'Handle user mouse, touch, and camera orbit interactions in 3D coordinate space.',
      'Write custom GLSL shaders for advanced visual effects and particle systems.'
    ],
    capstoneProjects: [
      'Interactive 3D E-Commerce Product Showcase & Customizer',
      'Dynamic Procedural Galaxy & Particle Universe Simulator',
      'First-Person Spatial Architectural Walkthrough in Browser'
    ],
    prerequisites: 'Modern Frontend Engineering (JavaScript fundamentals and DOM lifecycle).',
    targetRoles: ['Creative Technologist', '3D Web Developer', 'WebGL Engineer', 'Interactive Frontend Developer']
  },
  {
    id: 'freelance',
    trackId: 'freelance',
    title: 'Software Consultancy & Client Acquisition',
    shortTitle: 'Consultancy & Clients',
    credentialCode: 'CS-FR',
    emoji: '💼',
    category: 'Consultancy & Commercial Practice',
    lessonsCount: 12,
    level: 'All Levels',
    route: '/freelance',
    briefOverview: 'Positioning technical skills as business solutions, niche selection, value-based pricing, discovery calls, and contract structures.',
    whatYouWillGet: 'The commercial mindset to transition from hourly wage trading to high-margin software consultancy contracts.',
    inDepthSummary: 'Great coding skills without commercial business acumen lead to underpaid work. Learn how elite consultants position their offers, conduct high-converting discovery calls, price on business ROI, and deliver client satisfaction.',
    modules: [
      {
        title: 'Module 1: Niche Positioning & Offer Architecture',
        description: 'Moving away from commodity generic freelance to specialized high-demand engineering services.',
        topics: ['Commodity vs Specialist Positioning', 'Identifying High-Budget Client Niches', 'Packaging Engineering into Fixed Deliverables']
      },
      {
        title: 'Module 2: Discovery Calls & Client Psychology',
        description: 'The exact framework to uncover business pain points and qualify client budgets.',
        topics: ['The Diagnostic Discovery Call Framework', 'Uncovering the Cost of Inaction', 'Qualifying Budgets without Feeling Awkward']
      },
      {
        title: 'Module 3: Value-Based Pricing & Contracts',
        description: 'Why hourly billing caps income, and how to price based on business value created.',
        topics: ['Hourly vs Milestone vs Value-Based Pricing', 'Master Services Agreements (MSA) & Scope of Work', 'Milestone Invoicing & Retainer Agreements']
      }
    ],
    whatYouWillBeAbleToDo: [
      'Define a high-ticket specialized technical engineering offer.',
      'Lead professional discovery consultations that establish your authority.',
      'Draft ironclad proposals and contracts that eliminate scope creep and protect payment.',
      'Price projects based on business value, earning 3x–5x more than commodity hourly rates.'
    ],
    capstoneProjects: [
      'Specialized Technical Service Positioning Playbook',
      'End-to-End Client Proposal & Master Services Agreement',
      'Value-Based Pricing Calculator for Custom Software Projects'
    ],
    prerequisites: 'Foundational programming knowledge in any track.',
    targetRoles: ['Freelance Software Engineer', 'Independent Technical Consultant', 'Agency Founder']
  },
  {
    id: 'real-freelance',
    trackId: 'real-freelance',
    title: 'Commercial Engineering Practice',
    shortTitle: 'Commercial Practice',
    credentialCode: 'CS-RFR',
    emoji: '🎓',
    category: 'Consultancy & Commercial Practice',
    lessonsCount: 12,
    level: 'Intermediate → Advanced',
    route: '/real-freelance',
    briefOverview: 'Winning proposals on Upwork/LinkedIn, managing asynchronous enterprise clients, milestone deliverables, and agency scaling.',
    whatYouWillGet: 'Actionable, battle-tested playbooks to consistently win contracts on competitive marketplaces and scale into recurring retainers.',
    inDepthSummary: 'Tactical execution for modern freelancers. Master marketplace algorithms, write winning cover letters that get read in 5 seconds, communicate like an executive, and build high-ticket monthly recurring retainers.',
    modules: [
      {
        title: 'Module 1: Marketplace Algorithms & Profiles',
        description: 'Optimizing profiles, search ranking, portfolio proof, and initial social proof.',
        topics: ['Platform SEO & Keyword Optimization', 'Proof-Driven Portfolio Architecture', 'Overcoming Zero-Review Profile Friction']
      },
      {
        title: 'Module 2: High-Conversion Proposal Writing',
        description: 'Anatomy of proposals that get opened, replied to, and converted.',
        topics: ['The 3-Sentence Hook Pattern', 'Custom Loom Video Strategy', 'Eliminating Client Risk in the First Paragraph']
      },
      {
        title: 'Module 3: Asynchronous Client Delivery & Retainers',
        description: 'Flawless milestone delivery, proactive status updates, and upsell retainers.',
        topics: ['Asynchronous Communication & Loom Updates', 'Managing Difficult Clients & Scope Boundaries', 'Converting Fixed Projects into $3,000+/mo Retainers']
      }
    ],
    whatYouWillBeAbleToDo: [
      'Write proposals with a 40%+ reply rate on competitive platforms.',
      'Build trust instantly using custom video audits and architecture breakdowns.',
      'Deliver software projects on schedule with zero client anxiety or disputes.',
      'Turn one-off project completions into ongoing monthly engineering retainers.'
    ],
    capstoneProjects: [
      'Marketplace Profile & Case Study Conversion Suite',
      'Winning Proposal & Video Audit Outreach Template',
      'Monthly Retainer Service Agreement & Client Onboarding System'
    ],
    prerequisites: 'Foundational technical skills and Software Consultancy & Client Acquisition.',
    targetRoles: ['Top-Rated Marketplace Freelancer', 'Digital Agency Owner', 'Contract Senior Engineer']
  }
];

export function getCourseCurriculum(trackIdOrId: string): CourseCurriculumInfo | undefined {
  const normalized = trackIdOrId.toLowerCase().trim();
  return COURSE_CURRICULUM.find(
    c => c.id.toLowerCase() === normalized || c.trackId.toLowerCase() === normalized
  );
}
