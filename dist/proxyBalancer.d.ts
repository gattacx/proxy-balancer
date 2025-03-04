import { EnrichedProxy, Proxies, ProxyOptions } from "./types";
export declare class ProxyBalancer {
    private readonly proxies;
    private readonly options?;
    private enrichedProxiesList;
    constructor(proxies: Proxies, options?: ProxyOptions);
    loadProxies(): Promise<void>;
    next(): Promise<EnrichedProxy | undefined>;
    getState(): void;
}
