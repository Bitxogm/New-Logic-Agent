import mongoose from 'mongoose';
import logger from './logger.config';


/**
 * Conecta a la base de datos MongoDB
 * 
 * @returns Promise que se resuelve cuando la conexión es exitosa
 * @throws Error si no puede conectar
 * 
 * @example
 * await connectDatabase();
 * logger.info('Conectado a MongoDB');
 */
export async function connectDatabase(): Promise<void> {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27018/agentlogic';
    
    await mongoose.connect(mongoUri);
    
    logger.info('✅ Conectado a MongoDB');
    
    // Log de eventos de conexión
    mongoose.connection.on('error', (error) => {
      logger.error('❌ Error de MongoDB:', error);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('⚠️ MongoDB desconectado');
    });

  } catch (error) {
    logger.error('❌ Error conectando a MongoDB:', error);
    // En producción, deberías usar un logger profesional
    process.exit(1);
  }
}

/**
 * Desconecta de la base de datos
 * Útil para tests y shutdown graceful
 */
export async function disconnectDatabase(): Promise<void> {
  try {
    await mongoose.disconnect();
    logger.info('MongoDB desconectado correctamente');
  } catch (error) {
    logger.error('Error desconectando MongoDB:', error);
  }
}

/**
 * Limpia todas las colecciones
 * Solo para testing
 */
export async function clearDatabase(): Promise<void> {
  if (process.env.NODE_ENV !== 'test') {
    throw new Error('clearDatabase solo puede usarse en entorno de test');
  }

  const collections = mongoose.connection.collections;
  
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
}