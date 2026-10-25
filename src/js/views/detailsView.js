import View from "./View.js";
import detailsMarkup from "./detailsMarkup.js";

class DetailsView extends View {
  _parentElement = document.querySelector(".details-container");

  renderSkeleton() {
    this._parentElement.innerHTML = detailsMarkup.createSkeletonMarkup();
  }

  render(data) {
    super.render(data);
    const newMediaCards = Array.from(this._parentElement.children);
    detailsMarkup.setupPosterEvents(newMediaCards);
  }

  addHandlerAddToWatchlist(handler) {
    this._parentElement.addEventListener("click", (e) => {
      const btn = e.target.closest(".add-to-watchlist-btn");
      if (!btn) return;
      handler(this._data);
    });
  }

  _generateMarkup() {
    return detailsMarkup.createDetailsMarkup(this._data);
  }
}

export default new DetailsView();
