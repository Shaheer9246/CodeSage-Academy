import { ADS_CONFIG } from '@/config/adsConfig';

export const LESSON_AD_CACHE_KEY = 'codesage_lesson_sponsor_last_shown';
export const FREE_LESSON_COUNTER_KEY = 'codesage_free_lessons_counter';
export const DAILY_2X_CLAIMED_KEY = 'codesage_daily_2x_claimed_date';

export const PRO_TRACK_PREFIXES = ['pyx-', 'cx-', 'cppx-', 'javax-', 'aiin-'];

export function isLessonPath(pathname: string): boolean {
  return /^\/(?:lesson|n-lesson|f-lesson|fs-lesson|java-lesson|javax-lesson|c-lesson|cx-lesson|py-lesson|pyx-lesson|local-lesson|sql-lesson|rf-lesson|ai-lesson|iai-lesson|cpp-lesson|cppx-lesson|three-lesson)\/[^/]+\/?$/.test(pathname);
}

export function isProLessonPath(pathname: string): boolean {
  const match = pathname.match(/^\/(?:javax-lesson|cx-lesson|pyx-lesson|iai-lesson|cppx-lesson)\/([^/]+)/);
  if (match) return true;
  return PRO_TRACK_PREFIXES.some(prefix => pathname.includes(`/${prefix}`));
}

export function isQuietWorkspace(pathname: string): boolean {
  return isLessonPath(pathname) || ['/dsa-sheet', '/playground', '/challenges', '/exams', '/ai-teacher', '/ai-mentor'].includes(pathname) || pathname.startsWith('/test/');
}

/**
 * Checks whether an ad gate should be presented for this lesson.
 * Returns { shouldShow: boolean, isProGate: boolean }
 */
export function evaluateLessonGate(pathname: string): { shouldShow: boolean; isProGate: boolean } {
  if (!ADS_CONFIG.enabled) return { shouldShow: false, isProGate: false };
  if (!isLessonPath(pathname)) return { shouldShow: false, isProGate: false };

  // 1. Pro / Expert track: always gate behind sponsor unlock
  if (isProLessonPath(pathname)) {
    const sessionUnlocked = sessionStorage.getItem(`unlocked_${pathname}`);
    if (!sessionUnlocked) {
      return { shouldShow: true, isProGate: true };
    }
    return { shouldShow: false, isProGate: true };
  }

  // 2. Free track: show ad every 2 lessons
  let count = 0;
  try {
    count = parseInt(localStorage.getItem(FREE_LESSON_COUNTER_KEY) || '0', 10);
  } catch {
    count = 0;
  }

  // Gate triggers every 2 lessons (count >= 2)
  if (count >= 2) {
    return { shouldShow: true, isProGate: false };
  }

  return { shouldShow: false, isProGate: false };
}

/**
 * Increments the free lesson counter (call when finishing a free lesson).
 */
export function recordFreeLessonFinished(): void {
  try {
    const current = parseInt(localStorage.getItem(FREE_LESSON_COUNTER_KEY) || '0', 10);
    localStorage.setItem(FREE_LESSON_COUNTER_KEY, String(current + 1));
  } catch { /* storage fallback */ }
}

/**
 * Resets the free lesson counter after the ad has been shown.
 */
export function resetFreeLessonCounter(): void {
  try {
    localStorage.setItem(FREE_LESSON_COUNTER_KEY, '0');
  } catch { /* storage fallback */ }
}

/**
 * Unlocks a Pro lesson for the current browser session.
 */
export function unlockProLesson(pathname: string): void {
  try {
    sessionStorage.setItem(`unlocked_${pathname}`, 'true');
  } catch { /* fallback */ }
}

/**
 * Daily 2x Reward Helper (Strictly 1 time per day)
 */
function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

export function canClaimDaily2x(): boolean {
  try {
    const lastClaimed = localStorage.getItem(DAILY_2X_CLAIMED_KEY);
    return lastClaimed !== getTodayString();
  } catch {
    return true;
  }
}

export function markDaily2xClaimed(): void {
  try {
    localStorage.setItem(DAILY_2X_CLAIMED_KEY, getTodayString());
  } catch { /* storage fallback */ }
}
