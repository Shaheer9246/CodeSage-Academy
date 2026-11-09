import type { TrackId } from './enrollment';

export type DashboardCategory =
  | 'All'
  | 'frontend'
  | 'python'
  | 'java'
  | 'c'
  | 'cpp'
  | 'ai'
  | 'sql'
  | 'fundamentals'
  | 'cyber'
  | 'career';

export interface GoalConfig {
  id: string;
  category: DashboardCategory;
  primaryTrackId: TrackId;
  primaryPath: string;
  label: string;
}

export const normalizeGoalValue = (raw?: string): string => {
  if (!raw) return 'all';
  const val = raw.toLowerCase().trim();
  if (val.includes('cyber') || val.includes('hack') || val.includes('security')) return 'cyber';
  if (val.includes('front') || val.includes('web') || val.includes('full')) return 'frontend';
  if (val.includes('ai') || val.includes('machine') || val.includes('ml')) return 'ai';
  if (val.includes('python')) return 'python';
  if (val.includes('system') || val.includes('c++') || val.includes('core')) return 'systems';
  return 'all';
};

export const normalizeExperienceValue = (raw?: string): string => {
  if (!raw) return 'Beginner';
  const val = raw.toLowerCase().trim();
  if (val.includes('experience') || val.includes('advanced') || val.includes('expert')) return 'Advanced';
  if (val.includes('cs') || val.includes('student') || val.includes('intermediate') || val.includes('self')) return 'Intermediate';
  return 'Beginner';
};

export const GOAL_MAP: Record<string, GoalConfig> = {
  cyber: {
    id: 'cyber',
    category: 'cyber',
    primaryTrackId: 'cyber',
    primaryPath: '/cyber',
    label: 'Cyber Security Specialist',
  },
  frontend: {
    id: 'frontend',
    category: 'frontend',
    primaryTrackId: 'frontend',
    primaryPath: '/learn',
    label: 'Modern Full-Stack & Web',
  },
  ai: {
    id: 'ai',
    category: 'ai',
    primaryTrackId: 'ai-fundamentals',
    primaryPath: '/ai-fundamentals',
    label: 'AI & Machine Learning Engineer',
  },
  python: {
    id: 'python',
    category: 'python',
    primaryTrackId: 'python',
    primaryPath: '/python',
    label: 'Python Software Engineer',
  },
  systems: {
    id: 'systems',
    category: 'c',
    primaryTrackId: 'c',
    primaryPath: '/c',
    label: 'Systems & Core Programming',
  },
  all: {
    id: 'all',
    category: 'All',
    primaryTrackId: 'frontend',
    primaryPath: '/learn',
    label: 'All-Round Explorer',
  },
};

/**
 * Returns the recommended Dashboard category for a given user goal.
 */
export const getCategoryForGoal = (goalRaw?: string): DashboardCategory => {
  const normalized = normalizeGoalValue(goalRaw);
  return GOAL_MAP[normalized]?.category || 'All';
};

/**
 * Returns the primary track definition for a given user goal.
 */
export const getPrimaryTrackForGoal = (goalRaw?: string): GoalConfig => {
  const normalized = normalizeGoalValue(goalRaw);
  return GOAL_MAP[normalized] || GOAL_MAP.all;
};

/**
 * Immediately synchronizes local dashboard storage with the user's chosen goal.
 * Called when saving goal in SettingsPage, completing Onboarding, or clicking Set Goal.
 */
export const syncGoalWithDashboard = (goalRaw?: string, userId?: string) => {
  const normalized = normalizeGoalValue(goalRaw);
  const cfg = GOAL_MAP[normalized] || GOAL_MAP.all;
  try {
    localStorage.setItem('codesage_dashboard_category', cfg.category);
    if (normalized !== 'all') {
      localStorage.setItem('codesage_last_active_track', cfg.primaryTrackId);
    }
    if (userId) {
      localStorage.setItem(`codesage_selected_goal_${userId}`, normalized);
    }
  } catch (err) {
    console.warn('Failed to sync goal with dashboard storage', err);
  }
};
