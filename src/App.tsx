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
import { PwaInstallPrompt } from "@/components/PwaInstallPrompt";
import RouteSEO from "@/components/RouteSEO";
import { DashboardSkeleton } from "@/components/skeletons/DashboardSkeleton";
import { TrackPageSkeleton } from "@/components/skeletons/TrackPageSkeleton";

// Route-Level Code Splitting via React.lazy() for minimal initial bundle & fast TTI
const Auth = React.lazy(() => import("./pages/Auth"));
const Welcome = React.lazy(() => import("./pages/Welcome"));
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const Onboarding = React.lazy(() => import("./pages/Onboarding"));
const Trip = React.lazy(() => import("./pages/Trip"));
const Privacy = React.lazy(() => import("./pages/Privacy"));
const Contact = React.lazy(() => import("./pages/Contact"));
const Terms = React.lazy(() => import("./pages/Terms"));
const CookiePolicy = React.lazy(() => import("./pages/CookiePolicy"));
const Admin = React.lazy(() => import("./pages/Admin"));
const ResetPassword = React.lazy(() => import("./pages/ResetPassword"));
const Learn = React.lazy(() => import("./pages/Learn"));
const LessonPage = React.lazy(() => import("./pages/LessonPage"));
const LessonComplete = React.lazy(() => import("./pages/LessonComplete"));
const NetworkingLearn = React.lazy(() => import("./pages/NetworkingLearn"));
const NetworkingLessonPage = React.lazy(() => import("./pages/NetworkingLessonPage"));
const CyberLearn = React.lazy(() => import("./pages/CyberLearn"));
const CyberLessonPage = React.lazy(() => import("./pages/CyberLessonPage"));
const AiFundamentalsLearn = React.lazy(() => import("./pages/AiFundamentalsLearn"));
const AiFundamentalsLessonPage = React.lazy(() => import("./pages/AiFundamentalsLessonPage"));
const IntermediateAiLearn = React.lazy(() => import("./pages/IntermediateAiLearn"));
const IntermediateAiLessonPage = React.lazy(() => import("./pages/IntermediateAiLessonPage"));
const AdvancedAiLearn = React.lazy(() => import("./pages/AdvancedAiLearn"));
const AdvancedAiLessonPage = React.lazy(() => import("./pages/AdvancedAiLessonPage"));
const FreelanceLearn = React.lazy(() => import("./pages/FreelanceLearn"));
const FreelanceLessonPage = React.lazy(() => import("./pages/FreelanceLessonPage"));
const FullstackLearn = React.lazy(() => import("./pages/FullstackLearn"));
const FullstackLessonPage = React.lazy(() => import("./pages/FullstackLessonPage"));
const JavaLearn = React.lazy(() => import("./pages/JavaLearn"));
const JavaLessonPage = React.lazy(() => import("./pages/JavaLessonPage"));
const JavaExpertLearn = React.lazy(() => import("@/pages/JavaExpertLearn"));
const JavaExpertLessonPage = React.lazy(() => import("@/pages/JavaExpertLessonPage"));
const CLearn = React.lazy(() => import("./pages/CLearn"));
const CLessonPage = React.lazy(() => import("./pages/CLessonPage"));
const CExpertLearn = React.lazy(() => import("./pages/CExpertLearn"));
const CExpertLessonPage = React.lazy(() => import("./pages/CExpertLessonPage"));
const PythonLearn = React.lazy(() => import("./pages/PythonLearn"));
const PythonLessonPage = React.lazy(() => import("./pages/PythonLessonPage"));
const PythonExpertLearn = React.lazy(() => import("./pages/PythonExpertLearn"));
const PythonExpertLessonPage = React.lazy(() => import("./pages/PythonExpertLessonPage"));
const LocalLearn = React.lazy(() => import("./pages/LocalLearn"));
const LocalLessonPage = React.lazy(() => import("./pages/LocalLessonPage"));
const SqlLearn = React.lazy(() => import("./pages/SqlLearn"));
const SqlLessonPage = React.lazy(() => import("./pages/SqlLessonPage"));
const RealFreelanceLearn = React.lazy(() => import("./pages/RealFreelanceLearn"));
const RealFreelanceLessonPage = React.lazy(() => import("./pages/RealFreelanceLessonPage"));
const CppLearn = React.lazy(() => import("./pages/CppLearn"));
const CppLessonPage = React.lazy(() => import("./pages/CppLessonPage"));
const CppExpertLearn = React.lazy(() => import("./pages/CppExpertLearn"));
const CppExpertLessonPage = React.lazy(() => import("./pages/CppExpertLessonPage"));
const Three3dLearn = React.lazy(() => import("./pages/Three3dLearn"));
const Three3dLessonPage = React.lazy(() => import("./pages/Three3dLessonPage"));
const Tour = React.lazy(() => import("./pages/Tour"));
const Playground = React.lazy(() => import("./pages/Playground"));
const Challenges = React.lazy(() => import("./pages/Challenges"));
const DsaSheet = React.lazy(() => import("./pages/DsaSheet"));
const Roadmap = React.lazy(() => import("./pages/Roadmap"));
const LevelTest = React.lazy(() => import("./pages/LevelTest"));
const SettingsPage = React.lazy(() => import("./pages/SettingsPage"));
const QuestionsPage = React.lazy(() => import("./pages/QuestionsPage"));
const CommunityPage = React.lazy(() => import("./pages/CommunityPage"));
const Suggestions = React.lazy(() => import("./pages/Suggestions"));
const CodeCrawler = React.lazy(() => import("./pages/CodeCrawler"));
const NotFound = React.lazy(() => import("./pages/NotFound"));
const InboxPage = React.lazy(() => import("./pages/Inbox"));
const AiTeacher = React.lazy(() => import("./pages/AiTeacher"));
const Marketplace = React.lazy(() => import("./pages/Marketplace"));
const SupportUsPage = React.lazy(() => import("./pages/SupportUsPage"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes cache to prevent aggressive refetch lags
      refetchOnWindowFocus: false,
    },
  },
});

function RouteLoadingFallback() {
  const path = typeof window !== "undefined" ? window.location.pathname : "";
  const isCourseTrack =
    path.startsWith("/c") ||
    path.startsWith("/cpp") ||
    path.startsWith("/cyber") ||
    path.startsWith("/python") ||
    path.startsWith("/java") ||
    path.startsWith("/learn") ||
    path.startsWith("/sql") ||
    path.startsWith("/networking") ||
    path.startsWith("/dsa-sheet");

  if (isCourseTrack) {
    return <TrackPageSkeleton />;
  }

  return <DashboardSkeleton />;
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
            <RouteSEO />
            <GoogleAnalyticsTracker />
            <ErrorBoundary>
              <AppShell>
                <LessonSponsorGate>
                  <React.Suspense fallback={<RouteLoadingFallback />}>
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
                  <Route path="/cyber" element={<ProtectedRoute><CyberLearn /></ProtectedRoute>} />
                  <Route path="/cyber-lesson/:id" element={<ProtectedRoute><CyberLessonPage /></ProtectedRoute>} />
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
                  <Route path="/advanced-ai" element={<ProtectedRoute><AdvancedAiLearn /></ProtectedRoute>} />
                  <Route path="/adv-ai-lesson/:id" element={<ProtectedRoute><AdvancedAiLessonPage /></ProtectedRoute>} />
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
                </React.Suspense>
                </LessonSponsorGate>
              </AppShell>
            </ErrorBoundary>
           <PwaInstallPrompt />
          </BrowserRouter>
        </TooltipProvider>
      </UserProvider>
    </QueryClientProvider>
  );
};

export default App;
