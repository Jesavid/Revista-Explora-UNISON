// Modelo Noticia
// idNoticia SERIAL PRIMARY KEY,
// idUsuario INT NOT NULL,
// titulo VARCHAR NOT NULL,
// resumen VARCHAR NOT NULL,
// foto BYTEA,
// contenido TEXT NOT NULL,
// fechaNoticia DATE NOT NULL

const pool = require('./db');

const Noticia = {
  async create({ idUsuario, autor, titulo, resumen, foto, contenido, fechaNoticia }) {
    // foto es el nombre del archivo guardado
    // Guardar fecha solo como YYYY-MM-DD
    const fecha = fechaNoticia ? fechaNoticia.substring(0, 10) : null;
    const result = await pool.query(
      'INSERT INTO noticia (idusuario, autor, titulo, resumen, foto, contenido, fechanoticia) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [idUsuario, autor, titulo, resumen, foto, contenido, fecha]
    );
    return result.rows[0];
  },
  async findById(idNoticia) {
  const result = await pool.query('SELECT * FROM noticia WHERE idnoticia = $1', [idNoticia]);
    return result.rows[0];
  },
  async findAll() {
  const result = await pool.query('SELECT * FROM noticia');
    return result.rows;
  }
};

module.exports = Noticia;
