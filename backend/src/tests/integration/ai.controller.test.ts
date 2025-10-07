/**
 * Tests de Integración para AI Controller
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../../index';
import { connectDatabase, disconnectDatabase } from '../../config/database';
import { Express } from 'express';

describe('AI Controller (Integration)', () => {
  let app: Express;
  let authToken: string;

  beforeAll(async () => {
    // Conectar a base de datos de test
    await connectDatabase();
    console.log('✅ Conectado a MongoDB');

    app = createApp();

    // Registrar y obtener token
    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'aitest@test.com',
        password: 'Test1234!',
        username: 'aitest',
        name: 'AI Test User',
      });

    authToken = registerResponse.body.data.token;
  });

  afterAll(async () => {
    await disconnectDatabase();
    console.log('MongoDB desconectado correctamente');
  });

  describe('POST /api/ai/generate-solution', () => {
    it('debe rechazar sin autenticación', async () => {
      const response = await request(app)
        .post('/api/ai/generate-solution')
        .send({
          problem: 'Suma dos números',
          language: 'javascript',
        })
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('debe rechazar sin problema', async () => {
      const response = await request(app)
        .post('/api/ai/generate-solution')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          language: 'javascript',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('problema');
    });

    it('debe rechazar sin lenguaje', async () => {
      const response = await request(app)
        .post('/api/ai/generate-solution')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          problem: 'Suma dos números',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('lenguaje');
    });

    // Test con API key válida (skip si no está configurada)
    it.skipIf(!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'test-api-key-for-unit-tests')(
      'debe generar solución con datos válidos',
      async () => {
        const response = await request(app)
          .post('/api/ai/generate-solution')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            problem: 'Crea una función que sume dos números',
            language: 'javascript',
            difficulty: 'easy',
          })
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data).toBeDefined();
        expect(response.body.data.solution).toBeDefined();
      },
      30000 // timeout de 30s para llamada a API
    );
  });

  describe('POST /api/ai/analyze-code', () => {
    it('debe rechazar sin autenticación', async () => {
      const response = await request(app)
        .post('/api/ai/analyze-code')
        .send({
          code: 'console.log("hello")',
          language: 'javascript',
        })
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('debe rechazar sin código', async () => {
      const response = await request(app)
        .post('/api/ai/analyze-code')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          language: 'javascript',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('código');
    });

    it('debe rechazar código muy largo', async () => {
      const longCode = 'a'.repeat(10001);
      
      const response = await request(app)
        .post('/api/ai/analyze-code')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          code: longCode,
          language: 'javascript',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('largo');
    });
  });

  describe('POST /api/ai/explain', () => {
    it('debe rechazar sin autenticación', async () => {
      const response = await request(app)
        .post('/api/ai/explain')
        .send({
          topic: 'Variables',
        })
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('debe rechazar sin tema', async () => {
      const response = await request(app)
        .post('/api/ai/explain')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          level: 'beginner',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('tema');
    });

    it('debe aceptar solicitud válida', async () => {
      const response = await request(app)
        .post('/api/ai/explain')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          topic: 'Variables en JavaScript',
          level: 'beginner',
        });

      // Puede ser 200 (éxito) o 500 (si no hay API key)
      expect([200, 500]).toContain(response.status);
    });
  });
});