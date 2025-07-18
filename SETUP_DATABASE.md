# 🚀 Configuración de Base de Datos - Courtnex Manager

## 📋 Prerrequisitos

Antes de ejecutar el proyecto, necesitas tener instalado:
- **PostgreSQL** (versión 12 o superior)
- **Node.js** (versión 16 o superior)
- **npm** o **yarn**

## 🔧 Configuración Paso a Paso

### 1. **Instalar PostgreSQL**

#### macOS (con Homebrew):
```bash
brew install postgresql
brew services start postgresql
```

#### Ubuntu/Debian:
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

#### Windows:
Descargar desde [postgresql.org](https://www.postgresql.org/download/windows/)

### 2. **Crear la Base de Datos**

```bash
# Conectar a PostgreSQL
psql -U postgres

# Crear la base de datos
CREATE DATABASE courtnex_db;

# Crear un usuario específico (opcional pero recomendado)
CREATE USER courtnex_user WITH ENCRYPTED PASSWORD 'tu_password_seguro';
GRANT ALL PRIVILEGES ON DATABASE courtnex_db TO courtnex_user;

# Salir de psql
\q
```

### 3. **Configurar Variables de Entorno**

Edita el archivo `.env` con tus credenciales reales:

```env
# Configuración de la base de datos
DB_HOST=localhost
DB_PORT=5432
DB_NAME=courtnex_db
DB_USER=courtnex_user
DB_PASSWORD=tu_password_seguro

# Configuración del servidor
PORT=3000
NODE_ENV=development
```

### 4. **Ejecutar el Schema de la Base de Datos**

```bash
# Ejecutar el script de creación de tablas
psql -U courtnex_user -d courtnex_db -f database_schema.sql
```

### 5. **Instalar Dependencias del Proyecto**

```bash
npm install
```

### 6. **Iniciar el Servidor**

```bash
# Modo desarrollo
npm run dev

# Modo producción
npm start
```

## 🔍 Verificar la Conexión

Una vez que el servidor esté corriendo, puedes verificar la conexión:

1. **Endpoint de salud**: `GET http://localhost:3000/api/health`
2. **Consola del servidor**: Busca estos mensajes:
   - `🟢 Nueva conexión establecida con la base de datos`
   - `🟢 Conexión a PostgreSQL establecida correctamente`

## 📊 Estructura de Archivos Creados

```
CourtnexManager/
├── .env                    # Variables de entorno (NO subir a git)
├── .gitignore             # Archivos a ignorar en git
├── db.js                  # Configuración de conexión a DB
├── database_schema.sql    # Schema completo de la base de datos
├── queries_examples.sql   # Consultas de ejemplo
├── index.js              # Servidor principal (actualizado)
├── package.json          # Dependencias y scripts
└── DATABASE_README.md     # Documentación del esquema
```

## 🛠️ Funcionalidades del db.js

El archivo `db.js` incluye:

- **Pool de conexiones** optimizado
- **Funciones de utilidad** para CRUD básico
- **Sistema de transacciones**
- **Manejo de errores** robusto
- **Logging** de consultas en desarrollo
- **Paginación** automática

### Ejemplo de uso:

```javascript
const { query, dbUtils } = require('./db');

// Consulta directa
const result = await query('SELECT * FROM complejos WHERE activo = $1', [true]);

// Usando utilidades
const complejo = await dbUtils.findById('complejos', 'uuid-del-complejo');
const newComplejo = await dbUtils.insert('complejos', {
  nombre: 'Mi Complejo',
  direccion: 'Av. Principal 123'
});
```

## 🚨 Solución de Problemas Comunes

### Error: "database does not exist"
```bash
createdb courtnex_db
```

### Error: "password authentication failed"
- Verificar credenciales en `.env`
- Resetear password de PostgreSQL si es necesario

### Error: "port 5432 is already in use"
```bash
# Verificar procesos que usan el puerto
sudo lsof -i :5432
# Reiniciar PostgreSQL
brew services restart postgresql  # macOS
sudo systemctl restart postgresql # Linux
```

### Error: "permission denied"
```bash
# Dar permisos al usuario
psql -U postgres
GRANT ALL PRIVILEGES ON DATABASE courtnex_db TO courtnex_user;
GRANT ALL ON SCHEMA public TO courtnex_user;
```

## 🔐 Seguridad

- ✅ Variables de entorno en `.env`
- ✅ Pool de conexiones limitado
- ✅ Parámetros preparados (evita SQL injection)
- ✅ Manejo de errores sin exponer información sensible
- ✅ `.gitignore` configurado para proteger credenciales

## 📈 Próximos Pasos

1. **Desarrollar APIs**: Crear endpoints para cada módulo
2. **Autenticación**: Implementar JWT y sistema de roles
3. **Validaciones**: Agregar validación de datos con Joi/Yup
4. **Tests**: Configurar Jest para testing
5. **Documentación**: Implementar Swagger/OpenAPI

¡Tu proyecto está listo para comenzar el desarrollo! 🎉
