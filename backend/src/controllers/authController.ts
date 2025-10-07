import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { UserValidator } from '../utils/user.validator';
import { JWTService } from '../services/jwtService';
import { AppError } from '../middleware/errorHandler';
import type { RegisterDTO, LoginDTO, AuthResponse } from '../types';

/**
 * Controlador para autenticación de usuarios
 */
export class AuthController {
  /**
   * Registra un nuevo usuario
   * 
   * @route POST /api/auth/register
   * @access Public
   * 
   * @param req - Request con body RegisterDTO
   * @param res - Response
   * @param next - NextFunction
   * 
   * @returns Token JWT y datos del usuario
   */
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { username, email, password }: RegisterDTO = req.body;

      // Validar username
      const usernameValidation = UserValidator.validateUsername(username);
      if (!usernameValidation.isValid) {
        throw new AppError(usernameValidation.error!, 400);
      }

      // Validar email
      const emailValidation = UserValidator.validateEmail(email);
      if (!emailValidation.isValid) {
        throw new AppError(emailValidation.error!, 400);
      }

      // Validar password
      const passwordValidation = UserValidator.validatePassword(password);
      if (!passwordValidation.isValid) {
        throw new AppError(passwordValidation.error!, 400);
      }

      // Verificar que el email no existe
      const existingEmail = await User.findOne({ email: emailValidation.sanitized });
      if (existingEmail) {
        throw new AppError('El email ya está registrado', 400);
      }

      // Verificar que el username no existe
      const existingUsername = await User.findOne({ username: usernameValidation.sanitized });
      if (existingUsername) {
        throw new AppError('El username ya está en uso', 400);
      }

      // Crear usuario
      const user = await User.create({
        username: usernameValidation.sanitized,
        email: emailValidation.sanitized,
        password // Se hasheará automáticamente en el pre-save hook
      });

      // Generar token
      const token = JWTService.generateToken({
        userId: user.id.toString(),
        email: user.email,
        role: user.role
      });

      // Preparar respuesta (sin password)
      const response: AuthResponse = {
        token,
        user: {
          _id: user.id.toString(),
          username: user.username,
          email: user.email,
          role: user.role
        }
      };

      res.status(201).json({
        success: true,
        data: response,
        message: 'Usuario registrado exitosamente'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Inicia sesión de usuario
   * 
   * @route POST /api/auth/login
   * @access Public
   * 
   * @param req - Request con body LoginDTO
   * @param res - Response
   * @param next - NextFunction
   * 
   * @returns Token JWT y datos del usuario
   */
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password }: LoginDTO = req.body;

      // Validar que se proporcionen credenciales
      if (!email || !password) {
        throw new AppError('Email y password son obligatorios', 400);
      }

      // Buscar usuario por email (incluyendo password)
      const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

      if (!user) {
        throw new AppError('Credenciales inválidas', 401);
      }

      // Verificar password
      const isPasswordValid = await user.comparePassword(password);

      if (!isPasswordValid) {
        throw new AppError('Credenciales inválidas', 401);
      }

      // Generar token
      const token = JWTService.generateToken({
        userId: user.id.toString(),
        email: user.email,
        role: user.role
      });

      // Preparar respuesta
      const response: AuthResponse = {
        token,
        user: {
          _id: user.id.toString(),
          username: user.username,
          email: user.email,
          role: user.role
        }
      };

      res.status(200).json({
        success: true,
        data: response,
        message: 'Login exitoso'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtiene datos del usuario autenticado
   * 
   * @route GET /api/auth/me
   * @access Private
   * 
   * @param req - Request (debe tener req.user del middleware)
   * @param res - Response
   * @param next - NextFunction
   * 
   * @returns Datos del usuario
   */
  async getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError('No autenticado', 401);
      }

      // Buscar usuario actualizado
      const user = await User.findById(req.user.userId);

      if (!user) {
        throw new AppError('Usuario no encontrado', 404);
      }

      res.status(200).json({
        success: true,
        data: user
      });
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();