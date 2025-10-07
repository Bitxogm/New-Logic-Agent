/**
 * Security Middleware
 * 
 * Configura headers de seguridad y sanitización
 */

import helmet from 'helmet';
import { Express, Request, Response, NextFunction } from 'express';
import logger from '../config/logger.config';

/**
 * Configurar Helmet con headers de seguridad
 */
export const helmetConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    },
  },
  crossOriginEmbedderPolicy: false,
});

/**
 * Sanitización manual de MongoDB
 * Solo sanitiza el body (query y params se manejan diferente)
 */
export const mongoSanitize = (req: Request, _res: Response, next: NextFunction): void => {
  const sanitizeObject = (obj: any): any => {
    if (obj && typeof obj === 'object') {
      Object.keys(obj).forEach((key) => {
        // Remover claves que empiezan con $ o contienen .
        if (key.startsWith('$') || key.includes('.')) {
          logger.warn('🚨 Intento de NoSQL injection detectado', {
            ip: req.ip,
            key,
            path: req.path,
          });
          delete obj[key];
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
          obj[key] = sanitizeObject(obj[key]);
        }
      });
    }
    return obj;
  };

  // Solo sanitizar body (query y params son read-only)
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeObject(req.body);
  }

  next();
};

/**
 * Aplicar todos los middleware de seguridad
 */
export const applySecurity = (app: Express): void => {
  // Helmet - Headers de seguridad
  app.use(helmetConfig);
  
  // Sanitización manual de MongoDB (solo body)
  app.use(mongoSanitize);
  
  logger.info('✅ Middleware de seguridad aplicado');
};