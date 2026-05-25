export function isAbyssEquipment(item = {}) {
  item = item && typeof item === 'object' ? item : {};
  return Boolean(item.abyssForged || item.sourceDifficulty === 'abyss' || item.prefix === '\u6df1\u6e0a');
}

export function getEquipmentDisplayName(item = {}) {
  item = item && typeof item === 'object' ? item : {};
  const baseName = item.name || item.templateName || '\u672a\u77e5\u88c5\u5907';
  if (isAbyssEquipment(item) && !baseName.startsWith('\u6df1\u6e0a ')) {
    return `\u6df1\u6e0a ${baseName}`;
  }
  return baseName;
}

export const getDisplayItemName = getEquipmentDisplayName;

export function renderItemName(item, extraText) {
  if (typeof window.renderItemName === 'function') return window.renderItemName(item, extraText);
  return '<span>' + getEquipmentDisplayName(item) + (extraText ? ' ' + extraText : '') + '</span>';
}
