import { state } from "../state.js";

export const isInWatchlist = function (media) {
  return state.watchlist.some(
    (item) => item.id === media.id && item.type === media.type,
  );
};

export const toggleWatchlist = function (media) {
  if (!isInWatchlist(media)) {
    addToWatchlist(media);
    saveWatchlist();
    return true;
  } else {
    removeFromWatchlist(media);
    saveWatchlist();
    return false;
  }
};

const addToWatchlist = function (media) {
  const watchlistMedia = {
    id: media.id,
    type: media.type,
    title: media.title,
    poster: media.poster,
    watched: false,
  };
  state.watchlist.push(watchlistMedia);
};

const removeFromWatchlist = function (media) {
  state.watchlist = state.watchlist.filter(
    (item) => !(item.id === media.id && item.type === media.type),
  );
};

export const deleteFromWatchlist = function (id, type) {
  removeFromWatchlist({ id: Number(id), type });
  saveWatchlist();
};

export const saveWatchlist = function () {
  localStorage.setItem("watchlist", JSON.stringify(state.watchlist));
};

export const loadWatchlist = function () {
  const data = localStorage.getItem("watchlist");
  state.watchlist = data ? JSON.parse(data) : [];
};

export const toggleWatched = function (id, type) {
  const media = state.watchlist.find(
    (item) => item.id === Number(id) && item.type === type,
  );
  if (!media) return;
  media.watched = !media.watched;
  saveWatchlist();
};

export const sortWatchlist = function (medias, sortType) {
  if (sortType === "added") {
    return medias.toReversed();
  }
  if (sortType === "title") {
    return medias.toSorted((a, b) => a.title.localeCompare(b.title));
  }
  if (sortType === "watched") {
    return medias.toSorted((a, b) => a.watched - b.watched);
  }
};

export const searchWatchlist = function (query) {
  return state.watchlist.filter((media) =>
    media.title.toLowerCase().includes(query.toLowerCase()),
  );
};
