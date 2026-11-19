const carousel = document.querySelector(".carousel");

if (carousel) {
  const slides = Array.from(carousel.querySelectorAll(".carousel__slide"));
  const dots = Array.from(carousel.querySelectorAll(".carousel__dot"));
  const currentCounter = carousel.querySelector(".carousel__current");
  const previousButton = carousel.querySelector(".carousel__previous");
  const nextButton = carousel.querySelector(".carousel__next");
  const menuToggle = carousel.querySelector(".menu-toggle");
  const navigation = carousel.querySelector(".navigation");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let activeIndex = 0;
  let autoplay;

  const showSlide = (index) => {
    activeIndex = (index + slides.length) % slides.length;

    slides.forEach((slide, slideIndex) => {
      const isActive = slideIndex === activeIndex;
      slide.classList.toggle("is-active", isActive);
      slide.setAttribute("aria-hidden", String(!isActive));
      dots[slideIndex].classList.toggle("is-active", isActive);
      dots[slideIndex].setAttribute("aria-current", String(isActive));
    });

    currentCounter.textContent = String(activeIndex + 1).padStart(2, "0");
  };

  const stopAutoplay = () => {
    window.clearInterval(autoplay);
  };

  const startAutoplay = () => {
    stopAutoplay();
    if (!reducedMotion.matches) {
      autoplay = window.setInterval(() => showSlide(activeIndex + 1), 6000);
    }
  };

  previousButton.addEventListener("click", () => {
    showSlide(activeIndex - 1);
    startAutoplay();
  });

  nextButton.addEventListener("click", () => {
    showSlide(activeIndex + 1);
    startAutoplay();
  });

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      showSlide(index);
      startAutoplay();
    });
  });

  carousel.addEventListener("mouseenter", stopAutoplay);
  carousel.addEventListener("mouseleave", startAutoplay);
  carousel.addEventListener("focusin", stopAutoplay);
  carousel.addEventListener("focusout", (event) => {
    if (!carousel.contains(event.relatedTarget)) {
      startAutoplay();
    }
  });

  reducedMotion.addEventListener("change", startAutoplay);

  menuToggle.addEventListener("click", () => {
    const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isExpanded));
    menuToggle.setAttribute("aria-label", isExpanded ? "Abrir menú" : "Cerrar menú");
    navigation.classList.toggle("is-open", !isExpanded);
  });

  navigation.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Abrir menú");
      navigation.classList.remove("is-open");
    }
  });

  startAutoplay();
}
