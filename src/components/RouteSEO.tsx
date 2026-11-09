import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getLessonDetails } from '@/data/lessonIndex';

interface RouteMetadata {
  title: string;
  description: string;
  keywords?: string;
  type?: 'website' | 'article';
}

const DEFAULT_METADATA: RouteMetadata = {
  title: 'CodeSage Academy | Free Interactive Coding Platform & Labs',
  description: 'Practice programming online with in-browser compilers, WebAssembly execution, gamified tracks, and 150+ DSA problems. 100% free.',
  keywords: 'how to practice coding online, online compiler with instant execution, free coding labs, learn programming step by step',
  type: 'website',
};

const ROUTE_REGISTRY: Record<string, RouteMetadata> = {
  '/': {
    title: 'CodeSage Academy | Practice Coding Online with Interactive Labs',
    description: 'Learn Python, C, C++, Java, AI, Cyber Security, SQL, and Web Development with interactive in-browser execution, gamified tracks, and DSA sheets.',
    keywords: 'how to practice coding online, free interactive coding labs, practice python online, c programming compiler browser, leetcode alternative',
  },
  '/playground': {
    title: 'Free Online Code Compiler & Multi-Language Playground | CodeSage',
    description: 'Run Python, C, C++, JavaScript, and SQL instantly inside your browser with real-time output, WebAssembly execution, and syntax highlighting.',
    keywords: 'online c compiler, free python lab with compiler, run c online, webassembly code runner, online cpp playground',
  },
  '/dsa-sheet': {
    title: 'Top 150 DSA Sheet with In-Browser Playgrounds & Solutions | CodeSage',
    description: 'Master Data Structures & Algorithms with curated patterns, time/space complexity analysis, and live runnable problem sandboxes.',
    keywords: 'top 150 dsa sheet, practice leetcode questions free, data structures algorithms interview prep, array two pointer problems',
  },
  '/c': {
    title: 'How to Practice C Programming Online | Interactive Memory & Pointer Lab | CodeSage',
    description: 'Master pointers, dynamic memory allocation (malloc/free), stack vs heap, structs, and system calls with real-time compiler feedback.',
    keywords: 'how to practice c programming online, c pointer practice, interactive c programming, learn c in browser, c memory visualizer',
  },
  '/python': {
    title: 'Free Python Lab with Compiler | Interactive Python Course | CodeSage',
    description: 'Write and test Python code online. Learn variables, list comprehensions, OOP, and algorithms with instant in-browser test feedback.',
    keywords: 'free python lab with compiler, practice python online free, interactive python exercises, learn python beginners browser',
  },
  '/cyber': {
    title: 'Interactive Cyber Security & Ethical Hacking Labs | Linux Terminal | CodeSage',
    description: 'Hands-on ethical hacking fundamentals: Linux permissions, SUID forensics, network reconnaissance, and defensive security in browser sandboxes.',
    keywords: 'interactive burp suite fundamentals, learn ethical hacking online, interactive linux terminal practice, cybersecurity labs free',
  },
  '/sql': {
    title: 'Interactive SQL Sandbox & Practice Queries Online | CodeSage',
    description: 'Practice SQL queries against live in-memory SQLite databases. Master JOINs, GROUP BY, subqueries, and window functions with instant schema visualization.',
    keywords: 'practice sql queries online free, interactive sql sandbox, learn sql with exercises, sqlite in browser',
  },
  '/cpp': {
    title: 'Modern C++ Programming Lab | C++20, STL & Pointers | CodeSage',
    description: 'Practice modern C++ online with templates, RAII, smart pointers, and standard library algorithms directly in your browser.',
    keywords: 'practice c++ online, modern cpp exercises, learn c++ stl browser, cpp online compiler with input',
  },
  '/java': {
    title: 'Interactive Java Programming & OOP Practice Lab | CodeSage',
    description: 'Learn Java syntax, OOP architecture, collections framework, and multi-threading with interactive in-browser compilation tests.',
    keywords: 'practice java online, java oop exercises browser, interactive java coding, learn java for beginners',
  },
  '/networking': {
    title: 'Computer Networking & Protocol Architecture Lab | CodeSage',
    description: 'Learn the OSI model, TCP/IP handshake, DNS resolution, and network packet analysis through interactive visual simulators.',
    keywords: 'learn computer networking online, tcp ip handshake visualizer, osi model practice, socket programming tutorial',
  },
  '/ai-fundamentals': {
    title: 'AI & Neural Networks Foundations Lab | CodeSage',
    description: 'Interactive introduction to machine learning: cost landscapes, gradient descent, vectors, and foundation model mechanics.',
    keywords: 'learn ai fundamentals, gradient descent visualizer, neural networks for beginners, machine learning interactive',
  },
};

function resolveMetadataForPath(pathname: string): RouteMetadata {
  if (ROUTE_REGISTRY[pathname]) {
    return ROUTE_REGISTRY[pathname];
  }

  // Dynamic lesson metadata: lookup lesson title if possible
  const lessonMatch = pathname.match(/\/([a-z0-9-]+)-lesson\/([a-z0-9-]+)/i);
  if (lessonMatch) {
    const [, trackPrefix, lessonId] = lessonMatch;
    const lesson = getLessonDetails(lessonId);
    if (lesson) {
      return {
        title: `${lesson.title} - Interactive Coding Lab | CodeSage Academy`,
        description: `Practice "${lesson.title}" with live code editor, test suites, and instant execution on CodeSage Academy. 100% free.`,
        keywords: `${lesson.title.toLowerCase()}, practice ${trackPrefix} online, interactive ${trackPrefix} lab, learn coding step by step`,
        type: 'article',
      };
    }
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

    // 5. Schema.org Structured Data (Course / WebApplication)
    const jsonLdData = {
      '@context': 'https://schema.org',
      '@type': meta.type === 'article' ? 'Course' : 'WebApplication',
      name: meta.title,
      description: meta.description,
      url: canonicalUrl,
      isAccessibleForFree: true,
      educationalLevel: 'Beginner to Advanced',
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
