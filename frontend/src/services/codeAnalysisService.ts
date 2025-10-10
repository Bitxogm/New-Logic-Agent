// frontend/src/services/codeAnalysisService.ts

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface ProgressAnalysis {
  progressPercentage: number;
  completedRequirements: string[];
  missingRequirements: string[];
  suggestions: string[];
  errors: string[];
  isComplete: boolean;
}

export interface AnalyzeProgressResponse {
  success: boolean;
  analysis: ProgressAnalysis;
}

/**
 * Analyze code progress in real-time
 */
export const analyzeProgress = async (
  exerciseId: string,
  currentCode: string,
  language: string
): Promise<AnalyzeProgressResponse> => {
  try {
    const response = await axios.post<AnalyzeProgressResponse>(
      `${API_URL}/ai/analyze-progress`,
      {
        exerciseId,
        currentCode,
        language,
      },
      {
        timeout: 30000, // 30 seconds
      }
    );

    return response.data;
  } catch (error: any) {
    console.error('Error analyzing progress:', error);
    
    if (error.response?.data) {
      throw new Error(error.response.data.message || 'Failed to analyze progress');
    }
    
    throw new Error('Network error: Could not connect to analysis service');
  }
};

export const codeAnalysisService = {
  analyzeProgress,
};