import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HelpCircle,
  Info,
  MessageSquarePlus,
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
  Flame
} from 'lucide-react';
import { toast } from 'sonner';
import GlobalTranslatorWidget from '@/components/GlobalTranslatorWidget';

const ADMIN_EMAIL = 'zainrao.dev@gmail.com';

const FAQ_ITEMS = [
  {
    q: 'How does track enrollment work? Why is there a 2-track limit?',
    a: 'CodeSage allows enrollment in up to 2 active tracks simultaneously. This limit is intentionally designed using cognitive load principles—focusing your daily practice on 1 or 2 areas leads to significantly higher retention and curriculum completion than spreading effort thin across dozens of tracks. You can switch, pause, or resume tracks anytime in Settings.'
  },
  {
    q: 'How are lessons structured? Why do some tracks have quizzes and others don’t?',
    a: 'Frontend Development (HTML, CSS, JavaScript, React) is 100% interactive coding—you write and test live code in the Monaco editor with real-time browser preview and challenge verification. Other tracks (such as Python, SQL, AI Fundamentals, Systems C/C++, Java) blend conceptual deep-dives, interactive code sandboxes, and end-of-lesson diagnostic quizzes to test retention.'
  },
  {
    q: 'Where can I see the questions I got wrong?',
    a: 'Head to Settings → Lessons-Based Track Progress. Expand any enrolled track to see lesson-by-lesson metrics. If you answered any questions incorrectly, they are highlighted with the exact question text, options, and a direct "Retake Quiz" button to reinforce your understanding.'
  },
  {
    q: 'How do XP, Levels, and Sage Coins work?',
    a: 'Completing lessons, maintaining daily streaks, and solving challenges awards XP and Sage Coins. As your XP grows, your developer rank levels up (from Novice to Architect). Sage Coins can be redeemed for cosmetics, profile perks, and streak freezes in the shop.'
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
    q: 'Can I earn verifiable certificates?',
    a: 'Yes. Once you finish a curriculum track, you can take a comprehensive assessment under the Exams & Certifications section (/exams) to validate your mastery and receive a certificate badge.'
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
  const [isFaqOpen, setIsFaqOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
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

            {/* Suggestions Button */}
            <button
              type="button"
              onClick={() => navigate('/suggestions')}
              className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 border border-transparent hover:border-border/40 transition-all"
              title="Open Community Suggestions Box"
            >
              <MessageSquarePlus className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Suggestions</span>
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

                {/* Suggestions Box Button */}
                <div className="pt-2 border-t border-border/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Want to suggest a new feature or lesson?</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsFaqOpen(false);
                      navigate('/suggestions');
                    }}
                    className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 transition-all shadow-sm"
                  >
                    <MessageSquarePlus className="w-3.5 h-3.5" />
                    <span>Open Suggestions Box →</span>
                  </button>
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
                      <strong className="text-foreground block">Certifications & Exams:</strong>
                      Comprehensive tests at /exams to validate your technical competence.
                    </div>
                  </div>
                </div>
              </div>

              {/* Suggestions Box Direct Action */}
              <div className="p-4 rounded-xl border border-border/40 bg-secondary/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs font-bold text-foreground font-display">
                    Have feedback or want to request a topic?
                  </h4>
                  <p className="text-[11px] text-muted-foreground">
                    We review community suggestions to build the future roadmap.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsAboutOpen(false);
                    navigate('/suggestions');
                  }}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-primary/15 hover:bg-primary/25 border border-primary/30 text-primary transition-all shrink-0"
                >
                  Visit Suggestions Box →
                </button>
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
    </>
  );
}
