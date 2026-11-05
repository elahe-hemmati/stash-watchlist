import View from "./View.js";
import detailsMarkup from "./detailsMarkup.js";

class DetailsView extends View {
  _parentElement = document.querySelector(".details-container");
  _castItem = document.querySelectorAll(".cast-item");
  _castInfo = document.querySelectorAll(".cast-info");
  _container = document.querySelector(".similar-container");

  renderSkeleton() {
    this._parentElement.innerHTML = detailsMarkup.createSkeletonMarkup();
  }

  render(data) {
    super.render(data);
    const newMediaCards = Array.from(this._parentElement.children);
    detailsMarkup.setupPosterEvents(newMediaCards);
    this._setupCastTooltips();
    this.renderSimilarMedia();
  }

  _setupCastTooltips() {
    const castItems = this._parentElement.querySelectorAll(".cast-item");
    castItems.forEach((item) =>
      item.addEventListener("mouseenter", () => {
        const castInfo = item.querySelector(".cast-info");
        const actorRect = item.getBoundingClientRect();
        const tooltipHeight = castInfo.getBoundingClientRect().height;
        const spaceBelow = window.innerHeight - actorRect.bottom;
        if (spaceBelow < tooltipHeight + 1) {
          castInfo.style.positionTryFallbacks = "flip-block";
        } else {
          castInfo.style.positionTryFallbacks = "none";
        }
      }),
    );
  }

  renderSimilarMedia() {
    const similar = this._data.similar;

    if (!similar.length) {
      this._container.innerHTML = "";
      return;
    }
    this._container.innerHTML = detailsMarkup.createSimilarMediaMarkup(
      this._data.similar,
      this._data.type,
    );
    const newMediaCards = Array.from(
      this._container.querySelectorAll(".media-card"),
    );
    detailsMarkup.setupPosterEvents(newMediaCards);
  }

  getSimilarMedia(id, type) {
    return this._data.similar.find(
      (media) => media.id === Number(id) && media.type === type,
    );
  }

  addHandlerAddToWatchlist(handler) {
    this._parentElement.addEventListener("click", (e) => {
      const btn = e.target.closest(".add-to-watchlist-btn");
      if (!btn) return;
      handler(this._data);
    });
  }

  addHandlerAddSimilarToWatchlist(handler) {
    this._container.addEventListener("click", (e) => {
      const btn = e.target.closest(".add-to-watchlist-btn");
      if (!btn) return;
      const { id, type } = btn.dataset;
      handler(id, type);
    });
  }

  _generateMarkup() {
    return detailsMarkup.createDetailsMarkup(this._data);
  }
}

export default new DetailsView();
