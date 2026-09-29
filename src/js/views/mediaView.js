import * as assets from "../helpers/asset.js";
import * as helper from "../helpers/helper.js";
class MediaView {
  _markup = `
<div class="col-span-full flex min-h-[300px] w-full items-center justify-center">
  <span class="loader"></span>
</div>
`;
  _loader = document.querySelector(".pagination-loader");
  _searchResultsContainer = document.querySelector(".search-results-container");
  _pill = document.querySelector(".pill");
  _searchMediasInput = document.querySelector(".search-media");
  _clearSearchButton = document.querySelector(".btn-clear");
  _mediaFilters = document.querySelector(".media-filters");

  renderSpinner() {
    this._searchResultsContainer.innerHTML = "";
    this._searchResultsContainer.insertAdjacentHTML("afterbegin", this._markup);
  }

  renderPaginationLoader() {
    this._loader.innerHTML = `
      <div class="flex items-center justify-center gap-2 py-6">
      <span class="loader"></span>
      <span>Loading more...</span>
      </div>
      `;
    this._loader.classList.remove("hidden");
  }

  hidePaginationLoader() {
    this._loader.classList.add("hidden");
  }

  _createStarsMarkup(fullStars, halfStar, emptyStars) {
    let starsHTML = "";
    for (let i = 0; i < fullStars; i++) {
      starsHTML += `<img src="${assets.starFilled}" class="inline-block w-4 h-4">`;
    }

    for (let i = 0; i < halfStar; i++) {
      starsHTML += `<img src="${assets.starHalfEmpty}" class="inline-block w-4 h-4">`;
    }

    for (let i = 0; i < emptyStars; i++) {
      starsHTML += `<img src="${assets.starEmpty}" class="inline-block w-4 h-4">`;
    }

    return starsHTML;
  }

  _getGenre(media, movieGenres, tvGenres) {
    const genres = media.type === "movie" ? movieGenres : tvGenres;
    if (!genres) {
      console.error("GENRES IS UNDEFINED", {
        mediaType: media.type,
        movieGenres,
        tvGenres,
        media,
      });
      return null;
    }
    return genres.genres.find((genre) => genre.id === media.genres?.at(0));
  }

  _createMediaCard(media, movieGenres, tvGenres) {
    const { fullStars, halfStar, emptyStars } = helper.getRatingStars(
      media.rating,
    );
    const starsHTML = this._createStarsMarkup(fullStars, halfStar, emptyStars);
    const genre = this._getGenre(media, movieGenres, tvGenres);
    const runtime = helper.formatRuntime(media);
    const mediaTypeBadge =
      media.type === "movie" ? "bg-amber-300/80" : "bg-orange-500/80";
    const hasPoster = Boolean(media.poster);
    const card = `
            <div class="media-card relative w-full max-w-[280px] overflow-hidden rounded-xl shadow-[0_8px_20px_rgba(0,0,0,0.3)] dark:shadow-[0_0_20px_rgba(255,255,255,0.15)]">
              <span class="absolute top-2 left-2 z-10 rounded-md px-2 py-1 text-[10px] font-semibold tracking-wide text-white ${mediaTypeBadge}">
              ${media.type === "movie" ? "MOVIE" : "TV SHOW"}</span>
              <button class="add-to-watchlist-btn absolute top-2 right-2 text-xs sm:text-sm">Add to Watchlist</button>
               <div class="poster-wrapper relative aspect-[2/3] w-full bg-[radial-gradient(circle_at_center,rgba(234,179,8,0.18),transparent_55%),linear-gradient(145deg,#18181b,#09090b)] ${hasPoster ? "animate-pulse" : ""}">
                <div class="poster-error ${hasPoster ? "hidden" : ""} absolute inset-0 flex items-center justify-center">
                  <img src="${assets.imageError}" class="w-6 h-6">
                </div>${
                  hasPoster
                    ? `<img
                      alt="${helper.escapeHTML(media.title)}"
                      src="${helper.getPosterUrl(media.poster)}"
                      loading="lazy"
                      width="500"
                      height="750"
                      decoding="async"
                      class="media-poster w-full h-full object-cover opacity-0 transition-opacity duration-300"/>`
                    : ""
                }</div>
              <div class="absolute bottom-0 left-0 h-3/4 w-full bg-gradient-to-t from-black to-transparent"></div>

              <div class="media-details text-light-cream absolute bottom-3 left-2 mx-3">
                  <h2 class="media-title line-clamp-1 text-lg sm:line-clamp-2 sm:text-xl">${helper.escapeHTML(media.title)}</h2>
                  <p class="media-rating flex gap-1 items-center text-sm sm:text-sm">${media.rating?.toFixed(1) ?? "N/A"}${starsHTML}</p>
                  <p class="media-release-date inline text-sm sm:text-sm">${media.year?.slice(0, 4) ?? "N/A"}</p>
                  <span class="devider text-white/20 text-sm">|</span>
                  <p class="media-runtime inline text-sm sm:text-sm">${runtime}</p>
                  <p class="media-genres text-sm">${genre ? helper.escapeHTML(genre.name) : "N/A"}</p>
              </div>
            </div>`;
    return card;
  }

  _setupPosterEvents(newMediaCards) {
    newMediaCards.forEach((card) => {
      const poster = card.querySelector(".media-poster");
      if (!poster) return;
      poster.addEventListener("load", () => {
        poster.classList.remove("opacity-0");
        poster.parentNode.classList.remove("animate-pulse");
      });
      poster.addEventListener("error", () => {
        const posterError = poster.parentNode.querySelector(".poster-error");
        posterError.classList.remove("hidden");
        poster.parentElement.classList.remove("animate-pulse");
      });
    });
  }

  renderSearchMedia(medias, movieGenres, tvGenres, clearContainer = true) {
    if (clearContainer) {
      this._searchResultsContainer.innerHTML = "";
    }
    const previousCount = this._searchResultsContainer.children.length;
    medias.forEach((media) => {
      const card = this._createMediaCard(media, movieGenres, tvGenres);
      this._searchResultsContainer.insertAdjacentHTML("beforeend", card);
    });

    this._mediaFilters.classList.remove("invisible");
    const newMediaCards = Array.from(
      this._searchResultsContainer.children,
    ).slice(previousCount);
    this._setupPosterEvents(newMediaCards);
  }

  moveFilterPill(filter) {
    this._pill.style.transform = `translateX(${filter.offsetLeft}px)`;
    this._pill.style.width = `${filter.offsetWidth}px`;
  }

  clearSearchResults() {
    this._searchResultsContainer.innerHTML = "";
  }

  hideMediaFilters() {
    this._mediaFilters.classList.add("invisible");
  }

  renderNoResults() {
    this._searchResultsContainer.innerHTML = `
    <div class="col-span-full flex flex-col items-center justify-center gap-2 min-h-[200px]">
      <img src="${assets.noResultIcon}" alt="" class="w-10 h-10 block animate-pulse"/>
      <p class="text-center text-sm text-zinc-500 dark:text-zinc-400">
        No medias found.
      </p>
    </div>
  `;
    this._mediaFilters.classList.add("invisible");
  }

  getSearchQuery() {
    return this._searchMediasInput.value;
  }

  clearSearchInput() {
    this._searchMediasInput.value = "";
    this._clearSearchButton.classList.add("hidden");
    this._clearSearchButton.classList.remove("flex");
    this._searchMediasInput.focus();
  }

  toggleClearButton() {
    const hasValue = !!this._searchMediasInput.value;
    this._clearSearchButton.classList.toggle("hidden", !hasValue);
    this._clearSearchButton.classList.toggle("flex", hasValue);
  }

  initSearchInput() {
    this._searchMediasInput.addEventListener("input", () => {
      this.toggleClearButton();
    });
  }

  initClearButton() {
    this._clearSearchButton.addEventListener("click", () => {
      this.clearSearchInput();
    });
  }
}

export default new MediaView();
