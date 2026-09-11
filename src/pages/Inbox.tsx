import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Inbox as InboxIcon, Shield, X, Send, ShieldCheck, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/contexts/UserContext';

// NOTE: Change this to your desired password. Keep it consistent with your Suggestions page.
const ADMIN_PASSWORD = "sage_admin_2024";

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
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [posting, setPosting] = useState(false);

  // Edit state
  const [editingItem, setEditingItem] = useState<Announcement | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editBody, setEditBody] = useState('');
  const [updating, setUpdating] = useState(false);

  // Admin password protection states
  const [isAdminVerified, setIsAdminVerified] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');

  const startEdit = (item: Announcement) => {
    setEditingItem(item);
    setEditTitle(item.title);
    setEditBody(item.body);
  };

  const saveEdit = async () => {
    if (!editingItem || !editTitle.trim() || !editBody.trim()) {
      toast.error('Fill all fields');
      return;
    }
    setUpdating(true);
    const { error } = await supabase
      .from('announcements')
      .update({
        title: editTitle.trim().slice(0, 120),
        body: editBody.trim().slice(0, 2000),
      })
      .eq('id', editingItem.id);

    setUpdating(false);
    if (error) {
      toast.error('Failed to update announcement');
      return;
    }
    toast.success('Announcement updated');
    setEditingItem(null);
    refresh();
  };

  const handleShieldClick = () => {
    if (isAdminVerified) {
      setShowCompose(true);
    } else {
      setShowPasswordModal(true);
      setAdminPassword('');
    }
  };

  const confirmAdminPassword = () => {
    if (adminPassword === ADMIN_PASSWORD) {
      setIsAdminVerified(true);
      setShowPasswordModal(false);
      setAdminPassword('');
      setShowCompose(true);
      toast.success('Admin access granted');
    } else {
      toast.error('Incorrect admin password');
    }
  };

  const refresh = useCallback(async () => {
    const cacheKey = 'codesage_inbox_announcements';
    const cacheTimeKey = 'codesage_inbox_announcements_time';
    const now = Date.now();
    const cachedTime = Number(localStorage.getItem(cacheTimeKey) || 0);
    const cachedData = localStorage.getItem(cacheKey);

    // If cached less than 30 minutes ago, load from localStorage with ZERO database egress
    if (cachedData && now - cachedTime < 30 * 60 * 1000) {
      try {
        const parsed = JSON.parse(cachedData);
        setItems(parsed);
        return;
      } catch {
        // fallback to fetch if parse fails
      }
    }

    const { data, error } = await supabase
      .from('announcements')
      .select('id, title, body, created_at')
      .order('created_at', { ascending: false });
    if (error) { console.error(error); return; }
    const list = (data || []) as Announcement[];
    setItems(list);
    try {
      localStorage.setItem(cacheKey, JSON.stringify(list));
      localStorage.setItem(cacheTimeKey, String(now));
    } catch {}
    
    // Mark all seen ids as read
    if (user?.id) {
      const key = `codesage_inbox_seen_${user.id}`;
      let seen: string[] = [];
      try { seen = JSON.parse(localStorage.getItem(key) || '[]'); } catch { seen = []; }
      const unseen = list.filter(a => !seen.includes(a.id));
      if (unseen.length) {
        const readsToInsert = unseen.map(a => ({
          user_id: user.id,
          announcement_id: a.id
        }));
        
        const { error: batchError } = await supabase
          .from('announcement_reads')
          .upsert(readsToInsert, { onConflict: 'user_id,announcement_id' });
          
        if (batchError) {
          console.error('Failed to batch mark announcements as read:', batchError);
        }
        
        try { localStorage.setItem(key, JSON.stringify(list.map(a => a.id))); } catch { /* ignore */ }
        window.dispatchEvent(new Event('inbox:read'));
      }
    }
  }, [user?.id]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const post = async () => {
    if (!title.trim() || !body.trim()) { toast.error('Fill all fields'); return; }
    setPosting(true);
    const { error } = await supabase.rpc('post_announcement', {
      _title: title.trim().slice(0, 120),
      _body: body.trim().slice(0, 2000),
    });
    setPosting(false);
    if (error) { toast.error('Admin access required'); return; }
    toast.success('Announcement posted');
    setShowCompose(false);
    setTitle(''); setBody('');
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
            title={isAdminVerified ? "Post announcement" : "Admin access"}
            onClick={handleShieldClick}
            className={`p-2 rounded-lg transition-colors ${
              isAdminVerified 
                ? 'text-primary bg-primary/10 hover:bg-primary/20' 
                : 'text-muted-foreground hover:text-primary hover:bg-primary/10'
            }`}
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
                  <div className="ml-auto flex items-center gap-2">
                    {isAdminVerified && (
                      <button
                        onClick={() => startEdit(a)}
                        className="text-[10px] text-primary hover:underline font-mono"
                      >
                        Edit
                      </button>
                    )}
                    <p className="text-[10px] text-muted-foreground">
                      {new Date(a.created_at).toLocaleString()}
                    </p>
                  </div>
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

      {/* Edit Announcement Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card rounded-2xl p-5 w-full max-w-md border border-primary/30 neon-glow space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-sm flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" /> Edit Announcement
              </h3>
              <button onClick={() => setEditingItem(null)} className="text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>
            <input
              value={editTitle}
              onChange={e => setEditTitle(e.target.value.slice(0, 120))}
              placeholder="Title"
              className="w-full bg-secondary/30 border border-border/40 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/50"
            />
            <textarea
              value={editBody}
              onChange={e => setEditBody(e.target.value.slice(0, 2000))}
              rows={5}
              placeholder="Body"
              className="w-full bg-secondary/30 border border-border/40 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/50 resize-none"
            />
            <button
              onClick={saveEdit}
              disabled={updating}
              className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-display font-semibold disabled:opacity-50 hover:neon-glow"
            >
              {updating ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </div>
      )} 

      {/* Compose Announcement Modal */}
      {showCompose && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-card rounded-2xl p-5 w-full max-w-md border border-primary/30 neon-glow space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-sm flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" /> Admin Announcement
              </h3>
              <button onClick={() => setShowCompose(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>
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
              Please enter the admin password to manage announcements.
            </p>
            <input
              type="password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              placeholder="Enter admin password"
              className="w-full bg-secondary/50 border border-border/50 rounded-xl px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/50"
              onKeyDown={(e) => e.key === 'Enter' && confirmAdminPassword()}
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={confirmAdminPassword}
                className="flex-1 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                Verify
              </button>
              <button
                onClick={() => { setShowPasswordModal(false); setAdminPassword(''); }}
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

export default InboxPage;
