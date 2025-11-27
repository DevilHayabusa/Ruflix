
const express = require('express');
const path = require('path');
const fs = require('fs');

//Crear una instancia de la aplicación express
const app = express();
const PORT = 3000; 
const videosDir = path.join(__dirname, 'public', 'peliculas');

app.use(express.static(path.join(__dirname, 'public')));

//api
app.get('/api/peliculas', (req, res) => {
    fs.readdir(videosDir, (err, files) => {
        if (err) {
            console.error('Error al leer el directorio de videos:', err);
            return res.status(500).json({ error: 'Error al leer el directorio de videos' });
        }
        //filtramos solo archivos de video
        const videoFiles = files.filter(file => {
            const ext = path.extname(file).toLowerCase();
            return ext === '.mp4' || ext === '.mkv' || ext === '.avi';
        });
        res.json(videoFiles);
    });
});


//Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor "Mi Netflix" iniciado en http://localhost:${PORT}`);
});