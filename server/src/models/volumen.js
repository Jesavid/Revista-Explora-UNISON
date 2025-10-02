const pool = require('./db');

const Volumen = {
  async findOrCreate(anio) {
    let result = await pool.query('SELECT * FROM volumen WHERE anio = $1', [anio]);
    if (result.rows.length > 0) return result.rows[0];
    result = await pool.query('INSERT INTO volumen (anio) VALUES ($1) RETURNING *', [anio]);
    return result.rows[0];
  },
  async getAll() {
    const result = await pool.query('SELECT * FROM volumen ORDER BY anio DESC');
    return result.rows;
  }
};

module.exports = Volumen;
