class ConfirmView {
  _modal = document.querySelector("#confirm-modal");
  _cancelButton = document.querySelector("#confirm-cancel");
  _confirmButton = document.querySelector("#confirm-remove");
  _resolve;

  _close() {
    this._modal.classList.add("hidden");
    this._modal.classList.remove("flex");
  }

  confirm() {
    return new Promise((resolve) => {
      this._modal.classList.remove("hidden");
      this._modal.classList.add("flex");
      this._resolve = resolve;
    });
  }

  addHandlerCancel() {
    this._cancelButton.addEventListener("click", () => {
      this._close();
      this._resolve(false);
    });
  }

  addHandlerConfirm() {
    this._confirmButton.addEventListener("click", () => {
      this._close();
      this._resolve(true);
    });
  }
}

export default new ConfirmView();
