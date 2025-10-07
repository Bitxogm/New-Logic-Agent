import mongoose, { Schema, Model, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import type { IUser, UserRole } from '../types';

// Crear interface que extiende Document con los métodos personalizados
interface IUserDocument extends Omit<IUser, '_id'>, Document {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

/**
 * Schema de Mongoose para User
 */
const userSchema = new Schema<IUserDocument>({
  username: {
    type: String,
    required: [true, 'El username es obligatorio'],
    unique: true,
    trim: true,
    minlength: [3, 'El username debe tener al menos 3 caracteres'],
    maxlength: [30, 'El username no puede exceder 30 caracteres'],
    match: [/^[a-zA-Z0-9_-]+$/, 'El username solo puede contener letras, números, guiones y guiones bajos']
  },
  email: {
    type: String,
    required: [true, 'El email es obligatorio'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Email inválido']
  },
  password: {
    type: String,
    required: [true, 'El password es obligatorio'],
    minlength: [8, 'El password debe tener al menos 8 caracteres'],
    select: false
  },
  role: {
    type: String,
    enum: {
      values: ['user', 'admin'] as UserRole[],
      message: 'Rol inválido'
    },
    default: 'user'
  }
}, {
  timestamps: true,
  versionKey: false
});

/**
 * Eliminar índices duplicados (el unique: true ya crea los índices)
 */

/**
 * Middleware pre-save: Hashear password antes de guardar
 */
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

/**
 * Método de instancia: Comparar password
 * 
 * @param candidatePassword - Password a comparar
 * @returns true si coincide, false si no
 */
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    return false;
  }
};

/**
 * Método toJSON: No devolver password
 */
userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  obj._id = obj._id.toString();
  return obj;
};

/**
 * Modelo de User
 */
export const User: Model<IUserDocument> = mongoose.model<IUserDocument>('User', userSchema);