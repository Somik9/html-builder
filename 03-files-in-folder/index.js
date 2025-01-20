const fs = require('fs/promises');
const path = require('path');

// Путь к папке secret-folder
const folderPath = path.join(__dirname, 'secret-folder');

async function displayFilesInfo() {
  try {
    // Читаем содержимое папки
    const files = await fs.readdir(folderPath, { withFileTypes: true });

    // Обрабатываем каждый объект
    for (const file of files) {
      if (file.isFile()) {
        // Полный путь к файлу
        const filePath = path.join(folderPath, file.name);

        // Получаем информацию о файле
        const stats = await fs.stat(filePath);

        // Имя файла без расширения
        const fileName = path.basename(file.name, path.extname(file.name));

        // Расширение файла
        const fileExtension = path.extname(file.name).slice(1);

        // Размер файла в килобайтах
        const fileSize = (stats.size / 1024).toFixed(3); // в кБ, без округления

        // Вывод информации в консоль
        console.log(`${fileName} - ${fileExtension} - ${fileSize}kb`);
      }
    }
  } catch (err) {
    console.error('Error reading folder:', err.message);
  }
}

// Запускаем функцию
displayFilesInfo();
