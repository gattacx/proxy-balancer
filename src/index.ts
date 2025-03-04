import { ProxyBalancer } from "./proxyBalancer";
import proxies from "./proxies.json";

const proxyBalancer = new ProxyBalancer(proxies);

proxyBalancer.loadProxies().then((r) => console.log("finish load"));

setTimeout(async () => {
  await proxyBalancer.next().then((res) => console.log("new proxy", res));
}, 5000);
