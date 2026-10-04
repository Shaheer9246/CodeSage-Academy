export type DsaDifficulty = 'Easy' | 'Medium' | 'Hard';

export type DsaCategory =
  | 'Arrays & Hashing'
  | 'Two Pointers'
  | 'Sliding Window'
  | 'Stack & Queues'
  | 'Binary Search'
  | 'Linked Lists'
  | 'Trees & BST'
  | 'Graphs & BFS/DFS'
  | 'Dynamic Programming';

export type SupportedLanguage = 'python' | 'javascript' | 'cpp' | 'java';

export interface TestCase {
  id: string;
  input: string;
  expected: string;
  label?: string;
}

export interface DsaProblem {
  id: string;
  number: number;
  title: string;
  slug: string;
  category: DsaCategory;
  difficulty: DsaDifficulty;
  summary: string;
  description: string;
  examples: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  constraints: string[];
  keyPoints: string[];
  timeComplexity: string;
  spaceComplexity: string;
  companies?: string[];
  starterCode: Record<SupportedLanguage, string>;
  solutionCode: Record<SupportedLanguage, string>;
  solutionExplanation: string;
  testCases: TestCase[];
}

export const DSA_CATEGORIES: DsaCategory[] = [
  'Arrays & Hashing',
  'Two Pointers',
  'Sliding Window',
  'Stack & Queues',
  'Binary Search',
  'Linked Lists',
  'Trees & BST',
  'Graphs & BFS/DFS',
  'Dynamic Programming',
];
