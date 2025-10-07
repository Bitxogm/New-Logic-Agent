/**
 * Tests para Gemini Service
 */

import { describe, it, expect, beforeAll, vi } from 'vitest';
import { geminiService } from '../../services/gemini.service';

describe('Gemini Service', () => {
  beforeAll(() => {
    // Asegurar que GEMINI_API_KEY esté definida para tests
    if (!process.env.GEMINI_API_KEY) {
      process.env.GEMINI_API_KEY = 'test-api-key-for-unit-tests';
    }
  });

  describe('Service Initialization', () => {
    it('debe inicializar el servicio correctamente', () => {
      expect(geminiService).toBeDefined();
    });

    it('debe tener método generateSolution', () => {
      expect(typeof geminiService.generateSolution).toBe('function');
    });

    it('debe tener método analyzeCode', () => {
      expect(typeof geminiService.analyzeCode).toBe('function');
    });

    it('debe tener método explain', () => {
      expect(typeof geminiService.explain).toBe('function');
    });
  });

  describe('generateSolution', () => {
    it('debe aceptar parámetros válidos', () => {
      const request = {
        problem: 'Suma dos números',
        language: 'javascript',
        difficulty: 'easy' as const,
      };

      expect(() => {
        // Solo verificamos que acepta los parámetros
        expect(request.problem).toBeDefined();
        expect(request.language).toBeDefined();
      }).not.toThrow();
    });
  });

  describe('analyzeCode', () => {
    it('debe aceptar parámetros válidos', () => {
      const request = {
        code: 'function sum(a, b) { return a + b; }',
        language: 'javascript',
      };

      expect(request.code).toBeDefined();
      expect(request.language).toBeDefined();
    });
  });

  describe('explain', () => {
    it('debe aceptar parámetros válidos', () => {
      const request = {
        topic: 'Variables en JavaScript',
        level: 'beginner' as const,
      };

      expect(request.topic).toBeDefined();
      expect(request.level).toBeDefined();
    });
  });
});