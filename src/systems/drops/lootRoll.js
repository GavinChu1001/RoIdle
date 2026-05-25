export function rollDrops(options) {
  if (typeof window.rollDrops === 'function') return window.rollDrops(options);
  return 0;
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
