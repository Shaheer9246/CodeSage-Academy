// Client-side brute-force guard: 3 failed logins per email → 24h lockout.
const KEY = 'cs_login_guard_v1';
export const MAX_ATTEMPTS = 3;
export const LOCK_MS = 24 * 60 * 60 * 1000;

type Entry = { fails: number; lockedUntil: number };
type Store = Record<string, Entry>;

const read = (): Store => {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '{}') as Store;
  } catch {
    return {};
  }
};

const write = (s: Store) => {
  try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* noop */ }
};

const norm = (email: string) => email.trim().toLowerCase();

export const getLockRemaining = (email: string): number => {
  const e = read()[norm(email)];
  if (!e) return 0;
  const left = e.lockedUntil - Date.now();
  return left > 0 ? left : 0;
};

export const getAttemptsLeft = (email: string): number => {
  const e = read()[norm(email)];
  if (!e) return MAX_ATTEMPTS;
  return Math.max(0, MAX_ATTEMPTS - e.fails);
};

/** Records a failed attempt. Returns ms remaining if now locked, else 0. */
export const registerFailure = (email: string): number => {
  const s = read();
  const k = norm(email);
  const e = s[k] || { fails: 0, lockedUntil: 0 };
  e.fails += 1;
  if (e.fails >= MAX_ATTEMPTS) {
    e.lockedUntil = Date.now() + LOCK_MS;
    e.fails = MAX_ATTEMPTS;
  }
  s[k] = e;
  write(s);
  return getLockRemaining(email);
};

export const clearFailures = (email: string) => {
  const s = read();
  delete s[norm(email)];
  write(s);
};

export const formatRemaining = (ms: number): string => {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const sec = total % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
};
