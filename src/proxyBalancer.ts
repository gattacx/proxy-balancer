import { EnrichedProxy, Proxies, ProxyOptions } from "./types";
import { enrichedProxies } from "./utils/enrichedProxy";

export class ProxyBalancer {
  private readonly proxies: Proxies;
  private readonly options?: ProxyOptions;
  private enrichedProxiesList: Map<string, EnrichedProxy>;
  constructor(proxies: Proxies, options?: ProxyOptions) {
    this.proxies = proxies;
    this.options = options;
    this.enrichedProxiesList = new Map();
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

  public next() {
    if (this.enrichedProxiesList.size > 0) {
      console.log("try next");
    }
  }

  // updateProxy() {
  //
  // }
}
