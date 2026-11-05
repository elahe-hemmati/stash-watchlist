import * as sharedModel from "../models/sharedModel.js";
import * as detailsModel from "../models/detailsModel.js";
import detailsView from "../views/detailsView.js";
import detailsCarouselView from "../views/detailsCarouselView.js";
import toastView from "../views/toastView.js";
import initSharedController, {
  handleWatchlistToggle,
} from "./sharedController.js";
import * as watchlistModel from "../models/watchlistModel.js";
import confirmView from "../views/confirmView.js";

const getMediaIdAndType = function () {
  const params = new URLSearchParams(window.location.search);

  const id = params.get("id");
  const type = params.get("type");

  return { id, type };
};

const getMedia = async function () {
  detailsView.renderSkeleton();
  try {
    const { id, type } = getMediaIdAndType();
    const endpoint = type === "movie" ? `movie/${id}` : `tv/${id}`;
    const endpointCast =
      type === "movie" ? `movie/${id}/credits` : `tv/${id}/credits`;
    const endpointSimilar =
      type === "movie" ? `movie/${id}/similar` : `tv/${id}/similar`;
    const data = await sharedModel.request(endpoint);
    const credits = await sharedModel.request(endpointCast);
    const similar = await sharedModel.request(endpointSimilar);
    const mediaDetails = detailsModel.prepareDetailsResults(
      data,
      credits,
      type,
    );
    const similarDetails = detailsModel.prepareSimilarResults(
      similar.results,
      type,
    );
    similarDetails.forEach((media) => {
      media.isAdded = watchlistModel.isInWatchlist(media);
    });
    mediaDetails.similar = similarDetails;
    mediaDetails.isAdded = watchlistModel.isInWatchlist(mediaDetails);
    detailsView.render(mediaDetails);
    detailsCarouselView.init();
  } catch (err) {
    console.error(err);
    toastView.showToast(
      "Unable to connect to the media service. Please check your internet connection or VPN.",
      "error",
    );
  }
};

const controlAddToWatchlist = function (media) {
  handleWatchlistToggle(media, detailsView);
};

const controlAddSimilarToWatchlist = function (id, type) {
  const media = detailsView.getSimilarMedia(id, type);
  if (!media) return;

  handleWatchlistToggle(media, detailsView);
};

const init = function () {
  initSharedController();
  detailsView.addHandlerAddToWatchlist(controlAddToWatchlist);
  detailsView.addHandlerAddSimilarToWatchlist(controlAddSimilarToWatchlist);
  confirmView.addHandlerConfirm();
  confirmView.addHandlerCancel();
  getMedia();
};
init();

window.addEventListener("pageshow", function () {
  watchlistModel.loadWatchlist();

  const { id, type } = getMediaIdAndType();
  const isAdded = watchlistModel.isInWatchlist({
    id: Number(id),
    type,
  });

  detailsView.updateWatchlistIcon(id, type, isAdded);
});
