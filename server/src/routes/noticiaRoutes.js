/**
 * RUTAS DE NOTICIAS
 * 
 * Define todas las rutas y middleware para el módulo de noticias
 * Incluye configuración de Multer para upload de imágenes
 * 
 * Rutas disponibles:
 * - GET /api/noticias/portada/:id - Servir imagen de portada
 * - POST /api/noticias/upload - Upload de noticia con imagen
 * - GET /api/noticias/file/:filename - Descargar archivo de imagen
 * - GET /api/noticias - Listar todas las noticias
 * - GET /api/noticias/:id - Obtener noticia específica
 * - POST /api/noticias - Crear nueva noticia
 * - PUT /api/noticias/:id - Actualizar noticia existente
 * - DELETE /api/noticias/:id - Eliminar noticia
 */

const express = require('express');
const router = express.Router();
const noticiaController = require('../controllers/noticiaController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// ========================================================================================
// CONFIGURACIÓN DE MULTER PARA UPLOAD DE IMÁGENES
// ========================================================================================

// Endpoint para servir portada desde bytea (debe ir antes de otras rutas con parámetros)
router.get('/portada/:id', noticiaController.portada);

// Crear directorio files si no existe
const filesDir = path.join(__dirname, '../files');
if (!fs.existsSync(filesDir)) {
	console.log('[NOTICIAS SETUP] Creando directorio files:', filesDir);
	fs.mkdirSync(filesDir, { recursive: true });
} else {
	console.log('[NOTICIAS SETUP] Directorio files ya existe:', filesDir);
}

/**
 * Configuración de almacenamiento para imágenes de noticias
 * Las imágenes se guardan temporalmente en disco y luego se convierten a Buffer
 */
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		console.log('[NOTICIAS MULTER] Guardando archivo en:', filesDir);
		cb(null, filesDir);
	},
	filename: function (req, file, cb) {
		// Nomenclatura: foto-[titulo de la noticia]
		const ext = path.extname(file.originalname);
		const nombre = req.body.titulo ? req.body.titulo.replace(/\s+/g, '_') : 'noticia';
		const filename = `foto-${nombre}${ext}`;
		console.log('[NOTICIAS MULTER] Nombre de archivo:', filename);
		cb(null, filename);
	}
});

// Configurar multer con validación de tipos de archivo
const upload = multer({ 
	storage,
	fileFilter: (req, file, cb) => {
		// Permitir solo imágenes
		if (file.mimetype.startsWith('image/')) {
			cb(null, true);
		} else {
			cb(new Error('Solo se permiten archivos de imagen'), false);
		}
	},
	limits: {
		fileSize: 5 * 1024 * 1024 // Límite de 5MB
	}
});

// ========================================================================================
// DEFINICIÓN DE RUTAS
// ========================================================================================

// Subir noticia con imagen (upload completo)
router.post('/upload', upload.single('foto'), noticiaController.upload);

// Descargar archivo de imagen por nombre
router.get('/file/:filename', noticiaController.download);

// CRUD básico de noticias
router.post('/', noticiaController.create);                          // Crear noticia sin imagen
router.get('/', noticiaController.getAll);                          // Listar todas las noticias
router.get('/:id', noticiaController.getById);                      // Obtener noticia específica
router.put('/:id', upload.single('foto'), noticiaController.update); // Actualizar noticia (con nueva imagen opcional)
router.delete('/:id', noticiaController.delete);                    // Eliminar noticia

module.exports = router;
