import { Router } from 'express';
import { aiController } from '../controllers/aiController';
import { authenticate } from '../middleware/auth';
import { validateBody } from '../middleware/validateRequest';
import rateLimit from 'express-rate-limit';
import logger from '../config/logger.config';

const router = Router();

const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
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
 * @swagger
 * /api/ai/generate-solution:
 *   post:
 *     summary: Generar solución de código con IA
 *     description: Usa Gemini 2.0 para generar una solución completa de código con explicación y análisis de complejidad
 *     tags: [AI]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - problem
 *               - language
 *             properties:
 *               problem:
 *                 type: string
 *                 description: Descripción del problema a resolver
 *                 example: Crea una función que sume dos números enteros
 *               language:
 *                 type: string
 *                 description: Lenguaje de programación
 *                 example: javascript
 *               difficulty:
 *                 type: string
 *                 enum: [easy, medium, hard]
 *                 description: Dificultad del problema
 *                 example: easy
 *               hints:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Pistas opcionales para la solución
 *                 example: ["Usar el operador +", "Retornar el resultado"]
 *     responses:
 *       200:
 *         description: Solución generada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     solution:
 *                       type: string
 *                       example: "function sum(a, b) { return a + b; }"
 *                     explanation:
 *                       type: string
 *                       example: Esta función toma dos parámetros y retorna su suma...
 *                     language:
 *                       type: string
 *                       example: javascript
 *                     complexity:
 *                       type: string
 *                       example: "O(1) - tiempo constante"
 *                     alternativeApproaches:
 *                       type: array
 *                       items:
 *                         type: string
 *       400:
 *         description: Datos inválidos (problema o lenguaje vacío)
 *       401:
 *         description: No autenticado
 *       429:
 *         description: Límite de peticiones excedido (10 por 15 minutos)
 */
router.post(
  '/generate-solution',
  authenticate,
  aiLimiter,
  validateBody,
  aiController.generateSolution.bind(aiController)
);

/**
 * @swagger
 * /api/ai/analyze-code:
 *   post:
 *     summary: Analizar código del usuario
 *     description: Analiza código con IA para encontrar problemas, sugerencias de mejora y calificación
 *     tags: [AI]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - language
 *             properties:
 *               code:
 *                 type: string
 *                 description: Código a analizar (máximo 10,000 caracteres)
 *                 example: "function sum(a, b) { return a + b; }"
 *               language:
 *                 type: string
 *                 description: Lenguaje del código
 *                 example: javascript
 *               focusAreas:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum: [performance, readability, bugs, security]
 *                 description: Áreas específicas en las que enfocarse
 *                 example: ["performance", "readability"]
 *     responses:
 *       200:
 *         description: Análisis completado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     issues:
 *                       type: array
 *                       items:
 *                         type: object
 *                     suggestions:
 *                       type: array
 *                       items:
 *                         type: string
 *                     complexity:
 *                       type: string
 *                       example: "O(n)"
 *                     rating:
 *                       type: number
 *                       minimum: 1
 *                       maximum: 10
 *                       example: 8
 *                     summary:
 *                       type: string
 *       400:
 *         description: Código vacío, muy largo o lenguaje inválido
 *       401:
 *         description: No autenticado
 *       429:
 *         description: Límite de peticiones excedido
 */
router.post(
  '/analyze-code',
  authenticate,
  aiLimiter,
  validateBody,
  aiController.analyzeCode.bind(aiController)
);

/**
 * @swagger
 * /api/ai/explain:
 *   post:
 *     summary: Explicar concepto de programación
 *     description: Obtiene una explicación detallada de un concepto con ejemplos y recursos
 *     tags: [AI]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - topic
 *             properties:
 *               topic:
 *                 type: string
 *                 description: Tema o concepto a explicar
 *                 example: "¿Qué es una variable en JavaScript?"
 *               level:
 *                 type: string
 *                 enum: [beginner, intermediate, advanced]
 *                 description: Nivel de complejidad de la explicación
 *                 example: beginner
 *               includeExamples:
 *                 type: boolean
 *                 description: Incluir ejemplos de código
 *                 example: true
 *     responses:
 *       200:
 *         description: Explicación generada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     explanation:
 *                       type: string
 *                       example: Una variable es un contenedor para almacenar valores...
 *                     examples:
 *                       type: array
 *                       items:
 *                         type: string
 *                     relatedTopics:
 *                       type: array
 *                       items:
 *                         type: string
 *                     resources:
 *                       type: array
 *                       items:
 *                         type: string
 *       400:
 *         description: Tema vacío
 *       401:
 *         description: No autenticado
 *       429:
 *         description: Límite de peticiones excedido
 */
router.post(
  '/explain',
  authenticate,
  aiLimiter,
  validateBody,
  aiController.explain.bind(aiController)
);

router.post(
  '/analyze-exercise',
  aiController.analyzeExercise.bind(aiController)
);

router.post(
  '/generate-flowchart',
  aiController.generateFlowchart.bind(aiController));

router.post('/chat',
  aiController.sendChatMessage.bind(aiController));

export default router;