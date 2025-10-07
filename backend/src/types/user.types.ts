import { ObjectId } from 'mongodb';

/**
 * Rol del usuario en el sistema
 */
export type UserRole = 'user' | 'admin';

/**
 * Documento de usuario en MongoDB con métodos de instancia
 */
export interface IUser {
  _id: ObjectId;
  /** Nombre de usuario único */
  username: string;
  /** Email único */
  email: string;
  /** Password hasheado (nunca se devuelve al cliente) */
  password: string;
  /** Rol del usuario */
  role: UserRole;
  /** Fecha de creación */
  createdAt: Date;
  /** Fecha de última actualización */
  updatedAt: Date;
  
  /**
   * Método de instancia: Compara password con el hash almacenado
   * @param candidatePassword - Password a comparar
   * @returns true si coincide, false si no
   */
  comparePassword(candidatePassword: string): Promise<boolean>;
}

/**
 * DTO para registro de usuario
 */
export interface RegisterDTO {
  username: string;
  email: string;
  password: string;
}

/**
 * DTO para login
 */
export interface LoginDTO {
  email: string;
  password: string;
}

/**
 * Respuesta de autenticación con token
 */
export interface AuthResponse {
  token: string;
  user: {
    _id: string;
    username: string;
    email: string;
    role: UserRole;
  };
}

/**
 * Payload del JWT token
 */
export interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}