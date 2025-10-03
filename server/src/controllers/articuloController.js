const Articulo = require('../models/articulo');
const path = require('path');
const fs = require('fs');

const articuloController = {
  // Subida de PDF
  async upload(req, res) {
    try {
      let { autor, idusuario, idnumero, titulo, resumen, nopaginas, fecha } = req.body;
      // Convertir a entero o null
      idusuario = idusuario && !isNaN(idusuario) ? parseInt(idusuario, 10) : null;
      idnumero = idnumero && !isNaN(idnumero) ? parseInt(idnumero, 10) : null;
      nopaginas = nopaginas && !isNaN(nopaginas) ? parseInt(nopaginas, 10) : null;
      // Leer el buffer del archivo PDF
      const documento = req.file && req.file.path ? fs.readFileSync(req.file.path) : null;
      console.log('[ARTICULO UPLOAD] Recibido:', {
        autor,
        idusuario,
        idnumero,
        titulo,
        resumen,
        documento: documento ? `Buffer (${documento.length} bytes)` : null,
        nopaginas,
        fecha
      });
      if (!idusuario || !idnumero) {
        return res.status(400).json({ error: 'idusuario e idnumero son obligatorios y deben ser enteros' });
      }
      if (!documento) return res.status(400).json({ error: 'Archivo PDF requerido' });
      const articulo = await Articulo.create({ autor, idUsuario: idusuario, idNumero: idnumero, titulo, resumen, documento, noPaginas: nopaginas, fecha });
      console.log('[ARTICULO UPLOAD] Guardado en BD:', articulo);
      res.status(201).json(articulo);
    } catch (err) {
      console.error('ERROR UPLOAD ARTICULO:', err);
      res.status(500).json({ error: err.message });
    }
  },
  // Actualizar artículo
  async update(req, res) {
    try {
      const idArticulo = req.params.id;
      let { autor, idusuario, idnumero, titulo, resumen, nopaginas, fecha } = req.body;
      idusuario = idusuario && !isNaN(idusuario) ? parseInt(idusuario, 10) : null;
      idnumero = idnumero && !isNaN(idnumero) ? parseInt(idnumero, 10) : null;
      nopaginas = nopaginas && !isNaN(nopaginas) ? parseInt(nopaginas, 10) : null;
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
        fecha
      });
      const articulo = await Articulo.update({ idArticulo, autor, idUsuario: idusuario, idNumero: idnumero, titulo, resumen, documento, noPaginas: nopaginas, fecha });
      console.log('[ARTICULO UPDATE] Guardado en BD:', articulo);
      res.status(200).json(articulo);
    } catch (err) {
      console.error('ERROR UPDATE ARTICULO:', err);
      res.status(500).json({ error: err.message });
    }
  },
  // Descargar PDF
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
  async create(req, res) {
    try {
      const { autor, idUsuario, idNumero, titulo, resumen, documento, noPaginas, fecha } = req.body;
      const articulo = await Articulo.create({ autor, idUsuario, idNumero, titulo, resumen, documento, noPaginas, fecha });
      res.status(201).json(articulo);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  async getAll(req, res) {
    try {
      const articulos = await Articulo.findAll();
      res.json(articulos);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

module.exports = articuloController;
