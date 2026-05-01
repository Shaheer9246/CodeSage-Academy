import { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, BookOpen, Code, Trophy, Settings, LogOut, Flame } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';

const NAV_ITEMS = [
  { path: '/dashboard', icon: Home, label: 'Home' },
  { path: '/learn', icon: BookOpen, label: 'Learn' },
  { path: '/playground', icon: Code, label: 'Code' },
  { path: '/challenges', icon: Trophy, label: 'Challenges' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

export default function AppShell({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useUser();

  // Pages that should NOT show shell (auth, onboarding)
  const noShellRoutes = ['/auth', '/onboarding'];
  if (noShellRoutes.some(r => location.pathname.startsWith(r))) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-[220px] border-r border-border/40 bg-card/30 backdrop-blur-xl fixed left-0 top-0 bottom-0 z-30">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-border/30">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center neon-border">
              <span className="text-sm font-bold text-primary font-mono">&lt;/&gt;</span>
            </div>
            <span className="text-lg font-bold text-primary font-mono neon-text">CodeSage</span>
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV_ITEMS.map(item => {
            const active = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? 'bg-primary/10 text-primary neon-border'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* User section */}
        {user && (
          <div className="px-3 py-4 border-t border-border/30">
            <div className="flex items-center gap-2 px-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary border border-primary/20">
                {user.name?.[0]?.toUpperCase() || user.username?.[0]?.toUpperCase() || '?'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-foreground truncate">{user.name || user.username}</p>
                <div className="flex items-center gap-1">
                  <Flame className="w-3 h-3 text-primary" />
                  <span className="text-[10px] text-primary font-mono">{user.streakCount} streak</span>
                </div>
              </div>
            </div>
            <button
              onClick={logout}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              Log Out
            </button>
          </div>
        )}
      </aside>

      {/* Main content */}
      <main className="flex-1 md:ml-[220px] pb-20 md:pb-0">
        {children}
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 border-t border-border/40 bg-card/80 backdrop-blur-xl">
        <div className="flex items-center justify-around py-2 px-2">
          {NAV_ITEMS.slice(0, 5).map(item => {
            const active = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all ${
                  active ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <item.icon className={`w-5 h-5 ${active ? 'drop-shadow-[0_0_6px_hsl(153,100%,50%)]' : ''}`} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
