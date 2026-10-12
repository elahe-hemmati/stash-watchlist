import View from "./View.js";
import * as assets from "../helpers/asset.js";
import mediaCardView from "./mediaCardView.js";

class MediaView extends View {
  _parentElement = document.querySelector(".search-results-container");
  _markup = `
<div class="col-span-full flex min-h-[300px] w-full items-center justify-center">
  <span class="loader"></span>
</div>
`;
  _loader = document.querySelector(".pagination-loader");
  _pill = document.querySelector(".pill");
  _searchMediasInput = document.querySelector(".search-media");
  _clearSearchButton = document.querySelector(".btn-clear");
  _mediaFilters = document.querySelector(".media-filters");
  _searchForm = document.querySelector(".search-form");
  _sentinel = document.querySelector(".sentinel");
  _activeFilter = document.querySelector(".media-filter");
  _observer;

  // ************rendering:
  render(data) {
    super.render(data);
    this.showMediaFilters();
    const newMediaCards = Array.from(this._parentElement.children);
    mediaCardView.setupPosterEvents(newMediaCards);
  }
  renderSpinner() {
    this.clear();
    this._parentElement.insertAdjacentHTML("afterbegin", this._markup);
  }
  renderNoResults() {
    this._renderEmptyMessage("No medias found.");
    this.hideMediaFilters();
  }
  appendMediaResults(data) {
    this._data = data;
    const previousCount = this._parentElement.children.length;
    const markup = this._generateMarkup();
    this._parentElement.insertAdjacentHTML("beforeend", markup);
    this.showMediaFilters();
    const newMediaCards = Array.from(this._parentElement.children).slice(
      previousCount,
    );
    mediaCardView.setupPosterEvents(newMediaCards);
  }
  // ****************

  // ******pagination:
  renderPaginationLoader() {
    this._loader.innerHTML = `
      <div class="flex items-center justify-center gap-2 py-6">
      <span class="loader"></span>
      <span>Loading more...</span>
      </div>
      `;
    this.showPaginationLoader();
  }
  showPaginationLoader() {
    this._loader.classList.remove("hidden");
  }
  hidePaginationLoader() {
    this._loader.classList.add("hidden");
  }
  resetLoadMoreObserver() {
    this._observer.unobserve(this._sentinel);
    this._observer.observe(this._sentinel);
  }
  // *******************

  //******filters:
  renderNoFilterResults(filterType) {
    const message =
      filterType === "movie"
        ? "No movies found for this search."
        : "No TV shows found for this search.";

    this._renderEmptyMessage(message);
  }
  // ***************

  // *************search input:
  getSearchQuery() {
    return this._searchMediasInput.value;
  }
  clearSearchResults() {
    this.clear();
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
  // *******************

  // *********handlers:
  addHandlerSearch(handler) {
    this._searchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      handler();
    });
  }

  addHandlerLoadMore(handler) {
    this._observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            handler();
          }
        });
      },
      {
        root: null,
        rootMargin: "200px",
        threshold: 0.1,
      },
    );
    this._observer.observe(this._sentinel);
  }

  addHandlerAddToWatchlist(handler) {
    this._parentElement.addEventListener("click", (e) => {
      const btn = e.target.closest(".add-to-watchlist-btn");
      if (!btn) return;
      const { id, type } = btn.dataset;
      handler(id, type);
    });
  }
  // ****************

  // *******watchlist icon
  updateWatchlistIcon(id, type, isAdded) {
    const btn = this._parentElement.querySelector(
      `.add-to-watchlist-btn[data-id="${id}"][data-type="${type}"]`,
    );
    if (!btn) return;
    const img = btn.querySelector("img");
    if (!img) return;
    img.src = isAdded ? assets.bookmarkFilled : assets.bookmark;
  }
  // ****************

  // *************data:
  _generateMarkup() {
    return this._data.medias
      .map((media) => {
        const genres =
          media.type === "movie" ? this._data.movieGenres : this._data.tvGenres;

        return mediaCardView.createMediaCard(media, genres);
      })
      .join("");
  }
  // **************
}

export default new MediaView();
