const pool = require('../db/database');

// Obtener TODOS los videos para el catálogo
exports.getAllVideos = async (req, res) => {
  try {
    // El req.user.userId fue añadido por el authMiddleware
    // Podrías usarlo para filtrar videos "solo para este usuario"
    
    const [videos] = await pool.query('SELECT id, titulo, ruta_thumbnail FROM videos');
    res.json(videos);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error en el servidor');
  }
};

// Obtener UN video para el reproductor
exports.getVideoById = async (req, res) => {
  try {
    const [video] = await pool.query('SELECT * FROM videos WHERE id = ?', [req.params.id]);
    
    if (video.length === 0) {
      return res.status(404).json({ msg: 'Video no encontrado.' });
    }
    
    // Enviamos la info (incluida la ruta_video)
    res.json(video[0]);

  } catch (err) {
    console.error(err);
    res.status(500).send('Error en el servidor');
  }
};