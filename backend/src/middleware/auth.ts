import { Request, Response, NextFunction } from 'express';
import { JWTService } from '../services/jwtService';
import { User } from '../models/User';
import { AppError } from './errorHandler';
import type { JWTPayload } from '../types';

// Extender Request de Express para incluir user
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
        role: string;
      };
    }
  }
}

/**
 * Middleware de autenticación JWT
 * Verifica que el usuario tenga un token válido
 * 
 * @param req - Request de Express
 * @param res - Response de Express
 * @param next - NextFunction
 * 
 * @throws {AppError} 401 - Si no hay token o es inválido
 * 
 * @example
 * router.get('/protected', authenticate, (req, res) => {
 *   console.log('User ID:', req.user.userId);
 * });
 */
export async function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Obtener token del header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('No se proporcionó token de autenticación', 401);
    }

    const token = authHeader.substring(7); // Remover 'Bearer '

    // Verificar token
    const payload: JWTPayload = JWTService.verifyToken(token);

    // Verificar que el usuario existe
    const user = await User.findById(payload.userId);

    if (!user) {
      throw new AppError('Usuario no encontrado', 401);
    }

    // Añadir datos del usuario al request
    req.user = {
      userId: payload.userId,
      email: payload.email,
      role: payload.role
    };

    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      next(new AppError('Token inválido o expirado', 401));
    }
  }
}

/**
 * Middleware para verificar rol de administrador
 * Debe usarse después del middleware authenticate
 * 
 * @param req - Request de Express
 * @param res - Response de Express
 * @param next - NextFunction
 * 
 * @throws {AppError} 403 - Si el usuario no es admin
 */
export function requireAdmin(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  if (!req.user) {
    throw new AppError('No autenticado', 401);
  }

  if (req.user.role !== 'admin') {
    throw new AppError('Acceso denegado. Se requieren permisos de administrador', 403);
  }

  next();
}