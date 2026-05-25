export function compareEquipmentScores(newItem, currentItem, job) {
  if (typeof window.compareEquipmentScores === 'function') return window.compareEquipmentScores(newItem, currentItem, job);
  return {};
}
export function formatScoreDelta(value) {
  if (typeof window.formatScoreDelta === 'function') return window.formatScoreDelta(value);
  return '';
}
