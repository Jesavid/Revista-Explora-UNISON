/**
 * @fileoverview Controlador de Videos - Manejo de contenido de videos
 * @description Controlador para operaciones CRUD de videos
 */

const Video = require('../models/video');

const videoController = {
  /**
   * Crea un nuevo video
   * @param {Object} req - Request con datos del video (idUsuario, titulo, resumen, ruta)
   * @param {Object} res - Response con el video creado
   * @description Registra un nuevo video en la base de datos
   */
  async create(req, res) {
    try {
  const { idUsuario, titulo, resumen, ruta } = req.body;
  console.log('POST /api/videos', { idUsuario, titulo, resumen, ruta });
  const video = await Video.create({ idUsuario, titulo, resumen, ruta });
  res.status(201).json(video);
    } catch (err) {
      console.error('ERROR /api/videos:', err);
      res.status(500).json({ error: err.message });
    }
  },
  
  /**
   * Obtiene todos los videos
   * @param {Object} req - Request object
   * @param {Object} res - Response con array de videos
   * @description Retorna lista completa de videos disponibles
   */
  /**
   * Obtiene todos los videos
   * @param {Object} req - Request object
   * @param {Object} res - Response con array de videos
   * @description Retorna lista completa de videos disponibles
   */
  async getAll(req, res) {
    try {
      const videos = await Video.findAll();
      res.json(videos);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  
  /**
   * Elimina un video por su ID
   * @param {Object} req - Request con ID del video en params.id
   * @param {Object} res - Response con confirmación de eliminación
   * @description Elimina el video de la base de datos
   */
  async delete(req, res) {
    try {
      const idVideo = req.params.id;
      
      // Verificar que el video existe
      const videoExistente = await Video.findById(idVideo);
      if (!videoExistente) {
        return res.status(404).json({ error: 'Video no encontrado' });
      }
      
      console.log('[VIDEO DELETE] Eliminando video ID:', idVideo);
      
      // Eliminar video de la base de datos
      await Video.delete(idVideo);
      
      console.log('[VIDEO DELETE] Video eliminado exitosamente');
      res.json({ 
        success: true, 
        message: 'Video eliminado exitosamente',
        id: idVideo 
      });
      
    } catch (err) {
      console.error('ERROR eliminando video:', err);
      res.status(500).json({ error: err.message });
    }
  }
};

module.exports = videoController;
