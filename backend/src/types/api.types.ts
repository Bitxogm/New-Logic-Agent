/**
 * Respuesta estándar de la API
 * Todas las respuestas siguen este formato
 */
export interface ApiResponse<T = unknown> {
  /** Indica si la operación fue exitosa */
  success: boolean;
  /** Datos de respuesta (puede ser cualquier tipo) */
  data?: T;
  /** Mensaje descriptivo (opcional) */
  message?: string;
  /** Mensaje de error (solo si success = false) */
  error?: string;
}

/**
 * Información de paginación
 */
export interface PaginationInfo {
  /** Página actual */
  page: number;
  /** Elementos por página */
  limit: number;
  /** Total de elementos */
  total: number;
  /** Total de páginas */
  totalPages: number;
}

/**
 * Respuesta paginada de la API
 * Para endpoints que devuelven listas
 */
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  /** Información de paginación */
  pagination: PaginationInfo;
}

/**
 * Ejemplo de uso:
 * 
 * // Respuesta simple
 * const response: ApiResponse<Exercise> = {
 *   success: true,
 *   data: exercise,
 *   message: 'Ejercicio creado exitosamente'
 * }
 * 
 * // Respuesta paginada
 * const response: PaginatedResponse<Exercise> = {
 *   success: true,
 *   data: exercises,
 *   pagination: {
 *     page: 1,
 *     limit: 10,
 *     total: 50,
 *     totalPages: 5
 *   }
 * }
 * 
 * // Respuesta de error
 * const response: ApiResponse = {
 *   success: false,
 *   error: 'Ejercicio no encontrado'
 * }
 */