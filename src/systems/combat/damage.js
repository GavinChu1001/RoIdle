export function getTargetDamageBonus(stats) {
  if (typeof window.getTargetDamageBonus === 'function') return window.getTargetDamageBonus(stats);
  return 0;
}
export function normalizeDamage(value, options) {
  if (typeof window.normalizeDamage === 'function') return window.normalizeDamage(value, options);
  return 0;
}
export function sanitizeDamage(value, allowZero) {
  if (typeof window.sanitizeDamage === 'function') return window.sanitizeDamage(value, allowZero);
  return allowZero ? 0 : 1;
}
export { calculatePower } from '../equipment/itemScore.js';
