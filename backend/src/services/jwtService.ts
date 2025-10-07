import jwt from 'jsonwebtoken';
import type { JWTPayload } from '../types';

/**
 * Servicio para gestionar JSON Web Tokens
 */
export class JWTService {
  private static readonly SECRET = process.env.JWT_SECRET || 'default-secret-change-in-production';
  private static readonly EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

  /**
   * Genera un token JWT para un usuario
   * 
   * @param payload - Datos a incluir en el token
   * @returns Token JWT firmado
   * 
   * @example
   * const token = JWTService.generateToken({
   *   userId: user._id.toString(),
   *   email: user.email,
   *   role: user.role
   * });
   */
  static generateToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
    return jwt.sign(payload, this.SECRET, {
      expiresIn: this.EXPIRES_IN,
      issuer: 'agentlogic-api'
    });
  }

  /**
   * Verifica y decodifica un token JWT
   * 
   * @param token - Token a verificar
   * @returns Payload del token si es válido
   * @throws Error si el token es inválido o expiró
   * 
   * @example
   * try {
   *   const payload = JWTService.verifyToken(token);
   *   console.log('User ID:', payload.userId);
   * } catch (error) {
   *   console.error('Token inválido');
   * }
   */
  static verifyToken(token: string): JWTPayload {
    try {
      const decoded = jwt.verify(token, this.SECRET) as JWTPayload;
      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error('Token expirado');
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new Error('Token inválido');
      }
      throw new Error('Error verificando token');
    }
  }

  /**
   * Decodifica un token sin verificar (útil para debugging)
   * NO usar para autenticación
   * 
   * @param token - Token a decodificar
   * @returns Payload del token sin verificar
   */
  static decodeToken(token: string): JWTPayload | null {
    try {
      return jwt.decode(token) as JWTPayload;
    } catch {
      return null;
    }
  }
}