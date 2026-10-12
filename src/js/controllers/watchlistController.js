import initSharedController from "./sharedController.js";
import * as sharedModel from "../models/sharedModel.js";
import * as watchlistModel from "../models/watchlistModel.js";
import watchlistView from "../views/watchlistView.js";
import { state } from "../state.js";

const controlFilterWatchlist = function (filterType) {
  const filteredMedias = sharedModel.filterMediasByType(
    state.watchlist,
    filterType,
  );
  if (state.watchlist.length === 0) {
    watchlistView.renderEmptyWatchlist();
    watchlistView.hideMediaFilters();
    return;
  }
  if (filteredMedias.length === 0 && filterType !== "all") {
    watchlistView.renderNoFilterResults(filterType);
    return;
  }
  watchlistView.render(filteredMedias);
};

const controlRemoveFromWatchlist = function (id, type) {
  watchlistModel.deleteFromWatchlist(id, type);
  const filterType = watchlistView.getActiveFilterType();
  controlFilterWatchlist(filterType);
};

const controlToggleWatched = function (id, type) {
  watchlistModel.toggleWatched(id, type);
  const filterType = watchlistView.getActiveFilterType();
  controlFilterWatchlist(filterType);
};

const init = function () {
  watchlistModel.loadWatchlist();
  watchlistView.resetFilter();
  initSharedController();
  if (state.watchlist.length === 0) {
    watchlistView.renderEmptyWatchlist();
    watchlistView.hideMediaFilters();
  } else {
    watchlistView.movePillToActiveFilter();
    watchlistView.render(state.watchlist);
  }
  watchlistView.addHandlerRemoveFromWatchlist(controlRemoveFromWatchlist);
  watchlistView.addHandlerToggleWatched(controlToggleWatched);
  watchlistView.addHandlerFilter(controlFilterWatchlist);
  watchlistView.addHandlerFilterHover();
  watchlistView.addHandlerFilterLeave(() =>
    watchlistView.movePillToActiveFilter(),
  );
};

init();
