import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { connectDatabase, disconnectDatabase, clearDatabase } from '../../config/database';
import { Exercise } from '../../models/Exercise';
import type { CreateExerciseDTO } from '../../types';

describe('Exercise Model', () => {
  // Conectar antes de todos los tests
  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    process.env.MONGODB_URI = 'mongodb://localhost:27018/agentlogic-test';
    await connectDatabase();
  });

  // Limpiar después de cada test
  beforeEach(async () => {
    await clearDatabase();
  });

  // Desconectar después de todos los tests
  afterAll(async () => {
    await disconnectDatabase();
  });

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
    beforeEach(async () => {
      // Crear ejercicios de prueba
      await Exercise.create({
        title: 'Suma fácil',
        description: 'Ejercicio fácil de suma con números enteros',
        language: 'python',
        difficulty: 'easy',
        tags: ['matemáticas']
      });

      await Exercise.create({
        title: 'Algoritmo medio',
        description: 'Ejercicio de dificultad media sobre algoritmos',
        language: 'javascript',
        difficulty: 'medium',
        tags: ['algoritmos']
      });

      await Exercise.create({
        title: 'Recursión difícil',
        description: 'Ejercicio difícil que requiere usar recursión',
        language: 'python',
        difficulty: 'hard',
        tags: ['recursión', 'avanzado']
      });
    });

    it('debe encontrar ejercicios por dificultad', async () => {
      const easyExercises = await Exercise.find({ difficulty: 'easy' });
      
      expect(easyExercises).toHaveLength(1);
      expect(easyExercises[0].title).toBe('Suma fácil');
    });

    it('debe encontrar ejercicios por lenguaje', async () => {
      const pythonExercises = await Exercise.find({ language: 'python' });
      
      expect(pythonExercises).toHaveLength(2);
    });

    it('debe encontrar ejercicios por tags', async () => {
      const mathExercises = await Exercise.find({ tags: 'matemáticas' });
      
      expect(mathExercises).toHaveLength(1);
      expect(mathExercises[0].title).toBe('Suma fácil');
    });

    it('debe ordenar por fecha de creación', async () => {
      const exercises = await Exercise.find().sort({ createdAt: -1 });
      
      expect(exercises).toHaveLength(3);
      expect(exercises[0].title).toBe('Recursión difícil');
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
      expect(updated?.updatedAt.getTime()).toBeGreaterThan(updated?.createdAt.getTime() || 0);
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