const fs = require('fs/promises');
const path = require('path');

const projectDist = path.join(__dirname, 'project-dist');
const templateFile = path.join(__dirname, 'template.html');
const componentsFolder = path.join(__dirname, 'components');
const stylesFolder = path.join(__dirname, 'styles');
const assetsFolder = path.join(__dirname, 'assets');
const distAssetsFolder = path.join(projectDist, 'assets');

async function buildHTML() {
  try {
    let template = await fs.readFile(templateFile, 'utf-8');
    const tags = template.match(/{{\s*\w+\s*}}/g) || [];

    for (const tag of tags) {
      const componentName = tag.replace(/{{\s*|\s*}}/g, '');
      const componentPath = path.join(componentsFolder, `${componentName}.html`);
      try {
        const componentContent = await fs.readFile(componentPath, 'utf-8');
        template = template.replace(new RegExp(tag, 'g'), componentContent);
      } catch {
        console.error(`Component "${componentName}" not found.`);
      }
    }

    await fs.mkdir(projectDist, { recursive: true });
    await fs.writeFile(path.join(projectDist, 'index.html'), template);
    console.log('HTML built successfully!');
  } catch (err) {
    console.error('Error building HTML:', err.message);
  }
}

async function mergeStyles() {
  try {
    const files = await fs.readdir(stylesFolder, { withFileTypes: true });
    const styles = [];

    for (const file of files) {
      const filePath = path.join(stylesFolder, file.name);
      if (file.isFile() && path.extname(file.name) === '.css') {
        const content = await fs.readFile(filePath, 'utf-8');
        styles.push(content);
      }
    }

    await fs.writeFile(path.join(projectDist, 'style.css'), styles.join('\n'));
    console.log('Styles merged successfully!');
  } catch (err) {
    console.error('Error merging styles:', err.message);
  }
}

async function copyAssets(src, dest) {
  try {
    await fs.mkdir(dest, { recursive: true });
    const items = await fs.readdir(src, { withFileTypes: true });

    for (const item of items) {
      const srcPath = path.join(src, item.name);
      const destPath = path.join(dest, item.name);

      if (item.isDirectory()) {
        await copyAssets(srcPath, destPath);
      } else {
        await fs.copyFile(srcPath, destPath);
      }
    }
    console.log('Assets copied successfully!');
  } catch (err) {
    console.error('Error copying assets:', err.message);
  }
}

async function buildPage() {
  try {
    await fs.rm(projectDist, { recursive: true, force: true });
    await buildHTML();
    await mergeStyles();
    await copyAssets(assetsFolder, distAssetsFolder);
  } catch (err) {
    console.error('Error building page:', err.message);
  }
}

buildPage();
