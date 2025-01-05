const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Путь к видеофайлу
const videoPath = path.join(__dirname, 'movie.mp4'); // Замените 'movie.mp4' на ваш фильм
const serverStartTime = Date.now(); // Время запуска сервера

// Маршрут для главной страницы
app.use('/', express.static(path.join(__dirname, '')));

// Маршрут для видео
app.get('/video', (req, res) => {
  const range = req.headers.range;
  if (!range) {
    return res.status(400).send('Requires Range header');
  }

  const videoSize = fs.statSync(videoPath).size;
  const CHUNK_SIZE = 10 ** 6; // 1MB
  const start = Number(range.replace(/\D/g, ''));
  const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

  const videoStream = fs.createReadStream(videoPath, { start, end });

  res.writeHead(206, {
    'Content-Range': `bytes ${start}-${end}/${videoSize}`,
    'Accept-Ranges': 'bytes',
    'Content-Length': end - start + 1,
    'Content-Type': 'video/mp4',
  });

  videoStream.pipe(res);
});

// API для получения текущего времени воспроизведения
app.get('/current-time', (req, res) => {
  const elapsedTime = (Date.now() - serverStartTime) / 1000; // Время с момента запуска сервера в секундах
  res.json({ currentTime: elapsedTime });
});

// Запуск сервера
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
