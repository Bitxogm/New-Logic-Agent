/**
 * Configuración de Winston Logger
 * Sistema de logging profesional con:
 * - Diferentes niveles (error, warn, info, debug)
 * - Archivos separados por nivel
 * - Rotación diaria de logs
 * - Formato JSON para producción
 * - Formato colorizado para desarrollo
 */

import winston from 'winston';
import path from 'path';

// Niveles de log (orden de severidad)
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Colores para cada nivel (solo en desarrollo)
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'blue',
};

winston.addColors(colors);

// Determinar nivel de log según entorno
const level = (): string => {
  const env = process.env.NODE_ENV || 'development';
  const isDevelopment = env === 'development';
  return isDevelopment ? 'debug' : 'info';
};

// Formato para desarrollo (colorizado y legible)
const developmentFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} [${info.level}]: ${info.message}`
  )
);

// Formato para producción (JSON estructurado)
const productionFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Elegir formato según entorno
const format =
  process.env.NODE_ENV === 'production'
    ? productionFormat
    : developmentFormat;

// Directorio de logs
const logsDir = path.join(process.cwd(), 'logs');

// Transports (destinos de los logs)
const transports: winston.transport[] = [
  // Consola (todos los niveles)
  new winston.transports.Console(),

  // Archivo de errores (solo errores)
  new winston.transports.File({
    filename: path.join(logsDir, 'error.log'),
    level: 'error',
    maxsize: 5242880, // 5MB
    maxFiles: 5,
  }),

  // Archivo combinado (todos los niveles)
  new winston.transports.File({
    filename: path.join(logsDir, 'combined.log'),
    maxsize: 5242880, // 5MB
    maxFiles: 5,
  }),
];

// Crear logger
const logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports,
  // No salir en errores no capturados
  exitOnError: false,
});

// Método auxiliar para sanitizar objetos antes de loguear
export const sanitizeForLog = (obj: any): any => {
  if (!obj || typeof obj !== 'object') return obj;

  const sensitiveFields = ['password', 'token', 'authorization', 'cookie'];
  const sanitized = { ...obj };

  for (const key in sanitized) {
    if (sensitiveFields.some((field) => key.toLowerCase().includes(field))) {
      sanitized[key] = '***REDACTED***';
    } else if (typeof sanitized[key] === 'object') {
      sanitized[key] = sanitizeForLog(sanitized[key]);
    }
  }

  return sanitized;
};

export default logger;