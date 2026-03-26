document.addEventListener("DOMContentLoaded", () => {
    const messages = [
      "Tidak semua hari harus terasa kuat. Ada hari dimana tugas kita hanya bertahan, bernapas, dan melewati waktu pelan-pelan. Kalau hari ini terasa berat, tidak apa-apa. Dunia tidak akan runtuh hanya karena kamu sedang lelah.",
      "Kadang yang membuat seseorang capek bukan pekerjaannya, bukan masalahnya, tapi karena dia harus terlihat baik-baik saja setiap hari. Jadi kalau suatu saat kamu tidak baik-baik saja, tidak apa-apa. Tidak semua hal harus kamu hadapi sendirian.",
      "Kamu tidak harus selalu menjadi orang kuat, orang ceria, atau orang yang mengerti semua hal. Kadang menjadi manusia yang sedang bingung, sedang takut, dan sedang lelah juga tidak apa-apa. Itu bukan lemah, itu manusia.",
      "Aku tidak selalu punya solusi untuk semua hal yang kamu rasakan. Tapi setidaknya aku bisa jadi seseorang yang tidak pergi saat kamu sedang tidak baik-baik saja. Kadang yang dibutuhkan seseorang bukan jawaban, tapi seseorang yang tetap tinggal."
    ];
  
    let currentIndex = 0;
  
    const messageText = document.getElementById("message-text");
    const pageIndicator = document.getElementById("page-indicator");
    const prevBtn = document.getElementById("prev-btn");
    const nextBtn = document.getElementById("next-btn");
  
    function updateMessage() {
      messageText.textContent = messages[currentIndex];
      pageIndicator.textContent = `${String(currentIndex + 1).padStart(2, "0")} / ${String(messages.length).padStart(2, "0")}`;
  
      prevBtn.disabled = currentIndex === 0;
      nextBtn.textContent = currentIndex === messages.length - 1 ? "Again" : "Next";
    }
  
    prevBtn.addEventListener("click", () => {
      if (currentIndex > 0) {
        currentIndex--;
        updateMessage();
      }
    });
  
    nextBtn.addEventListener("click", () => {
      if (currentIndex < messages.length - 1) {
        currentIndex++;
      } else {
        currentIndex = 0;
      }
      updateMessage();
    });
  
    document.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft" && currentIndex > 0) {
        currentIndex--;
        updateMessage();
      }
  
      if (event.key === "ArrowRight") {
        if (currentIndex < messages.length - 1) {
          currentIndex++;
        } else {
          currentIndex = 0;
        }
        updateMessage();
      }
    });
  
    updateMessage();
  });