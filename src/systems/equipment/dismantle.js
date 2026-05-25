export function salvageItem(id, options) {
  if (typeof window.salvageItem === 'function') return window.salvageItem(id, options);
  return { ok: false };
}
export function getSalvageRewards(item) {
  if (typeof window.getSalvageRewards === 'function') return window.getSalvageRewards(item);
  return {};
}
export function shouldAutoSalvage(item) {
  if (typeof window.shouldAutoSalvage === 'function') return window.shouldAutoSalvage(item);
  return false;
}
export function salvageAllUnequipped() {
  if (typeof window.salvageAllUnequipped === 'function') return window.salvageAllUnequipped();
}
export function addEquipmentToInventory(item, options) {
  if (typeof window.addEquipmentToInventory === 'function') return window.addEquipmentToInventory(item, options);
  return { added: false };
}
export function equipBest() {
  if (typeof window.equipBest === 'function') return window.equipBest();
}
