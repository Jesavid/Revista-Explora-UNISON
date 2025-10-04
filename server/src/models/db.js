/**
 * CONFIGURACIÓN DE BASE DE DATOS POSTGRESQL
 * 
 * Conexión a PostgreSQL usando connection pool para optimizar rendimiento
 * Compatible con Railway PostgreSQL y desarrollo local
 * 
 * Variables de entorno requeridas:
 * - DATABASE_URL: URL completa de conexión a PostgreSQL
 * - NODE_ENV: Entorno de ejecución (development/production)
 */

const { Pool } = require('pg');
require('dotenv').config();

// Logging de configuración para debugging
console.log('Database config:');
console.log('- DATABASE_URL exists:', !!process.env.DATABASE_URL);
console.log('- NODE_ENV:', process.env.NODE_ENV);

/**
 * Pool de conexiones a PostgreSQL
 * 
 * Configuración:
 * - connectionString: URL de la base de datos desde variable de entorno
 * - ssl: Habilitado en producción (Railway requiere SSL), deshabilitado en desarrollo
 */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

/**
 * Test de conexión inicial al arrancar el servidor
 * Ayuda a identificar problemas de conectividad temprano
 */
pool.connect()
  .then(() => console.log('✓ Conexión a PostgreSQL exitosa'))
  .catch(err => console.error('✗ Error conectando a PostgreSQL:', err.message));

module.exports = pool;