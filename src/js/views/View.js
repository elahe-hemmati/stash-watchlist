import * as assets from "../helpers/asset.js";

export default class View {
  _data;

  render(data) {
    this._data = data;
    const markup = this._generateMarkup();
    this.clear();
    this._parentElement.insertAdjacentHTML("beforeend", markup);
  }

  clear() {
    this._parentElement.innerHTML = "";
  }

  _renderEmptyMessage(message) {
    this._parentElement.innerHTML = `
    <div class="col-span-full flex flex-col items-center justify-center gap-2 min-h-[200px]">
      <img src="${assets.noResultIcon}" alt="" class="w-10 h-10 block animate-pulse"/>
      <p class="text-center text-sm text-zinc-500 dark:text-zinc-400">
        ${message}
      </p>
    </div>`;
  }
  // ********Search input
  getSearchQuery() {
    return this._searchInput.value;
  }

  clearSearchInput() {
    this._searchInput.value = "";
    this._clearSearchButton.classList.add("hidden");
    this._clearSearchButton.classList.remove("flex");
    this._searchInput.focus();
  }

  toggleClearButton() {
    const hasValue = !!this._searchInput.value;
    this._clearSearchButton.classList.toggle("hidden", !hasValue);
    this._clearSearchButton.classList.toggle("flex", hasValue);
  }

  initSearchInput() {
    this._searchInput.addEventListener("input", () => {
      this.toggleClearButton();
    });
  }

  initClearButton() {
    this._clearSearchButton.addEventListener("click", () => {
      this.clearSearchInput();
    });
  }

  addHandlerSearch(handler) {
    this._searchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      handler();
    });
  }

  // *********** Filter state and UI
  setActiveFilter(filter) {
    this._activeFilter = filter;
  }

  resetFilter() {
    const allFilter = this._mediaFilters.querySelector(
      '.media-filter[data-type="all"]',
    );

    this.setActiveFilter(allFilter);
  }

  getActiveFilterType() {
    return this._activeFilter.dataset.type;
  }

  movePillToActiveFilter() {
    this.moveFilterPill(this._activeFilter);
  }

  moveFilterPill(filter) {
    this._pill.style.transform = `translateX(${filter.offsetLeft}px)`;
    this._pill.style.width = `${filter.offsetWidth}px`;
  }

  hideMediaFilters() {
    this._mediaFilters.classList.add("invisible");
  }

  showMediaFilters() {
    this._mediaFilters.classList.remove("invisible");
  }

  updateWatchlistIcon(id, type, isAdded) {
    const containers = [
      this._parentElement,
      document.querySelector(".similar-container"),
    ];

    for (const container of containers) {
      const buttons = container?.querySelectorAll(
        `.add-to-watchlist-btn[data-id="${id}"][data-type="${type}"]`,
      );

      buttons?.forEach((btn) => {
        const img = btn.querySelector("img");
        if (img) img.src = isAdded ? assets.bookmarkFilled : assets.bookmark;
      });
    }
  }

  // **********Filter events
  _handleFilterHover(e) {
    const button = e.target.closest(".media-filter");
    if (!button) return;
    this.moveFilterPill(button);
  }

  addHandlerFilter(handler) {
    this._mediaFilters.addEventListener("click", (e) => {
      const filter = e.target.closest(".media-filter");
      if (!filter) return;
      this.setActiveFilter(filter);
      handler(filter.dataset.type);
    });
  }

  addHandlerFilterHover() {
    this._mediaFilters.addEventListener(
      "mouseover",
      this._handleFilterHover.bind(this),
    );
  }

  addHandlerFilterLeave(handler) {
    this._mediaFilters.addEventListener("mouseleave", handler);
  }

  _addHandlerCardKeyboard(...selectors) {
    this._parentElement.addEventListener("keydown", (e) => {
      const card = e.target.closest(selectors.join(", "));

      if (!card || e.target !== card) return;
      if (e.key !== "Enter") return;

      card.click();
    });
  }
}
