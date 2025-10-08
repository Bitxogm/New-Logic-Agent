/**
 * Configuración de Swagger/OpenAPI
 */

import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'AgentLogic API',
      version: '1.0.0',
      description: `
        🤖 API REST para plataforma educativa de programación con IA
        
        ## Características
        - 🔐 Autenticación JWT
        - 📝 Gestión de ejercicios de programación
        - 🤖 Integración con Gemini 2.0 para generación de código
        - 🛡️ Rate limiting y seguridad completa
        - 📊 Logging profesional
        
        ## Autenticación
        La mayoría de endpoints requieren autenticación JWT.
        
        1. Registra un usuario en \`POST /api/auth/register\`
        2. Obtén el token en \`POST /api/auth/login\`
        3. Usa el token en el header: \`Authorization: Bearer <token>\`
      `,
      contact: {
        name: 'AgentLogic Team',
        url: 'https://github.com/Bitxogm/New-Logic-Agent',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Servidor de Desarrollo',
      },
      {
        url: 'https://api-production.com',
        description: 'Servidor de Producción',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Ingresa el token JWT obtenido del login',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            error: {
              type: 'string',
              example: 'Mensaje de error descriptivo',
            },
          },
        },
        Exercise: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '507f1f77bcf86cd799439011',
            },
            title: {
              type: 'string',
              example: 'Suma de dos números',
            },
            description: {
              type: 'string',
              example: 'Crea una función que sume dos números',
            },
            difficulty: {
              type: 'string',
              enum: ['easy', 'medium', 'hard'],
              example: 'easy',
            },
            language: {
              type: 'string',
              example: 'javascript',
            },
            testCases: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  input: {
                    type: 'array',
                    example: [2, 3],
                  },
                  expectedOutput: {
                    example: 5,
                  },
                },
              },
            },
            tags: {
              type: 'array',
              items: {
                type: 'string',
              },
              example: ['básico', 'matemáticas'],
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        User: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '507f1f77bcf86cd799439011',
            },
            username: {
              type: 'string',
              example: 'johndoe',
            },
            email: {
              type: 'string',
              example: 'john@example.com',
            },
            name: {
              type: 'string',
              example: 'John Doe',
            },
            role: {
              type: 'string',
              example: 'user',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
      },
    },
    tags: [
      {
        name: 'Auth',
        description: '🔐 Autenticación y gestión de usuarios',
      },
      {
        name: 'Exercises',
        description: '📝 Gestión de ejercicios de programación',
      },
      {
        name: 'AI',
        description: '🤖 Generación de código con Gemini 2.0',
      },
      {
        name: 'Health',
        description: '🏥 Estado del servidor',
      },
    ],
  },
  apis: [
    './src/routes/*.ts', // Rutas con anotaciones JSDoc
    './src/index.ts', // Para health check
  ],
};

export const swaggerSpec = swaggerJsdoc(options);