const pool = require('./db');

const Articulo = {
  async create({ autor, idUsuario, idNumero, titulo, resumen, documento, noPaginas, fecha }) {
    // documento es el buffer del archivo PDF
    let fechaFinal = fecha ? fecha.substring(0, 10) : null;
    console.log('[ARTICULO MODEL] Insertando articulo con fecha:', fechaFinal, 'original:', fecha);
    const result = await pool.query(
      'INSERT INTO articulo (autor, idusuario, idnumero, titulo, resumen, documento, nopaginas, fecha) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [autor, idUsuario, idNumero, titulo, resumen, documento, noPaginas, fechaFinal]
    );
    console.log('[ARTICULO MODEL] Resultado INSERT:', result.rows[0]);
    return result.rows[0];
  },
  async update({ idArticulo, autor, idUsuario, idNumero, titulo, resumen, documento, noPaginas, fecha }) {
    // Solo actualiza los campos enviados (incluyendo fecha)
    let fechaFinal = fecha ? fecha.substring(0, 10) : null;
    const result = await pool.query(
      `UPDATE articulo SET autor = $1, idusuario = $2, idnumero = $3, titulo = $4, resumen = $5, documento = COALESCE($6, documento), nopaginas = $7, fecha = $8 WHERE idarticulo = $9 RETURNING *`,
      [autor, idUsuario, idNumero, titulo, resumen, documento, noPaginas, fechaFinal, idArticulo]
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
