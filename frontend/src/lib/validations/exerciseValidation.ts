// src/lib/validations/exerciseValidation.ts

import { z } from 'zod';

// Test Case schema
export const testCaseSchema = z.object({
  input: z.array(z.any()).min(1, 'Debe tener al menos un input'),
  expectedOutput: z.any(),
  description: z.string().optional(),
});

// Exercise schema
export const createExerciseSchema = z.object({
  title: z
    .string()
    .min(3, 'El título debe tener al menos 3 caracteres')
    .max(100, 'El título no puede exceder 100 caracteres'),
  
  description: z
    .string()
    .min(10, 'La descripción debe tener al menos 10 caracteres')
    .max(2000, 'La descripción no puede exceder 2000 caracteres'),
  
  difficulty: z
    .string()
    .min(1, 'Debes seleccionar una dificultad')
    .refine((val) => ['easy', 'medium', 'hard'].includes(val), {
      message: 'La dificultad debe ser easy, medium o hard',
    }),
  
  language: z
    .string()
    .min(2, 'Debes seleccionar un lenguaje'),
  
  tags: z
    .array(z.string())
    .min(1, 'Debes añadir al menos una etiqueta')
    .max(10, 'No puedes añadir más de 10 etiquetas'),
  
  testCases: z
    .array(testCaseSchema)
    .min(1, 'Debes añadir al menos un caso de prueba')
    .max(20, 'No puedes añadir más de 20 casos de prueba'),
  
  solution: z
    .string()
    .min(1, 'La solución es obligatoria')
    .max(10000, 'La solución no puede exceder 10000 caracteres'),
  
  starterCode: z
    .string()
    .max(10000, 'El código inicial no puede exceder 10000 caracteres')
    .optional()
    .or(z.literal('')),
  
  hints: z
    .array(z.string().min(1))
    .max(10, 'No puedes añadir más de 10 pistas')
    .optional(),
});

export type CreateExerciseFormData = z.infer<typeof createExerciseSchema>;