import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/contexts/UserContext';

export default function SuggestionsBadge() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (!user) return;
    
    let isActive = true;

    const fetchUnread = async () => {
      const { data: read } = await supabase
        .from('suggestion_reads')
        .select('last_seen_at')
        .eq('user_id', user.id)
        .maybeSingle();
        
      const since = (read as { last_seen_at: string } | null)?.last_seen_at || '1970-01-01';
      
      const { data: rows } = await supabase
        .from('suggestions')
        .select('id, user_id, updated_at, reply_at')
        .gt('updated_at', since);

      // Count other people's new/edited posts, plus admin replies on your own posts.
      const list = (rows || []) as { id: string; user_id: string; updated_at: string; reply_at: string | null }[];
      const count = list.filter(r =>
        r.user_id !== user.id || (r.reply_at ? r.reply_at > since : false),
      ).length;

      if (isActive) setUnread(count);
    };

    fetchUnread();

    const onRead = () => fetchUnread();
    window.addEventListener('suggestions:read', onRead);

    // FIX: Use a unique channel name. This prevents the "cannot add callbacks after subscribe" 
    // error that happens when React remounts the component faster than Supabase cleans up.
    const channelName = `suggestions-badge-${user.id}-${Date.now()}`;
    
    const ch = supabase
      .channel(channelName)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'suggestions' }, fetchUnread)
      .subscribe();

    // Safety net: if the realtime socket drops, still refresh every 60s.
    const poll = setInterval(fetchUnread, 60_000);
    const onFocus = () => fetchUnread();
    window.addEventListener('focus', onFocus);

    return () => {
      isActive = false;
      clearInterval(poll);
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('suggestions:read', onRead);
      supabase.removeChannel(ch);
    };
  }, [user]);

  return (
    <button
      onClick={() => navigate('/suggestions')}
      title="Suggestions"
      className="relative flex items-center gap-1 bg-secondary/40 border border-border/40 px-2.5 py-1.5 rounded-full hover:neon-glow transition-all active:scale-95"
    >
      <MessageSquare className="w-3.5 h-3.5 text-primary" />
      {unread > 0 && (
        <span className="text-[10px] font-bold text-primary min-w-[14px] text-center">
          {unread > 9 ? '9+' : unread}
        </span>
      )}
    </button>
  );
}
