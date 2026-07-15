// Enrollment system — Supabase-backed with in-memory cache for sync reads.
import { supabase } from '@/integrations/supabase/client';

export type TrackId =
  | 'frontend' | 'networking' | 'fullstack' | 'freelance'
  | 'python' | 'local' | 'sql' | 'pythonexpert';
export type EnrollmentStatus = 'active' | 'paused' | 'ended';

export interface Enrollment {
  track: TrackId;
  status: EnrollmentStatus;
  enrolledAt: number;
  studentId?: string;
}

const EVENT = 'enrollment:changed';
const LOCAL_CACHE = 'codesage:enroll_cache:v2';
const LOCAL_COUNT_CACHE = 'codesage:count_cache:v2';

const VALID_TRACK_IDS: Set<string> = new Set([
  'frontend', 'networking', 'fullstack', 'freelance',
  'python', 'local', 'sql', 'pythonexpert'
]);

export const TRACK_META: Record<TrackId, {
  label: string; short: string; route: string; idPrefix: string;
  seed: number; prereq?: TrackId[];
}> = {
  frontend:     { label: 'Frontend Development',            short: 'Frontend',   route: '/learn',        idPrefix: 'CS-FE',  seed: 200 },
  networking:   { label: 'Computer & Networking',           short: 'Networking', route: '/networking',   idPrefix: 'CS-NET', seed: 140 },
  fullstack:    { label: 'Full Stack Frontend Development', short: 'Full Stack', route: '/fullstack',    idPrefix: 'CS-FS',  seed: 90,  prereq: ['frontend'] },
  freelance:    { label: 'Freelance & Clients',             short: 'Freelance',  route: '/freelance',    idPrefix: 'CS-FR',  seed: 75,  prereq: ['frontend'] },
  python:       { label: 'Python Programming',              short: 'Python',     route: '/python',       idPrefix: 'CS-PY',  seed: 180, prereq: ['networking'] },
  local:        { label: 'Local-Only Coding',               short: 'Local',      route: '/local',        idPrefix: 'CS-LO',  seed: 60,  prereq: ['frontend'] },
  sql:          { label: 'SQL Databases',                    short: 'SQL',        route: '/sql',          idPrefix: 'CS-SQL', seed: 110, prereq: ['frontend'] },
  pythonexpert: { label: 'Python Expert',                   short: 'Py Expert',  route: '/pythonexpert', idPrefix: 'CS-PYX', seed: 40,  prereq: ['python'] },
};

let mem: Enrollment[] = [];
let counts: Partial<Record<TrackId, number>> = {};
let currentUserId: string | null = null;

try {
  const raw = localStorage.getItem(LOCAL_CACHE);
  if (raw) mem = (JSON.parse(raw) as Enrollment[]).filter(e => VALID_TRACK_IDS.has(e.track));
  const c = localStorage.getItem(LOCAL_COUNT_CACHE);
  if (c) counts = JSON.parse(c);
} catch { /* ignore */ }

function emit() {
  try {
    localStorage.setItem(LOCAL_CACHE, JSON.stringify(mem));
    localStorage.setItem(LOCAL_COUNT_CACHE, JSON.stringify(counts));
  } catch { /* ignore */ }
  window.dispatchEvent(new Event(EVENT));
}

export async function hydrateEnrollments(userId: string | null): Promise<void> {
  currentUserId = userId;
  if (!userId) {
    mem = [];
    try { localStorage.removeItem(LOCAL_CACHE); } catch { /* noop */ }
    emit();
    return;
  }
  try {
    const [{ data: enr }, { data: stats }] = await Promise.all([
      supabase.from('enrollments').select('*').eq('user_id', userId),
      supabase.from('track_stats').select('*'),
    ]);
    
    mem = ((enr || []) as { track: string; status: string; enrolled_at: string }[])
      .filter(r => VALID_TRACK_IDS.has(r.track))
      .map(r => ({
        track: r.track as TrackId,
        status: (r.status as EnrollmentStatus) || 'active',
        enrolledAt: new Date(r.enrolled_at).getTime() || Date.now(),
      }));

    counts = {};
    ((stats || []) as { track: string; enrolled_count: number }[]).forEach(s => {
      if (VALID_TRACK_IDS.has(s.track)) {
        counts[s.track as TrackId] = s.enrolled_count;
      }
    });
    emit();
  } catch (err) {
    console.warn('[enrollment] hydrate failed', err);
  }
}

export function getEnrollments(): Enrollment[] { return [...mem]; }
export function getEnrollment(track: TrackId): Enrollment | undefined { return mem.find(e => e.track === track); }
export function isEnrolled(track: TrackId): boolean {
  const e = getEnrollment(track);
  return !!e && e.status !== 'ended';
}
export function isActive(track: TrackId): boolean {
  const e = getEnrollment(track);
  return !!e && e.status === 'active';
}
export function activeCount(): number {
  return mem.filter(e => e.status === 'active').length;
}
export function getStudentCount(track: TrackId): number {
  const seed = TRACK_META[track]?.seed ?? 0;
  const server = counts[track] ?? 0;
  return seed + (server > 0 ? server : 0);
}

export async function enroll(track: TrackId): Promise<Enrollment> {
  if (!isActive(track) && activeCount() >= 2) {
    throw new Error('Action restricted: Maximum limit of 2 active courses reached.');
  }

  const existing = mem.find(e => e.track === track);
  const oldStatus = existing?.status;
  const wasCounted = !!existing && existing.status !== 'ended';
  
  if (existing) existing.status = 'active';
  else mem.push({ track, status: 'active', enrolledAt: Date.now() });
  
  if (!wasCounted) counts[track] = (counts[track] ?? 0) + 1;
  emit();

  if (currentUserId) {
    try {
      const { data, error } = await supabase.rpc('enroll_track', { _track: track });
      if (error) throw error;

      const { data: stats } = await supabase.from('track_stats').select('*').eq('track', track).maybeSingle();
      if (stats) counts[track] = stats.enrolled_count;
      emit();
    } catch (err) {
      if (existing) {
        if (oldStatus) existing.status = oldStatus;
      } else {
        mem = mem.filter(e => e.track !== track);
      }
      if (!wasCounted) counts[track] = Math.max(0, (counts[track] ?? 1) - 1);
      emit();
      throw err;
    }
  }
  return mem.find(e => e.track === track) || { track, status: 'active', enrolledAt: Date.now() };
}

async function updateStatus(track: TrackId, status: EnrollmentStatus) {
  if (status === 'active' && !isActive(track) && activeCount() >= 2) return;

  const e = mem.find(x => x.track === track);
  const prevStatus = e?.status;
  if (!e) return;

  e.status = status;
  if (prevStatus && prevStatus !== 'ended' && status === 'ended') {
    counts[track] = Math.max(0, (counts[track] ?? 1) - 1);
  } else if (prevStatus === 'ended' && status !== 'ended') {
    counts[track] = (counts[track] ?? 0) + 1;
  }
  emit();

  if (currentUserId) {
    try {
      const { error } = await supabase.rpc('update_enrollment_status', { _track: track, _status: status });
      if (error) throw error;
    } catch (err) { 
      e.status = prevStatus;
      emit();
    }
  }
}
export function pause(track: TrackId) { void updateStatus(track, 'paused'); }
export function resume(track: TrackId) { void updateStatus(track, 'active'); }
export function end(track: TrackId) { void updateStatus(track, 'ended'); }

export function onEnrollmentChange(cb: () => void): () => void {
  const handler = () => cb();
  window.addEventListener(EVENT, handler);
  return () => window.removeEventListener(EVENT, handler);
}
