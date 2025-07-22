# 🔧 CourtnexManager - Backend

API REST desarrollada con Node.js y Express para el sistema de gestión de complejos deportivos.

## 📋 Características

- 🚀 Servidor Express.js
- 🗄️ Conexión a PostgreSQL con pool de conexiones
- 🔌 Endpoints RESTful
- ⚡ Hot-reload con Nodemon
- 🛡️ Manejo de errores y logging
- 🔄 Cierre graceful del servidor

## 🛠️ Tecnologías

- **Runtime**: Node.js
- **Framework**: Express.js
- **Base de Datos**: PostgreSQL
- **ORM/Driver**: pg (node-postgres)
- **Desarrollo**: Nodemon
- **Variables de Entorno**: dotenv

## 🚀 Instalación y Configuración

### 1. Instalar Dependencias

```bash
npm install
```

### 2. Configurar Variables de Entorno

```bash
# Copiar archivo de ejemplo
cp .env.example .env

# Editar con tus valores
nano .env
```

### 3. Configurar Base de Datos

Asegúrate de tener PostgreSQL instalado y funcionando:

```bash
# Crear base de datos
createdb courtnex_db

# Ejecutar esquema (desde la carpeta raíz del proyecto)
psql -d courtnex_db -f ../database/database_schema.sql
```

### 4. Iniciar Servidor

```bash
# Modo desarrollo (con hot-reload)
npm run dev

# Modo producción
npm start

# Probar conexión a BD
npm run db:test
```

## 📡 Endpoints Disponibles

### Sistema
- `GET /` - Información general del servidor
- `GET /api/health` - Estado de salud y conexión a BD

### Próximamente
- `POST /api/auth/login` - Autenticación de usuarios
- `GET /api/complejos` - Listar complejos
- `POST /api/complejos` - Crear complejo
- `GET /api/canchas` - Listar canchas
- `POST /api/canchas` - Crear cancha
- `GET /api/reservas` - Listar reservas
- `POST /api/reservas` - Crear reserva
- Y muchos más...

## 🗂️ Estructura de Archivos

```
backend/
├── index.js              # Punto de entrada del servidor
├── db.js                 # Configuración de base de datos
├── package.json          # Dependencias y scripts
├── .env.example          # Ejemplo de variables de entorno
└── .env                  # Variables de entorno (no incluido en Git)
```

## 🔧 Scripts NPM

```bash
# Iniciar servidor en producción
npm start

# Iniciar servidor en desarrollo con hot-reload
npm run dev

# Probar conexión a base de datos
npm run db:test

# Ejecutar tests (cuando estén implementados)
npm test
```

## ⚙️ Configuración

### Variables de Entorno (.env)

```env
# Base de Datos
DB_HOST=localhost
DB_PORT=5432
DB_NAME=courtnex_db
DB_USER=postgres
DB_PASSWORD=tu_contraseña

# Servidor
PORT=3000
NODE_ENV=development
```

### Pool de Conexiones PostgreSQL

Configuración actual del pool:
- **Conexiones máximas**: 20
- **Timeout de inactividad**: 30s
- **Timeout de conexión**: 2s

## 📊 Logging

El servidor incluye logging básico que muestra:
- Timestamp de cada request
- Método HTTP y ruta
- Estado de conexión a BD
- Errores y advertencias

## 🔄 Manejo de Señales

El servidor maneja gracefulmente las señales de cierre:
- `SIGINT` (Ctrl+C)
- `SIGTERM` (terminación del proceso)

Esto garantiza que el pool de conexiones se cierre correctamente.

## 🧪 Testing

```bash
# Ejecutar tests (cuando estén implementados)
npm test

# Probar conexión a BD manualmente
npm run db:test
```

## 🚀 Despliegue

### Desarrollo Local

```bash
npm run dev
```

### Producción

```bash
# Instalar solo dependencias de producción
npm ci --only=production

# Iniciar servidor
npm start
```

## 📈 Próximas Mejoras

- [ ] Implementar autenticación JWT
- [ ] Agregar middleware de validación
- [ ] Implementar rate limiting
- [ ] Agregar tests unitarios y de integración
- [ ] Implementar logging más avanzado (Winston)
- [ ] Agregar documentación de API (Swagger)
- [ ] Implementar cacheo (Redis)
- [ ] Agregar monitoreo y métricas

## 🐛 Troubleshooting

### Error de Conexión a BD

```bash
# Verificar que PostgreSQL esté funcionando
pg_isready

# Probar conexión manual
psql -h localhost -p 5432 -U postgres -d courtnex_db

# Verificar configuración
npm run db:test
```

### Puerto en Uso

```bash
# Encontrar proceso usando el puerto 3000
lsof -ti:3000

# Terminar proceso
kill -9 $(lsof -ti:3000)
```

## 📞 Soporte

Para problemas específicos del backend, crear un issue en GitHub con:
- Versión de Node.js
- Logs de error completos
- Configuración de variables de entorno (sin credenciales)

---

Desarrollado con ❤️ para CourtnexManager
