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
export async function getProxyState(proxy, timeout) {
    try {
        const startTime = Date.now();
        const { host, port, username, password } = proxy;
        const response = await axios.get("http://httpbin.org/ip", {
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
}
