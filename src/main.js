import _ from 'lodash'
import countries from './config/countries.json'
import TableHandler from './ui/table_handler';
import CovidDataMediaGroup from './service/covid-data-mediagroup'
import FormHandler from './ui/form_handler';
import Alert from './ui/alert';
import NavigatorButtons from './ui/navigator_buttons';
import Spinner from './ui/spinner';
export const dataProvider = new CovidDataMediaGroup();
const spinner = new Spinner("spinner");
export const alert = new Alert ("alert");
dataProvider.getContinentCases().then(data=>console.log(data));
dataProvider.getContinentCases().then(data=> dataProvider.getDataContinents(data).then(cov=>console.log(cov)));
const tableHandler = new TableHandler([
    { key: 'continent', displayName: 'Continent Name' },
    { key: 'percentConfirmed', displayName: '% confirmed cases/population' },
    { key: 'percentDeath', displayName: '% death cases/population' },
    { key: 'dateUpdate', displayName: "date and time of the update" }
], "continents-data-table", "sortCourses");
export const historyTable = new TableHandler([
    { key: 'from', displayName: 'From' },
    { key: 'to', displayName: 'To' },
    { key: 'data', displayName: 'Confirmed Cases' }
], "continents-data-table", 'sortCountries');
export const deathHistoryTable = new TableHandler([
    { key: 'from', displayName: 'From' },
    { key: 'to', displayName: 'To' },
    { key: 'data', displayName: 'Deaths Cases' }
], "continents-data-table", 'sortCountries');
export const vaccineTable = new TableHandler([
    { key: 'country', displayName: 'Country'},
    { key: 'percentVaccinated', displayName: '% of the vaccinated population'},
    { key: 'updated', displayName: 'Updated'}
], "continents-data-table", 'sortCountries');
const formHandler = new FormHandler("confirmed-form");
const navigator = new NavigatorButtons(["0","1","2", "3"]);
export async function asyncRequestWithSpinner(asyncFn) {
    spinner.start();
    const res = await asyncFn();
    spinner.stop();
    return res;
}
export function hide() {
    formHandler.hide();
}

window.showCovidContinent = async () => {
    navigator.setActive(0);
    tableHandler.showTable(await asyncRequestWithSpinner
    (await dataProvider.getDataContinents.bind(dataProvider, await dataProvider.getContinentCases())));
}
window.showHistoryData = async (kindData) => {
    hide();
    navigator.setActive(1);
    formHandler.addHandler(kindData, historyTable);
    await formHandler.fillOptions("country-name-options", await dataProvider.options());
    formHandler.show();
}
window.showDeathHistoryData = async (kindData) => {
    hide();
    navigator.setActive(2);
    formHandler.addHandler(kindData, deathHistoryTable);
    await formHandler.fillOptions("country-name-options", await dataProvider.options());
    formHandler.show();
}
window.showVaccineTable = async () => {
    hide();
    navigator.setActive(3);
    vaccineTable.showTable(await asyncRequestWithSpinner(await dataProvider.getVaccineArr.bind(dataProvider, countries)));
}

