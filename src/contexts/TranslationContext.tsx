export interface QuizAttempt {
  lessonId: string;
  answers: Record<number, number>;
  totalQuestions: number;
  correctCount: number;
  percentage: number;
  passed: boolean;
  missedIndices: number[];
  timestamp: number;
}

/**
 * Persists quiz answers and accuracy for a lesson so it can be reviewed
 * on the Lesson Complete page (or revisited later).
 */
export function saveLessonQuizAttempt(
  lessonId: string,
  answers: Record<number, number>,
  quizQuestions?: Array<{ question?: string; q?: string; correctIndex?: number; answer?: number }>
): QuizAttempt {
  const answerEntries = Object.entries(answers);
  const totalQuestions = quizQuestions && quizQuestions.length > 0 
    ? quizQuestions.length 
    : answerEntries.length;

  let correctCount = 0;
  const missedIndices: number[] = [];

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
    answers,
    totalQuestions,
    correctCount,
    percentage,
    passed,
    missedIndices,
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
