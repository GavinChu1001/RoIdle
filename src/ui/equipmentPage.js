export function renderEquipment() {
  if (typeof window.renderEquipment === 'function') return window.renderEquipment();
}
export function renderEquipmentFilterBar(count) {
  if (typeof window.renderEquipmentFilterBar === 'function') return window.renderEquipmentFilterBar(count);
}
export function renderEquipmentBatchPanel() {
  if (typeof window.renderEquipmentBatchPanel === 'function') return window.renderEquipmentBatchPanel();
}
export function renderEquipmentStateBadges(item, equipped, nextStar) {
  if (typeof window.renderEquipmentStateBadges === 'function') return window.renderEquipmentStateBadges(item, equipped, nextStar);
}
export function renderEquipmentScores(item) {
  if (typeof window.renderEquipmentScores === 'function') return window.renderEquipmentScores(item);
}
export function renderEquipmentScoreComparison(item) {
  if (typeof window.renderEquipmentScoreComparison === 'function') return window.renderEquipmentScoreComparison(item);
}
export function renderEquipmentStatSections(item) {
  if (typeof window.renderEquipmentStatSections === 'function') return window.renderEquipmentStatSections(item);
}
export function renderEquipmentSetProgress(item) {
  if (typeof window.renderEquipmentSetProgress === 'function') return window.renderEquipmentSetProgress(item);
}
export function renderCardSocketSection(item) {
  if (typeof window.renderCardSocketSection === 'function') return window.renderCardSocketSection(item);
}
export function renderRefineSection(item, refineStats) {
  if (typeof window.renderRefineSection === 'function') return window.renderRefineSection(item, refineStats);
}
export function renderSalvagePreviewSection(item) {
  if (typeof window.renderSalvagePreviewSection === 'function') return window.renderSalvagePreviewSection(item);
}
export function renderStatChipGrid(entries, extraClass) {
  if (typeof window.renderStatChipGrid === 'function') return window.renderStatChipGrid(entries, extraClass);
}
export function renderRandomStatsPanel(item) {
  if (typeof window.renderRandomStatsPanel === 'function') return window.renderRandomStatsPanel(item);
}
export function renderEmpowerSection(item) {
  if (typeof window.renderEmpowerSection === 'function') return window.renderEmpowerSection(item);
}
