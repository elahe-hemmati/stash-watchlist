import View from "./View.js";
import watchlistCardView from "./watchlistCardView.js";

class WatchlistView extends View {
  _parentElement = document.querySelector(".watchlist-results-container");
  _mediaFilters = document.querySelector(".media-filters");
  _pill = document.querySelector(".pill");
  _activeFilter = document.querySelector(".media-filter");

  render(data) {
    super.render(data);
    if (data.length === 0) {
      this.hideMediaFilters();
      return;
    }
    this.showMediaFilters();
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
  renderEmptyWatchlist() {
    this._renderEmptyMessage("Your watchlist is empty.");
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

  _generateMarkup() {
    return this._data
      .map((element) => {
        return watchlistCardView.createWatchlistCard(element);
      })
      .join("");
  }
}

export default new WatchlistView();
