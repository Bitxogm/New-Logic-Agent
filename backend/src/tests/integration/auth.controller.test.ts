import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import request from 'supertest';
import express, { Express } from 'express';
import mongoose from 'mongoose';
import authRoutes from '../../routes/auth';
import { errorHandler } from '../../middleware/errorHandler';
import { User } from '../../models/User';

describe('Auth Controller (Integration)', () => {
  let app: Express;

  beforeAll(async () => {
    // Conectar a MongoDB
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect('mongodb://localhost:27018/agentlogic-test');
    }

    // Crear app de Express
    app = express();
    app.use(express.json());
    app.use('/api/auth', authRoutes);
    app.use(errorHandler);
  });

  beforeEach(async () => {
    // Limpiar colección de usuarios antes de cada test
    await User.deleteMany({});
  });

  describe('POST /api/auth/register', () => {
    it('debe registrar un usuario válido', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'Test1234!'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.token).toBeDefined();
      expect(response.body.data.user).toBeDefined();
      expect(response.body.data.user.email).toBe('test@example.com');
      expect(response.body.data.user.username).toBe('testuser');
      expect(response.body.data.user.password).toBeUndefined(); // No debe devolver password
    });

    it('debe rechazar registro con email duplicado', async () => {
      const userData = {
        username: 'user1',
        email: 'duplicate@example.com',
        password: 'Test1234!'
      };

      // Crear primer usuario
      await request(app)
        .post('/api/auth/register')
        .send(userData);

      // Intentar crear segundo usuario con mismo email
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'user2',
          email: 'duplicate@example.com',
          password: 'Test1234!'
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('email');
    });

    it('debe rechazar password débil', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'weak'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });

    it('debe rechazar email inválido', async () => {
      const userData = {
        username: 'testuser',
        email: 'invalid-email',
        password: 'Test1234!'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.toLowerCase()).toContain('email');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Crear usuario de prueba
      await request(app)
        .post('/api/auth/register')
        .send({
          username: 'loginuser',
          email: 'login@example.com',
          password: 'Test1234!'
        });
    });

    it('debe hacer login con credenciales válidas', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@example.com',
          password: 'Test1234!'
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.token).toBeDefined();
      expect(response.body.data.user.email).toBe('login@example.com');
      expect(response.body.data.user.password).toBeUndefined();
    });

    it('debe rechazar password incorrecto', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@example.com',
          password: 'WrongPassword123!'
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });

    it('debe rechazar email no registrado', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'notfound@example.com',
          password: 'Test1234!'
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });

    it('debe rechazar login sin email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          password: 'Test1234!'
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/auth/me', () => {
    let authToken: string;

    beforeEach(async () => {
      // Registrar y obtener token
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'meuser',
          email: 'me@example.com',
          password: 'Test1234!'
        });

      authToken = response.body.data.token;
    });

    it('debe obtener datos del usuario autenticado', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.email).toBe('me@example.com');
      expect(response.body.data.username).toBe('meuser');
    });

    it('debe rechazar sin token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('token');
    });

    it('debe rechazar con token inválido', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer token-invalido')
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });
});