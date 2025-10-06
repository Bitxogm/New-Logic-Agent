# 🚀 AgentLogic - Tutor de Lógica con IA

> Plataforma educativa potenciada por IA para aprender programación a través de ejercicios interactivos, diagramas de flujo y generación de código.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.0-brightgreen)](https://www.mongodb.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue)](https://www.docker.com/)
[![Tests](https://img.shields.io/badge/Tests-29%20passing-success)](https://vitest.dev/)

---

## 📋 Tabla de Contenidos

- [Características](#-características-1)
- [Stack Tecnológico](#-stack-tecnológico-1)
- [Metodologías Aplicadas](#-metodologías-aplicadas-1)
- [Estructura del Proyecto](#-estructura-del-proyecto-1)
- [Instalación](#-instalación-1)
- [Uso](#-uso-1)
- [Testing](#-testing-1)
- [Documentación](#-documentación-1)
- [Contribuir](#-contribuir-1)

---

## ✨ Características

### 🎯 Core Features
- **Gestión de Ejercicios**: CRUD completo de ejercicios de programación
- **Múltiples Lenguajes**: Soporte para Python, JavaScript, TypeScript, Java, C++, y más
- **Dificultad Adaptativa**: Sistema de niveles (easy, medium, hard)
- **Casos de Prueba**: Validación automática de soluciones
- **Búsqueda Avanzada**: Filtrado por lenguaje, dificultad y tags
- **API RESTful**: Endpoints documentados y testeados

### 🔒 Seguridad (Security by Design)
- Validación de inputs con sanitización
- Prevención de XSS e inyecciones
- Rate limiting en endpoints
- Headers de seguridad (Helmet)
- Logs sin información sensible

### 🧪 Calidad de Código
- **TDD (Test-Driven Development)**: Tests antes del código
- **TypeScript estricto**: Tipado completo
- **Alta cobertura**: > 80% de coverage
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
🔴 RED    → Escribir test que falla
🟢 GREEN  → Escribir código mínimo para pasar
🔵 REFACTOR → Mejorar el código

**Ejemplo:**
```typescript
// 1. Test primero
it('debe validar email', () => {
  expect(validateEmail('test@ejemplo.com').isValid).toBe(true);
});

// 2. Código después
function validateEmail(email: string) {
  return { isValid: /\S+@\S+\.\S+/.test(email) }; // Regex simple para ejemplo
}
```

### 2. Security by Design
Pensamos en seguridad desde el diseño, no después:
```typescript
// ✅ Validación desde el principio
const DANGEROUS_PATTERNS = [/<script/i, /javascript:/i];

function validateInput(input: string) {
  for (const pattern of DANGEROUS_PATTERNS) {
    if (pattern.test(input)) {
      return { isValid: false, error: 'Input peligroso' };
    }
  }
  return { isValid: true };
}
```

### 3. Security by Default
Configuraciones seguras por defecto:
```typescript
// Rate limiting automático en Express
const rateLimitOptions = {
  windowMs: 15 * 60 * 1000,  // 15 minutos
  max: 100                    // 100 requests máximo por IP
};

// Headers de seguridad automáticos con Helmet
app.use(helmet());
```

### 4. Clean Architecture
Separación clara de responsabilidades:
`Types → Models → Controllers → Routes`
  `↓       ↓          ↓           ↓`
`Datos  Schema   Lógica      HTTP`
2. Security by Design
Pensamos en seguridad desde el diseño, no después:
typescript// ✅ Validación desde el principio
const DANGEROUS_PATTERNS = [/<script/i, /javascript:/i];

---

## 📁 Estructura del Proyecto
AgentLogic-TS/
├── backend/                 # API Node.js + Express
│   ├── src/
│   │   ├── config/         # Configuraciones (DB, seguridad)
│   │   ├── types/          # Tipos TypeScript
│   │   ├── models/         # Modelos Mongoose
│   │   ├── controllers/    # Lógica de negocio
│   │   ├── routes/         # Rutas HTTP
│   │   ├── middleware/     # Middleware Express
│   │   ├── utils/          # Utilidades
│   │   ├── services/       # Servicios (IA, etc)
│   │   └── tests/          # Tests (unitarios y de integración)
│   │       ├── unit/       # Tests de unidades (modelos, utils)
│   │       └── integration/# Tests de rutas/endpoints
│   ├── .env                # Variables de entorno
│   ├── package.json
│   ├── tsconfig.json       # Configuración TypeScript
│   └── vitest.config.ts    # Configuración de tests
│
├── frontend/               # App React (próximamente)
│   └── ...
│
├── docs/                   # Documentación
│   ├── api/               # Documentación API
│   ├── architecture/      # Diagramas de arquitectura
│   └── guides/            # Guías de desarrollo
│
├── docker-compose.yml     # Configuración Docker
└── README.md              # Este archivo
---

## 🚀 Instalación
Requisitos Previos

*   Node.js 18 o superior
*   Docker
*   Git

1. Clonar el Repositorio
```bash
git clone https://github.com/tu-usuario/AgentLogic-TS.git
cd AgentLogic-TS
```

2. Instalar Dependencias del Backend
```bash
cd backend
npm install
```
