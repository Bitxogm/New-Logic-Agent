/**
 * Rate Limiting Middleware
 * 
 * Protege contra ataques de fuerza bruta y spam
 */

import rateLimit from 'express-rate-limit';
import logger from '../config/logger.config';

// ✅ AÑADIR: Deshabilitar rate limiting en tests
const isTestEnvironment = process.env.NODE_ENV === 'test';

/**
 * Rate limiter general para toda la API
 * 100 peticiones por 15 minutos por IP
 */
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  skip: () => isTestEnvironment, // ✅ AÑADIR: Skip en tests
  message: {
    success: false,
    error: 'Demasiadas peticiones desde esta IP, por favor intenta de nuevo más tarde',
  },
  standardHeaders: true,
  legacyHeaders: false,
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
  windowMs: 15 * 60 * 1000,
  max: 5,
  skip: () => isTestEnvironment, // ✅ AÑADIR: Skip en tests
  skipSuccessfulRequests: true,
  message: {
    success: false,
    error: 'Demasiados intentos de login. Por favor intenta de nuevo en 15 minutos',
  },
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
export const testExecutionLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 20,
  skip: () => isTestEnvironment,
  message: {
    success: false,
    error: 'Demasiadas ejecuciones de tests. Por favor intenta de nuevo más tarde',
  },
  handler: (req, res) => {
    logger.warn('⚠️ Rate limit alcanzado - Test Execution', {
      ip: req.ip,
      path: req.path,
    });

    res.status(429).json({
      success: false,
      error: 'Demasiadas ejecuciones de tests. Por favor intenta de nuevo más tarde',
    });
  },
});

export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  skip: () => isTestEnvironment, // ✅ AÑADIR: Skip en tests
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
  windowMs: 15 * 60 * 1000,
  max: 20,
  skip: () => isTestEnvironment, // ✅ AÑADIR: Skip en tests
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