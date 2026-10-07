import { beforeEach, describe, expect, it, vi } from 'vitest';

beforeEach(() => {
  localStorage.clear();
  vi.resetModules();
  vi.restoreAllMocks();
});

describe('lesson sponsor frequency', () => {
  it('caps entries for ten minutes across lessons and reloads', async () => {
    const ads = await import('./lessonAds');
    const now = 1_800_000_000_000;
    expect(ads.claimLessonSponsor(now)).toBe(true);
    expect(ads.claimLessonSponsor(now + 599_999)).toBe(false);
    vi.resetModules();
    const reloaded = await import('./lessonAds');
    expect(reloaded.claimLessonSponsor(now + 500_000)).toBe(false);
    expect(reloaded.claimLessonSponsor(now + 600_000)).toBe(true);
  });

  it('keeps a memory cooldown when storage is unavailable', async () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('blocked'); });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('blocked'); });
    const { claimLessonSponsor } = await import('./lessonAds');
    expect(claimLessonSponsor(1_800_000_000_000)).toBe(true);
    expect(claimLessonSponsor(1_800_000_001_000)).toBe(false);
  });

  it('handles invalid stored timestamps', async () => {
    const ads = await import('./lessonAds');
    localStorage.setItem(ads.LESSON_AD_CACHE_KEY, 'invalid');
    expect(ads.claimLessonSponsor(1_800_000_000_000)).toBe(true);
  });

  it('matches all lesson routes but excludes completion and catalogs', async () => {
    const { isLessonPath, isQuietWorkspace } = await import('./lessonAds');
    for (const prefix of ['lesson', 'n-lesson', 'f-lesson', 'fs-lesson', 'java-lesson', 'javax-lesson', 'c-lesson', 'cx-lesson', 'py-lesson', 'pyx-lesson', 'local-lesson', 'sql-lesson', 'rf-lesson', 'ai-lesson', 'iai-lesson', 'cpp-lesson', 'cppx-lesson', 'three-lesson']) {
      expect(isLessonPath(`/${prefix}/first`)).toBe(true);
      expect(isQuietWorkspace(`/${prefix}/first`)).toBe(true);
    }
    for (const route of ['/complete/first', '/lesson/first/complete', '/python', '/learn', '/dashboard']) expect(isLessonPath(route)).toBe(false);
    for (const route of ['/dsa-sheet', '/playground', '/challenges', '/exams', '/test/basics', '/ai-teacher']) expect(isQuietWorkspace(route)).toBe(true);
    expect(isQuietWorkspace('/complete/first')).toBe(false);
  });
});