const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  // Obtener token del header
  const token = req.header('x-auth-token');

  // Si no hay token
  if (!token) {
    return res.status(401).json({ msg: 'No hay token, permiso denegado.' });
  }

  // Verificar token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Guardamos el payload (ej: { userId: 5 }) en req.user
    next(); // Pasa al siguiente middleware o al controlador
  } catch (err) {
    res.status(401).json({ msg: 'Token no es válido.' });
  }
};