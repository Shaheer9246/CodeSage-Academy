/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';
import { toast } from '@/hooks/use-toast';
import {
  DAILY_XP, LESSON_XP_COST, LESSON_COIN_COST, LESSON_COIN_REWARD,
  badgeForLessons, energyToday, lessonCharge, todayKey, type LessonCharge,
} from '@/lib/gamification';

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  name: string;
  studying: string;
  hasJob: string;
  dob: string;
  goal: string;
  experienceLevel: string;
  joinDate: string;
  streakCount: number;
  lastActiveDate: string;
  badges: string[];
  completedLessons: string[];
  completedTests: string[];
  unlockedSections: string[];
  promoCodes: string[];
  isOnboarded: boolean; 
  darkMode: boolean;
  xp: number;
  level: number;
  sageCoins: number;
  hasSeenTour: boolean;
  streakFreezeUntil: string | null;
  /** Learning energy left for today (refills to DAILY_XP each day). */
  dailyXp: number;
  /** ISO date (YYYY-MM-DD) the daily energy was last refilled. */
  dailyXpDate: string | null;
}

interface UserContextType {
  user: UserProfile | null;
  loading: boolean;
  isLoggedIn: boolean;
  isOnboarded: boolean;
  login: (email: string, password: string) => Promise<string | null>;
  signup: (username: string, email: string, password: string) => Promise<string | null>;
  completeOnboarding: (data: Partial<UserProfile>) => Promise<void>;
  completeLesson: (lessonId: string) => Promise<void>;
  completeTest: (testId: string) => Promise<void>;
  addBadge: (badge: string) => void;
  updateStreak: () => Promise<void>;
  applyPromoCode: (code: string) => Promise<boolean>;
  updateUser: (data: Partial<UserProfile>) => void;
  logout: () => Promise<void>;
  deleteAccount: () => Promise<boolean>;
  addXp: (amount: number) => void;
  addCoins: (amount: number) => void;
  toggleDarkMode: () => void;
  buyFreezeStreak: () => Promise<boolean>;
  markTourSeen: () => Promise<void>;
  resetTour: () => Promise<void>;
  /** XP energy left today (refills to 10 daily, no carry-over). */
  energy: number;
  /** How the next lesson gets paid for: energy, coins, or blocked. */
  nextLessonCharge: LessonCharge;
  /** False when both today's energy and coins are too low for a lesson. */
  canLearn: boolean;
  /** Current rank badge, derived from lifetime lessons completed. */
  rank: ReturnType<typeof badgeForLessons>;
  /** Spend Sage Coins (Crawler rescue, extras). Returns false if too poor. */
  spendCoins: (amount: number, reason?: string) => Promise<boolean>;
}

const UserContext = createContext<UserContextType | null>(null);

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be inside UserProvider');
  return ctx;
};

type DbProfileRow = {
  id: string;
  username?: string | null;
  name?: string | null;
  studying?: string | null;
  has_job?: string | null;
  dob?: string | null;
  goal?: string | null;
  experience_level?: string | null;
  created_at?: string | null;
  streak_count?: number | null;
  last_active_date?: string | null;
  badges?: string[] | null;
  completed_lessons?: string[] | null;
  completed_tests?: string[] | null;
  unlocked_sections?: string[] | null;
  promo_codes?: string[] | null;
  dark_mode?: boolean | null;
  xp?: number | null;
  level?: number | null;
  sage_coins?: number | null;
  streak_freeze_until?: string | null;
  has_seen_tour?: boolean | null;
  daily_xp?: number | null;
  daily_xp_date?: string | null;
};

type DbProfileUpdate = Partial<{
  username: string;
  name: string;
  studying: string;
  has_job: string;
  dob: string;
  goal: string;
  experience_level: string;
  dark_mode: boolean;
  has_seen_tour: boolean;
}>;

function dbRowToProfile(row: DbProfileRow, email: string): UserProfile {
  const localOnboarded = localStorage.getItem(`codesage_onboarded_${row.id}`) === 'true';
  const localTourSeen = localStorage.getItem(`codesage_tour_seen_${row.id}`) === 'true';

  // DB is the source of truth; localStorage is just a cache/fallback.
  const isOnboarded = !!row.name || localOnboarded;
  const hasSeenTour = row.has_seen_tour === true || (row.has_seen_tour == null && localTourSeen);

  // Refresh local cache so future loads are consistent.
  if (isOnboarded) localStorage.setItem(`codesage_onboarded_${row.id}`, 'true');
  localStorage.setItem(`codesage_tour_seen_${row.id}`, hasSeenTour ? 'true' : 'false');

  return {
    id: row.id,
    username: row.username || '',
    email,
    name: row.name || '',
    studying: row.studying || '',
    hasJob: row.has_job || '',
    dob: row.dob || '',
    goal: row.goal || '',
    experienceLevel: row.experience_level || '',
    joinDate: row.created_at || '',
    streakCount: row.streak_count || 0,
    lastActiveDate: row.last_active_date || '',
    badges: row.badges || [],
    isOnboarded,
    hasSeenTour,
    completedLessons: row.completed_lessons || [],
    completedTests: row.completed_tests || [],
    unlockedSections: row.unlocked_sections || ['frontend'],
    promoCodes: row.promo_codes || [],
    darkMode: row.dark_mode ?? true,
    xp: row.xp || 0,
    level: row.level || 1,
    sageCoins: row.sage_coins || 0,
    streakFreezeUntil: row.streak_freeze_until || null,
    dailyXp: row.daily_xp ?? DAILY_XP,
    dailyXpDate: row.daily_xp_date || null,
  };
}

function profileToDbUpdate(p: UserProfile): DbProfileUpdate {
  return {
    username: p.username,
    name: p.name,
    studying: p.studying,
    has_job: p.hasJob,
    dob: p.dob,
    goal: p.goal,
    experience_level: p.experienceLevel,
    dark_mode: p.darkMode,
    has_seen_tour: p.hasSeenTour,
  };
}

function readCachedProfile(): UserProfile | null {
  try {
    const cached = localStorage.getItem('codesage_cached_profile');
    if (!cached) return null;
    const parsed = JSON.parse(cached) as UserProfile;
    return parsed && parsed.id ? parsed : null;
  } catch { return null; }
}

// --- Offline-safe lesson completion queue -------------------------------
// If award_lesson fails (expired token, flaky network), the completion is
// parked here and retried on the next load, so progress is never silently
// lost after a refresh.
const PENDING_KEY = 'codesage_pending_lessons';

function readPending(): string[] {
  try {
    const raw = localStorage.getItem(PENDING_KEY);
    const arr = raw ? (JSON.parse(raw) as string[]) : [];
    return Array.isArray(arr) ? arr.filter(x => typeof x === 'string') : [];
  } catch { return []; }
}

function writePending(ids: string[]) {
  try {
    if (ids.length) localStorage.setItem(PENDING_KEY, JSON.stringify([...new Set(ids)]));
    else localStorage.removeItem(PENDING_KEY);
  } catch { /* ignore */ }
}

function queuePending(id: string) {
  writePending([...readPending(), id]);
}

export const UserProvider = ({ children }: { children: ReactNode }) => {
  // Hydrate synchronously from cache so we never flash "initializing CodeSage"
  // for a user that's already signed in.
  const [user, setUser] = useState<UserProfile | null>(() => readCachedProfile());
  const [loading, setLoading] = useState<boolean>(() => !readCachedProfile());
  const syncTimer = useRef<number | undefined>(undefined);
  const streakRef = useRef<string | null>(null);
  const fetchInflight = useRef<{ uid: string; p: Promise<void> } | null>(null);
  const hydratedUid = useRef<string | null | undefined>(undefined);

  const loadProfile = useCallback(async (authUser: User) => {
    const localOnboarded = localStorage.getItem(`codesage_onboarded_${authUser.id}`) === 'true';

    const buildDefaultProfile = (): UserProfile => ({
      id: authUser.id,
      username: authUser.user_metadata?.username || '',
      email: authUser.email || '',
      name: '',
      studying: '',
      hasJob: '',
      dob: '',
      goal: '',
      experienceLevel: '',
      joinDate: new Date().toISOString(),
      streakCount: 0,
      lastActiveDate: '',
      badges: [],
      completedLessons: [],
      completedTests: [],
      unlockedSections: ['frontend'],
      promoCodes: [],
      darkMode: true,
      xp: 10,
      level: 1,
      sageCoins: 0,
      hasSeenTour: false,
      isOnboarded: localOnboarded,
      streakFreezeUntil: null,
      dailyXp: DAILY_XP,
      dailyXpDate: todayKey(),
    });

    // Check localStorage cache freshness (5 minutes) to prevent redundant database egress
    const cached = getCachedProfile();
    const cachedTime = Number(localStorage.getItem('cached_profile_time') || 0);
    const now = Date.now();
    if (cached && cached.id === authUser.id && (now - cachedTime < 5 * 60 * 1000)) {
      setUser(cached);
      return;
    }

    try {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', authUser.id).single();
      if (error && error.code !== 'PGRST116') {
        console.error('Profile fetch error:', error.message);
      }
      if (data) {
        try { localStorage.setItem('cached_profile_time', String(Date.now())); } catch {}
        let row = data;
        // Retry any completions that failed to reach the server earlier.
        const pending = readPending();
        if (pending.length) {
          const stillPending: string[] = [];
          for (const id of pending) {
            const { data: awarded, error: awardErr } = await supabase.rpc('award_lesson', { _lesson_id: id });
            if (awardErr) stillPending.push(id);
            else if (awarded) row = (Array.isArray(awarded) ? awarded[0] : awarded) as typeof data;
          }
          writePending(stillPending);
        }
        setUser(dbRowToProfile(row, authUser.email || ''));
      } else {
        const defaultProfile = buildDefaultProfile();
        const { error: insertError } = await supabase.from('profiles').insert({
          id: authUser.id,
          username: authUser.user_metadata?.username || '',
        });
        if (insertError) {
          console.error('Profile insert error:', insertError.message);
        }
        setUser(defaultProfile);
      }
    } catch (err: unknown) {
      console.error('Failed to fetch profile:', err);
      setUser(buildDefaultProfile());
    } finally {
      setLoading(false);
    }
  }, []);

    const fetchProfile = useCallback((authUser: User) => {
    if (fetchInflight.current?.uid === authUser.id) return fetchInflight.current.p;
    const p = loadProfile(authUser).finally(() => {
      fetchInflight.current = null;
    });
    fetchInflight.current = { uid: authUser.id, p };
    return p;
  }, [loadProfile]);

  const syncToDb = useCallback((profile: UserProfile) => {
    if (syncTimer.current) clearTimeout(syncTimer.current);
    syncTimer.current = window.setTimeout(async () => {
      try {
        await supabase.from('profiles').update(profileToDbUpdate(profile)).eq('id', profile.id);
      } catch (err: unknown) {
        console.error('Failed to sync profile:', err);
      }
    }, 500);
  }, []);

    const hydrateFor = (uid: string | null) => {
    if (hydratedUid.current === uid) return;
    hydratedUid.current = uid;
    import('@/lib/enrollment').then(({ hydrateEnrollments }) => {
      void hydrateEnrollments(uid);
    }).catch(() => { /* noop */ });
  };

useEffect(() => {
    let mounted = true;

    // Lazy import to avoid a circular dep at module top-level.
    hydrateFor(readCachedProfile()?.id ?? null);

      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      if (event === 'TOKEN_REFRESHED') return;

      if (session?.user) {
        await fetchProfile(session.user);
        hydrateFor(session.user.id);
      } else {
        localStorage.removeItem('codesage_cached_profile');
        setUser(null);
        setLoading(false);
        hydrateFor(null);
      }
    });

    // Explicit bootstrap: onAuthStateChange can miss INITIAL_SESSION if the
    // network is slow or the backend is unreachable. Never leave the app stuck
    // on the "Initializing CodeSage Environment..." screen.
    void supabase.auth.getSession()
      .then(({ data }) => {
        if (!mounted) return;
        if (data.session?.user) return fetchProfile(data.session.user);
        setLoading(false);
      })
      .catch(() => { if (mounted) setLoading(false); });

    // Hard watchdog — if anything above hangs, show the app anyway.
    const watchdog = window.setTimeout(() => {
      if (mounted) setLoading(false);
    }, 6000);

    return () => {
      mounted = false;
      clearTimeout(watchdog);
      subscription.unsubscribe();
    };
  }, [fetchProfile]);



  const isLoggedIn = !!user;
  const isOnboarded = user?.isOnboarded === true;

  // Keep a local cache of the profile for instant hydration on next load.
  useEffect(() => {
    try {
      if (user) localStorage.setItem('codesage_cached_profile', JSON.stringify(user));
      else localStorage.removeItem('codesage_cached_profile');
    } catch {
      // ignore quota errors
    }
  }, [user]);


  const updateProfile = (updated: UserProfile) => {
    setUser(updated);
    syncToDb(updated);
  };

  const login = async (email: string, password: string): Promise<string | null> => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return error ? error.message : null;
    } catch (err: unknown) {
      if (err instanceof Error) return err.message;
      return 'Network error — please check your connection';
    }
  };

  const signup = async (username: string, email: string, password: string): Promise<string | null> => {
    try {
      const { error } = await supabase.auth.signUp({
        email, password,
        options: { data: { username } },
      });
      return error ? error.message : null;
    } catch (err: unknown) {
      if (err instanceof Error) return err.message;
      return 'Network error — please check your connection';
    }
  };

  const completeOnboarding = async (data: Partial<UserProfile>) => {
    if (!user) return;

    localStorage.setItem(`codesage_onboarded_${user.id}`, 'true');
    localStorage.setItem(`codesage_tour_seen_${user.id}`, 'false');

    const updatedProfile = { ...user, ...data, isOnboarded: true, hasSeenTour: false };

    try {
      const dbData = profileToDbUpdate(updatedProfile);
      const { error } = await supabase.from('profiles').update(dbData).eq('id', user.id);
      if (error) console.error('Onboarding cloud save error:', error.message);
    } catch (err: unknown) {
      console.error('Onboarding cloud save error:', err);
    }

    // Set state AFTER the DB write so the route guard only flips once.
    setUser(updatedProfile);
  };

  

  const applyServerProfile = (row: DbProfileRow | DbProfileRow[] | null) => {
    if (!user || !row) return;

    const singleRow = Array.isArray(row) ? row[0] : row;
    if (!singleRow) return;

    setUser(dbRowToProfile(singleRow, user.email));
  };

  // ── Gamification helpers ───────────────────────────────────
 const energy = user ? energyToday(user.dailyXp, user.dailyXpDate) : 0;
  const xp = user?.xp || 0;
  const coins = user?.sageCoins ?? 0;


  const nextLessonCharge: LessonCharge = user ? lessonCharge(energy, coins) : 'energy';

  const canLearn = nextLessonCharge !== 'blocked';
  const rank = badgeForLessons(user?.completedLessons.length ?? 0);

  /** Spend coins on anything (Crawler rescue, extras). Server-authoritative. */
  const spendCoins = async (amount: number, reason = 'spend'): Promise<boolean> => {
    if (!user || user.sageCoins < amount) return false;
    setUser(prev => (prev ? { ...prev, sageCoins: prev.sageCoins - amount } : prev));
    const { data, error } = await (supabase.rpc as unknown as (fn: string, args: Record<string, unknown>) => Promise<{ data: unknown; error: { message: string } | null }>)('spend_coins', { _amount: amount, _reason: reason });
    if (error) {
      console.error('spend_coins failed:', error.message);
      setUser(prev => (prev ? { ...prev, sageCoins: prev.sageCoins + amount } : prev));
      return false;
    }
    if (data && typeof data === 'object') applyServerProfile(data as Parameters<typeof applyServerProfile>[0]);
    return true;
  };

  const completeLesson = async (lessonId: string) => {
    if (!user) return;
    const alreadyDone = user.completedLessons.includes(lessonId);
    if (alreadyDone) return;

    // 1. Check Total XP (Daily + Lifetime)
    const totalXp = energy + xp;
    
    if (totalXp < LESSON_XP_COST) {
      // Not enough XP. Check if we have coins to buy.
      if (coins >= LESSON_COIN_COST) {
        const confirmed = window.confirm(
          `You are run out of XPs (daily and winning).\n\nCome tomorrow for your next lesson when you get your daily XP, or revise what you learned today.\n\nClick OK to buy this lesson for ${LESSON_COIN_COST} coins, or Cancel to stop.`
        );
        if (!confirmed) return;

        // User confirmed: Buy with coins directly on server
        const { data, error } = await supabase.rpc('purchase_extra_lesson', { _lesson_id: lessonId });
        if (error) {
          toast({ title: 'Purchase Failed', description: error.message, variant: 'destructive' });
          return;
        }
        if (data) {
          applyServerProfile(data);
          toast({ title: 'Lesson Unlocked!', description: `+1 XP, +${LESSON_COIN_REWARD} Coins` });
        }
        return;
      } else {
        toast({
          title: 'Out of XP & Coins',
          description: `You've run out of XP. Come back tomorrow for your daily allowance, or buy this lesson for ${LESSON_COIN_COST} coins.`,
          variant: 'destructive',
        });
        return;
      }
    }

    // 2. We have enough XP. Do optimistic UI update.
    const xpNeededFromLifetime = Math.max(0, LESSON_XP_COST - energy);
    const newDailyXp = Math.max(0, Math.round((energy - LESSON_XP_COST) * 10) / 10);
    const newXp = Math.max(0, xp - xpNeededFromLifetime) + 1; 
    const newCoins = coins + LESSON_COIN_REWARD;

    setUser(prev => {
      if (!prev) return prev;
      const updatedUser: UserProfile = {
        ...prev,
        completedLessons: [...prev.completedLessons, lessonId],
        xp: newXp,
        dailyXp: newDailyXp,
        dailyXpDate: todayKey(),
        sageCoins: newCoins,
        level: badgeForLessons(prev.completedLessons.length + 1).level,
      };
      localStorage.setItem('codesage_cached_profile', JSON.stringify(updatedUser));
      return updatedUser;
    });

    // 3. DIRECT SERVER CALL (No local queue fallback)
    const { data, error } = await supabase.rpc('award_lesson_v2', { _lesson_id: lessonId });
    
    if (error) {
      // Revert optimistic UI on failure
      setUser(prev => prev ? { ...prev, ...user } : prev);
      // Show the EXACT error from Supabase so we know why it failed
      toast({
        title: 'Server Sync Error',
        description: error.message, 
        variant: 'destructive',
      });
      return;
    }

    if (data) {
      applyServerProfile(data);
    }
  };

  const completeTest = async (testId: string) => {
    if (!user) return;
    const { data, error } = await supabase.rpc('complete_test', { _test_id: testId });
    if (error) { console.error('complete_test failed', error.message); return; }
    applyServerProfile(data);
  };

  const addBadge = (_badge: string) => {
    // no-op placeholder for future badge logic
  };

  const updateStreak = async () => {
    if (!user) return;
    // Guard: only one streak call per user per day (survives re-renders and reloads).
    const key = `codesage_streak_ping_${user.id}`;
    const today = new Date().toISOString().slice(0, 10);
    if (streakRef.current === today || localStorage.getItem(key) === today) return;
    streakRef.current = today;
    try { localStorage.setItem(key, today); } catch { /* ignore */ }
    const { data, error } = await supabase.rpc('update_streak');
    if (error) { console.error('update_streak failed', error.message); return; }
    applyServerProfile(data);
  };

  const applyPromoCode = async (code: string): Promise<boolean> => {
    if (!user) return false;
    const { data, error } = await supabase.rpc('redeem_promo', { _code: code });
    if (error || !data) return false;
    applyServerProfile(data);
    return true;
  };

  const updateUser = (data: Partial<UserProfile>) => {
    if (!user) return;
    updateProfile({ ...user, ...data });
  };

  const logout = async () => {
    // Keep onboarded/tour cache so the next login goes straight to the dashboard.
    await supabase.auth.signOut();
    setUser(null);
  };


  const deleteAccount = async () => {
    if (!user) return false;

    const clearLocalAccount = async () => {
      localStorage.removeItem(`codesage_onboarded_${user.id}`);
      await supabase.auth.signOut({ scope: 'local' });
      setUser(null);
    };

    // Validate the server-backed user first. The profile context can briefly
    // outlive a deleted/expired auth session after a refresh or a double click.
    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError || !authData.user) {
      await clearLocalAccount();
      toast({
        title: 'Account session cleared',
        description: 'This account was already deleted or the session had expired.',
      });
      return true;
    }

    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    const accessToken = sessionData.session?.access_token;
    if (sessionError || !accessToken) {
      toast({
        title: 'Could not delete account',
        description: 'Please sign in again and retry.',
        variant: 'destructive',
      });
      return false;
    }

    const { error } = await supabase.functions.invoke('delete-account', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (error) {
      console.error('delete-account failed', error.message);
      toast({
        title: 'Could not delete account',
        description: 'Your account was not changed. Please retry.',
        variant: 'destructive',
      });
      return false;
    }

    await clearLocalAccount();
    return true;
  };

  const toggleDarkMode = () => {
    if (!user) return;
    updateProfile({ ...user, darkMode: !user.darkMode });
  };

   const addXp = (amount: number) => {
    if (!user) return;
    setUser(prev => prev ? { ...prev, xp: prev.xp + amount } : prev);
  };

  const addCoins = (amount: number) => {
    if (!user) return;
    setUser(prev => prev ? { ...prev, sageCoins: prev.sageCoins + amount } : prev);
  };

  const buyFreezeStreak = async (): Promise<boolean> => {
    if (!user) return false;
    const { data, error } = await supabase.rpc('buy_freeze_streak');
    if (error || !data) return false;
    applyServerProfile(data);
    return true;
  };

  const markTourSeen = async () => {
    if (!user) return;
    localStorage.setItem(`codesage_tour_seen_${user.id}`, 'true');
    setUser({ ...user, hasSeenTour: true });
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ has_seen_tour: true })
        .eq('id', user.id);
      if (error) console.error('markTourSeen failed:', error.message);
    } catch (err) {
      console.error('markTourSeen failed:', err);
    }
  };

  const resetTour = async () => {
    if (!user) return;
    localStorage.setItem(`codesage_tour_seen_${user.id}`, 'false');
    setUser({ ...user, hasSeenTour: false });
    try {
      await supabase.from('profiles').update({ has_seen_tour: false }).eq('id', user.id);
    } catch (err) {
      console.error('resetTour failed:', err);
    }
  };


  return (
    <UserContext.Provider value={{
      user, loading, isLoggedIn, isOnboarded, login, signup, completeOnboarding,
      completeLesson, completeTest, addBadge, updateStreak, applyPromoCode,
      updateUser, logout, deleteAccount, toggleDarkMode, addXp, addCoins,
      buyFreezeStreak, markTourSeen, resetTour,
      energy, nextLessonCharge, canLearn, rank, spendCoins,
    }}>
      {children}
    </UserContext.Provider>
  );
};
