import * as sharedModel from "./sharedModel.js";

export const prepareMediaData = function (media) {
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

export const getMediaDetails = async function (id, type, signal) {
  return type === "movie"
    ? await sharedModel.request(`movie/${id}`, signal)
    : await sharedModel.request(`tv/${id}`, signal);
};

export const getMediaGenres = async function (type, signal) {
  return type === "movie"
    ? await sharedModel.request("genre/movie/list", signal)
    : await sharedModel.request("genre/tv/list", signal);
};

const preparePageMedias = function (data) {
  return data.results
    .filter(
      (media) => media.media_type === "movie" || media.media_type === "tv",
    )
    .map((media) => prepareMediaData(media));
};

const enrichMediaDetails = async function (medias, signal) {
  const mediaDetails = await Promise.all(
    medias.map(async (media) => {
      try {
        return await getMediaDetails(media.id, media.type, signal);
      } catch (err) {
        if (err.name === "AbortError") throw err;
        return null;
      }
    }),
  );
  const validMedias = [];
  for (let i = 0; i < mediaDetails.length; i++) {
    if (!mediaDetails[i]) continue;
    if (medias[i].type === "movie") {
      medias[i].runtime = mediaDetails[i].runtime;
    } else {
      medias[i].seasons = mediaDetails[i].number_of_seasons;
      medias[i].episodes = mediaDetails[i].number_of_episodes;
    }
    validMedias.push(medias[i]);
  }

  return validMedias;
};

export const prepareSearchResults = async function (data, signal) {
  const pageMedias = preparePageMedias(data);
  return await enrichMediaDetails(pageMedias, signal);
};
