
export type Proxy = {
    host: string
    port: number
    username?: string
    password?: string
}
export type Proxies = Array<Proxy>
export interface ProxyOptions {
    timeout?: number
}

export interface EnrichedProxy {
    readonly proxy: Proxy
    count: number
    responseTime: number
}