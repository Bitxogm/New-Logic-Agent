import { Router } from 'express';
import { exerciseController } from '../controllers/exerciseController';
import { validateBody, validateMongoId } from '../middleware/validateRequest';

const router = Router();

/**
 * @route   GET /api/exercises
 * @desc    Obtener todos los ejercicios con paginación y filtros
 * @access  Public
 * @query   page, limit, difficulty, language, search
 */
router.get(
  '/', 
  exerciseController.getAll.bind(exerciseController)
);

/**
 * @route   GET /api/exercises/:id
 * @desc    Obtener un ejercicio por ID
 * @access  Public
 */
router.get(
  '/:id', 
  validateMongoId(), 
  exerciseController.getById.bind(exerciseController)
);

/**
 * @route   POST /api/exercises
 * @desc    Crear un nuevo ejercicio
 * @access  Public (TODO: añadir autenticación)
 */
router.post(
  '/', 
  validateBody, 
  exerciseController.create.bind(exerciseController)
);

/**
 * @route   PATCH /api/exercises/:id
 * @desc    Actualizar un ejercicio
 * @access  Public (TODO: añadir autenticación y validar ownership)
 */
router.patch(
  '/:id', 
  validateMongoId(), 
  validateBody, 
  exerciseController.update.bind(exerciseController)
);

/**
 * @route   DELETE /api/exercises/:id
 * @desc    Eliminar un ejercicio
 * @access  Public (TODO: añadir autenticación y validar ownership)
 */
router.delete(
  '/:id', 
  validateMongoId(), 
  exerciseController.delete.bind(exerciseController)
);

export default router;