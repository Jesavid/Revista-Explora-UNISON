
const express = require('express');
const router = express.Router();
const articuloController = require('../controllers/articuloController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Volumen = require('../models/volumen');
const Numero = require('../models/numero');

// Crear directorio files si no existe
const filesDir = path.join(__dirname, '../files');
if (!fs.existsSync(filesDir)) {
	console.log('[SETUP] Creando directorio files:', filesDir);
	fs.mkdirSync(filesDir, { recursive: true });
} else {
	console.log('[SETUP] Directorio files ya existe:', filesDir);
}

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
		// Usar el directorio que creamos arriba
		console.log('[MULTER] Guardando archivo en:', filesDir);
		cb(null, filesDir);
	},
	filename: function (req, file, cb) {
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
		const filename = 'articulo-' + uniqueSuffix + path.extname(file.originalname);
		console.log('[MULTER] Nombre de archivo:', filename);
		cb(null, filename);
	}
});

// Filtro para solo permitir PDFs
const fileFilter = (req, file, cb) => {
	console.log('[MULTER] Validando archivo:', {
		originalname: file.originalname,
		mimetype: file.mimetype,
		fieldname: file.fieldname
	});
	
	if (file.mimetype === 'application/pdf') {
		cb(null, true);
	} else {
		cb(new Error('Solo se permiten archivos PDF'), false);
	}
};

const upload = multer({ 
	storage,
	fileFilter,
	limits: {
		fileSize: 10 * 1024 * 1024 // 10MB máximo
	}
});

// Middleware para manejar errores de multer
const handleMulterError = (err, req, res, next) => {
	console.error('[MULTER ERROR]:', err);
	if (err instanceof multer.MulterError) {
		if (err.code === 'LIMIT_FILE_SIZE') {
			return res.status(400).json({ error: 'El archivo es demasiado grande (máximo 10MB)' });
		}
		return res.status(400).json({ error: 'Error al subir archivo: ' + err.message });
	}
	if (err.message === 'Solo se permiten archivos PDF') {
		return res.status(400).json({ error: err.message });
	}
	next(err);
};

// Subir PDF de artículo
router.post('/upload', (req, res, next) => {
	console.log('[UPLOAD ENDPOINT] Iniciando upload...');
	upload.single('documento')(req, res, (err) => {
		if (err) {
			console.error('[UPLOAD ERROR]:', err);
			return handleMulterError(err, req, res, next);
		}
		console.log('[UPLOAD SUCCESS] Archivo procesado por multer');
		console.log('[UPLOAD] req.file:', req.file);
		console.log('[UPLOAD] req.body:', req.body);
		articuloController.upload(req, res);
	});
});

// Actualizar artículo (incluye PDF opcional)
router.put('/:id', (req, res, next) => {
	console.log('[UPDATE ENDPOINT] Iniciando update...');
	upload.single('documento')(req, res, (err) => {
		if (err) {
			console.error('[UPDATE ERROR]:', err);
			return handleMulterError(err, req, res, next);
		}
		console.log('[UPDATE SUCCESS] Archivo procesado por multer');
		console.log('[UPDATE] req.file:', req.file);
		console.log('[UPDATE] req.body:', req.body);
		articuloController.update(req, res);
	});
});
// Descargar PDF
router.get('/file/:filename', articuloController.download);

router.post('/', articuloController.create);
router.get('/', articuloController.getAll);

module.exports = router;
