import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { UserProvider, useUser } from "@/contexts/UserContext";
import AppShell from "@/components/AppShell";
import Auth from "./pages/Auth";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import Learn from "./pages/Learn";
import LessonPage from "./pages/LessonPage";
import Playground from "./pages/Playground";
import Challenges from "./pages/Challenges";
import Roadmap from "./pages/Roadmap";
import LevelTest from "./pages/LevelTest";
import SettingsPage from "./pages/SettingsPage";
import Suggestions from "./pages/Suggestions";
import NotFound from "./pages/NotFound";
import { Loader2, Terminal } from "lucide-react";

const queryClient = new QueryClient();

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center ambient-grid">
      <div className="text-center animate-fade-in">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 neon-glow-strong border border-primary/20">
          <Terminal className="w-8 h-8 text-primary" />
        </div>
        <Loader2 className="w-5 h-5 text-primary animate-spin mx-auto mb-2" />
        <p className="text-muted-foreground text-xs font-mono">initializing CodeSage...</p>
      </div>
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, loading } = useUser();
  if (loading) return <LoadingScreen />;
  if (!isLoggedIn) return <Navigate to="/auth" replace />;
  return <>{children}</>;
}

function AuthRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, isOnboarded, loading } = useUser();
  if (loading) return <LoadingScreen />;
  if (isLoggedIn && isOnboarded) return <Navigate to="/dashboard" replace />;
  if (isLoggedIn && !isOnboarded) return <Navigate to="/onboarding" replace />;
  return <>{children}</>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <UserProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppShell>
            <Routes>
              <Route path="/auth" element={<AuthRoute><Auth /></AuthRoute>} />
              <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/learn" element={<ProtectedRoute><Learn /></ProtectedRoute>} />
              <Route path="/lesson/:id" element={<ProtectedRoute><LessonPage /></ProtectedRoute>} />
              <Route path="/playground" element={<ProtectedRoute><Playground /></ProtectedRoute>} />
              <Route path="/challenges" element={<ProtectedRoute><Challenges /></ProtectedRoute>} />
              <Route path="/roadmap" element={<ProtectedRoute><Roadmap /></ProtectedRoute>} />
              <Route path="/test/:level" element={<ProtectedRoute><LevelTest /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
              <Route path="/suggestions" element={<ProtectedRoute><Suggestions /></ProtectedRoute>} />
              <Route path="/" element={<Navigate to="/auth" replace />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppShell>
        </BrowserRouter>
      </TooltipProvider>
    </UserProvider>
  </QueryClientProvider>
);

export default App;
