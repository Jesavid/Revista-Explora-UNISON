const pool = require('./db');

const Articulo = {
  async create({ autor, idUsuario, idNumero, titulo, resumen, documento, noPaginas, fecha }) {
    // documento es el buffer del archivo PDF
    let fechaFinal = fecha ? fecha.substring(0, 10) : null;
    console.log('[ARTICULO MODEL] === INSERTANDO ARTÍCULO ===');
    console.log('[ARTICULO MODEL] Parámetros recibidos:', {
      autor,
      idUsuario,
      idNumero,
      titulo,
      resumen: resumen ? resumen.substring(0, 100) + '...' : null,
      documento: documento ? `Buffer (${documento.length} bytes)` : null,
      noPaginas,
      fechaOriginal: fecha,
      fechaFinal
    });
    
    try {
      const result = await pool.query(
        'INSERT INTO articulo (autor, idusuario, idnumero, titulo, resumen, documento, nopaginas, fecha) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
        [autor, idUsuario, idNumero, titulo, resumen, documento, noPaginas, fechaFinal]
      );
      console.log('[ARTICULO MODEL] === INSERT EXITOSO ===');
      console.log('[ARTICULO MODEL] Artículo insertado con ID:', result.rows[0].idarticulo);
      return result.rows[0];
    } catch (dbError) {
      console.error('[ARTICULO MODEL] === ERROR EN BASE DE DATOS ===');
      console.error('[ARTICULO MODEL] Error completo:', dbError);
      console.error('[ARTICULO MODEL] Código de error:', dbError.code);
      console.error('[ARTICULO MODEL] Detalle:', dbError.detail);
      throw dbError;
    }
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
  
  /**
   * Busca un artículo por su ID
   * @param {number} idArticulo - ID del artículo a buscar
   * @returns {Promise<Object|undefined>} Artículo encontrado o undefined si no existe
   * @throws {Error} Error de base de datos si falla la consulta
   */
  async findById(idArticulo) {
    const result = await pool.query('SELECT * FROM articulo WHERE idarticulo = $1', [idArticulo]);
    return result.rows[0];
  },
  
  /**
   * Obtiene todos los artículos
   * @returns {Promise<Array>} Array con todos los artículos
   * @throws {Error} Error de base de datos si falla la consulta
   */
  async findAll() {
    const result = await pool.query('SELECT * FROM articulo');
    return result.rows;
  },
  
  /**
   * Elimina un artículo por su ID
   * @param {number} idArticulo - ID del artículo a eliminar
   * @returns {Promise<boolean>} true si se eliminó exitosamente, false si no se encontró
   * @throws {Error} Error de base de datos si falla la operación
   */
  async delete(idArticulo) {
    console.log('[ARTICULO MODEL] Eliminando artículo ID:', idArticulo);
    
    const result = await pool.query(
      'DELETE FROM articulo WHERE idarticulo = $1 RETURNING idarticulo',
      [idArticulo]
    );
    
    console.log('[ARTICULO MODEL] Resultado DELETE:', result.rows.length > 0 ? 'Eliminado' : 'No encontrado');
    return result.rows.length > 0;
  }
};

module.exports = Articulo;
