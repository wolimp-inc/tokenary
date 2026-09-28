import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { parse } from 'acorn';

const require = createRequire(import.meta.url);
const variants = [
  'tokenary.js',
  'tokenary.min.js',
  'tokenary.legacy.js',
  'tokenary.legacy.min.js'
];

const sizes = new Map();

for (const filename of variants) {
  const url = new URL(`../dist/${filename}`, import.meta.url);
  const source = await readFile(url, 'utf8');
  const ecmaVersion = filename.includes('.legacy.') ? 5 : 'latest';

  parse(source, { ecmaVersion, sourceType: 'script' });
  sizes.set(filename, Buffer.byteLength(source));

  const tokenary = require(fileURLToPath(url));
  const result = await tokenary.replaceOneShot({
    source: 'Hello, {{name}}!',
    pairsMap: { name: 'Ada' },
    keyMask: '{{?}}'
  });

  assert.equal(result, 'Hello, Ada!', `${filename} produced an invalid result`);
}

const esmUrl = new URL('../dist/tokenary.esm.js', import.meta.url);
const esmSource = await readFile(esmUrl, 'utf8');
parse(esmSource, { ecmaVersion: 'latest', sourceType: 'module' });

const esmDataUrl = `data:text/javascript;base64,${Buffer.from(esmSource).toString('base64')}`;
const esmTokenary = await import(esmDataUrl);
const esmResult = await esmTokenary.replaceOneShot({
  source: 'Hello, {{name}}!',
  pairsMap: { name: 'Ada' },
  keyMask: '{{?}}'
});

assert.equal(esmResult, 'Hello, Ada!', 'tokenary.esm.js produced an invalid result');
assert.equal(esmTokenary.default.compile, esmTokenary.compile);

assert.ok(
  sizes.get('tokenary.min.js') < sizes.get('tokenary.js'),
  'The modern minified build must be smaller than its development build'
);
assert.ok(
  sizes.get('tokenary.legacy.min.js') < sizes.get('tokenary.legacy.js'),
  'The legacy minified build must be smaller than its development build'
);

console.log('Build verified: UMD, ESM and legacy bundles are valid.');
