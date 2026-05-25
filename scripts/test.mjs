import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('../', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const read = (file) => readFileSync(join(root, file), 'utf8');
const importSource = async (source) => import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
const game = read('game.js');
const html = read('index.html');
const main = read('src/main.js');
const stateSurface = read('src/state/index.js');
const itemStatsSource = read('src/systems/equipment/itemStats.js');
const itemNamingSource = read('src/systems/equipment/itemNaming.js');
const itemScoreSource = read('src/systems/equipment/itemScore.js');

const requiredLegacyFunctions = [
  'createDefaultState',
  'load',
  'mergeState',
  'sanitizeProgression',
  'save',
  'renderAll',
  'updateCombat',
];

for (const name of requiredLegacyFunctions) {
  assert.match(game, new RegExp(`function\\s+${name}\\s*\\(`), `Missing runtime authority function: ${name}`);
}

assert.match(game, /window\.RuneFrontierDevBridge\s*=/, 'Developer diagnostics bridge must remain available.');
assert.match(html, /src="\.\/src\/main\.js"/, 'Module compatibility entry must remain loaded.');
assert.match(html, /src="game\.js[^"]*"/, 'Classic runtime must remain loaded in this migration batch.');
assert.match(main, /RUNTIME_AUTHORITY\s*=\s*'game\.js'/, 'Module entry must document the current runtime authority.');
assert.match(main, /bootstrapOwner:\s*'src\/main\.js'/, 'Module entry must own startup orchestration.');
assert.match(main, /installEquipmentRuntime\(equipmentContext\)/, 'Equipment read runtime must be installed before startup.');
assert.match(main, /window\.bootstrapLegacyRuntime\(\)/, 'Module entry must start the classic runtime through its bridge.');
assert.match(main, /bridged:\s*\[[^\]]*'equipment-actions'[^\]]*'drops'[^\]]*'combat'/s, 'Business bridge status is incomplete.');
assert.match(stateSurface, /loadGame/);
assert.match(stateSurface, /migrateSave/);
assert.match(stateSurface, /normalizePlayerState/);

assert.equal((game.match(/^function\s+init\s*\(/gm) || []).length, 1, 'Classic runtime must declare one init function.');
assert.equal((game.match(/^init\(\);/gm) || []).length, 0, 'Classic runtime must not auto-start before modules are installed.');
assert.match(game, /window\.bootstrapLegacyRuntime\s*=\s*\(\)\s*=>/, 'Classic runtime bootstrap bridge is missing.');
assert.match(game, /if\s*\(legacyRuntimeStarted\)\s*return false/, 'Classic runtime bootstrap must be guarded against duplicate starts.');
assert.match(game, /RuneFrontierLegacyEquipmentContext/, 'Legacy runtime must expose read-only equipment dependencies.');
assert.match(game, /RuneFrontierEquipmentRuntime/, 'Classic equipment entry points must forward to module implementations.');
assert.equal((game.match(/requestAnimationFrame\(loop\);/g) || []).length, 2, 'Loop registration shape changed unexpectedly.');

const itemStats = await importSource(itemStatsSource);
const itemNaming = await importSource(itemNamingSource);
const itemFixture = {
  name: 'Test Blade',
  slot: 'weapon',
  rarity: 'legend',
  atk: 100,
  hp: 200,
  str: 10,
  luk: 3,
  luck: 2,
  critDamageBonus: 0.1,
  refine: 5,
  empower: 1,
  randomStats: { str: 4 },
  mechanicAffixes: ['battle'],
  abyssBonus: { abyssDamageBonus: 0.1 },
  abyssAffixes: [{ effects: { bossDamageBonus: 0.05 } }],
  abyssForged: true,
  cardSlots: [{ cardId: 'test' }],
};
const frozenFixture = JSON.stringify(itemFixture);
itemStats.configureItemStatsContext({
  getMechanicAffixEffects: (id) => id === 'battle' ? { finalDamageBonus: 0.02 } : {},
  computeCardSocketBonuses: () => ({ lifeSteal: 0.03 }),
});
const effective = itemStats.getEffectiveItemStats(itemFixture, true);
assert.equal(effective.atk, 114, 'Flat star-refine and empower scaling changed.');
assert.equal(effective.str, 15, 'Random attribute scaling changed.');
assert.equal(effective.luk, 5, 'Legacy LUK/luck aggregation changed.');
assert.equal(effective.finalDamageBonus, 0.021, 'Mechanic affix scaling changed.');
assert.equal(effective.abyssDamageBonus, 0.103, 'Abyss bonus scaling changed.');
assert.equal(effective.bossDamageBonus, 0.052, 'Abyss affix scaling changed.');
assert.equal(effective.lifeSteal, 0.03, 'Socket bonus merge changed.');
assert.equal(JSON.stringify(itemFixture), frozenFixture, 'Read-only equipment calculation mutated the item.');
assert.equal(itemNaming.getEquipmentDisplayName(itemFixture), '\u6df1\u6e0a Test Blade', 'Abyss display prefix changed.');
assert.equal(itemNaming.getEquipmentDisplayName({ name: '\u6df1\u6e0a Blade', abyssForged: true }), '\u6df1\u6e0a Blade', 'Abyss prefix must not duplicate.');
assert.equal(itemNaming.getEquipmentDisplayName(null), '\u672a\u77e5\u88c5\u5907', 'Missing items must display safely.');
assert.ok(Object.values(itemStats.getEffectiveItemStats(null)).every(Number.isFinite), 'Missing item stats must be finite.');

const scoreStandaloneSource = itemScoreSource
  .replace("import { getEffectiveItemStats } from './itemStats.js';", 'const getEffectiveItemStats = (item) => item;')
  .replace("import { isAbyssEquipment } from './itemNaming.js';", "const isAbyssEquipment = (item) => Boolean(item?.abyssForged);");
const itemScore = await importSource(scoreStandaloneSource);
const scores = itemScore.calculateEquipmentScores({
  atk: 100,
  hp: 200,
  bossDamageBonus: 0.05,
  abyssDamageBonus: 0.08,
  abyssDamageReduction: 0.05,
  abyssForged: true,
});
assert.ok(scores.output > 0 && scores.survival > 0 && scores.boss > 0 && scores.abyss > 0, 'Equipment score outputs must remain finite and positive.');
assert.ok(Object.values(scores).every(Number.isFinite), 'Equipment scores must not contain invalid numbers.');

console.log('Migration baseline tests passed: module-owned startup and read-only equipment calculations are intact.');
