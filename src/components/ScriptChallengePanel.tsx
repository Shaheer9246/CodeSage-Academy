// src/components/ScriptChallengePanel.tsx

import { CheckCircle2, XCircle, ArrowLeft } from 'lucide-react';
import { useState } from 'react';

// Generic interface for Python/Java challenges
// You can adjust this if your python.ts/java.ts exports look different
interface ScriptChallengeData {
  instruction: string;
  validationKeywords: string[];
}

interface ScriptLesson {
  challenge?: ScriptChallengeData;
}

interface ScriptChallengePanelProps {
  lesson: ScriptLesson;
  code: string; // The single string of Python or Java code from the editor
  language: 'python
