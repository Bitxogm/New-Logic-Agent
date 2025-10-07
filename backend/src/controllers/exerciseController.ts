import { Request, Response, NextFunction } from 'express';
import { Exercise } from '../models/Exercise';
import { ExerciseValidator } from '../utils/exercise.validator';
import { AppError } from '../middleware/errorHandler';
import type { CreateExerciseDTO, ProgrammingLanguage, UpdateExerciseDTO } from '../types';

/**
 * Controlador para gestionar ejercicios de programación
 * Implementa CRUD completo con validaciones y seguridad
 */
export class ExerciseController {
  /**
   * Obtiene todos los ejercicios con paginación y filtros
   * 
   * @route GET /api/exercises
   * @access Public
   * 
   * @param req - Request con query params (page, limit, difficulty, language, search)
   * @param res - Response
   * @param next - NextFunction para manejo de errores
   * 
   * @example
   * GET /api/exercises?page=1&limit=10&difficulty=easy&language=python
   */
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      // Construir filtros
      const filters: Record<string, unknown> = {};
      
      if (req.query.difficulty) {
        filters.difficulty = req.query.difficulty;
      }
      
      if (req.query.language) {
        filters.language = req.query.language;
      }

      if (req.query.search) {
        filters.$text = { $search: req.query.search as string };
      }

      // Ejecutar consulta con paginación
      const [exercises, total] = await Promise.all([
        Exercise.find(filters)
          .skip(skip)
          .limit(limit)
          .sort({ createdAt: -1 })
          .lean(),
        Exercise.countDocuments(filters)
      ]);

      res.status(200).json({
        success: true,
        data: exercises,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtiene un ejercicio específico por su ID
   * 
   * @route GET /api/exercises/:id
   * @access Public
   * 
   * @param req - Request con params.id
   * @param res - Response
   * @param next - NextFunction
   * 
   * @throws {AppError} 404 - Si el ejercicio no existe
   * 
   * @example
   * GET /api/exercises/507f1f77bcf86cd799439011
   */
  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const exercise = await Exercise.findById(id).lean();

      if (!exercise) {
        throw new AppError('Ejercicio no encontrado', 404);
      }

      res.status(200).json({
        success: true,
        data: exercise
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Crea un nuevo ejercicio
   * 
   * @route POST /api/exercises
   * @access Public (TODO: cambiar a Private con autenticación)
   * 
   * @param req - Request con body CreateExerciseDTO
   * @param res - Response
   * @param next - NextFunction
   * 
   * @throws {AppError} 400 - Si los datos son inválidos
   * 
   * @example
   * POST /api/exercises
   * {
   *   "title": "Suma de números",
   *   "description": "Escribe una función que sume dos números",
   *   "language": "python",
   *   "difficulty": "easy",
   *   "tags": ["matemáticas"]
   * }
   */
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const exerciseData: CreateExerciseDTO = req.body;

      // Validar título
      const titleValidation = ExerciseValidator.validateTitle(exerciseData.title);
      if (!titleValidation.isValid) {
        throw new AppError(titleValidation.error!, 400);
      }

      // Validar descripción
      const descValidation = ExerciseValidator.validateDescription(exerciseData.description);
      if (!descValidation.isValid) {
        throw new AppError(descValidation.error!, 400);
      }

      // Validar dificultad
      const difficultyValidation = ExerciseValidator.validateDifficulty(exerciseData.difficulty);
      if (!difficultyValidation.isValid) {
        throw new AppError(difficultyValidation.error!, 400);
      }

      // Validar lenguaje
      const languageValidation = ExerciseValidator.validateLanguage(exerciseData.language);
      if (!languageValidation.isValid) {
        throw new AppError(languageValidation.error!, 400);
      }

      // Usar valores sanitizados
      const sanitizedData: CreateExerciseDTO = {
        title: titleValidation.sanitized!,
        description: descValidation.sanitized!,
        language: languageValidation.sanitized! as ProgrammingLanguage,
        difficulty: difficultyValidation.sanitized! as any,
        tags: exerciseData.tags,
        testCases: exerciseData.testCases,
        solution: exerciseData.solution
      };

      // Crear ejercicio
      const exercise = await Exercise.create(sanitizedData);

      res.status(201).json({
        success: true,
        data: exercise,
        message: 'Ejercicio creado exitosamente'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Actualiza un ejercicio existente
   * 
   * @route PATCH /api/exercises/:id
   * @access Public (TODO: cambiar a Private y validar ownership)
   * 
   * @param req - Request con params.id y body UpdateExerciseDTO
   * @param res - Response
   * @param next - NextFunction
   * 
   * @throws {AppError} 404 - Si el ejercicio no existe
   * @throws {AppError} 400 - Si los datos son inválidos
   * 
   * @example
   * PATCH /api/exercises/507f1f77bcf86cd799439011
   * {
   *   "title": "Nuevo título"
   * }
   */
  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const updates: UpdateExerciseDTO = req.body;

      // Validar campos si están presentes
      if (updates.title) {
        const validation = ExerciseValidator.validateTitle(updates.title);
        if (!validation.isValid) {
          throw new AppError(validation.error!, 400);
        }
        updates.title = validation.sanitized!;
      }

      if (updates.description) {
        const validation = ExerciseValidator.validateDescription(updates.description);
        if (!validation.isValid) {
          throw new AppError(validation.error!, 400);
        }
        updates.description = validation.sanitized!;
      }

      if (updates.difficulty) {
        const validation = ExerciseValidator.validateDifficulty(updates.difficulty);
        if (!validation.isValid) {
          throw new AppError(validation.error!, 400);
        }
        updates.difficulty = validation.sanitized! as any;
      }

      if (updates.language) {
        const validation = ExerciseValidator.validateLanguage(updates.language);
        if (!validation.isValid) {
          throw new AppError(validation.error!, 400);
        }
        updates.language = validation.sanitized! as ProgrammingLanguage ;
      }

      // Actualizar ejercicio
      const exercise = await Exercise.findByIdAndUpdate(
        id,
        { $set: updates },
        { new: true, runValidators: true }
      );

      if (!exercise) {
        throw new AppError('Ejercicio no encontrado', 404);
      }

      res.status(200).json({
        success: true,
        data: exercise,
        message: 'Ejercicio actualizado exitosamente'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Elimina un ejercicio
   * 
   * @route DELETE /api/exercises/:id
   * @access Public (TODO: cambiar a Private y validar ownership)
   * 
   * @param req - Request con params.id
   * @param res - Response
   * @param next - NextFunction
   * 
   * @throws {AppError} 404 - Si el ejercicio no existe
   * 
   * @example
   * DELETE /api/exercises/507f1f77bcf86cd799439011
   */
  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const exercise = await Exercise.findByIdAndDelete(id);

      if (!exercise) {
        throw new AppError('Ejercicio no encontrado', 404);
      }

      res.status(200).json({
        success: true,
        message: 'Ejercicio eliminado exitosamente'
      });
    } catch (error) {
      next(error);
    }
  }
}

// Exportar instancia única del controlador
export const exerciseController = new ExerciseController();