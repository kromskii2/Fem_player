document.addEventListener('DOMContentLoaded', async () => {
  const video = document.getElementById('video');
  const playPauseBtn = document.getElementById('playPauseBtn');
  const muteBtn = document.getElementById('muteBtn');
  const fullscreenBtn = document.getElementById('fullscreenBtn');
  const progressBar = document.querySelector('.progress-bar');
  const volumeSlider = document.querySelector('.volume-slider');
  const videoContainer = document.querySelector('.video-frame');

  // Получение текущего времени воспроизведения с сервера
  async function fetchCurrentTime() {
    try {
      const response = await fetch('/current-time');
      if (!response.ok) {
        throw new Error('Failed to fetch current time');
      }
      const data = await response.json();
      return data.currentTime; // Сервер возвращает время в секундах
    } catch (error) {
      console.error('Error fetching current time:', error);
      return 0; // Если ошибка, начать воспроизведение с начала
    }
  }

  // Синхронизация времени видео с сервером
  async function syncVideo() {
    const currentTime = await fetchCurrentTime(); // Получаем время от сервера
    video.currentTime = currentTime; // Устанавливаем текущее время видео
  }

  // Событие, когда метаданные видео загружены
  video.addEventListener('loadedmetadata', async () => {
    await syncVideo(); // Синхронизация видео с сервера
    video.play(); // Запускаем видео
  });

  // Play/Pause
  function togglePlay() {
    if (video.paused) {
      video.play();
      playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
    } else {
      video.pause();
      playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    }
  }

  // Обновление прогресса
  function updateProgress() {
    const progress = (video.currentTime / video.duration) * 100;
    progressBar.value = progress;
  }

  // Установка времени видео через прогресс-бар
  function setVideoProgress() {
    video.currentTime = (progressBar.value * video.duration) / 100;
  }

  // Громкость
  function updateVolume() {
    video.volume = volumeSlider.value;
    updateVolumeIcon();
  }

  function toggleMute() {
    video.muted = !video.muted;
    updateVolumeIcon();
  }

  function updateVolumeIcon() {
    const icon = muteBtn.querySelector('i');
    if (video.muted || video.volume === 0) {
      icon.className = 'fas fa-volume-mute';
      volumeSlider.value = 0;
    } else {
      icon.className = 'fas fa-volume-up';
      volumeSlider.value = video.volume;
    }
  }

  // Fullscreen
  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      videoContainer.requestFullscreen();
      fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
    } else {
      document.exitFullscreen();
      fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
    }
  }

  // Слушатели событий
  playPauseBtn.addEventListener('click', togglePlay);
  video.addEventListener('click', togglePlay);
  video.addEventListener('timeupdate', updateProgress);
  progressBar.addEventListener('change', setVideoProgress);
  muteBtn.addEventListener('click', toggleMute);
  volumeSlider.addEventListener('input', updateVolume);
  fullscreenBtn.addEventListener('click', toggleFullscreen);

  // Поддержка клавиш на клавиатуре
  document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
      e.preventDefault();
      togglePlay();
    }
  });

  console.log('Video player initialized and synced with the server.');
});
