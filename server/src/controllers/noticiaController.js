  const Noticia = require('../models/noticia');
  const path = require('path');
  const fs = require('fs');

  const noticiaController = {
    // Subida de foto
    async upload(req, res) {
      try {
        console.log('BODY:', req.body);
        console.log('FILE:', req.file);
        const { idUsuario, autor, titulo, resumen, contenido, fechaNoticia } = req.body;
        let foto = null;
        if (req.file) {
          // Leer el archivo como buffer para guardar como bytea
          const fs = require('fs');
          foto = fs.readFileSync(req.file.path);
        }
        console.log('POST /api/noticias/upload', { idUsuario, autor, titulo, resumen, contenido, fechaNoticia, foto: foto ? `<buffer length ${foto.length}>` : null });
        const noticia = await Noticia.create({ idUsuario, autor, titulo, resumen, foto, contenido, fechaNoticia });
        res.status(201).json(noticia);
      } catch (err) {
        console.error('ERROR /api/noticias/upload:', err);
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
    },
    // Servir portada desde bytea
    async portada(req, res) {
      const idNoticia = req.params.id;
      try {
        const noticia = await Noticia.findById(idNoticia);
        if (!noticia || !noticia.foto) {
          return res.status(404).json({ error: 'Portada no encontrada' });
        }
        res.set('Content-Type', 'image/jpeg');
        res.send(noticia.foto);
      } catch (err) {
        res.status(500).json({ error: 'Error al obtener portada' });
      }
    }
  };
// (Eliminados duplicados, portada ya está incluida en el objeto noticiaController)

module.exports = noticiaController;
