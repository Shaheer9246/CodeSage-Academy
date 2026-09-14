import { useEffect, useState, useCallback } from 'react';
import { Inbox } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/contexts/UserContext';

interface InboxBadgeProps {
  className?: string;
}

// In-memory single-flight deduplication & shared state across desktop and mobile badge instances
let inFlightInboxPromise: Promise<number> | null = null;
const badgeListeners = new Set<(count: number) => void>();

function notifyInboxBadge(count: number) {
  badgeListeners.forEach(listener => listener(count));
}

export default function InboxBadge({ className }: InboxBadgeProps) {
  const { user } = useUser();

  // Show the last known unread count instantly from cache (no server wait).
  const [unread, setUnread] = useState<number>(() => {
    if (!user?.id) return 0;
    try {
      return Number(localStorage.getItem(`codesage_badge_unread_${user.id}`) || 0);
    } catch {
      return 0;
    }
  });

  const refresh = useCallback(async (force = false) => {
    if (!user?.id) return;

    const cacheKey = `codesage_badge_unread_${user.id}`;
    const timeKey = `codesage_badge_time_${user.id}`;

    // Throttle: at most one server check per 30 minutes (unless forced by an inbox event).
    if (!force) {
      const last = Number(localStorage.getItem(timeKey) || 0);
      if (Date.now() - last < 30 * 60 * 1000) {
        const cachedCount = Number(localStorage.getItem(cacheKey) || 0);
        setUnread(cachedCount);
        notifyInboxBadge(cachedCount);
        return;
      }
    }

    // Reuse in-flight promise if another instance (e.g. mobile/desktop nav) is already querying
    if (inFlightInboxPromise) {
      const total = await inFlightInboxPromise;
      setUnread(total);
      return;
    }

    inFlightInboxPromise = (async () => {
      try {
        try { localStorage.setItem(timeKey, String(Date.now())); } catch { /* ignore */ }

        const [{ data: ann }, { data: reads }] = await Promise.all([
          supabase.from('announcements').select('id'),
          supabase.from('announcement_reads').select('announcement_id').eq('user_id', user!.id),
        ]);
        const seen = new Set(((reads || []) as { announcement_id: string }[]).map(r => r.announcement_id));
        const total = ((ann || []) as { id: string }[]).filter(a => !seen.has(a.id)).length;
        try { localStorage.setItem(cacheKey, String(total)); } catch { /* ignore */ }
        notifyInboxBadge(total);
        return total;
      } finally {
        inFlightInboxPromise = null;
      }
    })();

    const count = await inFlightInboxPromise;
    setUnread(count);
  }, [user?.id]);

  useEffect(() => {
    const handleUpdate = (count: number) => setUnread(count);
    badgeListeners.add(handleUpdate);
    return () => {
      badgeListeners.delete(handleUpdate);
    };
  }, []);

  useEffect(() => {
    if (!user?.id) return;
    refresh();

    const onRead = () => refresh(true);
    window.addEventListener('inbox:read', onRead);

    return () => {
      window.removeEventListener('inbox:read', onRead);
    };
  }, [user?.id, refresh]);

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <Inbox className="w-full h-full" />
      {unread > 0 && (
        <span className="absolute -top-1.5 -right-1.5 bg-primary text-primary-foreground text-[8px] font-black min-w-[14px] h-3.5 rounded-full flex items-center justify-center px-0.5 shadow-[0_0_6px_rgba(0,0,0,0.5)] border border-background animate-pulse">
          {unread > 9 ? '9+' : unread}
        </span>
      )}
    </div>
  );
}
