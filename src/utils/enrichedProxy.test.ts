import { enrichedProxies, getNextProxy } from "./enrichedProxy";
import { getProxyState, getProxyURL, isValidProxyFormat } from "./proxy";
import { CustomValue, EnrichedProxies, Proxies } from "../types";

jest.mock("../utils/proxy", () => ({
  ...jest.requireActual("../utils/proxy"),
  isValidProxyFormat: jest.fn(),
  getProxyURL: jest.fn(),
  getProxyState: jest.fn()
}));

describe("enrichedProxies", () => {
  beforeEach(() => {
    // Сбрасываем моки перед каждым тестом
    jest.clearAllMocks();
  });

  it("should enrich valid proxies and skip invalid ones", async () => {
    // Мокаем вспомогательные функции
    (isValidProxyFormat as jest.Mock).mockImplementation(
      (proxy) => proxy.host === "192.168.1.1"
    );
    (getProxyURL as jest.Mock).mockImplementation((proxy) => {
      if (proxy.username && proxy.password) {
        return `${proxy.username}:${proxy.password}@${proxy.host}:${proxy.port}`;
      }
      return `${proxy.host}:${proxy.port}`;
    });
    (getProxyState as jest.Mock).mockResolvedValue(100); // Успешный ответ

    const proxies: Proxies = [
      { host: "192.168.1.1", port: 8080, username: "user1", password: "pass1" }, // Валидный прокси
      { host: "invalid-host", port: 8081 } // Невалидный прокси
    ];

    const customValue: CustomValue<string> = (proxy) =>
      `Custom: ${proxy.host}:${proxy.port}`;

    const result = await enrichedProxies(
      proxies,
      { timeout: 1000 },
      customValue
    );

    // Проверяем, что только валидный прокси был обогащен
    expect(result.length).toBe(1);

    // Проверяем структуру обогащенного прокси
    expect(result[0]).toEqual({
      host: "192.168.1.1",
      port: 8080,
      username: "user1",
      password: "pass1",
      count: 0,
      responseTime: 100,
      rps: 0,
      url: "user1:pass1@192.168.1.1:8080", // URL с учетными данными
      customValue: "Custom: 192.168.1.1:8080" // Примененное customValue
    });

    // Проверяем, что невалидный прокси был пропущен
    expect(isValidProxyFormat).toHaveBeenCalledTimes(2);
    expect(isValidProxyFormat).toHaveBeenCalledWith(proxies[0]);
    expect(isValidProxyFormat).toHaveBeenCalledWith(proxies[1]);
  });

  it("should handle errors during proxy checking", async () => {
    // Мокаем вспомогательные функции
    (isValidProxyFormat as jest.Mock).mockReturnValue(true);
    (getProxyURL as jest.Mock).mockImplementation(
      (proxy) => `${proxy.host}:${proxy.port}`
    );
    (getProxyState as jest.Mock).mockRejectedValue(
      new Error("Proxy check failed")
    ); // Ошибка при проверке

    const proxies: Proxies = [
      { host: "192.168.1.1", port: 8080, username: "user1", password: "pass1" }
    ];

    const result = await enrichedProxies(proxies, { timeout: 1000 });

    // Проверяем, что прокси не был добавлен в результат из-за ошибки
    expect(result.length).toBe(0);

    // Проверяем, что ошибка была обработана
    expect(getProxyState).toHaveBeenCalledTimes(1);
    expect(getProxyState).toHaveBeenCalledWith(proxies[0], 1000);
  });

  it("should apply customValue to enriched proxies", async () => {
    // Мокаем вспомогательные функции
    (isValidProxyFormat as jest.Mock).mockReturnValue(true);
    (getProxyURL as jest.Mock).mockImplementation(
      (proxy) => `${proxy.host}:${proxy.port}`
    );
    (getProxyState as jest.Mock).mockResolvedValue(100); // Успешный ответ

    const proxies: Proxies = [
      { host: "192.168.1.1", port: 8080, username: "user1", password: "pass1" }
    ];

    const customValue: CustomValue<string> = (proxy) =>
      `Custom: ${proxy.host}:${proxy.port}`;

    const result = await enrichedProxies(
      proxies,
      { timeout: 1000 },
      customValue
    );

    // Проверяем, что customValue было применено
    expect(result[0].customValue).toBe("Custom: 192.168.1.1:8080");
  });

  it("should use default timeout if not provided", async () => {
    // Мокаем вспомогательные функции
    (isValidProxyFormat as jest.Mock).mockReturnValue(true);
    (getProxyURL as jest.Mock).mockImplementation(
      (proxy) => `${proxy.host}:${proxy.port}`
    );
    (getProxyState as jest.Mock).mockResolvedValue(100); // Успешный ответ

    const proxies: Proxies = [
      { host: "192.168.1.1", port: 8080, username: "user1", password: "pass1" }
    ];

    const result = await enrichedProxies(proxies);

    // Проверяем, что использовался дефолтный таймаут (3000 мс)
    expect(getProxyState).toHaveBeenCalledWith(proxies[0], 3000);
  });
});

describe("getNextProxy", () => {
  it("selects proxy with lowest count and rps", async () => {
    const proxies: EnrichedProxies<number> = [
      {
        host: "proxy1",
        port: 8080,
        username: "user1",
        password: "pass1",
        count: 2,
        responseTime: 100,
        rps: 1,
        url: "user1:pass1@proxy1:8080",
        customValue: 42 // Пример кастомного значения
      },
      {
        host: "proxy2",
        port: 8081,
        username: "user2",
        password: "pass2",
        count: 1,
        responseTime: 200,
        rps: 0,
        url: "user2:pass2@proxy2:8081",
        customValue: 24 // Пример кастомного значения
      }
    ];

    const result = await getNextProxy(proxies);

    // Проверяем, что выбран прокси с наименьшими count и rps
    expect(result).toEqual(proxies[1]);
  });

  it("retries when no valid proxy is found", async () => {
    jest.useFakeTimers();

    const setTimeoutSpy = jest.spyOn(global, "setTimeout");

    const proxies: EnrichedProxies<string> = [
      {
        host: "proxy1",
        port: 8080,
        username: "user1",
        password: "pass1",
        count: 2,
        responseTime: 100,
        rps: 4,
        url: "user1:pass1@proxy1:8080",
        customValue: "Custom: proxy1:8080" // customValue как значение, а не функция
      }
    ];

    // Запускаем функцию с таймером
    const getNextProxyPromise = getNextProxy(proxies, 5);

    // Перемещаем время вперед на 1 секунду
    jest.advanceTimersByTime(1000);

    // Ожидаем завершения функции
    await getNextProxyPromise;

    // Проверяем, что setTimeout был вызван с ожидаемыми параметрами
    expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 1000);

    // Восстанавливаем оригинальные таймеры
    setTimeoutSpy.mockRestore();
    jest.useRealTimers();
  }, 5000);
});
