import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Send, Lock, MessageSquare, ShieldCheck, Edit2, Save, X, Reply, ShieldAlert, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { useUser } from '@/contexts/UserContext';
import { supabase } from '@/integrations/supabase/client';

interface Suggestion {
  id: string;
  user_id: string;
  username: string;
  text: string;
  reply: string | null;
  reply_at: string | null;
  created_at: string;
  updated_at: string;
}

const PROMPTS = [
  "What feature do you wish CodeSage had?",
  "What feels confusing or hard to use?",
  "Found a bug? Describe what happened.",
  "What lesson topic would you love to see next?",
];

const Suggestions = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [text, setText] = useState('');
  const [items, setItems] = useState<Suggestion[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [replyOpenId, setReplyOpenId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [replyPw, setReplyPw] = useState('');
  const [adminEditOpenId, setAdminEditOpenId] = useState<string | null>(null);
  const [adminEditText, setAdminEditText] = useState('');
  const [adminEditPw, setAdminEditPw] = useState('');
  const [adminDeleteId, setAdminDeleteId] = useState<string | null>(null);
  const [adminDeletePw, setAdminDeletePw] = useState('');
  const [postedToday, setPostedToday] = useState(false);

  const refresh = useCallback(async () => {
    const { data, error } = await supabase
      .from<Suggestion>('suggestions')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) { console.error(error); return; }
    setItems(data || []);
    if (user) {
      const today = new Date(); today.setHours(0, 0, 0, 0);
      const mine = (data || []).some(s =>
        s.user_id === user.id && new Date(s.created_at) >= today
      );
      setPostedToday(mine);
    }
  }, [user]);

  useEffect(() => {
    refresh();
    const ch = supabase
      .channel('suggestions-feed')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'suggestions' }, () => refresh())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [refresh]);

  const submit = async () => {
    if (!user || !text.trim()) return;
    if (postedToday) { toast.error('You can only post one suggestion per day.'); return; }
    const { error } = await supabase.from<Suggestion>('suggestions').insert({
      user_id: user.id, username: user.username || 'anonymous',
      text: text.trim().slice(0, 500),
    });
    if (error) { toast.error(error.message); return; }
    setText(''); toast.success('Thanks for your feedback! 💚');
  };

  const startEdit = (s: Suggestion) => { setEditingId(s.id); setEditText(s.text); };
  const cancelEdit = () => { setEditingId(null); setEditText(''); };
  const saveEdit = async (id: string) => {
    if (!editText.trim()) return;
    const { error } = await supabase.from<Suggestion>('suggestions')
      .update({ text: editText.trim().slice(0, 500) }).eq('id', id);
    if (error) { toast.error(error.message); return; }
    cancelEdit(); toast.success('Updated');
  };

  const submitReply = async (id: string) => {
    if (!replyText.trim() || !replyPw) return;
    const { error } = await supabase.rpc('reply_suggestion', {
      _id: id, _reply: replyText.trim(), _password: replyPw,
    });
    if (error) { toast.error('Wrong password or invalid reply'); return; }
    toast.success('Reply posted');
    setReplyOpenId(null); setReplyText(''); setReplyPw('');
  };

  const submitAdminEdit = async (id: string) => {
    if (!adminEditText.trim() || !adminEditPw) return;
    const { error } = await supabase.rpc('admin_edit_suggestion', {
      _id: id, _text: adminEditText.trim(), _password: adminEditPw,
    });
    if (error) { toast.error('Wrong password or invalid edit'); return; }
    toast.success('Suggestion edited');
    setAdminEditOpenId(null); setAdminEditText(''); setAdminEditPw('');
  };

  const submitAdminDelete = async (id: string) => {
    if (!adminDeletePw) return;
    const { data, error } = await supabase.rpc('admin_delete_suggestion', {
      _id: id, _password: adminDeletePw,
    });
    if (error) { toast.error('Wrong password'); return; }
    if (data === false) { toast.error('Delete failed'); return; }
    toast.success('Suggestion deleted');
    setAdminDeleteId(null); setAdminDeletePw('');
    // Optimistic + refresh — realtime may lag
    setItems(prev => prev.filter(s => s.id !== id));
    refresh();
  };

  const deleteOwn = async (id: string) => {
    const { error } = await supabase.from<Suggestion>('suggestions').delete().eq('id', id);
    if (error) { toast.error(error.message); return; }
    toast.success('Deleted');
    setItems(prev => prev.filter(s => s.id !== id));
    setPostedToday(false);
    refresh();
  };

  return (
    <div className="min-h-screen bg-background grid-bg relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full bg-primary/3 blur-[120px] pointer-events-none" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="relative z-10 max-w-lg mx-auto p-4 sm:p-6 space-y-5">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/dashboard')} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold font-display"><span className="text-primary neon-text">Suggestions</span></h1>
        </div>

        <div className="glass-card p-5 rounded-2xl space-y-3">
          <h3 className="text-sm font-display font-semibold text-foreground flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-primary" /> Tell us what you think
          </h3>
          <div className="space-y-1">
            {PROMPTS.map((p, i) => (
              <p key={i} className="text-[11px] text-muted-foreground leading-relaxed">• {p}</p>
            ))}
          </div>
          <textarea
            value={text}
            onChange={e => setText(e.target.value.slice(0, 500))}
            placeholder={postedToday ? "You already posted today — come back tomorrow ✨" : "Type your suggestion..."}
            disabled={postedToday} rows={4} maxLength={500}
            className="w-full bg-secondary/30 border border-border/40 rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 resize-none font-sans disabled:opacity-50"
          />
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-muted-foreground font-mono">{text.length}/500</span>
            <button onClick={submit} disabled={!text.trim() || postedToday}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-xs font-display font-semibold disabled:opacity-30 hover:neon-glow transition-all">
              <Send className="w-3.5 h-3.5" /> Send
            </button>
          </div>
          <p className="text-[10px] text-muted-foreground flex items-center gap-1">
            <Lock className="w-3 h-3" /> One suggestion per day. You can edit your own anytime.
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="text-xs font-display font-semibold text-muted-foreground uppercase tracking-wider">
            Community Suggestions ({items.length})
          </h3>
          {items.length === 0 && (
            <div className="glass-card p-5 rounded-2xl text-center">
              <p className="text-xs text-muted-foreground">No suggestions yet. Be the first!</p>
            </div>
          )}
          {items.map(s => {
            const isMine = user?.id === s.user_id;
            const isEditing = editingId === s.id;
            const isReplying = replyOpenId === s.id;
            const isAdminEditing = adminEditOpenId === s.id;
            const isAdminDeleting = adminDeleteId === s.id;
            return (
              <div key={s.id} className="glass-card p-4 rounded-2xl space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-[10px] text-primary font-mono">@{s.username || 'anon'}</p>
                      {isMine && <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/30">you</span>}
                    </div>
                    {isEditing ? (
                      <textarea value={editText} onChange={e => setEditText(e.target.value.slice(0, 500))}
                        rows={3} maxLength={500}
                        className="w-full mt-1 bg-secondary/40 border border-primary/30 rounded-lg px-2.5 py-1.5 text-sm text-foreground focus:outline-none focus:border-primary/60 resize-none" />
                    ) : (
                      <p className="text-sm text-foreground whitespace-pre-wrap break-words">{s.text}</p>
                    )}
                    <p className="text-[9px] text-muted-foreground mt-1">
                      {new Date(s.created_at).toLocaleString()}
                      {s.updated_at && s.updated_at !== s.created_at && ' · edited'}
                    </p>
                  </div>
                  {isMine && !isEditing && (
                    <div className="flex items-center gap-1">
                      <button onClick={() => startEdit(s)} className="text-muted-foreground hover:text-primary p-1" title="Edit">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => { if (confirm('Delete your suggestion?')) deleteOwn(s.id); }}
                        className="text-muted-foreground hover:text-destructive p-1" title="Delete">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {isEditing && (
                  <div className="flex gap-2">
                    <button onClick={() => saveEdit(s.id)} className="flex items-center gap-1 bg-primary text-primary-foreground px-3 py-1 rounded-lg text-[11px] font-semibold">
                      <Save className="w-3 h-3" /> Save
                    </button>
                    <button onClick={cancelEdit} className="flex items-center gap-1 bg-secondary text-foreground px-3 py-1 rounded-lg text-[11px]">
                      <X className="w-3 h-3" /> Cancel
                    </button>
                  </div>
                )}

                {s.reply && (
                  <div className="pl-3 border-l-2 border-primary/40 bg-primary/5 rounded-r-lg p-2.5">
                    <p className="text-[10px] text-primary font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> Admin reply
                    </p>
                    <p className="text-xs text-foreground mt-0.5 whitespace-pre-wrap break-words">{s.reply}</p>
                    {s.reply_at && <p className="text-[9px] text-muted-foreground mt-1">{new Date(s.reply_at).toLocaleString()}</p>}
                  </div>
                )}

                {/* Admin actions row */}
                {!isEditing && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {!s.reply && !isReplying && (
                      <button onClick={() => setReplyOpenId(s.id)}
                        className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-primary transition-colors">
                        <Reply className="w-3 h-3" /> Reply (admin)
                      </button>
                    )}
                    {!isAdminEditing && (
                      <button onClick={() => { setAdminEditOpenId(s.id); setAdminEditText(s.text); }}
                        className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-amber-400 transition-colors">
                        <ShieldAlert className="w-3 h-3" /> Edit (admin)
                      </button>
                    )}
                    {!isAdminDeleting && (
                      <button onClick={() => setAdminDeleteId(s.id)}
                        className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-destructive transition-colors">
                        <Trash2 className="w-3 h-3" /> Delete (admin)
                      </button>
                    )}
                  </div>
                )}

                {isReplying && (
                  <div className="space-y-2 pt-1">
                    <input type="password" value={replyPw} onChange={e => setReplyPw(e.target.value)}
                      placeholder="Admin password"
                      className="w-full bg-secondary/40 border border-border/30 rounded-lg px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:border-primary/50 font-mono" />
                    <textarea value={replyText} onChange={e => setReplyText(e.target.value.slice(0, 1000))}
                      placeholder="Write a reply..." rows={2}
                      className="w-full bg-secondary/40 border border-border/30 rounded-lg px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:border-primary/50 resize-none" />
                    <div className="flex gap-2">
                      <button onClick={() => submitReply(s.id)}
                        className="bg-primary text-primary-foreground px-3 py-1 rounded-lg text-[11px] font-semibold hover:opacity-90">
                        Send Reply
                      </button>
                      <button onClick={() => { setReplyOpenId(null); setReplyPw(''); setReplyText(''); }}
                        className="bg-secondary text-foreground px-3 py-1 rounded-lg text-[11px]">Cancel</button>
                    </div>
                  </div>
                )}

                {isAdminEditing && (
                  <div className="space-y-2 pt-1 border-t border-amber-500/20 mt-2">
                    <p className="text-[10px] text-amber-400 font-semibold">Admin edit — overrides user content</p>
                    <input type="password" value={adminEditPw} onChange={e => setAdminEditPw(e.target.value)}
                      placeholder="Admin password"
                      className="w-full bg-secondary/40 border border-border/30 rounded-lg px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:border-amber-500/50 font-mono" />
                    <textarea value={adminEditText} onChange={e => setAdminEditText(e.target.value.slice(0, 500))}
                      placeholder="New text" rows={3} maxLength={500}
                      className="w-full bg-secondary/40 border border-border/30 rounded-lg px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:border-amber-500/50 resize-none" />
                    <div className="flex gap-2">
                      <button onClick={() => submitAdminEdit(s.id)}
                        className="bg-amber-500 text-background px-3 py-1 rounded-lg text-[11px] font-semibold hover:opacity-90">
                        Save Admin Edit
                      </button>
                      <button onClick={() => { setAdminEditOpenId(null); setAdminEditPw(''); setAdminEditText(''); }}
                        className="bg-secondary text-foreground px-3 py-1 rounded-lg text-[11px]">Cancel</button>
                    </div>
                  </div>
                )}

                {isAdminDeleting && (
                  <div className="space-y-2 pt-1 border-t border-destructive/20 mt-2">
                    <p className="text-[10px] text-destructive font-semibold">Confirm delete — this is permanent.</p>
                    <input type="password" value={adminDeletePw} onChange={e => setAdminDeletePw(e.target.value)}
                      placeholder="Admin password"
                      className="w-full bg-secondary/40 border border-border/30 rounded-lg px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:border-destructive/50 font-mono" />
                    <div className="flex gap-2">
                      <button onClick={() => submitAdminDelete(s.id)}
                        className="bg-destructive text-destructive-foreground px-3 py-1 rounded-lg text-[11px] font-semibold hover:opacity-90">
                        Delete Permanently
                      </button>
                      <button onClick={() => { setAdminDeleteId(null); setAdminDeletePw(''); }}
                        className="bg-secondary text-foreground px-3 py-1 rounded-lg text-[11px]">Cancel</button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default Suggestions;
