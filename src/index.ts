import { ProxyBalancer } from "./proxyBalancer";
import proxies from "./proxies.json";

const proxyBalancer = new ProxyBalancer(proxies);

proxyBalancer.loadProxies().then((r) => console.log("finish load"));

setTimeout(() => {
  setInterval(async () => {
    await proxyBalancer.next();
  }, 50);
}, 5000);

setInterval(() => {
  console.table(proxyBalancer.getState());
}, 10000);
