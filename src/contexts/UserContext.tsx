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

function dbRowToProfile(row: any, email: string): UserProfile {
  const localOnboarded = localStorage.getItem(`codesage_onboarded_${row.id}`) === 'true';
  const localTourSeen = localStorage.getItem(`codesage_tour_seen_${row.id}`) === 'true';
  
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
    // If they have a name in the database OR local storage says true, they are onboarded!
    isOnboarded: localOnboarded || !!row.name, 
    hasSeenTour: localTourSeen,
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

function profileToDbUpdate(p: UserProfile): Record<string, any> {
  return {
    username: p.username,
    name: p.name,
    studying: p.studying,
    has_job: p.hasJob,
    dob: p.dob,
    goal: p.goal,
    experience_level: p.experienceLevel,
    dark_mode: p.darkMode,
  };
}

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const syncTimer = useRef<ReturnType<typeof setTimeout>>();

  const fetchProfile = useCallback(async (authUser: User) => {
    // Check backup local storage status early
    const localOnboarded = localStorage.getItem(`codesage_onboarded_${authUser.id}`) === 'true';
    
    try {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', authUser.id).single();
      if (error && error.code !== 'PGRST116') {
        console.error('Profile fetch error:', error.message);
      }
      if (data) {
        setUser(dbRowToProfile(data, authUser.email || ''));
      // Find this block inside fetchProfile where new profiles are inserted:
} else {
  const defaultProfile: UserProfile = {
    id: authUser.id,
    username: authUser.user_metadata?.username || '',
    email: authUser.email || '',
    name: '', studying: '', hasJob: '', dob: '', goal: '', experienceLevel: '',
    joinDate: new Date().toISOString(),
    streakCount: 0, lastActiveDate: '',
    badges: [], completedLessons: [], completedTests: [],
    unlockedSections: ['frontend'], promoCodes: [], darkMode: true,
    xp: 0, level: 1, sageCoins: 0, hasSeenTour: false, 
    isOnboarded: localOnboarded, 
    streakFreezeUntil: null,
  };
  
 const { error: insertError } = await supabase.from('profiles').insert({
    id: authUser.id,
    username: authUser.user_metadata?.username || '',
  });
  
  if (insertError) {
    console.error('Profile insert error:', insertError.message);
  }
  setUser(defaultProfile);
}
    } catch (err) {
      console.error('Failed to fetch profile:', err);
      setUser({
        id: authUser.id,
        username: authUser.user_metadata?.username || '',
        email: authUser.email || '',
        name: '', studying: '', hasJob: '', dob: '', goal: '', experienceLevel: '',
        joinDate: new Date().toISOString(),
        streakCount: 0, lastActiveDate: '',
        badges: [], completedLessons: [], completedTests: [],
        unlockedSections: ['frontend'], promoCodes: [], darkMode: true,
        xp: 0, level: 1, sageCoins: 0, hasSeenTour: false, 
        isOnboarded: localOnboarded, 
        streakFreezeUntil: null,
      });
    }
    setLoading(false);
  }, []);

  const syncToDb = useCallback((profile: UserProfile) => {
    if (syncTimer.current) clearTimeout(syncTimer.current);
    syncTimer.current = setTimeout(async () => {
      try {
        await supabase.from('profiles').update(profileToDbUpdate(profile) as any).eq('id', profile.id);
      } catch (err) {
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
    } catch (err: any) {
      return err?.message || 'Network error — please check your connection';
    }
  };

  const signup = async (username: string, email: string, password: string): Promise<string | null> => {
    try {
      const { error } = await supabase.auth.signUp({
        email, password,
        options: { data: { username } },
      });
      return error ? error.message : null;
    } catch (err: any) {
      return err?.message || 'Network error — please check your connection';
    }
  };

 const completeOnboarding = async (data: Partial<UserProfile>) => {
    if (!user) return;
    
    localStorage.setItem(`codesage_onboarded_${user.id}`, 'true');
    localStorage.setItem(`codesage_tour_seen_${user.id}`, 'false');
    
    const updatedProfile = { ...user, ...data, isOnboarded: true, hasSeenTour: false };
    setUser(updatedProfile);
    
    try {
      const dbData = profileToDbUpdate(updatedProfile);
      await supabase.from('profiles').update(dbData as any).eq('id', user.id);
    } catch (err) {
      console.error('Onboarding cloud save error:', err);
    }
  };
  

  const applyServerProfile = (row: any) => {
  if (!user || !row) return;
  
  // 👍 FIX: Extract the first element if the database response arrives wrapped in an array
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

  const addBadge = (_badge: string) => {};

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
    if (user) localStorage.removeItem(`codesage_onboarded_${user.id}`);
    await supabase.auth.signOut();
    setUser(null);
  };

  const deleteAccount = async () => {
    if (!user) return;
    localStorage.removeItem(`codesage_onboarded_${user.id}`);
    try { await supabase.functions.invoke('delete-account'); } catch (err) { console.error(err); }
    await supabase.auth.signOut();
    setUser(null);
  };

  const toggleDarkMode = () => {
    if (!user) return;
    updateProfile({ ...user, darkMode: !user.darkMode });
  };

  const addXp = (_amount: number) => {};
  const addCoins = (_amount: number) => {};

  const buyFreezeStreak = async (): Promise<boolean> => {
    if (!user) return false;
    const { data, error } = await supabase.rpc('buy_freeze_streak' as any);
    if (error || !data) return false;
    applyServerProfile(data);
    return true;
  };

 const markTourSeen = async () => {
    if (!user) return;
    localStorage.setItem(`codesage_tour_seen_${user.id}`, 'true');
    setUser({ ...user, hasSeenTour: true });
  };

  const resetTour = async () => {
    if (!user) return;
    localStorage.setItem(`codesage_tour_seen_${user.id}`, 'false');
    setUser({ ...user, hasSeenTour: false });
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
