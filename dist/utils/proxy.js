var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import axios from "axios";
export function getProxyURL(proxy) {
    const { host, port } = proxy;
    return `${host}:${port}`;
}
export function isValidProxyFormat(proxy) {
    const { host, port } = proxy;
    if (!host || !port) {
        return false;
    }
    const proxyURL = getProxyURL(proxy);
    // Регулярное выражение для проверки формата ip:port
    const proxyPattern = /^(\d{1,3}\.){3}\d{1,3}:\d{1,5}$/;
    return proxyPattern.test(proxyURL);
}
export function getProxyState(proxy, timeout) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const startTime = Date.now();
            const { host, port, username, password } = proxy;
            const response = yield axios.get("http://httpbin.org/ip", {
                proxy: {
                    host: host,
                    port: port,
                    auth: username && password
                        ? {
                            username,
                            password
                        }
                        : undefined
                },
                timeout: timeout
            });
            const responseTime = Date.now() - startTime;
            if (response.status === 200) {
                return responseTime;
            }
        }
        catch (error) {
            console.log(`Proxy ${proxy.host}:${proxy.port} is not working: ${error.message}`);
        }
        return false;
    });
}
