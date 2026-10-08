class ThemeView {
  _html = document.querySelector("html");
  _lightTheme = document.querySelector(".light-theme");
  _darkTheme = document.querySelector(".dark-theme");
  _btnTheme = document.querySelector(".btn-theme");

  toggleTheme() {
    this._html.classList.toggle("dark");
    this.saveTheme();
    this._lightTheme.classList.toggle("scale-0");
    this._lightTheme.classList.toggle("rotate-90");
    this._lightTheme.classList.toggle("opacity-0");

    this._darkTheme.classList.toggle("scale-0");
    this._darkTheme.classList.toggle("rotate-90");
    this._darkTheme.classList.toggle("opacity-0");
  }

  addHandlerToggleTheme(handler) {
    this._btnTheme.addEventListener("click", handler);
  }
  saveTheme() {
    if (this._html.classList.contains("dark")) {
      localStorage.setItem("theme", "dark");
    } else {
      localStorage.setItem("theme", "light");
    }
  }
  loadTheme() {
    const theme = localStorage.getItem("theme");
    if (theme === "dark" || theme === null) {
      this._html.classList.add("dark");
      this._lightTheme.classList.remove("scale-0", "rotate-90", "opacity-0");
      this._darkTheme.classList.add("scale-0", "rotate-90", "opacity-0");
    }
    if (theme === "light") {
      this._html.classList.remove("dark");
      this._lightTheme.classList.add("scale-0", "rotate-90", "opacity-0");
      this._darkTheme.classList.remove("scale-0", "rotate-90", "opacity-0");
    }
  }
}
export default new ThemeView();
