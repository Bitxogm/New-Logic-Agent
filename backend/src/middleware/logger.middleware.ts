/**
 * Middleware de Logging para Express
 */

import { Request, Response, NextFunction } from 'express';
import logger, { sanitizeForLog } from '../config/logger.config';

/**
 * Middleware que loguea todas las peticiones HTTP
 */
export const httpLogger = (req: Request, res: Response, next: NextFunction): void => {
  const startTime = Date.now();

  // Capturar el método original de res.json para loguear después de la respuesta
  const originalJson = res.json.bind(res);
  
  res.json = function (body: any) {
    const duration = Date.now() - startTime;
    const statusCode = res.statusCode;

    // Determinar nivel de log según status code
    let logLevel: 'info' | 'warn' | 'error' = 'info';
    if (statusCode >= 500) {
      logLevel = 'error';
    } else if (statusCode >= 400) {
      logLevel = 'warn';
    }

    // Información de la petición (sanitizada)
    const logData = {
      method: req.method,
      url: req.originalUrl || req.url,
      status: statusCode,
      duration: `${duration}ms`,
      ip: req.ip || req.socket.remoteAddress,
      userAgent: req.get('user-agent') || 'unknown',
    };

    // Mensaje de log
    const message = `${req.method} ${req.originalUrl || req.url} ${statusCode} - ${duration}ms`;

    // Loguear según nivel
    logger[logLevel](message, sanitizeForLog(logData));

    // Llamar al método original
    return originalJson(body);
  };

  next();
};

/**
 * Middleware que loguea errores no capturados
 */
export const errorLogger = (
  err: Error,
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  // Loguear el error con contexto
  logger.error('Error no capturado:', {
    error: {
      message: err.message,
      stack: err.stack,
      name: err.name,
    },
    request: {
      method: req.method,
      url: req.originalUrl || req.url,
      ip: req.ip || req.socket.remoteAddress,
      headers: sanitizeForLog(req.headers),
    },
  });

  next(err);
};

/**
 * Loguear inicio de servidor
 */
export const logServerStart = (port: number | string): void => {
  logger.info(`🚀 Servidor iniciado en puerto ${port}`);
  logger.info(`📝 Entorno: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`🗄️  MongoDB: ${process.env.MONGODB_URI ? 'Configurado' : 'No configurado'}`);
};

/**
 * Loguear conexión a base de datos
 */
export const logDatabaseConnection = (success: boolean, error?: Error): void => {
  if (success) {
    logger.info('✅ Conectado a MongoDB correctamente');
  } else {
    logger.error('❌ Error conectando a MongoDB:', {
      error: error?.message,
      stack: error?.stack,
    });
  }
};

/**
 * Loguear cierre de aplicación
 */
export const logAppShutdown = (reason: string): void => {
  logger.warn(`⚠️  Cerrando aplicación: ${reason}`);
};