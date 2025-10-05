import { describe, it, expect } from 'vitest';
import type { 
  DifficultyLevel, 
  ProgrammingLanguage, 
  CreateExerciseDTO,
  TestCase,
  ApiResponse,
  PaginatedResponse
} from '../../types';

describe('TypeScript Types', () => {
  describe('DifficultyLevel', () => {
    it('debe aceptar valores válidos', () => {
      const easy: DifficultyLevel = 'easy';
      const medium: DifficultyLevel = 'medium';
      const hard: DifficultyLevel = 'hard';

      expect(easy).toBe('easy');
      expect(medium).toBe('medium');
      expect(hard).toBe('hard');
    });
  });

  describe('ProgrammingLanguage', () => {
    it('debe aceptar lenguajes válidos', () => {
      const python: ProgrammingLanguage = 'python';
      const javascript: ProgrammingLanguage = 'javascript';
      const typescript: ProgrammingLanguage = 'typescript';

      expect(python).toBe('python');
      expect(javascript).toBe('javascript');
      expect(typescript).toBe('typescript');
    });
  });

  describe('CreateExerciseDTO', () => {
    it('debe crear un DTO válido', () => {
      const dto: CreateExerciseDTO = {
        title: 'Suma de números',
        description: 'Escribe una función que sume dos números',
        language: 'python',
        difficulty: 'easy',
        tags: ['matemáticas', 'básico']
      };

      expect(dto.title).toBe('Suma de números');
      expect(dto.language).toBe('python');
      expect(dto.difficulty).toBe('easy');
      expect(dto.tags).toHaveLength(2);
    });

    it('debe permitir campos opcionales', () => {
      const dto: CreateExerciseDTO = {
        title: 'Test',
        description: 'Descripción de prueba',
        language: 'javascript',
        difficulty: 'medium'
        // tags y testCases son opcionales
      };

      expect(dto.tags).toBeUndefined();
      expect(dto.testCases).toBeUndefined();
    });
  });

  describe('TestCase', () => {
    it('debe crear un caso de prueba con strings', () => {
      const testCase: TestCase = {
        input: '2, 3',
        expectedOutput: '5',
        description: 'Suma de 2 y 3'
      };

      expect(testCase.input).toBe('2, 3');
      expect(testCase.expectedOutput).toBe('5');
    });

    it('debe crear un caso de prueba con objetos', () => {
      const testCase: TestCase = {
        input: { a: 2, b: 3 },
        expectedOutput: { result: 5 }
      };

      expect(testCase.input).toEqual({ a: 2, b: 3 });
      expect(testCase.expectedOutput).toEqual({ result: 5 });
    });
  });

  describe('ApiResponse', () => {
    it('debe crear una respuesta exitosa', () => {
      const response: ApiResponse<string> = {
        success: true,
        data: 'Operación exitosa',
        message: 'Todo bien'
      };

      expect(response.success).toBe(true);
      expect(response.data).toBe('Operación exitosa');
      expect(response.error).toBeUndefined();
    });

    it('debe crear una respuesta de error', () => {
      const response: ApiResponse = {
        success: false,
        error: 'Algo salió mal'
      };

      expect(response.success).toBe(false);
      expect(response.error).toBe('Algo salió mal');
      expect(response.data).toBeUndefined();
    });
  });

  describe('PaginatedResponse', () => {
    it('debe crear una respuesta paginada', () => {
      const response: PaginatedResponse<string> = {
        success: true,
        data: ['item1', 'item2', 'item3'],
        pagination: {
          page: 1,
          limit: 10,
          total: 50,
          totalPages: 5
        }
      };

      expect(response.data).toHaveLength(3);
      expect(response.pagination.page).toBe(1);
      expect(response.pagination.totalPages).toBe(5);
    });
  });
});