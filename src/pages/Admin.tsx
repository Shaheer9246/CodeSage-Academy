import { useEffect, useMemo, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, ShieldAlert, Search, RefreshCw, Users, Flame, Zap,
  GraduationCap, ChevronDown, ChevronRight, Mail, Calendar, Database, Trash2,
  Bell, MessageSquare, Send, Edit2, Reply, Check, X, ShieldCheck,
  BookOpen, Award, Briefcase, Target, Layers, FileCode, CheckCircle2,
  KeyRound, Tag, Clock, Pause, Play
} from 'lucide-react';
import { toast } from 'sonner';
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

interface Announcement {
  id: string;
  title: string;
  body: string;
  created_at: string;
}

interface AdminSuggestion {
  id: string;
  username: string;
  text: string;
  reply: string | null;
  reply_at: string | null;
  created_at: string;
  updated_at: string;
  upvotes: number;
  downvotes: number;
}

const fmt = (d?: string | null) =>
  d ? new Date(d).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : '—';

const fmtTime = (d?: string | null) =>
  d ? new Date(d).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : 'never';

const trackLabel = (t: string) => TRACK_META[t as TrackId]?.label ?? t;

/* -------------------------------------------------------------------------- */

export default function Admin() {
  const navigate = useNavigate();
  const [authed, setAuthed] = useState(false);
  const [activeTab, setActiveTab] = useState<'users' | 'announcements' | 'suggestions'>('users');

  // --- Users State ---
  const [rows, setRows] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);
  const PAGE_SIZE = 50;
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [registryLessonCount, setRegistryLessonCount] = useState(454);
  const [search, setSearch] = useState('');
  const [inactiveFilter, setInactiveFilter] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // --- Helper to calculate user last active date and inactivity duration in days ---
  const getUserLastActiveDate = useCallback((u: AdminUser): Date | null => {
    const ts = u.last_sign_in_at || (u.last_active_date ? `${u.last_active_date}T00:00:00Z` : null) || u.joined_at || u.created_at;
    if (!ts) return null;
    const d = new Date(ts);
    return isNaN(d.getTime()) ? null : d;
  }, []);

  const getInactiveDays = useCallback((u: AdminUser): number | null => {
    const d = getUserLastActiveDate(u);
    if (!d) return null;
    const diffMs = Date.now() - d.getTime();
    return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
  }, [getUserLastActiveDate]);

  // --- Announcements State ---
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(false);
  const [newAnnTitle, setNewAnnTitle] = useState('');
  const [newAnnBody, setNewAnnBody] = useState('');
  const [postingAnn, setPostingAnn] = useState(false);
  const [editingAnnId, setEditingAnnId] = useState<string | null>(null);
  const [editAnnTitle, setEditAnnTitle] = useState('');
  const [editAnnBody, setEditAnnBody] = useState('');
  const [savingAnn, setSavingAnn] = useState(false);

  // --- Suggestions State ---
  const [suggestions, setSuggestions] = useState<AdminSuggestion[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [replyOpenId, setReplyOpenId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);
  const [editSuggId, setEditSuggId] = useState<string | null>(null);
  const [editSuggText, setEditSuggText] = useState('');
  const [savingSugg, setSavingSugg] = useState(false);

  useEffect(() => { document.title = 'Admin Console · CodeSage'; }, []);

  /* ---------------------------- Load Users ---------------------------- */
  const load = async (opts?: { search?: string; page?: number; inactiveDays?: number | null }) => {
    const s = opts?.search ?? search;
    const p = opts?.page ?? page;
    const inact = opts?.inactiveDays !== undefined ? opts.inactiveDays : inactiveFilter;
    setLoading(true); setError('');

    let listRes: any;
    let countRes: any;

    try {
      // 1. Try invoking with _inactive_days argument if backend supports it
      const [primaryList, primaryCount, regRes] = await Promise.all([
        (supabase.rpc as any)('admin_list_users', {
          _search: s || null,
          _limit: PAGE_SIZE,
          _offset: p * PAGE_SIZE,
          _inactive_days: inact,
        }),
        (supabase.rpc as any)('admin_user_count', {
          _search: s || null,
          _inactive_days: inact,
        }),
        supabase.from('lesson_registry').select('*', { count: 'exact', head: true }),
      ]);

      listRes = primaryList;
      countRes = primaryCount;

      // 2. Fallback to 3-arg version if Supabase SQL hasn't been upgraded yet
      if (listRes?.error && listRes.error.message?.includes('Could not find the function')) {
        const [fallbackList, fallbackCount] = await Promise.all([
          supabase.rpc('admin_list_users', {
            _search: s || null,
            _limit: PAGE_SIZE,
            _offset: p * PAGE_SIZE,
          }),
          supabase.rpc('admin_user_count', {
            _search: s || null,
          }),
        ]);
        listRes = fallbackList;
        countRes = fallbackCount;
      }

      if (regRes.count !== null && regRes.count !== undefined) {
        setRegistryLessonCount(regRes.count);
      }
    } catch (e: any) {
      setError(e.message || 'Failed to load user roster');
      setLoading(false);
      return;
    }

    setLoading(false);
    if (listRes?.error) {
      setError(listRes.error.message?.includes('Admin') ? 'Admin access required for this account.' : listRes.error.message);
      setAuthed(false);
      return;
    }

    let loadedRows = (listRes.data as unknown as AdminUser[]) || [];

    // Client-side fallback filter if database RPC didn't filter it natively
    if (inact !== null) {
      loadedRows = loadedRows.filter(u => {
        const days = getInactiveDays(u);
        return days !== null && days >= inact;
      });
    }

    setRows(loadedRows);
    if (!countRes?.error && countRes?.data !== null) {
      setTotal(inact !== null ? loadedRows.length : (Number(countRes.data) || 0));
    }
    setAuthed(true);
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  // Debounced server-side search
  useEffect(() => {
    const t = window.setTimeout(() => {
      if (query.trim() === search) return;
      setSearch(query.trim());
      setPage(0);
      void load({ search: query.trim(), page: 0 });
    }, 400);
    return () => clearTimeout(t);
    /* eslint-disable-next-line */
  }, [query]);

  const totals = useMemo(() => {
    const inactive7d = rows.filter(r => {
      const d = getInactiveDays(r);
      return d !== null && d >= 7;
    }).length;

    return {
      users: total,
      registryLessons: registryLessonCount,
      lessonsDone: rows.reduce((a, r) => a + (r.lessons_done || 0), 0),
      xp: rows.reduce((a, r) => a + (r.xp || 0), 0),
      activeTracks: rows.reduce((acc, r) => acc + ((r.enrollments || []).filter(e => e.status === 'active').length), 0),
      inactive7d,
    };
  }, [rows, total, registryLessonCount, getInactiveDays]);

  const handleDeleteUser = async (userId: string, userIdentifier: string) => {
    const confirmed = window.confirm(`Are you sure you want to delete user "${userIdentifier}"? This cannot be undone.`);
    if (!confirmed) return;

    setDeletingId(userId);
    const { data: { user: currentUser } } = await supabase.auth.getUser();

    const { error: err } = await supabase.rpc('admin_delete_user', {
      _user_id: userId,
    });
    setDeletingId(null);

    if (err) {
      alert(`Failed to delete user: ${err.message}`);
      return;
    }

    if (currentUser && currentUser.id === userId) {
      await supabase.auth.signOut();
      localStorage.clear();
      navigate('/auth');
      return;
    }

    setRows(prev => prev.filter(u => u.id !== userId));
    if (openId === userId) setOpenId(null);
  };

  const [updatingTrack, setUpdatingTrack] = useState<string | null>(null);

  const handleUpdateEnrollmentStatus = async (userId: string, track: string, newStatus: 'active' | 'paused' | 'ended') => {
    setUpdatingTrack(`${userId}-${track}`);
    try {
      // 1. Attempt admin RPC first
      const { error: rpcErr } = await supabase.rpc('admin_update_user_enrollment' as any, {
        _user_id: userId,
        _track: track,
        _status: newStatus,
      });

      if (rpcErr) {
        // Fallback to direct table update if RPC not yet created
        const { error: directErr } = await supabase
          .from('enrollments')
          .update({ status: newStatus })
          .eq('user_id', userId)
          .eq('track', track);
        if (directErr) throw directErr;
      }

      setRows(prev => prev.map(u => {
        if (u.id !== userId) return u;
        const updatedEnrollments = (u.enrollments || []).map(e => e.track === track ? { ...e, status: newStatus } : e);
        return { ...u, enrollments: updatedEnrollments };
      }));

      toast.success(`Track "${trackLabel(track)}" updated to "${newStatus}"`);
    } catch (err: any) {
      console.error('Failed to update track status', err);
      toast.error(err?.message || 'Failed to update track status');
    } finally {
      setUpdatingTrack(null);
    }
  };

  /* ---------------------- Load Announcements ---------------------- */
  const loadAnnouncements = useCallback(async () => {
    setLoadingAnnouncements(true);
    const { data, error: err } = await supabase
      .from('announcements')
      .select('id, title, body, created_at')
      .order('created_at', { ascending: false });
    setLoadingAnnouncements(false);
    if (!err && data) {
      setAnnouncements(data as Announcement[]);
    }
  }, []);

  const handlePostAnnouncement = async () => {
    if (!newAnnTitle.trim() || !newAnnBody.trim()) {
      toast.error('Title and message cannot be empty');
      return;
    }
    setPostingAnn(true);
    const { error: err } = await supabase.rpc('post_announcement', {
      _title: newAnnTitle.trim().slice(0, 120),
      _body: newAnnBody.trim().slice(0, 2000),
    });
    setPostingAnn(false);
    if (err) {
      toast.error(`Post failed: ${err.message}`);
      return;
    }
    toast.success('Announcement broadcasted to all users');
    setNewAnnTitle('');
    setNewAnnBody('');
    localStorage.removeItem('codesage_inbox_announcements_time');
    loadAnnouncements();
  };

  const handleSaveAnnouncementEdit = async (id: string) => {
    if (!editAnnTitle.trim() || !editAnnBody.trim()) {
      toast.error('Title and body are required');
      return;
    }
    setSavingAnn(true);
    // Call RPC or direct update
    const { error: err } = await supabase
      .from('announcements')
      .update({
        title: editAnnTitle.trim().slice(0, 120),
        body: editAnnBody.trim().slice(0, 2000),
      })
      .eq('id', id);
    setSavingAnn(false);
    if (err) {
      toast.error(`Update failed: ${err.message}`);
      return;
    }
    toast.success('Announcement updated');
    setEditingAnnId(null);
    localStorage.removeItem('codesage_inbox_announcements_time');
    loadAnnouncements();
  };

  const handleDeleteAnnouncement = async (id: string) => {
    if (!window.confirm('Delete this announcement? This will remove it for all users.')) return;
    let err = (await (supabase.rpc as any)('admin_delete_announcement', { _id: id })).error;
    if (err) {
      const direct = await supabase.from('announcements').delete().eq('id', id);
      err = direct.error;
    }
    if (err) {
      toast.error(`Delete failed: ${err.message}`);
      return;
    }
    toast.success('Announcement deleted');
    setAnnouncements(prev => prev.filter(a => a.id !== id));
    localStorage.removeItem('codesage_inbox_announcements_time');
  };

  /* ---------------------- Load Suggestions ---------------------- */
  const loadSuggestions = useCallback(async () => {
    setLoadingSuggestions(true);
    const { data, error: err } = await (supabase as any)
      .from('suggestions_public')
      .select('*')
      .order('created_at', { ascending: false });
    setLoadingSuggestions(false);
    if (!err && data) {
      setSuggestions(data as AdminSuggestion[]);
    }
  }, []);

  const handleReplySuggestion = async (id: string) => {
    if (!replyText.trim()) return;
    setSubmittingReply(true);
    const { error: err } = await supabase.rpc('reply_suggestion', {
      _id: id,
      _reply: replyText.trim(),
    });
    setSubmittingReply(false);
    if (err) {
      toast.error(`Reply failed: ${err.message}`);
      return;
    }
    toast.success('Official reply posted');
    setReplyOpenId(null);
    setReplyText('');
    localStorage.removeItem('codesage_suggestions_feed_time');
    loadSuggestions();
  };

  const handleEditSuggestion = async (id: string) => {
    if (!editSuggText.trim()) return;
    setSavingSugg(true);
    const { error: err } = await supabase.rpc('admin_edit_suggestion', {
      _id: id,
      _text: editSuggText.trim(),
    });
    setSavingSugg(false);
    if (err) {
      toast.error(`Edit failed: ${err.message}`);
      return;
    }
    toast.success('Suggestion modified');
    setEditSuggId(null);
    setEditSuggText('');
    localStorage.removeItem('codesage_suggestions_feed_time');
    loadSuggestions();
  };

  const handleDeleteSuggestion = async (id: string) => {
    if (!window.confirm('Permanently delete this suggestion?')) return;
    const { error: err } = await supabase.rpc('admin_delete_suggestion', {
      _id: id,
    });
    if (err) {
      toast.error(`Delete failed: ${err.message}`);
      return;
    }
    toast.success('Suggestion removed');
    setSuggestions(prev => prev.filter(s => s.id !== id));
    localStorage.removeItem('codesage_suggestions_feed_time');
  };

  // Switch tab triggers data load
  useEffect(() => {
    if (!authed) return;
    if (activeTab === 'announcements' && announcements.length === 0) {
      loadAnnouncements();
    } else if (activeTab === 'suggestions' && suggestions.length === 0) {
      loadSuggestions();
    }
  }, [activeTab, authed, announcements.length, suggestions.length, loadAnnouncements, loadSuggestions]);

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
            <h1 className="font-display text-xl font-bold truncate">Admin Command Center</h1>
          </div>
          <button onClick={() => {
            if (activeTab === 'users') load();
            else if (activeTab === 'announcements') loadAnnouncements();
            else if (activeTab === 'suggestions') loadSuggestions();
          }} disabled={loading || loadingAnnouncements || loadingSuggestions}
            className="flex items-center gap-1.5 text-xs bg-secondary/50 border border-border/40 rounded-lg px-3 py-2 hover:border-primary/40">
            <RefreshCw className={`w-3.5 h-3.5 ${loading || loadingAnnouncements || loadingSuggestions ? 'animate-spin' : ''}`} /> Refresh
          </button>
        </div>

        {/* Global Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 mb-6">
          {[
            { icon: Users, label: 'registered students', value: totals.users },
            { icon: Database, label: 'curriculum lessons', value: totals.registryLessons },
            { icon: GraduationCap, label: 'lessons completed (paged)', value: totals.lessonsDone },
            { icon: Zap, label: 'student XP (paged)', value: totals.xp.toLocaleString() },
            { icon: Clock, label: 'inactive ≥ 7d (paged)', value: totals.inactive7d },
          ].map(s => (
            <div key={s.label} className="bg-card/40 border border-border/40 rounded-xl p-3">
              <s.icon className="w-4 h-4 text-primary mb-1.5" />
              <p className="text-lg font-bold font-mono">{s.value}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Nav Tabs */}
        <div className="flex border-b border-border/40 gap-4 mb-6">
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 pb-3 px-1 text-sm font-semibold transition-colors border-b-2 ${
              activeTab === 'users'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Users className="w-4 h-4" /> Users Management ({total})
          </button>
          <button
            onClick={() => setActiveTab('announcements')}
            className={`flex items-center gap-2 pb-3 px-1 text-sm font-semibold transition-colors border-b-2 ${
              activeTab === 'announcements'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Bell className="w-4 h-4" /> Announcements Hub
          </button>
          <button
            onClick={() => setActiveTab('suggestions')}
            className={`flex items-center gap-2 pb-3 px-1 text-sm font-semibold transition-colors border-b-2 ${
              activeTab === 'suggestions'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <MessageSquare className="w-4 h-4" /> Suggestions & Feedback
          </button>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: USERS                                                              */}
        {/* ========================================================================= */}
        {activeTab === 'users' && (
          <div>
            <div className="flex flex-col sm:flex-row gap-2.5 mb-4">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="search name, email, username or student ID..."
                  className="w-full bg-black/25 border border-border/50 rounded-lg pl-9 pr-3 py-2.5 text-sm font-mono focus:outline-none focus:border-primary/60"
                />
              </div>

              {/* Inactivity Duration Filter */}
              <div className="flex items-center gap-2">
                <div className="relative flex items-center">
                  <Clock className="w-4 h-4 text-muted-foreground absolute left-3 pointer-events-none" />
                  <select
                    value={inactiveFilter === null ? 'all' : String(inactiveFilter)}
                    onChange={e => {
                      const val = e.target.value === 'all' ? null : Number(e.target.value);
                      setInactiveFilter(val);
                      setPage(0);
                      void load({ search, page: 0, inactiveDays: val });
                    }}
                    className="bg-black/25 border border-border/50 rounded-lg pl-9 pr-8 py-2.5 text-xs font-mono text-foreground focus:outline-none focus:border-primary/60 cursor-pointer appearance-none"
                  >
                    <option value="all">Activity: All Students</option>
                    <option value="1">Inactive ≥ 1 Day</option>
                    <option value="2">Inactive ≥ 2 Days</option>
                    <option value="3">Inactive ≥ 3 Days</option>
                    <option value="7">Inactive ≥ 7 Days (1 Week)</option>
                    <option value="14">Inactive ≥ 14 Days (2 Weeks)</option>
                    <option value="30">Inactive ≥ 30 Days (1 Month)</option>
                    <option value="60">Inactive ≥ 60 Days (2 Months)</option>
                    <option value="90">Inactive ≥ 90 Days (3 Months)</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-muted-foreground absolute right-2.5 pointer-events-none" />
                </div>

                {inactiveFilter !== null && (
                  <button
                    onClick={() => {
                      setInactiveFilter(null);
                      setPage(0);
                      void load({ search, page: 0, inactiveDays: null });
                    }}
                    className="text-xs font-mono text-muted-foreground hover:text-foreground p-2.5 border border-border/40 rounded-lg hover:bg-secondary/40"
                    title="Clear inactivity filter"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {inactiveFilter !== null && (
              <div className="flex items-center justify-between bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2 text-xs font-mono text-amber-300 mb-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Showing students inactive for at least <strong>{inactiveFilter} day{inactiveFilter > 1 ? 's' : ''}</strong></span>
                </div>
                <span className="text-[11px] opacity-80">{rows.length} students matched</span>
              </div>
            )}

            {error && <p className="text-xs text-destructive mb-3">{error}</p>}

            <div className="space-y-2">
              {rows.map(u => {
                const open = openId === u.id;
                const done = new Set(u.completed_lessons || []);
                const perTrack = LESSON_TRACK_KEYS
                  .map((k: LessonTrackKey) => {
                    const ids = TRACK_LESSON_IDS[k] || [];
                    const n = ids.filter(id => done.has(id)).length;
                    return { key: k, label: TRACK_LESSON_LABELS[k], n, total: ids.length };
                  })
                  .filter(t => t.n > 0);
                const daysInactive = getInactiveDays(u);

                return (
                  <div key={u.id} className="bg-card/40 border border-border/40 rounded-xl overflow-hidden">
                    <div
                      onClick={() => setOpenId(open ? null : u.id)}
                      className="flex items-center justify-between p-3.5 cursor-pointer hover:bg-card/60 transition-colors gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {open ? <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" /> : <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />}
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono text-sm font-bold text-foreground truncate">{u.name || u.username || 'Anonymous'}</span>
                            {u.student_id && (
                              <span className="text-[10px] font-mono bg-primary/10 text-primary px-1.5 py-0.5 rounded border border-primary/20">{u.student_id}</span>
                            )}
                            <span className="text-xs text-muted-foreground font-mono truncate">{u.email}</span>
                          </div>
                          <div className="flex items-center gap-2 flex-wrap mt-0.5">
                            {(() => {
                              const activeCount = (u.enrollments || []).filter(e => e.status?.toLowerCase() === 'active').length;
                              const pausedCount = (u.enrollments || []).filter(e => e.status?.toLowerCase() === 'paused').length;
                              const endedCount = (u.enrollments || []).filter(e => ['ended', 'completed'].includes(e.status?.toLowerCase())).length;
                              const totalTracks = u.enrollments?.length || 0;
                              return (
                                <>
                                  <p className="text-[11px] text-muted-foreground font-mono">
                                    lvl {u.level ?? 1} · {u.xp ?? 0} xp · {u.lessons_done} lessons
                                  </p>
                                  <span className="text-[11px] font-mono text-muted-foreground">·</span>
                                  <span className={`text-[11px] font-mono ${activeCount > 2 ? 'text-rose-400 font-bold' : 'text-emerald-400 font-medium'}`}>
                                    {activeCount} active
                                  </span>
                                  {pausedCount > 0 && (
                                    <span className="text-[11px] font-mono text-amber-400/90">
                                      · {pausedCount} paused
                                    </span>
                                  )}
                                  {endedCount > 0 && (
                                    <span className="text-[11px] font-mono text-blue-400/90">
                                      · {endedCount} ended
                                    </span>
                                  )}
                                  {totalTracks > 0 && (
                                    <span className="text-[11px] font-mono text-muted-foreground">
                                      ({totalTracks} total)
                                    </span>
                                  )}
                                  {activeCount > 2 && (
                                    <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-rose-500/15 text-rose-400 border border-rose-500/30">
                                      ⚠ {activeCount} Active (&gt;2 limit)
                                    </span>
                                  )}
                                </>
                              );
                            })()}
                            {daysInactive !== null && (
                              <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono border ${
                                daysInactive === 0
                                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                  : daysInactive <= 2
                                  ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                  : daysInactive <= 7
                                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                  : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                              }`}>
                                {daysInactive === 0 ? '● Active today' : `Inactive ${daysInactive}d`}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteUser(u.id, u.username || u.name || u.email || u.student_id || 'Unknown');
                          }}
                          disabled={deletingId === u.id}
                          className="p-1.5 text-muted-foreground hover:text-destructive rounded hover:bg-destructive/10 transition-colors"
                          title="Delete user"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {open && (
                      <div className="border-t border-border/30 p-4 bg-black/15 space-y-4">
                        {/* 1. Key Metrics & Progress Quick Strip */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
                          <Field label="Level & XP" value={`Lvl ${u.level ?? 1} (${(u.xp ?? 0).toLocaleString()} XP)`} icon={Zap} />
                          <Field label="Sage Coins" value={`${u.sage_coins ?? 0} ◈`} icon={Database} />
                          <Field label="Daily Streak" value={`${u.streak_count ?? 0} days`} icon={Flame} />
                          <Field label="Lessons Done" value={`${u.lessons_done} completed`} icon={GraduationCap} />
                          <Field label="Tests Passed" value={`${u.tests_done} tests`} icon={Award} />
                          <Field label="Suggestions" value={`${u.suggestions_count ?? 0} posted`} icon={MessageSquare} />
                        </div>

                        {/* 2. Onboarding & Personal Profile */}
                        <Block title="Student Profile & Onboarding Background">
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                            <Field label="Full Name" value={u.name || '—'} />
                            <Field label="Username" value={u.username || '—'} />
                            <Field label="Student ID" value={u.student_id || 'Not assigned'} />
                            <Field label="Inactivity" value={daysInactive === null ? 'Unknown' : daysInactive === 0 ? 'Active today' : `${daysInactive} days inactive`} icon={Clock} />
                            <Field label="Email Status" value={u.email_confirmed_at ? '✓ Verified' : 'Pending verification'} icon={Mail} />
                            <Field label="Studying / College" value={u.studying || 'Not specified'} icon={BookOpen} />
                            <Field label="Job / Employment" value={u.has_job || 'Not specified'} icon={Briefcase} />
                            <Field label="Experience Level" value={u.experience_level || 'Beginner'} icon={Target} />
                            <Field label="Date of Birth" value={u.dob || '—'} icon={Calendar} />
                            <Field label="Learning Goal" value={u.goal || 'Not specified'} />
                            <Field label="Account Joined" value={fmt(u.joined_at || u.created_at)} icon={Calendar} />
                            <Field label="Last Active / Sign In" value={fmtTime(u.last_sign_in_at || (u.last_active_date ? `${u.last_active_date}T00:00:00Z` : null))} icon={Mail} />
                            <Field label="Promo Codes" value={u.promo_codes && u.promo_codes.length > 0 ? u.promo_codes.join(', ') : 'None'} icon={Tag} />
                          </div>
                        </Block>

                        {/* 3. Enrolled Tracks */}
                        {(() => {
                          const activeCount = (u.enrollments || []).filter(e => e.status?.toLowerCase() === 'active').length;
                          const pausedCount = (u.enrollments || []).filter(e => e.status?.toLowerCase() === 'paused').length;
                          const endedCount = (u.enrollments || []).filter(e => ['ended', 'completed'].includes(e.status?.toLowerCase())).length;
                          return (
                            <Block title={`Enrolled Tracks (${u.enrollments?.length || 0} total · ${activeCount} active${pausedCount > 0 ? `, ${pausedCount} paused` : ''}${endedCount > 0 ? `, ${endedCount} ended` : ''})`}>
                              {u.enrollments && u.enrollments.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                                  {u.enrollments.map((e, idx) => {
                                    const trackKey = e.track as LessonTrackKey;
                                    const trackIds = TRACK_LESSON_IDS[trackKey] || [];
                                    const completedInTrack = trackIds.filter(id => done.has(id)).length;
                                    const pct = trackIds.length > 0 ? Math.round((completedInTrack / trackIds.length) * 100) : 0;
                                    const statusLower = (e.status || '').toLowerCase();
                                    const isUpdatingThis = updatingTrack === `${u.id}-${e.track}`;

                                    return (
                                      <div key={idx} className="bg-secondary/30 border border-border/40 rounded-lg p-2.5 space-y-2">
                                        <div className="flex items-center justify-between gap-1">
                                          <span className="font-semibold text-xs font-mono text-foreground truncate" title={trackLabel(e.track)}>
                                            {trackLabel(e.track)}
                                          </span>
                                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-medium shrink-0 ${
                                            statusLower === 'active'
                                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                              : statusLower === 'paused'
                                              ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                                              : 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                                          }`}>
                                            {statusLower === 'active' ? '● Active' : statusLower === 'paused' ? '⏸ Paused' : '✓ Ended'}
                                          </span>
                                        </div>

                                        <div className="flex items-center justify-between text-[11px] text-muted-foreground font-mono">
                                          <span>Enrolled: {fmt(e.enrolled_at)}</span>
                                          <span className="font-bold text-foreground">{completedInTrack}/{trackIds.length} ({pct}%)</span>
                                        </div>

                                        <div className="w-full h-1.5 bg-secondary/80 rounded-full overflow-hidden">
                                          <div className={`h-full rounded-full transition-all ${
                                            statusLower === 'active' ? 'bg-primary' : statusLower === 'paused' ? 'bg-amber-500' : 'bg-muted-foreground'
                                          }`} style={{ width: `${pct}%` }} />
                                        </div>

                                        {/* Admin Quick Action Buttons */}
                                        <div className="pt-1 border-t border-border/30 flex items-center justify-end gap-1.5 text-[10px] font-mono">
                                          {statusLower === 'active' ? (
                                            <>
                                              <button
                                                type="button"
                                                disabled={isUpdatingThis}
                                                onClick={() => handleUpdateEnrollmentStatus(u.id, e.track, 'paused')}
                                                className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/20 transition-colors flex items-center gap-1 disabled:opacity-50"
                                                title="Pause this course"
                                              >
                                                <Pause className="w-2.5 h-2.5" /> Pause
                                              </button>
                                              <button
                                                type="button"
                                                disabled={isUpdatingThis}
                                                onClick={() => handleUpdateEnrollmentStatus(u.id, e.track, 'ended')}
                                                className="px-2 py-0.5 rounded bg-secondary hover:bg-secondary/80 text-muted-foreground transition-colors disabled:opacity-50"
                                                title="Mark this course as ended"
                                              >
                                                End
                                              </button>
                                            </>
                                          ) : statusLower === 'paused' ? (
                                            <>
                                              <button
                                                type="button"
                                                disabled={isUpdatingThis}
                                                onClick={() => handleUpdateEnrollmentStatus(u.id, e.track, 'active')}
                                                className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 transition-colors flex items-center gap-1 disabled:opacity-50"
                                                title="Reactivate this course"
                                              >
                                                <Play className="w-2.5 h-2.5" /> Activate
                                              </button>
                                              <button
                                                type="button"
                                                disabled={isUpdatingThis}
                                                onClick={() => handleUpdateEnrollmentStatus(u.id, e.track, 'ended')}
                                                className="px-2 py-0.5 rounded bg-secondary hover:bg-secondary/80 text-muted-foreground transition-colors disabled:opacity-50"
                                                title="Mark this course as ended"
                                              >
                                                End
                                              </button>
                                            </>
                                          ) : (
                                            <button
                                              type="button"
                                              disabled={isUpdatingThis}
                                              onClick={() => handleUpdateEnrollmentStatus(u.id, e.track, 'active')}
                                              className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 transition-colors flex items-center gap-1 disabled:opacity-50"
                                              title="Reactivate this course"
                                            >
                                              <Play className="w-2.5 h-2.5" /> Activate
                                            </button>
                                          )}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              ) : (
                                <p className="text-xs text-muted-foreground italic">No formal track enrollments recorded.</p>
                              )}
                            </Block>
                          );
                        })()}

                        {/* 4. Lesson Progress by Track */}
                        {perTrack.length > 0 && (
                          <Block title="Curriculum Completion Across Tracks">
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                              {perTrack.map(t => (
                                <div key={t.key} className="bg-secondary/30 rounded p-2 text-[11px] font-mono">
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-muted-foreground truncate">{t.label}</span>
                                    <span className="text-foreground font-bold">{t.n} / {t.total}</span>
                                  </div>
                                  <div className="w-full h-1 bg-secondary/80 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.round((t.n / t.total) * 100)}%` }} />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </Block>
                        )}

                        {/* 5. Completed Lessons List */}
                        <Block title={`Completed Lessons (${(u.completed_lessons || []).length})`}>
                          {u.completed_lessons && u.completed_lessons.length > 0 ? (
                            <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1">
                              {u.completed_lessons.map((lid) => (
                                <span
                                  key={lid}
                                  className="text-[10px] font-mono bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded"
                                >
                                  {lid}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <p className="text-xs text-muted-foreground italic">No completed lessons yet.</p>
                          )}
                        </Block>

                        {/* 6. Completed Tests & Badges */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <Block title={`Completed Tests / Exams (${(u.completed_tests || []).length})`}>
                            {u.completed_tests && u.completed_tests.length > 0 ? (
                              <div className="flex flex-wrap gap-1.5">
                                {u.completed_tests.map((tid) => (
                                  <span key={tid} className="text-[10px] font-mono bg-amber-500/10 text-amber-300 border border-amber-500/20 px-2 py-0.5 rounded">
                                    {tid}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <p className="text-xs text-muted-foreground italic">No tests taken yet.</p>
                            )}
                          </Block>

                          <Block title={`Badges & Achievements (${(u.badges || []).length})`}>
                            {u.badges && u.badges.length > 0 ? (
                              <div className="flex flex-wrap gap-1.5">
                                {u.badges.map((b) => (
                                  <span key={b} className="text-[10px] font-mono bg-purple-500/10 text-purple-300 border border-purple-500/20 px-2 py-0.5 rounded flex items-center gap-1">
                                    <Award className="w-2.5 h-2.5" /> {b}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <p className="text-xs text-muted-foreground italic">No badges unlocked yet.</p>
                            )}
                          </Block>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {total > PAGE_SIZE && (
              <div className="flex items-center justify-between mt-4">
                <button
                  onClick={() => { const p = Math.max(0, page - 1); setPage(p); load({ page: p }); }}
                  disabled={page === 0 || loading}
                  className="text-xs font-mono bg-secondary/50 border border-border/40 rounded-lg px-3 py-2 disabled:opacity-40"
                >← prev</button>
                <span className="text-xs font-mono text-muted-foreground">page {page + 1} of {Math.ceil(total / PAGE_SIZE)}</span>
                <button
                  onClick={() => { const p = page + 1; setPage(p); load({ page: p }); }}
                  disabled={(page + 1) * PAGE_SIZE >= total || loading}
                  className="text-xs font-mono bg-secondary/50 border border-border/40 rounded-lg px-3 py-2 disabled:opacity-40"
                >next →</button>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: ANNOUNCEMENTS HUB                                                  */}
        {/* ========================================================================= */}
        {activeTab === 'announcements' && (
          <div className="space-y-6">
            {/* Broadcast Form */}
            <div className="bg-card/40 border border-border/50 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" />
                <h2 className="text-base font-bold font-display">Broadcast New Announcement</h2>
              </div>
              <p className="text-xs text-muted-foreground">
                This will send a notification to every registered user and show an unread badge on their inbox.
              </p>
              <input
                value={newAnnTitle}
                onChange={e => setNewAnnTitle(e.target.value.slice(0, 120))}
                placeholder="Announcement Title (e.g. C++ Expert Track Launched!)"
                className="w-full bg-secondary/30 border border-border/40 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/50"
              />
              <textarea
                value={newAnnBody}
                onChange={e => setNewAnnBody(e.target.value.slice(0, 2000))}
                placeholder="Message body..."
                rows={4}
                className="w-full bg-secondary/30 border border-border/40 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/50 resize-none"
              />
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground font-mono">{newAnnBody.length}/2000</span>
                <button
                  onClick={handlePostAnnouncement}
                  disabled={postingAnn || !newAnnTitle.trim() || !newAnnBody.trim()}
                  className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-semibold hover:opacity-90 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" /> {postingAnn ? 'Broadcasting...' : 'Broadcast to All Users'}
                </button>
              </div>
            </div>

            {/* List Announcements */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold font-display text-foreground flex items-center justify-between">
                <span>Active Broadcasts ({announcements.length})</span>
                {loadingAnnouncements && <span className="text-xs font-mono text-muted-foreground">loading...</span>}
              </h3>

              {announcements.map(a => {
                const isEditing = editingAnnId === a.id;

                return (
                  <div key={a.id} className="bg-card/40 border border-border/40 rounded-xl p-4 space-y-2">
                    {isEditing ? (
                      <div className="space-y-2">
                        <input
                          value={editAnnTitle}
                          onChange={e => setEditAnnTitle(e.target.value.slice(0, 120))}
                          className="w-full bg-secondary/40 border border-border/50 rounded px-2 py-1 text-sm font-bold"
                        />
                        <textarea
                          value={editAnnBody}
                          onChange={e => setEditAnnBody(e.target.value.slice(0, 2000))}
                          rows={4}
                          className="w-full bg-secondary/40 border border-border/50 rounded px-2 py-1 text-sm resize-none"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSaveAnnouncementEdit(a.id)}
                            disabled={savingAnn}
                            className="flex items-center gap-1 bg-primary text-primary-foreground text-xs px-3 py-1.5 rounded font-semibold"
                          >
                            <Check className="w-3.5 h-3.5" /> Save
                          </button>
                          <button
                            onClick={() => setEditingAnnId(null)}
                            className="flex items-center gap-1 bg-secondary text-foreground text-xs px-3 py-1.5 rounded"
                          >
                            <X className="w-3.5 h-3.5" /> Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h4 className="font-bold text-sm text-foreground">{a.title}</h4>
                            <p className="text-[10px] text-muted-foreground font-mono mt-0.5">
                              {new Date(a.created_at).toLocaleString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => {
                                setEditingAnnId(a.id);
                                setEditAnnTitle(a.title);
                                setEditAnnBody(a.body);
                              }}
                              className="p-1.5 text-muted-foreground hover:text-primary rounded"
                              title="Edit"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteAnnouncement(a.id)}
                              className="p-1.5 text-muted-foreground hover:text-destructive rounded"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                        <p className="text-xs text-foreground/90 whitespace-pre-wrap leading-relaxed">
                          {a.body}
                        </p>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: SUGGESTIONS & FEEDBACK                                            */}
        {/* ========================================================================= */}
        {activeTab === 'suggestions' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold font-display text-foreground">User Feedback Board ({suggestions.length})</h3>
                <p className="text-xs text-muted-foreground">Review suggestions, publish official admin replies, or moderate content.</p>
              </div>
              {loadingSuggestions && <span className="text-xs font-mono text-muted-foreground">loading...</span>}
            </div>

            <div className="space-y-3">
              {suggestions.map(s => {
                const isReplying = replyOpenId === s.id;
                const isEditing = editSuggId === s.id;

                return (
                  <div key={s.id} className="bg-card/40 border border-border/40 rounded-xl p-4 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-primary">@{s.username || 'anon'}</span>
                          <span className="text-[10px] text-muted-foreground font-mono">
                            {new Date(s.created_at).toLocaleString()}
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-secondary/50 text-foreground">
                            ▲ {s.upvotes || 0}  ▼ {s.downvotes || 0}
                          </span>
                        </div>

                        {isEditing ? (
                          <div className="mt-2 space-y-2">
                            <textarea
                              value={editSuggText}
                              onChange={e => setEditSuggText(e.target.value.slice(0, 500))}
                              rows={3}
                              className="w-full bg-secondary/40 border border-border/50 rounded p-2 text-xs resize-none"
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEditSuggestion(s.id)}
                                disabled={savingSugg}
                                className="flex items-center gap-1 bg-primary text-primary-foreground text-xs px-2.5 py-1 rounded font-semibold"
                              >
                                <Check className="w-3 h-3" /> Save Edit
                              </button>
                              <button
                                onClick={() => setEditSuggId(null)}
                                className="flex items-center gap-1 bg-secondary text-foreground text-xs px-2.5 py-1 rounded"
                              >
                                <X className="w-3 h-3" /> Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-xs text-foreground mt-1.5 whitespace-pre-wrap leading-relaxed">
                            {s.text}
                          </p>
                        )}

                        {/* Existing reply */}
                        {s.reply && (
                          <div className="pl-3 border-l-2 border-primary/40 bg-primary/5 rounded-r-lg p-2.5 mt-2.5">
                            <p className="text-[10px] text-primary font-semibold flex items-center gap-1">
                              <ShieldCheck className="w-3 h-3" /> CodeSage Admin Reply
                            </p>
                            <p className="text-xs text-foreground mt-0.5 whitespace-pre-wrap">{s.reply}</p>
                            {s.reply_at && (
                              <p className="text-[9px] text-muted-foreground mt-1">{new Date(s.reply_at).toLocaleString()}</p>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button
                          onClick={() => {
                            setReplyOpenId(isReplying ? null : s.id);
                            setReplyText(s.reply || '');
                          }}
                          className="p-1.5 text-muted-foreground hover:text-primary rounded hover:bg-secondary/40"
                          title="Reply as admin"
                        >
                          <Reply className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setEditSuggId(isEditing ? null : s.id);
                            setEditSuggText(s.text);
                          }}
                          className="p-1.5 text-muted-foreground hover:text-primary rounded hover:bg-secondary/40"
                          title="Edit suggestion"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteSuggestion(s.id)}
                          className="p-1.5 text-muted-foreground hover:text-destructive rounded hover:bg-destructive/10"
                          title="Delete suggestion"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Inline reply box */}
                    {isReplying && (
                      <div className="pt-2 border-t border-border/30 space-y-2">
                        <textarea
                          value={replyText}
                          onChange={e => setReplyText(e.target.value.slice(0, 1000))}
                          placeholder="Write official response to student..."
                          rows={3}
                          className="w-full bg-secondary/30 border border-primary/40 rounded-lg p-2.5 text-xs text-foreground resize-none focus:outline-none focus:border-primary"
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setReplyOpenId(null)}
                            className="text-xs px-3 py-1.5 rounded bg-secondary text-foreground"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleReplySuggestion(s.id)}
                            disabled={submittingReply || !replyText.trim()}
                            className="flex items-center gap-1 text-xs px-3 py-1.5 rounded bg-primary text-primary-foreground font-semibold disabled:opacity-50"
                          >
                            <Send className="w-3 h-3" /> {submittingReply ? 'Posting...' : 'Post Admin Reply'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
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
