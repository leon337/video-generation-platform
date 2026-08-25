import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const roots = ['packages/domain/src', 'packages/routing/src'];
const forbidden = [
  "from '@vgp/providers'",
  'from "@vgp/providers"',
  'zai-sdk',
  'alibaba-cloud-sdk',
  'kling',
  'seedance',
];

async function filesUnder(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await filesUnder(path)));
    else if (/\.(ts|tsx|js|mjs)$/.test(entry.name)) files.push(path);
  }
  return files;
}

const violations = [];
for (const root of roots) {
  for (const file of await filesUnder(root)) {
    const source = await readFile(file, 'utf8');
    for (const token of forbidden) {
      if (source.includes(token)) {
        violations.push(`${file}: forbidden dependency token ${token}`);
      }
    }
  }
}

if (violations.length > 0) {
  console.error(violations.join('\n'));
  process.exit(1);
}

console.log('boundary check: PASS');
