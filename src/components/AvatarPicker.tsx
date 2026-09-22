import { useState, useEffect } from 'react';
import { Shuffle, Check, X } from 'lucide-react';

const STYLES = [
  { id: 'pixel-art', label: 'Pixel' },
  { id: 'bottts', label: 'Bots' },
  { id: 'adventurer', label: 'Hero' },
  { id: 'shapes', label: 'Shapes' },
  { id: 'identicon', label: 'Geo' },
  { id: 'thumbs', label: 'Thumbs' },
] as const;

export function dicebearUrl(style: string, seed: string) {
  return `https://api.dicebear.com/9.x/${style}/svg?seed=${encodeURIComponent(seed)}&backgroundColor=0f172a,1e293b,134e4a,1f2937`;
}

export function getStoredAvatar(userId?: string): string | null {
  if (!userId) return null;
  try { return localStorage.getItem(`codesage_avatar_${userId}`); } catch { return null; }
}

export function setStoredAvatar(userId: string, url: string) {
  try { localStorage.setItem(`codesage_avatar_${userId}`, url); } catch { /* ignore */ }
}

interface Props {
  userId: string;
  initialSeed?: string;
  onClose: () => void;
  onSave: (url: string) => void;
}

export default function AvatarPicker({ userId, initialSeed, onClose, onSave }: Props) {
  const [style, setStyle] = useState<string>('pixel-art');
  const [seed, setSeed] = useState<string>(initialSeed || userId.slice(0, 8));

  useEffect(() => {
    const stored = getStoredAvatar(userId);
    if (stored) {
      // best-effort parse for the seed/style from URL
      const m = stored.match(/9\.x\/([^/]+)\/svg\?seed=([^&]+)/);
      if (m) { setStyle(m[1]); setSeed(decodeURIComponent(m[2])); }
    }
  }, [userId]);

  const previewUrl = dicebearUrl(style, seed);

  const handleSave = () => {
    setStoredAvatar(userId, previewUrl);
    onSave(previewUrl);
    onClose();
  };

  const handleRandom = () => setSeed(Math.random().toString(36).slice(2, 10));

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="glass-card w-full max-w-md rounded-2xl p-5 space-y-4" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-display font-bold text-foreground">Choose your avatar</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-1"><X className="w-4 h-4" /></button>
        </div>

        <div className="flex items-center justify-center">
          <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-primary/40 neon-glow bg-secondary/40">
            <img src={previewUrl} alt="Avatar preview" className="w-full h-full" />
          </div>
        </div>

        <div>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">Style</p>
          <div className="grid grid-cols-3 gap-1.5">
            {STYLES.map(s => (
              <button key={s.id} onClick={() => setStyle(s.id)}
                className={`px-2 py-1.5 rounded-lg text-[11px] font-display border transition-all ${
                  style === s.id ? 'bg-primary/15 text-primary border-primary/40' : 'bg-secondary/30 text-muted-foreground border-border/30'
                }`}>{s.label}</button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">Seed</p>
          <div className="flex gap-2">
            <input value={seed} onChange={e => setSeed(e.target.value.slice(0, 24))}
              className="flex-1 bg-secondary/30 border border-border/40 rounded-lg px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:border-primary/50 font-mono" />
            <button onClick={handleRandom}
              className="flex items-center gap-1 bg-secondary/40 border border-border/40 rounded-lg px-3 py-1.5 text-[11px] text-foreground hover:bg-secondary/60">
              <Shuffle className="w-3 h-3" /> Random
            </button>
          </div>
        </div>

        <button onClick={handleSave}
          className="w-full bg-primary text-primary-foreground rounded-xl py-2.5 text-sm font-display font-semibold flex items-center justify-center gap-2 hover:opacity-90">
          <Check className="w-4 h-4" /> Save Avatar
        </button>
      </div>
    </div>
  );
}
