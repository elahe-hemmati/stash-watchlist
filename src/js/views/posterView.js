import View from "./View.js";

export default class PosterView extends View {
  _showPoster(poster) {
    poster.classList.remove("opacity-0");
    poster.closest(".poster-wrapper").classList.remove("animate-pulse");
  }

  _showPosterError(poster) {
    const posterError = poster
      .closest(".poster-wrapper")
      .querySelector(".poster-error");
    posterError.classList.remove("hidden");
    poster.closest(".poster-wrapper").classList.remove("animate-pulse");
  }

  setupPosterEvents(newMediaCards) {
    newMediaCards.forEach((card) => {
      const poster = card.querySelector(".media-poster");
      if (!poster) return;

      poster.addEventListener("load", () => {
        this._showPoster(poster);
      });

      poster.addEventListener("error", () => {
        this._showPosterError(poster);
      });

      if (poster.complete) {
        if (poster.naturalWidth > 0) {
          this._showPoster(poster);
        } else {
          this._showPosterError(poster);
        }
      }
    });
  }
}
