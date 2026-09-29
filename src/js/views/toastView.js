class ToastView {
  _toast = document.querySelector(".toast");
  _toastMessage = document.querySelector(".toast-message");

  showToast(message, type = "error") {
    this._toastMessage.textContent = message;
    this._toast.classList.remove("hidden");
    const toastColors = {
      error: "#ef4444",
      warning: "#f59e0b",
      success: "#22c55e",
    };
    const color = toastColors[type] ?? toastColors.error;
    this._toast.style.setProperty("--toast-color", color);
    setTimeout(() => {
      this._toast.classList.add("hidden");
    }, 4000);
  }
}
export default new ToastView();
