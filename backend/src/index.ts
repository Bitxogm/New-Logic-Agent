import express, { Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDatabase } from './config/database';
import exerciseRoutes from './routes/exercises';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

// Cargar variables de entorno
dotenv.config();

/**
 * Crea y configura la aplicación Express
 */
function createApp(): Express {
  const app = express();

  // Middleware básico
  app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true
  }));
  
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Ruta de health check
  app.get('/health', (_req, res) => {
    res.json({
      success: true,
      message: 'API funcionando correctamente',
      timestamp: new Date().toISOString()
    });
  });

  // Rutas principales
  app.use('/api/exercises', exerciseRoutes);

  // Manejo de errores
  app.use(notFoundHandler);
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

    // Crear app
    const app = createApp();

    // Puerto
    const PORT = process.env.PORT || 5000;

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`✅ Servidor corriendo en puerto ${PORT}`);
      console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
      console.log(`📝 API: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('❌ Error iniciando servidor:', error);
    process.exit(1);
  }
}

// Manejo de señales de terminación
process.on('SIGTERM', () => {
  console.log('SIGTERM recibido, cerrando servidor...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT recibido, cerrando servidor...');
  process.exit(0);
});

// Iniciar solo si no estamos en modo test
if (process.env.NODE_ENV !== 'test') {
  startServer();
}

// Exportar app para tests
export { createApp };