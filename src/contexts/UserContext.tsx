import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface UserProfile {
  username: string;
  email: string;
  password: string;
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
}

const defaultUser: UserProfile = {
  username: '',
  email: '',
  password: '',
  name: '',
  studying: '',
  hasJob: '',
  dob: '',
  goal: '',
  experienceLevel: '',
  joinDate: '',
  streakCount: 0,
  lastActiveDate: '',
  badges: [],
  completedLessons: [],
  completedTests: [],
  unlockedSections: ['frontend'],
  promoCodes: [],
  darkMode: true,
};

interface UserContextType {
  user: UserProfile | null;
  isLoggedIn: boolean;
  isOnboarded: boolean;
  login: (email: string, password: string) => boolean;
  signup: (username: string, email: string, password: string) => boolean;
  completeOnboarding: (data: Partial<UserProfile>) => void;
  completeLesson: (lessonId: string) => void;
  completeTest: (testId: string) => void;
  addBadge: (badge: string) => void;
  updateStreak: () => void;
  applyPromoCode: (code: string) => boolean;
  updateUser: (data: Partial<UserProfile>) => void;
  logout: () => void;
  deleteAccount: () => void;
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

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('codesage-user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('codesage-user', JSON.stringify(user));
    } else {
      localStorage.removeItem('codesage-user');
    }
  }, [user]);

  const isLoggedIn = !!user;
  const isOnboarded = !!user?.name;

  const login = (email: string, password: string): boolean => {
    const users: UserProfile[] = JSON.parse(localStorage.getItem('codesage-users') || '[]');
    const found = users.find(u => u.email === email && u.password === password);
    if (found) {
      setUser(found);
      return true;
    }
    return false;
  };

  const signup = (username: string, email: string, password: string): boolean => {
    const users: UserProfile[] = JSON.parse(localStorage.getItem('codesage-users') || '[]');
    if (users.find(u => u.email === email)) return false;
    const newUser: UserProfile = {
      ...defaultUser,
      username,
      email,
      password,
      joinDate: new Date().toISOString(),
      lastActiveDate: new Date().toISOString(),
    };
    users.push(newUser);
    localStorage.setItem('codesage-users', JSON.stringify(users));
    setUser(newUser);
    return true;
  };

  const completeOnboarding = (data: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    updateAllUsers(updated);
  };

  const completeLesson = (lessonId: string) => {
    if (!user) return;
    const lessons = [...new Set([...user.completedLessons, lessonId])];
    const updated = { ...user, completedLessons: lessons };
    // Check for badges
    if (lessons.length === 1 && !updated.badges.includes('first-lesson')) {
      updated.badges = [...updated.badges, 'first-lesson'];
    }
    if (lessons.length === 5 && !updated.badges.includes('five-lessons')) {
      updated.badges = [...updated.badges, 'five-lessons'];
    }
    if (lessons.length === 10 && !updated.badges.includes('ten-lessons')) {
      updated.badges = [...updated.badges, 'ten-lessons'];
    }
    if (lessons.length === 25 && !updated.badges.includes('quarter-century')) {
      updated.badges = [...updated.badges, 'quarter-century'];
    }
    updateAllUsers(updated);
  };

  const completeTest = (testId: string) => {
    if (!user) return;
    const tests = [...new Set([...user.completedTests, testId])];
    const updated = { ...user, completedTests: tests };
    if (!updated.badges.includes('test-passer')) {
      updated.badges = [...updated.badges, 'test-passer'];
    }
    updateAllUsers(updated);
  };

  const addBadge = (badge: string) => {
    if (!user || user.badges.includes(badge)) return;
    updateAllUsers({ ...user, badges: [...user.badges, badge] });
  };

  const updateStreak = () => {
    if (!user) return;
    const today = new Date().toDateString();
    const lastActive = new Date(user.lastActiveDate).toDateString();
    if (today === lastActive) return;

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const isConsecutive = yesterday.toDateString() === lastActive;

    const newStreak = isConsecutive ? user.streakCount + 1 : 1;
    const updated = { ...user, streakCount: newStreak, lastActiveDate: new Date().toISOString() };
    
    if (newStreak >= 7 && !updated.badges.includes('week-streak')) {
      updated.badges = [...updated.badges, 'week-streak'];
    }
    if (newStreak >= 30 && !updated.badges.includes('month-streak')) {
      updated.badges = [...updated.badges, 'month-streak'];
    }
    updateAllUsers(updated);
  };

  const applyPromoCode = (code: string): boolean => {
    if (!user) return false;
    const sections = VALID_PROMO_CODES[code.toUpperCase()];
    if (!sections) return false;
    const updated = {
      ...user,
      unlockedSections: [...new Set([...user.unlockedSections, ...sections])],
      promoCodes: [...new Set([...user.promoCodes, code.toUpperCase()])],
    };
    updateAllUsers(updated);
    return true;
  };

  const updateUser = (data: Partial<UserProfile>) => {
    if (!user) return;
    updateAllUsers({ ...user, ...data });
  };

  const logout = () => setUser(null);

  const deleteAccount = () => {
    if (!user) return;
    const users: UserProfile[] = JSON.parse(localStorage.getItem('codesage-users') || '[]');
    localStorage.setItem('codesage-users', JSON.stringify(users.filter(u => u.email !== user.email)));
    setUser(null);
  };

  const toggleDarkMode = () => {
    if (!user) return;
    updateAllUsers({ ...user, darkMode: !user.darkMode });
  };

  const updateAllUsers = (updated: UserProfile) => {
    setUser(updated);
    const users: UserProfile[] = JSON.parse(localStorage.getItem('codesage-users') || '[]');
    const idx = users.findIndex(u => u.email === updated.email);
    if (idx >= 0) users[idx] = updated;
    else users.push(updated);
    localStorage.setItem('codesage-users', JSON.stringify(users));
  };

  return (
    <UserContext.Provider value={{
      user, isLoggedIn, isOnboarded, login, signup, completeOnboarding,
      completeLesson, completeTest, addBadge, updateStreak, applyPromoCode,
      updateUser, logout, deleteAccount, toggleDarkMode,
    }}>
      {children}
    </UserContext.Provider>
  );
};
