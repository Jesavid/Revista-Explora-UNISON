const express = require('express');
const router = express.Router();
const noticiaController = require('../controllers/noticiaController');
// Endpoint para servir portada desde bytea
router.get('/portada/:id', noticiaController.portada);
const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, path.join(__dirname, '../files'));
	},
	filename: function (req, file, cb) {
		// nomenclatura: foto-[titulo de la noticia]
		const ext = path.extname(file.originalname);
		const nombre = req.body.titulo ? req.body.titulo.replace(/\s+/g, '_') : 'noticia';
		cb(null, `foto-${nombre}${ext}`);
	}
});
const upload = multer({ storage });

// Subir foto de noticia
router.post('/upload', upload.single('foto'), noticiaController.upload);
// Descargar foto
router.get('/file/:filename', noticiaController.download);

router.post('/', noticiaController.create);
router.get('/', noticiaController.getAll);

module.exports = router;
