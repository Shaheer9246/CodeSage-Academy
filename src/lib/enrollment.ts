// Enrollment system – Supabase-backed with in-memory cache for sync reads.
import { supabase } from '@/integrations/supabase/client';

export type TrackId =
  | 'frontend'
  | 'networking'
  | 'fullstack'
  | 'freelance'
  | 'python'
  | 'local'
  | 'sql'
  | 'pythonexpert'
  | 'ai-fundamentals';

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
  'frontend',
  'networking',
  'fullstack',
  'freelance',
  'python',
  'local',
  'sql',
  'pythonexpert',
  'ai-fundamentals'
]);

// Tracks that do not exist or are not yet configured in your Supabase DB.
// These will run strictly in localStorage so the user never gets an error.
const DB_UNSUPPORTED = new Set<string>(['sql', 'pythonexpert', 'ai-fundamentals']);

export const TRACK_META: Record<
  TrackId,
  {
    label: string;
    short: string;
    route: string;
    idPrefix: string;
    seed: number;
    prereq?: TrackId[];
  }
> = {
  frontend: {
    label: 'Frontend Development',
    short: 'Frontend',
    route: '/learn',
    idPrefix: 'CS-FE',
    seed: 200,
  },
  networking: {
    label: 'Computer & Networking',
    short: 'Networking',
    route: '/networking',
    idPrefix: 'CS-NET',
    seed: 140,
  },
  fullstack: {
    label: 'Full Stack Frontend Development',
    short: 'Full Stack',
    route: '/fullstack',
    idPrefix: 'CS-FS',
    seed: 90,
    prereq: ['frontend'],
  },
  freelance: {
    label: 'Freelance & Clients',
    short: 'Freelance',
    route: '/freelance',
    idPrefix: 'CS-FR',
    seed: 75,
    prereq: ['frontend'],
  },
  python: {
    label: 'Python Programming',
    short: 'Python',
    route: '/python',
    idPrefix: 'CS-PY',
    seed: 180,
    prereq: ['networking'],
  },
  local: {
    label: 'Local-Only Coding',
    short: 'Local',
    route: '/local',
    idPrefix: 'CS-LO',
    seed: 60,
    prereq: ['frontend'],
  },
  sql: {
    label: 'SQL Databases',
    short: 'SQL',
    route: '/sql',
    idPrefix: 'CS-SQL',
    seed: 110,
    prereq: ['frontend'],
  },
  pythonexpert: {
    label: 'Python Expert',
    short: 'Py Expert',
    route: '/pythonexpert',
    idPrefix: 'CS-PYX',
    seed: 40,
    prereq: ['python'],
  },
  'ai-fundamentals': {
    label: 'AI Fundamentals',
    short: 'AI',
    route: '/ai-fundamentals',
    idPrefix: 'CS-AI',
    seed: 130,
  },
};

let mem: Enrollment[] = [];
let counts: Partial<Record<TrackId, number>> = {};
let currentUserId: string | null = null;

try {
  const raw = localStorage.getItem(LOCAL_CACHE);
  if (raw) {
    mem = (JSON.parse(raw) as Enrollment[]).filter(e =>
      VALID_TRACK_IDS.has(e.track)
    );
  }
  const c = localStorage.getItem(LOCAL_COUNT_CACHE);
  if (c) {
    counts = JSON.parse(c);
  }
} catch {
  /* ignore */
}

function emit() {
  try {
    localStorage.setItem(LOCAL_CACHE, JSON.stringify(mem));
    localStorage.setItem(LOCAL_COUNT_CACHE, JSON.stringify(counts));
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new Event(EVENT));
}

/**
 * Timeout wrapper for Supabase RPC calls to prevent indefinite UI hangs.
 */
async function callRpcWithTimeout(fnName: string, params: Record<string, any>, timeoutMs = 10000): Promise<any> {
  return Promise.race([
    supabase.rpc(fnName as any, params),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Database request timed out. Please try again.')), timeoutMs)
    )
  ]);
}

export async function hydrateEnrollments(
  userId: string | null
): Promise<void> {
  currentUserId = userId;
  if (!userId) {
    mem = [];
    try {
      localStorage.removeItem(LOCAL_CACHE);
    } catch {
      /* noop */
    }
    emit();
    return;
  }

  try {
    const [{ data: enr }, { data: stats }] = await Promise.all([
      supabase.from('enrollments').select('*').eq('user_id', userId),
      supabase.from('track_stats').select('*'),
    ]);

    // Keep any local unsupported tracks so they are not wiped when DB hydrates
    const localUnsupported = mem.filter(e => DB_UNSUPPORTED.has(e.track));

    mem = ((enr || []) as {
      track: string;
      status: string;
      enrolled_at: string;
    }[])
      .filter(r => VALID_TRACK_IDS.has(r.track))
      .map(r => ({
        track: r.track as TrackId,
        // Convert to lowercase to avoid any DB status capitalization issues breaking counts
        status: (r.status?.toLowerCase() as EnrollmentStatus) || 'active',
        enrolledAt: new Date(r.enrolled_at).getTime() || Date.now(),
      }));

    // Merge our local unsupported track states back into our memory array
    localUnsupported.forEach(local => {
      if (!mem.some(m => m.track === local.track)) {
        mem.push(local);
      }
    });

    counts = {};
    ((stats || []) as { track: string; enrolled_count: number }[]).forEach(
      s => {
        if (VALID_TRACK_IDS.has(s.track)) {
          counts[s.track as TrackId] = s.enrolled_count;
        }
      }
    );

    // Re-populate counts for local unsupported tracks if missing
    DB_UNSUPPORTED.forEach(track => {
      const hasLocal = mem.some(e => e.track === track);
      if (hasLocal && !counts[track as TrackId]) {
        counts[track as TrackId] = 1;
      }
    });

    // Enforce the 2-active-track limit on hydration. If the DB carries over
    // more than 2 active tracks from earlier sessions, auto-pause the older
    // ones so the client state matches the rule.
    const actives = mem
      .filter(e => e.status === 'active')
      .sort((a, b) => b.enrolledAt - a.enrolledAt);
    if (actives.length > 2) {
      const toPause = actives.slice(2);
      toPause.forEach(e => {
        e.status = 'paused';
      });
      // Best-effort DB sync (fire-and-forget)
      toPause.forEach(e => {
        if (!DB_UNSUPPORTED.has(e.track)) {
          try {
            void supabase.rpc('update_enrollment_status', {
              _track: e.track,
              _status: 'paused',
            });
          } catch {
            /* noop */
          }
        }
      });
    }

    emit();
  } catch (err) {
    console.warn('[enrollment] hydrate failed', err);
  }
}

export function getEnrollments(): Enrollment[] {
  return [...mem];
}

export function getEnrollment(track: TrackId): Enrollment | undefined {
  return mem.find(e => e.track === track);
}

export function isEnrolled(track: TrackId): boolean {
  const e = getEnrollment(track);
  return !!e && e.status?.toLowerCase() !== 'ended';
}

export function isActive(track: TrackId): boolean {
  const e = getEnrollment(track);
  return !!e && e.status?.toLowerCase() === 'active';
}

export function activeCount(): number {
  return mem.filter(e => e.status?.toLowerCase() === 'active').length;
}

export function getStudentCount(track: TrackId): number {
  const seed = TRACK_META[track]?.seed ?? 0;
  const server = counts[track] ?? 0;
  
  // If server count exists, treat it as the absolute total. 
  // Otherwise, safely fall back to the seed.
  return server > 0 ? server : seed;
}

export async function enroll(track: TrackId): Promise<Enrollment> {
  if (!isActive(track) && activeCount() >= 2) {
    throw new Error(
      'Action restricted: Maximum limit of 2 active courses reached.'
    );
  }

  const existing = mem.find(e => e.track === track);
  const oldStatus = existing?.status;
  const wasCounted = !!existing && existing.status !== 'ended';

  if (existing) {
    existing.status = 'active';
  } else {
    mem.push({ track, status: 'active', enrolledAt: Date.now() });
  }

  if (!wasCounted) {
    counts[track] = (counts[track] ?? 0) + 1;
  }
  emit();

  // BYPASS: Only connect to Supabase if user is logged in AND track is supported
  if (currentUserId && !DB_UNSUPPORTED.has(track)) {
    try {
      const { error } = await callRpcWithTimeout('enroll_track', {
  _track: track,
});
      if (error) throw error;

      const { data: stats } = await supabase
        .from('track_stats')
        .select('*')
        .eq('track', track)
        .maybeSingle();
     if (stats) {
        // Use Math.max to prevent database replication lag from rolling back 
        // the local count after a fresh enrollment.
        counts[track] = Math.max(counts[track] ?? 0, stats.enrolled_count);
        emit();
      }
    } catch (err) {
      if (existing) {
        if (oldStatus) existing.status = oldStatus;
      } else {
        mem = mem.filter(e => e.track !== track);
      }
      if (!wasCounted) {
        counts[track] = Math.max(0, (counts[track] ?? 1) - 1);
      }
      emit();
      throw err;
    }
  }

  return (
    mem.find(e => e.track === track) || {
      track,
      status: 'active',
      enrolledAt: Date.now(),
    }
  );
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

  // BYPASS: Only connect to Supabase if user is logged in AND track is supported
  if (currentUserId && !DB_UNSUPPORTED.has(track)) {
    try {
      const { error } = await callRpcWithTimeout('update_enrollment_status', {
        _track: track,
        _status: status,
      });
      if (error) throw error;
    } catch (err) {
      e.status = prevStatus;
      emit();
      throw err; // Re-throw so UI knows it failed
    }
  }
}

// AFTER:
export async function pause(track: TrackId): Promise<void> {
  await updateStatus(track, 'paused');
}

export async function resume(track: TrackId): Promise<void> {
  await updateStatus(track, 'active');
}

export async function end(track: TrackId): Promise<void> {
  await updateStatus(track, 'ended');
}

export function onEnrollmentChange(cb: () => void): () => void {
  const handler = () => cb();
  window.addEventListener(EVENT, handler);
  return () => window.removeEventListener(EVENT, handler);
}
