document.addEventListener("DOMContentLoaded", () => {
    const menuItems = document.querySelectorAll(".menu-item");
    let currentIndex = 0;
  
    function updateMenu() {
      menuItems.forEach((item, index) => {
        item.classList.toggle("active", index === currentIndex);
      });
    }
  
    function goToSelectedMenu() {
      const selectedItem = menuItems[currentIndex];
      const targetLink = selectedItem.dataset.link;
  
      if (targetLink) {
        window.location.href = targetLink;
      }
    }
  
    document.addEventListener("keydown", (event) => {
      if (event.key === "ArrowUp") {
        currentIndex = (currentIndex - 1 + menuItems.length) % menuItems.length;
        updateMenu();
      }
  
      if (event.key === "ArrowDown") {
        currentIndex = (currentIndex + 1) % menuItems.length;
        updateMenu();
      }
  
      if (event.key === "Enter") {
        goToSelectedMenu();
      }
    });
  
    menuItems.forEach((item, index) => {
      item.addEventListener("click", () => {
        currentIndex = index;
        updateMenu();
        goToSelectedMenu();
      });
    });
  
    updateMenu();
  });