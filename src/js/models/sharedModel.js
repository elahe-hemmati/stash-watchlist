import { TOKEN, BASE_URL } from "../config.js";

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${TOKEN}`,
  },
};

export const request = async function (endpoint, signal) {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      signal,
    });
    const data = await res.json();
    if (!res.ok)
      throw new Error(
        `${data.status_message} Error, http status code ${res.status}`,
      );

    return data;
  } catch (err) {
    throw err;
  }
};

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
