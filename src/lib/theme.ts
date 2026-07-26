export type ThemeName = 'dark' | 'glass' | 'blue' | 'purple';

export const THEMES: { id: ThemeName; label: string; swatch: string }[] = [
  { id: 'dark',   label: 'Dark Green',  swatch: '#22c55e' },
  { id: 'glass',  label: 'Glass Green', swatch: '#10b981' },
  { id: 'blue',   label: 'Dark Blue',   swatch: '#3b82f6' },
  { id: 'purple', label: 'Dark Purple', swatch: '#a855f7' },
];

const KEY = 'codesage_theme';

export function getTheme(): ThemeName {
  try {
    const v = localStorage.getItem(KEY) as ThemeName | null;
    if (v && ['dark', 'glass', 'blue', 'purple'].includes(v)) return v;
  } catch {
    // Ignore localStorage failures during SSR or privacy mode.
  }
  return 'dark';
}

export function applyTheme(theme: ThemeName) {
  document.documentElement.setAttribute('data-theme', theme);
  try { localStorage.setItem(KEY, theme); } catch {
    // Ignore localStorage failures during SSR or privacy mode.
  }
}

export function initTheme() {
  applyTheme(getTheme());
}
