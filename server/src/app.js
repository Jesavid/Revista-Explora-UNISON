// ...existing code...
const express = require('express');
const path = require('path');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const validarToken = require('./middlewares/validarToken');

const app = express();
const SECRET_KEY = process.env.SECRET_KEY || 'secret';

app.use(cors());
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

// Servir frontend compilado
app.use(express.static(path.join(__dirname, '../client/build')));
app.use((req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server corriendo en http://localhost:${PORT}`));
