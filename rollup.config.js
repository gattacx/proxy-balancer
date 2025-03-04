// rollup.config.js
import typescript from "@rollup/plugin-typescript";
import { nodeResolve } from "@rollup/plugin-node-resolve";

export default {
  input: "src/index.ts", // Точка входа
  output: {
    dir: "dist", // Папка для выходных файлов
    format: "esm", // Формат модуля (ESM)
    sourcemap: true // Генерация sourcemap (опционально)
  },
  plugins: [
    typescript(), // Плагин для TypeScript
    nodeResolve() // Плагин для разрешения модулей
  ]
};
