/**
 * Punto de entrada para todos los tipos
 * Permite importar desde un solo lugar
 */

// Tipos de ejercicios
export type {
  DifficultyLevel,
  ProgrammingLanguage,
  TestCase,
  IExercise,
  CreateExerciseDTO,
  UpdateExerciseDTO,
  ExerciseResponse,
  ExerciseFilters
} from './exercise.types';

// Tipos de API
export type {
  ApiResponse,
  PaginationInfo,
  PaginatedResponse
} from './api.types';

/**
 * Ahora puedes importar así:
 * 
 * import { IExercise, ApiResponse, DifficultyLevel } from '@/types';
 */