import { readdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputDir = path.join(projectRoot, 'dist');
const textExtensions = new Set(['.css', '.html', '.js', '.json', '.map', '.txt', '.xml']);

async function getFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...await getFiles(entryPath));
    } else {
      files.push(entryPath);
    }
  }

  return files;
}

function assertSafeOutputPath(filePath) {
  const relativePath = path.relative(outputDir, filePath);
  const unsafeSegment = relativePath.split(path.sep).find((segment) => segment.startsWith('_'));

  if (unsafeSegment) {
    throw new Error(`Build output cannot start with an underscore: ${relativePath}`);
  }
}

const initialFiles = await getFiles(outputDir);
const renamedFiles = new Map();

for (const filePath of initialFiles) {
  assertSafeOutputPath(filePath);

  if (path.extname(filePath) === '.js' && !filePath.endsWith('.min.js')) {
    const minifiedPath = filePath.replace(/\.js$/, '.min.js');
    await rename(filePath, minifiedPath);
    renamedFiles.set(path.basename(filePath), path.basename(minifiedPath));
  }
}

const outputFiles = await getFiles(outputDir);

for (const filePath of outputFiles) {
  if (!textExtensions.has(path.extname(filePath))) continue;

  const originalContent = await readFile(filePath, 'utf8');
  let updatedContent = originalContent;

  for (const [originalName, minifiedName] of renamedFiles) {
    updatedContent = updatedContent.replaceAll(originalName, minifiedName);
  }

  if (filePath.endsWith('.min.js') || filePath.endsWith('.min.css')) {
    updatedContent = updatedContent.replace(/\/\*![\s\S]*?\*\//g, '');
  }

  if (updatedContent !== originalContent) {
    await writeFile(filePath, updatedContent);
  }
}

const finalFiles = await getFiles(outputDir);

for (const filePath of finalFiles) {
  assertSafeOutputPath(filePath);

  if (filePath.endsWith('.js') && !filePath.endsWith('.min.js')) {
    throw new Error(`JavaScript output is not minified: ${path.relative(outputDir, filePath)}`);
  }

  if (filePath.endsWith('.css') && !filePath.endsWith('.min.css')) {
    throw new Error(`CSS output is not minified: ${path.relative(outputDir, filePath)}`);
  }
}

console.log(`Finalized ${renamedFiles.size} JavaScript asset(s) for GitHub Pages.`);
