class SidebarView {
  _aside = document.querySelector(".aside");
  _asideIconShow = document.querySelector(".aside-icon--show");
  _asideIconHide = document.querySelector(".aside-icon--hide");
  _stashLogoS = document.querySelector(".stash-logo-s");
  _stashLogoFull = document.querySelector(".stash-logo-full");
  _tooltip = document.querySelectorAll(".aside .tooltip");
  _asideText = document.querySelectorAll(".aside-text");
  _btnNavOpen = document.querySelector(".btn-nav--open");
  _btnNavClose = document.querySelector(".btn-nav--close");
  _overlay = document.querySelector(".overlay");
  _btnAsideToggle = document.querySelector(".btn-aside--toggle");

  _setMobileState(isOpen) {
    this._stashLogoS.classList.toggle("hidden", isOpen);
    this._stashLogoFull.classList.toggle("hidden", !isOpen);

    this._aside.classList.toggle("translate-x-0", isOpen);
    this._aside.classList.toggle("-translate-x-full", !isOpen);

    this._overlay.classList.toggle("hidden", !isOpen);

    this._asideText.forEach((text) => {
      text.classList.toggle("lg:hidden", !isOpen);
    });
  }

  asideOpenMobile() {
    this._setMobileState(true);
  }

  asideCloseMobile() {
    this._setMobileState(false);
  }

  asideToggle(isSidebarCollapsed) {
    if (isSidebarCollapsed) {
      this._asideIconHide.classList.add("hidden");
      this._asideIconShow.classList.remove("hidden");
      this._stashLogoS.classList.remove("hidden");
      this._stashLogoFull.classList.add("hidden");
      this._aside.classList.remove("lg:w-[clamp(10rem,15vw,15rem)]");
      this._aside.classList.add("lg:w-[clamp(3rem,5vw,4.5rem)]");
      this._tooltip.forEach((el) => el.classList.remove("hidden"));

      this._asideText.forEach((el) => {
        el.classList.add("opacity-0");

        setTimeout(() => {
          el.classList.add("lg:hidden");
        }, 300);
      });
    } else {
      this._asideIconHide.classList.remove("hidden");
      this._asideIconShow.classList.add("hidden");
      this._stashLogoS.classList.add("hidden");
      this._stashLogoFull.classList.remove("hidden");
      this._aside.classList.remove("lg:w-[clamp(3rem,5vw,4.5rem)]");
      this._aside.classList.add("lg:w-[clamp(10rem,15vw,15rem)]");
      this._tooltip.forEach((el) => el.classList.add("hidden"));
      setTimeout(() => {
        this._asideText.forEach((el) => {
          el.classList.remove("lg:hidden");

          requestAnimationFrame(() => {
            el.classList.remove("opacity-0");
          });
        });
      }, 300);
    }
  }
  addHandlerNavOpen(handler) {
    this._btnNavOpen.addEventListener("click", handler);
  }
  addHandlerNavClose(handler) {
    this._btnNavClose.addEventListener("click", handler);
  }
  addHandlerOverlay(handler) {
    this._overlay.addEventListener("click", handler);
  }
  addHandlerAsideToggle(handler) {
    this._btnAsideToggle.addEventListener("click", handler);
  }
}
export default new SidebarView();
