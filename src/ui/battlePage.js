export function renderFormation() {
  if (typeof window.renderFormation === 'function') return window.renderFormation();
}
export function renderEncounterPanel() {
  if (typeof window.renderEncounterPanel === 'function') return window.renderEncounterPanel();
}
export function renderCombatLootFeed() {
  if (typeof window.renderCombatLootFeed === 'function') return window.renderCombatLootFeed();
}
export function renderCombatLootRow(item) {
  if (typeof window.renderCombatLootRow === 'function') return window.renderCombatLootRow(item);
}
export function renderCombatSidebar() {
  if (typeof window.renderCombatSidebar === 'function') return window.renderCombatSidebar();
}
