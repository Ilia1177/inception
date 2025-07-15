document.addEventListener("DOMContentLoaded", function () {
  const prevButton = document.querySelector(".carousel-prev");
  const nextButton = document.querySelector(".carousel-next");
  const container = document.querySelector(".carousel-container");
  const slides = document.querySelectorAll(".carousel-slide");
  let currentSlide = 0;

  //swipe
  let touchStartX = 0;
  let touchEndX = 0;
  container.addEventListener("touchstart", handleTouchStart);
  container.addEventListener("touchmove", handleTouchMove);
  container.addEventListener("touchend", handleTouchEnd);
  function handleTouchStart(event) {
    touchStartX = event.touches[0].clientX;
  }
  function handleTouchMove(event) {
    touchEndX = event.touches[0].clientX;
  }
  function handleTouchEnd() {
    // Calculate the swipe direction and update the current slide
    const swipeDistance = touchStartX - touchEndX;
    if (swipeDistance > 50 && currentSlide < slides.length - 1) {
      // Swipe left (next)
      currentSlide++;
    } else if (swipeDistance < -50 && currentSlide > 0) {
      // Swipe right (previous)
      currentSlide--;
    }
    updateCarousel(currentSlide);
  }

  nextButton.addEventListener("click", () => {
    if (currentSlide < slides.length - 1) {
      currentSlide++;
      updateCarousel(currentSlide);
    }
  });

  prevButton.addEventListener("click", () => {
    if (currentSlide > 0) {
      currentSlide--;
      updateCarousel(currentSlide);
    }
  });

  const imageNames = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K"]; // Add more names as needed

  function updateCarousel(index) {
    const slideWidth = slides[0].offsetWidth;
    container.style.transform = `translateX(-${currentSlide * slideWidth}px)`;
    // display print number
    // const imageNameElement = document.getElementById("image-name");
    // imageNameElement.textContent = imageNames[index];
  }

  updateCarousel(currentSlide);
});
