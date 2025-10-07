/**
 * Rate Limiting Middleware
 * 
 * Protege contra ataques de fuerza bruta y spam
 */

import rateLimit from 'express-rate-limit';
import logger from '../config/logger.config';

/**
 * Rate limiter general para toda la API
 * 100 peticiones por 15 minutos por IP
 */
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // 100 peticiones por ventana
  message: {
    success: false,
    error: 'Demasiadas peticiones desde esta IP, por favor intenta de nuevo más tarde',
  },
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  handler: (req, res) => {
    logger.warn('⚠️ Rate limit alcanzado - General', {
      ip: req.ip,
      path: req.path,
      method: req.method,
    });
    
    res.status(429).json({
      success: false,
      error: 'Demasiadas peticiones desde esta IP, por favor intenta de nuevo más tarde',
    });
  },
});

/**
 * Rate limiter estricto para login
 * 5 intentos por 15 minutos por IP
 */
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // 5 intentos
  message: {
    success: false,
    error: 'Demasiados intentos de login. Por favor intenta de nuevo en 15 minutos',
  },
  skipSuccessfulRequests: true, // No contar requests exitosos
  handler: (req, res) => {
    logger.error('🚨 ALERTA: Rate limit alcanzado - Login', {
      ip: req.ip,
      email: req.body?.email,
      attempts: 5,
    });
    
    res.status(429).json({
      success: false,
      error: 'Demasiados intentos de login. Por favor intenta de nuevo en 15 minutos',
    });
  },
});

/**
 * Rate limiter para registro de usuarios
 * 3 registros por hora por IP
 */
export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 3, // 3 registros
  message: {
    success: false,
    error: 'Demasiados registros desde esta IP. Por favor intenta de nuevo más tarde',
  },
  handler: (req, res) => {
    logger.error('🚨 ALERTA: Rate limit alcanzado - Registro', {
      ip: req.ip,
      email: req.body?.email,
    });
    
    res.status(429).json({
      success: false,
      error: 'Demasiados registros desde esta IP. Por favor intenta de nuevo más tarde',
    });
  },
});

/**
 * Rate limiter moderado para creación de recursos
 * 20 peticiones por 15 minutos
 */
export const createResourceLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 20, // 20 creaciones
  message: {
    success: false,
    error: 'Demasiadas creaciones. Por favor intenta de nuevo más tarde',
  },
  handler: (req, res) => {
    logger.warn('⚠️ Rate limit alcanzado - Creación de recursos', {
      ip: req.ip,
      path: req.path,
    });
    
    res.status(429).json({
      success: false,
      error: 'Demasiadas creaciones. Por favor intenta de nuevo más tarde',
    });
  },
});