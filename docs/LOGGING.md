### 2. `docs/LOGGING.md`
```markdown
# 🪵 Sistema de Logging

Guía completa del sistema de logging con Winston.

## 📋 Índice

- [Introducción](#introducción)
- [Configuración](#configuración)
- [Niveles de Log](#niveles-de-log)
- [Uso Básico](#uso-básico)
- [Sanitización](#sanitización)
- [Archivos de Log](#archivos-de-log)
- [Ejemplos](#ejemplos)

---

## 🎯 Introducción

AgentLogic utiliza **Winston** como sistema de logging profesional con:

✅ Múltiples niveles (error, warn, info, http, debug)  
✅ Archivos separados por nivel  
✅ Sanitización automática de datos sensibles  
✅ Formato JSON en producción  
✅ Formato colorizado en desarrollo  
✅ Rotación automática de logs  

---

## ⚙️ Configuración

El logger está configurado en `backend/src/config/logger.config.ts`.

### Niveles según Entorno

- **Desarrollo**: `debug` (muestra todos los niveles)
- **Producción**: `info` (solo info, warn, error)

### Archivos de Log
backend/logs/
├── error.log       # Solo errores
└── combined.log    # Todos los niveles

---

## 📊 Niveles de Log

| Nivel | Uso | Color | Cuándo Usar |
|-------|-----|-------|-------------|
| `error` | Errores críticos | 🔴 Rojo | Errores que requieren atención |
| `warn` | Advertencias | 🟡 Amarillo | Situaciones anormales pero no críticas |
| `info` | Información general | 🟢 Verde | Eventos normales importantes |
| `http` | Peticiones HTTP | 🟣 Magenta | Automático (middleware) |
| `debug` | Debugging | 🔵 Azul | Solo en desarrollo |

---

## 💡 Uso Básico

### Importar el Logger
```typescript
import logger from '../config/logger.config';
import { sanitizeForLog } from '../config/logger.config';
Loguear Mensajes
typescript// Información general
logger.info('Usuario creado exitosamente', {
  userId: user._id,
  email: user.email
});

// Advertencias
logger.warn('Intento de login fallido', {
  email: 'user@example.com',
  ip: req.ip
});

// Errores
logger.error('Error conectando a MongoDB', {
  error: error.message,
  stack: error.stack
});

// Debug (solo desarrollo)
logger.debug('Valor de configuración', {
  config: process.env.NODE_ENV
});

🔒 Sanitización de Datos
¿Por qué Sanitizar?
NUNCA debes loguear:

❌ Passwords
❌ Tokens JWT
❌ API Keys
❌ Authorization headers
❌ Cookies sensibles

Uso de sanitizeForLog
La función `sanitizeForLog` (exportada desde `logger.config.ts`) clona un objeto y redacta cualquier campo que contenga palabras clave sensibles.

```typescript
// ❌ MAL - Loguea el password en texto plano
logger.info('Datos recibidos', req.body);

// ✅ BIEN - Password redactada
logger.info('Datos recibidos', sanitizeForLog(req.body));
```

**Ejemplo de funcionamiento:**
```typescript
const data = {
  email: 'user@example.com',
  password: 'secret123',        // Será redactado
  token: 'jwt.token.here',      // Será redactado
  name: 'Usuario'               // No se toca
};

const safe = sanitizeForLog(data);
// Resultado:
// {
//   email: 'user@example.com',
//   password: '***REDACTED***',
//   token: '***REDACTED***',
//   name: 'Usuario'
// }
Campos Sanitizados Automáticamente

password
token
refreshToken
authorization
cookie
Cualquier campo que contenga estas palabras (case-insensitive)


📁 Archivos de Log
Ubicación
backend/logs/
├── error.log       # Solo errores (level: error)
└── combined.log    # Todos los logs
Rotación

Tamaño máximo: 5MB por archivo
Archivos a mantener: 5
Rotación: Automática cuando se alcanza el límite

Ver Logs en Tiempo Real
bash# Ver todos los logs
tail -f logs/combined.log

# Ver solo errores
tail -f logs/error.log

# Ver últimas 50 líneas
tail -n 50 logs/combined.log

📝 Ejemplos
1. Logging en Controladores
typescriptimport logger from '../config/logger.config';
import { sanitizeForLog } from '../config/logger.config';

class ExerciseController {
  async create(req: Request, res: Response) {
    const startTime = Date.now();
    
    logger.info('Creando ejercicio', {
      title: req.body.title,
      language: req.body.language
    });

    try {
      const exercise = await Exercise.create(req.body);
      const duration = Date.now() - startTime;

      logger.info('Ejercicio creado exitosamente', {
        exerciseId: exercise._id,
        duration: `${duration}ms`
      });

      res.status(201).json({ success: true, data: exercise });
    } catch (error) {
      logger.error('Error creando ejercicio', {
        error: (error as Error).message,
        stack: (error as Error).stack,
        body: sanitizeForLog(req.body)
      });
      throw error;
    }
  }
}
2. Logging en Autenticación
typescriptclass AuthController {
  async login(req: Request, res: Response) {
    const { email, password } = req.body;
    const ip = req.ip;

    logger.info('Intento de login', { email, ip });

    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      logger.warn('Login fallido: usuario no encontrado', { email, ip });
      throw new AppError('Credenciales inválidas', 401);
    }

    const isValid = await bcrypt.compare(password, user.password);
    
    if (!isValid) {
      logger.warn('Login fallido: password incorrecta', {
        email,
        userId: user._id,
        ip
      });
      throw new AppError('Credenciales inválidas', 401);
    }

    logger.info('Login exitoso', {
      userId: user._id,
      email: user.email,
      ip
    });

    // ... generar token
  }
}
3. Logging de Rate Limits
typescript// Automático en rateLimiter.ts
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  handler: (req, res) => {
    logger.error('🚨 ALERTA: Rate limit alcanzado - Login', {
      ip: req.ip,
      email: req.body?.email,
      attempts: 5
    });
    
    res.status(429).json({ ... });
  }
});

🔍 Buscar en Logs
Comandos Útiles
bash# Buscar errores
grep "error" logs/combined.log

# Buscar por email
grep "user@example.com" logs/combined.log

# Contar errores
grep "error" logs/combined.log | wc -l

# Ver logs de hoy
grep "$(date +%Y-%m-%d)" logs/combined.log

# Buscar rate limits
grep "Rate limit" logs/combined.log
Con jq (para JSON en producción)
bash# Ver solo errores 500
cat logs/error.log | jq 'select(.status == 500)'

# Ver logs de un usuario
cat logs/combined.log | jq 'select(.userId == "123")'

# Contar por tipo de error
cat logs/error.log | jq '.error.message' | sort | uniq -c

🎯 Buenas Prácticas
✅ DO
typescript// Loguear información útil
logger.info('Usuario creado', { userId: user._id, email: user.email });

// Loguear errores con contexto
logger.error('Error en operación', {
  error: error.message,
  operation: 'createUser',
  data: sanitizeForLog(req.body)
});

// Usar niveles apropiados
logger.warn('Rate limit alcanzado', { ip: req.ip });
❌ DON'T
typescript// No loguear passwords
logger.info('Login', { email, password }); // ❌

// No loguear tokens
logger.info('Auth', { token: jwt }); // ❌

// No usar console.log en producción
console.log('Esto no irá a los logs'); // ❌

// No loguear información innecesaria
logger.debug(JSON.stringify(hugeObject)); // ❌

📊 Monitoreo
Ver Estadísticas
bash# Peticiones por método
cat logs/combined.log | grep -oP '(GET|POST|PATCH|DELETE)' | sort | uniq -c

# Requests por día
cat logs/combined.log | grep -oP '\d{4}-\d{2}-\d{2}' | sort | uniq -c

# Errores más comunes
cat logs/error.log | grep -oP '"message":"[^"]*"' | sort | uniq -c | sort -rn

🔗 Recursos

Winston Documentation
Log Levels Best Practices
API Documentation