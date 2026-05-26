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
const materialDropsSource = read('src/systems/drops/materialDrops.js');
const cardDropsSource = read('src/systems/drops/cardDrops.js');
const bossDropsSource = read('src/systems/drops/bossDrops.js');
const abyssDropsSource = read('src/systems/drops/abyssDrops.js');
const lootRollSource = read('src/systems/drops/lootRoll.js');
const recentLootSource = read('src/systems/drops/recentLoot.js');
const lootModelSource = read('src/systems/drops/lootModel.js');
const offlineSource = read('src/systems/offline.js');
const devBridgeSource = read('src/dev/devBridge.js');
const settlementSource = read('src/systems/combat/settlement.js');
const bossCombatSource = read('src/systems/combat/bossCombat.js');
const damageSource = read('src/systems/combat/damage.js');
const skillsSource = read('src/systems/combat/skills.js');
const normalCombatSource = read('src/systems/combat/normalCombat.js');

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

assert.match(main, /window\.RuneFrontierDevBridge\s*=/, 'Developer diagnostics bridge must remain available (now installed via main.js).');
assert.doesNotMatch(main, /state:\s*window\.state\s*\|\|\s*\{\}/, 'Developer diagnostics must not capture an unrelated window.state snapshot.');
assert.match(main, /RuneFrontierLegacyDevContext/, 'Developer diagnostics must obtain its live legacy context.');
assert.match(main, /window\.RuneFrontierDevBridge\s*=\s*createDevBridge\(devContext\)[\s\S]*return import\('\.\/ui\/debugPanel\.js'\)/, 'Debug panel must mount after the live bridge is installed.');
assert.match(html, /src="\.\/src\/main\.js(?:\?[^"]*)?"/, 'Module compatibility entry must remain loaded.');
assert.match(html, /src="game\.js[^"]*"/, 'Classic runtime must remain loaded in this migration batch.');
assert.ok(html.indexOf('src="game.js') < html.indexOf('src="./src/main.js'), 'Classic bridge script must load before the module runtime entry.');
assert.match(main, /RUNTIME_AUTHORITY\s*=\s*'game\.js'/, 'Module entry must document the current runtime authority.');
assert.match(main, /bootstrapOwner:\s*'src\/main\.js'/, 'Module entry must own startup orchestration.');
assert.match(main, /installEquipmentRuntime\(equipmentContext\)/, 'Equipment read runtime must be installed before startup.');
assert.match(main, /window\.bootstrapLegacyRuntime\(\)/, 'Module entry must start the classic runtime through its bridge.');
assert.match(main, /started\s*===\s*false[\s\S]*window\.renderAll\(\)/, 'Late runtime installation must rerender pages after an earlier classic bootstrap.');
assert.match(main, /migrated:\s*\[[^\]]*'equipment-online-mutations'[^\]]*'online-equipment-drops'[^\]]*'online-reward-categories'[^\]]*'recent-loot-recording'[^\]]*'offline-equipment-settlement'[^\]]*'offline-reward-categories'/s, 'Reward-category migration status is incomplete.');
assert.match(main, /migrated:\s*\[[^\]]*'combat-rounds-and-damage'[^\]]*'active-skill-resolution'/s, 'Combat-round migration status is incomplete.');
assert.match(main, /bridged:\s*\[[^\]]*'offline-time-and-exp-calculation'[^\]]*'renderers'[^\]]*'vip-render'[^\]]*'codex-render'[^\]]*'shop-render'/s, 'Deferred bridge status is incomplete.');
assert.match(main, /installDropsRuntime\(dropsContext\)/, 'Drops runtime must be installed before startup.');
assert.match(main, /installOfflineRuntime\(offlineContext\)/, 'Offline runtime must be installed before startup.');
assert.match(main, /installCombatRuntime\(combatContext\)/, 'Combat settlement runtime must be installed before startup.');
assert.match(main, /installVipRuntime\(vipContext\)/, 'VIP runtime must be installed before startup.');
assert.match(main, /installCodexRuntime\(codexContext\)/, 'Codex runtime must be installed before startup.');
assert.match(main, /installShopRuntime\(shopContext\)/, 'Shop runtime must be installed before startup.');
assert.match(main, /migrated:\s*\[[^\]]*'kill-and-boss-settlement'/s, 'Combat settlement migration status is incomplete.');
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
assert.match(game, /runtime\.rollMapMaterialDrops/, 'Material drop entry points must forward to the drops runtime.');
assert.match(game, /runtime\.rollCardDropsFromTable/, 'Card drop entry points must forward to the drops runtime.');
assert.match(game, /runtime\.maybeDropBossCardFragments/, 'Boss card fragment entry points must forward to the drops runtime.');
assert.match(game, /runtime\.rollDrops/, 'Online drop orchestration must forward to the drops runtime.');
assert.match(game, /runtime\.rollZodiacSetDrops/, 'Zodiac-set drop entry points must forward to the drops runtime.');
assert.match(game, /runtime\.rollTransitionSetDrops/, 'Transition-set drop entry points must forward to the drops runtime.');
assert.match(game, /runtime\.rollMythicEquipmentDrop/, 'Mythic drop entry points must forward to the drops runtime.');
assert.match(game, /runtime\.rollMutationExtraDrops/, 'Mutation reward entry points must forward to the drops runtime.');
assert.match(game, /runtime\.normalizeLootRewards/, 'Loot summary view data must forward to the drops runtime.');
assert.match(game, /runtime\.getLatestRecentLootRewards/, 'Recent-loot viewing must forward to the drops runtime.');
assert.match(game, /RuneFrontierLegacyOfflineContext/, 'Legacy runtime must expose offline settlement dependencies.');
assert.match(game, /runtime\.claimOfflineRewards/, 'Offline claiming must forward to the offline runtime.');
assert.match(game, /runtime\.processGeneratedOfflineEquipment/, 'Offline generated equipment must forward to the offline runtime.');
assert.match(game, /if\s*\(runtime\s*&&\s*typeof runtime\.addEquipmentToInventory/, 'Offline inventory settlement must use the shared equipment runtime.');
assert.match(game, /if\s*\(!options\.offline\s*&&\s*runtime\s*&&\s*typeof runtime\.rollEquipmentTableDrops/, 'Offline drop settlement must remain on the legacy path.');
assert.match(game, /RuneFrontierLegacyCombatContext/, 'Legacy runtime must expose combat settlement dependencies.');
assert.match(game, /RuneFrontierLegacyDevContext/, 'Legacy runtime must expose live diagnostics dependencies.');
assert.match(game, /getState\(\)\s*\{\s*return state;\s*\}/, 'Diagnostics context must read the current live state.');
assert.match(game, /runtime\.settleDefeatedEnemy/, 'Kill settlement must forward to the combat runtime.');
assert.match(game, /runtime\.grantBossEssence/, 'Boss essence settlement must forward to the combat runtime.');
assert.match(game, /runtime\.tryAutoChallengeBoss/, 'Automatic Boss entry must forward to the combat runtime.');
assert.match(game, /runtime\.handleAutoBossFailure/, 'Automatic Boss failure cooldown must forward to the combat runtime.');
assert.match(game, /runtime\.updateCombat/, 'Online combat rounds must forward to the combat runtime.');
assert.match(game, /runtime\.updateMonsterAttack/, 'Monster counterattacks must forward to the combat runtime.');
assert.match(game, /runtime\.updateRecovery/, 'Recovery ticks must forward to the combat runtime.');
assert.match(game, /runtime\.rollActiveSkill/, 'Active-skill execution must forward to the combat runtime.');
assert.match(game, /runtime\.normalizeDamage/, 'Damage normalization must forward to the combat runtime.');
assert.equal((game.match(/requestAnimationFrame\(loop\);/g) || []).length, 2, 'Loop registration shape changed unexpectedly.');

const devBridgeModule = await importSource(devBridgeSource);
const priorWindow = globalThis.window;
globalThis.window = { RuneFrontierModuleStatus: { authority: 'test' } };
let liveDevState = { log: ['before'], recentLoot: [{ id: 'drop' }], lootNotifyUnread: true, lastLootViewedAt: 0 };
let maintenanceSaves = 0;
let maintenanceRenders = 0;
const devBridge = devBridgeModule.createDevBridge({
  getState: () => liveDevState,
  getMaps: () => [{ id: 'grass', name: 'Grass' }],
  getMapDropTableAlias: () => ({ grass: 'grass' }),
  getEquipmentDropTables: () => ({ grass: [] }),
  getMaterialDropTables: () => ({ grass: [] }),
  getMaterialNames: () => ({ dust: 'Dust' }),
  getMaterialDb: () => ({ dust: { id: 'dust' } }),
  getInventoryLimit: () => 42,
  getVipProgressInfo: () => ({ level: 1, remaining: 10 }),
  getPlayerCritRateCap: () => 1,
  getApiPresence: () => ({ renderAll: true }),
  save: () => { maintenanceSaves += 1; },
  renderAll: () => { maintenanceRenders += 1; },
});
assert.equal(devBridge.getSnapshot().state.log[0], 'before', 'Developer bridge must read the initial live state.');
liveDevState = { log: ['after'], recentLoot: [{ id: 'next' }], lootNotifyUnread: true, lastLootViewedAt: 0 };
assert.equal(devBridge.getSnapshot().state.log[0], 'after', 'Developer bridge must follow replaced live state objects.');
assert.equal(devBridge.getSnapshot().inventoryLimit, 42, 'Developer bridge must expose live diagnostic metadata.');
devBridge.runMaintenance('clear-log');
assert.deepEqual(liveDevState.log, [], 'Developer bridge log maintenance must affect the current live state.');
devBridge.runMaintenance('clear-recent-loot');
assert.deepEqual(liveDevState.recentLoot, [], 'Developer bridge loot maintenance must affect the current live state.');
assert.equal(liveDevState.lootNotifyUnread, false, 'Developer bridge loot maintenance must clear unread state.');
assert.equal(maintenanceSaves, 2, 'State-changing developer maintenance must save after each operation.');
assert.equal(maintenanceRenders, 2, 'State-changing developer maintenance must rerender after each operation.');
globalThis.window = priorWindow;

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

const materialDrops = await importSource(materialDropsSource);
const materialState = { currentMap: 4, materials: {} };
const materialRecent = [];
let materialSession = 0;
const materialContext = {
  getState: () => materialState,
  currentMap: () => ({ id: 'grass' }),
  currentDifficulty: () => 'abyss',
  getDifficultyConfig: () => ({ materialDrop: 1 }),
  getMaterialDropTable: () => [{ materialId: 'ore', dropRate: 1, minQty: 2, maxQty: 2 }],
  getMaterialName: (id) => ({ ore: '\u7cbe\u70bc\u77ff', socketStone: '\u6253\u5b54\u77f3', advancedSocketStone: '\u9ad8\u7ea7\u6253\u5b54\u77f3', mythicSocketStone: '\u795e\u8bdd\u6253\u5b54\u77f3', cardRemover: '\u5361\u7247\u62c6\u9664\u5668', darkGoldFragment: '\u6697\u91d1\u788e\u7247', mythicEssence: '\u795e\u8bdd\u7cbe\u7cb9' }[id] || id),
  getMaterialRarity: () => 'epic',
  getDarkGoldFragmentDropConfig: () => ({ minMapIndex: 0, rate: 1, qty: [2, 2] }),
  random: () => 0,
  randomInt: (min) => min,
  applyMaterialQuantityBonus: (qty) => qty,
  recordSessionReward: ({ materials }) => { materialSession += materials; },
  recordRecentLoot: (reward, source) => materialRecent.push({ reward, source }),
  addLog: () => {},
  computeStats: () => ({ mutationMaterialDoubleChance: 0 }),
};
assert.equal(materialDrops.rollMapMaterialDrops({ dropBonus: 0 }, {}, materialContext), 2, 'Online map material quantity changed.');
assert.equal(materialState.materials.ore, 2, 'Map material grants must update inventory once.');
assert.equal(materialDrops.maybeDropDarkGoldFragments({}, { boss: true }, materialContext), 2, 'Boss dark-gold fragment quantity changed.');
assert.equal(materialState.materials.darkGoldFragment, 2, 'Dark-gold fragments must be granted through material service.');
assert.equal(materialDrops.maybeDropMythicEssence({}, {}, materialContext), 1, 'Abyss mythic essence routing changed.');
assert.equal(materialState.materials.mythicEssence, 1, 'Mythic essence must be granted through material service.');
materialDrops.maybeDropSocketMaterials({}, { boss: true }, materialContext);
assert.equal(materialState.materials.socketStone, 1, 'Boss socket stone route changed.');
assert.equal(materialState.materials.mythicSocketStone, 1, 'Abyss mythic socket stone route changed.');
assert.equal(materialSession, 8, 'Online material session totals changed unexpectedly.');
assert.equal(materialRecent.length, 7, 'Each generated material category must record exactly one loot entry.');

const cardDrops = await importSource(cardDropsSource);
const cardState = { cards: {}, cardCodex: {}, materials: {} };
const cardRecent = [];
let cardRewards = 0;
let cardMaterialRewards = 0;
const cardContext = {
  getState: () => cardState,
  currentMap: () => ({ id: 'grass' }),
  currentDifficulty: () => 'abyss',
  getDifficultyConfig: () => ({ cardDrop: 1 }),
  getCardDropTable: () => [{ cardId: 'card-a', dropRate: 1, rarity: 'legend', bossOnly: true }],
  getCard: () => ({ id: 'card-a', name: 'Boss Card', rarity: 'legend' }),
  getMaterialName: () => '\u0042\u006f\u0073\u0073\u5361\u7247\u788e\u7247',
  random: () => 0,
  randomInt: (min) => min,
  now: () => 100,
  recordSessionReward: ({ cards = 0, materials = 0 }) => { cardRewards += cards; cardMaterialRewards += materials; },
  recordRecentLoot: (reward, source) => cardRecent.push({ reward, source }),
  addLog: () => {},
};
assert.equal(cardDrops.rollCardDropsFromTable({}, { boss: true }, cardContext), 1, 'Boss card table grant changed.');
assert.equal(cardState.cards['card-a'], 1, 'Card reward must update owned card count once.');
assert.equal(cardState.cardCodex['card-a'].obtainCount, 1, 'Card reward must update codex once.');
assert.equal(cardDrops.maybeDropBossCardFragments({}, { boss: true }, cardContext), 2, 'Abyss Boss fragment quantity changed.');
assert.equal(cardState.materials.bossCardShard, 2, 'Boss fragment grants must update material inventory once.');
assert.equal(cardRewards, 1, 'Card session count changed.');
assert.equal(cardMaterialRewards, 2, 'Boss fragment session count changed.');
assert.equal(cardRecent.length, 2, 'Card and fragment reward records must remain separate.');

const bossDrops = await importSource(bossDropsSource);
const acceptedSpecial = [];
const specialContext = {
  currentMap: () => ({ id: 'grass' }),
  currentDifficulty: () => 'normal',
  getZodiacSetIds: () => ['zodiac'],
  getTransitionSetIds: () => ['transition'],
  getEquipmentSet: (id) => ({ items: [{ id: `${id}-piece`, rarity: 'rare', level: 1 }] }),
  getZodiacSetDropRates: () => ({ normal: 1, darkGoldNormal: 0 }),
  getTransitionSetDropRates: () => ({ normal: 1 }),
  getMythicDropRates: () => ({ abyssNormal: 0 }),
  getAbyssBossMultiplier: () => ({ mythicDrop: 1, abyssSetDrop: 1 }),
  getMapLevelRange: () => ({ maxLevel: 1 }),
  random: () => 0,
  createItem: (template, _level, rarity) => ({ id: template.id, rarity }),
  addEquipmentToInventory: (item) => acceptedSpecial.push(item),
};
assert.equal(bossDrops.rollZodiacSetDrops({}, {}, {}, specialContext), 1, 'Zodiac-set reward routing changed.');
assert.equal(bossDrops.rollTransitionSetDrops({}, {}, {}, specialContext), 1, 'Transition-set reward routing changed.');
assert.equal(acceptedSpecial[0].rarity, 'legend', 'Normal zodiac-set base rarity changed.');
assert.equal(acceptedSpecial[1].id, 'transition-piece', 'Transition-set item must enter equipment acceptance.');

const abyssStandaloneSource = abyssDropsSource
  .replace("import { grantMutationMaterial } from './materialDrops.js';", 'const grantMutationMaterial = () => 0;');
const abyssDrops = await importSource(abyssStandaloneSource);
const abyssAccepted = [];
const abyssContext = {
  currentDifficulty: () => 'abyss',
  getMythicDropRates: () => ({ abyssNormal: 1 }),
  getAbyssBossMultiplier: () => ({ mythicDrop: 1 }),
  random: () => 0,
  createMutationEquipment: (rarity) => ({ id: `mutation-${rarity}`, rarity }),
  addEquipmentToInventory: (item) => abyssAccepted.push(item),
  addLogHtml: () => {},
  renderItemName: (item) => item.id,
  getDifficultyConfig: () => ({ materialDrop: 1 }),
  getMutationExtraDrops: () => ({ materialBonusRate: 0, rareMaterialBonusRate: 0, highRarityEquipmentRate: 1, darkGoldEquipmentRate: 0 }),
  getMaxEquipmentDrops: () => 1,
  isBossEncounter: () => false,
  currentMapIndex: () => 3,
};
assert.equal(abyssDrops.rollMythicEquipmentDrop({}, {}, {}, abyssContext), 1, 'Mythic equipment reward routing changed.');
assert.equal(abyssDrops.rollMutationExtraDrops({ mutation: { highRarityEquipmentBonus: 1, rareMaterialBonus: 1 } }, {}, 0, abyssContext), 1, 'Mutation equipment reward routing changed.');
assert.deepEqual(abyssAccepted.map((item) => item.rarity), ['mythic', 'legend'], 'Abyss reward rarities changed.');
assert.match(lootRollSource, /rollEquipmentTableDrops[\s\S]*rollZodiacSetDrops[\s\S]*rollTransitionSetDrops[\s\S]*rollMythicEquipmentDrop[\s\S]*rollMapMaterialDrops[\s\S]*maybeDropMythicEssence[\s\S]*maybeDropDarkGoldFragments[\s\S]*maybeDropSocketMaterials[\s\S]*rollCardDropsFromTable[\s\S]*maybeDropBossCardFragments/, 'Online reward-category ordering changed.');

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
assert.match(offlineSource, /rollOfflineTransitionSetDrops,/, 'Offline transition-set routing must be exported.');
assert.match(offlineSource, /rollOfflineMutationExtraDrops,/, 'Offline mutation routing must be exported.');
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

const offlineCategoryRewards = { equipments: [], cards: [], materials: [] };
const offlineCategoryContext = {
  getState: () => ({ inventory: [] }),
  currentDifficulty: () => 'normal',
  getDifficultyConfig: () => ({ cardDrop: 1, materialDrop: 1 }),
  getCardDropTable: () => [{ cardId: 'offline-card', dropRate: 1, rarity: 'rare' }],
  getCard: () => ({ id: 'offline-card', name: 'Offline Card' }),
  getMaterialDropTable: () => [{ materialId: 'ore', dropRate: 1, minQty: 1, maxQty: 1 }],
  getMaterialName: (id) => id,
  getMaterialRarity: () => 'normal',
  getZodiacSetIds: () => ['offline-zodiac'],
  getTransitionSetIds: () => ['offline-transition'],
  getEquipmentSet: (id) => ({ items: [{ id: `${id}-piece`, rarity: 'rare', level: 1 }] }),
  getZodiacSetDropRates: () => ({ normal: 1, darkGoldNormal: 0 }),
  getTransitionSetDropRates: () => ({ normal: 1 }),
  getMythicDropRates: () => ({ abyssNormal: 0 }),
  getMapLevelRange: () => ({ maxLevel: 1 }),
  getOfflineEquipmentDropRateMultiplier: () => 1,
  getOfflineMaxKills: () => 1,
  getInventoryLimit: () => 5,
  random: () => 0,
  randomInt: (min) => min,
  applyMaterialQuantityBonus: (qty) => qty,
  createItem: (template, _level, rarity) => ({ id: template.id, rarity }),
  getEquipmentRuntime: () => ({ shouldAutoSalvage: () => false }),
  canOfflineFullSalvage: () => false,
};
offline.rollOfflineCardDrops(offlineCategoryRewards, {}, { id: 'grass' }, 0, 1, offlineCategoryContext);
offline.rollOfflineMaterialDrops(offlineCategoryRewards, {}, { id: 'grass' }, 1, offlineCategoryContext);
offline.rollOfflineZodiacSetDrops(offlineCategoryRewards, {}, { id: 'grass' }, 1, 0, offlineCategoryContext);
offline.rollOfflineTransitionSetDrops(offlineCategoryRewards, {}, { id: 'grass' }, 1, offlineCategoryContext);
assert.equal(offlineCategoryRewards.cards[0].cardId, 'offline-card', 'Offline card reward routing changed.');
assert.equal(offlineCategoryRewards.materials[0].materialId, 'ore', 'Offline material reward routing changed.');
assert.deepEqual(offlineCategoryRewards.equipments.map((item) => item.id), ['offline-zodiac-piece', 'offline-transition-piece'], 'Offline special equipment candidates changed.');

const settlement = await importSource(settlementSource);
const killState = {
  hero: { jobId: 'novice' },
  gold: 0,
  totalKills: 0,
  areaKills: 0,
  enemyBoss: false,
  currentDifficulty: 'normal',
  equipmentPityKills: 0,
  monsterCodex: {},
  materials: {},
  vip: {},
  mapDifficultyProgress: {},
};
const killCalls = { drop: 0, next: 0, spawn: 0, daily: 0, quest: 0 };
const baseCombatContext = {
  getState: () => killState,
  currentMap: () => ({ id: 'grass', name: 'Grass' }),
  currentMonsterStats: () => ({ id: 'poring', gold: 10, exp: 5, jobExp: 3 }),
  computeStats: () => ({ goldMultiplier: 1, monsterGoldMultiplier: 1, baseExpMultiplier: 1, jobExpMultiplier: 1 }),
  updateActiveEnemyHpInGroup: () => {},
  presentKillRewards: () => {},
  gainExp: () => {},
  recordSessionReward: () => {},
  recordRecentLoot: () => {},
  updateDailyGoalProgress: () => { killCalls.daily += 1; },
  bossRequirement: () => 10,
  hasLivingEncounterMembers: () => true,
  isBossChallengeReady: () => false,
  getAutoBossEnabled: () => false,
  rollDrops: () => { killCalls.drop += 1; return 1; },
  rollMutationExtraDrops: () => 0,
  grantPassiveSkillKillExp: () => {},
  updateQuestProgress: () => { killCalls.quest += 1; },
  explorationGainForKill: () => 1,
  gainMapExploration: () => {},
  trackKillAchievements: () => {},
  getEquipmentPityThreshold: () => 5,
  rollGuaranteedEquipmentDrop: () => 0,
  challengeBoss: () => {},
  syncActiveEnemyFromGroup: () => { killCalls.next += 1; },
  spawnEnemy: () => { killCalls.spawn += 1; },
  render: () => {},
};
const regularKill = settlement.settleDefeatedEnemy({}, baseCombatContext);
assert.equal(regularKill.nextAction, 'nextEncounter', 'Living encounter members must advance instead of respawning.');
assert.equal(killState.gold, 10, 'Regular kill gold settlement changed.');
assert.equal(killState.areaKills, 1, 'Regular kill Boss gauge progress changed.');
assert.equal(killCalls.drop, 1, 'Regular kill must invoke drops exactly once.');
assert.equal(killCalls.next, 1, 'Regular encounter progression changed.');
assert.equal(killCalls.spawn, 0, 'Regular encounter must not respawn while members remain.');

const bossState = {
  hero: { jobId: 'knight' },
  gold: 0,
  totalKills: 0,
  areaKills: 10,
  enemyBoss: true,
  currentDifficulty: 'normal',
  currentMap: 0,
  monsterCodex: {},
  materials: {},
  vip: {},
  mapDifficultyProgress: {},
  bestMap: 0,
};
let bossVipExp = 0;
const bossContext = {
  ...baseCombatContext,
  getState: () => bossState,
  currentMap: () => ({ id: 'grass', name: 'Grass' }),
  currentMapIndex: () => 0,
  getMaps: () => [{ id: 'grass', name: 'Grass' }, { id: 'forest', name: 'Forest' }],
  getBossEssenceId: () => 'grassEssence',
  getMaterialName: () => 'Grass Essence',
  getDifficultyLabel: () => 'Normal',
  applyMaterialQuantityBonus: (qty) => qty,
  getAutoBossEnabled: () => false,
  gainVipExp: (amount) => { bossVipExp += amount; },
  hasLivingEncounterMembers: () => false,
  rollDrops: () => 0,
  spawnEnemy: () => {},
};
const firstBoss = settlement.settleDefeatedEnemy({
  map: { id: 'grass', name: 'Grass' },
  monster: { id: 'boss', gold: 10, exp: 5, jobExp: 3 },
  isBoss: true,
  difficulty: 'normal',
}, bossContext);
assert.equal(firstBoss.firstBossClear, true, 'First Boss clear reward must be recorded once.');
assert.equal(bossState.materials.grassEssence, 1, 'Boss essence quantity changed.');
assert.equal(bossState.areaKills, 0, 'Boss victory must reset Boss gauge.');
assert.equal(bossState.mapDifficultyProgress.grass.hard.unlocked, true, 'Normal Boss victory must unlock hard difficulty.');
assert.equal(bossState.mapDifficultyProgress.forest.normal.unlocked, true, 'Normal Boss victory must unlock the next map.');
assert.equal(bossVipExp, 100, 'First Boss honor reward changed.');
settlement.settleBossVictory({ map: { id: 'grass', name: 'Grass' }, difficulty: 'normal' }, bossContext);
assert.equal(bossVipExp, 100, 'First Boss honor reward must not be issued twice.');

const bossCombat = await importSource(bossCombatSource);
const bossEntryState = {
  areaKills: 5,
  enemyBoss: false,
  paused: false,
  hero: { currentHp: 100 },
  settings: { autoBossCooldownUntil: 0 },
};
let bossSpawned = 0;
const bossLogs = [];
const bossEntryContext = {
  getState: () => bossEntryState,
  bossRequirement: () => 5,
  computeStats: () => ({ maxHp: 100 }),
  getAutoBossEnabled: () => true,
  ensureSettings: () => bossEntryState.settings,
  now: () => 1000,
  getAutoBossFailCooldownMs: () => 120000,
  currentMap: () => ({ id: 'grass' }),
  bossDisplayName: () => 'Grass Boss',
  showToast: () => {},
  spawnEnemy: () => { bossSpawned += 1; bossEntryState.enemyBoss = true; },
  addLog: (line) => bossLogs.push(line),
  render: () => {},
};
assert.equal(bossCombat.isBossChallengeReady(bossEntryContext), true, 'Boss readiness must use the filled gauge.');
assert.equal(bossCombat.tryAutoChallengeBoss('tick', { maxHp: 100 }, bossEntryContext), true, 'Ready automatic Boss challenge must start.');
assert.equal(bossSpawned, 1, 'Automatic Boss challenge must spawn once.');
assert.equal(bossCombat.getAutoBossStatusText({ maxHp: 100 }, bossEntryContext), '\u6b63\u5728\u6311\u6218', 'Active Boss status text changed.');
bossEntryState.enemyBoss = false;
bossEntryState.paused = true;
assert.equal(bossCombat.tryAutoChallengeBoss('tick', { maxHp: 100 }, bossEntryContext), false, 'Paused combat must not auto-start Boss.');
bossEntryState.paused = false;
bossEntryState.hero.currentHp = 20;
assert.equal(bossCombat.tryAutoChallengeBoss('tick', { maxHp: 100 }, bossEntryContext), false, 'Low health must not auto-start Boss.');
bossEntryState.hero.currentHp = 100;
bossEntryState.settings.autoBossCooldownUntil = 5000;
assert.equal(bossCombat.tryAutoChallengeBoss('tick', { maxHp: 100 }, bossEntryContext), false, 'Automatic Boss cooldown must be enforced.');
assert.equal(bossCombat.challengeBoss({ auto: false }, bossEntryContext), true, 'Manual Boss challenge must ignore automatic cooldown.');
bossEntryState.enemyBoss = true;
assert.equal(bossCombat.handleAutoBossFailure(bossEntryContext), true, 'Automatic Boss defeat must set cooldown.');
assert.equal(bossEntryState.settings.autoBossCooldownUntil, 121000, 'Automatic Boss defeat cooldown duration changed.');
assert.equal(bossLogs.length, 3, 'Boss state routing must write one start log per challenge and one failure log.');

const damageStandaloneSource = damageSource
  .replace("export { calculatePower } from '../equipment/itemScore.js';", 'export const calculatePower = () => 0;');
const damage = await importSource(damageStandaloneSource);
damage.configureDamageContext({
  getState: () => ({
    hero: { baseLevel: 10 },
    enemyBoss: true,
    currentDifficulty: 'abyss',
    enemyHp: 10,
    enemyMaxHp: 100,
  }),
});
assert.equal(damage.normalizeDamage(5.999), 5, 'Damage normalization changed.');
assert.equal(damage.normalizeDamage(Number.NaN), 1, 'Invalid damage fallback changed.');
assert.equal(
  damage.getTargetDamageBonus({
    monsterDamageBonus: 0.1,
    bossDamageBonus: 0.2,
    abyssBossDamageBonus: 0.1,
    abyssDamageBonus: 0.3,
    abyssExecuteDamageBonus: 0.2,
    finalDamageBonus: 0.05,
    ignoreDefensePct: 0.1,
  }, { monster: { type: 'boss', level: 10 }, isBoss: true, difficulty: 'abyss', enemyHp: 10, enemyMaxHp: 100 }),
  1.05,
  'Target-specific damage bonus routing changed.',
);
const regularHit = damage.calculatePlayerBasicHit({ stats: { dps: 100 }, attackInterval: 1, targetBonus: 0.1, monsterGuard: 0.2, isCrit: false });
const criticalHit = damage.calculatePlayerBasicHit({ stats: { dps: 100, critDamageBonus: 0.15 }, attackInterval: 1, targetBonus: 0.1, monsterGuard: 0.2, isCrit: true });
assert.equal(regularHit.finalDamage, 88, 'Player basic-hit formula changed.');
assert.equal(criticalHit.finalDamage, 176, 'Player critical-hit formula changed.');
const normalMonsterHit = damage.calculateMonsterHit({ stats: { defense: 20 }, monster: { attack: 100 }, hpRatio: 1, livingCount: 1, isCrit: false });
const criticalMonsterHit = damage.calculateMonsterHit({ stats: { defense: 20 }, monster: { attack: 100, critDamage: 1 }, hpRatio: 1, livingCount: 1, isCrit: true });
assert.ok(criticalMonsterHit.damage > normalMonsterHit.damage, 'Monster critical threat must remain stronger than a normal hit.');

const skillsStandaloneSource = skillsSource.replace(
  "import { getTargetDamageBonus, normalizeDamage } from './damage.js';",
  "const getTargetDamageBonus = () => 0; const normalizeDamage = (value) => Math.max(1, Math.floor(value));",
);
const skills = await importSource(skillsStandaloneSource);
const skillState = { currentDifficulty: 'normal', currentMap: 5, enemyBoss: false, enemyHp: 1000, hero: { currentHp: 50, jobLevel: 10 } };
let skillDamageShown = 0;
let skillExpEvents = 0;
skills.configureSkillsContext({
  getState: () => skillState,
  random: () => 0,
  currentMonsterStats: () => ({ type: 'normal', damageReduction: 0 }),
  getUnlockedSkills: () => [{ name: 'Strike', active: { chance: 1, stat: 'atk', multiplier: 2 } }],
  getSkillGrowthEntry: () => ({ specialization: '' }),
  getSkillMilestoneBonuses: () => ({}),
  getSkillLevelMultiplier: () => 1,
  showDamageNumber: (_target, amount) => { skillDamageShown = amount; },
  gainSkillExp: () => { skillExpEvents += 1; },
});
const skillResult = skills.resolveActiveSkillCast({ dt: 1, stats: { atkPower: 100, crit: 0, maxHp: 100 } });
assert.equal(skillResult.cast, true, 'Active-skill cast routing changed.');
assert.equal(skillDamageShown, 248, 'Active-skill damage formula changed.');
assert.equal(skillState.enemyHp, 752, 'Active-skill damage must be applied once.');
assert.equal(skillExpEvents, 1, 'Active-skill cast experience must be granted once without a finishing blow.');

const normalStandaloneSource = normalCombatSource
  .replace(
    "import { calculateMonsterHit, calculatePlayerBasicHit, getTargetDamageBonus, normalizeDamage } from './damage.js';",
    "const getTargetDamageBonus = () => 0; const normalizeDamage = (value) => Math.max(1, Math.floor(value)); const calculatePlayerBasicHit = () => ({ finalDamage: 10 }); const calculateMonsterHit = () => ({ damage: 5 });",
  )
  .replace("import { resolveActiveSkillCast } from './skills.js';", 'const resolveActiveSkillCast = () => ({ cast: false });');
const normalCombat = await importSource(normalStandaloneSource);
const roundState = { enemyHp: 10, enemyMaxHp: 10, hero: { currentHp: 100 }, playerAttackTimer: 0, enemyAttackTimer: 0, currentMap: 0 };
let settledRounds = 0;
normalCombat.configureNormalCombatContext({
  getState: () => roundState,
  computeStats: () => ({ attackSpeed: 1, crit: 0, dps: 1, maxHp: 100 }),
  currentMonsterStats: () => ({ damageReduction: 0 }),
  getPlayerCritRateCap: () => 1,
  random: () => 0.9,
  tryAutoChallengeBoss: () => false,
  applySplashDamageToEncounter: () => {},
  defeatEnemy: () => { settledRounds += 1; },
});
normalCombat.updateCombat(1);
assert.equal(roundState.enemyHp, 0, 'Online combat round must apply the active-target hit once.');
assert.equal(settledRounds, 1, 'Online combat round must settle a defeated target once.');

console.log('Migration batch 7 tests passed: combat-round routing and existing reward settlement are intact.');
