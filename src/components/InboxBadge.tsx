import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Inbox } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/contexts/UserContext';

// Small header pill that shows unread admin-announcement count and navigates to /inbox.
export default function InboxBadge() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [unread, setUnread] = useState(0);

  const refresh = useCallback(async () => {
    if (!user) return;
    const [{ data: ann }, { data: reads }] = await Promise.all([
      supabase.from('announcements').select('id'),
      supabase.from('announcement_reads').select('announcement_id').eq('user_id', user.id),
    ]);
    const seen = new Set(((reads || []) as { announcement_id: string }[]).map(r => r.announcement_id));
    const total = ((ann || []) as { id: string }[]).filter(a => !seen.has(a.id)).length;
    setUnread(total);
  }, [user]);

  useEffect(() => {
    refresh();
    const onRead = () => refresh();
    window.addEventListener('inbox:read', onRead);
    
    // Change 'announcements-badge' to use a random string suffix:
    const ch = supabase
      .channel(`announcements-badge-${Math.random()}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'announcements' }, refresh)
      .subscribe();
      
    return () => {
      window.removeEventListener('inbox:read', onRead);
      supabase.removeChannel(ch);
    };
  }, [refresh]);

  return (
    <button
      onClick={() => navigate('/inbox')}
      title="Inbox"
      className="relative flex items-center gap-1 bg-secondary/40 border border-border/40 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-full hover:neon-glow transition-all"
    >
      <Inbox className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primary" />
      {unread > 0 && (
        <span className="text-[10px] font-bold text-primary min-w-[14px] text-center">{unread > 9 ? '9+' : unread}</span>
      )}
    </button>
  );
}
