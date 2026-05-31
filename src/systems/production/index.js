import {
  ARTISAN_JOBS,
  CRAFTING_MASTERY_LEVELS,
  MINING_NODES,
  PRODUCTION_MATERIALS,
  getCraftingMasteryBand,
} from './catalog.js';
import {
  addCraftingExperience,
  craftingExpForLevel,
  defaultProductionState,
  normalizeProductionState,
} from './state.js';

export * from './catalog.js';
export * from './state.js';

export function installProductionRuntime(_context = {}) {
  const runtime = Object.freeze({
    defaultProductionState,
    normalizeProductionState,
    addCraftingExperience,
    craftingExpForLevel,
    getCraftingMasteryBand,
    PRODUCTION_MATERIALS,
    MINING_NODES,
    ARTISAN_JOBS,
    CRAFTING_MASTERY_LEVELS,
  });
  if (typeof window !== 'undefined') {
    window.RuneFrontierProductionRuntime = runtime;
  }
  return runtime;
}
