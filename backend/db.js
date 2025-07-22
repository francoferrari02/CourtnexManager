const { Pool } = require('pg');
require('dotenv').config();

// Configuración de la conexión a PostgreSQL
const poolConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'courtnex_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  max: 20, // Número máximo de conexiones en el pool
  idleTimeoutMillis: 30000, // Tiempo antes de cerrar conexiones inactivas
  connectionTimeoutMillis: 2000, // Tiempo límite para establecer conexión
};

// Crear el pool de conexiones
const pool = new Pool(poolConfig);

// Manejar eventos del pool
pool.on('connect', (client) => {
  console.log('🟢 Nueva conexión establecida con la base de datos');
});

pool.on('error', (err, client) => {
  console.error('🔴 Error inesperado en cliente de base de datos', err);
  process.exit(-1);
});

// Función para probar la conexión
const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('🟢 Conexión a PostgreSQL establecida correctamente');
    
    // Probar una consulta simple
    const result = await client.query('SELECT NOW() as current_time, version() as postgres_version');
    console.log('📊 Información de la base de datos:');
    console.log(`   Hora actual: ${result.rows[0].current_time}`);
    console.log(`   Versión PostgreSQL: ${result.rows[0].postgres_version.split(' ')[0]} ${result.rows[0].postgres_version.split(' ')[1]}`);
    
    client.release();
    return true;
  } catch (error) {
    console.error('🔴 Error al conectar con PostgreSQL:', error.message);
    return false;
  }
};

// Función helper para ejecutar consultas
const query = async (text, params) => {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`📝 Query ejecutada en ${duration}ms:`, text.substring(0, 100) + '...');
    }
    
    return result;
  } catch (error) {
    console.error('🔴 Error en consulta:', error.message);
    console.error('📝 Query:', text);
    throw error;
  }
};

// Función para obtener un cliente del pool (para transacciones)
const getClient = async () => {
  try {
    const client = await pool.connect();
    return client;
  } catch (error) {
    console.error('🔴 Error al obtener cliente del pool:', error.message);
    throw error;
  }
};

// Función para ejecutar transacciones
const transaction = async (callback) => {
  const client = await getClient();
  
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('🔴 Error en transacción, rollback ejecutado:', error.message);
    throw error;
  } finally {
    client.release();
  }
};

// Función para cerrar todas las conexiones (para shutdown graceful)
const closePool = async () => {
  try {
    await pool.end();
    console.log('🟡 Pool de conexiones cerrado correctamente');
  } catch (error) {
    console.error('🔴 Error al cerrar pool de conexiones:', error.message);
  }
};

// Funciones de utilidad para consultas comunes
const dbUtils = {
  // Buscar por ID
  findById: async (table, id, columns = '*') => {
    const result = await query(`SELECT ${columns} FROM ${table} WHERE id = $1`, [id]);
    return result.rows[0] || null;
  },

  // Buscar con condiciones
  findWhere: async (table, conditions, columns = '*') => {
    const keys = Object.keys(conditions);
    const values = Object.values(conditions);
    const whereClause = keys.map((key, index) => `${key} = $${index + 1}`).join(' AND ');
    
    const result = await query(`SELECT ${columns} FROM ${table} WHERE ${whereClause}`, values);
    return result.rows;
  },

  // Insertar registro
  insert: async (table, data) => {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = values.map((_, index) => `$${index + 1}`).join(', ');
    const columns = keys.join(', ');
    
    const result = await query(
      `INSERT INTO ${table} (${columns}) VALUES (${placeholders}) RETURNING *`,
      values
    );
    return result.rows[0];
  },

  // Actualizar registro
  update: async (table, id, data) => {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const setClause = keys.map((key, index) => `${key} = $${index + 2}`).join(', ');
    
    const result = await query(
      `UPDATE ${table} SET ${setClause} WHERE id = $1 RETURNING *`,
      [id, ...values]
    );
    return result.rows[0];
  },

  // Eliminar registro (soft delete si existe campo 'activo')
  delete: async (table, id) => {
    // Primero verificar si la tabla tiene campo 'activo' para soft delete
    try {
      const result = await query(
        `UPDATE ${table} SET activo = false WHERE id = $1 RETURNING *`,
        [id]
      );
      return result.rows[0];
    } catch (error) {
      // Si no tiene campo 'activo', hacer delete físico
      const result = await query(`DELETE FROM ${table} WHERE id = $1 RETURNING *`, [id]);
      return result.rows[0];
    }
  },

  // Paginación
  paginate: async (table, page = 1, limit = 10, conditions = {}, orderBy = 'created_at DESC') => {
    const offset = (page - 1) * limit;
    const keys = Object.keys(conditions);
    const values = Object.values(conditions);
    
    let whereClause = '';
    if (keys.length > 0) {
      whereClause = 'WHERE ' + keys.map((key, index) => `${key} = $${index + 1}`).join(' AND ');
    }
    
    const countResult = await query(`SELECT COUNT(*) FROM ${table} ${whereClause}`, values);
    const total = parseInt(countResult.rows[0].count);
    
    const dataResult = await query(
      `SELECT * FROM ${table} ${whereClause} ORDER BY ${orderBy} LIMIT $${values.length + 1} OFFSET $${values.length + 2}`,
      [...values, limit, offset]
    );
    
    return {
      data: dataResult.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    };
  }
};

module.exports = {
  pool,
  query,
  getClient,
  transaction,
  testConnection,
  closePool,
  dbUtils
};
