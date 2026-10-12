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

  setActiveFilter(filter) {
    this._activeFilter = filter;
  }

  resetFilter() {
    const allFilter = this._mediaFilters.querySelector(
      '.media-filter[data-type="all"]',
    );

    this.setActiveFilter(allFilter);
  }

  movePillToActiveFilter() {
    this.moveFilterPill(this._activeFilter);
  }

  getActiveFilterType() {
    return this._activeFilter.dataset.type;
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
  // update() {}
  // renderSpinner() {}
  // renderError() {}
  // renderMessage() {}
}
