import mongoose, { Schema, Model } from 'mongoose';
import type { IExercise, DifficultyLevel, ProgrammingLanguage } from '../types';

/**
 * Schema de Mongoose para TestCase
 */
const testCaseSchema = new Schema({
  input: { 
    type: Schema.Types.Mixed, 
    required: true 
  },
  expectedOutput: { 
    type: Schema.Types.Mixed, 
    required: true 
  },
  description: { 
    type: String 
  }
}, { 
  _id: false
});

/**
 * Schema de Mongoose para Exercise
 */
const exerciseSchema = new Schema<IExercise>({
  title: {
    type: String,
    required: [true, 'El título es obligatorio'],
    trim: true,
    minlength: [3, 'El título debe tener al menos 3 caracteres'],
    maxlength: [200, 'El título no puede exceder 200 caracteres']
  },
  description: {
    type: String,
    required: [true, 'La descripción es obligatoria'],
    trim: true,
    minlength: [10, 'La descripción debe tener al menos 10 caracteres'],
    maxlength: [5000, 'La descripción no puede exceder 5000 caracteres']
  },
  // CAMBIADO: de "language" a "language" pero sin índice de texto en este campo
  language: {
    type: String,
    required: [true, 'El lenguaje es obligatorio'],
    lowercase: true,
    trim: true,
    enum: {
      values: [
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
      ] as ProgrammingLanguage[],
      message: 'Lenguaje no soportado: {VALUE}'
    }
  },
  difficulty: {
    type: String,
    required: [true, 'La dificultad es obligatoria'],
    lowercase: true,
    enum: {
      values: ['easy', 'medium', 'hard'] as DifficultyLevel[],
      message: 'Dificultad inválida: {VALUE}. Debe ser easy, medium o hard'
    }
  },
  tags: [{
    type: String,
    lowercase: true,
    trim: true
  }],
  testCases: [testCaseSchema],
  solution: {
    type: String,
    trim: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  versionKey: false
});

/**
 * Índices para búsqueda eficiente
 */

// Por ahora SIN índice de texto para evitar conflictos
// Lo añadiremos después cuando MongoDB esté limpio

// Índice compuesto para filtrado avanzado

// Índice compuesto para filtrado común
exerciseSchema.index({ 
  difficulty: 1, 
  language: 1 
});

// Índice para tags
exerciseSchema.index({ 
  tags: 1 
});

// Índice para ordenar por fecha
exerciseSchema.index({ 
  createdAt: -1 
});

/**
 * Middleware pre-save
 */
exerciseSchema.pre('save', function(next) {
  if (this.tags && this.tags.length > 0) {
    this.tags = this.tags.map(tag => tag.toLowerCase().trim());
    this.tags = [...new Set(this.tags)];
  }
  next();
});

/**
 * Método toJSON
 */
exerciseSchema.methods.toJSON = function() {
  const obj = this.toObject();
  obj._id = obj._id.toString();
  if (obj.userId) {
    obj.userId = obj.userId.toString();
  }
  return obj;
};

/**
 * Método estático para buscar con filtros
 */
exerciseSchema.statics.findWithFilters = async function(filters: {
  difficulty?: DifficultyLevel;
  language?: ProgrammingLanguage;
  tags?: string[];
  search?: string;
  page?: number;
  limit?: number;
}) {
  const query: any = {};

  if (filters.difficulty) {
    query.difficulty = filters.difficulty;
  }

  if (filters.language) {
    query.language = filters.language;
  }

  if (filters.tags && filters.tags.length > 0) {
    query.tags = { $in: filters.tags };
  }

  if (filters.search) {
    query.$text = { $search: filters.search };
  }

  const page = filters.page || 1;
  const limit = filters.limit || 10;
  const skip = (page - 1) * limit;

  const [exercises, total] = await Promise.all([
    this.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    this.countDocuments(query)
  ]);

  return {
    exercises,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};

/**
 * Modelo de Exercise
 */
export const Exercise: Model<IExercise> = mongoose.model<IExercise>('Exercise', exerciseSchema);