
const express = require('express');
const router = express.Router();
const articuloController = require('../controllers/articuloController');
const multer = require('multer');
const path = require('path');
const Volumen = require('../models/volumen');
const Numero = require('../models/numero');

// Obtener todos los volúmenes (años)
router.get('/volumenes', async (req, res) => {
	try {
		const volumenes = await Volumen.getAll();
		res.json(volumenes);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// Obtener todos los números (ediciones) de un volumen
router.get('/numeros', async (req, res) => {
	try {
		const { volumen } = req.query;
		if (!volumen) return res.json([]);
		const numeros = await Numero.getAllByVolumen(volumen);
		res.json(numeros);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// Endpoint para buscar o crear volumen y número y devolver idnumero
router.post('/resolve-numero', async (req, res) => {
	try {
		const { anio, numero } = req.body;
		if (!anio || !numero) return res.status(400).json({ error: 'Año y número requeridos' });
		const volumen = await Volumen.findOrCreate(anio);
		const num = await Numero.findOrCreate({ idVolumen: volumen.idvolumen, numero });
		res.json({ idnumero: num.idnumero });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, path.join(__dirname, '../files'));
	},
	filename: function (req, file, cb) {
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
		cb(null, 'articulo-' + uniqueSuffix + path.extname(file.originalname));
	}
});
const upload = multer({ storage });

// Subir PDF de artículo
router.post('/upload', upload.single('documento'), articuloController.upload);
// Actualizar artículo (incluye PDF opcional)
router.put('/:id', upload.single('documento'), articuloController.update);
// Descargar PDF
router.get('/file/:filename', articuloController.download);

router.post('/', articuloController.create);
router.get('/', articuloController.getAll);

module.exports = router;
