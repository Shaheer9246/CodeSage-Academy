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
import { useUser, cleanStudentId } from '@/contexts/UserContext';
import { toast } from 'sonner';
import { isTrackCompleted as isTrackDone, LessonTrackKey } from '@/data/lessonIndex';



function isTrackCompleted(track: TrackId, completedLessons: string[]): boolean {
  return isTrackDone(track as LessonTrackKey, completedLessons);
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
    title: 'Did you complete Modern Frontend Engineering?',
    body: 'Full-Stack Application Architecture builds directly on HTML, CSS, and JavaScript. Finish the Modern Frontend Engineering track first so this course feels like leveling up – not learning from scratch.',
    ctas: [{ label: 'Go to Frontend course', route: '/learn' }],
  },
  freelance: {
    title: 'Are you ready to sell your work?',
    body: 'Consultancy is easiest when you already have a production engineering skill to offer. We recommend completing Modern Frontend Engineering and Full-Stack Application Architecture first – then this course will show you how to turn those technical skills into high-ticket contracts.',
    ctas: [
      { label: 'Frontend course', route: '/learn' },
      { label: 'Full-Stack course', route: '/fullstack' },
    ],
  },
  local: {
    title: 'Start with Modern Frontend Engineering',
    body: 'Before starting this offline runtime track, you should be familiar with the browser DOM and core frontend engineering. We recommend completing Modern Frontend Engineering first.',
    ctas: [{ label: 'Frontend course', route: '/learn' }],
  },
  python: {
    title: 'Start with Computer Systems & Network Architecture',
    body: 'Python runs on real machines. If you understand how computers, memory, and network sockets operate, Python systems programming clicks much faster. We recommend finishing Computer Systems & Networks first.',
    ctas: [{ label: 'Networking course', route: '/networking' }],
  },
  sql: {
    title: 'Start with Modern Frontend or Python',
    body: 'Before diving into database architecture and query optimization, familiarity with frontend applications or Python scripting is recommended so you understand how client apps interact with data.',
    ctas: [{ label: 'Frontend course', route: '/learn' }],
  },
  pythonexpert: {
    title: 'Finish Python Software Engineering first',
    body: 'Advanced Python is a specialized track covering metaclasses, async concurrency, and high-performance APIs. Please complete Python Software Engineering first to establish strong algorithmic foundations.',
    ctas: [{ label: 'Python course', route: '/python' }],
  },
  three3d: {
    title: 'Start with Modern Frontend Engineering',
    body: 'Interactive 3D Graphics builds heavily on JavaScript, DOM lifecycle, and canvas rendering. We recommend completing Modern Frontend Engineering first before diving into 3D shaders and WebGL!',
    ctas: [{ label: 'Frontend course', route: '/learn' }],
  },
  'intermediate-ai': {
    title: 'Start with Foundations of AI & Neural Models',
    body: 'Applied GenAI covers advanced topics like PEFT, LoRA/QLoRA fine-tuning, and production RAG. We recommend completing Foundations of AI first to build a solid grasp of transformer architecture.',
    ctas: [{ label: 'AI Foundations course', route: '/ai-fundamentals' }],
  },
  'advanced-ai': {
    title: 'Finish Applied Generative AI & Fine-Tuning first',
    body: 'Autonomous AI Agents & Production Systems covers ReAct loops, Model Context Protocol (MCP), multi-agent swarms, and production LLMOps. We recommend completing Applied Generative AI first to establish strong fine-tuning and RAG foundations.',
    ctas: [{ label: 'Applied GenAI course', route: '/intermediate-ai' }],
  },
  cppexpert: {
    title: 'Finish Modern C++ Engineering first',
    body: 'Advanced C++ covers metaprogramming, lock-free atomics, and move semantics. Please complete Modern C++ Engineering first to establish a solid grasp of RAII and core syntax.',
    ctas: [{ label: 'Modern C++ course', route: '/cpp' }],
  },
  javaexpert: {
    title: 'Finish Enterprise Java first',
    body: 'Advanced Java Systems covers JVM internals, multithreaded concurrency, and garbage collection tuning. Please complete Enterprise Java first to master core OOP architecture.',
    ctas: [{ label: 'Enterprise Java course', route: '/java' }],
  },
  cx: {
    title: 'Finish Systems Programming in C first',
    body: 'Advanced Low-Level Systems covers custom allocators, cache-line optimization, and OS primitives. Please complete Systems Programming in C first to establish a solid foundation in pointers and memory.',
    ctas: [{ label: 'Systems C course', route: '/c' }],
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
      const rec = await enroll(track, user?.studentId);
      toast.success(`Successfully enrolled in ${meta?.label || 'track'}!`);
      onClose();
      if (onEnrolled) {
        onEnrolled(track);
      } else {
        setTimeout(() => navigate(meta?.route || '/dashboard'), 50);
      }
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
      <DialogContent className="glass-card border-primary/30 max-w-md w-[92vw] sm:w-full max-h-[85vh] overflow-y-auto">
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
            name={user?.name || user?.username || 'New Student'}
            studentId={cleanStudentId(user?.studentId, user?.id || '')}
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
  track, name, studentId, onCarryOn, onBack, isSubmitting
}: {
  track: TrackId;
  name: string;
  studentId: string;
  onCarryOn: () => void;
  onBack: () => void;
  isSubmitting: boolean;
}) {
  const meta = TRACK_META[track];
  // Extract number suffix from global student ID (e.g. "7842" from "CS-7842" or "ID-CSA-0042")
  const numSuffix = studentId.replace(/^(CS-|ID-CSA-)/i, '').replace(/[^a-zA-Z0-9]/g, '') || '1001';
  // Distinct per-track enrollment credential code (e.g. CS-FE-7842, CS-PY-7842, CS-CPP-7842)
  const trackCredentialId = `${meta?.idPrefix || 'CS'}-${numSuffix}`;

  return (
    <>
      <DialogHeader>
        <DialogTitle className="font-display flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-primary" /> Welcome aboard!
        </DialogTitle>
        <DialogDescription className="text-xs leading-relaxed">
          You're about to enroll in <span className="text-primary font-semibold">{meta?.label || 'Track'}</span>. Here's your official track enrollment card – linked to your student profile 🎓
        </DialogDescription>
      </DialogHeader>
      <div className="mt-2 rounded-2xl p-4 border border-primary/40 bg-gradient-to-br from-primary/10 via-background to-accent-blue/10 neon-glow">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center text-2xl">🎓</div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider">Track Credential</p>
              <span className="text-[9px] font-mono bg-primary/15 text-primary px-2 py-0.5 rounded-full border border-primary/30">
                {meta?.short || 'Active'}
              </span>
            </div>
            <p className="text-sm font-display font-bold text-foreground truncate">{name}</p>
            <p className="text-xs text-primary font-mono font-bold tracking-wide mt-0.5">{trackCredentialId}</p>
          </div>
        </div>
        <div className="border-t border-border/30 mt-3 pt-2 flex items-center justify-between">
          <div>
            <p className="text-[10px] text-muted-foreground font-display">Enrolling Course</p>
            <p className="text-xs font-display font-semibold text-foreground">{meta?.label || 'Track'}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-muted-foreground font-display">Global Student ID</p>
            <p className="text-xs font-mono font-bold text-foreground">{studentId}</p>
          </div>
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
