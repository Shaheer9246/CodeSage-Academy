import React, { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { UserProvider, useUser } from "@/contexts/UserContext";
import AppShell from "@/components/AppShell";
import { LessonSponsorGate } from "@/components/LessonSponsorGate";
import ErrorBoundary from "./components/ErrorBoundary";
import { Loader2, Terminal } from "lucide-react";

// Direct imports for all pages so route transitions are 100% instant
// with zero per-page "loading module..." delay and zero chunk-mismatch errors
import Auth from "./pages/Auth";
import Welcome from "./pages/Welcome";
import Dashboard from "./pages/Dashboard";
import Onboarding from "./pages/Onboarding";
import Trip from "./pages/Trip";
import Privacy from "./pages/Privacy";
import Contact from "./pages/Contact";
import Terms from "./pages/Terms";
import CookiePolicy from "./pages/CookiePolicy";
import Admin from "./pages/Admin";
import ResetPassword from "./pages/ResetPassword";
import Learn from "./pages/Learn";
import LessonPage from "./pages/LessonPage";
import LessonComplete from "./pages/LessonComplete";
import NetworkingLearn from "./pages/NetworkingLearn";
import NetworkingLessonPage from "./pages/NetworkingLessonPage";
import AiFundamentalsLearn from "./pages/AiFundamentalsLearn";
import AiFundamentalsLessonPage from "./pages/AiFundamentalsLessonPage";
import IntermediateAiLearn from "./pages/IntermediateAiLearn";
import IntermediateAiLessonPage from "./pages/IntermediateAiLessonPage";
import FreelanceLearn from "./pages/FreelanceLearn";
import FreelanceLessonPage from "./pages/FreelanceLessonPage";
import FullstackLearn from "./pages/FullstackLearn";
import FullstackLessonPage from "./pages/FullstackLessonPage";
import JavaLearn from "./pages/JavaLearn";
import JavaLessonPage from "./pages/JavaLessonPage";
import JavaExpertLearn from "@/pages/JavaExpertLearn";
import JavaExpertLessonPage from "@/pages/JavaExpertLessonPage";
import CLearn from "./pages/CLearn";
import CLessonPage from "./pages/CLessonPage";
import CExpertLearn from "./pages/CExpertLearn";
import CExpertLessonPage from "./pages/CExpertLessonPage";
import PythonLearn from "./pages/PythonLearn";
import PythonLessonPage from "./pages/PythonLessonPage";
import PythonExpertLearn from "./pages/PythonExpertLearn";
import PythonExpertLessonPage from "./pages/PythonExpertLessonPage";
import LocalLearn from "./pages/LocalLearn";
import LocalLessonPage from "./pages/LocalLessonPage";
import SqlLearn from "./pages/SqlLearn";
import SqlLessonPage from "./pages/SqlLessonPage";
import RealFreelanceLearn from "./pages/RealFreelanceLearn";
import RealFreelanceLessonPage from "./pages/RealFreelanceLessonPage";
import CppLearn from "./pages/CppLearn";
import CppLessonPage from "./pages/CppLessonPage";
import CppExpertLearn from "./pages/CppExpertLearn";
import CppExpertLessonPage from "./pages/CppExpertLessonPage";
import Three3dLearn from "./pages/Three3dLearn";
import Three3dLessonPage from "./pages/Three3dLessonPage";
import Tour from "./pages/Tour";
import Playground from "./pages/Playground";
import Challenges from "./pages/Challenges";
import DsaSheet from "./pages/DsaSheet";
import Roadmap from "./pages/Roadmap";
import LevelTest from "./pages/LevelTest";
import SettingsPage from "./pages/SettingsPage";
import QuestionsPage from "./pages/QuestionsPage";
import CommunityPage from "./pages/CommunityPage";
import Suggestions from "./pages/Suggestions";
import CodeCrawler from "./pages/CodeCrawler";
import NotFound from "./pages/NotFound";
import InboxPage from "./pages/Inbox";
import AiTeacher from "./pages/AiTeacher";
import Marketplace from "./pages/Marketplace";
import SupportUsPage from "./pages/SupportUsPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes cache to prevent aggressive refetch lags
      refetchOnWindowFocus: false,
    },
  },
});

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
    location.pathname.includes("lesson");

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

function GoogleAnalyticsTracker() {
  const location = useLocation();
  const { user } = useUser();

  useEffect(() => {
    const w = window as unknown as { gtag?: (...args: unknown[]) => void };
    if (typeof w.gtag === "function") {
      w.gtag("config", "G-9HLLPWB8LN", {
        page_path: location.pathname + location.search,
        page_location: window.location.href,
        page_title: document.title,
        ...(user?.id ? { user_id: user.id } : {}),
      });
    }
  }, [location.pathname, location.search, user?.id]);

  return null;
}

const App = () => {
  useEffect(() => {
    // Purge any stale Service Worker JS caches from earlier builds so chunks never mismatch
    if (typeof window !== "undefined" && "caches" in window) {
      caches.keys().then((keys) => {
        keys.forEach((key) => {
          if (key.startsWith("codesage-")) {
            void caches.delete(key);
          }
        });
      }).catch(() => {});
    }
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistrations().then((regs) => {
        regs.forEach((reg) => {
          void reg.update();
        });
      }).catch(() => {});
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <GoogleAnalyticsTracker />
            <ErrorBoundary>
              <AppShell>
                <LessonSponsorGate>
                <Routes>
                  <Route path="/auth" element={<AuthRoute><Auth /></AuthRoute>} />
                  <Route path="/reset-password" element={<ResetPassword />} />
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
                  <Route path="/java" element={<ProtectedRoute><JavaLearn /></ProtectedRoute>} />
                  <Route path="/java-lesson/:id" element={<ProtectedRoute><JavaLessonPage /></ProtectedRoute>} />
                  <Route path="/java-expert" element={<ProtectedRoute><JavaExpertLearn /></ProtectedRoute>} />
                  <Route path="/javax-lesson/:id" element={<ProtectedRoute><JavaExpertLessonPage /></ProtectedRoute>} />
                  <Route path="/c" element={<ProtectedRoute><CLearn /></ProtectedRoute>} />
                  <Route path="/c-lesson/:id" element={<ProtectedRoute><CLessonPage /></ProtectedRoute>} />
                  <Route path="/c-expert" element={<ProtectedRoute><CExpertLearn /></ProtectedRoute>} />
                  <Route path="/cx-lesson/:id" element={<ProtectedRoute><CExpertLessonPage /></ProtectedRoute>} />
                  <Route path="/python" element={<ProtectedRoute><PythonLearn /></ProtectedRoute>} />
                  <Route path="/py-lesson/:id" element={<ProtectedRoute><PythonLessonPage /></ProtectedRoute>} />
                  <Route path="/local" element={<ProtectedRoute><LocalLearn /></ProtectedRoute>} />
                  <Route path="/local-lesson/:id" element={<ProtectedRoute><LocalLessonPage /></ProtectedRoute>} />
                  <Route path="/sql" element={<ProtectedRoute><SqlLearn /></ProtectedRoute>} />
                  <Route path="/sql-learn" element={<ProtectedRoute><SqlLearn /></ProtectedRoute>} />
                  <Route path="/sql-lesson/:id" element={<ProtectedRoute><SqlLessonPage /></ProtectedRoute>} />
                  <Route path="/real-freelance" element={<ProtectedRoute><RealFreelanceLearn /></ProtectedRoute>} />
                  <Route path="/rf-lesson/:id" element={<ProtectedRoute><RealFreelanceLessonPage /></ProtectedRoute>} />
                  <Route path="/tour" element={<ProtectedRoute><Tour /></ProtectedRoute>} />
                  <Route path="/playground" element={<Playground />} />
                  <Route path="/challenges" element={<ProtectedRoute><Challenges /></ProtectedRoute>} />
                  <Route path="/dsa-sheet" element={<ProtectedRoute><DsaSheet /></ProtectedRoute>} />
                  <Route path="/roadmap" element={<ProtectedRoute><Roadmap /></ProtectedRoute>} />
                  <Route path="/test/:level" element={<ProtectedRoute><LevelTest /></ProtectedRoute>} />
                  <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
                  <Route path="/exams" element={<ProtectedRoute><QuestionsPage /></ProtectedRoute>} />
                  <Route path="/ai-teacher" element={<ProtectedRoute><AiTeacher /></ProtectedRoute>} />
                  <Route path="/ai-mentor" element={<ProtectedRoute><AiTeacher /></ProtectedRoute>} />
                  <Route path="/marketplace" element={<ProtectedRoute><Marketplace /></ProtectedRoute>} />
                  <Route path="/community" element={<ProtectedRoute><CommunityPage /></ProtectedRoute>} />
                  <Route path="/suggestions" element={<ProtectedRoute><Suggestions /></ProtectedRoute>} />
                  <Route path="/games/crawler" element={<ProtectedRoute><CodeCrawler /></ProtectedRoute>} />
                  <Route path="/inbox" element={<ProtectedRoute><InboxPage /></ProtectedRoute>} />
                  <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
                  <Route path="/pythonexpert" element={<ProtectedRoute><PythonExpertLearn /></ProtectedRoute>} />
                  <Route path="/pyx-lesson/:id" element={<ProtectedRoute><PythonExpertLessonPage /></ProtectedRoute>} />
                  <Route path="/ai-fundamentals" element={<ProtectedRoute><AiFundamentalsLearn /></ProtectedRoute>} />
                  <Route path="/ai-lesson/:id" element={<ProtectedRoute><AiFundamentalsLessonPage /></ProtectedRoute>} />
                  <Route path="/intermediate-ai" element={<ProtectedRoute><IntermediateAiLearn /></ProtectedRoute>} />
                  <Route path="/iai-lesson/:id" element={<ProtectedRoute><IntermediateAiLessonPage /></ProtectedRoute>} />
                  <Route path="/cpp" element={<ProtectedRoute><CppLearn /></ProtectedRoute>} />
                  <Route path="/cpp-lesson/:id" element={<ProtectedRoute><CppLessonPage /></ProtectedRoute>} />
                  <Route path="/cpp/expert" element={<ProtectedRoute><CppExpertLearn /></ProtectedRoute>} />
                  <Route path="/cppx-lesson/:id" element={<ProtectedRoute><CppExpertLessonPage /></ProtectedRoute>} />
                  <Route path="/three3d" element={<ProtectedRoute><Three3dLearn /></ProtectedRoute>} />
                  <Route path="/three-lesson/:id" element={<ProtectedRoute><Three3dLessonPage /></ProtectedRoute>} />
                  <Route path="/" element={<Welcome />} />
                  <Route path="/trip" element={<Trip />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/cookie-policy" element={<CookiePolicy />} />
                  <Route path="/support-us" element={<SupportUsPage />} />
                  <Route path="/donate-ads" element={<SupportUsPage />} />

                  <Route path="*" element={<NotFound />} />
                </Routes>
                </LessonSponsorGate>
              </AppShell>
            </ErrorBoundary>
          </BrowserRouter>
        </TooltipProvider>
      </UserProvider>
    </QueryClientProvider>
  );
};

export default App;
