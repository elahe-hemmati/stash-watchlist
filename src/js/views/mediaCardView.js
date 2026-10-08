import * as assets from "../helpers/asset.js";
import * as helper from "../helpers/helper.js";
class MediaCardView {
  _getGenre(media, genres) {
    if (!genres) {
      console.error("GENRES IS UNDEFINED", {
        mediaType: media.type,
        media,
      });
      return null;
    }
    return genres.genres.find((genre) => genre.id === media.genres?.at(0));
  }

  createMediaCard(media, genres) {
    const { fullStars, halfStar, emptyStars } = helper.getRatingStars(
      media.rating,
    );
    const starsHTML = helper.createStarsMarkup(fullStars, halfStar, emptyStars);
    const genre = this._getGenre(media, genres);
    const runtime = helper.formatRuntime(media);
    const mediaTypeBadge =
      media.type === "movie" ? "bg-amber-300/80" : "bg-orange-500/80";
    const hasPoster = Boolean(media.poster);
    return `
           <div
          class="media-card-wrapper relative rounded-xl border-2 border-transparent p-[1px] hover:[animation:border_2.5s_linear_infinite] hover:[background:linear-gradient(white,white)_padding-box,conic-gradient(from_var(--border-angle),transparent_25%,#f59e0b_50%,transparent_75%)_border-box] dark:hover:[background:linear-gradient(#18181b,#18181b)_padding-box,conic-gradient(from_var(--border-angle),transparent_25%,#f59e0b_50%,transparent_75%)_border-box]"
        >
            <div class="media-card relative w-full max-w-[280px] overflow-hidden rounded-xl shadow-[0_8px_20px_rgba(0,0,0,0.3)] dark:shadow-[0_0_20px_rgba(255,255,255,0.15)]">
              <span class="absolute top-2 left-2 z-10 rounded-md px-2 py-1 text-[10px] font-semibold tracking-wide text-white ${mediaTypeBadge}">
              ${media.type === "movie" ? "MOVIE" : "TV SHOW"}</span>
              <button
                 class="add-to-watchlist-btn group absolute top-2 right-2 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-amber-300/50 hover:bg-black/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/70" aria-label="Add to watchlist" title="Add to Watchlist" data-id="${media.id}" data-type="${media.type}">
                <img
                src="${media.isAdded ? assets.bookmarkFilled : assets.bookmark}"
                  class="h-5 w-5 transition-transform duration-300"
                >
              </button>


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
            </div>
            </div>`;
  }

  setupPosterEvents(newMediaCards) {
    newMediaCards.forEach((card) => {
      const poster = card.querySelector(".media-poster");
      if (!poster) return;
      poster.addEventListener("load", () => {
        poster.classList.remove("opacity-0");
        poster.parentElement.classList.remove("animate-pulse");
      });
      poster.addEventListener("error", () => {
        const posterError = poster.parentElement.querySelector(".poster-error");
        posterError.classList.remove("hidden");
        poster.parentElement.classList.remove("animate-pulse");
      });
    });
  }
}
export default new MediaCardView();
