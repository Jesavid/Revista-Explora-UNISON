const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');
const validarToken = require('../middlewares/validarToken');

router.post('/', videoController.create);
router.get('/', videoController.getAll);
router.delete('/:id', validarToken, videoController.delete);        // Eliminar video

module.exports = router;
