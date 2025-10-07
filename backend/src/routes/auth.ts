import { Router } from 'express';
import { authController } from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import { validateBody } from '../middleware/validateRequest';
import { loginLimiter, registerLimiter } from '../middleware/rateLimiter'; // ✅ AÑADIR

const router = Router();

/**
 * @route   POST /api/auth/register
 * @desc    Registrar nuevo usuario
 * @access  Public
 */
router.post(
  '/register',
  registerLimiter,  // ✅ AÑADIR (3 registros/hora)
  validateBody,
  authController.register.bind(authController)
);

/**
 * @route   POST /api/auth/login
 * @desc    Iniciar sesión
 * @access  Public
 */
router.post(
  '/login',
  loginLimiter,  // ✅ AÑADIR (5 intentos/15min)
  validateBody,
  authController.login.bind(authController)
);

/**
 * @route   GET /api/auth/me
 * @desc    Obtener usuario autenticado
 * @access  Private
 */
router.get(
  '/me',
  authenticate,
  authController.getMe.bind(authController)
);

export default router;