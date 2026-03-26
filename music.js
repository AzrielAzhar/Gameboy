document.addEventListener("DOMContentLoaded", () => {
    const playlist = [
      {
        title: "Perfect",
        artist: "Ed Sheeran",
        src: "assets/audio/lagu1.mp3"
      },
      {
        title: "Pesan Terakhir",
        artist: "Lyodra",
        src: "assets/audio/lagu2.mp3"
      },
      {
        title: "Eight",
        artist: "IU",
        src: "assets/audio/lagu3.mp3"
      }
    ];
  
    let currentIndex = 0;
    let isPlaying = false;
  
    const audio = document.getElementById("audio");
    const songTitle = document.getElementById("song-title");
    const songArtist = document.getElementById("song-artist");
    const playBtn = document.getElementById("play-btn");
    const prevBtn = document.getElementById("prev-btn");
    const nextBtn = document.getElementById("next-btn");
    const progress = document.getElementById("progress");
    const currentTimeEl = document.getElementById("current-time");
    const durationEl = document.getElementById("duration");
    const pageIndicator = document.getElementById("page-indicator");
  
    function formatTime(time) {
      if (isNaN(time)) return "00:00";
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    }
  
    function loadSong(index) {
      const song = playlist[index];
      audio.src = song.src;
      songTitle.textContent = song.title;
      songArtist.textContent = song.artist;
      pageIndicator.textContent = `${String(index + 1).padStart(2, "0")} / ${String(playlist.length).padStart(2, "0")}`;
      progress.style.width = "0%";
      currentTimeEl.textContent = "00:00";
      durationEl.textContent = "00:00";
    }
  
    function playSong() {
        audio.play()
          .then(() => {
            isPlaying = true;
            playBtn.textContent = "Pause";
          })
          .catch(() => {
            isPlaying = false;
            playBtn.textContent = "Play";
            songArtist.textContent = "Audio gagal diputar. Cek file atau izin browser.";
          });
      }
  
    function pauseSong() {
      audio.pause();
      isPlaying = false;
      playBtn.textContent = "Play";
    }
  
    playBtn.addEventListener("click", () => {
      if (isPlaying) {
        pauseSong();
      } else {
        playSong();
      }
    });
  
    prevBtn.addEventListener("click", () => {
      currentIndex = (currentIndex - 1 + playlist.length) % playlist.length;
      loadSong(currentIndex);
  
      if (isPlaying) {
        playSong();
      }
    });
  
    nextBtn.addEventListener("click", () => {
      currentIndex = (currentIndex + 1) % playlist.length;
      loadSong(currentIndex);
  
      if (isPlaying) {
        playSong();
      }
    });
  
    audio.addEventListener("loadedmetadata", () => {
      durationEl.textContent = formatTime(audio.duration);
    });
  
    audio.addEventListener("timeupdate", () => {
      if (!audio.duration) return;
      const progressPercent = (audio.currentTime / audio.duration) * 100;
      progress.style.width = `${progressPercent}%`;
      currentTimeEl.textContent = formatTime(audio.currentTime);
    });
  
    audio.addEventListener("ended", () => {
      currentIndex = (currentIndex + 1) % playlist.length;
      loadSong(currentIndex);
      playSong();
    });
  
    audio.addEventListener("error", () => {
      songArtist.textContent = "Audio tidak ditemukan. Cek nama file dan path assets/audio.";
      pauseSong();
    });
  
    document.addEventListener("keydown", (event) => {
      if (event.code === "Space") {
        event.preventDefault();
        if (isPlaying) {
          pauseSong();
        } else {
          playSong();
        }
      }
  
      if (event.key === "ArrowLeft") {
        currentIndex = (currentIndex - 1 + playlist.length) % playlist.length;
        loadSong(currentIndex);
  
        if (isPlaying) {
          playSong();
        }
      }
  
      if (event.key === "ArrowRight") {
        currentIndex = (currentIndex + 1) % playlist.length;
        loadSong(currentIndex);
  
        if (isPlaying) {
          playSong();
        }
      }
    });
  
    window.addEventListener("beforeunload", () => {
      audio.pause();
    });
  
    loadSong(currentIndex);
  });