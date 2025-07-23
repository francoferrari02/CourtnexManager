const express = require('express');
const { testConnection, closePool, query } = require('./db');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware para CORS (permitir peticiones desde el frontend)
app.use(cors({
  origin: ['http://localhost:3001', 'http://localhost:3000'],
  credentials: true
}));

// Middleware para parsing JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware para logging básico
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
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

// Endpoint para obtener todos los complejos
app.get('/api/complejos', async (req, res) => {
  try {
    const result = await query(`
      SELECT 
        id,
        nombre,
        direccion,
        telefono,
        email,
        horario_apertura,
        horario_cierre,
        plan_suscripcion,
        activo,
        created_at,
        updated_at
      FROM complejos 
      ORDER BY created_at DESC
    `);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener complejos:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudieron obtener los complejos',
      timestamp: new Date().toISOString()
    });
  }
});

// Endpoint para obtener un complejo específico por ID
app.get('/api/complejos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query(`
      SELECT 
        id,
        nombre,
        direccion,
        telefono,
        email,
        horario_apertura,
        horario_cierre,
        plan_suscripcion,
        activo,
        created_at,
        updated_at
      FROM complejos 
      WHERE id = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'No encontrado',
        message: 'El complejo especificado no existe'
      });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al obtener complejo:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudo obtener el complejo',
      timestamp: new Date().toISOString()
    });
  }
});

// ============================================
// ENDPOINTS DE CANCHAS
// ============================================

// Endpoint para obtener todas las canchas de un complejo
app.get('/api/complejos/:complejo_id/canchas', async (req, res) => {
  try {
    const { complejo_id } = req.params;
    const result = await query(`
      SELECT 
        id,
        complejo_id,
        nombre,
        tipo_deporte,
        dimensiones,
        capacidad_jugadores,
        precio_hora,
        coordenadas_mapa,
        equipamiento_incluido,
        estado,
        iluminacion,
        techada,
        descripcion,
        fotos,
        activa,
        created_at,
        updated_at
      FROM canchas 
      WHERE complejo_id = $1 AND activa = true
      ORDER BY nombre ASC
    `, [complejo_id]);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener canchas:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudieron obtener las canchas',
      timestamp: new Date().toISOString()
    });
  }
});

// Endpoint para crear una nueva cancha
app.post('/api/complejos/:complejo_id/canchas', async (req, res) => {
  try {
    const { complejo_id } = req.params;
    const {
      nombre,
      tipo,
      ancho,
      largo,
      superficie,
      iluminacion = false,
      techada = false,
      precio_hora,
      activa = true,
      observaciones
    } = req.body;

    // Validaciones básicas
    if (!nombre || !tipo || !ancho || !largo || precio_hora === undefined) {
      return res.status(400).json({
        error: 'Datos incompletos',
        message: 'Nombre, tipo, dimensiones y precio son obligatorios'
      });
    }

    // Preparar datos para insertar
    const dimensiones = {
      largo: parseFloat(largo),
      ancho: parseFloat(ancho),
      unidad: 'metros',
      superficie: superficie
    };

    const equipamiento = []; // Por ahora vacío, se puede expandir

    const result = await query(`
      INSERT INTO canchas (
        complejo_id,
        nombre,
        tipo_deporte,
        dimensiones,
        capacidad_jugadores,
        precio_hora,
        iluminacion,
        techada,
        descripcion,
        equipamiento_incluido,
        activa
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `, [
      complejo_id,
      nombre,
      tipo,
      JSON.stringify(dimensiones),
      4, // capacidad por defecto
      parseFloat(precio_hora),
      iluminacion,
      techada,
      observaciones || null,
      JSON.stringify(equipamiento),
      activa
    ]);

    res.status(201).json({
      message: 'Cancha creada exitosamente',
      cancha: result.rows[0]
    });

  } catch (error) {
    console.error('Error al crear cancha:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No se pudo crear la cancha',
      timestamp: new Date().toISOString()
    });
  }
});

