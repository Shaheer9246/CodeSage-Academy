export type ThemeName = 'dark' | 'light' | 'blue' | 'purple';

export const THEMES: { id: ThemeName; label: string; swatch: string }[] = [
  { id: 'dark',   label: 'Dark Green',  swatch: '#22c55e' },
  { id: 'light',  label: 'Light',       swatch: '#16a34a' },
  { id: 'blue',   label: 'Dark Blue',   swatch: '#3b82f6' },
  { id: 'purple', label: 'Dark Purple', swatch: '#a855f7' },
];

const KEY = 'codesage_theme';

export function getTheme(): ThemeName {
  try {
    const v = localStorage.getItem(KEY) as ThemeName | null;
    if (v && ['dark', 'light', 'blue', 'purple'].includes(v)) return v;
  } catch {}
  return 'dark';
}

export function applyTheme(theme: ThemeName) {
  document.documentElement.setAttribute('data-theme', theme);
  try { localStorage.setItem(KEY, theme); } catch {}
}

export function initTheme() {
  applyTheme(getTheme());
}
