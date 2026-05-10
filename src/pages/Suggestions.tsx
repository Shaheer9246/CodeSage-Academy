import { useState, useEffect } from 'react';
import { ArrowLeft, Send, Lock, MessageSquare, Trash2, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { useUser } from '@/contexts/UserContext';

interface Suggestion {
  id: string;
  user: string;
  text: string;
  date: string;
  reply?: string;
  replyDate?: string;
}

const ADMIN_PASSWORD = 'codesage-admin-2026';
const STORAGE_KEY = 'codesage_suggestions_v2';

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
  const [adminMode, setAdminMode] = useState(false);
  const [pwInput, setPwInput] = useState('');
  const [pwError, setPwError] = useState('');
  const [replyText, setReplyText] = useState<Record<string, string>>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);

  const persist = (next: Suggestion[]) => {
    setItems(next);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
  };

  const submit = () => {
    if (!text.trim()) return;
    const entry: Suggestion = {
      id: crypto.randomUUID(),
      user: user?.username || 'anonymous',
      text: text.trim(),
      date: new Date().toISOString(),
    };
    persist([entry, ...items]);
    setText('');
    toast.success('Thanks for your feedback! 💚');
  };

  const tryUnlockAdmin = () => {
    if (pwInput === ADMIN_PASSWORD) {
      setAdminMode(true);
      setPwError('');
      setPwInput('');
      toast.success('Admin mode unlocked');
    } else {
      setPwError('Incorrect password');
    }
  };

  const sendReply = (id: string) => {
    const r = (replyText[id] || '').trim();
    if (!r) return;
    persist(items.map(s => s.id === id ? { ...s, reply: r, replyDate: new Date().toISOString() } : s));
    setReplyText(prev => ({ ...prev, [id]: '' }));
    toast.success('Reply saved');
  };

  const remove = (id: string) => {
    if (!confirm('Delete this suggestion?')) return;
    persist(items.filter(s => s.id !== id));
  };

  return (
    <div className="min-h-screen bg-background grid-bg relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full bg-primary/3 blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 max-w-lg mx-auto p-4 sm:p-6 space-y-5"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/dashboard')} className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold font-display">
              <span className="text-primary neon-text">Suggestions</span>
            </h1>
          </div>
          {adminMode && (
            <span className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/30">
              <ShieldCheck className="w-3 h-3" /> Admin
            </span>
          )}
        </div>

        {/* Prompt box */}
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
            onChange={e => setText(e.target.value)}
            placeholder="Type your suggestion..."
            rows={4}
            className="w-full bg-secondary/30 border border-border/40 rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 resize-none font-sans"
          />
          <button
            onClick={submit}
            disabled={!text.trim()}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-xs font-display font-semibold disabled:opacity-30 hover:neon-glow transition-all"
          >
            <Send className="w-3.5 h-3.5" /> Send
          </button>
        </div>

        {/* Admin login */}
        {!adminMode && (
          <div className="glass-card p-4 rounded-2xl">
            <p className="text-[10px] text-muted-foreground flex items-center gap-1.5 mb-2">
              <Lock className="w-3 h-3" /> Admin? Enter password to reply.
            </p>
            <div className="flex gap-2">
              <input
                type="password"
                value={pwInput}
                onChange={e => setPwInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && tryUnlockAdmin()}
                placeholder="admin password"
                className="flex-1 bg-secondary/40 border border-border/40 rounded-lg px-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-primary/50 font-mono"
              />
              <button onClick={tryUnlockAdmin} className="bg-secondary text-foreground px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-primary/20">
                Unlock
              </button>
            </div>
            {pwError && <p className="text-[10px] text-destructive mt-1">{pwError}</p>}
          </div>
        )}

        {/* Suggestion list */}
        <div className="space-y-2">
          <h3 className="text-xs font-display font-semibold text-muted-foreground uppercase tracking-wider">
            All Suggestions ({items.length})
          </h3>
          {items.length === 0 && (
            <div className="glass-card p-5 rounded-2xl text-center">
              <p className="text-xs text-muted-foreground">No suggestions yet. Be the first!</p>
            </div>
          )}
          {items.map(s => (
            <div key={s.id} className="glass-card p-4 rounded-2xl space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] text-primary font-mono">@{s.user}</p>
                  <p className="text-sm text-foreground whitespace-pre-wrap break-words">{s.text}</p>
                  <p className="text-[9px] text-muted-foreground mt-1">{new Date(s.date).toLocaleString()}</p>
                </div>
                {adminMode && (
                  <button onClick={() => remove(s.id)} className="text-muted-foreground hover:text-destructive p-1">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {s.reply && (
                <div className="pl-3 border-l-2 border-primary/40 bg-primary/5 rounded-r-lg p-2.5">
                  <p className="text-[10px] text-primary font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Admin reply
                  </p>
                  <p className="text-xs text-foreground mt-0.5 whitespace-pre-wrap break-words">{s.reply}</p>
                  {s.replyDate && <p className="text-[9px] text-muted-foreground mt-1">{new Date(s.replyDate).toLocaleString()}</p>}
                </div>
              )}

              {adminMode && !s.reply && (
                <div className="flex gap-2 pt-1">
                  <input
                    value={replyText[s.id] || ''}
                    onChange={e => setReplyText(prev => ({ ...prev, [s.id]: e.target.value }))}
                    onKeyDown={e => e.key === 'Enter' && sendReply(s.id)}
                    placeholder="Write a reply..."
                    className="flex-1 bg-secondary/40 border border-border/30 rounded-lg px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:border-primary/50"
                  />
                  <button onClick={() => sendReply(s.id)} className="bg-primary text-primary-foreground px-3 py-1.5 rounded-lg text-xs font-semibold hover:opacity-90">
                    Reply
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Suggestions;
