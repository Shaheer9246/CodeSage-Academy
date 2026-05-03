import { useState } from 'react';
import { ArrowLeft, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const Suggestions = () => {
  const navigate = useNavigate();
  const [text, setText] = useState('');

  const handleSubmit = () => {
    if (!text.trim()) return;
    const existing = JSON.parse(localStorage.getItem('codesage_suggestions') || '[]');
    existing.push({ text: text.trim(), date: new Date().toISOString() });
    localStorage.setItem('codesage_suggestions', JSON.stringify(existing));
    setText('');
    toast.success('Thanks for your feedback! 💚');
  };

  return (
    <div className="min-h-screen bg-background grid-bg relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full bg-primary/3 blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 max-w-lg mx-auto p-4 sm:p-6 space-y-6"
      >
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/dashboard')} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold font-display">
            <span className="text-primary neon-text">Community & Suggestions</span>
          </h1>
        </div>

        <div className="glass-card p-5 space-y-4">
          <h3 className="text-sm font-display font-semibold text-foreground">Have an idea? Tell us!</h3>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="What feature or improvement would you love to see?"
            rows={5}
            className="w-full bg-secondary/30 border border-border/40 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 resize-none font-sans"
          />
          <button
            onClick={handleSubmit}
            disabled={!text.trim()}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-display font-semibold disabled:opacity-30 hover:neon-glow transition-all"
          >
            <Send className="w-4 h-4" />
            Send Feedback
          </button>
        </div>

        <div className="glass-card p-5">
          <h3 className="text-sm font-display font-semibold text-foreground mb-3">Leaderboard (Coming Soon)</h3>
          <p className="text-xs text-muted-foreground">Community features like leaderboards, forums, and peer challenges are on the way!</p>
        </div>
      </motion.div>
    </div>
  );
};

export default Suggestions;
