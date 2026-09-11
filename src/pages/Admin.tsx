import { useEffect, useMemo, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, ShieldAlert, Search, RefreshCw, Users, Flame, Zap,
  GraduationCap, ChevronDown, ChevronRight, Mail, Calendar, Database, Trash2,
  Bell, MessageSquare, Send, Edit2, Reply, Check, X, ShieldCheck
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
  const [search, setSearch] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

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
  const load = async (opts?: { search?: string; page?: number }) => {
    const s = opts?.search ?? search;
    const p = opts?.page ?? page;
    setLoading(true); setError('');
    const [{ data, error: err }, countRes] = await Promise.all([
      supabase.rpc('admin_list_users', { _search: s || null, _limit: PAGE_SIZE, _offset: p * PAGE_SIZE }),
      supabase.rpc('admin_user_count', { _search: s || null }),
    ]);
    setLoading(false);
    if (err) {
      setError(err.message?.includes('Admin') ? 'Admin access required for this account.' : err.message);
      setAuthed(false);
      return;
    }
    setRows((data as unknown as AdminUser[]) || []);
    if (!countRes.error) setTotal(Number(countRes.data) || 0);
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

  const totals = useMemo(() => ({
    users: total,
    lessons: rows.reduce((a, r) => a + (r.lessons_done || 0), 0),
    xp: rows.reduce((a, r) => a + (r.xp || 0), 0),
    active: rows.filter(r => r.enrollments.some(e => e.status === 'active')).length,
  }), [rows, total]);

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
    const { error: err } = await supabase.from('announcements').delete().eq('id', id);
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mb-6">
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
                          <p className="text-[11px] text-muted-foreground font-mono mt-0.5">
                            lvl {u.level ?? 1} · {u.xp ?? 0} xp · {u.lessons_done} lessons · {u.enrollments?.length || 0} tracks
                          </p>
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
                      <div className="border-t border-border/30 p-4 bg-black/10 space-y-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          <Field label="Joined" value={fmt(u.joined_at || u.created_at)} icon={Calendar} />
                          <Field label="Last Active" value={fmtTime(u.last_sign_in_at)} icon={Mail} />
                          <Field label="Streak" value={`${u.streak_count ?? 0} days`} icon={Flame} />
                          <Field label="Sage Coins" value={`${u.sage_coins ?? 0} ◈`} icon={Database} />
                        </div>

                        {perTrack.length > 0 && (
                          <Block title="Lesson Progress by Track">
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                              {perTrack.map(t => (
                                <div key={t.key} className="bg-secondary/30 rounded p-2 text-[11px] font-mono">
                                  <span className="text-muted-foreground block truncate">{t.label}</span>
                                  <span className="text-foreground font-bold">{t.n} / {t.total}</span>
                                </div>
                              ))}
                            </div>
                          </Block>
                        )}
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
