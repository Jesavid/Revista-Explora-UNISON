// Modelo Autor
// idAutor SERIAL PRIMARY KEY,
// nombre VARCHAR NOT NULL

const pool = require('./db');

const Autor = {
  async create({ nombre }) {
    const result = await pool.query(
      'INSERT INTO autor (nombre) VALUES ($1) RETURNING *',
      [nombre]
    );
    return result.rows[0];
  },
  async findById(idAutor) {
  const result = await pool.query('SELECT * FROM autor WHERE idautor = $1', [idAutor]);
    return result.rows[0];
  },
  async findAll() {
  const result = await pool.query('SELECT * FROM autor');
    return result.rows;
  }
};

module.exports = Autor;
