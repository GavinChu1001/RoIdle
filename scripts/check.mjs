import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { spawnSync } from 'node:child_process';

const root = new URL('../', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const moduleFiles = [];

function collectJsFiles(directory) {
  for (const name of readdirSync(directory)) {
    const file = join(directory, name);
    if (statSync(file).isDirectory()) collectJsFiles(file);
    else if (file.endsWith('.js')) moduleFiles.push(file);
  }
}

function checkClassic(file) {
  const result = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
  if (result.status !== 0) throw new Error(`${relative(root, file)}\n${result.stderr || result.stdout}`);
}

function checkModule(file) {
  const result = spawnSync(process.execPath, ['--input-type=module', '--check'], {
    input: readFileSync(file, 'utf8'),
    encoding: 'utf8',
  });
  if (result.status !== 0) throw new Error(`${relative(root, file)}\n${result.stderr || result.stdout}`);
}

try {
  checkClassic(join(root, 'game.js'));
  checkClassic(join(root, 'server.js'));
  collectJsFiles(join(root, 'src'));
  moduleFiles.sort().forEach(checkModule);
  console.log(`Syntax check passed: 2 classic scripts and ${moduleFiles.length} browser modules.`);
} catch (error) {
  console.error('Syntax check failed:');
  console.error(error.message);
  process.exitCode = 1;
}
