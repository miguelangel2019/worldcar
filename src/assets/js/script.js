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

    const catalog = document.querySelector(".catalog");

    if (catalog) {
      const filters = Array.from(catalog.querySelectorAll(".catalog__filter select"));
      const vehicles = Array.from(catalog.querySelectorAll(".vehicle-card"));
      const resultCount = catalog.querySelector(".catalog__result-count");
      const emptyMessage = catalog.querySelector(".catalog__empty");

      const filterVehicles = () => {
        const selectedValues = filters.map((filter) => filter.value);
        let visibleCount = 0;

        vehicles.forEach((vehicle) => {
          const matches = ["brand", "model", "year", "condition"].every((attribute, index) => {
            return !selectedValues[index] || vehicle.dataset[attribute] === selectedValues[index];
          });

          vehicle.hidden = !matches;
          if (matches) {
            visibleCount += 1;
          }
        });

        resultCount.textContent = `${visibleCount} ${visibleCount === 1 ? "vehículo encontrado" : "vehículos encontrados"}`;
        emptyMessage.hidden = visibleCount > 0;
      };

      filters.forEach((filter) => filter.addEventListener("change", filterVehicles));
      filterVehicles();
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

const branchCards = document.querySelectorAll(".branch-card");
const branchMapDialog = document.querySelector(".branch-map-dialog");

if (branchMapDialog) {
  const branchMapTitle = branchMapDialog.querySelector("#branch-map-title");
  const branchMapFrame = branchMapDialog.querySelector(".branch-map-dialog__frame");
  const branchMapClose = branchMapDialog.querySelector(".branch-map-dialog__close");

  const openBranchMap = (card) => {
    const city = card.dataset.city;
    const coordinates = card.dataset.coordinates;
    const mapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(coordinates)}&z=16&output=embed`;

    branchMapTitle.textContent = `Sede ${city}`;
    branchMapFrame.src = mapUrl;
    branchMapDialog.showModal();
  };

  branchCards.forEach((card) => {
    card.addEventListener("click", (event) => {
      if (!event.target.closest("a")) {
        openBranchMap(card);
      }
    });
    card.addEventListener("keydown", (event) => {
      if (event.target === card && (event.key === "Enter" || event.key === " ")) {
        event.preventDefault();
        openBranchMap(card);
      }
    });
  });

  branchMapClose.addEventListener("click", () => branchMapDialog.close());
  branchMapDialog.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      branchMapDialog.close();
    }
  });
  branchMapDialog.addEventListener("click", (event) => {
    if (event.target === branchMapDialog) {
      branchMapDialog.close();
    }
  });
  branchMapDialog.addEventListener("close", () => {
    branchMapFrame.removeAttribute("src");
  });
}

const testimonialsCarousel = document.querySelector(".testimonials__carousel");

if (testimonialsCarousel) {
  const testimonials = Array.from(testimonialsCarousel.querySelectorAll(".testimonial-card"));
  const previousButton = document.querySelector(".testimonials__previous");
  const nextButton = document.querySelector(".testimonials__next");
  const status = document.querySelector(".testimonials__status");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let autoplay;

  const updateControls = () => {
    const viewportBounds = testimonialsCarousel.getBoundingClientRect();
    const visibleIndexes = testimonials.reduce((indexes, card, index) => {
      const cardBounds = card.getBoundingClientRect();
      if (cardBounds.right > viewportBounds.left + 1 && cardBounds.left < viewportBounds.right - 1) {
        indexes.push(index);
      }
      return indexes;
    }, []);

    if (visibleIndexes.length > 0) {
      status.textContent = `Mostrando ${visibleIndexes[0] + 1}-${visibleIndexes[visibleIndexes.length - 1] + 1} de ${testimonials.length}`;
    }
  };

  const scrollCarousel = (direction) => {
    const maxScroll = testimonialsCarousel.scrollWidth - testimonialsCarousel.clientWidth;
    const atStart = testimonialsCarousel.scrollLeft <= 1;
    const atEnd = testimonialsCarousel.scrollLeft >= maxScroll - 1;
    const target = direction > 0
      ? (atEnd ? 0 : Math.min(testimonialsCarousel.scrollLeft + testimonialsCarousel.clientWidth, maxScroll))
      : (atStart ? maxScroll : Math.max(testimonialsCarousel.scrollLeft - testimonialsCarousel.clientWidth, 0));

    testimonialsCarousel.scrollTo({
      left: target,
      behavior: reducedMotion.matches ? "auto" : "smooth"
    });
  };

  const startAutoplay = () => {
    window.clearInterval(autoplay);
    if (!reducedMotion.matches && document.visibilityState === "visible") {
      autoplay = window.setInterval(() => scrollCarousel(1), 5000);
    }
  };

  previousButton.addEventListener("click", () => scrollCarousel(-1));
  nextButton.addEventListener("click", () => scrollCarousel(1));
  testimonialsCarousel.addEventListener("scroll", updateControls, { passive: true });
  window.addEventListener("resize", updateControls);
  document.addEventListener("visibilitychange", startAutoplay);
  reducedMotion.addEventListener("change", startAutoplay);
  updateControls();
  startAutoplay();
}
