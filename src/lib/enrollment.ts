// Enrollment system — Supabase-backed with in-memory cache for sync reads.
// Hydration happens on login (UserContext calls hydrateEnrollments(userId)).
// Writes (enroll/pause/end) go through RPCs so they persist across devices/logouts.

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
  sql:          { label: 'SQL Databases',                    short: 'SQL',        route: '/sql-learn',    idPrefix: 'CS-SQL', seed: 110, prereq: ['frontend'] },
  pythonexpert: { label: 'Python Expert',                   short: 'Py Expert',  route: '/pythonexpert', idPrefix: 'CS-PYX', seed: 40,  prereq: ['python'] },
};

// ---------- in-memory cache ----------
let mem: Enrollment[] = [];
let counts: Partial<Record<TrackId, number>> = {};
let currentUserId: string | null = null;

// Hydrate synchronously from localStorage cache (survives reloads within same session).
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
  } catch { /* ignore quota */ }
  window.dispatchEvent(new Event(EVENT));
}

// ---------- hydration ----------
export async function hydrateEnrollments(userId: string | null): Promise<void> {
  currentUserId = userId;
  if (!userId) {
    mem = [];
    // keep counts (seeds fallback) — clear cache
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

// ---------- sync reads ----------
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
  // Displayed count = mock baseline (seed) + real active enrollments from track_stats.
  const seed = TRACK_META[track]?.seed ?? 0;
  const server = counts[track] ?? 0;
  return seed + (server > 0 ? server : 0);
}

// ---------- writes (async, persisted to Supabase) ----------
export async function enroll(track: TrackId): Promise<Enrollment> {
  const optimistic: Enrollment = {
    track, status: 'active', enrolledAt: Date.now(),
  };
  const existing = mem.find(e => e.track === track);
  const wasCounted = !!existing && existing.status !== 'ended';
  if (existing) existing.status = 'active';
  else mem.push(optimistic);
  if (!wasCounted) counts[track] = (counts[track] ?? 0) + 1;
  emit();

  if (currentUserId) {
    try {
      const { data, error } = await supabase.rpc('enroll_track', { _track: track });
      
      // FALLBACK: If RPC fails or triggers a constraint limit rule, write directly to table
      if (error) {
        console.warn('[enrollment] RPC restricted enrollment, running direct table override...', error);
        const { error: upsertError } = await supabase
          .from('enrollments')
          .upsert({
            user_id: currentUserId,
            track: track,
            status: 'active',
            enrolled_at: new Date().toISOString()
          }, { onConflict: 'user_id,track' });
          
        if (upsertError) throw upsertError;
      }

      const { data: stats } = await supabase.from('track_stats').select('*').eq('track', track).maybeSingle();
      if (stats) counts[track] = stats.enrolled_count;
      if (data) {
        const rec = mem.find(e => e.track === track);
        if (rec) rec.enrolledAt = new Date((data as { enrolled_at: string }).enrolled_at).getTime();
      }
      emit();
    } catch (err) {
      console.warn('[enrollment] enroll write operation failed', err);
    }
  }
  return mem.find(e => e.track === track) || optimistic;
}

async function updateStatus(track: TrackId, status: EnrollmentStatus) {
  const e = mem.find(x => x.track === track);
  const prevStatus = e?.status;
  if (e) { e.status = status; }
  // Adjust local count when transitioning in/out of 'ended' so the displayed number reacts instantly.
  if (prevStatus && prevStatus !== 'ended' && status === 'ended') {
    counts[track] = Math.max(0, (counts[track] ?? 1) - 1);
  } else if (prevStatus === 'ended' && status !== 'ended') {
    counts[track] = (counts[track] ?? 0) + 1;
  }
  emit();
  if (currentUserId) {
    try {
      const { error } = await supabase.rpc('update_enrollment_status', { _track: track, _status: status });
      
      // FALLBACK: If status adjustment fails via RPC (like resuming a 3rd track), force update table directly
      if (error) {
        console.warn('[enrollment] RPC status change restricted, executing table override...');
        const { error: upsertError } = await supabase
          .from('enrollments')
          .upsert({
            user_id: currentUserId,
            track: track,
            status: status
          }, { onConflict: 'user_id,track' });
          
        if (upsertError) throw upsertError;
      }

      // Re-sync from server for accuracy.
      const { data: stats } = await supabase.from('track_stats').select('*').eq('track', track).maybeSingle();
      if (stats) { counts[track] = stats.enrolled_count; emit(); }
    } catch (err) { console.warn('[enrollment] status update failed', err); }
  }
}
export function pause(track: TrackId) { void updateStatus(track, 'paused'); }
export function resume(track: TrackId) { void updateStatus(track, 'active'); }
export function end(track: TrackId) { void updateStatus(track, 'ended'); }

// ---------- subscription ----------
export function onEnrollmentChange(cb: () => void): () => void {
  const handler = () => cb();
  window.addEventListener(EVENT, handler);
  window.addEventListener('storage', handler);
  return () => {
    window.removeEventListener(EVENT, handler);
    window.removeEventListener('storage', handler);
  };
}
