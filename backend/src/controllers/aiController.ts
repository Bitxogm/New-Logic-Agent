/**
 * Controlador de IA
 * 
 * Maneja las peticiones relacionadas con Gemini AI
 */

import { Request, Response } from 'express';
import { geminiService } from '../services/gemini.service';
import { AppError } from '../middleware/errorHandler';
import logger from '../config/logger.config';
import {
  GenerateSolutionRequest,
  AnalyzeCodeRequest,
  ExplainRequest,
} from '../types/ai.types';

export class AIController {
  /**
   * Generar solución de código
   * POST /api/ai/generate-solution
   */
  async generateSolution(req: Request, res: Response): Promise<void> {
    const { problem, language, difficulty, hints } = req.body as GenerateSolutionRequest;

    // Validación
    if (!problem || !problem.trim()) {
      throw new AppError('El problema no puede estar vacío', 400);
    }

    if (!language || !language.trim()) {
      throw new AppError('El lenguaje es obligatorio', 400);
    }

    logger.info('Solicitud de generación de solución', {
      language,
      difficulty,
      userId: (req as any).user?._id,
    });

    const result = await geminiService.generateSolution({
      problem,
      language,
      difficulty,
      hints,
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  }

  /**
   * Analizar código del usuario
   * POST /api/ai/analyze-code
   */
  async analyzeCode(req: Request, res: Response): Promise<void> {
    const { code, language, focusAreas } = req.body as AnalyzeCodeRequest;

    // Validación
    if (!code || !code.trim()) {
      throw new AppError('El código no puede estar vacío', 400);
    }

    if (!language || !language.trim()) {
      throw new AppError('El lenguaje es obligatorio', 400);
    }

    // Límite de longitud de código
    if (code.length > 10000) {
      throw new AppError('El código es demasiado largo (máximo 10,000 caracteres)', 400);
    }

    logger.info('Solicitud de análisis de código', {
      language,
      codeLength: code.length,
      focusAreas,
      userId: (req as any).user?._id,
    });

    const result = await geminiService.analyzeCode({
      code,
      language,
      focusAreas,
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  }

  /**
   * Explicar concepto
   * POST /api/ai/explain
   */
  async explain(req: Request, res: Response): Promise<void> {
    const { topic, level, includeExamples } = req.body as ExplainRequest;

    // Validación
    if (!topic || !topic.trim()) {
      throw new AppError('El tema no puede estar vacío', 400);
    }

    logger.info('Solicitud de explicación', {
      topic,
      level,
      includeExamples,
      userId: (req as any).user?._id,
    });

    const result = await geminiService.explain({
      topic,
      level,
      includeExamples,
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  }
}

// Exportar instancia
export const aiController = new AIController();