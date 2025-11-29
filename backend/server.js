
const express = require('express');
const cors = require('cors');
require('dotenv').config();

//Crear una instancia de la aplicación express
const app = express();
const port = process.env.PORT || 3000;

//mideleware
app.use(cors());
app.use(express.json());
app.use(express.static('../frontend'));
app.use('/media', express.static('../media'));
// Rutas de la API
app.use('/api/auth', require('./routes/auth'));
app.use('/api/videos', require('./routes/videos'));

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});