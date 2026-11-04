import * as assets from "../helpers/asset.js";
import * as helper from "../helpers/helper.js";
import posterView from "./posterView.js";

class DetailsMarkup extends posterView {
  createSkeletonMarkup() {
    return `
    <section
      class="border-dark-black/10 bg-light-cream/50 dark:border-light-cream/10 dark:bg-dark-black/40 relative isolate w-full overflow-hidden rounded-3xl border"
      aria-busy="true"
      aria-label="Loading media details"
    >
      <!-- Backdrop Skeleton -->
      <div class="absolute inset-0 -z-20 animate-pulse bg-light-cream/60 dark:bg-dark-black/60"></div>

      <!-- Backdrop Overlay -->
      <div class="from-light-cream/95 via-light-cream/80 to-light-cream/50 dark:from-dark-black/95 dark:via-dark-black/80 dark:to-dark-black/50 absolute inset-0 -z-10 bg-gradient-to-r"></div>

      <!-- Hero Content -->
      <div class="grid grid-cols-1 items-center gap-8 p-5 sm:p-8 md:grid-cols-[200px_minmax(0,1fr)] lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10 lg:p-10">

        <!-- Poster Skeleton -->
        <div class="mx-auto w-full max-w-[200px] md:max-w-none">
          <div class="aspect-[2/3] w-full animate-pulse rounded-2xl bg-dark-black/10 shadow-2xl dark:bg-light-cream/10"></div>
        </div>

        <!-- Media Info Skeleton -->
        <div class="flex min-w-0 flex-col gap-5">

          <!-- Title and Genres -->
          <div>
            <div class="mb-4 h-3 w-16 animate-pulse rounded bg-amber-600/20 dark:bg-amber-400/20"></div>
            <div class="h-9 w-3/4 max-w-md animate-pulse rounded-lg bg-dark-black/10 sm:h-12 dark:bg-light-cream/10"></div>

            <div class="mt-4 flex flex-wrap gap-2">
              <div class="h-6 w-16 animate-pulse rounded-full bg-dark-black/10 dark:bg-light-cream/10"></div>
              <div class="h-6 w-24 animate-pulse rounded-full bg-dark-black/10 dark:bg-light-cream/10"></div>
              <div class="h-6 w-20 animate-pulse rounded-full bg-dark-black/10 dark:bg-light-cream/10"></div>
            </div>
          </div>

          <!-- Rating and Bookmark -->
          <div class="flex gap-3">
            <div class="h-10 w-28 animate-pulse rounded-lg bg-dark-black/10 dark:bg-light-cream/10"></div>
            <div class="h-10 w-40 animate-pulse rounded-lg bg-dark-black/10 dark:bg-light-cream/10"></div>
          </div>

          <!-- Overview -->
          <div class="max-w-2xl space-y-3">
            <div class="h-6 w-28 animate-pulse rounded bg-dark-black/10 dark:bg-light-cream/10"></div>
            <div class="h-3 w-full animate-pulse rounded bg-dark-black/10 dark:bg-light-cream/10"></div>
            <div class="h-3 w-11/12 animate-pulse rounded bg-dark-black/10 dark:bg-light-cream/10"></div>
            <div class="h-3 w-4/5 animate-pulse rounded bg-dark-black/10 dark:bg-light-cream/10"></div>
          </div>

          <!-- Additional Details -->
          <div class="border-dark-black/10 dark:border-light-cream/15 grid grid-cols-2 gap-x-5 gap-y-4 border-t pt-5 sm:grid-cols-3">
            ${Array.from(
              { length: 6 },
              () => `
              <div class="space-y-2">
                <div class="h-3 w-20 animate-pulse rounded bg-dark-black/10 dark:bg-light-cream/10"></div>
                <div class="h-4 w-24 animate-pulse rounded bg-dark-black/10 dark:bg-light-cream/10"></div>
              </div>
            `,
            ).join("")}
          </div>

          <!-- Cast Skeleton -->
          <div class="flex gap-3 pt-2">
            ${Array.from(
              { length: 5 },
              () => `
              <div class="h-12 w-12 shrink-0 animate-pulse rounded-full bg-dark-black/10 sm:h-16 sm:w-16 dark:bg-light-cream/10"></div>
            `,
            ).join("")}
          </div>

        </div>
      </div>
    </section>
  `;
  }

  createDetailsMarkup(data) {
    const hasPoster = Boolean(data.poster);
    const hasDetails = Boolean(
      data.releaseDate ||
      data.country ||
      data.runtime != null ||
      data.originalLanguage ||
      data.status ||
      data.directors?.length ||
      data.writers?.length,
    );

    return `
    <section class="border-dark-black/10 bg-light-cream/50 dark:border-light-cream/10 dark:bg-dark-black/40 relative isolate w-full overflow-hidden rounded-3xl border">
       <!-- Backdrop -->
       <div class="absolute inset-0 -z-20 overflow-hidden bg-light-cream/60 dark:bg-dark-black/60">
          <img src="${helper.getBackdropUrl(data.backdrop)}" alt="" class="details-backdrop h-full w-full object-cover opacity-30 transition-opacity duration-700"/>
          <div class="absolute inset-0 animate-pulse bg-dark-black/5 dark:bg-light-cream/5"></div>
      </div>
      <!-- Overlay -->
      <div
      class="from-light-cream/95 via-light-cream/80 to-light-cream/50 dark:from-dark-black/95 dark:via-dark-black/80 dark:to-dark-black/50 absolute inset-0 -z-10 bg-gradient-to-r"></div>
  
        <!-- Hero Content -->
        <div class="grid grid-cols-1 items-center gap-8 p-5 sm:p-8 md:grid-cols-[200px_minmax(0,1fr)] lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10 lg:p-10">
            
            <!-- Poster -->
            <div class="mx-auto w-full max-w-[200px] md:max-w-none">

                <div class="poster-wrapper rounded-2xl shadow-2xl relative aspect-[2/3] w-full bg-[radial-gradient(circle_at_center,rgba(234,179,8,0.18),transparent_55%),linear-gradient(145deg,#18181b,#09090b)] ${hasPoster ? "animate-pulse" : ""}">
                    <div class="poster-error ${hasPoster ? "hidden" : ""} absolute inset-0 flex items-center justify-center">
                        <img src="${assets.imageError}" class="w-6 h-6">
                    </div>
                ${
                  hasPoster
                    ? `<img
                          alt="${helper.escapeHTML(data.title)}"
                          src="${helper.getPosterUrl(data.poster)}"
                          loading="lazy"
                          width="500"
                          height="750"
                          decoding="async"
                          class="media-poster rounded-2xl shadow-2xl w-full h-full object-cover opacity-0 transition-opacity duration-300"/>`
                    : ""
                }
                </div>
            </div>

            <!-- Media Info -->
            <div class="flex min-w-0 flex-col gap-5">
                <div>
                    <p class="mb-2 text-xs font-semibold tracking-[0.2em] text-amber-600 uppercase dark:text-amber-400">
                    ${data.type === "movie" ? "Movie" : "TV Show"}
                    </p>
                    <h2
                    class="text-3xl leading-tight font-bold sm:text-4xl lg:text-5xl">
                    ${helper.escapeHTML(data.title)}</h2>
                    
                    ${
                      data.genres?.length
                        ? `
                    <div class="mt-3 flex flex-wrap items-center gap-2">
                    ${data.genres
                      .map(
                        (genre) => `
                        <span class="rounded-full bg-amber-400/15 px-3 py-1 text-xs font-medium text-amber-900 dark:bg-white/10 dark:text-amber-200">
                        ${helper.escapeHTML(genre.name)}</span>`,
                      )
                      .join("")}
                    </div>`
                        : ""
                    }
                </div>
                <!-- Rating and Bookmark -->
                <div class="flex flex-wrap items-center gap-3">
                   ${
                     data.rating != null
                       ? `
                    <span class="rounded-lg bg-amber-400/15 px-3 py-2 font-semibold text-amber-700 dark:text-amber-300">
                     ★ ${data.rating.toFixed(1)} / 10 </span>`
                       : ""
                   }

                    <button
                        type="button"
                        class="add-to-watchlist-btn border-dark-black/15 dark:border-light-cream/20 flex items-center gap-2 rounded-lg border bg-white/40 px-4 py-2 transition hover:bg-amber-400/15 dark:bg-black/20" id="add-to-watchlist-${data.id}-${data.type}" aria-label="Add to watchlist" title="Add to Watchlist" data-id="${data.id}" data-type="${data.type}"
                        >
                          <img
                            src="${data.isAdded ? assets.bookmarkFilled : assets.bookmark}"
                            alt=""
                            class="h-4 w-4"
                          />
                          <span>${data.isAdded ? "Remove from Watchlist" : "Add to Watchlist"}
                          </span>
                    </button>
                </div>

                <!-- Overview -->
                ${
                  data.overview
                    ? `
                <div class="max-w-2xl">
                    <h3 class="mb-2 text-lg font-semibold">Overview</h3>
                    <p class="text-sm leading-7 opacity-80 sm:text-base">
                        ${helper.escapeHTML(data.overview)}
                    </p>
                </div>`
                    : ""
                }

                <!-- Additional Details -->
                ${
                  hasDetails
                    ? `
                <dl class="border-dark-black/10 dark:border-light-cream/15 grid grid-cols-2 gap-x-5 gap-y-4 border-t pt-5 sm:grid-cols-3">
                    <!-- date -->
                    ${
                      data.releaseDate
                        ? `<div>
                    <dt class="mb-1 text-xs opacity-60">Release Date</dt>
                    <dd class="font-medium">
                    ${helper.escapeHTML(helper.formatDate(data.releaseDate))}</dd>
                    </div>`
                        : ""
                    }
                    <!-- country -->
                    ${
                      data.country
                        ? `<div>
                    <dt class="mb-1 text-xs opacity-60">Country</dt>
                    <dd class="font-medium">${helper.escapeHTML(data.country)}</dd>
                    </div>`
                        : ""
                    } 
                 <!-- Runtime or Episodes -->
                ${
                  data.runtime != null ||
                  (data.seasons != null && data.episodes != null)
                    ? `
                  <div>
                    <dt class="mb-1 text-xs opacity-60">
                    ${data.type === "movie" ? "Runtime" : "Seasons / Episodes"}</dt>
                    <dd class="font-medium">${helper.escapeHTML(helper.formatRuntime(data))}</dd>
                    </div>`
                    : ""
                }
                    <!-- language -->
                    ${
                      data.originalLanguage
                        ? `<div>
                    <dt class="mb-1 text-xs opacity-60">Original Language</dt>
                    <dd class="font-medium">${helper.escapeHTML(helper.getLanguageName(data.originalLanguage))}</dd></div>`
                        : ""
                    }
                    <!-- status -->
                    ${
                      data.status
                        ? `<div>
                    <dt class="mb-1 text-xs opacity-60">Status</dt>
                    <dd class="font-medium">${helper.escapeHTML(data.status)}</dd></div>`
                        : ""
                    }
                    <!-- director -->
                    ${
                      data.directors?.length
                        ? `<div>
                    <dt class="mb-1 text-xs opacity-60">Director</dt>
                    <dd class="font-medium">${helper.escapeHTML(data.directors?.join(", "))}</dd></div>`
                        : ""
                    }
                    <!-- writer -->
                    ${
                      data.writers?.length
                        ? `<div>
                    <dt class="mb-1 text-xs opacity-60">Writer</dt>
                    <dd class="font-medium">${helper.escapeHTML(data.writers?.join(", "))}</dd></div>`
                        : ""
                    }
           
                </dl>`
                    : ""
                }

                <!-- Cast -->
                ${
                  data.cast.filter((actor) => actor.profile_path).length
                    ? `<section class="w-full">
                    <div class="cast-stack flex flex-wrap items-start gap-y-16" aria-label="Cast">
                    ${data.cast
                      .filter((actor) => actor.profile_path)
                      .map(
                        (actor) => `
                        <div class="cast-item group relative">
                            <div class="cast-circle">
                                <img
                                src="${helper.getProfileUrl(actor.profile_path)}" alt="${helper.escapeHTML(actor.name)}" loading="lazy" class="h-full w-full rounded-full object-cover object-top"/>
                            </div>

                            <div class="cast-info pointer-events-none fixed z-50 w-max max-w-40 rounded-xl border border-dark-black/10 bg-light-cream/70 px-3 py-2 text-center text-dark-black opacity-0 shadow-lg backdrop-blur-md transition-opacity duration-200 group-hover:opacity-100 dark:border-light-cream/10 dark:bg-dark-black/60 dark:text-light-cream">
                            <p class="text-sm font-semibold">
                            ${helper.escapeHTML(actor.name)}</p>
                            <p class="mt-1 text-xs text-dark-black/60 dark:text-light-cream/60">
                            ${helper.escapeHTML(actor.character || "")}
                            </p>
                            </div>
                        </div>`,
                      )
                      .join("")}
                    </div>
                </section>`
                    : ""
                }
            </div>
        </div>
    </section>`;
  }

  createSimilarMediaMarkup(similar, type) {
    return ` 
    <section class="mt-16 w-full">
      <div class="mb-6 flex items-center justify-between gap-4">
        <div>
          <p
            class="mb-1 text-xs font-semibold tracking-[0.2em] text-amber-600 uppercase dark:text-amber-400"
          >
            More to explore
          </p>
          <h2 class="text-2xl font-bold sm:text-3xl">Similar ${type === "movie" ? "Movies" : "TV Shows"}</h2>
        </div>
      </div>
      <section class="relative">
        <button
          id="prev"
          class="absolute top-1/2 -left-4 z-10 -translate-y-1/2 rounded-full bg-amber-400 p-3 text-black"
        >
          ←
        </button>

      <div class="carousel overflow-hidden" tabindex="0">
      <div id="track"
            class="carousel-track flex flex-nowrap gap-4 transition-transform duration-500">  
      ${similar.map((sim) => this.createSimilarMediaCard(sim)).join("")}
      </div>
      </div>
      <button
          id="next"
          class="absolute top-1/2 -right-4 z-10 -translate-y-1/2 rounded-full bg-amber-400 p-3 text-black"
        >
          →
        </button>
      </section>
    </section>`;
  }

  createSimilarMediaCard(media) {
    const title = helper.escapeHTML(media.title);
    const posterUrl = media.poster ? helper.getPosterUrl(media.poster) : "";
    const detailsUrl = `./details.html?id=${media.id}&type=${media.type}`;
    const isAdded = Boolean(media.isAdded);
    const hasPoster = Boolean(media.poster);

    return `
    <article class="carousel-slide shrink-0 basis-[55%] md:basis-[calc((100%-3rem)/4)] lg:basis-[calc((100%-4rem)/5)]">
      <div
        class="media-card-wrapper relative rounded-xl border-2 border-transparent p-[1px]
        hover:[animation:border_2.5s_linear_infinite]
        hover:[background:linear-gradient(white,white)_padding-box,conic-gradient(from_var(--border-angle),transparent_25%,#f59e0b_50%,transparent_75%)_border-box]
        dark:hover:[background:linear-gradient(#18181b,#18181b)_padding-box,conic-gradient(from_var(--border-angle),transparent_25%,#f59e0b_50%,transparent_75%)_border-box]"
      >
        <div
          class="media-card relative w-full overflow-hidden rounded-xl
          shadow-[0_8px_20px_rgba(0,0,0,0.3)]
          dark:shadow-[0_0_20px_rgba(255,255,255,0.15)]"
          data-id="${media.id}"
          data-type="${media.type}"
        >
          <span
            class="absolute top-2 left-2 z-10 rounded-md px-2 py-1
            text-[10px] font-semibold tracking-wide text-white
            ${media.type === "movie" ? "bg-amber-300/80" : "bg-orange-500/80"}"
          >
            ${media.type === "movie" ? "MOVIE" : "TV SHOW"}
          </span>

          <button
            type="button"
            class="add-to-watchlist-btn group absolute top-2 right-2 z-20
            flex h-9 w-9 items-center justify-center rounded-full
            border border-white/20 bg-black/40 text-white shadow-lg
            backdrop-blur-md transition-all duration-300
            hover:scale-110 hover:border-amber-300/50 hover:bg-black/60
            focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/70"
            id="add-to-watchlist-${media.id}-${media.type}"
            aria-label="${isAdded ? "Remove from" : "Add to"} watchlist"
            title="${isAdded ? "Remove from" : "Add to"} Watchlist"
            data-id="${media.id}"
            data-type="${media.type}"
          >
            <img
              src="${isAdded ? assets.bookmarkFilled : assets.bookmark}"
              alt=""
              class="h-5 w-5 transition-transform duration-300"
            />
          </button>

          <div
            class="poster-wrapper relative aspect-[2/3] w-full
            bg-[radial-gradient(circle_at_center,rgba(234,179,8,0.18),transparent_55%),linear-gradient(145deg,#18181b,#09090b)]
            ${hasPoster ? "animate-pulse" : ""}"
          >
            <div
              class="poster-error ${hasPoster ? "hidden" : ""} absolute inset-0
              flex items-center justify-center"
            >
              <img src="${assets.imageError}" alt="" class="h-6 w-6" />
            </div>

            ${
              hasPoster
                ? `
                  <img
                    src="${posterUrl}"
                    alt="${title}"
                    loading="lazy"
                    width="500"
                    height="750"
                    decoding="async"
                    class="media-poster h-full w-full object-cover opacity-0
                    transition-opacity duration-300"
                  />
                `
                : ""
            }
          </div>

          <a
            href="${detailsUrl}"
            class="absolute inset-0 z-0"
            aria-label="View ${title} details"
          ></a>

          <div
            class="pointer-events-none absolute inset-0
            bg-gradient-to-t from-black/95 via-black/20 to-transparent"
          ></div>

          <div class="pointer-events-none absolute inset-x-0 bottom-0 p-3 text-white sm:p-4">
            <div class="mb-1 flex items-center gap-1.5 text-xs">
              <span class="text-amber-400">★</span>
              <span class="font-semibold">${media.rating?.toFixed(1) ?? "N/A"}</span>
              <span class="text-white/60">
                · ${media.year?.slice(0, 4) ?? "N/A"}
              </span>
            </div>

            <h3 class="line-clamp-2 text-sm leading-snug font-semibold sm:text-base">
              ${title}
            </h3>
          </div>
        </div>
      </div>
    </article>
  `;
  }
}
export default new DetailsMarkup();
