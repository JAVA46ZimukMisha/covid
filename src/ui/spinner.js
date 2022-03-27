export default class Spinner {
    #spinnerParentElem
    constructor(parentId) {
        this.#spinnerParentElem = document.getElementById(parentId);

    }
    start() {
        this.#spinnerParentElem.innerHTML = `<div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>`
    }
    stop() {
        this.#spinnerParentElem.innerHTML=''
    }
}