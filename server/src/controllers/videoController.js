const Video = require('../models/video');

const videoController = {
  async create(req, res) {
    try {
      const { idUsuario, titulo, resumen, imagen } = req.body;
      const video = await Video.create({ idUsuario, titulo, resumen, imagen });
      res.status(201).json(video);
    } catch (err) {
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
