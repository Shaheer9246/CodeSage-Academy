import { DsaProblem } from './types';

export const TREES_BST_PROBLEMS: DsaProblem[] = [
  {
    id: 'dsa-tb-01',
    number: 1,
    title: 'Invert Binary Tree',
    slug: 'invert-binary-tree',
    category: 'Trees & BST',
    difficulty: 'Easy',
    summary: 'Invert a binary tree (mirror image).',
    description: `Given the \`root\` of a binary tree, invert the tree, and return *its root*.`,
    examples: [
      {
        input: 'root = [4,2,7,1,3,6,9]',
        output: '[4,7,2,9,6,3,1]',
        explanation: 'Swapping left and right children at every node.'
      },
      {
        input: 'root = [2,1,3]',
        output: '[2,3,1]'
      }
    ],
    constraints: [
      'The number of nodes in the tree is in the range [0, 100].',
      '-100 <= Node.val <= 100'
    ],
    keyPoints: [
      '**Brute Force**: Not applicable really, but iterative BFS/DFS both work.',
      '**Core Insight**: Recursion. Swap left and right children of current node, then recursively invert left subtree and right subtree.',
      '**Edge Cases**: Empty tree (null), single node tree.',
      '**Space-Time Analysis**: O(N) time visiting each node once. O(H) space for recursion stack, where H is height (worst case O(N)).'
    ],
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(H)',
    companies: ['Amazon', 'Apple', 'LinkedIn'],
    starterCode: {
      python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def build_tree(arr):
    if not arr: return None
    root = TreeNode(arr[0])
    queue = [root]
    i = 1
    while queue and i < len(arr):
        node = queue.pop(0)
        if arr[i] is not None:
            node.left = TreeNode(arr[i])
            queue.append(node.left)
        i += 1
        if i < len(arr) and arr[i] is not None:
            node.right = TreeNode(arr[i])
            queue.append(node.right)
        i += 1
    return root

def print_tree(root):
    if not root: return "[]"
    res = []
    q = [root]
    while q:
        node = q.pop(0)
        if node:
            res.append(str(node.val))
            q.append(node.left)
            q.append(node.right)
        else:
            res.append("null")
    # Trim trailing nulls for cleaner output
    while res and res[-1] == "null":
        res.pop()
    print("[" + ",".join(res) + "]")

# TODO: Implement invertTree
def invertTree(root: TreeNode) -> TreeNode:
    pass

# Test Execution
if __name__ == "__main__":
    root = build_tree([4,2,7,1,3,6,9])
    inverted = invertTree(root)
    print_tree(inverted) # Expected: [4,7,2,9,6,3,1]`,
      javascript: `class TreeNode {
    constructor(val = 0, left = null, right = null) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}

function buildTree(arr) {
    if (!arr.length || arr[0] === null) return null;
    const root = new TreeNode(arr[0]);
    const queue = [root];
    let i = 1;
    while (queue.length > 0 && i < arr.length) {
        const node = queue.shift();
        if (arr[i] !== null) {
            node.left = new TreeNode(arr[i]);
            queue.push(node.left);
        }
        i++;
        if (i < arr.length && arr[i] !== null) {
            node.right = new TreeNode(arr[i]);
            queue.push(node.right);
        }
        i++;
    }
    return root;
}

function printTree(root) {
    if (!root) return "[]";
    const res = [];
    const q = [root];
    while (q.length > 0) {
        const node = q.shift();
        if (node) {
            res.push(node.val);
            q.push(node.left);
            q.push(node.right);
        } else {
            res.push(null);
        }
    }
    // Trim trailing nulls
    while (res.length > 0 && res[res.length - 1] === null) {
        res.pop();
    }
    console.log("[" + res.join(",") + "]");
}

// TODO: Implement invertTree
var invertTree = function(root) {
    
};

// Test Execution
const root = buildTree([4,2,7,1,3,6,9]);
const inverted = invertTree(root);
printTree(inverted); // Expected: [4,7,2,9,6,3,1]`,
      cpp: `#include <iostream>
#include <vector>
#include <queue>
#include <string>
using namespace std;

struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode(int x) : val(x), left(NULL), right(NULL) {}
};

TreeNode* buildTree(vector<int>& arr) {
    if (arr.empty() || arr[0] == INT_MIN) return nullptr; // Using INT_MIN as null marker for simplicity in test
    TreeNode* root = new TreeNode(arr[0]);
    queue<TreeNode*> q;
    q.push(root);
    int i = 1;
    while (!q.empty() && i < arr.size()) {
        TreeNode* node = q.front(); q.pop();
        if (i < arr.size() && arr[i] != INT_MIN) {
            node->left = new TreeNode(arr[i]);
            q.push(node->left);
        }
        i++;
        if (i < arr.size() && arr[i] != INT_MIN) {
            node->right = new TreeNode(arr[i]);
            q.push(node->right);
        }
        i++;
    }
    return root;
}

void printTree(TreeNode* root) {
    if (!root) { cout << "[]" << endl; return; }
    vector<string> res;
    queue<TreeNode*> q;
    q.push(root);
    while (!q.empty()) {
        TreeNode* node = q.front(); q.pop();
        if (node) {
            res.push_back(to_string(node->val));
            q.push(node->left);
            q.push(node->right);
        } else {
            res.push_back("null");
        }
    }
    // Trim trailing nulls
    while (!res.empty() && res.back() == "null") res.pop_back();
    cout << "[";
    for (size_t i = 0; i < res.size(); ++i) {
        cout << res[i];
        if (i < res.size() - 1) cout << ",";
    }
    cout << "]" << endl;
}

// TODO: Implement invertTree
TreeNode* invertTree(TreeNode* root) {
    return nullptr;
}

int main() {
    // Use INT_MIN to represent null in input array for this helper
    vector<int> arr = {4, 2, 7, 1, 3, 6, 9};
    TreeNode* root = buildTree(arr);
    TreeNode* inverted = invertTree(root);
    printTree(inverted); // Expected: [4,7,2,9,6,3,1]
    return 0;
}`,
      java: `import java.util.*;

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode(int x) { val = x; }
}

public class Solution {
    public static TreeNode buildTree(Integer[] arr) {
        if (arr == null || arr.length == 0 || arr[0] == null) return null;
        TreeNode root = new TreeNode(arr[0]);
        Queue<TreeNode> queue = new LinkedList<>();
        queue.add(root);
        int i = 1;
        while (!queue.isEmpty() && i < arr.length) {
            TreeNode node = queue.poll();
            if (i < arr.length && arr[i] != null) {
                node.left = new TreeNode(arr[i]);
                queue.add(node.left);
            }
            i++;
            if (i < arr.length && arr[i] != null) {
                node.right = new TreeNode(arr[i]);
                queue.add(node.right);
            }
            i++;
        }
        return root;
    }

    public static void printTree(TreeNode root) {
        if (root == null) { System.out.println("[]"); return; }
        List<String> res = new ArrayList<>();
        Queue<TreeNode> queue = new LinkedList<>();
        queue.add(root);
        while (!queue.isEmpty()) {
            TreeNode node = queue.poll();
            if (node != null) {
                res.add(String.valueOf(node.val));
                queue.add(node.left);
                queue.add(node.right);
            } else {
                res.add("null");
            }
        }
        // Trim trailing nulls
        while (!res.isEmpty() && res.get(res.size() - 1).equals("null")) {
            res.remove(res.size() - 1);
        }
        System.out.println("[" + String.join(",", res) + "]");
    }

    // TODO: Implement invertTree
    public static TreeNode invertTree(TreeNode root) {
        return null;
    }

    public static void main(String[] args) {
        Integer[] arr = {4, 2, 7, 1, 3, 6, 9};
        TreeNode root = buildTree(arr);
        TreeNode inverted = invertTree(root);
        printTree(inverted); // Expected: [4,7,2,9,6,3,1]
    }
}`
    },
    solutionCode: {
      python: `def invertTree(root: TreeNode) -> TreeNode:
    if not root:
        return None
    
    # Swap left and right
    root.left, root.right = root.right, root.left
    
    # Recurse
    invertTree(root.left)
    invertTree(root.right)
    
    return root`,
      javascript: `var invertTree = function(root) {
    if (!root) return null;
    
    // Swap
    let temp = root.left;
    root.left = root.right;
    root.right = temp;
    
    // Recurse
    invertTree(root.left);
    invertTree(root.right);
    
    return root;
};`,
      cpp: `TreeNode* invertTree(TreeNode* root) {
    if (root == NULL) return NULL;
    
    // Swap
    TreeNode* temp = root->left;
    root->left = root->right;
    root->right = temp;
    
    // Recurse
    invertTree(root->left);
    invertTree(root->right);
    
    return root;
}`,
      java: `public static TreeNode invertTree(TreeNode root) {
    if (root == null) return null;
    
    // Swap
    TreeNode temp = root.left;
    root.left = root.right;
    root.right = temp;
    
    // Recurse
    invertTree(root.left);
    invertTree(root.right);
    
    return root;
}`
    },
    solutionExplanation: `We use a recursive approach. For any given node, we swap its left and right children. Then, we recursively call the inversion function on the new left child (which was originally right) and the new right child. The base case is when the node is null, returning null. This effectively mirrors the entire tree structure.`,
    testCases: [
      { id: 'tc-1', input: '[4,2,7,1,3,6,9]', expected: '[4,7,2,9,6,3,1]' },
      { id: 'tc-2', input: '[2,1,3]', expected: '[2,3,1]' },
      { id: 'tc-3', input: '[]', expected: '[]' }
    ]
  },
  {
    id: 'dsa-tb-02',
    number: 2,
    title: 'Maximum Depth of Binary Tree',
    slug: 'maximum-depth-of-binary-tree',
    category: 'Trees & BST',
    difficulty: 'Easy',
    summary: 'Find the maximum depth (height) of a binary tree.',
    description: `Given the \`root\` of a binary tree, return *its maximum depth*.\n\nA binary tree's **maximum depth** is the number of nodes along the longest path from the root node down to the farthest leaf node.`,
    examples: [
      {
        input: 'root = [3,9,20,null,null,15,7]',
        output: '3',
        explanation: 'Longest path has 3 nodes.'
      }
    ],
    constraints: [
      'The number of nodes in the tree is in the range [0, 10^4].',
      '-100 <= Node.val <= 100'
    ],
    keyPoints: [
      '**Brute Force**: N/A, standard DFS/BFS applies.',
      '**Core Insight**: Recursion. Depth of current node is 1 + max(depth(left), depth(right)). Base case: null node returns 0.',
      '**Edge Cases**: Empty tree (depth 0), skewed tree (depth N).',
      '**Space-Time Analysis**: O(N) time. O(H) space for recursion stack.'
    ],
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(H)',
    companies: ['Amazon', 'Microsoft', 'Google'],
    starterCode: {
      python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def build_tree(arr):
    if not arr or arr[0] is None: return None
    root = TreeNode(arr[0])
    queue = [root]
    i = 1
    while queue and i < len(arr):
        node = queue.pop(0)
        if i < len(arr) and arr[i] is not None:
            node.left = TreeNode(arr[i])
            queue.append(node.left)
        i += 1
        if i < len(arr) and arr[i] is not None:
            node.right = TreeNode(arr[i])
            queue.append(node.right)
        i += 1
    return root

# TODO: Implement maxDepth
def maxDepth(root: TreeNode) -> int:
    pass

# Test Execution
if __name__ == "__main__":
    root = build_tree([3,9,20,None,None,15,7])
    print(maxDepth(root)) # Expected: 3`,
      javascript: `class TreeNode {
    constructor(val = 0, left = null, right = null) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}

function buildTree(arr) {
    if (!arr.length || arr[0] === null) return null;
    const root = new TreeNode(arr[0]);
    const queue = [root];
    let i = 1;
    while (queue.length > 0 && i < arr.length) {
        const node = queue.shift();
        if (i < arr.length && arr[i] !== null) {
            node.left = new TreeNode(arr[i]);
            queue.push(node.left);
        }
        i++;
        if (i < arr.length && arr[i] !== null) {
            node.right = new TreeNode(arr[i]);
            queue.push(node.right);
        }
        i++;
    }
    return root;
}

// TODO: Implement maxDepth
var maxDepth = function(root) {
    
};

// Test Execution
const root = buildTree([3,9,20,null,null,15,7]);
console.log(maxDepth(root)); // Expected: 3`,
      cpp: `#include <iostream>
#include <vector>
#include <queue>
#include <algorithm>
using namespace std;

struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode(int x) : val(x), left(NULL), right(NULL) {}
};

TreeNode* buildTree(vector<int>& arr) {
    if (arr.empty() || arr[0] == INT_MIN) return nullptr;
    TreeNode* root = new TreeNode(arr[0]);
    queue<TreeNode*> q;
    q.push(root);
    int i = 1;
    while (!q.empty() && i < arr.size()) {
        TreeNode* node = q.front(); q.pop();
        if (i < arr.size() && arr[i] != INT_MIN) {
            node->left = new TreeNode(arr[i]);
            q.push(node->left);
        }
        i++;
        if (i < arr.size() && arr[i] != INT_MIN) {
            node->right = new TreeNode(arr[i]);
            q.push(node->right);
        }
        i++;
    }
    return root;
}

// TODO: Implement maxDepth
int maxDepth(TreeNode* root) {
    return 0;
}

int main() {
    vector<int> arr = {3, 9, 20, INT_MIN, INT_MIN, 15, 7};
    TreeNode* root = buildTree(arr);
    cout << maxDepth(root) << endl; // Expected: 3
    return 0;
}`,
      java: `import java.util.*;

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode(int x) { val = x; }
}

public class Solution {
    public static TreeNode buildTree(Integer[] arr) {
        if (arr == null || arr.length == 0 || arr[0] == null) return null;
        TreeNode root = new TreeNode(arr[0]);
        Queue<TreeNode> queue = new LinkedList<>();
        queue.add(root);
        int i = 1;
        while (!queue.isEmpty() && i < arr.length) {
            TreeNode node = queue.poll();
            if (i < arr.length && arr[i] != null) {
                node.left = new TreeNode(arr[i]);
                queue.add(node.left);
            }
            i++;
            if (i < arr.length && arr[i] != null) {
                node.right = new TreeNode(arr[i]);
                queue.add(node.right);
            }
            i++;
        }
        return root;
    }

    // TODO: Implement maxDepth
    public static int maxDepth(TreeNode root) {
        return 0;
    }

    public static void main(String[] args) {
        Integer[] arr = {3, 9, 20, null, null, 15, 7};
        TreeNode root = buildTree(arr);
        System.out.println(maxDepth(root)); // Expected: 3
    }
}`
    },
    solutionCode: {
      python: `def maxDepth(root: TreeNode) -> int:
    if not root:
        return 0
    return 1 + max(maxDepth(root.left), maxDepth(root.right))`,
      javascript: `var maxDepth = function(root) {
    if (!root) return 0;
    return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
};`,
      cpp: `int maxDepth(TreeNode* root) {
    if (root == NULL) return 0;
    return 1 + max(maxDepth(root->left), maxDepth(root->right));
}`,
      java: `public static int maxDepth(TreeNode root) {
    if (root == null) return 0;
    return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}`
    },
    solutionExplanation: `This is a classic post-order traversal problem. We calculate the depth of the left subtree and the right subtree recursively. The depth of the current node is 1 plus the maximum of these two depths. If the node is null, the depth is 0.`,
    testCases: [
      { id: 'tc-1', input: '[3,9,20,null,null,15,7]', expected: '3' },
      { id: 'tc-2', input: '[1,null,2]', expected: '2' },
      { id: 'tc-3', input: '[]', expected: '0' }
    ]
  },
  {
    id: 'dsa-tb-03',
    number: 3,
    title: 'Same Tree',
    slug: 'same-tree',
    category: 'Trees & BST',
    difficulty: 'Easy',
    summary: 'Check if two binary trees are structurally identical and have same values.',
    description: `Given the roots of two binary trees \`p\` and \`q\`, write a function to check if they are the same or not.\n\nTwo binary trees are considered the same if they are structurally identical, and the nodes have the same value.`,
    examples: [
      {
        input: 'p = [1,2,3], q = [1,2,3]',
        output: 'true'
      },
      {
        input: 'p = [1,2], q = [1,null,2]',
        output: 'false'
      }
    ],
    constraints: [
      'The number of nodes in both trees is in the range [0, 100].',
      '-10^4 <= Node.val <= 10^4'
    ],
    keyPoints: [
      '**Brute Force**: Serialize both trees to strings and compare. Time O(N), Space O(N).',
      '**Core Insight**: Recursive Comparison. Check if roots are equal. Then recursively check if left subtrees are same AND right subtrees are same.',
      '**Edge Cases**: Both null (true), one null one not (false), different structures with same values.',
      '**Space-Time Analysis**: O(N) time, O(H) space.'
    ],
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(H)',
    companies: ['Amazon', 'Microsoft', 'Bloomberg'],
    starterCode: {
      python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def build_tree(arr):
    if not arr or arr[0] is None: return None
    root = TreeNode(arr[0])
    queue = [root]
    i = 1
    while queue and i < len(arr):
        node = queue.pop(0)
        if i < len(arr) and arr[i] is not None:
            node.left = TreeNode(arr[i])
            queue.append(node.left)
        i += 1
        if i < len(arr) and arr[i] is not None:
            node.right = TreeNode(arr[i])
            queue.append(node.right)
        i += 1
    return root

# TODO: Implement isSameTree
def isSameTree(p: TreeNode, q: TreeNode) -> bool:
    pass

# Test Execution
if __name__ == "__main__":
    p = build_tree([1,2,3])
    q = build_tree([1,2,3])
    print(isSameTree(p, q)) # Expected: True
    
    r = build_tree([1,2])
    s = build_tree([1,None,2])
    print(isSameTree(r, s)) # Expected: False`,
      javascript: `class TreeNode {
    constructor(val = 0, left = null, right = null) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}

function buildTree(arr) {
    if (!arr.length || arr[0] === null) return null;
    const root = new TreeNode(arr[0]);
    const queue = [root];
    let i = 1;
    while (queue.length > 0 && i < arr.length) {
        const node = queue.shift();
        if (i < arr.length && arr[i] !== null) {
            node.left = new TreeNode(arr[i]);
            queue.push(node.left);
        }
        i++;
        if (i < arr.length && arr[i] !== null) {
            node.right = new TreeNode(arr[i]);
            queue.push(node.right);
        }
        i++;
    }
    return root;
}

// TODO: Implement isSameTree
var isSameTree = function(p, q) {
    
};

// Test Execution
const p = buildTree([1,2,3]);
const q = buildTree([1,2,3]);
console.log(isSameTree(p, q)); // Expected: true

const r = buildTree([1,2]);
const s = buildTree([1,null,2]);
console.log(isSameTree(r, s)); // Expected: false`,
      cpp: `#include <iostream>
#include <vector>
#include <queue>
using namespace std;

struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode(int x) : val(x), left(NULL), right(NULL) {}
};

TreeNode* buildTree(vector<int>& arr) {
    if (arr.empty() || arr[0] == INT_MIN) return nullptr;
    TreeNode* root = new TreeNode(arr[0]);
    queue<TreeNode*> q;
    q.push(root);
    int i = 1;
    while (!q.empty() && i < arr.size()) {
        TreeNode* node = q.front(); q.pop();
        if (i < arr.size() && arr[i] != INT_MIN) {
            node->left = new TreeNode(arr[i]);
            q.push(node->left);
        }
        i++;
        if (i < arr.size() && arr[i] != INT_MIN) {
            node->right = new TreeNode(arr[i]);
            q.push(node->right);
        }
        i++;
    }
    return root;
}

// TODO: Implement isSameTree
bool isSameTree(TreeNode* p, TreeNode* q) {
    return false;
}

int main() {
    vector<int> arr1 = {1, 2, 3};
    vector<int> arr2 = {1, 2, 3};
    TreeNode* p = buildTree(arr1);
    TreeNode* q = buildTree(arr2);
    cout << (isSameTree(p, q) ? "true" : "false") << endl; // Expected: true
    
    vector<int> arr3 = {1, 2};
    vector<int> arr4 = {1, INT_MIN, 2};
    TreeNode* r = buildTree(arr3);
    TreeNode* s = buildTree(arr4);
    cout << (isSameTree(r, s) ? "true" : "false") << endl; // Expected: false
    return 0;
}`,
      java: `import java.util.*;

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode(int x) { val = x; }
}

public class Solution {
    public static TreeNode buildTree(Integer[] arr) {
        if (arr == null || arr.length == 0 || arr[0] == null) return null;
        TreeNode root = new TreeNode(arr[0]);
        Queue<TreeNode> queue = new LinkedList<>();
        queue.add(root);
        int i = 1;
        while (!queue.isEmpty() && i < arr.length) {
            TreeNode node = queue.poll();
            if (i < arr.length && arr[i] != null) {
                node.left = new TreeNode(arr[i]);
                queue.add(node.left);
            }
            i++;
            if (i < arr.length && arr[i] != null) {
                node.right = new TreeNode(arr[i]);
                queue.add(node.right);
            }
            i++;
        }
        return root;
    }

    // TODO: Implement isSameTree
    public static boolean isSameTree(TreeNode p, TreeNode q) {
        return false;
    }

    public static void main(String[] args) {
        Integer[] arr1 = {1, 2, 3};
        Integer[] arr2 = {1, 2, 3};
        TreeNode p = buildTree(arr1);
        TreeNode q = buildTree(arr2);
        System.out.println(isSameTree(p, q)); // Expected: true
        
        Integer[] arr3 = {1, 2};
        Integer[] arr4 = {1, null, 2};
        TreeNode r = buildTree(arr3);
        TreeNode s = buildTree(arr4);
        System.out.println(isSameTree(r, s)); // Expected: false
    }
}`
    },
    solutionCode: {
      python: `def isSameTree(p: TreeNode, q: TreeNode) -> bool:
    if not p and not q:
        return True
    if not p or not q:
        return False
    if p.val != q.val:
        return False
    return isSameTree(p.left, q.left) and isSameTree(p.right, q.right)`,
      javascript: `var isSameTree = function(p, q) {
    if (!p && !q) return true;
    if (!p || !q) return false;
    if (p.val !== q.val) return false;
    return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
};`,
      cpp: `bool isSameTree(TreeNode* p, TreeNode* q) {
    if (p == NULL && q == NULL) return true;
    if (p == NULL || q == NULL) return false;
    if (p->val != q->val) return false;
    return isSameTree(p->left, q->left) && isSameTree(p->right, q->right);
}`,
      java: `public static boolean isSameTree(TreeNode p, TreeNode q) {
    if (p == null && q == null) return true;
    if (p == null || q == null) return false;
    if (p.val != q.val) return false;
    return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
}`
    },
    solutionExplanation: `We compare the two trees node by node. First, handle base cases: if both are null, they are same. If only one is null, they are different. If values differ, return false. Otherwise, recursively check if left subtrees are same AND right subtrees are same.`,
    testCases: [
      { id: 'tc-1', input: 'p=[1,2,3], q=[1,2,3]', expected: 'true' },
      { id: 'tc-2', input: 'p=[1,2], q=[1,null,2]', expected: 'false' },
      { id: 'tc-3', input: 'p=[], q=[]', expected: 'true' }
    ]
  },
  {
    id: 'dsa-tb-04',
    number: 4,
    title: 'Subtree of Another Tree',
    slug: 'subtree-of-another-tree',
    category: 'Trees & BST',
    difficulty: 'Easy',
    summary: 'Check if tree s is a subtree of tree t.',
    description: `Given the roots of two binary trees \`root\` and \`subRoot\`, return \`true\` if there is a node in \`root\` with the same tree structure and values as \`subRoot\`.`,
    examples: [
      {
        input: 'root = [3,4,5,1,2,null,null,null,null,0], subRoot = [4,1,2]',
        output: 'true'
      }
    ],
    constraints: [
      'The number of nodes in the root tree is in the range [1, 2000].',
      'The number of nodes in the subRoot tree is in the range [1, 1000].',
      '-10^4 <= root.val <= 10^4',
      '-10^4 <= subRoot.val <= 10^4'
    ],
    keyPoints: [
      '**Brute Force**: For every node in root, check if it matches subRoot using isSameTree logic.',
      '**Core Insight**: Recursion. Either current node matches subRoot (via isSameTree), OR subRoot is in left subtree, OR subRoot is in right subtree.',
      '**Edge Cases**: SubRoot larger than Root, identical trees.',
      '**Space-Time Analysis**: Worst case O(M*N) time where M, N are sizes. O(H) space.'
    ],
    timeComplexity: 'O(M*N)',
    spaceComplexity: 'O(H)',
    companies: ['Amazon', 'Microsoft', 'Facebook'],
    starterCode: {
      python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def build_tree(arr):
    if not arr or arr[0] is None: return None
    root = TreeNode(arr[0])
    queue = [root]
    i = 1
    while queue and i < len(arr):
        node = queue.pop(0)
        if i < len(arr) and arr[i] is not None:
            node.left = TreeNode(arr[i])
            queue.append(node.left)
        i += 1
        if i < len(arr) and arr[i] is not None:
            node.right = TreeNode(arr[i])
            queue.append(node.right)
        i += 1
    return root

# Helper: Check if two trees are identical
def is_same(t1, t2):
    if not t1 and not t2: return True
    if not t1 or not t2: return False
    if t1.val != t2.val: return False
    return is_same(t1.left, t2.left) and is_same(t1.right, t2.right)

# TODO: Implement isSubtree
def isSubtree(root: TreeNode, subRoot: TreeNode) -> bool:
    pass

# Test Execution
if __name__ == "__main__":
    root = build_tree([3,4,5,1,2,None,None,None,None,0])
    subRoot = build_tree([4,1,2])
    print(isSubtree(root, subRoot)) # Expected: True`,
      javascript: `class TreeNode {
    constructor(val = 0, left = null, right = null) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}

function buildTree(arr) {
    if (!arr.length || arr[0] === null) return null;
    const root = new TreeNode(arr[0]);
    const queue = [root];
    let i = 1;
    while (queue.length > 0 && i < arr.length) {
        const node = queue.shift();
        if (i < arr.length && arr[i] !== null) {
            node.left = new TreeNode(arr[i]);
            queue.push(node.left);
        }
        i++;
        if (i < arr.length && arr[i] !== null) {
            node.right = new TreeNode(arr[i]);
            queue.push(node.right);
        }
        i++;
    }
    return root;
}

// Helper
function isSame(t1, t2) {
    if (!t1 && !t2) return true;
    if (!t1 || !t2) return false;
    if (t1.val !== t2.val) return false;
    return isSame(t1.left, t2.left) && isSame(t1.right, t2.right);
}

// TODO: Implement isSubtree
var isSubtree = function(root, subRoot) {
    
};

// Test Execution
const root = buildTree([3,4,5,1,2,null,null,null,null,0]);
const subRoot = buildTree([4,1,2]);
console.log(isSubtree(root, subRoot)); // Expected: true`,
      cpp: `#include <iostream>
#include <vector>
#include <queue>
using namespace std;

struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode(int x) : val(x), left(NULL), right(NULL) {}
};

TreeNode* buildTree(vector<int>& arr) {
    if (arr.empty() || arr[0] == INT_MIN) return nullptr;
    TreeNode* root = new TreeNode(arr[0]);
    queue<TreeNode*> q;
    q.push(root);
    int i = 1;
    while (!q.empty() && i < arr.size()) {
        TreeNode* node = q.front(); q.pop();
        if (i < arr.size() && arr[i] != INT_MIN) {
            node->left = new TreeNode(arr[i]);
            q.push(node->left);
        }
        i++;
        if (i < arr.size() && arr[i] != INT_MIN) {
            node->right = new TreeNode(arr[i]);
            q.push(node->right);
        }
        i++;
    }
    return root;
}

bool isSame(TreeNode* t1, TreeNode* t2) {
    if (!t1 && !t2) return true;
    if (!t1 || !t2) return false;
    if (t1->val != t2->val) return false;
    return isSame(t1->left, t2->left) && isSame(t1->right, t2->right);
}

// TODO: Implement isSubtree
bool isSubtree(TreeNode* root, TreeNode* subRoot) {
    return false;
}

int main() {
    vector<int> arrR = {3, 4, 5, 1, 2, INT_MIN, INT_MIN, INT_MIN, INT_MIN, 0};
    vector<int> arrS = {4, 1, 2};
    TreeNode* root = buildTree(arrR);
    TreeNode* subRoot = buildTree(arrS);
    cout << (isSubtree(root, subRoot) ? "true" : "false") << endl; // Expected: true
    return 0;
}`,
      java: `import java.util.*;

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode(int x) { val = x; }
}

public class Solution {
    public static TreeNode buildTree(Integer[] arr) {
        if (arr == null || arr.length == 0 || arr[0] == null) return null;
        TreeNode root = new TreeNode(arr[0]);
        Queue<TreeNode> queue = new LinkedList<>();
        queue.add(root);
        int i = 1;
        while (!queue.isEmpty() && i < arr.length) {
            TreeNode node = queue.poll();
            if (i < arr.length && arr[i] != null) {
                node.left = new TreeNode(arr[i]);
                queue.add(node.left);
            }
            i++;
            if (i < arr.length && arr[i] != null) {
                node.right = new TreeNode(arr[i]);
                queue.add(node.right);
            }
            i++;
        }
        return root;
    }

    static boolean isSame(TreeNode t1, TreeNode t2) {
        if (t1 == null && t2 == null) return true;
        if (t1 == null || t2 == null) return false;
        if (t1.val != t2.val) return false;
        return isSame(t1.left, t2.left) && isSame(t1.right, t2.right);
    }

    // TODO: Implement isSubtree
    public static boolean isSubtree(TreeNode root, TreeNode subRoot) {
        return false;
    }

    public static void main(String[] args) {
        Integer[] arrR = {3, 4, 5, 1, 2, null, null, null, null, 0};
        Integer[] arrS = {4, 1, 2};
        TreeNode root = buildTree(arrR);
        TreeNode subRoot = buildTree(arrS);
        System.out.println(isSubtree(root, subRoot)); // Expected: true
    }
}`
    },
    solutionCode: {
      python: `def isSubtree(root: TreeNode, subRoot: TreeNode) -> bool:
    if not root:
        return False
    if is_same(root, subRoot):
        return True
    return isSubtree(root.left, subRoot) or isSubtree(root.right, subRoot)`,
      javascript: `var isSubtree = function(root, subRoot) {
    if (!root) return false;
    if (isSame(root, subRoot)) return true;
    return isSubtree(root.left, subRoot) || isSubtree(root.right, subRoot);
};`,
      cpp: `bool isSubtree(TreeNode* root, TreeNode* subRoot) {
    if (root == NULL) return false;
    if (isSame(root, subRoot)) return true;
    return isSubtree(root->left, subRoot) || isSubtree(root->right, subRoot);
}`,
      java: `public static boolean isSubtree(TreeNode root, TreeNode subRoot) {
    if (root == null) return false;
    if (isSame(root, subRoot)) return true;
    return isSubtree(root.left, subRoot) || isSubtree(root.right, subRoot);
}`
    },
    solutionExplanation: `We traverse every node in the main tree. At each node, we check if the subtree rooted there is identical to \`subRoot\` using the \`isSame\` helper. If it is, we return true. If not, we recursively check the left and right children of the current node.`,
    testCases: [
      { id: 'tc-1', input: 'root=[3,4,5,1,2...], subRoot=[4,1,2]', expected: 'true' },
      { id: 'tc-2', input: 'root=[1,1], subRoot=[1]', expected: 'true' },
      { id: 'tc-3', input: 'root=[1,2,3], subRoot=[4]', expected: 'false' }
    ]
  },
  {
    id: 'dsa-tb-05',
    number: 5,
    title: 'Lowest Common Ancestor of a BST',
    slug: 'lowest-common-ancestor-of-a-bst',
    category: 'Trees & BST',
    difficulty: 'Medium',
    summary: 'Find LCA in a Binary Search Tree.',
    description: `Given a binary search tree (BST), find the lowest common ancestor (LCA) node of two given nodes in the BST.\n\nAccording to the definition of LCA on Wikipedia: “The lowest common ancestor is defined between two nodes \`p\` and \`q\` as the lowest node in T that has both \`p\` and \`q\` as descendants (where we allow **a node to be a descendant of itself**).”`,
    examples: [
      {
        input: 'root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 8',
        output: '6',
        explanation: 'LCA of 2 and 8 is 6.'
      },
      {
        input: 'root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 4',
        output: '2',
        explanation: 'LCA of 2 and 4 is 2 (since 2 is ancestor of 4).'
      }
    ],
    constraints: [
      'The number of nodes in the tree is in the range [2, 10^5].',
      '-10^9 <= Node.val <= 10^9',
      'All Node.val are unique.',
      'p != q',
      'p and q will exist in the BST.'
    ],
    keyPoints: [
      '**Brute Force**: Find paths from root to p and q, then compare paths. Time O(H).',
      '**Core Insight**: BST Property. If both p and q are smaller than current node, go left. If both larger, go right. If they split (one smaller, one larger) or one equals current, current is LCA.',
      '**Edge Cases**: One node is ancestor of other.',
      '**Space-Time Analysis**: O(H) time, O(1) space (iterative) or O(H) (recursive).'
    ],
    timeComplexity: 'O(H)',
    spaceComplexity: 'O(1)',
    companies: ['Amazon', 'Microsoft', 'Google', 'LinkedIn'],
    starterCode: {
      python: `class TreeNode:
    def __init__(self, x):
        self.val = x
        self.left = None
        self.right = None

# TODO: Implement lowestCommonAncestor
def lowestCommonAncestor(root: 'TreeNode', p: 'TreeNode', q: 'TreeNode') -> 'TreeNode':
    pass

# Simple Test Setup
if __name__ == "__main__":
    # Constructing:       6
    #                   /   \\
    #                  2     8
    #                 / \\   / \\
    #                0   4 7   9
    #                   / \\
    #                  3   5
    root = TreeNode(6)
    root.left = TreeNode(2)
    root.right = TreeNode(8)
    root.left.left = TreeNode(0)
    root.left.right = TreeNode(4)
    root.right.left = TreeNode(7)
    root.right.right = TreeNode(9)
    root.left.right.left = TreeNode(3)
    root.left.right.right = TreeNode(5)
    
    p = root.left # Node 2
    q = root.right # Node 8
    lca = lowestCommonAncestor(root, p, q)
    print(lca.val) # Expected: 6`,
      javascript: `class TreeNode {
    constructor(x) {
        this.val = x;
        this.left = null;
        this.right = null;
    }
}

// TODO: Implement lowestCommonAncestor
var lowestCommonAncestor = function(root, p, q) {
    
};

// Test Execution
const root = new TreeNode(6);
root.left = new TreeNode(2);
root.right = new TreeNode(8);
root.left.left = new TreeNode(0);
root.left.right = new TreeNode(4);
root.right.left = new TreeNode(7);
root.right.right = new TreeNode(9);
root.left.right.left = new TreeNode(3);
root.left.right.right = new TreeNode(5);

const p = root.left;
const q = root.right;
const lca = lowestCommonAncestor(root, p, q);
console.log(lca.val); // Expected: 6`,
      cpp: `#include <iostream>
using namespace std;

struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode(int x) : val(x), left(NULL), right(NULL) {}
};

// TODO: Implement lowestCommonAncestor
TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
    return nullptr;
}

int main() {
    TreeNode* root = new TreeNode(6);
    root->left = new TreeNode(2);
    root->right = new TreeNode(8);
    root->left->left = new TreeNode(0);
    root->left->right = new TreeNode(4);
    root->right->left = new TreeNode(7);
    root->right->right = new TreeNode(9);
    root->left->right->left = new TreeNode(3);
    root->left->right->right = new TreeNode(5);
    
    TreeNode* p = root->left;
    TreeNode* q = root->right;
    TreeNode* lca = lowestCommonAncestor(root, p, q);
    cout << lca->val << endl; // Expected: 6
    return 0;
}`,
      java: `class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode(int x) { val = x; }
}

public class Solution {
    // TODO: Implement lowestCommonAncestor
    public static TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
        return null;
    }

    public static void main(String[] args) {
        TreeNode root = new TreeNode(6);
        root.left = new TreeNode(2);
        root.right = new TreeNode(8);
        root.left.left = new TreeNode(0);
        root.left.right = new TreeNode(4);
        root.right.left = new TreeNode(7);
        root.right.right = new TreeNode(9);
        root.left.right.left = new TreeNode(3);
        root.left.right.right = new TreeNode(5);
        
        TreeNode p = root.left;
        TreeNode q = root.right;
        TreeNode lca = lowestCommonAncestor(root, p, q);
        System.out.println(lca.val); // Expected: 6
    }
}`
    },
    solutionCode: {
      python: `def lowestCommonAncestor(root: 'TreeNode', p: 'TreeNode', q: 'TreeNode') -> 'TreeNode':
    curr = root
    
    while curr:
        if p.val > curr.val and q.val > curr.val:
            curr = curr.right
        elif p.val < curr.val and q.val < curr.val:
            curr = curr.left
        else:
            return curr`,
      javascript: `var lowestCommonAncestor = function(root, p, q) {
    let curr = root;
    
    while (curr) {
        if (p.val > curr.val && q.val > curr.val) {
            curr = curr.right;
        } else if (p.val < curr.val && q.val < curr.val) {
            curr = curr.left;
        } else {
            return curr;
        }
    }
    return null;
};`,
      cpp: `TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
    TreeNode* curr = root;
    
    while (curr != NULL) {
        if (p->val > curr->val && q->val > curr->val) {
            curr = curr->right;
        } else if (p->val < curr->val && q->val < curr->val) {
            curr = curr->left;
        } else {
            return curr;
        }
    }
    return NULL;
}`,
      java: `public static TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
    TreeNode curr = root;
    
    while (curr != null) {
        if (p.val > curr.val && q.val > curr.val) {
            curr = curr.right;
        } else if (p.val < curr.val && q.val < curr.val) {
            curr = curr.left;
        } else {
            return curr;
        }
    }
    return null;
}`
    },
    solutionExplanation: `Due to BST properties, we can navigate towards the LCA efficiently. Start at root. If both \`p\` and \`q\` are greater than current node, the LCA must be in the right subtree. If both are smaller, it's in the left. If they diverge (one smaller, one larger) or one equals the current node, the current node is the LCA.`,
    testCases: [
      { id: 'tc-1', input: 'root=[6,2,8,0,4,7,9], p=2, q=8', expected: '6' },
      { id: 'tc-2', input: 'root=[6,2,8,0,4,7,9], p=2, q=4', expected: '2' },
      { id: 'tc-3', input: 'root=[2,1], p=2, q=1', expected: '2' }
    ]
  },
  {
    id: 'dsa-tb-06',
    number: 6,
    title: 'Binary Tree Level Order Traversal',
    slug: 'binary-tree-level-order-traversal',
    category: 'Trees & BST',
    difficulty: 'Medium',
    summary: 'Return level order traversal of tree nodes.',
    description: `Given the \`root\` of a binary tree, return *the level order traversal of its nodes' values*. (i.e., from left to right, level by level).`,
    examples: [
      {
        input: 'root = [3,9,20,null,null,15,7]',
        output: '[[3],[9,20],[15,7]]'
      }
    ],
    constraints: [
      'The number of nodes in the tree is in the range [0, 2000].',
      '-1000 <= Node.val <= 1000'
    ],
    keyPoints: [
      '**Brute Force**: DFS with depth tracking. Collect nodes by depth. Sort/Group afterwards.',
      '**Core Insight**: BFS with Queue. Process nodes level by level. For each level, dequeue all current nodes, record values, enqueue their children.',
      '**Edge Cases**: Empty tree, single node.',
      '**Space-Time Analysis**: O(N) time. O(W) space where W is max width of tree (up to N/2).'
    ],
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(N)',
    companies: ['Amazon', 'Microsoft', 'Google', 'Facebook'],
    starterCode: {
      python: `from collections import deque

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def build_tree(arr):
    if not arr or arr[0] is None: return None
    root = TreeNode(arr[0])
    queue = deque([root])
    i = 1
    while queue and i < len(arr):
        node = queue.popleft()
        if i < len(arr) and arr[i] is not None:
            node.left = TreeNode(arr[i])
            queue.append(node.left)
        i += 1
        if i < len(arr) and arr[i] is not None:
            node.right = TreeNode(arr[i])
            queue.append(node.right)
        i += 1
    return root

# TODO: Implement levelOrder
def levelOrder(root: TreeNode) -> list[list[int]]:
    pass

# Test Execution
if __name__ == "__main__":
    root = build_tree([3,9,20,None,None,15,7])
    print(levelOrder(root)) # Expected: [[3],[9,20],[15,7]]`,
      javascript: `class TreeNode {
    constructor(val = 0, left = null, right = null) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}

function buildTree(arr) {
    if (!arr.length || arr[0] === null) return null;
    const root = new TreeNode(arr[0]);
    const queue = [root];
    let i = 1;
    while (queue.length > 0 && i < arr.length) {
        const node = queue.shift();
        if (i < arr.length && arr[i] !== null) {
            node.left = new TreeNode(arr[i]);
            queue.push(node.left);
        }
        i++;
        if (i < arr.length && arr[i] !== null) {
            node.right = new TreeNode(arr[i]);
            queue.push(node.right);
        }
        i++;
    }
    return root;
}

// TODO: Implement levelOrder
var levelOrder = function(root) {
    
};

// Test Execution
const root = buildTree([3,9,20,null,null,15,7]);
console.log(JSON.stringify(levelOrder(root))); // Expected: [[3],[9,20],[15,7]]`,
      cpp: `#include <iostream>
#include <vector>
#include <queue>
using namespace std;

struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode(int x) : val(x), left(NULL), right(NULL) {}
};

TreeNode* buildTree(vector<int>& arr) {
    if (arr.empty() || arr[0] == INT_MIN) return nullptr;
    TreeNode* root = new TreeNode(arr[0]);
    queue<TreeNode*> q;
    q.push(root);
    int i = 1;
    while (!q.empty() && i < arr.size()) {
        TreeNode* node = q.front(); q.pop();
        if (i < arr.size() && arr[i] != INT_MIN) {
            node->left = new TreeNode(arr[i]);
            q.push(node->left);
        }
        i++;
        if (i < arr.size() && arr[i] != INT_MIN) {
            node->right = new TreeNode(arr[i]);
            q.push(node->right);
        }
        i++;
    }
    return root;
}

// TODO: Implement levelOrder
vector<vector<int>> levelOrder(TreeNode* root) {
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
    vector<int> arr = {3, 9, 20, INT_MIN, INT_MIN, 15, 7};
    TreeNode* root = buildTree(arr);
    printRes(levelOrder(root)); // Expected: [[3],[9,20],[15,7]]
    return 0;
}`,
      java: `import java.util.*;

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode(int x) { val = x; }
}

public class Solution {
    public static TreeNode buildTree(Integer[] arr) {
        if (arr == null || arr.length == 0 || arr[0] == null) return null;
        TreeNode root = new TreeNode(arr[0]);
        Queue<TreeNode> queue = new LinkedList<>();
        queue.add(root);
        int i = 1;
        while (!queue.isEmpty() && i < arr.length) {
            TreeNode node = queue.poll();
            if (i < arr.length && arr[i] != null) {
                node.left = new TreeNode(arr[i]);
                queue.add(node.left);
            }
            i++;
            if (i < arr.length && arr[i] != null) {
                node.right = new TreeNode(arr[i]);
                queue.add(node.right);
            }
            i++;
        }
        return root;
    }

    // TODO: Implement levelOrder
    public static List<List<Integer>> levelOrder(TreeNode root) {
        return new ArrayList<>();
    }

    public static void main(String[] args) {
        Integer[] arr = {3, 9, 20, null, null, 15, 7};
        TreeNode root = buildTree(arr);
        System.out.println(levelOrder(root)); // Expected: [[3], [9, 20], [15, 7]]
    }
}`
    },
    solutionCode: {
      python: `def levelOrder(root: TreeNode) -> list[list[int]]:
    if not root:
        return []
        
    res = []
    queue = deque([root])
    
    while queue:
        level_size = len(queue)
        current_level = []
        
        for _ in range(level_size):
            node = queue.popleft()
            current_level.append(node.val)
            
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
                
        res.append(current_level)
        
    return res`,
      javascript: `var levelOrder = function(root) {
    if (!root) return [];
    
    const res = [];
    const queue = [root];
    
    while (queue.length > 0) {
        const levelSize = queue.length;
        const currentLevel = [];
        
        for (let i = 0; i < levelSize; i++) {
            const node = queue.shift();
            currentLevel.push(node.val);
            
            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
        }
        
        res.push(currentLevel);
    }
    
    return res;
};`,
      cpp: `vector<vector<int>> levelOrder(TreeNode* root) {
    vector<vector<int>> res;
    if (root == NULL) return res;
    
    queue<TreeNode*> q;
    q.push(root);
    
    while (!q.empty()) {
        int levelSize = q.size();
        vector<int> currentLevel;
        
        for (int i = 0; i < levelSize; ++i) {
            TreeNode* node = q.front();
            q.pop();
            currentLevel.push_back(node->val);
            
            if (node->left) q.push(node->left);
            if (node->right) q.push(node->right);
        }
        
        res.push_back(currentLevel);
    }
    
    return res;
}`,
      java: `public static List<List<Integer>> levelOrder(TreeNode root) {
    List<List<Integer>> res = new ArrayList<>();
    if (root == null) return res;
    
    Queue<TreeNode> queue = new LinkedList<>();
    queue.add(root);
    
    while (!queue.isEmpty()) {
        int levelSize = queue.size();
        List<Integer> currentLevel = new ArrayList<>();
        
        for (int i = 0; i < levelSize; i++) {
            TreeNode node = queue.poll();
            currentLevel.add(node.val);
            
            if (node.left != null) queue.add(node.left);
            if (node.right != null) queue.add(node.right);
        }
        
        res.add(currentLevel);
    }
    
    return res;
}`
    },
    solutionExplanation: `We use Breadth-First Search (BFS) with a queue. We process the tree level by level. In each iteration of the outer loop, the queue contains exactly the nodes of the current level. We determine the size of the level, extract those nodes into a list, and add their children to the queue for the next level.`,
    testCases: [
      { id: 'tc-1', input: '[3,9,20,null,null,15,7]', expected: '[[3],[9,20],[15,7]]' },
      { id: 'tc-2', input: '[1]', expected: '[[1]]' },
      { id: 'tc-3', input: '[]', expected: '[]' }
    ]
  },
  {
    id: 'dsa-tb-07',
    number: 7,
    title: 'Validate Binary Search Tree',
    slug: 'validate-binary-search-tree',
    category: 'Trees & BST',
    difficulty: 'Medium',
    summary: 'Determine if a binary tree is a valid BST.',
    description: `Given the \`root\` of a binary tree, determine if it is a valid binary search tree (BST).\n\nA **valid BST** is defined as follows:\n* The left subtree of a node contains only nodes with keys **less than** the node's key.\n* The right subtree of a node contains only nodes with keys **greater than** the node's key.\n* Both the left and right subtrees must also be binary search trees.`,
    examples: [
      {
        input: 'root = [2,1,3]',
        output: 'true'
      },
      {
        input: 'root = [5,1,4,null,null,3,6]',
        output: 'false',
        explanation: 'The root node\'s value is 5, but its right child\'s value is 4.'
      }
    ],
    constraints: [
      'The number of nodes in the tree is in the range [1, 10^4].',
      '-2^31 <= Node.val <= 2^31 - 1'
    ],
    keyPoints: [
      '**Brute Force**: Check max of left subtree < root < min of right subtree. Recalculate max/min repeatedly. Time O(N^2).',
      '**Core Insight**: Range Validation. Pass down valid ranges (min, max) to each node. Left child must be < parent.val. Right child must be > parent.val. Update bounds accordingly.',
      '**Edge Cases**: Nodes with extreme values (Integer.MIN/MAX), deep skewed trees.',
      '**Space-Time Analysis**: O(N) time, O(H) space.'
    ],
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(H)',
    companies: ['Amazon', 'Microsoft', 'Google', 'Adobe'],
    starterCode: {
      python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def build_tree(arr):
    if not arr or arr[0] is None: return None
    root = TreeNode(arr[0])
    queue = [root]
    i = 1
    while queue and i < len(arr):
        node = queue.pop(0)
        if i < len(arr) and arr[i] is not None:
            node.left = TreeNode(arr[i])
            queue.append(node.left)
        i += 1
        if i < len(arr) and arr[i] is not None:
            node.right = TreeNode(arr[i])
            queue.append(node.right)
        i += 1
    return root

# TODO: Implement isValidBST
def isValidBST(root: TreeNode) -> bool:
    pass

# Test Execution
if __name__ == "__main__":
    root1 = build_tree([2,1,3])
    print(isValidBST(root1)) # Expected: True
    
    root2 = build_tree([5,1,4,None,None,3,6])
    print(isValidBST(root2)) # Expected: False`,
      javascript: `class TreeNode {
    constructor(val = 0, left = null, right = null) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}

function buildTree(arr) {
    if (!arr.length || arr[0] === null) return null;
    const root = new TreeNode(arr[0]);
    const queue = [root];
    let i = 1;
    while (queue.length > 0 && i < arr.length) {
        const node = queue.shift();
        if (i < arr.length && arr[i] !== null) {
            node.left = new TreeNode(arr[i]);
            queue.push(node.left);
        }
        i++;
        if (i < arr.length && arr[i] !== null) {
            node.right = new TreeNode(arr[i]);
            queue.push(node.right);
        }
        i++;
    }
    return root;
}

// TODO: Implement isValidBST
var isValidBST = function(root) {
    
};

// Test Execution
const root1 = buildTree([2,1,3]);
console.log(isValidBST(root1)); // Expected: true

const root2 = buildTree([5,1,4,null,null,3,6]);
console.log(isValidBST(root2)); // Expected: false`,
      cpp: `#include <iostream>
#include <vector>
#include <queue>
#include <climits>
using namespace std;

struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode(int x) : val(x), left(NULL), right(NULL) {}
};

TreeNode* buildTree(vector<long long>& arr) {
    if (arr.empty() || arr[0] == LLONG_MIN) return nullptr;
    TreeNode* root = new TreeNode((int)arr[0]);
    queue<TreeNode*> q;
    q.push(root);
    int i = 1;
    while (!q.empty() && i < arr.size()) {
        TreeNode* node = q.front(); q.pop();
        if (i < arr.size() && arr[i] != LLONG_MIN) {
            node->left = new TreeNode((int)arr[i]);
            q.push(node->left);
        }
        i++;
        if (i < arr.size() && arr[i] != LLONG_MIN) {
            node->right = new TreeNode((int)arr[i]);
            q.push(node->right);
        }
        i++;
    }
    return root;
}

// TODO: Implement isValidBST
bool isValidBST(TreeNode* root) {
    return false;
}

int main() {
    vector<long long> arr1 = {2, 1, 3};
    TreeNode* root1 = buildTree(arr1);
    cout << (isValidBST(root1) ? "true" : "false") << endl; // Expected: true
    
    vector<long long> arr2 = {5, 1, 4, LLONG_MIN, LLONG_MIN, 3, 6};
    TreeNode* root2 = buildTree(arr2);
    cout << (isValidBST(root2) ? "true" : "false") << endl; // Expected: false
    return 0;
}`,
      java: `import java.util.*;

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode(int x) { val = x; }
}

public class Solution {
    public static TreeNode buildTree(Long[] arr) {
        if (arr == null || arr.length == 0 || arr[0] == Long.MIN_VALUE) return null;
        TreeNode root = new TreeNode(arr[0].intValue());
        Queue<TreeNode> queue = new LinkedList<>();
        queue.add(root);
        int i = 1;
        while (!queue.isEmpty() && i < arr.length) {
            TreeNode node = queue.poll();
            if (i < arr.length && arr[i] != Long.MIN_VALUE) {
                node.left = new TreeNode(arr[i].intValue());
                queue.add(node.left);
            }
            i++;
            if (i < arr.length && arr[i] != Long.MIN_VALUE) {
                node.right = new TreeNode(arr[i].intValue());
                queue.add(node.right);
            }
            i++;
        }
        return root;
    }

    // TODO: Implement isValidBST
    public static boolean isValidBST(TreeNode root) {
        return false;
    }

    public static void main(String[] args) {
        Long[] arr1 = {2L, 1L, 3L};
        TreeNode root1 = buildTree(arr1);
        System.out.println(isValidBST(root1)); // Expected: true
        
        Long[] arr2 = {5L, 1L, 4L, Long.MIN_VALUE, Long.MIN_VALUE, 3L, 6L};
        TreeNode root2 = buildTree(arr2);
        System.out.println(isValidBST(root2)); // Expected: false
    }
}`
    },
    solutionCode: {
      python: `def isValidBST(root: TreeNode) -> bool:
    def validate(node, low=float('-inf'), high=float('inf')):
        if not node:
            return True
        
        if node.val <= low or node.val >= high:
            return False
            
        return (validate(node.left, low, node.val) and 
                validate(node.right, node.val, high))
                
    return validate(root)`,
      javascript: `var isValidBST = function(root) {
    function validate(node, low = -Infinity, high = Infinity) {
        if (!node) return true;
        
        if (node.val <= low || node.val >= high) {
            return false;
        }
        
        return (validate(node.left, low, node.val) && 
                validate(node.right, node.val, high));
    }
    
    return validate(root);
};`,
      cpp: `bool validate(TreeNode* node, long long low, long long high) {
    if (node == NULL) return true;
    
    if ((long long)node->val <= low || (long long)node->val >= high) {
        return false;
    }
    
    return validate(node->left, low, node->val) && 
           validate(node->right, node->val, high);
}

bool isValidBST(TreeNode* root) {
    return validate(root, LLONG_MIN, LLONG_MAX);
}`,
      java: `public static boolean isValidBST(TreeNode root) {
    return validate(root, Long.MIN_VALUE, Long.MAX_VALUE);
}

private static boolean validate(TreeNode node, long low, long high) {
    if (node == null) return true;
    
    if (node.val <= low || node.val >= high) {
        return false;
    }
    
    return validate(node.left, low, node.val) && 
           validate(node.right, node.val, high);
}`
    },
     solutionExplanation: "Checking only immediate children is insufficient because a violation might occur deeper in the tree (e.g., a node in the right subtree being smaller than an ancestor). We use a recursive helper that passes down the valid range (low, high) for the current node. Initially, the range is infinite. When going left, the upper bound becomes the current node's value. When going right, the lower bound becomes the current node's value.",
     testCases: [
      { id: 'tc-1', input: '[2,1,3]', expected: 'true' },
      { id: 'tc-2', input: '[5,1,4,null,null,3,6]', expected: 'false' },
      { id: 'tc-3', input: '[10,5,15,null,null,6,20]', expected: 'false' }
    ]
  },
  {
    id: 'dsa-tb-08',
    number: 8,
    title: 'Kth Smallest Element in a BST',
    slug: 'kth-smallest-element-in-a-bst',
    category: 'Trees & BST',
    difficulty: 'Medium',
    summary: 'Find the k-th smallest element in a BST.',
    description: `Given the \`root\` of a BST, and an integer \`k\`, return *the*\`\` k^{th}\`\` *smallest value (**1-indexed**) of all the nodes' values present in the BST*.`,
    examples: [
      {
        input: 'root = [3,1,4,null,2], k = 1',
        output: '1'
      },
      {
        input: 'root = [5,3,6,2,4,null,null,1], k = 3',
        output: '3'
      }
    ],
    constraints: [
      'The number of nodes in the tree is n.',
      '1 <= k <= n <= 10^4',
      '0 <= Node.val <= 10^4'
    ],
    keyPoints: [
      '**Brute Force**: In-order traversal to collect all elements in sorted array, pick k-1 index. Time O(N), Space O(N).',
      '**Core Insight**: Optimized In-Order Traversal. Stop early once k-th element is found. Count visited nodes during traversal.',
      '**Edge Cases**: k=1 (leftmost), k=N (rightmost).',
      '**Space-Time Analysis**: O(H+k) time roughly, but worst case O(N). O(H) space for stack/recursion.'
    ],
    timeComplexity: 'O(H + K)',
    spaceComplexity: 'O(H)',
    companies: ['Amazon', 'Microsoft', 'Google'],
    starterCode: {
      python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def build_tree(arr):
    if not arr or arr[0] is None: return None
    root = TreeNode(arr[0])
    queue = [root]
    i = 1
    while queue and i < len(arr):
        node = queue.pop(0)
        if i < len(arr) and arr[i] is not None:
            node.left = TreeNode(arr[i])
            queue.append(node.left)
        i += 1
        if i < len(arr) and arr[i] is not None:
            node.right = TreeNode(arr[i])
            queue.append(node.right)
        i += 1
    return root

# TODO: Implement kthSmallest
def kthSmallest(root: TreeNode, k: int) -> int:
    pass

# Test Execution
if __name__ == "__main__":
    root = build_tree([3,1,4,None,2])
    print(kthSmallest(root, 1)) # Expected: 1
    print(kthSmallest(root, 3)) # Expected: 3`,
      javascript: `class TreeNode {
    constructor(val = 0, left = null, right = null) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}

function buildTree(arr) {
    if (!arr.length || arr[0] === null) return null;
    const root = new TreeNode(arr[0]);
    const queue = [root];
    let i = 1;
    while (queue.length > 0 && i < arr.length) {
        const node = queue.shift();
        if (i < arr.length && arr[i] !== null) {
            node.left = new TreeNode(arr[i]);
            queue.push(node.left);
        }
        i++;
        if (i < arr.length && arr[i] !== null) {
            node.right = new TreeNode(arr[i]);
            queue.push(node.right);
        }
        i++;
    }
    return root;
}

// TODO: Implement kthSmallest
var kthSmallest = function(root, k) {
    
};

// Test Execution
const root = buildTree([3,1,4,null,2]);
console.log(kthSmallest(root, 1)); // Expected: 1
console.log(kthSmallest(root, 3)); // Expected: 3`,
      cpp: `#include <iostream>
#include <vector>
#include <queue>
using namespace std;

struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode(int x) : val(x), left(NULL), right(NULL) {}
};

TreeNode* buildTree(vector<int>& arr) {
    if (arr.empty() || arr[0] == INT_MIN) return nullptr;
    TreeNode* root = new TreeNode(arr[0]);
    queue<TreeNode*> q;
    q.push(root);
    int i = 1;
    while (!q.empty() && i < arr.size()) {
        TreeNode* node = q.front(); q.pop();
        if (i < arr.size() && arr[i] != INT_MIN) {
            node->left = new TreeNode(arr[i]);
            q.push(node->left);
        }
        i++;
        if (i < arr.size() && arr[i] != INT_MIN) {
            node->right = new TreeNode(arr[i]);
            q.push(node->right);
        }
        i++;
    }
    return root;
}

// TODO: Implement kthSmallest
int kthSmallest(TreeNode* root, int k) {
    return 0;
}

int main() {
    vector<int> arr = {3, 1, 4, INT_MIN, 2};
    TreeNode* root = buildTree(arr);
    cout << kthSmallest(root, 1) << endl; // Expected: 1
    cout << kthSmallest(root, 3) << endl; // Expected: 3
    return 0;
}`,
      java: `import java.util.*;

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode(int x) { val = x; }
}

public class Solution {
    public static TreeNode buildTree(Integer[] arr) {
        if (arr == null || arr.length == 0 || arr[0] == null) return null;
        TreeNode root = new TreeNode(arr[0]);
        Queue<TreeNode> queue = new LinkedList<>();
        queue.add(root);
        int i = 1;
        while (!queue.isEmpty() && i < arr.length) {
            TreeNode node = queue.poll();
            if (i < arr.length && arr[i] != null) {
                node.left = new TreeNode(arr[i]);
                queue.add(node.left);
            }
            i++;
            if (i < arr.length && arr[i] != null) {
                node.right = new TreeNode(arr[i]);
                queue.add(node.right);
            }
            i++;
        }
        return root;
    }

    // TODO: Implement kthSmallest
    public static int kthSmallest(TreeNode root, int k) {
        return 0;
    }

    public static void main(String[] args) {
        Integer[] arr = {3, 1, 4, null, 2};
        TreeNode root = buildTree(arr);
        System.out.println(kthSmallest(root, 1)); // Expected: 1
        System.out.println(kthSmallest(root, 3)); // Expected: 3
    }
}`
    },
    solutionCode: {
      python: `def kthSmallest(root: TreeNode, k: int) -> int:
    stack = []
    curr = root
    count = 0
    
    while curr or stack:
        while curr:
            stack.append(curr)
            curr = curr.left
            
        curr = stack.pop()
        count += 1
        if count == k:
            return curr.val
            
        curr = curr.right
        
    return -1`,
      javascript: `var kthSmallest = function(root, k) {
    const stack = [];
    let curr = root;
    let count = 0;
    
    while (curr || stack.length > 0) {
        while (curr) {
            stack.push(curr);
            curr = curr.left;
        }
        
        curr = stack.pop();
        count++;
        if (count === k) {
            return curr.val;
        }
        
        curr = curr.right;
    }
    
    return -1;
};`,
      cpp: `int kthSmallest(TreeNode* root, int k) {
    stack<TreeNode*> st;
    TreeNode* curr = root;
    int count = 0;
    
    while (curr != NULL || !st.empty()) {
        while (curr != NULL) {
            st.push(curr);
            curr = curr->left;
        }
        
        curr = st.top();
        st.pop();
        count++;
        if (count == k) {
            return curr->val;
        }
        
        curr = curr->right;
    }
    
    return -1;
}`,
      java: `public static int kthSmallest(TreeNode root, int k) {
    Deque<TreeNode> stack = new ArrayDeque<>();
    TreeNode curr = root;
    int count = 0;
    
    while (curr != null || !stack.isEmpty()) {
        while (curr != null) {
            stack.push(curr);
            curr = curr.left;
        }
        
        curr = stack.pop();
        count++;
        if (count == k) {
            return curr.val;
        }
        
        curr = curr.right;
    }
    
    return -1;
}`
    },
    solutionExplanation: `In-order traversal of a BST visits nodes in ascending sorted order. We simulate this iteratively using a stack. We push all left children onto the stack. Then we pop a node, increment our counter. If the counter equals \`k\`, we return that node's value. Otherwise, we move to its right child. This allows us to stop early without traversing the whole tree.`,
    testCases: [
      { id: 'tc-1', input: 'root=[3,1,4,null,2], k=1', expected: '1' },
      { id: 'tc-2', input: 'root=[5,3,6,2,4,null,null,1], k=3', expected: '3' },
      { id: 'tc-3', input: 'root=[2,1,3], k=2', expected: '2' }
    ]
  },
  {
    id: 'dsa-tb-09',
    number: 9,
    title: 'Binary Tree Maximum Path Sum',
    slug: 'binary-tree-maximum-path-sum',
    category: 'Trees & BST',
    difficulty: 'Hard',
    summary: 'Find the maximum path sum in a binary tree.',
    description: `A **path** in a binary tree is a sequence of nodes where each pair of adjacent nodes in the sequence has an edge connecting them. A node can only appear in the sequence **at most once**. Note that the path does not need to pass through the root.\n\nThe **path sum** of a path is the sum of the node's values in the path.\n\nGiven the \`root\` of a binary tree, return *the maximum **path sum** of any **non-empty** path*.`,
    examples: [
      {
        input: 'root = [1,2,3]',
        output: '6',
        explanation: 'Optimal path: 2 -> 1 -> 3. Sum = 6.'
      },
      {
        input: 'root = [-10,9,20,null,null,15,7]',
        output: '42',
        explanation: 'Optimal path: 15 -> 20 -> 7. Sum = 42.'
      }
    ],
    constraints: [
      'The number of nodes in the tree is in the range [1, 3 * 10^4].',
      '-1000 <= Node.val <= 1000'
    ],
    keyPoints: [
      '**Brute Force**: Try every possible path. Exponential time.',
      '**Core Insight**: Post-order DFS. For each node, calculate max gain from left and right subtrees. The max path passing *through* this node is \`node.val + max(0, leftGain) + max(0, rightGain)\`. Update global max. Return \`node.val + max(leftGain, rightGain)\` as contribution to parent.',
      '**Edge Cases**: All negative numbers (pick largest single node), single node.',
      '**Space-Time Analysis**: O(N) time, O(H) space.'
    ],
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(H)',
    companies: ['Amazon', 'Microsoft', 'Google', 'Uber'],
    starterCode: {
      python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def build_tree(arr):
    if not arr or arr[0] is None: return None
    root = TreeNode(arr[0])
    queue = [root]
    i = 1
    while queue and i < len(arr):
        node = queue.pop(0)
        if i < len(arr) and arr[i] is not None:
            node.left = TreeNode(arr[i])
            queue.append(node.left)
        i += 1
        if i < len(arr) and arr[i] is not None:
            node.right = TreeNode(arr[i])
            queue.append(node.right)
        i += 1
    return root

# TODO: Implement maxPathSum
def maxPathSum(root: TreeNode) -> int:
    pass

# Test Execution
if __name__ == "__main__":
    root1 = build_tree([1,2,3])
    print(maxPathSum(root1)) # Expected: 6
    
    root2 = build_tree([-10,9,20,None,None,15,7])
    print(maxPathSum(root2)) # Expected: 42`,
      javascript: `class TreeNode {
    constructor(val = 0, left = null, right = null) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}

function buildTree(arr) {
    if (!arr.length || arr[0] === null) return null;
    const root = new TreeNode(arr[0]);
    const queue = [root];
    let i = 1;
    while (queue.length > 0 && i < arr.length) {
        const node = queue.shift();
        if (i < arr.length && arr[i] !== null) {
            node.left = new TreeNode(arr[i]);
            queue.push(node.left);
        }
        i++;
        if (i < arr.length && arr[i] !== null) {
            node.right = new TreeNode(arr[i]);
            queue.push(node.right);
        }
        i++;
    }
    return root;
}

// TODO: Implement maxPathSum
var maxPathSum = function(root) {
    
};

// Test Execution
const root1 = buildTree([1,2,3]);
console.log(maxPathSum(root1)); // Expected: 6

const root2 = buildTree([-10,9,20,null,null,15,7]);
console.log(maxPathSum(root2)); // Expected: 42`,
      cpp: `#include <iostream>
#include <vector>
#include <queue>
#include <algorithm>
#include <climits>
using namespace std;

struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode(int x) : val(x), left(NULL), right(NULL) {}
};

TreeNode* buildTree(vector<int>& arr) {
    if (arr.empty() || arr[0] == INT_MIN) return nullptr;
    TreeNode* root = new TreeNode(arr[0]);
    queue<TreeNode*> q;
    q.push(root);
    int i = 1;
    while (!q.empty() && i < arr.size()) {
        TreeNode* node = q.front(); q.pop();
        if (i < arr.size() && arr[i] != INT_MIN) {
            node->left = new TreeNode(arr[i]);
            q.push(node->left);
        }
        i++;
        if (i < arr.size() && arr[i] != INT_MIN) {
            node->right = new TreeNode(arr[i]);
            q.push(node->right);
        }
        i++;
    }
    return root;
}

// TODO: Implement maxPathSum
int maxPathSum(TreeNode* root) {
    return 0;
}

int main() {
    vector<int> arr1 = {1, 2, 3};
    TreeNode* root1 = buildTree(arr1);
    cout << maxPathSum(root1) << endl; // Expected: 6
    
    vector<int> arr2 = {-10, 9, 20, INT_MIN, INT_MIN, 15, 7};
    TreeNode* root2 = buildTree(arr2);
    cout << maxPathSum(root2) << endl; // Expected: 42
    return 0;
}`,
      java: `import java.util.*;

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode(int x) { val = x; }
}

public class Solution {
    public static TreeNode buildTree(Integer[] arr) {
        if (arr == null || arr.length == 0 || arr[0] == null) return null;
        TreeNode root = new TreeNode(arr[0]);
        Queue<TreeNode> queue = new LinkedList<>();
        queue.add(root);
        int i = 1;
        while (!queue.isEmpty() && i < arr.length) {
            TreeNode node = queue.poll();
            if (i < arr.length && arr[i] != null) {
                node.left = new TreeNode(arr[i]);
                queue.add(node.left);
            }
            i++;
            if (i < arr.length && arr[i] != null) {
                node.right = new TreeNode(arr[i]);
                queue.add(node.right);
            }
            i++;
        }
        return root;
    }

    // TODO: Implement maxPathSum
    public static int maxPathSum(TreeNode root) {
        return 0;
    }

    public static void main(String[] args) {
        Integer[] arr1 = {1, 2, 3};
        TreeNode root1 = buildTree(arr1);
        System.out.println(maxPathSum(root1)); // Expected: 6
        
        Integer[] arr2 = {-10, 9, 20, null, null, 15, 7};
        TreeNode root2 = buildTree(arr2);
        System.out.println(maxPathSum(root2)); // Expected: 42
    }
}`
    },
    solutionCode: {
      python: `def maxPathSum(root: TreeNode) -> int:
    max_sum = float('-inf')
    
    def dfs(node):
        nonlocal max_sum
        if not node:
            return 0
            
        # Get max gain from left and right, ignore if negative
        left_gain = max(dfs(node.left), 0)
        right_gain = max(dfs(node.right), 0)
        
        # Price of new path starting and ending at this node (as peak)
        current_path_sum = node.val + left_gain + right_gain
        
        # Update global max
        max_sum = max(max_sum, current_path_sum)
        
        # Return max gain this node can contribute to parent
        return node.val + max(left_gain, right_gain)
        
    dfs(root)
    return max_sum`,
      javascript: `var maxPathSum = function(root) {
    let maxSum = -Infinity;
    
    function dfs(node) {
        if (!node) return 0;
        
        // Ignore negative contributions
        const leftGain = Math.max(dfs(node.left), 0);
        const rightGain = Math.max(dfs(node.right), 0);
        
        // Path passing through current node
        const currentPathSum = node.val + leftGain + rightGain;
        
        // Update global max
        maxSum = Math.max(maxSum, currentPathSum);
        
        // Return best single branch contribution to parent
        return node.val + Math.max(leftGain, rightGain);
    }
    
    dfs(root);
    return maxSum;
};`,
      cpp: `int maxSum = INT_MIN;

int dfs(TreeNode* node) {
    if (node == NULL) return 0;
    
    int leftGain = max(dfs(node->left), 0);
    int rightGain = max(dfs(node->right), 0);
    
    int currentPathSum = node->val + leftGain + rightGain;
    maxSum = max(maxSum, currentPathSum);
    
    return node->val + max(leftGain, rightGain);
}

int maxPathSum(TreeNode* root) {
    maxSum = INT_MIN;
    dfs(root);
    return maxSum;
}`,
      java: `static int maxSum;

public static int maxPathSum(TreeNode root) {
    maxSum = Integer.MIN_VALUE;
    dfs(root);
    return maxSum;
}

private static int dfs(TreeNode node) {
    if (node == null) return 0;
    
    int leftGain = Math.max(dfs(node.left), 0);
    int rightGain = Math.max(dfs(node.right), 0);
    
    int currentPathSum = node.val + leftGain + rightGain;
    maxSum = Math.max(maxSum, currentPathSum);
    
    return node.val + Math.max(leftGain, rightGain);
}`
    },
    solutionExplanation: `For each node, we consider it as the highest point (peak) of a potential path. The path can extend downwards to the left and/or right. We recursively get the maximum positive gain from left and right subtrees. The sum passing through the current node is \`node.val + leftGain + rightGain\`. We update the global maximum with this value. However, when returning to the parent, we can only take one branch (either left or right) plus the current node, so we return \`node.val + max(leftGain, rightGain)\`. Negative gains are clamped to 0.`,
    testCases: [
      { id: 'tc-1', input: '[1,2,3]', expected: '6' },
      { id: 'tc-2', input: '[-10,9,20,null,null,15,7]', expected: '42' },
      { id: 'tc-3', input: '[-3]', expected: '-3' }
    ]
  }
];
