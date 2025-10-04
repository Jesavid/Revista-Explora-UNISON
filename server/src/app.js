/**
 * EXPLORA UNISON - Backend API Server
 * 
 * Sistema de gestión de contenido académico para la revista Explora UNISON
 * que permite la administración de artículos, noticias y videos.
 * 
 * Tecnologías: Node.js, Express.js, PostgreSQL, JWT, Multer
 * Despliegue: Railway (Backend) + Vercel (Frontend)
 */

// ========================================================================================
// CONFIGURACIÓN DE MANEJO DE ERRORES GLOBALES
// ========================================================================================

// Captura errores no manejados en el proceso principal
process.on('uncaughtException', err => {
    console.error('Uncaught Exception:', err);
    console.error('Stack:', err.stack);
    process.exit(1);
});

// Captura promesas rechazadas no manejadas
process.on('unhandledRejection', err => {
    console.error('Unhandled Rejection:', err);
    console.error('Stack:', err.stack);
    process.exit(1);
});

// Manejo de señales de terminación del sistema
process.on('SIGTERM', () => {
    console.log('Received SIGTERM signal');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('Received SIGINT signal');
    process.exit(0);
});

// ========================================================================================
// IMPORTACIÓN DE DEPENDENCIAS
// ========================================================================================

console.log('Process handlers registered');
console.log('Loading modules...');
const express = require('express');
console.log('✓ Express loaded');
const path = require('path');
console.log('✓ Path loaded');
const cors = require('cors');
console.log('✓ CORS loaded');
const jwt = require('jsonwebtoken');
console.log('✓ JWT loaded');
const validarToken = require('./middlewares/validarToken');
console.log('✓ ValidarToken loaded');

// ========================================================================================
// CONFIGURACIÓN DE LA APLICACIÓN EXPRESS
// ========================================================================================

const app = express();
console.log('✓ Express app created');

// Clave secreta para JWT (usar variable de entorno en producción)
const SECRET_KEY = process.env.SECRET_KEY || 'secret';
console.log('✓ Secret key configured');

// ========================================================================================
// CONFIGURACIÓN DE MIDDLEWARE CORS
// ========================================================================================

// CORS restringido al dominio de Vercel en producción para mayor seguridad
app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ? 'https://revista-explora-unison.vercel.app'  // Dominio específico en producción
        : '*',  // Permite cualquier origen en desarrollo
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware para parsing de JSON en las peticiones
app.use(express.json());

// ========================================================================================
// MIDDLEWARE DE LOGGING
// ========================================================================================

// Middleware de logging para todas las requests
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});

// ========================================================================================
// CONFIGURACIÓN DE RUTAS API
// ========================================================================================

// Carga e inicialización de todas las rutas de la API
console.log('Cargando rutas...');

// Rutas de usuarios (registro, gestión de usuarios)
try {
    app.use('/api/usuarios', require('./routes/usuarioRoutes'));
    console.log('✓ Rutas de usuarios cargadas');
} catch (err) {
    console.error('✗ Error cargando rutas de usuarios:', err.message);
}

// Rutas de artículos (CRUD, upload de PDFs, volúmenes/números)
try {
    app.use('/api/articulos', require('./routes/articuloRoutes'));
    console.log('✓ Rutas de artículos cargadas');
} catch (err) {
    console.error('✗ Error cargando rutas de artículos:', err.message);
}

// Rutas de noticias (CRUD, upload de imágenes)
try {
    app.use('/api/noticias', require('./routes/noticiaRoutes'));
    console.log('✓ Rutas de noticias cargadas');
} catch (err) {
    console.error('✗ Error cargando rutas de noticias:', err.message);
}

// Rutas de videos (CRUD, embebido de YouTube)
try {
    app.use('/api/videos', require('./routes/videoRoutes'));
    console.log('✓ Rutas de videos cargadas');
} catch (err) {
    console.error('✗ Error cargando rutas de videos:', err.message);
}

// ========================================================================================
// RUTAS DE AUTENTICACIÓN
// ========================================================================================

// Importación de modelos para autenticación
const Usuario = require('./models/usuario');
const bcrypt = require('bcrypt');

/**
 * POST /api/login
 * Endpoint de autenticación de usuarios administradores
 * 
 * @body {string} username - Nombre de usuario
 * @body {string} password - Contraseña en texto plano
 * @returns {object} Token JWT y datos del usuario
 */
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        // Buscar usuario en la base de datos
        const user = await Usuario.findByUsername(username);
        if (!user) return res.status(401).json({ error: 'Usuario no encontrado' });
        
        // Verificar contraseña con bcrypt
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(401).json({ error: 'Contraseña incorrecta' });
        
        // Generar token JWT con expiración de 2 horas
        const token = jwt.sign({ idusuario: user.idusuario, username: user.username }, SECRET_KEY, { expiresIn: '2h' });
        
        // Retornar token y datos del usuario (sin la contraseña)
        res.json({ 
            token, 
            user: { 
                idusuario: user.idusuario, 
                username: user.username, 
                nombre: user.nombre, 
                apellido: user.apellido, 
                correo: user.correo 
            } 
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * GET /admin
 * Ruta protegida del panel de administración
 * Requiere token JWT válido
 */
app.get('/admin', validarToken, (req, res) => {
    res.json({ message: 'Bienvenido al panel de admin', user: req.user });
});

/**
 * GET /api/validate-token
 * Endpoint para validar token JWT sin retornar datos sensibles
 * Utilizado para mantener sesión activa en el frontend
 */
app.get('/api/validate-token', validarToken, (req, res) => {
    res.status(200).json({ valid: true, user: req.user });
});

// ========================================================================================
// CONFIGURACIÓN ADICIONAL DE CORS Y HEALTH CHECK
// ========================================================================================

// Middleware de CORS global para errores y rutas no encontradas
app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ? 'https://revista-explora-unison.vercel.app'
        : '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

/**
 * GET /health
 * Health check endpoint para monitoreo de Railway/Docker
 * @returns {object} Estado del servidor y timestamp
 */
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// ========================================================================================
// MIDDLEWARE DE MANEJO DE ERRORES Y RUTAS NO ENCONTRADAS
// ========================================================================================

/**
 * Middleware de manejo de errores globales
 * Captura cualquier error no manejado en las rutas
 */
app.use((err, req, res, next) => {
    console.error('Error global capturado:', err);
    res.status(500).json({ error: 'Error interno del servidor', details: err.message });
});

/**
 * Middleware para rutas no encontradas (404)
 * Debe ir al final de todas las rutas
 */
app.use((req, res) => {
    console.log('Ruta no encontrada:', req.path);
    res.status(404).json({ error: 'Ruta no encontrada' });
});

// ========================================================================================
// CONFIGURACIÓN DEL SERVIDOR
// ========================================================================================

// Puerto: Railway asigna automáticamente, fallback a 4000 para desarrollo local
const PORT = process.env.PORT || 4000;
console.log('Starting server with PORT:', PORT);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('process.env.PORT value:', process.env.PORT);
console.log('Forcing PORT to match Railway public networking...');

/**
 * Iniciar servidor HTTP
 * Bind a 0.0.0.0 para compatibilidad con Railway/Docker
 */
app.listen(PORT, '0.0.0.0', () => {
    console.log(`✓ Server listening on 0.0.0.0:${PORT}`);
    console.log('✓ Ready to accept HTTP connections');
    console.log('Available routes:');
    console.log('- GET /health');
    console.log('- /api/articulos');
    console.log('- /api/noticias'); 
    console.log('- /api/videos');
    console.log('- /api/usuarios');
});

console.log('✓ Script execution completed - waiting for connections');
