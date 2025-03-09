import { enrichedProxies, getNextProxy } from "./enrichedProxy";
import { getProxyState, isValidProxyFormat } from "./proxy";
import { EnrichedProxies, Proxies } from "../types";

jest.mock("../utils/proxy", () => ({
  isValidProxyFormat: jest.fn(),
  getProxyURL: jest.fn(),
  getProxyState: jest.fn()
}));

describe("enrichedProxies", () => {
  it("filters out invalid proxies", async () => {
    (isValidProxyFormat as jest.Mock).mockReturnValue(false);
    const proxies: Proxies = [{ host: "invalid", port: 8080 }];
    const result = await enrichedProxies(proxies);
    expect(result).toEqual([]);
  });

  it("enriches valid proxies", async () => {
    (isValidProxyFormat as jest.Mock).mockReturnValue(true);
    (getProxyState as jest.Mock).mockResolvedValue(100);
    const proxies: Proxies = [{ host: "valid", port: 8080 }];
    const result = await enrichedProxies(proxies);
    expect(result).toEqual([
      { host: "valid", port: 8080, count: 0, responseTime: 100, rps: 0 }
    ]);
  });
});

describe("getNextProxy", <T>() => {
  it("selects proxy with lowest count and rps", async () => {
    const proxies: EnrichedProxies<T> = [
      { host: "proxy1", port: 8080, count: 2, responseTime: 100, rps: 1 },
      { host: "proxy2", port: 8081, count: 1, responseTime: 200, rps: 0 }
    ];
    const result = await getNextProxy(proxies);
    expect(result).toEqual(proxies[1]);
  });

  it("retries when no valid proxy is found", async <T>() => {
    jest.useFakeTimers();

    const setTimeoutSpy = jest.spyOn(global, "setTimeout");
    const proxies: EnrichedProxies<T> = [
      { host: "proxy1", port: 8080, count: 2, responseTime: 100, rps: 4 }
    ];
    const getNextProxyPromise = getNextProxy(proxies, 5);
    jest.advanceTimersByTime(1000);
    await getNextProxyPromise;

    expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 1000);
    setTimeoutSpy.mockRestore();
    jest.useRealTimers();
  }, 5000);
});
