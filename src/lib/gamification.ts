// ─────────────────────────────────────────────────────────────
// CodeSage gamification rules (single source of truth)
// XP = daily learning energy. Coins = earned currency.
// ─────────────────────────────────────────────────────────────
import { BADGES, type Badge } from '@/data/badges';

/** Free XP energy every user gets each day (does NOT carry over). */
export const DAILY_XP = 10;
/** Energy burned per lesson → 3 lessons per free day. */
export const LESSON_XP_COST = 3.3;
/** Coins earned for finishing a lesson. */
export const LESSON_COIN_REWARD = 2;
/** Coins charged for a lesson once the daily energy is gone. */
export const LESSON_COIN_COST = 5;
/** Coins charged to rescue a broken flow streak in Code Crawler. */
export const CRAWLER_RESCUE_COST = 2;

export function todayKey(d: Date = new Date()): string {
  return d.toISOString().slice(0, 10);
}

/** Energy left today, accounting for a stale daily-reset date. */
export function energyToday(dailyXp: number, dailyXpDate: string | null): number {
  if (dailyXpDate !== todayKey()) return DAILY_XP;
  return Math.max(0, Math.round(dailyXp * 10) / 10);
}

export type LessonCharge = 'energy' | 'coins' | 'blocked';

/** How the next lesson would be paid for. */
export function lessonCharge(energy: number, coins: number): LessonCharge {
  if (energy >= LESSON_XP_COST) return 'energy';
  if (coins >= LESSON_COIN_COST) return 'coins';
  return 'blocked';
}

/** Lessons still affordable right now (energy first, then coins). */
export function lessonsAffordable(energy: number, coins: number): number {
  return Math.floor(energy / LESSON_XP_COST) + Math.floor(coins / LESSON_COIN_COST);
}

// ── Badges = levels/ranks ────────────────────────────────────
/** Badge earned for a lifetime lesson count. */
export function badgeForLessons(lessons: number): Badge {
  let current = BADGES[0];
  for (const b of BADGES) if (lessons >= b.xpRequired) current = b;
  return current;
}

export function nextBadge(lessons: number): Badge | null {
  return BADGES.find(b => b.xpRequired > lessons) ?? null;
}

/** 0-100 progress toward the next rank. */
export function badgeProgress(lessons: number): number {
  const cur = badgeForLessons(lessons);
  const next = nextBadge(lessons);
  if (!next) return 100;
  const span = next.xpRequired - cur.xpRequired;
  if (span <= 0) return 100;
  return Math.min(100, Math.round(((lessons - cur.xpRequired) / span) * 100));
}

/** Every badge unlocked so far (ids) — handy for the badge wall. */
export function unlockedBadgeIds(lessons: number): string[] {
  return BADGES.filter(b => lessons >= b.xpRequired).map(b => b.id);
}
