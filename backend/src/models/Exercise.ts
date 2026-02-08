import mongoose, { Schema, Model } from 'mongoose';
import type { IExercise, DifficultyLevel, ProgrammingLanguage, ExerciseCategory } from '../types';

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
  category: {
    type: String,
    required: [true, 'La categoría es obligatoria'],
    lowercase: true,
    enum: {
      values: ['arrays', 'strings', 'loops', 'data-structures', 'algorithms', 'logic-math'] as ExerciseCategory[],
      message: 'Categoría inválida: {VALUE}'
    }
  },
  keywords: {
    type: [String],
    default: []
  },
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
// Índice compuesto para filtrado común
exerciseSchema.index({ 
  difficulty: 1, 
  language: 1 
});

// Índice para tags
exerciseSchema.index({ 
  tags: 1 
});

// Índice para categoría
exerciseSchema.index({ 
  category: 1 
});

// Índice para ordenar por fecha
exerciseSchema.index({ 
  createdAt: -1 
});

/**
 * Middleware pre-save
 */
exerciseSchema.pre('save', function(next) {
  // Normalizar tags
  if (this.tags && this.tags.length > 0) {
    this.tags = this.tags.map(tag => tag.toLowerCase().trim());
    this.tags = [...new Set(this.tags)];
  }
  
  // Normalizar keywords
  if (this.keywords && this.keywords.length > 0) {
    this.keywords = this.keywords.map(keyword => keyword.toLowerCase().trim());
    this.keywords = [...new Set(this.keywords)];
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
  category?: ExerciseCategory;
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

  if (filters.category) {
    query.category = filters.category;
  }

  if (filters.tags && filters.tags.length > 0) {
    query.tags = { $in: filters.tags };
  }

  if (filters.search) {
    // Búsqueda en título, descripción y keywords
    query.$or = [
      { title: { $regex: filters.search, $options: 'i' } },
      { description: { $regex: filters.search, $options: 'i' } },
      { keywords: { $in: [new RegExp(filters.search, 'i')] } }
    ];
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

// Singleton para evitar recompilación en tsx
let cachedModel: Model<IExercise> | null = null;

export const getExerciseModel = (): Model<IExercise> => {
  if (cachedModel) return cachedModel;
  
  if (mongoose.models.Exercise) {
    cachedModel = mongoose.models.Exercise as Model<IExercise>;
    return cachedModel;
  }
  
  cachedModel = mongoose.model<IExercise>('Exercise', exerciseSchema);
  return cachedModel;
};

// Export por defecto y named para compatibilidad
export const Exercise = getExerciseModel();
export default Exercise;