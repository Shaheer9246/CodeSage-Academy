import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface RouteMetadata {
  title: string;
  description: string;
  keywords?: string;
  type?: 'website' | 'article';
}

const DEFAULT_METADATA: RouteMetadata = {
  title: 'CodeSage Academy | Free Interactive Coding Platform',
  description: 'Master coding with interactive in-browser labs, WebAssembly execution, gamified tracks, and comprehensive DSA sheets.',
  keywords: 'learn to code, python tutorial, c programming, c++ tutorial, java programming, ai engineering, full stack web development, dsa sheet, interactive coding, sql practice',
  type: 'website',
};

const ROUTE_REGISTRY: Record<string, RouteMetadata> = {
  '/': {
    title: 'CodeSage Academy | Master Coding with Free Interactive Labs',
    description: 'Learn Python, C, C++, Java, AI, Cyber Security, SQL, and Web Development with interactive in-browser execution, gamified tracks, and DSA sheets.',
    keywords: 'learn coding, interactive programming, free coding courses, python, c++, java, web development, cyber security',
  },
  '/auth': {
    title: 'Sign In or Create Account | CodeSage Academy',
    description: 'Access your coding tracks, resume saved lessons, track streak progress, and earn CodeSage badges.',
    keywords: 'login, signup, codesage account, coding profile',
  },
  '/reset-password': {
    title: 'Reset Password | CodeSage Academy',
    description: 'Reset your CodeSage account credentials securely to get back to coding.',
  },
  '/onboarding': {
    title: 'Welcome to CodeSage | Personalize Your Learning Path',
    description: 'Choose your skill level and primary focus area to customize your CodeSage curriculum.',
  },
  '/dashboard': {
    title: 'Student Dashboard | CodeSage Academy',
    description: 'Your learning hub for daily challenges, enrolled course tracks, streak goals, and interactive coding progress.',
    keywords: 'coding dashboard, student profile, learning progress, daily streak',
  },
  '/roadmap': {
    title: 'Computer Science Career Roadmaps | CodeSage',
    description: 'Explore step-by-step developer roadmaps: Frontend, Cyber Security, AI Engineer, Systems Programming, and Full Stack.',
    keywords: 'developer roadmap, computer science roadmap, programming career path',
  },
  '/dsa-sheet': {
    title: 'Top 150 DSA Sheet with Code Playgrounds | CodeSage',
    description: 'Curated Data Structures and Algorithms sheet with time and space complexity guides, patterns, and embedded runners.',
    keywords: 'dsa sheet, leetcode top 150, algorithms practice, data structures interview prep',
  },
  '/challenges': {
    title: 'Daily Coding Challenges & Problem of the Day | CodeSage',
    description: 'Solve algorithm puzzles daily, earn Sage Coins and Victory XP, and build competitive problem-solving habits.',
    keywords: 'daily coding challenge, problem of the day, algorithm puzzles',
  },
  '/playground': {
    title: 'Multi-Language Online Code Playground | CodeSage',
    description: 'Run JavaScript, Python, C, C++, and SQL instantly inside your browser with real-time output and syntax highlighting.',
    keywords: 'online compiler, code playground, browser ide, python compiler, c++ runner',
  },
  '/exams': {
    title: 'Computer Science Exams & Quizzes | CodeSage',
    description: 'Test your knowledge across programming languages, security protocols, networking concepts, and system architecture.',
    keywords: 'coding quiz, computer science exam, skill assessment',
  },
  '/cyber': {
    title: 'Cyber Security & Ethical Hacking Track | CodeSage',
    description: 'Master Linux internals, SUID forensics, penetration testing tools (nmap, curl, grep), and network defense in virtual labs.',
    keywords: 'cyber security course, ethical hacking, linux security, kali linux, penetration testing',
  },
  '/networking': {
    title: 'Computer Systems & Networking Track | CodeSage',
    description: 'Learn the OSI model, TCP/IP, DNS, sockets, Wi-Fi RF security, and cloud architecture from hardware to protocols.',
    keywords: 'computer networking, osi model, tcp ip, dns, sockets, network protocols',
  },
  '/learn': {
    title: 'Modern Frontend Engineering Track | CodeSage',
    description: 'Master HTML5, modern CSS, responsive layouts, DOM manipulation, and interactive web architecture.',
    keywords: 'frontend course, learn html css, modern web development, javascript frontend',
  },
  '/python': {
    title: 'Python Core & Software Engineering | CodeSage',
    description: 'Master Python from variables and data structures to object-oriented programming and automation.',
    keywords: 'learn python, python for beginners, python programming course',
  },
  '/pythonexpert': {
    title: 'Python Advanced & Systems Mastery | CodeSage',
    description: 'Deep dive into Python metaclasses, GIL internals, concurrency, memory optimization, and asynchronous programming.',
    keywords: 'advanced python, python concurrency, asyncio, python internals',
  },
  '/java': {
    title: 'Java Core & Object-Oriented Architecture | CodeSage',
    description: 'Learn Java primitives, OOP principles, collections framework, exception handling, and JVM fundamentals.',
    keywords: 'learn java, java oop, java fundamentals, java collections',
  },
  '/java-expert': {
    title: 'Java Enterprise & JVM Architecture | CodeSage',
    description: 'Master multi-threading, concurrency locks, garbage collector tuning, and Spring-style architecture.',
    keywords: 'advanced java, jvm tuning, java concurrency, multi-threading',
  },
  '/c': {
    title: 'C Programming & Memory Fundamentals | CodeSage',
    description: 'Master pointers, stack vs heap allocation, structs, system calls, and low-level memory layout in C.',
    keywords: 'learn c programming, pointers in c, memory management, c pointers',
  },
  '/c-expert': {
    title: 'Advanced C & Systems Programming | CodeSage',
    description: 'Low-level systems programming in C: custom memory allocators, bitwise manipulation, and kernel APIs.',
    keywords: 'advanced c, systems programming, memory allocators, low level c',
  },
  '/cpp': {
    title: 'C++ Modern Systems & STL Mastery | CodeSage',
    description: 'Learn modern C++20, RAII, smart pointers, templates, STL containers, and algorithm design.',
    keywords: 'learn c++, modern c++20, c++ stl, smart pointers',
  },
  '/cpp/expert': {
    title: 'Advanced C++ & High-Performance Computing | CodeSage',
    description: 'Deep dive into cache locality, move semantics, template metaprogramming, and concurrency in C++.',
    keywords: 'advanced c++, high performance computing, template metaprogramming',
  },
  '/sql': {
    title: 'Interactive SQL Course & Browser Sandbox | CodeSage',
    description: 'Master relational databases, complex joins, subqueries, grouping, window functions, and indexing in WebAssembly SQLite.',
    keywords: 'learn sql, interactive sql sandbox, sql queries, database course',
  },
  '/sql-learn': {
    title: 'Interactive SQL Course & Browser Sandbox | CodeSage',
    description: 'Master relational databases, complex joins, subqueries, grouping, window functions, and indexing in WebAssembly SQLite.',
    keywords: 'learn sql, interactive sql sandbox, sql queries, database course',
  },
  '/fullstack': {
    title: 'Full Stack Web Development Track | CodeSage',
    description: 'Build end-to-end applications with REST APIs, authentication, databases, and modern frontend frameworks.',
    keywords: 'fullstack development, web developer course, rest api, nodejs react',
  },
  '/real-freelance': {
    title: 'Real-World Software Freelancing & Career Readiness | CodeSage',
    description: 'Client proposals, scope management, pricing models, contract drafting, and real-world tech freelancing.',
    keywords: 'software freelancing, tech career, freelance developer, client proposals',
  },
  '/freelance': {
    title: 'Freelance Foundations & Client Success | CodeSage',
    description: 'Learn how to find clients, price software projects, and deliver production deliverables.',
  },
  '/ai-fundamentals': {
    title: 'AI & Machine Learning Foundations | CodeSage',
    description: 'Understand neural networks, loss functions, gradient descent, embeddings, and foundational LLM architectures.',
    keywords: 'ai fundamentals, machine learning basics, neural networks, embeddings',
  },
  '/intermediate-ai': {
    title: 'Practical AI Engineering & Transformers | CodeSage',
    description: 'Hands-on transformer architecture, attention mechanisms, fine-tuning, and modern prompt engineering.',
    keywords: 'transformer architecture, attention mechanism, fine tuning, prompt engineering',
  },
  '/advanced-ai': {
    title: 'Advanced AI Systems & Autonomous Agents | CodeSage',
    description: 'Build autonomous AI agents, tool-calling pipelines, RAG systems, and production LLM orchestrations.',
    keywords: 'ai agents, rag architecture, autonomous agents, llm orchestration',
  },
  '/three3d': {
    title: '3D Graphics & WebGL with Three.js | CodeSage',
    description: 'Learn 3D coordinates, lighting, shaders, camera projection, and scene graphs in Three.js.',
    keywords: 'threejs tutorial, webgl 3d graphics, three.js course, 3d web development',
  },
  '/local': {
    title: 'Local Developer Environment & Git Setup | CodeSage',
    description: 'Master terminal tools, Git version control, SSH keys, package managers, and local development workflows.',
    keywords: 'git tutorial, local dev setup, terminal commands, ssh keys',
  },
  '/tour': {
    title: 'Platform Tour & Features | CodeSage Academy',
    description: 'Take a guided walkthrough of CodeSage interactive tracks, browser compilers, and gamified progress.',
  },
  '/community': {
    title: 'Developer Community & Discussion | CodeSage',
    description: 'Connect with thousands of students, share achievements, collaborate on code, and discuss solutions.',
    keywords: 'coding community, developer forum, student chat, peer help',
  },
  '/ai-teacher': {
    title: 'Interactive AI Coding Mentor | CodeSage Academy',
    description: 'Get instant explanations, code hints, and step-by-step debugging guidance for your lessons.',
    keywords: 'ai tutor, ai code mentor, programming help, code explainer',
  },
  '/ai-mentor': {
    title: 'Interactive AI Coding Mentor | CodeSage Academy',
    description: 'Get instant explanations, code hints, and step-by-step debugging guidance for your lessons.',
  },
  '/marketplace': {
    title: 'Sage Coin Shop & Rewards | CodeSage Academy',
    description: 'Redeem your earned Sage Coins for profile badges, streak freezes, and exclusive learning perks.',
  },
  '/inbox': {
    title: 'Notifications & Student Inbox | CodeSage Academy',
    description: 'Check platform announcements, milestone rewards, and course updates.',
  },
  '/suggestions': {
    title: 'Suggestions & Community Feedback | CodeSage',
    description: 'Share your feature suggestions and vote on platform improvements with the CodeSage team.',
  },
  '/settings': {
    title: 'Account Settings & Preferences | CodeSage',
    description: 'Manage your CodeSage profile, display name, notification preferences, and account security.',
  },
  '/privacy': {
    title: 'Privacy Policy | CodeSage Academy',
    description: 'CodeSage Academy privacy policy, student data protection commitments, and cookie guidelines.',
  },
  '/terms': {
    title: 'Terms of Service | CodeSage Academy',
    description: 'Terms and conditions for using CodeSage Academy interactive educational services.',
  },
  '/contact': {
    title: 'Contact Us | CodeSage Academy',
    description: 'Get in touch with the CodeSage team for student support, platform feedback, and partnerships.',
  },
  '/cookie-policy': {
    title: 'Cookie Policy | CodeSage Academy',
    description: 'Information about how CodeSage Academy uses cookies for authentication and performance.',
  },
  '/support-us': {
    title: 'Support CodeSage Academy | Free Education Mission',
    description: 'Support CodeSage Academy mission to keep world-class computer science education 100% free.',
  },
  '/donate-ads': {
    title: 'Support CodeSage Academy | Free Education Mission',
    description: 'Support CodeSage Academy mission to keep world-class computer science education 100% free.',
  },
};

// Dynamic pattern resolver for lesson pages
function resolveMetadataForPath(pathname: string): RouteMetadata {
  if (ROUTE_REGISTRY[pathname]) {
    return ROUTE_REGISTRY[pathname];
  }

  // Lesson sub-routes
  if (pathname.startsWith('/cyber-lesson/')) {
    return {
      title: 'Cyber Security Mission Lab | CodeSage Academy',
      description: 'Hands-on ethical hacking and system defense lab in the browser with interactive Kali Linux terminal simulation.',
      type: 'article',
    };
  }
  if (pathname.startsWith('/n-lesson/')) {
    return {
      title: 'Networking Architecture Lab | CodeSage Academy',
      description: 'Hands-on packet tracing, socket debugging, and network protocol inspection lab on CodeSage.',
      type: 'article',
    };
  }
  if (pathname.startsWith('/lesson/')) {
    return {
      title: 'Interactive Frontend Lab | CodeSage Academy',
      description: 'Interactive frontend lesson with live code editor, visual preview, and step-by-step challenges.',
      type: 'article',
    };
  }
  if (pathname.startsWith('/py-lesson/')) {
    return {
      title: 'Interactive Python Lab | CodeSage Academy',
      description: 'Write and run Python directly in your browser with real-time feedback and execution tests.',
      type: 'article',
    };
  }
  if (pathname.startsWith('/pyx-lesson/')) {
    return {
      title: 'Advanced Python Engineering Lab | CodeSage Academy',
      description: 'Advanced hands-on Python lab exploring bytecode, asyncio, and high-performance algorithms.',
      type: 'article',
    };
  }
  if (pathname.startsWith('/java-lesson/')) {
    return {
      title: 'Interactive Java Lab | CodeSage Academy',
      description: 'Hands-on Java programming exercises with in-browser compilation and unit testing.',
      type: 'article',
    };
  }
  if (pathname.startsWith('/javax-lesson/')) {
    return {
      title: 'Advanced Java Systems Lab | CodeSage Academy',
      description: 'In-depth Java lab covering high-concurrency patterns and memory management.',
      type: 'article',
    };
  }
  if (pathname.startsWith('/c-lesson/')) {
    return {
      title: 'Interactive C Memory Lab | CodeSage Academy',
      description: 'Hands-on C programming lab with pointers, pointer arithmetic, and allocation exercises.',
      type: 'article',
    };
  }
  if (pathname.startsWith('/cx-lesson/')) {
    return {
      title: 'Advanced C Systems Lab | CodeSage Academy',
      description: 'Deep-dive C programming lab analyzing memory safety and low-level data structures.',
      type: 'article',
    };
  }
  if (pathname.startsWith('/cpp-lesson/')) {
    return {
      title: 'Interactive C++ Lab | CodeSage Academy',
      description: 'Practice modern C++ with templates, memory-safe abstractions, and performance benchmarks.',
      type: 'article',
    };
  }
  if (pathname.startsWith('/cppx-lesson/')) {
    return {
      title: 'High-Performance C++ Lab | CodeSage Academy',
      description: 'Hands-on high-performance C++ lab with zero-cost abstractions and custom allocators.',
      type: 'article',
    };
  }
  if (pathname.startsWith('/sql-lesson/')) {
    return {
      title: 'Interactive SQL Query Lab | CodeSage Academy',
      description: 'Execute real SQL statements against live in-memory databases with instant schema visualization.',
      type: 'article',
    };
  }
  if (pathname.startsWith('/fs-lesson/')) {
    return {
      title: 'Full Stack Architecture Lab | CodeSage Academy',
      description: 'Hands-on full stack engineering lab connecting frontends to backend services and databases.',
      type: 'article',
    };
  }
  if (pathname.startsWith('/three-lesson/')) {
    return {
      title: 'Interactive 3D WebGL Lab | CodeSage Academy',
      description: 'Build interactive 3D simulations and shaders directly inside your browser with Three.js.',
      type: 'article',
    };
  }
  if (pathname.startsWith('/ai-lesson/')) {
    return {
      title: 'Interactive AI Foundations Lab | CodeSage Academy',
      description: 'Explore AI model mechanics and mathematical foundations with interactive visual simulations.',
      type: 'article',
    };
  }
  if (pathname.startsWith('/iai-lesson/')) {
    return {
      title: 'Transformer & Attention Lab | CodeSage Academy',
      description: 'Inspect tokenization, vector embeddings, and self-attention heads with interactive labs.',
      type: 'article',
    };
  }
  if (pathname.startsWith('/adv-ai-lesson/')) {
    return {
      title: 'Autonomous AI Agent Lab | CodeSage Academy',
      description: 'Design resilient AI reasoning loops and multi-step agent workflows in browser sandboxes.',
      type: 'article',
    };
  }
  if (pathname.startsWith('/complete/')) {
    return {
      title: 'Mission Complete | CodeSage Academy',
      description: 'Celebrate your completed coding mission, review your metrics, and level up your skills.',
    };
  }
  if (pathname.startsWith('/test/')) {
    return {
      title: 'Level Assessment Test | CodeSage Academy',
      description: 'Evaluate your computer science skills and verify proficiency level.',
    };
  }

  return DEFAULT_METADATA;
}

function setMetaTag(attrName: 'name' | 'property', attrValue: string, content: string) {
  let element = document.querySelector(`meta[${attrName}="${attrValue}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attrName, attrValue);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

function setCanonical(href: string) {
  let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
}

function setJsonLd(data: object) {
  let script = document.querySelector('script[data-schema="routeseo"]') as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement('script');
    script.setAttribute('type', 'application/ld+json');
    script.setAttribute('data-schema', 'routeseo');
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data);
}

export function RouteSEO() {
  const { pathname } = useLocation();

  useEffect(() => {
    const meta = resolveMetadataForPath(pathname);
    const canonicalUrl = `${window.location.origin}${pathname}`;

    // 1. Page Title
    document.title = meta.title;

    // 2. Standard Meta Tags
    setMetaTag('name', 'description', meta.description);
    if (meta.keywords) {
      setMetaTag('name', 'keywords', meta.keywords);
    }
    setCanonical(canonicalUrl);

    // 3. OpenGraph Social Cards
    setMetaTag('property', 'og:title', meta.title);
    setMetaTag('property', 'og:description', meta.description);
    setMetaTag('property', 'og:url', canonicalUrl);
    setMetaTag('property', 'og:type', meta.type || 'website');
    setMetaTag('property', 'og:site_name', 'CodeSage Academy');

    // 4. Twitter Cards
    setMetaTag('name', 'twitter:title', meta.title);
    setMetaTag('name', 'twitter:description', meta.description);

    // 5. Schema.org Structured Data (JSON-LD)
    const jsonLdData = {
      '@context': 'https://schema.org',
      '@type': meta.type === 'article' ? 'Course' : 'WebApplication',
      name: meta.title,
      description: meta.description,
      url: canonicalUrl,
      applicationCategory: 'EducationalApplication',
      operatingSystem: 'All',
      provider: {
        '@type': 'Organization',
        name: 'CodeSage Academy',
        url: window.location.origin,
      },
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
    };
    setJsonLd(jsonLdData);
  }, [pathname]);

  return null;
}

export default RouteSEO;
