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
// const main = document.querySelector(".main");

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
  asideText.classList.remove("lg:hidden");
};
const asideCloseMobile = function (e) {
  e.preventDefault();
  stashLogoS.classList.remove("hidden");
  stashLogoFull.classList.add("hidden");
  aside.classList.remove("translate-x-0");
  aside.classList.add("-translate-x-full");
  overlay.classList.add("hidden");
  asideText.classList.add("lg:hidden");
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
const searchForm = document.querySelector(".search-form");
const searchResultsContainer = document.querySelector(
  ".search-results-container",
);
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
    renderSpinner(searchResultsContainer);
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
    ? await request("/genre/movie/list")
    : await request("/genre/tv/list");
};

const getPosterUrl = function (posterPath) {
  return `https://image.tmdb.org/t/p/w500${posterPath}`;
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

const getSearchMedias = async function (e) {
  try {
    e.preventDefault();
    const query = searchMediasInput.value;
    if (!query.trim()) {
      searchResultsContainer.innerHTML = "";
      showToast("Please enter a media name.");
      return;
    }
    const encodedQuery = encodeURIComponent(query);
    const data = await request(`/search/multi?query=${encodedQuery}`);
    if (data.results.length === 0) {
      searchResultsContainer.innerHTML = `<div class="col-span-full flex flex-col items-center justify-center gap-2 min-h-[200px]">
        <img src="${noResultIcon}" alt="" class="w-10 h-10 block animate-pulse"/>
        <p class="text-center text-sm text-zinc-500 dark:text-zinc-400">
         No medias found.</p></div>`;
      return;
    }
    const medias = data.results
      .filter((media) => media.media_type !== "person")
      .map((media) => prepareMediaData(media));
    const mediaDetails = await Promise.all(
      medias.map((media) => getMediaDetails(media.id, media.type)),
    );
    for (let i = 0; i < mediaDetails.length; i++) {
      if (medias[i].type === "movie") {
        medias[i].runtime = mediaDetails[i].runtime;
      } else {
        medias[i].seasons = mediaDetails[i].number_of_seasons;
        medias[i].episodes = mediaDetails[i].number_of_episodes;
      }
    }
    const movieGenres = await getMediaGenres("movie");
    const tvGenres = await getMediaGenres("tv");

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

// ${movie.genres
//                   .map((genreID) => {
//                     return genres.genres.find((genre) => genre.id === genreID)
//                       .name;
//                   })
//                   .join(", ")}

const renderSearchMedia = function (medias, movieGenres, tvGenres) {
  searchResultsContainer.innerHTML = "";
  medias.map((media) => {
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
    const card = `
            <div class="media-card relative w-full max-w-[280px] overflow-hidden rounded-xl shadow-[0_8px_20px_rgba(0,0,0,0.3)] dark:shadow-[0_0_20px_rgba(255,255,255,0.15)]">
              <span class="absolute top-2 left-2 z-10 rounded-md px-2 py-1 text-[10px] font-semibold tracking-wide text-white ${mediaTypeBadge}">
              ${media.type === "movie" ? "MOVIE" : "TV SHOW"}</span>
              <button class="add-to-watchlist-btn absolute top-2 right-2 text-xs sm:text-sm">Add to Watchlist</button>
               <div class="poster-wrapper relative aspect-[2/3] w-full bg-[radial-gradient(circle_at_center,rgba(234,179,8,0.18),transparent_55%),linear-gradient(145deg,#18181b,#09090b)] animate-pulse">
                <div class="poster-error hidden absolute inset-0 flex items-center justify-center">
                  <img src="${imageError}" class="w-6 h-6">
                </div>
                <img
                alt="${media.title}"
                src="${getPosterUrl(media.poster)}"
                loading="lazy"
                decoding="async"
                class="media-poster w-full h-full object-cover opacity-0 transition-opacity duration-300"
                />
              </div>
              <div class="absolute bottom-0 left-0 h-3/4 w-full bg-gradient-to-t from-black to-transparent"></div>

              <div class="media-details text-light-cream absolute bottom-3 left-2 mx-3">
                  <h2 class="media-title line-clamp-1 text-lg sm:line-clamp-2 sm:text-xl">${media.title}</h2>
                  <p class="media-rating flex gap-1 items-center text-sm sm:text-sm">${media.rating?.toFixed(1) ?? "N/A"}${starsHTML}</p>
                  <p class="media-release-date inline text-sm sm:text-sm">${media.year?.slice(0, 4) ?? "N/A"}</p>
                  <span class="devider text-white/20 text-sm">|</span>
                  <p class="media-runtime inline text-sm sm:text-sm">${runtime}</p>
                  <p class="media-genres text-sm">${genre ? genre.name : "N/A"}</p>
              </div>
            </div>`;
    searchResultsContainer.insertAdjacentHTML("beforeend", card);
  });
  const mediaPosters = document.querySelectorAll(".media-poster");
  mediaPosters.forEach((poster) => {
    (poster.addEventListener("load", () => {
      poster.classList.remove("opacity-0");
      poster.parentNode.classList.remove("animate-pulse");
    }),
      poster.addEventListener("error", () => {
        const posterError = poster.parentNode.querySelector(".poster-error");
        posterError.classList.remove("hidden");
        poster.parentElement.classList.remove("animate-pulse");
      }));
  });
};
// enent
searchForm.addEventListener("submit", getSearchMedias);
