import { useEffect, useState, useCallback } from 'react';
import { Inbox } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/contexts/UserContext';

interface InboxBadgeProps {
  className?: string;
}

export default function InboxBadge({ className }: { className?: string }) {
  const { user } = useUser();
  const [unread, setUnread] = useState(0);

  const refresh = useCallback(async () => {
    if (!user?.id) return;
    const [{ data: ann }, { data: reads }] = await Promise.all([
      supabase.from('announcements').select('id'),
      supabase.from('announcement_reads').select('announcement_id').eq('user_id', user!.id),
    ]);
    const seen = new Set(((reads || []) as { announcement_id: string }[]).map(r => r.announcement_id));
    const total = ((ann || []) as { id: string }[]).filter(a => !seen.has(a.id)).length;
    setUnread(total);
  }, [user?.id]);

  useEffect(() => {
    refresh();
    const onRead = () => refresh();
    window.addEventListener('inbox:read', onRead);
    
    const ch = supabase
      .channel(`announcements-badge-${user!.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'announcements' }, refresh)
      .subscribe();
      
    return () => {
      window.removeEventListener('inbox:read', onRead);
      supabase.removeChannel(ch);
    };
  }, [refresh]);

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
