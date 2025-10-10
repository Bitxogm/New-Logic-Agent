// backend/src/controllers/testExecutionController.ts

import { Request, Response } from 'express';
import { VM } from 'vm2';
import { spawn } from 'child_process';
import logger from '../config/logger.config';

interface TestCase {
  input: any[];
  expectedOutput: any;
}

interface RunTestsRequest {
  code: string;
  testCases: TestCase[];
  language: string;
  functionName?: string;
}

interface TestResult {
  passed: boolean;
  input: any[];
  expectedOutput: any;
  actualOutput: any;
  error: string | null;
  executionTime: number;
}

/**
 * Execute JavaScript code in a sandboxed environment
 */
const executeJavaScript = async (code: string, testCase: TestCase, functionName?: string): Promise<TestResult> => {
  const startTime = Date.now();

  try {
    const vm = new VM({
      timeout: 5000, // 5 seconds timeout
      sandbox: {},
    });

    // Prepare code execution
    let fullCode = code;
    
    // If function name is provided, call it with test inputs
    if (functionName) {
      const inputArgs = testCase.input.map(arg => JSON.stringify(arg)).join(', ');
      fullCode += `\n${functionName}(${inputArgs});`;
    } else {
      // Try to find function name from code
      const funcMatch = code.match(/function\s+(\w+)/);
      const arrowMatch = code.match(/const\s+(\w+)\s*=/);
      const detectedName = funcMatch?.[1] || arrowMatch?.[1];
      
      if (detectedName) {
        const inputArgs = testCase.input.map(arg => JSON.stringify(arg)).join(', ');
        fullCode += `\n${detectedName}(${inputArgs});`;
      }
    }

    const result = vm.run(fullCode);
    const executionTime = Date.now() - startTime;

    // Compare results
    const passed = JSON.stringify(result) === JSON.stringify(testCase.expectedOutput);

    return {
      passed,
      input: testCase.input,
      expectedOutput: testCase.expectedOutput,
      actualOutput: result,
      error: null,
      executionTime,
    };
  } catch (error: any) {
    const executionTime = Date.now() - startTime;
    return {
      passed: false,
      input: testCase.input,
      expectedOutput: testCase.expectedOutput,
      actualOutput: null,
      error: error.message || 'Execution error',
      executionTime,
    };
  }
};

/**
 * Execute Python code using child process
 */
const executePython = async (code: string, testCase: TestCase, functionName?: string): Promise<TestResult> => {
  const startTime = Date.now();

  return new Promise((resolve) => {
    try {
      // Detect function name if not provided
      let detectedName = functionName;
      if (!detectedName) {
        const funcMatch = code.match(/def\s+(\w+)/);
        detectedName = funcMatch?.[1] || 'main';
      }

      // Prepare Python script with test case
      const inputArgs = testCase.input.map(arg => JSON.stringify(arg)).join(', ');
      const pythonScript = `
import json
import sys

${code}

try:
    result = ${detectedName}(${inputArgs})
    print(json.dumps(result))
except Exception as e:
    print(json.dumps({"error": str(e)}), file=sys.stderr)
    sys.exit(1)
`;

      const python = spawn('python3', ['-c', pythonScript]);
      let stdout = '';
      let stderr = '';

      python.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      python.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      // Timeout after 5 seconds
      const timeout = setTimeout(() => {
        python.kill();
        const executionTime = Date.now() - startTime;
        resolve({
          passed: false,
          input: testCase.input,
          expectedOutput: testCase.expectedOutput,
          actualOutput: null,
          error: 'Execution timeout (5s)',
          executionTime,
        });
      }, 5000);

      python.on('close', (exitCode) => {
        clearTimeout(timeout);
        const executionTime = Date.now() - startTime;

        if (exitCode !== 0) {
          resolve({
            passed: false,
            input: testCase.input,
            expectedOutput: testCase.expectedOutput,
            actualOutput: null,
            error: stderr || 'Python execution error',
            executionTime,
          });
          return;
        }

        try {
          const result = JSON.parse(stdout.trim());
          const passed = JSON.stringify(result) === JSON.stringify(testCase.expectedOutput);

          resolve({
            passed,
            input: testCase.input,
            expectedOutput: testCase.expectedOutput,
            actualOutput: result,
            error: null,
            executionTime,
          });
        } catch (parseError: any) {
          resolve({
            passed: false,
            input: testCase.input,
            expectedOutput: testCase.expectedOutput,
            actualOutput: stdout.trim(),
            error: 'Failed to parse output',
            executionTime,
          });
        }
      });
    } catch (error: any) {
      const executionTime = Date.now() - startTime;
      resolve({
        passed: false,
        input: testCase.input,
        expectedOutput: testCase.expectedOutput,
        actualOutput: null,
        error: error.message || 'Execution error',
        executionTime,
      });
    }
  });
};

/**
 * Run tests endpoint
 * POST /api/exercises/run-tests
 */
export const runTests = async (req: Request, res: Response) => {
  try {
    const { code, testCases, language, functionName }: RunTestsRequest = req.body;

    // Validation
    if (!code || !testCases || !language) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: code, testCases, language',
      });
    }

    if (!Array.isArray(testCases) || testCases.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'testCases must be a non-empty array',
      });
    }

    if (!['javascript', 'python'].includes(language.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: 'Unsupported language. Currently supports: javascript, python',
      });
    }

    logger.info(`Running tests for ${language}`, {
      testCount: testCases.length,
      codeLength: code.length,
    });

    // Execute tests based on language
    const results: TestResult[] = [];
    
    for (const testCase of testCases) {
      let result: TestResult;

      if (language.toLowerCase() === 'javascript') {
        result = await executeJavaScript(code, testCase, functionName);
      } else if (language.toLowerCase() === 'python') {
        result = await executePython(code, testCase, functionName);
      } else {
        result = {
          passed: false,
          input: testCase.input,
          expectedOutput: testCase.expectedOutput,
          actualOutput: null,
          error: 'Unsupported language',
          executionTime: 0,
        };
      }

      results.push(result);
    }

    // Calculate summary
    const passedCount = results.filter(r => r.passed).length;
    const totalCount = results.length;
    const allPassed = passedCount === totalCount;

    logger.info(`Test execution completed`, {
      passed: passedCount,
      total: totalCount,
      success: allPassed,
    });

    return res.json({
      success: true,
      results,
      summary: {
        total: totalCount,
        passed: passedCount,
        failed: totalCount - passedCount,
        allPassed,
      },
    });
  } catch (error: any) {
    logger.error('Error running tests:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while running tests',
      error: error.message,
    });
  }
};