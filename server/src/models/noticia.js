/**
 * MODELO DE NOTICIAS
 * 
 * Modelo para la gestión de noticias en la base de datos PostgreSQL
 * Maneja todas las operaciones CRUD para la tabla 'noticia'
 * 
 * Estructura de la tabla:
 * - idnoticia: SERIAL PRIMARY KEY
 * - idusuario: INT NOT NULL (FK a usuarios)
 * - autor: VARCHAR - Nombre del autor de la noticia
 * - titulo: VARCHAR NOT NULL - Título de la noticia
 * - resumen: VARCHAR - Resumen o descripción breve
 * - foto: BYTEA - Imagen de portada en formato binario
 * - contenido: TEXT NOT NULL - Contenido completo de la noticia
 * - fechanoticia: DATE NOT NULL - Fecha de publicación
 */

const pool = require('./db');

const Noticia = {
  /**
   * Crear nueva noticia en la base de datos
   * 
   * @param {Object} data - Datos de la noticia
   * @param {number} data.idUsuario - ID del usuario creador
   * @param {string} data.autor - Nombre del autor
   * @param {string} data.titulo - Título de la noticia
   * @param {string} data.resumen - Resumen breve
   * @param {Buffer} data.foto - Imagen en formato Buffer (opcional)
   * @param {string} data.contenido - Contenido completo
   * @param {string} data.fechaNoticia - Fecha en formato ISO
   * @returns {Object} Noticia creada con ID asignado
   */
  async create({ idUsuario, autor, titulo, resumen, foto, contenido, fechaNoticia }) {
    // foto es el nombre del archivo guardado
    // Guardar fecha solo como YYYY-MM-DD
    const fecha = fechaNoticia ? fechaNoticia.substring(0, 10) : null;
    console.log('[NOTICIA MODEL] Insertando noticia con fecha:', fecha, 'original:', fechaNoticia);
    const result = await pool.query(
      'INSERT INTO noticia (idusuario, autor, titulo, resumen, foto, contenido, fechanoticia) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [idUsuario, autor, titulo, resumen, foto, contenido, fecha]
    );
    console.log('[NOTICIA MODEL] Resultado INSERT:', result.rows[0]);
    return result.rows[0];
  },
  
  /**
   * Buscar una noticia por su ID
   * 
   * @param {number} idNoticia - ID de la noticia a buscar
   * @returns {Object|undefined} Noticia encontrada o undefined si no existe
   */
  async findById(idNoticia) {
    const result = await pool.query('SELECT * FROM noticia WHERE idnoticia = $1', [idNoticia]);
    return result.rows[0];
  },
  
  /**
   * Obtener todas las noticias
   * 
   * @returns {Array} Lista de todas las noticias ordenadas por fecha (más recientes primero)
   */
  async findAll() {
    const result = await pool.query('SELECT * FROM noticia ORDER BY fechanoticia DESC');
    return result.rows;
  },
  
  /**
   * Actualizar una noticia existente
   * 
   * @param {number} idNoticia - ID de la noticia a actualizar
   * @param {Object} data - Datos a actualizar
   * @param {number} data.idUsuario - ID del usuario editor
   * @param {string} data.autor - Nombre del autor
   * @param {string} data.titulo - Título actualizado
   * @param {string} data.resumen - Resumen actualizado
   * @param {Buffer} data.foto - Nueva imagen (opcional, mantiene existente si no se proporciona)
   * @param {string} data.contenido - Contenido actualizado
   * @param {string} data.fechaNoticia - Nueva fecha
   * @returns {Object} Noticia actualizada
   */
  async update(idNoticia, { idUsuario, autor, titulo, resumen, foto, contenido, fechaNoticia }) {
    const fecha = fechaNoticia ? fechaNoticia.substring(0, 10) : null;
    console.log('[NOTICIA MODEL] Actualizando noticia ID:', idNoticia, 'con fecha:', fecha);
    
    const result = await pool.query(
      `UPDATE noticia 
       SET idusuario = $1, autor = $2, titulo = $3, resumen = $4, foto = $5, contenido = $6, fechanoticia = $7 
       WHERE idnoticia = $8 
       RETURNING *`,
      [idUsuario, autor, titulo, resumen, foto, contenido, fecha, idNoticia]
    );
    
    console.log('[NOTICIA MODEL] Resultado UPDATE:', result.rows[0]);
    return result.rows[0];
  },
  
  /**
   * Eliminar una noticia de la base de datos
   * 
   * @param {number} idNoticia - ID de la noticia a eliminar
   * @returns {boolean} true si se eliminó exitosamente, false si no se encontró
   */
  async delete(idNoticia) {
    console.log('[NOTICIA MODEL] Eliminando noticia ID:', idNoticia);
    
    const result = await pool.query(
      'DELETE FROM noticia WHERE idnoticia = $1 RETURNING idnoticia',
      [idNoticia]
    );
    
    console.log('[NOTICIA MODEL] Resultado DELETE:', result.rows.length > 0 ? 'Eliminado' : 'No encontrado');
    return result.rows.length > 0;
  }
};

module.exports = Noticia;
