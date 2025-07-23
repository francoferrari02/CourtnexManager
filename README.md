# 🎾 CourtnexManager

Sistema integral de gestión para complejos deportivos con reservas, inventario, pagos y más.

## 📁 Estructura del Proyecto

```
CourtnexManager/
├── README.md                 # Este archivo
├── .gitignore               # Archivos ignorados por Git
├── .env.example            # Variables de entorno de ejemplo
├── backend/                # Servidor Node.js/Express
│   ├── index.js           # Punto de entrada del servidor
│   ├── db.js              # Configuración de base de datos
│   ├── package.json       # Dependencias del backend
│   └── .env              # Variables de entorno (no incluido en Git)
├── frontend/              # Aplicación React
│   ├── src/              # Código fuente de React
│   ├── public/           # Archivos públicos
│   ├── package.json      # Dependencias del frontend
│   └── ...              # Otros archivos de React
└── database/             # Scripts y esquemas de base de datos
    ├── database_schema.sql    # Esquema completo de la base de datos
    ├── queries_examples.sql   # Ejemplos de consultas
    ├── DATABASE_README.md     # Documentación de la BD
    └── SETUP_DATABASE.md      # Guía de configuración de la BD
```

## 🚀 Inicio Rápido

### ✨ Comando Simple (Recomendado)

```bash
# Ejecutar todo el sistema (Backend + Frontend + BD)
npm run dev

# El comando anterior iniciará automáticamente:
# ✅ Backend en http://localhost:3000
# ✅ Frontend en http://localhost:3001
# ✅ Verificará que PostgreSQL esté funcionando
```

### 🛑 Detener el Sistema

```bash
# Método 1: Detener desde la terminal (Recomendado)
Ctrl + C                    # En la terminal donde ejecutaste npm run dev

# Método 2: Comando de detención
npm run stop               # Detiene todos los procesos relacionados

# Método 3: Detención manual por puerto
lsof -ti:3000 | xargs kill -9    # Detener backend (puerto 3000)
lsof -ti:3001 | xargs kill -9    # Detener frontend (puerto 3001)
```

### ⚡ Comandos Rápidos

```bash
# 🚀 Iniciar todo
npm run dev

# 🛑 Detener todo  
Ctrl + C  (o npm run stop)

# 🔄 Reiniciar todo
npm run stop && npm run dev

# 📊 Ver estado
curl http://localhost:3000/api/health    # Estado del backend
open http://localhost:3001               # Abrir frontend en navegador
```

### 📋 Comandos Individuales

```bash
# Solo Backend
npm run backend:dev

# Solo Frontend  
npm run frontend:start

# Verificar estado de la base de datos
npm run db:test

# Instalar todas las dependencias
npm run install:all

# Configuración inicial completa
npm run setup
```

## 📊 Scripts Disponibles

### 🎯 Scripts Principales

```bash
# 🚀 INICIAR TODO EL SISTEMA
npm run dev                 # Backend + Frontend simultáneamente

# 🛑 DETENER SISTEMA  
Ctrl + C                    # En la terminal donde corre npm run dev

# 📦 INSTALACIÓN
npm run install:all         # Instala dependencias de backend y frontend
npm run setup              # Configuración inicial completa (BD + dependencias)
```

### 🔧 Scripts por Componente

#### Backend
```bash
npm run backend:dev        # Desarrollo con hot-reload
npm run backend:start      # Producción
npm run backend:install    # Solo dependencias del backend
```

#### Frontend
```bash
npm run frontend:start     # Desarrollo
npm run frontend:build     # Build de producción  
npm run frontend:install   # Solo dependencias del frontend
```

#### Base de Datos
```bash
npm run db:setup          # Ejecutar esquema de BD
npm run db:create         # Crear base de datos
npm run db:test           # Probar conexión
```

## 🔧 Variables de Entorno

### Backend (.env)

```env
# Configuración de Base de Datos
DB_HOST=localhost
DB_PORT=5432
DB_NAME=courtnex_db
DB_USER=postgres
DB_PASSWORD=tu_contraseña

# Configuración del Servidor
PORT=3000
NODE_ENV=development

# JWT y Seguridad (para futuras implementaciones)
JWT_SECRET=tu_clave_secreta_muy_segura
JWT_EXPIRES_IN=24h

# APIs Externas (Plan Premium)
WHATSAPP_TOKEN=tu_token_whatsapp
MERCADOPAGO_ACCESS_TOKEN=tu_token_mercadopago
```

## 🗄️ Base de Datos

El sistema utiliza PostgreSQL con el siguiente esquema:

- **Complejos**: Información de los complejos deportivos
- **Usuarios**: Sistema de usuarios y permisos
- **Canchas**: Gestión de canchas y espacios
- **Clientes**: Base de datos de clientes
- **Reservas**: Sistema de reservas y agenda
- **Pagos**: Gestión de pagos y facturación
- **Productos**: Inventario y ventas
- **Notificaciones**: Sistema de notificaciones
- **Torneos**: Gestión de torneos (Plan Premium)
- **WhatsApp**: Mensajes del bot (Plan Premium)

Ver `database/DATABASE_README.md` para más detalles.

## 🎯 Estado Actual del Proyecto

### ✅ Completamente Funcional
- ✅ **Backend API**: Express + PostgreSQL funcionando
- ✅ **Frontend TypeScript**: React con tipos completos
- ✅ **Base de Datos**: Esquema completo con datos de ejemplo
- ✅ **Conexión Full-Stack**: Frontend ↔ Backend ↔ Database
- ✅ **Página Gestor**: Mostrando información real del complejo
- ✅ **Hot-reload**: Desarrollo ágil en ambos entornos

### � Endpoints API Disponibles
- `GET /` - Información general del servidor
- `GET /api/health` - Estado de salud y conexión a BD
- `GET /api/complejos` - Listar todos los complejos ✨
- `GET /api/complejos/:id` - Obtener complejo específico ✨

### � Interfaz Actual
- **Header**: Información completa del complejo desde BD
- **Área Principal**: Zona blanca lista para desarrollo
- **Responsive**: Optimizado para móvil y desktop
- **Loading States**: Spinners y manejo de errores

### 🚧 Próximas Implementaciones
- � API REST para gestión de reservas
- � Componentes TypeScript adicionales
- 🚧 Autenticación y autorización
- � Dashboard con métricas

## 🔍 Verificación del Sistema

### ✅ Cómo Saber que Todo Funciona

Después de ejecutar `npm run dev`, deberías ver:

```bash
# En la terminal:
[0] 🟢 Servidor Courtnex Manager corriendo en http://localhost:3000
[1] Compiled successfully!
[1] You can now view frontend in the browser.
[1]   Local: http://localhost:3001
```

### 🧪 Probar Manualmente

```bash
# 1. Verificar backend
curl http://localhost:3000/api/health
curl http://localhost:3000/api/complejos

# 2. Verificar base de datos  
psql -d courtnex_db -c "SELECT COUNT(*) FROM complejos;"

# 3. Verificar frontend
open http://localhost:3001
# Deberías ver la información del complejo en la parte superior
```

### 🚨 Solución de Problemas

```bash
# Puerto ocupado
npm run stop                           # Detener procesos
lsof -ti:3000,3001 | xargs kill -9    # Forzar detención

# Error de base de datos
pg_isready                             # Verificar PostgreSQL
brew services restart postgresql      # Reiniciar PostgreSQL (macOS)

# Error de dependencias
npm run install:all                    # Reinstalar dependencias
rm -rf node_modules && npm install    # Limpiar caché
```

## 🛠️ Tecnologías

### Backend
- Node.js + Express.js
- PostgreSQL con pg (node-postgres)
- CORS habilitado
- JWT (próximamente)
- Bcrypt (próximamente)
- Nodemon para desarrollo

### Frontend
- React 18 con TypeScript ✨
- Create React App
- CSS3 con diseño responsivo
- Axios para llamadas API (próximamente)
- Hooks y Context API

### Base de Datos
- PostgreSQL 12+
- Extensiones: uuid-ossp, pgcrypto
- Esquema completo con índices optimizados
- Triggers automáticos

## 🚀 Despliegue

### Desarrollo Local
Sigue las instrucciones de "Inicio Rápido" arriba.

### Producción
```bash
# Backend
cd backend
npm run build  # (cuando esté configurado)
npm start

# Frontend
cd frontend
npm run build
# Servir archivos estáticos con nginx o similar
```

## 🤝 Contribución

1. Fork del proyecto
2. Crear branch para feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 📞 Soporte

Para soporte y consultas:
- Email: soporte@courtnexmanager.com
- Issues: [GitHub Issues](https://github.com/tu-usuario/CourtnexManager/issues)

---

**CourtnexManager** - Sistema de gestión para complejos deportivos del futuro 🏆
