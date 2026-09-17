import { useState } from 'react';
import {
  HelpCircle,
  Info,
  Mail,
  Copy,
  Check,
  X,
  ExternalLink,
  BookOpen,
  Sparkles,
  Code2,
  Cpu,
  Layers,
  Award,
  ChevronDown,
  Terminal,
  ShieldCheck,
  Flame,
  Bot,
  ShoppingBag,
  Zap,
  Calendar,
  Crown
} from 'lucide-react';
import { toast } from 'sonner';
import GlobalTranslatorWidget from '@/components/GlobalTranslatorWidget';

const ADMIN_EMAIL = 'zainrao.dev@gmail.com';

const FAQ_ITEMS = [
  {
    q: 'Is CodeSage completely free to use?',
    a: 'Yes! CodeSage is 100% free. You have unrestricted access to all 18 full curriculum tracks, the in-browser Monaco code runner, diagnostic quizzes, algorithmic challenges, and the interactive playground. A CodeSage PRO tier will be introduced in 2 days for advanced capabilities like the personal AI Teacher (launching tomorrow) and Developer Marketplace.'
  },
  {
    q: 'Do you offer certificates right now?',
    a: 'No, we do not have any certificates yet. Certificates are not issued at this time. Once our certificate verification engine is officially released, you will be able to earn verified certificates for completed tracks. In the meantime, you can test and prove your mastery across all languages and difficulty tiers through the milestone tests and exams in the Exams section (/exams).'
  },
  {
    q: 'What is my Global Student ID and where do I find it?',
    a: 'Every student receives a unique deterministic Global Student ID (e.g. CS-XXXX-XXXX) generated upon registration. This single global identifier stays consistent across all your enrolled tracks, quizzes, community posts, and future certificate verification. You can view it in Settings → Profile and on your enrollment ID card.'
  },
  {
    q: 'How do I know when I have Completed a track?',
    a: 'When you finish every single lesson in an enrolled track, the track is automatically tagged as "Completed 🏆"! This tag is visible across your Dashboard, the Continue Learning section, and Settings → My Enrollments. You can continue reviewing lessons and re-taking quizzes anytime even after completion.'
  },
  {
    q: 'What is the AI Teacher and when will it be available?',
    a: 'The AI Teacher is launching tomorrow! It is an intelligent coding mentor integrated directly into lesson pages. It helps you understand difficult concepts, points out syntax mistakes in your code, gives tailored hints without spoiling solutions, and answers questions as you code.'
  },
  {
    q: 'What is the Developer Marketplace and when does it arrive?',
    a: 'The Developer Marketplace will launch in 2 days along with the CodeSage PRO tier. It allows students and engineers to discover, share, and install custom coding templates, starter projects, specialized problem sets, and custom editor themes.'
  },
  {
    q: 'What is the difference between the Free and upcoming PRO plan?',
    a: 'CodeSage core learning will ALWAYS remain 100% Free: all 18 curriculum tracks, Monaco code editor, diagnostic quizzes, playground, challenges, and exams. The PRO plan (launching in 2 days) provides power-user enhancements including unlimited AI Teacher mentorship, Marketplace downloads, priority code execution, and special community flair.'
  },
  {
    q: 'How does track enrollment work? Why is there a 2-track limit?',
    a: 'CodeSage allows enrollment in up to 2 active tracks simultaneously. This limit is intentionally designed using cognitive load principles—focusing your daily practice on 1 or 2 areas leads to significantly higher retention and curriculum completion than spreading effort thin across dozens of tracks. You can switch, pause, or resume tracks anytime in Settings.'
  },
  {
    q: 'Can I switch or unenroll from a track without losing my progress?',
    a: 'Absolutely! You can pause or unenroll from any track in Settings at any time. All of your completed lesson checkmarks, quiz answers, and earned XP are permanently stored. When you re-enroll or resume the track later, all your progress remains intact.'
  },
  {
    q: 'How are lessons structured? Why do some tracks have quizzes and others don’t?',
    a: 'Frontend Development (HTML, CSS, JavaScript, React) is 100% hands-on coding—you write and test live code directly in the Monaco editor with instant browser preview and challenge verification. Other tracks (such as Python, SQL, AI Fundamentals, Systems C/C++, Java) blend conceptual deep-dives, interactive code sandboxes, and end-of-lesson diagnostic quizzes to test retention.'
  },
  {
    q: 'Where can I see which quiz questions I got wrong?',
    a: 'Head to Settings → Lessons-Based Track Progress. Expand any enrolled track to see lesson-by-lesson metrics. If you answered any questions incorrectly, they are highlighted with the exact question text, options, and a direct "Retake Quiz" button to practice and master that concept.'
  },
  {
    q: 'Can I practice coding freely without taking a lesson?',
    a: 'Yes! Head to the Playground (/playground). You can create and edit multi-file HTML/CSS/JS projects with live visual preview, or run Python and SQL scripts in a distraction-free sandbox. You can even export your code as a .ZIP file.'
  },
  {
    q: 'How does code execution work? Is it safe and private?',
    a: 'HTML, CSS, and JavaScript run directly in an isolated browser iframe sandbox with real-time DOM rendering. Python and SQL execute locally using client-side WebAssembly runtimes. Your code never leaves your computer for third-party queuing, ensuring private, safe, and lightning-fast execution.'
  },
  {
    q: 'How do XP, Levels, and Sage Coins work?',
    a: 'Completing lessons, maintaining daily streaks, and solving challenges awards XP and Sage Coins. As your XP grows, your developer rank levels up (from Novice to Architect). Sage Coins can be redeemed for profile perks and streak freezes.'
  },
  {
    q: 'What happens if I miss a day? How do Daily Streaks work?',
    a: 'Your streak increases by 1 each day you complete at least one lesson or quiz. If you have a Streak Freeze equipped, your streak will be automatically protected if you miss a day.'
  },
  {
    q: 'Is my progress saved if I clear my browser or switch devices?',
    a: 'Yes! If you are logged in with an account, all your completed lessons, lifetime XP, level, coins, and streak count are continuously synced to our Supabase cloud database. You can also download a local offline JSON backup anytime under Settings → Account.'
  },
  {
    q: 'What are Coding Challenges and the Code Crawler game?',
    a: 'Coding Challenges (/challenges) offer bite-sized algorithmic puzzles to test speed and problem-solving. Code Crawler (/games/crawler) is an arcade terminal game where you solve code hurdles to navigate a bot through a digital dungeon.'
  },
  {
    q: 'Can I use CodeSage on mobile phones and tablets?',
    a: 'Yes! CodeSage is designed to be fully responsive with dedicated mobile navigation. While conceptual reading and quizzes work great on phones, hands-on Monaco coding in Frontend and Systems tracks is best experienced on tablets or desktop keyboards.'
  },
  {
    q: 'How do I report a bug or ask a question?',
    a: 'You can email the administrator directly at zainrao.dev@gmail.com anytime. We review all feedback and questions personally.'
  }
];

const CURRICULUM_TRACKS = [
  { name: 'Frontend Web Development', desc: 'HTML5, Modern CSS, ES6+ JavaScript & React components' },
  { name: 'Python Core & Python Expert', desc: 'OOP, data structures, algorithms, generators & automation' },
  { name: 'SQL & Database Engineering', desc: 'Relational queries, joins, aggregates, indexes & schema design' },
  { name: 'AI Fundamentals & Intermediate AI', desc: 'Neural networks, LLM prompting, embeddings & autonomous agents' },
  { name: 'Systems Programming: C & C Expert', desc: 'Pointers, manual memory allocation, structs & system calls' },
  { name: 'Modern C++ & C++ Expert', desc: 'OOP, templates, RAII, STL algorithms & performance optimization' },
  { name: 'Enterprise Java & Java Expert', desc: 'JVM internals, multithreading, Spring concepts & design patterns' },
  { name: 'Computer Networking & Protocols', desc: 'TCP/IP, UDP, HTTP/3, WebSockets, DNS & network security' },
  { name: 'Freelancing & Client Mastery', desc: 'Proposals, contracts, project estimation & client management' },
  { name: '3D Web Graphics (Three.js)', desc: 'WebGL, shaders, lighting, 3D geometries & scene cameras' },
  { name: 'Local Environment & Dev Tooling', desc: 'Terminal bash, Git version control, Docker & environment configs' },
];

export default function TopUtilityBar() {
  const [isFaqOpen, setIsFaqOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(0);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(ADMIN_EMAIL);
      setCopiedEmail(true);
      toast.success('Admin email copied to clipboard!');
      setTimeout(() => setCopiedEmail(false), 2000);
    } catch {
      toast.error('Failed to copy email to clipboard');
    }
  };

  return (
    <>
      {/* Sleek Top Utility Bar Docked At Top Of Content */}
      <header
        className="w-full h-11 border-b border-border/30 bg-card/40 backdrop-blur-md px-3 sm:px-5 flex items-center justify-between sticky top-0 z-20 transition-all select-none"
        data-no-translate="true"
      >
        {/* Left Side: Brand & Quick Modals */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono text-muted-foreground/90 font-medium">
            <Terminal className="w-3.5 h-3.5 text-primary shrink-0" />
            <span className="text-foreground font-semibold font-display">CodeSage</span>
            <span className="text-border/70">/</span>
            <span className="text-[11px] text-muted-foreground hidden lg:inline">Interactive CS Academy</span>
          </div>

          <div className="flex items-center gap-1 sm:gap-1.5">
            {/* FAQs Button */}
            <button
              type="button"
              onClick={() => setIsFaqOpen(true)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 border border-transparent hover:border-border/40 transition-all"
              title="Frequently Asked Questions & Help"
            >
              <HelpCircle className="w-3.5 h-3.5 text-primary shrink-0" />
              <span>FAQs</span>
            </button>

            {/* About Button */}
            <button
              type="button"
              onClick={() => setIsAboutOpen(true)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 border border-transparent hover:border-border/40 transition-all"
              title="About CodeSage Features & Curriculum"
            >
              <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>About</span>
            </button>

            {/* Free & Pro in 2 Days Button */}
            <button
              type="button"
              onClick={() => setIsPlanModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-all shadow-sm"
              title="View Membership Plans: Free Tier active & PRO arriving in 2 days"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <span>Free & Pro</span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-primary/20 text-primary border border-primary/30 uppercase tracking-tight hidden sm:inline">
                In 2 Days
              </span>
            </button>
          </div>
        </div>

        {/* Right Side: Embedded Language Switcher */}
        <div className="flex items-center gap-2">
          <GlobalTranslatorWidget mode="docked" />
        </div>
      </header>

      {/* ==================== FAQs MODAL ==================== */}
      {isFaqOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in duration-150"
          onClick={() => setIsFaqOpen(false)}
        >
          <div
            className="w-full max-w-2xl max-h-[88vh] bg-card border border-border/50 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-border/40 flex items-start justify-between bg-card/80">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary shrink-0">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold font-display text-foreground">
                    Frequently Asked Questions & Help
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Everything you need to know about how CodeSage works
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsFaqOpen(false)}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
                aria-label="Close FAQs"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Scrollable Content */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-sm">
              {/* FAQ Accordions */}
              <div className="space-y-2">
                {FAQ_ITEMS.map((item, idx) => {
                  const isExpanded = expandedFaqIndex === idx;
                  return (
                    <div
                      key={idx}
                      className="border border-border/40 rounded-xl overflow-hidden bg-secondary/15 transition-colors"
                    >
                      <button
                        type="button"
                        onClick={() => setExpandedFaqIndex(isExpanded ? null : idx)}
                        className="w-full p-3.5 text-left flex items-center justify-between gap-3 hover:bg-secondary/30 transition-colors"
                      >
                        <span className="font-semibold text-xs sm:text-sm text-foreground">
                          {item.q}
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform ${
                            isExpanded ? 'rotate-180 text-primary' : ''
                          }`}
                        />
                      </button>
                      {isExpanded && (
                        <div className="p-3.5 pt-0 text-xs sm:text-sm text-muted-foreground border-t border-border/20 bg-background/40 leading-relaxed">
                          {item.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Admin Contact & Suggestions Box Callout */}
              <div className="rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 via-card/90 to-amber-500/10 p-4 sm:p-5 space-y-3.5">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary shrink-0 mt-0.5">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold font-display text-sm text-foreground">
                      Have a question not listed here?
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Contact the administrator directly for personalized support, bug reports, or account assistance.
                    </p>
                  </div>
                </div>

                {/* Email Display & Actions */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <code className="text-xs font-mono bg-background/80 border border-border/50 px-3 py-2 rounded-xl text-primary font-bold">
                    {ADMIN_EMAIL}
                  </code>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-secondary/50 hover:bg-secondary/80 border border-border/40 text-foreground transition-all"
                  >
                    {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedEmail ? 'Copied!' : 'Copy Email'}</span>
                  </button>
                  <a
                    href={`mailto:${ADMIN_EMAIL}?subject=CodeSage%20Question`}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-primary/15 hover:bg-primary/25 border border-primary/30 text-primary transition-all ml-auto"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Send Email</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-3.5 px-5 border-t border-border/40 bg-card/70 flex justify-end">
              <button
                type="button"
                onClick={() => setIsFaqOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-secondary/60 hover:bg-secondary border border-border/50 text-foreground transition-colors"
              >
                Close FAQs
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== ABOUT MODAL ==================== */}
      {isAboutOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in duration-150"
          onClick={() => setIsAboutOpen(false)}
        >
          <div
            className="w-full max-w-2xl max-h-[88vh] bg-card border border-border/50 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-border/40 flex items-start justify-between bg-card/80">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                  <Terminal className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold font-display text-foreground">
                    About CodeSage
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Comprehensive computer science & software engineering training platform
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAboutOpen(false)}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
                aria-label="Close About"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Scrollable Content */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-sm">
              {/* Mission Statement */}
              <div className="p-4 rounded-xl bg-secondary/20 border border-border/40 space-y-2">
                <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-primary">
                  The Vision & Philosophy
                </h3>
                <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed">
                  CodeSage bridges the gap between passive video tutorials and production engineering. We combine hands-on in-browser coding environments, diagnostic quizzes that isolate student misconceptions, and deep curriculum tracks ranging from high-level web frameworks down to low-level pointers and networking sockets.
                </p>
              </div>

              {/* What is Inside CodeSage */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-primary" />
                  <h3 className="text-sm font-bold font-display text-foreground">
                    What’s Inside the App (18 Curriculum Tracks)
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {CURRICULUM_TRACKS.map((track, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl border border-border/30 bg-secondary/15 hover:border-primary/30 transition-all space-y-1"
                    >
                      <p className="text-xs font-bold text-foreground font-display flex items-center gap-1.5">
                        <Code2 className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span>{track.name}</span>
                      </p>
                      <p className="text-[11px] text-muted-foreground leading-snug">
                        {track.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interactive Features */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-bold font-display text-foreground">
                    Core Platform Features
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-muted-foreground">
                  <div className="flex items-start gap-2 p-2.5 rounded-lg bg-background/50 border border-border/30">
                    <Code2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-foreground block">Interactive Monaco Editor:</strong>
                      Write real HTML, CSS, JS, and Python with live compiler feedback and test validation.
                    </div>
                  </div>

                  <div className="flex items-start gap-2 p-2.5 rounded-lg bg-background/50 border border-border/30">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-foreground block">Mistake Tracking Engine:</strong>
                      Targeted review of missed quiz questions under Settings to eliminate learning blind spots.
                    </div>
                  </div>

                  <div className="flex items-start gap-2 p-2.5 rounded-lg bg-background/50 border border-border/30">
                    <Flame className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-foreground block">Daily Streaks & Levels:</strong>
                      Stay disciplined with XP progression, developer tiers, and streak preservation mechanics.
                    </div>
                  </div>

                  <div className="flex items-start gap-2 p-2.5 rounded-lg bg-background/50 border border-border/30">
                    <Award className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-foreground block">Milestone Exams & Skill Tests:</strong>
                      Comprehensive assessments at /exams to benchmark your technical competence.
                    </div>
                  </div>
                </div>
              </div>

              {/* Direct Support Inquiries */}
              <div className="p-4 rounded-xl border border-border/40 bg-secondary/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs font-bold text-foreground font-display">
                    Have questions or feedback?
                  </h4>
                  <p className="text-[11px] text-muted-foreground">
                    Direct inquiries and bug reports are welcomed at {ADMIN_EMAIL}.
                  </p>
                </div>
                <a
                  href={`mailto:${ADMIN_EMAIL}?subject=CodeSage%20Inquiry`}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-primary/15 hover:bg-primary/25 border border-primary/30 text-primary transition-all shrink-0 inline-flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Contact Admin</span>
                </a>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-3.5 px-5 border-t border-border/40 bg-card/70 flex justify-between items-center text-[11px] text-muted-foreground font-mono">
              <span>CodeSage v2.4 · Built with Craft</span>
              <button
                type="button"
                onClick={() => setIsAboutOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-secondary/60 hover:bg-secondary border border-border/50 text-foreground transition-colors font-sans"
              >
                Close About
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== FREE & PRO PLANS MODAL ==================== */}
      {isPlanModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in duration-150"
          onClick={() => setIsPlanModalOpen(false)}
        >
          <div
            className="w-full max-w-2xl max-h-[90vh] bg-card border border-border/50 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-border/40 flex items-start justify-between bg-card/80">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                  <Crown className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold font-display text-foreground flex items-center gap-2">
                    <span>CodeSage Membership Plans</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/30 font-semibold">
                      Roadmap Update
                    </span>
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Current active tier and preview of the upcoming PRO rollout
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsPlanModalOpen(false)}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
                aria-label="Close Plans"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-sm">
              {/* Release Schedule Notification Banner */}
              <div className="p-4 rounded-2xl border border-primary/40 bg-gradient-to-r from-primary/15 via-secondary/20 to-amber-500/15 flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary shrink-0 mt-0.5">
                  <Calendar className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xs sm:text-sm font-bold font-display text-foreground">
                    Next Major Rollout (2-Day Release Window)
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                    <strong className="text-primary">Tomorrow:</strong> We are launching our interactive <span className="text-foreground font-semibold">AI Teacher</span> to help you debug code and understand concepts in real time.
                    <br />
                    <strong className="text-amber-400">In 2 Days:</strong> The full <span className="text-foreground font-semibold">Developer Marketplace</span> &amp; <span className="text-foreground font-semibold">CodeSage PRO</span> tier unlock!
                  </p>
                </div>
              </div>

              {/* Plans Comparison Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {/* Free Plan Card */}
                <div className="p-4 sm:p-5 rounded-2xl border border-emerald-500/40 bg-emerald-500/[0.04] flex flex-col justify-between space-y-4 relative">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-bold font-mono uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        Current Plan
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold">
                        ACTIVE
                      </span>
                    </div>

                    <h3 className="text-xl font-bold font-display text-foreground">
                      Free Forever
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Full access to core computer science education at zero cost.
                    </p>

                    <div className="mt-4 space-y-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>All 18 Curriculum Tracks unlocked</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>In-browser Monaco code editor</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>Diagnostic quizzes &amp; mistake review</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>Interactive Multi-File Playground</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>Community forums &amp; Daily Streaks</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>Cloud sync &amp; local offline JSON backup</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-emerald-500/20">
                    <span className="text-[11px] font-mono text-emerald-400 font-semibold block text-center">
                      Included with every student account
                    </span>
                  </div>
                </div>

                {/* PRO Plan Card (Upcoming) */}
                <div className="p-4 sm:p-5 rounded-2xl border border-primary/40 bg-primary/[0.04] flex flex-col justify-between space-y-4 relative">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-bold font-mono uppercase tracking-wider text-primary flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-primary" />
                        Upcoming Tier
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/40 font-bold">
                        LAUNCHING IN 2 DAYS
                      </span>
                    </div>

                    <h3 className="text-xl font-bold font-display text-foreground flex items-center gap-2">
                      <span>CodeSage PRO</span>
                      <Crown className="w-4 h-4 text-amber-400" />
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Power-user engineering tools, AI mentorship, and ecosystem access.
                    </p>

                    <div className="mt-4 space-y-2 text-xs text-foreground/90">
                      <div className="flex items-start gap-2 p-2 rounded-lg bg-background/50 border border-border/40">
                        <Bot className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-foreground block font-semibold">
                            AI Teacher (Coming Tomorrow!):
                          </strong>
                          <span className="text-muted-foreground text-[11px]">
                            Live AI coding mentor right inside lessons for instant debugging and code analysis.
                          </span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 p-2 rounded-lg bg-background/50 border border-border/40">
                        <ShoppingBag className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-foreground block font-semibold">
                            Developer Marketplace (In 2 Days!):
                          </strong>
                          <span className="text-muted-foreground text-[11px]">
                            Download and share student templates, starter kits, and customized editor themes.
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-muted-foreground text-xs pl-1">
                        <Zap className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span>High-priority sandbox execution</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground text-xs pl-1">
                        <Crown className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>Exclusive PRO badge and community flair</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-primary/20">
                    <button
                      type="button"
                      disabled
                      className="w-full py-2 px-3 rounded-xl text-xs font-semibold bg-primary/20 border border-primary/30 text-primary opacity-80 cursor-default flex items-center justify-center gap-1.5"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Arriving in 2 Days · Stay Tuned!</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-3.5 px-5 border-t border-border/40 bg-card/70 flex justify-between items-center text-[11px] text-muted-foreground font-mono">
              <span>CodeSage Membership Roadmap</span>
              <button
                type="button"
                onClick={() => setIsPlanModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-secondary/60 hover:bg-secondary border border-border/50 text-foreground transition-colors font-sans"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
