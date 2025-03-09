import { getProxyURL, isValidProxyFormat, getProxyState } from "./proxy";
import { Proxy } from "../types";
import axios from "axios";
describe("getProxyURL", () => {
  it("should return correct proxy URL without credentials", () => {
    const proxy: Proxy = { host: "192.168.1.1", port: 8080 };
    const result = getProxyURL(proxy);
    expect(result).toBe("192.168.1.1:8080");
  });

  it("should return correct proxy URL with credentials", () => {
    const proxy: Proxy = {
      host: "192.168.1.1",
      port: 8080,
      username: "user",
      password: "pass"
    };
    const result = getProxyURL(proxy);
    expect(result).toBe("user:pass@192.168.1.1:8080");
  });

  it("should return correct proxy URL with only username", () => {
    const proxy: Proxy = {
      host: "192.168.1.1",
      port: 8080,
      username: "user"
    };
    const result = getProxyURL(proxy);
    expect(result).toBe("192.168.1.1:8080"); // или ожидаемое поведение, если username без password недопустимо
  });

  it("should return correct proxy URL with only password", () => {
    const proxy: Proxy = {
      host: "192.168.1.1",
      port: 8080,
      password: "pass"
    };
    const result = getProxyURL(proxy);
    expect(result).toBe("192.168.1.1:8080"); // или ожидаемое поведение, если password без username недопустимо
  });
});

describe("isValidProxyFormat", () => {
  it("should return true for valid proxy format", () => {
    const validProxy: Proxy = { host: "192.168.1.1", port: 8080 };
    const result = isValidProxyFormat(validProxy);
    expect(result).toBe(true);
  });

  it("should return false for invalid host", () => {
    const invalidProxy: Proxy = { host: "invalid.host", port: 8080 };
    const result = isValidProxyFormat(invalidProxy);
    expect(result).toBe(false);
  });

  it("should return false for missing port", () => {
    const invalidProxy: Proxy = { host: "192.168.1.1", port: undefined as any };
    const result = isValidProxyFormat(invalidProxy);
    expect(result).toBe(false);
  });

  it("should return false for invalid port", () => {
    const invalidProxy: Proxy = { host: "192.168.1.1", port: 999999 };
    const result = isValidProxyFormat(invalidProxy);
    expect(result).toBe(false);
  });
});

jest.mock("axios");

describe("getProxyState", () => {
  it("should return response time for working proxy", async () => {
    const proxy: Proxy = { host: "192.168.1.1", port: 8080 };
    const mockResponseTime = 100;

    (axios.get as jest.Mock).mockResolvedValue({
      status: 200
    });

    const result = await getProxyState(proxy, 5000);
    expect(result).toBeGreaterThanOrEqual(0);
    expect(axios.get).toHaveBeenCalledWith("http://httpbin.org/ip", {
      proxy: {
        host: proxy.host,
        port: proxy.port,
        auth: undefined
      },
      timeout: 5000
    });
  });

  it("should return false for non-working proxy", async () => {
    const proxy: Proxy = { host: "192.168.1.1", port: 8080 };

    (axios.get as jest.Mock).mockRejectedValue(new Error("Network Error"));

    const result = await getProxyState(proxy, 5000);
    expect(result).toBe(false);
    expect(axios.get).toHaveBeenCalledWith("http://httpbin.org/ip", {
      proxy: {
        host: proxy.host,
        port: proxy.port,
        auth: undefined
      },
      timeout: 5000
    });
  });

  it("should handle proxy with auth", async () => {
    const proxy: Proxy = {
      host: "192.168.1.1",
      port: 8080,
      username: "user",
      password: "pass"
    };

    (axios.get as jest.Mock).mockResolvedValue({
      status: 200
    });

    const result = await getProxyState(proxy, 5000);
    expect(result).toBeGreaterThanOrEqual(0);
    expect(axios.get).toHaveBeenCalledWith("http://httpbin.org/ip", {
      proxy: {
        host: proxy.host,
        port: proxy.port,
        auth: {
          username: proxy.username,
          password: proxy.password
        }
      },
      timeout: 5000
    });
  });
});
