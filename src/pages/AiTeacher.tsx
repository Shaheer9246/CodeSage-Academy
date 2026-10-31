import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import {
  Bot,
  Sparkles,
  Send,
  Briefcase,
  FileText,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Copy,
  Check,
  Upload,
  Loader2,
  RefreshCw,
  Globe2,
  BookOpen,
  ArrowRight,
  UserCheck,
  ShieldCheck,
  Sparkle,
  Search,
  ArrowLeft,
  X,
  Clock,
  ExternalLink,
} from 'lucide-react';
import {
  AiTeacherMode,
  fetchUserAiCredits,
  getCachedAiCredits,
  askProfessor,
  generateMockInterview,
  evaluateMockInterview,
  analyzeResumeCounselor,
  getAllCurriculumSummaryList,
  GroundedLesson,
  MockInterviewTest,
  getAllTracksWithLessons,
  getLessonByIdAndTrack,
} from '@/services/aiTeacherService';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  groundedLesson?: GroundedLesson | null;
  timestamp: string;
}

export default function AiTeacher() {
  const navigate = useNavigate();
  const { user } = useUser();

  // Mode: 'professor' | 'interviewer' | 'counselor'
  const [mode, setMode] = useState<AiTeacherMode>('professor');

  // Credits managed via Supabase (5 monthly credits per student, non-convertible with sage coins)
  const [credits, setCredits] = useState<number>(getCachedAiCredits());
  const [queueStatus, setQueueStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Professor Mode State
  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    return [
      {
        id: 'welcome',
        sender: 'assistant',
        text: `### ⚡ Hey dude, this is your teacher punk!
Don't waste your credits. Ask anything from your lessons!
Tell me the **Lesson Name** and **Module Name** to get a complete note-type guide with core concepts, real-world examples, and deep-dive technical insights.

**Ask in any language** (English, Roman Urdu, Urdu, Hindi, etc.) — I'll break it down without the boring textbook fluff. What are we tackling today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];
  });
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);
  const [lessonFilterText, setLessonFilterText] = useState('');
  const [activeGroundedLesson, setActiveGroundedLesson] = useState<GroundedLesson | null>(null);
  const allTracks = useRef(getAllTracksWithLessons()).current;
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Interviewer Mode State
  const [interviewStep, setInterviewStep] = useState<'intro' | 'test' | 'evaluation'>('intro');
  const [interviewTrack, setInterviewTrack] = useState('Frontend Web Development (HTML/CSS/JS/React)');
  const [candidateIntro, setCandidateIntro] = useState('');
  const [mockTest, setMockTest] = useState<MockInterviewTest | null>(null);
  const [candidateAnswers, setCandidateAnswers] = useState<Record<number, string>>({});
  const [evaluationReport, setEvaluationReport] = useState<string>('');

  // Counselor Mode State
  const [targetRole, setTargetRole] = useState('Junior Frontend React Developer');
  const [resumeContent, setResumeContent] = useState('');
  const [counselorFeedback, setCounselorFeedback] = useState<string>('');
  const [isDraggingFile, setIsDraggingFile] = useState(false);

  // Suggestions list from curriculum
  const curriculumSuggestions = useRef(getAllCurriculumSummaryList()).current;

  // Sync credits & scroll
  useEffect(() => {
    fetchUserAiCredits().then(bal => setCredits(bal));
  }, []);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, isLoading, queueStatus]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    toast.success('Copied to clipboard');
  };

  // PROFESSOR SUBMIT
  const handleProfessorSubmit = async (queryText?: string) => {
    const q = (queryText || inputQuery).trim();
    if (!q) return;

    if (credits < 1) {
      toast.error('You have used your 5 free monthly AI credits. Pro plan will be available soon!');
      return;
    }

    const userMsg: ChatMessage = {
      id: String(Date.now()),
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);
    setQueueStatus(null);

    try {
      const { text, groundedLesson, creditsRemaining } = await askProfessor(q, {
        lessonOverride: activeGroundedLesson,
        onQueueStatus: status => setQueueStatus(status),
      });
      setCredits(creditsRemaining);

      const botMsg: ChatMessage = {
        id: String(Date.now() + 1),
        sender: 'assistant',
        text,
        groundedLesson: groundedLesson || activeGroundedLesson,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to connect to AI';
      toast.error(msg);
    } finally {
      setIsLoading(false);
      setQueueStatus(null);
    }
  };

  // INTERVIEWER SUBMIT
  const handleStartInterview = async () => {
    if (!candidateIntro.trim() || candidateIntro.trim().length < 20) {
      toast.error('Please introduce yourself professionally (at least 2-3 sentences).');
      return;
    }
    if (credits < 2) {
      toast.error('Mock Interview requires 2 AI Credits. You have reached your monthly limit.');
      return;
    }

    setIsLoading(true);
    setQueueStatus(null);

    try {
      const test = await generateMockInterview(interviewTrack, candidateIntro, status =>
        setQueueStatus(status)
      );
      setMockTest(test);
      setInterviewStep('test');
      setCandidateAnswers({});
      toast.success('Mock Interview test questions generated! Answer each question thoroughly.');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Interview generation failed';
      toast.error(msg);
    } finally {
      setIsLoading(false);
      setQueueStatus(null);
    }
  };

  const handleSubmitInterviewAnswers = async () => {
    if (!mockTest) return;

    // Check if at least some answers provided
    const answeredCount = Object.values(candidateAnswers).filter(a => a.trim().length > 0).length;
    if (answeredCount < 2) {
      toast.error('Please attempt to answer at least 2 questions before submitting.');
      return;
    }

    setIsLoading(true);
    setQueueStatus(null);

    const formattedAnswers = mockTest.questions.map(q => ({
      question: q.question,
      answer: candidateAnswers[q.id] || '',
    }));

    try {
      const { report, creditsRemaining } = await evaluateMockInterview(
        interviewTrack,
        candidateIntro,
        formattedAnswers,
        status => setQueueStatus(status)
      );
      setCredits(creditsRemaining);
      setEvaluationReport(report);
      setInterviewStep('evaluation');
      toast.success('Evaluation report ready!');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Evaluation failed';
      toast.error(msg);
    } finally {
      setIsLoading(false);
      setQueueStatus(null);
    }
  };

  // COUNSELOR SUBMIT
  const handleCounselorSubmit = async () => {
    if (!resumeContent.trim() || resumeContent.trim().length < 50) {
      toast.error('Please paste or upload your resume text (at least 50 characters).');
      return;
    }
    if (!targetRole.trim()) {
      toast.error('Please enter the target job position.');
      return;
    }
    if (credits < 1) {
      toast.error('Counselor review requires 1 AI Credit. You have reached your monthly limit.');
      return;
    }

    setIsLoading(true);
    setQueueStatus(null);

    try {
      const { review, creditsRemaining } = await analyzeResumeCounselor(targetRole, resumeContent, status =>
        setQueueStatus(status)
      );
      setCredits(creditsRemaining);
      setCounselorFeedback(review);
      toast.success('Resume & Career Analysis complete!');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Analysis failed';
      toast.error(msg);
    } finally {
      setIsLoading(false);
      setQueueStatus(null);
    }
  };

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = e => {
      const content = e.target?.result as string;
      if (content) {
        setResumeContent(content);
        toast.success(`Loaded "${file.name}" (${content.length} characters)`);
      }
    };
    reader.readAsText(file);
  };

  const renderMarkdown = (text: string) => {
    const lines = text.split('\n');
    const nodes: React.ReactNode[] = [];
    let inCode = false;
    let codeBuffer = '';

    lines.forEach((line, idx) => {
      if (line.startsWith('```')) {
        if (inCode) {
          const codeSnippet = codeBuffer;
          nodes.push(
            <div key={`code-${idx}`} className="relative my-3 group">
              <div className="flex items-center justify-between px-3 py-1 bg-secondary/80 border-t border-x border-border/40 rounded-t-lg text-[11px] font-mono text-muted-foreground">
                <span>Code Example</span>
                <button
                  onClick={() => copyToClipboard(codeSnippet, `code-${idx}`)}
                  className="flex items-center gap-1 text-[10px] hover:text-primary transition-colors"
                >
                  {copiedId === `code-${idx}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedId === `code-${idx}` ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <pre className="p-3 bg-secondary/40 border border-border/40 rounded-b-lg overflow-x-auto text-xs font-mono text-accent leading-relaxed notranslate" translate="no">
                <code>{codeSnippet}</code>
              </pre>
            </div>
          );
          codeBuffer = '';
        }
        inCode = !inCode;
        return;
      }

      if (inCode) {
        codeBuffer += line + '\n';
        return;
      }

      if (line.startsWith('### ')) {
        nodes.push(
          <h3 key={idx} className="text-sm font-bold text-foreground mt-4 mb-1.5 flex items-center gap-1.5">
            {line.replace('### ', '')}
          </h3>
        );
      } else if (line.startsWith('## ')) {
        nodes.push(
          <h2 key={idx} className="text-base font-bold text-primary mt-5 mb-2 border-b border-border/30 pb-1 flex items-center gap-2">
            {line.replace('## ', '')}
          </h2>
        );
      } else if (line.startsWith('# ')) {
        nodes.push(
          <h1 key={idx} className="text-lg font-black text-foreground mt-4 mb-2">
            {line.replace('# ', '')}
          </h1>
        );
      } else if (line.startsWith('- ')) {
        const itemContent = line.slice(2);
        nodes.push(
          <li key={idx} className="ml-4 text-xs text-muted-foreground mb-1 list-disc leading-relaxed">
            <span dangerouslySetInnerHTML={{ __html: formatInline(itemContent) }} />
          </li>
        );
      } else if (line.trim()) {
        nodes.push(
          <p key={idx} className="text-xs text-muted-foreground mb-2 leading-relaxed">
            <span dangerouslySetInnerHTML={{ __html: formatInline(line) }} />
          </p>
        );
      }
    });

    return <div>{nodes}</div>;
  };

  const escapeHtml = (str: string) =>
    str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');

  const formatInline = (str: string) => {
    return escapeHtml(str)
      .replace(/`([^`]+)`/g, '<code class="bg-secondary/70 px-1.5 py-0.5 rounded text-accent font-mono text-[11px] notranslate" translate="no">$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong class="text-foreground font-semibold">$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em class="text-muted-foreground italic">$1</em>');
  };

  return (
    <div className="h-[calc(100dvh-96px)] md:h-[calc(100vh-40px)] flex flex-col bg-background overflow-hidden">
      {/* Top Unified Header */}
      <header className="flex items-center justify-between px-3 py-2 sm:px-4 sm:py-2.5 glass-card border-b border-border/40 shrink-0 gap-2">
        {/* Brand / Mode Indicator */}
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20 text-primary-foreground font-bold shrink-0">
            <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h1 className="text-xs sm:text-sm font-bold text-foreground truncate">AI Mentor &amp; Teacher</h1>
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-mono font-semibold shrink-0">
                PRO
              </span>
            </div>
            <p className="text-[9px] text-muted-foreground truncate hidden sm:block">
              CodeSage Neural Core · Teacher Punk
            </p>
          </div>
        </div>

        {/* Center: Desktop Mode Switcher (Saves an entire row of height) */}
        <div className="hidden md:flex items-center p-0.5 bg-secondary/60 rounded-xl border border-border/40">
          <button
            onClick={() => setMode('professor')}
            className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              mode === 'professor'
                ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/20'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary/80'
            }`}
          >
            <BookOpen className="w-3 h-3 shrink-0" />
            <span>Professor</span>
            <span className="text-[9px] opacity-70 ml-0.5 font-mono">1c</span>
          </button>

          <button
            onClick={() => setMode('interviewer')}
            className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              mode === 'interviewer'
                ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/20'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary/80'
            }`}
          >
            <UserCheck className="w-3 h-3 shrink-0" />
            <span>Interviewer</span>
            <span className="text-[8px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono font-bold shrink-0">Soon</span>
          </button>

          <button
            onClick={() => setMode('counselor')}
            className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              mode === 'counselor'
                ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/20'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary/80'
            }`}
          >
            <Briefcase className="w-3 h-3 shrink-0" />
            <span>Counselor</span>
            <span className="text-[8px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono font-bold shrink-0">Soon</span>
          </button>
        </div>

        {/* Right side: Clickable Live Balance Checker */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            type="button"
            onClick={async () => {
              const bal = await fetchUserAiCredits();
              setCredits(bal);
              toast.success(`Verified: ${bal} / 5 monthly credits active in your account`);
            }}
            title="Click to check & sync live credit balance from database"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/25 hover:bg-primary/20 text-primary text-[11px] sm:text-xs font-mono font-semibold transition-all cursor-pointer group"
          >
            <Sparkle className="w-3 h-3 fill-primary" />
            <span className="sm:hidden">{credits}/5 Cr</span>
            <span className="hidden sm:inline">{credits} / 5 Monthly Credits</span>
            <RefreshCw className="w-2.5 h-2.5 opacity-60 group-hover:rotate-180 group-hover:opacity-100 transition-all" />
          </button>

          <div className="hidden lg:flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
            <ShieldCheck className="w-3 h-3" />
            <span>Proxy Active</span>
          </div>
        </div>
      </header>

      {/* Mobile-only compact mode switcher (hidden on md+ screens) */}
      <div className="md:hidden flex items-center justify-center px-2 py-1 bg-card/40 border-b border-border/30 shrink-0">
        <div className="grid grid-cols-3 gap-1 w-full max-w-sm p-0.5 bg-secondary/60 rounded-xl border border-border/40">
          <button
            onClick={() => setMode('professor')}
            className={`flex items-center justify-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold transition-all ${
              mode === 'professor'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground'
            }`}
          >
            <BookOpen className="w-3 h-3 shrink-0" />
            <span>Professor</span>
            <span className="text-[9px] opacity-70">1c</span>
          </button>

          <button
            onClick={() => setMode('interviewer')}
            className={`flex items-center justify-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold transition-all ${
              mode === 'interviewer'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground'
            }`}
          >
            <UserCheck className="w-3 h-3 shrink-0" />
            <span>Interviewer</span>
            <span className="text-[8px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono font-bold">Soon</span>
          </button>

          <button
            onClick={() => setMode('counselor')}
            className={`flex items-center justify-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold transition-all ${
              mode === 'counselor'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground'
            }`}
          >
            <Briefcase className="w-3 h-3 shrink-0" />
            <span>Counselor</span>
            <span className="text-[8px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono font-bold">Soon</span>
          </button>
        </div>
      </div>


      {/* Live Queue Notice Banner */}
      {queueStatus && (
        <div className="bg-primary/10 border-b border-primary/20 px-4 py-1.5 flex items-center justify-center gap-2 text-xs text-primary font-medium animate-pulse shrink-0">
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          <span>{queueStatus}</span>
        </div>
      )}

      {/* Main Mode Body */}
      <div className="flex-1 overflow-hidden flex flex-col min-h-0">
        {/* ================= MODE 1: PROFESSOR ("TEACHER PUNK") ================= */}
        {mode === 'professor' && (
          <div className="flex-1 flex flex-col min-h-0">
            {/* Suggestion Chips: Displayed only during initial welcome state so active chat has 100% of height */}
            {messages.length <= 1 && (
              <div className="px-4 py-2 bg-card/20 border-b border-border/20 overflow-x-auto flex items-center gap-2 shrink-0 no-scrollbar">
                <span className="text-[10px] text-muted-foreground font-mono shrink-0 flex items-center gap-1">
                  <Globe2 className="w-3 h-3 text-primary" /> Ask in any language:
                </span>
                <button
                  onClick={() => setInputQuery('Flexbox layout explain karo with real world examples')}
                  className="text-[10px] px-2 py-1 rounded-md bg-secondary/60 hover:bg-secondary text-muted-foreground hover:text-foreground shrink-0 border border-border/30 transition-colors"
                >
                  Roman Urdu: Flexbox explain karo
                </button>
                <button
                  onClick={() => setInputQuery('Explain SQL Joins with diagrams and code')}
                  className="text-[10px] px-2 py-1 rounded-md bg-secondary/60 hover:bg-secondary text-muted-foreground hover:text-foreground shrink-0 border border-border/30 transition-colors"
                >
                  SQL Joins deep dive
                </button>
                <button
                  onClick={() => setInputQuery('Explain Python async/await vs threading')}
                  className="text-[10px] px-2 py-1 rounded-md bg-secondary/60 hover:bg-secondary text-muted-foreground hover:text-foreground shrink-0 border border-border/30 transition-colors"
                >
                  Python async/await
                </button>
              </div>
            )}

            {/* Chat message history */}
            <div ref={chatScrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
              {messages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex gap-3 max-w-3xl ${
                    msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                      msg.sender === 'user'
                        ? 'bg-secondary text-foreground'
                        : 'bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-md shadow-primary/20'
                    }`}
                  >
                    {msg.sender === 'user' ? 'Me' : <Bot className="w-4 h-4" />}
                  </div>

                  <div
                    className={`rounded-2xl p-4 text-xs leading-relaxed max-w-[85vw] sm:max-w-xl ${
                      msg.sender === 'user'
                        ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                        : 'bg-card/70 border border-border/40 text-foreground backdrop-blur-md shadow-sm'
                    }`}
                  >
                    {msg.groundedLesson && (
                      <div className="mb-2 p-2 rounded-lg bg-secondary/50 border border-primary/20 flex items-center justify-between text-[10px]">
                        <span className="text-primary font-semibold">
                          📚 Grounded from: {msg.groundedLesson.track} — {msg.groundedLesson.title}
                        </span>
                        <span className="text-muted-foreground font-mono">0 Hallucination</span>
                      </div>
                    )}
                    {msg.sender === 'assistant' ? (
                      renderMarkdown(msg.text)
                    ) : (
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                    )}
                    <div className="mt-1 text-[9px] opacity-60 text-right font-mono">{msg.timestamp}</div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-3 max-w-xl mr-auto animate-in fade-in">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground shadow-md">
                    <Bot className="w-4 h-4 animate-bounce" />
                  </div>
                  <div className="bg-card/70 border border-border/40 rounded-2xl p-4 text-xs text-muted-foreground flex items-center gap-2">
                    <Loader2 className="w-4 h-4 text-primary animate-spin" />
                    <span>Teacher Punk is formulating your note-type guide...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Choose from CodeSage Lessons Bar */}
            <div className="px-3 py-1.5 bg-card/50 border-t border-border/20 flex flex-wrap items-center justify-between gap-2 text-[11px] shrink-0">
              {activeGroundedLesson ? (
                <div className="flex items-center gap-1.5 min-w-0 flex-1">
                  <span className="px-2 py-0.5 rounded-md bg-primary/15 border border-primary/30 text-primary font-semibold text-[10px] flex items-center gap-1 shrink-0">
                    <BookOpen className="w-3 h-3" />
                    Grounded:
                  </span>
                  <span className="font-medium text-foreground truncate text-[11px]">
                    <span className="text-primary/80 font-mono text-[10px]">[{activeGroundedLesson.track}]</span> {activeGroundedLesson.title}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedTrackId(null);
                      setLessonFilterText('');
                      setIsLessonModalOpen(true);
                    }}
                    className="text-[10px] text-primary hover:underline ml-1 shrink-0 font-medium"
                  >
                    Change
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveGroundedLesson(null)}
                    className="p-0.5 text-muted-foreground hover:text-destructive rounded hover:bg-secondary shrink-0"
                    title="Remove lesson grounding"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedTrackId(null);
                    setLessonFilterText('');
                    setIsLessonModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-secondary/70 hover:bg-secondary border border-border/40 text-[11px] text-foreground font-medium transition-colors hover:border-primary/40 shadow-sm"
                >
                  <BookOpen className="w-3.5 h-3.5 text-primary" />
                  <span className="hidden sm:inline">Choose from CodeSage Lessons (All Tracks)</span>
                  <span className="sm:hidden">Choose Lesson Grounding</span>
                  <ChevronRight className="w-3 h-3 text-muted-foreground ml-1" />
                </button>
              )}

              <div className="hidden sm:flex items-center gap-1 text-[10px] text-muted-foreground font-mono">
                <span>Curriculum-Grounded Engine</span>
              </div>
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-card/60 border-t border-border/40 shrink-0">
              <form
                onSubmit={e => {
                  e.preventDefault();
                  handleProfessorSubmit();
                }}
                className="flex items-center gap-2 max-w-4xl mx-auto"
              >
                <input
                  type="text"
                  value={inputQuery}
                  onChange={e => setInputQuery(e.target.value)}
                  placeholder="Ask Teacher Punk anything (e.g. 'Explain CSS Grid', 'What are Pointers in C?')..."
                  disabled={isLoading}
                  className="flex-1 bg-secondary/50 text-foreground text-xs rounded-xl px-4 py-2.5 border border-border/40 focus:outline-none focus:border-primary placeholder:text-muted-foreground/60 transition-colors"
                />
                <button
                  type="submit"
                  disabled={isLoading || !inputQuery.trim()}
                  className="bg-gradient-to-r from-primary to-accent text-primary-foreground px-4 py-2.5 rounded-xl font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-primary/20 hover:opacity-90 disabled:opacity-40 transition-all shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Ask</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ================= MODE 2: INTERVIEWER (MOCK TEST) ================= */}
        {mode === 'interviewer' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 min-h-0 space-y-5 max-w-4xl mx-auto w-full">
            {/* Coming Soon Notice Banner */}
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 shrink-0 text-amber-400 animate-pulse" />
                <span>
                  <strong>Coming Soon!</strong> AI Technical Interviewer is currently in training. You can preview and set your options below—active scoring unlocks in the next update!
                </span>
              </div>
              <button
                onClick={() => setMode('professor')}
                className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-colors"
              >
                Switch to Professor
              </button>
            </div>

            {/* Interviewer Persona Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-card/80 to-secondary/40 border border-primary/20 shadow-md">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center shrink-0 text-primary">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
                    Staff Technical Interviewer
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
                      Strict Mode
                    </span>
                  </h2>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    "We don't have time to waste. Tell me your language/course and introduce yourself. Be serious, don't cheat—this is for your future career. Don't say 'Hey hello', just state your course and introduce yourself professionally."
                  </p>
                </div>
              </div>
            </div>

            {/* STEP 1: CANDIDATE INTRODUCTION */}
            {interviewStep === 'intro' && (
              <div className="glass-card rounded-2xl p-5 border border-border/40 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Target Course / Tech Stack:
                  </label>
                  <select
                    value={interviewTrack}
                    onChange={e => setInterviewTrack(e.target.value)}
                    className="w-full bg-secondary/60 text-foreground text-xs rounded-xl px-3 py-2.5 border border-border/40 focus:outline-none focus:border-primary"
                  >
                    <option value="Frontend Web Development (HTML/CSS/JavaScript/React)">Frontend Web Dev (HTML, CSS, JS, React)</option>
                    <option value="Full Stack Engineering (React, Node.js, Express, Postgres)">Full Stack Engineering (React, Node.js, Express)</option>
                    <option value="Python Backend & Algorithms">Python Backend & Algorithms</option>
                    <option value="SQL & Relational Database Engineering">SQL & Database Architecture</option>
                    <option value="Java Enterprise & Spring Boot">Java Enterprise Development</option>
                    <option value="C & C++ Systems Programming">C & C++ Systems Programming</option>
                    <option value="AI Fundamentals & Machine Learning Concepts">AI Fundamentals & LLMs</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">
                    Professional Self-Introduction (Pitch yourself as a professional engineer):
                  </label>
                  <textarea
                    rows={4}
                    value={candidateIntro}
                    onChange={e => setCandidateIntro(e.target.value)}
                    placeholder="E.g. 'I am a passionate frontend engineer with strong fundamentals in React, TypeScript, and modern responsive design. I have built full-scale web applications, optimized component rendering, and integrated REST APIs...'"
                    className="w-full bg-secondary/50 text-foreground text-xs rounded-xl p-3 border border-border/40 focus:outline-none focus:border-primary placeholder:text-muted-foreground/60 leading-relaxed"
                  />
                  <span className="text-[10px] text-muted-foreground">
                    State your background, core technical strengths, and what you build.
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    toast.info("Coming Soon! Technical Interviewer is currently in training. Your settings are preserved. Use Professor mode for questions!");
                  }}
                  className="w-full py-3 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-semibold text-xs flex items-center justify-center gap-2 shadow-sm hover:bg-amber-500/30 transition-all cursor-pointer"
                >
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>Coming Soon — Mock Interview in Training (Settings Saved)</span>
                </button>
              </div>
            )}

            {/* STEP 2: MOCK TEST QUESTIONS (NO ANSWERS REVEALED) */}
            {interviewStep === 'test' && mockTest && (
              <div className="space-y-4 animate-in fade-in">
                {/* Intro Feedback */}
                <div className="p-3.5 rounded-xl bg-primary/10 border border-primary/20 text-xs">
                  <div className="font-semibold text-primary mb-1 flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4" />
                    <span>Interviewer Note on Your Introduction:</span>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">{mockTest.introFeedback}</p>
                </div>

                <div className="text-xs font-semibold text-foreground flex items-center justify-between">
                  <span>Technical Questions ({mockTest.questions.length}) — No answers are revealed!</span>
                  <span className="text-muted-foreground font-mono text-[10px]">Take your time</span>
                </div>

                {mockTest.questions.map((q, i) => (
                  <div key={q.id} className="glass-card rounded-2xl p-4 border border-border/40 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-secondary text-primary border border-border/30">
                        Question #{i + 1} • {q.topic}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-foreground leading-relaxed">{q.question}</p>
                    <textarea
                      rows={3}
                      value={candidateAnswers[q.id] || ''}
                      onChange={e => setCandidateAnswers({ ...candidateAnswers, [q.id]: e.target.value })}
                      placeholder="Type your technical answer here. Explain the logic, data flow, or code solution..."
                      className="w-full bg-secondary/50 text-foreground text-xs rounded-xl p-3 border border-border/40 focus:outline-none focus:border-primary placeholder:text-muted-foreground/60 leading-relaxed"
                    />
                  </div>
                ))}

                <div className="flex gap-3">
                  <button
                    onClick={() => setInterviewStep('intro')}
                    className="px-4 py-2.5 rounded-xl bg-secondary text-muted-foreground hover:text-foreground text-xs font-medium transition-colors"
                  >
                    Back to Intro
                  </button>
                  <button
                    onClick={handleSubmitInterviewAnswers}
                    disabled={isLoading}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 hover:opacity-90 disabled:opacity-50 transition-all"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Evaluating Your Answers...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Submit Mock Interview for Grading</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: EVALUATION REPORT */}
            {interviewStep === 'evaluation' && evaluationReport && (
              <div className="glass-card rounded-2xl p-6 border border-border/40 space-y-5 animate-in fade-in">
                <div className="flex items-center justify-between pb-3 border-b border-border/30">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    <h3 className="text-sm font-bold text-foreground">Interview Evaluation Scorecard</h3>
                  </div>
                  <button
                    onClick={() => {
                      setInterviewStep('intro');
                      setCandidateAnswers({});
                      setMockTest(null);
                    }}
                    className="text-xs text-primary hover:underline flex items-center gap-1 font-semibold"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Start New Mock Interview</span>
                  </button>
                </div>

                <div className="text-xs leading-relaxed text-foreground">
                  {renderMarkdown(evaluationReport)}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= MODE 3: COUNSELOR (CV & CAREER ADVISOR) ================= */}
        {mode === 'counselor' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 min-h-0 space-y-5 max-w-4xl mx-auto w-full">
            {/* Coming Soon Notice Banner */}
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 shrink-0 text-amber-400 animate-pulse" />
                <span>
                  <strong>Coming Soon!</strong> Tech Career & CV Counselor is currently being calibrated with market standards. You can preview role and resume settings below!
                </span>
              </div>
              <button
                onClick={() => setMode('professor')}
                className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-colors"
              >
                Switch to Professor
              </button>
            </div>

            {/* Header Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-card/80 to-secondary/40 border border-primary/20 shadow-md">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center shrink-0 text-primary">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
                    Tech Career & CV Counselor
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                      1 Credit
                    </span>
                  </h2>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    Upload or paste your resume and tell me the role you want. I'll inspect what's strong, what's hurting your chances, what you must add, and your step-by-step next learning path.
                  </p>
                </div>
              </div>
            </div>

            {/* Target Role & Resume Input Card */}
            <div className="glass-card rounded-2xl p-5 border border-border/40 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Target Position You Want to Apply For:
                </label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={e => setTargetRole(e.target.value)}
                  placeholder="e.g. Junior Frontend React Developer, Python Backend Engineer, Full Stack Freelancer"
                  className="w-full bg-secondary/50 text-foreground text-xs rounded-xl px-3 py-2.5 border border-border/40 focus:outline-none focus:border-primary"
                />
              </div>

              {/* Resume File Dropzone */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Drop Your Resume (or paste text below):
                </label>
                <div
                  onDragOver={e => {
                    e.preventDefault();
                    setIsDraggingFile(true);
                  }}
                  onDragLeave={() => setIsDraggingFile(false)}
                  onDrop={e => {
                    e.preventDefault();
                    setIsDraggingFile(false);
                    const file = e.dataTransfer.files?.[0];
                    if (file) handleFileUpload(file);
                  }}
                  className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all ${
                    isDraggingFile
                      ? 'border-primary bg-primary/10'
                      : 'border-border/60 hover:border-primary/50 bg-secondary/20'
                  }`}
                  onClick={() => document.getElementById('resume-file-input')?.click()}
                >
                  <input
                    id="resume-file-input"
                    type="file"
                    accept=".txt,.md,.json,.pdf"
                    className="hidden"
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file);
                    }}
                  />
                  <Upload className="w-6 h-6 text-primary mx-auto mb-1.5 opacity-80" />
                  <p className="text-xs font-semibold text-foreground">
                    Click to upload or drag & drop your resume (.txt, .md)
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    Plain text / Markdown files recommended
                  </p>
                </div>
              </div>

              {/* Textarea for resume content */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Resume Content:
                </label>
                <textarea
                  rows={6}
                  value={resumeContent}
                  onChange={e => setResumeContent(e.target.value)}
                  placeholder="Paste your resume sections here (Summary, Skills, Projects, Experience, Education)..."
                  className="w-full bg-secondary/50 text-foreground text-xs rounded-xl p-3 border border-border/40 focus:outline-none focus:border-primary placeholder:text-muted-foreground/60 leading-relaxed font-mono"
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  toast.info("Coming Soon! Career Counselor mode will activate in the next update. Your settings are preserved. Use Professor mode for questions!");
                }}
                className="w-full py-3 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-semibold text-xs flex items-center justify-center gap-2 shadow-sm hover:bg-amber-500/30 transition-all cursor-pointer"
              >
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Coming Soon — Career Counselor in Training (Settings Saved)</span>
              </button>
            </div>

            {/* Counselor Review Report Output */}
            {counselorFeedback && (
              <div className="glass-card rounded-2xl p-6 border border-border/40 space-y-4 animate-in fade-in">
                <div className="flex items-center justify-between pb-3 border-b border-border/30">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    <h3 className="text-sm font-bold text-foreground">
                      Career Counselor Review for {targetRole}
                    </h3>
                  </div>
                  <button
                    onClick={() => copyToClipboard(counselorFeedback, 'counselor-report')}
                    className="text-xs text-primary hover:underline flex items-center gap-1 font-semibold"
                  >
                    {copiedId === 'counselor-report' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === 'counselor-report' ? 'Copied' : 'Copy Report'}</span>
                  </button>
                </div>

                <div className="text-xs leading-relaxed text-foreground">
                  {renderMarkdown(counselorFeedback)}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 2-Tier CodeSage Curriculum Picker Dialog */}
      <Dialog open={isLessonModalOpen} onOpenChange={setIsLessonModalOpen}>
        <DialogContent className="glass-card border-primary/30 w-[94vw] sm:max-w-2xl max-h-[85vh] flex flex-col p-4 sm:p-6 overflow-hidden">
          <DialogHeader className="shrink-0 mb-3">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  {selectedTrackId ? 'Select Lesson to Ground' : 'Choose CodeSage Track'}
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                  {selectedTrackId
                    ? 'Click any lesson to inject verified curriculum theory, memory mechanics, and code patterns into Teacher Punk.'
                    : 'Select one track to view all of its lessons, then choose your topic.'}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {/* Search bar */}
          <div className="relative mb-3 shrink-0">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={lessonFilterText}
              onChange={e => setLessonFilterText(e.target.value)}
              placeholder={
                selectedTrackId
                  ? 'Filter lessons in this track (e.g., flexbox, pointers, join, async)...'
                  : 'Search tracks or lessons across all 18 tracks...'
              }
              className="w-full pl-9 pr-8 py-2 bg-secondary/50 text-foreground text-xs rounded-xl border border-border/40 focus:outline-none focus:border-primary placeholder:text-muted-foreground/60 transition-colors"
            />
            {lessonFilterText && (
              <button
                type="button"
                onClick={() => setLessonFilterText('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto pr-1 space-y-2 min-h-0">
            {selectedTrackId ? (
              /* LEVEL 2: LESSONS IN SELECTED TRACK */
              <div>
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-border/30">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedTrackId(null);
                      setLessonFilterText('');
                    }}
                    className="inline-flex items-center gap-1 text-xs text-primary hover:underline font-semibold"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    All Tracks
                  </button>
                  <span className="text-[11px] font-mono text-muted-foreground px-2 py-0.5 rounded bg-secondary/60">
                    {allTracks.find(t => t.id === selectedTrackId)?.name} (
                    {allTracks.find(t => t.id === selectedTrackId)?.lessons.length} lessons)
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-1.5">
                  {allTracks
                    .find(t => t.id === selectedTrackId)
                    ?.lessons.filter(l => {
                      if (!lessonFilterText.trim()) return true;
                      const q = lessonFilterText.toLowerCase();
                      return (
                        l.title.toLowerCase().includes(q) ||
                        (l.topic && l.topic.toLowerCase().includes(q)) ||
                        l.id.toLowerCase().includes(q)
                      );
                    })
                    .map(lesson => (
                      <button
                        key={lesson.id}
                        type="button"
                        onClick={() => {
                          const grounded = getLessonByIdAndTrack(selectedTrackId, lesson.id);
                          if (grounded) {
                            setActiveGroundedLesson(grounded);
                            setInputQuery(
                              `Explain Lesson: "${lesson.title}" with deep architectural mental models, complete production-grade code, runtime mechanics, and common pitfalls.`
                            );
                            setIsLessonModalOpen(false);
                            toast.success(`Grounded in: ${lesson.title}`);
                          }
                        }}
                        className="text-left p-2.5 rounded-xl bg-secondary/30 hover:bg-secondary/80 border border-border/30 hover:border-primary/40 transition-all flex items-center justify-between group"
                      >
                        <div className="min-w-0 pr-3">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-[10px] font-mono text-primary/70 shrink-0 font-bold">
                              #{String(lesson.order).padStart(2, '0')}
                            </span>
                            <span className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                              {lesson.title}
                            </span>
                          </div>
                          {lesson.topic && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-card/60 text-muted-foreground font-mono">
                              {lesson.topic}
                            </span>
                          )}
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
                      </button>
                    ))}
                </div>
              </div>
            ) : (
              /* LEVEL 1: ALL TRACKS */
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {allTracks
                  .filter(track => {
                    if (!lessonFilterText.trim()) return true;
                    const q = lessonFilterText.toLowerCase();
                    return (
                      track.name.toLowerCase().includes(q) ||
                      track.lessons.some(l => l.title.toLowerCase().includes(q) || (l.topic && l.topic.toLowerCase().includes(q)))
                    );
                  })
                  .map(track => (
                    <button
                      key={track.id}
                      type="button"
                      onClick={() => {
                        setSelectedTrackId(track.id);
                        setLessonFilterText('');
                      }}
                      className="text-left p-3 rounded-xl bg-secondary/40 hover:bg-secondary/90 border border-border/30 hover:border-primary/40 transition-all flex items-center justify-between group"
                    >
                      <div className="min-w-0 pr-2">
                        <div className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors truncate mb-1">
                          {track.name}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 font-semibold">
                            {track.badge}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
                    </button>
                  ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}
