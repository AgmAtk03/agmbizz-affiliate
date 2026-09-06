/**
 * Rewrite absolute same-origin paths in dist/ so the tree can be hosted
 * from a subdirectory or githack URL (…/index.html) without a site root.
 * Used only for the live-demo branch; Vercel keeps absolute `/` paths.
 */
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, relative, sep } from 'node:path';

const dist = new URL('../dist/', import.meta.url);
const distPath = dist.pathname;

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(full)));
    else files.push(full);
  }
  return files;
}

function prefixFor(file) {
  const rel = relative(distPath, dirname(file));
  const depth = rel === '' ? 0 : rel.split(sep).length;
  return depth === 0 ? './' : '../'.repeat(depth);
}

function withIndex(path) {
  if (path.startsWith('#') || path.startsWith('mailto:') || path.startsWith('http')) {
    return path;
  }
  if (path.endsWith('/')) return `${path}index.html`;
  return path;
}

function relativize(source, prefix) {
  return source
    .replaceAll(/(href|src|content)="\/(?!\/)([^"]*)"/g, (_, attr, path) => {
      const next = withIndex(`${prefix}${path}`);
      return `${attr}="${next}"`;
    })
    .replaceAll(/url\(\/(?!\/)([^)]+)\)/g, (_, path) => `url(${prefix}${path})`);
}

const files = await walk(distPath);
let changed = 0;
for (const file of files) {
  if (!/\.(html|css|js|xml|txt)$/.test(file)) continue;
  const before = await readFile(file, 'utf8');
  const after = relativize(before, prefixFor(file));
  if (after !== before) {
    await writeFile(file, after);
    changed += 1;
  }
}

await writeFile(new URL('../dist/.nojekyll', import.meta.url), '');
console.log(`Relativized ${changed} files and wrote dist/.nojekyll`);
