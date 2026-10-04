import { DsaProblem } from './types';

export const STACK_QUEUES_PROBLEMS: DsaProblem[] = [
  {
    id: 'dsa-sq-01',
    number: 1,
    title: 'Valid Parentheses',
    slug: 'valid-parentheses',
    category: 'Stack & Queues',
    difficulty: 'Easy',
    summary: 'Determine if a string of parentheses is valid.',
    description: `Given a string \`s\` containing just the characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\`, determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.`,
    examples: [
      {
        input: 's = "()"',
        output: 'true',
        explanation: 'Simple pair.'
      },
      {
        input: 's = "()[]{}"',
        output: 'true',
        explanation: 'Multiple pairs.'
      },
      {
        input: 's = "(]"',
        output: 'false',
        explanation: 'Mismatched types.'
      }
    ],
    constraints: [
      '1 <= s.length <= 10^4',
      's consists of parentheses only \'()[]{}\''
    ],
    keyPoints: [
      '**Brute Force**: Recursively remove adjacent matching pairs until no changes occur. Time O(N^2).',
      '**Core Insight**: Stack Data Structure. Iterate through string. Push opening brackets. For closing brackets, check if stack top matches. If not, invalid. If yes, pop. At end, stack must be empty.',
      '**Edge Cases**: Empty string (valid), only opening brackets, only closing brackets, interleaved mismatches like `(]`.',
      '**Space-Time Analysis**: O(N) time for single pass. O(N) space for stack in worst case (all opening brackets).'
    ],
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(N)',
    companies: ['Amazon', 'Microsoft', 'Google', 'Facebook'],
    starterCode: {
      python: `def isValid(s):
    # TODO: Implement stack logic
    pass

# Test Execution
if __name__ == "__main__":
    print(isValid("()"))     # Expected: True
    print(isValid("(]"))     # Expected: False
    print(isValid("{[]}"))   # Expected: True`,
      javascript: `/**
 * @param {string} s
 * @return {boolean}
 */
var isValid = function(s) {
    // TODO: Implement stack logic
};

// Test Execution
console.log(isValid("()"));     // Expected: true
console.log(isValid("(]"));     // Expected: false
console.log(isValid("{[]}"));   // Expected: true`,
      cpp: `#include <string>
#include <stack>
#include <iostream>
using namespace std;

bool isValid(string s) {
    // TODO: Implement stack logic
    return false;
}

int main() {
    cout << (isValid("()") ? "true" : "false") << endl;     // Expected: true
    cout << (isValid("(]") ? "true" : "false") << endl;     // Expected: false
    cout << (isValid("{[]}") ? "true" : "false") << endl;   // Expected: true
    return 0;
}`,
      java: `import java.util.*;

public class Solution {
    public static boolean isValid(String s) {
        // TODO: Implement stack logic
        return false;
    }

    public static void main(String[] args) {
        System.out.println(isValid("()"));     // Expected: true
        System.out.println(isValid("(]"));     // Expected: false
        System.out.println(isValid("{[]}"));   // Expected: true
    }
}`
    },
    solutionCode: {
      python: `def isValid(s):
    stack = []
    mapping = { ")": "(", "}": "{", "]": "[" }
    
    for char in s:
        if char in mapping.values():
            stack.append(char)
        elif char in mapping.keys():
            if not stack or stack[-1] != mapping[char]:
                return False
            stack.pop()
            
    return len(stack) == 0`,
      javascript: `var isValid = function(s) {
    const stack = [];
    const map = { ')': '(', '}': '{', ']': '[' };
    
    for (let i = 0; i < s.length; i++) {
        const char = s[i];
        if (char === '(' || char === '{' || char === '[') {
            stack.push(char);
        } else {
            if (stack.length === 0 || stack[stack.length - 1] !== map[char]) {
                return false;
            }
            stack.pop();
        }
    }
    
    return stack.length === 0;
};`,
      cpp: `bool isValid(string s) {
    stack<char> st;
    unordered_map<char, char> map = {{')', '('}, {'}', '{'}, {']', '['}};
    
    for (char c : s) {
        if (c == '(' || c == '{' || c == '[') {
            st.push(c);
        } else {
            if (st.empty() || st.top() != map[c]) {
                return false;
            }
            st.pop();
        }
    }
    
    return st.empty();
}`,
      java: `public static boolean isValid(String s) {
    Deque<Character> stack = new ArrayDeque<>();
    Map<Character, Character> map = new HashMap<>();
    map.put(')', '(');
    map.put('}', '{');
    map.put(']', '[');
    
    for (char c : s.toCharArray()) {
        if (map.containsValue(c)) {
            stack.push(c);
        } else {
            if (stack.isEmpty() || stack.peek() != map.get(c)) {
                return false;
            }
            stack.pop();
        }
    }
    
    return stack.isEmpty();
}`
    },
    solutionExplanation: `We use a stack to keep track of unmatched opening brackets. As we iterate through the string, if we encounter an opening bracket (\`(\`, \`{\`, \`[\`), we push it onto the stack. If we encounter a closing bracket (\`)`, \`}\`, \`]\`), we check if the stack is empty (invalid) or if the top of the stack does not match the corresponding opening bracket (invalid). If it matches, we pop the top element. After processing all characters, the string is valid only if the stack is empty (all opened brackets were closed).`,
    testCases: [
      { id: 'tc-1', input: '"()"', expected: 'true' },
      { id: 'tc-2', input: '"(]"', expected: 'false' },
      { id: 'tc-3', input: '"{[]}"', expected: 'true' }
    ]
  },
  {
    id: 'dsa-sq-02',
    number: 2,
    title: 'Min Stack',
    slug: 'min-stack',
    category: 'Stack & Queues',
    difficulty: 'Medium',
    summary: 'Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.',
    description: `Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.\n\nImplement the \`MinStack\` class:\n* \`MinStack()\` initializes the stack object.\n* \`void push(int val)\` pushes the element \`val\` onto the stack.\n* \`void pop()\` removes the element on the top of the stack.\n* \`int top()\` gets the top element of the stack.\n* \`int getMin()\` retrieves the minimum element in the stack.`,
    examples: [
      {
        input: 'Operations: ["MinStack","push","push","push","getMin","pop","top","getMin"]\nValues: [[],[-2],[0],[-3],[],[],[],[]]',
        output: '[null,null,null,null,-3,null,0,-2]',
        explanation: 'Standard stack operations with min retrieval.'
      }
    ],
    constraints: [
      '-2^31 <= val <= 2^31 - 1',
      'Methods pop, top and getMin operations will always be called on non-empty stacks.',
      'At most 3 * 10^4 calls will be made to push, pop, top, and getMin.'
    ],
    keyPoints: [
      '**Brute Force**: Scan entire stack for min on every \`getMin\`. Time O(N) for getMin. Fails requirement.',
      '**Core Insight**: Auxiliary Stack. Maintain two stacks: one for data, one for mins. On push, push value to data stack and \`min(val, currentMin)\` to min stack. On pop, pop both. GetMin is simply top of min stack.',
      '**Edge Cases**: Single element, duplicate minimums (must handle correctly so popping doesn't lose the min reference if another same min exists below).',
      '**Space-Time Analysis**: O(1) time for all ops. O(N) space for auxiliary stack.'
    ],
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(N)',
    companies: ['Amazon', 'Microsoft', 'Bloomberg', 'LinkedIn'],
    starterCode: {
      python: `class MinStack:
    def __init__(self):
        # TODO: Initialize stacks
        pass

    def push(self, val: int) -> None:
        # TODO: Implement push
        pass

    def pop(self) -> None:
        # TODO: Implement pop
        pass

    def top(self) -> int:
        # TODO: Implement top
        pass

    def getMin(self) -> int:
        # TODO: Implement getMin
        pass

# Test Execution
if __name__ == "__main__":
    obj = MinStack()
    obj.push(-2)
    obj.push(0)
    obj.push(-3)
    print(obj.getMin()) # Expected: -3
    obj.pop()
    print(obj.top())    # Expected: 0
    print(obj.getMin()) # Expected: -2`,
      javascript: `var MinStack = function() {
    // TODO: Initialize stacks
};

MinStack.prototype.push = function(val) {
    // TODO: Implement push
};

MinStack.prototype.pop = function() {
    // TODO: Implement pop
};

MinStack.prototype.top = function() {
    // TODO: Implement top
};

MinStack.prototype.getMin = function() {
    // TODO: Implement getMin
};

// Test Execution
const obj = new MinStack();
obj.push(-2);
obj.push(0);
obj.push(-3);
console.log(obj.getMin()); // Expected: -3
obj.pop();
console.log(obj.top());    // Expected: 0
console.log(obj.getMin()); // Expected: -2`,
      cpp: `#include <vector>
#include <stack>
#include <algorithm>
#include <iostream>
using namespace std;

class MinStack {
private:
    // TODO: Declare stacks
public:
    MinStack() {
        // TODO: Init
    }
    
    void push(int val) {
        // TODO: Implement
    }
    
    void pop() {
        // TODO: Implement
    }
    
    int top() {
        // TODO: Implement
        return 0;
    }
    
    int getMin() {
        // TODO: Implement
        return 0;
    }
};

int main() {
    MinStack obj;
    obj.push(-2);
    obj.push(0);
    obj.push(-3);
    cout << obj.getMin() << endl; // Expected: -3
    obj.pop();
    cout << obj.top() << endl;    // Expected: 0
    cout << obj.getMin() << endl; // Expected: -2
    return 0;
}`,
      java: `import java.util.*;

public class MinStack {
    private Stack<Integer> stack;
    private Stack<Integer> minStack;

    public MinStack() {
        // TODO: Init
    }

    public void push(int val) {
        // TODO: Implement
    }

    public void pop() {
        // TODO: Implement
    }

    public int top() {
        // TODO: Implement
        return 0;
    }

    public int getMin() {
        // TODO: Implement
        return 0;
    }
    
    public static void main(String[] args) {
        MinStack obj = new MinStack();
        obj.push(-2);
        obj.push(0);
        obj.push(-3);
        System.out.println(obj.getMin()); // Expected: -3
        obj.pop();
        System.out.println(obj.top());    // Expected: 0
        System.out.println(obj.getMin()); // Expected: -2
    }
}`
    },
    solutionCode: {
      python: `class MinStack:
    def __init__(self):
        self.stack = []
        self.min_stack = []

    def push(self, val: int) -> None:
        self.stack.append(val)
        # If min_stack is empty, push val. Otherwise push min(val, current_min)
        if not self.min_stack:
            self.min_stack.append(val)
        else:
            self.min_stack.append(min(val, self.min_stack[-1]))

    def pop(self) -> None:
        self.stack.pop()
        self.min_stack.pop()

    def top(self) -> int:
        return self.stack[-1]

    def getMin(self) -> int:
        return self.min_stack[-1]`,
      javascript: `var MinStack = function() {
    this.stack = [];
    this.minStack = [];
};

MinStack.prototype.push = function(val) {
    this.stack.push(val);
    if (this.minStack.length === 0) {
        this.minStack.push(val);
    } else {
        this.minStack.push(Math.min(val, this.minStack[this.minStack.length - 1]));
    }
};

MinStack.prototype.pop = function() {
    this.stack.pop();
    this.minStack.pop();
};

MinStack.prototype.top = function() {
    return this.stack[this.stack.length - 1];
};

MinStack.prototype.getMin = function() {
    return this.minStack[this.minStack.length - 1];
};`,
      cpp: `class MinStack {
private:
    stack<int> st;
    stack<int> minSt;
public:
    MinStack() {}
    
    void push(int val) {
        st.push(val);
        if (minSt.empty()) {
            minSt.push(val);
        } else {
            minSt.push(min(val, minSt.top()));
        }
    }
    
    void pop() {
        st.pop();
        minSt.pop();
    }
    
    int top() {
        return st.top();
    }
    
    int getMin() {
        return minSt.top();
    }
};`,
      java: `public class MinStack {
    private Stack<Integer> stack;
    private Stack<Integer> minStack;

    public MinStack() {
        stack = new Stack<>();
        minStack = new Stack<>();
    }

    public void push(int val) {
        stack.push(val);
        if (minStack.isEmpty()) {
            minStack.push(val);
        } else {
            minStack.push(Math.min(val, minStack.peek()));
        }
    }

    public void pop() {
        stack.pop();
        minStack.pop();
    }

    public int top() {
        return stack.peek();
    }

    public int getMin() {
        return minStack.peek();
    }
}`
    },
    solutionExplanation: `To achieve O(1) time complexity for \`getMin\`, we maintain a secondary stack (\`minStack\`) alongside the main stack. The \`minStack\` stores the minimum value seen so far at each level of the main stack. When pushing a new value \`v\`, we push \`min(v, minStack.top())\` to \`minStack\`. When popping, we pop from both stacks. This ensures that the top of \`minStack\` always reflects the global minimum of the current state of the main stack.`,
    testCases: [
      { id: 'tc-1', input: 'Push [-2, 0, -3], GetMin, Pop, Top, GetMin', expected: '[-3, 0, -2]' },
      { id: 'tc-2', input: 'Push [1, 2], GetMin', expected: '[1]' },
      { id: 'tc-3', input: 'Push [5], Pop, Push [3], GetMin', expected: '[3]' }
    ]
  },
  {
    id: 'dsa-sq-03',
    number: 3,
    title: 'Evaluate Reverse Polish Notation',
    slug: 'evaluate-reverse-polish-notation',
    category: 'Stack & Queues',
    difficulty: 'Medium',
    summary: 'Evaluate the value of an arithmetic expression in RPN.',
    description: `Evaluate the value of an arithmetic expression in **Reverse Polish Notation**.\n\nValid operators are \`+\`, \`-\`, \`*\`, and \`/\`. Each operand may be an integer or another expression.\n\nNote that division between two integers should truncate toward zero.\n\nIt is guaranteed that the given RPN expression is always valid. That means the expression would always evaluate to a result, and there will not be any invalid operations.`,
    examples: [
      {
        input: 'tokens = ["2","1","+","3","*"]',
        output: '9',
        explanation: '((2 + 1) * 3) = 9.'
      },
      {
        input: 'tokens = ["4","13","5","/","+"]',
        output: '6',
        explanation: '(4 + (13 / 5)) = 6.'
      }
    ],
    constraints: [
      '1 <= tokens.length <= 10^4',
      'tokens[i] is either an operator ("+", "-", "*", "/") or an integer in the range [-300, 300].'
    ],
    keyPoints: [
      '**Brute Force**: Convert to infix then parse. Complex and error-prone.',
      '**Core Insight**: Stack Evaluation. Iterate tokens. If number, push. If operator, pop two operands (second popped is left operand, first is right), apply op, push result.',
      '**Edge Cases**: Division truncation towards zero (handle negative numbers carefully in C++/Java vs Python floor division). Large intermediate values.',
      '**Space-Time Analysis**: O(N) time, O(N) space.'
    ],
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(N)',
    companies: ['Amazon', 'Meta', 'Microsoft'],
    starterCode: {
      python: `def evalRPN(tokens):
    # TODO: Implement stack evaluation
    pass

# Test Execution
if __name__ == "__main__":
    print(evalRPN(["2","1","+","3","*"]))       # Expected: 9
    print(evalRPN(["4","13","5","/","+"]))      # Expected: 6`,
      javascript: `/**
 * @param {string[]} tokens
 * @return {number}
 */
var evalRPN = function(tokens) {
    // TODO: Implement stack evaluation
};

// Test Execution
console.log(evalRPN(["2","1","+","3","*"]));       // Expected: 9
console.log(evalRPN(["4","13","5","/","+"]));      // Expected: 6`,
      cpp: `#include <vector>
#include <stack>
#include <string>
#include <iostream>
using namespace std;

int evalRPN(vector<string>& tokens) {
    // TODO: Implement stack evaluation
    return 0;
}

int main() {
    vector<string> t1 = {"2","1","+","3","*"};
    cout << evalRPN(t1) << endl; // Expected: 9
    
    vector<string> t2 = {"4","13","5","/","+"};
    cout << evalRPN(t2) << endl; // Expected: 6
    return 0;
}`,
      java: `import java.util.*;

public class Solution {
    public static int evalRPN(String[] tokens) {
        // TODO: Implement stack evaluation
        return 0;
    }

    public static void main(String[] args) {
        String[] t1 = {"2","1","+","3","*"};
        System.out.println(evalRPN(t1)); // Expected: 9
        
        String[] t2 = {"4","13","5","/","+"};
        System.out.println(evalRPN(t2)); // Expected: 6
    }
}`
    },
    solutionCode: {
      python: `def evalRPN(tokens):
    stack = []
    for token in tokens:
        if token in "+-*/":
            b = stack.pop()
            a = stack.pop()
            if token == '+': stack.append(a + b)
            elif token == '-': stack.append(a - b)
            elif token == '*': stack.append(a * b)
            elif token == '/': 
                # Truncate towards zero
                res = a / b
                stack.append(int(res))
        else:
            stack.append(int(token))
    return stack[0]`,
      javascript: `var evalRPN = function(tokens) {
    const stack = [];
    for (let token of tokens) {
        if (token === '+' || token === '-' || token === '*' || token === '/') {
            let b = stack.pop();
            let a = stack.pop();
            switch (token) {
                case '+': stack.push(a + b); break;
                case '-': stack.push(a - b); break;
                case '*': stack.push(a * b); break;
                case '/': stack.push(parseInt(a / b)); break; // parseInt truncates towards zero
            }
        } else {
            stack.push(Number(token));
        }
    }
    return stack[0];
};`,
      cpp: `int evalRPN(vector<string>& tokens) {
    stack<int> st;
    for (string& token : tokens) {
        if (token == "+" || token == "-" || token == "*" || token == "/") {
            int b = st.top(); st.pop();
            int a = st.top(); st.pop();
            if (token == "+") st.push(a + b);
            else if (token == "-") st.push(a - b);
            else if (token == "*") st.push(a * b);
            else if (token == "/") st.push(a / b); // C++ integer division truncates towards zero
        } else {
            st.push(stoi(token));
        }
    }
    return st.top();
}`,
      java: `public static int evalRPN(String[] tokens) {
    Deque<Integer> stack = new ArrayDeque<>();
    for (String token : tokens) {
        if (token.equals("+") || token.equals("-") || token.equals("*") || token.equals("/")) {
            int b = stack.pop();
            int a = stack.pop();
            if (token.equals("+")) stack.push(a + b);
            else if (token.equals("-")) stack.push(a - b);
            else if (token.equals("*")) stack.push(a * b);
            else if (token.equals("/")) stack.push(a / b); // Java integer division truncates towards zero
        } else {
            stack.push(Integer.parseInt(token));
        }
    }
    return stack.pop();
}`
    },
    solutionExplanation: `We use a stack to hold operands. Iterating through tokens: if the token is a number, push it. If it's an operator, pop the top two elements. The second popped element is the left operand (\`a\`), and the first is the right operand (\`b\`). Perform the operation \`a op b\` and push the result back. Finally, the stack contains the single result. Note: Integer division in C++/Java naturally truncates towards zero, but in Python \`/\` is float division, so we cast to \`int\`.`,
    testCases: [
      { id: 'tc-1', input: '["2","1","+","3","*"]', expected: '9' },
      { id: 'tc-2', input: '["4","13","5","/","+"]', expected: '6' },
      { id: 'tc-3', input: '["10","6","9","3","+","-11","*","/","*","17","+","5","+"]', expected: '22' }
    ]
  },
  {
    id: 'dsa-sq-04',
    number: 4,
    title: 'Daily Temperatures',
    slug: 'daily-temperatures',
    category: 'Stack & Queues',
    difficulty: 'Medium',
    summary: 'Find how many days until a warmer temperature for each day.',
    description: `Given an array of integers \`temps\` which represents daily temperatures, return an array \`answer\` such that \`answer[i]\` is the number of days you have to wait after the \`i^{th}\` day to get a warmer temperature. If there is no future day for which this is possible, keep \`answer[i] == 0\` instead.`,
    examples: [
      {
        input: 'temps = [73,74,75,71,69,72,76,73]',
        output: '[1,1,4,2,1,1,0,0]',
        explanation: 'Day 0 waits 1 day for warmer. Day 2 waits 4 days...'
      }
    ],
    constraints: [
      '1 <= temps.length <= 10^5',
      '30 <= temps[i] <= 100'
    ],
    keyPoints: [
      '**Brute Force**: For each day, scan forward until warmer found. Time O(N^2). TLE.',
      '**Core Insight**: Monotonic Decreasing Stack. Store indices of days waiting for a warmer temp. Current day is warmer than stack top? Pop and calculate difference. Push current index.',
      '**Edge Cases**: Strictly decreasing temps (all 0s), strictly increasing (all 1s except last).',
      '**Space-Time Analysis**: O(N) time (each index pushed/popped once). O(N) space for stack.'
    ],
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(N)',
    companies: ['Amazon', 'Google', 'Adobe'],
    starterCode: {
      python: `def dailyTemperatures(temps):
    # TODO: Implement monotonic stack
    pass

# Test Execution
if __name__ == "__main__":
    print(dailyTemperatures([73,74,75,71,69,72,76,73])) # Expected: [1,1,4,2,1,1,0,0]`,
      javascript: `/**
 * @param {number[]} temps
 * @return {number[]}
 */
var dailyTemperatures = function(temps) {
    // TODO: Implement monotonic stack
};

// Test Execution
console.log(dailyTemperatures([73,74,75,71,69,72,76,73])); // Expected: [1,1,4,2,1,1,0,0]`,
      cpp: `#include <vector>
#include <stack>
#include <iostream>
using namespace std;

vector<int> dailyTemperatures(vector<int>& temps) {
    // TODO: Implement monotonic stack
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
    vector<int> t = {73,74,75,71,69,72,76,73};
    printVec(dailyTemperatures(t)); // Expected: [1,1,4,2,1,1,0,0]
    return 0;
}`,
      java: `import java.util.*;

public class Solution {
    public static int[] dailyTemperatures(int[] temps) {
        // TODO: Implement monotonic stack
        return new int[0];
    }

    public static void main(String[] args) {
        int[] t = {73,74,75,71,69,72,76,73};
        System.out.println(Arrays.toString(dailyTemperatures(t))); // Expected: [1, 1, 4, 2, 1, 1, 0, 0]
    }
}`
    },
    solutionCode: {
      python: `def dailyTemperatures(temps):
    n = len(temps)
    res = [0] * n
    stack = [] # Stores indices
    
    for i in range(n):
        while stack and temps[i] > temps[stack[-1]]:
            prev_idx = stack.pop()
            res[prev_idx] = i - prev_idx
        stack.append(i)
        
    return res`,
      javascript: `var dailyTemperatures = function(temps) {
    const n = temps.length;
    const res = new Array(n).fill(0);
    const stack = []; // Indices
    
    for (let i = 0; i < n; i++) {
        while (stack.length > 0 && temps[i] > temps[stack[stack.length - 1]]) {
            const prevIdx = stack.pop();
            res[prevIdx] = i - prevIdx;
        }
        stack.push(i);
    }
    
    return res;
};`,
      cpp: `vector<int> dailyTemperatures(vector<int>& temps) {
    int n = temps.size();
    vector<int> res(n, 0);
    stack<int> st; // Indices
    
    for (int i = 0; i < n; ++i) {
        while (!st.empty() && temps[i] > temps[st.top()]) {
            int prevIdx = st.top();
            st.pop();
            res[prevIdx] = i - prevIdx;
        }
        st.push(i);
    }
    
    return res;
}`,
      java: `public static int[] dailyTemperatures(int[] temps) {
    int n = temps.length;
    int[] res = new int[n];
    Deque<Integer> stack = new ArrayDeque<>(); // Indices
    
    for (int i = 0; i < n; i++) {
        while (!stack.isEmpty() && temps[i] > temps[stack.peekLast()]) {
            int prevIdx = stack.pollLast();
            res[prevIdx] = i - prevIdx;
        }
        stack.offerLast(i);
    }
    
    return res;
}`
    },
    solutionExplanation: `We use a stack to store indices of days that haven't yet found a warmer day. The stack maintains temperatures in decreasing order. As we iterate through \`temps\`, if the current temperature is higher than the temperature at the index stored at the top of the stack, we pop the index. The distance (\`current_index - popped_index\`) is the answer for that popped day. We repeat this until the stack is empty or the top is warmer/equal. Then we push the current index. Remaining indices in the stack never find a warmer day, so their answers remain 0.`,
    testCases: [
      { id: 'tc-1', input: '[73,74,75,71,69,72,76,73]', expected: '[1,1,4,2,1,1,0,0]' },
      { id: 'tc-2', input: '[30,40,50,60]', expected: '[1,1,1,0]' },
      { id: 'tc-3', input: '[50,60,30,20,10,70,80]', expected: '[1,4,1,1,0,1,0]' }
    ]
  },
  {
    id: 'dsa-sq-05',
    number: 5,
    title: 'Generate Parentheses',
    slug: 'generate-parentheses',
    category: 'Stack & Queues',
    difficulty: 'Medium',
    summary: 'Generate all combinations of well-formed parentheses.',
    description: `Given \`n\` pairs of parentheses, write a function to *generate all combinations of well-formed parentheses*.`,
    examples: [
      {
        input: 'n = 3',
        output: '["((()))","(()())","(())()","()(())","()()()"]',
        explanation: 'All valid structures for 3 pairs.'
      }
    ],
    constraints: [
      '1 <= n <= 8'
    ],
    keyPoints: [
      '**Brute Force**: Generate all $2^{2n}$ strings and validate. Exponential time, mostly invalid.',
      '**Core Insight**: Backtracking with Constraints. Build string recursively. Add \`(\` if count < n. Add \`)\` if count_open > count_close. Prune invalid branches early.',
      '**Edge Cases**: n=1, n=0 (not allowed per constraints but logically empty).',
      '**Space-Time Analysis**: Time proportional to Catalan Number $C_n$ ($\approx 4^n/n^{1.5}$). Space O(N) for recursion depth.'
    ],
    timeComplexity: 'O(4^N / sqrt(N))',
    spaceComplexity: 'O(N)',
    companies: ['Amazon', 'Microsoft', 'Apple', 'Google'],
    starterCode: {
      python: `def generateParenthesis(n):
    # TODO: Implement backtracking
    pass

# Test Execution
if __name__ == "__main__":
    print(generateParenthesis(3)) # Expected: list of 5 strings`,
      javascript: `/**
 * @param {number} n
 * @return {string[]}
 */
var generateParenthesis = function(n) {
    // TODO: Implement backtracking
};

// Test Execution
console.log(generateParenthesis(3)); // Expected: list of 5 strings`,
      cpp: `#include <vector>
#include <string>
#include <iostream>
using namespace std;

vector<string> generateParenthesis(int n) {
    // TODO: Implement backtracking
    return {};
}

void printVec(const vector<string>& v) {
    cout << "[";
    for(size_t i=0; i<v.size(); ++i) {
        cout << "\\"" << v[i] << "\\"";
        if(i < v.size()-1) cout << ",";
    }
    cout << "]" << endl;
}

int main() {
    printVec(generateParenthesis(3)); // Expected: 5 strings
    return 0;
}`,
      java: `import java.util.*;

public class Solution {
    public static List<String> generateParenthesis(int n) {
        // TODO: Implement backtracking
        return new ArrayList<>();
    }

    public static void main(String[] args) {
        System.out.println(generateParenthesis(3)); // Expected: 5 strings
    }
}`
    },
    solutionCode: {
      python: `def generateParenthesis(n):
    res = []
    
    def backtrack(current, open_count, close_count):
        if len(current) == 2 * n:
            res.append(current)
            return
            
        if open_count < n:
            backtrack(current + "(", open_count + 1, close_count)
            
        if close_count < open_count:
            backtrack(current + ")", open_count, close_count + 1)
            
    backtrack("", 0, 0)
    return res`,
      javascript: `var generateParenthesis = function(n) {
    const res = [];
    
    function backtrack(current, open, close) {
        if (current.length === 2 * n) {
            res.push(current);
            return;
        }
        
        if (open < n) {
            backtrack(current + "(", open + 1, close);
        }
        
        if (close < open) {
            backtrack(current + ")", open, close + 1);
        }
    }
    
    backtrack("", 0, 0);
    return res;
};`,
      cpp: `void backtrack(vector<string>& res, string current, int open, int close, int n) {
    if (current.length() == 2 * n) {
        res.push_back(current);
        return;
    }
    
    if (open < n) {
        backtrack(res, current + "(", open + 1, close, n);
    }
    
    if (close < open) {
        backtrack(res, current + ")", open, close + 1, n);
    }
}

vector<string> generateParenthesis(int n) {
    vector<string> res;
    backtrack(res, "", 0, 0, n);
    return res;
}`,
      java: `public static List<String> generateParenthesis(int n) {
    List<String> res = new ArrayList<>();
    backtrack(res, "", 0, 0, n);
    return res;
}

private static void backtrack(List<String> res, String current, int open, int close, int max) {
    if (current.length() == max * 2) {
        res.add(current);
        return;
    }
    
    if (open < max) {
        backtrack(res, current + "(", open + 1, close, max);
    }
    if (close < open) {
        backtrack(res, current + ")", open, close + 1, max);
    }
}`
    },
    solutionExplanation: `We use recursive backtracking to build strings character by character. We maintain counts of opening and closing parentheses used so far. We can add an opening parenthesis \`(\` if we haven't used \`n\` of them yet. We can add a closing parenthesis \`)\` only if the number of closing parens is strictly less than the number of opening parens (to ensure validity). When the string length reaches \`2*n\`, we add it to the results.`,
    testCases: [
      { id: 'tc-1', input: 'n=3', expected: '["((()))","(()())","(())()","()(())","()()()"]' },
      { id: 'tc-2', input: 'n=1', expected: '["()"]' },
      { id: 'tc-3', input: 'n=2', expected: '["(())","()()"]' }
    ]
  },
  {
    id: 'dsa-sq-06',
    number: 6,
    title: 'Largest Rectangle in Histogram',
    slug: 'largest-rectangle-in-histogram',
    category: 'Stack & Queues',
    difficulty: 'Hard',
    summary: 'Find the largest rectangular area in a histogram.',
    description: `Given an array of integers \`heights\` representing the histogram's bar height where the width of each bar is 1, return *the area of the largest rectangle in the histogram*.`,
    examples: [
      {
        input: 'heights = [2,1,5,6,2,3]',
        output: '10',
        explanation: 'The largest rectangle is shown in the area of size 10 (bars 5 and 6).'
      }
    ],
    constraints: [
      '1 <= heights.length <= 10^5',
      '0 <= heights[i] <= 10^4'
    ],
    keyPoints: [
      '**Brute Force**: For each bar, expand left/right while height >= current. Time O(N^2). TLE.',
      '**Core Insight**: Monotonic Increasing Stack. Stack stores indices. When a smaller bar is encountered, it signifies the right boundary for rectangles ending at previous bars. Calculate area using popped height and width determined by current index and new stack top.',
      '**Edge Cases**: All equal heights, strictly increasing/decreasing, zeros.',
      '**Space-Time Analysis**: O(N) time (each index pushed/popped once). O(N) space.'
    ],
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(N)',
    companies: ['Amazon', 'Google', 'Microsoft', 'Salesforce'],
    starterCode: {
      python: `def largestRectangleArea(heights):
    # TODO: Implement monotonic stack
    pass

# Test Execution
if __name__ == "__main__":
    print(largestRectangleArea([2,1,5,6,2,3])) # Expected: 10`,
      javascript: `/**
 * @param {number[]} heights
 * @return {number}
 */
var largestRectangleArea = function(heights) {
    // TODO: Implement monotonic stack
};

// Test Execution
console.log(largestRectangleArea([2,1,5,6,2,3])); // Expected: 10`,
      cpp: `#include <vector>
#include <stack>
#include <algorithm>
#include <iostream>
using namespace std;

int largestRectangleArea(vector<int>& heights) {
    // TODO: Implement monotonic stack
    return 0;
}

int main() {
    vector<int> h = {2, 1, 5, 6, 2, 3};
    cout << largestRectangleArea(h) << endl; // Expected: 10
    return 0;
}`,
      java: `import java.util.*;

public class Solution {
    public static int largestRectangleArea(int[] heights) {
        // TODO: Implement monotonic stack
        return 0;
    }

    public static void main(String[] args) {
        int[] h = {2, 1, 5, 6, 2, 3};
        System.out.println(largestRectangleArea(h)); // Expected: 10
    }
}`
    },
    solutionCode: {
      python: `def largestRectangleArea(heights):
    stack = [] # Indices
    max_area = 0
    n = len(heights)
    
    for i in range(n):
        while stack and heights[i] < heights[stack[-1]]:
            h = heights[stack.pop()]
            w = i if not stack else i - stack[-1] - 1
            max_area = max(max_area, h * w)
        stack.append(i)
        
    while stack:
        h = heights[stack.pop()]
        w = n if not stack else n - stack[-1] - 1
        max_area = max(max_area, h * w)
        
    return max_area`,
      javascript: `var largestRectangleArea = function(heights) {
    const stack = [];
    let maxArea = 0;
    const n = heights.length;
    
    for (let i = 0; i < n; i++) {
        while (stack.length > 0 && heights[i] < heights[stack[stack.length - 1]]) {
            const h = heights[stack.pop()];
            const w = stack.length === 0 ? i : i - stack[stack.length - 1] - 1;
            maxArea = Math.max(maxArea, h * w);
        }
        stack.push(i);
    }
    
    while (stack.length > 0) {
        const h = heights[stack.pop()];
        const w = stack.length === 0 ? n : n - stack[stack.length - 1] - 1;
        maxArea = Math.max(maxArea, h * w);
    }
    
    return maxArea;
};`,
      cpp: `int largestRectangleArea(vector<int>& heights) {
    stack<int> st;
    int maxArea = 0;
    int n = heights.size();
    
    for (int i = 0; i < n; ++i) {
        while (!st.empty() && heights[i] < heights[st.top()]) {
            int h = heights[st.top()];
            st.pop();
            int w = st.empty() ? i : i - st.top() - 1;
            maxArea = max(maxArea, h * w);
        }
        st.push(i);
    }
    
    while (!st.empty()) {
        int h = heights[st.top()];
        st.pop();
        int w = st.empty() ? n : n - st.top() - 1;
        maxArea = max(maxArea, h * w);
    }
    
    return maxArea;
}`,
      java: `public static int largestRectangleArea(int[] heights) {
    Deque<Integer> stack = new ArrayDeque<>();
    int maxArea = 0;
    int n = heights.length;
    
    for (int i = 0; i < n; i++) {
        while (!stack.isEmpty() && heights[i] < heights[stack.peekLast()]) {
            int h = heights[stack.pollLast()];
            int w = stack.isEmpty() ? i : i - stack.peekLast() - 1;
            maxArea = Math.max(maxArea, h * w);
        }
        stack.offerLast(i);
    }
    
    while (!stack.isEmpty()) {
        int h = heights[stack.pollLast()];
        int w = stack.isEmpty() ? n : n - stack.peekLast() - 1;
        maxArea = Math.max(maxArea, h * w);
    }
    
    return maxArea;
}`
    },
    solutionExplanation: `We use a stack to keep indices of bars in increasing order of height. When we encounter a bar shorter than the stack top, it means the rectangle defined by the stack top bar cannot extend further to the right. We pop the bar, calculate its height, and determine its width. The width extends from the popped index to the current index (exclusive) minus 1, bounded by the new stack top (previous smaller bar) on the left. After processing all bars, we clean up remaining bars in the stack similarly, assuming they extend to the end of the array.`,
    testCases: [
      { id: 'tc-1', input: '[2,1,5,6,2,3]', expected: '10' },
      { id: 'tc-2', input: '[2,4]', expected: '4' },
      { id: 'tc-3', input: '[1,1,1,1]', expected: '4' }
    ]
  }
];
