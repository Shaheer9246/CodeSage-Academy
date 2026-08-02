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
  philosophy: 'Think of your hardware as your "Player Inventory." A weak inventory makes the game sluggish; an optimized one makes you unstoppable. Every line of code you write consumes resources from this stash.',
  concepts: [
    {
      title: '1. The Processor (CPU) — The Main Engine',
      beginner: 'The brain of the operation. It runs your code instruction by instruction, cycle by cycle.',
      advanced: 'Heavy JS loops block the "Main Thread," causing UI lag. Pro-tip: Use Web Workers to offload heavy math to a "side-quest" CPU core, keeping your frame budget under 16ms to avoid jank.',
    },
    {
      title: '2. Memory (RAM) — The Active Workspace',
      beginner: 'Your temporary "backpack." Stores data while the app is running; it clears itself when you quit.',
      advanced: 'Memory Leaks occur when you keep items in your backpack you no longer need. Eventually, you run out of space and the tab crashes. Use Chrome’s Memory Heap Snapshot to find "detached nodes" and clean your inventory.',
    },
    {
      title: '3. Graphics (GPU) — The Visual Specialist',
      beginner: 'A team of artists specialized in drawing pixels really fast. Perfect for gaming and video.',
      advanced: 'CSS `will-change` tells the GPU, "Hey, this item is about to move!" It prepares the GPU to handle animations without taxing the CPU. Use this buff sparingly, or you might cause "layer explosion" and slow down your site.',
    },
    {
      title: '4. Storage (SSD) — The Permanent Library',
      beginner: 'Your long-term vault. Saves data even after the power is gone.',
      advanced: 'SSD access is 100x slower than RAM. Always cache frequently used items in memory so you don\'t have to run to the "library" constantly. Use IndexedDB for massive data sets—it’s like a smart index for your vault.',
    }
  ],
  practical: {
    title: 'Hardware Inspection Lab',
    intro: 'To be a professional, you must monitor your machine.',
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
    'CPU runs instructions; use Web Workers to prevent blocking.',
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
    philosophy: 'Think of the OS as the "Game Master." It controls the rules, manages resources, and ensures your app doesn\'t crash the machine while trying to play the game.',
    concepts: [
      {
        title: '1. The Kernel — The Heart of the OS',
        beginner: 'The background engine that starts when you turn the computer on; it controls the hardware.',
        advanced: 'The Kernel is the ultimate Security Gatekeeper. When your code tries to access a file, it must send a "System Call." The Kernel checks your permissions first—this is why code can\'t just "poke" hardware directly, it must ask the Kernel for a permit.',
      },
      {
        title: '2. Process vs. Thread',
        beginner: 'A Process is a running app; a Thread is a worker doing a specific job inside that app.',
        advanced: 'Each process lives in a private "memory bubble." If one thread crashes, it could kill the whole process. Modern browsers run each tab as a separate Process—this is a design "buff" that ensures one frozen tab doesn\'t crash your entire browser!',
      },
      {
        title: '3. Filesystems',
        beginner: 'The way your computer organizes files and folders (like a digital filing cabinet).',
        advanced: 'On Linux/macOS, "everything is a file"—even your printer! Pro-tip: Always use "Relative Paths" (`./assets/img.png`) instead of absolute ones (`C:/Users/...`). This makes your code portable so it doesn\'t break when you move it to another machine.',
      },
    ],
    practical: {
      title: 'The "Process" Investigation',
      intro: 'Time to peek behind the curtain at the OS Manager.',
      steps: [
        'Open Task Manager (Windows) or Activity Monitor (Mac) and look at the Processes tab.',
        'Find your browser—notice it isn\'t one row, it\'s a whole squad of sub-processes.',
        'End one small sub-process and watch how only one tab or extension crashes while the others stay alive.',
      ],
      goal: 'Understand that your code is just one player in a very crowded game.',
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
      'The Kernel is the ultimate gatekeeper of hardware.',
      'Processes = apps; Threads = workers inside those apps.',
      'Modern apps isolate tasks to prevent full-system crashes.',
      'Use relative paths so your code doesn\'t "break" when moved.',
    ],
  },

 {
    id: 'net-3',
    module: 'Module 1: Computer & Network Fundamentals',
    order: 3,
    title: 'The Command Line — The Developer\'s Power Tool',
    icon: '💻',
    philosophy: 'Think of the CLI as your "Developer Console." GUIs are for users, but the command line is for creators—it gives you direct access to the machine without the "filter" of menus.',
    concepts: [
      {
        title: '1. Absolute vs Relative Paths',
        beginner: 'A path is simply the address of a file or folder on your computer.',
        advanced: 'Absolute paths are like a full GPS coordinate (`C:/Users/Nishan/Desktop`). Relative paths are like "go down the hall and turn left" (`./images/logo.png`). Pro-tip: Always use relative paths in your code so your project doesn\'t break when you move it to another computer!',
      },
      {
        title: '2. Common Commands',
        beginner: 'Type a command, press Enter, and the machine executes your orders.',
        advanced: 'Think of these as your "Action Menu": `pwd` (Where am I?), `ls` (What’s in this room?), `cd` (Move to a room), and `mkdir`/`touch` (Build items). These are the basic spells you’ll cast every single day.',
      },
      {
        title: '3. Permissions & Danger',
        beginner: 'Some commands are locked behind "Admin" mode for safety.',
        advanced: 'The CLI is powerful—`rm -rf /` is the "game-ender" command that can wipe your entire system. Treat the terminal with respect; `sudo` (Mac/Linux) or "Run as Administrator" (Windows) gives you "God Mode" privileges, but use them sparingly!',
      },
    ],
    practical: {
      title: 'Your First Folder, From Scratch',
      intro: 'Level up your skills by building a project folder without ever touching the mouse.',
      steps: [
        'Open your Terminal (Mac/Linux) or PowerShell (Windows).',
        'Type `cd Desktop` to move to your base camp.',
        'Type `mkdir code-sage-test` to spawn a new folder.',
        'Type `cd code-sage-test` to enter your new territory.',
        'Type `touch index.html` (or `ni index.html` in PowerShell) to craft an empty file.',
        'Type `ls` (or `dir`) to verify your loot is there.',
      ],
      goal: 'Prove you can navigate the machine like a pro using only your keyboard.',
    },
    quiz: [
      {
        question: 'How do you go up one folder level in the terminal?',
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
        question: 'Why is the CLI considered powerful and dangerous?',
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
      'Use relative paths so your code stays portable on any machine.',
      '`pwd`, `ls`, `cd`, `mkdir`, `touch`, `rm` are your daily commands.',
      '`cd ..` is the standard "back" button for terminal users.',
      'Admin commands (`sudo`) are "God Mode"—they are permanent and powerful.',
    ],
  },

  {
    id: 'net-4',
    module: 'Module 1: Computer & Network Fundamentals',
    order: 4,
    title: 'IP Addressing — The Internet\'s House Numbers',
    icon: '📍',
    philosophy: 'Think of an IP address as your device’s "Global Mailing Address." Without it, the internet wouldn’t know how to deliver data packets to your doorstep.',
    concepts: [
      {
        title: '1. IPv4 vs IPv6',
        beginner: 'IPv4 looks like `192.168.1.1`. IPv6 is a much longer string of numbers and letters.',
        advanced: 'IPv4 hit a "capacity crisis" because we ran out of the 4.3 billion available addresses. IPv6 uses hexadecimal to provide 340 undecillion addresses—enough to give every grain of sand on Earth its own IP!',
      },
      {
        title: '2. Public vs Private IP',
        beginner: 'Private IPs stay inside your home network; Public IPs are visible to the outside world.',
        advanced: 'Your router acts as the "Receptionist." It takes the one Public IP provided by your ISP and uses NAT (Network Address Translation) to route traffic to your local devices via Private IPs. It’s a massive security buff that hides your local home network from the open web.',
      },
      {
        title: '3. Static vs Dynamic',
        beginner: 'Static IPs never change; Dynamic IPs can change whenever the router feels like it.',
        advanced: 'Servers require Static IPs so they can be reliably "found" by DNS. Home devices use Dynamic IPs via DHCP—they essentially "lease" an address for a while and then give it back. It’s an efficient way to manage limited "inventory" in a household full of devices.',
      },
    ],
    practical: {
      title: 'Find Your IP Addresses',
      intro: 'Time to see your machine’s "mailing address" and compare it to the world view.',
      steps: [
        'Find your Private IP: Type `ipconfig` (Windows) or `ifconfig`/`ip addr` (Mac/Linux). Look for "IPv4 Address."',
        'Find your Public IP: Search "What is my IP?" in your browser.',
        'Compare them: Notice they are different? That’s NAT in action—your router is shielding your local address!',
      ],
      goal: 'Understand the difference between your local "internal" ID and your identity on the global internet.',
    },
    quiz: [
      {
        question: 'Which addressing system provides the most unique addresses?',
        options: ['IPv4', 'IPv6', 'MAC', 'Subnet'],
        correctIndex: 1,
      },
      {
        question: 'Who acts as the "Receptionist" to assign private IPs inside your home?',
        options: ['The web browser', 'The router', 'The CPU', 'Google'],
        correctIndex: 1,
      },
      {
        question: 'What is a "Static IP"?',
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
      'IPv6 was created to solve the IPv4 address shortage.',
      'Public IP = your router\'s internet address; Private IPs = local device identities.',
      'Static IPs are for permanent infrastructure; Dynamic IPs (DHCP) are for client efficiency.',
      'NAT is the "Receptionist" that lets many internal devices share one global IP.',
    ],
  },

  {
    id: 'net-5',
    module: 'Module 1: Computer & Network Fundamentals',
    order: 5,
    title: 'DNS & DHCP — The Internet\'s Phonebook',
    icon: '📒',
    philosophy: 'Think of DNS as the Internet’s Contact List. Humans love names, but machines speak in numbers. DNS translates names to IPs, while DHCP is the invisible assistant that assigns those IDs automatically.',
    concepts: [
      {
        title: '1. The DNS Lookup Chain',
        beginner: 'You type a website name; the internet "magically" finds the right server.',
        advanced: 'It’s a relay race: Browser → OS Cache → ISP Resolver → Root Servers → TLD Servers (.com) → Authoritative Server. Every stop caches the result, saving time for your next visit. Caching is the secret ingredient that makes the web feel "instant."',
      },
      {
        title: '2. Common DNS Records',
        beginner: 'Different record types act as specialized entries in the phonebook.',
        advanced: 'Master these keys: `A` (Maps to IPv4), `AAAA` (Maps to IPv6), `CNAME` (An alias/nickname), `MX` (Mail server destination), and `TXT` (Verification/Security). You will be editing these frequently when you deploy your own apps!',
      },
      {
        title: '3. DHCP — Auto IP Assignment',
        beginner: 'Your device automatically gets an IP when it joins a network.',
        advanced: 'It’s a 4-step negotiation: Discover → Offer → Request → Acknowledge. Your router gives your device an IP "lease." If the lease expires, your device simply asks for a renewal—it’s like renewing a library book so you don’t lose your spot on the network.',
      },
    ],
    practical: {
      title: 'Trace a DNS Lookup',
      intro: 'Time to see the "translation" happening in real-time.',
      steps: [
        'Open your terminal and run `nslookup google.com` (or `dig google.com` on Mac/Linux).',
        'Observe the server that answered and the IP address it returned.',
        'Try `nslookup youtube.com`—notice how it returns multiple IP addresses (for load balancing).',
        'Flush your cache: `ipconfig /flushdns` (Windows) or `sudo killall -HUP mDNSResponder` (Mac).',
        'Reload a site and notice the tiny delay—that’s the "phonebook" lookup happening fresh!',
      ],
      goal: 'See that every URL is silently translated to an IP before your data can even start moving.',
    },
    quiz: [
      {
        question: 'What is the primary role of DNS?',
        options: [
          'Encrypts your private traffic',
          'Translates human-readable domain names into IP addresses',
          'Boosts your CPU performance',
          'Stores your browser cookies',
        ],
        correctIndex: 1,
      },
      {
        question: 'Which DNS record is used to map a domain to an IPv4 address?',
        options: ['MX', 'CNAME', 'A', 'DHCP'],
        correctIndex: 2,
      },
      {
        question: 'What happens when a device\'s DHCP lease expires?',
        options: [
          'The device is permanently banned from the internet',
          'The device asks the DHCP server to renew the lease',
          'The router initiates a full factory reset',
          'The local DNS cache is completely cleared',
        ],
        correctIndex: 1,
      },
      {
        question: 'Why does the web rely heavily on DNS caching?',
        options: [
          'To hide your browsing history from the ISP',
          'So repeated lookups are instant instead of querying the entire chain',
          'To save battery life on mobile devices',
          'To optimize screen brightness',
        ],
        correctIndex: 1,
      },
    ],
    keyTakeaways: [
      'DNS acts as the phonebook of the internet (Name → IP).',
      'Learn your records: A, AAAA, CNAME, MX, and TXT are developer essentials.',
      'DHCP is your "automatic assistant" that manages IP leases for you.',
      'Caching is the key to a fast, responsive web experience.',
    ],
  },

  {
    id: 'net-6',
    module: 'Module 1: Computer & Network Fundamentals',
    order: 6,
    title: 'The OSI Model — How Data Travels',
    icon: '🌐',
    philosophy: 'Think of the OSI Model as the "Shipping Pipeline." Data doesn\'t just teleport; it passes through 7 distinct stations. If your app breaks, this model helps you pinpoint exactly which station is failing.',
    concepts: [
      {
        title: '1. The 7 Layers (The Pipeline)',
        beginner: 'Layer 7 is your App (the browser), Layer 1 is the physical cable or Wi-Fi wave.',
        advanced: 'Data travels top-down (Application to Physical) to be sent, and bottom-up to be received. Each layer adds its own "shipping label" (header) to the package. Mastering these 7 steps turns you from a coder into a network detective.',
      },
      {
        title: '2. TCP vs UDP — The Transport Layer',
        beginner: 'TCP is reliable (makes sure it arrives); UDP is fast (doesn\'t care if it drops a few).',
        advanced: 'TCP is like a registered letter—it guarantees order and delivery (HTTP, Email). UDP is like shouting across a room—it’s pure speed, perfect for gaming or live streams where a dropped packet is better than a laggy delay.',
      },
      {
        title: '3. Encapsulation (The Envelope Trick)',
        beginner: 'Each layer wraps your data in its own envelope.',
        advanced: 'Your HTTP request gets wrapped with a TCP header (port info) → wrapped with an IP header (destination address) → wrapped with a MAC frame (hardware ID). When the server receives it, it "unwraps" these layers in reverse to find your original data.',
      },
    ],
    practical: {
      title: 'Inspect a Real Request',
      intro: 'Time to see the "Pipeline" in your own browser.',
      steps: [
        'Open any website and press F12 → Network tab.',
        'Reload the page and click on the first request (the HTML doc).',
        'Headers tab → That’s your Layer 7 (Application) info (HTTP methods, status codes).',
        'Look at "Remote Address" — that’s your Layer 3 (Network) IP address in action.',
        'The connection type (HTTP/2, TLS) shows Layers 4 and 6 doing the heavy lifting.',
      ],
      goal: 'Realize that a single mouse click triggers all 7 layers in just a few milliseconds.',
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
        question: 'Why do we use TCP for file downloads instead of UDP?',
        options: [
          'It is the only protocol allowed by the internet',
          'It guarantees every byte arrives and stays in order',
          'It uses significantly less RAM than UDP',
          'It works even without an internet connection',
        ],
        correctIndex: 1,
      },
    ],
    keyTakeaways: [
      'The OSI Model has 7 layers, each with one unique job in the "Shipping Pipeline."',
      'TCP = Reliability; UDP = Speed.',
      'Encapsulation is the process of wrapping your data in headers for each layer.',
      'Browser DevTools are your best tool for seeing these layers at work.',
    ],
  },

 {
    id: 'net-7',
    module: 'Module 1: Computer & Network Fundamentals',
    order: 7,
    title: 'Protocols — The Rules of the Road',
    icon: '🛣️',
    philosophy: 'Think of protocols as the "Languages of the Internet." If two computers don\'t speak the same protocol, they’re just two strangers passing in the night. Mastering these rules is what makes your apps fast, secure, and reliable.',
    concepts: [
      {
        title: '1. HTTP & HTTPS — The Web',
        beginner: 'HTTP fetches website pages; HTTPS is the secure, encrypted version.',
        advanced: 'HTTPS is literally just HTTP wrapped in a TLS "encryption jacket." Pro-tip: Never build on plain HTTP today—modern browsers will flag your app as "Insecure," and most APIs will flat-out reject your connection. Always default to HTTPS.',
      },
      {
        title: '2. SSH & FTP — Server Tools',
        beginner: 'SSH is for logging into remote computers securely; FTP is an older way to move files.',
        advanced: 'SSH gives you a secure "encrypted shell" to run commands on a server. Use SFTP (or SCP) for file transfers—never use plain FTP, as it broadcasts your passwords in clear text for anyone on the network to steal!',
      },
      {
        title: '3. SMTP / IMAP — The Mailroom',
        beginner: 'SMTP is for sending mail; IMAP/POP3 is for reading mail.',
        advanced: 'When your app sends a "Forgot Password" email, it’s talking via SMTP. Pro-tip: If your emails are landing in the spam folder, look into your DNS records—specifically SPF, DKIM, and DMARC. These are the "security IDs" that prove your mail is legitimate.',
      },
    ],
    practical: {
      title: 'See Who You\'re Talking To',
      intro: 'Time to see your machine’s active connections in real-time.',
      steps: [
        'Open your terminal and run `netstat -an` (Windows/Mac/Linux).',
        'Scan the "Local Address" and "Foreign Address" columns.',
        'Watch for port numbers: `:443` (HTTPS), `:80` (HTTP), and `:22` (SSH).',
        'Open a browser, load a new site, and run the command again—you’ll see a brand new "live connection" appear instantly.',
      ],
      goal: 'Realize that your machine is constantly chatting across dozens of different protocols at once.',
    },
    quiz: [
      {
        question: 'Which is the secure, encrypted version of HTTP?',
        options: ['HTTP2', 'HTTPS', 'FTP', 'SMTP'],
        correctIndex: 1,
      },
      {
        question: 'Which protocol is best for live video calls/gaming where speed is more important than perfect accuracy?',
        options: ['TCP', 'SMTP', 'UDP', 'SSH'],
        correctIndex: 2,
      },
      {
        question: 'What is the primary use of SSH?',
        options: ['Sending mass emails', 'Securely logging into a remote server\'s shell', 'Loading website assets', 'Streaming high-def video'],
        correctIndex: 1,
      },
      {
        question: 'Why must developers avoid plain FTP?',
        options: [
          'It is technically slower than other protocols',
          'It transmits your login credentials in plain text',
          'It only works on Apple Mac machines',
          'It consumes excessive system RAM',
        ],
        correctIndex: 1,
      },
    ],
    keyTakeaways: [
      'HTTPS encrypts HTTP—it is the modern standard for all web traffic.',
      'Always use SSH/SFTP over insecure FTP for server management.',
      'SMTP sends mail, but DNS records (SPF/DKIM/DMARC) are what protect your sender reputation.',
      'Every protocol has a default port (80 for HTTP, 443 for HTTPS, 22 for SSH, 25 for SMTP).',
    ],
  },

  {
    id: 'net-8',
    module: 'Module 1: Computer & Network Fundamentals',
    order: 8,
    title: 'Web Security Basics — The Shield',
    icon: '🛡️',
    philosophy: 'Think of security as your app’s "Armor." It isn\'t a luxury; it\'s the foundation. A single weak point can end a startup, so we learn the patterns of the "defenders" to stop the "intruders" before they get in.',
    concepts: [
      {
        title: '1. Encryption (TLS / SSL)',
        beginner: 'The digital lock on your data that keeps eavesdroppers from reading your secrets.',
        advanced: 'It starts with a "handshake" using public/private keys to agree on a secret, then switches to a high-speed symmetric cipher. That lock icon in your browser? That’s proof the handshake succeeded and your data is encrypted.',
      },
      {
        title: '2. Authentication vs Authorization',
        beginner: 'Auth is "Who are you?"; Authorization is "What are you allowed to do?"',
        advanced: 'Master these two rules: Never store plaintext passwords—use `bcrypt` or `argon2` to scramble them into irreversible hashes. For Authorization, use Role-Based Access (RBAC) to ensure a standard "user" can never access an "admin" dashboard.',
      },
      {
        title: '3. Common Attacks',
        beginner: 'Hackers try to trick your app or its users using malicious inputs.',
        advanced: 'Learn the "Big Three": XSS (injecting fake scripts), SQL Injection (tricking your database queries), and CSRF (tricking users into performing actions they didn\'t mean to). The cure? Always treat user input as "radioactive"—never trust it, always validate it!',
      },
      {
        title: '4. Firewalls',
        beginner: 'The bouncer standing at the door of your server.',
        advanced: 'Firewalls filter traffic based on rules (IP, port, protocol). Whether it’s a hardware device or a cloud-based Security Group (WAF), its job is to block unwanted traffic before it ever touches your application code.',
      },
    ],
    practical: {
      title: 'Check Your Security',
      intro: 'Time to put on your detective hat and inspect a site\'s "Armor."',
      steps: [
        'Click the lock icon next to any URL in your browser → "Connection is secure" → "Certificate is valid."',
        'Check the issuer (e.g., Let\'s Encrypt) and the expiration date.',
        'Open DevTools → Security tab: Peek at the TLS version and the specific "cipher" being used.',
        'Try visiting `http://neverssl.com`—observe how your browser warns you because the "Armor" is missing.',
      ],
      goal: 'Develop a "security instinct"—you should feel uneasy whenever you see a login form on plain, unencrypted HTTP.',
    },
    quiz: [
      {
        question: 'What does a firewall do for your server?',
        options: [
          'Stops physical office fires',
          'Monitors and filters network traffic based on security rules',
          'Automatically backs up your database files',
          'Speeds up the CPU processing power',
        ],
        correctIndex: 1,
      },
      {
        question: 'Why must you hash passwords with bcrypt instead of storing them as-is?',
        options: [
          'It saves disk space on your server',
          'If the database is leaked, attackers cannot read the actual passwords',
          'It makes the login process faster for the user',
          'Web browsers require hashed passwords to function',
        ],
        correctIndex: 1,
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
      },
      {
        question: 'What is the key difference between Authentication and Authorization?',
        options: [
          'They mean exactly the same thing',
          'Authentication = "Who are you?"; Authorization = "What can you do?"',
          'Authentication = Passwords; Authorization = Usernames',
          'Authentication is only required for system administrators',
        ],
        correctIndex: 1,
      },
    ],
    keyTakeaways: [
      'Always serve your app over HTTPS—it is the baseline for trust.',
      'Hash passwords with `bcrypt`/`argon2`—never store them in plain text.',
      'Treat all user input as "radioactive": Validate and sanitize to prevent XSS and SQL Injection.',
      'Understand that Authentication (identity) and Authorization (permissions) are two different "keys" in your app.',
    ],
  },

  {
    id: 'net-9',
    module: 'Module 1: Computer & Network Fundamentals',
    order: 9,
    title: 'The Browser — Where the Web Lives',
    icon: '🌍',
    philosophy: 'Think of the browser as your app’s "Execution Arena." It’s one of the most complex machines ever built. Understanding how it paints pixels and executes code is the difference between a "laggy site" and a "professional experience."',
    concepts: [
      {
        title: '1. The Rendering Engine',
        beginner: 'The inner-team that turns your raw HTML and CSS into the colorful pixels you see on screen.',
        advanced: 'It’s a strict pipeline: Parse HTML (DOM) + Parse CSS (CSSOM) → Render Tree → Layout (Geometry) → Paint (Pixels) → Composite (Layering). Pro-tip: "Layout Thrashing"—repeatedly forcing the browser to re-calculate positions—is the #1 cause of choppy scrolling.',
      },
      {
        title: '2. The JavaScript Engine (V8)',
        beginner: 'The translator that converts your human-readable JS into machine code the computer can run.',
        advanced: 'Chrome uses V8, which employs JIT (Just-In-Time) compilation to optimize your code while it runs. Firefox uses SpiderMonkey, while Safari uses JavaScriptCore. Your code is the same, but the "engines" are competing to run it as fast as physically possible.',
      },
      {
        title: '3. Browser Storage',
        beginner: 'The browser’s built-in memory bank for remembering data between visits.',
        advanced: 'Choose your weapon: Cookies (tiny, sent with every request), LocalStorage (~5MB, persists forever), SessionStorage (erased when the tab closes), or IndexedDB (for massive, structured data). If you store sensitive auth tokens, stick to secure, HttpOnly cookies!',
      },
      {
        title: '4. The Event Loop',
        beginner: 'The traffic controller that lets JS handle multiple tasks without freezing the page.',
        advanced: 'JS is single-threaded, but the Event Loop keeps it fluid. It manages the queue: Sync code first → Microtasks (Promises) → Macrotasks (setTimeout, click events). Block this loop with a heavy loop, and your entire interface "janks" to a halt.',
      },
    ],
    practical: {
      title: 'Spy on LocalStorage',
      intro: 'Time to peek into your browser\'s memory banks.',
      steps: [
        'Open DevTools → Application tab → Storage → Local Storage.',
        'Click on any domain to see the "keys" and "values" websites have saved on your machine.',
        'Open the Console and type `localStorage.setItem("test", "hello")`.',
        'Refresh the page and run `localStorage.getItem("test")`—the browser remembered your data!',
        'Explore the Cookies section to see where your auth tokens are hidden.',
      ],
      goal: 'Understand that your browser is more than just a viewer—it is a functional database your app can use to stay "stateful."',
    },
    quiz: [
      {
        question: 'Which JS engine powers the Google Chrome browser?',
        options: ['SpiderMonkey', 'V8', 'JavaScriptCore', 'WebKit'],
        correctIndex: 1,
      },
      {
        question: 'Which storage method persists even after you close and restart the browser?',
        options: ['SessionStorage', 'LocalStorage', 'Cookies (typical)', 'RAM'],
        correctIndex: 1,
      },
      {
        question: 'What is the primary output of the browser\'s Rendering Engine?',
        options: ['Network packets', 'The pixels you see on screen', 'JavaScript bytecode', 'Sound output streams'],
        correctIndex: 1,
      },
      {
        question: 'Why is a long-running synchronous "while" loop bad in JavaScript?',
        options: [
          'It consumes too much disk space',
          'It blocks the Event Loop and freezes the entire UI',
          'It floods the network with too many requests',
          'It automatically deletes your browser cookies',
        ],
        correctIndex: 1,
      },
    ],
    keyTakeaways: [
      'The Render Pipeline is a precise order: DOM/CSSOM → Layout → Paint → Composite.',
      'V8 uses JIT (Just-In-Time) compilation to make your JS blazing fast.',
      'Know your storage tools: Cookies, LocalStorage, SessionStorage, and IndexedDB each have a specific job.',
      'JS is single-threaded; never perform heavy blocking work on the main Event Loop.',
    ],
  },

  {
    id: 'net-10',
    module: 'Module 1: Computer & Network Fundamentals',
    order: 10,
    title: 'Servers & The Cloud — Where the Web Lives',
    icon: '☁️',
    philosophy: 'Think of "The Cloud" not as a magical vapor, but as "someone else’s computer"—a high-performance machine in a giant, air-conditioned warehouse. As a dev, your job is to package your code and ship it to these remote machines so they can serve your app to the world.',
    concepts: [
      {
        title: '1. What is a Server?',
        beginner: 'A computer that stays powered on 24/7, specifically designed to answer incoming requests.',
        advanced: 'While the hardware is similar to your PC, servers are optimized for "uptime" and massive concurrency. They run server-grade software like Nginx, Node.js, or PostgreSQL, which are built to handle thousands of requests per second without breaking a sweat.',
      },
      {
        title: '2. The Cloud — Really',
        beginner: 'The practice of renting servers from tech giants like AWS, Google, or Vercel instead of owning them.',
        advanced: 'Know your tier: IaaS (Raw Virtual Machines like AWS EC2—you control everything), PaaS (Managed Runtimes like Vercel—you just push code, they handle the rest), and SaaS (Ready-to-use software like Gmail). Platforms like Lovable are PaaS—they allow you to deploy instantly without touching a single server config.',
      },
      {
        title: '3. Static vs Dynamic Sites',
        beginner: 'Static sites are the same for everyone; Dynamic sites change based on who is logged in.',
        advanced: 'Static sites are pre-built HTML files pushed to a CDN (insanely fast and cheap). Dynamic sites run code at the moment of request (database queries, user profiles). Modern "Full Stack" developers master the mix—serving static content via CDNs and using server-side rendering for the dynamic "brain" of the app.',
      },
      {
        title: '4. CDN — Content Delivery Network',
        beginner: 'A network of "proxy" servers stored in cities all over the world to make your site load faster.',
        advanced: 'Services like Cloudflare or Fastly store copies of your assets in 200+ cities globally. Instead of a user in Tokyo waiting for a file from your New York server, the CDN delivers it from the Tokyo branch. It cuts latency 5–10x, making your site feel local to every user on Earth.',
      },
    ],
    practical: {
      title: 'Inspect a Server Response',
      intro: 'Time to see who is actually serving your web requests.',
      steps: [
        'Open DevTools → Network tab.',
        'Reload any site and click the very first request in the list.',
        'Navigate to the "Headers" tab → "Response Headers."',
        'Look for clues like `server:`, `cf-ray:` (Cloudflare), or `x-vercel-id:`.',
        'Try `ping google.com` in your terminal—the time in milliseconds shows exactly how far that "remote computer" is from you.',
      ],
      goal: 'Understand that every click you make triggers a lightning-fast journey to a remote server and back.',
    },
    quiz: [
      {
        question: 'What is a server in simple terms?',
        options: [
          'A restaurant waiter',
          'A computer that stays on 24/7 and responds to network requests',
          'A specific type of high-speed network cable',
          'A portable USB storage device',
        ],
        correctIndex: 1,
      },
      {
        question: 'What is the "Cloud" actually made of?',
        options: [
          'Data floating in the atmosphere',
          'Someone else\'s computers hosted in large data centers',
          'A special type of wireless WiFi signal',
          'A new kind of web browser technology',
        ],
        correctIndex: 1,
      },
      {
        question: 'What is the main advantage of using a CDN?',
        options: [
          'It encrypts all your network traffic',
          'It caches content in cities close to users to reduce load times',
          'It completely replaces the need for a server',
          'It automatically generates databases for your app',
        ],
        correctIndex: 1,
      },
      {
        question: 'Between Static and Dynamic sites, which is usually faster for identical content across all users?',
        options: ['Dynamic—it is personalized for everyone', 'Static—it is pre-built and delivered via CDN', 'They are always identical in speed', 'Neither is fast'],
        correctIndex: 1,
      },
    ],
    keyTakeaways: [
      'Servers are always-on computers running specialized software to handle requests.',
      '"The Cloud" is simply a way to rent massive computing power from providers like Vercel or AWS.',
      'Static sites are pre-built for speed; dynamic sites are built on-the-fly for personalization.',
      'CDNs act as "local branches" of your server, cutting latency by serving content from nearby locations.',
    ],
  },

  {
    id: 'net-11',
    module: 'Module 1: Computer & Network Fundamentals',
    order: 11,
    title: 'Ports & Sockets',
    icon: '🔌',
    philosophy: 'If the IP address is the building, the Port is the specific office number. Sockets are the "doorways" that allow your software to send and receive data. Without them, your computer would be a locked vault.',
    concepts: [
      {
        title: '1. What is a Port?',
        beginner: 'A port is a virtual doorway (numbered 0–65535) used to direct traffic to the right app.',
        advanced: 'Ports 0–1023 are "Well-Known Ports" (e.g., 80 for HTTP, 22 for SSH). Never use these for your own custom services. Use ports > 1024 for your local development to avoid conflicts with system services.',
      },
      {
        title: '2. Sockets — The Data Pipe',
        beginner: 'A socket is an endpoint that lets a program talk to the network.',
        advanced: 'Think of a socket as the "plug" connected to the "wall socket" (Port). When a server "listens" on a port, it’s waiting for a client to connect a socket. WebSockets take this further, creating a persistent, two-way pipe for real-time chat or gaming.',
      },
      {
        title: '3. Listening vs. Connecting',
        beginner: 'The server "listens" for a call; the client "connects" to the server.',
        advanced: 'Use `netstat` or `lsof -i` to see your local sockets. If you get "Port already in use," it means another process has already "plugged" into that specific virtual office door.',
      },
    ],
    practical: {
      title: 'Hunt for Open Ports',
      intro: 'See what your computer is currently listening to.',
      steps: [
        'Open terminal/command prompt.',
        'Type `netstat -an` (Windows) or `lsof -i -P -n | grep LISTEN` (Mac/Linux).',
        'Look for local ports currently in a "LISTEN" state.',
        'Try to visit `localhost:3000` (or your dev port) and run the command again.',
      ],
      goal: 'Identify the active doorways your computer is using to communicate with the world.',
    },
    quiz: [
      {
        question: 'Which port range is reserved for standard, well-known services?',
        options: ['0–1023', '5000–6000', '10000–20000', 'Any range is fine'],
        correctIndex: 0,
      },
      {
        question: 'What happens when you try to run a server on a port that is already in use?',
        options: ['The OS creates a second port automatically', 'You get an "EADDRINUSE" or "Port in use" error', 'The computer reboots', 'It works perfectly fine'],
        correctIndex: 1,
      },
      {
        question: 'What is a Socket?',
        options: ['A physical cable', 'The software endpoint for network communication', 'A type of CPU error', 'A DNS record'],
        correctIndex: 1,
      },
      {
        question: 'Why use a port higher than 1024 for development?',
        options: ['It makes the internet faster', 'To avoid conflicts with protected system-level services', 'It requires less RAM', 'It encrypts the data automatically'],
        correctIndex: 1,
      },
    ],
    keyTakeaways: [
      'IP = Building Address; Port = Specific office/doorway.',
      'Ports 0–1023 are strictly reserved; stay in the "High Port" range for your apps.',
      'A Socket is the connection endpoint between your code and the network.',
      'Use `netstat` to debug why your server won\'t start (port collisions).',
    ],
  },

  {
  id: 'net-12',
  module: 'Module 1: Computer & Network Fundamentals',
  order: 12,
  title: 'The Complete Request Journey',
  icon: '🚀',
  philosophy: 'Every time you type a URL, a miniature "epic quest" begins. Data travels through the labyrinth of the internet to fetch your content. Understanding this journey is how you learn to debug why a site won\'t load.',
  concepts: [
    {
      title: '1. The Setup (Browser → DNS)',
      beginner: 'Browser checks cache, then asks ISP DNS: "Where does this domain live?"',
      advanced: 'It’s a race. Browser Cache → OS Cache → Router Cache → ISP Resolver. Failure here means a "Server Not Found" error.',
    },
    {
      title: '2. The Handshake (TCP/TLS)',
      beginner: 'The computer establishes a "trusted connection" with the server.',
      advanced: 'TCP (3-way handshake: SYN, SYN-ACK, ACK) ensures reliability, followed by the TLS handshake for encryption.',
    },
    {
      title: '3. The Request & Response',
      beginner: 'Your browser sends an HTTP request; the server sends back the content.',
      advanced: 'The server returns a status code (200, 404, etc.), metadata headers, and the payload (HTML/JSON).',
    },
  ],
  practical: {
    title: 'Follow the Packet',
    intro: 'Visualize the journey in your browser.',
    steps: [
      'Open DevTools → Network tab.',
      'Filter by "Doc".',
      'Reload the page.',
      'Hover over the "Waterfall" bars to see DNS, Connection, and TTFB times.',
    ],
    goal: 'Identify which part of the journey is causing lag.',
  },
  quiz: [
    { question: 'What is the "3-way handshake" for?', options: ['Establishing a secure TCP connection', 'Sending images', 'Finding DNS', 'Logging in'], correctIndex: 0 },
    { question: 'What does "TTFB" stand for?', options: ['Time To First Byte', 'Total Transfer File Bytes', 'Time To Finish Building', 'The Total Flow Bandwidth'], correctIndex: 0 },
    { question: 'Where does the browser look first for a domain IP?', options: ['The internet', 'The local DNS cache', 'The router', 'Google'], correctIndex: 1 },
    { question: 'What is a "200 OK" status?', options: ['The server is down', 'Everything worked perfectly', 'The file was moved', 'Security error'], correctIndex: 1 },
  ],
  keyTakeaways: ['DNS finds the address; TCP/TLS creates the secure bridge.', 'TTFB is the key metric for server health.', 'Status codes tell you exactly what happened during the request.'],
},

  {
  id: 'net-13',
  module: 'Module 1: Computer & Network Fundamentals',
  order: 13,
  title: 'Network Troubleshooting Tools',
  icon: '🛠️',
  philosophy: 'When the internet acts like a black box, these tools are your flashlight. If you can\'t ping it, you can\'t reach it.',
  concepts: [
    {
      title: '1. Ping — "Are you there?"',
      beginner: 'Sends a tiny "pulse" to a server to see if it responds.',
      advanced: 'Uses ICMP packets. High latency (ms) means the server is distant or the connection is congested.',
    },
    {
      title: '2. Traceroute — "The Map"',
      beginner: 'Shows every "hop" your data takes across the internet.',
      advanced: 'Pinpoints exactly which router on the way is failing. Excellent for diagnosing ISP-level issues.',
    },
    {
      title: '3. Curl — "The Direct Request"',
      beginner: 'Fetches web data directly in the terminal.',
      advanced: '`curl -I` fetches only headers. It’s the fastest way to check server status codes without a browser.',
    },
  ],
  practical: {
    title: 'Map Your Journey',
    intro: 'Test your connection to the outside world.',
    steps: [
      'Run `ping google.com`.',
      'Run `traceroute google.com` (Mac/Linux) or `tracert google.com` (Windows).',
      'Run `curl -I https://google.com` to see headers.',
    ],
    goal: 'Identify exactly where a network connection dies.',
  },
  quiz: [
    { question: 'Which command helps you see the path your data takes?', options: ['ping', 'curl', 'traceroute', 'nslookup'], correctIndex: 2 },
    { question: 'What does "Request timed out" in a ping mean?', options: ['The server is fast', 'The server didn\'t respond in time', 'The password is wrong', 'The internet is too fast'], correctIndex: 1 },
    { question: 'How can `curl -I` help a developer?', options: ['It plays video', 'It fetches only headers', 'It cleans the browser cache', 'It deletes files'], correctIndex: 1 },
    { question: 'What protocol does `ping` use?', options: ['ICMP', 'TCP', 'UDP', 'SMTP'], correctIndex: 0 },
  ],
  keyTakeaways: ['Ping for availability.', 'Traceroute to find blockages.', 'Curl for quick header debugging.'],
},

  {
    id: 'net-14',
    module: 'Module 1: DevOps & Infrastructure Fundamentals',
    order: 14,
    title: 'Containerization & Docker',
    icon: '🐳',
    philosophy: 'Think of Docker as shipping containers for software. Instead of saying "it works on my machine," Docker bundles your code, dependencies, and OS into a standardized box that runs identically anywhere.',
    concepts: [
      {
        title: '1. Containers vs Virtual Machines',
        beginner: 'Virtual Machines emulate an entire hardware system; Containers share the host OS kernel and stay lightweight.',
        advanced: 'Containers isolate processes in user space using Linux `namespaces` and `cgroups`. They boot in seconds and use a fraction of the memory compared to full hypervisor VMs.',
      },
      {
        title: '2. Images & Dockerfiles',
        beginner: 'A Dockerfile is the recipe; a Docker Image is the frozen snapshot created from that recipe.',
        advanced: 'Docker build layers are cached individually. Structure your `Dockerfile` so that less frequently changed commands (like `npm install`) happen before copying application source code to optimize build times.',
      },
      {
        title: '3. Docker Compose',
        beginner: 'A tool for running multi-container applications (e.g., app server + database) with a single command.',
        advanced: 'Uses a declarative `docker-compose.yml` file to manage container networks, volume bindings, environment variables, and restart policies.',
      },
    ],
    practical: {
      title: 'Container Inspection & Run',
      intro: 'Practice working with container images and commands.',
      steps: [
        'Run `docker run -d -p 8080:80 nginx` in your terminal.',
        'Open `localhost:8080` in your browser to see the default Nginx welcome page.',
        'Run `docker ps` to list active containers and view container IDs.',
        'Run `docker stop <container_id>` to shut down the running server.',
      ],
      goal: 'Understand how isolated software environments bind to local network ports.',
    },
    quiz: [
      {
        question: 'Why are Docker containers lighter than traditional Virtual Machines?',
        options: [
          'They do not require CPU power',
          'They share the host operating system kernel',
          'They only work with static HTML',
          'They bypass network security',
        ],
        correctIndex: 1,
      },
      {
        question: 'What file serves as the "recipe" for creating a custom Docker image?',
        options: ['docker-compose.json', 'Dockerfile', 'package.json', 'Makefile'],
        correctIndex: 1,
      },
      {
        question: 'What is the primary function of Docker Compose?',
        options: [
          'To write JavaScript unit tests',
          'To define and run multi-container applications using a YAML file',
          'To register domain names',
          'To replace git version control',
        ],
        correctIndex: 1,
      },
      {
        question: 'In `docker run -p 8080:80 nginx`, what does `8080:80` specify?',
        options: [
          'RAM memory allocation limits',
          'Mapping host port 8080 to container port 80',
          'File permission levels',
          'Maximum allowed network connections',
        ],
        correctIndex: 1,
      },
    ],
    keyTakeaways: [
      'Containers eliminate "works on my machine" bugs by bundling dependencies.',
      'Docker images use cached layers defined in a Dockerfile.',
      'Docker Compose orchestra-configures multi-service local environments.',
      'Port mapping links host machine ports to internal container ports.',
    ],
  },

  {
    id: 'net-15',
    module: 'Module 1: DevOps & Infrastructure Fundamentals',
    order: 15,
    title: 'CI/CD Pipelines — Automation & Deployment',
    icon: '⚡',
    philosophy: 'Continuous Integration and Continuous Deployment (CI/CD) turn manual release processes into an automated assembly line. Code goes from git push to production automatically after passing tests.',
    concepts: [
      {
        title: '1. Continuous Integration (CI)',
        beginner: 'Automatically running tests and linters every time a developer pushes new code.',
        advanced: 'Triggers automated build runners on PRs. Catches merge conflicts, syntax errors, and broken test suites before code hits the main branch.',
      },
      {
        title: '2. Continuous Deployment (CD)',
        beginner: 'Automatically deploying code that passes tests directly to staging or production servers.',
        advanced: 'Employs strategies like Blue-Green deployments or Canary releases to update live applications without causing downtime for users.',
      },
      {
        title: '3. Secrets Management in Pipelines',
        beginner: 'Never hardcode passwords or API keys in your git repository.',
        advanced: 'Inject secrets dynamically at runtime or build time using Environment Variables managed via GitHub Secrets, HashiCorp Vault, or AWS Secrets Manager.',
      },
    ],
    practical: {
      title: 'Analyze a CI/CD Workflow Specification',
      intro: 'Understand how GitHub Actions configures build pipelines.',
      steps: [
        'Locate or create `.github/workflows/main.yml` in your project root.',
        'Define trigger conditions under `on: [push, pull_request]`.',
        'Configure build jobs: checkout code, setup Node.js, run `npm install`, and execute `npm test`.',
        'Observe test outputs directly inside the GitHub Pull Request interface.',
      ],
      goal: 'Learn how automated workflows enforce software quality before deployment.',
    },
    quiz: [
      {
        question: 'What is the main objective of Continuous Integration (CI)?',
        options: [
          'To automatically charge client credit cards',
          'To automatically build and test code changes frequently',
          'To replace database indexes',
          'To redesign website CSS UI',
        ],
        correctIndex: 1,
      },
      {
        question: 'Where should API keys and database credentials be stored for CI/CD runners?',
        options: [
          'Inside public index.js files',
          'In encrypted repository/pipeline secrets',
          'In git commit messages',
          'In HTML meta tags',
        ],
        correctIndex: 1,
      },
      {
        question: 'What is a "Canary Deployment"?',
        options: [
          'Testing code exclusively on mobile devices',
          'Rolling out updates to a small subset of users before full release',
          'Deleting old database backups',
          'Encrypting SSH keys',
        ],
        correctIndex: 1,
      },
      {
        question: 'Which event typically triggers a CI pipeline in Git workflows?',
        options: [
          'Closing the web browser',
          'Pushing code to a branch or opening a Pull Request',
          'Restarting the server computer',
          'Downloading a PDF file',
        ],
        correctIndex: 1,
      },
    ],
    keyTakeaways: [
      'CI automates testing and linting on every code submission.',
      'CD automates release deployments to zero-downtime environments.',
      'Keep secrets out of source control using secure environment variables.',
      'Pipeline configuration files (YAML) specify triggers, jobs, and steps.',
    ],
  },

  {
    id: 'net-16',
    module: 'Module 1: DevOps & Infrastructure Fundamentals',
    order: 16,
    title: 'Reverse Proxies & Load Balancing',
    icon: '⚖️',
    philosophy: 'A Reverse Proxy stands in front of your application servers as a single front door. It routes incoming client traffic, balances workload, and offloads encryption work.',
    concepts: [
      {
        title: '1. Forward vs Reverse Proxy',
        beginner: 'A forward proxy protects clients (hiding the user); a reverse proxy protects servers (hiding backend architecture).',
        advanced: 'Clients only interact with the Reverse Proxy URL/IP. The proxy forwards requests internally to private app servers based on routing rules.',
      },
      {
        title: '2. Load Balancing Strategies',
        beginner: 'Distributing incoming web traffic across multiple servers so no single server gets overwhelmed.',
        advanced: 'Algorithms include Round Robin (equal distribution), Least Connections (sends traffic to idle servers), and IP Hash (maintains session stickiness).',
      },
      {
        title: '3. SSL Termination',
        beginner: 'Decrypting secure HTTPS traffic at the proxy level before handing off to internal servers.',
        advanced: 'Offloads complex TLS cipher calculation from app processes, enabling high-performance unencrypted HTTP communication over isolated internal networks.',
      },
    ],
    practical: {
      title: 'Inspect Proxy Headers',
      intro: 'Observe how proxies pass client context to backend applications.',
      steps: [
        'Send a request through a proxied endpoint (e.g., via Cloudflare or Nginx).',
        'Examine server request headers for `X-Forwarded-For` (original client IP).',
        'Check `X-Forwarded-Proto` (confirms whether original client used HTTP or HTTPS).',
        'Observe `Host` header rewrites performed by the proxy layer.',
      ],
      goal: 'Understand how backend servers preserve client metadata behind proxy layers.',
    },
    quiz: [
      {
        question: 'What is a primary purpose of a Reverse Proxy?',
        options: [
          'To format CSS styling',
          'To route, secure, and load balance incoming requests to backend servers',
          'To store browser local storage',
          'To generate client-side React components',
        ],
        correctIndex: 1,
      },
      {
        question: 'Which load balancing algorithm distributes incoming requests sequentially across a server pool?',
        options: ['Least Connections', 'Round Robin', 'IP Pinning', 'Random Drop'],
        correctIndex: 1,
      },
      {
        question: 'What does SSL Termination at the reverse proxy accomplish?',
        options: [
          'Disables security completely',
          'Handles heavy TLS decryption at the proxy, reducing load on backend servers',
          'Prevents browsers from caching images',
          'Saves storage space on hard drives',
        ],
        correctIndex: 1,
      },
      {
        question: 'Which HTTP header tells a backend server the real IP address of the original client through a proxy?',
        options: ['X-Forwarded-For', 'User-Agent', 'Content-Type', 'Accept-Encoding'],
        correctIndex: 0,
      },
    ],
    keyTakeaways: [
      'Reverse proxies act as the single entry point to backend server clusters.',
      'Load balancers distribute traffic using algorithms like Round Robin or Least Connections.',
      'SSL termination offloads encryption processing from application code.',
      'Headers like `X-Forwarded-For` preserve client context across proxy hops.',
    ],
  },

  {
    id: 'net-17',
    module: 'Module 1: DevOps & Infrastructure Fundamentals',
    order: 17,
    title: 'Cloud Architecture & Infrastructure as Code',
    icon: '🏗️',
    philosophy: 'Modern infrastructure isn\'t configured by clicking buttons in a cloud console — it is defined as code. Infrastructure as Code (IaC) lets you version, review, and provision entire cloud environments repeatably.',
    concepts: [
      {
        title: '1. Infrastructure as Code (IaC)',
        beginner: 'Writing configuration scripts (like Terraform or CloudFormation) to spin up cloud servers automatically.',
        advanced: 'Declarative IaC files define the desired end state of cloud assets. Tools manage state tracking and execute delta updates without destroying existing resources.',
      },
      {
        title: '2. Serverless vs Containers',
        beginner: 'Serverless functions run code on demand without managing servers; Containers run persistent background processes.',
        advanced: 'Serverless (e.g., AWS Lambda) scales down to zero when idle, but can suffer from "cold starts". Containers provide predictable performance and full runtime environment control.',
      },
      {
        title: '3. Virtual Private Cloud (VPC) & Subnets',
        beginner: 'Isolating your cloud servers in a private network virtual wall.',
        advanced: 'Divide infrastructure into Public Subnets (load balancers, web gateways) and Private Subnets (databases, internal microservices) with strict Security Group rules.',
      },
    ],
    practical: {
      title: 'Analyze IaC Configuration Declarations',
      intro: 'Review how cloud resources are defined declaratively.',
      steps: [
        'Examine a sample Terraform file (`main.tf`) or CloudFormation template.',
        'Locate resource definitions for virtual servers, storage buckets, and subnets.',
        'Identify dependencies between resources (e.g., database attaching to a private subnet).',
        'Understand how `terraform plan` previews changes before applying them live.',
      ],
      goal: 'Grasp how cloud topology is version-controlled like standard application code.',
    },
    quiz: [
      {
        question: 'What is a major benefit of Infrastructure as Code (IaC)?',
        options: [
          'Eliminates the need for software testing',
          'Enables automated, repeatable, version-controlled cloud resource deployment',
          'Speeds up user typing speed',
          'Prevents SQL syntax errors',
        ],
        correctIndex: 1,
      },
      {
        question: 'Where should production database servers be placed inside a cloud network?',
        options: [
          'In a Public Subnet with open IP access',
          'In a Private Subnet without direct public internet exposure',
          'Directly on the client browser',
          'In a DNS TXT record',
        ],
        correctIndex: 1,
      },
      {
        question: 'What is a known characteristic of Serverless architecture (e.g., AWS Lambda)?',
        options: [
          'Requires manual OS kernel upgrades',
          'Executes code on-demand and can scale to zero when idle',
          'Does not support JavaScript',
          'Runs continuously on dedicated hardware 24/7',
        ],
        correctIndex: 1,
      },
      {
        question: 'What does `terraform plan` do?',
        options: [
          'Deletes all project files',
          'Previews changes to cloud infrastructure before applying them',
          'Compiles TypeScript to JavaScript',
          'Installs npm packages',
        ],
        correctIndex: 1,
      },
    ],
    keyTakeaways: [
      'IaC tools (Terraform) version control cloud topology using declarative configurations.',
      'Public subnets host web gateways; private subnets keep databases insulated.',
      'Serverless scales on demand and charges per execution, but watch out for cold starts.',
      'Infrastructure changes should undergo code review just like application code.',
    ],
  },

  {
    id: 'net-18',
    module: 'Module 1: DevOps & Infrastructure Fundamentals',
    order: 18,
    title: 'Monitoring, Logging & Observability',
    icon: '📊',
    philosophy: 'You can\'t fix what you can\'t see. Observability combines Metrics, Logs, and Traces (the Three Pillars) so you can diagnose system health issues before users even notice them.',
    concepts: [
      {
        title: '1. The Three Pillars of Observability',
        beginner: 'Metrics (numbers over time), Logs (event records), and Traces (the exact path of a request through microservices).',
        advanced: 'Metrics show *that* something is wrong (CPU spike); Logs show *why* it failed (error stack trace); Traces show *where* latency occurred across services.',
      },
      {
        title: '2. Health Checks & Alerts',
        beginner: 'Automated pings that verify if your application is alive and responding correctly.',
        advanced: 'Endpoints like `/healthz` return 200 OK when DB connections, cache pools, and disk spaces are healthy. PagerDuty/Sentry integrations alert engineers when SLA thresholds breach.',
      },
      {
        title: '3. Centralized Logging',
        beginner: 'Aggregating log output from hundreds of isolated servers into one searchable dashboard.',
        advanced: 'Tools like the ELK stack (Elasticsearch, Logstash, Kibana) or Datadog collect structured JSON logs, enabling fast querying across distributed infrastructure during incident triage.',
      },
    ],
    practical: {
      title: 'Structured Logging & Health Check Design',
      intro: 'Practice designing diagnostic indicators for web servers.',
      steps: [
        'Create a `/api/health` endpoint returning JSON status details (`{ status: "ok", uptime: 3600 }`).',
        'Replace plain `console.log("error")` statements with structured JSON logs (`{ level: "error", timestamp: "...", traceId: "..." }`).',
        'Simulate a failed database connection and observe the health check returning a 503 Service Unavailable code.',
      ],
      goal: 'Learn how to structure application runtime telemetry for production monitoring systems.',
    },
    quiz: [
      {
        question: 'What are the "Three Pillars of Observability"?',
        options: [
          'HTML, CSS, and JavaScript',
          'Metrics, Logs, and Traces',
          'CPU, RAM, and SSD',
          'GET, POST, and DELETE',
        ],
        correctIndex: 1,
      },
      {
        question: 'What is the purpose of Distributed Tracing?',
        options: [
          'To trace physical ethernet cables in a data center',
          'To track a single request\'s journey through multiple distributed microservices',
          'To draw UI animations on a web canvas',
          'To auto-complete code in VS Code',
        ],
        correctIndex: 1,
      },
      {
        question: 'Why are structured JSON logs preferred over plain text strings in production?',
        options: [
          'They look prettier in the terminal',
          'They can be easily indexed, searched, and parsed by log aggregation systems',
          'They take zero bytes of disk space',
          'They run faster in client browsers',
        ],
        correctIndex: 1,
      },
      {
        question: 'What should a `/healthz` API endpoint check before returning a `200 OK` status?',
        options: [
          'If the company website colors are updated',
          'If crucial internal services like database and cache connections are functional',
          'If the developer is logged into GitHub',
          'If the client browser supports dark mode',
        ],
        correctIndex: 1,
      },
    ],
    keyTakeaways: [
      'Observability relies on Metrics, Logs, and Traces.',
      'Structured JSON logging enables fast querying across aggregated logs.',
      'Health check endpoints (`/healthz`) communicate service status to load balancers.',
      'Distributed tracing pinpoints performance bottlenecks in microservice architectures.',
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
