import { hide } from "../main";
export default class Alert {
    #alertEl
    constructor (id) {
        this.#alertEl = document.getElementById(id);
    }
    showAlert(url) {
        this.#alertEl.innerHTML = `<div class="alert alert-danger alert-dismissible fade show" role="alert">
        <strong>Error!</strong> The server ${url} is unavailable, repeat request later on<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>`;
        hide();
    }
    hideAlert() {
        this.#alertEl.innerHTML = ``;
    }
}