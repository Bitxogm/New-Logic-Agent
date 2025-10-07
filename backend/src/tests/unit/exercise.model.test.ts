import { describe, it, expect } from 'vitest';
import { Exercise } from '../../models/Exercise';
import type { CreateExerciseDTO } from '../../types';

describe.skip('Exercise Model', () => {
  describe('Crear ejercicio', () => {
    it('debe crear un ejercicio válido', async () => {
      const exerciseData: CreateExerciseDTO = {
        title: 'Suma de dos números',
        description: 'Escribe una función que sume dos números enteros y devuelva el resultado',
        language: 'python',
        difficulty: 'easy',
        tags: ['matemáticas', 'básico']
      };

      const exercise = await Exercise.create(exerciseData);

      expect(exercise._id).toBeDefined();
      expect(exercise.title).toBe('Suma de dos números');
      expect(exercise.language).toBe('python');
      expect(exercise.difficulty).toBe('easy');
      expect(exercise.tags).toHaveLength(2);
      expect(exercise.createdAt).toBeInstanceOf(Date);
      expect(exercise.updatedAt).toBeInstanceOf(Date);
    });

    it('debe crear ejercicio con testCases', async () => {
      const exerciseData: CreateExerciseDTO = {
        title: 'Suma de números',
        description: 'Función para sumar dos números',
        language: 'javascript',
        difficulty: 'easy',
        testCases: [
          {
            input: '2, 3',
            expectedOutput: '5',
            description: 'Suma de 2 y 3'
          }
        ]
      };

      const exercise = await Exercise.create(exerciseData);

      expect(exercise.testCases).toHaveLength(1);
      expect(exercise.testCases[0].input).toBe('2, 3');
      expect(exercise.testCases[0].expectedOutput).toBe('5');
    });
  });

  describe('Validaciones', () => {
    it('debe fallar si falta el título', async () => {
      const exerciseData = {
        description: 'Descripción válida con más de 10 caracteres',
        language: 'python',
        difficulty: 'easy'
      };

      await expect(Exercise.create(exerciseData)).rejects.toThrow();
    });

    it('debe fallar si el título es muy corto', async () => {
      const exerciseData = {
        title: 'AB',
        description: 'Descripción válida con más de 10 caracteres',
        language: 'python',
        difficulty: 'easy'
      };

      await expect(Exercise.create(exerciseData)).rejects.toThrow();
    });

    it('debe fallar si la descripción es muy corta', async () => {
      const exerciseData = {
        title: 'Título válido',
        description: 'Corta',
        language: 'python',
        difficulty: 'easy'
      };

      await expect(Exercise.create(exerciseData)).rejects.toThrow();
    });

    it('debe fallar con dificultad inválida', async () => {
      const exerciseData = {
        title: 'Título válido',
        description: 'Descripción válida con más de 10 caracteres',
        language: 'python',
        difficulty: 'extreme'
      };

      await expect(Exercise.create(exerciseData)).rejects.toThrow();
    });
  });

  describe('Búsqueda y filtrado', () => {
    it('debe encontrar ejercicios por dificultad', async () => {
      await Exercise.create({
        title: 'Suma fácil',
        description: 'Ejercicio fácil de suma con números enteros',
        language: 'python',
        difficulty: 'easy',
        tags: ['matemáticas']
      });

      const easyExercises = await Exercise.find({ difficulty: 'easy' });
      expect(easyExercises.length).toBeGreaterThanOrEqual(1);
    });

    it('debe encontrar ejercicios por lenguaje', async () => {
      await Exercise.create({
        title: 'Algoritmo Python',
        description: 'Ejercicio en Python con suficiente descripción',
        language: 'python',
        difficulty: 'medium',
        tags: ['algoritmos']
      });

      const pythonExercises = await Exercise.find({ language: 'python' });
      expect(pythonExercises.length).toBeGreaterThanOrEqual(1);
    });

    it('debe encontrar ejercicios por tags', async () => {
      await Exercise.create({
        title: 'Matemáticas básicas',
        description: 'Ejercicio básico de matemáticas con descripción completa',
        language: 'python',
        difficulty: 'easy',
        tags: ['matemáticas']
      });

      const mathExercises = await Exercise.find({ tags: 'matemáticas' });
      expect(mathExercises.length).toBeGreaterThanOrEqual(1);
    });

    it('debe ordenar por fecha de creación', async () => {
      const exercises = await Exercise.find().sort({ createdAt: -1 });
      expect(exercises).toBeInstanceOf(Array);
    });
  });

  describe('Actualización', () => {
    it('debe actualizar un ejercicio', async () => {
      const exercise = await Exercise.create({
        title: 'Título original',
        description: 'Descripción original con suficientes caracteres',
        language: 'python',
        difficulty: 'easy'
      });

      exercise.title = 'Título actualizado';
      await exercise.save();

      const updated = await Exercise.findById(exercise._id);
      expect(updated?.title).toBe('Título actualizado');
    });
  });

  describe('Eliminación', () => {
    it('debe eliminar un ejercicio', async () => {
      const exercise = await Exercise.create({
        title: 'Para eliminar',
        description: 'Este ejercicio será eliminado de la base de datos',
        language: 'python',
        difficulty: 'easy'
      });

      await Exercise.findByIdAndDelete(exercise._id);

      const deleted = await Exercise.findById(exercise._id);
      expect(deleted).toBeNull();
    });
  });
});