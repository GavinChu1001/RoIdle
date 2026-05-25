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
const itemFactorySource = read('src/systems/equipment/itemFactory.js');
const dismantleSource = read('src/systems/equipment/dismantle.js');
const equipmentDropsSource = read('src/systems/drops/equipmentDrops.js');
const recentLootSource = read('src/systems/drops/recentLoot.js');
const lootModelSource = read('src/systems/drops/lootModel.js');
const offlineSource = read('src/systems/offline.js');

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
assert.match(main, /migrated:\s*\[[^\]]*'equipment-online-mutations'[^\]]*'online-equipment-drops'[^\]]*'recent-loot-recording'[^\]]*'offline-equipment-settlement'/s, 'Offline equipment migration status is incomplete.');
assert.match(main, /bridged:\s*\[[^\]]*'offline-reward-rolls'[^\]]*'remaining-drops'[^\]]*'combat'/s, 'Deferred bridge status is incomplete.');
assert.match(main, /installDropsRuntime\(dropsContext\)/, 'Drops runtime must be installed before startup.');
assert.match(main, /installOfflineRuntime\(offlineContext\)/, 'Offline runtime must be installed before startup.');
assert.match(stateSurface, /loadGame/);
assert.match(stateSurface, /migrateSave/);
assert.match(stateSurface, /normalizePlayerState/);

assert.equal((game.match(/^function\s+init\s*\(/gm) || []).length, 1, 'Classic runtime must declare one init function.');
assert.equal((game.match(/^init\(\);/gm) || []).length, 0, 'Classic runtime must not auto-start before modules are installed.');
assert.match(game, /window\.bootstrapLegacyRuntime\s*=\s*\(\)\s*=>/, 'Classic runtime bootstrap bridge is missing.');
assert.match(game, /if\s*\(legacyRuntimeStarted\)\s*return false/, 'Classic runtime bootstrap must be guarded against duplicate starts.');
assert.match(game, /RuneFrontierLegacyEquipmentContext/, 'Legacy runtime must expose read-only equipment dependencies.');
assert.match(game, /RuneFrontierEquipmentRuntime/, 'Classic equipment entry points must forward to module implementations.');
assert.match(game, /RuneFrontierLegacyDropsContext/, 'Legacy runtime must expose online drop dependencies.');
assert.match(game, /RuneFrontierDropsRuntime/, 'Classic online drop entry points must forward to module implementations.');
assert.match(game, /runtime\.normalizeLootRewards/, 'Loot summary view data must forward to the drops runtime.');
assert.match(game, /runtime\.getLatestRecentLootRewards/, 'Recent-loot viewing must forward to the drops runtime.');
assert.match(game, /RuneFrontierLegacyOfflineContext/, 'Legacy runtime must expose offline settlement dependencies.');
assert.match(game, /runtime\.claimOfflineRewards/, 'Offline claiming must forward to the offline runtime.');
assert.match(game, /runtime\.processGeneratedOfflineEquipment/, 'Offline generated equipment must forward to the offline runtime.');
assert.match(game, /if\s*\(runtime\s*&&\s*typeof runtime\.addEquipmentToInventory/, 'Offline inventory settlement must use the shared equipment runtime.');
assert.match(game, /if\s*\(!options\.offline\s*&&\s*runtime\s*&&\s*typeof runtime\.rollEquipmentTableDrops/, 'Offline drop settlement must remain on the legacy path.');
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

const itemFactory = await importSource(itemFactorySource);
const factoryContext = {
  getEquipmentTiers: () => [{ id: 'normal', scale: 1, rolls: [1, 1] }],
  getItemTierForLevel: () => ({ id: 'starter', scale: 1 }),
  getSlotLevelGrowth: () => 0,
  randomFloat: (min) => min,
  createItemId: () => 'generated-item',
  normalizeEquipmentSlot: (slot) => slot,
  getTemplateBaseStats: () => ({}),
  shouldRollRandomStats: () => false,
  defaultRandomStats: () => ({ str: 0 }),
  addBaseRanges: () => {},
  applyTierExtra: () => {},
  applyRandomAffixes: () => {},
  applyAbyssEquipmentBonus: () => {},
  canCreateMythic: () => true,
};
const generated = itemFactory.createItem({ name: 'Blade', slot: 'weapon', atk: 10 }, 1, 'normal', {}, factoryContext);
assert.equal(generated.id, 'generated-item', 'Module-owned item creation did not run.');
assert.equal(generated.atk, 10, 'Module-owned item creation changed base equipment output.');
assert.deepEqual(generated.cardSlots, [], 'New equipment must retain the existing empty socket behavior.');

const dismantle = await importSource(dismantleSource);
const mutationState = {
  inventory: [],
  materials: {},
  autoSalvage: { enabled: true, maxRarity: 'normal', autoDismantleAbyss: false },
};
const mutationLoot = [];
const mutationContext = {
  getState: () => mutationState,
  normalizeItem: (item) => ({ ...item }),
  isAbyssEquipment: (item) => Boolean(item.abyssForged),
  rarityRank: (rarity) => ['normal', 'fine', 'rare', 'epic', 'legend', 'darkGold', 'mythic'].indexOf(rarity),
  getSalvageTable: () => ({ dust: [1, 1] }),
  randomInt: (min) => min,
  addMaterials: (rewards) => Object.entries(rewards).forEach(([id, qty]) => { mutationState.materials[id] = (mutationState.materials[id] || 0) + qty; }),
  recordSessionReward: () => {},
  recordRecentLoot: (reward, source) => mutationLoot.push({ reward, source }),
  recordAutoSalvageBatch: () => {},
  getInventoryLimit: () => 1,
  trackEquipmentAchievement: () => {},
  recordEquipmentSessionReward: () => {},
  isBossEncounter: () => false,
};
const salvaged = dismantle.addEquipmentToInventory({ id: 'common', rarity: 'normal', level: 1 }, {}, mutationContext);
assert.equal(salvaged.salvaged, true, 'Common online equipment should still auto-salvage when enabled.');
assert.equal(mutationState.materials.dust, 1, 'Auto-salvage rewards changed.');
assert.equal(mutationLoot.length, 1, 'Auto-salvage must write one recent-loot record.');
const protectedItem = dismantle.addEquipmentToInventory({ id: 'set', rarity: 'normal', setId: 'set-a' }, {}, mutationContext);
assert.equal(protectedItem.added, true, 'Set equipment must remain protected from ordinary auto-salvage.');
assert.equal(dismantle.shouldAutoSalvage({ rarity: 'normal', abyssForged: true }, mutationContext), false, 'Abyss equipment must remain protected unless explicitly enabled.');
const fullInventory = dismantle.addEquipmentToInventory({ id: 'second', rarity: 'legend' }, {}, mutationContext);
assert.equal(fullInventory.skipped, true, 'Inventory capacity behavior changed.');

const recentLoot = await importSource(recentLootSource);
const lootState = { recentLoot: [], lootNotifyUnread: false, lastLootUpdatedAt: 0 };
const normalizeRewards = (raw = {}) => ({
  gold: Number(raw.gold || 0),
  baseExp: Number(raw.baseExp || 0),
  jobExp: Number(raw.jobExp || 0),
  equipments: Array.isArray(raw.equipments) ? raw.equipments : [],
  cards: Array.isArray(raw.cards) ? raw.cards : [],
  materials: Array.isArray(raw.materials) ? raw.materials : [],
  autoSalvagedMaterials: raw.autoSalvagedMaterials || {},
});
const lootContext = {
  getState: () => lootState,
  normalizeRewards,
  objectTotal: (object = {}) => Object.values(object).reduce((sum, value) => sum + Number(value || 0), 0),
  now: () => 12345,
  createEntryId: () => 'new-loot',
};
recentLoot.recordRecentLoot({ gold: 1 }, '战斗战利品', lootContext);
assert.equal(lootState.lootNotifyUnread, false, 'Gold-only updates must not create a loot notification.');
recentLoot.recordRecentLoot({ equipments: [{ id: 'drop' }] }, '装备掉落', lootContext);
assert.equal(lootState.lootNotifyUnread, true, 'Equipment drops must create an unread loot notification.');
assert.equal(lootState.recentLoot[0].id, 'new-loot', 'Most recent loot should be stored first.');

const equipmentDrops = await importSource(equipmentDropsSource);
const accepted = [];
const dropContext = {
  currentMap: () => ({ id: 'grass' }),
  getDropTableId: (id) => id,
  getEquipmentDropTable: () => [{ equipmentId: 'blade', rarity: 'normal', minLevel: 1, maxLevel: 1, dropRate: 1 }],
  getEquipmentTemplate: () => ({ id: 'blade', name: 'Blade', rarity: 'normal' }),
  getMaxEquipmentDrops: () => 1,
  getEffectiveEquipmentDropRate: () => 1,
  getOnlineEquipmentDropChance: () => 1,
  random: () => 0,
  weightedChoice: (items) => items[0],
  applyRebirthPrestigeDropWeight: (_drop, weight) => weight,
  getDifficultyDropLevelBonus: () => ({ min: 0, max: 0 }),
  clampLevel: (value) => value,
  randomInt: (min) => min,
  getDarkGoldUpgradeRate: () => 0,
  currentDifficulty: () => 'normal',
  createItem: (_template, _level, rarity) => ({ id: 'table-drop', rarity }),
  addEquipmentToInventory: (item) => accepted.push(item),
};
assert.equal(equipmentDrops.rollEquipmentTableDrops({}, {}, dropContext), 1, 'Online equipment table drop count changed.');
assert.equal(accepted[0].id, 'table-drop', 'Online equipment table drops must enter the module acceptance path.');

const lootModel = await importSource(lootModelSource);
const lootModelContext = {
  createEmptyRewards: () => ({ equipments: [], cards: [], materials: [], autoSalvagedMaterials: {} }),
  normalizeBaseRewards: (raw = {}) => ({
    ...raw,
    equipments: Array.isArray(raw.equipments) ? raw.equipments : Array.isArray(raw.equipment) ? raw.equipment : [],
    cards: Array.isArray(raw.cards) ? raw.cards : [],
    materials: Array.isArray(raw.materials) ? raw.materials : Object.entries(raw.materials || {}).map(([materialId, qty]) => ({ materialId, qty })),
    autoSalvagedMaterials: raw.autoSalvagedMaterials || raw.salvagedMaterials || {},
    skippedEquipment: Number(raw.skippedEquipment || 0),
  }),
  normalizeEquipment: (item) => ({ ...item, normalized: true }),
  objectTotal: (entries = {}) => Object.values(entries).reduce((sum, qty) => sum + Number(qty || 0), 0),
};
const normalizedLoot = lootModel.normalizeLootRewards({
  seconds: 3,
  materials: { dust: 2 },
  equipments: [{ id: 'kept' }, { id: 'pending' }],
  skippedEquipment: 1,
  salvagedMaterials: { ore: 1 },
}, lootModelContext);
assert.equal(normalizedLoot.equipment.length, 1, 'Claimed equipment should remain separate from pending equipment in loot views.');
assert.equal(normalizedLoot.pendingEquipment[0].id, 'pending', 'Legacy pending-equipment inference changed.');
assert.equal(normalizedLoot.materials[0].materialId, 'dust', 'Legacy material-object normalization changed.');
assert.equal(normalizedLoot.autoSalvaged, 1, 'Auto-salvage material totals must be safe in loot views.');
const mergedLoot = lootModel.mergeLootRewards([
  { equipment: [{ id: 'old' }], materials: [{ materialId: 'dust', qty: 1 }] },
  { pendingEquipment: [{ id: 'new-pending' }], skippedEquipment: 1, materials: [{ materialId: 'dust', qty: 2 }] },
], lootModelContext);
assert.equal(mergedLoot.materials[0].qty, 3, 'Merged loot material counts changed.');
assert.equal(mergedLoot.pendingEquipment.length, 1, 'Merged pending equipment should be preserved.');
const recentView = lootModel.getLatestRecentLootRewards({
  recentLoot: [
    { time: 100, rewards: { equipment: [{ id: 'older' }] } },
    { time: 105, rewards: { equipment: [{ id: 'newer' }] } },
    { time: 30000, rewards: { equipment: [{ id: 'latest' }] } },
  ],
}, lootModelContext);
assert.equal(recentView.equipment[0].id, 'latest', 'Latest-loot view must not be replaced by stale batches.');

const offline = await importSource(offlineSource);
assert.match(offlineSource, /claimOffline:\s*claimOfflineRewards/, 'Legacy Offline claim alias must remain available.');
assert.match(offlineSource, /rollOfflineEquipmentDrops,/, 'Legacy Offline roll aliases must remain available.');
const generatedRewards = { equipments: [], materials: [] };
const generatedMaterials = [];
const generatedContext = {
  getEquipmentRuntime: () => ({
    shouldAutoSalvage: (item) => item.id === 'salvage',
    getSalvageRewards: () => ({ dust: 2 }),
  }),
  mergeMaterialReward: (_materials, reward) => generatedMaterials.push(reward),
  canOfflineFullSalvage: () => false,
};
offline.processGeneratedOfflineEquipment(generatedRewards, [{ id: 'salvage' }, { id: 'protected' }], { freeSlots: 0 }, {}, generatedContext);
assert.equal(generatedMaterials[0].dust, 2, 'Offline generation must reuse equipment salvage rewards.');
assert.equal(generatedRewards.equipments[0].id, 'protected', 'Protected offline equipment must remain claimable when inventory is full.');

const offlineState = {
  gold: 0,
  materials: {},
  cards: {},
  cardCodex: {},
  offlinePending: {
    seconds: 10,
    gold: 7,
    baseExp: 3,
    jobExp: 2,
    equipments: [{ id: 'accepted' }, { id: 'waiting' }],
    materials: [{ materialId: 'dust', qty: 4 }],
    cards: [{ cardId: 'card-a', qty: 1 }],
    autoSalvagedMaterials: {},
  },
};
let offlineExpGranted = 0;
let allowWaiting = false;
const offlineSummaries = [];
const claimContext = {
  getState: () => offlineState,
  createEmptyRewards: () => ({ seconds: 0, gold: 0, baseExp: 0, jobExp: 0, equipments: [], cards: [], materials: [], autoSalvagedMaterials: {}, skippedEquipment: 0 }),
  normalizeLootRewards: (input = {}) => ({
    seconds: Number(input.seconds || 0),
    gold: Number(input.gold || 0),
    baseExp: Number(input.baseExp || 0),
    jobExp: Number(input.jobExp || 0),
    equipments: input.equipments || [],
    cards: input.cards || [],
    materials: input.materials || [],
    autoSalvagedMaterials: input.autoSalvagedMaterials || {},
  }),
  objectTotal: () => 0,
  getEquipmentRuntime: () => ({
    addEquipmentToInventory: (item) => item.id === 'waiting' && !allowWaiting ? { skipped: true } : { added: true },
  }),
  gainExp: (base, job) => { offlineExpGranted += base + job; },
  grantCards: (cards) => cards.forEach((card) => { offlineState.cards[card.cardId] = (offlineState.cards[card.cardId] || 0) + card.qty; }),
  grantMaterials: (materials) => materials.forEach((material) => { offlineState.materials[material.materialId] = (offlineState.materials[material.materialId] || 0) + material.qty; }),
  recordRecentLoot: (summary) => offlineSummaries.push(summary),
  afterClaim: () => {},
};
assert.equal(offline.claimOfflineRewards(claimContext), true, 'Offline reward claim should run through the module.');
assert.equal(offlineState.gold, 7, 'Offline gold award changed.');
assert.equal(offlineExpGranted, 5, 'Offline experience award changed.');
assert.equal(offlineState.materials.dust, 4, 'Offline material award changed.');
assert.equal(offlineState.offlinePending.equipments[0].id, 'waiting', 'Unclaimed equipment must remain pending.');
assert.equal(offlineSummaries[0].equipments.length, 1, 'Claim summaries must not duplicate pending equipment after save normalization.');
assert.equal(offlineSummaries[0].pendingEquipment[0].id, 'waiting', 'Claim summaries must preserve pending equipment separately.');
allowWaiting = true;
assert.equal(offline.claimOfflineRewards(claimContext), true, 'Pending-only equipment should be claimable later.');
assert.equal(offlineState.gold, 7, 'Pending equipment retries must not duplicate gold awards.');
assert.equal(offlineExpGranted, 5, 'Pending equipment retries must not duplicate experience awards.');
assert.equal(offlineState.materials.dust, 4, 'Pending equipment retries must not duplicate material awards.');
assert.equal(offlineState.offlinePending.equipments.length, 0, 'Pending equipment should clear after a successful retry.');
assert.equal(offlineSummaries.length, 2, 'Each explicit offline claim should produce a viewable summary.');

console.log('Migration batch 4 tests passed: loot view normalization and offline equipment settlement routing are intact.');
