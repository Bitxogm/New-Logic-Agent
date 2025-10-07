# 🚀 AgentLogic - Tutor de Lógica con IA

> Plataforma educativa potenciada por IA para aprender programación a través de ejercicios interactivos, diagramas de flujo y generación de código.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.0-brightgreen)](https://www.mongodb.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue)](https://www.docker.com/)
[![Tests](https://img.shields.io/badge/Tests-69%20passing-success)](https://vitest.dev/)

---

## 📋 Tabla de Contenidos

- [✨ Características](#-características)
- [Stack Tecnológico](#️-stack-tecnológico)
- [Metodologías Aplicadas](#-metodologías-aplicadas)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Instalación](#-instalación)
- [Uso](#-uso)
- [Testing](#-testing)
- [Seguridad](#-seguridad)
- [API Endpoints](#-api-endpoints)
- [Contribuir](#-contribuir)
- [Licencia](#-licencia)

---

## ✨ Características

### 🎯 Core Features
- **Gestión de Ejercicios**: CRUD completo de ejercicios de programación
- **Múltiples Lenguajes**: Soporte para Python, JavaScript, TypeScript, Java, C++, y más
- **Dificultad Adaptativa**: Sistema de niveles (easy, medium, hard)
- **Casos de Prueba**: Validación automática de soluciones
- **Búsqueda Avanzada**: Filtrado por lenguaje, dificultad y tags
- **API RESTful**: Endpoints documentados y testeados

### 🔐 Autenticación & Seguridad
- **JWT Authentication**: Tokens de acceso seguros
- **Password Hashing**: Bcrypt con salt rounds
- **Rate Limiting**: Protección contra ataques de fuerza bruta
- **Input Validation**: Sanitización completa de inputs
- **Security Headers**: Helmet para headers HTTP seguros
- **CORS**: Control de acceso cross-origin

### 📊 Logging Profesional
- **Winston Logger**: Sistema de logs estructurado
- **Múltiples Niveles**: error, warn, info, http, debug
- **Sanitización Automática**: Passwords y tokens redactados
- **Archivos Separados**: error.log, combined.log
- **Formato JSON**: Para producción y análisis
- **Logs Colorizados**: Para desarrollo

### 🛡️ Rate Limiting
- **Límite General**: 100 peticiones/15 min por IP
- **Límite Login**: 5 intentos/15 min por IP
- **Límite Registro**: 3 registros/hora por IP
- **Detección de Ataques**: Logging automático de rate limits

### 🧪 Calidad de Código
- **TDD (Test-Driven Development)**: Tests antes del código
- **TypeScript Estricto**: Tipado completo
- **Alta Cobertura**: > 90% de coverage
- **JSDoc**: Documentación inline
- **Linting**: ESLint + Prettier

---

## 🛠️ Stack Tecnológico

### Backend
├── Node.js 18+          # Runtime JavaScript
├── TypeScript 5.0       # Tipado estático
├── Express.js           # Framework web
├── MongoDB 7.0          # Base de datos NoSQL
├── Mongoose             # ODM para MongoDB
├── Winston              # Logger profesional
├── Bcrypt               # Hashing de passwords
├── JWT                  # JSON Web Tokens
├── Express Rate Limit   # Rate limiting
└── Vitest               # Framework de testing

### Frontend (Próximamente)
├── React 18             # Biblioteca UI
├── TypeScript           # Tipado estático
├── Vite                 # Build tool
├── shadcn/ui            # Componentes modernos
├── Tailwind CSS         # Utilidades CSS
└── React Router         # Routing

### DevOps
├── Docker               # Contenedores
├── MongoDB Atlas        # Base de datos cloud
└── GitHub Actions       # CI/CD

---

## 🎓 Metodologías Aplicadas

### 1. TDD (Test-Driven Development)
Escribimos tests **antes** del código siguiendo el ciclo:

🔴 **RED** → Escribir test que falla  
🟢 **GREEN** → Escribir código mínimo para pasar  
🔵 **REFACTOR** → Mejorar el código

**Ejemplo:**
```typescript
// 1. RED: Escribir un test que falla
it('debe validar email', () => {
  expect(validateEmail('test@ejemplo.com').isValid).toBe(true);
  expect(validateEmail('test@ejemplo').isValid).toBe(false);
});

// 2. GREEN: Escribir el código mínimo para que el test pase
function validateEmail(email: string) {
  return { isValid: /\S+@\S+\.\S+/.test(email) };
}
// 3. REFACTOR: Mejorar el código sin cambiar su comportamiento
```

### 2. Security by Design
Pensamos en la seguridad desde el diseño inicial de cada componente.

```typescript
// ✅ Validación de entradas desde el principio
const DANGEROUS_PATTERNS = [/<script/i, /javascript:/i, /on\w+\s*=/i];

function validateSafeInput(input: string) {
  if (DANGEROUS_PATTERNS.some(pattern => pattern.test(input))) {
    return { isValid: false, error: 'La entrada contiene contenido no permitido.' };
    }
  return { isValid: true };
}
```

### 3. Clean Architecture
Separación clara de responsabilidades:

`Types` → `Models` → `Controllers` → `Routes`

---

## 📁 Estructura del Proyecto

```
backend/
├── backend/                 # API Node.js + Express
│   ├── src/
│   │   ├── config/         # Configuraciones
│   │   │   ├── database.ts       # Conexión MongoDB
│   │   │   └── logger.config.ts  # Winston Logger
│   │   │
│   │   ├── types/          # Tipos TypeScript
│   │   │   ├── exercise.types.ts
│   │   │   ├── user.types.ts
│   │   │   └── api.types.ts
│   │   │
│   │   ├── models/         # Modelos Mongoose
│   │   │   ├── Exercise.model.ts
│   │   │   └── User.model.ts
│   │   │
│   │   ├── controllers/    # Lógica de negocio
│   │   │   ├── exerciseController.ts
│   │   │   └── authController.ts
│   │   │
│   │   ├── routes/         # Rutas HTTP
│   │   │   ├── exercises.ts
│   │   │   └── auth.ts
│   │   │
│   │   ├── middleware/     # Middleware Express
│   │   │   ├── auth.ts           # JWT authentication
│   │   │   ├── errorHandler.ts   # Manejo de errores
│   │   │   ├── validateRequest.ts # Validación
│   │   │   ├── logger.middleware.ts # HTTP logging
│   │   │   └── rateLimiter.ts    # Rate limiting
│   │   │
│   │   ├── utils/          # Utilidades
│   │   │   └── validators/ # Validadores
│   │   │
│   │   ├── services/       # Servicios (IA, etc)
│   │   │
│   │   ├── tests/          # Tests
│   │   │   ├── unit/       # Tests unitarios
│   │   │   └── integration/# Tests de integración
│   │   │
│   │   └── index.ts        # Punto de entrada
│   │
│   ├── logs/               # Archivos de log
│   │   ├── error.log       # Solo errores
│   │   └── combined.log    # Todos los logs
│   │
│   ├── .env                # Variables de entorno
│   ├── package.json
│   ├── tsconfig.json
│   └── vitest.config.ts
│
├── frontend/               # App React (próximamente)
│   └── ...
│
├── docs/                   # Documentación
└── README.md
```

---

## 🚀 Instalación

### Requisitos Previos

*   Node.js 18 o superior
*   Docker y Docker Compose (para la base de datos)
*   Git

### 1. Clonar el Repositorio
```bash
git clone https://github.com/tu-usuario/AgentLogic-TS.git
cd AgentLogic-TS
```

### 2. Instalar Dependencias del Backend
```bash
cd backend
npm install
```

### 3. Configurar Variables de Entorno
Copia el archivo de ejemplo y edítalo con tus valores.
```bash
cp .env.example .env
```

```env
# .env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/agentlogic

# JWT
JWT_SECRET=tu_secreto_super_seguro_aqui
JWT_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:5173
```

### 4. Iniciar MongoDB con Docker
```bash
docker-compose up -d
```

### 5. Iniciar Servidor de Desarrollo
```bash
npm run dev
```
El servidor estará disponible en: http://localhost:5000

---

## 💻 Uso

### Health Check
Verifica que la API está funcionando.
```bash
curl http://localhost:5000/health
```
Respuesta esperada:
```json
{
  "success": true,
  "message": "API funcionando correctamente",
  "timestamp": "2025-10-07T06:00:00.000Z"
}
```

### Registrar un Usuario
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "Password123",
    "username": "usuario",
    "name": "Usuario Test"
  }'
```

### Iniciar Sesión (Login)
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "Password123"
  }'
```
Respuesta con el token de autenticación:
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "...",
      "email": "user@example.com",
      "name": "Usuario Test"
    }
  }
}
```

### Crear un Ejercicio (Requiere Autenticación)
```bash
curl -X POST http://localhost:5000/api/exercises \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -d '{
    "title": "Suma de dos números",
    "description": "Escribe una función que sume dos números",
    "difficulty": "easy",
    "language": "javascript",
    "testCases": [
      {
        "input": [2, 3],
        "expectedOutput": 5
      }
    ]
  }'

🧪 Testing
Ejecutar Todos los Tests
bashnpm run test
Tests en Modo Watch
bashnpm run test:watch
Ver Cobertura
bashnpm run test:coverage
Ejecutar Tests Específicos
bash# Tests unitarios de logger
npm run test src/tests/unit/logger.test.ts

# Tests de integración de auth
npm run test src/tests/integration/auth.controller.test.ts

🔒 Seguridad
Rate Limiting
La API implementa rate limiting en múltiples niveles:
EndpointLímiteVentanaDescripciónGeneral100 req15 minTodas las rutasLogin5 req15 minPrevenir fuerza brutaRegistro3 req1 horaPrevenir spam
Logging Seguro
Todos los logs sanitizan automáticamente información sensible:
typescript// ❌ NUNCA se loguea
- Passwords
- Tokens JWT
- API Keys
- Authorization headers

// ✅ Se redactan automáticamente
{
  email: "user@example.com",
  password: "***REDACTED***",
  token: "***REDACTED***"
}
Headers de Seguridad

Content-Security-Policy
X-Frame-Options
X-Content-Type-Options
Strict-Transport-Security


📡 API Endpoints
Authentication
MétodoEndpointDescripciónAuthPOST/api/auth/registerRegistrar usuarioNoPOST/api/auth/loginIniciar sesiónNoGET/api/auth/meObtener usuario actualSí
Exercises
MétodoEndpointDescripciónAuthGET/api/exercisesListar ejerciciosNoGET/api/exercises/:idObtener ejercicioNoPOST/api/exercisesCrear ejercicioSíPATCH/api/exercises/:idActualizar ejercicioSíDELETE/api/exercises/:idEliminar ejercicioSí
Health
MétodoEndpointDescripciónAuthGET/healthEstado del servidorNo

📊 Comandos Útiles
bash# Desarrollo
npm run dev              # Iniciar servidor en modo desarrollo
npm run build            # Compilar TypeScript
npm run start            # Iniciar servidor en producción

# Testing
npm run test             # Ejecutar tests
npm run test:watch       # Tests en watch mode
npm run test:coverage    # Ver cobertura

# Logs
npm run logs:view        # Ver logs en tiempo real
npm run logs:errors      # Ver solo errores
npm run logs:clean       # Limpiar logs antiguos

# TypeScript
npm run type-check       # Verificar tipos sin compilar

# Docker
docker-compose up -d     # Iniciar MongoDB
docker-compose down      # Detener servicios
docker ps                # Ver contenedores corriendo

📈 Estado del Proyecto
✅ Backend Core (TypeScript + Express)
✅ MongoDB + Mongoose
✅ API REST Completa (Exercises)
✅ Autenticación JWT
✅ Logging Profesional (Winston)
✅ Rate Limiting
⏳ Security Headers (Helmet + CORS)
⏳ Integración IA (Gemini)
⏳ Frontend React
⏳ Deploy a Producción
Estadísticas:

Tests: 69 passing
Cobertura: >90%
Endpoints: 8 funcionando
Líneas de código: ~2000
Commits: Organizados con conventional commits


🤝 Contribuir

Fork el proyecto
Crea una rama para tu feature (git checkout -b feature/AmazingFeature)
Commit tus cambios (git commit -m 'Add some AmazingFeature')
Push a la rama (git push origin feature/AmazingFeature)
Abre un Pull Request

Guías de Contribución

Seguir TDD: Tests primero
Mantener cobertura >90%
TypeScript estricto
Commits descriptivos
Documentación JSDoc


📝 Licencia
Este proyecto está bajo la Licencia MIT. Ver archivo LICENSE para más detalles.

👥 Autor
Tu Nombre

GitHub: @tu-usuario
Email: tu-email@example.com


🙏 Agradecimientos

Anthropic Claude - Por la asistencia en desarrollo
Comunidad de TypeScript
Express.js Team
MongoDB Team


📚 Recursos

Documentación API
Guía de Testing
Guía de Logging
Guía de Seguridad


¿Preguntas? Abre un issue en GitHub o contacta al equipo.
🚀 ¡Happy Coding!

---

## ✅ Guardar y Verificar
```bash
# Guardar el README
# (guarda el contenido de arriba en README.md)

# Ver cómo se ve
cat README.md

# O ver en GitHub/GitLab formateado