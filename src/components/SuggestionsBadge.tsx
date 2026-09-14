import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/contexts/UserContext';

// In-memory single-flight deduplication & shared state across mounts
let inFlightSuggPromise: Promise<number> | null = null;
const suggListeners = new Set<(count: number) => void>();

function notifySuggBadge(count: number) {
  suggListeners.forEach(listener => listener(count));
}

export default function SuggestionsBadge() {
  const navigate = useNavigate();
  const { user } = useUser();
  
  // Show the last known unread count instantly from cache (no server wait).
  const [unread, setUnread] = useState<number>(() => {
    if (!user?.id) return 0;
    try {
      return Number(localStorage.getItem(`codesage_sugg_badge_unread_${user.id}`) || 0);
    } catch {
      return 0;
    }
  });

  const refresh = useCallback(async (force = false) => {
    if (!user?.id) return;

    const cacheKey = `codesage_sugg_badge_unread_${user.id}`;
    const timeKey = `codesage_sugg_badge_time_${user.id}`;

    // Throttle: at most one server check per 30 minutes (unless forced by post/read event).
    if (!force) {
      const last = Number(localStorage.getItem(timeKey) || 0);
      if (Date.now() - last < 30 * 60 * 1000) {
        const cachedCount = Number(localStorage.getItem(cacheKey) || 0);
        setUnread(cachedCount);
        notifySuggBadge(cachedCount);
        return;
      }
    }

    if (inFlightSuggPromise) {
      const count = await inFlightSuggPromise;
      setUnread(count);
      return;
    }

    inFlightSuggPromise = (async () => {
      try {
        try { localStorage.setItem(timeKey, String(Date.now())); } catch { /* ignore */ }

        const { data: read } = await supabase
          .from('suggestion_reads')
          .select('last_seen_at')
          .eq('user_id', user.id)
          .maybeSingle();
          
        const since = (read as { last_seen_at: string } | null)?.last_seen_at || '1970-01-01';
        
        const { data: rows } = await (supabase as any)
          .from('suggestions_public')
          .select('id, is_mine, updated_at, reply_at')
          .gt('updated_at', since);

        // Count other people's new/edited posts, plus admin replies on your own posts.
        const list = (rows || []) as { id: string; is_mine: boolean; updated_at: string; reply_at: string | null }[];
        const count = list.filter(r =>
          !r.is_mine || (r.reply_at ? r.reply_at > since : false),
        ).length;

        try { localStorage.setItem(cacheKey, String(count)); } catch { /* ignore */ }
        notifySuggBadge(count);
        return count;
      } finally {
        inFlightSuggPromise = null;
      }
    })();

    const result = await inFlightSuggPromise;
    setUnread(result);
  }, [user?.id]);

  useEffect(() => {
    const handleUpdate = (count: number) => setUnread(count);
    suggListeners.add(handleUpdate);
    return () => {
      suggListeners.delete(handleUpdate);
    };
  }, []);

  useEffect(() => {
    if (!user?.id) return;
    
    // Initial load (uses 30-min cache)
    refresh();

    const onRead = () => refresh(true);
    window.addEventListener('suggestions:read', onRead);

    return () => {
      window.removeEventListener('suggestions:read', onRead);
    };
  }, [user?.id, refresh]);

  return (
    <button
      onClick={() => navigate('/suggestions')}
      title="Suggestions"
      className="relative flex items-center gap-1 bg-secondary/40 border border-border/40 px-2.5 py-1.5 rounded-full hover:neon-glow transition-all active:scale-95"
    >
      <MessageSquare className="w-3.5 h-3.5 text-primary" />
      {unread > 0 && (
        <>
          <span className="text-[10px] font-bold text-primary min-w-[14px] text-center">
            {unread > 9 ? '9+' : unread}
          </span>
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-primary animate-pulse border border-background" />
        </>
      )}
    </button>
  );
}
