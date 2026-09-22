// AI Teacher & Mentorship Service
// Proxies inference securely through Supabase Edge Function ("ai-teacher")
// Backend manages:
// 1. GROQ_API_KEY stored securely in Supabase Secrets (never exposed to browser)
// 2. 5 Monthly AI Credits per student (enforced in Supabase database)
// 3. Cheapest Groq model: llama-3.1-8b-instant ($0.05/1M tokens, ultra-fast & low compute)
// 4. Concurrency lock (1 active call at a time with queue notifications)
// 5. Curriculum grounding from src/data (reduces token load and eliminates hallucinations)

import { supabase } from '@/integrations/supabase/client';
import { getAllLessons } from '@/data/lessons';
import { NETWORKING_LESSONS } from '@/data/networkingLessons';
import { PYTHON_LESSONS } from '@/data/pythonLessons';
import { PYTHON_EXPERT_LESSONS } from '@/data/pythonExpertLessons';
import { SQL_LESSONS } from '@/data/sqlLessons';
import { FULLSTACK_LESSONS } from '@/data/fullstackLessons';
import { AI_LESSONS } from '@/data/aiFundamentalsLesson';
import { INTERMEDIATE_AI_LESSONS } from '@/data/intermediateAiLesson';
import { C_LESSONS } from '@/data/cLessons';
import { C_EXPERT_LESSONS } from '@/data/cExpertLessons';
import { CPP_LESSONS } from '@/data/cppLessons';
import { CPP_EXPERT_LESSONS } from '@/data/cppExpertLessons';
import { JAVA_LESSONS } from '@/data/javaLesson';
import { JAVA_EXPERT_LESSONS } from '@/data/javaExpertLessons';
import { THREE3D_LESSONS } from '@/data/three3dLessons';
import { FREELANCE_LESSONS } from '@/data/freelanceLessons';
import { REAL_FREELANCE_LESSONS } from '@/data/realfreelanceLesson';
import { LOCAL_LESSONS } from '@/data/localLessons';

export type AiTeacherMode = 'professor' | 'interviewer' | 'counselor';

export interface GroundedLesson {
  id: string;
  title: string;
  track: string;
  topic?: string;
  summary: string;
}

export interface TrackLessonItem {
  id: string;
  title: string;
  topic?: string;
  order: number;
}

export interface TrackCategory {
  id: string;
  name: string;
  badge: string;
  icon: string;
  lessons: TrackLessonItem[];
}

// Global Concurrency Lock & Queue (1 call at a time)
let activeCallCount = 0;
const callQueue: (() => void)[] = [];

export function isAiCallInProgress(): boolean {
  return activeCallCount > 0;
}

export function getQueueLength(): number {
  return callQueue.length;
}

async function acquireCallSlot(onQueueStatus?: (message: string) => void): Promise<() => void> {
  if (activeCallCount === 0) {
    activeCallCount = 1;
    return () => {
      activeCallCount = 0;
      if (callQueue.length > 0) {
        const next = callQueue.shift();
        if (next) next();
      }
    };
  }

  // Already in progress, enqueue with notification
  if (onQueueStatus) {
    onQueueStatus(`You are in queue (Position #${callQueue.length + 1}). Waiting for active AI generation to complete...`);
  }

  return new Promise((resolve) => {
    callQueue.push(() => {
      activeCallCount = 1;
      resolve(() => {
        activeCallCount = 0;
        if (callQueue.length > 0) {
          const next = callQueue.shift();
          if (next) next();
        }
      });
    });
  });
}

// Fallback / Cache key for local sync
const STORAGE_KEY_CREDITS = 'codesage_ai_credits';

export async function fetchUserAiCredits(): Promise<number> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      const now = new Date();
      const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('ai_credits, ai_credits_month, is_pro')
        .eq('id', session.user.id)
        .maybeSingle();

      if (!error && data) {
        // If credits already exist in the database, prioritize preserving user's balance
        if (typeof data.ai_credits === 'number') {
          // Only reset to monthly default if explicitly marked from an older month
          if (data.ai_credits_month && data.ai_credits_month !== currentMonth) {
            const monthlyDefault = data.is_pro ? 100 : 5;
            localStorage.setItem(STORAGE_KEY_CREDITS, String(monthlyDefault));
            return monthlyDefault;
          }
          localStorage.setItem(STORAGE_KEY_CREDITS, String(data.ai_credits));
          return data.ai_credits;
        }

        // Fresh profile initialization (5 free credits for normal, 100 for pro)
        const monthlyDefault = data.is_pro ? 100 : 5;
        localStorage.setItem(STORAGE_KEY_CREDITS, String(monthlyDefault));
        return monthlyDefault;
      }
    }
  } catch (e) {
    console.warn('Failed to fetch AI credits from Supabase, using local cache:', e);
  }

  // Local fallback
  const cached = localStorage.getItem(STORAGE_KEY_CREDITS);
  return cached !== null ? Math.max(0, parseInt(cached, 10)) : 5;
}

export function getCachedAiCredits(): number {
  try {
    const cached = localStorage.getItem(STORAGE_KEY_CREDITS);
    return cached !== null ? Math.max(0, parseInt(cached, 10)) : 5;
  } catch {
    return 5;
  }
}

export function updateCachedCredits(newBalance: number): void {
  try {
    localStorage.setItem(STORAGE_KEY_CREDITS, String(newBalance));
  } catch {
    // ignore storage errors
  }
}

function extractDeepLessonContent(l: any): string {
  if (!l) return '';
  const parts: string[] = [];
  if (l.title) parts.push(`Title: ${l.title}`);
  if (l.topic || l.module) parts.push(`Topic / Module: ${l.topic || l.module}`);
  if (l.objective || l.description) parts.push(`Learning Objective: ${l.objective || l.description}`);

  const rawText = l.content || l.theory || l.explanation || '';
  if (rawText) {
    parts.push(`Core Theory & Syllabus Material:\n${rawText.slice(0, 2400).trim()}`);
  }

  const sampleCode = l.code || l.starterCode || l.initialCode || l.solutionCode || l.exampleCode;
  if (sampleCode && typeof sampleCode === 'string') {
    parts.push(`Curriculum Code Pattern:\n\`\`\`\n${sampleCode.slice(0, 900).trim()}\n\`\`\``);
  }

  if (Array.isArray(l.keyTakeaways) && l.keyTakeaways.length > 0) {
    parts.push(`Key Architecture Takeaways:\n${l.keyTakeaways.map((t: string) => `- ${t}`).join('\n')}`);
  }

  return parts.join('\n\n');
}

// Track registry mapping for all 18 tracks
const TRACK_CATALOG_DEFS: { id: string; name: string; badge: string; icon: string; list: any[] }[] = [
  { id: 'frontend', name: 'Frontend Web Development', badge: '54 Lessons', icon: 'Globe', list: getAllLessons() },
  { id: 'python', name: 'Python Core & OOP', badge: '32 Lessons', icon: 'Code2', list: PYTHON_LESSONS },
  { id: 'pythonexpert', name: 'Python Expert Systems', badge: '16 Lessons', icon: 'Cpu', list: PYTHON_EXPERT_LESSONS },
  { id: 'sql', name: 'SQL & Relational Databases', badge: '25 Lessons', icon: 'Database', list: SQL_LESSONS },
  { id: 'networking', name: 'Computer Systems & Networks', badge: '15 Lessons', icon: 'Network', list: NETWORKING_LESSONS },
  { id: 'fullstack', name: 'Full Stack Engineering', badge: '29 Lessons', icon: 'Layers', list: FULLSTACK_LESSONS },
  { id: 'c', name: 'Systems Programming in C', badge: '25 Lessons', icon: 'Binary', list: C_LESSONS },
  { id: 'cexpert', name: 'Advanced Low-Level C', badge: '16 Lessons', icon: 'Cpu', list: C_EXPERT_LESSONS },
  { id: 'cpp', name: 'Modern C++ Engineering', badge: '40 Lessons', icon: 'Zap', list: CPP_LESSONS },
  { id: 'cppexpert', name: 'Advanced C++ (C++ Expert)', badge: '16 Lessons', icon: 'Sparkles', list: CPP_EXPERT_LESSONS },
  { id: 'java', name: 'Enterprise Java Programming', badge: '36 Lessons', icon: 'Coffee', list: JAVA_LESSONS },
  { id: 'javaexpert', name: 'Advanced Java Systems', badge: '16 Lessons', icon: 'Shield', list: JAVA_EXPERT_LESSONS },
  { id: 'ai-fundamentals', name: 'AI Fundamentals & Neural Models', badge: '14 Lessons', icon: 'Bot', list: AI_LESSONS },
  { id: 'intermediate-ai', name: 'Intermediate Applied GenAI', badge: '10 Lessons', icon: 'BrainCircuit', list: INTERMEDIATE_AI_LESSONS },
  { id: 'three3d', name: 'Interactive 3D Graphics (Three.js)', badge: '16 Lessons', icon: 'Box', list: THREE3D_LESSONS },
  { id: 'freelance', name: 'Freelancing & Technical Consulting', badge: '12 Lessons', icon: 'Briefcase', list: FREELANCE_LESSONS },
  { id: 'real-freelance', name: 'Real-World Freelance Contracts', badge: '10 Lessons', icon: 'FileText', list: REAL_FREELANCE_LESSONS },
  { id: 'local', name: 'Local-Only Runtime Engineering', badge: '8 Lessons', icon: 'HardDrive', list: LOCAL_LESSONS },
];

export function getAllTracksWithLessons(): TrackCategory[] {
  return TRACK_CATALOG_DEFS.map(track => ({
    id: track.id,
    name: track.name,
    badge: `${track.list.length} Lessons`,
    icon: track.icon,
    lessons: track.list.map((l: any, idx: number) => ({
      id: l.id,
      title: l.title,
      topic: l.topic || l.module || undefined,
      order: idx + 1,
    })),
  }));
}

export function getLessonByIdAndTrack(trackId: string, lessonId: string): GroundedLesson | null {
  const cat = TRACK_CATALOG_DEFS.find(t => t.id === trackId);
  if (!cat) return null;
  const lesson = cat.list.find((l: any) => l.id === lessonId);
  if (!lesson) return null;
  return {
    id: lesson.id,
    title: lesson.title,
    track: cat.name,
    topic: lesson.topic || lesson.module,
    summary: extractDeepLessonContent(lesson),
  };
}

// Curriculum Grounding from all 18 tracks
export function findGroundedLesson(query: string): GroundedLesson | null {
  const q = query.toLowerCase().trim();
  if (!q) return null;

  for (const track of TRACK_CATALOG_DEFS) {
    for (const l of track.list) {
      const matchId = l.id && l.id.toLowerCase() === q;
      const matchTitle = l.title && l.title.toLowerCase().includes(q);
      const matchTopic = (l.topic && l.topic.toLowerCase().includes(q)) || (l.module && l.module.toLowerCase().includes(q));

      if (matchId || matchTitle || matchTopic) {
        return {
          id: l.id,
          title: l.title,
          track: track.name,
          topic: l.topic || l.module,
          summary: extractDeepLessonContent(l),
        };
      }
    }
  }

  return null;
}

export function getAllCurriculumSummaryList(): { track: string; title: string; id: string }[] {
  const list: { track: string; title: string; id: string }[] = [];
  TRACK_CATALOG_DEFS.forEach(track => {
    track.list.slice(0, 15).forEach((l: any) => {
      list.push({ track: track.name, title: l.title, id: l.id });
    });
  });
  return list;
}

// CALL SECURE SUPABASE BACKEND (NEURAL PROXY + 5 MONTHLY CREDITS)
interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export async function callBackendAiTeacher(
  messages: Message[],
  options: {
    costCredits?: number;
    maxTokens?: number;
    temperature?: number;
    onQueueStatus?: (msg: string) => void;
  } = {}
): Promise<{ text: string; creditsRemaining: number }> {
  // Acquire concurrency queue slot (strictly 1 active call at a time)
  const releaseSlot = await acquireCallSlot(options.onQueueStatus);

  try {
    const cost = options.costCredits ?? 1;

    // Check session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) {
      throw new Error('Please log in to your account to use the AI Teacher.');
    }

    // Call Supabase Edge Function 'ai-teacher'
    const { data, error } = await supabase.functions.invoke('ai-teacher', {
      body: {
        messages,
        cost_credits: cost,
        max_tokens: options.maxTokens ?? 1400,
        temperature: options.temperature ?? 0.6,
      },
    });

    if (error) {
      let customMsg = error.message || 'AI request failed.';
      if (typeof error === 'object' && error !== null && 'context' in error) {
        try {
          const ctx = error.context as Response;
          const body = await ctx.json();
          if (body?.error) customMsg = body.error;
        } catch {
          // ignore
        }
      }

      // Check for common edge function deployment / relay issues
      if (
        customMsg.toLowerCase().includes('failed to send a request to the edge function') ||
        customMsg.toLowerCase().includes('relay failed') ||
        customMsg.toLowerCase().includes('functions fetcherror') ||
        customMsg.toLowerCase().includes('404')
      ) {
        customMsg =
          'The AI Teacher backend service is initializing or connecting. Please check your Supabase secrets configuration.';
      }

      throw new Error(customMsg);
    }

    if (!data?.content) {
      throw new Error(data?.error || 'Empty response from AI Teacher.');
    }

    const remaining = typeof data.credits_remaining === 'number' ? data.credits_remaining : 0;
    updateCachedCredits(remaining);

    return {
      text: data.content,
      creditsRemaining: remaining,
    };
  } finally {
    releaseSlot();
  }
}

// ==========================================
// MODE 1: PROFESSOR ("Teacher Punk") - 1 Credit
// ==========================================
export async function askProfessor(
  userQuery: string,
  options?: {
    lessonOverride?: GroundedLesson | null;
    onQueueStatus?: (msg: string) => void;
  }
): Promise<{ text: string; groundedLesson: GroundedLesson | null; creditsRemaining: number }> {
  const grounded = options?.lessonOverride || findGroundedLesson(userQuery);

  let groundingContext = '';
  if (grounded) {
    groundingContext = `
=========================================
OFFICIAL CODESAGE CURRICULUM SYLLABUS REFERENCE:
- Course Track: ${grounded.track}
- Module / Topic: ${grounded.topic || 'Core Engineering'}
- Lesson ID: ${grounded.id}
- Lesson Title: "${grounded.title}"

VERIFIED LESSON MATERIAL & CODE PATTERNS:
${grounded.summary}
=========================================
TEACHING DIRECTIVE: The student is asking about this lesson from our curriculum.
Use this curriculum material as your trusted foundation so your answer directly teaches what CodeSage covers, but explain it in your warm, encouraging, human teacher voice!`;
  }

  const systemPrompt = `You are "Teacher Punk", the inspiring, friendly, and beloved coding mentor at CodeSage.
Students love learning from you because you make complex programming feel easy, intuitive, and fun—like a brilliant senior developer sitting next to them with a cup of coffee and a smile.

### YOUR CORE TEACHING BEHAVIOR & STYLE:
1. TALK LIKE A REAL, ENCOURAGING TEACHER (NOT A ROBOT):
   - Always open with a warm, conversational, and motivating greeting (e.g., "Hey! Great question!", "Welcome! Let's break this down together—it's actually much simpler than it looks!").
   - Never sound like an academic textbook, a documentation crawler, or a dry compiler manual. Avoid robotic phrases like "deterministic state machines", "battle-tested production-grade", or rigid corporate documentation headers unless the student explicitly asks for deep compiler internals.
2. THE "AHA!" EVERYDAY ANALOGY:
   - When explaining any concept, always start with a relatable real-world analogy first (e.g., Human Body analogy for HTML/CSS/JS, Recipe analogy for functions, Postal Service for networking, Spreadsheet for databases).
   - Give the student an instant "Aha! Now I get it!" mental model before jumping into code.
3. CLEAN, DIGESTIBLE CODE WALKTHROUGH:
   - Provide a clean, practical, beginner-friendly code snippet that directly illustrates the concept.
   - Keep the code concise, readable, and well-commented so a student can run and modify it immediately.
4. "HOW IT WORKS" IN PLAIN ENGLISH:
   - Break down the 2-3 most important points in simple, friendly bullet points.
5. TEACHER'S PRO-TIP & COMMON MISTAKES:
   - Give 1 practical, encouraging tip or common beginner mistake to avoid (e.g., "💡 Pro-Tip: Always remember to close your tags so your layout doesn't break!").
6. INTERACTIVE CLOSING (CHECK FOR UNDERSTANDING):
   - Always end with an encouraging question or mini-challenge to keep the student engaged (e.g., "Does that make sense? Would you like to try writing a link together, or see how CSS adds colors?").
7. MULTILINGUAL & REGIONAL FLUENCY:
   - Always reply in the EXACT language or dialect the student used:
     - If the student asks in Roman Urdu (e.g., "HTML kya hai bhai", "Flexbox samjhao", "kaise use karein"), reply naturally in warm, friendly, encouraging Roman Urdu (e.g., "AOA dost! Bohot zabardast sawal hai. Asaan lafzon mein samjho...").
     - If in English, reply in natural, inspiring, conversational English.

${groundingContext}`;

  const result = await callBackendAiTeacher(
    [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userQuery },
    ],
    { costCredits: 1, maxTokens: 1400, temperature: 0.6, onQueueStatus: options?.onQueueStatus }
  );

  return { text: result.text, groundedLesson: grounded, creditsRemaining: result.creditsRemaining };
}

// ==========================================
// MODE 2: INTERVIEWER (Mock Interview) - 2 Credits
// ==========================================
export interface MockInterviewTest {
  introFeedback: string;
  questions: {
    id: number;
    question: string;
    topic: string;
  }[];
}

export async function generateMockInterview(
  track: string,
  userIntro: string,
  onQueueStatus?: (msg: string) => void
): Promise<MockInterviewTest> {
  const systemPrompt = `You are a strict, senior Technical Hiring Manager conducting a live technical interview.
You do not waste time, you do not use friendly fluff, and you demand professionalism.
Evaluate the candidate's course/stack (${track}) and their professional introduction.
You must output a strictly valid JSON object with:
1. "introFeedback": A sharp 2-3 sentence critique of their self-introduction (addressing professionalism, clarity, technical weight, and what was missing).
2. "questions": An array of EXACTLY 4 challenging technical & situational interview questions tailored to ${track}.
Do NOT provide answers! Questions must test practical ability, debugging, architectural design, and edge cases.

Format MUST be valid JSON only:
{
  "introFeedback": "string",
  "questions": [
    { "id": 1, "topic": "string", "question": "string" },
    { "id": 2, "topic": "string", "question": "string" },
    { "id": 3, "topic": "string", "question": "string" },
    { "id": 4, "topic": "string", "question": "string" }
  ]
}`;

  const userPrompt = `Course/Stack: ${track}\nCandidate Professional Introduction:\n"${userIntro}"`;

  // First step of mock interview: free preparation call or 0 credits, final evaluation takes 2 credits
  const result = await callBackendAiTeacher(
    [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    { costCredits: 0, maxTokens: 800, temperature: 0.4, onQueueStatus }
  );

  try {
    const cleaned = result.text.replace(/^```json/m, '').replace(/```$/m, '').trim();
    return JSON.parse(cleaned);
  } catch {
    return {
      introFeedback: 'Your introduction outlines your background, but lacks specific quantifiable projects, ownership details, and measurable technical impact.',
      questions: [
        { id: 1, topic: 'Core Fundamentals', question: `Explain the fundamental execution model and memory lifecycle in ${track}.` },
        { id: 2, topic: 'Debugging & Edge Cases', question: 'Describe a difficult production bug you diagnosed and the exact methodology you used.' },
        { id: 3, topic: 'System & Architecture', question: 'How do you design scalable state and asynchronous data management under high traffic?' },
        { id: 4, topic: 'Practical Problem Solving', question: 'Given an unpredictable network drop or concurrent write conflict, how do you handle idempotency?' },
      ],
    };
  }
}

export async function evaluateMockInterview(
  track: string,
  userIntro: string,
  answers: { question: string; answer: string }[],
  onQueueStatus?: (msg: string) => void
): Promise<{ report: string; creditsRemaining: number }> {
  const systemPrompt = `You are a tough, senior Technical Interviewer giving a formal post-interview evaluation report.
Be rigorous, objective, and constructive.
Format your review with clear markdown headings:
## 📋 Interview Scorecard & Hiring Recommendation
- Overall Score (0-100)
- Hiring Verdict: (Strong Hire / Hire / Weak Hire / No Hire)
- Summary Assessment

## 🗣️ Candidate Introduction Evaluation
Critique how they pitched themselves and provide an exact improved "Elevator Pitch" script they can use.

## 🔍 Detailed Question-by-Question Evaluation
For each question:
### Question X
- **What Was Correct**: Specific points they got right.
- **What Was Wrong / Lacking Depth**: Inaccuracies, missing technical terminology, or shallow reasoning.
- **Staff-Level Ideal Answer**: How a senior engineer would answer this concisely.

## 🎯 14-Day Remediation Plan
Top 3 topics they must review on CodeSage before their next real company interview.`;

  const answersFormatted = answers
    .map((a, i) => `Q${i + 1}: ${a.question}\nCandidate Answer: ${a.answer.trim() || '[No Answer Provided]'}`)
    .join('\n\n');

  const userPrompt = `Target Stack: ${track}
Candidate Intro: "${userIntro}"

Answers Submitted:
${answersFormatted}`;

  const result = await callBackendAiTeacher(
    [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    { costCredits: 2, maxTokens: 1300, temperature: 0.5, onQueueStatus }
  );

  return { report: result.text, creditsRemaining: result.creditsRemaining };
}

// ==========================================
// MODE 3: COUNSELOR (Resume Analysis) - 1 Credit
// ==========================================
export async function analyzeResumeCounselor(
  targetRole: string,
  resumeText: string,
  onQueueStatus?: (msg: string) => void
): Promise<{ review: string; creditsRemaining: number }> {
  const systemPrompt = `You are an elite Tech Career Counselor and Senior Tech Recruiter with 15+ years experience.
You evaluate resumes and provide a comprehensive, high-impact career guide for candidates wanting to break into or level up in tech.
Format your review strictly with the following 4 sections:

### 1. 🌟 What is Strong & Correct
Highlight genuine strengths in the resume (formatting, clean descriptions, strong technologies, good education/experience).

### 2. 🚨 What Needs to be Corrected (Red Flags & Flaws)
Identify passive wording, lack of metrics/numbers, ATS formatting risks, irrelevant fluff, or outdated libraries.

### 3. 🎯 What Must Be Added for "${targetRole}"
Specific skills, industry-standard keywords, high-yield tools, and 2 standout portfolio project ideas specifically designed to impress hiring managers for ${targetRole}.

### 4. 🗺️ Your Step-by-Step Next Steps & CodeSage Roadmap
Actionable plan of what to learn, build, and commit to GitHub over the next 14 days, connecting directly to real practical engineering.`;

  const userPrompt = `Target Job Position: ${targetRole}\n\nCandidate Resume / CV Content:\n"""\n${resumeText.slice(0, 3000)}\n"""`;

  const result = await callBackendAiTeacher(
    [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    { costCredits: 1, maxTokens: 1100, temperature: 0.5, onQueueStatus }
  );

  return { review: result.text, creditsRemaining: result.creditsRemaining };
}
