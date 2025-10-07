interface ValidationResult {
  isValid: boolean;
  error?: string;
  sanitized?: string;
}

/**
 * Validador de usuarios con security by default
 */
export class UserValidator {
  private static readonly DANGEROUS_PATTERNS = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /<iframe/i,
    /<object/i
  ];

  /**
   * Valida username
   * - Mínimo 3 caracteres, máximo 30
   * - Solo letras, números, guiones bajos y guiones
   * - Sin caracteres peligrosos
   * 
   * @param username - Username a validar
   * @returns Resultado de validación
   */
  static validateUsername(username: string): ValidationResult {
    if (!username || username.trim().length === 0) {
      return { isValid: false, error: 'El username no puede estar vacío' };
    }

    const trimmed = username.trim();

    if (trimmed.length < 3) {
      return { isValid: false, error: 'El username debe tener al menos 3 caracteres' };
    }

    if (trimmed.length > 30) {
      return { isValid: false, error: 'El username no puede exceder 30 caracteres' };
    }

    // Validar patrones peligrosos
    for (const pattern of this.DANGEROUS_PATTERNS) {
      if (pattern.test(trimmed)) {
        return { isValid: false, error: 'El username contiene caracteres no permitidos' };
      }
    }

    // Solo alfanuméricos, guiones bajos y guiones
    if (!/^[a-zA-Z0-9_-]+$/.test(trimmed)) {
      return { isValid: false, error: 'El username solo puede contener letras, números, guiones y guiones bajos' };
    }

    return { isValid: true, sanitized: trimmed };
  }

  /**
   * Valida email
   * 
   * @param email - Email a validar
   * @returns Resultado de validación
   */
  static validateEmail(email: string): ValidationResult {
    if (!email || email.trim().length === 0) {
      return { isValid: false, error: 'El email no puede estar vacío' };
    }

    const trimmed = email.trim().toLowerCase();

    // Regex básico pero efectivo para emails
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(trimmed)) {
      return { isValid: false, error: 'Email inválido' };
    }

    if (trimmed.length > 255) {
      return { isValid: false, error: 'El email es demasiado largo' };
    }

    return { isValid: true, sanitized: trimmed };
  }

  /**
   * Valida password según política de seguridad:
   * - Mínimo 8 caracteres
   * - Al menos 1 mayúscula
   * - Al menos 1 minúscula
   * - Al menos 1 número
   * - Al menos 1 carácter especial
   * 
   * @param password - Password a validar
   * @returns Resultado de validación
   */
  static validatePassword(password: string): ValidationResult {
    if (!password || password.length === 0) {
      return { isValid: false, error: 'El password no puede estar vacío' };
    }

    if (password.length < 8) {
      return { isValid: false, error: 'El password debe tener al menos 8 caracteres' };
    }

    if (password.length > 128) {
      return { isValid: false, error: 'El password es demasiado largo' };
    }

    if (!/[A-Z]/.test(password)) {
      return { isValid: false, error: 'El password debe contener al menos una mayúscula' };
    }

    if (!/[a-z]/.test(password)) {
      return { isValid: false, error: 'El password debe contener al menos una minúscula' };
    }

    if (!/[0-9]/.test(password)) {
      return { isValid: false, error: 'El password debe contener al menos un número' };
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return { isValid: false, error: 'El password debe contener al menos un carácter especial (!@#$%^&*...)' };
    }

    return { isValid: true };
  }
}