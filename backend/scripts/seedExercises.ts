// backend/scripts/seedExercises.ts

import mongoose, { Model } from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Define the Exercise schema directly here to avoid import issues
const exerciseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true },
  language: { type: String, required: true },
  tags: [{ type: String }],
  category: { 
    type: String, 
    enum: ['arrays', 'strings', 'loops', 'data-structures', 'algorithms', 'logic-math'], 
    required: true 
  },
  keywords: [{ type: String }],
  testCases: [{
    input: mongoose.Schema.Types.Mixed,
    expectedOutput: mongoose.Schema.Types.Mixed,
    description: String,
  }],
  solution: String,
  starterCode: String,
  hints: [String],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, {
  timestamps: true,
});

const Exercise = mongoose.models.Exercise || mongoose.model('Exercise', exerciseSchema);

const exercises = [
  // ========================================
  // ARRAYS CATEGORY (6 exercises)
  // ========================================
  {
    title: 'Find Maximum in Array',
    description: 'Write a function that takes an array of numbers and returns the maximum value.',
    difficulty: 'easy',
    language: 'javascript',
    category: 'arrays',
    keywords: ['max', 'maximum', 'array', 'loop'],
    tags: ['arrays', 'loops', 'logic'],
    testCases: [
      { input: [[1, 5, 3, 9, 2]], expectedOutput: 9, description: 'Array with positive numbers' },
      { input: [[-10, -5, -20, -1]], expectedOutput: -1, description: 'Array with negative numbers' },
      { input: [[42]], expectedOutput: 42, description: 'Single element array' },
    ],
    solution: 'function findMax(arr) {\n    return Math.max(...arr);\n}',
    starterCode: 'function findMax(arr) {\n    // Write your code here\n}',
    hints: [
      'You can use a loop to iterate through the array',
      'Keep track of the maximum value found so far',
      'Or use Math.max() with the spread operator',
    ],
  },
  {
    title: 'Remove Duplicates',
    description: 'Write a function that takes an array and returns a new array with all duplicate values removed.',
    difficulty: 'medium',
    language: 'javascript',
    category: 'arrays',
    keywords: ['duplicates', 'unique', 'set', 'filter'],
    tags: ['arrays', 'sets', 'data-structures'],
    testCases: [
      { input: [[1, 2, 2, 3, 4, 4, 5]], expectedOutput: [1, 2, 3, 4, 5], description: 'Array with duplicates' },
      { input: [['a', 'b', 'a', 'c', 'b']], expectedOutput: ['a', 'b', 'c'], description: 'String array with duplicates' },
      { input: [[1, 2, 3]], expectedOutput: [1, 2, 3], description: 'No duplicates' },
    ],
    solution: 'function removeDuplicates(arr) {\n    return [...new Set(arr)];\n}',
    starterCode: 'function removeDuplicates(arr) {\n    // Write your code here\n}',
    hints: ['Use a Set to store unique values', 'Convert the Set back to an array'],
  },
  {
    title: 'Two Sum',
    description: 'Given an array of integers and a target sum, return indices of two numbers that add up to the target.',
    difficulty: 'medium',
    language: 'python',
    category: 'arrays',
    keywords: ['two sum', 'indices', 'hash map', 'target'],
    tags: ['arrays', 'hash-map', 'algorithms'],
    testCases: [
      { input: [[2, 7, 11, 15], 9], expectedOutput: [0, 1], description: 'Target found at beginning' },
      { input: [[3, 2, 4], 6], expectedOutput: [1, 2], description: 'Target in middle' },
    ],
    solution: 'def two_sum(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in seen:\n            return [seen[complement], i]\n        seen[num] = i\n    return []',
    starterCode: 'def two_sum(nums, target):\n    # Write your code here\n    pass',
    hints: ['Use a hash map to store numbers and their indices', 'For each number, check if its complement exists'],
  },
  {
    title: 'Merge Sorted Arrays',
    description: 'Given two sorted arrays, merge them into one sorted array.',
    difficulty: 'medium',
    language: 'java',
    category: 'arrays',
    keywords: ['merge', 'sorted', 'two pointers'],
    tags: ['arrays', 'sorting', 'two-pointers'],
    testCases: [
      { input: [[1, 3, 5], [2, 4, 6]], expectedOutput: [1, 2, 3, 4, 5, 6], description: 'Two equal-length arrays' },
      { input: [[1, 2], [3, 4, 5]], expectedOutput: [1, 2, 3, 4, 5], description: 'Different lengths' },
    ],
    solution: 'public int[] merge(int[] arr1, int[] arr2) {\n    int[] result = new int[arr1.length + arr2.length];\n    int i = 0, j = 0, k = 0;\n    while (i < arr1.length && j < arr2.length) {\n        if (arr1[i] < arr2[j]) result[k++] = arr1[i++];\n        else result[k++] = arr2[j++];\n    }\n    while (i < arr1.length) result[k++] = arr1[i++];\n    while (j < arr2.length) result[k++] = arr2[j++];\n    return result;\n}',
    starterCode: 'public int[] merge(int[] arr1, int[] arr2) {\n    // Write your code here\n}',
    hints: ['Use two pointers to iterate both arrays', 'Compare elements and add the smaller one'],
  },
  {
    title: 'Rotate Array',
    description: 'Rotate an array to the right by k steps.',
    difficulty: 'medium',
    language: 'cpp',
    category: 'arrays',
    keywords: ['rotate', 'shift', 'cyclic'],
    tags: ['arrays', 'manipulation'],
    testCases: [
      { input: [[1, 2, 3, 4, 5], 2], expectedOutput: [4, 5, 1, 2, 3], description: 'Rotate by 2' },
      { input: [[1, 2], 3], expectedOutput: [2, 1], description: 'k greater than length' },
    ],
    solution: 'void rotate(vector<int>& nums, int k) {\n    k = k % nums.size();\n    reverse(nums.begin(), nums.end());\n    reverse(nums.begin(), nums.begin() + k);\n    reverse(nums.begin() + k, nums.end());\n}',
    starterCode: 'void rotate(vector<int>& nums, int k) {\n    // Write your code here\n}',
    hints: ['Use the reverse method three times', 'Handle k larger than array length'],
  },
  {
    title: 'Find Missing Number',
    description: 'Given an array containing n distinct numbers from 0 to n, find the missing number.',
    difficulty: 'easy',
    language: 'python',
    category: 'arrays',
    keywords: ['missing', 'sum', 'math'],
    tags: ['arrays', 'math'],
    testCases: [
      { input: [[3, 0, 1]], expectedOutput: 2, description: 'Missing 2' },
      { input: [[0, 1]], expectedOutput: 2, description: 'Missing 2 from [0,1,2]' },
    ],
    solution: 'def missing_number(nums):\n    n = len(nums)\n    expected_sum = n * (n + 1) // 2\n    actual_sum = sum(nums)\n    return expected_sum - actual_sum',
    starterCode: 'def missing_number(nums):\n    # Write your code here\n    pass',
    hints: ['Calculate expected sum using formula n*(n+1)/2', 'Subtract actual sum from expected'],
  },

  // ========================================
  // STRINGS CATEGORY (6 exercises)
  // ========================================
  {
    title: 'Reverse a String',
    description: 'Write a function that takes a string and returns it reversed.',
    difficulty: 'easy',
    language: 'python',
    category: 'strings',
    keywords: ['reverse', 'slice', 'backwards'],
    tags: ['strings', 'basics', 'slicing'],
    testCases: [
      { input: ['hello'], expectedOutput: 'olleh', description: 'Simple word' },
      { input: ['Python'], expectedOutput: 'nohtyP', description: 'Capitalized word' },
    ],
    solution: 'def reverse_string(s):\n    return s[::-1]',
    starterCode: 'def reverse_string(s):\n    # Write your code here\n    pass',
    hints: ['In Python, you can use string slicing with [::-1]'],
  },
  {
    title: 'Check if Palindrome',
    description: 'Write a function that checks if a given string is a palindrome.',
    difficulty: 'medium',
    language: 'javascript',
    category: 'strings',
    keywords: ['palindrome', 'reverse', 'equal'],
    tags: ['strings', 'logic', 'algorithms'],
    testCases: [
      { input: ['racecar'], expectedOutput: true, description: 'Valid palindrome' },
      { input: ['hello'], expectedOutput: false, description: 'Not a palindrome' },
    ],
    solution: 'function isPalindrome(str) {\n    const reversed = str.split("").reverse().join("");\n    return str === reversed;\n}',
    starterCode: 'function isPalindrome(str) {\n    // Write your code here\n}',
    hints: ['Compare the string with its reversed version'],
  },
  {
    title: 'Count Vowels',
    description: 'Write a function that counts the number of vowels (a, e, i, o, u) in a given string.',
    difficulty: 'easy',
    language: 'javascript',
    category: 'strings',
    keywords: ['vowels', 'count', 'aeiou'],
    tags: ['strings', 'loops', 'counting'],
    testCases: [
      { input: ['hello world'], expectedOutput: 3, description: 'String with vowels' },
      { input: ['xyz'], expectedOutput: 0, description: 'No vowels' },
    ],
    solution: 'function countVowels(str) {\n    const vowels = "aeiouAEIOU";\n    let count = 0;\n    for (let char of str) {\n        if (vowels.includes(char)) count++;\n    }\n    return count;\n}',
    starterCode: 'function countVowels(str) {\n    // Write your code here\n}',
    hints: ['Loop through each character and check if it\'s a vowel'],
  },
  {
    title: 'Longest Common Prefix',
    description: 'Write a function to find the longest common prefix string amongst an array of strings.',
    difficulty: 'medium',
    language: 'python',
    category: 'strings',
    keywords: ['prefix', 'common', 'substring'],
    tags: ['strings', 'algorithms'],
    testCases: [
      { input: [['flower', 'flow', 'flight']], expectedOutput: 'fl', description: 'Common prefix "fl"' },
      { input: [['dog', 'racecar', 'car']], expectedOutput: '', description: 'No common prefix' },
    ],
    solution: 'def longest_common_prefix(strs):\n    if not strs:\n        return ""\n    prefix = strs[0]\n    for s in strs[1:]:\n        while not s.startswith(prefix):\n            prefix = prefix[:-1]\n            if not prefix:\n                return ""\n    return prefix',
    starterCode: 'def longest_common_prefix(strs):\n    # Write your code here\n    pass',
    hints: ['Start with the first string as prefix', 'Compare with each string and trim prefix'],
  },
  {
    title: 'Valid Anagram',
    description: 'Given two strings, determine if they are anagrams of each other.',
    difficulty: 'easy',
    language: 'java',
    category: 'strings',
    keywords: ['anagram', 'sort', 'frequency'],
    tags: ['strings', 'sorting', 'hash-map'],
    testCases: [
      { input: ['listen', 'silent'], expectedOutput: true, description: 'Valid anagram' },
      { input: ['hello', 'world'], expectedOutput: false, description: 'Not an anagram' },
    ],
    solution: 'public boolean isAnagram(String s, String t) {\n    if (s.length() != t.length()) return false;\n    char[] sArr = s.toCharArray();\n    char[] tArr = t.toCharArray();\n    Arrays.sort(sArr);\n    Arrays.sort(tArr);\n    return Arrays.equals(sArr, tArr);\n}',
    starterCode: 'public boolean isAnagram(String s, String t) {\n    // Write your code here\n}',
    hints: ['Sort both strings and compare', 'Or use a frequency map'],
  },
  {
    title: 'String Compression',
    description: 'Compress a string by counting consecutive characters (e.g., "aabcc" becomes "a2b1c2").',
    difficulty: 'medium',
    language: 'cpp',
    category: 'strings',
    keywords: ['compress', 'count', 'consecutive'],
    tags: ['strings', 'manipulation'],
    testCases: [
      { input: ['aabccc'], expectedOutput: 'a2b1c3', description: 'Compressed string' },
      { input: ['abc'], expectedOutput: 'a1b1c1', description: 'No compression' },
    ],
    solution: 'string compress(string s) {\n    string result = "";\n    int count = 1;\n    for (int i = 1; i <= s.length(); i++) {\n        if (i < s.length() && s[i] == s[i-1]) {\n            count++;\n        } else {\n            result += s[i-1] + to_string(count);\n            count = 1;\n        }\n    }\n    return result;\n}',
    starterCode: 'string compress(string s) {\n    // Write your code here\n}',
    hints: ['Count consecutive characters', 'Append character and count to result'],
  },

  // ========================================
  // LOOPS CATEGORY (4 exercises)
  // ========================================
  {
    title: 'FizzBuzz',
    description: 'Print numbers from 1 to n. For multiples of 3 print "Fizz", for 5 print "Buzz", for both print "FizzBuzz".',
    difficulty: 'easy',
    language: 'python',
    category: 'loops',
    keywords: ['fizzbuzz', 'modulo', 'divisible'],
    tags: ['loops', 'conditionals', 'classic'],
    testCases: [
      { input: [15], expectedOutput: [1, 2, 'Fizz', 4, 'Buzz', 'Fizz', 7, 8, 'Fizz', 'Buzz', 11, 'Fizz', 13, 14, 'FizzBuzz'], description: 'FizzBuzz 1-15' },
    ],
    solution: 'def fizzbuzz(n):\n    result = []\n    for i in range(1, n + 1):\n        if i % 15 == 0:\n            result.append("FizzBuzz")\n        elif i % 3 == 0:\n            result.append("Fizz")\n        elif i % 5 == 0:\n            result.append("Buzz")\n        else:\n            result.append(i)\n    return result',
    starterCode: 'def fizzbuzz(n):\n    # Write your code here\n    pass',
    hints: ['Check divisibility by 15 first, then 3, then 5'],
  },
  {
    title: 'Sum of Multiples',
    description: 'Find the sum of all multiples of 3 or 5 below n.',
    difficulty: 'easy',
    language: 'javascript',
    category: 'loops',
    keywords: ['sum', 'multiples', 'divisible'],
    tags: ['loops', 'math'],
    testCases: [
      { input: [10], expectedOutput: 23, description: 'Sum of 3,5,6,9' },
      { input: [20], expectedOutput: 78, description: 'Sum up to 20' },
    ],
    solution: 'function sumMultiples(n) {\n    let sum = 0;\n    for (let i = 0; i < n; i++) {\n        if (i % 3 === 0 || i % 5 === 0) {\n            sum += i;\n        }\n    }\n    return sum;\n}',
    starterCode: 'function sumMultiples(n) {\n    // Write your code here\n}',
    hints: ['Loop from 0 to n-1', 'Check if divisible by 3 or 5'],
  },
  {
    title: 'Print Pattern',
    description: 'Print a pyramid pattern with n rows using asterisks.',
    difficulty: 'medium',
    language: 'python',
    category: 'loops',
    keywords: ['pattern', 'pyramid', 'nested loops'],
    tags: ['loops', 'patterns'],
    testCases: [
      { input: [3], expectedOutput: ['  *  ', ' *** ', '*****'], description: 'Pyramid with 3 rows' },
    ],
    solution: 'def print_pattern(n):\n    result = []\n    for i in range(n):\n        spaces = " " * (n - i - 1)\n        stars = "*" * (2 * i + 1)\n        result.append(spaces + stars + spaces)\n    return result',
    starterCode: 'def print_pattern(n):\n    # Write your code here\n    pass',
    hints: ['Use nested loops', 'Calculate spaces and stars for each row'],
  },
  {
    title: 'Find Prime Numbers',
    description: 'Return all prime numbers up to n.',
    difficulty: 'medium',
    language: 'java',
    category: 'loops',
    keywords: ['prime', 'sieve', 'divisibility'],
    tags: ['loops', 'algorithms', 'math'],
    testCases: [
      { input: [10], expectedOutput: [2, 3, 5, 7], description: 'Primes up to 10' },
      { input: [20], expectedOutput: [2, 3, 5, 7, 11, 13, 17, 19], description: 'Primes up to 20' },
    ],
    solution: 'public List<Integer> findPrimes(int n) {\n    List<Integer> primes = new ArrayList<>();\n    for (int i = 2; i <= n; i++) {\n        boolean isPrime = true;\n        for (int j = 2; j <= Math.sqrt(i); j++) {\n            if (i % j == 0) {\n                isPrime = false;\n                break;\n            }\n        }\n        if (isPrime) primes.add(i);\n    }\n    return primes;\n}',
    starterCode: 'public List<Integer> findPrimes(int n) {\n    // Write your code here\n}',
    hints: ['Check divisibility up to square root', 'Use nested loops'],
  },

  // ========================================
  // DATA STRUCTURES CATEGORY (4 exercises)
  // ========================================
  {
    title: 'Implement Stack',
    description: 'Implement a stack data structure with push, pop, and peek operations.',
    difficulty: 'medium',
    language: 'python',
    category: 'data-structures',
    keywords: ['stack', 'lifo', 'push', 'pop'],
    tags: ['data-structures', 'stack'],
    testCases: [
      { input: [['push', 1], ['push', 2], ['pop'], ['peek']], expectedOutput: 1, description: 'Stack operations' },
    ],
    solution: 'class Stack:\n    def __init__(self):\n        self.items = []\n    def push(self, item):\n        self.items.append(item)\n    def pop(self):\n        return self.items.pop() if self.items else None\n    def peek(self):\n        return self.items[-1] if self.items else None',
    starterCode: 'class Stack:\n    def __init__(self):\n        # Write your code here\n        pass',
    hints: ['Use a list to store items', 'Push adds to end, pop removes from end'],
  },
  {
    title: 'Implement Queue',
    description: 'Implement a queue data structure with enqueue, dequeue operations.',
    difficulty: 'medium',
    language: 'javascript',
    category: 'data-structures',
    keywords: ['queue', 'fifo', 'enqueue', 'dequeue'],
    tags: ['data-structures', 'queue'],
    testCases: [
      { input: [['enqueue', 1], ['enqueue', 2], ['dequeue']], expectedOutput: 1, description: 'Queue operations' },
    ],
    solution: 'class Queue {\n    constructor() {\n        this.items = [];\n    }\n    enqueue(item) {\n        this.items.push(item);\n    }\n    dequeue() {\n        return this.items.shift();\n    }\n}',
    starterCode: 'class Queue {\n    constructor() {\n        // Write your code here\n    }\n}',
    hints: ['Use an array', 'Enqueue adds to end, dequeue removes from front'],
  },
  {
    title: 'Valid Parentheses',
    description: 'Given a string of parentheses, determine if they are balanced.',
    difficulty: 'medium',
    language: 'python',
    category: 'data-structures',
    keywords: ['parentheses', 'balanced', 'stack'],
    tags: ['data-structures', 'stack', 'strings'],
    testCases: [
      { input: ['()[]{}'], expectedOutput: true, description: 'Valid parentheses' },
      { input: ['(]'], expectedOutput: false, description: 'Invalid parentheses' },
    ],
    solution: 'def is_valid(s):\n    stack = []\n    mapping = {")": "(", "}": "{", "]": "["}\n    for char in s:\n        if char in mapping:\n            if not stack or stack.pop() != mapping[char]:\n                return False\n        else:\n            stack.append(char)\n    return len(stack) == 0',
    starterCode: 'def is_valid(s):\n    # Write your code here\n    pass',
    hints: ['Use a stack', 'Push opening brackets, pop for closing'],
  },
  {
    title: 'Binary Search Tree Insert',
    description: 'Insert a value into a binary search tree.',
    difficulty: 'hard',
    language: 'cpp',
    category: 'data-structures',
    keywords: ['bst', 'tree', 'insert', 'recursive'],
    tags: ['data-structures', 'trees', 'recursion'],
    testCases: [
      { input: [[5, 3, 7], 4], expectedOutput: [5, 3, 7, 4], description: 'Insert 4 into BST' },
    ],
    solution: 'TreeNode* insert(TreeNode* root, int val) {\n    if (!root) return new TreeNode(val);\n    if (val < root->val) root->left = insert(root->left, val);\n    else root->right = insert(root->right, val);\n    return root;\n}',
    starterCode: 'TreeNode* insert(TreeNode* root, int val) {\n    // Write your code here\n}',
    hints: ['Use recursion', 'Compare value with root'],
  },

  // ========================================
  // ALGORITHMS CATEGORY (4 exercises)
  // ========================================
  {
    title: 'Binary Search',
    description: 'Implement binary search on a sorted array.',
    difficulty: 'medium',
    language: 'python',
    category: 'algorithms',
    keywords: ['binary search', 'divide and conquer', 'sorted'],
    tags: ['algorithms', 'search'],
    testCases: [
      { input: [[1, 2, 3, 4, 5], 3], expectedOutput: 2, description: 'Find index of 3' },
      { input: [[1, 2, 3, 4, 5], 6], expectedOutput: -1, description: 'Element not found' },
    ],
    solution: 'def binary_search(arr, target):\n    left, right = 0, len(arr) - 1\n    while left <= right:\n        mid = (left + right) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    return -1',
    starterCode: 'def binary_search(arr, target):\n    # Write your code here\n    pass',
    hints: ['Use two pointers', 'Compare middle element with target'],
  },
  {
    title: 'Bubble Sort',
    description: 'Implement the bubble sort algorithm.',
    difficulty: 'easy',
    language: 'javascript',
    category: 'algorithms',
    keywords: ['bubble sort', 'sorting', 'swap'],
    tags: ['algorithms', 'sorting'],
    testCases: [
      { input: [[5, 2, 8, 1, 9]], expectedOutput: [1, 2, 5, 8, 9], description: 'Sort array' },
    ],
    solution: 'function bubbleSort(arr) {\n    for (let i = 0; i < arr.length; i++) {\n        for (let j = 0; j < arr.length - i - 1; j++) {\n            if (arr[j] > arr[j + 1]) {\n                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];\n            }\n        }\n    }\n    return arr;\n}',
    starterCode: 'function bubbleSort(arr) {\n    // Write your code here\n}',
    hints: ['Compare adjacent elements', 'Swap if out of order'],
  },
  {
    title: 'Fibonacci Sequence',
    description: 'Return the nth Fibonacci number.',
    difficulty: 'easy',
    language: 'python',
    category: 'algorithms',
    keywords: ['fibonacci', 'recursion', 'dynamic programming'],
    tags: ['algorithms', 'recursion', 'math'],
    testCases: [
      { input: [5], expectedOutput: 5, description: 'Fib(5) = 5' },
      { input: [10], expectedOutput: 55, description: 'Fib(10) = 55' },
    ],
    solution: 'def fibonacci(n):\n    if n <= 1:\n        return n\n    return fibonacci(n-1) + fibonacci(n-2)',
    starterCode: 'def fibonacci(n):\n    # Write your code here\n    pass',
    hints: ['Use recursion or iteration', 'Base cases: fib(0)=0, fib(1)=1'],
  },
  {
    title: 'Quick Sort',
    description: 'Implement the quick sort algorithm.',
    difficulty: 'hard',
    language: 'java',
    category: 'algorithms',
    keywords: ['quick sort', 'partition', 'divide and conquer'],
    tags: ['algorithms', 'sorting', 'recursion'],
    testCases: [
      { input: [[3, 6, 8, 10, 1, 2, 1]], expectedOutput: [1, 1, 2, 3, 6, 8, 10], description: 'Sort array' },
    ],
    solution: 'public void quickSort(int[] arr, int low, int high) {\n    if (low < high) {\n        int pi = partition(arr, low, high);\n        quickSort(arr, low, pi - 1);\n        quickSort(arr, pi + 1, high);\n    }\n}\nprivate int partition(int[] arr, int low, int high) {\n    int pivot = arr[high];\n    int i = low - 1;\n    for (int j = low; j < high; j++) {\n        if (arr[j] < pivot) {\n            i++;\n            int temp = arr[i];\n            arr[i] = arr[j];\n            arr[j] = temp;\n        }\n    }\n    int temp = arr[i + 1];\n    arr[i + 1] = arr[high];\n    arr[high] = temp;\n    return i + 1;\n}',
    starterCode: 'public void quickSort(int[] arr, int low, int high) {\n    // Write your code here\n}',
    hints: ['Choose a pivot', 'Partition array around pivot', 'Recursively sort subarrays'],
  },

  // ========================================
  // LOGIC & MATH CATEGORY (6 exercises)
  // ========================================
  {
    title: 'Sum Two Numbers',
    description: 'Write a function that takes two numbers as parameters and returns their sum.',
    difficulty: 'easy',
    language: 'python',
    category: 'logic-math',
    keywords: ['sum', 'addition', 'basic'],
    tags: ['math', 'basics', 'functions'],
    testCases: [
      { input: [2, 3], expectedOutput: 5, description: 'Basic addition' },
      { input: [-5, 5], expectedOutput: 0, description: 'Negative and positive' },
    ],
    solution: 'def sum_two_numbers(a, b):\n    return a + b',
    starterCode: 'def sum_two_numbers(a, b):\n    # Write your code here\n    pass',
    hints: ['Use the + operator'],
  },
  {
    title: 'Factorial',
    description: 'Calculate the factorial of a number n (n!).',
    difficulty: 'medium',
    language: 'python',
    category: 'logic-math',
    keywords: ['factorial', 'recursion', 'multiply'],
    tags: ['math', 'recursion', 'algorithms'],
    testCases: [
      { input: [5], expectedOutput: 120, description: '5! = 120' },
      { input: [0], expectedOutput: 1, description: '0! = 1' },
    ],
    solution: 'def factorial(n):\n    if n == 0 or n == 1:\n        return 1\n    return n * factorial(n - 1)',
    starterCode: 'def factorial(n):\n    # Write your code here\n    pass',
    hints: ['Use recursion or iteration', '0! = 1'],
  },
  {
    title: 'Prime Number Check',
    description: 'Check if a number is prime.',
    difficulty: 'easy',
    language: 'javascript',
    category: 'logic-math',
    keywords: ['prime', 'divisible', 'check'],
    tags: ['math', 'logic'],
    testCases: [
      { input: [7], expectedOutput: true, description: '7 is prime' },
      { input: [4], expectedOutput: false, description: '4 is not prime' },
    ],
    solution: 'function isPrime(n) {\n    if (n <= 1) return false;\n    for (let i = 2; i <= Math.sqrt(n); i++) {\n        if (n % i === 0) return false;\n    }\n    return true;\n}',
    starterCode: 'function isPrime(n) {\n    // Write your code here\n}',
    hints: ['Check divisibility from 2 to sqrt(n)'],
  },
  {
    title: 'Greatest Common Divisor',
    description: 'Find the GCD of two numbers.',
    difficulty: 'medium',
    language: 'python',
    category: 'logic-math',
    keywords: ['gcd', 'euclidean', 'divisor'],
    tags: ['math', 'algorithms'],
    testCases: [
      { input: [48, 18], expectedOutput: 6, description: 'GCD(48, 18) = 6' },
      { input: [7, 13], expectedOutput: 1, description: 'GCD(7, 13) = 1' },
    ],
    solution: 'def gcd(a, b):\n    while b:\n        a, b = b, a % b\n    return a',
    starterCode: 'def gcd(a, b):\n    # Write your code here\n    pass',
    hints: ['Use Euclidean algorithm', 'Use modulo operator'],
  },
  {
    title: 'Power of Two',
    description: 'Check if a number is a power of two.',
    difficulty: 'easy',
    language: 'java',
    category: 'logic-math',
    keywords: ['power', 'bitwise', 'two'],
    tags: ['math', 'bit-manipulation'],
    testCases: [
      { input: [16], expectedOutput: true, description: '16 = 2^4' },
      { input: [18], expectedOutput: false, description: '18 is not power of 2' },
    ],
    solution: 'public boolean isPowerOfTwo(int n) {\n    return n > 0 && (n & (n - 1)) == 0;\n}',
    starterCode: 'public boolean isPowerOfTwo(int n) {\n    // Write your code here\n}',
    hints: ['Use bitwise AND operation', 'n & (n-1) should be 0'],
  },
  {
    title: 'Calculate Average',
    description: 'Calculate the average of an array of numbers.',
    difficulty: 'easy',
    language: 'javascript',
    category: 'logic-math',
    keywords: ['average', 'mean', 'sum'],
    tags: ['math', 'arrays'],
    testCases: [
      { input: [[1, 2, 3, 4, 5]], expectedOutput: 3, description: 'Average of 1-5' },
      { input: [[10, 20]], expectedOutput: 15, description: 'Average of 10,20' },
    ],
    solution: 'function average(arr) {\n    return arr.reduce((a, b) => a + b, 0) / arr.length;\n}',
    starterCode: 'function average(arr) {\n    // Write your code here\n}',
    hints: ['Sum all numbers and divide by length'],
  },
];

async function seedExercises() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/agentlogic';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Clear existing exercises
    await Exercise.deleteMany({});
    console.log('🗑️  Cleared existing exercises');

    // Insert seed data
    await Exercise.insertMany(exercises);
    console.log(`✅ Inserted ${exercises.length} exercises`);

    // Show summary by category
    const summary = exercises.reduce((acc: any, ex) => {
      acc[ex.category] = (acc[ex.category] || 0) + 1;
      return acc;
    }, {});
    
    console.log('\n📊 Exercises by category:');
    Object.entries(summary).forEach(([cat, count]) => {
      console.log(`   ${cat}: ${count}`);
    });

    console.log('\n🎉 Seed completed successfully!\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedExercises();