import { ObjectId } from 'mongodb';

/**
 * Nivel de dificultad del ejercicio
 */
export type DifficultyLevel = 'easy' | 'medium' | 'hard';

/**
 * Lenguajes de programación soportados
 */
export type ProgrammingLanguage =
  | 'python'
  | 'javascript'
  | 'typescript'
  | 'java'
  | 'cpp'
  | 'c'
  | 'csharp'
  | 'go'
  | 'rust'
  | 'php'
  | 'ruby';

export type ExerciseCategory =
  | 'arrays'
  | 'strings'
  | 'loops'
  | 'data-structures'
  | 'algorithms'
  | 'logic-math';

/**
 * Caso de prueba para validar soluciones
 */
export interface TestCase {
  /** Entrada del caso de prueba */
  input: string | Record<string, unknown>;
  /** Salida esperada */
  expectedOutput: string | Record<string, unknown>;
  /** Descripción opcional del caso */
  description?: string;
}

/**
 * Documento de ejercicio en MongoDB
 * Esta interfaz representa cómo se guarda en la base de datos
 */
export interface IExercise {
  /** ID único del ejercicio (MongoDB) */
  _id: ObjectId;
  /** Título del ejercicio */
  title: string;
  /** Descripción detallada del problema */
  description: string;
  /** Lenguaje de programación objetivo */
  language: ProgrammingLanguage;
  /** Nivel de dificultad */
  difficulty: DifficultyLevel;
  /** Etiquetas para categorización (ej: arrays, algoritmos) */
  tags: string[];
  category: ExerciseCategory;
  /** Palabras clave para búsqueda avanzada */
  keywords: string[];
  /** Casos de prueba para validar soluciones */
  testCases: TestCase[];
  /** Solución de referencia (opcional) */
  solution?: string;
  /** Fecha de creación */
  createdAt: Date;
  /** Fecha de última actualización */
  updatedAt: Date;
  /** ID del usuario que creó el ejercicio (opcional, para futuro) */
  userId?: ObjectId;
}

/**
 * DTO (Data Transfer Object) para crear un ejercicio
 * Los campos que el usuario envía al crear un ejercicio
 */
export interface CreateExerciseDTO {
  /** Título del ejercicio (3-200 caracteres) */
  title: string;
  /** Descripción del problema (10-5000 caracteres) */
  description: string;
  /** Lenguaje de programación */
  language: ProgrammingLanguage;
  /** Nivel de dificultad */
  difficulty: DifficultyLevel;
  /** Etiquetas opcionales */
  tags?: string[];
  category: ExerciseCategory;
  /** Palabras clave opcionales */
  keywords?: string[];
  /** Casos de prueba opcionales */
  testCases?: TestCase[];
  /** Solución de referencia opcional */
  solution?: string;
}

/**
 * DTO para actualizar un ejercicio
 * Todos los campos son opcionales (puedes actualizar solo lo que quieras)
 */
export interface UpdateExerciseDTO {
  title?: string;
  description?: string;
  language?: ProgrammingLanguage;
  difficulty?: DifficultyLevel;
  tags?: string[];
  category?: ExerciseCategory;
  keywords?: string[];
  testCases?: TestCase[];
  solution?: string;
}

/**
 * Respuesta de la API para un ejercicio
 * Lo que devolvemos al frontend (sin campos internos)
 */
export interface ExerciseResponse {
  _id: string;
  title: string;
  description: string;
  language: ProgrammingLanguage;
  difficulty: DifficultyLevel;
  tags: string[];
  category: ExerciseCategory;
  keywords: string[];
  testCases: TestCase[];
  solution?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Filtros para búsqueda de ejercicios
 */
export interface ExerciseFilters {
  /** Buscar por texto en título/descripción */
  search?: string;
  /** Filtrar por dificultad */
  difficulty?: DifficultyLevel;
  /** Filtrar por lenguaje */
  language?: ProgrammingLanguage;
  /** Filtrar por categoría */
  category?: ExerciseCategory;
  /** Filtrar por etiquetas */
  tags?: string[];
  /** Número de página (para paginación) */
  page?: number;
  /** Cantidad de resultados por página */
  limit?: number;
}