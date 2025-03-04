import { enrichedProxies, getNextProxy } from "./utils/enrichedProxy";
export class ProxyBalancer {
    proxies;
    options;
    enrichedProxiesList;
    constructor(proxies, options) {
        this.proxies = proxies;
        this.options = options;
        this.enrichedProxiesList = [];
    }
    async loadProxies() {
        if (this.proxies?.length < 1) {
            throw new Error("There are no proxies for work");
        }
        this.enrichedProxiesList = await enrichedProxies(this.proxies, this.options);
    }
    async next() {
        if (this.enrichedProxiesList.length === 0) {
            console.log("no enriched", this.enrichedProxiesList.length);
        }
        else {
            return await getNextProxy(this.enrichedProxiesList, this.options?.maxRPS);
        }
    }
    getState() {
        console.table(this.enrichedProxiesList);
    }
}
