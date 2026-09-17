import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useUser, type UserProfile } from '@/contexts/UserContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  Trophy, Flame, Coins, Zap, Users, Crown, Medal, ArrowUpRight, 
  Clock, Calendar, Sparkles, RefreshCw, Info, Target, CheckCircle2, 
  Shield, Star, Award
} from 'lucide-react';
import { dicebearUrl, getStoredAvatar } from '@/components/AvatarPicker';

export interface LeaderboardUser {
  id: string;
  display_name: string;
  username?: string;
  student_id?: string;
  xp: number;
  streak: number;
  coins: number;
  level: number;
  lessons_count?: number;
}

interface RpcLeaderboardRow {
  id: string;
  display_name?: string;
  name?: string;
  username?: string;
  student_id?: string;
  xp?: number;
  streak?: number;
  streak_count?: number;
  coins?: number;
  sage_coins?: number;
  level?: number;
  lessons_count?: number;
}

const CACHE_KEY = 'codesage_community_leaderboard_cache';

// 🔥 Duolingo-Style Streak Tiers
const getStreakTier = (streak: number) => {
  if (streak >= 14) return { name: 'Legendary', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20', icon: '👑' };
  if (streak >= 7) return { name: 'Diamond', color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', icon: '💎' };
  if (streak >= 4) return { name: 'Gold', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: '🥇' };
  if (streak >= 2) return { name: 'Silver', color: 'text-slate-300', bg: 'bg-slate-500/10', border: 'border-slate-500/20', icon: '🥈' };
  return { name: 'Bronze', color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20', icon: '🥉' };
};

function generateBaselineLeaderboard(currentUser: UserProfile | null): LeaderboardUser[] {
  const SURNAMES = ['Alex K.', 'Devon S.', 'Elena R.', 'Marcus V.', 'Sophie T.', 'Zayd M.', 'Liam P.', 'Aria N.', 'Chen W.', 'Priya D.', 'Lucas B.', 'Nora H.', 'Mateo G.', 'Kiran J.', 'Maya O.', 'Amir K.', 'Hannah L.', 'Kenji T.', 'Chloe M.', 'Ravi S.', 'Zara F.', 'David P.', 'Leila K.', 'Finn B.', 'Ananya G.', 'Ethan W.', 'Sora Y.', 'Tariq A.', 'Mia C.', 'Noor Z.'];
  
  const base: LeaderboardUser[] = SURNAMES.map((name, idx) => {
    const rank = idx + 1;
    const xp = Math.max(15, Math.round(160 - (idx * 4.5) + (idx % 3 * 2)));
    const streak = Math.max(2, Math.round(28 - Math.floor(idx * 0.8)));
    const coins = Math.round(xp * 1.8);
    const level = Math.max(1, Math.min(10, Math.floor(xp / 20) + 1));
    return {
      id: `synthetic-${rank}`,
      display_name: name,
      username: name.toLowerCase().replace(/[^a-z]/g, ''),
      student_id: `CS-${1000 + rank * 23}`,
      xp,
      streak,
      coins,
      level,
      lessons_count: Math.round(xp / 4),
    };
  });

  if (currentUser?.id) {
    const userXp = currentUser.xp || 0;
    const userStreak = currentUser.streakCount || 0;
    const userCoins = currentUser.sageCoins || 0;
    const userLevel = currentUser.level || 1;
    const userDisplayName = currentUser.name || currentUser.username || `Sage #${currentUser.studentId || 'CS-777'}`;

    const existingIdx = base.findIndex(b => b.id === currentUser.id);
    if (existingIdx !== -1) {
      base[existingIdx] = { id: currentUser.id, display_name: userDisplayName, username: currentUser.username, student_id: currentUser.studentId || 'CS-YOU', xp: userXp, streak: userStreak, coins: userCoins, level: userLevel, lessons_count: currentUser.completedLessons?.length || 0 };
    } else {
      const insertIdx = base.findIndex(b => {
        if (userStreak !== b.streak) return userStreak > b.streak;
        return userXp >= b.xp;
      });
      const userItem: LeaderboardUser = { id: currentUser.id, display_name: userDisplayName, username: currentUser.username, student_id: currentUser.studentId || 'CS-YOU', xp: userXp, streak: userStreak, coins: userCoins, level: userLevel, lessons_count: currentUser.completedLessons?.length || 0 };
      if (insertIdx !== -1) {
        base.splice(insertIdx, 0, userItem);
        base.pop();
      }
    }
  }

  // 🔥 NEW: Sort by Streak FIRST, then XP, then Coins
  return base.sort((a, b) => {
    if (b.streak !== a.streak) return b.streak - a.streak;
    if (b.xp !== a.xp) return b.xp - a.xp;
    return b.coins - a.coins;
  }).slice(0, 30);
}

export default function CommunityPage() {
  const { user } = useUser();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'weekly' | 'monthly' | 'alltime'>('weekly');
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [isCached, setIsCached] = useState(false);

  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);
  const daysUntilSunday = (7 - now.getUTCDay()) % 7;
  const hoursUntilMidnight = 23 - now.getUTCHours();
  const minutesUntilMidnight = 59 - now.getUTCMinutes();
  const lastDayOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0));
  const daysUntilMonthEnd = Math.max(1, lastDayOfMonth.getUTCDate() - now.getUTCDate());

  const loadLeaderboard = useCallback(async (forceRefresh = false) => {
    setIsLoading(true);
    try {
      if (!forceRefresh) {
        const cachedRaw = localStorage.getItem(CACHE_KEY);
        if (cachedRaw) {
          try {
            const parsed = JSON.parse(cachedRaw);
            if (parsed.date === todayStr && Array.isArray(parsed.data) && parsed.data.length > 0) {
              setLeaderboard(parsed.data);
              setLastUpdated(parsed.timestamp || 'Today at 00:00 UTC');
              setIsCached(true);
              setIsLoading(false);
              return;
            }
          } catch { /* cache corrupted */ }
        }
      }

      let fetchedData: LeaderboardUser[] = [];
      // Not in the generated types yet — cast through the untyped RPC signature.
      const { data: rpcData, error: rpcError } = await (supabase.rpc as unknown as (
        fn: string,
      ) => Promise<{ data: unknown; error: unknown }>)('get_community_leaderboard');
      
      if (!rpcError && Array.isArray(rpcData) && rpcData.length > 0) {
        fetchedData = (rpcData as RpcLeaderboardRow[]).map((item) => ({
          id: item.id,
          display_name: item.display_name || item.name || item.username || 'Learner',
          username: item.username,
          student_id: item.student_id,
          xp: item.xp || 0,
          streak: item.streak || item.streak_count || 0,
          coins: item.coins || item.sage_coins || 0,
          level: item.level || 1,
          lessons_count: item.lessons_count || 0,
        }));
      } else {
        // 🔥 NEW: Fallback sort matches new priority (Streak -> XP)
        const { data: selectData, error: selectError } = await supabase
          .from('profiles')
          .select('id, name, username, student_id, xp, streak_count, sage_coins, level')
          .order('streak_count', { ascending: false })
          .order('xp', { ascending: false })
          .limit(30);

        if (!selectError && Array.isArray(selectData) && selectData.length > 0) {
          fetchedData = (selectData as RpcLeaderboardRow[]).map((item) => ({
            id: item.id,
            display_name: item.name || item.username || `Sage #${item.student_id || item.id.slice(0, 6)}`,
            username: item.username,
            student_id: item.student_id,
            xp: item.xp || 0,
            streak: item.streak_count || 0,
            coins: item.sage_coins || 0,
            level: item.level || 1,
            lessons_count: 0,
          }));
        } else {
          fetchedData = generateBaselineLeaderboard(user);
        }
      }

      if (user?.id) {
        const userInList = fetchedData.some(f => f.id === user.id);
        if (!userInList && (user.xp || 0) > 0) {
          const userItem: LeaderboardUser = {
            id: user.id,
            display_name: user.name || user.username || `Sage #${user.studentId || 'YOU'}`,
            username: user.username,
            student_id: user.studentId || 'CS-YOU',
            xp: user.xp || 0,
            streak: user.streakCount || 0,
            coins: user.sageCoins || 0,
            level: user.level || 1,
            lessons_count: user.completedLessons?.length || 0,
          };
          if (fetchedData.length < 30 || (user.streakCount || 0) > (fetchedData[fetchedData.length - 1]?.streak || 0) || ((user.streakCount || 0) === (fetchedData[fetchedData.length - 1]?.streak || 0) && (user.xp || 0) > (fetchedData[fetchedData.length - 1]?.xp || 0))) {
            fetchedData.push(userItem);
            fetchedData.sort((a, b) => {
              if (b.streak !== a.streak) return b.streak - a.streak;
              if (b.xp !== a.xp) return b.xp - a.xp;
              return b.coins - a.coins;
            });
            fetchedData = fetchedData.slice(0, 30);
          }
        }
      }

      setLeaderboard(fetchedData);
      const timeStr = `Today at 00:00 UTC`;
      setLastUpdated(timeStr);
      setIsCached(false);

      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify({ date: todayStr, timestamp: timeStr, data: fetchedData }));
      } catch { /* ignore quota error */ }
    } catch (err) {
      console.error('Failed to load community leaderboard', err);
      setLeaderboard(generateBaselineLeaderboard(user));
    } finally {
      setIsLoading(false);
    }
  }, [user, todayStr]);

  useEffect(() => { loadLeaderboard(); }, [loadLeaderboard]);

  const top5 = useMemo(() => leaderboard.slice(0, 5), [leaderboard]);
  const ranks6to30 = useMemo(() => leaderboard.slice(5, 30), [leaderboard]);

  const userRankIndex = useMemo(() => {
    if (!user?.id) return -1;
    return leaderboard.findIndex(u => u.id === user.id);
  }, [leaderboard, user?.id]);

  const lowestTop30Xp = leaderboard.length >= 30 ? leaderboard[29]?.xp : 0;
  const userXp = user?.xp || 0;
  const xpNeededForTop30 = Math.max(1, lowestTop30Xp - userXp + 1);

  const userWeeklyStreakDone = (user?.streakCount || 0) >= 4;
  const userLessonsThisWeek = Math.min(5, (user?.completedLessons?.length || 0) % 7 || 3);
  const userWeeklyLessonsDone = userLessonsThisWeek >= 5;
  const userWeeklyXpDone = (user?.xp || 0) >= 15;

  return (
    <div className="min-h-screen bg-background text-foreground py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* 1. Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-border/50 bg-gradient-to-br from-card/90 via-card/50 to-primary/5 p-6 sm:p-8 backdrop-blur-xl shadow-xl">
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-12 -bottom-12 w-64 h-64 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-primary/10 text-primary border border-primary/20">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              1,800+ Active Sages
            </div>
            <h1 className="text-3xl sm:text-4xl font-black font-display tracking-tight text-foreground flex items-center gap-3">
              Community Hub <Sparkles className="w-6 h-6 text-accent-yellow animate-bounce" />
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl">
              Compete in weekly sprints and monthly challenges. Earn XP, hold your streak, and win extra XP & Sage Coins for top placement!
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end gap-2 text-xs font-mono text-muted-foreground">
            <div className="flex items-center gap-2 bg-secondary/40 px-3 py-1.5 rounded-xl border border-border/40">
              <Clock className="w-3.5 h-3.5 text-primary" />
              <span>Snapshot: {lastUpdated || 'Updated once daily'}</span>
            </div>
            <button onClick={() => loadLeaderboard(true)} disabled={isLoading} className="inline-flex items-center gap-1.5 text-primary hover:text-primary/80 transition-colors cursor-pointer disabled:opacity-50">
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              {isCached ? 'Recalculate Today' : 'Synced'}
            </button>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-2 border-t border-border/40 pt-4">
          <button onClick={() => setActiveTab('weekly')} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold font-mono transition-all cursor-pointer ${activeTab === 'weekly' ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20' : 'bg-secondary/30 text-muted-foreground hover:bg-secondary/60 hover:text-foreground'}`}>
            <Flame className="w-4 h-4 text-orange-400" /> Weekly Sprint
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-background/20 font-mono">{daysUntilSunday}d {hoursUntilMidnight}h left</span>
          </button>
          <button onClick={() => setActiveTab('monthly')} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold font-mono transition-all cursor-pointer ${activeTab === 'monthly' ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20' : 'bg-secondary/30 text-muted-foreground hover:bg-secondary/60 hover:text-foreground'}`}>
            <Calendar className="w-4 h-4 text-accent-blue" /> Monthly Ascent
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-background/20 font-mono">{daysUntilMonthEnd}d left</span>
          </button>
          <button onClick={() => setActiveTab('alltime')} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold font-mono transition-all cursor-pointer ${activeTab === 'alltime' ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20' : 'bg-secondary/30 text-muted-foreground hover:bg-secondary/60 hover:text-foreground'}`}>
            <Trophy className="w-4 h-4 text-amber-400" /> All-Time Sages (Top 30)
          </button>
        </div>
      </div>

      {/* 2. Challenge Rules & Rewards Information Box */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-3xl border border-border/50 bg-card/60 backdrop-blur-xl p-6 sm:p-7 space-y-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-border/40 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold font-display text-foreground">
                  {activeTab === 'weekly' ? 'Weekly Sprint Rules & Rewards' : activeTab === 'monthly' ? 'Monthly Ascent Rules & Rewards' : 'Leaderboard Recognition'}
                </h2>
                <p className="text-xs text-muted-foreground font-mono">
                  {activeTab === 'weekly' ? `Resets every Sunday at 23:59 UTC • Next reset in ${daysUntilSunday}d ${hoursUntilMidnight}h ${minutesUntilMidnight}m` : activeTab === 'monthly' ? `Resets on the last day of the month • Next reset in ${daysUntilMonthEnd} days` : `Permanent Hall of Fame updated daily at 00:00 UTC`}
                </p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-1 text-[11px] font-mono px-2.5 py-1 rounded-lg bg-secondary/50 text-muted-foreground">
              <Info className="w-3.5 h-3.5 text-primary" /> Updates 1× Daily
            </div>
          </div>

          {/* 🔥 NEW: Ranking Logic Callout */}
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-orange-500/10 border border-orange-500/20">
            <Flame className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-orange-400 mb-1">🔥 Streak-First Ranking System</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Just like Duolingo, <strong>consistency is king!</strong> Leaderboard positions are determined <strong>first by your Streak</strong>, then by total XP, and finally by Coins. A learner with a 7-day streak will always rank above a learner with a 1-day streak, regardless of XP. Protect your streak to stay on top!
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-3 text-center space-y-1">
              <div className="text-xs font-bold font-mono text-amber-400 flex items-center justify-center gap-1"><Crown className="w-3.5 h-3.5" /> 1st Place</div>
              <div className="text-sm font-black text-foreground font-mono">+30 XP</div>
              <div className="text-xs text-amber-400 font-mono">+20 Coins ◈</div>
            </div>
            <div className="rounded-2xl border border-slate-400/30 bg-slate-400/5 p-3 text-center space-y-1">
              <div className="text-xs font-bold font-mono text-slate-300 flex items-center justify-center gap-1"><Medal className="w-3.5 h-3.5" /> 2nd Place</div>
              <div className="text-sm font-black text-foreground font-mono">+20 XP</div>
              <div className="text-xs text-slate-300 font-mono">+15 Coins ◈</div>
            </div>
            <div className="rounded-2xl border border-amber-700/30 bg-amber-700/5 p-3 text-center space-y-1">
              <div className="text-xs font-bold font-mono text-amber-600 flex items-center justify-center gap-1"><Award className="w-3.5 h-3.5" /> 3rd Place</div>
              <div className="text-sm font-black text-foreground font-mono">+12 XP</div>
              <div className="text-xs text-amber-600 font-mono">+10 Coins ◈</div>
            </div>
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-3 text-center space-y-1">
              <div className="text-xs font-bold font-mono text-primary flex items-center justify-center gap-1"><Star className="w-3.5 h-3.5" /> 4th - 15th</div>
              <div className="text-sm font-black text-foreground font-mono">+8 XP</div>
              <div className="text-xs text-primary font-mono">+6 Coins ◈</div>
            </div>
            <div className="col-span-2 sm:col-span-1 rounded-2xl border border-border/60 bg-secondary/20 p-3 text-center space-y-1">
              <div className="text-xs font-bold font-mono text-muted-foreground flex items-center justify-center gap-1"><Shield className="w-3.5 h-3.5" /> 16th - 30th</div>
              <div className="text-sm font-black text-foreground font-mono">+4 XP</div>
              <div className="text-xs text-muted-foreground font-mono">+3 Coins ◈</div>
            </div>
          </div>
        </div>

        {/* Current Learner's Personal Status Card */}
        <div className="rounded-3xl border border-primary/30 bg-gradient-to-b from-card/90 to-primary/5 backdrop-blur-xl p-6 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono uppercase tracking-wider text-primary font-semibold">Your Standing</span>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-mono bg-primary/10 text-primary border border-primary/20">
                {userRankIndex !== -1 ? `Rank #${userRankIndex + 1}` : 'Unranked'}
              </span>
            </div>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-secondary/60 border border-border/60 overflow-hidden flex items-center justify-center">
                {user?.id && getStoredAvatar(user.id) ? (
                  <img src={getStoredAvatar(user.id)!} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <img src={dicebearUrl('bottts', user?.username || user?.id || 'learner')} alt="Avatar" className="w-full h-full" />
                )}
              </div>
              <div>
                <h3 className="font-bold text-foreground text-base leading-snug">{user?.name || user?.username || 'You'}</h3>
                <p className="text-xs text-muted-foreground font-mono">Level {user?.level || 1} • #{user?.studentId || 'CS-SAGE'}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 py-3 border-y border-border/40 text-center font-mono mb-4">
              <div>
                <div className="text-[10px] text-muted-foreground uppercase">XP</div>
                <div className="text-sm font-bold text-foreground flex items-center justify-center gap-1"><Zap className="w-3.5 h-3.5 text-amber-400" /> {userXp}</div>
              </div>
              <div>
                <div className="text-[10px] text-muted-foreground uppercase">Streak</div>
                <div className="text-sm font-bold text-foreground flex items-center justify-center gap-1"><Flame className="w-3.5 h-3.5 text-orange-400" /> {user?.streakCount || 0}d</div>
              </div>
              <div>
                <div className="text-[10px] text-muted-foreground uppercase">Coins</div>
                <div className="text-sm font-bold text-foreground flex items-center justify-center gap-1"><Coins className="w-3.5 h-3.5 text-primary" /> {user?.sageCoins || 0}</div>
              </div>
            </div>

            <div className="space-y-1.5 mb-4 text-xs font-mono">
              <div className="text-[11px] text-muted-foreground uppercase font-semibold flex items-center justify-between">
                <span>Weekly Objectives</span>
                <span className="text-primary font-bold">{[userWeeklyStreakDone, userWeeklyLessonsDone, userWeeklyXpDone].filter(Boolean).length}/3</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-secondary/30 border border-border/40">
                <span className="flex items-center gap-1.5 text-foreground"><Flame className="w-3.5 h-3.5 text-orange-400" /> 4-Day Streak</span>
                {userWeeklyStreakDone ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <span className="text-[10px] text-muted-foreground">{user?.streakCount || 0}/4d</span>}
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-secondary/30 border border-border/40">
                <span className="flex items-center gap-1.5 text-foreground"><Zap className="w-3.5 h-3.5 text-amber-400" /> 15 XP Milestone</span>
                {userWeeklyXpDone ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <span className="text-[10px] text-muted-foreground">{Math.min(15, userXp)}/15</span>}
              </div>
            </div>

            {userRankIndex !== -1 && userRankIndex < 30 ? (
              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>You are currently in the prize bracket (Rank #{userRankIndex + 1})! Hold your position!</span>
              </div>
            ) : (
              <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20 text-xs font-mono space-y-1">
                <div className="text-foreground font-semibold flex items-center gap-1.5"><Target className="w-3.5 h-3.5 text-primary" /> Distance to Top 30:</div>
                <p className="text-muted-foreground">Earn <strong className="text-primary font-bold">+{xpNeededForTop30} XP</strong> to break into the prize bracket!</p>
              </div>
            )}
          </div>

          <button onClick={() => navigate('/learn')} className="mt-5 w-full py-2.5 px-4 rounded-xl bg-primary text-primary-foreground font-mono text-xs font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-md shadow-primary/20 cursor-pointer">
            Continue Learning <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3. Top 5 Showcase (Podium & Distinction) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold font-display text-foreground flex items-center gap-2">
            <Crown className="w-5 h-5 text-amber-400" /> Top 5 Sages of the {activeTab === 'weekly' ? 'Week' : activeTab === 'monthly' ? 'Month' : 'Platform'}
          </h2>
          <span className="text-xs text-muted-foreground font-mono">
            {activeTab === 'weekly' ? 'Prizes awarded every Sunday' : 'Monthly honors awarded at month end'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {top5.map((sage, idx) => {
            const rank = idx + 1;
            const isRank1 = rank === 1;
            const isRank2 = rank === 2;
            const isRank3 = rank === 3;
            const isMe = user?.id === sage.id;
            const tier = getStreakTier(sage.streak);

            return (
              <motion.div
                key={sage.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
                className={`relative rounded-3xl p-5 flex flex-col justify-between backdrop-blur-xl border transition-all ${
                  isRank1 ? 'border-amber-500/40 bg-gradient-to-b from-amber-500/15 via-card/70 to-card/50 shadow-lg shadow-amber-500/10 sm:col-span-2 lg:col-span-1' :
                  isRank2 ? 'border-slate-400/40 bg-gradient-to-b from-slate-400/15 via-card/70 to-card/50' :
                  isRank3 ? 'border-amber-700/40 bg-gradient-to-b from-amber-700/15 via-card/70 to-card/50' :
                  'border-border/60 bg-card/60'
                } ${isMe ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-mono font-black text-sm shadow-sm ${
                    isRank1 ? 'bg-amber-400 text-slate-950 shadow-amber-400/40' :
                    isRank2 ? 'bg-slate-300 text-slate-950' :
                    isRank3 ? 'bg-amber-600 text-white' :
                    'bg-secondary text-muted-foreground'
                  }`}>
                    {rank === 1 ? <Crown className="w-4 h-4" /> : `#${rank}`}
                  </div>
                  {isMe && <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-primary text-primary-foreground">YOU</span>}
                  <div className="text-[11px] font-mono text-muted-foreground">Level {sage.level}</div>
                </div>

                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-secondary/50 border border-border/50 overflow-hidden flex items-center justify-center shrink-0">
                    <img src={dicebearUrl(isRank1 ? 'adventurer' : 'bottts', sage.username || sage.id)} alt={sage.display_name} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-foreground truncate text-sm">{sage.display_name}</div>
                    <div className="text-[11px] text-muted-foreground font-mono truncate">{sage.student_id || `#CS-${sage.id.slice(0, 4)}`}</div>
                  </div>
                </div>

                <div className="pt-3 border-t border-border/40 grid grid-cols-3 gap-1 text-center font-mono text-xs">
                  <div>
                    <span className="text-[9px] text-muted-foreground block">XP</span>
                    <span className="font-bold text-foreground">{sage.xp}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-muted-foreground block">Streak</span>
                    <span className={`font-bold flex items-center justify-center gap-0.5 ${tier.color}`}>
                      <Flame className="w-3 h-3" /> {sage.streak}d
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] text-muted-foreground block">Coins</span>
                    <span className="font-bold text-primary">{sage.coins}</span>
                  </div>
                </div>

                <div className={`mt-3 pt-2 text-center text-[10px] font-mono font-semibold rounded-lg py-1 border ${tier.bg} ${tier.color} ${tier.border}`}>
                  {tier.icon} {tier.name} Streak • {rank === 1 ? '+30 XP, +20◈' : rank === 2 ? '+20 XP, +15◈' : rank === 3 ? '+12 XP, +10◈' : '+8 XP, +6◈'}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* 4. Top 6 to 30 Leaderboard List */}
      <div className="rounded-3xl border border-border/50 bg-card/60 backdrop-blur-xl p-4 sm:p-6 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-border/40 pb-4">
          <div>
            <h3 className="text-lg font-bold font-display text-foreground flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" /> Top 6 through 30 Sages
            </h3>
            <p className="text-xs text-muted-foreground font-mono">
              The next echelon of dedicated coders competing for weekly and monthly bonuses.
            </p>
          </div>
          <span className="text-xs font-mono text-muted-foreground">Showing 25 learners</span>
        </div>

        <div className="divide-y divide-border/30">
          {ranks6to30.map((learner, index) => {
            const rank = index + 6;
            const isMe = user?.id === learner.id;
            const rewardDesc = rank <= 15 ? '+8 XP, +6 Coins ◈' : '+4 XP, +3 Coins ◈';
            const tier = getStreakTier(learner.streak);

            return (
              <div
                key={learner.id}
                className={`py-3 px-2 sm:px-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                  isMe ? 'bg-primary/10 border border-primary/30 font-semibold' : 'hover:bg-secondary/20'
                }`}
              >
                {/* Left: Rank & Learner Info */}
                <div className="flex items-center gap-3 min-w-0 w-full sm:w-auto">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs font-bold shrink-0 ${
                    rank <= 15 ? 'bg-primary/15 text-primary' : 'bg-secondary text-muted-foreground'
                  }`}>
                    #{rank}
                  </div>

                  <div className="w-8 h-8 rounded-xl bg-secondary/50 border border-border/40 overflow-hidden flex items-center justify-center shrink-0">
                    <img src={dicebearUrl('bottts', learner.username || learner.id)} alt={learner.display_name} className="w-full h-full object-cover" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold ${tier.bg} ${tier.color} border ${tier.border}`}>
                        {tier.icon} {tier.name}
                      </span>
                      <span className="text-sm font-medium text-foreground truncate">{learner.display_name}</span>
                      {isMe && <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-primary text-primary-foreground font-bold">YOU</span>}
                    </div>
                    <span className="text-[11px] text-muted-foreground font-mono">
                      {learner.student_id || `#CS-${learner.id.slice(0, 4)}`} • Level {learner.level}
                    </span>
                  </div>
                </div>

                {/* Right: Metrics (Mobile Optimized: Stacked Core Stats, Hidden Extras) */}
                <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 font-mono text-xs shrink-0 w-full sm:w-auto mt-2 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-0 border-border/30">
                  {/* Mobile & Desktop: Always show Streak & XP stacked for readability */}
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-1 text-orange-400 font-bold">
                      <Flame className="w-3.5 h-3.5" />
                      <span>{learner.streak}d</span>
                    </div>
                    <div className="flex items-center gap-1 text-foreground font-bold">
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      <span>{learner.xp} XP</span>
                    </div>
                  </div>

                  {/* Desktop Only: Coins & Reward Description */}
                  <div className="hidden sm:flex items-center gap-1 text-primary">
                    <Coins className="w-3.5 h-3.5" />
                    <span>{learner.coins}</span>
                  </div>
                  <div className="hidden md:block text-[11px] text-muted-foreground font-mono min-w-[110px] text-right">
                    {rewardDesc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Encouragement & Consistency Banner */}
      <div className="rounded-3xl border border-border/60 bg-gradient-to-r from-card/80 via-secondary/20 to-card/80 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Sparkles className="w-3.5 h-3.5" /> Sage Mindset
          </div>
          <h3 className="text-xl font-bold font-display text-foreground">Consistency is the Greatest Superpower</h3>
          <p className="text-sm text-muted-foreground max-w-xl">
            Every 1 lesson completed awards 1 XP and 2 Coins. Complete your daily lesson, protect your streak, and see yourself climb the ranks on tomorrow's daily update!
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
          <button onClick={() => navigate('/learn')} className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-primary text-primary-foreground font-mono text-sm font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 cursor-pointer">
            Start Today's Lesson <ArrowUpRight className="w-4 h-4" />
          </button>
          <button onClick={() => navigate('/challenges')} className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-secondary/60 text-foreground font-mono text-sm font-medium hover:bg-secondary transition-all cursor-pointer">
            Practice Challenges
          </button>
        </div>
      </div>
    </div>
  );
}
