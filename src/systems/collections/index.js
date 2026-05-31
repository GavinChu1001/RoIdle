import {
  buildCollectionSummary,
  defaultCollectionState,
  normalizeCollectionState,
  recordBossCollection,
  recordEquipmentCollection,
} from './equipmentCollection.js';

export * from './equipmentCollection.js';

export function installCollectionRuntime(context = {}) {
  const runtime = Object.freeze({
    defaultCollectionState,
    normalizeCollectionState,
    recordEquipmentCollection: (item, meta) => recordEquipmentCollection(context.getState?.() || {}, item, meta),
    recordBossCollection: (bossId, meta) => recordBossCollection(context.getState?.() || {}, bossId, meta),
    buildCollectionSummary: (state) => buildCollectionSummary(state || context.getState?.() || {}),
  });
  if (typeof window !== 'undefined') {
    window.RuneFrontierCollectionRuntime = runtime;
  }
  return runtime;
}
