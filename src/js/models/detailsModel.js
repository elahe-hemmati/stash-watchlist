export const prepareDetailsResults = function (data, credits, type) {
  const mainCast = credits.cast.slice(0, 6);
  const directors = credits.crew
    .filter((person) => person.job === "Director")
    .map((director) => director.name);
  const writers = credits.crew
    .filter((person) => person.job === "Writer")
    .map((writer) => writer.name);

  return {
    type,
    id: data.id,
    poster: data.poster_path,
    backdrop: data.backdrop_path,
    overview: data.overview,
    rating: data.vote_average,
    title: type === "movie" ? data.title : data.name,
    year: type === "movie" ? data.release_date : data.first_air_date,
    runtime: type === "movie" ? data.runtime : undefined,
    seasons: data.number_of_seasons,
    episodes: data.number_of_episodes,
    genres: data.genres,
    releaseDate: type === "movie" ? data.release_date : data.first_air_date,
    country: data.production_countries?.[0]?.name,
    originalLanguage: data.original_language,
    status: data.status,
    cast: mainCast,
    directors,
    writers,
    watched: false,
  };
};
