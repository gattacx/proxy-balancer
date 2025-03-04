import {
  EnrichedProxies,
  EnrichedProxy,
  Proxies,
  ProxyOptions
} from "../types";
import { getProxyState, getProxyURL, isValidProxyFormat } from "./proxy";

export async function enrichedProxies(
  proxies: Proxies,
  options?: ProxyOptions
): Promise<EnrichedProxies> {
  console.log("Start enriching proxies...");
  const timeout = options?.timeout ?? 3000;
  const enrichedProxiesList: EnrichedProxies = [];

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
      const responseTime = await getProxyState(proxy, timeout);
      if (responseTime) {
        return {
          ...proxy,
          count: Math.floor(Math.random() * 5),
          responseTime,
          rps: 6
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
      enrichedProxiesList.push(result);
    }
  });

  console.table(enrichedProxiesList);

  return enrichedProxiesList;
}

export async function getNextProxy(
  proxies: EnrichedProxies,
  maxRPS: number = 5
): Promise<EnrichedProxy> {
  const bestProxyByRPS = proxies.find((proxy) => proxy.rps < maxRPS);

  if (bestProxyByRPS) {
    const sortedProxies = proxies.sort((a, b) => a.count - b.count);
    return sortedProxies[0];
  } else {
    console.log("Not found proxies by max RPS, try find after 1000 ms");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return await getNextProxy(proxies, maxRPS);
  }
}
