document.addEventListener('DOMContentLoaded', () => {
  const video = document.getElementById('video');
  const playPauseBtn = document.getElementById('playPauseBtn');
  const muteBtn = document.getElementById('muteBtn');
  const fullscreenBtn = document.getElementById('fullscreenBtn');
  const progressBar = document.querySelector('.progress-bar');
  const volumeSlider = document.querySelector('.volume-slider');
  const videoContainer = document.querySelector('.video-frame');

  // Синхронизация времени
  async function syncTime() {
    const response = await fetch('/time'); // Запрос текущего времени
    const data = await response.json();
    video.currentTime = data.currentPlaybackTime; // Устанавливаем время
    video.play(); // Автоматически начинаем воспроизведение
  }

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

  // Update progress bar
  function updateProgress() {
    const progress = (video.currentTime / video.duration) * 100;
    progressBar.value = progress;
  }

  // Set video time based on progress bar
  function setVideoProgress() {
    video.currentTime = (progressBar.value * video.duration) / 100;
  }

  // Volume controls
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

  // Event listeners
  playPauseBtn.addEventListener('click', togglePlay);
  video.addEventListener('click', togglePlay);
  video.addEventListener('timeupdate', updateProgress);
  progressBar.addEventListener('change', setVideoProgress);
  muteBtn.addEventListener('click', toggleMute);
  volumeSlider.addEventListener('input', updateVolume);
  fullscreenBtn.addEventListener('click', toggleFullscreen);

  // Синхронизация времени при загрузке страницы
  syncTime();

  // Keyboard controls
  document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
      e.preventDefault();
      togglePlay();
    }
  });

  console.log('Video player initialized');
});
