import type { EnrichedProxies, EnrichedProxy, Proxies, ProxyOptions } from "../types";
export declare function enrichedProxies(proxies: Proxies, options?: ProxyOptions): Promise<EnrichedProxies>;
export declare function getNextProxy(proxies: EnrichedProxies, maxRPS?: number): Promise<EnrichedProxy>;
