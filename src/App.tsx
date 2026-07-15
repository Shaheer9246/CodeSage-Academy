import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { UserProvider, useUser } from "@/contexts/UserContext";
import AppShell from "@/components/AppShell";
import Auth from "./pages/Auth";
import Welcome from "./pages/Welcome";
import Trip from "./pages/Trip";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import Learn from "./pages/Learn";
import LessonPage from "./pages/LessonPage";
import LessonComplete from "./pages/LessonComplete";
import NetworkingLessonPage from "./pages/NetworkingLessonPage";
import NetworkingLearn from "./pages/NetworkingLearn";
import FreelanceLearn from "./pages/FreelanceLearn";
import FreelanceLessonPage from "./pages/FreelanceLessonPage";
import FullstackLearn from "./pages/FullstackLearn";
import FullstackLessonPage from "./pages/FullstackLessonPage";
import PythonLearn from "./pages/PythonLearn";
import PythonLessonPage from "./pages/PythonLessonPage";
import LocalLearn from "./pages/LocalLearn";
import LocalLessonPage from "./pages/LocalLessonPage";
import SqlLearn from "./pages/SqlLearn";
import SqlLessonPage from "./pages/SqlLessonPage";
import Tour from "./pages/Tour";
import Playground from "./pages/Playground";

import Challenges from "./pages/Challenges";
import Roadmap from "./pages/Roadmap";
import LevelTest from "./pages/LevelTest";
import SettingsPage from "./pages/SettingsPage";
import QuestionsPage from "./pages/QuestionsPage";
import CommunityPage from "./pages/CommunityPage";
import Suggestions from "./pages/Suggestions";
import CodeCrawler from "./pages/CodeCrawler";
import NotFound from "./pages/NotFound";
import InboxPage from "./pages/Inbox";
import PythonExpertLearn from "./pages/PythonExpertLearn";
import PythonExpertLessonPage from "./pages/PythonExpertLessonPage";
import ErrorBoundary from "./components/ErrorBoundary";
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
  const { isLoggedIn, isOnboarded, loading } = useUser();
  const location = useLocation();

  const urlParams = new URLSearchParams(location.search);
  const isGuestMode =
    urlParams.get("guest") === "1" ||
    location.pathname === "/trip" ||
    location.pathname.includes("/lesson/");

  if (loading) return <LoadingScreen />;

  if (!isLoggedIn && !isGuestMode) return <Navigate to="/auth" replace />;

  // Not onboarded → only allow /onboarding.
  if (isLoggedIn && !isOnboarded && location.pathname !== "/onboarding") {
    return <Navigate to="/onboarding" replace />;
  }

  // Already onboarded → keep them out of /onboarding.
  if (isLoggedIn && isOnboarded && location.pathname === "/onboarding") {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}


function AuthRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, isOnboarded, loading } = useUser();
  
  if (loading) return <LoadingScreen />;
  
  // Normal Login -> Goes to Dashboard
  if (isLoggedIn && isOnboarded) return <Navigate to="/dashboard" replace />;
  
  // New Signup -> Goes to Onboarding
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
          <ErrorBoundary>
          <AppShell>
            <Routes>
              <Route path="/auth" element={<AuthRoute><Auth /></AuthRoute>} />
              <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/learn" element={<ProtectedRoute><Learn /></ProtectedRoute>} />
              <Route path="/complete/:id" element={<ProtectedRoute><LessonComplete /></ProtectedRoute>} />
              <Route path="/lesson/:id" element={<ProtectedRoute><LessonPage /></ProtectedRoute>} />
              <Route path="/lesson/:id/complete" element={<ProtectedRoute><LessonComplete /></ProtectedRoute>} />
              <Route path="/n-lesson/:id" element={<ProtectedRoute><NetworkingLessonPage /></ProtectedRoute>} />
              <Route path="/networking" element={<ProtectedRoute><NetworkingLearn /></ProtectedRoute>} />
              <Route path="/freelance" element={<ProtectedRoute><FreelanceLearn /></ProtectedRoute>} />
              <Route path="/f-lesson/:id" element={<ProtectedRoute><FreelanceLessonPage /></ProtectedRoute>} />
              <Route path="/fullstack" element={<ProtectedRoute><FullstackLearn /></ProtectedRoute>} />
              <Route path="/fs-lesson/:id" element={<ProtectedRoute><FullstackLessonPage /></ProtectedRoute>} />
              <Route path="/python" element={<ProtectedRoute><PythonLearn /></ProtectedRoute>} />
              <Route path="/py-lesson/:id" element={<ProtectedRoute><PythonLessonPage /></ProtectedRoute>} />
              <Route path="/local" element={<ProtectedRoute><LocalLearn /></ProtectedRoute>} />
              <Route path="/local-lesson/:id" element={<ProtectedRoute><LocalLessonPage /></ProtectedRoute>} />
              <Route path="/sql" element={<ProtectedRoute><SqlLearn /></ProtectedRoute>} />
<Route path="/sql-learn" element={<ProtectedRoute><SqlLearn /></ProtectedRoute>} />
<Route path="/sql-lesson/:id" element={<ProtectedRoute><SqlLessonPage /></ProtectedRoute>} />
              <Route path="/tour" element={<ProtectedRoute><Tour /></ProtectedRoute>} />
              <Route path="/playground" element={<Playground />} />
              <Route path="/challenges" element={<ProtectedRoute><Challenges /></ProtectedRoute>} />
              <Route path="/roadmap" element={<ProtectedRoute><Roadmap /></ProtectedRoute>} />
              <Route path="/test/:level" element={<ProtectedRoute><LevelTest /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
              <Route path="/exams" element={<ProtectedRoute><QuestionsPage /></ProtectedRoute>} />
              <Route path="/community" element={<ProtectedRoute><CommunityPage /></ProtectedRoute>} />
              <Route path="/suggestions" element={<ProtectedRoute><Suggestions /></ProtectedRoute>} />
              <Route path="/games/crawler" element={<ProtectedRoute><CodeCrawler /></ProtectedRoute>} />
              <Route path="/inbox" element={<ProtectedRoute><InboxPage /></ProtectedRoute>} />
              <Route path="/pythonexpert" element={<ProtectedRoute><PythonExpertLearn /></ProtectedRoute>} />
              <Route path="/pyx-lesson/:id" element={<ProtectedRoute><PythonExpertLessonPage /></ProtectedRoute>} />
              <Route path="/" element={<Welcome />} />
              <Route path="/trip" element={<Trip />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppShell>
          </ErrorBoundary>
        </BrowserRouter>
      </TooltipProvider>
    </UserProvider>
  </QueryClientProvider>
);

export default App;
