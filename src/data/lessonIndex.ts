// Single source of truth for every track's lesson IDs.
// Used by: lesson_registry seeding, EnrollDialog prerequisites,
// SettingsPage progress groups and Roadmap totals.
import { getAllLessons } from './lessons';
import { NETWORKING_LESSONS } from './networkingLessons';
import { FULLSTACK_LESSONS } from './fullstackLessons';
import { FREELANCE_LESSONS } from './freelanceLessons';
import { REAL_FREELANCE_LESSONS } from './realfreelanceLesson';
import { PYTHON_LESSONS } from './pythonLessons';
import { PYTHON_EXPERT_LESSONS } from './pythonExpertLessons';
import { LOCAL_LESSONS } from './localLessons';
import { SQL_LESSONS } from './sqlLessons';
import { AI_LESSONS } from './aiFundamentalsLesson';
import { INTERMEDIATE_AI_LESSONS } from './intermediateAiLesson';
import { ADVANCED_AI_LESSONS } from './advancedAiLesson';
import { THREE3D_LESSONS } from './three3dLessons';
import { JAVA_LESSONS } from './javaLesson';
import { JAVA_EXPERT_LESSONS } from './javaExpertLessons';
import { C_LESSONS } from './cLessons';
import { C_EXPERT_LESSONS } from './cExpertLessons';
import { CPP_LESSONS } from './cppLessons';
import { CPP_EXPERT_LESSONS } from './cppExpertLessons';
import { CYBER_LESSONS } from './cyberLessons';

export type LessonTrackKey =
  | 'frontend'
  | 'networking'
  | 'fullstack'
  | 'cyber'
  | 'freelance'
  | 'real-freelance'
  | 'python'
  | 'pythonexpert'
  | 'local'
  | 'sql'
  | 'ai-fundamentals'
  | 'intermediate-ai'
  | 'advanced-ai'
  | 'three3d'
  | 'java'
  | 'javaexpert'
  | 'cpp'
  | 'cppexpert'
  | 'c'
  | 'cexpert'
  | 'cx';

const ids = (arr: { id: string }[]) => arr.map(l => l.id);

export const TRACK_LESSON_IDS: Record<LessonTrackKey, string[]> = {
  frontend: getAllLessons().map(l => l.id),
  networking: ids(NETWORKING_LESSONS),
  fullstack: ids(FULLSTACK_LESSONS),
  cyber: ids(CYBER_LESSONS),
  freelance: ids(FREELANCE_LESSONS),
  'real-freelance': ids(REAL_FREELANCE_LESSONS),
  python: ids(PYTHON_LESSONS),
  pythonexpert: ids(PYTHON_EXPERT_LESSONS),
  local: ids(LOCAL_LESSONS),
  sql: ids(SQL_LESSONS),
  'ai-fundamentals': ids(AI_LESSONS),
  'intermediate-ai': ids(INTERMEDIATE_AI_LESSONS),
  'advanced-ai': ids(ADVANCED_AI_LESSONS),
  three3d: ids(THREE3D_LESSONS),
  java: ids(JAVA_LESSONS),
  javaexpert: ids(JAVA_EXPERT_LESSONS),
  cpp: ids(CPP_LESSONS),
  cppexpert: ids(CPP_EXPERT_LESSONS),
  c: ids(C_LESSONS),
  cexpert: ids(C_EXPERT_LESSONS),
  cx: ids(C_EXPERT_LESSONS),
};

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
    const ids = TRACK_LESSON_IDS[trackKey];
    const idx = ids.indexOf(lessonId);
    if (idx !== -1) {
      const baseUrl = TRACK_BASE_URLS[trackKey] || '/lesson';
      let title = `Lesson ${idx + 1}`;

      if (trackKey === 'frontend') {
        const found = getAllLessons().find(l => l.id === lessonId);
        if (found) title = found.title;
      } else if (trackKey === 'networking') {
        const found = NETWORKING_LESSONS.find(l => l.id === lessonId);
        if (found) title = found.title;
      } else if (trackKey === 'fullstack') {
        const found = FULLSTACK_LESSONS.find(l => l.id === lessonId);
        if (found) title = found.title;
      } else if (trackKey === 'freelance') {
        const found = FREELANCE_LESSONS.find(l => l.id === lessonId);
        if (found) title = found.title;
      } else if (trackKey === 'real-freelance') {
        const found = REAL_FREELANCE_LESSONS.find(l => l.id === lessonId);
        if (found) title = found.title;
      } else if (trackKey === 'python') {
        const found = PYTHON_LESSONS.find(l => l.id === lessonId);
        if (found) title = found.title;
      } else if (trackKey === 'pythonexpert') {
        const found = PYTHON_EXPERT_LESSONS.find(l => l.id === lessonId);
        if (found) title = found.title;
      } else if (trackKey === 'local') {
        const found = LOCAL_LESSONS.find(l => l.id === lessonId);
        if (found) title = found.title;
      } else if (trackKey === 'sql') {
        const found = SQL_LESSONS.find(l => l.id === lessonId);
        if (found) title = found.title;
      } else if (trackKey === 'ai-fundamentals') {
        const found = AI_LESSONS.find(l => l.id === lessonId);
        if (found) title = found.title;
      } else if (trackKey === 'intermediate-ai') {
        const found = INTERMEDIATE_AI_LESSONS.find(l => l.id === lessonId);
        if (found) title = found.title;
      } else if (trackKey === 'advanced-ai') {
        const found = ADVANCED_AI_LESSONS.find(l => l.id === lessonId);
        if (found) title = found.title;
      } else if (trackKey === 'three3d') {
        const found = THREE3D_LESSONS.find(l => l.id === lessonId);
        if (found) title = found.title;
      } else if (trackKey === 'java') {
        const found = JAVA_LESSONS.find(l => l.id === lessonId);
        if (found) title = found.title;
      } else if (trackKey === 'javaexpert') {
        const found = JAVA_EXPERT_LESSONS.find(l => l.id === lessonId);
        if (found) title = found.title;
      } else if (trackKey === 'c') {
        const found = C_LESSONS.find(l => l.id === lessonId);
        if (found) title = found.title;
      } else if (trackKey === 'cexpert' || trackKey === 'cx') {
        const found = C_EXPERT_LESSONS.find(l => l.id === lessonId);
        if (found) title = found.title;
      } else if (trackKey === 'cpp') {
        const found = CPP_LESSONS.find(l => l.id === lessonId);
        if (found) title = found.title;
      } else if (trackKey === 'cppexpert') {
        const found = CPP_EXPERT_LESSONS.find(l => l.id === lessonId);
        if (found) title = found.title;
      }

      return {
        id: lessonId,
        title,
        trackKey,
        trackLabel: TRACK_LESSON_LABELS[trackKey] || trackKey,
        lessonNumber: idx + 1,
        totalLessons: ids.length,
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
