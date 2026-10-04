import { DsaProblem } from './types';

export const BINARY_SEARCH_PROBLEMS: DsaProblem[] = [
  {
    id: 'dsa-bs-01',
    number: 1,
    title: 'Binary Search',
    slug: 'binary-search',
    category: 'Binary Search',
    difficulty: 'Easy',
    summary: 'Search for a target value in a sorted array.',
    description: `Given an array of integers \`nums\` which is sorted in ascending order, and an integer \`target\`, write a function to search \`target\` in \`nums\`. If \`target\` exists, then return its index. Otherwise, return -1.\n\nYou must write an algorithm with O(log n) runtime complexity.`,
    examples: [
      {
        input: 'nums = [-1,0,3,5,9,12], target = 9',
        output: '4',
        explanation: '9 exists in nums and its index is 4.'
      },
      {
        input: 'nums = [-1,0,3,5,9,12], target = 2',
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
      '**Brute Force**: Linear scan through the array. Time O(N), Space O(1). Not optimal for large inputs.',
      '**Core Insight**: Divide and Conquer. Compare target with middle element. If equal, found. If smaller, search left half. If larger, search right half. Halves search space each step.',
      '**Edge Cases**: Empty array (handled by loop condition), single element array, target smaller than all elements, target larger than all elements.',
      '**Space-Time Analysis**: Optimal solution is O(log N) time and O(1) space (iterative implementation).'
    ],
    timeComplexity: 'O(log N)',
    spaceComplexity: 'O(1)',
    companies: ['Amazon', 'Microsoft', 'Google', 'Facebook'],
    starterCode: {
      python: `def search(nums, target):
    # TODO: Implement binary search here
    pass

# Test Execution
if __name__ == "__main__":
    nums = [-1, 0, 3, 5, 9, 12]
    target = 9
    print(search(nums, target)) # Expected: 4
    
    target = 2
    print(search(nums, target)) # Expected: -1`,
      javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var search = function(nums, target) {
    // TODO: Implement binary search here
};

// Test Execution
const nums = [-1, 0, 3, 5, 9, 12];
console.log(search(nums, 9)); // Expected: 4
console.log(search(nums, 2)); // Expected: -1`,
      cpp: `#include <vector>
#include <iostream>
using namespace std;

int search(vector<int>& nums, int target) {
    // TODO: Implement binary search here
    return -1;
}

int main() {
    vector<int> nums = {-1, 0, 3, 5, 9, 12};
    cout << search(nums, 9) << endl; // Expected: 4
    cout << search(nums, 2) << endl; // Expected: -1
    return 0;
}`,
      java: `import java.util.*;

public class Solution {
    public static int search(int[] nums, int target) {
        // TODO: Implement binary search here
        return -1;
    }

    public static void main(String[] args) {
        int[] nums = {-1, 0, 3, 5, 9, 12};
        System.out.println(search(nums, 9)); // Expected: 4
        System.out.println(search(nums, 2)); // Expected: -1
    }
}`
    },
    solutionCode: {
      python: `def search(nums, target):
    left, right = 0, len(nums) - 1
    
    while left <= right:
        mid = left + (right - left) // 2
        
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
            
    return -1`,
      javascript: `var search = function(nums, target) {
    let left = 0;
    let right = nums.length - 1;
    
    while (left <= right) {
        const mid = Math.floor(left + (right - left) / 2);
        
        if (nums[mid] === target) {
            return mid;
        } else if (nums[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    return -1;
};`,
      cpp: `int search(vector<int>& nums, int target) {
    int left = 0;
    int right = nums.size() - 1;
    
    while (left <= right) {
        int mid = left + (right - left) / 2;
        
        if (nums[mid] == target) {
            return mid;
        } else if (nums[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    return -1;
}`,
      java: `public static int search(int[] nums, int target) {
    int left = 0;
    int right = nums.length - 1;
    
    while (left <= right) {
        int mid = left + (right - left) / 2;
        
        if (nums[mid] == target) {
            return mid;
        } else if (nums[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    return -1;
}`
    },
    solutionExplanation: `We initialize two pointers, \`left\` at the start and \`right\` at the end of the array. While \`left <= right\`, we calculate the middle index \`mid\`. To avoid integer overflow, we use \`left + (right - left) / 2\`. We compare \`nums[mid]\` with \`target\`. If they match, we return \`mid\`. If \`nums[mid]\` is less than \`target\`, the target must be in the right half, so we move \`left\` to \`mid + 1\`. Otherwise, it's in the left half, so we move \`right\` to \`mid - 1\`. If the loop finishes without finding the target, we return -1.`,
    testCases: [
      { id: 'tc-1', input: 'nums=[-1,0,3,5,9,12], target=9', expected: '4' },
      { id: 'tc-2', input: 'nums=[-1,0,3,5,9,12], target=2', expected: '-1' },
      { id: 'tc-3', input: 'nums=[5], target=5', expected: '0' }
    ]
  },
  {
    id: 'dsa-bs-02',
    number: 2,
    title: 'Search a 2D Matrix',
    slug: 'search-a-2d-matrix',
    category: 'Binary Search',
    difficulty: 'Medium',
    summary: 'Search for a target value in a m x n matrix where rows and columns are sorted.',
    description: `Write an efficient algorithm that searches for a value \`target\` in an \`m x n\` matrix. This matrix has the following properties:\n\n* Integers in each row are sorted from left to right.\n* The first integer of each row is greater than the last integer of the previous row.`,
    examples: [
      {
        input: 'matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 3',
        output: 'true',
        explanation: 'Target 3 is present in the matrix.'
      },
      {
        input: 'matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 13',
        output: 'false',
        explanation: 'Target 13 is not present in the matrix.'
      }
    ],
    constraints: [
      'm == matrix.length',
      'n == matrix[i].length',
      '1 <= m, n <= 100',
      '-10^4 <= matrix[i][j], target <= 10^4'
    ],
    keyPoints: [
      '**Brute Force**: Iterate through every element. Time O(M*N), Space O(1). Too slow for large matrices.',
      '**Core Insight**: Treat the 2D matrix as a flattened 1D sorted array. Map linear index \`i\` to coordinates \`(row, col)\` using division and modulo operations. Apply standard Binary Search on this virtual 1D array.',
      '**Edge Cases**: Empty matrix, single row/column, target outside range of min/max values.',
      '**Space-Time Analysis**: O(log(M*N)) time and O(1) space.'
    ],
    timeComplexity: 'O(log(M*N))',
    spaceComplexity: 'O(1)',
    companies: ['Amazon', 'Microsoft', 'Apple'],
    starterCode: {
      python: `def searchMatrix(matrix, target):
    # TODO: Implement search logic here
    pass

# Test Execution
if __name__ == "__main__":
    matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]]
    print(searchMatrix(matrix, 3)) # Expected: True
    print(searchMatrix(matrix, 13)) # Expected: False`,
      javascript: `/**
 * @param {number[][]} matrix
 * @param {number} target
 * @return {boolean}
 */
var searchMatrix = function(matrix, target) {
    // TODO: Implement search logic here
};

// Test Execution
const matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]];
console.log(searchMatrix(matrix, 3)); // Expected: true
console.log(searchMatrix(matrix, 13)); // Expected: false`,
      cpp: `#include <vector>
#include <iostream>
using namespace std;

bool searchMatrix(vector<vector<int>>& matrix, int target) {
    // TODO: Implement search logic here
    return false;
}

int main() {
    vector<vector<int>> matrix = {{1,3,5,7},{10,11,16,20},{23,30,34,60}};
    cout << (searchMatrix(matrix, 3) ? "true" : "false") << endl; // Expected: true
    cout << (searchMatrix(matrix, 13) ? "true" : "false") << endl; // Expected: false
    return 0;
}`,
      java: `import java.util.*;

public class Solution {
    public static boolean searchMatrix(int[][] matrix, int target) {
        // TODO: Implement search logic here
        return false;
    }

    public static void main(String[] args) {
        int[][] matrix = {{1,3,5,7},{10,11,16,20},{23,30,34,60}};
        System.out.println(searchMatrix(matrix, 3)); // Expected: true
        System.out.println(searchMatrix(matrix, 13)); // Expected: false
    }
}`
    },
    solutionCode: {
      python: `def searchMatrix(matrix, target):
    if not matrix or not matrix[0]:
        return False
        
    m, n = len(matrix), len(matrix[0])
    left, right = 0, m * n - 1
    
    while left <= right:
        mid = left + (right - left) // 2
        row = mid // n
        col = mid % n
        val = matrix[row][col]
        
        if val == target:
            return True
        elif val < target:
            left = mid + 1
        else:
            right = mid - 1
            
    return False`,
      javascript: `var searchMatrix = function(matrix, target) {
    if (!matrix || !matrix[0]) return false;
    
    const m = matrix.length;
    const n = matrix[0].length;
    let left = 0;
    let right = m * n - 1;
    
    while (left <= right) {
        const mid = Math.floor(left + (right - left) / 2);
        const row = Math.floor(mid / n);
        const col = mid % n;
        const val = matrix[row][col];
        
        if (val === target) {
            return true;
        } else if (val < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    return false;
};`,
      cpp: `bool searchMatrix(vector<vector<int>>& matrix, int target) {
    if (matrix.empty() || matrix[0].empty()) return false;
    
    int m = matrix.size();
    int n = matrix[0].size();
    int left = 0;
    int right = m * n - 1;
    
    while (left <= right) {
        int mid = left + (right - left) / 2;
        int row = mid / n;
        int col = mid % n;
        int val = matrix[row][col];
        
        if (val == target) {
            return true;
        } else if (val < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    return false;
}`,
      java: `public static boolean searchMatrix(int[][] matrix, int target) {
    if (matrix == null || matrix.length == 0 || matrix[0].length == 0) return false;
    
    int m = matrix.length;
    int n = matrix[0].length;
    int left = 0;
    int right = m * n - 1;
    
    while (left <= right) {
        int mid = left + (right - left) / 2;
        int row = mid / n;
        int col = mid % n;
        int val = matrix[row][col];
        
        if (val == target) {
            return true;
        } else if (val < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    return false;
}`
    },
    solutionExplanation: `Since the matrix is strictly sorted (each row starts after the previous ends), we can treat it as a single sorted 1D array of size M*N. We define \`left = 0\` and \`right = M*N - 1\`. In each iteration, we calculate \`mid\`. To access the corresponding element in the 2D matrix, we convert the linear index \`mid\` to 2D coordinates: \`row = mid / N\` and \`col = mid % N\`. Then we apply standard binary search logic comparing \`matrix[row][col]\` with \`target\`.`,
    testCases: [
      { id: 'tc-1', input: 'matrix=[[1,3,5,7],[10,11,16,20],[23,30,34,60]], target=3', expected: 'true' },
      { id: 'tc-2', input: 'matrix=[[1,3,5,7],[10,11,16,20],[23,30,34,60]], target=13', expected: 'false' },
      { id: 'tc-3', input: 'matrix=[[1]], target=1', expected: 'true' }
    ]
  },
  {
    id: 'dsa-bs-03',
    number: 3,
    title: 'Koko Eating Bananas',
    slug: 'koko-eating-bananas',
    category: 'Binary Search',
    difficulty: 'Medium',
    summary: 'Find minimum eating speed to finish bananas within H hours.',
    description: `Koko loves to eat bananas. There are \`n\` piles of bananas, the \`i^{th}\` pile has \`piles[i]\` bananas. The guards have gone and will come back in \`h\` hours.\n\nKoko can decide her bananas-per-hour eating speed of \`k\`. Each hour, she chooses some pile of bananas and eats \`k\` bananas from that pile. If the pile has less than \`k\` bananas, she eats all of them instead and will not eat any more bananas during this hour.\n\nKoko likes to eat slowly but still wants to finish eating all the bananas before the guards return.\n\nReturn *the minimum integer*\`\`k\`\` *such that she can eat all the bananas within*\`\` h\`\` *hours*.`,
    examples: [
      {
        input: 'piles = [3,6,7,11], h = 8',
        output: '4',
        explanation: 'Eating 4 bananas/hour takes exactly 8 hours.'
      },
      {
        input: 'piles = [30,11,23,4,20], h = 5',
        output: '30',
        explanation: 'Must eat fastest possible to meet tight deadline.'
      }
    ],
    constraints: [
      '1 <= piles.length <= 10^4',
      'piles.length <= h <= 10^9',
      '1 <= piles[i] <= 10^9'
    ],
    keyPoints: [
      '**Brute Force**: Try every speed from 1 to max(piles). Calculate total hours for each. Time O(maxPile * N). Too slow.',
      '**Core Insight**: Monotonic Property. As eating speed \`k\` increases, total hours needed decreases. We can binary search on the answer (speed).\nLow bound: 1, High bound: max(piles). Check feasibility for mid-speed.',
      '**Edge Cases**: Very large h (min speed is 1), very small h (max speed is max pile), huge pile sizes causing overflow in sum calculation (use long/BigInt concepts mentally, though Python handles big ints).',
      '**Space-Time Analysis**: O(N log(maxPile)) time, O(1) space.'
    ],
    timeComplexity: 'O(N log M)',
    spaceComplexity: 'O(1)',
    companies: ['Amazon', 'Meta', 'Google'],
    starterCode: {
      python: `def minEatingSpeed(piles, h):
    # TODO: Implement binary search on speed
    pass

# Test Execution
if __name__ == "__main__":
    print(minEatingSpeed([3,6,7,11], 8)) # Expected: 4
    print(minEatingSpeed([30,11,23,4,20], 5)) # Expected: 30`,
      javascript: `/**
 * @param {number[]} piles
 * @param {number} h
 * @return {number}
 */
var minEatingSpeed = function(piles, h) {
    // TODO: Implement binary search on speed
};

// Test Execution
console.log(minEatingSpeed([3,6,7,11], 8)); // Expected: 4
console.log(minEatingSpeed([30,11,23,4,20], 5)); // Expected: 30`,
      cpp: `#include <vector>
#include <algorithm>
#include <iostream>
#include <cmath>
using namespace std;

long long minEatingSpeed(vector<int>& piles, int h) {
    // TODO: Implement binary search on speed
    return 0;
}

int main() {
    vector<int> p1 = {3, 6, 7, 11};
    cout << minEatingSpeed(p1, 8) << endl; // Expected: 4
    
    vector<int> p2 = {30, 11, 23, 4, 20};
    cout << minEatingSpeed(p2, 5) << endl; // Expected: 30
    return 0;
}`,
      java: `import java.util.*;

public class Solution {
    public static int minEatingSpeed(int[] piles, int h) {
        // TODO: Implement binary search on speed
        return 0;
    }

    public static void main(String[] args) {
        int[] p1 = {3, 6, 7, 11};
        System.out.println(minEatingSpeed(p1, 8)); // Expected: 4
        
        int[] p2 = {30, 11, 23, 4, 20};
        System.out.println(minEatingSpeed(p2, 5)); // Expected: 30
    }
}`
    },
    solutionCode: {
      python: `def minEatingSpeed(piles, h):
    left, right = 1, max(piles)
    result = right
    
    while left <= right:
        k = left + (right - left) // 2
        
        hours_needed = 0
        for p in piles:
            hours_needed += (p + k - 1) // k  # Ceiling division
            
        if hours_needed <= h:
            result = k
            right = k - 1  # Try slower speed
        else:
            left = k + 1   # Need faster speed
            
    return result`,
      javascript: `var minEatingSpeed = function(piles, h) {
    let left = 1;
    let right = Math.max(...piles);
    let result = right;
    
    while (left <= right) {
        const k = Math.floor(left + (right - left) / 2);
        
        let hoursNeeded = 0;
        for (let p of piles) {
            hoursNeeded += Math.ceil(p / k);
        }
        
        if (hoursNeeded <= h) {
            result = k;
            right = k - 1; // Try slower
        } else {
            left = k + 1; // Need faster
        }
    }
    
    return result;
};`,
      cpp: `long long minEatingSpeed(vector<int>& piles, int h) {
    long long left = 1;
    long long right = *max_element(piles.begin(), piles.end());
    long long result = right;
    
    while (left <= right) {
        long long k = left + (right - left) / 2;
        
        long long hoursNeeded = 0;
        for (int p : piles) {
            hoursNeeded += (p + k - 1) / k; // Integer ceiling division
        }
        
        if (hoursNeeded <= h) {
            result = k;
            right = k - 1; // Try slower
        } else {
            left = k + 1; // Need faster
        }
    }
    
    return result;
}`,
      java: `public static int minEatingSpeed(int[] piles, int h) {
    int left = 1;
    int right = 0;
    for (int p : piles) right = Math.max(right, p);
    int result = right;
    
    while (left <= right) {
        int k = left + (right - left) / 2;
        
        long hoursNeeded = 0;
        for (int p : piles) {
            hoursNeeded += (p + k - 1L) / k; // Use long to prevent overflow
        }
        
        if (hoursNeeded <= h) {
            result = k;
            right = k - 1; // Try slower
        } else {
            left = k + 1; // Need faster
        }
    }
    
    return result;
}`
    },
    solutionExplanation: `We perform binary search on the possible eating speeds \`k\`, ranging from 1 to \`max(piles)\`. For a candidate speed \`mid\`, we calculate the total hours required to eat all piles. The formula for hours per pile is \`ceil(piles[i] / mid)\`. If the total hours is less than or equal to \`h\`, it means \`mid\` is a feasible speed, potentially too fast, so we try to find a smaller speed (\`right = mid - 1\`). If it exceeds \`h\`, we need a faster speed (\`left = mid + 1\`). The smallest valid speed found is returned.`,
    testCases: [
      { id: 'tc-1', input: 'piles=[3,6,7,11], h=8', expected: '4' },
      { id: 'tc-2', input: 'piles=[30,11,23,4,20], h=5', expected: '30' },
      { id: 'tc-3', input: 'piles=[30,11,23,4,20], h=6', expected: '23' }
    ]
  },
  {
    id: 'dsa-bs-04',
    number: 4,
    title: 'Find Minimum in Rotated Sorted Array',
    slug: 'find-minimum-in-rotated-sorted-array',
    category: 'Binary Search',
    difficulty: 'Medium',
    summary: 'Find the minimum element in a rotated sorted array.',
    description: `Suppose an array of length \`n\` sorted in ascending order is **rotated** between \`1\` and \`n\` times. For example, the array \`nums = [0,1,2,4,5,6,7]\` might become:\n\n* \`[4,5,6,7,0,1,2]\` if it was rotated \`4\` times.\n* \`[0,1,2,4,5,6,7]\` if it was rotated \`7\` times.\n\nNotice that **rotating** an array \`[a[0], a[1], a[2], ..., a[n-1]]\` 1 time results in the array \`[a[n-1], a[0], a[1], a[2], ..., a[n-2]]\`.\n\nGiven the sorted rotated array \`nums\` of **unique** elements, return *the minimum element of this array*.\n\nYou must write an algorithm that runs in O(log n) time.`,
    examples: [
      {
        input: 'nums = [3,4,5,1,2]',
        output: '1',
        explanation: 'The original array was [1,2,3,4,5] rotated 3 times.'
      },
      {
        input: 'nums = [4,5,6,7,0,1,2]',
        output: '0',
        explanation: 'The original array was [0,1,2,4,5,6,7] rotated 4 times.'
      }
    ],
    constraints: [
      'n == nums.length',
      '1 <= n <= 5000',
      '-5000 <= nums[i] <= 5000',
      'All the integers of nums are unique.',
      'nums is sorted and rotated between 1 and n times.'
    ],
    keyPoints: [
      '**Brute Force**: Scan entire array to find min. Time O(N). Violates constraint.',
      '**Core Insight**: Binary Search. Identify which half is sorted. The minimum is always in the unsorted half (or the pivot point). Compare \`nums[mid]\` with \`nums[right]\`.\nIf \`nums[mid] > nums[right]\`, min is in right half.\nElse, min is in left half (including mid).',
      '**Edge Cases**: Already sorted array (rotation 0 or N), single element, two elements.',
      '**Space-Time Analysis**: O(log N) time, O(1) space.'
    ],
    timeComplexity: 'O(log N)',
    spaceComplexity: 'O(1)',
    companies: ['Amazon', 'Microsoft', 'Adobe'],
    starterCode: {
      python: `def findMin(nums):
    # TODO: Implement binary search for rotation point
    pass

# Test Execution
if __name__ == "__main__":
    print(findMin([3,4,5,1,2])) # Expected: 1
    print(findMin([4,5,6,7,0,1,2])) # Expected: 0
    print(findMin([11,13,15,17])) # Expected: 11`,
      javascript: `/**
 * @param {number[]} nums
 * @return {number}
 */
var findMin = function(nums) {
    // TODO: Implement binary search for rotation point
};

// Test Execution
console.log(findMin([3,4,5,1,2])); // Expected: 1
console.log(findMin([4,5,6,7,0,1,2])); // Expected: 0
console.log(findMin([11,13,15,17])); // Expected: 11`,
      cpp: `#include <vector>
#include <iostream>
using namespace std;

int findMin(vector<int>& nums) {
    // TODO: Implement binary search for rotation point
    return 0;
}

int main() {
    vector<int> n1 = {3, 4, 5, 1, 2};
    cout << findMin(n1) << endl; // Expected: 1
    
    vector<int> n2 = {4, 5, 6, 7, 0, 1, 2};
    cout << findMin(n2) << endl; // Expected: 0
    
    vector<int> n3 = {11, 13, 15, 17};
    cout << findMin(n3) << endl; // Expected: 11
    return 0;
}`,
      java: `import java.util.*;

public class Solution {
    public static int findMin(int[] nums) {
        // TODO: Implement binary search for rotation point
        return 0;
    }

    public static void main(String[] args) {
        int[] n1 = {3, 4, 5, 1, 2};
        System.out.println(findMin(n1)); // Expected: 1
        
        int[] n2 = {4, 5, 6, 7, 0, 1, 2};
        System.out.println(findMin(n2)); // Expected: 0
        
        int[] n3 = {11, 13, 15, 17};
        System.out.println(findMin(n3)); // Expected: 11
    }
}`
    },
    solutionCode: {
      python: `def findMin(nums):
    left, right = 0, len(nums) - 1
    
    while left < right:
        mid = left + (right - left) // 2
        
        if nums[mid] > nums[right]:
            # Min is in the right part
            left = mid + 1
        else:
            # Min is in the left part (could be mid itself)
            right = mid
            
    return nums[left]`,
      javascript: `var findMin = function(nums) {
    let left = 0;
    let right = nums.length - 1;
    
    while (left < right) {
        const mid = Math.floor(left + (right - left) / 2);
        
        if (nums[mid] > nums[right]) {
            // Min is in the right part
            left = mid + 1;
        } else {
            // Min is in the left part (could be mid itself)
            right = mid;
        }
    }
    
    return nums[left];
};`,
      cpp: `int findMin(vector<int>& nums) {
    int left = 0;
    int right = nums.size() - 1;
    
    while (left < right) {
        int mid = left + (right - left) / 2;
        
        if (nums[mid] > nums[right]) {
            // Min is in the right part
            left = mid + 1;
        } else {
            // Min is in the left part (could be mid itself)
            right = mid;
        }
    }
    
    return nums[left];
}`,
      java: `public static int findMin(int[] nums) {
    int left = 0;
    int right = nums.length - 1;
    
    while (left < right) {
        int mid = left + (right - left) / 2;
        
        if (nums[mid] > nums[right]) {
            // Min is in the right part
            left = mid + 1;
        } else {
            // Min is in the left part (could be mid itself)
            right = mid;
        }
    }
    
    return nums[left];
}`
    },
    solutionExplanation: `In a rotated sorted array, there is one pivot point where the order breaks. All elements to the right of the pivot are smaller than those to the left. We use binary search with \`left\` and \`right\` pointers. We compare \`nums[mid]\` with \`nums[right]\`. If \`nums[mid] > nums[right]\`, the pivot must be to the right of \`mid\`, so we set \`left = mid + 1\`. Otherwise, the pivot is at \`mid\` or to the left, so we set \`right = mid\`. We continue until \`left == right\`, pointing to the minimum element.`,
    testCases: [
      { id: 'tc-1', input: '[3,4,5,1,2]', expected: '1' },
      { id: 'tc-2', input: '[4,5,6,7,0,1,2]', expected: '0' },
      { id: 'tc-3', input: '[11,13,15,17]', expected: '11' }
    ]
  },
  {
    id: 'dsa-bs-05',
    number: 5,
    title: 'Search in Rotated Sorted Array',
    slug: 'search-in-rotated-sorted-array',
    category: 'Binary Search',
    difficulty: 'Medium',
    summary: 'Search for a target in a rotated sorted array.',
    description: `There is an integer array \`nums\` sorted in ascending order (with **distinct** values).\n\nYou are given an integer \`target\`. Given the array \`nums\`, if \`target\` is in \`nums\`, return *its index*, otherwise, return \`-1\`.\n\nYou must write an algorithm with O(log n) runtime complexity.`,
    examples: [
      {
        input: 'nums = [4,5,6,7,0,1,2], target = 0',
        output: '4',
        explanation: 'Target 0 is at index 4.'
      },
      {
        input: 'nums = [4,5,6,7,0,1,2], target = 3',
        output: '-1',
        explanation: 'Target 3 is not present.'
      }
    ],
    constraints: [
      '1 <= nums.length <= 5000',
      '-10^4 <= nums[i] <= 10^4',
      'All values of nums are unique.',
      'nums is an ascending array that is possibly rotated.',
      '-10^4 <= target <= 10^4'
    ],
    keyPoints: [
      '**Brute Force**: Linear scan. Time O(N). Fails requirement.',
      '**Core Insight**: Modified Binary Search. At any \`mid\`, one side is guaranteed to be sorted. Determine which side is sorted. If \`target\` lies within the range of the sorted side, discard the other side. Else, discard the sorted side.',
      '**Edge Cases**: Target equals \`nums[mid]\`, target outside current bounds, array not rotated.',
      '**Space-Time Analysis**: O(log N) time, O(1) space.'
    ],
    timeComplexity: 'O(log N)',
    spaceComplexity: 'O(1)',
    companies: ['Amazon', 'Microsoft', 'Goldman Sachs'],
    starterCode: {
      python: `def search(nums, target):
    # TODO: Implement modified binary search
    pass

# Test Execution
if __name__ == "__main__":
    print(search([4,5,6,7,0,1,2], 0)) # Expected: 4
    print(search([4,5,6,7,0,1,2], 3)) # Expected: -1`,
      javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var search = function(nums, target) {
    // TODO: Implement modified binary search
};

// Test Execution
console.log(search([4,5,6,7,0,1,2], 0)); // Expected: 4
console.log(search([4,5,6,7,0,1,2], 3)); // Expected: -1`,
      cpp: `#include <vector>
#include <iostream>
using namespace std;

int search(vector<int>& nums, int target) {
    // TODO: Implement modified binary search
    return -1;
}

int main() {
    vector<int> nums = {4, 5, 6, 7, 0, 1, 2};
    cout << search(nums, 0) << endl; // Expected: 4
    cout << search(nums, 3) << endl; // Expected: -1
    return 0;
}`,
      java: `import java.util.*;

public class Solution {
    public static int search(int[] nums, int target) {
        // TODO: Implement modified binary search
        return -1;
    }

    public static void main(String[] args) {
        int[] nums = {4, 5, 6, 7, 0, 1, 2};
        System.out.println(search(nums, 0)); // Expected: 4
        System.out.println(search(nums, 3)); // Expected: -1
    }
}`
    },
    solutionCode: {
      python: `def search(nums, target):
    left, right = 0, len(nums) - 1
    
    while left <= right:
        mid = left + (right - left) // 2
        
        if nums[mid] == target:
            return mid
            
        # Check if left half is sorted
        if nums[left] <= nums[mid]:
            if nums[left] <= target < nums[mid]:
                right = mid - 1
            else:
                left = mid + 1
        # Right half is sorted
        else:
            if nums[mid] < target <= nums[right]:
                left = mid + 1
            else:
                right = mid - 1
                
    return -1`,
      javascript: `var search = function(nums, target) {
    let left = 0;
    let right = nums.length - 1;
    
    while (left <= right) {
        const mid = Math.floor(left + (right - left) / 2);
        
        if (nums[mid] === target) return mid;
        
        // Check if left half is sorted
        if (nums[left] <= nums[mid]) {
            if (nums[left] <= target && target < nums[mid]) {
                right = mid - 1;
            } else {
                left = mid + 1;
            }
        } 
        // Right half is sorted
        else {
            if (nums[mid] < target && target <= nums[right]) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
    }
    
    return -1;
};`,
      cpp: `int search(vector<int>& nums, int target) {
    int left = 0;
    int right = nums.size() - 1;
    
    while (left <= right) {
        int mid = left + (right - left) / 2;
        
        if (nums[mid] == target) return mid;
        
        // Check if left half is sorted
        if (nums[left] <= nums[mid]) {
            if (nums[left] <= target && target < nums[mid]) {
                right = mid - 1;
            } else {
                left = mid + 1;
            }
        } 
        // Right half is sorted
        else {
            if (nums[mid] < target && target <= nums[right]) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
    }
    
    return -1;
}`,
      java: `public static int search(int[] nums, int target) {
    int left = 0;
    int right = nums.length - 1;
    
    while (left <= right) {
        int mid = left + (right - left) / 2;
        
        if (nums[mid] == target) return mid;
        
        // Check if left half is sorted
        if (nums[left] <= nums[mid]) {
            if (nums[left] <= target && target < nums[mid]) {
                right = mid - 1;
            } else {
                left = mid + 1;
            }
        } 
        // Right half is sorted
        else {
            if (nums[mid] < target && target <= nums[right]) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
    }
    
    return -1;
}`
    },
    solutionExplanation: `Standard binary search fails because the array isn't fully sorted. However, splitting the array at \`mid\` guarantees that at least one half is sorted. We check if the left half is sorted (\`nums[left] <= nums[mid]\`). If so, we verify if \`target\` falls within the range \`[nums[left], nums[mid])\`. If yes, we search left; otherwise, right. If the left half isn't sorted, the right half must be. We check if \`target\` falls within \`(nums[mid], nums[right]]\`. If yes, search right; otherwise, left.`,
    testCases: [
      { id: 'tc-1', input: 'nums=[4,5,6,7,0,1,2], target=0', expected: '4' },
      { id: 'tc-2', input: 'nums=[4,5,6,7,0,1,2], target=3', expected: '-1' },
      { id: 'tc-3', input: 'nums=[1], target=0', expected: '-1' }
    ]
  },
  {
    id: 'dsa-bs-06',
    number: 6,
    title: 'Median of Two Sorted Arrays',
    slug: 'median-of-two-sorted-arrays',
    category: 'Binary Search',
    difficulty: 'Hard',
    summary: 'Find median of two sorted arrays in O(log(m+n)).',
    description: `Given two sorted arrays \`nums1\` and \`nums2\` of size \`m\` and \`n\` respectively, return ***the median*** of the two sorted arrays.\n\nThe overall run time complexity should be \`O(log (m+n))\`.`,
    examples: [
      {
        input: 'nums1 = [1,3], nums2 = [2]',
        output: '2.00000',
        explanation: 'merged array = [1,2,3] and median is 2.'
      },
      {
        input: 'nums1 = [1,2], nums2 = [3,4]',
        output: '2.50000',
        explanation: 'merged array = [1,2,3,4] and median is (2 + 3) / 2 = 2.5.'
      }
    ],
    constraints: [
      'nums1.length == m',
      'nums2.length == n',
      '0 <= m <= 1000',
      '0 <= n <= 1000',
      '1 <= m + n <= 2000',
      '-10^6 <= nums1[i], nums2[i] <= 10^6'
    ],
    keyPoints: [
      '**Brute Force**: Merge arrays then find median. Time O(M+N), Space O(M+N). Fails strict time limit for Log complexity requirement.',
      '**Core Insight**: Binary Search on Partition. Find a partition such that elements on left are <= elements on right across both arrays. We only need to binary search on the shorter array to keep complexity low.',
      '**Edge Cases**: One array empty, partitions at boundaries (index 0 or length), odd/even total length.',
      '**Space-Time Analysis**: O(log(min(M,N))) time, O(1) space.'
    ],
    timeComplexity: 'O(log(min(M,N)))',
    spaceComplexity: 'O(1)',
    companies: ['Amazon', 'Microsoft', 'Google', 'Uber'],
    starterCode: {
      python: `def findMedianSortedArrays(nums1, nums2):
    # TODO: Implement binary search partition
    pass

# Test Execution
if __name__ == "__main__":
    print(f"{findMedianSortedArrays([1,3], [2]):.5f}") # Expected: 2.00000
    print(f"{findMedianSortedArrays([1,2], [3,4]):.5f}") # Expected: 2.50000`,
      javascript: `/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number}
 */
var findMedianSortedArrays = function(nums1, nums2) {
    // TODO: Implement binary search partition
};

// Test Execution
console.log(findMedianSortedArrays([1,3], [2]).toFixed(5)); // Expected: 2.00000
console.log(findMedianSortedArrays([1,2], [3,4]).toFixed(5)); // Expected: 2.50000`,
      cpp: `#include <vector>
#include <iostream>
#include <iomanip>
#include <algorithm>
using namespace std;

double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {
    // TODO: Implement binary search partition
    return 0.0;
}

int main() {
    vector<int> n1 = {1, 3};
    vector<int> n2 = {2};
    cout << fixed << setprecision(5) << findMedianSortedArrays(n1, n2) << endl; // Expected: 2.00000
    
    vector<int> n3 = {1, 2};
    vector<int> n4 = {3, 4};
    cout << fixed << setprecision(5) << findMedianSortedArrays(n3, n4) << endl; // Expected: 2.50000
    return 0;
}`,
      java: `import java.util.*;

public class Solution {
    public static double findMedianSortedArrays(int[] nums1, int[] nums2) {
        // TODO: Implement binary search partition
        return 0.0;
    }

    public static void main(String[] args) {
        int[] n1 = {1, 3};
        int[] n2 = {2};
        System.out.printf("%.5f%n", findMedianSortedArrays(n1, n2)); // Expected: 2.00000
        
        int[] n3 = {1, 2};
        int[] n4 = {3, 4};
        System.out.printf("%.5f%n", findMedianSortedArrays(n3, n4)); // Expected: 2.50000
    }
}`
    },
    solutionCode: {
      python: `def findMedianSortedArrays(nums1, nums2):
    if len(nums1) > len(nums2):
        nums1, nums2 = nums2, nums1
        
    m, n = len(nums1), len(nums2)
    total_half = (m + n + 1) // 2
    
    left, right = 0, m
    
    while left <= right:
        i = (left + right) // 2
        j = total_half - i
        
        nums1_left_max = float('-inf') if i == 0 else nums1[i-1]
        nums1_right_min = float('inf') if i == m else nums1[i]
        nums2_left_max = float('-inf') if j == 0 else nums2[j-1]
        nums2_right_min = float('inf') if j == n else nums2[j]
        
        if nums1_left_max <= nums2_right_min and nums2_left_max <= nums1_right_min:
            # Correct partition found
            if (m + n) % 2 == 1:
                return max(nums1_left_max, nums2_left_max)
            else:
                return (max(nums1_left_max, nums2_left_max) + min(nums1_right_min, nums2_right_min)) / 2
        elif nums1_left_max > nums2_right_min:
            right = i - 1
        else:
            left = i + 1
            
    return 0.0`,
      javascript: `var findMedianSortedArrays = function(nums1, nums2) {
    if (nums1.length > nums2.length) {
        [nums1, nums2] = [nums2, nums1];
    }
    
    const m = nums1.length;
    const n = nums2.length;
    const totalHalf = Math.floor((m + n + 1) / 2);
    
    let left = 0;
    let right = m;
    
    while (left <= right) {
        const i = Math.floor((left + right) / 2);
        const j = totalHalf - i;
        
        const nums1LeftMax = i === 0 ? -Infinity : nums1[i - 1];
        const nums1RightMin = i === m ? Infinity : nums1[i];
        const nums2LeftMax = j === 0 ? -Infinity : nums2[j - 1];
        const nums2RightMin = j === n ? Infinity : nums2[j];
        
        if (nums1LeftMax <= nums2RightMin && nums2LeftMax <= nums1RightMin) {
            if ((m + n) % 2 === 1) {
                return Math.max(nums1LeftMax, nums2LeftMax);
            } else {
                return (Math.max(nums1LeftMax, nums2LeftMax) + Math.min(nums1RightMin, nums2RightMin)) / 2;
            }
        } else if (nums1LeftMax > nums2RightMin) {
            right = i - 1;
        } else {
            left = i + 1;
        }
    }
    
    return 0;
};`,
      cpp: `double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {
    if (nums1.size() > nums2.size()) {
        swap(nums1, nums2);
    }
    
    int m = nums1.size();
    int n = nums2.size();
    int totalHalf = (m + n + 1) / 2;
    
    int left = 0, right = m;
    
    while (left <= right) {
        int i = left + (right - left) / 2;
        int j = totalHalf - i;
        
        int nums1LeftMax = (i == 0) ? INT_MIN : nums1[i - 1];
        int nums1RightMin = (i == m) ? INT_MAX : nums1[i];
        int nums2LeftMax = (j == 0) ? INT_MIN : nums2[j - 1];
        int nums2RightMin = (j == n) ? INT_MAX : nums2[j];
        
        if (nums1LeftMax <= nums2RightMin && nums2LeftMax <= nums1RightMin) {
            if ((m + n) % 2 == 1) {
                return max(nums1LeftMax, nums2LeftMax);
            } else {
                return (max(nums1LeftMax, nums2LeftMax) + min(nums1RightMin, nums2RightMin)) / 2.0;
            }
        } else if (nums1LeftMax > nums2RightMin) {
            right = i - 1;
        } else {
            left = i + 1;
        }
    }
    
    return 0.0;
}`,
      java: `public static double findMedianSortedArrays(int[] nums1, int[] nums2) {
    if (nums1.length > nums2.length) {
        return findMedianSortedArrays(nums2, nums1);
    }
    
    int m = nums1.length;
    int n = nums2.length;
    int totalHalf = (m + n + 1) / 2;
    
    int left = 0, right = m;
    
    while (left <= right) {
        int i = left + (right - left) / 2;
        int j = totalHalf - i;
        
        int nums1LeftMax = (i == 0) ? Integer.MIN_VALUE : nums1[i - 1];
        int nums1RightMin = (i == m) ? Integer.MAX_VALUE : nums1[i];
        int nums2LeftMax = (j == 0) ? Integer.MIN_VALUE : nums2[j - 1];
        int nums2RightMin = (j == n) ? Integer.MAX_VALUE : nums2[j];
        
        if (nums1LeftMax <= nums2RightMin && nums2LeftMax <= nums1RightMin) {
            if ((m + n) % 2 == 1) {
                return Math.max(nums1LeftMax, nums2LeftMax);
            } else {
                return (Math.max(nums1LeftMax, nums2LeftMax) + Math.min(nums1RightMin, nums2RightMin)) / 2.0;
            }
        } else if (nums1LeftMax > nums2RightMin) {
            right = i - 1;
        } else {
            left = i + 1;
        }
    }
    
    return 0.0;
}`
    },
    solutionExplanation: `To achieve O(log(min(M,N))), we binary search on the partition of the shorter array. Let \`i\` be the cut position in \`nums1\` and \`j\` in \`nums2\`. Ideally, \`i + j = (M + N + 1) / 2\`. We adjust \`i\` based on comparisons: if \`nums1[i-1] > nums2[j]\`, the cut in \`nums1\` is too far right, so decrease \`i\`. If \`nums2[j-1] > nums1[i]\`, increase \`i\`. Once correct cuts are found, the median is derived from the max of left parts and min of right parts. Boundary conditions are handled using infinity values.`,
    testCases: [
      { id: 'tc-1', input: 'nums1=[1,3], nums2=[2]', expected: '2.00000' },
      { id: 'tc-2', input: 'nums1=[1,2], nums2=[3,4]', expected: '2.50000' },
      { id: 'tc-3', input: 'nums1=[], nums2=[1]', expected: '1.00000' }
    ]
  }
];
