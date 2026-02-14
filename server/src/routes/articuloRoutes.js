const express = require('express');
const router = express.Router();
const articuloController = require('../controllers/articuloController');
const validarToken = require('../middlewares/validarToken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Volumen = require('../models/volumen');
const Numero = require('../models/numero');

// Crear directorio files si no existe
const filesDir = path.join(__dirname, '../files');
if (!fs.existsSync(filesDir)) {
    fs.mkdirSync(filesDir, { recursive: true });
}

// --- Configuración de Multer ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, filesDir),
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'articulo-' + uniqueSuffix + path.extname(file.originalname));
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') cb(null, true);
    else cb(new Error('Solo se permiten archivos PDF'), false);
};
const upload = multer({ storage, fileFilter, limits: { fileSize: 10 * 1024 * 1024 } });
const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'El archivo es demasiado grande (máximo 10MB)' });
    }
    if (err.message === 'Solo se permiten archivos PDF') {
        return res.status(400).json({ error: err.message });
    }
    next(err);
};

// --- Rutas de Volúmenes y Números ---
router.get('/volumenes', async (req, res) => {
    try {
        const volumenes = await Volumen.getAll();
        res.json(volumenes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
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

// --- Rutas de Artículos ---
// 1. Subir PDF
router.post('/upload', (req, res, next) => {
    upload.single('documento')(req, res, (err) => {
        if (err) return handleMulterError(err, req, res, next);
        articuloController.upload(req, res);
    });
});

// 2. Obtener artículos por palabra clave (antes de /:id)
router.get('/por-palabra', articuloController.getByKeyword);

// 3. Descargar PDF (también antes de /:id)
router.get('/file/:filename', articuloController.download);

// 4. Obtener todos los artículos (esta puede ir antes o después de /:id)
router.get('/', articuloController.getAll);

// 5. Crear artículo SIN upload
router.post('/', articuloController.create);

// 6. Obtener un artículo por ID (paramétrico, al final de las GETs)
router.get('/:id', articuloController.getArticuloById);

// 7. Actualizar artículo
router.put('/:id', (req, res, next) => {
    upload.single('documento')(req, res, (err) => {
        if (err) return handleMulterError(err, req, res, next);
        articuloController.update(req, res);
    });
});

// 8. Eliminar artículo
router.delete('/:id', validarToken, articuloController.delete);

module.exports = router;
