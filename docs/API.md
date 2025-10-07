# 📡 API Documentation

Documentación completa de la API RESTful de AgentLogic.

## Base URL
http://localhost:5000/api

## Autenticación

La API utiliza JWT (JSON Web Tokens) para autenticación.

### Headers requeridos
```http
Authorization: Bearer <token>
Content-Type: application/json

🔐 Authentication Endpoints
`POST /api/auth/register`
Registrar un nuevo usuario.
Request:
json{
  "email": "user@example.com",
  "password": "Password123",
  "username": "usuario123",
  "name": "Usuario Test"
}
Response (201):
json{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "email": "user@example.com",
      "username": "usuario123",
      "name": "Usuario Test",
      "createdAt": "2025-10-07T06:00:00.000Z"
    }
  }
}

**Errores Comunes:**
- `400 Bad Request`: Validación fallida (e.g., email inválido, password débil).
- `400 Bad Request`: El email ya está registrado.
- `429 Too Many Requests`: Límite de registros alcanzado (3 por hora).


`POST /api/auth/login`
Iniciar sesión.
Request:
json{
  "email": "user@example.com",
  "password": "Password123"
}
Response (200):
json{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "email": "user@example.com",
      "username": "usuario123",
      "name": "Usuario Test"
    }
  }
}

**Errores Comunes:**
- `401 Unauthorized`: Credenciales inválidas.
- `429 Too Many Requests`: Límite de intentos de login alcanzado (5 por 15 minutos).


`GET /api/auth/me`
Obtener información del usuario autenticado.
Headers:
httpAuthorization: Bearer <token>
Response (200):
json{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "username": "usuario123",
    "name": "Usuario Test",
    "createdAt": "2025-10-07T06:00:00.000Z"
  }
}

**Errores Comunes:**
- `401 Unauthorized`: No se proporcionó un token.
- `401 Unauthorized`: El token es inválido o ha expirado.


📝 Exercise Endpoints
`GET /api/exercises`
Listar todos los ejercicios.
Query Parameters:

language (opcional): Filtrar por lenguaje
difficulty (opcional): Filtrar por dificultad (easy, medium, hard)
page (opcional): Número de página (default: 1)
limit (opcional): Resultados por página (default: 10)

Ejemplo:
bashGET /api/exercises?language=javascript&difficulty=easy&page=1&limit=10
Response (200):
json{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Suma de dos números",
      "description": "Crea una función que sume dos números",
      "difficulty": "easy",
      "language": "javascript",
      "testCases": [
        {
          "input": [2, 3],
          "expectedOutput": 5
        }
      ],
      "tags": ["básico", "matemáticas"],
      "createdAt": "2025-10-07T06:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "pages": 5
  }
}

`GET /api/exercises/:id`
Obtener un ejercicio específico.
Response (200):
json{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Suma de dos números",
    "description": "Crea una función que sume dos números",
    "difficulty": "easy",
    "language": "javascript",
    "testCases": [
      {
        "input": [2, 3],
        "expectedOutput": 5
      }
    ],
    "tags": ["básico", "matemáticas"],
    "createdAt": "2025-10-07T06:00:00.000Z"
  }
}

**Errores Comunes:**
- `404 Not Found`: El ejercicio con el ID especificado no existe.
- `400 Bad Request`: El ID proporcionado no es un ObjectId válido.


`POST /api/exercises`
Crear un nuevo ejercicio (requiere autenticación).
Headers:
httpAuthorization: Bearer <token>
Request:
json{
  "title": "Suma de dos números",
  "description": "Crea una función que sume dos números",
  "difficulty": "easy",
  "language": "javascript",
  "testCases": [
    {
      "input": [2, 3],
      "expectedOutput": 5
    }
  ],
  "tags": ["básico", "matemáticas"]
}
Response (201):
json{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Suma de dos números",
    ...
  }
}

**Errores Comunes:**
- `401 Unauthorized`: Se requiere autenticación.
- `400 Bad Request`: Los datos del ejercicio no superan la validación.


`PATCH /api/exercises/:id`
Actualizar un ejercicio (requiere autenticación).
Headers:
httpAuthorization: Bearer <token>
Request:
json{
  "title": "Nuevo título",
  "difficulty": "medium"
}
Response (200):
json{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Nuevo título",
    "difficulty": "medium",
    ...
  }
}

**Errores Comunes:**
- `401 Unauthorized`: Se requiere autenticación.
- `404 Not Found`: El ejercicio con el ID especificado no existe.
- `400 Bad Request`: Los datos a actualizar no superan la validación.


`DELETE /api/exercises/:id`
Eliminar un ejercicio (requiere autenticación).
Headers:
httpAuthorization: Bearer <token>
Response (200):
json{
  "success": true,
  "message": "Ejercicio eliminado correctamente"
}

**Errores Comunes:**
- `401 Unauthorized`: Se requiere autenticación.
- `404 Not Found`: El ejercicio con el ID especificado no existe.


🏥 Health Endpoint
`GET /health`
Verificar estado del servidor.
Response (200):
json{
  "success": true,
  "message": "API funcionando correctamente",
  "timestamp": "2025-10-07T06:00:00.000Z"
}

⚠️ Códigos de Error
| Código | Significado                     |
|--------|---------------------------------|
| `200`  | Éxito                           |
| `201`  | Creado                          |
| `400`  | Bad Request - Error de validación|
| `401`  | Unauthorized - No autenticado   |
| `404`  | Not Found - Recurso no encontrado|
| `429`  | Too Many Requests - Rate limit  |
| `500`  | Internal Server Error           |

🛡️ Rate Limits
| Endpoint | Límite      | Ventana |
|----------|-------------|---------|
| General  | 100 req     | 15 min  |
| Login    | 5 req       | 15 min  |
| Registro | 3 req       | 1 hora  |

📝 Ejemplos con cURL
Registro
bashcurl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "Password123",
    "username": "usuario123",
    "name": "Usuario Test"
  }'
Login
bashcurl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "Password123"
  }'
Crear Ejercicio
bashcurl -X POST http://localhost:5000/api/exercises \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN" \
  -d '{
    "title": "Suma de números",
    "description": "...",
    "difficulty": "easy",
    "language": "javascript",
    "testCases": [...]
  }'

🔗 Recursos Adicionales

Autenticación
Rate Limiting
Seguridad