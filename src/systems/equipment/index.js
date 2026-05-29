import { configureItemStatsContext, getEffectiveItemStats } from './itemStats.js';
import { calculateEquipmentScores } from './itemScore.js';
import { getEquipmentDisplayName } from './itemNaming.js';
import { configureItemFactoryContext, createItem, normalizeItem, resetItemForStatV2 } from './itemFactory.js';
import { configureEquipmentMutationContext, getSalvageRewards, shouldAutoSalvage, addEquipmentToInventory, salvageItem, salvageAllUnequipped, equipBest } from './dismantle.js';
import { configureRefineContext, enhanceItem, getEnhanceCost, getEnhanceMilestoneBonuses, getEnhanceEffect } from './refine.js';
import { configureStarRefineContext, refineItem, getRefineChance, getRefineCost, snapshotRefineStats, diffRefineStats, star15Bonus, refineMultiplier, refineGrowthFactorForStat, getRefineMilestoneBonuses, getRefineGrowthStats } from './starRefine.js';
import { configureSocketContext, getMaxEquipmentCardSlots, getEquipmentCardSlotCount, getCardSocketCost, canAffordSocketCost } from './socket.js';
import { EQUIPMENT_ARCHETYPES, normalizeEquipmentArchetype, getArchetypeLabel, getEquipmentArchetypeLabel, getJobPreferredArchetype, getJobArchetypeRoute, inferEquipmentArchetype, getArchetypeStatPools, rollEquipmentArchetype, calculateArchetypeScores, getEquipmentFitTags, shouldProtectEquipmentByArchetype, getReforgeCost } from './itemArchetype.js';
import { EQUIPMENT_GROWTH_TIERS, EQUIPMENT_SERIES, EQUIPMENT_LINE_MATERIALS, MAP_EQUIPMENT_PROGRESSION, PROGRESSION_EQUIPMENT_SLOTS, normalizeGrowthTier, normalizeEquipmentSeries, getEquipmentSeriesConfig, getEquipmentLineMaterials, getMapEquipmentProgression, getProgressionEquipmentTemplates, getProgressionEquipmentTemplate, getProgressionEquipmentDropTable, getEquipmentLineFilterOptions, formatEquipmentProgressionSummary, resolveEquipmentProgressionContext, resolveItemProgression, getProgressionMaterialDrops, getNextEquipmentUpgrade, getEquipmentUpgradeCost, getEquipmentProgressionTags } from './itemProgression.js';
import { EQUIPMENT_SYNERGY_LINES, ROUTE_SKILL_ENHANCEMENTS, computeEquipmentSynergies, getEquipmentSynergySummary, getProfessionRoute, getProfessionRouteTier } from './itemSynergy.js';
import { canUpgradeEquipmentProgression, upgradeEquipmentProgression } from './progressionUpgrade.js';

export * from './itemFactory.js';
export * from './itemStats.js';
export * from './itemScore.js';
export * from './itemCompare.js';
export * from './itemTags.js';
export * from './itemNaming.js';
export * from './itemArchetype.js';
export * from './itemProgression.js';
export * from './itemSynergy.js';
export * from './progressionUpgrade.js';
export * from './refine.js';
export * from './starRefine.js';
export * from './socket.js';
export * from './dismantle.js';

export function installEquipmentRuntime(context = {}) {
  configureItemStatsContext(context);
  configureItemFactoryContext(context);
  configureEquipmentMutationContext({ ...context, normalizeItem: (item) => normalizeItem(item, context) });
  configureRefineContext(context);
  configureStarRefineContext(context);
  configureSocketContext(context);
  const runtime = Object.freeze({
    getEquipmentDisplayName,
    getEffectiveItemStats,
    calculateEquipmentScores,
    EQUIPMENT_ARCHETYPES,
    normalizeEquipmentArchetype,
    getArchetypeLabel,
    getEquipmentArchetypeLabel,
    getJobPreferredArchetype,
    getJobArchetypeRoute,
    inferEquipmentArchetype,
    getArchetypeStatPools,
    rollEquipmentArchetype,
    calculateArchetypeScores,
    getEquipmentFitTags,
    shouldProtectEquipmentByArchetype,
    getReforgeCost,
    EQUIPMENT_GROWTH_TIERS,
    EQUIPMENT_SERIES,
    EQUIPMENT_LINE_MATERIALS,
    MAP_EQUIPMENT_PROGRESSION,
    PROGRESSION_EQUIPMENT_SLOTS,
    normalizeGrowthTier,
    normalizeEquipmentSeries,
    getEquipmentSeriesConfig,
    getEquipmentLineMaterials,
    getMapEquipmentProgression,
    getProgressionEquipmentTemplates,
    getProgressionEquipmentTemplate,
    getProgressionEquipmentDropTable,
    getEquipmentLineFilterOptions,
    formatEquipmentProgressionSummary,
    resolveEquipmentProgressionContext,
    resolveItemProgression,
    getProgressionMaterialDrops,
    getNextEquipmentUpgrade,
    getEquipmentUpgradeCost,
    getEquipmentProgressionTags,
    EQUIPMENT_SYNERGY_LINES,
    ROUTE_SKILL_ENHANCEMENTS,
    computeEquipmentSynergies,
    getEquipmentSynergySummary,
    getProfessionRoute,
    getProfessionRouteTier,
    canUpgradeEquipmentProgression,
    upgradeEquipmentProgression: (itemId) => upgradeEquipmentProgression(itemId, context),
    createItem,
    normalizeItem,
    resetItemForStatV2,
    getSalvageRewards,
    shouldAutoSalvage,
    addEquipmentToInventory,
    salvageItem,
    salvageAllUnequipped,
    equipBest,
    enhanceItem,
    getEnhanceCost,
    getEnhanceMilestoneBonuses,
    getEnhanceEffect,
    refineItem,
    getRefineChance,
    getRefineCost,
    snapshotRefineStats,
    diffRefineStats,
    star15Bonus,
    refineMultiplier,
    refineGrowthFactorForStat,
    getRefineMilestoneBonuses,
    getRefineGrowthStats,
    getMaxEquipmentCardSlots,
    getEquipmentCardSlotCount,
    getCardSocketCost,
    canAffordSocketCost,
  });
  window.RuneFrontierEquipmentRuntime = runtime;
  return runtime;
}
