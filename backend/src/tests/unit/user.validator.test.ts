import { describe, it, expect } from 'vitest';
import { UserValidator } from '../../utils/user.validator';

describe('UserValidator', () => {
  describe('validateUsername', () => {
    it('debe aceptar username válido', () => {
      const result = UserValidator.validateUsername('john_doe123');
      expect(result.isValid).toBe(true);
    });

    it('debe rechazar username muy corto', () => {
      const result = UserValidator.validateUsername('ab');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('al menos 3 caracteres');
    });

    it('debe rechazar username muy largo', () => {
      const result = UserValidator.validateUsername('a'.repeat(31));
      expect(result.isValid).toBe(false);
    });

    it('debe rechazar caracteres especiales peligrosos', () => {
      const result = UserValidator.validateUsername('user<script>');
      expect(result.isValid).toBe(false);
    });

    it('debe permitir guiones bajos y números', () => {
      const result = UserValidator.validateUsername('user_123');
      expect(result.isValid).toBe(true);
    });
  });

  describe('validateEmail', () => {
    it('debe aceptar email válido', () => {
      const result = UserValidator.validateEmail('test@example.com');
      expect(result.isValid).toBe(true);
    });

    it('debe rechazar email sin @', () => {
      const result = UserValidator.validateEmail('testexample.com');
      expect(result.isValid).toBe(false);
    });

    it('debe rechazar email sin dominio', () => {
      const result = UserValidator.validateEmail('test@');
      expect(result.isValid).toBe(false);
    });

    it('debe normalizar email a lowercase', () => {
      const result = UserValidator.validateEmail('TEST@EXAMPLE.COM');
      expect(result.isValid).toBe(true);
      expect(result.sanitized).toBe('test@example.com');
    });
  });

  describe('validatePassword', () => {
    it('debe aceptar password fuerte', () => {
      const result = UserValidator.validatePassword('Test1234!');
      expect(result.isValid).toBe(true);
    });

    it('debe rechazar password corto', () => {
      const result = UserValidator.validatePassword('Test1!');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('8 caracteres');
    });

    it('debe rechazar password sin mayúscula', () => {
      const result = UserValidator.validatePassword('test1234!');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('mayúscula');
    });

    it('debe rechazar password sin minúscula', () => {
      const result = UserValidator.validatePassword('TEST1234!');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('minúscula');
    });

    it('debe rechazar password sin número', () => {
      const result = UserValidator.validatePassword('Testtest!');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('número');
    });

    it('debe rechazar password sin carácter especial', () => {
      const result = UserValidator.validatePassword('Test1234');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('especial');
    });
  });
});