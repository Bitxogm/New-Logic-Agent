/**
 * Tipos para el servicio de IA (Gemini)
 */

/**
 * Solicitud para generar solución
 */
export interface GenerateSolutionRequest {
  problem: string;
  language: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  hints?: string[];
}

/**
 * Respuesta de solución generada
 */
export interface GenerateSolutionResponse {
  solution: string;
  explanation: string;
  language: string;
  complexity?: string;
  alternativeApproaches?: string[];
}

/**
 * Solicitud para analizar código
 */
export interface AnalyzeCodeRequest {
  code: string;
  language: string;
  focusAreas?: ('performance' | 'readability' | 'bugs' | 'security')[];
}

/**
 * Respuesta de análisis de código
 */
export interface AnalyzeCodeResponse {
  issues: CodeIssue[];
  suggestions: string[];
  complexity: string;
  rating: number; // 1-10
  summary: string;
}

export interface CodeIssue {
  type: 'error' | 'warning' | 'suggestion';
  line?: number;
  message: string;
  severity: 'low' | 'medium' | 'high';
}

/**
 * Solicitud para explicación
 */
export interface ExplainRequest {
  topic: string;
  level?: 'beginner' | 'intermediate' | 'advanced';
  includeExamples?: boolean;
}

/**
 * Respuesta de explicación
 */
export interface ExplainResponse {
  explanation: string;
  examples?: string[];
  relatedTopics?: string[];
  resources?: string[];
}