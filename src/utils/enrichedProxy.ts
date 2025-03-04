import { EnrichedProxy, Proxies } from "../types";
import { getProxyState, getProxyURL, isValidProxyFormat } from "./proxy";

export async function enrichedProxies(
  proxies: Proxies
): Promise<Map<string, EnrichedProxy>> {
  console.log("Start enriching proxies...");
  const enrichedProxiesList = new Map<string, EnrichedProxy>();

  const proxyCheckPromises = proxies.map(async (proxy, index) => {
    const checkValidURI = isValidProxyFormat(proxy);
    if (!checkValidURI) {
      console.log(
        `${index}. Proxy host: ${proxy.host}, port: ${proxy.port} is not valid ❌`
      );
      return null;
    }

    const proxyURL = getProxyURL(proxy);
    try {
      const responseTime = await getProxyState(proxy);
      if (responseTime) {
        return {
          proxyURL,
          enrichedProxy: { proxy, count: 0, responseTime, rps: 0 }
        };
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

  tableEnrichedProxies(enrichedProxiesList);

  return enrichedProxiesList;
}

export function tableEnrichedProxies(list: Map<string, EnrichedProxy>): void {
  const enrichedProxiesArray = [...list.entries()].map(([_, value]) => ({
    proxy: `${value.proxy.host}:${value.proxy.port}`,
    count: value.count,
    responseTime: `${value.responseTime}ms`
  }));

  console.table(enrichedProxiesArray);
}
