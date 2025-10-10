// frontend/src/services/testExecutionService.ts

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface TestCase {
  input: any[];
  expectedOutput: any;
}

export interface TestResult {
  passed: boolean;
  input: any[];
  expectedOutput: any;
  actualOutput: any;
  error: string | null;
  executionTime: number;
}

export interface RunTestsResponse {
  success: boolean;
  results: TestResult[];
  summary: {
    total: number;
    passed: number;
    failed: number;
    allPassed: boolean;
  };
}

/**
 * Execute code and run tests
 */
export const runTests = async (
  code: string,
  testCases: TestCase[],
  language: string,
  functionName?: string
): Promise<RunTestsResponse> => {
  try {
    const response = await axios.post<RunTestsResponse>(
      `${API_URL}/test-execution/run`,
      {
        code,
        testCases,
        language,
        functionName,
      },
      {
        timeout: 30000, // 30 seconds timeout
      }
    );

    return response.data;
  } catch (error: any) {
    console.error('Error running tests:', error);
    
    if (error.response?.data) {
      throw new Error(error.response.data.message || 'Failed to run tests');
    }
    
    throw new Error('Network error: Could not connect to test execution service');
  }
};

export const testExecutionService = {
  runTests,
};