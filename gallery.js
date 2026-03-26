document.addEventListener("DOMContentLoaded", () => {
    const galleryItems = [
      {
        image: "assets/images/foto1.jpg",
        caption: "Awal mula bisa dm kenalan karena ini ya gaa wkwk."
      },
      {
        image: "assets/images/foto2.jpg",
        caption: "Ni seenaknya ss trus ta gambar, maapin yak."
      },
      {
        image: "assets/images/foto3.jpg",
        caption: "Pertama kali diajak fotbarr walau di game haha."
      },
      {
        image: "assets/images/foto4.jpg",
        caption: "Sama aja kek tadi cuman dari depan wkwk."
      }
    ];
  
    let currentIndex = 0;
  
    const galleryImage = document.getElementById("gallery-image");
    const galleryCaption = document.getElementById("gallery-caption");
    const pageIndicator = document.getElementById("page-indicator");
    const prevBtn = document.getElementById("prev-btn");
    const nextBtn = document.getElementById("next-btn");
  
    function updateGallery() {
      const currentItem = galleryItems[currentIndex];
  
      galleryImage.src = currentItem.image;
      galleryImage.alt = currentItem.caption;
      galleryCaption.textContent = currentItem.caption;
      pageIndicator.textContent = `${String(currentIndex + 1).padStart(2, "0")} / ${String(galleryItems.length).padStart(2, "0")}`;
  
      prevBtn.disabled = currentIndex === 0;
      nextBtn.textContent = currentIndex === galleryItems.length - 1 ? "Again" : "Next";
    }
  
    prevBtn.addEventListener("click", () => {
      if (currentIndex > 0) {
        currentIndex--;
        updateGallery();
      }
    });
  
    nextBtn.addEventListener("click", () => {
      if (currentIndex < galleryItems.length - 1) {
        currentIndex++;
      } else {
        currentIndex = 0;
      }
      updateGallery();
    });
  
    document.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft" && currentIndex > 0) {
        currentIndex--;
        updateGallery();
      }
  
      if (event.key === "ArrowRight") {
        if (currentIndex < galleryItems.length - 1) {
          currentIndex++;
        } else {
          currentIndex = 0;
        }
        updateGallery();
      }
    });
  
    galleryImage.addEventListener("error", () => {
      galleryCaption.textContent = "Gambar tidak ditemukan. Cek nama file dan path folder assets/images.";
    });
  
    updateGallery();
  });