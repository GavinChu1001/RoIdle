export function getCostumeEffects() {
  if (typeof window.getCostumeEffects === 'function') return window.getCostumeEffects();
  return {};
}
export function getTitleEffects() {
  if (typeof window.getTitleEffects === 'function') return window.getTitleEffects();
  return {};
}
export function getPassiveSkillTotals() {
  if (typeof window.getPassiveSkillTotals === 'function') return window.getPassiveSkillTotals();
  return {};
}
