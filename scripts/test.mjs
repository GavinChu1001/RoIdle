import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createContext, runInContext } from 'node:vm';

const root = new URL('../', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const read = (file) => readFileSync(join(root, file), 'utf8');
const importSource = async (source) => import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
const game = read('game.js');
const data = read('data.js');
const tools = read('tools.js');
const html = read('index.html');
const styles = read('styles.css');
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
const skillMechanicsSource = read('src/systems/combat/skillMechanics.js');
const normalCombatSource = read('src/systems/combat/normalCombat.js');
const encounterSource = read('src/systems/combat/encounter.js');
const taskPageSource = read('src/ui/taskPage.js');
const cardPageSource = read('src/ui/cardPage.js');
const onboardingSource = read('src/systems/onboarding.js');
const onboardingGuideSource = read('src/ui/onboardingGuide.js');

const classicDataContext = { console };
createContext(classicDataContext);
runInContext(tools, classicDataContext, { filename: 'tools.js' });
assert.doesNotThrow(() => runInContext(data, classicDataContext, { filename: 'data.js' }), 'Classic data script must initialize before game.js loads.');
assert.ok(classicDataContext.v3JobSkills && typeof classicDataContext.v3JobSkills === 'object', 'V4 skill table must initialize from data.js.');
assert.equal(Object.keys(classicDataContext.v3SkillAwakenings || {}).length, 6, 'Six V4 awakening configurations must remain available.');
assert.equal(classicDataContext.getV3CombatSkills('runeKnight').length, 9, 'Rune Knight must inherit Swordman and Knight V4 skills.');
assert.ok(classicDataContext.getV3CombatSkills('mechanic').some((entry) => entry.name === '大地之击'), 'Mechanic must inherit Blacksmith passive mechanics.');
const rangerSkills = classicDataContext.getV3CombatSkills('ranger');
assert.equal(rangerSkills.find((entry) => entry.name === '狼突袭').mechanism.baseMultiplier, 2.4, 'Wolf Assault must retain its unmarked base multiplier.');
const assassinSkills = classicDataContext.getV3CombatSkills('assassin');
assert.equal(assassinSkills.find((entry) => entry.name === '毒性扩散').mechanism.poisonStackAdd, 1, 'Poison Spread must add poison stacks.');
assert.equal(classicDataContext.getV3CombatSkills('priest').find((entry) => entry.name === '信仰守护').mechanism.extra.cleanseDebuff, undefined, 'Faith Guard must not advertise an unimplemented cleanse.');
assert.equal(classicDataContext.getV3CombatSkills('blacksmith').find((entry) => entry.name === '武器精炼').mechanism.goldCost, undefined, 'Weapon Refinement must not invent an unspecified gold cost.');

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
assert.match(html, /id="enemyStatusBar"/, 'Adventure battle UI must expose the enemy status strip.');
assert.match(html, /id="skillCastBanner"/, 'Adventure battle UI must expose a visible skill cast banner.');
assert.match(html, /class="page-tabs[^"]*ro-main-tabs/, 'main tabs should opt into RO navigation styling');
assert.match(html, /class="adventure-grid[^"]*ro-adventure-workspace/, 'Adventure workspace class should exist');
assert.match(html, /class="stage-panel[^"]*ro-surface-card[^"]*ro-stage-card/, 'stage panel should use RO surface styling');
assert.match(html, /id="bossButton"[^>]*class="[^"]*ro-wood-button/, 'Boss action should use the wooden primary button');
assert.match(html, /class="summary-panel[^"]*ro-command-sidebar/, 'sidebar should use compact command styling');
for (const id of [
  "pauseButton", "sceneCanvas", "playerHpBar", "enemyHpBar", "enemyStatusBar",
  "skillCastBanner", "skillBarV3", "autoBossToggle", "claimButton",
  "offlineViewButton", "combatSidebar", "questList", "townTips"
]) {
  assert.match(html, new RegExp(`id="${id}"`), `${id} must remain available to the active runtime`);
}
assert.match(game, /bar\.dataset\.skillComposition/, 'The RO skill bar must update existing nodes instead of rebuilding on every fast render.');
assert.match(game, /renderSkillCastBanner\(\)/, 'Skill casts must update their visible combat banner.');
assert.match(styles, /\.skill-bar-icon\.cooldown\.casting/, 'Casting feedback must remain visible when a skill immediately enters cooldown.');
assert.match(styles, /\.scene-wrap\.skill-cast-active::after/, 'Skill casts must create a visible battle-scene impact pulse.');
assert.match(styles, /--ro-parchment:/, 'RO parchment token should exist');
assert.match(styles, /--ro-wood-top:/, 'RO wood button token should exist');
assert.match(styles, /\.ro-surface-card\s*\{/, 'RO surface card primitive should exist');
assert.match(styles, /\.ro-wood-button\s*\{/, 'RO wood action button primitive should exist');
assert.match(styles, /\.ro-light-control\s*\{/, 'RO light control primitive should exist');
assert.match(styles, /\.ro-main-tabs\s*\{/, 'RO main tab styling should exist');
assert.match(styles, /\.ro-adventure-workspace\s*\{/, 'RO Adventure workspace layout should exist');
assert.match(styles, /\.ro-stage-card\s*\{/, 'RO stage card styling should exist');
assert.match(styles, /\.ro-command-sidebar\s*\{/, 'RO sidebar styling should exist');
assert.match(styles, /\.ro-boss-action\s*\{/, 'Boss action hierarchy should exist');
assert.match(
  styles,
  /@media\s*\(max-width:\s*820px\)[\s\S]*\.ro-main-tabs/,
  'mobile RO tabs should be adjusted under the existing small-screen breakpoint'
);
assert.match(
  styles,
  /@media\s*\(max-width:\s*820px\)[\s\S]*\.ro-command-sidebar/,
  'mobile command sidebar should be stacked safely'
);
assert.match(
  styles,
  /@media\s*\(max-width:\s*820px\)[\s\S]*\.ro-boss-action/,
  'mobile Boss action should fit the control row'
);
assert.match(encounterSource, /resetEnemySkillStatuses\(state,\s*'spawn'\)/, 'Fresh encounters must clear target-bound skill statuses.');
assert.match(encounterSource, /resetEnemySkillStatuses\(state,\s*'target-change'\)/, 'Encounter member changes must clear target-bound skill statuses.');
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
assert.match(game, /function\s+applySkillSplashDamageToEncounter\s*\(/, 'Encounter skill splash bridge must be defined.');
assert.match(game, /applySkillSplashDamageToEncounter,/, 'Encounter skill splash bridge must be injected into combat runtime.');
assert.match(game, /getV3CombatSkills,/, 'Combat runtime must receive the inherited V4 skill route resolver.');
assert.match(main, /installVipRuntime\(vipContext\)/, 'VIP runtime must be installed before startup.');
assert.match(main, /installCodexRuntime\(codexContext\)/, 'Codex runtime must be installed before startup.');
assert.match(main, /installShopRuntime\(shopContext\)/, 'Shop runtime must be installed before startup.');
assert.match(main, /installOnboardingRuntime\(\)/, 'Onboarding runtime must be installed before startup.');
assert.match(game, /onboarding:\s*defaultOnboardingState\(\)/, 'Default state must include onboarding.');
assert.match(game, /onboarding:\s*normalizeOnboarding\(saved\.onboarding\s*\|\|\s*base\.onboarding\)/, 'Saved state merge must normalize onboarding.');
assert.match(game, /state\.onboarding\s*=\s*normalizeOnboarding\(state\.onboarding\)/, 'Sanitize pass must keep onboarding normalized.');
assert.match(onboardingGuideSource, /renderOnboardingTaskSection/, 'Onboarding UI must expose a task-page section renderer.');
assert.match(main, /installOnboardingGuideRuntime\(onboardingGuideContext\)/, 'Onboarding guide render runtime must be installed before startup.');
assert.match(taskPageSource, /renderOnboardingTaskSection/, 'Task page must render the beginner goal section.');
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
assert.match(game, /showSalvageResult\(title,\s*count,\s*rewards\)/, 'Dismantle result dialog must receive title, count, and material rewards.');
assert.match(game, /\n\s*renderAll,\s*\n\s*render:\s*renderAll,/, 'Equipment mutations must be able to rerender after state changes.');
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
assert.match(game, /const FAST_RENDER_INTERVAL_MS\s*=\s*100/, 'Fast HUD rendering must remain throttled.');
assert.match(game, /const PASSIVE_PAGE_REFRESH_INTERVAL_MS\s*=\s*2000/, 'Background combat updates must not continuously rebuild heavy pages.');
assert.match(game, /const SCENE_RENDER_INTERVAL_MS\s*=\s*33/, 'Visible battle scene rendering must remain frame-capped.');
assert.match(game, /function renderActivePage\s*\(/, 'Full renders must target the visible page only.');
assert.match(game, /render:\s*renderCombatSettlementUi/, 'Combat settlement must use the lightweight UI refresh path.');
assert.match(game, /function updateOnlinePlaytime\s*\(dt\)/, 'Online-time rewards must not depend on rendering frequency.');
assert.match(game, /estimateGoldPerSecond\(stats\)/, 'Fast HUD updates must reuse the already computed stat snapshot.');
assert.match(game, /activePage\s*===\s*"adventure"[\s\S]*drawScene\(now\s*\/\s*1000\)/, 'Hidden pages must not continue drawing the battle canvas.');
assert.match(game, /runtime\.normalizeDamage/, 'Damage normalization must forward to the combat runtime.');
assert.equal((game.match(/requestAnimationFrame\(loop\);/g) || []).length, 2, 'Loop registration shape changed unexpectedly.');

const onboardingModule = await importSource(onboardingSource);
assert.deepEqual(onboardingModule.defaultOnboardingState(), {
  version: 1,
  tutorialCompleted: false,
  skipped: false,
  currentStepId: 'welcome',
  completedStepIds: [],
  dismissedHintIds: [],
}, 'Default onboarding state changed.');

assert.deepEqual(
  onboardingModule.normalizeOnboarding({ skipped: true, completedStepIds: ['welcome', 'welcome', 7] }),
  {
    version: 1,
    tutorialCompleted: false,
    skipped: true,
    currentStepId: 'welcome',
    completedStepIds: ['welcome'],
    dismissedHintIds: [],
  },
  'Onboarding normalization must preserve valid flags and dedupe valid ids.'
);

const freshGoal = onboardingModule.getCurrentOnboardingGoal({ totalKills: 0, areaKills: 0, quests: { completed: [] }, inventory: [], equipped: {} });
assert.equal(freshGoal.id, 'start_adventure', 'Fresh saves should start with the adventure goal.');

const rewardGoal = onboardingModule.getCurrentOnboardingGoal({
  totalKills: 3,
  areaKills: 3,
  quests: { active: [{ id: 'main_1_grass', claimed: false }], completed: [] },
  inventory: [],
  equipped: {},
});
assert.equal(rewardGoal.id, 'claim_first_reward', 'After first kills, the next onboarding goal should be claiming a reward.');

const grownGoal = onboardingModule.getCurrentOnboardingGoal({
  totalKills: 35,
  areaKills: 35,
  quests: { completed: ['main_1_grass'] },
  inventory: [{ id: 'starter', refine: 1 }],
  equipped: { weapon: 'starter' },
});
assert.equal(grownGoal.id, 'see_boss_goal', 'After one growth action, the guide should point back to Boss progress.');

assert.equal(
  onboardingModule.getActiveTutorialStep({ onboarding: { skipped: true }, totalKills: 0 }),
  null,
  'Skipping tutorial should hide strong tutorial hints.'
);

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
mutationState.inventory = [{ id: 'manual', rarity: 'normal', level: 1 }];
mutationState.autoSalvage.enabled = false;
let manualSalvageDialog = null;
let manualSalvageRenders = 0;
let manualSalvageSaves = 0;
const manualMutationContext = {
  ...mutationContext,
  addLog: () => {},
  materialText: () => 'Dust x1',
  getDisplayItemName: () => 'Blade',
  showSalvageResult: (...args) => { manualSalvageDialog = args; },
  renderAll: () => { manualSalvageRenders += 1; },
  save: () => { manualSalvageSaves += 1; },
};
const manualSalvage = dismantle.salvageItem('manual', {}, manualMutationContext);
assert.equal(manualSalvage.ok, true, 'Manual dismantle must complete.');
assert.equal(mutationState.inventory.length, 0, 'Manual dismantle must remove the equipment.');
assert.equal(mutationState.materials.dust, 2, 'Manual dismantle must add its material rewards.');
assert.deepEqual(manualSalvageDialog, ['\u5206\u89e3\u5b8c\u6210', 1, { dust: 1 }], 'Manual dismantle dialog must receive its reward summary.');
assert.equal(manualSalvageRenders, 1, 'Manual dismantle must immediately rerender resource and equipment displays.');
assert.equal(manualSalvageSaves, 1, 'Manual dismantle must save its reward changes.');

const taskPage = await importSource(taskPageSource);
const cardPage = await importSource(cardPageSource);
const priorRenderWindow = globalThis.window;
globalThis.window = { RuneFrontierRenderRuntime: {}, questRewardText: () => 'Reward' };
const taskRuntime = taskPage.installTaskRenderRuntime({
  escapeHtml: String,
  formatNumber: String,
  questRewardText: () => 'Reward',
});
const taskHtml = taskRuntime.renderTaskCard({
  id: 'main-quest',
  title: 'Quest',
  description: 'Correct description',
  currentCount: 2,
  requiredCount: 5,
  rewards: { gold: 100 },
  completed: false,
  claimed: false,
});
assert.match(taskHtml, /Correct description/, 'Task cards must use the current description field.');
assert.match(taskHtml, /2 \/ 5/, 'Task cards must use currentCount and requiredCount.');
assert.doesNotMatch(taskHtml, /undefined/, 'Task cards must not print missing legacy field values.');
let cardHtml = '';
globalThis.window = { RuneFrontierRenderRuntime: {} };
const cardRuntime = cardPage.installCardRenderRuntime({
  getState: () => ({ cards: { slime: 1, baphomet: 1 }, awakenedCards: {}, cardFavorites: {}, materials: {} }),
  getEls: () => ({ cardList: { set innerHTML(value) { cardHtml = value; } } }),
  escapeHtml: String,
  formatNumber: String,
  percent: (value) => `${Number(value || 0) * 100}%`,
  getCardPool: () => [{ id: 'slime', name: 'Slime', cardType: 'monster' }, { id: 'baphomet', name: 'Baphomet', cardType: 'boss' }],
  getBossCardPool: () => [],
  getCardType: (card) => card.cardType,
  cardTypeLabel: (type) => type,
  cardEffectText: () => 'ATK +1',
  cardActivationText: (card) => card.cardType === 'boss' ? 'Socket active' : 'Owned active',
  awakenedCardEffects: () => ({ attr: 5, drop: 0.01, monsterDamage: 0.02 }),
  cardUsageText: () => 'Build use',
  getAwakenCardCost: () => 100,
});
cardRuntime.renderCards();
assert.match(cardHtml, /ATK \+1/, 'Card cards must render their configured effects.');
assert.match(cardHtml, /Owned active/, 'Ordinary cards must state their owned activation rule.');
assert.match(cardHtml, /Socket active/, 'Boss cards must state their socket activation rule.');
assert.match(cardHtml, /Build use/, 'Card cards must render their intended use.');
globalThis.window = priorRenderWindow;

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
const hardDropContext = {
  ...dropContext,
  currentDifficulty: () => 'hard',
  getDifficultyDropLevelBonus: (difficulty) => difficulty === 'hard' ? ({ min: 20, max: 35 }) : ({ min: 0, max: 0 }),
};
assert.equal(equipmentDrops.resolveEquipmentDropLevel({ baseLevel: 10, difficulty: 'hard', source: 'transition-set' }, hardDropContext), 30, 'Hard special equipment must receive the configured minimum drop-level bonus.');
const abyssDropContext = {
  ...dropContext,
  currentDifficulty: () => 'abyss',
  getDifficultyDropLevelBonus: () => ({ min: 45, max: 70 }),
  clampLevel: (value) => Math.min(100, value),
  randomInt: (_min, max) => max,
};
assert.equal(equipmentDrops.resolveEquipmentDropLevel({ baseLevel: 40, difficulty: 'abyss', source: 'zodiac-set' }, abyssDropContext), 100, 'Abyss equipment drop levels must remain capped.');

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

const equipmentDropsModuleUrl = `data:text/javascript;base64,${Buffer.from(equipmentDropsSource).toString('base64')}`;
const bossDrops = await importSource(bossDropsSource.replace("'./equipmentDrops.js'", `'${equipmentDropsModuleUrl}'`));
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
  createItem: (template, level, rarity) => ({ id: template.id, level, rarity }),
  addEquipmentToInventory: (item) => acceptedSpecial.push(item),
};
assert.equal(bossDrops.rollZodiacSetDrops({}, {}, {}, specialContext), 1, 'Zodiac-set reward routing changed.');
assert.equal(bossDrops.rollTransitionSetDrops({}, {}, {}, specialContext), 1, 'Transition-set reward routing changed.');
assert.equal(acceptedSpecial[0].rarity, 'legend', 'Normal zodiac-set base rarity changed.');
assert.equal(acceptedSpecial[1].id, 'transition-piece', 'Transition-set item must enter equipment acceptance.');
const acceptedHardSpecial = [];
const hardSpecialContext = {
  ...specialContext,
  currentDifficulty: () => 'hard',
  getZodiacSetDropRates: () => ({ hard: 1, darkGoldNormal: 0 }),
  getTransitionSetDropRates: () => ({ hard: 1 }),
  getDifficultyDropLevelBonus: () => ({ min: 20, max: 35 }),
  clampLevel: (value) => value,
  randomInt: (min) => min,
  createItem: (template, level, rarity) => ({ id: template.id, level, rarity }),
  addEquipmentToInventory: (item) => acceptedHardSpecial.push(item),
};
assert.equal(bossDrops.rollZodiacSetDrops({ level: 10 }, {}, {}, hardSpecialContext), 1, 'Hard zodiac-set routing changed.');
assert.equal(bossDrops.rollTransitionSetDrops({ level: 10 }, {}, {}, hardSpecialContext), 1, 'Hard transition-set routing changed.');
assert.deepEqual(acceptedHardSpecial.map((item) => item.level), [30, 30], 'Hard special equipment must not retain low monster display levels.');

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
assert.match(game, /RuneFrontierLegacyOfflineContext[\s\S]*rollEquipmentDropsFromTable/, 'Offline LegacyContext must provide equipment drop table routing.');
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
  resolveEquipmentDropLevel: ({ baseLevel }) => baseLevel,
  createItem: (template, level, rarity) => ({ id: template.id, level, rarity }),
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
const offlineHardRewards = { equipments: [], cards: [], materials: [] };
const offlineHardContext = {
  ...offlineCategoryContext,
  currentDifficulty: () => 'hard',
  getZodiacSetDropRates: () => ({ hard: 1, darkGoldNormal: 0 }),
  getTransitionSetDropRates: () => ({ hard: 1 }),
  getEquipmentSet: (id) => ({ items: [{ id: `${id}-piece`, rarity: 'rare', level: 8 }] }),
  resolveEquipmentDropLevel: ({ baseLevel }) => baseLevel + 20,
};
offline.rollOfflineZodiacSetDrops(offlineHardRewards, {}, { id: 'grass' }, 1, 0, offlineHardContext);
offline.rollOfflineTransitionSetDrops(offlineHardRewards, {}, { id: 'grass' }, 1, offlineHardContext);
assert.deepEqual(offlineHardRewards.equipments.map((item) => item.level), [28, 28], 'Offline hard set drops must apply the same difficulty level bonus as online drops.');

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

const goldPassiveWindow = globalThis.window;
globalThis.window = {
  ...(goldPassiveWindow || {}),
  RuneFrontierCombatRuntime: {
    getPassiveMechanismEffects: () => ({ killGoldBonus: 0.15, bossGoldBonus: 0.30 }),
  },
};
const merchantKillState = { ...killState, gold: 0, totalKills: 0, areaKills: 0, monsterCodex: {} };
settlement.settleDefeatedEnemy({
  monster: { id: 'poring', gold: 100, exp: 0, jobExp: 0 },
  isBoss: false,
}, { ...baseCombatContext, getState: () => merchantKillState, hasLivingEncounterMembers: () => false, rollDrops: () => 0, spawnEnemy: () => {} });
assert.equal(merchantKillState.gold, 115, 'Bargain must grant exactly +15% gold for a normal kill.');
const merchantBossState = { ...bossState, gold: 0, totalKills: 0, areaKills: 10, monsterCodex: {}, materials: {}, vip: { bossFirstKills: { grass_normal: true } }, mapDifficultyProgress: {} };
settlement.settleDefeatedEnemy({
  map: { id: 'grass', name: 'Grass' },
  monster: { id: 'boss', gold: 100, exp: 0, jobExp: 0 },
  isBoss: true,
  difficulty: 'normal',
}, { ...bossContext, getState: () => merchantBossState, rollDrops: () => 0 });
assert.equal(merchantBossState.gold, 260, 'Bargain must grant exactly +30% on the Boss gold result without a second amplification.');
globalThis.window = goldPassiveWindow;

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

const skillMechanics = await importSource(skillMechanicsSource);
const priorSkillWindow = globalThis.window;
const mageSkill = {
  id: 'mage_fire_bolt',
  name: '火箭术',
  kind: '主动',
  cooldown: 5,
  mechanism: { type: 'singleHit', stat: 'matk', multiplier: 2.35, mark: { type: 'burn', duration: 5 } },
};
const mageSkillState = {
  hero: { currentHp: 100 },
  enemyHp: 1000,
  enemyMaxHp: 1000,
  skillCooldowns: {},
  activeZones: [],
  activeBuffs: [],
  enemyMarks: {},
};
let mageSkillFeedback = '';
globalThis.window = { ...(priorSkillWindow || {}), v3JobSkills: { mage: [mageSkill] } };
skillMechanics.configureSkillMechanicsContext({
  getState: () => mageSkillState,
  currentJob: () => ({ id: 'mage' }),
  getUnlockedSkills: () => [mageSkill],
  currentMonsterStats: () => ({ damageReduction: 0 }),
  normalizeDamage: (value) => Math.round(value),
  random: () => 0.5,
  showDamageNumber: () => {},
  showHitFeedback: () => {},
  showSkillCastFeedback: (skill) => { mageSkillFeedback = skill.name; },
});
skillMechanics.tickSkillSystem(1, { matkPower: 100, atkPower: 10, crit: 0, maxHp: 100 });
assert.equal(mageSkillState.enemyHp, 765, 'Mage single-hit spell must deal its V4 configured magic damage.');
assert.equal(mageSkillState.skillCooldowns.mage_fire_bolt, 5, 'Mage spell must enter cooldown after casting.');
assert.equal(mageSkillState.enemyMarks.burn, 5, 'Fire Bolt must apply its burn mark.');
assert.equal(mageSkillFeedback, '火箭术', 'Mage single-hit spells must show cast feedback.');
mageSkillState.skillCooldowns.mage_fire_bolt = 999;
for (let i = 0; i < 32; i += 1) {
  skillMechanics.tickSkillSystem(0.16, { matkPower: 100, atkPower: 10, crit: 0, maxHp: 100 });
}
assert.equal(mageSkillState.enemyHp, 705, 'A five-second burn must tick exactly five times under uneven frame slices.');
assert.equal(mageSkillState.enemyMarks.burn, undefined, 'Expired burn statuses must clear their runtime state.');

const poisonSkill = {
  id: 'thief_poison',
  name: '施毒',
  kind: '主动',
  cooldown: 8,
  mechanism: { type: 'singleHit', multiplier: 1.7, mark: { type: 'poison', duration: 6, stackAdd: 1, maxStacks: 5 }, stat: 'atk' },
};
const poisonState = { hero: { currentHp: 100 }, enemyHp: 9999, enemyMaxHp: 9999, skillCooldowns: {}, activeZones: [], activeBuffs: [], enemyMarks: {} };
globalThis.window = { ...(priorSkillWindow || {}), v3JobSkills: { thief: [poisonSkill] } };
skillMechanics.configureSkillMechanicsContext({
  getState: () => poisonState,
  currentJob: () => ({ id: 'thief' }),
  getUnlockedSkills: () => [poisonSkill],
  currentMonsterStats: () => ({ damageReduction: 0 }),
  normalizeDamage: (value) => Math.round(value),
  random: () => 0.5,
});
skillMechanics.tickSkillSystem(0, { atkPower: 100, matkPower: 0, crit: 0, maxHp: 100 });
poisonState.skillCooldowns.thief_poison = 0;
skillMechanics.tickSkillSystem(0, { atkPower: 100, matkPower: 0, crit: 0, maxHp: 100 });
assert.equal(poisonState.enemyMarks._poisonStacks, 2, 'Poison must gain real stacks and remain bounded by the V4 stack rule.');

const layeredStatusState = {
  hero: { currentHp: 100 },
  enemyHp: 1000,
  enemyMaxHp: 1000,
  skillCooldowns: {},
  activeZones: [],
  activeBuffs: [],
  enemyMarks: { '\u7834\u7532': 3, '\u4f24\u53e3': 4 },
};
globalThis.window = { ...(priorSkillWindow || {}), v3JobSkills: { none: [] } };
skillMechanics.configureSkillMechanicsContext({
  getState: () => layeredStatusState,
  currentJob: () => ({ id: 'none' }),
  getUnlockedSkills: () => [],
  currentMonsterStats: () => ({ damageReduction: 0 }),
});
skillMechanics.tickSkillSystem(0.6, { atkPower: 100, matkPower: 0, crit: 0, maxHp: 100 });
assert.equal(layeredStatusState.enemyMarks['\u7834\u7532'], 3, 'Armor-break stacks must not decay as a duration timer.');
assert.equal(layeredStatusState.enemyMarks['\u4f24\u53e3'], 4, 'Wound stacks must remain on the current target until consumed or reset.');
assert.equal(skillMechanics.getEnemyStatusDisplayState(layeredStatusState).length, 2, 'Target stack statuses must be available to the battle status display.');
skillMechanics.resetEnemySkillStatuses(layeredStatusState, 'test-target-change');
assert.deepEqual(layeredStatusState.enemyMarks, {}, 'Target changes must clear target-bound skill statuses.');

const finisherSkill = {
  id: 'rune_burst',
  name: '符文爆发',
  kind: '主动',
  cooldown: 20,
  mechanism: { type: 'finisher', thresholdHpPct: 0.25, baseMultiplier: 5, finisherMultiplier: 7.5, killCooldownRefundPct: 0.5, stat: 'atk' },
};
const finisherState = { hero: { currentHp: 100 }, enemyHp: 20, enemyMaxHp: 100, skillCooldowns: {}, activeZones: [], activeBuffs: [], enemyMarks: {} };
globalThis.window = { ...(priorSkillWindow || {}), v3JobSkills: { runeKnight: [finisherSkill] } };
skillMechanics.configureSkillMechanicsContext({
  getState: () => finisherState,
  currentJob: () => ({ id: 'runeKnight' }),
  getUnlockedSkills: () => [finisherSkill],
  currentMonsterStats: () => ({ currentHp: finisherState.enemyHp, maxHp: 100, damageReduction: 0 }),
  normalizeDamage: (value) => Math.round(value),
  random: () => 0.5,
});
skillMechanics.tickSkillSystem(0, { atkPower: 100, matkPower: 0, crit: 0, maxHp: 100 });
assert.equal(finisherState.skillCooldowns.rune_burst, 10, 'Finisher kill cooldown refund must apply after cooldown assignment.');

const criticalSkill = {
  id: 'critical_multihit',
  name: '测试连击',
  kind: '主动',
  cooldown: 3,
  mechanism: { type: 'multihit', hits: 2, multiplierPerHit: 1, stat: 'atk' },
};
const criticalSkillState = { hero: { currentHp: 100 }, enemyHp: 1000, enemyMaxHp: 1000, skillCooldowns: {}, activeZones: [], activeBuffs: [], enemyMarks: {} };
globalThis.window = { ...(priorSkillWindow || {}), v3JobSkills: { swordman: [criticalSkill] } };
skillMechanics.configureSkillMechanicsContext({
  getState: () => criticalSkillState,
  currentJob: () => ({ id: 'swordman' }),
  getUnlockedSkills: () => [criticalSkill],
  currentMonsterStats: () => ({ damageReduction: 0 }),
  normalizeDamage: (value) => Math.round(value),
  random: () => 0,
  showHitFeedback: () => {},
});
skillMechanics.tickSkillSystem(0, { atkPower: 100, matkPower: 0, crit: 1, critDamage: 9, maxHp: 100 });
assert.equal(criticalSkillState.enemyHp, 730, 'V4 skill damage must use the expected-crit correction without applying raw crit damage again.');

const goldCostSkill = {
  id: 'merchant_gold_strike',
  name: 'Gold Strike',
  kind: mageSkill.kind,
  cooldown: 10,
  mechanism: { type: 'goldCost', goldCostPct: 0.0008, goldCostLevelCapMultiplier: 200, multiplier: 3.8, stat: 'atk' },
};
const goldCostState = { hero: { currentHp: 100, baseLevel: 10 }, gold: 10000000, enemyHp: 9999, enemyMaxHp: 9999, skillCooldowns: {}, activeZones: [], activeBuffs: [], enemyMarks: {} };
globalThis.window = { ...(priorSkillWindow || {}), v3JobSkills: { merchant: [goldCostSkill] } };
skillMechanics.configureSkillMechanicsContext({
  getState: () => goldCostState,
  currentJob: () => ({ id: 'merchant' }),
  getUnlockedSkills: () => [goldCostSkill],
  currentMonsterStats: () => ({ damageReduction: 0 }),
  normalizeDamage: (value) => Math.round(value),
  random: () => 0.5,
});
skillMechanics.tickSkillSystem(0, { atkPower: 100, matkPower: 0, crit: 0, maxHp: 100 });
assert.equal(goldCostState.gold, 9998000, 'Gold-cost skill must respect the V4 level-based spending cap.');

const boostedSkill = {
  id: 'boosted_skill',
  name: '狂击',
  kind: '主动',
  cooldown: 1,
  mechanism: { type: 'multihit', hits: 1, multiplierPerHit: 1, stat: 'atk' },
};
const dragonBloodState = { hero: { currentHp: 100 }, enemyHp: 1000, enemyMaxHp: 1000, skillCooldowns: {}, activeZones: [], activeBuffs: [], enemyMarks: {}, guaranteedCritNext: { multiplier: 1.5, skillOnly: true } };
globalThis.window = { ...(priorSkillWindow || {}), v3JobSkills: { runeKnight: [boostedSkill] } };
skillMechanics.configureSkillMechanicsContext({
  getState: () => dragonBloodState,
  currentJob: () => ({ id: 'runeKnight' }),
  getUnlockedSkills: () => [boostedSkill],
  currentMonsterStats: () => ({ damageReduction: 0 }),
  normalizeDamage: (value) => Math.round(value),
  random: () => 0.5,
});
skillMechanics.tickSkillSystem(0, { atkPower: 100, matkPower: 0, crit: 0, maxHp: 100 });
assert.equal(dragonBloodState.enemyHp, 850, 'Dragon Blood must apply its one-time 1.5x active-skill enhancement.');
assert.equal(dragonBloodState.guaranteedCritNext, undefined, 'Dragon Blood enhancement must be consumed after one active skill.');
dragonBloodState.skillCooldowns.boosted_skill = 0;
skillMechanics.tickSkillSystem(0, { atkPower: 100, matkPower: 0, crit: 0, maxHp: 100 });
assert.equal(dragonBloodState.enemyHp, 750, 'Consumed Dragon Blood enhancement must not repeat.');

const stealthSkill = { ...boostedSkill, id: 'stealth_skill', name: '施毒' };
const stealthPassive = { id: 'stealth_passive', name: '隐匿', kind: '被动', cooldown: 0, mechanism: { type: 'stealth', nextHit: { crit: { multiplier: 1.35 } } } };
const stealthState = { hero: { currentHp: 100 }, enemyHp: 1000, enemyMaxHp: 1000, skillCooldowns: {}, activeZones: [], activeBuffs: [], enemyMarks: {} };
globalThis.window = { ...(priorSkillWindow || {}), v3JobSkills: { thief: [stealthSkill, stealthPassive] } };
skillMechanics.configureSkillMechanicsContext({
  getState: () => stealthState,
  currentJob: () => ({ id: 'thief' }),
  getUnlockedSkills: () => [stealthSkill, stealthPassive],
  currentMonsterStats: () => ({ damageReduction: 0 }),
  normalizeDamage: (value) => Math.round(value),
  random: () => 0.5,
});
skillMechanics.tickSkillSystem(5, { atkPower: 100, matkPower: 0, crit: 0, maxHp: 100 });
assert.equal(stealthState.enemyHp, 865, 'Stealth must enhance the next active skill by its explicit 1.35x coefficient.');
assert.equal(stealthState.stealthSkillReady, false, 'Stealth enhancement must be consumed by the skill cast.');

const cartSkill = { id: 'cart_smash', name: '手推车强击', kind: '主动', cooldown: 7, mechanism: { type: 'multihit', hits: 3, multiplierPerHit: 0.8, armorBreakStack: 1, maxArmorBreakStacks: 3, stat: 'atk' } };
const earthPassive = { id: 'earth_strike', name: '大地之击', kind: '被动', cooldown: 0, mechanism: { type: 'stackTrigger', stack: '破甲', threshold: 3, effect: { skill: '手推车强击', crit: { guaranteed: true, multiplier: 1.4 } } } };
const earthState = { hero: { currentHp: 100 }, enemyHp: 2000, enemyMaxHp: 2000, skillCooldowns: {}, activeZones: [], activeBuffs: [], enemyMarks: { '破甲': 3 } };
globalThis.window = { ...(priorSkillWindow || {}), v3JobSkills: { blacksmith: [cartSkill, earthPassive] } };
skillMechanics.configureSkillMechanicsContext({
  getState: () => earthState,
  currentJob: () => ({ id: 'mechanic' }),
  getV3CombatSkills: () => [cartSkill, earthPassive],
  getUnlockedSkills: () => [],
  currentMonsterStats: () => ({ damageReduction: 0 }),
  normalizeDamage: (value) => Math.round(value),
  random: () => 0.5,
});
skillMechanics.tickSkillSystem(0, { atkPower: 100, matkPower: 0, crit: 0, maxHp: 100 });
assert.equal(earthState.enemyHp, 1760, 'An inherited cart skill must first build/retain its armor-break trigger without premature damage amplification.');
assert.equal(earthState.earthStrikeReady, true, 'Mechanic must inherit Earth Strike readiness from the Blacksmith route.');
earthState.skillCooldowns.cart_smash = 0;
skillMechanics.tickSkillSystem(0, { atkPower: 100, matkPower: 0, crit: 0, maxHp: 100 });
assert.equal(earthState.enemyHp, 1424, 'Earth Strike must apply 1.4x damage to the next inherited cart skill.');
assert.equal(earthState.enemyMarks['破甲'], 3, 'The empowered cart skill must consume the trigger and rebuild armor-break stacks from its own hits.');

const splashSkill = { id: 'monster_smash', name: '怪物互击', kind: '主动', cooldown: 10, mechanism: { type: 'multihit', hits: 3, multiplierPerHit: 0.95, splashMultiplier: 0.6, stat: 'atk' } };
const splashState = { hero: { currentHp: 100 }, enemyHp: 1000, enemyMaxHp: 1000, skillCooldowns: {}, activeZones: [], activeBuffs: [], enemyMarks: {} };
let encounterSplash = 0;
globalThis.window = { ...(priorSkillWindow || {}), v3JobSkills: { knight: [splashSkill] } };
skillMechanics.configureSkillMechanicsContext({
  getState: () => splashState,
  currentJob: () => ({ id: 'knight' }),
  getUnlockedSkills: () => [splashSkill],
  currentMonsterStats: () => ({ damageReduction: 0 }),
  normalizeDamage: (value) => Math.round(value),
  applySkillSplashDamageToEncounter: (amount) => { encounterSplash = amount; },
  random: () => 0.5,
});
skillMechanics.tickSkillSystem(0, { atkPower: 100, matkPower: 0, crit: 0, maxHp: 100 });
assert.equal(splashState.enemyHp, 715, 'Monster Smash must not apply encounter splash to its active target.');
assert.equal(encounterSplash, 60, 'Monster Smash must route its 0.6x damage to secondary encounter targets.');

const wolfSkill = { id: 'wolf_assault', name: '狼突袭', kind: '主动', cooldown: 9, mechanism: { type: 'statusExploit', mark: 'any', baseMultiplier: 2.4, markedMultiplier: 3.4, stat: 'atk' } };
const wolfState = { hero: { currentHp: 100 }, enemyHp: 1000, enemyMaxHp: 1000, skillCooldowns: {}, activeZones: [], activeBuffs: [], enemyMarks: {} };
globalThis.window = { ...(priorSkillWindow || {}), v3JobSkills: { ranger: [wolfSkill] } };
skillMechanics.configureSkillMechanicsContext({
  getState: () => wolfState,
  currentJob: () => ({ id: 'ranger' }),
  currentMonsterStats: () => ({ damageReduction: 0 }),
  normalizeDamage: (value) => Math.round(value),
  random: () => 0.5,
});
skillMechanics.tickSkillSystem(0, { atkPower: 100, matkPower: 0, crit: 0, maxHp: 100 });
assert.equal(wolfState.enemyHp, 760, 'Wolf Assault must use 2.4x damage without a status mark.');
wolfState.enemyMarks.mark = 3;
wolfState.skillCooldowns.wolf_assault = 0;
skillMechanics.tickSkillSystem(0, { atkPower: 100, matkPower: 0, crit: 0, maxHp: 100 });
assert.equal(wolfState.enemyHp, 420, 'Wolf Assault must use 3.4x damage after a status mark is present.');

const awakenedArrowStorm = { id: 'awakened_arrow_storm', name: '箭矢风暴', kind: '主动', cooldown: 12, mechanism: { type: 'multihit', hits: 1, multiplierPerHit: 1, stat: 'atk' } };
const awakeningState = { hero: { currentHp: 100 }, enemyHp: 1000, enemyMaxHp: 1000, skillCooldowns: {}, activeZones: [], activeBuffs: [], enemyMarks: { mark: 3 }, rebirthAwakenings: { ranger: true }, awakeningMarks: 12 };
globalThis.window = {
  ...(priorSkillWindow || {}),
  v3JobSkills: { ranger: [awakenedArrowStorm] },
  v3SkillAwakenings: { ranger: { skill: '箭矢风暴', cost: 12, effect: { type: 'extraHits', hits: 2, perHit: 0.55, condition: 'enemyMarked' } } },
};
skillMechanics.configureSkillMechanicsContext({
  getState: () => awakeningState,
  currentJob: () => ({ id: 'ranger' }),
  currentMonsterStats: () => ({ damageReduction: 0 }),
  normalizeDamage: (value) => Math.round(value),
  random: () => 0.5,
});
skillMechanics.tickSkillSystem(0, { atkPower: 100, matkPower: 0, crit: 0, maxHp: 100 });
assert.equal(awakeningState.enemyHp, 790, 'Awakened Arrow Storm must apply its paid extra hits.');
assert.equal(awakeningState.awakeningMarks, 0, 'An awakened active skill must consume its awakening marks on use.');
awakeningState.skillCooldowns.awakened_arrow_storm = 0;
skillMechanics.tickSkillSystem(0, { atkPower: 100, matkPower: 0, crit: 0, maxHp: 100 });
assert.equal(awakeningState.enemyHp, 690, 'Awakening effects must not trigger again without enough marks.');

const judgementSkill = { id: 'judgement', name: '审判', kind: '主动', cooldown: 12, mechanism: { type: 'selfDamage', hpCostPct: 0.08, multiplier: 3.8, bonusVs: { dark: 5.8, undead: 5.8 }, stat: 'matk' } };
const darkState = { hero: { currentHp: 100 }, enemyHp: 1000, enemyMaxHp: 1000, skillCooldowns: {}, activeZones: [], activeBuffs: [], enemyMarks: {} };
globalThis.window = { ...(priorSkillWindow || {}), v3JobSkills: { priest: [judgementSkill] } };
skillMechanics.configureSkillMechanicsContext({
  getState: () => darkState,
  currentJob: () => ({ id: 'priest' }),
  getUnlockedSkills: () => [judgementSkill],
  currentMonsterStats: () => ({ id: 'glast_boss_dark_lord', damageReduction: 0 }),
  normalizeDamage: (value) => Math.round(value),
  random: () => 0.5,
});
skillMechanics.tickSkillSystem(0, { atkPower: 0, matkPower: 100, crit: 0, maxHp: 100 });
assert.equal(darkState.enemyHp, 420, 'Judgement must apply its 5.8x dark-target multiplier.');
assert.equal(darkState.hero.currentHp, 92, 'Judgement must preserve its current HP cost.');

const sharpShootSkill = { id: 'sharp_shoot', name: '锐利射击', kind: '主动', cooldown: 7, mechanism: { type: 'finisher', thresholdHpPct: 0.35, baseMultiplier: 2.6, finisherMultiplier: 3.8, snareMultiplier: 5.0, stat: 'atk' } };
const snareState = { hero: { currentHp: 100 }, enemyHp: 1000, enemyMaxHp: 1000, skillCooldowns: {}, activeZones: [], activeBuffs: [], enemyMarks: { snare: 3 } };
globalThis.window = { ...(priorSkillWindow || {}), v3JobSkills: { hunter: [sharpShootSkill] } };
skillMechanics.configureSkillMechanicsContext({
  getState: () => snareState,
  currentJob: () => ({ id: 'hunter' }),
  getUnlockedSkills: () => [sharpShootSkill],
  currentMonsterStats: () => ({ currentHp: 1000, maxHp: 1000, damageReduction: 0 }),
  normalizeDamage: (value) => Math.round(value),
  random: () => 0.5,
});
skillMechanics.tickSkillSystem(0, { atkPower: 100, matkPower: 0, crit: 0, maxHp: 100 });
assert.equal(snareState.enemyHp, 500, 'Sharp Shooting must use its 5.0x snare multiplier even before the low-health finisher threshold.');

const fireSkill = { id: 'fire', name: '火箭术', kind: '主动', cooldown: 5, mechanism: { type: 'singleHit', stat: 'matk', multiplier: 1, mark: { type: 'burn', duration: 5 } } };
const iceSkill = { id: 'ice', name: '冰箭术', kind: '主动', cooldown: 7, mechanism: { type: 'singleHit', stat: 'matk', multiplier: 1, mark: { type: 'freeze', duration: 3 } } };
const resonancePassive = { id: 'resonance', name: '元素共鸣', kind: '被动', cooldown: 0, mechanism: { type: 'elementalResonance', pairs: [{ multiplier: 1.8 }] } };
const amplificationPassive = { id: 'amp', name: '魔力增幅', kind: '被动', cooldown: 0, mechanism: { type: 'cooldownReduce', reduction: 0.35 } };
const resonanceState = { hero: { currentHp: 100 }, enemyHp: 5000, enemyMaxHp: 5000, skillCooldowns: {}, activeZones: [], activeBuffs: [], enemyMarks: {} };
globalThis.window = { ...(priorSkillWindow || {}), v3JobSkills: { wizard: [fireSkill, iceSkill, resonancePassive, amplificationPassive] } };
skillMechanics.configureSkillMechanicsContext({
  getState: () => resonanceState,
  currentJob: () => ({ id: 'wizard' }),
  getUnlockedSkills: () => [fireSkill, iceSkill, resonancePassive, amplificationPassive],
  currentMonsterStats: () => ({ damageReduction: 0 }),
  normalizeDamage: (value) => Math.round(value),
  random: () => 0.5,
});
skillMechanics.tickSkillSystem(0, { atkPower: 0, matkPower: 100, crit: 0, maxHp: 100 });
assert.equal(resonanceState.skillCooldowns.ice, 7, 'Elemental resonance must not reduce the cooldown of its triggering skill.');
assert.equal(resonanceState.cooldownReductionNextSkill, true, 'Magic Amplification must arm the following skill cooldown reduction.');
resonanceState.skillCooldowns.fire = 0;
skillMechanics.tickSkillSystem(0, { atkPower: 0, matkPower: 100, crit: 0, maxHp: 100 });
assert.equal(resonanceState.skillCooldowns.fire, 3, 'Magic Amplification must reduce the next skill cooldown by 35%.');

const guardPassive = { id: 'angel_guard', name: '天使之护', kind: '被动', cooldown: 60, mechanism: { type: 'hpThreshold', low: { hpPct: 0.4, bonus: { damageReductionPct: 0.3 }, duration: 6 } } };
const healedGuardState = { hero: { currentHp: 90 }, angelGuardActiveTimer: 3, enemyMarks: {} };
globalThis.window = { ...(priorSkillWindow || {}), v3JobSkills: { acolyte: [guardPassive] } };
skillMechanics.configureSkillMechanicsContext({
  getState: () => healedGuardState,
  currentJob: () => ({ id: 'acolyte' }),
  getUnlockedSkills: () => [guardPassive],
});
assert.equal(skillMechanics.getPassiveMechanismEffects(healedGuardState, { maxHp: 100 }).damageReductionPct, 0.3, 'Angel Guard must keep reducing damage for its timed duration after healing above the trigger threshold.');
globalThis.window = priorSkillWindow;

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

const snaredEnemyState = {
  enemyHp: 10,
  enemyMaxHp: 10,
  hero: { currentHp: 100 },
  enemyAttackTimer: 9,
  currentMap: 0,
  enemyMarks: { snare: 3 },
};
let snaredAttackFeedback = '';
normalCombat.configureNormalCombatContext({
  getState: () => snaredEnemyState,
  getMonsterAttackInterval: () => 1,
  currentMonsterStats: () => ({ attack: 100, critChance: 1 }),
  random: () => 0,
  showDamageNumber: (_target, _amount, kind) => { snaredAttackFeedback = kind; },
});
normalCombat.updateMonsterAttack(1, { maxHp: 100, dodgeRate: 1, statusResist: 0 });
assert.equal(snaredEnemyState.hero.currentHp, 100, 'Snaring an enemy must not prevent the player from dodging its attack.');
assert.equal(snaredAttackFeedback, 'miss', 'Player dodge feedback must remain visible while the enemy is snared.');

const angelGuardState = { enemyHp: 100, enemyMaxHp: 100, hero: { currentHp: 30 }, playerAttackTimer: 0, enemyAttackTimer: 0, shieldHp: 0 };
const angelGuardWindow = globalThis.window;
globalThis.window = {
  ...(angelGuardWindow || {}),
  RuneFrontierCombatRuntime: {
    getPassiveMechanismEffects: () => ({
      damageReductionPct: angelGuardState.angelGuardActiveTimer > 0 ? 0.3 : 0,
      angelGuard: { hpPct: 0.4, duration: 6, cooldown: 60, damageReductionPct: 0.3 },
      enhanceAngelGuard: { shieldPct: 0.1 },
    }),
    getSkillBuffMultipliers: () => ({}),
  },
};
normalCombat.configureNormalCombatContext({
  getState: () => angelGuardState,
  computeStats: () => ({ attackSpeed: 1, crit: 0, maxHp: 100 }),
  currentMonsterStats: () => ({ damageReduction: 0 }),
  getPlayerCritRateCap: () => 1,
  random: () => 0.9,
  tryAutoChallengeBoss: () => false,
  applySplashDamageToEncounter: () => {},
  currentJob: () => ({ id: 'test' }),
});
normalCombat.updateCombat(0);
assert.equal(angelGuardState.angelGuardActiveTimer, 6, 'Angel Guard must start its V4 six-second low-health window.');
assert.equal(angelGuardState.angelGuardCooldown, 60, 'Angel Guard must enter its V4 cooldown after activation.');
assert.equal(angelGuardState.shieldHp, 10, 'Enhanced Angel Guard must grant its shield once on activation.');
angelGuardState.hero.currentHp = 90;
const guardedAfterHealing = globalThis.window.RuneFrontierCombatRuntime.getPassiveMechanismEffects(angelGuardState, { maxHp: 100 });
assert.equal(guardedAfterHealing.damageReductionPct, 0.3, 'Angel Guard reduction must remain active for its duration after healing above the trigger threshold.');
normalCombat.updateCombat(0);
assert.equal(angelGuardState.shieldHp, 10, 'Angel Guard must not stack repeated shields while on cooldown.');
globalThis.window = angelGuardWindow;

const reviveAwakeningState = {
  enemyHp: 100,
  enemyMaxHp: 100,
  hero: { currentHp: 0 },
  playerAttackTimer: 0,
  enemyAttackTimer: 0,
  shieldHp: 0,
  awakeningMarks: 15,
};
globalThis.window = {
  ...(angelGuardWindow || {}),
  RuneFrontierCombatRuntime: {
    getPassiveMechanismEffects: () => ({
      reviveReady: true,
      reviveAwakening: { healPct: 0.3, shieldPct: 0.2, cost: 15 },
    }),
    getSkillBuffMultipliers: () => ({}),
  },
};
normalCombat.configureNormalCombatContext({
  getState: () => reviveAwakeningState,
  computeStats: () => ({ attackSpeed: 1, crit: 0, maxHp: 100 }),
  currentMonsterStats: () => ({ damageReduction: 0 }),
  getPlayerCritRateCap: () => 1,
  random: () => 0.9,
  tryAutoChallengeBoss: () => false,
  currentJob: () => ({ id: 'archbishop' }),
});
normalCombat.updateCombat(0);
assert.equal(reviveAwakeningState.hero.currentHp, 70, 'Awakened revive must apply its additional healing once.');
assert.equal(reviveAwakeningState.shieldHp, 20, 'Awakened revive must apply its shield once.');
assert.equal(reviveAwakeningState.awakeningMarks, 0, 'Awakened revive must consume awakening marks on activation.');
globalThis.window = angelGuardWindow;

// VIP module tests
const vipSource = read('src/systems/vip.js');
const vip = await importSource(vipSource);
vip.configureVipContext({
  getVipMaxLevel: () => 10,
  getVipExpRequirements: () => [0, 100, 300, 700, 1500, 3000, 6000, 10000, 16000, 24000, 36000],
  getVipBonusPerLevel: () => ({ gold: 0.06, itemDrop: 0.025, equipmentDrop: 0.02 }),
  getVipMilestoneBonuses: () => ({ 5: { allStatsPct: 0.05 }, 10: { allStatsPct: 0.15 } }),
  getOnlineRewardLevels: () => [{ minutes: 15 }, { minutes: 30 }, { minutes: 60 }],
  gainExp: () => {},
  getDisplayItemName: (item) => item?.name || '',
});
const normalized = vip.normalizeVip({ level: -1, exp: 50, totalExp: 200 }, vip.vipContext);
assert.equal(normalized.level, 0, 'VIP level must be clamped to zero.');
assert.equal(normalized.exp, 50, 'VIP normalize must preserve raw exp.');
assert.equal(normalized.totalExp, 200, 'VIP normalize must preserve total exp.');
const maxed = vip.normalizeVip({ level: 15, exp: 0, totalExp: 99999 }, vip.vipContext);
assert.equal(maxed.level, 10, 'VIP level must be capped at max level.');
const bonuses = vip.getVipBonuses(5, vip.vipContext);
assert.equal(bonuses.gold, 0.3, 'VIP gold bonus at level 5 must be 5 * 0.06.');
assert.equal(bonuses.equipmentDrop, 0.1, 'VIP equipment drop bonus at level 5 must be 5 * 0.02.');
const progress = vip.getVipProgressInfo({ level: 1, totalExp: 150 }, vip.vipContext);
assert.equal(progress.level, 1, 'VIP progress must report current level.');
assert.ok(progress.requiredForNext >= 100, 'VIP progress must report a valid next-level requirement.');
assert.ok(progress.progressPct > 0 && progress.progressPct < 1, 'VIP progress percentage must be between 0 and 1.');
const maxProgress = vip.getVipProgressInfo({ level: 10, totalExp: 99999 }, vip.vipContext);
assert.equal(maxProgress.isMax, true, 'Max VIP level must be detected.');

// Codex module tests
const codexSource = read('src/systems/codex.js');
const codex = await importSource(codexSource);
const mockConfig = {
  grass: {
    name: '南门青草地',
    monsters: [{ id: 'poring', name: '波波利' }, { id: 'lunatic', name: '疯兔' }],
    bossTemplate: { id: 'grass_boss', name: '青草首领' },
  },
  forest: {
    name: '斑光森林',
    monsters: [{ id: 'shroom', name: '蘑菇怪' }],
    bossTemplate: { id: 'forest_boss', name: '森林首领' },
  },
};
codex.configureCodexContext({
  getMapMonsterConfig: () => mockConfig,
  getCardPool: () => [{ monsterId: 'poring', name: '波波利卡片' }, { monsterId: 'poring', name: '波波利★' }],
  getKillMilestones: () => [1, 100, 1000, 5000],
  getKillRewards: () => ({ 1: { atk: 1 }, 100: { atk: 2, hp: 100 } }),
  getStatCaps: () => ({ atk: 50, hp: 5000 }),
  getCardMilestones: () => [3, 5, 8],
  getCardRewards: () => [{ atk: 5 }, { atk: 10, hp: 200 }, { atk: 20, hp: 500 }],
  getMasteryThresholds: () => [0, 10, 100, 500],
  getResearchThresholds: () => [0, 1, 10, 50],
  getMasteryBonuses: () => ({ 1: { damageBonus: 0.05 } }),
  getResearchBonuses: () => ({ 1: { dropBonus: 0.1 } }),
  getCaps: () => ({ mastery: 3, research: 3 }),
});
const nameMap = codex.buildMonsterNameMap();
assert.equal(nameMap.poring, '波波利', 'Monster name map must resolve normal monsters.');
assert.equal(nameMap.grass_boss, '青草首领', 'Monster name map must resolve boss templates.');
assert.equal(nameMap.shroom, '蘑菇怪', 'Monster name map must span multiple config entries.');
const sourceMap = codex.buildMonsterSourceMap();
assert.deepEqual(sourceMap.poring, ['南门青草地'], 'Monster source map must resolve single-map monsters.');
const cardMap = codex.buildMonsterCardDropMap();
assert.ok(cardMap.poring.length >= 2, 'Card drop map must collect all cards for a monster.');
assert.equal(codex.getMonsterTypeLabel('poring'), '普通', 'Monster type label must detect normal monsters.');
assert.ok(codex.getMonsterTypeLabel('grass_boss').includes('Boss'), 'Monster type label must detect bosses.');

// Shop module tests
const shopSource = read('src/systems/shop.js');
const shop = await importSource(shopSource);
const shopState = { shopState: { dailyPurchases: {}, weeklyPurchases: {}, totalPurchases: {}, lastDailyRefresh: '', lastWeeklyRefresh: '' } };
shop.configureShopContext({
  getState: () => shopState,
  getMaterialName: (id) => ({ dust: '研磨粉', gold: '金币' }[id] || id),
});
shop.normalizeShopState();
const today = new Date().toISOString().slice(0, 10);
assert.equal(shopState.shopState.lastDailyRefresh, today, 'Shop normalize must set today as lastDailyRefresh.');
assert.equal(shopState.shopState.dailyPurchases && typeof shopState.shopState.dailyPurchases === 'object', true, 'Shop normalize must ensure daily purchases object.');
shopState.shopState.dailyPurchases.potion = 2;
assert.equal(shop.getShopPurchaseCount('potion', 'daily'), 2, 'Shop purchase count must return daily purchases.');
shopState.shopState.weeklyPurchases.scroll = 1;
assert.equal(shop.getShopPurchaseCount('scroll', 'weekly'), 1, 'Shop purchase count must return weekly purchases.');
assert.equal(shop.getShopPurchaseCount('new-item', 'daily'), 0, 'Shop purchase count must default to zero for unvisited items.');
const goldCost = shop.formatShopCostItem('gold', 5000);
assert.match(goldCost, /金币/, 'Shop gold cost must show Chinese label.');
assert.match(goldCost, /5[,.]?000/, 'Shop gold cost must include formatted amount.');
const matCost = shop.formatShopCostItem('dust', 99);
assert.match(matCost, /研磨粉/, 'Shop material cost must show material name.');
assert.match(matCost, /99/, 'Shop material cost must include quantity.');
const formatted = shop.formatShopCost({ gold: 1000, dust: 50 });
assert.match(formatted, /金币/, 'Formatted cost must include gold entry.');
assert.match(formatted, /研磨粉/, 'Formatted cost must include material entry.');

console.log('Migration batch 7 tests passed: combat-round routing, VIP, Codex, Shop, and existing reward settlement are intact.');
