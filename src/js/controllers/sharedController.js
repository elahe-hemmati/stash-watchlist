import sidebarView from "../views/sidebarView.js";
import themeView from "../views/themeView.js";
import { state } from "../state.js";

const initSharedController = function () {
  themeView.loadTheme();

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
