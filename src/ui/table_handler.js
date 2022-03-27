export default class TableHandler {
    #tableElem
    #columnsDefinition
    #sortFnName
    constructor(columnsDefinition, idTable, sortFnName) {
        this.#sortFnName = sortFnName ?? '';
        this.#columnsDefinition = columnsDefinition;
        this.#tableElem = document.getElementById(idTable);
        if (!this.#tableElem) {
            throw "Table element is not defined"
        }
    }
    async showTable(objects) {
        this.#tableElem.innerHTML = `${this.#getHeader()}${this.#getBody(objects)}`;
    }
    hideTable() {
        this.#tableElem.innerHTML = ''
    }
    #getHeader() {
        return `<thead><tr>${this.#getColumns()}</tr></thead>`
    }
    #getColumns() {
        const columns = this.#columnsDefinition
        .map(c => `<th onclick="${this.#getSortFn(c)}">${c.displayName}</th>`);
        return columns.join('');
    }
    #getSortFn(columnDefinition) {
        return this.#sortFnName ? `${this.#sortFnName}('${columnDefinition.key}')` : ''
    }
    #getBody(objects) {
        return objects.map(o => `<tr>${this.#getRecord(o)}</tr>`).join('');
    }
    #getRecord(object) {
        const record =  this.#columnsDefinition.map(c => `<td>${object[c.key]}</td>`);
        return record.join('');
    }
}