import { configureItemStatsContext, getEffectiveItemStats } from './itemStats.js';
import { calculateEquipmentScores } from './itemScore.js';
import { getEquipmentDisplayName } from './itemNaming.js';
import { configureItemFactoryContext, createItem, normalizeItem } from './itemFactory.js';
import {
  addEquipmentToInventory,
  configureEquipmentMutationContext,
  getSalvageRewards,
  salvageItem,
  shouldAutoSalvage,
} from './dismantle.js';

export * from './itemFactory.js';
export * from './itemStats.js';
export * from './itemScore.js';
export * from './itemCompare.js';
export * from './itemTags.js';
export * from './itemNaming.js';
export * from './refine.js';
export * from './starRefine.js';
export * from './socket.js';
export * from './dismantle.js';

export function installEquipmentRuntime(context = {}) {
  configureItemStatsContext(context);
  configureItemFactoryContext(context);
  configureEquipmentMutationContext({
    ...context,
    normalizeItem: (item) => normalizeItem(item, context),
  });
  const runtime = Object.freeze({
    getEquipmentDisplayName,
    getEffectiveItemStats,
    calculateEquipmentScores,
    createItem,
    normalizeItem,
    getSalvageRewards,
    shouldAutoSalvage,
    addEquipmentToInventory,
    salvageItem,
  });
  window.RuneFrontierEquipmentRuntime = runtime;
  return runtime;
}
