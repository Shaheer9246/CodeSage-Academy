export interface QuizAttempt {
  lessonId: string;
  lessonTitle?: string;
  answers: Record<number, number>;
  totalQuestions: number;
  correctCount: number;
  percentage: number;
  passed: boolean;
  missedIndices: number[];
  missedQuestionsSummary?: string[];
  timestamp: number;
}

export interface SkillHealthSummary {
  totalQuizzesTaken: number;
  averageScore: number;
  passedCount: number;
  perfectCount: number;
  weakAttempts: QuizAttempt[];
  strongAttempts: QuizAttempt[];
  recentAttempts: QuizAttempt[];
}

/**
 * Persists quiz answers and accuracy for a lesson so it can be reviewed
 * on the Lesson Complete page (or revisited later).
 */
export function saveLessonQuizAttempt(
  lessonId: string,
  answers: Record<number, number>,
  quizQuestions?: Array<{ question?: string; q?: string; correctIndex?: number; answer?: number; topic?: string }>,
  lessonTitle?: string
): QuizAttempt {
  const answerEntries = Object.entries(answers);
  const totalQuestions = quizQuestions && quizQuestions.length > 0 
    ? quizQuestions.length 
    : answerEntries.length;

  let correctCount = 0;
  const missedIndices: number[] = [];
  const missedQuestionsSummary: string[] = [];

  if (quizQuestions && quizQuestions.length > 0) {
    quizQuestions.forEach((q, idx) => {
      const correct = typeof q.correctIndex === 'number' 
        ? q.correctIndex 
        : (typeof q.answer === 'number' ? q.answer : 0);
      
      const chosen = answers[idx];
      if (chosen === correct) {
        correctCount++;
      } else {
        missedIndices.push(idx);
        const qTitle = q.question || q.q || `Question ${idx + 1}`;
        missedQuestionsSummary.push(qTitle);
      }
    });
  } else {
    // If no questions array passed, assume answers are present
    correctCount = answerEntries.length;
  }

  const percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 100;
  const passed = percentage >= 70;

  const attempt: QuizAttempt = {
    lessonId,
    lessonTitle,
    answers,
    totalQuestions,
    correctCount,
    percentage,
    passed,
    missedIndices,
    missedQuestionsSummary,
    timestamp: Date.now(),
  };

  try {
    sessionStorage.setItem(`codesage_quiz_${lessonId}`, JSON.stringify(attempt));
    sessionStorage.setItem('codesage_last_quiz', JSON.stringify(attempt));
    localStorage.setItem(`codesage_quiz_${lessonId}`, JSON.stringify(attempt));
    localStorage.setItem('codesage_last_quiz', JSON.stringify(attempt));
  } catch (e) {
    console.warn('Could not save quiz attempt to storage:', e);
  }

  return attempt;
}

/**
 * Retrieves the stored quiz attempt for a lesson.
 */
export function getLessonQuizAttempt(lessonId: string): QuizAttempt | null {
  try {
    const s = sessionStorage.getItem(`codesage_quiz_${lessonId}`);
    if (s) return JSON.parse(s);

    const l = localStorage.getItem(`codesage_quiz_${lessonId}`);
    if (l) return JSON.parse(l);

    const last = sessionStorage.getItem('codesage_last_quiz') || localStorage.getItem('codesage_last_quiz');
    if (last) {
      const parsed = JSON.parse(last) as QuizAttempt;
      if (parsed && parsed.lessonId === lessonId) return parsed;
    }
  } catch (e) {
    console.warn('Could not load quiz attempt:', e);
  }
  return null;
}

/**
 * Retrieves all recorded quiz attempts across all lessons.
 */
export function getAllQuizAttempts(): QuizAttempt[] {
  const attempts: QuizAttempt[] = [];
  const seenIds = new Set<string>();

  try {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('codesage_quiz_') && key !== 'codesage_last_quiz') {
        keys.push(key);
      }
    }
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && key.startsWith('codesage_quiz_') && key !== 'codesage_last_quiz' && !keys.includes(key)) {
        keys.push(key);
      }
    }

    for (const key of keys) {
      const raw = localStorage.getItem(key) || sessionStorage.getItem(key);
      if (raw) {
        try {
          const parsed = JSON.parse(raw) as QuizAttempt;
          if (parsed && parsed.lessonId && !seenIds.has(parsed.lessonId)) {
            seenIds.add(parsed.lessonId);
            attempts.push(parsed);
          }
        } catch {
          // ignore malformed entries
        }
      }
    }
  } catch (e) {
    console.warn('Could not read all quiz attempts:', e);
  }

  return attempts.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
}

/**
 * Computes an aggregated diagnostic summary of quiz performance and weak areas.
 */
export function getSkillHealthSummary(): SkillHealthSummary {
  const attempts = getAllQuizAttempts();

  if (attempts.length === 0) {
    return {
      totalQuizzesTaken: 0,
      averageScore: 0,
      passedCount: 0,
      perfectCount: 0,
      weakAttempts: [],
      strongAttempts: [],
      recentAttempts: [],
    };
  }

  const totalScore = attempts.reduce((acc, curr) => acc + (curr.percentage || 0), 0);
  const averageScore = Math.round(totalScore / attempts.length);
  const passedCount = attempts.filter(a => a.passed).length;
  const perfectCount = attempts.filter(a => a.percentage === 100).length;

  // Weak attempts: either failed (<70%) or missed at least one question
  const weakAttempts = attempts.filter(
    a => a.percentage < 80 || (a.missedIndices && a.missedIndices.length > 0)
  );

  const strongAttempts = attempts.filter(a => a.percentage >= 90);

  return {
    totalQuizzesTaken: attempts.length,
    averageScore,
    passedCount,
    perfectCount,
    weakAttempts,
    strongAttempts,
    recentAttempts: attempts.slice(0, 5),
  };
}
