import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Send, Lock, MessageSquare, ShieldCheck, Edit2, Save, X, Reply, ShieldAlert, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { useUser } from '@/contexts/UserContext';
import { supabase } from '@/integrations/supabase/client';

// NOTE: Change this to your desired password. 
// This is a frontend gate. Later, ensure your Supabase RPCs/RLS also validate admin roles.
const ADMIN_PASSWORD = "sage_admin_2024";

interface Suggestion {
  id: string;
  username: string;
  text: string;
  reply: string | null;
  reply_at: string | null;
  created_at: string;
  updated_at: string;
  upvotes: number;
  downvotes: number;
  is_mine: boolean;
  user_vote?: 'up' | 'down' | null;
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
  const [adminEditOpenId, setAdminEditOpenId] = useState<string | null>(null);
  const [adminEditText, setAdminEditText] = useState('');
  const [adminDeleteId, setAdminDeleteId] = useState<string | null>(null);
  const [postedToday, setPostedToday] = useState(false);

  // Password protection states
  const [showPasswordModal, setShowPasswordModal] = useState<{ type: 'reply' | 'edit' | 'delete', id: string } | null>(null);
  const [adminPassword, setAdminPassword] = useState('');

  const sb = supabase as unknown as {
    from: (t: string) => any;
  };

  const refresh = useCallback(async () => {
    const { data: suggestionsData, error: suggestionsError } = await sb
      .from('suggestions_public')
      .select('*')
      .order('created_at', { ascending: false });

    if (suggestionsError) { console.error(suggestionsError); return; }

    let userVotes: Record<string, 'up' | 'down'> = {};

    if (user) {
      const { data: votesData } = await sb
        .from('suggestion_votes')
        .select('suggestion_id, vote_type')
        .eq('user_id', user.id);

      if (votesData) {
        userVotes = votesData.reduce((acc: Record<string, 'up' | 'down'>, curr: any) => {
          acc[curr.suggestion_id] = curr.vote_type as 'up' | 'down';
          return acc;
        }, {} as Record<string, 'up' | 'down'>);
      }
    }

    const itemsWithVotes = (suggestionsData || []).map((s: any) => ({
      ...s,
      upvotes: s.upvotes || 0,
      downvotes: s.downvotes || 0,
      is_mine: !!s.is_mine,
      user_vote: userVotes[s.id] || null,
    })) as Suggestion[];

    setItems(itemsWithVotes);

    if (user) {
      const today = new Date(); today.setHours(0, 0, 0, 0);
      const mine = itemsWithVotes.some(s =>
        s.is_mine && new Date(s.created_at) >= today
      );
      setPostedToday(mine);
    }
  }, [user]);

  useEffect(() => {
    refresh();
    const ch = supabase
      .channel('suggestions-feed')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'suggestions' }, () => refresh())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'suggestion_votes' }, () => refresh())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [refresh]);

  useEffect(() => {
    if (user) {
      const markAsRead = async () => {
        const { error } = await supabase.rpc('mark_suggestions_read');
        if (error) {
          console.error('Failed to mark suggestions as read:', error);
          return;
        }
        window.dispatchEvent(new Event('suggestions:read'));
      };
      markAsRead();
    }
  }, [user]);

  const submit = async () => {
    if (!user || !text.trim()) return;
    if (postedToday) { toast.error('You can only post one suggestion per day.'); return; }
    const { error } = await supabase.from('suggestions').insert({
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
    const { error } = await supabase.from('suggestions')
      .update({ text: editText.trim().slice(0, 500) }).eq('id', id);
    if (error) { toast.error(error.message); return; }
    cancelEdit(); toast.success('Updated');
  };

  const submitReply = async (id: string) => {
    if (!replyText.trim()) return;
    const { error } = await supabase.rpc('reply_suggestion', {
      _id: id, _reply: replyText.trim(),
    });
    if (error) { toast.error('Admin access required'); return; }
    toast.success('Reply posted');
    setReplyOpenId(null); setReplyText(''); 
  };

  const submitAdminEdit = async (id: string) => {
    if (!adminEditText.trim()) return;
    const { error } = await supabase.rpc('admin_edit_suggestion', {
      _id: id, _text: adminEditText.trim(),
    });
    if (error) { toast.error('Admin access required'); return; }
    toast.success('Suggestion edited');
    setAdminEditOpenId(null); setAdminEditText(''); 
  };

  const submitAdminDelete = async (id: string) => {
    const { data, error } = await supabase.rpc('admin_delete_suggestion', {
      _id: id,
    });
    if (error) { toast.error('Admin access required'); return; }
    if (data === false) { toast.error('Delete failed'); return; }
    toast.success('Suggestion deleted');
    setAdminDeleteId(null); 
    setItems(prev => prev.filter(s => s.id !== id));
    refresh();
  };

  const deleteOwn = async (id: string) => {
    const { error } = await supabase.from('suggestions').delete().eq('id', id);
    if (error) { toast.error(error.message); return; }
    toast.success('Deleted');
    setItems(prev => prev.filter(s => s.id !== id));
    setPostedToday(false);
    refresh();
  };

  const handleVote = async (suggestionId: string, type: 'up' | 'down') => {
    if (!user) {
      toast.error('You must be logged in to vote.');
      return;
    }

    const currentSuggestion = items.find(s => s.id === suggestionId);
    if (!currentSuggestion) return;

    const existingVote = currentSuggestion.user_vote;
    let newUpvotes = currentSuggestion.upvotes;
    let newDownvotes = currentSuggestion.downvotes;
    let newVoteState: 'up' | 'down' | null = type;

    if (existingVote === type) {
      if (type === 'up') newUpvotes = Math.max(0, newUpvotes - 1);
      else newDownvotes = Math.max(0, newDownvotes - 1);
      newVoteState = null;
    } else {
      if (type === 'up') {
        newUpvotes += 1;
        if (existingVote === 'down') newDownvotes = Math.max(0, newDownvotes - 1);
      } else {
        newDownvotes += 1;
        if (existingVote === 'up') newUpvotes = Math.max(0, newUpvotes - 1);
      }
    }

    setItems(prev => prev.map(s => s.id === suggestionId ? {
      ...s,
      upvotes: newUpvotes,
      downvotes: newDownvotes,
      user_vote: newVoteState
    } : s));

    try {
      if (newVoteState === null) {
        await sb.from('suggestion_votes').delete().eq('suggestion_id', suggestionId).eq('user_id', user.id);
      } else {
        await sb.from('suggestion_votes').upsert({
          suggestion_id: suggestionId,
          user_id: user.id,
          vote_type: type
        }, { onConflict: 'suggestion_id,user_id' });
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to register vote.');
      refresh();
    }
  };

  // --- Password Protection Logic ---
  const requestAdminAction = (type: 'reply' | 'edit' | 'delete', id: string) => {
    setShowPasswordModal({ type, id });
    setAdminPassword('');
  };

  const confirmAdminAction = async () => {
    if (adminPassword !== ADMIN_PASSWORD) {
      toast.error('Incorrect admin password');
      return;
    }

    if (!showPasswordModal) return;
    const { type, id } = showPasswordModal;

    if (type === 'reply') {
      setReplyOpenId(id);
    } else if (type === 'edit') {
      setAdminEditOpenId(id);
      const item = items.find(s => s.id === id);
      if (item) setAdminEditText(item.text);
    } else if (type === 'delete') {
      setAdminDeleteId(id);
    }

    setShowPasswordModal(null);
    setAdminPassword('');
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
            const isMine = s.is_mine;
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
                    
                    {!isEditing && (
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => handleVote(s.id, 'up')}
                          className={`flex items-center gap-1 px-2.5 py-1 rounded-full border text-xs font-mono transition-all ${
                            s.user_vote === 'up'
                              ? 'bg-primary/20 border-primary text-primary neon-glow'
                              : 'bg-secondary/20 border-border/40 text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                          <span>{s.upvotes}</span>
                        </button>

                        <button
                          onClick={() => handleVote(s.id, 'down')}
                          className={`flex items-center gap-1 px-2.5 py-1 rounded-full border text-xs font-mono transition-all ${
                            s.user_vote === 'down'
                              ? 'bg-destructive/20 border-destructive text-destructive'
                              : 'bg-secondary/20 border-border/40 text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                          <span>{s.downvotes}</span>
                        </button>
                      </div>
                    )}

                    <p className="text-[9px] text-muted-foreground mt-2">
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
                  <div className="pl-3 border-l-2 border-primary/40 bg-primary/5 rounded-r-lg p-2.5 mt-2">
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
                      <button onClick={() => requestAdminAction('reply', s.id)}
                        className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-primary transition-colors">
                        <Reply className="w-3 h-3" /> Reply (admin)
                      </button>
                    )}
                    {!isAdminEditing && (
                      <button onClick={() => requestAdminAction('edit', s.id)}
                        className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-amber-400 transition-colors">
                        <ShieldAlert className="w-3 h-3" /> Edit (admin)
                      </button>
                    )}
                    {!isAdminDeleting && (
                      <button onClick={() => requestAdminAction('delete', s.id)}
                        className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-destructive transition-colors">
                        <Trash2 className="w-3 h-3" /> Delete (admin)
                      </button>
                    )}
                  </div>
                )}

                {isReplying && (
                  <div className="space-y-2 pt-1">
                    <textarea value={replyText} onChange={e => setReplyText(e.target.value.slice(0, 1000))}
                      placeholder="Write a reply..." rows={2}
                      className="w-full bg-secondary/40 border border-border/30 rounded-lg px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:border-primary/50 resize-none" />
                    <div className="flex gap-2">
                      <button onClick={() => submitReply(s.id)}
                        className="bg-primary text-primary-foreground px-3 py-1 rounded-lg text-[11px] font-semibold hover:opacity-90">
                        Send Reply
                      </button>
                      <button onClick={() => { setReplyOpenId(null); setReplyText(''); }}
                        className="bg-secondary text-foreground px-3 py-1 rounded-lg text-[11px]">Cancel</button>
                    </div>
                  </div>
                )}

                {isAdminEditing && (
                  <div className="space-y-2 pt-1 border-t border-amber-500/20 mt-2">
                    <p className="text-[10px] text-amber-400 font-semibold">Admin edit — overrides user content</p>
                    <textarea value={adminEditText} onChange={e => setAdminEditText(e.target.value.slice(0, 500))}
                      placeholder="New text" rows={3} maxLength={500}
                      className="w-full bg-secondary/40 border border-border/30 rounded-lg px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:border-amber-500/50 resize-none" />
                    <div className="flex gap-2">
                      <button onClick={() => submitAdminEdit(s.id)}
                        className="bg-amber-500 text-background px-3 py-1 rounded-lg text-[11px] font-semibold hover:opacity-90">
                        Save Admin Edit
                      </button>
                      <button onClick={() => { setAdminEditOpenId(null); setAdminEditText(''); }}
                        className="bg-secondary text-foreground px-3 py-1 rounded-lg text-[11px]">Cancel</button>
                    </div>
                  </div>
                )}

                {isAdminDeleting && (
                  <div className="space-y-2 pt-1 border-t border-destructive/20 mt-2">
                    <p className="text-[10px] text-destructive font-semibold">Confirm delete — this is permanent.</p>
                    <div className="flex gap-2">
                      <button onClick={() => submitAdminDelete(s.id)}
                        className="bg-destructive text-destructive-foreground px-3 py-1 rounded-lg text-[11px] font-semibold hover:opacity-90">
                        Delete Permanently
                      </button>
                      <button onClick={() => { setAdminDeleteId(null); }}
                        className="bg-secondary text-foreground px-3 py-1 rounded-lg text-[11px]">Cancel</button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Admin Password Verification Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-6 rounded-2xl w-full max-w-sm space-y-4 border border-primary/20"
          >
            <h3 className="text-lg font-bold font-display flex items-center gap-2">
              <Lock className="w-5 h-5 text-primary" /> Admin Access
            </h3>
            <p className="text-sm text-muted-foreground">
              Please enter the admin password to {showPasswordModal.type} this suggestion.
            </p>
            <input
              type="password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              placeholder="Enter admin password"
              className="w-full bg-secondary/50 border border-border/50 rounded-xl px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/50"
              onKeyDown={(e) => e.key === 'Enter' && confirmAdminAction()}
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={confirmAdminAction}
                className="flex-1 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                Verify
              </button>
              <button
                onClick={() => { setShowPasswordModal(null); setAdminPassword(''); }}
                className="flex-1 bg-secondary text-foreground px-4 py-2 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Suggestions;
