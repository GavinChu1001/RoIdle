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
import { claimMiningProduction } from './mining.js';
import { claimArtisanJob, startArtisanJob } from './artisan.js';

export * from './catalog.js';
export * from './state.js';
export * from './mining.js';
export * from './artisan.js';

export function installProductionRuntime(context = {}) {
  const runtime = Object.freeze({
    defaultProductionState,
    normalizeProductionState,
    addCraftingExperience,
    craftingExpForLevel,
    claimMiningProduction: () => claimMiningProduction(context.getState?.() || {}, context),
    startArtisanJob: (jobId) => startArtisanJob(context.getState?.() || {}, jobId, context),
    claimArtisanJob: () => claimArtisanJob(context.getState?.() || {}, context),
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
