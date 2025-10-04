/**
 * @fileoverview Modelo Volumen - Manejo de volúmenes de revistas
 * @description Modelo para operaciones de volúmenes organizados por año
 * 
 * Estructura de la tabla:
 * - idVolumen SERIAL PRIMARY KEY,
 * - anio INT NOT NULL
 */

const pool = require('./db');

const Volumen = {
  /**
   * Busca un volumen existente por año o lo crea si no existe
   * @param {number} anio - Año del volumen
   * @returns {Promise<Object>} Volumen encontrado o creado
   * @throws {Error} Error de base de datos si falla la consulta o inserción
   */
  async findOrCreate(anio) {
    let result = await pool.query('SELECT * FROM volumen WHERE anio = $1', [anio]);
    if (result.rows.length > 0) return result.rows[0];
    result = await pool.query('INSERT INTO volumen (anio) VALUES ($1) RETURNING *', [anio]);
    return result.rows[0];
  },
  
  /**
   * Obtiene todos los volúmenes ordenados por año descendente
   * @returns {Promise<Array>} Array con todos los volúmenes ordenados del más reciente al más antiguo
   * @throws {Error} Error de base de datos si falla la consulta
   */
  async getAll() {
    const result = await pool.query('SELECT * FROM volumen ORDER BY anio DESC');
    return result.rows;
  }
};

module.exports = Volumen;
