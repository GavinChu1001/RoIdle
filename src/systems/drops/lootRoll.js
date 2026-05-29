import { rollEquipmentTableDrops } from './equipmentDrops.js';
import { rollZodiacSetDrops } from './bossDrops.js';
import { rollMythicEquipmentDrop } from './abyssDrops.js';
import { maybeDropDarkGoldFragments, maybeDropMythicEssence, maybeDropSocketMaterials, rollMapMaterialDrops } from './materialDrops.js';
import { maybeDropBossCardFragments, rollCardDropsFromTable } from './cardDrops.js';

let runtimeContext = {};

export function configureLootRollContext(context = {}) {
  runtimeContext = context || {};
}

export function rollDrops(options = {}, context = runtimeContext) {
  const stats = context.computeStats?.() || {};
  const isBoss = Boolean(options.boss);
  const monster = options.monster || context.currentMonsterStats?.();
  const equipmentDropCount = rollEquipmentTableDrops(stats, { boss: isBoss }, context);
  const zodiacDropCount = rollZodiacSetDrops(monster, stats, { boss: isBoss }, context);
  const mythicDropCount = rollMythicEquipmentDrop(monster, stats, { boss: isBoss }, context);
  rollMapMaterialDrops(stats, { boss: isBoss }, context);
  maybeDropMythicEssence(stats, { boss: isBoss }, context);
  maybeDropDarkGoldFragments(stats, { boss: isBoss }, context);
  maybeDropSocketMaterials(stats, { boss: isBoss }, context);
  rollCardDropsFromTable(stats, { boss: isBoss }, context);
  maybeDropBossCardFragments(stats, { boss: isBoss }, context);
  context.noteEquipmentSynergyKill?.({
    boss: isBoss,
    monster,
    equipmentDrops: equipmentDropCount + zodiacDropCount + mythicDropCount,
  });
  return equipmentDropCount + zodiacDropCount + mythicDropCount;
}

export function getEffectiveEquipmentDropRate(drop, stats, options) {
  if (typeof window.getEffectiveEquipmentDropRate === 'function') return window.getEffectiveEquipmentDropRate(drop, stats, options);
  return 0;
}

export function getMapQualityBonus() {
  if (typeof window.getMapQualityBonus === 'function') return window.getMapQualityBonus();
  return {};
}

export function applyRebirthPrestigeDropWeight(drop, weight, stats) {
  if (typeof window.applyRebirthPrestigeDropWeight === 'function') return window.applyRebirthPrestigeDropWeight(drop, weight, stats);
  return weight;
}
