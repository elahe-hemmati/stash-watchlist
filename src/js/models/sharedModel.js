export const filterMediasByType = function (medias, type) {
  let filteredMedia = medias;
  if (type === "movie") {
    filteredMedia = medias.filter((media) => media.type === "movie");
  }
  if (type === "tv") {
    filteredMedia = medias.filter((media) => media.type === "tv");
  }
  return filteredMedia;
};
