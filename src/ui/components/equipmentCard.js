export function renderEquipmentSummaryStats(item, limit) {
  if (typeof window.renderEquipmentSummaryStats === 'function') return window.renderEquipmentSummaryStats(item, limit);
}
export function renderEquipmentCardScore(item) {
  if (typeof window.renderEquipmentCardScore === 'function') return window.renderEquipmentCardScore(item);
}
export function renderEquipmentBadges(item) {
  if (typeof window.renderEquipmentBadges === 'function') return window.renderEquipmentBadges(item);
}
export function renderEquipmentUsageTags(item) {
  if (typeof window.renderEquipmentUsageTags === 'function') return window.renderEquipmentUsageTags(item);
}
export { renderItemName } from '../../systems/equipment/itemNaming.js';
export function renderSetName(setName) {
  if (typeof window.renderSetName === 'function') return window.renderSetName(setName);
}
export function renderRefineBadge(item) {
  if (typeof window.renderRefineBadge === 'function') return window.renderRefineBadge(item);
}
