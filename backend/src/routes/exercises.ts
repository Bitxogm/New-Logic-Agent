import { Router } from 'express';
import { exerciseController } from '../controllers/exerciseController';
import { authenticate } from '../middleware/auth';
import { validateBody, validateId } from '../middleware/validateRequest';

const router = Router();

/**
 * @swagger
 * /api/exercises:
 *   get:
 *     summary: Listar todos los ejercicios
 *     tags: [Exercises]
 *     parameters:
 *       - in: query
 *         name: language
 *         schema:
 *           type: string
 *         description: Filtrar por lenguaje de programación
 *         example: javascript
 *       - in: query
 *         name: difficulty
 *         schema:
 *           type: string
 *           enum: [easy, medium, hard]
 *         description: Filtrar por dificultad
 *         example: easy
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Número de página
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Ejercicios por página
 *         example: 10
 *     responses:
 *       200:
 *         description: Lista de ejercicios
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Exercise'
 */
router.get(
  '/',
  exerciseController.getAll.bind(exerciseController)
);

/**
 * @swagger
 * /api/exercises/{id}:
 *   get:
 *     summary: Obtener un ejercicio por ID
 *     tags: [Exercises]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del ejercicio
 *         example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: Ejercicio encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Exercise'
 *       404:
 *         description: Ejercicio no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       400:
 *         description: ID inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get(
  '/:id',
  validateId,
  exerciseController.getById.bind(exerciseController)
);

/**
 * @swagger
 * /api/exercises:
 *   post:
 *     summary: Crear un nuevo ejercicio
 *     tags: [Exercises]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - difficulty
 *               - language
 *             properties:
 *               title:
 *                 type: string
 *                 example: Suma de dos números
 *               description:
 *                 type: string
 *                 example: Crea una función que sume dos números enteros
 *               difficulty:
 *                 type: string
 *                 enum: [easy, medium, hard]
 *                 example: easy
 *               language:
 *                 type: string
 *                 example: javascript
 *               testCases:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     input:
 *                       type: array
 *                       example: [2, 3]
 *                     expectedOutput:
 *                       example: 5
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["básico", "matemáticas"]
 *     responses:
 *       201:
 *         description: Ejercicio creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Exercise'
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: No autenticado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post(
  '/',
  authenticate,
  validateBody,
  exerciseController.create.bind(exerciseController)
);

/**
 * @swagger
 * /api/exercises/{id}:
 *   patch:
 *     summary: Actualizar un ejercicio
 *     tags: [Exercises]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del ejercicio
 *         example: 507f1f77bcf86cd799439011
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Suma de tres números
 *               description:
 *                 type: string
 *               difficulty:
 *                 type: string
 *                 enum: [easy, medium, hard]
 *               language:
 *                 type: string
 *               testCases:
 *                 type: array
 *                 items:
 *                   type: object
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Ejercicio actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Exercise'
 *       404:
 *         description: Ejercicio no encontrado
 *       401:
 *         description: No autenticado
 *       400:
 *         description: Datos inválidos
 */
router.patch(
  '/:id',
  authenticate,
  validateId,
  validateBody,
  exerciseController.update.bind(exerciseController)
);

/**
 * @swagger
 * /api/exercises/{id}:
 *   delete:
 *     summary: Eliminar un ejercicio
 *     tags: [Exercises]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del ejercicio a eliminar
 *         example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: Ejercicio eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Ejercicio eliminado exitosamente
 *       404:
 *         description: Ejercicio no encontrado
 *       401:
 *         description: No autenticado
 *       400:
 *         description: ID inválido
 */
router.delete(
  '/:id',
  authenticate,
  validateId,
  exerciseController.delete.bind(exerciseController)
);

export default router;