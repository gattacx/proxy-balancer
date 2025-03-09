export type Proxy = {
  readonly host: string;
  readonly port: number;
  readonly username?: string;
  readonly password?: string;
};
export type Proxies = Array<Proxy>;
export type EnrichedProxies<T> = Array<EnrichedProxy<T>>;
export type CustomValue<T> = (proxy: Proxy) => T;
export interface ProxyOptions {
  timeout?: number;
  maxRPS?: number;
}

export interface EnrichedProxy<T> extends Proxy {
  count: number;
  rps: number;
  readonly responseTime: number;
  customValue?: CustomValue<T>;
}
