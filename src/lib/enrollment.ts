// Client-side enrollment system (localStorage-backed).
// Single source of truth for track enrollment + mock "students learning" counters.

export type TrackId = 'frontend' | 'networking' | 'fullstack' | 'freelance' | 'python' | 'local';
export type EnrollmentStatus = 'active' | 'paused' | 'ended';

export interface Enrollment {
  track: TrackId;
  status: EnrollmentStatus;
  enrolledAt: number;
  studentId?: string;
}

const ENROLL_KEY_PREFIX = 'codesage:enrollments:v1:';
const COUNTS_KEY = 'codesage:studentCounts:v1';
const EVENT = 'enrollment:changed';

export const TRACK_META: Record<TrackId, {
  label: string;
  short: string;
  route: string;
  idPrefix: string;
  seed: number;
  prereq?: TrackId[];
}> = {
  frontend:   { label: 'Frontend Development',            short: 'Frontend',   route: '/learn',      idPrefix: 'CS-FE',  seed: 200 },
  networking: { label: 'Computer & Networking',           short: 'Networking', route: '/networking', idPrefix: 'CS-NET', seed: 140 },
  fullstack:  { label: 'Full Stack Frontend Development', short: 'Full Stack', route: '/fullstack',  idPrefix: 'CS-FS',  seed: 90,  prereq: ['frontend'] },
  freelance:  { label: 'Freelance & Clients',             short: 'Freelance',  route: '/freelance',  idPrefix: 'CS-FR',  seed: 75,  prereq: ['frontend', 'fullstack'] },
  python:     { label: 'Python Programming',              short: 'Python',     route: '/python',     idPrefix: 'CS-PY',  seed: 180, prereq: ['networking'] },
  local:      { label: 'Local-Only Coding',               short: 'Local',      route: '/local',      idPrefix: 'CS-LO',  seed: 60 },
};

function activeUserId(): string {
  try {
    const raw = localStorage.getItem('codesage_cached_profile');
    if (raw) {
      const p = JSON.parse(raw);
      if (p?.id) return String(p.id);
    }
  } catch {}
  return 'anon';
}

function storageKey(): string {
  return ENROLL_KEY_PREFIX + activeUserId();
}

function readList(): Enrollment[] {
  try {
    const raw = localStorage.getItem(storageKey());
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch { return []; }
}

function writeList(list: Enrollment[]) {
  try {
    localStorage.setItem(storageKey(), JSON.stringify(list));
    window.dispatchEvent(new Event(EVENT));
  } catch {}
}

function readCounts(): Record<string, number> {
  try {
    const raw = localStorage.getItem(COUNTS_KEY);
    if (!raw) return {};
    return JSON.parse(raw) || {};
  } catch { return {}; }
}

function writeCounts(c: Record<string, number>) {
  try { localStorage.setItem(COUNTS_KEY, JSON.stringify(c)); } catch {}
}

function bumpCount(track: TrackId) {
  const c = readCounts();
  c[track] = (c[track] || 0) + 1;
  writeCounts(c);
}

function generateStudentId(track: TrackId): string {
  const n = Math.floor(100000 + Math.random() * 900000);
  return `${TRACK_META[track].idPrefix}-${n}`;
}

// ---------- public API ----------

export function getEnrollments(): Enrollment[] {
  return readList();
}

export function getEnrollment(track: TrackId): Enrollment | undefined {
  return readList().find(e => e.track === track);
}

export function isEnrolled(track: TrackId): boolean {
  const e = getEnrollment(track);
  return !!e && e.status !== 'ended';
}

export function isActive(track: TrackId): boolean {
  const e = getEnrollment(track);
  return !!e && e.status === 'active';
}

export function activeCount(): number {
  return readList().filter(e => e.status === 'active').length;
}

export function enroll(track: TrackId): Enrollment {
  const list = readList();
  const existing = list.find(e => e.track === track);
  if (existing) {
    existing.status = 'active';
    if (!existing.studentId) existing.studentId = generateStudentId(track);
    writeList(list);
    return existing;
  }
  const rec: Enrollment = {
    track,
    status: 'active',
    enrolledAt: Date.now(),
    studentId: generateStudentId(track),
  };
  list.push(rec);
  writeList(list);
  bumpCount(track);
  return rec;
}

export function pause(track: TrackId) {
  const list = readList();
  const e = list.find(x => x.track === track);
  if (e) { e.status = 'paused'; writeList(list); }
}

export function resume(track: TrackId) {
  const list = readList();
  const e = list.find(x => x.track === track);
  if (e) { e.status = 'active'; writeList(list); }
}

export function end(track: TrackId) {
  const list = readList();
  const e = list.find(x => x.track === track);
  if (e) { e.status = 'ended'; writeList(list); }
}

export function getStudentCount(track: TrackId): number {
  return TRACK_META[track].seed + (readCounts()[track] || 0);
}

export function onEnrollmentChange(cb: () => void): () => void {
  const handler = () => cb();
  window.addEventListener(EVENT, handler);
  window.addEventListener('storage', handler);
  return () => {
    window.removeEventListener(EVENT, handler);
    window.removeEventListener('storage', handler);
  };
}
