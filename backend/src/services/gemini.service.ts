/**
 * Servicio de Gemini AI
 * 
 * Maneja la comunicación con Google Gemini API
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import logger from '../config/logger.config';
import {
  GenerateSolutionRequest,
  GenerateSolutionResponse,
  AnalyzeCodeRequest,
  AnalyzeCodeResponse,
  ExplainRequest,
  ExplainResponse,
} from '../types/ai.types';

class GeminiService {
  private genAI: GoogleGenerativeAI | null = null;
  private model: any = null;

  /**
   * Inicializar el servicio (lazy initialization)
   */
  private initialize(): void {
    if (this.genAI) return; // Ya inicializado

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      logger.error('❌ GEMINI_API_KEY no configurada');
      throw new Error('GEMINI_API_KEY no está configurada en las variables de entorno');
    }

    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    logger.info('✅ Gemini Service inicializado con gemini-2.5-flash');
  }

  /**
   * Generar solución de código
   */
  async generateSolution(request: GenerateSolutionRequest): Promise<GenerateSolutionResponse> {
    this.initialize(); // ✅ Inicializar aquí

    const startTime = Date.now();

    logger.info('🤖 Generando solución con Gemini', {
      language: request.language,
      difficulty: request.difficulty,
      problemLength: request.problem.length,
    });

    try {
      const prompt = this.buildSolutionPrompt(request);
      const result = await this.model.generateContent(prompt);
      const response = result.response.text();

      const duration = Date.now() - startTime;

      logger.info('✅ Solución generada exitosamente', {
        duration: `${duration}ms`,
        responseLength: response.length,
      });

      return this.parseSolutionResponse(response, request.language);
    } catch (error) {
      logger.error('❌ Error generando solución', {
        error: (error as Error).message,
        language: request.language,
      });
      throw error;
    }
  }

  /**
   * Analizar código del usuario
   */
  async analyzeCode(request: AnalyzeCodeRequest): Promise<AnalyzeCodeResponse> {
    this.initialize(); // ✅ Inicializar aquí

    const startTime = Date.now();

    logger.info('🔍 Analizando código con Gemini', {
      language: request.language,
      codeLength: request.code.length,
      focusAreas: request.focusAreas,
    });

    try {
      const prompt = this.buildAnalysisPrompt(request);
      const result = await this.model.generateContent(prompt);
      const response = result.response.text();

      const duration = Date.now() - startTime;

      logger.info('✅ Análisis completado', {
        duration: `${duration}ms`,
        language: request.language,
      });

      return this.parseAnalysisResponse(response);
    } catch (error) {
      logger.error('❌ Error analizando código', {
        error: (error as Error).message,
        language: request.language,
      });
      throw error;
    }
  }

  /**
   * Explicar concepto o código
   */
  async explain(request: ExplainRequest): Promise<ExplainResponse> {
    this.initialize(); // ✅ Inicializar aquí

    const startTime = Date.now();

    logger.info('📚 Generando explicación con Gemini', {
      topic: request.topic,
      level: request.level,
    });

    try {
      const prompt = this.buildExplanationPrompt(request);
      const result = await this.model.generateContent(prompt);
      const response = result.response.text();

      const duration = Date.now() - startTime;

      logger.info('✅ Explicación generada', {
        duration: `${duration}ms`,
        topicLength: request.topic.length,
      });

      return this.parseExplanationResponse(response);
    } catch (error) {
      logger.error('❌ Error generando explicación', {
        error: (error as Error).message,
        topic: request.topic,
      });
      throw error;
    }
  }
  /**
  * Generar contenido genérico con Gemini
  * Útil para casos de uso no específicos
  */
  async generateContent(prompt: string): Promise<string> {
    this.initialize();

    const startTime = Date.now();

    logger.info('🤖 Generando contenido con Gemini', {
      promptLength: prompt.length,
    });

    try {
      const result = await this.model.generateContent(prompt);
      const response = result.response.text();

      const duration = Date.now() - startTime;

      logger.info('✅ Contenido generado exitosamente', {
        duration: `${duration}ms`,
        responseLength: response.length,
      });

      return response;
    } catch (error) {
      logger.error('❌ Error generando contenido', {
        error: (error as Error).message,
      });
      throw error;
    }
  }

  private buildSolutionPrompt(request: GenerateSolutionRequest): string {
    let prompt = `Eres un tutor de programación experto. Genera una solución completa para el siguiente problema:\n\n`;
    prompt += `Problema: ${request.problem}\n`;
    prompt += `Lenguaje: ${request.language}\n`;

    if (request.difficulty) {
      prompt += `Dificultad: ${request.difficulty}\n`;
    }

    if (request.hints && request.hints.length > 0) {
      prompt += `Pistas: ${request.hints.join(', ')}\n`;
    }

    prompt += `\nPor favor proporciona:\n`;
    prompt += `1. SOLUCIÓN: El código completo y funcional\n`;
    prompt += `2. EXPLICACIÓN: Cómo funciona la solución paso a paso\n`;
    prompt += `3. COMPLEJIDAD: Análisis de complejidad temporal y espacial\n`;
    prompt += `4. ALTERNATIVAS: Otros enfoques posibles (opcional)\n\n`;
    prompt += `Formatea la respuesta claramente con estas secciones.`;

    return prompt;
  }

  private buildAnalysisPrompt(request: AnalyzeCodeRequest): string {
    let prompt = `Eres un experto en revisión de código. Analiza el siguiente código:\n\n`;
    prompt += `\`\`\`${request.language}\n${request.code}\n\`\`\`\n\n`;

    if (request.focusAreas && request.focusAreas.length > 0) {
      prompt += `Enfócate especialmente en: ${request.focusAreas.join(', ')}\n\n`;
    }

    prompt += `Proporciona:\n`;
    prompt += `1. ISSUES: Problemas encontrados (errores, warnings, sugerencias)\n`;
    prompt += `2. SUGGESTIONS: Sugerencias de mejora\n`;
    prompt += `3. COMPLEXITY: Análisis de complejidad\n`;
    prompt += `4. RATING: Calificación del código (1-10)\n`;
    prompt += `5. SUMMARY: Resumen del análisis\n\n`;
    prompt += `Sé específico y constructivo.`;

    return prompt;
  }

  private buildExplanationPrompt(request: ExplainRequest): string {
    let prompt = `Eres un tutor de programación. Explica el siguiente tema:\n\n`;
    prompt += `Tema: ${request.topic}\n`;
    prompt += `Nivel: ${request.level || 'intermedio'}\n\n`;

    if (request.includeExamples) {
      prompt += `Incluye ejemplos de código prácticos.\n\n`;
    }

    prompt += `Proporciona:\n`;
    prompt += `1. EXPLICACIÓN: Clara y concisa\n`;
    prompt += `2. EJEMPLOS: Código de ejemplo (si aplica)\n`;
    prompt += `3. TEMAS RELACIONADOS: Conceptos relacionados\n`;
    prompt += `4. RECURSOS: Recursos adicionales para aprender más\n`;

    return prompt;
  }

  private parseSolutionResponse(
    response: string,
    language: string
  ): GenerateSolutionResponse {
    return {
      solution: this.extractSection(response, 'SOLUCIÓN') || response,
      explanation: this.extractSection(response, 'EXPLICACIÓN') || '',
      language,
      complexity: this.extractSection(response, 'COMPLEJIDAD'),
      alternativeApproaches: this.extractSection(response, 'ALTERNATIVAS')?.split('\n'),
    };
  }

  private parseAnalysisResponse(response: string): AnalyzeCodeResponse {
    return {
      issues: [],
      suggestions: this.extractSection(response, 'SUGGESTIONS')?.split('\n') || [],
      complexity: this.extractSection(response, 'COMPLEXITY') || 'O(n)',
      rating: this.extractRating(response) || 7,
      summary: this.extractSection(response, 'SUMMARY') || response,
    };
  }

  private parseExplanationResponse(response: string): ExplainResponse {
    return {
      explanation: this.extractSection(response, 'EXPLICACIÓN') || response,
      examples: this.extractSection(response, 'EJEMPLOS')?.split('\n'),
      relatedTopics: this.extractSection(response, 'TEMAS RELACIONADOS')?.split('\n'),
      resources: this.extractSection(response, 'RECURSOS')?.split('\n'),
    };
  }

  private extractSection(text: string, sectionName: string): string | undefined {
    const regex = new RegExp(`${sectionName}:?\\s*([\\s\\S]*?)(?=\\n\\n[A-Z]+:|$)`, 'i');
    const match = text.match(regex);
    return match ? match[1].trim() : undefined;
  }

  private extractRating(text: string): number | undefined {
    const match = text.match(/rating:?\s*(\d+)/i);
    return match ? parseInt(match[1], 10) : undefined;
  }
}

// Exportar instancia singleton
export const geminiService = new GeminiService();