import fs from 'node:fs';

const pkg = JSON.parse(fs.readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
const docs = fs.readFileSync(new URL('../docs/ARCHITECTURE.md', import.meta.url), 'utf8');

const allDeps = new Set([
  ...Object.keys(pkg.dependencies ?? {}),
  ...Object.keys(pkg.devDependencies ?? {}),
]);
const scripts = new Set(Object.keys(pkg.scripts ?? {}));

const sectionMatch = docs.match(/## Dependências([\s\S]*?)## /);
if (!sectionMatch) {
  console.error('❌ Seção "## Dependências" não encontrada em docs/ARCHITECTURE.md');
  process.exit(1);
}

const lines = sectionMatch[1].split('\n').map((line) => line.trim());
const tokens = [];
for (const line of lines) {
  if (!line.startsWith('- ')) continue;
  const raw = line.slice(2);
  for (const part of raw.split(',')) {
    const token = part
      .replace(/\([^)]*\)/g, '')
      .replace(/`/g, '')
      .trim()
      .split(/\s+/)[0];

    if (!token) continue;
    if (token.endsWith('/*')) continue;
    if (token === '...') continue;
    tokens.push(token);
  }
}

const badDeps = [...new Set(tokens)].filter((name) => !allDeps.has(name));

const scriptRefs = [...docs.matchAll(/`([a-z0-9:_-]+)`/gi)].map((m) => m[1]);
const badScripts = [...new Set(scriptRefs.filter((name) => name.includes(':') || ['dev','build','lint','preview','test'].includes(name)))]
  .filter((name) => !scripts.has(name));

if (badDeps.length || badScripts.length) {
  console.error('❌ Inconsistências entre docs e package.json:\n');
  if (badDeps.length) {
    console.error('Dependências citadas e não encontradas:');
    badDeps.forEach((d) => console.error(`- ${d}`));
    console.error('');
  }
  if (badScripts.length) {
    console.error('Scripts citados e não encontrados:');
    badScripts.forEach((s) => console.error(`- ${s}`));
  }
  process.exit(1);
}

console.log('✅ docs/ARCHITECTURE.md está alinhado com package.json (dependências e scripts citados).');
