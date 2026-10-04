import { DsaProblem } from './types';

export const ARRAYS_HASHING_PROBLEMS: DsaProblem[] = [
  {
    id: 'dsa-ah-01',
    number: 1,
    title: 'Contains Duplicate',
    slug: 'contains-duplicate',
    category: 'Arrays & Hashing',
    difficulty: 'Easy',
    summary: 'Check if an array contains any duplicate elements.',
    description: `Given an integer array \`nums\`, return \`true\` if any value appears **at least twice** in the array, and return \`false\` if every element is distinct.`,
    examples: [
      {
        input: 'nums = [1,2,3,1]',
        output: 'true',
        explanation: 'The element 1 occurs at the indices 0 and 3.'
      },
      {
        input: 'nums = [1,2,3,4]',
        output: 'false',
        explanation: 'All elements are distinct.'
      }
    ],
    constraints: [
      '1 <= nums.length <= 10^5',
      '-10^9 <= nums[i] <= 10^9'
    ],
    keyPoints: [
      '**Brute Force**: Compare every pair $(i, j)$. Time O(N^2), Space O(1). Too slow for large N.',
      '**Core Insight**: Use a HashSet to track seen numbers. As you iterate, check if the current number is already in the set. If yes, duplicate found. If no, add it to the set.',
      '**Edge Cases**: Empty array (not possible per constraints), single element array, arrays with negative numbers or zeros.',
      '**Space-Time Analysis**: O(N) time complexity due to single pass. O(N) space complexity for storing up to N unique elements in the hash set.'
    ],
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(N)',
    companies: ['Amazon', 'Microsoft', 'Google'],
    starterCode: {
      python: `def containsDuplicate(nums):
    # TODO: Implement using HashSet
    pass

# Test Execution
if __name__ == "__main__":
    print(containsDuplicate([1,2,3,1])) # Expected: True
    print(containsDuplicate([1,2,3,4])) # Expected: False`,
      javascript: `/**
 * @param {number[]} nums
 * @return {boolean}
 */
var containsDuplicate = function(nums) {
    // TODO: Implement using Set
};

// Test Execution
console.log(containsDuplicate([1,2,3,1])); // Expected: true
console.log(containsDuplicate([1,2,3,4])); // Expected: false`,
      cpp: `#include <vector>
#include <unordered_set>
#include <iostream>
using namespace std;

bool containsDuplicate(vector<int>& nums) {
    // TODO: Implement using unordered_set
    return false;
}

int main() {
    vector<int> n1 = {1, 2, 3, 1};
    cout << (containsDuplicate(n1) ? "true" : "false") << endl; // Expected: true
    
    vector<int> n2 = {1, 2, 3, 4};
    cout << (containsDuplicate(n2) ? "true" : "false") << endl; // Expected: false
    return 0;
}`,
      java: `import java.util.*;

public class Solution {
    public static boolean containsDuplicate(int[] nums) {
        // TODO: Implement using HashSet
        return false;
    }

    public static void main(String[] args) {
        int[] n1 = {1, 2, 3, 1};
        System.out.println(containsDuplicate(n1)); // Expected: true
        
        int[] n2 = {1, 2, 3, 4};
        System.out.println(containsDuplicate(n2)); // Expected: false
    }
}`
    },
    solutionCode: {
      python: `def containsDuplicate(nums):
    seen = set()
    for num in nums:
        if num in seen:
            return True
        seen.add(num)
    return False`,
      javascript: `var containsDuplicate = function(nums) {
    const seen = new Set();
    for (let num of nums) {
        if (seen.has(num)) {
            return true;
        }
        seen.add(num);
    }
    return false;
};`,
      cpp: `bool containsDuplicate(vector<int>& nums) {
    unordered_set<int> seen;
    for (int num : nums) {
        if (seen.find(num) != seen.end()) {
            return true;
        }
        seen.insert(num);
    }
    return false;
}`,
      java: `public static boolean containsDuplicate(int[] nums) {
    Set<Integer> seen = new HashSet<>();
    for (int num : nums) {
        if (seen.contains(num)) {
            return true;
        }
        seen.add(num);
    }
    return false;
}`
    },
    solutionExplanation: `We initialize an empty hash set. We iterate through the array. For each element, we first check if it exists in the set. If it does, we have found a duplicate and immediately return \`true\`. If it doesn't exist, we add it to the set and continue. If the loop finishes without finding duplicates, we return \`false\`. This approach ensures O(1) average time complexity for lookups and insertions in the hash set.`,
    testCases: [
      { id: 'tc-1', input: '[1,2,3,1]', expected: 'true' },
      { id: 'tc-2', input: '[1,2,3,4]', expected: 'false' },
      { id: 'tc-3', input: '[1,1,1,3,3,4,3,2,4,2]', expected: 'true' }
    ]
  },
  {
    id: 'dsa-ah-02',
    number: 2,
    title: 'Valid Anagram',
    slug: 'valid-anagram',
    category: 'Arrays & Hashing',
    difficulty: 'Easy',
    summary: 'Determine if two strings are anagrams of each other.',
    description: `Given two strings \`s\` and \`t\`, return \`true\` if \`t\` is an anagram of \`s\`, and \`false\` otherwise.\n\nAn **anagram** is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.`,
    examples: [
      {
        input: 's = "anagram", t = "nagaram"',
        output: 'true',
        explanation: 'Both strings contain the same characters with the same frequencies.'
      },
      {
        input: 's = "rat", t = "car"',
        output: 'false',
        explanation: 'Characters do not match.'
      }
    ],
    constraints: [
      '1 <= s.length, t.length <= 5 * 10^4',
      's and t consist of lowercase English letters.'
    ],
    keyPoints: [
      '**Brute Force**: Sort both strings and compare. Time O(N log N), Space O(1) or O(N) depending on sort implementation.',
      '**Core Insight**: Frequency Counting. Use a hashmap or fixed-size array (size 26) to count character occurrences in \`s\`. Decrement counts for characters in \`t\`. If all counts end up zero, they are anagrams.',
      '**Edge Cases**: Different lengths (immediate false), empty strings, Unicode characters (problem specifies lowercase English, so array size 26 works).',
      '**Space-Time Analysis**: O(N) time for counting. O(1) space since alphabet size is constant (26).'
    ],
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    companies: ['Amazon', 'Facebook', 'Uber'],
    starterCode: {
      python: `def isAnagram(s, t):
    # TODO: Implement frequency counting
    pass

# Test Execution
if __name__ == "__main__":
    print(isAnagram("anagram", "nagaram")) # Expected: True
    print(isAnagram("rat", "car"))         # Expected: False`,
      javascript: `/**
 * @param {string} s
 * @param {string} t
 * @return {boolean}
 */
var isAnagram = function(s, t) {
    // TODO: Implement frequency counting
};

// Test Execution
console.log(isAnagram("anagram", "nagaram")); // Expected: true
console.log(isAnagram("rat", "car"));         // Expected: false`,
      cpp: `#include <string>
#include <vector>
#include <iostream>
using namespace std;

bool isAnagram(string s, string t) {
    // TODO: Implement frequency counting
    return false;
}

int main() {
    cout << (isAnagram("anagram", "nagaram") ? "true" : "false") << endl; // Expected: true
    cout << (isAnagram("rat", "car") ? "true" : "false") << endl;         // Expected: false
    return 0;
}`,
      java: `import java.util.*;

public class Solution {
    public static boolean isAnagram(String s, String t) {
        // TODO: Implement frequency counting
        return false;
    }

    public static void main(String[] args) {
        System.out.println(isAnagram("anagram", "nagaram")); // Expected: true
        System.out.println(isAnagram("rat", "car"));         // Expected: false
    }
}`
    },
    solutionCode: {
      python: `def isAnagram(s, t):
    if len(s) != len(t):
        return False
        
    count = {}
    for char in s:
        count[char] = count.get(char, 0) + 1
        
    for char in t:
        if char not in count:
            return False
        count[char] -= 1
        if count[char] == 0:
            del count[char]
            
    return len(count) == 0`,
      javascript: `var isAnagram = function(s, t) {
    if (s.length !== t.length) return false;
    
    const count = {};
    for (let char of s) {
        count[char] = (count[char] || 0) + 1;
    }
    
    for (let char of t) {
        if (!count[char]) return false;
        count[char]--;
    }
    
    return true;
};`,
      cpp: `bool isAnagram(string s, string t) {
    if (s.length() != t.length()) return false;
    
    vector<int> freq(26, 0);
    
    for (char c : s) {
        freq[c - 'a']++;
    }
    
    for (char c : t) {
        freq[c - 'a']--;
        if (freq[c - 'a'] < 0) return false;
    }
    
    return true;
}`,
      java: `public static boolean isAnagram(String s, String t) {
    if (s.length() != t.length()) return false;
    
    int[] freq = new int[26];
    
    for (char c : s.toCharArray()) {
        freq[c - 'a']++;
    }
    
    for (char c : t.toCharArray()) {
        freq[c - 'a']--;
        if (freq[c - 'a'] < 0) return false;
    }
    
    return true;
}`
    },
    solutionExplanation: `First, check if lengths differ; if so, return false. Then, use a frequency map (or array of size 26 for lowercase letters). Iterate through string \`s\` to increment counts for each character. Next, iterate through string \`t\` to decrement counts. If a character in \`t\` is not found in the map or its count goes below zero, return false. If the loop completes successfully, the strings are anagrams.`,
    testCases: [
      { id: 'tc-1', input: 's="anagram", t="nagaram"', expected: 'true' },
      { id: 'tc-2', input: 's="rat", t="car"', expected: 'false' },
      { id: 'tc-3', input: 's="aacc", t="ccac"', expected: 'true' }
    ]
  },
  {
    id: 'dsa-ah-03',
    number: 3,
    title: 'Two Sum',
    slug: 'two-sum',
    category: 'Arrays & Hashing',
    difficulty: 'Easy',
    summary: 'Find indices of two numbers that add up to target.',
    description: `Given an array of integers \`nums\` and an integer \`target\`, return *indices of the two numbers such that they add up to*\`\` target\`\`. You may assume that each input would have ***exactly one solution***, and you may not use the *same* element twice.\n\nYou can return the answer in any order.`,
    examples: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
      },
      {
        input: 'nums = [3,2,4], target = 6',
        output: '[1,2]',
        explanation: 'Because nums[1] + nums[2] == 6, we return [1, 2].'
      }
    ],
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Only one valid answer exists.'
    ],
    keyPoints: [
      '**Brute Force**: Nested loops checking all pairs. Time O(N^2), Space O(1). TLE for large inputs.',
      '**Core Insight**: Hash Map Lookup. Store \`value -> index\` as we iterate. For current number \`x\`, check if \`target - x\` exists in the map. If yes, we found the pair.',
      '**Edge Cases**: Negative numbers, zeros, duplicate values in array (handled by storing latest index or checking before insertion).',
      '**Space-Time Analysis**: O(N) time for single pass. O(N) space for hash map storage.'
    ],
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(N)',
    companies: ['Amazon', 'Google', 'Microsoft', 'Meta'],
    starterCode: {
      python: `def twoSum(nums, target):
    # TODO: Implement hash map lookup
    pass

# Test Execution
if __name__ == "__main__":
    print(twoSum([2,7,11,15], 9)) # Expected: [0, 1]
    print(twoSum([3,2,4], 6))     # Expected: [1, 2]`,
      javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    // TODO: Implement hash map lookup
};

// Test Execution
console.log(twoSum([2,7,11,15], 9)); // Expected: [0, 1]
console.log(twoSum([3,2,4], 6));     // Expected: [1, 2]`,
      cpp: `#include <vector>
#include <unordered_map>
#include <iostream>
using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {
    // TODO: Implement hash map lookup
    return {};
}

void printVec(const vector<int>& v) {
    cout << "[";
    for(size_t i=0; i<v.size(); ++i) {
        cout << v[i];
        if(i < v.size()-1) cout << ",";
    }
    cout << "]" << endl;
}

int main() {
    vector<int> n1 = {2, 7, 11, 15};
    printVec(twoSum(n1, 9)); // Expected: [0,1]
    
    vector<int> n2 = {3, 2, 4};
    printVec(twoSum(n2, 6)); // Expected: [1,2]
    return 0;
}`,
      java: `import java.util.*;

public class Solution {
    public static int[] twoSum(int[] nums, int target) {
        // TODO: Implement hash map lookup
        return new int[0];
    }

    public static void main(String[] args) {
        int[] n1 = {2, 7, 11, 15};
        System.out.println(Arrays.toString(twoSum(n1, 9))); // Expected: [0, 1]
        
        int[] n2 = {3, 2, 4};
        System.out.println(Arrays.toString(twoSum(n2, 6))); // Expected: [1, 2]
    }
}`
    },
    solutionCode: {
      python: `def twoSum(nums, target):
    prevMap = {} # val -> index
    
    for i, n in enumerate(nums):
        diff = target - n
        if diff in prevMap:
            return [prevMap[diff], i]
        prevMap[n] = i
        
    return []`,
      javascript: `var twoSum = function(nums, target) {
    const prevMap = new Map(); // val -> index
    
    for (let i = 0; i < nums.length; i++) {
        const diff = target - nums[i];
        if (prevMap.has(diff)) {
            return [prevMap.get(diff), i];
        }
        prevMap.set(nums[i], i);
    }
    
    return [];
};`,
      cpp: `vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> prevMap; // val -> index
    
    for (int i = 0; i < nums.size(); ++i) {
        int diff = target - nums[i];
        if (prevMap.find(diff) != prevMap.end()) {
            return {prevMap[diff], i};
        }
        prevMap[nums[i]] = i;
    }
    
    return {};
}`,
      java: `public static int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> prevMap = new HashMap<>(); // val -> index
    
    for (int i = 0; i < nums.length; i++) {
        int diff = target - nums[i];
        if (prevMap.containsKey(diff)) {
            return new int[]{prevMap.get(diff), i};
        }
        prevMap.put(nums[i], i);
    }
    
    return new int[0];
}`
    },
    solutionExplanation: `We iterate through the array while maintaining a hash map of previously seen numbers mapped to their indices. For each number \`nums[i]\`, we calculate the complement \`target - nums[i]\`. If this complement exists in our map, it means we have already encountered the other number needed to form the sum. We return the stored index and the current index. Otherwise, we store the current number and its index in the map and proceed.`,
    testCases: [
      { id: 'tc-1', input: 'nums=[2,7,11,15], target=9', expected: '[0,1]' },
      { id: 'tc-2', input: 'nums=[3,2,4], target=6', expected: '[1,2]' },
      { id: 'tc-3', input: 'nums=[3,3], target=6', expected: '[0,1]' }
    ]
  },
  {
    id: 'dsa-ah-04',
    number: 4,
    title: 'Group Anagrams',
    slug: 'group-anagrams',
    category: 'Arrays & Hashing',
    difficulty: 'Medium',
    summary: 'Group strings that are anagrams of each other.',
    description: `Given an array of strings \`strs\`, group the **anagrams** together. You can return the answer in **any order**.`,
    examples: [
      {
        input: 'strs = ["eat","tea","tan","ate","nat","bat"]',
        output: '[["bat"],["nat","tan"],["ate","eat","tea"]]',
        explanation: 'Strings with same sorted characters or frequency signatures are grouped.'
      },
      {
        input: 'strs = [""]',
        output: '[[""]]'
      }
    ],
    constraints: [
      '1 <= strs.length <= 10^4',
      '0 <= strs[i].length <= 100',
      'strs[i] consists of lowercase English letters.'
    ],
    keyPoints: [
      '**Brute Force**: Compare every pair of strings for anagram status. Time O(N^2 * K log K). Too slow.',
      '**Core Insight**: Canonical Form Key. Create a unique signature for each string. Two common methods: 1) Sorted string (e.g., "eat" -> "aet"). 2) Frequency array converted to tuple/string (e.g., [1,0,...,1,0...,1]). Use this signature as key in a HashMap mapping to list of strings.',
      '**Edge Cases**: Empty strings, single character strings, large groups.',
      '**Space-Time Analysis**: O(N * K log K) time if sorting, or O(N * K) if using frequency counts. O(N * K) space for storage.'
    ],
    timeComplexity: 'O(N * K log K)',
    spaceComplexity: 'O(N * K)',
    companies: ['Amazon', 'Bloomberg', 'Uber'],
    starterCode: {
      python: `def groupAnagrams(strs):
    # TODO: Implement grouping using hash map
    pass

# Test Execution
if __name__ == "__main__":
    res = groupAnagrams(["eat","tea","tan","ate","nat","bat"])
    # Sort inner lists and outer list for consistent printing
    res_sorted = [sorted(group) for group in res]
    res_sorted.sort()
    print(res_sorted) # Expected: [['ate', 'eat', 'tea'], ['bat'], ['nat', 'tan']]`,
      javascript: `/**
 * @param {string[]} strs
 * @return {string[][]}
 */
var groupAnagrams = function(strs) {
    // TODO: Implement grouping using hash map
};

// Test Execution
const res = groupAnagrams(["eat","tea","tan","ate","nat","bat"]);
// Normalize for display
const normalized = res.map(g => g.sort()).sort((a,b) => a[0].localeCompare(b[0]));
console.log(JSON.stringify(normalized)); // Expected: [["ate","eat","tea"],["bat"],["nat","tan"]]`,
      cpp: `#include <vector>
#include <string>
#include <unordered_map>
#include <algorithm>
#include <iostream>
using namespace std;

vector<vector<string>> groupAnagrams(vector<string>& strs) {
    // TODO: Implement grouping using hash map
    return {};
}

void printRes(const vector<vector<string>>& res) {
    cout << "[";
    for(size_t i=0; i<res.size(); ++i) {
        cout << "[";
        vector<string> temp = res[i];
        sort(temp.begin(), temp.end());
        for(size_t j=0; j<temp.size(); ++j) {
            cout << "\\"" << temp[j] << "\\"";
            if(j < temp.size()-1) cout << ",";
        }
        cout << "]";
        if(i < res.size()-1) cout << ",";
    }
    cout << "]" << endl;
}

int main() {
    vector<string> strs = {"eat","tea","tan","ate","nat","bat"};
    auto res = groupAnagrams(strs);
    // Note: Order of groups might vary, but content should match
    printRes(res); 
    return 0;
}`,
      java: `import java.util.*;

public class Solution {
    public static List<List<String>> groupAnagrams(String[] strs) {
        // TODO: Implement grouping using hash map
        return new ArrayList<>();
    }

    public static void main(String[] args) {
        String[] strs = {"eat","tea","tan","ate","nat","bat"};
        List<List<String>> res = groupAnagrams(strs);
        // Print helper omitted for brevity, logic similar to others
        System.out.println(res);
    }
}`
    },
    solutionCode: {
      python: `def groupAnagrams(strs):
    res = {} # key: canonical form, value: list of strings
    
    for s in strs:
        # Method 1: Sorting
        key = ''.join(sorted(s))
        
        if key not in res:
            res[key] = []
        res[key].append(s)
        
    return list(res.values())`,
      javascript: `var groupAnagrams = function(strs) {
    const map = new Map();
    
    for (let str of strs) {
        const key = str.split('').sort().join('');
        if (!map.has(key)) {
            map.set(key, []);
        }
        map.get(key).push(str);
    }
    
    return Array.from(map.values());
};`,
      cpp: `vector<vector<string>> groupAnagrams(vector<string>& strs) {
    unordered_map<string, vector<string>> mp;
    
    for (string& s : strs) {
        string key = s;
        sort(key.begin(), key.end());
        mp[key].push_back(s);
    }
    
    vector<vector<string>> result;
    for (auto& pair : mp) {
        result.push_back(pair.second);
    }
    
    return result;
}`,
      java: `public static List<List<String>> groupAnagrams(String[] strs) {
    Map<String, List<String>> map = new HashMap<>();
    
    for (String str : strs) {
        char[] chars = str.toCharArray();
        Arrays.sort(chars);
        String key = new String(chars);
        
        map.computeIfAbsent(key, k -> new ArrayList<>()).add(str);
    }
    
    return new ArrayList<>(map.values());
}`
    },
    solutionExplanation: `We use a hash map where the key is a canonical representation of an anagram group. A simple way to generate this key is to sort the characters of the string. All anagrams will produce the same sorted string. We iterate through the input array, compute the key for each string, and append the original string to the list associated with that key in the map. Finally, we return all the values from the map.`,
    testCases: [
      { id: 'tc-1', input: '["eat","tea","tan","ate","nat","bat"]', expected: '[["ate","eat","tea"],["bat"],["nat","tan"]]' },
      { id: 'tc-2', input: '[""]', expected: '[[""]]' },
      { id: 'tc-3', input: '["a"]', expected: '[["a"]]' }
    ]
  },
  {
    id: 'dsa-ah-05',
    number: 5,
    title: 'Top K Frequent Elements',
    slug: 'top-k-frequent-elements',
    category: 'Arrays & Hashing',
    difficulty: 'Medium',
    summary: 'Return the k most frequent elements in an array.',
    description: `Given an integer array \`nums\` and an integer \`k\`, return *the*\`\` k\`\` *most frequent elements*. You may return the answer in **any order**.`,
    examples: [
      {
        input: 'nums = [1,1,1,2,2,3], k = 2',
        output: '[1,2]',
        explanation: 'Elements 1 and 2 appear most frequently.'
      },
      {
        input: 'nums = [1], k = 1',
        output: '[1]'
      }
    ],
    constraints: [
      '1 <= nums.length <= 10^5',
      '-10^4 <= nums[i] <= 10^4',
      'k is in the range [1, the number of unique elements in the array].'
    ],
    keyPoints: [
      '**Brute Force**: Count frequencies, then sort all unique elements by frequency descending. Take top K. Time O(U log U) where U is unique elements.',
      '**Core Insight**: Bucket Sort. Since max frequency is N, create buckets indexed by frequency. Place elements into bucket[freq]. Iterate buckets from highest index down to collect K elements. Time O(N).',
      '**Alternative Insight**: Min-Heap of size K. Push elements onto heap based on frequency. Pop if size > K. Time O(N log K).',
      '**Space-Time Analysis**: Bucket Sort is preferred for O(N) time. Space O(N) for counts and buckets.'
    ],
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(N)',
    companies: ['Amazon', 'Meta', 'LinkedIn', 'Uber'],
    starterCode: {
      python: `from collections import Counter

def topKFrequent(nums, k):
    # TODO: Implement bucket sort or heap
    pass

# Test Execution
if __name__ == "__main__":
    print(topKFrequent([1,1,1,2,2,3], 2)) # Expected: [1, 2] (order may vary)
    print(topKFrequent([1], 1))           # Expected: [1]`,
      javascript: `/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number[]}
 */
var topKFrequent = function(nums, k) {
    // TODO: Implement bucket sort or heap
};

// Test Execution
console.log(topKFrequent([1,1,1,2,2,3], 2)); // Expected: [1, 2]
console.log(topKFrequent([1], 1));           // Expected: [1]`,
      cpp: `#include <vector>
#include <unordered_map>
#include <queue>
#include <iostream>
using namespace std;

vector<int> topKFrequent(vector<int>& nums, int k) {
    // TODO: Implement bucket sort or heap
    return {};
}

void printVec(const vector<int>& v) {
    cout << "[";
    for(size_t i=0; i<v.size(); ++i) {
        cout << v[i];
        if(i < v.size()-1) cout << ",";
    }
    cout << "]" << endl;
}

int main() {
    vector<int> n1 = {1, 1, 1, 2, 2, 3};
    printVec(topKFrequent(n1, 2)); // Expected: [1, 2]
    
    vector<int> n2 = {1};
    printVec(topKFrequent(n2, 1)); // Expected: [1]
    return 0;
}`,
      java: `import java.util.*;

public class Solution {
    public static int[] topKFrequent(int[] nums, int k) {
        // TODO: Implement bucket sort or heap
        return new int[0];
    }

    public static void main(String[] args) {
        int[] n1 = {1, 1, 1, 2, 2, 3};
        System.out.println(Arrays.toString(topKFrequent(n1, 2))); // Expected: [1, 2]
        
        int[] n2 = {1};
        System.out.println(Arrays.toString(topKFrequent(n2, 1))); // Expected: [1]
    }
}`
    },
    solutionCode: {
      python: `from collections import Counter

def topKFrequent(nums, k):
    count = Counter(nums)
    freq_map = [[] for _ in range(len(nums) + 1)]
    
    for num, freq in count.items():
        freq_map[freq].append(num)
        
    res = []
    for i in range(len(freq_map) - 1, 0, -1):
        for num in freq_map[i]:
            res.append(num)
            if len(res) == k:
                return res
                
    return res`,
      javascript: `var topKFrequent = function(nums, k) {
    const count = new Map();
    for (let num of nums) {
        count.set(num, (count.get(num) || 0) + 1);
    }
    
    const freqMap = new Array(nums.length + 1).fill(null).map(() => []);
    
    for (let [num, freq] of count.entries()) {
        freqMap[freq].push(num);
    }
    
    const res = [];
    for (let i = freqMap.length - 1; i >= 1 && res.length < k; i--) {
        for (let num of freqMap[i]) {
            res.push(num);
            if (res.length === k) break;
        }
    }
    
    return res;
};`,
      cpp: `vector<int> topKFrequent(vector<int>& nums, int k) {
    unordered_map<int, int> count;
    for (int num : nums) {
        count[num]++;
    }
    
    vector<vector<int>> freqMap(nums.size() + 1);
    for (auto& pair : count) {
        freqMap[pair.second].push_back(pair.first);
    }
    
    vector<int> res;
    for (int i = nums.size(); i >= 1 && res.size() < k; --i) {
        for (int num : freqMap[i]) {
            res.push_back(num);
            if (res.size() == k) break;
        }
    }
    
    return res;
}`,
      java: `public static int[] topKFrequent(int[] nums, int k) {
    Map<Integer, Integer> count = new HashMap<>();
    for (int num : nums) {
        count.put(num, count.getOrDefault(num, 0) + 1);
    }
    
    List<Integer>[] freqMap = new List[nums.length + 1];
    for (int i = 0; i < freqMap.length; i++) {
        freqMap[i] = new ArrayList<>();
    }
    
    for (Map.Entry<Integer, Integer> entry : count.entrySet()) {
        freqMap[entry.getValue()].add(entry.getKey());
    }
    
    List<Integer> resList = new ArrayList<>();
    for (int i = nums.length; i >= 1 && resList.size() < k; i--) {
        for (int num : freqMap[i]) {
            resList.add(num);
            if (resList.size() == k) break;
        }
    }
    
    return resList.stream().mapToInt(Integer::intValue).toArray();
}`
    },
    solutionExplanation: `First, count the frequency of each element using a hash map. Then, create a "bucket" array where the index represents the frequency. Place each element into the bucket corresponding to its frequency. Finally, iterate through the buckets from the highest frequency (end of array) downwards, collecting elements until we have gathered \`k\` items. This achieves linear time complexity O(N).`,
    testCases: [
      { id: 'tc-1', input: 'nums=[1,1,1,2,2,3], k=2', expected: '[1,2]' },
      { id: 'tc-2', input: 'nums=[1], k=1', expected: '[1]' },
      { id: 'tc-3', input: 'nums=[1,2], k=2', expected: '[1,2]' }
    ]
  },
  {
    id: 'dsa-ah-06',
    number: 6,
    title: 'Product of Array Except Self',
    slug: 'product-of-array-except-self',
    category: 'Arrays & Hashing',
    difficulty: 'Medium',
    summary: 'Compute product of all elements except self without division.',
    description: `Given an integer array \`nums\`, return *an array*\`\` answer\`\` *such that*\`\` answer[i]\`\` *is equal to the product of all the elements of*\`\` nums\`\` *except*\`\` nums[i]\`\`.\n\nPlease solve it **without division** and in O(n) runtime complexity.`,
    examples: [
      {
        input: 'nums = [1,2,3,4]',
        output: '[24,12,8,6]',
        explanation: 'For index 0: 2*3*4=24. For index 1: 1*3*4=12...'
      },
      {
        input: 'nums = [-1,1,0,-3,3]',
        output: '[0,0,9,0,0]'
      }
    ],
    constraints: [
      '2 <= nums.length <= 10^5',
      '-30 <= nums[i] <= 30',
      'The input is generated such that answer[i] is guaranteed to fit in a 32-bit integer.'
    ],
    keyPoints: [
      '**Brute Force**: For each index, multiply all other elements. Time O(N^2). TLE.',
      '**Division Trick**: Calculate total product, divide by each element. Fails if zero exists (division by zero). Also violates "no division" constraint often asked in interviews.',
      '**Core Insight**: Prefix and Suffix Products. \`answer[i] = product(nums[0..i-1]) * product(nums[i+1..n-1])\`. Compute prefix products in one left-to-right pass, suffix products in one right-to-left pass. Combine them.',
      '**Space-Time Analysis**: O(N) time. Can be optimized to O(1) extra space (excluding output array) by reusing the output array for prefixes and multiplying by running suffix variable.'
    ],
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    companies: ['Amazon', 'Microsoft', 'Apple', 'Adobe'],
    starterCode: {
      python: `def productExceptSelf(nums):
    # TODO: Implement prefix/suffix product
    pass

# Test Execution
if __name__ == "__main__":
    print(productExceptSelf([1,2,3,4]))       # Expected: [24, 12, 8, 6]
    print(productExceptSelf([-1,1,0,-3,3]))   # Expected: [0, 0, 9, 0, 0]`,
      javascript: `/**
 * @param {number[]} nums
 * @return {number[]}
 */
var productExceptSelf = function(nums) {
    // TODO: Implement prefix/suffix product
};

// Test Execution
console.log(productExceptSelf([1,2,3,4]));       // Expected: [24, 12, 8, 6]
console.log(productExceptSelf([-1,1,0,-3,3]));   // Expected: [0, 0, 9, 0, 0]`,
      cpp: `#include <vector>
#include <iostream>
using namespace std;

vector<int> productExceptSelf(vector<int>& nums) {
    // TODO: Implement prefix/suffix product
    return {};
}

void printVec(const vector<int>& v) {
    cout << "[";
    for(size_t i=0; i<v.size(); ++i) {
        cout << v[i];
        if(i < v.size()-1) cout << ",";
    }
    cout << "]" << endl;
}

int main() {
    vector<int> n1 = {1, 2, 3, 4};
    printVec(productExceptSelf(n1)); // Expected: [24,12,8,6]
    
    vector<int> n2 = {-1, 1, 0, -3, 3};
    printVec(productExceptSelf(n2)); // Expected: [0,0,9,0,0]
    return 0;
}`,
      java: `import java.util.*;

public class Solution {
    public static int[] productExceptSelf(int[] nums) {
        // TODO: Implement prefix/suffix product
        return new int[0];
    }

    public static void main(String[] args) {
        int[] n1 = {1, 2, 3, 4};
        System.out.println(Arrays.toString(productExceptSelf(n1))); // Expected: [24, 12, 8, 6]
        
        int[] n2 = {-1, 1, 0, -3, 3};
        System.out.println(Arrays.toString(productExceptSelf(n2))); // Expected: [0, 0, 9, 0, 0]
    }
}`
    },
    solutionCode: {
      python: `def productExceptSelf(nums):
    n = len(nums)
    res = [1] * n
    
    # Left pass (prefix)
    prefix = 1
    for i in range(n):
        res[i] = prefix
        prefix *= nums[i]
        
    # Right pass (suffix)
    postfix = 1
    for i in range(n - 1, -1, -1):
        res[i] *= postfix
        postfix *= nums[i]
        
    return res`,
      javascript: `var productExceptSelf = function(nums) {
    const n = nums.length;
    const res = new Array(n).fill(1);
    
    // Left pass
    let prefix = 1;
    for (let i = 0; i < n; i++) {
        res[i] = prefix;
        prefix *= nums[i];
    }
    
    // Right pass
    let postfix = 1;
    for (let i = n - 1; i >= 0; i--) {
        res[i] *= postfix;
        postfix *= nums[i];
    }
    
    return res;
};`,
      cpp: `vector<int> productExceptSelf(vector<int>& nums) {
    int n = nums.size();
    vector<int> res(n, 1);
    
    // Left pass
    int prefix = 1;
    for (int i = 0; i < n; ++i) {
        res[i] = prefix;
        prefix *= nums[i];
    }
    
    // Right pass
    int postfix = 1;
    for (int i = n - 1; i >= 0; --i) {
        res[i] *= postfix;
        postfix *= nums[i];
    }
    
    return res;
}`,
      java: `public static int[] productExceptSelf(int[] nums) {
    int n = nums.length;
    int[] res = new int[n];
    Arrays.fill(res, 1);
    
    // Left pass
    int prefix = 1;
    for (int i = 0; i < n; i++) {
        res[i] = prefix;
        prefix *= nums[i];
    }
    
    // Right pass
    int postfix = 1;
    for (int i = n - 1; i >= 0; i--) {
        res[i] *= postfix;
        postfix *= nums[i];
    }
    
    return res;
}`
    },
    solutionExplanation: `We construct the result array in two passes. First, we traverse from left to right, calculating the product of all elements to the left of the current index (prefix product) and storing it in the result array. Second, we traverse from right to left, calculating the product of all elements to the right (postfix/suffix product) and multiplying it with the existing value in the result array. This avoids division and handles zeros naturally.`,
    testCases: [
      { id: 'tc-1', input: '[1,2,3,4]', expected: '[24,12,8,6]' },
      { id: 'tc-2', input: '[-1,1,0,-3,3]', expected: '[0,0,9,0,0]' },
      { id: 'tc-3', input: '[2,3,4,5]', expected: '[60,40,30,24]' }
    ]
  },
  {
    id: 'dsa-ah-07',
    number: 7,
    title: 'Longest Consecutive Sequence',
    slug: 'longest-consecutive-sequence',
    category: 'Arrays & Hashing',
    difficulty: 'Medium',
    summary: 'Find length of longest consecutive elements sequence.',
    description: `Given an unsorted array of integers \`nums\`, return *the length of the longest consecutive elements sequence*.\n\nYou must write an algorithm that runs in **O(n)** time.`,
    examples: [
      {
        input: 'nums = [100,4,200,1,3,2]',
        output: '4',
        explanation: 'The longest consecutive elements sequence is [1, 2, 3, 4].'
      },
      {
        input: 'nums = [0,3,7,2,5,8,4,6,0,1]',
        output: '9'
      }
    ],
    constraints: [
      '0 <= nums.length <= 10^5',
      '-10^9 <= nums[i] <= 10^9'
    ],
    keyPoints: [
      '**Brute Force**: Sort array, scan for consecutive runs. Time O(N log N). Violates O(N) requirement.',
      '**Core Insight**: HashSet Start Detection. Put all numbers in a Set. Iterate through numbers. Only start counting a sequence if \`num - 1\` is NOT in the set (meaning \`num\` is the start of a sequence). Then count upwards (\`num+1\`, \`num+2\`...) while they exist in the set.',
      '**Edge Cases**: Empty array, duplicates, negative numbers, very large gaps.',
      '**Space-Time Analysis**: O(N) time because each element is visited at most twice (once in outer loop, once in inner while loop amortized). O(N) space for Set.'
    ],
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(N)',
    companies: ['Amazon', 'Microsoft', 'Google', 'Facebook'],
    starterCode: {
      python: `def longestConsecutive(nums):
    # TODO: Implement HashSet approach
    pass

# Test Execution
if __name__ == "__main__":
    print(longestConsecutive([100,4,200,1,3,2])) # Expected: 4
    print(longestConsecutive([0,3,7,2,5,8,4,6,0,1])) # Expected: 9`,
      javascript: `/**
 * @param {number[]} nums
 * @return {number}
 */
var longestConsecutive = function(nums) {
    // TODO: Implement HashSet approach
};

// Test Execution
console.log(longestConsecutive([100,4,200,1,3,2])); // Expected: 4
console.log(longestConsecutive([0,3,7,2,5,8,4,6,0,1])); // Expected: 9`,
      cpp: `#include <vector>
#include <unordered_set>
#include <algorithm>
#include <iostream>
using namespace std;

int longestConsecutive(vector<int>& nums) {
    // TODO: Implement HashSet approach
    return 0;
}

int main() {
    vector<int> n1 = {100, 4, 200, 1, 3, 2};
    cout << longestConsecutive(n1) << endl; // Expected: 4
    
    vector<int> n2 = {0, 3, 7, 2, 5, 8, 4, 6, 0, 1};
    cout << longestConsecutive(n2) << endl; // Expected: 9
    return 0;
}`,
      java: `import java.util.*;

public class Solution {
    public static int longestConsecutive(int[] nums) {
        // TODO: Implement HashSet approach
        return 0;
    }

    public static void main(String[] args) {
        int[] n1 = {100, 4, 200, 1, 3, 2};
        System.out.println(longestConsecutive(n1)); // Expected: 4
        
        int[] n2 = {0, 3, 7, 2, 5, 8, 4, 6, 0, 1};
        System.out.println(longestConsecutive(n2)); // Expected: 9
    }
}`
    },
    solutionCode: {
      python: `def longestConsecutive(nums):
    numSet = set(nums)
    longest = 0
    
    for n in numSet:
        # Check if it's the start of a sequence
        if (n - 1) not in numSet:
            length = 0
            while (n + length) in numSet:
                length += 1
            longest = max(longest, length)
            
    return longest`,
      javascript: `var longestConsecutive = function(nums) {
    const numSet = new Set(nums);
    let longest = 0;
    
    for (let n of numSet) {
        // Check if it's the start of a sequence
        if (!numSet.has(n - 1)) {
            let length = 0;
            while (numSet.has(n + length)) {
                length++;
            }
            longest = Math.max(longest, length);
        }
    }
    
    return longest;
};`,
      cpp: `int longestConsecutive(vector<int>& nums) {
    unordered_set<int> numSet(nums.begin(), nums.end());
    int longest = 0;
    
    for (int n : numSet) {
        // Check if it's the start of a sequence
        if (numSet.find(n - 1) == numSet.end()) {
            int length = 0;
            while (numSet.find(n + length) != numSet.end()) {
                length++;
            }
            longest = max(longest, length);
        }
    }
    
    return longest;
}`,
      java: `public static int longestConsecutive(int[] nums) {
    Set<Integer> numSet = new HashSet<>();
    for (int n : nums) numSet.add(n);
    
    int longest = 0;
    
    for (int n : numSet) {
        // Check if it's the start of a sequence
        if (!numSet.contains(n - 1)) {
            int length = 0;
            while (numSet.contains(n + length)) {
                length++;
            }
            longest = Math.max(longest, length);
        }
    }
    
    return longest;
}`
    },
    solutionExplanation: `We convert the array into a HashSet for O(1) lookups. We iterate through each unique number in the set. Crucially, we only begin counting a sequence if the number \`n-1\` is *not* present in the set. This identifies \`n\` as the *start* of a consecutive sequence. From that start, we check \`n+1\`, \`n+2\`, etc., incrementing a local length counter. We update the global maximum length accordingly. This ensures each element is processed effectively only once, leading to O(N) time complexity.`,
    testCases: [
      { id: 'tc-1', input: '[100,4,200,1,3,2]', expected: '4' },
      { id: 'tc-2', input: '[0,3,7,2,5,8,4,6,0,1]', expected: '9' },
      { id: 'tc-3', input: '[]', expected: '0' }
    ]
  }
];
