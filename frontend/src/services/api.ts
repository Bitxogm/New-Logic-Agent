import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { toast } from 'sonner';

/**
 * Configuración base de Axios
 */
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Instancia de Axios configurada
 */
const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 30000, // 30 segundos
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Interceptor de Request: Añade el token JWT automáticamente
 */
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

/**
 * Interceptor de Response: Maneja errores globalmente
 */
api.interceptors.response.use(
  (response) => {
    // Respuesta exitosa, retornar data directamente
    return response;
  },
  (error: AxiosError<{ error?: string; message?: string }>) => {
    // Manejo de errores
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 400:
          toast.error(data.error || 'Solicitud inválida');
          break;
        case 401:
          toast.error('Sesión expirada. Por favor, inicia sesión de nuevo');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          // Redirigir a login si no estamos ya ahí
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
          break;
        case 403:
          toast.error('No tienes permisos para realizar esta acción');
          break;
        case 404:
          toast.error(data.error || 'Recurso no encontrado');
          break;
        case 429:
          toast.error(data.error || 'Demasiadas peticiones. Intenta de nuevo más tarde');
          break;
        case 500:
          toast.error('Error del servidor. Intenta de nuevo más tarde');
          break;
        default:
          toast.error(data.error || 'Ha ocurrido un error inesperado');
      }
    } else if (error.request) {
      // Error de red o servidor no disponible
      toast.error('No se pudo conectar con el servidor. Verifica tu conexión');
    } else {
      toast.error('Error al procesar la solicitud');
    }

    return Promise.reject(error);
  }
);

/**
 * Tipos de respuesta de la API
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Helper para extraer data de la respuesta
 */
export const getResponseData = <T>(response: { data: ApiResponse<T> }): T => {
  return response.data.data as T;
};

export default api;