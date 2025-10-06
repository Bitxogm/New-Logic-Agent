import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler';

/**
 * Valida que el body de la petición no esté vacío
 */
export function validateBody(req: Request, res: Response, next: NextFunction): void {
  if (!req.body || Object.keys(req.body).length === 0) {
    throw new AppError('El cuerpo de la petición no puede estar vacío', 400);
  }
  next();
}

/**
 * Valida que un parámetro sea un ID de MongoDB válido
 * 
 * @param paramName - Nombre del parámetro a validar (default: 'id')
 */
export function validateMongoId(paramName: string = 'id') {
  return (req: Request, res: Response, next: NextFunction): void => {
    const id = req.params[paramName];
    
    // Regex para validar ObjectId de MongoDB (24 caracteres hexadecimales)
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      throw new AppError('ID inválido', 400);
    }
    
    next();
  };
}