import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import express, { Express } from 'express';
import { connectDatabase, disconnectDatabase, clearDatabase } from '../../config/database';
import exerciseRoutes from '../../routes/exercises';
import { errorHandler } from '../../middleware/errorHandler';

describe('Exercise Controller (Integration)', () => {
  let app: Express;

  beforeAll(async () => {
    // Configurar para tests
    process.env.NODE_ENV = 'test';
    process.env.MONGODB_URI = 'mongodb://localhost:27018/agentlogic-test';
    
    await connectDatabase();

    // Crear app de Express para testing
    app = express();
    app.use(express.json());
    app.use('/api/exercises', exerciseRoutes);
    app.use(errorHandler);
  });

  beforeEach(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    await disconnectDatabase();
  });

  describe('POST /api/exercises', () => {
    it('debe crear un ejercicio válido', async () => {
      const exerciseData = {
        title: 'Suma de números',
        description: 'Escribe una función que sume dos números enteros',
        language: 'python',
        difficulty: 'easy',
        tags: ['matemáticas', 'básico']
      };

      const response = await request(app)
        .post('/api/exercises')
        .send(exerciseData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('_id');
      expect(response.body.data.title).toBe('Suma de números');
      expect(response.body.message).toBeDefined();
    });

    it('debe rechazar ejercicio sin título', async () => {
      const exerciseData = {
        description: 'Descripción válida',
        language: 'python',
        difficulty: 'easy'
      };

      const response = await request(app)
        .post('/api/exercises')
        .send(exerciseData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });

    it('debe rechazar título con HTML malicioso', async () => {
      const exerciseData = {
        title: '<script>alert("xss")</script>',
        description: 'Descripción válida con suficientes caracteres',
        language: 'python',
        difficulty: 'easy'
      };

      const response = await request(app)
        .post('/api/exercises')
        .send(exerciseData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('caracteres no permitidos');
    });
  });

  describe('GET /api/exercises', () => {
    beforeEach(async () => {
      // Crear ejercicios de prueba
      await request(app)
        .post('/api/exercises')
        .send({
          title: 'Ejercicio 1',
          description: 'Descripción del ejercicio 1',
          language: 'python',
          difficulty: 'easy'
        });

      await request(app)
        .post('/api/exercises')
        .send({
          title: 'Ejercicio 2',
          description: 'Descripción del ejercicio 2',
          language: 'javascript',
          difficulty: 'medium'
        });
    });

    it('debe listar todos los ejercicios', async () => {
      const response = await request(app)
        .get('/api/exercises')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBe(2);
      expect(response.body.pagination).toBeDefined();
    });

    it('debe filtrar por dificultad', async () => {
      const response = await request(app)
        .get('/api/exercises?difficulty=easy')
        .expect(200);

      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].difficulty).toBe('easy');
    });

    it('debe paginar resultados', async () => {
      const response = await request(app)
        .get('/api/exercises?page=1&limit=1')
        .expect(200);

      expect(response.body.data.length).toBe(1);
      expect(response.body.pagination.page).toBe(1);
      expect(response.body.pagination.limit).toBe(1);
      expect(response.body.pagination.total).toBe(2);
    });
  });

  describe('GET /api/exercises/:id', () => {
    it('debe obtener un ejercicio por ID', async () => {
      // Crear ejercicio
      const createResponse = await request(app)
        .post('/api/exercises')
        .send({
          title: 'Test Exercise',
          description: 'Descripción de prueba para obtener por ID',
          language: 'python',
          difficulty: 'easy'
        });

      const id = createResponse.body.data._id;

      // Obtener ejercicio
      const response = await request(app)
        .get(`/api/exercises/${id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data._id).toBe(id);
      expect(response.body.data.title).toBe('Test Exercise');
    });

    it('debe devolver 404 si el ejercicio no existe', async () => {
      const fakeId = '507f1f77bcf86cd799439011';

      const response = await request(app)
        .get(`/api/exercises/${fakeId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('no encontrado');
    });

    it('debe rechazar ID inválido', async () => {
      const response = await request(app)
        .get('/api/exercises/invalid-id')
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PATCH /api/exercises/:id', () => {
    it('debe actualizar un ejercicio', async () => {
      // Crear ejercicio
      const createResponse = await request(app)
        .post('/api/exercises')
        .send({
          title: 'Original Title',
          description: 'Descripción original que tiene suficientes caracteres',
          language: 'python',
          difficulty: 'easy'
        });

      const id = createResponse.body.data._id;

      // Actualizar
      const response = await request(app)
        .patch(`/api/exercises/${id}`)
        .send({ title: 'Updated Title' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe('Updated Title');
      expect(response.body.data.description).toBe('Descripción original que tiene suficientes caracteres');
    });

    it('debe rechazar actualización con datos inválidos', async () => {
      const createResponse = await request(app)
        .post('/api/exercises')
        .send({
          title: 'Test',
          description: 'Descripción de prueba con suficientes caracteres',
          language: 'python',
          difficulty: 'easy'
        });

      const id = createResponse.body.data._id;

      const response = await request(app)
        .patch(`/api/exercises/${id}`)
        .send({ difficulty: 'impossible' })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/exercises/:id', () => {
    it('debe eliminar un ejercicio', async () => {
      // Crear ejercicio
      const createResponse = await request(app)
        .post('/api/exercises')
        .send({
          title: 'To Delete',
          description: 'Este ejercicio será eliminado en la prueba',
          language: 'python',
          difficulty: 'easy'
        });

      const id = createResponse.body.data._id;

      // Eliminar
      const response = await request(app)
        .delete(`/api/exercises/${id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('eliminado');

      // Verificar que ya no existe
      await request(app)
        .get(`/api/exercises/${id}`)
        .expect(404);
    });
  });
});