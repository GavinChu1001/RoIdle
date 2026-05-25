export function getEquipmentCardSlotCount(item) {
  if (typeof window.getEquipmentCardSlotCount === 'function') return window.getEquipmentCardSlotCount(item);
  return 0;
}
export function getMaxEquipmentCardSlots(item) {
  if (typeof window.getMaxEquipmentCardSlots === 'function') return window.getMaxEquipmentCardSlots(item);
  return 0;
}
export function getCardSocketCost(item) {
  if (typeof window.getCardSocketCost === 'function') return window.getCardSocketCost(item);
  return null;
}
export function canAffordSocketCost(cost) {
  if (typeof window.canAffordSocketCost === 'function') return window.canAffordSocketCost(cost);
  return false;
}
export function renderCardSocketSmithyPanel() {
  if (typeof window.renderCardSocketSmithyPanel === 'function') return window.renderCardSocketSmithyPanel();
  return '';
}
