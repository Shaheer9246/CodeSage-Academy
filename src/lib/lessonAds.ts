import { ADS_CONFIG } from '@/config/adsConfig';

export const LESSON_AD_CACHE_KEY = 'codesage_lesson_sponsor_last_shown';
let lastShownInMemory = 0;

export function isLessonPath(pathname: string): boolean {
  return /^\/(?:lesson|n-lesson|f-lesson|fs-lesson|java-lesson|javax-lesson|c-lesson|cx-lesson|py-lesson|pyx-lesson|local-lesson|sql-lesson|rf-lesson|ai-lesson|iai-lesson|cpp-lesson|cppx-lesson|three-lesson)\/[^/]+\/?$/.test(pathname);
}

export function isQuietWorkspace(pathname: string): boolean {
  return isLessonPath(pathname) || ['/dsa-sheet', '/playground', '/challenges', '/exams', '/ai-teacher', '/ai-mentor'].includes(pathname) || pathname.startsWith('/test/');
}

// Reserve the slot before opening it so refreshes and subsequent lessons do not repeat it.
export function claimLessonSponsor(now = Date.now()): boolean {
  if (!ADS_CONFIG.enabled || !ADS_CONFIG.lessonStart.enabled) return false;
  let lastShown = lastShownInMemory;
  try {
    const saved = Number(localStorage.getItem(LESSON_AD_CACHE_KEY));
    if (Number.isFinite(saved) && saved > 0) lastShown = Math.max(lastShown, saved);
  } catch { /* Private browsing: the memory cap still applies. */ }
  if (lastShown > 0 && now - lastShown < ADS_CONFIG.lessonStart.cooldownMinutes * 60_000) return false;
  lastShownInMemory = now;
  try { localStorage.setItem(LESSON_AD_CACHE_KEY, String(now)); } catch { /* No database fallback needed. */ }
  return true;
}