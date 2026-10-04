import { DsaProblem } from './types';

export const GRAPHS_BFS_DFS_PROBLEMS: DsaProblem[] = [
  {
    id: 'dsa-gr-01',
    number: 1,
    title: 'Number of Islands',
    slug: 'number-of-islands',
    category: 'Graphs & BFS/DFS',
    difficulty: 'Medium',
    summary: 'Count the number of islands in a 2D grid.',
    description: `Given an \`m x n\` 2D binary grid \`grid\` which represents a map of \`'1'\` (land) and \`'0'\` (water), return *the number of islands*.\n\nAn **island** is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.`,
    examples: [
      {
        input: 'grid = [\n  ["1","1","1","1","0"],\n  ["1","1","0","1","0"],\n  ["1","1","0","0","0"],\n  ["0","0","0","0","0"]\n]',
        output: '1',
        explanation: 'One connected component of "1"s.'
      },
      {
        input: 'grid = [\n  ["1","1","0","0","0"],\n  ["1","1","0","0","0"],\n  ["0","0","1","0","0"],\n  ["0","0","0","1","1"]\n]',
        output: '3',
        explanation: 'Three separate components.'
      }
    ],
    constraints: [
      'm == grid.length',
      'n == grid[i].length',
      '1 <= m, n <= 300',
      'grid[i][j] is \'0\' or \'1\'.'
    ],
    keyPoints: [
      '**Brute Force**: Naive scanning without marking visited cells leads to infinite loops or double counting.',
      "**Core Insight**: DFS/BFS Flood Fill. Iterate through every cell. If it is land ('1'), increment count and launch DFS/BFS to mark all connected land as visited (change to '0' or use a visited set).",
      '**Edge Cases**: Empty grid, all water, all land, single row/column grids.',
      '**Space-Time Analysis**: O(M*N) time since each cell is visited once. O(M*N) space for recursion stack or queue in worst case.'
    ],
    timeComplexity: 'O(M*N)',
    spaceComplexity: 'O(M*N)',
    companies: ['Amazon', 'Microsoft', 'Google', 'Facebook'],
    starterCode: {
      python: `def numIslands(grid):
    # TODO: Implement DFS/BFS
    pass

# Test Execution
if __name__ == "__main__":
    grid1 = [
        ["1","1","1","1","0"],
        ["1","1","0","1","0"],
        ["1","1","0","0","0"],
        ["0","0","0","0","0"]
    ]
    print(numIslands(grid1)) # Expected: 1
    
    grid2 = [
        ["1","1","0","0","0"],
        ["1","1","0","0","0"],
        ["0","0","1","0","0"],
        ["0","0","0","1","1"]
    ]
    print(numIslands(grid2)) # Expected: 3`,
      javascript: `/**
 * @param {character[][]} grid
 * @return {number}
 */
var numIslands = function(grid) {
    // TODO: Implement DFS/BFS
};

// Test Execution
const grid1 = [
    ["1","1","1","1","0"],
    ["1","1","0","1","0"],
    ["1","1","0","0","0"],
    ["0","0","0","0","0"]
];
console.log(numIslands(grid1)); // Expected: 1

const grid2 = [
    ["1","1","0","0","0"],
    ["1","1","0","0","0"],
    ["0","0","1","0","0"],
    ["0","0","0","1","1"]
];
console.log(numIslands(grid2)); // Expected: 3`,
      cpp: `#include <vector>
#include <iostream>
using namespace std;

int numIslands(vector<vector<char>>& grid) {
    // TODO: Implement DFS/BFS
    return 0;
}

int main() {
    vector<vector<char>> grid1 = {
        {'1','1','1','1','0'},
        {'1','1','0','1','0'},
        {'1','1','0','0','0'},
        {'0','0','0','0','0'}
    };
    cout << numIslands(grid1) << endl; // Expected: 1
    
    vector<vector<char>> grid2 = {
        {'1','1','0','0','0'},
        {'1','1','0','0','0'},
        {'0','0','1','0','0'},
        {'0','0','0','1','1'}
    };
    cout << numIslands(grid2) << endl; // Expected: 3
    return 0;
}`,
      java: `import java.util.*;

public class Solution {
    public static int numIslands(char[][] grid) {
        // TODO: Implement DFS/BFS
        return 0;
    }

    public static void main(String[] args) {
        char[][] grid1 = {
            {'1','1','1','1','0'},
            {'1','1','0','1','0'},
            {'1','1','0','0','0'},
            {'0','0','0','0','0'}
        };
        System.out.println(numIslands(grid1)); // Expected: 1
        
        char[][] grid2 = {
            {'1','1','0','0','0'},
            {'1','1','0','0','0'},
            {'0','0','1','0','0'},
            {'0','0','0','1','1'}
        };
        System.out.println(numIslands(grid2)); // Expected: 3
    }
}`
    },
    solutionCode: {
      python: `def numIslands(grid):
    if not grid:
        return 0
        
    rows, cols = len(grid), len(grid[0])
    islands = 0
    
    def dfs(r, c):
        if r < 0 or c < 0 or r >= rows or c >= cols or grid[r][c] != '1':
            return
        
        grid[r][c] = '0' # Mark visited
        
        dfs(r + 1, c)
        dfs(r - 1, c)
        dfs(r, c + 1)
        dfs(r, c - 1)
        
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '1':
                islands += 1
                dfs(r, c)
                
    return islands`,
      javascript: `var numIslands = function(grid) {
    if (!grid || grid.length === 0) return 0;
    
    const rows = grid.length;
    const cols = grid[0].length;
    let islands = 0;
    
    const dfs = (r, c) => {
        if (r < 0 || c < 0 || r >= rows || c >= cols || grid[r][c] !== '1') {
            return;
        }
        
        grid[r][c] = '0'; // Mark visited
        
        dfs(r + 1, c);
        dfs(r - 1, c);
        dfs(r, c + 1);
        dfs(r, c - 1);
    };
    
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (grid[r][c] === '1') {
                islands++;
                dfs(r, c);
            }
        }
    }
    
    return islands;
};`,
      cpp: `void dfs(vector<vector<char>>& grid, int r, int c, int rows, int cols) {
    if (r < 0 || c < 0 || r >= rows || c >= cols || grid[r][c] != '1') {
        return;
    }
    
    grid[r][c] = '0'; // Mark visited
    
    dfs(grid, r + 1, c, rows, cols);
    dfs(grid, r - 1, c, rows, cols);
    dfs(grid, r, c + 1, rows, cols);
    dfs(grid, r, c - 1, rows, cols);
}

int numIslands(vector<vector<char>>& grid) {
    if (grid.empty()) return 0;
    
    int rows = grid.size();
    int cols = grid[0].size();
    int islands = 0;
    
    for (int r = 0; r < rows; ++r) {
        for (int c = 0; c < cols; ++c) {
            if (grid[r][c] == '1') {
                islands++;
                dfs(grid, r, c, rows, cols);
            }
        }
    }
    
    return islands;
}`,
      java: `public static int numIslands(char[][] grid) {
    if (grid == null || grid.length == 0) return 0;
    
    int rows = grid.length;
    int cols = grid[0].length;
    int islands = 0;
    
    for (int r = 0; r < rows; r++) {
        for (int c = 0; c < cols; c++) {
            if (grid[r][c] == '1') {
                islands++;
                dfs(grid, r, c, rows, cols);
            }
        }
    }
    
    return islands;
}

private static void dfs(char[][] grid, int r, int c, int rows, int cols) {
    if (r < 0 || c < 0 || r >= rows || c >= cols || grid[r][c] != '1') {
        return;
    }
    
    grid[r][c] = '0'; // Mark visited
    
    dfs(grid, r + 1, c, rows, cols);
    dfs(grid, r - 1, c, rows, cols);
    dfs(grid, r, c + 1, rows, cols);
    dfs(grid, r, c - 1, rows, cols);
}`
    },
    solutionExplanation: `We iterate through every cell in the grid. When we find a land cell ('1'), we increment our island counter and initiate a Depth First Search (DFS). The DFS recursively visits all adjacent land cells, marking them as visited (by changing them to '0'). This ensures that each connected component is counted exactly once.`,
    testCases: [
      { id: 'tc-1', input: '[["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]', expected: '1' },
      { id: 'tc-2', input: '[["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]', expected: '3' },
      { id: 'tc-3', input: '[["0"]]', expected: '0' }
    ]
  },
  {
    id: 'dsa-gr-02',
    number: 2,
    title: 'Max Area of Island',
    slug: 'max-area-of-island',
    category: 'Graphs & BFS/DFS',
    difficulty: 'Medium',
    summary: 'Find the maximum area of an island in a binary matrix.',
    description: `You are given an \`m x n\` binary matrix \`grid\`. An island is a group of \`1\`'s (representing land) connected **4-directionally** (horizontal or vertical.) You may assume all four edges of the grid are surrounded by water.\n\nThe **area** of an island is the number of cells with a value \`1\` in the island.\n\nReturn *the maximum area of an island in*\`\` grid\`\`. If there is no island, return \`0\`.`,
    examples: [
      {
        input: 'grid = [[0,0,1,0,0,0,0,1,0,0,0,0,0],[0,0,0,0,0,0,0,1,1,1,0,0,0],[0,1,1,0,1,0,0,0,0,0,0,0,0],[0,1,0,0,1,1,0,0,1,0,1,0,0],[0,1,0,0,1,1,0,0,1,1,1,0,0],[0,0,0,0,0,0,0,0,0,0,1,0,0],[0,0,0,0,0,0,0,1,1,1,0,0,0],[0,0,0,0,0,0,0,1,1,0,0,0,0]]',
        output: '6',
        explanation: 'Answer is not 11, because the island is not connected diagonally.'
      }
    ],
    constraints: [
      'm == grid.length',
      'n == grid[i].length',
      '1 <= m, n <= 50',
      'grid[i][j] is either 0 or 1.'
    ],
    keyPoints: [
      '**Brute Force**: Similar to Number of Islands, but instead of just counting components, sum the size of each component.',
      '**Core Insight**: DFS returning area. Modify the standard island DFS to return the count of nodes visited in that specific call chain. Take max of all returned areas.',
      '**Edge Cases**: No islands (return 0), multiple disjoint islands of different sizes.',
      '**Space-Time Analysis**: O(M*N) time, O(M*N) space for recursion stack.'
    ],
    timeComplexity: 'O(M*N)',
    spaceComplexity: 'O(M*N)',
    companies: ['Amazon', 'Microsoft', 'Google'],
    starterCode: {
      python: `def maxAreaOfIsland(grid):
    # TODO: Implement DFS returning area
    pass

# Test Execution
if __name__ == "__main__":
    grid = [
        [0,0,1,0,0,0,0,1,0,0,0,0,0],
        [0,0,0,0,0,0,0,1,1,1,0,0,0],
        [0,1,1,0,1,0,0,0,0,0,0,0,0],
        [0,1,0,0,1,1,0,0,1,0,1,0,0],
        [0,1,0,0,1,1,0,0,1,1,1,0,0],
        [0,0,0,0,0,0,0,0,0,0,1,0,0],
        [0,0,0,0,0,0,0,1,1,1,0,0,0],
        [0,0,0,0,0,0,0,1,1,0,0,0,0]
    ]
    print(maxAreaOfIsland(grid)) # Expected: 6`,
      javascript: `/**
 * @param {number[][]} grid
 * @return {number}
 */
var maxAreaOfIsland = function(grid) {
    // TODO: Implement DFS returning area
};

// Test Execution
const grid = [
    [0,0,1,0,0,0,0,1,0,0,0,0,0],
    [0,0,0,0,0,0,0,1,1,1,0,0,0],
    [0,1,1,0,1,0,0,0,0,0,0,0,0],
    [0,1,0,0,1,1,0,0,1,0,1,0,0],
    [0,1,0,0,1,1,0,0,1,1,1,0,0],
    [0,0,0,0,0,0,0,0,0,0,1,0,0],
    [0,0,0,0,0,0,0,1,1,1,0,0,0],
    [0,0,0,0,0,0,0,1,1,0,0,0,0]
];
console.log(maxAreaOfIsland(grid)); // Expected: 6`,
      cpp: `#include <vector>
#include <algorithm>
#include <iostream>
using namespace std;

int maxAreaOfIsland(vector<vector<int>>& grid) {
    // TODO: Implement DFS returning area
    return 0;
}

int main() {
    vector<vector<int>> grid = {
        {0,0,1,0,0,0,0,1,0,0,0,0,0},
        {0,0,0,0,0,0,0,1,1,1,0,0,0},
        {0,1,1,0,1,0,0,0,0,0,0,0,0},
        {0,1,0,0,1,1,0,0,1,0,1,0,0},
        {0,1,0,0,1,1,0,0,1,1,1,0,0},
        {0,0,0,0,0,0,0,0,0,0,1,0,0},
        {0,0,0,0,0,0,0,1,1,1,0,0,0},
        {0,0,0,0,0,0,0,1,1,0,0,0,0}
    };
    cout << maxAreaOfIsland(grid) << endl; // Expected: 6
    return 0;
}`,
      java: `import java.util.*;

public class Solution {
    public static int maxAreaOfIsland(int[][] grid) {
        // TODO: Implement DFS returning area
        return 0;
    }

    public static void main(String[] args) {
        int[][] grid = {
            {0,0,1,0,0,0,0,1,0,0,0,0,0},
            {0,0,0,0,0,0,0,1,1,1,0,0,0},
            {0,1,1,0,1,0,0,0,0,0,0,0,0},
            {0,1,0,0,1,1,0,0,1,0,1,0,0},
            {0,1,0,0,1,1,0,0,1,1,1,0,0},
            {0,0,0,0,0,0,0,0,0,0,1,0,0},
            {0,0,0,0,0,0,0,1,1,1,0,0,0},
            {0,0,0,0,0,0,0,1,1,0,0,0,0}
        };
        System.out.println(maxAreaOfIsland(grid)); // Expected: 6
    }
}`
    },
    solutionCode: {
      python: `def maxAreaOfIsland(grid):
    if not grid:
        return 0
        
    rows, cols = len(grid), len(grid[0])
    max_area = 0
    
    def dfs(r, c):
        if r < 0 or c < 0 or r >= rows or c >= cols or grid[r][c] != 1:
            return 0
            
        grid[r][c] = 0 # Mark visited
        
        area = 1
        area += dfs(r + 1, c)
        area += dfs(r - 1, c)
        area += dfs(r, c + 1)
        area += dfs(r, c - 1)
        
        return area
        
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == 1:
                max_area = max(max_area, dfs(r, c))
                
    return max_area`,
      javascript: `var maxAreaOfIsland = function(grid) {
    if (!grid || grid.length === 0) return 0;
    
    const rows = grid.length;
    const cols = grid[0].length;
    let maxArea = 0;
    
    const dfs = (r, c) => {
        if (r < 0 || c < 0 || r >= rows || c >= cols || grid[r][c] !== 1) {
            return 0;
        }
        
        grid[r][c] = 0; // Mark visited
        
        let area = 1;
        area += dfs(r + 1, c);
        area += dfs(r - 1, c);
        area += dfs(r, c + 1);
        area += dfs(r, c - 1);
        
        return area;
    };
    
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (grid[r][c] === 1) {
                maxArea = Math.max(maxArea, dfs(r, c));
            }
        }
    }
    
    return maxArea;
};`,
      cpp: `int dfs(vector<vector<int>>& grid, int r, int c, int rows, int cols) {
    if (r < 0 || c < 0 || r >= rows || c >= cols || grid[r][c] != 1) {
        return 0;
    }
    
    grid[r][c] = 0; // Mark visited
    
    int area = 1;
    area += dfs(grid, r + 1, c, rows, cols);
    area += dfs(grid, r - 1, c, rows, cols);
    area += dfs(grid, r, c + 1, rows, cols);
    area += dfs(grid, r, c - 1, rows, cols);
    
    return area;
}

int maxAreaOfIsland(vector<vector<int>>& grid) {
    if (grid.empty()) return 0;
    
    int rows = grid.size();
    int cols = grid[0].size();
    int maxArea = 0;
    
    for (int r = 0; r < rows; ++r) {
        for (int c = 0; c < cols; ++c) {
            if (grid[r][c] == 1) {
                maxArea = max(maxArea, dfs(grid, r, c, rows, cols));
            }
        }
    }
    
    return maxArea;
}`,
      java: `public static int maxAreaOfIsland(int[][] grid) {
    if (grid == null || grid.length == 0) return 0;
    
    int rows = grid.length;
    int cols = grid[0].length;
    int maxArea = 0;
    
    for (int r = 0; r < rows; r++) {
        for (int c = 0; c < cols; c++) {
            if (grid[r][c] == 1) {
                maxArea = Math.max(maxArea, dfs(grid, r, c, rows, cols));
            }
        }
    }
    
    return maxArea;
}

private static int dfs(int[][] grid, int r, int c, int rows, int cols) {
    if (r < 0 || c < 0 || r >= rows || c >= cols || grid[r][c] != 1) {
        return 0;
    }
    
    grid[r][c] = 0; // Mark visited
    
    int area = 1;
    area += dfs(grid, r + 1, c, rows, cols);
    area += dfs(grid, r - 1, c, rows, cols);
    area += dfs(grid, r, c + 1, rows, cols);
    area += dfs(grid, r, c - 1, rows, cols);
    
    return area;
}`
    },
    solutionExplanation: `Similar to counting islands, we traverse the grid. However, when we start a DFS on a land cell, the function returns the total number of cells visited in that connected component (the area). We keep track of the maximum area found across all components.`,
    testCases: [
      { id: 'tc-1', input: '[[1,1,0,0,0],[1,1,0,0,0],[0,0,0,1,1],[0,0,0,1,1]]', expected: '4' },
      { id: 'tc-2', input: '[[0,0,0,0]]', expected: '0' },
      { id: 'tc-3', input: '[[1]]', expected: '1' }
    ]
  },
  {
    id: 'dsa-gr-03',
    number: 3,
    title: 'Clone Graph',
    slug: 'clone-graph',
    category: 'Graphs & BFS/DFS',
    difficulty: 'Medium',
    summary: 'Return a deep copy of the graph.',
    description: `Given a reference of a node in a **connected** undirected graph, return *a copy (clone) of the graph*.\n\nEach node in the graph contains a value (\`int\`) and a list of its neighbors (\`List[Node]\`).`,
    examples: [
      {
        input: 'adjList = [[2,4],[1,3],[2,4],[1,3]]',
        output: '[[2,4],[1,3],[2,4],[1,3]]',
        explanation: 'Cloned graph has same structure.'
      }
    ],
    constraints: [
      'The number of nodes in the graph is in the range [0, 100].',
      '1 <= Node.val <= 100',
      'Node.val is unique for each node.',
      'There are no repeated edges and no self-loops in the graph.',
      'The Graph is connected and all nodes can be visited starting from the given node.'
    ],
    keyPoints: [
      '**Brute Force**: Copy nodes one by one without tracking connections properly leads to shallow copies or missing links.',
      '**Core Insight**: HashMap for Mapping. Use a map \`oldNode -> newNode\` to store clones. Traverse original graph via DFS/BFS. For each neighbor, if clone exists in map, link to it. Else, create clone, add to map, recurse.',
      '**Edge Cases**: Null node, single node with no neighbors, cyclic graphs.',
      '**Space-Time Analysis**: O(V+E) time. O(V) space for hash map and recursion stack.'
    ],
    timeComplexity: 'O(V+E)',
    spaceComplexity: 'O(V)',
    companies: ['Amazon', 'Meta', 'Google', 'LinkedIn'],
    starterCode: {
      python: `class Node:
    def __init__(self, val = 0, neighbors = None):
        self.val = val
        self.neighbors = neighbors if neighbors is not None else []

# TODO: Implement cloneGraph
def cloneGraph(node: 'Node') -> 'Node':
    pass

# Helper to build graph from adj list for testing
def build_graph(adj_list):
    if not adj_list: return None
    nodes = {}
    for i in range(len(adj_list)):
        nodes[i+1] = Node(i+1)
    for i, neighbors in enumerate(adj_list):
        nodes[i+1].neighbors = [nodes[n] for n in neighbors]
    return nodes[1]

# Helper to serialize graph to adj list for printing
def serialize(root):
    if not root: return []
    visited = {}
    order = []
    stack = [root]
    while stack:
        node = stack.pop()
        if node.val not in visited:
            visited[node.val] = node
            order.append(node.val)
            for nei in node.neighbors:
                if nei.val not in visited:
                    stack.append(nei)
    res = []
    for val in sorted(visited.keys()):
        neighbors_vals = sorted([n.val for n in visited[val].neighbors])
        res.append(neighbors_vals)
    return res

# Test Execution
if __name__ == "__main__":
    adj = [[2,4],[1,3],[2,4],[1,3]]
    original = build_graph(adj)
    cloned = cloneGraph(original)
    print(serialize(cloned)) # Expected: [[2,4],[1,3],[2,4],[1,3]]`,
      javascript: `class Node {
    constructor(val = 0, neighbors = []) {
        this.val = val;
        this.neighbors = neighbors;
    }
}

// TODO: Implement cloneGraph
var cloneGraph = function(node) {
    
};

// Helpers
function buildGraph(adjList) {
    if (!adjList.length) return null;
    const nodes = {};
    for (let i = 0; i < adjList.length; i++) {
        nodes[i + 1] = new Node(i + 1);
    }
    for (let i = 0; i < adjList.length; i++) {
        nodes[i + 1].neighbors = adjList[i].map(n => nodes[n]);
    }
    return nodes[1];
}

function serialize(root) {
    if (!root) return [];
    const visited = {};
    const order = [];
    const stack = [root];
    while (stack.length > 0) {
        const node = stack.pop();
        if (!(node.val in visited)) {
            visited[node.val] = node;
            order.push(node.val);
            for (const nei of node.neighbors) {
                if (!(nei.val in visited)) {
                    stack.push(nei);
                }
            }
        }
    }
    const keys = Object.keys(visited).map(Number).sort((a,b)=>a-b);
    return keys.map(k => visited[k].neighbors.map(n => n.val).sort((a,b)=>a-b));
}

// Test Execution
const adj = [[2,4],[1,3],[2,4],[1,3]];
const original = buildGraph(adj);
const cloned = cloneGraph(original);
console.log(JSON.stringify(serialize(cloned))); // Expected: [[2,4],[1,3],[2,4],[1,3]]`,
      cpp: `#include <vector>
#include <unordered_map>
#include <iostream>
#include <algorithm>
using namespace std;

class Node {
public:
    int val;
    vector<Node*> neighbors;
    Node() {
        val = 0;
        neighbors = vector<Node*>();
    }
    Node(int _val) {
        val = _val;
        neighbors = vector<Node*>();
    }
    Node(int _val, vector<Node*> _neighbors) {
        val = _val;
        neighbors = _neighbors;
    }
};

// TODO: Implement cloneGraph
Node* cloneGraph(Node* node) {
    return nullptr;
}

// Helpers for testing
Node* buildGraph(vector<vector<int>>& adjList) {
    if (adjList.empty()) return nullptr;
    unordered_map<int, Node*> nodes;
    for (int i = 0; i < adjList.size(); ++i) {
        nodes[i + 1] = new Node(i + 1);
    }
    for (int i = 0; i < adjList.size(); ++i) {
        for (int neighborVal : adjList[i]) {
            nodes[i + 1]->neighbors.push_back(nodes[neighborVal]);
        }
    }
    return nodes[1];
}

vector<vector<int>> serialize(Node* root) {
    if (!root) return {};
    unordered_map<int, Node*> visited;
    vector<int> order;
    vector<Node*> stack = {root};
    while (!stack.empty()) {
        Node* node = stack.back();
        stack.pop_back();
        if (visited.find(node->val) == visited.end()) {
            visited[node->val] = node;
            order.push_back(node->val);
            for (Node* nei : node->neighbors) {
                if (visited.find(nei->val) == visited.end()) {
                    stack.push_back(nei);
                }
            }
        }
    }
    sort(order.begin(), order.end());
    vector<vector<int>> res;
    for (int val : order) {
        vector<int> neighborsVals;
        for (Node* nei : visited[val]->neighbors) {
            neighborsVals.push_back(nei->val);
        }
        sort(neighborsVals.begin(), neighborsVals.end());
        res.push_back(neighborsVals);
    }
    return res;
}

int main() {
    vector<vector<int>> adj = {{2,4},{1,3},{2,4},{1,3}};
    Node* original = buildGraph(adj);
    Node* cloned = cloneGraph(original);
    auto res = serialize(cloned);
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
    cout << "]" << endl; // Expected: [[2,4],[1,3],[2,4],[1,3]]
    return 0;
}`,
      java: `import java.util.*;

class Node {
    public int val;
    public List<Node> neighbors;
    public Node() {
        val = 0;
        neighbors = new ArrayList<Node>();
    }
    public Node(int _val) {
        val = _val;
        neighbors = new ArrayList<Node>();
    }
    public Node(int _val, ArrayList<Node> _neighbors) {
        val = _val;
        neighbors = _neighbors;
    }
}

public class Solution {
    // TODO: Implement cloneGraph
    public static Node cloneGraph(Node node) {
        return null;
    }

    // Helpers
    public static Node buildGraph(List<List<Integer>> adjList) {
        if (adjList.isEmpty()) return null;
        Map<Integer, Node> nodes = new HashMap<>();
        for (int i = 0; i < adjList.size(); i++) {
            nodes.put(i + 1, new Node(i + 1));
        }
        for (int i = 0; i < adjList.size(); i++) {
            for (int neighborVal : adjList.get(i)) {
                nodes.get(i + 1).neighbors.add(nodes.get(neighborVal));
            }
        }
        return nodes.get(1);
    }

    public static List<List<Integer>> serialize(Node root) {
        if (root == null) return new ArrayList<>();
        Map<Integer, Node> visited = new HashMap<>();
        List<Integer> order = new ArrayList<>();
        Deque<Node> stack = new ArrayDeque<>();
        stack.push(root);
        while (!stack.isEmpty()) {
            Node node = stack.pop();
            if (!visited.containsKey(node.val)) {
                visited.put(node.val, node);
                order.add(node.val);
                for (Node nei : node.neighbors) {
                    if (!visited.containsKey(nei.val)) {
                        stack.push(nei);
                    }
                }
            }
        }
        Collections.sort(order);
        List<List<Integer>> res = new ArrayList<>();
        for (int val : order) {
            List<Integer> neighborsVals = new ArrayList<>();
            for (Node nei : visited.get(val).neighbors) {
                neighborsVals.add(nei.val);
            }
            Collections.sort(neighborsVals);
            res.add(neighborsVals);
        }
        return res;
    }

    public static void main(String[] args) {
        List<List<Integer>> adj = Arrays.asList(
            Arrays.asList(2, 4),
            Arrays.asList(1, 3),
            Arrays.asList(2, 4),
            Arrays.asList(1, 3)
        );
        Node original = buildGraph(adj);
        Node cloned = cloneGraph(original);
        System.out.println(serialize(cloned)); // Expected: [[2, 4], [1, 3], [2, 4], [1, 3]]
    }
}`
    },
    solutionCode: {
      python: `def cloneGraph(node: 'Node') -> 'Node':
    if not node:
        return None
        
    oldToNew = {}
    
    def dfs(curr):
        if curr in oldToNew:
            return oldToNew[curr]
            
        clone = Node(curr.val)
        oldToNew[curr] = clone
        
        for nei in curr.neighbors:
            clone.neighbors.append(dfs(nei))
            
        return clone
        
    return dfs(node)`,
      javascript: `var cloneGraph = function(node) {
    if (!node) return null;
    
    const oldToNew = new Map();
    
    const dfs = (curr) => {
        if (oldToNew.has(curr)) {
            return oldToNew.get(curr);
        }
        
        const clone = new Node(curr.val);
        oldToNew.set(curr, clone);
        
        for (const nei of curr.neighbors) {
            clone.neighbors.push(dfs(nei));
        }
        
        return clone;
    };
    
    return dfs(node);
};`,
      cpp: `unordered_map<Node*, Node*> oldToNew;

Node* dfs(Node* curr) {
    if (oldToNew.find(curr) != oldToNew.end()) {
        return oldToNew[curr];
    }
    
    Node* clone = new Node(curr->val);
    oldToNew[curr] = clone;
    
    for (Node* nei : curr->neighbors) {
        clone->neighbors.push_back(dfs(nei));
    }
    
    return clone;
}

Node* cloneGraph(Node* node) {
    if (node == NULL) return NULL;
    oldToNew.clear();
    return dfs(node);
}`,
      java: `Map<Node, Node> oldToNew = new HashMap<>();

public static Node cloneGraph(Node node) {
    if (node == null) return null;
    oldToNew.clear();
    return dfs(node);
}

private static Node dfs(Node curr) {
    if (oldToNew.containsKey(curr)) {
        return oldToNew.get(curr);
    }
    
    Node clone = new Node(curr.val);
    oldToNew.put(curr, clone);
    
    for (Node nei : curr.neighbors) {
        clone.neighbors.add(dfs(nei));
    }
    
    return clone;
}`
    },
    solutionExplanation: `We use a Hash Map to keep track of already cloned nodes to prevent infinite loops in cycles and ensure we don't duplicate nodes. We perform a DFS traversal. For each node, if it hasn't been cloned yet, we create a new node, store it in the map, and recursively clone its neighbors. The result is a structurally identical but independent copy of the graph.`,
    testCases: [
      { id: 'tc-1', input: '[[2,4],[1,3],[2,4],[1,3]]', expected: '[[2,4],[1,3],[2,4],[1,3]]' },
      { id: 'tc-2', input: '[]', expected: '[]' },
      { id: 'tc-3', input: '[[2],[1]]', expected: '[[2],[1]]' }
    ]
  },
  {
    id: 'dsa-gr-04',
    number: 4,
    title: 'Pacific Atlantic Water Flow',
    slug: 'pacific-atlantic-water-flow',
    category: 'Graphs & BFS/DFS',
    difficulty: 'Medium',
    summary: 'Find cells where water can flow to both oceans.',
    description: `There is an \`m x n\` rectangular island that borders both the **Pacific Ocean** and **Atlantic Ocean**. The Pacific Ocean touches the island's left and top edges, and the Atlantic Ocean touches the island's right and bottom edges.\n\nThe island is partitioned into a grid of square cells. You are given an \`m x n\` integer matrix \`heights\` where \`heights[r][c]\` represents the height above sea level of the cell at coordinate \`(r, c)\`.\n\nThe island receives a lot of rain, and the rain water can flow to neighboring cells directly north, south, east, and west if the neighboring cell's height is **less than or equal to** the current cell's height. Water can flow from any cell adjacent to an ocean into the ocean.\n\nReturn *a **list** of grid coordinates*\`\` result\`\` *where*\`\` result[i] = [ri, ci]\`\` *denotes that rain water can flow from cell*\`\` (ri, ci)\`\` *to **both** the Pacific and Atlantic oceans*.`,
    examples: [
      {
        input: 'heights = [[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]',
        output: '[[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]'
      }
    ],
    constraints: [
      'm == heights.length',
      'n == heights[r].length',
      '1 <= m, n <= 200',
      '0 <= heights[r][c] <= 10^5'
    ],
    keyPoints: [
      '**Brute Force**: For each cell, check if it can reach Pacific AND Atlantic separately. Time O(M*N*(M+N)). Too slow.',
      '**Core Insight**: Reverse Flow / Multi-source BFS/DFS. Start from the oceans and move inland to higher/equal ground. Cells reachable from Pacific are marked. Cells reachable from Atlantic are marked. Intersection is the answer.',
      '**Edge Cases**: Single row/col, uniform heights.',
      '**Space-Time Analysis**: O(M*N) time. O(M*N) space for visited sets/matrices.'
    ],
    timeComplexity: 'O(M*N)',
    spaceComplexity: 'O(M*N)',
    companies: ['Amazon', 'Microsoft', 'Google', 'Uber'],
    starterCode: {
      python: `def pacificAtlantic(heights):
    # TODO: Implement reverse BFS/DFS from oceans
    pass

# Test Execution
if __name__ == "__main__":
    heights = [
        [1,2,2,3,5],
        [3,2,3,4,4],
        [2,4,5,3,1],
        [6,7,1,4,5],
        [5,1,1,2,4]
    ]
    print(pacificAtlantic(heights)) # Expected: list of coords`,
      javascript: `/**
 * @param {number[][]} heights
 * @return {number[][]}
 */
var pacificAtlantic = function(heights) {
    // TODO: Implement reverse BFS/DFS from oceans
};

// Test Execution
const heights = [
    [1,2,2,3,5],
    [3,2,3,4,4],
    [2,4,5,3,1],
    [6,7,1,4,5],
    [5,1,1,2,4]
];
console.log(JSON.stringify(pacificAtlantic(heights))); // Expected: list of coords`,
      cpp: `#include <vector>
#include <iostream>
using namespace std;

vector<vector<int>> pacificAtlantic(vector<vector<int>>& heights) {
    // TODO: Implement reverse BFS/DFS from oceans
    return {};
}

void printRes(const vector<vector<int>>& res) {
    cout << "[";
    for(size_t i=0; i<res.size(); ++i) {
        cout << "[" << res[i][0] << "," << res[i][1] << "]";
        if(i < res.size()-1) cout << ",";
    }
    cout << "]" << endl;
}

int main() {
    vector<vector<int>> heights = {
        {1,2,2,3,5},
        {3,2,3,4,4},
        {2,4,5,3,1},
        {6,7,1,4,5},
        {5,1,1,2,4}
    };
    printRes(pacificAtlantic(heights)); 
    return 0;
}`,
      java: `import java.util.*;

public class Solution {
    public static List<List<Integer>> pacificAtlantic(int[][] heights) {
        // TODO: Implement reverse BFS/DFS from oceans
        return new ArrayList<>();
    }

    public static void main(String[] args) {
        int[][] heights = {
            {1,2,2,3,5},
            {3,2,3,4,4},
            {2,4,5,3,1},
            {6,7,1,4,5},
            {5,1,1,2,4}
        };
        System.out.println(pacificAtlantic(heights));
    }
}`
    },
    solutionCode: {
      python: `def pacificAtlantic(heights):
    if not heights or not heights[0]:
        return []
        
    m, n = len(heights), len(heights[0])
    pacific_reachable = [[False]*n for _ in range(m)]
    atlantic_reachable = [[False]*n for _ in range(m)]
    
    def bfs(start_r, start_c, reachable):
        queue = [(start_r, start_c)]
        reachable[start_r][start_c] = True
        directions = [(0,1), (0,-1), (1,0), (-1,0)]
        
        while queue:
            r, c = queue.pop(0)
            for dr, dc in directions:
                nr, nc = r + dr, c + dc
                if 0 <= nr < m and 0 <= nc < n and not reachable[nr][nc] and heights[nr][nc] >= heights[r][c]:
                    reachable[nr][nc] = True
                    queue.append((nr, nc))
                    
    # Pacific (Top and Left edges)
    for i in range(m):
        bfs(i, 0, pacific_reachable)
    for j in range(n):
        bfs(0, j, pacific_reachable)
        
    # Atlantic (Bottom and Right edges)
    for i in range(m):
        bfs(i, n-1, atlantic_reachable)
    for j in range(n):
        bfs(m-1, j, atlantic_reachable)
        
    res = []
    for i in range(m):
        for j in range(n):
            if pacific_reachable[i][j] and atlantic_reachable[i][j]:
                res.append([i, j])
                
    return res`,
      javascript: `var pacificAtlantic = function(heights) {
    if (!heights || !heights[0]) return [];
    
    const m = heights.length;
    const n = heights[0].length;
    const pacificReachable = Array.from({ length: m }, () => Array(n).fill(false));
    const atlanticReachable = Array.from({ length: m }, () => Array(n).fill(false));
    
    const bfs = (startR, startC, reachable) => {
        const queue = [[startR, startC]];
        reachable[startR][startC] = true;
        const dirs = [[0,1], [0,-1], [1,0], [-1,0]];
        
        while (queue.length > 0) {
            const [r, c] = queue.shift();
            for (const [dr, dc] of dirs) {
                const nr = r + dr;
                const nc = c + dc;
                if (nr >= 0 && nr < m && nc >= 0 && nc < n && !reachable[nr][nc] && heights[nr][nc] >= heights[r][c]) {
                    reachable[nr][nc] = true;
                    queue.push([nr, nc]);
                }
            }
        }
    };
    
    // Pacific
    for (let i = 0; i < m; i++) bfs(i, 0, pacificReachable);
    for (let j = 0; j < n; j++) bfs(0, j, pacificReachable);
    
    // Atlantic
    for (let i = 0; i < m; i++) bfs(i, n - 1, atlanticReachable);
    for (let j = 0; j < n; j++) bfs(m - 1, j, atlanticReachable);
    
    const res = [];
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (pacificReachable[i][j] && atlanticReachable[i][j]) {
                res.push([i, j]);
            }
        }
    }
    
    return res;
};`,
      cpp: `#include <vector>
#include <queue>
using namespace std;

void bfs(vector<vector<int>>& heights, int r, int c, vector<vector<bool>>& reachable) {
    int m = heights.size();
    int n = heights[0].size();
    queue<pair<int,int>> q;
    q.push({r, c});
    reachable[r][c] = true;
    
    int dirs[4][2] = {{0,1}, {0,-1}, {1,0}, {-1,0}};
    
    while (!q.empty()) {
        auto [cr, cc] = q.front(); q.pop();
        for (auto& d : dirs) {
            int nr = cr + d[0];
            int nc = cc + d[1];
            if (nr >= 0 && nr < m && nc >= 0 && nc < n && !reachable[nr][nc] && heights[nr][nc] >= heights[cr][cc]) {
                reachable[nr][nc] = true;
                q.push({nr, nc});
            }
        }
    }
}

vector<vector<int>> pacificAtlantic(vector<vector<int>>& heights) {
    if (heights.empty() || heights[0].empty()) return {};
    
    int m = heights.size();
    int n = heights[0].size();
    vector<vector<bool>> pacific(m, vector<bool>(n, false));
    vector<vector<bool>> atlantic(m, vector<bool>(n, false));
    
    // Pacific
    for (int i = 0; i < m; i++) bfs(heights, i, 0, pacific);
    for (int j = 0; j < n; j++) bfs(heights, 0, j, pacific);
    
    // Atlantic
    for (int i = 0; i < m; i++) bfs(heights, i, n - 1, atlantic);
    for (int j = 0; j < n; j++) bfs(heights, m - 1, j, atlantic);
    
    vector<vector<int>> res;
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            if (pacific[i][j] && atlantic[i][j]) {
                res.push_back({i, j});
            }
        }
    }
    
    return res;
}`,
      java: `import java.util.*;

public static void bfs(int[][] heights, int r, int c, boolean[][] reachable) {
    int m = heights.length;
    int n = heights[0].length;
    Queue<int[]> queue = new LinkedList<>();
    queue.offer(new int[]{r, c});
    reachable[r][c] = true;
    
    int[][] dirs = {{0,1}, {0,-1}, {1,0}, {-1,0}};
    
    while (!queue.isEmpty()) {
        int[] curr = queue.poll();
        for (int[] d : dirs) {
            int nr = curr[0] + d[0];
            int nc = curr[1] + d[1];
            if (nr >= 0 && nr < m && nc >= 0 && nc < n && !reachable[nr][nc] && heights[nr][nc] >= heights[curr[0]][curr[1]]) {
                reachable[nr][nc] = true;
                queue.offer(new int[]{nr, nc});
            }
        }
    }
}

public static List<List<Integer>> pacificAtlantic(int[][] heights) {
    List<List<Integer>> res = new ArrayList<>();
    if (heights == null || heights.length == 0 || heights[0].length == 0) return res;
    
    int m = heights.length;
    int n = heights[0].length;
    boolean[][] pacific = new boolean[m][n];
    boolean[][] atlantic = new boolean[m][n];
    
    // Pacific
    for (int i = 0; i < m; i++) bfs(heights, i, 0, pacific);
    for (int j = 0; j < n; j++) bfs(heights, 0, j, pacific);
    
    // Atlantic
    for (int i = 0; i < m; i++) bfs(heights, i, n - 1, atlantic);
    for (int j = 0; j < n; j++) bfs(heights, m - 1, j, atlantic);
    
    for (int i = 0; i < m; i++) {
        for (int j = 0; j < n; j++) {
            if (pacific[i][j] && atlantic[i][j]) {
                res.add(Arrays.asList(i, j));
            }
        }
    }
    
    return res;
}`
    },
    solutionExplanation: `Instead of checking flow from each cell to the ocean, we reverse the problem. We start BFS/DFS from the ocean boundaries (Pacific: top/left, Atlantic: bottom/right) moving inland to cells with greater or equal height. Any cell reached from Pacific is marked. Any cell reached from Atlantic is marked. Cells marked by both can drain to both oceans.`,
    testCases: [
      { id: 'tc-1', input: '[[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]', expected: '[[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]' },
      { id: 'tc-2', input: '[[1]]', expected: '[[0,0]]' },
      { id: 'tc-3', input: '[[1,2,3],[8,9,4],[7,6,5]]', expected: '[[0,2],[1,1],[2,0]]' }
    ]
  },
  {
    id: 'dsa-gr-05',
    number: 5,
    title: 'Course Schedule',
    slug: 'course-schedule',
    category: 'Graphs & BFS/DFS',
    difficulty: 'Medium',
    summary: 'Determine if you can finish all courses given prerequisites.',
    description: `There are a total of \`numCourses\` courses you are taking. Some courses may have prerequisites, for example to take course 0 you have to first take course 1, which is expressed as a pair: \`[1, 0]\`.\n\nGiven the total number of courses and a list of prerequisite pairs, is it possible for you to finish all courses?`,
    examples: [
      {
        input: 'numCourses = 2, prerequisites = [[1,0]]',
        output: 'true',
        explanation: 'Take 0 then 1.'
      },
      {
        input: 'numCourses = 2, prerequisites = [[1,0],[0,1]]',
        output: 'false',
        explanation: 'Circular dependency.'
      }
    ],
    constraints: [
      '1 <= numCourses <= 2000',
      '0 <= prerequisites.length <= 5000',
      'prerequisites[i].length == 2',
      '0 <= ai, bi < numCourses',
      'All the pairs prerequisites[i] are unique.'
    ],
    keyPoints: [
      '**Brute Force**: Try all permutations of courses. Factorial time.',
      "**Core Insight**: Topological Sort / Cycle Detection. Represent courses as a Directed Graph. If the graph has a cycle, completion is impossible. Use Kahn's Algorithm (BFS indegree) or DFS coloring to detect cycles.",
      '**Edge Cases**: No prerequisites (always true), disconnected components.',
      '**Space-Time Analysis**: O(V+E) time, O(V+E) space.'
    ],
    timeComplexity: 'O(V+E)',
    spaceComplexity: 'O(V+E)',
    companies: ['Amazon', 'Microsoft', 'Google', 'Facebook'],
    starterCode: {
      python: `def canFinish(numCourses, prerequisites):
    # TODO: Implement Topological Sort
    pass

# Test Execution
if __name__ == "__main__":
    print(canFinish(2, [[1,0]]))       # Expected: True
    print(canFinish(2, [[1,0],[0,1]])) # Expected: False`,
      javascript: `/**
 * @param {number} numCourses
 * @param {number[][]} prerequisites
 * @return {boolean}
 */
var canFinish = function(numCourses, prerequisites) {
    // TODO: Implement Topological Sort
};

// Test Execution
console.log(canFinish(2, [[1,0]]));       // Expected: true
console.log(canFinish(2, [[1,0],[0,1]])); // Expected: false`,
      cpp: `#include <vector>
#include <iostream>
using namespace std;

bool canFinish(int numCourses, vector<vector<int>>& prerequisites) {
    // TODO: Implement Topological Sort
    return false;
}

int main() {
    cout << (canFinish(2, {{1,0}}) ? "true" : "false") << endl;       // Expected: true
    cout << (canFinish(2, {{1,0},{0,1}}) ? "true" : "false") << endl; // Expected: false
    return 0;
}`,
      java: `import java.util.*;

public class Solution {
    public static boolean canFinish(int numCourses, int[][] prerequisites) {
        // TODO: Implement Topological Sort
        return false;
    }

    public static void main(String[] args) {
        System.out.println(canFinish(2, new int[][]{{1,0}}));       // Expected: true
        System.out.println(canFinish(2, new int[][]{{1,0},{0,1}})); // Expected: false
    }
}`
    },
    solutionCode: {
      python: `from collections import defaultdict, deque

def canFinish(numCourses, prerequisites):
    graph = defaultdict(list)
    indegree = [0] * numCourses
    
    for u, v in prerequisites:
        graph[u].append(v)
        indegree[v] += 1
        
    queue = deque([i for i in range(numCourses) if indegree[i] == 0])
    taken = 0
    
    while queue:
        course = queue.popleft()
        taken += 1
        for neighbor in graph[course]:
            indegree[neighbor] -= 1
            if indegree[neighbor] == 0:
                queue.append(neighbor)
                
    return taken == numCourses`,
      javascript: `var canFinish = function(numCourses, prerequisites) {
    const graph = Array.from({ length: numCourses }, () => []);
    const indegree = new Array(numCourses).fill(0);
    
    for (const [u, v] of prerequisites) {
        graph[u].push(v);
        indegree[v]++;
    }
    
    const queue = [];
    for (let i = 0; i < numCourses; i++) {
        if (indegree[i] === 0) queue.push(i);
    }
    
    let taken = 0;
    while (queue.length > 0) {
        const course = queue.shift();
        taken++;
        for (const neighbor of graph[course]) {
            indegree[neighbor]--;
            if (indegree[neighbor] === 0) {
                queue.push(neighbor);
            }
        }
    }
    
    return taken === numCourses;
};`,
      cpp: `#include <vector>
#include <queue>
using namespace std;

bool canFinish(int numCourses, vector<vector<int>>& prerequisites) {
    vector<vector<int>> graph(numCourses);
    vector<int> indegree(numCourses, 0);
    
    for (const auto& p : prerequisites) {
        graph[p[0]].push_back(p[1]);
        indegree[p[1]]++;
    }
    
    queue<int> q;
    for (int i = 0; i < numCourses; ++i) {
        if (indegree[i] == 0) q.push(i);
    }
    
    int taken = 0;
    while (!q.empty()) {
        int course = q.front(); q.pop();
        taken++;
        for (int neighbor : graph[course]) {
            if (--indegree[neighbor] == 0) {
                q.push(neighbor);
            }
        }
    }
    
    return taken == numCourses;
}`,
      java: `import java.util.*;

public static boolean canFinish(int numCourses, int[][] prerequisites) {
    List<List<Integer>> graph = new ArrayList<>();
    for (int i = 0; i < numCourses; i++) graph.add(new ArrayList<>());
    
    int[] indegree = new int[numCourses];
    
    for (int[] p : prerequisites) {
        graph.get(p[0]).add(p[1]);
        indegree[p[1]]++;
    }
    
    Queue<Integer> queue = new LinkedList<>();
    for (int i = 0; i < numCourses; i++) {
        if (indegree[i] == 0) queue.offer(i);
    }
    
    int taken = 0;
    while (!queue.isEmpty()) {
        int course = queue.poll();
        taken++;
        for (int neighbor : graph.get(course)) {
            if (--indegree[neighbor] == 0) {
                queue.offer(neighbor);
            }
        }
    }
    
    return taken == numCourses;
}`
    },
    solutionExplanation: `This is a cycle detection problem in a directed graph. We use Kahn's Algorithm for Topological Sorting. We calculate the in-degree of each node (course). Nodes with in-degree 0 have no prerequisites and can be taken immediately. We process these nodes, reducing the in-degree of their dependent courses. If we can process all courses, there is no cycle, and it is possible to finish. If some courses remain with non-zero in-degree, a cycle exists.`,
    testCases: [
      { id: 'tc-1', input: 'numCourses=2, prereqs=[[1,0]]', expected: 'true' },
      { id: 'tc-2', input: 'numCourses=2, prereqs=[[1,0],[0,1]]', expected: 'false' },
      { id: 'tc-3', input: 'numCourses=3, prereqs=[[0,1],[0,2],[1,2]]', expected: 'true' }
    ]
  },
  {
    id: 'dsa-gr-06',
    number: 6,
    title: 'Word Ladder',
    slug: 'word-ladder',
    category: 'Graphs & BFS/DFS',
    difficulty: 'Hard',
    summary: 'Find shortest transformation sequence from beginWord to endWord.',
    description: `A **transformation sequence** from word \`beginWord\` to word \`endWord\` using a dictionary \`wordList\` is a sequence of words \`beginWord -> s_1 -> s_2 -> ... -> s_k\` such that:\n\n* Every adjacent pair of words differs by a single letter.\n* Every \`s_i\` for \`1 <= i <= k\` is in \`wordList\`. Note that \`beginWord\` does not need to be in \`wordList\`.\n* \`s_k == endWord\`\n\nGiven two words, \`beginWord\` and \`endWord\`, and a dictionary \`wordList\`, return *the **number of words** in the **shortest transformation sequence** from*\`\` beginWord\`\` *to*\`\` endWord\`\`, *or*\`\` 0\`\` *if no such sequence exists*.`,
    examples: [
      {
        input: 'beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log","cog"]',
        output: '5',
        explanation: 'Sequence: hit -> hot -> dot -> dog -> cog'
      }
    ],
    constraints: [
      '1 <= beginWord.length <= 10',
      'endWord.length == beginWord.length',
      '1 <= wordList.length <= 5000',
      'wordList[i].length == beginWord.length',
      'beginWord, endWord, and wordList[i] consist of lowercase English letters.',
      'beginWord != endWord',
      'All the words in wordList are unique.'
    ],
    keyPoints: [
      '**Brute Force**: Check all subsets/permutations. Impossible.',
      '**Core Insight**: BFS on Implicit Graph. Each word is a node. Edges exist between words differing by 1 char. BFS guarantees shortest path in unweighted graph. Optimize neighbor generation by trying all 26 letters for each position.',
      '**Edge Cases**: End word not in list (return 0), begin word equals end word (not allowed per constraints).',
      '**Space-Time Analysis**: O(M^2 * N) time where M is word length, N is dict size. O(N) space.'
    ],
    timeComplexity: 'O(M^2 * N)',
    spaceComplexity: 'O(N)',
    companies: ['Amazon', 'Microsoft', 'Google', 'Uber'],
    starterCode: {
      python: `from collections import deque

def ladderLength(beginWord, endWord, wordList):
    # TODO: Implement BFS
    pass

# Test Execution
if __name__ == "__main__":
    print(ladderLength("hit", "cog", ["hot","dot","dog","lot","log","cog"])) # Expected: 5
    print(ladderLength("hit", "cog", ["hot","dot","dog","lot","log"]))       # Expected: 0`,
      javascript: `/**
 * @param {string} beginWord
 * @param {string} endWord
 * @param {string[]} wordList
 * @return {number}
 */
var ladderLength = function(beginWord, endWord, wordList) {
    // TODO: Implement BFS
};

// Test Execution
console.log(ladderLength("hit", "cog", ["hot","dot","dog","lot","log","cog"])); // Expected: 5
console.log(ladderLength("hit", "cog", ["hot","dot","dog","lot","log"]));       // Expected: 0`,
      cpp: `#include <vector>
#include <string>
#include <queue>
#include <unordered_set>
#include <iostream>
using namespace std;

int ladderLength(string beginWord, string endWord, vector<string>& wordList) {
    // TODO: Implement BFS
    return 0;
}

int main() {
    vector<string> wl1 = {"hot","dot","dog","lot","log","cog"};
    cout << ladderLength("hit", "cog", wl1) << endl; // Expected: 5
    
    vector<string> wl2 = {"hot","dot","dog","lot","log"};
    cout << ladderLength("hit", "cog", wl2) << endl; // Expected: 0
    return 0;
}`,
      java: `import java.util.*;

public class Solution {
    public static int ladderLength(String beginWord, String endWord, List<String> wordList) {
        // TODO: Implement BFS
        return 0;
    }

    public static void main(String[] args) {
        List<String> wl1 = Arrays.asList("hot","dot","dog","lot","log","cog");
        System.out.println(ladderLength("hit", "cog", wl1)); // Expected: 5
        
        List<String> wl2 = Arrays.asList("hot","dot","dog","lot","log");
        System.out.println(ladderLength("hit", "cog", wl2)); // Expected: 0
    }
}`
    },
    solutionCode: {
      python: `def ladderLength(beginWord, endWord, wordList):
    if endWord not in wordList:
        return 0
        
    wordSet = set(wordList)
    queue = deque([(beginWord, 1)])
    
    while queue:
        word, steps = queue.popleft()
        
        if word == endWord:
            return steps
            
        for i in range(len(word)):
            for c in 'abcdefghijklmnopqrstuvwxyz':
                next_word = word[:i] + c + word[i+1:]
                if next_word in wordSet:
                    wordSet.remove(next_word) # Mark visited
                    queue.append((next_word, steps + 1))
                    
    return 0`,
      javascript: `var ladderLength = function(beginWord, endWord, wordList) {
    const wordSet = new Set(wordList);
    if (!wordSet.has(endWord)) return 0;
    
    const queue = [[beginWord, 1]];
    
    while (queue.length > 0) {
        const [word, steps] = queue.shift();
        
        if (word === endWord) return steps;
        
        for (let i = 0; i < word.length; i++) {
            for (let c = 97; c <= 122; c++) { // 'a' to 'z'
                const nextWord = word.slice(0, i) + String.fromCharCode(c) + word.slice(i + 1);
                if (wordSet.has(nextWord)) {
                    wordSet.delete(nextWord); // Mark visited
                    queue.push([nextWord, steps + 1]);
                }
            }
        }
    }
    
    return 0;
};`,
      cpp: `int ladderLength(string beginWord, string endWord, vector<string>& wordList) {
    unordered_set<string> wordSet(wordList.begin(), wordList.end());
    if (wordSet.find(endWord) == wordSet.end()) return 0;
    
    queue<pair<string, int>> q;
    q.push({beginWord, 1});
    
    while (!q.empty()) {
        auto [word, steps] = q.front();
        q.pop();
        
        if (word == endWord) return steps;
        
        for (int i = 0; i < word.length(); ++i) {
            string originalChar = word.substr(i, 1);
            for (char c = 'a'; c <= 'z'; ++c) {
                word[i] = c;
                if (wordSet.find(word) != wordSet.end()) {
                    wordSet.erase(word);
                    q.push({word, steps + 1});
                }
            }
            word[i] = originalChar[0];
        }
    }
    
    return 0;
}`,
      java: `public static int ladderLength(String beginWord, String endWord, List<String> wordList) {
    Set<String> wordSet = new HashSet<>(wordList);
    if (!wordSet.contains(endWord)) return 0;
    
    Queue<String> queue = new LinkedList<>();
    queue.offer(beginWord);
    int steps = 1;
    
    while (!queue.isEmpty()) {
        int size = queue.size();
        for (int i = 0; i < size; i++) {
            String word = queue.poll();
            if (word.equals(endWord)) return steps;
            
            char[] chars = word.toCharArray();
            for (int j = 0; j < chars.length; j++) {
                char original = chars[j];
                for (char c = 'a'; c <= 'z'; c++) {
                    chars[j] = c;
                    String nextWord = new String(chars);
                    if (wordSet.contains(nextWord)) {
                        wordSet.remove(nextWord);
                        queue.offer(nextWord);
                    }
                }
                chars[j] = original;
            }
        }
        steps++;
    }
    
    return 0;
}`
    },
    solutionExplanation: `We treat the word list as a graph where nodes are words and edges connect words differing by one character. Since we want the shortest path, we use Breadth-First Search (BFS). We start from \`beginWord\` with step 1. For each word, we generate all possible neighbors by changing each character position to 'a'-'z'. If a neighbor is in our dictionary, we add it to the queue and remove it from the dictionary (marking as visited) to avoid cycles. If we reach \`endWord\`, we return the current step count.`,
    testCases: [
      { id: 'tc-1', input: 'begin="hit", end="cog", list=["hot","dot","dog","lot","log","cog"]', expected: '5' },
      { id: 'tc-2', input: 'begin="hit", end="cog", list=["hot","dot","dog","lot","log"]', expected: '0' },
      { id: 'tc-3', input: 'begin="a", end="c", list=["a","b","c"]', expected: '2' }
    ]
  }
];
