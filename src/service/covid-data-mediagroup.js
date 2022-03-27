import _, { values } from "lodash";
import { alert } from "../main";

export default class CovidDataMediaGroup {
    #baseUrl
    #groupedContinentData
    #timestamp
    constructor (){
        this.#baseUrl = 'https://covid-api.mmediagroup.fr/v1/'
    }
    async getContinentCases() {
        const timeNow = new Date().getTime();
        if(!this.#groupedContinentData || timeNow > this.#timestamp + 3600000) {
            await this.fetchData();
            this.#timestamp = timeNow;
        }
        return this.#groupedContinentData
    }
    async getDataContinents(cases) {
        const continent = Object.keys(cases);
        const values = Object.values(cases);
        const populationContinent = values.map(v=>v.reduce((sum, element)=> sum + element.population, 0));
        const confirmedContinent = values.map(v=>v.reduce((sum, element)=> sum + element.confirmed, 0));
        const deathContinent = values.map(v=>v.reduce((sum, element)=> sum + element.deaths, 0));
        const date = values.map(v=>v[0].updated)[0];
        const res = continent.map((c, i) => {let obj = {
            continent: continent[i],
            percentConfirmed: (confirmedContinent[i]/populationContinent[i]*100).toFixed(2),
            percentDeath: (deathContinent[i]/populationContinent[i]*100).toFixed(2),
            dateUpdate: date
        };
    return obj});
        return res;
    }
    async fetchData() {
        try{
        const dataResponse = await fetch(this.#baseUrl + 'cases');
        const data = await dataResponse.json();
        const continentData = Object.values(data).map(o => o.All).filter(c=>c.continent);
        this.#groupedContinentData = _.groupBy(continentData, 'continent');
        }catch(err) {
            alert.showAlert(this.#baseUrl)}
    }
    async getConfirmedCountryHistoryData (dataHistory, kindData) {
        try{
        const dataResponse = await fetch(this.#baseUrl + `history?country=${dataHistory.country}&status=${kindData}`);
        const data = await dataResponse.json();
        const countryHistoryData = data.All.dates;
        return countryHistoryData;
        }catch(err) {
            alert.showAlert(this.#baseUrl)}
    }
    async historyData(data, kindData) {
        const historyArr = [];
        let from = new Date(2020, 0, 23);
        let to = new Date(2020, 0, 23);
        to.setMonth(+data.months + to.getMonth());
        let confirmed;
        let now = new Date();
        const entries = Object.entries(await this.getConfirmedCountryHistoryData(data, kindData));
        do {
            confirmed = entries.filter(e=> e[0] == JSON.stringify(to).substring(1,11))[0][1] - entries.filter(e=> e[0] == JSON.stringify(from).substring(1,11))[0][1];
        historyArr.push({
            country: data.country,
            from: JSON.stringify(from).substring(1,11),
            to: JSON.stringify(to).substring(1,11),
            data: confirmed
        })
        from.setMonth(+data.months + from.getMonth());
        to.setMonth(+data.months + to.getMonth());
        }while(to.getTime()<now.getTime());
        return historyArr;
    }
    async options () {
        const countries = [];
        Object.values(await this.#groupedContinentData).forEach((v, i)=> v.forEach(c=> countries.push(c.country)));
        return countries;
    }
    async getVaccineArr (countries) {
        const dataResponse = new Array(12);
        dataResponse.fill(1);
        let data;
        try{
        data = dataResponse.map(async (c,i) => {c = (await fetch(this.#baseUrl + `/vaccines?country=${countries.country[i]}`));
        return await c.json()});
        }catch(err) {
            alert.showAlert(this.#baseUrl)}
        const vaccineData = data.map(async (c,i) => c = ((await c[i]).All.people_vaccinated)/((await c[i]).All.population)*100);
        const update = data.map(async (c,i) => (await c[i]).All.updated);
        const vaccineArr = data.map(async (o,i) => o = {
            country: countries[i],
            percentVaccinated: await vaccineData[i],
            updated: await update[i]
        });
        return vaccineArr;
    } 
}