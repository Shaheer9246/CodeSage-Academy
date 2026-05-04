import { Lock } from 'lucide-react';
import { motion } from 'framer-motion';

const CommunityPage = () => {
  return (
    <div className="min-h-screen bg-background grid-bg flex items-center justify-center p-4">
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-card p-8 rounded-2xl text-center max-w-sm">
        <div className="w-16 h-16 rounded-2xl bg-secondary/30 flex items-center justify-center mx-auto mb-4 border border-border/30">
          <Lock className="w-8 h-8 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-bold font-display text-foreground mb-2">Community</h2>
        <p className="text-sm text-muted-foreground">Coming Soon</p>
        <p className="text-xs text-muted-foreground mt-2">Connect with fellow coders, share projects, and learn together.</p>
      </motion.div>
    </div>
  );
};

export default CommunityPage;
