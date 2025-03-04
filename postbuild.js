import { replaceInFile } from "replace-in-file";

const options = {
  files: "dist/**/*.js", // Ищем все JS-файлы в папке dist
  from: /from\s+['"](\.\/[^'"]+)['"]/g, // Регулярное выражение для поиска импортов
  to: (match) => match.replace(/from\s+['"](\.\/[^'"]+)['"]/, `from '$1.js'`) // Добавляем .js к импортам
};

try {
  const results = await replaceInFile(options);
  console.log("Replacement results:", results);
} catch (error) {
  console.error("Error occurred:", error);
  process.exit(1); // Завершаем процесс с ошибкой
}
