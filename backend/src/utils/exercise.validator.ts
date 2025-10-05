/**
 * Resultado de una validación
 */
interface ValidationResult {
  isValid: boolean;
  error?: string;
  sanitized?: string;
}

/**
 * Validador de ejercicios con seguridad integrada
 */
export class ExerciseValidator {
  /**
   * Patrones peligrosos que no se permiten
   */
  private static readonly DANGEROUS_PATTERNS = [
    /<script/i,           // Tags de script
    /javascript:/i,       // JavaScript en URLs
    /on\w+\s*=/i,        // Event handlers (onclick, onerror, etc)
    /<iframe/i,          // iframes
    /<object/i,          // Objects
    /<embed/i            // Embeds
  ];

  /**
   * Valida el título de un ejercicio
   * 
   * @param title - Título a validar
   * @returns Resultado de la validación con valor sanitizado
   * 
   * @example
   * const result = ExerciseValidator.validateTitle('Suma de números');
   * if (result.isValid) {
   *   console.log(result.sanitized); // "Suma de números"
   * }
   */
  static validateTitle(title: string): ValidationResult {
    // Validar que no esté vacío
    if (!title || title.trim().length === 0) {
      return {
        isValid: false,
        error: 'El título no puede estar vacío'
      };
    }

    const trimmed = title.trim();

    // Validar longitud mínima
    if (trimmed.length < 3) {
      return {
        isValid: false,
        error: 'El título debe tener al menos 3 caracteres'
      };
    }

    // Validar longitud máxima
    if (trimmed.length > 200) {
      return {
        isValid: false,
        error: 'El título no puede exceder 200 caracteres'
      };
    }

    // Validar patrones peligrosos (seguridad)
    for (const pattern of this.DANGEROUS_PATTERNS) {
      if (pattern.test(trimmed)) {
        return {
          isValid: false,
          error: 'El título contiene caracteres no permitidos'
        };
      }
    }

    // Todo OK
    return {
      isValid: true,
      sanitized: trimmed
    };
  }

  /**
   * Valida la dificultad de un ejercicio
   * 
   * @param difficulty - Dificultad a validar
   * @returns Resultado de la validación
   * 
   * @example
   * const result = ExerciseValidator.validateDifficulty('easy');
   * if (result.isValid) {
   *   console.log('Dificultad válida');
   * }
   */
  static validateDifficulty(difficulty: string): ValidationResult {
    const validDifficulties = ['easy', 'medium', 'hard'];
    const normalized = difficulty.toLowerCase().trim();

    if (!validDifficulties.includes(normalized)) {
      return {
        isValid: false,
        error: 'La dificultad debe ser: easy, medium o hard'
      };
    }

    return {
      isValid: true,
      sanitized: normalized
    };
  }

  /**
   * Valida la descripción de un ejercicio
   * 
   * @param description - Descripción a validar
   * @returns Resultado de la validación
   */
  static validateDescription(description: string): ValidationResult {
    if (!description || description.trim().length === 0) {
      return {
        isValid: false,
        error: 'La descripción no puede estar vacía'
      };
    }

    const trimmed = description.trim();

    if (trimmed.length < 10) {
      return {
        isValid: false,
        error: 'La descripción debe tener al menos 10 caracteres'
      };
    }

    if (trimmed.length > 5000) {
      return {
        isValid: false,
        error: 'La descripción no puede exceder 5000 caracteres'
      };
    }

    // Validar patrones peligrosos
    for (const pattern of this.DANGEROUS_PATTERNS) {
      if (pattern.test(trimmed)) {
        return {
          isValid: false,
          error: 'La descripción contiene caracteres no permitidos'
        };
      }
    }

    return {
      isValid: true,
      sanitized: trimmed
    };
  }

  /**
   * Valida el lenguaje de programación
   * 
   * @param language - Lenguaje a validar
   * @returns Resultado de la validación
   */
  static validateLanguage(language: string): ValidationResult {
    const validLanguages = [
      'python',
      'javascript',
      'typescript',
      'java',
      'cpp',
      'c',
      'csharp',
      'go',
      'rust',
      'php',
      'ruby'
    ];

    const normalized = language.toLowerCase().trim();

    if (!validLanguages.includes(normalized)) {
      return {
        isValid: false,
        error: `Lenguaje no soportado. Lenguajes válidos: ${validLanguages.join(', ')}`
      };
    }

    return {
      isValid: true,
      sanitized: normalized
    };
  }
}