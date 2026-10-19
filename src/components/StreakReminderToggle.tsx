/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Bell, BellRing, Check, Shield } from 'lucide-react';
import { 
  isNotificationSupported, 
  isStreakReminderEnabled, 
  enableStreakReminder, 
  disableStreakReminder 
} from '@/lib/streakNotifications';
import { toast } from 'sonner';

interface StreakReminderToggleProps {
  className?: string;
  compact?: boolean;
}

export const StreakReminderToggle: React.FC<StreakReminderToggleProps> = ({
  className = '',
  compact = false,
}) => {
  const [enabled, setEnabled] = useState(false);
  const [supported, setSupported] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSupported(isNotificationSupported());
    setEnabled(isStreakReminderEnabled());
  }, []);

  if (!supported) return null;

  const handleToggle = async () => {
    if (loading) return;
    setLoading(true);

    if (enabled) {
      disableStreakReminder();
      setEnabled(false);
      toast.info('Streak reminder notifications disabled');
      setLoading(false);
    } else {
      const res = await enableStreakReminder();
      setLoading(false);
      if (res.success) {
        setEnabled(true);
        toast.success("🔔 Streak reminder active! We'll alert you at 6:00 PM if your streak is at risk.");
      } else {
        toast.error(res.error || 'Could not enable notification permission');
      }
    }
  };

  if (compact) {
    return (
      <button
        onClick={handleToggle}
        disabled={loading}
        title={enabled ? 'Streak reminder active (6 PM)' : 'Enable 6 PM streak reminder'}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-mono transition-all ${
          enabled 
            ? 'bg-primary/20 text-primary border border-primary/40' 
            : 'bg-secondary/60 hover:bg-secondary text-muted-foreground hover:text-foreground border border-border/50'
        } ${className}`}
      >
        {enabled ? <BellRing className="w-3.5 h-3.5 text-primary animate-pulse" /> : <Bell className="w-3.5 h-3.5" />}
        <span>{enabled ? 'Reminders On' : 'Remind Me'}</span>
      </button>
    );
  }

  return (
    <div className={`flex items-center justify-between gap-3 p-3 rounded-xl bg-secondary/30 border border-border/50 backdrop-blur-xs ${className}`}>
      <div className="flex items-center gap-2.5 min-w-0">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${enabled ? 'bg-primary/20 text-primary' : 'bg-secondary text-muted-foreground'}`}>
          {enabled ? <BellRing className="w-4 h-4 text-primary" /> : <Bell className="w-4 h-4" />}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold font-display text-foreground">
              Daily Streak Reminder
            </span>
            {enabled && (
              <span className="text-[10px] font-mono text-emerald-400 font-medium px-1.5 py-0.2 rounded bg-emerald-500/10 border border-emerald-500/20">
                Active (6 PM)
              </span>
            )}
          </div>
          <p className="text-[11px] text-muted-foreground truncate">
            {enabled
              ? 'Local alert at 6:00 PM if no lesson is completed today'
              : 'Never lose your streak with a gentle evening browser alert'}
          </p>
        </div>
      </div>

      <button
        onClick={handleToggle}
        disabled={loading}
        className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium shrink-0 transition-all ${
          enabled
            ? 'bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground border border-border/70'
            : 'bg-primary text-primary-foreground hover:neon-glow font-bold'
        }`}
      >
        {loading ? '...' : enabled ? 'Disable' : 'Enable'}
      </button>
    </div>
  );
};

export default StreakReminderToggle;
