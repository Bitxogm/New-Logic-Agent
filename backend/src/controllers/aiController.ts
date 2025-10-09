/**
 * Controlador de IA
 * 
 * Maneja las peticiones relacionadas con Gemini AI
 */

import { Request, Response } from 'express';
import { geminiService } from '../services/gemini.service';
import { AppError } from '../middleware/errorHandler';
import logger from '../config/logger.config';
import {Exercise} from '../models/Exercise';
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
  /**
   * Analizar ejercicio y proporcionar roadmap de aprendizaje
   * POST /api/ai/analyze-exercise
   */
  async analyzeExercise(req: Request, res: Response): Promise<void> {
    const { exerciseId } = req.body;

    if (!exerciseId) {
      throw new AppError('exerciseId is required', 400);
    }

    // Get exercise from database
    const exercise = await Exercise.findById(exerciseId);

    if (!exercise) {
      throw new AppError('Exercise not found', 404);
    }

    logger.info('Analyzing exercise', {
      exerciseId,
      title: exercise.title,
      userId: (req as any).user?._id,
    });

    // Create prompt for Gemini
    const prompt = `
You are an expert programming tutor. Analyze this programming exercise and provide a detailed learning plan.

Exercise Title: ${exercise.title}
Description: ${exercise.description}
Language: ${exercise.language}
Difficulty: ${exercise.difficulty}

Provide a JSON response with the following structure:
{
  "summary": "A brief 2-3 sentence summary of what this exercise teaches",
  "keyConcepts": ["concept1", "concept2", "concept3"],
  "estimatedTime": 15,
  "prerequisites": ["prerequisite1", "prerequisite2"],
  "roadmap": [
    {
      "id": "1",
      "title": "Step title",
      "description": "What to do in this step",
      "completed": false
    }
  ],
  "difficulty": "beginner"
}

Make it encouraging and educational. The roadmap should guide them step-by-step without giving away the solution.
`;

    // Call Gemini
    const geminiResponse = await geminiService.generateContent(prompt);
    
    // Parse JSON response
    let analysisData;
    try {
      const jsonMatch = geminiResponse.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new AppError('No JSON found in AI response', 500);
      }
      analysisData = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      logger.error('Failed to parse Gemini response:', parseError);
      throw new AppError('Failed to parse AI response', 500);
    }

    res.status(200).json({
      success: true,
      data: {
        exerciseId: exercise._id,
        exerciseTitle: exercise.title,
        analysis: analysisData,
      },
    });
  }
}

// Exportar instancia
export const aiController = new AIController();