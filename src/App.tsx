import React, { lazy, Suspense, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { UserProvider, useUser } from "@/contexts/UserContext";
import AppShell from "@/components/AppShell";
import ErrorBoundary from "./components/ErrorBoundary";
import { Loader2, Terminal } from "lucide-react";

// Register Service Worker for offline page caching & lightning-fast repeat navigations
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((err) => {
      console.warn('Service Worker registration skipped:', err);
    });
  });
}

// Background prefetch for frequent pages when browser is idle
function prefetchCommonRoutes() {
  if (typeof window === 'undefined') return;
  const prefetch = () => {
    import("./pages/Learn");
    import("./pages/Roadmap");
    import("./pages/AiTeacher");
    import("./pages/Marketplace");
    import("./pages/SettingsPage");
    import("./pages/Inbox");
    import("./pages/CommunityPage");
    import("./pages/CLearn");
  };

  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(prefetch, { timeout: 3000 });
  } else {
    setTimeout(prefetch, 1500);
  }
}

// Core critical pages (direct import for instantaneous transition)
import Auth from "./pages/Auth";
import Welcome from "./pages/Welcome";
import Dashboard from "./pages/Dashboard";
import Onboarding from "./pages/Onboarding";

// Lazy loaded feature pages & course tracks (drastically shrinks initial JavaScript bundle)
const Trip = lazy(() => import("./pages/Trip"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Contact = lazy(() => import("./pages/Contact"));
const Terms = lazy(() => import("./pages/Terms"));
const CookiePolicy = lazy(() => import("./pages/CookiePolicy"));
const Admin = lazy(() => import("./pages/Admin"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Learn = lazy(() => import("./pages/Learn"));
const LessonPage = lazy(() => import("./pages/LessonPage"));
const LessonComplete = lazy(() => import("./pages/LessonComplete"));
const NetworkingLearn = lazy(() => import("./pages/NetworkingLearn"));
const NetworkingLessonPage = lazy(() => import("./pages/NetworkingLessonPage"));
const AiFundamentalsLearn = lazy(() => import("./pages/AiFundamentalsLearn"));
const AiFundamentalsLessonPage = lazy(() => import("./pages/AiFundamentalsLessonPage"));
const IntermediateAiLearn = lazy(() => import("./pages/IntermediateAiLearn"));
const IntermediateAiLessonPage = lazy(() => import("./pages/IntermediateAiLessonPage"));
const FreelanceLearn = lazy(() => import("./pages/FreelanceLearn"));
const FreelanceLessonPage = lazy(() => import("./pages/FreelanceLessonPage"));
const FullstackLearn = lazy(() => import("./pages/FullstackLearn"));
const FullstackLessonPage = lazy(() => import("./pages/FullstackLessonPage"));
const JavaLearn = lazy(() => import("./pages/JavaLearn"));
const JavaLessonPage = lazy(() => import("./pages/JavaLessonPage"));
const JavaExpertLearn = lazy(() => import("@/pages/JavaExpertLearn"));
const JavaExpertLessonPage = lazy(() => import("@/pages/JavaExpertLessonPage"));
const CLearn = lazy(() => import("./pages/CLearn"));
const CLessonPage = lazy(() => import("./pages/CLessonPage"));
const CExpertLearn = lazy(() => import("./pages/CExpertLearn"));
const CExpertLessonPage = lazy(() => import("./pages/CExpertLessonPage"));
const PythonLearn = lazy(() => import("./pages/PythonLearn"));
const PythonLessonPage = lazy(() => import("./pages/PythonLessonPage"));
const PythonExpertLearn = lazy(() => import("./pages/PythonExpertLearn"));
const PythonExpertLessonPage = lazy(() => import("./pages/PythonExpertLessonPage"));
const LocalLearn = lazy(() => import("./pages/LocalLearn"));
const LocalLessonPage = lazy(() => import("./pages/LocalLessonPage"));
const SqlLearn = lazy(() => import("./pages/SqlLearn"));
const SqlLessonPage = lazy(() => import("./pages/SqlLessonPage"));
const RealFreelanceLearn = lazy(() => import("./pages/RealFreelanceLearn"));
const RealFreelanceLessonPage = lazy(() => import("./pages/RealFreelanceLessonPage"));
const CppLearn = lazy(() => import("./pages/CppLearn"));
const CppLessonPage = lazy(() => import("./pages/CppLessonPage"));
const CppExpertLearn = lazy(() => import("./pages/CppExpertLearn"));
const CppExpertLessonPage = lazy(() => import("./pages/CppExpertLessonPage"));
const Three3dLearn = lazy(() => import("./pages/Three3dLearn"));
const Three3dLessonPage = lazy(() => import("./pages/Three3dLessonPage"));
const Tour = lazy(() => import("./pages/Tour"));
const Playground = lazy(() => import("./pages/Playground"));
const Challenges = lazy(() => import("./pages/Challenges"));
const DsaSheet = lazy(() => import("./pages/DsaSheet"));
const Roadmap = lazy(() => import("./pages/Roadmap"));
const LevelTest = lazy(() => import("./pages/LevelTest"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
const QuestionsPage = lazy(() => import("./pages/QuestionsPage"));
const CommunityPage = lazy(() => import("./pages/CommunityPage"));
const Suggestions = lazy(() => import("./pages/Suggestions"));
const CodeCrawler = lazy(() => import("./pages/CodeCrawler"));
const NotFound = lazy(() => import("./pages/NotFound"));
const InboxPage = lazy(() => import("./pages/Inbox"));
const AiTeacher = lazy(() => import("./pages/AiTeacher"));
const Marketplace = lazy(() => import("./pages/Marketplace"));
const SupportUsPage = lazy(() => import("./pages/SupportUsPage"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes cache to prevent aggressive refetch lags
      refetchOnWindowFocus: false,
    },
  },
});

function RouteLoadingFallback() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-primary/20 text-xs text-muted-foreground font-mono">
        <Loader2 className="w-3.5 h-3.5 text-primary animate-spin" />
        <span>loading module...</span>
      </div>
    </div>
  );
}

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

const App = () => {
  useEffect(() => {
    prefetchCommonRoutes();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ErrorBoundary>
            <AppShell>
              <Suspense fallback={<RouteLoadingFallback />}>
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
            </Suspense>
          </AppShell>
          </ErrorBoundary>
        </BrowserRouter>
      </TooltipProvider>
    </UserProvider>
  </QueryClientProvider>
  );
};

export default App;
