import * as assets from "./asset.js";
export const getRatingStars = function (rating) {
  if (rating == null) {
    return {
      fullStars: 0,
      halfStar: 0,
      emptyStars: 0,
    };
  }
  const stars = Math.round(rating);
  const fullStars = Math.floor(stars / 2);
  const halfStar = stars % 2;
  const emptyStars = 5 - fullStars - halfStar;
  return {
    fullStars,
    halfStar,
    emptyStars,
  };
};

export const formatRuntime = function (media) {
  return media.type === "movie"
    ? media.runtime != null
      ? `${Math.floor(media.runtime / 60)}h ${
          media.runtime - Math.floor(media.runtime / 60) * 60
        }m`
      : "N/A"
    : `${media.seasons} S · ${media.episodes} EP`;
};

export const escapeHTML = (str) => {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

export const createStarsMarkup = function (fullStars, halfStar, emptyStars) {
  let starsHTML = "";
  for (let i = 0; i < fullStars; i++) {
    starsHTML += `<img src="${assets.starFilled}" class="inline-block w-4 h-4">`;
  }

  for (let i = 0; i < halfStar; i++) {
    starsHTML += `<img src="${assets.starHalfEmpty}" class="inline-block w-4 h-4">`;
  }

  for (let i = 0; i < emptyStars; i++) {
    starsHTML += `<img src="${assets.starEmpty}" class="inline-block w-4 h-4">`;
  }

  return starsHTML;
};

export const getPosterUrl = (posterPath) => {
  return posterPath
    ? `https://image.tmdb.org/t/p/w500${posterPath}`
    : assets.imageError;
};

export const getBackdropUrl = function (backdropPath) {
  return backdropPath
    ? `https://image.tmdb.org/t/p/w500${backdropPath}`
    : assets.imageError;
};
