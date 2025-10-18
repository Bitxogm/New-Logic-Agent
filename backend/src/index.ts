import express, { Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger.config';
import { connectDatabase } from './config/database';
import exerciseRoutes from './routes/exercises';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import authRoutes from './routes/auth';
import { httpLogger, errorLogger, logServerStart, logDatabaseConnection } from './middleware/logger.middleware';
import logger from './config/logger.config';
import { generalLimiter } from './middleware/rateLimiter';
import { applySecurity } from './middleware/security';
import { validateEnv } from './config/env.config';
import aiRoutes from './routes/ai';
import testExecutionRoutes from './routes/testExecution';
import gamificationRoutes from './routes/gamification';
import analyticsRoutes from './routes/analytics';
import seedRoutes from './routes/seed';


// Cargar variables de entorno
dotenv.config();

// ✅ AÑADIR: Validar variables de entorno al inicio
try {
  validateEnv();
} catch (error) {
  console.error('Error en variables de entorno:', error);
  process.exit(1);
}

/**
 * Crea y configura la aplicación Express
 */
function createApp(): Express {
  const app = express();

  // ✅ AÑADIR: Seguridad (primero de todo)
  applySecurity(app);

  // Logger HTTP
  app.use(httpLogger);

  // Rate limiting general
  app.use(generalLimiter);

  // CORS
  app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true
  }));

  // Parsing
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  // ✅ AÑADIR: Swagger UI
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'AgentLogic API Docs',
  }));

  // ✅ AÑADIR: Endpoint para spec JSON
  app.get('/api-docs.json', (_req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  /**
   * @swagger
   * /health:
   *   get:
   *     summary: Health check del servidor
   *     tags: [Health]
   *     responses:
   *       200:
   *         description: Servidor funcionando correctamente
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
   *                   example: API funcionando correctamente
   *                 timestamp:
   *                   type: string
   *                   format: date-time
   */

  // Ruta de health check
  app.get('/health', (_req, res) => {
    logger.info('Health check solicitado');
    res.json({
      success: true,
      message: 'API funcionando correctamente',
      timestamp: new Date().toISOString()
    });
  });

  // Rutas principales
  app.use('/api/exercises', exerciseRoutes);
  app.use('/api/auth', authRoutes);
  app.use('/api/ai', aiRoutes);
  app.use('/api/test-execution', testExecutionRoutes);
  app.use('/api/gamification', gamificationRoutes);
  app.use('/api/analytics', analyticsRoutes);
  app.use('/api', seedRoutes);

  // Manejo de errores
  app.use(notFoundHandler);
  app.use(errorLogger);
  app.use(errorHandler);

  return app;
}

/**
 * Inicia el servidor
 */
async function startServer(): Promise<void> {
  try {
    await connectDatabase();
    logDatabaseConnection(true);

    const app = createApp();
    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      logServerStart(PORT);
      logger.info(`📚 Swagger UI: http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    logDatabaseConnection(false, error as Error);
    logger.error('❌ Error iniciando servidor:', error);
    process.exit(1);
  }
}

// Manejo de señales de terminación
process.on('SIGTERM', () => {
  logger.warn('⚠️ SIGTERM recibido, cerrando servidor...');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.warn('⚠️ SIGINT recibido, cerrando servidor...');
  process.exit(0);
});

// Iniciar solo si no estamos en modo test
if (process.env.NODE_ENV !== 'test') {
  startServer();
}

export { createApp };