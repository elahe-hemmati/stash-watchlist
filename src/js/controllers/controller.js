import * as model from "../models/mediaModel.js";
import * as watchlistModel from "../models/watchlistModel.js";
import mediaView from "../views/mediaView.js";
import sidebarView from "../views/sidebarView.js";
import themeView from "../views/themeView.js";
import toastView from "../views/toastView.js";
import { state } from "../state.js";
import "core-js/stable";
import "regenerator-runtime/runtime";

let searchController, paginationController;
const prepareMediasForView = function (medias, filterType) {
  const filteredMedias = model.filterMediasByType(medias, filterType);

  return filteredMedias.map((media) => ({
    ...media,
    isAdded: watchlistModel.isInWatchlist(media),
  }));
};

const loadNextPage = async function () {
  const nextPage = state.currentPage + 1;
  const queryAtStart = state.currentQuery;
  mediaView.renderPaginationLoader();
  paginationController = new AbortController();
  const { signal } = paginationController;
  try {
    const data = await model.request(
      `search/multi?query=${encodeURIComponent(state.currentQuery)}&page=${nextPage}`,
      signal,
    );
    const newMedias = await model.prepareSearchResults(data, signal);
    if (queryAtStart !== state.currentQuery) return;
    state.currentPage = nextPage;
    const type = state.activeFilterType;
    state.medias = state.medias.concat(newMedias);
    const hasAnyMatch = model.filterMediasByType(state.medias, type).length > 0;
    if (!hasAnyMatch && nextPage === state.totalPages) {
      mediaView.renderNoFilterResults(type);
      return;
    }
    const medias = prepareMediasForView(newMedias, type);
    mediaView.appendMediaResults({
      medias,
      movieGenres: state.movieGenres,
      tvGenres: state.tvGenres,
    });
    mediaView.resetLoadMoreObserver();
  } catch (err) {
    if (err.name === "AbortError") return;
    console.error(err);
    toastView.showToast("Could not load more results.");
  } finally {
    if (!signal.aborted) {
      if (queryAtStart === state.currentQuery) {
        mediaView.hidePaginationLoader();
        state.isLoading = false;
      }
    }
  }
};

const getSearchMedias = async function () {
  let queryAtStart = state.currentQuery;
  try {
    paginationController?.abort();
    searchController?.abort();
    mediaView.hidePaginationLoader();
    searchController = new AbortController();
    const { signal } = searchController;
    state.isLoading = false;
    state.medias = [];
    state.currentPage = 1;
    state.totalPages = 1;
    state.activeFilterType = null;
    mediaView.resetFilter();
    mediaView.movePillToActiveFilter();

    const query = mediaView.getSearchQuery();
    state.currentQuery = query;
    queryAtStart = query;
    if (!query.trim()) {
      mediaView.hideMediaFilters();
      mediaView.clearSearchResults();
      mediaView.hidePaginationLoader();
      toastView.showToast("Please enter a media name.", "warning");
      return;
    }
    const encodedQuery = encodeURIComponent(query);
    mediaView.hideMediaFilters();
    mediaView.renderSpinner();
    const data = await model.request(
      `search/multi?query=${encodedQuery}&page=${state.currentPage}`,
      signal,
    );
    if (queryAtStart !== state.currentQuery) return;

    if (data.results.length === 0) {
      mediaView.renderNoResults();
      return;
    }

    state.medias = await model.prepareSearchResults(data, signal);
    if (state.medias.length === 0) {
      mediaView.renderNoResults();
      return;
    }
    state.movieGenres = await model.getMediaGenres("movie", signal);
    signal.throwIfAborted();
    state.tvGenres = await model.getMediaGenres("tv", signal);
    signal.throwIfAborted();
    state.totalPages = data.total_pages;
    const medias = prepareMediasForView(state.medias, state.activeFilterType);
    if (medias.length === 0) {
      mediaView.renderNoFilterResults(state.activeFilterType);
      return;
    }
    mediaView.render({
      medias,
      movieGenres: state.movieGenres,
      tvGenres: state.tvGenres,
    });
    mediaView.resetLoadMoreObserver();
  } catch (err) {
    if (err.name === "AbortError") return;
    if (queryAtStart !== state.currentQuery) return;
    console.error(err);
    mediaView.clearSearchResults();
    toastView.showToast(
      "Unable to connect to the media service. Please check your internet connection or VPN.",
      "error",
    );
  }
};

const filterMedia = function (filterType) {
  state.activeFilterType = filterType;
  const medias = prepareMediasForView(state.medias, state.activeFilterType);
  if (medias.length === 0) {
    if (state.currentPage === state.totalPages) {
      mediaView.renderNoFilterResults(filterType);
    } else {
      mediaView.clearSearchResults();
      mediaView.resetLoadMoreObserver();
    }
    return;
  }
  mediaView.render({
    medias,
    movieGenres: state.movieGenres,
    tvGenres: state.tvGenres,
  });
  mediaView.resetLoadMoreObserver();
};

const controlLoadMore = function () {
  if (
    state.isLoading === false &&
    state.currentQuery.trim() !== "" &&
    state.currentPage < state.totalPages
  ) {
    state.isLoading = true;
    loadNextPage();
  }
};

const controlAddToWatchlist = function (id, type) {
  const media = state.medias.find(
    (media) => media.id === Number(id) && media.type === type,
  );
  const isAdded = watchlistModel.toggleWatchlist(media);
  mediaView.updateWatchlistIcon(id, type, isAdded);
  watchlistModel.saveWatchlist();
};

const init = function () {
  themeView.loadTheme();
  watchlistModel.loadWatchlist();
  mediaView.addHandlerSearch(getSearchMedias);
  mediaView.addHandlerFilter(filterMedia);
  mediaView.addHandlerFilterHover();
  mediaView.addHandlerFilterLeave(() => mediaView.movePillToActiveFilter());
  mediaView.addHandlerLoadMore(controlLoadMore);
  mediaView.initSearchInput();
  mediaView.initClearButton();
  state.activeFilterType = mediaView.getActiveFilterType();
  mediaView.addHandlerAddToWatchlist(controlAddToWatchlist);
  sidebarView.addHandlerNavOpen(() => {
    sidebarView.asideOpenMobile();
  });
  sidebarView.addHandlerNavClose(() => {
    sidebarView.asideCloseMobile();
  });
  sidebarView.addHandlerOverlay(() => {
    sidebarView.asideCloseMobile();
  });
  sidebarView.addHandlerAsideToggle(() => {
    state.isSidebarCollapsed = !state.isSidebarCollapsed;
    sidebarView.asideToggle(state.isSidebarCollapsed);
  });
  themeView.addHandlerToggleTheme(() => {
    themeView.toggleTheme();
  });
};
init();
