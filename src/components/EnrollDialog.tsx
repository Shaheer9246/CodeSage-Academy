import { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { GraduationCap, AlertTriangle, ArrowRight, PauseCircle, StopCircle, Loader2 } from 'lucide-react';
import {
  TrackId, TRACK_META, enroll,
  activeCount, getEnrollments,
  isActive,
  pause as pauseTrack, end as endTrack,
  onEnrollmentChange
} from '@/lib/enrollment';
import { useUser } from '@/contexts/UserContext';
import { toast } from 'sonner';
import { NETWORKING_LESSONS } from '@/data/networkingLessons';
import { FULLSTACK_LESSONS } from '@/data/fullstackLessons';
import { FREELANCE_LESSONS } from '@/data/freelanceLessons';
import { PYTHON_LESSONS } from '@/data/pythonLessons';
import { LOCAL_LESSONS } from '@/data/localLessons';
import { SQL_LESSONS } from '@/data/sqlLessons';
import { AI_LESSONS } from '@/data/aiLessons'; // You might already have this one!
import { PYTHON_EXPERT_LESSONS } from '@/data/pythonExpertLessons'; // Add this if missing
import { THREE3D_LESSONS } from '@/data/three3dLessons';

// Frontend lesson ids used for completion checks (matches Roadmap listing).
const FRONTEND_LESSON_IDS = [
  'html-1','html-2','html-3','html-4','html-5','html-6','html-7','html-8','html-9','html-10',
  'css-1','css-2','css-3','css-4','css-5','css-6',
  'js-1','js-2','js-3','js-4','js-5',
  'html-int-1','html-int-2','css-int-1','css-int-2','css-int-3','js-int-1','js-int-2','js-int-3','js-int-4',
  'react-1','react-2','react-3','react-4','react-int-1',
  'multi-1','multi-2','multi-3','form-1','form-2','a11y-1',
  'js-exp-1','js-exp-2','js-exp-3','css-exp-1','css-exp-2','react-exp-1',
  'pro-1','pro-2','pro-3','proj-1','proj-2',
];

const PREREQ_LESSON_IDS: Partial<Record<TrackId, string[]>> = {
  frontend: FRONTEND_LESSON_IDS,
  networking: NETWORKING_LESSONS.map(l => l.id),
  fullstack: FULLSTACK_LESSONS.map(l => l.id),
  freelance: FREELANCE_LESSONS.map(l => l.id),
  python: PYTHON_LESSONS.map(l => l.id),
  local: LOCAL_LESSONS.map(l => l.id),
  sql: SQL_LESSONS.map(l => l.id),
  three3d: THREE3D_LESSONS.map(l => l.id),
  pythonexpert: PYTHON_EXPERT_LESSONS.map(l => l.id),
  'ai-fundamentals': AI_LESSONS.map(l => l.id),
};

function isTrackCompleted(track: TrackId, completedLessons: string[]): boolean {
  const ids = PREREQ_LESSON_IDS[track];
  if (!ids || ids.length === 0) return false;
  const set = new Set(completedLessons);
  return ids.every(id => set.has(id));
}


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
    body: 'Full-Stack builds directly on HTML, CSS, and JavaScript. Finish the Frontend track first so this course feels like leveling up – not learning from scratch.',
    ctas: [{ label: 'Go to Frontend course', route: '/learn' }],
  },
  freelance: {
    title: 'Are you ready to sell your work?',
    body: 'Freelancing is easier when you already have a skill to sell. Please complete Frontend Development and Full-Stack Frontend Development first – then this course will show you how to turn those skills into income.',
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
    body: 'Python Expert is an advanced-level track that builds directly on Python Programming (beginner → intermediate → advanced). Please complete Python Programming first – otherwise the expert lessons will be hard to follow.',
    ctas: [{ label: 'Python Programming course', route: '/python' }],
  },
  three3d: {
    title: 'Start with Frontend Development',
    body: '3D Web Development builds heavily on HTML, CSS, and JavaScript. We highly recommend completing the Frontend Development track first so you have the right foundation before diving into 3D canvases and WebGL!',
    ctas: [{ label: 'Frontend course', route: '/learn' }],
  },
};

export default function EnrollDialog({ open, track, onClose, onEnrolled }: Props) {
  const navigate = useNavigate();
  const { user } = useUser();
  const [tick, setTick] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const refresh = () => setTick(t => t + 1);

  useEffect(() => {
    return onEnrollmentChange(() => {
      setTick(t => t + 1);
    });
  }, []);

  const step: Step = useMemo(() => {
    if (!track) return 'idcard';

    // 1. Strict Limit Check Priority
    if (!isActive(track) && activeCount() >= 2) return 'limit';

    // 2. Fallback to Prerequisite Check — show the pre-req card unless the
    //    prereq track is actually COMPLETED (not just enrolled).
    const meta = TRACK_META[track];
    const completed = user?.completedLessons || [];
    const needsPrereq = (meta?.prereq || []).some(p => !isTrackCompleted(p, completed));
    if (needsPrereq && PREREQ_COPY[track]) return 'prereq';

    return 'idcard';
  }, [track, open, tick, user?.completedLessons]);

  if (!track) return null;
  const meta = TRACK_META[track];

  const doEnroll = async () => {
    if (isSubmitting) return;

    // Bulletproof frontend check to physically block submission if over limit
    if (!isActive(track) && activeCount() >= 2) {
      toast.error('Course limit reached. Please pause existing courses first.');
      refresh();
      return;
    }

    setIsSubmitting(true);
    try {
      const rec = await enroll(track);
      onEnrolled?.(track);
      toast.success(`Successfully enrolled in ${meta?.label || 'track'}!`);
      onClose();
      setTimeout(() => navigate(meta?.route || '/dashboard'), 50);
      return rec;
    } catch (err: any) {
      console.error('[EnrollDialog] Enrollment failed:', err);
      toast.error(err?.message || 'Database rejected enrollment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v && !isSubmitting) onClose(); }}>
      <DialogContent className="glass-card border-primary/30 max-w-md">
        {step === 'limit' && <LimitStep onBack={onClose} onChanged={refresh} />}
        {step === 'prereq' && (
          <PrereqStep
            track={track}
            onBack={onClose}
            onGoTo={(r) => { onClose(); setTimeout(() => navigate(r), 50); }}
            onEnrollAnyway={doEnroll}
            isSubmitting={isSubmitting}
          />
        )}
        {step === 'idcard' && (
          <IdCardStep
            track={track}
            name={user?.name || 'New Student'}
            onCarryOn={doEnroll}
            onBack={onClose}
            isSubmitting={isSubmitting}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function LimitStep({ onBack, onChanged }: { onBack: () => void; onChanged: () => void }) {
  const [actioningTrack, setActioningTrack] = useState<string | null>(null);
  const list = getEnrollments().filter(e => e.status?.toLowerCase()?.trim() === 'active');
  const currentCount = list.length;
  const numberToPause = Math.max(1, currentCount - 1);

  const handlePause = async (track: TrackId) => {
    setActioningTrack(track);
    try {
      await pauseTrack(track);
      toast.success('Course paused successfully');
      onChanged();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to pause course');
    } finally {
      setActioningTrack(null);
    }
  };

  const handleEnd = async (track: TrackId) => {
    setActioningTrack(track);
    try {
      await endTrack(track);
      toast.success('Course ended successfully');
      onChanged();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to end course');
    } finally {
      setActioningTrack(null);
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 font-display">
          <AlertTriangle className="w-5 h-5 text-accent-orange" /> Course Limit Reached
        </DialogTitle>
        <DialogDescription className="text-xs leading-relaxed">
          You are currently in <strong>{currentCount}</strong> active tracks, but the maximum limit is 2. To make room for this new course, you need to pause or end <strong>{numberToPause}</strong> of your current tracks below.
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-2 mt-2">
        {list.map(e => (
          <div key={e.track} className="flex items-center justify-between gap-2 bg-secondary/30 rounded-xl px-3 py-2 border border-border/30">
            <div className="min-w-0">
              <p className="text-xs font-display font-semibold text-foreground truncate">
                {TRACK_META[e.track]?.label || e.track}
              </p>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                onClick={() => handlePause(e.track)}
                disabled={actioningTrack !== null}
                className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-lg bg-accent-yellow/15 text-accent-yellow border border-accent-yellow/30 hover:bg-accent-yellow/25 disabled:opacity-50 transition-all"
              >
                {actioningTrack === e.track ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <PauseCircle className="w-3 h-3" />
                )}
                Pause
              </button>
              <button
                onClick={() => handleEnd(e.track)}
                disabled={actioningTrack !== null}
                className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-lg bg-destructive/15 text-destructive border border-destructive/30 hover:bg-destructive/25 disabled:opacity-50 transition-all"
              >
                {actioningTrack === e.track ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <StopCircle className="w-3 h-3" />
                )}
                End
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-end pt-2">
        <button
          onClick={onBack}
          disabled={actioningTrack !== null}
          className="text-xs px-3 py-2 rounded-lg bg-secondary/40 hover:bg-secondary/60 text-foreground font-display disabled:opacity-50"
        >
          Go back
        </button>
      </div>
    </>
  );
}

function PrereqStep({
  track, onBack, onGoTo, onEnrollAnyway, isSubmitting
}: {
  track: TrackId;
  onBack: () => void;
  onGoTo: (route: string) => void;
  onEnrollAnyway: () => void;
  isSubmitting: boolean;
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
          <button key={cta.route} onClick={() => !isSubmitting && onGoTo(cta.route)} disabled={isSubmitting} className="w-full flex items-center justify-between gap-2 bg-primary/10 hover:bg-primary/20 border border-primary/30 rounded-xl px-3 py-2 text-primary text-xs font-display font-bold transition-all disabled:opacity-50">
            {cta.label} <ArrowRight className="w-4 h-4" />
          </button>
        ))}
        <button onClick={onEnrollAnyway} disabled={isSubmitting} className="w-full bg-secondary/40 hover:bg-secondary/60 border border-border/40 rounded-xl px-3 py-2 text-foreground text-xs font-display font-bold flex items-center justify-center gap-2 disabled:opacity-50">
          {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Enroll anyway'}
        </button>
        <button onClick={onBack} disabled={isSubmitting} className="w-full text-muted-foreground hover:text-foreground text-[11px] py-1 font-display disabled:opacity-50">
          Back
        </button>
      </div>
    </>
  );
}

function IdCardStep({
  track, name, onCarryOn, onBack, isSubmitting
}: {
  track: TrackId;
  name: string;
  onCarryOn: () => void;
  onBack: () => void;
  isSubmitting: boolean;
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
          You're about to enroll in <span className="text-primary font-semibold">{meta?.label || 'Track'}</span>. Here's your student card – keep it in your pocket 🎓
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
        Small win, big journey. Show up daily – that's the whole trick. Ready?
      </p>
      <div className="flex justify-end gap-2 pt-2">
        <button onClick={onBack} disabled={isSubmitting} className="text-xs px-3 py-2 rounded-lg bg-secondary/40 hover:bg-secondary/60 text-foreground font-display">
          Not now
        </button>
        <button onClick={onCarryOn} disabled={isSubmitting} className="text-xs px-4 py-2 rounded-lg bg-primary text-primary-foreground font-display font-bold hover:neon-glow flex items-center gap-1 disabled:opacity-50">
          {isSubmitting ? (
            <>Validating... <Loader2 className="w-3.5 h-3.5 animate-spin" /></>
          ) : (
            <>Carry on <ArrowRight className="w-4 h-4" /></>
          )}
        </button>
      </div>
    </>
  );
}
