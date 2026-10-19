/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DSA_PROBLEMS, DsaProblem } from '@/data/dsaSheetData';

export interface DailyProblemInfo {
  problem: DsaProblem;
  dateStr: string; // YYYY-MM-DD
  displayDate: string; // e.g. "Monday, Oct 19"
  isSolved: boolean;
  bonusClaimed: boolean;
  rewardXp: number;
  rewardCoins: number;
}

const STORAGE_SOLVED_KEY = 'codesage_dsa_solved_ids';
const POTD_CLAIMED_PREFIX = 'codesage_potd_claimed_';

export const POTD_REWARD_XP = 10;
export const POTD_REWARD_COINS = 3;

/**
 * Fast deterministic string hash function (djb2 variant)
 */
function hashString(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i);
  }
  return Math.abs(hash >>> 0);
}

/**
 * Get the ISO date string (YYYY-MM-DD) for local time
 */
export function getLocalDateString(d: Date = new Date()): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Format date for friendly display (e.g., "Monday, Oct 19")
 */
export function formatDailyDate(d: Date = new Date()): string {
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Deterministically pick today's problem of the day
 */
export function getDailyProblem(date: Date = new Date(), userCompletedLessons?: string[]): DailyProblemInfo {
  const dateStr = getLocalDateString(date);
  const displayDate = formatDailyDate(date);

  if (!DSA_PROBLEMS || DSA_PROBLEMS.length === 0) {
    throw new Error('No DSA problems available');
  }

  // Deterministic index using date string hash
  const hash = hashString(dateStr);
  const index = hash % DSA_PROBLEMS.length;
  const problem = DSA_PROBLEMS[index];

  // Check solved status across all local sources
  let isSolved = false;

  try {
    const rawSolved = localStorage.getItem(STORAGE_SOLVED_KEY);
    const solvedIds: string[] = rawSolved ? JSON.parse(rawSolved) : [];
    if (solvedIds.includes(problem.id) || solvedIds.includes(problem.slug)) {
      isSolved = true;
    }
  } catch {
    // ignore parsing errors
  }

  // Also check user profile completedLessons if available
  if (!isSolved && userCompletedLessons) {
    const matched = userCompletedLessons.some(
      id => id === problem.id || id === `dsa-${problem.id}` || id === `dsa-sheet-${problem.id}` || id === problem.slug
    );
    if (matched) {
      isSolved = true;
    }
  }

  // Check if reward was claimed for today's POTD
  let bonusClaimed = false;
  try {
    bonusClaimed = localStorage.getItem(`${POTD_CLAIMED_PREFIX}${dateStr}`) === 'true';
  } catch {
    // ignore
  }

  return {
    problem,
    dateStr,
    displayDate,
    isSolved,
    bonusClaimed,
    rewardXp: POTD_REWARD_XP,
    rewardCoins: POTD_REWARD_COINS,
  };
}

/**
 * Claim the bonus for completing the Problem of the Day
 */
export function claimDailyProblemReward(
  problemId: string,
  dateStr: string = getLocalDateString()
): boolean {
  try {
    const claimKey = `${POTD_CLAIMED_PREFIX}${dateStr}`;
    if (localStorage.getItem(claimKey) === 'true') {
      return false; // already claimed
    }
    localStorage.setItem(claimKey, 'true');
    return true;
  } catch {
    return false;
  }
}
