// Enrollment system – Supabase-backed with in-memory cache for sync reads.
import { supabase } from '@/integrations/supabase/client';

export type TrackId =
  | 'frontend'
  | 'networking'
  | 'fullstack'
  | 'freelance'
  | 'real-freelance'
  | 'python'
  | 'local'
  | 'sql'
  | 'pythonexpert'
  | 'ai-fundamentals'
  | 'intermediate-ai'
  | 'advanced-ai'
  | 'three3d'
  | 'java'
  | 'javaexpert'
  | 'cpp'
  | 'cppexpert'
  | 'c'
  | 'cx'
  | 'cyber';

export type EnrollmentStatus = 'active' | 'paused' | 'ended' | 'completed';

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
  'real-freelance',
  'python',
  'local',
  'sql',
  'pythonexpert',
  'ai-fundamentals',
  'intermediate-ai',
  'advanced-ai',
  'three3d',
  'java',
  'javaexpert',
  'cpp',
  'cppexpert',
  'c',
  'cx',
  'cyber'
]);


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
    label: 'Modern Frontend Engineering',
    short: 'Frontend',
    route: '/learn',
    idPrefix: 'CS-FE',
    seed: 10,
  },
  networking: {
    label: 'Computer Systems & Network Architecture',
    short: 'Systems & Net',
    route: '/networking',
    idPrefix: 'CS-NET',
    seed: 140,
  },
  fullstack: {
    label: 'Full-Stack Application Architecture',
    short: 'Full-Stack',
    route: '/fullstack',
    idPrefix: 'CS-FS',
    seed: 90,
    prereq: ['frontend'],
  },
  freelance: {
    label: 'Software Consultancy & Client Acquisition',
    short: 'Tech Consulting',
    route: '/freelance',
    idPrefix: 'CS-FR',
    seed: 75,
    prereq: ['frontend'],
  },
  'real-freelance': {
    label: 'Commercial Engineering Practice',
    short: 'Commercial Practice',
    route: '/real-freelance',
    idPrefix: 'CS-RFR',
    seed: 12,
    prereq: ['freelance'], 
  },
  python: {
    label: 'Python Software Engineering',
    short: 'Python',
    route: '/python',
    idPrefix: 'CS-PY',
    seed: 10,
    prereq: ['networking'],
  },
  local: {
    label: 'Offline-First Software Engineering',
    short: 'Offline App',
    route: '/local',
    idPrefix: 'CS-LO',
    seed: 60,
    prereq: ['frontend'],
  },
  sql: {
    label: 'Relational Database Engineering & SQL',
    short: 'Database Systems',
    route: '/sql',
    idPrefix: 'CS-SQL',
    seed: 110,
    prereq: ['frontend'],
  },
  pythonexpert: {
    label: 'Advanced Python: Metaprogramming & AsyncIO',
    short: 'Advanced Python',
    route: '/pythonexpert',
    idPrefix: 'CS-PYX',
    seed: 40,
    prereq: ['python'],
  },
  'ai-fundamentals': {
    label: 'Foundations of AI & Neural Models',
    short: 'AI Foundations',
    route: '/ai-fundamentals',
    idPrefix: 'CS-AI',
    seed: 130,
  },
  
  'intermediate-ai': {
    label: 'Applied Generative AI & Fine-Tuning',
    short: 'Applied GenAI',
    route: '/intermediate-ai',
    idPrefix: 'CS-AIIN',
    seed: 85,
    prereq: ['ai-fundamentals'],
  },

  'advanced-ai': {
    label: 'Autonomous AI Agents & Production Systems',
    short: 'Advanced AI',
    route: '/advanced-ai',
    idPrefix: 'CS-AIEX',
    seed: 95,
    prereq: ['intermediate-ai'],
  },

  three3d: {
    label: 'Interactive 3D Graphics & WebGL',
    short: '3D WebGL',
    route: '/three3d',
    idPrefix: 'CS-3D',
    seed: 120,
    prereq: ['frontend'],
  },
  java: {
    label: 'Enterprise Java & Object Architecture',
    short: 'Enterprise Java',
    route: '/java',
    idPrefix: 'CS-JV',
    seed: 20,
  },
  javaexpert: {
    label: 'Advanced Java Systems & JVM Internals',
    short: 'JVM Architecture',
    route: '/java-expert',
    idPrefix: 'CS-JVX',
    seed: 10,
    prereq: ['java'],
  },
  cpp: {
    label: 'Modern C++ Engineering & RAII',
    short: 'Modern C++',
    route: '/cpp',
    idPrefix: 'CS-CPP',
    seed: 95,
  },
  cppexpert: {
    label: 'High-Performance C++ & Metaprogramming',
    short: 'Advanced C++',
    route: '/cpp/expert',
    idPrefix: 'CS-CPPX',
    seed: 35,
    prereq: ['cpp'],
  },
  c: {
    label: 'Systems Programming in C',
    short: 'Systems C',
    route: '/c',
    idPrefix: 'CS-C',
    seed: 10,
  },
  cx: {
    label: 'Advanced Low-Level Systems & Memory',
    short: 'Low-Level C',
    route: '/c-expert',
    idPrefix: 'CS-CX',
    seed: 10,
    prereq: ['c'],
  },
  cyber: {
    label: 'Cyber Security & Ethical Hacking',
    short: 'Cyber Security',
    route: '/cyber',
    idPrefix: 'CS-SEC',
    seed: 85,
    prereq: ['networking'],
  },
};


let mem: Enrollment[] = [];
let counts: Partial<Record<TrackId, number>> = {};
let currentUserId: string | null = null;
let currentStudentId: string | null = null;

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
/**
 * Timeout wrapper for Supabase RPC calls to prevent indefinite UI hangs.
 */
async function callRpcWithTimeout(fnName: string, params: Record<string, any>, timeoutMs = 20000): Promise<any> {
  let timeoutId: number | undefined;

  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = window.setTimeout(() => reject(new Error('TIMEOUT')), timeoutMs);
  });

  try {
    const result = await Promise.race([
      supabase.rpc(fnName as any, params),
      timeoutPromise
    ]);
    window.clearTimeout(timeoutId); // Clear the timer if DB succeeds
    return result;
  } catch (err) {
    window.clearTimeout(timeoutId); // Clear the timer if DB fails
    throw err;
  }
}

/**
 * Reads the authoritative row for a track straight from the table.
 * Used to confirm whether a slow/timed-out RPC actually applied.
 */
async function verifyServerStatus(track: TrackId): Promise<EnrollmentStatus | null> {
  if (!currentUserId) return null;
  try {
    const { data } = await supabase
      .from('enrollments')
      .select('status')
      .eq('user_id', currentUserId)
      .eq('track', track)
      .maybeSingle();
    const s = (data as { status?: string } | null)?.status?.toLowerCase();
    return (s as EnrollmentStatus) || null;
  } catch {
    return null;
  }
}


export async function hydrateEnrollments(
  userId: string | null,
  studentId?: string | null
): Promise<void> {
  currentUserId = userId;
  currentStudentId = studentId || null;
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
        // --- 24-hour cache for global track_stats (saves DB reads) ---
    const statsCacheKey = 'codesage:track_stats_cache';
    const statsTimeKey = 'codesage:track_stats_time';
    const dayMs = 24 * 60 * 60 * 1000;
    
    let cachedStats: any[] | null = null;
    const lastStatsTime = Number(localStorage.getItem(statsTimeKey) || 0);
    if (Date.now() - lastStatsTime < dayMs) {
      try { cachedStats = JSON.parse(localStorage.getItem(statsCacheKey) || '[]'); } catch { /* ignore */ }
    }

    const [{ data: enr }, { data: fetchedStats }] = await Promise.all([
      supabase.from('enrollments').select('track, status, enrolled_at').eq('user_id', userId),
      cachedStats ? Promise.resolve({ data: cachedStats }) : supabase.from('track_stats').select('track, enrolled_count'),
    ]);

    const stats = fetchedStats || [];

    // Save to cache if we just fetched fresh data
    if (!cachedStats) {
      try {
        localStorage.setItem(statsCacheKey, JSON.stringify(stats));
        localStorage.setItem(statsTimeKey, String(Date.now()));
      } catch { /* ignore */ }
    }

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
        studentId: currentStudentId || undefined,
      }));

    counts = {};
    ((stats || []) as { track: string; enrolled_count: number }[]).forEach(
      s => {
        if (VALID_TRACK_IDS.has(s.track)) {
          counts[s.track as TrackId] = s.enrolled_count;
        }
      }
    );

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
        try {
          void supabase.rpc('update_enrollment_status', {
            _track: e.track,
            _status: 'paused',
          });
        } catch {
          /* noop */
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
  // Baseline community size + real enrolled learners from the database.
  const seed = TRACK_META[track]?.seed ?? 0;
  const server = counts[track] ?? 0;
  return seed + server;
}


export async function enroll(track: TrackId, studentId?: string): Promise<Enrollment> {
  if (!isActive(track) && activeCount() >= 2) {
    throw new Error(
      'Action restricted: Maximum limit of 2 active courses reached.'
    );
  }

  const assignedStudentId = studentId || currentStudentId || undefined;
  const existing = mem.find(e => e.track === track);
  const oldStatus = existing?.status;
  const wasCounted = !!existing && existing.status !== 'ended';

  if (existing) {
    existing.status = 'active';
    if (assignedStudentId) existing.studentId = assignedStudentId;
  } else {
    mem.push({ track, status: 'active', enrolledAt: Date.now(), studentId: assignedStudentId });
  }

  if (!wasCounted) {
    counts[track] = (counts[track] ?? 0) + 1;
  }
  emit();

  if (currentUserId) {

    try {
      // enroll_track upserts (ON CONFLICT DO UPDATE status='active'), so it is
      // safe whether or not a row already exists. Relying on the local cache to
      // pick the RPC was the source of the "stuck validating / timeout" bug:
      // a stale cached row made us call update_enrollment_status for a track
      // that had no server row at all.
      const { error } = await callRpcWithTimeout('enroll_track', { _track: track });

      if (error) throw error;

      // Update local and cached stats count without firing a redundant database select
      const statsCacheKey = 'codesage:track_stats_cache';
      try {
        const cached = JSON.parse(localStorage.getItem(statsCacheKey) || '[]');
        if (Array.isArray(cached)) {
          const item = cached.find((s: any) => s.track === track);
          if (item) item.enrolled_count = Math.max(item.enrolled_count || 0, counts[track] || 0);
          localStorage.setItem(statsCacheKey, JSON.stringify(cached));
        }
      } catch { /* ignore */ }
    } catch (err) {
      // A timeout does not always mean failure — the write may have landed.
      // Ask the server what the truth is before rolling the UI back.
      const serverStatus = await verifyServerStatus(track);
      if (serverStatus === 'active') {
        emit();
        return (
          mem.find(e => e.track === track) || {
            track,
            status: 'active',
            enrolledAt: Date.now(),
          }
        );
      }

      if (existing) {
        if (oldStatus) existing.status = oldStatus;
      } else {
        mem = mem.filter(e => e.track !== track);
      }
      if (!wasCounted) {
        counts[track] = Math.max(0, (counts[track] ?? 1) - 1);
      }
      emit();
      throw new Error(
        (err as Error)?.message === 'TIMEOUT'
          ? 'The server took too long to respond. Check your connection and try again.'
          : (err as Error)?.message || 'Could not start this track. Please try again.'
      );
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

  if (currentUserId) {

    try {
      const { error } = await callRpcWithTimeout('update_enrollment_status', {
        _track: track,
        _status: status,
      });
      if (error) throw error;
    } catch (err) {
      // Confirm with the server before undoing the optimistic change.
      const serverStatus = await verifyServerStatus(track);
      if (serverStatus === status) {
        emit();
        return;
      }
      e.status = prevStatus;
      emit();
      throw new Error(
        (err as Error)?.message === 'TIMEOUT'
          ? 'The server took too long to respond. Check your connection and try again.'
          : (err as Error)?.message || 'Could not update this track. Please try again.'
      );
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

export async function markTrackCompleted(track: TrackId): Promise<void> {
  const e = mem.find(x => x.track === track);
  if (e) {
    e.status = 'completed';
    emit();
  }
  if (currentUserId) {
    try {
      await supabase.rpc('update_enrollment_status', {
        _track: track,
        _status: 'completed',
      });
    } catch {
      try {
        await supabase
          .from('enrollments')
          .update({ status: 'completed' })
          .eq('user_id', currentUserId)
          .eq('track', track);
      } catch {
        /* ignore */
      }
    }
  }
}

export function isTrackStatusCompleted(track: TrackId): boolean {
  const e = getEnrollment(track);
  return !!e && e.status?.toLowerCase() === 'completed';
}

export function onEnrollmentChange(cb: () => void): () => void {
  const handler = () => cb();
  window.addEventListener(EVENT, handler);
  return () => window.removeEventListener(EVENT, handler);
}
