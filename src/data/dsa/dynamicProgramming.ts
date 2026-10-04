import { DsaProblem } from './types';

export const DYNAMIC_PROGRAMMING_PROBLEMS: DsaProblem[] = [
  {
    id: 'dsa-dp-01',
    number: 1,
    title: 'Climbing Stairs',
    slug: 'climbing-stairs',
    category: 'Dynamic Programming',
    difficulty: 'Easy',
    summary: 'Calculate distinct ways to climb n stairs taking 1 or 2 steps.',
    description: `You are climbing a staircase. It takes \`n\` steps to reach the top.\n\nEach time you can either climb \`1\` or \`2\` steps. In how many distinct ways can you climb to the top?`,
    examples: [
      {
        input: 'n = 2',
        output: '2',
        explanation: 'There are two ways to climb: 1+1 and 2.'
      },
      {
        input: 'n = 3',
        output: '3',
        explanation: 'Three ways: 1+1+1, 1+2, 2+1.'
      }
    ],
    constraints: [
      '1 <= n <= 45'
    ],
    keyPoints: [
      '**Brute Force**: Recursively try all combinations of 1s and 2s. Time O(2^N). Exponential.',
      '**Core Insight**: Fibonacci Sequence. To reach step \`n\`, you came from \`n-1\` or \`n-2\`. So, \`ways(n) = ways(n-1) + ways(n-2)\`. Base cases: \`ways(1)=1\`, \`ways(2)=2\`.',
      '**Edge Cases**: n=1 (return 1), n=2 (return 2).',
      '**Space-Time Analysis**: DP with array is O(N) time/space. Optimized rolling variables is O(N) time, O(1) space.'
    ],
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    companies: ['Amazon', 'Microsoft', 'Adobe'],
    starterCode: {
      python: `def climbStairs(n):
    # TODO: Implement DP
    pass

# Test Execution
if __name__ == "__main__":
    print(climbStairs(2)) # Expected: 2
    print(climbStairs(3)) # Expected: 3`,
      javascript: `/**
 * @param {number} n
 * @return {number}
 */
var climbStairs = function(n) {
    // TODO: Implement DP
};

// Test Execution
console.log(climbStairs(2)); // Expected: 2
console.log(climbStairs(3)); // Expected: 3`,
      cpp: `#include <iostream>
using namespace std;

int climbStairs(int n) {
    // TODO: Implement DP
    return 0;
}

int main() {
    cout << climbStairs(2) << endl; // Expected: 2
    cout << climbStairs(3) << endl; // Expected: 3
    return 0;
}`,
      java: `public class Solution {
    public static int climbStairs(int n) {
        // TODO: Implement DP
        return 0;
    }

    public static void main(String[] args) {
        System.out.println(climbStairs(2)); // Expected: 2
        System.out.println(climbStairs(3)); // Expected: 3
    }
}`
    },
    solutionCode: {
      python: `def climbStairs(n):
    if n <= 2:
        return n
        
    prev2 = 1 # ways to reach step 1
    prev1 = 2 # ways to reach step 2
    
    for i in range(3, n + 1):
        curr = prev1 + prev2
        prev2 = prev1
        prev1 = curr
        
    return prev1`,
      javascript: `var climbStairs = function(n) {
    if (n <= 2) return n;
    
    let prev2 = 1; // dp[i-2]
    let prev1 = 2; // dp[i-1]
    
    for (let i = 3; i <= n; i++) {
        let curr = prev1 + prev2;
        prev2 = prev1;
        prev1 = curr;
    }
    
    return prev1;
};`,
      cpp: `int climbStairs(int n) {
    if (n <= 2) return n;
    
    int prev2 = 1;
    int prev1 = 2;
    
    for (int i = 3; i <= n; ++i) {
        int curr = prev1 + prev2;
        prev2 = prev1;
        prev1 = curr;
    }
    
    return prev1;
}`,
      java: `public static int climbStairs(int n) {
    if (n <= 2) return n;
    
    int prev2 = 1;
    int prev1 = 2;
    
    for (int i = 3; i <= n; i++) {
        int curr = prev1 + prev2;
        prev2 = prev1;
        prev1 = curr;
    }
    
    return prev1;
}`
    },
    solutionExplanation: `This problem follows the Fibonacci recurrence relation. The number of ways to reach step \`n\` is the sum of ways to reach \`n-1\` (taking 1 step) and \`n-2\` (taking 2 steps). We optimize space by keeping only the last two values instead of an entire DP array.`,
    testCases: [
      { id: 'tc-1', input: 'n=2', expected: '2' },
      { id: 'tc-2', input: 'n=3', expected: '3' },
      { id: 'tc-3', input: 'n=5', expected: '8' }
    ]
  },
  {
    id: 'dsa-dp-02',
    number: 2,
    title: 'House Robber',
    slug: 'house-rober',
    category: 'Dynamic Programming',
    difficulty: 'Medium',
    summary: 'Maximize money robbed without robbing adjacent houses.',
    description: `You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed, the only constraint stopping you from robbing each of them is that adjacent houses have security systems connected and **it will automatically contact the police if two adjacent houses were broken into on the same night**.\n\nGiven an integer array \`nums\` representing the amount of money of each house, return *the maximum amount of money you can rob tonight **without alerting the police**.`,
    examples: [
      {
        input: 'nums = [1,2,3,1]',
        output: '4',
        explanation: 'Rob house 0 (money=1) and house 2 (money=3). Total = 4.'
      },
      {
        input: 'nums = [2,7,9,3,1]',
        output: '12',
        explanation: 'Rob house 0 (2), house 2 (9), house 4 (1). Total = 12.'
      }
    ],
    constraints: [
      '1 <= nums.length <= 100',
      '0 <= nums[i] <= 400'
    ],
    keyPoints: [
      '**Brute Force**: Try all subsets of non-adjacent indices. Exponential time.',
      '**Core Insight**: Decision at each house: Rob it (add value + max profit from i-2) OR Skip it (max profit from i-1).\nRecurrence: \`dp[i] = max(dp[i-1], dp[i-2] + nums[i])\`.',
      '**Edge Cases**: Single house, two houses.',
      '**Space-Time Analysis**: O(N) time, O(1) space using two variables.'
    ],
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    companies: ['Amazon', 'Meta', 'Apple'],
    starterCode: {
      python: `def rob(nums):
    # TODO: Implement DP
    pass

# Test Execution
if __name__ == "__main__":
    print(rob([1,2,3,1]))   # Expected: 4
    print(rob([2,7,9,3,1])) # Expected: 12`,
      javascript: `/**
 * @param {number[]} nums
 * @return {number}
 */
var rob = function(nums) {
    // TODO: Implement DP
};

// Test Execution
console.log(rob([1,2,3,1]));   // Expected: 4
console.log(rob([2,7,9,3,1])); // Expected: 12`,
      cpp: `#include <vector>
#include <algorithm>
#include <iostream>
using namespace std;

int rob(vector<int>& nums) {
    // TODO: Implement DP
    return 0;
}

int main() {
    vector<int> n1 = {1, 2, 3, 1};
    cout << rob(n1) << endl; // Expected: 4
    
    vector<int> n2 = {2, 7, 9, 3, 1};
    cout << rob(n2) << endl; // Expected: 12
    return 0;
}`,
      java: `import java.util.*;

public class Solution {
    public static int rob(int[] nums) {
        // TODO: Implement DP
        return 0;
    }

    public static void main(String[] args) {
        int[] n1 = {1, 2, 3, 1};
        System.out.println(rob(n1)); // Expected: 4
        
        int[] n2 = {2, 7, 9, 3, 1};
        System.out.println(rob(n2)); // Expected: 12
    }
}`
    },
    solutionCode: {
      python: `def rob(nums):
    if not nums:
        return 0
    if len(nums) == 1:
        return nums[0]
        
    prev2 = 0          # Max profit up to i-2
    prev1 = nums[0]    # Max profit up to i-1
    
    for i in range(1, len(nums)):
        curr = max(prev1, prev2 + nums[i])
        prev2 = prev1
        prev1 = curr
        
    return prev1`,
      javascript: `var rob = function(nums) {
    if (!nums || nums.length === 0) return 0;
    if (nums.length === 1) return nums[0];
    
    let prev2 = 0;          // dp[i-2]
    let prev1 = nums[0];    // dp[i-1]
    
    for (let i = 1; i < nums.length; i++) {
        let curr = Math.max(prev1, prev2 + nums[i]);
        prev2 = prev1;
        prev1 = curr;
    }
    
    return prev1;
};`,
      cpp: `int rob(vector<int>& nums) {
    if (nums.empty()) return 0;
    if (nums.size() == 1) return nums[0];
    
    int prev2 = 0;
    int prev1 = nums[0];
    
    for (int i = 1; i < nums.size(); ++i) {
        int curr = max(prev1, prev2 + nums[i]);
        prev2 = prev1;
        prev1 = curr;
    }
    
    return prev1;
}`,
      java: `public static int rob(int[] nums) {
    if (nums == null || nums.length == 0) return 0;
    if (nums.length == 1) return nums[0];
    
    int prev2 = 0;
    int prev1 = nums[0];
    
    for (int i = 1; i < nums.length; i++) {
        int curr = Math.max(prev1, prev2 + nums[i]);
        prev2 = prev1;
        prev1 = curr;
    }
    
    return prev1;
}`
    },
    solutionExplanation: `At each house \`i\`, we have two choices: skip it (keeping the max profit from \`i-1\`) or rob it (adding \`nums[i]\` to the max profit from \`i-2\`). We take the maximum of these two options. We use two variables \`prev1\` and \`prev2\` to store the results of the previous two states, achieving O(1) space complexity.`,
    testCases: [
      { id: 'tc-1', input: '[1,2,3,1]', expected: '4' },
      { id: 'tc-2', input: '[2,7,9,3,1]', expected: '12' },
      { id: 'tc-3', input: '[5]', expected: '5' }
    ]
  },
  {
    id: 'dsa-dp-03',
    number: 3,
    title: 'House Robber II',
    slug: 'house-rober-ii',
    category: 'Dynamic Programming',
    difficulty: 'Medium',
    summary: 'Maximize robbery in circular arrangement of houses.',
    description: `After robbing those houses on that street, the thief has found himself a new place for his thievery so that he will not get too much attention. Each house at this round neighborhood places its valuables at a location around a circle. That means the first house is the neighbor of the last one. Similarly, the security system will alarm if any two neighboring houses are attempted to be robbed at the same night.\n\nGiven an integer array \`nums\` where \`nums[i]\` represents the amount of money stored in the \`i^{th}\` house, return *the maximum amount of money you can rob tonight without alerting the police*.`,
    examples: [
      {
        input: 'nums = [2,3,2]',
        output: '3',
        explanation: 'Cannot rob both ends. Best is middle house (3).'
      },
      {
        input: 'nums = [1,2,3,1]',
        output: '4',
        explanation: "Rob 1 and 3 (indices 0 and 2) or 2 and 4 (indices 1 and 3)? Actually indices 0&2 -> 1+3=4. Indices 1&3 -> 2+1=3. Wait, circular means 0 and 3 are adjacent. So can't do 0 and 3. Options: [0,2] -> 1+3=4. [1,3] -> 2+1=3. Max 4."
      }
    ],
    constraints: [
      '1 <= nums.length <= 100',
      '0 <= nums[i] <= 1000'
    ],
    keyPoints: [
      '**Brute Force**: Consider all linear subsets respecting circular adjacency. Complex.',
      '**Core Insight**: Break Circle. Since first and last cannot both be robbed, split into two linear problems: 1. Rob houses \`0..n-2\` (exclude last). 2. Rob houses \`1..n-1\` (exclude first). Answer is \`max(linear_rob(0, n-2), linear_rob(1, n-1))\`.',
      '**Edge Cases**: Single house (return nums[0]), two houses (return max of two).',
      '**Space-Time Analysis**: O(N) time, O(1) space per sub-problem.'
    ],
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    companies: ['Amazon', 'Microsoft', 'Google'],
    starterCode: {
      python: `def robLinear(nums, start, end):
    # Helper for standard House Robber logic
    pass

def rob(nums):
    # TODO: Handle circular case
    pass

# Test Execution
if __name__ == "__main__":
    print(rob([2,3,2]))   # Expected: 3
    print(rob([1,2,3,1])) # Expected: 4`,
      javascript: `function robLinear(nums, start, end) {
    // Helper for standard House Robber logic
}

var rob = function(nums) {
    // TODO: Handle circular case
};

// Test Execution
console.log(rob([2,3,2]));   // Expected: 3
console.log(rob([1,2,3,1])); // Expected: 4`,
      cpp: `#include <vector>
#include <algorithm>
#include <iostream>
using namespace std;

int robLinear(const vector<int>& nums, int start, int end) {
    // Helper
    return 0;
}

int rob(vector<int>& nums) {
    // TODO: Handle circular case
    return 0;
}

int main() {
    vector<int> n1 = {2, 3, 2};
    cout << rob(n1) << endl; // Expected: 3
    
    vector<int> n2 = {1, 2, 3, 1};
    cout << rob(n2) << endl; // Expected: 4
    return 0;
}`,
      java: `import java.util.*;

public class Solution {
    private static int robLinear(int[] nums, int start, int end) {
        // Helper
        return 0;
    }

    public static int rob(int[] nums) {
        // TODO: Handle circular case
        return 0;
    }

    public static void main(String[] args) {
        int[] n1 = {2, 3, 2};
        System.out.println(rob(n1)); // Expected: 3
        
        int[] n2 = {1, 2, 3, 1};
        System.out.println(rob(n2)); // Expected: 4
    }
}`
    },
    solutionCode: {
      python: `def robLinear(nums, start, end):
    if start > end:
        return 0
    if start == end:
        return nums[start]
        
    prev2 = 0
    prev1 = 0
    
    for i in range(start, end + 1):
        curr = max(prev1, prev2 + nums[i])
        prev2 = prev1
        prev1 = curr
        
    return prev1

def rob(nums):
    n = len(nums)
    if n == 0: return 0
    if n == 1: return nums[0]
    if n == 2: return max(nums[0], nums[1])
    
    # Case 1: Exclude last house (rob 0 to n-2)
    # Case 2: Exclude first house (rob 1 to n-1)
    return max(robLinear(nums, 0, n - 2), robLinear(nums, 1, n - 1))`,
      javascript: `function robLinear(nums, start, end) {
    if (start > end) return 0;
    if (start === end) return nums[start];
    
    let prev2 = 0;
    let prev1 = 0;
    
    for (let i = start; i <= end; i++) {
        let curr = Math.max(prev1, prev2 + nums[i]);
        prev2 = prev1;
        prev1 = curr;
    }
    
    return prev1;
}

var rob = function(nums) {
    const n = nums.length;
    if (n === 0) return 0;
    if (n === 1) return nums[0];
    if (n === 2) return Math.max(nums[0], nums[1]);
    
    return Math.max(robLinear(nums, 0, n - 2), robLinear(nums, 1, n - 1));
};`,
      cpp: `int robLinear(const vector<int>& nums, int start, int end) {
    if (start > end) return 0;
    if (start == end) return nums[start];
    
    int prev2 = 0;
    int prev1 = 0;
    
    for (int i = start; i <= end; ++i) {
        int curr = max(prev1, prev2 + nums[i]);
        prev2 = prev1;
        prev1 = curr;
    }
    
    return prev1;
}

int rob(vector<int>& nums) {
    int n = nums.size();
    if (n == 0) return 0;
    if (n == 1) return nums[0];
    if (n == 2) return max(nums[0], nums[1]);
    
    return max(robLinear(nums, 0, n - 2), robLinear(nums, 1, n - 1));
}`,
      java: `private static int robLinear(int[] nums, int start, int end) {
    if (start > end) return 0;
    if (start == end) return nums[start];
    
    int prev2 = 0;
    int prev1 = 0;
    
    for (int i = start; i <= end; i++) {
        int curr = Math.max(prev1, prev2 + nums[i]);
        prev2 = prev1;
        prev1 = curr;
    }
    
    return prev1;
}

public static int rob(int[] nums) {
    int n = nums.length;
    if (n == 0) return 0;
    if (n == 1) return nums[0];
    if (n == 2) return Math.max(nums[0], nums[1]);
    
    return Math.max(robLinear(nums, 0, n - 2), robLinear(nums, 1, n - 1));
}`
    },
    solutionExplanation: `The circular constraint implies we cannot rob both the first and last house. Therefore, the optimal solution must exclude either the first house or the last house. We solve two separate linear "House Robber" problems: one for indices \`0\` to \`n-2\`, and another for indices \`1\` to \`n-1\`. The final answer is the maximum of these two results. Special care is taken for small arrays (size 1 or 2).`,
    testCases: [
      { id: 'tc-1', input: '[2,3,2]', expected: '3' },
      { id: 'tc-2', input: '[1,2,3,1]', expected: '4' },
      { id: 'tc-3', input: '[1,2,3]', expected: '3' }
    ]
  },
  {
    id: 'dsa-dp-04',
    number: 4,
    title: 'Longest Palindromic Substring',
    slug: 'longest-palindromic-substring',
    category: 'Dynamic Programming',
    difficulty: 'Medium',
    summary: 'Find the longest palindromic substring in a string.',
    description: `Given a string \`s\`, return *the longest palindromic substring* in \`s\`.`,
    examples: [
      {
        input: 's = "babad"',
        output: '"bab"',
        explanation: '"aba" is also a valid answer.'
      },
      {
        input: 's = "cbbd"',
        output: '"bb"'
      }
    ],
    constraints: [
      '1 <= s.length <= 1000',
      's consist of only digits and English letters.'
    ],
    keyPoints: [
      '**Brute Force**: Check all substrings O(N^3). TLE.',
      '**Core Insight**: Expand Around Center. Every palindrome has a center. Iterate through each character (and gap between characters) as a center, expanding outwards while characters match. Track max length found.',
      '**Edge Cases**: Single char string, all same chars.',
      '**Space-Time Analysis**: O(N^2) time, O(1) space.'
    ],
    timeComplexity: 'O(N^2)',
    spaceComplexity: 'O(1)',
    companies: ['Amazon', 'Microsoft', 'Google', 'Facebook'],
    starterCode: {
      python: `def longestPalindrome(s):
    # TODO: Implement expand around center
    pass

# Test Execution
if __name__ == "__main__":
    print(longestPalindrome("babad")) # Expected: "bab" or "aba"
    print(longestPalindrome("cbbd"))  # Expected: "bb"`,
      javascript: `/**
 * @param {string} s
 * @return {string}
 */
var longestPalindrome = function(s) {
    // TODO: Implement expand around center
};

// Test Execution
console.log(longestPalindrome("babad")); // Expected: "bab" or "aba"
console.log(longestPalindrome("cbbd"));  // Expected: "bb"`,
      cpp: `#include <string>
#include <iostream>
using namespace std;

string longestPalindrome(string s) {
    // TODO: Implement expand around center
    return "";
}

int main() {
    cout << longestPalindrome("babad") << endl; // Expected: bab or aba
    cout << longestPalindrome("cbbd") << endl;  // Expected: bb
    return 0;
}`,
      java: `public class Solution {
    public static String longestPalindrome(String s) {
        // TODO: Implement expand around center
        return "";
    }

    public static void main(String[] args) {
        System.out.println(longestPalindrome("babad")); // Expected: bab or aba
        System.out.println(longestPalindrome("cbbd"));  // Expected: bb
    }
}`
    },
    solutionCode: {
      python: `def longestPalindrome(s):
    if not s:
        return ""
        
    start = 0
    maxLen = 1
    
    def expand(left, right):
        nonlocal start, maxLen
        while left >= 0 and right < len(s) and s[left] == s[right]:
            if right - left + 1 > maxLen:
                start = left
                maxLen = right - left + 1
            left -= 1
            right += 1
            
    for i in range(len(s)):
        expand(i, i)     # Odd length
        expand(i, i + 1) # Even length
        
    return s[start:start + maxLen]`,
      javascript: `var longestPalindrome = function(s) {
    if (!s) return "";
    
    let start = 0;
    let maxLen = 1;
    
    const expand = (left, right) => {
        while (left >= 0 && right < s.length && s[left] === s[right]) {
            if (right - left + 1 > maxLen) {
                start = left;
                maxLen = right - left + 1;
            }
            left--;
            right++;
        }
    };
    
    for (let i = 0; i < s.length; i++) {
        expand(i, i);       // Odd
        expand(i, i + 1);   // Even
    }
    
    return s.substring(start, start + maxLen);
};`,
      cpp: `string longestPalindrome(string s) {
    if (s.empty()) return "";
    
    int start = 0;
    int maxLen = 1;
    
    auto expand = [&](int left, int right) {
        while (left >= 0 && right < s.size() && s[left] == s[right]) {
            if (right - left + 1 > maxLen) {
                start = left;
                maxLen = right - left + 1;
            }
            left--;
            right++;
        }
    };
    
    for (int i = 0; i < s.size(); ++i) {
        expand(i, i);       // Odd
        expand(i, i + 1);   // Even
    }
    
    return s.substr(start, maxLen);
}`,
      java: `public static String longestPalindrome(String s) {
    if (s == null || s.length() < 1) return "";
    
    int start = 0;
    int maxLen = 1;
    
    for (int i = 0; i < s.length(); i++) {
        int len1 = expandAroundCenter(s, i, i);
        int len2 = expandAroundCenter(s, i, i + 1);
        int len = Math.max(len1, len2);
        if (len > maxLen) {
            maxLen = len;
            start = i - (len - 1) / 2;
        }
    }
    
    return s.substring(start, start + maxLen);
}

private static int expandAroundCenter(String s, int left, int right) {
    while (left >= 0 && right < s.length() && s.charAt(left) == s.charAt(right)) {
        left--;
        right++;
    }
    return right - left - 1;
}`
    },
    solutionExplanation: `Instead of checking every possible substring, we note that a palindrome expands symmetrically from its center. There are $2N-1$ possible centers (each character for odd-length palindromes, and each gap between characters for even-length palindromes). For each center, we expand outwards as long as characters match. We keep track of the longest span found.`,
    testCases: [
      { id: 'tc-1', input: '"babad"', expected: '"bab"' },
      { id: 'tc-2', input: '"cbbd"', expected: '"bb"' },
      { id: 'tc-3', input: '"a"', expected: '"a"' }
    ]
  },
  {
    id: 'dsa-dp-05',
    number: 5,
    title: 'Coin Change',
    slug: 'coin-change',
    category: 'Dynamic Programming',
    difficulty: 'Medium',
    summary: 'Find fewest coins to make up an amount.',
    description: `You are given an integer array \`coins\` representing coin denominations and an integer \`amount\`. Return *the fewest number of coins that you need to make up that amount*. If that amount of money cannot be made up by any combination of the coins, return \`-1\`.\n\nYou may assume that you have an infinite number of each kind of coin.`,
    examples: [
      {
        input: 'coins = [1,2,5], amount = 11',
        output: '3',
        explanation: '11 = 5 + 5 + 1'
      },
      {
        input: 'coins = [2], amount = 3',
        output: '-1'
      }
    ],
    constraints: [
      '1 <= coins.length <= 12',
      '1 <= coins[i] <= 2^31 - 1',
      '0 <= amount <= 10^4'
    ],
    keyPoints: [
      '**Brute Force**: Recursive exploration of all combinations. Exponential time.',
      '**Core Insight**: Bottom-Up DP. \`dp[a]\` stores min coins for amount \`a\`. Initialize \`dp[0]=0\`, others to Infinity. For each amount \`a\` from 1 to target, iterate through coins: \`dp[a] = min(dp[a], 1 + dp[a - coin])\` if \`a >= coin\`.',
      '**Edge Cases**: Amount 0 (return 0), impossible amounts (return -1).',
      '**Space-Time Analysis**: O(Amount * NumCoins) time, O(Amount) space.'
    ],
    timeComplexity: 'O(S * N)',
    spaceComplexity: 'O(S)',
    companies: ['Amazon', 'Microsoft', 'Google', 'Bloomberg'],
    starterCode: {
      python: `def coinChange(coins, amount):
    # TODO: Implement DP
    pass

# Test Execution
if __name__ == "__main__":
    print(coinChange([1,2,5], 11)) # Expected: 3
    print(coinChange([2], 3))      # Expected: -1`,
      javascript: `/**
 * @param {number[]} coins
 * @param {number} amount
 * @return {number}
 */
var coinChange = function(coins, amount) {
    // TODO: Implement DP
};

// Test Execution
console.log(coinChange([1,2,5], 11)); // Expected: 3
console.log(coinChange([2], 3));      // Expected: -1`,
      cpp: `#include <vector>
#include <algorithm>
#include <climits>
#include <iostream>
using namespace std;

int coinChange(vector<int>& coins, int amount) {
    // TODO: Implement DP
    return -1;
}

int main() {
    vector<int> c1 = {1, 2, 5};
    cout << coinChange(c1, 11) << endl; // Expected: 3
    
    vector<int> c2 = {2};
    cout << coinChange(c2, 3) << endl;  // Expected: -1
    return 0;
}`,
      java: `import java.util.*;

public class Solution {
    public static int coinChange(int[] coins, int amount) {
        // TODO: Implement DP
        return -1;
    }

    public static void main(String[] args) {
        int[] c1 = {1, 2, 5};
        System.out.println(coinChange(c1, 11)); // Expected: 3
        
        int[] c2 = {2};
        System.out.println(coinChange(c2, 3));  // Expected: -1
    }
}`
    },
    solutionCode: {
      python: `def coinChange(coins, amount):
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    
    for i in range(1, amount + 1):
        for coin in coins:
            if i - coin >= 0:
                dp[i] = min(dp[i], 1 + dp[i - coin])
                
    return dp[amount] if dp[amount] != float('inf') else -1`,
      javascript: `var coinChange = function(coins, amount) {
    const dp = new Array(amount + 1).fill(Infinity);
    dp[0] = 0;
    
    for (let i = 1; i <= amount; i++) {
        for (let coin of coins) {
            if (i - coin >= 0) {
                dp[i] = Math.min(dp[i], 1 + dp[i - coin]);
            }
        }
    }
    
    return dp[amount] !== Infinity ? dp[amount] : -1;
};`,
      cpp: `int coinChange(vector<int>& coins, int amount) {
    vector<int> dp(amount + 1, INT_MAX);
    dp[0] = 0;
    
    for (int i = 1; i <= amount; ++i) {
        for (int coin : coins) {
            if (i - coin >= 0 && dp[i - coin] != INT_MAX) {
                dp[i] = min(dp[i], 1 + dp[i - coin]);
            }
        }
    }
    
    return dp[amount] == INT_MAX ? -1 : dp[amount];
}`,
      java: `public static int coinChange(int[] coins, int amount) {
    int[] dp = new int[amount + 1];
    Arrays.fill(dp, amount + 1); // Use amount+1 as infinity proxy
    dp[0] = 0;
    
    for (int i = 1; i <= amount; i++) {
        for (int coin : coins) {
            if (i - coin >= 0) {
                dp[i] = Math.min(dp[i], 1 + dp[i - coin]);
            }
        }
    }
    
    return dp[amount] > amount ? -1 : dp[amount];
}`
    },
    solutionExplanation: `We use dynamic programming where \`dp[i]\` represents the minimum number of coins needed to make amount \`i\`. We initialize \`dp[0] = 0\` and all other entries to infinity. For each amount from 1 to \`target\`, we iterate through all available coins. If using a coin reduces the total count compared to previous solutions for smaller amounts, we update \`dp[i]\`. Finally, if \`dp[amount]\` remains infinity, it means the amount is unreachable.`,
    testCases: [
      { id: 'tc-1', input: 'coins=[1,2,5], amount=11', expected: '3' },
      { id: 'tc-2', input: 'coins=[2], amount=3', expected: '-1' },
      { id: 'tc-3', input: 'coins=[1], amount=0', expected: '0' }
    ]
  },
  {
    id: 'dsa-dp-06',
    number: 6,
    title: 'Maximum Subarray',
    slug: 'maximum-subarray',
    category: 'Dynamic Programming',
    difficulty: 'Medium',
    summary: 'Find contiguous subarray with largest sum.',
    description: `Given an integer array \`nums\`, find the subarray with the largest sum, and return *its sum*.`,
    examples: [
      {
        input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]',
        output: '6',
        explanation: 'Subarray [4,-1,2,1] has the largest sum 6.'
      }
    ],
    constraints: [
      '1 <= nums.length <= 10^5',
      '-10^4 <= nums[i] <= 10^4'
    ],
    keyPoints: [
      '**Brute Force**: Check all subarrays. Time O(N^2) or O(N^3). TLE.',
      '**Core Insight**: Kadane\'s Algorithm. At each index, decide whether to extend the current subarray or start a new one. \`currentSum = max(num, currentSum + num)\`. Update global max.\nEssentially: \`dp[i] = max(nums[i], dp[i-1] + nums[i])\`.',
      '**Edge Cases**: All negative numbers (return max single element), empty array (not allowed).',
      '**Space-Time Analysis**: O(N) time, O(1) space.'
    ],
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    companies: ['Amazon', 'Microsoft', 'Google', 'LinkedIn'],
    starterCode: {
      python: `def maxSubArray(nums):
    # TODO: Implement Kadane's Algo
    pass

# Test Execution
if __name__ == "__main__":
    print(maxSubArray([-2,1,-3,4,-1,2,1,-5,4])) # Expected: 6`,
      javascript: `/**
 * @param {number[]} nums
 * @return {number}
 */
var maxSubArray = function(nums) {
    // TODO: Implement Kadane's Algo
};

// Test Execution
console.log(maxSubArray([-2,1,-3,4,-1,2,1,-5,4])); // Expected: 6`,
      cpp: `#include <vector>
#include <algorithm>
#include <climits>
#include <iostream>
using namespace std;

int maxSubArray(vector<int>& nums) {
    // TODO: Implement Kadane's Algo
    return 0;
}

int main() {
    vector<int> n = {-2, 1, -3, 4, -1, 2, 1, -5, 4};
    cout << maxSubArray(n) << endl; // Expected: 6
    return 0;
}`,
      java: `import java.util.*;

public class Solution {
    public static int maxSubArray(int[] nums) {
        // TODO: Implement Kadane's Algo
        return 0;
    }

    public static void main(String[] args) {
        int[] n = {-2, 1, -3, 4, -1, 2, 1, -5, 4};
        System.out.println(maxSubArray(n)); // Expected: 6
    }
}`
    },
    solutionCode: {
      python: `def maxSubArray(nums):
    max_sum = nums[0]
    current_sum = nums[0]
    
    for i in range(1, len(nums)):
        current_sum = max(nums[i], current_sum + nums[i])
        max_sum = max(max_sum, current_sum)
        
    return max_sum`,
      javascript: `var maxSubArray = function(nums) {
    let maxSum = nums[0];
    let currentSum = nums[0];
    
    for (let i = 1; i < nums.length; i++) {
        currentSum = Math.max(nums[i], currentSum + nums[i]);
        maxSum = Math.max(maxSum, currentSum);
    }
    
    return maxSum;
};`,
      cpp: `int maxSubArray(vector<int>& nums) {
    int maxSum = nums[0];
    int currentSum = nums[0];
    
    for (int i = 1; i < nums.size(); ++i) {
        currentSum = max(nums[i], currentSum + nums[i]);
        maxSum = max(maxSum, currentSum);
    }
    
    return maxSum;
}`,
      java: `public static int maxSubArray(int[] nums) {
    int maxSum = nums[0];
    int currentSum = nums[0];
    
    for (int i = 1; i < nums.length; i++) {
        currentSum = Math.max(nums[i], currentSum + nums[i]);
        maxSum = Math.max(maxSum, currentSum);
    }
    
    return maxSum;
}`
    },
    solutionExplanation: `Kadane\'s algorithm maintains a running sum (\`currentSum\`). At each step, we ask: "Is it better to add the current number to the existing subarray, or start a new subarray from here?" This is decided by \`max(nums[i], currentSum + nums[i])\`. If adding the current number makes the sum smaller than the number itself (i.e., previous sum was negative), we reset. We track the highest \`currentSum\` seen so far in \`maxSum\`.`,
    testCases: [
      { id: 'tc-1', input: '[-2,1,-3,4,-1,2,1,-5,4]', expected: '6' },
      { id: 'tc-2', input: '[1]', expected: '1' },
      { id: 'tc-3', input: '[-2,-1,-3]', expected: '-1' }
    ]
  },
  {
    id: 'dsa-dp-07',
    number: 7,
    title: 'Longest Increasing Subsequence',
    slug: 'longest-increasing-subsequence',
    category: 'Dynamic Programming',
    difficulty: 'Medium',
    summary: 'Find length of longest strictly increasing subsequence.',
    description: `Given an integer array \`nums\`, return *the length of the longest **strictly increasing*** *subsequence*.\n\nA subsequence is derived from the array deleting some (or no) elements without changing the order of the remaining elements.`,
    examples: [
      {
        input: 'nums = [10,9,2,5,3,7,101,18]',
        output: '4',
        explanation: 'LIS is [2,3,7,101] or [2,3,7,18].'
      }
    ],
    constraints: [
      '1 <= nums.length <= 2500',
      '-10^4 <= nums[i] <= 10^4'
    ],
    keyPoints: [
      '**Brute Force**: Generate all subsequences. Exponential.',
      '**Core Insight**: Standard DP. \`dp[i]\` = length of LIS ending at index \`i\`. For each \`i\`, check all \`j < i\`. If \`nums[j] < nums[i]\`, then \`dp[i] = max(dp[i], dp[j] + 1)\`. Result is max of all \`dp\` values.',
      '**Optimization Note**: Patience Sorting (Binary Search) offers O(N log N), but O(N^2) DP is often accepted for N<=2500.',
      '**Space-Time Analysis**: O(N^2) time, O(N) space for basic DP.'
    ],
    timeComplexity: 'O(N^2)',
    spaceComplexity: 'O(N)',
    companies: ['Amazon', 'Microsoft', 'Google', 'Uber'],
    starterCode: {
      python: `def lengthOfLIS(nums):
    # TODO: Implement O(N^2) DP
    pass

# Test Execution
if __name__ == "__main__":
    print(lengthOfLIS([10,9,2,5,3,7,101,18])) # Expected: 4`,
      javascript: `/**
 * @param {number[]} nums
 * @return {number}
 */
var lengthOfLIS = function(nums) {
    // TODO: Implement O(N^2) DP
};

// Test Execution
console.log(lengthOfLIS([10,9,2,5,3,7,101,18])); // Expected: 4`,
      cpp: `#include <vector>
#include <algorithm>
#include <iostream>
using namespace std;

int lengthOfLIS(vector<int>& nums) {
    // TODO: Implement O(N^2) DP
    return 0;
}

int main() {
    vector<int> n = {10, 9, 2, 5, 3, 7, 101, 18};
    cout << lengthOfLIS(n) << endl; // Expected: 4
    return 0;
}`,
      java: `import java.util.*;

public class Solution {
    public static int lengthOfLIS(int[] nums) {
        // TODO: Implement O(N^2) DP
        return 0;
    }

    public static void main(String[] args) {
        int[] n = {10, 9, 2, 5, 3, 7, 101, 18};
        System.out.println(lengthOfLIS(n)); // Expected: 4
    }
}`
    },
    solutionCode: {
      python: `def lengthOfLIS(nums):
    if not nums:
        return 0
        
    n = len(nums)
    dp = [1] * n
    maxLen = 1
    
    for i in range(n):
        for j in range(i):
            if nums[j] < nums[i]:
                dp[i] = max(dp[i], dp[j] + 1)
        maxLen = max(maxLen, dp[i])
        
    return maxLen`,
      javascript: `var lengthOfLIS = function(nums) {
    if (!nums.length) return 0;
    
    const n = nums.length;
    const dp = new Array(n).fill(1);
    let maxLen = 1;
    
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < i; j++) {
            if (nums[j] < nums[i]) {
                dp[i] = Math.max(dp[i], dp[j] + 1);
            }
        }
        maxLen = Math.max(maxLen, dp[i]);
    }
    
    return maxLen;
};`,
      cpp: `int lengthOfLIS(vector<int>& nums) {
    if (nums.empty()) return 0;
    
    int n = nums.size();
    vector<int> dp(n, 1);
    int maxLen = 1;
    
    for (int i = 0; i < n; ++i) {
        for (int j = 0; j < i; ++j) {
            if (nums[j] < nums[i]) {
                dp[i] = max(dp[i], dp[j] + 1);
            }
        }
        maxLen = max(maxLen, dp[i]);
    }
    
    return maxLen;
}`,
      java: `public static int lengthOfLIS(int[] nums) {
    if (nums.length == 0) return 0;
    
    int n = nums.length;
    int[] dp = new int[n];
    Arrays.fill(dp, 1);
    int maxLen = 1;
    
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < i; j++) {
            if (nums[j] < nums[i]) {
                dp[i] = Math.max(dp[i], dp[j] + 1);
            }
        }
        maxLen = Math.max(maxLen, dp[i]);
    }
    
    return maxLen;
}`
    },
    solutionExplanation: `We define \`dp[i]\` as the length of the longest increasing subsequence ending exactly at index \`i\`. Initially, every element forms a subsequence of length 1. For each \`i\`, we look back at all previous indices \`j\`. If \`nums[j] < nums[i]\`, we can extend the subsequence ending at \`j\` by appending \`nums[i]\`, making the potential length \`dp[j] + 1\`. We take the maximum over all such \`j\`. The final answer is the maximum value in the \`dp\` array.`,
    testCases: [
      { id: 'tc-1', input: '[10,9,2,5,3,7,101,18]', expected: '4' },
      { id: 'tc-2', input: '[0,1,0,3,2,3]', expected: '4' },
      { id: 'tc-3', input: '[7,7,7,7,7]', expected: '1' }
    ]
  },
  {
    id: 'dsa-dp-08',
    number: 8,
    title: 'Edit Distance',
    slug: 'edit-distance',
    category: 'Dynamic Programming',
    difficulty: 'Hard',
    summary: 'Minimum operations to convert word1 to word2.',
    description: `Given two strings \`word1\` and \`word2\`, return *the minimum number of operations required to convert*\`\` word1\`\` *to*\`\` word2\`\`.\n\nYou have the following three operations permitted on a word:\n* Insert a character\n* Delete a character\n* Replace a character`,
    examples: [
      {
        input: 'word1 = "horse", word2 = "ros"',
        output: '3',
        explanation: 'horse -> rorse (replace h with r) -> rose (delete r) -> ros (delete e)'
      }
    ],
    constraints: [
      '0 <= word1.length, word2.length <= 500',
      'word1 and word2 consist of lowercase English letters.'
    ],
    keyPoints: [
      '**Brute Force**: Recursive exploration of all edit paths. Exponential.',
      '**Core Insight**: 2D DP Table. \`dp[i][j]\` = min edits to convert \`word1[0..i-1]\` to \`word2[0..j-1]\`.\nIf chars match: \`dp[i][j] = dp[i-1][j-1]\`.\nElse: \`dp[i][j] = 1 + min(insert, delete, replace)\` which corresponds to \`dp[i][j-1]\`, \`dp[i-1][j]\`, \`dp[i-1][j-1]\`.',
      '**Edge Cases**: Empty strings (distance is length of other string).',
      '**Space-Time Analysis**: O(M*N) time, O(M*N) space (can be optimized to O(min(M,N))).'
    ],
    timeComplexity: 'O(M*N)',
    spaceComplexity: 'O(M*N)',
    companies: ['Amazon', 'Microsoft', 'Google', 'LinkedIn'],
    starterCode: {
      python: `def minDistance(word1, word2):
    # TODO: Implement 2D DP
    pass

# Test Execution
if __name__ == "__main__":
    print(minDistance("horse", "ros")) # Expected: 3
    print(minDistance("intention", "execution")) # Expected: 5`,
      javascript: `/**
 * @param {string} word1
 * @param {string} word2
 * @return {number}
 */
var minDistance = function(word1, word2) {
    // TODO: Implement 2D DP
};

// Test Execution
console.log(minDistance("horse", "ros")); // Expected: 3
console.log(minDistance("intention", "execution")); // Expected: 5`,
      cpp: `#include <string>
#include <vector>
#include <algorithm>
#include <iostream>
using namespace std;

int minDistance(string word1, string word2) {
    // TODO: Implement 2D DP
    return 0;
}

int main() {
    cout << minDistance("horse", "ros") << endl; // Expected: 3
    cout << minDistance("intention", "execution") << endl; // Expected: 5
    return 0;
}`,
      java: `import java.util.*;

public class Solution {
    public static int minDistance(String word1, String word2) {
        // TODO: Implement 2D DP
        return 0;
    }

    public static void main(String[] args) {
        System.out.println(minDistance("horse", "ros")); // Expected: 3
        System.out.println(minDistance("intention", "execution")); // Expected: 5
    }
}`
    },
    solutionCode: {
      python: `def minDistance(word1, word2):
    m, n = len(word1), len(word2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    
    # Base cases: transforming to/from empty string
    for i in range(m + 1):
        dp[i][0] = i
    for j in range(n + 1):
        dp[0][j] = j
        
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if word1[i-1] == word2[j-1]:
                dp[i][j] = dp[i-1][j-1]
            else:
                # Insert, Delete, Replace
                dp[i][j] = 1 + min(
                    dp[i][j-1],    # Insert
                    dp[i-1][j],    # Delete
                    dp[i-1][j-1]   # Replace
                )
                
    return dp[m][n]`,
      javascript: `var minDistance = function(word1, word2) {
    const m = word1.length;
    const n = word2.length;
    
    // Create DP table
    const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
    
    // Initialize base cases
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (word1[i - 1] === word2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1];
            } else {
                dp[i][j] = 1 + Math.min(
                    dp[i][j - 1],    // Insert
                    dp[i - 1][j],    // Delete
                    dp[i - 1][j - 1] // Replace
                );
            }
        }
    }
    
    return dp[m][n];
};`,
      cpp: `int minDistance(string word1, string word2) {
    int m = word1.length();
    int n = word2.length();
    
    vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));
    
    for (int i = 0; i <= m; ++i) dp[i][0] = i;
    for (int j = 0; j <= n; ++j) dp[0][j] = j;
    
    for (int i = 1; i <= m; ++i) {
        for (int j = 1; j <= n; ++j) {
            if (word1[i - 1] == word2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1];
            } else {
                dp[i][j] = 1 + min({
                    dp[i][j - 1],    // Insert
                    dp[i - 1][j],    // Delete
                    dp[i - 1][j - 1] // Replace
                });
            }
        }
    }
    
    return dp[m][n];
}`,
      java: `public static int minDistance(String word1, String word2) {
    int m = word1.length();
    int n = word2.length();
    
    int[][] dp = new int[m + 1][n + 1];
    
    for (int i = 0; i <= m; i++) dp[i][0] = i;
    for (int j = 0; j <= n; j++) dp[0][j] = j;
    
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (word1.charAt(i - 1) == word2.charAt(j - 1)) {
                dp[i][j] = dp[i - 1][j - 1];
            } else {
                dp[i][j] = 1 + Math.min(
                    dp[i][j - 1],    // Insert
                    Math.min(
                        dp[i - 1][j],    // Delete
                        dp[i - 1][j - 1] // Replace
                    )
                );
            }
        }
    }
    
    return dp[m][n];
}`
    },
    solutionExplanation: `We construct a matrix \`dp\` where \`dp[i][j]\` represents the Levenshtein distance between the first \`i\` characters of \`word1\` and the first \`j\` characters of \`word2\`. If the current characters match, no operation is needed, so we inherit the diagonal value. If they don't match, we consider three operations: Insertion (move left in row), Deletion (move up in column), or Replacement (move diagonally). We take the minimum cost among these plus 1.`,
    testCases: [
      { id: 'tc-1', input: 'word1="horse", word2="ros"', expected: '3' },
      { id: 'tc-2', input: 'word1="intention", word2="execution"', expected: '5' },
      { id: 'tc-3', input: 'word1="", word2=""', expected: '0' }
    ]
  }
];
