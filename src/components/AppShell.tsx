import { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Map, HelpCircle, Users, User, LogOut, Flame } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import InboxBadge from '@/components/InboxBadge';

const NAV_ITEMS = [
  { path: '/dashboard', icon: Home, label: 'Dashboard' },
  { path: '/roadmap', icon: Map, label: 'Roadmap' },
  { path: '/inbox', icon: InboxBadge, label: 'Inbox' },
  { path: '/community', icon: Users, label: 'Community' },
  { path: '/settings', icon: User, label: 'Profile' },
];

export default function AppShell({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useUser();

  const noShellRoutes = ['/auth', '/onboarding', '/tour'];
  if (noShellRoutes.some(r => location.pathname.startsWith(r))) {
    return <>{children}</>;
  }

  // Hide shell on lesson and playground pages for full-screen experience
  const fullScreenRoutes = ['/lesson/', '/playground'];
  if (fullScreenRoutes.some(r => location.pathname.startsWith(r))) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-[72px] border-r border-border/30 bg-card/20 backdrop-blur-xl fixed left-0 top-0 bottom-0 z-30">
        <div className="flex items-center justify-center py-5 border-b border-border/20">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center neon-border">
            <span className="text-xs font-bold text-primary font-mono">&lt;/&gt;</span>
          </div>
        </div>

        <nav className="flex-1 flex flex-col items-center gap-1 py-4 px-2">
          {NAV_ITEMS.map(item => {
            const active = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex flex-col items-center gap-0.5 px-1 py-2.5 rounded-xl text-[10px] font-medium transition-all relative ${
                  active
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                }`}
              >
                <item.icon className={`w-5 h-5 ${active ? 'drop-shadow-[0_0_6px_hsl(145,90%,55%)]' : ''}`} />
                <span>{item.label}</span>
                {active && <div className="absolute left-0 w-[3px] h-6 bg-primary rounded-r-full" />}
              </button>
            );
          })}
        </nav>

        {user && (
          <div className="flex flex-col items-center gap-2 py-4 border-t border-border/20">
            <div className="flex items-center gap-0.5">
              <Flame className="w-3 h-3 text-primary" />
              <span className="text-[9px] text-primary font-mono font-bold">{user.streakCount}</span>
            </div>
            <button
              onClick={logout}
              className="p-2 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </aside>

      {/* Main content */}
      <main className="flex-1 md:ml-[72px] pb-20 md:pb-0">
        {children}
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 border-t border-border/30 bg-card/80 backdrop-blur-xl">
        <div className="flex items-center justify-around py-1.5 px-1">
          {NAV_ITEMS.map(item => {
            const active = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-all ${
                  active ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <item.icon className={`w-5 h-5 ${active ? 'drop-shadow-[0_0_6px_hsl(145,90%,55%)]' : ''}`} />
                <span className="text-[9px] font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
