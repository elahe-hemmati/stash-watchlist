"use strict";

import * as model from "../models/mediaModel.js";
import mediaView from "../views/mediaView.js";
import sidebarView from "../views/sidebarView.js";
import themeView from "../views/themeView.js";
import toastView from "../views/toastView.js";
import { state } from "../state.js";
import "core-js/stable";
import "regenerator-runtime/runtime";

const btnNavOpen = document.querySelector(".btn-nav--open");
const btnNavClose = document.querySelector(".btn-nav--close");
const btnAsideToggle = document.querySelector(".btn-aside--toggle");
const btnTheme = document.querySelector(".btn-theme");
const overlay = document.querySelector(".overlay");
const searchForm = document.querySelector(".search-form");
const mediaFilters = document.querySelector(".media-filters");
const sentinel = document.querySelector(".sentinel");

let activeFilter = document.querySelector(".media-filter");
state.activeFilterType = activeFilter.dataset.type;

const loadNextPage = async function () {
  const nextPage = state.currentPage + 1;
  const queryAtStart = state.currentQuery;
  mediaView.renderPaginationLoader();
  try {
    const data = await model.request(
      `search/multi?query=${encodeURIComponent(state.currentQuery)}&page=${nextPage}`,
    );
    const newMedias = await model.prepareSearchResults(data);
    if (queryAtStart !== state.currentQuery) return;
    state.currentPage = nextPage;
    const type = state.activeFilterType;
    const filteredMedia = model.filterMediasByType(newMedias, type);
    state.medias = state.medias.concat(newMedias);
    mediaView.renderSearchMedia(
      filteredMedia,
      state.movieGenres,
      state.tvGenres,
      false,
    );
    observer.unobserve(sentinel);
    observer.observe(sentinel);
  } catch (err) {
    console.error(err);
    toastView.showToast("Could not load more results.");
  } finally {
    mediaView.hidePaginationLoader();
    state.isLoading = false;
  }
};

const getSearchMedias = async function (e) {
  try {
    e.preventDefault();
    state.isLoading = false;
    state.medias = [];
    state.currentPage = 1;
    state.totalPages = 1;
    mediaView.moveFilterPill(activeFilter);

    const query = mediaView.getSearchQuery();
    state.currentQuery = query;
    if (!query.trim()) {
      mediaView.hideMediaFilters();
      mediaView.clearSearchResults();
      toastView.showToast("Please enter a media name.");
      return;
    }
    const encodedQuery = encodeURIComponent(query);
    mediaView.renderSpinner();
    const data = await model.request(
      `search/multi?query=${encodedQuery}&page=${state.currentPage}`,
    );
    state.totalPages = data.total_pages;

    if (data.results.length === 0) {
      mediaView.renderNoResults();
      return;
    }

    state.medias = await model.prepareSearchResults(data);
    state.movieGenres = await model.getMediaGenres("movie");
    state.tvGenres = await model.getMediaGenres("tv");
    mediaView.renderSearchMedia(
      state.medias,
      state.movieGenres,
      state.tvGenres,
    );
  } catch (err) {
    console.error(err);
    mediaView.clearSearchResults();
    toastView.showToast(
      "Unable to connect to the media service. Please check your internet connection or VPN.",
    );
  }
};

const filterMediaButtonGroup = function (e) {
  const button = e.target.closest(".media-filter");
  if (!button) return;
  mediaView.moveFilterPill(button);
};

const filterMedia = function (e) {
  e.preventDefault();
  const filter = e.target.closest(".media-filter");
  if (!filter) return;
  activeFilter = filter;
  state.activeFilterType = filter.dataset.type;
  const filteredMedias = model.filterMediasByType(
    state.medias,
    state.activeFilterType,
  );
  mediaView.renderSearchMedia(
    filteredMedias,
    state.movieGenres,
    state.tvGenres,
  );
  observer.unobserve(sentinel);
  observer.observe(sentinel);
};

// ${movie.genres
//                   .map((genreID) => {
//                     return genres.genres.find((genre) => genre.id === genreID)
//                       .name;
//                   })
//                   .join(", ")}

const observeCallback = function (entries, observer) {
  entries.forEach((entry) => {
    if (
      entry.isIntersecting &&
      state.isLoading === false &&
      state.currentQuery.trim() !== "" &&
      state.currentPage < state.totalPages
    ) {
      state.isLoading = true;
      loadNextPage();
    }
  });
};

const observeOptions = {
  root: null,
  rootMargin: "200px",
  threshold: 0.1,
};
const observer = new IntersectionObserver(observeCallback, observeOptions);
observer.observe(sentinel);

btnNavOpen.addEventListener("click", (e) => {
  e.preventDefault();
  sidebarView.asideOpenMobile();
});
btnNavClose.addEventListener("click", (e) => {
  e.preventDefault();
  sidebarView.asideCloseMobile();
});
overlay.addEventListener("click", (e) => {
  e.preventDefault();
  sidebarView.asideCloseMobile();
});
btnAsideToggle.addEventListener("click", () => {
  state.isSidebarCollapsed = !state.isSidebarCollapsed;
  sidebarView.asideToggle(state.isSidebarCollapsed);
});

btnTheme.addEventListener("click", (e) => {
  e.preventDefault();
  themeView.toggleTheme();
});
searchForm.addEventListener("submit", getSearchMedias);
mediaFilters.addEventListener("click", filterMedia);
mediaFilters.addEventListener("mouseover", filterMediaButtonGroup);
mediaFilters.addEventListener("mouseleave", () => {
  mediaView.moveFilterPill(activeFilter);
});
mediaView.initSearchInput();
mediaView.initClearButton();
