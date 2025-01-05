const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware для обслуживания статических файлов из папки "src" и корня приложения
app.use('/src', express.static(path.join(__dirname, 'src')));
app.use('/', express.static(path.join(__dirname, '')));

// Главная страница
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Запуск сервера
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
});
