# ⚛️ CourtnexManager - Frontend

Interfaz de usuario desarrollada con React para el sistema de gestión de complejos deportivos.

## 📋 Características

- ⚛️ React 18 con Create React App
- 🎨 Interfaz moderna y responsiva
- 🔄 Comunicación con API REST
- 📱 Diseño mobile-first
- ⚡ Hot-reload en desarrollo
- 🏗️ Build optimizado para producción

## 🛠️ Tecnologías

- **Framework**: React 18
- **Bundler**: Create React App (Webpack)
- **Styling**: CSS3 / CSS Modules (por implementar)
- **HTTP Client**: Axios (por instalar)
- **State Management**: React Hooks / Context API
- **Testing**: Jest + React Testing Library

## 🚀 Instalación y Configuración

### 1. Instalar Dependencias

```bash
npm install
```

### 2. Configurar Variables de Entorno (Opcional)

Crear archivo `.env.local` para configuraciones locales:

```bash
# API Backend URL
REACT_APP_API_URL=http://localhost:3000
REACT_APP_API_TIMEOUT=5000
```

### 3. Iniciar Aplicación

```bash
# Modo desarrollo
npm start

# La aplicación estará disponible en http://localhost:3001
```

## 📡 Conexión con Backend

La aplicación React se conectará con el backend API:
- **Backend URL**: `http://localhost:3000`
- **Frontend URL**: `http://localhost:3001`
- **Proxy**: Configurado automáticamente por CRA

## 📂 Estructura de Archivos

```
frontend/
├── public/                # Archivos públicos
│   ├── index.html        # HTML principal
│   ├── favicon.ico       # Ícono del sitio
│   └── manifest.json     # Configuración PWA
├── src/                  # Código fuente
│   ├── components/       # Componentes reutilizables
│   ├── pages/           # Páginas/Vistas principales
│   ├── services/        # Servicios para API calls
│   ├── hooks/           # Custom hooks
│   ├── context/         # Context providers
│   ├── utils/           # Funciones utilitarias
│   ├── styles/          # Estilos globales
│   ├── App.js           # Componente principal
│   ├── App.css          # Estilos del App
│   ├── index.js         # Punto de entrada
│   └── index.css        # Estilos globales
├── package.json         # Dependencias y scripts
└── README.md           # Este archivo
```

## 🔧 Scripts NPM

```bash
# Iniciar desarrollo
npm start

# Construir para producción
npm run build

# Ejecutar tests
npm test

# Ejecutar tests en watch mode
npm run test:watch

# Eject configuración (⚠️ IRREVERSIBLE)
npm run eject
```

## 🎯 Funcionalidades por Implementar

### Autenticación y Seguridad
- [ ] Login/Logout de usuarios
- [ ] Gestión de roles y permisos
- [ ] Rutas protegidas
- [ ] Renovación automática de tokens

### Dashboard y Navegación
- [ ] Dashboard principal con métricas
- [ ] Menú de navegación responsivo
- [ ] Breadcrumbs
- [ ] Notificaciones en tiempo real

### Gestión de Reservas
- [ ] Calendario interactivo
- [ ] Formulario de nueva reserva
- [ ] Lista de reservas con filtros
- [ ] Estados de reserva (confirmada, cancelada, etc.)
- [ ] Reservas recurrentes

### Gestión de Canchas
- [ ] Lista de canchas con grid/lista
- [ ] Formulario CRUD de canchas
- [ ] Vista de disponibilidad
- [ ] Mapa interactivo (opcional)

### Gestión de Clientes
- [ ] Lista de clientes con búsqueda
- [ ] Formulario CRUD de clientes
- [ ] Historial de reservas por cliente
- [ ] Sistema de puntos/fidelización

### Gestión de Pagos
- [ ] Lista de pagos pendientes/realizados
- [ ] Integración con MercadoPago
- [ ] Generación de comprobantes
- [ ] Reportes de ingresos

## 🧪 Testing

### Configuración Incluida
- **Jest**: Framework de testing
- **React Testing Library**: Testing de componentes
- **@testing-library/jest-dom**: Matchers adicionales

```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests con coverage
npm test -- --coverage

# Ejecutar tests específicos
npm test -- --testPathPattern=components
```

## 🚀 Build y Despliegue

### Desarrollo Local
```bash
npm start
```

### Build de Producción
```bash
npm run build
```

Los archivos optimizados se generarán en la carpeta `build/`

## 📱 Responsive Design

La aplicación será totalmente responsive:
- 📱 **Mobile**: 320px - 768px
- 📱 **Tablet**: 768px - 1024px
- 💻 **Desktop**: 1024px+

## 🐛 Troubleshooting

### Error de CORS
Si hay problemas de CORS con el backend:
```javascript
// En package.json, agregar:
"proxy": "http://localhost:3000"
```

### Puerto en Uso
```bash
# Cambiar puerto por defecto
PORT=3002 npm start
```

### Build Fails
```bash
# Limpiar node_modules y reinstalar
rm -rf node_modules package-lock.json
npm install
```

## 📞 Soporte

Para problemas específicos del frontend, crear un issue con:
- Versión de Node.js y npm
- Browser y versión
- Logs de error completos
- Pasos para reproducir

---

Desarrollado con ⚛️ y ❤️ para CourtnexManager
