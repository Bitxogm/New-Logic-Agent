import { Router } from 'express';
import { exerciseController } from '../controllers/exerciseController';
import { authenticate } from '../middleware/auth';
import { validateBody, validateId } from '../middleware/validateRequest';

const router = Router();

// ✅ FIX H1: AÑADIDO authenticate
router.get(
  '/',
  authenticate,  // ← CRÍTICO: Proteger lista de ejercicios
  exerciseController.getAll.bind(exerciseController)
);

// ✅ FIX H1: AÑADIDO authenticate
router.get(
  '/:id',
  authenticate,  // ← CRÍTICO: Proteger ejercicio individual
  validateId,
  exerciseController.getById.bind(exerciseController)
);

router.post(
  '/',
  authenticate,
  validateBody,
  exerciseController.create.bind(exerciseController)
);

router.patch(
  '/:id',
  authenticate,
  validateId,
  validateBody,
  exerciseController.update.bind(exerciseController)
);

router.delete(
  '/:id',
  authenticate,
  validateId,
  exerciseController.delete.bind(exerciseController)
);

export default router;