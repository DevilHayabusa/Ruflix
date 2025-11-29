const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { getAllVideos, getVideoById } = require('../controllers/videoController');

// @ruta   GET /api/videos
// @desc   Obtener todos los videos (para el catálogo)
// @acceso Privado (requiere token)
router.get('/', auth, getAllVideos);

// @ruta   GET /api/videos/:id
// @desc   Obtener un video específico (para el reproductor)
// @acceso Privado
router.get('/:id', auth, getVideoById);

module.exports = router;