/**
 * CONTROLADOR DE NOTICIAS
 * 
 * Maneja todas las operaciones CRUD para el módulo de noticias
 * Incluye funcionalidades de upload de imágenes y gestión de contenido
 * 
 * Funcionalidades:
 * - Upload de noticias con imágenes de portada
 * - Gestión CRUD de noticias
 * - Servir imágenes desde la base de datos (bytea)
 */

const Noticia = require('../models/noticia');
const path = require('path');
const fs = require('fs');

const noticiaController = {
  
  /**
   * Upload de nueva noticia con imagen opcional
   * 
   * @route POST /api/noticias/upload
   * @param {Object} req.body - Datos de la noticia
   * @param {File} req.file - Archivo de imagen (opcional)
   * @returns {Object} Noticia creada con ID asignado
   */
  async upload(req, res) {
    try {
      console.log('BODY:', req.body);
      console.log('FILE:', req.file);
      
      const { idUsuario, autor, titulo, resumen, contenido, fechaNoticia } = req.body;
      let foto = null;
      
      // Procesar imagen si fue enviada
      if (req.file) {
        // Leer el archivo como buffer para guardar como bytea en PostgreSQL
        foto = fs.readFileSync(req.file.path);
      }
      
      console.log('[NOTICIA UPLOAD] Recibido:', { 
        idUsuario, autor, titulo, resumen, contenido, fechaNoticia, 
        foto: foto ? `<buffer length ${foto.length}>` : null 
      });
      
      // Crear noticia en la base de datos
      const noticia = await Noticia.create({ 
        idUsuario, autor, titulo, resumen, foto, contenido, fechaNoticia 
      });
      
      console.log('[NOTICIA UPLOAD] Guardado en BD:', noticia);
      res.status(201).json(noticia);
      
    } catch (err) {
      console.error('ERROR /api/noticias/upload:', err);
      res.status(500).json({ error: err.message });
    }
  },

  /**
   * Descargar archivo de imagen por nombre
   * 
   * @route GET /api/noticias/download/:filename
   * @param {string} req.params.filename - Nombre del archivo
   * @returns {File} Archivo de imagen o error 404
   */
  async download(req, res) {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '../files', filename);
    
    if (fs.existsSync(filePath)) {
      res.download(filePath);
    } else {
      res.status(404).json({ error: 'Archivo no encontrado' });
    }
  },

  /**
   * Crear nueva noticia (método alternativo sin upload)
   * 
   * @route POST /api/noticias
   * @param {Object} req.body - Datos de la noticia
   * @returns {Object} Noticia creada
   */
  async create(req, res) {
    try {
      const { idUsuario, titulo, resumen, foto, contenido, fechaNoticia } = req.body;
      const noticia = await Noticia.create({ idUsuario, titulo, resumen, foto, contenido, fechaNoticia });
      res.status(201).json(noticia);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  /**
   * Obtener todas las noticias
   * 
   * @route GET /api/noticias
   * @returns {Array} Lista de todas las noticias
   */
  async getAll(req, res) {
    try {
      const noticias = await Noticia.findAll();
      res.json(noticias);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  /**
   * Servir imagen de portada desde la base de datos
   * 
   * @route GET /api/noticias/portada/:id
   * @param {string} req.params.id - ID de la noticia
   * @returns {Buffer} Imagen en formato JPEG o error 404
   */
  async portada(req, res) {
    const idNoticia = req.params.id;
    try {
      const noticia = await Noticia.findById(idNoticia);
      
      if (!noticia || !noticia.foto) {
        return res.status(404).json({ error: 'Portada no encontrada' });
      }
      
      // Servir imagen directamente desde el buffer almacenado en la BD
      res.set('Content-Type', 'image/jpeg');
      res.send(noticia.foto);
      
    } catch (err) {
      res.status(500).json({ error: 'Error al obtener portada' });
    }
  },

  /**
   * Obtener una noticia específica por ID
   * 
   * @route GET /api/noticias/:id
   * @param {string} req.params.id - ID de la noticia
   * @returns {Object} Noticia encontrada o error 404
   */
  async getById(req, res) {
    try {
      const idNoticia = req.params.id;
      const noticia = await Noticia.findById(idNoticia);
      
      if (!noticia) {
        return res.status(404).json({ error: 'Noticia no encontrada' });
      }
      
      res.json(noticia);
    } catch (err) {
      console.error('ERROR obteniendo noticia por ID:', err);
      res.status(500).json({ error: err.message });
    }
  },

  /**
   * Actualizar una noticia existente
   * 
   * @route PUT /api/noticias/:id
   * @param {string} req.params.id - ID de la noticia a actualizar
   * @param {Object} req.body - Nuevos datos de la noticia
   * @param {File} req.file - Nueva imagen (opcional)
   * @returns {Object} Noticia actualizada
   */
  async update(req, res) {
    try {
      const idNoticia = req.params.id;
      const { idUsuario, autor, titulo, resumen, contenido, fechaNoticia } = req.body;
      
      // Verificar que la noticia existe
      const noticiaExistente = await Noticia.findById(idNoticia);
      if (!noticiaExistente) {
        return res.status(404).json({ error: 'Noticia no encontrada' });
      }
      
      let foto = noticiaExistente.foto; // Mantener imagen existente por defecto
      
      // Procesar nueva imagen si fue enviada
      if (req.file) {
        foto = fs.readFileSync(req.file.path);
        console.log('[NOTICIA UPDATE] Nueva imagen procesada, tamaño:', foto.length);
      }
      
      console.log('[NOTICIA UPDATE] Actualizando noticia ID:', idNoticia, {
        idUsuario, autor, titulo, resumen, contenido, fechaNoticia,
        nuevaImagen: !!req.file
      });
      
      // Actualizar noticia en la base de datos
      const noticiaActualizada = await Noticia.update(idNoticia, {
        idUsuario, autor, titulo, resumen, foto, contenido, fechaNoticia
      });
      
      console.log('[NOTICIA UPDATE] Noticia actualizada exitosamente');
      res.json(noticiaActualizada);
      
    } catch (err) {
      console.error('ERROR actualizando noticia:', err);
      res.status(500).json({ error: err.message });
    }
  },

  /**
   * Eliminar una noticia
   * 
   * @route DELETE /api/noticias/:id
   * @param {string} req.params.id - ID de la noticia a eliminar
   * @returns {Object} Mensaje de confirmación o error
   */
  async delete(req, res) {
    try {
      const idNoticia = req.params.id;
      
      // Verificar que la noticia existe
      const noticiaExistente = await Noticia.findById(idNoticia);
      if (!noticiaExistente) {
        return res.status(404).json({ error: 'Noticia no encontrada' });
      }
      
      console.log('[NOTICIA DELETE] Eliminando noticia ID:', idNoticia);
      
      // Eliminar noticia de la base de datos
      await Noticia.delete(idNoticia);
      
      console.log('[NOTICIA DELETE] Noticia eliminada exitosamente');
      res.json({ 
        success: true, 
        message: 'Noticia eliminada exitosamente',
        id: idNoticia 
      });
      
    } catch (err) {
      console.error('ERROR eliminando noticia:', err);
      res.status(500).json({ error: err.message });
    }
  }
};

module.exports = noticiaController;
