// Computer & Networking Module 1 — 10 lessons
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
  philosophy:
    'As a developer, you aren\'t just writing text — you are managing physical resources. Every variable lives in RAM, every loop consumes CPU cycles, every pixel is rendered by the GPU. Understanding the hardware "pantry" lets you write lean code that doesn\'t crash the user\'s device.',
  concepts: [
    {
      title: '1. The Processor (CPU) — The Decision Maker',
      beginner: 'It\'s a fast calculator. The CPU runs through a Fetch → Decode → Execute cycle for every instruction.',
      advanced: 'Modern CPUs use multi-threading. A heavy JavaScript loop blocks the main thread and freezes your UI. Pros move heavy math to a Web Worker so it runs on a different core, keeping the UI smooth at 60fps.',
      expertInsight: 'Understanding "Cache Locality" is the mark of an expert. When your code accesses data in a linear fashion, the CPU can predict the next move and pre-fetch it, drastically reducing wait times.'
    },
    {
      title: '2. Memory (RAM) — The Active Workspace',
      beginner: 'It\'s where your open tabs live. Volatile — disappears when power is lost. Extremely fast.',
      advanced: 'This is the Heap and Stack. A Memory Leak means your code keeps asking for RAM but never frees it. Eventually the browser runs out of space and the tab crashes with "Out of Memory."',
      expertInsight: 'Learn to use Chrome DevTools "Memory" tab to take heap snapshots. By identifying "Detached DOM nodes," you can stop leaks that would otherwise force your users to refresh their tabs.'
    },
    {
      title: '3. Graphics (GPU) — The Visual Specialist',
      beginner: 'Used for gaming and videos. It handles thousands of tiny tasks at once.',
      advanced: 'In frontend, we use Hardware Acceleration. CSS like `will-change: transform;` or `transform: translate3d(0,0,0)` moves rendering from CPU to GPU, giving 60fps animations.',
      expertInsight: 'Be careful! Excessive use of `will-change` creates too many layers in the GPU memory, which can actually cause "layer explosion" and slow down your site. Use it only when necessary.'
    },
    {
      title: '4. Storage (SSD) — The Permanent Library',
      beginner: 'Where your files are saved. Persists when the power is off.',
      advanced: 'I/O speed matters. Reading from SSD is ~100× slower than reading from RAM. Always cache hot data in memory so you don\'t hit the slow disk repeatedly.',
      expertInsight: 'With modern PWA development, use IndexedDB for large datasets. It acts as a bridge between the speed of RAM and the permanence of the SSD, allowing your app to feel instant even on slow networks.'
    },
  ],
  practical: {
    title: 'Hardware Inspection Lab',
    intro: 'To be a professional you must know how to monitor the machine.',
    steps: [
      'Open Task Manager (Windows: Ctrl+Shift+Esc) or Activity Monitor (Mac: Cmd+Space → "Activity Monitor").',
      'Open your browser and visit a 3D site like Google Earth — watch the GPU spike.',
      'Now open 20 tabs of any news site — watch the RAM usage climb.',
      'Force-quit one heavy tab and observe the memory drop instantly.',
    ],
    goal: 'A well-coded app uses minimum RAM while keeping CPU usage low when idle.',
  },
  quiz: [
    {
      question: 'Which component handles thousands of small simultaneous calculations for animations?',
      options: ['CPU', 'RAM', 'GPU', 'SSD'],
      correctIndex: 2,
      explanation: 'The GPU is built for massive parallel work — perfect for rendering pixels.',
    },
    {
      question: 'A user\'s browser feels sluggish with high memory usage. Which resource is exhausted?',
      options: ['Long-term storage', 'Random Access Memory (RAM)', 'Network bandwidth', 'Battery'],
      correctIndex: 1,
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
    },
  ],
  keyTakeaways: [
    'CPU runs Fetch → Decode → Execute; use Web Workers to prevent blocking.',
    'RAM is for current state; use DevTools memory snapshots to fix leaks.',
    'GPU is for parallel rendering; use CSS hardware acceleration sparingly.',
    'SSD is slow compared to RAM; use IndexedDB to cache data intelligently.',
  ],
},

  {
    id: 'net-2',
    module: 'Module 1: Computer & Network Fundamentals',
    order: 2,
    title: 'Operating Systems — The Software Manager',
    icon: '⚙️',
    philosophy:
      'An OS is the translator between your code and the hardware. Without it, you would have to write custom code just to turn on a single pixel. The OS manages resources so multiple apps can run without fighting over the CPU or RAM.',
    concepts: [
      {
        title: '1. The Kernel — The Heart of the OS',
        beginner: 'The background engine that starts when you turn the computer on.',
        advanced:
          'The Kernel handles System Calls. When your JS asks to "Download a File," the browser asks the Kernel for permission to write to disk. The Kernel decides whether the action is safe.',
      },
      {
        title: '2. Process vs. Thread',
        beginner: 'A Process is a running app. A Thread is a worker inside that app.',
        advanced:
          'Each process has its own private memory. A single process (Chrome) can have many threads (UI, audio, downloads). If one thread crashes it can take the whole process down — that\'s why Chrome runs each tab as a separate Process.',
      },
      {
        title: '3. Filesystems',
        beginner: 'Just folders and files — NTFS on Windows, APFS on Mac.',
        advanced:
          'In Linux, "everything is a file." Devs must understand Absolute vs Relative paths so code finds its assets on every OS.',
      },
    ],
    practical: {
      title: 'The "Process" Investigation',
      intro: 'See how your OS manages threads and processes.',
      steps: [
        'Open Task Manager (Windows) / Activity Monitor (Mac) and switch to the Processes tab.',
        'Find Chrome / Brave — notice it isn\'t one row, it\'s dozens of sub-processes.',
        'End Task on one of the smaller sub-processes.',
        'Watch one specific tab or extension crash while the rest of the browser stays alive.',
      ],
      goal: 'Your code never runs alone — it always competes for priority from the OS.',
    },
    quiz: [
      {
        question: 'What is the Kernel?',
        options: [
          'The user interface where you click icons',
          'The core of the OS that bridges hardware and software',
          'A type of virus',
          'The physical restart button',
        ],
        correctIndex: 1,
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
      },
    ],
    keyTakeaways: [
      'The Kernel is the bridge between hardware and software',
      'Processes have private memory; threads share memory inside a process',
      'Chrome isolates tabs as processes for crash safety',
      'Pathing differs across OSes — code defensively',
    ],
  },

  {
    id: 'net-3',
    module: 'Module 1: Computer & Network Fundamentals',
    order: 3,
    title: 'The Command Line — The Developer\'s Power Tool',
    icon: '💻',
    philosophy:
      'The GUI was designed for simplicity, not power. The CLI is your direct line to the OS. Almost every professional dev tool — Git, npm, Docker, deployment — runs from the command line.',
    concepts: [
      {
        title: '1. Absolute vs Relative Paths',
        beginner: 'A path is the address of a file or folder.',
        advanced:
          'Absolute path: full address from root (`C:/Users/Nishan/Desktop/Project`). Relative path: from current location (`./images/logo.png`). Use relative paths in code so it works on any machine.',
      },
      {
        title: '2. Common Commands',
        beginner: 'Type a command, press Enter, the OS runs it.',
        advanced:
          '`pwd` (where am I), `ls` / `dir` (list files), `cd folder` (enter), `cd ..` (go up), `mkdir name` (make folder), `touch file` (create file), `rm file` (delete).',
      },
      {
        title: '3. Permissions & Danger',
        beginner: 'Some commands need admin rights.',
        advanced:
          'The CLI is powerful and dangerous — `rm -rf /` can delete your entire OS. Standard users can only edit their own files; `sudo` (Linux/Mac) or "Run as Administrator" (Windows) elevates privileges.',
      },
    ],
    practical: {
      title: 'Your First Folder, From Scratch',
      intro: 'Create a project folder using only the terminal.',
      steps: [
        'Open Terminal (Mac/Linux) or PowerShell (Windows).',
        'Type `cd Desktop` to go to your desktop.',
        'Type `mkdir code-sage-test` to create a folder.',
        'Type `cd code-sage-test` to enter it.',
        'Type `touch index.html` (Mac/Linux) or `ni index.html` (PowerShell) to create a file.',
        'Type `ls` (or `dir`) to verify the file is there.',
      ],
      goal: 'You created a folder and file without ever touching the mouse.',
    },
    quiz: [
      {
        question: 'How do you go up one folder in the terminal?',
        options: ['`cd forward`', '`cd ..`', '`exit`', '`mkdir back`'],
        correctIndex: 1,
      },
      {
        question: 'Which command lists files in the current directory (Mac/Linux)?',
        options: ['`list`', '`ls`', '`show`', '`open`'],
        correctIndex: 1,
      },
      {
        question: 'What does `mkdir` do?',
        options: ['Deletes a directory', 'Makes a new directory', 'Renames a file', 'Moves files'],
        correctIndex: 1,
      },
      {
        question: 'Why is the CLI considered dangerous?',
        options: [
          'It can damage the screen',
          'A wrong command can delete files or the whole OS',
          'It uses too much RAM',
          'It blocks the internet',
        ],
        correctIndex: 1,
      },
    ],
    keyTakeaways: [
      'Use relative paths in code so it works on any machine',
      '`pwd`, `ls`, `cd`, `mkdir`, `touch`, `rm` are your daily commands',
      '`cd ..` moves up one folder',
      'Elevated commands (sudo / admin) can permanently destroy data',
    ],
  },

  {
    id: 'net-4',
    module: 'Module 1: Computer & Network Fundamentals',
    order: 4,
    title: 'IP Addressing — The Internet\'s House Numbers',
    icon: '📍',
    philosophy:
      'Every device on a network needs a unique address so packets know where to go. That\'s an IP address — like a house number for your computer.',
    concepts: [
      {
        title: '1. IPv4 vs IPv6',
        beginner: 'IPv4 looks like `192.168.1.1`. IPv6 is much longer with letters.',
        advanced:
          'IPv4 has only ~4.3 billion addresses — we ran out. IPv6 uses hexadecimal and provides 340 undecillion addresses — enough for every grain of sand.',
      },
      {
        title: '2. Public vs Private IP',
        beginner: 'Private IPs are inside your home; public IPs face the internet.',
        advanced:
          'Your router has one Public IP given by your ISP. Inside your network, devices get Private IPs (10.x, 172.16-31.x, 192.168.x) assigned by the router via NAT.',
      },
      {
        title: '3. Static vs Dynamic',
        beginner: 'Static IPs never change; dynamic IPs do.',
        advanced:
          'Servers usually have Static IPs so DNS can always find them. Home devices get Dynamic IPs from DHCP — they may change every reboot or every few days.',
      },
    ],
    practical: {
      title: 'Find Your IP Addresses',
      intro: 'Discover your private and public IPs.',
      steps: [
        'Find your Private IP — Windows: `ipconfig`, Mac/Linux: `ifconfig` or `ip addr`. Look for "IPv4 Address."',
        'Find your Public IP — open a browser and search "What is my IP?"',
        'Notice they\'re different — that\'s NAT in action.',
        'Restart your router and check if your public IP changed (most ISPs give dynamic IPs).',
      ],
      goal: 'Understand the difference between what your device thinks its address is, and what the internet sees.',
    },
    quiz: [
      {
        question: 'Which gives the most unique addresses?',
        options: ['IPv4', 'IPv6', 'MAC', 'Subnet'],
        correctIndex: 1,
      },
      {
        question: 'Who assigns private IPs inside your home?',
        options: ['The web browser', 'The router', 'The CPU', 'Google'],
        correctIndex: 1,
      },
      {
        question: 'What is a Static IP?',
        options: [
          'An IP that changes every minute',
          'An IP that never changes — usually for servers',
          'An IP without internet access',
          'A backup IP',
        ],
        correctIndex: 1,
      },
      {
        question: '`192.168.1.5` is an example of what?',
        options: ['Public IP', 'Private IP', 'MAC address', 'IPv6 address'],
        correctIndex: 1,
      },
    ],
    keyTakeaways: [
      'IPv4 is running out; IPv6 fixes that with hexadecimal addresses',
      'Public IP = your router\'s internet address; Private IPs = devices inside',
      'Static IPs are for servers; dynamic IPs (DHCP) are for clients',
      'NAT lets many private devices share one public IP',
    ],
  },

  {
    id: 'net-5',
    module: 'Module 1: Computer & Network Fundamentals',
    order: 5,
    title: 'DNS & DHCP — The Internet\'s Phonebook',
    icon: '📒',
    philosophy:
      'Humans remember names like google.com; computers route by numbers like 142.250.x.x. DNS translates names to numbers. DHCP hands out IPs so you don\'t have to configure them manually.',
    concepts: [
      {
        title: '1. The DNS Lookup Chain',
        beginner: 'You type a website name; somehow the browser finds the right server.',
        advanced:
          'Browser → OS cache → Recursive Resolver (your ISP) → Root servers → TLD servers (.com) → Authoritative server holding the master record. Each step caches the answer for faster lookups next time.',
      },
      {
        title: '2. Common DNS Records',
        beginner: 'Different record types for different things.',
        advanced:
          '`A` — domain → IPv4. `AAAA` — domain → IPv6. `CNAME` — alias. `MX` — mail server. `TXT` — verification & SPF/DKIM. As a dev you\'ll edit these constantly.',
      },
      {
        title: '3. DHCP — Auto IP Assignment',
        beginner: 'When your device joins WiFi, it just gets an IP automatically.',
        advanced:
          'Device sends DHCPDISCOVER → server replies DHCPOFFER → device DHCPREQUEST → server DHCPACK with a "lease" (e.g., 24 hours). When the lease expires, it renews or asks for a new one.',
      },
    ],
    practical: {
      title: 'Trace a DNS Lookup',
      intro: 'See DNS in action.',
      steps: [
        'Open terminal and run `nslookup google.com` (or `dig google.com` on Mac/Linux).',
        'Notice the server that answered and the IP returned.',
        'Try `nslookup youtube.com` — observe the multiple answers.',
        'Flush your DNS cache — Windows: `ipconfig /flushdns`, Mac: `sudo killall -HUP mDNSResponder`.',
        'Now reload a website and notice the slight first-load delay (cache was empty).',
      ],
      goal: 'See that every URL is silently translated to an IP before any data flows.',
    },
    quiz: [
      {
        question: 'What does DNS do?',
        options: [
          'Encrypts your traffic',
          'Translates domain names to IP addresses',
          'Speeds up your CPU',
          'Stores cookies',
        ],
        correctIndex: 1,
      },
      {
        question: 'Which record maps a domain to an IPv4 address?',
        options: ['MX', 'CNAME', 'A', 'DHCP'],
        correctIndex: 2,
      },
      {
        question: 'What happens when a DHCP lease expires?',
        options: [
          'The device permanently loses internet',
          'The device asks the DHCP server to renew the lease',
          'The router restarts',
          'The DNS cache clears',
        ],
        correctIndex: 1,
      },
      {
        question: 'Why do DNS responses get cached?',
        options: [
          'To hide browsing from the ISP',
          'So repeated lookups are instant instead of querying the chain again',
          'To save battery',
          'To reduce screen brightness',
        ],
        correctIndex: 1,
      },
    ],
    keyTakeaways: [
      'DNS = phonebook of the internet (name → IP)',
      'A, AAAA, CNAME, MX, TXT are the records you\'ll edit as a dev',
      'DHCP auto-assigns IPs with a time-limited lease',
      'Caching makes the web feel fast',
    ],
  },

  {
    id: 'net-6',
    module: 'Module 1: Computer & Network Fundamentals',
    order: 6,
    title: 'The OSI Model — How Data Travels',
    icon: '🌐',
    philosophy:
      'Data doesn\'t magically jump from your laptop to a server in California — it travels through 7 conceptual layers. Each layer has one job. Knowing the model helps you debug whether a bug is in your code, your network, or the server.',
    concepts: [
      {
        title: '1. The 7 Layers (Top → Bottom)',
        beginner: 'Layer 7 = your app, Layer 1 = the cable. Each layer wraps the one below.',
        advanced:
          '7. Application (HTTP), 6. Presentation (encryption/SSL), 5. Session, 4. Transport (TCP/UDP), 3. Network (IP routing), 2. Data Link (MAC, frames), 1. Physical (cables/wifi waves).',
      },
      {
        title: '2. TCP vs UDP — The Transport Layer',
        beginner: 'TCP is reliable; UDP is fast.',
        advanced:
          'TCP guarantees delivery and order — used by HTTP, email, file transfer. UDP is fire-and-forget — used by video calls, gaming, live streams where speed beats accuracy.',
      },
      {
        title: '3. Encapsulation',
        beginner: 'Each layer adds its own envelope around the data.',
        advanced:
          'Your HTTP request gets wrapped with a TCP header → wrapped with an IP header → wrapped with a MAC frame → finally sent as bits on the wire. The receiver unwraps in reverse.',
      },
    ],
    practical: {
      title: 'Inspect a Real Request',
      intro: 'See the layers in your browser DevTools.',
      steps: [
        'Open any website and press F12 → Network tab.',
        'Reload the page and click on the first request (the HTML doc).',
        'Headers tab → Layer 7 (HTTP method, status, headers).',
        'Look at "Remote Address" — that\'s the Layer 3 (IP) address.',
        'The connection used (HTTP/2, TLS) is Layers 4 and 6 doing their job.',
      ],
      goal: 'Realize that one click triggers all 7 layers in milliseconds.',
    },
    quiz: [
      {
        question: 'Which protocol favors speed over perfect accuracy?',
        options: ['HTTP', 'TCP', 'UDP', 'IP'],
        correctIndex: 2,
      },
      {
        question: 'On which OSI layer does HTTP live?',
        options: ['Physical (1)', 'Network (3)', 'Transport (4)', 'Application (7)'],
        correctIndex: 3,
      },
      {
        question: 'What does the Network layer (Layer 3) primarily handle?',
        options: ['Encrypting passwords', 'Routing packets using IP addresses', 'Rendering HTML', 'Charging the battery'],
        correctIndex: 1,
      },
      {
        question: 'Why use TCP for downloads?',
        options: [
          'It is the only protocol allowed',
          'It guarantees every byte arrives in order',
          'It uses less RAM',
          'It works without internet',
        ],
        correctIndex: 1,
      },
    ],
    keyTakeaways: [
      '7 layers, each with one specific job',
      'TCP = reliable; UDP = fast',
      'Every request is wrapped (encapsulated) by each layer',
      'DevTools shows you the upper layers in action',
    ],
  },

  {
    id: 'net-7',
    module: 'Module 1: Computer & Network Fundamentals',
    order: 7,
    title: 'Protocols — The Rules of the Road',
    icon: '🛣️',
    philosophy:
      'A protocol is just an agreed-upon set of rules so two computers can understand each other. Picking the right protocol makes apps fast, secure, and reliable.',
    concepts: [
      {
        title: '1. HTTP & HTTPS — The Web',
        beginner: 'HTTP loads websites. HTTPS is the secure version.',
        advanced:
          'HTTPS = HTTP wrapped in TLS encryption. Modern browsers warn on plain HTTP. Always build with HTTPS — most APIs and OAuth providers reject HTTP.',
      },
      {
        title: '2. SSH & FTP — Server Tools',
        beginner: 'SSH = secure remote login. FTP = old way of moving files.',
        advanced:
          'SSH gives you encrypted shell access to a server. SFTP / SCP transfer files over SSH. Plain FTP sends passwords in clear text — avoid it.',
      },
      {
        title: '3. SMTP / IMAP — Email',
        beginner: 'SMTP sends mail; IMAP/POP3 reads mail.',
        advanced:
          'When your app sends a "forgot password" email, it talks SMTP to a mail server. SPF/DKIM/DMARC DNS records prove your mail isn\'t spam.',
      },
    ],
    practical: {
      title: 'See Who You\'re Talking To',
      intro: 'List active connections.',
      steps: [
        'Open terminal and run `netstat -an` (Windows/Mac/Linux).',
        'Look for the Local Address and Foreign Address columns.',
        'Note the port numbers — `:443` is HTTPS, `:80` is HTTP, `:22` is SSH.',
        'Open a new browser tab and load a site, then run netstat again — new connection appears.',
      ],
      goal: 'See your machine speaking multiple protocols simultaneously.',
    },
    quiz: [
      {
        question: 'Which is the secure version of HTTP?',
        options: ['HTTP2', 'HTTPS', 'FTP', 'SMTP'],
        correctIndex: 1,
      },
      {
        question: 'Which protocol is for video calls / gaming where speed > accuracy?',
        options: ['TCP', 'SMTP', 'UDP', 'SSH'],
        correctIndex: 2,
      },
      {
        question: 'What is SSH used for?',
        options: ['Sending email', 'Securely logging into a remote server\'s shell', 'Loading websites', 'Streaming video'],
        correctIndex: 1,
      },
      {
        question: 'What\'s the main reason to avoid plain FTP?',
        options: [
          'It\'s too slow',
          'It transmits credentials in plain text',
          'It only works on Mac',
          'It uses too much RAM',
        ],
        correctIndex: 1,
      },
    ],
    keyTakeaways: [
      'HTTPS encrypts HTTP — always default to it',
      'SSH replaces insecure FTP for server work',
      'SMTP sends email; SPF/DKIM/DMARC protect your sender reputation',
      'Each protocol has a default port (80, 443, 22, 25)',
    ],
  },

  {
    id: 'net-8',
    module: 'Module 1: Computer & Network Fundamentals',
    order: 8,
    title: 'Web Security Basics — The Shield',
    icon: '🛡️',
    philosophy:
      'If you build apps that handle user data, security isn\'t optional — it\'s the foundation. A single leak can end a startup. Learn the basics now so you don\'t learn them after a breach.',
    concepts: [
      {
        title: '1. Encryption (TLS / SSL)',
        beginner: 'A lock on your data so eavesdroppers see only gibberish.',
        advanced:
          'TLS performs a handshake using public/private keys, then switches to a fast symmetric cipher. The lock icon in the URL bar = TLS in action.',
      },
      {
        title: '2. Authentication vs Authorization',
        beginner: 'Auth = "who are you?" Authorization = "what can you do?"',
        advanced:
          'Use bcrypt/argon2 for password hashing — never store plaintext. Use JWT or session cookies for auth. Apply role-based access (RBAC) for authorization.',
      },
      {
        title: '3. Common Attacks',
        beginner: 'Hackers try to trick your app or its users.',
        advanced:
          'XSS (inject scripts into pages), SQL Injection (inject queries), CSRF (forged actions). Mitigate with input validation, parameterized queries, CSP headers, and CSRF tokens.',
      },
      {
        title: '4. Firewalls',
        beginner: 'A bouncer for your server.',
        advanced:
          'Filters traffic by IP, port, and protocol. Cloud providers expose this as Security Groups / WAF rules.',
      },
    ],
    practical: {
      title: 'Check Your Security',
      intro: 'Inspect any site\'s security posture.',
      steps: [
        'Click the lock icon next to any URL → "Connection is secure" → "Certificate is valid."',
        'Note the issuer (Let\'s Encrypt, DigiCert, etc.) and expiry date.',
        'Open DevTools → Security tab — see TLS version and cipher.',
        'Try visiting `http://neverssl.com` — see how the browser warns.',
      ],
      goal: 'Trained eye — you should never trust a login form on plain HTTP.',
    },
    quiz: [
      {
        question: 'What does a firewall do?',
        options: [
          'Stops physical fires',
          'Monitors and filters network traffic by security rules',
          'Backs up your files',
          'Speeds up the CPU',
        ],
        correctIndex: 1,
      },
      {
        question: 'Why hash passwords with bcrypt instead of storing them?',
        options: [
          'It saves disk space',
          'If the database leaks, attackers can\'t read the passwords',
          'It makes login faster',
          'Browsers require it',
        ],
        correctIndex: 1,
      },
      {
        question: 'What is XSS?',
        options: [
          'A type of cable',
          'Injecting malicious scripts into a webpage seen by other users',
          'A faster version of HTTPS',
          'A backup format',
        ],
        correctIndex: 1,
      },
      {
        question: 'Auth vs Authorization — which is which?',
        options: [
          'Both mean the same thing',
          'Auth = who you are; Authorization = what you can do',
          'Auth = passwords; Authorization = usernames',
          'Auth is for admins only',
        ],
        correctIndex: 1,
      },
    ],
    keyTakeaways: [
      'Always serve over HTTPS',
      'Hash passwords with bcrypt/argon2 — never plaintext',
      'Validate every input to prevent XSS / SQL injection',
      'Authentication ≠ Authorization',
    ],
  },

  {
    id: 'net-9',
    module: 'Module 1: Computer & Network Fundamentals',
    order: 9,
    title: 'The Browser — Where the Web Lives',
    icon: '🌍',
    philosophy:
      'Your code runs inside the browser — but the browser itself is one of the most complex pieces of software ever made. Understanding it makes you a better frontend developer.',
    concepts: [
      {
        title: '1. The Rendering Engine',
        beginner: 'Turns HTML and CSS into the pixels you see.',
        advanced:
          'Pipeline: Parse HTML → DOM, parse CSS → CSSOM, combine → Render Tree, Layout, Paint, Composite. Heavy CSS or layout thrashing slows this down.',
      },
      {
        title: '2. The JavaScript Engine (V8)',
        beginner: 'Runs your JS code.',
        advanced:
          'V8 (Chrome, Node) compiles JS to machine code via JIT. Other engines: SpiderMonkey (Firefox), JavaScriptCore / WebKit (Safari).',
      },
      {
        title: '3. Browser Storage',
        beginner: 'The browser can remember things between visits.',
        advanced:
          'Cookies (~4KB, sent with every request — auth tokens), LocalStorage (~5MB, persistent, no expiry), SessionStorage (per-tab), IndexedDB (large structured data).',
      },
      {
        title: '4. The Event Loop',
        beginner: 'How JS handles many things without blocking.',
        advanced:
          'Single-threaded JS uses a queue: synchronous code runs, then microtasks (Promises), then macrotasks (setTimeout, click events). Blocking the loop = frozen UI.',
      },
    ],
    practical: {
      title: 'Spy on LocalStorage',
      intro: 'See what websites store about you.',
      steps: [
        'Open DevTools → Application tab → Storage → Local Storage.',
        'Click on any domain — see the keys/values websites have saved on your machine.',
        'Try `localStorage.setItem("test", "hello")` in the Console.',
        'Refresh the page and run `localStorage.getItem("test")` — your data persists.',
        'Check the Cookies section too — you\'ll find session/auth tokens.',
      ],
      goal: 'Realize the browser is a database your apps can use directly.',
    },
    quiz: [
      {
        question: 'Which JS engine powers Chrome?',
        options: ['SpiderMonkey', 'V8', 'JavaScriptCore', 'WebKit'],
        correctIndex: 1,
      },
      {
        question: 'Which storage persists across browser restarts and is ~5MB?',
        options: ['SessionStorage', 'LocalStorage', 'Cookies (typical)', 'RAM'],
        correctIndex: 1,
      },
      {
        question: 'What does the Rendering Engine produce?',
        options: ['Network packets', 'The pixels you see on screen', 'JS bytecode', 'Sound output'],
        correctIndex: 1,
      },
      {
        question: 'Why is a long-running synchronous loop bad in JS?',
        options: [
          'It uses too much disk',
          'It blocks the event loop and freezes the UI',
          'It sends too many requests',
          'It deletes cookies',
        ],
        correctIndex: 1,
      },
    ],
    keyTakeaways: [
      'Render pipeline: DOM + CSSOM → Render Tree → Layout → Paint → Composite',
      'V8 compiles JS to machine code via JIT',
      'Cookies / LocalStorage / SessionStorage / IndexedDB each have a purpose',
      'JS is single-threaded; never block the event loop',
    ],
  },

  {
    id: 'net-10',
    module: 'Module 1: Computer & Network Fundamentals',
    order: 10,
    title: 'Servers & The Cloud — Where the Web Lives',
    icon: '☁️',
    philosophy:
      '"The Cloud" isn\'t magic — it\'s someone else\'s computer in a giant air-conditioned warehouse. As a dev you\'ll deploy your code to these computers every day.',
    concepts: [
      {
        title: '1. What is a Server?',
        beginner: 'A computer that\'s always on, waiting to answer requests.',
        advanced:
          'Same hardware as a regular PC, but optimized for uptime, networking, and concurrent connections. Runs server software (Nginx, Node, PostgreSQL).',
      },
      {
        title: '2. The Cloud — Really',
        beginner: 'Renting servers from companies like AWS, Google, Vercel.',
        advanced:
          'IaaS (raw VMs — AWS EC2), PaaS (managed runtimes — Heroku, Vercel), SaaS (full apps — Gmail). Lovable Cloud is PaaS — you don\'t manage servers.',
      },
      {
        title: '3. Static vs Dynamic Sites',
        beginner: 'Static = same for everyone. Dynamic = personalized.',
        advanced:
          'Static = pre-built HTML files served from a CDN (super fast, cheap). Dynamic = server runs code per request (DB queries, personalization). Modern apps mix both via SSR / ISR.',
      },
      {
        title: '4. CDN — Content Delivery Network',
        beginner: 'Copies of your site stored close to users.',
        advanced:
          'Cloudflare, Fastly, etc. cache your assets in 200+ cities. A user in Tokyo loads from Tokyo, not your origin in New York. Cuts latency 5–10×.',
      },
    ],
    practical: {
      title: 'Inspect a Server Response',
      intro: 'See server info live.',
      steps: [
        'Open DevTools → Network tab.',
        'Reload any site and click the first request.',
        'Headers tab → Response Headers — look for `server:`, `cf-ray:` (Cloudflare), `x-vercel-id:`, etc.',
        'These tell you what software & CDN powers the site.',
        'Try `ping google.com` in your terminal — note the response times in milliseconds.',
      ],
      goal: 'Every site you visit is the result of one or more servers responding in milliseconds.',
    },
    quiz: [
      {
        question: 'What is a server, simply put?',
        options: [
          'A waiter in a restaurant',
          'A computer that stays on and responds to requests',
          'A type of cable',
          'A USB drive',
        ],
        correctIndex: 1,
      },
      {
        question: 'What is "the cloud" really?',
        options: [
          'Floating data in the sky',
          'Someone else\'s computers in a data center',
          'A type of WiFi',
          'A new browser',
        ],
        correctIndex: 1,
      },
      {
        question: 'What does a CDN do?',
        options: [
          'Encrypts your traffic',
          'Caches content close to users for faster loads',
          'Replaces your server',
          'Generates databases',
        ],
        correctIndex: 1,
      },
      {
        question: 'Static vs Dynamic — which is faster for the same content for all users?',
        options: ['Dynamic — always personalized', 'Static — pre-built and served from CDN', 'They are identical', 'Neither'],
        correctIndex: 1,
      },
    ],
    keyTakeaways: [
      'Servers are always-on computers running server software',
      '"The Cloud" = rented servers from AWS / Google / Vercel / etc.',
      'Static sites are fast and cheap; dynamic sites are personalized',
      'CDNs cut latency dramatically by serving from nearby locations',
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
