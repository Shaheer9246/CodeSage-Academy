import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
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
  Crown,
  Search,
  CheckCircle2,
  ArrowRight,
  Heart
} from 'lucide-react';
import { toast } from 'sonner';
import GlobalTranslatorWidget from '@/components/GlobalTranslatorWidget';
import { COURSE_CURRICULUM } from '@/data/courseCurriculumGuide';
import CourseOverviewModal from '@/components/CourseOverviewModal';
import { PRO_FEATURES, PRO_PRICING } from '@/config/proFeatures';

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
  const navigate = useNavigate();
  const { user } = useUser();
  const isProUser = Boolean(user?.isPro);
  const [isFaqOpen, setIsFaqOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [isDonationOpen, setIsDonationOpen] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(0);
  const [aboutActiveTab, setAboutActiveTab] = useState<'guide' | 'overview'>('guide');
  const [guideFilter, setGuideFilter] = useState<string>('all');
  const [guideSearch, setGuideSearch] = useState<string>('');
  const [selectedCourseDetail, setSelectedCourseDetail] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [selectedPaymentTab, setSelectedPaymentTab] = useState<'card' | 'manual'>('card');

  useEffect(() => {
    const handleOpenFaq = () => setIsFaqOpen(true);
    const handleOpenAbout = () => setIsAboutOpen(true);
    const handleOpenPlan = () => setIsPlanModalOpen(true);
    const handleOpenDonation = () => setIsDonationOpen(true);

    window.addEventListener('codesage-open-faq', handleOpenFaq);
    window.addEventListener('codesage-open-about', handleOpenAbout);
    window.addEventListener('codesage-open-plan', handleOpenPlan);
    window.addEventListener('codesage-open-donation', handleOpenDonation);

    return () => {
      window.removeEventListener('codesage-open-faq', handleOpenFaq);
      window.removeEventListener('codesage-open-about', handleOpenAbout);
      window.removeEventListener('codesage-open-plan', handleOpenPlan);
      window.removeEventListener('codesage-open-donation', handleOpenDonation);
    };
  }, []);

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

  const handleCopyAccount = async (accountNumber: string, label: string) => {
    try {
      await navigator.clipboard.writeText(accountNumber);
      setCopiedAccount(label);
      toast.success(`${label} copied to clipboard!`);
      setTimeout(() => setCopiedAccount(null), 2500);
    } catch {
      toast.error('Failed to copy account details');
    }
  };

  return (
    <>
      {/* Sleek Top Utility Bar Docked At Top Of Content (Visible on both mobile & desktop) */}
      <header
        className="flex w-full h-11 border-b border-border/30 bg-card/40 backdrop-blur-md px-3 sm:px-5 items-center justify-between sticky top-0 z-20 transition-all select-none"
        data-no-translate="true"
      >
        {/* Left Side: CodeSage Brand & Donation Box Button right after */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground/90 font-medium">
            <Terminal className="w-3.5 h-3.5 text-primary shrink-0" />
            <span className="text-foreground font-semibold font-display">CodeSage</span>
            <span className="text-border/70 hidden sm:inline">/</span>
            <span className="text-[11px] text-muted-foreground hidden lg:inline">Interactive CS Academy</span>
          </div>

          {/* Donation Box Button (Kept on the right side after CodeSage) */}
          <button
            type="button"
            onClick={() => setIsDonationOpen(true)}
            className="inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-lg text-xs font-medium text-pink-400 hover:text-pink-300 bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/25 transition-all shadow-sm shrink-0"
            title="Support CodeSage Servers, Domain & Student Infrastructure"
          >
            <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-400/30 shrink-0" />
            <span className="font-semibold text-[11px] sm:text-xs">Donate</span>
          </button>
        </div>

        {/* Right Side: Language Toggle (compact globe) and Free Support / Donate with Ads */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Support CodeSage with Ads */}
          <button
            type="button"
            onClick={() => navigate('/support-us')}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 transition-all shadow-xs"
            title="Support CodeSage for Free by viewing sponsor ads"
          >
            <Sparkles className="w-3.5 h-3.5 text-primary shrink-0" />
            <span className="font-semibold text-[11px]">Free Support</span>
          </button>

          {/* Language Toggle Widget: small globe icon that expands */}
          <GlobalTranslatorWidget mode="docked" compact={true} />
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
            className="w-full max-w-3xl max-h-[90vh] bg-card border border-border/50 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-border/40 flex items-start justify-between bg-card/90">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                  <Terminal className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold font-display text-foreground">
                    About CodeSage & Curriculum Guide
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Directory of all 18 engineering tracks, what each contains, and verified learning outcomes
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

            {/* Modal Tabs Header */}
            <div className="flex border-b border-border/40 bg-secondary/15 px-4 sm:px-6">
              <button
                type="button"
                onClick={() => setAboutActiveTab('guide')}
                className={`flex items-center gap-2 py-3 px-3 text-xs font-semibold font-display border-b-2 transition-all ${
                  aboutActiveTab === 'guide'
                    ? 'border-primary text-primary bg-primary/5'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-secondary/20'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Curriculum Guide & Outcomes</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-primary/15 text-primary border border-primary/25">
                  18 Tracks
                </span>
              </button>
              <button
                type="button"
                onClick={() => setAboutActiveTab('overview')}
                className={`flex items-center gap-2 py-3 px-3 text-xs font-semibold font-display border-b-2 transition-all ${
                  aboutActiveTab === 'overview'
                    ? 'border-primary text-primary bg-primary/5'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-secondary/20'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Platform & Methodology</span>
              </button>
            </div>

            {/* Modal Scrollable Content */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-sm flex-1">
              {/* TAB 1: CURRICULUM GUIDE */}
              {aboutActiveTab === 'guide' && (
                <div className="space-y-4">
                  {/* Search and Category Filters */}
                  <div className="space-y-2.5">
                    <div className="relative">
                      <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        value={guideSearch}
                        onChange={e => setGuideSearch(e.target.value)}
                        placeholder="Search courses by title, topic, or skill (e.g. React, C++, Pointers, RAG)..."
                        className="w-full text-xs bg-secondary/30 border border-border/40 rounded-xl pl-9 pr-8 py-2.5 text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                      {guideSearch && (
                        <button
                          type="button"
                          onClick={() => setGuideSearch('')}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Filter Pills */}
                    <div className="flex flex-wrap items-center gap-1.5 text-xs">
                      {[
                        { id: 'all', label: 'All Tracks (18)' },
                        { id: 'web', label: 'Web & Frontend' },
                        { id: 'systems', label: 'Systems & Low-Level' },
                        { id: 'enterprise', label: 'Enterprise & Backend' },
                        { id: 'ai', label: 'AI & Models' },
                        { id: 'consultancy', label: 'Consultancy' },
                      ].map(pill => (
                        <button
                          key={pill.id}
                          type="button"
                          onClick={() => setGuideFilter(pill.id)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                            guideFilter === pill.id
                              ? 'bg-primary text-primary-foreground shadow-sm'
                              : 'bg-secondary/40 text-muted-foreground hover:text-foreground hover:bg-secondary'
                          }`}
                        >
                          {pill.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Course Cards List */}
                  <div className="space-y-3">
                    {COURSE_CURRICULUM.filter(c => {
                      const matchesFilter =
                        guideFilter === 'all' ||
                        (guideFilter === 'web' && c.category === 'Web & Frontend Architecture') ||
                        (guideFilter === 'systems' && c.category === 'Systems & Low-Level') ||
                        (guideFilter === 'enterprise' && c.category === 'Enterprise & Cloud Backend') ||
                        (guideFilter === 'ai' && c.category === 'AI & Autonomous Models') ||
                        (guideFilter === 'consultancy' && c.category === 'Consultancy & Commercial Practice');

                      const query = guideSearch.toLowerCase().trim();
                      const matchesSearch =
                        !query ||
                        c.title.toLowerCase().includes(query) ||
                        c.shortTitle.toLowerCase().includes(query) ||
                        c.credentialCode.toLowerCase().includes(query) ||
                        c.briefOverview.toLowerCase().includes(query) ||
                        c.whatYouWillGet.toLowerCase().includes(query);

                      return matchesFilter && matchesSearch;
                    }).map(course => (
                      <div
                        key={course.id}
                        className="p-4 rounded-xl border border-border/40 bg-secondary/15 hover:border-primary/40 transition-all space-y-3"
                      >
                        {/* Course Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <span className="text-xl shrink-0">{course.emoji}</span>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="text-sm font-bold font-display text-foreground">
                                  {course.title}
                                </h3>
                                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-primary/15 text-primary border border-primary/30 font-semibold">
                                  {course.credentialCode}
                                </span>
                              </div>
                              <p className="text-[11px] text-muted-foreground font-mono">
                                {course.category} · {course.level}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-mono text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                              {course.lessonsCount} lessons
                            </span>
                          </div>
                        </div>

                        {/* What It Contains */}
                        <div className="p-3 rounded-lg bg-background/50 border border-border/30 space-y-1">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground font-bold block">
                            What this course contains:
                          </span>
                          <p className="text-xs text-foreground/90 leading-relaxed">
                            {course.briefOverview}
                          </p>
                        </div>

                        {/* What You Will Get */}
                        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 space-y-1">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            What you will get & be able to do:
                          </span>
                          <p className="text-xs text-foreground/90 leading-relaxed">
                            {course.whatYouWillGet}
                          </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => setSelectedCourseDetail(course.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-secondary/70 hover:bg-secondary text-foreground border border-border/40 hover:border-primary/40 transition-all"
                          >
                            <BookOpen className="w-3.5 h-3.5 text-primary" />
                            <span>View 100% In-Depth Syllabus & Outcomes</span>
                          </button>

                          {/* UPDATED: Redirects to Roadmap instead of course.route */}
                          <button
                            type="button"
                            onClick={() => {
                              setIsAboutOpen(false);
                              navigate('/roadmap');
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 transition-all ml-auto"
                          >
                            <span>Go to Roadmap</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 2: PLATFORM & METHODOLOGY */}
              {aboutActiveTab === 'overview' && (
                <div className="space-y-5">
                  {/* Mission Statement */}
                  <div className="p-4 rounded-xl bg-secondary/20 border border-border/40 space-y-2">
                    <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-primary">
                      The Vision & Philosophy
                    </h3>
                    <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed">
                      CodeSage bridges the gap between passive video tutorials and production engineering. We combine hands-on in-browser coding environments, diagnostic quizzes that isolate student misconceptions, and deep curriculum tracks ranging from high-level web frameworks down to low-level pointers and networking sockets.
                    </p>
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
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3.5 px-5 border-t border-border/40 bg-card/70 flex justify-between items-center text-[11px] text-muted-foreground font-mono">
              <span>CodeSage v2.4 · 18 Engineering Tracks</span>
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

      {/* Course Overview In-Depth Modal (Triggered from Curriculum Guide) */}
      <CourseOverviewModal
        isOpen={!!selectedCourseDetail}
        onClose={() => setSelectedCourseDetail(null)}
        initialTrackId={selectedCourseDetail || undefined}
      />

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
            <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-sm">
              {/* Billing Toggle (PKR & USD Friendly) */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-2xl bg-secondary/30 border border-border/40">
                <div className="text-left">
                  <div className="font-semibold text-foreground text-xs sm:text-sm">Choose Your Billing Term</div>
                  <div className="text-[11px] text-muted-foreground">Affordable regional rates tailored for students in Pakistan &amp; Asia</div>
                </div>

                <div className="flex items-center gap-1.5 bg-background/80 p-1 rounded-xl border border-border/50">
                  <button
                    type="button"
                    onClick={() => setBillingCycle('monthly')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                      billingCycle === 'monthly'
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Monthly (Rs. {PRO_PRICING.currency_pkr.monthly} / ${PRO_PRICING.currency_usd.monthly})
                  </button>
                  <button
                    type="button"
                    onClick={() => setBillingCycle('annual')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                      billingCycle === 'annual'
                        ? 'bg-amber-500 text-black font-bold shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <span>Annual (Save 35%)</span>
                    <span className="text-[9px] uppercase px-1 py-0.2 bg-black/20 text-white rounded font-mono font-bold">Value</span>
                  </button>
                </div>
              </div>

              {/* Plans Comparison Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Free Plan Card */}
                <div className="p-4 sm:p-5 rounded-2xl border border-emerald-500/40 bg-emerald-500/[0.04] flex flex-col justify-between space-y-4 relative">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-bold font-mono uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        Free Student Tier
                      </span>
                      {!isProUser && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold">
                          CURRENT PLAN
                        </span>
                      )}
                    </div>

                    <div className="flex items-baseline gap-2">
                      <h3 className="text-2xl font-bold font-display text-foreground">
                        Rs. 0
                      </h3>
                      <span className="text-xs text-muted-foreground">/ free forever</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Complete core computer science tracks and compiler playgrounds for every student.
                    </p>

                    <div className="mt-4 space-y-2.5 text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span><strong>18 Full Curriculum Tracks</strong> (Frontend, Python, C, Java, SQL, 3D)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span><strong>2 Active Track Enrollments</strong> at any one time</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span><strong>5 AI Teacher Credits</strong> monthly auto-refill</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span><strong>English &amp; Urdu</strong> real-time lesson translations</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>Interactive Monaco code editor &amp; diagnostics</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>Cloud sync, daily streaks &amp; mistake reviews</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-emerald-500/20">
                    <div className="py-2 px-3 rounded-xl text-xs font-semibold bg-emerald-500/10 text-emerald-400 text-center border border-emerald-500/20">
                      Standard Access Included
                    </div>
                  </div>
                </div>

                {/* PRO Plan Card */}
                <div className="p-4 sm:p-5 rounded-2xl border border-amber-500/50 bg-amber-500/[0.05] flex flex-col justify-between space-y-4 relative shadow-lg shadow-amber-500/5">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-bold font-mono uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                        <Crown className="w-3.5 h-3.5 text-amber-400" />
                        CodeSage PRO
                      </span>
                      {isProUser ? (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                          ACTIVE PLAN
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/40 font-bold">
                          RECOMMENDED
                        </span>
                      )}
                    </div>

                    <div className="flex items-baseline gap-2">
                      <h3 className="text-2xl font-bold font-display text-foreground">
                        {billingCycle === 'monthly' ? `Rs. ${PRO_PRICING.currency_pkr.monthly}` : `Rs. ${PRO_PRICING.currency_pkr.annual}`}
                      </h3>
                      <span className="text-xs text-muted-foreground">
                        ({billingCycle === 'monthly' ? `$${PRO_PRICING.currency_usd.monthly}/mo` : `$${PRO_PRICING.currency_usd.annual}/year`})
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Turbocharged AI mentorship, unlimited track enrollments, and exclusive power tools.
                    </p>

                    <div className="mt-4 space-y-2.5 text-xs text-foreground/90">
                      <div className="flex items-center gap-2 text-primary font-medium">
                        <Bot className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span><strong>100 AI Teacher Queries</strong> every month for instant code explanations</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span><strong>Unlimited Concurrent Track Enrollments</strong> across all 18 tracks</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span><strong>AI Technical Interviewer</strong> &amp; Career Counselor unlock</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span><strong>All 14 Regional Languages</strong> real-time translator</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span><strong>Developer Marketplace</strong> premium templates &amp; starter kits</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span><strong>Gold PRO Crown Badge</strong> &amp; verified Student ID card flair</span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Methods Selection */}
                  <div className="pt-3 border-t border-amber-500/30 space-y-2.5">
                    {/* Payment Tabs */}
                    <div className="flex rounded-lg bg-secondary/50 p-0.5 text-[11px] font-medium">
                      <button
                        type="button"
                        onClick={() => setSelectedPaymentTab('card')}
                        className={`flex-1 py-1 rounded-md transition-all ${
                          selectedPaymentTab === 'card'
                            ? 'bg-background text-foreground font-semibold shadow-xs'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        Lemon Squeezy / Card
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedPaymentTab('manual')}
                        className={`flex-1 py-1 rounded-md transition-all ${
                          selectedPaymentTab === 'manual'
                            ? 'bg-background text-foreground font-semibold shadow-xs'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        JazzCash / EasyPaisa
                      </button>
                    </div>

                    {selectedPaymentTab === 'card' ? (
                      <div className="space-y-2">
                        <button
                          type="button"
                          onClick={() => {
                            toast.info('Redirecting to secure Lemon Squeezy checkout...', {
                              description: 'Visa, MasterCard, Amex, Apple Pay and international debit cards supported.'
                            });
                            // Lemon Squeezy checkout handler with pass-through user ID
                            const url = billingCycle === 'monthly' ? PRO_PRICING.lemon_squeezy.monthly_url : PRO_PRICING.lemon_squeezy.annual_url;
                            window.open(`${url}?checkout[custom][user_id]=${user?.id || ''}&checkout[email]=${encodeURIComponent(user?.email || '')}`, '_blank');
                          }}
                          className="w-full py-2.5 px-3 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-black shadow-md transition-all flex items-center justify-center gap-2"
                        >
                          <Crown className="w-4 h-4" />
                          <span>Upgrade via Lemon Squeezy ({billingCycle === 'monthly' ? `$${PRO_PRICING.currency_usd.monthly}` : `$${PRO_PRICING.currency_usd.annual}`})</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                        <p className="text-[10px] text-muted-foreground text-center">
                          Powered by Lemon Squeezy (Merchant of Record). Secure SSL 256-bit encryption.
                        </p>
                      </div>
                    ) : (
                      <div className="p-3 rounded-xl bg-secondary/40 border border-border/50 space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-foreground">Direct Mobile Transfer (Pakistan):</span>
                          <span className="font-mono text-amber-400 font-bold">
                            {billingCycle === 'monthly' ? `Rs. ${PRO_PRICING.currency_pkr.monthly}` : `Rs. ${PRO_PRICING.currency_pkr.annual}`}
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground leading-relaxed">
                          Send payment via JazzCash or EasyPaisa to:
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="p-2 rounded-lg bg-background/60 border border-border/40 text-[11px]">
                            <div className="font-bold text-primary">JazzCash</div>
                            <div className="font-mono text-foreground select-all">0340-9773229</div>
                            <div className="text-[10px] text-muted-foreground">Muhammad Zain</div>
                          </div>
                          <div className="p-2 rounded-lg bg-background/60 border border-border/40 text-[11px]">
                            <div className="font-bold text-emerald-400">EasyPaisa</div>
                            <div className="font-mono text-foreground select-all">0340-9773229</div>
                            <div className="text-[10px] text-muted-foreground">Muhammad Zain</div>
                          </div>
                        </div>
                        <div className="pt-1 flex items-center justify-between text-[11px]">
                          <span className="text-muted-foreground">After transfer, share Trx ID with:</span>
                          <a
                            href={`mailto:${ADMIN_EMAIL}?subject=CodeSage%20PRO%20Activation%20Request&body=User%20Email:%20${encodeURIComponent(user?.email || '')}%0AStudent%20ID:%20${encodeURIComponent(user?.studentId || '')}%0ATrx%20ID:%20`}
                            className="text-primary hover:underline font-semibold flex items-center gap-1"
                          >
                            <Mail className="w-3 h-3" />
                            <span>Verify &amp; Activate</span>
                          </a>
                        </div>
                      </div>
                    )}
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

      {/* ==================== DONATION BOX MODAL ==================== */}
      {isDonationOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in duration-150"
          onClick={() => setIsDonationOpen(false)}
        >
          <div
            className="w-full max-w-xl bg-card border border-border/60 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-150"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-border/40 bg-gradient-to-r from-pink-500/10 via-primary/5 to-transparent flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-pink-500/15 border border-pink-500/30 flex items-center justify-center text-pink-400 shrink-0">
                  <Heart className="w-5 h-5 fill-pink-500/30 text-pink-400" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-foreground font-display flex items-center gap-2">
                    Support CodeSage Academy
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Keeping open-access CS education alive, ad-free, and accessible to all students.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsDonationOpen(false)}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs">
              {/* Mission & Transparency Note */}
              <div className="p-3.5 rounded-xl bg-secondary/30 border border-border/40 text-muted-foreground leading-relaxed space-y-2">
                <p>
                  <strong className="text-foreground font-semibold">Where does your donation go?</strong>
                </p>
                <p>
                  CodeSage is built to give students worldwide free access to quality computer science training. 100% of community contributions go directly toward:
                </p>
                <ul className="list-disc pl-4 space-y-1 text-foreground/90 font-mono text-[11px]">
                  <li>Cloud Server infrastructure, Supabase databases & edge APIs</li>
                  <li>Annual custom domain renewals & SSL security maintenance</li>
                  <li>High-speed AI neural inference tokens for student mentors</li>
                  <li>Free access & scholarships for students in Pakistan & South Asia</li>
                </ul>
              </div>

              {/* Free Alternative: Watch Ads */}
              <div className="p-3.5 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-primary" />
                    <span>Free Option: Support by Viewing Ads</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    No budget? Spend 1 minute clicking 3 sponsor ads to fund our student servers.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsDonationOpen(false);
                    navigate('/support-us');
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-all shrink-0"
                >
                  View 3 Ads
                </button>
              </div>

              {/* Direct Transfers (Pakistan & International) */}
              <div className="space-y-3">
                <div className="text-[11px] font-mono text-foreground font-semibold uppercase tracking-wider flex items-center justify-between">
                  <span>Direct Financial Support (Pakistan &amp; International)</span>
                  <span className="text-[10px] text-emerald-400 font-normal">Contact Admin</span>
                </div>

                {/* JazzCash Option */}
                <div className="p-3 rounded-xl bg-card border border-border/60 flex items-center justify-between hover:border-primary/40 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400 font-bold text-xs font-mono">
                      JC
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-foreground">JazzCash (Pakistan)</div>
                      <div className="text-[11px] text-muted-foreground">Contact admin for verified payment account details</div>
                    </div>
                  </div>
                  <a
                    href={`mailto:${ADMIN_EMAIL}?subject=CodeSage%20JazzCash%20Donation`}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-secondary/60 hover:bg-secondary text-foreground transition-all shrink-0"
                  >
                    <Mail className="w-3.5 h-3.5 text-red-400" />
                    <span className="text-[11px]">Request Account</span>
                  </a>
                </div>

                {/* Binance / USDT Option */}
                <div className="p-3 rounded-xl bg-card border border-border/60 flex items-center justify-between hover:border-primary/40 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-yellow-500/15 border border-yellow-500/30 flex items-center justify-center text-yellow-400 font-bold text-xs font-mono">
                      BN
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-foreground">Binance Pay &amp; USDT (Global)</div>
                      <div className="text-[11px] text-muted-foreground">Zero-fee crypto transfer for India, Bangladesh, Nepal &amp; Worldwide</div>
                    </div>
                  </div>
                  <a
                    href={`mailto:${ADMIN_EMAIL}?subject=CodeSage%20Binance%20Donation`}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-secondary/60 hover:bg-secondary text-foreground transition-all shrink-0"
                  >
                    <Mail className="w-3.5 h-3.5 text-yellow-400" />
                    <span className="text-[11px]">Request Binance ID</span>
                  </a>
                </div>
              </div>

              {/* International & Admin Contact */}
              <div className="p-3.5 rounded-xl bg-secondary/20 border border-border/40 space-y-2">
                <div className="text-[11px] font-mono text-muted-foreground font-semibold uppercase">
                  Administrator Contact
                </div>
                <p className="text-muted-foreground leading-relaxed text-[11px]">
                  Reach out directly to verify payment methods or sponsor custom cloud compute tokens for student cohorts.
                </p>
                <div className="flex items-center justify-between pt-1">
                  <span className="font-mono text-foreground text-[11px]">{ADMIN_EMAIL}</span>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-secondary/80 hover:bg-secondary text-foreground transition-all"
                  >
                    {copiedEmail ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 text-[11px]">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span className="text-[11px]">Copy Email</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-3.5 px-5 border-t border-border/40 bg-card/70 flex justify-between items-center text-[11px] text-muted-foreground font-mono">
              <span className="text-pink-400">♥ Thank you for fueling open education!</span>
              <button
                type="button"
                onClick={() => setIsDonationOpen(false)}
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