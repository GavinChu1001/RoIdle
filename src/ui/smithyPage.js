export function renderSmithyPage() {
  if (typeof window.renderSmithyPage === 'function') return window.renderSmithyPage();
}
export { renderEnhancePanel } from '../systems/equipment/refine.js';
export function renderStarRefineSmithyPanel() {
  if (typeof window.renderStarRefineSmithyPanel === 'function') return window.renderStarRefineSmithyPanel();
}
export { renderCardSocketSmithyPanel } from '../systems/equipment/socket.js';
export function renderSmithyMaterialGuide() {
  if (typeof window.renderSmithyMaterialGuide === 'function') return window.renderSmithyMaterialGuide();
}
export function renderDarkGoldExchangePanel() {
  if (typeof window.renderDarkGoldExchangePanel === 'function') return window.renderDarkGoldExchangePanel();
}
export function renderDarkGoldExchangeCard(entry, fragmentCount) {
  if (typeof window.renderDarkGoldExchangeCard === 'function') return window.renderDarkGoldExchangeCard(entry, fragmentCount);
}
export function renderEnhanceEffectText(item) {
  if (typeof window.renderEnhanceEffectText === 'function') return window.renderEnhanceEffectText(item);
}
export function renderSetTalentStatus() {
  if (typeof window.renderSetTalentStatus === 'function') return window.renderSetTalentStatus();
}
