import * as assets from "../helpers/asset.js";
import * as helper from "../helpers/helper.js";
import posterView from "./posterView.js";

class mediaCarouselView extends posterView {
  _isAnimating = false;
  _cloneCount = 2;
  _activeCard = this._cloneCount;
  _autoPlayTimer;
  _parentElement = document.querySelector(".discovery-carousel-track");
  _track = document.querySelector(".discovery-carousel-track");
  _discoverySection = document.querySelector(".discovery-carousel-section");

  renderSkeleton() {
    const skeletonCard = (position) => `
    <div
      aria-hidden="true"
      class="absolute top-0 left-1/2 h-full w-[70%] overflow-hidden rounded-[40px] border border-dark-black/10 bg-light-cream/60 shadow-xl animate-pulse dark:border-light-cream/10 dark:bg-dark-black/60 ${position}"
    >
      <!-- Backdrop Overlay -->
      <div class="absolute inset-0 bg-gradient-to-t from-dark-black/90 via-dark-black/30 to-transparent"></div>

      <!-- Media Type Badge -->
      <div class="absolute top-3 left-3 h-6 w-16 rounded-md bg-amber-600/20 sm:top-6 sm:left-8 sm:h-7 sm:w-20 dark:bg-amber-400/20"></div>

      <!-- Media Info -->
      <div class="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-4 sm:flex-row sm:items-end sm:justify-between sm:gap-4 sm:p-8">

        <!-- Title and Genre -->
        <div class="w-full min-w-0 sm:flex-1">
          <div class="h-6 w-3/4 max-w-xs rounded-lg bg-light-cream/30 sm:h-9"></div>
          <div class="mt-3 h-3 w-1/3 rounded bg-light-cream/20 sm:mt-4"></div>
        </div>

        <!-- Additional Details -->
        <ul class="flex flex-wrap gap-4 sm:shrink-0 sm:gap-6">
          <li class="space-y-2">
            <div class="h-3 w-10 rounded bg-light-cream/20"></div>
            <div class="h-4 w-12 rounded bg-light-cream/30"></div>
          </li>
          <li class="space-y-2">
            <div class="h-3 w-10 rounded bg-light-cream/20"></div>
            <div class="h-4 w-10 rounded bg-light-cream/30"></div>
          </li>
          <li class="space-y-2">
            <div class="h-3 w-14 rounded bg-light-cream/20"></div>
            <div class="h-4 w-12 rounded bg-light-cream/30"></div>
          </li>
        </ul>
      </div>
    </div>
  `;

    this._parentElement.innerHTML = `
    ${skeletonCard("opacity-40 -translate-x-[125%] scale-85")}
    ${skeletonCard("-translate-x-1/2")}
    ${skeletonCard("opacity-40 translate-x-[25%] scale-85")}
  `;
  }
  renderTrendingCards(medias, movieGenres, tvGenres) {
    const markup = medias
      .map((media) => {
        const genres = media.type === "movie" ? movieGenres : tvGenres;

        return this.trendingCards(media, genres);
      })
      .join("");
    this._length = medias.length;
    this._parentElement.innerHTML = markup;
    const slides = [...this._parentElement.querySelectorAll("[data-card]")];
    const clonedLastSlides = this._cloneLastSlides(
      slides,
      this._cloneCount,
      this._track,
    );
    const clonedSlides = this._cloneSlides(
      slides,
      this._cloneCount,
      this._track,
    );
    this.setupPosterEvents(clonedLastSlides);
    this.setupPosterEvents(clonedSlides);
    this.setupPosterEvents(slides);
    this.renderCarousel();
  }

  _getGenre(media, genres) {
    if (!genres) {
      console.error("GENRES IS UNDEFINED", {
        mediaType: media.type,
        media,
      });
      return null;
    }
    return genres.genres.find((genre) => genre.id === media.genres?.at(0));
  }

  trendingCards(media, genres) {
    const genre = this._getGenre(media, genres);
    const runtime = helper.formatRuntime(media);

    const mediaTypeBadge =
      media.type === "movie" ? "bg-amber-300/80" : "bg-orange-500/80";

    const year = media.year?.slice(0, 4) || "N/A";
    const hasBackdrop = Boolean(media.backdrop);
    return `
    <article
    data-card
    data-id="${media.id}"
    data-type="${media.type}"
    tabindex="0"
    class="absolute top-0 left-1/2 h-full w-[70%] overflow-hidden rounded-[40px] transition-[transform,opacity] duration-500 ease-out"
  >
  <div
  class="media-card-wrapper relative h-full w-full rounded-[40px] border-2 border-transparent p-[1px]
  hover:[animation:border_2.5s_linear_infinite]
  hover:[background:linear-gradient(white,white)_padding-box,conic-gradient(from_var(--border-angle),transparent_25%,#f59e0b_50%,transparent_75%)_border-box]
  dark:hover:[background:linear-gradient(#18181b,#18181b)_padding-box,conic-gradient(from_var(--border-angle),transparent_25%,#f59e0b_50%,transparent_75%)_border-box]"
>
    <div class="poster-wrapper absolute inset-[2px] overflow-hidden rounded-[38px] bg-[radial-gradient(circle_at_center,rgba(234,179,8,0.18),transparent_55%),linear-gradient(145deg,#18181b,#09090b)] ${hasBackdrop ? "animate-pulse" : ""}">
      <div class="poster-error ${hasBackdrop ? "hidden" : ""} absolute inset-0 flex items-center justify-center">
        <img src="${assets.imageError}" alt="" class="w-6 h-6">
      </div>
      ${
        hasBackdrop
          ? `<picture>
        <source
          media="(max-width: 639px)"
          srcset="${helper.getPosterUrl(media.poster)}"
        />
        <img
          alt="${helper.escapeHTML(media.title)}"
          src="${helper.getBackdropUrl(media.backdrop)}"
          loading="lazy"
          decoding="async"
          class="media-poster w-full h-full object-cover opacity-0 transition-opacity duration-300"
        />
      </picture>`
          : ""
      }
    </div>
  
      <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent"></div>

      <span
      class="absolute top-4 left-5 z-10 rounded-md px-2 py-1 text-[10px] font-semibold tracking-wide text-white sm:top-6 sm:left-8 sm:px-3 sm:text-xs ${mediaTypeBadge}">
      ${media.type === "movie" ? "MOVIE" : "TV SHOW"}
      </span>

      <div
       class="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-4 text-white sm:flex-row sm:items-end sm:justify-between sm:gap-4 sm:p-8"
      >
        <div class="min-w-0 w-full sm:flex-1">
          <h2 class="truncate text-xl leading-tight font-bold sm:text-3xl">
            ${helper.escapeHTML(media.title)}
          </h2>

          <p class="mt-1 text-xs text-white/70 sm:mt-2 sm:text-sm">
            ${genre ? helper.escapeHTML(genre.name) : "N/A"}
          </p>
        </div>

        <ul class="flex flex-wrap gap-4 text-xs sm:shrink-0 sm:gap-6 sm:text-sm">
          <li>
            <span class="block text-xs opacity-60">
              ${media.type === "movie" ? "Length" : "Seasons"}
            </span>
            ${runtime}
          </li>

          <li>
            <span class="block text-xs opacity-60">Year</span>
            ${year}
          </li>

          <li>
            <span class="block text-xs opacity-60">Language</span>
            ${helper.getLanguageName(media.language) || "N/A"}
          </li>
        </ul>
      </div>
      </div>
    </article>
  `;
  }

  renderCarousel() {
    const cards = [...this._parentElement.querySelectorAll("[data-card]")];

    cards.forEach((card, i) => {
      const offset = i - this._activeCard;

      let transform;
      let opacity = 1;

      if (offset === 0) {
        transform = "translateX(-50%) scale(1)";
      } else if (offset === -1) {
        transform = "translateX(-125%) scale(.85)";
      } else if (offset === 1) {
        transform = "translateX(25%) scale(.85)";
      } else {
        transform = "translateX(-50%) scale(.7)";
        opacity = 0;
      }

      card.style.transform = transform;
      card.style.opacity = opacity;
      card.style.zIndex = offset === 0 ? 10 : 1;
    });
  }
  _initCarouselLoop() {
    this._track.addEventListener("transitionend", (event) => {
      const cards = this._parentElement.querySelectorAll("[data-card]");
      if (event.propertyName !== "transform") return;
      if (
        event.target !==
        this._parentElement.querySelector(
          "[data-card]:nth-child(" + (this._activeCard + 1) + ")",
        )
      )
        return;

      if (this._activeCard === this._length + this._cloneCount) {
        cards.forEach((card) => card.classList.add("transition-none"));

        this._activeCard = this._cloneCount;
        this.renderCarousel();

        cards[0].offsetHeight;
        cards.forEach((card) => card.classList.remove("transition-none"));
      } else if (this._activeCard === this._cloneCount - 1) {
        cards.forEach((card) => card.classList.add("transition-none"));

        this._activeCard = this._length + this._cloneCount - 1;
        this.renderCarousel();

        cards[0].offsetHeight;
        cards.forEach((card) => card.classList.remove("transition-none"));
      }
      this._isAnimating = false;
    });
  }
  _nextSlide() {
    if (this._isAnimating) return;

    this._isAnimating = true;
    const cards = this._parentElement.querySelectorAll("[data-card]");

    this._activeCard = (this._activeCard + 1) % cards.length;

    this.renderCarousel();
  }
  _prevSlide() {
    if (this._isAnimating) return;

    this._isAnimating = true;
    const cards = this._parentElement.querySelectorAll("[data-card]");

    this._activeCard = (this._activeCard - 1 + cards.length) % cards.length;

    this.renderCarousel();
  }

  addHandlerNext() {
    document.querySelector("#next").addEventListener("click", () => {
      this._resetAutoPlay();
      this._nextSlide();
    });
    this._initCarouselLoop();
  }

  addHandlerPrev() {
    document.querySelector("#prev").addEventListener("click", () => {
      this._resetAutoPlay();
      this._prevSlide();
    });
  }

  addHandlerTouch() {
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
        this._resetAutoPlay();
        this._nextSlide();
      }

      if (distance < -50) {
        this._resetAutoPlay();
        this._prevSlide();
      }
    });
  }

  _addHandlerKeyboard() {
    this._parentElement.addEventListener("keydown", (e) => {
      if (e.target.closest("button, a")) return;

      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        e.preventDefault();

        if (e.key === "ArrowRight") this._nextSlide();
        if (e.key === "ArrowLeft") this._prevSlide();
        this._resetAutoPlay();
      }
    });
  }

  hide() {
    this._discoverySection.classList.add("hidden");
  }

  show() {
    this._discoverySection.classList.remove("hidden");
  }

  _resetAutoPlay() {
    clearInterval(this._autoPlayTimer);
    clearTimeout(this._autoPlayTimeout);

    this._autoPlayTimeout = setTimeout(() => {
      this.startAutoPlay();
    }, 8000);
  }

  startAutoPlay() {
    clearInterval(this._autoPlayTimer);
    this._autoPlayTimer = setInterval(() => this._nextSlide(), 4000);
  }

  addHandlerGoToDetails(handler) {
    this._track.addEventListener("click", (e) => {
      const card = e.target.closest("[data-card]");
      if (!card) return;

      const { id, type } = card.dataset;
      handler(id, type);
    });
  }
}

export default new mediaCarouselView();
