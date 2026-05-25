export * from './lootRoll.js';
export * from './equipmentDrops.js';
export * from './materialDrops.js';
export * from './bossDrops.js';
export * from './abyssDrops.js';
export * from './cardDrops.js';
export * from './recentLoot.js';
export * from './lootModel.js';
export * from './lootSummary.js';
export * from './dropStats.js';

import { configureEquipmentDropsContext, rollEquipmentDropsFromTable, rollEquipmentTableDrops } from './equipmentDrops.js';
import { configureRecentLootContext, normalizeRecentLoot, recordRecentLoot } from './recentLoot.js';
import { configureLootModelContext, getLatestRecentLootRewards, mergeLootRewards, normalizeLootRewards } from './lootModel.js';

export function installDropsRuntime(context = {}) {
  configureRecentLootContext(context);
  configureEquipmentDropsContext(context);
  configureLootModelContext(context);
  const runtime = Object.freeze({
    normalizeRecentLoot,
    recordRecentLoot,
    normalizeLootRewards,
    mergeLootRewards,
    getLatestRecentLootRewards,
    rollEquipmentTableDrops,
    rollEquipmentDropsFromTable,
  });
  window.RuneFrontierDropsRuntime = runtime;
  return runtime;
}
