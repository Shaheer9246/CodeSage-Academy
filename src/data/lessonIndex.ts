// Single source of truth for every track's lesson IDs and metadata.
// Decoupled from heavy lesson content files to prevent root bundle bloat.
import {
  TRACK_LESSON_META,
  type LessonTrackKey,
  type LessonMetaItem,
} from './lessonMetadata';

export type { LessonTrackKey, LessonMetaItem };
export { TRACK_LESSON_META };

export const TRACK_LESSON_IDS: Record<LessonTrackKey, string[]> = Object.fromEntries(
  Object.entries(TRACK_LESSON_META).map(([key, items]) => [key, items.map(i => i.id)])
) as Record<LessonTrackKey, string[]>;

export const TRACK_LESSON_LABELS: Record<LessonTrackKey, string> = {
  frontend: 'Frontend',
  networking: 'Networking',
  fullstack: 'Full Stack',
  cyber: 'Cyber Security',
  freelance: 'Freelance',
  'real-freelance': 'Real-World Freelancing',
  python: 'Python',
  pythonexpert: 'Python Expert',
  local: 'Local-Only',
  sql: 'SQL',
  'ai-fundamentals': 'AI Fundamentals',
  'intermediate-ai': 'Intermediate AI',
  'advanced-ai': 'Advanced AI',
  three3d: '3D Web Dev',
  java: 'Java',
  javaexpert: 'Java Expert',
  cpp: 'C++',
  cppexpert: 'C++ Expert',
  c: 'C',
  cexpert: 'C Expert',
  cx: 'C Expert',
};

export const LESSON_TRACK_KEYS = Object.keys(TRACK_LESSON_IDS) as LessonTrackKey[];

export const ALL_LESSON_IDS: string[] = Array.from(
  new Set(LESSON_TRACK_KEYS.flatMap(k => TRACK_LESSON_IDS[k]))
);

export function lessonCountFor(track: LessonTrackKey): number {
  return TRACK_LESSON_IDS[track]?.length ?? 0;
}

export function completedCountFor(track: LessonTrackKey, completed: string[]): number {
  const set = new Set(completed);
  return (TRACK_LESSON_IDS[track] || []).filter(id => set.has(id)).length;
}

export function isTrackCompleted(track: LessonTrackKey, completed: string[]): boolean {
  const list = TRACK_LESSON_IDS[track];
  if (!list || list.length === 0) return false;
  const set = new Set(completed);
  return list.every(id => set.has(id));
}

export const TRACK_BASE_URLS: Record<LessonTrackKey, string> = {
  frontend: '/lesson',
  networking: '/n-lesson',
  fullstack: '/fs-lesson',
  cyber: '/cyber-lesson',
  freelance: '/f-lesson',
  'real-freelance': '/rf-lesson',
  python: '/py-lesson',
  pythonexpert: '/pyx-lesson',
  local: '/local-lesson',
  sql: '/sql-lesson',
  'ai-fundamentals': '/ai-lesson',
  'intermediate-ai': '/iai-lesson',
  'advanced-ai': '/adv-ai-lesson',
  three3d: '/three-lesson',
  java: '/java-lesson',
  javaexpert: '/javax-lesson',
  c: '/c-lesson',
  cexpert: '/cx-lesson',
  cx: '/cx-lesson',
  cpp: '/cpp-lesson',
  cppexpert: '/cppx-lesson',
};

export function getLessonDetails(lessonId: string): {
  id: string;
  title: string;
  trackKey: LessonTrackKey;
  trackLabel: string;
  lessonNumber: number;
  totalLessons: number;
  url: string;
} | null {
  if (!lessonId) return null;

  for (const trackKey of LESSON_TRACK_KEYS) {
    const items = TRACK_LESSON_META[trackKey] || [];
    const idx = items.findIndex(i => i.id === lessonId);
    if (idx !== -1) {
      const baseUrl = TRACK_BASE_URLS[trackKey] || '/lesson';
      const title = items[idx]?.title || `Lesson ${idx + 1}`;

      return {
        id: lessonId,
        title,
        trackKey,
        trackLabel: TRACK_LESSON_LABELS[trackKey] || trackKey,
        lessonNumber: idx + 1,
        totalLessons: items.length,
        url: `${baseUrl}/${lessonId}`,
      };
    }
  }

  return null;
}

export function getNextLessonForTrack(trackKey: LessonTrackKey, completedLessons: string[]) {
  const ids = TRACK_LESSON_IDS[trackKey] || [];
  if (ids.length === 0) return null;
  const completedSet = new Set(completedLessons || []);
  const nextId = ids.find(id => !completedSet.has(id)) || ids[ids.length - 1];
  return getLessonDetails(nextId);
}
