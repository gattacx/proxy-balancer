export type Proxy = {
  readonly host: string;
  readonly port: number;
  readonly username?: string;
  readonly password?: string;
};
export type Proxies = Array<Proxy>;
export type EnrichedProxies = Array<EnrichedProxy>;
export interface ProxyOptions {
  timeout?: number;
  maxRPS?: number;
}

export interface EnrichedProxy extends Proxy {
  count: number;
  rps: number;
  readonly responseTime: number;
}
