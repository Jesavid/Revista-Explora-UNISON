// Modelo Video
// idVideo SERIAL PRIMARY KEY,
// idUsuario INT NOT NULL,
// titulo VARCHAR NOT NULL,
// resumen VARCHAR NOT NULL,
// imagen VARCHAR NOT NULL

const pool = require('./db');

const Video = {
  async create({ idUsuario, titulo, resumen, imagen }) {
    const result = await pool.query(
      'INSERT INTO video (idusuario, titulo, resumen, imagen) VALUES ($1, $2, $3, $4) RETURNING *',
      [idUsuario, titulo, resumen, imagen]
    );
    return result.rows[0];
  },
  async findById(idVideo) {
  const result = await pool.query('SELECT * FROM video WHERE idvideo = $1', [idVideo]);
    return result.rows[0];
  },
  async findAll() {
  const result = await pool.query('SELECT * FROM video');
    return result.rows;
  }
};

module.exports = Video;
