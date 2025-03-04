import { EnrichedProxies, Proxies, ProxyOptions } from "./types";
import { enrichedProxies, getNextProxy } from "./utils/enrichedProxy";

export class ProxyBalancer {
  private readonly proxies: Proxies;
  private readonly options?: ProxyOptions;
  private enrichedProxiesList: EnrichedProxies;
  constructor(proxies: Proxies, options?: ProxyOptions) {
    this.proxies = proxies;
    this.options = options;
    this.enrichedProxiesList = [];
  }

  public async loadProxies(): Promise<void> {
    if (this.proxies?.length < 1) {
      throw new Error("There are no proxies for work");
    }
    this.enrichedProxiesList = await enrichedProxies(
      this.proxies,
      this.options
    );
  }

  public async next() {
    if (this.enrichedProxiesList.length === 0) {
      console.log("no enriched", this.enrichedProxiesList.length);
    } else {
      return await getNextProxy(this.enrichedProxiesList, this.options?.maxRPS);
    }
  }

  public getState() {
    return this.enrichedProxiesList;
  }
}
