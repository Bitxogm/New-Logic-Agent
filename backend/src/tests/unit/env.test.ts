/**
 * Tests para validación de ENV
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { getEnvConfig } from '../../config/env.config';

describe('Environment Config', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    // Resetear env para cada test
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('getEnvConfig', () => {
    it('debe retornar configuración con valores', () => {
      const config = getEnvConfig();
      
      expect(config).toBeDefined();
      expect(config.NODE_ENV).toBeDefined();
      expect(config.PORT).toBeDefined();
    });

    it('debe usar valores por defecto si no existen', () => {
      delete process.env.NODE_ENV;
      delete process.env.PORT;
      
      const config = getEnvConfig();
      
      expect(config.NODE_ENV).toBe('development');
      expect(config.PORT).toBe('5000');
    });
  });
});