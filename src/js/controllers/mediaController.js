import initSharedController, {
  handleWatchlistToggle,
  controlGoToDetails,
} from "./sharedController.js";
import * as mediaModel from "../models/mediaModel.js";
import * as sharedModel from "../models/sharedModel.js";
import * as watchlistModel from "../models/watchlistModel.js";
import mediaView from "../views/mediaView.js";
import confirmView from "../views/confirmView.js";
import toastView from "../views/toastView.js";
import { state } from "../state.js";
import "core-js/stable";
import "regenerator-runtime/runtime";
import mediaCarouselView from "../views/mediaCarouselView.js";

let searchController, paginationController, trendingController;
const prepareMediasForView = function (medias, filterType) {
  const filteredMedias = sharedModel.filterMediasByType(medias, filterType);

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
    const data = await sharedModel.request(
      `search/multi?query=${encodeURIComponent(state.currentQuery)}&page=${nextPage}`,
      signal,
    );
    const newMedias = await mediaModel.prepareSearchResults(data, signal);
    if (queryAtStart !== state.currentQuery) return;
    state.currentPage = nextPage;
    const type = state.activeFilterType;
    state.medias = state.medias.concat(newMedias);
    const hasAnyMatch =
      sharedModel.filterMediasByType(state.medias, type).length > 0;
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
      mediaCarouselView.show();
      return;
    }
    mediaCarouselView.hide();
    const encodedQuery = encodeURIComponent(query);
    mediaView.hideMediaFilters();
    mediaView.renderSpinner();
    const data = await sharedModel.request(
      `search/multi?query=${encodedQuery}&page=${state.currentPage}`,
      signal,
    );
    if (queryAtStart !== state.currentQuery) return;
    if (data.results.length === 0) {
      mediaView.renderNoResults();
      return;
    }
    state.medias = await mediaModel.prepareSearchResults(data, signal);
    if (state.medias.length === 0) {
      mediaView.renderNoResults();
      return;
    }
    state.movieGenres = await mediaModel.getMediaGenres("movie", signal);
    signal.throwIfAborted();
    state.tvGenres = await mediaModel.getMediaGenres("tv", signal);
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
  if (!media) return;
  handleWatchlistToggle(media, mediaView);
};

const getTrendingMedias = async function () {
  try {
    trendingController?.abort();
    trendingController = new AbortController();

    const { signal } = trendingController;

    const data = await sharedModel.request("trending/all/week", signal);
    const medias = await mediaModel.getTrendingMedias(data, signal);

    if (signal.aborted) return;

    const movieGenres = await mediaModel.getMediaGenres("movie", signal);
    const tvGenres = await mediaModel.getMediaGenres("tv", signal);

    if (signal.aborted) return;

    mediaCarouselView.renderTrendingCards(medias, movieGenres, tvGenres);
    mediaCarouselView.renderCarousel();
    mediaCarouselView.startAutoPlay();
  } catch (err) {
    if (err.name === "AbortError") return;

    console.error(err);
    toastView.showToast(
      "Unable to connect to the media service. Please check your internet connection or VPN.",
      "error",
    );
  }
};

const init = function () {
  initSharedController();
  mediaCarouselView.renderSkeleton();
  getTrendingMedias();
  mediaCarouselView.addHandlerNext();
  mediaCarouselView.addHandlerPrev();
  mediaCarouselView.addHandlerTouch();
  mediaCarouselView._addHandlerKeyboard();
  mediaCarouselView.addHandlerGoToDetails(controlGoToDetails);
  mediaView.addHandlerSearch(getSearchMedias);
  mediaView.addHandlerFilter(filterMedia);
  mediaView.addHandlerFilterHover();
  mediaView.addHandlerFilterLeave(() => mediaView.movePillToActiveFilter());
  mediaView.addHandlerLoadMore(controlLoadMore);
  mediaView.initSearchInput();
  mediaView.initClearButton(() => {
    paginationController?.abort();
    searchController?.abort();
    state.currentQuery = "";
    state.isLoading = false;
    mediaView.hidePaginationLoader();
    mediaView.hideMediaFilters();
    mediaView.clearSearchResults();
    mediaCarouselView.show();
  });
  state.activeFilterType = mediaView.getActiveFilterType();
  mediaView.addHandlerAddToWatchlist(controlAddToWatchlist);
  confirmView.addHandlerConfirm();
  confirmView.addHandlerCancel();
  mediaView.addHandlerGoToDetails(controlGoToDetails);
};
init();

window.addEventListener("pageshow", function () {
  watchlistModel.loadWatchlist();
  state.medias.forEach((media) => {
    const isAdded = watchlistModel.isInWatchlist(media);
    mediaView.updateWatchlistIcon(media.id, media.type, isAdded);
  });
});
