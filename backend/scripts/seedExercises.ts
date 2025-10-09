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
  {
    title: 'Sum Two Numbers',
    description: 'Write a function that takes two numbers as parameters and returns their sum.',
    difficulty: 'easy',
    language: 'Python',
    tags: ['math', 'basics', 'functions'],
    testCases: [
      {
        input: [2, 3],
        expectedOutput: 5,
        description: 'Basic addition',
      },
      {
        input: [10, 20],
        expectedOutput: 30,
        description: 'Larger numbers',
      },
      {
        input: [-5, 5],
        expectedOutput: 0,
        description: 'Negative and positive',
      },
    ],
    solution: 'def sum_two_numbers(a, b):\n    return a + b',
    starterCode: 'def sum_two_numbers(a, b):\n    # Write your code here\n    pass',
    hints: [
      'Use the + operator to add two numbers',
      'Make sure to return the result, not print it',
    ],
  },
  {
    title: 'Find Maximum in Array',
    description: 'Write a function that takes an array of numbers and returns the maximum value.',
    difficulty: 'easy',
    language: 'JavaScript',
    tags: ['arrays', 'loops', 'logic'],
    testCases: [
      {
        input: [[1, 5, 3, 9, 2]],
        expectedOutput: 9,
        description: 'Array with positive numbers',
      },
      {
        input: [[-10, -5, -20, -1]],
        expectedOutput: -1,
        description: 'Array with negative numbers',
      },
      {
        input: [[42]],
        expectedOutput: 42,
        description: 'Single element array',
      },
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
    title: 'Reverse a String',
    description: 'Write a function that takes a string and returns it reversed.',
    difficulty: 'easy',
    language: 'Python',
    tags: ['strings', 'basics', 'slicing'],
    testCases: [
      {
        input: ['hello'],
        expectedOutput: 'olleh',
        description: 'Simple word',
      },
      {
        input: ['Python'],
        expectedOutput: 'nohtyP',
        description: 'Capitalized word',
      },
      {
        input: ['12345'],
        expectedOutput: '54321',
        description: 'Numbers as string',
      },
    ],
    solution: 'def reverse_string(s):\n    return s[::-1]',
    starterCode: 'def reverse_string(s):\n    # Write your code here\n    pass',
    hints: [
      'In Python, you can use string slicing with [::-1]',
      'Alternatively, convert to list, reverse it, and join back',
    ],
  },
  {
    title: 'Check if Palindrome',
    description: 'Write a function that checks if a given string is a palindrome (reads the same forwards and backwards).',
    difficulty: 'medium',
    language: 'JavaScript',
    tags: ['strings', 'logic', 'algorithms'],
    testCases: [
      {
        input: ['racecar'],
        expectedOutput: true,
        description: 'Valid palindrome',
      },
      {
        input: ['hello'],
        expectedOutput: false,
        description: 'Not a palindrome',
      },
      {
        input: ['A man a plan a canal Panama'],
        expectedOutput: false,
        description: 'Palindrome with spaces (should return false as-is)',
      },
    ],
    solution: 'function isPalindrome(str) {\n    const reversed = str.split("").reverse().join("");\n    return str === reversed;\n}',
    starterCode: 'function isPalindrome(str) {\n    // Write your code here\n}',
    hints: [
      'Compare the string with its reversed version',
      'You might want to ignore case and spaces for a more robust solution',
    ],
  },
  {
    title: 'FizzBuzz',
    description: 'Write a function that prints numbers from 1 to n. For multiples of 3 print "Fizz", for multiples of 5 print "Buzz", and for multiples of both print "FizzBuzz".',
    difficulty: 'easy',
    language: 'Python',
    tags: ['loops', 'conditionals', 'classic'],
    testCases: [
      {
        input: [15],
        expectedOutput: [1, 2, 'Fizz', 4, 'Buzz', 'Fizz', 7, 8, 'Fizz', 'Buzz', 11, 'Fizz', 13, 14, 'FizzBuzz'],
        description: 'FizzBuzz from 1 to 15',
      },
      {
        input: [5],
        expectedOutput: [1, 2, 'Fizz', 4, 'Buzz'],
        description: 'FizzBuzz from 1 to 5',
      },
    ],
    solution: 'def fizzbuzz(n):\n    result = []\n    for i in range(1, n + 1):\n        if i % 15 == 0:\n            result.append("FizzBuzz")\n        elif i % 3 == 0:\n            result.append("Fizz")\n        elif i % 5 == 0:\n            result.append("Buzz")\n        else:\n            result.append(i)\n    return result',
    starterCode: 'def fizzbuzz(n):\n    # Write your code here\n    pass',
    hints: [
      'Use a loop from 1 to n',
      'Check divisibility by 15 first, then 3, then 5',
      'Use modulo operator (%) to check divisibility',
    ],
  },
  {
    title: 'Count Vowels',
    description: 'Write a function that counts the number of vowels (a, e, i, o, u) in a given string.',
    difficulty: 'easy',
    language: 'JavaScript',
    tags: ['strings', 'loops', 'counting'],
    testCases: [
      {
        input: ['hello world'],
        expectedOutput: 3,
        description: 'String with vowels',
      },
      {
        input: ['javascript'],
        expectedOutput: 3,
        description: 'Programming language',
      },
      {
        input: ['xyz'],
        expectedOutput: 0,
        description: 'No vowels',
      },
    ],
    solution: 'function countVowels(str) {\n    const vowels = "aeiouAEIOU";\n    let count = 0;\n    for (let char of str) {\n        if (vowels.includes(char)) count++;\n    }\n    return count;\n}',
    starterCode: 'function countVowels(str) {\n    // Write your code here\n}',
    hints: [
      'Create a string or array with all vowels',
      'Loop through each character and check if it\'s a vowel',
      'Don\'t forget to handle both uppercase and lowercase',
    ],
  },
  {
    title: 'Factorial',
    description: 'Write a function that calculates the factorial of a number n (n!).',
    difficulty: 'medium',
    language: 'Python',
    tags: ['math', 'recursion', 'algorithms'],
    testCases: [
      {
        input: [5],
        expectedOutput: 120,
        description: '5! = 5 × 4 × 3 × 2 × 1',
      },
      {
        input: [0],
        expectedOutput: 1,
        description: '0! = 1 by definition',
      },
      {
        input: [3],
        expectedOutput: 6,
        description: '3! = 3 × 2 × 1',
      },
    ],
    solution: 'def factorial(n):\n    if n == 0 or n == 1:\n        return 1\n    return n * factorial(n - 1)',
    starterCode: 'def factorial(n):\n    # Write your code here\n    pass',
    hints: [
      'You can solve this iteratively with a loop',
      'Or recursively by calling the function itself',
      'Remember: 0! = 1',
    ],
  },
  {
    title: 'Remove Duplicates',
    description: 'Write a function that takes an array and returns a new array with all duplicate values removed.',
    difficulty: 'medium',
    language: 'JavaScript',
    tags: ['arrays', 'sets', 'data-structures'],
    testCases: [
      {
        input: [[1, 2, 2, 3, 4, 4, 5]],
        expectedOutput: [1, 2, 3, 4, 5],
        description: 'Array with duplicates',
      },
      {
        input: [['a', 'b', 'a', 'c', 'b']],
        expectedOutput: ['a', 'b', 'c'],
        description: 'String array with duplicates',
      },
      {
        input: [[1, 2, 3]],
        expectedOutput: [1, 2, 3],
        description: 'No duplicates',
      },
    ],
    solution: 'function removeDuplicates(arr) {\n    return [...new Set(arr)];\n}',
    starterCode: 'function removeDuplicates(arr) {\n    // Write your code here\n}',
    hints: [
      'Use a Set to store unique values',
      'Convert the Set back to an array',
      'Alternatively, use filter() with indexOf()',
    ],
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

    console.log('\n🎉 Seed completed successfully!\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedExercises();