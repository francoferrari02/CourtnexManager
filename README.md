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

### Prerrequisitos

- Node.js (v16 o superior)
- PostgreSQL (v12 o superior)
- npm o yarn

### 1. Configurar Base de Datos

```bash
# Crear base de datos PostgreSQL
createdb courtnex_db

# Ejecutar esquema de base de datos
psql -d courtnex_db -f database/database_schema.sql
```

### 2. Configurar Backend

```bash
# Navegar a la carpeta backend
cd backend

# Instalar dependencias
npm install

# Copiar archivo de variables de entorno
cp ../.env.example .env

# Editar .env con tus credenciales de base de datos
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=courtnex_db
# DB_USER=tu_usuario
# DB_PASSWORD=tu_contraseña
# PORT=3000

# Iniciar servidor en modo desarrollo
npm run dev
```

El servidor estará disponible en: `http://localhost:3000`

### 3. Configurar Frontend

```bash
# Abrir nueva terminal y navegar a la carpeta frontend
cd frontend

# Instalar dependencias (ya están instaladas por create-react-app)
npm install

# Iniciar aplicación React en modo desarrollo
npm start
```

La aplicación estará disponible en: `http://localhost:3001`

## 📊 Scripts Disponibles

### Backend

```bash
cd backend

# Iniciar servidor
npm start

# Desarrollo con recarga automática
npm run dev

# Ejecutar tests
npm test
```

### Frontend

```bash
cd frontend

# Iniciar desarrollo
npm start

# Construir para producción
npm run build

# Ejecutar tests
npm test

# Eject configuración (irreversible)
npm run eject
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

## 🎯 Funcionalidades Principales

### ✅ Implementadas
- ✅ Esquema de base de datos completo
- ✅ Servidor Express básico
- ✅ Conexión a PostgreSQL
- ✅ Endpoints de salud
- ✅ Proyecto React inicial

### 🚧 En Desarrollo
- 🚧 API REST para gestión de reservas
- 🚧 Interfaz de usuario React
- 🚧 Autenticación y autorización
- 🚧 Dashboard de administración

### 📋 Planificadas
- 📋 Sistema de pagos (MercadoPago)
- 📋 Bot de WhatsApp (Plan Premium)
- 📋 Gestión de torneos
- 📋 Reportes y analíticas
- 📋 App móvil

## 🔍 Endpoints API

### Salud del Sistema
- `GET /` - Información general del servidor
- `GET /api/health` - Estado de salud y conexión a BD

### Próximos Endpoints
- `POST /api/auth/login` - Autenticación
- `GET /api/complejos` - Listar complejos
- `GET /api/canchas` - Listar canchas
- `POST /api/reservas` - Crear reserva
- `GET /api/reservas` - Listar reservas
- Y muchos más...

## 🛠️ Tecnologías

### Backend
- Node.js
- Express.js
- PostgreSQL
- JWT (próximamente)
- Bcrypt (próximamente)

### Frontend
- React 18
- Create React App
- CSS Modules / Styled Components (por definir)
- Axios (para llamadas API)

### Base de Datos
- PostgreSQL 12+
- Extensiones: uuid-ossp, pgcrypto

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
