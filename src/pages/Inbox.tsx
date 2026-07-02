import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Inbox as InboxIcon, Shield, X, Send, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/contexts/UserContext';

interface Announcement {
  id: string;
  title: string;
  body: string;
  created_at: string;
}

const InboxPage = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [items, setItems] = useState<Announcement[]>([]);
  const [showCompose, setShowCompose] = useState(false);
  const [pw, setPw] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [posting, setPosting] = useState(false);

  const refresh = useCallback(async () => {
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) { console.error(error); return; }
    setItems((data || []) as Announcement[]);
    // Mark all seen ids as read
    if (user) {
      for (const a of (data || []) as Announcement[]) {
        try { await supabase.rpc('mark_announcement_read', { _id: a.id }); } catch { /* noop */ }
      }
      window.dispatchEvent(new Event('inbox:read'));
    }
  }, [user]);

  useEffect(() => {
    refresh();
    const ch = supabase
      .channel('announcements-feed')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'announcements' }, () => refresh())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [refresh]);

  const post = async () => {
    if (!title.trim() || !body.trim() || !pw) { toast.error('Fill all fields'); return; }
    setPosting(true);
    const { error } = await supabase.rpc('post_announcement', {
      _title: title.trim().slice(0, 120),
      _body: body.trim().slice(0, 2000),
      _password: pw,
    });
    setPosting(false);
    if (error) { toast.error('Wrong password or invalid post'); return; }
    toast.success('Announcement posted');
    setShowCompose(false);
    setTitle(''); setBody(''); setPw('');
    refresh();
  };

  return (
    <div className="min-h-screen bg-background grid-bg relative overflow-hidden">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="relative z-10 max-w-lg mx-auto p-4 sm:p-6 space-y-5">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/dashboard')} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold font-display flex-1 flex items-center gap-2">
            <InboxIcon className="w-5 h-5 text-primary" />
            <span className="text-primary neon-text">Inbox</span>
          </h1>
          <button
            title="Admin: post announcement"
            onClick={() => setShowCompose(true)}
            className="text-muted-foreground hover:text-primary p-2 rounded-lg hover:bg-primary/10"
          >
            <Shield className="w-4 h-4" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="glass-card rounded-2xl p-8 text-center">
            <InboxIcon className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-sm font-display font-semibold text-foreground">No updates yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              When the CodeSage team ships something new, you'll see it here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map(a => (
              <div key={a.id} className="glass-card p-4 rounded-2xl space-y-2 border border-primary/10">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                  <p className="text-[10px] font-mono text-primary uppercase tracking-wider">CodeSage Admin</p>
                  <p className="text-[10px] text-muted-foreground ml-auto">
                    {new Date(a.created_at).toLocaleString()}
                  </p>
                </div>
                <h3 className="font-display font-bold text-sm text-foreground">{a.title}</h3>
                <p className="text-xs text-foreground/90 whitespace-pre-wrap break-words leading-relaxed">
                  {a.body}
                </p>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {showCompose && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card rounded-2xl p-5 w-full max-w-md border border-primary/30 neon-glow space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-sm flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" /> Admin Announcement
              </h3>
              <button onClick={() => setShowCompose(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>
            <input value={pw} onChange={e => setPw(e.target.value)} type="password" placeholder="Admin password"
              className="w-full bg-secondary/30 border border-border/40 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/50" />
            <input value={title} onChange={e => setTitle(e.target.value.slice(0, 120))} placeholder="Title"
              className="w-full bg-secondary/30 border border-border/40 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/50" />
            <textarea value={body} onChange={e => setBody(e.target.value.slice(0, 2000))} rows={5} placeholder="Body (markdown-free plain text)"
              className="w-full bg-secondary/30 border border-border/40 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/50 resize-none" />
            <button onClick={post} disabled={posting}
              className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-display font-semibold disabled:opacity-50 hover:neon-glow">
              <Send className="w-4 h-4" /> {posting ? 'Posting…' : 'Post to all users'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InboxPage;
