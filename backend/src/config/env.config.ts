/**
 * Validación de Variables de Entorno
 * 
 * Verifica que todas las variables necesarias existan al inicio
 */

import logger from './logger.config';

interface EnvConfig {
  NODE_ENV: string;
  PORT: string;
  MONGODB_URI: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  CORS_ORIGIN: string;
}

/**
 * Variables de entorno requeridas
 */
const requiredEnvVars = [
  'MONGODB_URI',
  'JWT_SECRET',
  'GEMINI_API_KEY',
  ...(process.env.NODE_ENV === 'production' ? ['CORS_ORIGIN'] : [])
] as const;


/**
 * Variables de entorno opcionales con valores por defecto
 */
const defaultEnvVars: Partial<EnvConfig> = {
  NODE_ENV: 'development',
  PORT: '5000',
  JWT_EXPIRES_IN: '7d',
  CORS_ORIGIN: 'http://localhost:5173',
};

/**
 * Validar variables de entorno
 */
export const validateEnv = (): void => {
  logger.info('🔍 Validando variables de entorno...');

  const missing: string[] = [];

  // Verificar variables requeridas
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      missing.push(envVar);
    }
  }

  // Si faltan variables críticas, fallar
  if (missing.length > 0) {
    logger.error('❌ Faltan variables de entorno requeridas:', { missing });
    throw new Error(
      `Variables de entorno faltantes: ${missing.join(', ')}\n` +
      'Por favor configura estas variables en tu archivo .env'
    );
  }

  // Aplicar valores por defecto a variables opcionales
  for (const [key, value] of Object.entries(defaultEnvVars)) {
    if (!process.env[key]) {
      process.env[key] = value;
      logger.info(`ℹ️  Variable ${key} no definida, usando valor por defecto: ${value}`);
    }
  }

  logger.info('✅ Variables de entorno validadas correctamente');
};

/**
 * Obtener configuración de entorno (con tipos)
 */
export const getEnvConfig = (): EnvConfig => {
  return {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: process.env.PORT || '5000',
    MONGODB_URI: process.env.MONGODB_URI!,
    JWT_SECRET: process.env.JWT_SECRET!,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
    CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',
  };
};