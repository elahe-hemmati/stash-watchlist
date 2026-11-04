import View from "./View.js";
import detailsMarkup from "./detailsMarkup.js";

class DetailsCarouselView extends View {
  _cloneCount = 5;
  _currentIndex = this._cloneCount;

  init() {
    this._slides = document.querySelectorAll(".carousel-slide");
    this._next = document.querySelector("#next");
    this._prev = document.querySelector("#prev");
    this._cardWrapper = document.querySelector(".media-card-wrapper");
    this._track = document.querySelector(".carousel-track");
    this._carousel = document.querySelector(".carousel");

    this._length = this._slides.length;

    this._updateDimensions();

    this._cloneLastSlides();
    this._cloneSlides();

    this._goToSlide(this._currentIndex);

    this._addHandlerNext();
    this._addHandlerPrev();
    this._addHandlerTouch();
    this._addHandlerKeyboard();

    window.addEventListener("resize", () => {
      this._updateDimensions();
      this._goToSlide(this._currentIndex);
    });
  }

  _cloneLastSlides() {
    this._lastSlides = [...this._slides].slice(-this._cloneCount);

    const clonedLastSlides = this._lastSlides.map((slide) =>
      slide.cloneNode(true),
    );

    detailsMarkup.setupPosterEvents(clonedLastSlides);

    clonedLastSlides.reverse().forEach((slide) => this._track.prepend(slide));
  }

  _cloneSlides() {
    this._firstSlides = [...this._slides].slice(0, this._cloneCount);

    const clonedSlides = this._firstSlides.map((slide) =>
      slide.cloneNode(true),
    );

    detailsMarkup.setupPosterEvents(clonedSlides);

    clonedSlides.forEach((slide) => this._track.append(slide));
  }

  _goToSlide(index) {
    this._track.style.transform = `translateX(-${this._compute * index}px)`;
  }

  _updateDimensions() {
    this._cardWidth = this._slides[0].getBoundingClientRect().width;
    this._gap = getComputedStyle(this._track).gap;
    this._compute = this._cardWidth + parseInt(this._gap);
  }

  nextSlide() {
    if (this._currentIndex >= this._length + this._cloneCount) return;

    this._currentIndex++;

    this._goToSlide(this._currentIndex);
  }

  prevSlide() {
    if (this._currentIndex <= this._cloneCount - 1) return;

    this._currentIndex--;

    this._goToSlide(this._currentIndex);
  }

  _addHandlerNext() {
    this._next.addEventListener("click", () => {
      this.nextSlide();
    });

    this._track.addEventListener("transitionend", (event) => {
      if (event.propertyName !== "transform") return;

      if (this._currentIndex === this._length + this._cloneCount) {
        this._track.classList.add("transition-none");

        this._currentIndex = this._cloneCount;
        this._goToSlide(this._currentIndex);

        this._track.offsetHeight;

        this._track.classList.remove("transition-none");
      }
    });
  }

  _addHandlerPrev() {
    this._prev.addEventListener("click", () => {
      this.prevSlide();
    });

    this._track.addEventListener("transitionend", (event) => {
      if (event.propertyName !== "transform") return;

      if (this._currentIndex === this._cloneCount - 1) {
        this._track.classList.add("transition-none");

        this._currentIndex = this._length + this._cloneCount - 1;

        this._goToSlide(this._currentIndex);

        this._track.offsetHeight;

        this._track.classList.remove("transition-none");
      }
    });
  }

  _addHandlerTouch() {
    let startX;

    this._track.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX;
    });

    this._track.addEventListener("touchend", (e) => {
      if (startX === undefined) return;
      const endX = e.changedTouches[0].clientX;

      const distance = startX - endX;
      startX = undefined;
      if (distance > 50) {
        this.nextSlide();
      }

      if (distance < -50) {
        this.prevSlide();
      }
    });
  }

  _addHandlerKeyboard() {
    this._carousel.addEventListener("keydown", (e) => {
      if (e.target.closest("button, a")) return;

      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        e.preventDefault();

        if (e.key === "ArrowRight") this.nextSlide();
        if (e.key === "ArrowLeft") this.prevSlide();
      }
    });
  }
}

export default new DetailsCarouselView();
