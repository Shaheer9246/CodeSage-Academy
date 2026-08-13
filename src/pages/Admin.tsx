import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, ShieldAlert, Search, RefreshCw, Users, Flame, Zap,
  GraduationCap, ChevronDown, ChevronRight, Mail, Calendar, Database, Trash2,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { TRACK_META, type TrackId } from '@/lib/enrollment';
import {
  TRACK_LESSON_IDS, TRACK_LESSON_LABELS, LESSON_TRACK_KEYS,
  type LessonTrackKey,
} from '@/data/lessonIndex';

/* -------------------------------------------------------------------------- */
/* Types                                                                       */
/* -------------------------------------------------------------------------- */

interface AdminEnrollment {
  track: string;
  status: string;
  enrolled_at: string;
}

interface AdminUser {
  id: string;
  email: string | null;
  username: string | null;
  name: string | null;
  student_id: string | null;
  studying: string | null;
  has_job: string | null;
  dob: string | null;
  goal: string | null;
  experience_level: string | null;
  xp: number | null;
  level: number | null;
  sage_coins: number | null;
  streak_count: number | null;
  last_active_date: string | null;
  badges: string[] | null;
  unlocked_sections: string[] | null;
  promo_codes: string[] | null;
  completed_lessons: string[] | null;
  completed_tests: string[] | null;
  lessons_done: number;
  tests_done: number;
  created_at: string;
  joined_at: string | null;
  last_sign_in_at: string | null;
  email_confirmed_at: string | null;
  enrollments: AdminEnrollment[];
  suggestions_count: number;
}

const PW_KEY = 'codesage_admin_pw';

const fmt = (d?: string | null) =>
  d ? new Date(d).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : '—';

const fmtTime = (d?: string | null) =>
  d ? new Date(d).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : 'never';

const trackLabel = (t: string) => TRACK_META[t as TrackId]?.label ?? t;

/* -------------------------------------------------------------------------- */

export default function Admin() {
  const navigate = useNavigate();
  const [authed, setAuthed] = useState(false);
  const [rows, setRows] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => { document.title = 'Admin Console · CodeSage'; }, []);

  const load = async () => {
    setLoading(true); setError('');
    const { data, error: err } = await supabase.rpc('admin_list_users');
    setLoading(false);
    if (err) { setError('Admin access required for this account.'); setAuthed(false); return; }
    setRows((data as unknown as AdminUser[]) || []);
    setAuthed(true);
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);


  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(r =>
      [r.email, r.username, r.name, r.student_id].some(v => (v || '').toLowerCase().includes(q)),
    );
  }, [rows, query]);

  const totals = useMemo(() => ({
    users: rows.length,
    lessons: rows.reduce((a, r) => a + (r.lessons_done || 0), 0),
    xp: rows.reduce((a, r) => a + (r.xp || 0), 0),
    active: rows.filter(r => r.enrollments.some(e => e.status === 'active')).length,
  }), [rows]);

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDeleteUser = async (userId: string, userIdentifier: string) => {
    const confirmed = window.confirm(`Are you sure you want to delete user "${userIdentifier}"? This cannot be undone.`);
    if (!confirmed) return;

    setDeletingId(userId);
    const { error: err } = await supabase.rpc('admin_delete_user', {
      _password: pw,
      _user_id: userId,
    });
    setDeletingId(null);

    if (err) {
      alert(`Failed to delete user: ${err.message}`);
      return;
    }

    setRows(prev => prev.filter(u => u.id !== userId));
    if (openId === userId) setOpenId(null);
  };

  /* ---------------------------- Access gate ---------------------------- */
  if (!authed) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-5">
        <div className="w-full max-w-sm bg-card/40 border border-border/50 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-primary" />
            <h1 className="font-display text-lg font-bold">Admin Console</h1>
          </div>
          <p className="text-xs text-muted-foreground font-mono">
            This console is restricted to accounts with the admin role.
          </p>
          {error && <p className="text-xs text-destructive">{error}</p>}
          <button
            type="button"
            onClick={() => load()}
            disabled={loading}
            className="w-full bg-primary text-primary-foreground rounded-lg py-2.5 text-sm font-bold disabled:opacity-50"
          >
            {loading ? 'checking...' : 'retry()'}
          </button>
          <button type="button" onClick={() => navigate('/dashboard')}
            className="w-full text-xs text-muted-foreground hover:text-primary">
            back to dashboard
          </button>
        </div>
      </div>
    );
  }


  /* ------------------------------- Console ------------------------------- */
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-6">
        <button onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-xs font-mono text-muted-foreground hover:text-primary mb-5">
          <ArrowLeft className="w-3.5 h-3.5" /> Dashboard
        </button>

        <div className="flex items-center justify-between mb-5 gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <ShieldAlert className="w-5 h-5 text-primary flex-shrink-0" />
            <h1 className="font-display text-xl font-bold truncate">Admin Console</h1>
          </div>
          <button onClick={() => load(pw)} disabled={loading}
            className="flex items-center gap-1.5 text-xs bg-secondary/50 border border-border/40 rounded-lg px-3 py-2 hover:border-primary/40">
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mb-5">
          {[
            { icon: Users, label: 'students', value: totals.users },
            { icon: GraduationCap, label: 'lessons in DB', value: totals.lessons },
            { icon: Zap, label: 'total XP', value: totals.xp },
            { icon: Flame, label: 'active tracks', value: totals.active },
          ].map(s => (
            <div key={s.label} className="bg-card/40 border border-border/40 rounded-xl p-3">
              <s.icon className="w-4 h-4 text-primary mb-1.5" />
              <p className="text-lg font-bold font-mono">{s.value}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="search name, email, username or student ID..."
            className="w-full bg-black/25 border border-border/50 rounded-lg pl-9 pr-3 py-2.5 text-sm font-mono focus:outline-none focus:border-primary/60"
          />
        </div>

        {error && <p className="text-xs text-destructive mb-3">{error}</p>}

        {/* Users */}
        <div className="space-y-2">
          {filtered.map(u => {
            const open = openId === u.id;
            const done = new Set(u.completed_lessons || []);
            const perTrack = LESSON_TRACK_KEYS
              .map((k: LessonTrackKey) => {
                const ids = TRACK_LESSON_IDS[k] || [];
                const n = ids.filter(id => done.has(id)).length;
                return { key: k, label: TRACK_LESSON_LABELS[k], n, total: ids.length };
              })
              .filter(t => t.n > 0);

            return (
              <div key={u.id} className="bg-card/40 border border-border/40 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenId(open ? null : u.id)}
                  className="w-full flex items-center gap-3 px-3.5 py-3 text-left hover:bg-secondary/30"
                >
                  {open ? <ChevronDown className="w-4 h-4 text-primary flex-shrink-0" />
                        : <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold truncate">{u.name || u.username || 'Unnamed'}</p>
                    <p className="text-[11px] text-muted-foreground font-mono truncate">{u.email || 'no email'}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs font-mono text-primary">{u.lessons_done} lessons</p>
                    <p className="text-[10px] text-muted-foreground font-mono">{u.xp || 0} XP · lvl {u.level || 1}</p>
                  </div>
                </button>

                {open && (
                  <div className="border-t border-border/30 px-3.5 py-3 space-y-3 text-xs">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                      <Field icon={Mail} label="Email" value={u.email || '—'} />
                      <Field label="Student ID" value={u.student_id || '—'} />
                      <Field label="Username" value={u.username || '—'} />
                      <Field icon={Calendar} label="Joined" value={fmt(u.joined_at || u.created_at)} />
                      <Field label="Last sign-in" value={fmtTime(u.last_sign_in_at)} />
                      <Field label="Email confirmed" value={u.email_confirmed_at ? 'yes' : 'no'} />
                      <Field label="Date of birth" value={u.dob || '—'} />
                      <Field label="Studying" value={u.studying || '—'} />
                      <Field label="Has a job" value={u.has_job || '—'} />
                      <Field label="Experience" value={u.experience_level || '—'} />
                      <Field label="Goal" value={u.goal || '—'} />
                      <Field label="Streak" value={`${u.streak_count || 0} days`} />
                      <Field label="Sage coins" value={String(u.sage_coins || 0)} />
                      <Field label="Suggestions posted" value={String(u.suggestions_count)} />
                      <Field label="Tests passed" value={String(u.tests_done)} />
                      <Field label="Last active" value={u.last_active_date ? fmtTime(u.last_active_date) : '—'} />
                    </div>

                    <Block title="Enrollments">
                      {u.enrollments.length === 0 ? <Muted>no tracks enrolled</Muted> : (
                        <div className="flex flex-wrap gap-1.5">
                          {u.enrollments.map(e => (
                            <span key={e.track}
                              className={`px-2 py-1 rounded-md border font-mono text-[10px] ${
                                e.status === 'active' ? 'border-primary/40 text-primary bg-primary/10'
                                : e.status === 'paused' ? 'border-amber-400/40 text-amber-400 bg-amber-400/10'
                                : 'border-border/50 text-muted-foreground'
                              }`}>
                              {trackLabel(e.track)} · {e.status} · {fmt(e.enrolled_at)}
                            </span>
                          ))}
                        </div>
                      )}
                    </Block>

                    <Block title={`Lessons recorded in the database (${u.lessons_done})`}>
                      {perTrack.length === 0 ? <Muted>nothing recorded yet</Muted> : (
                        <div className="space-y-1.5">
                          {perTrack.map(t => (
                            <div key={t.key} className="flex items-center gap-2">
                              <span className="w-40 truncate text-muted-foreground">{t.label}</span>
                              <div className="flex-1 h-1.5 bg-border/40 rounded-full overflow-hidden">
                                <div className="h-full bg-primary" style={{ width: `${(t.n / Math.max(1, t.total)) * 100}%` }} />
                              </div>
                              <span className="font-mono text-[10px] w-14 text-right">
                                {t.n}/{t.total}{t.n >= t.total ? ' ✓' : ''}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </Block>

                    <Block title="Raw lesson IDs">
                      <p className="font-mono text-[10px] text-muted-foreground break-all leading-relaxed">
                        {(u.completed_lessons || []).join(', ') || '—'}
                      </p>
                    </Block>

                    <Block title="Unlocked sections / promo codes / badges">
                      <p className="font-mono text-[10px] text-muted-foreground break-all">
                        sections: {(u.unlocked_sections || []).join(', ') || '—'}<br />
                        promos: {(u.promo_codes || []).join(', ') || '—'}<br />
                        badges: {(u.badges || []).join(', ') || '—'}<br />
                        tests: {(u.completed_tests || []).join(', ') || '—'}
                      </p>
                    </Block>

                    <div className="flex items-center justify-between pt-2 border-t border-border/20">
                      <p className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-mono">
                        <Database className="w-3 h-3" /> user id: {u.id}
                      </p>
                      <button
                        type="button"
                        disabled={deletingId === u.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteUser(u.id, u.name || u.email || u.id);
                        }}
                        className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono text-destructive hover:bg-destructive/10 border border-destructive/30 rounded-md transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="w-3 h-3" />
                        {deletingId === u.id ? 'deleting...' : 'delete user'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          {!loading && filtered.length === 0 && (
            <p className="text-center text-xs text-muted-foreground py-10">no students match that search</p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------ Small parts ------------------------------ */

function Field({ label, value, icon: Icon }: { label: string; value: string; icon?: React.ElementType }) {
  return (
    <div className="min-w-0">
      <p className="text-[9px] uppercase tracking-wide text-muted-foreground flex items-center gap-1">
        {Icon && <Icon className="w-2.5 h-2.5" />}{label}
      </p>
      <p className="text-[11px] font-mono truncate" title={value}>{value}</p>
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-black/20 border border-border/30 rounded-lg p-2.5">
      <p className="text-[9px] uppercase tracking-wide text-muted-foreground mb-1.5">{title}</p>
      {children}
    </div>
  );
}

const Muted = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[11px] text-muted-foreground">{children}</p>
);
