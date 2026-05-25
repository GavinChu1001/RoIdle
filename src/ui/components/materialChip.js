export function renderOfflineMaterialChip(material, extraClass) {
  if (typeof window.renderOfflineMaterialChip === 'function') return window.renderOfflineMaterialChip(material, extraClass);
}
