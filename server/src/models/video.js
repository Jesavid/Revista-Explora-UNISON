/**
 * @fileoverview Modelo Video - Manejo de datos de videos
 * @description Modelo para operaciones CRUD de videos en la base de datos
 * 
 * Estructura de la tabla:
 * - idVideo SERIAL PRIMARY KEY,
 * - idUsuario INT NOT NULL,
 * - titulo VARCHAR NOT NULL,
 * - resumen VARCHAR NOT NULL,
 * - ruta VARCHAR NOT NULL
 */

const pool = require('./db');

const Video = {
  /**
   * Crea un nuevo video en la base de datos
   * @param {Object} videoData - Datos del video a crear
   * @param {number} videoData.idUsuario - ID del usuario que crea el video
   * @param {string} videoData.titulo - Título del video
   * @param {string} videoData.resumen - Resumen del video
   * @param {string} videoData.ruta - Ruta del archivo de video
   * @returns {Promise<Object>} Video creado con su ID generado
   * @throws {Error} Error de base de datos si falla la inserción
   */
  async create({ idUsuario, titulo, resumen, ruta }) {
    const result = await pool.query(
      'INSERT INTO video (idusuario, titulo, resumen, ruta) VALUES ($1, $2, $3, $4) RETURNING *',
      [idUsuario, titulo, resumen, ruta]
    );
    return result.rows[0];
  },
  
  /**
   * Busca un video por su ID
   * @param {number} idVideo - ID del video a buscar
   * @returns {Promise<Object|undefined>} Video encontrado o undefined si no existe
   * @throws {Error} Error de base de datos si falla la consulta
   */
  async findById(idVideo) {
    const result = await pool.query('SELECT * FROM video WHERE idvideo = $1', [idVideo]);
    return result.rows[0];
  },
  
  /**
   * Obtiene todos los videos de la base de datos
   * @returns {Promise<Array>} Array con todos los videos
   * @throws {Error} Error de base de datos si falla la consulta
   */
  /**
   * Obtiene todos los videos de la base de datos
   * @returns {Promise<Array>} Array con todos los videos
   * @throws {Error} Error de base de datos si falla la consulta
   */
  async findAll() {
    const result = await pool.query('SELECT * FROM video');
    return result.rows;
  },
  
  /**
   * Elimina un video por su ID
   * @param {number} idVideo - ID del video a eliminar
   * @returns {Promise<boolean>} true si se eliminó exitosamente, false si no se encontró
   * @throws {Error} Error de base de datos si falla la operación
   */
  async delete(idVideo) {
    console.log('[VIDEO MODEL] Eliminando video ID:', idVideo);
    
    const result = await pool.query(
      'DELETE FROM video WHERE idvideo = $1 RETURNING idvideo',
      [idVideo]
    );
    
    console.log('[VIDEO MODEL] Resultado DELETE:', result.rows.length > 0 ? 'Eliminado' : 'No encontrado');
    return result.rows.length > 0;
  }
};

module.exports = Video;
