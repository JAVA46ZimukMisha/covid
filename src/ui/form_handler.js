import { historyTable } from "../main";
import { dataProvider } from "../main";
import { asyncRequestWithSpinner } from "../main";
export default class FormHandler {
    #formElement
    #inputElements
    constructor(idForm) {
        this.#formElement = document.getElementById(idForm);
        this.#inputElements = document.querySelectorAll(`#${idForm} [name]`);
    }
    addHandler(kindData, obj) {
        this.#formElement.addEventListener('submit', async event => {
            event.preventDefault();
            const data = Array.from(this.#inputElements)
            .reduce((obj, element) => {
                obj[element.name] = element.value;
                return obj;
            }, {})
                obj.showTable(await asyncRequestWithSpinner(await dataProvider.historyData.bind(dataProvider, data, kindData)))
        })
    }
    async fillOptions(idOptions, options ) {
        document.getElementById(idOptions).innerHTML += 
        `${await getOptions(options)}`
    }
    show() {
        this.#formElement.hidden = false;
    }
    hide() {
        this.#formElement.hidden = true;
    }
}
async function getOptions(options) {
    return await options.map(o => `<option value="${o}">${o}</option>`).join('');
}