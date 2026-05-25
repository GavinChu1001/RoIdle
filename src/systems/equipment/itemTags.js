export function getEquipmentUsageTags(item, job) {
  if (typeof window.getEquipmentUsageTags === 'function') return window.getEquipmentUsageTags(item, job);
  return [];
}
export function isJobFocusedEquipment(stats, job) {
  if (typeof window.isJobFocusedEquipment === 'function') return window.isJobFocusedEquipment(stats, job);
  return false;
}
