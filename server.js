const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Укажите путь к фильму
const videoPath = path.join(__dirname, 'movie.mp4');

// Определите битрейт (бит в секунду) фильма
const videoBitrate = 1000000; // Например, 1 Мбит/с (проверьте, используя ffmpeg)

// Рассчитаем продолжительность фильма (в секундах)
const videoFileSize = fs.statSync(videoPath).size; // Размер файла в байтах
const videoDurationInSeconds = videoFileSize / (videoBitrate / 8); // Длительность = Размер файла / Байт/секунду

// Фиксируем момент запуска фильма
const serverStartTime = Date.now();

app.use(express.static(path.join(__dirname)));

// Маршрут для передачи видео
app.get('/video', (req, res) => {
  const stat = fs.statSync(videoPath);
  const fileSize = stat.size;

  // Рассчитываем текущую позицию фильма
  const timeElapsedSinceStart = (Date.now() - serverStartTime) / 1000; // В секундах
  const currentPlaybackTime = Math.min(timeElapsedSinceStart, videoDurationInSeconds);

  // Рассчитываем начальную позицию в байтах
  const startByte = Math.floor((currentPlaybackTime / videoDurationInSeconds) * fileSize);

  const range = req.headers.range;
  if (range) {
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    const chunkSize = end - start + 1;
    const file = fs.createReadStream(videoPath, { start, end });
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunkSize,
      'Content-Type': 'video/mp4',
    };

    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const file = fs.createReadStream(videoPath, { start: startByte });
    const head = {
      'Content-Length': fileSize - startByte,
      'Content-Type': 'video/mp4',
    };

    res.writeHead(200, head);
    file.pipe(res);
  }
});

// Маршрут для передачи текущего времени
app.get('/time', (req, res) => {
  const timeElapsedSinceStart = (Date.now() - serverStartTime) / 1000; // В секундах
  const currentPlaybackTime = Math.min(timeElapsedSinceStart, videoDurationInSeconds);

  res.json({ currentPlaybackTime });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Video duration is approximately ${Math.round(videoDurationInSeconds)} seconds.`);
});
