const express = require('express');
const router = express.Router();
const noticiaController = require('../controllers/noticiaController');
// Endpoint para servir portada desde bytea
router.get('/portada/:id', noticiaController.portada);
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Crear directorio files si no existe
const filesDir = path.join(__dirname, '../files');
if (!fs.existsSync(filesDir)) {
	console.log('[NOTICIAS SETUP] Creando directorio files:', filesDir);
	fs.mkdirSync(filesDir, { recursive: true });
} else {
	console.log('[NOTICIAS SETUP] Directorio files ya existe:', filesDir);
}

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		console.log('[NOTICIAS MULTER] Guardando archivo en:', filesDir);
		cb(null, filesDir);
	},
	filename: function (req, file, cb) {
		// nomenclatura: foto-[titulo de la noticia]
		const ext = path.extname(file.originalname);
		const nombre = req.body.titulo ? req.body.titulo.replace(/\s+/g, '_') : 'noticia';
		const filename = `foto-${nombre}${ext}`;
		console.log('[NOTICIAS MULTER] Nombre de archivo:', filename);
		cb(null, filename);
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
