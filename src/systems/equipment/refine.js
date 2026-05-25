export function enhanceItem(itemId) {
  if (typeof window.enhanceItem === 'function') return window.enhanceItem(itemId);
}
export function getEnhanceCost(item) {
  if (typeof window.getEnhanceCost === 'function') return window.getEnhanceCost(item);
  return { materials: {}, gold: 0 };
}
export function getEnhanceChance(level) {
  if (typeof window.ENHANCE_CHANCES !== 'undefined') return window.ENHANCE_CHANCES[level - 1] || 0;
  return 0;
}
export function getEnhanceMilestoneBonuses(item) {
  if (typeof window.getEnhanceMilestoneBonuses === 'function') return window.getEnhanceMilestoneBonuses(item);
  return {};
}
export function getEnhanceEffect(item, level) {
  if (typeof window.getEnhanceEffect === 'function') return window.getEnhanceEffect(item, level);
  return '';
}
export function renderEnhancePanel() {
  if (typeof window.renderEnhancePanel === 'function') return window.renderEnhancePanel();
  return '';
}
