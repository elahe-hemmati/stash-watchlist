import sidebarView from "../views/sidebarView.js";
import themeView from "../views/themeView.js";
import { state } from "../state.js";
import * as watchlistModel from "../models/watchlistModel.js";
import confirmView from "../views/confirmView.js";
import toastView from "../views/toastView.js";

export const handleWatchlistToggle = async function (media, view) {
  const { id, type } = media;
  const isAlreadyAdded = watchlistModel.isInWatchlist(media);
  if (isAlreadyAdded) {
    const confirmed = await confirmView.confirm();
    if (!confirmed) return;
    watchlistModel.deleteFromWatchlist(id, type);
    view.updateWatchlistIcon(id, type, false);
    toastView.showToast("Removed from your watchlist.", "success");
    return;
  }
  const isAdded = watchlistModel.toggleWatchlist(media);
  view.updateWatchlistIcon(id, type, isAdded);
  if (isAdded) {
    toastView.showToast("Added to your watchlist.", "success");
  }
};

export const controlGoToDetails = function (id, type) {
  const params = new URLSearchParams({ id, type });
  window.location.href = `./details.html?${params}`;
};

const initSharedController = function () {
  themeView.loadTheme();
  watchlistModel.loadWatchlist();

  sidebarView.addHandlerNavOpen(() => {
    sidebarView.asideOpenMobile();
  });

  sidebarView.addHandlerNavClose(() => {
    sidebarView.asideCloseMobile();
  });

  sidebarView.addHandlerOverlay(() => {
    sidebarView.asideCloseMobile();
  });

  sidebarView.addHandlerAsideToggle(() => {
    state.isSidebarCollapsed = !state.isSidebarCollapsed;
    sidebarView.asideToggle(state.isSidebarCollapsed);
  });

  themeView.addHandlerToggleTheme(() => {
    themeView.toggleTheme();
  });
};

export default initSharedController;
