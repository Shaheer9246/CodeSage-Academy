import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const KEY = 'codesage_guest_lesson_taken';

/**
 * Guest mode "first taste" gate.
 * Each track allows only ONE lesson while in guest mode, then prompts sign-up.
 * Call from a lesson page; pass a stable track identifier and the current lesson id.
 */
export function useGuestLessonGate(track: string, lessonId: string | undefined) {
  const [sp] = useSearchParams();
  const isGuest = sp.get('guest') === '1';
  const navigate = useNavigate();

  useEffect(() => {
    if (!isGuest || !lessonId) return;
    try {
      const raw = localStorage.getItem(KEY);
      const map: Record<string, string> = raw ? JSON.parse(raw) : {};
      const taken = map[track];
      if (taken && taken !== lessonId) {
        toast.info('Sign up to unlock the rest!', {
          description: 'Guests get a single taste lesson per track.',
        });
        navigate('/auth', { replace: true });
        return;
      }
      if (!taken) {
        map[track] = lessonId;
        localStorage.setItem(KEY, JSON.stringify(map));
      }
    } catch {}
  }, [isGuest, lessonId, track, navigate]);

  return { isGuest };
}

export function resetGuestLessons() {
  try { localStorage.removeItem(KEY); } catch {}
}
