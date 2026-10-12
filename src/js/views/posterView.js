export default class PosterView {
  _showPoster(poster) {
    poster.classList.remove("opacity-0");
    poster.parentElement.classList.remove("animate-pulse");
  }

  _showPosterError(poster) {
    const posterError = poster.parentElement.querySelector(".poster-error");
    posterError.classList.remove("hidden");
    poster.parentElement.classList.remove("animate-pulse");
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
