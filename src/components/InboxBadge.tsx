import { useEffect, useState, useCallback } from 'react';
import { Inbox } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/contexts/UserContext';

interface InboxBadgeProps {
  className?: string;
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

    // Throttle: at most one server check per 60 seconds (unless forced).
    if (!force) {
      const last = Number(localStorage.getItem(timeKey) || 0);
      if (Date.now() - last < 60000) {
        setUnread(Number(localStorage.getItem(cacheKey) || 0));
        return;
      }
    }
    try { localStorage.setItem(timeKey, String(Date.now())); } catch { /* ignore */ }

    const [{ data: ann }, { data: reads }] = await Promise.all([
      supabase.from('announcements').select('id'),
      supabase.from('announcement_reads').select('announcement_id').eq('user_id', user!.id),
    ]);
    const seen = new Set(((reads || []) as { announcement_id: string }[]).map(r => r.announcement_id));
    const total = ((ann || []) as { id: string }[]).filter(a => !seen.has(a.id)).length;
    setUnread(total);
    try { localStorage.setItem(cacheKey, String(total)); } catch { /* ignore */ }
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id) return;
    refresh();
    const onRead = () => refresh(true);
    window.addEventListener('inbox:read', onRead);

    // Unique channel name per mount: prevents the
    // "cannot add postgres_changes callbacks after subscribe()" crash
    // when React remounts this component quickly.
    const ch = supabase
      .channel(`announcements-badge-${user.id}-${Date.now()}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'announcements' }, () => refresh(true))
      .subscribe();

    return () => {
      window.removeEventListener('inbox:read', onRead);
      supabase.removeChannel(ch);
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
