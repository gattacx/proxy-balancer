import { Proxy } from "../types";
export declare function getProxyURL(proxy: Proxy): string;
export declare function isValidProxyFormat(proxy: Proxy): boolean;
export declare function getProxyState(proxy: Proxy, timeout: number): Promise<number | false>;
