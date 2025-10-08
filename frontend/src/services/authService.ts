import api, { ApiResponse, getResponseData } from './api';
import { 
  User, 
  LoginData, 
  RegisterData, 
  AuthResponse 
} from '../types';

/**
 * Servicio de Autenticación
 * Maneja todas las peticiones relacionadas con auth
 */
class AuthService {
  /**
   * Registrar nuevo usuario
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/register', data);
    return getResponseData(response);
  }

  /**
   * Iniciar sesión
   */
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', data);
    return getResponseData(response);
  }

  /**
   * Obtener usuario actual (requiere token)
   */
  async getMe(): Promise<User> {
    const response = await api.get<ApiResponse<User>>('/auth/me');
    return getResponseData(response);
  }

  /**
   * Cerrar sesión (limpiar token del lado del cliente)
   */
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  /**
   * Verificar si el token es válido
   */
  async verifyToken(): Promise<boolean> {
    try {
      await this.getMe();
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Verificar si hay un token guardado
   */
  hasToken(): boolean {
    return !!localStorage.getItem('token');
  }
}

// Exportar instancia única (singleton)
export const authService = new AuthService();