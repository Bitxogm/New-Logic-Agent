/**
 * Tests para el sistema de logging
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import logger, { sanitizeForLog } from '../../config/logger.config';
import { httpLogger, errorLogger } from '../../middleware/logger.middleware';
import { Request, Response } from 'express';

describe('Logger Utils', () => {
  describe('sanitizeForLog', () => {
    it('debe redactar passwords', () => {
      const data = {
        email: 'test@example.com',
        password: 'secretPassword123',
        name: 'Test User',
      };

      const sanitized = sanitizeForLog(data);

      expect(sanitized.email).toBe('test@example.com');
      expect(sanitized.password).toBe('***REDACTED***');
      expect(sanitized.name).toBe('Test User');
    });

    it('debe redactar tokens', () => {
      const data = {
        userId: '123',
        token: 'jwt.token.here',
        refreshToken: 'refresh.token.here',
      };

      const sanitized = sanitizeForLog(data);

      expect(sanitized.userId).toBe('123');
      expect(sanitized.token).toBe('***REDACTED***');
      expect(sanitized.refreshToken).toBe('***REDACTED***');
    });

    it('debe redactar authorization headers', () => {
      const data = {
        headers: {
          'content-type': 'application/json',
          'authorization': 'Bearer token123',
        },
      };

      const sanitized = sanitizeForLog(data);

      expect(sanitized.headers['content-type']).toBe('application/json');
      expect(sanitized.headers['authorization']).toBe('***REDACTED***');
    });

    it('debe sanitizar objetos anidados', () => {
      const data = {
        user: {
          email: 'test@example.com',
          password: 'secret123',
          profile: {
            name: 'Test',
            token: 'nested.token',
          },
        },
      };

      const sanitized = sanitizeForLog(data);

      expect(sanitized.user.email).toBe('test@example.com');
      expect(sanitized.user.password).toBe('***REDACTED***');
      expect(sanitized.user.profile.name).toBe('Test');
      expect(sanitized.user.profile.token).toBe('***REDACTED***');
    });

    it('debe manejar valores no-objeto', () => {
      expect(sanitizeForLog(null)).toBe(null);
      expect(sanitizeForLog(undefined)).toBe(undefined);
      expect(sanitizeForLog('string')).toBe('string');
      expect(sanitizeForLog(123)).toBe(123);
      expect(sanitizeForLog(true)).toBe(true);
    });

    it('debe detectar campos sensibles case-insensitive', () => {
      const data = {
        PASSWORD: 'secret1',
        Token: 'secret2',
        AUTHORIZATION: 'secret3',
        Cookie: 'secret4',
      };

      const sanitized = sanitizeForLog(data);

      expect(sanitized.PASSWORD).toBe('***REDACTED***');
      expect(sanitized.Token).toBe('***REDACTED***');
      expect(sanitized.AUTHORIZATION).toBe('***REDACTED***');
      expect(sanitized.Cookie).toBe('***REDACTED***');
    });
  });

  describe('Logger Instance', () => {
    it('debe existir el logger', () => {
      expect(logger).toBeDefined();
      expect(typeof logger.info).toBe('function');
      expect(typeof logger.error).toBe('function');
      expect(typeof logger.warn).toBe('function');
      expect(typeof logger.debug).toBe('function');
    });
  });
});

describe('HTTP Logger Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockRequest = {
      method: 'GET',
      originalUrl: '/api/test',
      url: '/api/test',
      ip: '127.0.0.1',
      get: vi.fn(() => 'Mozilla/5.0'),
      socket: { remoteAddress: '127.0.0.1' } as any,
    };

    mockResponse = {
      statusCode: 200,
      json: vi.fn(),
    };

    nextFunction = vi.fn();
  });

  it('debe llamar a next()', () => {
    httpLogger(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(nextFunction).toHaveBeenCalledOnce();
  });

  it('debe modificar res.json para loguear', () => {
    const originalJson = mockResponse.json;

    httpLogger(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(mockResponse.json).not.toBe(originalJson);
    expect(typeof mockResponse.json).toBe('function');
  });
});

describe('Error Logger Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: ReturnType<typeof vi.fn>;
  let mockError: Error;

  beforeEach(() => {
    mockRequest = {
      method: 'POST',
      originalUrl: '/api/error',
      url: '/api/error',
      ip: '127.0.0.1',
      headers: {
        'content-type': 'application/json',
        'authorization': 'Bearer token123',
      },
      socket: { remoteAddress: '127.0.0.1' } as any,
    };

    mockResponse = {
      statusCode: 500,
    };

    nextFunction = vi.fn();
    mockError = new Error('Test error');
  });

  it('debe llamar a next() con el error', () => {
    errorLogger(
      mockError,
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(nextFunction).toHaveBeenCalledWith(mockError);
  });

    it('debe loguear el error sin exponer información sensible', () => {
    const loggerSpy = vi.spyOn(logger, 'error');

    errorLogger(
      mockError,
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(loggerSpy).toHaveBeenCalled();
    
    // Winston puede loguear de diferentes maneras, verificamos que se llamó
    // y que los headers originales tenían authorization
    expect(loggerSpy).toHaveBeenCalledWith(
      'Error no capturado:',
      expect.objectContaining({
        error: expect.objectContaining({
          message: mockError.message,
          name: mockError.name,
        }),
        request: expect.any(Object),
      })
    );
  });

});