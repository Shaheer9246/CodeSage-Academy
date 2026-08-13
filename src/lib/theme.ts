export type ThemeName = 'dark' | 'light' | 'blue' | 'purple';

export const THEMES: { id: ThemeName; label: string; swatch: string }[] = [
  { id: 'dark',   label: 'Dark Green',  swatch: '#22c55e' },
  { id: 'light',  label: 'Terminal',    swatch: '#000000' },
  { id: 'blue',   label: 'Dark Blue',   swatch: '#3b82f6' },
  { id: 'purple', label: 'Dark Purple', swatch: '#a855f7' },
];

const KEY = 'codesage_theme';
const STYLE_ID = 'codesage-terminal-theme';

function injectTerminalTheme(): void {
  if (typeof document === 'undefined') return;
  const existing = document.getElementById(STYLE_ID);
  if (existing) existing.remove();

  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `

/* ══════════════════════════════════════════════════════
   TERMINAL THEME  —  Pure black + bright green grid
   Matches the CodeSage landing page exactly
   ══════════════════════════════════════════════════════ */

[data-theme="light"] {
  --background: 0 0% 0% !important;
  --foreground: 220 255 230 !important;
  --muted-foreground: 140 180 150 !important;
  --border: 142 76% 36% / 0.3 !important;
  --primary: 142 76% 36% !important;
  --card: 0 0% 2% !important;
  color-scheme: dark !important;
}

/* ── Body: PURE BLACK + bright green grid ── */
[data-theme="light"] body,
[data-theme="light"] #root,
[data-theme="light"] #__next {
  background-color: #000000 !important;
  background-image:
    linear-gradient(rgba(34, 197, 94, 0.15) 1px, transparent 1px),
    linear-gradient(90deg, rgba(34, 197, 94, 0.15) 1px, transparent 1px) !important;
  background-size: 40px 40px !important;
  background-attachment: fixed !important;
  color: #e0ffe8 !important;
  font-family: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace !important;
  min-height: 100vh !important;
}

/* ── Override bg-background ── */
[data-theme="light"] .bg-background,
[data-theme="light"] [class*="bg-background"] {
  background-color: #000000 !important;
}

/* ── glass-card: dark with glowing green border ─ */
[data-theme="light"] .glass-card,
[data-theme="light"] [class*="glass-card"] {
  background-color: rgba(0, 10, 5, 0.9) !important;
  border: 1px solid rgba(34, 197, 94, 0.4) !important;
  backdrop-filter: blur(12px) !important;
  box-shadow: 
    0 0 20px rgba(34, 197, 94, 0.15),
    inset 0 0 20px rgba(34, 197, 94, 0.05) !important;
}

[data-theme="light"] .glass-card:hover,
[data-theme="light"] [class*="glass-card"]:hover {
  border-color: rgba(34, 197, 94, 0.7) !important;
  box-shadow: 
    0 0 30px rgba(34, 197, 94, 0.3),
    inset 0 0 30px rgba(34, 197, 94, 0.1) !important;
  transform: translateY(-2px) !important;
}

/* ── Text colors ── */
[data-theme="light"] .text-foreground,
[data-theme="light"] [class*="text-foreground"] {
  color: #ffffff !important;
}

[data-theme="light"] .text-muted-foreground,
[data-theme="light"] [class*="text-muted-foreground"] {
  color: #88cc99 !important;
}

[data-theme="light"] h1, [data-theme="light"] h2,
[data-theme="light"] h3, [data-theme="light"] h4 {
  color: #ffffff !important;
  text-shadow: 0 0 10px rgba(34, 197, 94, 0.3) !important;
}

/* ── Borders ── */
[data-theme="light"] .border-border,
[data-theme="light"] [class*="border-border"] {
  border-color: rgba(34, 197, 94, 0.3) !important;
}

/* ── Grid background override ── */
[data-theme="light"] [class*="bg-[linear-gradient"] {
  background-image:
    linear-gradient(rgba(34, 197, 94, 0.15) 1px, transparent 1px),
    linear-gradient(90deg, rgba(34, 197, 94, 0.15) 1px, transparent 1px) !important;
}

/* ── Primary button: teal→cyan gradient ── */
[data-theme="light"] button[class*="from-emerald"],
[data-theme="light"] .from-emerald-500 {
  background: linear-gradient(135deg, #10b981 0%, #06b6d4 100%) !important;
  color: #001410 !important;
}
`;
  document.head.appendChild(style);
}

export function getTheme(): ThemeName {
  if (typeof localStorage === 'undefined') return 'dark';
  const t = localStorage.getItem(KEY) as ThemeName | null;
  return t && THEMES.some(x => x.id === t) ? t : 'dark';
}

export function applyTheme(theme: ThemeName): void {
  if (typeof document === 'undefined') return;
  document.documentElement.setAttribute('data-theme', theme);
  try { localStorage.setItem(KEY, theme); } catch { /* ignore */ }
  if (theme === 'light') injectTerminalTheme();
  else document.getElementById(STYLE_ID)?.remove();
}


export function initTheme(): void {
  applyTheme(getTheme());
}
