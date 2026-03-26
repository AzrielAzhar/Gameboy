document.addEventListener("DOMContentLoaded", () => {
    const progressBar = document.getElementById("progress");
    const loadingText = document.getElementById("loading-text");
    const progressNumber = document.getElementById("progress-number");
  
    let progress = 0;
  
    function getLoadingMessage(value) {
      if (value < 25) return "> INITIALIZING...";
      if (value < 50) return "> BOOTING SYSTEM...";
      if (value < 85) return "> LOADING GAME DATA...";
      if (value < 100) return "> ALMOST READY...";
      return "> READY!";
    }
  
    function loading() {
      progressBar.style.width = `${progress}%`;
      progressNumber.textContent = `${progress}%`;
      loadingText.textContent = getLoadingMessage(progress);
  
      if (progress < 100) {
        progress++;
        setTimeout(loading, 40);
      } else {
        setTimeout(() => {
          window.location.href = "menu.html";
        }, 700);
      }
    }
  
    loading();
  });