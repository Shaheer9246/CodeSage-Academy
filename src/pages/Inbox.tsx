import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Inbox as InboxIcon, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUser } from '@/contexts/UserContext';
import { supabase } from '@/integrations/supabase/client';

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
        // Still mark cached announcements as read so the badge clears immediately
        if (user?.id && parsed.length > 0) {
          const key = `codesage_inbox_seen_${user.id}`;
          let seen: string[] = [];
          try { seen = JSON.parse(localStorage.getItem(key) || '[]'); } catch { seen = []; }
          const unseen = parsed.filter((a: Announcement) => !seen.includes(a.id));
          if (unseen.length) {
            supabase
              .from('announcement_reads')
              .upsert(unseen.map((a: Announcement) => ({ user_id: user.id, announcement_id: a.id })), { onConflict: 'user_id,announcement_id' })
              .then(() => {
                localStorage.setItem(key, JSON.stringify(parsed.map((a: Announcement) => a.id)));
                localStorage.setItem(`codesage_badge_unread_${user.id}`, '0');
                window.dispatchEvent(new Event('inbox:read'));
              });
          }
        }
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
                  <p className="text-[10px] font-mono text-primary uppercase tracking-wider">CodeSage Official</p>
                  <div className="ml-auto">
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
    </div>
  );
};

export default InboxPage;
