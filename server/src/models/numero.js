/**
 * @fileoverview Modelo Numero - Manejo de números de revistas
 * @description Modelo para operaciones de números asociados a volúmenes de revistas
 * 
 * Estructura de la tabla:
 * - idNumero SERIAL PRIMARY KEY,
 * - idVolumen INT NOT NULL,
 * - numero INT NOT NULL
 */

const pool = require('./db');

const Numero = {
  /**
   * Busca un número existente o lo crea si no existe
   * @param {Object} numeroData - Datos del número
   * @param {number} numeroData.idVolumen - ID del volumen al que pertenece
   * @param {number} numeroData.numero - Número de la revista
   * @returns {Promise<Object>} Número encontrado o creado
   * @throws {Error} Error de base de datos si falla la consulta o inserción
   */
  async findOrCreate({ idVolumen, numero }) {
    let result = await pool.query('SELECT * FROM numero WHERE idvolumen = $1 AND numero = $2', [idVolumen, numero]);
    if (result.rows.length > 0) return result.rows[0];
    result = await pool.query('INSERT INTO numero (idvolumen, numero) VALUES ($1, $2) RETURNING *', [idVolumen, numero]);
    return result.rows[0];
  },
  
  /**
   * Obtiene todos los números de un volumen específico
   * @param {number} idVolumen - ID del volumen
   * @returns {Promise<Array>} Array con todos los números del volumen ordenados por número
   * @throws {Error} Error de base de datos si falla la consulta
   */
  async getAllByVolumen(idVolumen) {
    const result = await pool.query('SELECT * FROM numero WHERE idvolumen = $1 ORDER BY numero', [idVolumen]);
    return result.rows;
  }
};

module.exports = Numero;
