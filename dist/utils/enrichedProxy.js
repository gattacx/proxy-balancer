import { getProxyState, getProxyURL, isValidProxyFormat } from "./proxy";
export async function enrichedProxies(proxies, options) {
    console.log("Start enriching proxies...");
    const timeout = options?.timeout ?? 3000;
    const enrichedProxiesList = [];
    const proxyCheckPromises = proxies.map(async (proxy, index) => {
        const checkValidURI = isValidProxyFormat(proxy);
        if (!checkValidURI) {
            console.log(`${index}. Proxy host: ${proxy.host}, port: ${proxy.port} is not valid ❌`);
            return null;
        }
        const proxyURL = getProxyURL(proxy);
        try {
            const responseTime = await getProxyState(proxy, timeout);
            if (responseTime) {
                return {
                    ...proxy,
                    count: 0,
                    responseTime,
                    rps: 0
                };
            }
        }
        catch (error) {
            console.error(`Ошибка проверки прокси ${proxyURL}:`, error);
        }
        return null;
    });
    const results = await Promise.all(proxyCheckPromises);
    results.forEach((result) => {
        if (result) {
            enrichedProxiesList.push(result);
        }
    });
    console.table(enrichedProxiesList);
    return enrichedProxiesList;
}
// update selected proxy rps and count for calculated next proxy later
function modifyProxyState(proxies, proxy) {
    const proxyIdx = proxies.findIndex((x) => `${x.host}:${x.port}` === `${proxy.host}:${proxy.port}`);
    if (proxyIdx >= 0) {
        proxies[proxyIdx].count++;
        proxies[proxyIdx].rps++;
        setTimeout(() => {
            proxies[proxyIdx].rps--;
        }, 1000);
    }
}
// find next proxy, if not found by rps, try after 1000 ms
export async function getNextProxy(proxies, maxRPS = 5) {
    const validProxiesByRPS = proxies.filter((proxy) => proxy.rps < maxRPS);
    if (validProxiesByRPS.length > 0) {
        const bestProxy = validProxiesByRPS.sort((a, b) => {
            if (a.count < b.count)
                return -1;
            if (a.count > b.count)
                return 1;
            if (a.rps < b.rps)
                return -1;
            if (a.rps > b.rps)
                return 1;
            return 0;
        });
        modifyProxyState(proxies, bestProxy[0]);
        return bestProxy[0];
    }
    else {
        console.log("Not found proxies by max RPS, try find after 1000 ms");
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return await getNextProxy(proxies, maxRPS);
    }
}
