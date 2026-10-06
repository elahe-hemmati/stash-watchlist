export default class View {
  _data;

  render(data) {
    this._data = data;
    const markup = this._generateMarkup();
    this.clear();
    this._parentElement.insertAdjacentHTML("beforeend", markup);
  }
  update() {}
  clear() {
    this._parentElement.innerHTML = "";
  }
  renderSpinner() {}
  renderError() {}
  renderMessage() {}
}
