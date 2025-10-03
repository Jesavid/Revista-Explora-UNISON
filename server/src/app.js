// Log global de errores fatales
process.on('uncaughtException', err => {
    console.error('Uncaught Exception:', err);
});
process.on('unhandledRejection', err => {
    console.error('Unhandled Rejection:', err);
});
// ...existing code...
const express = require('express');
const path = require('path');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const validarToken = require('./middlewares/validarToken');

const app = express();
const SECRET_KEY = process.env.SECRET_KEY || 'secret';


// CORS restringido al dominio de Vercel en producción
app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ? 'https://revista-explora-unison.vercel.app'
        : '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());


// Rutas API
app.use('/api/usuarios', require('./routes/usuarioRoutes'));
app.use('/api/articulos', require('./routes/articuloRoutes'));
app.use('/api/noticias', require('./routes/noticiaRoutes'));
app.use('/api/videos', require('./routes/videoRoutes'));

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

// Ruta por defecto (sin servir frontend)
app.use((req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

const PORT = process.env.PORT || 8080;
console.log('Starting server with PORT:', PORT);
console.log('NODE_ENV:', process.env.NODE_ENV);
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server corriendo en http://0.0.0.0:${PORT}`);
    console.log('Rutas disponibles:');
    console.log('- GET /health');
    console.log('- /api/articulos');
    console.log('- /api/noticias'); 
    console.log('- /api/videos');
    console.log('- /api/usuarios');
});
