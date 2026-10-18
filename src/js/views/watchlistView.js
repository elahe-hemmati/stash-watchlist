import View from "./View.js";
import watchlistCardView from "./watchlistCardView.js";

class WatchlistView extends View {
  _parentElement = document.querySelector(".watchlist-results-container");
  _mediaFilters = document.querySelector(".media-filters");
  _pill = document.querySelector(".pill");
  _activeFilter = document.querySelector(".media-filter");
  _searchForm = document.querySelector(".search-form");
  _searchInput = document.querySelector(".search-media");
  _clearSearchButton = document.querySelector(".btn-clear");
  _watchlistToolbar = document.querySelector("#watchlist-toolbar");

  render(data) {
    super.render(data);
    if (data.length === 0) {
      this.hideWatchlistToolbar();
      return;
    }
    this.showWatchlistToolbar();
    const newMediaCards = Array.from(this._parentElement.children);
    watchlistCardView.setupPosterEvents(newMediaCards);
  }

  //******filters:
  renderNoFilterResults(filterType) {
    const message =
      filterType === "movie"
        ? "No movies in your watchlist yet."
        : "No TV shows in your watchlist yet.";

    this._renderEmptyMessage(message);
  }

  renderNoSearchResults(filterType) {
    const message =
      filterType === "movie"
        ? "No matching movies found in your watchlist."
        : filterType === "tv"
          ? "No matching TV shows found in your watchlist."
          : "No matches found in your watchlist.";

    this._renderEmptyMessage(message);
  }

  renderEmptyWatchlist() {
    this._renderEmptyMessage("Your watchlist is empty.");
  }
  // *************

  // ******toolbar
  hideWatchlistToolbar() {
    this._watchlistToolbar.classList.add("invisible");
  }

  showWatchlistToolbar() {
    this._watchlistToolbar.classList.remove("invisible");
  }
  // ***************
  addHandlerRemoveFromWatchlist(handler) {
    this._parentElement.addEventListener("click", (e) => {
      const btn = e.target.closest(".remove-from-watchlist-btn");
      if (!btn) return;
      const { id, type } = btn.dataset;
      handler(id, type);
    });
  }

  addHandlerToggleWatched(handler) {
    this._parentElement.addEventListener("click", (e) => {
      const btn = e.target.closest(".toggle-watched-btn");
      if (!btn) return;
      const { id, type } = btn.dataset;
      handler(id, type);
    });
  }

  addHandlerSort(handler) {
    const sort = document.querySelector(".custom-sort");
    const trigger = sort.querySelector(".sort-trigger");
    const menu = sort.querySelector(".sort-menu");
    const selected = sort.querySelector(".sort-selected");
    const options = sort.querySelectorAll(".sort-option");

    // Open / close menu
    trigger.addEventListener("click", () => {
      const isOpen = trigger.getAttribute("aria-expanded") === "true";

      trigger.setAttribute("aria-expanded", String(!isOpen));
      menu.classList.toggle("hidden", isOpen);
      sort
        .querySelector(".sort-chevron")
        .classList.toggle("rotate-180", !isOpen);
    });

    // Select sort option
    options.forEach((option) => {
      option.addEventListener("click", () => {
        const sortType = option.dataset.sort;

        selected.textContent = option.textContent.trim();

        options.forEach((item) => {
          const isSelected = item === option;

          item.setAttribute("aria-selected", String(isSelected));

          item.classList.toggle("bg-amber-500/10", isSelected);
          item.classList.toggle("text-amber-700", isSelected);
          item.classList.toggle("dark:text-amber-300", isSelected);
          item.classList.toggle("font-medium", isSelected);

          item.classList.toggle("text-zinc-700", !isSelected);
          item.classList.toggle("dark:text-zinc-200", !isSelected);
        });

        trigger.setAttribute("aria-expanded", "false");
        menu.classList.add("hidden");
        sort.querySelector(".sort-chevron").classList.remove("rotate-180");

        handler(sortType);
      });
    });

    // Close when clicking outside
    document.addEventListener("click", (e) => {
      if (!sort.contains(e.target)) {
        trigger.setAttribute("aria-expanded", "false");
        menu.classList.add("hidden");
        sort.querySelector(".sort-chevron").classList.remove("rotate-180");
      }
    });

    // Close with Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        trigger.setAttribute("aria-expanded", "false");
        menu.classList.add("hidden");
        sort.querySelector(".sort-chevron").classList.remove("rotate-180");
      }
    });
  }

  addHandlerClearSearch(handler) {
    this._clearSearchButton.addEventListener("click", () => {
      this.clearSearchInput();
      handler();
    });
  }
  // ******************
  _generateMarkup() {
    return this._data
      .map((element) => {
        return watchlistCardView.createWatchlistCard(element);
      })
      .join("");
  }
}

export default new WatchlistView();
