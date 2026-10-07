import { ReactNode, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Map, Users, User, LogOut, Flame, Bot, MoreHorizontal, X, ChevronRight, ShoppingBag, HelpCircle, Info, ChevronUp, ChevronDown, Code2 } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import InboxBadge from '@/components/InboxBadge';
import { TranslationProvider } from '@/contexts/TranslationContext';
import GlobalTranslatorWidget from '@/components/GlobalTranslatorWidget';
import TopUtilityBar from '@/components/TopUtilityBar';

const DESKTOP_NAV_ITEMS = [
  { path: '/dashboard', icon: Home, label: 'Dashboard' },
  { path: '/dsa-sheet', icon: Code2, label: 'DSA Sheet' },
  { path: '/roadmap', icon: Map, label: 'Roadmap' },
  { path: '/ai-teacher', icon: Bot, label: 'AI Teacher' },
  { path: '/inbox', icon: InboxBadge, label: 'Inbox' },
  { path: '/marketplace', icon: ShoppingBag, label: 'Market' },
  { path: '/community', icon: Users, label: 'Community' },
  { path: '/settings', icon: User, label: 'Profile' },
];

const MOBILE_PRIMARY_ITEMS = [
  { path: '/dashboard', icon: Home, label: 'Dashboard' },
  { path: '/dsa-sheet', icon: Code2, label: 'DSA Sheet' },
  { path: '/roadmap', icon: Map, label: 'Roadmap' },
  { path: '/ai-teacher', icon: Bot, label: 'AI Teacher' },
];

function AppShellContent({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useUser();
  const [mobileMoreOpen, setMobileMoreOpen] = useState(false);
  const [desktopSidebarExpanded, setDesktopSidebarExpanded] = useState(false);

  const noShellRoutes = ['/auth', '/onboarding', '/tour'];
  if (noShellRoutes.some(r => location.pathname.startsWith(r))) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <TopUtilityBar />
        <div className="flex-1">{children}</div>
      </div>
    );
  }

  const fullScreenRoutes = ['/lesson/', '/playground'];
  if (fullScreenRoutes.some(r => location.pathname.startsWith(r))) {
    return (
      <>
        <GlobalTranslatorWidget mode="floating" />
        {children}
      </>
    );
  }

  const isMoreActive = location.pathname === '/inbox' || location.pathname === '/community' || location.pathname === '/settings' || location.pathname === '/marketplace';
  
  const desktopVisibleItems = DESKTOP_NAV_ITEMS.slice(0, 4);
  const desktopHiddenItems = DESKTOP_NAV_ITEMS.slice(4);

  return (
    <div className="min-h-screen bg-background flex grid-bg">
      {/* Desktop Sidebar - Compact & Clean */}
      <aside 
        className={`hidden md:flex flex-col border-r border-border/20 bg-card/10 backdrop-blur-xl fixed left-0 top-0 bottom-0 z-30 transition-all duration-300 ease-out ${
          desktopSidebarExpanded ? 'w-60' : 'w-16'
        }`}
      >
        {/* Logo - Compact */}
        <div className="flex items-center justify-center h-14 border-b border-border/10">
          <div className={`bg-primary/10 rounded-lg flex items-center justify-center transition-all ${
            desktopSidebarExpanded ? 'w-8 h-8' : 'w-7 h-7'
          }`}>
            <span className="text-[10px] font-bold text-primary font-mono">&lt;/&gt;</span>
          </div>
        </div>

        {/* Scrollable Navigation Area */}
        <nav className="flex-1 flex flex-col py-3 px-2 overflow-y-auto scrollbar-thin scrollbar-thumb-secondary/50 scrollbar-track-transparent">
          
          {/* Always Visible Items (First 4) */}
          {desktopVisibleItems.map(item => {
            const active = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex ${desktopSidebarExpanded ? 'items-center gap-3 px-3' : 'flex-col items-center gap-0.5 px-0'} py-2 rounded-lg text-xs font-medium transition-all relative mb-0.5 ${
                  active
                    ? 'bg-primary/15 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/30'
                } ${!desktopSidebarExpanded ? 'text-[10px]' : ''}`}
              >
                <item.icon className={`w-4 h-4 ${active ? 'drop-shadow-[0_0_6px_hsl(145,90%,55%)]' : ''} shrink-0`} />
                {desktopSidebarExpanded && <span className="text-[11px]">{item.label}</span>}
                {!desktopSidebarExpanded && <span className="text-[9px]">{item.label}</span>}
                {active && desktopSidebarExpanded && <div className="absolute left-0 w-0.5 h-6 bg-primary rounded-r-full" />}
              </button>
            );
          })}

          {/* Expand/Collapse Toggle */}
          <button
            onClick={() => setDesktopSidebarExpanded(!desktopSidebarExpanded)}
            className={`w-full flex ${desktopSidebarExpanded ? 'items-center gap-3 px-3' : 'flex-col items-center gap-0.5 px-0'} py-2 rounded-lg text-xs font-medium transition-all mb-1 ${
              desktopSidebarExpanded 
                ? 'bg-secondary/40 text-foreground' 
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary/30 text-[10px]'
            }`}
          >
            <div className="flex items-center w-4 h-4 justify-center">
              {desktopSidebarExpanded ? (
                <ChevronDown className="w-4 h-4 text-primary" />
              ) : (
                <MoreHorizontal className="w-4 h-4" />
              )}
            </div>
            {desktopSidebarExpanded && <span className="text-[11px]">Less</span>}
            {!desktopSidebarExpanded && <span className="text-[9px]">More</span>}
          </button>

          {/* Hidden Items (Only shown when expanded) */}
          {desktopSidebarExpanded && (
            <div className="mt-1 pt-2 border-t border-border/10 space-y-0.5 animate-in fade-in slide-in-from-top-1 duration-200">
              {desktopHiddenItems.map(item => {
                const active = location.pathname === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[11px] font-medium transition-all relative ${
                      active
                        ? 'bg-primary/15 text-primary'
                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary/30'
                    }`}
                  >
                    <item.icon className={`w-4 h-4 shrink-0 ${active ? 'drop-shadow-[0_0_6px_hsl(145,90%,55%)]' : ''}`} />
                    <span>{item.label}</span>
                    {active && <div className="absolute left-0 w-0.5 h-6 bg-primary rounded-r-full" />}
                  </button>
                );
              })}

              {/* FAQs and About (Hidden by default) */}
              <div className="pt-2 mt-1 border-t border-border/10 space-y-0.5">
                <button
                  type="button"
                  onClick={() => window.dispatchEvent(new CustomEvent('codesage-open-faq'))}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[11px] font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/30 transition-all"
                >
                  <HelpCircle className="w-4 h-4 text-primary shrink-0" />
                  <span>FAQs</span>
                </button>

                <button
                  type="button"
                  onClick={() => window.dispatchEvent(new CustomEvent('codesage-open-about'))}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[11px] font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/30 transition-all"
                >
                  <Info className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>About</span>
                </button>
              </div>
            </div>
          )}
        </nav>

        {/* Bottom User Section */}
        {user && (
          <div className={`flex ${desktopSidebarExpanded ? 'flex-col gap-2 px-3' : 'flex-col items-center gap-1 px-1'} py-2 border-t border-border/10`}>
            {desktopSidebarExpanded ? (
              <>
                <div className="flex items-center gap-2 text-[11px]">
                  <Flame className="w-3.5 h-3.5 text-primary" />
                  <span className="text-primary font-mono font-semibold">{user.streakCount} day streak</span>
                </div>
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-3 py-1.5 rounded-lg text-[11px] font-medium text-destructive hover:bg-destructive/10 transition-all"
                >
                  <LogOut className="w-4 h-4 shrink-0" />
                  <span>Log Out</span>
                </button>
              </>
            ) : (
              <>
                <div className="flex items-center gap-0.5">
                  <Flame className="w-3 h-3 text-primary" />
                  <span className="text-[8px] text-primary font-mono font-bold">{user.streakCount}</span>
                </div>
                <button
                  onClick={logout}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                  title="Log Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </>
            )}
          </div>
        )}
      </aside>

      {/* Main content */}
      <main className={`flex-1 min-w-0 pb-20 md:pb-0 flex flex-col transition-all duration-300 ${desktopSidebarExpanded ? 'md:ml-60' : 'md:ml-16'}`}>
        <TopUtilityBar />
        <div className="flex-1 min-w-0">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 border-t border-border/30 bg-card/85 backdrop-blur-xl">
        <div className="flex items-center justify-around py-1.5 px-1">
          {MOBILE_PRIMARY_ITEMS.map(item => {
            const active = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => {
                  setMobileMoreOpen(false);
                  navigate(item.path);
                }}
                className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-all ${
                  active ? 'text-primary font-semibold' : 'text-muted-foreground'
                }`}
              >
                <item.icon className={`w-5 h-5 ${active ? 'drop-shadow-[0_0_6px_hsl(145,90%,55%)]' : ''}`} />
                <span className="text-[9px]">{item.label}</span>
              </button>
            );
          })}

          {/* More button */}
          <button
            onClick={() => setMobileMoreOpen(!mobileMoreOpen)}
            className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-all ${
              isMoreActive || mobileMoreOpen ? 'text-primary font-semibold' : 'text-muted-foreground'
            }`}
          >
            <MoreHorizontal className={`w-5 h-5 ${isMoreActive || mobileMoreOpen ? 'drop-shadow-[0_0_6px_hsl(145,90%,55%)]' : ''}`} />
            <span className="text-[9px]">More</span>
          </button>
        </div>
      </nav>

            {/* Mobile "More" Drawer */}
      {mobileMoreOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex flex-col justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full bg-card border-t border-border/50 rounded-t-3xl max-h-[50vh] overflow-y-auto p-4 shadow-2xl space-y-3 pb-6 scrollbar-thin scrollbar-thumb-secondary/50 scrollbar-track-transparent">
            <div className="flex items-center justify-between pb-2 border-b border-border/30 sticky top-0 bg-card z-10">
              <span className="text-xs font-bold text-foreground">More Options</span>
              <button
                onClick={() => setMobileMoreOpen(false)}
                className="p-1 rounded-full hover:bg-secondary text-muted-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1.5 pt-2">
              <button
                onClick={() => {
                  setMobileMoreOpen(false);
                  navigate('/inbox');
                }}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-medium transition-all ${
                  location.pathname === '/inbox'
                    ? 'bg-primary/10 text-primary border border-primary/20'
                    : 'bg-secondary/30 text-foreground hover:bg-secondary/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <InboxBadge className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">Inbox</div>
                    <div className="text-[10px] text-muted-foreground">Messages and notifications</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>

              <button
                onClick={() => {
                  setMobileMoreOpen(false);
                  navigate('/marketplace');
                }}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-medium transition-all ${
                  location.pathname === '/marketplace'
                    ? 'bg-primary/10 text-primary border border-primary/20'
                    : 'bg-secondary/30 text-foreground hover:bg-secondary/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">Dev Marketplace & Games</div>
                    <div className="text-[10px] text-muted-foreground">Free tools, cloud perks & Tekken 6 arcade</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>

              <button
                onClick={() => {
                  setMobileMoreOpen(false);
                  navigate('/community');
                }}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-medium transition-all ${
                  location.pathname === '/community'
                    ? 'bg-primary/10 text-primary border border-primary/20'
                    : 'bg-secondary/30 text-foreground hover:bg-secondary/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <Users className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">Community</div>
                    <div className="text-[10px] text-muted-foreground">Collaborate with fellow students</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>

              <button
                onClick={() => {
                  setMobileMoreOpen(false);
                  navigate('/settings');
                }}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-medium transition-all ${
                  location.pathname === '/settings'
                    ? 'bg-primary/10 text-primary border border-primary/20'
                    : 'bg-secondary/30 text-foreground hover:bg-secondary/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <User className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">Profile & Settings</div>
                    <div className="text-[10px] text-muted-foreground">Manage account, badges & streaks</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>

              <div className="pt-2 pb-1 border-t border-border/30">
                <div className="text-[10px] font-mono text-muted-foreground uppercase px-2 mb-1.5 font-semibold">
                  Academy & Help
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setMobileMoreOpen(false);
                      window.dispatchEvent(new CustomEvent('codesage-open-faq'));
                    }}
                    className="flex items-center gap-2 p-2.5 rounded-xl bg-secondary/30 hover:bg-secondary/60 text-xs font-medium text-foreground transition-all"
                  >
                    <HelpCircle className="w-4 h-4 text-primary shrink-0" />
                    <span>FAQs</span>
                  </button>

                  <button
                    onClick={() => {
                      setMobileMoreOpen(false);
                      window.dispatchEvent(new CustomEvent('codesage-open-about'));
                    }}
                    className="flex items-center gap-2 p-2.5 rounded-xl bg-secondary/30 hover:bg-secondary/60 text-xs font-medium text-foreground transition-all"
                  >
                    <Info className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>About</span>
                  </button>
                </div>
              </div>

              {user && (
                <button
                  onClick={() => {
                    setMobileMoreOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-xl text-xs font-medium text-destructive hover:bg-destructive/10 transition-all"
                >
                  <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center text-destructive">
                    <LogOut className="w-4 h-4" />
                  </div>
                  <span className="font-semibold">Log Out</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <TranslationProvider>
      <AppShellContent>{children}</AppShellContent>
    </TranslationProvider>
  );
}
