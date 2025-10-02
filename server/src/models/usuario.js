// Modelo Usuario
// idUsuario SERIAL PRIMARY KEY,
// username VARCHAR NOT NULL,
// password VARCHAR NOT NULL,
// nombre VARCHAR NOT NULL,
// apellido VARCHAR NOT NULL,
// correo VARCHAR NOT NULL

const pool = require('./db');

const Usuario = {
  async create({ username, password, nombre, apellido, correo }) {
    const result = await pool.query(
      'INSERT INTO usuario (username, password, nombre, apellido, correo) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [username, password, nombre, apellido, correo]
    );
    return result.rows[0];
  },
  async findByUsername(username) {
  const result = await pool.query('SELECT * FROM usuario WHERE username = $1', [username]);
    return result.rows[0];
  },
  async findById(idUsuario) {
  const result = await pool.query('SELECT * FROM usuario WHERE idusuario = $1', [idUsuario]);
    return result.rows[0];
  }
};

module.exports = Usuario;
