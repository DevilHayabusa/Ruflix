const { exec } = require('child_process');
const path = require('path');

// USO: node ffmpeg.js "ruta/al/video.mp4" "ruta/al/thumbnail.jpg"
const videoPath = process.argv[2];
const outputPath = process.argv[3];

if (!videoPath || !outputPath) {
  console.error('Error: Debes proveer la ruta del video y la ruta de salida.');
  console.log('Uso: node ffmpeg.js "ruta/video.mp4" "ruta/thumbnail.jpg"');
  process.exit(1);
}

// El comando de FFMPEG
// -i [input] -ss [tiempo] -vframes 1 [output]
// -ss 00:00:05 = toma el fotograma a los 5 segundos
// -vframes 1 = solo toma 1 fotograma
const command = `ffmpeg -i "${videoPath}" -ss 00:00:05 -vframes 1 "${outputPath}"`;

exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error al ejecutar ffmpeg: ${error.message}`);
    return;
  }
  if (stderr) {
    console.log(`ffmpeg stderr: ${stderr}`);
  }
  console.log(`¡Thumbnail generado con éxito en ${outputPath}!`);
});