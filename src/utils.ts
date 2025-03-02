import {EnrichedProxy, Proxies, Proxy} from "./types";
import axios from "axios";


//  { "host": "109.248.143.163", "port": 1050,
//    "username": "Z4is1W",
//    "password": "2ERsTCNa9D"
//  }

export function getProxyURL(proxy: Proxy) {
    const { host, port } = proxy
    return `${host}:${port}`
}
export function isValidProxyFormat(proxy: Proxy): boolean {
    const { host, port } = proxy
    if (!host || !port) {
        return false
    }
    const proxyURL = getProxyURL(proxy)
    // Регулярное выражение для проверки формата ip:port
    const proxyPattern = /^(\d{1,3}\.){3}\d{1,3}:\d{1,5}$/;
    return proxyPattern.test(proxyURL);
}

export async function getProxyState(proxy: Proxy): Promise<number | false> {
    try {
        const startTime = Date.now();
        const { host, port, username, password } = proxy
        const response = await axios.get('http://www.google.com/', {
            proxy: {
                host: host,
                port: port,
                protocol: 'http:',
                auth: username && password ? {
                    username, password
                } : undefined
            },
            timeout: 3000
        });

        const responseTime: number = Date.now() - startTime;
        if (response.status === 200) {
            return responseTime
        }
    } catch (error) {
        console.log(`Proxy ${proxy.host}:${proxy.port} is not working: ${(error as Error).message}`);
    }
    return false
}
export async function enrichedProxies(proxies: Proxies): Promise<Map<string, EnrichedProxy>> {
    console.log('Start enriching proxies...');
    const enrichedProxiesList = new Map<string, EnrichedProxy>();

    const proxyCheckPromises = proxies.map(async (proxy, index) => {
        const checkValidURI = isValidProxyFormat(proxy);
        if (!checkValidURI) {
            console.log(`${index}. Proxy host: ${proxy.host}, port: ${proxy.port} is not valid ❌`);
            return null;
        }

        const proxyURL = getProxyURL(proxy);
        try {
            const responseTime = await getProxyState(proxy);
            if (responseTime) {
                return { proxyURL, enrichedProxy: { proxy, count: 0, responseTime } };
            }
        } catch (error) {
            console.error(`Ошибка проверки прокси ${proxyURL}:`, error);
        }
        return null;
    });

    const results = await Promise.all(proxyCheckPromises);
    results.forEach((result) => {
        if (result) {
            enrichedProxiesList.set(result.proxyURL, result.enrichedProxy);
        }
    });

    tableEnrichedProxies(enrichedProxiesList)

    return enrichedProxiesList;
}


export function tableEnrichedProxies(list: Map<string, EnrichedProxy>): void{
    const enrichedProxiesArray = [...list.entries()].map(([_, value]) => ({
        proxy: `${value.proxy.host}:${value.proxy.port}`,
        count: value.count,
        responseTime: `${value.responseTime}ms`,
    }));

    console.table(enrichedProxiesArray);
}