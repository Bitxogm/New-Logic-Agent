// frontend/src/pages/ExerciseWorkspace/hooks/useCodeAnalysis.ts

import { useState, useEffect, useCallback } from 'react';
import { codeAnalysisService, ProgressAnalysis } from '@/services/codeAnalysisService';

interface UseCodeAnalysisOptions {
  exerciseId: string;
  code: string;
  language: string;
  enabled?: boolean;
  debounceMs?: number;
}

interface UseCodeAnalysisReturn {
  analysis: ProgressAnalysis | null;
  isAnalyzing: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Hook for real-time code analysis with debouncing
 */
export const useCodeAnalysis = ({
  exerciseId,
  code,
  language,
  enabled = true,
  debounceMs = 3000, // 3 seconds default
}: UseCodeAnalysisOptions): UseCodeAnalysisReturn => {
  const [analysis, setAnalysis] = useState<ProgressAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeCode = useCallback(async () => {
    if (!enabled || !code.trim() || !exerciseId) {
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await codeAnalysisService.analyzeProgress(
        exerciseId,
        code,
        language
      );

      setAnalysis(response.analysis);
    } catch (err: any) {
      console.error('Code analysis error:', err);
      setError(err.message || 'Failed to analyze code');
    } finally {
      setIsAnalyzing(false);
    }
  }, [exerciseId, code, language, enabled]);

  // Debounced effect - analyze code after user stops typing
  useEffect(() => {
    if (!enabled || !code.trim()) {
      return;
    }

    const timer = setTimeout(() => {
      analyzeCode();
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [code, analyzeCode, debounceMs, enabled]);

  // Manual refetch
  const refetch = useCallback(() => {
    analyzeCode();
  }, [analyzeCode]);

  return {
    analysis,
    isAnalyzing,
    error,
    refetch,
  };
};