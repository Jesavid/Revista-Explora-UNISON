const Noticia = require('../models/noticia');
const path = require('path');
const fs = require('fs');

const noticiaController = {
  // Subida de foto
  async upload(req, res) {
    try {
      const { idUsuario, titulo, resumen, contenido, fechaNoticia } = req.body;
      const foto = req.file.filename;
      const noticia = await Noticia.create({ idUsuario, titulo, resumen, foto, contenido, fechaNoticia });
      res.status(201).json(noticia);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  // Descargar foto
  async download(req, res) {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '../files', filename);
    if (fs.existsSync(filePath)) {
      res.download(filePath);
    } else {
      res.status(404).json({ error: 'Archivo no encontrado' });
    }
  },
  async create(req, res) {
    try {
      const { idUsuario, titulo, resumen, foto, contenido, fechaNoticia } = req.body;
      const noticia = await Noticia.create({ idUsuario, titulo, resumen, foto, contenido, fechaNoticia });
      res.status(201).json(noticia);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  async getAll(req, res) {
    try {
      const noticias = await Noticia.findAll();
      res.json(noticias);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

module.exports = noticiaController;
