/**
 * Rutas de IA (Gemini)
 */

import { Router } from 'express';
import { aiController } from '../controllers/aiController';
import { authenticate } from '../middleware/auth';
import { validateBody } from '../middleware/validateRequest';
import rateLimit from 'express-rate-limit';
import logger from '../config/logger.config';

const router = Router();

// Rate limiter específico para IA (más restrictivo)
const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // 10 peticiones por ventana
  skip: () => process.env.NODE_ENV === 'test',
  message: {
    success: false,
    error: 'Demasiadas peticiones de IA. Por favor intenta de nuevo más tarde',
  },
  handler: (req, res) => {
    logger.warn('⚠️ Rate limit alcanzado - IA', {
      ip: req.ip,
      path: req.path,
      userId: (req as any).user?._id,
    });
    
    res.status(429).json({
      success: false,
      error: 'Demasiadas peticiones de IA. Por favor intenta de nuevo más tarde',
    });
  },
});

/**
 * @route   POST /api/ai/generate-solution
 * @desc    Generar solución de código con IA
 * @access  Private
 */
router.post(
  '/generate-solution',
  authenticate,
  aiLimiter,
  validateBody,
  aiController.generateSolution.bind(aiController)
);

/**
 * @route   POST /api/ai/analyze-code
 * @desc    Analizar código del usuario
 * @access  Private
 */
router.post(
  '/analyze-code',
  authenticate,
  aiLimiter,
  validateBody,
  aiController.analyzeCode.bind(aiController)
);

/**
 * @route   POST /api/ai/explain
 * @desc    Explicar concepto de programación
 * @access  Private
 */
router.post(
  '/explain',
  authenticate,
  aiLimiter,
  validateBody,
  aiController.explain.bind(aiController)
);

export default router;