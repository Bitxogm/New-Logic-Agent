import { describe, it, expect } from 'vitest';
import { ExerciseValidator } from '../../utils/exercise.validator';

describe('ExerciseValidator', () => {
  describe('validateTitle', () => {
    it('debe aceptar un título válido', () => {
      const result = ExerciseValidator.validateTitle('Suma de dos números');
      
      expect(result.isValid).toBe(true);
      expect(result.sanitized).toBe('Suma de dos números');
    });

    it('debe rechazar título vacío', () => {
      const result = ExerciseValidator.validateTitle('');
      
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('vacío');
    });

    it('debe rechazar título muy corto', () => {
      const result = ExerciseValidator.validateTitle('AB');
      
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('al menos 3 caracteres');
    });

    it('debe trimear espacios en blanco', () => {
      const result = ExerciseValidator.validateTitle('  Hola Mundo  ');
      
      expect(result.isValid).toBe(true);
      expect(result.sanitized).toBe('Hola Mundo');
    });

    it('debe rechazar HTML malicioso', () => {
      const result = ExerciseValidator.validateTitle('<script>alert("xss")</script>');
      
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('caracteres no permitidos');
    });
  });

  describe('validateDifficulty', () => {
    it('debe aceptar easy, medium, hard', () => {
      expect(ExerciseValidator.validateDifficulty('easy').isValid).toBe(true);
      expect(ExerciseValidator.validateDifficulty('medium').isValid).toBe(true);
      expect(ExerciseValidator.validateDifficulty('hard').isValid).toBe(true);
    });

    it('debe rechazar valores inválidos', () => {
      const result = ExerciseValidator.validateDifficulty('extreme');
      
      expect(result.isValid).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('debe ser case-insensitive', () => {
      expect(ExerciseValidator.validateDifficulty('EASY').isValid).toBe(true);
      expect(ExerciseValidator.validateDifficulty('Medium').isValid).toBe(true);
    });
  });
});