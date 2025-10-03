const Video = require('../models/video');

const videoController = {
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
  async getAll(req, res) {
    try {
      const videos = await Video.findAll();
      res.json(videos);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

module.exports = videoController;
