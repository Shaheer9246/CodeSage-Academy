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
import { THREE3D_LESSONS } from './three3dLessons';
import { JAVA_LESSONS } from './javaLesson';
import { C_LESSONS } from './cLessons';
import { CPP_LESSONS } from './cppLessons';
import { CPP_EXPERT_LESSONS } from './cppExpertLessons';

export type LessonTrackKey =
  | 'frontend'
  | 'networking'
  | 'fullstack'
  | 'freelance'
  | 'real-freelance'
  | 'python'
  | 'pythonexpert'
  | 'local'
  | 'sql'
  | 'ai-fundamentals'
  | 'intermediate-ai'
  | 'three3d'
  | 'java'
  | 'cpp'
  | 'cppexpert'
  | 'c';

const ids = (arr: { id: string }[]) => arr.map(l => l.id);

export const TRACK_LESSON_IDS: Record<LessonTrackKey, string[]> = {
  frontend: getAllLessons().map(l => l.id),
  networking: ids(NETWORKING_LESSONS),
  fullstack: ids(FULLSTACK_LESSONS),
  freelance: ids(FREELANCE_LESSONS),
  'real-freelance': ids(REAL_FREELANCE_LESSONS),
  python: ids(PYTHON_LESSONS),
  pythonexpert: ids(PYTHON_EXPERT_LESSONS),
  local: ids(LOCAL_LESSONS),
  sql: ids(SQL_LESSONS),
  'ai-fundamentals': ids(AI_LESSONS),
  'intermediate-ai': ids(INTERMEDIATE_AI_LESSONS),
  three3d: ids(THREE3D_LESSONS),
  java: ids(JAVA_LESSONS),
  cpp: ids(CPP_LESSONS),
  cppexpert: ids(CPP_EXPERT_LESSONS),
  c: ids(C_LESSONS),
};

export const TRACK_LESSON_LABELS: Record<LessonTrackKey, string> = {
  frontend: 'Frontend',
  networking: 'Networking',
  fullstack: 'Full Stack',
  freelance: 'Freelance',
  'real-freelance': 'Real-World Freelancing',
  python: 'Python',
  pythonexpert: 'Python Expert',
  local: 'Local-Only',
  sql: 'SQL',
  'ai-fundamentals': 'AI Fundamentals',
  'intermediate-ai': 'Intermediate AI',
  three3d: '3D Web Dev',
  java: 'Java',
  cpp: 'C++',
  cppexpert: 'C++ Expert',
  c: 'C',
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
