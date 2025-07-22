const express = require('express');
const { testConnection, closePool } = require('./db');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware para parsing JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware para logging básico
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

app.get('/', (req, res) => {
  res.json({
    message: '¡Bienvenido a Courtnex Manager!',
    version: '1.0.0',
    status: 'Servidor funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// Endpoint para verificar el estado de la base de datos
app.get('/api/health', async (req, res) => {
  try {
    const dbConnected = await testConnection();
    res.json({
      status: 'OK',
      database: dbConnected ? 'Conectada' : 'Desconectada',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      message: 'Error al verificar la conexión con la base de datos',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Función para iniciar el servidor
const startServer = async () => {
  try {
    // Probar conexión a la base de datos al iniciar
    console.log('🚀 Iniciando Courtnex Manager...');
    console.log('📊 Probando conexión a la base de datos...');
    
    const dbConnected = await testConnection();
    if (!dbConnected) {
      console.warn('⚠️  Advertencia: No se pudo conectar a la base de datos, pero el servidor continuará');
    }
    
    app.listen(port, () => {
      console.log(`🟢 Servidor Courtnex Manager corriendo en http://localhost:${port}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 Health check: http://localhost:${port}/api/health`);
    });
  } catch (error) {
    console.error('🔴 Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

// Manejo de cierre graceful
process.on('SIGINT', async () => {
  console.log('\n🟡 Recibida señal SIGINT, cerrando servidor...');
  await closePool();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🟡 Recibida señal SIGTERM, cerrando servidor...');
  await closePool();
  process.exit(0);
});

// Iniciar el servidor
startServer();