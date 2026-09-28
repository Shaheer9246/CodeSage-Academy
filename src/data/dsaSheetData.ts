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

export const DSA_PROBLEMS: DsaProblem[] = [
  // ==========================================
  // ARRAYS & HASHING
  // ==========================================
  {
    id: 'dsa-01',
    number: 1,
    title: 'Two Sum',
    slug: 'two-sum',
    category: 'Arrays & Hashing',
    difficulty: 'Easy',
    summary: 'Find two indices in an array whose values add up to a specific target.',
    description: `Given an array of integers \`nums\` and an integer \`target\`, return the indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order.`,
    examples: [
      {
        input: 'nums = [2, 7, 11, 15], target = 9',
        output: '[0, 1]',
        explanation: 'Because nums[0] + nums[1] == 2 + 7 == 9, we return [0, 1].'
      },
      {
        input: 'nums = [3, 2, 4], target = 6',
        output: '[1, 2]',
        explanation: 'Because nums[1] + nums[2] == 2 + 4 == 6, we return [1, 2].'
      },
      {
        input: 'nums = [3, 3], target = 6',
        output: '[0, 1]'
      }
    ],
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Only one valid answer exists.'
    ],
    keyPoints: [
      'Brute force tests every pair (i, j) with two nested loops: O(N²) time.',
      'Key insight: Use a Hash Map (Dictionary) to look up the required complement (target - num) in O(1) average time.',
      'One-pass hash map: Check if complement exists in the map BEFORE adding the current number to avoid using the same index twice.',
      'Time complexity reduces to O(N), Space complexity is O(N) for storing up to N elements.'
    ],
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(N)',
    companies: ['Google', 'Amazon', 'Meta', 'Microsoft', 'Apple'],
    starterCode: {
      python: `def two_sum(nums, target):
    # Write your solution here
    # Return a list of two indices [i, j]
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []

# Test run
print(two_sum([2, 7, 11, 15], 9))
`,
      javascript: `function twoSum(nums, target) {
  // Write your solution here
  const seen = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (seen.has(complement)) {
      return [seen.get(complement), i];
    }
    seen.set(nums[i], i);
  }
  return [];
}

console.log(twoSum([2, 7, 11, 15], 9));
`,
      cpp: `#include <iostream>
#include <vector>
#include <unordered_map>

using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> seen;
    for (int i = 0; i < nums.size(); i++) {
        int complement = target - nums[i];
        if (seen.find(complement) != seen.end()) {
            return {seen[complement], i};
        }
        seen[nums[i]] = i;
    }
    return {};
}

int main() {
    vector<int> nums = {2, 7, 11, 15};
    int target = 9;
    vector<int> result = twoSum(nums, target);
    cout << "[" << result[0] << ", " << result[1] << "]" << endl;
    return 0;
}
`,
      java: `import java.util.HashMap;
import java.util.Arrays;

public class Main {
    public static int[] twoSum(int[] nums, int target) {
        HashMap<Integer, Integer> seen = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (seen.containsKey(complement)) {
                return new int[] { seen.get(complement), i };
            }
            seen.put(nums[i], i);
        }
        return new int[]{};
    }

    public static void main(String[] args) {
        int[] nums = {2, 7, 11, 15};
        int target = 9;
        System.out.println(Arrays.toString(twoSum(nums, target)));
    }
}
`
    },
    solutionCode: {
      python: `def two_sum(nums, target):
    # Hash map to store {value: index}
    seen = {}
    for i, num in enumerate(nums):
        diff = target - num
        if diff in seen:
            return [seen[diff], i]
        seen[num] = i
    return []
`,
      javascript: `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const diff = target - nums[i];
    if (map.has(diff)) {
      return [map.get(diff), i];
    }
    map.set(nums[i], i);
  }
  return [];
}
`,
      cpp: `vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> map;
    for (int i = 0; i < nums.size(); ++i) {
        int diff = target - nums[i];
        if (map.count(diff)) {
            return {map[diff], i};
        }
        map[nums[i]] = i;
    }
    return {};
}
`,
      java: `public int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> map = new HashMap<>();
    for (int i = 0; i < nums.length; i++) {
        int diff = target - nums[i];
        if (map.containsKey(diff)) {
            return new int[]{map.get(diff), i};
        }
        map.put(nums[i], i);
    }
    return new int[0];
}
`
    },
    solutionExplanation: `We iterate through the array once. At each element, we compute the complement needed: \`complement = target - current_value\`.
If that complement already exists in our hash map, we found the pair! We return \`[seen[complement], current_index]\`.
Otherwise, we store the current number and its index in the hash map and move to the next item.`,
    testCases: [
      { id: 't1', input: 'nums = [2, 7, 11, 15], target = 9', expected: '[0, 1]', label: 'Basic Case' },
      { id: 't2', input: 'nums = [3, 2, 4], target = 6', expected: '[1, 2]', label: 'Non-ordered indices' },
      { id: 't3', input: 'nums = [3, 3], target = 6', expected: '[0, 1]', label: 'Duplicate numbers' }
    ]
  },
  {
    id: 'dsa-02',
    number: 2,
    title: 'Contains Duplicate',
    slug: 'contains-duplicate',
    category: 'Arrays & Hashing',
    difficulty: 'Easy',
    summary: 'Return true if any value appears at least twice in the array.',
    description: `Given an integer array \`nums\`, return \`true\` if any value appears at least twice in the array, and return \`false\` if every element is distinct.`,
    examples: [
      { input: 'nums = [1, 2, 3, 1]', output: 'true' },
      { input: 'nums = [1, 2, 3, 4]', output: 'false' },
      { input: 'nums = [1, 1, 1, 3, 3, 4, 3, 2, 4, 2]', output: 'true' }
    ],
    constraints: ['1 <= nums.length <= 10^5', '-10^9 <= nums[i] <= 10^9'],
    keyPoints: [
      'Naive approach: Compare each element with every other element (O(N²)).',
      'Sorting approach: Sort array and check if adjacent elements are equal (O(N log N) time, O(1) space).',
      'Optimal approach: Use a Hash Set. As we traverse, check if the current element is in the set. If yes, duplicate exists (O(N) time, O(N) space).',
      'In Python, `len(nums) != len(set(nums))` solves it in one expressive line!'
    ],
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(N)',
    companies: ['Amazon', 'Apple', 'Google'],
    starterCode: {
      python: `def contains_duplicate(nums):
    seen = set()
    for n in nums:
        if n in seen:
            return True
        seen.add(n)
    return False

print(contains_duplicate([1, 2, 3, 1]))
`,
      javascript: `function containsDuplicate(nums) {
  const seen = new Set();
  for (const n of nums) {
    if (seen.has(n)) return true;
    seen.add(n);
  }
  return false;
}

console.log(containsDuplicate([1, 2, 3, 1]));
`,
      cpp: `#include <iostream>
#include <vector>
#include <unordered_set>
using namespace std;

bool containsDuplicate(vector<int>& nums) {
    unordered_set<int> seen;
    for (int n : nums) {
        if (seen.count(n)) return true;
        seen.insert(n);
    }
    return false;
}

int main() {
    vector<int> nums = {1, 2, 3, 1};
    cout << (containsDuplicate(nums) ? "true" : "false") << endl;
    return 0;
}
`,
      java: `import java.util.HashSet;

public class Main {
    public static boolean containsDuplicate(int[] nums) {
        HashSet<Integer> seen = new HashSet<>();
        for (int n : nums) {
            if (seen.contains(n)) return true;
            seen.add(n);
        }
        return false;
    }

    public static void main(String[] args) {
        int[] nums = {1, 2, 3, 1};
        System.out.println(containsDuplicate(nums));
    }
}
`
    },
    solutionCode: {
      python: `def contains_duplicate(nums):
    return len(nums) != len(set(nums))
`,
      javascript: `function containsDuplicate(nums) {
  return new Set(nums).size !== nums.length;
}
`,
      cpp: `bool containsDuplicate(vector<int>& nums) {
    unordered_set<int> s(nums.begin(), nums.end());
    return s.size() < nums.size();
}
`,
      java: `public boolean containsDuplicate(int[] nums) {
    Set<Integer> set = new HashSet<>();
    for (int n : nums) {
        if (!set.add(n)) return true;
    }
    return false;
}
`
    },
    solutionExplanation: `A Set only keeps unique values. Inserting an element into a hash set is an average O(1) operation.
If we ever attempt to insert an element that already exists in the set, we immediately return true.`,
    testCases: [
      { id: 't1', input: 'nums = [1, 2, 3, 1]', expected: 'true', label: 'Simple duplicate' },
      { id: 't2', input: 'nums = [1, 2, 3, 4]', expected: 'false', label: 'All distinct' },
      { id: 't3', input: 'nums = [1, 1, 1, 3, 3, 4]', expected: 'true', label: 'Multiple duplicates' }
    ]
  },
  {
    id: 'dsa-03',
    number: 3,
    title: 'Valid Anagram',
    slug: 'valid-anagram',
    category: 'Arrays & Hashing',
    difficulty: 'Easy',
    summary: 'Check if two strings contain identical character counts.',
    description: `Given two strings \`s\` and \`t\`, return \`true\` if \`t\` is an anagram of \`s\`, and \`false\` otherwise.

An **Anagram** is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.`,
    examples: [
      { input: 's = "anagram", t = "nagaram"', output: 'true' },
      { input: 's = "rat", t = "car"', output: 'false' }
    ],
    constraints: [
      '1 <= s.length, t.length <= 5 * 10^4',
      's and t consist of lowercase English letters.'
    ],
    keyPoints: [
      'Edge check: If `s.length != t.length`, they can never be anagrams — return false immediately.',
      'Sorting approach: Sort both strings and compare them. O(N log N) time, but easy to write.',
      'Optimal Frequency Count: Use a frequency array of size 26 (for English lowercase letters) or a Hash Map. Increment counts for string `s` and decrement for string `t`.',
      'If all counts end up at 0, return true. Runs in O(N) time and O(1) space (since the alphabet has 26 letters).'
    ],
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1) (26 alphabet characters)',
    companies: ['Uber', 'Google', 'Bloomberg'],
    starterCode: {
      python: `def is_anagram(s: str, t: str) -> bool:
    if len(s) != len(t):
        return False
    counts = {}
    for c in s:
        counts[c] = counts.get(c, 0) + 1
    for c in t:
        if c not in counts or counts[c] == 0:
            return False
        counts[c] -= 1
    return True

print(is_anagram("anagram", "nagaram"))
`,
      javascript: `function isAnagram(s, t) {
  if (s.length !== t.length) return false;
  const count = new Array(26).fill(0);
  for (let i = 0; i < s.length; i++) {
    count[s.charCodeAt(i) - 97]++;
    count[t.charCodeAt(i) - 97]--;
  }
  return count.every(c => c === 0);
}

console.log(isAnagram("anagram", "nagaram"));
`,
      cpp: `#include <iostream>
#include <string>
#include <vector>
using namespace std;

bool isAnagram(string s, string t) {
    if (s.length() != t.length()) return false;
    vector<int> counts(26, 0);
    for (int i = 0; i < s.length(); i++) {
        counts[s[i] - 'a']++;
        counts[t[i] - 'a']--;
    }
    for (int c : counts) {
        if (c != 0) return false;
    }
    return true;
}

int main() {
    cout << (isAnagram("anagram", "nagaram") ? "true" : "false") << endl;
    return 0;
}
`,
      java: `public class Main {
    public static boolean isAnagram(String s, String t) {
        if (s.length() != t.length()) return false;
        int[] count = new int[26];
        for (int i = 0; i < s.length(); i++) {
            count[s.charAt(i) - 'a']++;
            count[t.charAt(i) - 'a']--;
        }
        for (int c : count) {
            if (c != 0) return false;
        }
        return true;
    }

    public static void main(String[] args) {
        System.out.println(isAnagram("anagram", "nagaram"));
    }
}
`
    },
    solutionCode: {
      python: `from collections import Counter

def is_anagram(s: str, t: str) -> bool:
    return Counter(s) == Counter(t)
`,
      javascript: `function isAnagram(s, t) {
  if (s.length !== t.length) return false;
  const map = {};
  for (const char of s) map[char] = (map[char] || 0) + 1;
  for (const char of t) {
    if (!map[char]) return false;
    map[char]--;
  }
  return true;
}
`,
      cpp: `bool isAnagram(string s, string t) {
    if (s.size() != t.size()) return false;
    int count[26] = {0};
    for (char c : s) count[c - 'a']++;
    for (char c : t) {
        if (--count[c - 'a'] < 0) return false;
    }
    return true;
}
`,
      java: `public boolean isAnagram(String s, String t) {
    if (s.length() != t.length()) return false;
    int[] table = new int[26];
    for (int i = 0; i < s.length(); i++) {
        table[s.charAt(i) - 'a']++;
    }
    for (int i = 0; i < t.length(); i++) {
        table[t.charAt(i) - 'a']--;
        if (table[t.charAt(i) - 'a'] < 0) return false;
    }
    return true;
}
`
    },
    solutionExplanation: `We tally up characters using a count array of length 26.
Incrementing counts for \`s\` and decrementing for \`t\` cancels out identical letters. If any bucket falls below zero, \`t\` must contain an extra letter not present in \`s\`.`,
    testCases: [
      { id: 't1', input: 's = "anagram", t = "nagaram"', expected: 'true', label: 'Standard Anagram' },
      { id: 't2', input: 's = "rat", t = "car"', expected: 'false', label: 'Different letters' },
      { id: 't3', input: 's = "a", t = "ab"', expected: 'false', label: 'Different lengths' }
    ]
  },
  {
    id: 'dsa-04',
    number: 4,
    title: 'Group Anagrams',
    slug: 'group-anagrams',
    category: 'Arrays & Hashing',
    difficulty: 'Medium',
    summary: 'Group words with identical letter compositions together.',
    description: `Given an array of strings \`strs\`, group the anagrams together. You can return the answer in any order.`,
    examples: [
      {
        input: 'strs = ["eat", "tea", "tan", "ate", "nat", "bat"]',
        output: '[["bat"], ["nat", "tan"], ["ate", "eat", "tea"]]'
      },
      { input: 'strs = [""]', output: '[[""]]' },
      { input: 'strs = ["a"]', output: '[["a"]]' }
    ],
    constraints: [
      '1 <= strs.length <= 10^4',
      '0 <= strs[i].length <= 100',
      'strs[i] consists of lowercase English letters.'
    ],
    keyPoints: [
      'Two strings are anagrams if and only if their sorted versions are identical.',
      'Idea 1: Sort each word and use the sorted word as the hash map key: `map[sorted_word].append(original_word)`. Time complexity: O(N * K log K) where K is max word length.',
      'Idea 2 (Optimal): Count character frequencies (a 26-element tuple or string signature `#1#0#2...`) as the key to achieve O(N * K) time.',
      'Always consider return format requirements (e.g. nested lists).'
    ],
    timeComplexity: 'O(N * K log K) or O(N * K)',
    spaceComplexity: 'O(N * K)',
    companies: ['Amazon', 'Microsoft', 'Salesforce'],
    starterCode: {
      python: `from collections import defaultdict

def group_anagrams(strs):
    ans = defaultdict(list)
    for s in strs:
        key = ''.join(sorted(s))
        ans[key].append(s)
    return list(ans.values())

print(group_anagrams(["eat", "tea", "tan", "ate", "nat", "bat"]))
`,
      javascript: `function groupAnagrams(strs) {
  const map = new Map();
  for (const s of strs) {
    const key = s.split('').sort().join('');
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(s);
  }
  return Array.from(map.values());
}

console.log(groupAnagrams(["eat", "tea", "tan", "ate", "nat", "bat"]));
`,
      cpp: `#include <iostream>
#include <vector>
#include <string>
#include <unordered_map>
#include <algorithm>
using namespace std;

vector<vector<string>> groupAnagrams(vector<string>& strs) {
    unordered_map<string, vector<string>> map;
    for (string s : strs) {
        string key = s;
        sort(key.begin(), key.end());
        map[key].push_back(s);
    }
    vector<vector<string>> res;
    for (auto& pair : map) {
        res.push_back(pair.second);
    }
    return res;
}

int main() {
    vector<string> strs = {"eat", "tea", "tan", "ate", "nat", "bat"};
    auto grouped = groupAnagrams(strs);
    cout << "Groups count: " << grouped.size() << endl;
    return 0;
}
`,
      java: `import java.util.*;

public class Main {
    public static List<List<String>> groupAnagrams(String[] strs) {
        Map<String, List<String>> map = new HashMap<>();
        for (String s : strs) {
            char[] chars = s.toCharArray();
            Arrays.sort(chars);
            String key = String.valueOf(chars);
            map.putIfAbsent(key, new ArrayList<>());
            map.get(key).add(s);
        }
        return new ArrayList<>(map.values());
    }

    public static void main(String[] args) {
        String[] strs = {"eat", "tea", "tan", "ate", "nat", "bat"};
        System.out.println(groupAnagrams(strs));
    }
}
`
    },
    solutionCode: {
      python: `from collections import defaultdict

def group_anagrams(strs):
    groups = defaultdict(list)
    for word in strs:
        groups[''.join(sorted(word))].append(word)
    return list(groups.values())
`,
      javascript: `function groupAnagrams(strs) {
  const map = {};
  for (const s of strs) {
    const key = s.split('').sort().join('');
    if (!map[key]) map[key] = [];
    map[key].push(s);
  }
  return Object.values(map);
}
`,
      cpp: `vector<vector<string>> groupAnagrams(vector<string>& strs) {
    unordered_map<string, vector<string>> mp;
    for (auto& s : strs) {
        string t = s;
        sort(t.begin(), t.end());
        mp[t].push_back(s);
    }
    vector<vector<string>> ans;
    for (auto& p : mp) ans.push_back(p.second);
    return ans;
}
`,
      java: `public List<List<String>> groupAnagrams(String[] strs) {
    Map<String, List<String>> map = new HashMap<>();
    for (String s : strs) {
        char[] ca = s.toCharArray();
        Arrays.sort(ca);
        String key = String.valueOf(ca);
        map.computeIfAbsent(key, k -> new ArrayList<>()).add(s);
    }
    return new ArrayList<>(map.values());
}
`
    },
    solutionExplanation: `We normalize each string into a canonical key by sorting its characters.
All anagrams produce the exact same sorted key. We append each word to the list associated with that key in our hash map.`,
    testCases: [
      { id: 't1', input: 'strs = ["eat", "tea", "tan", "ate", "nat", "bat"]', expected: '3 groups', label: 'Classic multi-word' },
      { id: 't2', input: 'strs = [""]', expected: '1 group', label: 'Empty string' }
    ]
  },

  // ==========================================
  // TWO POINTERS
  // ==========================================
  {
    id: 'dsa-05',
    number: 5,
    title: 'Valid Palindrome',
    slug: 'valid-palindrome',
    category: 'Two Pointers',
    difficulty: 'Easy',
    summary: 'Check if a phrase reads the same backward after removing non-alphanumeric characters.',
    description: `A phrase is a **palindrome** if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.

Given a string \`s\`, return \`true\` if it is a palindrome, or \`false\` otherwise.`,
    examples: [
      {
        input: 's = "A man, a plan, a canal: Panama"',
        output: 'true',
        explanation: '"amanaplanacanalpanama" is a palindrome.'
      },
      {
        input: 's = "race a car"',
        output: 'false',
        explanation: '"raceacar" is not a palindrome.'
      },
      { input: 's = " "', output: 'true', explanation: 's is an empty string "" after removing non-alphanumeric characters.' }
    ],
    constraints: [
      '1 <= s.length <= 2 * 10^5',
      's consists only of printable ASCII characters.'
    ],
    keyPoints: [
      'Two pointers pattern: place left pointer \`l\` at start (0) and right pointer \`r\` at end (n-1).',
      'Skip non-alphanumeric characters on both sides without advancing the other pointer.',
      'Compare \`s[l].lower() == s[r].lower()\`. If they mismatch, return false.',
      'Space-efficient: Solves in O(1) extra space without allocating a reversed copy of the string.'
    ],
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    companies: ['Facebook', 'Microsoft', 'Spotify'],
    starterCode: {
      python: `def is_palindrome(s: str) -> bool:
    l, r = 0, len(s) - 1
    while l < r:
        while l < r and not s[l].isalnum():
            l += 1
        while l < r and not s[r].isalnum():
            r -= 1
        if s[l].lower() != s[r].lower():
            return False
        l += 1
        r -= 1
    return True

print(is_palindrome("A man, a plan, a canal: Panama"))
`,
      javascript: `function isPalindrome(s) {
  let l = 0, r = s.length - 1;
  const isAlphaNum = (c) => /[a-zA-Z0-9]/.test(c);

  while (l < r) {
    while (l < r && !isAlphaNum(s[l])) l++;
    while (l < r && !isAlphaNum(s[r])) r--;
    if (s[l].toLowerCase() !== s[r].toLowerCase()) return false;
    l++;
    r--;
  }
  return true;
}

console.log(isPalindrome("A man, a plan, a canal: Panama"));
`,
      cpp: `#include <iostream>
#include <string>
#include <cctype>
using namespace std;

bool isPalindrome(string s) {
    int l = 0, r = s.size() - 1;
    while (l < r) {
        while (l < r && !isalnum(s[l])) l++;
        while (l < r && !isalnum(s[r])) r--;
        if (tolower(s[l]) != tolower(s[r])) return false;
        l++;
        r--;
    }
    return true;
}

int main() {
    cout << (isPalindrome("A man, a plan, a canal: Panama") ? "true" : "false") << endl;
    return 0;
}
`,
      java: `public class Main {
    public static boolean isPalindrome(String s) {
        int l = 0, r = s.length() - 1;
        while (l < r) {
            while (l < r && !Character.isLetterOrDigit(s.charAt(l))) l++;
            while (l < r && !Character.isLetterOrDigit(s.charAt(r))) r--;
            if (Character.toLowerCase(s.charAt(l)) != Character.toLowerCase(s.charAt(r))) return false;
            l++;
            r--;
        }
        return true;
    }

    public static void main(String[] args) {
        System.out.println(isPalindrome("A man, a plan, a canal: Panama"));
    }
}
`
    },
    solutionCode: {
      python: `def is_palindrome(s: str) -> bool:
    l, r = 0, len(s) - 1
    while l < r:
        while l < r and not s[l].isalnum(): l += 1
        while l < r and not s[r].isalnum(): r -= 1
        if s[l].lower() != s[r].lower(): return False
        l, r = l + 1, r - 1
    return True
`,
      javascript: `function isPalindrome(s) {
  const clean = s.toLowerCase().replace(/[^a-z0-9]/g, '');
  return clean === clean.split('').reverse().join('');
}
`,
      cpp: `bool isPalindrome(string s) {
    int i = 0, j = s.length() - 1;
    while (i < j) {
        if (!isalnum(s[i])) i++;
        else if (!isalnum(s[j])) j--;
        else if (tolower(s[i]) != tolower(s[j])) return false;
        else { i++; j--; }
    }
    return true;
}
`,
      java: `public boolean isPalindrome(String s) {
    int i = 0, j = s.length() - 1;
    while (i < j) {
        char ci = s.charAt(i), cj = s.charAt(j);
        if (!Character.isLetterOrDigit(ci)) i++;
        else if (!Character.isLetterOrDigit(cj)) j--;
        else {
            if (Character.toLowerCase(ci) != Character.toLowerCase(cj)) return false;
            i++; j--;
        }
    }
    return true;
}
`
    },
    solutionExplanation: `We converge two pointers from the outer edges toward the center.
At each step, we advance past punctuation/spaces and test equality case-insensitively. This achieves O(N) time and requires zero additional memory allocations.`,
    testCases: [
      { id: 't1', input: 's = "A man, a plan, a canal: Panama"', expected: 'true', label: 'Panama palindrome' },
      { id: 't2', input: 's = "race a car"', expected: 'false', label: 'Not a palindrome' },
      { id: 't3', input: 's = " "', expected: 'true', label: 'Empty/Whitespace only' }
    ]
  },
  {
    id: 'dsa-06',
    number: 6,
    title: '3Sum',
    slug: '3sum',
    category: 'Two Pointers',
    difficulty: 'Medium',
    summary: 'Find all unique triplets in the array which add up to 0.',
    description: `Given an integer array nums, return all the triplets \`[nums[i], nums[j], nums[k]]\` such that \`i != j\`, \`i != k\`, and \`j != k\`, and \`nums[i] + nums[j] + nums[k] == 0\`.

Notice that the solution set must not contain duplicate triplets.`,
    examples: [
      {
        input: 'nums = [-1, 0, 1, 2, -1, -4]',
        output: '[[-1, -1, 2], [-1, 0, 1]]',
        explanation: 'nums[0] + nums[1] + nums[2] = (-1) + 0 + 1 = 0. The distinct triplets are [-1,0,1] and [-1,-1,2].'
      },
      { input: 'nums = [0, 1, 1]', output: '[]' },
      { input: 'nums = [0, 0, 0]', output: '[[0, 0, 0]]' }
    ],
    constraints: ['3 <= nums.length <= 3000', '-10^5 <= nums[i] <= 10^5'],
    keyPoints: [
      'Sorting first is the superpower: `nums.sort()` simplifies skipping duplicate values and applying two pointers.',
      'Fix the first element `nums[i]`. If `nums[i] > 0`, break early because 3 positive numbers can never sum to 0.',
      'Skip duplicate fixed elements: `if i > 0 and nums[i] == nums[i-1]: continue`.',
      'Use Two Pointers (`l = i + 1`, `r = len(nums) - 1`) to find pairs adding up to `-nums[i]`.',
      'When a triplet is found, advance `l` and decrement `r`, skipping any identical numbers to avoid duplicate triplets.'
    ],
    timeComplexity: 'O(N²)',
    spaceComplexity: 'O(1) auxiliary (excluding output)',
    companies: ['Amazon', 'Facebook', 'Apple', 'Google'],
    starterCode: {
      python: `def three_sum(nums):
    nums.sort()
    res = []
    for i in range(len(nums) - 2):
        if i > 0 and nums[i] == nums[i-1]:
            continue
        l, r = i + 1, len(nums) - 1
        while l < r:
            s = nums[i] + nums[l] + nums[r]
            if s < 0:
                l += 1
            elif s > 0:
                r -= 1
            else:
                res.append([nums[i], nums[l], nums[r]])
                while l < r and nums[l] == nums[l+1]: l += 1
                while l < r and nums[r] == nums[r-1]: r -= 1
                l += 1
                r -= 1
    return res

print(three_sum([-1, 0, 1, 2, -1, -4]))
`,
      javascript: `function threeSum(nums) {
  nums.sort((a, b) => a - b);
  const res = [];
  for (let i = 0; i < nums.length - 2; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue;
    let l = i + 1, r = nums.length - 1;
    while (l < r) {
      const sum = nums[i] + nums[l] + nums[r];
      if (sum < 0) l++;
      else if (sum > 0) r--;
      else {
        res.push([nums[i], nums[l], nums[r]]);
        while (l < r && nums[l] === nums[l + 1]) l++;
        while (l < r && nums[r] === nums[r - 1]) r--;
        l++;
        r--;
      }
    }
  }
  return res;
}

console.log(threeSum([-1, 0, 1, 2, -1, -4]));
`,
      cpp: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

vector<vector<int>> threeSum(vector<int>& nums) {
    sort(nums.begin(), nums.end());
    vector<vector<int>> res;
    for (int i = 0; i < (int)nums.size() - 2; i++) {
        if (i > 0 && nums[i] == nums[i - 1]) continue;
        int l = i + 1, r = nums.size() - 1;
        while (l < r) {
            int sum = nums[i] + nums[l] + nums[r];
            if (sum < 0) l++;
            else if (sum > 0) r--;
            else {
                res.push_back({nums[i], nums[l], nums[r]});
                while (l < r && nums[l] == nums[l + 1]) l++;
                while (l < r && nums[r] == nums[r - 1]) r--;
                l++; r--;
            }
        }
    }
    return res;
}

int main() {
    vector<int> nums = {-1, 0, 1, 2, -1, -4};
    auto ans = threeSum(nums);
    cout << "Triplets found: " << ans.size() << endl;
    return 0;
}
`,
      java: `import java.util.*;

public class Main {
    public static List<List<String>> threeSum(int[] nums) {
        Arrays.sort(nums);
        List<List<String>> res = new ArrayList<>();
        for (int i = 0; i < nums.length - 2; i++) {
            if (i > 0 && nums[i] == nums[i - 1]) continue;
            int l = i + 1, r = nums.length - 1;
            while (l < r) {
                int sum = nums[i] + nums[l] + nums[r];
                if (sum < 0) l++;
                else if (sum > 0) r--;
                else {
                    res.add(Arrays.asList(String.valueOf(nums[i]), String.valueOf(nums[l]), String.valueOf(nums[r])));
                    while (l < r && nums[l] == nums[l + 1]) l++;
                    while (l < r && nums[r] == nums[r - 1]) r--;
                    l++; r--;
                }
            }
        }
        return res;
    }

    public static void main(String[] args) {
        int[] nums = {-1, 0, 1, 2, -1, -4};
        System.out.println(threeSum(nums));
    }
}
`
    },
    solutionCode: {
      python: `def three_sum(nums):
    nums.sort()
    res = []
    for i in range(len(nums) - 2):
        if i > 0 and nums[i] == nums[i-1]: continue
        l, r = i + 1, len(nums) - 1
        while l < r:
            s = nums[i] + nums[l] + nums[r]
            if s < 0: l += 1
            elif s > 0: r -= 1
            else:
                res.append([nums[i], nums[l], nums[r]])
                while l < r and nums[l] == nums[l+1]: l += 1
                while l < r and nums[r] == nums[r-1]: r -= 1
                l += 1; r -= 1
    return res
`,
      javascript: `function threeSum(nums) {
  nums.sort((a, b) => a - b);
  const result = [];
  for (let i = 0; i < nums.length - 2; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue;
    let left = i + 1, right = nums.length - 1;
    while (left < right) {
      const sum = nums[i] + nums[left] + nums[right];
      if (sum === 0) {
        result.push([nums[i], nums[left], nums[right]]);
        while (left < right && nums[left] === nums[left + 1]) left++;
        while (left < right && nums[right] === nums[right - 1]) right--;
        left++; right--;
      } else if (sum < 0) left++;
      else right--;
    }
  }
  return result;
}
`,
      cpp: `vector<vector<int>> threeSum(vector<int>& nums) {
    sort(nums.begin(), nums.end());
    vector<vector<int>> res;
    int n = nums.size();
    for (int i = 0; i < n - 2; i++) {
        if (i > 0 && nums[i] == nums[i-1]) continue;
        int l = i + 1, r = n - 1;
        while (l < r) {
            int s = nums[i] + nums[l] + nums[r];
            if (s == 0) {
                res.push_back({nums[i], nums[l], nums[r]});
                while (l < r && nums[l] == nums[l+1]) l++;
                while (l < r && nums[r] == nums[r-1]) r--;
                l++; r--;
            } else if (s < 0) l++;
            else r--;
        }
    }
    return res;
}
`,
      java: `public List<List<Integer>> threeSum(int[] nums) {
    Arrays.sort(nums);
    List<List<Integer>> res = new ArrayList<>();
    for (int i = 0; i < nums.length - 2; i++) {
        if (i > 0 && nums[i] == nums[i - 1]) continue;
        int l = i + 1, r = nums.length - 1;
        while (l < r) {
            int sum = nums[i] + nums[l] + nums[r];
            if (sum == 0) {
                res.add(Arrays.asList(nums[i], nums[l], nums[r]));
                while (l < r && nums[l] == nums[l + 1]) l++;
                while (l < r && nums[r] == nums[r - 1]) r--;
                l++; r--;
            } else if (sum < 0) l++;
            else r--;
        }
    }
    return res;
}
`
    },
    solutionExplanation: `After sorting the array in O(N log N), we iterate through each potential first element \`nums[i]\`.
For each fixed element, we use two pointers (\`left\` and \`right\`) to scan the remaining subarray in O(N).
Skipping duplicate consecutive values ensures every triplet in our result is unique.`,
    testCases: [
      { id: 't1', input: 'nums = [-1, 0, 1, 2, -1, -4]', expected: '[[-1, -1, 2], [-1, 0, 1]]', label: 'Standard array' },
      { id: 't2', input: 'nums = [0, 0, 0]', expected: '[[0, 0, 0]]', label: 'All zeroes' },
      { id: 't3', input: 'nums = [1, 2, -2, -1]', expected: '[]', label: 'No triplet sum to 0' }
    ]
  },
  {
    id: 'dsa-07',
    number: 7,
    title: 'Container With Most Water',
    slug: 'container-with-most-water',
    category: 'Two Pointers',
    difficulty: 'Medium',
    summary: 'Find two vertical lines that together with the x-axis contain the most water.',
    description: `You are given an integer array \`height\` of length \`n\`. There are \`n\` vertical lines drawn such that the two endpoints of the \`i\`th line are \`(i, 0)\` and \`(i, height[i])\`.

Find two lines that together with the x-axis form a container, such that the container contains the most water.

Return the maximum amount of water a container can store.`,
    examples: [
      {
        input: 'height = [1, 8, 6, 2, 5, 4, 8, 3, 7]',
        output: '49',
        explanation: 'The lines at index 1 (height 8) and index 8 (height 7) have width 7 and min-height 7 => 7 * 7 = 49.'
      },
      { input: 'height = [1, 1]', output: '1' }
    ],
    constraints: ['n == height.length', '2 <= n <= 10^5', '0 <= height[i] <= 10^4'],
    keyPoints: [
      'Area formula: `area = width * min(height[l], height[r])` where `width = r - l`.',
      'Two pointers starting at maximum width: `l = 0`, `r = n - 1`.',
      'Greedy pointer movement: The bottleneck is always the SHORTER of the two vertical lines.',
      'Moving the taller pointer inward can only DECREASE width while height remains bounded by the shorter line. Therefore, always advance the shorter line inward!',
      'Achieves optimal O(N) time with O(1) space.'
    ],
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    companies: ['Google', 'Amazon', 'Adobe'],
    starterCode: {
      python: `def max_area(height):
    l, r = 0, len(height) - 1
    max_w = 0
    while l < r:
        area = (r - l) * min(height[l], height[r])
        max_w = max(max_w, area)
        if height[l] < height[r]:
            l += 1
        else:
            r -= 1
    return max_w

print(max_area([1, 8, 6, 2, 5, 4, 8, 3, 7]))
`,
      javascript: `function maxArea(height) {
  let l = 0, r = height.length - 1;
  let maxW = 0;
  while (l < r) {
    const area = (r - l) * Math.min(height[l], height[r]);
    maxW = Math.max(maxW, area);
    if (height[l] < height[r]) l++;
    else r--;
  }
  return maxW;
}

console.log(maxArea([1, 8, 6, 2, 5, 4, 8, 3, 7]));
`,
      cpp: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int maxArea(vector<int>& height) {
    int l = 0, r = height.size() - 1;
    int maxW = 0;
    while (l < r) {
        int area = (r - l) * min(height[l], height[r]);
        maxW = max(maxW, area);
        if (height[l] < height[r]) l++;
        else r--;
    }
    return maxW;
}

int main() {
    vector<int> h = {1, 8, 6, 2, 5, 4, 8, 3, 7};
    cout << maxArea(h) << endl;
    return 0;
}
`,
      java: `public class Main {
    public static int maxArea(int[] height) {
        int l = 0, r = height.length - 1;
        int maxW = 0;
        while (l < r) {
            int area = (r - l) * Math.min(height[l], height[r]);
            maxW = Math.max(maxW, area);
            if (height[l] < height[r]) l++;
            else r--;
        }
        return maxW;
    }

    public static void main(String[] args) {
        int[] h = {1, 8, 6, 2, 5, 4, 8, 3, 7};
        System.out.println(maxArea(h));
    }
}
`
    },
    solutionCode: {
      python: `def max_area(height):
    l, r, res = 0, len(height) - 1, 0
    while l < r:
        res = max(res, (r - l) * min(height[l], height[r]))
        if height[l] < height[r]:
            l += 1
        else:
            r -= 1
    return res
`,
      javascript: `function maxArea(height) {
  let l = 0, r = height.length - 1, max = 0;
  while (l < r) {
    max = Math.max(max, (r - l) * Math.min(height[l], height[r]));
    if (height[l] < height[r]) l++;
    else r--;
  }
  return max;
}
`,
      cpp: `int maxArea(vector<int>& height) {
    int l = 0, r = height.size() - 1, mx = 0;
    while (l < r) {
        mx = max(mx, (r - l) * min(height[l], height[r]));
        if (height[l] < height[r]) l++;
        else r--;
    }
    return mx;
}
`,
      java: `public int maxArea(int[] height) {
    int l = 0, r = height.length - 1, max = 0;
    while (l < r) {
        max = Math.max(max, (r - l) * Math.min(height[l], height[r]));
        if (height[l] < height[r]) l++;
        else r--;
    }
    return max;
}
`
    },
    solutionExplanation: `Start with the widest possible container (left at 0, right at n-1).
Compute the area. Because the shorter line determines the water level, moving the taller line inward can never increase the area. We therefore discard the shorter line by incrementing/decrementing its pointer.`,
    testCases: [
      { id: 't1', input: 'height = [1, 8, 6, 2, 5, 4, 8, 3, 7]', expected: '49', label: 'Classic heights' },
      { id: 't2', input: 'height = [1, 1]', expected: '1', label: 'Minimum length' },
      { id: 't3', input: 'height = [4, 3, 2, 1, 4]', expected: '16', label: 'Equal endpoints' }
    ]
  },

  // ==========================================
  // SLIDING WINDOW
  // ==========================================
  {
    id: 'dsa-08',
    number: 8,
    title: 'Best Time to Buy and Sell Stock',
    slug: 'best-time-to-buy-and-sell-stock',
    category: 'Sliding Window',
    difficulty: 'Easy',
    summary: 'Find the maximum profit achievable by buying on one day and selling on a future day.',
    description: `You are given an array \`prices\` where \`prices[i]\` is the price of a given stock on the \`i\`th day.

You want to maximize your profit by choosing a **single day** to buy one stock and choosing a **different day in the future** to sell that stock.

Return the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return \`0\`.`,
    examples: [
      {
        input: 'prices = [7, 1, 5, 3, 6, 4]',
        output: '5',
        explanation: 'Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5.'
      },
      {
        input: 'prices = [7, 6, 4, 3, 1]',
        output: '0',
        explanation: 'In this case, no transactions are done and max profit = 0.'
      }
    ],
    constraints: ['1 <= prices.length <= 10^5', '0 <= prices[i] <= 10^4'],
    keyPoints: [
      'You cannot sell before you buy (time moves forward).',
      'Track the minimum buy price seen so far: `min_price = min(min_price, current_price)`.',
      'At each day, the best profit you could make selling TODAY is `current_price - min_price`.',
      'Update the maximum profit: `max_profit = max(max_profit, current_price - min_price)`.',
      'Only requires a single pass: O(N) time and O(1) space.'
    ],
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    companies: ['Amazon', 'Apple', 'Goldman Sachs'],
    starterCode: {
      python: `def max_profit(prices):
    min_price = float('inf')
    max_p = 0
    for p in prices:
        if p < min_price:
            min_price = p
        elif p - min_price > max_p:
            max_p = p - min_price
    return max_p

print(max_profit([7, 1, 5, 3, 6, 4]))
`,
      javascript: `function maxProfit(prices) {
  let minPrice = Infinity;
  let maxP = 0;
  for (const p of prices) {
    if (p < minPrice) minPrice = p;
    else if (p - minPrice > maxP) maxP = p - minPrice;
  }
  return maxP;
}

console.log(maxProfit([7, 1, 5, 3, 6, 4]));
`,
      cpp: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int maxProfit(vector<int>& prices) {
    int minPrice = 1e9;
    int maxP = 0;
    for (int p : prices) {
        minPrice = min(minPrice, p);
        maxP = max(maxP, p - minPrice);
    }
    return maxP;
}

int main() {
    vector<int> p = {7, 1, 5, 3, 6, 4};
    cout << maxProfit(p) << endl;
    return 0;
}
`,
      java: `public class Main {
    public static int maxProfit(int[] prices) {
        int minPrice = Integer.MAX_VALUE;
        int maxP = 0;
        for (int p : prices) {
            minPrice = Math.min(minPrice, p);
            maxP = Math.max(maxP, p - minPrice);
        }
        return maxP;
    }

    public static void main(String[] args) {
        int[] p = {7, 1, 5, 3, 6, 4};
        System.out.println(maxProfit(p));
    }
}
`
    },
    solutionCode: {
      python: `def max_profit(prices):
    min_p, max_p = float('inf'), 0
    for p in prices:
        min_p = min(min_p, p)
        max_p = max(max_p, p - min_p)
    return max_p
`,
      javascript: `function maxProfit(prices) {
  let min = Infinity, profit = 0;
  for (let p of prices) {
    min = Math.min(min, p);
    profit = Math.max(profit, p - min);
  }
  return profit;
}
`,
      cpp: `int maxProfit(vector<int>& prices) {
    int mn = INT_MAX, mx = 0;
    for (int p : prices) {
        mn = min(mn, p);
        mx = max(mx, p - mn);
    }
    return mx;
}
`,
      java: `public int maxProfit(int[] prices) {
    int min = Integer.MAX_VALUE, max = 0;
    for (int p : prices) {
        min = Math.min(min, p);
        max = Math.max(max, p - min);
    }
    return max;
}
`
    },
    solutionExplanation: `We iterate through the array maintaining the lowest price encountered so far.
For every price, we calculate what profit we would make if we sold on that day, updating our global maximum.`,
    testCases: [
      { id: 't1', input: 'prices = [7, 1, 5, 3, 6, 4]', expected: '5', label: 'Profitable stock' },
      { id: 't2', input: 'prices = [7, 6, 4, 3, 1]', expected: '0', label: 'Strictly decreasing' }
    ]
  },
  {
    id: 'dsa-09',
    number: 9,
    title: 'Longest Substring Without Repeating Characters',
    slug: 'longest-substring-without-repeating-characters',
    category: 'Sliding Window',
    difficulty: 'Medium',
    summary: 'Find the length of the longest substring containing no duplicate characters.',
    description: `Given a string \`s\`, find the length of the **longest substring** without repeating characters.`,
    examples: [
      {
        input: 's = "abcabcbb"',
        output: '3',
        explanation: 'The answer is "abc", with the length of 3.'
      },
      {
        input: 's = "bbbbb"',
        output: '1',
        explanation: 'The answer is "b", with the length of 1.'
      },
      {
        input: 's = "pwwkew"',
        output: '3',
        explanation: 'The answer is "wke", with the length of 3. Note that "pwke" is a subsequence, not a substring.'
      }
    ],
    constraints: ['0 <= s.length <= 5 * 10^4', 's consists of English letters, digits, symbols and spaces.'],
    keyPoints: [
      'Sliding Window pattern: Maintain a dynamic window \`[left, right]\` of characters.',
      'Use a Hash Map to remember the last seen index of each character: \`last_seen[char] = index\`.',
      'When character \`s[right]\` was seen inside our current window (\`last_seen[s[right]] >= left\`), jump the \`left\` pointer to \`last_seen[s[right]] + 1\`.',
      'Window length at each step is \`right - left + 1\`. Update maximum length.',
      'Runs in O(N) time with at most 1 visit per character.'
    ],
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(min(N, M)) where M is character set size',
    companies: ['Amazon', 'Bloomberg', 'Microsoft', 'Google'],
    starterCode: {
      python: `def length_of_longest_substring(s: str) -> int:
    last_seen = {}
    l = 0
    max_len = 0
    for r, c in enumerate(s):
        if c in last_seen and last_seen[c] >= l:
            l = last_seen[c] + 1
        last_seen[c] = r
        max_len = max(max_len, r - l + 1)
    return max_len

print(length_of_longest_substring("abcabcbb"))
`,
      javascript: `function lengthOfLongestSubstring(s) {
  const lastSeen = new Map();
  let l = 0, maxLen = 0;
  for (let r = 0; r < s.length; r++) {
    const c = s[r];
    if (lastSeen.has(c) && lastSeen.get(c) >= l) {
      l = lastSeen.get(c) + 1;
    }
    lastSeen.set(c, r);
    maxLen = Math.max(maxLen, r - l + 1);
  }
  return maxLen;
}

console.log(lengthOfLongestSubstring("abcabcbb"));
`,
      cpp: `#include <iostream>
#include <string>
#include <unordered_map>
#include <algorithm>
using namespace std;

int lengthOfLongestSubstring(string s) {
    unordered_map<char, int> lastSeen;
    int l = 0, maxLen = 0;
    for (int r = 0; r < s.size(); r++) {
        if (lastSeen.count(s[r]) && lastSeen[s[r]] >= l) {
            l = lastSeen[s[r]] + 1;
        }
        lastSeen[s[r]] = r;
        maxLen = max(maxLen, r - l + 1);
    }
    return maxLen;
}

int main() {
    cout << lengthOfLongestSubstring("abcabcbb") << endl;
    return 0;
}
`,
      java: `import java.util.HashMap;

public class Main {
    public static int lengthOfLongestSubstring(String s) {
        HashMap<Character, Integer> lastSeen = new HashMap<>();
        int l = 0, maxLen = 0;
        for (int r = 0; r < s.length(); r++) {
            char c = s.charAt(r);
            if (lastSeen.containsKey(c) && lastSeen.get(c) >= l) {
                l = lastSeen.get(c) + 1;
            }
            lastSeen.put(c, r);
            maxLen = Math.max(maxLen, r - l + 1);
        }
        return maxLen;
    }

    public static void main(String[] args) {
        System.out.println(lengthOfLongestSubstring("abcabcbb"));
    }
}
`
    },
    solutionCode: {
      python: `def length_of_longest_substring(s: str) -> int:
    used = {}
    max_len = start = 0
    for i, c in enumerate(s):
        if c in used and start <= used[c]:
            start = used[c] + 1
        else:
            max_len = max(max_len, i - start + 1)
        used[c] = i
    return max_len
`,
      javascript: `function lengthOfLongestSubstring(s) {
  let map = {}, left = 0, max = 0;
  for (let right = 0; right < s.length; right++) {
    const c = s[right];
    if (map[c] >= left) left = map[c] + 1;
    map[c] = right;
    max = Math.max(max, right - left + 1);
  }
  return max;
}
`,
      cpp: `int lengthOfLongestSubstring(string s) {
    vector<int> dict(256, -1);
    int maxLen = 0, start = -1;
    for (int i = 0; i < s.length(); i++) {
        if (dict[s[i]] > start) start = dict[s[i]];
        dict[s[i]] = i;
        maxLen = max(maxLen, i - start);
    }
    return maxLen;
}
`,
      java: `public int lengthOfLongestSubstring(String s) {
    int[] index = new int[128];
    int ans = 0;
    for (int j = 0, i = 0; j < s.length(); j++) {
        i = Math.max(index[s.charAt(j)], i);
        ans = Math.max(ans, j - i + 1);
        index[s.charAt(j)] = j + 1;
    }
    return ans;
}
`
    },
    solutionExplanation: `We maintain a window \`[left, right]\`. As \`right\` expands, we record the index of each character.
If we encounter a repeated character that falls within the current window, we advance \`left\` to one position after that character's last seen index.`,
    testCases: [
      { id: 't1', input: 's = "abcabcbb"', expected: '3', label: 'Repeating triplets' },
      { id: 't2', input: 's = "bbbbb"', expected: '1', label: 'Single repeated character' },
      { id: 't3', input: 's = "pwwkew"', expected: '3', label: 'Non-contiguous window' }
    ]
  },

  // ==========================================
  // STACK & QUEUES
  // ==========================================
  {
    id: 'dsa-10',
    number: 10,
    title: 'Valid Parentheses',
    slug: 'valid-parentheses',
    category: 'Stack & Queues',
    difficulty: 'Easy',
    summary: 'Determine if brackets in an input string are properly opened and closed.',
    description: `Given a string \`s\` containing just the characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\`, determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
    examples: [
      { input: 's = "()"', output: 'true' },
      { input: 's = "()[]{}"', output: 'true' },
      { input: 's = "(]"', output: 'false' },
      { input: 's = "([])"', output: 'true' }
    ],
    constraints: ['1 <= s.length <= 10^4', 's consists of parentheses only \`()[]{}\`.'],
    keyPoints: [
      'Stack LIFO (Last In, First Out) is the natural data structure for nested bracket matching.',
      'Store matching pairs in a hash map: `{\')\': \'(\', \'}\': \'{\', \']\': \'[\'}`.',
      'When seeing an open bracket, push it onto the stack.',
      'When seeing a closing bracket, pop from the stack. If stack is empty or popped item does not match, return false!',
      'At the end of traversal, return `len(stack) == 0` (all open brackets must be matched).'
    ],
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(N)',
    companies: ['Amazon', 'Facebook', 'Microsoft', 'Bloomberg'],
    starterCode: {
      python: `def is_valid(s: str) -> bool:
    stack = []
    pairs = {')': '(', '}': '{', ']': '['}
    for char in s:
        if char in pairs:
            if not stack or stack[-1] != pairs[char]:
                return False
            stack.pop()
        else:
            stack.append(char)
    return len(stack) == 0

print(is_valid("()[]{}"))
`,
      javascript: `function isValid(s) {
  const stack = [];
  const map = { ')': '(', '}': '{', ']': '[' };
  for (const c of s) {
    if (map[c]) {
      if (stack.pop() !== map[c]) return false;
    } else {
      stack.push(c);
    }
  }
  return stack.length === 0;
}

console.log(isValid("()[]{}"));
`,
      cpp: `#include <iostream>
#include <string>
#include <stack>
#include <unordered_map>
using namespace std;

bool isValid(string s) {
    stack<char> st;
    unordered_map<char, char> pairs = {{')', '('}, {'}', '{'}, {']', '['}};
    for (char c : s) {
        if (pairs.count(c)) {
            if (st.empty() || st.top() != pairs[c]) return false;
            st.pop();
        } else {
            st.push(c);
        }
    }
    return st.empty();
}

int main() {
    cout << (isValid("()[]{}") ? "true" : "false") << endl;
    return 0;
}
`,
      java: `import java.util.Stack;

public class Main {
    public static boolean isValid(String s) {
        Stack<Character> stack = new Stack<>();
        for (char c : s.toCharArray()) {
            if (c == '(') stack.push(')');
            else if (c == '{') stack.push('}');
            else if (c == '[') stack.push(']');
            else if (stack.isEmpty() || stack.pop() != c) return false;
        }
        return stack.isEmpty();
    }

    public static void main(String[] args) {
        System.out.println(isValid("()[]{}"));
    }
}
`
    },
    solutionCode: {
      python: `def is_valid(s: str) -> bool:
    stack = []
    mapping = {")": "(", "}": "{", "]": "["}
    for char in s:
        if char in mapping:
            top = stack.pop() if stack else '#'
            if mapping[char] != top:
                return False
        else:
            stack.append(char)
    return not stack
`,
      javascript: `function isValid(s) {
  const stack = [];
  for (let c of s) {
    if (c === '(') stack.push(')');
    else if (c === '{') stack.push('}');
    else if (c === '[') stack.push(']');
    else if (stack.pop() !== c) return false;
  }
  return stack.length === 0;
}
`,
      cpp: `bool isValid(string s) {
    stack<char> st;
    for (char c : s) {
        if (c == '(') st.push(')');
        else if (c == '{') st.push('}');
        else if (c == '[') st.push(']');
        else {
            if (st.empty() || st.top() != c) return false;
            st.pop();
        }
    }
    return st.empty();
}
`,
      java: `public boolean isValid(String s) {
    Stack<Character> stack = new Stack<>();
    for (char c : s.toCharArray()) {
        if (c == '(') stack.push(')');
        else if (c == '{') stack.push('}');
        else if (c == '[') stack.push(']');
        else if (stack.isEmpty() || stack.pop() != c) return false;
    }
    return stack.isEmpty();
}
`
    },
    solutionExplanation: `We iterate through the brackets. Each open bracket is pushed onto the stack.
When a closing bracket is encountered, we verify it corresponds to the most recently opened bracket on top of the stack.`,
    testCases: [
      { id: 't1', input: 's = "()"', expected: 'true', label: 'Simple pair' },
      { id: 't2', input: 's = "()[]{}"', expected: 'true', label: 'Multiple distinct brackets' },
      { id: 't3', input: 's = "(]"', expected: 'false', label: 'Mismatched brackets' }
    ]
  },

  // ==========================================
  // BINARY SEARCH
  // ==========================================
  {
    id: 'dsa-11',
    number: 11,
    title: 'Binary Search',
    slug: 'binary-search',
    category: 'Binary Search',
    difficulty: 'Easy',
    summary: 'Locate a target value in a sorted array with logarithmic time complexity.',
    description: `Given an array of integers \`nums\` which is sorted in ascending order, and an integer \`target\`, write a function to search \`target\` in \`nums\`. If \`target\` exists, then return its index. Otherwise, return \`-1\`.

You must write an algorithm with \`O(log n)\` runtime complexity.`,
    examples: [
      {
        input: 'nums = [-1, 0, 3, 5, 9, 12], target = 9',
        output: '4',
        explanation: '9 exists in nums and its index is 4.'
      },
      {
        input: 'nums = [-1, 0, 3, 5, 9, 12], target = 2',
        output: '-1',
        explanation: '2 does not exist in nums so return -1.'
      }
    ],
    constraints: [
      '1 <= nums.length <= 10^4',
      '-10^4 < nums[i], target < 10^4',
      'All the integers in nums are unique.',
      'nums is sorted in ascending order.'
    ],
    keyPoints: [
      'Binary search divides the search space in half at every comparison.',
      'Avoid integer overflow when calculating midpoint: \`mid = low + (high - low) // 2\` instead of \`(low + high) // 2\` in languages with fixed integer sizes like C++ and Java.',
      'If \`nums[mid] == target\`, return \`mid\`.',
      'If \`nums[mid] < target\`, eliminate left half: \`low = mid + 1\`.',
      'If \`nums[mid] > target\`, eliminate right half: \`high = mid - 1\`.',
      'Loop continues while \`low <= high\`. If loop finishes without returning, target is absent: return -1.'
    ],
    timeComplexity: 'O(log N)',
    spaceComplexity: 'O(1)',
    companies: ['Microsoft', 'Apple', 'Google'],
    starterCode: {
      python: `def search(nums, target):
    l, r = 0, len(nums) - 1
    while l <= r:
        mid = (l + r) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            l = mid + 1
        else:
            r = mid - 1
    return -1

print(search([-1, 0, 3, 5, 9, 12], 9))
`,
      javascript: `function search(nums, target) {
  let l = 0, r = nums.length - 1;
  while (l <= r) {
    const mid = Math.floor(l + (r - l) / 2);
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) l = mid + 1;
    else r = mid - 1;
  }
  return -1;
}

console.log(search([-1, 0, 3, 5, 9, 12], 9));
`,
      cpp: `#include <iostream>
#include <vector>
using namespace std;

int search(vector<int>& nums, int target) {
    int l = 0, r = nums.size() - 1;
    while (l <= r) {
        int mid = l + (r - l) / 2;
        if (nums[mid] == target) return mid;
        if (nums[mid] < target) l = mid + 1;
        else r = mid - 1;
    }
    return -1;
}

int main() {
    vector<int> nums = {-1, 0, 3, 5, 9, 12};
    cout << search(nums, 9) << endl;
    return 0;
}
`,
      java: `public class Main {
    public static int search(int[] nums, int target) {
        int l = 0, r = nums.length - 1;
        while (l <= r) {
            int mid = l + (r - l) / 2;
            if (nums[mid] == target) return mid;
            if (nums[mid] < target) l = mid + 1;
            else r = mid - 1;
        }
        return -1;
    }

    public static void main(String[] args) {
        int[] nums = {-1, 0, 3, 5, 9, 12};
        System.out.println(search(nums, 9));
    }
}
`
    },
    solutionCode: {
      python: `def search(nums, target):
    l, r = 0, len(nums) - 1
    while l <= r:
        mid = (l + r) // 2
        if nums[mid] == target: return mid
        if nums[mid] < target: l = mid + 1
        else: r = mid - 1
    return -1
`,
      javascript: `function search(nums, target) {
  let l = 0, r = nums.length - 1;
  while (l <= r) {
    let mid = Math.floor(l + (r - l) / 2);
    if (nums[mid] === target) return mid;
    else if (nums[mid] < target) l = mid + 1;
    else r = mid - 1;
  }
  return -1;
}
`,
      cpp: `int search(vector<int>& nums, int target) {
    int l = 0, r = nums.size() - 1;
    while (l <= r) {
        int m = l + (r - l) / 2;
        if (nums[m] == target) return m;
        if (nums[m] < target) l = m + 1;
        else r = m - 1;
    }
    return -1;
}
`,
      java: `public int search(int[] nums, int target) {
    int l = 0, r = nums.length - 1;
    while (l <= r) {
        int m = l + (r - l) / 2;
        if (nums[m] == target) return m;
        if (nums[m] < target) l = m + 1;
        else r = m - 1;
    }
    return -1;
}
`
    },
    solutionExplanation: `Because the array is sorted, we compare target to the midpoint. If target is larger, it must reside in the right half; otherwise in the left half.
Each step cuts the remaining candidates by half, guaranteeing O(log N) operations.`,
    testCases: [
      { id: 't1', input: 'nums = [-1, 0, 3, 5, 9, 12], target = 9', expected: '4', label: 'Target present' },
      { id: 't2', input: 'nums = [-1, 0, 3, 5, 9, 12], target = 2', expected: '-1', label: 'Target absent' }
    ]
  },

  // ==========================================
  // LINKED LISTS
  // ==========================================
  {
    id: 'dsa-12',
    number: 12,
    title: 'Reverse Linked List',
    slug: 'reverse-linked-list',
    category: 'Linked Lists',
    difficulty: 'Easy',
    summary: 'Reverse a singly linked list and return its new head.',
    description: `Given the \`head\` of a singly linked list, reverse the list, and return the reversed list.`,
    examples: [
      {
        input: 'head = [1, 2, 3, 4, 5]',
        output: '[5, 4, 3, 2, 1]'
      },
      {
        input: 'head = [1, 2]',
        output: '[2, 1]'
      },
      { input: 'head = []', output: '[]' }
    ],
    constraints: ['The number of nodes in the list is the range [0, 5000].', '-5000 <= Node.val <= 5000'],
    keyPoints: [
      'Iterative pointer manipulation: Maintain three pointers \`prev = None\`, \`curr = head\`, and \`next_node\`.',
      'Step 1: Save next: \`next_node = curr.next\`.',
      'Step 2: Reverse link: \`curr.next = prev\`.',
      'Step 3: Move prev: \`prev = curr\`.',
      'Step 4: Move curr: \`curr = next_node\`.',
      'When curr is None, prev is pointing to the new head of the reversed list!',
      'O(N) time with O(1) space.'
    ],
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    companies: ['Amazon', 'Microsoft', 'Google', 'Adobe'],
    starterCode: {
      python: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def reverse_list(head):
    prev = None
    curr = head
    while curr:
        nxt = curr.next
        curr.next = prev
        prev = curr
        curr = nxt
    return prev

# Create 1 -> 2 -> 3
head = ListNode(1, ListNode(2, ListNode(3)))
new_head = reverse_list(head)
res = []
while new_head:
    res.append(new_head.val)
    new_head = new_head.next
print(res)
`,
      javascript: `function ListNode(val, next) {
  this.val = (val===undefined ? 0 : val);
  this.next = (next===undefined ? null : next);
}

function reverseList(head) {
  let prev = null;
  let curr = head;
  while (curr !== null) {
    const nextNode = curr.next;
    curr.next = prev;
    prev = curr;
    curr = nextNode;
  }
  return prev;
}

const list = new ListNode(1, new ListNode(2, new ListNode(3)));
let rev = reverseList(list);
const out = [];
while (rev) { out.push(rev.val); rev = rev.next; }
console.log(out);
`,
      cpp: `#include <iostream>
using namespace std;

struct ListNode {
    int val;
    ListNode *next;
    ListNode(int x) : val(x), next(NULL) {}
};

ListNode* reverseList(ListNode* head) {
    ListNode* prev = nullptr;
    ListNode* curr = head;
    while (curr != nullptr) {
        ListNode* nxt = curr->next;
        curr->next = prev;
        prev = curr;
        curr = nxt;
    }
    return prev;
}

int main() {
    ListNode* head = new ListNode(1);
    head->next = new ListNode(2);
    head->next->next = new ListNode(3);
    ListNode* rev = reverseList(head);
    while (rev) {
        cout << rev->val << " ";
        rev = rev->next;
    }
    cout << endl;
    return 0;
}
`,
      java: `class ListNode {
    int val;
    ListNode next;
    ListNode(int val) { this.val = val; }
}

public class Main {
    public static ListNode reverseList(ListNode head) {
        ListNode prev = null;
        ListNode curr = head;
        while (curr != null) {
            ListNode nextNode = curr.next;
            curr.next = prev;
            prev = curr;
            curr = nextNode;
        }
        return prev;
    }

    public static void main(String[] args) {
        ListNode head = new ListNode(1);
        head.next = new ListNode(2);
        ListNode rev = reverseList(head);
        while (rev != null) {
            System.out.print(rev.val + " ");
            rev = rev.next;
        }
        System.out.println();
    }
}
`
    },
    solutionCode: {
      python: `def reverse_list(head):
    prev, curr = None, head
    while curr:
        nxt = curr.next
        curr.next = prev
        prev = curr
        curr = nxt
    return prev
`,
      javascript: `function reverseList(head) {
  let prev = null, curr = head;
  while (curr) {
    [curr.next, prev, curr] = [prev, curr, curr.next];
  }
  return prev;
}
`,
      cpp: `ListNode* reverseList(ListNode* head) {
    ListNode *prev = nullptr, *cur = head;
    while (cur) {
        ListNode* nxt = cur->next;
        cur->next = prev;
        prev = cur;
        cur = nxt;
    }
    return prev;
}
`,
      java: `public ListNode reverseList(ListNode head) {
    ListNode prev = null, curr = head;
    while (curr != null) {
        ListNode nxt = curr.next;
        curr.next = prev;
        prev = curr;
        curr = nxt;
    }
    return prev;
}
`
    },
    solutionExplanation: `We iterate through the linked list once. At each node, we save \`curr.next\`, flip the pointer backward toward \`prev\`, and shift both \`prev\` and \`curr\` forward.
When the loop ends, \`prev\` references the new head.`,
    testCases: [
      { id: 't1', input: 'head = [1, 2, 3, 4, 5]', expected: '[5, 4, 3, 2, 1]', label: '5-node list' },
      { id: 't2', input: 'head = [1, 2]', expected: '[2, 1]', label: '2-node list' }
    ]
  },

  // ==========================================
  // TREES & BST
  // ==========================================
  {
    id: 'dsa-13',
    number: 13,
    title: 'Invert Binary Tree',
    slug: 'invert-binary-tree',
    category: 'Trees & BST',
    difficulty: 'Easy',
    summary: 'Invert a binary tree by swapping left and right subtrees recursively.',
    description: `Given the \`root\` of a binary tree, invert the tree, and return its root.`,
    examples: [
      {
        input: 'root = [4, 2, 7, 1, 3, 6, 9]',
        output: '[4, 7, 2, 9, 6, 3, 1]'
      },
      {
        input: 'root = [2, 1, 3]',
        output: '[2, 3, 1]'
      },
      { input: 'root = []', output: '[]' }
    ],
    constraints: ['The number of nodes in the tree is in the range [0, 100].', '-100 <= Node.val <= 100'],
    keyPoints: [
      'The famous Homebrew creator interview question ("Google: 90% of our engineers use the software you wrote (Homebrew), but you can’t invert a binary tree on a whiteboard so f*** off").',
      'Base case: If \`root is None\`, return \`None\`.',
      'Recursive step: Swap \`root.left\` and \`root.right\`.',
      'Recurse on the children: \`invertTree(root.left)\` and \`invertTree(root.right)\`.',
      'Return the inverted \`root\`. Takes O(N) time visiting each node exactly once.'
    ],
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(H) where H is tree height (recursion stack)',
    companies: ['Google', 'Amazon', 'Twitter'],
    starterCode: {
      python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def invert_tree(root):
    if not root:
        return None
    root.left, root.right = invert_tree(root.right), invert_tree(root.left)
    return root

# Test tree: 2 -> (1, 3)
root = TreeNode(2, TreeNode(1), TreeNode(3))
inv = invert_tree(root)
print("Inverted root:", inv.val, "left:", inv.left.val, "right:", inv.right.val)
`,
      javascript: `function TreeNode(val, left, right) {
  this.val = (val===undefined ? 0 : val);
  this.left = (left===undefined ? null : left);
  this.right = (right===undefined ? null : right);
}

function invertTree(root) {
  if (!root) return null;
  const temp = root.left;
  root.left = invertTree(root.right);
  root.right = invertTree(temp);
  return root;
}

const tree = new TreeNode(2, new TreeNode(1), new TreeNode(3));
const inv = invertTree(tree);
console.log("Inverted root left:", inv.left.val, "right:", inv.right.val);
`,
      cpp: `#include <iostream>
using namespace std;

struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode(int x) : val(x), left(NULL), right(NULL) {}
};

TreeNode* invertTree(TreeNode* root) {
    if (!root) return nullptr;
    TreeNode* temp = root->left;
    root->left = invertTree(root->right);
    root->right = invertTree(temp);
    return root;
}

int main() {
    TreeNode* root = new TreeNode(2);
    root->left = new TreeNode(1);
    root->right = new TreeNode(3);
    TreeNode* inv = invertTree(root);
    cout << "Left: " << inv->left->val << " Right: " << inv->right->val << endl;
    return 0;
}
`,
      java: `class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode(int val) { this.val = val; }
}

public class Main {
    public static TreeNode invertTree(TreeNode root) {
        if (root == null) return null;
        TreeNode left = invertTree(root.left);
        TreeNode right = invertTree(root.right);
        root.left = right;
        root.right = left;
        return root;
    }

    public static void main(String[] args) {
        TreeNode root = new TreeNode(2);
        root.left = new TreeNode(1);
        root.right = new TreeNode(3);
        TreeNode inv = invertTree(root);
        System.out.println("Left: " + inv.left.val + " Right: " + inv.right.val);
    }
}
`
    },
    solutionCode: {
      python: `def invert_tree(root):
    if not root: return None
    root.left, root.right = invert_tree(root.right), invert_tree(root.left)
    return root
`,
      javascript: `function invertTree(root) {
  if (!root) return null;
  [root.left, root.right] = [invertTree(root.right), invertTree(root.left)];
  return root;
}
`,
      cpp: `TreeNode* invertTree(TreeNode* root) {
    if (!root) return nullptr;
    swap(root->left, root->right);
    invertTree(root->left);
    invertTree(root->right);
    return root;
}
`,
      java: `public TreeNode invertTree(TreeNode root) {
    if (root == null) return null;
    TreeNode temp = root.left;
    root.left = invertTree(root.right);
    root.right = invertTree(temp);
    return root;
}
`
    },
    solutionExplanation: `To invert the binary tree, for every node we swap its left and right subtrees and recursively invoke the function on both children until we hit null leaves.`,
    testCases: [
      { id: 't1', input: 'root = [2, 1, 3]', expected: '[2, 3, 1]', label: '3-node tree' },
      { id: 't2', input: 'root = []', expected: '[]', label: 'Empty tree' }
    ]
  },
  {
    id: 'dsa-14',
    number: 14,
    title: 'Maximum Depth of Binary Tree',
    slug: 'maximum-depth-of-binary-tree',
    category: 'Trees & BST',
    difficulty: 'Easy',
    summary: 'Find the number of nodes along the longest path from the root down to the farthest leaf.',
    description: `Given the \`root\` of a binary tree, return its maximum depth.

A binary tree's **maximum depth** is the number of nodes along the longest path from the root node down to the farthest leaf node.`,
    examples: [
      {
        input: 'root = [3, 9, 20, null, null, 15, 7]',
        output: '3'
      },
      {
        input: 'root = [1, null, 2]',
        output: '2'
      }
    ],
    constraints: ['The number of nodes in the tree is in the range [0, 10^4].', '-100 <= Node.val <= 100'],
    keyPoints: [
      'Classic DFS (Depth First Search) recursion.',
      'Base condition: If \`root is None\`, depth is 0.',
      'Recurse on subtrees: \`1 + max(maxDepth(root.left), maxDepth(root.right))\`.',
      'Can also be solved iteratively using BFS (Level-order traversal) with a queue, counting how many levels are dequeued.'
    ],
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(H) recursion stack height',
    companies: ['Amazon', 'Google', 'Apple', 'LinkedIn'],
    starterCode: {
      python: `def max_depth(root):
    if not root:
        return 0
    return 1 + max(max_depth(root.left), max_depth(root.right))
`,
      javascript: `function maxDepth(root) {
  if (!root) return 0;
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}
`,
      cpp: `int maxDepth(TreeNode* root) {
    if (!root) return 0;
    return 1 + max(maxDepth(root->left), maxDepth(root->right));
}
`,
      java: `public int maxDepth(TreeNode root) {
    if (root == null) return 0;
    return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}
`
    },
    solutionCode: {
      python: `def max_depth(root):
    if not root:
        return 0
    return 1 + max(max_depth(root.left), max_depth(root.right))
`,
      javascript: `function maxDepth(root) {
  return root ? 1 + Math.max(maxDepth(root.left), maxDepth(root.right)) : 0;
}
`,
      cpp: `int maxDepth(TreeNode* root) {
    return root ? 1 + max(maxDepth(root->left), maxDepth(root->right)) : 0;
}
`,
      java: `public int maxDepth(TreeNode root) {
    return root == null ? 0 : 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}
`
    },
    solutionExplanation: `The maximum depth of a binary tree is 1 (for the root itself) plus the greater depth of its left or right child subtrees.`,
    testCases: [
      { id: 't1', input: 'root = [3, 9, 20, null, null, 15, 7]', expected: '3', label: '3-level tree' },
      { id: 't2', input: 'root = [1, null, 2]', expected: '2', label: 'Skewed tree' }
    ]
  },

  // ==========================================
  // DYNAMIC PROGRAMMING
  // ==========================================
  {
    id: 'dsa-15',
    number: 15,
    title: 'Climbing Stairs',
    slug: 'climbing-stairs',
    category: 'Dynamic Programming',
    difficulty: 'Easy',
    summary: 'Find how many distinct ways you can climb to the top taking 1 or 2 steps.',
    description: `You are climbing a staircase. It takes \`n\` steps to reach the top.

Each time you can either climb \`1\` or \`2\` steps. In how many distinct ways can you climb to the top?`,
    examples: [
      {
        input: 'n = 2',
        output: '2',
        explanation: 'There are two ways: (1) 1 step + 1 step, (2) 2 steps.'
      },
      {
        input: 'n = 3',
        output: '3',
        explanation: 'There are three ways: (1) 1+1+1, (2) 1+2, (3) 2+1.'
      }
    ],
    constraints: ['1 <= n <= 45'],
    keyPoints: [
      'Recognize subproblem overlap: To reach step `i`, you must come from either step `i-1` (with a 1-step hop) or step `i-2` (with a 2-step hop).',
      'Recurrence relation: `ways(i) = ways(i-1) + ways(i-2)`.',
      'This is mathematically identical to the Fibonacci sequence!',
      'Instead of an O(N) array or exponential O(2^N) recursion, store just the last two values (`a, b`) to achieve O(N) time and O(1) space.'
    ],
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    companies: ['Amazon', 'Google', 'Adobe', 'Apple'],
    starterCode: {
      python: `def climb_stairs(n: int) -> int:
    if n <= 2:
        return n
    a, b = 1, 2
    for _ in range(3, n + 1):
        a, b = b, a + b
    return b

print(climb_stairs(5))
`,
      javascript: `function climbStairs(n) {
  if (n <= 2) return n;
  let a = 1, b = 2;
  for (let i = 3; i <= n; i++) {
    const next = a + b;
    a = b;
    b = next;
  }
  return b;
}

console.log(climbStairs(5));
`,
      cpp: `#include <iostream>
using namespace std;

int climbStairs(int n) {
    if (n <= 2) return n;
    int a = 1, b = 2;
    for (int i = 3; i <= n; i++) {
        int next = a + b;
        a = b;
        b = next;
    }
    return b;
}

int main() {
    cout << climbStairs(5) << endl;
    return 0;
}
`,
      java: `public class Main {
    public static int climbStairs(int n) {
        if (n <= 2) return n;
        int a = 1, b = 2;
        for (int i = 3; i <= n; i++) {
            int next = a + b;
            a = b;
            b = next;
        }
        return b;
    }

    public static void main(String[] args) {
        System.out.println(climbStairs(5));
    }
}
`
    },
    solutionCode: {
      python: `def climb_stairs(n: int) -> int:
    a, b = 1, 1
    for _ in range(n):
        a, b = b, a + b
    return a
`,
      javascript: `function climbStairs(n) {
  let [a, b] = [1, 1];
  for (let i = 0; i < n; i++) {
    [a, b] = [b, a + b];
  }
  return a;
}
`,
      cpp: `int climbStairs(int n) {
    int a = 1, b = 1;
    while (n--) {
        b += a;
        a = b - a;
    }
    return a;
}
`,
      java: `public int climbStairs(int n) {
    int a = 1, b = 1;
    for (int i = 0; i < n; i++) {
        int temp = a;
        a = b;
        b = temp + b;
    }
    return a;
}
`
    },
    solutionExplanation: `At each step \`i\`, the total combinations are the sum of combinations to reach \`i-1\` and \`i-2\`.
Rolling two variables forward requires only O(N) loop iterations and constant O(1) memory.`,
    testCases: [
      { id: 't1', input: 'n = 2', expected: '2', label: 'Base 2' },
      { id: 't2', input: 'n = 3', expected: '3', label: 'Base 3' },
      { id: 't3', input: 'n = 5', expected: '8', label: 'Fibonacci 5' }
    ]
  },
  {
    id: 'dsa-16',
    number: 16,
    title: 'Coin Change',
    slug: 'coin-change',
    category: 'Dynamic Programming',
    difficulty: 'Medium',
    summary: 'Find the fewest number of coins needed to make up a given amount.',
    description: `You are given an integer array \`coins\` representing coins of different denominations and an integer \`amount\` representing a total amount of money.

Return the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return \`-1\`.

You may assume that you have an infinite number of each kind of coin.`,
    examples: [
      {
        input: 'coins = [1, 2, 5], amount = 11',
        output: '3',
        explanation: '11 = 5 + 5 + 1 (3 coins total).'
      },
      {
        input: 'coins = [2], amount = 3',
        output: '-1',
        explanation: 'Amount 3 cannot be formed with only coins of 2.'
      },
      { input: 'coins = [1], amount = 0', output: '0' }
    ],
    constraints: ['1 <= coins.length <= 12', '1 <= coins[i] <= 2^31 - 1', '0 <= amount <= 10^4'],
    keyPoints: [
      'Greedy fails here! (e.g. coins = [1, 3, 4], amount = 6. Greedy chooses 4 + 1 + 1 = 3 coins, but optimal is 3 + 3 = 2 coins).',
      'Dynamic Programming Bottom-Up: Let `dp[i]` be the minimum coins needed to make amount `i`.',
      'Initialize array `dp` of size `amount + 1` filled with `infinity` (or `amount + 1`), with `dp[0] = 0`.',
      'For each amount `i` from 1 to `amount`: For each coin: If `coin <= i`, `dp[i] = min(dp[i], dp[i - coin] + 1)`.',
      'Return `dp[amount]` if `dp[amount] <= amount` else `-1`.',
      'Time complexity: O(amount * len(coins)).'
    ],
    timeComplexity: 'O(Amount * N)',
    spaceComplexity: 'O(Amount)',
    companies: ['Amazon', 'Microsoft', 'Bloomberg'],
    starterCode: {
      python: `def coin_change(coins, amount):
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    for coin in coins:
        for i in range(coin, amount + 1):
            dp[i] = min(dp[i], dp[i - coin] + 1)
    return dp[amount] if dp[amount] != float('inf') else -1

print(coin_change([1, 2, 5], 11))
`,
      javascript: `function coinChange(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (const coin of coins) {
    for (let i = coin; i <= amount; i++) {
      dp[i] = Math.min(dp[i], dp[i - coin] + 1);
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}

console.log(coinChange([1, 2, 5], 11));
`,
      cpp: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int coinChange(vector<int>& coins, int amount) {
    vector<int> dp(amount + 1, amount + 1);
    dp[0] = 0;
    for (int coin : coins) {
        for (int i = coin; i <= amount; i++) {
            dp[i] = min(dp[i], dp[i - coin] + 1);
        }
    }
    return dp[amount] > amount ? -1 : dp[amount];
}

int main() {
    vector<int> coins = {1, 2, 5};
    cout << coinChange(coins, 11) << endl;
    return 0;
}
`,
      java: `import java.util.Arrays;

public class Main {
    public static int coinChange(int[] coins, int amount) {
        int[] dp = new int[amount + 1];
        Arrays.fill(dp, amount + 1);
        dp[0] = 0;
        for (int coin : coins) {
            for (int i = coin; i <= amount; i++) {
                dp[i] = Math.min(dp[i], dp[i - coin] + 1);
            }
        }
        return dp[amount] > amount ? -1 : dp[amount];
    }

    public static void main(String[] args) {
        int[] coins = {1, 2, 5};
        System.out.println(coinChange(coins, 11));
    }
}
`
    },
    solutionCode: {
      python: `def coin_change(coins, amount):
    dp = [0] + [float('inf')] * amount
    for coin in coins:
        for x in range(coin, amount + 1):
            dp[x] = min(dp[x], dp[x - coin] + 1)
    return dp[amount] if dp[amount] != float('inf') else -1
`,
      javascript: `function coinChange(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let c of coins) {
    for (let i = c; i <= amount; i++) {
      dp[i] = Math.min(dp[i], dp[i - c] + 1);
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}
`,
      cpp: `int coinChange(vector<int>& coins, int amount) {
    vector<int> dp(amount + 1, amount + 1);
    dp[0] = 0;
    for (int c : coins) {
        for (int i = c; i <= amount; i++) {
            dp[i] = min(dp[i], dp[i - c] + 1);
        }
    }
    return dp[amount] > amount ? -1 : dp[amount];
}
`,
      java: `public int coinChange(int[] coins, int amount) {
    int max = amount + 1;
    int[] dp = new int[amount + 1];
    Arrays.fill(dp, max);
    dp[0] = 0;
    for (int i = 1; i <= amount; i++) {
        for (int coin : coins) {
            if (coin <= i) {
                dp[i] = Math.min(dp[i], dp[i - coin] + 1);
            }
        }
    }
    return dp[amount] > amount ? -1 : dp[amount];
}
`
    },
    solutionExplanation: `We compute the minimum coins needed for all sub-amounts from 0 to \`amount\`.
For each coin denomination, any amount \`x >= coin\` can be built by adding one coin to \`dp[x - coin]\`.`,
    testCases: [
      { id: 't1', input: 'coins = [1, 2, 5], amount = 11', expected: '3', label: 'Amount 11' },
      { id: 't2', input: 'coins = [2], amount = 3', expected: '-1', label: 'Impossible amount' },
      { id: 't3', input: 'coins = [1], amount = 0', expected: '0', label: 'Zero amount' }
    ]
  },

  // ==========================================
  // GRAPHS & BFS/DFS
  // ==========================================
  {
    id: 'dsa-17',
    number: 17,
    title: 'Number of Islands',
    slug: 'number-of-islands',
    category: 'Graphs & BFS/DFS',
    difficulty: 'Medium',
    summary: 'Count distinct islands in a 2D binary grid using DFS/BFS.',
    description: `Given an \`m x n\` 2D binary grid \`grid\` which represents a map of \`'1'\`s (land) and \`'0'\`s (water), return the number of islands.

An **island** is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.`,
    examples: [
      {
        input: `grid = [
  ["1","1","1","1","0"],
  ["1","1","0","1","0"],
  ["1","1","0","0","0"],
  ["0","0","0","0","0"]
]`,
        output: '1'
      },
      {
        input: `grid = [
  ["1","1","0","0","0"],
  ["1","1","0","0","0"],
  ["0","0","1","0","0"],
  ["0","0","0","1","1"]
]`,
        output: '3'
      }
    ],
    constraints: [
      'm == grid.length',
      'n == grid[i].length',
      '1 <= m, n <= 300',
      'grid[i][j] is "0" or "1".'
    ],
    keyPoints: [
      'Classic grid graph traversal: each land cell \`"1"\` is a node with edges to up to 4 neighbors (up, down, left, right).',
      'Iterate through every cell in the grid. When you hit a \`"1"\`, increment your island counter by 1.',
      'Flood fill (DFS or BFS): immediately sink the island by changing connected \`"1"\`s to \`"0"\` (or marking visited) so they are never recounted.',
      'Boundary safety: ensure \`0 <= r < m\` and \`0 <= c < n\` before checking \`grid[r][c] == "1"\`.',
      'Time complexity is O(M * N) since each cell is visited a constant number of times.'
    ],
    timeComplexity: 'O(M * N)',
    spaceComplexity: 'O(M * N) recursion stack in worst-case (all land)',
    companies: ['Amazon', 'Google', 'Meta', 'Microsoft', 'Bloomberg'],
    starterCode: {
      python: `def num_islands(grid):
    if not grid:
        return 0
    m, n = len(grid), len(grid[0])
    islands = 0

    def dfs(r, c):
        if r < 0 or r >= m or c < 0 or c >= n or grid[r][c] != '1':
            return
        grid[r][c] = '0' # mark visited
        dfs(r + 1, c)
        dfs(r - 1, c)
        dfs(r, c + 1)
        dfs(r, c - 1)

    for i in range(m):
        for j in range(n):
            if grid[i][j] == '1':
                islands += 1
                dfs(i, j)
    return islands

grid = [
  ["1","1","0","0","0"],
  ["1","1","0","0","0"],
  ["0","0","1","0","0"],
  ["0","0","0","1","1"]
]
print("Number of islands:", num_islands(grid))
`,
      javascript: `function numIslands(grid) {
  if (!grid || !grid.length) return 0;
  const m = grid.length, n = grid[0].length;
  let count = 0;

  function dfs(r, c) {
    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] !== '1') return;
    grid[r][c] = '0';
    dfs(r + 1, c);
    dfs(r - 1, c);
    dfs(r, c + 1);
    dfs(r, c - 1);
  }

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (grid[i][j] === '1') {
        count++;
        dfs(i, j);
      }
    }
  }
  return count;
}

const g = [
  ["1","1","0","0","0"],
  ["1","1","0","0","0"],
  ["0","0","1","0","0"],
  ["0","0","0","1","1"]
];
console.log("Islands:", numIslands(g));
`,
      cpp: `#include <iostream>
#include <vector>
using namespace std;

void dfs(vector<vector<char>>& grid, int r, int c) {
    int m = grid.size(), n = grid[0].size();
    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] != '1') return;
    grid[r][c] = '0';
    dfs(grid, r + 1, c);
    dfs(grid, r - 1, c);
    dfs(grid, r, c + 1);
    dfs(grid, r, c - 1);
}

int numIslands(vector<vector<char>>& grid) {
    if (grid.empty()) return 0;
    int m = grid.size(), n = grid[0].size();
    int count = 0;
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            if (grid[i][j] == '1') {
                count++;
                dfs(grid, i, j);
            }
        }
    }
    return count;
}

int main() {
    vector<vector<char>> g = {
        {'1','1','0','0','0'},
        {'1','1','0','0','0'},
        {'0','0','1','0','0'},
        {'0','0','0','1','1'}
    };
    cout << "Islands: " << numIslands(g) << endl;
    return 0;
}
`,
      java: `public class Main {
    public static void dfs(char[][] grid, int r, int c) {
        int m = grid.length, n = grid[0].length;
        if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] != '1') return;
        grid[r][c] = '0';
        dfs(grid, r + 1, c);
        dfs(grid, r - 1, c);
        dfs(grid, r, c + 1);
        dfs(grid, r, c - 1);
    }

    public static int numIslands(char[][] grid) {
        if (grid == null || grid.length == 0) return 0;
        int m = grid.length, n = grid[0].length;
        int count = 0;
        for (int i = 0; i < m; i++) {
            for (int j = 0; j < n; j++) {
                if (grid[i][j] == '1') {
                    count++;
                    dfs(grid, i, j);
                }
            }
        }
        return count;
    }

    public static void main(String[] args) {
        char[][] g = {
            {'1','1','0','0','0'},
            {'1','1','0','0','0'},
            {'0','0','1','0','0'},
            {'0','0','0','1','1'}
        };
        System.out.println("Islands: " + numIslands(g));
    }
}
`
    },
    solutionCode: {
      python: `def num_islands(grid):
    if not grid: return 0
    m, n, count = len(grid), len(grid[0]), 0

    def dfs(r, c):
        if 0 <= r < m and 0 <= c < n and grid[r][c] == '1':
            grid[r][c] = '0'
            for dr, dc in [(1,0), (-1,0), (0,1), (0,-1)]:
                dfs(r + dr, c + dc)

    for i in range(m):
        for j in range(n):
            if grid[i][j] == '1':
                count += 1
                dfs(i, j)
    return count
`,
      javascript: `function numIslands(grid) {
  let count = 0;
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[0].length; j++) {
      if (grid[i][j] === '1') {
        count++;
        sink(grid, i, j);
      }
    }
  }
  return count;
}

function sink(grid, r, c) {
  if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length || grid[r][c] !== '1') return;
  grid[r][c] = '0';
  sink(grid, r+1, c);
  sink(grid, r-1, c);
  sink(grid, r, c+1);
  sink(grid, r, c-1);
}
`,
      cpp: `int numIslands(vector<vector<char>>& grid) {
    int m = grid.size(), n = grid[0].size(), count = 0;
    auto dfs = [&](auto& self, int r, int c) -> void {
        if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] != '1') return;
        grid[r][c] = '0';
        self(self, r + 1, c);
        self(self, r - 1, c);
        self(self, r, c + 1);
        self(self, r, c - 1);
    };
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            if (grid[i][j] == '1') {
                count++;
                dfs(dfs, i, j);
            }
        }
    }
    return count;
}
`,
      java: `public int numIslands(char[][] grid) {
    int count = 0;
    for (int i = 0; i < grid.length; i++) {
        for (int j = 0; j < grid[0].length; j++) {
            if (grid[i][j] == '1') {
                dfs(grid, i, j);
                count++;
            }
        }
    }
    return count;
}

private void dfs(char[][] grid, int i, int j) {
    if (i < 0 || j < 0 || i >= grid.length || j >= grid[0].length || grid[i][j] != '1') return;
    grid[i][j] = '0';
    dfs(grid, i + 1, j);
    dfs(grid, i - 1, j);
    dfs(grid, i, j + 1);
    dfs(grid, i, j - 1);
}
`
    },
    solutionExplanation: `We scan every grid position. When an unvisited land cell \`"1"\` is found, it represents a new island.
We trigger a Depth-First Search (DFS) that floods outwards in all 4 cardinal directions, mutating all visited land cells to \`"0"\` so they are not counted again.`,
    testCases: [
      { id: 't1', input: 'Single connected island', expected: '1', label: 'Single giant island' },
      { id: 't2', input: '3 isolated islands', expected: '3', label: 'Multiple islands' }
    ]
  }
];
