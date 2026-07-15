import { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { GraduationCap, AlertTriangle, ArrowRight, PauseCircle, StopCircle } from 'lucide-react';
import {
  TrackId, TRACK_META, enroll, activeCount, getEnrollments, isEnrolled, isActive,
  pause as pauseTrack, end as endTrack, onEnrollmentChange
} from '@/lib/enrollment';
import { useUser } from '@/contexts/UserContext';

interface Props {
  open: boolean;
  track: TrackId | null;
  onClose: () => void;
  onEnrolled?: (track: TrackId) => void;
}

type Step = 'limit' | 'prereq' | 'idcard';

const PREREQ_COPY: Partial<Record<TrackId, { title: string; body: string; ctas: { label: string; route: string }[] }>> = {
  fullstack: {
    title: 'Did you complete Frontend Development?',
    body: 'Full-Stack builds directly on HTML, CSS, and JavaScript. Finish the Frontend track first so this course feels like leveling up — not learning from scratch.',
    ctas: [{ label: 'Go to Frontend course', route: '/learn' }],
  },
  freelance: {
    title: 'Are you ready to sell your work?',
    body: 'Freelancing is easier when you already have a skill to sell. Please complete Frontend Development and Full-Stack Frontend Development first — then this course will show you how to turn those skills into income.',
    ctas: [
      { label: 'Frontend course', route: '/learn' },
      { label: 'Full-Stack course', route: '/fullstack' },
    ],
  },
  local: {
    title: 'Start with Frontend Development',
    body: 'Before starting this track, you should know how a website works and be familiar with frontend development. We recommend completing the Frontend track first.',
    ctas: [{ label: 'Frontend course', route: '/learn' }],
  },
  python: {
    title: 'Start with Computer & Networking',
    body: 'Python runs on real machines. If you understand how computers, memory, and networks work, Python concepts click much faster. We recommend finishing Computer & Networking first.',
    ctas: [{ label: 'Networking course', route: '/networking' }],
  },
  sql: {
    title: 'Start with Frontend Development',
    body: 'Before diving into SQL and databases, a person should know about frontend or python programming. We recommend completing Frontend Development first so you understand how applications interact with data.',
    ctas: [{ label: 'Frontend course', route: '/learn' }],
  },
  pythonexpert: {
    title: 'Finish Python Programming first',
    body: 'Python Expert is an advanced-level track that builds directly on Python Programming (beginner → intermediate → advanced). Please complete Python Programming first — otherwise the expert lessons will be hard to follow.',
    ctas: [{ label: 'Python Programming course', route: '/python' }],
  },
};

export default function EnrollDialog({ open, track, onClose, onEnrolled }: Props) {
  const navigate = useNavigate();
  const { user } = useUser();
  const [tick, setTick] = useState(0); // force re-read after pause/end
  const refresh = () => setTick(t => t + 1);

  // Sync state with global enrollment cache changes instantly
  useEffect(() => {
    return onEnrollmentChange(() => {
      setTick(t => t + 1);
    });
  }, []);

  const step: Step = useMemo(() => {
    if (!track) return 'idcard';
    
    // Strict active track cap interceptor
    if (!isActive(track) && activeCount() >= 2) return 'limit';
    
    const meta = TRACK_META[track];
    const needsPrereq = (meta?.prereq || []).some(p => !isEnrolled(p));
    if (needsPrereq && PREREQ_COPY[track]) return 'prereq';
    
    return 'idcard';
  }, [track, tick, open]);

  if (!track) return null;
  const meta = TRACK_META[track];

  const doEnroll = async () => {
    const rec = await enroll(track);
    onEnrolled?.(track);
    onClose();
    setTimeout(() => navigate(meta?.route || '/dashboard'), 50);
    return rec;
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="glass-card border-primary/30 max-w-md">
        {step === 'limit' && <LimitStep onBack={onClose} onChanged={refresh} />}
        {step === 'prereq' && (
          <PrereqStep
            track={track}
            onBack={onClose}
            onGoTo={(r) => { onClose(); setTimeout(() => navigate(r), 50); }}
            onEnrollAnyway={doEnroll}
          />
        )}
        {step === 'idcard' && (
          <IdCardStep
            track={track}
            name={user?.name || 'New Student'}
            onCarryOn={doEnroll}
            onBack={onClose}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

// ---------- steps ----------

function LimitStep({ onBack, onChanged }: { onBack: () => void; onChanged: () => void }) {
  const list = getEnrollments().filter(e => e.status === 'active');
  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 font-display">
          <AlertTriangle className="w-5 h-5 text-accent-orange" /> You're already in 2 courses
        </DialogTitle>
        <DialogDescription className="text-xs leading-relaxed">
          We recommend keeping your focus on just 2 tracks — quality beats quantity, and finishing what you start builds real skill.
          Pause or end one below to make room for this new course.
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-2 mt-2">
        {list.map(e => (
          <div key={e.track} className="flex items-center justify-between gap-2 bg-secondary/30 rounded-xl px-3 py-2 border border-border/30">
            <div className="min-w-0">
              <p className="text-xs font-display font-semibold text-foreground truncate">
                {TRACK_META[e.track]?.label || e.track}
              </p>
              <p className="text-[10px] text-muted-foreground font-mono">{e.studentId || '—'}</p>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <button onClick={() => { pauseTrack(e.track); onChanged(); }}
                className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-lg bg-accent-yellow/15 text-accent-yellow border border-accent-yellow/30 hover:bg-accent-yellow/25">
                <PauseCircle className="w-3 h-3" /> Pause
              </button>
              <button onClick={() => { endTrack(e.track); onChanged(); }}
                className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-lg bg-destructive/15 text-destructive border border-destructive/30 hover:bg-destructive/25">
                <StopCircle className="w-3 h-3" /> End
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-end pt-2">
        <button onClick={onBack} className="text-xs px-3 py-2 rounded-lg bg-secondary/40 hover:bg-secondary/60 text-foreground font-display">
          Go back
        </button>
      </div>
    </>
  );
}

function PrereqStep({
  track, onBack, onGoTo, onEnrollAnyway,
}: {
  track: TrackId;
  onBack: () => void;
  onGoTo: (route: string) => void;
  onEnrollAnyway: () => void;
}) {
  const copy = PREREQ_COPY[track]!;
  return (
    <>
      <DialogHeader>
        <DialogTitle className="font-display flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-500" /> {copy.title}
        </DialogTitle>
        <DialogDescription className="text-xs leading-relaxed bg-muted/40 p-3 rounded-xl border border-border/20 font-sans mt-2">
          {copy.body}
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-2 mt-4">
        {copy.ctas.map(cta => (
          <button key={cta.route} onClick={() => onGoTo(cta.route)}
            className="w-full flex items-center justify-between gap-2 bg-primary/10 hover:bg-primary/20 border border-primary/30 rounded-xl px-3 py-2 text-primary text-xs font-display font-bold transition-all">
            {cta.label} <ArrowRight className="w-4 h-4" />
          </button>
        ))}
        <button onClick={onEnrollAnyway}
          className="w-full bg-secondary/40 hover:bg-secondary/60 border border-border/40 rounded-xl px-3 py-2 text-foreground text-xs font-display font-bold">
          Enroll anyway
        </button>
        <button onClick={onBack}
          className="w-full text-muted-foreground hover:text-foreground text-[11px] py-1 font-display">
          Back
        </button>
      </div>
    </>
  );
}

function IdCardStep({
  track, name, onCarryOn, onBack,
}: {
  track: TrackId;
  name: string;
  onCarryOn: () => void;
  onBack: () => void;
}) {
  const meta = TRACK_META[track];
  const previewId = useMemo(() => `${meta?.idPrefix || 'CS'}-${Math.floor(100000 + Math.random() * 900000)}`, [track]);
  return (
    <>
      <DialogHeader>
        <DialogTitle className="font-display flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-primary" /> Welcome aboard!
        </DialogTitle>
        <DialogDescription className="text-xs leading-relaxed">
          You're about to enroll in <span className="text-primary font-semibold">{meta?.label || 'Track'}</span>. Here's your student card — keep it in your pocket 🎓
        </DialogDescription>
      </DialogHeader>
      <div className="mt-2 rounded-2xl p-4 border border-primary/40 bg-gradient-to-br from-primary/10 via-background to-accent-blue/10 neon-glow">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center text-2xl">🎓</div>
          <div className="min-w-0">
            <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider">CodeSage Student ID</p>
            <p className="text-sm font-display font-bold text-foreground truncate">{name}</p>
            <p className="text-[11px] text-primary font-mono">{previewId}</p>
          </div>
        </div>
        <div className="border-t border-border/30 mt-3 pt-2">
          <p className="text-[10px] text-muted-foreground font-display">Track</p>
          <p className="text-xs font-display font-semibold text-foreground">{meta?.label || 'Track'}</p>
        </div>
      </div>
      <p className="text-[11px] text-muted-foreground mt-2 leading-relaxed">
        Small win, big journey. Show up daily — that's the whole trick. Ready?
      </p>
      <div className="flex justify-end gap-2 pt-2">
        <button onClick={onBack} className="text-xs px-3 py-2 rounded-lg bg-secondary/40 hover:bg-secondary/60 text-foreground font-display">
          Not now
        </button>
        <button onClick={onCarryOn}
          className="text-xs px-4 py-2 rounded-lg bg-primary text-primary-foreground font-display font-bold hover:neon-glow flex items-center gap-1">
          Carry on <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </>
  );
}
