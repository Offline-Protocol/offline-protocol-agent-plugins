#!/usr/bin/env node
// Checks that this repository is a complete, unmodified export and that its
// manifests agree with each other. No dependencies; run from the repository
// root: node .github/scripts/check-repository.mjs [--tag <git tag>]

import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const errors = [];
const fail = msg => errors.push(msg);
const read = p => readFileSync(p);
const json = p => JSON.parse(read(p).toString('utf8'));

function listFiles(dir = '.') {
  const out = [];
  for (const name of readdirSync(dir).sort()) {
    if (dir === '.' && name === '.git') continue;
    const p = dir === '.' ? name : `${dir}/${name}`;
    if (statSync(p).isDirectory()) out.push(...listFiles(p));
    else out.push(p);
  }
  return out;
}

// 1. Every file is listed in SOURCE.json with a matching sha256, and nothing else exists.
const source = json('SOURCE.json');
const present = listFiles();
for (const p of present) {
  if (p === 'SOURCE.json') continue;
  const expected = source.files[p];
  if (!expected) fail(`${p}: not in SOURCE.json (files are exported, not edited here)`);
  else if (createHash('sha256').update(read(p)).digest('hex') !== expected) fail(`${p}: sha256 differs from SOURCE.json`);
}
for (const p of Object.keys(source.files)) if (!present.includes(p)) fail(`${p}: listed in SOURCE.json but missing`);

// 2. Every JSON file parses.
for (const p of present.filter(p => p.endsWith('.json'))) {
  try { json(p); } catch (e) { fail(`${p}: invalid JSON (${e.message})`); }
}
if (errors.length) finish();

// 3. Plugin name and version agree across Claude Code, Codex, Cursor and Gemini CLI manifests.
const plugin = json('plugins/offline-protocol/plugin.json');
const manifests = {
  'plugins/offline-protocol/.claude-plugin/plugin.json': json('plugins/offline-protocol/.claude-plugin/plugin.json'),
  'plugins/offline-protocol/.codex-plugin/plugin.json': json('plugins/offline-protocol/.codex-plugin/plugin.json'),
  'gemini-extension.json': json('gemini-extension.json'),
};
for (const [p, m] of Object.entries(manifests)) {
  if (m.name !== plugin.name) fail(`${p}: name ${m.name} differs from plugin.json (${plugin.name})`);
  if (m.version !== plugin.version) fail(`${p}: version ${m.version} differs from plugin.json (${plugin.version})`);
}
if (!/^\d+\.\d+\.\d+$/.test(plugin.version)) fail(`plugin.json: version ${plugin.version} is not x.y.z`);
const gemini = manifests['gemini-extension.json'];
if (!existsSync(gemini.contextFileName)) fail(`gemini-extension.json: contextFileName ${gemini.contextFileName} missing`);
if (!existsSync('plugins/offline-protocol/skills/build-with-offline-protocol/SKILL.md')) fail('skill SKILL.md missing');
const skill = read('plugins/offline-protocol/skills/build-with-offline-protocol/SKILL.md').toString('utf8');
if (!/^---\n[\s\S]*?\bname:\s*\S[\s\S]*?\bdescription:\s*\S[\s\S]*?\n---/.test(skill)) fail('SKILL.md: frontmatter needs name and description');

// 4. Marketplace files point at a plugin that exists.
const sources = [
  ...json('.claude-plugin/marketplace.json').plugins.map(p => p.source),
  ...json('.cursor-plugin/marketplace.json').plugins.map(p => p.source),
  ...json('.agents/plugins/marketplace.json').plugins.map(p => p.source.path),
];
for (const s of sources) if (!existsSync(join(s, 'plugin.json'))) fail(`marketplace source ${s} has no plugin.json`);
const cursor = json('.cursor-plugin/marketplace.json').plugins[0];
if (cursor.name !== plugin.name) fail('.cursor-plugin/marketplace.json: plugin name differs from plugin.json');
if (!existsSync(join(cursor.source, cursor.logo))) fail(`cursor logo ${cursor.logo} missing`);

// 5. Every launcher pins the same CLI version, and it matches the registry record.
const pins = new Set();
for (const p of present.filter(p => /\.(json|md|toml|ya?ml)$/.test(p) && !p.startsWith('.github/'))) {
  for (const m of read(p).toString('utf8').matchAll(/@offline-protocol\/cli@([0-9][0-9A-Za-z.+-]*)/g)) pins.add(m[1]);
}
const server = json('distribution/mcp-registry/server.json');
pins.add(server.version);
for (const pkg of server.packages ?? []) pins.add(pkg.version);
if (pins.size !== 1) fail(`CLI version pins disagree: ${[...pins].join(', ')}`);
if (source.cliPackage !== `@offline-protocol/cli@${server.version}`) fail(`SOURCE.json cliPackage ${source.cliPackage} differs from server.json ${server.version}`);
const args = server.packages?.[0]?.packageArguments?.map(a => a.value);
if (JSON.stringify(args) !== JSON.stringify(['mcp', 'serve'])) fail('server.json: package arguments must be mcp serve');
if (server.packages?.[0]?.transport?.type !== 'stdio') fail('server.json: transport must be stdio');

// 6. A release tag must match the extension version (Gemini CLI compares them).
const tagIndex = process.argv.indexOf('--tag');
const tag = tagIndex > 0 ? process.argv[tagIndex + 1] : '';
if (tag && tag !== `v${plugin.version}`) fail(`tag ${tag} does not match version ${plugin.version} (expected v${plugin.version})`);

finish();

function finish() {
  if (errors.length) {
    for (const e of errors) console.error(`error: ${e}`);
    process.exit(1);
  }
  console.log(`OK: ${present.length} files match SOURCE.json; ${plugin.name} ${plugin.version}; CLI ${[...pins][0]}.`);
  process.exit(0);
}
