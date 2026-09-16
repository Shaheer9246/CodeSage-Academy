import React, { useState, useRef, useEffect } from 'react';
import {
  Globe,
  Sparkles,
  Check,
  Lock,
  ChevronDown,
  X,
  Crown,
  Zap,
  Languages,
  CheckCircle2
} from 'lucide-react';
import {
  useTranslation,
  SUPPORTED_LANGUAGES,
  LanguageCode
} from '@/contexts/TranslationContext';
import { toast } from 'sonner';

export interface GlobalTranslatorWidgetProps {
  mode?: 'floating' | 'docked';
}

export default function GlobalTranslatorWidget({ mode = 'floating' }: GlobalTranslatorWidgetProps) {
  const {
    currentLanguage,
    setLanguage,
    isPro,
    setIsPro,
    activatePro,
    proModalOpen,
    setProModalOpen,
    isTranslating
  } = useTranslation();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeLang =
    SUPPORTED_LANGUAGES.find(l => l.code === currentLanguage) ||
    SUPPORTED_LANGUAGES[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectLanguage = (code: LanguageCode) => {
    const success = setLanguage(code);
    if (success) {
      const selected = SUPPORTED_LANGUAGES.find(l => l.code === code);
      toast.success(
        `Language switched to ${selected?.nativeName || code}${
          code === 'roman-urdu' ? ' 🇵🇰🇮🇳' : ''
        }`
      );
      setDropdownOpen(false);
    }
  };

  const handleUnlockPro = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const success = activatePro(promoCodeInput || 'PRO');
    if (success) {
      toast.success('🌟 CodeSage PRO Activated! All languages unlocked.');
      setProModalOpen(false);
      setPromoCodeInput('');
    } else {
      toast.error('Invalid promo code. Try "PRO" or "CODESAGE"');
    }
  };

  if (mode === 'docked') {
    return (
      <>
        {/* Docked Translator in Top Utility Bar */}
        <div
          ref={dropdownRef}
          className="relative flex items-center notranslate"
          data-no-translate="true"
        >
          <div className="flex items-center bg-card/60 hover:bg-card/90 border border-border/40 hover:border-primary/40 backdrop-blur-md rounded-lg py-1 px-2 transition-all">
            {/* Language Switch Button */}
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-1.5 text-xs font-medium text-foreground hover:text-primary transition-colors"
              aria-label="Switch Language"
            >
              <span className="text-sm leading-none">{activeLang.flag}</span>
              <span className="max-w-[85px] sm:max-w-[110px] truncate text-[11px] font-mono">
                {activeLang.nativeName}
              </span>
              <ChevronDown
                className={`w-3 h-3 text-muted-foreground transition-transform ${
                  dropdownOpen ? 'rotate-180 text-primary' : ''
                }`}
              />
            </button>

            {/* PRO Badge indicator */}
            <div className="flex items-center pl-1.5 ml-1.5 border-l border-border/30">
              {isPro ? (
                <span
                  title="CodeSage PRO Active"
                  className="flex items-center gap-0.5 text-[9px] font-bold font-mono px-1.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500/20 to-primary/20 text-amber-300 border border-amber-500/30"
                >
                  <Crown className="w-2.5 h-2.5 text-amber-400" />
                  PRO
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => setProModalOpen(true)}
                  className="flex items-center gap-0.5 text-[9px] font-bold font-mono px-1.5 py-0.5 rounded-full bg-primary/10 text-primary hover:bg-primary/20 border border-primary/30 transition-all"
                  title="Unlock PRO Translator"
                >
                  <Sparkles className="w-2.5 h-2.5 text-primary animate-pulse" />
                  PRO
                </button>
              )}
            </div>
          </div>

          {/* Dropdown Menu (docked position) */}
          {dropdownOpen && (
            <div className="absolute top-full right-0 mt-1.5 w-72 bg-card/95 border border-border/50 backdrop-blur-2xl rounded-2xl shadow-2xl p-2.5 space-y-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150 notranslate">
              <div className="flex items-center justify-between px-2 py-1.5 border-b border-border/30">
                <div className="flex items-center gap-1.5">
                  <Languages className="w-4 h-4 text-primary" />
                  <span className="text-xs font-bold text-foreground font-display">
                    Page Translator
                  </span>
                </div>
                <span className="text-[10px] font-mono text-muted-foreground">
                  {isPro ? (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 inline" /> PRO Unlocked
                    </span>
                  ) : (
                    <span className="text-amber-400">PRO Feature</span>
                  )}
                </span>
              </div>

              {/* Language items */}
              <div className="space-y-1 py-1 max-h-[60vh] overflow-y-auto">
                {SUPPORTED_LANGUAGES.map(lang => {
                  const isCurrent = currentLanguage === lang.code;
                  const isLocked = lang.code !== 'en' && !isPro;

                  return (
                    <button
                      key={lang.code}
                      onClick={() => handleSelectLanguage(lang.code)}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-all ${
                        isCurrent
                          ? 'bg-primary/15 border border-primary/30 text-primary'
                          : 'hover:bg-secondary/40 text-foreground/90 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-base flex-shrink-0">{lang.flag}</span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="text-xs font-semibold truncate leading-tight">
                              {lang.nativeName}
                            </p>
                            {lang.code === 'roman-urdu' && (
                              <span className="text-[9px] px-1 py-0.2 bg-primary/20 text-primary rounded font-mono">
                                Popular
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-muted-foreground truncate leading-tight">
                            {lang.name}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center flex-shrink-0 ml-2">
                        {isCurrent ? (
                          <Check className="w-3.5 h-3.5 text-primary" />
                        ) : isLocked ? (
                          <span className="flex items-center gap-0.5 text-[9px] font-mono text-muted-foreground bg-secondary/60 px-1.5 py-0.5 rounded">
                            <Lock className="w-2.5 h-2.5" /> PRO
                          </span>
                        ) : null}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* PRO unlock prompt or active message */}
              {!isPro ? (
                <div className="pt-2 border-t border-border/30">
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      setProModalOpen(true);
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-primary/20 via-primary/10 to-amber-500/20 border border-primary/30 hover:border-primary/60 text-xs font-semibold text-primary flex items-center justify-center gap-1.5 transition-all group"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-12 transition-transform" />
                    <span>Unlock Roman Urdu, Spanish & more</span>
                  </button>
                </div>
              ) : (
                <div className="pt-2 border-t border-border/20 flex items-center justify-between text-[10px] px-2 text-muted-foreground">
                  <span className="text-primary font-mono font-medium">
                    {isTranslating ? 'Translating...' : '✓ Active'}
                  </span>
                  <button
                    onClick={() => {
                      setIsPro(false);
                      toast.info('Switched to standard tier');
                    }}
                    className="hover:underline text-[9px]"
                  >
                    Relock PRO
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* PRO Unlock Modal */}
        {proModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 notranslate"
            data-no-translate="true"
            onClick={() => setProModalOpen(false)}
          >
            <div
              className="glass-card w-full max-w-md rounded-2xl p-6 border border-primary/30 shadow-2xl relative space-y-4 bg-card/95"
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => setProModalOpen(false)}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-secondary/40 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-primary flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.3)]">
                  <Crown className="w-6 h-6 text-black" />
                </div>
                <div>
                  <h3 className="text-base font-bold font-display text-foreground flex items-center gap-1.5">
                    CodeSage PRO Translator
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-mono border border-amber-400/30">
                      VIP
                    </span>
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Learn programming in your native tongue
                  </p>
                </div>
              </div>

              <div className="bg-secondary/20 rounded-xl p-3.5 border border-border/30 space-y-2">
                <div className="flex items-start gap-2.5">
                  <span className="text-lg">🇵🇰</span>
                  <div>
                    <p className="text-xs font-semibold text-foreground">
                      Roman Hindi / Urdu Programming
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      Understand complex code logic, lessons & UI in Hinglish & Roman Urdu.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="text-lg">🇪🇸 🇷🇺 🇸🇦</span>
                  <div>
                    <p className="text-xs font-semibold text-foreground">
                      Spanish, Russian & Arabic Support
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      Automatic page translation across dashboards, challenges, and roadmaps.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Zap className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-foreground">
                      Instant Global Translation
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      Seamless toggle on every single screen without reloading.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2.5 pt-1">
                <button
                  onClick={() => handleUnlockPro()}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-primary via-emerald-400 to-teal-400 text-black font-bold text-sm shadow-[0_0_25px_rgba(var(--primary),0.35)] hover:opacity-95 transition-opacity flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Activate Free PRO Access Now
                </button>

                <form onSubmit={handleUnlockPro} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Or enter Promo Code (e.g. PRO)"
                    value={promoCodeInput}
                    onChange={e => setPromoCodeInput(e.target.value)}
                    className="flex-1 bg-secondary/30 border border-border/40 rounded-xl px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 font-mono uppercase"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-secondary/40 hover:bg-secondary/60 border border-border/40 rounded-xl text-xs font-semibold text-foreground transition-colors"
                  >
                    Apply
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <>
      {/* Floating Translator Capsule */}
      <div
        ref={dropdownRef}
        className="fixed top-3 right-4 z-40 flex items-center gap-1.5 notranslate"
        data-no-translate="true"
      >
        {isMinimized ? (
          <button
            onClick={() => setIsMinimized(false)}
            title="Open Translator"
            className="flex items-center gap-1 bg-card/90 border border-primary/30 backdrop-blur-xl px-2.5 py-1.5 rounded-full shadow-lg hover:border-primary/60 transition-all text-xs text-foreground group"
          >
            <span className="text-sm">{activeLang.flag}</span>
            <Globe className="w-3.5 h-3.5 text-primary group-hover:rotate-45 transition-transform" />
          </button>
        ) : (
          <div className="flex items-center bg-card/85 border border-border/40 backdrop-blur-xl rounded-full p-1 pl-2.5 shadow-xl hover:border-primary/40 transition-all">
            {/* Language Switch Button */}
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-1.5 text-xs font-medium text-foreground hover:text-primary transition-colors pr-1"
            >
              <span className="text-sm">{activeLang.flag}</span>
              <span className="max-w-[85px] sm:max-w-[120px] truncate text-[11px] font-mono">
                {activeLang.nativeName}
              </span>
              <ChevronDown
                className={`w-3 h-3 text-muted-foreground transition-transform ${
                  dropdownOpen ? 'rotate-180 text-primary' : ''
                }`}
              />
            </button>

            {/* PRO Badge indicator */}
            <div className="flex items-center pl-1.5 pr-1 border-l border-border/30">
              {isPro ? (
                <span
                  title="CodeSage PRO Active"
                  className="flex items-center gap-0.5 text-[9px] font-bold font-mono px-1.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500/20 to-primary/20 text-amber-300 border border-amber-500/30"
                >
                  <Crown className="w-2.5 h-2.5 text-amber-400" />
                  PRO
                </span>
              ) : (
                <button
                  onClick={() => setProModalOpen(true)}
                  className="flex items-center gap-0.5 text-[9px] font-bold font-mono px-1.5 py-0.5 rounded-full bg-primary/10 text-primary hover:bg-primary/20 border border-primary/30 transition-all"
                  title="Unlock PRO Translator"
                >
                  <Sparkles className="w-2.5 h-2.5 text-primary animate-pulse" />
                  PRO
                </button>
              )}
            </div>

            {/* Collapse button */}
            <button
              onClick={() => setIsMinimized(true)}
              title="Minimize translator"
              className="p-1 text-muted-foreground hover:text-foreground rounded-full hover:bg-secondary/40 transition-colors ml-0.5"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Dropdown Menu */}
        {dropdownOpen && (
          <div className="absolute top-11 right-0 w-72 bg-card/95 border border-border/50 backdrop-blur-2xl rounded-2xl shadow-2xl p-2.5 space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-150 notranslate">
            <div className="flex items-center justify-between px-2 py-1.5 border-b border-border/30">
              <div className="flex items-center gap-1.5">
                <Languages className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold text-foreground font-display">
                  Page Translator
                </span>
              </div>
              <span className="text-[10px] font-mono text-muted-foreground">
                {isPro ? (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 inline" /> PRO Unlocked
                  </span>
                ) : (
                  <span className="text-amber-400">PRO Feature</span>
                )}
              </span>
            </div>

            {/* Language items */}
            <div className="space-y-1 py-1">
              {SUPPORTED_LANGUAGES.map(lang => {
                const isCurrent = currentLanguage === lang.code;
                const isLocked = lang.code !== 'en' && !isPro;

                return (
                  <button
                    key={lang.code}
                    onClick={() => handleSelectLanguage(lang.code)}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-all ${
                      isCurrent
                        ? 'bg-primary/15 border border-primary/30 text-primary'
                        : 'hover:bg-secondary/40 text-foreground/90 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-base flex-shrink-0">{lang.flag}</span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs font-semibold truncate leading-tight">
                            {lang.nativeName}
                          </p>
                          {lang.code === 'roman-urdu' && (
                            <span className="text-[9px] px-1 py-0.2 bg-primary/20 text-primary rounded font-mono">
                              Popular
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-muted-foreground truncate leading-tight">
                          {lang.name}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center flex-shrink-0 ml-2">
                      {isCurrent ? (
                        <Check className="w-3.5 h-3.5 text-primary" />
                      ) : isLocked ? (
                        <span className="flex items-center gap-0.5 text-[9px] font-mono text-muted-foreground bg-secondary/60 px-1.5 py-0.5 rounded">
                          <Lock className="w-2.5 h-2.5" /> PRO
                        </span>
                      ) : null}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* PRO unlock prompt or active message */}
            {!isPro ? (
              <div className="pt-2 border-t border-border/30">
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    setProModalOpen(true);
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-primary/20 via-primary/10 to-amber-500/20 border border-primary/30 hover:border-primary/60 text-xs font-semibold text-primary flex items-center justify-center gap-1.5 transition-all group"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-12 transition-transform" />
                  <span>Unlock Roman Urdu, Spanish & more</span>
                </button>
              </div>
            ) : (
              <div className="pt-2 border-t border-border/20 flex items-center justify-between text-[10px] px-2 text-muted-foreground">
                <span className="text-primary font-mono font-medium">
                  {isTranslating ? 'Translating...' : '✓ Active'}
                </span>
                <button
                  onClick={() => {
                    setIsPro(false);
                    toast.info('Switched to standard tier');
                  }}
                  className="hover:underline text-[9px]"
                >
                  Relock PRO
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* PRO Unlock Modal */}
      {proModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 notranslate"
          data-no-translate="true"
          onClick={() => setProModalOpen(false)}
        >
          <div
            className="glass-card w-full max-w-md rounded-2xl p-6 border border-primary/30 shadow-2xl relative space-y-4 bg-card/95"
            onClick={e => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setProModalOpen(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-secondary/40 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header with Crown */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-primary flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.3)]">
                <Crown className="w-6 h-6 text-black" />
              </div>
              <div>
                <h3 className="text-base font-bold font-display text-foreground flex items-center gap-1.5">
                  CodeSage PRO Translator
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-mono border border-amber-400/30">
                    VIP
                  </span>
                </h3>
                <p className="text-xs text-muted-foreground">
                  Learn programming in your native tongue
                </p>
              </div>
            </div>

            {/* Feature list */}
            <div className="bg-secondary/20 rounded-xl p-3.5 border border-border/30 space-y-2">
              <div className="flex items-start gap-2.5">
                <span className="text-lg">🇵🇰</span>
                <div>
                  <p className="text-xs font-semibold text-foreground">
                    Roman Hindi / Urdu Programming
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    Understand complex code logic, lessons & UI in Hinglish & Roman Urdu.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="text-lg">🇪🇸 🇷🇺 🇸🇦</span>
                <div>
                  <p className="text-xs font-semibold text-foreground">
                    Spanish, Russian & Arabic Support
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    Automatic page translation across dashboards, challenges, and roadmaps.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Zap className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-foreground">
                    Instant Global Translation
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    Seamless toggle on every single screen without reloading.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Unlock Action */}
            <div className="space-y-2.5 pt-1">
              <button
                onClick={() => handleUnlockPro()}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-primary via-emerald-400 to-teal-400 text-black font-bold text-sm shadow-[0_0_25px_rgba(var(--primary),0.35)] hover:opacity-95 transition-opacity flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Activate Free PRO Access Now
              </button>

              <form onSubmit={handleUnlockPro} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Or enter Promo Code (e.g. PRO)"
                  value={promoCodeInput}
                  onChange={e => setPromoCodeInput(e.target.value)}
                  className="flex-1 bg-secondary/30 border border-border/40 rounded-xl px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 font-mono uppercase"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-secondary/40 hover:bg-secondary/60 border border-border/40 rounded-xl text-xs font-semibold text-foreground transition-colors"
                >
                  Apply
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
