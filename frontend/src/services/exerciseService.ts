import api, { ApiResponse, getResponseData } from './api';
import {
  Exercise,
  CreateExerciseData,
  UpdateExerciseData,
  ExerciseFilters,
} from '../types';

/**
 * Servicio de Ejercicios
 * Maneja todas las peticiones relacionadas con exercises
 */
class ExerciseService {
  /**
   * Obtener todos los ejercicios con filtros opcionales
   */
  async getAll(filters?: ExerciseFilters): Promise<Exercise[]> {
    const params = new URLSearchParams();

    if (filters?.language) params.append('language', filters.language);
    if (filters?.difficulty) params.append('difficulty', filters.difficulty);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.search) params.append('search', filters.search);

    const response = await api.get<ApiResponse<Exercise[]>>(
      `/exercises?${params.toString()}`
    );
    return getResponseData(response);
  }

  /**
   * Obtener ejercicio por ID
   */
  async getById(id: string): Promise<Exercise> {
    const response = await api.get<ApiResponse<Exercise>>(`/exercises/${id}`);
    return getResponseData(response);
  }

  /**
   * Crear nuevo ejercicio (requiere autenticación)
   */
  async create(data: CreateExerciseData): Promise<Exercise> {
    const response = await api.post<ApiResponse<Exercise>>('/exercises', data);
    return getResponseData(response);
  }

  /**
   * Actualizar ejercicio (requiere autenticación)
   */
  async update(id: string, data: UpdateExerciseData): Promise<Exercise> {
    const response = await api.patch<ApiResponse<Exercise>>(
      `/exercises/${id}`,
      data
    );
    return getResponseData(response);
  }

  /**
   * Eliminar ejercicio (requiere autenticación)
   */
  async delete(id: string): Promise<void> {
    await api.delete(`/exercises/${id}`);
  }

  /**
   * Buscar ejercicios por término
   */
  async search(query: string): Promise<Exercise[]> {
    const response = await api.get<ApiResponse<Exercise[]>>(
      `/exercises?search=${encodeURIComponent(query)}`
    );
    return getResponseData(response);
  }

  /**
   * Obtener ejercicios por lenguaje
   */
  async getByLanguage(language: string): Promise<Exercise[]> {
    const response = await api.get<ApiResponse<Exercise[]>>(
      `/exercises?language=${language}`
    );
    return getResponseData(response);
  }

  /**
   * Obtener ejercicios por dificultad
   */
  async getByDifficulty(difficulty: string): Promise<Exercise[]> {
    const response = await api.get<ApiResponse<Exercise[]>>(
      `/exercises?difficulty=${difficulty}`
    );
    return getResponseData(response);
  }
}

// Exportar instancia única (singleton)
export const exerciseService = new ExerciseService();