/**
 * @fileoverview Modelo Autor - Manejo de datos de autores
 * @description Modelo para operaciones CRUD de autores en la base de datos
 * 
 * Estructura de la tabla:
 * - idAutor SERIAL PRIMARY KEY,
 * - nombre VARCHAR NOT NULL
 */

const pool = require('./db');

const Autor = {
  /**
   * Crea un nuevo autor en la base de datos
   * @param {Object} autorData - Datos del autor a crear
   * @param {string} autorData.nombre - Nombre del autor
   * @returns {Promise<Object>} Autor creado con su ID generado
   * @throws {Error} Error de base de datos si falla la inserción
   */
  async create({ nombre }) {
    const result = await pool.query(
      'INSERT INTO autor (nombre) VALUES ($1) RETURNING *',
      [nombre]
    );
    return result.rows[0];
  },
  
  /**
   * Busca un autor por su ID
   * @param {number} idAutor - ID del autor a buscar
   * @returns {Promise<Object|undefined>} Autor encontrado o undefined si no existe
   * @throws {Error} Error de base de datos si falla la consulta
   */
  async findById(idAutor) {
    const result = await pool.query('SELECT * FROM autor WHERE idautor = $1', [idAutor]);
    return result.rows[0];
  },
  
  /**
   * Obtiene todos los autores de la base de datos
   * @returns {Promise<Array>} Array con todos los autores
   * @throws {Error} Error de base de datos si falla la consulta
   */
  async findAll() {
    const result = await pool.query('SELECT * FROM autor');
    return result.rows;
  }
};

module.exports = Autor;
