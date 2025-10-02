const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

router.post('/register', usuarioController.register);
router.get('/:username', usuarioController.getByUsername);

module.exports = router;
