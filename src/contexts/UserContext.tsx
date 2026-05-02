import { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';

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
  darkMode: boolean;
  xp: number;
  level: number;
  sageCoins: number;
}

interface UserContextType {
  user: UserProfile | null;
  loading: boolean;
  isLoggedIn: boolean;
  isOnboarded: boolean;
  login: (email: string, password: string) => Promise<string | null>;
  signup: (username: string, email: string, password: string) => Promise<string | null>;
  completeOnboarding: (data: Partial<UserProfile>) => void;
  completeLesson: (lessonId: string) => void;
  completeTest: (testId: string) => void;
  addBadge: (badge: string) => void;
  updateStreak: () => void;
  applyPromoCode: (code: string) => boolean;
  updateUser: (data: Partial<UserProfile>) => void;
  logout: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  addXp: (amount: number) => void;
  addCoins: (amount: number) => void;
  toggleDarkMode: () => void;
}

const UserContext = createContext<UserContextType | null>(null);

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be inside UserProvider');
  return ctx;
};

const VALID_PROMO_CODES: Record<string, string[]> = {
  'BACKEND2024': ['backend'],
  'AI2024': ['ai'],
  'FULLACCESS': ['backend', 'ai'],
};

function dbRowToProfile(row: any, email: string): UserProfile {
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
    completedLessons: row.completed_lessons || [],
    completedTests: row.completed_tests || [],
    unlockedSections: row.unlocked_sections || ['frontend'],
    promoCodes: row.promo_codes || [],
    darkMode: row.dark_mode ?? true,
    xp: row.xp || 0,
    level: row.level || 1,
    sageCoins: row.sage_coins || 0,
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
    streak_count: p.streakCount,
    last_active_date: p.lastActiveDate || null,
    badges: p.badges,
    completed_lessons: p.completedLessons,
    completed_tests: p.completedTests,
    unlocked_sections: p.unlockedSections,
    promo_codes: p.promoCodes,
    dark_mode: p.darkMode,
    xp: p.xp,
    level: p.level,
    sage_coins: p.sageCoins,
  };
}

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const syncTimer = useRef<ReturnType<typeof setTimeout>>();

  const fetchProfile = useCallback(async (authUser: User) => {
    try {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', authUser.id).single();
      if (error && error.code !== 'PGRST116') {
        console.error('Profile fetch error:', error.message);
      }
      if (data) {
        setUser(dbRowToProfile(data, authUser.email || ''));
      } else {
        // Profile doesn't exist yet — create a default one
        const defaultProfile: UserProfile = {
          id: authUser.id,
          username: authUser.user_metadata?.username || '',
          email: authUser.email || '',
          name: '', studying: '', hasJob: '', dob: '', goal: '', experienceLevel: '',
          joinDate: new Date().toISOString(),
          streakCount: 0, lastActiveDate: '',
          badges: [], completedLessons: [], completedTests: [],
          unlockedSections: ['frontend'], promoCodes: [], darkMode: true,
          xp: 0, level: 1, sageCoins: 0,
        };
        // Try to insert the profile
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
      // Fallback: create local-only profile so the app still works
      setUser({
        id: authUser.id,
        username: authUser.user_metadata?.username || '',
        email: authUser.email || '',
        name: '', studying: '', hasJob: '', dob: '', goal: '', experienceLevel: '',
        joinDate: new Date().toISOString(),
        streakCount: 0, lastActiveDate: '',
        badges: [], completedLessons: [], completedTests: [],
        unlockedSections: ['frontend'], promoCodes: [], darkMode: true,
        xp: 0, level: 1, sageCoins: 0,
      });
    }
    setLoading(false);
  }, []);

  const syncToDb = useCallback((profile: UserProfile) => {
    if (syncTimer.current) clearTimeout(syncTimer.current);
    syncTimer.current = setTimeout(async () => {
      try {
        await supabase.from('profiles').update(profileToDbUpdate(profile)).eq('id', profile.id);
      } catch (err) {
        console.error('Failed to sync profile:', err);
      }
    }, 500);
  }, []);

  useEffect(() => {
    let mounted = true;
    
    // Set up auth listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;
      if (session?.user) {
        setTimeout(() => { if (mounted) fetchProfile(session.user); }, 0);
      } else {
        setUser(null);
        setLoading(false);
      }
    });
    
    // Then check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      if (session?.user) {
        fetchProfile(session.user);
      } else {
        setLoading(false);
      }
    });
    
    return () => { mounted = false; subscription.unsubscribe(); };
  }, [fetchProfile]);

  const isLoggedIn = !!user;
  const isOnboarded = !!user?.name;

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

  const completeOnboarding = (data: Partial<UserProfile>) => {
    if (!user) return;
    updateProfile({ ...user, ...data });
  };

  const completeLesson = (lessonId: string) => {
    if (!user) return;
    const lessons = [...new Set([...user.completedLessons, lessonId])];
    const updated = { ...user, completedLessons: lessons };
    const badgeCheck = (count: number, badge: string) => {
      if (lessons.length >= count && !updated.badges.includes(badge)) {
        updated.badges = [...updated.badges, badge];
      }
    };
    badgeCheck(1, 'lite');
    badgeCheck(5, 'silver');
    badgeCheck(15, 'gold');
    badgeCheck(25, 'premium');
    badgeCheck(50, 'elite');
    updateProfile(updated);
  };

  const completeTest = (testId: string) => {
    if (!user) return;
    const tests = [...new Set([...user.completedTests, testId])];
    const updated = { ...user, completedTests: tests };
    if (!updated.badges.includes('test-passer')) {
      updated.badges = [...updated.badges, 'test-passer'];
    }
    updateProfile(updated);
  };

  const addBadge = (badge: string) => {
    if (!user || user.badges.includes(badge)) return;
    updateProfile({ ...user, badges: [...user.badges, badge] });
  };

  const updateStreak = () => {
    if (!user) return;
    const today = new Date().toDateString();
    if (user.lastActiveDate) {
      const lastActive = new Date(user.lastActiveDate).toDateString();
      if (today === lastActive) return;
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const isConsecutive = yesterday.toDateString() === lastActive;
      const newStreak = isConsecutive ? user.streakCount + 1 : 1;
      const updated = { ...user, streakCount: newStreak, lastActiveDate: new Date().toISOString() };
      if (newStreak >= 3 && !updated.badges.includes('streak-3')) updated.badges = [...updated.badges, 'streak-3'];
      if (newStreak >= 7 && !updated.badges.includes('streak-7')) updated.badges = [...updated.badges, 'streak-7'];
      if (newStreak >= 30 && !updated.badges.includes('streak-30')) updated.badges = [...updated.badges, 'streak-30'];
      updateProfile(updated);
    } else {
      updateProfile({ ...user, streakCount: 1, lastActiveDate: new Date().toISOString() });
    }
  };

  const applyPromoCode = (code: string): boolean => {
    if (!user) return false;
    const sections = VALID_PROMO_CODES[code.toUpperCase()];
    if (!sections) return false;
    updateProfile({
      ...user,
      unlockedSections: [...new Set([...user.unlockedSections, ...sections])],
      promoCodes: [...new Set([...user.promoCodes, code.toUpperCase()])],
    });
    return true;
  };

  const updateUser = (data: Partial<UserProfile>) => {
    if (!user) return;
    updateProfile({ ...user, ...data });
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const deleteAccount = async () => {
    if (!user) return;
    await supabase.from('profiles').delete().eq('id', user.id);
    await supabase.auth.signOut();
    setUser(null);
  };

  const toggleDarkMode = () => {
    if (!user) return;
    updateProfile({ ...user, darkMode: !user.darkMode });
  };

  return (
    <UserContext.Provider value={{
      user, loading, isLoggedIn, isOnboarded, login, signup, completeOnboarding,
      completeLesson, completeTest, addBadge, updateStreak, applyPromoCode,
      updateUser, logout, deleteAccount, toggleDarkMode,
    }}>
      {children}
    </UserContext.Provider>
  );
};
