/**
 * MIDDLEWARE DE VALIDACIÓN DE TOKEN JWT
 * 
 * Middleware para proteger rutas que requieren autenticación
 * Valida tokens JWT en el header Authorization
 * 
 * Formato esperado: "Authorization: Bearer <token>"
 */

const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY || 'secret';

/**
 * Valida token JWT en las peticiones HTTP
 * 
 * @param {Object} req - Request object de Express
 * @param {Object} res - Response object de Express  
 * @param {Function} next - Next middleware function
 * 
 * @returns {void} Continúa al siguiente middleware si el token es válido
 * @throws {401} Si no se proporciona token
 * @throws {403} Si el token es inválido o expirado
 */
function validarToken(req, res, next) {
    // Extraer token del header Authorization
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Formato: "Bearer <token>"
    
    // Verificar que el token esté presente
    if (!token) {
        return res.status(401).json({ error: 'Token requerido' });
    }

    // Verificar y decodificar el token JWT
    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Token inválido' });
        }
        
        // Agregar información del usuario al request para uso en rutas protegidas
        req.user = user;
        next();
    });
}

module.exports = validarToken;
