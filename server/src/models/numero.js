const pool = require('./db');

const Numero = {
  async findOrCreate({ idVolumen, numero }) {
    let result = await pool.query('SELECT * FROM numero WHERE idvolumen = $1 AND numero = $2', [idVolumen, numero]);
    if (result.rows.length > 0) return result.rows[0];
    result = await pool.query('INSERT INTO numero (idvolumen, numero) VALUES ($1, $2) RETURNING *', [idVolumen, numero]);
    return result.rows[0];
  },
  async getAllByVolumen(idVolumen) {
    const result = await pool.query('SELECT * FROM numero WHERE idvolumen = $1 ORDER BY numero', [idVolumen]);
    return result.rows;
  }
};

module.exports = Numero;
