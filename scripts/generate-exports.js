import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packageJsonPath = path.join(__dirname, '../package.json');
const libPath = path.join(__dirname, '../src/lib');

const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

const exports = {
  '.': {
    types: './dist/index.d.ts',
    svelte: './dist/index.js'
  }
};

function walk(dir, baseDir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      // Check for index.ts in directory to add folder export
      if (fs.existsSync(path.join(fullPath, 'index.ts'))) {
        const relativeDir = path.relative(baseDir, fullPath);
        const exportKey = `./${relativeDir}`;
        // used when .d.ts files are not generated for folders (only has happened ones for dropdown-menu)
        let skip = false;
        exports[exportKey] = {
          types: skip ? undefined : `./dist/${relativeDir}/index.d.ts`,
          svelte: `./dist/${relativeDir}/index.js`
        };
      } else {
        walk(fullPath, baseDir);
      }
    } else {
      const relativePath = path.relative(baseDir, fullPath);
      const ext = path.extname(file);
      const name = path.basename(file, ext);

      if (file === 'index.ts') continue; // Handled by directory check
      if (file.endsWith('.d.ts')) continue; // Ignore d.ts files

      let exportKey;
      let typesPath;
      let sveltePath;

      const dirName = path.dirname(relativePath);
      const relativeDir = dirName === '.' ? '' : dirName + '/';

      if (file.endsWith('.svelte')) {
        exportKey = `./${relativeDir}${file}`;
        typesPath = `./dist/${relativeDir}${file}.d.ts`;
        sveltePath = `./dist/${relativeDir}${file}`;
      } else if (file.endsWith('.svelte.ts')) {
        // .svelte.ts -> .svelte.js
        const baseName = path.basename(file, '.ts'); // file.svelte
        exportKey = `./${relativeDir}${baseName}`;
        typesPath = `./dist/${relativeDir}${baseName}.d.ts`;
        sveltePath = `./dist/${relativeDir}${baseName}.js`;
      } else if (ext === '.ts') {
        exportKey = `./${relativeDir}${name}`;
        typesPath = `./dist/${relativeDir}${name}.d.ts`;
        sveltePath = `./dist/${relativeDir}${name}.js`;
      } else {
        continue;
      }

      exports[exportKey] = {
        types: typesPath,
        svelte: sveltePath
      };
    }
  }
}

walk(libPath, libPath);

// Sort exports
const sortedExports = Object.keys(exports)
  .sort()
  .reduce((acc, key) => {
    acc[key] = exports[key];
    return acc;
  }, {});

pkg.exports = sortedExports;

fs.writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 2) + '\n');
console.log('Updated package.json exports');
