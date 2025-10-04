/**
 * @fileoverview Controlador de Usuarios - Manejo de autenticación y registro
 * @description Controlador para operaciones de usuarios con encriptación de contraseñas
 */

const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');

const usuarioController = {
  /**
   * Registra un nuevo usuario
   * @param {Object} req - Request con datos del usuario (username, password, nombre, apellido, correo)
   * @param {Object} res - Response con el usuario creado
   * @description Encripta la contraseña con bcrypt antes de guardar en base de datos
   */
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
  
  /**
   * Busca un usuario por nombre de usuario
   * @param {Object} req - Request con username en params
   * @param {Object} res - Response con datos del usuario encontrado
   * @description Busca y retorna información del usuario excluyendo la contraseña
   */
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
