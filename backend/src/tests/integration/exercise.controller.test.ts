// Configurar para tests
process.env.NODE_ENV = 'test';
process.env.MONGODB_URI = 'mongodb://localhost:27018/agentlogic-test';
process.env.JWT_SECRET = 'test-secret-key-12345';

import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import express, { Express } from 'express';
import { connectDatabase, disconnectDatabase, clearDatabase } from '../../config/database';
import exerciseRoutes from '../../routes/exercises';
import { errorHandler } from '../../middleware/errorHandler';

describe('Exercise Controller (Integration)', () => {

  let app: Express;
  let authToken: string;

  beforeAll(async () => {
    await connectDatabase();


    // Crear app de Express para testing
    app = express();
    app.use(express.json());
    app.use('/api/exercises', exerciseRoutes);
    
    // Necesitamos authRoutes para el login en tests
    const authRoutes = (await import('../../routes/auth')).default;
    app.use('/api/auth', authRoutes);
    
    app.use(errorHandler);
  });




  beforeEach(async () => {
    await clearDatabase();

    // Registrar un usuario para obtener el token en cada test
    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'exercisetester',
        email: 'tester@example.com',
        password: 'Test1234!',
        name: 'Exercise Tester'
      });
    
    authToken = registerResponse.body.data.token;
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
        category: 'logic-math',
        tags: ['matemáticas', 'básico']
      };


      const response = await request(app)
        .post('/api/exercises')
        .set('Authorization', `Bearer ${authToken}`)
        .send(exerciseData)
        .expect(201);


      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('_id');
      expect(response.body.data.title).toBe('Suma de números');
      expect(response.body.message).toBeDefined();
    });

    it('debe rechazar ejercicio sin título', async () => {
      const exerciseData = {
        description: 'Escribe una función que sume dos números enteros',
        language: 'python',
        difficulty: 'easy',
        category: 'logic-math',
        tags: ['matemáticas', 'básico']
      };

      const response = await request(app)
        .post('/api/exercises')
        .set('Authorization', `Bearer ${authToken}`)
        .send(exerciseData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('título');
    });

    it('debe rechazar ejercicio sin categoría', async () => {
      const exerciseData = {
        title: 'Suma de números',
        description: 'Escribe una función que sume dos números enteros',
        language: 'python',
        difficulty: 'easy',
        tags: ['matemáticas', 'básico']
      };

      const response = await request(app)
        .post('/api/exercises')
        .set('Authorization', `Bearer ${authToken}`)
        .send(exerciseData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('categoría');
    });

    it('debe rechazar título con HTML malicioso', async () => {
      const exerciseData = {
        title: '<script>alert("xss")</script>',
        description: 'Descripción válida con suficientes caracteres',
        language: 'python',
        category: 'logic-math',
        tags: ['test'],
        difficulty: 'easy'
      };

      const response = await request(app)
        .post('/api/exercises')
        .set('Authorization', `Bearer ${authToken}`)
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
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Ejercicio 1',
          description: 'Descripción del ejercicio 1',
          language: 'python',
          difficulty: 'easy',
          category: 'logic-math',
          tags: ['test']
        });



      await request(app)
        .post('/api/exercises')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Ejercicio 2',
          description: 'Descripción del ejercicio 2',
          language: 'javascript',
          difficulty: 'medium',
          category: 'logic-math',
          tags: ['test']
        });


    });

    it('debe listar todos los ejercicios', async () => {
      const response = await request(app)
        .get('/api/exercises').set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBe(2);
      expect(response.body.pagination).toBeDefined();
    });

    it('debe obtener la lista de ejercicios con búsqueda por texto', async () => {
      const response = await request(app)
        .get('/api/exercises?search=Suma')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('debe filtrar por dificultad', async () => {
      const response = await request(app)
        .get('/api/exercises?difficulty=easy').set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].difficulty).toBe('easy');
    });

    it('debe paginar resultados', async () => {
      const response = await request(app)
        .get('/api/exercises?page=1&limit=1').set('Authorization', `Bearer ${authToken}`)
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
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test Exercise',
          description: 'Descripción de prueba para obtener por ID',
          language: 'python',
          difficulty: 'easy',
          category: 'logic-math',
          tags: ['test']
        });



      const id = createResponse.body.data._id;

      // Obtener ejercicio
      const response = await request(app)
        .get(`/api/exercises/${id}`).set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data._id).toBe(id);
      expect(response.body.data.title).toBe('Test Exercise');
    });

    it('debe devolver 404 si el ejercicio no existe', async () => {
      const fakeId = '507f1f77bcf86cd799439011';

      const response = await request(app)
        .get(`/api/exercises/${fakeId}`).set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('no encontrado');
    });

    it('debe rechazar ID inválido', async () => {
      const response = await request(app)
        .get('/api/exercises/invalid-id').set('Authorization', `Bearer ${authToken}`)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PATCH /api/exercises/:id', () => {
    it('debe actualizar un ejercicio', async () => {
      // Crear ejercicio
      const createResponse = await request(app)
        .post('/api/exercises')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Original Title',
          description: 'Descripción original que tiene suficientes caracteres',
          language: 'python',
          difficulty: 'easy',
          category: 'logic-math',
          tags: ['test']
        });



      const id = createResponse.body.data._id;

      // Actualizar
      const response = await request(app)
        .patch(`/api/exercises/${id}`).set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Updated Title' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe('Updated Title');
      expect(response.body.data.description).toBe('Descripción original que tiene suficientes caracteres');
    });

    it('debe rechazar actualización con datos inválidos', async () => {
      const createResponse = await request(app)
        .post('/api/exercises')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test',
          description: 'Descripción de prueba con suficientes caracteres',
          language: 'python',
          difficulty: 'easy',
          category: 'logic-math',
          tags: ['test']
        });



      const id = createResponse.body.data._id;

      const response = await request(app)
        .patch(`/api/exercises/${id}`).set('Authorization', `Bearer ${authToken}`)
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
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'To Delete',
          description: 'Este ejercicio será eliminado en la prueba',
          language: 'python',
          difficulty: 'easy',
          category: 'logic-math',
          tags: ['test']
        });



      const id = createResponse.body.data._id;

      // Eliminar
      const response = await request(app)
        .delete(`/api/exercises/${id}`).set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('eliminado');

      // Verificar que ya no existe
      await request(app)
        .get(`/api/exercises/${id}`).set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });
});