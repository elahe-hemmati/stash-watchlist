"use strict";
import "core-js/stable";
import "regenerator-runtime/runtime";
const noResultIcon = new URL("../img/icons/nothing_found.svg", import.meta.url);
const imageError = new URL("../img/icons/no_image.svg", import.meta.url);
const starFilled = new URL("../img/icons/star_filled.svg", import.meta.url);
const starHalfEmpty = new URL(
  "../img/icons/star_half_empty.svg",
  import.meta.url,
);
const starEmpty = new URL("../img/icons/star_empty.svg", import.meta.url);

const btnNavOpen = document.querySelector(".btn-nav--open");
const btnNavClose = document.querySelector(".btn-nav--close");
const aside = document.querySelector(".aside");
const overlay = document.querySelector(".overlay");
const btnAsideToggle = document.querySelector(".btn-aside--toggle");
const asideIconShow = document.querySelector(".aside-icon--show");
const asideIconHide = document.querySelector(".aside-icon--hide");
const stashLogoS = document.querySelector(".stash-logo-s");
const stashLogoFull = document.querySelector(".stash-logo-full");
const btnTheme = document.querySelector(".btn-theme");
const html = document.querySelector("html");
const lightTheme = document.querySelector(".light-theme");
const darkTheme = document.querySelector(".dark-theme");
const tooltip = document.querySelectorAll(".tooltip");
const asideText = document.querySelectorAll(".aside-text");

// ************************************************
// DOM
let isSidebarCollapsed = true;
// mobile sidebar
const asideOpenMobile = function (e) {
  e.preventDefault();
  stashLogoS.classList.add("hidden");
  stashLogoFull.classList.remove("hidden");
  aside.classList.add("translate-x-0");
  aside.classList.remove("-translate-x-full");
  overlay.classList.remove("hidden");
  asideText.forEach((text) => {
    text.classList.remove("lg:hidden");
  });
};
const asideCloseMobile = function (e) {
  e.preventDefault();
  stashLogoS.classList.remove("hidden");
  stashLogoFull.classList.add("hidden");
  aside.classList.remove("translate-x-0");
  aside.classList.add("-translate-x-full");
  overlay.classList.add("hidden");
  asideText.forEach((text) => {
    text.classList.add("lg:hidden");
  });
};
// expand sidebar
const asideToggle = function () {
  isSidebarCollapsed = !isSidebarCollapsed;
  if (isSidebarCollapsed) {
    asideIconHide.classList.add("hidden");
    asideIconShow.classList.remove("hidden");
    stashLogoS.classList.remove("hidden");
    stashLogoFull.classList.add("hidden");
    aside.classList.remove("lg:w-[clamp(10rem,15vw,15rem)]");
    aside.classList.add("lg:w-[clamp(3rem,5vw,4.5rem)]");
    tooltip.forEach((el) => el.classList.remove("hidden"));

    asideText.forEach((el) => {
      el.classList.add("opacity-0");

      setTimeout(() => {
        el.classList.add("lg:hidden");
      }, 300);
    });
  } else {
    asideIconHide.classList.remove("hidden");
    asideIconShow.classList.add("hidden");
    stashLogoS.classList.add("hidden");
    stashLogoFull.classList.remove("hidden");
    aside.classList.remove("lg:w-[clamp(3rem,5vw,4.5rem)]");
    aside.classList.add("lg:w-[clamp(10rem,15vw,15rem)]");
    tooltip.forEach((el) => el.classList.add("hidden"));
    setTimeout(() => {
      asideText.forEach((el) => {
        el.classList.remove("lg:hidden");

        requestAnimationFrame(() => {
          el.classList.remove("opacity-0");
        });
      });
    }, 300);
  }
};
// theme toggle
const toggleTheme = function (e) {
  e.preventDefault();

  html.classList.toggle("dark");

  lightTheme.classList.toggle("scale-0");
  lightTheme.classList.toggle("rotate-90");
  lightTheme.classList.toggle("opacity-0");

  darkTheme.classList.toggle("scale-0");
  darkTheme.classList.toggle("rotate-90");
  darkTheme.classList.toggle("opacity-0");
};

const showToast = function (message, type = "error") {
  const toast = document.querySelector(".toast");
  const toastMessage = document.querySelector(".toast-message");

  toastMessage.textContent = message;
  toast.classList.remove("hidden");
  if (type === "error") {
    toast.style.setProperty("--toast-color", "#ef4444");
  }

  if (type === "warning") {
    toast.style.setProperty("--toast-color", "#f59e0b");
  }

  if (type === "success") {
    toast.style.setProperty("--toast-color", "#22c55e");
  }
  setTimeout(() => {
    toast.classList.add("hidden");
  }, 4000);
};

// enents
btnNavOpen.addEventListener("click", asideOpenMobile);
btnNavClose.addEventListener("click", asideCloseMobile);
overlay.addEventListener("click", asideCloseMobile);
btnAsideToggle.addEventListener("click", asideToggle);
btnTheme.addEventListener("click", toggleTheme);

// ********API

// const API_KEY = process.env.TMDB_API_KEY;
const TOKEN = process.env.TMDB_TOKEN;
const BASE_URL = "https://api.themoviedb.org/3/";
const searchMediasInput = document.querySelector(".search-media");
const clearSearchButton = document.querySelector(".btn-clear");
const searchForm = document.querySelector(".search-form");
const searchResultsContainer = document.querySelector(
  ".search-results-container",
);
const mediaFilters = document.querySelector(".media-filters");
const pill = document.querySelector(".pill");
let activeFilter = document.querySelector(".media-filter");
let medias, movieGenres, tvGenres;
let currentPage = 1;
let totalPages = 1;
let isLoading = false;
let currentQuery = "";
const sentinel = document.querySelector(".sentinel");
const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${TOKEN}`,
  },
};

const renderSpinner = function (parentEl) {
  const markup = `
  <div class="col-span-full flex min-h-[300px] w-full items-center justify-center">
    <span class="loader"></span>
  </div>
`;

  parentEl.innerHTML = "";
  parentEl.insertAdjacentHTML("afterbegin", markup);
};

const request = async function (endpoint) {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, options);
    const data = await res.json();
    if (!res.ok)
      throw new Error(
        `${data.status_message} Error, http status code ${res.status}`,
      );

    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const prepareMediaData = function (media) {
  return {
    type: media.media_type,
    id: media.id,
    title: media.media_type === "movie" ? media.title : media.name,
    poster: media.poster_path,
    backdrop: media.backdrop_path,
    overview: media.overview,
    year:
      media.media_type === "movie" ? media.release_date : media.first_air_date,
    rating: media.vote_average,
    genres: media.genre_ids,
    runtime: media.runtime,
    watched: false,
  };
};

const getMediaDetails = async function (id, type) {
  return type === "movie"
    ? await request(`movie/${id}`)
    : await request(`tv/${id}`);
};

const getMediaGenres = async function (type) {
  return type === "movie"
    ? await request("genre/movie/list")
    : await request("genre/tv/list");
};

const getPosterUrl = (posterPath) => {
  return posterPath
    ? `https://image.tmdb.org/t/p/w500${posterPath}`
    : imageError;
};
const getBackdropUrl = function (backdropPath) {
  return backdropPath
    ? `https://image.tmdb.org/t/p/w500${backdropPath}`
    : imageError;
};

const getRatingStars = function (rating) {
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
const prepareSearchResults = async function (data) {
  const pageMedias = data.results
    .filter((media) => media.media_type !== "person")
    .map((media) => prepareMediaData(media));

  const mediaDetails = await Promise.all(
    pageMedias.map((media) => getMediaDetails(media.id, media.type)),
  );

  for (let i = 0; i < mediaDetails.length; i++) {
    if (pageMedias[i].type === "movie") {
      pageMedias[i].runtime = mediaDetails[i].runtime;
    } else {
      pageMedias[i].seasons = mediaDetails[i].number_of_seasons;
      pageMedias[i].episodes = mediaDetails[i].number_of_episodes;
    }
  }

  return pageMedias;
};
const loadNextPage = async function () {
  const nextPage = currentPage + 1;
  const queryAtStart = currentQuery;
  const loader = document.querySelector(".pagination-loader");
  loader.innerHTML = `
  <div class="flex items-center justify-center gap-2 py-6">
  <span class="loader"></span>
  <span>Loading more...</span>
  </div>
  `;
  loader.classList.remove("hidden");

  try {
    const data = await request(
      `search/multi?query=${encodeURIComponent(currentQuery)}&page=${nextPage}`,
    );
    const newMedias = await prepareSearchResults(data);
    if (queryAtStart !== currentQuery) return;
    currentPage = nextPage;
    const type = activeFilter.dataset.type;
    let filteredMedia = newMedias;
    if (type === "movie") {
      filteredMedia = newMedias.filter((media) => media.type === "movie");
    }
    if (type === "tv") {
      filteredMedia = newMedias.filter((media) => media.type === "tv");
    }
    medias = medias.concat(newMedias);
    renderSearchMedia(filteredMedia, movieGenres, tvGenres, false);
    observer.unobserve(sentinel);
    observer.observe(sentinel);
  } catch (err) {
    console.error(err);
    showToast("Could not load more results.");
  } finally {
    loader.classList.add("hidden");
    isLoading = false;
  }
};

const getSearchMedias = async function (e) {
  try {
    e.preventDefault();
    isLoading = false;
    medias = [];
    currentPage = 1;
    totalPages = 1;
    activeFilter = document.querySelector(".media-filter");

    pill.style.transform = `translateX(${activeFilter.offsetLeft}px)`;
    pill.style.width = `${activeFilter.offsetWidth}px`;

    const query = searchMediasInput.value;
    currentQuery = query;
    if (!query.trim()) {
      mediaFilters.classList.add("invisible");
      searchResultsContainer.innerHTML = "";
      showToast("Please enter a media name.");
      return;
    }
    const encodedQuery = encodeURIComponent(query);
    renderSpinner(searchResultsContainer);
    const data = await request(
      `search/multi?query=${encodedQuery}&page=${currentPage}`,
    );
    totalPages = data.total_pages;

    if (data.results.length === 0) {
      mediaFilters.classList.add("invisible");
      searchResultsContainer.innerHTML = `<div class="col-span-full flex flex-col items-center justify-center gap-2 min-h-[200px]">
        <img src="${noResultIcon}" alt="" class="w-10 h-10 block animate-pulse"/>
        <p class="text-center text-sm text-zinc-500 dark:text-zinc-400">
         No medias found.</p></div>`;
      return;
    }

    medias = await prepareSearchResults(data);
    movieGenres = await getMediaGenres("movie");
    tvGenres = await getMediaGenres("tv");

    renderSearchMedia(medias, movieGenres, tvGenres);

    return medias;
  } catch (err) {
    console.error(err);
    searchResultsContainer.innerHTML = "";
    showToast(
      "Unable to connect to the media service. Please check your internet connection or VPN.",
    );
  }
};

const filterMediaButtonGroup = function (e) {
  const button = e.target.closest(".media-filter");
  if (!button) return;
  pill.style.transform = `translateX(${button.offsetLeft}px)`;
  pill.style.width = `${button.offsetWidth}px`;
};

const filterMedia = function (e) {
  e.preventDefault();
  const filter = e.target.closest(".media-filter");
  if (!filter) return;
  activeFilter = filter;
  const type = filter.dataset.type;
  if (type === "movie") {
    const movieMedias = medias.filter((media) => media.type === "movie");
    renderSearchMedia(movieMedias, movieGenres, tvGenres);
  } else if (type === "tv") {
    const tvMedias = medias.filter((media) => media.type === "tv");
    renderSearchMedia(tvMedias, movieGenres, tvGenres);
  } else {
    renderSearchMedia(medias, movieGenres, tvGenres);
  }
  observer.unobserve(sentinel);
  observer.observe(sentinel);
};

const filterMediaButtonGroupLeave = function () {
  pill.style.transform = `translateX(${activeFilter.offsetLeft}px)`;
  pill.style.width = `${activeFilter.offsetWidth}px`;
};

// ${movie.genres
//                   .map((genreID) => {
//                     return genres.genres.find((genre) => genre.id === genreID)
//                       .name;
//                   })
//                   .join(", ")}

const escapeHTML = (str) => {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

const renderSearchMedia = function (
  medias,
  movieGenres,
  tvGenres,
  clearContainer = true,
) {
  console.trace("RENDER CALLED");
  if (clearContainer) {
    searchResultsContainer.innerHTML = "";
  }
  const previousCount = searchResultsContainer.children.length;
  medias.forEach((media) => {
    const { fullStars, halfStar, emptyStars } = getRatingStars(media.rating);
    let starsHTML = "";

    for (let i = 0; i < fullStars; i++) {
      starsHTML += `<img src="${starFilled}" class="inline-block w-4 h-4">`;
    }
    for (let i = 0; i < halfStar; i++) {
      starsHTML += `<img src="${starHalfEmpty}" class="inline-block w-4 h-4">`;
    }
    for (let i = 0; i < emptyStars; i++) {
      starsHTML += `<img src="${starEmpty}" class="inline-block w-4 h-4">`;
    }
    const genres = media.type === "movie" ? movieGenres : tvGenres;
    const genre = genres.genres.find(
      (genre) => genre.id === media.genres?.at(0),
    );
    const runtime =
      media.type === "movie"
        ? media.runtime != null
          ? `${Math.floor(media.runtime / 60)}h ${
              media.runtime - Math.floor(media.runtime / 60) * 60
            }m`
          : "N/A"
        : `${media.seasons} S · ${media.episodes} EP`;
    const mediaTypeBadge =
      media.type === "movie" ? "bg-amber-300/80" : "bg-orange-500/80";
    const hasPoster = Boolean(media.poster);
    const card = `
            <div class="media-card relative w-full max-w-[280px] overflow-hidden rounded-xl shadow-[0_8px_20px_rgba(0,0,0,0.3)] dark:shadow-[0_0_20px_rgba(255,255,255,0.15)]">
              <span class="absolute top-2 left-2 z-10 rounded-md px-2 py-1 text-[10px] font-semibold tracking-wide text-white ${mediaTypeBadge}">
              ${media.type === "movie" ? "MOVIE" : "TV SHOW"}</span>
              <button class="add-to-watchlist-btn absolute top-2 right-2 text-xs sm:text-sm">Add to Watchlist</button>
               <div class="poster-wrapper relative aspect-[2/3] w-full bg-[radial-gradient(circle_at_center,rgba(234,179,8,0.18),transparent_55%),linear-gradient(145deg,#18181b,#09090b)] ${hasPoster ? "animate-pulse" : ""}">
                <div class="poster-error ${hasPoster ? "hidden" : ""} absolute inset-0 flex items-center justify-center">
                  <img src="${imageError}" class="w-6 h-6">
                </div>${
                  hasPoster
                    ? `<img
                      alt="${escapeHTML(media.title)}"
                      src="${getPosterUrl(media.poster)}"
                      loading="lazy"
                      decoding="async"
                      class="media-poster w-full h-full object-cover opacity-0 transition-opacity duration-300"/>`
                    : ""
                }</div>
              <div class="absolute bottom-0 left-0 h-3/4 w-full bg-gradient-to-t from-black to-transparent"></div>

              <div class="media-details text-light-cream absolute bottom-3 left-2 mx-3">
                  <h2 class="media-title line-clamp-1 text-lg sm:line-clamp-2 sm:text-xl">${escapeHTML(media.title)}</h2>
                  <p class="media-rating flex gap-1 items-center text-sm sm:text-sm">${media.rating?.toFixed(1) ?? "N/A"}${starsHTML}</p>
                  <p class="media-release-date inline text-sm sm:text-sm">${media.year?.slice(0, 4) ?? "N/A"}</p>
                  <span class="devider text-white/20 text-sm">|</span>
                  <p class="media-runtime inline text-sm sm:text-sm">${runtime}</p>
                  <p class="media-genres text-sm">${genre ? escapeHTML(genre.name) : "N/A"}</p>
              </div>
            </div>`;
    searchResultsContainer.insertAdjacentHTML("beforeend", card);
  });

  document.querySelector(".media-filters").classList.remove("invisible");

  const newMediaCards = Array.from(searchResultsContainer.children).slice(
    previousCount,
  );

  newMediaCards.forEach((card) => {
    const poster = card.querySelector(".media-poster");
    if (!poster) return;
    poster.addEventListener("load", () => {
      poster.classList.remove("opacity-0");
      poster.parentNode.classList.remove("animate-pulse");
    });
    poster.addEventListener("error", () => {
      const posterError = poster.parentNode.querySelector(".poster-error");
      posterError.classList.remove("hidden");
      poster.parentElement.classList.remove("animate-pulse");
    });
  });
};

const observeCallback = function (entries, observer) {
  entries.forEach((entry) => {
    if (
      entry.isIntersecting &&
      isLoading === false &&
      currentQuery.trim() !== "" &&
      currentPage < totalPages
    ) {
      isLoading = true;
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

// enent
searchForm.addEventListener("submit", getSearchMedias);
mediaFilters.addEventListener("click", filterMedia);
mediaFilters.addEventListener("mouseover", filterMediaButtonGroup);
mediaFilters.addEventListener("mouseleave", filterMediaButtonGroupLeave);
// clear input
searchMediasInput.addEventListener("input", function () {
  clearSearchButton.classList.toggle("hidden", !searchMediasInput.value);
  clearSearchButton.classList.toggle("flex", !!searchMediasInput.value);
});
clearSearchButton.addEventListener("click", function () {
  searchMediasInput.value = "";
  clearSearchButton.classList.add("hidden");
  clearSearchButton.classList.remove("flex");
  searchMediasInput.focus();
});
