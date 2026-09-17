import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

export type LanguageCode = 'en' | 'roman-urdu' | 'es' | 'ru' | 'ar' | 'ur' | 'hi';

export interface LanguageOption {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
  description: string;
  dir?: 'ltr' | 'rtl';
  isFullEngine?: boolean;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English (Original)',
    flag: '🇬🇧',
    description: 'Original application language',
    dir: 'ltr',
  },
  {
    code: 'roman-urdu',
    name: 'Roman Hindi / Urdu',
    nativeName: 'Roman Urdu / Hindi',
    flag: '🇵🇰',
    description: 'Code & lessons in Hinglish / Roman Urdu (Latin script)',
    dir: 'ltr',
  },
  {
    code: 'ur',
    name: 'Urdu (اردو)',
    nativeName: 'اردو',
    flag: '🇵🇰',
    description: 'مکمل اسباق اور صفحات کا اردو ترجمہ',
    dir: 'rtl',
    isFullEngine: true,
  },
  {
    code: 'hi',
    name: 'Hindi (हिन्दी)',
    nativeName: 'हिन्दी',
    flag: '🇮🇳',
    description: 'पूरे पाठ और पेजों का हिंदी अनुवाद',
    dir: 'ltr',
    isFullEngine: true,
  },
  {
    code: 'es',
    name: 'Spanish (Español)',
    nativeName: 'Español',
    flag: '🇪🇸',
    description: 'Traducción completa de lecciones y páginas',
    dir: 'ltr',
    isFullEngine: true,
  },
  {
    code: 'ru',
    name: 'Russian (Русский)',
    nativeName: 'Русский',
    flag: '🇷🇺',
    description: 'Полный перевод уроков и интерфейса',
    dir: 'ltr',
    isFullEngine: true,
  },
  {
    code: 'ar',
    name: 'Arabic (العربية)',
    nativeName: 'العربية',
    flag: '🇸🇦',
    description: 'ترجمة كاملة لجميع الدروس والصفحات',
    dir: 'rtl',
    isFullEngine: true,
  },
];

// Rich Roman Urdu & Hinglish dictionary tailored for programming, lesson bodies & UI
export const ROMAN_URDU_DICTIONARY: Record<string, string> = {
  // Common lesson body & concept phrases (frequently in src/data/)
  "Welcome to your very first lesson! Let's start from the absolute beginning.": "Aapke sab se pehle sabaq mein khushamdeed! Aayein bilkul aaghaz se shuru karte hain.",
  "Welcome to your very first lesson!": "Aapke sab se pehle sabaq mein khushamdeed! 🎉",
  "Let's start from the absolute beginning.": "Aayein bilkul shuru se aaghaz karte hain.",
  "Think of it Like Building a House": "Ise Ek Ghar Banane Ki Tarah Samjhein 🏠",
  "Imagine you're building a house:": "Farz karein aap ek ghar bana rahe hain:",
  "HTML is the structure": "HTML structure (dhancha) hai",
  "the walls, rooms, doors, and windows": "deewarein, kamray, darwazay, aur khirkiyan",
  "CSS is the style": "CSS style (rang, design aur khubsurti) hai",
  "the paint on the walls, the furniture, the curtains": "deewaron ka paint, furniture, aur parday",
  "JavaScript is the action": "JavaScript action (kaam aur harkat) hai",
  "turning on the lights, opening the garage door": "batti jalana, garage ka darwaza kholna",
  "What is HTML?": "HTML Kya Hai?",
  "In this lesson, you will learn": "Is sabaq mein aap seekhein ge",
  "In this lesson": "Is sabaq mein",
  "You will learn": "Aap seekhein ge",
  "Key Concepts": "Aham Nukat (Key Concepts)",
  "Key Takeaway": "Aham Sabaq (Key Takeaway)",
  "Important Note": "Zaroori Baat (Important Note)",
  "How it Works": "Ye Kaise Kaam Karta Hai",
  "Step by step": "Marhala-war (Step by step)",
  "Write your code below": "Apna code neechay likhein",
  "Run the code to see the result": "Nateeja dekhne ke liye code run karein",
  "Try it yourself": "Ise khud try karein",
  "Click here to run": "Run karne ke liye yahan click karein",
  "Answer the following question": "Darj zail sawal ka jawab dein",
  "Choose the correct option": "Sahi option ka intekhab karein",
  "Select all that apply": "Tamam sahi options chunein",
  "Correct Answer!": "Bilkul Sahi Jawab! 🎉",
  "Incorrect. Try again!": "Ghalat jawab. Dobara koshish karein!",
  "Explanation:": "Wazahat (Explanation):",
  "Next Lesson": "Agla Sabaq →",
  "Previous Lesson": "← Pichla Sabaq",
  "Complete Lesson": "Sabaq Mukammal Karein ✓",
  "Mark as Completed": "Mukammal Mark Karein",
  "Challenge Instructions": "Challenge Ki Hidayat",
  "Output Preview": "Output Ka Preview",
  "Console Output": "Console Output",
  "Reset Code": "Code Reset Karein",
  "Submit Answer": "Jawab Submit Karein",

  // UI & Navigation
  "Dashboard": "Dashboard",
  "Roadmap": "Seekhne Ka Raasta (Roadmap)",
  "Inbox": "Inaam Aur Payam (Inbox)",
  "Community": "Biraadari (Community)",
  "Profile": "Aapka Profile",
  "Settings": "Settings & Tarjeehat",
  "Log Out": "Bahir Niklein (Logout)",
  "Home": "Home",
  "Challenges": "Muqablay (Challenges)",
  "Exams": "Imtihaan (Exams)",
  "Code Crawler": "Code Crawler Game",
  "Playground": "Code Playground",
  "Tour": "App Ka Tour",
  "Welcome": "Khushamdeed",
  "Search": "Talash Karein",
  "Search...": "Talash karein...",
  "Continue Learning": "Sabaq Jari Rakhein",
  "Resume Lesson": "Sabaq Dobara Shuru Karein",
  "Keep your momentum going!": "Apni raftaar jari rakhein!",
  "Start Learning": "Seekhna Shuru Karein",
  "Run Code": "Code Run Karein ▶",
  "Test Code": "Code Test Karein",
  "Save Changes": "Tabdeeliyan Mehfooz Karein",
  "Edit Profile": "Profile Edit Karein",
  "Cancel": "Mansookh Karein",
  "Save": "Mehfooz Karein",
  "Delete": "Khatam Karein",
  "Confirm": "Tasdeeq Karein",
  "Apply": "Laagu Karein",
  "Unlock": "Kholein (Unlock)",
  "Locked": "Band Hai (Locked)",
  "Active": "Fa-aal (Active)",
  "Completed": "Mukammal",
  "In Progress": "Jaari Hai",
  "Appearance": "Zahiri Shakl (Appearance)",
  "Power Tools": "Power Tools",
  "Auto-Run Preview": "Auto-Run Preview",
  "Reset Runtime": "Runtime Reset Karein",
  "Clear Sandbox": "Sandbox Saaf Karein",
  "Export Workspace": "Workspace Export Karein",
  "XP Breakdown": "XP Ka Hisaab Kitab",
  "Daily Allowance": "Rozana Ki Allowance",
  "Today's Winnings": "Aaj Ki Kamayi",
  "Lifetime XP": "Kul (Lifetime) XP",
  "How You Earn XP & Coins": "XP Aur Coins Kaise Kamayein",
  "Where to Use XP & Coins": "XP Aur Coins Kahan Istemal Karein",
  "Streak Freeze": "Streak Freeze (Silsila Mehfooz)",

  // Programming Core Terms
  "variables": "variables (data store karne walay dabbay)",
  "variable": "variable",
  "functions": "functions (kaam karne walay blocks)",
  "function": "function",
  "loops": "loops (baar baar chalne walay chakar)",
  "loop": "loop",
  "arrays": "arrays (fehrist/list)",
  "array": "array",
  "objects": "objects",
  "object": "object",
  "strings": "strings (alfaz/text)",
  "string": "string",
  "numbers": "numbers (adad)",
  "boolean": "boolean (sach ya jhoot)",
  "conditions": "conditions (sharayet)",
  "condition": "shart (condition)",
  "if statement": "agar (if) statement",
  "else statement": "warna (else) statement",
  "memory": "memory (hafiza)",
  "database": "database (data ka zakheera)",
  "server": "server",
  "client": "client (user ka browser)",
  "browser": "web browser",
  "network": "network",
  "request": "request (darkhwast)",
  "response": "response (jawab)",
  "syntax": "syntax (code likhne ka qanoon)",
  "error": "ghalati (error)",
  "bug": "kharaabi (bug)",
  "debug": "kharaabi theek karna (debug)",
  "algorithm": "algorithm (marhala-war tareeqa)",
};

interface TranslationContextType {
  currentLanguage: LanguageCode;
  setLanguage: (lang: LanguageCode) => boolean;
  isPro: boolean;
  setIsPro: (val: boolean) => void;
  activatePro: (code?: string) => boolean;
  autoTranslate: boolean;
  setAutoTranslate: (val: boolean) => void;
  translateText: (text: string) => string;
  isTranslating: boolean;
  proModalOpen: boolean;
  setProModalOpen: (open: boolean) => void;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

// Cache original text for text nodes to restore cleanly
const originalTextMap = new WeakMap<Node, string>();

// Inject clean CSS to hide Google Translate banners/frames
const injectGoogleTranslateStyles = () => {
  const styleId = 'codesage-google-translate-css';
  if (document.getElementById(styleId)) return;
  const style = document.createElement('style');
  style.id = styleId;
  style.innerHTML = `
    .goog-te-banner-frame,
    .skiptranslate,
    #goog-gt-tt,
    .goog-te-balloon-frame,
    div[id=":1.container"],
    div[id=":2.container"],
    div[id=":0.targetElement"] {
      display: none !important;
      visibility: hidden !important;
    }
    body {
      top: 0px !important;
      position: static !important;
    }
    .goog-text-highlight {
      background: none !important;
      box-shadow: none !important;
    }
  `;
  document.head.appendChild(style);
};

// Dynamically load Google Translate Script
const loadGoogleTranslateScript = () => {
  if (document.getElementById('google-translate-script')) return;

  // Create target mount element
  if (!document.getElementById('google_translate_element')) {
    const div = document.createElement('div');
    div.id = 'google_translate_element';
    div.style.display = 'none';
    document.body.appendChild(div);
  }

  injectGoogleTranslateStyles();

  (window as unknown as { googleTranslateInit: () => void }).googleTranslateInit = () => {
    const win = window as unknown as {
      google?: {
        translate?: {
          TranslateElement?: new (
            options: { pageLanguage: string; includedLanguages: string; autoDisplay: boolean },
            elementId: string
          ) => unknown;
        };
      };
    };
    if (win.google?.translate?.TranslateElement) {
      new win.google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          includedLanguages: 'es,ru,ar,ur,hi',
          autoDisplay: false,
        },
        'google_translate_element'
      );
    }
  };

  const script = document.createElement('script');
  script.id = 'google-translate-script';
  script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateInit';
  script.async = true;
  document.body.appendChild(script);
};

// Trigger Google Translate dropdown or cookie
const triggerGoogleTranslate = (langCode: string) => {
  if (langCode === 'en' || !langCode) {
    // Clear cookies
    const hostname = window.location.hostname;
    document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=${hostname}; path=/;`;
    const select = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
    if (select) {
      select.value = 'en';
      select.dispatchEvent(new Event('change'));
    }
    return;
  }

  // Set cookies for Google translate
  const hostname = window.location.hostname;
  document.cookie = `googtrans=/en/${langCode}; path=/;`;
  document.cookie = `googtrans=/en/${langCode}; domain=${hostname}; path=/;`;

  const select = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
  if (select) {
    select.value = langCode;
    select.dispatchEvent(new Event('change'));
  }
};

export const TranslationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguageState] = useState<LanguageCode>(() => {
    try {
      const saved = localStorage.getItem('codesage_lang') as LanguageCode;
      if (saved && SUPPORTED_LANGUAGES.some(l => l.code === saved)) {
        return saved;
      }
    } catch {
      // ignore
    }
    return 'en';
  });

  const [isPro, setIsProState] = useState<boolean>(() => {
    try {
      return localStorage.getItem('codesage_is_pro') === 'true';
    } catch {
      return false;
    }
  });

  const [autoTranslate, setAutoTranslateState] = useState<boolean>(() => {
    try {
      return localStorage.getItem('codesage_autotranslate') !== 'false';
    } catch {
      return true;
    }
  });

  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [proModalOpen, setProModalOpen] = useState<boolean>(false);
  const observerRef = useRef<MutationObserver | null>(null);
  const walkDebounceRef = useRef<number | null>(null);

  // Pre-sort dictionary keys by descending length so multi-word sentences match before individual words
  const sortedRomanUrduKeys = useRef<string[]>(
    Object.keys(ROMAN_URDU_DICTIONARY).sort((a, b) => b.length - a.length)
  );

  const setIsPro = useCallback((val: boolean) => {
    setIsProState(val);
    try {
      localStorage.setItem('codesage_is_pro', val ? 'true' : 'false');
    } catch (e) {
      console.warn(e);
    }
  }, []);

  const activatePro = useCallback((code?: string): boolean => {
    const trimmed = (code || '').trim().toUpperCase();
    if (!trimmed || trimmed === 'PRO' || trimmed === 'CODESAGE' || trimmed === 'VIP' || trimmed === 'FREEPRO') {
      setIsPro(true);
      return true;
    }
    return false;
  }, [setIsPro]);

  const setAutoTranslate = useCallback((val: boolean) => {
    setAutoTranslateState(val);
    try {
      localStorage.setItem('codesage_autotranslate', val ? 'true' : 'false');
    } catch (e) {
      console.warn(e);
    }
  }, []);

  // Set Language with Pro gating
  const setLanguage = useCallback((lang: LanguageCode): boolean => {
    if (lang !== 'en' && !isPro) {
      setProModalOpen(true);
      return false;
    }
    setCurrentLanguageState(lang);
    try {
      localStorage.setItem('codesage_lang', lang);
    } catch (e) {
      console.warn(e);
    }
    return true;
  }, [isPro]);

  // Translate a single string using Roman Urdu dictionary
  const translateText = useCallback((text: string): string => {
    if (!text || currentLanguage !== 'roman-urdu') return text;
    let result = text;
    for (const key of sortedRomanUrduKeys.current) {
      if (result.includes(key)) {
        result = result.split(key).join(ROMAN_URDU_DICTIONARY[key]);
      }
    }
    return result;
  }, [currentLanguage]);

  // DOM node walker for Roman Urdu translation (protecting code/input tags)
  const performRomanUrduDomTranslation = useCallback((restoreEnglish = false) => {
    if (typeof document === 'undefined') return;

    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          const parent = node.parentElement;
          if (!parent) return NodeFilter.FILTER_REJECT;

          // Strictly protect code editors, syntax blocks, scripts, and inputs
          const tag = parent.tagName.toUpperCase();
          if (
            tag === 'SCRIPT' ||
            tag === 'STYLE' ||
            tag === 'NOSCRIPT' ||
            tag === 'CODE' ||
            tag === 'PRE' ||
            tag === 'TEXTAREA' ||
            tag === 'INPUT'
          ) {
            return NodeFilter.FILTER_REJECT;
          }

          if (parent.closest('.monaco-editor, [data-no-translate="true"], .notranslate, pre, code')) {
            return NodeFilter.FILTER_REJECT;
          }

          const val = node.nodeValue?.trim();
          if (!val || val.length === 0 || /^[\d\s.,!?:;/\\-_=+#*()[\]{}]+$/.test(val)) {
            return NodeFilter.FILTER_REJECT;
          }

          return NodeFilter.FILTER_ACCEPT;
        },
      }
    );

    let currentNode = walker.nextNode();
    while (currentNode) {
      const node = currentNode;
      currentNode = walker.nextNode();

      if (!originalTextMap.has(node)) {
        originalTextMap.set(node, node.nodeValue || '');
      }

      const original = originalTextMap.get(node) || '';
      if (restoreEnglish) {
        if (node.nodeValue !== original) {
          node.nodeValue = original;
        }
      } else {
        let modified = original;
        // Apply phrase replacements sorted by longest match
        for (const enKey of sortedRomanUrduKeys.current) {
          if (enKey.length >= 3 && modified.toLowerCase().includes(enKey.toLowerCase())) {
            const reg = new RegExp(enKey.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
            modified = modified.replace(reg, ROMAN_URDU_DICTIONARY[enKey]);
          }
        }
        if (modified !== node.nodeValue) {
          node.nodeValue = modified;
        }
      }
    }
  }, []);

  // Main Effect: Orchestrate Google Translate or Roman Urdu DOM Translation
  useEffect(() => {
    setIsTranslating(true);

    // RTL handling
    if (currentLanguage === 'ar' || currentLanguage === 'ur') {
      document.documentElement.setAttribute('dir', 'rtl');
      document.documentElement.setAttribute('lang', currentLanguage);
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
      document.documentElement.setAttribute('lang', currentLanguage === 'roman-urdu' ? 'ur-PK' : currentLanguage);
    }

    // Languages that use Google Translate (es, ru, ar, ur, hi)
    const usesGoogleTranslate = ['es', 'ru', 'ar', 'ur', 'hi'].includes(currentLanguage);

    if (usesGoogleTranslate) {
      // First restore Roman Urdu text nodes back to clean English so Google Translate receives original text
      performRomanUrduDomTranslation(true);

      // Load Google Translate script and trigger language
      loadGoogleTranslateScript();
      triggerGoogleTranslate(currentLanguage);

      // Disconnect Roman Urdu mutation observer
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    } else if (currentLanguage === 'roman-urdu') {
      // Clear Google Translate if previously active
      triggerGoogleTranslate('en');

      // Apply Roman Urdu translation
      performRomanUrduDomTranslation(false);

      // Setup MutationObserver to continuously translate dynamic React updates & newly loaded lesson markdown
      if (!observerRef.current) {
        observerRef.current = new MutationObserver(() => {
          if (walkDebounceRef.current) {
            window.clearTimeout(walkDebounceRef.current);
          }
          walkDebounceRef.current = window.setTimeout(() => {
            performRomanUrduDomTranslation(false);
          }, 150);
        });

        observerRef.current.observe(document.body, {
          childList: true,
          subtree: true,
          characterData: false,
        });
      }
    } else {
      // English (Original)
      triggerGoogleTranslate('en');
      performRomanUrduDomTranslation(true);

      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    }

    setIsTranslating(false);

    return () => {
      if (walkDebounceRef.current) {
        window.clearTimeout(walkDebounceRef.current);
      }
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [currentLanguage, performRomanUrduDomTranslation]);

  return (
    <TranslationContext.Provider
      value={{
        currentLanguage,
        setLanguage,
        isPro,
        setIsPro,
        activatePro,
        autoTranslate,
        setAutoTranslate,
        translateText,
        isTranslating,
        proModalOpen,
        setProModalOpen,
      }}
    >
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};
