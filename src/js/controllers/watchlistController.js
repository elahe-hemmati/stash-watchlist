import initSharedController, {
  controlGoToDetails,
} from "./sharedController.js";
import * as sharedModel from "../models/sharedModel.js";
import * as watchlistModel from "../models/watchlistModel.js";
import watchlistView from "../views/watchlistView.js";
import confirmView from "../views/confirmView.js";
import toastView from "../views/toastView.js";
import { state } from "../state.js";

const controlFilterWatchlist = function (filterType) {
  const medias = state.currentQuery
    ? watchlistModel.searchWatchlist(state.currentQuery)
    : state.watchlist;

  const filteredMedias = sharedModel.filterMediasByType(medias, filterType);
  if (state.watchlist.length === 0) {
    watchlistView.renderEmptyWatchlist();
    watchlistView.hideWatchlistToolbar();
    return;
  }
  if (filteredMedias.length === 0) {
    if (state.currentQuery) {
      watchlistView.renderNoSearchResults(filterType);
    } else if (filterType !== "all") {
      watchlistView.renderNoFilterResults(filterType);
    }
    return;
  }
  const sortedMedias = watchlistModel.sortWatchlist(
    filteredMedias,
    state.activeSort,
  );
  watchlistView.render(sortedMedias);
};

const controlRemoveFromWatchlist = async function (id, type) {
  const confirmed = await confirmView.confirm();
  if (!confirmed) return;
  watchlistModel.deleteFromWatchlist(id, type);
  const filterType = watchlistView.getActiveFilterType();
  controlFilterWatchlist(filterType);
  toastView.showToast("Removed from your watchlist.", "success");
};

const controlToggleWatched = function (id, type) {
  watchlistModel.toggleWatched(id, type);
  const filterType = watchlistView.getActiveFilterType();
  controlFilterWatchlist(filterType);
};

const controlSortWatchlist = function (sortType) {
  state.activeSort = sortType;
  controlFilterWatchlist(watchlistView.getActiveFilterType());
};

const getSearchWatchlist = function () {
  const query = watchlistView.getSearchQuery();
  state.currentQuery = query;
  controlFilterWatchlist(watchlistView.getActiveFilterType());
};

const init = function () {
  watchlistModel.loadWatchlist();
  watchlistView.resetFilter();
  initSharedController();
  if (state.watchlist.length === 0) {
    watchlistView.renderEmptyWatchlist();
    watchlistView.hideWatchlistToolbar();
  } else {
    watchlistView.movePillToActiveFilter();
    controlFilterWatchlist("all");
  }
  watchlistView.addHandlerRemoveFromWatchlist(controlRemoveFromWatchlist);
  watchlistView.addHandlerToggleWatched(controlToggleWatched);
  watchlistView.addHandlerFilter(controlFilterWatchlist);
  watchlistView.addHandlerFilterHover();
  watchlistView.addHandlerFilterLeave(() =>
    watchlistView.movePillToActiveFilter(),
  );
  watchlistView.addHandlerSort(controlSortWatchlist);
  watchlistView.addHandlerSearch(getSearchWatchlist);
  watchlistView.initSearchInput();
  watchlistView.addHandlerClearSearch(getSearchWatchlist);
  watchlistView.addHandlerGoToDetails(controlGoToDetails);
  confirmView.addHandlerConfirm();
  confirmView.addHandlerCancel();
};

init();

window.addEventListener("pageshow", function () {
  watchlistModel.loadWatchlist();
  controlFilterWatchlist(watchlistView.getActiveFilterType());
});
