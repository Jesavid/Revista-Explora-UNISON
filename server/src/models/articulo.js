// Modelo Articulo
// idArticulo SERIAL PRIMARY KEY,
// autor VARCHAR NOT NULL,
// idUsuario INT NOT NULL,
// idNumero INT NOT NULL,
// titulo VARCHAR NOT NULL,
// resumen VARCHAR NOT NULL,
// documento BYTEA NOT NULL,
// noPaginas INT

const pool = require('./db');

const Articulo = {
  async create({ autor, idUsuario, idNumero, titulo, resumen, documento, noPaginas }) {
    // documento es el buffer del archivo PDF
    const result = await pool.query(
      'INSERT INTO articulo (autor, idusuario, idnumero, titulo, resumen, documento, nopaginas) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [autor, idUsuario, idNumero, titulo, resumen, documento, noPaginas]
    );
    return result.rows[0];
  },
  async findById(idArticulo) {
  const result = await pool.query('SELECT * FROM articulo WHERE idarticulo = $1', [idArticulo]);
    return result.rows[0];
  },
  async findAll() {
  const result = await pool.query('SELECT * FROM articulo');
    return result.rows;
  }
};

module.exports = Articulo;
