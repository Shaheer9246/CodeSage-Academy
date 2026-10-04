import { DsaProblem } from './types';

export const LINKED_LIST_PROBLEMS: DsaProblem[] = [
  {
    id: 'dsa-ll-01',
    number: 1,
    title: 'Reverse Linked List',
    slug: 'reverse-linked-list',
    category: 'Linked Lists',
    difficulty: 'Easy',
    summary: 'Reverse a singly linked list.',
    description: `Given the \`head\` of a singly linked list, reverse the list, and return *the reversed list*.`,
    examples: [
      {
        input: 'head = [1,2,3,4,5]',
        output: '[5,4,3,2,1]',
        explanation: 'The original list is 1 -> 2 -> 3 -> 4 -> 5. After reversing, it becomes 5 -> 4 -> 3 -> 2 -> 1.'
      },
      {
        input: 'head = []',
        output: '[]',
        explanation: 'An empty list remains empty after reversal.'
      }
    ],
    constraints: [
      'The number of nodes in the list is in the range [0, 5000].',
      '-5000 <= Node.val <= 5000'
    ],
    keyPoints: [
      '**Brute Force**: Use an extra stack or array to store values, then reconstruct the list in reverse order. Time O(N), Space O(N).',
      '**Core Insight**: Maintain three pointers (\`prev\`, \`curr\`, \`nextTemp\`) to iteratively flip links. Or use recursion where the base case returns the new head, and unwinding reverses pointers.',
      '**Edge Cases**: Empty list (\`null\`), single node list (returns itself).',
      '**Space-Time Analysis**: Iterative approach is optimal with O(N) time and O(1) space. Recursive is O(N) time but O(N) space due to call stack.'
    ],
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    companies: ['Amazon', 'Apple', 'LinkedIn'],
    starterCode: {
      python: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def create_list(arr):
    dummy = ListNode()
    curr = dummy
    for x in arr:
        curr.next = ListNode(x)
        curr = curr.next
    return dummy.next

def print_list(head):
    res = []
    while head:
        res.append(str(head.val))
        head = head.next
    print("[" + ",".join(res) + "]")

# TODO: Implement your solution here
def reverseList(head: ListNode) -> ListNode:
    pass

# Test Execution
if __name__ == "__main__":
    head = create_list([1,2,3,4,5])
    result = reverseList(head)
    print_list(result) # Expected: [5,4,3,2,1]`,
      javascript: `class ListNode {
    constructor(val = 0, next = null) {
        this.val = val;
        this.next = next;
    }
}

function createList(arr) {
    let dummy = new ListNode();
    let curr = dummy;
    for (let x of arr) {
        curr.next = new ListNode(x);
        curr = curr.next;
    }
    return dummy.next;
}

function printList(head) {
    let res = [];
    while (head) {
        res.push(head.val);
        head = head.next;
    }
    console.log("[" + res.join(",") + "]");
}

// TODO: Implement your solution here
var reverseList = function(head) {
    
};

// Test Execution
const head = createList([1,2,3,4,5]);
const result = reverseList(head);
printList(result); // Expected: [5,4,3,2,1]`,
      cpp: `#include <iostream>
#include <vector>
using namespace std;

struct ListNode {
    int val;
    ListNode *next;
    ListNode(int x) : val(x), next(NULL) {}
};

ListNode* createList(vector<int>& arr) {
    if (arr.empty()) return nullptr;
    ListNode* head = new ListNode(arr[0]);
    ListNode* curr = head;
    for (int i = 1; i < arr.size(); ++i) {
        curr->next = new ListNode(arr[i]);
        curr = curr->next;
    }
    return head;
}

void printList(ListNode* head) {
    cout << "[";
    while (head != NULL) {
        cout << head->val;
        if (head->next != NULL) cout << ",";
        head = head->next;
    }
    cout << "]" << endl;
}

// TODO: Implement your solution here
ListNode* reverseList(ListNode* head) {
    return nullptr;
}

int main() {
    vector<int> arr = {1, 2, 3, 4, 5};
    ListNode* head = createList(arr);
    ListNode* result = reverseList(head);
    printList(result); // Expected: [5,4,3,2,1]
    return 0;
}`,
      java: `import java.util.*;

class ListNode {
    int val;
    ListNode next;
    ListNode(int x) { val = x; }
}

public class Solution {
    public static ListNode createList(int[] arr) {
        if (arr.length == 0) return null;
        ListNode head = new ListNode(arr[0]);
        ListNode curr = head;
        for (int i = 1; i < arr.length; i++) {
            curr.next = new ListNode(arr[i]);
            curr = curr.next;
        }
        return head;
    }

    public static void printList(ListNode head) {
        System.out.print("[");
        while (head != null) {
            System.out.print(head.val);
            if (head.next != null) System.out.print(",");
            head = head.next;
        }
        System.out.println("]");
    }

    // TODO: Implement your solution here
    public static ListNode reverseList(ListNode head) {
        return null;
    }

    public static void main(String[] args) {
        int[] arr = {1, 2, 3, 4, 5};
        ListNode head = createList(arr);
        ListNode result = reverseList(head);
        printList(result); // Expected: [5,4,3,2,1]
    }
}`
    },
    solutionCode: {
      python: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def reverseList(head: ListNode) -> ListNode:
    prev = None
    curr = head
    while curr:
        next_temp = curr.next
        curr.next = prev
        prev = curr
        curr = next_temp
    return prev`,
      javascript: `var reverseList = function(head) {
    let prev = null;
    let curr = head;
    while (curr !== null) {
        let nextTemp = curr.next;
        curr.next = prev;
        prev = curr;
        curr = nextTemp;
    }
    return prev;
};`,
      cpp: `ListNode* reverseList(ListNode* head) {
    ListNode* prev = NULL;
    ListNode* curr = head;
    while (curr != NULL) {
        ListNode* nextTemp = curr->next;
        curr->next = prev;
        prev = curr;
        curr = nextTemp;
    }
    return prev;
}`,
      java: `public static ListNode reverseList(ListNode head) {
    ListNode prev = null;
    ListNode curr = head;
    while (curr != null) {
        ListNode nextTemp = curr.next;
        curr.next = prev;
        prev = curr;
        curr = nextTemp;
    }
    return prev;
}`
    },
    solutionExplanation: `To reverse a linked list iteratively, we maintain three pointers: \`prev\`, \`curr\`, and \`nextTemp\`. Initially, \`prev\` is \`null\` and \`curr\` is \`head\`. In each iteration, we temporarily store the next node (\`nextTemp = curr.next\`), then point the current node's \`next\` backwards to \`prev\`. Finally, we advance both \`prev\` and \`curr\` one step forward. When \`curr\` becomes \`null\`, \`prev\` will be pointing to the new head of the reversed list. This ensures O(1) space complexity.`,
    testCases: [
      { id: 'tc-1', input: '[1,2,3,4,5]', expected: '[5,4,3,2,1]' },
      { id: 'tc-2', input: '[]', expected: '[]' },
      { id: 'tc-3', input: '[1]', expected: '[1]' }
    ]
  },
  {
    id: 'dsa-ll-02',
    number: 2,
    title: 'Merge Two Sorted Lists',
    slug: 'merge-two-sorted-lists',
    category: 'Linked Lists',
    difficulty: 'Easy',
    summary: 'Merge two sorted linked lists and return it as a sorted list.',
    description: `You are given the heads of two sorted linked lists \`list1\` and \`list2\`. Merge the two lists into one **sorted** list. The list should be made by splicing together the nodes of the first two lists. Return *the head of the merged linked list*.`,
    examples: [
      {
        input: 'list1 = [1,2,4], list2 = [1,3,4]',
        output: '[1,1,2,3,4,4]',
        explanation: 'Merging the two sorted sequences results in a combined sorted sequence.'
      },
      {
        input: 'list1 = [], list2 = []',
        output: '[]',
        explanation: 'Both lists are empty.'
      }
    ],
    constraints: [
      'The number of nodes in both lists is in the range [0, 50].',
      '-100 <= Node.val <= 100',
      'Both \`list1\` and \`list2\` are sorted in non-decreasing order.'
    ],
    keyPoints: [
      '**Brute Force**: Extract all values to an array, sort, and rebuild list. Time O((N+M)log(N+M)), Space O(N+M).',
      '**Core Insight**: Use a dummy head pointer to simplify edge cases. Iterate through both lists simultaneously, comparing node values and appending the smaller one to the result list.',
      '**Edge Cases**: One or both lists are empty. One list is exhausted before the other.',
      '**Space-Time Analysis**: Optimal solution runs in O(N+M) time and O(1) auxiliary space (excluding output storage).'
    ],
    timeComplexity: 'O(N+M)',
    spaceComplexity: 'O(1)',
    companies: ['Amazon', 'Microsoft', 'Adobe'],
    starterCode: {
      python: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def create_list(arr):
    dummy = ListNode()
    curr = dummy
    for x in arr:
        curr.next = ListNode(x)
        curr = curr.next
    return dummy.next

def print_list(head):
    res = []
    while head:
        res.append(str(head.val))
        head = head.next
    print("[" + ",".join(res) + "]")

# TODO: Implement your solution here
def mergeTwoLists(list1: ListNode, list2: ListNode) -> ListNode:
    pass

# Test Execution
if __name__ == "__main__":
    l1 = create_list([1,2,4])
    l2 = create_list([1,3,4])
    result = mergeTwoLists(l1, l2)
    print_list(result) # Expected: [1,1,2,3,4,4]`,
      javascript: `class ListNode {
    constructor(val = 0, next = null) {
        this.val = val;
        this.next = next;
    }
}

function createList(arr) {
    let dummy = new ListNode();
    let curr = dummy;
    for (let x of arr) {
        curr.next = new ListNode(x);
        curr = curr.next;
    }
    return dummy.next;
}

function printList(head) {
    let res = [];
    while (head) {
        res.push(head.val);
        head = head.next;
    }
    console.log("[" + res.join(",") + "]");
}

// TODO: Implement your solution here
var mergeTwoLists = function(list1, list2) {
    
};

// Test Execution
const l1 = createList([1,2,4]);
const l2 = createList([1,3,4]);
const result = mergeTwoLists(l1, l2);
printList(result); // Expected: [1,1,2,3,4,4]`,
      cpp: `#include <iostream>
#include <vector>
using namespace std;

struct ListNode {
    int val;
    ListNode *next;
    ListNode(int x) : val(x), next(NULL) {}
};

ListNode* createList(vector<int>& arr) {
    if (arr.empty()) return nullptr;
    ListNode* head = new ListNode(arr[0]);
    ListNode* curr = head;
    for (int i = 1; i < arr.size(); ++i) {
        curr->next = new ListNode(arr[i]);
        curr = curr->next;
    }
    return head;
}

void printList(ListNode* head) {
    cout << "[";
    while (head != NULL) {
        cout << head->val;
        if (head->next != NULL) cout << ",";
        head = head->next;
    }
    cout << "]" << endl;
}

// TODO: Implement your solution here
ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {
    return nullptr;
}

int main() {
    vector<int> arr1 = {1, 2, 4};
    vector<int> arr2 = {1, 3, 4};
    ListNode* l1 = createList(arr1);
    ListNode* l2 = createList(arr2);
    ListNode* result = mergeTwoLists(l1, l2);
    printList(result); // Expected: [1,1,2,3,4,4]
    return 0;
}`,
      java: `import java.util.*;

class ListNode {
    int val;
    ListNode next;
    ListNode(int x) { val = x; }
}

public class Solution {
    public static ListNode createList(int[] arr) {
        if (arr.length == 0) return null;
        ListNode head = new ListNode(arr[0]);
        ListNode curr = head;
        for (int i = 1; i < arr.length; i++) {
            curr.next = new ListNode(arr[i]);
            curr = curr.next;
        }
        return head;
    }

    public static void printList(ListNode head) {
        System.out.print("[");
        while (head != null) {
            System.out.print(head.val);
            if (head.next != null) System.out.print(",");
            head = head.next;
        }
        System.out.println("]");
    }

    // TODO: Implement your solution here
    public static ListNode mergeTwoLists(ListNode list1, ListNode list2) {
        return null;
    }

    public static void main(String[] args) {
        int[] arr1 = {1, 2, 4};
        int[] arr2 = {1, 3, 4};
        ListNode l1 = createList(arr1);
        ListNode l2 = createList(arr2);
        ListNode result = mergeTwoLists(l1, l2);
        printList(result); // Expected: [1,1,2,3,4,4]
    }
}`
    },
    solutionCode: {
      python: `def mergeTwoLists(list1: ListNode, list2: ListNode) -> ListNode:
    dummy = ListNode()
    tail = dummy
    
    while list1 and list2:
        if list1.val < list2.val:
            tail.next = list1
            list1 = list1.next
        else:
            tail.next = list2
            list2 = list2.next
        tail = tail.next
        
    tail.next = list1 if list1 else list2
    return dummy.next`,
      javascript: `var mergeTwoLists = function(list1, list2) {
    let dummy = new ListNode();
    let tail = dummy;
    
    while (list1 && list2) {
        if (list1.val < list2.val) {
            tail.next = list1;
            list1 = list1.next;
        } else {
            tail.next = list2;
            list2 = list2.next;
        }
        tail = tail.next;
    }
    
    tail.next = list1 || list2;
    return dummy.next;
};`,
      cpp: `ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {
    ListNode* dummy = new ListNode(-1);
    ListNode* tail = dummy;
    
    while (list1 != NULL && list2 != NULL) {
        if (list1->val < list2->val) {
            tail->next = list1;
            list1 = list1->next;
        } else {
            tail->next = list2;
            list2 = list2->next;
        }
        tail = tail->next;
    }
    
    tail->next = (list1 != NULL) ? list1 : list2;
    return dummy->next;
}`,
      java: `public static ListNode mergeTwoLists(ListNode list1, ListNode list2) {
    ListNode dummy = new ListNode(-1);
    ListNode tail = dummy;
    
    while (list1 != null && list2 != null) {
        if (list1.val < list2.val) {
            tail.next = list1;
            list1 = list1.next;
        } else {
            tail.next = list2;
            list2 = list2.next;
        }
        tail = tail.next;
    }
    
    tail.next = (list1 != null) ? list1 : list2;
    return dummy.next;
}`
    },
    solutionExplanation: `We use a dummy node to handle the start of the merged list easily. A \`tail\` pointer tracks the last node added. We iterate while both lists have nodes, comparing their values. The smaller value node is appended to \`tail\`, and its respective list pointer advances. Once one list is exhausted, the remaining part of the other list is directly attached since it is already sorted.`,
    testCases: [
      { id: 'tc-1', input: 'l1=[1,2,4], l2=[1,3,4]', expected: '[1,1,2,3,4,4]' },
      { id: 'tc-2', input: 'l1=[], l2=[]', expected: '[]' },
      { id: 'tc-3', input: 'l1=[], l2=[0]', expected: '[0]' }
    ]
  },
  {
    id: 'dsa-ll-03',
    number: 3,
    title: 'Linked List Cycle',
    slug: 'linked-list-cycle',
    category: 'Linked Lists',
    difficulty: 'Easy',
    summary: 'Determine if a linked list has a cycle.',
    description: `Given \`head\`, determine if there is a cycle in the linked list. There is a cycle in a linked list if there is some node in the list that can be reached again by continuously following the \`next\` pointer. Internally, \`pos\` is used to denote the index of the node that tail's \`next\` pointer is connected to. Note that \`pos\` is not passed as a parameter. Return \`true\` if there is a cycle in the linked list. Otherwise, return \`false\`.`,
    examples: [
      {
        input: 'head = [3,2,0,-4], pos = 1',
        output: 'true',
        explanation: 'There is a cycle starting at node with value 2.'
      },
      {
        input: 'head = [1,2], pos = -1',
        output: 'false',
        explanation: 'No cycle exists.'
      }
    ],
    constraints: [
      'The number of the nodes in the list is in the range [0, 10^4].',
      '-10^5 <= Node.val <= 10^5',
      'pos is -1 or a valid index in the linked-list.'
    ],
    keyPoints: [
      '**Brute Force**: Store visited nodes in a HashSet. If a node repeats, cycle detected. Time O(N), Space O(N).',
      '**Core Insight**: Floyd\'s Tortoise and Hare algorithm. Use two pointers moving at different speeds (slow=1 step, fast=2 steps). If they meet, there is a cycle.',
      '**Edge Cases**: Empty list, single node without cycle, self-looping node.',
      '**Space-Time Analysis**: Optimal solution uses O(N) time and O(1) space.'
    ],
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    companies: ['Amazon', 'Facebook', 'Microsoft'],
    starterCode: {
      python: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def create_list_with_cycle(arr, pos):
    if not arr: return None
    nodes = [ListNode(x) for x in arr]
    for i in range(len(nodes)-1):
        nodes[i].next = nodes[i+1]
    if pos >= 0:
        nodes[-1].next = nodes[pos]
    return nodes[0]

# TODO: Implement your solution here
def hasCycle(head: ListNode) -> bool:
    pass

# Test Execution
if __name__ == "__main__":
    head = create_list_with_cycle([3,2,0,-4], 1)
    print(hasCycle(head)) # Expected: True`,
      javascript: `class ListNode {
    constructor(val = 0, next = null) {
        this.val = val;
        this.next = next;
    }
}

function createListWithCycle(arr, pos) {
    if (!arr.length) return null;
    const nodes = arr.map(v => new ListNode(v));
    for (let i = 0; i < nodes.length - 1; i++) {
        nodes[i].next = nodes[i + 1];
    }
    if (pos >= 0) {
        nodes[nodes.length - 1].next = nodes[pos];
    }
    return nodes[0];
}

// TODO: Implement your solution here
var hasCycle = function(head) {
    
};

// Test Execution
const head = createListWithCycle([3,2,0,-4], 1);
console.log(hasCycle(head)); // Expected: true`,
      cpp: `#include <iostream>
#include <vector>
using namespace std;

struct ListNode {
    int val;
    ListNode *next;
    ListNode(int x) : val(x), next(NULL) {}
};

ListNode* createListWithCycle(vector<int>& arr, int pos) {
    if (arr.empty()) return nullptr;
    vector<ListNode*> nodes;
    for (int v : arr) nodes.push_back(new ListNode(v));
    for (size_t i = 0; i < nodes.size() - 1; ++i) nodes[i]->next = nodes[i+1];
    if (pos >= 0) nodes.back()->next = nodes[pos];
    return nodes[0];
}

// TODO: Implement your solution here
bool hasCycle(ListNode *head) {
    return false;
}

int main() {
    vector<int> arr = {3, 2, 0, -4};
    ListNode* head = createListWithCycle(arr, 1);
    cout << (hasCycle(head) ? "true" : "false") << endl; // Expected: true
    return 0;
}`,
      java: `import java.util.*;

class ListNode {
    int val;
    ListNode next;
    ListNode(int x) { val = x; }
}

public class Solution {
    public static ListNode createListWithCycle(int[] arr, int pos) {
        if (arr.length == 0) return null;
        ListNode[] nodes = new ListNode[arr.length];
        for (int i = 0; i < arr.length; i++) nodes[i] = new ListNode(arr[i]);
        for (int i = 0; i < arr.length - 1; i++) nodes[i].next = nodes[i+1];
        if (pos >= 0) nodes[arr.length - 1].next = nodes[pos];
        return nodes[0];
    }

    // TODO: Implement your solution here
    public static boolean hasCycle(ListNode head) {
        return false;
    }

    public static void main(String[] args) {
        int[] arr = {3, 2, 0, -4};
        ListNode head = createListWithCycle(arr, 1);
        System.out.println(hasCycle(head)); // Expected: true
    }
}`
    },
    solutionCode: {
      python: `def hasCycle(head: ListNode) -> bool:
    slow = head
    fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            return True
    return False`,
      javascript: `var hasCycle = function(head) {
    let slow = head;
    let fast = head;
    while (fast !== null && fast.next !== null) {
        slow = slow.next;
        fast = fast.next.next;
        if (slow === fast) return true;
    }
    return false;
};`,
      cpp: `bool hasCycle(ListNode *head) {
    ListNode *slow = head;
    ListNode *fast = head;
    while (fast != NULL && fast->next != NULL) {
        slow = slow->next;
        fast = fast->next->next;
        if (slow == fast) return true;
    }
    return false;
}`,
      java: `public static boolean hasCycle(ListNode head) {
    ListNode slow = head;
    ListNode fast = head;
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
        if (slow == fast) return true;
    }
    return false;
}`
    },
    solutionExplanation: `Using Floyd's Cycle Detection Algorithm (Tortoise and Hare), we initialize two pointers, \`slow\` and \`fast\`, at the head. \`slow\` moves one step at a time, while \`fast\` moves two steps. If there is no cycle, \`fast\` will reach \`null\`. If there is a cycle, \`fast\` will eventually catch up to \`slow\` inside the loop. This guarantees detection with constant space.`,
    testCases: [
      { id: 'tc-1', input: 'head=[3,2,0,-4], pos=1', expected: 'true' },
      { id: 'tc-2', input: 'head=[1,2], pos=-1', expected: 'false' },
      { id: 'tc-3', input: 'head=[], pos=-1', expected: 'false' }
    ]
  },
  {
    id: 'dsa-ll-04',
    number: 4,
    title: 'Middle of the Linked List',
    slug: 'middle-of-the-linked-list',
    category: 'Linked Lists',
    difficulty: 'Easy',
    summary: 'Return the middle node of a linked list.',
    description: `Given the \`head\` of a singly linked list, return *the middle node of the linked list*. If there are two middle nodes, return **the second** middle node.`,
    examples: [
      {
        input: 'head = [1,2,3,4,5]',
        output: '[3,4,5]',
        explanation: 'The middle node is 3.'
      },
      {
        input: 'head = [1,2,3,4,5,6]',
        output: '[4,5,6]',
        explanation: 'Since there are two middle nodes (3 and 4), return the second one (4).'
      }
    ],
    constraints: [
      'The number of nodes in the list is in the range [1, 100].',
      '1 <= Node.val <= 100'
    ],
    keyPoints: [
      '**Brute Force**: Count total nodes N, traverse to N/2. Requires two passes. Time O(N), Space O(1).',
      '**Core Insight**: Single-pass technique using Slow/Fast pointers. Fast moves twice as fast as Slow. When Fast reaches end, Slow is at middle.',
      '**Edge Cases**: Odd vs Even length lists. Ensure termination condition handles \`fast.next\` correctly for even lengths.',
      '**Space-Time Analysis**: Optimal solution is O(N) time and O(1) space.'
    ],
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    companies: ['Google', 'Amazon', 'Meta'],
    starterCode: {
      python: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def create_list(arr):
    dummy = ListNode()
    curr = dummy
    for x in arr:
        curr.next = ListNode(x)
        curr = curr.next
    return dummy.next

def print_list(head):
    res = []
    while head:
        res.append(str(head.val))
        head = head.next
    print("[" + ",".join(res) + "]")

# TODO: Implement your solution here
def middleNode(head: ListNode) -> ListNode:
    pass

# Test Execution
if __name__ == "__main__":
    head = create_list([1,2,3,4,5])
    result = middleNode(head)
    print_list(result) # Expected: [3,4,5]`,
      javascript: `class ListNode {
    constructor(val = 0, next = null) {
        this.val = val;
        this.next = next;
    }
}

function createList(arr) {
    let dummy = new ListNode();
    let curr = dummy;
    for (let x of arr) {
        curr.next = new ListNode(x);
        curr = curr.next;
    }
    return dummy.next;
}

function printList(head) {
    let res = [];
    while (head) {
        res.push(head.val);
        head = head.next;
    }
    console.log("[" + res.join(",") + "]");
}

// TODO: Implement your solution here
var middleNode = function(head) {
    
};

// Test Execution
const head = createList([1,2,3,4,5]);
const result = middleNode(head);
printList(result); // Expected: [3,4,5]`,
      cpp: `#include <iostream>
#include <vector>
using namespace std;

struct ListNode {
    int val;
    ListNode *next;
    ListNode(int x) : val(x), next(NULL) {}
};

ListNode* createList(vector<int>& arr) {
    if (arr.empty()) return nullptr;
    ListNode* head = new ListNode(arr[0]);
    ListNode* curr = head;
    for (int i = 1; i < arr.size(); ++i) {
        curr->next = new ListNode(arr[i]);
        curr = curr->next;
    }
    return head;
}

void printList(ListNode* head) {
    cout << "[";
    while (head != NULL) {
        cout << head->val;
        if (head->next != NULL) cout << ",";
        head = head->next;
    }
    cout << "]" << endl;
}

// TODO: Implement your solution here
ListNode* middleNode(ListNode* head) {
    return nullptr;
}

int main() {
    vector<int> arr = {1, 2, 3, 4, 5};
    ListNode* head = createList(arr);
    ListNode* result = middleNode(head);
    printList(result); // Expected: [3,4,5]
    return 0;
}`,
      java: `import java.util.*;

class ListNode {
    int val;
    ListNode next;
    ListNode(int x) { val = x; }
}

public class Solution {
    public static ListNode createList(int[] arr) {
        if (arr.length == 0) return null;
        ListNode head = new ListNode(arr[0]);
        ListNode curr = head;
        for (int i = 1; i < arr.length; i++) {
            curr.next = new ListNode(arr[i]);
            curr = curr.next;
        }
        return head;
    }

    public static void printList(ListNode head) {
        System.out.print("[");
        while (head != null) {
            System.out.print(head.val);
            if (head.next != null) System.out.print(",");
            head = head.next;
        }
        System.out.println("]");
    }

    // TODO: Implement your solution here
    public static ListNode middleNode(ListNode head) {
        return null;
    }

    public static void main(String[] args) {
        int[] arr = {1, 2, 3, 4, 5};
        ListNode head = createList(arr);
        ListNode result = middleNode(head);
        printList(result); // Expected: [3,4,5]
    }
}`
    },
    solutionCode: {
      python: `def middleNode(head: ListNode) -> ListNode:
    slow = head
    fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    return slow`,
      javascript: `var middleNode = function(head) {
    let slow = head;
    let fast = head;
    while (fast !== null && fast.next !== null) {
        slow = slow.next;
        fast = fast.next.next;
    }
    return slow;
};`,
      cpp: `ListNode* middleNode(ListNode* head) {
    ListNode* slow = head;
    ListNode* fast = head;
    while (fast != NULL && fast->next != NULL) {
        slow = slow->next;
        fast = fast->next->next;
    }
    return slow;
}`,
      java: `public static ListNode middleNode(ListNode head) {
    ListNode slow = head;
    ListNode fast = head;
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
    }
    return slow;
}`
    },
    solutionExplanation: `By initializing two pointers at the head, where \`fast\` moves two steps and \`slow\` moves one step, we leverage relative speed. When \`fast\` hits the end of the list (or null), \`slow\` will have traversed exactly half the distance, landing on the middle node. For even-length lists, this naturally lands on the second middle node as required.`,
    testCases: [
      { id: 'tc-1', input: '[1,2,3,4,5]', expected: '[3,4,5]' },
      { id: 'tc-2', input: '[1,2,3,4,5,6]', expected: '[4,5,6]' },
      { id: 'tc-3', input: '[1]', expected: '[1]' }
    ]
  },
  {
    id: 'dsa-ll-05',
    number: 5,
    title: 'Remove Nth Node From End of List',
    slug: 'remove-nth-node-from-end-of-list',
    category: 'Linked Lists',
    difficulty: 'Medium',
    summary: 'Remove the nth node from the end of a linked list.',
    description: `Given the \`head\` of a linked list, remove the \`n^{th}\` node from the end of the list and return its head.`,
    examples: [
      {
        input: 'head = [1,2,3,4,5], n = 2',
        output: '[1,2,3,5]',
        explanation: 'Removing the 2nd node from end (value 4) leaves [1,2,3,5].'
      },
      {
        input: 'head = [1], n = 1',
        output: '[]',
        explanation: 'Removing the only node results in an empty list.'
      }
    ],
    constraints: [
      'The number of nodes in the list is sz.',
      '1 <= sz <= 30',
      '0 <= Node.val <= 100',
      '1 <= n <= sz'
    ],
    keyPoints: [
      '**Brute Force**: Calculate length L, find target index L-N, traverse to delete. Requires two passes.',
      '**Core Insight**: One-pass solution using two pointers (\`first\` and \`second\`). Advance \`first\` by \`n+1\` steps. Then move both until \`first\` is null. \`second\` will be just before the node to delete.',
      '**Edge Cases**: Deleting the head node (use dummy node to simplify logic). List size equals n.',
      '**Space-Time Analysis**: O(L) time, O(1) space.'
    ],
    timeComplexity: 'O(L)',
    spaceComplexity: 'O(1)',
    companies: ['Amazon', 'Microsoft', 'Bloomberg'],
    starterCode: {
      python: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def create_list(arr):
    dummy = ListNode()
    curr = dummy
    for x in arr:
        curr.next = ListNode(x)
        curr = curr.next
    return dummy.next

def print_list(head):
    res = []
    while head:
        res.append(str(head.val))
        head = head.next
    print("[" + ",".join(res) + "]")

# TODO: Implement your solution here
def removeNthFromEnd(head: ListNode, n: int) -> ListNode:
    pass

# Test Execution
if __name__ == "__main__":
    head = create_list([1,2,3,4,5])
    result = removeNthFromEnd(head, 2)
    print_list(result) # Expected: [1,2,3,5]`,
      javascript: `class ListNode {
    constructor(val = 0, next = null) {
        this.val = val;
        this.next = next;
    }
}

function createList(arr) {
    let dummy = new ListNode();
    let curr = dummy;
    for (let x of arr) {
        curr.next = new ListNode(x);
        curr = curr.next;
    }
    return dummy.next;
}

function printList(head) {
    let res = [];
    while (head) {
        res.push(head.val);
        head = head.next;
    }
    console.log("[" + res.join(",") + "]");
}

// TODO: Implement your solution here
var removeNthFromEnd = function(head, n) {
    
};

// Test Execution
const head = createList([1,2,3,4,5]);
const result = removeNthFromEnd(head, 2);
printList(result); // Expected: [1,2,3,5]`,
      cpp: `#include <iostream>
#include <vector>
using namespace std;

struct ListNode {
    int val;
    ListNode *next;
    ListNode(int x) : val(x), next(NULL) {}
};

ListNode* createList(vector<int>& arr) {
    if (arr.empty()) return nullptr;
    ListNode* head = new ListNode(arr[0]);
    ListNode* curr = head;
    for (int i = 1; i < arr.size(); ++i) {
        curr->next = new ListNode(arr[i]);
        curr = curr->next;
    }
    return head;
}

void printList(ListNode* head) {
    cout << "[";
    while (head != NULL) {
        cout << head->val;
        if (head->next != NULL) cout << ",";
        head = head->next;
    }
    cout << "]" << endl;
}

// TODO: Implement your solution here
ListNode* removeNthFromEnd(ListNode* head, int n) {
    return nullptr;
}

int main() {
    vector<int> arr = {1, 2, 3, 4, 5};
    ListNode* head = createList(arr);
    ListNode* result = removeNthFromEnd(head, 2);
    printList(result); // Expected: [1,2,3,5]
    return 0;
}`,
      java: `import java.util.*;

class ListNode {
    int val;
    ListNode next;
    ListNode(int x) { val = x; }
}

public class Solution {
    public static ListNode createList(int[] arr) {
        if (arr.length == 0) return null;
        ListNode head = new ListNode(arr[0]);
        ListNode curr = head;
        for (int i = 1; i < arr.length; i++) {
            curr.next = new ListNode(arr[i]);
            curr = curr.next;
        }
        return head;
    }

    public static void printList(ListNode head) {
        System.out.print("[");
        while (head != null) {
            System.out.print(head.val);
            if (head.next != null) System.out.print(",");
            head = head.next;
        }
        System.out.println("]");
    }

    // TODO: Implement your solution here
    public static ListNode removeNthFromEnd(ListNode head, int n) {
        return null;
    }

    public static void main(String[] args) {
        int[] arr = {1, 2, 3, 4, 5};
        ListNode head = createList(arr);
        ListNode result = removeNthFromEnd(head, 2);
        printList(result); // Expected: [1,2,3,5]
    }
}`
    },
    solutionCode: {
      python: `def removeNthFromEnd(head: ListNode, n: int) -> ListNode:
    dummy = ListNode(0, head)
    first = dummy
    second = dummy
    
    for _ in range(n + 1):
        first = first.next
        
    while first:
        first = first.next
        second = second.next
        
    second.next = second.next.next
    return dummy.next`,
      javascript: `var removeNthFromEnd = function(head, n) {
    let dummy = new ListNode(0, head);
    let first = dummy;
    let second = dummy;
    
    for (let i = 0; i <= n; i++) {
        first = first.next;
    }
    
    while (first !== null) {
        first = first.next;
        second = second.next;
    }
    
    second.next = second.next.next;
    return dummy.next;
};`,
      cpp: `ListNode* removeNthFromEnd(ListNode* head, int n) {
    ListNode* dummy = new ListNode(0, head);
    ListNode* first = dummy;
    ListNode* second = dummy;
    
    for (int i = 0; i <= n; ++i) {
        first = first->next;
    }
    
    while (first != NULL) {
        first = first->next;
        second = second->next;
    }
    
    second->next = second->next->next;
    return dummy->next;
}`,
      java: `public static ListNode removeNthFromEnd(ListNode head, int n) {
    ListNode dummy = new ListNode(0, head);
    ListNode first = dummy;
    ListNode second = dummy;
    
    for (int i = 0; i <= n; i++) {
        first = first.next;
    }
    
    while (first != null) {
        first = first.next;
        second = second.next;
    }
    
    second.next = second.next.next;
    return dummy.next;
}`
    },
    solutionExplanation: `A dummy node simplifies handling the removal of the head node. We initialize two pointers at the dummy. We advance the \`first\` pointer \`n+1\` steps ahead. Then, we move both \`first\` and \`second\` until \`first\` becomes null. At this point, \`second\` is positioned exactly before the node to be deleted. We bypass the target node by setting \`second.next = second.next.next\`.`,
    testCases: [
      { id: 'tc-1', input: 'head=[1,2,3,4,5], n=2', expected: '[1,2,3,5]' },
      { id: 'tc-2', input: 'head=[1], n=1', expected: '[]' },
      { id: 'tc-3', input: 'head=[1,2], n=1', expected: '[1]' }
    ]
  },
  {
    id: 'dsa-ll-06',
    number: 6,
    title: 'Reorder List',
    slug: 'reorder-list',
    category: 'Linked Lists',
    difficulty: 'Medium',
    summary: 'Reorder a linked list such that L0 → Ln → L1 → Ln-1 ...',
    description: `You are given the head of a singly linked-list. The list can be represented as: L0 → L1 → … → Ln - 1 → Ln. Reorder the list to be on the following form: L0 → Ln → L1 → Ln - 1 → L2 → Ln - 2 → … You may not modify the values in the list's nodes. Only nodes themselves may be changed.`,
    examples: [
      {
        input: 'head = [1,2,3,4]',
        output: '[1,4,2,3]',
        explanation: 'Interleave first half and reversed second half.'
      },
      {
        input: 'head = [1,2,3,4,5]',
        output: '[1,5,2,4,3]',
        explanation: 'Middle node stays at end.'
      }
    ],
    constraints: [
      'The number of nodes in the list is in the range [1, 5 * 10^4].',
      '1 <= Node.val <= 1000'
    ],
    keyPoints: [
      '**Brute Force**: Copy nodes to array/list, reorder indices, relink. Space O(N).',
      '**Core Insight**: Three-step process: 1. Find Middle (Slow/Fast). 2. Reverse Second Half. 3. Merge First and Reversed Second halves alternately.',
      '**Edge Cases**: Short lists (1 or 2 nodes). Ensuring proper termination during merging.',
      '**Space-Time Analysis**: O(N) time, O(1) space.'
    ],
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    companies: ['Amazon', 'Uber', 'LinkedIn'],
    starterCode: {
      python: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def create_list(arr):
    dummy = ListNode()
    curr = dummy
    for x in arr:
        curr.next = ListNode(x)
        curr = curr.next
    return dummy.next

def print_list(head):
    res = []
    while head:
        res.append(str(head.val))
        head = head.next
    print("[" + ",".join(res) + "]")

# TODO: Implement your solution here
def reorderList(head: ListNode) -> None:
    """Do not return anything, modify head in-place instead."""
    pass

# Test Execution
if __name__ == "__main__":
    head = create_list([1,2,3,4])
    reorderList(head)
    print_list(head) # Expected: [1,4,2,3]`,
      javascript: `class ListNode {
    constructor(val = 0, next = null) {
        this.val = val;
        this.next = next;
    }
}

function createList(arr) {
    let dummy = new ListNode();
    let curr = dummy;
    for (let x of arr) {
        curr.next = new ListNode(x);
        curr = curr.next;
    }
    return dummy.next;
}

function printList(head) {
    let res = [];
    while (head) {
        res.push(head.val);
        head = head.next;
    }
    console.log("[" + res.join(",") + "]");
}

// TODO: Implement your solution here
var reorderList = function(head) {
    /** Do not return anything, modify head in-place instead. */
};

// Test Execution
const head = createList([1,2,3,4]);
reorderList(head);
printList(head); // Expected: [1,4,2,3]`,
      cpp: `#include <iostream>
#include <vector>
using namespace std;

struct ListNode {
    int val;
    ListNode *next;
    ListNode(int x) : val(x), next(NULL) {}
};

ListNode* createList(vector<int>& arr) {
    if (arr.empty()) return nullptr;
    ListNode* head = new ListNode(arr[0]);
    ListNode* curr = head;
    for (int i = 1; i < arr.size(); ++i) {
        curr->next = new ListNode(arr[i]);
        curr = curr->next;
    }
    return head;
}

void printList(ListNode* head) {
    cout << "[";
    while (head != NULL) {
        cout << head->val;
        if (head->next != NULL) cout << ",";
        head = head->next;
    }
    cout << "]" << endl;
}

// TODO: Implement your solution here
void reorderList(ListNode* head) {
    
}

int main() {
    vector<int> arr = {1, 2, 3, 4};
    ListNode* head = createList(arr);
    reorderList(head);
    printList(head); // Expected: [1,4,2,3]
    return 0;
}`,
      java: `import java.util.*;

class ListNode {
    int val;
    ListNode next;
    ListNode(int x) { val = x; }
}

public class Solution {
    public static ListNode createList(int[] arr) {
        if (arr.length == 0) return null;
        ListNode head = new ListNode(arr[0]);
        ListNode curr = head;
        for (int i = 1; i < arr.length; i++) {
            curr.next = new ListNode(arr[i]);
            curr = curr.next;
        }
        return head;
    }

    public static void printList(ListNode head) {
        System.out.print("[");
        while (head != null) {
            System.out.print(head.val);
            if (head.next != null) System.out.print(",");
            head = head.next;
        }
        System.out.println("]");
    }

    // TODO: Implement your solution here
    public static void reorderList(ListNode head) {
        
    }

    public static void main(String[] args) {
        int[] arr = {1, 2, 3, 4};
        ListNode head = createList(arr);
        reorderList(head);
        printList(head); // Expected: [1,4,2,3]
    }
}`
    },
    solutionCode: {
      python: `def reorderList(head: ListNode) -> None:
    if not head or not head.next:
        return
    
    # 1. Find Middle
    slow, fast = head, head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    
    # 2. Reverse Second Half
    prev, curr = None, slow
    while curr:
        nxt = curr.next
        curr.next = prev
        prev = curr
        curr = nxt
    
    # 3. Merge Halves
    first, second = head, prev
    while second and second.next:
        tmp1, tmp2 = first.next, second.next
        first.next = second
        second.next = tmp1
        first, second = tmp1, tmp2`,
      javascript: `var reorderList = function(head) {
    if (!head || !head.next) return;
    
    // 1. Find Middle
    let slow = head, fast = head;
    while (fast && fast.next) {
        slow = slow.next;
        fast = fast.next.next;
    }
    
    // 2. Reverse Second Half
    let prev = null, curr = slow;
    while (curr) {
        let nxt = curr.next;
        curr.next = prev;
        prev = curr;
        curr = nxt;
    }
    
    // 3. Merge Halves
    let first = head, second = prev;
    while (second && second.next) {
        let tmp1 = first.next, tmp2 = second.next;
        first.next = second;
        second.next = tmp1;
        first = tmp1;
        second = tmp2;
    }
};`,
      cpp: `void reorderList(ListNode* head) {
    if (!head || !head->next) return;
    
    // 1. Find Middle
    ListNode* slow = head;
    ListNode* fast = head;
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
    }
    
    // 2. Reverse Second Half
    ListNode* prev = NULL;
    ListNode* curr = slow;
    while (curr) {
        ListNode* nxt = curr->next;
        curr->next = prev;
        prev = curr;
        curr = nxt;
    }
    
    // 3. Merge Halves
    ListNode* first = head;
    ListNode* second = prev;
    while (second && second->next) {
        ListNode* tmp1 = first->next;
        ListNode* tmp2 = second->next;
        first->next = second;
        second->next = tmp1;
        first = tmp1;
        second = tmp2;
    }
}`,
      java: `public static void reorderList(ListNode head) {
    if (head == null || head.next == null) return;
    
    // 1. Find Middle
    ListNode slow = head, fast = head;
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
    }
    
    // 2. Reverse Second Half
    ListNode prev = null, curr = slow;
    while (curr != null) {
        ListNode nxt = curr.next;
        curr.next = prev;
        prev = curr;
        curr = nxt;
    }
    
    // 3. Merge Halves
    ListNode first = head, second = prev;
    while (second != null && second.next != null) {
        ListNode tmp1 = first.next;
        ListNode tmp2 = second.next;
        first.next = second;
        second.next = tmp1;
        first = tmp1;
        second = tmp2;
    }
}`
    },
    solutionExplanation: `This problem is solved in three distinct phases to achieve O(1) space. First, locate the midpoint using the slow/fast pointer technique. Second, reverse the linked list starting from the midpoint. Third, interleave the nodes from the first half and the reversed second half. By carefully managing temporary pointers during merging, we ensure the final list follows the desired pattern without losing references.`,
    testCases: [
      { id: 'tc-1', input: '[1,2,3,4]', expected: '[1,4,2,3]' },
      { id: 'tc-2', input: '[1,2,3,4,5]', expected: '[1,5,2,4,3]' },
      { id: 'tc-3', input: '[1]', expected: '[1]' }
    ]
  }
];
