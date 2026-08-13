export type ThemeName = 'dark' | 'light' | 'blue' | 'purple';

export const THEMES: { id: ThemeName; label: string; swatch: string }[] = [
  { id: 'dark',   label: 'Dark Green',  swatch: '#22c55e' },
  { id: 'light',  label: 'Terminal',    swatch: '#0d1f12' },
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
   TERMINAL THEME  —  data-theme="light"
   Overrides Tailwind tokens + glass-card + hardcoded bg
   ══════════════════════════════════════════════════════ */

/* ── 1. Override Tailwind CSS variable tokens at root ── */
[data-theme="light"] {
  --background:           4 12 6 !important;          /* #040c06 in HSL-ish */
  --foreground:           212 240 220 !important;     /* #d4f0dc */
  --muted-foreground:     78 125 90 !important;       /* #4e7d5a */
  --border:               34 197 94 / 0.11 !important;
  --primary:              34 197 94 !important;       /* #22c55e */
  --card:                 7 18 9 !important;          /* #071209 */
  --card-foreground:      212 240 220 !important;
  color-scheme: dark !important;
}

/* Also set as raw hex for non-HSL Tailwind setups */
[data-theme="light"] {
  --bg:             #040c06 !important;
  --surface:        #071209 !important;
  --surface-2:      #0a1a0e !important;
  --border-hex:     rgba(34,197,94,0.11) !important;
  --text:           #d4f0dc !important;
  --text-muted:     #4e7d5a !important;
  --accent:         #22c55e !important;
  --accent-dim:     rgba(34,197,94,0.10) !important;
}

/* ── 2. Body + #root + main wrappers ── */
[data-theme="light"] body,
[data-theme="light"] #root,
[data-theme="light"] #__next {
  background-color: #040c06 !important;
  background-image:
    linear-gradient(rgba(34,197,94,0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(34,197,94,0.04) 1px, transparent 1px) !important;
  background-size: 36px 36px !important;
  background-attachment: fixed !important;
  color: #d4f0dc !important;
  font-family: 'JetBrains Mono', 'Fira Code', monospace !important;
  min-height: 100vh !important;
}

/* ── 3. Kill bg-background / bg-white on ALL divs ── */
[data-theme="light"] .bg-background,
[data-theme="light"] [class*="bg-background"] {
  background-color: #040c06 !important;
}

[data-theme="light"] .bg-white,
[data-theme="light"] [class*="bg-white"] {
  background-color: transparent !important;
}

/* ── 4. glass-card override ── */
[data-theme="light"] .glass-card,
[data-theme="light"] [class*="glass-card"] {
  background-color: rgba(8, 22, 12, 0.85) !important;
  border: 1px solid rgba(34, 197, 94, 0.13) !important;
  backdrop-filter: blur(8px) !important;
  -webkit-backdrop-filter: blur(8px) !important;
  box-shadow: 0 0 0 1px rgba(34,197,94,0.06), 0 4px 24px rgba(0,0,0,0.5) !important;
}
[data-theme="light"] .glass-card:hover,
[data-theme="light"] [class*="glass-card"]:hover {
  border-color: rgba(34, 197, 94, 0.30) !important;
  box-shadow: 0 0 20px rgba(34,197,94,0.10), 0 4px 24px rgba(0,0,0,0.5) !important;
}

/* ── 5. Text colour overrides ── */
[data-theme="light"] .text-foreground,
[data-theme="light"] [class*="text-foreground"] {
  color: #f0fdf4 !important;
}

[data-theme="light"] .text-muted-foreground,
[data-theme="light"] [class*="text-muted-foreground"] {
  color: #4e7d5a !important;
}

[data-theme="light"] h1, [data-theme="light"] h2,
[data-theme="light"] h3, [data-theme="light"] h4 {
  color: #f0fdf4 !important;
}

[data-theme="light"] p, [data-theme="light"] span {
  color: inherit !important;
}

/* ── 6. Border overrides ── */
[data-theme="light"] .border-border,
[data-theme="light"] [class*="border-border"] {
  border-color: rgba(34, 197, 94, 0.11) !important;
}

[data-theme="light"] hr,
[data-theme="light"] .border-t {
  border-color: rgba(34, 197, 94, 0.11) !important;
}

/* ── 7. Grid background override (the grey grid → green grid) ── */
[data-theme="light"] [class*="bg-[linear-gradient"] {
  background-image:
    linear-gradient(rgba(34,197,94,0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(34,197,94,0.04) 1px, transparent 1px) !important;
}

/* ── 8. Buttons ── */
[data-theme="light"] button {
  color: inherit !important;
}

/* Primary CTA already uses emerald→cyan gradient via Tailwind — keep it */
[data-theme="light"] .from-emerald-500,
[data-theme="light"] [class*="from-emerald"] {
  --tw-gradient-from: #10b981 !important;
}

/* Ghost buttons */
[data-theme="light"] button[class*="border-border"] {
  background: rgba(7, 18, 9, 0.8) !important;
  border-color: rgba(34, 197, 94, 0.15) !important;
  color: #d4f0dc !important;
}
[data-theme="light"] button[class*="border-border"]:hover {
  border-color: rgba(34, 197, 94, 0.4) !important;
  color: #22c55e !important;
}

/* ── 9. Inputs ── */
[data-theme="light"] input,
[data-theme="light"] textarea,
[data-theme="light"] select {
  background: #071209 !important;
  border: 1px solid rgba(34,197,94,0.11) !important;
  border-radius: 8px !important;
  color: #d4f0dc !important;
  outline: none !important;
}
[data-theme="light"] input:focus,
[data-theme="light"] textarea:focus {
  border-color: #22c55e !important;
  box-shadow: 0 0 0 3px rgba(34,197,94,0.10) !important;
}
[data-theme="light"] input::placeholder,
[data-theme="light"] textarea::placeholder {
  color: #264030 !important;
}

/* ── 10. Links ── */
[data-theme="light"] a { color: #22c55e !important; text-decoration: none !important; }
[data-theme="light"] a:hover { color: #4ade80 !important; }

/* ── 11. Scrollbar ── */
[data-theme="light"] ::-webkit-scrollbar { width: 6px; height: 6px; }
[data-theme="light"] ::-webkit-scrollbar-track { background: #040c06; }
[data-theme="light"] ::-webkit-scrollbar-thumb { background: rgba(34,197,94,0.22); border-radius: 3px; }

/* ── 12. Selection ── */
[data-theme="light"] ::selection { background: rgba(34,197,94,0.28); color: #f0fdf4; }

/* ── 13. Ambient glow blobs — keep but make green ── */
[data-theme="light"] [class*="bg-cyan-500/10"] {
  background-color: rgba(34, 197, 94, 0.08) !important;
}
[data-theme="light"] [class*="bg-violet-500/10"] {
  background-color: rgba(34, 197, 94, 0.05) !important;
}

/* ── 14. Footer divider ── */
[data-theme="light"] footer,
[data-theme="light"] [class*="border-t"] {
  border-color: rgba(34, 197, 94, 0.10) !important;
}

/* ── 15. Badge pill (OPEN_SOURCE // 100% FREE) ── */
[data-theme="light"] [class*="bg-emerald-400/5"] {
  background-color: rgba(34, 197, 94, 0.08) !important;
  border-color: rgba(34, 197, 94, 0.20) !important;
}

/* ── 16. Sidebar (Dashboard layout) ── */
[data-theme="light"] aside,
[data-theme="light"] nav[class*="sidebar"],
[data-theme="light"] [class*="Sidebar"] {
  background-color: #030a05 !important;
  border-color: rgba(34, 197, 94, 0.10) !important;
}

/* ── 17. Active nav item ── */
[data-theme="light"] [aria-current="page"],
[data-theme="light"] [class*="active"] {
  color: #22c55e !important;
}
`;

  document.head.appendChild(style);
}

export function getTheme(): ThemeName {
  try {
    const v = localStorage.getItem(KEY) as ThemeName | null;
    if (v && ['dark', 'light', 'blue', 'purple'].includes(v)) return v;
  } catch {
    // Ignore localStorage failures during SSR or privacy mode.
  }
  return 'light'; // ✅ Terminal is the default
}

export function applyTheme(theme: ThemeName) {
  injectTerminalTheme();
  document.documentElement.setAttribute('data-theme', theme);
  try { localStorage.setItem(KEY, theme); } catch {
    // Ignore localStorage failures during SSR or privacy mode.
  }
}

export function initTheme() {
  applyTheme(getTheme());
}
