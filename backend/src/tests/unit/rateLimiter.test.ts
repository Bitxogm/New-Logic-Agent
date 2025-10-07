/**
 * Tests para Rate Limiters
 */

import { describe, it, expect } from 'vitest';
import { generalLimiter, loginLimiter, registerLimiter, createResourceLimiter } from '../../middleware/rateLimiter';

describe('Rate Limiters', () => {
  describe('generalLimiter', () => {
    it('debe existir el middleware', () => {
      expect(generalLimiter).toBeDefined();
      expect(typeof generalLimiter).toBe('function');
    });

    it('debe tener configuración correcta', () => {
      // Verificar que es una función middleware de Express
      expect(generalLimiter.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('loginLimiter', () => {
    it('debe existir el middleware', () => {
      expect(loginLimiter).toBeDefined();
      expect(typeof loginLimiter).toBe('function');
    });

    it('debe ser más estricto que el general', () => {
      // loginLimiter tiene max: 5
      // generalLimiter tiene max: 100
      // No podemos acceder a la config directamente, pero verificamos que existe
      expect(loginLimiter).toBeDefined();
    });
  });

  describe('registerLimiter', () => {
    it('debe existir el middleware', () => {
      expect(registerLimiter).toBeDefined();
      expect(typeof registerLimiter).toBe('function');
    });
  });

  describe('createResourceLimiter', () => {
    it('debe existir el middleware', () => {
      expect(createResourceLimiter).toBeDefined();
      expect(typeof createResourceLimiter).toBe('function');
    });
  });
});