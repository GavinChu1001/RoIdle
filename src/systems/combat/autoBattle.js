export function ensureSettings() {
  if (typeof window.ensureSettings === 'function') return window.ensureSettings();
}
export function getAutoBossEnabled() {
  if (typeof window.getAutoBossEnabled === 'function') return window.getAutoBossEnabled();
  return false;
}
export function setAutoBossEnabled(enabled) {
  if (typeof window.setAutoBossEnabled === 'function') return window.setAutoBossEnabled(enabled);
}
export function toggleAutoBoss() {
  if (typeof window.toggleAutoBoss === 'function') return window.toggleAutoBoss();
}
