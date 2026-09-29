class ThemeView {
  _html = document.querySelector("html");
  _lightTheme = document.querySelector(".light-theme");
  _darkTheme = document.querySelector(".dark-theme");

  toggleTheme() {
    this._html.classList.toggle("dark");

    this._lightTheme.classList.toggle("scale-0");
    this._lightTheme.classList.toggle("rotate-90");
    this._lightTheme.classList.toggle("opacity-0");

    this._darkTheme.classList.toggle("scale-0");
    this._darkTheme.classList.toggle("rotate-90");
    this._darkTheme.classList.toggle("opacity-0");
  }
}
export default new ThemeView();
