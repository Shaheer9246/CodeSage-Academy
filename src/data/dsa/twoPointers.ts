import { DsaProblem } from './types';

export const TWO_POINTERS_PROBLEMS: DsaProblem[] = [
  {
    id: 'dsa-tp-01',
    number: 1,
    title: 'Valid Palindrome',
    slug: 'valid-palindrome',
    category: 'Two Pointers',
    difficulty: 'Easy',
    summary: 'Check if a string is a palindrome considering only alphanumeric characters.',
    description: `A phrase is a **palindrome** if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.\n\nGiven a string \`s\`, return \`true\` *if it is a palindrome*, or \`false\` otherwise.`,
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
      }
    ],
    constraints: [
      '1 <= s.length <= 2 * 10^5',
      's consists only of printable ASCII characters.'
    ],
    keyPoints: [
      '**Brute Force**: Create a cleaned version of the string (lowercase, alphanum only) and reverse it to compare. Time O(N), Space O(N).',
      '**Core Insight**: Two Pointers. Place one pointer at start (\`left\`) and one at end (\`right\`). Move inward, skipping non-alphanumeric chars. Compare characters at pointers. If mismatch, return false.',
      '**Edge Cases**: Empty string (after cleaning), single character, strings with only punctuation/spaces.',
      '**Space-Time Analysis**: Optimal solution is O(N) time and O(1) space.'
    ],
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    companies: ['Amazon', 'Facebook', 'Microsoft'],
    starterCode: {
      python: `def isPalindrome(s):
    # TODO: Implement two pointer approach
    pass

# Test Execution
if __name__ == "__main__":
    print(isPalindrome("A man, a plan, a canal: Panama")) # Expected: True
    print(isPalindrome("race a car"))                     # Expected: False`,
      javascript: `/**
 * @param {string} s
 * @return {boolean}
 */
var isPalindrome = function(s) {
    // TODO: Implement two pointer approach
};

// Test Execution
console.log(isPalindrome("A man, a plan, a canal: Panama")); // Expected: true
console.log(isPalindrome("race a car"));                     // Expected: false`,
      cpp: `#include <string>
#include <cctype>
#include <iostream>
using namespace std;

bool isPalindrome(string s) {
    // TODO: Implement two pointer approach
    return false;
}

int main() {
    cout << (isPalindrome("A man, a plan, a canal: Panama") ? "true" : "false") << endl; // Expected: true
    cout << (isPalindrome("race a car") ? "true" : "false") << endl;                     // Expected: false
    return 0;
}`,
      java: `public class Solution {
    public static boolean isPalindrome(String s) {
        // TODO: Implement two pointer approach
        return false;
    }

    public static void main(String[] args) {
        System.out.println(isPalindrome("A man, a plan, a canal: Panama")); // Expected: true
        System.out.println(isPalindrome("race a car"));                     // Expected: false
    }
}`
    },
    solutionCode: {
      python: `def isPalindrome(s):
    left, right = 0, len(s) - 1
    
    while left < right:
        # Skip non-alphanumeric from left
        while left < right and not s[left].isalnum():
            left += 1
        # Skip non-alphanumeric from right
        while left < right and not s[right].isalnum():
            right -= 1
            
        if s[left].lower() != s[right].lower():
            return False
            
        left += 1
        right -= 1
        
    return True`,
      javascript: `var isPalindrome = function(s) {
    let left = 0;
    let right = s.length - 1;
    
    while (left < right) {
        // Helper to check alphanumeric
        const isAlnum = (c) => /[a-zA-Z0-9]/.test(c);
        
        while (left < right && !isAlnum(s[left])) left++;
        while (left < right && !isAlnum(s[right])) right--;
        
        if (s[left].toLowerCase() !== s[right].toLowerCase()) {
            return false;
        }
        
        left++;
        right--;
    }
    
    return true;
};`,
      cpp: `bool isPalindrome(string s) {
    int left = 0;
    int right = s.size() - 1;
    
    while (left < right) {
        while (left < right && !isalnum(s[left])) left++;
        while (left < right && !isalnum(s[right])) right--;
        
        if (tolower(s[left]) != tolower(s[right])) {
            return false;
        }
        
        left++;
        right--;
    }
    
    return true;
}`,
      java: `public static boolean isPalindrome(String s) {
    int left = 0;
    int right = s.length() - 1;
    
    while (left < right) {
        while (left < right && !Character.isLetterOrDigit(s.charAt(left))) {
            left++;
        }
        while (left < right && !Character.isLetterOrDigit(s.charAt(right))) {
            right--;
        }
        
        if (Character.toLowerCase(s.charAt(left)) != Character.toLowerCase(s.charAt(right))) {
            return false;
        }
        
        left++;
        right--;
    }
    
    return true;
}`
    },
    solutionExplanation: `We initialize two pointers at opposite ends of the string. We move them towards each other, ignoring any character that is not alphanumeric. Once both pointers land on valid characters, we compare them case-insensitively. If they differ, the string is not a palindrome. If they match, we advance both pointers. This continues until the pointers cross, confirming it is a palindrome.`,
    testCases: [
      { id: 'tc-1', input: '"A man, a plan, a canal: Panama"', expected: 'true' },
      { id: 'tc-2', input: '"race a car"', expected: 'false' },
      { id: 'tc-3', input: '" "', expected: 'true' }
    ]
  },
  {
    id: 'dsa-tp-02',
    number: 2,
    title: 'Two Sum II - Input Array Is Sorted',
    slug: 'two-sum-ii-input-array-is-sorted',
    category: 'Two Pointers',
    difficulty: 'Medium',
    summary: 'Find two numbers in a sorted array that add up to target.',
    description: `Given a **1-indexed** array of integers \`numbers\` that is already **sorted in non-decreasing order**, find two numbers such that they add up to a specific \`target\` number. Let these two numbers be \`numbers[index_1]\` and \`numbers[index_2]\` where \`1 <= index_1 < index_2 <= numbers.length\`.\n\nReturn *the indices of the two numbers,* \`index_1\` *and* \`index_2\`, **added by one** as an integer array \`[index_1, index_2]\` of length 2.\n\nThe tests are generated such that there is **exactly one solution**. You **may not** use the same element twice.`,
    examples: [
      {
        input: 'numbers = [2,7,11,15], target = 9',
        output: '[1,2]',
        explanation: 'The sum of 2 and 7 is 9. Therefore index_1 = 1, index_2 = 2.'
      },
      {
        input: 'numbers = [2,3,4], target = 6',
        output: '[1,3]',
        explanation: 'The sum of 2 and 4 is 6. Therefore index_1 = 1, index_2 = 3.'
      }
    ],
    constraints: [
      '2 <= numbers.length <= 3 * 10^4',
      '-1000 <= numbers[i] <= 1000',
      'numbers is sorted in non-decreasing order.',
      '-1000 <= target <= 1000',
      'The tests are generated such that there is exactly one solution.'
    ],
    keyPoints: [
      '**Brute Force**: Nested loops checking every pair. Time O(N^2). Too slow.',
      '**Core Insight**: Two Pointers from ends. Since array is sorted, if sum > target, decrement right pointer (to reduce sum). If sum < target, increment left pointer (to increase sum).',
      '**Edge Cases**: Negative numbers, zeros, duplicate values (though problem says unique solution exists).',
      '**Space-Time Analysis**: O(N) time, O(1) space.'
    ],
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    companies: ['Amazon', 'Microsoft', 'Adobe'],
    starterCode: {
      python: `def twoSum(numbers, target):
    # TODO: Implement two pointer logic
    pass

# Test Execution
if __name__ == "__main__":
    print(twoSum([2,7,11,15], 9)) # Expected: [1, 2]
    print(twoSum([2,3,4], 6))     # Expected: [1, 3]`,
      javascript: `/**
 * @param {number[]} numbers
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(numbers, target) {
    // TODO: Implement two pointer logic
};

// Test Execution
console.log(twoSum([2,7,11,15], 9)); // Expected: [1, 2]
console.log(twoSum([2,3,4], 6));     // Expected: [1, 3]`,
      cpp: `#include <vector>
#include <iostream>
using namespace std;

vector<int> twoSum(vector<int>& numbers, int target) {
    // TODO: Implement two pointer logic
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
    printVec(twoSum(n1, 9)); // Expected: [1,2]
    
    vector<int> n2 = {2, 3, 4};
    printVec(twoSum(n2, 6)); // Expected: [1,3]
    return 0;
}`,
      java: `import java.util.*;

public class Solution {
    public static int[] twoSum(int[] numbers, int target) {
        // TODO: Implement two pointer logic
        return new int[0];
    }

    public static void main(String[] args) {
        int[] n1 = {2, 7, 11, 15};
        System.out.println(Arrays.toString(twoSum(n1, 9))); // Expected: [1, 2]
        
        int[] n2 = {2, 3, 4};
        System.out.println(Arrays.toString(twoSum(n2, 6))); // Expected: [1, 3]
    }
}`
    },
    solutionCode: {
      python: `def twoSum(numbers, target):
    left, right = 0, len(numbers) - 1
    
    while left < right:
        current_sum = numbers[left] + numbers[right]
        
        if current_sum == target:
            return [left + 1, right + 1] # 1-indexed
        elif current_sum < target:
            left += 1
        else:
            right -= 1
            
    return []`,
      javascript: `var twoSum = function(numbers, target) {
    let left = 0;
    let right = numbers.length - 1;
    
    while (left < right) {
        const sum = numbers[left] + numbers[right];
        
        if (sum === target) {
            return [left + 1, right + 1]; // 1-indexed
        } else if (sum < target) {
            left++;
        } else {
            right--;
        }
    }
    
    return [];
};`,
      cpp: `vector<int> twoSum(vector<int>& numbers, int target) {
    int left = 0;
    int right = numbers.size() - 1;
    
    while (left < right) {
        int sum = numbers[left] + numbers[right];
        
        if (sum == target) {
            return {left + 1, right + 1}; // 1-indexed
        } else if (sum < target) {
            left++;
        } else {
            right--;
        }
    }
    
    return {};
}`,
      java: `public static int[] twoSum(int[] numbers, int target) {
    int left = 0;
    int right = numbers.length - 1;
    
    while (left < right) {
        int sum = numbers[left] + numbers[right];
        
        if (sum == target) {
            return new int[]{left + 1, right + 1}; // 1-indexed
        } else if (sum < target) {
            left++;
        } else {
            right--;
        }
    }
    
    return new int[0];
}`
    },
    solutionExplanation: `Because the input array is sorted, we can exploit the monotonic property. We place pointers at the extremes. If the sum of the elements at these pointers is less than the target, we need a larger sum, so we move the left pointer rightward (increasing the value). If the sum is greater, we move the right pointer leftward (decreasing the value). This converges efficiently to the solution. Note the requirement for 1-based indexing in the output.`,
    testCases: [
      { id: 'tc-1', input: 'numbers=[2,7,11,15], target=9', expected: '[1,2]' },
      { id: 'tc-2', input: 'numbers=[2,3,4], target=6', expected: '[1,3]' },
      { id: 'tc-3', input: 'numbers=[-1,0], target=-1', expected: '[1,2]' }
    ]
  },
  {
    id: 'dsa-tp-03',
    number: 3,
    title: '3Sum',
    slug: '3sum',
    category: 'Two Pointers',
    difficulty: 'Medium',
    summary: 'Find all unique triplets in the array which gives the sum of zero.',
    description: `Given an integer array \`nums\`, return all the triplets \`[nums[i], nums[j], nums[k]]\` such that \`i != j\`, \`i != k\`, and \`j != k\`, and \`nums[i] + nums[j] + nums[k] == 0\`.\n\nNotice that the solution set must not contain duplicate triplets.`,
    examples: [
      {
        input: 'nums = [-1,0,1,2,-1,-4]',
        output: '[[-1,-1,2],[-1,0,1]]',
        explanation: 'Triplet (-1, 0, 1) sums to 0. Triplet (-1, -1, 2) sums to 0.'
      },
      {
        input: 'nums = [0,1,1]',
        output: '[]',
        explanation: 'Only possible triplet is (0, 1, 1) which sums to 2.'
      }
    ],
    constraints: [
      '0 <= nums.length <= 3000',
      '-10^5 <= nums[i] <= 10^5'
    ],
    keyPoints: [
      '**Brute Force**: Triple nested loop. Time O(N^3). TLE.',
      '**Core Insight**: Sort + Fixed Pointer + Two Pointers. Fix one number \`nums[i]\`. Then solve "2Sum" for \`-nums[i]\` using two pointers on the remaining subarray. Skip duplicates for \`i\`, \`left\`, and \`right\` to ensure uniqueness.',
      '**Edge Cases**: All zeros, no solution, large inputs causing overflow (use long if needed, though Python/JS handle big ints, C++/Java need care).',
      '**Space-Time Analysis**: O(N log N) time (sorting dominates), O(1) extra space (ignoring output storage).'
    ],
    timeComplexity: 'O(N^2)',
    spaceComplexity: 'O(1)',
    companies: ['Amazon', 'Google', 'Meta', 'Microsoft'],
    starterCode: {
      python: `def threeSum(nums):
    # TODO: Implement sort + two pointers
    pass

# Test Execution
if __name__ == "__main__":
    print(threeSum([-1,0,1,2,-1,-4])) # Expected: [[-1,-1,2],[-1,0,1]]
    print(threeSum([]))               # Expected: []`,
      javascript: `/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var threeSum = function(nums) {
    // TODO: Implement sort + two pointers
};

// Test Execution
console.log(JSON.stringify(threeSum([-1,0,1,2,-1,-4]))); // Expected: [[-1,-1,2],[-1,0,1]]
console.log(JSON.stringify(threeSum([])));               // Expected: []`,
      cpp: `#include <vector>
#include <algorithm>
#include <iostream>
using namespace std;

vector<vector<int>> threeSum(vector<int>& nums) {
    // TODO: Implement sort + two pointers
    return {};
}

void printRes(const vector<vector<int>>& res) {
    cout << "[";
    for(size_t i=0; i<res.size(); ++i) {
        cout << "[";
        for(size_t j=0; j<res[i].size(); ++j) {
            cout << res[i][j];
            if(j < res[i].size()-1) cout << ",";
        }
        cout << "]";
        if(i < res.size()-1) cout << ",";
    }
    cout << "]" << endl;
}

int main() {
    vector<int> n1 = {-1, 0, 1, 2, -1, -4};
    printRes(threeSum(n1)); // Expected: [[-1,-1,2],[-1,0,1]]
    
    vector<int> n2 = {};
    printRes(threeSum(n2)); // Expected: []
    return 0;
}`,
      java: `import java.util.*;

public class Solution {
    public static List<List<Integer>> threeSum(int[] nums) {
        // TODO: Implement sort + two pointers
        return new ArrayList<>();
    }

    public static void main(String[] args) {
        int[] n1 = {-1, 0, 1, 2, -1, -4};
        System.out.println(threeSum(n1)); // Expected: [[-1, -1, 2], [-1, 0, 1]]
        
        int[] n2 = {};
        System.out.println(threeSum(n2)); // Expected: []
    }
}`
    },
    solutionCode: {
      python: `def threeSum(nums):
    nums.sort()
    res = []
    n = len(nums)
    
    for i in range(n - 2):
        if i > 0 and nums[i] == nums[i - 1]:
            continue
            
        left, right = i + 1, n - 1
        
        while left < right:
            total = nums[i] + nums[left] + nums[right]
            
            if total < 0:
                left += 1
            elif total > 0:
                right -= 1
            else:
                res.append([nums[i], nums[left], nums[right]])
                left += 1
                right -= 1
                
                while left < right and nums[left] == nums[left - 1]:
                    left += 1
                while left < right and nums[right] == nums[right + 1]:
                    right -= 1
                    
    return res`,
      javascript: `var threeSum = function(nums) {
    nums.sort((a, b) => a - b);
    const res = [];
    const n = nums.length;
    
    for (let i = 0; i < n - 2; i++) {
        if (i > 0 && nums[i] === nums[i - 1]) continue;
        
        let left = i + 1;
        let right = n - 1;
        
        while (left < right) {
            const sum = nums[i] + nums[left] + nums[right];
            
            if (sum < 0) {
                left++;
            } else if (sum > 0) {
                right--;
            } else {
                res.push([nums[i], nums[left], nums[right]]);
                left++;
                right--;
                
                while (left < right && nums[left] === nums[left - 1]) left++;
                while (left < right && nums[right] === nums[right + 1]) right--;
            }
        }
    }
    
    return res;
};`,
      cpp: `vector<vector<int>> threeSum(vector<int>& nums) {
    sort(nums.begin(), nums.end());
    vector<vector<int>> res;
    int n = nums.size();
    
    for (int i = 0; i < n - 2; i++) {
        if (i > 0 && nums[i] == nums[i - 1]) continue;
        
        int left = i + 1;
        int right = n - 1;
        
        while (left < right) {
            int sum = nums[i] + nums[left] + nums[right];
            
            if (sum < 0) {
                left++;
            } else if (sum > 0) {
                right--;
            } else {
                res.push_back({nums[i], nums[left], nums[right]});
                left++;
                right--;
                
                while (left < right && nums[left] == nums[left - 1]) left++;
                while (left < right && nums[right] == nums[right + 1]) right--;
            }
        }
    }
    
    return res;
}`,
      java: `public static List<List<Integer>> threeSum(int[] nums) {
    Arrays.sort(nums);
    List<List<Integer>> res = new ArrayList<>();
    int n = nums.length;
    
    for (int i = 0; i < n - 2; i++) {
        if (i > 0 && nums[i] == nums[i - 1]) continue;
        
        int left = i + 1;
        int right = n - 1;
        
        while (left < right) {
            int sum = nums[i] + nums[left] + nums[right];
            
            if (sum < 0) {
                left++;
            } else if (sum > 0) {
                right--;
            } else {
                res.add(Arrays.asList(nums[i], nums[left], nums[right]));
                left++;
                right--;
                
                while (left < right && nums[left] == nums[left - 1]) left++;
                while (left < right && nums[right] == nums[right + 1]) right--;
            }
        }
    }
    
    return res;
}`
    },
    solutionExplanation: `First, sort the array. Iterate through each element as the first number of the triplet (\`nums[i]\`). For the remaining part of the array, use two pointers (\`left\` and \`right\`) to find pairs that sum to \`-nums[i]\`. If the sum is too small, move \`left\` right. If too large, move \`right\` left. Crucially, skip duplicate values for \`i\`, \`left\`, and \`right\` to avoid adding identical triplets to the result.`,
    testCases: [
      { id: 'tc-1', input: '[-1,0,1,2,-1,-4]', expected: '[[-1,-1,2],[-1,0,1]]' },
      { id: 'tc-2', input: '[]', expected: '[]' },
      { id: 'tc-3', input: '[0]', expected: '[]' }
    ]
  },
  {
    id: 'dsa-tp-04',
    number: 4,
    title: 'Container With Most Water',
    slug: 'container-with-most-water',
    category: 'Two Pointers',
    difficulty: 'Medium',
    summary: 'Find two lines that together with the x-axis form a container holding the most water.',
    description: `You are given an integer array \`height\` of length \`n\`. There are \`n\` vertical lines drawn such that the two endpoints of the \`i^{th}\` line are \`(i, 0)\` and \`(i, height[i])\`.\n\nFind two lines, which together with the x-axis forms a container, such that the container contains the most water.\n\nReturn *the maximum amount of water a container can store*.`,
    examples: [
      {
        input: 'height = [1,8,6,2,5,4,8,3,7]',
        output: '49',
        explanation: 'Lines at index 1 (h=8) and index 8 (h=7) form area min(8,7)*(8-1) = 49.'
      },
      {
        input: 'height = [1,1]',
        output: '1'
      }
    ],
    constraints: [
      'n == height.length',
      '2 <= n <= 10^5',
      '0 <= height[i] <= 10^4'
    ],
    keyPoints: [
      '**Brute Force**: Check every pair $(i, j)$. Time O(N^2). TLE.',
      '**Core Insight**: Greedy Two Pointers. Start with widest container (ends). Area is limited by shorter wall. Moving the taller wall inward cannot increase width enough to compensate for potential height loss (or keeps it same/lower). Moving the shorter wall might find a taller one, increasing area. Always move the shorter pointer.',
      '**Edge Cases**: Equal heights, monotonically increasing/decreasing arrays.',
      '**Space-Time Analysis**: O(N) time, O(1) space.'
    ],
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    companies: ['Amazon', 'Microsoft', 'Google'],
    starterCode: {
      python: `def maxArea(height):
    # TODO: Implement greedy two pointers
    pass

# Test Execution
if __name__ == "__main__":
    print(maxArea([1,8,6,2,5,4,8,3,7])) # Expected: 49
    print(maxArea([1,1]))               # Expected: 1`,
      javascript: `/**
 * @param {number[]} height
 * @return {number}
 */
var maxArea = function(height) {
    // TODO: Implement greedy two pointers
};

// Test Execution
console.log(maxArea([1,8,6,2,5,4,8,3,7])); // Expected: 49
console.log(maxArea([1,1]));               // Expected: 1`,
      cpp: `#include <vector>
#include <algorithm>
#include <iostream>
using namespace std;

int maxArea(vector<int>& height) {
    // TODO: Implement greedy two pointers
    return 0;
}

int main() {
    vector<int> h1 = {1, 8, 6, 2, 5, 4, 8, 3, 7};
    cout << maxArea(h1) << endl; // Expected: 49
    
    vector<int> h2 = {1, 1};
    cout << maxArea(h2) << endl; // Expected: 1
    return 0;
}`,
      java: `public class Solution {
    public static int maxArea(int[] height) {
        // TODO: Implement greedy two pointers
        return 0;
    }

    public static void main(String[] args) {
        int[] h1 = {1, 8, 6, 2, 5, 4, 8, 3, 7};
        System.out.println(maxArea(h1)); // Expected: 49
        
        int[] h2 = {1, 1};
        System.out.println(maxArea(h2)); // Expected: 1
    }
}`
    },
    solutionCode: {
      python: `def maxArea(height):
    left, right = 0, len(height) - 1
    max_water = 0
    
    while left < right:
        h = min(height[left], height[right])
        w = right - left
        area = h * w
        max_water = max(max_water, area)
        
        if height[left] < height[right]:
            left += 1
        else:
            right -= 1
            
    return max_water`,
      javascript: `var maxArea = function(height) {
    let left = 0;
    let right = height.length - 1;
    let maxWater = 0;
    
    while (left < right) {
        const h = Math.min(height[left], height[right]);
        const w = right - left;
        const area = h * w;
        maxWater = Math.max(maxWater, area);
        
        if (height[left] < height[right]) {
            left++;
        } else {
            right--;
        }
    }
    
    return maxWater;
};`,
      cpp: `int maxArea(vector<int>& height) {
    int left = 0;
    int right = height.size() - 1;
    int maxWater = 0;
    
    while (left < right) {
        int h = min(height[left], height[right]);
        int w = right - left;
        int area = h * w;
        maxWater = max(maxWater, area);
        
        if (height[left] < height[right]) {
            left++;
        } else {
            right--;
        }
    }
    
    return maxWater;
}`,
      java: `public static int maxArea(int[] height) {
    int left = 0;
    int right = height.length - 1;
    int maxWater = 0;
    
    while (left < right) {
        int h = Math.min(height[left], height[right]);
        int w = right - left;
        int area = h * w;
        maxWater = Math.max(maxWater, area);
        
        if (height[left] < height[right]) {
            left++;
        } else {
            right--;
        }
    }
    
    return maxWater;
}`
    },
    solutionExplanation: `The area is determined by $\text{width} \times \min(\text{height}_L, \text{height}_R)$. Starting with the maximum width (ends), we calculate the area. To potentially increase the area, we must increase the minimum height. Moving the taller wall inward reduces width and keeps the limiting height the same (or lower), so it's useless. Moving the shorter wall inward reduces width but offers the chance to find a taller wall, potentially increasing the minimum height and thus the area.`,
    testCases: [
      { id: 'tc-1', input: '[1,8,6,2,5,4,8,3,7]', expected: '49' },
      { id: 'tc-2', input: '[1,1]', expected: '1' },
      { id: 'tc-3', input: '[4,3,2,1,4]', expected: '16' }
    ]
  },
  {
    id: 'dsa-tp-05',
    number: 5,
    title: 'Trapping Rain Water',
    slug: 'trapping-rain-water',
    category: 'Two Pointers',
    difficulty: 'Hard',
    summary: 'Calculate how much rainwater can be trapped between bars.',
    description: `Given \`n\` non-negative integers representing an elevation map where the width of each bar is \`1\`, compute how much water it can trap after raining.`,
    examples: [
      {
        input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]',
        output: '6',
        explanation: 'The above elevation map is represented by array [0,1,0,2,1,0,1,3,2,1,2,1]. In this case, 6 units of rain water are being trapped.'
      },
      {
        input: 'height = [4,2,0,3,2,5]',
        output: '9'
      }
    ],
    constraints: [
      'n == height.length',
      '1 <= n <= 2 * 10^4',
      '0 <= height[i] <= 10^5'
    ],
    keyPoints: [
      '**Brute Force**: For each bar, find max left and max right. Water = min(maxLeft, maxRight) - height[i]. Precompute arrays for O(N) time, O(N) space.',
      '**Core Insight**: Two Pointers Optimization. Maintain \`maxLeft\` and \`maxRight\`. Move the pointer with the smaller current boundary max. Why? Because the water level is constrained by the smaller side. If \`maxLeft < maxRight\`, the left side determines the level for the current left pointer.',
      '**Edge Cases**: Flat terrain, strictly increasing/decreasing (no trapping), single bar.',
      '**Space-Time Analysis**: O(N) time, O(1) space.'
    ],
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    companies: ['Amazon', 'Google', 'Microsoft', 'Salesforce'],
    starterCode: {
      python: `def trap(height):
    # TODO: Implement two pointer approach
    pass

# Test Execution
if __name__ == "__main__":
    print(trap([0,1,0,2,1,0,1,3,2,1,2,1])) # Expected: 6
    print(trap([4,2,0,3,2,5]))             # Expected: 9`,
      javascript: `/**
 * @param {number[]} height
 * @return {number}
 */
var trap = function(height) {
    // TODO: Implement two pointer approach
};

// Test Execution
console.log(trap([0,1,0,2,1,0,1,3,2,1,2,1])); // Expected: 6
console.log(trap([4,2,0,3,2,5]));             // Expected: 9`,
      cpp: `#include <vector>
#include <algorithm>
#include <iostream>
using namespace std;

int trap(vector<int>& height) {
    // TODO: Implement two pointer approach
    return 0;
}

int main() {
    vector<int> h1 = {0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1};
    cout << trap(h1) << endl; // Expected: 6
    
    vector<int> h2 = {4, 2, 0, 3, 2, 5};
    cout << trap(h2) << endl; // Expected: 9
    return 0;
}`,
      java: `public class Solution {
    public static int trap(int[] height) {
        // TODO: Implement two pointer approach
        return 0;
    }

    public static void main(String[] args) {
        int[] h1 = {0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1};
        System.out.println(trap(h1)); // Expected: 6
        
        int[] h2 = {4, 2, 0, 3, 2, 5};
        System.out.println(trap(h2)); // Expected: 9
    }
}`
    },
    solutionCode: {
      python: `def trap(height):
    if not height:
        return 0
        
    left, right = 0, len(height) - 1
    max_left, max_right = height[left], height[right]
    res = 0
    
    while left < right:
        if max_left < max_right:
            left += 1
            max_left = max(max_left, height[left])
            res += max_left - height[left]
        else:
            right -= 1
            max_right = max(max_right, height[right])
            res += max_right - height[right]
            
    return res`,
      javascript: `var trap = function(height) {
    if (!height.length) return 0;
    
    let left = 0;
    let right = height.length - 1;
    let maxLeft = height[left];
    let maxRight = height[right];
    let res = 0;
    
    while (left < right) {
        if (maxLeft < maxRight) {
            left++;
            maxLeft = Math.max(maxLeft, height[left]);
            res += maxLeft - height[left];
        } else {
            right--;
            maxRight = Math.max(maxRight, height[right]);
            res += maxRight - height[right];
        }
    }
    
    return res;
};`,
      cpp: `int trap(vector<int>& height) {
    if (height.empty()) return 0;
    
    int left = 0;
    int right = height.size() - 1;
    int maxLeft = height[left];
    int maxRight = height[right];
    int res = 0;
    
    while (left < right) {
        if (maxLeft < maxRight) {
            left++;
            maxLeft = max(maxLeft, height[left]);
            res += maxLeft - height[left];
        } else {
            right--;
            maxRight = max(maxRight, height[right]);
            res += maxRight - height[right];
        }
    }
    
    return res;
}`,
      java: `public static int trap(int[] height) {
    if (height.length == 0) return 0;
    
    int left = 0;
    int right = height.length - 1;
    int maxLeft = height[left];
    int maxRight = height[right];
    int res = 0;
    
    while (left < right) {
        if (maxLeft < maxRight) {
            left++;
            maxLeft = Math.max(maxLeft, height[left]);
            res += maxLeft - height[left];
        } else {
            right--;
            maxRight = Math.max(maxRight, height[right]);
            res += maxRight - height[right];
        }
    }
    
    return res;
}`
    },
    solutionExplanation: `Water trapped at any index depends on the minimum of the highest bar to its left and right. Using two pointers, we track \`maxLeft\` and \`maxRight\`. If \`maxLeft < maxRight\`, the water level at the current \`left\` pointer is determined solely by \`maxLeft\` (since there's a higher barrier on the right guaranteeing containment). We add \`maxLeft - height[left]\` to the result and move \`left\` inward. Similarly for the right side. This avoids precomputing arrays, achieving O(1) space.`,
    testCases: [
      { id: 'tc-1', input: '[0,1,0,2,1,0,1,3,2,1,2,1]', expected: '6' },
      { id: 'tc-2', input: '[4,2,0,3,2,5]', expected: '9' },
      { id: 'tc-3', input: '[1,0,1,2,0,1]', expected: '3' }
    ]
  }
];
