import { ProxyBalancer } from "./proxyBalancer";
import proxies from "./proxies.json";

const proxyBalancer = new ProxyBalancer(proxies);

proxyBalancer.loadProxies().then((r) => console.log("finish load"));

// proxyBalancer.next()
