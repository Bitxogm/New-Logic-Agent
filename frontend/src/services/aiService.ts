import api, { ApiResponse, getResponseData } from './api';
import {
  GenerateSolutionRequest,
  GenerateSolutionResponse,
  AnalyzeCodeRequest,
  AnalyzeCodeResponse,
  ExplainConceptRequest,
  ExplainConceptResponse,
} from '../types';

/**
 * Servicio de IA (Gemini)
 * Maneja todas las peticiones relacionadas con inteligencia artificial
 */
class AIService {
  /**
   * Generar solución de código con IA
   * Rate limit: 10 peticiones cada 15 minutos
   */
  async generateSolution(
    data: GenerateSolutionRequest
  ): Promise<GenerateSolutionResponse> {
    const response = await api.post<ApiResponse<GenerateSolutionResponse>>(
      '/ai/generate-solution',
      data
    );
    return getResponseData(response);
  }

  /**
   * Analizar código del usuario
   * Detecta bugs, mejoras de rendimiento, legibilidad, etc.
   * Rate limit: 10 peticiones cada 15 minutos
   */
  async analyzeCode(data: AnalyzeCodeRequest): Promise<AnalyzeCodeResponse> {
    const response = await api.post<ApiResponse<AnalyzeCodeResponse>>(
      '/ai/analyze-code',
      data
    );
    return getResponseData(response);
  }

  /**
   * Explicar concepto de programación
   * Rate limit: 10 peticiones cada 15 minutos
   */
  async explainConcept(
    data: ExplainConceptRequest
  ): Promise<ExplainConceptResponse> {
    const response = await api.post<ApiResponse<ExplainConceptResponse>>(
      '/ai/explain',
      data
    );
    return getResponseData(response);
  }

  /**
   * Generar solución para un ejercicio específico
   * Helper que combina el ejercicio con la generación
   */
  async generateSolutionForExercise(
    exerciseTitle: string,
    exerciseDescription: string,
    language: string,
    difficulty?: 'easy' | 'medium' | 'hard',
    hints?: string[]
  ): Promise<GenerateSolutionResponse> {
    const problem = `${exerciseTitle}\n\n${exerciseDescription}`;

    return this.generateSolution({
      problem,
      language,
      difficulty,
      hints,
    });
  }

  /**
   * Analizar código con enfoque específico
   * Helper para análisis rápido con áreas predefinidas
   */
  async quickAnalyze(
    code: string,
    language: string,
    focus: 'bugs' | 'performance' | 'readability' | 'security' | 'all' = 'all'
  ): Promise<AnalyzeCodeResponse> {
    const focusAreas =
      focus === 'all'
        ? ['performance', 'readability', 'bugs', 'security']
        : [focus];

    return this.analyzeCode({
      code,
      language,
      focusAreas: focusAreas as any,
    });
  }

  /**
   * Obtener explicación simple (para principiantes)
   */
  async getSimpleExplanation(topic: string): Promise<ExplainConceptResponse> {
    return this.explainConcept({
      topic,
      level: 'beginner',
      includeExamples: true,
    });
  }

  /**
   * Obtener explicación avanzada
   */
  async getAdvancedExplanation(
    topic: string
  ): Promise<ExplainConceptResponse> {
    return this.explainConcept({
      topic,
      level: 'advanced',
      includeExamples: true,
    });
  }

  /**
  * Analizar ejercicio y obtener roadmap de aprendizaje
  */
  async analyzeExercise(exerciseId: string) {
    const response = await api.post('/ai/analyze-exercise', { exerciseId });
    return getResponseData(response);
  }

    async generateFlowchart(exerciseId: string) {
    const response = await api.post('/ai/generate-flowchart', { exerciseId });
    return getResponseData(response);
  }

}

// Exportar instancia única (singleton)
export const aiService = new AIService();