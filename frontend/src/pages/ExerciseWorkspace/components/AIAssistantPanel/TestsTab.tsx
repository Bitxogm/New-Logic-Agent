// src/pages/ExerciseWorkspace/components/AIAssistantPanel/TestsTab.tsx

import { useState } from 'react';
import { CheckCircle2, XCircle, Play, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { testExecutionService, TestResult } from '@/services/testExecutionService';
import { useConfetti } from '@/hooks/useConfetti';

interface TestCase {
  input: any[];
  expectedOutput: any;
}

interface TestsTabProps {
  testCases: TestCase[];
  currentCode: string;
  language: string;
  onRunTests: () => void;
}

export default function TestsTab({ testCases, currentCode, language, onRunTests }: TestsTabProps) {
  const [results, setResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const { celebrateAllTestsPassed, rewardElement } = useConfetti();

  const handleRunTests = async () => {
    setIsRunning(true);
    onRunTests(); // Notify parent

    try {
      // Call backend service
      const response = await testExecutionService.runTests(
        currentCode,
        testCases,
        language
      );

      setResults(response.results);

      // Show success/failure toast
      if (response.summary.allPassed) {
        toast.success(`All tests passed! 🎉 (${response.summary.passed}/${response.summary.total})`);
        // 🎊 CELEBRATE! All tests passed
        celebrateAllTestsPassed();
      } else {
        toast.error(`${response.summary.failed} test(s) failed (${response.summary.passed}/${response.summary.total} passed)`);
      }
    } catch (error: any) {
      console.error('Error running tests:', error);
      toast.error(error.message || 'Failed to run tests');
      
      // Set all tests as failed with error
      setResults(testCases.map(testCase => ({
        passed: false,
        input: testCase.input,
        expectedOutput: testCase.expectedOutput,
        actualOutput: null,
        error: error.message || 'Execution failed',
        executionTime: 0,
      })));
    } finally {
      setIsRunning(false);
    }
  };

  // Calculate progress
  const passedCount = results.filter(r => r.passed).length;
  const totalCount = testCases.length;
  const progressPercentage = totalCount > 0 ? (passedCount / totalCount) * 100 : 0;

  return (
    <div className="space-y-4">
      {/* 🎊 Confetti Elements - MUST BE RENDERED */}
      {rewardElement}
      
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Test Cases</CardTitle>
          <CardDescription>
            {totalCount} test{totalCount !== 1 ? 's' : ''} defined
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={handleRunTests} 
            className="w-full"
            disabled={isRunning || !currentCode.trim()}
          >
            {isRunning ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Running Tests...
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Run All Tests
              </>
            )}
          </Button>

          {/* Progress */}
          {results.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">
                  {passedCount} / {totalCount} passing
                </span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Test Results */}
      <div className="space-y-3">
        {testCases.map((testCase, index) => {
          const result = results[index];
          const hasRun = !!result;

          return (
            <Card key={index} className={hasRun ? (result.passed ? 'border-green-500/50' : 'border-red-500/50') : ''}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {hasRun ? (
                      result.passed ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )
                    ) : (
                      <div className="h-5 w-5 rounded-full border-2 border-muted" />
                    )}
                    <CardTitle className="text-base">Test Case #{index + 1}</CardTitle>
                  </div>
                  <Badge variant={hasRun ? (result.passed ? 'default' : 'destructive') : 'outline'}>
                    {hasRun ? (result.passed ? 'Pass' : 'Fail') : 'Not Run'}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-3 text-sm">
                {/* Input */}
                <div>
                  <p className="font-medium mb-1">Input:</p>
                  <pre className="bg-muted p-2 rounded text-xs overflow-x-auto">
                    {JSON.stringify(testCase.input, null, 2)}
                  </pre>
                </div>

                {/* Expected Output */}
                <div>
                  <p className="font-medium mb-1">Expected Output:</p>
                  <pre className="bg-muted p-2 rounded text-xs overflow-x-auto">
                    {JSON.stringify(testCase.expectedOutput, null, 2)}
                  </pre>
                </div>

                {/* Actual Output */}
                {hasRun && (
                  <div>
                    <p className="font-medium mb-1">Your Output:</p>
                    <pre className={`p-2 rounded text-xs overflow-x-auto ${
                      result.passed ? 'bg-green-500/10' : 'bg-red-500/10'
                    }`}>
                      {result.error 
                        ? result.error
                        : JSON.stringify(result.actualOutput, null, 2)}
                    </pre>
                  </div>
                )}

                {/* Error Message */}
                {hasRun && result.error && (
                  <div className="flex items-start gap-2 p-2 bg-red-500/10 rounded">
                    <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <div className="text-xs">
                      <p className="font-medium text-red-700 dark:text-red-400 mb-1">Error:</p>
                      <p className="text-red-600 dark:text-red-300">{result.error}</p>
                    </div>
                  </div>
                )}

                {/* Execution Time */}
                {hasRun && !result.error && (
                  <p className="text-xs text-muted-foreground">
                    Executed in {result.executionTime}ms
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {testCases.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center">
            <AlertCircle className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
            <p className="text-muted-foreground">No test cases available for this exercise</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}