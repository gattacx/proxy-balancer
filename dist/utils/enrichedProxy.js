"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNextProxy = exports.enrichedProxies = void 0;
const proxy_1 = require("./proxy");
function enrichedProxies(proxies, options) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        console.log("Start enriching proxies...");
        const timeout = (_a = options === null || options === void 0 ? void 0 : options.timeout) !== null && _a !== void 0 ? _a : 3000;
        const enrichedProxiesList = [];
        const proxyCheckPromises = proxies.map((proxy, index) => __awaiter(this, void 0, void 0, function* () {
            const checkValidURI = (0, proxy_1.isValidProxyFormat)(proxy);
            if (!checkValidURI) {
                console.log(`${index}. Proxy host: ${proxy.host}, port: ${proxy.port} is not valid ❌`);
                return null;
            }
            const proxyURL = (0, proxy_1.getProxyURL)(proxy);
            try {
                const responseTime = yield (0, proxy_1.getProxyState)(proxy, timeout);
                if (responseTime) {
                    return Object.assign(Object.assign({}, proxy), { count: 0, responseTime, rps: 0 });
                }
            }
            catch (error) {
                console.error(`Ошибка проверки прокси ${proxyURL}:`, error);
            }
            return null;
        }));
        const results = yield Promise.all(proxyCheckPromises);
        results.forEach((result) => {
            if (result) {
                enrichedProxiesList.push(result);
            }
        });
        console.table(enrichedProxiesList);
        return enrichedProxiesList;
    });
}
exports.enrichedProxies = enrichedProxies;
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
function getNextProxy(proxies_1) {
    return __awaiter(this, arguments, void 0, function* (proxies, maxRPS = 5) {
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
            yield new Promise((resolve) => setTimeout(resolve, 1000));
            return yield getNextProxy(proxies, maxRPS);
        }
    });
}
exports.getNextProxy = getNextProxy;
