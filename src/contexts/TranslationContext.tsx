import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type LanguageCode = 'en' | 'es' | 'ru' | 'ar' | 'ur' | 'hi';

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

let googlePollTimer: ReturnType<typeof setInterval> | null = null;
let targetGoogleLang: string | null = null;

const applyGoogleTranslateToCombo = (langCode: string): boolean => {
  const select = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
  if (select) {
    select.value = langCode;
    select.dispatchEvent(new Event('change', { bubbles: true }));
    select.dispatchEvent(new Event('input', { bubbles: true }));
    return true;
  }
  return false;
};

// Dynamically load Google Translate Script
const loadGoogleTranslateScript = () => {
  if (document.getElementById('google-translate-script')) return;

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

      if (targetGoogleLang && targetGoogleLang !== 'en') {
        setTimeout(() => applyGoogleTranslateToCombo(targetGoogleLang!), 350);
      }
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
  targetGoogleLang = langCode;
  if (googlePollTimer) {
    clearInterval(googlePollTimer);
    googlePollTimer = null;
  }

  if (langCode === 'en' || !langCode) {
    document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    const hostname = window.location.hostname;
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${hostname};`;
    applyGoogleTranslateToCombo('en');
    return;
  }

  document.cookie = `googtrans=/en/${langCode}; path=/;`;
  document.cookie = `googtrans=/auto/${langCode}; path=/;`;

  if (applyGoogleTranslateToCombo(langCode)) {
    return;
  }

  let attempts = 0;
  googlePollTimer = setInterval(() => {
    attempts++;
    if (applyGoogleTranslateToCombo(langCode) || attempts > 25) {
      if (googlePollTimer) {
        clearInterval(googlePollTimer);
        googlePollTimer = null;
      }
    }
  }, 200);
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

  const setLanguage = useCallback((lang: LanguageCode): boolean => {
    if (!isPro && lang !== 'en') {
      setIsProState(true);
      try {
        localStorage.setItem('codesage_is_pro', 'true');
      } catch (e) {
        console.warn(e);
      }
    }
    setCurrentLanguageState(lang);
    try {
      localStorage.setItem('codesage_lang', lang);
    } catch (e) {
      console.warn(e);
    }
    return true;
  }, [isPro]);

  // Simplified translateText (Roman Urdu dictionary logic removed)
  const translateText = useCallback((text: string): string => {
    return text;
  }, []);

  // Main Effect: Orchestrate Google Translate
  useEffect(() => {
    setIsTranslating(true);

    // RTL handling
    if (currentLanguage === 'ar' || currentLanguage === 'ur') {
      document.documentElement.setAttribute('dir', 'rtl');
      document.documentElement.setAttribute('lang', currentLanguage);
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
      document.documentElement.setAttribute('lang', currentLanguage);
    }

    // Languages that use Google Translate (es, ru, ar, ur, hi)
    const usesGoogleTranslate = ['es', 'ru', 'ar', 'ur', 'hi'].includes(currentLanguage);

    if (usesGoogleTranslate) {
      loadGoogleTranslateScript();
      triggerGoogleTranslate(currentLanguage);
    } else {
      // English (Original)
      triggerGoogleTranslate('en');
    }

    setIsTranslating(false);

    return () => {
      if (googlePollTimer) {
        clearInterval(googlePollTimer);
        googlePollTimer = null;
      }
    };
  }, [currentLanguage]);

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