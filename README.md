# 🚀 AgentLogic - Tutor de Lógica con IA

> Plataforma educativa potenciada por IA para aprender programación a través de ejercicios interactivos, diagramas de flujo y generación de código.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.0-brightgreen)](https://www.mongodb.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue)](https://www.docker.com/)
[![Swagger](https://img.shields.io/badge/API-Documented-85EA2D)](http://localhost:5000/api-docs)

---

## 📋 Tabla de Contenidos

- [✨ Características](#-características)
- [Stack Tecnológico](#️-stack-tecnológico)
- [Metodologías Aplicadas](#-metodologías-aplicadas)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Instalación](#-instalación)
- [Uso](#-uso)
- [API Endpoints](#-api-endpoints)
- [Testing](#-testing)
- [Seguridad](#-seguridad)
- [Comandos Útiles](#-comandos-útiles)
- [Estado del Proyecto](#-estado-del-proyecto)
- [Contribuir](#-contribuir)

---

## ✨ Características

### 🎯 Core Features
- **Gestión de Ejercicios**: CRUD completo de ejercicios de programación
- **Múltiples Lenguajes**: Soporte para Python, JavaScript, TypeScript, Java, C++, y más
- **Dificultad Adaptativa**: Sistema de niveles (easy, medium, hard)
- **Casos de Prueba**: Validación automática de soluciones
- **Búsqueda Avanzada**: Filtrado por lenguaje, dificultad y tags
- **API RESTful**: 12 endpoints completamente documentados

### 🤖 Inteligencia Artificial (Gemini 2.0)
- **Generación de Código**: Soluciones completas con explicación
- **Análisis de Código**: Detección de bugs y sugerencias de mejora
- **Explicación de Conceptos**: Tutor IA para aprendizaje personalizado
- **Rate Limiting IA**: Protección contra abuso (10 req/15min)

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
- **Límite IA**: 10 peticiones/15 min por usuario
- **Detección de Ataques**: Logging automático de rate limits

### 🧪 Calidad de Código
- **TDD (Test-Driven Development)**: Tests antes del código
- **TypeScript Estricto**: Tipado completo
- **Testing Setup**: Vitest con coverage
- **JSDoc**: Documentación inline
- **Swagger UI**: Documentación interactiva

---

## 🛠️ Stack Tecnológico

### Backend
```
├── Node.js 18+          # Runtime JavaScript
├── TypeScript 5.0       # Tipado estático
├── Express.js 5.1       # Framework web
├── MongoDB 7.0          # Base de datos NoSQL
├── Mongoose 8.19        # ODM para MongoDB
├── Winston              # Logger profesional
├── Bcrypt               # Hashing de passwords
├── JWT                  # JSON Web Tokens
├── Express Rate Limit   # Rate limiting
├── Helmet               # Security headers
├── Swagger UI           # Documentación API interactiva
├── Google Gemini 2.0    # IA para generación y análisis
└── Vitest               # Framework de testing
```

### Frontend (Próximamente)
```
├── React 18             # Biblioteca UI
├── TypeScript           # Tipado estático
├── Vite                 # Build tool
├── shadcn/ui            # Componentes modernos
├── Tailwind CSS         # Utilidades CSS
└── React Router         # Routing
```

### DevOps
```
├── Docker               # Contenedores
├── Docker Compose       # Orquestación
└── GitHub Actions       # CI/CD (próximamente)
```

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
AgentLogic-TS/
├── backend/                 # API Node.js + Express
│   ├── src/
│   │   ├── config/         # Configuraciones
│   │   │   ├── database.ts       # Conexión MongoDB
│   │   │   ├── logger.config.ts  # Winston Logger
│   │   │   ├── env.config.ts     # Variables de entorno
│   │   │   └── swagger.config.ts # Swagger UI
│   │   │
│   │   ├── types/          # Tipos TypeScript
│   │   │   ├── exercise.types.ts
│   │   │   ├── user.types.ts
│   │   │   ├── ai.types.ts
│   │   │   └── api.types.ts
│   │   │
│   │   ├── models/         # Modelos Mongoose
│   │   │   ├── Exercise.ts
│   │   │   └── User.ts
│   │   │
│   │   ├── controllers/    # Lógica de negocio
│   │   │   ├── exerciseController.ts
│   │   │   ├── authController.ts
│   │   │   └── aiController.ts
│   │   │
│   │   ├── routes/         # Rutas HTTP
│   │   │   ├── exercises.ts
│   │   │   ├── auth.ts
│   │   │   └── ai.ts
│   │   │
│   │   ├── middleware/     # Middleware Express
│   │   │   ├── auth.ts           # JWT authentication
│   │   │   ├── errorHandler.ts   # Manejo de errores
│   │   │   ├── validateRequest.ts # Validación
│   │   │   ├── logger.middleware.ts # HTTP logging
│   │   │   ├── rateLimiter.ts    # Rate limiting
│   │   │   └── security.ts       # Security headers
│   │   │
│   │   ├── services/       # Servicios externos
│   │   │   ├── gemini.service.ts # Google Gemini AI
│   │   │   └── jwtService.ts     # JWT tokens
│   │   │
│   │   ├── utils/          # Utilidades
│   │   │   ├── exercise.validator.ts
│   │   │   └── user.validator.ts
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
│   ├── coverage/           # Cobertura de tests
│   ├── .env                # Variables de entorno
│   ├── package.json
│   ├── tsconfig.json
│   └── vitest.config.ts
│
├── frontend/               # App React (próximamente)
├── docs/                   # Documentación
│   ├── API.md
│   ├── AUTHENTICATION.md
│   ├── DEVELOPMENT.md
│   ├── LOGGING.md
│   ├── RATE_LIMITING.md
│   ├── SECURITY.md
│   └── TESTING.md
│
├── scripts/                # Scripts útiles
│   └── check-secrets.sh
│
├── docker-compose.yml      # Docker Compose
└── README.md
```

---

## 🚀 Instalación

### Requisitos Previos

- Node.js 18 o superior
- Docker y Docker Compose (para MongoDB)
- Git
- Cuenta de Google Cloud (para Gemini API)

### 1. Clonar el Repositorio
```bash
git clone https://github.com/Bitxogm/New-Logic-Agent.git
cd New-Logic-Agent
```

### 2. Instalar Dependencias del Backend
```bash
cd backend
npm install
```

### 3. Configurar Variables de Entorno
Crea un archivo `.env` en la carpeta `backend/`:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/agentlogic

# JWT
JWT_SECRET=tu_secreto_super_seguro_cambiar_en_produccion
JWT_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:5173

# Google Gemini AI
GEMINI_API_KEY=tu_api_key_de_google_gemini
```

### 4. Iniciar MongoDB con Docker
```bash
# Desde la raíz del proyecto
docker-compose up -d
```

### 5. Iniciar Servidor de Desarrollo
```bash
cd backend
npm run dev
```

El servidor estará disponible en: **http://localhost:5000**

### 6. Verificar Instalación
```bash
# Health check
curl http://localhost:5000/health

# Ver Swagger UI
# Abre en el navegador: http://localhost:5000/api-docs
```

---

## 💻 Uso

### 🌐 Swagger UI - Documentación Interactiva

La forma más fácil de probar la API es usando Swagger UI:

**http://localhost:5000/api-docs**

Desde ahí puedes:
- Ver todos los endpoints organizados
- Probar cada endpoint directamente
- Ver esquemas de request/response
- Autenticarte con JWT

---

### 📝 Ejemplos con cURL

#### Health Check
```bash
curl http://localhost:5000/health
```

#### Registrar un Usuario
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "Password123!",
    "username": "usuario",
    "name": "Usuario Test"
  }'
```

#### Iniciar Sesión
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "Password123!"
  }'
```

Guarda el `token` de la respuesta para usarlo en endpoints protegidos.

#### Crear un Ejercicio (Requiere Autenticación)
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
    ],
    "tags": ["básico", "matemáticas"]
  }'
```

#### Generar Solución con IA
```bash
curl -X POST http://localhost:5000/api/ai/generate-solution \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -d '{
    "problem": "Crea una función que sume dos números",
    "language": "javascript",
    "difficulty": "easy"
  }'
```

#### Analizar Código con IA
```bash
curl -X POST http://localhost:5000/api/ai/analyze-code \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -d '{
    "code": "function sum(a, b) { return a + b; }",
    "language": "javascript",
    "focusAreas": ["performance", "readability"]
  }'
```

---

## 📡 API Endpoints

### Authentication
| Método | Endpoint | Descripción | Auth | Rate Limit |
|--------|----------|-------------|------|------------|
| POST | `/api/auth/register` | Registrar nuevo usuario | No | 3/hora |
| POST | `/api/auth/login` | Iniciar sesión | No | 5/15min |
| GET | `/api/auth/me` | Obtener perfil del usuario actual | Sí | 100/15min |

### Exercises
| Método | Endpoint | Descripción | Auth | Filtros |
|--------|----------|-------------|------|---------|
| GET | `/api/exercises` | Listar ejercicios | No | language, difficulty, page, limit |
| GET | `/api/exercises/:id` | Obtener ejercicio por ID | No | - |
| POST | `/api/exercises` | Crear nuevo ejercicio | Sí | - |
| PATCH | `/api/exercises/:id` | Actualizar ejercicio | Sí | - |
| DELETE | `/api/exercises/:id` | Eliminar ejercicio | Sí | - |

### AI (Gemini 2.0)
| Método | Endpoint | Descripción | Auth | Rate Limit |
|--------|----------|-------------|------|------------|
| POST | `/api/ai/generate-solution` | Generar solución de código con IA | Sí | 10/15min |
| POST | `/api/ai/analyze-code` | Analizar código (bugs, mejoras, complejidad) | Sí | 10/15min |
| POST | `/api/ai/explain` | Explicar concepto de programación | Sí | 10/15min |

### Health
| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/health` | Estado del servidor y conexión DB | No |

---

### 📖 Documentación Completa

**Swagger UI**: http://localhost:5000/api-docs

Toda la API está documentada con Swagger, donde puedes:
- ✅ Ver todos los endpoints organizados por categorías
- ✅ Probar endpoints directamente desde el navegador
- ✅ Ver esquemas de request/response con ejemplos
- ✅ Autenticarte con JWT usando el botón "Authorize"
- ✅ Ver códigos de estado y posibles errores

---

## 🧪 Testing

### Ejecutar Todos los Tests
```bash
npm run test
```

### Tests en Modo Watch
```bash
npm run test:watch
```

### Ver Cobertura de Código
```bash
npm run test:coverage
```

### Ejecutar Tests Específicos
```bash
# Tests unitarios
npm run test src/tests/unit/

# Tests de integración
npm run test src/tests/integration/
```

---

## 🔒 Seguridad

### Rate Limiting
La API implementa rate limiting en múltiples niveles:

| Endpoint | Límite | Ventana | Descripción |
|----------|--------|---------|-------------|
| General | 100 req | 15 min | Todas las rutas |
| Login | 5 req | 15 min | Prevenir fuerza bruta |
| Registro | 3 req | 1 hora | Prevenir spam |
| IA (Gemini) | 10 req | 15 min | Proteger recursos de IA |

### Logging Seguro
Todos los logs sanitizan automáticamente información sensible:

```typescript
// ❌ NUNCA se loguea:
- Passwords
- Tokens JWT
- API Keys
- Authorization headers

// ✅ Se redactan automáticamente:
{
  email: "user@example.com",
  password: "***REDACTED***",
  token: "***REDACTED***"
}
```

### Headers de Seguridad (Helmet)
- `Content-Security-Policy`
- `X-Frame-Options`
- `X-Content-Type-Options`
- `Strict-Transport-Security`
- `X-DNS-Prefetch-Control`

---

## 📊 Comandos Útiles

### Desarrollo
```bash
npm run dev              # Iniciar servidor en modo desarrollo
npm run build            # Compilar TypeScript a JavaScript
npm run start            # Iniciar servidor en producción
npm run type-check       # Verificar tipos sin compilar
```

### Testing
```bash
npm run test             # Ejecutar tests
npm run test:watch       # Tests en watch mode
npm run test:ui          # Abrir UI de Vitest
npm run test:coverage    # Ver cobertura de código
```

### Docker
```bash
docker-compose up -d     # Iniciar MongoDB
docker-compose down      # Detener servicios
docker-compose logs -f   # Ver logs de MongoDB
docker ps                # Ver contenedores corriendo
```

---

## 📈 Estado del Proyecto

### ✅ Completado

- ✅ **Backend Core** (TypeScript + Express)
- ✅ **MongoDB + Mongoose** (Models, Schemas, Validation)
- ✅ **API REST Completa** (Auth + Exercises + AI)
- ✅ **Autenticación JWT** (Register, Login, Me)
- ✅ **Logging Profesional** (Winston + Sanitization)
- ✅ **Rate Limiting** (General + Auth + IA)
- ✅ **Security Headers** (Helmet + CORS)
- ✅ **Integración IA** (Gemini 2.0 - Generate, Analyze, Explain)
- ✅ **Swagger UI** (Documentación interactiva)
- ✅ **Testing Setup** (Vitest + Coverage)
- ✅ **Docker** (MongoDB containerizado)
- ✅ **Error Handling** (Middleware centralizado)
- ✅ **Input Validation** (Sanitización y validación)

### ⏳ En Desarrollo

- ⏳ **Frontend React** (TypeScript + Vite + shadcn/ui)
- ⏳ **Deploy a Producción** (Railway/Render/AWS)
- ⏳ **CI/CD** (GitHub Actions)
- ⏳ **Tests E2E** (Playwright/Cypress)

### 📊 Estadísticas

- **Endpoints**: 12 completamente documentados
- **Swagger UI**: http://localhost:5000/api-docs
- **Tests**: Vitest configurado con coverage
- **Líneas de código**: ~3000+
- **Arquitectura**: Clean Architecture + TDD
- **Commits**: Conventional commits

---

## 🤝 Contribuir

### Proceso de Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'feat: add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Guías de Contribución

- **Seguir TDD**: Escribir tests antes del código
- **Mantener cobertura**: >80% de coverage
- **TypeScript estricto**: Sin `any`, tipado completo
- **Commits descriptivos**: Usar [Conventional Commits](https://www.conventionalcommits.org/)
- **Documentación**: JSDoc + Swagger para nuevos endpoints
- **Seguridad**: Input validation + sanitización

---

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver archivo `LICENSE` para más detalles.

---

## 👥 Autor

**Bitxogm**
- GitHub: [@Bitxogm](https://github.com/Bitxogm)
- Proyecto: [New-Logic-Agent](https://github.com/Bitxogm/New-Logic-Agent)

---

## 🙏 Agradecimientos

- [Anthropic Claude](https://www.anthropic.com/) - Asistencia en desarrollo
- [Google Gemini](https://deepmind.google/technologies/gemini/) - API de IA
- [Express.js](https://expressjs.com/) - Framework web
- [MongoDB](https://www.mongodb.com/) - Base de datos
- [TypeScript](https://www.typescriptlang.org/) - Lenguaje
- Comunidad Open Source

---

## 📚 Recursos

- [Documentación completa en `/docs`](./docs)
- [Swagger UI](http://localhost:5000/api-docs) - Documentación interactiva
- [Issues](https://github.com/Bitxogm/New-Logic-Agent/issues) - Reportar bugs
- [Pull Requests](https://github.com/Bitxogm/New-Logic-Agent/pulls) - Contribuciones

---

### ❓ ¿Preguntas?

Abre un [issue](https://github.com/Bitxogm/New-Logic-Agent/issues) en GitHub o contacta al equipo.

---

🚀 **¡Happy Coding!**