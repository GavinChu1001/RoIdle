export function createItem(template, level, forcedTierId, context) {
  if (typeof window.createItem === 'function') return window.createItem(template, level, forcedTierId, context);
  return null;
}
export function normalizeItem(item) {
  if (typeof window.normalizeItem === 'function') return window.normalizeItem(item);
  if (!item) return item;
  item.enhanceLevel = item.enhanceLevel || 0;
  item.refine = item.refine || 0;
  item.specialPassives = Array.isArray(item.specialPassives) ? item.specialPassives : [];
  return item;
}
export function equipmentSlot(item) {
  if (typeof window.equipmentSlot === 'function') return window.equipmentSlot(item);
  return item?.slot || 'trinket';
}
