// Log global de errores fatales
process.on('uncaughtException', err => {
    console.error('Uncaught Exception:', err);
    console.error('Stack:', err.stack);
    process.exit(1);
});
process.on('unhandledRejection', err => {
    console.error('Unhandled Rejection:', err);
    console.error('Stack:', err.stack);
    process.exit(1);
});

process.on('SIGTERM', () => {
    console.log('Received SIGTERM signal');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('Received SIGINT signal');
    process.exit(0);
});

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

const app = express();
console.log('✓ Express app created');
const SECRET_KEY = process.env.SECRET_KEY || 'secret';
console.log('✓ Secret key configured');


// CORS restringido al dominio de Vercel en producción
app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ? 'https://revista-explora-unison.vercel.app'
        : '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Middleware de logging para todas las requests
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});


// Rutas API
console.log('Cargando rutas...');
try {
    app.use('/api/usuarios', require('./routes/usuarioRoutes'));
    console.log('✓ Rutas de usuarios cargadas');
} catch (err) {
    console.error('✗ Error cargando rutas de usuarios:', err.message);
}

try {
    app.use('/api/articulos', require('./routes/articuloRoutes'));
    console.log('✓ Rutas de artículos cargadas');
} catch (err) {
    console.error('✗ Error cargando rutas de artículos:', err.message);
}

try {
    app.use('/api/noticias', require('./routes/noticiaRoutes'));
    console.log('✓ Rutas de noticias cargadas');
} catch (err) {
    console.error('✗ Error cargando rutas de noticias:', err.message);
}

try {
    app.use('/api/videos', require('./routes/videoRoutes'));
    console.log('✓ Rutas de videos cargadas');
} catch (err) {
    console.error('✗ Error cargando rutas de videos:', err.message);
}

// Ruta de login de usuario
const Usuario = require('./models/usuario');
const bcrypt = require('bcrypt');
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await Usuario.findByUsername(username);
        if (!user) return res.status(401).json({ error: 'Usuario no encontrado' });
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(401).json({ error: 'Contraseña incorrecta' });
        // Usar idusuario (minúsculas) en el token y la respuesta
        const token = jwt.sign({ idusuario: user.idusuario, username: user.username }, SECRET_KEY, { expiresIn: '2h' });
        res.json({ token, user: { idusuario: user.idusuario, username: user.username, nombre: user.nombre, apellido: user.apellido, correo: user.correo } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Ruta protegida usando middleware
app.get('/admin', validarToken, (req, res) => {
    res.json({ message: 'Bienvenido al panel de admin', user: req.user });
});

// Endpoint para validar token JWT (debe ir antes de servir el frontend)
app.get('/api/validate-token', validarToken, (req, res) => {
    res.status(200).json({ valid: true, user: req.user });
});

// Middleware de CORS global para errores y rutas no encontradas
app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ? 'https://revista-explora-unison.vercel.app'
        : '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Ruta de health check para Railway
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Middleware de manejo de errores globales
app.use((err, req, res, next) => {
    console.error('Error global capturado:', err);
    res.status(500).json({ error: 'Error interno del servidor', details: err.message });
});

// Ruta por defecto (sin servir frontend)
app.use((req, res) => {
    console.log('Ruta no encontrada:', req.path);
    res.status(404).json({ error: 'Ruta no encontrada' });
});

const PORT = process.env.PORT || 4000;
console.log('Starting server with PORT:', PORT);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('process.env.PORT value:', process.env.PORT);
console.log('Forcing PORT to match Railway public networking...');
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
