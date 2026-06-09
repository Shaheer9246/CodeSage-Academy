/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';

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
  deleteAccount: () => Promise<void>;
  addXp: (amount: number) => void;
  addCoins: (amount: number) => void;
  toggleDarkMode: () => void;
  buyFreezeStreak: () => Promise<boolean>;
  markTourSeen: () => Promise<void>;
  resetTour: () => Promise<void>;
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

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const syncTimer = useRef<number | undefined>(undefined);

  const fetchProfile = useCallback(async (authUser: User) => {
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
      xp: 0,
      level: 1,
      sageCoins: 0,
      hasSeenTour: false,
      isOnboarded: localOnboarded,
      streakFreezeUntil: null,
    });

    try {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', authUser.id).single();
      if (error && error.code !== 'PGRST116') {
        console.error('Profile fetch error:', error.message);
      }
      if (data) {
        setUser(dbRowToProfile(data, authUser.email || ''));
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

useEffect(() => {
    let mounted = true;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;
      
      if (session?.user) {
        await fetchProfile(session.user);
      } else {
        setUser(null);
        setLoading(false);
      }
    });
    
    return () => { 
      mounted = false; 
      subscription.unsubscribe(); 
    };
  }, [fetchProfile]);

  const isLoggedIn = !!user;
  const isOnboarded = user?.isOnboarded === true;

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

  const completeLesson = async (lessonId: string) => {
    if (!user) return;
    const { data, error } = await supabase.rpc('award_lesson', { _lesson_id: lessonId });
    if (error) { console.error('award_lesson failed', error.message); return; }
    applyServerProfile(data);
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
    if (!user) return;
    localStorage.removeItem(`codesage_onboarded_${user.id}`);
    try {
      await supabase.functions.invoke('delete-account');
    } catch (err: unknown) {
      console.error(err);
    }
    await supabase.auth.signOut();
    setUser(null);
  };

  const toggleDarkMode = () => {
    if (!user) return;
    updateProfile({ ...user, darkMode: !user.darkMode });
  };

  const addXp = (_amount: number) => {
    // no-op placeholder for future experience gain logic
  };
  const addCoins = (_amount: number) => {
    // no-op placeholder for future coin gain logic
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
    }}>
      {children}
    </UserContext.Provider>
  );
};
