import { beforeEach, describe, expect, it, vi } from 'vitest';

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  vi.resetModules();
  vi.restoreAllMocks();
});

describe('lesson sponsor frequency & pro gates', () => {
  it('triggers ad gate after 2 completed free lessons', async () => {
    const ads = await import('./lessonAds');
    
    // Initially count is 0 -> should not show
    expect(ads.evaluateLessonGate('/lesson/intro').shouldShow).toBe(false);

    // Complete 1 lesson
    ads.recordFreeLessonFinished();
    expect(ads.evaluateLessonGate('/lesson/intro').shouldShow).toBe(false);

    // Complete 2nd lesson -> triggers gate
    ads.recordFreeLessonFinished();
    expect(ads.evaluateLessonGate('/lesson/intro').shouldShow).toBe(true);

    // Resetting after user continues
    ads.resetFreeLessonCounter();
    expect(ads.evaluateLessonGate('/lesson/intro').shouldShow).toBe(false);
  });

  it('gates PRO tracks until unlocked in session', async () => {
    const ads = await import('./lessonAds');
    const proPath = '/cx-lesson/pointers-1';

    // Must gate first
    expect(ads.evaluateLessonGate(proPath).shouldShow).toBe(true);
    expect(ads.evaluateLessonGate(proPath).isProGate).toBe(true);

    // After sponsor click unlocks session
    ads.unlockProLesson(proPath);
    expect(ads.evaluateLessonGate(proPath).shouldShow).toBe(false);
  });

  it('allows daily 2x reward only once per day', async () => {
    const ads = await import('./lessonAds');
    expect(ads.canClaimDaily2x()).toBe(true);

    ads.markDaily2xClaimed();
    expect(ads.canClaimDaily2x()).toBe(false);
  });

  it('matches all lesson routes but excludes catalogs and completion', async () => {
    const { isLessonPath, isQuietWorkspace } = await import('./lessonAds');
    for (const prefix of ['lesson', 'n-lesson', 'f-lesson', 'fs-lesson', 'java-lesson', 'javax-lesson', 'c-lesson', 'cx-lesson', 'py-lesson', 'pyx-lesson', 'local-lesson', 'sql-lesson', 'rf-lesson', 'ai-lesson', 'iai-lesson', 'cpp-lesson', 'cppx-lesson', 'three-lesson']) {
      expect(isLessonPath(`/${prefix}/first`)).toBe(true);
      expect(isQuietWorkspace(`/${prefix}/first`)).toBe(true);
    }
    for (const route of ['/complete/first', '/lesson/first/complete', '/python', '/learn', '/dashboard']) expect(isLessonPath(route)).toBe(false);
    for (const route of ['/dsa-sheet', '/playground', '/challenges', '/exams', '/test/basics', '/ai-teacher']) expect(isQuietWorkspace(route)).toBe(true);
  });
});
