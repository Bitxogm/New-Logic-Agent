import express, { Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDatabase } from './config/database';
import exerciseRoutes from './routes/exercises';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import authRoutes from './routes/auth';

// ✅ AÑADIR ESTAS 2 LÍNEAS
import { httpLogger, errorLogger, logServerStart, logDatabaseConnection } from './middleware/logger.middleware';
import logger from './config/logger.config';

// Cargar variables de entorno
dotenv.config();

/**
 * Crea y configura la aplicación Express
 */
function createApp(): Express {
  const app = express();
  
  // ✅ AÑADIR ESTA LÍNEA (primero de todo, antes de cors)
  app.use(httpLogger); // Loguear todas las peticiones HTTP
  
  // Middleware básico
  app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true
  }));
  
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Ruta de health check
  app.get('/health', (_req, res) => {
    logger.info('Health check solicitado'); // ✅ AÑADIR esto
    res.json({
      success: true,
      message: 'API funcionando correctamente',
      timestamp: new Date().toISOString()
    });
  });

  // Rutas principales
  app.use('/api/exercises', exerciseRoutes);
  app.use('/api/auth', authRoutes);

  // Manejo de errores
  app.use(notFoundHandler);
  app.use(errorLogger);  // ✅ AÑADIR esto (antes de errorHandler)
  app.use(errorHandler);

  return app;
}

/**
 * Inicia el servidor
 */
async function startServer(): Promise<void> {
  try {
    // Conectar a la base de datos
    await connectDatabase();
    logDatabaseConnection(true); // ✅ AÑADIR esto

    // Crear app
    const app = createApp();

    // Puerto
    const PORT = process.env.PORT || 5000;

    // Iniciar servidor
    app.listen(PORT, () => {
      logServerStart(PORT); // ✅ CAMBIAR los console.log por esto
    });
  } catch (error) {
    logDatabaseConnection(false, error as Error); // ✅ AÑADIR esto
    logger.error('❌ Error iniciando servidor:', error);
    process.exit(1);
  }
}

// Manejo de señales de terminación
process.on('SIGTERM', () => {
  logger.warn('⚠️ SIGTERM recibido, cerrando servidor...'); // ✅ CAMBIAR console.log
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.warn('⚠️ SIGINT recibido, cerrando servidor...'); // ✅ CAMBIAR console.log
  process.exit(0);
});

// Iniciar solo si no estamos en modo test
if (process.env.NODE_ENV !== 'test') {
  startServer();
}

// Exportar app para tests
export { createApp };