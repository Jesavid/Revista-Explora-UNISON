/**
 * @fileoverview Controlador de Artículos - Manejo de artículos PDF
 * @description Controlador para operaciones CRUD de artículos con upload de archivos PDF
 */

const Articulo = require('../models/articulo');
const path = require('path');
const fs = require('fs');

const articuloController = {
  /**
   * Sube un nuevo artículo con archivo PDF
   * @param {Object} req - Request con archivo PDF y datos del artículo
   * @param {Object} res - Response con el artículo creado
   * @description Procesa upload de PDF, valida datos y guarda en base de datos como bytea
   */
  async upload(req, res) {
    try {
      console.log('[ARTICULO UPLOAD] === INICIANDO UPLOAD ===');
      console.log('[ARTICULO UPLOAD] req.file:', req.file);
      console.log('[ARTICULO UPLOAD] req.body:', req.body);
      
      let { autor, idusuario, idnumero, titulo, resumen, nopaginas, fecha, palabrasclave } = req.body;
      
      // Convertir a entero o null
      idusuario = idusuario && !isNaN(idusuario) ? parseInt(idusuario, 10) : null;
      idnumero = idnumero && !isNaN(idnumero) ? parseInt(idnumero, 10) : null;
      nopaginas = nopaginas && !isNaN(nopaginas) ? parseInt(nopaginas, 10) : null;
    
      const keywords = palabrasclave 
        ? palabrasclave.split(',').map(k => k.trim()).filter(k => k.length > 0)
        : [];
      

      console.log('[ARTICULO UPLOAD] Datos procesados:', {
        autor,
        idusuario,
        idnumero,
        titulo,
        resumen,
        nopaginas,
        fecha,
        keywords
      });
      
      // Validaciones
      if (!idusuario || !idnumero) {
        console.error('[ARTICULO UPLOAD] Error: idusuario e idnumero son obligatorios');
        return res.status(400).json({ error: 'idusuario e idnumero son obligatorios y deben ser enteros' });
      }
      
      if (!req.file) {
        console.error('[ARTICULO UPLOAD] Error: No se recibió archivo');
        return res.status(400).json({ error: 'Archivo PDF requerido' });
      }
      
      console.log('[ARTICULO UPLOAD] Leyendo archivo desde:', req.file.path);
      
      // Leer el buffer del archivo PDF
      const documento = req.file && req.file.path ? fs.readFileSync(req.file.path) : null;
      
      if (!documento) {
        console.error('[ARTICULO UPLOAD] Error: No se pudo leer el documento');
        return res.status(400).json({ error: 'Error al leer el archivo PDF' });
      }
      
      console.log('[ARTICULO UPLOAD] Documento leído exitosamente:', `Buffer (${documento.length} bytes)`);
      console.log('[ARTICULO UPLOAD] Guardando en base de datos...');
      
      const articulo = await Articulo.create({ 
        autor, 
        idUsuario: idusuario, 
        idNumero: idnumero, 
        titulo, 
        resumen, 
        documento, 
        noPaginas: nopaginas, 
        fecha,
        keywords 
      });
      
      console.log('[ARTICULO UPLOAD] === UPLOAD EXITOSO ===');
      console.log('[ARTICULO UPLOAD] Artículo guardado:', articulo);
      
      // Limpiar archivo temporal
      if (req.file && req.file.path) {
        try {
          fs.unlinkSync(req.file.path);
          console.log('[ARTICULO UPLOAD] Archivo temporal eliminado:', req.file.path);
        } catch (cleanupErr) {
          console.warn('[ARTICULO UPLOAD] No se pudo eliminar archivo temporal:', cleanupErr.message);
        }
      }
      
      res.status(201).json(articulo);
    } catch (err) {
      console.error('[ARTICULO UPLOAD] === ERROR CRÍTICO ===');
      console.error('[ARTICULO UPLOAD] Error completo:', err);
      console.error('[ARTICULO UPLOAD] Stack trace:', err.stack);
      
      // Limpiar archivo temporal en caso de error
      if (req.file && req.file.path) {
        try {
          fs.unlinkSync(req.file.path);
          console.log('[ARTICULO UPLOAD] Archivo temporal eliminado tras error:', req.file.path);
        } catch (cleanupErr) {
          console.warn('[ARTICULO UPLOAD] No se pudo eliminar archivo temporal tras error:', cleanupErr.message);
        }
      }
      
      res.status(500).json({ error: err.message });
    }
  },
  
  /**
   * Actualiza un artículo existente
   * @param {Object} req - Request con ID del artículo y datos actualizados
   * @param {Object} res - Response con el artículo actualizado
   * @description Permite actualizar datos y opcionalmente el archivo PDF
   */
  async update(req, res) {
    try {
      const idArticulo = req.params.id;
      
      let { autor, idusuario, idnumero, titulo, resumen, nopaginas, fecha, palabrasclave } = req.body;
      
      idusuario = idusuario && !isNaN(idusuario) ? parseInt(idusuario, 10) : null;
      idnumero = idnumero && !isNaN(idnumero) ? parseInt(idnumero, 10) : null;
      nopaginas = nopaginas && !isNaN(nopaginas) ? parseInt(nopaginas, 10) : null;
      
      const keywords = palabrasclave 
        ? palabrasclave.split(',').map(k => k.trim()).filter(k => k.length > 0)
        : [];

      let documento = null;
      if (req.file && req.file.path) {
        documento = fs.readFileSync(req.file.path);
      }
      
      console.log('[ARTICULO UPDATE] Recibido:', {
        idArticulo,
        autor,
        idusuario,
        idnumero,
        titulo,
        resumen,
        documento: documento ? `Buffer (${documento.length} bytes)` : null,
        nopaginas,
        fecha,
        keywords 
      });
      
      const articulo = await Articulo.update({ 
        idArticulo, 
        autor, 
        idUsuario: idusuario, 
        idNumero: idnumero, 
        titulo, 
        resumen, 
        documento, 
        noPaginas: nopaginas, 
        fecha,
        keywords 
      });
      
      console.log('[ARTICULO UPDATE] Guardado en BD:', articulo);
      
      // Limpiar archivo temporal si se subió uno nuevo
      if (req.file && req.file.path) {
        try {
          fs.unlinkSync(req.file.path);
          console.log('[ARTICULO UPDATE] Archivo temporal eliminado:', req.file.path);
        } catch (cleanupErr) {
          console.warn('[ARTICULO UPDATE] No se pudo eliminar archivo temporal:', cleanupErr.message);
        }
      }

      res.status(200).json(articulo);
    } catch (err) {
      console.error('ERROR UPDATE ARTICULO:', err);
      
      // Limpiar archivo temporal en caso de error
      if (req.file && req.file.path) {
        try {
          fs.unlinkSync(req.file.path);
          console.log('[ARTICULO UPDATE] Archivo temporal eliminado tras error:', req.file.path);
        } catch (cleanupErr) {
          console.warn('[ARTICULO UPDATE] No se pudo eliminar archivo temporal tras error:', cleanupErr.message);
        }
      }
     
      
      res.status(500).json({ error: err.message });
    }
  },
  
  /**
   * Descarga el PDF de un artículo
   * @param {Object} req - Request con el ID del artículo en params.filename
   * @param {Object} res - Response con el archivo PDF
   * @description Sirve el PDF directamente desde la base de datos
   */
  async download(req, res) {
    try {
      // Espera ruta: /api/articulos/file/:idarticulo
      const id = req.params.filename?.replace(/[^0-9]/g, '');
      if (!id) return res.status(400).json({ error: 'ID de artículo inválido' });
      const articulo = await Articulo.findById(Number(id));
      if (!articulo || !articulo.documento) {
        return res.status(404).json({ error: 'PDF no encontrado en la base de datos' });
      }
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename="articulo-${id}.pdf"`);
      res.send(articulo.documento);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  
  /**
   * Crea un nuevo artículo (sin archivo)
   * @param {Object} req - Request con datos del artículo
   * @param {Object} res - Response con el artículo creado
   * @description Método alternativo para crear artículos sin upload de archivo
   */
  async create(req, res) {
    try {
      
      const { autor, idUsuario, idNumero, titulo, resumen, documento, noPaginas, fecha, palabrasclave } = req.body;
      
      const keywords = palabrasclave 
        ? palabrasclave.split(',').map(k => k.trim()).filter(k => k.length > 0)
        : [];

      const articulo = await Articulo.create({ 
        autor, 
        idUsuario, 
        idNumero, 
        titulo, 
        resumen, 
        documento, 
        noPaginas, 
        fecha,
        keywords // --- NUEVO ---
      });
      
      res.status(201).json(articulo);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  
  /**
   * Obtiene todos los artículos
   * @param {Object} req - Request object
   * @param {Object} res - Response con array de artículos
   * @description Retorna lista completa de artículos (ahora con palabras clave gracias al Modelo)
   */
  async getAll(req, res) {
    try {
      const articulos = await Articulo.findAll();
      res.json(articulos);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // --- MÉTODO getArticuloById (MODIFICADO) ---
  /**
   * Obtiene un solo artículo por ID
   * @param {Object} req - Request con ID del artículo en params.id
   * @param {Object} res - Response con el artículo
   */
  async getArticuloById(req, res) {
    try {
      const { id } = req.params;
      const articulo = await Articulo.findById(id);
      
      // <-- LÍNEA DE DEBUG AÑADIDA -->
      console.log(`[DEBUG] Resultado del modelo para el ID ${id}:`, articulo); 

      if (!articulo) {
        console.log(`[ARTICULO CONTROLLER] Artículo ID ${id} no encontrado.`);
        return res.status(404).json({ message: 'Article not found' });
      }
      
      // --- CAMBIO CLAVE AÑADIDO ---
      // Eliminar el Buffer PDF del objeto antes de enviarlo como JSON, 
      // ya que este campo es binario y causa problemas de serialización en Express.
      if (articulo.documento) {
        console.log(`[ARTICULO CONTROLLER] Eliminando campo 'documento' (${articulo.documento.length} bytes) antes de JSONificar.`);
        delete articulo.documento;
      }
      // --- FIN CAMBIO CLAVE ---
      
      // El modelo ya devuelve el campo 'palabras_clave'
      res.status(200).json(articulo);
    } catch (error) {
      console.error(`[ARTICULO CONTROLLER] Error fetching article ID ${req.params.id}:`, error);
      res.status(500).json({ message: 'Server error fetching article', error: error.message });
    }
  },
  

  /**
   * Obtiene artículos por una palabra clave específica
   * @param {Object} req - Request (query.termino)
   * @param {Object} res - Response con array de artículos
   */
  async getByKeyword(req, res) {
    try {
      const { termino } = req.query;
      if (!termino) {
        return res.status(400).json({ error: 'El parámetro "termino" es requerido' });
      }
      
      const articulos = await Articulo.findByKeyword(termino);
      res.json(articulos);
      
    } catch (err) {
      console.error('ERROR getByKeyword:', err);
      res.status(500).json({ error: err.message });
    }
  },
  
  /**
   * Elimina un artículo por su ID
   * @param {Object} req - Request con ID del artículo en params.id
   * @param {Object} res - Response con confirmación de eliminación
   * @description Elimina el artículo y su archivo PDF de la base de datos
   */
  async delete(req, res) {
    try {
      const idArticulo = req.params.id;
      
      // Verificar que el artículo existe
      const articuloExistente = await Articulo.findById(idArticulo);
      if (!articuloExistente) {
        return res.status(404).json({ error: 'Artículo no encontrado' });
      }
      
      console.log('[ARTICULO DELETE] Eliminando artículo ID:', idArticulo);
      
      // Eliminar artículo de la base de datos
      await Articulo.delete(idArticulo);
      
      console.log('[ARTICULO DELETE] Artículo eliminado exitosamente');
      res.json({ 
        success: true, 
        message: 'Artículo eliminado exitosamente',
        id: idArticulo 
      });
      
    } catch (err) {
      console.error('ERROR eliminando artículo:', err);
      res.status(500).json({ error: err.message });
    }
  }
};

module.exports = articuloController;
