import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { getAllLessons } from '../src/data/lessons.js';
import { NETWORKING_LESSONS } from '../src/data/networkingLessons.js';
import { FULLSTACK_LESSONS } from '../src/data/fullstackLessons.js';
import { FREELANCE_LESSONS } from '../src/data/freelanceLessons.js';
import { REAL_FREELANCE_LESSONS } from '../src/data/realfreelanceLesson.js';
import { PYTHON_LESSONS } from '../src/data/pythonLessons.js';
import { PYTHON_EXPERT_LESSONS } from '../src/data/pythonExpertLessons.js';
import { LOCAL_LESSONS } from '../src/data/localLessons.js';
import { SQL_LESSONS } from '../src/data/sqlLessons.js';
import { AI_LESSONS } from '../src/data/aiFundamentalsLesson.js';
import { INTERMEDIATE_AI_LESSONS } from '../src/data/intermediateAiLesson.js';
import { ADVANCED_AI_LESSONS } from '../src/data/advancedAiLesson.js';
import { THREE3D_LESSONS } from '../src/data/three3dLessons.js';
import { JAVA_LESSONS } from '../src/data/javaLesson.js';
import { JAVA_EXPERT_LESSONS } from '../src/data/javaExpertLessons.js';
import { C_LESSONS } from '../src/data/cLessons.js';
import { C_EXPERT_LESSONS } from '../src/data/cExpertLessons.js';
import { CPP_LESSONS } from '../src/data/cppLessons.js';
import { CPP_EXPERT_LESSONS } from '../src/data/cppExpertLessons.js';
import { CYBER_LESSONS } from '../src/data/cyberLessons.js';

const toMeta = (arr: { id: string; title: string }[]) =>
  arr.map(item => ({ id: item.id, title: item.title }));

const TRACK_LESSON_META = {
  frontend: toMeta(getAllLessons()),
  networking: toMeta(NETWORKING_LESSONS),
  fullstack: toMeta(FULLSTACK_LESSONS),
  cyber: toMeta(CYBER_LESSONS),
  freelance: toMeta(FREELANCE_LESSONS),
  'real-freelance': toMeta(REAL_FREELANCE_LESSONS),
  python: toMeta(PYTHON_LESSONS),
  pythonexpert: toMeta(PYTHON_EXPERT_LESSONS),
  local: toMeta(LOCAL_LESSONS),
  sql: toMeta(SQL_LESSONS),
  'ai-fundamentals': toMeta(AI_LESSONS),
  'intermediate-ai': toMeta(INTERMEDIATE_AI_LESSONS),
  'advanced-ai': toMeta(ADVANCED_AI_LESSONS),
  three3d: toMeta(THREE3D_LESSONS),
  java: toMeta(JAVA_LESSONS),
  javaexpert: toMeta(JAVA_EXPERT_LESSONS),
  cpp: toMeta(CPP_LESSONS),
  cppexpert: toMeta(CPP_EXPERT_LESSONS),
  c: toMeta(C_LESSONS),
  cexpert: toMeta(C_EXPERT_LESSONS),
  cx: toMeta(C_EXPERT_LESSONS),
};

const output = `// Auto-generated lightweight metadata for all lesson tracks.
// Decouples lesson IDs and titles from the heavy lesson challenge data.
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

export interface LessonMetaItem {
  id: string;
  title: string;
}

export const TRACK_LESSON_META: Record<LessonTrackKey, LessonMetaItem[]> = ${JSON.stringify(
  TRACK_LESSON_META,
  null,
  2
)};
`;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const targetPath = path.resolve(__dirname, '../src/data/lessonMetadata.ts');

fs.writeFileSync(targetPath, output, 'utf-8');
console.log('Successfully generated lesson metadata at', targetPath);
