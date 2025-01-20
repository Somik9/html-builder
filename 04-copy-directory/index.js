const fs = require('fs/promises');
const path = require('path');

const srcFolder = path.join(__dirname, 'files');
const destFolder = path.join(__dirname, 'files-copy');

async function copyDir(src, dest) {
  try {
    await fs.mkdir(dest, { recursive: true });
    const items = await fs.readdir(src, { withFileTypes: true });
    for (const item of items) {
      const srcPath = path.join(src, item.name);
      const destPath = path.join(dest, item.name);

      if (item.isFile()) {
        await fs.copyFile(srcPath, destPath);
      } else if (item.isDirectory()) {

        await copyDir(srcPath, destPath);
      }
    }
  } catch (err) {
    console.error('Error copying directory:', err.message);
  }
}


async function main() {
  try {
    await fs.rm(destFolder, { recursive: true, force: true });
    await copyDir(srcFolder, destFolder);
    console.log('Directory copied successfully!');
  } catch (err) {
    console.error('Error:', err.message);
  }
}

main();
