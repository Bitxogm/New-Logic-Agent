import { Request, Response, NextFunction } from 'express';

/**
 * Error personalizado de la aplicación
 */
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  /**
   * Crea un error de aplicación
   * 
   * @param message - Mensaje de error
   * @param statusCode - Código HTTP de estado
   */
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Middleware global para manejar errores
 * 
 * @param err - Error capturado
 * @param req - Request de Express
 * @param res - Response de Express
 * @param next - NextFunction
 */
export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.error('❌ Error capturado:', err);

  // Error operacional (controlado)
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: err.message
    });
    return;
  }

  // Error de validación de Mongoose
  if (err.name === 'ValidationError') {
    res.status(400).json({
      success: false,
      error: 'Error de validación',
      details: err.message
    });
    return;
  }

  // Error de cast de Mongoose (ID inválido)
  if (err.name === 'CastError') {
    res.status(400).json({
      success: false,
      error: 'ID inválido'
    });
    return;
  }

  // Error genérico
  res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'development' 
      ? err.message 
      : 'Error interno del servidor'
  });
}

/**
 * Middleware para rutas no encontradas
 */
export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    success: false,
    error: 'Ruta no encontrada'
  });
}