const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');

const usuarioController = {
  async register(req, res) {
    try {
  const { username, password, nombre, apellido, correo } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await Usuario.create({ username, password: hashedPassword, nombre, apellido, correo });
  res.status(201).json(user);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  async getByUsername(req, res) {
    try {
  const { username } = req.params;
  const user = await Usuario.findByUsername(username);
  if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
  res.json(user);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

module.exports = usuarioController;
