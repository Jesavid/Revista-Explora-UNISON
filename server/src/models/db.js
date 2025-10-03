const { Pool } = require('pg');
require('dotenv').config();

console.log('Database config:');
console.log('- DATABASE_URL exists:', !!process.env.DATABASE_URL);
console.log('- NODE_ENV:', process.env.NODE_ENV);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Test conexión al arrancar
pool.connect()
  .then(() => console.log('✓ Conexión a PostgreSQL exitosa'))
  .catch(err => console.error('✗ Error conectando a PostgreSQL:', err.message));

module.exports = pool;