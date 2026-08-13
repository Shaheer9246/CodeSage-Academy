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
  if (document.getElementById(STYLE_ID)) return;

  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
[data-theme="light"] {
  --bg: #040c06;
  --bg-grid: rgba(34,197,94,0.038);
  --surface: #071209;
  --surface-2: #0a1a0e;
  --surface-hover: #0e2213;
  --border: rgba(34,197,94,0.11);
  --border-hover: rgba(34,197,94,0.30);
  --text: #d4f0dc;
  --text-muted: #4e7d5a;
  --text-dim: #264030;
  --accent: #22c55e;
  --accent-dim: rgba(34,197,94,0.10);
  color-scheme: dark;
}

[data-theme="light"] body {
  background-color: var(--bg);
  background-image:
    linear-gradient(var(--bg-grid) 1px, transparent 1px),
    linear-gradient(90deg, var(--bg-grid) 1px, transparent 1px);
  background-size: 36px 36px;
  background-attachment: fixed;
  color: var(--text);
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  min-height: 100vh;
  margin: 0;
}

[data-theme="light"] ::-webkit-scrollbar { width: 6px; height: 6px; }
[data-theme="light"] ::-webkit-scrollbar-track { background: var(--bg); }
[data-theme="light"] ::-webkit-scrollbar-thumb { background: rgba(34,197,94,0.22); border-radius: 3px; }
[data-theme="light"] ::selection { background: rgba(34,197,94,0.28); color: #f0fdf4; }

[data-theme="light"] a { color: var(--accent); text-decoration: none; }
[data-theme="light"] a:hover { color: #4ade80; }

[data-theme="light"] input,
[data-theme="light"] textarea,
[data-theme="light"] select {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--text);
  font-family: inherit;
  font-size: 14px;
  padding: 10px 14px;
  outline: none;
}
[data-theme="light"] input:focus,
[data-theme="light"] textarea:focus,
[data-theme="light"] select:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-dim);
}
[data-theme="light"] input::placeholder,
[data-theme="light"] textarea::placeholder { color: var(--text-dim); }

[data-theme="light"] hr {
  border: none;
  border-top: 1px solid var(--border);
  margin: 24px 0;
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
  return 'dark';
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
