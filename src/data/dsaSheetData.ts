import { DsaProblem } from './dsa/types';
import { ARRAYS_HASHING_PROBLEMS } from './dsa/arraysHashing';
import { TWO_POINTERS_PROBLEMS } from './dsa/twoPointers';
import { SLIDING_WINDOW_PROBLEMS } from './dsa/slidingWindow';
import { STACK_QUEUES_PROBLEMS } from './dsa/stackQueues';
import { BINARY_SEARCH_PROBLEMS } from './dsa/binarySearch';
import { LINKED_LIST_PROBLEMS } from './dsa/linkedLists';
import { TREES_BST_PROBLEMS } from './dsa/treesBst';
import { GRAPHS_BFS_DFS_PROBLEMS } from './dsa/graphsBfsDfs';
import { DYNAMIC_PROGRAMMING_PROBLEMS } from './dsa/dynamicProgramming';

// Re-export all types so existing components don't break
export * from './dsa/types';

// Backward compatibility map for learners who solved old dsa-01..17 problems
export const LEGACY_DSA_ID_MAP: Record<string, string> = {
  'dsa-01': 'dsa-ah-03', // Two Sum
  'dsa-02': 'dsa-ah-01', // Contains Duplicate
  'dsa-03': 'dsa-ah-02', // Valid Anagram
  'dsa-04': 'dsa-ah-04', // Group Anagrams
  'dsa-05': 'dsa-tp-01', // Valid Palindrome
  'dsa-06': 'dsa-tp-03', // 3Sum
  'dsa-07': 'dsa-tp-04', // Container With Most Water
  'dsa-08': 'dsa-sw-01', // Best Time to Buy and Sell Stock
  'dsa-09': 'dsa-sw-02', // Longest Substring Without Repeating Characters
  'dsa-10': 'dsa-sq-01', // Valid Parentheses
  'dsa-11': 'dsa-bs-01', // Binary Search
  'dsa-12': 'dsa-ll-01', // Reverse Linked List
  'dsa-13': 'dsa-tb-01', // Invert Binary Tree
  'dsa-14': 'dsa-tb-02', // Maximum Depth of Binary Tree
  'dsa-15': 'dsa-dp-01', // Climbing Stairs
  'dsa-16': 'dsa-dp-05', // Coin Change
  'dsa-17': 'dsa-gr-01', // Number of Islands
};

export const normalizeDsaId = (id: string): string => LEGACY_DSA_ID_MAP[id] || id;

const RAW_PROBLEMS: DsaProblem[] = [
  ...ARRAYS_HASHING_PROBLEMS,
  ...TWO_POINTERS_PROBLEMS,
  ...SLIDING_WINDOW_PROBLEMS,
  ...STACK_QUEUES_PROBLEMS,
  ...BINARY_SEARCH_PROBLEMS,
  ...LINKED_LIST_PROBLEMS,
  ...TREES_BST_PROBLEMS,
  ...GRAPHS_BFS_DFS_PROBLEMS,
  ...DYNAMIC_PROGRAMMING_PROBLEMS,
];

// Sequential 1..N numbering across the entire sheet
export const DSA_PROBLEMS: DsaProblem[] = RAW_PROBLEMS.map((problem, index) => ({
  ...problem,
  number: index + 1,
}));
