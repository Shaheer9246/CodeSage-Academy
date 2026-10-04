import { DsaProblem } from './types';

export const SLIDING_WINDOW_PROBLEMS: DsaProblem[] = [
  {
    id: 'dsa-sw-01',
    number: 1,
    title: 'Best Time to Buy and Sell Stock',
    slug: 'best-time-to-buy-and-sell-stock',
    category: 'Sliding Window',
    difficulty: 'Easy',
    summary: 'Find the maximum profit from buying and selling a stock once.',
    description: `You are given an array \`prices\` where \`prices[i]\` is the price of a certain stock on the \`i^{th}\` day.\n\nYou want to maximize your profit by choosing a **single day** to buy one stock and choosing a **different day in the future** to sell that stock.\n\nReturn *the maximum profit you can achieve from this transaction*. If you cannot achieve any profit, return \`0\`.`,
    examples: [
      {
        input: 'prices = [7,1,5,3,6,4]',
        output: '5',
        explanation: 'Buy on day 2 (price=1) and sell on day 5 (price=6). Profit = 6 - 1 = 5.'
      },
      {
        input: 'prices = [7,6,4,3,1]',
        output: '0',
        explanation: 'No transactions done because prices only decrease. Max profit is 0.'
      }
    ],
    constraints: [
      '1 <= prices.length <= 10^5',
      '0 <= prices[i] <= 10^4'
    ],
    keyPoints: [
      '**Brute Force**: Check every pair $(i, j)$ where $i < j$. Time O(N^2), Space O(1). Too slow for large N.',
      '**Core Insight**: Single Pass with Tracking. Keep track of the minimum price seen so far (\`minPrice\`). For each current price, calculate potential profit (\`currentPrice - minPrice\`) and update max profit if higher.',
      '**Edge Cases**: Prices strictly decreasing (profit 0), single element array (profit 0), all same prices.',
      '**Space-Time Analysis**: Optimal solution is O(N) time and O(1) space.'
    ],
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    companies: ['Amazon', 'Microsoft', 'Apple', 'Adobe'],
    starterCode: {
      python: `def maxProfit(prices):
    # TODO: Implement single pass logic
    pass

# Test Execution
if __name__ == "__main__":
    print(maxProfit([7,1,5,3,6,4])) # Expected: 5
    print(maxProfit([7,6,4,3,1]))   # Expected: 0`,
      javascript: `/**
 * @param {number[]} prices
 * @return {number}
 */
var maxProfit = function(prices) {
    // TODO: Implement single pass logic
};

// Test Execution
console.log(maxProfit([7,1,5,3,6,4])); // Expected: 5
console.log(maxProfit([7,6,4,3,1]));   // Expected: 0`,
      cpp: `#include <vector>
#include <iostream>
using namespace std;

int maxProfit(vector<int>& prices) {
    // TODO: Implement single pass logic
    return 0;
}

int main() {
    vector<int> p1 = {7, 1, 5, 3, 6, 4};
    cout << maxProfit(p1) << endl; // Expected: 5
    
    vector<int> p2 = {7, 6, 4, 3, 1};
    cout << maxProfit(p2) << endl; // Expected: 0
    return 0;
}`,
      java: `import java.util.*;

public class Solution {
    public static int maxProfit(int[] prices) {
        // TODO: Implement single pass logic
        return 0;
    }

    public static void main(String[] args) {
        int[] p1 = {7, 1, 5, 3, 6, 4};
        System.out.println(maxProfit(p1)); // Expected: 5
        
        int[] p2 = {7, 6, 4, 3, 1};
        System.out.println(maxProfit(p2)); // Expected: 0
    }
}`
    },
    solutionCode: {
      python: `def maxProfit(prices):
    min_price = float('inf')
    max_profit = 0
    
    for price in prices:
        if price < min_price:
            min_price = price
        elif price - min_price > max_profit:
            max_profit = price - min_price
            
    return max_profit`,
      javascript: `var maxProfit = function(prices) {
    let minPrice = Infinity;
    let maxProfit = 0;
    
    for (let i = 0; i < prices.length; i++) {
        if (prices[i] < minPrice) {
            minPrice = prices[i];
        } else if (prices[i] - minPrice > maxProfit) {
            maxProfit = prices[i] - minPrice;
        }
    }
    
    return maxProfit;
};`,
      cpp: `int maxProfit(vector<int>& prices) {
    int minPrice = INT_MAX;
    int maxProfit = 0;
    
    for (int price : prices) {
        if (price < minPrice) {
            minPrice = price;
        } else if (price - minPrice > maxProfit) {
            maxProfit = price - minPrice;
        }
    }
    
    return maxProfit;
}`,
      java: `public static int maxProfit(int[] prices) {
    int minPrice = Integer.MAX_VALUE;
    int maxProfit = 0;
    
    for (int price : prices) {
        if (price < minPrice) {
            minPrice = price;
        } else if (price - minPrice > maxProfit) {
            maxProfit = price - minPrice;
        }
    }
    
    return maxProfit;
}`
    },
    solutionExplanation: `We iterate through the prices array once. We maintain two variables: \`minPrice\` to store the lowest price encountered so far, and \`maxProfit\` to store the highest profit achievable. At each step, if the current price is lower than \`minPrice\`, we update \`minPrice\`. Otherwise, we calculate the profit if we sold today (\`currentPrice - minPrice\`) and update \`maxProfit\` if this new profit is greater than the previous maximum. This ensures we always buy at the historical low before selling at the current high.`,
    testCases: [
      { id: 'tc-1', input: '[7,1,5,3,6,4]', expected: '5' },
      { id: 'tc-2', input: '[7,6,4,3,1]', expected: '0' },
      { id: 'tc-3', input: '[2,4,1]', expected: '2' }
    ]
  },
  {
    id: 'dsa-sw-02',
    number: 2,
    title: 'Longest Substring Without Repeating Characters',
    slug: 'longest-substring-without-repeating-characters',
    category: 'Sliding Window',
    difficulty: 'Medium',
    summary: 'Find the length of the longest substring without repeating characters.',
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
      }
    ],
    constraints: [
      '0 <= s.length <= 5 * 10^4',
      's consists of English letters, digits, symbols and spaces.'
    ],
    keyPoints: [
      '**Brute Force**: Check all substrings. Time O(N^3), Space O(N). Extremely inefficient.',
      '**Core Insight**: Sliding Window with Hash Map/Set. Maintain a window [left, right]. Expand right. If char repeats, shrink left until repeat is removed. Track max length during expansion.',
      '**Edge Cases**: Empty string, string with all unique chars, string with all same chars.',
      '**Space-Time Analysis**: O(N) time (each char visited at most twice), O(min(N, AlphabetSize)) space.'
    ],
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(Min(N, Alphabet Size))',
    companies: ['Amazon', 'Meta', 'Google', 'Microsoft'],
    starterCode: {
      python: `def lengthOfLongestSubstring(s):
    # TODO: Implement sliding window
    pass

# Test Execution
if __name__ == "__main__":
    print(lengthOfLongestSubstring("abcabcbb")) # Expected: 3
    print(lengthOfLongestSubstring("bbbbb"))    # Expected: 1
    print(lengthOfLongestSubstring("pwwkew"))   # Expected: 3`,
      javascript: `/**
 * @param {string} s
 * @return {number}
 */
var lengthOfLongestSubstring = function(s) {
    // TODO: Implement sliding window
};

// Test Execution
console.log(lengthOfLongestSubstring("abcabcbb")); // Expected: 3
console.log(lengthOfLongestSubstring("bbbbb"));    // Expected: 1
console.log(lengthOfLongestSubstring("pwwkew"));   // Expected: 3`,
      cpp: `#include <string>
#include <iostream>
using namespace std;

int lengthOfLongestSubstring(string s) {
    // TODO: Implement sliding window
    return 0;
}

int main() {
    cout << lengthOfLongestSubstring("abcabcbb") << endl; // Expected: 3
    cout << lengthOfLongestSubstring("bbbbb") << endl;    // Expected: 1
    cout << lengthOfLongestSubstring("pwwkew") << endl;   // Expected: 3
    return 0;
}`,
      java: `import java.util.*;

public class Solution {
    public static int lengthOfLongestSubstring(String s) {
        // TODO: Implement sliding window
        return 0;
    }

    public static void main(String[] args) {
        System.out.println(lengthOfLongestSubstring("abcabcbb")); // Expected: 3
        System.out.println(lengthOfLongestSubstring("bbbbb"));    // Expected: 1
        System.out.println(lengthOfLongestSubstring("pwwkew"));   // Expected: 3
    }
}`
    },
    solutionCode: {
      python: `def lengthOfLongestSubstring(s):
    char_index = {}
    left = 0
    max_len = 0
    
    for right in range(len(s)):
        char = s[right]
        if char in char_index and char_index[char] >= left:
            left = char_index[char] + 1
        
        char_index[char] = right
        max_len = max(max_len, right - left + 1)
        
    return max_len`,
      javascript: `var lengthOfLongestSubstring = function(s) {
    const charIndex = {};
    let left = 0;
    let maxLength = 0;
    
    for (let right = 0; right < s.length; right++) {
        const char = s[right];
        if (charIndex.hasOwnProperty(char) && charIndex[char] >= left) {
            left = charIndex[char] + 1;
        }
        
        charIndex[char] = right;
        maxLength = Math.max(maxLength, right - left + 1);
    }
    
    return maxLength;
};`,
      cpp: `int lengthOfLongestSubstring(string s) {
    unordered_map<char, int> charIndex;
    int left = 0;
    int maxLength = 0;
    
    for (int right = 0; right < s.length(); ++right) {
        char c = s[right];
        if (charIndex.find(c) != charIndex.end() && charIndex[c] >= left) {
            left = charIndex[c] + 1;
        }
        
        charIndex[c] = right;
        maxLength = max(maxLength, right - left + 1);
    }
    
    return maxLength;
}`,
      java: `public static int lengthOfLongestSubstring(String s) {
    Map<Character, Integer> charIndex = new HashMap<>();
    int left = 0;
    int maxLength = 0;
    
    for (int right = 0; right < s.length(); right++) {
        char c = s.charAt(right);
        if (charIndex.containsKey(c) && charIndex.get(c) >= left) {
            left = charIndex.get(c) + 1;
        }
        
        charIndex.put(c, right);
        maxLength = Math.max(maxLength, right - left + 1);
    }
    
    return maxLength;
}`
    },
    solutionExplanation: `We use a sliding window defined by \`left\` and \`right\` pointers. A hash map stores the last index of each character. As we expand \`right\`, if we encounter a duplicate character that is within our current window (index >= left), we jump \`left\` to the position immediately after the previous occurrence. This avoids shrinking one-by-one. We update the max length at each step.`,
    testCases: [
      { id: 'tc-1', input: '"abcabcbb"', expected: '3' },
      { id: 'tc-2', input: '"bbbbb"', expected: '1' },
      { id: 'tc-3', input: '"pwwkew"', expected: '3' }
    ]
  },
  {
    id: 'dsa-sw-03',
    number: 3,
    title: 'Longest Repeating Character Replacement',
    slug: 'longest-repeating-character-replacement',
    category: 'Sliding Window',
    difficulty: 'Medium',
    summary: 'Find longest substring with identical chars after k replacements.',
    description: `You are given a string \`s\` and an integer \`k\`. You can choose any character of the string and change it to any other uppercase English character. You can perform this operation at most \`k\` times.\n\nReturn *the length of the longest substring containing the same letter you can get after performing the above operations*.`,
    examples: [
      {
        input: 's = "ABAB", k = 2',
        output: '4',
        explanation: 'Replace the two A\'s with two B\'s or vice versa.'
      },
      {
        input: 's = "AABABBA", k = 1',
        output: '4',
        explanation: 'Replace the one A in the middle with B -> "ABBBB".'
      }
    ],
    constraints: [
      '1 <= s.length <= 10^5',
      's consists of only uppercase English letters.',
      '0 <= k <= s.length'
    ],
    keyPoints: [
      '**Brute Force**: Try every substring and count mismatches. Time O(N^2) or worse.',
      '**Core Insight**: Sliding Window. Maintain frequency count of chars in window. Key condition: `window_length - max_freq_char_count <= k`. If violated, shrink window. Note: `max_freq` doesn\'t need to be updated when shrinking, as we only care about finding larger windows later.',
      '**Edge Cases**: k=0 (standard longest repeated char), k>=N (entire string), all distinct chars.',
      '**Space-Time Analysis**: O(N) time, O(Alphabet Size) space (constant 26).'
    ],
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    companies: ['Amazon', 'Google', 'Uber'],
    starterCode: {
      python: `def characterReplacement(s, k):
    # TODO: Implement sliding window with freq map
    pass

# Test Execution
if __name__ == "__main__":
    print(characterReplacement("ABAB", 2))     # Expected: 4
    print(characterReplacement("AABABBA", 1))  # Expected: 4`,
      javascript: `/**
 * @param {string} s
 * @param {number} k
 * @return {number}
 */
var characterReplacement = function(s, k) {
    // TODO: Implement sliding window with freq map
};

// Test Execution
console.log(characterReplacement("ABAB", 2));     // Expected: 4
console.log(characterReplacement("AABABBA", 1));  // Expected: 4`,
      cpp: `#include <string>
#include <unordered_map>
#include <algorithm>
#include <iostream>
using namespace std;

int characterReplacement(string s, int k) {
    // TODO: Implement sliding window with freq map
    return 0;
}

int main() {
    cout << characterReplacement("ABAB", 2) << endl;     // Expected: 4
    cout << characterReplacement("AABABBA", 1) << endl;  // Expected: 4
    return 0;
}`,
      java: `import java.util.*;

public class Solution {
    public static int characterReplacement(String s, int k) {
        // TODO: Implement sliding window with freq map
        return 0;
    }

    public static void main(String[] args) {
        System.out.println(characterReplacement("ABAB", 2));     // Expected: 4
        System.out.println(characterReplacement("AABABBA", 1));  // Expected: 4
    }
}`
    },
    solutionCode: {
      python: `def characterReplacement(s, k):
    count = {}
    res = 0
    l = 0
    maxf = 0
    
    for r in range(len(s)):
        count[s[r]] = 1 + count.get(s[r], 0)
        maxf = max(maxf, count[s[r]])
        
        while (r - l + 1) - maxf > k:
            count[s[l]] -= 1
            l += 1
            
        res = max(res, r - l + 1)
        
    return res`,
      javascript: `var characterReplacement = function(s, k) {
    const count = {};
    let res = 0;
    let l = 0;
    let maxf = 0;
    
    for (let r = 0; r < s.length; r++) {
        count[s[r]] = (count[s[r]] || 0) + 1;
        maxf = Math.max(maxf, count[s[r]]);
        
        while ((r - l + 1) - maxf > k) {
            count[s[l]]--;
            l++;
        }
        
        res = Math.max(res, r - l + 1);
    }
    
    return res;
};`,
      cpp: `int characterReplacement(string s, int k) {
    unordered_map<char, int> count;
    int res = 0;
    int l = 0;
    int maxf = 0;
    
    for (int r = 0; r < s.length(); r++) {
        count[s[r]]++;
        maxf = max(maxf, count[s[r]]);
        
        while ((r - l + 1) - maxf > k) {
            count[s[l]]--;
            l++;
        }
        
        res = max(res, r - l + 1);
    }
    
    return res;
}`,
      java: `public static int characterReplacement(String s, int k) {
    Map<Character, Integer> count = new HashMap<>();
    int res = 0;
    int l = 0;
    int maxf = 0;
    
    for (int r = 0; r < s.length(); r++) {
        char c = s.charAt(r);
        count.put(c, count.getOrDefault(c, 0) + 1);
        maxf = Math.max(maxf, count.get(c));
        
        while ((r - l + 1) - maxf > k) {
            char leftChar = s.charAt(l);
            count.put(leftChar, count.get(leftChar) - 1);
            l++;
        }
        
        res = Math.max(res, r - l + 1);
    }
    
    return res;
}`
    },
    solutionExplanation: `We maintain a sliding window [l, r]. We track the frequency of characters in the window. The critical metric is \`maxf\`, the highest frequency of any single character in the current window. The number of characters we need to replace is \`window_size - maxf\`. If this exceeds \`k\`, the window is invalid, so we increment \`l\` to shrink it. Interestingly, we don't decrement \`maxf\` when shrinking because we only look for longer valid windows later; if a smaller \`maxf\` allowed a bigger window previously, it won't help us exceed the current global max length.`,
    testCases: [
      { id: 'tc-1', input: 's="ABAB", k=2', expected: '4' },
      { id: 'tc-2', input: 's="AABABBA", k=1', expected: '4' },
      { id: 'tc-3', input: 's="AAAA", k=0', expected: '4' }
    ]
  },
  {
    id: 'dsa-sw-04',
    number: 4,
    title: 'Permutation in String',
    slug: 'permutation-in-string',
    category: 'Sliding Window',
    difficulty: 'Medium',
    summary: 'Check if s2 contains a permutation of s1.',
    description: `Given two strings \`s1\` and \`s2\`, return \`true\` if \`s2\` contains a permutation of \`s1\`, or \`false\` otherwise.\n\nIn other words, return \`true\` if one of \`s1\`'s permutations is the substring of \`s2\`.`,
    examples: [
      {
        input: 's1 = "ab", s2 = "eidbaooo"',
        output: 'true',
        explanation: 's2 contains one permutation of s1 ("ba").'
      },
      {
        input: 's1 = "ab", s2 = "eidboaoo"',
        output: 'false',
        explanation: 'No permutation of s1 exists in s2.'
      }
    ],
    constraints: [
      '1 <= s1.length, s2.length <= 10^4',
      's1 and s2 consist of lowercase English letters.'
    ],
    keyPoints: [
      '**Brute Force**: Generate all perms of s1 and check inclusion. Factorial complexity. Impossible.',
      '**Core Insight**: Fixed-size Sliding Window. Since permutation implies same character counts, we slide a window of size \`len(s1)\` over \`s2\`. Compare frequency maps of window and s1. Optimized using a match counter instead of full map comparison.',
      '**Edge Cases**: s1 longer than s2 (immediate false), exact matches, overlapping patterns.',
      '**Space-Time Analysis**: O(N) time, O(1) space (fixed alphabet size 26).'
    ],
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    companies: ['Amazon', 'Facebook', 'Google'],
    starterCode: {
      python: `def checkInclusion(s1, s2):
    # TODO: Implement fixed window freq comparison
    pass

# Test Execution
if __name__ == "__main__":
    print(checkInclusion("ab", "eidbaooo")) # Expected: True
    print(checkInclusion("ab", "eidboaoo")) # Expected: False`,
      javascript: `/**
 * @param {string} s1
 * @param {string} s2
 * @return {boolean}
 */
var checkInclusion = function(s1, s2) {
    // TODO: Implement fixed window freq comparison
};

// Test Execution
console.log(checkInclusion("ab", "eidbaooo")); // Expected: true
console.log(checkInclusion("ab", "eidboaoo")); // Expected: false`,
      cpp: `#include <string>
#include <vector>
#include <iostream>
using namespace std;

bool checkInclusion(string s1, string s2) {
    // TODO: Implement fixed window freq comparison
    return false;
}

int main() {
    cout << (checkInclusion("ab", "eidbaooo") ? "true" : "false") << endl; // Expected: true
    cout << (checkInclusion("ab", "eidboaoo") ? "true" : "false") << endl; // Expected: false
    return 0;
}`,
      java: `import java.util.*;

public class Solution {
    public static boolean checkInclusion(String s1, String s2) {
        // TODO: Implement fixed window freq comparison
        return false;
    }

    public static void main(String[] args) {
        System.out.println(checkInclusion("ab", "eidbaooo")); // Expected: true
        System.out.println(checkInclusion("ab", "eidboaoo")); // Expected: false
    }
}`
    },
    solutionCode: {
      python: `def checkInclusion(s1, s2):
    if len(s1) > len(s2):
        return False
        
    s1Count = [0] * 26
    winCount = [0] * 26
    
    for i in range(len(s1)):
        s1Count[ord(s1[i]) - ord('a')] += 1
        winCount[ord(s2[i]) - ord('a')] += 1
        
    matches = 0
    for i in range(26):
        if s1Count[i] == winCount[i]:
            matches += 1
            
    l = 0
    for r in range(len(s1), len(s2)):
        if matches == 26:
            return True
            
        idx_out = ord(s2[l]) - ord('a')
        idx_in = ord(s2[r]) - ord('a')
        
        winCount[idx_out] -= 1
        if s1Count[idx_out] == winCount[idx_out]:
            matches += 1
        elif s1Count[idx_out] + 1 == winCount[idx_out]:
            matches -= 1
            
        winCount[idx_in] += 1
        if s1Count[idx_in] == winCount[idx_in]:
            matches += 1
        elif s1Count[idx_in] - 1 == winCount[idx_in]:
            matches -= 1
            
        l += 1
        
    return matches == 26`,
      javascript: `var checkInclusion = function(s1, s2) {
    if (s1.length > s2.length) return false;
    
    const s1Count = new Array(26).fill(0);
    const winCount = new Array(26).fill(0);
    
    for (let i = 0; i < s1.length; i++) {
        s1Count[s1.charCodeAt(i) - 97]++;
        winCount[s2.charCodeAt(i) - 97]++;
    }
    
    let matches = 0;
    for (let i = 0; i < 26; i++) {
        if (s1Count[i] === winCount[i]) matches++;
    }
    
    let l = 0;
    for (let r = s1.length; r < s2.length; r++) {
        if (matches === 26) return true;
        
        const outIdx = s2.charCodeAt(l) - 97;
        const inIdx = s2.charCodeAt(r) - 97;
        
        winCount[outIdx]--;
        if (s1Count[outIdx] === winCount[outIdx]) matches++;
        else if (s1Count[outIdx] + 1 === winCount[outIdx]) matches--;
        
        winCount[inIdx]++;
        if (s1Count[inIdx] === winCount[inIdx]) matches++;
        else if (s1Count[inIdx] - 1 === winCount[inIdx]) matches--;
        
        l++;
    }
    
    return matches === 26;
};`,
      cpp: `bool checkInclusion(string s1, string s2) {
    if (s1.size() > s2.size()) return false;
    
    vector<int> s1Count(26, 0), winCount(26, 0);
    
    for (int i = 0; i < s1.size(); i++) {
        s1Count[s1[i] - 'a']++;
        winCount[s2[i] - 'a']++;
    }
    
    int matches = 0;
    for (int i = 0; i < 26; i++) {
        if (s1Count[i] == winCount[i]) matches++;
    }
    
    int l = 0;
    for (int r = s1.size(); r < s2.size(); r++) {
        if (matches == 26) return true;
        
        int outIdx = s2[l] - 'a';
        int inIdx = s2[r] - 'a';
        
        winCount[outIdx]--;
        if (s1Count[outIdx] == winCount[outIdx]) matches++;
        else if (s1Count[outIdx] + 1 == winCount[outIdx]) matches--;
        
        winCount[inIdx]++;
        if (s1Count[inIdx] == winCount[inIdx]) matches++;
        else if (s1Count[inIdx] - 1 == winCount[inIdx]) matches--;
        
        l++;
    }
    
    return matches == 26;
}`,
      java: `public static boolean checkInclusion(String s1, String s2) {
    if (s1.length() > s2.length()) return false;
    
    int[] s1Count = new int[26];
    int[] winCount = new int[26];
    
    for (int i = 0; i < s1.length(); i++) {
        s1Count[s1.charAt(i) - 'a']++;
        winCount[s2.charAt(i) - 'a']++;
    }
    
    int matches = 0;
    for (int i = 0; i < 26; i++) {
        if (s1Count[i] == winCount[i]) matches++;
    }
    
    int l = 0;
    for (int r = s1.length(); r < s2.length(); r++) {
        if (matches == 26) return true;
        
        int outIdx = s2.charAt(l) - 'a';
        int inIdx = s2.charAt(r) - 'a';
        
        winCount[outIdx]--;
        if (s1Count[outIdx] == winCount[outIdx]) matches++;
        else if (s1Count[outIdx] + 1 == winCount[outIdx]) matches--;
        
        winCount[inIdx]++;
        if (s1Count[inIdx] == winCount[inIdx]) matches++;
        else if (s1Count[inIdx] - 1 == winCount[inIdx]) matches--;
        
        l++;
    }
    
    return matches == 26;
}`
    },
    solutionExplanation: `We use a fixed-size sliding window of length \`len(s1)\`. Instead of comparing two arrays of size 26 at every step (which would be O(26*N)), we maintain a \`matches\` counter tracking how many character frequencies currently align between the window and s1. When adding/removing characters, we update the count and adjust \`matches\` accordingly. If \`matches\` reaches 26, we found a permutation.`,
    testCases: [
      { id: 'tc-1', input: 's1="ab", s2="eidbaooo"', expected: 'true' },
      { id: 'tc-2', input: 's1="ab", s2="eidboaoo"', expected: 'false' },
      { id: 'tc-3', input: 's1="adc", s2="dcda"', expected: 'true' }
    ]
  },
  {
    id: 'dsa-sw-05',
    number: 5,
    title: 'Minimum Window Substring',
    slug: 'minimum-window-substring',
    category: 'Sliding Window',
    difficulty: 'Hard',
    summary: 'Find the smallest substring in S containing all characters of T.',
    description: `Given two strings \`s\` and \`t\` of lengths \`m\` and \`n\` respectively, return *the minimum window substring* of \`s\` such that every character in \`t\` (including duplicates) is included in the window. If there is no such substring, return the empty string \`""\`.`,
    examples: [
      {
        input: 's = "ADOBECODEBANC", t = "ABC"',
        output: '"BANC"',
        explanation: 'The minimum window substring "BANC" includes \'A\', \'B\', and \'C\' from string t.'
      },
      {
        input: 's = "a", t = "aa"',
        output: '""',
        explanation: 'Both characters of t must be included, but s has only one.'
      }
    ],
    constraints: [
      'm == s.length',
      'n == t.length',
      '1 <= m, n <= 10^5',
      's and t consist of uppercase and lowercase English letters.'
    ],
    keyPoints: [
      '**Brute Force**: Enumerate all substrings and check coverage. Time O(N^2*M). Too slow.',
      '**Core Insight**: Variable-size Sliding Window. Expand \`right\` until all chars in T are covered. Then contract \`left\` to minimize window size while maintaining coverage. Use a hashmap for required counts and formed counts.',
      '**Edge Cases**: T longer than S, no common chars, multiple occurrences of same char in T.',
      '**Space-Time Analysis**: O(S+T) time, O(T) space (hashmap size bounded by unique chars in T).'
    ],
    timeComplexity: 'O(|S| + |T|)',
    spaceComplexity: 'O(|T|)',
    companies: ['Amazon', 'Microsoft', 'Google', 'Uber'],
    starterCode: {
      python: `def minWindow(s, t):
    # TODO: Implement variable window with char counting
    pass

# Test Execution
if __name__ == "__main__":
    print(minWindow("ADOBECODEBANC", "ABC")) # Expected: "BANC"
    print(minWindow("a", "aa"))              # Expected: ""`,
      javascript: `/**
 * @param {string} s
 * @param {string} t
 * @return {string}
 */
var minWindow = function(s, t) {
    // TODO: Implement variable window with char counting
};

// Test Execution
console.log(minWindow("ADOBECODEBANC", "ABC")); // Expected: "BANC"
console.log(minWindow("a", "aa"));              // Expected: ""`,
      cpp: `#include <string>
#include <unordered_map>
#include <climits>
#include <iostream>
using namespace std;

string minWindow(string s, string t) {
    // TODO: Implement variable window with char counting
    return "";
}

int main() {
    cout << minWindow("ADOBECODEBANC", "ABC") << endl; // Expected: BANC
    cout << "\"" << minWindow("a", "aa") << "\"" << endl; // Expected: ""
    return 0;
}`,
      java: `import java.util.*;

public class Solution {
    public static String minWindow(String s, String t) {
        // TODO: Implement variable window with char counting
        return "";
    }

    public static void main(String[] args) {
        System.out.println(minWindow("ADOBECODEBANC", "ABC")); // Expected: BANC
        System.out.println("\"" + minWindow("a", "aa") + "\""); // Expected: ""
    }
}`
    },
    solutionCode: {
      python: `def minWindow(s, t):
    if not t or not s:
        return ""
        
    dict_t = {}
    for char in t:
        dict_t[char] = dict_t.get(char, 0) + 1
        
    required = len(dict_t)
    l, r = 0, 0
    formed = 0
    window_counts = {}
    
    ans = [-1, 0, 0] # length, left, right
    
    while r < len(s):
        char = s[r]
        window_counts[char] = window_counts.get(char, 0) + 1
        
        if char in dict_t and window_counts[char] == dict_t[char]:
            formed += 1
            
        while l <= r and formed == required:
            char = s[l]
            
            if r - l + 1 < ans[0] or ans[0] == -1:
                ans = [r - l + 1, l, r]
                
            window_counts[char] -= 1
            if char in dict_t and window_counts[char] < dict_t[char]:
                formed -= 1
                
            l += 1
            
        r += 1
        
    return "" if ans[0] == -1 else s[ans[1]:ans[2]+1]`,
      javascript: `var minWindow = function(s, t) {
    if (!t.length || !s.length) return "";
    
    const dictT = {};
    for (const char of t) {
        dictT[char] = (dictT[char] || 0) + 1;
    }
    
    const required = Object.keys(dictT).length;
    let l = 0, r = 0, formed = 0;
    const windowCounts = {};
    let ans = [-1, 0, 0];
    
    while (r < s.length) {
        const char = s[r];
        windowCounts[char] = (windowCounts[char] || 0) + 1;
        
        if (dictT[char] && windowCounts[char] === dictT[char]) {
            formed++;
        }
        
        while (l <= r && formed === required) {
            const charL = s[l];
            if (ans[0] === -1 || r - l + 1 < ans[0]) {
                ans = [r - l + 1, l, r];
            }
            
            windowCounts[charL]--;
            if (dictT[charL] && windowCounts[charL] < dictT[charL]) {
                formed--;
            }
            
            l++;
        }
        
        r++;
    }
    
    return ans[0] === -1 ? "" : s.substring(ans[1], ans[2] + 1);
};`,
      cpp: `string minWindow(string s, string t) {
    if (t.empty() || s.empty()) return "";
    
    unordered_map<char, int> dictT;
    for (char c : t) dictT[c]++;
    
    int required = dictT.size();
    int l = 0, r = 0, formed = 0;
    unordered_map<char, int> windowCounts;
    vector<int> ans = {-1, 0, 0};
    
    while (r < s.length()) {
        char c = s[r];
        windowCounts[c]++;
        
        if (dictT.count(c) && windowCounts[c] == dictT[c]) {
            formed++;
        }
        
        while (l <= r && formed == required) {
            c = s[l];
            if (ans[0] == -1 || r - l + 1 < ans[0]) {
                ans = {r - l + 1, l, r};
            }
            
            windowCounts[c]--;
            if (dictT.count(c) && windowCounts[c] < dictT[c]) {
                formed--;
            }
            
            l++;
        }
        
        r++;
    }
    
    return ans[0] == -1 ? "" : s.substr(ans[1], ans[0]);
}`,
      java: `public static String minWindow(String s, String t) {
    if (t.isEmpty() || s.isEmpty()) return "";
    
    Map<Character, Integer> dictT = new HashMap<>();
    for (char c : t.toCharArray()) {
        dictT.put(c, dictT.getOrDefault(c, 0) + 1);
    }
    
    int required = dictT.size();
    int l = 0, r = 0, formed = 0;
    Map<Character, Integer> windowCounts = new HashMap<>();
    int[] ans = {-1, 0, 0};
    
    while (r < s.length()) {
        char c = s.charAt(r);
        windowCounts.put(c, windowCounts.getOrDefault(c, 0) + 1);
        
        if (dictT.containsKey(c) && windowCounts.get(c).equals(dictT.get(c))) {
            formed++;
        }
        
        while (l <= r && formed == required) {
            c = s.charAt(l);
            if (ans[0] == -1 || r - l + 1 < ans[0]) {
                ans[0] = r - l + 1;
                ans[1] = l;
                ans[2] = r;
            }
            
            windowCounts.put(c, windowCounts.get(c) - 1);
            if (dictT.containsKey(c) && windowCounts.get(c) < dictT.get(c)) {
                formed--;
            }
            
            l++;
        }
        
        r++;
    }
    
    return ans[0] == -1 ? "" : s.substring(ans[1], ans[2] + 1);
}`
    },
    solutionExplanation: `We use two pointers \`l\` and \`r\`. First, we populate a dictionary with the frequency of characters needed from \`t\`. We expand \`r\` to include characters in the window. Whenever the count of a specific character in the window matches the required count, we increment \`formed\`. Once \`formed\` equals the total unique characters required, we have a valid window. We then try to shrink from \`l\` to find the minimum valid window, updating our answer whenever we find a smaller one. Shrinking stops when removing a character causes its count to drop below the requirement.`,
    testCases: [
      { id: 'tc-1', input: 's="ADOBECODEBANC", t="ABC"', expected: '"BANC"' },
      { id: 'tc-2', input: 's="a", t="aa"', expected: '""' },
      { id: 'tc-3', input: 's="a", t="a"', expected: '"a"' }
    ]
  },
  {
    id: 'dsa-sw-06',
    number: 6,
    title: 'Sliding Window Maximum',
    slug: 'sliding-window-maximum',
    category: 'Sliding Window',
    difficulty: 'Hard',
    summary: 'Find the max value in each sliding window of size k.',
    description: `You are given an array of integers \`nums\`, there is a sliding window of size \`k\` which is moving from the very left of the array to the very right. You can only see the \`k\` numbers in the window. Each time the sliding window moves right by one position.\n\nReturn *the max sliding window*.`,
    examples: [
      {
        input: 'nums = [1,3,-1,-3,5,3,6,7], k = 3',
        output: '[3,3,5,5,6,7]',
        explanation: 'Windows positions and their maxima are shown in table.'
      },
      {
        input: 'nums = [1], k = 1',
        output: '[1]'
      }
    ],
    constraints: [
      '1 <= nums.length <= 10^5',
      '-10^4 <= nums[i] <= 10^4',
      '1 <= k <= nums.length'
    ],
    keyPoints: [
      '**Brute Force**: Scan window for max at each step. Time O(N*K). TLE for large K.',
      '**Core Insight**: Monotonic Deque. Maintain a deque storing indices of useful elements. Elements are kept in decreasing order of value. Front is always max. Remove front if out of window. Remove back if new element is larger (it dominates older smaller ones).',
      '**Edge Cases**: k=1, k=N, negative numbers, duplicates.',
      '**Space-Time Analysis**: O(N) time (each element pushed/popped once), O(K) space for deque.'
    ],
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(K)',
    companies: ['Amazon', 'Google', 'Microsoft', 'Uber'],
    starterCode: {
      python: `from collections import deque

def maxSlidingWindow(nums, k):
    # TODO: Implement monotonic deque
    pass

# Test Execution
if __name__ == "__main__":
    print(maxSlidingWindow([1,3,-1,-3,5,3,6,7], 3)) # Expected: [3,3,5,5,6,7]
    print(maxSlidingWindow([1], 1))                 # Expected: [1]`,
      javascript: `/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number[]}
 */
var maxSlidingWindow = function(nums, k) {
    // TODO: Implement monotonic deque
};

// Test Execution
console.log(maxSlidingWindow([1,3,-1,-3,5,3,6,7], 3)); // Expected: [3,3,5,5,6,7]
console.log(maxSlidingWindow([1], 1));                 // Expected: [1]`,
      cpp: `#include <vector>
#include <deque>
#include <iostream>
using namespace std;

vector<int> maxSlidingWindow(vector<int>& nums, int k) {
    // TODO: Implement monotonic deque
    return {};
}

void printVec(const vector<int>& v) {
    cout << "[";
    for (size_t i = 0; i < v.size(); ++i) {
        cout << v[i];
        if (i < v.size() - 1) cout << ",";
    }
    cout << "]" << endl;
}

int main() {
    vector<int> n1 = {1, 3, -1, -3, 5, 3, 6, 7};
    printVec(maxSlidingWindow(n1, 3)); // Expected: [3,3,5,5,6,7]
    
    vector<int> n2 = {1};
    printVec(maxSlidingWindow(n2, 1)); // Expected: [1]
    return 0;
}`,
      java: `import java.util.*;

public class Solution {
    public static int[] maxSlidingWindow(int[] nums, int k) {
        // TODO: Implement monotonic deque
        return new int[0];
    }

    public static void main(String[] args) {
        int[] n1 = {1, 3, -1, -3, 5, 3, 6, 7};
        System.out.println(Arrays.toString(maxSlidingWindow(n1, 3))); // Expected: [3, 3, 5, 5, 6, 7]
        
        int[] n2 = {1};
        System.out.println(Arrays.toString(maxSlidingWindow(n2, 1))); // Expected: [1]
    }
}`
    },
    solutionCode: {
      python: `def maxSlidingWindow(nums, k):
    dq = deque()
    res = []
    
    for i, num in enumerate(nums):
        # Remove indices out of window
        if dq and dq[0] < i - k + 1:
            dq.popleft()
            
        # Maintain decreasing order
        while dq and nums[dq[-1]] < num:
            dq.pop()
            
        dq.append(i)
        
        # Start recording results
        if i >= k - 1:
            res.append(nums[dq[0]])
            
    return res`,
      javascript: `var maxSlidingWindow = function(nums, k) {
    const dq = [];
    const res = [];
    
    for (let i = 0; i < nums.length; i++) {
        // Remove out-of-window indices
        if (dq.length > 0 && dq[0] < i - k + 1) {
            dq.shift();
        }
        
        // Maintain decreasing order
        while (dq.length > 0 && nums[dq[dq.length - 1]] < nums[i]) {
            dq.pop();
        }
        
        dq.push(i);
        
        // Record max
        if (i >= k - 1) {
            res.push(nums[dq[0]]);
        }
    }
    
    return res;
};`,
      cpp: `vector<int> maxSlidingWindow(vector<int>& nums, int k) {
    deque<int> dq;
    vector<int> res;
    
    for (int i = 0; i < nums.size(); ++i) {
        // Remove out of window
        if (!dq.empty() && dq.front() < i - k + 1) {
            dq.pop_front();
        }
        
        // Maintain decreasing order
        while (!dq.empty() && nums[dq.back()] < nums[i]) {
            dq.pop_back();
        }
        
        dq.push_back(i);
        
        if (i >= k - 1) {
            res.push_back(nums[dq.front()]);
        }
    }
    
    return res;
}`,
      java: `public static int[] maxSlidingWindow(int[] nums, int k) {
    Deque<Integer> dq = new ArrayDeque<>();
    List<Integer> resList = new ArrayList<>();
    
    for (int i = 0; i < nums.length; i++) {
        // Remove out of window
        if (!dq.isEmpty() && dq.peekFirst() < i - k + 1) {
            dq.pollFirst();
        }
        
        // Maintain decreasing order
        while (!dq.isEmpty() && nums[dq.peekLast()] < nums[i]) {
            dq.pollLast();
        }
        
        dq.offerLast(i);
        
        if (i >= k - 1) {
            resList.add(nums[dq.peekFirst()]);
        }
    }
    
    return resList.stream().mapToInt(Integer::intValue).toArray();
}`
    },
    solutionExplanation: `A standard queue isn't enough because we need to quickly remove elements that are no longer candidates for being the maximum. We use a Double Ended Queue (Deque) that stores indices. The values corresponding to these indices are maintained in strictly decreasing order. When a new element arrives, we pop all smaller elements from the back because they can never be the maximum while the new element is in the window. We also pop from the front if the index falls outside the current window bounds. The front of the deque always holds the index of the current maximum.`,
    testCases: [
      { id: 'tc-1', input: 'nums=[1,3,-1,-3,5,3,6,7], k=3', expected: '[3,3,5,5,6,7]' },
      { id: 'tc-2', input: 'nums=[1], k=1', expected: '[1]' },
      { id: 'tc-3', input: 'nums=[1,-1], k=1', expected: '[1,-1]' }
    ]
  }
];
